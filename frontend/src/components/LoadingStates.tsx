import React from 'react';
import { Skeleton, Spin, Card, Row, Col, Space, Empty } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

// Product Card Skeleton
export const ProductCardSkeleton: React.FC<{ count?: number }> = ({ count = 8 }) => (
  <Row gutter={[16, 16]}>
    {Array.from({ length: count }).map((_, index) => (
      <Col xs={24} sm={12} md={8} lg={6} key={index}>
        <Card>
          <Skeleton.Image active style={{ width: '100%', height: 200 }} />
          <Skeleton active paragraph={{ rows: 3 }} style={{ marginTop: 16 }} />
        </Card>
      </Col>
    ))}
  </Row>
);

// Table Skeleton
export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => (
  <Card>
    {Array.from({ length: rows }).map((_, index) => (
      <div key={index} style={{ marginBottom: 16 }}>
        <Skeleton active paragraph={{ rows: 1 }} />
      </div>
    ))}
  </Card>
);

// Dashboard Skeleton
export const DashboardSkeleton: React.FC = () => (
  <div>
    <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
      {Array.from({ length: 4 }).map((_, index) => (
        <Col xs={24} sm={12} lg={6} key={index}>
          <Card>
            <Skeleton active paragraph={{ rows: 2 }} />
          </Card>
        </Col>
      ))}
    </Row>
    <Row gutter={[16, 16]}>
      <Col xs={24} lg={16}>
        <Card>
          <Skeleton active paragraph={{ rows: 8 }} />
        </Card>
      </Col>
      <Col xs={24} lg={8}>
        <Card>
          <Skeleton active paragraph={{ rows: 8 }} />
        </Card>
      </Col>
    </Row>
  </div>
);

// Form Skeleton
export const FormSkeleton: React.FC<{ fields?: number }> = ({ fields = 5 }) => (
  <Card>
    <Space direction="vertical" style={{ width: '100%' }} size="large">
      {Array.from({ length: fields }).map((_, index) => (
        <div key={index}>
          <Skeleton.Input active style={{ width: 200, marginBottom: 8 }} />
          <Skeleton.Input active block />
        </div>
      ))}
      <Skeleton.Button active size="large" />
    </Space>
  </Card>
);

// Profile Skeleton
export const ProfileSkeleton: React.FC = () => (
  <Card>
    <Space direction="vertical" align="center" style={{ width: '100%' }}>
      <Skeleton.Avatar active size={100} />
      <Skeleton active paragraph={{ rows: 4 }} style={{ width: 300 }} />
    </Space>
  </Card>
);

// List Skeleton
export const ListSkeleton: React.FC<{ items?: number }> = ({ items = 5 }) => (
  <Card>
    {Array.from({ length: items }).map((_, index) => (
      <div key={index} style={{ marginBottom: 16 }}>
        <Space>
          <Skeleton.Avatar active />
          <div style={{ flex: 1 }}>
            <Skeleton active paragraph={{ rows: 2 }} />
          </div>
        </Space>
      </div>
    ))}
  </Card>
);

// Chart Skeleton
export const ChartSkeleton: React.FC<{ height?: number }> = ({ height = 300 }) => (
  <Card>
    <Skeleton.Node active style={{ width: '100%', height }}>
      <div style={{ width: '100%', height }} />
    </Skeleton.Node>
  </Card>
);

// Full Page Loading
export const PageLoading: React.FC<{ tip?: string }> = ({ tip = 'Loading...' }) => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: '#f0f2f5',
    }}
  >
    <Space direction="vertical" align="center" size="large">
      <Spin
        indicator={<LoadingOutlined style={{ fontSize: 48, color: '#1890ff' }} spin />}
        size="large"
      />
      <span style={{ fontSize: 16, color: '#666' }}>{tip}</span>
    </Space>
  </div>
);

// Inline Loading
export const InlineLoading: React.FC<{ tip?: string }> = ({ tip = 'Loading...' }) => (
  <div style={{ textAlign: 'center', padding: '50px 0' }}>
    <Spin size="large" tip={tip} />
  </div>
);

// Empty State with Loading Option
export const EmptyState: React.FC<{
  loading?: boolean;
  description?: string;
  action?: React.ReactNode;
}> = ({ loading = false, description = 'No data available', action }) => {
  if (loading) {
    return <InlineLoading />;
  }

  return (
    <div style={{ padding: '50px 0' }}>
      <Empty description={description}>{action}</Empty>
    </div>
  );
};

// Button Loading State
export const ButtonLoading: React.FC = () => (
  <Spin indicator={<LoadingOutlined style={{ fontSize: 16 }} spin />} />
);

// Card Loading Overlay
export const CardLoadingOverlay: React.FC<{ loading: boolean; children: React.ReactNode }> = ({
  loading,
  children,
}) => (
  <Spin spinning={loading} size="large">
    {children}
  </Spin>
);

// Lazy Load Wrapper
export const LazyLoadWrapper: React.FC<{
  loading: boolean;
  skeleton: React.ReactNode;
  children: React.ReactNode;
}> = ({ loading, skeleton, children }) => {
  return loading ? <>{skeleton}</> : <>{children}</>;
};
