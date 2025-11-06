import React from 'react';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const { Search } = Input;

interface ProductSearchProps {
  onSearch: (value: string) => void;
  loading?: boolean;
  placeholder?: string;
}

const ProductSearch: React.FC<ProductSearchProps> = ({
  onSearch,
  loading = false,
  placeholder = "Search products..."
}) => {
  return (
    <Search
      placeholder={placeholder}
      allowClear
      enterButton={<SearchOutlined />}
      size="large"
      onSearch={onSearch}
      loading={loading}
    />
  );
};

export default ProductSearch;