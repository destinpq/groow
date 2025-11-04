import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Input,
  Space,
  Button,
  Select,
  Checkbox,
  Slider,
  Tag,
  Divider,
  Collapse,
  Badge,
  List,
  Empty,
  Spin,
} from 'antd';
import {
  SearchOutlined,
  FilterOutlined,
  AppstoreOutlined,
  UnorderedListOutlined,
  HeartOutlined,
  ShoppingCartOutlined,
  StarFilled,
  CloseOutlined,
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { Panel } = Collapse;

interface Product {
  id: number;
  name: string;
  category: string;
  brand: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  inStock: boolean;
  image: string;
  tags: string[];
}

interface FilterState {
  categories: string[];
  brands: string[];
  priceRange: [number, number];
  rating: number;
  inStock: boolean;
  tags: string[];
}

const mockProducts: Product[] = [
  {
    id: 1,
    name: 'Wireless Headphones Pro',
    category: 'Electronics',
    brand: 'TechBrand',
    price: 99,
    originalPrice: 149,
    rating: 4.5,
    reviews: 234,
    inStock: true,
    image: '',
    tags: ['Bestseller', 'Sale', 'New'],
  },
  {
    id: 2,
    name: 'Smart Watch Series 5',
    category: 'Electronics',
    brand: 'SmartTech',
    price: 299,
    originalPrice: 399,
    rating: 4.8,
    reviews: 567,
    inStock: true,
    image: '',
    tags: ['Premium', 'Bestseller'],
  },
  {
    id: 3,
    name: 'Ergonomic Office Chair',
    category: 'Furniture',
    brand: 'ComfortPlus',
    price: 449,
    originalPrice: 549,
    rating: 4.3,
    reviews: 123,
    inStock: true,
    image: '',
    tags: ['Popular'],
  },
  {
    id: 4,
    name: 'Leather Jacket',
    category: 'Fashion',
    brand: 'StyleCo',
    price: 299,
    originalPrice: 399,
    rating: 4.6,
    reviews: 89,
    inStock: false,
    image: '',
    tags: ['New', 'Limited'],
  },
  {
    id: 5,
    name: 'Gaming Mouse RGB',
    category: 'Electronics',
    brand: 'GameTech',
    price: 59,
    originalPrice: 79,
    rating: 4.7,
    reviews: 345,
    inStock: true,
    image: '',
    tags: ['Sale', 'Gaming'],
  },
  {
    id: 6,
    name: 'Yoga Mat Premium',
    category: 'Sports',
    brand: 'FitLife',
    price: 39,
    originalPrice: 49,
    rating: 4.4,
    reviews: 156,
    inStock: true,
    image: '',
    tags: ['Eco-Friendly', 'Popular'],
  },
];

const categories = ['Electronics', 'Fashion', 'Furniture', 'Sports', 'Home & Garden'];
const brands = ['TechBrand', 'SmartTech', 'ComfortPlus', 'StyleCo', 'GameTech', 'FitLife'];
const tags = ['Bestseller', 'Sale', 'New', 'Premium', 'Popular', 'Gaming', 'Eco-Friendly', 'Limited'];

const AdvancedSearchPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<string>('relevance');
  const [loading, setLoading] = useState<boolean>(false);
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    brands: [],
    priceRange: [0, 1000],
    rating: 0,
    inStock: false,
    tags: [],
  });
  const [activeFiltersCount, setActiveFiltersCount] = useState<number>(0);

  const handleSearch = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  const handleCategoryChange = (checkedValues: any) => {
    setFilters({ ...filters, categories: checkedValues });
    updateActiveFiltersCount({ ...filters, categories: checkedValues });
  };

  const handleBrandChange = (checkedValues: any) => {
    setFilters({ ...filters, brands: checkedValues });
    updateActiveFiltersCount({ ...filters, brands: checkedValues });
  };

  const handlePriceChange = (value: [number, number]) => {
    setFilters({ ...filters, priceRange: value });
    updateActiveFiltersCount({ ...filters, priceRange: value });
  };

  const handleRatingChange = (value: number) => {
    setFilters({ ...filters, rating: value });
    updateActiveFiltersCount({ ...filters, rating: value });
  };

  const handleTagChange = (checkedValues: any) => {
    setFilters({ ...filters, tags: checkedValues });
    updateActiveFiltersCount({ ...filters, tags: checkedValues });
  };

  const handleClearFilters = () => {
    setFilters({
      categories: [],
      brands: [],
      priceRange: [0, 1000],
      rating: 0,
      inStock: false,
      tags: [],
    });
    setActiveFiltersCount(0);
  };

  const updateActiveFiltersCount = (currentFilters: FilterState) => {
    let count = 0;
    if (currentFilters.categories.length > 0) count++;
    if (currentFilters.brands.length > 0) count++;
    if (currentFilters.priceRange[0] > 0 || currentFilters.priceRange[1] < 1000) count++;
    if (currentFilters.rating > 0) count++;
    if (currentFilters.inStock) count++;
    if (currentFilters.tags.length > 0) count++;
    setActiveFiltersCount(count);
  };

  const filterProducts = (products: Product[]): Product[] => {
    return products.filter((product) => {
      // Search query
      if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      // Category filter
      if (filters.categories.length > 0 && !filters.categories.includes(product.category)) {
        return false;
      }

      // Brand filter
      if (filters.brands.length > 0 && !filters.brands.includes(product.brand)) {
        return false;
      }

      // Price range filter
      if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
        return false;
      }

      // Rating filter
      if (filters.rating > 0 && product.rating < filters.rating) {
        return false;
      }

      // In stock filter
      if (filters.inStock && !product.inStock) {
        return false;
      }

      // Tags filter
      if (filters.tags.length > 0) {
        const hasTag = filters.tags.some((tag) => product.tags.includes(tag));
        if (!hasTag) return false;
      }

      return true;
    });
  };

  const sortProducts = (products: Product[]): Product[] => {
    const sorted = [...products];
    switch (sortBy) {
      case 'price-low':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-high':
        return sorted.sort((a, b) => b.price - a.price);
      case 'rating':
        return sorted.sort((a, b) => b.rating - a.rating);
      case 'reviews':
        return sorted.sort((a, b) => b.reviews - a.reviews);
      case 'name':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      default:
        return sorted;
    }
  };

  const filteredProducts = sortProducts(filterProducts(mockProducts));

  const ProductCard: React.FC<{ product: Product }> = ({ product }) => (
    <Card
      hoverable
      style={{ height: '100%' }}
      cover={
        <div
          style={{
            height: 200,
            background: '#f0f0f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          {product.tags.length > 0 && (
            <div style={{ position: 'absolute', top: 8, left: 8 }}>
              {product.tags.slice(0, 2).map((tag, idx) => (
                <Tag
                  key={idx}
                  color={tag === 'Sale' ? 'red' : tag === 'New' ? 'green' : 'blue'}
                  style={{ marginBottom: 4 }}
                >
                  {tag}
                </Tag>
              ))}
            </div>
          )}
          <Text type="secondary">Product Image</Text>
        </div>
      }
      actions={[
        <HeartOutlined key="wishlist" />,
        <ShoppingCartOutlined key="cart" />,
      ]}
    >
      <Card.Meta
        title={<Text ellipsis>{product.name}</Text>}
        description={
          <Space direction="vertical" size="small" style={{ width: '100%' }}>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {product.brand} • {product.category}
            </Text>
            <Space>
              <StarFilled style={{ color: '#faad14', fontSize: 12 }} />
              <Text style={{ fontSize: 12 }}>
                {product.rating} ({product.reviews})
              </Text>
            </Space>
            <Space>
              <Text strong style={{ fontSize: 18, color: '#ff4d4f' }}>
                ${product.price}
              </Text>
              {product.originalPrice > product.price && (
                <Text delete type="secondary" style={{ fontSize: 12 }}>
                  ${product.originalPrice}
                </Text>
              )}
            </Space>
            {!product.inStock && (
              <Tag color="red" style={{ fontSize: 11 }}>
                Out of Stock
              </Tag>
            )}
          </Space>
        }
      />
    </Card>
  );

  const ProductListItem: React.FC<{ product: Product }> = ({ product }) => (
    <List.Item
      actions={[
        <Button key="wishlist" icon={<HeartOutlined />}>
          Wishlist
        </Button>,
        <Button key="cart" type="primary" icon={<ShoppingCartOutlined />} disabled={!product.inStock}>
          Add to Cart
        </Button>,
      ]}
    >
      <List.Item.Meta
        avatar={
          <div
            style={{
              width: 100,
              height: 100,
              background: '#f0f0f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text type="secondary" style={{ fontSize: 11 }}>Image</Text>
          </div>
        }
        title={
          <Space>
            <Text strong>{product.name}</Text>
            {product.tags.map((tag, idx) => (
              <Tag
                key={idx}
                color={tag === 'Sale' ? 'red' : tag === 'New' ? 'green' : 'blue'}
                style={{ fontSize: 10 }}
              >
                {tag}
              </Tag>
            ))}
          </Space>
        }
        description={
          <Space direction="vertical" size="small">
            <Text type="secondary">
              {product.brand} • {product.category}
            </Text>
            <Space>
              <StarFilled style={{ color: '#faad14' }} />
              <Text>
                {product.rating} ({product.reviews} reviews)
              </Text>
            </Space>
            <Space>
              <Text strong style={{ fontSize: 20, color: '#ff4d4f' }}>
                ${product.price}
              </Text>
              {product.originalPrice > product.price && (
                <Text delete type="secondary">
                  ${product.originalPrice}
                </Text>
              )}
              {product.originalPrice > product.price && (
                <Tag color="red">
                  {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                </Tag>
              )}
            </Space>
            {!product.inStock && (
              <Tag color="red">Out of Stock</Tag>
            )}
          </Space>
        }
      />
    </List.Item>
  );

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={3}>
          <SearchOutlined style={{ color: '#1890ff' }} /> Advanced Search
        </Title>
        <Paragraph type="secondary">
          Search products with advanced filters and faceted navigation
        </Paragraph>
      </div>

      <Row gutter={24}>
        {/* Filters Sidebar */}
        <Col xs={24} lg={6}>
          <Card
            title={
              <Space>
                <FilterOutlined />
                <Text>Filters</Text>
                {activeFiltersCount > 0 && <Badge count={activeFiltersCount} />}
              </Space>
            }
            extra={
              activeFiltersCount > 0 && (
                <Button
                  type="link"
                  size="small"
                  icon={<CloseOutlined />}
                  onClick={handleClearFilters}
                >
                  Clear All
                </Button>
              )
            }
          >
            <Collapse
              defaultActiveKey={['category', 'price', 'rating']}
              ghost
              expandIconPosition="end"
            >
              <Panel header="Category" key="category">
                <Checkbox.Group
                  style={{ display: 'flex', flexDirection: 'column' }}
                  value={filters.categories}
                  onChange={handleCategoryChange}
                >
                  {categories.map((category) => (
                    <Checkbox key={category} value={category} style={{ marginBottom: 8 }}>
                      {category}
                    </Checkbox>
                  ))}
                </Checkbox.Group>
              </Panel>

              <Panel header="Brand" key="brand">
                <Checkbox.Group
                  style={{ display: 'flex', flexDirection: 'column' }}
                  value={filters.brands}
                  onChange={handleBrandChange}
                >
                  {brands.map((brand) => (
                    <Checkbox key={brand} value={brand} style={{ marginBottom: 8 }}>
                      {brand}
                    </Checkbox>
                  ))}
                </Checkbox.Group>
              </Panel>

              <Panel header="Price Range" key="price">
                <Slider
                  range
                  min={0}
                  max={1000}
                  step={10}
                  value={filters.priceRange}
                  onChange={(value) => handlePriceChange(value as [number, number])}
                  tooltip={{ formatter: (value) => `$${value}` }}
                />
                <Space style={{ width: '100%', justifyContent: 'space-between', marginTop: 8 }}>
                  <Text>${filters.priceRange[0]}</Text>
                  <Text>${filters.priceRange[1]}</Text>
                </Space>
              </Panel>

              <Panel header="Rating" key="rating">
                <Space direction="vertical" style={{ width: '100%' }}>
                  {[4, 3, 2, 1].map((rating) => (
                    <Button
                      key={rating}
                      type={filters.rating === rating ? 'primary' : 'default'}
                      size="small"
                      block
                      onClick={() => handleRatingChange(rating)}
                      style={{ textAlign: 'left' }}
                    >
                      <Space>
                        {[...Array(rating)].map((_, i) => (
                          <StarFilled key={i} style={{ color: '#faad14', fontSize: 12 }} />
                        ))}
                        <Text>& Up</Text>
                      </Space>
                    </Button>
                  ))}
                  {filters.rating > 0 && (
                    <Button size="small" block onClick={() => handleRatingChange(0)}>
                      Clear Rating
                    </Button>
                  )}
                </Space>
              </Panel>

              <Panel header="Tags" key="tags">
                <Checkbox.Group
                  style={{ display: 'flex', flexDirection: 'column' }}
                  value={filters.tags}
                  onChange={handleTagChange}
                >
                  {tags.map((tag) => (
                    <Checkbox key={tag} value={tag} style={{ marginBottom: 8 }}>
                      {tag}
                    </Checkbox>
                  ))}
                </Checkbox.Group>
              </Panel>

              <Panel header="Availability" key="availability">
                <Checkbox
                  checked={filters.inStock}
                  onChange={(e) => {
                    const newFilters = { ...filters, inStock: e.target.checked };
                    setFilters(newFilters);
                    updateActiveFiltersCount(newFilters);
                  }}
                >
                  In Stock Only
                </Checkbox>
              </Panel>
            </Collapse>
          </Card>
        </Col>

        {/* Products Section */}
        <Col xs={24} lg={18}>
          <Card>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              {/* Search Bar */}
              <Input
                size="large"
                placeholder="Search products..."
                prefix={<SearchOutlined />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onPressEnter={handleSearch}
                allowClear
              />

              <Divider style={{ margin: 0 }} />

              {/* Toolbar */}
              <Row justify="space-between" align="middle">
                <Col>
                  <Text type="secondary">
                    {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
                  </Text>
                </Col>
                <Col>
                  <Space>
                    <Text type="secondary">Sort by:</Text>
                    <Select value={sortBy} onChange={setSortBy} style={{ width: 150 }}>
                      <Select.Option value="relevance">Relevance</Select.Option>
                      <Select.Option value="price-low">Price: Low to High</Select.Option>
                      <Select.Option value="price-high">Price: High to Low</Select.Option>
                      <Select.Option value="rating">Rating</Select.Option>
                      <Select.Option value="reviews">Most Reviews</Select.Option>
                      <Select.Option value="name">Name</Select.Option>
                    </Select>
                    <Button.Group>
                      <Button
                        icon={<AppstoreOutlined />}
                        type={viewMode === 'grid' ? 'primary' : 'default'}
                        onClick={() => setViewMode('grid')}
                      />
                      <Button
                        icon={<UnorderedListOutlined />}
                        type={viewMode === 'list' ? 'primary' : 'default'}
                        onClick={() => setViewMode('list')}
                      />
                    </Button.Group>
                  </Space>
                </Col>
              </Row>

              {/* Results */}
              <Spin spinning={loading}>
                {filteredProducts.length === 0 ? (
                  <Empty description="No products found" />
                ) : viewMode === 'grid' ? (
                  <Row gutter={[16, 16]}>
                    {filteredProducts.map((product) => (
                      <Col key={product.id} xs={24} sm={12} md={8}>
                        <ProductCard product={product} />
                      </Col>
                    ))}
                  </Row>
                ) : (
                  <List
                    dataSource={filteredProducts}
                    renderItem={(product) => <ProductListItem product={product} />}
                  />
                )}
              </Spin>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdvancedSearchPage;
