import React, { useState } from 'react';
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
  Progress,
  Tabs,
  List,
  Avatar,
  Badge,
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

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

interface PaymentMethod {
  id: number;
  type: 'credit_card' | 'debit_card' | 'paypal' | 'bank_account' | 'apple_pay' | 'google_pay';
  name: string;
  last4: string;
  brand?: string;
  expiryDate?: string;
  isDefault: boolean;
  billingAddress: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  addedDate: string;
  lastUsed?: string;
}

interface Transaction {
  id: number;
  type: 'payment' | 'refund' | 'authorization';
  amount: number;
  currency: string;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  paymentMethod: string;
  orderId: string;
  timestamp: string;
  description: string;
}

const mockPaymentMethods: PaymentMethod[] = [
  {
    id: 1,
    type: 'credit_card',
    name: 'Visa ending in 4242',
    last4: '4242',
    brand: 'Visa',
    expiryDate: '12/2027',
    isDefault: true,
    billingAddress: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zip: '10001',
      country: 'USA',
    },
    addedDate: dayjs().subtract(2, 'years').format('YYYY-MM-DD'),
    lastUsed: dayjs().subtract(3, 'days').format('YYYY-MM-DD'),
  },
  {
    id: 2,
    type: 'paypal',
    name: 'PayPal',
    last4: 'user@email.com',
    isDefault: false,
    billingAddress: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zip: '10001',
      country: 'USA',
    },
    addedDate: dayjs().subtract(1, 'year').format('YYYY-MM-DD'),
    lastUsed: dayjs().subtract(30, 'days').format('YYYY-MM-DD'),
  },
  {
    id: 3,
    type: 'bank_account',
    name: 'Bank Account',
    last4: '6789',
    brand: 'Chase',
    isDefault: false,
    billingAddress: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zip: '10001',
      country: 'USA',
    },
    addedDate: dayjs().subtract(6, 'months').format('YYYY-MM-DD'),
  },
];

const mockTransactions: Transaction[] = [
  {
    id: 1,
    type: 'payment',
    amount: 299.99,
    currency: 'USD',
    status: 'completed',
    paymentMethod: 'Visa ****4242',
    orderId: '#12345',
    timestamp: dayjs().subtract(3, 'days').toISOString(),
    description: 'Order payment',
  },
  {
    id: 2,
    type: 'refund',
    amount: 49.99,
    currency: 'USD',
    status: 'completed',
    paymentMethod: 'Visa ****4242',
    orderId: '#12340',
    timestamp: dayjs().subtract(10, 'days').toISOString(),
    description: 'Order refund',
  },
  {
    id: 3,
    type: 'payment',
    amount: 599.99,
    currency: 'USD',
    status: 'pending',
    paymentMethod: 'PayPal',
    orderId: '#12346',
    timestamp: dayjs().subtract(1, 'hour').toISOString(),
    description: 'Order payment',
  },
  {
    id: 4,
    type: 'payment',
    amount: 1299.99,
    currency: 'USD',
    status: 'completed',
    paymentMethod: 'Visa ****4242',
    orderId: '#12350',
    timestamp: dayjs().subtract(30, 'days').toISOString(),
    description: 'Order payment',
  },
];

const PaymentMethodsPage: React.FC = () => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(mockPaymentMethods);
  const [transactions] = useState<Transaction[]>(mockTransactions);
  const [isAddModalVisible, setIsAddModalVisible] = useState<boolean>(false);
  const [form] = Form.useForm();

  const handleAddPaymentMethod = (values: any) => {
    const newMethod: PaymentMethod = {
      id: paymentMethods.length + 1,
      type: values.type,
      name: `${values.type === 'credit_card' ? values.brand : values.type} ending in ${values.last4}`,
      last4: values.last4,
      brand: values.brand,
      expiryDate: values.expiryDate,
      isDefault: paymentMethods.length === 0,
      billingAddress: values.billingAddress,
      addedDate: dayjs().format('YYYY-MM-DD'),
    };

    setPaymentMethods([...paymentMethods, newMethod]);
    message.success('Payment method added successfully!');
    setIsAddModalVisible(false);
    form.resetFields();
  };

  const handleSetDefault = (id: number) => {
    setPaymentMethods(
      paymentMethods.map((pm) => ({
        ...pm,
        isDefault: pm.id === id,
      }))
    );
    message.success('Default payment method updated');
  };

  const handleDelete = (id: number) => {
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
      onOk: () => {
        setPaymentMethods(paymentMethods.filter((pm) => pm.id !== id));
        message.success('Payment method deleted');
      },
    });
  };

  const getPaymentIcon = (type: PaymentMethod['type']) => {
    const icons = {
      credit_card: <CreditCardOutlined style={{ fontSize: 24, color: '#1890ff' }} />,
      debit_card: <CreditCardOutlined style={{ fontSize: 24, color: '#52c41a' }} />,
      paypal: <PayCircleOutlined style={{ fontSize: 24, color: '#003087' }} />,
      bank_account: <BankOutlined style={{ fontSize: 24, color: '#722ed1' }} />,
      apple_pay: <CreditCardOutlined style={{ fontSize: 24, color: '#000' }} />,
      google_pay: <CreditCardOutlined style={{ fontSize: 24, color: '#4285F4' }} />,
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
            {record.expiryDate && (
              <Text type="secondary" style={{ fontSize: 12 }}>
                Expires: {record.expiryDate}
              </Text>
            )}
          </div>
        </div>
      ),
    },
    {
      title: 'Billing Address',
      key: 'address',
      render: (_, record) => (
        <div>
          <Text style={{ fontSize: 12 }}>
            {record.billingAddress.street}, {record.billingAddress.city}
          </Text>
          <div>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {record.billingAddress.state} {record.billingAddress.zip}
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: 'Last Used',
      dataIndex: 'lastUsed',
      key: 'lastUsed',
      render: (date) => (date ? dayjs(date).format('MMM DD, YYYY') : 'Never'),
    },
    {
      title: 'Added',
      dataIndex: 'addedDate',
      key: 'added',
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

  const transactionColumns: ColumnsType<Transaction> = [
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: Transaction['type']) => {
        const typeConfig = {
          payment: { color: 'blue', text: 'Payment' },
          refund: { color: 'green', text: 'Refund' },
          authorization: { color: 'orange', text: 'Authorization' },
        };
        const config = typeConfig[type];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
      filters: [
        { text: 'Payment', value: 'payment' },
        { text: 'Refund', value: 'refund' },
        { text: 'Authorization', value: 'authorization' },
      ],
      onFilter: (value, record) => record.type === value,
    },
    {
      title: 'Description',
      key: 'description',
      render: (_, record) => (
        <div>
          <Text>{record.description}</Text>
          <div>
            <Text type="secondary" style={{ fontSize: 12 }}>
              Order: {record.orderId}
            </Text>
          </div>
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
            color: record.type === 'refund' ? '#52c41a' : '#1890ff',
          }}
        >
          {record.type === 'refund' ? '+' : '-'}${amount.toFixed(2)}
        </Text>
      ),
    },
    {
      title: 'Payment Method',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: Transaction['status']) => {
        const statusConfig = {
          completed: { color: 'success', icon: <CheckCircleOutlined />, text: 'Completed' },
          pending: { color: 'processing', icon: <ClockCircleOutlined />, text: 'Pending' },
          failed: { color: 'error', icon: <WarningOutlined />, text: 'Failed' },
          refunded: { color: 'default', icon: <CheckCircleOutlined />, text: 'Refunded' },
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
        { text: 'Refunded', value: 'refunded' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Date',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (date) => dayjs(date).format('MMM DD, YYYY HH:mm'),
    },
  ];

  const totalSpent = transactions
    .filter((t) => t.type === 'payment' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalRefunded = transactions
    .filter((t) => t.type === 'refund' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
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
            initialValue="credit_card"
          >
            <Select size="large">
              <Option value="credit_card">
                <CreditCardOutlined /> Credit Card
              </Option>
              <Option value="debit_card">
                <CreditCardOutlined /> Debit Card
              </Option>
              <Option value="paypal">
                <PayCircleOutlined /> PayPal
              </Option>
              <Option value="bank_account">
                <BankOutlined /> Bank Account
              </Option>
            </Select>
          </Form.Item>

          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) => prevValues.type !== currentValues.type}
          >
            {({ getFieldValue }) =>
              getFieldValue('type') === 'credit_card' || getFieldValue('type') === 'debit_card' ? (
                <>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        label="Card Brand"
                        name="brand"
                        rules={[{ required: true, message: 'Please select brand' }]}
                      >
                        <Select size="large">
                          <Option value="Visa">Visa</Option>
                          <Option value="Mastercard">Mastercard</Option>
                          <Option value="Amex">American Express</Option>
                          <Option value="Discover">Discover</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        label="Last 4 Digits"
                        name="last4"
                        rules={[
                          { required: true, message: 'Please enter last 4 digits' },
                          { len: 4, message: 'Must be 4 digits' },
                        ]}
                      >
                        <Input size="large" placeholder="4242" maxLength={4} />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item
                    label="Expiry Date"
                    name="expiryDate"
                    rules={[{ required: true, message: 'Please enter expiry date' }]}
                  >
                    <Input size="large" placeholder="MM/YYYY" />
                  </Form.Item>
                </>
              ) : getFieldValue('type') === 'paypal' ? (
                <Form.Item
                  label="PayPal Email"
                  name="last4"
                  rules={[
                    { required: true, message: 'Please enter email' },
                    { type: 'email', message: 'Please enter valid email' },
                  ]}
                >
                  <Input size="large" placeholder="user@email.com" />
                </Form.Item>
              ) : (
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      label="Bank Name"
                      name="brand"
                      rules={[{ required: true, message: 'Please enter bank name' }]}
                    >
                      <Input size="large" placeholder="Chase" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Last 4 Digits"
                      name="last4"
                      rules={[
                        { required: true, message: 'Please enter last 4 digits' },
                        { len: 4, message: 'Must be 4 digits' },
                      ]}
                    >
                      <Input size="large" placeholder="6789" maxLength={4} />
                    </Form.Item>
                  </Col>
                </Row>
              )
            }
          </Form.Item>

          <Form.Item label="Billing Address">
            <Form.Item
              name={['billingAddress', 'street']}
              rules={[{ required: true, message: 'Please enter street address' }]}
            >
              <Input size="large" placeholder="Street Address" />
            </Form.Item>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name={['billingAddress', 'city']}
                  rules={[{ required: true, message: 'Please enter city' }]}
                >
                  <Input size="large" placeholder="City" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name={['billingAddress', 'state']}
                  rules={[{ required: true, message: 'Please enter state' }]}
                >
                  <Input size="large" placeholder="State" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name={['billingAddress', 'zip']}
                  rules={[{ required: true, message: 'Please enter ZIP code' }]}
                >
                  <Input size="large" placeholder="ZIP Code" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name={['billingAddress', 'country']}
                  rules={[{ required: true, message: 'Please select country' }]}
                  initialValue="USA"
                >
                  <Select size="large">
                    <Option value="USA">United States</Option>
                    <Option value="CAN">Canada</Option>
                    <Option value="UK">United Kingdom</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
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
  );
};

export default PaymentMethodsPage;
