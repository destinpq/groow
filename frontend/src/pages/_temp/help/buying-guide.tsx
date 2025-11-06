import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Collapse,
  Space,
  Divider,
  Anchor,
  Timeline,
  Tag,
  Button,
  Input,
} from 'antd';
import {
  QuestionCircleOutlined,
  ShoppingCartOutlined,
  TruckOutlined,
  SafetyOutlined,
  DollarOutlined,
  GiftOutlined,
  StarOutlined,
  SearchOutlined,
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { Panel } = Collapse;
const { Search } = Input;

interface BuyingTip {
  category: string;
  tips: {
    title: string;
    content: string;
  }[];
}

const buyingGuideData: BuyingTip[] = [
  {
    category: 'Before You Buy',
    tips: [
      {
        title: 'Research the Product',
        content: 'Read product descriptions carefully, check specifications, and compare similar products. Look for customer reviews and ratings to understand real-world performance.',
      },
      {
        title: 'Check Seller Ratings',
        content: 'Always verify the seller\'s rating and review history. Look for verified sellers with high ratings and positive customer feedback.',
      },
      {
        title: 'Compare Prices',
        content: 'Use our comparison tool to check prices across different sellers. Watch out for seasonal sales and promotions to get the best deals.',
      },
      {
        title: 'Verify Authenticity',
        content: 'Ensure the product is genuine by checking for authentication badges, warranty information, and seller verification status.',
      },
    ],
  },
  {
    category: 'Product Selection',
    tips: [
      {
        title: 'Read Specifications',
        content: 'Carefully review all technical specifications to ensure the product meets your requirements. Pay attention to dimensions, compatibility, and technical requirements.',
      },
      {
        title: 'Check Images',
        content: 'Review all product images from different angles. Zoom in to check details and look for products with customer-uploaded photos.',
      },
      {
        title: 'Watch Videos',
        content: 'If available, watch product videos to see the item in action. Customer review videos often provide valuable insights.',
      },
      {
        title: 'Ask Questions',
        content: 'Use the Q&A section to ask sellers or other customers about specific features or concerns you may have.',
      },
    ],
  },
  {
    category: 'Pricing & Deals',
    tips: [
      {
        title: 'Look for Discounts',
        content: 'Check for ongoing promotions, coupon codes, and bundle deals. Subscribe to price drop alerts for items on your wishlist.',
      },
      {
        title: 'Understand Pricing',
        content: 'Factor in all costs including shipping, taxes, and any additional fees. Compare the total cost, not just the base price.',
      },
      {
        title: 'Seasonal Sales',
        content: 'Major sales events like Black Friday, Cyber Monday, and seasonal clearances offer significant savings. Plan big purchases around these events.',
      },
      {
        title: 'Price Match',
        content: 'Some sellers offer price matching. Contact customer service if you find a lower price elsewhere.',
      },
    ],
  },
  {
    category: 'Shipping & Delivery',
    tips: [
      {
        title: 'Delivery Timeline',
        content: 'Check estimated delivery dates before purchasing. Consider expedited shipping for urgent needs.',
      },
      {
        title: 'Shipping Costs',
        content: 'Look for free shipping offers or Prime-eligible items. Sometimes buying multiple items can qualify you for free shipping.',
      },
      {
        title: 'Track Your Order',
        content: 'Use order tracking to monitor your package. Download our mobile app for real-time delivery notifications.',
      },
      {
        title: 'Delivery Instructions',
        content: 'Provide clear delivery instructions during checkout. Consider adding special instructions for safe delivery.',
      },
    ],
  },
  {
    category: 'Returns & Refunds',
    tips: [
      {
        title: 'Return Policy',
        content: 'Understand the seller\'s return policy before purchasing. Note the return window and any restocking fees that may apply.',
      },
      {
        title: 'Keep Packaging',
        content: 'Save original packaging and all accessories for at least 30 days in case you need to return the item.',
      },
      {
        title: 'Warranty Information',
        content: 'Register products for warranty coverage when applicable. Keep warranty documentation and receipts safe.',
      },
      {
        title: 'Refund Process',
        content: 'Familiarize yourself with the refund process and timeline. Refunds typically process within 5-7 business days after return receipt.',
      },
    ],
  },
  {
    category: 'Payment Security',
    tips: [
      {
        title: 'Secure Payment',
        content: 'Always use secure payment methods. Our platform encrypts all payment information for your protection.',
      },
      {
        title: 'Avoid Suspicious Deals',
        content: 'Be cautious of deals that seem too good to be true. Verify seller authenticity before making high-value purchases.',
      },
      {
        title: 'Save Payment Methods',
        content: 'Securely save payment methods for faster checkout, but never share your account credentials.',
      },
      {
        title: 'Check Your Statements',
        content: 'Regularly review your payment statements. Report any unauthorized charges immediately.',
      },
    ],
  },
];

const BuyingGuidePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedKeys, setExpandedKeys] = useState<string[]>(['0']);

  const filteredGuide = buyingGuideData
    .map(category => ({
      ...category,
      tips: category.tips.filter(
        tip =>
          tip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tip.content.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter(category => category.tips.length > 0);

  return (
    <div style={{ padding: 24, background: '#f0f2f5' }}>
      <Row gutter={24}>
        {/* Table of Contents */}
        <Col xs={24} lg={6}>
          <Card title="Quick Navigation" style={{ position: 'sticky', top: 24 }}>
            <Anchor
              items={buyingGuideData.map((category, idx) => ({
                key: idx.toString(),
                href: `#section-${idx}`,
                title: category.category,
              }))}
            />
            
            <Divider />
            
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              <div>
                <Text type="secondary" style={{ fontSize: 12 }}>NEED HELP?</Text>
                <div style={{ marginTop: 8 }}>
                  <Button type="primary" block icon={<QuestionCircleOutlined />}>
                    Contact Support
                  </Button>
                </div>
              </div>
            </Space>
          </Card>
        </Col>

        {/* Main Content */}
        <Col xs={24} lg={18}>
          <Card>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <div>
                <Title level={2}>
                  <ShoppingCartOutlined /> Complete Buying Guide
                </Title>
                <Paragraph type="secondary" style={{ fontSize: 16 }}>
                  Everything you need to know about shopping on our platform. Follow these guidelines for a safe and satisfying shopping experience.
                </Paragraph>
              </div>

              {/* Search */}
              <Search
                placeholder="Search buying tips..."
                allowClear
                size="large"
                prefix={<SearchOutlined />}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ marginBottom: 24 }}
              />

              {/* Quick Tips Banner */}
              <Card style={{ background: '#e6f7ff', border: '1px solid #91d5ff' }}>
                <Row gutter={16}>
                  <Col span={8}>
                    <Space>
                      <StarOutlined style={{ fontSize: 24, color: '#1890ff' }} />
                      <div>
                        <Text strong>Read Reviews</Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          Check customer feedback
                        </Text>
                      </div>
                    </Space>
                  </Col>
                  <Col span={8}>
                    <Space>
                      <DollarOutlined style={{ fontSize: 24, color: '#52c41a' }} />
                      <div>
                        <Text strong>Compare Prices</Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          Get the best deals
                        </Text>
                      </div>
                    </Space>
                  </Col>
                  <Col span={8}>
                    <Space>
                      <SafetyOutlined style={{ fontSize: 24, color: '#faad14' }} />
                      <div>
                        <Text strong>Secure Payment</Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          Shop with confidence
                        </Text>
                      </div>
                    </Space>
                  </Col>
                </Row>
              </Card>

              <Divider />

              {/* Buying Guide Sections */}
              {filteredGuide.map((category, idx) => (
                <div key={idx} id={`section-${idx}`}>
                  <Title level={4}>{category.category}</Title>
                  <Collapse
                    activeKey={expandedKeys}
                    onChange={(keys) => setExpandedKeys(keys as string[])}
                    style={{ marginBottom: 24 }}
                  >
                    {category.tips.map((tip, tipIdx) => (
                      <Panel
                        header={<Text strong>{tip.title}</Text>}
                        key={`${idx}-${tipIdx}`}
                      >
                        <Paragraph>{tip.content}</Paragraph>
                      </Panel>
                    ))}
                  </Collapse>
                </div>
              ))}

              {filteredGuide.length === 0 && (
                <Card>
                  <Space direction="vertical" style={{ width: '100%', textAlign: 'center' }}>
                    <QuestionCircleOutlined style={{ fontSize: 48, color: '#d9d9d9' }} />
                    <Text>No results found for "{searchQuery}"</Text>
                    <Button onClick={() => setSearchQuery('')}>Clear search</Button>
                  </Space>
                </Card>
              )}

              <Divider />

              {/* Shopping Timeline */}
              <div>
                <Title level={4}>Your Shopping Journey</Title>
                <Timeline
                  items={[
                    {
                      color: 'blue',
                      children: (
                        <div>
                          <Text strong>1. Browse & Research</Text>
                          <br />
                          <Text type="secondary">
                            Explore products, read reviews, and compare options
                          </Text>
                        </div>
                      ),
                    },
                    {
                      color: 'green',
                      children: (
                        <div>
                          <Text strong>2. Add to Cart</Text>
                          <br />
                          <Text type="secondary">Select your items and review your cart</Text>
                        </div>
                      ),
                    },
                    {
                      color: 'orange',
                      children: (
                        <div>
                          <Text strong>3. Checkout</Text>
                          <br />
                          <Text type="secondary">
                            Enter shipping details and payment information
                          </Text>
                        </div>
                      ),
                    },
                    {
                      color: 'purple',
                      children: (
                        <div>
                          <Text strong>4. Track Order</Text>
                          <br />
                          <Text type="secondary">Monitor your delivery status in real-time</Text>
                        </div>
                      ),
                    },
                    {
                      color: 'red',
                      children: (
                        <div>
                          <Text strong>5. Receive & Review</Text>
                          <br />
                          <Text type="secondary">
                            Get your order and share your experience
                          </Text>
                        </div>
                      ),
                    },
                  ]}
                />
              </div>

              {/* Additional Resources */}
              <Card title="Additional Resources" style={{ background: '#fafafa' }}>
                <Row gutter={16}>
                  <Col span={12}>
                    <Space direction="vertical" style={{ width: '100%' }}>
                      <Button type="link" icon={<TruckOutlined />} block style={{ justifyContent: 'flex-start' }}>
                        Shipping & Delivery Info
                      </Button>
                      <Button type="link" icon={<SafetyOutlined />} block style={{ justifyContent: 'flex-start' }}>
                        Return & Refund Policy
                      </Button>
                      <Button type="link" icon={<GiftOutlined />} block style={{ justifyContent: 'flex-start' }}>
                        Promotions & Deals
                      </Button>
                    </Space>
                  </Col>
                  <Col span={12}>
                    <Space direction="vertical" style={{ width: '100%' }}>
                      <Button type="link" icon={<DollarOutlined />} block style={{ justifyContent: 'flex-start' }}>
                        Payment Methods
                      </Button>
                      <Button type="link" icon={<StarOutlined />} block style={{ justifyContent: 'flex-start' }}>
                        Product Reviews Guide
                      </Button>
                      <Button type="link" icon={<QuestionCircleOutlined />} block style={{ justifyContent: 'flex-start' }}>
                        FAQs
                      </Button>
                    </Space>
                  </Col>
                </Row>
              </Card>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default BuyingGuidePage;
