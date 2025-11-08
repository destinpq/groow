import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Table,
  Space,
  Button,
  Tag,
  Progress,
  message,
  Descriptions,
  Modal,
  Alert,
  Statistic,
  Input,
  Tooltip,
} from 'antd';
import {
  DownloadOutlined,
  FileOutlined,
  SafetyOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CopyOutlined,
  KeyOutlined,
  LockOutlined,
  CloudDownloadOutlined,
  FileZipOutlined,
  FilePdfOutlined,
  FileImageOutlined,
  CodeOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;

interface DigitalProduct {
  id: number;
  name: string;
  type: 'software' | 'ebook' | 'music' | 'video' | 'course' | 'template';
  orderDate: string;
  expiryDate?: string;
  downloadLimit: number;
  downloadCount: number;
  fileSize: string;
  version: string;
  licenseKey?: string;
  downloadUrl: string;
  status: 'active' | 'expired' | 'used_up';
}

const mockDigitalProducts: DigitalProduct[] = [
  {
    id: 1,
    name: 'Professional Photo Editing Software',
    type: 'software',
    orderDate: dayjs().subtract(10, 'days').format('YYYY-MM-DD'),
    expiryDate: dayjs().add(355, 'days').format('YYYY-MM-DD'),
    downloadLimit: 5,
    downloadCount: 2,
    fileSize: '2.4 GB',
    version: '2024.1.0',
    licenseKey: 'XXXX-XXXX-XXXX-XXXX',
    downloadUrl: 'https://example.com/download/software',
    status: 'active',
  },
  {
    id: 2,
    name: 'Complete Web Development Course',
    type: 'course',
    orderDate: dayjs().subtract(30, 'days').format('YYYY-MM-DD'),
    downloadLimit: 10,
    downloadCount: 5,
    fileSize: '15.8 GB',
    version: '1.0',
    licenseKey: 'COURSE-2024-ABC123',
    downloadUrl: 'https://example.com/download/course',
    status: 'active',
  },
  {
    id: 3,
    name: 'Design Templates Bundle',
    type: 'template',
    orderDate: dayjs().subtract(5, 'days').format('YYYY-MM-DD'),
    expiryDate: dayjs().add(25, 'days').format('YYYY-MM-DD'),
    downloadLimit: 3,
    downloadCount: 3,
    fileSize: '450 MB',
    version: '2.5',
    downloadUrl: 'https://example.com/download/templates',
    status: 'used_up',
  },
  {
    id: 4,
    name: 'JavaScript Programming eBook',
    type: 'ebook',
    orderDate: dayjs().subtract(60, 'days').format('YYYY-MM-DD'),
    expiryDate: dayjs().subtract(5, 'days').format('YYYY-MM-DD'),
    downloadLimit: 5,
    downloadCount: 1,
    fileSize: '12 MB',
    version: '3rd Edition',
    downloadUrl: 'https://example.com/download/ebook',
    status: 'expired',
  },
];

const DigitalDownloadsPage: React.FC = () => {
  const [products, setProducts] = useState<DigitalProduct[]>(mockDigitalProducts);
  const [selectedProduct, setSelectedProduct] = useState<DigitalProduct | null>(null);
  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState<boolean>(false);

  const handleDownload = (product: DigitalProduct) => {
    if (product.status === 'expired') {
      message.error('This download has expired. Please contact support.');
      return;
    }

    if (product.status === 'used_up') {
      message.error('Download limit reached. Please contact support for assistance.');
      return;
    }

    const updatedProducts = products.map((p) =>
      p.id === product.id ? { ...p, downloadCount: p.downloadCount + 1 } : p
    );
    setProducts(updatedProducts);

    message.success(`Starting download: ${product.name}`);
    // Simulate download
    window.open(product.downloadUrl, '_blank');
  };

  const handleCopyLicense = (licenseKey: string) => {
    navigator.clipboard.writeText(licenseKey);
    message.success('License key copied to clipboard!');
  };

  const getFileIcon = (type: DigitalProduct['type']) => {
    const icons = {
      software: <CodeOutlined style={{ fontSize: 24, color: '#1890ff' }} />,
      ebook: <FilePdfOutlined style={{ fontSize: 24, color: '#ff4d4f' }} />,
      music: <FileOutlined style={{ fontSize: 24, color: '#722ed1' }} />,
      video: <FileImageOutlined style={{ fontSize: 24, color: '#fa8c16' }} />,
      course: <FileZipOutlined style={{ fontSize: 24, color: '#52c41a' }} />,
      template: <FileOutlined style={{ fontSize: 24, color: '#13c2c2' }} />,
    };
    return icons[type];
  };

  const columns: ColumnsType<DigitalProduct> = [
    {
      title: 'Product',
      key: 'product',
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 48,
              height: 48,
              background: '#f0f0f0',
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {getFileIcon(record.type)}
          </div>
          <div>
            <div>
              <Text strong>{record.name}</Text>
            </div>
            <div>
              <Text type="secondary" style={{ fontSize: 12 }}>
                Version: {record.version} • {record.fileSize}
              </Text>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: DigitalProduct['type']) => {
        const typeConfig = {
          software: { color: 'blue', text: 'Software' },
          ebook: { color: 'red', text: 'eBook' },
          music: { color: 'purple', text: 'Music' },
          video: { color: 'orange', text: 'Video' },
          course: { color: 'green', text: 'Course' },
          template: { color: 'cyan', text: 'Template' },
        };
        const config = typeConfig[type];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
      filters: [
        { text: 'Software', value: 'software' },
        { text: 'eBook', value: 'ebook' },
        { text: 'Course', value: 'course' },
        { text: 'Template', value: 'template' },
      ],
      onFilter: (value, record) => record.type === value,
    },
    {
      title: 'Downloads',
      key: 'downloads',
      render: (_, record) => {
        const percentage = (record.downloadCount / record.downloadLimit) * 100;
        return (
          <div style={{ width: 150 }}>
            <div style={{ marginBottom: 4 }}>
              <Text style={{ fontSize: 12 }}>
                {record.downloadCount} / {record.downloadLimit} used
              </Text>
            </div>
            <Progress
              percent={percentage}
              showInfo={false}
              size="small"
              strokeColor={percentage === 100 ? '#ff4d4f' : '#1890ff'}
            />
          </div>
        );
      },
    },
    {
      title: 'Purchased',
      dataIndex: 'orderDate',
      key: 'orderDate',
      render: (date) => dayjs(date).format('MMM DD, YYYY'),
    },
    {
      title: 'Expires',
      dataIndex: 'expiryDate',
      key: 'expiryDate',
      render: (date) => {
        if (!date) return <Text type="secondary">Never</Text>;
        const isExpired = dayjs(date).isBefore(dayjs());
        const daysLeft = dayjs(date).diff(dayjs(), 'days');
        return (
          <div>
            <div>{dayjs(date).format('MMM DD, YYYY')}</div>
            {!isExpired && daysLeft <= 30 && (
              <Tag color="warning" style={{ marginTop: 4 }}>
                {daysLeft} days left
              </Tag>
            )}
          </div>
        );
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: DigitalProduct['status']) => {
        const statusConfig = {
          active: { color: 'success', icon: <CheckCircleOutlined />, text: 'Active' },
          expired: { color: 'error', icon: <ClockCircleOutlined />, text: 'Expired' },
          used_up: { color: 'warning', icon: <ClockCircleOutlined />, text: 'Limit Reached' },
        };
        const config = statusConfig[status];
        return (
          <Tag color={config.color} icon={config.icon}>
            {config.text}
          </Tag>
        );
      },
      filters: [
        { text: 'Active', value: 'active' },
        { text: 'Expired', value: 'expired' },
        { text: 'Limit Reached', value: 'used_up' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            onClick={() => handleDownload(record)}
            disabled={record.status !== 'active'}
          >
            Download
          </Button>
          <Button
            onClick={() => {
              setSelectedProduct(record);
              setIsDetailsModalVisible(true);
            }}
          >
            Details
          </Button>
        </Space>
      ),
    },
  ];

  const activeProducts = products.filter((p) => p.status === 'active').length;
  const totalDownloads = products.reduce((sum, p) => sum + p.downloadCount, 0);
  const expiringProducts = products.filter(
    (p) =>
      p.expiryDate &&
      dayjs(p.expiryDate).isAfter(dayjs()) &&
      dayjs(p.expiryDate).diff(dayjs(), 'days') <= 30
  ).length;

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={3}>
            <CloudDownloadOutlined style={{ color: '#1890ff' }} /> Digital Downloads
          </Title>
          <Paragraph type="secondary">
            Access and manage your digital product purchases
          </Paragraph>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Active Downloads"
              value={activeProducts}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Total Downloads"
              value={totalDownloads}
              prefix={<DownloadOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Expiring Soon"
              value={expiringProducts}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: expiringProducts > 0 ? '#fa8c16' : '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      <Alert
        message={
          <Space>
            <SafetyOutlined />
            <Text strong>Download Security Notice</Text>
          </Space>
        }
        description="All downloads are securely encrypted and verified. Keep your license keys safe and do not share them publicly."
        type="info"
        showIcon={false}
        style={{ marginBottom: 24 }}
      />

      <Card>
        <Table
          columns={columns}
          dataSource={products}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title={
          <Space>
            <FileOutlined />
            <span>Download Details</span>
          </Space>
        }
        open={isDetailsModalVisible}
        onCancel={() => setIsDetailsModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsDetailsModalVisible(false)}>
            Close
          </Button>,
          <Button
            key="download"
            type="primary"
            icon={<DownloadOutlined />}
            onClick={() => {
              if (selectedProduct) {
                handleDownload(selectedProduct);
                setIsDetailsModalVisible(false);
              }
            }}
            disabled={selectedProduct?.status !== 'active'}
          >
            Download Now
          </Button>,
        ]}
        width={700}
      >
        {selectedProduct && (
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            <div
              style={{
                background: '#f0f0f0',
                padding: 24,
                borderRadius: 8,
                textAlign: 'center',
              }}
            >
              {getFileIcon(selectedProduct.type)}
              <Title level={4} style={{ marginTop: 12, marginBottom: 0 }}>
                {selectedProduct.name}
              </Title>
              <Text type="secondary">Version {selectedProduct.version}</Text>
            </div>

            <Descriptions bordered column={1}>
              <Descriptions.Item label="Product Type">
                <Tag color="blue">{selectedProduct.type.toUpperCase()}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="File Size">{selectedProduct.fileSize}</Descriptions.Item>
              <Descriptions.Item label="Purchase Date">
                {dayjs(selectedProduct.orderDate).format('MMMM DD, YYYY')}
              </Descriptions.Item>
              {selectedProduct.expiryDate && (
                <Descriptions.Item label="Expiry Date">
                  {dayjs(selectedProduct.expiryDate).format('MMMM DD, YYYY')}
                  {dayjs(selectedProduct.expiryDate).diff(dayjs(), 'days') <= 30 && (
                    <Tag color="warning" style={{ marginLeft: 8 }}>
                      {dayjs(selectedProduct.expiryDate).diff(dayjs(), 'days')} days left
                    </Tag>
                  )}
                </Descriptions.Item>
              )}
              <Descriptions.Item label="Download Usage">
                <Progress
                  percent={
                    (selectedProduct.downloadCount / selectedProduct.downloadLimit) * 100
                  }
                  format={() =>
                    `${selectedProduct.downloadCount} / ${selectedProduct.downloadLimit}`
                  }
                />
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag
                  color={
                    selectedProduct.status === 'active'
                      ? 'success'
                      : selectedProduct.status === 'expired'
                      ? 'error'
                      : 'warning'
                  }
                >
                  {selectedProduct.status.replace('_', ' ').toUpperCase()}
                </Tag>
              </Descriptions.Item>
            </Descriptions>

            {selectedProduct.licenseKey && (
              <Alert
                message={
                  <Space>
                    <KeyOutlined />
                    <Text strong>License Key</Text>
                  </Space>
                }
                description={
                  <div style={{ marginTop: 12 }}>
                    <Input.Group compact>
                      <Input
                        value={selectedProduct.licenseKey}
                        readOnly
                        style={{ width: 'calc(100% - 100px)' }}
                        prefix={<LockOutlined />}
                      />
                      <Tooltip title="Copy to clipboard">
                        <Button
                          icon={<CopyOutlined />}
                          onClick={() => handleCopyLicense(selectedProduct.licenseKey!)}
                        >
                          Copy
                        </Button>
                      </Tooltip>
                    </Input.Group>
                  </div>
                }
                type="warning"
                showIcon={false}
              />
            )}

            {selectedProduct.status === 'expired' && (
              <Alert
                message="Download Expired"
                description="This download link has expired. Please contact our support team to request a new download link."
                type="error"
                showIcon
              />
            )}

            {selectedProduct.status === 'used_up' && (
              <Alert
                message="Download Limit Reached"
                description="You have reached the maximum number of downloads for this product. Contact support if you need additional downloads."
                type="warning"
                showIcon
              />
            )}
          </Space>
        )}
      </Modal>
    </div>
  );
};

export default DigitalDownloadsPage;
