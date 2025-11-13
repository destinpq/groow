import React from 'react';
import { Row, Col, Spin, Empty } from 'antd';
import ServiceCard, { type Service } from './ServiceCard';

interface ServiceGridProps {
  services: Service[];
  wishlist: string[];
  loading?: boolean;
  onAddToCart: (service: Service, packageId?: number) => void;
  onToggleWishlist: (service: Service) => void;
  onView: (serviceId: number) => void;
}

const ServiceGrid: React.FC<ServiceGridProps> = ({
  services,
  wishlist,
  loading = false,
  onAddToCart,
  onToggleWishlist,
  onView
}) => {
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px 0' }}>
        <Spin size="large" tip="Loading IT services..." />
      </div>
    );
  }

  if (!services || services.length === 0) {
    return (
      <Empty
        description="No IT services found"
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        style={{ padding: '50px 0' }}
      />
    );
  }

  return (
    <Row gutter={[16, 16]}>
      {services.map(service => {
        const isInWishlist = wishlist.includes(service.id.toString());
        
        return (
          <Col key={service.id} xs={24} sm={12} md={8} lg={6}>
            <ServiceCard
              service={service}
              isInWishlist={isInWishlist}
              onAddToCart={onAddToCart}
              onToggleWishlist={onToggleWishlist}
              onView={onView}
            />
          </Col>
        );
      })}
    </Row>
  );
};

export default ServiceGrid;