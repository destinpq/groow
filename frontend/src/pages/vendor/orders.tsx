import React, { useState } from 'react';
import {
  Card,
  Table,
  Tag,
  Button,
  Space,
  Input,
  Select,
  Drawer,
  Descriptions,
  Steps,
  Timeline,
  message,
  Modal,
  Form,
  Row,
  Col,
  Typography,
  Alert,
} from 'antd';
import {
  SearchOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  PrinterOutlined,
  TruckOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text } = Typography;
const { Option } = Select;

interface Order {
  id: number;
  orderNumber: string;
  customer: string;
  date: string;
  items: number;
  total: number;
  status: string;
  payment: string;
  shippingAddress: string;
}

const mockOrders: Order[] = [
  {
    id: 1,
    orderNumber: 'ORD-2024-10001',
    customer: 'John Doe',
    date: '2024-11-01',
    items: 2,
    total: 399.98,
    status: 'new',
    payment: 'Paid',
    shippingAddress: '123 Main St, NY',
  },
  {
    id: 2,
    orderNumber: 'ORD-2024-10002',
    customer: 'Sarah Smith',
    date: '2024-10-30',
    items: 1,
    total: 199.99,
    status: 'confirmed',
    payment: 'Paid',
    shippingAddress: '456 Oak Ave, CA',
  },
  {
    id: 3,
    orderNumber: 'ORD-2024-10003',
    customer: 'Mike Johnson',
    date: '2024-10-28',
    items: 3,
    total: 549.97,
    status: 'shipped',
    payment: 'Paid',
    shippingAddress: '789 Pine Rd, TX',
  },
];

const VendorOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [trackingModalVisible, setTrackingModalVisible] = useState(false);
  const [form] = Form.useForm();

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      new: 'blue',
      confirmed: 'cyan',
      processing: 'orange',
      shipped: 'purple',
      delivered: 'success',
      cancelled: 'error',
    };
    return colors[status] || 'default';
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setDrawerVisible(true);
  };

  const handleConfirmOrder = (order: Order) => {
    Modal.confirm({
      title: 'Confirm Order',
      content: `Confirm order ${order.orderNumber}?`,
      onOk: () => {
        setOrders(
          orders.map((o) =>
            o.id === order.id ? { ...o, status: 'confirmed' } : o
          )
        );
        message.success('Order confirmed successfully');
      },
    });
  };

  const handleShipOrder = (order: Order) => {
    setSelectedOrder(order);
    setTrackingModalVisible(true);
  };

  const handleCancelOrder = (order: Order) => {
    Modal.confirm({
      title: 'Cancel Order',
      content: `Are you sure you want to cancel order ${order.orderNumber}?`,
      okText: 'Yes, Cancel Order',
      okType: 'danger',
      onOk: () => {
        setOrders(
          orders.map((o) =>
            o.id === order.id ? { ...o, status: 'cancelled' } : o
          )
        );
        message.success('Order cancelled');
      },
    });
  };

  const handleSubmitTracking = (values: any) => {
    console.log('Tracking info:', values);
    if (selectedOrder) {
      setOrders(
        orders.map((o) =>
          o.id === selectedOrder.id ? { ...o, status: 'shipped' } : o
        )
      );
      message.success('Order marked as shipped with tracking info');
      setTrackingModalVisible(false);
      form.resetFields();
    }
  };

  const columns: ColumnsType<Order> = [
    {
      title: 'Order Number',
      dataIndex: 'orderNumber',
      key: 'orderNumber',
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: 'Customer',
      dataIndex: 'customer',
      key: 'customer',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date: string) => new Date(date).toLocaleDateString(),
      sorter: (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    },
    {
      title: 'Items',
      dataIndex: 'items',
      key: 'items',
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: (total: number) => (
        <Text strong style={{ color: '#52c41a' }}>
          ${total.toFixed(2)}
        </Text>
      ),
      sorter: (a, b) => a.total - b.total,
    },
    {
      title: 'Payment',
      dataIndex: 'payment',
      key: 'payment',
      render: (payment: string) => (
        <Tag color="success">{payment}</Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{status.toUpperCase()}</Tag>
      ),
      filters: [
        { text: 'New', value: 'new' },
        { text: 'Confirmed', value: 'confirmed' },
        { text: 'Processing', value: 'processing' },
        { text: 'Shipped', value: 'shipped' },
        { text: 'Delivered', value: 'delivered' },
        { text: 'Cancelled', value: 'cancelled' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleViewOrder(record)}
          >
            View
          </Button>
          {record.status === 'new' && (
            <Button
              type="link"
              icon={<CheckCircleOutlined />}
              onClick={() => handleConfirmOrder(record)}
            >
              Confirm
            </Button>
          )}
          {(record.status === 'confirmed' || record.status === 'processing') && (
            <Button
              type="link"
              icon={<TruckOutlined />}
              onClick={() => handleShipOrder(record)}
            >
              Ship
            </Button>
          )}
          {(record.status === 'new' || record.status === 'confirmed') && (
            <Button
              type="link"
              danger
              icon={<CloseCircleOutlined />}
              onClick={() => handleCancelOrder(record)}
            >
              Cancel
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Card title={<Title level={3}>Order Management</Title>}>
        {/* Filters */}
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col xs={24} sm={12} md={8}>
            <Input
              placeholder="Search orders..."
              prefix={<SearchOutlined />}
              size="large"
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Select placeholder="Status" size="large" style={{ width: '100%' }}>
              <Option value="all">All Orders</Option>
              <Option value="new">New</Option>
              <Option value="confirmed">Confirmed</Option>
              <Option value="processing">Processing</Option>
              <Option value="shipped">Shipped</Option>
              <Option value="delivered">Delivered</Option>
              <Option value="cancelled">Cancelled</Option>
            </Select>
          </Col>
        </Row>

        {/* Stats */}
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={6}>
            <Card size="small">
              <Text type="secondary">Total Orders</Text>
              <Title level={3} style={{ margin: 0 }}>
                {orders.length}
              </Title>
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small">
              <Text type="secondary">New Orders</Text>
              <Title level={3} style={{ margin: 0, color: '#1890ff' }}>
                {orders.filter((o) => o.status === 'new').length}
              </Title>
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small">
              <Text type="secondary">In Progress</Text>
              <Title level={3} style={{ margin: 0, color: '#faad14' }}>
                {orders.filter((o) => ['confirmed', 'processing', 'shipped'].includes(o.status)).length}
              </Title>
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small">
              <Text type="secondary">Total Revenue</Text>
              <Title level={3} style={{ margin: 0, color: '#52c41a' }}>
                ${orders.reduce((sum, o) => sum + o.total, 0).toFixed(2)}
              </Title>
            </Card>
          </Col>
        </Row>

        {/* Orders Table */}
        <Table
          columns={columns}
          dataSource={orders}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} orders`,
          }}
        />
      </Card>

      {/* Order Detail Drawer */}
      <Drawer
        title={`Order Details - ${selectedOrder?.orderNumber}`}
        placement="right"
        width={600}
        open={drawerVisible}
        onClose={() => setDrawerVisible(false)}
      >
        {selectedOrder && (
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            <Steps
              current={
                selectedOrder.status === 'new' ? 0 :
                selectedOrder.status === 'confirmed' ? 1 :
                selectedOrder.status === 'processing' ? 2 :
                selectedOrder.status === 'shipped' ? 3 :
                selectedOrder.status === 'delivered' ? 4 : 0
              }
              items={[
                { title: 'New' },
                { title: 'Confirmed' },
                { title: 'Processing' },
                { title: 'Shipped' },
                { title: 'Delivered' },
              ]}
            />

            <Descriptions title="Order Information" bordered column={1} size="small">
              <Descriptions.Item label="Order Number">{selectedOrder.orderNumber}</Descriptions.Item>
              <Descriptions.Item label="Customer">{selectedOrder.customer}</Descriptions.Item>
              <Descriptions.Item label="Order Date">
                {new Date(selectedOrder.date).toLocaleDateString()}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={getStatusColor(selectedOrder.status)}>
                  {selectedOrder.status.toUpperCase()}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Payment Status">
                <Tag color="success">{selectedOrder.payment}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Total Amount">
                <Text strong style={{ fontSize: 18, color: '#52c41a' }}>
                  ${selectedOrder.total.toFixed(2)}
                </Text>
              </Descriptions.Item>
            </Descriptions>

            <Card title="Shipping Address" size="small">
              <Text>{selectedOrder.shippingAddress}</Text>
            </Card>

            <Card title="Order Items" size="small">
              <Text>{selectedOrder.items} item(s)</Text>
              {/* Item details would go here */}
            </Card>

            <Space>
              <Button icon={<PrinterOutlined />}>Print Invoice</Button>
              {selectedOrder.status === 'new' && (
                <Button
                  type="primary"
                  icon={<CheckCircleOutlined />}
                  onClick={() => handleConfirmOrder(selectedOrder)}
                >
                  Confirm Order
                </Button>
              )}
              {(selectedOrder.status === 'confirmed' || selectedOrder.status === 'processing') && (
                <Button
                  type="primary"
                  icon={<TruckOutlined />}
                  onClick={() => handleShipOrder(selectedOrder)}
                >
                  Mark as Shipped
                </Button>
              )}
            </Space>
          </Space>
        )}
      </Drawer>

      {/* Add Tracking Modal */}
      <Modal
        title="Add Shipping Details"
        open={trackingModalVisible}
        onCancel={() => setTrackingModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmitTracking}>
          <Form.Item
            name="carrier"
            label="Shipping Carrier"
            rules={[{ required: true, message: 'Please select carrier' }]}
          >
            <Select placeholder="Select carrier">
              <Option value="fedex">FedEx</Option>
              <Option value="ups">UPS</Option>
              <Option value="usps">USPS</Option>
              <Option value="dhl">DHL</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="trackingNumber"
            label="Tracking Number"
            rules={[{ required: true, message: 'Please enter tracking number' }]}
          >
            <Input placeholder="Enter tracking number" />
          </Form.Item>

          <Form.Item name="estimatedDelivery" label="Estimated Delivery Date">
            <Input type="date" />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Mark as Shipped
              </Button>
              <Button onClick={() => setTrackingModalVisible(false)}>Cancel</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default VendorOrdersPage;
