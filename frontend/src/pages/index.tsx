import { Row, Col, Card, Button, Carousel, Input, Space, Typography, Divider } from 'antd';
import { useNavigate } from 'umi';
import { 
  ShoppingOutlined, 
  SearchOutlined, 
  ShoppingCartOutlined,
  HeartOutlined,
  StarFilled,
  TruckOutlined,
  SafetyOutlined,
  CustomerServiceOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import './index.less';

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;

const HomePage = () => {
  const navigate = useNavigate();

  const banners = [
    { 
      title: 'Mega Sale - Up to 70% Off', 
      description: 'Shop the latest trends at unbeatable prices',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      cta: 'Shop Now'
    },
    { 
      title: 'New Arrivals - Fresh Collection', 
      description: 'Discover the newest products from top vendors',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      cta: 'Explore New'
    },
    { 
      title: 'Wholesale Deals - B2B Special', 
      description: 'Bulk orders with special pricing for businesses',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      cta: 'Get Quote'
    },
  ];

  const categories = [
    { id: 1, name: 'Electronics', icon: '📱', color: '#1890ff' },
    { id: 2, name: 'Fashion', icon: '👕', color: '#eb2f96' },
    { id: 3, name: 'Home & Living', icon: '🏠', color: '#52c41a' },
    { id: 4, name: 'Beauty', icon: '💄', color: '#fa8c16' },
    { id: 5, name: 'Sports', icon: '⚽', color: '#13c2c2' },
    { id: 6, name: 'Books', icon: '📚', color: '#722ed1' },
    { id: 7, name: 'Toys', icon: '🧸', color: '#faad14' },
    { id: 8, name: 'Groceries', icon: '🛒', color: '#52c41a' },
  ];

  const featuredProducts = [
    { 
      id: 1, 
      title: 'Premium Wireless Headphones', 
      price: 99.99, 
      originalPrice: 149.99,
      rating: 4.5,
      reviews: 1234,
      image: 'https://via.placeholder.com/300x300?text=Headphones',
      discount: 33,
      badge: 'Best Seller'
    },
    { 
      id: 2, 
      title: 'Smart Watch Series 7', 
      price: 349.99,
      originalPrice: 499.99,
      rating: 4.8,
      reviews: 856,
      image: 'https://via.placeholder.com/300x300?text=Smart+Watch',
      discount: 30,
      badge: 'Hot Deal'
    },
    { 
      id: 3, 
      title: 'Professional Camera Kit', 
      price: 799.99,
      originalPrice: 1099.99,
      rating: 4.9,
      reviews: 432,
      image: 'https://via.placeholder.com/300x300?text=Camera',
      discount: 27,
      badge: 'Limited Stock'
    },
    { 
      id: 4, 
      title: 'Designer Leather Bag', 
      price: 179.99,
      originalPrice: 299.99,
      rating: 4.6,
      reviews: 678,
      image: 'https://via.placeholder.com/300x300?text=Leather+Bag',
      discount: 40,
      badge: 'New Arrival'
    },
  ];

  const features = [
    {
      icon: <TruckOutlined style={{ fontSize: 32, color: '#FF9900' }} />,
      title: 'Free Delivery',
      description: 'On orders above $50'
    },
    {
      icon: <SafetyOutlined style={{ fontSize: 32, color: '#FF9900' }} />,
      title: 'Secure Payment',
      description: '100% secure transactions'
    },
    {
      icon: <CustomerServiceOutlined style={{ fontSize: 32, color: '#FF9900' }} />,
      title: '24/7 Support',
      description: 'Dedicated customer service'
    },
    {
      icon: <ShoppingCartOutlined style={{ fontSize: 32, color: '#FF9900' }} />,
      title: 'Easy Returns',
      description: '30-day return policy'
    },
  ];

  return (
    <div className="homepage">
      {/* Hero Carousel */}
      <Carousel autoplay autoplaySpeed={5000} effect="fade" className="hero-carousel">
        {banners.map((banner, index) => (
          <div key={index}>
            <div 
              style={{ 
                height: 500, 
                background: banner.gradient,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
              }}
            >
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                style={{ textAlign: 'center', color: 'white', zIndex: 1 }}
              >
                <Title level={1} style={{ color: 'white', fontSize: 56, marginBottom: 16 }}>
                  {banner.title}
                </Title>
                <Paragraph style={{ fontSize: 24, color: 'white', marginBottom: 32 }}>
                  {banner.description}
                </Paragraph>
                <Button 
                  type="primary" 
                  size="large" 
                  icon={<ShoppingOutlined />}
                  onClick={() => navigate('/products')}
                  style={{ height: 50, fontSize: 18, padding: '0 40px' }}
                >
                  {banner.cta}
                </Button>
              </motion.div>
            </div>
          </div>
        ))}
      </Carousel>

      {/* Search Bar */}
      <div style={{ maxWidth: 1200, margin: '-30px auto 40px', position: 'relative', zIndex: 2, padding: '0 24px' }}>
        <Search
          placeholder="Search products, brands, categories..."
          size="large"
          enterButton={<Button type="primary" icon={<SearchOutlined />}>Search</Button>}
          onSearch={(value) => navigate(`/search?q=${value}`)}
          style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
        />
      </div>

      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 24px' }}>
        {/* Categories */}
        <section style={{ marginBottom: 48 }}>
          <Title level={2} style={{ marginBottom: 24 }}>Shop by Category</Title>
          <Row gutter={[16, 16]}>
            {categories.map(cat => (
              <Col xs={12} sm={8} md={6} lg={3} key={cat.id}>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Card
                    hoverable
                    onClick={() => navigate(`/category/${cat.id}`)}
                    style={{ 
                      textAlign: 'center', 
                      borderRadius: 8,
                      border: `2px solid ${cat.color}20`,
                    }}
                    bodyStyle={{ padding: '24px 12px' }}
                  >
                    <div style={{ fontSize: 48, marginBottom: 8 }}>{cat.icon}</div>
                    <Text strong style={{ fontSize: 14 }}>{cat.name}</Text>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        </section>

        <Divider />

        {/* Featured Products */}
        <section style={{ marginBottom: 48 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <Title level={2} style={{ margin: 0 }}>Today's Deals</Title>
            <Button type="link" onClick={() => navigate('/deals')}>View All →</Button>
          </div>
          
          <Row gutter={[16, 16]}>
            {featuredProducts.map(product => (
              <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
                <motion.div
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card
                    hoverable
                    cover={
                      <div style={{ position: 'relative' }}>
                        <img alt={product.title} src={product.image} style={{ height: 280, objectFit: 'cover' }} />
                        {product.badge && (
                          <div style={{
                            position: 'absolute',
                            top: 12,
                            left: 12,
                            background: '#FF9900',
                            color: 'white',
                            padding: '4px 12px',
                            borderRadius: 4,
                            fontSize: 12,
                            fontWeight: 'bold'
                          }}>
                            {product.badge}
                          </div>
                        )}
                        {product.discount > 0 && (
                          <div style={{
                            position: 'absolute',
                            top: 12,
                            right: 12,
                            background: '#C7511F',
                            color: 'white',
                            padding: '4px 8px',
                            borderRadius: 4,
                            fontSize: 12,
                            fontWeight: 'bold'
                          }}>
                            -{product.discount}%
                          </div>
                        )}
                        <Button
                          type="text"
                          icon={<HeartOutlined />}
                          style={{
                            position: 'absolute',
                            top: 12,
                            right: product.discount > 0 ? 80 : 12,
                            background: 'white',
                            borderRadius: '50%',
                            width: 32,
                            height: 32,
                          }}
                        />
                      </div>
                    }
                    onClick={() => navigate(`/products/${product.id}`)}
                    bodyStyle={{ padding: 16 }}
                  >
                    <div style={{ marginBottom: 8 }}>
                      <Space size={4}>
                        <StarFilled style={{ color: '#FF9900', fontSize: 14 }} />
                        <Text strong>{product.rating}</Text>
                        <Text type="secondary" style={{ fontSize: 12 }}>({product.reviews})</Text>
                      </Space>
                    </div>
                    
                    <Paragraph 
                      ellipsis={{ rows: 2 }} 
                      style={{ marginBottom: 8, minHeight: 44, fontSize: 14 }}
                    >
                      {product.title}
                    </Paragraph>
                    
                    <Space direction="vertical" size={4} style={{ width: '100%' }}>
                      <div>
                        <Text strong style={{ fontSize: 20, color: '#B12704' }}>
                          ${product.price}
                        </Text>
                        {product.originalPrice && (
                          <Text delete type="secondary" style={{ marginLeft: 8, fontSize: 14 }}>
                            ${product.originalPrice}
                          </Text>
                        )}
                      </div>
                      
                      <Button 
                        type="primary" 
                        icon={<ShoppingCartOutlined />}
                        block
                        onClick={(e) => {
                          e.stopPropagation();
                          // Add to cart logic
                        }}
                      >
                        Add to Cart
                      </Button>
                    </Space>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        </section>

        <Divider />

        {/* Features */}
        <section style={{ marginBottom: 48, background: '#F7F8FA', margin: '0 -24px', padding: '40px 24px' }}>
          <Row gutter={[32, 32]}>
            {features.map((feature, index) => (
              <Col xs={24} sm={12} md={6} key={index}>
                <div style={{ textAlign: 'center' }}>
                  {feature.icon}
                  <Title level={4} style={{ marginTop: 16, marginBottom: 8 }}>
                    {feature.title}
                  </Title>
                  <Text type="secondary">{feature.description}</Text>
                </div>
              </Col>
            ))}
          </Row>
        </section>
      </div>
    </div>
  );
};

export default HomePage;
