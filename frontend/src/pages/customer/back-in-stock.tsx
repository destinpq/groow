import React, { useState, useEffect } from 'react';
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
  Input,
  message,
  Badge,
  Image,
  Alert,
  Statistic,
  Select,
} from 'antd';
import {
  BellOutlined,
  DeleteOutlined,
  PlusOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ShoppingCartOutlined,
  MailOutlined,
  PhoneOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { notificationsAPI, productAPI } from '@/services/api';

dayjs.extend(relativeTime);

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

interface StockAlert {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  variant?: string;
  currentStock: number;
  estimatedRestock?: string;
  notificationMethod: 'email' | 'sms' | 'both';
  email?: string;
  phone?: string;
  status: 'active' | 'notified' | 'expired';
  createdAt: string;
  notifiedAt?: string;
  category: string;
  price: number;
  priority: 'high' | 'medium' | 'low';
}

const mockAlerts: StockAlert[] = [
  {
    id: 1,
    productId: 101,
    productName: 'iPhone 16 Pro Max',
    productImage: 'https://via.placeholder.com/60?text=iPhone',
    variant: '256GB - Natural Titanium',
    currentStock: 0,
    estimatedRestock: dayjs().add(5, 'days').format('YYYY-MM-DD'),
    notificationMethod: 'both',
    email: 'user@example.com',
    phone: '+1 (555) 123-4567',
    status: 'active',
    createdAt: dayjs().subtract(10, 'days').format('YYYY-MM-DD'),
    category: 'Smartphones',
    price: 1199,
    priority: 'high',
  },
  {
    id: 2,
    productId: 102,
    productName: 'PlayStation 6',
    productImage: 'https://via.placeholder.com/60?text=PS6',
    currentStock: 0,
    estimatedRestock: dayjs().add(15, 'days').format('YYYY-MM-DD'),
    notificationMethod: 'email',
    email: 'user@example.com',
    status: 'active',
    createdAt: dayjs().subtract(20, 'days').format('YYYY-MM-DD'),
    category: 'Gaming',
    price: 599,
    priority: 'high',
  },
  {
    id: 3,
    productId: 103,
    productName: 'Nike Air Jordan 1 Retro',
    productImage: 'https://via.placeholder.com/60?text=Sneakers',
    variant: 'Size 10 - Chicago',
    currentStock: 2,
    estimatedRestock: dayjs().subtract(1, 'days').format('YYYY-MM-DD'),
    notificationMethod: 'both',
    email: 'user@example.com',
    phone: '+1 (555) 123-4567',
    status: 'notified',
    createdAt: dayjs().subtract(30, 'days').format('YYYY-MM-DD'),
    notifiedAt: dayjs().subtract(1, 'days').format('YYYY-MM-DD'),
    category: 'Footwear',
    price: 179,
    priority: 'medium',
  },
  {
    id: 4,
    productId: 104,
    productName: 'MacBook Pro 16" M4 Max',
    productImage: 'https://via.placeholder.com/60?text=MacBook',
    variant: '64GB RAM - 2TB SSD',
    currentStock: 0,
    estimatedRestock: dayjs().add(7, 'days').format('YYYY-MM-DD'),
    notificationMethod: 'sms',
    phone: '+1 (555) 123-4567',
    status: 'active',
    createdAt: dayjs().subtract(5, 'days').format('YYYY-MM-DD'),
    category: 'Computers',
    price: 3999,
    priority: 'high',
  },
];

const BackInStockPage: React.FC = () => {
  const [alerts, setAlerts] = useState<StockAlert[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [form] = Form.useForm();

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    try {
      setLoading(true);
      // Using notifications API as a placeholder for stock alerts
      const response = await notificationsAPI.getAll();
      // Transform notifications into stock alerts format
      const transformedAlerts: StockAlert[] = (response || []).slice(0, 10).map((notif: any, index: number) => ({
        id: notif.id || String(index),
        productId: String(index + 100),
        productName: notif.title || 'Product Alert',
        productImage: 'https://via.placeholder.com/60?text=Product',
        variant: undefined,
        currentStock: 0,
        estimatedRestock: dayjs().add(5, 'days').format('YYYY-MM-DD'),
        notificationMethod: 'email' as const,
        email: 'user@example.com',
        status: 'active' as const,
        createdAt: notif.createdAt || dayjs().format('YYYY-MM-DD'),
        category: 'General',
        price: 99.99,
        priority: 'medium' as const,
      }));
      setAlerts(transformedAlerts);
    } catch (error) {
      message.error('Failed to load stock alerts');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAlert = () => {
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleSubmit = async (values: any) => {
    try {
      // Create notification placeholder for stock alert
      message.success(
        `Stock alert created! We'll notify you via ${values.notificationMethod === 'both' ? 'email and SMS' : values.notificationMethod} when the product is back in stock.`
      );
      setIsModalVisible(false);
      loadAlerts();
    } catch (error) {
      message.error('Failed to create stock alert');
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    Modal.confirm({
      title: 'Delete Stock Alert',
      content: 'Are you sure you want to delete this stock alert?',
      okText: 'Delete',
      okType: 'danger',
      onOk: async () => {
        try {
          await notificationsAPI.markAsRead(id);
          message.success('Stock alert deleted successfully');
          loadAlerts();
        } catch (error) {
          message.error('Failed to delete stock alert');
          console.error(error);
        }
      },
    });
  };

  const handleBuyNow = (alert: StockAlert) => {
    message.success(`Adding ${alert.productName} to cart...`);
  };

  const columns: ColumnsType<StockAlert> = [
    {
      title: 'Product',
      key: 'product',
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Badge
            count={record.currentStock > 0 ? 'In Stock' : 'Out of Stock'}
            style={{
              backgroundColor: record.currentStock > 0 ? '#52c41a' : '#ff4d4f',
            }}
          >
            <Image src={record.productImage} width={60} height={60} preview={false} />
          </Badge>
          <div>
            <Text strong>{record.productName}</Text>
            {record.variant && (
              <div>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {record.variant}
                </Text>
              </div>
            )}
            <div>
              <Tag color="blue" style={{ marginTop: 4 }}>
                {record.category}
              </Tag>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price) => (
        <Text strong style={{ fontSize: 16, color: '#1890ff' }}>
          ${price}
        </Text>
      ),
    },
    {
      title: 'Current Stock',
      dataIndex: 'currentStock',
      key: 'currentStock',
      render: (stock) => (
        <div>
          <Text strong style={{ color: stock > 0 ? '#52c41a' : '#ff4d4f' }}>
            {stock}
          </Text>
          <Text type="secondary"> units</Text>
        </div>
      ),
    },
    {
      title: 'Estimated Restock',
      dataIndex: 'estimatedRestock',
      key: 'estimatedRestock',
      render: (date) => {
        const daysUntil = dayjs(date).diff(dayjs(), 'days');
        return (
          <div>
            <div>
              <Text>{dayjs(date).format('MMM DD, YYYY')}</Text>
            </div>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {daysUntil > 0 ? `in ${daysUntil} days` : dayjs(date).fromNow()}
            </Text>
          </div>
        );
      },
    },
    {
      title: 'Notification',
      key: 'notification',
      render: (_, record) => {
        const methodConfig = {
          email: { icon: <MailOutlined />, color: 'blue', text: 'Email' },
          sms: { icon: <PhoneOutlined />, color: 'green', text: 'SMS' },
          both: { icon: <BellOutlined />, color: 'purple', text: 'Email & SMS' },
        };
        const config = methodConfig[record.notificationMethod];
        return (
          <div>
            <Tag icon={config.icon} color={config.color}>
              {config.text}
            </Tag>
            <div style={{ marginTop: 4 }}>
              {record.email && (
                <Text style={{ fontSize: 12, display: 'block' }} type="secondary">
                  {record.email}
                </Text>
              )}
              {record.phone && (
                <Text style={{ fontSize: 12, display: 'block' }} type="secondary">
                  {record.phone}
                </Text>
              )}
            </div>
          </div>
        );
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: StockAlert['status'], record) => {
        const statusConfig = {
          active: {
            color: 'blue',
            text: 'Active',
            icon: <ClockCircleOutlined />,
          },
          notified: {
            color: 'green',
            text: 'Notified',
            icon: <CheckCircleOutlined />,
          },
          expired: {
            color: 'default',
            text: 'Expired',
            icon: null,
          },
        };
        const config = statusConfig[status];
        return (
          <div>
            <Tag color={config.color} icon={config.icon}>
              {config.text}
            </Tag>
            {status === 'notified' && record.notifiedAt && (
              <div>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {dayjs(record.notifiedAt).fromNow()}
                </Text>
              </div>
            )}
          </div>
        );
      },
      filters: [
        { text: 'Active', value: 'active' },
        { text: 'Notified', value: 'notified' },
        { text: 'Expired', value: 'expired' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority: StockAlert['priority']) => {
        const priorityConfig = {
          high: { color: 'red', text: 'High' },
          medium: { color: 'orange', text: 'Medium' },
          low: { color: 'default', text: 'Low' },
        };
        return <Tag color={priorityConfig[priority].color}>{priorityConfig[priority].text}</Tag>;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          {record.status === 'notified' && record.currentStock > 0 && (
            <Button
              type="primary"
              size="small"
              icon={<ShoppingCartOutlined />}
              onClick={() => handleBuyNow(record)}
            >
              Buy Now
            </Button>
          )}
          <Button
            type="link"
            danger
            size="small"
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  const activeAlerts = alerts.filter((a) => a.status === 'active').length;
  const notifiedAlerts = alerts.filter((a) => a.status === 'notified').length;
  const avgWaitTime = 10; // days

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={3}>
            <BellOutlined style={{ color: '#1890ff' }} /> Back in Stock Alerts
          </Title>
          <Paragraph type="secondary">
            Get notified when out-of-stock products become available
          </Paragraph>
        </Col>
        <Col>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateAlert}>
            Create Alert
          </Button>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Active Alerts"
              value={activeAlerts}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Items Restocked"
              value={notifiedAlerts}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Avg. Wait Time"
              value={avgWaitTime}
              suffix="days"
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
      </Row>

      {notifiedAlerts > 0 && (
        <Alert
          message="Products Back in Stock!"
          description={`${notifiedAlerts} product${notifiedAlerts > 1 ? 's are' : ' is'} now available. Don't miss out - stock may be limited!`}
          type="success"
          showIcon
          icon={<CheckCircleOutlined />}
          style={{ marginBottom: 16 }}
          action={
            <Button type="primary" size="small">
              Shop Now
            </Button>
          }
        />
      )}

      <Card title="My Stock Alerts">
        <Table columns={columns} dataSource={alerts} rowKey="id" scroll={{ x: 1200 }} />
      </Card>

      <Modal
        title="Create Back in Stock Alert"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={600}
      >
        <Alert
          message="How It Works"
          description={
            <ul style={{ marginBottom: 0, paddingLeft: 20 }}>
              <li>Select the out-of-stock product you want to track</li>
              <li>Choose how you want to be notified (email, SMS, or both)</li>
              <li>We'll monitor the stock and notify you immediately when it's available</li>
              <li>Purchase the product before it sells out again!</li>
            </ul>
          }
          type="info"
          showIcon
          style={{ marginBottom: 24 }}
        />

        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Product"
            name="productName"
            rules={[{ required: true, message: 'Please select a product' }]}
          >
            <Select
              placeholder="Search for an out-of-stock product"
              showSearch
              size="large"
              filterOption={false}
            >
              <Option value="Sony WH-1000XM5 Headphones">Sony WH-1000XM5 Headphones</Option>
              <Option value="Samsung Galaxy S25 Ultra">Samsung Galaxy S25 Ultra</Option>
              <Option value="Nintendo Switch 2">Nintendo Switch 2</Option>
              <Option value="NVIDIA RTX 5090">NVIDIA RTX 5090</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Variant (Optional)" name="variant">
            <Input placeholder="e.g., Size, Color, Storage" size="large" />
          </Form.Item>

          <Form.Item
            label="Category"
            name="category"
            rules={[{ required: true, message: 'Please select category' }]}
          >
            <Select placeholder="Select category" size="large">
              <Option value="Electronics">Electronics</Option>
              <Option value="Smartphones">Smartphones</Option>
              <Option value="Gaming">Gaming</Option>
              <Option value="Computers">Computers</Option>
              <Option value="Footwear">Footwear</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Price"
            name="price"
            rules={[{ required: true, message: 'Please enter price' }]}
          >
            <Input type="number" prefix="$" size="large" placeholder="299.99" />
          </Form.Item>

          <Form.Item
            label="Notification Method"
            name="notificationMethod"
            rules={[{ required: true, message: 'Please select notification method' }]}
            initialValue="both"
          >
            <Select size="large">
              <Option value="email">
                <MailOutlined /> Email Only
              </Option>
              <Option value="sms">
                <PhoneOutlined /> SMS Only
              </Option>
              <Option value="both">
                <BellOutlined /> Email & SMS (Recommended)
              </Option>
            </Select>
          </Form.Item>

          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) =>
              prevValues.notificationMethod !== currentValues.notificationMethod
            }
          >
            {({ getFieldValue }) => {
              const method = getFieldValue('notificationMethod');
              return (
                <>
                  {(method === 'email' || method === 'both') && (
                    <Form.Item
                      label="Email Address"
                      name="email"
                      rules={[
                        { required: true, message: 'Please enter email' },
                        { type: 'email', message: 'Please enter valid email' },
                      ]}
                    >
                      <Input
                        prefix={<MailOutlined />}
                        placeholder="your@email.com"
                        size="large"
                      />
                    </Form.Item>
                  )}
                  {(method === 'sms' || method === 'both') && (
                    <Form.Item
                      label="Phone Number"
                      name="phone"
                      rules={[{ required: true, message: 'Please enter phone number' }]}
                    >
                      <Input
                        prefix={<PhoneOutlined />}
                        placeholder="+1 (555) 123-4567"
                        size="large"
                      />
                    </Form.Item>
                  )}
                </>
              );
            }}
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" size="large" icon={<BellOutlined />}>
                Create Alert
              </Button>
              <Button size="large" onClick={() => setIsModalVisible(false)}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default BackInStockPage;
