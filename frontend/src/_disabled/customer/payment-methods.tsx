import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Table,
  Space,
  Button,
  Tag,
  Modal,
  Form,
  Input,
  Select,
  message,
  Statistic,
  Alert,
  Spin,
  Tabs,
  Tooltip,
  Popconfirm,
  Progress,
  Switch,
  Divider,
  Empty,
} from 'antd';
import {
  DollarOutlined,
  PlusOutlined,
  BankOutlined,
  CreditCardOutlined,
  PayCircleOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  WarningOutlined,
  SafetyOutlined,
  DeleteOutlined,
  EditOutlined,
  WalletOutlined,
  LockOutlined,
  ShoppingOutlined,
  HistoryOutlined,
  VerifiedOutlined,
  ExclamationCircleOutlined,
  ReloadOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  EyeOutlined,
  StarOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import accountAPI from '../../services/api/account';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

// Interfaces
interface PaymentMethodData {
  id: string;
  type: 'card' | 'bank' | 'wallet' | 'paypal';
  name: string;
  last4: string;
  expiryDate?: string;
  brand?: string;
  isDefault: boolean;
  isVerified: boolean;
  createdAt: string;
  status: 'active' | 'expired' | 'suspended';
}

interface WalletTransactionData {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  currency: string;
  description: string;
  status: 'completed' | 'pending' | 'failed';
  createdAt: string;
  paymentMethodId?: string;
  orderId?: string;
}

interface WalletBalance {
  available: number;
  pending: number;
  currency: string;
}

interface PaymentStats {
  totalSpent: number;
  transactionsCount: number;
  averageOrder: number;
  currency: string;
}

const PaymentMethodsPage: React.FC = () => {
  // State management
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodData[]>([]);
  const [transactions, setTransactions] = useState<WalletTransactionData[]>([]);
  const [walletBalance, setWalletBalance] = useState<WalletBalance | null>(null);
  const [paymentStats, setPaymentStats] = useState<PaymentStats | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  
  // Modal states
  const [isAddModalVisible, setIsAddModalVisible] = useState<boolean>(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState<boolean>(false);
  const [editingPayment, setEditingPayment] = useState<PaymentMethodData | null>(null);
  
  // Form instances
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();

  // Load data
  useEffect(() => {
    loadPaymentData();
  }, []);

  const loadPaymentData = async () => {
    try {
      setLoading(true);
      const paymentMethodsData = await accountAPI.paymentMethodsAPI.getPaymentMethods();

      setPaymentMethods(paymentMethodsData.data);

      // Mock data for demonstration - replace with real API calls
      setTransactions([
        {
          id: '1',
          type: 'debit',
          amount: 99.99,
          currency: 'USD',
          description: 'Purchase - Electronics Store',
          status: 'completed',
          createdAt: '2024-01-15T10:30:00Z',
          paymentMethodId: 'pm_1',
          orderId: 'ORD-2024-001'
        },
        {
          id: '2',
          type: 'credit',
          amount: 25.00,
          currency: 'USD',
          description: 'Refund - Return Processing',
          status: 'completed',
          createdAt: '2024-01-14T15:20:00Z',
          orderId: 'ORD-2024-001'
        },
        {
          id: '3',
          type: 'debit',
          amount: 149.99,
          currency: 'USD',
          description: 'Purchase - Fashion Items',
          status: 'pending',
          createdAt: '2024-01-13T09:15:00Z',
          paymentMethodId: 'pm_2'
        },
        {
          id: '4',
          type: 'debit',
          amount: 75.50,
          currency: 'USD',
          description: 'Purchase - Home & Garden',
          status: 'completed',
          createdAt: '2024-01-12T14:45:00Z',
          paymentMethodId: 'pm_1'
        },
        {
          id: '5',
          type: 'credit',
          amount: 15.99,
          currency: 'USD',
          description: 'Cashback Reward',
          status: 'completed',
          createdAt: '2024-01-10T11:20:00Z'
        }
      ]);

      setWalletBalance({
        available: 125.50,
        pending: 25.00,
        currency: 'USD'
      });

      setPaymentStats({
        totalSpent: 2450.75,
        transactionsCount: 23,
        averageOrder: 106.56,
        currency: 'USD'
      });

    } catch (error) {
      console.error('Failed to load payment data:', error);
      message.error('Failed to load payment data');
    } finally {
      setLoading(false);
    }
  };

  // Payment method handlers
  const handleAddPaymentMethod = async (values: any) => {
    try {
      setSaving(true);
      const response = await accountAPI.paymentMethodsAPI.addPaymentMethod({
        type: values.type,
        token: values.cardNumber, // In real implementation, this would be a tokenized card
        billingAddressId: undefined,
        setAsDefault: values.isDefault || false,
      });
      
      setPaymentMethods(prev => [...prev, response.data]);
      message.success('Payment method added successfully');
      setIsAddModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('Failed to add payment method:', error);
      message.error('Failed to add payment method');
    } finally {
      setSaving(false);
    }
  };

  const handleEditPaymentMethod = async (values: any) => {
    try {
      setSaving(true);
      if (!editingPayment) return;
      
      const response = await accountAPI.paymentMethodsAPI.updatePaymentMethod(editingPayment.id, {
        title: values.name,
        billingAddressId: undefined,
      });
      
      setPaymentMethods(prev => prev.map(pm => 
        pm.id === editingPayment.id ? response.data : pm
      ));
      message.success('Payment method updated successfully');
      setIsEditModalVisible(false);
      setEditingPayment(null);
      editForm.resetFields();
    } catch (error) {
      console.error('Failed to update payment method:', error);
      message.error('Failed to update payment method');
    } finally {
      setSaving(false);
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await accountAPI.paymentMethodsAPI.setDefaultPaymentMethod(id);
      setPaymentMethods(prev => prev.map(pm => ({
        ...pm,
        isDefault: pm.id === id
      })));
      message.success('Default payment method updated');
    } catch (error) {
      console.error('Failed to set default payment method:', error);
      message.error('Failed to set default payment method');
    }
  };

  const handleDeletePaymentMethod = async (id: string) => {
    try {
      await accountAPI.paymentMethodsAPI.deletePaymentMethod(id);
      setPaymentMethods(prev => prev.filter(pm => pm.id !== id));
      message.success('Payment method deleted successfully');
    } catch (error) {
      console.error('Failed to delete payment method:', error);
      message.error('Failed to delete payment method');
    }
  };

  // Utility functions
  const getPaymentIcon = (type: PaymentMethodData['type']) => {
    const icons = {
      card: <CreditCardOutlined style={{ color: '#1890ff' }} />,
      bank: <BankOutlined style={{ color: '#52c41a' }} />,
      paypal: <PayCircleOutlined style={{ color: '#0070ba' }} />,
      wallet: <WalletOutlined style={{ color: '#722ed1' }} />,
    };
    return icons[type];
  };

  const getStatusColor = (status: PaymentMethodData['status']) => {
    const colors = {
      active: 'green',
      expired: 'orange',
      suspended: 'red',
    };
    return colors[status];
  };

  const getTransactionIcon = (type: WalletTransactionData['type']) => {
    return type === 'credit' ? 
      <ArrowUpOutlined style={{ color: '#52c41a' }} /> : 
      <ArrowDownOutlined style={{ color: '#f5222d' }} />;
  };

  // Table columns
  const paymentColumns: ColumnsType<PaymentMethodData> = [
    {
      title: 'Type',
      key: 'type',
      width: 100,
      render: (record) => (
        <Space>
          {getPaymentIcon(record.type)}
          <span style={{ textTransform: 'capitalize' }}>{record.type}</span>
        </Space>
      ),
    },
    {
      title: 'Payment Details',
      key: 'details',
      render: (record) => (
        <div>
          <div style={{ fontWeight: 500 }}>{record.name}</div>
          <Text type="secondary">
            {record.brand && `${record.brand} • `}****{record.last4}
            {record.expiryDate && ` • Expires ${record.expiryDate}`}
          </Text>
        </div>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      width: 150,
      render: (record) => (
        <Space direction="vertical" size="small">
          <Tag color={getStatusColor(record.status)}>
            {record.status.toUpperCase()}
          </Tag>
          <Space>
            {record.isDefault && <Tag color="blue">DEFAULT</Tag>}
            {record.isVerified ? (
              <Tag color="green" icon={<VerifiedOutlined />}>VERIFIED</Tag>
            ) : (
              <Tag color="orange" icon={<WarningOutlined />}>UNVERIFIED</Tag>
            )}
          </Space>
        </Space>
      ),
    },
    {
      title: 'Added',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
      render: (date) => (
        <div>
          <div>{dayjs(date).format('MMM DD')}</div>
          <Text type="secondary">{dayjs(date).format('YYYY')}</Text>
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      render: (record) => (
        <Space>
          <Tooltip title="Edit">
            <Button
              type="link"
              size="small"
              icon={<EditOutlined />}
              onClick={() => {
                setEditingPayment(record);
                editForm.setFieldsValue(record);
                setIsEditModalVisible(true);
              }}
            />
          </Tooltip>
          {!record.isDefault && (
            <Tooltip title="Set as default">
              <Button
                type="link"
                size="small"
                onClick={() => handleSetDefault(record.id)}
              >
                Set Default
              </Button>
            </Tooltip>
          )}
          <Popconfirm
            title="Delete payment method"
            description="Are you sure you want to delete this payment method?"
            onConfirm={() => handleDeletePaymentMethod(record.id)}
            okText="Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Delete">
              <Button
                type="link"
                size="small"
                danger
                icon={<DeleteOutlined />}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const transactionColumns: ColumnsType<WalletTransactionData> = [
    {
      title: 'Type',
      key: 'type',
      width: 80,
      render: (record) => (
        <Space>
          {getTransactionIcon(record.type)}
          <span style={{ 
            textTransform: 'capitalize',
            color: record.type === 'credit' ? '#52c41a' : '#f5222d'
          }}>
            {record.type}
          </span>
        </Space>
      ),
    },
    {
      title: 'Description',
      key: 'description',
      render: (record) => (
        <div>
          <div style={{ fontWeight: 500 }}>{record.description}</div>
          {record.orderId && (
            <Text type="secondary">Order: {record.orderId}</Text>
          )}
        </div>
      ),
    },
    {
      title: 'Amount',
      key: 'amount',
      width: 120,
      render: (record) => (
        <div style={{
          color: record.type === 'credit' ? '#52c41a' : '#f5222d',
          fontWeight: 500
        }}>
          {record.type === 'credit' ? '+' : '-'}
          {record.currency} {record.amount.toFixed(2)}
        </div>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      width: 100,
      render: (record) => {
        const config = {
          completed: { color: 'green', icon: <CheckCircleOutlined /> },
          pending: { color: 'orange', icon: <ClockCircleOutlined /> },
          failed: { color: 'red', icon: <ExclamationCircleOutlined /> },
        };
        const { color, icon } = config[record.status as keyof typeof config];
        return (
          <Tag color={color} icon={icon}>
            {record.status.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
      render: (date) => (
        <div>
          <div>{dayjs(date).format('MMM DD')}</div>
          <Text type="secondary">{dayjs(date).format('HH:mm')}</Text>
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <Title level={2}>
          <WalletOutlined /> Payment Methods & Wallet
        </Title>
        <Paragraph>
          Manage your payment methods, view transaction history, and monitor your wallet balance.
        </Paragraph>
      </div>

      {/* Stats Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Wallet Balance"
              value={walletBalance?.available || 0}
              prefix={<DollarOutlined style={{ color: '#52c41a' }} />}
              precision={2}
              valueStyle={{ color: '#52c41a' }}
              suffix={walletBalance?.currency}
            />
            {walletBalance && walletBalance.pending > 0 && (
              <Text type="secondary">
                {walletBalance.currency} {walletBalance.pending.toFixed(2)} pending
              </Text>
            )}
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Spent"
              value={paymentStats?.totalSpent || 0}
              prefix={<ShoppingOutlined style={{ color: '#1890ff' }} />}
              precision={2}
              suffix={paymentStats?.currency}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Transactions"
              value={paymentStats?.transactionsCount || 0}
              prefix={<HistoryOutlined style={{ color: '#722ed1' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Average Order"
              value={paymentStats?.averageOrder || 0}
              prefix={<StarOutlined style={{ color: '#faad14' }} />}
              precision={2}
              suffix={paymentStats?.currency}
            />
          </Card>
        </Col>
      </Row>

      {/* Main Content */}
      <Card>
        <Tabs defaultActiveKey="1" size="large">
          {/* Payment Methods Tab */}
          <TabPane tab={<span><CreditCardOutlined />Payment Methods</span>} key="1">
            <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Title level={4} style={{ margin: 0 }}>
                Saved Payment Methods ({paymentMethods.length})
              </Title>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setIsAddModalVisible(true)}
              >
                Add Payment Method
              </Button>
            </div>

            {paymentMethods.length === 0 ? (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="No payment methods found"
              >
                <Button type="primary" onClick={() => setIsAddModalVisible(true)}>
                  Add Your First Payment Method
                </Button>
              </Empty>
            ) : (
              <Table
                dataSource={paymentMethods}
                columns={paymentColumns}
                rowKey="id"
                pagination={{
                  pageSize: 10,
                  showSizeChanger: false,
                  showQuickJumper: true,
                  showTotal: (total, range) =>
                    `${range[0]}-${range[1]} of ${total} payment methods`,
                }}
                locale={{ emptyText: 'No payment methods found' }}
              />
            )}
          </TabPane>

          {/* Transaction History Tab */}
          <TabPane tab={<span><HistoryOutlined />Transaction History</span>} key="2">
            <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Title level={4} style={{ margin: 0 }}>
                Recent Transactions ({transactions.length})
              </Title>
              <Button icon={<ReloadOutlined />} onClick={loadPaymentData}>
                Refresh
              </Button>
            </div>

            <Table
              dataSource={transactions}
              columns={transactionColumns}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} of ${total} transactions`,
              }}
              locale={{ emptyText: 'No transactions found' }}
            />
          </TabPane>

          {/* Security Tab */}
          <TabPane tab={<span><SafetyOutlined />Security</span>} key="3">
            <Title level={4}>Payment Security Settings</Title>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <Card size="small">
                <Row gutter={16} align="middle">
                  <Col flex="auto">
                    <Title level={5} style={{ margin: 0 }}>Two-Factor Authentication</Title>
                    <Text type="secondary">
                      Add an extra layer of security to your payments
                    </Text>
                  </Col>
                  <Col>
                    <Switch defaultChecked />
                  </Col>
                </Row>
              </Card>

              <Card size="small">
                <Row gutter={16} align="middle">
                  <Col flex="auto">
                    <Title level={5} style={{ margin: 0 }}>Payment Notifications</Title>
                    <Text type="secondary">
                      Get notified for every transaction
                    </Text>
                  </Col>
                  <Col>
                    <Switch defaultChecked />
                  </Col>
                </Row>
              </Card>

              <Card size="small">
                <Row gutter={16} align="middle">
                  <Col flex="auto">
                    <Title level={5} style={{ margin: 0 }}>Auto-save Payment Methods</Title>
                    <Text type="secondary">
                      Automatically save new payment methods for future use
                    </Text>
                  </Col>
                  <Col>
                    <Switch defaultChecked />
                  </Col>
                </Row>
              </Card>

              <Alert
                message="Security Tip"
                description="Always verify payment method details and enable two-factor authentication for enhanced security."
                type="info"
                showIcon
                icon={<LockOutlined />}
              />
            </Space>
          </TabPane>
        </Tabs>
      </Card>

      {/* Add Payment Method Modal */}
      <Modal
        title="Add Payment Method"
        open={isAddModalVisible}
        onCancel={() => {
          setIsAddModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddPaymentMethod}
        >
          <Form.Item
            name="type"
            label="Payment Type"
            rules={[{ required: true, message: 'Please select a payment type' }]}
          >
            <Select placeholder="Select payment type" size="large">
              <Option value="card">Credit/Debit Card</Option>
              <Option value="bank">Bank Account</Option>
              <Option value="paypal">PayPal</Option>
              <Option value="wallet">Digital Wallet</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="name"
            label="Name on Card/Account"
            rules={[{ required: true, message: 'Please enter the name' }]}
          >
            <Input size="large" placeholder="John Doe" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={16}>
              <Form.Item
                name="cardNumber"
                label="Card Number"
                rules={[{ required: true, message: 'Please enter card number' }]}
              >
                <Input size="large" placeholder="1234 5678 9012 3456" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="cvv"
                label="CVV"
                rules={[{ required: true, message: 'Please enter CVV' }]}
              >
                <Input size="large" placeholder="123" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="expiryMonth"
                label="Month"
                rules={[{ required: true, message: 'Please select month' }]}
              >
                <Select size="large" placeholder="MM">
                  {Array.from({ length: 12 }, (_, i) => (
                    <Option key={i + 1} value={String(i + 1).padStart(2, '0')}>
                      {String(i + 1).padStart(2, '0')}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="expiryYear"
                label="Year"
                rules={[{ required: true, message: 'Please select year' }]}
              >
                <Select size="large" placeholder="YYYY">
                  {Array.from({ length: 10 }, (_, i) => {
                    const year = new Date().getFullYear() + i;
                    return (
                      <Option key={year} value={String(year)}>
                        {year}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="brand" label="Brand">
                <Select size="large" placeholder="Select brand">
                  <Option value="visa">Visa</Option>
                  <Option value="mastercard">Mastercard</Option>
                  <Option value="amex">American Express</Option>
                  <Option value="discover">Discover</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="isDefault" valuePropName="checked">
            <Switch /> Set as default payment method
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={saving}>
                Add Payment Method
              </Button>
              <Button onClick={() => setIsAddModalVisible(false)}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit Payment Method Modal */}
      <Modal
        title="Edit Payment Method"
        open={isEditModalVisible}
        onCancel={() => {
          setIsEditModalVisible(false);
          setEditingPayment(null);
          editForm.resetFields();
        }}
        footer={null}
        width={500}
      >
        <Form
          form={editForm}
          layout="vertical"
          onFinish={handleEditPaymentMethod}
        >
          <Form.Item
            name="name"
            label="Name on Card/Account"
            rules={[{ required: true, message: 'Please enter the name' }]}
          >
            <Input size="large" placeholder="John Doe" />
          </Form.Item>

          <Form.Item name="isDefault" valuePropName="checked">
            <Switch /> Set as default payment method
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={saving}>
                Update Payment Method
              </Button>
              <Button onClick={() => setIsEditModalVisible(false)}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PaymentMethodsPage;