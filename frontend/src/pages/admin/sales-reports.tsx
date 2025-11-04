import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Table,
  Tag,
  Space,
  Button,
  Statistic,
  Progress,
  Select,
  DatePicker,
  Tabs,
  Alert,
  List,
  Avatar,
} from 'antd';
import {
  ShoppingOutlined,
  UserOutlined,
  DollarOutlined,
  RiseOutlined,
  FallOutlined,
  TrophyOutlined,
  StarOutlined,
  EyeOutlined,
  ShoppingCartOutlined,
} from '@ant-design/icons';
import { Column, Pie, Line } from '@ant-design/charts';
import type { ColumnsType } from 'antd/es/table';
import dayjs, { Dayjs } from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { RangePicker } = DatePicker;

interface ProductPerformance {
  id: number;
  name: string;
  category: string;
  views: number;
  addToCart: number;
  purchases: number;
  revenue: number;
  conversionRate: number;
  trend: 'up' | 'down' | 'stable';
}

interface CategoryPerformance {
  category: string;
  sales: number;
  revenue: number;
  percentage: number;
}

interface CustomerSegment {
  segment: string;
  count: number;
  avgOrderValue: number;
  totalRevenue: number;
  color: string;
}

const productPerformance: ProductPerformance[] = [
  {
    id: 1,
    name: 'Wireless Headphones Pro',
    category: 'Electronics',
    views: 8920,
    addToCart: 1245,
    purchases: 456,
    revenue: 34200,
    conversionRate: 5.1,
    trend: 'up',
  },
  {
    id: 2,
    name: 'Smart Watch Series 5',
    category: 'Electronics',
    views: 12450,
    addToCart: 2340,
    purchases: 890,
    revenue: 89000,
    conversionRate: 7.1,
    trend: 'up',
  },
  {
    id: 3,
    name: 'Premium Leather Jacket',
    category: 'Fashion',
    views: 5680,
    addToCart: 890,
    purchases: 234,
    revenue: 28080,
    conversionRate: 4.1,
    trend: 'down',
  },
  {
    id: 4,
    name: 'Ergonomic Office Chair',
    category: 'Home & Garden',
    views: 3450,
    addToCart: 567,
    purchases: 189,
    revenue: 37800,
    conversionRate: 5.5,
    trend: 'stable',
  },
];

const categoryPerformance: CategoryPerformance[] = [
  { category: 'Electronics', sales: 3456, revenue: 245600, percentage: 42.5 },
  { category: 'Fashion', sales: 2890, revenue: 156700, percentage: 27.1 },
  { category: 'Home & Garden', sales: 1567, revenue: 98400, percentage: 17.0 },
  { category: 'Books', sales: 1234, revenue: 45300, percentage: 7.8 },
  { category: 'Sports', sales: 890, revenue: 32000, percentage: 5.6 },
];

const customerSegments: CustomerSegment[] = [
  { segment: 'VIP Customers', count: 245, avgOrderValue: 450, totalRevenue: 110250, color: '#722ed1' },
  { segment: 'Repeat Buyers', count: 1890, avgOrderValue: 125, totalRevenue: 236250, color: '#1890ff' },
  { segment: 'New Customers', count: 3450, avgOrderValue: 78, totalRevenue: 269100, color: '#52c41a' },
  { segment: 'Inactive', count: 890, avgOrderValue: 0, totalRevenue: 0, color: '#8c8c8c' },
];

const SalesReportsPage: React.FC = () => {
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>([
    dayjs().subtract(30, 'days'),
    dayjs(),
  ]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Mock sales trend data
  const salesTrendData = Array.from({ length: 30 }, (_, i) => ({
    date: dayjs().subtract(29 - i, 'days').format('MMM DD'),
    sales: Math.floor(Math.random() * 5000) + 3000,
    orders: Math.floor(Math.random() * 150) + 50,
  }));

  const productColumns: ColumnsType<ProductPerformance> = [
    {
      title: 'Product',
      dataIndex: 'name',
      key: 'name',
      render: (name) => <Text strong>{name}</Text>,
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (category) => <Tag color="blue">{category}</Tag>,
      filters: [
        { text: 'Electronics', value: 'Electronics' },
        { text: 'Fashion', value: 'Fashion' },
        { text: 'Home & Garden', value: 'Home & Garden' },
      ],
      onFilter: (value, record) => record.category === value,
    },
    {
      title: 'Views',
      dataIndex: 'views',
      key: 'views',
      render: (views) => (
        <Space>
          <EyeOutlined />
          <Text>{views.toLocaleString()}</Text>
        </Space>
      ),
      sorter: (a, b) => a.views - b.views,
    },
    {
      title: 'Add to Cart',
      dataIndex: 'addToCart',
      key: 'addToCart',
      render: (count) => (
        <Space>
          <ShoppingCartOutlined />
          <Text>{count.toLocaleString()}</Text>
        </Space>
      ),
      sorter: (a, b) => a.addToCart - b.addToCart,
    },
    {
      title: 'Purchases',
      dataIndex: 'purchases',
      key: 'purchases',
      render: (count) => <Text strong>{count.toLocaleString()}</Text>,
      sorter: (a, b) => a.purchases - b.purchases,
    },
    {
      title: 'Revenue',
      dataIndex: 'revenue',
      key: 'revenue',
      render: (revenue) => <Text strong style={{ color: '#52c41a' }}>${revenue.toLocaleString()}</Text>,
      sorter: (a, b) => a.revenue - b.revenue,
    },
    {
      title: 'Conversion',
      dataIndex: 'conversionRate',
      key: 'conversionRate',
      render: (rate) => <Tag color="green">{rate}%</Tag>,
      sorter: (a, b) => a.conversionRate - b.conversionRate,
    },
    {
      title: 'Trend',
      dataIndex: 'trend',
      key: 'trend',
      render: (trend: ProductPerformance['trend']) => {
        const config: Record<ProductPerformance['trend'], { icon: React.ReactNode; color: string }> = {
          up: { icon: <RiseOutlined />, color: '#52c41a' },
          down: { icon: <FallOutlined />, color: '#ff4d4f' },
          stable: { icon: null, color: '#8c8c8c' },
        };
        return (
          <Tag color={config[trend].color} icon={config[trend].icon}>
            {trend.toUpperCase()}
          </Tag>
        );
      },
    },
  ];

  const salesTrendConfig = {
    data: salesTrendData,
    xField: 'date',
    yField: 'sales',
    smooth: true,
    label: {
      position: 'top' as const,
      style: {
        fill: '#000000',
        opacity: 0.6,
        fontSize: 10,
      },
    },
    meta: {
      sales: {
        formatter: (v: number) => `$${(v / 1000).toFixed(1)}k`,
      },
    },
  };

  const categoryConfig = {
    data: categoryPerformance,
    xField: 'category',
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

  const customerSegmentConfig = {
    data: customerSegments.map((s) => ({ type: s.segment, value: s.count })),
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'outer',
      content: '{name} {percentage}',
    },
    interactions: [{ type: 'element-active' }],
  };

  const totalRevenue = productPerformance.reduce((sum, p) => sum + p.revenue, 0);
  const totalOrders = productPerformance.reduce((sum, p) => sum + p.purchases, 0);
  const avgOrderValue = totalRevenue / totalOrders;
  const totalViews = productPerformance.reduce((sum, p) => sum + p.views, 0);

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Title level={3}>
              <ShoppingOutlined style={{ color: '#1890ff' }} /> Sales Reports & Analytics
            </Title>
            <Paragraph type="secondary">
              Comprehensive sales analytics, product performance, and revenue insights
            </Paragraph>
          </div>
          <Space>
            <Select value={selectedCategory} onChange={setSelectedCategory} style={{ width: 150 }}>
              <Select.Option value="all">All Categories</Select.Option>
              <Select.Option value="electronics">Electronics</Select.Option>
              <Select.Option value="fashion">Fashion</Select.Option>
              <Select.Option value="home">Home & Garden</Select.Option>
            </Select>
            <RangePicker
              value={dateRange}
              onChange={(dates) => dates && setDateRange(dates as [Dayjs, Dayjs])}
            />
          </Space>
        </div>
      </div>

      <Alert
        message="Real-Time Sales Data"
        description="Sales data is updated every 15 minutes. Export reports in CSV, PDF, or Excel format."
        type="info"
        showIcon
        closable
        style={{ marginBottom: 24 }}
      />

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Revenue"
              value={totalRevenue}
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#52c41a' }}
              precision={2}
              suffix={
                <Tag color="green" icon={<RiseOutlined />} style={{ marginLeft: 8 }}>
                  +15.2%
                </Tag>
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Orders"
              value={totalOrders}
              prefix={<ShoppingOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Avg Order Value"
              value={avgOrderValue}
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#faad14' }}
              precision={2}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Views"
              value={totalViews}
              prefix={<EyeOutlined />}
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
                  <Card title="Sales Trend (Last 30 Days)">
                    <Line {...salesTrendConfig} height={300} />
                  </Card>
                </Col>
                <Col xs={24} lg={8}>
                  <Card title="Customer Segments">
                    <Pie {...customerSegmentConfig} height={300} />
                  </Card>
                </Col>
                <Col xs={24}>
                  <Card title="Revenue by Category">
                    <Column {...categoryConfig} height={300} />
                  </Card>
                </Col>
              </Row>
            ),
          },
          {
            key: 'products',
            label: 'Product Performance',
            children: (
              <Card title="Top Performing Products">
                <Table
                  columns={productColumns}
                  dataSource={productPerformance}
                  rowKey="id"
                  pagination={{ pageSize: 10 }}
                />
              </Card>
            ),
          },
          {
            key: 'categories',
            label: 'Category Analysis',
            children: (
              <Row gutter={16}>
                <Col xs={24} lg={16}>
                  <Card title="Category Performance">
                    <Table
                      dataSource={categoryPerformance}
                      rowKey="category"
                      pagination={false}
                      columns={[
                        {
                          title: 'Category',
                          dataIndex: 'category',
                          key: 'category',
                          render: (cat) => <Text strong>{cat}</Text>,
                        },
                        {
                          title: 'Sales',
                          dataIndex: 'sales',
                          key: 'sales',
                          render: (sales) => <Text>{sales.toLocaleString()}</Text>,
                          sorter: (a, b) => a.sales - b.sales,
                        },
                        {
                          title: 'Revenue',
                          dataIndex: 'revenue',
                          key: 'revenue',
                          render: (revenue) => (
                            <Text strong style={{ color: '#52c41a' }}>
                              ${revenue.toLocaleString()}
                            </Text>
                          ),
                          sorter: (a, b) => a.revenue - b.revenue,
                        },
                        {
                          title: 'Market Share',
                          key: 'share',
                          render: (_, record) => (
                            <div>
                              <Progress percent={record.percentage} size="small" />
                            </div>
                          ),
                        },
                      ]}
                    />
                  </Card>
                </Col>
                <Col xs={24} lg={8}>
                  <Card title="Category Insights">
                    <List
                      dataSource={categoryPerformance.slice(0, 3)}
                      renderItem={(cat, index) => (
                        <List.Item>
                          <List.Item.Meta
                            avatar={
                              <Avatar
                                style={{
                                  backgroundColor: ['#1890ff', '#52c41a', '#faad14'][index],
                                }}
                              >
                                {index + 1}
                              </Avatar>
                            }
                            title={cat.category}
                            description={`$${cat.revenue.toLocaleString()} revenue`}
                          />
                          <Tag color="blue">{cat.percentage}%</Tag>
                        </List.Item>
                      )}
                    />
                  </Card>
                </Col>
              </Row>
            ),
          },
          {
            key: 'customers',
            label: 'Customer Insights',
            children: (
              <Row gutter={16}>
                <Col xs={24} lg={12}>
                  <Card title="Customer Segments">
                    <List
                      dataSource={customerSegments}
                      renderItem={(segment) => (
                        <List.Item>
                          <List.Item.Meta
                            avatar={
                              <Avatar
                                style={{ backgroundColor: segment.color }}
                                icon={<UserOutlined />}
                              />
                            }
                            title={segment.segment}
                            description={`${segment.count} customers • Avg Order: $${segment.avgOrderValue}`}
                          />
                          <Text strong style={{ color: '#52c41a' }}>
                            ${segment.totalRevenue.toLocaleString()}
                          </Text>
                        </List.Item>
                      )}
                    />
                  </Card>
                </Col>
                <Col xs={24} lg={12}>
                  <Card title="Customer Metrics">
                    <Space direction="vertical" style={{ width: '100%' }} size="large">
                      <div>
                        <Text type="secondary">Lifetime Value (LTV)</Text>
                        <div style={{ fontSize: 28, fontWeight: 'bold', color: '#1890ff' }}>
                          $2,450
                        </div>
                      </div>
                      <div>
                        <Text type="secondary">Retention Rate</Text>
                        <div style={{ fontSize: 24, fontWeight: 'bold', color: '#52c41a' }}>
                          68.5%
                        </div>
                        <Progress percent={68.5} strokeColor="#52c41a" />
                      </div>
                      <div>
                        <Text type="secondary">Churn Rate</Text>
                        <div style={{ fontSize: 24, fontWeight: 'bold', color: '#ff4d4f' }}>
                          12.3%
                        </div>
                        <Progress percent={12.3} strokeColor="#ff4d4f" />
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

export default SalesReportsPage;
