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
  message,
  Statistic,
  Progress,
  Modal,
  Alert,
  Tabs,
  Badge,
} from 'antd';
import {
  InboxOutlined,
  WarningOutlined,
  AlertOutlined,
  CheckCircleOutlined,
  SyncOutlined,
  PlusOutlined,
  MinusOutlined,
  BarChartOutlined,
  ShoppingOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

interface InventoryItem {
  id: number;
  sku: string;
  productName: string;
  category: string;
  currentStock: number;
  reorderPoint: number;
  maxStock: number;
  unitCost: number;
  totalValue: number;
  warehouse: string;
  lastRestocked: string;
  status: 'in-stock' | 'low-stock' | 'out-of-stock' | 'overstock';
}

interface StockMovement {
  id: number;
  sku: string;
  productName: string;
  type: 'in' | 'out' | 'adjustment' | 'transfer';
  quantity: number;
  from: string;
  to: string;
  reason: string;
  timestamp: string;
  performedBy: string;
}

interface StockAlert {
  id: number;
  sku: string;
  productName: string;
  alertType: 'low-stock' | 'out-of-stock' | 'overstock' | 'expiring';
  currentStock: number;
  reorderPoint: number;
  severity: 'high' | 'medium' | 'low';
  createdAt: string;
}

const mockInventory: InventoryItem[] = [
  {
    id: 1,
    sku: 'ELEC-001',
    productName: 'Wireless Headphones Pro',
    category: 'Electronics',
    currentStock: 45,
    reorderPoint: 20,
    maxStock: 200,
    unitCost: 50,
    totalValue: 2250,
    warehouse: 'Main Warehouse',
    lastRestocked: dayjs().subtract(5, 'days').format('YYYY-MM-DD'),
    status: 'in-stock',
  },
  {
    id: 2,
    sku: 'ELEC-002',
    productName: 'Smart Watch Series 5',
    category: 'Electronics',
    currentStock: 12,
    reorderPoint: 15,
    maxStock: 150,
    unitCost: 150,
    totalValue: 1800,
    warehouse: 'Main Warehouse',
    lastRestocked: dayjs().subtract(10, 'days').format('YYYY-MM-DD'),
    status: 'low-stock',
  },
  {
    id: 3,
    sku: 'HOME-003',
    productName: 'Ergonomic Office Chair',
    category: 'Home & Office',
    currentStock: 0,
    reorderPoint: 10,
    maxStock: 100,
    unitCost: 200,
    totalValue: 0,
    warehouse: 'Main Warehouse',
    lastRestocked: dayjs().subtract(20, 'days').format('YYYY-MM-DD'),
    status: 'out-of-stock',
  },
  {
    id: 4,
    sku: 'FASH-004',
    productName: 'Leather Jacket',
    category: 'Fashion',
    currentStock: 180,
    reorderPoint: 30,
    maxStock: 150,
    unitCost: 80,
    totalValue: 14400,
    warehouse: 'Secondary Warehouse',
    lastRestocked: dayjs().subtract(2, 'days').format('YYYY-MM-DD'),
    status: 'overstock',
  },
];

const mockStockMovements: StockMovement[] = [
  {
    id: 1,
    sku: 'ELEC-001',
    productName: 'Wireless Headphones Pro',
    type: 'in',
    quantity: 50,
    from: 'Supplier A',
    to: 'Main Warehouse',
    reason: 'Restock',
    timestamp: dayjs().subtract(5, 'days').format('YYYY-MM-DD HH:mm'),
    performedBy: 'John Smith',
  },
  {
    id: 2,
    sku: 'ELEC-002',
    productName: 'Smart Watch Series 5',
    type: 'out',
    quantity: 8,
    from: 'Main Warehouse',
    to: 'Customer Order #1234',
    reason: 'Sale',
    timestamp: dayjs().subtract(1, 'day').format('YYYY-MM-DD HH:mm'),
    performedBy: 'System',
  },
  {
    id: 3,
    sku: 'HOME-003',
    productName: 'Ergonomic Office Chair',
    type: 'adjustment',
    quantity: -5,
    from: 'Main Warehouse',
    to: 'Main Warehouse',
    reason: 'Damaged items',
    timestamp: dayjs().subtract(3, 'hours').format('YYYY-MM-DD HH:mm'),
    performedBy: 'Jane Doe',
  },
  {
    id: 4,
    sku: 'FASH-004',
    productName: 'Leather Jacket',
    type: 'transfer',
    quantity: 30,
    from: 'Main Warehouse',
    to: 'Secondary Warehouse',
    reason: 'Warehouse balancing',
    timestamp: dayjs().subtract(2, 'days').format('YYYY-MM-DD HH:mm'),
    performedBy: 'Bob Johnson',
  },
];

const mockStockAlerts: StockAlert[] = [
  {
    id: 1,
    sku: 'HOME-003',
    productName: 'Ergonomic Office Chair',
    alertType: 'out-of-stock',
    currentStock: 0,
    reorderPoint: 10,
    severity: 'high',
    createdAt: dayjs().subtract(1, 'hour').format('YYYY-MM-DD HH:mm'),
  },
  {
    id: 2,
    sku: 'ELEC-002',
    productName: 'Smart Watch Series 5',
    alertType: 'low-stock',
    currentStock: 12,
    reorderPoint: 15,
    severity: 'medium',
    createdAt: dayjs().subtract(2, 'hours').format('YYYY-MM-DD HH:mm'),
  },
  {
    id: 3,
    sku: 'FASH-004',
    productName: 'Leather Jacket',
    alertType: 'overstock',
    currentStock: 180,
    reorderPoint: 30,
    severity: 'low',
    createdAt: dayjs().subtract(3, 'hours').format('YYYY-MM-DD HH:mm'),
  },
];

const InventoryManagementPage: React.FC = () => {
  const [form] = Form.useForm();
  const [isStockAdjustmentVisible, setIsStockAdjustmentVisible] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  const handleStockAdjustment = (values: any) => {
    console.log('Stock adjustment:', values);
    message.success('Stock adjusted successfully');
    setIsStockAdjustmentVisible(false);
    form.resetFields();
  };

  const handleReorder = (item: InventoryItem) => {
    message.success(`Reorder initiated for ${item.productName}`);
  };

  const inventoryColumns: ColumnsType<InventoryItem> = [
    {
      title: 'Product',
      key: 'product',
      fixed: 'left',
      width: 250,
      render: (_, record) => (
        <div>
          <Text strong>{record.productName}</Text>
          <div>
            <Text type="secondary" style={{ fontSize: 12 }}>SKU: {record.sku}</Text>
          </div>
          <Tag style={{ fontSize: 10, marginTop: 4 }}>{record.category}</Tag>
        </div>
      ),
    },
    {
      title: 'Stock Level',
      key: 'stock',
      width: 200,
      render: (_, record) => {
        const percentage = (record.currentStock / record.maxStock) * 100;
        let color = '#52c41a';
        if (record.currentStock === 0) color = '#ff4d4f';
        else if (record.currentStock <= record.reorderPoint) color = '#faad14';
        else if (record.currentStock > record.maxStock) color = '#722ed1';

        return (
          <Space direction="vertical" size={0} style={{ width: '100%' }}>
            <Space style={{ width: '100%', justifyContent: 'space-between' }}>
              <Text strong style={{ fontSize: 16, color }}>{record.currentStock}</Text>
              <Text type="secondary" style={{ fontSize: 12 }}>/ {record.maxStock}</Text>
            </Space>
            <Progress
              percent={percentage}
              strokeColor={color}
              showInfo={false}
              size="small"
            />
            <Text type="secondary" style={{ fontSize: 11 }}>
              Reorder at: {record.reorderPoint}
            </Text>
          </Space>
        );
      },
      sorter: (a, b) => a.currentStock - b.currentStock,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: InventoryItem['status']) => {
        const config: Record<InventoryItem['status'], { color: string; icon: React.ReactNode; text: string }> = {
          'in-stock': { color: 'green', icon: <CheckCircleOutlined />, text: 'In Stock' },
          'low-stock': { color: 'orange', icon: <WarningOutlined />, text: 'Low Stock' },
          'out-of-stock': { color: 'red', icon: <AlertOutlined />, text: 'Out of Stock' },
          'overstock': { color: 'purple', icon: <InboxOutlined />, text: 'Overstock' },
        };
        return (
          <Tag color={config[status].color} icon={config[status].icon}>
            {config[status].text}
          </Tag>
        );
      },
      filters: [
        { text: 'In Stock', value: 'in-stock' },
        { text: 'Low Stock', value: 'low-stock' },
        { text: 'Out of Stock', value: 'out-of-stock' },
        { text: 'Overstock', value: 'overstock' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Value',
      key: 'value',
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text strong>${record.totalValue.toLocaleString()}</Text>
          <Text type="secondary" style={{ fontSize: 11 }}>
            @ ${record.unitCost}/unit
          </Text>
        </Space>
      ),
      sorter: (a, b) => a.totalValue - b.totalValue,
    },
    {
      title: 'Warehouse',
      dataIndex: 'warehouse',
      key: 'warehouse',
      render: (warehouse) => <Text>{warehouse}</Text>,
    },
    {
      title: 'Last Restocked',
      dataIndex: 'lastRestocked',
      key: 'lastRestocked',
      render: (date) => (
        <Text type="secondary" style={{ fontSize: 12 }}>
          {dayjs(date).format('MMM DD, YYYY')}
        </Text>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      width: 180,
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <Button
            size="small"
            type="link"
            onClick={() => {
              setSelectedItem(record);
              setIsStockAdjustmentVisible(true);
            }}
          >
            Adjust Stock
          </Button>
          {(record.status === 'low-stock' || record.status === 'out-of-stock') && (
            <Button
              size="small"
              type="primary"
              onClick={() => handleReorder(record)}
            >
              Reorder
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const movementColumns: ColumnsType<StockMovement> = [
    {
      title: 'Product',
      key: 'product',
      render: (_, record) => (
        <div>
          <Text strong>{record.productName}</Text>
          <div>
            <Text type="secondary" style={{ fontSize: 12 }}>SKU: {record.sku}</Text>
          </div>
        </div>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: StockMovement['type']) => {
        const config: Record<StockMovement['type'], { color: string; icon: React.ReactNode; text: string }> = {
          in: { color: 'green', icon: <PlusOutlined />, text: 'Stock In' },
          out: { color: 'red', icon: <MinusOutlined />, text: 'Stock Out' },
          adjustment: { color: 'orange', icon: <SyncOutlined />, text: 'Adjustment' },
          transfer: { color: 'blue', icon: <ShoppingOutlined />, text: 'Transfer' },
        };
        return (
          <Tag color={config[type].color} icon={config[type].icon}>
            {config[type].text}
          </Tag>
        );
      },
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (qty, record) => {
        const isPositive = record.type === 'in' || (record.type === 'adjustment' && qty > 0);
        return (
          <Text strong style={{ color: isPositive ? '#52c41a' : '#ff4d4f' }}>
            {isPositive ? '+' : ''}{qty}
          </Text>
        );
      },
    },
    {
      title: 'Movement',
      key: 'movement',
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text type="secondary" style={{ fontSize: 12 }}>From: {record.from}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>To: {record.to}</Text>
        </Space>
      ),
    },
    {
      title: 'Reason',
      dataIndex: 'reason',
      key: 'reason',
      render: (reason) => <Text>{reason}</Text>,
    },
    {
      title: 'Performed By',
      dataIndex: 'performedBy',
      key: 'performedBy',
      render: (user) => <Text>{user}</Text>,
    },
    {
      title: 'Timestamp',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (time) => (
        <Text type="secondary" style={{ fontSize: 12 }}>{time}</Text>
      ),
    },
  ];

  const alertColumns: ColumnsType<StockAlert> = [
    {
      title: 'Product',
      key: 'product',
      render: (_, record) => (
        <div>
          <Text strong>{record.productName}</Text>
          <div>
            <Text type="secondary" style={{ fontSize: 12 }}>SKU: {record.sku}</Text>
          </div>
        </div>
      ),
    },
    {
      title: 'Alert Type',
      dataIndex: 'alertType',
      key: 'alertType',
      render: (type: StockAlert['alertType']) => {
        const config: Record<StockAlert['alertType'], { color: string; text: string }> = {
          'low-stock': { color: 'orange', text: 'Low Stock' },
          'out-of-stock': { color: 'red', text: 'Out of Stock' },
          'overstock': { color: 'purple', text: 'Overstock' },
          'expiring': { color: 'volcano', text: 'Expiring Soon' },
        };
        return <Tag color={config[type].color}>{config[type].text}</Tag>;
      },
    },
    {
      title: 'Current Stock',
      dataIndex: 'currentStock',
      key: 'currentStock',
      render: (stock) => <Text strong>{stock}</Text>,
    },
    {
      title: 'Reorder Point',
      dataIndex: 'reorderPoint',
      key: 'reorderPoint',
      render: (point) => <Text>{point}</Text>,
    },
    {
      title: 'Severity',
      dataIndex: 'severity',
      key: 'severity',
      render: (severity: StockAlert['severity']) => {
        const config: Record<StockAlert['severity'], { color: string }> = {
          high: { color: 'red' },
          medium: { color: 'orange' },
          low: { color: 'blue' },
        };
        return <Badge color={config[severity].color} text={severity.toUpperCase()} />;
      },
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => <Text type="secondary" style={{ fontSize: 12 }}>{date}</Text>,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button size="small" type="primary">
          Take Action
        </Button>
      ),
    },
  ];

  const totalValue = mockInventory.reduce((sum, item) => sum + item.totalValue, 0);
  const lowStockItems = mockInventory.filter((item) => item.status === 'low-stock' || item.status === 'out-of-stock').length;
  const totalItems = mockInventory.reduce((sum, item) => sum + item.currentStock, 0);
  const criticalAlerts = mockStockAlerts.filter((alert) => alert.severity === 'high').length;

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={3}>
          <InboxOutlined style={{ color: '#1890ff' }} /> Inventory Management
        </Title>
        <Paragraph type="secondary">
          Track stock levels, manage warehouse inventory, and monitor stock movements
        </Paragraph>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Inventory Value"
              value={totalValue}
              prefix="$"
              precision={2}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Items in Stock"
              value={totalItems}
              prefix={<InboxOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Low Stock Alerts"
              value={lowStockItems}
              prefix={<WarningOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Critical Alerts"
              value={criticalAlerts}
              prefix={<AlertOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>

      <Card>
        <Tabs defaultActiveKey="1">
          <TabPane
            tab={
              <span>
                <InboxOutlined />
                Inventory Overview
              </span>
            }
            key="1"
          >
            <Alert
              message="Inventory Management Tips"
              description="Monitor stock levels regularly and set appropriate reorder points to avoid stockouts. Review overstock items to optimize warehouse space."
              type="info"
              showIcon
              style={{ marginBottom: 16 }}
            />
            <Table
              columns={inventoryColumns}
              dataSource={mockInventory}
              rowKey="id"
              scroll={{ x: 1400 }}
              pagination={{ pageSize: 10 }}
            />
          </TabPane>

          <TabPane
            tab={
              <span>
                <SyncOutlined />
                Stock Movements
              </span>
            }
            key="2"
          >
            <Table
              columns={movementColumns}
              dataSource={mockStockMovements}
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          </TabPane>

          <TabPane
            tab={
              <Badge count={criticalAlerts} offset={[10, 0]}>
                <span>
                  <AlertOutlined />
                  Stock Alerts
                </span>
              </Badge>
            }
            key="3"
          >
            <Table
              columns={alertColumns}
              dataSource={mockStockAlerts}
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          </TabPane>
        </Tabs>
      </Card>

      <Modal
        title={`Adjust Stock - ${selectedItem?.productName}`}
        open={isStockAdjustmentVisible}
        onCancel={() => setIsStockAdjustmentVisible(false)}
        footer={null}
        width={500}
      >
        <Form form={form} layout="vertical" onFinish={handleStockAdjustment}>
          <Alert
            message={`Current Stock: ${selectedItem?.currentStock}`}
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
          />

          <Form.Item
            label="Adjustment Type"
            name="type"
            rules={[{ required: true, message: 'Please select type' }]}
          >
            <Select placeholder="Select adjustment type">
              <Select.Option value="in">Stock In</Select.Option>
              <Select.Option value="out">Stock Out</Select.Option>
              <Select.Option value="adjustment">Adjustment</Select.Option>
              <Select.Option value="transfer">Transfer</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Quantity"
            name="quantity"
            rules={[{ required: true, message: 'Please enter quantity' }]}
          >
            <InputNumber
              min={1}
              style={{ width: '100%' }}
              placeholder="Enter quantity"
            />
          </Form.Item>

          <Form.Item
            label="Reason"
            name="reason"
            rules={[{ required: true, message: 'Please enter reason' }]}
          >
            <Input.TextArea rows={3} placeholder="Reason for stock adjustment" />
          </Form.Item>

          <Form.Item
            label="Warehouse"
            name="warehouse"
            rules={[{ required: true, message: 'Please select warehouse' }]}
          >
            <Select placeholder="Select warehouse">
              <Select.Option value="main">Main Warehouse</Select.Option>
              <Select.Option value="secondary">Secondary Warehouse</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Adjust Stock
              </Button>
              <Button onClick={() => setIsStockAdjustmentVisible(false)}>Cancel</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default InventoryManagementPage;
