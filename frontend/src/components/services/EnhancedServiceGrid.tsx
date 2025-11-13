import React from 'react';
import { Row, Col, Card, Rate, Button, Typography, Image, Tag, Space, Avatar, Tooltip } from 'antd';
import { HeartOutlined, HeartFilled, ShoppingCartOutlined, EyeOutlined, ClockCircleOutlined, UserOutlined, CheckCircleOutlined, StarFilled } from '@ant-design/icons';
import type { Service } from '@/components/services/ServiceCard';

const { Text, Title, Paragraph } = Typography;

interface EnhancedServiceGridProps {
  services: Service[];
  loading?: boolean;
  viewMode?: 'grid' | 'list';
  showComparison?: boolean;
  selectedServices?: string[];
  onServiceSelect?: (serviceId: string, selected: boolean) => void;
  onServiceView?: (serviceId: string) => void;
  onAddToCart?: (service: Service) => void;
  onToggleWishlist?: (service: Service) => void;
}

// Utility function to ensure safe array operations
const safeArray = function<T>(arr: T[] | undefined | null): T[] {
  return Array.isArray(arr) ? arr : [];
};

const EnhancedServiceGrid: React.FC<EnhancedServiceGridProps> = ({
  services,
  loading = false,
  viewMode = 'grid',
  showComparison = false,
  selectedServices = [],
  onServiceSelect,
  onServiceView,
  onAddToCart,
  onToggleWishlist
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const getLowestPrice = (service: Service) => {
    if (service.startingPrice) return service.startingPrice;
    if (service.packages?.length > 0) {
      return Math.min(...safeArray(service.packages).map(pkg => pkg.price));
    }
    return 0;
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Software Development': 'blue',
      'Cloud Services': 'cyan',
      'Cybersecurity': 'red',
      'DevOps': 'green',
      'IT Consulting': 'purple',
      'Mobile Development': 'orange',
      'Data Science': 'magenta',
      'AI/ML': 'gold',
    };
    return colors[category] || 'default';
  };

  const handleServiceView = (serviceId: string | number) => {
    if (onServiceView) {
      onServiceView(String(serviceId));
    }
  };

  if (viewMode === 'list') {
    return (
      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        {safeArray(services).map(service => (
          <Card 
            key={service.id} 
            hoverable
            style={{ borderRadius: 12 }}
          >
            <Row gutter={[24, 16]}>
              <Col xs={24} sm={8} md={6}>
                <div style={{ position: 'relative' }}>
                  <Image
                    src={safeArray(service.images)[0] || '/api/placeholder/300/200'}
                    alt={service.name}
                    style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 8 }}
                    preview={false}
                  />
                  <div style={{ position: 'absolute', top: 8, right: 8 }}>
                    <Tag color={getCategoryColor(service.category)} style={{ margin: 0 }}>
                      {service.category}
                    </Tag>
                  </div>
                  {showComparison && (
                    <div style={{ position: 'absolute', top: 8, left: 8 }}>
                      <input
                        type="checkbox"
                        checked={selectedServices.includes(String(service.id))}
                        onChange={(e) => onServiceSelect?.(String(service.id), e.target.checked)}
                        style={{ transform: 'scale(1.2)' }}
                      />
                    </div>
                  )}
                </div>
              </Col>
              
              <Col xs={24} sm={16} md={18}>
                <Space direction="vertical" style={{ width: '100%' }} size="small">
                  <div>
                    <Title level={4} style={{ margin: 0, marginBottom: 8 }}>
                      {service.name}
                    </Title>
                    <Space>
                      <Avatar size="small" icon={<UserOutlined />} />
                      <Text type="secondary">{service.vendor.name}</Text>
                      <CheckCircleOutlined style={{ color: '#52c41a', fontSize: 14 }} />
                      <Text type="secondary" style={{ fontSize: 12 }}>Verified</Text>
                    </Space>
                  </div>

                  <Paragraph ellipsis={{ rows: 2 }} style={{ margin: 0, color: '#666' }}>
                    {service.shortDescription || service.description}
                  </Paragraph>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <Space>
                      <Rate disabled value={service.rating || 0} style={{ fontSize: 14 }} />
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {service.rating} ({service.reviewCount})
                      </Text>
                    </Space>
                    
                    {service.deliveryTime && (
                      <Space>
                        <ClockCircleOutlined style={{ color: '#1890ff' }} />
                        <Text style={{ fontSize: 12, color: '#1890ff' }}>
                          {service.deliveryTime}
                        </Text>
                      </Space>
                    )}
                  </div>

                  {safeArray(service.tags).length > 0 && (
                    <div>
                      {safeArray(service.tags).slice(0, 4).map((tag, index) => (
                        <Tag key={index} style={{ fontSize: 10, margin: '0 4px 4px 0' }}>
                          {tag}
                        </Tag>
                      ))}
                    </div>
                  )}

                  <Row justify="space-between" align="middle" style={{ marginTop: 12 }}>
                    <Col>
                      <Space direction="vertical" size={0}>
                        <Text strong style={{ fontSize: 18, color: '#1890ff' }}>
                          Starting from {formatPrice(getLowestPrice(service))}
                        </Text>
                        {service.packages?.length > 1 && (
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            {service.packages.length} packages available
                          </Text>
                        )}
                      </Space>
                    </Col>
                    
                    <Col>
                      <Space>
                        <Tooltip title="Add to Wishlist">
                          <Button
                            icon={<HeartOutlined />}
                            onClick={() => onToggleWishlist?.(service)}
                          />
                        </Tooltip>
                        <Button
                          type="primary"
                          icon={<ShoppingCartOutlined />}
                          onClick={() => onAddToCart?.(service)}
                          disabled={!service.isAvailable}
                        >
                          Get Quote
                        </Button>
                        <Button
                          icon={<EyeOutlined />}
                          onClick={() => handleServiceView(service.id)}
                        >
                          View Details
                        </Button>
                      </Space>
                    </Col>
                  </Row>
                </Space>
              </Col>
            </Row>
          </Card>
        ))}
      </Space>
    );
  }

  // Grid view
  return (
    <Row gutter={[16, 16]}>
      {safeArray(services).map(service => (
        <Col key={service.id} xs={24} sm={12} md={8} lg={6}>
          <Card
            hoverable
            cover={
              <div 
                style={{ position: 'relative', cursor: 'pointer' }}
                onClick={() => handleServiceView(service.id)}
              >
                <Image
                  src={safeArray(service.images)[0] || '/api/placeholder/300/200'}
                  alt={service.name}
                  style={{ width: '100%', height: 200, objectFit: 'cover' }}
                  preview={false}
                />
                <div style={{ position: 'absolute', top: 8, left: 8 }}>
                  <Button
                    type="text"
                    shape="circle"
                    icon={<HeartOutlined />}
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleWishlist?.(service);
                    }}
                    style={{ backgroundColor: 'rgba(255,255,255,0.9)' }}
                  />
                </div>
                <div style={{ position: 'absolute', top: 8, right: 8 }}>
                  <Tag color={getCategoryColor(service.category)} style={{ margin: 0 }}>
                    {service.category}
                  </Tag>
                </div>
                {showComparison && (
                  <div style={{ position: 'absolute', bottom: 8, left: 8 }}>
                    <input
                      type="checkbox"
                      checked={selectedServices.includes(String(service.id))}
                      onChange={(e) => {
                        e.stopPropagation();
                        onServiceSelect?.(String(service.id), e.target.checked);
                      }}
                      style={{ transform: 'scale(1.2)' }}
                    />
                  </div>
                )}
                {!service.isAvailable && (
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Text style={{ color: 'white', fontWeight: 'bold' }}>Currently Unavailable</Text>
                  </div>
                )}
              </div>
            }
            actions={[
              <Button
                key="cart"
                type="primary"
                icon={<ShoppingCartOutlined />}
                onClick={() => onAddToCart?.(service)}
                disabled={!service.isAvailable}
                style={{ margin: '0 8px' }}
              >
                Get Quote
              </Button>,
              <Button
                key="view"
                icon={<EyeOutlined />}
                onClick={() => handleServiceView(service.id)}
              >
                View Details
              </Button>
            ]}
            style={{ height: '100%' }}
          >
            <Card.Meta
              title={
                <div
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleServiceView(service.id)}
                >
                  {service.name}
                </div>
              }
              description={
                <div>
                  <Space direction="vertical" style={{ width: '100%' }} size="small">
                    {/* Vendor Info */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <UserOutlined />
                      <Text type="secondary">{service.vendor.name}</Text>
                      {service.vendor.rating && (
                        <Rate disabled value={service.vendor.rating} style={{ fontSize: 12 }} />
                      )}
                    </div>

                    {/* Service Rating and Reviews */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Rate disabled value={service.rating || 0} style={{ fontSize: 12 }} />
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        ({service.reviewCount || 0} reviews)
                      </Text>
                    </div>

                    {/* Service Description */}
                    <Paragraph 
                      ellipsis={{ rows: 2 }} 
                      style={{ margin: 0, fontSize: 12, color: '#666' }}
                    >
                      {service.shortDescription || service.description}
                    </Paragraph>

                    {/* Delivery Time */}
                    {service.deliveryTime && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <ClockCircleOutlined style={{ fontSize: 12, color: '#1890ff' }} />
                        <Text style={{ fontSize: 12, color: '#1890ff' }}>
                          Delivery: {service.deliveryTime}
                        </Text>
                      </div>
                    )}

                    {/* Tags */}
                    {safeArray(service.tags).length > 0 && (
                      <div style={{ marginTop: 4 }}>
                        {safeArray(service.tags).slice(0, 3).map((tag, index) => (
                          <Tag key={index} style={{ fontSize: 10, margin: '0 2px 2px 0' }}>
                            {tag}
                          </Tag>
                        ))}
                        {safeArray(service.tags).length > 3 && (
                          <Tag style={{ fontSize: 10 }}>
                            +{safeArray(service.tags).length - 3} more
                          </Tag>
                        )}
                      </div>
                    )}

                    {/* Pricing */}
                    <div style={{ marginTop: 8, borderTop: '1px solid #f0f0f0', paddingTop: 8 }}>
                      <Text strong style={{ fontSize: 16, color: '#1890ff' }}>
                        Starting from {formatPrice(getLowestPrice(service))}
                      </Text>
                      {service.packages?.length > 1 && (
                        <div>
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            {service.packages.length} packages available
                          </Text>
                        </div>
                      )}
                    </div>
                  </Space>
                </div>
              }
            />
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default EnhancedServiceGrid;