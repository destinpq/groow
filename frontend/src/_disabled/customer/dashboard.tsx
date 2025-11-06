import { Row, Col, Card, Statistic, List, Tag, Button, Avatar, Spin, message } from 'antd';
import {
  ShoppingCartOutlined,
  HeartOutlined,
  WalletOutlined,
  ClockCircleOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'umi';
import { useEffect, useState } from 'react';
import { ordersAPI } from '@/services/api/orders';
import { productAPI } from '@/services/api/products';

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch customer orders
      const ordersResponse = await ordersAPI.getAll({ limit: 5 });
      setOrders(ordersResponse.data || []);

      // Fetch recommended products
      const productsResponse = await productAPI.getFeatured();
      setRecommendations(productsResponse.slice(0, 4));

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
      <h1>Welcome Back!</h1>
      <p style={{ color: '#666', marginBottom: 24 }}>Here's what's happening with your account today.</p>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable onClick={() => navigate('/customer/orders')} style={{ cursor: 'pointer' }}>
            <Statistic
              title="Active Orders"
              value={activeOrders}
              prefix={<ShoppingCartOutlined style={{ color: '#1890ff' }} />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable onClick={() => navigate('/customer/wishlist')} style={{ cursor: 'pointer' }}>
            <Statistic
              title="Wishlist Items"
              value={12}
              prefix={<HeartOutlined style={{ color: '#ff4d4f' }} />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable onClick={() => navigate('/customer/wallet')} style={{ cursor: 'pointer' }}>
            <Statistic
              title="Wallet Balance"
              value={250.00}
              prefix={<WalletOutlined style={{ color: '#52c41a' }} />}
              precision={2}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Pending RFQs"
              value={2}
              prefix={<ClockCircleOutlined style={{ color: '#faad14' }} />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={12}>
          <Card title="Recent Orders" extra={<a onClick={() => navigate('/customer/orders')}>View All</a>}>
            <List
              dataSource={orders.slice(0, 3)}
              renderItem={(order: any) => (
                <List.Item
                  actions={[
                    <Button type="link" icon={<EyeOutlined />} onClick={() => navigate(`/customer/orders/${order.id}`)}>
                      View
                    </Button>,
                  ]}
                >
                  <List.Item.Meta
                    title={
                      <div>
                        <span style={{ fontWeight: 500 }}>{order.orderNumber}</span>
                        <Tag color={order.status === 'delivered' ? 'success' : 'processing'} style={{ marginLeft: 8 }}>
                          {order.status?.toUpperCase()}
                        </Tag>
                      </div>
                    }
                    description={
                      <div>
                        <div>{order.items?.length || 0} items</div>
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
          <Card title="Recommended for You" extra={<a onClick={() => navigate('/products')}>View All</a>}>
            <List
              dataSource={recommendations}
              renderItem={(product) => (
                <List.Item
                  actions={[
                    <Button type="primary" size="small" onClick={() => navigate(`/products/${product.id}`)}>
                      View
                    </Button>,
                  ]}
                >
                  <List.Item.Meta
                    avatar={<Avatar shape="square" size={64} src={product.image} />}
                    title={product.name}
                    description={
                      <div>
                        <div style={{ fontWeight: 600, color: '#B12704', fontSize: 16 }}>${product.price}</div>
                        <div style={{ color: '#FF9900' }}>⭐ {product.rating}</div>
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
                <Button block size="large" onClick={() => navigate('/products')}>
                  Browse Products
                </Button>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Button block size="large" onClick={() => navigate('/customer/rfq')}>
                  Create RFQ
                </Button>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Button block size="large" onClick={() => navigate('/customer/orders')}>
                  Track Orders
                </Button>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Button block size="large" onClick={() => navigate('/help')}>
                  Help & Support
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
