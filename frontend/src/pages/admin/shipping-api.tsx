import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Select,
  Space,
  Button,
  Table,
  Tag,
  Statistic,
  Alert,
  Divider,
  Input,
  Form,
  message,
  Modal,
} from 'antd';
import {
  RocketOutlined,
  CarOutlined,
  EnvironmentOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  TruckOutlined,
  BoxPlotOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text, Paragraph } = Typography;

interface ShippingCarrier {
  id: string;
  name: string;
  logo: string;
  services: ShippingService[];
  trackingEnabled: boolean;
  pickupAvailable: boolean;
}

interface ShippingService {
  id: string;
  carrierName: string;
  name: string;
  description: string;
  estimatedDays: string;
  baseRate: number;
  freeThreshold?: number;
  icon: React.ReactNode;
}

interface ShippingRate {
  service: string;
  carrier: string;
  price: number;
  estimatedDays: string;
  icon: React.ReactNode;
}

interface TrackingInfo {
  trackingNumber: string;
  carrier: string;
  status: string;
  events: TrackingEvent[];
}

interface TrackingEvent {
  timestamp: string;
  location: string;
  description: string;
  status: 'pending' | 'in-transit' | 'delivered';
}

const shippingCarriers: ShippingCarrier[] = [
  {
    id: 'fedex',
    name: 'FedEx',
    logo: '📦 FedEx',
    trackingEnabled: true,
    pickupAvailable: true,
    services: [
      {
        id: 'fedex_overnight',
        carrierName: 'FedEx',
        name: 'FedEx Overnight',
        description: 'Next business day delivery',
        estimatedDays: '1 day',
        baseRate: 29.99,
        icon: <RocketOutlined />,
      },
      {
        id: 'fedex_2day',
        carrierName: 'FedEx',
        name: 'FedEx 2-Day',
        description: 'Delivery in 2 business days',
        estimatedDays: '2 days',
        baseRate: 19.99,
        icon: <TruckOutlined />,
      },
      {
        id: 'fedex_ground',
        carrierName: 'FedEx',
        name: 'FedEx Ground',
        description: 'Economical ground shipping',
        estimatedDays: '3-5 days',
        baseRate: 8.99,
        freeThreshold: 75,
        icon: <CarOutlined />,
      },
    ],
  },
  {
    id: 'ups',
    name: 'UPS',
    logo: '📦 UPS',
    trackingEnabled: true,
    pickupAvailable: true,
    services: [
      {
        id: 'ups_next_day',
        carrierName: 'UPS',
        name: 'UPS Next Day Air',
        description: 'Next business day by 10:30 AM',
        estimatedDays: '1 day',
        baseRate: 32.99,
        icon: <RocketOutlined />,
      },
      {
        id: 'ups_2day',
        carrierName: 'UPS',
        name: 'UPS 2nd Day Air',
        description: 'Second business day delivery',
        estimatedDays: '2 days',
        baseRate: 21.99,
        icon: <TruckOutlined />,
      },
      {
        id: 'ups_ground',
        carrierName: 'UPS',
        name: 'UPS Ground',
        description: 'Reliable ground delivery',
        estimatedDays: '3-5 days',
        baseRate: 9.99,
        freeThreshold: 75,
        icon: <CarOutlined />,
      },
    ],
  },
  {
    id: 'usps',
    name: 'USPS',
    logo: '📮 USPS',
    trackingEnabled: true,
    pickupAvailable: false,
    services: [
      {
        id: 'usps_priority',
        carrierName: 'USPS',
        name: 'USPS Priority Mail',
        description: 'Fast & affordable priority service',
        estimatedDays: '1-3 days',
        baseRate: 7.99,
        freeThreshold: 50,
        icon: <TruckOutlined />,
      },
      {
        id: 'usps_first_class',
        carrierName: 'USPS',
        name: 'USPS First Class',
        description: 'Economical first class mail',
        estimatedDays: '2-5 days',
        baseRate: 4.99,
        icon: <CarOutlined />,
      },
    ],
  },
];

const mockTrackingInfo: TrackingInfo = {
  trackingNumber: '1Z999AA10123456784',
  carrier: 'UPS',
  status: 'In Transit',
  events: [
    {
      timestamp: '2024-11-10 14:30:00',
      location: 'New York, NY',
      description: 'Out for delivery',
      status: 'in-transit',
    },
    {
      timestamp: '2024-11-10 08:15:00',
      location: 'Newark, NJ',
      description: 'Arrived at facility',
      status: 'in-transit',
    },
    {
      timestamp: '2024-11-09 18:45:00',
      location: 'Philadelphia, PA',
      description: 'In transit',
      status: 'in-transit',
    },
    {
      timestamp: '2024-11-09 10:20:00',
      location: 'Baltimore, MD',
      description: 'Departed facility',
      status: 'in-transit',
    },
    {
      timestamp: '2024-11-08 15:00:00',
      location: 'Atlanta, GA',
      description: 'Package received',
      status: 'pending',
    },
  ],
};

const ShippingAPIPage: React.FC = () => {
  const [selectedCarrier, setSelectedCarrier] = useState<string>('all');
  const [destination, setDestination] = useState({ zip: '10001', weight: 2.5 });
  const [rates, setRates] = useState<ShippingRate[]>([]);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingInfo, setTrackingInfo] = useState<TrackingInfo | null>(null);
  const [isTrackingModalVisible, setIsTrackingModalVisible] = useState(false);

  const getAllServices = () => {
    if (selectedCarrier === 'all') {
      return shippingCarriers.flatMap((carrier) => carrier.services);
    }
    const carrier = shippingCarriers.find((c) => c.id === selectedCarrier);
    return carrier?.services || [];
  };

  const handleGetRates = () => {
    const services = getAllServices();
    const calculatedRates: ShippingRate[] = services.map((service) => {
      // Simulate rate calculation based on weight
      const weightFactor = Math.max(1, destination.weight / 2);
      const price = parseFloat((service.baseRate * weightFactor).toFixed(2));

      return {
        service: service.name,
        carrier: service.carrierName,
        price,
        estimatedDays: service.estimatedDays,
        icon: service.icon,
      };
    });

    setRates(calculatedRates);
    message.success('Shipping rates calculated successfully!');
  };

  const handleTrackPackage = () => {
    if (!trackingNumber) {
      message.error('Please enter a tracking number');
      return;
    }

    // Simulate API call
    setTimeout(() => {
      setTrackingInfo(mockTrackingInfo);
      setIsTrackingModalVisible(true);
      message.success('Tracking information retrieved');
    }, 1000);
  };

  const ratesColumns: ColumnsType<ShippingRate> = [
    {
      title: 'Service',
      key: 'service',
      render: (_, record) => (
        <Space>
          <div style={{ fontSize: 20, color: '#1890ff' }}>{record.icon}</div>
          <div>
            <Text strong>{record.service}</Text>
            <div>
              <Text type="secondary" style={{ fontSize: 12 }}>
                {record.carrier}
              </Text>
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: 'Estimated Delivery',
      dataIndex: 'estimatedDays',
      key: 'estimatedDays',
      render: (days) => (
        <Tag icon={<ClockCircleOutlined />} color="blue">
          {days}
        </Tag>
      ),
    },
    {
      title: 'Rate',
      dataIndex: 'price',
      key: 'price',
      align: 'right',
      render: (price) => <Text strong style={{ fontSize: 16 }}>${price.toFixed(2)}</Text>,
    },
    {
      title: 'Action',
      key: 'action',
      render: () => (
        <Button type="primary" size="small">
          Select
        </Button>
      ),
    },
  ];

  const stats = {
    carriers: shippingCarriers.length,
    services: shippingCarriers.reduce((sum, c) => sum + c.services.length, 0),
    avgRate: rates.length > 0 ? rates.reduce((sum, r) => sum + r.price, 0) / rates.length : 0,
  };

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={3}>
          <TruckOutlined style={{ color: '#1890ff' }} /> Shipping API Integration
        </Title>
        <Paragraph type="secondary">
          Real-time shipping rates and tracking from major carriers
        </Paragraph>
      </div>

      {/* Statistics */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Supported Carriers"
              value={stats.carriers}
              prefix={<BoxPlotOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Shipping Services"
              value={stats.services}
              prefix={<TruckOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Avg. Rate"
              value={stats.avgRate}
              prefix="$"
              precision={2}
              valueStyle={{ color: '#ff9900' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        {/* Rate Calculator */}
        <Col xs={24} lg={12}>
          <Card title="Get Shipping Rates" style={{ marginBottom: 16 }}>
            <Form layout="vertical">
              <Form.Item label="Carrier">
                <Select
                  value={selectedCarrier}
                  onChange={setSelectedCarrier}
                  options={[
                    { label: 'All Carriers', value: 'all' },
                    ...shippingCarriers.map((c) => ({ label: c.logo, value: c.id })),
                  ]}
                />
              </Form.Item>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="Destination ZIP">
                    <Input
                      value={destination.zip}
                      onChange={(e) => setDestination({ ...destination, zip: e.target.value })}
                      placeholder="10001"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Weight (lbs)">
                    <Input
                      type="number"
                      value={destination.weight}
                      onChange={(e) =>
                        setDestination({ ...destination, weight: parseFloat(e.target.value) || 0 })
                      }
                      placeholder="2.5"
                      step={0.1}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Button type="primary" block icon={<DollarOutlined />} onClick={handleGetRates}>
                Calculate Shipping Rates
              </Button>
            </Form>
          </Card>

          {/* Shipping Rates Table */}
          {rates.length > 0 && (
            <Card title="Available Shipping Options">
              <Table
                columns={ratesColumns}
                dataSource={rates}
                rowKey="service"
                pagination={false}
              />
            </Card>
          )}
        </Col>

        {/* Package Tracking */}
        <Col xs={24} lg={12}>
          <Card title="Track Package">
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              <Form layout="vertical">
                <Form.Item label="Tracking Number">
                  <Input
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="1Z999AA10123456784"
                    size="large"
                  />
                </Form.Item>
                <Button
                  type="primary"
                  block
                  size="large"
                  icon={<EnvironmentOutlined />}
                  onClick={handleTrackPackage}
                >
                  Track Package
                </Button>
              </Form>

              <Alert
                message="Supported Carriers"
                description="We support tracking for FedEx, UPS, USPS, and DHL shipments."
                type="info"
                showIcon
              />
            </Space>
          </Card>

          {/* Carrier Features */}
          <Card title="Carrier Features" style={{ marginTop: 16 }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              {shippingCarriers.map((carrier) => (
                <Card key={carrier.id} size="small">
                  <Space direction="vertical" style={{ width: '100%' }} size="small">
                    <Text strong>{carrier.logo}</Text>
                    <div>
                      <Tag color={carrier.trackingEnabled ? 'green' : 'red'}>
                        {carrier.trackingEnabled ? 'Tracking Available' : 'No Tracking'}
                      </Tag>
                      <Tag color={carrier.pickupAvailable ? 'green' : 'red'}>
                        {carrier.pickupAvailable ? 'Pickup Available' : 'No Pickup'}
                      </Tag>
                    </div>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {carrier.services.length} services available
                    </Text>
                  </Space>
                </Card>
              ))}
            </Space>
          </Card>
        </Col>
      </Row>

      {/* Tracking Modal */}
      <Modal
        title={
          <Space>
            <EnvironmentOutlined />
            <span>Package Tracking</span>
          </Space>
        }
        open={isTrackingModalVisible}
        onCancel={() => setIsTrackingModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsTrackingModalVisible(false)}>
            Close
          </Button>,
        ]}
        width={700}
      >
        {trackingInfo && (
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            <Alert
              message={trackingInfo.status}
              description={
                <div>
                  <Text strong>Tracking Number:</Text> {trackingInfo.trackingNumber}
                  <br />
                  <Text strong>Carrier:</Text> {trackingInfo.carrier}
                </div>
              }
              type="success"
              showIcon
              icon={<TruckOutlined />}
            />

            <div>
              <Text strong style={{ fontSize: 16, display: 'block', marginBottom: 16 }}>
                Tracking Events
              </Text>
              {trackingInfo.events.map((event, index) => (
                <div key={index} style={{ marginBottom: 16, paddingLeft: 24, position: 'relative' }}>
                  <div
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: 4,
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      background: event.status === 'in-transit' ? '#1890ff' : '#bfbfbf',
                      border: '2px solid white',
                      boxShadow: '0 0 0 2px #1890ff',
                    }}
                  />
                  {index < trackingInfo.events.length - 1 && (
                    <div
                      style={{
                        position: 'absolute',
                        left: 5,
                        top: 16,
                        width: 2,
                        height: 'calc(100% + 8px)',
                        background: '#d9d9d9',
                      }}
                    />
                  )}
                  <div>
                    <Space>
                      <Text strong>{event.description}</Text>
                      {index === 0 && <Tag color="blue">Latest</Tag>}
                    </Space>
                    <div>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {event.location}
                      </Text>
                    </div>
                    <Text type="secondary" style={{ fontSize: 11 }}>
                      {event.timestamp}
                    </Text>
                  </div>
                </div>
              ))}
            </div>
          </Space>
        )}
      </Modal>
    </div>
  );
};

export default ShippingAPIPage;
