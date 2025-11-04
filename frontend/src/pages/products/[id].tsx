import React, { useState } from 'react';
import {
  Row,
  Col,
  Image,
  Typography,
  Rate,
  Button,
  InputNumber,
  Space,
  Tag,
  Tabs,
  Card,
  Avatar,
  Progress,
  Divider,
  Breadcrumb,
  message,
  Badge,
} from 'antd';
import {
  ShoppingCartOutlined,
  HeartOutlined,
  HeartFilled,
  ShareAltOutlined,
  SafetyOutlined,
  ShopOutlined,
  CheckCircleOutlined,
  StarFilled,
} from '@ant-design/icons';
import { history } from 'umi';
import { motion } from 'framer-motion';
import './[id].less';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

// Mock product data - will be replaced with API call
const mockProduct = {
  id: 1,
  name: 'Premium Wireless Bluetooth Headphones - Noise Cancelling Over-Ear',
  slug: 'premium-wireless-headphones',
  sku: 'WH-1000XM4',
  price: 349.99,
  originalPrice: 449.99,
  discount: 22,
  rating: 4.5,
  reviewCount: 2847,
  inStock: true,
  stockQuantity: 156,
  brand: 'TechSound',
  category: 'Electronics',
  subcategory: 'Audio',
  vendor: {
    id: 1,
    name: 'TechHub Store',
    logo: 'https://via.placeholder.com/50',
    rating: 4.7,
    productCount: 1234,
    verified: true,
  },
  images: [
    'https://via.placeholder.com/600x600/1890ff/fff?text=Main+Product',
    'https://via.placeholder.com/600x600/52c41a/fff?text=Image+2',
    'https://via.placeholder.com/600x600/faad14/fff?text=Image+3',
    'https://via.placeholder.com/600x600/f5222d/fff?text=Image+4',
    'https://via.placeholder.com/600x600/722ed1/fff?text=Image+5',
  ],
  description: `
    <h3>Premium Audio Experience</h3>
    <p>Industry-leading noise cancellation technology for immersive listening experience. 
    Features 30-hour battery life, touch sensor controls, and speak-to-chat technology.</p>
    
    <h4>Key Features:</h4>
    <ul>
      <li>Industry-leading Active Noise Cancellation (ANC)</li>
      <li>30 hours battery life with quick charging (10 min = 5 hours)</li>
      <li>Premium sound quality with LDAC codec support</li>
      <li>Touch sensor controls for easy operation</li>
      <li>Speak-to-chat technology automatically pauses music</li>
      <li>Comfortable over-ear design with soft ear cushions</li>
    </ul>
  `,
  specifications: [
    { label: 'Brand', value: 'TechSound' },
    { label: 'Model', value: 'WH-1000XM4' },
    { label: 'Color', value: 'Black' },
    { label: 'Connectivity', value: 'Bluetooth 5.0, NFC' },
    { label: 'Battery Life', value: '30 hours' },
    { label: 'Charging Time', value: '3 hours (Full), 10 min (Quick)' },
    { label: 'Weight', value: '254g' },
    { label: 'Driver Size', value: '40mm' },
    { label: 'Frequency Response', value: '4Hz - 40kHz' },
    { label: 'Warranty', value: '1 Year Manufacturer Warranty' },
  ],
  variants: [
    { id: 1, name: 'Black', stock: 156, available: true },
    { id: 2, name: 'Silver', stock: 89, available: true },
    { id: 3, name: 'Blue', stock: 0, available: false },
  ],
  reviews: [
    {
      id: 1,
      userName: 'John Doe',
      avatar: 'https://i.pravatar.cc/150?img=1',
      rating: 5,
      date: '2024-10-15',
      comment: 'Excellent noise cancellation! Best headphones I\'ve ever owned. Sound quality is phenomenal.',
      helpful: 234,
      verified: true,
    },
    {
      id: 2,
      userName: 'Sarah Smith',
      avatar: 'https://i.pravatar.cc/150?img=2',
      rating: 4,
      date: '2024-10-10',
      comment: 'Great product overall. Battery life is impressive. Only minor issue is they can feel a bit heavy after long use.',
      helpful: 89,
      verified: true,
    },
    {
      id: 3,
      userName: 'Mike Johnson',
      avatar: 'https://i.pravatar.cc/150?img=3',
      rating: 5,
      date: '2024-10-05',
      comment: 'Worth every penny! The noise cancellation works amazingly well on flights.',
      helpful: 156,
      verified: false,
    },
  ],
  ratingBreakdown: {
    5: 1845,
    4: 672,
    3: 234,
    2: 56,
    1: 40,
  },
};

const ProductDetailPage: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(mockProduct.variants[0]);

  const handleAddToCart = () => {
    message.success('Added to cart successfully!');
    // Add to cart logic
  };

  const handleBuyNow = () => {
    message.success('Proceeding to checkout...');
    history.push('/checkout');
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    message.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: mockProduct.name,
        text: `Check out this product: ${mockProduct.name}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      message.success('Product link copied to clipboard!');
    }
  };

  const calculateRatingPercentage = (star: number) => {
    const total = Object.values(mockProduct.ratingBreakdown).reduce((a, b) => a + b, 0);
    const count = mockProduct.ratingBreakdown[star as keyof typeof mockProduct.ratingBreakdown] || 0;
    return ((count / total) * 100).toFixed(0);
  };

  return (
    <div className="product-detail-page">
      {/* Breadcrumb */}
      <Breadcrumb style={{ marginBottom: 24 }}>
        <Breadcrumb.Item>
          <a onClick={() => history.push('/')}>Home</a>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <a onClick={() => history.push('/products')}>{mockProduct.category}</a>
        </Breadcrumb.Item>
        <Breadcrumb.Item>{mockProduct.subcategory}</Breadcrumb.Item>
        <Breadcrumb.Item>{mockProduct.name}</Breadcrumb.Item>
      </Breadcrumb>

      <Row gutter={[32, 32]}>
        {/* Left: Image Gallery */}
        <Col xs={24} lg={10}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="product-gallery">
              {/* Main Image */}
              <div className="main-image-wrapper">
                {mockProduct.discount > 0 && (
                  <Badge.Ribbon text={`-${mockProduct.discount}%`} color="red">
                    <Image
                      src={mockProduct.images[selectedImage]}
                      alt={mockProduct.name}
                      preview={{
                        mask: 'Click to zoom',
                      }}
                      style={{ width: '100%', borderRadius: 8 }}
                    />
                  </Badge.Ribbon>
                )}
                {!mockProduct.discount && (
                  <Image
                    src={mockProduct.images[selectedImage]}
                    alt={mockProduct.name}
                    preview={{
                      mask: 'Click to zoom',
                    }}
                    style={{ width: '100%', borderRadius: 8 }}
                  />
                )}
              </div>

              {/* Thumbnail Images */}
              <Row gutter={[8, 8]} style={{ marginTop: 16 }}>
                {mockProduct.images.map((img, index) => (
                  <Col span={4} key={index}>
                    <div
                      className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                      onClick={() => setSelectedImage(index)}
                      style={{
                        cursor: 'pointer',
                        border: selectedImage === index ? '2px solid #FF9900' : '1px solid #ddd',
                        borderRadius: 4,
                        padding: 4,
                      }}
                    >
                      <img
                        src={img}
                        alt={`Product ${index + 1}`}
                        style={{ width: '100%', borderRadius: 4 }}
                      />
                    </div>
                  </Col>
                ))}
              </Row>

              {/* Share & Wishlist */}
              <Row gutter={16} style={{ marginTop: 16 }}>
                <Col span={12}>
                  <Button
                    block
                    icon={isWishlisted ? <HeartFilled /> : <HeartOutlined />}
                    onClick={handleWishlist}
                    danger={isWishlisted}
                  >
                    {isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}
                  </Button>
                </Col>
                <Col span={12}>
                  <Button block icon={<ShareAltOutlined />} onClick={handleShare}>
                    Share
                  </Button>
                </Col>
              </Row>
            </Card>
          </motion.div>
        </Col>

        {/* Right: Product Details */}
        <Col xs={24} lg={14}>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Product Title */}
            <Title level={2} style={{ marginBottom: 8 }}>
              {mockProduct.name}
            </Title>

            {/* Rating & Reviews */}
            <Space size="middle" style={{ marginBottom: 16 }}>
              <Rate disabled defaultValue={mockProduct.rating} allowHalf />
              <Text strong>{mockProduct.rating}</Text>
              <Text type="secondary">({mockProduct.reviewCount.toLocaleString()} reviews)</Text>
              {mockProduct.vendor.verified && (
                <Tag icon={<CheckCircleOutlined />} color="success">
                  Verified Seller
                </Tag>
              )}
            </Space>

            <Divider />

            {/* Price */}
            <Space align="baseline" size="large" style={{ marginBottom: 24 }}>
              <Title level={3} style={{ color: '#B12704', margin: 0 }}>
                ${mockProduct.price.toFixed(2)}
              </Title>
              {mockProduct.originalPrice > mockProduct.price && (
                <>
                  <Text delete type="secondary" style={{ fontSize: 18 }}>
                    ${mockProduct.originalPrice.toFixed(2)}
                  </Text>
                  <Tag color="red" style={{ fontSize: 14 }}>
                    Save {mockProduct.discount}%
                  </Tag>
                </>
              )}
            </Space>

            {/* Stock Status */}
            {mockProduct.inStock ? (
              <Tag color="success" icon={<CheckCircleOutlined />} style={{ marginBottom: 16 }}>
                In Stock ({mockProduct.stockQuantity} available)
              </Tag>
            ) : (
              <Tag color="error" style={{ marginBottom: 16 }}>
                Out of Stock
              </Tag>
            )}

            {/* Variant Selection */}
            <div style={{ marginBottom: 24 }}>
              <Text strong style={{ display: 'block', marginBottom: 8 }}>
                Color:
              </Text>
              <Space>
                {mockProduct.variants.map((variant) => (
                  <Button
                    key={variant.id}
                    type={selectedVariant.id === variant.id ? 'primary' : 'default'}
                    disabled={!variant.available}
                    onClick={() => setSelectedVariant(variant)}
                  >
                    {variant.name}
                    {!variant.available && ' (Out of stock)'}
                  </Button>
                ))}
              </Space>
            </div>

            {/* Quantity Selector */}
            <div style={{ marginBottom: 24 }}>
              <Text strong style={{ display: 'block', marginBottom: 8 }}>
                Quantity:
              </Text>
              <InputNumber
                min={1}
                max={mockProduct.stockQuantity}
                value={quantity}
                onChange={(val) => setQuantity(val || 1)}
                size="large"
              />
            </div>

            {/* Action Buttons */}
            <Space direction="vertical" style={{ width: '100%', marginBottom: 24 }} size="middle">
              <Button
                type="primary"
                size="large"
                block
                icon={<ShoppingCartOutlined />}
                onClick={handleAddToCart}
                disabled={!mockProduct.inStock}
              >
                Add to Cart
              </Button>
              <Button
                size="large"
                block
                style={{ background: '#FFA41C', borderColor: '#FF9900', color: '#000' }}
                onClick={handleBuyNow}
                disabled={!mockProduct.inStock}
              >
                Buy Now
              </Button>
            </Space>

            {/* Vendor Info */}
            <Card size="small" style={{ marginBottom: 24 }}>
              <Row align="middle" gutter={16}>
                <Col>
                  <Avatar size={50} src={mockProduct.vendor.logo} icon={<ShopOutlined />} />
                </Col>
                <Col flex={1}>
                  <Text strong style={{ display: 'block' }}>
                    {mockProduct.vendor.name}
                  </Text>
                  <Space size="small">
                    <Rate disabled defaultValue={mockProduct.vendor.rating} style={{ fontSize: 12 }} />
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      ({mockProduct.vendor.productCount} products)
                    </Text>
                  </Space>
                </Col>
                <Col>
                  <Button onClick={() => history.push(`/vendor/${mockProduct.vendor.id}`)}>
                    Visit Store
                  </Button>
                </Col>
              </Row>
            </Card>

            {/* Trust Badges */}
            <Row gutter={16}>
              <Col span={8}>
                <Card size="small" style={{ textAlign: 'center' }}>
                  <SafetyOutlined style={{ fontSize: 24, color: '#52c41a' }} />
                  <Text style={{ display: 'block', marginTop: 8, fontSize: 12 }}>
                    Secure Payment
                  </Text>
                </Card>
              </Col>
              <Col span={8}>
                <Card size="small" style={{ textAlign: 'center' }}>
                  <CheckCircleOutlined style={{ fontSize: 24, color: '#1890ff' }} />
                  <Text style={{ display: 'block', marginTop: 8, fontSize: 12 }}>
                    Quality Assured
                  </Text>
                </Card>
              </Col>
              <Col span={8}>
                <Card size="small" style={{ textAlign: 'center' }}>
                  <SafetyOutlined style={{ fontSize: 24, color: '#faad14' }} />
                  <Text style={{ display: 'block', marginTop: 8, fontSize: 12 }}>
                    7 Day Returns
                  </Text>
                </Card>
              </Col>
            </Row>
          </motion.div>
        </Col>
      </Row>

      {/* Product Details Tabs */}
      <Card style={{ marginTop: 32 }}>
        <Tabs defaultActiveKey="1" size="large">
          <TabPane tab="Description" key="1">
            <div dangerouslySetInnerHTML={{ __html: mockProduct.description }} />
          </TabPane>

          <TabPane tab="Specifications" key="2">
            <Row gutter={[16, 16]}>
              {mockProduct.specifications.map((spec, index) => (
                <React.Fragment key={index}>
                  <Col span={8}>
                    <Text strong>{spec.label}</Text>
                  </Col>
                  <Col span={16}>
                    <Text>{spec.value}</Text>
                  </Col>
                </React.Fragment>
              ))}
            </Row>
          </TabPane>

          <TabPane tab={`Reviews (${mockProduct.reviewCount})`} key="3">
            {/* Rating Summary */}
            <Row gutter={32} style={{ marginBottom: 32 }}>
              <Col xs={24} md={8}>
                <div style={{ textAlign: 'center' }}>
                  <Title level={1} style={{ margin: 0 }}>
                    {mockProduct.rating}
                  </Title>
                  <Rate disabled defaultValue={mockProduct.rating} allowHalf />
                  <Text type="secondary" style={{ display: 'block', marginTop: 8 }}>
                    Based on {mockProduct.reviewCount.toLocaleString()} reviews
                  </Text>
                </div>
              </Col>
              <Col xs={24} md={16}>
                {[5, 4, 3, 2, 1].map((star) => (
                  <Row key={star} align="middle" gutter={8} style={{ marginBottom: 8 }}>
                    <Col span={3}>
                      <Text>{star} star</Text>
                    </Col>
                    <Col span={18}>
                      <Progress
                        percent={Number(calculateRatingPercentage(star))}
                        strokeColor="#FF9900"
                        showInfo={false}
                      />
                    </Col>
                    <Col span={3}>
                      <Text type="secondary">{calculateRatingPercentage(star)}%</Text>
                    </Col>
                  </Row>
                ))}
              </Col>
            </Row>

            <Divider />

            {/* Reviews List */}
            {mockProduct.reviews.map((review) => (
              <Card key={review.id} style={{ marginBottom: 16 }} size="small">
                <Row gutter={16}>
                  <Col span={3}>
                    <Avatar size={48} src={review.avatar} />
                  </Col>
                  <Col span={21}>
                    <Space direction="vertical" size={4} style={{ width: '100%' }}>
                      <Space>
                        <Text strong>{review.userName}</Text>
                        {review.verified && (
                          <Tag color="success" icon={<CheckCircleOutlined />}>
                            Verified Purchase
                          </Tag>
                        )}
                      </Space>
                      <Rate disabled defaultValue={review.rating} style={{ fontSize: 14 }} />
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        Reviewed on {review.date}
                      </Text>
                      <Paragraph style={{ marginTop: 8 }}>{review.comment}</Paragraph>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {review.helpful} people found this helpful
                      </Text>
                    </Space>
                  </Col>
                </Row>
              </Card>
            ))}

            <Button block style={{ marginTop: 16 }}>
              Load More Reviews
            </Button>
          </TabPane>
        </Tabs>
      </Card>

      {/* Related Products */}
      <Card title="Related Products" style={{ marginTop: 32 }}>
        <Text type="secondary">Related products will be displayed here...</Text>
      </Card>
    </div>
  );
};

export default ProductDetailPage;
