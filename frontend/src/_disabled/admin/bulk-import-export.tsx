import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Form,
  Input,
  Button,
  Table,
  Tag,
  Space,
  Select,
  InputNumber,
  Upload,
  Modal,
  message,
  Divider,
  Statistic,
  Switch,
  Alert,
} from 'antd';
import {
  InboxOutlined,
  UploadOutlined,
  FileExcelOutlined,
  CloudUploadOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  DeleteOutlined,
  EditOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { UploadProps } from 'antd';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { Dragger } = Upload;
const { Option } = Select;

interface ImportedProduct {
  id: number;
  sku: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: 'success' | 'warning' | 'error';
  issues: string[];
}

interface ImportHistory {
  id: number;
  filename: string;
  totalRows: number;
  successCount: number;
  errorCount: number;
  timestamp: string;
  status: 'completed' | 'processing' | 'failed';
}

const mockImportedProducts: ImportedProduct[] = [
  {
    id: 1,
    sku: 'ELEC-001',
    name: 'Wireless Headphones',
    category: 'Electronics',
    price: 79.99,
    stock: 150,
    status: 'success',
    issues: [],
  },
  {
    id: 2,
    sku: 'FASH-002',
    name: 'Leather Jacket',
    category: 'Fashion',
    price: 199.99,
    stock: 0,
    status: 'warning',
    issues: ['Stock is 0'],
  },
  {
    id: 3,
    sku: 'HOME-003',
    name: 'Office Chair',
    category: 'Home & Garden',
    price: -50.00,
    stock: 45,
    status: 'error',
    issues: ['Invalid price (negative value)', 'Missing product description'],
  },
  {
    id: 4,
    sku: 'ELEC-004',
    name: 'Smart Watch',
    category: 'Electronics',
    price: 299.99,
    stock: 200,
    status: 'success',
    issues: [],
  },
];

const mockImportHistory: ImportHistory[] = [
  {
    id: 1,
    filename: 'products_batch_001.xlsx',
    totalRows: 500,
    successCount: 485,
    errorCount: 15,
    timestamp: dayjs().subtract(2, 'hours').format('YYYY-MM-DD HH:mm:ss'),
    status: 'completed',
  },
  {
    id: 2,
    filename: 'products_update_202401.csv',
    totalRows: 1200,
    successCount: 1150,
    errorCount: 50,
    timestamp: dayjs().subtract(1, 'day').format('YYYY-MM-DD HH:mm:ss'),
    status: 'completed',
  },
  {
    id: 3,
    filename: 'new_inventory.xlsx',
    totalRows: 350,
    successCount: 350,
    errorCount: 0,
    timestamp: dayjs().subtract(3, 'days').format('YYYY-MM-DD HH:mm:ss'),
    status: 'completed',
  },
];

const BulkImportExportPage: React.FC = () => {
  const [importing, setImporting] = useState<boolean>(false);
  const [previewData, setPreviewData] = useState<ImportedProduct[]>([]);
  const [isPreviewVisible, setIsPreviewVisible] = useState<boolean>(false);
  const [form] = Form.useForm();

  const uploadProps: UploadProps = {
    name: 'file',
    multiple: false,
    accept: '.xlsx,.xls,.csv',
    beforeUpload: (file) => {
      const isValidType = file.type === 'application/vnd.ms-excel' || 
                         file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
                         file.type === 'text/csv';
      if (!isValidType) {
        message.error('You can only upload Excel or CSV files!');
      }
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        message.error('File must be smaller than 10MB!');
      }
      return isValidType && isLt10M;
    },
    onChange(info) {
      const { status } = info.file;
      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`);
        setPreviewData(mockImportedProducts);
        setIsPreviewVisible(true);
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  const handleBulkImport = () => {
    setImporting(true);
    setTimeout(() => {
      message.success('Products imported successfully!');
      setImporting(false);
      setIsPreviewVisible(false);
      setPreviewData([]);
    }, 2000);
  };

  const handleExport = (format: string) => {
    message.success(`Exporting products as ${format.toUpperCase()}...`);
  };

  const handleDownloadTemplate = () => {
    message.success('Template downloaded successfully!');
  };

  const productColumns: ColumnsType<ImportedProduct> = [
    {
      title: 'SKU',
      dataIndex: 'sku',
      key: 'sku',
      render: (sku) => <Text code>{sku}</Text>,
    },
    {
      title: 'Product Name',
      dataIndex: 'name',
      key: 'name',
      render: (name) => <Text strong>{name}</Text>,
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (category) => <Tag color="blue">{category}</Tag>,
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price) => (
        <Text strong style={{ color: price < 0 ? '#ff4d4f' : '#52c41a' }}>
          ${price.toFixed(2)}
        </Text>
      ),
    },
    {
      title: 'Stock',
      dataIndex: 'stock',
      key: 'stock',
      render: (stock) => (
        <Tag color={stock > 0 ? 'green' : 'red'}>{stock}</Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: ImportedProduct['status']) => {
        const config: Record<ImportedProduct['status'], { color: string; icon: React.ReactNode; text: string }> = {
          success: { color: 'green', icon: <CheckCircleOutlined />, text: 'Valid' },
          warning: { color: 'orange', icon: <WarningOutlined />, text: 'Warning' },
          error: { color: 'red', icon: <WarningOutlined />, text: 'Error' },
        };
        return (
          <Tag color={config[status].color} icon={config[status].icon}>
            {config[status].text}
          </Tag>
        );
      },
    },
    {
      title: 'Issues',
      dataIndex: 'issues',
      key: 'issues',
      render: (issues: string[]) => (
        <div>
          {issues.length > 0 ? (
            <ul style={{ margin: 0, paddingLeft: 16, fontSize: 12, color: '#ff4d4f' }}>
              {issues.map((issue, i) => (
                <li key={i}>{issue}</li>
              ))}
            </ul>
          ) : (
            <Text type="secondary">No issues</Text>
          )}
        </div>
      ),
    },
  ];

  const historyColumns: ColumnsType<ImportHistory> = [
    {
      title: 'Filename',
      dataIndex: 'filename',
      key: 'filename',
      render: (name) => (
        <Space>
          <FileExcelOutlined style={{ color: '#52c41a' }} />
          <Text>{name}</Text>
        </Space>
      ),
    },
    {
      title: 'Total Rows',
      dataIndex: 'totalRows',
      key: 'totalRows',
      render: (count) => <Text>{count.toLocaleString()}</Text>,
    },
    {
      title: 'Success',
      dataIndex: 'successCount',
      key: 'successCount',
      render: (count) => <Tag color="green">{count.toLocaleString()}</Tag>,
    },
    {
      title: 'Errors',
      dataIndex: 'errorCount',
      key: 'errorCount',
      render: (count) => <Tag color={count > 0 ? 'red' : 'default'}>{count}</Tag>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: ImportHistory['status']) => {
        const colors: Record<ImportHistory['status'], string> = {
          completed: 'green',
          processing: 'blue',
          failed: 'red',
        };
        return <Tag color={colors[status]}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Timestamp',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (time) => <Text type="secondary">{time}</Text>,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Space>
          <Button size="small" icon={<EditOutlined />}>View Details</Button>
        </Space>
      ),
    },
  ];

  const successRate = ((mockImportedProducts.filter(p => p.status === 'success').length / mockImportedProducts.length) * 100).toFixed(1);

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={3}>
          <CloudUploadOutlined style={{ color: '#1890ff' }} /> Bulk Import/Export
        </Title>
        <Paragraph type="secondary">
          Import products in bulk via Excel/CSV files or export your catalog
        </Paragraph>
      </div>

      <Alert
        message="Bulk Operations"
        description="Upload Excel or CSV files to import products. Maximum file size: 10MB. Up to 10,000 products per file."
        type="info"
        showIcon
        closable
        style={{ marginBottom: 24 }}
      />

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Imports"
              value={mockImportHistory.length}
              prefix={<CloudUploadOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Success Rate"
              value={successRate}
              suffix="%"
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Last Import"
              value="2h ago"
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Products Imported"
              value={1635}
              prefix={<InboxOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col xs={24} lg={12}>
          <Card title="Import Products" style={{ marginBottom: 16 }}>
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              <div>
                <Button
                  type="dashed"
                  icon={<UploadOutlined />}
                  onClick={handleDownloadTemplate}
                  block
                >
                  Download Excel Template
                </Button>
                <Text type="secondary" style={{ fontSize: 12, display: 'block', marginTop: 8 }}>
                  Download our template to ensure your data is formatted correctly
                </Text>
              </div>

              <Divider />

              <Dragger {...uploadProps}>
                <p className="ant-upload-drag-icon">
                  <InboxOutlined style={{ color: '#1890ff' }} />
                </p>
                <p className="ant-upload-text">Click or drag file to this area to upload</p>
                <p className="ant-upload-hint">
                  Support for Excel (.xlsx, .xls) or CSV files. Maximum file size: 10MB
                </p>
              </Dragger>

              <Divider />

              <Form form={form} layout="vertical">
                <Form.Item label="Import Options">
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Form.Item name="updateExisting" valuePropName="checked" noStyle>
                      <Switch /> <Text style={{ marginLeft: 8 }}>Update existing products (match by SKU)</Text>
                    </Form.Item>
                    <Form.Item name="skipErrors" valuePropName="checked" noStyle>
                      <Switch defaultChecked /> <Text style={{ marginLeft: 8 }}>Skip rows with errors</Text>
                    </Form.Item>
                    <Form.Item name="validateStock" valuePropName="checked" noStyle>
                      <Switch defaultChecked /> <Text style={{ marginLeft: 8 }}>Validate stock levels</Text>
                    </Form.Item>
                  </Space>
                </Form.Item>
              </Form>
            </Space>
          </Card>

          <Card title="Export Products">
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              <Form layout="vertical">
                <Form.Item label="Export Format">
                  <Select defaultValue="xlsx" style={{ width: '100%' }}>
                    <Option value="xlsx">Excel (.xlsx)</Option>
                    <Option value="csv">CSV (.csv)</Option>
                    <Option value="json">JSON (.json)</Option>
                  </Select>
                </Form.Item>
                <Form.Item label="Include Fields">
                  <Select
                    mode="multiple"
                    defaultValue={['sku', 'name', 'price', 'stock']}
                    style={{ width: '100%' }}
                  >
                    <Option value="sku">SKU</Option>
                    <Option value="name">Name</Option>
                    <Option value="description">Description</Option>
                    <Option value="price">Price</Option>
                    <Option value="stock">Stock</Option>
                    <Option value="category">Category</Option>
                    <Option value="images">Images</Option>
                    <Option value="attributes">Attributes</Option>
                  </Select>
                </Form.Item>
                <Form.Item label="Filter by Category">
                  <Select placeholder="All categories" allowClear style={{ width: '100%' }}>
                    <Option value="electronics">Electronics</Option>
                    <Option value="fashion">Fashion</Option>
                    <Option value="home">Home & Garden</Option>
                  </Select>
                </Form.Item>
              </Form>
              <Space style={{ width: '100%' }}>
                <Button type="primary" icon={<UploadOutlined />} onClick={() => handleExport('xlsx')}>
                  Export to Excel
                </Button>
                <Button icon={<FileExcelOutlined />} onClick={() => handleExport('csv')}>
                  Export to CSV
                </Button>
              </Space>
            </Space>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="Import History">
            <Table
              columns={historyColumns}
              dataSource={mockImportHistory}
              rowKey="id"
              pagination={{ pageSize: 10 }}
              size="small"
            />
          </Card>
        </Col>
      </Row>

      <Modal
        title="Preview Imported Data"
        open={isPreviewVisible}
        onCancel={() => setIsPreviewVisible(false)}
        width={1000}
        footer={[
          <Button key="cancel" onClick={() => setIsPreviewVisible(false)}>
            Cancel
          </Button>,
          <Button key="import" type="primary" loading={importing} onClick={handleBulkImport}>
            Import {previewData.filter(p => p.status !== 'error').length} Products
          </Button>,
        ]}
      >
        <Alert
          message="Import Summary"
          description={
            <div>
              <Text>Total: {previewData.length} products</Text> <Divider type="vertical" />
              <Text type="success">{previewData.filter(p => p.status === 'success').length} valid</Text> <Divider type="vertical" />
              <Text type="warning">{previewData.filter(p => p.status === 'warning').length} warnings</Text> <Divider type="vertical" />
              <Text type="danger">{previewData.filter(p => p.status === 'error').length} errors</Text>
            </div>
          }
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
        />
        <Table
          columns={productColumns}
          dataSource={previewData}
          rowKey="id"
          pagination={{ pageSize: 5 }}
          size="small"
          scroll={{ x: 900 }}
        />
      </Modal>
    </div>
  );
};

export default BulkImportExportPage;
