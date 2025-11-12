import React from 'react';
import { Row, Col, Card, Button, Input, Space, Typography, Rate, Avatar } from 'antd';
import { useNavigate } from 'umi';
import { 
  SearchOutlined, 
  LaptopOutlined,
  MobileOutlined,
  CloudOutlined,
  SecurityScanOutlined,
  CodeOutlined,
  DatabaseOutlined,
  WifiOutlined,
  ToolOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  StarFilled,
  ArrowRightOutlined,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  SafetyOutlined,
  TrophyOutlined,
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;

const HomePage = () => {
  const navigate = useNavigate();

  // Service Categories for IT Business
  const serviceCategories = [
    {
      title: 'Software Development',
      icon: <CodeOutlined />,
      services: ['Web Development', 'Mobile Apps', 'Custom Software'],
      image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop',
      color: '#1890FF'
    },
    {
      title: 'Cloud Services',
      icon: <CloudOutlined />,
      services: ['AWS Setup', 'Azure Migration', 'Cloud Security'],
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=300&fit=crop',
      color: '#52C41A'
    },
    {
      title: 'IT Support',
      icon: <ToolOutlined />,
      services: ['Technical Support', 'System Maintenance', 'Troubleshooting'],
      image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop',
      color: '#FA8C16'
    },
    {
      title: 'Cybersecurity',
      icon: <SecurityScanOutlined />,
      services: ['Security Audits', 'Firewall Setup', 'Data Protection'],
      image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&h=300&fit=crop',
      color: '#F5222D'
    },
    {
      title: 'Network Solutions',
      icon: <WifiOutlined />,
      services: ['Network Setup', 'Wi-Fi Installation', 'Network Security'],
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=300&fit=crop',
      color: '#722ED1'
    },
    {
      title: 'Database Services',
      icon: <DatabaseOutlined />,
      services: ['Database Design', 'Data Migration', 'Backup Solutions'],
      image: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=400&h=300&fit=crop',
      color: '#13C2C2'
    },
  ];

  // Popular IT Services
  const popularServices = [
    {
      id: 1,
      title: 'Website Development',
      description: 'Complete website development with modern frameworks',
      price: 1999,
      originalPrice: 2499,
      duration: '7-10 days',
      rating: 4.9,
      reviews: 1247,
      image: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=400&h=300&fit=crop',
      professional: { name: 'John Smith', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face' }
    },
    {
      id: 2,
      title: 'Cloud Migration',
      description: 'Seamless migration to AWS/Azure cloud platforms',
      price: 2999,
      originalPrice: 3499,
      duration: '5-7 days',
      rating: 4.8,
      reviews: 892,
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=300&fit=crop',
      professional: { name: 'Sarah Johnson', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face' }
    },
    {
      id: 3,
      title: 'IT Security Audit',
      description: 'Comprehensive security assessment and recommendations',
      price: 1499,
      originalPrice: 1899,
      duration: '3-5 days',
      rating: 4.9,
      reviews: 567,
      image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&h=300&fit=crop',
      professional: { name: 'Mike Chen', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face' }
    },
    {
      id: 4,
      title: 'Network Setup',
      description: 'Enterprise-grade network infrastructure setup',
      price: 899,
      originalPrice: 1199,
      duration: '1-2 days',
      rating: 4.7,
      reviews: 423,
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=300&fit=crop',
      professional: { name: 'Alex Rodriguez', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face' }
    },
    {
      id: 5,
      title: 'Mobile App Development',
      description: 'iOS and Android mobile application development',
      price: 2499,
      originalPrice: 2999,
      duration: '14-21 days',
      rating: 4.8,
      reviews: 334,
      image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop',
      professional: { name: 'Emily Davis', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face' }
    },
    {
      id: 6,
      title: 'Database Optimization',
      description: 'Performance tuning and database optimization',
      price: 799,
      originalPrice: 999,
      duration: '2-3 days',
      rating: 4.6,
      reviews: 289,
      image: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=400&h=300&fit=crop',
      professional: { name: 'David Wilson', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face' }
    }
  ];

  return (
    <div style={{ background: '#f8f9fa' }}>
      {/* Header Navigation */}
      <div style={{ 
        background: 'white', 
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '16px 20px' }}>
          <Row align="middle" justify="space-between">
            <Col>
              <div 
                style={{ 
                  fontSize: 28, 
                  fontWeight: 'bold', 
                  color: '#1890FF',
                  cursor: 'pointer' 
                }}
                onClick={() => navigate('/')}
              >
                GROOW
              </div>
              <Text type="secondary" style={{ fontSize: 12 }}>
                Professional IT Services at Your Doorstep
              </Text>
            </Col>
            
            <Col flex={1} style={{ maxWidth: 500, margin: '0 40px' }}>
              <Search
                placeholder="Search IT services..."
                size="large"
                enterButton={
                  <Button 
                    type="primary"
                    icon={<SearchOutlined />}
                    style={{ height: 40 }}
                  />
                }
                onSearch={(value) => navigate(`/search?q=${value}`)}
              />
            </Col>

            <Col>
              <Space size="large">
                <Button 
                  type="text" 
                  onClick={() => navigate('/login')}
                  style={{ height: 40 }}
                >
                  Sign in
                </Button>
                <Button 
                  type="primary" 
                  onClick={() => navigate('/register')}
                  style={{ height: 40 }}
                >
                  Get Started
                </Button>
              </Space>
            </Col>
          </Row>
        </div>
      </div>

      {/* Hero Section */}
      <div style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '80px 20px',
        color: 'white',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Title 
            level={1} 
            style={{ 
              color: 'white', 
              fontSize: 52, 
              marginBottom: 24, 
              fontWeight: 700,
              lineHeight: 1.2
            }}
          >
            Professional IT Services
            <br />
            at Your Doorstep
          </Title>
          <Paragraph 
            style={{ 
              fontSize: 20, 
              color: 'white', 
              marginBottom: 40, 
              opacity: 0.95,
              maxWidth: 600,
              margin: '0 auto 40px'
            }}
          >
            Connect with verified IT professionals for all your technology needs. 
            From software development to cybersecurity, we've got you covered.
          </Paragraph>
          
          <Space direction="vertical" align="center" size="large">
            <div style={{ maxWidth: 400, width: '100%' }}>
              <Search
                placeholder="What IT service do you need?"
                size="large"
                enterButton={
                  <Button 
                    size="large"
                    style={{ 
                      background: '#FF6B6B', 
                      borderColor: '#FF6B6B',
                      fontWeight: 600,
                      height: 50,
                      fontSize: 16
                    }}
                  >
                    Find Services
                  </Button>
                }
                style={{ marginBottom: 20 }}
              />
            </div>
            
            <Row gutter={40} style={{ marginTop: 40 }}>
              <Col>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 8 }}>4.8★</div>
                  <div style={{ fontSize: 14, opacity: 0.9 }}>Service Rating</div>
                </div>
              </Col>
              <Col>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 8 }}>50K+</div>
                  <div style={{ fontSize: 14, opacity: 0.9 }}>Happy Customers</div>
                </div>
              </Col>
              <Col>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 8 }}>24/7</div>
                  <div style={{ fontSize: 14, opacity: 0.9 }}>Support Available</div>
                </div>
              </Col>
            </Row>
          </Space>
        </div>
      </div>

      {/* Service Categories */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 20px' }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: 16 }}>
          What are you looking for?
        </Title>
        <Text 
          style={{ 
            display: 'block', 
            textAlign: 'center', 
            fontSize: 16, 
            color: '#666',
            marginBottom: 50 
          }}
        >
          Choose from our wide range of professional IT services
        </Text>
        
        <Row gutter={[24, 24]}>
          {serviceCategories.map((category, index) => (
            <Col xs={24} sm={12} md={8} lg={4} key={index}>
              <Card
                hoverable
                onClick={() => navigate(`/services/${category.title.toLowerCase().replace(/\s+/g, '-')}`)}
                style={{ 
                  height: '100%',
                  border: 'none',
                  borderRadius: 12,
                  overflow: 'hidden'
                }}
                styles={{ body: { padding: 0 } }}
              >
                <div 
                  style={{ 
                    height: 120,
                    background: `url(${category.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    position: 'relative'
                  }}
                >
                  <div 
                    style={{
                      position: 'absolute',
                      top: 16,
                      left: 16,
                      width: 40,
                      height: 40,
                      borderRadius: 8,
                      background: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 20,
                      color: category.color
                    }}
                  >
                    {category.icon}
                  </div>
                </div>
                <div style={{ padding: 16 }}>
                  <Title level={5} style={{ marginBottom: 8, fontSize: 16 }}>
                    {category.title}
                  </Title>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {category.services.join(' • ')}
                  </Text>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* Most Booked Services */}
      <div style={{ background: 'white', padding: '80px 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
          <div style={{ marginBottom: 40 }}>
            <Title level={2} style={{ marginBottom: 16 }}>Most booked services</Title>
            <Text style={{ fontSize: 16, color: '#666' }}>
              Popular IT services trusted by thousands of customers
            </Text>
          </div>

          <Row gutter={[24, 24]}>
            {popularServices.map((service) => (
              <Col xs={24} sm={12} md={8} lg={8} xl={6} key={service.id}>
                <Card
                  hoverable
                  onClick={() => navigate(`/service/${service.id}`)}
                  style={{ 
                    border: '1px solid #f0f0f0',
                    borderRadius: 12,
                    overflow: 'hidden'
                  }}
                  styles={{ body: { padding: 16 } }}
                  cover={
                    <div style={{ 
                      height: 180, 
                      background: `url(${service.image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      position: 'relative'
                    }}>
                      {service.originalPrice && (
                        <div 
                          style={{
                            position: 'absolute',
                            top: 12,
                            right: 12,
                            background: '#FF4D4F',
                            color: 'white',
                            padding: '4px 8px',
                            borderRadius: 4,
                            fontSize: 12,
                            fontWeight: 'bold'
                          }}
                        >
                          Save ${service.originalPrice - service.price}
                        </div>
                      )}
                    </div>
                  }
                >
                  <div style={{ marginBottom: 12 }}>
                    <Title level={5} style={{ marginBottom: 4, fontSize: 16 }}>
                      {service.title}
                    </Title>
                    <Text type="secondary" style={{ fontSize: 13 }}>
                      {service.description}
                    </Text>
                  </div>

                  <div style={{ marginBottom: 12 }}>
                    <Space size={4}>
                      <Rate disabled defaultValue={service.rating} style={{ fontSize: 12 }} />
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {service.rating} ({service.reviews.toLocaleString()})
                      </Text>
                    </Space>
                  </div>

                  <div style={{ marginBottom: 12 }}>
                    <Space align="baseline">
                      <Text strong style={{ fontSize: 20, color: '#1890FF' }}>
                        ${service.price}
                      </Text>
                      {service.originalPrice && (
                        <Text delete type="secondary" style={{ fontSize: 14 }}>
                          ${service.originalPrice}
                        </Text>
                      )}
                    </Space>
                    <div style={{ marginTop: 4 }}>
                      <Space size={4}>
                        <ClockCircleOutlined style={{ fontSize: 12, color: '#666' }} />
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          {service.duration}
                        </Text>
                      </Space>
                    </div>
                  </div>

                  <div style={{ marginBottom: 16, paddingTop: 12, borderTop: '1px solid #f0f0f0' }}>
                    <Space size={8}>
                      <Avatar size={32} src={service.professional.avatar} />
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 500 }}>
                          {service.professional.name}
                        </div>
                        <Text type="secondary" style={{ fontSize: 11 }}>
                          Verified Professional
                        </Text>
                      </div>
                    </Space>
                  </div>

                  <Button
                    type="primary"
                    block
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/book/${service.id}`);
                    }}
                    style={{
                      height: 40,
                      fontWeight: 600,
                      borderRadius: 8
                    }}
                  >
                    Book Now
                  </Button>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </div>

      {/* Why Choose Us */}
      <div style={{ padding: '80px 0', background: '#f8f9fa' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
          <Title level={2} style={{ textAlign: 'center', marginBottom: 50 }}>
            Why choose GROOW?
          </Title>
          
          <Row gutter={[32, 32]}>
            <Col xs={24} sm={12} md={6}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ 
                  width: 80, 
                  height: 80, 
                  borderRadius: '50%',
                  background: '#E6F7FF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px'
                }}>
                  <CheckCircleOutlined style={{ fontSize: 32, color: '#1890FF' }} />
                </div>
                <Title level={4} style={{ marginBottom: 12 }}>Verified Professionals</Title>
                <Text type="secondary" style={{ fontSize: 14 }}>
                  All our IT professionals are background verified and certified
                </Text>
              </div>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ 
                  width: 80, 
                  height: 80, 
                  borderRadius: '50%',
                  background: '#F6FFED',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px'
                }}>
                  <SafetyOutlined style={{ fontSize: 32, color: '#52C41A' }} />
                </div>
                <Title level={4} style={{ marginBottom: 12 }}>100% Secure</Title>
                <Text type="secondary" style={{ fontSize: 14 }}>
                  Your data and privacy are completely protected with us
                </Text>
              </div>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ 
                  width: 80, 
                  height: 80, 
                  borderRadius: '50%',
                  background: '#FFF7E6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px'
                }}>
                  <TrophyOutlined style={{ fontSize: 32, color: '#FA8C16' }} />
                </div>
                <Title level={4} style={{ marginBottom: 12 }}>Quality Guaranteed</Title>
                <Text type="secondary" style={{ fontSize: 14 }}>
                  30-day service guarantee on all IT solutions
                </Text>
              </div>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ 
                  width: 80, 
                  height: 80, 
                  borderRadius: '50%',
                  background: '#F9F0FF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px'
                }}>
                  <TeamOutlined style={{ fontSize: 32, color: '#722ED1' }} />
                </div>
                <Title level={4} style={{ marginBottom: 12 }}>24/7 Support</Title>
                <Text type="secondary" style={{ fontSize: 14 }}>
                  Round-the-clock customer support for all your queries
                </Text>
              </div>
            </Col>
          </Row>
        </div>
      </div>

      {/* CTA Section */}
      <div style={{ 
        background: 'linear-gradient(135deg, #1890FF 0%, #096DD9 100%)',
        padding: '80px 20px',
        color: 'white',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <Title level={2} style={{ color: 'white', marginBottom: 24 }}>
            Ready to get started?
          </Title>
          <Paragraph style={{ fontSize: 18, color: 'white', opacity: 0.9, marginBottom: 40 }}>
            Join thousands of satisfied customers who trust GROOW for their IT needs
          </Paragraph>
          <Space size="large">
            <Button 
              size="large" 
              style={{ 
                height: 50, 
                fontSize: 16, 
                padding: '0 40px',
                fontWeight: 600
              }}
              onClick={() => navigate('/services')}
            >
              Browse Services
            </Button>
            <Button 
              type="default" 
              size="large"
              style={{ 
                height: 50, 
                fontSize: 16, 
                padding: '0 40px',
                fontWeight: 600,
                color: 'white',
                borderColor: 'white',
                background: 'transparent'
              }}
              onClick={() => navigate('/contact')}
            >
              Contact Us
            </Button>
          </Space>
        </div>
      </div>

      {/* Footer */}
      <div style={{ background: '#001529', color: 'white', padding: '60px 20px 40px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Row gutter={[40, 40]}>
            <Col xs={24} sm={12} md={6}>
              <Title level={4} style={{ color: 'white', marginBottom: 20 }}>
                GROOW
              </Title>
              <Text style={{ color: '#ccc', marginBottom: 20, display: 'block' }}>
                Professional IT services at your doorstep. Trusted by thousands of customers worldwide.
              </Text>
              <Space>
                <Button type="text" style={{ color: '#ccc' }} icon={<PhoneOutlined />}>
                  +1 (555) 123-4567
                </Button>
              </Space>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Title level={5} style={{ color: 'white', marginBottom: 16 }}>
                Services
              </Title>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {['Software Development', 'Cloud Services', 'IT Support', 'Cybersecurity', 'Network Solutions'].map(service => (
                  <Button 
                    key={service}
                    type="text" 
                    style={{ 
                      color: '#ccc', 
                      justifyContent: 'flex-start',
                      padding: '4px 0',
                      height: 'auto'
                    }}
                    onClick={() => navigate(`/services/${service.toLowerCase().replace(/\s+/g, '-')}`)}
                  >
                    {service}
                  </Button>
                ))}
              </div>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Title level={5} style={{ color: 'white', marginBottom: 16 }}>
                Company
              </Title>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {['About Us', 'Careers', 'Contact Us', 'Privacy Policy', 'Terms & Conditions'].map(item => (
                  <Button 
                    key={item}
                    type="text" 
                    style={{ 
                      color: '#ccc', 
                      justifyContent: 'flex-start',
                      padding: '4px 0',
                      height: 'auto'
                    }}
                    onClick={() => navigate(`/${item.toLowerCase().replace(/\s+/g, '-')}`)}
                  >
                    {item}
                  </Button>
                ))}
              </div>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Title level={5} style={{ color: 'white', marginBottom: 16 }}>
                Contact Info
              </Title>
              <Space direction="vertical" size="middle">
                <Space>
                  <MailOutlined style={{ color: '#1890FF' }} />
                  <Text style={{ color: '#ccc' }}>hello@groow.com</Text>
                </Space>
                <Space>
                  <EnvironmentOutlined style={{ color: '#1890FF' }} />
                  <Text style={{ color: '#ccc' }}>New York, NY 10001</Text>
                </Space>
              </Space>
            </Col>
          </Row>
          
          <div style={{ 
            borderTop: '1px solid #333', 
            marginTop: 40, 
            paddingTop: 20, 
            textAlign: 'center'
          }}>
            <Text style={{ color: '#666' }}>
              © 2025 GROOW. All rights reserved.
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;