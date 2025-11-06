import React from 'react';
import { Typography } from 'antd';

const { Title, Text } = Typography;

interface ProductHeaderProps {
  total: number;
  currentPage: number;
  pageSize: number;
}

const ProductHeader: React.FC<ProductHeaderProps> = ({
  total,
  currentPage,
  pageSize
}) => {
  const startItem = ((currentPage - 1) * pageSize) + 1;
  const endItem = Math.min(currentPage * pageSize, total);

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={2}>Products</Title>
        <Text type="secondary">Discover our amazing collection of products</Text>
      </div>
      
      <div style={{ marginBottom: 16 }}>
        <Text type="secondary">
          Showing {startItem}-{endItem} of {total} products
        </Text>
      </div>
    </div>
  );
};

export default ProductHeader;