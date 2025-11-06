import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Slider,
  Checkbox,
  Radio,
  Space,
  Button,
  Tag,
  Divider,
  Collapse,
  Rate,
  Input,
  Badge,
  Empty,
  Select,
  Image,
} from 'antd';
import {
  FilterOutlined,
  SearchOutlined,
  ClearOutlined,
  StarOutlined,
  DollarOutlined,
  TagsOutlined,
  ShoppingOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Panel } = Collapse;

interface FilterState {
  priceRange: [number, number];
  categories: string[];
  brands: string[];
  ratings: number | null;
  features: string[];
  colors: string[];
  sizes: string[];
  availability: string[];
  shipping: string[];
  discount: boolean;
  searchQuery: string;
  sortBy: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  brand: string;
  rating: number;
  reviews: number;
  colors: string[];
  sizes: string[];
  features: string[];
  inStock: boolean;
  freeShipping: boolean;
  image: string;
}

const mockProducts: Product[] = [
  {
    id: 1,
    name: 'Premium Wireless Headphones',
    price: 299.99,
    originalPrice: 399.99,
    category: 'Electronics',
    brand: 'AudioTech',
    rating: 4.8,
    reviews: 1234,
    colors: ['Black', 'Silver', 'White'],
    sizes: ['One Size'],
    features: ['Noise Cancelling', 'Bluetooth 5.0', 'Long Battery'],
    inStock: true,
    freeShipping: true,
    image: 'https://via.placeholder.com/200x200?text=Headphones',
  },
  {
    id: 2,
    name: 'Smart Fitness Watch',
    price: 199.99,
    category: 'Wearables',
    brand: 'FitGear',
    rating: 4.5,
    reviews: 856,
    colors: ['Black', 'Rose Gold'],
    sizes: ['S', 'M', 'L'],
    features: ['Heart Rate Monitor', 'GPS', 'Waterproof'],
    inStock: true,
    freeShipping: false,
    image: 'https://via.placeholder.com/200x200?text=Watch',
  },
  {
    id: 3,
    name: 'Professional Camera Lens',
    price: 799.99,
    category: 'Photography',
    brand: 'LensPro',
    rating: 4.9,
    reviews: 423,
    colors: ['Black'],
    sizes: ['50mm', '85mm'],
    features: ['Image Stabilization', 'Weather Sealed', 'Auto Focus'],
    inStock: false,
    freeShipping: true,
    image: 'https://via.placeholder.com/200x200?text=Lens',
  },
  {
    id: 4,
    name: 'Gaming Mechanical Keyboard',
    price: 149.99,
    originalPrice: 199.99,
    category: 'Electronics',
    brand: 'GameGear',
    rating: 4.7,
    reviews: 2341,
    colors: ['Black', 'White', 'RGB'],
    sizes: ['Full Size', 'TKL'],
    features: ['RGB Lighting', 'Mechanical Switches', 'Programmable'],
    inStock: true,
    freeShipping: true,
    image: 'https://via.placeholder.com/200x200?text=Keyboard',
  },
];

const AdvancedFiltersPage: React.FC = () => {
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 1000],
    categories: [],
    brands: [],
    ratings: null,
    features: [],
    colors: [],
    sizes: [],
    availability: [],
    shipping: [],
    discount: false,
    searchQuery: '',
    sortBy: 'relevance',
  });

  const [activeFiltersCount, setActiveFiltersCount] = useState<number>(0);

  const updateFilter = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    calculateActiveFilters(newFilters);
  };

  const calculateActiveFilters = (currentFilters: FilterState) => {
    let count = 0;
    if (currentFilters.categories.length > 0) count++;
    if (currentFilters.brands.length > 0) count++;
    if (currentFilters.ratings !== null) count++;
    if (currentFilters.features.length > 0) count++;
    if (currentFilters.colors.length > 0) count++;
    if (currentFilters.sizes.length > 0) count++;
    if (currentFilters.availability.length > 0) count++;
    if (currentFilters.shipping.length > 0) count++;
    if (currentFilters.discount) count++;
    if (currentFilters.priceRange[0] !== 0 || currentFilters.priceRange[1] !== 1000) count++;
    setActiveFiltersCount(count);
  };

  const clearAllFilters = () => {
    const resetFilters: FilterState = {
      priceRange: [0, 1000],
      categories: [],
      brands: [],
      ratings: null,
      features: [],
      colors: [],
      sizes: [],
      availability: [],
      shipping: [],
      discount: false,
      searchQuery: '',
      sortBy: 'relevance',
    };
    setFilters(resetFilters);
    setActiveFiltersCount(0);
  };

  const filteredProducts = mockProducts.filter((product) => {
    // Price filter
    if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
      return false;
    }

    // Category filter
    if (filters.categories.length > 0 && !filters.categories.includes(product.category)) {
      return false;
    }

    // Brand filter
    if (filters.brands.length > 0 && !filters.brands.includes(product.brand)) {
      return false;
    }

    // Rating filter
    if (filters.ratings !== null && product.rating < filters.ratings) {
      return false;
    }

    // Features filter
    if (
      filters.features.length > 0 &&
      !filters.features.some((f) => product.features.includes(f))
    ) {
      return false;
    }

    // Colors filter
    if (filters.colors.length > 0 && !filters.colors.some((c) => product.colors.includes(c))) {
      return false;
    }

    // Sizes filter
    if (filters.sizes.length > 0 && !filters.sizes.some((s) => product.sizes.includes(s))) {
      return false;
    }

    // Availability filter
    if (filters.availability.includes('in_stock') && !product.inStock) {
      return false;
    }
    if (filters.availability.includes('out_of_stock') && product.inStock) {
      return false;
    }

    // Shipping filter
    if (filters.shipping.includes('free_shipping') && !product.freeShipping) {
      return false;
    }

    // Discount filter
    if (filters.discount && !product.originalPrice) {
      return false;
    }

    // Search query
    if (
      filters.searchQuery &&
      !product.name.toLowerCase().includes(filters.searchQuery.toLowerCase())
    ) {
      return false;
    }

    return true;
  });

  const categories = Array.from(new Set(mockProducts.map((p) => p.category)));
  const brands = Array.from(new Set(mockProducts.map((p) => p.brand)));
  const allFeatures = Array.from(new Set(mockProducts.flatMap((p) => p.features)));
  const allColors = Array.from(new Set(mockProducts.flatMap((p) => p.colors)));
  const allSizes = Array.from(new Set(mockProducts.flatMap((p) => p.sizes)));

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={3}>
            <FilterOutlined style={{ color: '#1890ff' }} /> Advanced Product Filters
          </Title>
          <Space>
            <Text type="secondary">{filteredProducts.length} products found</Text>
            {activeFiltersCount > 0 && (
              <Badge count={activeFiltersCount} style={{ backgroundColor: '#1890ff' }}>
                <Tag color="blue">Active Filters</Tag>
              </Badge>
            )}
          </Space>
        </Col>
        <Col>
          <Space>
            <Button icon={<ClearOutlined />} onClick={clearAllFilters}>
              Clear All Filters
            </Button>
          </Space>
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={6}>
          <Card title="Filters" style={{ position: 'sticky', top: 24 }}>
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              <div>
                <Input
                  placeholder="Search products..."
                  prefix={<SearchOutlined />}
                  size="large"
                  value={filters.searchQuery}
                  onChange={(e) => updateFilter('searchQuery', e.target.value)}
                  allowClear
                />
              </div>

              <Divider style={{ margin: '12px 0' }} />

              <Collapse
                defaultActiveKey={['price', 'category', 'brand', 'rating']}
                ghost
                expandIconPosition="end"
              >
                <Panel
                  header={
                    <Space>
                      <DollarOutlined />
                      <Text strong>Price Range</Text>
                    </Space>
                  }
                  key="price"
                >
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Slider
                      range
                      min={0}
                      max={1000}
                      step={10}
                      value={filters.priceRange}
                      onChange={(value) => updateFilter('priceRange', value)}
                      tooltip={{ formatter: (value) => `$${value}` }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Text>${filters.priceRange[0]}</Text>
                      <Text>${filters.priceRange[1]}</Text>
                    </div>
                  </Space>
                </Panel>

                <Panel
                  header={
                    <Space>
                      <TagsOutlined />
                      <Text strong>Category</Text>
                      {filters.categories.length > 0 && (
                        <Badge count={filters.categories.length} />
                      )}
                    </Space>
                  }
                  key="category"
                >
                  <Checkbox.Group
                    value={filters.categories}
                    onChange={(values) => updateFilter('categories', values)}
                  >
                    <Space direction="vertical">
                      {categories.map((cat) => (
                        <Checkbox key={cat} value={cat}>
                          {cat}
                        </Checkbox>
                      ))}
                    </Space>
                  </Checkbox.Group>
                </Panel>

                <Panel
                  header={
                    <Space>
                      <ShoppingOutlined />
                      <Text strong>Brand</Text>
                      {filters.brands.length > 0 && <Badge count={filters.brands.length} />}
                    </Space>
                  }
                  key="brand"
                >
                  <Checkbox.Group
                    value={filters.brands}
                    onChange={(values) => updateFilter('brands', values)}
                  >
                    <Space direction="vertical">
                      {brands.map((brand) => (
                        <Checkbox key={brand} value={brand}>
                          {brand}
                        </Checkbox>
                      ))}
                    </Space>
                  </Checkbox.Group>
                </Panel>

                <Panel
                  header={
                    <Space>
                      <StarOutlined />
                      <Text strong>Rating</Text>
                    </Space>
                  }
                  key="rating"
                >
                  <Radio.Group
                    value={filters.ratings}
                    onChange={(e) => updateFilter('ratings', e.target.value)}
                  >
                    <Space direction="vertical">
                      {[4, 3, 2, 1].map((rating) => (
                        <Radio key={rating} value={rating}>
                          <Rate disabled value={rating} style={{ fontSize: 14 }} /> & Up
                        </Radio>
                      ))}
                      <Radio value={null}>Any Rating</Radio>
                    </Space>
                  </Radio.Group>
                </Panel>

                <Panel
                  header={
                    <Space>
                      <CheckCircleOutlined />
                      <Text strong>Features</Text>
                      {filters.features.length > 0 && <Badge count={filters.features.length} />}
                    </Space>
                  }
                  key="features"
                >
                  <Checkbox.Group
                    value={filters.features}
                    onChange={(values) => updateFilter('features', values)}
                  >
                    <Space direction="vertical">
                      {allFeatures.map((feature) => (
                        <Checkbox key={feature} value={feature}>
                          {feature}
                        </Checkbox>
                      ))}
                    </Space>
                  </Checkbox.Group>
                </Panel>

                <Panel
                  header={
                    <Space>
                      <span>🎨</span>
                      <Text strong>Color</Text>
                      {filters.colors.length > 0 && <Badge count={filters.colors.length} />}
                    </Space>
                  }
                  key="color"
                >
                  <Checkbox.Group
                    value={filters.colors}
                    onChange={(values) => updateFilter('colors', values)}
                  >
                    <Space direction="vertical">
                      {allColors.map((color) => (
                        <Checkbox key={color} value={color}>
                          <Space>
                            <div
                              style={{
                                width: 16,
                                height: 16,
                                borderRadius: '50%',
                                background: color.toLowerCase(),
                                border: '1px solid #d9d9d9',
                              }}
                            />
                            {color}
                          </Space>
                        </Checkbox>
                      ))}
                    </Space>
                  </Checkbox.Group>
                </Panel>

                <Panel
                  header={
                    <Space>
                      <span>📏</span>
                      <Text strong>Size</Text>
                      {filters.sizes.length > 0 && <Badge count={filters.sizes.length} />}
                    </Space>
                  }
                  key="size"
                >
                  <Checkbox.Group
                    value={filters.sizes}
                    onChange={(values) => updateFilter('sizes', values)}
                  >
                    <Space direction="vertical">
                      {allSizes.map((size) => (
                        <Checkbox key={size} value={size}>
                          {size}
                        </Checkbox>
                      ))}
                    </Space>
                  </Checkbox.Group>
                </Panel>

                <Panel
                  header={
                    <Space>
                      <span>📦</span>
                      <Text strong>Availability</Text>
                    </Space>
                  }
                  key="availability"
                >
                  <Checkbox.Group
                    value={filters.availability}
                    onChange={(values) => updateFilter('availability', values)}
                  >
                    <Space direction="vertical">
                      <Checkbox value="in_stock">In Stock</Checkbox>
                      <Checkbox value="out_of_stock">Out of Stock</Checkbox>
                    </Space>
                  </Checkbox.Group>
                </Panel>

                <Panel
                  header={
                    <Space>
                      <span>🚚</span>
                      <Text strong>Shipping</Text>
                    </Space>
                  }
                  key="shipping"
                >
                  <Checkbox.Group
                    value={filters.shipping}
                    onChange={(values) => updateFilter('shipping', values)}
                  >
                    <Space direction="vertical">
                      <Checkbox value="free_shipping">Free Shipping</Checkbox>
                    </Space>
                  </Checkbox.Group>
                </Panel>
              </Collapse>

              <Checkbox
                checked={filters.discount}
                onChange={(e) => updateFilter('discount', e.target.checked)}
              >
                <Text strong>Discounted Items Only</Text>
              </Checkbox>
            </Space>
          </Card>
        </Col>

        <Col xs={24} lg={18}>
          <Card
            title={`Results (${filteredProducts.length})`}
            extra={
              <Select
                value={filters.sortBy}
                onChange={(value) => updateFilter('sortBy', value)}
                style={{ width: 200 }}
              >
                <Select.Option value="relevance">Most Relevant</Select.Option>
                <Select.Option value="price_low">Price: Low to High</Select.Option>
                <Select.Option value="price_high">Price: High to Low</Select.Option>
                <Select.Option value="rating">Highest Rated</Select.Option>
                <Select.Option value="reviews">Most Reviewed</Select.Option>
              </Select>
            }
          >
            {filteredProducts.length === 0 ? (
              <Empty description="No products match your filters" />
            ) : (
              <Row gutter={[16, 16]}>
                {filteredProducts.map((product) => (
                  <Col xs={24} sm={12} lg={8} key={product.id}>
                    <Card hoverable>
                      <div style={{ position: 'relative' }}>
                        <Image
                          src={product.image}
                          alt={product.name}
                          preview={false}
                          style={{ marginBottom: 12 }}
                        />
                        {product.originalPrice && (
                          <Tag color="red" style={{ position: 'absolute', top: 8, left: 8 }}>
                            {Math.round(
                              ((product.originalPrice - product.price) / product.originalPrice) *
                                100
                            )}
                            % OFF
                          </Tag>
                        )}
                        {!product.inStock && (
                          <Tag color="default" style={{ position: 'absolute', top: 8, right: 8 }}>
                            Out of Stock
                          </Tag>
                        )}
                      </div>

                      <Title level={5} ellipsis={{ rows: 2 }} style={{ minHeight: 48 }}>
                        {product.name}
                      </Title>

                      <div style={{ marginBottom: 8 }}>
                        <Rate disabled value={product.rating} style={{ fontSize: 12 }} />
                        <Text type="secondary" style={{ marginLeft: 8, fontSize: 12 }}>
                          ({product.reviews})
                        </Text>
                      </div>

                      <div style={{ marginBottom: 12 }}>
                        <Text strong style={{ fontSize: 20, color: '#1890ff' }}>
                          ${product.price.toFixed(2)}
                        </Text>
                        {product.originalPrice && (
                          <Text delete type="secondary" style={{ marginLeft: 8 }}>
                            ${product.originalPrice.toFixed(2)}
                          </Text>
                        )}
                      </div>

                      <Space wrap>
                        {product.freeShipping && (
                          <Tag color="green" icon={<CheckCircleOutlined />}>
                            Free Shipping
                          </Tag>
                        )}
                        {product.features.slice(0, 1).map((feature) => (
                          <Tag key={feature}>{feature}</Tag>
                        ))}
                      </Space>
                    </Card>
                  </Col>
                ))}
              </Row>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdvancedFiltersPage;
