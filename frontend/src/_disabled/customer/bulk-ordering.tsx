import React, { useState } from 'react';
import { Card, Row, Col, Typography, Tabs, Table, Button, Space, Alert, InputNumber, Modal, Form, Input, Select, Upload, Tag, Progress, Statistic, Divider, Timeline } from 'antd';
import { ShoppingCartOutlined, UploadOutlined, DownloadOutlined, FileExcelOutlined, PlusOutlined, DeleteOutlined, CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

const BulkOrdering: React.FC = () => {
  const [bulkItems, setBulkItems] = useState<any[]>([]);
  const [csvModalVisible, setCsvModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const sampleProducts = [
    {
      id: 1,
      sku: 'TECH-001',
      name: 'Wireless Mouse',
      category: 'Electronics',
      unitPrice: 29.99,
      stockLevel: 150,
      minOrderQty: 5,
    },
    {
      id: 2,
      sku: 'TECH-002',
      name: 'USB-C Cable 6ft',
      category: 'Electronics',
      unitPrice: 12.99,
      stockLevel: 200,
      minOrderQty: 10,
    },
    {
      id: 3,
      sku: 'OFF-001',
      name: 'A4 Paper Pack',
      category: 'Office Supplies',
      unitPrice: 8.99,
      stockLevel: 500,
      minOrderQty: 20,
    },
  ];

  const bulkOrderHistory = [
    {
      id: 'BULK-001',
      date: '2025-11-05',
      items: 25,
      totalAmount: 1850.00,
      status: 'completed',
      uploadMethod: 'csv',
      processingTime: '3 minutes',
    },
    {
      id: 'BULK-002',
      date: '2025-11-03',
      items: 18,
      totalAmount: 960.00,
      status: 'processing',
      uploadMethod: 'manual',
      processingTime: 'In progress',
    },
    {
      id: 'BULK-003',
      date: '2025-11-01',
      items: 42,
      totalAmount: 3200.00,
      status: 'completed',
      uploadMethod: 'csv',
      processingTime: '5 minutes',
    },
  ];

  const addBulkItem = (product: any) => {
    const existingItem = bulkItems.find(item => item.id === product.id);
    
    if (existingItem) {
      setBulkItems(bulkItems.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setBulkItems([...bulkItems, {
        ...product,
        quantity: product.minOrderQty,
        total: product.unitPrice * product.minOrderQty
      }]);
    }
  };

  const updateQuantity = (id: number, quantity: number) => {
    setBulkItems(bulkItems.map(item => 
      item.id === id 
        ? { ...item, quantity, total: item.unitPrice * quantity }
        : item
    ));
  };

  const removeBulkItem = (id: number) => {
    setBulkItems(bulkItems.filter(item => item.id !== id));
  };

  const getTotalAmount = () => {
    return bulkItems.reduce((sum, item) => sum + item.total, 0);
  };

  const getTotalItems = () => {
    return bulkItems.reduce((sum, item) => sum + item.quantity, 0);
  };

  const productColumns = [
    {
      title: 'Product',
      key: 'product',
      render: (record: any) => (
        <div>
          <Text strong>{record.name}</Text>
          <br />
          <Text type="secondary">SKU: {record.sku}</Text>
        </div>
      ),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (category: string) => <Tag color="blue">{category}</Tag>,
    },
    {
      title: 'Unit Price',
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      render: (price: number) => `$${price.toFixed(2)}`,
    },
    {
      title: 'Stock',
      dataIndex: 'stockLevel',
      key: 'stockLevel',
      render: (stock: number) => (
        <Text style={{ color: stock > 50 ? '#52c41a' : stock > 10 ? '#fa8c16' : '#f5222d' }}>
          {stock} units
        </Text>
      ),
    },
    {
      title: 'Min Order',
      dataIndex: 'minOrderQty',
      key: 'minOrderQty',
      render: (min: number) => `${min} units`,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: any) => (
        <Button 
          type="primary" 
          size="small"
          icon={<PlusOutlined />}
          onClick={() => addBulkItem(record)}
        >
          Add to Bulk
        </Button>
      ),
    },
  ];

  const bulkItemColumns = [
    {
      title: 'Product',
      key: 'product',
      render: (record: any) => (
        <div>
          <Text strong>{record.name}</Text>
          <br />
          <Text type="secondary">SKU: {record.sku}</Text>
        </div>
      ),
    },
    {
      title: 'Unit Price',
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      render: (price: number) => `$${price.toFixed(2)}`,
    },
    {
      title: 'Quantity',
      key: 'quantity',
      render: (record: any) => (
        <InputNumber
          min={record.minOrderQty}
          max={record.stockLevel}
          value={record.quantity}
          onChange={(value) => updateQuantity(record.id, value || 0)}
          style={{ width: 80 }}
        />
      ),
    },
    {
      title: 'Total',
      key: 'total',
      render: (record: any) => (
        <Text strong>${record.total.toFixed(2)}</Text>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: any) => (
        <Button 
          danger 
          size="small"
          icon={<DeleteOutlined />}
          onClick={() => removeBulkItem(record.id)}
        >
          Remove
        </Button>
      ),
    },
  ];

  const historyColumns = [
    {
      title: 'Order ID',
      dataIndex: 'id',
      key: 'id',
      render: (id: string) => <Text strong>{id}</Text>,
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Items',
      dataIndex: 'items',
      key: 'items',
    },
    {
      title: 'Total Amount',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount: number) => <Text strong>${amount.toLocaleString()}</Text>,
    },
    {
      title: 'Upload Method',
      dataIndex: 'uploadMethod',
      key: 'uploadMethod',
      render: (method: string) => (
        <Tag color={method === 'csv' ? 'green' : 'blue'}>{method.toUpperCase()}</Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const config = status === 'completed' 
          ? { color: 'success', icon: <CheckCircleOutlined /> }
          : { color: 'processing', icon: <ClockCircleOutlined /> };
        return <Tag icon={config.icon} color={config.color}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Space>
          <Button size="small">View Details</Button>
          <Button size="small" type="link">Reorder</Button>
        </Space>
      ),
    },
  ];

  const handleCSVUpload = (info: any) => {
    if (info.file.status === 'done') {
      Modal.success({
        title: 'CSV Upload Successful',
        content: 'Your bulk order file has been processed successfully. 25 items were added to your cart.',
      });
      setCsvModalVisible(false);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={2}>
          <ShoppingCartOutlined style={{ marginRight: 8 }} />
          Bulk Ordering
        </Title>
        <Text type="secondary">Phase 5 - B2B bulk purchase management</Text>
      </div>

      {/* Bulk Order Summary */}
      {bulkItems.length > 0 && (
        <Card style={{ marginBottom: 24 }}>
          <Row gutter={16}>
            <Col span={6}>
              <Statistic
                title="Items in Bulk Order"
                value={getTotalItems()}
                prefix={<ShoppingCartOutlined />}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="Total Amount"
                value={getTotalAmount()}
                prefix="$"
                precision={2}
                valueStyle={{ color: '#1890ff' }}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="Processing Time"
                value="3-5"
                suffix="minutes"
                valueStyle={{ color: '#52c41a' }}
              />
            </Col>
            <Col span={6}>
              <Button type="primary" size="large" block>
                Submit Bulk Order
              </Button>
            </Col>
          </Row>
        </Card>
      )}

      <Alert
        message="Bulk Ordering Benefits"
        description="Save time with bulk uploads, get volume discounts, and streamline your procurement process. Upload CSV files or add items manually."
        type="info"
        showIcon
        style={{ marginBottom: 24 }}
        action={
          <Space>
            <Button size="small" icon={<DownloadOutlined />}>
              Download Template
            </Button>
            <Button size="small" type="primary" icon={<UploadOutlined />} onClick={() => setCsvModalVisible(true)}>
              Upload CSV
            </Button>
          </Space>
        }
        closable
      />

      <Tabs defaultActiveKey="manual">
        <TabPane tab="Manual Selection" key="manual">
          <Row gutter={16}>
            <Col span={14}>
              <Card title="Product Catalog">
                <Table
                  columns={productColumns}
                  dataSource={sampleProducts}
                  rowKey="id"
                  pagination={false}
                  size="small"
                />
              </Card>
            </Col>
            <Col span={10}>
              <Card 
                title={`Bulk Order Cart (${bulkItems.length} items)`}
                extra={
                  bulkItems.length > 0 ? (
                    <Button size="small" onClick={() => setBulkItems([])}>
                      Clear All
                    </Button>
                  ) : null
                }
              >
                {bulkItems.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: 40 }}>
                    <ShoppingCartOutlined style={{ fontSize: 48, color: '#ccc' }} />
                    <div style={{ marginTop: 16 }}>
                      <Text type="secondary">No items in bulk cart</Text>
                      <br />
                      <Text type="secondary">Add products from the catalog</Text>
                    </div>
                  </div>
                ) : (
                  <Table
                    columns={bulkItemColumns}
                    dataSource={bulkItems}
                    rowKey="id"
                    pagination={false}
                    size="small"
                    footer={() => (
                      <div style={{ textAlign: 'right' }}>
                        <Text strong>Total: ${getTotalAmount().toFixed(2)}</Text>
                      </div>
                    )}
                  />
                )}
              </Card>
            </Col>
          </Row>
        </TabPane>

        <TabPane tab="CSV Upload" key="csv">
          <Card title="Bulk Upload via CSV">
            <Row gutter={16}>
              <Col span={12}>
                <div style={{ textAlign: 'center', padding: 40 }}>
                  <FileExcelOutlined style={{ fontSize: 64, color: '#52c41a', marginBottom: 16 }} />
                  <Title level={4}>Upload Your Order File</Title>
                  <Text type="secondary">
                    Upload a CSV file with your bulk order. Make sure to follow our template format.
                  </Text>
                  <div style={{ marginTop: 24 }}>
                    <Upload
                      accept=".csv,.xlsx,.xls"
                      showUploadList={false}
                      onChange={handleCSVUpload}
                    >
                      <Button type="primary" size="large" icon={<UploadOutlined />}>
                        Select CSV File
                      </Button>
                    </Upload>
                  </div>
                  <div style={{ marginTop: 16 }}>
                    <Button type="link" icon={<DownloadOutlined />}>
                      Download CSV Template
                    </Button>
                  </div>
                </div>
              </Col>
              <Col span={12}>
                <div style={{ padding: '0 20px' }}>
                  <Title level={5}>CSV Format Requirements:</Title>
                  <ul style={{ paddingLeft: 20 }}>
                    <li>Include headers: SKU, Quantity, Notes (optional)</li>
                    <li>Maximum 1000 items per upload</li>
                    <li>File size limit: 5MB</li>
                    <li>Supported formats: CSV, Excel (.xlsx, .xls)</li>
                  </ul>
                  
                  <Divider />
                  
                  <Title level={5}>Processing Information:</Title>
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Text>Processing Time:</Text>
                      <Text>3-5 minutes</Text>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Text>Validation:</Text>
                      <Text>Automatic SKU verification</Text>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Text>Error Handling:</Text>
                      <Text>Detailed error report</Text>
                    </div>
                  </Space>
                </div>
              </Col>
            </Row>
          </Card>
        </TabPane>

        <TabPane tab="Order History" key="history">
          <Card title="Bulk Order History">
            <Table
              columns={historyColumns}
              dataSource={bulkOrderHistory}
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </TabPane>

        <TabPane tab="Templates & Guides" key="templates">
          <Row gutter={16}>
            <Col span={12}>
              <Card title="Download Templates">
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div style={{ padding: 16, border: '1px solid #d9d9d9', borderRadius: 6 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <Text strong>Basic Bulk Order Template</Text>
                        <br />
                        <Text type="secondary">Simple SKU and quantity format</Text>
                      </div>
                      <Button icon={<DownloadOutlined />}>Download</Button>
                    </div>
                  </div>
                  
                  <div style={{ padding: 16, border: '1px solid #d9d9d9', borderRadius: 6 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <Text strong>Advanced Template with Notes</Text>
                        <br />
                        <Text type="secondary">Includes delivery instructions and notes</Text>
                      </div>
                      <Button icon={<DownloadOutlined />}>Download</Button>
                    </div>
                  </div>
                  
                  <div style={{ padding: 16, border: '1px solid #d9d9d9', borderRadius: 6 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <Text strong>Department Budget Template</Text>
                        <br />
                        <Text type="secondary">Organized by department and cost center</Text>
                      </div>
                      <Button icon={<DownloadOutlined />}>Download</Button>
                    </div>
                  </div>
                </Space>
              </Card>
            </Col>
            
            <Col span={12}>
              <Card title="Quick Start Guide">
                <Timeline items={[
                  {
                    children: (
                      <div>
                        <Text strong>Download Template</Text>
                        <br />
                        <Text type="secondary">Get the CSV template that matches your needs</Text>
                      </div>
                    ),
                  },
                  {
                    children: (
                      <div>
                        <Text strong>Fill Order Details</Text>
                        <br />
                        <Text type="secondary">Add SKUs and quantities using Excel or text editor</Text>
                      </div>
                    ),
                  },
                  {
                    children: (
                      <div>
                        <Text strong>Upload & Validate</Text>
                        <br />
                        <Text type="secondary">Upload your file and review validation results</Text>
                      </div>
                    ),
                  },
                  {
                    children: (
                      <div>
                        <Text strong>Submit Order</Text>
                        <br />
                        <Text type="secondary">Confirm your bulk order and track processing</Text>
                      </div>
                    ),
                  },
                ]} />
              </Card>
            </Col>
          </Row>
        </TabPane>
      </Tabs>

      {/* CSV Upload Modal */}
      <Modal
        title="Upload Bulk Order CSV"
        visible={csvModalVisible}
        onCancel={() => setCsvModalVisible(false)}
        footer={null}
        width={600}
      >
        <Upload.Dragger
          accept=".csv,.xlsx,.xls"
          multiple={false}
          onChange={handleCSVUpload}
        >
          <p className="ant-upload-drag-icon">
            <FileExcelOutlined style={{ fontSize: 48, color: '#1890ff' }} />
          </p>
          <p className="ant-upload-text">Click or drag file to this area to upload</p>
          <p className="ant-upload-hint">
            Support for CSV and Excel files. Maximum file size: 5MB
          </p>
        </Upload.Dragger>
        
        <div style={{ marginTop: 16, textAlign: 'center' }}>
          <Button type="link" icon={<DownloadOutlined />}>
            Download CSV Template
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default BulkOrdering;
