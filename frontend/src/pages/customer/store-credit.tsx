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
  Select,
  Input,
  InputNumber,
  DatePicker,
  message,
  Statistic,
  Progress,
  Alert,
  Divider,
} from 'antd';
import {
  CreditCardOutlined,
  PlusOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  WarningOutlined,
  DollarOutlined,
  CalendarOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs, { Dayjs } from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;

interface StoreCredit {
  id: number;
  amount: number;
  source: 'refund' | 'promotion' | 'loyalty' | 'compensation' | 'gift' | 'return';
  description: string;
  expiryDate: string;
  isExpired: boolean;
  used: boolean;
  usedAmount: number;
  remainingAmount: number;
  orderId?: string;
  createdAt: string;
  usedAt?: string;
}

interface CreditTransaction {
  id: number;
  type: 'earned' | 'spent';
  amount: number;
  description: string;
  timestamp: string;
  orderId?: string;
  balance: number;
}

const mockStoreCredits: StoreCredit[] = [
  {
    id: 1,
    amount: 50,
    source: 'refund',
    description: 'Refund for order #12345',
    expiryDate: dayjs().add(90, 'days').format('YYYY-MM-DD'),
    isExpired: false,
    used: false,
    usedAmount: 0,
    remainingAmount: 50,
    orderId: '#12345',
    createdAt: dayjs().subtract(5, 'days').format('YYYY-MM-DD'),
  },
  {
    id: 2,
    amount: 25,
    source: 'promotion',
    description: 'Welcome bonus - New customer promotion',
    expiryDate: dayjs().add(30, 'days').format('YYYY-MM-DD'),
    isExpired: false,
    used: true,
    usedAmount: 15,
    remainingAmount: 10,
    createdAt: dayjs().subtract(10, 'days').format('YYYY-MM-DD'),
    usedAt: dayjs().subtract(3, 'days').format('YYYY-MM-DD'),
  },
  {
    id: 3,
    amount: 100,
    source: 'loyalty',
    description: 'Loyalty reward - Platinum member bonus',
    expiryDate: dayjs().add(180, 'days').format('YYYY-MM-DD'),
    isExpired: false,
    used: false,
    usedAmount: 0,
    remainingAmount: 100,
    createdAt: dayjs().subtract(15, 'days').format('YYYY-MM-DD'),
  },
  {
    id: 4,
    amount: 75,
    source: 'compensation',
    description: 'Apology credit for delayed delivery',
    expiryDate: dayjs().add(60, 'days').format('YYYY-MM-DD'),
    isExpired: false,
    used: true,
    usedAmount: 75,
    remainingAmount: 0,
    orderId: '#12348',
    createdAt: dayjs().subtract(20, 'days').format('YYYY-MM-DD'),
    usedAt: dayjs().subtract(10, 'days').format('YYYY-MM-DD'),
  },
  {
    id: 5,
    amount: 20,
    source: 'gift',
    description: 'Birthday gift from Groow',
    expiryDate: dayjs().subtract(5, 'days').format('YYYY-MM-DD'),
    isExpired: true,
    used: false,
    usedAmount: 0,
    remainingAmount: 0,
    createdAt: dayjs().subtract(40, 'days').format('YYYY-MM-DD'),
  },
];

const mockTransactions: CreditTransaction[] = [
  {
    id: 1,
    type: 'earned',
    amount: 50,
    description: 'Refund for order #12345',
    timestamp: dayjs().subtract(5, 'days').toISOString(),
    orderId: '#12345',
    balance: 235,
  },
  {
    id: 2,
    type: 'spent',
    amount: 15,
    description: 'Applied to order #12346',
    timestamp: dayjs().subtract(3, 'days').toISOString(),
    orderId: '#12346',
    balance: 220,
  },
  {
    id: 3,
    type: 'earned',
    amount: 100,
    description: 'Loyalty reward - Platinum bonus',
    timestamp: dayjs().subtract(15, 'days').toISOString(),
    balance: 235,
  },
  {
    id: 4,
    type: 'spent',
    amount: 75,
    description: 'Applied to order #12348',
    timestamp: dayjs().subtract(10, 'days').toISOString(),
    orderId: '#12348',
    balance: 160,
  },
];

const StoreCreditPage: React.FC = () => {
  const [credits, setCredits] = useState<StoreCredit[]>(mockStoreCredits);
  const [transactions] = useState<CreditTransaction[]>(mockTransactions);
  const [isRequestModalVisible, setIsRequestModalVisible] = useState<boolean>(false);
  const [form] = Form.useForm();

  const handleRequestCredit = (values: any) => {
    message.success(
      'Store credit request submitted. Our team will review and respond within 2-3 business days.'
    );
    setIsRequestModalVisible(false);
    form.resetFields();
  };

  const totalCredits = credits.reduce((sum, c) => sum + c.amount, 0);
  const availableCredits = credits
    .filter((c) => !c.isExpired)
    .reduce((sum, c) => sum + c.remainingAmount, 0);
  const usedCredits = credits.reduce((sum, c) => sum + c.usedAmount, 0);
  const expiredCredits = credits
    .filter((c) => c.isExpired)
    .reduce((sum, c) => sum + c.remainingAmount, 0);

  const creditColumns: ColumnsType<StoreCredit> = [
    {
      title: 'Credit Details',
      key: 'details',
      render: (_, record) => {
        const sourceConfig = {
          refund: { color: 'blue', text: 'Refund' },
          promotion: { color: 'green', text: 'Promotion' },
          loyalty: { color: 'purple', text: 'Loyalty' },
          compensation: { color: 'orange', text: 'Compensation' },
          gift: { color: 'magenta', text: 'Gift' },
          return: { color: 'cyan', text: 'Return' },
        };
        const config = sourceConfig[record.source];
        return (
          <div>
            <div>
              <Text strong>{record.description}</Text>
            </div>
            <Space style={{ marginTop: 4 }}>
              <Tag color={config.color}>{config.text}</Tag>
              {record.orderId && <Text type="secondary" style={{ fontSize: 12 }}>Order: {record.orderId}</Text>}
            </Space>
          </div>
        );
      },
    },
    {
      title: 'Amount',
      key: 'amount',
      render: (_, record) => (
        <div>
          <div>
            <Text strong style={{ fontSize: 16, color: '#1890ff' }}>
              ${record.amount}
            </Text>
          </div>
          {record.usedAmount > 0 && (
            <div style={{ marginTop: 4 }}>
              <Text type="secondary" style={{ fontSize: 12 }}>
                Used: ${record.usedAmount}
              </Text>
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Remaining',
      dataIndex: 'remainingAmount',
      key: 'remaining',
      render: (amount, record) => (
        <div>
          <Text
            strong
            style={{
              fontSize: 16,
              color: record.isExpired ? '#8c8c8c' : '#52c41a',
            }}
          >
            ${amount}
          </Text>
          {!record.isExpired && amount > 0 && (
            <div style={{ marginTop: 4 }}>
              <Progress
                percent={(amount / record.amount) * 100}
                size="small"
                showInfo={false}
                strokeColor="#52c41a"
              />
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Expiry Date',
      key: 'expiry',
      render: (_, record) => {
        const daysLeft = dayjs(record.expiryDate).diff(dayjs(), 'days');
        return (
          <div>
            <div>
              <Text>{dayjs(record.expiryDate).format('MMM DD, YYYY')}</Text>
            </div>
            {!record.isExpired && (
              <Text
                type={daysLeft < 7 ? 'danger' : 'secondary'}
                style={{ fontSize: 12 }}
              >
                {daysLeft > 0 ? `${daysLeft} days left` : 'Expires today'}
              </Text>
            )}
          </div>
        );
      },
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, record) => {
        if (record.isExpired) {
          return (
            <Tag color="default" icon={<ClockCircleOutlined />}>
              Expired
            </Tag>
          );
        }
        if (record.remainingAmount === 0) {
          return (
            <Tag color="success" icon={<CheckCircleOutlined />}>
              Fully Used
            </Tag>
          );
        }
        if (record.usedAmount > 0) {
          return (
            <Tag color="processing" icon={<ReloadOutlined />}>
              Partially Used
            </Tag>
          );
        }
        return (
          <Tag color="green" icon={<CheckCircleOutlined />}>
            Available
          </Tag>
        );
      },
      filters: [
        { text: 'Available', value: 'available' },
        { text: 'Partially Used', value: 'partial' },
        { text: 'Fully Used', value: 'used' },
        { text: 'Expired', value: 'expired' },
      ],
      onFilter: (value, record) => {
        if (value === 'expired') return record.isExpired;
        if (value === 'used') return record.remainingAmount === 0 && !record.isExpired;
        if (value === 'partial') return record.usedAmount > 0 && record.remainingAmount > 0;
        return record.remainingAmount > 0 && !record.isExpired;
      },
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'created',
      render: (date) => dayjs(date).format('MMM DD, YYYY'),
    },
  ];

  const transactionColumns: ColumnsType<CreditTransaction> = [
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: 'earned' | 'spent') => (
        <Tag color={type === 'earned' ? 'green' : 'red'}>
          {type === 'earned' ? 'Earned' : 'Spent'}
        </Tag>
      ),
      filters: [
        { text: 'Earned', value: 'earned' },
        { text: 'Spent', value: 'spent' },
      ],
      onFilter: (value, record) => record.type === value,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (desc, record) => (
        <div>
          <Text>{desc}</Text>
          {record.orderId && (
            <div>
              <Text type="secondary" style={{ fontSize: 12 }}>
                {record.orderId}
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
            color: record.type === 'earned' ? '#52c41a' : '#ff4d4f',
          }}
        >
          {record.type === 'earned' ? '+' : '-'}${amount}
        </Text>
      ),
    },
    {
      title: 'Balance',
      dataIndex: 'balance',
      key: 'balance',
      render: (balance) => (
        <Text strong style={{ fontSize: 16, color: '#1890ff' }}>
          ${balance}
        </Text>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (date) => dayjs(date).format('MMM DD, YYYY HH:mm'),
    },
  ];

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={3}>
            <CreditCardOutlined style={{ color: '#52c41a' }} /> Store Credit
          </Title>
          <Paragraph type="secondary">
            Manage your store credits and view transaction history
          </Paragraph>
        </Col>
        <Col>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsRequestModalVisible(true)}
          >
            Request Credit
          </Button>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Available Credit"
              value={availableCredits}
              precision={2}
              valueStyle={{ color: '#52c41a' }}
              prefix={<DollarOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Earned"
              value={totalCredits}
              prefix="$"
              precision={2}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Used"
              value={usedCredits}
              prefix="$"
              precision={2}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Expired"
              value={expiredCredits}
              precision={2}
              valueStyle={{ color: '#8c8c8c' }}
              prefix={<WarningOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {availableCredits > 0 && (
        <Alert
          message={`You have $${availableCredits.toFixed(2)} in available store credit!`}
          description="Your store credit will be automatically applied at checkout. Credits with the earliest expiry dates will be used first."
          type="success"
          showIcon
          icon={<CheckCircleOutlined />}
          style={{ marginBottom: 16 }}
        />
      )}

      {expiredCredits > 0 && (
        <Alert
          message={`$${expiredCredits.toFixed(2)} in store credit has expired`}
          description="Store credits typically expire 90 days after being issued. Make sure to use your credits before they expire!"
          type="warning"
          showIcon
          icon={<WarningOutlined />}
          closable
          style={{ marginBottom: 16 }}
        />
      )}

      <Card title="Store Credits" style={{ marginBottom: 24 }}>
        <Table
          columns={creditColumns}
          dataSource={credits}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Card title="Transaction History">
        <Table
          columns={transactionColumns}
          dataSource={transactions}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title="Request Store Credit"
        open={isRequestModalVisible}
        onCancel={() => setIsRequestModalVisible(false)}
        footer={null}
        width={600}
      >
        <Alert
          message="When to Request Store Credit"
          description={
            <ul style={{ marginBottom: 0, paddingLeft: 20 }}>
              <li>Product arrived damaged or defective</li>
              <li>Wrong item was delivered</li>
              <li>Order was delayed significantly</li>
              <li>Product didn't match description</li>
              <li>Poor customer service experience</li>
            </ul>
          }
          type="info"
          showIcon
          style={{ marginBottom: 24 }}
        />

        <Form form={form} layout="vertical" onFinish={handleRequestCredit}>
          <Form.Item
            label="Reason"
            name="reason"
            rules={[{ required: true, message: 'Please select a reason' }]}
          >
            <Select placeholder="Select reason for credit request" size="large">
              <Option value="damaged">Damaged Product</Option>
              <Option value="wrong">Wrong Item Delivered</Option>
              <Option value="delay">Significant Delay</Option>
              <Option value="mismatch">Product Mismatch</Option>
              <Option value="service">Customer Service Issue</Option>
              <Option value="other">Other</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Related Order"
            name="orderId"
            rules={[{ required: true, message: 'Please enter order ID' }]}
          >
            <Input placeholder="#12345" size="large" />
          </Form.Item>

          <Form.Item
            label="Requested Amount"
            name="amount"
            rules={[{ required: true, message: 'Please enter amount' }]}
          >
            <InputNumber
              min={1}
              max={1000}
              style={{ width: '100%' }}
              prefix="$"
              size="large"
              placeholder="50.00"
            />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[
              { required: true, message: 'Please provide details' },
              { min: 20, message: 'Please provide at least 20 characters' },
            ]}
          >
            <TextArea
              rows={4}
              placeholder="Please describe the issue in detail..."
              maxLength={500}
              showCount
            />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" size="large" icon={<PlusOutlined />}>
                Submit Request
              </Button>
              <Button size="large" onClick={() => setIsRequestModalVisible(false)}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default StoreCreditPage;
