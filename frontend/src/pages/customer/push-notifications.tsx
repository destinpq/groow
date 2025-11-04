import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Switch,
  Button,
  Space,
  Alert,
  List,
  Tag,
  Divider,
  message,
  Modal,
  Form,
  Select,
  Input,
  Badge,
  Statistic,
  Timeline,
} from 'antd';
import {
  BellOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  SettingOutlined,
  NotificationOutlined,
  MobileOutlined,
  DesktopOutlined,
  TabletOutlined,
  DeleteOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

interface PushDevice {
  id: number;
  name: string;
  type: 'mobile' | 'desktop' | 'tablet';
  browser: string;
  os: string;
  enabled: boolean;
  lastActive: string;
}

interface PushNotification {
  id: number;
  title: string;
  body: string;
  timestamp: string;
  status: 'delivered' | 'clicked' | 'dismissed';
  deviceType: string;
}

const mockDevices: PushDevice[] = [
  {
    id: 1,
    name: 'iPhone 13 Pro',
    type: 'mobile',
    browser: 'Safari',
    os: 'iOS 17.0',
    enabled: true,
    lastActive: '2024-11-10T10:30:00',
  },
  {
    id: 2,
    name: 'MacBook Pro',
    type: 'desktop',
    browser: 'Chrome',
    os: 'macOS 14.0',
    enabled: true,
    lastActive: '2024-11-10T09:15:00',
  },
  {
    id: 3,
    name: 'iPad Air',
    type: 'tablet',
    browser: 'Safari',
    os: 'iPadOS 17.0',
    enabled: false,
    lastActive: '2024-11-08T14:20:00',
  },
  {
    id: 4,
    name: 'Windows PC',
    type: 'desktop',
    browser: 'Edge',
    os: 'Windows 11',
    enabled: true,
    lastActive: '2024-11-09T16:45:00',
  },
];

const mockHistory: PushNotification[] = [
  {
    id: 1,
    title: 'Order Shipped',
    body: 'Your order #12345 has been shipped!',
    timestamp: '2024-11-10T10:30:00',
    status: 'clicked',
    deviceType: 'mobile',
  },
  {
    id: 2,
    title: 'Flash Sale',
    body: '50% off on Electronics - Limited time!',
    timestamp: '2024-11-10T08:00:00',
    status: 'delivered',
    deviceType: 'desktop',
  },
  {
    id: 3,
    title: 'Price Drop Alert',
    body: 'Wireless Headphones now $20 cheaper',
    timestamp: '2024-11-09T15:45:00',
    status: 'clicked',
    deviceType: 'mobile',
  },
  {
    id: 4,
    title: 'Order Delivered',
    body: 'Your package has been delivered',
    timestamp: '2024-11-08T14:20:00',
    status: 'dismissed',
    deviceType: 'desktop',
  },
];

const PushNotificationsPage: React.FC = () => {
  const [devices, setDevices] = useState<PushDevice[]>(mockDevices);
  const [history, setHistory] = useState<PushNotification[]>(mockHistory);
  const [masterEnabled, setMasterEnabled] = useState(true);
  const [permissionStatus, setPermissionStatus] = useState<'granted' | 'denied' | 'default'>('default');
  const [isTestModalVisible, setIsTestModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    // Check browser notification permission
    if ('Notification' in window) {
      setPermissionStatus(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setPermissionStatus(permission);
      if (permission === 'granted') {
        message.success('Push notifications enabled successfully!');
      } else {
        message.error('Push notifications permission denied');
      }
    } else {
      message.error('This browser does not support push notifications');
    }
  };

  const handleToggleDevice = (id: number, enabled: boolean) => {
    setDevices((prev) =>
      prev.map((device) => (device.id === id ? { ...device, enabled } : device))
    );
    message.success(`Push notifications ${enabled ? 'enabled' : 'disabled'} for this device`);
  };

  const handleRemoveDevice = (id: number) => {
    Modal.confirm({
      title: 'Remove Device',
      content: 'Are you sure you want to remove this device from push notifications?',
      okText: 'Remove',
      okType: 'danger',
      onOk: () => {
        setDevices((prev) => prev.filter((device) => device.id !== id));
        message.success('Device removed successfully');
      },
    });
  };

  const handleMasterToggle = (enabled: boolean) => {
    setMasterEnabled(enabled);
    if (!enabled) {
      setDevices((prev) => prev.map((device) => ({ ...device, enabled: false })));
      message.info('Push notifications disabled for all devices');
    } else {
      message.success('Push notifications enabled');
    }
  };

  const sendTestNotification = () => {
    form.validateFields().then((values) => {
      if (permissionStatus === 'granted' && 'Notification' in window) {
        const notification = new Notification(values.title, {
          body: values.body,
          icon: '/favicon.ico',
          badge: '/favicon.ico',
          tag: 'test-notification',
        });

        notification.onclick = () => {
          window.focus();
          notification.close();
        };

        const newHistoryItem: PushNotification = {
          id: Date.now(),
          title: values.title,
          body: values.body,
          timestamp: new Date().toISOString(),
          status: 'delivered',
          deviceType: 'desktop',
        };

        setHistory((prev) => [newHistoryItem, ...prev]);
        message.success('Test notification sent!');
        setIsTestModalVisible(false);
        form.resetFields();
      } else {
        message.error('Please enable push notifications first');
      }
    });
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'mobile':
        return <MobileOutlined style={{ fontSize: 24, color: '#1890ff' }} />;
      case 'desktop':
        return <DesktopOutlined style={{ fontSize: 24, color: '#52c41a' }} />;
      case 'tablet':
        return <TabletOutlined style={{ fontSize: 24, color: '#ff9900' }} />;
      default:
        return <NotificationOutlined style={{ fontSize: 24 }} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'blue';
      case 'clicked':
        return 'green';
      case 'dismissed':
        return 'default';
      default:
        return 'default';
    }
  };

  const enabledDevicesCount = devices.filter((d) => d.enabled).length;
  const clickRate = history.length > 0
    ? ((history.filter((h) => h.status === 'clicked').length / history.length) * 100).toFixed(1)
    : '0';

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={3}>
          <NotificationOutlined style={{ color: '#1890ff' }} /> Push Notifications
        </Title>
        <Paragraph type="secondary">
          Manage push notification settings and connected devices
        </Paragraph>
      </div>

      {/* Permission Status Alert */}
      {permissionStatus === 'denied' && (
        <Alert
          message="Push Notifications Blocked"
          description="You have blocked push notifications. Please enable them in your browser settings."
          type="error"
          showIcon
          icon={<CloseCircleOutlined />}
          style={{ marginBottom: 16 }}
        />
      )}

      {permissionStatus === 'default' && (
        <Alert
          message="Enable Push Notifications"
          description="Get instant updates about your orders, promotions, and more. Click the button below to enable."
          type="info"
          showIcon
          icon={<BellOutlined />}
          action={
            <Button type="primary" onClick={requestPermission}>
              Enable Now
            </Button>
          }
          style={{ marginBottom: 16 }}
        />
      )}

      {/* Statistics */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Active Devices"
              value={enabledDevicesCount}
              suffix={`/ ${devices.length}`}
              prefix={<MobileOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Notifications Sent"
              value={history.length}
              prefix={<BellOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Click Rate"
              value={clickRate}
              suffix="%"
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#ff9900' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        {/* Devices */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <SettingOutlined />
                <span>Connected Devices</span>
                <Badge count={enabledDevicesCount} showZero />
              </Space>
            }
            extra={
              <Space>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Master Control
                </Text>
                <Switch
                  checked={masterEnabled}
                  onChange={handleMasterToggle}
                  checkedChildren={<PlayCircleOutlined />}
                  unCheckedChildren={<PauseCircleOutlined />}
                />
              </Space>
            }
          >
            <List
              dataSource={devices}
              renderItem={(device) => (
                <List.Item
                  actions={[
                    <Switch
                      key="toggle"
                      checked={device.enabled}
                      onChange={(checked) => handleToggleDevice(device.id, checked)}
                      disabled={!masterEnabled}
                    />,
                    <Button
                      key="remove"
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => handleRemoveDevice(device.id)}
                    />,
                  ]}
                >
                  <List.Item.Meta
                    avatar={getDeviceIcon(device.type)}
                    title={
                      <Space>
                        <Text strong>{device.name}</Text>
                        {device.enabled && <Tag color="green">Active</Tag>}
                      </Space>
                    }
                    description={
                      <Space direction="vertical" size={0}>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          {device.browser} • {device.os}
                        </Text>
                        <Text type="secondary" style={{ fontSize: 11 }}>
                          Last active: {new Date(device.lastActive).toLocaleString()}
                        </Text>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />

            <Divider />

            <Space style={{ width: '100%', justifyContent: 'center' }}>
              <Button
                type="primary"
                icon={<BellOutlined />}
                onClick={() => setIsTestModalVisible(true)}
                disabled={permissionStatus !== 'granted' || !masterEnabled}
              >
                Send Test Notification
              </Button>
            </Space>
          </Card>
        </Col>

        {/* History */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <BellOutlined />
                <span>Recent Notifications</span>
              </Space>
            }
          >
            <Timeline
              items={history.slice(0, 10).map((item) => ({
                color: getStatusColor(item.status) as any,
                children: (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                      <div style={{ flex: 1 }}>
                        <Text strong>{item.title}</Text>
                        <div>
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            {item.body}
                          </Text>
                        </div>
                      </div>
                      <Tag color={getStatusColor(item.status)} style={{ marginLeft: 8 }}>
                        {item.status}
                      </Tag>
                    </div>
                    <div style={{ marginTop: 4 }}>
                      <Space size={4}>
                        {getDeviceIcon(item.deviceType)}
                        <Text type="secondary" style={{ fontSize: 11 }}>
                          {new Date(item.timestamp).toLocaleString()}
                        </Text>
                      </Space>
                    </div>
                  </div>
                ),
              }))}
            />
          </Card>
        </Col>
      </Row>

      {/* Test Notification Modal */}
      <Modal
        title="Send Test Push Notification"
        open={isTestModalVisible}
        onOk={sendTestNotification}
        onCancel={() => {
          setIsTestModalVisible(false);
          form.resetFields();
        }}
        okText="Send"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: 'Please enter a title' }]}
            initialValue="Test Notification"
          >
            <Input placeholder="Notification title" />
          </Form.Item>
          <Form.Item
            name="body"
            label="Message"
            rules={[{ required: true, message: 'Please enter a message' }]}
            initialValue="This is a test push notification from your e-commerce platform!"
          >
            <TextArea rows={3} placeholder="Notification message" />
          </Form.Item>
          <Alert
            message="Note"
            description="This will send a real browser notification if you have granted permission."
            type="info"
            showIcon
            style={{ marginTop: 16 }}
          />
        </Form>
      </Modal>
    </div>
  );
};

export default PushNotificationsPage;
