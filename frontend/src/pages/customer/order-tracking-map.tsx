import React, { useState } from 'react';
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
} from '@ant-design/icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const { Title, Text, Paragraph } = Typography;

interface OrderLocation {
  lat: number;
  lng: number;
  name: string;
  timestamp: string;
  status: string;
}

interface TrackingEvent {
  id: number;
  status: string;
  description: string;
  location: string;
  timestamp: string;
  icon: React.ReactNode;
}

interface DeliveryDriver {
  name: string;
  phone: string;
  rating: number;
  image: string;
  vehicle: string;
  licensePlate: string;
}

const mockLocations: OrderLocation[] = [
  {
    lat: 40.7128,
    lng: -74.006,
    name: 'Warehouse - New York',
    timestamp: dayjs().subtract(3, 'days').toISOString(),
    status: 'Order Placed',
  },
  {
    lat: 40.7589,
    lng: -73.9851,
    name: 'Distribution Center - Manhattan',
    timestamp: dayjs().subtract(2, 'days').toISOString(),
    status: 'Processing',
  },
  {
    lat: 40.7614,
    lng: -73.9776,
    name: 'Local Hub - Midtown',
    timestamp: dayjs().subtract(1, 'day').toISOString(),
    status: 'Out for Delivery',
  },
  {
    lat: 40.7505,
    lng: -73.9934,
    name: 'Your Location',
    timestamp: dayjs().add(2, 'hours').toISOString(),
    status: 'Estimated Delivery',
  },
];

const mockTrackingEvents: TrackingEvent[] = [
  {
    id: 1,
    status: 'Order Placed',
    description: 'Your order has been confirmed and is being prepared',
    location: 'New York Warehouse',
    timestamp: dayjs().subtract(3, 'days').toISOString(),
    icon: <ShopOutlined style={{ color: '#1890ff' }} />,
  },
  {
    id: 2,
    status: 'Packed',
    description: 'Items have been packed and ready for shipment',
    location: 'New York Warehouse',
    timestamp: dayjs().subtract(2, 'days').subtract(12, 'hours').toISOString(),
    icon: <InboxOutlined style={{ color: '#1890ff' }} />,
  },
  {
    id: 3,
    status: 'Shipped',
    description: 'Package picked up by courier',
    location: 'Distribution Center',
    timestamp: dayjs().subtract(2, 'days').toISOString(),
    icon: <TruckOutlined style={{ color: '#1890ff' }} />,
  },
  {
    id: 4,
    status: 'In Transit',
    description: 'Package is on the way to local facility',
    location: 'Manhattan Hub',
    timestamp: dayjs().subtract(1, 'day').toISOString(),
    icon: <TruckOutlined style={{ color: '#1890ff' }} />,
  },
  {
    id: 5,
    status: 'Out for Delivery',
    description: 'Package is out for delivery',
    location: 'Local Delivery Hub',
    timestamp: dayjs().subtract(3, 'hours').toISOString(),
    icon: <TruckOutlined style={{ color: '#52c41a' }} />,
  },
];

const mockDriver: DeliveryDriver = {
  name: 'John Smith',
  phone: '+1 (555) 123-4567',
  rating: 4.8,
  image: 'https://via.placeholder.com/100x100?text=Driver',
  vehicle: 'White Van',
  licensePlate: 'ABC-1234',
};

const OrderTrackingMapPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(4);

  const steps = [
    { title: 'Order Placed', icon: <ShopOutlined /> },
    { title: 'Packed', icon: <InboxOutlined /> },
    { title: 'Shipped', icon: <TruckOutlined /> },
    { title: 'In Transit', icon: <TruckOutlined /> },
    { title: 'Out for Delivery', icon: <TruckOutlined /> },
    { title: 'Delivered', icon: <HomeOutlined /> },
  ];

  const estimatedDelivery = dayjs().add(2, 'hours');
  const progressPercentage = ((currentStep + 1) / steps.length) * 100;

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={3}>
            <EnvironmentOutlined style={{ color: '#1890ff' }} /> Track Your Order
          </Title>
          <Paragraph type="secondary">Order #123456 - Real-time tracking</Paragraph>
        </Col>
      </Row>

      <Alert
        message={
          <Space>
            <TruckOutlined />
            <Text strong>Your package is out for delivery!</Text>
          </Space>
        }
        description={`Estimated delivery: ${estimatedDelivery.format(
          'MMM DD, YYYY [at] h:mm A'
        )}`}
        type="success"
        showIcon={false}
        style={{ marginBottom: 24 }}
      />

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

              {mockLocations.map((location, index) => (
                <div
                  key={index}
                  style={{
                    position: 'absolute',
                    left: `${20 + index * 20}%`,
                    top: `${30 + (index % 2) * 20}%`,
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      background:
                        index === mockLocations.length - 1
                          ? '#52c41a'
                          : index < currentStep
                          ? '#1890ff'
                          : '#d9d9d9',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '3px solid #fff',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                      cursor: 'pointer',
                    }}
                  >
                    {index === currentStep ? (
                      <TruckOutlined style={{ color: '#fff', fontSize: 18 }} />
                    ) : index === mockLocations.length - 1 ? (
                      <HomeOutlined style={{ color: '#fff', fontSize: 18 }} />
                    ) : (
                      <CheckCircleOutlined style={{ color: '#fff', fontSize: 18 }} />
                    )}
                  </div>
                  <div
                    style={{
                      background: '#fff',
                      padding: '4px 8px',
                      borderRadius: 4,
                      marginTop: 8,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                      whiteSpace: 'nowrap',
                      fontSize: 12,
                    }}
                  >
                    <Text strong>{location.name}</Text>
                  </div>
                </div>
              ))}

              {currentStep < mockLocations.length && (
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
                    <Text strong>Current Location</Text>
                    <Text>{mockLocations[currentStep]?.name}</Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {dayjs(mockLocations[currentStep]?.timestamp).fromNow()}
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
                  status="active"
                  strokeColor={{ from: '#1890ff', to: '#52c41a' }}
                />
              </Space>
            </div>
          </Card>

          <Card title="Delivery Timeline">
            <Steps
              current={currentStep}
              items={steps.map((step, index) => ({
                title: step.title,
                icon: step.icon,
                description:
                  index <= currentStep
                    ? dayjs(mockTrackingEvents[index]?.timestamp).format('MMM DD, h:mm A')
                    : undefined,
              }))}
              style={{ marginBottom: 24 }}
            />

            <Divider />

            <Timeline
              items={mockTrackingEvents.map((event, index) => ({
                dot:
                  index === currentStep ? (
                    <ClockCircleOutlined style={{ fontSize: 20, color: '#1890ff' }} />
                  ) : index < currentStep ? (
                    <CheckCircleOutlined style={{ fontSize: 20, color: '#52c41a' }} />
                  ) : (
                    <div
                      style={{
                        width: 16,
                        height: 16,
                        borderRadius: '50%',
                        border: '2px solid #d9d9d9',
                      }}
                    />
                  ),
                color: index <= currentStep ? 'blue' : 'gray',
                children: (
                  <div>
                    <div style={{ marginBottom: 4 }}>
                      <Text strong>{event.status}</Text>
                      {index === currentStep && (
                        <Tag color="processing" style={{ marginLeft: 8 }}>
                          Current
                        </Tag>
                      )}
                    </div>
                    <Paragraph type="secondary" style={{ margin: 0 }}>
                      {event.description}
                    </Paragraph>
                    <div style={{ marginTop: 4 }}>
                      <Space size="large">
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          <EnvironmentOutlined /> {event.location}
                        </Text>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          <ClockCircleOutlined /> {dayjs(event.timestamp).format('MMM DD, h:mm A')}
                        </Text>
                      </Space>
                    </div>
                  </div>
                ),
              }))}
            />
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card
            title={
              <Space>
                <TruckOutlined />
                <span>Delivery Driver</span>
              </Space>
            }
            style={{ marginBottom: 24 }}
          >
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              <div style={{ textAlign: 'center' }}>
                <Image
                  src={mockDriver.image}
                  alt={mockDriver.name}
                  width={100}
                  height={100}
                  style={{ borderRadius: '50%' }}
                  preview={false}
                />
                <Title level={4} style={{ marginTop: 16, marginBottom: 4 }}>
                  {mockDriver.name}
                </Title>
                <Space>
                  <Text type="secondary">Rating:</Text>
                  <Tag color="gold">⭐ {mockDriver.rating}</Tag>
                </Space>
              </div>

              <Descriptions column={1} size="small">
                <Descriptions.Item label="Vehicle">{mockDriver.vehicle}</Descriptions.Item>
                <Descriptions.Item label="License Plate">
                  {mockDriver.licensePlate}
                </Descriptions.Item>
              </Descriptions>

              <Button
                type="primary"
                icon={<PhoneOutlined />}
                block
                size="large"
                href={`tel:${mockDriver.phone}`}
              >
                Call Driver
              </Button>

              <Button
                icon={<MailOutlined />}
                block
                size="large"
              >
                Send Message
              </Button>
            </Space>
          </Card>

          <Card title="Delivery Address">
            <Space direction="vertical" style={{ width: '100%' }}>
              <div>
                <Text strong>John Doe</Text>
                <div>
                  <Text type="secondary">123 Main Street, Apt 4B</Text>
                </div>
                <div>
                  <Text type="secondary">New York, NY 10001</Text>
                </div>
                <div style={{ marginTop: 8 }}>
                  <Text type="secondary">
                    <PhoneOutlined /> +1 (555) 987-6543
                  </Text>
                </div>
              </div>

              <Divider style={{ margin: '12px 0' }} />

              <Alert
                message="Delivery Instructions"
                description="Please leave package at front door if no one is home."
                type="info"
                showIcon
                icon={<HomeOutlined />}
              />
            </Space>
          </Card>

          <Card title="Order Items" style={{ marginTop: 24 }}>
            <List
              itemLayout="horizontal"
              dataSource={[
                {
                  name: 'Wireless Headphones',
                  qty: 1,
                  image: 'https://via.placeholder.com/60x60?text=Item1',
                },
                {
                  name: 'Smart Watch',
                  qty: 1,
                  image: 'https://via.placeholder.com/60x60?text=Item2',
                },
              ]}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={60}
                        height={60}
                        style={{ borderRadius: 8 }}
                        preview={false}
                      />
                    }
                    title={item.name}
                    description={`Quantity: ${item.qty}`}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default OrderTrackingMapPage;
