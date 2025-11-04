import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Radio,
  Input,
  Button,
  Space,
  Form,
  message,
  Image,
  Tag,
  Divider,
  Alert,
  InputNumber,
  Checkbox,
} from 'antd';
import {
  GiftOutlined,
  PlusOutlined,
  CheckCircleOutlined,
  ShoppingCartOutlined,
  HeartOutlined,
  StarOutlined,
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

interface GiftWrap {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'paper' | 'box' | 'bag' | 'premium';
  occasion: string[];
  popular: boolean;
}

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

const mockGiftWraps: GiftWrap[] = [
  {
    id: 1,
    name: 'Classic Red & Gold',
    description: 'Traditional holiday wrapping with red paper and gold ribbon',
    price: 4.99,
    image: 'https://via.placeholder.com/300x200?text=Classic+Red+Gold',
    category: 'paper',
    occasion: ['Christmas', 'Holiday', 'Celebration'],
    popular: true,
  },
  {
    id: 2,
    name: 'Elegant Silver Box',
    description: 'Premium silver gift box with satin ribbon',
    price: 8.99,
    image: 'https://via.placeholder.com/300x200?text=Silver+Box',
    category: 'box',
    occasion: ['Wedding', 'Anniversary', 'Luxury'],
    popular: true,
  },
  {
    id: 3,
    name: 'Birthday Bash',
    description: 'Colorful birthday-themed wrapping with confetti design',
    price: 3.99,
    image: 'https://via.placeholder.com/300x200?text=Birthday+Bash',
    category: 'paper',
    occasion: ['Birthday', 'Party', 'Kids'],
    popular: false,
  },
  {
    id: 4,
    name: 'Rustic Kraft Bag',
    description: 'Eco-friendly kraft paper bag with twine tie',
    price: 5.99,
    image: 'https://via.placeholder.com/300x200?text=Rustic+Kraft',
    category: 'bag',
    occasion: ['Any', 'Eco-Friendly', 'Casual'],
    popular: false,
  },
  {
    id: 5,
    name: 'Premium Rose Gold',
    description: 'Luxurious rose gold box with velvet lining',
    price: 12.99,
    image: 'https://via.placeholder.com/300x200?text=Rose+Gold',
    category: 'premium',
    occasion: ['Engagement', 'Luxury', 'Special'],
    popular: true,
  },
  {
    id: 6,
    name: 'Baby Blue Box',
    description: 'Soft blue gift box perfect for baby showers',
    price: 6.99,
    image: 'https://via.placeholder.com/300x200?text=Baby+Blue',
    category: 'box',
    occasion: ['Baby Shower', 'Newborn', 'Kids'],
    popular: false,
  },
];

const mockCartItems: CartItem[] = [
  {
    id: 1,
    name: 'Wireless Headphones',
    price: 299.99,
    quantity: 1,
    image: 'https://via.placeholder.com/80x80?text=Headphones',
  },
  {
    id: 2,
    name: 'Smart Watch',
    price: 199.99,
    quantity: 1,
    image: 'https://via.placeholder.com/80x80?text=Watch',
  },
];

const GiftWrappingPage: React.FC = () => {
  const [selectedWrap, setSelectedWrap] = useState<number | null>(null);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [giftMessage, setGiftMessage] = useState<string>('');
  const [recipientName, setRecipientName] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [form] = Form.useForm();

  const handleAddToCart = () => {
    if (!selectedWrap) {
      message.warning('Please select a gift wrap');
      return;
    }

    if (selectedItems.length === 0) {
      message.warning('Please select at least one item to wrap');
      return;
    }

    const wrap = mockGiftWraps.find((w) => w.id === selectedWrap);
    const totalPrice = wrap!.price * selectedItems.length;

    message.success({
      content: `Added gift wrapping for ${selectedItems.length} item(s) - $${totalPrice.toFixed(
        2
      )}`,
      duration: 3,
    });
  };

  const filteredWraps =
    filterCategory === 'all'
      ? mockGiftWraps
      : mockGiftWraps.filter((wrap) => wrap.category === filterCategory);

  const selectedWrapData = mockGiftWraps.find((w) => w.id === selectedWrap);
  const totalPrice = selectedWrapData ? selectedWrapData.price * selectedItems.length : 0;

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={3}>
            <GiftOutlined style={{ color: '#1890ff' }} /> Gift Wrapping
          </Title>
          <Paragraph type="secondary">Make your gifts extra special with our wrapping service</Paragraph>
        </Col>
      </Row>

      <Alert
        message="Add a Personal Touch"
        description="Choose from our beautiful gift wrapping options and add a personalized message to make your gift memorable."
        type="info"
        showIcon
        icon={<GiftOutlined />}
        style={{ marginBottom: 24 }}
      />

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Card title="Select Items to Wrap" style={{ marginBottom: 24 }}>
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              {mockCartItems.map((item) => (
                <Card key={item.id} size="small">
                  <Row align="middle" gutter={16}>
                    <Col>
                      <Checkbox
                        checked={selectedItems.includes(item.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedItems([...selectedItems, item.id]);
                          } else {
                            setSelectedItems(selectedItems.filter((id) => id !== item.id));
                          }
                        }}
                      />
                    </Col>
                    <Col>
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={80}
                        height={80}
                        style={{ borderRadius: 8 }}
                      />
                    </Col>
                    <Col flex="auto">
                      <div>
                        <Text strong style={{ fontSize: 16 }}>
                          {item.name}
                        </Text>
                        <div>
                          <Text type="secondary">Quantity: {item.quantity}</Text>
                        </div>
                        <div>
                          <Text strong style={{ fontSize: 18, color: '#1890ff' }}>
                            ${item.price.toFixed(2)}
                          </Text>
                        </div>
                      </div>
                    </Col>
                    <Col>
                      {selectedItems.includes(item.id) && (
                        <Tag color="success" icon={<CheckCircleOutlined />}>
                          Selected
                        </Tag>
                      )}
                    </Col>
                  </Row>
                </Card>
              ))}
            </Space>

            {selectedItems.length > 0 && (
              <Alert
                message={`${selectedItems.length} item(s) selected for gift wrapping`}
                type="success"
                showIcon
                style={{ marginTop: 16 }}
              />
            )}
          </Card>

          <Card
            title="Choose Gift Wrap"
            extra={
              <Radio.Group value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
                <Radio.Button value="all">All</Radio.Button>
                <Radio.Button value="paper">Paper</Radio.Button>
                <Radio.Button value="box">Box</Radio.Button>
                <Radio.Button value="bag">Bag</Radio.Button>
                <Radio.Button value="premium">Premium</Radio.Button>
              </Radio.Group>
            }
          >
            <Row gutter={[16, 16]}>
              {filteredWraps.map((wrap) => (
                <Col xs={24} sm={12} lg={8} key={wrap.id}>
                  <Card
                    hoverable
                    onClick={() => setSelectedWrap(wrap.id)}
                    style={{
                      border:
                        selectedWrap === wrap.id ? '2px solid #1890ff' : '1px solid #d9d9d9',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ position: 'relative' }}>
                      <Image
                        src={wrap.image}
                        alt={wrap.name}
                        style={{ borderRadius: 8, marginBottom: 12 }}
                        preview={false}
                      />
                      {wrap.popular && (
                        <Tag
                          color="gold"
                          icon={<StarOutlined />}
                          style={{ position: 'absolute', top: 8, right: 8 }}
                        >
                          Popular
                        </Tag>
                      )}
                      {selectedWrap === wrap.id && (
                        <div
                          style={{
                            position: 'absolute',
                            top: 8,
                            left: 8,
                            background: '#52c41a',
                            borderRadius: '50%',
                            width: 32,
                            height: 32,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <CheckCircleOutlined style={{ color: '#fff', fontSize: 18 }} />
                        </div>
                      )}
                    </div>

                    <Title level={5} style={{ marginBottom: 8 }}>
                      {wrap.name}
                    </Title>
                    <Paragraph type="secondary" ellipsis={{ rows: 2 }} style={{ marginBottom: 12 }}>
                      {wrap.description}
                    </Paragraph>

                    <div style={{ marginBottom: 12 }}>
                      {wrap.occasion.slice(0, 2).map((occ) => (
                        <Tag key={occ} color="blue" style={{ marginBottom: 4 }}>
                          {occ}
                        </Tag>
                      ))}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text strong style={{ fontSize: 20, color: '#1890ff' }}>
                        ${wrap.price.toFixed(2)}
                      </Text>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        per item
                      </Text>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>

          <Card title="Gift Message (Optional)" style={{ marginTop: 24 }}>
            <Form form={form} layout="vertical">
              <Form.Item label="Recipient Name" name="recipientName">
                <Input
                  size="large"
                  placeholder="To: John Doe"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  prefix={<HeartOutlined />}
                />
              </Form.Item>

              <Form.Item
                label="Personal Message"
                name="message"
                help="Maximum 200 characters"
              >
                <TextArea
                  rows={4}
                  placeholder="Wishing you all the best on your special day!"
                  maxLength={200}
                  showCount
                  value={giftMessage}
                  onChange={(e) => setGiftMessage(e.target.value)}
                />
              </Form.Item>

              <Alert
                message="Message Preview"
                description={
                  <div style={{ marginTop: 12 }}>
                    {recipientName && (
                      <div>
                        <Text strong>To: {recipientName}</Text>
                      </div>
                    )}
                    {giftMessage && (
                      <div style={{ marginTop: 8 }}>
                        <Text italic>"{giftMessage}"</Text>
                      </div>
                    )}
                    {!recipientName && !giftMessage && (
                      <Text type="secondary">Your message will appear here</Text>
                    )}
                  </div>
                }
                type="info"
                showIcon={false}
              />
            </Form>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card
            title={
              <Space>
                <ShoppingCartOutlined />
                <span>Order Summary</span>
              </Space>
            }
            style={{ position: 'sticky', top: 24 }}
          >
            {selectedWrapData && (
              <div>
                <div
                  style={{
                    background: '#f0f0f0',
                    padding: 16,
                    borderRadius: 8,
                    marginBottom: 16,
                  }}
                >
                  <Image
                    src={selectedWrapData.image}
                    alt={selectedWrapData.name}
                    style={{ borderRadius: 8, marginBottom: 12 }}
                    preview={false}
                  />
                  <Title level={5}>{selectedWrapData.name}</Title>
                  <Text type="secondary">{selectedWrapData.description}</Text>
                </div>
              </div>
            )}

            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text>Gift Wrap Price:</Text>
                <Text strong>
                  {selectedWrapData ? `$${selectedWrapData.price.toFixed(2)}` : '$0.00'}
                </Text>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text>Number of Items:</Text>
                <Text strong>{selectedItems.length}</Text>
              </div>

              {giftMessage && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text>Gift Message:</Text>
                  <Tag color="green">Included Free</Tag>
                </div>
              )}

              <Divider style={{ margin: '12px 0' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Title level={5} style={{ margin: 0 }}>
                  Total:
                </Title>
                <Title level={4} style={{ margin: 0, color: '#1890ff' }}>
                  ${totalPrice.toFixed(2)}
                </Title>
              </div>

              <Button
                type="primary"
                size="large"
                icon={<PlusOutlined />}
                onClick={handleAddToCart}
                block
                disabled={!selectedWrap || selectedItems.length === 0}
              >
                Add to Cart
              </Button>

              <Alert
                message="Free gift message card with every order"
                type="success"
                showIcon
                icon={<GiftOutlined />}
              />
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default GiftWrappingPage;
