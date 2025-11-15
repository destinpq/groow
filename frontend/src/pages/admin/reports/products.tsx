/**
 * SAFE API RESPONSE HANDLING - APPLY THIS PATTERN:
 * const dataArray = response?.data?.data || response?.data || [];
 * const total = response?.data?.meta?.total || response?.meta?.total || response?.total || 0;
 * Always check: Array.isArray(data) before .map()/.filter()
 */

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
} from '@ant-design/icons';
import { Column, Pie } from '@ant-design/charts';
import { formatPieLabelContent } from '@/utils/chartHelpers';
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
    rating: 4.4,
    stock: 45,
    trend: 'down',
    trendValue: 3.1,
  },
];

const AdminProductReportsPage: React.FC = () => {
  const [period, setPeriod] = useState<string>('month');

  const totalProducts = mockProducts.length;
  const totalSales = mockProducts.reduce((sum, p) => sum + p.sales, 0);
  const totalRevenue = mockProducts.reduce((sum, p) => sum + p.revenue, 0);
  const avgRating = mockProducts.reduce((sum, p) => sum + p.rating, 0) / totalProducts;

  // Category distribution
  const categoryData = [
    { type: 'Electronics', value: 3 },
    { type: 'Accessories', value: 2 },
  ];

  const categoryChartConfig = {
    data: categoryData,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'outer',
      content: formatPieLabelContent,
    },
    interactions: [{ type: 'element-active' }],
  };

  // Sales by product
  const salesChartData = mockProducts.map(p => ({
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
      style: {
        fill: '#666',
      },
    },
    xAxis: {
      label: {
        autoRotate: true,
        autoHide: false,
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
      width: 120,
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
        <Title level={3}>Product Performance Reports</Title>
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
              prefix={<ShoppingOutlined style={{ color: '#52c41a' }} />}
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
              prefix="$"
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Avg Rating"
              value={avgRating}
              precision={1}
              prefix={<StarOutlined style={{ color: '#faad14' }} />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Charts */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={16}>
          <Card title="Sales by Product" variant="borderless">
            <Column {...salesChartConfig} />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Category Distribution" variant="borderless">
            <Pie {...categoryChartConfig} />
          </Card>
        </Col>
      </Row>

      {/* Product Performance Table */}
      <Card title="Product Performance Details" variant="borderless">
        <Table
          columns={columns}
          dataSource={mockProducts}
          rowKey="id"
          scroll={{ x: 1000 }}
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

export default AdminProductReportsPage;
