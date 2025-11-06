import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Typography, Tabs, Table, Space, Button, DatePicker, Select, Alert, Progress } from 'antd';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { RiseOutlined, DollarOutlined, ShoppingCartOutlined, TeamOutlined, BarChartOutlined, DownloadOutlined, ReloadOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
const { Option } = Select;

const AnalyticsDashboard: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [timeRange, setTimeRange] = useState('7d');
  
  // Mock data for charts
  const salesData = [
    { name: 'Mon', sales: 2400, orders: 24 },
    { name: 'Tue', sales: 1398, orders: 18 },
    { name: 'Wed', sales: 9800, orders: 42 },
    { name: 'Thu', sales: 3908, orders: 35 },
    { name: 'Fri', sales: 4800, orders: 48 },
    { name: 'Sat', sales: 3800, orders: 38 },
    { name: 'Sun', sales: 4300, orders: 43 },
  ];

  const categoryData = [
    { name: 'Electronics', value: 45, color: '#8884d8' },
    { name: 'Clothing', value: 25, color: '#82ca9d' },
    { name: 'Books', value: 15, color: '#ffc658' },
    { name: 'Home', value: 10, color: '#ff7300' },
    { name: 'Sports', value: 5, color: '#0088fe' },
  ];

  const vendorPerformance = [
    { name: 'Tech Solutions', orders: 145, revenue: 28750, rating: 4.8 },
    { name: 'Fashion Hub', orders: 98, revenue: 18900, rating: 4.6 },
    { name: 'Book World', orders: 76, revenue: 12400, rating: 4.9 },
    { name: 'Home Essentials', orders: 54, revenue: 9800, rating: 4.5 },
  ];

  const inventoryTrends = [
    { name: 'Jan', incoming: 1200, outgoing: 800, stock: 2400 },
    { name: 'Feb', incoming: 1100, outgoing: 900, stock: 2600 },
    { name: 'Mar', incoming: 1300, outgoing: 950, stock: 2950 },
    { name: 'Apr', incoming: 1150, outgoing: 1100, stock: 3000 },
  ];

  const kpiData = {
    totalRevenue: 156750.45,
    totalOrders: 1247,
    avgOrderValue: 125.75,
    conversionRate: 3.2,
    customerCount: 892,
    vendorCount: 45,
  };

  const refreshData = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  };

  const vendorColumns = [
    {
      title: 'Vendor',
      dataIndex: 'name',
      key: 'name',
      render: (name: string) => <Text strong>{name}</Text>,
    },
    {
      title: 'Orders',
      dataIndex: 'orders',
      key: 'orders',
      sorter: (a: any, b: any) => a.orders - b.orders,
    },
    {
      title: 'Revenue',
      dataIndex: 'revenue',
      key: 'revenue',
      render: (revenue: number) => <Text strong>${revenue.toLocaleString()}</Text>,
      sorter: (a: any, b: any) => a.revenue - b.revenue,
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      render: (rating: number) => (
        <div>
          <Text>{rating}</Text>
          <Progress 
            percent={(rating / 5) * 100} 
            size="small" 
            strokeColor="#52c41a" 
            showInfo={false}
            style={{ width: 50, marginLeft: 8 }}
          />
        </div>
      ),
      sorter: (a: any, b: any) => a.rating - b.rating,
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Title level={2}>
            <BarChartOutlined style={{ marginRight: 8 }} />
            Analytics Dashboard
          </Title>
          <Text type="secondary">Phase 4 - Advanced business intelligence</Text>
        </div>
        <Space>
          <Select value={timeRange} onChange={setTimeRange} style={{ width: 120 }}>
            <Option value="7d">Last 7 days</Option>
            <Option value="30d">Last 30 days</Option>
            <Option value="90d">Last 90 days</Option>
          </Select>
          <Button icon={<ReloadOutlined />} onClick={refreshData} loading={loading}>
            Refresh
          </Button>
          <Button icon={<DownloadOutlined />} type="primary">
            Export Report
          </Button>
        </Space>
      </div>

      {/* KPI Cards */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={4}>
          <Card>
            <Statistic
              title="Total Revenue"
              value={kpiData.totalRevenue}
              precision={2}
              prefix="$"
              valueStyle={{ color: '#52c41a' }}
              suffix={<RiseOutlined style={{ color: '#52c41a' }} />}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="Total Orders"
              value={kpiData.totalOrders}
              valueStyle={{ color: '#1890ff' }}
              prefix={<ShoppingCartOutlined />}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="Avg Order Value"
              value={kpiData.avgOrderValue}
              precision={2}
              prefix="$"
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="Conversion Rate"
              value={kpiData.conversionRate}
              suffix="%"
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="Customers"
              value={kpiData.customerCount}
              valueStyle={{ color: '#13c2c2' }}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="Vendors"
              value={kpiData.vendorCount}
              valueStyle={{ color: '#eb2f96' }}
            />
          </Card>
        </Col>
      </Row>

      <Tabs defaultActiveKey="overview">
        <TabPane tab="Sales Overview" key="overview">
          <Row gutter={16}>
            <Col span={16}>
              <Card title="Sales Trends" loading={loading}>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="sales" stroke="#8884d8" strokeWidth={2} />
                    <Line type="monotone" dataKey="orders" stroke="#82ca9d" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </Col>
            <Col span={8}>
              <Card title="Category Distribution" loading={loading}>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </Col>
          </Row>
        </TabPane>

        <TabPane tab="Inventory Analytics" key="inventory">
          <Card title="Inventory Movement Trends" loading={loading}>
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={inventoryTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="incoming" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
                <Area type="monotone" dataKey="outgoing" stackId="2" stroke="#ffc658" fill="#ffc658" />
                <Area type="monotone" dataKey="stock" stackId="3" stroke="#8884d8" fill="#8884d8" />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </TabPane>

        <TabPane tab="Vendor Performance" key="vendors">
          <Card title="Top Performing Vendors" loading={loading}>
            <Alert
              message="Vendor Insights"
              description="Track vendor performance metrics including order volume, revenue, and customer ratings."
              type="info"
              style={{ marginBottom: 16 }}
            />
            <Table
              columns={vendorColumns}
              dataSource={vendorPerformance}
              rowKey="name"
              pagination={false}
            />
          </Card>
        </TabPane>

        <TabPane tab="Financial Reports" key="financial">
          <Row gutter={16}>
            <Col span={12}>
              <Card title="Revenue by Month" loading={loading}>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="sales" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </Col>
            <Col span={12}>
              <Card title="Financial Summary" loading={loading}>
                <Alert
                  message="Profit & Loss Overview"
                  description="Detailed financial analytics including profit margins, costs, and revenue breakdowns."
                  type="success"
                  style={{ marginBottom: 16 }}
                />
                <div style={{ marginTop: 20 }}>
                  <Statistic title="Gross Profit Margin" value={28.5} suffix="%" />
                  <Statistic title="Operating Expenses" value={45280} prefix="$" style={{ marginTop: 16 }} />
                  <Statistic title="Net Profit" value={38950} prefix="$" style={{ marginTop: 16 }} />
                </div>
              </Card>
            </Col>
          </Row>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default AnalyticsDashboard;
