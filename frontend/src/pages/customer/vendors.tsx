import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Input,
  Select,
  Button,
  Space,
  Typography,
  Avatar,
  Rate,
  Tag,
  Pagination,
  Empty,
  Badge,
  Statistic,
} from 'antd';
import {
  SearchOutlined,
  ShopOutlined,
  StarFilled,
  EnvironmentOutlined,
  CheckCircleFilled,
  TrophyOutlined,
  FilterOutlined,
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;
const { Option } = Select;

interface Vendor {
  id: number;
  name: string;
  logo: string;
  description: string;
  rating: number;
  totalReviews: number;
  totalProducts: number;
  totalSales: number;
  verified: boolean;
  location: string;
  categories: string[];
  badges: string[];
  responseRate: number;
  joinDate: string;
}

const mockVendors: Vendor[] = [
  {
    id: 1,
    name: 'AudioTech Pro Store',
    logo: 'https://via.placeholder.com/100x100?text=AudioTech',
    description: 'Premium audio equipment and electronics. Specializing in high-quality headphones and speakers.',
    rating: 4.7,
    totalReviews: 2456,
    totalProducts: 156,
    totalSales: 12450,
    verified: true,
    location: 'California, USA',
    categories: ['Electronics', 'Audio'],
    badges: ['Top Seller', 'Fast Shipping'],
    responseRate: 98,
    joinDate: 'Jan 2020',
  },
  {
    id: 2,
    name: 'TechGear Plus',
    logo: 'https://via.placeholder.com/100x100?text=TechGear',
    description: 'Your one-stop shop for all tech accessories and gadgets. Quality products at competitive prices.',
    rating: 4.5,
    totalReviews: 1823,
    totalProducts: 234,
    totalSales: 9876,
    verified: true,
    location: 'New York, USA',
    categories: ['Electronics', 'Accessories'],
    badges: ['Verified Business'],
    responseRate: 95,
    joinDate: 'Mar 2020',
  },
  {
    id: 3,
    name: 'HomeStyle Essentials',
    logo: 'https://via.placeholder.com/100x100?text=HomeStyle',
    description: 'Quality home goods and lifestyle products. Making your home beautiful and comfortable.',
    rating: 4.8,
    totalReviews: 3120,
    totalProducts: 189,
    totalSales: 15600,
    verified: true,
    location: 'Texas, USA',
    categories: ['Home & Garden', 'Lifestyle'],
    badges: ['Top Seller', 'Verified Business', 'Best Quality'],
    responseRate: 99,
    joinDate: 'Nov 2019',
  },
  {
    id: 4,
    name: 'Fashion Forward',
    logo: 'https://via.placeholder.com/100x100?text=Fashion',
    description: 'Latest fashion trends and accessories. Express your unique style with our curated collections.',
    rating: 4.6,
    totalReviews: 1456,
    totalProducts: 312,
    totalSales: 8920,
    verified: false,
    location: 'Florida, USA',
    categories: ['Fashion', 'Accessories'],
    badges: ['Trendy Collection'],
    responseRate: 92,
    joinDate: 'Jun 2021',
  },
  {
    id: 5,
    name: 'Sports & Fitness Hub',
    logo: 'https://via.placeholder.com/100x100?text=Sports',
    description: 'Premium sports equipment and fitness gear. Achieve your fitness goals with quality products.',
    rating: 4.4,
    totalReviews: 892,
    totalProducts: 145,
    totalSales: 5670,
    verified: true,
    location: 'Colorado, USA',
    categories: ['Sports', 'Fitness'],
    badges: ['Fast Shipping'],
    responseRate: 94,
    joinDate: 'Feb 2022',
  },
  {
    id: 6,
    name: 'Book Haven',
    logo: 'https://via.placeholder.com/100x100?text=Books',
    description: 'Your literary paradise. Wide selection of books across all genres and interests.',
    rating: 4.9,
    totalReviews: 4230,
    totalProducts: 567,
    totalSales: 22340,
    verified: true,
    location: 'Massachusetts, USA',
    categories: ['Books', 'Education'],
    badges: ['Top Seller', 'Verified Business', 'Best Reviews'],
    responseRate: 100,
    joinDate: 'Aug 2019',
  },
];

const VendorStorePage: React.FC = () => {
  const [vendors, setVendors] = useState<Vendor[]>(mockVendors);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('rating');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  const categories = ['all', 'Electronics', 'Fashion', 'Home & Garden', 'Sports', 'Books'];

  // Filter vendors
  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = searchQuery === '' ||
      vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' ||
      vendor.categories.some(cat => cat.includes(selectedCategory));
    return matchesSearch && matchesCategory;
  });

  // Sort vendors
  const sortedVendors = [...filteredVendors].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating;
      case 'sales':
        return b.totalSales - a.totalSales;
      case 'products':
        return b.totalProducts - a.totalProducts;
      case 'newest':
        return new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime();
      default:
        return 0;
    }
  });

  const paginatedVendors = sortedVendors.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleVendorClick = (vendorId: number) => {
    console.log('Navigate to vendor profile:', vendorId);
    // Navigate to /customer/vendor-profile/:id
  };

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      {/* Header */}
      <Card style={{ marginBottom: 24 }}>
        <Title level={3}>
          <ShopOutlined /> Vendor Stores
        </Title>
        <Paragraph type="secondary">
          Discover trusted sellers and explore their product collections
        </Paragraph>

        {/* Search and Filters */}
        <Row gutter={16} style={{ marginTop: 24 }}>
          <Col xs={24} md={12}>
            <Search
              placeholder="Search vendors by name or description..."
              allowClear
              size="large"
              prefix={<SearchOutlined />}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </Col>
          <Col xs={12} md={6}>
            <Select
              value={selectedCategory}
              onChange={setSelectedCategory}
              size="large"
              style={{ width: '100%' }}
              placeholder="Category"
            >
              {categories.map(cat => (
                <Option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={12} md={6}>
            <Select
              value={sortBy}
              onChange={setSortBy}
              size="large"
              style={{ width: '100%' }}
              placeholder="Sort by"
            >
              <Option value="rating">Highest Rated</Option>
              <Option value="sales">Most Sales</Option>
              <Option value="products">Most Products</Option>
              <Option value="newest">Newest</Option>
            </Select>
          </Col>
        </Row>
      </Card>

      {/* Stats */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Total Vendors"
              value={sortedVendors.length}
              prefix={<ShopOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Verified Sellers"
              value={sortedVendors.filter(v => v.verified).length}
              prefix={<CheckCircleFilled />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Total Products"
              value={sortedVendors.reduce((sum, v) => sum + v.totalProducts, 0)}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Avg Rating"
              value={(sortedVendors.reduce((sum, v) => sum + v.rating, 0) / sortedVendors.length).toFixed(1)}
              prefix={<StarFilled />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Vendor List */}
      {paginatedVendors.length === 0 ? (
        <Card>
          <Empty description="No vendors found matching your criteria" />
        </Card>
      ) : (
        <>
          <Row gutter={[16, 16]}>
            {paginatedVendors.map(vendor => (
              <Col xs={24} md={12} key={vendor.id}>
                <Card
                  hoverable
                  onClick={() => handleVendorClick(vendor.id)}
                  style={{ height: '100%' }}
                >
                  <Row gutter={16}>
                    <Col flex="none">
                      <Badge.Ribbon
                        text="Verified"
                        color="green"
                        style={{ display: vendor.verified ? 'block' : 'none' }}
                      >
                        <Avatar src={vendor.logo} size={80} shape="square" />
                      </Badge.Ribbon>
                    </Col>
                    <Col flex="auto">
                      <Space direction="vertical" size="small" style={{ width: '100%' }}>
                        <div>
                          <Title level={5} style={{ margin: 0 }}>
                            {vendor.name}
                            {vendor.verified && (
                              <CheckCircleFilled
                                style={{ color: '#52c41a', marginLeft: 8, fontSize: 16 }}
                              />
                            )}
                          </Title>
                        </div>

                        <Paragraph
                          ellipsis={{ rows: 2 }}
                          type="secondary"
                          style={{ marginBottom: 8 }}
                        >
                          {vendor.description}
                        </Paragraph>

                        <Space size="middle" wrap>
                          <Space size="small">
                            <StarFilled style={{ color: '#faad14' }} />
                            <Text strong>{vendor.rating}</Text>
                            <Text type="secondary">({vendor.totalReviews})</Text>
                          </Space>
                          <Space size="small">
                            <ShopOutlined />
                            <Text>{vendor.totalProducts} products</Text>
                          </Space>
                          <Space size="small">
                            <TrophyOutlined />
                            <Text>{vendor.totalSales.toLocaleString()} sales</Text>
                          </Space>
                        </Space>

                        <div>
                          <Space size="small">
                            <EnvironmentOutlined />
                            <Text type="secondary">{vendor.location}</Text>
                          </Space>
                          <Text type="secondary"> • </Text>
                          <Text type="secondary">Joined {vendor.joinDate}</Text>
                        </div>

                        <div>
                          <Space wrap size={[0, 8]}>
                            {vendor.categories.map((cat, idx) => (
                              <Tag key={idx} color="blue">{cat}</Tag>
                            ))}
                          </Space>
                        </div>

                        <div>
                          <Space wrap size={[0, 8]}>
                            {vendor.badges.map((badge, idx) => (
                              <Tag key={idx} color="gold" icon={<TrophyOutlined />}>
                                {badge}
                              </Tag>
                            ))}
                          </Space>
                        </div>

                        <div style={{ marginTop: 8 }}>
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            Response Rate: <Text strong>{vendor.responseRate}%</Text>
                          </Text>
                        </div>
                      </Space>
                    </Col>
                  </Row>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Pagination */}
          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <Pagination
              current={currentPage}
              total={sortedVendors.length}
              pageSize={pageSize}
              onChange={setCurrentPage}
              showSizeChanger={false}
              showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} vendors`}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default VendorStorePage;
