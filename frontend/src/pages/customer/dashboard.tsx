import { Row, Col, Card, Statistic, List, Tag, Button, Avatar, Spin, message } from 'antd';
import {
  ShoppingCartOutlined,
  HeartOutlined,
  WalletOutlined,
  ClockCircleOutlined,
  EyeOutlined,
  CodeOutlined,
  CloudOutlined,
  SecurityScanOutlined,
  ToolOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'umi';
import { useEffect, useState } from 'react';
import { ordersAPI } from '@/services/api/orders';
import { useAuthStore } from '@/store/auth';

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const { isAuthenticated, token } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);
  const [recommendedServices, setRecommendedServices] = useState<any[]>([]);

  // Mock IT Services Data
  const mockITServices = [
    {
      id: 1,
      name: 'Website Development',
      description: 'Complete responsive website development with modern frameworks',
      price: 2999,
      category: 'Web Development',
      rating: 4.9,
      reviews: 247,
      image: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=400&h=300&fit=crop',
      provider: 'TechSolutions Pro',
      duration: '7-14 days',
      icon: <CodeOutlined />
    },
    {
      id: 2,
      name: 'Cloud Migration Service',
      description: 'Seamless migration to AWS/Azure cloud platforms with security',
      price: 4999,
      category: 'Cloud Services',
      rating: 4.8,
      reviews: 189,
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=300&fit=crop',
      provider: 'CloudExperts Inc',
      duration: '5-10 days',
      icon: <CloudOutlined />
    },
    {
      id: 3,
      name: 'Security Audit & Assessment',
      description: 'Comprehensive cybersecurity audit with detailed recommendations',
      price: 1999,
      category: 'Cybersecurity',
      rating: 4.9,
      reviews: 156,
      image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&h=300&fit=crop',
      provider: 'SecureIT Solutions',
      duration: '3-5 days',
      icon: <SecurityScanOutlined />
    },
    {
      id: 4,
      name: 'IT Support & Maintenance',
      description: '24/7 IT support and system maintenance for your business',
      price: 899,
      category: 'IT Support',
      rating: 4.7,
      reviews: 98,
      image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop',
      provider: 'TechSupport Plus',
      duration: 'Ongoing',
      icon: <ToolOutlined />
    }
  ];

  useEffect(() => {
    // Only fetch data if authenticated
    if (!isAuthenticated || !token) {
      console.log('[CUSTOMER DASHBOARD] Not authenticated, skipping API calls');
      setLoading(false);
      return;
    }
    fetchDashboardData();
  }, [isAuthenticated, token]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch customer orders - using mock data for now
      setOrders([
        {
          id: 'ORD-001',
          orderNumber: 'ORD-001',
          serviceName: 'Website Development',
          status: 'in-progress',
          total: 2999,
          createdAt: '2025-11-10',
          items: [{ serviceName: 'Website Development' }]
        },
        {
          id: 'ORD-002', 
          orderNumber: 'ORD-002',
          serviceName: 'Security Audit',
          status: 'completed',
          total: 1999,
          createdAt: '2025-11-05',
          items: [{ serviceName: 'Security Audit' }]
        }
      ]);

      // Set recommended IT services
      setRecommendedServices(mockITServices);

    } catch (error: any) {
      message.error(error.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '80px 0', textAlign: 'center' }}>
        <Spin size="large" />
      </div>
    );
  }

  const activeOrders = orders.filter(o => ['pending', 'confirmed', 'processing', 'shipped'].includes(o.status)).length;

  return (
    <div>
      <h1>Welcome Back to Your IT Services Portal!</h1>
      <p style={{ color: '#666', marginBottom: 24 }}>Manage your IT service orders, discover new solutions, and track your projects.</p>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable onClick={() => navigate('/customer/orders')} style={{ cursor: 'pointer' }}>
            <Statistic
              title="Active Service Orders"
              value={activeOrders}
              prefix={<ShoppingCartOutlined style={{ color: '#1890ff' }} />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable onClick={() => navigate('/customer/wishlist')} style={{ cursor: 'pointer' }}>
            <Statistic
              title="Saved Services"
              value={12}
              prefix={<HeartOutlined style={{ color: '#ff4d4f' }} />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable onClick={() => navigate('/customer/wallet')} style={{ cursor: 'pointer' }}>
            <Statistic
              title="Service Credits"
              value={2500.00}
              prefix={<WalletOutlined style={{ color: '#52c41a' }} />}
              precision={2}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Pending Service Quotes"
              value={3}
              prefix={<ClockCircleOutlined style={{ color: '#faad14' }} />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={12}>
          <Card title="Recent Service Orders" extra={<a onClick={() => navigate('/customer/orders')}>View All</a>}>
            <List
              dataSource={orders.slice(0, 3)}
              renderItem={(order: any) => (
                <List.Item
                  actions={[
                    <Button type="link" icon={<EyeOutlined />} onClick={() => navigate(`/customer/orders/${order.id}`)}>
                      View Details
                    </Button>,
                  ]}
                >
                  <List.Item.Meta
                    title={
                      <div>
                        <span style={{ fontWeight: 500 }}>{order.orderNumber}</span>
                        <Tag color={order.status === 'completed' ? 'success' : 'processing'} style={{ marginLeft: 8 }}>
                          {order.status?.toUpperCase()}
                        </Tag>
                      </div>
                    }
                    description={
                      <div>
                        <div>Service: {order.serviceName}</div>
                        <div style={{ marginTop: 4 }}>
                          <span style={{ fontWeight: 500, color: '#B12704' }}>${order.total?.toFixed(2)}</span>
                          <span style={{ marginLeft: 16, color: '#666', fontSize: 12 }}>
                            {new Date(order.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="Recommended IT Services" extra={<a onClick={() => navigate('/services')}>View All</a>}>
            <List
              dataSource={recommendedServices}
              renderItem={(service: any) => (
                <List.Item
                  actions={[
                    <Button type="primary" size="small" onClick={() => navigate(`/services/${service.id}`)}>
                      View Service
                    </Button>,
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar 
                        shape="square" 
                        size={64} 
                        src={service.image}
                        style={{ background: '#f0f0f0' }}
                        icon={service.icon}
                      />
                    }
                    title={service.name}
                    description={
                      <div>
                        <div style={{ fontWeight: 600, color: '#B12704', fontSize: 16 }}>${service.price}</div>
                        <div style={{ color: '#FF9900', marginTop: 4 }}>⭐ {service.rating} ({service.reviews} reviews)</div>
                        <div style={{ color: '#666', fontSize: 12, marginTop: 4 }}>
                          {service.provider} • {service.duration}
                        </div>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col span={24}>
          <Card
            title="Quick Actions"
            bodyStyle={{ padding: 16 }}
          >
            <Row gutter={16}>
              <Col xs={24} sm={12} md={6}>
                <Button block size="large" onClick={() => navigate('/services')}>
                  Browse IT Services
                </Button>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Button block size="large" onClick={() => navigate('/customer/rfq')}>
                  Request Custom Quote
                </Button>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Button block size="large" onClick={() => navigate('/customer/orders')}>
                  Track Service Orders
                </Button>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Button block size="large" onClick={() => navigate('/help')}>
                  Technical Support
                </Button>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CustomerDashboard;
