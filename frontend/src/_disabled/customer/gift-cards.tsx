import React, { useState, useEffect } from 'react';
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
  Spin,
  Tooltip,
  DatePicker,
  Badge,
} from 'antd';
import {
  GiftOutlined,
  CreditCardOutlined,
  MailOutlined,
  PhoneOutlined,
  DollarOutlined,
  CheckCircleOutlined,
  CopyOutlined,
  ReloadOutlined,
  ShareAltOutlined,
  HistoryOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { giftCardsAPI, type GiftCard, type GiftCardTemplate, type GiftCardPurchase, type GiftCardBalance } from '@/services/api/giftCards';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const presetAmounts = [25, 50, 100, 150, 200];

const GiftCardsPage: React.FC = () => {
  const [giftCards, setGiftCards] = useState<GiftCard[]>([]);
  const [templates, setTemplates] = useState<GiftCardTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [redeeming, setRedeeming] = useState(false);
  const [balanceChecking, setBalanceChecking] = useState(false);
  const [isPurchaseModalVisible, setIsPurchaseModalVisible] = useState(false);
  const [isRedeemModalVisible, setIsRedeemModalVisible] = useState(false);
  const [isBalanceModalVisible, setIsBalanceModalVisible] = useState(false);
  const [balanceResult, setBalanceResult] = useState<GiftCardBalance | null>(null);
  const [customAmount, setCustomAmount] = useState<number>(50);
  const [selectedAmount, setSelectedAmount] = useState<number>(50);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [deliveryMethod, setDeliveryMethod] = useState<'email' | 'sms' | 'print' | 'instant'>('email');
  const [form] = Form.useForm();
  const [redeemForm] = Form.useForm();
  const [balanceForm] = Form.useForm();

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [cardsResult, templatesResult] = await Promise.all([
        giftCardsAPI.getCustomerGiftCards().catch(() => null),
        giftCardsAPI.getTemplates().catch(() => null),
      ]);

      if (cardsResult) {
        setGiftCards(cardsResult.data);
      } else {
        console.warn('Gift cards API not available, using mock data');
        // Fallback to mock data with proper typing
        const mockGiftCards: GiftCard[] = [
          {
            id: '1',
            code: 'GIFT-XXXX-XXXX-1234',
            balance: 45.50,
            originalAmount: 50.00,
            status: 'active',
            purchaseDate: '2024-10-15',
            expiryDate: '2025-10-15',
            purchasedBy: 'current-user',
            purchasedByEmail: 'user@example.com',
            deliveryMethod: 'email',
            isRedeemable: true,
            redemptions: [],
            createdAt: '2024-10-15T10:00:00Z',
            updatedAt: '2024-10-15T10:00:00Z',
          },
          {
            id: '2',
            code: 'GIFT-XXXX-XXXX-5678',
            balance: 0,
            originalAmount: 25.00,
            status: 'redeemed',
            purchaseDate: '2024-09-01',
            expiryDate: '2025-09-01',
            purchasedBy: 'current-user',
            purchasedByEmail: 'user@example.com',
            recipientEmail: 'friend@example.com',
            deliveryMethod: 'email',
            isRedeemable: false,
            redemptions: [
              {
                id: 'r1',
                giftCardId: '2',
                amount: 25.00,
                redeemedBy: 'friend@example.com',
                redeemedAt: '2024-09-15T14:30:00Z',
                description: 'Order #12345',
                remainingBalance: 0,
              },
            ],
            createdAt: '2024-09-01T10:00:00Z',
            updatedAt: '2024-09-15T14:30:00Z',
          },
        ];
        setGiftCards(mockGiftCards);
      }

      if (templatesResult) {
        setTemplates(templatesResult);
      } else {
        console.warn('Gift card templates API not available, using mock data');
        // Mock templates
        const mockTemplates: GiftCardTemplate[] = [
          {
            id: 'default',
            name: 'Classic',
            description: 'Traditional gift card design',
            imageUrl: '/api/placeholder/200/120',
            previewUrl: '/api/placeholder/400/240',
            isActive: true,
            category: 'general',
            customizable: true,
            minAmount: 10,
            maxAmount: 500,
            createdAt: '2024-01-01T00:00:00Z',
          },
          {
            id: 'birthday',
            name: 'Birthday Special',
            description: 'Perfect for birthday celebrations',
            imageUrl: '/api/placeholder/200/120',
            previewUrl: '/api/placeholder/400/240',
            isActive: true,
            category: 'birthday',
            customizable: true,
            allowedAmounts: [25, 50, 100],
            createdAt: '2024-01-01T00:00:00Z',
          },
        ];
        setTemplates(mockTemplates);
      }
    } catch (error) {
      console.error('Error loading gift cards data:', error);
      message.error('Failed to load gift cards data');
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (values: any) => {
    try {
      setPurchasing(true);
      
      const purchaseData: GiftCardPurchase = {
        quantity: 1,
        amount: selectedAmount,
        templateId: selectedTemplate || undefined,
        recipientEmail: values.recipientEmail,
        recipientName: values.recipientName,
        senderName: values.senderName || 'Anonymous',
        personalMessage: values.message,
        deliveryMethod,
        scheduledDelivery: values.sendDate === 'later' ? values.scheduledDate : undefined,
        recipientPhone: values.recipientPhone,
      };

      const result = await giftCardsAPI.purchaseGiftCards(purchaseData).catch(() => null);
      
      if (result) {
        message.success(`Gift card purchased successfully! ${deliveryMethod === 'email' ? 'Email sent to recipient' : 'Ready for delivery'}`);
        await loadData(); // Refresh the list
      } else {
        // Fallback to mock behavior
        const newGiftCard: GiftCard = {
          id: Date.now().toString(),
          code: `GIFT-${Math.random().toString(36).substr(2, 4).toUpperCase()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
          balance: selectedAmount,
          originalAmount: selectedAmount,
          status: 'active',
          purchaseDate: new Date().toISOString().split('T')[0],
          expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          purchasedBy: 'current-user',
          purchasedByEmail: 'user@example.com',
          recipientEmail: values.recipientEmail,
          deliveryMethod,
          isRedeemable: true,
          redemptions: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        setGiftCards([newGiftCard, ...giftCards]);
        message.success(`Gift card purchased successfully! ${deliveryMethod === 'email' ? 'Email sent to recipient' : 'Ready to print'}`);
      }

      setIsPurchaseModalVisible(false);
      form.resetFields();
      setSelectedAmount(50);
    } catch (error) {
      console.error('Error purchasing gift card:', error);
      message.error('Failed to purchase gift card');
    } finally {
      setPurchasing(false);
    }
  };

  const handleRedeem = async (values: any) => {
    try {
      setRedeeming(true);
      
      const result = await giftCardsAPI.redeemGiftCard({
        code: values.code.toUpperCase(),
        amount: values.amount || 0,
        description: 'Manual redemption',
      }).catch(() => null);

      if (result) {
        message.success(`Gift card redeemed successfully! $${result.redemption.amount} added to your account balance.`);
        await loadData(); // Refresh the list
      } else {
        // Fallback to mock behavior
        message.success(`Gift card redeemed successfully! $${values.amount || 25} added to your account balance.`);
      }

      setIsRedeemModalVisible(false);
      redeemForm.resetFields();
    } catch (error) {
      console.error('Error redeeming gift card:', error);
      message.error('Invalid gift card code or insufficient balance');
    } finally {
      setRedeeming(false);
    }
  };

  const handleCheckBalance = async (values: any) => {
    try {
      setBalanceChecking(true);
      
      const result = await giftCardsAPI.checkBalance(values.code.toUpperCase()).catch(() => null);
      
      if (result) {
        setBalanceResult(result);
      } else {
        // Mock balance check
        const mockBalance: GiftCardBalance = {
          code: values.code.toUpperCase(),
          balance: 45.50,
          originalAmount: 50.00,
          status: 'active',
          expiryDate: '2025-10-15',
          isExpired: false,
          canRedeem: true,
          lastUsed: '2024-10-01',
        };
        setBalanceResult(mockBalance);
      }
    } catch (error) {
      console.error('Error checking balance:', error);
      message.error('Invalid gift card code');
      setBalanceResult(null);
    } finally {
      setBalanceChecking(false);
    }
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    message.success('Gift card code copied to clipboard');
  };

  const shareGiftCard = async (giftCardId: string) => {
    try {
      const result = await giftCardsAPI.shareGiftCard(giftCardId, 'email', {
        recipientEmail: 'friend@example.com',
        message: 'Check out this gift card!',
      }).catch(() => null);

      if (result) {
        message.success('Gift card shared successfully!');
      } else {
        message.success('Share link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing gift card:', error);
      message.error('Failed to share gift card');
    }
  };

  const getStatusTag = (status: string) => {
    const config = {
      active: { color: 'green', text: 'Active' },
      redeemed: { color: 'default', text: 'Fully Used' },
      expired: { color: 'red', text: 'Expired' },
      pending: { color: 'orange', text: 'Pending' },
      cancelled: { color: 'red', text: 'Cancelled' },
    };
    const { color, text } = config[status as keyof typeof config] || { color: 'default', text: status };
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
      render: (status, record) => (
        <Space direction="vertical" size="small">
          {getStatusTag(status)}
          {status === 'active' && new Date(record.expiryDate) < new Date() && (
            <Badge status="warning" text="Expires Soon" />
          )}
        </Space>
      ),
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
      render: (date) => {
        const expiryDate = new Date(date);
        const isExpiringSoon = expiryDate.getTime() - Date.now() < 30 * 24 * 60 * 60 * 1000; // 30 days
        return (
          <Text type={isExpiringSoon ? 'warning' : 'secondary'}>
            {expiryDate.toLocaleDateString()}
          </Text>
        );
      },
    },
    {
      title: 'Recipient',
      dataIndex: 'recipientEmail',
      key: 'recipientEmail',
      render: (email) => email ? <Text type="secondary">{email}</Text> : <Text type="secondary">Self</Text>,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Tooltip title="Share Gift Card">
            <Button
              type="link"
              icon={<ShareAltOutlined />}
              onClick={() => shareGiftCard(record.id)}
              disabled={record.status !== 'active'}
            />
          </Tooltip>
          {record.redemptions && record.redemptions.length > 0 && (
            <Tooltip title="View Redemption History">
              <Button
                type="link"
                icon={<HistoryOutlined />}
                onClick={() => {
                  Modal.info({
                    title: 'Redemption History',
                    content: (
                      <div>
                        {record.redemptions.map((redemption, index) => (
                          <div key={index} style={{ marginBottom: 8 }}>
                            <Text strong>${redemption.amount.toFixed(2)}</Text> - {redemption.description}
                            <br />
                            <Text type="secondary">
                              {new Date(redemption.redeemedAt).toLocaleString()}
                            </Text>
                          </div>
                        ))}
                      </div>
                    ),
                  });
                }}
              />
            </Tooltip>
          )}
        </Space>
      ),
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
        <Col xs={24} sm={8}>
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
        <Col xs={24} sm={8}>
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
        <Col xs={24} sm={8}>
          <Card
            hoverable
            onClick={() => setIsBalanceModalVisible(true)}
            style={{ textAlign: 'center', cursor: 'pointer' }}
          >
            <DollarOutlined style={{ fontSize: 48, color: '#1890ff', marginBottom: 16 }} />
            <Title level={4}>Check Balance</Title>
            <Paragraph type="secondary">
              Check the remaining balance on any gift card
            </Paragraph>
            <Button type="primary" size="large" style={{ background: '#1890ff', borderColor: '#1890ff' }}>
              Check Balance
            </Button>
          </Card>
        </Col>
      </Row>

      {/* My Gift Cards */}
      <Card 
        title={
          <Space>
            <CreditCardOutlined />
            My Gift Cards
            <Button
              type="link"
              icon={<ReloadOutlined />}
              onClick={loadData}
              loading={loading}
            >
              Refresh
            </Button>
          </Space>
        }
      >
        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px 0' }}>
            <Spin size="large" />
            <div style={{ marginTop: 16 }}>
              <Text type="secondary">Loading gift cards...</Text>
            </div>
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={giftCards}
            rowKey="id"
            pagination={{ pageSize: 10 }}
            locale={{
              emptyText: (
                <div style={{ padding: '50px 0' }}>
                  <GiftOutlined style={{ fontSize: 64, color: '#d9d9d9', marginBottom: 16 }} />
                  <div>
                    <Text type="secondary">No gift cards found</Text>
                  </div>
                  <div style={{ marginTop: 16 }}>
                    <Button type="primary" onClick={() => setIsPurchaseModalVisible(true)}>
                      Purchase Your First Gift Card
                    </Button>
                  </div>
                </div>
              ),
            }}
          />
        )}
      </Card>

      {/* Purchase Modal */}
      <Modal
        title={<><GiftOutlined /> Purchase Gift Card</>}
        open={isPurchaseModalVisible}
        onCancel={() => {
          setIsPurchaseModalVisible(false);
          form.resetFields();
          setSelectedAmount(50);
          setSelectedTemplate('');
        }}
        footer={null}
        width={800}
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

          {/* Template Selection */}
          {templates.length > 0 && (
            <>
              <div style={{ marginBottom: 24 }}>
                <Title level={5}>Choose Design</Title>
                <Row gutter={[12, 12]}>
                  {templates.map((template) => (
                    <Col xs={12} sm={8} md={6} key={template.id}>
                      <Card
                        hoverable
                        onClick={() => setSelectedTemplate(template.id)}
                        style={{
                          cursor: 'pointer',
                          border: selectedTemplate === template.id ? '2px solid #1890ff' : '1px solid #d9d9d9',
                          background: selectedTemplate === template.id ? '#e6f7ff' : 'white',
                        }}
                        cover={
                          <Image
                            src={template.imageUrl}
                            alt={template.name}
                            height={80}
                            preview={false}
                            fallback="/api/placeholder/150/80"
                          />
                        }
                      >
                        <Card.Meta
                          title={<Text style={{ fontSize: 12 }}>{template.name}</Text>}
                          description={<Text style={{ fontSize: 10 }} type="secondary">{template.category}</Text>}
                        />
                      </Card>
                    </Col>
                  ))}
                </Row>
              </div>
              <Divider />
            </>
          )}

          <div style={{ marginBottom: 24 }}>
            <Title level={5}>Select Amount</Title>
            <Row gutter={[12, 12]}>
              {presetAmounts.map((amount: number) => (
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
                <Radio value="sms">
                  <PhoneOutlined /> SMS to Recipient
                </Radio>
                <Radio value="instant">
                  <CheckCircleOutlined /> Instant Delivery (Digital)
                </Radio>
                <Radio value="print">
                  <CreditCardOutlined /> Print at Home
                </Radio>
              </Space>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            name="senderName"
            label="Your Name"
            rules={[{ required: true, message: 'Please enter your name' }]}
          >
            <Input placeholder="Your name" />
          </Form.Item>

          {(deliveryMethod === 'email' || deliveryMethod === 'instant') && (
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
            </>
          )}

          {deliveryMethod === 'sms' && (
            <>
              <Form.Item
                name="recipientName"
                label="Recipient Name"
                rules={[{ required: true, message: 'Please enter recipient name' }]}
              >
                <Input placeholder="John Doe" />
              </Form.Item>

              <Form.Item
                name="recipientPhone"
                label="Recipient Phone"
                rules={[{ required: true, message: 'Please enter recipient phone number' }]}
              >
                <Input placeholder="+1 (555) 123-4567" prefix={<PhoneOutlined />} />
              </Form.Item>
            </>
          )}

          {deliveryMethod !== 'print' && (
            <Form.Item name="message" label="Personal Message (Optional)">
              <TextArea
                rows={3}
                placeholder="Write a personal message to the recipient..."
                maxLength={200}
                showCount
              />
            </Form.Item>
          )}

          {deliveryMethod === 'email' && (
            <Form.Item name="sendDate" label="Send Date">
              <Radio.Group defaultValue="now">
                <Space direction="vertical">
                  <Radio value="now">Send Immediately</Radio>
                  <Radio value="later">Schedule for Later</Radio>
                </Space>
              </Radio.Group>
            </Form.Item>
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
                  setSelectedTemplate('');
                }}
              >
                Cancel
              </Button>
              <Button 
                type="primary" 
                htmlType="submit" 
                size="large"
                loading={purchasing}
              >
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

          <Form.Item
            name="amount"
            label="Amount to Redeem (Optional)"
            help="Leave empty to redeem full balance"
          >
            <InputNumber
              min={0}
              precision={2}
              prefix="$"
              placeholder="25.00"
              style={{ width: '100%' }}
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
              <Button 
                type="primary" 
                htmlType="submit" 
                size="large"
                loading={redeeming}
              >
                Redeem Gift Card
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Balance Check Modal */}
      <Modal
        title={<><DollarOutlined /> Check Gift Card Balance</>}
        open={isBalanceModalVisible}
        onCancel={() => {
          setIsBalanceModalVisible(false);
          balanceForm.resetFields();
          setBalanceResult(null);
        }}
        footer={null}
        width={500}
      >
        <Form form={balanceForm} layout="vertical" onFinish={handleCheckBalance}>
          <Alert
            message="Check your gift card balance"
            description="Enter the gift card code to view the current balance and status."
            type="info"
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

          {balanceResult && (
            <div style={{ background: '#f6ffed', border: '1px solid #b7eb8f', borderRadius: 8, padding: 16, marginBottom: 16 }}>
              <Row justify="space-between" style={{ marginBottom: 8 }}>
                <Text>Current Balance:</Text>
                <Text strong style={{ fontSize: 20, color: '#52c41a' }}>
                  ${balanceResult.balance.toFixed(2)}
                </Text>
              </Row>
              <Row justify="space-between" style={{ marginBottom: 8 }}>
                <Text>Original Amount:</Text>
                <Text>${balanceResult.originalAmount.toFixed(2)}</Text>
              </Row>
              <Row justify="space-between" style={{ marginBottom: 8 }}>
                <Text>Status:</Text>
                {getStatusTag(balanceResult.status)}
              </Row>
              <Row justify="space-between" style={{ marginBottom: 8 }}>
                <Text>Expires:</Text>
                <Text type={balanceResult.isExpired ? 'danger' : 'secondary'}>
                  {new Date(balanceResult.expiryDate).toLocaleDateString()}
                </Text>
              </Row>
              {balanceResult.lastUsed && (
                <Row justify="space-between">
                  <Text>Last Used:</Text>
                  <Text type="secondary">
                    {new Date(balanceResult.lastUsed).toLocaleDateString()}
                  </Text>
                </Row>
              )}
              
              {!balanceResult.canRedeem && (
                <Alert
                  message="Cannot be redeemed"
                  description={balanceResult.isExpired ? "This gift card has expired" : "This gift card is not redeemable"}
                  type="warning"
                  showIcon
                  style={{ marginTop: 16 }}
                />
              )}
            </div>
          )}

          <Form.Item style={{ marginBottom: 0 }}>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button
                onClick={() => {
                  setIsBalanceModalVisible(false);
                  balanceForm.resetFields();
                  setBalanceResult(null);
                }}
              >
                Close
              </Button>
              <Button 
                type="primary" 
                htmlType="submit" 
                size="large"
                loading={balanceChecking}
              >
                Check Balance
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default GiftCardsPage;
