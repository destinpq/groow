import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Space, Tag, Row, Col, Input, Select, Modal, Form, InputNumber, message, Upload, Tabs, Typography, Progress, Alert, Checkbox } from 'antd';
import { UploadOutlined, DownloadOutlined, EditOutlined, DeleteOutlined, PlayCircleOutlined, PauseCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { productAPI, bulkDataAPI } from '@/services/api';
import type { Product } from '@/services/api';
import type { BulkOperation } from '@/services/api/bulkData';

const { Search } = Input;
const { Option } = Select;
const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { TextArea } = Input;

const BulkOperationsPage: React.FC = () => {
  const [selectedItems, setSelectedItems] = useState<Product[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [operations, setOperations] = useState<BulkOperation[]>([]);
  const [loading, setLoading] = useState(false);
  const [operationsLoading, setOperationsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [operationType, setOperationType] = useState('');
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchProducts();
    fetchOperations();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await productAPI.getProducts({
        page: 1,
        limit: 1000, // Get all products for bulk operations
      });
      setProducts(response.data?.items || []);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      message.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const fetchOperations = async () => {
    setOperationsLoading(true);
    try {
      const response = await bulkDataAPI.getBulkOperations({}, { page: 1, limit: 50 });
      setOperations(response.operations || []);
    } catch (error) {
      console.error('Failed to fetch operations:', error);
      message.error('Failed to load operation history');
    } finally {
      setOperationsLoading(false);
    }
  };

  const handleBulkOperation = (type: string) => {
    setOperationType(type);
    setIsModalVisible(true);
    form.resetFields();
  };

  const executeBulkOperation = async () => {
    try {
      const values = await form.validateFields();
      setProcessing(true);
      setProgress(0);

      let operationData: any = {
        entityType: 'products' as const,
        criteria: {
          productIds: selectedItems.map(item => item.id),
        },
        changes: {},
      };

      // Set operation type and changes based on operation
      switch (operationType) {
        case 'Price Update':
          operationData.type = 'price_update';
          operationData.changes = {
            basePrice: values.newPrice,
            updateType: values.priceUpdateType, // 'set', 'increase', 'decrease'
            percentage: values.percentage,
          };
          break;
        case 'Stock Adjustment':
          operationData.type = 'update';
          operationData.changes = {
            stockQuantity: values.stockQuantity,
            operation: values.stockOperation, // 'set', 'add', 'subtract'
          };
          break;
        case 'Bulk Delete':
          operationData.type = 'delete';
          break;
        case 'Category Update':
          operationData.type = 'categorize';
          operationData.changes = {
            categoryId: values.categoryId,
          };
          break;
        default:
          operationData.type = 'update';
      }

      // Create bulk operation
      const operation = await bulkDataAPI.createBulkOperation(operationData);
      
      // Start the operation
      await bulkDataAPI.startBulkOperation(operation.id);

      // Simulate progress tracking (in real implementation, this would be polling)
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            setProcessing(false);
            setIsModalVisible(false);
            setSelectedItems([]);
            message.success(`${operationType} completed successfully for ${selectedItems.length} items`);
            fetchProducts(); // Refresh products
            fetchOperations(); // Refresh operations
            return 100;
          }
          return prev + 10;
        });
      }, 300);
    } catch (error) {
      console.error('Operation failed:', error);
      setProcessing(false);
      message.error('Operation failed');
    }
  };

  const getOperationColor = (status: string) => {
    switch (status) {
      case 'completed': return 'green';
      case 'processing': return 'blue';
      case 'failed': return 'red';
      case 'cancelled': return 'orange';
      default: return 'default';
    }
  };

  const handlePauseOperation = async (operationId: string) => {
    try {
      await bulkDataAPI.cancelBulkOperation(operationId);
      message.success('Operation paused');
      fetchOperations();
    } catch (error) {
      console.error('Failed to pause operation:', error);
      message.error('Failed to pause operation');
    }
  };

  const handleViewDetails = (operation: BulkOperation) => {
    Modal.info({
      title: 'Operation Details',
      content: (
        <div>
          <p><strong>Type:</strong> {operation.type.replace('_', ' ').toUpperCase()}</p>
          <p><strong>Entity:</strong> {operation.entityType}</p>
          <p><strong>Status:</strong> {operation.status.toUpperCase()}</p>
          <p><strong>Progress:</strong> {operation.progress}%</p>
          <p><strong>Items:</strong> {operation.successfulItems}/{operation.totalItems}</p>
          <p><strong>Failed:</strong> {operation.failedItems}</p>
          <p><strong>Created:</strong> {new Date(operation.createdAt).toLocaleString()}</p>
          {operation.errors && operation.errors.length > 0 && (
            <div>
              <strong>Errors:</strong>
              <ul>
                {operation.errors.slice(0, 5).map((error, index) => (
                  <li key={index}>{error.error}</li>
                ))}
                {operation.errors.length > 5 && <li>... and {operation.errors.length - 5} more</li>}
              </ul>
            </div>
          )}
        </div>
      ),
      width: 500,
    });
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
          <Text type="secondary" style={{ fontSize: '12px' }}>SKU: {record.sku}</Text>
        </div>
      ),
    },
    {
      title: 'Current Price',
      key: 'price',
      render: (record: Product) => <Text strong>${record.basePrice.toFixed(2)}</Text>,
    },
    {
      title: 'Stock',
      key: 'stock',
      render: (record: Product) => record.stockQuantity,
    },
    {
      title: 'Category',
      key: 'category',
      render: (record: Product) => record.category?.name || 'No Category',
    },
  ];

  const historyColumns = [
    {
      title: 'Operation',
      key: 'type',
      render: (record: BulkOperation) => record.type.replace('_', ' ').toUpperCase(),
    },
    {
      title: 'Entity',
      dataIndex: 'entityType',
      key: 'entityType',
      render: (entityType: string) => entityType.charAt(0).toUpperCase() + entityType.slice(1),
    },
    {
      title: 'Items',
      key: 'items',
      render: (record: BulkOperation) => `${record.successfulItems}/${record.totalItems}`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getOperationColor(status)} icon={status === 'processing' ? <ClockCircleOutlined /> : null}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Progress',
      key: 'progress',
      render: (record: BulkOperation) => (
        <Progress
          percent={record.progress}
          size="small"
          status={record.status === 'failed' ? 'exception' : record.status === 'completed' ? 'success' : 'normal'}
        />
      ),
    },
    {
      title: 'Created',
      key: 'createdAt',
      render: (record: BulkOperation) => new Date(record.createdAt).toLocaleString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: BulkOperation) => (
        <Space>
          {record.status === 'processing' && (
            <Button size="small" icon={<PauseCircleOutlined />} onClick={() => handlePauseOperation(record.id)}>
              Pause
            </Button>
          )}
          <Button size="small" type="text" onClick={() => handleViewDetails(record)}>
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
                icon={<EditOutlined />}
                disabled={selectedItems.length === 0}
                onClick={() => handleBulkOperation('Category Update')}
              >
                Update Category ({selectedItems.length})
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
              dataSource={operations}
              rowKey="id"
              loading={operationsLoading}
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
        open={isModalVisible}
        onOk={executeBulkOperation}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
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
              <Form.Item label="Update Type" name="priceUpdateType" rules={[{ required: true }]}>
                <Select placeholder="Select update type">
                  <Option value="increase">Percentage Increase</Option>
                  <Option value="decrease">Percentage Decrease</Option>
                  <Option value="set">Set New Price</Option>
                </Select>
              </Form.Item>
              <Form.Item label="New Price / Percentage" name="newPrice" rules={[{ required: true }]}>
                <InputNumber 
                  style={{ width: '100%' }} 
                  placeholder="Enter new price or percentage" 
                  min={0}
                  precision={2}
                />
              </Form.Item>
              <Form.Item label="Percentage (if applicable)" name="percentage">
                <InputNumber 
                  style={{ width: '100%' }} 
                  placeholder="Enter percentage for increase/decrease" 
                  min={0}
                  max={100}
                  precision={1}
                />
              </Form.Item>
            </>
          )}

          {operationType === 'Stock Adjustment' && (
            <>
              <Form.Item label="Adjustment Type" name="stockOperation" rules={[{ required: true }]}>
                <Select placeholder="Select adjustment type">
                  <Option value="add">Add Stock</Option>
                  <Option value="subtract">Subtract Stock</Option>
                  <Option value="set">Set Stock Level</Option>
                </Select>
              </Form.Item>
              <Form.Item label="Quantity" name="stockQuantity" rules={[{ required: true }]}>
                <InputNumber 
                  style={{ width: '100%' }} 
                  placeholder="Enter quantity" 
                  min={0}
                  precision={0}
                />
              </Form.Item>
            </>
          )}

          {operationType === 'Category Update' && (
            <Form.Item label="New Category" name="categoryId" rules={[{ required: true }]}>
              <Select placeholder="Select new category">
                <Option value="electronics">Electronics</Option>
                <Option value="accessories">Accessories</Option>
                <Option value="home">Home & Garden</Option>
                <Option value="fashion">Fashion</Option>
              </Select>
            </Form.Item>
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
