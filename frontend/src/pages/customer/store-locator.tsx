import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Input,
  Select,
  Button,
  Space,
  List,
  Tag,
  Divider,
  message,
  Avatar,
  Badge,
} from 'antd';
import {
  EnvironmentOutlined,
  PhoneOutlined,
  ClockCircleOutlined,
  CompassOutlined,
  SearchOutlined,
  AimOutlined,
  ShopOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

interface Store {
  id: number;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
  email: string;
  latitude: number;
  longitude: number;
  distance?: number;
  hours: {
    day: string;
    open: string;
    close: string;
    isOpen: boolean;
  }[];
  services: string[];
  features: string[];
  rating: number;
  reviewCount: number;
  isOpen: boolean;
}

const mockStores: Store[] = [
  {
    id: 1,
    name: 'Downtown Store',
    address: '123 Main Street',
    city: 'New York',
    state: 'NY',
    zip: '10001',
    country: 'USA',
    phone: '(555) 123-4567',
    email: 'downtown@store.com',
    latitude: 40.7128,
    longitude: -74.0060,
    distance: 0.5,
    hours: [
      { day: 'Monday', open: '09:00 AM', close: '08:00 PM', isOpen: true },
      { day: 'Tuesday', open: '09:00 AM', close: '08:00 PM', isOpen: true },
      { day: 'Wednesday', open: '09:00 AM', close: '08:00 PM', isOpen: true },
      { day: 'Thursday', open: '09:00 AM', close: '09:00 PM', isOpen: true },
      { day: 'Friday', open: '09:00 AM', close: '09:00 PM', isOpen: true },
      { day: 'Saturday', open: '10:00 AM', close: '07:00 PM', isOpen: true },
      { day: 'Sunday', open: '11:00 AM', close: '06:00 PM', isOpen: true },
    ],
    services: ['In-Store Pickup', 'Returns', 'Tech Support', 'Gift Registry'],
    features: ['Parking Available', 'Wheelchair Accessible', 'WiFi', 'Restrooms'],
    rating: 4.5,
    reviewCount: 342,
    isOpen: true,
  },
  {
    id: 2,
    name: 'Uptown Shopping Center',
    address: '456 Broadway Avenue',
    city: 'New York',
    state: 'NY',
    zip: '10025',
    country: 'USA',
    phone: '(555) 234-5678',
    email: 'uptown@store.com',
    latitude: 40.7829,
    longitude: -73.9654,
    distance: 3.2,
    hours: [
      { day: 'Monday', open: '10:00 AM', close: '07:00 PM', isOpen: true },
      { day: 'Tuesday', open: '10:00 AM', close: '07:00 PM', isOpen: true },
      { day: 'Wednesday', open: '10:00 AM', close: '07:00 PM', isOpen: true },
      { day: 'Thursday', open: '10:00 AM', close: '08:00 PM', isOpen: true },
      { day: 'Friday', open: '10:00 AM', close: '08:00 PM', isOpen: true },
      { day: 'Saturday', open: '10:00 AM', close: '08:00 PM', isOpen: true },
      { day: 'Sunday', open: '11:00 AM', close: '06:00 PM', isOpen: true },
    ],
    services: ['In-Store Pickup', 'Returns', 'Personal Shopping'],
    features: ['Parking Available', 'Wheelchair Accessible', 'WiFi'],
    rating: 4.3,
    reviewCount: 256,
    isOpen: true,
  },
  {
    id: 3,
    name: 'Brooklyn Outlet',
    address: '789 Atlantic Avenue',
    city: 'Brooklyn',
    state: 'NY',
    zip: '11217',
    country: 'USA',
    phone: '(555) 345-6789',
    email: 'brooklyn@store.com',
    latitude: 40.6782,
    longitude: -73.9442,
    distance: 5.8,
    hours: [
      { day: 'Monday', open: '09:00 AM', close: '09:00 PM', isOpen: true },
      { day: 'Tuesday', open: '09:00 AM', close: '09:00 PM', isOpen: true },
      { day: 'Wednesday', open: '09:00 AM', close: '09:00 PM', isOpen: true },
      { day: 'Thursday', open: '09:00 AM', close: '09:00 PM', isOpen: true },
      { day: 'Friday', open: '09:00 AM', close: '09:00 PM', isOpen: true },
      { day: 'Saturday', open: '09:00 AM', close: '09:00 PM', isOpen: true },
      { day: 'Sunday', open: '10:00 AM', close: '08:00 PM', isOpen: true },
    ],
    services: ['In-Store Pickup', 'Returns', 'Tech Support', 'Gift Cards'],
    features: ['Large Parking Lot', 'Wheelchair Accessible', 'WiFi', 'Food Court'],
    rating: 4.7,
    reviewCount: 489,
    isOpen: true,
  },
  {
    id: 4,
    name: 'Queens Mall',
    address: '321 Queens Boulevard',
    city: 'Queens',
    state: 'NY',
    zip: '11373',
    country: 'USA',
    phone: '(555) 456-7890',
    email: 'queens@store.com',
    latitude: 40.7282,
    longitude: -73.8664,
    distance: 8.4,
    hours: [
      { day: 'Monday', open: '10:00 AM', close: '09:00 PM', isOpen: true },
      { day: 'Tuesday', open: '10:00 AM', close: '09:00 PM', isOpen: true },
      { day: 'Wednesday', open: '10:00 AM', close: '09:00 PM', isOpen: true },
      { day: 'Thursday', open: '10:00 AM', close: '09:00 PM', isOpen: true },
      { day: 'Friday', open: '10:00 AM', close: '09:00 PM', isOpen: true },
      { day: 'Saturday', open: '10:00 AM', close: '09:00 PM', isOpen: true },
      { day: 'Sunday', open: '11:00 AM', close: '07:00 PM', isOpen: true },
    ],
    services: ['In-Store Pickup', 'Returns'],
    features: ['Mall Parking', 'Wheelchair Accessible'],
    rating: 4.2,
    reviewCount: 178,
    isOpen: false,
  },
];

const StoreLocatorPage: React.FC = () => {
  const [stores, setStores] = useState<Store[]>(mockStores);
  const [selectedStore, setSelectedStore] = useState<Store | null>(mockStores[0]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterRadius, setFilterRadius] = useState<number>(10);

  const handleUseMyLocation = () => {
    message.loading('Getting your location...', 1).then(() => {
      message.success('Location detected: New York, NY');
      // In real implementation, use navigator.geolocation.getCurrentPosition()
    });
  };

  const handleSearch = () => {
    if (!searchQuery) {
      message.warning('Please enter a location');
      return;
    }
    message.success(`Searching for stores near: ${searchQuery}`);
    // In real implementation, call geocoding API
  };

  const getTodayHours = (store: Store) => {
    const today = dayjs().format('dddd');
    const todayHours = store.hours.find((h) => h.day === today);
    return todayHours;
  };

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={3}>
          <EnvironmentOutlined style={{ color: '#52c41a' }} /> Store Locator
        </Title>
        <Paragraph type="secondary">
          Find a store near you and get directions, hours, and services
        </Paragraph>
      </div>

      <Card style={{ marginBottom: 16 }}>
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Row gutter={16}>
            <Col flex="auto">
              <Input
                size="large"
                placeholder="Enter city, state, or ZIP code"
                prefix={<SearchOutlined />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onPressEnter={handleSearch}
              />
            </Col>
            <Col>
              <Select value={filterRadius} onChange={setFilterRadius} size="large" style={{ width: 140 }}>
                <Option value={5}>Within 5 mi</Option>
                <Option value={10}>Within 10 mi</Option>
                <Option value={25}>Within 25 mi</Option>
                <Option value={50}>Within 50 mi</Option>
                <Option value={100}>Within 100 mi</Option>
              </Select>
            </Col>
            <Col>
              <Button size="large" type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
                Search
              </Button>
            </Col>
          </Row>

          <div>
            <Button icon={<AimOutlined />} onClick={handleUseMyLocation}>
              Use My Current Location
            </Button>
          </div>
        </Space>
      </Card>

      <Row gutter={16}>
        <Col xs={24} lg={10}>
          <Card title={`${stores.length} Stores Found`} style={{ height: 'calc(100vh - 280px)', overflowY: 'auto' }}>
            <List
              dataSource={stores}
              renderItem={(store) => (
                <List.Item
                  style={{
                    cursor: 'pointer',
                    background: selectedStore?.id === store.id ? '#e6f7ff' : 'transparent',
                    padding: 16,
                    marginBottom: 8,
                    borderRadius: 8,
                    border: selectedStore?.id === store.id ? '2px solid #1890ff' : '1px solid #f0f0f0',
                  }}
                  onClick={() => setSelectedStore(store)}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        size={48}
                        icon={<ShopOutlined />}
                        style={{
                          background: store.isOpen ? '#52c41a' : '#ff4d4f',
                        }}
                      />
                    }
                    title={
                      <div>
                        <Space>
                          <Text strong>{store.name}</Text>
                          {store.isOpen ? (
                            <Tag color="green">Open</Tag>
                          ) : (
                            <Tag color="red">Closed</Tag>
                          )}
                        </Space>
                      </div>
                    }
                    description={
                      <Space direction="vertical" size="small">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <EnvironmentOutlined style={{ color: '#1890ff' }} />
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            {store.address}, {store.city}, {store.state} {store.zip}
                          </Text>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <CompassOutlined style={{ color: '#52c41a' }} />
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            {store.distance} miles away
                          </Text>
                        </div>
                        {getTodayHours(store) && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <ClockCircleOutlined style={{ color: '#fa8c16' }} />
                            <Text type="secondary" style={{ fontSize: 12 }}>
                              {getTodayHours(store)!.open} - {getTodayHours(store)!.close}
                            </Text>
                          </div>
                        )}
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        <Col xs={24} lg={14}>
          {selectedStore ? (
            <Card
              title={
                <Space>
                  <ShopOutlined />
                  <Text strong>{selectedStore.name}</Text>
                  {selectedStore.isOpen ? (
                    <Badge status="success" text="Open Now" />
                  ) : (
                    <Badge status="error" text="Closed" />
                  )}
                </Space>
              }
            >
              <div
                style={{
                  height: 300,
                  background: '#f0f0f0',
                  borderRadius: 8,
                  marginBottom: 24,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <div style={{ textAlign: 'center' }}>
                  <EnvironmentOutlined style={{ fontSize: 48, color: '#d9d9d9', marginBottom: 16 }} />
                  <Paragraph type="secondary">
                    Map view placeholder
                    <br />
                    Lat: {selectedStore.latitude}, Lng: {selectedStore.longitude}
                  </Paragraph>
                  <Button type="primary" icon={<CompassOutlined />}>
                    Get Directions
                  </Button>
                </div>
              </div>

              <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                  <Card type="inner" title="Contact Information">
                    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                      <div>
                        <EnvironmentOutlined style={{ marginRight: 8, color: '#1890ff' }} />
                        <Text>
                          {selectedStore.address}
                          <br />
                          {selectedStore.city}, {selectedStore.state} {selectedStore.zip}
                        </Text>
                      </div>
                      <div>
                        <PhoneOutlined style={{ marginRight: 8, color: '#52c41a' }} />
                        <Text>{selectedStore.phone}</Text>
                      </div>
                      <div>
                        <CompassOutlined style={{ marginRight: 8, color: '#722ed1' }} />
                        <Text>{selectedStore.distance} miles away</Text>
                      </div>
                    </Space>
                  </Card>
                </Col>

                <Col xs={24} md={12}>
                  <Card type="inner" title="Store Hours">
                    <Space direction="vertical" size="small" style={{ width: '100%' }}>
                      {selectedStore.hours.map((hour) => {
                        const isToday = hour.day === dayjs().format('dddd');
                        return (
                          <Row key={hour.day} justify="space-between" style={{ fontWeight: isToday ? 'bold' : 'normal' }}>
                            <Col>
                              <Text>{hour.day}</Text>
                              {isToday && <Tag color="blue" style={{ marginLeft: 8 }}>Today</Tag>}
                            </Col>
                            <Col>
                              <Text>
                                {hour.open} - {hour.close}
                              </Text>
                            </Col>
                          </Row>
                        );
                      })}
                    </Space>
                  </Card>
                </Col>

                <Col xs={24}>
                  <Card type="inner" title="Services Available">
                    <Space wrap>
                      {selectedStore.services.map((service) => (
                        <Tag key={service} color="blue" icon={<CheckCircleOutlined />}>
                          {service}
                        </Tag>
                      ))}
                    </Space>
                  </Card>
                </Col>

                <Col xs={24}>
                  <Card type="inner" title="Store Features">
                    <Space wrap>
                      {selectedStore.features.map((feature) => (
                        <Tag key={feature} color="green">
                          {feature}
                        </Tag>
                      ))}
                    </Space>
                  </Card>
                </Col>

                <Col xs={24}>
                  <Space>
                    <Button type="primary" size="large" icon={<CompassOutlined />}>
                      Get Directions
                    </Button>
                    <Button size="large" icon={<PhoneOutlined />}>
                      Call Store
                    </Button>
                    <Button size="large" icon={<ShopOutlined />}>
                      Set as My Store
                    </Button>
                  </Space>
                </Col>
              </Row>
            </Card>
          ) : (
            <Card style={{ height: 'calc(100vh - 280px)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                <div style={{ textAlign: 'center' }}>
                  <EnvironmentOutlined style={{ fontSize: 64, color: '#d9d9d9', marginBottom: 16 }} />
                  <Title level={4}>Select a Store</Title>
                  <Paragraph type="secondary">
                    Choose a store from the list to view details
                  </Paragraph>
                </div>
              </div>
            </Card>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default StoreLocatorPage;
