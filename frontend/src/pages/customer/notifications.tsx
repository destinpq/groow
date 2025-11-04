import React, { useState, useEffect } from 'react';
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
  Spin,
  message,
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
  DollarOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { notificationsAPI, type Notification, type NotificationPreferences } from '@/services/api/notifications';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

// Helper function to get icon and color for notification type
const getNotificationStyle = (type: Notification['type']) => {
  const styles = {
    order: { icon: <ShoppingOutlined />, color: '#1890ff' },
    payment: { icon: <DollarOutlined />, color: '#52c41a' },
    product: { icon: <GiftOutlined />, color: '#722ed1' },
    rfq: { icon: <FileTextOutlined />, color: '#13c2c2' },
    review: { icon: <StarOutlined />, color: '#faad14' },
    system: { icon: <NotificationOutlined />, color: '#ff9900' },
    promotion: { icon: <GiftOutlined />, color: '#ff4d4f' },
  };
  return styles[type] || styles.system;
};

const mockNotifications: Notification[] = [];

const CustomerNotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch notifications
  const fetchNotifications = async (filters?: { type?: string; isRead?: boolean }) => {
    try {
      setLoading(true);
      const data = await notificationsAPI.getAll(filters);
      setNotifications(data);
      
      // Update unread count
      const count = await notificationsAPI.getUnreadCount();
      setUnreadCount(count);
    } catch (error) {
      message.error('Failed to load notifications');
      console.error('Fetch notifications error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch preferences
  const fetchPreferences = async () => {
    try {
      const prefs = await notificationsAPI.getPreferences();
      setPreferences(prefs);
    } catch (error) {
      console.error('Fetch preferences error:', error);
    }
  };

  // Load data on mount
  useEffect(() => {
    fetchNotifications();
    fetchPreferences();
  }, []);

  const markAsRead = async (id: string) => {
    try {
      await notificationsAPI.markAsRead(id);
      setNotifications(notifications.map(n => 
        n.id === id ? { ...n, isRead: true } : n
      ));
      setUnreadCount(prev => Math.max(0, prev - 1));
      message.success('Marked as read');
    } catch (error) {
      message.error('Failed to mark as read');
      console.error('Mark as read error:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationsAPI.markAllAsRead();
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
      message.success('All notifications marked as read');
    } catch (error) {
      message.error('Failed to mark all as read');
      console.error('Mark all as read error:', error);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await notificationsAPI.delete(id);
      setNotifications(notifications.filter(n => n.id !== id));
      message.success('Notification deleted');
    } catch (error) {
      message.error('Failed to delete notification');
      console.error('Delete notification error:', error);
    }
  };

  const clearAllNotifications = async () => {
    try {
      await notificationsAPI.clearAll();
      setNotifications([]);
      setUnreadCount(0);
      message.success('All notifications cleared');
    } catch (error) {
      message.error('Failed to clear notifications');
      console.error('Clear all error:', error);
    }
  };

  const savePreferences = async (newPrefs: Partial<NotificationPreferences>) => {
    try {
      const updated = await notificationsAPI.updatePreferences(newPrefs);
      setPreferences(updated);
      message.success('Preferences saved successfully');
    } catch (error) {
      message.error('Failed to save preferences');
      console.error('Save preferences error:', error);
    }
  };

  const getMenuItems = (notification: Notification): MenuProps['items'] => [
    {
      key: 'read',
      label: notification.isRead ? 'Mark as unread' : 'Mark as read',
      icon: notification.isRead ? <CloseCircleOutlined /> : <CheckCircleOutlined />,
      onClick: () => markAsRead(notification.id),
    },
    {
      key: 'view',
      label: 'View details',
      icon: <EyeOutlined />,
      disabled: !notification.link,
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
    if (activeTab === 'unread') return !n.isRead;
    return n.type === activeTab;
  });

  const notificationsByType = {
    order: notifications.filter(n => n.type === 'order').length,
    promotion: notifications.filter(n => n.type === 'promotion').length,
    payment: notifications.filter(n => n.type === 'payment').length,
    review: notifications.filter(n => n.type === 'review').length,
    product: notifications.filter(n => n.type === 'product').length,
    rfq: notifications.filter(n => n.type === 'rfq').length,
    system: notifications.filter(n => n.type === 'system').length,
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
                  <Badge count={notificationsByType.payment} showZero>
                    <span>Payments</span>
                  </Badge>
                }
                key="payment"
              />
            </Tabs>

            {filteredNotifications.length === 0 ? (
              <Empty description="No notifications" />
            ) : (
              <Spin spinning={loading}>
                <List
                  itemLayout="horizontal"
                  dataSource={filteredNotifications}
                  renderItem={(notification) => {
                    const style = getNotificationStyle(notification.type);
                    return (
                      <List.Item
                        style={{
                          background: notification.isRead ? 'transparent' : '#e6f7ff',
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
                            <Badge dot={!notification.isRead}>
                              <Avatar
                                icon={style.icon}
                                style={{ backgroundColor: style.color }}
                              />
                            </Badge>
                          }
                          title={
                            <Space>
                              <Text strong={!notification.isRead}>{notification.title}</Text>
                              {!notification.isRead && <Tag color="blue">New</Tag>}
                            </Space>
                          }
                          description={
                            <Space direction="vertical" size="small">
                              <Text>{notification.message}</Text>
                              <Text type="secondary" style={{ fontSize: 12 }}>
                                {dayjs(notification.createdAt).fromNow()}
                              </Text>
                            </Space>
                          }
                        />
                      </List.Item>
                    );
                  }}
                />
              </Spin>
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
                      checked={preferences?.email?.orders ?? true}
                      onChange={(checked) => {
                        if (preferences) {
                          savePreferences({
                            email: { ...preferences.email, orders: checked }
                          });
                        }
                      }}
                    />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Space>
                      <NotificationOutlined style={{ color: '#52c41a' }} />
                      <Text>Push Notifications</Text>
                    </Space>
                    <Switch
                      checked={preferences?.push?.orders ?? true}
                      onChange={(checked) => {
                        if (preferences) {
                          savePreferences({
                            push: { ...preferences.push, orders: checked }
                          });
                        }
                      }}
                    />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Space>
                      <MobileOutlined style={{ color: '#faad14' }} />
                      <Text>SMS Notifications</Text>
                    </Space>
                    <Switch
                      checked={preferences?.sms?.orders ?? false}
                      onChange={(checked) => {
                        if (preferences) {
                          savePreferences({
                            sms: { ...preferences.sms, orders: checked }
                          });
                        }
                      }}
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
