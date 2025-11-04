import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Button,
  Tag,
  Space,
  Divider,
  Image,
  Badge,
  Checkbox,
  message,
  Statistic,
  Alert,
} from 'antd';
import {
  ShoppingCartOutlined,
  GiftOutlined,
  CheckCircleOutlined,
  PercentageOutlined,
  ThunderboltOutlined,
  StarFilled,
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

interface BundleItem {
  id: number;
  name: string;
  image: string;
  price: number;
  required: boolean;
}

interface ProductBundle {
  id: number;
  name: string;
  description: string;
  totalValue: number;
  bundlePrice: number;
  savings: number;
  savingsPercent: number;
  badge?: string;
  popularity: number;
  items: BundleItem[];
}

const mockBundles: ProductBundle[] = [
  {
    id: 1,
    name: 'Complete Home Office Setup',
    description: 'Everything you need for a productive home office workspace',
    totalValue: 449.95,
    bundlePrice: 349.99,
    savings: 99.96,
    savingsPercent: 22,
    badge: 'Best Value',
    popularity: 1245,
    items: [
      {
        id: 101,
        name: 'Mechanical Keyboard RGB',
        image: 'https://via.placeholder.com/150?text=Keyboard',
        price: 79.99,
        required: true,
      },
      {
        id: 102,
        name: 'Wireless Gaming Mouse',
        image: 'https://via.placeholder.com/150?text=Mouse',
        price: 49.99,
        required: true,
      },
      {
        id: 103,
        name: 'USB-C Hub 7-in-1',
        image: 'https://via.placeholder.com/150?text=Hub',
        price: 34.99,
        required: true,
      },
      {
        id: 104,
        name: 'Laptop Stand Aluminum',
        image: 'https://via.placeholder.com/150?text=Stand',
        price: 29.99,
        required: false,
      },
      {
        id: 105,
        name: 'Desk Lamp LED',
        image: 'https://via.placeholder.com/150?text=Lamp',
        price: 39.99,
        required: false,
      },
      {
        id: 106,
        name: 'Mouse Pad XXL',
        image: 'https://via.placeholder.com/150?text=Pad',
        price: 19.99,
        required: false,
      },
      {
        id: 107,
        name: 'Cable Management Kit',
        image: 'https://via.placeholder.com/150?text=Cables',
        price: 14.99,
        required: false,
      },
      {
        id: 108,
        name: 'Wrist Rest Ergonomic',
        image: 'https://via.placeholder.com/150?text=Wrist',
        price: 12.99,
        required: false,
      },
    ],
  },
  {
    id: 2,
    name: 'Audio Enthusiast Bundle',
    description: 'Premium audio equipment for the best listening experience',
    totalValue: 379.97,
    bundlePrice: 299.99,
    savings: 79.98,
    savingsPercent: 21,
    badge: 'Popular',
    popularity: 892,
    items: [
      {
        id: 201,
        name: 'Wireless Bluetooth Headphones',
        image: 'https://via.placeholder.com/150?text=Headphones',
        price: 89.99,
        required: true,
      },
      {
        id: 202,
        name: 'Portable Bluetooth Speaker',
        image: 'https://via.placeholder.com/150?text=Speaker',
        price: 59.99,
        required: true,
      },
      {
        id: 203,
        name: 'Premium Earbuds',
        image: 'https://via.placeholder.com/150?text=Earbuds',
        price: 129.99,
        required: true,
      },
      {
        id: 204,
        name: 'Audio Cable 3.5mm',
        image: 'https://via.placeholder.com/150?text=Cable',
        price: 9.99,
        required: false,
      },
      {
        id: 205,
        name: 'Headphone Stand',
        image: 'https://via.placeholder.com/150?text=Stand',
        price: 24.99,
        required: false,
      },
      {
        id: 206,
        name: 'Carrying Case Premium',
        image: 'https://via.placeholder.com/150?text=Case',
        price: 19.99,
        required: false,
      },
    ],
  },
  {
    id: 3,
    name: 'Smart Home Starter Kit',
    description: 'Transform your home into a smart home with these essentials',
    totalValue: 529.96,
    bundlePrice: 429.99,
    savings: 99.97,
    savingsPercent: 19,
    badge: 'Trending',
    popularity: 678,
    items: [
      {
        id: 301,
        name: 'Smart Speaker with Alexa',
        image: 'https://via.placeholder.com/150?text=Speaker',
        price: 99.99,
        required: true,
      },
      {
        id: 302,
        name: 'Smart Bulbs (4-pack)',
        image: 'https://via.placeholder.com/150?text=Bulbs',
        price: 49.99,
        required: true,
      },
      {
        id: 303,
        name: 'Smart Plug (2-pack)',
        image: 'https://via.placeholder.com/150?text=Plugs',
        price: 29.99,
        required: true,
      },
      {
        id: 304,
        name: 'Smart Thermostat',
        image: 'https://via.placeholder.com/150?text=Thermostat',
        price: 149.99,
        required: false,
      },
      {
        id: 305,
        name: 'Security Camera',
        image: 'https://via.placeholder.com/150?text=Camera',
        price: 89.99,
        required: false,
      },
      {
        id: 306,
        name: 'Motion Sensor',
        image: 'https://via.placeholder.com/150?text=Sensor',
        price: 24.99,
        required: false,
      },
    ],
  },
];

const ProductBundlesPage: React.FC = () => {
  const [bundles, setBundles] = useState(mockBundles);
  const [selectedItems, setSelectedItems] = useState<{ [bundleId: number]: number[] }>({});

  const handleItemToggle = (bundleId: number, itemId: number, required: boolean) => {
    if (required) return; // Cannot deselect required items

    const currentItems = selectedItems[bundleId] || [];
    const newItems = currentItems.includes(itemId)
      ? currentItems.filter(id => id !== itemId)
      : [...currentItems, itemId];

    setSelectedItems({
      ...selectedItems,
      [bundleId]: newItems,
    });
  };

  const calculateBundleTotal = (bundle: ProductBundle) => {
    const requiredItems = bundle.items.filter(item => item.required);
    const requiredTotal = requiredItems.reduce((sum, item) => sum + item.price, 0);

    const selectedOptionalItems = bundle.items.filter(
      item => !item.required && (selectedItems[bundle.id] || []).includes(item.id)
    );
    const optionalTotal = selectedOptionalItems.reduce((sum, item) => sum + item.price, 0);

    const baseDiscount = bundle.bundlePrice;
    const optionalDiscount = optionalTotal * 0.85; // 15% discount on optional items

    return {
      original: requiredTotal + optionalTotal,
      discounted: baseDiscount + optionalDiscount,
      savings: (requiredTotal + optionalTotal) - (baseDiscount + optionalDiscount),
    };
  };

  const handleAddToCart = (bundle: ProductBundle) => {
    const totals = calculateBundleTotal(bundle);
    message.success(`Added "${bundle.name}" to cart - Total: $${totals.discounted.toFixed(2)}`);
  };

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={3}>
          <GiftOutlined style={{ color: '#ff9900' }} /> Product Bundles & Packages
        </Title>
        <Paragraph type="secondary">
          Save more by purchasing products together in our curated bundles
        </Paragraph>
      </div>

      <Alert
        message="Bundle Savings"
        description="All bundles include required items with a discount. Add optional items to customize your bundle and save even more!"
        type="info"
        icon={<PercentageOutlined />}
        showIcon
        closable
        style={{ marginBottom: 24 }}
      />

      <Row gutter={[24, 24]}>
        {bundles.map(bundle => {
          const totals = calculateBundleTotal(bundle);
          const savingsPercent = Math.round((totals.savings / totals.original) * 100);

          return (
            <Col xs={24} key={bundle.id}>
              <Card>
                <Row gutter={24}>
                  <Col xs={24} lg={16}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 16 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                          <Title level={4} style={{ margin: 0 }}>
                            {bundle.name}
                          </Title>
                          {bundle.badge && (
                            <Tag
                              color={
                                bundle.badge === 'Best Value'
                                  ? 'gold'
                                  : bundle.badge === 'Popular'
                                  ? 'green'
                                  : 'orange'
                              }
                              icon={
                                bundle.badge === 'Best Value' ? (
                                  <StarFilled />
                                ) : bundle.badge === 'Trending' ? (
                                  <ThunderboltOutlined />
                                ) : null
                              }
                            >
                              {bundle.badge}
                            </Tag>
                          )}
                        </div>
                        <Paragraph type="secondary" style={{ marginBottom: 16 }}>
                          {bundle.description}
                        </Paragraph>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          {bundle.popularity.toLocaleString()} bundles sold
                        </Text>
                      </div>
                    </div>

                    <Divider />

                    {/* Bundle Items */}
                    <div>
                      <Title level={5}>Bundle Contents</Title>
                      <Row gutter={[12, 12]}>
                        {bundle.items.map(item => {
                          const isSelected =
                            item.required || (selectedItems[bundle.id] || []).includes(item.id);

                          return (
                            <Col xs={24} sm={12} md={8} key={item.id}>
                              <Card
                                size="small"
                                style={{
                                  border: isSelected ? '2px solid #1890ff' : '1px solid #d9d9d9',
                                  opacity: isSelected ? 1 : 0.6,
                                }}
                              >
                                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                                  <Checkbox
                                    checked={isSelected}
                                    disabled={item.required}
                                    onChange={() =>
                                      handleItemToggle(bundle.id, item.id, item.required)
                                    }
                                  />
                                  <Image
                                    src={item.image}
                                    alt={item.name}
                                    width={50}
                                    height={50}
                                    preview={false}
                                    style={{ borderRadius: 4 }}
                                  />
                                  <div style={{ flex: 1 }}>
                                    <Text strong style={{ fontSize: 12, display: 'block' }}>
                                      {item.name}
                                    </Text>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                      <Text type="secondary" style={{ fontSize: 11 }}>
                                        ${item.price}
                                      </Text>
                                      {item.required && (
                                        <Tag color="blue" style={{ fontSize: 10, padding: '0 4px' }}>
                                          Required
                                        </Tag>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </Card>
                            </Col>
                          );
                        })}
                      </Row>
                    </div>
                  </Col>

                  {/* Pricing Summary */}
                  <Col xs={24} lg={8}>
                    <Card style={{ background: '#fafafa', height: '100%' }}>
                      <Title level={5}>Bundle Summary</Title>

                      <div style={{ marginBottom: 16 }}>
                        <Statistic
                          title="Original Price"
                          value={totals.original}
                          prefix="$"
                          valueStyle={{ fontSize: 18, textDecoration: 'line-through', color: '#8c8c8c' }}
                        />
                      </div>

                      <div style={{ marginBottom: 16 }}>
                        <Statistic
                          title="Bundle Price"
                          value={totals.discounted.toFixed(2)}
                          prefix="$"
                          valueStyle={{ fontSize: 32, color: '#ff9900', fontWeight: 700 }}
                        />
                      </div>

                      <div style={{ marginBottom: 16 }}>
                        <Statistic
                          title="You Save"
                          value={totals.savings.toFixed(2)}
                          prefix="$"
                          suffix={
                            <Tag color="red" style={{ marginLeft: 8 }}>
                              {savingsPercent}% OFF
                            </Tag>
                          }
                          valueStyle={{ fontSize: 24, color: '#52c41a' }}
                        />
                      </div>

                      <Divider />

                      <Space direction="vertical" style={{ width: '100%' }} size="middle">
                        <Button
                          type="primary"
                          size="large"
                          icon={<ShoppingCartOutlined />}
                          block
                          onClick={() => handleAddToCart(bundle)}
                        >
                          Add Bundle to Cart
                        </Button>

                        <div style={{ textAlign: 'center' }}>
                          <Space>
                            <CheckCircleOutlined style={{ color: '#52c41a' }} />
                            <Text type="secondary" style={{ fontSize: 12 }}>
                              {bundle.items.filter(i => i.required).length} required items
                            </Text>
                          </Space>
                          <br />
                          <Space style={{ marginTop: 4 }}>
                            <GiftOutlined style={{ color: '#1890ff' }} />
                            <Text type="secondary" style={{ fontSize: 12 }}>
                              {bundle.items.filter(i => !i.required).length} optional items
                            </Text>
                          </Space>
                        </div>
                      </Space>

                      <Divider />

                      <div style={{ fontSize: 11, color: '#8c8c8c' }}>
                        <div style={{ marginBottom: 4 }}>
                          ✓ Free shipping on bundle orders
                        </div>
                        <div style={{ marginBottom: 4 }}>
                          ✓ 30-day return policy
                        </div>
                        <div>✓ 1-year warranty on all items</div>
                      </div>
                    </Card>
                  </Col>
                </Row>
              </Card>
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

export default ProductBundlesPage;
