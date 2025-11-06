import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Button,
  Empty,
  Rate,
  Tag,
  Space,
  message,
  Popconfirm,
  Select,
  Spin,
} from 'antd';
import {
  DeleteOutlined,
  ShoppingCartOutlined,
  ShareAltOutlined,
  HeartFilled,
} from '@ant-design/icons';
import { history } from 'umi';
import { motion } from 'framer-motion';
import { wishlistAPI, type WishlistItem } from '@/services/api/cart';
import { useCartStore } from '@/store/cartStore';

const { Title, Text } = Typography;
const { Option } = Select;

// Extended wishlist item type with product details
interface ExtendedWishlistItem extends WishlistItem {
  name?: string;
  image?: string;
  originalPrice?: number;
  discount?: number;
  rating?: number;
  reviewCount?: number;
  vendor?: string;
}

const WishlistPage: React.FC = () => {
  const [wishlistItems, setWishlistItems] = useState<ExtendedWishlistItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const { addItem: addToCart } = useCartStore();

  // Fetch wishlist from API
  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const wishlistData = await wishlistAPI.get();
      
      // Map API response to UI format
      const mappedItems: ExtendedWishlistItem[] = wishlistData.items.map((item) => ({
        ...item,
        name: item.productName,
        image: item.productImage || 'https://via.placeholder.com/300x300/1890ff/fff?text=Product',
        originalPrice: item.price * 1.2, // Placeholder - would come from product API
        discount: 20, // Placeholder - would come from product API
        rating: 4.5, // Placeholder - would come from product API
        reviewCount: 100, // Placeholder - would come from product API
        vendor: 'Vendor Name', // Placeholder - would come from product API
      }));
      
      setWishlistItems(mappedItems);
    } catch (error) {
      message.error('Failed to load wishlist');
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleRemoveFromWishlist = async (id: string) => {
    try {
      await wishlistAPI.removeItem(id);
      setWishlistItems(wishlistItems.filter((item) => item.id !== id));
      message.success('Item removed from wishlist');
    } catch (error) {
      message.error('Failed to remove item');
      console.error('Error removing item:', error);
    }
  };

  const handleAddToCart = async (item: ExtendedWishlistItem) => {
    if (!item.inStock) {
      message.warning('This item is currently out of stock');
      return;
    }
    
    try {
      await addToCart({ productId: item.productId, quantity: 1 });
      message.success(`${item.productName} added to cart`);
    } catch (error) {
      message.error('Failed to add item to cart');
      console.error('Error adding to cart:', error);
    }
  };

  const handleMoveToCart = async (item: ExtendedWishlistItem) => {
    if (!item.inStock) {
      message.warning('This item is currently out of stock');
      return;
    }
    
    try {
      await wishlistAPI.moveToCart(item.id);
      setWishlistItems(wishlistItems.filter((i) => i.id !== item.id));
      message.success(`${item.productName} moved to cart`);
    } catch (error) {
      message.error('Failed to move item to cart');
      console.error('Error moving to cart:', error);
    }
  };

  const handleAddAllToCart = async () => {
    const inStockItems = wishlistItems.filter((item) => item.inStock);
    if (inStockItems.length === 0) {
      message.warning('No items in stock');
      return;
    }
    
    try {
      setLoading(true);
      // Add all in-stock items to cart
      await Promise.all(
        inStockItems.map((item) => addToCart({ productId: item.productId, quantity: 1 }))
      );
      message.success(`${inStockItems.length} items added to cart`);
    } catch (error) {
      message.error('Failed to add some items to cart');
      console.error('Error adding all to cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/wishlist/shared/${Date.now()}`;
    if (navigator.share) {
      navigator.share({
        title: 'My Wishlist',
        text: 'Check out my wishlist!',
        url: shareUrl,
      });
    } else {
      navigator.clipboard.writeText(shareUrl);
      message.success('Wishlist link copied to clipboard!');
    }
  };

  const sortedItems = [...wishlistItems].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'discount':
        return (b.discount || 0) - (a.discount || 0);
      case 'newest':
      default:
        return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
    }
  });

  // Show loading spinner
  if (loading && wishlistItems.length === 0) {
    return (
      <div style={{ padding: 24, textAlign: 'center' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: 24, maxWidth: 1400, margin: '0 auto' }}>
      {/* Header */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={2}>
            <HeartFilled style={{ color: '#ff4d4f', marginRight: 8 }} />
            My Wishlist ({wishlistItems.length} items)
          </Title>
        </Col>
        <Col>
          <Space>
            <Select
              value={sortBy}
              onChange={setSortBy}
              style={{ width: 180 }}
              placeholder="Sort by"
            >
              <Option value="newest">Newest First</Option>
              <Option value="price-low">Price: Low to High</Option>
              <Option value="price-high">Price: High to Low</Option>
              <Option value="discount">Highest Discount</Option>
            </Select>
            <Button icon={<ShareAltOutlined />} onClick={handleShare}>
              Share Wishlist
            </Button>
            <Button
              type="primary"
              icon={<ShoppingCartOutlined />}
              onClick={handleAddAllToCart}
              disabled={wishlistItems.length === 0}
            >
              Add All to Cart
            </Button>
          </Space>
        </Col>
      </Row>

      {/* Wishlist Items */}
      {wishlistItems.length === 0 ? (
        <Card>
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <span>
                Your wishlist is empty
                <br />
                <Text type="secondary">Browse products and add items to your wishlist</Text>
              </span>
            }
          >
            <Button type="primary" onClick={() => history.push('/products')}>
              Browse Products
            </Button>
          </Empty>
        </Card>
      ) : (
        <Row gutter={[16, 16]}>
          {sortedItems.map((item, index) => (
            <Col xs={24} sm={12} lg={8} xl={6} key={item.id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card
                  hoverable
                  cover={
                    <div style={{ position: 'relative' }}>
                      <img
                        alt={item.name}
                        src={item.image}
                        style={{ width: '100%', height: 280, objectFit: 'cover' }}
                        onClick={() => history.push(`/products/${item.productId}`)}
                      />
                      {item.discount && item.discount > 0 && (
                        <Tag
                          color="red"
                          style={{
                            position: 'absolute',
                            top: 12,
                            left: 12,
                            fontSize: 14,
                            fontWeight: 'bold',
                          }}
                        >
                          -{item.discount}%
                        </Tag>
                      )}
                      {!item.inStock && (
                        <div
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'rgba(0,0,0,0.5)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Tag color="error" style={{ fontSize: 16, padding: '8px 16px' }}>
                            Out of Stock
                          </Tag>
                        </div>
                      )}
                      <Popconfirm
                        title="Remove from wishlist?"
                        onConfirm={() => handleRemoveFromWishlist(item.id)}
                        okText="Yes"
                        cancelText="No"
                      >
                        <Button
                          type="text"
                          icon={<DeleteOutlined />}
                          danger
                          style={{
                            position: 'absolute',
                            top: 12,
                            right: 12,
                            background: 'rgba(255,255,255,0.9)',
                          }}
                        />
                      </Popconfirm>
                    </div>
                  }
                  actions={[
                    <Button
                      key="addToCart"
                      type="primary"
                      block
                      icon={<ShoppingCartOutlined />}
                      onClick={() => handleAddToCart(item)}
                      disabled={!item.inStock}
                    >
                      Add to Cart
                    </Button>,
                  ]}
                >
                  <Card.Meta
                    title={
                      <div
                        onClick={() => history.push(`/products/${item.productId}`)}
                        style={{ cursor: 'pointer' }}
                      >
                        <Text strong ellipsis={{ tooltip: item.name }}>
                          {item.name}
                        </Text>
                      </div>
                    }
                    description={
                      <Space direction="vertical" size={4} style={{ width: '100%' }}>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          by {item.vendor}
                        </Text>
                        <Space>
                          <Rate disabled defaultValue={item.rating} style={{ fontSize: 12 }} />
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            ({item.reviewCount})
                          </Text>
                        </Space>
                        <Space align="baseline">
                          <Text strong style={{ fontSize: 18, color: '#B12704' }}>
                            ${item.price.toFixed(2)}
                          </Text>
                          {item.originalPrice && item.originalPrice > item.price && (
                            <Text delete type="secondary" style={{ fontSize: 14 }}>
                              ${item.originalPrice.toFixed(2)}
                            </Text>
                          )}
                        </Space>
                        <Text type="secondary" style={{ fontSize: 11 }}>
                          Added on {new Date(item.addedAt).toLocaleDateString()}
                        </Text>
                      </Space>
                    }
                  />
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>
      )}

      {/* Wishlist Stats */}
      {wishlistItems.length > 0 && (
        <Card style={{ marginTop: 24 }}>
          <Row gutter={32}>
            <Col span={6}>
              <Text type="secondary">Total Items</Text>
              <Title level={3} style={{ margin: 0 }}>
                {wishlistItems.length}
              </Title>
            </Col>
            <Col span={6}>
              <Text type="secondary">Total Value</Text>
              <Title level={3} style={{ margin: 0, color: '#B12704' }}>
                ${wishlistItems.reduce((sum, item) => sum + item.price, 0).toFixed(2)}
              </Title>
            </Col>
            <Col span={6}>
              <Text type="secondary">Potential Savings</Text>
              <Title level={3} style={{ margin: 0, color: '#52c41a' }}>
                $
                {wishlistItems
                  .reduce((sum, item) => sum + ((item.originalPrice || item.price) - item.price), 0)
                  .toFixed(2)}
              </Title>
            </Col>
            <Col span={6}>
              <Text type="secondary">In Stock</Text>
              <Title level={3} style={{ margin: 0 }}>
                {wishlistItems.filter((item) => item.inStock).length}
              </Title>
            </Col>
          </Row>
        </Card>
      )}
    </div>
  );
};

export default WishlistPage;
