import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Button,
  Space,
  Tabs,
  List,
  Avatar,
  Tag,
  Badge,
  Input,
  Select,
  Empty,
  Divider,
  Alert,
  message,
  Dropdown,
  Menu,
} from 'antd';
import {
  BellOutlined,
  ShoppingCartOutlined,
  GiftOutlined,
  TruckOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  StarOutlined,
  DollarOutlined,
  HeartOutlined,
  MessageOutlined,
  MoreOutlined,
  DeleteOutlined,
  EyeOutlined,
  SettingOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { notificationsAPI, Notification } from '@/services/api';

dayjs.extend(relativeTime);

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { Search } = Input;

const mockNotifications: Notification[] = [
  {
    id: 1,
    type: 'order',
    title: 'Order Shipped',
    message: 'Your order #12345 has been shipped and will arrive by Dec 15',
    timestamp: dayjs().subtract(10, 'minutes').toISOString(),
    isRead: false,
    priority: 'high',
    actionUrl: '/orders/12345',
    actionText: 'Track Order',
    image: 'https://via.placeholder.com/40?text=Order',
  },
  {
    id: 2,
    type: 'promotion',
    title: '🎉 Flash Sale Alert',
    message: '50% off on all electronics! Sale ends in 2 hours. Shop now!',
    timestamp: dayjs().subtract(1, 'hour').toISOString(),
    isRead: false,
    priority: 'high',
    actionUrl: '/sales/flash',
    actionText: 'Shop Now',
    image: 'https://via.placeholder.com/40?text=Sale',
  },
  {
    id: 3,
    type: 'shipping',
    title: 'Delivery Completed',
    message: 'Your package has been delivered. Rate your experience!',
    timestamp: dayjs().subtract(3, 'hours').toISOString(),
    isRead: true,
    priority: 'medium',
    actionUrl: '/orders/12344',
    actionText: 'Rate Order',
    image: 'https://via.placeholder.com/40?text=Delivered',
  },
  {
    id: 4,
    type: 'payment',
    title: 'Payment Successful',
    message: 'Your payment of $299.99 for order #12346 was successful',
    timestamp: dayjs().subtract(5, 'hours').toISOString(),
    isRead: true,
    priority: 'medium',
    image: 'https://via.placeholder.com/40?text=Pay',
  },
  {
    id: 5,
    type: 'wishlist',
    title: 'Price Drop Alert',
    message: 'iPhone 16 Pro Max in your wishlist is now 15% off!',
    timestamp: dayjs().subtract(1, 'day').toISOString(),
    isRead: false,
    priority: 'medium',
    actionUrl: '/product/iphone-16',
    actionText: 'View Product',
    image: 'https://via.placeholder.com/40?text=Phone',
  },
  {
    id: 6,
    type: 'review',
    title: 'Review Request',
    message: 'How was your Sony WH-1000XM5 Headphones? Share your feedback',
    timestamp: dayjs().subtract(2, 'days').toISOString(),
    isRead: true,
    priority: 'low',
    actionUrl: '/reviews/write/101',
    actionText: 'Write Review',
    image: 'https://via.placeholder.com/40?text=Review',
  },
  {
    id: 7,
    type: 'message',
    title: 'New Message from Seller',
    message: 'TechStore responded to your question about warranty',
    timestamp: dayjs().subtract(3, 'days').toISOString(),
    isRead: false,
    priority: 'medium',
    actionUrl: '/messages/techstore',
    actionText: 'View Message',
    image: 'https://via.placeholder.com/40?text=Msg',
  },
  {
    id: 8,
    type: 'system',
    title: 'Account Security Alert',
    message: 'New login detected from Chrome on Windows. Was this you?',
    timestamp: dayjs().subtract(4, 'days').toISOString(),
    isRead: true,
    priority: 'high',
    actionUrl: '/security',
    actionText: 'Review Activity',
    image: 'https://via.placeholder.com/40?text=Security',
  },
  {
    id: 9,
    type: 'promotion',
    title: 'Welcome Offer',
    message: 'Get 20% off your first order with code WELCOME20',
    timestamp: dayjs().subtract(5, 'days').toISOString(),
    isRead: true,
    priority: 'low',
    actionUrl: '/coupons',
    actionText: 'View Coupons',
    image: 'https://via.placeholder.com/40?text=Gift',
  },
  {
    id: 10,
    type: 'order',
    title: 'Order Confirmed',
    message: 'Your order #12343 has been confirmed and is being processed',
    timestamp: dayjs().subtract(7, 'days').toISOString(),
    isRead: true,
    priority: 'medium',
    actionUrl: '/orders/12343',
    actionText: 'View Order',
    image: 'https://via.placeholder.com/40?text=Confirm',
  },
];

const NotificationCenterPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('all');

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const response = await notificationsAPI.getAll();
      setNotifications(response || []);
    } catch (error) {
      message.error('Failed to load notifications');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const typeConfig: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
    order: { icon: <ShoppingCartOutlined />, color: '#1890ff', label: 'Orders' },
    promotion: { icon: <GiftOutlined />, color: '#52c41a', label: 'Promotions' },
    product: { icon: <TruckOutlined />, color: '#fa8c16', label: 'Products' },
    payment: { icon: <DollarOutlined />, color: '#722ed1', label: 'Payments' },
    review: { icon: <StarOutlined />, color: '#faad14', label: 'Reviews' },
    rfq: { icon: <HeartOutlined />, color: '#eb2f96', label: 'RFQ' },
    system: { icon: <WarningOutlined />, color: '#f5222d', label: 'System' },
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await notificationsAPI.markAsRead(id);
      setNotifications(
        notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (error) {
      message.error('Failed to mark as read');
      console.error(error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationsAPI.markAllAsRead();
      setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
      message.success('All notifications marked as read');
    } catch (error) {
      message.error('Failed to mark all as read');
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await notificationsAPI.markAsRead(id); // Use markAsRead as delete
      setNotifications(notifications.filter((n) => n.id !== id));
      message.success('Notification deleted');
    } catch (error) {
      message.error('Failed to delete notification');
      console.error(error);
    }
  };

  const handleClearAll = () => {
    setNotifications(notifications.filter((n) => !n.isRead));
    message.success('All read notifications cleared');
  };

  const filteredNotifications = notifications.filter((n) => {
    const typeMatch = filterType === 'all' || n.type === filterType;
    const searchMatch =
      searchQuery === '' ||
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.message.toLowerCase().includes(searchQuery.toLowerCase());
    const tabMatch =
      activeTab === 'all' ||
      (activeTab === 'unread' && !n.isRead) ||
      (activeTab === 'read' && n.isRead);
    return typeMatch && searchMatch && tabMatch;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const highPriorityCount = 0; // Priority not in API

  const notificationMenu = (notification: Notification) => (
    <Menu>
      <Menu.Item
        key="view"
        icon={<EyeOutlined />}
        onClick={() => {
          handleMarkAsRead(notification.id);
          message.info('Viewing notification details');
        }}
      >
        View Details
      </Menu.Item>
      <Menu.Item
        key="mark"
        icon={<CheckCircleOutlined />}
        onClick={() => handleMarkAsRead(notification.id)}
        disabled={notification.isRead}
      >
        Mark as Read
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item
        key="delete"
        icon={<DeleteOutlined />}
        danger
        onClick={() => handleDelete(notification.id)}
      >
        Delete
      </Menu.Item>
    </Menu>
  );

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={3}>
            <Badge count={unreadCount} offset={[10, 0]}>
              <BellOutlined style={{ color: '#1890ff', marginRight: 8 }} />
            </Badge>
            Notification Center
          </Title>
          <Paragraph type="secondary">
            Stay updated with your orders, promotions, and more
          </Paragraph>
        </Col>
        <Col>
          <Space>
            <Button onClick={handleMarkAllAsRead} disabled={unreadCount === 0}>
              Mark All as Read
            </Button>
            <Button onClick={handleClearAll} disabled={notifications.every((n) => !n.isRead)}>
              Clear Read
            </Button>
            <Button icon={<SettingOutlined />}>Settings</Button>
          </Space>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  background: '#e6f7ff',
                  borderRadius: 8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <BellOutlined style={{ fontSize: 24, color: '#1890ff' }} />
              </div>
              <div>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Unread Notifications
                </Text>
                <div>
                  <Text strong style={{ fontSize: 24 }}>
                    {unreadCount}
                  </Text>
                </div>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={8}>
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  background: '#fff7e6',
                  borderRadius: 8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <WarningOutlined style={{ fontSize: 24, color: '#fa8c16' }} />
              </div>
              <div>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  High Priority
                </Text>
                <div>
                  <Text strong style={{ fontSize: 24 }}>
                    {highPriorityCount}
                  </Text>
                </div>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={8}>
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  background: '#f6ffed',
                  borderRadius: 8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CheckCircleOutlined style={{ fontSize: 24, color: '#52c41a' }} />
              </div>
              <div>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Total Notifications
                </Text>
                <div>
                  <Text strong style={{ fontSize: 24 }}>
                    {notifications.length}
                  </Text>
                </div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {highPriorityCount > 0 && (
        <Alert
          message={`You have ${highPriorityCount} high priority notification${highPriorityCount > 1 ? 's' : ''}`}
          description="Please review and take action on important notifications"
          type="warning"
          showIcon
          icon={<WarningOutlined />}
          closable
          style={{ marginBottom: 16 }}
        />
      )}

      <Card>
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Search
                placeholder="Search notifications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                allowClear
                size="large"
              />
            </Col>
            <Col xs={24} md={12}>
              <Select
                value={filterType}
                onChange={setFilterType}
                style={{ width: '100%' }}
                size="large"
              >
                <Option value="all">All Types</Option>
                {Object.entries(typeConfig).map(([key, config]) => (
                  <Option key={key} value={key}>
                    {config.icon} {config.label}
                  </Option>
                ))}
              </Select>
            </Col>
          </Row>

          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={[
              {
                key: 'all',
                label: (
                  <span>
                    All
                    <Badge
                      count={notifications.length}
                      style={{ marginLeft: 8, backgroundColor: '#d9d9d9' }}
                    />
                  </span>
                ),
              },
              {
                key: 'unread',
                label: (
                  <span>
                    Unread
                    <Badge count={unreadCount} style={{ marginLeft: 8 }} />
                  </span>
                ),
              },
              {
                key: 'read',
                label: (
                  <span>
                    Read
                    <Badge
                      count={notifications.length - unreadCount}
                      style={{ marginLeft: 8, backgroundColor: '#52c41a' }}
                    />
                  </span>
                ),
              },
            ]}
          />

          {filteredNotifications.length === 0 ? (
            <Empty
              description={
                searchQuery
                  ? 'No notifications found'
                  : activeTab === 'unread'
                  ? "You're all caught up!"
                  : 'No notifications'
              }
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          ) : (
            <List
              dataSource={filteredNotifications}
              renderItem={(notification) => {
                const config = typeConfig[notification.type];
                return (
                  <List.Item
                    key={notification.id}
                    style={{
                      background: notification.isRead ? '#fff' : '#e6f7ff',
                      padding: '16px',
                      marginBottom: 8,
                      borderRadius: 8,
                      border: notification.isRead ? '1px solid #f0f0f0' : '1px solid #91d5ff',
                    }}
                    actions={[
                      <Button
                        type="link"
                        onClick={() => {
                          handleMarkAsRead(notification.id);
                          message.info('Viewing notification');
                        }}
                      >
                        View
                      </Button>,
                      <Dropdown overlay={notificationMenu(notification)} trigger={['click']}>
                        <Button type="text" icon={<MoreOutlined />} />
                      </Dropdown>,
                    ]}
                  >
                    <List.Item.Meta
                      avatar={
                        <Badge dot={!notification.isRead} offset={[-5, 5]}>
                          <Avatar
                            icon={config.icon}
                            style={{ backgroundColor: config.color }}
                            size={48}
                          />
                        </Badge>
                      }
                      title={
                        <Space>
                          <Text strong={!notification.isRead}>{notification.title}</Text>
                          <Tag color={config.color}>{config.label}</Tag>
                        </Space>
                      }
                      description={
                        <div>
                          <Paragraph
                            style={{ margin: 0, marginBottom: 8 }}
                            ellipsis={{ rows: 2 }}
                          >
                            {notification.message}
                          </Paragraph>
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            <ClockCircleOutlined /> {dayjs(notification.createdAt).fromNow()}
                          </Text>
                        </div>
                      }
                    />
                  </List.Item>
                );
              }}
            />
          )}
        </Space>
      </Card>
    </div>
  );
};

export default NotificationCenterPage;
