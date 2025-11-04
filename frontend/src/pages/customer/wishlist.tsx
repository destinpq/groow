import React, { useState } from 'react';
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
} from 'antd';
import {
  DeleteOutlined,
  ShoppingCartOutlined,
  ShareAltOutlined,
  HeartFilled,
} from '@ant-design/icons';
import { history } from 'umi';
import { motion } from 'framer-motion';

const { Title, Text } = Typography;
const { Option } = Select;

// Mock wishlist data
const mockWishlistItems = [
  {
    id: 1,
    productId: 1,
    name: 'Premium Wireless Bluetooth Headphones',
    image: 'https://via.placeholder.com/300x300/1890ff/fff?text=Product+1',
    price: 349.99,
    originalPrice: 449.99,
    discount: 22,
    rating: 4.5,
    reviewCount: 2847,
    inStock: true,
    vendor: 'TechHub Store',
    addedDate: '2024-10-15',
  },
  {
    id: 2,
    productId: 2,
    name: 'Smart Watch Pro - Fitness Tracker',
    image: 'https://via.placeholder.com/300x300/52c41a/fff?text=Product+2',
    price: 199.99,
    originalPrice: 299.99,
    discount: 33,
    rating: 4.3,
    reviewCount: 1523,
    inStock: true,
    vendor: 'Gadget World',
    addedDate: '2024-10-12',
  },
  {
    id: 3,
    productId: 3,
    name: 'Laptop Backpack with USB Charging Port',
    image: 'https://via.placeholder.com/300x300/faad14/fff?text=Product+3',
    price: 49.99,
    originalPrice: 79.99,
    discount: 38,
    rating: 4.6,
    reviewCount: 892,
    inStock: false,
    vendor: 'Bag Store',
    addedDate: '2024-10-08',
  },
  {
    id: 4,
    productId: 4,
    name: 'Mechanical Gaming Keyboard RGB',
    image: 'https://via.placeholder.com/300x300/f5222d/fff?text=Product+4',
    price: 89.99,
    originalPrice: 129.99,
    discount: 31,
    rating: 4.7,
    reviewCount: 2134,
    inStock: true,
    vendor: 'Gaming Hub',
    addedDate: '2024-10-05',
  },
];

const WishlistPage: React.FC = () => {
  const [wishlistItems, setWishlistItems] = useState(mockWishlistItems);
  const [sortBy, setSortBy] = useState('newest');

  const handleRemoveFromWishlist = (id: number) => {
    setWishlistItems(wishlistItems.filter((item) => item.id !== id));
    message.success('Item removed from wishlist');
  };

  const handleAddToCart = (item: any) => {
    if (!item.inStock) {
      message.warning('This item is currently out of stock');
      return;
    }
    message.success(`${item.name} added to cart`);
    // Add to cart logic
  };

  const handleAddAllToCart = () => {
    const inStockItems = wishlistItems.filter((item) => item.inStock);
    if (inStockItems.length === 0) {
      message.warning('No items in stock');
      return;
    }
    message.success(`${inStockItems.length} items added to cart`);
    // Add all to cart logic
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
        return b.discount - a.discount;
      case 'newest':
      default:
        return new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime();
    }
  });

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
                      {item.discount > 0 && (
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
                          {item.originalPrice > item.price && (
                            <Text delete type="secondary" style={{ fontSize: 14 }}>
                              ${item.originalPrice.toFixed(2)}
                            </Text>
                          )}
                        </Space>
                        <Text type="secondary" style={{ fontSize: 11 }}>
                          Added on {new Date(item.addedDate).toLocaleDateString()}
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
                  .reduce((sum, item) => sum + (item.originalPrice - item.price), 0)
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
