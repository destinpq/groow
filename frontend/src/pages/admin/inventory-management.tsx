import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Space, Tag, Row, Col, Statistic, Input, Select, message, Alert, Tabs, Typography, Modal, Form, InputNumber } from 'antd';
import { DownloadOutlined, EditOutlined, ExclamationCircleOutlined, WarningOutlined, ReloadOutlined, InboxOutlined, SearchOutlined } from '@ant-design/icons';
import { productAPI, inventoryAlertsAPI, Product } from '@/services/api';

const { Search } = Input;
const { Option } = Select;
const { Title, Text } = Typography;
const { TabPane } = Tabs;

interface InventoryStats {
  totalProducts: number;
  totalValue: number;
  lowStockCount: number;
  outOfStockCount: number;
}

const InventoryManagementPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [inventory, setInventory] = useState<Product[]>([]);
  const [stats, setStats] = useState<InventoryStats>({
    totalProducts: 0,
    totalValue: 0,
    lowStockCount: 0,
    outOfStockCount: 0,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchInventory();
    fetchStats();
  }, []);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getAll({
        page: 1,
        limit: 100,
        search: searchQuery || undefined,
      });
      
      let products = response.data || [];
      
      // Apply status filter locally
      if (statusFilter === 'out_of_stock') {
        products = products.filter(p => (p.stock || 0) === 0);
      } else if (statusFilter === 'low_stock') {
        products = products.filter(p => (p.stock || 0) > 0 && (p.stock || 0) <= 10);
      } else if (statusFilter === 'in_stock') {
        products = products.filter(p => (p.stock || 0) > 10);
      }
      
      setInventory(products);
    } catch (error) {
      message.error('Failed to load inventory');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await productAPI.getAll({ page: 1, limit: 1000 });
      const products = response.data || [];
      
      const totalProducts = products.length;
      const totalValue = products.reduce((sum, p) => sum + (p.price * (p.stock || 0)), 0);
      const lowStockCount = products.filter(p => (p.stock || 0) > 0 && (p.stock || 0) <= 10).length;
      const outOfStockCount = products.filter(p => (p.stock || 0) === 0).length;
      
      setStats({
        totalProducts,
        totalValue,
        lowStockCount,
        outOfStockCount,
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const handleStockUpdate = (product: Product) => {
    setEditingProduct(product);
    form.setFieldsValue({ stock: product.stock });
    setEditModalVisible(true);
  };

  const handleStockSubmit = async (values: any) => {
    if (!editingProduct) return;
    
    try {
      await productAPI.update(editingProduct.id, { stock: values.stock });
      message.success('Stock updated successfully');
      setEditModalVisible(false);
      fetchInventory();
      fetchStats();
    } catch (error) {
      message.error('Failed to update stock');
      console.error(error);
    }
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return 'out_of_stock';
    if (stock <= 10) return 'low_stock';
    return 'in_stock';
  };

  const getStatusColor = (stock: number) => {
    const status = getStockStatus(stock);
    switch (status) {
      case 'in_stock': return 'green';
      case 'low_stock': return 'orange';
      case 'out_of_stock': return 'red';
      default: return 'blue';
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
          <Text type="secondary" style={{ fontSize: '12px' }}>SKU: {record.sku || 'N/A'}</Text>
        </div>
      ),
      width: 200,
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (category: any) => category?.name || 'N/A',
      width: 150,
    },
    {
      title: 'Stock',
      key: 'stock',
      render: (record: Product) => (
        <div>
          <Text strong style={{ color: (record.stock || 0) <= 10 ? '#fa8c16' : '#52c41a' }}>
            {record.stock || 0}
          </Text>
          <Text type="secondary"> units</Text>
        </div>
      ),
      width: 100,
      sorter: (a: Product, b: Product) => (a.stock || 0) - (b.stock || 0),
    },
    {
      title: 'Status',
      key: 'status',
      render: (record: Product) => {
        const stock = record.stock || 0;
        const status = getStockStatus(stock);
        return (
          <Tag color={getStatusColor(stock)}>
            {status.replace('_', ' ').toUpperCase()}
          </Tag>
        );
      },
      width: 120,
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => <Text>${price?.toFixed(2) || '0.00'}</Text>,
      width: 100,
    },
    {
      title: 'Value',
      key: 'value',
      render: (record: Product) => {
        const value = (record.price || 0) * (record.stock || 0);
        return <Text strong>${value.toFixed(2)}</Text>;
      },
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
        >
          Update
        </Button>
      ),
      width: 100,
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
                  onSearch={(value) => {
                    setSearchQuery(value);
                    fetchInventory();
                  }}
                />
              </Col>
              <Col span={4}>
                <Select 
                  placeholder="Status" 
                  style={{ width: '100%' }}
                  allowClear
                  onChange={(value) => {
                    setStatusFilter(value || '');
                    fetchInventory();
                  }}
                >
                  <Option value="in_stock">In Stock</Option>
                  <Option value="low_stock">Low Stock</Option>
                  <Option value="out_of_stock">Out of Stock</Option>
                </Select>
              </Col>
              <Col span={10}>
                <Space>
                  <Button icon={<ReloadOutlined />} onClick={() => {
                    fetchInventory();
                    fetchStats();
                  }}>Refresh</Button>
                  <Button 
                    icon={<DownloadOutlined />} 
                    onClick={() => message.success('Export feature coming soon')}
                  >
                    Export
                  </Button>
                </Space>
              </Col>
            </Row>

            <Table
              columns={columns}
              dataSource={inventory}
              rowKey="id"
              loading={loading}
              pagination={{ 
                pageSize: 10, 
                showTotal: (total) => `Total ${total} items`,
                showSizeChanger: true,
              }}
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
        title="Update Stock"
        open={editModalVisible}
        onOk={() => form.submit()}
        onCancel={() => setEditModalVisible(false)}
      >
        <Form form={form} layout="vertical" onFinish={handleStockSubmit}>
          <Form.Item label="Product">
            <Text strong>{editingProduct?.name}</Text>
          </Form.Item>
          <Form.Item
            name="stock"
            label="Stock Quantity"
            rules={[{ required: true, message: 'Please enter stock quantity' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default InventoryManagementPage;
