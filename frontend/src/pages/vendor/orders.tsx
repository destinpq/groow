import React, { useState, useEffect } from 'react';
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
  Spin,
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
import { ordersAPI } from '@/services/api/orders';
import type { Order } from '@/services/api/orders';
import { useAuthStore } from '@/store/auth';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;

const VendorOrdersPage: React.FC = () => {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [trackingModalVisible, setTrackingModalVisible] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchText, setSearchText] = useState('');
  const [form] = Form.useForm();

  // Fetch orders
  const fetchOrders = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const filters: any = {};
      if (statusFilter !== 'all') {
        filters.status = statusFilter;
      }
      
      const response = await ordersAPI.getVendorOrders(user.id, filters);
      
      // Filter by search text if provided
      let filteredData = response.data;
      if (searchText) {
        filteredData = filteredData.filter(
          (order) =>
            order.orderNumber.toLowerCase().includes(searchText.toLowerCase()) ||
            order.customerId.toLowerCase().includes(searchText.toLowerCase())
        );
      }
      
      setOrders(filteredData);
    } catch (error) {
      message.error('Failed to fetch orders');
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter, user?.id]);

  const getStatusColor = (status: Order['status']) => {
    const colors: Record<Order['status'], string> = {
      pending: 'blue',
      confirmed: 'cyan',
      processing: 'orange',
      shipped: 'purple',
      delivered: 'success',
      cancelled: 'error',
      refunded: 'warning',
    };
    return colors[status] || 'default';
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setDrawerVisible(true);
  };

  const handleConfirmOrder = async (order: Order) => {
    Modal.confirm({
      title: 'Confirm Order',
      content: `Confirm order ${order.orderNumber}?`,
      onOk: async () => {
        try {
          await ordersAPI.updateStatus(order.id, 'confirmed');
          message.success('Order confirmed successfully');
          fetchOrders();
        } catch (error) {
          message.error('Failed to confirm order');
          console.error('Error confirming order:', error);
        }
      },
    });
  };

  const handleShipOrder = (order: Order) => {
    setSelectedOrder(order);
    setTrackingModalVisible(true);
  };

  const handleCancelOrder = async (order: Order) => {
    Modal.confirm({
      title: 'Cancel Order',
      content: `Are you sure you want to cancel order ${order.orderNumber}?`,
      okText: 'Yes, Cancel Order',
      okType: 'danger',
      onOk: async () => {
        try {
          await ordersAPI.cancel(order.id, 'Cancelled by vendor');
          message.success('Order cancelled');
          fetchOrders();
        } catch (error) {
          message.error('Failed to cancel order');
          console.error('Error cancelling order:', error);
        }
      },
    });
  };

  const handleSubmitTracking = async (values: any) => {
    if (!selectedOrder) return;
    
    try {
      await ordersAPI.updateTracking(selectedOrder.id, values.trackingNumber);
      await ordersAPI.updateStatus(selectedOrder.id, 'shipped');
      message.success('Order marked as shipped with tracking info');
      setTrackingModalVisible(false);
      form.resetFields();
      fetchOrders();
    } catch (error) {
      message.error('Failed to update tracking');
      console.error('Error updating tracking:', error);
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
      title: 'Customer ID',
      dataIndex: 'customerId',
      key: 'customerId',
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => dayjs(date).format('MMM DD, YYYY'),
      sorter: (a, b) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
    },
    {
      title: 'Items',
      dataIndex: 'items',
      key: 'items',
      render: (items: any[]) => items?.length || 0,
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
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
      render: (paymentStatus: string) => (
        <Tag color={paymentStatus === 'paid' ? 'success' : 'warning'}>
          {paymentStatus?.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: Order['status']) => (
        <Tag color={getStatusColor(status)}>{status.toUpperCase()}</Tag>
      ),
      filters: [
        { text: 'Pending', value: 'pending' },
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
          {record.status === 'pending' && (
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
          {(record.status === 'pending' || record.status === 'confirmed') && (
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
    <Spin spinning={loading}>
      <div style={{ padding: 24 }}>
        <Card title={<Title level={3}>Order Management</Title>}>
          {/* Filters */}
          <Row gutter={16} style={{ marginBottom: 16 }}>
            <Col xs={24} sm={12} md={8}>
              <Input
                placeholder="Search orders..."
                prefix={<SearchOutlined />}
                size="large"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onPressEnter={fetchOrders}
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Select 
                placeholder="Status" 
                size="large" 
                style={{ width: '100%' }}
                value={statusFilter}
                onChange={setStatusFilter}
              >
                <Option value="all">All Orders</Option>
                <Option value="pending">Pending</Option>
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
                <Text type="secondary">Pending</Text>
                <Title level={3} style={{ margin: 0, color: '#1890ff' }}>
                  {orders.filter((o) => o.status === 'pending').length}
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
                selectedOrder.status === 'pending' ? 0 :
                selectedOrder.status === 'confirmed' ? 1 :
                selectedOrder.status === 'processing' ? 2 :
                selectedOrder.status === 'shipped' ? 3 :
                selectedOrder.status === 'delivered' ? 4 : 0
              }
              items={[
                { title: 'Pending' },
                { title: 'Confirmed' },
                { title: 'Processing' },
                { title: 'Shipped' },
                { title: 'Delivered' },
              ]}
            />

            <Descriptions title="Order Information" bordered column={1} size="small">
              <Descriptions.Item label="Order Number">{selectedOrder.orderNumber}</Descriptions.Item>
              <Descriptions.Item label="Customer ID">{selectedOrder.customerId}</Descriptions.Item>
              <Descriptions.Item label="Order Date">
                {dayjs(selectedOrder.createdAt).format('MMM DD, YYYY hh:mm A')}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={getStatusColor(selectedOrder.status)}>
                  {selectedOrder.status.toUpperCase()}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Payment Status">
                <Tag color={selectedOrder.paymentStatus === 'paid' ? 'success' : 'warning'}>
                  {selectedOrder.paymentStatus?.toUpperCase()}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Payment Method">{selectedOrder.paymentMethod}</Descriptions.Item>
              {selectedOrder.trackingNumber && (
                <Descriptions.Item label="Tracking Number">{selectedOrder.trackingNumber}</Descriptions.Item>
              )}
              <Descriptions.Item label="Subtotal">${selectedOrder.subtotal.toFixed(2)}</Descriptions.Item>
              <Descriptions.Item label="Tax">${selectedOrder.tax.toFixed(2)}</Descriptions.Item>
              <Descriptions.Item label="Shipping">${selectedOrder.shipping.toFixed(2)}</Descriptions.Item>
              {selectedOrder.discount > 0 && (
                <Descriptions.Item label="Discount">-${selectedOrder.discount.toFixed(2)}</Descriptions.Item>
              )}
              <Descriptions.Item label="Total Amount">
                <Text strong style={{ fontSize: 18, color: '#52c41a' }}>
                  ${selectedOrder.total.toFixed(2)}
                </Text>
              </Descriptions.Item>
            </Descriptions>

            <Card title="Shipping Address" size="small">
              <Text>
                {selectedOrder.shippingAddress.firstName} {selectedOrder.shippingAddress.lastName}<br />
                {selectedOrder.shippingAddress.address1}<br />
                {selectedOrder.shippingAddress.address2 && <>{selectedOrder.shippingAddress.address2}<br /></>}
                {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zipCode}<br />
                {selectedOrder.shippingAddress.country}<br />
                Phone: {selectedOrder.shippingAddress.phone}
              </Text>
            </Card>

            <Card title="Order Items" size="small">
              <div style={{ marginBottom: 8 }}>
                <Text strong>{selectedOrder.items.length} item(s)</Text>
              </div>
              {selectedOrder.items.map((item) => (
                <div key={item.id} style={{ marginBottom: 12, padding: 12, background: '#f5f5f5', borderRadius: 4 }}>
                  <Space direction="vertical" size="small" style={{ width: '100%' }}>
                    <Text strong>{item.productName}</Text>
                    <Text type="secondary">Quantity: {item.quantity}</Text>
                    <Text>Price: ${item.price.toFixed(2)} each</Text>
                    <Text strong>Total: ${item.total.toFixed(2)}</Text>
                  </Space>
                </div>
              ))}
            </Card>

            <Space>
              <Button icon={<PrinterOutlined />}>Print Invoice</Button>
              {selectedOrder.status === 'pending' && (
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
    </Spin>
  );
};

export default VendorOrdersPage;
