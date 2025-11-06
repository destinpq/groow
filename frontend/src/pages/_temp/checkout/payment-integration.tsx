import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Radio,
  Space,
  Button,
  Form,
  Input,
  Select,
  Divider,
  Alert,
  Switch,
  Tag,
  Statistic,
  message,
  Modal,
  List,
  Avatar,
} from 'antd';
import {
  CreditCardOutlined,
  BankOutlined,
  DollarOutlined,
  SafetyOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  WarningOutlined,
  PayCircleOutlined,
  WalletOutlined,
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal' | 'bank' | 'wallet' | 'cod';
  name: string;
  description: string;
  icon: React.ReactNode;
  enabled: boolean;
  processingFee: number;
  processingTime: string;
}

interface SavedCard {
  id: number;
  type: 'visa' | 'mastercard' | 'amex';
  last4: string;
  expiryMonth: number;
  expiryYear: number;
  isDefault: boolean;
  holderName: string;
}

const paymentMethods: PaymentMethod[] = [
  {
    id: 'stripe',
    type: 'card',
    name: 'Credit/Debit Card',
    description: 'Pay securely with Stripe. We accept Visa, Mastercard, and American Express.',
    icon: <CreditCardOutlined />,
    enabled: true,
    processingFee: 2.9,
    processingTime: 'Instant',
  },
  {
    id: 'paypal',
    type: 'paypal',
    name: 'PayPal',
    description: 'Pay with your PayPal account or PayPal Credit.',
    icon: <PayCircleOutlined />,
    enabled: true,
    processingFee: 3.49,
    processingTime: 'Instant',
  },
  {
    id: 'bank_transfer',
    type: 'bank',
    name: 'Bank Transfer',
    description: 'Direct bank transfer. Order will be processed after payment verification.',
    icon: <BankOutlined />,
    enabled: true,
    processingFee: 0,
    processingTime: '1-3 business days',
  },
  {
    id: 'wallet',
    type: 'wallet',
    name: 'Digital Wallet',
    description: 'Use your account balance for instant payment.',
    icon: <WalletOutlined />,
    enabled: true,
    processingFee: 0,
    processingTime: 'Instant',
  },
  {
    id: 'cod',
    type: 'cod',
    name: 'Cash on Delivery',
    description: 'Pay when your order is delivered. Additional fees may apply.',
    icon: <DollarOutlined />,
    enabled: true,
    processingFee: 5,
    processingTime: 'On delivery',
  },
];

const mockSavedCards: SavedCard[] = [
  {
    id: 1,
    type: 'visa',
    last4: '4242',
    expiryMonth: 12,
    expiryYear: 2025,
    isDefault: true,
    holderName: 'John Doe',
  },
  {
    id: 2,
    type: 'mastercard',
    last4: '5555',
    expiryMonth: 8,
    expiryYear: 2026,
    isDefault: false,
    holderName: 'John Doe',
  },
];

const PaymentIntegrationPage: React.FC = () => {
  const [selectedMethod, setSelectedMethod] = useState<string>('stripe');
  const [savedCards, setSavedCards] = useState<SavedCard[]>(mockSavedCards);
  const [selectedCard, setSelectedCard] = useState<number | null>(1);
  const [saveCard, setSaveCard] = useState(false);
  const [amount] = useState(299.99);
  const [form] = Form.useForm();

  const currentMethod = paymentMethods.find((m) => m.id === selectedMethod);
  const processingFee = currentMethod ? (amount * currentMethod.processingFee) / 100 : 0;
  const totalAmount = amount + processingFee;

  const handlePayment = () => {
    if (selectedMethod === 'stripe') {
      if (selectedCard) {
        // Use saved card
        message.success('Payment processed successfully with saved card!');
      } else {
        // New card
        form.validateFields().then((values) => {
          message.success('Payment processed successfully!');
          if (saveCard) {
            const newCard: SavedCard = {
              id: Date.now(),
              type: 'visa',
              last4: values.cardNumber.slice(-4),
              expiryMonth: parseInt(values.expiry.split('/')[0]),
              expiryYear: parseInt('20' + values.expiry.split('/')[1]),
              isDefault: savedCards.length === 0,
              holderName: values.cardHolder,
            };
            setSavedCards([...savedCards, newCard]);
          }
        });
      }
    } else if (selectedMethod === 'paypal') {
      // Simulate PayPal redirect
      message.info('Redirecting to PayPal...');
      setTimeout(() => {
        message.success('PayPal payment completed!');
      }, 2000);
    } else {
      message.success(`Payment initiated via ${currentMethod?.name}`);
    }
  };

  const handleSetDefaultCard = (id: number) => {
    setSavedCards((prev) =>
      prev.map((card) => ({ ...card, isDefault: card.id === id }))
    );
    message.success('Default payment method updated');
  };

  const handleDeleteCard = (id: number) => {
    Modal.confirm({
      title: 'Delete Card',
      content: 'Are you sure you want to remove this card?',
      okText: 'Delete',
      okType: 'danger',
      onOk: () => {
        setSavedCards((prev) => prev.filter((card) => card.id !== id));
        if (selectedCard === id) setSelectedCard(null);
        message.success('Card removed successfully');
      },
    });
  };

  const getCardIcon = (type: string) => {
    switch (type) {
      case 'visa':
        return '💳 Visa';
      case 'mastercard':
        return '💳 Mastercard';
      case 'amex':
        return '💳 Amex';
      default:
        return '💳';
    }
  };

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={3}>
          <CreditCardOutlined style={{ color: '#1890ff' }} /> Payment Integration
        </Title>
        <Paragraph type="secondary">
          Secure payment processing with multiple payment gateways
        </Paragraph>
      </div>

      <Alert
        message="Secure Payments"
        description="All transactions are encrypted and secure. We never store your full card details."
        type="info"
        showIcon
        icon={<SafetyOutlined />}
        style={{ marginBottom: 24 }}
      />

      <Row gutter={16}>
        {/* Payment Method Selection */}
        <Col xs={24} lg={16}>
          <Card title="Select Payment Method" style={{ marginBottom: 16 }}>
            <Radio.Group
              value={selectedMethod}
              onChange={(e) => setSelectedMethod(e.target.value)}
              style={{ width: '100%' }}
            >
              <Space direction="vertical" style={{ width: '100%' }} size="middle">
                {paymentMethods.map((method) => (
                  <Card
                    key={method.id}
                    size="small"
                    hoverable
                    style={{
                      border: selectedMethod === method.id ? '2px solid #1890ff' : '1px solid #d9d9d9',
                      background: selectedMethod === method.id ? '#e6f7ff' : 'white',
                    }}
                  >
                    <Radio value={method.id} style={{ width: '100%' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Space>
                          <div style={{ fontSize: 24, color: '#1890ff' }}>{method.icon}</div>
                          <div>
                            <Text strong>{method.name}</Text>
                            <div>
                              <Text type="secondary" style={{ fontSize: 12 }}>
                                {method.description}
                              </Text>
                            </div>
                          </div>
                        </Space>
                        <Space direction="vertical" align="end" size={0}>
                          <Tag color={method.enabled ? 'green' : 'red'}>
                            {method.enabled ? 'Available' : 'Unavailable'}
                          </Tag>
                          <Text type="secondary" style={{ fontSize: 11 }}>
                            Fee: {method.processingFee}%
                          </Text>
                        </Space>
                      </div>
                    </Radio>
                  </Card>
                ))}
              </Space>
            </Radio.Group>
          </Card>

          {/* Payment Details */}
          {selectedMethod === 'stripe' && (
            <Card title="Payment Details">
              {savedCards.length > 0 && (
                <>
                  <Text strong style={{ display: 'block', marginBottom: 12 }}>
                    Saved Cards
                  </Text>
                  <Radio.Group
                    value={selectedCard}
                    onChange={(e) => setSelectedCard(e.target.value)}
                    style={{ width: '100%', marginBottom: 16 }}
                  >
                    <Space direction="vertical" style={{ width: '100%' }}>
                      {savedCards.map((card) => (
                        <Card
                          key={card.id}
                          size="small"
                          style={{
                            border: selectedCard === card.id ? '2px solid #1890ff' : '1px solid #d9d9d9',
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Radio value={card.id}>
                              <Space>
                                <Text>{getCardIcon(card.type)}</Text>
                                <Text>•••• {card.last4}</Text>
                                <Text type="secondary">
                                  {card.expiryMonth}/{card.expiryYear}
                                </Text>
                                {card.isDefault && <Tag color="blue">Default</Tag>}
                              </Space>
                            </Radio>
                            <Space>
                              {!card.isDefault && (
                                <Button size="small" onClick={() => handleSetDefaultCard(card.id)}>
                                  Set Default
                                </Button>
                              )}
                              <Button size="small" danger onClick={() => handleDeleteCard(card.id)}>
                                Remove
                              </Button>
                            </Space>
                          </div>
                        </Card>
                      ))}
                      <Radio value={null}>
                        <Text type="secondary">Use a different card</Text>
                      </Radio>
                    </Space>
                  </Radio.Group>
                  <Divider />
                </>
              )}

              {selectedCard === null && (
                <Form form={form} layout="vertical">
                  <Form.Item
                    name="cardNumber"
                    label="Card Number"
                    rules={[
                      { required: true, message: 'Please enter card number' },
                      { pattern: /^\d{16}$/, message: 'Invalid card number' },
                    ]}
                  >
                    <Input
                      prefix={<CreditCardOutlined />}
                      placeholder="1234 5678 9012 3456"
                      maxLength={16}
                    />
                  </Form.Item>
                  <Form.Item
                    name="cardHolder"
                    label="Card Holder Name"
                    rules={[{ required: true, message: 'Please enter card holder name' }]}
                  >
                    <Input placeholder="John Doe" />
                  </Form.Item>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        name="expiry"
                        label="Expiry Date"
                        rules={[
                          { required: true, message: 'Required' },
                          { pattern: /^\d{2}\/\d{2}$/, message: 'MM/YY' },
                        ]}
                      >
                        <Input placeholder="MM/YY" maxLength={5} />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="cvv"
                        label="CVV"
                        rules={[
                          { required: true, message: 'Required' },
                          { pattern: /^\d{3,4}$/, message: 'Invalid CVV' },
                        ]}
                      >
                        <Input.Password placeholder="123" maxLength={4} />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Form.Item>
                    <Switch checked={saveCard} onChange={setSaveCard} />
                    <Text style={{ marginLeft: 8 }}>Save card for future payments</Text>
                  </Form.Item>
                </Form>
              )}
            </Card>
          )}

          {selectedMethod === 'paypal' && (
            <Card>
              <Space direction="vertical" align="center" style={{ width: '100%', padding: '40px 0' }}>
                <PayCircleOutlined style={{ fontSize: 64, color: '#0070ba' }} />
                <Title level={4}>PayPal Checkout</Title>
                <Paragraph type="secondary" style={{ textAlign: 'center' }}>
                  You'll be redirected to PayPal to complete your payment securely
                </Paragraph>
              </Space>
            </Card>
          )}

          {selectedMethod === 'bank_transfer' && (
            <Card>
              <Alert
                message="Bank Transfer Instructions"
                description={
                  <div style={{ marginTop: 12 }}>
                    <Text strong>Bank Name:</Text> Example Bank
                    <br />
                    <Text strong>Account Number:</Text> 1234567890
                    <br />
                    <Text strong>Routing Number:</Text> 987654321
                    <br />
                    <Text strong>Reference:</Text> Your Order ID
                    <br />
                    <br />
                    <Text type="secondary">
                      Please include your order ID in the transfer reference. Your order will be
                      processed once payment is verified.
                    </Text>
                  </div>
                }
                type="warning"
                showIcon
              />
            </Card>
          )}

          {selectedMethod === 'wallet' && (
            <Card>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Statistic
                  title="Available Balance"
                  value={1250.50}
                  prefix={<WalletOutlined />}
                  precision={2}
                  valueStyle={{ color: '#52c41a' }}
                />
                {amount > 1250.50 ? (
                  <Alert
                    message="Insufficient Balance"
                    description="You don't have enough balance. Please add funds to your wallet."
                    type="error"
                    showIcon
                  />
                ) : (
                  <Alert
                    message="Sufficient Balance"
                    description="You can complete this payment with your wallet balance."
                    type="success"
                    showIcon
                  />
                )}
              </Space>
            </Card>
          )}
        </Col>

        {/* Order Summary */}
        <Col xs={24} lg={8}>
          <Card title="Order Summary" style={{ marginBottom: 16 }}>
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text>Subtotal</Text>
                <Text strong>${amount.toFixed(2)}</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text>Processing Fee ({currentMethod?.processingFee}%)</Text>
                <Text>${processingFee.toFixed(2)}</Text>
              </div>
              <Divider style={{ margin: '8px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text strong style={{ fontSize: 18 }}>Total</Text>
                <Text strong style={{ fontSize: 18, color: '#1890ff' }}>
                  ${totalAmount.toFixed(2)}
                </Text>
              </div>
              <Button
                type="primary"
                size="large"
                block
                icon={<SafetyOutlined />}
                onClick={handlePayment}
              >
                Pay ${totalAmount.toFixed(2)}
              </Button>
              <Text type="secondary" style={{ fontSize: 11, textAlign: 'center', display: 'block' }}>
                <SafetyOutlined /> Secured by 256-bit SSL encryption
              </Text>
            </Space>
          </Card>

          <Card title="Processing Time">
            <Space direction="vertical" style={{ width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <ClockCircleOutlined style={{ color: '#1890ff' }} />
                <Text>{currentMethod?.processingTime}</Text>
              </div>
              <Divider style={{ margin: '12px 0' }} />
              <Text type="secondary" style={{ fontSize: 12 }}>
                Your order will be processed immediately after payment confirmation.
              </Text>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default PaymentIntegrationPage;
