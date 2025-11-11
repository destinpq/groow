import React, { useState, useCallback, useEffect } from 'react';
import { AutoComplete, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import type { AutoCompleteProps } from 'antd';
import { debounce } from 'lodash';
import { productAPI, categoriesAPI, brandsAPI } from '@/services/api';
import type { Product, Category, Brand } from '@/services/api';

interface SearchResult {
  value: string;
  label: React.ReactNode;
  type: 'product' | 'category' | 'brand' | 'keyword';
  data?: any;
}

interface SmartSearchAutocompleteProps {
  onSearch?: (value: string) => void;
  onSelect?: (value: string, option: SearchResult) => void;
  placeholder?: string;
  size?: 'small' | 'middle' | 'large';
  style?: React.CSSProperties;
}

const SmartSearchAutocomplete: React.FC<SmartSearchAutocompleteProps> = ({
  onSearch,
  onSelect,
  placeholder = 'Search products, brands, or categories...',
  size = 'large',
  style,
}) => {
  const [options, setOptions] = useState<SearchResult[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    // Load recent searches from localStorage
    const saved = localStorage.getItem('recentSearches');
    return saved ? JSON.parse(saved) : ['wireless headphones', 'laptop stand', 'gaming keyboard'];
  });

  // Load categories and brands on component mount
  useEffect(() => {
    const loadStaticData = async () => {
      try {
        const [categoriesResponse, brandsResponse] = await Promise.all([
          categoriesAPI.getAll(),
          brandsAPI.getAll()
        ]);
        setCategories(categoriesResponse || []);
        setBrands(brandsResponse || []);
      } catch (error) {
        console.error('Failed to load categories and brands:', error);
      }
    };

    loadStaticData();
  }, []);

  // Save recent searches to localStorage when they change
  useEffect(() => {
    localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
  }, [recentSearches]);

  const searchData = useCallback(async (query: string): Promise<SearchResult[]> => {
    if (!query || query.length < 2) {
      // Show recent searches when no query
      return recentSearches.map(search => ({
        value: search,
        label: (
          <div style={{ display: 'flex', alignItems: 'center', padding: '4px 0' }}>
            <SearchOutlined style={{ marginRight: 8, color: '#8c8c8c' }} />
            <span>{search}</span>
          </div>
        ),
        type: 'keyword' as const,
      }));
    }

    setLoading(true);
    const results: SearchResult[] = [];

    try {
      // Search products using the API
      const productResponse = await productAPI.getProducts({
        search: query,
        limit: 5,
        page: 1
      });
      
      const matchingProducts = productResponse.data?.items || [];
      matchingProducts.forEach((product: Product) => {
        results.push({
          value: product.name,
          label: (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 0' }}>
              <div>
                <div style={{ fontWeight: 500 }}>{product.name}</div>
                <div style={{ fontSize: 12, color: '#8c8c8c' }}>
                  in {product.category?.name || 'Uncategorized'} • {product.brand?.name || 'No Brand'}
                </div>
              </div>
              <div style={{ fontWeight: 600, color: '#ff9900' }}>
                ${product.price}
              </div>
            </div>
          ),
          type: 'product',
          data: product,
        });
      });

      // Search categories
      const lowerQuery = query.toLowerCase();
      const matchingCategories = categories.filter(cat =>
        cat.name.toLowerCase().includes(lowerQuery)
      );

      matchingCategories.slice(0, 3).forEach(category => {
        results.push({
          value: category.name,
          label: (
            <div style={{ padding: '4px 0' }}>
              <span style={{ fontWeight: 500 }}>Category: </span>
              <span>{category.name}</span>
              {category.description && (
                <div style={{ fontSize: 12, color: '#8c8c8c' }}>{category.description}</div>
              )}
            </div>
          ),
          type: 'category',
          data: category,
        });
      });

      // Search brands
      const matchingBrands = brands.filter(brand =>
        brand.name.toLowerCase().includes(lowerQuery)
      );

      matchingBrands.slice(0, 3).forEach(brand => {
        results.push({
          value: brand.name,
          label: (
            <div style={{ padding: '4px 0' }}>
              <span style={{ fontWeight: 500 }}>Brand: </span>
              <span>{brand.name}</span>
              {brand.description && (
                <div style={{ fontSize: 12, color: '#8c8c8c' }}>{brand.description}</div>
              )}
            </div>
          ),
          type: 'brand',
          data: brand,
        });
      });

    } catch (error) {
      console.error('Search failed:', error);
      // Fallback to showing recent searches on error
      return recentSearches.map(search => ({
        value: search,
        label: (
          <div style={{ display: 'flex', alignItems: 'center', padding: '4px 0' }}>
            <SearchOutlined style={{ marginRight: 8, color: '#8c8c8c' }} />
            <span>{search}</span>
          </div>
        ),
        type: 'keyword' as const,
      }));
    } finally {
      setLoading(false);
    }

    return results;
  }, [recentSearches, categories, brands]);

  const debouncedSearch = useCallback(
    debounce(async (value: string) => {
      const results = await searchData(value);
      setOptions(results);
    }, 300),
    [searchData]
  );

  const handleSearch = (value: string) => {
    setSearchValue(value);
    debouncedSearch(value);
  };

  const handleSelect = (value: string, option: any) => {
    // Add to recent searches
    if (!recentSearches.includes(value)) {
      setRecentSearches([value, ...recentSearches.slice(0, 4)]);
    }

    if (onSelect) {
      onSelect(value, option);
    }

    if (onSearch) {
      onSearch(value);
    }
  };

  const handlePressEnter = () => {
    if (searchValue && onSearch) {
      onSearch(searchValue);
      // Add to recent searches
      if (!recentSearches.includes(searchValue)) {
        setRecentSearches([searchValue, ...recentSearches.slice(0, 4)]);
      }
    }
  };

  const optionsWithGroups: AutoCompleteProps['options'] = [];
  
  const productResults = options.filter(o => o.type === 'product');
  const categoryResults = options.filter(o => o.type === 'category');
  const brandResults = options.filter(o => o.type === 'brand');
  const keywordResults = options.filter(o => o.type === 'keyword');

  if (keywordResults.length > 0) {
    optionsWithGroups.push({
      label: <div style={{ fontWeight: 600, color: '#8c8c8c', padding: '4px 0' }}>Recent Searches</div>,
      options: keywordResults,
    });
  }

  if (productResults.length > 0) {
    optionsWithGroups.push({
      label: <div style={{ fontWeight: 600, color: '#8c8c8c', padding: '4px 0' }}>Products</div>,
      options: productResults,
    });
  }

  if (categoryResults.length > 0) {
    optionsWithGroups.push({
      label: <div style={{ fontWeight: 600, color: '#8c8c8c', padding: '4px 0' }}>Categories</div>,
      options: categoryResults,
    });
  }

  if (brandResults.length > 0) {
    optionsWithGroups.push({
      label: <div style={{ fontWeight: 600, color: '#8c8c8c', padding: '4px 0' }}>Brands</div>,
      options: brandResults,
    });
  }

  return (
    <AutoComplete
      value={searchValue}
      options={optionsWithGroups}
      onSearch={handleSearch}
      onSelect={handleSelect}
      style={{ width: '100%', ...style }}
      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
    >
      <Input
        size={size}
        placeholder={placeholder}
        prefix={<SearchOutlined />}
        allowClear
        onPressEnter={handlePressEnter}
      />
    </AutoComplete>
  );
};

export default SmartSearchAutocomplete;
