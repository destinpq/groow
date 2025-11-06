import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Button,
  Table,
  Tag,
  Space,
  Switch,
  Modal,
  Form,
  Select,
  DatePicker,
  Statistic,
  Alert,
  Badge,
  Divider,
  Progress,
  message,
  Spin,
} from 'antd';
import {
  SyncOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  CalendarOutlined,
  DollarOutlined,
  ShoppingOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { subscriptionsAPI, type Subscription as APISubscription, type SubscriptionStats } from '@/services/api';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const SubscriptionsPage: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<APISubscription[]>([]);
  const [stats, setStats] = useState<SubscriptionStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState<APISubscription | null>(null);
  const [form] = Form.useForm();

  // Load subscriptions and stats on mount
  useEffect(() => {
    loadSubscriptions();
    loadStats();
  }, []);

  const loadSubscriptions = async () => {
    try {
      setLoading(true);
      const data = await subscriptionsAPI.getSubscriptions();
      setSubscriptions(data);
    } catch (error) {
      message.error('Failed to load subscriptions');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const data = await subscriptionsAPI.getStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const getFrequencyLabel = (frequency: string) => {
    const labels = {
      weekly: 'Every Week',
      biweekly: 'Every 2 Weeks',
      monthly: 'Every Month',
      quarterly: 'Every 3 Months',
    };
    return labels[frequency as keyof typeof labels] || frequency;
  };

  const getStatusTag = (status: string) => {
    const config = {
      active: { color: 'green', icon: <CheckCircleOutlined />, text: 'Active' },
      paused: { color: 'orange', icon: <PauseCircleOutlined />, text: 'Paused' },
      cancelled: { color: 'red', icon: <ClockCircleOutlined />, text: 'Cancelled' },
    };
    const { color, icon, text } = config[status as keyof typeof config];
    return (
      <Tag color={color} icon={icon}>
        {text}
      </Tag>
    );
  };

  const handleToggleStatus = async (subscription: APISubscription) => {
    try {
      const newStatus = subscription.status === 'active' ? 'paused' : 'active';
      await subscriptionsAPI.updateSubscription(subscription.id, { status: newStatus });
      await loadSubscriptions();
      message.success(`Subscription ${newStatus === 'active' ? 'resumed' : 'paused'}`);
    } catch (error) {
      message.error('Failed to update subscription');
    }
  };

  const handleEdit = (subscription: APISubscription) => {
    setEditingSubscription(subscription);
    form.setFieldsValue({
      frequency: subscription.frequency,
      quantity: subscription.quantity,
      nextDelivery: dayjs(subscription.nextDelivery),
    });
    setIsModalVisible(true);
  };

  const handleDelete = async (subscriptionId: string) => {
    Modal.confirm({
      title: 'Cancel Subscription',
      content: 'Are you sure you want to cancel this subscription? This action cannot be undone.',
      okText: 'Cancel Subscription',
      okType: 'danger',
      async onOk() {
        try {
          await subscriptionsAPI.cancelSubscription(subscriptionId);
          await loadSubscriptions();
          message.success('Subscription cancelled successfully');
        } catch (error) {
          message.error('Failed to cancel subscription');
        }
      },
    });
  };

  const handleSubmit = (values: any) => {
    if (editingSubscription) {
      setSubscriptions(
        subscriptions.map((sub) =>
          sub.id === editingSubscription.id
            ? {
                ...sub,
                frequency: values.frequency,
                quantity: values.quantity,
                nextDelivery: values.nextDelivery.format('YYYY-MM-DD'),
              }
            : sub
        )
      );
      message.success('Subscription updated successfully');
    }
    setIsModalVisible(false);
    setEditingSubscription(null);
    form.resetFields();
  };

  const columns: ColumnsType<APISubscription> = [
    {
      title: 'Product',
      key: 'product',
      width: 300,
      render: (_, record) => (
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <img
            src={record.productImage}
            alt={record.productName}
            style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 4 }}
          />
          <div>
            <Text strong>{record.productName}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: 12 }}>
              Since {new Date(record.startDate).toLocaleDateString()}
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: 'Frequency',
      dataIndex: 'frequency',
      key: 'frequency',
      render: (frequency) => (
        <Tag icon={<SyncOutlined />} color="blue">
          {getFrequencyLabel(frequency)}
        </Tag>
      ),
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (quantity) => <Text>{quantity}x</Text>,
    },
    {
      title: 'Price',
      key: 'price',
      render: (_, record) => (
        <div>
          <Text strong style={{ fontSize: 16, color: '#ff9900' }}>
            ${(record.pricePerUnit * record.quantity).toFixed(2)}
          </Text>
          {record.discount > 0 && (
            <div>
              <Tag color="green" style={{ fontSize: 11 }}>
                {record.discount}% OFF
              </Tag>
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Next Delivery',
      dataIndex: 'nextDelivery',
      key: 'nextDelivery',
      render: (date) => (
        <div>
          <CalendarOutlined /> {new Date(date).toLocaleDateString()}
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => getStatusTag(status),
    },
    {
      title: 'Orders',
      dataIndex: 'totalOrders',
      key: 'totalOrders',
      render: (total) => <Badge count={total} showZero style={{ backgroundColor: '#1890ff' }} />,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            size="small"
            icon={record.status === 'active' ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
            onClick={() => handleToggleStatus(record)}
          >
            {record.status === 'active' ? 'Pause' : 'Resume'}
          </Button>
          <Button size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Button
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={3}>
          <SyncOutlined spin style={{ color: '#1890ff' }} /> My Subscriptions
        </Title>
        <Paragraph type="secondary">
          Manage your recurring orders and never run out of your essentials
        </Paragraph>
      </div>

      {/* Statistics */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Active Subscriptions"
              value={stats?.active || 0}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Monthly Cost"
              value={stats?.monthlyCost || 0}
              prefix="$"
              precision={2}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Total Savings"
              value={stats?.totalSavings || 0}
              prefix="$"
              precision={2}
              valueStyle={{ color: '#ff9900' }}
              suffix={<Tag color="green">Lifetime</Tag>}
            />
          </Card>
        </Col>
      </Row>

      {/* Benefits */}
      <Alert
        message="Subscription Benefits"
        description={
          <div>
            <Space direction="vertical" size={4}>
              <Text>✓ Save up to 15% on recurring orders</Text>
              <Text>✓ Free shipping on all subscription deliveries</Text>
              <Text>✓ Skip, pause, or cancel anytime</Text>
              <Text>✓ Flexible delivery schedule</Text>
            </Space>
          </div>
        }
        type="success"
        showIcon
        closable
        style={{ marginBottom: 24 }}
      />

      {/* Subscriptions Table */}
      <Card title="Active & Paused Subscriptions">
        <Table
          columns={columns}
          dataSource={subscriptions}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>

      {/* Upcoming Deliveries */}
      <Card title="Upcoming Deliveries" style={{ marginTop: 24 }}>
        <Row gutter={16}>
          {subscriptions
            .filter((s) => s.status === 'active')
            .sort((a, b) => new Date(a.nextDelivery).getTime() - new Date(b.nextDelivery).getTime())
            .map((sub) => {
              const daysUntil = Math.ceil(
                (new Date(sub.nextDelivery).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
              );
              return (
                <Col xs={24} sm={12} md={8} key={sub.id} style={{ marginBottom: 16 }}>
                  <Card size="small">
                    <Text strong style={{ display: 'block', marginBottom: 8 }}>
                      {sub.productName}
                    </Text>
                    <Progress
                      percent={Math.max(0, 100 - (daysUntil / 30) * 100)}
                      strokeColor="#52c41a"
                      format={() => `${daysUntil} days`}
                    />
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      Next delivery: {new Date(sub.nextDelivery).toLocaleDateString()}
                    </Text>
                  </Card>
                </Col>
              );
            })}
        </Row>
      </Card>

      {/* Edit Modal */}
      <Modal
        title="Edit Subscription"
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingSubscription(null);
          form.resetFields();
        }}
        footer={null}
        width={500}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="frequency"
            label="Delivery Frequency"
            rules={[{ required: true, message: 'Please select frequency' }]}
          >
            <Select>
              <Option value="weekly">Every Week</Option>
              <Option value="biweekly">Every 2 Weeks</Option>
              <Option value="monthly">Every Month</Option>
              <Option value="quarterly">Every 3 Months</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="quantity"
            label="Quantity"
            rules={[{ required: true, message: 'Please enter quantity' }]}
          >
            <Select>
              {[1, 2, 3, 4, 5].map((num) => (
                <Option key={num} value={num}>
                  {num}x
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="nextDelivery"
            label="Next Delivery Date"
            rules={[{ required: true, message: 'Please select date' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Divider />

          <Form.Item style={{ marginBottom: 0 }}>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button
                onClick={() => {
                  setIsModalVisible(false);
                  setEditingSubscription(null);
                  form.resetFields();
                }}
              >
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                Update Subscription
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SubscriptionsPage;
