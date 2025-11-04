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
  ShoppingOutlined,
  EyeOutlined,
  StarOutlined,
  DownloadOutlined,
  RiseOutlined,
  FallOutlined,
  DollarOutlined,
} from '@ant-design/icons';
import { Column, Pie } from '@ant-design/charts';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

interface ProductPerformance {
  id: number;
  name: string;
  category: string;
  sales: number;
  revenue: number;
  views: number;
  conversionRate: number;
  rating: number;
  stock: number;
  trend: 'up' | 'down';
  trendValue: number;
}

const mockProducts: ProductPerformance[] = [
  {
    id: 1,
    name: 'Wireless Headphones',
    category: 'Electronics',
    sales: 245,
    revenue: 12250,
    views: 3450,
    conversionRate: 7.1,
    rating: 4.5,
    stock: 156,
    trend: 'up',
    trendValue: 12.5,
  },
  {
    id: 2,
    name: 'Smart Watch',
    category: 'Electronics',
    sales: 189,
    revenue: 37800,
    views: 2890,
    conversionRate: 6.5,
    rating: 4.8,
    stock: 89,
    trend: 'up',
    trendValue: 18.3,
  },
  {
    id: 3,
    name: 'Laptop Stand',
    category: 'Accessories',
    sales: 156,
    revenue: 5460,
    views: 1820,
    conversionRate: 8.6,
    rating: 4.2,
    stock: 234,
    trend: 'down',
    trendValue: 5.2,
  },
  {
    id: 4,
    name: 'USB-C Cable',
    category: 'Accessories',
    sales: 342,
    revenue: 6840,
    views: 4120,
    conversionRate: 8.3,
    rating: 4.6,
    stock: 567,
    trend: 'up',
    trendValue: 8.9,
  },
  {
    id: 5,
    name: 'Bluetooth Speaker',
    category: 'Electronics',
    sales: 128,
    revenue: 10240,
    views: 2340,
    conversionRate: 5.5,
    rating: 4.4,
    stock: 45,
    trend: 'down',
    trendValue: 3.1,
  },
];

const VendorProductReportPage: React.FC = () => {
  const [period, setPeriod] = useState<string>('month');

  const totalProducts = mockProducts.length;
  const totalSales = mockProducts.reduce((sum, p) => sum + p.sales, 0);
  const totalRevenue = mockProducts.reduce((sum, p) => sum + p.revenue, 0);
  const totalViews = mockProducts.reduce((sum, p) => sum + p.views, 0);
  const avgConversionRate = mockProducts.reduce((sum, p) => sum + p.conversionRate, 0) / totalProducts;

  // Category distribution
  const categoryData = [
    { 
      type: 'Electronics', 
      value: mockProducts.filter(p => p.category === 'Electronics').length 
    },
    { 
      type: 'Accessories', 
      value: mockProducts.filter(p => p.category === 'Accessories').length 
    },
  ];

  const categoryChartConfig = {
    data: categoryData,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'outer',
      content: '{name} {percentage}',
    },
  };

  // Sales by product
  const salesChartData = mockProducts
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 5)
    .map(p => ({
      name: p.name.substring(0, 15),
      sales: p.sales,
    }));

  const salesChartConfig = {
    data: salesChartData,
    xField: 'name',
    yField: 'sales',
    color: '#1890ff',
    columnWidthRatio: 0.6,
    label: {
      position: 'top' as const,
    },
    xAxis: {
      label: {
        autoRotate: true,
      },
    },
  };

  const columns: ColumnsType<ProductPerformance> = [
    {
      title: 'Product Name',
      dataIndex: 'name',
      key: 'name',
      fixed: 'left',
      width: 200,
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      width: 120,
    },
    {
      title: 'Sales',
      dataIndex: 'sales',
      key: 'sales',
      width: 100,
      sorter: (a, b) => a.sales - b.sales,
      render: (value: number) => value.toLocaleString(),
    },
    {
      title: 'Revenue',
      dataIndex: 'revenue',
      key: 'revenue',
      width: 120,
      sorter: (a, b) => a.revenue - b.revenue,
      render: (value: number) => (
        <Text strong style={{ color: '#1890ff' }}>
          ${value.toLocaleString()}
        </Text>
      ),
    },
    {
      title: 'Views',
      dataIndex: 'views',
      key: 'views',
      width: 100,
      sorter: (a, b) => a.views - b.views,
      render: (value: number) => (
        <Space>
          <EyeOutlined />
          {value.toLocaleString()}
        </Space>
      ),
    },
    {
      title: 'Conversion',
      dataIndex: 'conversionRate',
      key: 'conversionRate',
      width: 120,
      sorter: (a, b) => a.conversionRate - b.conversionRate,
      render: (value: number) => (
        <Tag color={value >= 8 ? 'success' : value >= 6 ? 'warning' : 'default'}>
          {value.toFixed(1)}%
        </Tag>
      ),
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      width: 100,
      sorter: (a, b) => a.rating - b.rating,
      render: (value: number) => (
        <Space>
          <StarOutlined style={{ color: '#faad14' }} />
          {value.toFixed(1)}
        </Space>
      ),
    },
    {
      title: 'Stock',
      dataIndex: 'stock',
      key: 'stock',
      width: 150,
      sorter: (a, b) => a.stock - b.stock,
      render: (value: number) => (
        <div>
          <Progress
            percent={Math.min((value / 600) * 100, 100)}
            size="small"
            status={value < 50 ? 'exception' : value < 100 ? 'normal' : 'success'}
            showInfo={false}
          />
          <Text type="secondary" style={{ fontSize: 12 }}>
            {value} units
          </Text>
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
        <Title level={3}>Product Performance Analytics</Title>
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
              title="Total Products"
              value={totalProducts}
              prefix={<ShoppingOutlined style={{ color: '#1890ff' }} />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Sales"
              value={totalSales}
              valueStyle={{ color: '#52c41a' }}
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
              prefix={<DollarOutlined style={{ color: '#722ed1' }} />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Avg Conversion"
              value={avgConversionRate}
              precision={1}
              suffix="%"
              valueStyle={{ color: '#faad14' }}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>
              From {totalViews.toLocaleString()} views
            </Text>
          </Card>
        </Col>
      </Row>

      {/* Charts */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={16}>
          <Card title="Top Selling Products" bordered={false}>
            <Column {...salesChartConfig} />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Category Distribution" bordered={false}>
            <Pie {...categoryChartConfig} />
          </Card>
        </Col>
      </Row>

      {/* Product Performance Table */}
      <Card title="Product Performance Details" bordered={false}>
        <Table
          columns={columns}
          dataSource={mockProducts}
          rowKey="id"
          scroll={{ x: 1200 }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} products`,
          }}
        />
      </Card>
    </div>
  );
};

export default VendorProductReportPage;
