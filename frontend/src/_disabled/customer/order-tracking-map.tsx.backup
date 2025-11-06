import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Steps,
  Timeline,
  Space,
  Tag,
  Button,
  Divider,
  Alert,
  Descriptions,
  Progress,
  Image,
  List,
  Input,
  Spin,
  message,
  Empty,
} from 'antd';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  TruckOutlined,
  InboxOutlined,
  HomeOutlined,
  ShopOutlined,
  MailOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { ordersAPI, type Order } from '@/services/api/orders';

dayjs.extend(relativeTime);

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;

interface OrderLocation {
  lat: number;
  lng: number;
  name: string;
  timestamp: string;
  status: string;
}

interface TrackingEvent {
  status: string;
  timestamp: string;
  location?: string;
  note?: string;
}

interface DeliveryDriver {
  name: string;
  phone: string;
  rating: number;
  image: string;
  vehicle: string;
  licensePlate: string;
}

const mockLocations: OrderLocation[] = [];

const mockTrackingEvents: TrackingEvent[] = [];

const mockDriver: DeliveryDriver = {
  name: '',
  phone: '',
  rating: 0,
  image: '',
  vehicle: '',
  licensePlate: '',
};

const OrderTrackingMapPage: React.FC = () => {
  const [trackingNumber, setTrackingNumber] = useState<string>('');
  const [order, setOrder] = useState<Order | null>(null);
  const [timeline, setTimeline] = useState<TrackingEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(0);

  // Fetch tracking information
  const fetchTracking = async (trackingNum: string) => {
    if (!trackingNum.trim()) {
      message.warning('Please enter a tracking number');
      return;
    }

    try {
      setLoading(true);
      const result = await ordersAPI.track(trackingNum);
      setOrder(result.order);
      setTimeline(result.timeline);
      
      // Calculate current step based on order status
      const statusStep = getStepFromStatus(result.order.status);
      setCurrentStep(statusStep);
      
      message.success('Tracking information loaded');
    } catch (error) {
      message.error('Failed to load tracking information. Please check the tracking number.');
      console.error('Fetch tracking error:', error);
      setOrder(null);
      setTimeline([]);
    } finally {
      setLoading(false);
    }
  };

  // Map order status to step index
  const getStepFromStatus = (status: Order['status']): number => {
    const statusMap: Record<Order['status'], number> = {
      pending: 0,
      confirmed: 1,
      processing: 2,
      shipped: 3,
      delivered: 5,
      cancelled: 0,
      refunded: 0,
    };
    return statusMap[status] || 0;
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      pending: <ShopOutlined style={{ color: '#1890ff' }} />,
      confirmed: <CheckCircleOutlined style={{ color: '#1890ff' }} />,
      processing: <InboxOutlined style={{ color: '#1890ff' }} />,
      shipped: <TruckOutlined style={{ color: '#1890ff' }} />,
      'in transit': <TruckOutlined style={{ color: '#1890ff' }} />,
      'out for delivery': <TruckOutlined style={{ color: '#52c41a' }} />,
      delivered: <HomeOutlined style={{ color: '#52c41a' }} />,
    };
    return iconMap[status.toLowerCase()] || <ClockCircleOutlined style={{ color: '#1890ff' }} />;
  };

  const steps = [
    { title: 'Pending', icon: <ShopOutlined /> },
    { title: 'Confirmed', icon: <CheckCircleOutlined /> },
    { title: 'Processing', icon: <InboxOutlined /> },
    { title: 'Shipped', icon: <TruckOutlined /> },
    { title: 'In Transit', icon: <TruckOutlined /> },
    { title: 'Delivered', icon: <HomeOutlined /> },
  ];

  const progressPercentage = order ? ((currentStep + 1) / steps.length) * 100 : 0;
  const estimatedDelivery = order?.status === 'shipped' || order?.status === 'processing'
    ? dayjs().add(2, 'days')
    : null;

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={3}>
            <EnvironmentOutlined style={{ color: '#1890ff' }} /> Track Your Order
          </Title>
          <Paragraph type="secondary">Enter tracking number to see real-time updates</Paragraph>
        </Col>
      </Row>

      {/* Search Bar */}
      <Card style={{ marginBottom: 24 }}>
        <Search
          placeholder="Enter tracking number (e.g., TRK1234567890)"
          enterButton={<><SearchOutlined /> Track Order</>}
          size="large"
          value={trackingNumber}
          onChange={(e) => setTrackingNumber(e.target.value)}
          onSearch={fetchTracking}
          loading={loading}
        />
      </Card>

      {loading && (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <Spin size="large" tip="Loading tracking information..." />
        </div>
      )}

      {!loading && !order && (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <Space direction="vertical">
              <Text>No tracking information available</Text>
              <Text type="secondary">Enter a tracking number above to start tracking</Text>
            </Space>
          }
        />
      )}

      {!loading && order && (
        <>
          {order.status === 'shipped' && estimatedDelivery && (
            <Alert
              message={
                <Space>
                  <TruckOutlined />
                  <Text strong>Your package is on the way!</Text>
                </Space>
              }
              description={`Estimated delivery: ${estimatedDelivery.format(
                'MMM DD, YYYY'
              )}`}
              type="info"
              showIcon={false}
              style={{ marginBottom: 24 }}
            />
          )}

          {order.status === 'delivered' && (
            <Alert
              message={
                <Space>
                  <CheckCircleOutlined />
                  <Text strong>Package delivered successfully!</Text>
                </Space>
              }
              description={`Delivered on ${dayjs(order.updatedAt).format('MMM DD, YYYY [at] h:mm A')}`}
              type="success"
              showIcon={false}
              style={{ marginBottom: 24 }}
            />
          )}

          <Row gutter={[24, 24]}>
            <Col xs={24} lg={16}>
              <Card
                title={
                  <Space>
                    <EnvironmentOutlined />
                    <span>Live Tracking</span>
                  </Space>
                }
                style={{ marginBottom: 24 }}
              >
                <div
                  style={{
                    height: 400,
                    background: '#e6f7ff',
                    borderRadius: 8,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundImage: `
                        linear-gradient(to right, #ddd 1px, transparent 1px),
                        linear-gradient(to bottom, #ddd 1px, transparent 1px)
                      `,
                      backgroundSize: '40px 40px',
                    }}
                  />

                  {/* Simplified map visualization */}
                  <div style={{ textAlign: 'center', zIndex: 1 }}>
                    <EnvironmentOutlined style={{ fontSize: 64, color: '#1890ff' }} />
                    <div style={{ marginTop: 16 }}>
                      <Text strong>Order Tracking Map</Text>
                      <br />
                      <Text type="secondary">Status: {order.status.toUpperCase()}</Text>
                    </div>
                  </div>

                  {order.trackingNumber && (
                    <div
                      style={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        background: '#fff',
                        padding: 16,
                        borderRadius: 8,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                      }}
                    >
                      <Space direction="vertical" size="small">
                        <Text strong>Tracking Number</Text>
                        <Text code>{order.trackingNumber}</Text>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          Last updated: {dayjs(order.updatedAt).fromNow()}
                        </Text>
                      </Space>
                    </div>
                  )}
                </div>

                <div style={{ marginTop: 24 }}>
                  <Space direction="vertical" style={{ width: '100%' }} size="small">
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: 8,
                      }}
                    >
                      <Text>Delivery Progress</Text>
                      <Text strong>{progressPercentage.toFixed(0)}%</Text>
                    </div>
                    <Progress
                      percent={progressPercentage}
                      status={order.status === 'delivered' ? 'success' : 'active'}
                      strokeColor={{ from: '#1890ff', to: '#52c41a' }}
                    />
                  </Space>
                </div>
              </Card>

              <Card title="Delivery Timeline">
                <Steps
                  current={currentStep}
                  items={steps.map((step, index) => {
                    const matchingEvent = timeline.find((e, i) => i === index);
                    return {
                      title: step.title,
                      icon: step.icon,
                      description: matchingEvent
                        ? dayjs(matchingEvent.timestamp).format('MMM DD, h:mm A')
                        : undefined,
                    };
                  })}
                  style={{ marginBottom: 24 }}
                />

                <Divider />

                {timeline.length > 0 ? (
                  <Timeline
                    items={timeline.map((event, index) => ({
                      dot:
                        index === timeline.length - 1 ? (
                          <ClockCircleOutlined style={{ fontSize: 20, color: '#1890ff' }} />
                        ) : (
                          <CheckCircleOutlined style={{ fontSize: 20, color: '#52c41a' }} />
                        ),
                      color: index <= currentStep ? 'blue' : 'gray',
                      children: (
                        <div>
                          <div style={{ marginBottom: 4 }}>
                            <Text strong>{event.status}</Text>
                            {index === timeline.length - 1 && (
                              <Tag color="processing" style={{ marginLeft: 8 }}>
                                Current
                              </Tag>
                            )}
                          </div>
                          {event.note && (
                            <Paragraph type="secondary" style={{ margin: 0 }}>
                              {event.note}
                            </Paragraph>
                          )}
                          <div style={{ marginTop: 4 }}>
                            <Space size="large">
                              {event.location && (
                                <Text type="secondary" style={{ fontSize: 12 }}>
                                  <EnvironmentOutlined /> {event.location}
                                </Text>
                              )}
                              <Text type="secondary" style={{ fontSize: 12 }}>
                                <ClockCircleOutlined />{' '}
                                {dayjs(event.timestamp).format('MMM DD, h:mm A')}
                              </Text>
                            </Space>
                          </div>
                        </div>
                      ),
                    }))}
                  />
                ) : (
                  <Empty description="No tracking events available" />
                )}
              </Card>
            </Col>

            <Col xs={24} lg={8}>
              <Card title="Order Information" style={{ marginBottom: 24 }}>
                <Descriptions column={1} size="small">
                  <Descriptions.Item label="Order Number">{order.orderNumber}</Descriptions.Item>
                  <Descriptions.Item label="Order Date">
                    {dayjs(order.createdAt).format('MMM DD, YYYY')}
                  </Descriptions.Item>
                  <Descriptions.Item label="Status">
                    <Tag color={order.status === 'delivered' ? 'success' : 'processing'}>
                      {order.status.toUpperCase()}
                    </Tag>
                  </Descriptions.Item>
                  {order.trackingNumber && (
                    <Descriptions.Item label="Tracking #">{order.trackingNumber}</Descriptions.Item>
                  )}
                  <Descriptions.Item label="Total">
                    <Text strong style={{ color: '#B12704' }}>
                      ${order.total.toFixed(2)}
                    </Text>
                  </Descriptions.Item>
                </Descriptions>
              </Card>

              <Card title="Delivery Address" style={{ marginBottom: 24 }}>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div>
                    <Text strong>
                      {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                    </Text>
                    <div>
                      <Text type="secondary">{order.shippingAddress.address1}</Text>
                    </div>
                    {order.shippingAddress.address2 && (
                      <div>
                        <Text type="secondary">{order.shippingAddress.address2}</Text>
                      </div>
                    )}
                    <div>
                      <Text type="secondary">
                        {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                        {order.shippingAddress.zipCode}
                      </Text>
                    </div>
                    <div>
                      <Text type="secondary">{order.shippingAddress.country}</Text>
                    </div>
                    <div style={{ marginTop: 8 }}>
                      <Text type="secondary">
                        <PhoneOutlined /> {order.shippingAddress.phone}
                      </Text>
                    </div>
                  </div>

                  {order.notes && (
                    <>
                      <Divider style={{ margin: '12px 0' }} />
                      <Alert
                        message="Delivery Instructions"
                        description={order.notes}
                        type="info"
                        showIcon
                        icon={<HomeOutlined />}
                      />
                    </>
                  )}
                </Space>
              </Card>

              <Card title="Order Items">
                <List
                  itemLayout="horizontal"
                  dataSource={order.items}
                  renderItem={(item) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={
                          <Image
                            src={item.productImage}
                            alt={item.productName}
                            width={60}
                            height={60}
                            style={{ borderRadius: 8 }}
                            preview={false}
                            fallback="https://via.placeholder.com/60x60?text=Product"
                          />
                        }
                        title={item.productName}
                        description={`Quantity: ${item.quantity} × $${item.price.toFixed(2)}`}
                      />
                    </List.Item>
                  )}
                />
              </Card>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};

export default OrderTrackingMapPage;
