import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Button,
  Space,
  List,
  Avatar,
  Tag,
  Input,
  Select,
  Empty,
  Badge,
  Tooltip,
  Modal,
  Form,
  Rate,
  message,
  Divider,
  Tabs,
} from 'antd';
import {
  UserOutlined,
  ShoppingOutlined,
  MessageOutlined,
  PhoneOutlined,
  MailOutlined,
  StarOutlined,
  TeamOutlined,
  ShopOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;
const { Option } = Select;
const { TextArea } = Input;

interface Seller {
  id: number;
  name: string;
  avatar: string;
  rating: number;
  totalReviews: number;
  responseTime: string; // e.g., "< 2 hours"
  responseRate: number; // percentage
  joinedDate: string;
  productsCount: number;
  totalSales: number;
  isVerified: boolean;
  isPremium: boolean;
  location: string;
  categories: string[];
  badges: string[];
  lastActive: string;
}

interface Message {
  id: number;
  sellerId: number;
  sellerName: string;
  lastMessage: string;
  timestamp: string;
  isRead: boolean;
  unreadCount: number;
}

const mockSellers: Seller[] = [
  {
    id: 1,
    name: 'TechStore Official',
    avatar: 'https://via.placeholder.com/60?text=TS',
    rating: 4.8,
    totalReviews: 12453,
    responseTime: '< 1 hour',
    responseRate: 98,
    joinedDate: dayjs().subtract(5, 'years').format('YYYY-MM-DD'),
    productsCount: 856,
    totalSales: 45230,
    isVerified: true,
    isPremium: true,
    location: 'New York, USA',
    categories: ['Electronics', 'Computers', 'Accessories'],
    badges: ['Top Seller', 'Verified', 'Fast Shipping'],
    lastActive: dayjs().subtract(10, 'minutes').toISOString(),
  },
  {
    id: 2,
    name: 'Fashion Hub',
    avatar: 'https://via.placeholder.com/60?text=FH',
    rating: 4.6,
    totalReviews: 8934,
    responseTime: '< 2 hours',
    responseRate: 95,
    joinedDate: dayjs().subtract(3, 'years').format('YYYY-MM-DD'),
    productsCount: 1234,
    totalSales: 32145,
    isVerified: true,
    isPremium: false,
    location: 'Los Angeles, USA',
    categories: ['Fashion', 'Clothing', 'Accessories'],
    badges: ['Verified', 'Quality Products'],
    lastActive: dayjs().subtract(1, 'hour').toISOString(),
  },
  {
    id: 3,
    name: 'Home & Garden Experts',
    avatar: 'https://via.placeholder.com/60?text=HG',
    rating: 4.9,
    totalReviews: 5678,
    responseTime: '< 3 hours',
    responseRate: 92,
    joinedDate: dayjs().subtract(2, 'years').format('YYYY-MM-DD'),
    productsCount: 445,
    totalSales: 18934,
    isVerified: true,
    isPremium: true,
    location: 'Seattle, USA',
    categories: ['Home', 'Garden', 'Furniture'],
    badges: ['Top Seller', 'Verified', 'Eco-Friendly'],
    lastActive: dayjs().subtract(30, 'minutes').toISOString(),
  },
  {
    id: 4,
    name: 'Sports Gear Pro',
    avatar: 'https://via.placeholder.com/60?text=SP',
    rating: 4.7,
    totalReviews: 3456,
    responseTime: '< 4 hours',
    responseRate: 89,
    joinedDate: dayjs().subtract(1, 'year').format('YYYY-MM-DD'),
    productsCount: 234,
    totalSales: 9876,
    isVerified: false,
    isPremium: false,
    location: 'Chicago, USA',
    categories: ['Sports', 'Fitness', 'Outdoor'],
    badges: ['Fast Shipping'],
    lastActive: dayjs().subtract(2, 'hours').toISOString(),
  },
  {
    id: 5,
    name: 'Book Haven',
    avatar: 'https://via.placeholder.com/60?text=BH',
    rating: 4.5,
    totalReviews: 2345,
    responseTime: '< 5 hours',
    responseRate: 87,
    joinedDate: dayjs().subtract(6, 'months').format('YYYY-MM-DD'),
    productsCount: 567,
    totalSales: 6543,
    isVerified: true,
    isPremium: false,
    location: 'Boston, USA',
    categories: ['Books', 'Education', 'Stationery'],
    badges: ['Verified', 'Quality Products'],
    lastActive: dayjs().subtract(5, 'hours').toISOString(),
  },
];

const mockMessages: Message[] = [
  {
    id: 1,
    sellerId: 1,
    sellerName: 'TechStore Official',
    lastMessage: 'Yes, we have that item in stock. Would you like to place an order?',
    timestamp: dayjs().subtract(30, 'minutes').toISOString(),
    isRead: false,
    unreadCount: 2,
  },
  {
    id: 2,
    sellerId: 3,
    sellerName: 'Home & Garden Experts',
    lastMessage: 'Thank you for your purchase! Your order will ship tomorrow.',
    timestamp: dayjs().subtract(2, 'hours').toISOString(),
    isRead: true,
    unreadCount: 0,
  },
];

const SellerDirectoryPage: React.FC = () => {
  const [sellers] = useState<Seller[]>(mockSellers);
  const [messages] = useState<Message[]>(mockMessages);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('rating');
  const [isContactModalVisible, setIsContactModalVisible] = useState<boolean>(false);
  const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null);
  const [form] = Form.useForm();

  const handleContactSeller = (seller: Seller) => {
    setSelectedSeller(seller);
    form.resetFields();
    setIsContactModalVisible(true);
  };

  const handleSendMessage = (values: any) => {
    message.success(`Message sent to ${selectedSeller?.name}`);
    setIsContactModalVisible(false);
    form.resetFields();
    setSelectedSeller(null);
  };

  const filteredSellers = sellers
    .filter((s) => {
      const matchesSearch =
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.categories.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = filterCategory === 'all' || s.categories.includes(filterCategory);
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'sales') return b.totalSales - a.totalSales;
      if (sortBy === 'products') return b.productsCount - a.productsCount;
      return 0;
    });

  const allCategories = Array.from(new Set(sellers.flatMap((s) => s.categories)));
  const unreadMessages = messages.filter((m) => !m.isRead).length;

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <Title level={3}>
        <ShopOutlined style={{ color: '#1890ff' }} /> Seller Directory
      </Title>
      <Paragraph type="secondary">
        Browse and connect with trusted sellers on our platform
      </Paragraph>

      <Tabs defaultActiveKey="directory">
        <Tabs.TabPane
          tab={
            <span>
              <TeamOutlined />
              All Sellers ({sellers.length})
            </span>
          }
          key="directory"
        >
          <Card style={{ marginBottom: 24 }}>
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Search
                    placeholder="Search sellers or categories..."
                    allowClear
                    size="large"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </Col>
                <Col xs={24} md={6}>
                  <Select
                    value={filterCategory}
                    onChange={setFilterCategory}
                    style={{ width: '100%' }}
                    size="large"
                  >
                    <Option value="all">All Categories</Option>
                    {allCategories.map((cat) => (
                      <Option key={cat} value={cat}>
                        {cat}
                      </Option>
                    ))}
                  </Select>
                </Col>
                <Col xs={24} md={6}>
                  <Select
                    value={sortBy}
                    onChange={setSortBy}
                    style={{ width: '100%' }}
                    size="large"
                  >
                    <Option value="rating">Highest Rating</Option>
                    <Option value="sales">Most Sales</Option>
                    <Option value="products">Most Products</Option>
                  </Select>
                </Col>
              </Row>
            </Space>
          </Card>

          {filteredSellers.length === 0 ? (
            <Empty description="No sellers found" image={Empty.PRESENTED_IMAGE_SIMPLE} />
          ) : (
            <Row gutter={[16, 16]}>
              {filteredSellers.map((seller) => (
                <Col key={seller.id} xs={24} sm={12} lg={8}>
                  <Card
                    hoverable
                    style={{
                      height: '100%',
                      border: seller.isPremium ? '2px solid #fa8c16' : undefined,
                    }}
                  >
                    <div style={{ textAlign: 'center' }}>
                      <Badge
                        count={seller.isPremium ? 'PREMIUM' : 0}
                        style={{ backgroundColor: '#fa8c16' }}
                      >
                        <Avatar src={seller.avatar} size={80} />
                      </Badge>
                      <div style={{ marginTop: 12 }}>
                        <Space align="center">
                          <Text strong style={{ fontSize: 16 }}>
                            {seller.name}
                          </Text>
                          {seller.isVerified && (
                            <Tooltip title="Verified Seller">
                              <CheckCircleOutlined style={{ color: '#52c41a' }} />
                            </Tooltip>
                          )}
                        </Space>
                      </div>
                      <div style={{ marginTop: 4 }}>
                        <Rate disabled defaultValue={seller.rating} allowHalf />
                        <Text type="secondary" style={{ marginLeft: 8, fontSize: 12 }}>
                          {seller.rating} ({seller.totalReviews.toLocaleString()})
                        </Text>
                      </div>
                      <Divider style={{ margin: '12px 0' }} />
                      <Space direction="vertical" size="small" style={{ width: '100%' }}>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          📍 {seller.location}
                        </Text>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          ⚡ Response: {seller.responseTime} ({seller.responseRate}%)
                        </Text>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          📦 {seller.productsCount} Products | {seller.totalSales.toLocaleString()}{' '}
                          Sales
                        </Text>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          🕒 Active {dayjs(seller.lastActive).fromNow()}
                        </Text>
                      </Space>
                      <Divider style={{ margin: '12px 0' }} />
                      <Space wrap size="small" style={{ justifyContent: 'center' }}>
                        {seller.badges.map((badge, index) => (
                          <Tag
                            key={index}
                            color={
                              badge === 'Top Seller'
                                ? 'gold'
                                : badge === 'Verified'
                                ? 'green'
                                : 'blue'
                            }
                          >
                            {badge}
                          </Tag>
                        ))}
                      </Space>
                      <Divider style={{ margin: '12px 0' }} />
                      <Space direction="vertical" style={{ width: '100%' }} size="small">
                        <Button
                          type="primary"
                          block
                          icon={<ShoppingOutlined />}
                          onClick={() => message.info(`Viewing ${seller.name}'s store`)}
                        >
                          Visit Store
                        </Button>
                        <Button
                          block
                          icon={<MessageOutlined />}
                          onClick={() => handleContactSeller(seller)}
                        >
                          Contact Seller
                        </Button>
                      </Space>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Tabs.TabPane>

        <Tabs.TabPane
          tab={
            <span>
              <Badge count={unreadMessages}>
                <MessageOutlined />
              </Badge>
              <span style={{ marginLeft: 8 }}>Messages ({messages.length})</span>
            </span>
          }
          key="messages"
        >
          <Card>
            <List
              dataSource={messages}
              renderItem={(msg) => (
                <List.Item
                  style={{
                    background: msg.isRead ? '#fff' : '#e6f7ff',
                    padding: 16,
                    marginBottom: 8,
                    borderRadius: 8,
                  }}
                  actions={[
                    <Button type="link">View</Button>,
                    <Button type="link">Reply</Button>,
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <Badge dot={!msg.isRead}>
                        <Avatar icon={<UserOutlined />} size={48} />
                      </Badge>
                    }
                    title={
                      <Space>
                        <Text strong>{msg.sellerName}</Text>
                        {msg.unreadCount > 0 && (
                          <Badge count={msg.unreadCount} style={{ backgroundColor: '#1890ff' }} />
                        )}
                      </Space>
                    }
                    description={
                      <div>
                        <Paragraph
                          style={{ margin: 0, marginBottom: 8 }}
                          ellipsis={{ rows: 2 }}
                        >
                          {msg.lastMessage}
                        </Paragraph>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          <ClockCircleOutlined /> {dayjs(msg.timestamp).fromNow()}
                        </Text>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Tabs.TabPane>
      </Tabs>

      <Modal
        title={`Contact ${selectedSeller?.name}`}
        open={isContactModalVisible}
        onCancel={() => {
          setIsContactModalVisible(false);
          setSelectedSeller(null);
        }}
        footer={null}
        width={600}
      >
        {selectedSeller && (
          <>
            <div style={{ marginBottom: 24, textAlign: 'center' }}>
              <Avatar src={selectedSeller.avatar} size={60} />
              <div style={{ marginTop: 8 }}>
                <Text strong>{selectedSeller.name}</Text>
              </div>
              <Space style={{ marginTop: 4 }}>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  <ClockCircleOutlined /> Response time: {selectedSeller.responseTime}
                </Text>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  <CheckCircleOutlined /> {selectedSeller.responseRate}% response rate
                </Text>
              </Space>
            </div>

            <Form form={form} layout="vertical" onFinish={handleSendMessage}>
              <Form.Item
                label="Subject"
                name="subject"
                rules={[{ required: true, message: 'Please enter subject' }]}
              >
                <Select size="large" placeholder="Select subject">
                  <Option value="product">Product Inquiry</Option>
                  <Option value="order">Order Question</Option>
                  <Option value="shipping">Shipping Information</Option>
                  <Option value="return">Return/Refund</Option>
                  <Option value="other">Other</Option>
                </Select>
              </Form.Item>

              <Form.Item
                label="Message"
                name="message"
                rules={[
                  { required: true, message: 'Please enter your message' },
                  { min: 10, message: 'Message must be at least 10 characters' },
                ]}
              >
                <TextArea
                  rows={5}
                  placeholder="Type your message here..."
                  maxLength={500}
                  showCount
                />
              </Form.Item>

              <Form.Item>
                <Space>
                  <Button type="primary" htmlType="submit" size="large" icon={<MessageOutlined />}>
                    Send Message
                  </Button>
                  <Button
                    size="large"
                    onClick={() => {
                      setIsContactModalVisible(false);
                      setSelectedSeller(null);
                    }}
                  >
                    Cancel
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </>
        )}
      </Modal>
    </div>
  );
};

export default SellerDirectoryPage;
