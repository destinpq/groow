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
  Select,
  message,
  Switch,
  Badge,
  Image,
  Alert,
  Progress,
} from 'antd';
import {
  BellOutlined,
  DollarOutlined,
  DeleteOutlined,
  PlusOutlined,
  CheckCircleOutlined,
  PercentageOutlined,
  FallOutlined,
  RiseOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

interface PriceAlert {
  id: number;
  productId: number;
  productName: string;
  productImage: string;
  currentPrice: number;
  originalPrice: number;
  targetPrice: number;
  alertType: 'exact' | 'below' | 'percentage';
  percentageDiscount?: number;
  status: 'active' | 'triggered' | 'expired';
  createdAt: string;
  triggeredAt?: string;
  isNotificationEnabled: boolean;
  category: string;
}

interface PriceHistory {
  date: string;
  price: number;
}

const mockAlerts: PriceAlert[] = [
  {
    id: 1,
    productId: 1,
    productName: 'Sony WH-1000XM5 Headphones',
    productImage: 'https://via.placeholder.com/60?text=Headphones',
    currentPrice: 349,
    originalPrice: 399,
    targetPrice: 299,
    alertType: 'below',
    status: 'active',
    createdAt: dayjs().subtract(15, 'days').format('YYYY-MM-DD'),
    isNotificationEnabled: true,
    category: 'Electronics',
  },
  {
    id: 2,
    productId: 2,
    productName: 'MacBook Pro 14" M4',
    productImage: 'https://via.placeholder.com/60?text=MacBook',
    currentPrice: 1899,
    originalPrice: 1999,
    targetPrice: 1799,
    alertType: 'exact',
    status: 'triggered',
    createdAt: dayjs().subtract(30, 'days').format('YYYY-MM-DD'),
    triggeredAt: dayjs().subtract(2, 'days').format('YYYY-MM-DD'),
    isNotificationEnabled: true,
    category: 'Computers',
  },
  {
    id: 3,
    productId: 3,
    productName: 'Samsung 65" QLED TV',
    productImage: 'https://via.placeholder.com/60?text=TV',
    currentPrice: 1299,
    originalPrice: 1499,
    targetPrice: 999,
    alertType: 'percentage',
    percentageDiscount: 30,
    status: 'active',
    createdAt: dayjs().subtract(7, 'days').format('YYYY-MM-DD'),
    isNotificationEnabled: true,
    category: 'Electronics',
  },
  {
    id: 4,
    productId: 4,
    productName: 'iPhone 16 Pro Max 256GB',
    productImage: 'https://via.placeholder.com/60?text=iPhone',
    currentPrice: 1199,
    originalPrice: 1299,
    targetPrice: 1099,
    alertType: 'below',
    status: 'active',
    createdAt: dayjs().subtract(5, 'days').format('YYYY-MM-DD'),
    isNotificationEnabled: false,
    category: 'Smartphones',
  },
];

const PriceAlertsPage: React.FC = () => {
  const [alerts, setAlerts] = useState<PriceAlert[]>(mockAlerts);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [form] = Form.useForm();

  const handleCreateAlert = () => {
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleSubmit = (values: any) => {
    const newAlert: PriceAlert = {
      id: alerts.length + 1,
      productId: Math.floor(Math.random() * 1000),
      productName: values.productName,
      productImage: 'https://via.placeholder.com/60?text=Product',
      currentPrice: values.currentPrice,
      originalPrice: values.currentPrice,
      targetPrice: values.targetPrice,
      alertType: values.alertType,
      percentageDiscount: values.percentageDiscount,
      status: 'active',
      createdAt: dayjs().format('YYYY-MM-DD'),
      isNotificationEnabled: values.isNotificationEnabled,
      category: values.category,
    };

    setAlerts([newAlert, ...alerts]);
    message.success('Price alert created successfully! You will be notified when the price drops.');
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: 'Delete Price Alert',
      content: 'Are you sure you want to delete this price alert?',
      okText: 'Delete',
      okType: 'danger',
      onOk: () => {
        setAlerts(alerts.filter((a) => a.id !== id));
        message.success('Price alert deleted successfully');
      },
    });
  };

  const handleToggleNotification = (id: number) => {
    setAlerts(
      alerts.map((a) =>
        a.id === id ? { ...a, isNotificationEnabled: !a.isNotificationEnabled } : a
      )
    );
  };

  const columns: ColumnsType<PriceAlert> = [
    {
      title: 'Product',
      key: 'product',
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Image src={record.productImage} width={60} height={60} preview={false} />
          <div>
            <Text strong>{record.productName}</Text>
            <div>
              <Tag color="blue" style={{ margin: 0 }}>
                {record.category}
              </Tag>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Current Price',
      key: 'currentPrice',
      render: (_, record) => {
        const discount = ((record.originalPrice - record.currentPrice) / record.originalPrice) * 100;
        return (
          <div>
            <div>
              <Text strong style={{ fontSize: 16, color: '#1890ff' }}>
                ${record.currentPrice}
              </Text>
            </div>
            {discount > 0 && (
              <div>
                <Text delete type="secondary" style={{ fontSize: 12 }}>
                  ${record.originalPrice}
                </Text>
                <Tag color="green" style={{ marginLeft: 4 }}>
                  -{discount.toFixed(0)}%
                </Tag>
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: 'Target Price',
      key: 'targetPrice',
      render: (_, record) => {
        const neededDrop = ((record.currentPrice - record.targetPrice) / record.currentPrice) * 100;
        return (
          <div>
            <div>
              <Text strong style={{ fontSize: 16, color: '#52c41a' }}>
                ${record.targetPrice}
              </Text>
            </div>
            {record.alertType === 'percentage' && record.percentageDiscount && (
              <Tag color="orange" icon={<PercentageOutlined />}>
                {record.percentageDiscount}% off
              </Tag>
            )}
            {record.status === 'active' && neededDrop > 0 && (
              <div>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Needs {neededDrop.toFixed(0)}% drop
                </Text>
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: 'Alert Type',
      dataIndex: 'alertType',
      key: 'alertType',
      render: (type: PriceAlert['alertType']) => {
        const config: Record<PriceAlert['alertType'], { color: string; text: string }> = {
          exact: { color: 'blue', text: 'Exact Price' },
          below: { color: 'green', text: 'Below Price' },
          percentage: { color: 'orange', text: 'Percentage Off' },
        };
        return <Tag color={config[type].color}>{config[type].text}</Tag>;
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: PriceAlert['status']) => {
        const config: Record<PriceAlert['status'], { color: string; text: string; icon: React.ReactNode }> = {
          active: { color: 'blue', text: 'Active', icon: <BellOutlined /> },
          triggered: { color: 'green', text: 'Triggered', icon: <CheckCircleOutlined /> },
          expired: { color: 'default', text: 'Expired', icon: null },
        };
        return (
          <Tag color={config[status].color} icon={config[status].icon}>
            {config[status].text}
          </Tag>
        );
      },
      filters: [
        { text: 'Active', value: 'active' },
        { text: 'Triggered', value: 'triggered' },
        { text: 'Expired', value: 'expired' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => <Text>{dayjs(date).format('MMM DD, YYYY')}</Text>,
    },
    {
      title: 'Notifications',
      key: 'notifications',
      render: (_, record) => (
        <Switch
          checked={record.isNotificationEnabled}
          onChange={() => handleToggleNotification(record.id)}
          checkedChildren="On"
          unCheckedChildren="Off"
        />
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          {record.status === 'triggered' && (
            <Button type="primary" size="small">
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
  const triggeredAlerts = alerts.filter((a) => a.status === 'triggered').length;
  const totalSavings = alerts
    .filter((a) => a.status === 'triggered')
    .reduce((sum, a) => sum + (a.originalPrice - a.currentPrice), 0);

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={3}>
            <BellOutlined style={{ color: '#fa8c16' }} /> Price Alerts
          </Title>
          <Paragraph type="secondary">
            Get notified when your favorite products drop in price
          </Paragraph>
        </Col>
        <Col>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateAlert}>
            Create Price Alert
          </Button>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  background: '#e6f7ff',
                  borderRadius: 8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <BellOutlined style={{ fontSize: 24, color: '#1890ff' }} />
              </div>
              <div>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Active Alerts
                </Text>
                <div>
                  <Text strong style={{ fontSize: 24 }}>
                    {activeAlerts}
                  </Text>
                </div>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={8}>
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  background: '#f6ffed',
                  borderRadius: 8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CheckCircleOutlined style={{ fontSize: 24, color: '#52c41a' }} />
              </div>
              <div>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Triggered Alerts
                </Text>
                <div>
                  <Text strong style={{ fontSize: 24 }}>
                    {triggeredAlerts}
                  </Text>
                </div>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={8}>
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  background: '#fff7e6',
                  borderRadius: 8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <DollarOutlined style={{ fontSize: 24, color: '#fa8c16' }} />
              </div>
              <div>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Potential Savings
                </Text>
                <div>
                  <Text strong style={{ fontSize: 24 }}>
                    ${totalSavings}
                  </Text>
                </div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {triggeredAlerts > 0 && (
        <Alert
          message="Price Alert Triggered!"
          description={`${triggeredAlerts} product${triggeredAlerts > 1 ? 's have' : ' has'} reached your target price. Check them out before the price changes!`}
          type="success"
          showIcon
          icon={<CheckCircleOutlined />}
          style={{ marginBottom: 16 }}
          action={
            <Button type="primary" size="small">
              View Deals
            </Button>
          }
        />
      )}

      <Card title="My Price Alerts">
        <Table columns={columns} dataSource={alerts} rowKey="id" scroll={{ x: 1200 }} />
      </Card>

      <Modal
        title="Create Price Alert"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={600}
      >
        <Alert
          message="How Price Alerts Work"
          description={
            <ul style={{ marginBottom: 0, paddingLeft: 20 }}>
              <li>Set your target price for any product</li>
              <li>We'll monitor the price and notify you when it drops</li>
              <li>Get email and push notifications instantly</li>
              <li>Alerts expire after 90 days if not triggered</li>
            </ul>
          }
          type="info"
          showIcon
          style={{ marginBottom: 24 }}
        />

        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Product Name"
            name="productName"
            rules={[{ required: true, message: 'Please enter product name' }]}
          >
            <Select
              placeholder="Search for a product"
              showSearch
              size="large"
              filterOption={false}
            >
              <Option value="Sony WH-1000XM5 Headphones">Sony WH-1000XM5 Headphones</Option>
              <Option value="MacBook Pro 14 M4">MacBook Pro 14" M4</Option>
              <Option value="iPhone 16 Pro Max">iPhone 16 Pro Max</Option>
              <Option value="Samsung 65 QLED TV">Samsung 65" QLED TV</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Category"
            name="category"
            rules={[{ required: true, message: 'Please select category' }]}
          >
            <Select placeholder="Select category" size="large">
              <Option value="Electronics">Electronics</Option>
              <Option value="Computers">Computers</Option>
              <Option value="Smartphones">Smartphones</Option>
              <Option value="Home & Garden">Home & Garden</Option>
            </Select>
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Current Price"
                name="currentPrice"
                rules={[{ required: true, message: 'Please enter current price' }]}
              >
                <InputNumber
                  min={0}
                  style={{ width: '100%' }}
                  prefix="$"
                  size="large"
                  placeholder="299.99"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Target Price"
                name="targetPrice"
                rules={[{ required: true, message: 'Please enter target price' }]}
              >
                <InputNumber
                  min={0}
                  style={{ width: '100%' }}
                  prefix="$"
                  size="large"
                  placeholder="249.99"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Alert Type"
            name="alertType"
            rules={[{ required: true, message: 'Please select alert type' }]}
            initialValue="below"
          >
            <Select size="large">
              <Option value="exact">Notify at exact price</Option>
              <Option value="below">Notify when price goes below</Option>
              <Option value="percentage">Notify at percentage discount</Option>
            </Select>
          </Form.Item>

          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) => prevValues.alertType !== currentValues.alertType}
          >
            {({ getFieldValue }) =>
              getFieldValue('alertType') === 'percentage' ? (
                <Form.Item
                  label="Target Discount Percentage"
                  name="percentageDiscount"
                  rules={[{ required: true, message: 'Please enter percentage' }]}
                >
                  <InputNumber
                    min={1}
                    max={99}
                    style={{ width: '100%' }}
                    suffix="%"
                    size="large"
                    placeholder="20"
                  />
                </Form.Item>
              ) : null
            }
          </Form.Item>

          <Form.Item
            name="isNotificationEnabled"
            valuePropName="checked"
            initialValue={true}
          >
            <Space>
              <Switch defaultChecked />
              <Text>Enable email and push notifications</Text>
            </Space>
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

export default PriceAlertsPage;
