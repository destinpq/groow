import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Rate,
  Button,
  Tag,
  Space,
  Skeleton,
  Empty,
  Tooltip,
} from 'antd';
import {
  ThunderboltOutlined,
  HeartOutlined,
  ShoppingCartOutlined,
  StarFilled,
  RobotOutlined,
  TrophyOutlined,
  FireOutlined,
} from '@ant-design/icons';

const { Text, Title } = Typography;

interface Product {
  id: number;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  badge?: string;
  inStock: boolean;
  seller: string;
  category: string;
}

interface AIRecommendationsProps {
  productId?: number;
  userId?: number;
  type?: 'similar' | 'frequently-bought' | 'personalized' | 'trending';
  title?: string;
  maxItems?: number;
}

const mockRecommendations: { [key: string]: Product[] } = {
  similar: [
    {
      id: 101,
      name: 'Wireless Bluetooth Headphones Pro',
      image: 'https://via.placeholder.com/200?text=Headphones',
      price: 89.99,
      originalPrice: 129.99,
      rating: 4.6,
      reviews: 892,
      badge: 'Best Seller',
      inStock: true,
      seller: 'AudioTech',
      category: 'Electronics',
    },
    {
      id: 102,
      name: 'Premium Noise-Cancelling Earbuds',
      image: 'https://via.placeholder.com/200?text=Earbuds',
      price: 129.99,
      rating: 4.8,
      reviews: 1245,
      badge: 'Trending',
      inStock: true,
      seller: 'SoundWave',
      category: 'Electronics',
    },
    {
      id: 103,
      name: 'Studio Quality Over-Ear Headphones',
      image: 'https://via.placeholder.com/200?text=Studio',
      price: 199.99,
      originalPrice: 249.99,
      rating: 4.7,
      reviews: 567,
      inStock: true,
      seller: 'ProAudio',
      category: 'Electronics',
    },
    {
      id: 104,
      name: 'Sports Wireless Earbuds',
      image: 'https://via.placeholder.com/200?text=Sports',
      price: 69.99,
      rating: 4.5,
      reviews: 423,
      badge: 'New Arrival',
      inStock: true,
      seller: 'FitSound',
      category: 'Electronics',
    },
  ],
  'frequently-bought': [
    {
      id: 201,
      name: 'USB-C Fast Charging Cable 6ft',
      image: 'https://via.placeholder.com/200?text=Cable',
      price: 14.99,
      rating: 4.4,
      reviews: 1890,
      inStock: true,
      seller: 'ConnectPlus',
      category: 'Accessories',
    },
    {
      id: 202,
      name: 'Portable Power Bank 20000mAh',
      image: 'https://via.placeholder.com/200?text=PowerBank',
      price: 34.99,
      originalPrice: 49.99,
      rating: 4.6,
      reviews: 756,
      badge: 'Deal',
      inStock: true,
      seller: 'PowerTech',
      category: 'Accessories',
    },
    {
      id: 203,
      name: 'Premium Carrying Case',
      image: 'https://via.placeholder.com/200?text=Case',
      price: 19.99,
      rating: 4.3,
      reviews: 345,
      inStock: true,
      seller: 'CasePro',
      category: 'Accessories',
    },
  ],
  personalized: [
    {
      id: 301,
      name: 'Smart Watch Fitness Tracker',
      image: 'https://via.placeholder.com/200?text=SmartWatch',
      price: 149.99,
      originalPrice: 199.99,
      rating: 4.7,
      reviews: 2341,
      badge: 'Recommended',
      inStock: true,
      seller: 'TechWear',
      category: 'Electronics',
    },
    {
      id: 302,
      name: 'Mechanical Gaming Keyboard RGB',
      image: 'https://via.placeholder.com/200?text=Keyboard',
      price: 79.99,
      rating: 4.8,
      reviews: 1567,
      inStock: true,
      seller: 'GameKeys',
      category: 'Accessories',
    },
    {
      id: 303,
      name: 'Wireless Gaming Mouse',
      image: 'https://via.placeholder.com/200?text=Mouse',
      price: 49.99,
      rating: 4.6,
      reviews: 892,
      badge: 'Popular',
      inStock: true,
      seller: 'ClickMaster',
      category: 'Accessories',
    },
    {
      id: 304,
      name: '4K Webcam with Auto-Focus',
      image: 'https://via.placeholder.com/200?text=Webcam',
      price: 89.99,
      rating: 4.5,
      reviews: 445,
      inStock: true,
      seller: 'VisionTech',
      category: 'Electronics',
    },
  ],
  trending: [
    {
      id: 401,
      name: 'AI-Powered Smart Speaker',
      image: 'https://via.placeholder.com/200?text=Speaker',
      price: 99.99,
      rating: 4.7,
      reviews: 3456,
      badge: 'Hot',
      inStock: true,
      seller: 'SmartHome',
      category: 'Electronics',
    },
    {
      id: 402,
      name: 'Portable Bluetooth Projector',
      image: 'https://via.placeholder.com/200?text=Projector',
      price: 249.99,
      originalPrice: 299.99,
      rating: 4.6,
      reviews: 678,
      badge: 'Trending',
      inStock: true,
      seller: 'DisplayPro',
      category: 'Electronics',
    },
    {
      id: 403,
      name: 'Wireless Charging Pad 3-in-1',
      image: 'https://via.placeholder.com/200?text=Charger',
      price: 44.99,
      rating: 4.5,
      reviews: 1234,
      inStock: true,
      seller: 'ChargeTech',
      category: 'Accessories',
    },
  ],
};

const AIProductRecommendations: React.FC<AIRecommendationsProps> = ({
  productId,
  userId,
  type = 'similar',
  title,
  maxItems = 4,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate AI recommendation API call
    setLoading(true);
    setTimeout(() => {
      const recommendations = mockRecommendations[type] || mockRecommendations.similar;
      setProducts(recommendations.slice(0, maxItems));
      setLoading(false);
    }, 1000);
  }, [type, maxItems, productId, userId]);

  const getTitle = () => {
    if (title) return title;
    
    switch (type) {
      case 'similar':
        return 'Similar Products You May Like';
      case 'frequently-bought':
        return 'Frequently Bought Together';
      case 'personalized':
        return 'Recommended For You';
      case 'trending':
        return 'Trending Now';
      default:
        return 'Recommendations';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'similar':
        return <ThunderboltOutlined style={{ color: '#ff9900' }} />;
      case 'frequently-bought':
        return <ShoppingCartOutlined style={{ color: '#1890ff' }} />;
      case 'personalized':
        return <RobotOutlined style={{ color: '#52c41a' }} />;
      case 'trending':
        return <FireOutlined style={{ color: '#ff4d4f' }} />;
      default:
        return <StarFilled style={{ color: '#faad14' }} />;
    }
  };

  const handleAddToCart = (product: Product) => {
    console.log('Add to cart:', product);
  };

  const handleAddToWishlist = (product: Product) => {
    console.log('Add to wishlist:', product);
  };

  if (loading) {
    return (
      <Card
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {getIcon()}
            <span>{getTitle()}</span>
          </div>
        }
      >
        <Row gutter={16}>
          {Array.from({ length: maxItems }).map((_, idx) => (
            <Col xs={24} sm={12} md={6} key={idx}>
              <Skeleton active />
            </Col>
          ))}
        </Row>
      </Card>
    );
  }

  if (products.length === 0) {
    return (
      <Card
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {getIcon()}
            <span>{getTitle()}</span>
          </div>
        }
      >
        <Empty description="No recommendations available" />
      </Card>
    );
  }

  return (
    <Card
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {getIcon()}
          <span>{getTitle()}</span>
          <Tag color="purple" style={{ marginLeft: 8 }}>
            <RobotOutlined /> AI Powered
          </Tag>
        </div>
      }
    >
      <Row gutter={[16, 16]}>
        {products.map(product => (
          <Col xs={24} sm={12} md={6} key={product.id}>
            <Card
              hoverable
              cover={
                <div style={{ position: 'relative' }}>
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{ width: '100%', height: 200, objectFit: 'cover' }}
                  />
                  {product.badge && (
                    <div
                      style={{
                        position: 'absolute',
                        top: 8,
                        left: 8,
                      }}
                    >
                      <Tag
                        color={
                          product.badge === 'Best Seller'
                            ? 'gold'
                            : product.badge === 'Trending'
                            ? 'orange'
                            : product.badge === 'New Arrival'
                            ? 'blue'
                            : 'green'
                        }
                        icon={
                          product.badge === 'Best Seller' ? (
                            <TrophyOutlined />
                          ) : product.badge === 'Trending' ? (
                            <FireOutlined />
                          ) : null
                        }
                      >
                        {product.badge}
                      </Tag>
                    </div>
                  )}
                  {!product.inStock && (
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0, 0, 0, 0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: 18,
                        fontWeight: 600,
                      }}
                    >
                      Out of Stock
                    </div>
                  )}
                </div>
              }
            >
              <div style={{ minHeight: 160 }}>
                <Tooltip title={product.name}>
                  <Title level={5} ellipsis={{ rows: 2 }} style={{ marginBottom: 8, height: 48 }}>
                    {product.name}
                  </Title>
                </Tooltip>

                <div style={{ marginBottom: 8 }}>
                  <Rate disabled value={product.rating} style={{ fontSize: 14 }} />
                  <Text type="secondary" style={{ marginLeft: 8, fontSize: 12 }}>
                    ({product.reviews})
                  </Text>
                </div>

                <div style={{ marginBottom: 8 }}>
                  <Text strong style={{ fontSize: 18, color: '#ff9900' }}>
                    ${product.price}
                  </Text>
                  {product.originalPrice && (
                    <Text
                      delete
                      type="secondary"
                      style={{ marginLeft: 8, fontSize: 14 }}
                    >
                      ${product.originalPrice}
                    </Text>
                  )}
                </div>

                <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 12 }}>
                  by {product.seller}
                </Text>

                <Space size="small">
                  <Button
                    type="primary"
                    size="small"
                    icon={<ShoppingCartOutlined />}
                    onClick={() => handleAddToCart(product)}
                    disabled={!product.inStock}
                  >
                    Add
                  </Button>
                  <Button
                    size="small"
                    icon={<HeartOutlined />}
                    onClick={() => handleAddToWishlist(product)}
                  />
                </Space>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </Card>
  );
};

export default AIProductRecommendations;
