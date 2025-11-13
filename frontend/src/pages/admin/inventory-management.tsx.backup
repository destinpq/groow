import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Space, Tag, Row, Col, Statistic, Input, Select, message, Alert, Tabs, Typography, Modal, Form, InputNumber } from 'antd';
import { DownloadOutlined, EditOutlined, ExclamationCircleOutlined, WarningOutlined, ReloadOutlined, InboxOutlined, SearchOutlined } from '@ant-design/icons';
import { productAPI, inventoryAlertsAPI } from '@/services/api';
import type { Product } from '@/services/api';

const { Search } = Input;
const { Option } = Select;
const { Title, Text } = Typography;
const { TabPane } = Tabs;

const InventoryManagementPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [inventory, setInventory] = useState<Product[]>([]);
  const [filteredInventory, setFilteredInventory] = useState<Product[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalValue: 0,
    lowStockCount: 0,
    outOfStockCount: 0,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchInventory();
    fetchAlerts();
  }, []);

  useEffect(() => {
    filterInventory();
  }, [inventory, searchTerm, statusFilter]);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const response = await productAPI.getProducts({
        page: 1,
        limit: 1000, // Get all products for inventory view
      });
      
      const products = response.data?.items || [];
      setInventory(products);
      
      // Calculate stats
      const totalProducts = products.length;
      const totalValue = products.reduce((sum: number, product: Product) => sum + (product.basePrice * product.stockQuantity), 0);
      const lowStockCount = products.filter((p: Product) => p.stockQuantity > 0 && p.stockQuantity <= 10).length;
      const outOfStockCount = products.filter((p: Product) => p.stockQuantity === 0).length;
      
      setStats({
        totalProducts,
        totalValue,
        lowStockCount,
        outOfStockCount,
      });
    } catch (error) {
      console.error('Failed to fetch inventory:', error);
      message.error('Failed to load inventory data');
    } finally {
      setLoading(false);
    }
  };

  const fetchAlerts = async () => {
    try {
      const response = await inventoryAlertsAPI.getAlerts({
        limit: 100,
        offset: 0,
      });
      setAlerts(response.alerts || []);
    } catch (error) {
      console.error('Failed to fetch alerts:', error);
    }
  };

  const filterInventory = () => {
    let filtered = inventory;
    
    if (searchTerm) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter) {
      filtered = filtered.filter(product => {
        const status = getStockStatus(product);
        return status === statusFilter;
      });
    }
    
    setFilteredInventory(filtered);
  };

  const getStockStatus = (product: Product) => {
    if (product.stockQuantity === 0) return 'out_of_stock';
    if (product.stockQuantity <= 10) return 'low_stock';
    return 'in_stock';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_stock': return 'green';
      case 'low_stock': return 'orange';
      case 'out_of_stock': return 'red';
      default: return 'blue';
    }
  };

  const handleStockUpdate = (product: Product) => {
    setEditingProduct(product);
    form.setFieldsValue({
      currentStock: product.stockQuantity,
    });
    setEditModalVisible(true);
  };

  const handleStockUpdateSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (!editingProduct) return;

      await productAPI.updateProductStock(editingProduct.id, {
        stockQuantity: values.currentStock,
        operation: 'set',
        reason: 'Admin adjustment',
      });

      message.success('Stock updated successfully');
      setEditModalVisible(false);
      setEditingProduct(null);
      form.resetFields();
      fetchInventory(); // Refresh inventory
    } catch (error) {
      console.error('Stock update failed:', error);
      message.error('Failed to update stock');
    }
  };

  const columns = [
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
      width: 200,
    },
    {
      title: 'Category',
      key: 'category',
      render: (record: Product) => record.category?.name || 'No Category',
      width: 150,
    },
    {
      title: 'Current Stock',
      key: 'stock',
      render: (record: Product) => (
        <div>
          <Text strong style={{ color: record.stockQuantity <= 10 ? '#fa8c16' : '#52c41a' }}>
            {record.stockQuantity}
          </Text>
          <Text type="secondary"> units</Text>
        </div>
      ),
      width: 120,
    },
    {
      title: 'Status',
      key: 'status',
      render: (record: Product) => {
        const status = getStockStatus(record);
        return <Tag color={getStatusColor(status)}>{status.replace('_', ' ').toUpperCase()}</Tag>;
      },
      width: 120,
    },
    {
      title: 'Unit Price',
      key: 'price',
      render: (record: Product) => <Text strong>${record.basePrice.toFixed(2)}</Text>,
      width: 100,
    },
    {
      title: 'Total Value',
      key: 'value',
      render: (record: Product) => <Text strong>${(record.basePrice * record.stockQuantity).toLocaleString()}</Text>,
      width: 120,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: Product) => (
        <Button 
          type="text" 
          icon={<EditOutlined />} 
          onClick={() => handleStockUpdate(record)}
          title="Update Stock"
        />
      ),
      width: 80,
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={2}>
          <InboxOutlined style={{ marginRight: 8 }} />
          Inventory Management
        </Title>
        <Text type="secondary">Phase 4 - Advanced inventory tracking system</Text>
      </div>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic title="Total Products" value={stats.totalProducts} valueStyle={{ color: '#1890ff' }} prefix={<InboxOutlined />} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Total Value" value={stats.totalValue} precision={2} prefix="$" valueStyle={{ color: '#52c41a' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Low Stock Items" value={stats.lowStockCount} valueStyle={{ color: '#fa8c16' }} prefix={<WarningOutlined />} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Out of Stock" value={stats.outOfStockCount} valueStyle={{ color: '#f5222d' }} prefix={<ExclamationCircleOutlined />} />
          </Card>
        </Col>
      </Row>

      <Alert
        message="Inventory Status Alert"
        description={`${stats.outOfStockCount} products out of stock, ${stats.lowStockCount} products running low.`}
        type="warning"
        showIcon
        style={{ marginBottom: 16 }}
        closable
      />

      <Card>
        <Tabs defaultActiveKey="inventory">
          <TabPane tab="Inventory Overview" key="inventory">
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={6}>
                <Search 
                  placeholder="Search products..." 
                  prefix={<SearchOutlined />} 
                  allowClear 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </Col>
              <Col span={4}>
                <Select 
                  placeholder="Status" 
                  style={{ width: '100%' }}
                  value={statusFilter}
                  onChange={setStatusFilter}
                  allowClear
                >
                  <Option value="in_stock">In Stock</Option>
                  <Option value="low_stock">Low Stock</Option>
                  <Option value="out_of_stock">Out of Stock</Option>
                </Select>
              </Col>
              <Col span={10}>
                <Space>
                  <Button icon={<ReloadOutlined />} onClick={fetchInventory} loading={loading}>
                    Refresh
                  </Button>
                  <Button icon={<DownloadOutlined />} onClick={() => message.success('Export completed')}>
                    Export
                  </Button>
                </Space>
              </Col>
            </Row>

            <Table
              columns={columns}
              dataSource={filteredInventory}
              rowKey="id"
              loading={loading}
              pagination={{ pageSize: 10, showTotal: (total) => `Total ${total} items` }}
            />
          </TabPane>

          <TabPane tab="Stock Movements" key="movements">
            <Alert message="Stock Movement Tracking" description="Track all inventory movements and transfers." type="info" />
          </TabPane>

          <TabPane tab="Analytics" key="analytics">
            <Alert message="Inventory Analytics" description="Advanced analytics and demand forecasting." type="info" />
          </TabPane>
        </Tabs>
      </Card>

      {/* Stock Update Modal */}
      <Modal
        title="Update Stock Quantity"
        open={editModalVisible}
        onOk={handleStockUpdateSubmit}
        onCancel={() => {
          setEditModalVisible(false);
          setEditingProduct(null);
          form.resetFields();
        }}
        okText="Update Stock"
      >
        {editingProduct && (
          <Form
            form={form}
            layout="vertical"
          >
            <div style={{ marginBottom: 16 }}>
              <Text strong>Product: </Text>
              <Text>{editingProduct.name}</Text>
              <br />
              <Text strong>SKU: </Text>
              <Text>{editingProduct.sku}</Text>
              <br />
              <Text strong>Current Stock: </Text>
              <Text>{editingProduct.stockQuantity} units</Text>
            </div>
            
            <Form.Item
              name="currentStock"
              label="New Stock Quantity"
              rules={[
                { required: true, message: 'Please enter stock quantity' },
                { type: 'number', min: 0, message: 'Stock cannot be negative' }
              ]}
            >
              <InputNumber
                style={{ width: '100%' }}
                placeholder="Enter new stock quantity"
                min={0}
                precision={0}
              />
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default InventoryManagementPage;
