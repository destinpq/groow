import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Table,
  Tag,
  Statistic,
  Space,
  Button,
  Progress,
  Alert,
  Tabs,
  List,
  Switch,
  Select,
  Divider,
  message,
} from 'antd';
import {
  ThunderboltOutlined,
  RocketOutlined,
  CloudServerOutlined,
  DatabaseOutlined,
  CompressOutlined,
  FileImageOutlined,
  ApiOutlined,
  CheckCircleOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text, Paragraph } = Typography;

interface PerformanceMetric {
  name: string;
  current: number;
  target: number;
  unit: string;
  status: 'good' | 'warning' | 'critical';
}

interface CacheEntry {
  key: string;
  type: 'redis' | 'memory' | 'cdn';
  size: string;
  hits: number;
  hitRate: number;
  ttl: string;
}

interface AssetOptimization {
  type: string;
  originalSize: number;
  optimizedSize: number;
  savings: number;
  count: number;
}

const performanceMetrics: PerformanceMetric[] = [
  { name: 'First Contentful Paint (FCP)', current: 1.2, target: 1.8, unit: 's', status: 'good' },
  { name: 'Largest Contentful Paint (LCP)', current: 2.1, target: 2.5, unit: 's', status: 'good' },
  { name: 'Time to Interactive (TTI)', current: 3.5, target: 3.8, unit: 's', status: 'good' },
  { name: 'Total Blocking Time (TBT)', current: 180, target: 300, unit: 'ms', status: 'good' },
  { name: 'Cumulative Layout Shift (CLS)', current: 0.08, target: 0.1, unit: '', status: 'good' },
  { name: 'Speed Index', current: 2.8, target: 3.4, unit: 's', status: 'good' },
];

const cacheData: CacheEntry[] = [
  { key: 'product_list', type: 'redis', size: '2.4 MB', hits: 15420, hitRate: 94.2, ttl: '1h' },
  { key: 'user_sessions', type: 'redis', size: '1.8 MB', hits: 8920, hitRate: 89.5, ttl: '30m' },
  { key: 'api_responses', type: 'memory', size: '850 KB', hits: 12340, hitRate: 91.8, ttl: '15m' },
  { key: 'static_assets', type: 'cdn', size: '45 MB', hits: 45680, hitRate: 98.5, ttl: '24h' },
];

const assetOptimizations: AssetOptimization[] = [
  { type: 'Images', originalSize: 125.5, optimizedSize: 42.8, savings: 65.9, count: 342 },
  { type: 'JavaScript', originalSize: 3.8, optimizedSize: 1.2, savings: 68.4, count: 45 },
  { type: 'CSS', originalSize: 1.2, optimizedSize: 0.45, savings: 62.5, count: 18 },
  { type: 'Fonts', originalSize: 2.4, optimizedSize: 1.1, savings: 54.2, count: 8 },
];

const PerformanceOptimizationPage: React.FC = () => {
  const [cacheEnabled, setCacheEnabled] = useState<boolean>(true);
  const [cdnEnabled, setCdnEnabled] = useState<boolean>(true);
  const [compressionEnabled, setCompressionEnabled] = useState<boolean>(true);
  const [lazyLoadingEnabled, setLazyLoadingEnabled] = useState<boolean>(true);

  const handleClearCache = (type: string) => {
    message.success(`${type} cache cleared successfully`);
  };

  const handleOptimizeAssets = () => {
    message.success('Asset optimization started');
  };

  const metricColumns: ColumnsType<PerformanceMetric> = [
    {
      title: 'Metric',
      dataIndex: 'name',
      key: 'name',
      render: (name) => <Text strong>{name}</Text>,
    },
    {
      title: 'Current',
      key: 'current',
      render: (_, record) => (
        <Text code>
          {record.current}
          {record.unit}
        </Text>
      ),
    },
    {
      title: 'Target',
      key: 'target',
      render: (_, record) => (
        <Text type="secondary">
          {record.target}
          {record.unit}
        </Text>
      ),
    },
    {
      title: 'Progress',
      key: 'progress',
      render: (_, record) => {
        const progress = Math.min((record.target / record.current) * 100, 100);
        return <Progress percent={Math.round(progress)} size="small" />;
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: PerformanceMetric['status']) => {
        const config: Record<PerformanceMetric['status'], { color: string; icon: React.ReactNode; text: string }> = {
          good: { color: 'green', icon: <CheckCircleOutlined />, text: 'Good' },
          warning: { color: 'orange', icon: <WarningOutlined />, text: 'Needs Work' },
          critical: { color: 'red', icon: <WarningOutlined />, text: 'Critical' },
        };
        return (
          <Tag color={config[status].color} icon={config[status].icon}>
            {config[status].text}
          </Tag>
        );
      },
    },
  ];

  const cacheColumns: ColumnsType<CacheEntry> = [
    {
      title: 'Cache Key',
      dataIndex: 'key',
      key: 'key',
      render: (key) => <Text code>{key}</Text>,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: CacheEntry['type']) => {
        const colors: Record<CacheEntry['type'], string> = { redis: 'red', memory: 'blue', cdn: 'green' };
        return <Tag color={colors[type]}>{type.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Size',
      dataIndex: 'size',
      key: 'size',
    },
    {
      title: 'Hits',
      dataIndex: 'hits',
      key: 'hits',
      render: (hits) => <Text>{hits.toLocaleString()}</Text>,
      sorter: (a, b) => a.hits - b.hits,
    },
    {
      title: 'Hit Rate',
      dataIndex: 'hitRate',
      key: 'hitRate',
      render: (rate) => (
        <div>
          <Progress percent={rate} size="small" />
        </div>
      ),
      sorter: (a, b) => a.hitRate - b.hitRate,
    },
    {
      title: 'TTL',
      dataIndex: 'ttl',
      key: 'ttl',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button size="small" danger onClick={() => handleClearCache(record.type)}>
          Clear
        </Button>
      ),
    },
  ];

  const assetColumns: ColumnsType<AssetOptimization> = [
    {
      title: 'Asset Type',
      dataIndex: 'type',
      key: 'type',
      render: (type) => <Text strong>{type}</Text>,
    },
    {
      title: 'Original Size',
      dataIndex: 'originalSize',
      key: 'originalSize',
      render: (size) => <Text>{size} MB</Text>,
    },
    {
      title: 'Optimized Size',
      dataIndex: 'optimizedSize',
      key: 'optimizedSize',
      render: (size) => <Text>{size} MB</Text>,
    },
    {
      title: 'Savings',
      dataIndex: 'savings',
      key: 'savings',
      render: (savings) => <Tag color="green">{savings.toFixed(1)}%</Tag>,
      sorter: (a, b) => a.savings - b.savings,
    },
    {
      title: 'Files',
      dataIndex: 'count',
      key: 'count',
      render: (count) => <Text type="secondary">{count} files</Text>,
    },
  ];

  const performanceScore = 94;
  const avgLoadTime = 1.8;
  const cacheHitRate = 93.5;
  const totalSavings = 65.2;

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={3}>
          <RocketOutlined style={{ color: '#1890ff' }} /> Performance Optimization
        </Title>
        <Paragraph type="secondary">
          Monitor and optimize website performance, caching, and asset delivery
        </Paragraph>
      </div>

      <Alert
        message="Performance Status: Excellent"
        description="All performance metrics are within target ranges. Page load time is 40% faster than industry average."
        type="success"
        showIcon
        icon={<ThunderboltOutlined />}
        closable
        style={{ marginBottom: 24 }}
      />

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Performance Score"
              value={performanceScore}
              suffix="/100"
              prefix={<RocketOutlined />}
              valueStyle={{ color: performanceScore > 90 ? '#52c41a' : '#faad14' }}
            />
            <Progress percent={performanceScore} showInfo={false} strokeColor="#52c41a" />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Avg Load Time"
              value={avgLoadTime}
              suffix="s"
              prefix={<ThunderboltOutlined />}
              valueStyle={{ color: '#1890ff' }}
              precision={1}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Cache Hit Rate"
              value={cacheHitRate}
              suffix="%"
              prefix={<DatabaseOutlined />}
              valueStyle={{ color: '#52c41a' }}
              precision={1}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Size Reduction"
              value={totalSavings}
              suffix="%"
              prefix={<CompressOutlined />}
              valueStyle={{ color: '#722ed1' }}
              precision={1}
            />
          </Card>
        </Col>
      </Row>

      <Tabs
        defaultActiveKey="metrics"
        items={[
          {
            key: 'metrics',
            label: 'Performance Metrics',
            children: (
              <Card title="Core Web Vitals & Metrics">
                <Table
                  columns={metricColumns}
                  dataSource={performanceMetrics}
                  rowKey="name"
                  pagination={false}
                />
              </Card>
            ),
          },
          {
            key: 'caching',
            label: 'Caching',
            children: (
              <Card
                title="Cache Management"
                extra={
                  <Space>
                    <Button onClick={() => handleClearCache('all')}>Clear All Caches</Button>
                  </Space>
                }
              >
                <Row gutter={16} style={{ marginBottom: 16 }}>
                  <Col span={8}>
                    <Card size="small">
                      <Statistic
                        title="Redis Cache"
                        value="4.2 MB"
                        prefix={<DatabaseOutlined />}
                        valueStyle={{ fontSize: 18 }}
                      />
                    </Card>
                  </Col>
                  <Col span={8}>
                    <Card size="small">
                      <Statistic
                        title="Memory Cache"
                        value="850 KB"
                        prefix={<CloudServerOutlined />}
                        valueStyle={{ fontSize: 18 }}
                      />
                    </Card>
                  </Col>
                  <Col span={8}>
                    <Card size="small">
                      <Statistic
                        title="CDN Cache"
                        value="45 MB"
                        prefix={<ApiOutlined />}
                        valueStyle={{ fontSize: 18 }}
                      />
                    </Card>
                  </Col>
                </Row>

                <Table columns={cacheColumns} dataSource={cacheData} rowKey="key" pagination={false} />
              </Card>
            ),
          },
          {
            key: 'assets',
            label: 'Asset Optimization',
            children: (
              <Card
                title="Asset Optimization Summary"
                extra={
                  <Button type="primary" icon={<CompressOutlined />} onClick={handleOptimizeAssets}>
                    Optimize All Assets
                  </Button>
                }
              >
                <Alert
                  message="Total Size Reduction"
                  description={`Optimized assets are ${totalSavings.toFixed(1)}% smaller than originals, saving ${(
                    assetOptimizations.reduce((sum, a) => sum + (a.originalSize - a.optimizedSize), 0)
                  ).toFixed(1)} MB`}
                  type="info"
                  showIcon
                  style={{ marginBottom: 16 }}
                />

                <Table
                  columns={assetColumns}
                  dataSource={assetOptimizations}
                  rowKey="type"
                  pagination={false}
                />
              </Card>
            ),
          },
          {
            key: 'settings',
            label: 'Optimization Settings',
            children: (
              <Card title="Performance Settings">
                <List
                  dataSource={[
                    {
                      title: 'Redis Caching',
                      description: 'Cache database queries and API responses',
                      enabled: cacheEnabled,
                      toggle: setCacheEnabled,
                      icon: <DatabaseOutlined />,
                    },
                    {
                      title: 'CDN Delivery',
                      description: 'Serve static assets from global CDN',
                      enabled: cdnEnabled,
                      toggle: setCdnEnabled,
                      icon: <CloudServerOutlined />,
                    },
                    {
                      title: 'GZIP Compression',
                      description: 'Compress responses to reduce transfer size',
                      enabled: compressionEnabled,
                      toggle: setCompressionEnabled,
                      icon: <CompressOutlined />,
                    },
                    {
                      title: 'Lazy Loading',
                      description: 'Load images and components on demand',
                      enabled: lazyLoadingEnabled,
                      toggle: setLazyLoadingEnabled,
                      icon: <FileImageOutlined />,
                    },
                  ]}
                  renderItem={(item) => (
                    <List.Item
                      actions={[
                        <Switch
                          key="switch"
                          checked={item.enabled}
                          onChange={item.toggle}
                          checkedChildren="ON"
                          unCheckedChildren="OFF"
                        />,
                      ]}
                    >
                      <List.Item.Meta
                        avatar={
                          <div
                            style={{
                              fontSize: 24,
                              color: item.enabled ? '#52c41a' : '#d9d9d9',
                            }}
                          >
                            {item.icon}
                          </div>
                        }
                        title={<Text strong>{item.title}</Text>}
                        description={item.description}
                      />
                    </List.Item>
                  )}
                />

                <Divider />

                <Title level={5}>Additional Settings</Title>
                <Space direction="vertical" style={{ width: '100%' }} size="middle">
                  <div>
                    <Text strong>Image Optimization Quality:</Text>
                    <Select defaultValue="85" style={{ width: 200, marginLeft: 16 }}>
                      <Select.Option value="70">70% (Higher compression)</Select.Option>
                      <Select.Option value="85">85% (Balanced)</Select.Option>
                      <Select.Option value="95">95% (Higher quality)</Select.Option>
                    </Select>
                  </div>
                  <div>
                    <Text strong>Cache TTL (Time to Live):</Text>
                    <Select defaultValue="3600" style={{ width: 200, marginLeft: 16 }}>
                      <Select.Option value="1800">30 minutes</Select.Option>
                      <Select.Option value="3600">1 hour</Select.Option>
                      <Select.Option value="86400">24 hours</Select.Option>
                    </Select>
                  </div>
                  <div>
                    <Text strong>Code Splitting Strategy:</Text>
                    <Select defaultValue="route" style={{ width: 200, marginLeft: 16 }}>
                      <Select.Option value="route">Route-based</Select.Option>
                      <Select.Option value="component">Component-based</Select.Option>
                      <Select.Option value="vendor">Vendor splitting</Select.Option>
                    </Select>
                  </div>
                </Space>

                <Divider />

                <Button type="primary" size="large">
                  Save Settings
                </Button>
              </Card>
            ),
          },
        ]}
      />
    </div>
  );
};

export default PerformanceOptimizationPage;
