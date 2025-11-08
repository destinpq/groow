import React from 'react';
import { Row, Col, Card, Button, Carousel, Input, Space, Typography, Divider, Badge, Rate } from 'antd';
import { useNavigate } from 'umi';
import { 
  ShoppingOutlined, 
  SearchOutlined, 
  ShoppingCartOutlined,
  HeartOutlined,
  StarFilled,
  TruckOutlined,
  SafetyOutlined,
  PercentageOutlined,
  ThunderboltOutlined,
  GiftOutlined,
  MenuOutlined,
  UserOutlined,
  EnvironmentOutlined,
} from '@ant-design/icons';
import CustomerServiceOutlined from '@ant-design/icons/CustomerServiceOutlined';
// import './index.less';

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;

const HomePage = () => {
  const navigate = useNavigate();

  // Top Navigation Categories
  const topCategories = [
    'Electronics', 'Fashion', 'Home & Kitchen', 'Beauty & Health', 
    'Sports & Outdoors', 'Books', 'Toys & Games', 'Automotive'
  ];

  // Hero Carousel Data
  const heroSlides = [
    {
      title: 'Mega Electronics Sale',
      subtitle: 'Up to 70% off on Top Brands',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      buttonText: 'Shop Electronics',
      buttonLink: '/categories/electronics'
    },
    {
      title: 'New Fashion Collection',
      subtitle: 'Trending styles for every season',
      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      buttonText: 'Shop Fashion',
      buttonLink: '/categories/fashion'
    },
    {
      title: 'Home Essentials',
      subtitle: 'Transform your living space',
      background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      buttonText: 'Shop Home',
      buttonLink: '/categories/home'
    }
  ];

  const categories = [
    { name: 'Electronics', icon: '📱', items: 'Phones, Laptops, TVs', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400' },
    { name: 'Fashion', icon: '�', items: 'Clothing, Shoes, Bags', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400' },
    { name: 'Home & Kitchen', icon: '🏠', items: 'Furniture, Decor, Appliances', image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=400' },
    { name: 'Beauty', icon: '💄', items: 'Cosmetics, Skincare, Fragrance', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400' },
  ];

  const deals = [
    {
      id: 1,
      title: 'Apple iPhone 15 Pro Max',
      price: 1199,
      originalPrice: 1499,
      rating: 4.8,
      reviews: 2847,
      image: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=400',
      discount: 20,
      badge: 'Limited Deal',
      prime: true
    },
    {
      id: 2,
      title: 'Sony WH-1000XM5 Wireless Headphones',
      price: 349,
      originalPrice: 399,
      rating: 4.9,
      reviews: 5621,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
      discount: 13,
      badge: 'Best Seller',
      prime: true
    },
    {
      id: 3,
      title: 'Samsung 55" 4K Smart TV',
      price: 599,
      originalPrice: 899,
      rating: 4.7,
      reviews: 1893,
      image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=400',
      discount: 33,
      badge: 'Deal of the Day',
      prime: false
    },
    {
      id: 4,
      title: 'Nike Air Max Running Shoes',
      price: 129,
      originalPrice: 180,
      rating: 4.6,
      reviews: 3421,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
      discount: 28,
      badge: 'Hot Deal',
      prime: true
    },
    {
      id: 5,
      title: 'Instant Pot Duo 7-in-1',
      price: 89,
      originalPrice: 139,
      rating: 4.8,
      reviews: 12847,
      image: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=400',
      discount: 36,
      badge: 'Top Rated',
      prime: true
    },
    {
      id: 6,
      title: 'Canon EOS R6 Camera Body',
      price: 2299,
      originalPrice: 2499,
      rating: 4.9,
      reviews: 892,
      image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400',
      discount: 8,
      badge: 'New Arrival',
      prime: false
    },
    {
      id: 7,
      title: 'KitchenAid Stand Mixer',
      price: 279,
      originalPrice: 399,
      rating: 4.9,
      reviews: 8234,
      image: 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=400',
      discount: 30,
      badge: "Amazon's Choice",
      prime: true
    },
    {
      id: 8,
      title: 'Dyson V15 Vacuum Cleaner',
      price: 649,
      originalPrice: 749,
      rating: 4.7,
      reviews: 2156,
      image: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=400',
      discount: 13,
      badge: 'Limited Stock',
      prime: true
    }
  ];

  return (
    <div style={{ background: '#EAEDED' }}>
      {/* Top Header Bar */}
      <div style={{ 
        background: '#131921', 
        color: 'white', 
        padding: '8px 0',
        borderBottom: '1px solid #232F3E'
      }}>
        <div style={{ maxWidth: 1500, margin: '0 auto', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Space size="large">
            <div style={{ fontSize: 24, fontWeight: 'bold', cursor: 'pointer' }} onClick={() => navigate('/')}>
              GROOW
            </div>
            <Space size="small" style={{ cursor: 'pointer' }}>
              <EnvironmentOutlined />
              <div>
                <div style={{ fontSize: 11, color: '#ccc' }}>Deliver to</div>
                <div style={{ fontSize: 14, fontWeight: 'bold' }}>New York 10001</div>
              </div>
            </Space>
          </Space>
          
          <div style={{ flex: 1, maxWidth: 800, margin: '0 20px' }}>
            <Search
              placeholder="Search Groow"
              size="large"
              enterButton={
                <Button 
                  style={{ 
                    background: '#FEBD69', 
                    borderColor: '#FEBD69',
                    color: '#131921',
                    fontWeight: 600
                  }}
                  icon={<SearchOutlined />}
                />
              }
              onSearch={(value) => navigate(`/search?q=${value}`)}
            />
          </div>

          <Space size="large">
            <div style={{ cursor: 'pointer' }} onClick={() => navigate('/login')}>
              <div style={{ fontSize: 11 }}>Hello, Sign in</div>
              <div style={{ fontSize: 14, fontWeight: 'bold' }}>Account & Lists</div>
            </div>
            <div style={{ cursor: 'pointer' }} onClick={() => navigate('/orders')}>
              <div style={{ fontSize: 11 }}>Returns</div>
              <div style={{ fontSize: 14, fontWeight: 'bold' }}>& Orders</div>
            </div>
            <Badge count={3} style={{ background: '#FF9900' }}>
              <div style={{ cursor: 'pointer', fontSize: 24 }} onClick={() => navigate('/cart')}>
                <ShoppingCartOutlined style={{ color: 'white' }} />
              </div>
            </Badge>
          </Space>
        </div>
      </div>

      {/* Navigation Bar */}
      <div style={{ background: '#232F3E', color: 'white', padding: '8px 0' }}>
        <div style={{ maxWidth: 1500, margin: '0 auto', padding: '0 20px' }}>
          <Space size="large">
            <Button 
              type="text" 
              icon={<MenuOutlined />} 
              style={{ color: 'white', fontWeight: 'bold' }}
            >
              All
            </Button>
            {topCategories.map((cat, idx) => (
              <Text 
                key={idx} 
                style={{ color: 'white', cursor: 'pointer', fontSize: 14 }}
                onClick={() => navigate(`/category/${cat.toLowerCase()}`)}
              >
                {cat}
              </Text>
            ))}
          </Space>
        </div>
      </div>

      {/* Hero Carousel */}
      <div style={{ position: 'relative' }}>
        <Carousel autoplay autoplaySpeed={4000} effect="fade">
          {heroSlides.map((slide, index) => (
            <div key={index}>
              <div
                style={{
                  height: 400,
                  background: slide.background,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  padding: '0 20px'
                }}
              >
                <div style={{ textAlign: 'center', color: 'white', maxWidth: 800 }}>
                  <Title level={1} style={{ color: 'white', fontSize: 48, marginBottom: 8, fontWeight: 700 }}>
                    {slide.title}
                  </Title>
                  <Paragraph style={{ fontSize: 20, color: 'white', marginBottom: 24, opacity: 0.95 }}>
                    {slide.subtitle}
                  </Paragraph>
                  <Button
                    type="primary"
                    size="large"
                    onClick={() => navigate(slide.buttonLink)}
                    style={{
                      height: 45,
                      fontSize: 16,
                      padding: '0 40px',
                      background: '#FF9900',
                      borderColor: '#FF9900',
                      fontWeight: 600
                    }}
                  >
                    {slide.buttonText}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </Carousel>

        {/* Category Quick Access overlaid on hero */}
        <div style={{ 
          position: 'absolute', 
          bottom: -60, 
          left: 0, 
          right: 0, 
          zIndex: 10,
          maxWidth: 1500,
          margin: '0 auto',
          padding: '0 20px'
        }}>
          <Row gutter={16}>
            {categories.map((cat, idx) => (
              <Col xs={24} sm={12} md={6} key={idx}>
                <Card
                  hoverable
                  onClick={() => navigate(`/category/${cat.name.toLowerCase()}`)}
                  style={{ 
                    background: 'white',
                    border: 'none',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}
                  bodyStyle={{ padding: 16 }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div 
                      style={{ 
                        width: 60, 
                        height: 60, 
                        borderRadius: 8,
                        background: `url(${cat.image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }} 
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 4 }}>{cat.name}</div>
                      <div style={{ fontSize: 12, color: '#666' }}>{cat.items}</div>
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: 1500, margin: '0 auto', padding: '80px 20px 40px' }}>
        
        {/* Today's Deals Section */}
        <Card 
          style={{ marginBottom: 24, border: 'none' }}
          bodyStyle={{ padding: 20 }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <Title level={3} style={{ margin: 0 }}>Today's Deals</Title>
            <Button type="link" onClick={() => navigate('/deals')} style={{ fontSize: 16 }}>
              See all deals →
            </Button>
          </div>

          <Row gutter={[16, 16]}>
            {deals.map((product) => (
              <Col xs={12} sm={8} md={6} lg={3} key={product.id}>
                <Card
                  hoverable
                  onClick={() => navigate(`/products/${product.id}`)}
                  cover={
                    <div style={{ position: 'relative', paddingTop: '100%', background: '#f5f5f5' }}>
                      <img
                        alt={product.title}
                        src={product.image}
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                      {product.badge && (
                        <div
                          style={{
                            position: 'absolute',
                            top: 8,
                            left: 8,
                            background: '#CC0C39',
                            color: 'white',
                            padding: '4px 8px',
                            fontSize: 11,
                            fontWeight: 'bold',
                            borderRadius: 2
                          }}
                        >
                          {product.badge}
                        </div>
                      )}
                      {product.discount > 0 && (
                        <div
                          style={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            background: '#B12704',
                            color: 'white',
                            padding: '4px 8px',
                            fontSize: 12,
                            fontWeight: 'bold',
                            borderRadius: 2
                          }}
                        >
                          -{product.discount}%
                        </div>
                      )}
                    </div>
                  }
                  bodyStyle={{ padding: 12 }}
                  style={{ border: '1px solid #DDD' }}
                >
                  {product.prime && (
                    <div style={{ marginBottom: 4 }}>
                      <span style={{ 
                        background: '#00A8E1', 
                        color: 'white', 
                        padding: '2px 6px', 
                        fontSize: 10, 
                        fontWeight: 'bold',
                        borderRadius: 2
                      }}>
                        prime
                      </span>
                    </div>
                  )}
                  
                  <Paragraph
                    ellipsis={{ rows: 2 }}
                    style={{ 
                      marginBottom: 8, 
                      fontSize: 14, 
                      minHeight: 40,
                      lineHeight: '1.4'
                    }}
                  >
                    {product.title}
                  </Paragraph>

                  <div style={{ marginBottom: 4 }}>
                    <Space size={4} align="center">
                      <Rate disabled defaultValue={product.rating} style={{ fontSize: 12 }} />
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        ({product.reviews.toLocaleString()})
                      </Text>
                    </Space>
                  </div>

                  <div style={{ marginBottom: 8 }}>
                    <Space align="baseline" size={4}>
                      <Text strong style={{ fontSize: 11, color: '#0F1111' }}>$</Text>
                      <Text strong style={{ fontSize: 20, color: '#0F1111', lineHeight: 1 }}>
                        {Math.floor(product.price)}
                      </Text>
                      <Text strong style={{ fontSize: 11, color: '#0F1111' }}>
                        {(product.price % 1).toFixed(2).substring(1)}
                      </Text>
                    </Space>
                    {product.originalPrice && (
                      <div>
                        <Text delete type="secondary" style={{ fontSize: 12 }}>
                          ${product.originalPrice}
                        </Text>
                      </div>
                    )}
                  </div>

                  {product.prime && (
                    <div style={{ fontSize: 11, color: '#007185', marginBottom: 8 }}>
                      FREE delivery Tomorrow
                    </div>
                  )}

                  <Button
                    type="primary"
                    block
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Add to cart
                    }}
                    style={{
                      background: '#FFD814',
                      borderColor: '#FCD200',
                      color: '#0F1111',
                      fontWeight: 600,
                      fontSize: 13
                    }}
                  >
                    Add to Cart
                  </Button>
                </Card>
              </Col>
            ))}
          </Row>
        </Card>

        {/* Service Features */}
        <Card style={{ background: '#F7F8F8', border: 'none', marginBottom: 24 }} bodyStyle={{ padding: 30 }}>
          <Row gutter={[24, 24]}>
            <Col xs={24} sm={12} md={6}>
              <div style={{ textAlign: 'center' }}>
                <TruckOutlined style={{ fontSize: 40, color: '#FF9900', marginBottom: 12 }} />
                <Title level={5} style={{ marginBottom: 8 }}>FREE Shipping</Title>
                <Text type="secondary">Free delivery on orders over $25</Text>
              </div>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <div style={{ textAlign: 'center' }}>
                <SafetyOutlined style={{ fontSize: 40, color: '#FF9900', marginBottom: 12 }} />
                <Title level={5} style={{ marginBottom: 8 }}>Secure Payment</Title>
                <Text type="secondary">100% secure transactions</Text>
              </div>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <div style={{ textAlign: 'center' }}>
                <CustomerServiceOutlined style={{ fontSize: 40, color: '#FF9900', marginBottom: 12 }} />
                <Title level={5} style={{ marginBottom: 8 }}>24/7 Support</Title>
                <Text type="secondary">Dedicated customer service</Text>
              </div>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <div style={{ textAlign: 'center' }}>
                <ThunderboltOutlined style={{ fontSize: 40, color: '#FF9900', marginBottom: 12 }} />
                <Title level={5} style={{ marginBottom: 8 }}>Easy Returns</Title>
                <Text type="secondary">30-day return policy</Text>
              </div>
            </Col>
          </Row>
        </Card>
      </div>

      {/* Footer */}
      <div style={{ background: '#232F3E', color: 'white', padding: '40px 20px', marginTop: 40 }}>
        <div style={{ maxWidth: 1500, margin: '0 auto', textAlign: 'center' }}>
          <Title level={4} style={{ color: 'white', marginBottom: 8 }}>GROOW</Title>
          <Text style={{ color: '#DDD' }}>Your one-stop marketplace for everything</Text>
        </div>
      </div>
    </div>
  );
};

export default HomePage;