import React, { useState, useEffect } from 'react';
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
  Spin,
  message,
} from 'antd';
import {
  SearchOutlined,
  FilterOutlined,
  ShoppingCartOutlined,
  HeartOutlined,
  AppstoreOutlined,
  SortAscendingOutlined,
} from '@ant-design/icons';
import { productAPI, wishlistAPI, Product as APIProduct } from '@/services/api';

const { Title, Text } = Typography;
const { Option } = Select;

type SortOption = 'featured' | 'price-low' | 'price-high' | 'rating' | 'newest' | 'best-seller' | 'popular';

const ProductListingPage: React.FC = () => {
  const [products, setProducts] = useState<APIProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [vendorSearch, setVendorSearch] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [minRating, setMinRating] = useState(0);
  const [showInStockOnly, setShowInStockOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const pageSize = 8;

  useEffect(() => {
    loadProducts();
  }, [currentPage, sortBy, searchQuery]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getAll({
        page: currentPage,
        limit: pageSize,
        search: searchQuery || undefined,
      });
      setProducts(response.data || []);
      setTotalProducts(response.total || 0);
    } catch (error) {
      message.error('Failed to load products');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToWishlist = async (productId: string) => {
    try {
      await wishlistAPI.addItem(productId);
      message.success('Added to wishlist');
    } catch (error) {
      message.error('Failed to add to wishlist');
    }
  };

  // Sorting logic
  const sortProducts = (prods: APIProduct[], sortOption: SortOption): APIProduct[] => {
    const sorted = [...prods];
    switch (sortOption) {
      case 'price-low':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-high':
        return sorted.sort((a, b) => b.price - a.price);
      case 'rating':
        return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case 'newest':
        return sorted.sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime());
      case 'best-seller':
      case 'popular':
        return sorted.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
      case 'featured':
      default:
        return sorted;
    }
  };

  // Filter logic
  const getFilteredProducts = (): APIProduct[] => {
    let filtered = [...products];

    // Vendor search
    if (vendorSearch && filtered.length > 0) {
      filtered = filtered.filter(p =>
        p.vendor?.name?.toLowerCase().includes(vendorSearch.toLowerCase())
      );
    }

    // Price range
    filtered = filtered.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Categories
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(p => p.category && selectedCategories.includes(p.category.name));
    }

    // Rating
    if (minRating > 0) {
      filtered = filtered.filter(p => (p.rating || 0) >= minRating);
    }

    // Stock
    if (showInStockOnly) {
      filtered = filtered.filter(p => (p.stock || 0) > 0);
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

  const renderProductCard = (product: APIProduct) => {
    const productImage = product.images && product.images.length > 0 
      ? product.images[0] 
      : 'https://via.placeholder.com/300?text=Product';

    return (
      <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
        <Card
          hoverable
          cover={
            <div style={{ position: 'relative' }}>
              <Image
                src={productImage}
                alt={product.name}
                preview={false}
                style={{ height: 200, objectFit: 'cover' }}
              />
              {(product.stock || 0) <= 0 && (
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
          <div style={{ minHeight: 180 }}>
            <Tooltip title={product.name}>
              <Title level={5} ellipsis={{ rows: 2 }} style={{ height: 48, marginBottom: 8 }}>
                {product.name}
              </Title>
            </Tooltip>

            <div style={{ marginBottom: 8 }}>
              <Rate disabled value={product.rating || 0} style={{ fontSize: 14 }} />
              <Text type="secondary" style={{ marginLeft: 8, fontSize: 12 }}>
                ({product.reviewCount || 0})
              </Text>
            </div>

            <div style={{ marginBottom: 12 }}>
              <Text strong style={{ fontSize: 20, color: '#ff9900' }}>
                ${product.price.toFixed(2)}
              </Text>
            </div>

            <Space size="small" style={{ width: '100%' }}>
              <Button
                type="primary"
                size="small"
                icon={<ShoppingCartOutlined />}
                disabled={(product.stock || 0) <= 0}
                style={{ flex: 1 }}
              >
                Add
              </Button>
              <Button size="small" icon={<HeartOutlined />} onClick={() => handleAddToWishlist(product.id)} />
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
              </Space>
            </div>

            {/* Products */}
            {paginatedProducts.length === 0 ? (
              <Empty description="No products found" />
            ) : (
              <Row gutter={[16, 16]}>
                {paginatedProducts.map((product: APIProduct) => renderProductCard(product))}
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
