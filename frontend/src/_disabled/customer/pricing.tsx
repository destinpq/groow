import React, { useState } from 'react';
import {
  Card,
  Typography,
  Table,
  Tag,
  InputNumber,
  Button,
  Space,
  message,
  Row,
  Col,
  Statistic,
  Alert,
  Tooltip,
  Divider,
} from 'antd';
import {
  PercentageOutlined,
  ThunderboltOutlined,
  TeamOutlined,
  TrophyOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text, Paragraph } = Typography;

interface PricingTier {
  minQty: number;
  maxQty: number | null;
  discount: number;
  pricePerUnit: number;
  tierName: string;
}

interface Product {
  id: number;
  name: string;
  image: string;
  basePrice: number;
  category: string;
  vendor: string;
}

const mockProduct: Product = {
  id: 1,
  name: 'Wireless Bluetooth Headphones Pro',
  image: 'https://via.placeholder.com/400x300?text=Product',
  basePrice: 89.99,
  category: 'Electronics',
  vendor: 'AudioTech Solutions',
};

const pricingTiers: PricingTier[] = [
  {
    minQty: 1,
    maxQty: 9,
    discount: 0,
    pricePerUnit: 89.99,
    tierName: 'Retail',
  },
  {
    minQty: 10,
    maxQty: 49,
    discount: 10,
    pricePerUnit: 80.99,
    tierName: 'Small Business',
  },
  {
    minQty: 50,
    maxQty: 99,
    discount: 15,
    pricePerUnit: 76.49,
    tierName: 'Bulk',
  },
  {
    minQty: 100,
    maxQty: 499,
    discount: 20,
    pricePerUnit: 71.99,
    tierName: 'Wholesale',
  },
  {
    minQty: 500,
    maxQty: null,
    discount: 25,
    pricePerUnit: 67.49,
    tierName: 'Enterprise',
  },
];

const DynamicPricingPage: React.FC = () => {
  const [quantity, setQuantity] = useState(1);

  const getCurrentTier = (): PricingTier => {
    return (
      pricingTiers.find(
        tier => quantity >= tier.minQty && (tier.maxQty === null || quantity <= tier.maxQty)
      ) || pricingTiers[0]
    );
  };

  const calculatePricing = () => {
    const tier = getCurrentTier();
    const subtotal = tier.pricePerUnit * quantity;
    const savings = (mockProduct.basePrice - tier.pricePerUnit) * quantity;

    return {
      tier,
      pricePerUnit: tier.pricePerUnit,
      subtotal,
      savings,
      savingsPercent: tier.discount,
    };
  };

  const pricing = calculatePricing();

  const columns: ColumnsType<PricingTier> = [
    {
      title: 'Tier',
      dataIndex: 'tierName',
      key: 'tierName',
      render: (text: string, record: PricingTier) => (
        <div>
          <Text strong>{text}</Text>
          {getCurrentTier().tierName === text && (
            <Tag color="blue" style={{ marginLeft: 8 }}>
              Current
            </Tag>
          )}
        </div>
      ),
    },
    {
      title: 'Quantity Range',
      key: 'range',
      render: (_, record: PricingTier) => (
        <Text>
          {record.minQty} - {record.maxQty || '∞'}
        </Text>
      ),
    },
    {
      title: 'Discount',
      dataIndex: 'discount',
      key: 'discount',
      render: (discount: number) => (
        <Tag color={discount > 0 ? 'green' : 'default'}>
          {discount > 0 ? `-${discount}%` : 'Standard'}
        </Tag>
      ),
    },
    {
      title: 'Price Per Unit',
      dataIndex: 'pricePerUnit',
      key: 'pricePerUnit',
      render: (price: number, record: PricingTier) => (
        <div>
          <Text strong style={{ fontSize: 16, color: '#ff9900' }}>
            ${price.toFixed(2)}
          </Text>
          {record.discount > 0 && (
            <div>
              <Text delete type="secondary" style={{ fontSize: 12 }}>
                ${mockProduct.basePrice.toFixed(2)}
              </Text>
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Total Savings',
      key: 'savings',
      render: (_, record: PricingTier) => {
        if (record.discount === 0) return <Text type="secondary">-</Text>;
        const savings = (mockProduct.basePrice - record.pricePerUnit) * record.minQty;
        return (
          <Text strong style={{ color: '#52c41a' }}>
            ${savings.toFixed(2)}+
          </Text>
        );
      },
    },
  ];

  const handleAddToCart = () => {
    message.success(
      `Added ${quantity} items to cart at $${pricing.pricePerUnit.toFixed(2)} each (${
        pricing.tier.tierName
      } tier)`
    );
  };

  const handleQuantityChange = (value: number | null) => {
    if (value && value > 0) {
      setQuantity(value);
    }
  };

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={3}>
          <PercentageOutlined style={{ color: '#ff9900' }} /> Dynamic Pricing Calculator
        </Title>
        <Paragraph type="secondary">
          Get better prices when you buy in bulk. The more you buy, the more you save!
        </Paragraph>
      </div>

      <Alert
        message="Volume Discounts Available"
        description="Our dynamic pricing automatically applies the best discount based on your quantity. Discounts range from 10% to 25% off!"
        type="success"
        icon={<ThunderboltOutlined />}
        showIcon
        closable
        style={{ marginBottom: 24 }}
      />

      <Row gutter={24}>
        {/* Product Info */}
        <Col xs={24} lg={8}>
          <Card
            cover={
              <img
                src={mockProduct.image}
                alt={mockProduct.name}
                style={{ height: 300, objectFit: 'cover' }}
              />
            }
          >
            <Title level={4}>{mockProduct.name}</Title>
            <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>
              Category: {mockProduct.category}
            </Text>
            <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
              Sold by: <Text strong>{mockProduct.vendor}</Text>
            </Text>
            <Divider />
            <div style={{ textAlign: 'center' }}>
              <Text type="secondary">Base Price</Text>
              <div>
                <Text strong style={{ fontSize: 24, color: '#8c8c8c' }}>
                  ${mockProduct.basePrice.toFixed(2)}
                </Text>
              </div>
            </div>
          </Card>
        </Col>

        {/* Pricing Calculator */}
        <Col xs={24} lg={16}>
          <Card title="Calculate Your Price">
            <Row gutter={24}>
              <Col xs={24} md={12}>
                <div style={{ marginBottom: 24 }}>
                  <Text strong style={{ display: 'block', marginBottom: 8 }}>
                    Select Quantity:
                  </Text>
                  <InputNumber
                    min={1}
                    max={10000}
                    value={quantity}
                    onChange={handleQuantityChange}
                    size="large"
                    style={{ width: '100%' }}
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  />
                  <Text type="secondary" style={{ fontSize: 12, display: 'block', marginTop: 4 }}>
                    Minimum order: 1 unit
                  </Text>
                </div>
              </Col>

              <Col xs={24} md={12}>
                <div
                  style={{
                    background: '#fafafa',
                    padding: 16,
                    borderRadius: 8,
                    border: '2px solid #1890ff',
                  }}
                >
                  <div style={{ marginBottom: 8 }}>
                    <Tag color="blue" style={{ fontSize: 14 }}>
                      {pricing.tier.tierName} Tier
                    </Tag>
                  </div>
                  <Text type="secondary" style={{ display: 'block', fontSize: 12 }}>
                    Your Price Per Unit
                  </Text>
                  <Title level={2} style={{ margin: '8px 0', color: '#ff9900' }}>
                    ${pricing.pricePerUnit.toFixed(2)}
                  </Title>
                  {pricing.savingsPercent > 0 && (
                    <Tag color="green" icon={<PercentageOutlined />}>
                      Save {pricing.savingsPercent}%
                    </Tag>
                  )}
                </div>
              </Col>
            </Row>

            <Divider />

            {/* Statistics */}
            <Row gutter={16} style={{ marginBottom: 24 }}>
              <Col xs={12} sm={6}>
                <Statistic
                  title="Quantity"
                  value={quantity}
                  prefix={<TeamOutlined />}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Col>
              <Col xs={12} sm={6}>
                <Statistic
                  title="Price/Unit"
                  value={pricing.pricePerUnit}
                  prefix="$"
                  precision={2}
                  valueStyle={{ color: '#ff9900' }}
                />
              </Col>
              <Col xs={12} sm={6}>
                <Statistic
                  title="Subtotal"
                  value={pricing.subtotal}
                  prefix="$"
                  precision={2}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Col>
              <Col xs={12} sm={6}>
                <Statistic
                  title="You Save"
                  value={pricing.savings}
                  prefix="$"
                  precision={2}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Col>
            </Row>

            <Button
              type="primary"
              size="large"
              icon={<ThunderboltOutlined />}
              block
              onClick={handleAddToCart}
            >
              Add {quantity.toLocaleString()} {quantity === 1 ? 'Item' : 'Items'} to Cart - $
              {pricing.subtotal.toFixed(2)}
            </Button>

            {pricing.tier.maxQty && (
              <Alert
                message={
                  <div>
                    <TrophyOutlined /> Unlock the next tier!
                  </div>
                }
                description={`Buy ${
                  pricing.tier.maxQty + 1
                } or more to get ${pricingTiers[pricingTiers.indexOf(pricing.tier) + 1]?.discount}% off ($${
                  pricingTiers[pricingTiers.indexOf(pricing.tier) + 1]?.pricePerUnit.toFixed(2)
                }/unit)`}
                type="info"
                showIcon={false}
                style={{ marginTop: 16 }}
              />
            )}
          </Card>

          {/* Pricing Tiers Table */}
          <Card
            title={
              <Space>
                <span>All Pricing Tiers</span>
                <Tooltip title="Discounts automatically applied based on quantity">
                  <InfoCircleOutlined style={{ color: '#8c8c8c' }} />
                </Tooltip>
              </Space>
            }
            style={{ marginTop: 24 }}
          >
            <Table
              columns={columns}
              dataSource={pricingTiers}
              pagination={false}
              rowKey="tierName"
              size="middle"
            />

            <Divider />

            <div style={{ fontSize: 12, color: '#8c8c8c' }}>
              <div style={{ marginBottom: 4 }}>
                ✓ Free shipping on orders over $500
              </div>
              <div style={{ marginBottom: 4 }}>
                ✓ Volume discounts apply automatically at checkout
              </div>
              <div style={{ marginBottom: 4 }}>
                ✓ Enterprise pricing available for orders of 500+ units
              </div>
              <div>✓ Contact us for custom quotes on larger orders</div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DynamicPricingPage;
