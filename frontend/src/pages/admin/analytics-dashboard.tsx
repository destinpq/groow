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
  Spin,
  message,
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
import { analyticsAPI } from '@/services/api/analytics';
import type { 
  AnalyticsOverview,
  TrafficData,
  RevenueData,
  TrafficSource,
  PageView,
  ConversionFunnel,
  AnalyticsEvent,
  AnalyticsFilters,
} from '@/services/api/analytics';

const { Title, Text, Paragraph } = Typography;
const { RangePicker } = DatePicker;

const AnalyticsDashboardPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
  const [trafficData, setTrafficData] = useState<TrafficData[]>([]);
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [trafficSources, setTrafficSources] = useState<TrafficSource[]>([]);
  const [pageViews, setPageViews] = useState<PageView[]>([]);
  const [conversionFunnel, setConversionFunnel] = useState<ConversionFunnel[]>([]);
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>([
    dayjs().subtract(30, 'days'),
    dayjs(),
  ]);
  const [timeframe, setTimeframe] = useState<string>('30days');

  useEffect(() => {
    fetchAnalyticsData();
  }, [dateRange]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const filters: AnalyticsFilters = {
        startDate: dateRange[0].format('YYYY-MM-DD'),
        endDate: dateRange[1].format('YYYY-MM-DD'),
      };

      const [
        overviewData,
        traffic,
        revenue,
        sources,
        pages,
        funnel,
        analyticsEvents,
      ] = await Promise.all([
        analyticsAPI.getOverview(filters),
        analyticsAPI.getTrafficData(filters),
        analyticsAPI.getRevenueData(filters),
        analyticsAPI.getTrafficSources(filters),
        analyticsAPI.getPageViews(filters),
        analyticsAPI.getConversionFunnel(filters),
        analyticsAPI.getEvents(filters),
      ]);

      setOverview(overviewData);
      setTrafficData(traffic);
      setRevenueData(revenue);
      setTrafficSources(sources);
      setPageViews(pages);
      setConversionFunnel(funnel);
      setEvents(analyticsEvents);
    } catch (error) {
      message.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const handleDateRangeChange = (dates: any) => {
    if (dates) {
      setDateRange([dates[0], dates[1]]);
    }
  };

  // Format traffic sources for pie chart
  const trafficSourcesForChart = trafficSources.map(source => ({
    source: source.source,
    value: source.percentage,
  }));

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
      dataIndex: 'avgTimeOnPage',
      key: 'avgTimeOnPage',
      render: (time) => (
        <Space>
          <ClockCircleOutlined />
          <Text>{time}s</Text>
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
    data: trafficData.map(d => ({
      date: dayjs(d.date).format('MMM DD'),
      visitors: d.visitors,
      pageViews: d.pageViews,
    })),
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
    data: revenueData.map(d => ({
      month: dayjs(d.date).format('MMM'),
      revenue: d.revenue,
    })),
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
    data: trafficSourcesForChart,
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
  const conversionRate = conversionFunnel.length > 0 
    ? ((conversionFunnel[conversionFunnel.length - 1].users / conversionFunnel[0].users) * 100).toFixed(2)
    : '0.00';
  const avgSessionDuration = '3:25';

  return (
    <Spin spinning={loading}>
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
                  onChange={handleDateRangeChange}
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
                title="Total Revenue"
                value={overview?.totalRevenue || 0}
                prefix={<DollarOutlined />}
                valueStyle={{ color: '#1890ff' }}
                precision={2}
                suffix={
                  overview?.revenueChange && (
                    <Tag 
                      color={overview.revenueChange >= 0 ? 'green' : 'red'} 
                      icon={overview.revenueChange >= 0 ? <RiseOutlined /> : <FallOutlined />} 
                      style={{ marginLeft: 8 }}
                    >
                      {overview.revenueChange >= 0 ? '+' : ''}{overview.revenueChange.toFixed(1)}%
                    </Tag>
                  )
                }
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Total Orders"
                value={overview?.totalOrders || 0}
                prefix={<ShoppingCartOutlined />}
                valueStyle={{ color: '#52c41a' }}
                suffix={
                  overview?.ordersChange && (
                    <Tag 
                      color={overview.ordersChange >= 0 ? 'green' : 'red'} 
                      icon={overview.ordersChange >= 0 ? <RiseOutlined /> : <FallOutlined />} 
                      style={{ marginLeft: 8 }}
                    >
                      {overview.ordersChange >= 0 ? '+' : ''}{overview.ordersChange.toFixed(1)}%
                    </Tag>
                  )
                }
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Conversion Rate"
                value={overview?.conversionRate || 0}
                suffix="%"
                prefix={<LineChartOutlined />}
                valueStyle={{ color: '#faad14' }}
                precision={2}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Total Customers"
                value={overview?.totalCustomers || 0}
                prefix={<UserOutlined />}
                valueStyle={{ color: '#722ed1' }}
                suffix={
                  overview?.customersChange && (
                    <Tag 
                      color={overview.customersChange >= 0 ? 'green' : 'red'} 
                      icon={overview.customersChange >= 0 ? <RiseOutlined /> : <FallOutlined />} 
                      style={{ marginLeft: 8 }}
                    >
                      {overview.customersChange >= 0 ? '+' : ''}{overview.customersChange.toFixed(1)}%
                    </Tag>
                  )
                }
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
                  dataSource={events}
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
                  dataSource={pageViews}
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
                        const percentage = conversionFunnel[0].users > 0 
                          ? ((item.users / conversionFunnel[0].users) * 100).toFixed(1)
                          : '0';
                        return (
                          <List.Item>
                            <Space direction="vertical" style={{ width: '100%' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Text strong>
                                  {item.stepNumber}. {item.step}
                                </Text>
                                <Text>{item.users.toLocaleString()} users</Text>
                              </div>
                              <Progress percent={parseFloat(percentage)} />
                              {item.dropoffRate > 0 && (
                                <Text type="danger" style={{ fontSize: 12 }}>
                                  {item.dropoffRate.toFixed(1)}% drop-off
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
                          {overview?.conversionRate.toFixed(2) || '0.00'}%
                        </div>
                      </div>
                      <div>
                        <Text type="secondary">Average Order Value</Text>
                        <div style={{ fontSize: 24, fontWeight: 'bold', color: '#1890ff' }}>
                          ${overview?.averageOrderValue.toFixed(2) || '0.00'}
                        </div>
                      </div>
                      <div>
                        <Text type="secondary">Total Revenue</Text>
                        <div style={{ fontSize: 24, fontWeight: 'bold', color: '#722ed1' }}>
                          ${overview?.totalRevenue.toLocaleString() || '0'}
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
    </Spin>
  );
};

export default AnalyticsDashboardPage;
