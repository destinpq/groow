import React from 'react';
import { Card, Rate, Button, Typography, Image, Tag, Space } from 'antd';
import { HeartOutlined, HeartFilled, ShoppingCartOutlined, EyeOutlined, ClockCircleOutlined, UserOutlined } from '@ant-design/icons';

const { Text, Paragraph } = Typography;

interface ServicePackage {
  id: number;
  name: string;
  price: number;
  duration?: string;
  features: string[];
}

interface Service {
  id: number;
  name: string;
  description: string;
  shortDescription?: string;
  category: string;
  subcategory?: string;
  vendor: {
    id: number;
    name: string;
    rating?: number;
  };
  images?: string[];
  packages: ServicePackage[];
  rating?: number;
  reviewCount?: number;
  deliveryTime?: string;
  tags?: string[];
  isAvailable: boolean;
  startingPrice?: number;
}

interface ServiceCardProps {
  service: Service;
  isInWishlist: boolean;
  onAddToCart: (service: Service, packageId?: number) => void;
  onToggleWishlist: (service: Service) => void;
  onView: (serviceId: number) => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  isInWishlist,
  onAddToCart,
  onToggleWishlist,
  onView
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const getLowestPrice = () => {
    if (service.startingPrice) return service.startingPrice;
    if (service.packages?.length > 0) {
      return Math.min(...service.packages.map(pkg => pkg.price));
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

  return (
    <Card
      hoverable
      cover={
        <div 
          style={{ position: 'relative', cursor: 'pointer' }}
          onClick={() => onView(service.id)}
        >
          <Image
            src={service.images?.[0] || '/api/placeholder/300/200'}
            alt={service.name}
            style={{ width: '100%', height: 200, objectFit: 'cover' }}
            preview={false}
          />
          <div style={{ position: 'absolute', top: 8, left: 8 }}>
            <Button
              type="text"
              shape="circle"
              icon={isInWishlist ? <HeartFilled style={{ color: '#f5222d' }} /> : <HeartOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                onToggleWishlist(service);
              }}
              style={{ backgroundColor: 'rgba(255,255,255,0.9)' }}
            />
          </div>
          <div style={{ position: 'absolute', top: 8, right: 8 }}>
            <Tag color={getCategoryColor(service.category)} style={{ margin: 0 }}>
              {service.category}
            </Tag>
          </div>
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
          onClick={() => onAddToCart(service)}
          disabled={!service.isAvailable}
          style={{ margin: '0 8px' }}
        >
          Get Quote
        </Button>,
        <Button
          key="view"
          icon={<EyeOutlined />}
          onClick={() => onView(service.id)}
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
            onClick={() => onView(service.id)}
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
              {service.tags && service.tags.length > 0 && (
                <div style={{ marginTop: 4 }}>
                  {service.tags.slice(0, 3).map((tag, index) => (
                    <Tag key={index} style={{ fontSize: 10, margin: '0 2px 2px 0' }}>
                      {tag}
                    </Tag>
                  ))}
                  {service.tags.length > 3 && (
                    <Tag style={{ fontSize: 10 }}>
                      +{service.tags.length - 3} more
                    </Tag>
                  )}
                </div>
              )}

              {/* Pricing */}
              <div style={{ marginTop: 8, borderTop: '1px solid #f0f0f0', paddingTop: 8 }}>
                <Text strong style={{ fontSize: 16, color: '#1890ff' }}>
                  Starting from {formatPrice(getLowestPrice())}
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
  );
};

export default ServiceCard;
export type { Service, ServiceCardProps, ServicePackage };