import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Tag,
  Divider,
  Space,
  Grid,
  Alert,
  Table,
  List,
  Button,
  Drawer,
  Descriptions,
} from 'antd';
import {
  DesktopOutlined,
  TabletOutlined,
  MobileOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text, Paragraph } = Typography;
const { useBreakpoint } = Grid;

interface Breakpoint {
  name: string;
  key: string;
  minWidth: number;
  icon: React.ReactNode;
  color: string;
}

interface ResponsiveFeature {
  feature: string;
  mobile: boolean;
  tablet: boolean;
  desktop: boolean;
  status: 'complete' | 'partial' | 'pending';
}

const breakpoints: Breakpoint[] = [
  {
    name: 'Mobile (XS)',
    key: 'xs',
    minWidth: 0,
    icon: <MobileOutlined />,
    color: '#ff4d4f',
  },
  {
    name: 'Mobile (SM)',
    key: 'sm',
    minWidth: 576,
    icon: <MobileOutlined />,
    color: '#ff9900',
  },
  {
    name: 'Tablet (MD)',
    key: 'md',
    minWidth: 768,
    icon: <TabletOutlined />,
    color: '#1890ff',
  },
  {
    name: 'Desktop (LG)',
    key: 'lg',
    minWidth: 992,
    icon: <DesktopOutlined />,
    color: '#52c41a',
  },
  {
    name: 'Large Desktop (XL)',
    key: 'xl',
    minWidth: 1200,
    icon: <DesktopOutlined />,
    color: '#722ed1',
  },
  {
    name: 'Extra Large (XXL)',
    key: 'xxl',
    minWidth: 1600,
    icon: <DesktopOutlined />,
    color: '#13c2c2',
  },
];

const responsiveFeatures: ResponsiveFeature[] = [
  {
    feature: 'Navigation Menu',
    mobile: true,
    tablet: true,
    desktop: true,
    status: 'complete',
  },
  {
    feature: 'Product Grid Layout',
    mobile: true,
    tablet: true,
    desktop: true,
    status: 'complete',
  },
  {
    feature: 'Shopping Cart',
    mobile: true,
    tablet: true,
    desktop: true,
    status: 'complete',
  },
  {
    feature: 'Product Details',
    mobile: true,
    tablet: true,
    desktop: true,
    status: 'complete',
  },
  {
    feature: 'Checkout Flow',
    mobile: true,
    tablet: true,
    desktop: true,
    status: 'complete',
  },
  {
    feature: 'User Profile',
    mobile: true,
    tablet: true,
    desktop: true,
    status: 'complete',
  },
  {
    feature: 'Dashboard Charts',
    mobile: true,
    tablet: true,
    desktop: true,
    status: 'complete',
  },
  {
    feature: 'Data Tables',
    mobile: true,
    tablet: true,
    desktop: true,
    status: 'complete',
  },
  {
    feature: 'Forms & Modals',
    mobile: true,
    tablet: true,
    desktop: true,
    status: 'complete',
  },
  {
    feature: 'Image Gallery',
    mobile: true,
    tablet: true,
    desktop: true,
    status: 'complete',
  },
];

const ResponsiveDesignPage: React.FC = () => {
  const screens = useBreakpoint();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [drawerVisible, setDrawerVisible] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getCurrentBreakpoint = (): Breakpoint | undefined => {
    const activeBreakpoints = Object.entries(screens)
      .filter(([_, active]) => active)
      .map(([key]) => key);

    if (activeBreakpoints.includes('xxl')) return breakpoints[5];
    if (activeBreakpoints.includes('xl')) return breakpoints[4];
    if (activeBreakpoints.includes('lg')) return breakpoints[3];
    if (activeBreakpoints.includes('md')) return breakpoints[2];
    if (activeBreakpoints.includes('sm')) return breakpoints[1];
    return breakpoints[0];
  };

  const currentBreakpoint = getCurrentBreakpoint();
  const isMobile = !screens.md;

  const columns: ColumnsType<ResponsiveFeature> = [
    {
      title: 'Feature',
      dataIndex: 'feature',
      key: 'feature',
      fixed: isMobile ? undefined : 'left',
    },
    {
      title: 'Mobile',
      key: 'mobile',
      align: 'center',
      render: (_, record) =>
        record.mobile ? (
          <CheckCircleOutlined style={{ color: '#52c41a', fontSize: 18 }} />
        ) : (
          <CloseCircleOutlined style={{ color: '#ff4d4f', fontSize: 18 }} />
        ),
    },
    {
      title: 'Tablet',
      key: 'tablet',
      align: 'center',
      render: (_, record) =>
        record.tablet ? (
          <CheckCircleOutlined style={{ color: '#52c41a', fontSize: 18 }} />
        ) : (
          <CloseCircleOutlined style={{ color: '#ff4d4f', fontSize: 18 }} />
        ),
    },
    {
      title: 'Desktop',
      key: 'desktop',
      align: 'center',
      render: (_, record) =>
        record.desktop ? (
          <CheckCircleOutlined style={{ color: '#52c41a', fontSize: 18 }} />
        ) : (
          <CloseCircleOutlined style={{ color: '#ff4d4f', fontSize: 18 }} />
        ),
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, record) => {
        const colors = {
          complete: 'green',
          partial: 'orange',
          pending: 'red',
        };
        return <Tag color={colors[record.status]}>{record.status.toUpperCase()}</Tag>;
      },
    },
  ];

  return (
    <div style={{ padding: isMobile ? 16 : 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={isMobile ? 4 : 3}>
          {currentBreakpoint?.icon} Responsive Design
        </Title>
        <Paragraph type="secondary">
          All features optimized for mobile, tablet, and desktop devices
        </Paragraph>
      </div>

      {/* Current Viewport Info */}
      <Alert
        message="Current Viewport"
        description={
          <Space direction="vertical" style={{ width: '100%' }}>
            <Space>
              <Text strong>Breakpoint:</Text>
              <Tag color={currentBreakpoint?.color} icon={currentBreakpoint?.icon}>
                {currentBreakpoint?.name}
              </Tag>
            </Space>
            <Space>
              <Text strong>Screen Width:</Text>
              <Text code>{windowWidth}px</Text>
            </Space>
            <Space wrap>
              <Text strong>Active:</Text>
              {Object.entries(screens)
                .filter(([_, active]) => active)
                .map(([key]) => (
                  <Tag key={key} color="blue">
                    {key}
                  </Tag>
                ))}
            </Space>
          </Space>
        }
        type="info"
        showIcon
        icon={<InfoCircleOutlined />}
        style={{ marginBottom: 24 }}
      />

      {/* Breakpoint Details */}
      <Card title="Breakpoint Details" style={{ marginBottom: 24 }}>
        <Row gutter={[16, 16]}>
          {breakpoints.map((bp) => {
            const isActive = screens[bp.key as keyof typeof screens];
            return (
              <Col xs={24} sm={12} md={8} lg={6} xl={4} key={bp.key}>
                <Card
                  size="small"
                  style={{
                    borderColor: isActive ? bp.color : '#d9d9d9',
                    background: isActive ? `${bp.color}10` : 'white',
                  }}
                >
                  <Space direction="vertical" align="center" style={{ width: '100%' }}>
                    <div style={{ fontSize: 32, color: bp.color }}>{bp.icon}</div>
                    <Text strong>{bp.name}</Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      ≥ {bp.minWidth}px
                    </Text>
                    {isActive && (
                      <Tag color={bp.color} style={{ margin: 0 }}>
                        Active
                      </Tag>
                    )}
                  </Space>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Card>

      {/* Responsive Features Table */}
      <Card
        title="Feature Support Matrix"
        extra={
          isMobile && (
            <Button type="primary" size="small" onClick={() => setDrawerVisible(true)}>
              View Details
            </Button>
          )
        }
        style={{ marginBottom: 24 }}
      >
        {isMobile ? (
          <List
            dataSource={responsiveFeatures}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  title={item.feature}
                  description={
                    <Space size={4}>
                      <Tag color={item.mobile ? 'green' : 'red'} style={{ fontSize: 10 }}>
                        Mobile
                      </Tag>
                      <Tag color={item.tablet ? 'green' : 'red'} style={{ fontSize: 10 }}>
                        Tablet
                      </Tag>
                      <Tag color={item.desktop ? 'green' : 'red'} style={{ fontSize: 10 }}>
                        Desktop
                      </Tag>
                    </Space>
                  }
                />
                <Tag
                  color={
                    item.status === 'complete' ? 'green' : item.status === 'partial' ? 'orange' : 'red'
                  }
                >
                  {item.status}
                </Tag>
              </List.Item>
            )}
          />
        ) : (
          <Table
            columns={columns}
            dataSource={responsiveFeatures}
            rowKey="feature"
            pagination={false}
            scroll={{ x: 800 }}
          />
        )}
      </Card>

      {/* Responsive Guidelines */}
      <Card title="Responsive Design Guidelines">
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Card type="inner" title="Mobile First (XS/SM)">
              <Space direction="vertical" style={{ width: '100%' }}>
                <div>
                  <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />
                  <Text>Single column layouts</Text>
                </div>
                <div>
                  <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />
                  <Text>Touch-friendly buttons (min 44px)</Text>
                </div>
                <div>
                  <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />
                  <Text>Collapsible menus & drawers</Text>
                </div>
                <div>
                  <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />
                  <Text>Simplified navigation</Text>
                </div>
                <div>
                  <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />
                  <Text>Bottom navigation on mobile</Text>
                </div>
                <div>
                  <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />
                  <Text>Card-based content display</Text>
                </div>
              </Space>
            </Card>
          </Col>

          <Col xs={24} md={12}>
            <Card type="inner" title="Tablet (MD)">
              <Space direction="vertical" style={{ width: '100%' }}>
                <div>
                  <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />
                  <Text>2-column grid layouts</Text>
                </div>
                <div>
                  <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />
                  <Text>Expanded side navigation</Text>
                </div>
                <div>
                  <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />
                  <Text>Hybrid touch & mouse support</Text>
                </div>
                <div>
                  <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />
                  <Text>Responsive tables with scroll</Text>
                </div>
                <div>
                  <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />
                  <Text>Optimized forms & modals</Text>
                </div>
                <div>
                  <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />
                  <Text>Better data visualization</Text>
                </div>
              </Space>
            </Card>
          </Col>

          <Col xs={24} md={12}>
            <Card type="inner" title="Desktop (LG/XL)">
              <Space direction="vertical" style={{ width: '100%' }}>
                <div>
                  <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />
                  <Text>Multi-column layouts (3-4 columns)</Text>
                </div>
                <div>
                  <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />
                  <Text>Fixed sidebar navigation</Text>
                </div>
                <div>
                  <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />
                  <Text>Hover states & tooltips</Text>
                </div>
                <div>
                  <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />
                  <Text>Full-featured data tables</Text>
                </div>
                <div>
                  <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />
                  <Text>Advanced charts & graphs</Text>
                </div>
                <div>
                  <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />
                  <Text>Keyboard shortcuts support</Text>
                </div>
              </Space>
            </Card>
          </Col>

          <Col xs={24} md={12}>
            <Card type="inner" title="Extra Large (XXL)">
              <Space direction="vertical" style={{ width: '100%' }}>
                <div>
                  <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />
                  <Text>Wide layouts (max-width: 1600px)</Text>
                </div>
                <div>
                  <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />
                  <Text>Enhanced spacing & whitespace</Text>
                </div>
                <div>
                  <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />
                  <Text>Multi-panel dashboards</Text>
                </div>
                <div>
                  <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />
                  <Text>Split-screen interfaces</Text>
                </div>
                <div>
                  <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />
                  <Text>Large data visualizations</Text>
                </div>
                <div>
                  <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />
                  <Text>Rich media galleries</Text>
                </div>
              </Space>
            </Card>
          </Col>
        </Row>
      </Card>

      {/* Mobile Drawer */}
      {isMobile && (
        <Drawer
          title="Feature Details"
          placement="bottom"
          onClose={() => setDrawerVisible(false)}
          open={drawerVisible}
          height="70%"
        >
          <List
            dataSource={responsiveFeatures}
            renderItem={(item) => (
              <List.Item>
                <Descriptions column={1} size="small" style={{ width: '100%' }}>
                  <Descriptions.Item label="Feature">{item.feature}</Descriptions.Item>
                  <Descriptions.Item label="Mobile">
                    {item.mobile ? (
                      <Tag color="green">Supported</Tag>
                    ) : (
                      <Tag color="red">Not Supported</Tag>
                    )}
                  </Descriptions.Item>
                  <Descriptions.Item label="Tablet">
                    {item.tablet ? (
                      <Tag color="green">Supported</Tag>
                    ) : (
                      <Tag color="red">Not Supported</Tag>
                    )}
                  </Descriptions.Item>
                  <Descriptions.Item label="Desktop">
                    {item.desktop ? (
                      <Tag color="green">Supported</Tag>
                    ) : (
                      <Tag color="red">Not Supported</Tag>
                    )}
                  </Descriptions.Item>
                  <Descriptions.Item label="Status">
                    <Tag
                      color={
                        item.status === 'complete'
                          ? 'green'
                          : item.status === 'partial'
                          ? 'orange'
                          : 'red'
                      }
                    >
                      {item.status.toUpperCase()}
                    </Tag>
                  </Descriptions.Item>
                </Descriptions>
              </List.Item>
            )}
          />
        </Drawer>
      )}
    </div>
  );
};

export default ResponsiveDesignPage;
