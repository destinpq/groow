import React, { useState, useEffect } from 'react';
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
  Spin,
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
import { ordersAPI, Order, OrderItem as APIOrderItem } from '@/services/api/orders';
import { productAPI } from '@/services/api/products';

const { Title, Text, Paragraph } = Typography;

interface OrderItem extends APIOrderItem {
  category?: string;
}

interface PastOrder {
  id: string;
  orderNumber: string;
  orderDate: string;
  totalAmount: number;
  items: OrderItem[];
  status: 'delivered' | 'cancelled' | 'pending' | 'confirmed' | 'processing' | 'shipped' | 'refunded';
}

interface FrequentItem {
  productId: string;
  productName: string;
  productImage: string;
  category: string;
  timesOrdered: number;
  lastOrdered: string;
  avgPrice: number;
  inStock: boolean;
}

const QuickReorderPage: React.FC = () => {
  const [orders, setOrders] = useState<PastOrder[]>([]);
  const [frequentItems, setFrequentItems] = useState<FrequentItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isReorderModalVisible, setIsReorderModalVisible] = useState<boolean>(false);
  const [reorderingOrder, setReorderingOrder] = useState<PastOrder | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await ordersAPI.getAll({ limit: 10 });
      
      // Transform orders to PastOrder format
      const pastOrders: PastOrder[] = response.data
        .filter(order => order.status === 'delivered' || order.status === 'cancelled')
        .map(order => ({
          id: order.id,
          orderNumber: order.orderNumber,
          orderDate: order.createdAt,
          totalAmount: order.total,
          items: order.items.map(item => ({
            ...item,
            category: 'General' // Can be enhanced with product API call
          })),
          status: order.status as 'delivered' | 'cancelled' | 'pending' | 'confirmed' | 'processing' | 'shipped' | 'refunded'
        }));

      setOrders(pastOrders);

      // Calculate frequent items from orders
      const itemFrequency = new Map<string, {
        count: number;
        lastDate: string;
        totalPrice: number;
        productName: string;
        productImage: string;
      }>();

      pastOrders.forEach(order => {
        order.items.forEach(item => {
          const existing = itemFrequency.get(item.productId) || {
            count: 0,
            lastDate: '',
            totalPrice: 0,
            productName: item.productName,
            productImage: item.productImage
          };
          
          existing.count += 1;
          existing.totalPrice += item.price;
          if (!existing.lastDate || order.orderDate > existing.lastDate) {
            existing.lastDate = order.orderDate;
          }
          
          itemFrequency.set(item.productId, existing);
        });
      });

      // Convert to FrequentItem array and sort by frequency
      const frequent: FrequentItem[] = Array.from(itemFrequency.entries())
        .map(([productId, data]) => ({
          productId,
          productName: data.productName,
          productImage: data.productImage,
          category: 'General',
          timesOrdered: data.count,
          lastOrdered: data.lastDate,
          avgPrice: data.totalPrice / data.count,
          inStock: true // Can be enhanced with product stock check
        }))
        .sort((a, b) => b.timesOrdered - a.timesOrdered)
        .slice(0, 10);

      setFrequentItems(frequent);
    } catch (error) {
      console.error('Failed to load orders:', error);
      message.error('Failed to load order history');
    } finally {
      setLoading(false);
    }
  };

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

  const handleToggleItem = (itemId: string) => {
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
    <Spin spinning={loading} tip="Loading orders...">
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
    </Spin>
  );
};

export default QuickReorderPage;
