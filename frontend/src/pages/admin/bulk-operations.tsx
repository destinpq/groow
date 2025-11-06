import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Space, Tag, Row, Col, Input, Select, Modal, Form, InputNumber, message, Upload, Tabs, Typography, Progress, Alert, Checkbox } from 'antd';
import { UploadOutlined, DownloadOutlined, EditOutlined, DeleteOutlined, PlayCircleOutlined, PauseCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { productAPI, bulkDataAPI, Product } from '@/services/api';

const { Search } = Input;
const { Option } = Select;
const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { TextArea } = Input;

interface BulkOperation {
  id: number;
  operation: string;
  items: number;
  status: string;
  date: string;
  user: string;
}

const BulkOperationsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Product[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [operationType, setOperationType] = useState('');
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [form] = Form.useForm();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getAll({ page: 1, limit: 100 });
      setProducts(response.data || []);
    } catch (error) {
      message.error('Failed to load products');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const operationHistory: BulkOperation[] = [
    { id: 1, operation: 'Price Update', items: 25, status: 'completed', date: '2024-01-15', user: 'Admin' },
    { id: 2, operation: 'Stock Adjustment', items: 12, status: 'running', date: '2024-01-15', user: 'Manager' },
    { id: 3, operation: 'Bulk Delete', items: 8, status: 'failed', date: '2024-01-14', user: 'Admin' },
  ];

  const handleBulkOperation = (type: string) => {
    if (selectedItems.length === 0) {
      message.warning('Please select at least one product');
      return;
    }
    setOperationType(type);
    setIsModalVisible(true);
    form.resetFields();
  };

  const executeBulkOperation = async () => {
    try {
      setProcessing(true);
      setProgress(0);
      
      const values = form.getFieldsValue();
      
      // Simulate progress and execute operation
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setProcessing(false);
            setIsModalVisible(false);
            
            // Execute the actual API calls based on operation type
            performBulkUpdate(values);
            
            setSelectedItems([]);
            return 100;
          }
          return prev + 10;
        });
      }, 300);
    } catch (error) {
      setProcessing(false);
      message.error('Operation failed');
    }
  };

  const performBulkUpdate = async (values: any) => {
    try {
      if (operationType === 'Price Update') {
        // Update prices for all selected items
        for (const item of selectedItems) {
          await productAPI.update(item.id, { price: values.newPrice });
        }
        message.success(`Price updated for ${selectedItems.length} products`);
      } else if (operationType === 'Stock Adjustment') {
        // Update stock for all selected items
        for (const item of selectedItems) {
          await productAPI.update(item.id, { stock: values.newStock });
        }
        message.success(`Stock updated for ${selectedItems.length} products`);
      } else if (operationType === 'Activate/Deactivate') {
        // Toggle active status - skip this as API doesn't support it
        message.info(`Status update not supported by API yet`);
      } else if (operationType === 'Bulk Delete') {
        // Delete selected products
        for (const item of selectedItems) {
          await productAPI.delete(item.id);
        }
        message.success(`Deleted ${selectedItems.length} products`);
      }
      
      loadProducts();
    } catch (error) {
      message.error('Bulk operation failed');
      console.error(error);
    }
  };

  const getOperationColor = (status: string) => {
    switch (status) {
      case 'completed': return 'green';
      case 'running': return 'blue';
      case 'failed': return 'red';
      default: return 'default';
    }
  };

  const productColumns = [
    {
      title: '',
      key: 'select',
      render: (record: Product) => (
        <Checkbox 
          checked={selectedItems.some(item => item.id === record.id)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedItems([...selectedItems, record]);
            } else {
              setSelectedItems(selectedItems.filter(item => item.id !== record.id));
            }
          }}
        />
      ),
      width: 50,
    },
    {
      title: 'Product',
      key: 'product',
      render: (record: Product) => (
        <div>
          <Text strong>{record.name}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: '12px' }}>SKU: {record.sku || 'N/A'}</Text>
        </div>
      ),
    },
    {
      title: 'Current Price',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => <Text strong>${price?.toFixed(2) || '0.00'}</Text>,
    },
    {
      title: 'Stock',
      dataIndex: 'stock',
      key: 'stock',
      render: (stock: number) => <Text>{stock || 0}</Text>,
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (category: any) => category?.name || 'N/A',
    },
  ];

  const historyColumns = [
    {
      title: 'Operation',
      dataIndex: 'operation',
      key: 'operation',
    },
    {
      title: 'Items',
      dataIndex: 'items',
      key: 'items',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getOperationColor(status)} icon={status === 'running' ? <ClockCircleOutlined /> : null}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'User',
      dataIndex: 'user',
      key: 'user',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: any) => (
        <Space>
          {record.status === 'running' && (
            <Button size="small" icon={<PauseCircleOutlined />} onClick={() => message.info('Operation paused')}>
              Pause
            </Button>
          )}
          <Button size="small" type="text" onClick={() => message.info('Details coming soon')}>
            Details
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={2}>
          <PlayCircleOutlined style={{ marginRight: 8 }} />
          Bulk Operations
        </Title>
        <Text type="secondary">Phase 4 - Advanced bulk management system</Text>
      </div>

      <Card style={{ marginBottom: 24 }}>
        <Row gutter={16}>
          <Col span={18}>
            <Space wrap>
              <Button 
                type="primary" 
                icon={<EditOutlined />}
                disabled={selectedItems.length === 0}
                onClick={() => handleBulkOperation('Price Update')}
              >
                Update Prices ({selectedItems.length})
              </Button>
              <Button 
                icon={<EditOutlined />}
                disabled={selectedItems.length === 0}
                onClick={() => handleBulkOperation('Stock Adjustment')}
              >
                Adjust Stock ({selectedItems.length})
              </Button>
              <Button 
                icon={<DeleteOutlined />}
                danger
                disabled={selectedItems.length === 0}
                onClick={() => handleBulkOperation('Bulk Delete')}
              >
                Delete Selected ({selectedItems.length})
              </Button>
              <Upload>
                <Button icon={<UploadOutlined />}>Import Updates</Button>
              </Upload>
              <Button icon={<DownloadOutlined />} onClick={() => message.success('Template downloaded')}>
                Export Template
              </Button>
            </Space>
          </Col>
          <Col span={6}>
            <Search placeholder="Search products..." allowClear />
          </Col>
        </Row>
      </Card>

      <Tabs defaultActiveKey="products">
        <TabPane tab="Product Selection" key="products">
          <Card>
            <Alert
              message={`${selectedItems.length} products selected for bulk operations`}
              type={selectedItems.length > 0 ? 'success' : 'info'}
              style={{ marginBottom: 16 }}
              action={
                selectedItems.length > 0 && (
                  <Button size="small" type="text" onClick={() => setSelectedItems([])}>
                    Clear Selection
                  </Button>
                )
              }
            />
            
            <Table
              columns={productColumns}
              dataSource={products}
              rowKey="id"
              loading={loading}
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </TabPane>

        <TabPane tab="Operation History" key="history">
          <Card>
            <Table
              columns={historyColumns}
              dataSource={operationHistory}
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </TabPane>

        <TabPane tab="Scheduled Operations" key="scheduled">
          <Card>
            <Alert
              message="Scheduled Operations"
              description="Set up automated bulk operations to run at specific times."
              type="info"
              showIcon
            />
          </Card>
        </TabPane>
      </Tabs>

      <Modal
        title={`${operationType} - ${selectedItems.length} items selected`}
        visible={isModalVisible}
        onOk={executeBulkOperation}
        onCancel={() => setIsModalVisible(false)}
        confirmLoading={processing}
        width={600}
      >
        {processing && (
          <div style={{ marginBottom: 16 }}>
            <Text>Processing operation...</Text>
            <Progress percent={progress} status="active" />
          </div>
        )}

        <Form form={form} layout="vertical">
          {operationType === 'Price Update' && (
            <>
              <Form.Item label="Update Type" name="updateType" rules={[{ required: true }]}>
                <Select placeholder="Select update type">
                  <Option value="percentage">Percentage Change</Option>
                  <Option value="fixed">Fixed Amount Change</Option>
                  <Option value="set">Set New Price</Option>
                </Select>
              </Form.Item>
              <Form.Item label="Value" name="value" rules={[{ required: true }]}>
                <InputNumber style={{ width: '100%' }} placeholder="Enter value" />
              </Form.Item>
            </>
          )}

          {operationType === 'Stock Adjustment' && (
            <>
              <Form.Item label="Adjustment Type" name="adjustmentType" rules={[{ required: true }]}>
                <Select placeholder="Select adjustment type">
                  <Option value="add">Add Stock</Option>
                  <Option value="subtract">Subtract Stock</Option>
                  <Option value="set">Set Stock Level</Option>
                </Select>
              </Form.Item>
              <Form.Item label="Quantity" name="quantity" rules={[{ required: true }]}>
                <InputNumber style={{ width: '100%' }} placeholder="Enter quantity" />
              </Form.Item>
            </>
          )}

          {operationType === 'Bulk Delete' && (
            <Alert
              message="Warning"
              description="This action cannot be undone. All selected products will be permanently deleted."
              type="warning"
              showIcon
            />
          )}

          <Form.Item label="Notes" name="notes">
            <TextArea placeholder="Add operation notes..." rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default BulkOperationsPage;
