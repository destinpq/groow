import React, { useState, useEffect } from 'react';
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
  message,
  Steps,
  Modal,
  Avatar,
  Divider,
  Timeline,
  Badge,
} from 'antd';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  ShoppingOutlined,
  CarOutlined,
  InboxOutlined,
  UserOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  MailOutlined,
  PrinterOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { ordersAPI, Order } from '@/services/api/orders';

const { Title, Text, Paragraph } = Typography;
const { Step } = Steps;

const OrderFulfillmentPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await ordersAPI.getAll({ status: 'processing,pending' });
      setOrders(response.data);
    } catch (error) {
      message.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      await ordersAPI.updateStatus(orderId, newStatus as any);
      message.success('Order status updated');
      fetchOrders();
    } catch (error) {
      message.error('Failed to update status');
    }
  };

  const columns: ColumnsType<Order> = [
    {
      title: 'Order #',
      dataIndex: 'orderNumber',
      key: 'orderNumber',
      fixed: 'left',
      width: 140,
      render: (orderNumber: string) => (
        <Text strong style={{ color: '#1890ff' }}>
          {orderNumber}
        </Text>
      ),
    },
    {
      title: 'Customer',
      key: 'customer',
      width: 180,
      render: (order: Order) => (
        <div>
          <div>
            <UserOutlined /> <Text strong>{order.customer?.name || 'Unknown'}</Text>
          </div>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {order.customer?.email || 'N/A'}
          </Text>
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: string) => {
        const statusConfig: Record<string, { color: string; text: string }> = {
          pending: { color: 'gold', text: 'Pending' },
          processing: { color: 'blue', text: 'Processing' },
          completed: { color: 'green', text: 'Completed' },
          cancelled: { color: 'red', text: 'Cancelled' },
        };
        const config = statusConfig[status] || { color: 'default', text: status };
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: 'Total',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      width: 100,
      render: (amount: number) => <Text strong>${amount?.toFixed(2) || '0.00'}</Text>,
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      width: 120,
      render: (order: Order) => (
        <Space>
          <Button type="primary" size="small" onClick={() => setSelectedOrder(order)}>
            View
          </Button>
        </Space>
      ),
    },
  ];

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsOrderModalVisible(true);
  };

  const handleStartPicking = (order: Order) => {
    message.success(`Started picking for order ${order.orderNumber}`);
  };

  const handleMarkPacked = (order: Order) => {
    message.success(`Order ${order.orderNumber} marked as packed`);
  };

  const handleGenerateLabel = (order: Order) => {
    message.success(`Shipping label generated for order ${order.orderNumber}`);
  };

  const handleShipOrder = (values: any) => {
    message.success(`Order ${selectedOrder?.orderNumber} marked as shipped`);
    setIsOrderModalVisible(false);
  };

  const orderColumns: ColumnsType<Order> = [
    {
      title: 'Order',
      key: 'order',
      fixed: 'left',
      width: 200,
      render: (_, record) => (
        <div>
          <Text strong>{record.orderNumber}</Text>
          <div>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {record.orderDate}
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: 'Customer',
      key: 'customer',
      width: 200,
      render: (_, record) => (
        <Space>
          <Avatar icon={<UserOutlined />} />
          <div>
            <Text strong>{record.customerName}</Text>
            <div>
              <Text type="secondary" style={{ fontSize: 11 }}>{record.customerEmail}</Text>
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: 'Items',
      dataIndex: 'items',
      key: 'items',
      render: (items: OrderItem[]) => (
        <Space direction="vertical" size={0}>
          <Text>{items.length} item(s)</Text>
          {items.map((item) => (
            <Text key={item.id} type="secondary" style={{ fontSize: 11 }}>
              {item.quantity}x {item.productName}
            </Text>
          ))}
        </Space>
      ),
    },
    {
      title: 'Total',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount) => <Text strong>${amount}</Text>,
    },
    {
      title: 'Status',
      dataIndex: 'fulfillmentStatus',
      key: 'fulfillmentStatus',
      render: (status: Order['fulfillmentStatus']) => {
        const config: Record<Order['fulfillmentStatus'], { color: string; icon: React.ReactNode; text: string }> = {
          pending: { color: 'default', icon: <ClockCircleOutlined />, text: 'Pending' },
          picking: { color: 'processing', icon: <ShoppingOutlined />, text: 'Picking' },
          packing: { color: 'warning', icon: <InboxOutlined />, text: 'Packing' },
          'ready-to-ship': { color: 'success', icon: <CheckCircleOutlined />, text: 'Ready to Ship' },
          shipped: { color: 'blue', icon: <CarOutlined />, text: 'Shipped' },
          delivered: { color: 'green', icon: <CheckCircleOutlined />, text: 'Delivered' },
        };
        return (
          <Tag color={config[status].color} icon={config[status].icon}>
            {config[status].text}
          </Tag>
        );
      },
      filters: [
        { text: 'Pending', value: 'pending' },
        { text: 'Picking', value: 'picking' },
        { text: 'Packing', value: 'packing' },
        { text: 'Ready to Ship', value: 'ready-to-ship' },
        { text: 'Shipped', value: 'shipped' },
      ],
      onFilter: (value, record) => record.fulfillmentStatus === value,
    },
    {
      title: 'Warehouse',
      dataIndex: 'warehouse',
      key: 'warehouse',
      render: (warehouse) => <Text>{warehouse}</Text>,
    },
    {
      title: 'Assigned To',
      dataIndex: 'assignedTo',
      key: 'assignedTo',
      render: (assignedTo) => assignedTo ? <Text>{assignedTo}</Text> : <Text type="secondary">Unassigned</Text>,
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      width: 200,
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <Button size="small" type="link" onClick={() => handleViewOrder(record)}>
            View Details
          </Button>
          {record.fulfillmentStatus === 'pending' && (
            <Button size="small" type="primary" onClick={() => handleStartPicking(record)}>
              Start Picking
            </Button>
          )}
          {record.fulfillmentStatus === 'picking' && (
            <Button size="small" type="primary" onClick={() => handleMarkPacked(record)}>
              Mark as Packed
            </Button>
          )}
          {record.fulfillmentStatus === 'packing' && (
            <Button size="small" type="primary" onClick={() => handleGenerateLabel(record)}>
              Generate Label
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const getFulfillmentStep = (status: Order['fulfillmentStatus']): number => {
    const steps: Record<Order['fulfillmentStatus'], number> = {
      pending: 0,
      picking: 1,
      packing: 2,
      'ready-to-ship': 3,
      shipped: 4,
      delivered: 5,
    };
    return steps[status];
  };

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={3}>
          <InboxOutlined style={{ color: '#1890ff' }} /> Order Fulfillment
        </Title>
        <Paragraph type="secondary">
          Manage order picking, packing, and shipping processes
        </Paragraph>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Space direction="vertical" size={0}>
              <Text type="secondary">Pending Orders</Text>
              <Text strong style={{ fontSize: 24, color: '#faad14' }}>
                {mockOrders.filter((o) => o.fulfillmentStatus === 'pending').length}
              </Text>
            </Space>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Space direction="vertical" size={0}>
              <Text type="secondary">In Progress</Text>
              <Text strong style={{ fontSize: 24, color: '#1890ff' }}>
                {mockOrders.filter((o) => ['picking', 'packing'].includes(o.fulfillmentStatus)).length}
              </Text>
            </Space>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Space direction="vertical" size={0}>
              <Text type="secondary">Ready to Ship</Text>
              <Text strong style={{ fontSize: 24, color: '#52c41a' }}>
                {mockOrders.filter((o) => o.fulfillmentStatus === 'ready-to-ship').length}
              </Text>
            </Space>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Space direction="vertical" size={0}>
              <Text type="secondary">Shipped Today</Text>
              <Text strong style={{ fontSize: 24, color: '#722ed1' }}>
                {mockOrders.filter((o) => o.fulfillmentStatus === 'shipped').length}
              </Text>
            </Space>
          </Card>
        </Col>
      </Row>

      <Card title="Orders Queue">
        <Table
          columns={orderColumns}
          dataSource={mockOrders}
          rowKey="id"
          scroll={{ x: 1400 }}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title={`Order Details - ${selectedOrder?.orderNumber}`}
        open={isOrderModalVisible}
        onCancel={() => setIsOrderModalVisible(false)}
        width={800}
        footer={null}
      >
        {selectedOrder && (
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Steps current={getFulfillmentStep(selectedOrder.fulfillmentStatus)} size="small">
              <Step title="Pending" icon={<ClockCircleOutlined />} />
              <Step title="Picking" icon={<ShoppingOutlined />} />
              <Step title="Packing" icon={<InboxOutlined />} />
              <Step title="Ready" icon={<CheckCircleOutlined />} />
              <Step title="Shipped" icon={<CarOutlined />} />
            </Steps>

            <Card size="small" title="Customer Information">
              <Row gutter={16}>
                <Col span={12}>
                  <Space direction="vertical" size="small">
                    <Space>
                      <UserOutlined />
                      <Text strong>{selectedOrder.customerName}</Text>
                    </Space>
                    <Space>
                      <MailOutlined />
                      <Text>{selectedOrder.customerEmail}</Text>
                    </Space>
                    <Space>
                      <PhoneOutlined />
                      <Text>{selectedOrder.customerPhone}</Text>
                    </Space>
                  </Space>
                </Col>
                <Col span={12}>
                  <Space direction="vertical" size="small">
                    <Space align="start">
                      <EnvironmentOutlined />
                      <div>
                        <Text strong>Shipping Address</Text>
                        <div>
                          <Text>{selectedOrder.shippingAddress}</Text>
                        </div>
                      </div>
                    </Space>
                  </Space>
                </Col>
              </Row>
            </Card>

            <Card size="small" title="Order Items">
              <Table
                dataSource={selectedOrder.items}
                rowKey="id"
                pagination={false}
                size="small"
                columns={[
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
                    title: 'Location',
                    dataIndex: 'location',
                    key: 'location',
                    render: (location) => (
                      <Tag color="blue">
                        <EnvironmentOutlined /> {location}
                      </Tag>
                    ),
                  },
                  {
                    title: 'Quantity',
                    dataIndex: 'quantity',
                    key: 'quantity',
                  },
                  {
                    title: 'Price',
                    dataIndex: 'price',
                    key: 'price',
                    render: (price) => `$${price}`,
                  },
                  {
                    title: 'Status',
                    dataIndex: 'picked',
                    key: 'picked',
                    render: (picked) =>
                      picked ? (
                        <Tag color="green" icon={<CheckCircleOutlined />}>
                          Picked
                        </Tag>
                      ) : (
                        <Tag color="default" icon={<ClockCircleOutlined />}>
                          Pending
                        </Tag>
                      ),
                  },
                ]}
              />
            </Card>

            <Card size="small" title="Fulfillment Actions">
              <Form form={form} layout="vertical" onFinish={handleShipOrder}>
                {selectedOrder.fulfillmentStatus === 'ready-to-ship' && (
                  <>
                    <Form.Item
                      label="Carrier"
                      name="carrier"
                      rules={[{ required: true, message: 'Please select carrier' }]}
                    >
                      <Select placeholder="Select carrier">
                        <Select.Option value="fedex">FedEx</Select.Option>
                        <Select.Option value="ups">UPS</Select.Option>
                        <Select.Option value="usps">USPS</Select.Option>
                        <Select.Option value="dhl">DHL</Select.Option>
                      </Select>
                    </Form.Item>

                    <Form.Item
                      label="Tracking Number"
                      name="trackingNumber"
                      rules={[{ required: true, message: 'Please enter tracking number' }]}
                    >
                      <Input placeholder="Enter tracking number" />
                    </Form.Item>

                    <Form.Item>
                      <Space>
                        <Button type="primary" htmlType="submit" icon={<CarOutlined />}>
                          Mark as Shipped
                        </Button>
                        <Button icon={<PrinterOutlined />}>
                          Print Label
                        </Button>
                        <Button icon={<DownloadOutlined />}>
                          Download Packing Slip
                        </Button>
                      </Space>
                    </Form.Item>
                  </>
                )}

                {selectedOrder.fulfillmentStatus === 'shipped' && (
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Text strong>Tracking Information</Text>
                    <Space>
                      <Text>Carrier:</Text>
                      <Tag color="blue">{selectedOrder.carrier}</Tag>
                    </Space>
                    <Space>
                      <Text>Tracking Number:</Text>
                      <Text copyable strong>{selectedOrder.trackingNumber}</Text>
                    </Space>
                  </Space>
                )}
              </Form>
            </Card>

            <Card size="small" title="Fulfillment Timeline">
              <Timeline>
                <Timeline.Item color="green">
                  <Text>Order placed - {selectedOrder.orderDate}</Text>
                </Timeline.Item>
                <Timeline.Item color="blue">
                  <Text>Payment confirmed</Text>
                </Timeline.Item>
                {selectedOrder.fulfillmentStatus !== 'pending' && (
                  <Timeline.Item color="blue">
                    <Text>Picking started</Text>
                  </Timeline.Item>
                )}
                {['packing', 'ready-to-ship', 'shipped'].includes(selectedOrder.fulfillmentStatus) && (
                  <Timeline.Item color="blue">
                    <Text>Packing completed</Text>
                  </Timeline.Item>
                )}
                {selectedOrder.fulfillmentStatus === 'shipped' && (
                  <Timeline.Item color="green">
                    <Text>Order shipped</Text>
                  </Timeline.Item>
                )}
              </Timeline>
            </Card>
          </Space>
        )}
      </Modal>
    </div>
  );
};

export default OrderFulfillmentPage;
