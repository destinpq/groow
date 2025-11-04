import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Button,
  InputNumber,
  Form,
  Input,
  Select,
  Table,
  Tag,
  Space,
  Divider,
  Alert,
  Image,
  message,
  Modal,
  Radio,
} from 'antd';
import {
  GiftOutlined,
  CreditCardOutlined,
  MailOutlined,
  PhoneOutlined,
  DollarOutlined,
  CheckCircleOutlined,
  CopyOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;

interface GiftCard {
  id: number;
  code: string;
  balance: number;
  originalAmount: number;
  status: 'active' | 'redeemed' | 'expired';
  purchaseDate: string;
  expiryDate: string;
  recipientEmail?: string;
}

const mockGiftCards: GiftCard[] = [
  {
    id: 1,
    code: 'GIFT-XXXX-XXXX-1234',
    balance: 45.50,
    originalAmount: 50.00,
    status: 'active',
    purchaseDate: '2024-10-15',
    expiryDate: '2025-10-15',
  },
  {
    id: 2,
    code: 'GIFT-XXXX-XXXX-5678',
    balance: 0,
    originalAmount: 25.00,
    status: 'redeemed',
    purchaseDate: '2024-09-01',
    expiryDate: '2025-09-01',
    recipientEmail: 'friend@example.com',
  },
];

const presetAmounts = [25, 50, 100, 150, 200];

const GiftCardsPage: React.FC = () => {
  const [giftCards, setGiftCards] = useState<GiftCard[]>(mockGiftCards);
  const [isPurchaseModalVisible, setIsPurchaseModalVisible] = useState(false);
  const [isRedeemModalVisible, setIsRedeemModalVisible] = useState(false);
  const [customAmount, setCustomAmount] = useState<number>(50);
  const [selectedAmount, setSelectedAmount] = useState<number>(50);
  const [deliveryMethod, setDeliveryMethod] = useState<'email' | 'print'>('email');
  const [form] = Form.useForm();
  const [redeemForm] = Form.useForm();

  const handlePurchase = (values: any) => {
    const newGiftCard: GiftCard = {
      id: Date.now(),
      code: `GIFT-${Math.random().toString(36).substr(2, 4).toUpperCase()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
      balance: selectedAmount,
      originalAmount: selectedAmount,
      status: 'active',
      purchaseDate: new Date().toISOString().split('T')[0],
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      recipientEmail: values.recipientEmail,
    };

    setGiftCards([newGiftCard, ...giftCards]);
    message.success(`Gift card purchased successfully! ${deliveryMethod === 'email' ? 'Email sent to recipient' : 'Ready to print'}`);
    setIsPurchaseModalVisible(false);
    form.resetFields();
    setSelectedAmount(50);
  };

  const handleRedeem = (values: any) => {
    // Simulate redemption
    message.success(`Gift card redeemed successfully! $${values.amount || 25} added to your account balance.`);
    setIsRedeemModalVisible(false);
    redeemForm.resetFields();
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    message.success('Gift card code copied to clipboard');
  };

  const getStatusTag = (status: string) => {
    const config = {
      active: { color: 'green', text: 'Active' },
      redeemed: { color: 'default', text: 'Fully Used' },
      expired: { color: 'red', text: 'Expired' },
    };
    const { color, text } = config[status as keyof typeof config];
    return <Tag color={color}>{text}</Tag>;
  };

  const columns: ColumnsType<GiftCard> = [
    {
      title: 'Gift Card Code',
      dataIndex: 'code',
      key: 'code',
      render: (code) => (
        <Space>
          <CreditCardOutlined style={{ fontSize: 18, color: '#ff9900' }} />
          <Text code>{code}</Text>
          <Button
            type="link"
            size="small"
            icon={<CopyOutlined />}
            onClick={() => copyToClipboard(code)}
          />
        </Space>
      ),
    },
    {
      title: 'Balance',
      dataIndex: 'balance',
      key: 'balance',
      render: (balance, record) => (
        <div>
          <Text strong style={{ fontSize: 16, color: balance > 0 ? '#52c41a' : '#8c8c8c' }}>
            ${balance.toFixed(2)}
          </Text>
          <br />
          <Text type="secondary" style={{ fontSize: 12 }}>
            of ${record.originalAmount.toFixed(2)}
          </Text>
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => getStatusTag(status),
    },
    {
      title: 'Purchase Date',
      dataIndex: 'purchaseDate',
      key: 'purchaseDate',
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Expires',
      dataIndex: 'expiryDate',
      key: 'expiryDate',
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Recipient',
      dataIndex: 'recipientEmail',
      key: 'recipientEmail',
      render: (email) => email ? <Text type="secondary">{email}</Text> : <Text type="secondary">Self</Text>,
    },
  ];

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={3}>
          <GiftOutlined style={{ color: '#ff9900' }} /> Gift Cards
        </Title>
        <Paragraph type="secondary">
          Purchase gift cards for friends and family, or redeem gift cards you've received
        </Paragraph>
      </div>

      {/* Action Buttons */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12}>
          <Card
            hoverable
            onClick={() => setIsPurchaseModalVisible(true)}
            style={{ textAlign: 'center', cursor: 'pointer' }}
          >
            <GiftOutlined style={{ fontSize: 48, color: '#ff9900', marginBottom: 16 }} />
            <Title level={4}>Purchase Gift Card</Title>
            <Paragraph type="secondary">
              Give the perfect gift - let them choose what they want
            </Paragraph>
            <Button type="primary" size="large">
              Buy Gift Card
            </Button>
          </Card>
        </Col>
        <Col xs={24} sm={12}>
          <Card
            hoverable
            onClick={() => setIsRedeemModalVisible(true)}
            style={{ textAlign: 'center', cursor: 'pointer' }}
          >
            <CheckCircleOutlined style={{ fontSize: 48, color: '#52c41a', marginBottom: 16 }} />
            <Title level={4}>Redeem Gift Card</Title>
            <Paragraph type="secondary">
              Have a gift card code? Apply it to your account balance
            </Paragraph>
            <Button type="primary" size="large" style={{ background: '#52c41a', borderColor: '#52c41a' }}>
              Redeem Now
            </Button>
          </Card>
        </Col>
      </Row>

      {/* My Gift Cards */}
      <Card title="My Gift Cards">
        <Table
          columns={columns}
          dataSource={giftCards}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>

      {/* Purchase Modal */}
      <Modal
        title={<><GiftOutlined /> Purchase Gift Card</>}
        open={isPurchaseModalVisible}
        onCancel={() => {
          setIsPurchaseModalVisible(false);
          form.resetFields();
          setSelectedAmount(50);
        }}
        footer={null}
        width={700}
      >
        <Form form={form} layout="vertical" onFinish={handlePurchase}>
          <Alert
            message="Perfect for any occasion!"
            description="Gift cards are valid for 1 year from the date of purchase and can be used on any product in our store."
            type="info"
            showIcon
            closable
            style={{ marginBottom: 24 }}
          />

          <div style={{ marginBottom: 24 }}>
            <Title level={5}>Select Amount</Title>
            <Row gutter={[12, 12]}>
              {presetAmounts.map((amount) => (
                <Col xs={12} sm={8} md={4} key={amount}>
                  <Card
                    hoverable
                    onClick={() => setSelectedAmount(amount)}
                    style={{
                      textAlign: 'center',
                      cursor: 'pointer',
                      border: selectedAmount === amount ? '2px solid #1890ff' : '1px solid #d9d9d9',
                      background: selectedAmount === amount ? '#e6f7ff' : 'white',
                    }}
                  >
                    <DollarOutlined style={{ fontSize: 24, marginBottom: 8 }} />
                    <div>
                      <Text strong style={{ fontSize: 20 }}>${amount}</Text>
                    </div>
                  </Card>
                </Col>
              ))}
              <Col xs={12} sm={8} md={4}>
                <Card
                  hoverable
                  onClick={() => {
                    setSelectedAmount(customAmount);
                  }}
                  style={{
                    textAlign: 'center',
                    cursor: 'pointer',
                    border: !presetAmounts.includes(selectedAmount) ? '2px solid #1890ff' : '1px solid #d9d9d9',
                    background: !presetAmounts.includes(selectedAmount) ? '#e6f7ff' : 'white',
                  }}
                >
                  <InputNumber
                    min={10}
                    max={500}
                    value={customAmount}
                    onChange={(value) => {
                      if (value) {
                        setCustomAmount(value);
                        setSelectedAmount(value);
                      }
                    }}
                    prefix="$"
                    style={{ width: '100%' }}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <Text type="secondary" style={{ fontSize: 11 }}>Custom</Text>
                </Card>
              </Col>
            </Row>
          </div>

          <Divider />

          <Form.Item label="Delivery Method">
            <Radio.Group value={deliveryMethod} onChange={(e) => setDeliveryMethod(e.target.value)}>
              <Space direction="vertical">
                <Radio value="email">
                  <MailOutlined /> Email to Recipient
                </Radio>
                <Radio value="print">
                  <CreditCardOutlined /> Print at Home
                </Radio>
              </Space>
            </Radio.Group>
          </Form.Item>

          {deliveryMethod === 'email' && (
            <>
              <Form.Item
                name="recipientName"
                label="Recipient Name"
                rules={[{ required: true, message: 'Please enter recipient name' }]}
              >
                <Input placeholder="John Doe" />
              </Form.Item>

              <Form.Item
                name="recipientEmail"
                label="Recipient Email"
                rules={[
                  { required: true, message: 'Please enter recipient email' },
                  { type: 'email', message: 'Please enter a valid email' },
                ]}
              >
                <Input placeholder="john@example.com" prefix={<MailOutlined />} />
              </Form.Item>

              <Form.Item name="message" label="Personal Message (Optional)">
                <TextArea
                  rows={3}
                  placeholder="Write a personal message to the recipient..."
                  maxLength={200}
                  showCount
                />
              </Form.Item>

              <Form.Item name="sendDate" label="Send Date">
                <Radio.Group defaultValue="now">
                  <Space direction="vertical">
                    <Radio value="now">Send Immediately</Radio>
                    <Radio value="later">Schedule for Later</Radio>
                  </Space>
                </Radio.Group>
              </Form.Item>
            </>
          )}

          <Divider />

          <div style={{ background: '#fafafa', padding: 16, borderRadius: 8, marginBottom: 16 }}>
            <Row justify="space-between" style={{ marginBottom: 8 }}>
              <Text>Gift Card Amount:</Text>
              <Text strong style={{ fontSize: 18 }}>${selectedAmount.toFixed(2)}</Text>
            </Row>
            <Row justify="space-between" style={{ marginBottom: 8 }}>
              <Text>Processing Fee:</Text>
              <Text>$0.00</Text>
            </Row>
            <Divider style={{ margin: '12px 0' }} />
            <Row justify="space-between">
              <Text strong style={{ fontSize: 16 }}>Total:</Text>
              <Text strong style={{ fontSize: 20, color: '#ff9900' }}>
                ${selectedAmount.toFixed(2)}
              </Text>
            </Row>
          </div>

          <Form.Item style={{ marginBottom: 0 }}>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button
                onClick={() => {
                  setIsPurchaseModalVisible(false);
                  form.resetFields();
                  setSelectedAmount(50);
                }}
              >
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" size="large">
                Purchase Gift Card - ${selectedAmount.toFixed(2)}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Redeem Modal */}
      <Modal
        title={<><CheckCircleOutlined /> Redeem Gift Card</>}
        open={isRedeemModalVisible}
        onCancel={() => {
          setIsRedeemModalVisible(false);
          redeemForm.resetFields();
        }}
        footer={null}
        width={500}
      >
        <Form form={redeemForm} layout="vertical" onFinish={handleRedeem}>
          <Alert
            message="Enter your gift card code"
            description="The gift card balance will be added to your account and can be used on your next purchase."
            type="success"
            showIcon
            style={{ marginBottom: 24 }}
          />

          <Form.Item
            name="code"
            label="Gift Card Code"
            rules={[{ required: true, message: 'Please enter gift card code' }]}
          >
            <Input
              placeholder="GIFT-XXXX-XXXX-XXXX"
              size="large"
              prefix={<CreditCardOutlined />}
              style={{ textTransform: 'uppercase' }}
            />
          </Form.Item>

          <Divider />

          <Form.Item style={{ marginBottom: 0 }}>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button
                onClick={() => {
                  setIsRedeemModalVisible(false);
                  redeemForm.resetFields();
                }}
              >
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" size="large">
                Redeem Gift Card
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default GiftCardsPage;
