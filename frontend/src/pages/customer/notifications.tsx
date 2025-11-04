import React, { useState } from 'react';
import {
  Card,
  List,
  Badge,
  Button,
  Space,
  Typography,
  Avatar,
  Tag,
  Tabs,
  Dropdown,
  Popconfirm,
  Empty,
  Divider,
  Switch,
  Form,
  Select,
  Checkbox,
  Row,
  Col,
  Statistic,
} from 'antd';
import {
  BellOutlined,
  ShoppingOutlined,
  StarOutlined,
  GiftOutlined,
  TruckOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  MoreOutlined,
  SettingOutlined,
  DeleteOutlined,
  EyeOutlined,
  MailOutlined,
  MobileOutlined,
  NotificationOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

interface Notification {
  id: number;
  type: 'order' | 'promotion' | 'review' | 'delivery' | 'wishlist' | 'account';
  title: string;
  message: string;
  time: string;
  read: boolean;
  icon: React.ReactNode;
  color: string;
  actionUrl?: string;
}

const mockNotifications: Notification[] = [
  {
    id: 1,
    type: 'order',
    title: 'Order Shipped',
    message: 'Your order #12345 has been shipped and is on the way',
    time: '2 hours ago',
    read: false,
    icon: <TruckOutlined />,
    color: '#1890ff',
    actionUrl: '/customer/orders/12345',
  },
  {
    id: 2,
    type: 'promotion',
    title: 'Flash Sale Alert',
    message: '50% off on Electronics - Limited time offer!',
    time: '5 hours ago',
    read: false,
    icon: <GiftOutlined />,
    color: '#ff4d4f',
  },
  {
    id: 3,
    type: 'delivery',
    title: 'Delivery Completed',
    message: 'Your order #12340 has been delivered successfully',
    time: '1 day ago',
    read: true,
    icon: <CheckCircleOutlined />,
    color: '#52c41a',
  },
  {
    id: 4,
    type: 'review',
    title: 'Review Reminder',
    message: 'How was your recent purchase? Share your experience',
    time: '2 days ago',
    read: true,
    icon: <StarOutlined />,
    color: '#faad14',
  },
  {
    id: 5,
    type: 'wishlist',
    title: 'Price Drop Alert',
    message: 'Item in your wishlist is now 30% off - Wireless Headphones',
    time: '3 days ago',
    read: false,
    icon: <BellOutlined />,
    color: '#722ed1',
  },
  {
    id: 6,
    type: 'order',
    title: 'Order Confirmed',
    message: 'Your order #12346 has been confirmed and is being processed',
    time: '3 days ago',
    read: true,
    icon: <ShoppingOutlined />,
    color: '#1890ff',
  },
  {
    id: 7,
    type: 'account',
    title: 'Security Alert',
    message: 'New login detected from Chrome on Windows',
    time: '1 week ago',
    read: true,
    icon: <NotificationOutlined />,
    color: '#ff9900',
  },
];

const CustomerNotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [activeTab, setActiveTab] = useState('all');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const getMenuItems = (notification: Notification): MenuProps['items'] => [
    {
      key: 'read',
      label: notification.read ? 'Mark as unread' : 'Mark as read',
      icon: notification.read ? <CloseCircleOutlined /> : <CheckCircleOutlined />,
      onClick: () => markAsRead(notification.id),
    },
    {
      key: 'view',
      label: 'View details',
      icon: <EyeOutlined />,
      disabled: !notification.actionUrl,
    },
    {
      type: 'divider',
    },
    {
      key: 'delete',
      label: 'Delete',
      icon: <DeleteOutlined />,
      danger: true,
      onClick: () => deleteNotification(notification.id),
    },
  ];

  const filteredNotifications = notifications.filter(n => {
    if (activeTab === 'all') return true;
    if (activeTab === 'unread') return !n.read;
    return n.type === activeTab;
  });

  const notificationsByType = {
    order: notifications.filter(n => n.type === 'order').length,
    promotion: notifications.filter(n => n.type === 'promotion').length,
    delivery: notifications.filter(n => n.type === 'delivery').length,
    review: notifications.filter(n => n.type === 'review').length,
    wishlist: notifications.filter(n => n.type === 'wishlist').length,
    account: notifications.filter(n => n.type === 'account').length,
  };

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={3}>
          <BellOutlined /> Notifications
          {unreadCount > 0 && (
            <Badge count={unreadCount} style={{ marginLeft: 12 }} />
          )}
        </Title>
      </div>

      <Row gutter={16}>
        {/* Main Notifications */}
        <Col xs={24} lg={16}>
          <Card
            title={
              <Space>
                <Text>Notification Center</Text>
                {unreadCount > 0 && (
                  <Tag color="red">{unreadCount} unread</Tag>
                )}
              </Space>
            }
            extra={
              <Space>
                <Button
                  type="link"
                  onClick={markAllAsRead}
                  disabled={unreadCount === 0}
                >
                  Mark all as read
                </Button>
                <Popconfirm
                  title="Clear all notifications?"
                  description="This action cannot be undone."
                  onConfirm={clearAllNotifications}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button danger type="text" icon={<DeleteOutlined />}>
                    Clear all
                  </Button>
                </Popconfirm>
              </Space>
            }
          >
            <Tabs activeKey={activeTab} onChange={setActiveTab}>
              <TabPane
                tab={
                  <Badge count={notifications.length} showZero>
                    <span>All</span>
                  </Badge>
                }
                key="all"
              />
              <TabPane
                tab={
                  <Badge count={unreadCount}>
                    <span>Unread</span>
                  </Badge>
                }
                key="unread"
              />
              <TabPane
                tab={
                  <Badge count={notificationsByType.order} showZero>
                    <span>Orders</span>
                  </Badge>
                }
                key="order"
              />
              <TabPane
                tab={
                  <Badge count={notificationsByType.promotion} showZero>
                    <span>Promotions</span>
                  </Badge>
                }
                key="promotion"
              />
              <TabPane
                tab={
                  <Badge count={notificationsByType.delivery} showZero>
                    <span>Delivery</span>
                  </Badge>
                }
                key="delivery"
              />
            </Tabs>

            {filteredNotifications.length === 0 ? (
              <Empty description="No notifications" />
            ) : (
              <List
                itemLayout="horizontal"
                dataSource={filteredNotifications}
                renderItem={(notification) => (
                  <List.Item
                    style={{
                      background: notification.read ? 'transparent' : '#e6f7ff',
                      padding: 16,
                      borderRadius: 8,
                      marginBottom: 8,
                    }}
                    actions={[
                      <Dropdown
                        menu={{ items: getMenuItems(notification) }}
                        trigger={['click']}
                      >
                        <Button type="text" icon={<MoreOutlined />} />
                      </Dropdown>,
                    ]}
                  >
                    <List.Item.Meta
                      avatar={
                        <Badge dot={!notification.read}>
                          <Avatar
                            icon={notification.icon}
                            style={{ backgroundColor: notification.color }}
                          />
                        </Badge>
                      }
                      title={
                        <Space>
                          <Text strong={!notification.read}>{notification.title}</Text>
                          {!notification.read && <Tag color="blue">New</Tag>}
                        </Space>
                      }
                      description={
                        <Space direction="vertical" size="small">
                          <Text>{notification.message}</Text>
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            {notification.time}
                          </Text>
                        </Space>
                      }
                    />
                  </List.Item>
                )}
              />
            )}
          </Card>
        </Col>

        {/* Notification Settings */}
        <Col xs={24} lg={8}>
          <Card title={<><SettingOutlined /> Notification Settings</>}>
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              {/* Statistics */}
              <div>
                <Title level={5}>Overview</Title>
                <Row gutter={16}>
                  <Col span={12}>
                    <Statistic
                      title="Total"
                      value={notifications.length}
                      prefix={<BellOutlined />}
                      valueStyle={{ fontSize: 20 }}
                    />
                  </Col>
                  <Col span={12}>
                    <Statistic
                      title="Unread"
                      value={unreadCount}
                      valueStyle={{ fontSize: 20, color: '#ff4d4f' }}
                    />
                  </Col>
                </Row>
              </div>

              <Divider />

              {/* Channels */}
              <div>
                <Title level={5}>Notification Channels</Title>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Space>
                      <MailOutlined style={{ color: '#1890ff' }} />
                      <Text>Email Notifications</Text>
                    </Space>
                    <Switch
                      checked={emailNotifications}
                      onChange={setEmailNotifications}
                    />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Space>
                      <NotificationOutlined style={{ color: '#52c41a' }} />
                      <Text>Push Notifications</Text>
                    </Space>
                    <Switch
                      checked={pushNotifications}
                      onChange={setPushNotifications}
                    />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Space>
                      <MobileOutlined style={{ color: '#faad14' }} />
                      <Text>SMS Notifications</Text>
                    </Space>
                    <Switch
                      checked={smsNotifications}
                      onChange={setSmsNotifications}
                    />
                  </div>
                </Space>
              </div>

              <Divider />

              {/* Preferences */}
              <div>
                <Title level={5}>Notification Preferences</Title>
                <Form layout="vertical">
                  <Form.Item label="Notify me about">
                    <Checkbox.Group style={{ width: '100%' }} defaultValue={['orders', 'promotions', 'delivery']}>
                      <Space direction="vertical" style={{ width: '100%' }}>
                        <Checkbox value="orders">Order updates</Checkbox>
                        <Checkbox value="promotions">Promotions & offers</Checkbox>
                        <Checkbox value="delivery">Delivery status</Checkbox>
                        <Checkbox value="reviews">Review reminders</Checkbox>
                        <Checkbox value="wishlist">Wishlist price drops</Checkbox>
                        <Checkbox value="account">Account activity</Checkbox>
                      </Space>
                    </Checkbox.Group>
                  </Form.Item>

                  <Form.Item label="Notification Frequency">
                    <Select defaultValue="instant" style={{ width: '100%' }}>
                      <Option value="instant">Instant</Option>
                      <Option value="hourly">Hourly digest</Option>
                      <Option value="daily">Daily digest</Option>
                      <Option value="weekly">Weekly digest</Option>
                    </Select>
                  </Form.Item>

                  <Form.Item label="Quiet Hours">
                    <Select defaultValue="none" style={{ width: '100%' }}>
                      <Option value="none">None</Option>
                      <Option value="night">10 PM - 8 AM</Option>
                      <Option value="work">9 AM - 5 PM</Option>
                      <Option value="custom">Custom</Option>
                    </Select>
                  </Form.Item>

                  <Button type="primary" block>
                    Save Preferences
                  </Button>
                </Form>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CustomerNotificationsPage;
