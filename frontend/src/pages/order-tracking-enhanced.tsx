import React, { useState, useEffect, useCallback } from 'react';
import { Card, Input, Button, Timeline, Badge, Row, Col, Space, Avatar, Rate, Modal, Switch, message, Descriptions, Tag, Divider } from 'antd';
import { SearchOutlined, EnvironmentOutlined, PhoneOutlined, CarOutlined, BellOutlined, EyeOutlined, ClockCircleOutlined, InboxOutlined } from '@ant-design/icons';
import { orderTrackingAPI, type OrderTracking } from '../services/api/orderTrackingAPI';
// import './order-tracking.less';

const { Search } = Input;

// Enhanced Order Tracking Component with Real-time Updates
const EnhancedOrderTracking: React.FC = () => {
  const [searchValue, setSearchValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [trackingData, setTrackingData] = useState<OrderTracking | null>(null);
  const [realTimeLocation, setRealTimeLocation] = useState<any>(null);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [notificationPrefs, setNotificationPrefs] = useState({
    email: true,
    sms: false,
    push: true
  });
  const [autoRefresh, setAutoRefresh] = useState(false);

  // Auto-refresh real-time location every 30 seconds
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (autoRefresh && trackingData?.trackingNumber) {
      interval = setInterval(async () => {
        try {
          const response = await orderTrackingAPI.getRealTimeLocation(trackingData.trackingNumber!);
          if (response.success) {
            setRealTimeLocation(response.data);
          }
        } catch (error) {
          console.error('Error updating real-time location:', error);
        }
      }, 30000); // 30 seconds
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh, trackingData?.trackingNumber]);

  const handleSearch = async (value: string) => {
    if (!value.trim()) {
      message.warning('Please enter an order number or tracking number');
      return;
    }

    setLoading(true);
    try {
      const response = await orderTrackingAPI.getOrderTracking(value);
      if (response.success && response.data) {
        setTrackingData(response.data);
        
        // Get initial real-time location if shipped
        if (response.data.status === 'shipped' || response.data.status === 'out_for_delivery') {
          const locationResponse = await orderTrackingAPI.getRealTimeLocation(response.data.trackingNumber!);
          if (locationResponse.success) {
            setRealTimeLocation(locationResponse.data);
          }
        }
        
        message.success('Order tracking information loaded');
      } else {
        message.error(response.message || 'Order not found');
        setTrackingData(null);
      }
    } catch (error) {
      console.error('Error searching order:', error);
      message.error('Failed to search order');
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationUpdate = async () => {
    if (!trackingData) return;

    try {
      const response = await orderTrackingAPI.subscribeToNotifications(
        trackingData.orderId,
        notificationPrefs
      );
      
      if (response.success) {
        message.success('Notification preferences updated');
        setShowNotificationModal(false);
      } else {
        message.error('Failed to update preferences');
      }
    } catch (error) {
      console.error('Error updating notifications:', error);
      message.error('Failed to update preferences');
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      placed: 'default',
      confirmed: 'processing',
      processing: 'warning',
      shipped: 'blue',
      out_for_delivery: 'orange',
      delivered: 'success',
      cancelled: 'error'
    };
    return colors[status] || 'default';
  };

  const getStatusIcon = (status: string) => {
    const icons: Record<string, React.ReactNode> = {
      placed: <ClockCircleOutlined />,
      confirmed: <ClockCircleOutlined />,
      processing: <InboxOutlined />,
      shipped: <CarOutlined />,
      out_for_delivery: <EnvironmentOutlined />,
      delivered: <InboxOutlined />,
      cancelled: <ClockCircleOutlined />
    };
    return icons[status] || <ClockCircleOutlined />;
  };

  const renderTrackingTimeline = () => {
    if (!trackingData) return null;

    const timelineItems = trackingData.updates.map((update, index) => ({
      key: update.id,
      dot: getStatusIcon(update.status),
      color: getStatusColor(update.status),
      children: (
        <div>
          <div style={{ fontWeight: 500, marginBottom: 4 }}>
            {update.description}
          </div>
          <div style={{ color: '#666', fontSize: '12px', marginBottom: 4 }}>
            <EnvironmentOutlined style={{ marginRight: 4 }} />
            {update.location}
          </div>
          <div style={{ color: '#999', fontSize: '11px' }}>
            {new Date(update.timestamp).toLocaleString()}
          </div>
          {update.trackingNumber && (
            <div style={{ color: '#1890ff', fontSize: '11px', marginTop: 2 }}>
              Tracking: {update.trackingNumber}
            </div>
          )}
        </div>
      )
    }));

    return (
      <Timeline
        mode="left"
        items={timelineItems}
        style={{ marginTop: 16 }}
      />
    );
  };

  const renderDeliveryAgent = () => {
    if (!trackingData?.deliveryAgent) return null;

    const { deliveryAgent } = trackingData;

    return (
      <Card title="Delivery Agent" size="small" style={{ marginTop: 16 }}>
        <Row gutter={16} align="middle">
          <Col>
            <Avatar size={64} src={deliveryAgent.photo} icon={<CarOutlined />} />
          </Col>
          <Col flex={1}>
            <div style={{ fontWeight: 500, fontSize: '16px' }}>
              {deliveryAgent.name}
            </div>
            <div style={{ color: '#666', marginBottom: 4 }}>
              <PhoneOutlined style={{ marginRight: 4 }} />
              {deliveryAgent.phone}
            </div>
            <div style={{ marginBottom: 4 }}>
              <Rate disabled value={deliveryAgent.rating} allowHalf />
              <span style={{ marginLeft: 8, color: '#666' }}>
                {deliveryAgent.rating}/5
              </span>
            </div>
            {deliveryAgent.vehicleInfo && (
              <div style={{ color: '#666', fontSize: '12px' }}>
                <CarOutlined style={{ marginRight: 4 }} />
                {deliveryAgent.vehicleInfo}
              </div>
            )}
          </Col>
          <Col>
            <Button type="primary" ghost icon={<PhoneOutlined />}>
              Call
            </Button>
          </Col>
        </Row>
      </Card>
    );
  };

  const renderRealTimeLocation = () => {
    if (!realTimeLocation) return null;

    return (
      <Card 
        title="Real-time Location" 
        size="small" 
        style={{ marginTop: 16 }}
        extra={
          <Switch
            checkedChildren="Auto-refresh"
            unCheckedChildren="Manual"
            checked={autoRefresh}
            onChange={setAutoRefresh}
          />
        }
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <div>
            <EnvironmentOutlined style={{ color: '#1890ff', marginRight: 8 }} />
            <strong>Current Location:</strong> {realTimeLocation.currentLocation.address}
          </div>
          <div>
            <ClockCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />
            <strong>Estimated Arrival:</strong> {new Date(realTimeLocation.estimatedArrival).toLocaleString()}
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            Last updated: {new Date(realTimeLocation.currentLocation.timestamp).toLocaleString()}
          </div>
          <Button
            type="dashed"
            icon={<EyeOutlined />}
            onClick={() => {
              // In a real implementation, this would open a map modal
              message.info('Map view would open here');
            }}
          >
            View on Map
          </Button>
        </Space>
      </Card>
    );
  };

  const renderPackageInfo = () => {
    if (!trackingData?.packages?.length) return null;

    return (
      <Card title="Package Information" size="small" style={{ marginTop: 16 }}>
        {trackingData.packages.map((pkg, index) => (
          <div key={pkg.id} style={{ marginBottom: index < trackingData.packages.length - 1 ? 16 : 0 }}>
            <Descriptions size="small" column={2}>
              <Descriptions.Item label="Weight">{pkg.weight}</Descriptions.Item>
              <Descriptions.Item label="Dimensions">{pkg.dimensions}</Descriptions.Item>
            </Descriptions>
            
            <Divider style={{ margin: '8px 0' }} />
            
            <div style={{ fontWeight: 500, marginBottom: 8 }}>Items in Package:</div>
            {pkg.items.map((item, itemIndex) => (
              <Row key={itemIndex} gutter={8} style={{ marginBottom: 4 }}>
                <Col>
                  <Avatar size="small" src={item.image} icon={<InboxOutlined />} />
                </Col>
                <Col flex={1}>
                  <span>{item.name}</span>
                  <Tag style={{ marginLeft: 8 }}>
                    Qty: {item.quantity}
                  </Tag>
                </Col>
              </Row>
            ))}
          </div>
        ))}
      </Card>
    );
  };

  return (
    <div className="enhanced-order-tracking" style={{ padding: '24px', maxWidth: 1200, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: '28px', fontWeight: 600, marginBottom: 8 }}>
          Order Tracking
        </h1>
        <p style={{ color: '#666', fontSize: '16px' }}>
          Track your orders in real-time with detailed updates and delivery information
        </p>
      </div>

      {/* Search Section */}
      <Card style={{ marginBottom: 24 }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <div style={{ fontWeight: 500, marginBottom: 8 }}>
            Enter Order Number or Tracking Number
          </div>
          <Search
            placeholder="e.g., ORD-123456 or TRK123456"
            enterButton={<Button type="primary" icon={<SearchOutlined />}>Track Order</Button>}
            size="large"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onSearch={handleSearch}
            loading={loading}
          />
          <div style={{ fontSize: '12px', color: '#666' }}>
            You can also track using your email address or phone number
          </div>
        </Space>
      </Card>

      {/* Tracking Results */}
      {trackingData && (
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={14}>
            {/* Order Summary */}
            <Card
              title={
                <Space>
                  <span>Order {trackingData.orderNumber}</span>
                  <Badge
                    status={getStatusColor(trackingData.status) as any}
                    text={trackingData.status.toUpperCase()}
                  />
                </Space>
              }
              extra={
                <Button
                  icon={<BellOutlined />}
                  onClick={() => setShowNotificationModal(true)}
                >
                  Notifications
                </Button>
              }
            >
              <Row gutter={[16, 8]}>
                <Col span={12}>
                  <div style={{ color: '#666' }}>Tracking Number</div>
                  <div style={{ fontWeight: 500 }}>{trackingData.trackingNumber}</div>
                </Col>
                <Col span={12}>
                  <div style={{ color: '#666' }}>Carrier</div>
                  <div style={{ fontWeight: 500 }}>{trackingData.carrier}</div>
                </Col>
                <Col span={12}>
                  <div style={{ color: '#666' }}>Estimated Delivery</div>
                  <div style={{ fontWeight: 500, color: '#52c41a' }}>
                    {new Date(trackingData.estimatedDelivery).toLocaleDateString()}
                  </div>
                </Col>
                <Col span={12}>
                  <div style={{ color: '#666' }}>Delivery Address</div>
                  <div style={{ fontWeight: 500 }}>
                    {trackingData.shippingAddress.street}, {trackingData.shippingAddress.city}
                  </div>
                </Col>
              </Row>
            </Card>

            {/* Tracking Timeline */}
            <Card title="Tracking History" style={{ marginTop: 16 }}>
              {renderTrackingTimeline()}
            </Card>

            {/* Package Information */}
            {renderPackageInfo()}
          </Col>

          <Col xs={24} lg={10}>
            {/* Real-time Location */}
            {(trackingData.status === 'shipped' || trackingData.status === 'out_for_delivery') && renderRealTimeLocation()}

            {/* Delivery Agent */}
            {trackingData.status === 'out_for_delivery' && renderDeliveryAgent()}

            {/* Quick Actions */}
            <Card title="Quick Actions" size="small" style={{ marginTop: 16 }}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Button block icon={<PhoneOutlined />}>
                  Contact Support
                </Button>
                <Button block icon={<EnvironmentOutlined />}>
                  Update Delivery Address
                </Button>
                <Button block icon={<ClockCircleOutlined />}>
                  Reschedule Delivery
                </Button>
                <Button block>
                  Download Invoice
                </Button>
              </Space>
            </Card>

            {/* Delivery Instructions */}
            <Card title="Delivery Instructions" size="small" style={{ marginTop: 16 }}>
              <div style={{ fontSize: '12px', color: '#666', lineHeight: 1.5 }}>
                • Please deliver to the front door
                • Call upon arrival
                • Leave package with security if not home
                • Signature required for delivery
              </div>
            </Card>
          </Col>
        </Row>
      )}

      {/* No Results State */}
      {!trackingData && !loading && searchValue && (
        <Card style={{ textAlign: 'center', padding: '48px 24px' }}>
          <InboxOutlined style={{ fontSize: '48px', color: '#d9d9d9', marginBottom: 16 }} />
          <h3>No tracking information found</h3>
          <p style={{ color: '#666', marginBottom: 16 }}>
            We couldn't find any tracking information for "{searchValue}".
            Please check your order number or tracking number and try again.
          </p>
          <Button type="primary" onClick={() => setSearchValue('')}>
            Try Another Search
          </Button>
        </Card>
      )}

      {/* Notification Preferences Modal */}
      <Modal
        title="Notification Preferences"
        open={showNotificationModal}
        onOk={handleNotificationUpdate}
        onCancel={() => setShowNotificationModal(false)}
        okText="Save Preferences"
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <div>
            <Switch
              checked={notificationPrefs.email}
              onChange={(checked) => setNotificationPrefs(prev => ({ ...prev, email: checked }))}
            />
            <span style={{ marginLeft: 8 }}>Email Notifications</span>
          </div>
          <div>
            <Switch
              checked={notificationPrefs.sms}
              onChange={(checked) => setNotificationPrefs(prev => ({ ...prev, sms: checked }))}
            />
            <span style={{ marginLeft: 8 }}>SMS Notifications</span>
          </div>
          <div>
            <Switch
              checked={notificationPrefs.push}
              onChange={(checked) => setNotificationPrefs(prev => ({ ...prev, push: checked }))}
            />
            <span style={{ marginLeft: 8 }}>Push Notifications</span>
          </div>
        </Space>
      </Modal>
    </div>
  );
};

export default EnhancedOrderTracking;