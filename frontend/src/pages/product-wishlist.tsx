import React, { useState, useEffect } from 'react';
import {
  Row,
  Col,
  Card,
  Typography,
  Space,
  Button,
  Empty,
  Image,
  Rate,
  Tag,
  message,
  Modal,
  InputNumber,
  Switch,
  Tooltip,
  Statistic,
  Divider,
  Select,
} from 'antd';
import {
  HeartFilled,
  HeartOutlined,
  ShoppingCartOutlined,
  DeleteOutlined,
  ShareAltOutlined,
  BellOutlined,
  DollarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';
import { useWishlistStore, type WishlistItem } from '@/store/wishlistStore';
import { useCartStore } from '@/store/cartStore';
import { enhancedProductAPI, type EnhancedProduct, type PriceAlert } from '@/services/api/enhanced-product';

const { Title, Text } = Typography;
const { Option } = Select;

interface WishlistItemWithProduct extends WishlistItem {
  product?: EnhancedProduct;
  priceAlert?: PriceAlert;
}

interface PriceAlertModalProps {
  visible: boolean;
  product: EnhancedProduct | null;
  currentAlert?: PriceAlert;
  onClose: () => void;
  onSave: (targetPrice: number) => void;
}

const PriceAlertModal: React.FC<PriceAlertModalProps> = ({
  visible,
  product,
  currentAlert,
  onClose,
  onSave,
}) => {
  const [targetPrice, setTargetPrice] = useState<number>(0);

  useEffect(() => {
    if (product) {
      setTargetPrice(currentAlert?.targetPrice || product.price * 0.9);
    }
  }, [product, currentAlert]);

  const savingsAmount = product ? product.price - targetPrice : 0;
  const savingsPercent = product && targetPrice < product.price 
    ? Math.round(((product.price - targetPrice) / product.price) * 100) 
    : 0;

  return (
    <Modal
      title={
        <Space>
          <BellOutlined />
          <span>Set Price Alert</span>
        </Space>
      }
      open={visible}
      onCancel={onClose}
      onOk={() => onSave(targetPrice)}
      okText={currentAlert ? "Update Alert" : "Create Alert"}
    >
      {product && (
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Image
              src={product.images[0]?.url || '/placeholder.png'}
              alt={product.name}
              width={60}
              height={60}
              style={{ borderRadius: 6, objectFit: 'cover' }}
            />
            <div>
              <Text strong>{product.name}</Text>
              <div>
                <Text type="secondary">Current Price: </Text>
                <Text strong style={{ color: '#f5222d' }}>
                  ${product.price.toFixed(2)}
                </Text>
              </div>
            </div>
          </div>

          <div>
            <Text strong style={{ display: 'block', marginBottom: 8 }}>
              Alert me when price drops to:
            </Text>
            <InputNumber
              value={targetPrice}
              onChange={(value) => setTargetPrice(value || 0)}
              prefix="$"
              style={{ width: '100%' }}
              min={0}
              max={product.price}
              precision={2}
              step={1}
            />
          </div>

          {savingsPercent > 0 && (
            <Card size="small" style={{ backgroundColor: '#f6ffed' }}>
              <Row gutter={16}>
                <Col span={12}>
                  <Statistic
                    title="You'll Save"
                    value={savingsAmount}
                    precision={2}
                    prefix="$"
                    valueStyle={{ color: '#3f8600' }}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="Discount"
                    value={savingsPercent}
                    suffix="%"
                    valueStyle={{ color: '#3f8600' }}
                  />
                </Col>
              </Row>
            </Card>
          )}

          <Text type="secondary" style={{ fontSize: 12 }}>
            We'll send you an email notification when the price drops to your target price.
          </Text>
        </Space>
      )}
    </Modal>
  );
};

const ProductWishlist: React.FC = () => {
  const { items, removeFromWishlist, clearWishlist } = useWishlistStore();
  const { addItem } = useCartStore();
  
  const [wishlistItems, setWishlistItems] = useState<WishlistItemWithProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [priceAlertModal, setPriceAlertModal] = useState<{
    visible: boolean;
    product: EnhancedProduct | null;
    currentAlert?: PriceAlert;
  }>({
    visible: false,
    product: null,
  });
  const [sortBy, setSortBy] = useState<'added' | 'price-low' | 'price-high' | 'name'>('added');

  // Fetch full product details for wishlist items
  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      try {
        const itemsWithProducts = await Promise.all(
          items.map(async (item) => {
            try {
              const product = await enhancedProductAPI.getProduct(item.productId, false);
              return { ...item, product };
            } catch (error) {
              console.error(`Failed to fetch product ${item.productId}:`, error);
              return item;
            }
          })
        );
        setWishlistItems(itemsWithProducts);
      } catch (error) {
        message.error('Failed to load wishlist items');
      } finally {
        setLoading(false);
      }
    };

    if (items.length > 0) {
      fetchProductDetails();
    } else {
      setWishlistItems([]);
      setLoading(false);
    }
  }, [items]);

  // Sort wishlist items
  const sortedItems = [...wishlistItems].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return (a.product?.price || 0) - (b.product?.price || 0);
      case 'price-high':
        return (b.product?.price || 0) - (a.product?.price || 0);
      case 'name':
        return (a.product?.name || '').localeCompare(b.product?.name || '');
      case 'added':
      default:
        return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
    }
  });

  // Handle remove from wishlist
  const handleRemoveFromWishlist = async (productId: string) => {
    try {
      await removeFromWishlist(productId);
      message.success('Removed from wishlist');
    } catch (error) {
      message.error('Failed to remove from wishlist');
    }
  };

  // Handle add to cart
  const handleAddToCart = async (product: EnhancedProduct) => {
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

  // Handle price alert
  const handlePriceAlert = (product: EnhancedProduct, currentAlert?: PriceAlert) => {
    setPriceAlertModal({
      visible: true,
      product,
      currentAlert,
    });
  };

  // Save price alert
  const savePriceAlert = async (targetPrice: number) => {
    if (!priceAlertModal.product) return;

    try {
      await enhancedProductAPI.createPriceAlert(priceAlertModal.product.id, targetPrice);
      message.success('Price alert created successfully');
      setPriceAlertModal({ visible: false, product: null });
    } catch (error) {
      message.error('Failed to create price alert');
    }
  };

  // Handle share
  const handleShare = async (product: EnhancedProduct) => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: product.name,
          text: `Check out this product: ${product.name}`,
          url: `${window.location.origin}/products/${product.slug}`,
        });
      } else {
        await navigator.clipboard.writeText(`${window.location.origin}/products/${product.slug}`);
        message.success('Product link copied to clipboard');
      }
    } catch (error) {
      message.error('Failed to share product');
    }
  };

  // Calculate wishlist statistics
  const totalValue = wishlistItems.reduce((sum, item) => sum + (item.product?.price || 0), 0);
  const averagePrice = wishlistItems.length > 0 ? totalValue / wishlistItems.length : 0;
  const inStockItems = wishlistItems.filter(item => item.product?.inventory.inStock).length;

  if (loading) {
    return (
      <div style={{ padding: 24 }}>
        <Card loading style={{ height: 400 }} />
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div style={{ padding: 24, textAlign: 'center' }}>
        <Card style={{ maxWidth: 600, margin: '0 auto' }}>
          <Empty
            image="/wishlist-empty.svg"
            imageStyle={{ height: 200 }}
            description={
              <Space direction="vertical" size="middle">
                <Title level={3}>Your wishlist is empty</Title>
                <Text type="secondary">
                  Save items you love by clicking the heart icon on any product
                </Text>
                <Button type="primary" href="/products">
                  Start Shopping
                </Button>
              </Space>
            }
          />
        </Card>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ backgroundColor: 'white', padding: '24px 0', borderBottom: '1px solid #f0f0f0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
          <Row justify="space-between" align="middle">
            <Col>
              <Space direction="vertical" size="small">
                <Title level={1} style={{ margin: 0 }}>
                  <HeartFilled style={{ color: '#ff4d4f', marginRight: 12 }} />
                  My Wishlist
                </Title>
                <Text type="secondary" style={{ fontSize: '16px' }}>
                  {wishlistItems.length} item{wishlistItems.length !== 1 ? 's' : ''} saved
                </Text>
              </Space>
            </Col>
            
            <Col>
              <Space size="large">
                <Statistic
                  title="Total Value"
                  value={totalValue}
                  prefix="$"
                  precision={2}
                />
                <Statistic
                  title="Average Price"
                  value={averagePrice}
                  prefix="$"
                  precision={2}
                />
                <Statistic
                  title="In Stock"
                  value={inStockItems}
                  suffix={`/ ${wishlistItems.length}`}
                />
              </Space>
            </Col>
          </Row>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>
        {/* Controls */}
        <Card size="small" style={{ marginBottom: 24 }}>
          <Row justify="space-between" align="middle">
            <Col>
              <Space>
                <Text strong>Sort by:</Text>
                <Select
                  value={sortBy}
                  onChange={setSortBy}
                  style={{ width: 150 }}
                >
                  <Option value="added">Recently Added</Option>
                  <Option value="price-low">Price: Low to High</Option>
                  <Option value="price-high">Price: High to Low</Option>
                  <Option value="name">Name: A-Z</Option>
                </Select>
              </Space>
            </Col>
            
            <Col>
              <Space>
                <Button
                  danger
                  onClick={() => {
                    Modal.confirm({
                      title: 'Clear Wishlist',
                      content: 'Are you sure you want to remove all items from your wishlist?',
                      okText: 'Clear All',
                      okType: 'danger',
                      onOk: clearWishlist,
                    });
                  }}
                >
                  Clear All
                </Button>
              </Space>
            </Col>
          </Row>
        </Card>

        {/* Wishlist Items */}
        <AnimatePresence>
          <Row gutter={[24, 24]}>
            {sortedItems.map((item, index) => {
              const { product } = item;
              if (!product) return null;

              const discountPercent = product.comparePrice && product.price < product.comparePrice
                ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
                : product.discount;

              return (
                <Col key={item.productId} xs={24} sm={12} md={8} lg={6}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card
                      hoverable
                      style={{ height: '100%' }}
                      cover={
                        <div style={{ position: 'relative', height: 200 }}>
                          <Image
                            src={product.images[0]?.url || '/placeholder.png'}
                            alt={product.name}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                            }}
                            placeholder
                            preview={false}
                          />
                          
                          {/* Badges */}
                          <div style={{ position: 'absolute', top: 8, right: 8 }}>
                            {!product.inventory.inStock && (
                              <Tag color="red" style={{ marginBottom: 4 }}>
                                Out of Stock
                              </Tag>
                            )}
                            {discountPercent && discountPercent > 0 && (
                              <Tag color="red">
                                {discountPercent}% OFF
                              </Tag>
                            )}
                          </div>
                          
                          {/* Remove from Wishlist */}
                          <div style={{ position: 'absolute', top: 8, left: 8 }}>
                            <Button
                              type="text"
                              danger
                              icon={<HeartFilled />}
                              onClick={() => handleRemoveFromWishlist(product.id)}
                              style={{
                                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                color: '#ff4d4f',
                              }}
                            />
                          </div>
                        </div>
                      }
                      actions={[
                        <Tooltip title="Add to Cart" key="cart">
                          <Button
                            type="text"
                            icon={<ShoppingCartOutlined />}
                            onClick={() => handleAddToCart(product)}
                            disabled={!product.inventory.inStock}
                          />
                        </Tooltip>,
                        <Tooltip title="Price Alert" key="alert">
                          <Button
                            type="text"
                            icon={<BellOutlined />}
                            onClick={() => handlePriceAlert(product)}
                          />
                        </Tooltip>,
                        <Tooltip title="Share" key="share">
                          <Button
                            type="text"
                            icon={<ShareAltOutlined />}
                            onClick={() => handleShare(product)}
                          />
                        </Tooltip>,
                      ]}
                    >
                      <Card.Meta
                        title={
                          <Tooltip title={product.name}>
                            <Text ellipsis strong style={{ fontSize: 14 }}>
                              {product.name}
                            </Text>
                          </Tooltip>
                        }
                        description={
                          <Space direction="vertical" size="small" style={{ width: '100%' }}>
                            <Text type="secondary" ellipsis>
                              {product.brand.name}
                            </Text>
                            
                            <Space align="center">
                              <Rate
                                disabled
                                value={product.rating.average}
                                allowHalf
                                style={{ fontSize: 12 }}
                              />
                              <Text type="secondary" style={{ fontSize: 11 }}>
                                ({product.rating.count})
                              </Text>
                            </Space>
                            
                            <div>
                              <Text strong style={{ fontSize: 16, color: '#f5222d' }}>
                                ${product.price.toFixed(2)}
                              </Text>
                              {product.comparePrice && product.comparePrice > product.price && (
                                <Text delete type="secondary" style={{ fontSize: 12, marginLeft: 8 }}>
                                  ${product.comparePrice.toFixed(2)}
                                </Text>
                              )}
                            </div>
                            
                            {product.inventory.inStock ? (
                              <Tag color="green" icon={<CheckCircleOutlined />} style={{ margin: 0 }}>
                                In Stock
                              </Tag>
                            ) : (
                              <Tag color="red" icon={<CloseCircleOutlined />} style={{ margin: 0 }}>
                                Out of Stock
                              </Tag>
                            )}
                            
                            <Text type="secondary" style={{ fontSize: 11 }}>
                              Added {new Date(item.addedAt).toLocaleDateString()}
                            </Text>
                          </Space>
                        }
                      />
                    </Card>
                  </motion.div>
                </Col>
              );
            })}
          </Row>
        </AnimatePresence>

        {/* Bulk Actions */}
        <Card style={{ marginTop: 24, textAlign: 'center' }}>
          <Space size="large">
            <Button
              type="primary"
              size="large"
              icon={<ShoppingCartOutlined />}
              onClick={() => {
                const inStockProducts = wishlistItems.filter(item => 
                  item.product?.inventory.inStock
                );
                
                if (inStockProducts.length === 0) {
                  message.warning('No items are currently in stock');
                  return;
                }
                
                Modal.confirm({
                  title: 'Add all to cart',
                  content: `Add all ${inStockProducts.length} in-stock items to your cart?`,
                  onOk: async () => {
                    try {
                      await Promise.all(
                        inStockProducts.map(item => 
                          item.product && addItem({
                            productId: item.product.id,
                            quantity: 1,
                          })
                        )
                      );
                      message.success(`Added ${inStockProducts.length} items to cart`);
                    } catch (error) {
                      message.error('Failed to add some items to cart');
                    }
                  },
                });
              }}
            >
              Add All In-Stock Items to Cart ({inStockItems})
            </Button>
            
            <Button
              icon={<BellOutlined />}
              onClick={() => {
                message.info('Bulk price alerts feature coming soon!');
              }}
            >
              Set Price Alerts for All
            </Button>
          </Space>
        </Card>

        {/* Price Alert Modal */}
        <PriceAlertModal
          visible={priceAlertModal.visible}
          product={priceAlertModal.product}
          currentAlert={priceAlertModal.currentAlert}
          onClose={() => setPriceAlertModal({ visible: false, product: null })}
          onSave={savePriceAlert}
        />
      </div>
    </div>
  );
};

export default ProductWishlist;