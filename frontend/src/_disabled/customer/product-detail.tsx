import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Image,
  Button,
  Space,
  Rate,
  Divider,
  Tag,
  Descriptions,
  InputNumber,
  Radio,
  Collapse,
  List,
  Avatar,
  Progress,
  Badge,
  Tabs,
  Timeline,
  Statistic,
} from 'antd';
import {
  ShoppingCartOutlined,
  HeartOutlined,
  ShareAltOutlined,
  CheckCircleFilled,
  TruckOutlined,
  SafetyOutlined,
  StarFilled,
  UserOutlined,
  LikeOutlined,
  DislikeOutlined,
  PercentageOutlined,
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { Panel } = Collapse;
const { TabPane } = Tabs;

interface ProductDetail {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  rating: number;
  totalReviews: number;
  images: string[];
  brand: string;
  category: string;
  inStock: boolean;
  stockCount: number;
  sku: string;
  warranty: string;
  returnPolicy: string;
  freeShipping: boolean;
  estimatedDelivery: string;
  specifications: { [key: string]: string };
  features: string[];
  reviews: Review[];
  relatedProducts: RelatedProduct[];
}

interface Review {
  id: number;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  verified: boolean;
  helpful: number;
  images?: string[];
}

interface RelatedProduct {
  id: number;
  name: string;
  price: number;
  rating: number;
  image: string;
}

const mockProduct: ProductDetail = {
  id: 1,
  name: 'Premium Wireless Bluetooth Headphones with Active Noise Cancellation',
  description: 'Experience superior sound quality with our premium wireless headphones. Featuring advanced active noise cancellation, 40-hour battery life, and premium comfort padding for all-day wear.',
  price: 89.99,
  originalPrice: 129.99,
  rating: 4.5,
  totalReviews: 2456,
  images: [
    'https://via.placeholder.com/600x600?text=Main+Image',
    'https://via.placeholder.com/600x600?text=Side+View',
    'https://via.placeholder.com/600x600?text=Packaging',
    'https://via.placeholder.com/600x600?text=In+Use',
  ],
  brand: 'AudioTech Pro',
  category: 'Electronics > Audio > Headphones',
  inStock: true,
  stockCount: 156,
  sku: 'ATP-WH-001-BLK',
  warranty: '2 Years Manufacturer Warranty',
  returnPolicy: '30-Day Easy Returns',
  freeShipping: true,
  estimatedDelivery: 'Nov 6-8, 2025',
  specifications: {
    'Connectivity': 'Bluetooth 5.2, 3.5mm AUX',
    'Battery Life': '40 hours (ANC on), 50 hours (ANC off)',
    'Charging Time': '2 hours (Fast Charge: 10min = 5hr)',
    'Driver Size': '40mm Dynamic Drivers',
    'Frequency Response': '20Hz - 20kHz',
    'Impedance': '32 Ohms',
    'Weight': '250g',
    'Noise Cancellation': 'Active Noise Cancellation (ANC)',
    'Microphone': 'Built-in with CVC 8.0',
    'Controls': 'Touch Controls + Physical Buttons',
    'Color Options': 'Black, Silver, Navy Blue',
    'Included Items': 'Headphones, USB-C Cable, AUX Cable, Carrying Case, User Manual',
  },
  features: [
    'Premium Active Noise Cancellation blocks up to 95% of ambient noise',
    'Hi-Res Audio certification for superior sound quality',
    'Ultra-comfortable memory foam ear cushions',
    'Foldable design with premium carrying case',
    'Multi-device connectivity (connect 2 devices simultaneously)',
    'Voice assistant support (Siri, Google Assistant, Alexa)',
    'Low latency mode for gaming and video',
    'IPX4 water-resistant rating',
  ],
  reviews: [
    {
      id: 1,
      userName: 'John D.',
      rating: 5,
      title: 'Best headphones I\'ve ever owned!',
      comment: 'The sound quality is incredible and the noise cancellation works perfectly. Battery life is amazing - I charge them once a week with daily use. Highly recommended!',
      date: 'Oct 28, 2025',
      verified: true,
      helpful: 245,
      images: ['https://via.placeholder.com/100x100?text=Review+1'],
    },
    {
      id: 2,
      userName: 'Sarah M.',
      rating: 4,
      title: 'Great value for money',
      comment: 'Very comfortable for long listening sessions. ANC is good but not the absolute best. Still, for the price, these are excellent.',
      date: 'Oct 25, 2025',
      verified: true,
      helpful: 128,
    },
    {
      id: 3,
      userName: 'Mike R.',
      rating: 5,
      title: 'Perfect for travel',
      comment: 'I use these on flights and they block out all the engine noise. The battery lasts forever and they fold up nicely. Great purchase!',
      date: 'Oct 20, 2025',
      verified: false,
      helpful: 89,
    },
  ],
  relatedProducts: [
    {
      id: 2,
      name: 'Wireless Earbuds Pro',
      price: 79.99,
      rating: 4.6,
      image: 'https://via.placeholder.com/150x150?text=Earbuds',
    },
    {
      id: 3,
      name: 'Headphone Stand',
      price: 24.99,
      rating: 4.3,
      image: 'https://via.placeholder.com/150x150?text=Stand',
    },
    {
      id: 4,
      name: 'Premium Audio Cable',
      price: 14.99,
      rating: 4.7,
      image: 'https://via.placeholder.com/150x150?text=Cable',
    },
  ],
};

const ProductDetailPage: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState('Black');

  const discountPercentage = Math.round(
    ((mockProduct.originalPrice - mockProduct.price) / mockProduct.originalPrice) * 100
  );

  const ratingDistribution = [
    { stars: 5, count: 1456, percentage: 59 },
    { stars: 4, count: 678, percentage: 28 },
    { stars: 3, count: 246, percentage: 10 },
    { stars: 2, count: 49, percentage: 2 },
    { stars: 1, count: 27, percentage: 1 },
  ];

  return (
    <div style={{ padding: 24, background: '#f0f2f5' }}>
      <Row gutter={24}>
        {/* Product Images */}
        <Col xs={24} lg={10}>
          <Card>
            <Image
              src={mockProduct.images[selectedImage]}
              alt={mockProduct.name}
              style={{ width: '100%', borderRadius: 8 }}
            />
            <div style={{ display: 'flex', gap: 8, marginTop: 16, overflowX: 'auto' }}>
              {mockProduct.images.map((img, idx) => (
                <Image
                  key={idx}
                  src={img}
                  alt={`${mockProduct.name} ${idx + 1}`}
                  style={{
                    width: 80,
                    height: 80,
                    cursor: 'pointer',
                    border: selectedImage === idx ? '2px solid #ff9900' : '1px solid #d9d9d9',
                    borderRadius: 4,
                    objectFit: 'cover',
                  }}
                  preview={false}
                  onClick={() => setSelectedImage(idx)}
                />
              ))}
            </div>
          </Card>
        </Col>

        {/* Product Details */}
        <Col xs={24} lg={14}>
          <Card>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              {/* Title and Rating */}
              <div>
                <Text type="secondary">{mockProduct.category}</Text>
                <Title level={3} style={{ marginTop: 8, marginBottom: 12 }}>
                  {mockProduct.name}
                </Title>
                <Space split={<Divider type="vertical" />}>
                  <Space>
                    <Rate disabled value={mockProduct.rating} allowHalf />
                    <Text strong>{mockProduct.rating}</Text>
                  </Space>
                  <Text type="secondary">{mockProduct.totalReviews.toLocaleString()} reviews</Text>
                  <Text type="secondary">Brand: <Text strong>{mockProduct.brand}</Text></Text>
                </Space>
              </div>

              <Divider style={{ margin: 0 }} />

              {/* Price */}
              <div>
                <Space align="baseline">
                  <Title level={2} style={{ color: '#ff9900', margin: 0 }}>
                    ${mockProduct.price.toFixed(2)}
                  </Title>
                  <Text delete type="secondary" style={{ fontSize: 18 }}>
                    ${mockProduct.originalPrice.toFixed(2)}
                  </Text>
                  <Tag color="red" icon={<PercentageOutlined />}>
                    Save {discountPercentage}%
                  </Tag>
                </Space>
                <div style={{ marginTop: 8 }}>
                  {mockProduct.freeShipping && (
                    <Tag color="success" icon={<TruckOutlined />}>FREE Shipping</Tag>
                  )}
                  <Tag color="blue">Estimated delivery: {mockProduct.estimatedDelivery}</Tag>
                </div>
              </div>

              <Divider style={{ margin: 0 }} />

              {/* Stock Status */}
              <div>
                {mockProduct.inStock ? (
                  <Space>
                    <CheckCircleFilled style={{ color: '#52c41a', fontSize: 18 }} />
                    <Text strong style={{ color: '#52c41a' }}>In Stock</Text>
                    <Text type="secondary">({mockProduct.stockCount} available)</Text>
                  </Space>
                ) : (
                  <Tag color="error">Out of Stock</Tag>
                )}
              </div>

              {/* Color Selection */}
              <div>
                <Text strong>Color: </Text>
                <Text>{selectedColor}</Text>
                <div style={{ marginTop: 8 }}>
                  <Radio.Group value={selectedColor} onChange={(e) => setSelectedColor(e.target.value)}>
                    <Radio.Button value="Black">Black</Radio.Button>
                    <Radio.Button value="Silver">Silver</Radio.Button>
                    <Radio.Button value="Navy Blue">Navy Blue</Radio.Button>
                  </Radio.Group>
                </div>
              </div>

              {/* Quantity */}
              <div>
                <Text strong>Quantity: </Text>
                <InputNumber
                  min={1}
                  max={mockProduct.stockCount}
                  value={quantity}
                  onChange={(value) => setQuantity(value || 1)}
                  style={{ marginLeft: 12, width: 120 }}
                />
              </div>

              {/* Actions */}
              <Space size="middle" style={{ width: '100%' }}>
                <Button
                  type="primary"
                  size="large"
                  icon={<ShoppingCartOutlined />}
                  disabled={!mockProduct.inStock}
                  style={{ flex: 1 }}
                >
                  Add to Cart
                </Button>
                <Button size="large" icon={<HeartOutlined />}>
                  Wishlist
                </Button>
                <Button size="large" icon={<ShareAltOutlined />}>
                  Share
                </Button>
              </Space>

              <Divider style={{ margin: 0 }} />

              {/* Policies */}
              <Space direction="vertical" size="small">
                <Space>
                  <SafetyOutlined style={{ color: '#1890ff' }} />
                  <Text>{mockProduct.warranty}</Text>
                </Space>
                <Space>
                  <CheckCircleFilled style={{ color: '#52c41a' }} />
                  <Text>{mockProduct.returnPolicy}</Text>
                </Space>
                <Space>
                  <TruckOutlined style={{ color: '#faad14' }} />
                  <Text>Fast & Reliable Shipping</Text>
                </Space>
              </Space>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* Detailed Information */}
      <Card style={{ marginTop: 24 }}>
        <Tabs defaultActiveKey="description">
          <TabPane tab="Description" key="description">
            <Paragraph style={{ fontSize: 16 }}>{mockProduct.description}</Paragraph>
            <Title level={5} style={{ marginTop: 24 }}>Key Features</Title>
            <ul>
              {mockProduct.features.map((feature, idx) => (
                <li key={idx}>
                  <Text>{feature}</Text>
                </li>
              ))}
            </ul>
          </TabPane>

          <TabPane tab="Specifications" key="specifications">
            <Descriptions bordered column={2}>
              {Object.entries(mockProduct.specifications).map(([key, value]) => (
                <Descriptions.Item key={key} label={key}>
                  {value}
                </Descriptions.Item>
              ))}
            </Descriptions>
          </TabPane>

          <TabPane tab={`Reviews (${mockProduct.totalReviews})`} key="reviews">
            {/* Rating Summary */}
            <Row gutter={24} style={{ marginBottom: 24 }}>
              <Col xs={24} md={8}>
                <div style={{ textAlign: 'center' }}>
                  <Title level={1} style={{ margin: 0 }}>{mockProduct.rating}</Title>
                  <Rate disabled value={mockProduct.rating} allowHalf style={{ fontSize: 24 }} />
                  <div style={{ marginTop: 8 }}>
                    <Text type="secondary">{mockProduct.totalReviews.toLocaleString()} total ratings</Text>
                  </div>
                </div>
              </Col>
              <Col xs={24} md={16}>
                {ratingDistribution.map(({ stars, count, percentage }) => (
                  <div key={stars} style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                    <Text style={{ width: 60 }}>{stars} star</Text>
                    <Progress
                      percent={percentage}
                      strokeColor="#faad14"
                      style={{ flex: 1, marginRight: 12 }}
                    />
                    <Text type="secondary" style={{ width: 60 }}>{count}</Text>
                  </div>
                ))}
              </Col>
            </Row>

            <Divider />

            {/* Reviews List */}
            <List
              itemLayout="vertical"
              dataSource={mockProduct.reviews}
              renderItem={(review) => (
                <List.Item
                  actions={[
                    <Space key="helpful">
                      <Button type="text" icon={<LikeOutlined />}>
                        Helpful ({review.helpful})
                      </Button>
                      <Button type="text" icon={<DislikeOutlined />}>
                        Not helpful
                      </Button>
                    </Space>,
                  ]}
                >
                  <List.Item.Meta
                    avatar={<Avatar icon={<UserOutlined />} />}
                    title={
                      <Space>
                        <Text strong>{review.userName}</Text>
                        {review.verified && (
                          <Tag color="success" icon={<CheckCircleFilled />}>
                            Verified Purchase
                          </Tag>
                        )}
                      </Space>
                    }
                    description={
                      <Space direction="vertical" size="small">
                        <div>
                          <Rate disabled value={review.rating} />
                          <Text strong style={{ marginLeft: 8 }}>{review.title}</Text>
                        </div>
                        <Text type="secondary">{review.date}</Text>
                      </Space>
                    }
                  />
                  <Paragraph>{review.comment}</Paragraph>
                  {review.images && (
                    <Space>
                      {review.images.map((img, idx) => (
                        <Image
                          key={idx}
                          src={img}
                          width={100}
                          height={100}
                          style={{ borderRadius: 4 }}
                        />
                      ))}
                    </Space>
                  )}
                </List.Item>
              )}
            />
          </TabPane>
        </Tabs>
      </Card>

      {/* Related Products */}
      <Card title="Customers Also Bought" style={{ marginTop: 24 }}>
        <Row gutter={16}>
          {mockProduct.relatedProducts.map((product) => (
            <Col xs={12} sm={8} md={6} key={product.id}>
              <Card
                hoverable
                cover={<Image src={product.image} preview={false} />}
              >
                <Card.Meta
                  title={
                    <Paragraph ellipsis={{ rows: 2 }} style={{ marginBottom: 8 }}>
                      {product.name}
                    </Paragraph>
                  }
                  description={
                    <Space direction="vertical" size="small">
                      <Rate disabled value={product.rating} style={{ fontSize: 12 }} />
                      <Text strong style={{ color: '#ff9900' }}>${product.price}</Text>
                    </Space>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>
      </Card>
    </div>
  );
};

export default ProductDetailPage;
