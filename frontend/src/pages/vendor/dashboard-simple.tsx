// Simple Vendor Dashboard with Mock Data
import React from 'react';
import { 
  Row, 
  Col, 
  Card, 
  Statistic, 
  Typography,
  Alert,
} from 'antd';
import {
  DollarOutlined,
  ShoppingOutlined,
  StarOutlined,
  UserOutlined,
} from '@ant-design/icons';

const { Title } = Typography;

const VendorDashboardSimple = () => {
  return (
    <div style={{ padding: 24 }}>
      <Alert
        message="Vendor Dashboard"
        description="Welcome to your vendor dashboard. Analytics endpoints are being configured."
        type="info"
        showIcon
        style={{ marginBottom: 24 }}
      />

      <Title level={2}>Dashboard Overview</Title>
      
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Revenue"
              value={12450}
              precision={2}
              prefix={<DollarOutlined />}
              suffix="USD"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Orders"
              value={156}
              prefix={<ShoppingOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Average Rating"
              value={4.7}
              precision={1}
              prefix={<StarOutlined />}
              suffix="/ 5"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Customers"
              value={89}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Card title="Recent Activity">
        <p>No recent activity to display.</p>
      </Card>
    </div>
  );
};

export default VendorDashboardSimple;

