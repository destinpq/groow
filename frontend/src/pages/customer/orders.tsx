import React, { useState } from 'react';
import {
  Card,
  Table,
  Tag,
  Button,
  Space,
  Input,
  Select,
  DatePicker,
  Drawer,
  Typography,
  Timeline,
  Descriptions,
  Row,
  Col,
  Steps,
  message,
  Rate,
  Modal,
  Form,
} from 'antd';
import {
  SearchOutlined,
  EyeOutlined,
  DownloadOutlined,
  RedoOutlined,
  MessageOutlined,
  StarOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { history } from 'umi';

const { Title, Text, Paragraph } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;
const { TextArea } = Input;

interface OrderItem {
  id: number;
  productName: string;
  quantity: number;
  price: number;
  image: string;
}

interface Order {
  id: number;
  orderNumber: string;
  date: string;
  status: string;
  total: number;
  items: OrderItem[];
  shippingAddress: string;
  paymentMethod: string;
  trackingNumber?: string;
  vendor: string;
}

const mockOrders: Order[] = [
  {
    id: 1,
    orderNumber: 'ORD-2024-10001',
    date: '2024-10-15',
    status: 'delivered',
    total: 349.99,
    vendor: 'TechHub Store',
    paymentMethod: 'Credit Card ****4242',
    trackingNumber: 'TRK1234567890',
    shippingAddress: '123 Main St, New York, NY 10001',
    items: [
      {
        id: 1,
        productName: 'Premium Wireless Headphones',
        quantity: 1,
        price: 349.99,
        image: 'https://via.placeholder.com/80/1890ff/fff?text=Product',
      },
    ],
  },
  {
    id: 2,
    orderNumber: 'ORD-2024-10002',
    date: '2024-10-20',
    status: 'in_process',
    total: 249.98,
    vendor: 'Gadget World',
    paymentMethod: 'PayPal',
    trackingNumber: 'TRK0987654321',
    shippingAddress: '123 Main St, New York, NY 10001',
    items: [
      {
        id: 2,
        productName: 'Smart Watch Pro',
        quantity: 1,
        price: 199.99,
        image: 'https://via.placeholder.com/80/52c41a/fff?text=Product',
      },
      {
        id: 3,
        productName: 'Laptop Backpack',
        quantity: 1,
        price: 49.99,
        image: 'https://via.placeholder.com/80/faad14/fff?text=Product',
      },
    ],
  },
  {
    id: 3,
    orderNumber: 'ORD-2024-10003',
    date: '2024-10-25',
    status: 'confirmed',
    total: 89.99,
    vendor: 'Gaming Hub',
    paymentMethod: 'Cash on Delivery',
    shippingAddress: '456 Office Blvd, New York, NY 10002',
    items: [
      {
        id: 4,
        productName: 'Mechanical Gaming Keyboard',
        quantity: 1,
        price: 89.99,
        image: 'https://via.placeholder.com/80/f5222d/fff?text=Product',
      },
    ],
  },
  {
    id: 4,
    orderNumber: 'ORD-2024-10004',
    date: '2024-09-10',
    status: 'cancelled',
    total: 599.99,
    vendor: 'Electronics Store',
    paymentMethod: 'Credit Card ****8888',
    shippingAddress: '123 Main St, New York, NY 10001',
    items: [
      {
        id: 5,
        productName: 'Laptop Computer',
        quantity: 1,
        price: 599.99,
        image: 'https://via.placeholder.com/80/722ed1/fff?text=Product',
      },
    ],
  },
];

const OrdersPage: React.FC = () => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<OrderItem | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      new: 'blue',
      confirmed: 'cyan',
      in_process: 'gold',
      delivered: 'success',
      cancelled: 'error',
      returned: 'warning',
    };
    return colors[status] || 'default';
  };

  const getStatusText = (status: string) => {
    const texts: Record<string, string> = {
      new: 'New Order',
      confirmed: 'Confirmed',
      in_process: 'In Process',
      delivered: 'Delivered',
      cancelled: 'Cancelled',
      returned: 'Returned',
    };
    return texts[status] || status;
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setDrawerVisible(true);
  };

  const handleReorder = (order: Order) => {
    message.success('Items added to cart!');
    history.push('/cart');
  };

  const handleDownloadInvoice = (order: Order) => {
    message.success(`Downloading invoice for ${order.orderNumber}`);
    // Download logic
  };

  const handleReview = (product: OrderItem) => {
    setSelectedProduct(product);
    setReviewModalVisible(true);
  };

  const handleSubmitReview = (values: any) => {
    console.log('Review submitted:', values);
    message.success('Thank you for your review!');
    setReviewModalVisible(false);
  };

  const columns: ColumnsType<Order> = [
    {
      title: 'Order Number',
      dataIndex: 'orderNumber',
      key: 'orderNumber',
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date: string) => new Date(date).toLocaleDateString(),
      sorter: (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    },
    {
      title: 'Vendor',
      dataIndex: 'vendor',
      key: 'vendor',
    },
    {
      title: 'Items',
      dataIndex: 'items',
      key: 'items',
      render: (items: OrderItem[]) => `${items.length} item(s)`,
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: (total: number) => (
        <Text strong style={{ color: '#B12704' }}>
          ${total.toFixed(2)}
        </Text>
      ),
      sorter: (a, b) => a.total - b.total,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>
      ),
      filters: [
        { text: 'New', value: 'new' },
        { text: 'Confirmed', value: 'confirmed' },
        { text: 'In Process', value: 'in_process' },
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
          {record.status === 'delivered' && (
            <Button
              type="link"
              icon={<RedoOutlined />}
              onClick={() => handleReorder(record)}
            >
              Reorder
            </Button>
          )}
          <Button
            type="link"
            icon={<DownloadOutlined />}
            onClick={() => handleDownloadInvoice(record)}
          >
            Invoice
          </Button>
        </Space>
      ),
    },
  ];

  const filteredOrders = statusFilter === 'all' 
    ? mockOrders 
    : mockOrders.filter(order => order.status === statusFilter);

  return (
    <div style={{ padding: 24, maxWidth: 1400, margin: '0 auto' }}>
      <Title level={2}>My Orders</Title>

      {/* Filters */}
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={16}>
          <Col xs={24} sm={12} md={6}>
            <Input
              placeholder="Search orders..."
              prefix={<SearchOutlined />}
              size="large"
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Select
              placeholder="Filter by status"
              size="large"
              style={{ width: '100%' }}
              value={statusFilter}
              onChange={setStatusFilter}
            >
              <Option value="all">All Orders</Option>
              <Option value="new">New</Option>
              <Option value="confirmed">Confirmed</Option>
              <Option value="in_process">In Process</Option>
              <Option value="delivered">Delivered</Option>
              <Option value="cancelled">Cancelled</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <RangePicker size="large" style={{ width: '100%' }} />
          </Col>
        </Row>
      </Card>

      {/* Orders Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredOrders}
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
        width={720}
        open={drawerVisible}
        onClose={() => setDrawerVisible(false)}
      >
        {selectedOrder && (
          <div>
            {/* Order Status */}
            <Card size="small" style={{ marginBottom: 16 }}>
              <Steps
                current={
                  selectedOrder.status === 'new' ? 0 :
                  selectedOrder.status === 'confirmed' ? 1 :
                  selectedOrder.status === 'in_process' ? 2 :
                  selectedOrder.status === 'delivered' ? 3 : 0
                }
                items={[
                  { title: 'New' },
                  { title: 'Confirmed' },
                  { title: 'Processing' },
                  { title: 'Delivered' },
                ]}
              />
            </Card>

            {/* Order Info */}
            <Descriptions title="Order Information" bordered column={1} size="small">
              <Descriptions.Item label="Order Number">{selectedOrder.orderNumber}</Descriptions.Item>
              <Descriptions.Item label="Order Date">
                {new Date(selectedOrder.date).toLocaleDateString()}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={getStatusColor(selectedOrder.status)}>
                  {getStatusText(selectedOrder.status)}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Vendor">{selectedOrder.vendor}</Descriptions.Item>
              <Descriptions.Item label="Payment Method">{selectedOrder.paymentMethod}</Descriptions.Item>
              {selectedOrder.trackingNumber && (
                <Descriptions.Item label="Tracking Number">
                  <a href="#">{selectedOrder.trackingNumber}</a>
                </Descriptions.Item>
              )}
            </Descriptions>

            {/* Items */}
            <Card title="Order Items" size="small" style={{ marginTop: 16 }}>
              {selectedOrder.items.map((item) => (
                <Card.Grid key={item.id} style={{ width: '100%', padding: 16 }}>
                  <Row gutter={16} align="middle">
                    <Col span={4}>
                      <img src={item.image} alt={item.productName} style={{ width: '100%' }} />
                    </Col>
                    <Col span={12}>
                      <Text strong>{item.productName}</Text>
                      <br />
                      <Text type="secondary">Quantity: {item.quantity}</Text>
                    </Col>
                    <Col span={4}>
                      <Text strong>${item.price.toFixed(2)}</Text>
                    </Col>
                    <Col span={4}>
                      {selectedOrder.status === 'delivered' && (
                        <Button
                          type="link"
                          icon={<StarOutlined />}
                          onClick={() => handleReview(item)}
                        >
                          Review
                        </Button>
                      )}
                    </Col>
                  </Row>
                </Card.Grid>
              ))}
            </Card>

            {/* Shipping Address */}
            <Card title="Shipping Address" size="small" style={{ marginTop: 16 }}>
              <Paragraph>{selectedOrder.shippingAddress}</Paragraph>
            </Card>

            {/* Order Total */}
            <Card size="small" style={{ marginTop: 16 }}>
              <Descriptions column={1} size="small">
                <Descriptions.Item label="Subtotal">
                  ${selectedOrder.total.toFixed(2)}
                </Descriptions.Item>
                <Descriptions.Item label="Shipping">Free</Descriptions.Item>
                <Descriptions.Item label="Tax">
                  ${(selectedOrder.total * 0.08).toFixed(2)}
                </Descriptions.Item>
                <Descriptions.Item label={<Text strong>Total</Text>}>
                  <Text strong style={{ color: '#B12704', fontSize: 18 }}>
                    ${(selectedOrder.total * 1.08).toFixed(2)}
                  </Text>
                </Descriptions.Item>
              </Descriptions>
            </Card>

            {/* Actions */}
            <Space style={{ marginTop: 24, width: '100%', justifyContent: 'center' }}>
              <Button icon={<MessageOutlined />}>Contact Vendor</Button>
              <Button icon={<DownloadOutlined />}>Download Invoice</Button>
              {selectedOrder.status === 'delivered' && (
                <Button type="primary" icon={<RedoOutlined />}>
                  Reorder
                </Button>
              )}
            </Space>
          </div>
        )}
      </Drawer>

      {/* Review Modal */}
      <Modal
        title={`Review: ${selectedProduct?.productName}`}
        open={reviewModalVisible}
        onCancel={() => setReviewModalVisible(false)}
        footer={null}
      >
        <Form layout="vertical" onFinish={handleSubmitReview}>
          <Form.Item
            name="rating"
            label="Rating"
            rules={[{ required: true, message: 'Please provide a rating' }]}
          >
            <Rate />
          </Form.Item>

          <Form.Item
            name="review"
            label="Review"
            rules={[
              { required: true, message: 'Please write a review' },
              { min: 10, message: 'Review must be at least 10 characters' },
            ]}
          >
            <TextArea rows={4} placeholder="Share your experience with this product..." />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Submit Review
              </Button>
              <Button onClick={() => setReviewModalVisible(false)}>Cancel</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default OrdersPage;
