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
  AppstoreOutlined,
  ShoppingOutlined,
  DollarOutlined,
  DownloadOutlined,
  RiseOutlined,
  FallOutlined,
} from '@ant-design/icons';
import { Column, Pie } from '@ant-design/charts';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

interface CategoryReport {
  id: number;
  name: string;
  parentCategory: string;
  products: number;
  sales: number;
  revenue: number;
  avgPrice: number;
  marketShare: number;
  trend: 'up' | 'down';
  trendValue: number;
}

const mockCategories: CategoryReport[] = [
  {
    id: 1,
    name: 'Electronics',
    parentCategory: 'Root',
    products: 456,
    sales: 2340,
    revenue: 234500,
    avgPrice: 100.21,
    marketShare: 42,
    trend: 'up',
    trendValue: 15.3,
  },
  {
    id: 2,
    name: 'Headphones',
    parentCategory: 'Electronics',
    products: 89,
    sales: 678,
    revenue: 45600,
    avgPrice: 67.26,
    marketShare: 19,
    trend: 'up',
    trendValue: 8.7,
  },
  {
    id: 3,
    name: 'Accessories',
    parentCategory: 'Root',
    products: 234,
    sales: 1890,
    revenue: 67800,
    avgPrice: 35.87,
    marketShare: 12,
    trend: 'down',
    trendValue: 3.2,
  },
  {
    id: 4,
    name: 'Fashion',
    parentCategory: 'Root',
    products: 567,
    sales: 1456,
    revenue: 123400,
    avgPrice: 84.75,
    marketShare: 22,
    trend: 'up',
    trendValue: 12.1,
  },
  {
    id: 5,
    name: 'Home & Garden',
    parentCategory: 'Root',
    products: 178,
    sales: 567,
    revenue: 28900,
    avgPrice: 50.97,
    marketShare: 5,
    trend: 'down',
    trendValue: 2.5,
  },
];

const AdminCategoryReportsPage: React.FC = () => {
  const [period, setPeriod] = useState<string>('month');

  const totalCategories = mockCategories.length;
  const totalProducts = mockCategories.reduce((sum, c) => sum + c.products, 0);
  const totalSales = mockCategories.reduce((sum, c) => sum + c.sales, 0);
  const totalRevenue = mockCategories.reduce((sum, c) => sum + c.revenue, 0);

  // Market share data
  const marketShareData = mockCategories
    .filter(c => c.parentCategory === 'Root')
    .map(c => ({
      type: c.name,
      value: c.marketShare,
    }));

  const marketShareChartConfig = {
    data: marketShareData,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'outer',
      content: '{name} {percentage}',
    },
    interactions: [{ type: 'element-active' }],
  };

  // Revenue by category chart
  const revenueChartData = mockCategories
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5)
    .map(c => ({
      category: c.name,
      revenue: c.revenue,
    }));

  const revenueChartConfig = {
    data: revenueChartData,
    xField: 'category',
    yField: 'revenue',
    color: '#1890ff',
    columnWidthRatio: 0.6,
    label: {
      position: 'top' as const,
      formatter: (datum: { revenue: number }) => `$${(datum.revenue / 1000).toFixed(0)}K`,
    },
    yAxis: {
      label: {
        formatter: (v: string) => `$${(Number(v) / 1000).toFixed(0)}K`,
      },
    },
  };

  const columns: ColumnsType<CategoryReport> = [
    {
      title: 'Category Name',
      dataIndex: 'name',
      key: 'name',
      fixed: 'left',
      width: 180,
      render: (text: string, record) => (
        <Space>
          {record.parentCategory !== 'Root' && (
            <Text type="secondary" style={{ fontSize: 12 }}>
              └─
            </Text>
          )}
          <Text strong>{text}</Text>
        </Space>
      ),
    },
    {
      title: 'Parent',
      dataIndex: 'parentCategory',
      key: 'parentCategory',
      width: 150,
      render: (text: string) => (
        text === 'Root' ? (
          <Tag color="blue">Root</Tag>
        ) : (
          <Tag>{text}</Tag>
        )
      ),
    },
    {
      title: 'Products',
      dataIndex: 'products',
      key: 'products',
      width: 120,
      sorter: (a, b) => a.products - b.products,
      render: (value: number) => (
        <Space>
          <AppstoreOutlined />
          {value.toLocaleString()}
        </Space>
      ),
    },
    {
      title: 'Sales',
      dataIndex: 'sales',
      key: 'sales',
      width: 120,
      sorter: (a, b) => a.sales - b.sales,
      render: (value: number) => (
        <Space>
          <ShoppingOutlined />
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
        <Text strong style={{ color: '#1890ff' }}>
          ${value.toLocaleString()}
        </Text>
      ),
    },
    {
      title: 'Avg Price',
      dataIndex: 'avgPrice',
      key: 'avgPrice',
      width: 120,
      sorter: (a, b) => a.avgPrice - b.avgPrice,
      render: (value: number) => `$${value.toFixed(2)}`,
    },
    {
      title: 'Market Share',
      dataIndex: 'marketShare',
      key: 'marketShare',
      width: 150,
      sorter: (a, b) => a.marketShare - b.marketShare,
      render: (value: number) => (
        <div>
          <Progress
            percent={value}
            size="small"
            status={value >= 30 ? 'success' : value >= 15 ? 'normal' : 'exception'}
          />
        </div>
      ),
    },
    {
      title: 'Trend',
      key: 'trend',
      width: 120,
      render: (_, record) => (
        <Space>
          {record.trend === 'up' ? (
            <Tag color="success" icon={<RiseOutlined />}>
              +{record.trendValue}%
            </Tag>
          ) : (
            <Tag color="error" icon={<FallOutlined />}>
              -{record.trendValue}%
            </Tag>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={3}>Category Performance Reports</Title>
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
              title="Total Categories"
              value={totalCategories}
              prefix={<AppstoreOutlined style={{ color: '#1890ff' }} />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Products"
              value={totalProducts}
              prefix={<ShoppingOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Sales"
              value={totalSales}
              valueStyle={{ color: '#722ed1' }}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>
              Units sold
            </Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Revenue"
              value={totalRevenue}
              precision={2}
              prefix={<DollarOutlined style={{ color: '#faad14' }} />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Charts */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={16}>
          <Card title="Revenue by Category" bordered={false}>
            <Column {...revenueChartConfig} />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Market Share Distribution" bordered={false}>
            <Pie {...marketShareChartConfig} />
          </Card>
        </Col>
      </Row>

      {/* Category Table */}
      <Card title="Category Performance Details" bordered={false}>
        <Table
          columns={columns}
          dataSource={mockCategories}
          rowKey="id"
          scroll={{ x: 1200 }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} categories`,
          }}
        />
      </Card>
    </div>
  );
};

export default AdminCategoryReportsPage;
