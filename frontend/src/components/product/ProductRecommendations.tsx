import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Space,
  Button,
  Tag,
  Rate,
  Image,
  Carousel,
  Tooltip,
  Badge,
  Divider,
  Tabs,
  Skeleton,
  Empty,
  Avatar,
  Statistic,
  message,
} from 'antd';
import {
  ShoppingCartOutlined,
  HeartOutlined,
  EyeOutlined,
  FireOutlined,
  ThunderboltOutlined,
  StarOutlined,
  TrophyOutlined,
  UserOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  SwapOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';
import { enhancedProductAPI, type EnhancedProduct, type RecommendationRequest, type RecommendationResponse, type ProductRecommendation, type RecommendationType } from '@/services/api/enhanced-product';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useProductComparisonStore } from '@/store/productComparisonStore';
import { useErrorStore } from '@/store/error';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

interface ProductRecommendationsProps {
  context: RecommendationRequest;
  title?: string;
  showTabs?: boolean;
  maxItems?: number;
  columns?: number;
  style?: React.CSSProperties;
}

interface RecommendationCardProps {
  recommendation: ProductRecommendation;
  onView?: (productId: string) => void;
  size?: 'small' | 'default' | 'large';
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({
  recommendation,
  onView,
  size = 'default',
}) => {
  const { addItem } = useCartStore();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlistStore();
  const { useApiOperation } = useErrorStore();
  
  const { product, score, reason, type } = recommendation;
  const inWishlist = isInWishlist(product.id);

  // Handle add to cart
  const handleAddToCart = async () => {
    try {
      await addItem({
        productId: product.id,
        quantity: 1,
      });
      message.success(`Added ${product.name} to cart`);
    } catch (error) {
      message.error('Failed to add to cart');
    }
  };

  // Handle wishlist toggle
  const handleWishlistToggle = async () => {
    try {
      if (inWishlist) {
        await removeFromWishlist(product.id);
        message.success('Removed from wishlist');
      } else {
        await addToWishlist(product.id);
        message.success('Added to wishlist');
      }
    } catch (error) {
      message.error('Failed to update wishlist');
    }
  };

  // Get recommendation type icon and color
  const getTypeIcon = (type: RecommendationType) => {
    switch (type) {
      case 'trending': return { icon: <FireOutlined />, color: '#ff4d4f' };
      case 'similar_products': return { icon: <SwapOutlined />, color: '#1890ff' };
      case 'frequently_bought_together': return { icon: <ShoppingCartOutlined />, color: '#52c41a' };
      case 'recently_viewed': return { icon: <ClockCircleOutlined />, color: '#722ed1' };
      case 'personalized': return { icon: <UserOutlined />, color: '#eb2f96' };
      case 'category_bestsellers': return { icon: <TrophyOutlined />, color: '#faad14' };
      case 'price_similar': return { icon: <DollarOutlined />, color: '#13c2c2' };
      case 'brand_similar': return { icon: <StarOutlined />, color: '#fa8c16' };
      case 'complementary': return { icon: <ThunderboltOutlined />, color: '#a0d911' };
      default: return { icon: <StarOutlined />, color: '#1890ff' };
    }
  };

  const typeInfo = getTypeIcon(type);
  const discountPercent = product.comparePrice && product.price < product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : product.discount;

  const cardHeight = size === 'small' ? 280 : size === 'large' ? 400 : 340;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4 }}
    >
      <Card
        hoverable
        style={{ height: cardHeight, position: 'relative' }}
        bodyStyle={{ padding: size === 'small' ? 12 : 16 }}
        cover={
          <div style={{ position: 'relative', height: size === 'small' ? 140 : 180, overflow: 'hidden' }}>
            {/* Recommendation Badge */}
            <div style={{ position: 'absolute', top: 8, left: 8, zIndex: 1 }}>
              <Tooltip title={reason}>
                <Tag color={typeInfo.color} icon={typeInfo.icon} style={{ fontSize: '10px' }}>
                  {Math.round(score * 100)}% Match
                </Tag>
              </Tooltip>
            </div>

            {/* Discount Badge */}
            {discountPercent && discountPercent > 0 && (
              <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }}>
                <Tag color="red" style={{ fontSize: '10px' }}>
                  {discountPercent}% OFF
                </Tag>
              </div>
            )}

            <Image
              src={product.images[0]?.url || '/placeholder.png'}
              alt={product.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              placeholder
              preview={false}
            />

            {/* Quick Actions Overlay */}
            <div
              className="quick-actions"
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
            >
              <Space>
                <Tooltip title="Add to Wishlist">
                  <Button
                    type="text"
                    icon={<HeartOutlined />}
                    onClick={handleWishlistToggle}
                    style={{ color: inWishlist ? '#ff4d4f' : 'white' }}
                  />
                </Tooltip>
                
                <Tooltip title="Quick View">
                  <Button
                    type="text"
                    icon={<EyeOutlined />}
                    onClick={() => onView?.(product.id)}
                    style={{ color: 'white' }}
                  />
                </Tooltip>
              </Space>
            </div>
          </div>
        }
      >
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Product Info */}
          <div style={{ flex: 1 }}>
            <Tooltip title={product.name}>
              <Title
                level={5}
                ellipsis={{ rows: 2 }}
                style={{ margin: 0, marginBottom: 4, fontSize: size === 'small' ? 14 : 16 }}
              >
                {product.name}
              </Title>
            </Tooltip>

            <Text type="secondary" style={{ fontSize: size === 'small' ? 11 : 12 }}>
              {product.brand.name}
            </Text>

            <div style={{ margin: '8px 0' }}>
              <Space align="center">
                <Rate
                  disabled
                  value={product.rating.average}
                  allowHalf
                  style={{ fontSize: size === 'small' ? 10 : 12 }}
                />
                <Text type="secondary" style={{ fontSize: size === 'small' ? 10 : 11 }}>
                  ({product.rating.count})
                </Text>
                {product.vendor.isVerified && (
                  <Tooltip title="Verified Vendor">
                    <CheckCircleOutlined style={{ color: '#52c41a', fontSize: 12 }} />
                  </Tooltip>
                )}
              </Space>
            </div>

            {/* Recommendation Reason */}
            <div style={{ margin: '8px 0' }}>
              <Text style={{ fontSize: size === 'small' ? 10 : 11, color: typeInfo.color, fontWeight: 500 }}>
                {typeInfo.icon} {reason}
              </Text>
            </div>
          </div>

          {/* Price and Actions */}
          <div>
            <div style={{ marginBottom: 12 }}>
              <div>
                <Text strong style={{ fontSize: size === 'small' ? 14 : 16, color: '#f5222d' }}>
                  ${product.price.toFixed(2)}
                </Text>
                {product.comparePrice && product.comparePrice > product.price && (
                  <Text delete type="secondary" style={{ fontSize: size === 'small' ? 11 : 12, marginLeft: 6 }}>
                    ${product.comparePrice.toFixed(2)}
                  </Text>
                )}
              </div>
              
              {product.inventory.inStock ? (
                <Text type="success" style={{ fontSize: size === 'small' ? 10 : 11 }}>
                  <CheckCircleOutlined /> In Stock
                </Text>
              ) : (
                <Text type="secondary" style={{ fontSize: size === 'small' ? 10 : 11 }}>
                  <ClockCircleOutlined /> Out of Stock
                </Text>
              )}
            </div>

            <Button
              type="primary"
              block
              icon={<ShoppingCartOutlined />}
              size={size === 'small' ? 'small' : 'middle'}
              onClick={handleAddToCart}
              disabled={!product.inventory.inStock}
            >
              {product.inventory.inStock ? 'Add to Cart' : 'Out of Stock'}
            </Button>
          </div>
        </div>

        {/* CSS for hover effects */}
        <style dangerouslySetInnerHTML={{
          __html: `
            .ant-card:hover .quick-actions {
              opacity: 1 !important;
            }
          `
        }} />
      </Card>
    </motion.div>
  );
};

const ProductRecommendations: React.FC<ProductRecommendationsProps> = ({
  context,
  title = "Recommended for You",
  showTabs = true,
  maxItems = 12,
  columns = 4,
  style,
}) => {
  const [recommendations, setRecommendations] = useState<RecommendationResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('all');

  // Fetch recommendations
  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const response = await enhancedProductAPI.getRecommendations({
        ...context,
        limit: maxItems,
      });
      setRecommendations(response);
    } catch (error) {
      console.error('Failed to fetch recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, [context, maxItems]);

  // Group recommendations by type
  const groupedRecommendations = recommendations?.recommendations.reduce((acc, rec) => {
    if (!acc[rec.type]) {
      acc[rec.type] = [];
    }
    acc[rec.type].push(rec);
    return acc;
  }, {} as Record<string, ProductRecommendation[]>) || {};

  // Get filtered recommendations based on active tab
  const getFilteredRecommendations = (): ProductRecommendation[] => {
    if (activeTab === 'all') {
      return recommendations?.recommendations || [];
    }
    return (groupedRecommendations as any)[activeTab] || [];
  };

  const filteredRecommendations = getFilteredRecommendations();

  // Tab configurations
  const tabConfigs: Record<RecommendationType, { label: string; icon: React.ReactNode; color: string }> = {
    similar_products: { label: 'Similar', icon: <SwapOutlined />, color: '#1890ff' },
    frequently_bought_together: { label: 'Frequently Bought', icon: <ShoppingCartOutlined />, color: '#52c41a' },
    recently_viewed: { label: 'Recently Viewed', icon: <ClockCircleOutlined />, color: '#722ed1' },
    trending: { label: 'Trending', icon: <FireOutlined />, color: '#ff4d4f' },
    personalized: { label: 'For You', icon: <UserOutlined />, color: '#eb2f96' },
    category_bestsellers: { label: 'Bestsellers', icon: <TrophyOutlined />, color: '#faad14' },
    price_similar: { label: 'Similar Price', icon: <DollarOutlined />, color: '#13c2c2' },
    brand_similar: { label: 'Same Brand', icon: <StarOutlined />, color: '#fa8c16' },
    complementary: { label: 'Accessories', icon: <ThunderboltOutlined />, color: '#a0d911' },
  };

  if (loading) {
    return (
      <Card title={title} style={style}>
        <Row gutter={[16, 16]}>
          {Array.from({ length: columns }).map((_, index) => (
            <Col key={index} span={24 / columns}>
              <Card loading style={{ height: 340 }} />
            </Col>
          ))}
        </Row>
      </Card>
    );
  }

  if (!recommendations || recommendations.recommendations.length === 0) {
    return (
      <Card title={title} style={style}>
        <Empty
          description="No recommendations available"
          image="/recommendations-empty.svg"
          imageStyle={{ height: 120 }}
        />
      </Card>
    );
  }

  return (
    <Card
      title={
        <Space>
          <span>{title}</span>
          {recommendations && (
            <Badge
              count={recommendations.recommendations.length}
              style={{ backgroundColor: '#52c41a' }}
            />
          )}
          {recommendations?.strategy && (
            <Tooltip title={`Strategy: ${recommendations.strategy.primary}`}>
              <Tag color="blue" style={{ fontSize: '10px' }}>
                {Math.round(recommendations.confidence * 100)}% Confidence
              </Tag>
            </Tooltip>
          )}
        </Space>
      }
      style={style}
    >
      {showTabs && Object.keys(groupedRecommendations).length > 1 ? (
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          size="small"
          style={{ marginBottom: 16 }}
        >
          <TabPane tab="All Recommendations" key="all" />
          {Object.entries(groupedRecommendations).map(([type, recs]) => {
            const config = tabConfigs[type as RecommendationType];
            const recommendations = recs as ProductRecommendation[];
            return (
              <TabPane
                tab={
                  <Space>
                    {config?.icon}
                    <span>{config?.label || type}</span>
                    <Badge count={recommendations.length} size="small" />
                  </Space>
                }
                key={type}
              />
            );
          })}
        </Tabs>
      ) : null}

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Row gutter={[16, 16]}>
            {filteredRecommendations.slice(0, maxItems).map((recommendation: ProductRecommendation, index: number) => (
              <Col
                key={recommendation.product.id}
                xs={24}
                sm={12}
                md={24 / Math.min(columns, 4)}
                lg={24 / columns}
                xl={24 / columns}
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <RecommendationCard
                    recommendation={recommendation}
                    onView={(productId) => {
                      window.location.href = `/products/${productId}`;
                    }}
                    size={columns > 4 ? 'small' : 'default'}
                  />
                </motion.div>
              </Col>
            ))}
          </Row>
        </motion.div>
      </AnimatePresence>

      {/* Recommendation Strategy Info */}
      {recommendations?.strategy && (
        <div style={{ marginTop: 16, padding: 16, background: '#fafafa', borderRadius: 6 }}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            Recommendations powered by {recommendations.strategy.primary} algorithm
            {recommendations.metadata.performance_metrics?.click_rate && (
              <span> • {Math.round(recommendations.metadata.performance_metrics.click_rate * 100)}% click rate</span>
            )}
            {recommendations.metadata.ab_test_group && (
              <span> • Test group {recommendations.metadata.ab_test_group}</span>
            )}
          </Text>
        </div>
      )}
    </Card>
  );
};

export default ProductRecommendations;