import { Row, Col, Card, Input, Select, Slider, Checkbox, Pagination, Spin, message } from 'antd';
import { AppstoreOutlined, BarsOutlined, HeartOutlined, ShoppingCartOutlined, StarFilled } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { useNavigate } from 'umi';
import { productAPI } from '@/services/api/products';
import type { Product, ProductFilters as APIProductFilters } from '@/services/api/products';

const { Search } = Input;

interface ProductFilters extends APIProductFilters {
  page: number;
  limit: number;
}

const ProductsPage = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState<ProductFilters>({
    page: 1,
    limit: 20,
    sortBy: 'createdAt',
    sortOrder: 'DESC',
  });

  // Fetch products from API
  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getAll(filters);
      // Response is PaginatedResponse<Product>
      setProducts(response.data);
      setTotal(response.total);
    } catch (error: any) {
      message.error('Failed to load products');
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setFilters({ ...filters, search: value, page: 1 });
  };

  const handlePriceChange = (values: number[]) => {
    setFilters({ ...filters, minPrice: values[0], maxPrice: values[1], page: 1 });
  };

  const handleSortChange = (value: string) => {
    if (value === 'price_low') {
      setFilters({ ...filters, sortBy: 'price', sortOrder: 'ASC', page: 1 });
    } else if (value === 'price_high') {
      setFilters({ ...filters, sortBy: 'price', sortOrder: 'DESC', page: 1 });
    } else {
      setFilters({ ...filters, sortBy: 'createdAt', sortOrder: 'DESC', page: 1 });
    }
  };

  const handlePageChange = (page: number, pageSize?: number) => {
    setFilters({ ...filters, page, limit: pageSize || filters.limit });
  };

  return (
    <div style={{ background: '#f5f5f5', minHeight: '100vh', padding: '24px 0' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 24px' }}>
        <Row gutter={24}>
          {/* Filters Sidebar */}
          <Col xs={24} md={6}>
            <Card title="Filters" style={{ marginBottom: 16 }}>
              <div style={{ marginBottom: 24 }}>
                <h4>Category</h4>
                <Checkbox.Group
                  options={[
                    { label: 'Electronics', value: 'electronics' },
                    { label: 'Fashion', value: 'fashion' },
                    { label: 'Home & Living', value: 'home' },
                  ]}
                  onChange={() => {}}
                />
              </div>

              <div style={{ marginBottom: 24 }}>
                <h4>Price Range</h4>
                <Slider
                  range
                  min={0}
                  max={1000}
                  defaultValue={[0, 500]}
                  onChange={handlePriceChange}
                  onAfterChange={handlePriceChange}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                  <span>$0</span>
                  <span>$1000</span>
                </div>
              </div>

              <div style={{ marginBottom: 24 }}>
                <h4>Brand</h4>
                <Checkbox.Group
                  options={[
                    { label: 'Apple', value: 'apple' },
                    { label: 'Samsung', value: 'samsung' },
                    { label: 'Sony', value: 'sony' },
                  ]}
                  onChange={() => {}}
                />
              </div>

              <div>
                <h4>Rating</h4>
                <Checkbox.Group
                  options={[
                    { label: '⭐⭐⭐⭐⭐ 5 Stars', value: '5' },
                    { label: '⭐⭐⭐⭐ 4 Stars & Up', value: '4' },
                    { label: '⭐⭐⭐ 3 Stars & Up', value: '3' },
                  ]}
                  onChange={() => {}}
                />
              </div>
            </Card>
          </Col>

          {/* Products Grid */}
          <Col xs={24} md={18}>
            <Card>
              <div style={{ marginBottom: 24 }}>
                <Search
                  placeholder="Search products..."
                  allowClear
                  enterButton="Search"
                  size="large"
                  onSearch={handleSearch}
                />
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <div>
                  <span style={{ fontSize: 16, fontWeight: 500 }}>
                    {total} Products Found
                  </span>
                </div>
                <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                  <Select 
                    defaultValue="featured" 
                    style={{ width: 200 }}
                    onChange={handleSortChange}
                  >
                    <Select.Option value="featured">Featured</Select.Option>
                    <Select.Option value="price_low">Price: Low to High</Select.Option>
                    <Select.Option value="price_high">Price: High to Low</Select.Option>
                    <Select.Option value="rating">Customer Rating</Select.Option>
                    <Select.Option value="newest">Newest First</Select.Option>
                  </Select>
                  <div>
                    <AppstoreOutlined 
                      style={{ fontSize: 20, cursor: 'pointer', marginRight: 12, color: viewMode === 'grid' ? '#FF9900' : '#999' }}
                      onClick={() => setViewMode('grid')}
                    />
                    <BarsOutlined 
                      style={{ fontSize: 20, cursor: 'pointer', color: viewMode === 'list' ? '#FF9900' : '#999' }}
                      onClick={() => setViewMode('list')}
                    />
                  </div>
                </div>
              </div>

              <Spin spinning={loading}>
                <Row gutter={[16, 16]}>
                  {products.map(product => (
                    <Col xs={24} sm={12} lg={viewMode === 'grid' ? 8 : 24} key={product.id}>
                      <Card
                        hoverable
                        cover={
                          <div style={{ position: 'relative' }}>
                            <img 
                              alt={product.name} 
                              src={product.images && product.images.length > 0 ? product.images[0] : 'https://via.placeholder.com/300?text=No+Image'} 
                              style={{ height: viewMode === 'grid' ? 280 : 200, objectFit: 'cover', width: '100%' }} 
                            />
                            <div style={{
                              position: 'absolute',
                              top: 12,
                              right: 12,
                              background: 'white',
                              borderRadius: '50%',
                              width: 32,
                              height: 32,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                            }}>
                              <HeartOutlined />
                            </div>
                          </div>
                        }
                        onClick={() => navigate(`/products/${product.id}`)}
                      >
                        <div>
                          <div style={{ marginBottom: 8 }}>
                            <StarFilled style={{ color: '#FF9900', fontSize: 14 }} />
                            <span style={{ marginLeft: 4, fontWeight: 500 }}>{product.rating || 0}</span>
                          </div>
                          <h4 style={{ marginBottom: 8, minHeight: 44 }}>{product.name}</h4>
                          <div>
                            <span style={{ fontSize: 20, fontWeight: 'bold', color: '#B12704' }}>
                              ${product.price}
                            </span>
                          </div>
                          {product.stock && product.stock > 0 ? (
                            <div style={{ color: '#067D62', fontSize: 12, marginTop: 4 }}>
                              In Stock ({product.stock} available)
                            </div>
                          ) : (
                            <div style={{ color: '#B12704', fontSize: 12, marginTop: 4 }}>
                              Out of Stock
                            </div>
                          )}
                        </div>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Spin>

              <div style={{ marginTop: 32, textAlign: 'center' }}>
                <Pagination
                  current={filters.page}
                  pageSize={filters.limit}
                  total={total}
                  showSizeChanger
                  showQuickJumper
                  showTotal={(total) => `Total ${total} items`}
                  onChange={handlePageChange}
                />
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default ProductsPage;
