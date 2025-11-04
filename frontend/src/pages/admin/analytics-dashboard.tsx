import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Statistic,
  Table,
  Tag,
  Space,
  DatePicker,
  Select,
  Button,
  Progress,
  Alert,
  Tabs,
  List,
} from 'antd';
import {
  LineChartOutlined,
  UserOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  EyeOutlined,
  RiseOutlined,
  FallOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import { Line, Column, Pie } from '@ant-design/charts';
import type { ColumnsType } from 'antd/es/table';
import dayjs, { Dayjs } from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { RangePicker } = DatePicker;

interface AnalyticsEvent {
  id: number;
  event: string;
  category: string;
  count: number;
  value: number;
  change: number;
}

interface PageView {
  page: string;
  views: number;
  uniqueVisitors: number;
  avgTime: string;
  bounceRate: number;
}

interface ConversionFunnel {
  step: string;
  users: number;
  dropoff: number;
}

const mockEvents: AnalyticsEvent[] = [
  { id: 1, event: 'Product View', category: 'Engagement', count: 15420, value: 0, change: 12.5 },
  { id: 2, event: 'Add to Cart', category: 'E-commerce', count: 3840, value: 0, change: 8.3 },
  { id: 3, event: 'Purchase', category: 'E-commerce', count: 1250, value: 87500, change: 15.2 },
  { id: 4, event: 'Newsletter Signup', category: 'Engagement', count: 890, value: 0, change: -3.1 },
  { id: 5, event: 'Social Share', category: 'Social', count: 450, value: 0, change: 22.4 },
];

const mockPageViews: PageView[] = [
  { page: '/products', views: 12450, uniqueVisitors: 8920, avgTime: '3:45', bounceRate: 42.3 },
  { page: '/products/electronics', views: 8730, uniqueVisitors: 6450, avgTime: '4:12', bounceRate: 38.5 },
  { page: '/', views: 7890, uniqueVisitors: 7120, avgTime: '2:30', bounceRate: 55.2 },
  { page: '/checkout', views: 2340, uniqueVisitors: 2100, avgTime: '5:20', bounceRate: 28.4 },
  { page: '/cart', views: 3890, uniqueVisitors: 3450, avgTime: '2:15', bounceRate: 48.9 },
];

const conversionFunnel: ConversionFunnel[] = [
  { step: 'Page Visit', users: 10000, dropoff: 0 },
  { step: 'Product View', users: 7500, dropoff: 25 },
  { step: 'Add to Cart', users: 3000, dropoff: 60 },
  { step: 'Checkout', users: 1800, dropoff: 40 },
  { step: 'Purchase', users: 1200, dropoff: 33 },
];

const AnalyticsDashboardPage: React.FC = () => {
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>([
    dayjs().subtract(30, 'days'),
    dayjs(),
  ]);
  const [timeframe, setTimeframe] = useState<string>('30days');

  // Mock traffic data
  const trafficData = Array.from({ length: 30 }, (_, i) => ({
    date: dayjs().subtract(29 - i, 'days').format('MMM DD'),
    visitors: Math.floor(Math.random() * 500) + 300,
    pageViews: Math.floor(Math.random() * 1500) + 800,
  }));

  // Mock revenue data
  const revenueData = Array.from({ length: 12 }, (_, i) => ({
    month: dayjs().subtract(11 - i, 'months').format('MMM'),
    revenue: Math.floor(Math.random() * 50000) + 30000,
  }));

  // Mock traffic sources
  const trafficSources = [
    { source: 'Organic Search', value: 45.2 },
    { source: 'Direct', value: 28.5 },
    { source: 'Social Media', value: 15.8 },
    { source: 'Referral', value: 7.3 },
    { source: 'Email', value: 3.2 },
  ];

  const eventColumns: ColumnsType<AnalyticsEvent> = [
    {
      title: 'Event',
      dataIndex: 'event',
      key: 'event',
      render: (event, record) => (
        <Space direction="vertical" size={0}>
          <Text strong>{event}</Text>
          <Tag color="blue" style={{ fontSize: 10 }}>
            {record.category}
          </Tag>
        </Space>
      ),
    },
    {
      title: 'Count',
      dataIndex: 'count',
      key: 'count',
      render: (count) => <Text>{count.toLocaleString()}</Text>,
      sorter: (a, b) => a.count - b.count,
    },
    {
      title: 'Value',
      dataIndex: 'value',
      key: 'value',
      render: (value) => (value > 0 ? <Text>${value.toLocaleString()}</Text> : '-'),
    },
    {
      title: 'Change',
      dataIndex: 'change',
      key: 'change',
      render: (change) => {
        const isPositive = change >= 0;
        return (
          <Tag
            color={isPositive ? 'green' : 'red'}
            icon={isPositive ? <RiseOutlined /> : <FallOutlined />}
          >
            {isPositive ? '+' : ''}
            {change.toFixed(1)}%
          </Tag>
        );
      },
      sorter: (a, b) => a.change - b.change,
    },
  ];

  const pageViewColumns: ColumnsType<PageView> = [
    {
      title: 'Page',
      dataIndex: 'page',
      key: 'page',
      render: (page) => <Text code>{page}</Text>,
    },
    {
      title: 'Views',
      dataIndex: 'views',
      key: 'views',
      render: (views) => <Text>{views.toLocaleString()}</Text>,
      sorter: (a, b) => a.views - b.views,
    },
    {
      title: 'Unique Visitors',
      dataIndex: 'uniqueVisitors',
      key: 'uniqueVisitors',
      render: (visitors) => <Text>{visitors.toLocaleString()}</Text>,
      sorter: (a, b) => a.uniqueVisitors - b.uniqueVisitors,
    },
    {
      title: 'Avg. Time',
      dataIndex: 'avgTime',
      key: 'avgTime',
      render: (time) => (
        <Space>
          <ClockCircleOutlined />
          <Text>{time}</Text>
        </Space>
      ),
    },
    {
      title: 'Bounce Rate',
      dataIndex: 'bounceRate',
      key: 'bounceRate',
      render: (rate) => (
        <div>
          <Progress
            percent={rate}
            size="small"
            status={rate > 50 ? 'exception' : 'normal'}
            format={(percent) => `${percent?.toFixed(1)}%`}
          />
        </div>
      ),
      sorter: (a, b) => a.bounceRate - b.bounceRate,
    },
  ];

  const trafficConfig = {
    data: trafficData,
    xField: 'date',
    yField: 'visitors',
    seriesField: 'type',
    smooth: true,
    animation: {
      appear: {
        animation: 'path-in',
        duration: 1000,
      },
    },
  };

  const revenueConfig = {
    data: revenueData,
    xField: 'month',
    yField: 'revenue',
    label: {
      position: 'top' as const,
      style: {
        fill: '#000000',
        opacity: 0.6,
      },
    },
    meta: {
      revenue: {
        formatter: (v: number) => `$${(v / 1000).toFixed(0)}k`,
      },
    },
  };

  const sourceConfig = {
    data: trafficSources,
    angleField: 'value',
    colorField: 'source',
    radius: 0.8,
    label: {
      type: 'outer',
      content: '{name} {percentage}',
    },
    interactions: [
      {
        type: 'element-active',
      },
    ],
  };

  const totalVisitors = trafficData.reduce((sum, d) => sum + d.visitors, 0);
  const totalPageViews = trafficData.reduce((sum, d) => sum + d.pageViews, 0);
  const conversionRate = ((conversionFunnel[4].users / conversionFunnel[0].users) * 100).toFixed(2);
  const avgSessionDuration = '3:25';

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Title level={3}>
              <LineChartOutlined style={{ color: '#1890ff' }} /> Analytics Dashboard
            </Title>
            <Paragraph type="secondary">
              Track user behavior, conversions, and performance metrics
            </Paragraph>
          </div>
          <Space>
            <Select value={timeframe} onChange={setTimeframe} style={{ width: 120 }}>
              <Select.Option value="7days">Last 7 days</Select.Option>
              <Select.Option value="30days">Last 30 days</Select.Option>
              <Select.Option value="90days">Last 90 days</Select.Option>
              <Select.Option value="custom">Custom</Select.Option>
            </Select>
            {timeframe === 'custom' && (
              <RangePicker
                value={dateRange}
                onChange={(dates) => dates && setDateRange(dates as [Dayjs, Dayjs])}
              />
            )}
          </Space>
        </div>
      </div>

      <Alert
        message="Google Analytics Integration Active"
        description="Real-time analytics tracking is enabled. Data updates every 5 minutes."
        type="success"
        showIcon
        closable
        style={{ marginBottom: 24 }}
      />

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Visitors"
              value={totalVisitors}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#1890ff' }}
              suffix={
                <Tag color="green" icon={<RiseOutlined />} style={{ marginLeft: 8 }}>
                  +12.5%
                </Tag>
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Page Views"
              value={totalPageViews}
              prefix={<EyeOutlined />}
              valueStyle={{ color: '#52c41a' }}
              suffix={
                <Tag color="green" icon={<RiseOutlined />} style={{ marginLeft: 8 }}>
                  +8.3%
                </Tag>
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Conversion Rate"
              value={conversionRate}
              suffix="%"
              prefix={<ShoppingCartOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Avg. Session Duration"
              value={avgSessionDuration}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      <Tabs
        defaultActiveKey="overview"
        items={[
          {
            key: 'overview',
            label: 'Overview',
            children: (
              <Row gutter={[16, 16]}>
                <Col xs={24} lg={16}>
                  <Card title="Traffic Trends">
                    <Line {...trafficConfig} height={300} />
                  </Card>
                </Col>
                <Col xs={24} lg={8}>
                  <Card title="Traffic Sources">
                    <Pie {...sourceConfig} height={300} />
                  </Card>
                </Col>
                <Col xs={24}>
                  <Card title="Monthly Revenue">
                    <Column {...revenueConfig} height={300} />
                  </Card>
                </Col>
              </Row>
            ),
          },
          {
            key: 'events',
            label: 'Events',
            children: (
              <Card title="Event Tracking">
                <Table
                  columns={eventColumns}
                  dataSource={mockEvents}
                  rowKey="id"
                  pagination={false}
                />
              </Card>
            ),
          },
          {
            key: 'pageviews',
            label: 'Page Views',
            children: (
              <Card title="Top Pages">
                <Table
                  columns={pageViewColumns}
                  dataSource={mockPageViews}
                  rowKey="page"
                  pagination={false}
                />
              </Card>
            ),
          },
          {
            key: 'conversion',
            label: 'Conversions',
            children: (
              <Row gutter={16}>
                <Col xs={24} lg={12}>
                  <Card title="Conversion Funnel">
                    <List
                      dataSource={conversionFunnel}
                      renderItem={(item, index) => {
                        const percentage = ((item.users / conversionFunnel[0].users) * 100).toFixed(1);
                        return (
                          <List.Item>
                            <Space direction="vertical" style={{ width: '100%' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Text strong>
                                  {index + 1}. {item.step}
                                </Text>
                                <Text>{item.users.toLocaleString()} users</Text>
                              </div>
                              <Progress percent={parseFloat(percentage)} />
                              {item.dropoff > 0 && (
                                <Text type="danger" style={{ fontSize: 12 }}>
                                  {item.dropoff}% drop-off
                                </Text>
                              )}
                            </Space>
                          </List.Item>
                        );
                      }}
                    />
                  </Card>
                </Col>
                <Col xs={24} lg={12}>
                  <Card title="Conversion Insights">
                    <Space direction="vertical" style={{ width: '100%' }} size="large">
                      <div>
                        <Text type="secondary">Overall Conversion Rate</Text>
                        <div style={{ fontSize: 32, fontWeight: 'bold', color: '#52c41a' }}>
                          {conversionRate}%
                        </div>
                      </div>
                      <div>
                        <Text type="secondary">Cart Abandonment Rate</Text>
                        <div style={{ fontSize: 24, fontWeight: 'bold', color: '#ff4d4f' }}>
                          40%
                        </div>
                      </div>
                      <div>
                        <Text type="secondary">Average Order Value</Text>
                        <div style={{ fontSize: 24, fontWeight: 'bold', color: '#1890ff' }}>
                          $72.50
                        </div>
                      </div>
                    </Space>
                  </Card>
                </Col>
              </Row>
            ),
          },
        ]}
      />
    </div>
  );
};

export default AnalyticsDashboardPage;
