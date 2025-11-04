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
  Input,
  InputNumber,
  Select,
  message,
  Alert,
  Statistic,
  Progress,
  DatePicker,
  Radio,
} from 'antd';
import {
  GiftOutlined,
  PlusOutlined,
  DeleteOutlined,
  ShoppingCartOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  PercentageOutlined,
  CalendarOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs, { Dayjs } from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

interface Coupon {
  id: number;
  code: string;
  type: 'percentage' | 'fixed' | 'free-shipping' | 'buy-x-get-y';
  value: number;
  minPurchase?: number;
  maxDiscount?: number;
  description: string;
  startDate: string;
  endDate: string;
  usageLimit: number;
  usageCount: number;
  perUserLimit: number;
  userUsageCount: number;
  status: 'active' | 'expired' | 'upcoming' | 'used-up';
  categories?: string[];
  excludedProducts?: number[];
  stackable: boolean;
  autoApply: boolean;
}

const mockCoupons: Coupon[] = [
  {
    id: 1,
    code: 'WELCOME20',
    type: 'percentage',
    value: 20,
    minPurchase: 50,
    maxDiscount: 100,
    description: 'Welcome offer - 20% off your first order',
    startDate: dayjs().subtract(10, 'days').format('YYYY-MM-DD'),
    endDate: dayjs().add(20, 'days').format('YYYY-MM-DD'),
    usageLimit: 1000,
    usageCount: 542,
    perUserLimit: 1,
    userUsageCount: 0,
    status: 'active',
    categories: ['All'],
    stackable: false,
    autoApply: true,
  },
  {
    id: 2,
    code: 'FREESHIP',
    type: 'free-shipping',
    value: 0,
    minPurchase: 35,
    description: 'Free shipping on orders over $35',
    startDate: dayjs().subtract(5, 'days').format('YYYY-MM-DD'),
    endDate: dayjs().add(25, 'days').format('YYYY-MM-DD'),
    usageLimit: 5000,
    usageCount: 1234,
    perUserLimit: 10,
    userUsageCount: 2,
    status: 'active',
    stackable: true,
    autoApply: false,
  },
  {
    id: 3,
    code: 'BLACKFRIDAY50',
    type: 'percentage',
    value: 50,
    minPurchase: 100,
    maxDiscount: 500,
    description: 'Black Friday Special - 50% off site-wide',
    startDate: dayjs().add(5, 'days').format('YYYY-MM-DD'),
    endDate: dayjs().add(7, 'days').format('YYYY-MM-DD'),
    usageLimit: 10000,
    usageCount: 0,
    perUserLimit: 1,
    userUsageCount: 0,
    status: 'upcoming',
    categories: ['Electronics', 'Fashion', 'Home'],
    stackable: false,
    autoApply: false,
  },
  {
    id: 4,
    code: 'SAVE25',
    type: 'fixed',
    value: 25,
    minPurchase: 100,
    description: '$25 off orders over $100',
    startDate: dayjs().subtract(30, 'days').format('YYYY-MM-DD'),
    endDate: dayjs().subtract(1, 'days').format('YYYY-MM-DD'),
    usageLimit: 500,
    usageCount: 500,
    perUserLimit: 2,
    userUsageCount: 1,
    status: 'used-up',
    stackable: true,
    autoApply: false,
  },
  {
    id: 5,
    code: 'BUY2GET1',
    type: 'buy-x-get-y',
    value: 1,
    description: 'Buy 2 Get 1 Free on selected items',
    startDate: dayjs().subtract(15, 'days').format('YYYY-MM-DD'),
    endDate: dayjs().add(15, 'days').format('YYYY-MM-DD'),
    usageLimit: 2000,
    usageCount: 876,
    perUserLimit: 5,
    userUsageCount: 1,
    status: 'active',
    categories: ['Fashion', 'Books'],
    stackable: false,
    autoApply: false,
  },
];

const CouponManagementPage: React.FC = () => {
  const [coupons, setCoupons] = useState<Coupon[]>(mockCoupons);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [form] = Form.useForm();

  const handleCreate = () => {
    setSelectedCoupon(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
    form.setFieldsValue({
      ...coupon,
      dateRange: [dayjs(coupon.startDate), dayjs(coupon.endDate)],
    });
    setIsModalVisible(true);
  };

  const handleSubmit = (values: any) => {
    const [startDate, endDate] = values.dateRange;
    const couponData: Coupon = {
      id: selectedCoupon?.id || coupons.length + 1,
      code: values.code.toUpperCase(),
      type: values.type,
      value: values.value,
      minPurchase: values.minPurchase,
      maxDiscount: values.maxDiscount,
      description: values.description,
      startDate: startDate.format('YYYY-MM-DD'),
      endDate: endDate.format('YYYY-MM-DD'),
      usageLimit: values.usageLimit,
      usageCount: selectedCoupon?.usageCount || 0,
      perUserLimit: values.perUserLimit,
      userUsageCount: selectedCoupon?.userUsageCount || 0,
      status: dayjs().isBefore(startDate) ? 'upcoming' : 'active',
      categories: values.categories,
      stackable: values.stackable,
      autoApply: values.autoApply,
    };

    if (selectedCoupon) {
      setCoupons(coupons.map((c) => (c.id === selectedCoupon.id ? couponData : c)));
      message.success('Coupon updated successfully');
    } else {
      setCoupons([couponData, ...coupons]);
      message.success('Coupon created successfully');
    }

    setIsModalVisible(false);
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: 'Delete Coupon',
      content: 'Are you sure you want to delete this coupon? This action cannot be undone.',
      okText: 'Delete',
      okType: 'danger',
      onOk: () => {
        setCoupons(coupons.filter((c) => c.id !== id));
        message.success('Coupon deleted successfully');
      },
    });
  };

  const handleCopyCoupon = (code: string) => {
    navigator.clipboard.writeText(code);
    message.success(`Coupon code "${code}" copied to clipboard`);
  };

  const columns: ColumnsType<Coupon> = [
    {
      title: 'Coupon Code',
      dataIndex: 'code',
      key: 'code',
      render: (code, record) => (
        <div>
          <div>
            <Text
              strong
              style={{ fontSize: 16, fontFamily: 'monospace', cursor: 'pointer' }}
              onClick={() => handleCopyCoupon(code)}
            >
              {code}
            </Text>
          </div>
          <Paragraph
            type="secondary"
            style={{ margin: 0, fontSize: 12 }}
            ellipsis={{ rows: 2 }}
          >
            {record.description}
          </Paragraph>
        </div>
      ),
    },
    {
      title: 'Type & Value',
      key: 'typeValue',
      render: (_, record) => {
        const typeConfig = {
          percentage: {
            icon: <PercentageOutlined />,
            text: `${record.value}% OFF`,
            color: 'blue',
          },
          fixed: {
            icon: <DollarOutlined />,
            text: `$${record.value} OFF`,
            color: 'green',
          },
          'free-shipping': {
            icon: <GiftOutlined />,
            text: 'FREE SHIPPING',
            color: 'orange',
          },
          'buy-x-get-y': {
            icon: <ShoppingCartOutlined />,
            text: `BUY 2 GET ${record.value} FREE`,
            color: 'purple',
          },
        };
        const config = typeConfig[record.type];
        return (
          <div>
            <Tag icon={config.icon} color={config.color}>
              {config.text}
            </Tag>
            {record.minPurchase && (
              <div style={{ marginTop: 4 }}>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Min: ${record.minPurchase}
                </Text>
              </div>
            )}
            {record.maxDiscount && (
              <div>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Max: ${record.maxDiscount}
                </Text>
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: 'Valid Period',
      key: 'period',
      render: (_, record) => {
        const daysLeft = dayjs(record.endDate).diff(dayjs(), 'days');
        return (
          <div>
            <div>
              <Text style={{ fontSize: 12 }}>
                {dayjs(record.startDate).format('MMM DD')} - {dayjs(record.endDate).format('MMM DD, YYYY')}
              </Text>
            </div>
            {record.status === 'active' && (
              <Text type={daysLeft < 3 ? 'danger' : 'secondary'} style={{ fontSize: 12 }}>
                {daysLeft > 0 ? `${daysLeft} days left` : 'Expires today'}
              </Text>
            )}
            {record.status === 'upcoming' && (
              <Text type="warning" style={{ fontSize: 12 }}>
                Starts {dayjs(record.startDate).fromNow()}
              </Text>
            )}
          </div>
        );
      },
    },
    {
      title: 'Usage',
      key: 'usage',
      render: (_, record) => {
        const usagePercent = (record.usageCount / record.usageLimit) * 100;
        const userUsagePercent = (record.userUsageCount / record.perUserLimit) * 100;
        return (
          <div>
            <div style={{ marginBottom: 4 }}>
              <Text style={{ fontSize: 12 }}>
                Total: {record.usageCount} / {record.usageLimit}
              </Text>
            </div>
            <Progress percent={usagePercent} size="small" showInfo={false} />
            <div style={{ marginTop: 8 }}>
              <Text style={{ fontSize: 12 }}>
                You: {record.userUsageCount} / {record.perUserLimit}
              </Text>
            </div>
            <Progress percent={userUsagePercent} size="small" showInfo={false} strokeColor="#52c41a" />
          </div>
        );
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: Coupon['status']) => {
        const statusConfig = {
          active: { color: 'green', text: 'Active', icon: <CheckCircleOutlined /> },
          expired: { color: 'default', text: 'Expired', icon: <ClockCircleOutlined /> },
          upcoming: { color: 'blue', text: 'Upcoming', icon: <CalendarOutlined /> },
          'used-up': { color: 'red', text: 'Used Up', icon: null },
        };
        const config = statusConfig[status];
        return (
          <Tag color={config.color} icon={config.icon}>
            {config.text}
          </Tag>
        );
      },
      filters: [
        { text: 'Active', value: 'active' },
        { text: 'Expired', value: 'expired' },
        { text: 'Upcoming', value: 'upcoming' },
        { text: 'Used Up', value: 'used-up' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Features',
      key: 'features',
      render: (_, record) => (
        <Space direction="vertical" size={2}>
          {record.stackable && <Tag color="cyan">Stackable</Tag>}
          {record.autoApply && <Tag color="purple">Auto-Apply</Tag>}
          {record.categories && record.categories.length > 0 && (
            <Tag color="orange">
              {record.categories.length === 1 ? record.categories[0] : `${record.categories.length} categories`}
            </Tag>
          )}
        </Space>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          {record.status === 'active' && record.userUsageCount < record.perUserLimit && (
            <Button type="primary" size="small" onClick={() => handleCopyCoupon(record.code)}>
              Copy Code
            </Button>
          )}
          <Button size="small" onClick={() => handleEdit(record)}>
            Edit
          </Button>
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

  const activeCoupons = coupons.filter((c) => c.status === 'active').length;
  const totalUsage = coupons.reduce((sum, c) => sum + c.usageCount, 0);
  const totalDiscount = coupons.reduce((sum, c) => {
    if (c.type === 'fixed') return sum + c.value * c.usageCount;
    if (c.type === 'percentage') return sum + ((c.maxDiscount || 50) * c.usageCount * 0.3); // estimate
    return sum;
  }, 0);

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={3}>
            <GiftOutlined style={{ color: '#52c41a' }} /> Coupon Management
          </Title>
          <Paragraph type="secondary">
            Create and manage promotional coupons for your customers
          </Paragraph>
        </Col>
        <Col>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            Create Coupon
          </Button>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Active Coupons"
              value={activeCoupons}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Total Usage"
              value={totalUsage}
              prefix={<ShoppingCartOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Total Discount Given"
              value={totalDiscount}
              prefix="$"
              precision={2}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
      </Row>

      <Alert
        message="💡 Pro Tip"
        description="Create time-limited coupons with auto-apply feature to increase conversion rates during special events or holidays."
        type="info"
        showIcon
        closable
        style={{ marginBottom: 16 }}
      />

      <Card title="All Coupons">
        <Table columns={columns} dataSource={coupons} rowKey="id" scroll={{ x: 1400 }} />
      </Card>

      <Modal
        title={selectedCoupon ? 'Edit Coupon' : 'Create New Coupon'}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={700}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Coupon Code"
            name="code"
            rules={[
              { required: true, message: 'Please enter coupon code' },
              { pattern: /^[A-Z0-9]+$/, message: 'Only uppercase letters and numbers allowed' },
            ]}
          >
            <Input
              placeholder="SUMMER2025"
              size="large"
              maxLength={20}
              style={{ fontFamily: 'monospace', fontWeight: 'bold' }}
            />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: 'Please enter description' }]}
          >
            <Input.TextArea
              rows={2}
              placeholder="Short description of the coupon offer"
              maxLength={200}
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Coupon Type"
                name="type"
                rules={[{ required: true, message: 'Please select type' }]}
              >
                <Select placeholder="Select type" size="large">
                  <Option value="percentage">Percentage Discount</Option>
                  <Option value="fixed">Fixed Amount Discount</Option>
                  <Option value="free-shipping">Free Shipping</Option>
                  <Option value="buy-x-get-y">Buy X Get Y Free</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                noStyle
                shouldUpdate={(prevValues, currentValues) => prevValues.type !== currentValues.type}
              >
                {({ getFieldValue }) => {
                  const type = getFieldValue('type');
                  if (type === 'free-shipping') return null;
                  return (
                    <Form.Item
                      label={type === 'percentage' ? 'Discount %' : type === 'buy-x-get-y' ? 'Get Y Free' : 'Discount Amount'}
                      name="value"
                      rules={[{ required: true, message: 'Please enter value' }]}
                    >
                      <InputNumber
                        min={1}
                        max={type === 'percentage' ? 100 : undefined}
                        style={{ width: '100%' }}
                        size="large"
                        prefix={type === 'percentage' ? undefined : '$'}
                        suffix={type === 'percentage' ? '%' : undefined}
                      />
                    </Form.Item>
                  );
                }}
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Minimum Purchase" name="minPurchase">
                <InputNumber
                  min={0}
                  style={{ width: '100%' }}
                  size="large"
                  prefix="$"
                  placeholder="0"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                noStyle
                shouldUpdate={(prevValues, currentValues) => prevValues.type !== currentValues.type}
              >
                {({ getFieldValue }) =>
                  getFieldValue('type') === 'percentage' ? (
                    <Form.Item label="Maximum Discount" name="maxDiscount">
                      <InputNumber
                        min={1}
                        style={{ width: '100%' }}
                        size="large"
                        prefix="$"
                        placeholder="100"
                      />
                    </Form.Item>
                  ) : null
                }
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Valid Period"
            name="dateRange"
            rules={[{ required: true, message: 'Please select valid period' }]}
          >
            <RangePicker style={{ width: '100%' }} size="large" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Total Usage Limit"
                name="usageLimit"
                rules={[{ required: true, message: 'Please enter usage limit' }]}
              >
                <InputNumber
                  min={1}
                  style={{ width: '100%' }}
                  size="large"
                  placeholder="1000"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Per User Limit"
                name="perUserLimit"
                rules={[{ required: true, message: 'Please enter per user limit' }]}
              >
                <InputNumber
                  min={1}
                  style={{ width: '100%' }}
                  size="large"
                  placeholder="1"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Applicable Categories" name="categories">
            <Select mode="multiple" placeholder="Select categories (leave empty for all)" size="large">
              <Option value="All">All Categories</Option>
              <Option value="Electronics">Electronics</Option>
              <Option value="Fashion">Fashion</Option>
              <Option value="Home">Home & Garden</Option>
              <Option value="Books">Books</Option>
              <Option value="Sports">Sports</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Additional Settings">
            <Space direction="vertical">
              <Form.Item name="stackable" valuePropName="checked" noStyle>
                <Radio.Group>
                  <Radio value={true}>Stackable with other coupons</Radio>
                  <Radio value={false}>Cannot be combined</Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item name="autoApply" valuePropName="checked" noStyle>
                <Radio.Group>
                  <Radio value={true}>Auto-apply at checkout</Radio>
                  <Radio value={false}>Requires manual entry</Radio>
                </Radio.Group>
              </Form.Item>
            </Space>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" size="large" icon={<GiftOutlined />}>
                {selectedCoupon ? 'Update Coupon' : 'Create Coupon'}
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

export default CouponManagementPage;
