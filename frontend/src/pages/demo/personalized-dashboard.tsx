import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Button,
  Space,
  Switch,
  Divider,
  message,
  Select,
  Slider,
  ColorPicker,
  Input,
  Tag,
  List,
  Avatar,
  Checkbox,
} from 'antd';
import {
  DashboardOutlined,
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  DragOutlined,
  BarChartOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  DollarOutlined,
  HeartOutlined,
  SaveOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import type { Color } from 'antd/es/color-picker';

const { Title, Text, Paragraph } = Typography;

interface Widget {
  id: string;
  type: 'statistic' | 'chart' | 'list' | 'activity';
  title: string;
  icon: React.ReactNode;
  color: string;
  enabled: boolean;
  size: 'small' | 'medium' | 'large';
  position: number;
}

const availableWidgets: Widget[] = [
  {
    id: 'total_sales',
    type: 'statistic',
    title: 'Total Sales',
    icon: <DollarOutlined />,
    color: '#52c41a',
    enabled: true,
    size: 'small',
    position: 0,
  },
  {
    id: 'total_orders',
    type: 'statistic',
    title: 'Total Orders',
    icon: <ShoppingCartOutlined />,
    color: '#1890ff',
    enabled: true,
    size: 'small',
    position: 1,
  },
  {
    id: 'total_customers',
    type: 'statistic',
    title: 'Total Customers',
    icon: <UserOutlined />,
    color: '#722ed1',
    enabled: true,
    size: 'small',
    position: 2,
  },
  {
    id: 'wishlist_items',
    type: 'statistic',
    title: 'Wishlist Items',
    icon: <HeartOutlined />,
    color: '#ff4d4f',
    enabled: true,
    size: 'small',
    position: 3,
  },
  {
    id: 'sales_chart',
    type: 'chart',
    title: 'Sales Overview',
    icon: <BarChartOutlined />,
    color: '#1890ff',
    enabled: true,
    size: 'large',
    position: 4,
  },
  {
    id: 'recent_orders',
    type: 'list',
    title: 'Recent Orders',
    icon: <ShoppingCartOutlined />,
    color: '#ff9900',
    enabled: true,
    size: 'medium',
    position: 5,
  },
  {
    id: 'activity_feed',
    type: 'activity',
    title: 'Activity Feed',
    icon: <DashboardOutlined />,
    color: '#13c2c2',
    enabled: false,
    size: 'medium',
    position: 6,
  },
];

const PersonalizedDashboardPage: React.FC = () => {
  const [widgets, setWidgets] = useState<Widget[]>(availableWidgets);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [compactMode, setCompactMode] = useState(false);
  const [primaryColor, setPrimaryColor] = useState<Color | string>('#1890ff');
  const [refreshInterval, setRefreshInterval] = useState(30);
  const [showAnimations, setShowAnimations] = useState(true);

  const handleToggleWidget = (id: string) => {
    setWidgets((prev) =>
      prev.map((w) => (w.id === id ? { ...w, enabled: !w.enabled } : w))
    );
    message.success('Widget visibility updated');
  };

  const handleChangeWidgetSize = (id: string, size: 'small' | 'medium' | 'large') => {
    setWidgets((prev) =>
      prev.map((w) => (w.id === id ? { ...w, size } : w))
    );
    message.success('Widget size updated');
  };

  const handleSaveSettings = () => {
    const settings = {
      widgets,
      theme,
      compactMode,
      primaryColor,
      refreshInterval,
      showAnimations,
    };
    localStorage.setItem('dashboard_settings', JSON.stringify(settings));
    message.success('Dashboard settings saved successfully!');
  };

  const handleResetSettings = () => {
    setWidgets(availableWidgets);
    setTheme('light');
    setCompactMode(false);
    setPrimaryColor('#1890ff');
    setRefreshInterval(30);
    setShowAnimations(true);
    localStorage.removeItem('dashboard_settings');
    message.info('Dashboard settings reset to default');
  };

  const enabledWidgets = widgets.filter((w) => w.enabled).sort((a, b) => a.position - b.position);

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={3}>
          <DashboardOutlined style={{ color: '#1890ff' }} /> Personalized Dashboard
        </Title>
        <Paragraph type="secondary">
          Customize your dashboard layout, widgets, and appearance
        </Paragraph>
      </div>

      <Row gutter={16}>
        {/* Settings Panel */}
        <Col xs={24} lg={8}>
          <Card title="Dashboard Settings" style={{ marginBottom: 16 }}>
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              {/* Theme */}
              <div>
                <Text strong style={{ display: 'block', marginBottom: 8 }}>
                  Theme
                </Text>
                <Select
                  style={{ width: '100%' }}
                  value={theme}
                  onChange={setTheme}
                  options={[
                    { label: '☀️ Light Theme', value: 'light' },
                    { label: '🌙 Dark Theme', value: 'dark' },
                  ]}
                />
              </div>

              {/* Primary Color */}
              <div>
                <Text strong style={{ display: 'block', marginBottom: 8 }}>
                  Primary Color
                </Text>
                <ColorPicker
                  value={primaryColor}
                  onChange={setPrimaryColor}
                  showText
                  style={{ width: '100%' }}
                />
              </div>

              {/* Refresh Interval */}
              <div>
                <Text strong style={{ display: 'block', marginBottom: 8 }}>
                  Auto Refresh Interval: {refreshInterval}s
                </Text>
                <Slider
                  min={10}
                  max={300}
                  step={10}
                  value={refreshInterval}
                  onChange={setRefreshInterval}
                  marks={{
                    10: '10s',
                    60: '1m',
                    120: '2m',
                    300: '5m',
                  }}
                />
              </div>

              <Divider />

              {/* Display Options */}
              <div>
                <Text strong style={{ display: 'block', marginBottom: 12 }}>
                  Display Options
                </Text>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text>Compact Mode</Text>
                    <Switch checked={compactMode} onChange={setCompactMode} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text>Show Animations</Text>
                    <Switch checked={showAnimations} onChange={setShowAnimations} />
                  </div>
                </Space>
              </div>

              <Divider />

              {/* Action Buttons */}
              <Space style={{ width: '100%' }} direction="vertical">
                <Button
                  type="primary"
                  icon={<SaveOutlined />}
                  block
                  onClick={handleSaveSettings}
                >
                  Save Settings
                </Button>
                <Button
                  danger
                  icon={<ReloadOutlined />}
                  block
                  onClick={handleResetSettings}
                >
                  Reset to Default
                </Button>
              </Space>
            </Space>
          </Card>

          {/* Widget Manager */}
          <Card title="Widget Manager">
            <List
              dataSource={widgets}
              renderItem={(widget) => (
                <List.Item
                  actions={[
                    <Switch
                      key="toggle"
                      checked={widget.enabled}
                      onChange={() => handleToggleWidget(widget.id)}
                    />,
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        icon={widget.icon}
                        style={{ backgroundColor: widget.color }}
                      />
                    }
                    title={widget.title}
                    description={
                      <Space>
                        <Select
                          size="small"
                          value={widget.size}
                          onChange={(size) => handleChangeWidgetSize(widget.id, size)}
                          disabled={!widget.enabled}
                          style={{ width: 100 }}
                          options={[
                            { label: 'Small', value: 'small' },
                            { label: 'Medium', value: 'medium' },
                            { label: 'Large', value: 'large' },
                          ]}
                        />
                        <Tag color={widget.enabled ? 'green' : 'default'}>
                          {widget.type}
                        </Tag>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* Dashboard Preview */}
        <Col xs={24} lg={16}>
          <Card
            title={
              <Space>
                <DashboardOutlined />
                <span>Dashboard Preview</span>
                <Tag color="blue">{enabledWidgets.length} widgets</Tag>
              </Space>
            }
          >
            <Row gutter={[16, 16]}>
              {enabledWidgets.map((widget) => {
                const colSpan =
                  widget.size === 'small'
                    ? { xs: 24, sm: 12, md: 6 }
                    : widget.size === 'medium'
                    ? { xs: 24, sm: 12 }
                    : { xs: 24 };

                return (
                  <Col key={widget.id} {...colSpan}>
                    <Card
                      size={compactMode ? 'small' : 'default'}
                      style={{
                        borderLeft: `4px solid ${widget.color}`,
                        transition: showAnimations ? 'all 0.3s' : 'none',
                      }}
                      hoverable={showAnimations}
                    >
                      <Space direction="vertical" style={{ width: '100%' }}>
                        <Space>
                          <div style={{ fontSize: 24, color: widget.color }}>
                            {widget.icon}
                          </div>
                          <div>
                            <Text strong style={{ fontSize: 16 }}>
                              {widget.title}
                            </Text>
                            <div>
                              <Text type="secondary" style={{ fontSize: 12 }}>
                                {widget.type.toUpperCase()}
                              </Text>
                            </div>
                          </div>
                        </Space>

                        {/* Widget Content Preview */}
                        {widget.type === 'statistic' && (
                          <div style={{ padding: '16px 0' }}>
                            <div style={{ fontSize: 32, fontWeight: 'bold', color: widget.color }}>
                              {Math.floor(Math.random() * 10000)}
                            </div>
                            <Text type="secondary">
                              +{Math.floor(Math.random() * 20)}% from last month
                            </Text>
                          </div>
                        )}

                        {widget.type === 'chart' && (
                          <div
                            style={{
                              height: 200,
                              background: '#f0f0f0',
                              borderRadius: 4,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <BarChartOutlined style={{ fontSize: 48, color: '#bfbfbf' }} />
                          </div>
                        )}

                        {widget.type === 'list' && (
                          <List
                            size="small"
                            dataSource={[1, 2, 3]}
                            renderItem={(item) => (
                              <List.Item>
                                <Text>Order #1234{item}</Text>
                                <Tag color="blue">${(Math.random() * 100).toFixed(2)}</Tag>
                              </List.Item>
                            )}
                          />
                        )}

                        {widget.type === 'activity' && (
                          <Space direction="vertical" style={{ width: '100%' }} size="small">
                            {[1, 2, 3].map((i) => (
                              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <Avatar size="small" icon={<UserOutlined />} />
                                <Text type="secondary" style={{ fontSize: 12 }}>
                                  User action #{i}
                                </Text>
                              </div>
                            ))}
                          </Space>
                        )}
                      </Space>
                    </Card>
                  </Col>
                );
              })}

              {enabledWidgets.length === 0 && (
                <Col span={24}>
                  <div
                    style={{
                      textAlign: 'center',
                      padding: '60px 20px',
                      background: '#fafafa',
                      borderRadius: 8,
                    }}
                  >
                    <DashboardOutlined style={{ fontSize: 64, color: '#bfbfbf', marginBottom: 16 }} />
                    <Title level={4} type="secondary">
                      No Widgets Enabled
                    </Title>
                    <Paragraph type="secondary">
                      Enable widgets from the Widget Manager to customize your dashboard
                    </Paragraph>
                  </div>
                </Col>
              )}
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default PersonalizedDashboardPage;
