import React, { useState, useEffect, useCallback } from 'react';
import {
  Row,
  Col,
  Typography,
  Space,
  Button,
  Pagination,
  Card,
  Statistic,
  Select,
  Input,
  Tabs,
  Badge,
  Tag,
  Slider,
  Checkbox,
  Collapse,
  Divider,
} from 'antd';
import {
  SearchOutlined,
  FilterOutlined,
  CodeOutlined,
  CloudOutlined,
  SafetyOutlined,
  SettingOutlined,
  TeamOutlined,
  AppstoreOutlined,
  UnorderedListOutlined,
  HeartOutlined,
  ShoppingCartOutlined,
} from '@ant-design/icons';
import ServiceGrid from '@/components/services/ServiceGrid';
import type { Service } from '@/components/services/ServiceCard';

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;
const { TabPane } = Tabs;
const { Panel } = Collapse;

// Mock data for demonstration - replace with actual API calls
const mockServices: Service[] = [
  {
    id: 1,
    name: "Custom Web Application Development",
    description: "Full-stack web development using modern technologies like React, Node.js, and cloud deployment",
    shortDescription: "Custom web applications with modern tech stack",
    category: "Software Development",
    subcategory: "Web Development",
    vendor: {
      id: 1,
      name: "TechCraft Solutions",
      rating: 4.8
    },
    images: ["/api/placeholder/300/200"],
    packages: [
      { id: 1, name: "Basic", price: 2500, duration: "2-3 weeks", features: ["5 pages", "Responsive design", "Basic SEO"] },
      { id: 2, name: "Standard", price: 5000, duration: "4-6 weeks", features: ["10 pages", "CMS", "Advanced SEO", "Payment integration"] },
      { id: 3, name: "Premium", price: 10000, duration: "8-12 weeks", features: ["Custom features", "API integration", "Analytics", "Maintenance"] }
    ],
    rating: 4.9,
    reviewCount: 127,
    deliveryTime: "2-12 weeks",
    tags: ["React", "Node.js", "MongoDB", "AWS"],
    isAvailable: true,
    startingPrice: 2500
  },
  {
    id: 2,
    name: "AWS Cloud Migration Services",
    description: "Complete migration of your infrastructure to AWS with optimization and security best practices",
    shortDescription: "Professional AWS cloud migration and optimization",
    category: "Cloud Services",
    subcategory: "Migration",
    vendor: {
      id: 2,
      name: "CloudExperts Inc",
      rating: 4.7
    },
    images: ["/api/placeholder/300/200"],
    packages: [
      { id: 4, name: "Assessment", price: 1500, duration: "1 week", features: ["Infrastructure audit", "Migration plan", "Cost estimation"] },
      { id: 5, name: "Migration", price: 8000, duration: "4-6 weeks", features: ["Data migration", "Application setup", "Testing"] },
      { id: 6, name: "Optimization", price: 5000, duration: "2-3 weeks", features: ["Performance tuning", "Cost optimization", "Security hardening"] }
    ],
    rating: 4.8,
    reviewCount: 89,
    deliveryTime: "1-6 weeks",
    tags: ["AWS", "Docker", "Kubernetes", "Terraform"],
    isAvailable: true,
    startingPrice: 1500
  },
  {
    id: 3,
    name: "Cybersecurity Assessment & Penetration Testing",
    description: "Comprehensive security assessment including vulnerability scanning and penetration testing",
    shortDescription: "Professional cybersecurity assessment and pen testing",
    category: "Cybersecurity",
    subcategory: "Assessment",
    vendor: {
      id: 3,
      name: "SecureShield Security",
      rating: 4.9
    },
    images: ["/api/placeholder/300/200"],
    packages: [
      { id: 7, name: "Basic Scan", price: 2000, duration: "1 week", features: ["Vulnerability scan", "Basic report", "Recommendations"] },
      { id: 8, name: "Full Assessment", price: 5000, duration: "2-3 weeks", features: ["Pen testing", "Detailed report", "Compliance check"] },
      { id: 9, name: "Ongoing Monitoring", price: 3000, duration: "Monthly", features: ["Continuous monitoring", "Monthly reports", "Incident response"] }
    ],
    rating: 4.9,
    reviewCount: 156,
    deliveryTime: "1-3 weeks",
    tags: ["Penetration Testing", "OWASP", "Compliance", "Security Audit"],
    isAvailable: true,
    startingPrice: 2000
  },
  {
    id: 4,
    name: "DevOps CI/CD Pipeline Setup",
    description: "Complete DevOps implementation with automated CI/CD pipelines for faster and safer deployments",
    shortDescription: "Professional DevOps and CI/CD pipeline implementation",
    category: "DevOps",
    subcategory: "Automation",
    vendor: {
      id: 4,
      name: "DevOps Masters",
      rating: 4.6
    },
    images: ["/api/placeholder/300/200"],
    packages: [
      { id: 10, name: "Basic Setup", price: 3000, duration: "2 weeks", features: ["CI/CD pipeline", "Basic monitoring", "Documentation"] },
      { id: 11, name: "Advanced", price: 6000, duration: "4 weeks", features: ["Multi-environment", "Advanced monitoring", "Security scanning"] },
      { id: 12, name: "Enterprise", price: 12000, duration: "6-8 weeks", features: ["Full automation", "Disaster recovery", "Training"] }
    ],
    rating: 4.7,
    reviewCount: 94,
    deliveryTime: "2-8 weeks",
    tags: ["Jenkins", "Docker", "Kubernetes", "GitLab"],
    isAvailable: true,
    startingPrice: 3000
  },
  {
    id: 5,
    name: "IT Strategy Consulting",
    description: "Strategic IT consulting to align technology with business goals and digital transformation",
    shortDescription: "Strategic IT consulting and digital transformation",
    category: "IT Consulting",
    subcategory: "Strategy",
    vendor: {
      id: 5,
      name: "Strategic IT Advisors",
      rating: 4.8
    },
    images: ["/api/placeholder/300/200"],
    packages: [
      { id: 13, name: "Assessment", price: 2500, duration: "1-2 weeks", features: ["IT audit", "Strategy roadmap", "Technology recommendations"] },
      { id: 14, name: "Implementation", price: 8000, duration: "3-6 months", features: ["Project management", "Vendor selection", "Change management"] }
    ],
    rating: 4.8,
    reviewCount: 67,
    deliveryTime: "1-24 weeks",
    tags: ["Digital Transformation", "IT Strategy", "Project Management", "Consulting"],
    isAvailable: true,
    startingPrice: 2500
  },
  {
    id: 6,
    name: "Mobile App Development (iOS & Android)",
    description: "Native and cross-platform mobile application development with modern UI/UX design",
    shortDescription: "Professional mobile app development for iOS and Android",
    category: "Software Development",
    subcategory: "Mobile Development",
    vendor: {
      id: 6,
      name: "MobileFirst Studios",
      rating: 4.7
    },
    images: ["/api/placeholder/300/200"],
    packages: [
      { id: 15, name: "MVP", price: 5000, duration: "6-8 weeks", features: ["Basic features", "Cross-platform", "App store submission"] },
      { id: 16, name: "Standard", price: 12000, duration: "10-14 weeks", features: ["Advanced features", "Backend API", "Push notifications"] },
      { id: 17, name: "Enterprise", price: 25000, duration: "16-24 weeks", features: ["Complex features", "Integrations", "Analytics", "Maintenance"] }
    ],
    rating: 4.6,
    reviewCount: 213,
    deliveryTime: "6-24 weeks",
    tags: ["React Native", "Flutter", "iOS", "Android"],
    isAvailable: true,
    startingPrice: 5000
  }
];

const serviceCategories = [
  { key: 'all', label: 'All Services', icon: <AppstoreOutlined />, count: mockServices.length },
  { key: 'Software Development', label: 'Software Development', icon: <CodeOutlined />, count: mockServices.filter(s => s.category === 'Software Development').length },
  { key: 'Cloud Services', label: 'Cloud Services', icon: <CloudOutlined />, count: mockServices.filter(s => s.category === 'Cloud Services').length },
  { key: 'Cybersecurity', label: 'Cybersecurity', icon: <SafetyOutlined />, count: mockServices.filter(s => s.category === 'Cybersecurity').length },
  { key: 'DevOps', label: 'DevOps', icon: <SettingOutlined />, count: mockServices.filter(s => s.category === 'DevOps').length },
  { key: 'IT Consulting', label: 'IT Consulting', icon: <TeamOutlined />, count: mockServices.filter(s => s.category === 'IT Consulting').length },
];

const ServicesCatalog: React.FC = () => {
  const [services, setServices] = useState<Service[]>(mockServices);
  const [filteredServices, setFilteredServices] = useState<Service[]>(mockServices);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 30000]);
  const [sortBy, setSortBy] = useState('popular');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Get all unique tags from services
  const allTags = Array.from(new Set(services.flatMap(service => service.tags || [])));

  // Filter and search logic
  useEffect(() => {
    let filtered = services;

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(service => service.category === selectedCategory);
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(service =>
        service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Price filter
    filtered = filtered.filter(service => {
      const price = service.startingPrice || Math.min(...service.packages.map(pkg => pkg.price));
      return price >= priceRange[0] && price <= priceRange[1];
    });

    // Tags filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter(service =>
        selectedTags.some(tag => service.tags?.includes(tag))
      );
    }

    // Sort
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => (a.startingPrice || 0) - (b.startingPrice || 0));
        break;
      case 'price-high':
        filtered.sort((a, b) => (b.startingPrice || 0) - (a.startingPrice || 0));
        break;
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'reviews':
        filtered.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
        break;
      default: // popular
        filtered.sort((a, b) => (b.reviewCount || 0) * (b.rating || 0) - (a.reviewCount || 0) * (a.rating || 0));
    }

    setFilteredServices(filtered);
    setCurrentPage(1);
  }, [services, selectedCategory, searchQuery, priceRange, sortBy, selectedTags]);

  const handleAddToCart = (service: Service, packageId?: number) => {
    console.log('Add to cart:', service, packageId);
    // Implement cart functionality
  };

  const handleToggleWishlist = (service: Service) => {
    console.log('Toggle wishlist:', service);
    // Implement wishlist functionality
  };

  const handleView = (serviceId: number) => {
    console.log('View service:', serviceId);
    // Navigate to service detail page
  };

  const handlePageChange = (page: number, size?: number) => {
    setCurrentPage(page);
    if (size && size !== pageSize) {
      setPageSize(size);
    }
  };

  const paginatedServices = filteredServices.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      {/* Header Section */}
      <div style={{ backgroundColor: 'white', padding: '24px 0', borderBottom: '1px solid #f0f0f0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <Row justify="space-between" align="middle">
            <Col>
              <Space direction="vertical" size="small">
                <Title level={1} style={{ margin: 0, fontSize: '2rem' }}>
                  IT Services Marketplace
                </Title>
                <Text type="secondary" style={{ fontSize: '16px' }}>
                  Find the perfect IT services for your business needs
                </Text>
              </Space>
            </Col>
            
            <Col>
              <Space size="large">
                <Statistic
                  title="Services"
                  value={filteredServices.length}
                  prefix={<AppstoreOutlined />}
                />
                <Statistic
                  title="Categories"
                  value={serviceCategories.length - 1}
                  prefix={<CodeOutlined />}
                />
              </Space>
            </Col>
          </Row>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>
        {/* Search and Category Tabs */}
        <Card style={{ marginBottom: 24 }}>
          <Space direction="vertical" style={{ width: '100%' }} size="middle">
            <Row gutter={16} align="middle">
              <Col flex="auto">
                <Search
                  placeholder="Search for services, vendors, or technologies..."
                  size="large"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onSearch={(value) => setSearchQuery(value)}
                />
              </Col>
              <Col>
                <Select
                  value={sortBy}
                  onChange={setSortBy}
                  style={{ width: 150 }}
                  size="large"
                >
                  <Option value="popular">Most Popular</Option>
                  <Option value="rating">Highest Rated</Option>
                  <Option value="reviews">Most Reviews</Option>
                  <Option value="price-low">Price: Low to High</Option>
                  <Option value="price-high">Price: High to Low</Option>
                </Select>
              </Col>
              <Col>
                <Button.Group size="large">
                  <Button
                    icon={<AppstoreOutlined />}
                    type={viewMode === 'grid' ? 'primary' : 'default'}
                    onClick={() => setViewMode('grid')}
                  />
                  <Button
                    icon={<UnorderedListOutlined />}
                    type={viewMode === 'list' ? 'primary' : 'default'}
                    onClick={() => setViewMode('list')}
                  />
                </Button.Group>
              </Col>
            </Row>

            {/* Category Tabs */}
            <Tabs
              activeKey={selectedCategory}
              onChange={setSelectedCategory}
              size="large"
            >
              {serviceCategories.map(category => (
                <TabPane
                  tab={
                    <Space>
                      {category.icon}
                      <span>{category.label}</span>
                      <Badge count={category.count} showZero style={{ backgroundColor: '#1890ff' }} />
                    </Space>
                  }
                  key={category.key}
                />
              ))}
            </Tabs>
          </Space>
        </Card>

        {/* Main Content */}
        <Row gutter={[24, 24]}>
          {/* Filters Sidebar */}
          <Col xs={24} sm={24} md={6} lg={6}>
            <Card title="Filters" style={{ position: 'sticky', top: 24 }}>
              <Space direction="vertical" style={{ width: '100%' }} size="middle">
                
                {/* Price Range */}
                <div>
                  <Text strong>Price Range</Text>
                  <Slider
                    range
                    min={0}
                    max={30000}
                    step={500}
                    value={priceRange}
                    onChange={(value) => setPriceRange(value as [number, number])}
                    tipFormatter={(value) => `$${value}`}
                    style={{ margin: '16px 0' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text type="secondary">${priceRange[0]}</Text>
                    <Text type="secondary">${priceRange[1]}</Text>
                  </div>
                </div>

                <Divider />

                {/* Technology Tags */}
                <div>
                  <Text strong>Technologies</Text>
                  <div style={{ marginTop: 12 }}>
                    {allTags.slice(0, 15).map(tag => (
                      <Tag.CheckableTag
                        key={tag}
                        checked={selectedTags.includes(tag)}
                        onChange={(checked) => {
                          if (checked) {
                            setSelectedTags([...selectedTags, tag]);
                          } else {
                            setSelectedTags(selectedTags.filter(t => t !== tag));
                          }
                        }}
                        style={{ marginBottom: 4 }}
                      >
                        {tag}
                      </Tag.CheckableTag>
                    ))}
                  </div>
                </div>

                <Divider />

                {/* Clear Filters */}
                <Button
                  block
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                    setPriceRange([0, 30000]);
                    setSortBy('popular');
                    setSelectedTags([]);
                  }}
                >
                  Clear All Filters
                </Button>
              </Space>
            </Card>
          </Col>

          {/* Services Grid */}
          <Col xs={24} sm={24} md={18} lg={18}>
            <Card
              title={
                <Row justify="space-between" align="middle">
                  <Col>
                    <Text strong style={{ fontSize: 16 }}>
                      {filteredServices.length} Services Found
                    </Text>
                  </Col>
                </Row>
              }
            >
              <ServiceGrid
                services={paginatedServices}
                wishlist={[]} // Mock wishlist
                loading={loading}
                onAddToCart={handleAddToCart}
                onToggleWishlist={handleToggleWishlist}
                onView={handleView}
              />

              {/* Pagination */}
              {filteredServices.length > pageSize && (
                <div style={{ textAlign: 'center', marginTop: 32 }}>
                  <Pagination
                    current={currentPage}
                    total={filteredServices.length}
                    pageSize={pageSize}
                    onChange={handlePageChange}
                    onShowSizeChange={handlePageChange}
                    showSizeChanger
                    showQuickJumper
                    showTotal={(total, range) => 
                      `${range[0]}-${range[1]} of ${total} services`
                    }
                    pageSizeOptions={['12', '24', '36', '48']}
                  />
                </div>
              )}
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default ServicesCatalog;