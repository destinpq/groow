import React from 'react';
import { Row, Col, Card, Statistic, Table, Tag, Button, List, Avatar, Badge, Progress, Space, Typography } from 'antd';
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

const { Text, Title } = Typography;

const VendorDashboard = () => {
  const salesData = [
    { month: 'Jan', sales: 3000 },
    { month: 'Feb', sales: 4500 },
    { month: 'Mar', sales: 5200 },
    { month: 'Apr', sales: 6800 },
    { month: 'May', sales: 7500 },
    { month: 'Jun', sales: 8900 },
  ];

  const recentOrders = [
    { id: 'ORD-001', customer: 'John Doe', amount: 299.99, status: 'new', date: '2024-11-04' },
    { id: 'ORD-002', customer: 'Jane Smith', amount: 459.50, status: 'processing', date: '2024-11-03' },
    { id: 'ORD-003', customer: 'Mike Wilson', amount: 189.99, status: 'shipped', date: '2024-11-02' },
  ];

  const notifications = [
    { id: 1, type: 'order', message: 'New order #ORD-001 received', time: '5 min ago', read: false },
    { id: 2, type: 'review', message: 'New review on "Wireless Headphones"', time: '1 hour ago', read: false },
    { id: 3, type: 'stock', message: 'Low stock alert: 3 products', time: '2 hours ago', read: true },
    { id: 4, type: 'payout', message: 'Payout processed: $2,450', time: '1 day ago', read: true },
  ];

  const topProducts = [
    { name: 'Wireless Headphones', sold: 245, revenue: 12250, stock: 56 },
    { name: 'Smart Watch', sold: 189, revenue: 37800, stock: 23 },
    { name: 'Laptop Stand', sold: 156, revenue: 5460, stock: 89 },
  ];

  const productStatusData = [
    { status: 'Active', count: 142 },
    { status: 'Out of Stock', count: 8 },
    { status: 'Draft', count: 6 },
  ];

  const orderColumns = [
    { title: 'Order ID', dataIndex: 'id', key: 'id' },
    { title: 'Customer', dataIndex: 'customer', key: 'customer' },
    { title: 'Amount', dataIndex: 'amount', key: 'amount', render: (amount: number) => `$${amount}` },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const colors: Record<string, string> = {
          new: 'blue',
          processing: 'orange',
          shipped: 'cyan',
          delivered: 'green',
        };
        return <Tag color={colors[status]}>{status.toUpperCase()}</Tag>;
      },
    },
    { title: 'Date', dataIndex: 'date', key: 'date' },
    {
      title: 'Action',
      key: 'action',
      render: () => <Button type="link" icon={<EyeOutlined />}>View</Button>,
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
              value={45678.90}
              prefix={<DollarOutlined />}
              precision={2}
              valueStyle={{ color: '#3f8600' }}
            />
            <Progress percent={75} size="small" showInfo={false} strokeColor="#3f8600" />
            <Text type="secondary" style={{ fontSize: 12 }}>
              <RiseOutlined style={{ color: '#3f8600' }} /> 12.5% vs last month
            </Text>
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Products"
              value={156}
              prefix={<ShoppingOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
            <Progress percent={92} size="small" showInfo={false} />
            <Text type="secondary" style={{ fontSize: 12 }}>
              142 active, 8 out of stock
            </Text>
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Orders"
              value={342}
              prefix={<ShoppingCartOutlined />}
              valueStyle={{ color: '#cf1322' }}
            />
            <Progress percent={68} size="small" showInfo={false} strokeColor="#cf1322" />
            <Text type="secondary" style={{ fontSize: 12 }}>
              28 pending processing
            </Text>
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Customer Rating"
              value={4.7}
              prefix={<StarOutlined />}
              suffix="/ 5"
              valueStyle={{ color: '#faad14' }}
            />
            <Progress percent={94} size="small" showInfo={false} strokeColor="#faad14" />
            <Text type="secondary" style={{ fontSize: 12 }}>
              Based on 1,247 reviews
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

      {/* Notifications & Top Products */}
      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={12}>
          <Card 
            title="Recent Notifications" 
            bordered={false}
            extra={<Button type="link">View All</Button>}
          >
            <List
              dataSource={notifications}
              renderItem={(item) => (
                <List.Item
                  style={{
                    backgroundColor: item.read ? 'transparent' : '#f0f5ff',
                    padding: '12px',
                    borderRadius: 4,
                    marginBottom: 8,
                  }}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        icon={
                          item.type === 'order' ? <ShoppingCartOutlined /> :
                          item.type === 'review' ? <StarOutlined /> :
                          item.type === 'stock' ? <AlertOutlined /> :
                          <DollarOutlined />
                        }
                        style={{
                          backgroundColor:
                            item.type === 'order' ? '#1890ff' :
                            item.type === 'review' ? '#faad14' :
                            item.type === 'stock' ? '#ff4d4f' :
                            '#52c41a',
                        }}
                      />
                    }
                    title={item.message}
                    description={<Text type="secondary">{item.time}</Text>}
                  />
                  {!item.read && <Badge status="processing" />}
                </List.Item>
              )}
            />
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card 
            title="Top Selling Products" 
            bordered={false}
            extra={<Button type="link">View All</Button>}
          >
            <List
              dataSource={topProducts}
              renderItem={(item, index) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        style={{
                          backgroundColor: index === 0 ? '#faad14' : index === 1 ? '#d9d9d9' : '#cd7f32',
                        }}
                      >
                        #{index + 1}
                      </Avatar>
                    }
                    title={item.name}
                    description={
                      <Space direction="vertical" size="small" style={{ width: '100%' }}>
                        <Text>Sold: {item.sold} units</Text>
                        <Text strong style={{ color: '#52c41a' }}>Revenue: ${item.revenue.toLocaleString()}</Text>
                        <Progress
                          percent={Math.min((item.stock / 100) * 100, 100)}
                          size="small"
                          status={item.stock < 30 ? 'exception' : 'success'}
                          format={() => `${item.stock} in stock`}
                        />
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      {/* Recent Orders */}
      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col span={24}>
          <Card 
            title="Recent Orders" 
            bordered={false}
            extra={<Button type="primary">View All Orders</Button>}
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
          <Card hoverable style={{ textAlign: 'center' }}>
            <ShoppingOutlined style={{ fontSize: 48, color: '#1890ff' }} />
            <Title level={4} style={{ marginTop: 16 }}>Add New Product</Title>
            <Button type="primary">Get Started</Button>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card hoverable style={{ textAlign: 'center' }}>
            <CheckCircleOutlined style={{ fontSize: 48, color: '#52c41a' }} />
            <Title level={4} style={{ marginTop: 16 }}>Process Orders</Title>
            <Button type="primary">View Pending</Button>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card hoverable style={{ textAlign: 'center' }}>
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
