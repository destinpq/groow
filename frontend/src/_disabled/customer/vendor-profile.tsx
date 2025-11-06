import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Avatar,
  Rate,
  Button,
  Space,
  Tabs,
  Tag,
  Statistic,
  Divider,
  List,
  Image,
  Badge,
  Progress,
  Timeline,
  Empty,
} from 'antd';
import {
  ShopOutlined,
  StarFilled,
  EnvironmentOutlined,
  PhoneOutlined,
  MailOutlined,
  ClockCircleOutlined,
  CheckCircleFilled,
  TrophyOutlined,
  UserOutlined,
  ShoppingCartOutlined,
  HeartOutlined,
  MessageOutlined,
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

interface VendorProfile {
  id: number;
  name: string;
  logo: string;
  coverImage: string;
  description: string;
  rating: number;
  totalReviews: number;
  totalProducts: number;
  totalSales: number;
  joinDate: string;
  responseRate: number;
  responseTime: string;
  verified: boolean;
  address: string;
  phone: string;
  email: string;
  businessHours: string;
  categories: string[];
  badges: string[];
  stats: {
    positiveReviews: number;
    onTimeDelivery: number;
    productQuality: number;
    customerService: number;
  };
}

interface Product {
  id: number;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  rating: number;
  sold: number;
  inStock: boolean;
}

interface Review {
  id: number;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
  productName: string;
}

const mockVendor: VendorProfile = {
  id: 1,
  name: 'AudioTech Pro Store',
  logo: 'https://via.placeholder.com/200x200?text=AudioTech',
  coverImage: 'https://via.placeholder.com/1200x300?text=Store+Cover',
  description: 'Your trusted source for premium audio equipment and electronics. We specialize in high-quality headphones, speakers, and audio accessories. With over 5 years of experience, we provide exceptional products and customer service.',
  rating: 4.7,
  totalReviews: 2456,
  totalProducts: 156,
  totalSales: 12450,
  joinDate: 'January 2020',
  responseRate: 98,
  responseTime: '< 2 hours',
  verified: true,
  address: '123 Tech Street, Silicon Valley, CA 94025',
  phone: '+1 (555) 123-4567',
  email: 'support@audiotechpro.com',
  businessHours: 'Mon-Fri: 9AM-6PM PST',
  categories: ['Electronics', 'Audio Equipment', 'Accessories'],
  badges: ['Top Seller', 'Verified Business', 'Fast Shipping'],
  stats: {
    positiveReviews: 96,
    onTimeDelivery: 98,
    productQuality: 95,
    customerService: 97,
  },
};

const mockProducts: Product[] = [
  {
    id: 1,
    name: 'Wireless Bluetooth Headphones',
    image: 'https://via.placeholder.com/300x300?text=Headphones',
    price: 89.99,
    originalPrice: 129.99,
    rating: 4.5,
    sold: 2456,
    inStock: true,
  },
  {
    id: 2,
    name: 'Smart Watch Pro',
    image: 'https://via.placeholder.com/300x300?text=Smart+Watch',
    price: 199.99,
    rating: 4.8,
    sold: 1823,
    inStock: true,
  },
  {
    id: 3,
    name: 'USB-C Hub 7-in-1',
    image: 'https://via.placeholder.com/300x300?text=USB+Hub',
    price: 45.99,
    rating: 4.6,
    sold: 1234,
    inStock: false,
  },
  {
    id: 4,
    name: 'Wireless Mouse Ergonomic',
    image: 'https://via.placeholder.com/300x300?text=Mouse',
    price: 24.99,
    originalPrice: 34.99,
    rating: 4.4,
    sold: 892,
    inStock: true,
  },
];

const mockReviews: Review[] = [
  {
    id: 1,
    customerName: 'John D.',
    rating: 5,
    comment: 'Excellent seller! Fast shipping and product exactly as described. Very professional service.',
    date: 'Oct 28, 2025',
    verified: true,
    productName: 'Wireless Bluetooth Headphones',
  },
  {
    id: 2,
    customerName: 'Sarah M.',
    rating: 4,
    comment: 'Great products and good customer service. Response time was quick when I had questions.',
    date: 'Oct 25, 2025',
    verified: true,
    productName: 'Smart Watch Pro',
  },
  {
    id: 3,
    customerName: 'Mike R.',
    rating: 5,
    comment: 'Top quality products! This is my third purchase from this seller. Highly recommended!',
    date: 'Oct 20, 2025',
    verified: false,
    productName: 'USB-C Hub 7-in-1',
  },
];

const VendorProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('products');

  const ratingDistribution = [
    { stars: 5, percentage: 68, count: 1670 },
    { stars: 4, percentage: 20, count: 491 },
    { stars: 3, percentage: 8, count: 196 },
    { stars: 2, percentage: 3, count: 74 },
    { stars: 1, percentage: 1, count: 25 },
  ];

  return (
    <div style={{ padding: 24, background: '#f0f2f5' }}>
      {/* Cover Image */}
      <Card
        cover={
          <div style={{ position: 'relative' }}>
            <Image
              src={mockVendor.coverImage}
              alt="Store Cover"
              preview={false}
              style={{ height: 200, objectFit: 'cover' }}
            />
          </div>
        }
        style={{ marginBottom: 24 }}
      >
        <Row gutter={24} align="middle">
          <Col>
            <Badge.Ribbon text="Verified" color="green" style={{ display: mockVendor.verified ? 'block' : 'none' }}>
              <Avatar src={mockVendor.logo} size={120} />
            </Badge.Ribbon>
          </Col>
          <Col flex="auto">
            <Space direction="vertical" size="small">
              <Title level={2} style={{ margin: 0 }}>
                {mockVendor.name}
                {mockVendor.verified && (
                  <CheckCircleFilled style={{ color: '#52c41a', marginLeft: 8, fontSize: 20 }} />
                )}
              </Title>
              <Space size="large" wrap>
                <Space>
                  <StarFilled style={{ color: '#faad14' }} />
                  <Text strong>{mockVendor.rating}</Text>
                  <Text type="secondary">({mockVendor.totalReviews.toLocaleString()} reviews)</Text>
                </Space>
                <Space>
                  <ShopOutlined />
                  <Text>{mockVendor.totalProducts} Products</Text>
                </Space>
                <Space>
                  <TrophyOutlined />
                  <Text>{mockVendor.totalSales.toLocaleString()} Sales</Text>
                </Space>
                <Space>
                  <ClockCircleOutlined />
                  <Text>Joined {mockVendor.joinDate}</Text>
                </Space>
              </Space>
              <Space wrap>
                {mockVendor.badges.map((badge, idx) => (
                  <Tag key={idx} color="gold" icon={<TrophyOutlined />}>
                    {badge}
                  </Tag>
                ))}
              </Space>
            </Space>
          </Col>
          <Col>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Button type="primary" size="large" icon={<MessageOutlined />} block>
                Contact Seller
              </Button>
              <Button size="large" icon={<HeartOutlined />} block>
                Follow Store
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      <Row gutter={24}>
        {/* Main Content */}
        <Col xs={24} lg={18}>
          <Card>
            <Tabs activeKey={activeTab} onChange={setActiveTab}>
              {/* Products Tab */}
              <TabPane tab={`Products (${mockVendor.totalProducts})`} key="products">
                <Row gutter={[16, 16]}>
                  {mockProducts.map(product => (
                    <Col xs={12} sm={8} md={6} key={product.id}>
                      <Card
                        hoverable
                        cover={
                          <div style={{ position: 'relative' }}>
                            <Image src={product.image} alt={product.name} preview={false} />
                            {product.originalPrice && (
                              <Tag color="red" style={{ position: 'absolute', top: 8, right: 8 }}>
                                {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                              </Tag>
                            )}
                            {!product.inStock && (
                              <Tag color="default" style={{ position: 'absolute', top: 8, left: 8 }}>
                                Out of Stock
                              </Tag>
                            )}
                          </div>
                        }
                        actions={[
                          <Button type="text" icon={<ShoppingCartOutlined />} />,
                          <Button type="text" icon={<HeartOutlined />} />,
                        ]}
                      >
                        <Card.Meta
                          title={
                            <Paragraph ellipsis={{ rows: 2 }} style={{ marginBottom: 8, height: 44 }}>
                              {product.name}
                            </Paragraph>
                          }
                          description={
                            <Space direction="vertical" style={{ width: '100%' }} size="small">
                              <Rate disabled value={product.rating} style={{ fontSize: 12 }} />
                              <Text strong style={{ color: '#ff9900' }}>${product.price.toFixed(2)}</Text>
                              {product.originalPrice && (
                                <Text delete type="secondary" style={{ fontSize: 12 }}>
                                  ${product.originalPrice.toFixed(2)}
                                </Text>
                              )}
                              <Text type="secondary" style={{ fontSize: 12 }}>
                                {product.sold} sold
                              </Text>
                            </Space>
                          }
                        />
                      </Card>
                    </Col>
                  ))}
                </Row>
                {mockProducts.length === 0 && (
                  <Empty description="No products available" />
                )}
              </TabPane>

              {/* Reviews Tab */}
              <TabPane tab={`Reviews (${mockVendor.totalReviews})`} key="reviews">
                {/* Rating Summary */}
                <Row gutter={24} style={{ marginBottom: 24 }}>
                  <Col xs={24} md={8}>
                    <div style={{ textAlign: 'center', padding: 24, background: '#fafafa', borderRadius: 8 }}>
                      <Title level={1} style={{ margin: 0, color: '#faad14' }}>
                        {mockVendor.rating}
                      </Title>
                      <Rate disabled value={mockVendor.rating} allowHalf style={{ fontSize: 24 }} />
                      <div style={{ marginTop: 8 }}>
                        <Text type="secondary">{mockVendor.totalReviews.toLocaleString()} total ratings</Text>
                      </div>
                    </div>
                  </Col>
                  <Col xs={24} md={16}>
                    {ratingDistribution.map(({ stars, percentage, count }) => (
                      <div key={stars} style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
                        <Text style={{ width: 60 }}>{stars} star</Text>
                        <Progress
                          percent={percentage}
                          strokeColor="#faad14"
                          style={{ flex: 1, marginRight: 12 }}
                        />
                        <Text type="secondary" style={{ width: 60 }}>{count}</Text>
                      </div>
                    ))}
                  </Col>
                </Row>

                <Divider />

                {/* Reviews List */}
                <List
                  itemLayout="vertical"
                  dataSource={mockReviews}
                  renderItem={review => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={<Avatar icon={<UserOutlined />} />}
                        title={
                          <Space>
                            <Text strong>{review.customerName}</Text>
                            {review.verified && (
                              <Tag color="success" icon={<CheckCircleFilled />}>
                                Verified Purchase
                              </Tag>
                            )}
                          </Space>
                        }
                        description={
                          <Space direction="vertical" size="small">
                            <Rate disabled value={review.rating} />
                            <Text type="secondary">Product: {review.productName}</Text>
                            <Text type="secondary">{review.date}</Text>
                          </Space>
                        }
                      />
                      <Paragraph>{review.comment}</Paragraph>
                    </List.Item>
                  )}
                />
              </TabPane>

              {/* About Tab */}
              <TabPane tab="About Store" key="about">
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                  <div>
                    <Title level={5}>Store Description</Title>
                    <Paragraph>{mockVendor.description}</Paragraph>
                  </div>

                  <Divider />

                  <div>
                    <Title level={5}>Categories</Title>
                    <Space wrap>
                      {mockVendor.categories.map((category, idx) => (
                        <Tag key={idx} color="blue">{category}</Tag>
                      ))}
                    </Space>
                  </div>

                  <Divider />

                  <div>
                    <Title level={5}>Contact Information</Title>
                    <Space direction="vertical">
                      <Space>
                        <EnvironmentOutlined />
                        <Text>{mockVendor.address}</Text>
                      </Space>
                      <Space>
                        <PhoneOutlined />
                        <Text>{mockVendor.phone}</Text>
                      </Space>
                      <Space>
                        <MailOutlined />
                        <Text>{mockVendor.email}</Text>
                      </Space>
                      <Space>
                        <ClockCircleOutlined />
                        <Text>{mockVendor.businessHours}</Text>
                      </Space>
                    </Space>
                  </div>

                  <Divider />

                  <div>
                    <Title level={5}>Store Timeline</Title>
                    <Timeline
                      items={[
                        {
                          children: `Joined platform - ${mockVendor.joinDate}`,
                          color: 'blue',
                        },
                        {
                          children: 'Achieved 1000 sales - June 2021',
                          color: 'green',
                        },
                        {
                          children: 'Received Top Seller badge - January 2023',
                          color: 'gold',
                        },
                        {
                          children: 'Reached 10,000 sales milestone - October 2025',
                          color: 'red',
                        },
                      ]}
                    />
                  </div>
                </Space>
              </TabPane>
            </Tabs>
          </Card>
        </Col>

        {/* Sidebar */}
        <Col xs={24} lg={6}>
          <Space direction="vertical" style={{ width: '100%' }} size="middle">
            {/* Performance Stats */}
            <Card title="Store Performance">
              <Space direction="vertical" style={{ width: '100%' }} size="middle">
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <Text>Positive Reviews</Text>
                    <Text strong>{mockVendor.stats.positiveReviews}%</Text>
                  </div>
                  <Progress percent={mockVendor.stats.positiveReviews} strokeColor="#52c41a" showInfo={false} />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <Text>On-Time Delivery</Text>
                    <Text strong>{mockVendor.stats.onTimeDelivery}%</Text>
                  </div>
                  <Progress percent={mockVendor.stats.onTimeDelivery} strokeColor="#1890ff" showInfo={false} />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <Text>Product Quality</Text>
                    <Text strong>{mockVendor.stats.productQuality}%</Text>
                  </div>
                  <Progress percent={mockVendor.stats.productQuality} strokeColor="#faad14" showInfo={false} />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <Text>Customer Service</Text>
                    <Text strong>{mockVendor.stats.customerService}%</Text>
                  </div>
                  <Progress percent={mockVendor.stats.customerService} strokeColor="#722ed1" showInfo={false} />
                </div>
              </Space>
            </Card>

            {/* Response Stats */}
            <Card title="Response Stats">
              <Space direction="vertical" style={{ width: '100%' }}>
                <Statistic
                  title="Response Rate"
                  value={mockVendor.responseRate}
                  suffix="%"
                  valueStyle={{ color: '#52c41a' }}
                />
                <Divider style={{ margin: '12px 0' }} />
                <Statistic
                  title="Response Time"
                  value={mockVendor.responseTime}
                  valueStyle={{ fontSize: 18 }}
                />
              </Space>
            </Card>

            {/* Policies */}
            <Card title="Store Policies">
              <Space direction="vertical" size="small">
                <div>
                  <Text strong>Shipping:</Text>
                  <br />
                  <Text type="secondary">Free shipping on orders over $50</Text>
                </div>
                <Divider style={{ margin: '8px 0' }} />
                <div>
                  <Text strong>Returns:</Text>
                  <br />
                  <Text type="secondary">30-day return policy</Text>
                </div>
                <Divider style={{ margin: '8px 0' }} />
                <div>
                  <Text strong>Warranty:</Text>
                  <br />
                  <Text type="secondary">1-year manufacturer warranty</Text>
                </div>
              </Space>
            </Card>
          </Space>
        </Col>
      </Row>
    </div>
  );
};

export default VendorProfilePage;
