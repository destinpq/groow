import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Select,
  Input,
  Rate,
  Button,
  Tag,
  Space,
  Pagination,
  Empty,
  Slider,
  Checkbox,
  Divider,
  Image,
  Tooltip,
  Badge,
} from 'antd';
import {
  SearchOutlined,
  FilterOutlined,
  ShoppingCartOutlined,
  HeartOutlined,
  StarFilled,
  TrophyOutlined,
  FireOutlined,
  AppstoreOutlined,
  UnorderedListOutlined,
  SortAscendingOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

interface Product {
  id: number;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  vendor: string;
  vendorId: number;
  category: string;
  badge?: string;
  inStock: boolean;
  createdAt: string;
  sales: number;
}

const mockProducts: Product[] = [
  {
    id: 1,
    name: 'Wireless Bluetooth Headphones Pro',
    image: 'https://via.placeholder.com/300?text=Headphones',
    price: 89.99,
    originalPrice: 129.99,
    rating: 4.8,
    reviews: 1245,
    vendor: 'AudioTech Solutions',
    vendorId: 1,
    category: 'Electronics',
    badge: 'Best Seller',
    inStock: true,
    createdAt: '2024-11-01',
    sales: 3456,
  },
  {
    id: 2,
    name: 'Smart Watch Fitness Tracker',
    image: 'https://via.placeholder.com/300?text=SmartWatch',
    price: 149.99,
    rating: 4.6,
    reviews: 892,
    vendor: 'TechWear Inc',
    vendorId: 2,
    category: 'Electronics',
    badge: 'New Arrival',
    inStock: true,
    createdAt: '2024-11-03',
    sales: 678,
  },
  {
    id: 3,
    name: 'Mechanical Gaming Keyboard RGB',
    image: 'https://via.placeholder.com/300?text=Keyboard',
    price: 79.99,
    originalPrice: 99.99,
    rating: 4.9,
    reviews: 2341,
    vendor: 'GameKeys Pro',
    vendorId: 3,
    category: 'Accessories',
    badge: 'Trending',
    inStock: true,
    createdAt: '2024-10-28',
    sales: 5678,
  },
  {
    id: 4,
    name: 'Wireless Gaming Mouse',
    image: 'https://via.placeholder.com/300?text=Mouse',
    price: 49.99,
    rating: 4.5,
    reviews: 567,
    vendor: 'ClickMaster',
    vendorId: 4,
    category: 'Accessories',
    inStock: false,
    createdAt: '2024-10-15',
    sales: 1234,
  },
  {
    id: 5,
    name: 'USB-C Hub 7-in-1',
    image: 'https://via.placeholder.com/300?text=Hub',
    price: 34.99,
    rating: 4.4,
    reviews: 423,
    vendor: 'ConnectPlus',
    vendorId: 5,
    category: 'Accessories',
    badge: 'Deal',
    inStock: true,
    createdAt: '2024-10-20',
    sales: 2890,
  },
  {
    id: 6,
    name: 'Portable Bluetooth Speaker',
    image: 'https://via.placeholder.com/300?text=Speaker',
    price: 59.99,
    originalPrice: 79.99,
    rating: 4.7,
    reviews: 1567,
    vendor: 'SoundWave',
    vendorId: 6,
    category: 'Electronics',
    badge: 'Best Seller',
    inStock: true,
    createdAt: '2024-10-25',
    sales: 4321,
  },
  {
    id: 7,
    name: '4K Webcam with Auto-Focus',
    image: 'https://via.placeholder.com/300?text=Webcam',
    price: 89.99,
    rating: 4.3,
    reviews: 234,
    vendor: 'VisionTech',
    vendorId: 7,
    category: 'Electronics',
    inStock: true,
    createdAt: '2024-11-02',
    sales: 456,
  },
  {
    id: 8,
    name: 'Laptop Stand Aluminum',
    image: 'https://via.placeholder.com/300?text=Stand',
    price: 29.99,
    rating: 4.6,
    reviews: 789,
    vendor: 'DeskPro',
    vendorId: 8,
    category: 'Accessories',
    badge: 'Popular',
    inStock: true,
    createdAt: '2024-10-18',
    sales: 3210,
  },
];

type SortOption = 'featured' | 'price-low' | 'price-high' | 'rating' | 'newest' | 'best-seller' | 'popular';
type ViewMode = 'grid' | 'list';

const ProductListingPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [vendorSearch, setVendorSearch] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [minRating, setMinRating] = useState(0);
  const [showInStockOnly, setShowInStockOnly] = useState(false);

  const pageSize = 8;

  // Sorting logic
  const sortProducts = (prods: Product[], sortOption: SortOption): Product[] => {
    const sorted = [...prods];
    switch (sortOption) {
      case 'price-low':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-high':
        return sorted.sort((a, b) => b.price - a.price);
      case 'rating':
        return sorted.sort((a, b) => b.rating - a.rating);
      case 'newest':
        return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case 'best-seller':
        return sorted.sort((a, b) => b.sales - a.sales);
      case 'popular':
        return sorted.sort((a, b) => b.reviews - a.reviews);
      case 'featured':
      default:
        return sorted;
    }
  };

  // Filter logic
  const getFilteredProducts = (): Product[] => {
    let filtered = [...products];

    // Vendor search
    if (vendorSearch) {
      filtered = filtered.filter(p =>
        p.vendor.toLowerCase().includes(vendorSearch.toLowerCase())
      );
    }

    // Price range
    filtered = filtered.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Categories
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(p => selectedCategories.includes(p.category));
    }

    // Rating
    if (minRating > 0) {
      filtered = filtered.filter(p => p.rating >= minRating);
    }

    // Stock
    if (showInStockOnly) {
      filtered = filtered.filter(p => p.inStock);
    }

    return sortProducts(filtered, sortBy);
  };

  const filteredProducts = getFilteredProducts();
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, category]);
    } else {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    }
  };

  const getBadgeColor = (badge?: string) => {
    switch (badge) {
      case 'Best Seller':
        return 'gold';
      case 'Trending':
        return 'orange';
      case 'New Arrival':
        return 'blue';
      case 'Deal':
        return 'red';
      case 'Popular':
        return 'green';
      default:
        return 'default';
    }
  };

  const getBadgeIcon = (badge?: string) => {
    switch (badge) {
      case 'Best Seller':
        return <TrophyOutlined />;
      case 'Trending':
        return <FireOutlined />;
      case 'New Arrival':
        return <StarFilled />;
      default:
        return null;
    }
  };

  const renderProductCard = (product: Product) => {
    if (viewMode === 'list') {
      return (
        <Card
          key={product.id}
          hoverable
          style={{ marginBottom: 16 }}
        >
          <Row gutter={16} align="middle">
            <Col xs={24} sm={6}>
              <div style={{ position: 'relative' }}>
                <Image
                  src={product.image}
                  alt={product.name}
                  preview={false}
                  style={{ width: '100%', height: 150, objectFit: 'cover' }}
                />
                {product.badge && (
                  <div style={{ position: 'absolute', top: 8, left: 8 }}>
                    <Tag color={getBadgeColor(product.badge)} icon={getBadgeIcon(product.badge)}>
                      {product.badge}
                    </Tag>
                  </div>
                )}
                {!product.inStock && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'rgba(0, 0, 0, 0.5)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 600,
                    }}
                  >
                    Out of Stock
                  </div>
                )}
              </div>
            </Col>
            <Col xs={24} sm={12}>
              <Title level={5} style={{ marginBottom: 8 }}>
                {product.name}
              </Title>
              <div style={{ marginBottom: 8 }}>
                <Rate disabled value={product.rating} style={{ fontSize: 14 }} />
                <Text type="secondary" style={{ marginLeft: 8 }}>
                  {product.rating} ({product.reviews} reviews)
                </Text>
              </div>
              <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>
                Sold by: <Text strong>{product.vendor}</Text>
              </Text>
              <Text type="secondary" style={{ fontSize: 12 }}>
                {product.category} • {product.sales.toLocaleString()} sold
              </Text>
            </Col>
            <Col xs={24} sm={6} style={{ textAlign: 'right' }}>
              <div style={{ marginBottom: 16 }}>
                <div>
                  <Text strong style={{ fontSize: 24, color: '#ff9900' }}>
                    ${product.price}
                  </Text>
                </div>
                {product.originalPrice && (
                  <div>
                    <Text delete type="secondary">
                      ${product.originalPrice}
                    </Text>
                    <Tag color="red" style={{ marginLeft: 8 }}>
                      {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                    </Tag>
                  </div>
                )}
              </div>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Button
                  type="primary"
                  icon={<ShoppingCartOutlined />}
                  block
                  disabled={!product.inStock}
                >
                  Add to Cart
                </Button>
                <Button icon={<HeartOutlined />} block>
                  Wishlist
                </Button>
              </Space>
            </Col>
          </Row>
        </Card>
      );
    }

    // Grid view
    return (
      <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
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
              {product.badge && (
                <div style={{ position: 'absolute', top: 8, left: 8 }}>
                  <Tag color={getBadgeColor(product.badge)} icon={getBadgeIcon(product.badge)}>
                    {product.badge}
                  </Tag>
                </div>
              )}
              {!product.inStock && (
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: 18,
                    fontWeight: 600,
                  }}
                >
                  Out of Stock
                </div>
              )}
            </div>
          }
        >
          <div style={{ minHeight: 220 }}>
            <Tooltip title={product.name}>
              <Title level={5} ellipsis={{ rows: 2 }} style={{ height: 48, marginBottom: 8 }}>
                {product.name}
              </Title>
            </Tooltip>

            <div style={{ marginBottom: 8 }}>
              <Rate disabled value={product.rating} style={{ fontSize: 14 }} />
              <Text type="secondary" style={{ marginLeft: 8, fontSize: 12 }}>
                ({product.reviews})
              </Text>
            </div>

            <Text type="secondary" style={{ display: 'block', marginBottom: 8, fontSize: 12 }}>
              by <Text strong>{product.vendor}</Text>
            </Text>

            <div style={{ marginBottom: 12 }}>
              <Text strong style={{ fontSize: 20, color: '#ff9900' }}>
                ${product.price}
              </Text>
              {product.originalPrice && (
                <Text delete type="secondary" style={{ marginLeft: 8, fontSize: 14 }}>
                  ${product.originalPrice}
                </Text>
              )}
            </div>

            <Space size="small" style={{ width: '100%' }}>
              <Button
                type="primary"
                size="small"
                icon={<ShoppingCartOutlined />}
                disabled={!product.inStock}
                style={{ flex: 1 }}
              >
                Add
              </Button>
              <Button size="small" icon={<HeartOutlined />} />
            </Space>
          </div>
        </Card>
      </Col>
    );
  };

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <Row gutter={24}>
        {/* Filters Sidebar */}
        <Col xs={24} lg={6}>
          <Card title={<><FilterOutlined /> Filters</>} style={{ marginBottom: 16 }}>
            {/* Vendor Search */}
            <div style={{ marginBottom: 16 }}>
              <Text strong>Search by Vendor</Text>
              <Input
                placeholder="Enter vendor name..."
                prefix={<SearchOutlined />}
                value={vendorSearch}
                onChange={e => setVendorSearch(e.target.value)}
                allowClear
                style={{ marginTop: 8 }}
              />
            </div>

            <Divider />

            {/* Price Range */}
            <div style={{ marginBottom: 16 }}>
              <Text strong>Price Range</Text>
              <Slider
                range
                min={0}
                max={200}
                value={priceRange}
                onChange={(value) => setPriceRange(value as [number, number])}
                tooltip={{ formatter: (value) => `$${value}` }}
                style={{ marginTop: 16 }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                <Text type="secondary">${priceRange[0]}</Text>
                <Text type="secondary">${priceRange[1]}</Text>
              </div>
            </div>

            <Divider />

            {/* Categories */}
            <div style={{ marginBottom: 16 }}>
              <Text strong>Categories</Text>
              <div style={{ marginTop: 8 }}>
                <Checkbox
                  checked={selectedCategories.includes('Electronics')}
                  onChange={e => handleCategoryChange('Electronics', e.target.checked)}
                >
                  Electronics
                </Checkbox>
                <br />
                <Checkbox
                  checked={selectedCategories.includes('Accessories')}
                  onChange={e => handleCategoryChange('Accessories', e.target.checked)}
                  style={{ marginTop: 8 }}
                >
                  Accessories
                </Checkbox>
              </div>
            </div>

            <Divider />

            {/* Rating */}
            <div style={{ marginBottom: 16 }}>
              <Text strong>Minimum Rating</Text>
              <div style={{ marginTop: 8 }}>
                <Rate value={minRating} onChange={setMinRating} />
              </div>
            </div>

            <Divider />

            {/* Stock */}
            <Checkbox
              checked={showInStockOnly}
              onChange={e => setShowInStockOnly(e.target.checked)}
            >
              In Stock Only
            </Checkbox>
          </Card>
        </Col>

        {/* Products Grid */}
        <Col xs={24} lg={18}>
          <Card>
            {/* Toolbar */}
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
              <div>
                <Text strong>{filteredProducts.length} Products</Text>
              </div>

              <Space>
                <Select
                  value={sortBy}
                  onChange={setSortBy}
                  style={{ width: 200 }}
                  suffixIcon={<SortAscendingOutlined />}
                >
                  <Option value="featured">Featured</Option>
                  <Option value="newest">Newest Arrivals</Option>
                  <Option value="best-seller">Best Sellers</Option>
                  <Option value="popular">Most Popular</Option>
                  <Option value="rating">Highest Rated</Option>
                  <Option value="price-low">Price: Low to High</Option>
                  <Option value="price-high">Price: High to Low</Option>
                </Select>

                <Button.Group>
                  <Button
                    type={viewMode === 'grid' ? 'primary' : 'default'}
                    icon={<AppstoreOutlined />}
                    onClick={() => setViewMode('grid')}
                  />
                  <Button
                    type={viewMode === 'list' ? 'primary' : 'default'}
                    icon={<UnorderedListOutlined />}
                    onClick={() => setViewMode('list')}
                  />
                </Button.Group>
              </Space>
            </div>

            {/* Products */}
            {paginatedProducts.length === 0 ? (
              <Empty description="No products found" />
            ) : viewMode === 'list' ? (
              <div>
                {paginatedProducts.map(product => renderProductCard(product))}
              </div>
            ) : (
              <Row gutter={[16, 16]}>
                {paginatedProducts.map(product => renderProductCard(product))}
              </Row>
            )}

            {/* Pagination */}
            {filteredProducts.length > pageSize && (
              <div style={{ marginTop: 24, textAlign: 'center' }}>
                <Pagination
                  current={currentPage}
                  total={filteredProducts.length}
                  pageSize={pageSize}
                  onChange={setCurrentPage}
                  showSizeChanger={false}
                  showTotal={(total) => `Total ${total} products`}
                />
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ProductListingPage;
