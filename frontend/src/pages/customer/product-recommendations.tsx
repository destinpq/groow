import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Image,
  Space,
  Button,
  Tag,
  Rate,
  Divider,
  Tabs,
  List,
  Avatar,
  Badge,
  message,
  Carousel,
  Statistic,
} from 'antd';
import {
  ShoppingCartOutlined,
  HeartOutlined,
  StarOutlined,
  FireOutlined,
  ThunderboltOutlined,
  CrownOutlined,
  UserOutlined,
  EyeOutlined,
  ShoppingOutlined,
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  category: string;
  discount?: number;
  badge?: string;
}

interface RecommendationSection {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  products: Product[];
  type: 'personalized' | 'trending' | 'similar' | 'frequently_bought' | 'bestsellers';
}

const mockProducts: Product[] = [
  {
    id: 1,
    name: 'Wireless Noise-Cancelling Headphones',
    price: 299.99,
    originalPrice: 399.99,
    rating: 4.8,
    reviews: 1234,
    image: 'https://via.placeholder.com/300x300?text=Headphones',
    category: 'Electronics',
    discount: 25,
    badge: 'Best Seller',
  },
  {
    id: 2,
    name: 'Smart Fitness Tracker Watch',
    price: 199.99,
    rating: 4.5,
    reviews: 856,
    image: 'https://via.placeholder.com/300x300?text=Smart+Watch',
    category: 'Wearables',
  },
  {
    id: 3,
    name: 'Premium Yoga Mat with Carrying Strap',
    price: 49.99,
    originalPrice: 79.99,
    rating: 4.9,
    reviews: 2341,
    image: 'https://via.placeholder.com/300x300?text=Yoga+Mat',
    category: 'Sports',
    discount: 38,
    badge: 'Hot Deal',
  },
  {
    id: 4,
    name: 'Portable Bluetooth Speaker',
    price: 89.99,
    rating: 4.6,
    reviews: 567,
    image: 'https://via.placeholder.com/300x300?text=Speaker',
    category: 'Electronics',
  },
  {
    id: 5,
    name: 'Professional Camera Lens Kit',
    price: 449.99,
    originalPrice: 599.99,
    rating: 4.7,
    reviews: 423,
    image: 'https://via.placeholder.com/300x300?text=Camera+Lens',
    category: 'Photography',
    discount: 25,
  },
];

const recommendationSections: RecommendationSection[] = [
  {
    title: 'Recommended For You',
    subtitle: 'Based on your browsing history',
    icon: <UserOutlined />,
    type: 'personalized',
    products: mockProducts.slice(0, 4),
  },
  {
    title: 'Trending Now',
    subtitle: 'Popular products this week',
    icon: <FireOutlined />,
    type: 'trending',
    products: mockProducts.slice(1, 5),
  },
  {
    title: 'Frequently Bought Together',
    subtitle: 'Customers also purchased',
    icon: <ShoppingOutlined />,
    type: 'frequently_bought',
    products: mockProducts.slice(0, 3),
  },
  {
    title: 'Best Sellers',
    subtitle: 'Top rated products',
    icon: <CrownOutlined />,
    type: 'bestsellers',
    products: mockProducts.slice(2, 5),
  },
];

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const [wishlisted, setWishlisted] = useState<boolean>(false);

  return (
    <Card
      hoverable
      style={{ height: '100%' }}
      cover={
        <div style={{ position: 'relative' }}>
          <Image
            src={product.image}
            alt={product.name}
            preview={false}
            style={{ height: 200, objectFit: 'cover' }}
          />
          {product.discount && (
            <Tag
              color="red"
              style={{
                position: 'absolute',
                top: 8,
                left: 8,
                fontSize: 14,
                fontWeight: 'bold',
              }}
            >
              -{product.discount}%
            </Tag>
          )}
          {product.badge && (
            <Tag
              color="gold"
              icon={<StarOutlined />}
              style={{
                position: 'absolute',
                top: 8,
                right: 8,
                fontSize: 12,
              }}
            >
              {product.badge}
            </Tag>
          )}
          <Button
            type="text"
            shape="circle"
            icon={
              <HeartOutlined
                style={{
                  fontSize: 20,
                  color: wishlisted ? '#ff4d4f' : '#fff',
                }}
              />
            }
            onClick={(e) => {
              e.stopPropagation();
              setWishlisted(!wishlisted);
              message.success(wishlisted ? 'Removed from wishlist' : 'Added to wishlist');
            }}
            style={{
              position: 'absolute',
              bottom: 8,
              right: 8,
              background: 'rgba(0,0,0,0.3)',
            }}
          />
        </div>
      }
    >
      <Space direction="vertical" style={{ width: '100%' }} size="small">
        <Text type="secondary" style={{ fontSize: 12 }}>
          {product.category}
        </Text>

        <Title
          level={5}
          ellipsis={{ rows: 2 }}
          style={{ margin: 0, minHeight: 44 }}
        >
          {product.name}
        </Title>

        <div>
          <Rate disabled value={product.rating} style={{ fontSize: 14 }} />
          <Text type="secondary" style={{ marginLeft: 8, fontSize: 12 }}>
            ({product.reviews.toLocaleString()})
          </Text>
        </div>

        <div>
          <Text strong style={{ fontSize: 20, color: '#1890ff' }}>
            ${product.price.toFixed(2)}
          </Text>
          {product.originalPrice && (
            <Text
              delete
              type="secondary"
              style={{ marginLeft: 8, fontSize: 14 }}
            >
              ${product.originalPrice.toFixed(2)}
            </Text>
          )}
        </div>

        <Button
          type="primary"
          icon={<ShoppingCartOutlined />}
          onClick={(e) => {
            e.stopPropagation();
            message.success('Added to cart');
          }}
          block
        >
          Add to Cart
        </Button>
      </Space>
    </Card>
  );
};

const ProductRecommendationsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('all');

  const getStats = () => {
    const totalProducts = mockProducts.length;
    const avgRating = (
      mockProducts.reduce((sum, p) => sum + p.rating, 0) / totalProducts
    ).toFixed(1);
    const totalReviews = mockProducts.reduce((sum, p) => sum + p.reviews, 0);

    return { totalProducts, avgRating, totalReviews };
  };

  const stats = getStats();

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={3}>
            <ThunderboltOutlined style={{ color: '#1890ff' }} /> Product Recommendations
          </Title>
          <Paragraph type="secondary">
            Discover products tailored just for you
          </Paragraph>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Recommended Products"
              value={stats.totalProducts * 4}
              prefix={<ThunderboltOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Average Rating"
              value={stats.avgRating}
              prefix={<StarOutlined />}
              suffix="/ 5.0"
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Total Reviews"
              value={stats.totalReviews}
              prefix={<EyeOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      <Card style={{ marginBottom: 24 }}>
        <Title level={4}>
          <FireOutlined style={{ color: '#ff4d4f' }} /> Hot Deals - Limited Time Offers
        </Title>
        <Carousel autoplay dotPosition="bottom">
          {mockProducts
            .filter((p) => p.discount)
            .map((product) => (
              <div key={product.id}>
                <Row
                  gutter={24}
                  align="middle"
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    padding: 40,
                    borderRadius: 8,
                  }}
                >
                  <Col xs={24} md={12}>
                    <Image
                      src={product.image}
                      alt={product.name}
                      preview={false}
                      style={{ borderRadius: 8 }}
                    />
                  </Col>
                  <Col xs={24} md={12}>
                    <Space direction="vertical" size="large">
                      <Tag color="red" style={{ fontSize: 16, padding: '4px 12px' }}>
                        <ThunderboltOutlined /> {product.discount}% OFF
                      </Tag>
                      <Title level={2} style={{ color: '#fff', margin: 0 }}>
                        {product.name}
                      </Title>
                      <div>
                        <Text style={{ fontSize: 32, color: '#fff', fontWeight: 'bold' }}>
                          ${product.price.toFixed(2)}
                        </Text>
                        {product.originalPrice && (
                          <Text
                            delete
                            style={{ fontSize: 20, color: '#ddd', marginLeft: 16 }}
                          >
                            ${product.originalPrice.toFixed(2)}
                          </Text>
                        )}
                      </div>
                      <Button
                        type="primary"
                        size="large"
                        icon={<ShoppingCartOutlined />}
                        onClick={() => message.success('Added to cart')}
                      >
                        Grab This Deal
                      </Button>
                    </Space>
                  </Col>
                </Row>
              </div>
            ))}
        </Carousel>
      </Card>

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          {
            key: 'all',
            label: 'All Recommendations',
          },
          ...recommendationSections.map((section) => ({
            key: section.type,
            label: (
              <span>
                {section.icon} {section.title}
              </span>
            ),
          })),
        ]}
      />

      <div>
        {(activeTab === 'all'
          ? recommendationSections
          : recommendationSections.filter((s) => s.type === activeTab)
        ).map((section) => (
          <Card
            key={section.type}
            title={
              <Space>
                {section.icon}
                <span>{section.title}</span>
              </Space>
            }
            extra={<Text type="secondary">{section.subtitle}</Text>}
            style={{ marginBottom: 24 }}
          >
            <Row gutter={[16, 16]}>
              {section.products.map((product) => (
                <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
                  <ProductCard product={product} />
                </Col>
              ))}
            </Row>

            <div style={{ textAlign: 'center', marginTop: 24 }}>
              <Button type="link" size="large">
                View All {section.title} →
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {activeTab === 'frequently_bought' && (
        <Card
          title="Complete Your Purchase"
          style={{ marginTop: 24 }}
        >
          <Row gutter={24} align="middle">
            <Col xs={24} md={18}>
              <Space size="large" align="start">
                {mockProducts.slice(0, 3).map((product, index) => (
                  <React.Fragment key={product.id}>
                    <div style={{ textAlign: 'center' }}>
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={120}
                        height={120}
                        preview={false}
                        style={{ borderRadius: 8 }}
                      />
                      <div style={{ marginTop: 8 }}>
                        <Text strong>${product.price.toFixed(2)}</Text>
                      </div>
                    </div>
                    {index < 2 && (
                      <div style={{ fontSize: 24, color: '#999' }}>+</div>
                    )}
                  </React.Fragment>
                ))}
              </Space>
            </Col>
            <Col xs={24} md={6}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Text type="secondary">Bundle Price:</Text>
                <Title level={3} style={{ margin: 0, color: '#52c41a' }}>
                  $
                  {mockProducts
                    .slice(0, 3)
                    .reduce((sum, p) => sum + p.price, 0)
                    .toFixed(2)}
                </Title>
                <Text type="secondary">
                  Save $
                  {(
                    mockProducts
                      .slice(0, 3)
                      .reduce((sum, p) => sum + p.price, 0) * 0.1
                  ).toFixed(2)}
                </Text>
                <Button
                  type="primary"
                  size="large"
                  icon={<ShoppingCartOutlined />}
                  onClick={() => message.success('Bundle added to cart')}
                  block
                >
                  Add All to Cart
                </Button>
              </Space>
            </Col>
          </Row>
        </Card>
      )}
    </div>
  );
};

export default ProductRecommendationsPage;
