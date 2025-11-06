import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Space, Tag, Row, Col, Statistic, Input, Select, message, Alert, Tabs, Typography } from 'antd';
import { DownloadOutlined, EditOutlined, ExclamationCircleOutlined, WarningOutlined, ReloadOutlined, InboxOutlined, SearchOutlined } from '@ant-design/icons';

const { Search } = Input;
const { Option } = Select;
const { Title, Text } = Typography;
const { TabPane } = Tabs;

const InventoryManagementPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [inventory, setInventory] = useState<any[]>([]);
  const [stats] = useState({
    totalProducts: 1247,
    totalValue: 156750.45,
    lowStockCount: 23,
    outOfStockCount: 7,
  });

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = () => {
    setLoading(true);
    const mockData = [
      {
        id: 1,
        productName: 'Wireless Headphones Pro',
        sku: 'WH-PRO-001',
        vendor: 'Audio Tech Solutions',
        currentStock: 45,
        reorderLevel: 15,
        maxStock: 100,
        unitCost: 75.99,
        totalValue: 3419.55,
        status: 'in_stock',
        location: 'Warehouse A',
      },
      {
        id: 2,
        productName: 'Smart Watch Series X',
        sku: 'SW-X-002',
        vendor: 'Tech Innovations Ltd',
        currentStock: 8,
        reorderLevel: 12,
        maxStock: 80,
        unitCost: 249.99,
        totalValue: 1999.92,
        status: 'low_stock',
        location: 'Warehouse B',
      },
    ];
    
    setTimeout(() => {
      setInventory(mockData);
      setLoading(false);
    }, 1000);
  };

  const getStatusColor = (status: string) => {
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
      render: (record: any) => (
        <div>
          <Text strong>{record.productName}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: '12px' }}>SKU: {record.sku}</Text>
        </div>
      ),
      width: 200,
    },
    {
      title: 'Vendor',
      dataIndex: 'vendor',
      key: 'vendor',
      width: 150,
    },
    {
      title: 'Stock',
      key: 'stock',
      render: (record: any) => (
        <div>
          <Text strong style={{ color: record.currentStock <= record.reorderLevel ? '#fa8c16' : '#52c41a' }}>
            {record.currentStock}
          </Text>
          <Text type="secondary"> / {record.maxStock}</Text>
        </div>
      ),
      width: 100,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{status.replace('_', ' ').toUpperCase()}</Tag>
      ),
      width: 120,
    },
    {
      title: 'Value',
      key: 'value',
      render: (record: any) => <Text strong>${record.totalValue.toLocaleString()}</Text>,
      width: 100,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Button type="text" icon={<EditOutlined />} onClick={() => message.info('Stock update coming soon')} />
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
                <Search placeholder="Search products..." prefix={<SearchOutlined />} allowClear />
              </Col>
              <Col span={4}>
                <Select placeholder="Status" style={{ width: '100%' }}>
                  <Option value="in_stock">In Stock</Option>
                  <Option value="low_stock">Low Stock</Option>
                  <Option value="out_of_stock">Out of Stock</Option>
                </Select>
              </Col>
              <Col span={10}>
                <Space>
                  <Button icon={<ReloadOutlined />} onClick={fetchInventory}>Refresh</Button>
                  <Button icon={<DownloadOutlined />} onClick={() => message.success('Export completed')}>Export</Button>
                </Space>
              </Col>
            </Row>

            <Table
              columns={columns}
              dataSource={inventory}
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
    </div>
  );
};

export default InventoryManagementPage;
