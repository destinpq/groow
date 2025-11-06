import React, { useState } from 'react';
import {
  Card,
  Table,
  Tag,
  Space,
  Input,
  Select,
  DatePicker,
  Typography,
  Row,
  Col,
  Statistic,
  Button,
} from 'antd';
import {
  SearchOutlined,
  DollarOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

interface Transaction {
  id: number;
  transactionId: string;
  date: string;
  type: string;
  category: string;
  amount: number;
  status: string;
  from: string;
  to: string;
  orderId?: string;
  paymentMethod: string;
}

const mockTransactions: Transaction[] = [
  {
    id: 1,
    transactionId: 'TXN-2024-100001',
    date: '2024-11-04 10:30:00',
    type: 'credit',
    category: 'order_payment',
    amount: 399.99,
    status: 'completed',
    from: 'John Doe',
    to: 'Platform',
    orderId: 'ORD-2024-10001',
    paymentMethod: 'Credit Card',
  },
  {
    id: 2,
    transactionId: 'TXN-2024-100002',
    date: '2024-11-04 09:15:00',
    type: 'debit',
    category: 'vendor_payout',
    amount: 500.00,
    status: 'completed',
    from: 'Platform',
    to: 'TechStore Inc',
    paymentMethod: 'Bank Transfer',
  },
  {
    id: 3,
    transactionId: 'TXN-2024-100003',
    date: '2024-11-03 14:20:00',
    type: 'credit',
    category: 'order_payment',
    amount: 199.99,
    status: 'completed',
    from: 'Sarah Smith',
    to: 'Platform',
    orderId: 'ORD-2024-10002',
    paymentMethod: 'PayPal',
  },
  {
    id: 4,
    transactionId: 'TXN-2024-100004',
    date: '2024-11-03 11:45:00',
    type: 'debit',
    category: 'refund',
    amount: 49.99,
    status: 'pending',
    from: 'Platform',
    to: 'Mike Johnson',
    orderId: 'ORD-2024-09980',
    paymentMethod: 'Credit Card',
  },
  {
    id: 5,
    transactionId: 'TXN-2024-100005',
    date: '2024-11-02 16:30:00',
    type: 'credit',
    category: 'commission',
    amount: 29.99,
    status: 'completed',
    from: 'TechStore Inc',
    to: 'Platform',
    orderId: 'ORD-2024-10001',
    paymentMethod: 'Auto Deduct',
  },
];

const AdminTransactionsPage: React.FC = () => {
  const [transactions] = useState<Transaction[]>(mockTransactions);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      completed: 'success',
      pending: 'warning',
      failed: 'error',
      cancelled: 'default',
    };
    return colors[status] || 'default';
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      order_payment: 'blue',
      vendor_payout: 'purple',
      refund: 'orange',
      commission: 'green',
    };
    return colors[category] || 'default';
  };

  const columns: ColumnsType<Transaction> = [
    {
      title: 'Transaction ID',
      dataIndex: 'transactionId',
      key: 'transactionId',
      render: (text: string) => <Text strong copyable>{text}</Text>,
    },
    {
      title: 'Date & Time',
      dataIndex: 'date',
      key: 'date',
      render: (date: string) => (
        <div>
          <Text>{new Date(date).toLocaleDateString()}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: 12 }}>
            {new Date(date).toLocaleTimeString()}
          </Text>
        </div>
      ),
      sorter: (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <Tag
          color={type === 'credit' ? 'success' : 'error'}
          icon={type === 'credit' ? <ArrowDownOutlined /> : <ArrowUpOutlined />}
        >
          {type.toUpperCase()}
        </Tag>
      ),
      filters: [
        { text: 'Credit', value: 'credit' },
        { text: 'Debit', value: 'debit' },
      ],
      onFilter: (value, record) => record.type === value,
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (category: string) => (
        <Tag color={getCategoryColor(category)}>
          {category.replace('_', ' ').toUpperCase()}
        </Tag>
      ),
      filters: [
        { text: 'Order Payment', value: 'order_payment' },
        { text: 'Vendor Payout', value: 'vendor_payout' },
        { text: 'Refund', value: 'refund' },
        { text: 'Commission', value: 'commission' },
      ],
      onFilter: (value, record) => record.category === value,
    },
    {
      title: 'From → To',
      key: 'parties',
      render: (_, record) => (
        <div>
          <Text>{record.from}</Text>
          <Text type="secondary"> → </Text>
          <Text>{record.to}</Text>
        </div>
      ),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number, record) => (
        <Text
          strong
          style={{
            color: record.type === 'credit' ? '#52c41a' : '#ff4d4f',
            fontSize: 16,
          }}
        >
          {record.type === 'credit' ? '+' : '-'}${amount.toFixed(2)}
        </Text>
      ),
      sorter: (a, b) => a.amount - b.amount,
    },
    {
      title: 'Payment Method',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
    },
    {
      title: 'Order ID',
      dataIndex: 'orderId',
      key: 'orderId',
      render: (orderId?: string) => (orderId ? <Text copyable>{orderId}</Text> : <Text type="secondary">-</Text>),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{status.toUpperCase()}</Tag>
      ),
      filters: [
        { text: 'Completed', value: 'completed' },
        { text: 'Pending', value: 'pending' },
        { text: 'Failed', value: 'failed' },
        { text: 'Cancelled', value: 'cancelled' },
      ],
      onFilter: (value, record) => record.status === value,
    },
  ];

  const totalCredit = transactions
    .filter((t) => t.type === 'credit' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalDebit = transactions
    .filter((t) => t.type === 'debit' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const netAmount = totalCredit - totalDebit;
  const pendingAmount = transactions
    .filter((t) => t.status === 'pending')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>Transaction Management</Title>

      {/* Statistics */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Credit"
              value={totalCredit}
              precision={2}
              prefix={<ArrowDownOutlined style={{ color: '#52c41a' }} />}
              suffix="USD"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Debit"
              value={totalDebit}
              precision={2}
              prefix={<ArrowUpOutlined style={{ color: '#ff4d4f' }} />}
              suffix="USD"
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Net Amount"
              value={netAmount}
              precision={2}
              prefix={<DollarOutlined style={{ color: '#1890ff' }} />}
              suffix="USD"
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Pending"
              value={pendingAmount}
              precision={2}
              prefix={<DollarOutlined style={{ color: '#faad14' }} />}
              suffix="USD"
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      <Card>
        {/* Filters */}
        <Space style={{ marginBottom: 16, width: '100%', flexWrap: 'wrap' }}>
          <Input
            placeholder="Search transactions..."
            prefix={<SearchOutlined />}
            style={{ width: 250 }}
          />
          <Select placeholder="Type" style={{ width: 150 }}>
            <Option value="all">All Types</Option>
            <Option value="credit">Credit</Option>
            <Option value="debit">Debit</Option>
          </Select>
          <Select placeholder="Category" style={{ width: 180 }}>
            <Option value="all">All Categories</Option>
            <Option value="order_payment">Order Payment</Option>
            <Option value="vendor_payout">Vendor Payout</Option>
            <Option value="refund">Refund</Option>
            <Option value="commission">Commission</Option>
          </Select>
          <Select placeholder="Status" style={{ width: 150 }}>
            <Option value="all">All Status</Option>
            <Option value="completed">Completed</Option>
            <Option value="pending">Pending</Option>
            <Option value="failed">Failed</Option>
          </Select>
          <RangePicker />
          <Button type="primary" icon={<DownloadOutlined />}>
            Export
          </Button>
        </Space>

        {/* Transactions Table */}
        <Table
          columns={columns}
          dataSource={transactions}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} transactions`,
          }}
          scroll={{ x: 1200 }}
        />
      </Card>
    </div>
  );
};

export default AdminTransactionsPage;
