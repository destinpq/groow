import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Card,
  Row,
  Col,
  Input,
  Select,
  Slider,
  Checkbox,
  Button,
  Space,
  Typography,
  Divider,
  Collapse,
  Rate,
  Tag,
  Badge,
  Spin,
  message,
  AutoComplete,
  Tooltip,
  Switch,
  InputNumber,
  Dropdown,
  Menu,
  Radio,
} from 'antd';
import {
  SearchOutlined,
  FilterOutlined,
  ClearOutlined,
  StarOutlined,
  DollarOutlined,
  TagsOutlined,
  ShoppingOutlined,
  CheckCircleOutlined,
  TrendingUpOutlined,
  HeartOutlined,
  SwapOutlined,
  SortAscendingOutlined,
  AppstoreOutlined,
  UnorderedListOutlined,
  DownOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import { debounce } from 'lodash';
import { enhancedProductAPI, type AdvancedSearchFilters, type ProductSortOption, type SearchSuggestion } from '@/services/api/enhanced-product';
import { useErrorStore } from '@/store/error';

const { Title, Text } = Typography;
const { Panel } = Collapse;
const { Option } = Select;

interface AdvancedProductSearchProps {
  onFiltersChange: (filters: AdvancedSearchFilters) => void;
  onViewModeChange: (mode: 'grid' | 'list') => void;
  loading?: boolean;
  totalProducts?: number;
  initialFilters?: AdvancedSearchFilters;
}

const AdvancedProductSearch: React.FC<AdvancedProductSearchProps> = ({
  onFiltersChange,
  onViewModeChange,
  loading = false,
  totalProducts = 0,
  initialFilters = {},
}) => {
  const { useApiOperation } = useErrorStore();
  
  // State management
  const [filters, setFilters] = useState<AdvancedSearchFilters>(initialFilters);
  const [searchQuery, setSearchQuery] = useState(initialFilters.query || '');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [suggestionLoading, setSuggestionLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);
  const [expandedPanels, setExpandedPanels] = useState(['search', 'price', 'category']);

  // Search suggestions with debounce
  const fetchSuggestions = useApiOperation(
    useCallback(async (query: string) => {
      if (!query || query.length < 2) {
        setSuggestions([]);
        return;
      }
      
      setSuggestionLoading(true);
      try {
        const results = await enhancedProductAPI.getSearchSuggestions(query, 10);
        setSuggestions(results);
      } finally {
        setSuggestionLoading(false);
      }
    }, []),
    { showErrorMessage: false }
  );

  const debouncedFetchSuggestions = useMemo(
    () => debounce(fetchSuggestions, 300),
    [fetchSuggestions]
  );

  // Handle search input change
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    debouncedFetchSuggestions(value);
  };

  // Handle search submit
  const handleSearch = (value?: string) => {
    const query = value || searchQuery;
    updateFilter('query', query);
  };

  // Update individual filter
  const updateFilter = useCallback((key: keyof AdvancedSearchFilters, value: any) => {
    setFilters(prev => {
      const newFilters = {
        ...prev,
        [key]: value,
        page: key === 'query' || key === 'sortBy' ? 1 : prev.page, // Reset page for new searches/sorts
      };
      
      // Remove undefined/empty values
      Object.keys(newFilters).forEach(k => {
        const val = newFilters[k as keyof AdvancedSearchFilters];
        if (val === undefined || val === null || val === '' || (Array.isArray(val) && val.length === 0)) {
          delete newFilters[k as keyof AdvancedSearchFilters];
        }
      });
      
      onFiltersChange(newFilters);
      return newFilters;
    });
  }, [onFiltersChange]);

  // Clear all filters
  const clearAllFilters = () => {
    setFilters({});
    setSearchQuery('');
    onFiltersChange({});
  };

  // Count active filters
  useEffect(() => {
    const count = Object.keys(filters).filter(key => {
      const value = filters[key as keyof AdvancedSearchFilters];
      return value !== undefined && value !== null && value !== '' && 
             !(Array.isArray(value) && value.length === 0);
    }).length;
    setActiveFiltersCount(count);
  }, [filters]);

  // Handle view mode change
  const handleViewModeChange = (mode: 'grid' | 'list') => {
    setViewMode(mode);
    onViewModeChange(mode);
  };

  // Sort options
  const sortOptions: { value: ProductSortOption; label: string; icon?: React.ReactNode }[] = [
    { value: 'relevance', label: 'Relevance', icon: <SearchOutlined /> },
    { value: 'popularity', label: 'Popularity', icon: <TrendingUpOutlined /> },
    { value: 'newest', label: 'Newest First' },
    { value: 'price-low', label: 'Price: Low to High', icon: <SortAscendingOutlined /> },
    { value: 'price-high', label: 'Price: High to Low', icon: <SortAscendingOutlined /> },
    { value: 'rating', label: 'Highest Rated', icon: <StarOutlined /> },
    { value: 'reviews', label: 'Most Reviews' },
    { value: 'trending', label: 'Trending', icon: <TrendingUpOutlined /> },
    { value: 'bestsellers', label: 'Best Sellers', icon: <ShoppingOutlined /> },
    { value: 'featured', label: 'Featured' },
    { value: 'discount', label: 'Highest Discount', icon: <TagsOutlined /> },
  ];

  // Price range options
  const priceRanges = [
    { value: 'under-25', label: 'Under $25', min: 0, max: 25 },
    { value: '25-50', label: '$25 - $50', min: 25, max: 50 },
    { value: '50-100', label: '$50 - $100', min: 50, max: 100 },
    { value: '100-200', label: '$100 - $200', min: 100, max: 200 },
    { value: 'over-200', label: 'Over $200', min: 200, max: 1000 },
  ];

  // AutoComplete options for search
  const autoCompleteOptions = suggestions.map(suggestion => ({
    value: suggestion.text,
    label: (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Space>
          {suggestion.type === 'product' && <ShoppingOutlined />}
          {suggestion.type === 'category' && <TagsOutlined />}
          {suggestion.type === 'brand' && <CheckCircleOutlined />}
          {suggestion.type === 'keyword' && <SearchOutlined />}
          <span>{suggestion.text}</span>
        </Space>
        {suggestion.count && (
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {suggestion.count}
          </Text>
        )}
      </div>
    ),
  }));

  return (
    <Card style={{ marginBottom: 24 }}>
      {/* Main Search Bar */}
      <div style={{ marginBottom: 24 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col flex={1}>
            <AutoComplete
              size="large"
              placeholder="Search for products, brands, or categories..."
              value={searchQuery}
              onChange={handleSearchChange}
              onSelect={handleSearch}
              options={autoCompleteOptions}
              notFoundContent={suggestionLoading ? <Spin size="small" /> : null}
              style={{ width: '100%' }}
            >
              <Input
                prefix={<SearchOutlined />}
                suffix={
                  searchQuery && (
                    <Button
                      type="text"
                      size="small"
                      icon={<CloseOutlined />}
                      onClick={() => {
                        setSearchQuery('');
                        updateFilter('query', '');
                      }}
                    />
                  )
                }
                onPressEnter={() => handleSearch()}
              />
            </AutoComplete>
          </Col>
          <Col>
            <Button
              type="primary"
              size="large"
              icon={<SearchOutlined />}
              onClick={() => handleSearch()}
              loading={loading}
            >
              Search
            </Button>
          </Col>
        </Row>
      </div>

      {/* Toolbar */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Space>
            <Text type="secondary">
              {totalProducts > 0 ? `${totalProducts.toLocaleString()} products found` : 'Loading...'}
            </Text>
            {activeFiltersCount > 0 && (
              <Badge count={activeFiltersCount} size="small">
                <Button
                  size="small"
                  icon={<FilterOutlined />}
                  onClick={() => setExpandedPanels(prev => 
                    prev.length > 0 ? [] : ['search', 'price', 'category', 'brand', 'rating']
                  )}
                >
                  Filters
                </Button>
              </Badge>
            )}
            {activeFiltersCount > 0 && (
              <Button
                size="small"
                icon={<ClearOutlined />}
                onClick={clearAllFilters}
              >
                Clear All
              </Button>
            )}
          </Space>
        </Col>
        
        <Col>
          <Space>
            {/* Sort Dropdown */}
            <Select
              value={filters.sortBy || 'relevance'}
              onChange={(value) => updateFilter('sortBy', value)}
              style={{ minWidth: 150 }}
              placeholder="Sort by"
              suffixIcon={<DownOutlined />}
            >
              {sortOptions.map(option => (
                <Option key={option.value} value={option.value}>
                  <Space>
                    {option.icon}
                    {option.label}
                  </Space>
                </Option>
              ))}
            </Select>

            {/* View Mode Toggle */}
            <Button.Group>
              <Button
                icon={<AppstoreOutlined />}
                type={viewMode === 'grid' ? 'primary' : 'default'}
                onClick={() => handleViewModeChange('grid')}
              />
              <Button
                icon={<UnorderedListOutlined />}
                type={viewMode === 'list' ? 'primary' : 'default'}
                onClick={() => handleViewModeChange('list')}
              />
            </Button.Group>
          </Space>
        </Col>
      </Row>

      {/* Advanced Filters */}
      <Collapse
        activeKey={expandedPanels}
        onChange={(keys) => setExpandedPanels(Array.isArray(keys) ? keys : [keys])}
        ghost
        expandIconPosition="end"
      >
        {/* Price Range Filter */}
        <Panel
          header={
            <Space>
              <DollarOutlined style={{ color: '#52c41a' }} />
              <Text strong>Price Range</Text>
              {(filters.minPrice || filters.maxPrice || filters.priceRange) && (
                <Badge size="small" color="#52c41a" />
              )}
            </Space>
          }
          key="price"
        >
          <Space direction="vertical" style={{ width: '100%' }} size="middle">
            {/* Quick Price Range Buttons */}
            <div>
              <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>
                Quick Select:
              </Text>
              <Space wrap>
                {priceRanges.map(range => (
                  <Button
                    key={range.value}
                    size="small"
                    type={filters.priceRange === range.value ? 'primary' : 'default'}
                    onClick={() => {
                      updateFilter('priceRange', filters.priceRange === range.value ? undefined : range.value);
                      updateFilter('minPrice', filters.priceRange === range.value ? undefined : range.min);
                      updateFilter('maxPrice', filters.priceRange === range.value ? undefined : range.max);
                    }}
                  >
                    {range.label}
                  </Button>
                ))}
              </Space>
            </div>

            {/* Custom Price Range */}
            <div>
              <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>
                Custom Range:
              </Text>
              <Row gutter={8} align="middle">
                <Col flex={1}>
                  <InputNumber
                    placeholder="Min"
                    prefix="$"
                    min={0}
                    value={filters.minPrice}
                    onChange={(value) => updateFilter('minPrice', value)}
                    style={{ width: '100%' }}
                  />
                </Col>
                <Col>to</Col>
                <Col flex={1}>
                  <InputNumber
                    placeholder="Max"
                    prefix="$"
                    min={0}
                    value={filters.maxPrice}
                    onChange={(value) => updateFilter('maxPrice', value)}
                    style={{ width: '100%' }}
                  />
                </Col>
              </Row>
            </div>

            {/* On Sale Toggle */}
            <div>
              <Checkbox
                checked={filters.onSale}
                onChange={(e) => updateFilter('onSale', e.target.checked || undefined)}
              >
                <Space>
                  <TagsOutlined style={{ color: '#ff4d4f' }} />
                  On Sale Only
                </Space>
              </Checkbox>
            </div>
          </Space>
        </Panel>

        {/* Rating Filter */}
        <Panel
          header={
            <Space>
              <StarOutlined style={{ color: '#faad14' }} />
              <Text strong>Customer Rating</Text>
              {filters.minRating && <Badge size="small" color="#faad14" />}
            </Space>
          }
          key="rating"
        >
          <Space direction="vertical" style={{ width: '100%' }}>
            <Radio.Group
              value={filters.minRating}
              onChange={(e) => updateFilter('minRating', e.target.value)}
            >
              {[4, 3, 2, 1].map(rating => (
                <Radio key={rating} value={rating} style={{ display: 'block', marginBottom: 8 }}>
                  <Space>
                    <Rate disabled defaultValue={rating} />
                    <Text>& Up</Text>
                  </Space>
                </Radio>
              ))}
            </Radio.Group>
            
            <div style={{ marginTop: 16 }}>
              <Checkbox
                checked={!!filters.minReviews}
                onChange={(e) => updateFilter('minReviews', e.target.checked ? 10 : undefined)}
              >
                At least 10 reviews
              </Checkbox>
            </div>
          </Space>
        </Panel>

        {/* Availability Filter */}
        <Panel
          header={
            <Space>
              <CheckCircleOutlined style={{ color: '#1890ff' }} />
              <Text strong>Availability</Text>
              {(filters.inStock || filters.freeShipping || filters.fastDelivery) && (
                <Badge size="small" color="#1890ff" />
              )}
            </Space>
          }
          key="availability"
        >
          <Space direction="vertical">
            <Checkbox
              checked={filters.inStock}
              onChange={(e) => updateFilter('inStock', e.target.checked || undefined)}
            >
              In Stock Only
            </Checkbox>
            <Checkbox
              checked={filters.freeShipping}
              onChange={(e) => updateFilter('freeShipping', e.target.checked || undefined)}
            >
              Free Shipping
            </Checkbox>
            <Checkbox
              checked={filters.fastDelivery}
              onChange={(e) => updateFilter('fastDelivery', e.target.checked || undefined)}
            >
              Fast Delivery (1-2 Days)
            </Checkbox>
          </Space>
        </Panel>

        {/* Product Type Filter */}
        <Panel
          header={
            <Space>
              <ShoppingOutlined style={{ color: '#722ed1' }} />
              <Text strong>Product Type</Text>
              {(filters.isFeatured || filters.trending || filters.isDigital) && (
                <Badge size="small" color="#722ed1" />
              )}
            </Space>
          }
          key="type"
        >
          <Space direction="vertical">
            <Checkbox
              checked={filters.isFeatured}
              onChange={(e) => updateFilter('isFeatured', e.target.checked || undefined)}
            >
              <Space>
                <StarOutlined />
                Featured Products
              </Space>
            </Checkbox>
            <Checkbox
              checked={filters.trending}
              onChange={(e) => updateFilter('trending', e.target.checked || undefined)}
            >
              <Space>
                <TrendingUpOutlined />
                Trending Now
              </Space>
            </Checkbox>
            <Checkbox
              checked={filters.isDigital}
              onChange={(e) => updateFilter('isDigital', e.target.checked || undefined)}
            >
              Digital Products Only
            </Checkbox>
            <Checkbox
              checked={filters.hasVideos}
              onChange={(e) => updateFilter('hasVideos', e.target.checked || undefined)}
            >
              Has Product Videos
            </Checkbox>
          </Space>
        </Panel>
      </Collapse>

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <div style={{ marginTop: 16, padding: 16, backgroundColor: '#fafafa', borderRadius: 6 }}>
          <Text strong style={{ marginBottom: 8, display: 'block' }}>
            Active Filters ({activeFiltersCount}):
          </Text>
          <Space wrap>
            {filters.query && (
              <Tag
                closable
                onClose={() => updateFilter('query', undefined)}
                color="blue"
              >
                Search: {filters.query}
              </Tag>
            )}
            {filters.priceRange && (
              <Tag
                closable
                onClose={() => {
                  updateFilter('priceRange', undefined);
                  updateFilter('minPrice', undefined);
                  updateFilter('maxPrice', undefined);
                }}
                color="green"
              >
                {priceRanges.find(r => r.value === filters.priceRange)?.label}
              </Tag>
            )}
            {(filters.minPrice || filters.maxPrice) && !filters.priceRange && (
              <Tag
                closable
                onClose={() => {
                  updateFilter('minPrice', undefined);
                  updateFilter('maxPrice', undefined);
                }}
                color="green"
              >
                ${filters.minPrice || 0} - ${filters.maxPrice || '∞'}
              </Tag>
            )}
            {filters.minRating && (
              <Tag
                closable
                onClose={() => updateFilter('minRating', undefined)}
                color="orange"
              >
                {filters.minRating}+ Stars
              </Tag>
            )}
            {filters.onSale && (
              <Tag
                closable
                onClose={() => updateFilter('onSale', undefined)}
                color="red"
              >
                On Sale
              </Tag>
            )}
            {filters.inStock && (
              <Tag
                closable
                onClose={() => updateFilter('inStock', undefined)}
                color="cyan"
              >
                In Stock
              </Tag>
            )}
            {filters.freeShipping && (
              <Tag
                closable
                onClose={() => updateFilter('freeShipping', undefined)}
                color="cyan"
              >
                Free Shipping
              </Tag>
            )}
            {filters.isFeatured && (
              <Tag
                closable
                onClose={() => updateFilter('isFeatured', undefined)}
                color="purple"
              >
                Featured
              </Tag>
            )}
            {filters.trending && (
              <Tag
                closable
                onClose={() => updateFilter('trending', undefined)}
                color="purple"
              >
                Trending
              </Tag>
            )}
          </Space>
        </div>
      )}
    </Card>
  );
};

export default AdvancedProductSearch;