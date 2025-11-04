import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Avatar,
  Button,
  Space,
  Tag,
  Rate,
  Empty,
  Tabs,
  Statistic,
  message,
  Tooltip,
} from 'antd';
import {
  StarOutlined,
  StarFilled,
  ShopOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  MailOutlined,
  GlobalOutlined,
  TrophyOutlined,
  DeleteOutlined,
  EyeOutlined,
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

interface Vendor {
  id: number;
  name: string;
  slug: string;
  logo: string;
  description: string;
  rating: number;
  totalReviews: number;
  totalProducts: number;
  location: string;
  phone: string;
  email: string;
  website: string;
  verified: boolean;
  badges: string[];
  followedDate: string;
  categories: string[];
}

const mockFavoriteVendors: Vendor[] = [
  {
    id: 1,
    name: 'TechPro Solutions',
    slug: 'techpro-solutions',
    logo: 'https://via.placeholder.com/80?text=TP',
    description: 'Leading supplier of enterprise technology solutions and IT equipment',
    rating: 4.8,
    totalReviews: 1245,
    totalProducts: 567,
    location: 'San Francisco, CA',
    phone: '+1 (555) 123-4567',
    email: 'contact@techpro.com',
    website: 'www.techpro.com',
    verified: true,
    badges: ['Top Seller', 'Fast Shipping'],
    followedDate: '2024-01-15',
    categories: ['Electronics', 'Computers', 'Accessories'],
  },
  {
    id: 2,
    name: 'Fashion Forward Inc',
    slug: 'fashion-forward',
    logo: 'https://via.placeholder.com/80?text=FF',
    description: 'Premium fashion and apparel for the modern professional',
    rating: 4.6,
    totalReviews: 892,
    totalProducts: 1234,
    location: 'New York, NY',
    phone: '+1 (555) 234-5678',
    email: 'hello@fashionforward.com',
    website: 'www.fashionforward.com',
    verified: true,
    badges: ['Trending', 'Best Quality'],
    followedDate: '2024-02-10',
    categories: ['Fashion', "Men's Clothing", "Women's Clothing"],
  },
  {
    id: 3,
    name: 'HomeStyle Living',
    slug: 'homestyle-living',
    logo: 'https://via.placeholder.com/80?text=HL',
    description: 'Quality home furniture and decor for every room',
    rating: 4.7,
    totalReviews: 567,
    totalProducts: 345,
    location: 'Chicago, IL',
    phone: '+1 (555) 345-6789',
    email: 'info@homestyleliving.com',
    website: 'www.homestyleliving.com',
    verified: true,
    badges: ['Eco-Friendly', 'Free Assembly'],
    followedDate: '2024-03-05',
    categories: ['Home & Garden', 'Furniture'],
  },
  {
    id: 4,
    name: 'Athletic Gear Pro',
    slug: 'athletic-gear-pro',
    logo: 'https://via.placeholder.com/80?text=AG',
    description: 'Professional sports equipment and fitness gear',
    rating: 4.9,
    totalReviews: 678,
    totalProducts: 456,
    location: 'Los Angeles, CA',
    phone: '+1 (555) 456-7890',
    email: 'support@athleticgear.com',
    website: 'www.athleticgear.com',
    verified: true,
    badges: ['Top Rated', 'Expert Support'],
    followedDate: '2024-02-28',
    categories: ['Sports & Fitness', 'Exercise Equipment'],
  },
];

const FavoriteVendorsPage: React.FC = () => {
  const [favorites, setFavorites] = useState<Vendor[]>(mockFavoriteVendors);
  const [activeTab, setActiveTab] = useState('all');

  const handleUnfollow = (vendorId: number, vendorName: string) => {
    setFavorites(prev => prev.filter(v => v.id !== vendorId));
    message.success(`Unfollowed ${vendorName}`);
  };

  const handleVisitStore = (vendorSlug: string) => {
    window.location.href = `/customer/vendor-profile?vendor=${vendorSlug}`;
  };

  const getFilteredVendors = () => {
    if (activeTab === 'all') return favorites;
    return favorites.filter(v => 
      v.categories.some(cat => cat.toLowerCase().includes(activeTab.toLowerCase()))
    );
  };

  const filteredVendors = getFilteredVendors();

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={3}>
          <StarFilled style={{ color: '#ff9900' }} /> My Favorite Vendors
        </Title>
        <Paragraph type="secondary">
          Keep track of your favorite vendors and get notified of their latest products and offers
        </Paragraph>
      </div>

      {/* Statistics */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Favorite Vendors"
              value={favorites.length}
              prefix={<StarOutlined />}
              valueStyle={{ color: '#ff9900' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Total Products"
              value={favorites.reduce((sum, v) => sum + v.totalProducts, 0)}
              prefix={<ShopOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Average Rating"
              value={
                favorites.length > 0
                  ? (favorites.reduce((sum, v) => sum + v.rating, 0) / favorites.length).toFixed(1)
                  : 0
              }
              prefix={<TrophyOutlined />}
              suffix="/ 5.0"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Filter Tabs */}
      <Card>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            { key: 'all', label: `All (${favorites.length})` },
            { key: 'electronics', label: 'Electronics' },
            { key: 'fashion', label: 'Fashion' },
            { key: 'home', label: 'Home & Garden' },
            { key: 'sports', label: 'Sports' },
          ]}
        />

        {filteredVendors.length === 0 ? (
          <Empty
            description="No favorite vendors found"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          >
            <Button type="primary" href="/customer/vendors">
              Browse Vendors
            </Button>
          </Empty>
        ) : (
          <Row gutter={[16, 16]}>
            {filteredVendors.map(vendor => (
              <Col xs={24} lg={12} key={vendor.id}>
                <Card
                  hoverable
                  style={{ height: '100%' }}
                  actions={[
                    <Tooltip title="Visit Store">
                      <Button
                        type="text"
                        icon={<EyeOutlined />}
                        onClick={() => handleVisitStore(vendor.slug)}
                      >
                        View Store
                      </Button>
                    </Tooltip>,
                    <Tooltip title="Unfollow">
                      <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleUnfollow(vendor.id, vendor.name)}
                      >
                        Unfollow
                      </Button>
                    </Tooltip>,
                  ]}
                >
                  <div style={{ display: 'flex', gap: 16 }}>
                    <Avatar
                      size={80}
                      src={vendor.logo}
                      alt={vendor.name}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                        <Title level={5} style={{ margin: 0 }}>
                          {vendor.name}
                        </Title>
                        {vendor.verified && (
                          <Tooltip title="Verified Vendor">
                            <Tag color="blue">Verified</Tag>
                          </Tooltip>
                        )}
                      </div>

                      <div style={{ marginBottom: 8 }}>
                        <Rate disabled value={vendor.rating} allowHalf />
                        <Text type="secondary" style={{ marginLeft: 8 }}>
                          {vendor.rating} ({vendor.totalReviews} reviews)
                        </Text>
                      </div>

                      <Paragraph
                        type="secondary"
                        ellipsis={{ rows: 2 }}
                        style={{ marginBottom: 12 }}
                      >
                        {vendor.description}
                      </Paragraph>

                      {/* Badges */}
                      <Space wrap style={{ marginBottom: 12 }}>
                        {vendor.badges.map(badge => (
                          <Tag color="gold" key={badge}>
                            <TrophyOutlined /> {badge}
                          </Tag>
                        ))}
                      </Space>

                      {/* Categories */}
                      <div style={{ marginBottom: 12 }}>
                        <Space wrap size={[0, 4]}>
                          {vendor.categories.map(cat => (
                            <Tag key={cat}>{cat}</Tag>
                          ))}
                        </Space>
                      </div>

                      {/* Contact Info */}
                      <div style={{ fontSize: 12, color: '#8c8c8c' }}>
                        <div style={{ marginBottom: 4 }}>
                          <EnvironmentOutlined /> {vendor.location}
                        </div>
                        <div style={{ marginBottom: 4 }}>
                          <ShopOutlined /> {vendor.totalProducts} products
                        </div>
                        <div style={{ marginBottom: 4 }}>
                          <StarOutlined /> Followed since {new Date(vendor.followedDate).toLocaleDateString()}
                        </div>
                      </div>

                      {/* Quick Contact */}
                      <Space style={{ marginTop: 12 }} wrap>
                        <Tooltip title={vendor.phone}>
                          <Button
                            size="small"
                            icon={<PhoneOutlined />}
                            href={`tel:${vendor.phone}`}
                          />
                        </Tooltip>
                        <Tooltip title={vendor.email}>
                          <Button
                            size="small"
                            icon={<MailOutlined />}
                            href={`mailto:${vendor.email}`}
                          />
                        </Tooltip>
                        <Tooltip title={vendor.website}>
                          <Button
                            size="small"
                            icon={<GlobalOutlined />}
                            href={`https://${vendor.website}`}
                            target="_blank"
                          />
                        </Tooltip>
                      </Space>
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Card>
    </div>
  );
};

export default FavoriteVendorsPage;
