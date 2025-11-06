import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Statistic, Table, Tag, Button, List, Avatar, Badge, Progress, Space, Typography, Spin, message } from 'antd';
import {
  DollarOutlined,
  ShoppingOutlined,
  ShoppingCartOutlined,
  RiseOutlined,
  EyeOutlined,
  BellOutlined,
  StarOutlined,
  UserOutlined,
  AlertOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import { Line, Column, Pie } from '@ant-design/charts';
import { vendorAPI } from '@/services/api/vendors';
import { ordersAPI } from '@/services/api/orders';
import { productAPI } from '@/services/api/products';

const { Text, Title } = Typography;

const VendorDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch vendor stats
      const vendorStats = await vendorAPI.getStats();
      setStats(vendorStats);

      // Fetch recent orders
      const ordersResponse = await ordersAPI.getAll({ limit: 5 });
      setRecentOrders(ordersResponse.data || []);

      // Fetch products
      const productsResponse = await productAPI.getAll({ limit: 100 });
      setProducts(productsResponse.data || []);

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

  const salesData = stats?.monthlySales || [];
  const activeProducts = products.filter(p => p.isActive).length;
  const outOfStock = products.filter(p => p.stockQuantity === 0).length;
  const totalRevenue = stats?.totalRevenue || 0;
  const totalOrders = stats?.totalOrders || 0;
  const pendingOrders = recentOrders.filter(o => o.status === 'pending').length;
  const averageRating = stats?.averageRating || 4.5;
  const totalReviews = stats?.totalReviews || 0;

  const topProducts = stats?.topProducts || [];

  const productStatusData = [
    { status: 'Active', count: activeProducts },
    { status: 'Out of Stock', count: outOfStock },
    { status: 'Draft', count: products.length - activeProducts - outOfStock },
  ];

  const orderColumns = [
    { title: 'Order #', dataIndex: 'orderNumber', key: 'orderNumber' },
    { title: 'Customer ID', dataIndex: 'customerId', key: 'customerId', ellipsis: true },
    { 
      title: 'Total', 
      dataIndex: 'total', 
      key: 'total', 
      render: (total: number) => `$${total?.toFixed(2) || '0.00'}` 
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const colors: Record<string, string> = {
          pending: 'blue',
          confirmed: 'cyan',
          processing: 'orange',
          shipped: 'purple',
          delivered: 'green',
          cancelled: 'red',
        };
        return <Tag color={colors[status] || 'default'}>{status?.toUpperCase()}</Tag>;
      },
    },
    { 
      title: 'Date', 
      dataIndex: 'createdAt', 
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString()
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: any) => (
        <Button type="link" icon={<EyeOutlined />} onClick={() => window.location.href = `/vendor/orders/${record.id}`}>
          View
        </Button>
      ),
    },
  ];

  const lineChartConfig = {
    data: salesData,
    xField: 'month',
    yField: 'sales',
    point: { size: 5, shape: 'diamond' },
    smooth: true,
    color: '#1890ff',
  };

  const productStatusConfig = {
    data: productStatusData,
    angleField: 'count',
    colorField: 'status',
    radius: 0.8,
    label: {
      type: 'outer',
      content: '{name} {percentage}',
    },
    interactions: [{ type: 'element-active' }],
  };

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={3}>Vendor Dashboard</Title>
        <Badge count={2} offset={[-5, 5]}>
          <Button icon={<BellOutlined />}>Notifications</Button>
        </Badge>
      </div>
      
      {/* Performance Metrics */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Revenue"
              value={totalRevenue}
              prefix={<DollarOutlined />}
              precision={2}
              valueStyle={{ color: '#3f8600' }}
            />
            <Progress percent={75} size="small" showInfo={false} strokeColor="#3f8600" />
            <Text type="secondary" style={{ fontSize: 12 }}>
              <RiseOutlined style={{ color: '#3f8600' }} /> Growing revenue
            </Text>
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Products"
              value={products.length}
              prefix={<ShoppingOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
            <Progress percent={92} size="small" showInfo={false} />
            <Text type="secondary" style={{ fontSize: 12 }}>
              {activeProducts} active, {outOfStock} out of stock
            </Text>
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Orders"
              value={totalOrders}
              prefix={<ShoppingCartOutlined />}
              valueStyle={{ color: '#cf1322' }}
            />
            <Progress percent={68} size="small" showInfo={false} strokeColor="#cf1322" />
            <Text type="secondary" style={{ fontSize: 12 }}>
              {pendingOrders} pending processing
            </Text>
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Customer Rating"
              value={averageRating}
              prefix={<StarOutlined />}
              suffix="/ 5"
              valueStyle={{ color: '#faad14' }}
            />
            <Progress percent={94} size="small" showInfo={false} strokeColor="#faad14" />
            <Text type="secondary" style={{ fontSize: 12 }}>
              Based on {totalReviews} reviews
            </Text>
          </Card>
        </Col>
      </Row>

      {/* Charts Section */}
      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={16}>
          <Card title="Sales Overview (Last 6 Months)" bordered={false}>
            <Line {...lineChartConfig} />
          </Card>
        </Col>
        
        <Col xs={24} lg={8}>
          <Card title="Product Status" bordered={false}>
            <Pie {...productStatusConfig} />
          </Card>
        </Col>
      </Row>

      {/* Recent Orders */}
      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col span={24}>
          <Card 
            title="Recent Orders" 
            bordered={false}
            extra={<Button type="primary" onClick={() => window.location.href = '/vendor/orders'}>View All Orders</Button>}
          >
            <Table
              columns={orderColumns}
              dataSource={recentOrders}
              rowKey="id"
              pagination={false}
            />
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} sm={8}>
          <Card hoverable style={{ textAlign: 'center' }} onClick={() => window.location.href = '/vendor/products/new'}>
            <ShoppingOutlined style={{ fontSize: 48, color: '#1890ff' }} />
            <Title level={4} style={{ marginTop: 16 }}>Add New Product</Title>
            <Button type="primary">Get Started</Button>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card hoverable style={{ textAlign: 'center' }} onClick={() => window.location.href = '/vendor/orders'}>
            <CheckCircleOutlined style={{ fontSize: 48, color: '#52c41a' }} />
            <Title level={4} style={{ marginTop: 16 }}>Process Orders</Title>
            <Button type="primary">View Pending</Button>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card hoverable style={{ textAlign: 'center' }} onClick={() => window.location.href = '/vendor/rfq'}>
            <ClockCircleOutlined style={{ fontSize: 48, color: '#faad14' }} />
            <Title level={4} style={{ marginTop: 16 }}>Manage RFQs</Title>
            <Button type="primary">View Requests</Button>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default VendorDashboard;
