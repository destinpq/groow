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
} from 'antd';
import {
  DollarOutlined,
  ShoppingOutlined,
  RiseOutlined,
  DownloadOutlined,
  LineChartOutlined,
} from '@ant-design/icons';
import { Column, Line } from '@ant-design/charts';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

interface SalesData {
  date: string;
  revenue: number;
  orders: number;
}

interface TopProduct {
  id: number;
  name: string;
  category: string;
  unitsSold: number;
  revenue: number;
}

const mockSalesData: SalesData[] = [
  { date: '2024-10-28', revenue: 12450, orders: 45 },
  { date: '2024-10-29', revenue: 15680, orders: 52 },
  { date: '2024-10-30', revenue: 18920, orders: 61 },
  { date: '2024-10-31', revenue: 14230, orders: 48 },
  { date: '2024-11-01', revenue: 16780, orders: 55 },
  { date: '2024-11-02', revenue: 19340, orders: 64 },
  { date: '2024-11-03', revenue: 21560, orders: 71 },
];

const mockTopProducts: TopProduct[] = [
  { id: 1, name: 'Wireless Headphones', category: 'Electronics', unitsSold: 245, revenue: 12250 },
  { id: 2, name: 'Smart Watch', category: 'Electronics', unitsSold: 189, revenue: 37800 },
  { id: 3, name: 'Laptop Stand', category: 'Accessories', unitsSold: 156, revenue: 5460 },
  { id: 4, name: 'USB-C Cable', category: 'Accessories', unitsSold: 342, revenue: 6840 },
  { id: 5, name: 'Bluetooth Speaker', category: 'Electronics', unitsSold: 128, revenue: 10240 },
];

const AdminSalesReportsPage: React.FC = () => {
  const [period, setPeriod] = useState<string>('week');

  const totalRevenue = mockSalesData.reduce((sum, item) => sum + item.revenue, 0);
  const totalOrders = mockSalesData.reduce((sum, item) => sum + item.orders, 0);
  const avgOrderValue = totalRevenue / totalOrders;
  const growthRate = 15.8; // Mock growth rate

  // Revenue chart data
  const revenueChartData = mockSalesData.map(item => ({
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    value: item.revenue,
    type: 'Revenue',
  }));

  // Orders chart data
  const ordersChartData = mockSalesData.map(item => ({
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    value: item.orders,
  }));

  const revenueChartConfig = {
    data: revenueChartData,
    xField: 'date',
    yField: 'value',
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
    yAxis: {
      label: {
        formatter: (v: string) => `$${Number(v).toLocaleString()}`,
      },
    },
  };

  const ordersChartConfig = {
    data: ordersChartData,
    xField: 'date',
    yField: 'value',
    color: '#52c41a',
    columnWidthRatio: 0.6,
    label: {
      position: 'top' as const,
      style: {
        fill: '#666',
      },
    },
  };

  const columns: ColumnsType<TopProduct> = [
    {
      title: 'Rank',
      key: 'rank',
      width: 80,
      render: (_, __, index) => (
        <Tag color={index === 0 ? 'gold' : index === 1 ? 'silver' : index === 2 ? 'orange' : 'default'}>
          #{index + 1}
        </Tag>
      ),
    },
    {
      title: 'Product Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Units Sold',
      dataIndex: 'unitsSold',
      key: 'unitsSold',
      sorter: (a, b) => a.unitsSold - b.unitsSold,
      render: (value: number) => value.toLocaleString(),
    },
    {
      title: 'Revenue',
      dataIndex: 'revenue',
      key: 'revenue',
      sorter: (a, b) => a.revenue - b.revenue,
      render: (value: number) => (
        <Text strong style={{ color: '#1890ff' }}>
          ${value.toLocaleString()}
        </Text>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={3}>Sales Reports</Title>
        <Space>
          <Select value={period} onChange={setPeriod} style={{ width: 150 }}>
            <Option value="today">Today</Option>
            <Option value="week">Last 7 Days</Option>
            <Option value="month">This Month</Option>
            <Option value="year">This Year</Option>
            <Option value="custom">Custom Range</Option>
          </Select>
          {period === 'custom' && (
            <RangePicker />
          )}
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
              title="Total Revenue"
              value={totalRevenue}
              precision={2}
              prefix={<DollarOutlined style={{ color: '#1890ff' }} />}
              valueStyle={{ color: '#1890ff' }}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>
              <RiseOutlined style={{ color: '#52c41a' }} /> {growthRate}% vs last period
            </Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Orders"
              value={totalOrders}
              prefix={<ShoppingOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a' }}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>
              Across {mockSalesData.length} days
            </Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Avg Order Value"
              value={avgOrderValue}
              precision={2}
              prefix={<LineChartOutlined style={{ color: '#722ed1' }} />}
              valueStyle={{ color: '#722ed1' }}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>
              Per transaction
            </Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Growth Rate"
              value={growthRate}
              precision={1}
              suffix="%"
              prefix={<RiseOutlined style={{ color: '#faad14' }} />}
              valueStyle={{ color: '#faad14' }}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>
              Compared to last period
            </Text>
          </Card>
        </Col>
      </Row>

      {/* Charts */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={12}>
          <Card title="Revenue Trend" bordered={false}>
            <Line {...revenueChartConfig} />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Orders Volume" bordered={false}>
            <Column {...ordersChartConfig} />
          </Card>
        </Col>
      </Row>

      {/* Top Products */}
      <Card title="Top Selling Products" bordered={false}>
        <Table
          columns={columns}
          dataSource={mockTopProducts}
          rowKey="id"
          pagination={false}
        />
      </Card>
    </div>
  );
};

export default AdminSalesReportsPage;
