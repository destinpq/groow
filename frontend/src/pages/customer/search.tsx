import React, { useState } from 'react';
import {
  Card,
  Input,
  Select,
  Row,
  Col,
  Typography,
  Slider,
  Checkbox,
  Button,
  Space,
  Tag,
  Rate,
  Image,
  Pagination,
  Empty,
  Badge,
  Collapse,
  Radio,
  Divider,
} from 'antd';
import {
  SearchOutlined,
  FilterOutlined,
  CloseCircleOutlined,
  StarFilled,
  ShoppingCartOutlined,
  HeartOutlined,
  EyeOutlined,
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { Panel } = Collapse;
const { Option } = Select;

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  category: string;
  brand: string;
  inStock: boolean;
  freeShipping: boolean;
  isPrime: boolean;
  tags: string[];
}

const mockProducts: Product[] = [
  {
    id: 1,
    name: 'Wireless Bluetooth Headphones - Premium Sound',
    description: 'High-quality wireless headphones with active noise cancellation',
    price: 89.99,
    originalPrice: 129.99,
    rating: 4.5,
    reviews: 2456,
    image: 'https://via.placeholder.com/300x300?text=Headphones',
    category: 'Electronics',
    brand: 'AudioTech',
    inStock: true,
    freeShipping: true,
    isPrime: true,
    tags: ['Wireless', 'Noise Cancellation', 'Premium'],
  },
  {
    id: 2,
    name: 'Smart Watch - Fitness Tracker',
    description: 'Advanced fitness tracking with heart rate monitor',
    price: 199.99,
    rating: 4.8,
    reviews: 1823,
    image: 'https://via.placeholder.com/300x300?text=Smart+Watch',
    category: 'Electronics',
    brand: 'TechWear',
    inStock: true,
    freeShipping: true,
    isPrime: true,
    tags: ['Fitness', 'Smart', 'Waterproof'],
  },
  {
    id: 3,
    name: 'Laptop Stand - Aluminum',
    description: 'Ergonomic laptop stand for better posture',
    price: 34.99,
    originalPrice: 49.99,
    rating: 4.2,
    reviews: 892,
    image: 'https://via.placeholder.com/300x300?text=Laptop+Stand',
    category: 'Accessories',
    brand: 'DeskPro',
    inStock: true,
    freeShipping: false,
    isPrime: false,
    tags: ['Ergonomic', 'Aluminum', 'Adjustable'],
  },
  {
    id: 4,
    name: 'USB-C Hub - 7 in 1',
    description: 'Multi-port USB-C hub with HDMI and card reader',
    price: 45.99,
    rating: 4.6,
    reviews: 1234,
    image: 'https://via.placeholder.com/300x300?text=USB+Hub',
    category: 'Accessories',
    brand: 'ConnectPlus',
    inStock: true,
    freeShipping: true,
    isPrime: true,
    tags: ['USB-C', 'Multi-port', 'Compact'],
  },
  {
    id: 5,
    name: 'Wireless Mouse - Ergonomic',
    description: 'Comfortable wireless mouse with precision tracking',
    price: 24.99,
    originalPrice: 34.99,
    rating: 4.4,
    reviews: 567,
    image: 'https://via.placeholder.com/300x300?text=Mouse',
    category: 'Accessories',
    brand: 'ClickMaster',
    inStock: true,
    freeShipping: true,
    isPrime: false,
    tags: ['Wireless', 'Ergonomic', 'Silent'],
  },
  {
    id: 6,
    name: 'Mechanical Keyboard - RGB',
    description: 'Gaming mechanical keyboard with RGB backlighting',
    price: 79.99,
    rating: 4.7,
    reviews: 2103,
    image: 'https://via.placeholder.com/300x300?text=Keyboard',
    category: 'Accessories',
    brand: 'GameKeys',
    inStock: false,
    freeShipping: true,
    isPrime: true,
    tags: ['Mechanical', 'RGB', 'Gaming'],
  },
];

const categories = ['All Categories', 'Electronics', 'Accessories', 'Home', 'Fashion'];
const brands = ['All Brands', 'AudioTech', 'TechWear', 'DeskPro', 'ConnectPlus', 'ClickMaster', 'GameKeys'];
const sortOptions = [
  { label: 'Relevance', value: 'relevance' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Rating: High to Low', value: 'rating' },
  { label: 'Newest First', value: 'newest' },
];

const AdvancedSearchPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedBrand, setSelectedBrand] = useState('All Brands');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 300]);
  const [minRating, setMinRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [freeShippingOnly, setFreeShippingOnly] = useState(false);
  const [primeOnly, setPrimeOnly] = useState(false);
  const [sortBy, setSortBy] = useState('relevance');
  const [currentPage, setCurrentPage] = useState(1);
  const [recentSearches] = useState(['Wireless headphones', 'Smart watch', 'Laptop accessories']);

  const pageSize = 6;

  // Filter products based on all criteria
  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = searchQuery === '' || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'All Categories' || product.category === selectedCategory;
    const matchesBrand = selectedBrand === 'All Brands' || product.brand === selectedBrand;
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    const matchesRating = product.rating >= minRating;
    const matchesStock = !inStockOnly || product.inStock;
    const matchesShipping = !freeShippingOnly || product.freeShipping;
    const matchesPrime = !primeOnly || product.isPrime;

    return matchesSearch && matchesCategory && matchesBrand && matchesPrice && 
           matchesRating && matchesStock && matchesShipping && matchesPrime;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price_asc':
        return a.price - b.price;
      case 'price_desc':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const activeFiltersCount = 
    (selectedCategory !== 'All Categories' ? 1 : 0) +
    (selectedBrand !== 'All Brands' ? 1 : 0) +
    (priceRange[0] !== 0 || priceRange[1] !== 300 ? 1 : 0) +
    (minRating > 0 ? 1 : 0) +
    (inStockOnly ? 1 : 0) +
    (freeShippingOnly ? 1 : 0) +
    (primeOnly ? 1 : 0);

  const clearAllFilters = () => {
    setSelectedCategory('All Categories');
    setSelectedBrand('All Brands');
    setPriceRange([0, 300]);
    setMinRating(0);
    setInStockOnly(false);
    setFreeShippingOnly(false);
    setPrimeOnly(false);
  };

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      {/* Search Header */}
      <Card style={{ marginBottom: 16 }}>
        <Title level={4} style={{ marginBottom: 16 }}>Advanced Product Search</Title>
        <Space.Compact style={{ width: '100%' }} size="large">
          <Select
            value={selectedCategory}
            onChange={setSelectedCategory}
            style={{ width: 200 }}
          >
            {categories.map(cat => (
              <Option key={cat} value={cat}>{cat}</Option>
            ))}
          </Select>
          <Input
            placeholder="Search products, brands, or keywords..."
            prefix={<SearchOutlined />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="large"
            allowClear
          />
          <Button type="primary" size="large" icon={<SearchOutlined />}>
            Search
          </Button>
        </Space.Compact>

        {/* Recent Searches */}
        {recentSearches.length > 0 && searchQuery === '' && (
          <div style={{ marginTop: 12 }}>
            <Text type="secondary" style={{ fontSize: 12 }}>Recent searches: </Text>
            {recentSearches.map((search, idx) => (
              <Tag
                key={idx}
                style={{ cursor: 'pointer', marginTop: 4 }}
                onClick={() => setSearchQuery(search)}
              >
                {search}
              </Tag>
            ))}
          </div>
        )}
      </Card>

      <Row gutter={16}>
        {/* Filters Sidebar */}
        <Col xs={24} lg={6}>
          <Card
            title={
              <Space>
                <FilterOutlined />
                <span>Filters</span>
                {activeFiltersCount > 0 && (
                  <Badge count={activeFiltersCount} style={{ backgroundColor: '#ff9900' }} />
                )}
              </Space>
            }
            extra={
              activeFiltersCount > 0 && (
                <Button
                  type="link"
                  size="small"
                  danger
                  onClick={clearAllFilters}
                  icon={<CloseCircleOutlined />}
                >
                  Clear All
                </Button>
              )
            }
          >
            <Collapse defaultActiveKey={['1', '2', '3', '4', '5']} ghost>
              <Panel header="Brand" key="1">
                <Radio.Group
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  style={{ width: '100%' }}
                >
                  <Space direction="vertical" style={{ width: '100%' }}>
                    {brands.map(brand => (
                      <Radio key={brand} value={brand}>
                        {brand}
                      </Radio>
                    ))}
                  </Space>
                </Radio.Group>
              </Panel>

              <Panel header="Price Range" key="2">
                <Slider
                  range
                  min={0}
                  max={300}
                  value={priceRange}
                  onChange={(value) => setPriceRange(value as [number, number])}
                  tooltip={{ formatter: (value) => `$${value}` }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                  <Text>${priceRange[0]}</Text>
                  <Text>${priceRange[1]}</Text>
                </div>
              </Panel>

              <Panel header="Customer Rating" key="3">
                <Space direction="vertical" style={{ width: '100%' }}>
                  {[4, 3, 2, 1].map(rating => (
                    <div
                      key={rating}
                      onClick={() => setMinRating(rating)}
                      style={{
                        cursor: 'pointer',
                        padding: '4px 0',
                        background: minRating === rating ? '#e6f7ff' : 'transparent',
                        borderRadius: 4,
                      }}
                    >
                      <Rate disabled value={rating} style={{ fontSize: 14 }} />
                      <Text type="secondary"> & Up</Text>
                    </div>
                  ))}
                  {minRating > 0 && (
                    <Button type="link" size="small" onClick={() => setMinRating(0)}>
                      Clear rating filter
                    </Button>
                  )}
                </Space>
              </Panel>

              <Panel header="Availability" key="4">
                <Space direction="vertical">
                  <Checkbox checked={inStockOnly} onChange={(e) => setInStockOnly(e.target.checked)}>
                    In Stock Only
                  </Checkbox>
                  <Checkbox checked={freeShippingOnly} onChange={(e) => setFreeShippingOnly(e.target.checked)}>
                    Free Shipping
                  </Checkbox>
                  <Checkbox checked={primeOnly} onChange={(e) => setPrimeOnly(e.target.checked)}>
                    Prime Eligible
                  </Checkbox>
                </Space>
              </Panel>
            </Collapse>
          </Card>
        </Col>

        {/* Results */}
        <Col xs={24} lg={18}>
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <Text>
                <Text strong>{sortedProducts.length}</Text> results found
                {searchQuery && <Text type="secondary"> for "{searchQuery}"</Text>}
              </Text>
              <Select
                value={sortBy}
                onChange={setSortBy}
                style={{ width: 200 }}
                placeholder="Sort by"
              >
                {sortOptions.map(option => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </div>

            {paginatedProducts.length === 0 ? (
              <Empty description="No products found matching your criteria" />
            ) : (
              <>
                <Row gutter={[16, 16]}>
                  {paginatedProducts.map(product => (
                    <Col xs={24} sm={12} lg={8} key={product.id}>
                      <Card
                        hoverable
                        cover={
                          <div style={{ position: 'relative' }}>
                            <Image
                              src={product.image}
                              alt={product.name}
                              preview={false}
                              style={{ height: 200, objectFit: 'cover' }}
                            />
                            {product.originalPrice && (
                              <Tag
                                color="red"
                                style={{ position: 'absolute', top: 8, right: 8 }}
                              >
                                {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                              </Tag>
                            )}
                            {product.isPrime && (
                              <Tag
                                color="blue"
                                style={{ position: 'absolute', top: 8, left: 8 }}
                              >
                                Prime
                              </Tag>
                            )}
                          </div>
                        }
                        actions={[
                          <Button type="text" icon={<EyeOutlined />}>View</Button>,
                          <Button type="text" icon={<HeartOutlined />}>Save</Button>,
                          <Button type="text" icon={<ShoppingCartOutlined />}>Cart</Button>,
                        ]}
                      >
                        <Card.Meta
                          title={
                            <Paragraph
                              ellipsis={{ rows: 2 }}
                              style={{ marginBottom: 8, height: 44 }}
                            >
                              {product.name}
                            </Paragraph>
                          }
                          description={
                            <Space direction="vertical" style={{ width: '100%' }} size="small">
                              <div>
                                <Rate disabled value={product.rating} style={{ fontSize: 12 }} />
                                <Text type="secondary" style={{ fontSize: 12, marginLeft: 4 }}>
                                  ({product.reviews})
                                </Text>
                              </div>
                              <div>
                                <Text strong style={{ fontSize: 18, color: '#ff9900' }}>
                                  ${product.price.toFixed(2)}
                                </Text>
                                {product.originalPrice && (
                                  <Text delete type="secondary" style={{ marginLeft: 8, fontSize: 12 }}>
                                    ${product.originalPrice.toFixed(2)}
                                  </Text>
                                )}
                              </div>
                              <div>
                                {product.inStock ? (
                                  <Text type="success" style={{ fontSize: 12 }}>In Stock</Text>
                                ) : (
                                  <Text type="danger" style={{ fontSize: 12 }}>Out of Stock</Text>
                                )}
                                {product.freeShipping && (
                                  <Text type="secondary" style={{ fontSize: 12, marginLeft: 8 }}>
                                    • Free Shipping
                                  </Text>
                                )}
                              </div>
                            </Space>
                          }
                        />
                      </Card>
                    </Col>
                  ))}
                </Row>

                <Divider />

                <div style={{ textAlign: 'center' }}>
                  <Pagination
                    current={currentPage}
                    total={sortedProducts.length}
                    pageSize={pageSize}
                    onChange={setCurrentPage}
                    showSizeChanger={false}
                    showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} products`}
                  />
                </div>
              </>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdvancedSearchPage;
