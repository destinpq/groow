import React, { useState, useCallback } from 'react';
import { AutoComplete, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import type { AutoCompleteProps } from 'antd';
import { debounce } from 'lodash';

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

// Mock data - in real app, this would come from API
const mockProducts = [
  { id: 1, name: 'Wireless Bluetooth Headphones', category: 'Electronics', brand: 'AudioTech', price: 89.99 },
  { id: 2, name: 'Smart Watch Pro', category: 'Electronics', brand: 'TechWear', price: 199.99 },
  { id: 3, name: 'USB-C Hub 7-in-1', category: 'Accessories', brand: 'ConnectPlus', price: 45.99 },
  { id: 4, name: 'Wireless Mouse Ergonomic', category: 'Accessories', brand: 'ClickMaster', price: 24.99 },
  { id: 5, name: 'Mechanical Keyboard RGB', category: 'Accessories', brand: 'GameKeys', price: 79.99 },
  { id: 6, name: 'Laptop Stand Aluminum', category: 'Accessories', brand: 'DeskPro', price: 34.99 },
  { id: 7, name: 'Bluetooth Speaker Portable', category: 'Electronics', brand: 'SoundWave', price: 59.99 },
  { id: 8, name: 'Wireless Earbuds Pro', category: 'Electronics', brand: 'AudioTech', price: 129.99 },
];

const mockCategories = ['Electronics', 'Accessories', 'Home & Garden', 'Fashion', 'Sports', 'Books'];
const mockBrands = ['AudioTech', 'TechWear', 'ConnectPlus', 'ClickMaster', 'GameKeys', 'DeskPro', 'SoundWave'];

const SmartSearchAutocomplete: React.FC<SmartSearchAutocompleteProps> = ({
  onSearch,
  onSelect,
  placeholder = 'Search products, brands, or categories...',
  size = 'large',
  style,
}) => {
  const [options, setOptions] = useState<SearchResult[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'wireless headphones',
    'laptop stand',
    'gaming keyboard',
  ]);

  const searchData = useCallback((query: string): SearchResult[] => {
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

    const lowerQuery = query.toLowerCase();
    const results: SearchResult[] = [];

    // Search products
    const matchingProducts = mockProducts.filter(
      product =>
        product.name.toLowerCase().includes(lowerQuery) ||
        product.brand.toLowerCase().includes(lowerQuery) ||
        product.category.toLowerCase().includes(lowerQuery)
    );

    matchingProducts.slice(0, 5).forEach(product => {
      results.push({
        value: product.name,
        label: (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 0' }}>
            <div>
              <div style={{ fontWeight: 500 }}>{product.name}</div>
              <div style={{ fontSize: 12, color: '#8c8c8c' }}>
                in {product.category} • {product.brand}
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
    const matchingCategories = mockCategories.filter(cat =>
      cat.toLowerCase().includes(lowerQuery)
    );

    matchingCategories.slice(0, 3).forEach(category => {
      results.push({
        value: category,
        label: (
          <div style={{ padding: '4px 0' }}>
            <span style={{ fontWeight: 500 }}>Category: </span>
            <span>{category}</span>
          </div>
        ),
        type: 'category',
      });
    });

    // Search brands
    const matchingBrands = mockBrands.filter(brand =>
      brand.toLowerCase().includes(lowerQuery)
    );

    matchingBrands.slice(0, 3).forEach(brand => {
      results.push({
        value: brand,
        label: (
          <div style={{ padding: '4px 0' }}>
            <span style={{ fontWeight: 500 }}>Brand: </span>
            <span>{brand}</span>
          </div>
        ),
        type: 'brand',
      });
    });

    return results;
  }, [recentSearches]);

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      const results = searchData(value);
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
