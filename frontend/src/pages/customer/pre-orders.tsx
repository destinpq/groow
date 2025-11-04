import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Table,
  Space,
  Button,
  Tag,
  Modal,
  Form,
  InputNumber,
  message,
  Progress,
  Badge,
  Image,
  Tooltip,
  Alert,
  Divider,
  Steps,
} from 'antd';
import {
  ShoppingCartOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined,
  CalendarOutlined,
  TruckOutlined,
  DollarOutlined,
  HeartOutlined,
  HeartFilled,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { Step } = Steps;

interface PreOrderProduct {
  id: number;
  name: string;
  description: string;
  image: string;
  price: number;
  estimatedShipDate: string;
  releaseDate: string;
  preOrderEndDate: string;
  totalStock: number;
  preOrderedStock: number;
  depositAmount: number;
  depositPercentage: number;
  status: 'available' | 'soldout' | 'coming-soon';
  category: string;
  features: string[];
  isFavorite: boolean;
}

interface MyPreOrder {
  id: number;
  productId: number;
  productName: string;
  productImage: string;
  quantity: number;
  totalPrice: number;
  depositPaid: number;
  remainingAmount: number;
  orderDate: string;
  estimatedShipDate: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered';
  paymentStatus: 'deposit-paid' | 'full-paid' | 'pending';
}

const mockPreOrderProducts: PreOrderProduct[] = [
  {
    id: 1,
    name: 'iPhone 16 Pro Max',
    description: 'The latest flagship smartphone with revolutionary features',
    image: 'https://via.placeholder.com/300x200?text=iPhone+16+Pro',
    price: 1299,
    estimatedShipDate: dayjs().add(45, 'days').format('YYYY-MM-DD'),
    releaseDate: dayjs().add(30, 'days').format('YYYY-MM-DD'),
    preOrderEndDate: dayjs().add(25, 'days').format('YYYY-MM-DD'),
    totalStock: 500,
    preOrderedStock: 342,
    depositAmount: 260,
    depositPercentage: 20,
    status: 'available',
    category: 'Smartphones',
    features: ['A18 Pro chip', '48MP camera', 'Titanium design', '6.7" display'],
    isFavorite: true,
  },
  {
    id: 2,
    name: 'PlayStation 6',
    description: 'Next-gen gaming console with 8K support',
    image: 'https://via.placeholder.com/300x200?text=PlayStation+6',
    price: 599,
    estimatedShipDate: dayjs().add(60, 'days').format('YYYY-MM-DD'),
    releaseDate: dayjs().add(50, 'days').format('YYYY-MM-DD'),
    preOrderEndDate: dayjs().add(40, 'days').format('YYYY-MM-DD'),
    totalStock: 300,
    preOrderedStock: 280,
    depositAmount: 150,
    depositPercentage: 25,
    status: 'available',
    category: 'Gaming',
    features: ['8K gaming', 'Ray tracing', '2TB SSD', 'VR compatible'],
    isFavorite: false,
  },
  {
    id: 3,
    name: 'Samsung Galaxy S25 Ultra',
    description: 'Premium Android flagship with S Pen',
    image: 'https://via.placeholder.com/300x200?text=Galaxy+S25',
    price: 1199,
    estimatedShipDate: dayjs().add(35, 'days').format('YYYY-MM-DD'),
    releaseDate: dayjs().add(20, 'days').format('YYYY-MM-DD'),
    preOrderEndDate: dayjs().add(15, 'days').format('YYYY-MM-DD'),
    totalStock: 400,
    preOrderedStock: 400,
    depositAmount: 240,
    depositPercentage: 20,
    status: 'soldout',
    category: 'Smartphones',
    features: ['200MP camera', 'S Pen included', '5000mAh battery', 'Snapdragon 8 Gen 4'],
    isFavorite: false,
  },
  {
    id: 4,
    name: 'MacBook Pro M4',
    description: 'Professional laptop with M4 chip',
    image: 'https://via.placeholder.com/300x200?text=MacBook+Pro+M4',
    price: 2499,
    estimatedShipDate: dayjs().add(90, 'days').format('YYYY-MM-DD'),
    releaseDate: dayjs().add(75, 'days').format('YYYY-MM-DD'),
    preOrderEndDate: dayjs().add(70, 'days').format('YYYY-MM-DD'),
    totalStock: 200,
    preOrderedStock: 45,
    depositAmount: 500,
    depositPercentage: 20,
    status: 'coming-soon',
    category: 'Laptops',
    features: ['M4 Pro chip', '16" Liquid Retina XDR', '32GB RAM', '1TB SSD'],
    isFavorite: true,
  },
];

const mockMyPreOrders: MyPreOrder[] = [
  {
    id: 1,
    productId: 1,
    productName: 'iPhone 16 Pro Max',
    productImage: 'https://via.placeholder.com/60?text=iPhone',
    quantity: 1,
    totalPrice: 1299,
    depositPaid: 260,
    remainingAmount: 1039,
    orderDate: dayjs().subtract(5, 'days').format('YYYY-MM-DD'),
    estimatedShipDate: dayjs().add(40, 'days').format('YYYY-MM-DD'),
    status: 'confirmed',
    paymentStatus: 'deposit-paid',
  },
  {
    id: 2,
    productId: 2,
    productName: 'PlayStation 6',
    productImage: 'https://via.placeholder.com/60?text=PS6',
    quantity: 1,
    totalPrice: 599,
    depositPaid: 150,
    remainingAmount: 449,
    orderDate: dayjs().subtract(10, 'days').format('YYYY-MM-DD'),
    estimatedShipDate: dayjs().add(50, 'days').format('YYYY-MM-DD'),
    status: 'confirmed',
    paymentStatus: 'deposit-paid',
  },
];

const PreOrdersPage: React.FC = () => {
  const [products, setProducts] = useState<PreOrderProduct[]>(mockPreOrderProducts);
  const [myOrders] = useState<MyPreOrder[]>(mockMyPreOrders);
  const [isPreOrderModalVisible, setIsPreOrderModalVisible] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<PreOrderProduct | null>(null);
  const [form] = Form.useForm();

  const handlePreOrder = (product: PreOrderProduct) => {
    if (product.status === 'soldout') {
      message.warning('This product is sold out for pre-order');
      return;
    }
    if (product.status === 'coming-soon') {
      message.info('Pre-orders for this product will open soon');
      return;
    }
    setSelectedProduct(product);
    form.setFieldsValue({ quantity: 1 });
    setIsPreOrderModalVisible(true);
  };

  const handleSubmitPreOrder = (values: any) => {
    if (!selectedProduct) return;

    const totalPrice = selectedProduct.price * values.quantity;
    const depositAmount = selectedProduct.depositAmount * values.quantity;

    message.success(
      `Pre-order placed! Deposit of $${depositAmount} will be charged. Remaining $${totalPrice - depositAmount} due before shipping.`
    );
    setIsPreOrderModalVisible(false);
    form.resetFields();
  };

  const handleToggleFavorite = (productId: number) => {
    setProducts(
      products.map((p) =>
        p.id === productId ? { ...p, isFavorite: !p.isFavorite } : p
      )
    );
    const product = products.find((p) => p.id === productId);
    if (product) {
      message.success(product.isFavorite ? 'Removed from favorites' : 'Added to favorites');
    }
  };

  const myOrderColumns: ColumnsType<MyPreOrder> = [
    {
      title: 'Product',
      key: 'product',
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Image src={record.productImage} width={60} height={60} preview={false} />
          <div>
            <Text strong>{record.productName}</Text>
            <div>
              <Text type="secondary" style={{ fontSize: 12 }}>
                Qty: {record.quantity}
              </Text>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Order Date',
      dataIndex: 'orderDate',
      key: 'orderDate',
      render: (date) => <Text>{dayjs(date).format('MMM DD, YYYY')}</Text>,
    },
    {
      title: 'Est. Ship Date',
      dataIndex: 'estimatedShipDate',
      key: 'estimatedShipDate',
      render: (date) => (
        <div>
          <CalendarOutlined style={{ color: '#1890ff', marginRight: 4 }} />
          <Text>{dayjs(date).format('MMM DD, YYYY')}</Text>
        </div>
      ),
    },
    {
      title: 'Payment',
      key: 'payment',
      render: (_, record) => (
        <div>
          <div>
            <Text strong>${record.totalPrice}</Text>
          </div>
          <div>
            <Text type="secondary" style={{ fontSize: 12 }}>
              Deposit: ${record.depositPaid}
            </Text>
          </div>
          <div>
            <Text type="warning" style={{ fontSize: 12 }}>
              Remaining: ${record.remainingAmount}
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: 'Payment Status',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
      render: (status: MyPreOrder['paymentStatus']) => {
        const config: Record<MyPreOrder['paymentStatus'], { color: string; text: string }> = {
          'deposit-paid': { color: 'orange', text: 'Deposit Paid' },
          'full-paid': { color: 'green', text: 'Fully Paid' },
          pending: { color: 'red', text: 'Payment Pending' },
        };
        return <Tag color={config[status].color}>{config[status].text}</Tag>;
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: MyPreOrder['status']) => {
        const config: Record<MyPreOrder['status'], { color: string; text: string }> = {
          pending: { color: 'orange', text: 'Pending' },
          confirmed: { color: 'blue', text: 'Confirmed' },
          processing: { color: 'cyan', text: 'Processing' },
          shipped: { color: 'purple', text: 'Shipped' },
          delivered: { color: 'green', text: 'Delivered' },
        };
        return <Tag color={config[status].color}>{config[status].text}</Tag>;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          {record.paymentStatus === 'deposit-paid' && (
            <Button type="primary" size="small">
              Pay Remaining
            </Button>
          )}
          <Button size="small">Track Order</Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={3}>
          <ClockCircleOutlined style={{ color: '#fa8c16' }} /> Pre-Orders
        </Title>
        <Paragraph type="secondary">
          Reserve upcoming products and be among the first to receive them
        </Paragraph>
      </div>

      <Alert
        message="Pre-Order Benefits"
        description={
          <ul style={{ marginBottom: 0, paddingLeft: 20 }}>
            <li>Guaranteed availability - Reserve before stock runs out</li>
            <li>Low deposit required - Pay only 20-25% upfront</li>
            <li>Priority shipping - Be first in line when products launch</li>
            <li>Easy cancellation - Full refund up to 7 days before release</li>
          </ul>
        }
        type="info"
        icon={<InfoCircleOutlined />}
        style={{ marginBottom: 24 }}
      />

      <Title level={4} style={{ marginBottom: 16 }}>
        Available for Pre-Order
      </Title>

      <Row gutter={[16, 16]} style={{ marginBottom: 32 }}>
        {products.map((product) => {
          const stockPercentage = (product.preOrderedStock / product.totalStock) * 100;
          const daysUntilRelease = dayjs(product.releaseDate).diff(dayjs(), 'days');
          const daysUntilPreOrderEnd = dayjs(product.preOrderEndDate).diff(dayjs(), 'days');

          return (
            <Col xs={24} sm={12} lg={8} key={product.id}>
              <Badge.Ribbon
                text={
                  product.status === 'soldout'
                    ? 'Sold Out'
                    : product.status === 'coming-soon'
                    ? 'Coming Soon'
                    : `${daysUntilPreOrderEnd} days left`
                }
                color={
                  product.status === 'soldout'
                    ? 'red'
                    : product.status === 'coming-soon'
                    ? 'blue'
                    : 'orange'
                }
              >
                <Card
                  hoverable
                  cover={
                    <div style={{ position: 'relative' }}>
                      <Image src={product.image} preview={false} height={200} width="100%" style={{ objectFit: 'cover' }} />
                      <Button
                        type="text"
                        icon={product.isFavorite ? <HeartFilled style={{ color: '#ff4d4f' }} /> : <HeartOutlined />}
                        onClick={() => handleToggleFavorite(product.id)}
                        style={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          background: 'rgba(255, 255, 255, 0.9)',
                        }}
                      />
                    </div>
                  }
                >
                  <div style={{ marginBottom: 8 }}>
                    <Tag color="blue">{product.category}</Tag>
                  </div>

                  <Title level={5} style={{ marginBottom: 8 }}>
                    {product.name}
                  </Title>

                  <Paragraph type="secondary" ellipsis={{ rows: 2 }} style={{ marginBottom: 12 }}>
                    {product.description}
                  </Paragraph>

                  <div style={{ marginBottom: 12 }}>
                    {product.features.slice(0, 2).map((feature, index) => (
                      <Tag key={index} style={{ marginBottom: 4 }}>
                        {feature}
                      </Tag>
                    ))}
                  </div>

                  <Divider style={{ margin: '12px 0' }} />

                  <Row justify="space-between" align="middle" style={{ marginBottom: 8 }}>
                    <Col>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        Price
                      </Text>
                      <div>
                        <Text strong style={{ fontSize: 20, color: '#1890ff' }}>
                          ${product.price}
                        </Text>
                      </div>
                    </Col>
                    <Col>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        Deposit ({product.depositPercentage}%)
                      </Text>
                      <div>
                        <Text strong style={{ fontSize: 16 }}>
                          ${product.depositAmount}
                        </Text>
                      </div>
                    </Col>
                  </Row>

                  <div style={{ marginBottom: 12 }}>
                    <Row justify="space-between" align="middle" style={{ marginBottom: 4 }}>
                      <Col>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          Pre-orders: {product.preOrderedStock}/{product.totalStock}
                        </Text>
                      </Col>
                      <Col>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          {stockPercentage.toFixed(0)}%
                        </Text>
                      </Col>
                    </Row>
                    <Progress
                      percent={stockPercentage}
                      showInfo={false}
                      strokeColor={stockPercentage >= 90 ? '#ff4d4f' : '#52c41a'}
                    />
                  </div>

                  <Space direction="vertical" size="small" style={{ width: '100%', marginBottom: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <CalendarOutlined style={{ color: '#1890ff' }} />
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        Release: {dayjs(product.releaseDate).format('MMM DD, YYYY')} ({daysUntilRelease} days)
                      </Text>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <TruckOutlined style={{ color: '#52c41a' }} />
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        Ships: {dayjs(product.estimatedShipDate).format('MMM DD, YYYY')}
                      </Text>
                    </div>
                  </Space>

                  <Button
                    type="primary"
                    block
                    icon={<ShoppingCartOutlined />}
                    onClick={() => handlePreOrder(product)}
                    disabled={product.status === 'soldout'}
                  >
                    {product.status === 'soldout'
                      ? 'Sold Out'
                      : product.status === 'coming-soon'
                      ? 'Coming Soon'
                      : 'Pre-Order Now'}
                  </Button>
                </Card>
              </Badge.Ribbon>
            </Col>
          );
        })}
      </Row>

      <Title level={4} style={{ marginBottom: 16 }}>
        My Pre-Orders
      </Title>

      <Card>
        <Table columns={myOrderColumns} dataSource={myOrders} rowKey="id" scroll={{ x: 1000 }} />
      </Card>

      <Modal
        title="Place Pre-Order"
        open={isPreOrderModalVisible}
        onCancel={() => setIsPreOrderModalVisible(false)}
        footer={null}
        width={600}
      >
        {selectedProduct && (
          <div>
            <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
              <Image src={selectedProduct.image} width={120} height={120} preview={false} />
              <div style={{ flex: 1 }}>
                <Title level={5} style={{ marginBottom: 4 }}>
                  {selectedProduct.name}
                </Title>
                <Paragraph type="secondary" ellipsis={{ rows: 2 }}>
                  {selectedProduct.description}
                </Paragraph>
                <div>
                  <Text strong style={{ fontSize: 18, color: '#1890ff' }}>
                    ${selectedProduct.price}
                  </Text>
                </div>
              </div>
            </div>

            <Steps current={0} size="small" style={{ marginBottom: 24 }}>
              <Step title="Place Order" icon={<ShoppingCartOutlined />} />
              <Step title="Pay Deposit" icon={<DollarOutlined />} />
              <Step title="Await Release" icon={<ClockCircleOutlined />} />
              <Step title="Pay Balance" icon={<DollarOutlined />} />
              <Step title="Receive Product" icon={<CheckCircleOutlined />} />
            </Steps>

            <Alert
              message="Payment Schedule"
              description={
                <div>
                  <div style={{ marginBottom: 8 }}>
                    <Text strong>Today:</Text> Pay ${selectedProduct.depositAmount} deposit ({selectedProduct.depositPercentage}%)
                  </div>
                  <div>
                    <Text strong>Before Shipping:</Text> Pay remaining $
                    {selectedProduct.price - selectedProduct.depositAmount} balance
                  </div>
                </div>
              }
              type="info"
              style={{ marginBottom: 24 }}
            />

            <Form form={form} layout="vertical" onFinish={handleSubmitPreOrder}>
              <Form.Item
                label="Quantity"
                name="quantity"
                rules={[{ required: true, message: 'Please enter quantity' }]}
              >
                <InputNumber
                  min={1}
                  max={5}
                  style={{ width: '100%' }}
                  onChange={(value) => {
                    if (value) {
                      const total = selectedProduct.price * value;
                      const deposit = selectedProduct.depositAmount * value;
                      form.setFieldsValue({
                        totalPrice: total,
                        depositAmount: deposit,
                        remainingAmount: total - deposit,
                      });
                    }
                  }}
                />
              </Form.Item>

              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item label="Total Price" name="totalPrice">
                    <InputNumber
                      value={selectedProduct.price}
                      disabled
                      style={{ width: '100%' }}
                      prefix="$"
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Deposit (Due Now)" name="depositAmount">
                    <InputNumber
                      value={selectedProduct.depositAmount}
                      disabled
                      style={{ width: '100%' }}
                      prefix="$"
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Remaining Amount" name="remainingAmount">
                    <InputNumber
                      value={selectedProduct.price - selectedProduct.depositAmount}
                      disabled
                      style={{ width: '100%' }}
                      prefix="$"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <div style={{ background: '#f0f2f5', padding: 16, borderRadius: 4, marginBottom: 16 }}>
                <Text strong style={{ display: 'block', marginBottom: 8 }}>
                  Important Dates:
                </Text>
                <div style={{ marginBottom: 4 }}>
                  <CalendarOutlined style={{ marginRight: 8 }} />
                  <Text type="secondary">
                    Release Date: {dayjs(selectedProduct.releaseDate).format('MMMM DD, YYYY')}
                  </Text>
                </div>
                <div style={{ marginBottom: 4 }}>
                  <TruckOutlined style={{ marginRight: 8 }} />
                  <Text type="secondary">
                    Estimated Ship: {dayjs(selectedProduct.estimatedShipDate).format('MMMM DD, YYYY')}
                  </Text>
                </div>
                <div>
                  <ClockCircleOutlined style={{ marginRight: 8 }} />
                  <Text type="secondary">
                    Pre-order Ends: {dayjs(selectedProduct.preOrderEndDate).format('MMMM DD, YYYY')}
                  </Text>
                </div>
              </div>

              <Alert
                message="Cancellation Policy"
                description="Full refund available up to 7 days before the release date. After that, a 10% cancellation fee applies."
                type="warning"
                showIcon
                style={{ marginBottom: 16 }}
              />

              <Form.Item>
                <Space>
                  <Button type="primary" htmlType="submit" icon={<ShoppingCartOutlined />}>
                    Confirm Pre-Order
                  </Button>
                  <Button onClick={() => setIsPreOrderModalVisible(false)}>Cancel</Button>
                </Space>
              </Form.Item>
            </Form>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PreOrdersPage;
