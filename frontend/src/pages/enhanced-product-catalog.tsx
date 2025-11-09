import React, { useState, useEffect, useCallback } from 'react';
import {
  Row,
  Col,
  Typography,
  Space,
  Button,
  Pagination,
  FloatButton,
  Badge,
  Modal,
  Drawer,
  Card,
  Statistic,
  BackTop,
} from 'antd';
import {
  FilterOutlined,
  SwapOutlined,
  HeartOutlined,
  AppstoreOutlined,
  UnorderedListOutlined,
  ShoppingCartOutlined,
  UpOutlined,
} from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';
import AdvancedProductSearch from '@/components/product/AdvancedProductSearch';
import EnhancedProductGrid from '@/components/product/EnhancedProductGrid';
import ProductComparison from '@/components/product/ProductComparison';
import ProductRecommendations from '@/components/product/ProductRecommendations';
import { enhancedProductAPI, type AdvancedSearchFilters, type ProductSearchResponse, type EnhancedProduct } from '@/services/api/enhanced-product';
import { useProductComparisonStore } from '@/store/productComparisonStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useCartStore } from '@/store/cartStore';
import { useErrorStore } from '@/store/error';

const { Title, Text } = Typography;

const EnhancedProductCatalog: React.FC = () => {
  const { useApiOperation } = useErrorStore();
  const { products: comparisonProducts } = useProductComparisonStore();
  const { items: wishlistItems } = useWishlistStore();
  const { itemCount } = useCartStore();

  // State management
  const [searchResults, setSearchResults] = useState<ProductSearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentFilters, setCurrentFilters] = useState<AdvancedSearchFilters>({});
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<EnhancedProduct | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  // Search products with advanced filters
  const searchProducts = useApiOperation(
    useCallback(async (filters: AdvancedSearchFilters) => {
      setLoading(true);
      try {
        const searchFilters = {
          ...filters,
          page: filters.page || currentPage,
          limit: pageSize,
        };
        
        const response = await enhancedProductAPI.searchProducts(searchFilters);
        setSearchResults(response);
        
        // Track search analytics
        if (filters.query) {
          // Track search query for analytics
          console.log('Search performed:', filters.query);
        }
      } finally {
        setLoading(false);
      }
    }, [currentPage, pageSize]),
    { showErrorMessage: true }
  );

  // Initial load
  useEffect(() => {
    searchProducts({ page: 1, limit: pageSize });
  }, []);

  // Handle filter changes
  const handleFiltersChange = useCallback((filters: AdvancedSearchFilters) => {
    setCurrentFilters(filters);
    setCurrentPage(1);
    setSelectedProducts([]);
    searchProducts({ ...filters, page: 1 });
  }, [searchProducts]);

  // Handle pagination
  const handlePageChange = (page: number, size?: number) => {
    setCurrentPage(page);
    if (size && size !== pageSize) {
      setPageSize(size);
    }
    searchProducts({ ...currentFilters, page, limit: size || pageSize });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle product selection for comparison
  const handleProductSelect = (productId: string, selected: boolean) => {
    if (selected) {
      setSelectedProducts(prev => [...prev, productId]);
    } else {
      setSelectedProducts(prev => prev.filter(id => id !== productId));
    }
  };

  // Handle product view
  const handleProductView = useApiOperation(
    useCallback(async (productId: string) => {
      try {
        const product = await enhancedProductAPI.getProduct(productId);
        setQuickViewProduct(product);
        
        // Track product view
        await enhancedProductAPI.trackProductView(productId);
      } catch (error) {
        // Navigate to product page as fallback
        window.location.href = `/products/${productId}`;
      }
    }, []),
    { showErrorMessage: false }
  );

  // Toggle comparison mode
  const toggleComparisonMode = () => {
    setShowComparison(!showComparison);
    setSelectedProducts([]);
  };

  // Get recommendation context based on current search
  const getRecommendationContext = () => ({
    searchQuery: currentFilters.query,
    categoryId: currentFilters.categoryId,
    behaviorContext: {
      recentlyViewed: [], // This would come from user's session
      searchHistory: currentFilters.query ? [currentFilters.query] : [],
    },
    limit: 12,
  });

  const products = searchResults?.products || [];
  const totalProducts = searchResults?.total || 0;
  const facets = searchResults?.facets;

  return (
    <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      {/* Header Section */}
      <div style={{ backgroundColor: 'white', padding: '24px 0', borderBottom: '1px solid #f0f0f0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <Row justify="space-between" align="middle">
            <Col>
              <Space direction="vertical" size="small">
                <Title level={1} style={{ margin: 0, fontSize: '2rem' }}>
                  Product Catalog
                </Title>
                <Text type="secondary" style={{ fontSize: '16px' }}>
                  Discover amazing products with advanced search and filtering
                </Text>
              </Space>
            </Col>
            
            <Col>
              <Space size="large">
                <Statistic
                  title="Products"
                  value={totalProducts}
                  prefix={<AppstoreOutlined />}
                />
                <Statistic
                  title="In Wishlist"
                  value={wishlistItems.length}
                  prefix={<HeartOutlined />}
                />
                <Statistic
                  title="In Cart"
                  value={itemCount}
                  prefix={<ShoppingCartOutlined />}
                />
              </Space>
            </Col>
          </Row>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>
        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <AdvancedProductSearch
            onFiltersChange={handleFiltersChange}
            onViewModeChange={setViewMode}
            loading={loading}
            totalProducts={totalProducts}
            initialFilters={currentFilters}
          />
        </motion.div>

        {/* Main Content */}
        <Row gutter={[24, 24]}>
          <Col span={24}>
            {/* Action Bar */}
            <Card size="small" style={{ marginBottom: 16 }}>
              <Row justify="space-between" align="middle">
                <Col>
                  <Space>
                    <Button
                      icon={<FilterOutlined />}
                      onClick={() => setShowMobileFilters(true)}
                      style={{ display: 'none' }} // Hidden on desktop, shown on mobile via media queries
                    >
                      Filters
                    </Button>
                    
                    {showComparison && selectedProducts.length > 0 && (
                      <Badge count={selectedProducts.length}>
                        <Button
                          type="primary"
                          icon={<SwapOutlined />}
                          onClick={() => setShowComparison(true)}
                        >
                          Compare Selected
                        </Button>
                      </Badge>
                    )}
                    
                    <Button
                      type={showComparison ? 'primary' : 'default'}
                      icon={<SwapOutlined />}
                      onClick={toggleComparisonMode}
                    >
                      {showComparison ? 'Exit Compare' : 'Compare Mode'}
                    </Button>
                  </Space>
                </Col>
                
                <Col>
                  <Space>
                    <Text type="secondary">
                      Showing {products.length} of {totalProducts.toLocaleString()} products
                    </Text>
                    
                    <Button.Group>
                      <Button
                        icon={<AppstoreOutlined />}
                        type={viewMode === 'grid' ? 'primary' : 'default'}
                        onClick={() => setViewMode('grid')}
                      />
                      <Button
                        icon={<UnorderedListOutlined />}
                        type={viewMode === 'list' ? 'primary' : 'default'}
                        onClick={() => setViewMode('list')}
                      />
                    </Button.Group>
                  </Space>
                </Col>
              </Row>
            </Card>

            {/* Product Grid */}
            <motion.div
              layout
              transition={{ duration: 0.3 }}
            >
              <EnhancedProductGrid
                products={products}
                loading={loading}
                viewMode={viewMode}
                showComparison={showComparison}
                selectedProducts={selectedProducts}
                onProductSelect={handleProductSelect}
                onProductView={handleProductView}
              />
            </motion.div>

            {/* Pagination */}
            {totalProducts > pageSize && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                style={{ textAlign: 'center', marginTop: 32 }}
              >
                <Pagination
                  current={currentPage}
                  total={totalProducts}
                  pageSize={pageSize}
                  onChange={handlePageChange}
                  onShowSizeChange={handlePageChange}
                  showSizeChanger
                  showQuickJumper
                  showTotal={(total, range) => 
                    `${range[0]}-${range[1]} of ${total} products`
                  }
                  pageSizeOptions={['12', '20', '40', '60']}
                  style={{
                    backgroundColor: 'white',
                    padding: '16px',
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  }}
                />
              </motion.div>
            )}

            {/* Recommendations Section */}
            {!loading && products.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                style={{ marginTop: 48 }}
              >
                <ProductRecommendations
                  context={getRecommendationContext()}
                  title="You Might Also Like"
                  showTabs={true}
                  maxItems={12}
                  columns={6}
                />
              </motion.div>
            )}
          </Col>
        </Row>

        {/* Product Comparison Modal */}
        <ProductComparison
          visible={showComparison && comparisonProducts.length > 0}
          onClose={() => setShowComparison(false)}
        />

        {/* Quick View Modal */}
        <Modal
          title={quickViewProduct?.name}
          open={!!quickViewProduct}
          onCancel={() => setQuickViewProduct(null)}
          footer={null}
          width={900}
          style={{ top: 20 }}
        >
          {quickViewProduct && (
            <Row gutter={24}>
              <Col span={12}>
                <div style={{ textAlign: 'center' }}>
                  <img
                    src={quickViewProduct.images[0]?.url || '/placeholder.png'}
                    alt={quickViewProduct.name}
                    style={{
                      width: '100%',
                      maxWidth: 400,
                      height: 400,
                      objectFit: 'cover',
                      borderRadius: 8,
                    }}
                  />
                </div>
              </Col>
              <Col span={12}>
                <Space direction="vertical" style={{ width: '100%' }} size="middle">
                  <div>
                    <Title level={2} style={{ margin: 0 }}>
                      {quickViewProduct.name}
                    </Title>
                    <Text type="secondary" style={{ fontSize: 16 }}>
                      {quickViewProduct.brand.name}
                    </Text>
                  </div>
                  
                  <div>
                    <Text strong style={{ fontSize: 24, color: '#f5222d' }}>
                      ${quickViewProduct.price.toFixed(2)}
                    </Text>
                    {quickViewProduct.comparePrice && quickViewProduct.comparePrice > quickViewProduct.price && (
                      <Text delete type="secondary" style={{ fontSize: 18, marginLeft: 8 }}>
                        ${quickViewProduct.comparePrice.toFixed(2)}
                      </Text>
                    )}
                  </div>
                  
                  <Text>{quickViewProduct.shortDescription || quickViewProduct.description}</Text>
                  
                  <Button
                    type="primary"
                    size="large"
                    block
                    onClick={() => {
                      window.location.href = `/products/${quickViewProduct.slug}`;
                    }}
                  >
                    View Full Details
                  </Button>
                </Space>
              </Col>
            </Row>
          )}
        </Modal>

        {/* Mobile Filters Drawer */}
        <Drawer
          title="Product Filters"
          placement="left"
          onClose={() => setShowMobileFilters(false)}
          open={showMobileFilters}
          width={320}
        >
          <AdvancedProductSearch
            onFiltersChange={(filters) => {
              handleFiltersChange(filters);
              setShowMobileFilters(false);
            }}
            onViewModeChange={setViewMode}
            loading={loading}
            totalProducts={totalProducts}
            initialFilters={currentFilters}
          />
        </Drawer>

        {/* Floating Action Buttons */}
        <FloatButton.Group
          trigger="hover"
          type="primary"
          style={{ right: 24, bottom: 24 }}
          icon={<AppstoreOutlined />}
        >
          {comparisonProducts.length > 0 && (
            <FloatButton
              icon={<SwapOutlined />}
              tooltip="View Comparison"
              badge={{ count: comparisonProducts.length }}
              onClick={() => setShowComparison(true)}
            />
          )}
          
          <FloatButton
            icon={<HeartOutlined />}
            tooltip="Wishlist"
            badge={{ count: wishlistItems.length }}
            onClick={() => window.location.href = '/wishlist'}
          />
          
          <FloatButton
            icon={<FilterOutlined />}
            tooltip="Filters"
            onClick={() => setShowMobileFilters(true)}
          />
        </FloatButton.Group>

        {/* Back to Top */}
        <BackTop>
          <div style={{
            height: 40,
            width: 40,
            lineHeight: '40px',
            borderRadius: 4,
            backgroundColor: '#1890ff',
            color: '#fff',
            textAlign: 'center',
            fontSize: 14,
          }}>
            <UpOutlined />
          </div>
        </BackTop>
      </div>

      {/* Mobile Styles */}
      <style jsx global>{`
        @media (max-width: 768px) {
          .ant-btn[data-mobile-filter] {
            display: inline-block !important;
          }
        }
      `}</style>
    </div>
  );
};

export default EnhancedProductCatalog;