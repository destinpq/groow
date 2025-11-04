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
  FileTextOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  DownloadOutlined,
  PercentageOutlined,
  DollarOutlined,
} from '@ant-design/icons';
import { Column, Pie } from '@ant-design/charts';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

interface RFQReport {
  id: number;
  rfqNumber: string;
  customer: string;
  product: string;
  quantity: number;
  targetPrice: number;
  quotesReceived: number;
  bestQuote: number;
  savings: number;
  status: string;
  createdDate: string;
}

const mockRFQs: RFQReport[] = [
  {
    id: 1,
    rfqNumber: 'RFQ-2024-10001',
    customer: 'ABC Corp',
    product: 'Wireless Headphones',
    quantity: 500,
    targetPrice: 50,
    quotesReceived: 5,
    bestQuote: 45,
    savings: 2500,
    status: 'accepted',
    createdDate: '2024-10-28',
  },
  {
    id: 2,
    rfqNumber: 'RFQ-2024-10002',
    customer: 'XYZ Ltd',
    product: 'Smart Watch',
    quantity: 200,
    targetPrice: 200,
    quotesReceived: 3,
    bestQuote: 185,
    savings: 3000,
    status: 'quoted',
    createdDate: '2024-10-30',
  },
  {
    id: 3,
    rfqNumber: 'RFQ-2024-10003',
    customer: 'Tech Solutions',
    product: 'Laptop Stand',
    quantity: 1000,
    targetPrice: 35,
    quotesReceived: 0,
    bestQuote: 0,
    savings: 0,
    status: 'new',
    createdDate: '2024-11-02',
  },
  {
    id: 4,
    rfqNumber: 'RFQ-2024-10004',
    customer: 'Global Traders',
    product: 'USB-C Cable',
    quantity: 2000,
    targetPrice: 20,
    quotesReceived: 7,
    bestQuote: 18,
    savings: 4000,
    status: 'accepted',
    createdDate: '2024-10-25',
  },
  {
    id: 5,
    rfqNumber: 'RFQ-2024-10005',
    customer: 'Retail Hub',
    product: 'Bluetooth Speaker',
    quantity: 300,
    targetPrice: 80,
    quotesReceived: 2,
    bestQuote: 75,
    savings: 1500,
    status: 'expired',
    createdDate: '2024-10-20',
  },
];

const AdminRFQReportsPage: React.FC = () => {
  const [period, setPeriod] = useState<string>('month');

  const totalRFQs = mockRFQs.length;
  const acceptedRFQs = mockRFQs.filter(r => r.status === 'accepted').length;
  const totalQuotes = mockRFQs.reduce((sum, r) => sum + r.quotesReceived, 0);
  const totalSavings = mockRFQs.reduce((sum, r) => sum + r.savings, 0);
  const conversionRate = (acceptedRFQs / totalRFQs) * 100;

  // Status distribution
  const statusData = [
    { type: 'New', value: mockRFQs.filter(r => r.status === 'new').length },
    { type: 'Quoted', value: mockRFQs.filter(r => r.status === 'quoted').length },
    { type: 'Accepted', value: mockRFQs.filter(r => r.status === 'accepted').length },
    { type: 'Expired', value: mockRFQs.filter(r => r.status === 'expired').length },
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
        New: '#1890ff',
        Quoted: '#faad14',
        Accepted: '#52c41a',
        Expired: '#ff4d4f',
      };
      return colors[type];
    },
  };

  // Quotes received chart
  const quotesChartData = mockRFQs.map(r => ({
    rfq: r.rfqNumber.split('-')[2],
    quotes: r.quotesReceived,
  }));

  const quotesChartConfig = {
    data: quotesChartData,
    xField: 'rfq',
    yField: 'quotes',
    color: '#722ed1',
    columnWidthRatio: 0.6,
    label: {
      position: 'top' as const,
    },
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      new: 'blue',
      quoted: 'warning',
      accepted: 'success',
      expired: 'error',
      rejected: 'default',
    };
    return colors[status] || 'default';
  };

  const columns: ColumnsType<RFQReport> = [
    {
      title: 'RFQ Number',
      dataIndex: 'rfqNumber',
      key: 'rfqNumber',
      fixed: 'left',
      width: 150,
      render: (text: string) => <Text strong copyable>{text}</Text>,
    },
    {
      title: 'Customer',
      dataIndex: 'customer',
      key: 'customer',
      width: 150,
    },
    {
      title: 'Product',
      dataIndex: 'product',
      key: 'product',
      width: 180,
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 100,
      render: (value: number) => value.toLocaleString(),
    },
    {
      title: 'Target Price',
      dataIndex: 'targetPrice',
      key: 'targetPrice',
      width: 120,
      render: (value: number) => `$${value.toFixed(2)}`,
    },
    {
      title: 'Quotes',
      dataIndex: 'quotesReceived',
      key: 'quotesReceived',
      width: 100,
      sorter: (a, b) => a.quotesReceived - b.quotesReceived,
      render: (value: number) => (
        <Tag color={value > 0 ? 'blue' : 'default'}>
          {value} quotes
        </Tag>
      ),
    },
    {
      title: 'Best Quote',
      dataIndex: 'bestQuote',
      key: 'bestQuote',
      width: 120,
      render: (value: number, record) => (
        value > 0 ? (
          <Space direction="vertical" size="small">
            <Text strong style={{ color: '#52c41a' }}>
              ${value.toFixed(2)}
            </Text>
            {record.targetPrice > 0 && (
              <Progress
                percent={Math.min((value / record.targetPrice) * 100, 100)}
                size="small"
                status={value <= record.targetPrice ? 'success' : 'normal'}
                showInfo={false}
              />
            )}
          </Space>
        ) : (
          <Text type="secondary">N/A</Text>
        )
      ),
    },
    {
      title: 'Savings',
      dataIndex: 'savings',
      key: 'savings',
      width: 120,
      sorter: (a, b) => a.savings - b.savings,
      render: (value: number) => (
        value > 0 ? (
          <Text strong style={{ color: '#52c41a' }}>
            ${value.toLocaleString()}
          </Text>
        ) : (
          <Text type="secondary">-</Text>
        )
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
        { text: 'New', value: 'new' },
        { text: 'Quoted', value: 'quoted' },
        { text: 'Accepted', value: 'accepted' },
        { text: 'Expired', value: 'expired' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Created Date',
      dataIndex: 'createdDate',
      key: 'createdDate',
      width: 120,
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={3}>RFQ Reports</Title>
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
              title="Total RFQs"
              value={totalRFQs}
              prefix={<FileTextOutlined style={{ color: '#1890ff' }} />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Accepted RFQs"
              value={acceptedRFQs}
              prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Conversion Rate"
              value={conversionRate}
              precision={1}
              suffix="%"
              prefix={<PercentageOutlined style={{ color: '#722ed1' }} />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Savings"
              value={totalSavings}
              precision={2}
              prefix={<DollarOutlined style={{ color: '#faad14' }} />}
              valueStyle={{ color: '#faad14' }}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>
              From {totalQuotes} quotes
            </Text>
          </Card>
        </Col>
      </Row>

      {/* Charts */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={16}>
          <Card title="Quotes Received per RFQ" bordered={false}>
            <Column {...quotesChartConfig} />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="RFQ Status Distribution" bordered={false}>
            <Pie {...statusChartConfig} />
          </Card>
        </Col>
      </Row>

      {/* RFQ Table */}
      <Card title="RFQ Performance Details" bordered={false}>
        <Table
          columns={columns}
          dataSource={mockRFQs}
          rowKey="id"
          scroll={{ x: 1400 }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} RFQs`,
          }}
        />
      </Card>
    </div>
  );
};

export default AdminRFQReportsPage;
