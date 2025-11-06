import React from 'react';
import { Row, Col, Spin } from 'antd';
import ProductCard, { type Product } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  wishlist: string[];
  loading?: boolean;
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  onView: (productId: number) => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  wishlist,
  loading = false,
  onAddToCart,
  onToggleWishlist,
  onView
}) => {
  return (
    <Spin spinning={loading}>
      <Row gutter={[16, 16]}>
        {products.map(product => {
          const isInWishlist = wishlist.includes(product.id.toString());
          
          return (
            <Col key={product.id} xs={24} sm={12} md={8} lg={6}>
              <ProductCard
                product={product}
                isInWishlist={isInWishlist}
                onAddToCart={onAddToCart}
                onToggleWishlist={onToggleWishlist}
                onView={onView}
              />
            </Col>
          );
        })}
      </Row>
    </Spin>
  );
};

export default ProductGrid;