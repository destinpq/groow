import React from 'react';
import { Card, Rate, Button, Typography, Image } from 'antd';
import { HeartOutlined, HeartFilled, ShoppingCartOutlined, EyeOutlined } from '@ant-design/icons';
import type { Product } from '@/services/api/productAPI';

const { Text } = Typography;

interface ProductCardProps {
  product: Product;
  isInWishlist: boolean;
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  onView: (productId: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isInWishlist,
  onAddToCart,
  onToggleWishlist,
  onView
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  return (
    <Card
      hoverable
      cover={
        <div 
          style={{ position: 'relative', cursor: 'pointer' }}
          onClick={() => onView(product.id)}
        >
          <Image
            src={product.images?.[0] || '/api/placeholder/300/300'}
            alt={product.name}
            style={{ width: '100%', height: 200, objectFit: 'cover' }}
            preview={false}
          />
          <div style={{ position: 'absolute', top: 8, left: 8 }}>
            <Button
              type="text"
              shape="circle"
              icon={isInWishlist ? <HeartFilled style={{ color: '#f5222d' }} /> : <HeartOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                onToggleWishlist(product);
              }}
              style={{ backgroundColor: 'rgba(255,255,255,0.9)' }}
            />
          </div>
          {!product.inStock && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Text style={{ color: 'white', fontWeight: 'bold' }}>Out of Stock</Text>
            </div>
          )}
        </div>
      }
      actions={[
        <Button
          key="cart"
          type="primary"
          icon={<ShoppingCartOutlined />}
          onClick={() => onAddToCart(product)}
          disabled={!product.inStock}
          style={{ margin: '0 8px' }}
        >
          Add to Cart
        </Button>,
        <Button
          key="view"
          icon={<EyeOutlined />}
          onClick={() => onView(product.id)}
        >
          View Details
        </Button>
      ]}
      style={{ height: '100%' }}
    >
      <Card.Meta
        title={
          <div
            style={{ cursor: 'pointer' }}
            onClick={() => onView(product.id)}
          >
            {product.name}
          </div>
        }
        description={
          <div>
            <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>
              {product.brand || 'Unknown Brand'}
            </Text>
            <div style={{ marginBottom: 8 }}>
              <Rate disabled value={product.rating || 0} style={{ fontSize: 12 }} />
              <Text type="secondary" style={{ marginLeft: 8, fontSize: 12 }}>
                ({product.reviewCount || 0})
              </Text>
            </div>
            <div>
              <Text strong style={{ fontSize: 16, color: '#1890ff' }}>
                {formatPrice(product.price)}
              </Text>
              {product.originalPrice && product.originalPrice > product.price && (
                <Text delete type="secondary" style={{ marginLeft: 8, fontSize: 12 }}>
                  {formatPrice(product.originalPrice)}
                </Text>
              )}
            </div>
          </div>
        }
      />
    </Card>
  );
};

export default ProductCard;
export type { Product, ProductCardProps };