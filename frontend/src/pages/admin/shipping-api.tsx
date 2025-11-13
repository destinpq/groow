/**
 * ⚠️ SAFE API RESPONSE HANDLING - ALWAYS USE THIS PATTERN:
 * 
 * const dataArray = response?.data?.data || response?.data || [];
 * const total = response?.data?.meta?.total || response?.meta?.total || response?.total || 0;
 * 
 * Before using .map()/.filter()/.forEach():
 * setItems(Array.isArray(dataArray) ? dataArray : []);
 */

import React, { useState, useEffect } from 'react';
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
  Spin,
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

const { Title, Text } = Typography;
const { Option } = Select;

interface ShippingRate {
  id: string;
  name: string;
  carrier: string;
  cost: number;
  deliveryTime: string;
  enabled: boolean;
}

interface ShippingCarrier {
  id: string;
  name: string;
  logo: string;
  trackingEnabled: boolean;
  pickupAvailable: boolean;
  services: ShippingService[];
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

const ShippingAPI: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [selectedCarrier, setSelectedCarrier] = useState<string>('fedex');
  const [rates, setRates] = useState<ShippingRate[]>([]);

  const carriers: ShippingCarrier[] = [
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
          name: 'UPS 2-Day Air',
          description: 'Delivery in 2 business days',
          estimatedDays: '2 days',
          baseRate: 21.99,
          icon: <TruckOutlined />,
        },
        {
          id: 'ups_ground',
          carrierName: 'UPS',
          name: 'UPS Ground',
          description: 'Cost-effective ground shipping',
          estimatedDays: '3-5 days',
          baseRate: 9.99,
          freeThreshold: 50,
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
          id: 'usps_priority_express',
          carrierName: 'USPS',
          name: 'Priority Express',
          description: 'Overnight to most locations',
          estimatedDays: '1-2 days',
          baseRate: 26.99,
          icon: <RocketOutlined />,
        },
        {
          id: 'usps_priority',
          carrierName: 'USPS',
          name: 'Priority Mail',
          description: 'Fast, reliable service',
          estimatedDays: '1-3 days',
          baseRate: 8.70,
          icon: <TruckOutlined />,
        },
        {
          id: 'usps_ground',
          carrierName: 'USPS',
          name: 'USPS Ground',
          description: 'Economical shipping',
          estimatedDays: '2-8 days',
          baseRate: 4.95,
          freeThreshold: 35,
          icon: <CarOutlined />,
        },
      ],
    },
  ];

  const ratesColumns: ColumnsType<ShippingRate> = [
    {
      title: 'Service Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Carrier',
      dataIndex: 'carrier',
      key: 'carrier',
    },
    {
      title: 'Cost',
      dataIndex: 'cost',
      key: 'cost',
      render: (cost: number) => `$${cost.toFixed(2)}`,
    },
    {
      title: 'Delivery Time',
      dataIndex: 'deliveryTime',
      key: 'deliveryTime',
    },
    {
      title: 'Status',
      dataIndex: 'enabled',
      key: 'enabled',
      render: (enabled: boolean) => (
        <Tag color={enabled ? 'green' : 'red'}>
          {enabled ? 'Active' : 'Inactive'}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: ShippingRate) => (
        <Space>
          <Button size="small">Edit</Button>
          <Button size="small" danger>Remove</Button>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    // Convert carrier services to rate format
    const selectedCarrierData = carriers.find(c => c.id === selectedCarrier);
    if (selectedCarrierData) {
      const carrierRates: ShippingRate[] = selectedCarrierData.services.map(service => ({
        id: service.id,
        name: service.name,
        carrier: service.carrierName,
        cost: service.baseRate,
        deliveryTime: service.estimatedDays,
        enabled: true,
      }));
      setRates(carrierRates);
    }
  }, [selectedCarrier]);

  return (
    <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <Title level={2}>
          <BoxPlotOutlined style={{ marginRight: '8px' }} />
          Shipping API Integration
        </Title>
        <Text type="secondary" style={{ display: 'block', marginBottom: '24px' }}>
          Configure shipping carriers, rates, and API integrations
        </Text>

        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Card title="Shipping Statistics" style={{ marginBottom: '16px' }}>
              <Row gutter={[16, 16]}>
                <Col span={6}>
                  <Statistic
                    title="Total Shipments"
                    value={1245}
                    prefix={<BoxPlotOutlined />}
                  />
                </Col>
                <Col span={6}>
                  <Statistic
                    title="Active Carriers"
                    value={carriers.length}
                    prefix={<TruckOutlined />}
                  />
                </Col>
                <Col span={6}>
                  <Statistic
                    title="Avg Delivery Time"
                    value={3.2}
                    suffix="days"
                    prefix={<ClockCircleOutlined />}
                  />
                </Col>
                <Col span={6}>
                  <Statistic
                    title="Success Rate"
                    value={98.5}
                    suffix="%"
                    prefix={<CheckCircleOutlined />}
                  />
                </Col>
              </Row>
            </Card>
          </Col>

          <Col span={12}>
            <Card title="Carrier Configuration" style={{ height: '400px' }}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <div>
                  <Text strong>Select Carrier:</Text>
                  <Select
                    value={selectedCarrier}
                    onChange={setSelectedCarrier}
                    style={{ width: '100%', marginTop: '8px' }}
                  >
                    {carriers.map(carrier => (
                      <Option key={carrier.id} value={carrier.id}>
                        {carrier.logo} {carrier.name}
                      </Option>
                    ))}
                  </Select>
                </div>

                <Divider />

                {carriers
                  .filter(c => c.id === selectedCarrier)
                  .map(carrier => (
                    <div key={carrier.id}>
                      <Space direction="vertical" style={{ width: '100%' }}>
                        <div>
                          <Text strong>{carrier.name} Features:</Text>
                        </div>
                        <div>
                          <Tag color={carrier.trackingEnabled ? 'green' : 'red'}>
                            {carrier.trackingEnabled ? '✓' : '✗'} Tracking Enabled
                          </Tag>
                          <Tag color={carrier.pickupAvailable ? 'green' : 'red'}>
                            {carrier.pickupAvailable ? '✓' : '✗'} Pickup Available
                          </Tag>
                        </div>
                        <div>
                          <Text strong>Services Available: {carrier.services.length}</Text>
                        </div>
                      </Space>
                    </div>
                  ))}
              </Space>
            </Card>
          </Col>

          <Col span={12}>
            <Card title="API Configuration" style={{ height: '400px' }}>
              <Form layout="vertical">
                <Form.Item label="API Key">
                  <Input placeholder="Enter carrier API key" />
                </Form.Item>
                <Form.Item label="API Secret">
                  <Input.Password placeholder="Enter carrier API secret" />
                </Form.Item>
                <Form.Item label="Test Mode">
                  <Select defaultValue="sandbox">
                    <Option value="sandbox">Sandbox</Option>
                    <Option value="production">Production</Option>
                  </Select>
                </Form.Item>
                <Form.Item>
                  <Space>
                    <Button type="primary">Test Connection</Button>
                    <Button>Save Configuration</Button>
                  </Space>
                </Form.Item>
              </Form>
            </Card>
          </Col>

          <Col span={24}>
            <Card title="Shipping Services & Rates" style={{ marginTop: '16px' }}>
              <Table
                dataSource={rates}
                columns={ratesColumns}
                rowKey="id"
                pagination={{ pageSize: 10 }}
                loading={loading}
              />
            </Card>
          </Col>
        </Row>

        <Card title="Rate Calculator" style={{ marginTop: '16px' }}>
          <Row gutter={[16, 16]}>
            <Col span={8}>
              <Form.Item label="From ZIP">
                <Input placeholder="Origin ZIP code" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="To ZIP">
                <Input placeholder="Destination ZIP code" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Weight (lbs)">
                <Input placeholder="Package weight" type="number" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Button type="primary" icon={<DollarOutlined />}>
                Calculate Rates
              </Button>
            </Col>
          </Row>
        </Card>
      </div>
    </div>
  );
};

export default ShippingAPI;