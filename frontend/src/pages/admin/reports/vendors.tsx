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
  Avatar,
} from 'antd';
import {
  ShopOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  DownloadOutlined,
  DollarOutlined,
} from '@ant-design/icons';
import { Column, Pie } from '@ant-design/charts';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

interface VendorReport {
  id: number;
  name: string;
  email: string;
  status: string;
  products: number;
  orders: number;
  revenue: number;
  commission: number;
  rating: number;
  joinDate: string;
}

const mockVendors: VendorReport[] = [
  {
    id: 1,
    name: 'TechStore Inc',
    email: 'contact@techstore.com',
    status: 'verified',
    products: 156,
    orders: 342,
    revenue: 45600,
    commission: 6840,
    rating: 4.8,
    joinDate: '2024-01-15',
  },
  {
    id: 2,
    name: 'Fashion Hub',
    email: 'info@fashionhub.com',
    status: 'verified',
    products: 234,
    orders: 567,
    revenue: 78900,
    commission: 11835,
    rating: 4.6,
    joinDate: '2024-02-20',
  },
  {
    id: 3,
    name: 'Electronics World',
    email: 'sales@electronicsworld.com',
    status: 'pending',
    products: 89,
    orders: 123,
    revenue: 23400,
    commission: 3510,
    rating: 4.5,
    joinDate: '2024-09-10',
  },
  {
    id: 4,
    name: 'Home Goods Co',
    email: 'support@homegoods.com',
    status: 'verified',
    products: 178,
    orders: 289,
    revenue: 34500,
    commission: 5175,
    rating: 4.7,
    joinDate: '2024-03-05',
  },
  {
    id: 5,
    name: 'Sports Gear',
    email: 'hello@sportsgear.com',
    status: 'suspended',
    products: 67,
    orders: 45,
    revenue: 8900,
    commission: 1335,
    rating: 3.9,
    joinDate: '2024-08-12',
  },
];

const AdminVendorReportsPage: React.FC = () => {
  const [period, setPeriod] = useState<string>('month');

  const totalVendors = mockVendors.length;
  const verifiedVendors = mockVendors.filter(v => v.status === 'verified').length;
  const pendingVendors = mockVendors.filter(v => v.status === 'pending').length;
  const totalRevenue = mockVendors.reduce((sum, v) => sum + v.revenue, 0);
  const totalCommission = mockVendors.reduce((sum, v) => sum + v.commission, 0);

  // Status distribution
  const statusData = [
    { type: 'Verified', value: mockVendors.filter(v => v.status === 'verified').length },
    { type: 'Pending', value: mockVendors.filter(v => v.status === 'pending').length },
    { type: 'Suspended', value: mockVendors.filter(v => v.status === 'suspended').length },
  ];

  const statusChartConfig = {
    data: statusData,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'outer',
      content: '{name} {percentage}',
    },
    color: ({ type }: { type: string }) => {
      const colors: Record<string, string> = {
        Verified: '#52c41a',
        Pending: '#faad14',
        Suspended: '#ff4d4f',
      };
      return colors[type];
    },
  };

  // Revenue by vendor
  const revenueChartData = mockVendors
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5)
    .map(v => ({
      name: v.name,
      revenue: v.revenue,
    }));

  const revenueChartConfig = {
    data: revenueChartData,
    xField: 'name',
    yField: 'revenue',
    color: '#1890ff',
    columnWidthRatio: 0.6,
    label: {
      position: 'top' as const,
      formatter: (datum: { revenue: number }) => `$${datum.revenue.toLocaleString()}`,
    },
    xAxis: {
      label: {
        autoRotate: true,
      },
    },
    yAxis: {
      label: {
        formatter: (v: string) => `$${Number(v).toLocaleString()}`,
      },
    },
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      verified: 'success',
      pending: 'warning',
      suspended: 'error',
      rejected: 'default',
    };
    return colors[status] || 'default';
  };

  const columns: ColumnsType<VendorReport> = [
    {
      title: 'Vendor',
      key: 'vendor',
      fixed: 'left',
      width: 250,
      render: (_, record) => (
        <Space>
          <Avatar style={{ backgroundColor: '#1890ff' }}>
            {record.name.charAt(0)}
          </Avatar>
          <div>
            <Text strong>{record.name}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: 12 }}>
              {record.email}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {status.toUpperCase()}
        </Tag>
      ),
      filters: [
        { text: 'Verified', value: 'verified' },
        { text: 'Pending', value: 'pending' },
        { text: 'Suspended', value: 'suspended' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Products',
      dataIndex: 'products',
      key: 'products',
      width: 100,
      sorter: (a, b) => a.products - b.products,
    },
    {
      title: 'Orders',
      dataIndex: 'orders',
      key: 'orders',
      width: 100,
      sorter: (a, b) => a.orders - b.orders,
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
      title: 'Commission',
      dataIndex: 'commission',
      key: 'commission',
      width: 120,
      sorter: (a, b) => a.commission - b.commission,
      render: (value: number) => (
        <Text strong style={{ color: '#52c41a' }}>
          ${value.toLocaleString()}
        </Text>
      ),
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      width: 100,
      sorter: (a, b) => a.rating - b.rating,
      render: (value: number) => `⭐ ${value.toFixed(1)}`,
    },
    {
      title: 'Join Date',
      dataIndex: 'joinDate',
      key: 'joinDate',
      width: 120,
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={3}>Vendor Reports</Title>
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
              title="Total Vendors"
              value={totalVendors}
              prefix={<ShopOutlined style={{ color: '#1890ff' }} />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Verified Vendors"
              value={verifiedVendors}
              prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Pending Approval"
              value={pendingVendors}
              prefix={<ClockCircleOutlined style={{ color: '#faad14' }} />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Commission"
              value={totalCommission}
              precision={2}
              prefix={<DollarOutlined style={{ color: '#722ed1' }} />}
              valueStyle={{ color: '#722ed1' }}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>
              From ${totalRevenue.toLocaleString()} revenue
            </Text>
          </Card>
        </Col>
      </Row>

      {/* Charts */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={16}>
          <Card title="Top Vendors by Revenue" bordered={false}>
            <Column {...revenueChartConfig} />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Vendor Status Distribution" bordered={false}>
            <Pie {...statusChartConfig} />
          </Card>
        </Col>
      </Row>

      {/* Vendor Table */}
      <Card title="Vendor Performance Details" bordered={false}>
        <Table
          columns={columns}
          dataSource={mockVendors}
          rowKey="id"
          scroll={{ x: 1200 }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} vendors`,
          }}
        />
      </Card>
    </div>
  );
};

export default AdminVendorReportsPage;
