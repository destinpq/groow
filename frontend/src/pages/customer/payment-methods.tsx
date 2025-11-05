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
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { paymentAPI, walletAPI } from '@/services/api/wallet';
import type { PaymentMethod, WalletTransaction } from '@/services/api/wallet';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const PaymentMethodsPage: React.FC = () => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState<boolean>(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchPaymentMethods();
    fetchTransactions();
  }, []);

  const fetchPaymentMethods = async () => {
    try {
      setLoading(true);
      const data = await paymentAPI.getAll();
      setPaymentMethods(data);
    } catch (error) {
      message.error('Failed to load payment methods');
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await walletAPI.getTransactions({ limit: 50 });
      setTransactions(response.data);
    } catch (error) {
      message.error('Failed to load transactions');
    }
  };

  const handleAddPaymentMethod = async (values: any) => {
    try {
      setLoading(true);
      await paymentAPI.add({
        type: values.type,
        cardNumber: values.cardNumber,
        expiryMonth: values.expiryMonth,
        expiryYear: values.expiryYear,
        cvv: values.cvv,
        nameOnCard: values.nameOnCard,
        bankName: values.bankName,
        accountNumber: values.accountNumber,
        routingNumber: values.routingNumber,
        paypalEmail: values.paypalEmail,
      });
      
      message.success('Payment method added successfully!');
      setIsAddModalVisible(false);
      form.resetFields();
      await fetchPaymentMethods();
    } catch (error) {
      message.error('Failed to add payment method');
    } finally {
      setLoading(false);
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await paymentAPI.setDefault(id);
      message.success('Default payment method updated');
      await fetchPaymentMethods();
    } catch (error) {
      message.error('Failed to update default payment method');
    }
  };

  const handleDelete = (id: string) => {
    const method = paymentMethods.find((pm) => pm.id === id);
    if (method?.isDefault && paymentMethods.length > 1) {
      message.error('Cannot delete default payment method. Please set another as default first.');
      return;
    }

    Modal.confirm({
      title: 'Delete Payment Method',
      content: 'Are you sure you want to delete this payment method?',
      okText: 'Delete',
      okType: 'danger',
      onOk: async () => {
        try {
          await paymentAPI.delete(id);
          message.success('Payment method deleted');
          await fetchPaymentMethods();
        } catch (error) {
          message.error('Failed to delete payment method');
        }
      },
    });
  };

  const getPaymentIcon = (type: PaymentMethod['type']) => {
    const icons = {
      card: <CreditCardOutlined style={{ fontSize: 24, color: '#1890ff' }} />,
      bank: <BankOutlined style={{ fontSize: 24, color: '#722ed1' }} />,
      paypal: <PayCircleOutlined style={{ fontSize: 24, color: '#003087' }} />,
      wallet: <DollarOutlined style={{ fontSize: 24, color: '#52c41a' }} />,
    };
    return icons[type];
  };

  const paymentColumns: ColumnsType<PaymentMethod> = [
    {
      title: 'Payment Method',
      key: 'method',
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 48,
              height: 48,
              background: '#f0f0f0',
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {getPaymentIcon(record.type)}
          </div>
          <div>
            <div>
              <Text strong>{record.name}</Text>
              {record.isDefault && (
                <Tag color="blue" style={{ marginLeft: 8 }}>
                  Default
                </Tag>
              )}
            </div>
            {record.expiryMonth && record.expiryYear && (
              <Text type="secondary" style={{ fontSize: 12 }}>
                Expires: {record.expiryMonth}/{record.expiryYear}
              </Text>
            )}
            {record.last4 && (
              <Text type="secondary" style={{ fontSize: 12, marginLeft: 8 }}>
                ••••{record.last4}
              </Text>
            )}
          </div>
        </div>
      ),
    },
    {
      title: 'Brand',
      dataIndex: 'brand',
      key: 'brand',
      render: (brand) => brand ? <Tag>{brand}</Tag> : <Text type="secondary">-</Text>,
    },
    {
      title: 'Added',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => dayjs(date).format('MMM DD, YYYY'),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          {!record.isDefault && (
            <Button size="small" onClick={() => handleSetDefault(record.id)}>
              Set Default
            </Button>
          )}
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => message.info('Edit functionality')}
          >
            Edit
          </Button>
          <Button
            type="link"
            danger
            size="small"
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  const transactionColumns: ColumnsType<WalletTransaction> = [
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: WalletTransaction['type']) => {
        const typeConfig = {
          credit: { color: 'green', text: 'Credit' },
          debit: { color: 'red', text: 'Debit' },
        };
        const config = typeConfig[type];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
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
      render: (description, record) => (
        <div>
          <Text>{description}</Text>
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
      render: (amount, record) => (
        <Text
          strong
          style={{
            fontSize: 16,
            color: record.type === 'credit' ? '#52c41a' : '#ff4d4f',
          }}
        >
          {record.type === 'credit' ? '+' : '-'}${amount.toFixed(2)}
        </Text>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: WalletTransaction['status']) => {
        const statusConfig = {
          completed: { color: 'success', icon: <CheckCircleOutlined />, text: 'Completed' },
          pending: { color: 'processing', icon: <ClockCircleOutlined />, text: 'Pending' },
          failed: { color: 'error', icon: <WarningOutlined />, text: 'Failed' },
        };
        const config = statusConfig[status];
        return (
          <Tag color={config.color} icon={config.icon}>
            {config.text}
          </Tag>
        );
      },
      filters: [
        { text: 'Completed', value: 'completed' },
        { text: 'Pending', value: 'pending' },
        { text: 'Failed', value: 'failed' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => dayjs(date).format('MMM DD, YYYY HH:mm'),
    },
  ];

  const totalSpent = transactions
    .filter((t) => t.type === 'debit' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalRefunded = transactions
    .filter((t) => t.type === 'credit' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <Spin spinning={loading}>
      <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={3}>
            <CreditCardOutlined style={{ color: '#1890ff' }} /> Payment Methods
          </Title>
          <Paragraph type="secondary">
            Manage your payment methods and view transaction history
          </Paragraph>
        </Col>
        <Col>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsAddModalVisible(true)}
          >
            Add Payment Method
          </Button>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Saved Methods"
              value={paymentMethods.length}
              valueStyle={{ color: '#1890ff' }}
              prefix={<CreditCardOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Total Spent"
              value={totalSpent}
              prefix="$"
              precision={2}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Total Refunded"
              value={totalRefunded}
              prefix="$"
              precision={2}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      <Alert
        message={
          <Space>
            <SafetyOutlined />
            <Text strong>Your payment information is secure</Text>
          </Space>
        }
        description="We use industry-standard encryption to protect your payment data. Your card details are never stored on our servers."
        type="info"
        showIcon={false}
        style={{ marginBottom: 24 }}
      />

      <Tabs defaultActiveKey="methods">
        <Tabs.TabPane tab={`Payment Methods (${paymentMethods.length})`} key="methods">
          <Card>
            <Table
              columns={paymentColumns}
              dataSource={paymentMethods}
              rowKey="id"
              pagination={false}
            />
          </Card>
        </Tabs.TabPane>

        <Tabs.TabPane tab={`Transaction History (${transactions.length})`} key="transactions">
          <Card>
            <Table
              columns={transactionColumns}
              dataSource={transactions}
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </Tabs.TabPane>
      </Tabs>

      <Modal
        title="Add Payment Method"
        open={isAddModalVisible}
        onCancel={() => setIsAddModalVisible(false)}
        footer={null}
        width={700}
      >
        <Form form={form} layout="vertical" onFinish={handleAddPaymentMethod}>
          <Form.Item
            label="Payment Type"
            name="type"
            rules={[{ required: true, message: 'Please select payment type' }]}
            initialValue="card"
          >
            <Select size="large">
              <Option value="card">
                <CreditCardOutlined /> Credit/Debit Card
              </Option>
              <Option value="paypal">
                <PayCircleOutlined /> PayPal
              </Option>
              <Option value="bank">
                <BankOutlined /> Bank Account
              </Option>
            </Select>
          </Form.Item>

          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) => prevValues.type !== currentValues.type}
          >
            {({ getFieldValue }) =>
              getFieldValue('type') === 'card' ? (
                <>
                  <Form.Item
                    label="Cardholder Name"
                    name="nameOnCard"
                    rules={[{ required: true, message: 'Please enter cardholder name' }]}
                  >
                    <Input size="large" placeholder="John Doe" />
                  </Form.Item>

                  <Form.Item
                    label="Card Number"
                    name="cardNumber"
                    rules={[
                      { required: true, message: 'Please enter card number' },
                      { len: 16, message: 'Card number must be 16 digits' },
                    ]}
                  >
                    <Input size="large" placeholder="1234567890123456" maxLength={16} />
                  </Form.Item>

                  <Row gutter={16}>
                    <Col span={8}>
                      <Form.Item
                        label="Expiry Month"
                        name="expiryMonth"
                        rules={[{ required: true, message: 'Required' }]}
                      >
                        <Input size="large" placeholder="MM" maxLength={2} />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        label="Expiry Year"
                        name="expiryYear"
                        rules={[{ required: true, message: 'Required' }]}
                      >
                        <Input size="large" placeholder="YYYY" maxLength={4} />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        label="CVV"
                        name="cvv"
                        rules={[
                          { required: true, message: 'Required' },
                          { len: 3, message: '3 digits' },
                        ]}
                      >
                        <Input size="large" placeholder="123" maxLength={3} type="password" />
                      </Form.Item>
                    </Col>
                  </Row>
                </>
              ) : getFieldValue('type') === 'paypal' ? (
                <Form.Item
                  label="PayPal Email"
                  name="paypalEmail"
                  rules={[
                    { required: true, message: 'Please enter email' },
                    { type: 'email', message: 'Please enter valid email' },
                  ]}
                >
                  <Input size="large" placeholder="user@email.com" />
                </Form.Item>
              ) : (
                <>
                  <Form.Item
                    label="Bank Name"
                    name="bankName"
                    rules={[{ required: true, message: 'Please enter bank name' }]}
                  >
                    <Input size="large" placeholder="Chase Bank" />
                  </Form.Item>

                  <Form.Item
                    label="Account Number"
                    name="accountNumber"
                    rules={[{ required: true, message: 'Please enter account number' }]}
                  >
                    <Input size="large" placeholder="1234567890" />
                  </Form.Item>

                  <Form.Item
                    label="Routing Number"
                    name="routingNumber"
                    rules={[{ required: true, message: 'Please enter routing number' }]}
                  >
                    <Input size="large" placeholder="123456789" maxLength={9} />
                  </Form.Item>
                </>
              )
            }
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" size="large" icon={<PlusOutlined />}>
                Add Payment Method
              </Button>
              <Button size="large" onClick={() => setIsAddModalVisible(false)}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
      </div>
    </Spin>
  );
};

export default PaymentMethodsPage;
