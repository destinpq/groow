import React, { useState } from 'react';
import { Card, Row, Col, Statistic, Typography, Tabs, Table, Space, Button, DatePicker, Select, Alert, Progress, Badge } from 'antd';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUpOutlined, DollarOutlined, ShoppingCartOutlined, StarOutlined, EyeOutlined, DownloadOutlined, ReloadOutlined, RiseOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
const { Option } = Select;

const VendorPerformanceAnalytics: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [timeRange, setTimeRange] = useState('30d');
  
  // Mock vendor performance data
  const performanceData = {
    totalRevenue: 45780.50,
    totalOrders: 342,
    avgOrderValue: 133.86,
    conversionRate: 4.2,
    customerRating: 4.7,
    totalViews: 12450,
    commission: 4578.05,
    commissionRate: 10.0,
  };

  const salesTrend = [
    { date: 'Nov 1', revenue: 1200, orders: 8, views: 450 },
    { date: 'Nov 2', revenue: 1800, orders: 12, views: 520 },
    { date: 'Nov 3', revenue: 2200, orders: 15, views: 680 },
    { date: 'Nov 4', revenue: 1950, orders: 13, views: 590 },
    { date: 'Nov 5', revenue: 2800, orders: 18, views: 720 },
    { date: 'Nov 6', revenue: 3200, orders: 21, views: 850 },
  ];

  const topProducts = [
    { id: 1, name: 'Wireless Headphones Pro', sales: 45, revenue: 3375, rating: 4.8, views: 1200 },
    { id: 2, name: 'Smart Watch Elite', sales: 32, revenue: 7968, rating: 4.6, views: 950 },
    { id: 3, name: 'Bluetooth Speaker', sales: 28, revenue: 2240, rating: 4.9, views: 780 },
    { id: 4, name: 'Phone Charging Station', sales: 24, revenue: 1680, rating: 4.5, views: 650 },
  ];

  const categoryPerformance = [
    { name: 'Electronics', revenue: 25000, margin: 22, color: '#8884d8' },
    { name: 'Accessories', revenue: 15000, margin: 35, color: '#82ca9d' },
    { name: 'Audio', revenue: 8500, margin: 28, color: '#ffc658' },
    { name: 'Mobile', revenue: 5280, margin: 18, color: '#ff7300' },
  ];

  const customerInsights = [
    { segment: 'Premium Buyers', count: 45, avgSpend: 250, retention: 85 },
    { segment: 'Regular Customers', count: 128, avgSpend: 120, retention: 72 },
    { segment: 'Occasional Buyers', count: 89, avgSpend: 65, retention: 45 },
    { segment: 'New Customers', count: 34, avgSpend: 95, retention: 28 },
  ];

  const refreshData = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  };

  const productColumns = [
    {
      title: 'Product',
      dataIndex: 'name',
      key: 'name',
      render: (name: string) => <Text strong>{name}</Text>,
    },
    {
      title: 'Sales',
      dataIndex: 'sales',
      key: 'sales',
      sorter: (a: any, b: any) => a.sales - b.sales,
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
        <Space>
          <StarOutlined style={{ color: '#faad14' }} />
          <Text>{rating}</Text>
        </Space>
      ),
    },
    {
      title: 'Views',
      dataIndex: 'views',
      key: 'views',
      render: (views: number) => (
        <Space>
          <EyeOutlined />
          <Text>{views.toLocaleString()}</Text>
        </Space>
      ),
    },
  ];

  const customerColumns = [
    {
      title: 'Customer Segment',
      dataIndex: 'segment',
      key: 'segment',
      render: (segment: string) => <Text strong>{segment}</Text>,
    },
    {
      title: 'Count',
      dataIndex: 'count',
      key: 'count',
    },
    {
      title: 'Avg Spend',
      dataIndex: 'avgSpend',
      key: 'avgSpend',
      render: (spend: number) => <Text>${spend}</Text>,
    },
    {
      title: 'Retention Rate',
      dataIndex: 'retention',
      key: 'retention',
      render: (retention: number) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Progress percent={retention} size="small" style={{ width: 80, marginRight: 8 }} />
          <Text>{retention}%</Text>
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Title level={2}>
            <RiseOutlined style={{ marginRight: 8 }} />
            Performance Analytics
          </Title>
          <Text type="secondary">Phase 5 - Advanced vendor insights and metrics</Text>
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

      {/* Performance KPIs */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={3}>
          <Card>
            <Statistic
              title="Total Revenue"
              value={performanceData.totalRevenue}
              precision={2}
              prefix="$"
              valueStyle={{ color: '#52c41a' }}
              suffix={<TrendingUpOutlined style={{ color: '#52c41a' }} />}
            />
          </Card>
        </Col>
        <Col span={3}>
          <Card>
            <Statistic
              title="Total Orders"
              value={performanceData.totalOrders}
              valueStyle={{ color: '#1890ff' }}
              prefix={<ShoppingCartOutlined />}
            />
          </Card>
        </Col>
        <Col span={3}>
          <Card>
            <Statistic
              title="Avg Order Value"
              value={performanceData.avgOrderValue}
              precision={2}
              prefix="$"
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col span={3}>
          <Card>
            <Statistic
              title="Conversion Rate"
              value={performanceData.conversionRate}
              suffix="%"
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
        <Col span={3}>
          <Card>
            <Statistic
              title="Customer Rating"
              value={performanceData.customerRating}
              suffix="/5"
              valueStyle={{ color: '#13c2c2' }}
              prefix={<StarOutlined />}
            />
          </Card>
        </Col>
        <Col span={3}>
          <Card>
            <Statistic
              title="Total Views"
              value={performanceData.totalViews}
              valueStyle={{ color: '#eb2f96' }}
              prefix={<EyeOutlined />}
            />
          </Card>
        </Col>
        <Col span={3}>
          <Card>
            <Statistic
              title="Commission Earned"
              value={performanceData.commission}
              precision={2}
              prefix="$"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={3}>
          <Card>
            <Badge status="success" text={`${performanceData.commissionRate}% Rate`} />
            <Statistic
              title="Commission Rate"
              value={performanceData.commissionRate}
              suffix="%"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      <Alert
        message="Performance Summary"
        description={`Your revenue is up 23% compared to last month. Top performing category: Electronics with ${categoryPerformance[0].margin}% profit margin.`}
        type="success"
        showIcon
        style={{ marginBottom: 16 }}
        closable
      />

      <Tabs defaultActiveKey="overview">
        <TabPane tab="Sales Overview" key="overview">
          <Row gutter={16}>
            <Col span={16}>
              <Card title="Sales & Revenue Trends" loading={loading}>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={salesTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} name="Revenue ($)" />
                    <Line yAxisId="right" type="monotone" dataKey="orders" stroke="#82ca9d" strokeWidth={2} name="Orders" />
                    <Line yAxisId="right" type="monotone" dataKey="views" stroke="#ffc658" strokeWidth={2} name="Views" />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </Col>
            <Col span={8}>
              <Card title="Category Performance" loading={loading}>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryPerformance}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, revenue }) => `${name} $${(revenue/1000).toFixed(1)}K`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="revenue"
                    >
                      {categoryPerformance.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']} />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </Col>
          </Row>
        </TabPane>

        <TabPane tab="Top Products" key="products">
          <Card title="Best Performing Products" loading={loading}>
            <Alert
              message="Product Performance Insights"
              description="Track your top-selling products with detailed metrics including sales volume, revenue, ratings, and view counts."
              type="info"
              style={{ marginBottom: 16 }}
            />
            <Table
              columns={productColumns}
              dataSource={topProducts}
              rowKey="id"
              pagination={false}
            />
          </Card>
        </TabPane>

        <TabPane tab="Customer Analytics" key="customers">
          <Row gutter={16}>
            <Col span={14}>
              <Card title="Customer Segments" loading={loading}>
                <Table
                  columns={customerColumns}
                  dataSource={customerInsights}
                  rowKey="segment"
                  pagination={false}
                />
              </Card>
            </Col>
            <Col span={10}>
              <Card title="Customer Value Distribution" loading={loading}>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={customerInsights}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="segment" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="avgSpend" fill="#8884d8" name="Avg Spend ($)" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </Col>
          </Row>
        </TabPane>

        <TabPane tab="Financial Insights" key="financial">
          <Row gutter={16}>
            <Col span={12}>
              <Card title="Revenue vs Commission" loading={loading}>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={salesTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="revenue" stackId="1" stroke="#82ca9d" fill="#82ca9d" name="Revenue" />
                  </AreaChart>
                </ResponsiveContainer>
              </Card>
            </Col>
            <Col span={12}>
              <Card title="Profitability Analysis" loading={loading}>
                <div style={{ marginTop: 20 }}>
                  <Statistic title="Gross Profit Margin" value={32.5} suffix="%" style={{ marginBottom: 16 }} />
                  <Statistic title="Monthly Commission" value={performanceData.commission} prefix="$" style={{ marginBottom: 16 }} />
                  <Statistic title="Growth Rate" value={23.4} suffix="%" style={{ marginBottom: 16 }} />
                  <Alert message="Your commission rate is competitive at 10%. Consider optimizing high-margin categories." type="info" />
                </div>
              </Card>
            </Col>
          </Row>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default VendorPerformanceAnalytics;
