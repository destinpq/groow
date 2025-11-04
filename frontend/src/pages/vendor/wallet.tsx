import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Button,
  Tag,
  Space,
  Modal,
  Form,
  Input,
  Select,
  message,
  Typography,
  Alert,
  Tabs,
} from 'antd';
import {
  WalletOutlined,
  DollarOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  BankOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text } = Typography;
const { Option } = Select;

interface Transaction {
  id: number;
  date: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  status: string;
  orderId?: string;
}

interface PayoutRequest {
  id: number;
  date: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  method: string;
  accountNumber: string;
}

const mockTransactions: Transaction[] = [
  {
    id: 1,
    date: '2024-11-01',
    type: 'credit',
    amount: 399.98,
    description: 'Order payment received',
    status: 'completed',
    orderId: 'ORD-2024-10001',
  },
  {
    id: 2,
    date: '2024-10-30',
    type: 'credit',
    amount: 199.99,
    description: 'Order payment received',
    status: 'completed',
    orderId: 'ORD-2024-10002',
  },
  {
    id: 3,
    date: '2024-10-28',
    type: 'debit',
    amount: 500.00,
    description: 'Payout to bank account',
    status: 'completed',
  },
  {
    id: 4,
    date: '2024-10-25',
    type: 'credit',
    amount: 549.97,
    description: 'Order payment received',
    status: 'completed',
    orderId: 'ORD-2024-10003',
  },
  {
    id: 5,
    date: '2024-10-20',
    type: 'debit',
    amount: 29.99,
    description: 'Platform commission',
    status: 'completed',
  },
];

const mockPayouts: PayoutRequest[] = [
  {
    id: 1,
    date: '2024-10-28',
    amount: 500.00,
    status: 'completed',
    method: 'Bank Transfer',
    accountNumber: '****1234',
  },
  {
    id: 2,
    date: '2024-10-15',
    amount: 300.00,
    status: 'completed',
    method: 'Bank Transfer',
    accountNumber: '****1234',
  },
];

const VendorWalletPage: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [payouts, setPayouts] = useState<PayoutRequest[]>(mockPayouts);
  const [payoutModalVisible, setPayoutModalVisible] = useState(false);
  const [form] = Form.useForm();

  const walletBalance = 649.94; // Mock balance
  const pendingAmount = 0;
  const totalEarnings = mockTransactions
    .filter((t) => t.type === 'credit')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalPayouts = mockTransactions
    .filter((t) => t.type === 'debit')
    .reduce((sum, t) => sum + t.amount, 0);

  const handleRequestPayout = (values: any) => {
    console.log('Payout request:', values);
    const newPayout: PayoutRequest = {
      id: payouts.length + 1,
      date: new Date().toISOString().split('T')[0],
      amount: parseFloat(values.amount),
      status: 'pending',
      method: values.method,
      accountNumber: values.accountNumber,
    };
    setPayouts([newPayout, ...payouts]);
    setPayoutModalVisible(false);
    form.resetFields();
    message.success('Payout request submitted successfully');
  };

  const transactionColumns: ColumnsType<Transaction> = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date: string) => new Date(date).toLocaleDateString(),
      sorter: (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <Tag color={type === 'credit' ? 'success' : 'error'} icon={type === 'credit' ? <ArrowDownOutlined /> : <ArrowUpOutlined />}>
          {type === 'credit' ? 'CREDIT' : 'DEBIT'}
        </Tag>
      ),
      filters: [
        { text: 'Credit', value: 'credit' },
        { text: 'Debit', value: 'debit' },
      ],
      onFilter: (value, record) => record.type === value,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (desc: string, record) => (
        <div>
          <Text>{desc}</Text>
          {record.orderId && (
            <div>
              <Text type="secondary" style={{ fontSize: 12 }}>
                Order: {record.orderId}
              </Text>
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number, record) => (
        <Text strong style={{ color: record.type === 'credit' ? '#52c41a' : '#ff4d4f' }}>
          {record.type === 'credit' ? '+' : '-'}${amount.toFixed(2)}
        </Text>
      ),
      sorter: (a, b) => a.amount - b.amount,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'completed' ? 'success' : 'processing'} icon={status === 'completed' ? <CheckCircleOutlined /> : <ClockCircleOutlined />}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
  ];

  const payoutColumns: ColumnsType<PayoutRequest> = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => (
        <Text strong style={{ color: '#1890ff', fontSize: 16 }}>
          ${amount.toFixed(2)}
        </Text>
      ),
    },
    {
      title: 'Method',
      dataIndex: 'method',
      key: 'method',
      render: (method: string) => (
        <Tag icon={<BankOutlined />}>{method}</Tag>
      ),
    },
    {
      title: 'Account',
      dataIndex: 'accountNumber',
      key: 'accountNumber',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const colors: Record<string, string> = {
          pending: 'processing',
          approved: 'success',
          rejected: 'error',
          completed: 'success',
        };
        return (
          <Tag color={colors[status]}>{status.toUpperCase()}</Tag>
        );
      },
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>Wallet & Payments</Title>

      {/* Balance Cards */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Current Balance"
              value={walletBalance}
              precision={2}
              prefix={<WalletOutlined style={{ color: '#1890ff' }} />}
              suffix="USD"
              valueStyle={{ color: '#1890ff' }}
            />
            <Button
              type="primary"
              style={{ marginTop: 16, width: '100%' }}
              onClick={() => setPayoutModalVisible(true)}
              disabled={walletBalance < 100}
            >
              Request Payout
            </Button>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Pending Amount"
              value={pendingAmount}
              precision={2}
              prefix={<ClockCircleOutlined style={{ color: '#faad14' }} />}
              suffix="USD"
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Earnings"
              value={totalEarnings}
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
              title="Total Payouts"
              value={totalPayouts}
              precision={2}
              prefix={<ArrowUpOutlined style={{ color: '#ff4d4f' }} />}
              suffix="USD"
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Alert */}
      {walletBalance < 100 && (
        <Alert
          message="Minimum payout amount is $100.00"
          description="You can request a payout once your balance reaches $100.00"
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}

      {/* Tabs */}
      <Card>
        <Tabs
          defaultActiveKey="transactions"
          items={[
            {
              key: 'transactions',
              label: 'All Transactions',
              children: (
                <Table
                  columns={transactionColumns}
                  dataSource={transactions}
                  rowKey="id"
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showTotal: (total) => `Total ${total} transactions`,
                  }}
                />
              ),
            },
            {
              key: 'payouts',
              label: 'Payout History',
              children: (
                <div>
                  <div style={{ marginBottom: 16, textAlign: 'right' }}>
                    <Button
                      type="primary"
                      icon={<DollarOutlined />}
                      onClick={() => setPayoutModalVisible(true)}
                      disabled={walletBalance < 100}
                    >
                      Request New Payout
                    </Button>
                  </div>
                  <Table
                    columns={payoutColumns}
                    dataSource={payouts}
                    rowKey="id"
                    pagination={{
                      pageSize: 10,
                      showSizeChanger: true,
                      showTotal: (total) => `Total ${total} payouts`,
                    }}
                  />
                </div>
              ),
            },
          ]}
        />
      </Card>

      {/* Payout Request Modal */}
      <Modal
        title="Request Payout"
        open={payoutModalVisible}
        onCancel={() => setPayoutModalVisible(false)}
        footer={null}
      >
        <Alert
          message={`Available Balance: $${walletBalance.toFixed(2)}`}
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
        />

        <Form form={form} layout="vertical" onFinish={handleRequestPayout}>
          <Form.Item
            name="amount"
            label="Payout Amount"
            rules={[
              { required: true, message: 'Please enter amount' },
              {
                validator: (_, value) => {
                  if (value && parseFloat(value) > walletBalance) {
                    return Promise.reject('Amount exceeds available balance');
                  }
                  if (value && parseFloat(value) < 100) {
                    return Promise.reject('Minimum payout amount is $100.00');
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input
              type="number"
              prefix="$"
              placeholder="Enter amount"
              min={100}
              max={walletBalance}
              step={0.01}
            />
          </Form.Item>

          <Form.Item
            name="method"
            label="Payout Method"
            rules={[{ required: true, message: 'Please select payout method' }]}
          >
            <Select placeholder="Select payout method">
              <Option value="Bank Transfer">Bank Transfer</Option>
              <Option value="PayPal">PayPal</Option>
              <Option value="Wire Transfer">Wire Transfer</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="accountNumber"
            label="Account Number"
            rules={[{ required: true, message: 'Please enter account number' }]}
          >
            <Input placeholder="Enter account number" />
          </Form.Item>

          <Form.Item name="notes" label="Notes (Optional)">
            <Input.TextArea rows={3} placeholder="Add any notes..." />
          </Form.Item>

          <Alert
            message="Payout Processing Time"
            description="Payout requests are typically processed within 3-5 business days. You will receive an email confirmation once approved."
            type="warning"
            showIcon
            style={{ marginBottom: 16 }}
          />

          <Form.Item>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => setPayoutModalVisible(false)}>Cancel</Button>
              <Button type="primary" htmlType="submit" icon={<DollarOutlined />}>
                Submit Request
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default VendorWalletPage;
