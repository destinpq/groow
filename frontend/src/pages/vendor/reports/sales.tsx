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
  FallOutlined,
} from '@ant-design/icons';
import { Line, Column } from '@ant-design/charts';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

interface SalesRecord {
  date: string;
  orders: number;
  revenue: number;
  avgOrderValue: number;
}

const mockSalesData: SalesRecord[] = [
  { date: '2024-10-28', orders: 12, revenue: 1245.50, avgOrderValue: 103.79 },
  { date: '2024-10-29', orders: 15, revenue: 1680.00, avgOrderValue: 112.00 },
  { date: '2024-10-30', orders: 18, revenue: 1920.00, avgOrderValue: 106.67 },
  { date: '2024-10-31', orders: 14, revenue: 1450.00, avgOrderValue: 103.57 },
  { date: '2024-11-01', orders: 16, revenue: 1780.00, avgOrderValue: 111.25 },
  { date: '2024-11-02', orders: 19, revenue: 2150.00, avgOrderValue: 113.16 },
  { date: '2024-11-03', orders: 21, revenue: 2340.00, avgOrderValue: 111.43 },
];

const VendorSalesReportPage: React.FC = () => {
  const [period, setPeriod] = useState<string>('week');

  const totalRevenue = mockSalesData.reduce((sum, item) => sum + item.revenue, 0);
  const totalOrders = mockSalesData.reduce((sum, item) => sum + item.orders, 0);
  const avgOrderValue = totalRevenue / totalOrders;
  
  // Calculate growth
  const lastPeriod = mockSalesData.slice(0, Math.floor(mockSalesData.length / 2));
  const currentPeriod = mockSalesData.slice(Math.floor(mockSalesData.length / 2));
  const lastRevenue = lastPeriod.reduce((sum, item) => sum + item.revenue, 0);
  const currentRevenue = currentPeriod.reduce((sum, item) => sum + item.revenue, 0);
  const growthRate = lastRevenue > 0 ? ((currentRevenue - lastRevenue) / lastRevenue) * 100 : 0;

  // Revenue trend chart
  const revenueChartData = mockSalesData.map(item => ({
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    value: item.revenue,
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
    yAxis: {
      label: {
        formatter: (v: string) => `$${Number(v).toLocaleString()}`,
      },
    },
  };

  // Orders chart
  const ordersChartData = mockSalesData.map(item => ({
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    orders: item.orders,
  }));

  const ordersChartConfig = {
    data: ordersChartData,
    xField: 'date',
    yField: 'orders',
    color: '#52c41a',
    columnWidthRatio: 0.6,
    label: {
      position: 'top' as const,
    },
  };

  const columns: ColumnsType<SalesRecord> = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Orders',
      dataIndex: 'orders',
      key: 'orders',
      sorter: (a, b) => a.orders - b.orders,
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
    {
      title: 'Avg Order Value',
      dataIndex: 'avgOrderValue',
      key: 'avgOrderValue',
      sorter: (a, b) => a.avgOrderValue - b.avgOrderValue,
      render: (value: number) => `$${value.toFixed(2)}`,
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={3}>Sales Analytics</Title>
        <Space>
          <Select value={period} onChange={setPeriod} style={{ width: 150 }}>
            <Option value="today">Today</Option>
            <Option value="week">Last 7 Days</Option>
            <Option value="month">This Month</Option>
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
              title="Total Revenue"
              value={totalRevenue}
              precision={2}
              prefix={<DollarOutlined style={{ color: '#1890ff' }} />}
              valueStyle={{ color: '#1890ff' }}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>
              {growthRate >= 0 ? (
                <><RiseOutlined style={{ color: '#52c41a' }} /> +{growthRate.toFixed(1)}%</>
              ) : (
                <><FallOutlined style={{ color: '#ff4d4f' }} /> {growthRate.toFixed(1)}%</>
              )}
              {' '}vs last period
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
              prefix="$"
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
              value={Math.abs(growthRate)}
              precision={1}
              suffix="%"
              valueStyle={{ color: growthRate >= 0 ? '#52c41a' : '#ff4d4f' }}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>
              Period comparison
            </Text>
          </Card>
        </Col>
      </Row>

      {/* Charts */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={12}>
          <Card title="Revenue Trend" variant="borderless">
            <Line {...revenueChartConfig} />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Orders Volume" variant="borderless">
            <Column {...ordersChartConfig} />
          </Card>
        </Col>
      </Row>

      {/* Sales Table */}
      <Card title="Daily Sales Breakdown" variant="borderless">
        <Table
          columns={columns}
          dataSource={mockSalesData}
          rowKey="date"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} days`,
          }}
        />
      </Card>
    </div>
  );
};

export default VendorSalesReportPage;
