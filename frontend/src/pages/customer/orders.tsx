import React, { useState, useEffect } from 'react';
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
  Spin,
  Popconfirm,
} from 'antd';
import {
  SearchOutlined,
  EyeOutlined,
  DownloadOutlined,
  RedoOutlined,
  MessageOutlined,
  StarOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { history } from 'umi';
import { ordersAPI, type Order, type OrderItem } from '@/services/api/orders';
import { useCartStore } from '@/store/cartStore';
import dayjs, { Dayjs } from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;
const { TextArea } = Input;

const mockOrders: Order[] = [];

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<OrderItem | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchText, setSearchText] = useState('');
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null]>([null, null]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const { addItem } = useCartStore();

  // Fetch orders
  const fetchOrders = async (page = 1, pageSize = 10) => {
    try {
      setLoading(true);
      const filters: any = {
        page,
        limit: pageSize,
      };

      if (statusFilter !== 'all') {
        filters.status = statusFilter;
      }

      if (dateRange[0] && dateRange[1]) {
        filters.startDate = dateRange[0].toISOString();
        filters.endDate = dateRange[1].toISOString();
      }

      const response = await ordersAPI.getAll(filters);
      setOrders(Array.isArray(response?.data?.data) ? response.data.data : (Array.isArray(response?.data) ? response.data : []));
      setPagination({
        current: response.page,
        pageSize: response.limit,
        total: response.total,
      });
    } catch (error) {
      message.error('Failed to load orders');
      console.error('Fetch orders error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load orders on mount and when filters change
  useEffect(() => {
    fetchOrders(pagination.current, pagination.pageSize);
  }, [statusFilter, dateRange]);

  // Search functionality
  const handleSearch = (value: string) => {
    setSearchText(value);
    const filtered = orders.filter(
      (order) =>
        order.orderNumber.toLowerCase().includes(value.toLowerCase()) ||
        order.items.some((item) =>
          item.productName.toLowerCase().includes(value.toLowerCase())
        )
    );
    // In a real app, this would be server-side search
    if (value) {
      setOrders(filtered);
    } else {
      fetchOrders(pagination.current, pagination.pageSize);
    }
  };

  const getStatusColor = (status: Order['status']) => {
    const colors: Record<Order['status'], string> = {
      pending: 'blue',
      confirmed: 'cyan',
      processing: 'gold',
      shipped: 'purple',
      delivered: 'success',
      cancelled: 'error',
      refunded: 'warning',
    };
    return colors[status] || 'default';
  };

  const getStatusText = (status: Order['status']) => {
    const texts: Record<Order['status'], string> = {
      pending: 'Pending',
      confirmed: 'Confirmed',
      processing: 'Processing',
      shipped: 'Shipped',
      delivered: 'Delivered',
      cancelled: 'Cancelled',
      refunded: 'Refunded',
    };
    return texts[status] || status;
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setDrawerVisible(true);
  };

  const handleCancelOrder = async (order: Order) => {
    try {
      await ordersAPI.cancel(order.id, 'Customer requested cancellation');
      message.success('Order cancelled successfully');
      fetchOrders(pagination.current, pagination.pageSize);
      setDrawerVisible(false);
    } catch (error) {
      message.error('Failed to cancel order');
      console.error('Cancel order error:', error);
    }
  };

  const handleReorder = async (order: Order) => {
    try {
      // Add all order items to cart
      for (const item of order.items) {
        await addItem({
          productId: item.productId,
          quantity: item.quantity,
        });
      }
      message.success(`${order.items.length} item(s) added to cart!`);
      history.push('/cart');
    } catch (error) {
      message.error('Failed to add items to cart');
      console.error('Reorder error:', error);
    }
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
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => dayjs(date).format('MMM DD, YYYY'),
      sorter: (a, b) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
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
      render: (status: Order['status']) => (
        <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>
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
          {record.status === 'delivered' && (
            <Button
              type="link"
              icon={<RedoOutlined />}
              onClick={() => handleReorder(record)}
            >
              Reorder
            </Button>
          )}
          {(record.status === 'pending' || record.status === 'confirmed') && (
            <Popconfirm
              title="Cancel order?"
              description="Are you sure you want to cancel this order?"
              onConfirm={() => handleCancelOrder(record)}
              okText="Yes"
              cancelText="No"
            >
              <Button
                type="link"
                danger
                icon={<CloseCircleOutlined />}
              >
                Cancel
              </Button>
            </Popconfirm>
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
              onChange={(e) => handleSearch(e.target.value)}
              value={searchText}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Select
              placeholder="Filter by status"
              size="large"
              style={{ width: '100%' }}
              value={statusFilter}
              onChange={(value) => {
                setStatusFilter(value);
                setPagination({ ...pagination, current: 1 });
              }}
            >
              <Option value="all">All Orders</Option>
              <Option value="pending">Pending</Option>
              <Option value="confirmed">Confirmed</Option>
              <Option value="processing">Processing</Option>
              <Option value="shipped">Shipped</Option>
              <Option value="delivered">Delivered</Option>
              <Option value="cancelled">Cancelled</Option>
              <Option value="refunded">Refunded</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <RangePicker
              size="large"
              style={{ width: '100%' }}
              onChange={(dates) => {
                setDateRange(dates as [Dayjs | null, Dayjs | null]);
                setPagination({ ...pagination, current: 1 });
              }}
            />
          </Col>
        </Row>
      </Card>

      {/* Orders Table */}
      <Card>
        <Spin spinning={loading}>
          <Table
            columns={columns}
            dataSource={orders}
            rowKey="id"
            pagination={{
              ...pagination,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} orders`,
              onChange: (page, pageSize) => {
                fetchOrders(page, pageSize);
              },
            }}
          />
        </Spin>
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
                  selectedOrder.status === 'pending' ? 0 :
                  selectedOrder.status === 'confirmed' ? 1 :
                  selectedOrder.status === 'processing' || selectedOrder.status === 'shipped' ? 2 :
                  selectedOrder.status === 'delivered' ? 3 : 0
                }
                items={[
                  { title: 'Pending' },
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
                {dayjs(selectedOrder.createdAt).format('MMMM DD, YYYY h:mm A')}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={getStatusColor(selectedOrder.status)}>
                  {getStatusText(selectedOrder.status)}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Vendor ID">{selectedOrder.vendorId}</Descriptions.Item>
              <Descriptions.Item label="Payment Method">{selectedOrder.paymentMethod}</Descriptions.Item>
              <Descriptions.Item label="Payment Status">
                <Tag color={selectedOrder.paymentStatus === 'paid' ? 'success' : 'warning'}>
                  {selectedOrder.paymentStatus.toUpperCase()}
                </Tag>
              </Descriptions.Item>
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
                      <img src={item.productImage} alt={item.productName} style={{ width: '100%' }} />
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
              <Paragraph>
                {selectedOrder.shippingAddress.firstName} {selectedOrder.shippingAddress.lastName}<br />
                {selectedOrder.shippingAddress.address1}
                {selectedOrder.shippingAddress.address2 && <><br />{selectedOrder.shippingAddress.address2}</>}
                <br />
                {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zipCode}
                <br />
                {selectedOrder.shippingAddress.country}
                <br />
                Phone: {selectedOrder.shippingAddress.phone}
              </Paragraph>
            </Card>

            {/* Order Total */}
            <Card size="small" style={{ marginTop: 16 }}>
              <Descriptions column={1} size="small">
                <Descriptions.Item label="Subtotal">
                  ${selectedOrder.subtotal.toFixed(2)}
                </Descriptions.Item>
                <Descriptions.Item label="Shipping">
                  ${selectedOrder.shipping.toFixed(2)}
                </Descriptions.Item>
                <Descriptions.Item label="Tax">
                  ${selectedOrder.tax.toFixed(2)}
                </Descriptions.Item>
                {selectedOrder.discount > 0 && (
                  <Descriptions.Item label="Discount">
                    -${selectedOrder.discount.toFixed(2)}
                  </Descriptions.Item>
                )}
                <Descriptions.Item label={<Text strong>Total</Text>}>
                  <Text strong style={{ color: '#B12704', fontSize: 18 }}>
                    ${selectedOrder.total.toFixed(2)}
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
