import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Button,
  List,
  Space,
  Tag,
  Image,
  message,
  Divider,
  Statistic,
  Badge,
  Tooltip,
  Modal,
  Checkbox,
  Empty,
  Alert,
} from 'antd';
import {
  ShoppingCartOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  HeartOutlined,
  ThunderboltOutlined,
  CalendarOutlined,
  DollarOutlined,
  RocketOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;

interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
  category: string;
}

interface PastOrder {
  id: number;
  orderNumber: string;
  orderDate: string;
  totalAmount: number;
  items: OrderItem[];
  status: 'delivered' | 'cancelled';
}

interface FrequentItem {
  productId: number;
  productName: string;
  productImage: string;
  category: string;
  timesOrdered: number;
  lastOrdered: string;
  avgPrice: number;
  inStock: boolean;
}

const mockPastOrders: PastOrder[] = [
  {
    id: 1,
    orderNumber: '#12345',
    orderDate: dayjs().subtract(30, 'days').format('YYYY-MM-DD'),
    totalAmount: 299.99,
    status: 'delivered',
    items: [
      {
        id: 1,
        productId: 101,
        productName: 'Wireless Headphones',
        productImage: 'https://via.placeholder.com/80x80?text=Headphones',
        quantity: 1,
        price: 299.99,
        category: 'Electronics',
      },
    ],
  },
  {
    id: 2,
    orderNumber: '#12340',
    orderDate: dayjs().subtract(60, 'days').format('YYYY-MM-DD'),
    totalAmount: 149.99,
    status: 'delivered',
    items: [
      {
        id: 2,
        productId: 102,
        productName: 'Coffee Maker',
        productImage: 'https://via.placeholder.com/80x80?text=Coffee',
        quantity: 1,
        price: 89.99,
        category: 'Home',
      },
      {
        id: 3,
        productId: 103,
        productName: 'Coffee Beans (1kg)',
        productImage: 'https://via.placeholder.com/80x80?text=Beans',
        quantity: 2,
        price: 29.99,
        category: 'Groceries',
      },
    ],
  },
  {
    id: 3,
    orderNumber: '#12335',
    orderDate: dayjs().subtract(90, 'days').format('YYYY-MM-DD'),
    totalAmount: 199.99,
    status: 'delivered',
    items: [
      {
        id: 4,
        productId: 104,
        productName: 'Yoga Mat',
        productImage: 'https://via.placeholder.com/80x80?text=Yoga',
        quantity: 1,
        price: 49.99,
        category: 'Sports',
      },
      {
        id: 5,
        productId: 103,
        productName: 'Coffee Beans (1kg)',
        productImage: 'https://via.placeholder.com/80x80?text=Beans',
        quantity: 5,
        price: 29.99,
        category: 'Groceries',
      },
    ],
  },
];

const mockFrequentItems: FrequentItem[] = [
  {
    productId: 103,
    productName: 'Coffee Beans (1kg)',
    productImage: 'https://via.placeholder.com/120x120?text=Beans',
    category: 'Groceries',
    timesOrdered: 7,
    lastOrdered: dayjs().subtract(20, 'days').format('YYYY-MM-DD'),
    avgPrice: 29.99,
    inStock: true,
  },
  {
    productId: 105,
    productName: 'Printer Paper (500 sheets)',
    productImage: 'https://via.placeholder.com/120x120?text=Paper',
    category: 'Office',
    timesOrdered: 5,
    lastOrdered: dayjs().subtract(15, 'days').format('YYYY-MM-DD'),
    avgPrice: 12.99,
    inStock: true,
  },
  {
    productId: 106,
    productName: 'Hand Soap Refill',
    productImage: 'https://via.placeholder.com/120x120?text=Soap',
    category: 'Personal Care',
    timesOrdered: 4,
    lastOrdered: dayjs().subtract(10, 'days').format('YYYY-MM-DD'),
    avgPrice: 8.99,
    inStock: false,
  },
];

const QuickReorderPage: React.FC = () => {
  const [orders] = useState<PastOrder[]>(mockPastOrders);
  const [frequentItems] = useState<FrequentItem[]>(mockFrequentItems);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [isReorderModalVisible, setIsReorderModalVisible] = useState<boolean>(false);
  const [reorderingOrder, setReorderingOrder] = useState<PastOrder | null>(null);

  const handleReorderEntireOrder = (order: PastOrder) => {
    setReorderingOrder(order);
    setSelectedItems(order.items.map(item => item.id));
    setIsReorderModalVisible(true);
  };

  const handleConfirmReorder = () => {
    const itemCount = selectedItems.length;
    message.success({
      content: `✅ ${itemCount} ${itemCount === 1 ? 'item' : 'items'} added to cart!`,
      duration: 3,
    });
    setIsReorderModalVisible(false);
    setReorderingOrder(null);
    setSelectedItems([]);
  };

  const handleQuickAddItem = (item: FrequentItem) => {
    if (!item.inStock) {
      message.warning('This item is currently out of stock');
      return;
    }
    message.success(`${item.productName} added to cart!`);
  };

  const handleToggleItem = (itemId: number) => {
    setSelectedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const totalPastOrders = orders.length;
  const totalSpent = orders
    .filter(o => o.status === 'delivered')
    .reduce((sum, o) => sum + o.totalAmount, 0);
  const avgOrderValue = totalPastOrders > 0 ? totalSpent / totalPastOrders : 0;

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={3}>
            <ThunderboltOutlined style={{ color: '#1890ff' }} /> Quick Reorder
          </Title>
          <Paragraph type="secondary">
            Reorder your favorite products with one click
          </Paragraph>
        </Col>
      </Row>

      <Alert
        message="⚡ Quick Reorder saves you time!"
        description="Easily reorder items from your past purchases or frequently bought products."
        type="info"
        showIcon={false}
        closable
        style={{ marginBottom: 24 }}
      />

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Past Orders"
              value={totalPastOrders}
              prefix={<ShoppingCartOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Total Spent"
              value={totalSpent}
              prefix="$"
              precision={2}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Avg Order Value"
              value={avgOrderValue}
              prefix="$"
              precision={2}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Card
            title={
              <Space>
                <ClockCircleOutlined />
                <span>Recent Orders</span>
              </Space>
            }
          >
            <List
              dataSource={orders}
              locale={{ emptyText: 'No past orders found' }}
              renderItem={(order) => (
                <List.Item
                  actions={[
                    <Button
                      type="primary"
                      icon={<RocketOutlined />}
                      onClick={() => handleReorderEntireOrder(order)}
                    >
                      Reorder All
                    </Button>,
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <div
                        style={{
                          width: 60,
                          height: 60,
                          borderRadius: 8,
                          background: '#1890ff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <ShoppingCartOutlined style={{ fontSize: 28, color: '#fff' }} />
                      </div>
                    }
                    title={
                      <Space>
                        <Text strong>Order {order.orderNumber}</Text>
                        <Tag color={order.status === 'delivered' ? 'success' : 'default'}>
                          {order.status.toUpperCase()}
                        </Tag>
                      </Space>
                    }
                    description={
                      <Space direction="vertical" style={{ width: '100%' }} size="small">
                        <div>
                          <Text type="secondary">
                            <CalendarOutlined /> {dayjs(order.orderDate).format('MMM DD, YYYY')}
                          </Text>
                          <Text type="secondary" style={{ marginLeft: 16 }}>
                            <DollarOutlined /> ${order.totalAmount.toFixed(2)}
                          </Text>
                        </div>

                        <div>
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                          </Text>
                        </div>

                        <Divider style={{ margin: '8px 0' }} />

                        <div>
                          <Space wrap size="small">
                            {order.items.map((item) => (
                              <Tooltip key={item.id} title={item.productName}>
                                <Image
                                  src={item.productImage}
                                  width={40}
                                  height={40}
                                  preview={false}
                                  style={{ borderRadius: 4, border: '1px solid #d9d9d9' }}
                                />
                              </Tooltip>
                            ))}
                          </Space>
                        </div>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card
            title={
              <Space>
                <HeartOutlined />
                <span>Frequently Ordered</span>
              </Space>
            }
          >
            <List
              dataSource={frequentItems}
              locale={{ emptyText: 'No frequent items yet' }}
              renderItem={(item) => (
                <List.Item
                  style={{
                    opacity: item.inStock ? 1 : 0.6,
                  }}
                >
                  <List.Item.Meta
                    avatar={
                      <Badge count={item.timesOrdered} color="#1890ff">
                        <Image
                          src={item.productImage}
                          width={60}
                          height={60}
                          preview={false}
                          style={{ borderRadius: 8 }}
                        />
                      </Badge>
                    }
                    title={
                      <div>
                        <Text strong ellipsis>
                          {item.productName}
                        </Text>
                        {!item.inStock && (
                          <Tag color="error" style={{ marginLeft: 8 }}>
                            Out of Stock
                          </Tag>
                        )}
                      </div>
                    }
                    description={
                      <Space direction="vertical" size="small" style={{ width: '100%' }}>
                        <div>
                          <Text strong style={{ fontSize: 16, color: '#1890ff' }}>
                            ${item.avgPrice.toFixed(2)}
                          </Text>
                        </div>

                        <div>
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            Ordered {item.timesOrdered} times
                          </Text>
                        </div>

                        <div>
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            Last: {dayjs(item.lastOrdered).format('MMM DD, YYYY')}
                          </Text>
                        </div>

                        <Button
                          type="primary"
                          size="small"
                          icon={<ShoppingCartOutlined />}
                          onClick={() => handleQuickAddItem(item)}
                          disabled={!item.inStock}
                          block
                        >
                          {item.inStock ? 'Quick Add' : 'Unavailable'}
                        </Button>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      <Modal
        title={
          <Space>
            <RocketOutlined />
            <span>Reorder Items</span>
          </Space>
        }
        open={isReorderModalVisible}
        onCancel={() => {
          setIsReorderModalVisible(false);
          setReorderingOrder(null);
          setSelectedItems([]);
        }}
        footer={[
          <Button
            key="cancel"
            onClick={() => {
              setIsReorderModalVisible(false);
              setReorderingOrder(null);
              setSelectedItems([]);
            }}
          >
            Cancel
          </Button>,
          <Button
            key="reorder"
            type="primary"
            icon={<ShoppingCartOutlined />}
            onClick={handleConfirmReorder}
            disabled={selectedItems.length === 0}
          >
            Add {selectedItems.length} {selectedItems.length === 1 ? 'Item' : 'Items'} to Cart
          </Button>,
        ]}
        width={600}
      >
        {reorderingOrder && (
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            <Alert
              message="Select items to reorder"
              description="Choose which items from this order you'd like to add to your cart."
              type="info"
              showIcon
            />

            <List
              dataSource={reorderingOrder.items}
              renderItem={(item) => {
                const isSelected = selectedItems.includes(item.id);
                return (
                  <List.Item
                    style={{
                      background: isSelected ? '#e6f7ff' : 'transparent',
                      padding: 12,
                      borderRadius: 8,
                      marginBottom: 8,
                      cursor: 'pointer',
                    }}
                    onClick={() => handleToggleItem(item.id)}
                  >
                    <List.Item.Meta
                      avatar={
                        <Checkbox
                          checked={isSelected}
                          onChange={() => handleToggleItem(item.id)}
                        />
                      }
                      title={
                        <Space>
                          <Image
                            src={item.productImage}
                            width={60}
                            height={60}
                            preview={false}
                            style={{ borderRadius: 8 }}
                          />
                          <div>
                            <div>
                              <Text strong>{item.productName}</Text>
                            </div>
                            <div>
                              <Text type="secondary" style={{ fontSize: 12 }}>
                                Quantity: {item.quantity}
                              </Text>
                            </div>
                            <div>
                              <Text strong style={{ fontSize: 16, color: '#1890ff' }}>
                                ${item.price.toFixed(2)}
                              </Text>
                            </div>
                          </div>
                        </Space>
                      }
                    />
                    {isSelected && (
                      <CheckCircleOutlined style={{ fontSize: 20, color: '#52c41a' }} />
                    )}
                  </List.Item>
                );
              }}
            />

            <Divider />

            <div>
              <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                <Text strong>Selected Items:</Text>
                <Text strong style={{ fontSize: 16 }}>
                  {selectedItems.length} / {reorderingOrder.items.length}
                </Text>
              </Space>

              <div style={{ marginTop: 8 }}>
                <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                  <Text strong>Estimated Total:</Text>
                  <Text strong style={{ fontSize: 20, color: '#1890ff' }}>
                    $
                    {reorderingOrder.items
                      .filter(item => selectedItems.includes(item.id))
                      .reduce((sum, item) => sum + item.price * item.quantity, 0)
                      .toFixed(2)}
                  </Text>
                </Space>
              </div>
            </div>
          </Space>
        )}
      </Modal>
    </div>
  );
};

export default QuickReorderPage;
