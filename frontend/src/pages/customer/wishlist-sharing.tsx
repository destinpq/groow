import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Button,
  Space,
  List,
  Avatar,
  Tag,
  Empty,
  Modal,
  Tooltip,
  message,
  Divider,
  Badge,
  Statistic,
  Input,
} from 'antd';
import {
  HeartOutlined,
  HeartFilled,
  DeleteOutlined,
  ShoppingCartOutlined,
  ShareAltOutlined,
  StarFilled,
  FacebookOutlined,
  TwitterOutlined,
  LinkedinOutlined,
  MailOutlined,
  LinkOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;

interface WishlistItem {
  id: number;
  productId: number;
  productName: string;
  brand: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  inStock: boolean;
  image: string;
  addedDate: string;
  notes: string;
}

const mockWishlistItems: WishlistItem[] = [
  {
    id: 1,
    productId: 101,
    productName: 'Wireless Headphones Pro',
    brand: 'TechBrand',
    price: 99,
    originalPrice: 149,
    rating: 4.5,
    reviews: 234,
    inStock: true,
    image: '',
    addedDate: dayjs().subtract(5, 'days').format('YYYY-MM-DD'),
    notes: 'Wait for sale',
  },
  {
    id: 2,
    productId: 102,
    productName: 'Smart Watch Series 5',
    brand: 'SmartTech',
    price: 299,
    originalPrice: 399,
    rating: 4.8,
    reviews: 567,
    inStock: true,
    image: '',
    addedDate: dayjs().subtract(10, 'days').format('YYYY-MM-DD'),
    notes: '',
  },
  {
    id: 3,
    productId: 103,
    productName: 'Ergonomic Office Chair',
    brand: 'ComfortPlus',
    price: 449,
    originalPrice: 549,
    rating: 4.3,
    reviews: 123,
    inStock: true,
    image: '',
    addedDate: dayjs().subtract(2, 'days').format('YYYY-MM-DD'),
    notes: 'Birthday gift for mom',
  },
  {
    id: 4,
    productId: 104,
    productName: 'Leather Jacket',
    brand: 'StyleCo',
    price: 299,
    originalPrice: 399,
    rating: 4.6,
    reviews: 89,
    inStock: false,
    image: '',
    addedDate: dayjs().subtract(15, 'days').format('YYYY-MM-DD'),
    notes: '',
  },
];

const WishlistPage: React.FC = () => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>(mockWishlistItems);
  const [isShareModalVisible, setIsShareModalVisible] = useState<boolean>(false);
  const [shareUrl] = useState<string>('https://example.com/wishlist/shared/abc123');

  const handleRemoveItem = (id: number) => {
    Modal.confirm({
      title: 'Remove from Wishlist',
      content: 'Are you sure you want to remove this item from your wishlist?',
      onOk: () => {
        setWishlistItems(wishlistItems.filter((item) => item.id !== id));
        message.success('Item removed from wishlist');
      },
    });
  };

  const handleAddToCart = (item: WishlistItem) => {
    if (!item.inStock) {
      message.warning('This item is currently out of stock');
      return;
    }
    message.success(`${item.productName} added to cart`);
  };

  const handleAddAllToCart = () => {
    const inStockItems = wishlistItems.filter((item) => item.inStock);
    if (inStockItems.length === 0) {
      message.warning('No items in stock');
      return;
    }
    message.success(`${inStockItems.length} items added to cart`);
  };

  const handleClearWishlist = () => {
    Modal.confirm({
      title: 'Clear Wishlist',
      content: 'Are you sure you want to clear all items from your wishlist?',
      onOk: () => {
        setWishlistItems([]);
        message.success('Wishlist cleared');
      },
    });
  };

  const handleShareWishlist = () => {
    setIsShareModalVisible(true);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    message.success('Link copied to clipboard');
  };

  const handleShareVia = (platform: string) => {
    message.success(`Sharing via ${platform}`);
    setIsShareModalVisible(false);
  };

  const totalValue = wishlistItems.reduce((sum, item) => sum + item.price, 0);
  const totalSavings = wishlistItems.reduce((sum, item) => sum + (item.originalPrice - item.price), 0);
  const inStockCount = wishlistItems.filter((item) => item.inStock).length;

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <div style={{ marginBottom: 24 }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={3}>
              <HeartFilled style={{ color: '#ff4d4f' }} /> My Wishlist
            </Title>
            <Paragraph type="secondary">
              Save items for later and track price changes
            </Paragraph>
          </Col>
          <Col>
            <Space>
              <Button icon={<ShareAltOutlined />} onClick={handleShareWishlist}>
                Share Wishlist
              </Button>
              {wishlistItems.length > 0 && (
                <Button danger onClick={handleClearWishlist}>
                  Clear All
                </Button>
              )}
            </Space>
          </Col>
        </Row>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Total Items"
              value={wishlistItems.length}
              prefix={<HeartOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Total Value"
              value={totalValue}
              prefix="$"
              precision={2}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Total Savings"
              value={totalSavings}
              prefix="$"
              precision={2}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      <Card>
        {wishlistItems.length === 0 ? (
          <Empty
            description="Your wishlist is empty"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          >
            <Button type="primary" href="/products">
              Start Shopping
            </Button>
          </Empty>
        ) : (
          <>
            <div style={{ marginBottom: 16 }}>
              <Space>
                <Button
                  type="primary"
                  icon={<ShoppingCartOutlined />}
                  onClick={handleAddAllToCart}
                  disabled={inStockCount === 0}
                >
                  Add All to Cart ({inStockCount})
                </Button>
                <Text type="secondary">
                  {wishlistItems.length} item{wishlistItems.length !== 1 ? 's' : ''} in your wishlist
                </Text>
              </Space>
            </div>

            <List
              itemLayout="horizontal"
              dataSource={wishlistItems}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <Tooltip title={item.inStock ? 'Add to Cart' : 'Out of Stock'}>
                      <Button
                        type="primary"
                        icon={<ShoppingCartOutlined />}
                        onClick={() => handleAddToCart(item)}
                        disabled={!item.inStock}
                      >
                        {item.inStock ? 'Add to Cart' : 'Out of Stock'}
                      </Button>
                    </Tooltip>,
                    <Tooltip title="Remove from Wishlist">
                      <Button
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        Remove
                      </Button>
                    </Tooltip>,
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <Badge
                        count={
                          !item.inStock ? (
                            <Tag color="red" style={{ marginTop: 0 }}>
                              Out of Stock
                            </Tag>
                          ) : item.originalPrice > item.price ? (
                            <Tag color="red" style={{ marginTop: 0 }}>
                              {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% OFF
                            </Tag>
                          ) : null
                        }
                        offset={[-10, 10]}
                      >
                        <Avatar
                          size={100}
                          shape="square"
                          style={{
                            background: '#f0f0f0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Text type="secondary" style={{ fontSize: 11 }}>Image</Text>
                        </Avatar>
                      </Badge>
                    }
                    title={
                      <Space direction="vertical" size={0}>
                        <Text strong style={{ fontSize: 16 }}>{item.productName}</Text>
                        <Text type="secondary" style={{ fontSize: 12 }}>{item.brand}</Text>
                      </Space>
                    }
                    description={
                      <Space direction="vertical" size="small" style={{ marginTop: 8 }}>
                        <Space>
                          <StarFilled style={{ color: '#faad14' }} />
                          <Text>
                            {item.rating} ({item.reviews} reviews)
                          </Text>
                        </Space>

                        <Space size="large">
                          <Space direction="vertical" size={0}>
                            <Text type="secondary" style={{ fontSize: 12 }}>Price</Text>
                            <Space>
                              <Text strong style={{ fontSize: 20, color: '#ff4d4f' }}>
                                ${item.price}
                              </Text>
                              {item.originalPrice > item.price && (
                                <Text delete type="secondary">
                                  ${item.originalPrice}
                                </Text>
                              )}
                            </Space>
                          </Space>

                          <Space direction="vertical" size={0}>
                            <Text type="secondary" style={{ fontSize: 12 }}>You Save</Text>
                            <Text strong style={{ color: '#52c41a' }}>
                              ${item.originalPrice - item.price}
                            </Text>
                          </Space>
                        </Space>

                        <Space direction="vertical" size={0}>
                          <Text type="secondary" style={{ fontSize: 11 }}>
                            Added on {dayjs(item.addedDate).format('MMM DD, YYYY')}
                          </Text>
                          {item.notes && (
                            <Text italic style={{ fontSize: 12 }}>
                              Note: {item.notes}
                            </Text>
                          )}
                        </Space>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />

            <Divider />

            <Row justify="space-between" align="middle">
              <Col>
                <Space direction="vertical" size={0}>
                  <Text strong style={{ fontSize: 16 }}>Total Value:</Text>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {wishlistItems.length} item{wishlistItems.length !== 1 ? 's' : ''}
                  </Text>
                </Space>
              </Col>
              <Col>
                <Space direction="vertical" size={0} style={{ textAlign: 'right' }}>
                  <Text strong style={{ fontSize: 24, color: '#ff4d4f' }}>
                    ${totalValue.toFixed(2)}
                  </Text>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    Total Savings: ${totalSavings.toFixed(2)}
                  </Text>
                </Space>
              </Col>
            </Row>
          </>
        )}
      </Card>

      <Modal
        title="Share Your Wishlist"
        open={isShareModalVisible}
        onCancel={() => setIsShareModalVisible(false)}
        footer={null}
        width={500}
      >
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div>
            <Text type="secondary">Share your wishlist with friends and family</Text>
          </div>

          <div>
            <Text strong style={{ display: 'block', marginBottom: 8 }}>
              Share Link
            </Text>
            <Space.Compact style={{ width: '100%' }}>
              <Input value={shareUrl} readOnly />
              <Button type="primary" icon={<LinkOutlined />} onClick={handleCopyLink}>
                Copy
              </Button>
            </Space.Compact>
          </div>

          <Divider>Or share via</Divider>

          <Row gutter={16}>
            <Col span={6}>
              <Button
                type="primary"
                icon={<FacebookOutlined />}
                block
                style={{ background: '#1877f2' }}
                onClick={() => handleShareVia('Facebook')}
              >
                Facebook
              </Button>
            </Col>
            <Col span={6}>
              <Button
                type="primary"
                icon={<TwitterOutlined />}
                block
                style={{ background: '#1da1f2' }}
                onClick={() => handleShareVia('Twitter')}
              >
                Twitter
              </Button>
            </Col>
            <Col span={6}>
              <Button
                type="primary"
                icon={<LinkedinOutlined />}
                block
                style={{ background: '#0077b5' }}
                onClick={() => handleShareVia('LinkedIn')}
              >
                LinkedIn
              </Button>
            </Col>
            <Col span={6}>
              <Button
                icon={<MailOutlined />}
                block
                onClick={() => handleShareVia('Email')}
              >
                Email
              </Button>
            </Col>
          </Row>
        </Space>
      </Modal>
    </div>
  );
};

export default WishlistPage;
