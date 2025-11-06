import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  Select,
  DatePicker,
  Button,
  Space,
  Typography,
  Table,
  Tag,
  Progress,
} from 'antd';
import {
  CrownOutlined,
  DollarOutlined,
  RiseOutlined,
  DownloadOutlined,
  TeamOutlined,
  TrophyOutlined,
} from '@ant-design/icons';
import { Column, Line } from '@ant-design/charts';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

interface SubscriptionData {
  id: number;
  planName: string;
  planType: string;
  subscribers: number;
  revenue: number;
  avgDuration: number;
  renewalRate: number;
  churnRate: number;
}

const mockSubscriptions: SubscriptionData[] = [
  {
    id: 1,
    planName: 'Basic Plan',
    planType: 'monthly',
    subscribers: 145,
    revenue: 7250,
    avgDuration: 8.5,
    renewalRate: 75,
    churnRate: 25,
  },
  {
    id: 2,
    planName: 'Pro Plan',
    planType: 'monthly',
    subscribers: 89,
    revenue: 8900,
    avgDuration: 12.3,
    renewalRate: 82,
    churnRate: 18,
  },
  {
    id: 3,
    planName: 'Enterprise Plan',
    planType: 'yearly',
    subscribers: 34,
    revenue: 20400,
    avgDuration: 18.7,
    renewalRate: 91,
    churnRate: 9,
  },
  {
    id: 4,
    planName: 'Starter Plan',
    planType: 'monthly',
    subscribers: 267,
    revenue: 8010,
    avgDuration: 5.2,
    renewalRate: 65,
    churnRate: 35,
  },
];

// Monthly subscription trend
const trendData = [
  { month: 'Jun', subscriptions: 412 },
  { month: 'Jul', subscriptions: 445 },
  { month: 'Aug', subscriptions: 478 },
  { month: 'Sep', subscriptions: 501 },
  { month: 'Oct', subscriptions: 520 },
  { month: 'Nov', subscriptions: 535 },
];

const AdminSubscriptionReportsPage: React.FC = () => {
  const [period, setPeriod] = useState<string>('month');

  const totalSubscribers = mockSubscriptions.reduce((sum, s) => sum + s.subscribers, 0);
  const totalRevenue = mockSubscriptions.reduce((sum, s) => sum + s.revenue, 0);
  const avgRenewalRate = mockSubscriptions.reduce((sum, s) => sum + s.renewalRate, 0) / mockSubscriptions.length;
  const avgChurnRate = mockSubscriptions.reduce((sum, s) => sum + s.churnRate, 0) / mockSubscriptions.length;

  // Growth calculation
  const lastMonth = trendData[trendData.length - 2]?.subscriptions || 0;
  const currentMonth = trendData[trendData.length - 1]?.subscriptions || 0;
  const growthRate = lastMonth > 0 ? ((currentMonth - lastMonth) / lastMonth) * 100 : 0;

  // Subscription trend chart
  const trendChartConfig = {
    data: trendData,
    xField: 'month',
    yField: 'subscriptions',
    smooth: true,
    color: '#1890ff',
    point: {
      size: 5,
      shape: 'circle',
    },
    label: {
      style: {
        fill: '#666',
      },
    },
  };

  // Revenue by plan chart
  const revenueChartData = mockSubscriptions.map(s => ({
    plan: s.planName,
    revenue: s.revenue,
  }));

  const revenueChartConfig = {
    data: revenueChartData,
    xField: 'plan',
    yField: 'revenue',
    color: '#52c41a',
    columnWidthRatio: 0.6,
    label: {
      position: 'top' as const,
      formatter: (datum: { revenue: number }) => `$${datum.revenue.toLocaleString()}`,
    },
    yAxis: {
      label: {
        formatter: (v: string) => `$${Number(v).toLocaleString()}`,
      },
    },
  };

  const getPlanTypeColor = (type: string) => {
    return type === 'yearly' ? 'gold' : 'blue';
  };

  const columns: ColumnsType<SubscriptionData> = [
    {
      title: 'Plan Name',
      dataIndex: 'planName',
      key: 'planName',
      fixed: 'left',
      width: 180,
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: 'Type',
      dataIndex: 'planType',
      key: 'planType',
      width: 120,
      render: (type: string) => (
        <Tag color={getPlanTypeColor(type)}>
          {type.toUpperCase()}
        </Tag>
      ),
      filters: [
        { text: 'Monthly', value: 'monthly' },
        { text: 'Yearly', value: 'yearly' },
      ],
      onFilter: (value, record) => record.planType === value,
    },
    {
      title: 'Subscribers',
      dataIndex: 'subscribers',
      key: 'subscribers',
      width: 120,
      sorter: (a, b) => a.subscribers - b.subscribers,
      render: (value: number) => (
        <Space>
          <TeamOutlined />
          {value.toLocaleString()}
        </Space>
      ),
    },
    {
      title: 'Revenue',
      dataIndex: 'revenue',
      key: 'revenue',
      width: 140,
      sorter: (a, b) => a.revenue - b.revenue,
      render: (value: number) => (
        <Text strong style={{ color: '#52c41a' }}>
          ${value.toLocaleString()}
        </Text>
      ),
    },
    {
      title: 'Avg Duration (months)',
      dataIndex: 'avgDuration',
      key: 'avgDuration',
      width: 180,
      sorter: (a, b) => a.avgDuration - b.avgDuration,
      render: (value: number) => `${value.toFixed(1)} months`,
    },
    {
      title: 'Renewal Rate',
      dataIndex: 'renewalRate',
      key: 'renewalRate',
      width: 150,
      sorter: (a, b) => a.renewalRate - b.renewalRate,
      render: (value: number) => (
        <div>
          <Progress
            percent={value}
            size="small"
            status={value >= 80 ? 'success' : value >= 60 ? 'normal' : 'exception'}
          />
        </div>
      ),
    },
    {
      title: 'Churn Rate',
      dataIndex: 'churnRate',
      key: 'churnRate',
      width: 150,
      sorter: (a, b) => a.churnRate - b.churnRate,
      render: (value: number) => (
        <div>
          <Progress
            percent={value}
            size="small"
            strokeColor={value < 20 ? '#52c41a' : value < 30 ? '#faad14' : '#ff4d4f'}
          />
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={3}>Subscription Reports</Title>
        <Space>
          <Select value={period} onChange={setPeriod} style={{ width: 150 }}>
            <Option value="week">Last 7 Days</Option>
            <Option value="month">This Month</Option>
            <Option value="quarter">This Quarter</Option>
            <Option value="year">This Year</Option>
            <Option value="custom">Custom Range</Option>
          </Select>
          {period === 'custom' && <RangePicker />}
          <Button type="primary" icon={<DownloadOutlined />}>
            Export Report
          </Button>
        </Space>
      </div>

      {/* Statistics Cards */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Subscribers"
              value={totalSubscribers}
              prefix={<CrownOutlined style={{ color: '#1890ff' }} />}
              valueStyle={{ color: '#1890ff' }}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>
              <RiseOutlined style={{ color: '#52c41a' }} /> {growthRate.toFixed(1)}% growth
            </Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Revenue"
              value={totalRevenue}
              precision={2}
              prefix={<DollarOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a' }}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>
              Monthly recurring revenue
            </Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Avg Renewal Rate"
              value={avgRenewalRate}
              precision={1}
              suffix="%"
              prefix={<TrophyOutlined style={{ color: '#722ed1' }} />}
              valueStyle={{ color: '#722ed1' }}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>
              Customer retention
            </Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Avg Churn Rate"
              value={avgChurnRate}
              precision={1}
              suffix="%"
              valueStyle={{ color: avgChurnRate < 20 ? '#52c41a' : '#faad14' }}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>
              Customer drop-off
            </Text>
          </Card>
        </Col>
      </Row>

      {/* Charts */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={12}>
          <Card title="Subscription Growth Trend" bordered={false}>
            <Line {...trendChartConfig} />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Revenue by Plan" bordered={false}>
            <Column {...revenueChartConfig} />
          </Card>
        </Col>
      </Row>

      {/* Subscription Table */}
      <Card title="Subscription Plan Performance" bordered={false}>
        <Table
          columns={columns}
          dataSource={mockSubscriptions}
          rowKey="id"
          scroll={{ x: 1200 }}
          pagination={false}
        />
      </Card>
    </div>
  );
};

export default AdminSubscriptionReportsPage;
