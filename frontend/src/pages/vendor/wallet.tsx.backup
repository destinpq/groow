import React, { useState, useEffect } from 'react';
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
  Spin,
  InputNumber,
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
import { walletAPI } from '@/services/api/wallet';
import type { Wallet, WalletTransaction, PayoutRequest } from '@/services/api/wallet';
import { useAuthStore } from '@/store/auth';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;

const VendorWalletPage: React.FC = () => {
  const { user } = useAuthStore();
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [payouts, setPayouts] = useState<PayoutRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [payoutModalVisible, setPayoutModalVisible] = useState(false);
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [form] = Form.useForm();

  // Fetch wallet balance
  const fetchWallet = async () => {
    try {
      const data = await walletAPI.getBalance();
      setWallet(data);
    } catch (error) {
      message.error('Failed to fetch wallet balance');
      console.error('Error fetching wallet:', error);
    }
  };

  // Fetch transactions
  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const filters: any = {};
      if (typeFilter !== 'all') {
        filters.type = typeFilter;
      }
      if (statusFilter !== 'all') {
        filters.status = statusFilter;
      }
      
      const response = await walletAPI.getTransactions(filters);
      setTransactions(response.data);
    } catch (error) {
      message.error('Failed to fetch transactions');
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch payout requests
  const fetchPayouts = async () => {
    try {
      const data = await walletAPI.getPayoutRequests();
      setPayouts(data);
    } catch (error) {
      message.error('Failed to fetch payout requests');
      console.error('Error fetching payouts:', error);
    }
  };

  useEffect(() => {
    fetchWallet();
    fetchPayouts();
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [typeFilter, statusFilter]);

  const handleRequestPayout = async (values: any) => {
    try {
      await walletAPI.requestPayout(values.amount, values.method);
      message.success('Payout request submitted successfully');
      setPayoutModalVisible(false);
      form.resetFields();
      fetchPayouts(); // Refresh payout list
      fetchWallet(); // Update balance
    } catch (error) {
      message.error('Failed to request payout');
      console.error('Error requesting payout:', error);
    }
  };

  const transactionColumns: ColumnsType<WalletTransaction> = [
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => dayjs(date).format('MMM DD, YYYY hh:mm A'),
      sorter: (a, b) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: WalletTransaction['type']) => (
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
          {record.reference && (
            <div>
              <Text type="secondary" style={{ fontSize: 12 }}>
                Ref: {record.reference}
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
      render: (status: WalletTransaction['status']) => (
        <Tag 
          color={status === 'completed' ? 'success' : status === 'pending' ? 'processing' : 'error'} 
          icon={status === 'completed' ? <CheckCircleOutlined /> : <ClockCircleOutlined />}
        >
          {status.toUpperCase()}
        </Tag>
      ),
    },
  ];

  const payoutColumns: ColumnsType<PayoutRequest> = [
    {
      title: 'Requested',
      dataIndex: 'requestedAt',
      key: 'requestedAt',
      render: (date: string) => dayjs(date).format('MMM DD, YYYY'),
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
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: PayoutRequest['status']) => {
        const colors: Record<PayoutRequest['status'], string> = {
          pending: 'processing',
          approved: 'success',
          rejected: 'error',
          paid: 'success',
        };
        return (
          <Tag color={colors[status]}>{status.toUpperCase()}</Tag>
        );
      },
    },
  ];

  return (
    <Spin spinning={loading}>
      <div style={{ padding: 24 }}>
        <Title level={3}>Wallet & Payments</Title>

      {/* Balance Cards */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Current Balance"
              value={wallet?.balance || 0}
              precision={2}
              prefix={<WalletOutlined style={{ color: '#1890ff' }} />}
              suffix="USD"
              valueStyle={{ color: '#1890ff' }}
            />
            <Button
              type="primary"
              style={{ marginTop: 16, width: '100%' }}
              onClick={() => setPayoutModalVisible(true)}
              disabled={(wallet?.balance || 0) < 100}
            >
              Request Payout
            </Button>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Pending Amount"
              value={wallet?.pendingBalance || 0}
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
              value={wallet?.totalEarned || 0}
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
              value={wallet?.totalSpent || 0}
              precision={2}
              prefix={<ArrowUpOutlined style={{ color: '#ff4d4f' }} />}
              suffix="USD"
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Alert */}
      {(wallet?.balance || 0) < 100 && (
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
                      disabled={(wallet?.balance || 0) < 100}
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
          message={`Available Balance: $${(wallet?.balance || 0).toFixed(2)}`}
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
                  const balance = wallet?.balance || 0;
                  if (value && parseFloat(value) > balance) {
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
              max={wallet?.balance || 0}
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
    </Spin>
  );
};

export default VendorWalletPage;
