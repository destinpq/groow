import React, { useState, useCallback } from 'react';
import {
  Row,
  Col,
  Card,
  Image,
  Typography,
  Space,
  Button,
  Tag,
  Rate,
  Badge,
  Tooltip,
  Dropdown,
  Menu,
  message,
  Modal,
  Checkbox,
  Divider,
  List,
  Avatar,
  Statistic,
} from 'antd';
import {
  ShoppingCartOutlined,
  HeartOutlined,
  HeartFilled,
  EyeOutlined,
  SwapOutlined,
  ShareAltOutlined,
  StarOutlined,
  FireOutlined,
  ThunderboltOutlined,
  TruckOutlined,
  SafetyCertificateOutlined,
  MoreOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  PercentageOutlined,
  CrownOutlined,
  TrophyOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { type EnhancedProduct } from '@/services/api/enhanced-product';
import { useCartStore } from '@/store/cart';
import { useWishlistStore } from '@/store/wishlist';
import { useProductComparisonStore } from '@/store/productComparison';
import { useErrorStore } from '@/store/error';

const { Text, Title } = Typography;
const { Meta } = Card;

interface EnhancedProductGridProps {
  products: EnhancedProduct[];
  loading?: boolean;
  viewMode?: 'grid' | 'list';
  showComparison?: boolean;
  selectedProducts?: string[];
  onProductSelect?: (productId: string, selected: boolean) => void;
  onProductView?: (productId: string) => void;
  className?: string;
}

interface ProductCardProps {
  product: EnhancedProduct;
  viewMode: 'grid' | 'list';
  isSelected?: boolean;
  showSelection?: boolean;
  onSelect?: (selected: boolean) => void;
  onView?: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  viewMode,
  isSelected,
  showSelection,
  onSelect,
  onView,
}) => {
  const { addItem } = useCartStore();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlistStore();
  const { addProduct: addToComparison, removeProduct: removeFromComparison, products: comparisonProducts } = useProductComparisonStore();
  const { useApiOperation } = useErrorStore();
  const [imageLoading, setImageLoading] = useState(true);

  const inWishlist = isInWishlist(product.id);
  const inComparison = comparisonProducts.some(p => p.id === product.id);

  // Calculate discount percentage
  const discountPercent = product.comparePrice && product.price < product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : product.discount;

  // Handle add to cart
  const handleAddToCart = useApiOperation(
    useCallback(async () => {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0]?.url || '',
        quantity: 1,
      });
      message.success(`Added ${product.name} to cart`);
    }, [product, addItem]),
    { successMessage: false }
  );

  // Handle wishlist toggle
  const handleWishlistToggle = useApiOperation(
    useCallback(async () => {
      if (inWishlist) {
        await removeFromWishlist(product.id);
        message.success('Removed from wishlist');
      } else {
        await addToWishlist(product.id);
        message.success('Added to wishlist');
      }
    }, [product.id, inWishlist, addToWishlist, removeFromWishlist]),
    { successMessage: false }
  );

  // Handle comparison toggle
  const handleComparisonToggle = () => {
    if (inComparison) {
      removeFromComparison(product.id);
      message.success('Removed from comparison');
    } else {
      if (comparisonProducts.length >= 4) {
        message.warning('You can compare up to 4 products at a time');
        return;
      }
      addToComparison(product);
      message.success('Added to comparison');
    }
  };

  // Handle share
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: product.name,
          text: product.shortDescription || product.description,
          url: window.location.origin + `/products/${product.slug}`,
        });
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(window.location.origin + `/products/${product.slug}`);
        message.success('Product link copied to clipboard');
      }
    } catch (error) {
      message.error('Failed to share product');
    }
  };

  // Product badges
  const badges = [];
  if (product.isFeatured) badges.push({ text: 'Featured', color: '#722ed1', icon: <CrownOutlined /> });
  if (product.analytics.trendingScore > 0.8) badges.push({ text: 'Trending', color: '#ff4d4f', icon: <FireOutlined /> });
  if (discountPercent && discountPercent > 0) badges.push({ text: `${discountPercent}% OFF`, color: '#f5222d', icon: <PercentageOutlined /> });
  if (product.vendor.isVerified) badges.push({ text: 'Verified', color: '#52c41a', icon: <SafetyCertificateOutlined /> });
  if (product.inventory.lowStock && product.inventory.inStock) badges.push({ text: 'Low Stock', color: '#fa8c16', icon: <ClockCircleOutlined /> });
  if (!product.inventory.inStock) badges.push({ text: 'Out of Stock', color: '#8c8c8c', icon: <ClockCircleOutlined /> });

  // Quick actions menu
  const quickActionsMenu = (
    <Menu>
      <Menu.Item key="view" icon={<EyeOutlined />} onClick={onView}>
        Quick View
      </Menu.Item>
      <Menu.Item key="compare" icon={<SwapOutlined />} onClick={handleComparisonToggle}>
        {inComparison ? 'Remove from' : 'Add to'} Compare
      </Menu.Item>
      <Menu.Item key="share" icon={<ShareAltOutlined />} onClick={handleShare}>
        Share Product
      </Menu.Item>
    </Menu>
  );

  if (viewMode === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card
          style={{ marginBottom: 16 }}
          bodyStyle={{ padding: 16 }}
          hoverable
        >
          <Row gutter={16} align="middle">
            {showSelection && (
              <Col>
                <Checkbox
                  checked={isSelected}
                  onChange={(e) => onSelect?.(e.target.checked)}
                />
              </Col>
            )}
            
            <Col span={4}>
              <div style={{ position: 'relative' }}>
                <Image
                  src={product.images[0]?.url || '/placeholder.png'}
                  alt={product.name}
                  style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 6 }}
                  placeholder
                  fallback="/placeholder.png"
                />
                
                {/* Badges */}
                <div style={{ position: 'absolute', top: 8, left: 8 }}>
                  {badges.slice(0, 2).map((badge, index) => (
                    <Tag
                      key={index}
                      color={badge.color}
                      style={{ marginBottom: 4, fontSize: '10px', padding: '0 4px' }}
                      icon={badge.icon}
                    >
                      {badge.text}
                    </Tag>
                  ))}
                </div>
              </div>
            </Col>
            
            <Col flex={1}>
              <Space direction="vertical" style={{ width: '100%' }} size="small">
                <div>
                  <Title level={4} style={{ margin: 0, cursor: 'pointer' }} onClick={onView}>
                    {product.name}
                  </Title>
                  <Text type="secondary">{product.brand.name}</Text>
                </div>
                
                <Text ellipsis={{ tooltip: product.shortDescription }}>
                  {product.shortDescription || product.description}
                </Text>
                
                <Space>
                  <Rate disabled value={product.rating.average} allowHalf style={{ fontSize: 14 }} />
                  <Text type="secondary">({product.rating.count})</Text>
                  {product.vendor.isVerified && (
                    <Tooltip title="Verified Vendor">
                      <CheckCircleOutlined style={{ color: '#52c41a' }} />
                    </Tooltip>
                  )}
                </Space>
                
                <Space wrap>
                  {product.tags.slice(0, 3).map(tag => (
                    <Tag key={tag} size="small">{tag}</Tag>
                  ))}
                </Space>
              </Space>
            </Col>
            
            <Col>
              <Space direction="vertical" align="end" size="small">
                <div style={{ textAlign: 'right' }}>
                  <div>
                    <Text strong style={{ fontSize: 18, color: '#f5222d' }}>
                      ${product.price.toFixed(2)}
                    </Text>
                  </div>
                  {product.comparePrice && product.comparePrice > product.price && (
                    <Text delete type="secondary" style={{ fontSize: 14 }}>
                      ${product.comparePrice.toFixed(2)}
                    </Text>
                  )}
                </div>
                
                {product.inventory.inStock && (
                  <Text type="success" style={{ fontSize: 12 }}>
                    <CheckCircleOutlined /> In Stock
                  </Text>
                )}
                
                {product.requiresShipping === false && (
                  <Text style={{ fontSize: 12, color: '#1890ff' }}>
                    <TruckOutlined /> Free Shipping
                  </Text>
                )}
                
                <Space>
                  <Button
                    type="primary"
                    size="small"
                    icon={<ShoppingCartOutlined />}
                    onClick={handleAddToCart}
                    disabled={!product.inventory.inStock}
                  >
                    Add to Cart
                  </Button>
                  
                  <Button
                    type={inWishlist ? 'primary' : 'default'}
                    size="small"
                    icon={inWishlist ? <HeartFilled /> : <HeartOutlined />}
                    onClick={handleWishlistToggle}
                    style={{ color: inWishlist ? '#ff4d4f' : undefined }}
                  />
                  
                  <Dropdown overlay={quickActionsMenu} trigger={['click']}>
                    <Button size="small" icon={<MoreOutlined />} />
                  </Dropdown>
                </Space>
              </Space>
            </Col>
          </Row>
        </Card>
      </motion.div>
    );
  }

  // Grid view
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4 }}
    >
      <Card
        hoverable
        style={{ height: '100%', position: 'relative' }}
        bodyStyle={{ padding: 16 }}
        cover={
          <div style={{ position: 'relative', height: 240, overflow: 'hidden' }}>
            {showSelection && (
              <Checkbox
                checked={isSelected}
                onChange={(e) => onSelect?.(e.target.checked)}
                style={{
                  position: 'absolute',
                  top: 8,
                  left: 8,
                  zIndex: 2,
                  backgroundColor: 'white',
                  borderRadius: 4,
                  padding: 2,
                }}
              />
            )}
            
            <Image
              src={product.images[0]?.url || '/placeholder.png'}
              alt={product.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              placeholder
              fallback="/placeholder.png"
              onLoad={() => setImageLoading(false)}
            />
            
            {/* Badges */}
            <div style={{ position: 'absolute', top: 8, right: 8 }}>
              {badges.slice(0, 2).map((badge, index) => (
                <Tag
                  key={index}
                  color={badge.color}
                  style={{ marginBottom: 4, fontSize: '10px', padding: '0 4px' }}
                  icon={badge.icon}
                >
                  {badge.text}
                </Tag>
              ))}
            </div>
            
            {/* Quick Actions Overlay */}
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                padding: '20px 16px 16px',
                opacity: 0,
                transition: 'opacity 0.3s',
              }}
              className="quick-actions"
            >
              <Space>
                <Tooltip title="Add to Wishlist">
                  <Button
                    type="text"
                    icon={inWishlist ? <HeartFilled /> : <HeartOutlined />}
                    onClick={handleWishlistToggle}
                    style={{ color: inWishlist ? '#ff4d4f' : 'white' }}
                  />
                </Tooltip>
                
                <Tooltip title="Quick View">
                  <Button
                    type="text"
                    icon={<EyeOutlined />}
                    onClick={onView}
                    style={{ color: 'white' }}
                  />
                </Tooltip>
                
                <Tooltip title="Compare">
                  <Button
                    type="text"
                    icon={<SwapOutlined />}
                    onClick={handleComparisonToggle}
                    style={{ color: inComparison ? '#1890ff' : 'white' }}
                  />
                </Tooltip>
                
                <Tooltip title="Share">
                  <Button
                    type="text"
                    icon={<ShareAltOutlined />}
                    onClick={handleShare}
                    style={{ color: 'white' }}
                  />
                </Tooltip>
              </Space>
            </div>
          </div>
        }
      >
        <Meta
          title={
            <Tooltip title={product.name}>
              <div
                style={{ cursor: 'pointer' }}
                onClick={onView}
              >
                <Text strong ellipsis style={{ fontSize: 14 }}>
                  {product.name}
                </Text>
              </div>
            </Tooltip>
          }
          description={
            <Space direction="vertical" size="small" style={{ width: '100%' }}>
              <Text type="secondary" style={{ fontSize: 12 }}>
                {product.brand.name}
              </Text>
              
              <Space align="center">
                <Rate disabled value={product.rating.average} allowHalf style={{ fontSize: 12 }} />
                <Text type="secondary" style={{ fontSize: 12 }}>
                  ({product.rating.count})
                </Text>
                {product.vendor.isVerified && (
                  <Tooltip title="Verified Vendor">
                    <CheckCircleOutlined style={{ color: '#52c41a', fontSize: 12 }} />
                  </Tooltip>
                )}
              </Space>
            </Space>
          }
        />
        
        <div style={{ marginTop: 12 }}>
          <div style={{ marginBottom: 8 }}>
            <Text strong style={{ fontSize: 16, color: '#f5222d' }}>
              ${product.price.toFixed(2)}
            </Text>
            {product.comparePrice && product.comparePrice > product.price && (
              <Text delete type="secondary" style={{ fontSize: 12, marginLeft: 8 }}>
                ${product.comparePrice.toFixed(2)}
              </Text>
            )}
          </div>
          
          <Space direction="vertical" style={{ width: '100%' }} size="small">
            {product.inventory.inStock ? (
              <Text type="success" style={{ fontSize: 12 }}>
                <CheckCircleOutlined /> In Stock
              </Text>
            ) : (
              <Text type="secondary" style={{ fontSize: 12 }}>
                <ClockCircleOutlined /> Out of Stock
              </Text>
            )}
            
            {product.requiresShipping === false && (
              <Text style={{ fontSize: 12, color: '#1890ff' }}>
                <TruckOutlined /> Free Shipping
              </Text>
            )}
            
            <Button
              type="primary"
              block
              icon={<ShoppingCartOutlined />}
              onClick={handleAddToCart}
              disabled={!product.inventory.inStock}
              style={{ marginTop: 8 }}
            >
              {product.inventory.inStock ? 'Add to Cart' : 'Out of Stock'}
            </Button>
          </Space>
        </div>
        
        {/* Add hover styles */}
        <style jsx>{`
          .ant-card:hover .quick-actions {
            opacity: 1 !important;
          }
        `}</style>
      </Card>
    </motion.div>
  );
};

const EnhancedProductGrid: React.FC<EnhancedProductGridProps> = ({
  products,
  loading = false,
  viewMode = 'grid',
  showComparison = false,
  selectedProducts = [],
  onProductSelect,
  onProductView,
  className,
}) => {
  const [quickViewProduct, setQuickViewProduct] = useState<EnhancedProduct | null>(null);

  const handleProductView = (product: EnhancedProduct) => {
    if (onProductView) {
      onProductView(product.id);
    } else {
      setQuickViewProduct(product);
    }
  };

  const quickViewModal = quickViewProduct && (
    <Modal
      title={quickViewProduct.name}
      open={!!quickViewProduct}
      onCancel={() => setQuickViewProduct(null)}
      footer={null}
      width={800}
    >
      <Row gutter={24}>
        <Col span={12}>
          <Image
            src={quickViewProduct.images[0]?.url || '/placeholder.png'}
            alt={quickViewProduct.name}
            style={{ width: '100%', borderRadius: 6 }}
          />
        </Col>
        <Col span={12}>
          <Space direction="vertical" style={{ width: '100%' }} size="middle">
            <div>
              <Title level={3}>{quickViewProduct.name}</Title>
              <Text type="secondary">{quickViewProduct.brand.name}</Text>
            </div>
            
            <Space align="center">
              <Rate disabled value={quickViewProduct.rating.average} allowHalf />
              <Text>({quickViewProduct.rating.count} reviews)</Text>
            </Space>
            
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
            
            <Space wrap>
              {quickViewProduct.tags.map(tag => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </Space>
            
            <Button type="primary" size="large" block onClick={() => {
              window.location.href = `/products/${quickViewProduct.slug}`;
            }}>
              View Full Details
            </Button>
          </Space>
        </Col>
      </Row>
    </Modal>
  );

  if (loading) {
    return (
      <Row gutter={[24, 24]}>
        {Array.from({ length: viewMode === 'grid' ? 12 : 6 }).map((_, index) => (
          <Col
            key={index}
            xs={24}
            sm={viewMode === 'grid' ? 12 : 24}
            md={viewMode === 'grid' ? 8 : 24}
            lg={viewMode === 'grid' ? 6 : 24}
          >
            <Card loading style={{ height: viewMode === 'grid' ? 400 : 200 }} />
          </Col>
        ))}
      </Row>
    );
  }

  if (products.length === 0) {
    return (
      <Card style={{ textAlign: 'center', padding: 48 }}>
        <Space direction="vertical" size="large">
          <ShoppingOutlined style={{ fontSize: 64, color: '#d9d9d9' }} />
          <div>
            <Title level={3}>No products found</Title>
            <Text type="secondary">
              Try adjusting your filters or search terms to find what you're looking for.
            </Text>
          </div>
        </Space>
      </Card>
    );
  }

  return (
    <div className={className}>
      <Row gutter={[24, 24]}>
        {products.map((product) => (
          <Col
            key={product.id}
            xs={24}
            sm={viewMode === 'grid' ? 12 : 24}
            md={viewMode === 'grid' ? 8 : 24}
            lg={viewMode === 'grid' ? 6 : 24}
            xl={viewMode === 'grid' ? 4 : 24}
          >
            <ProductCard
              product={product}
              viewMode={viewMode}
              isSelected={selectedProducts.includes(product.id)}
              showSelection={showComparison}
              onSelect={(selected) => onProductSelect?.(product.id, selected)}
              onView={() => handleProductView(product)}
            />
          </Col>
        ))}
      </Row>
      
      {quickViewModal}
    </div>
  );
};

export default EnhancedProductGrid;