import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Form,
  Input,
  Button,
  Table,
  Tag,
  Space,
  Select,
  DatePicker,
  InputNumber,
  Switch,
  message,
  Divider,
  Statistic,
  Progress,
  Alert,
} from 'antd';
import {
  PercentageOutlined,
  TagsOutlined,
  GiftOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  PlusOutlined,
  DollarOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

interface Coupon {
  id: number;
  code: string;
  type: 'percentage' | 'fixed' | 'free_shipping' | 'bogo';
  value: number;
  minPurchase: number;
  maxDiscount: number | null;
  usageLimit: number;
  usedCount: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'expired' | 'scheduled';
  applicableTo: string;
}

const mockCoupons: Coupon[] = [
  {
    id: 1,
    code: 'SAVE20',
    type: 'percentage',
    value: 20,
    minPurchase: 50,
    maxDiscount: 100,
    usageLimit: 1000,
    usedCount: 456,
    startDate: dayjs().subtract(7, 'days').format('YYYY-MM-DD'),
    endDate: dayjs().add(23, 'days').format('YYYY-MM-DD'),
    status: 'active',
    applicableTo: 'All Products',
  },
  {
    id: 2,
    code: 'FLAT50',
    type: 'fixed',
    value: 50,
    minPurchase: 200,
    maxDiscount: null,
    usageLimit: 500,
    usedCount: 234,
    startDate: dayjs().subtract(3, 'days').format('YYYY-MM-DD'),
    endDate: dayjs().add(27, 'days').format('YYYY-MM-DD'),
    status: 'active',
    applicableTo: 'Electronics',
  },
  {
    id: 3,
    code: 'FREESHIP',
    type: 'free_shipping',
    value: 0,
    minPurchase: 30,
    maxDiscount: null,
    usageLimit: 2000,
    usedCount: 1456,
    startDate: dayjs().subtract(14, 'days').format('YYYY-MM-DD'),
    endDate: dayjs().add(16, 'days').format('YYYY-MM-DD'),
    status: 'active',
    applicableTo: 'All Products',
  },
  {
    id: 4,
    code: 'SUMMER30',
    type: 'percentage',
    value: 30,
    minPurchase: 100,
    maxDiscount: 150,
    usageLimit: 500,
    usedCount: 500,
    startDate: dayjs().subtract(60, 'days').format('YYYY-MM-DD'),
    endDate: dayjs().subtract(5, 'days').format('YYYY-MM-DD'),
    status: 'expired',
    applicableTo: 'Fashion',
  },
  {
    id: 5,
    code: 'NEWUSER15',
    type: 'percentage',
    value: 15,
    minPurchase: 0,
    maxDiscount: 50,
    usageLimit: 10000,
    usedCount: 0,
    startDate: dayjs().add(3, 'days').format('YYYY-MM-DD'),
    endDate: dayjs().add(33, 'days').format('YYYY-MM-DD'),
    status: 'scheduled',
    applicableTo: 'New Customers Only',
  },
];

const PromotionsDiscountsPage: React.FC = () => {
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [couponType, setCouponType] = useState<string>('percentage');

  const handleCreateCoupon = (values: any) => {
    console.log('Creating coupon:', values);
    message.success('Coupon created successfully!');
    setIsCreating(false);
    form.resetFields();
  };

  const handleDeactivateCoupon = (code: string) => {
    message.success(`Coupon ${code} deactivated`);
  };

  const couponColumns: ColumnsType<Coupon> = [
    {
      title: 'Coupon Code',
      dataIndex: 'code',
      key: 'code',
      render: (code) => <Text code strong style={{ fontSize: 14 }}>{code}</Text>,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: Coupon['type']) => {
        const config: Record<Coupon['type'], { color: string; icon: React.ReactNode; text: string }> = {
          percentage: { color: 'blue', icon: <PercentageOutlined />, text: 'Percentage' },
          fixed: { color: 'green', icon: <DollarOutlined />, text: 'Fixed Amount' },
          free_shipping: { color: 'purple', icon: <GiftOutlined />, text: 'Free Shipping' },
          bogo: { color: 'orange', icon: <TagsOutlined />, text: 'BOGO' },
        };
        return (
          <Tag color={config[type].color} icon={config[type].icon}>
            {config[type].text}
          </Tag>
        );
      },
      filters: [
        { text: 'Percentage', value: 'percentage' },
        { text: 'Fixed Amount', value: 'fixed' },
        { text: 'Free Shipping', value: 'free_shipping' },
        { text: 'BOGO', value: 'bogo' },
      ],
      onFilter: (value, record) => record.type === value,
    },
    {
      title: 'Discount',
      key: 'discount',
      render: (_, record) => {
        if (record.type === 'percentage') {
          return <Text strong>{record.value}% OFF</Text>;
        } else if (record.type === 'fixed') {
          return <Text strong>${record.value} OFF</Text>;
        } else if (record.type === 'free_shipping') {
          return <Text strong>FREE SHIPPING</Text>;
        }
        return <Text>-</Text>;
      },
    },
    {
      title: 'Min Purchase',
      dataIndex: 'minPurchase',
      key: 'minPurchase',
      render: (amount) => (amount > 0 ? `$${amount}` : 'No minimum'),
    },
    {
      title: 'Usage',
      key: 'usage',
      render: (_, record) => (
        <div>
          <div style={{ marginBottom: 4 }}>
            <Text>{record.usedCount} / {record.usageLimit}</Text>
          </div>
          <Progress
            percent={(record.usedCount / record.usageLimit) * 100}
            size="small"
            showInfo={false}
          />
        </div>
      ),
    },
    {
      title: 'Valid Period',
      key: 'period',
      render: (_, record) => (
        <div>
          <div><Text type="secondary" style={{ fontSize: 12 }}>From: {record.startDate}</Text></div>
          <div><Text type="secondary" style={{ fontSize: 12 }}>To: {record.endDate}</Text></div>
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: Coupon['status']) => {
        const config: Record<Coupon['status'], { color: string; icon: React.ReactNode; text: string }> = {
          active: { color: 'green', icon: <CheckCircleOutlined />, text: 'Active' },
          expired: { color: 'red', icon: <ClockCircleOutlined />, text: 'Expired' },
          scheduled: { color: 'blue', icon: <ClockCircleOutlined />, text: 'Scheduled' },
        };
        return (
          <Tag color={config[status].color} icon={config[status].icon}>
            {config[status].text}
          </Tag>
        );
      },
      filters: [
        { text: 'Active', value: 'active' },
        { text: 'Expired', value: 'expired' },
        { text: 'Scheduled', value: 'scheduled' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button size="small">Edit</Button>
          {record.status === 'active' && (
            <Button size="small" danger onClick={() => handleDeactivateCoupon(record.code)}>
              Deactivate
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const activeCoupons = mockCoupons.filter((c) => c.status === 'active').length;
  const totalRedemptions = mockCoupons.reduce((sum, c) => sum + c.usedCount, 0);
  const avgUsageRate = (mockCoupons.reduce((sum, c) => sum + (c.usedCount / c.usageLimit) * 100, 0) / mockCoupons.length).toFixed(1);

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Title level={3}>
              <TagsOutlined style={{ color: '#1890ff' }} /> Promotions & Discounts
            </Title>
            <Paragraph type="secondary">
              Create and manage coupon codes, promotional campaigns, and discount rules
            </Paragraph>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            onClick={() => setIsCreating(!isCreating)}
          >
            Create Coupon
          </Button>
        </div>
      </div>

      <Alert
        message="Promotional Campaigns Active"
        description="3 active coupon codes are currently available to customers. Track performance in real-time."
        type="info"
        showIcon
        closable
        style={{ marginBottom: 24 }}
      />

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Active Coupons"
              value={activeCoupons}
              prefix={<TagsOutlined />}
              valueStyle={{ color: '#1890ff' }}
              suffix={`/ ${mockCoupons.length}`}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Redemptions"
              value={totalRedemptions}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Avg Usage Rate"
              value={avgUsageRate}
              suffix="%"
              prefix={<PercentageOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Discount Given"
              value="$12,450"
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      {isCreating && (
        <Card title="Create New Coupon" style={{ marginBottom: 16 }}>
          <Form form={form} layout="vertical" onFinish={handleCreateCoupon}>
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Coupon Code"
                  name="code"
                  rules={[{ required: true, message: 'Please enter coupon code' }]}
                  help="Use uppercase letters and numbers (e.g., SAVE20, SUMMER2024)"
                >
                  <Input placeholder="e.g., SAVE20" maxLength={20} />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Coupon Type"
                  name="type"
                  rules={[{ required: true }]}
                  initialValue="percentage"
                >
                  <Select onChange={setCouponType}>
                    <Option value="percentage">Percentage Discount</Option>
                    <Option value="fixed">Fixed Amount</Option>
                    <Option value="free_shipping">Free Shipping</Option>
                    <Option value="bogo">Buy One Get One</Option>
                  </Select>
                </Form.Item>
              </Col>

              {(couponType === 'percentage' || couponType === 'fixed') && (
                <Col xs={24} md={12}>
                  <Form.Item
                    label={couponType === 'percentage' ? 'Discount Percentage' : 'Discount Amount'}
                    name="value"
                    rules={[{ required: true }]}
                  >
                    <InputNumber
                      style={{ width: '100%' }}
                      min={0}
                      max={couponType === 'percentage' ? 100 : undefined}
                      prefix={couponType === 'fixed' ? '$' : undefined}
                      suffix={couponType === 'percentage' ? '%' : undefined}
                    />
                  </Form.Item>
                </Col>
              )}

              <Col xs={24} md={12}>
                <Form.Item label="Minimum Purchase" name="minPurchase" initialValue={0}>
                  <InputNumber style={{ width: '100%' }} min={0} prefix="$" />
                </Form.Item>
              </Col>

              {couponType === 'percentage' && (
                <Col xs={24} md={12}>
                  <Form.Item label="Maximum Discount" name="maxDiscount">
                    <InputNumber style={{ width: '100%' }} min={0} prefix="$" placeholder="No limit" />
                  </Form.Item>
                </Col>
              )}

              <Col xs={24} md={12}>
                <Form.Item
                  label="Usage Limit"
                  name="usageLimit"
                  rules={[{ required: true }]}
                  initialValue={1000}
                >
                  <InputNumber style={{ width: '100%' }} min={1} />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  label="Valid Period"
                  name="dateRange"
                  rules={[{ required: true, message: 'Please select valid period' }]}
                >
                  <RangePicker style={{ width: '100%' }} />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item label="Applicable To" name="applicableTo" initialValue="all">
                  <Select>
                    <Option value="all">All Products</Option>
                    <Option value="electronics">Electronics</Option>
                    <Option value="fashion">Fashion</Option>
                    <Option value="home">Home & Garden</Option>
                    <Option value="new_customers">New Customers Only</Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col xs={24}>
                <Form.Item label="Auto-activate" name="autoActivate" valuePropName="checked">
                  <Switch /> <Text type="secondary" style={{ marginLeft: 8 }}>Activate coupon immediately after creation</Text>
                </Form.Item>
              </Col>
            </Row>

            <Divider />

            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit" size="large">
                  Create Coupon
                </Button>
                <Button size="large" onClick={() => setIsCreating(false)}>
                  Cancel
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>
      )}

      <Card title="All Coupons">
        <Table
          columns={couponColumns}
          dataSource={mockCoupons}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
};

export default PromotionsDiscountsPage;
