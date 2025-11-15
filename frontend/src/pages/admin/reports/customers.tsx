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
  UserOutlined,
  ShoppingOutlined,
  DollarOutlined,
  DownloadOutlined,
  RiseOutlined,
  HeartOutlined,
} from '@ant-design/icons';
import { Column, Line } from '@ant-design/charts';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

interface CustomerReport {
  id: number;
  name: string;
  email: string;
  type: string;
  orders: number;
  totalSpent: number;
  avgOrderValue: number;
  lastOrder: string;
  status: string;
}

const mockCustomers: CustomerReport[] = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    type: 'VIP',
    orders: 24,
    totalSpent: 4560,
    avgOrderValue: 190,
    lastOrder: '2024-11-03',
    status: 'active',
  },
  {
    id: 2,
    name: 'Sarah Smith',
    email: 'sarah@example.com',
    type: 'Regular',
    orders: 12,
    totalSpent: 1890,
    avgOrderValue: 157.5,
    lastOrder: '2024-11-02',
    status: 'active',
  },
  {
    id: 3,
    name: 'Mike Johnson',
    email: 'mike@example.com',
    type: 'VIP',
    orders: 31,
    totalSpent: 6780,
    avgOrderValue: 218.7,
    lastOrder: '2024-11-01',
    status: 'active',
  },
  {
    id: 4,
    name: 'Emily Davis',
    email: 'emily@example.com',
    type: 'Regular',
    orders: 8,
    totalSpent: 890,
    avgOrderValue: 111.25,
    lastOrder: '2024-10-28',
    status: 'inactive',
  },
  {
    id: 5,
    name: 'Robert Brown',
    email: 'robert@example.com',
    type: 'New',
    orders: 2,
    totalSpent: 340,
    avgOrderValue: 170,
    lastOrder: '2024-11-02',
    status: 'active',
  },
];

// Customer acquisition data
const acquisitionData = [
  { month: 'Jun', customers: 145 },
  { month: 'Jul', customers: 189 },
  { month: 'Aug', customers: 234 },
  { month: 'Sep', customers: 198 },
  { month: 'Oct', customers: 267 },
  { month: 'Nov', customers: 312 },
];

const AdminCustomerReportsPage: React.FC = () => {
  const [period, setPeriod] = useState<string>('month');

  const totalCustomers = mockCustomers.length;
  const activeCustomers = mockCustomers.filter(c => c.status === 'active').length;
  const vipCustomers = mockCustomers.filter(c => c.type === 'VIP').length;
  const totalRevenue = mockCustomers.reduce((sum, c) => sum + c.totalSpent, 0);
  const avgLifetimeValue = totalRevenue / totalCustomers;

  // Customer acquisition chart
  const acquisitionChartConfig = {
    data: acquisitionData,
    xField: 'month',
    yField: 'customers',
    smooth: true,
    color: '#52c41a',
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

  // Spending distribution
  const spendingData = mockCustomers.map(c => ({
    name: c.name.split(' ')[0],
    spent: c.totalSpent,
  }));

  const spendingChartConfig = {
    data: spendingData,
    xField: 'name',
    yField: 'spent',
    color: '#1890ff',
    columnWidthRatio: 0.6,
    label: {
      position: 'top' as const,
      formatter: (datum: { spent: number }) => `$${datum.spent.toLocaleString()}`,
    },
    yAxis: {
      label: {
        formatter: (v: string) => `$${Number(v).toLocaleString()}`,
      },
    },
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      VIP: 'gold',
      Regular: 'blue',
      New: 'green',
    };
    return colors[type] || 'default';
  };

  const getStatusColor = (status: string) => {
    return status === 'active' ? 'success' : 'default';
  };

  const columns: ColumnsType<CustomerReport> = [
    {
      title: 'Customer',
      key: 'customer',
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
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type: string) => (
        <Tag color={getTypeColor(type)}>{type}</Tag>
      ),
      filters: [
        { text: 'VIP', value: 'VIP' },
        { text: 'Regular', value: 'Regular' },
        { text: 'New', value: 'New' },
      ],
      onFilter: (value, record) => record.type === value,
    },
    {
      title: 'Orders',
      dataIndex: 'orders',
      key: 'orders',
      width: 100,
      sorter: (a, b) => a.orders - b.orders,
    },
    {
      title: 'Total Spent',
      dataIndex: 'totalSpent',
      key: 'totalSpent',
      width: 120,
      sorter: (a, b) => a.totalSpent - b.totalSpent,
      render: (value: number) => (
        <Text strong style={{ color: '#1890ff' }}>
          ${value.toLocaleString()}
        </Text>
      ),
    },
    {
      title: 'Avg Order Value',
      dataIndex: 'avgOrderValue',
      key: 'avgOrderValue',
      width: 150,
      sorter: (a, b) => a.avgOrderValue - b.avgOrderValue,
      render: (value: number) => `$${value.toFixed(2)}`,
    },
    {
      title: 'Last Order',
      dataIndex: 'lastOrder',
      key: 'lastOrder',
      width: 120,
      render: (date: string) => new Date(date).toLocaleDateString(),
      sorter: (a, b) => new Date(a.lastOrder).getTime() - new Date(b.lastOrder).getTime(),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {status.toUpperCase()}
        </Tag>
      ),
      filters: [
        { text: 'Active', value: 'active' },
        { text: 'Inactive', value: 'inactive' },
      ],
      onFilter: (value, record) => record.status === value,
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={3}>Customer Reports</Title>
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
              title="Total Customers"
              value={totalCustomers}
              prefix={<UserOutlined style={{ color: '#1890ff' }} />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Active Customers"
              value={activeCustomers}
              prefix={<RiseOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a' }}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>
              {((activeCustomers / totalCustomers) * 100).toFixed(1)}% of total
            </Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="VIP Customers"
              value={vipCustomers}
              prefix={<HeartOutlined style={{ color: '#faad14' }} />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Avg Lifetime Value"
              value={avgLifetimeValue}
              precision={2}
              prefix={<DollarOutlined style={{ color: '#722ed1' }} />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Charts */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={12}>
          <Card title="Customer Acquisition Trend" variant="borderless">
            <Line {...acquisitionChartConfig} />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Customer Spending Distribution" variant="borderless">
            <Column {...spendingChartConfig} />
          </Card>
        </Col>
      </Row>

      {/* Customer Table */}
      <Card title="Customer Performance Details" variant="borderless">
        <Table
          columns={columns}
          dataSource={mockCustomers}
          rowKey="id"
          scroll={{ x: 1100 }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} customers`,
          }}
        />
      </Card>
    </div>
  );
};

export default AdminCustomerReportsPage;
