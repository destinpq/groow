import React, { useState, useEffect } from 'react';
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
  message,
  Statistic,
  Progress,
  Modal,
  Alert,
} from 'antd';
import {
  ShoppingCartOutlined,
  TrophyOutlined,
  DollarOutlined,
  UserOutlined,
  PercentageOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { flashSalesAPI, FlashSale, FlashSaleStats } from '@/services/api';

const { Title, Text, Paragraph } = Typography;
const { RangePicker } = DatePicker;

interface DailyDeal {
  id: number;
  name: string;
  description: string;
  dealDate: string;
  productsCount: number;
  totalRevenue: number;
  impressions: number;
  conversions: number;
  status: 'scheduled' | 'active' | 'completed';
}

const mockFlashSales: FlashSale[] = [
  {
    id: 1,
    name: 'Weekend Flash Sale',
    productId: 101,
    productName: 'Wireless Headphones Pro',
    originalPrice: 199,
    salePrice: 99,
    discount: 50,
    stock: 100,
    sold: 68,
    startTime: dayjs().add(2, 'hours').format('YYYY-MM-DD HH:mm'),
    endTime: dayjs().add(26, 'hours').format('YYYY-MM-DD HH:mm'),
    status: 'upcoming',
  },
  {
    id: 2,
    name: 'Smart Watch Blitz',
    productId: 102,
    productName: 'Smart Watch Series 5',
    originalPrice: 299,
    salePrice: 199,
    discount: 33,
    stock: 50,
    sold: 45,
    startTime: dayjs().subtract(2, 'hours').format('YYYY-MM-DD HH:mm'),
    endTime: dayjs().add(1, 'hour').format('YYYY-MM-DD HH:mm'),
    status: 'active',
  },
  {
    id: 3,
    name: 'Office Chair Clearance',
    productId: 103,
    productName: 'Ergonomic Office Chair',
    originalPrice: 449,
    salePrice: 299,
    discount: 33,
    stock: 30,
    sold: 30,
    startTime: dayjs().subtract(6, 'hours').format('YYYY-MM-DD HH:mm'),
    endTime: dayjs().subtract(1, 'hour').format('YYYY-MM-DD HH:mm'),
    status: 'ended',
  },
];

const mockDailyDeals: DailyDeal[] = [
  {
    id: 1,
    name: 'Monday Mega Deals',
    description: 'Electronics and gadgets at unbeatable prices',
    dealDate: dayjs().add(1, 'day').format('YYYY-MM-DD'),
    productsCount: 15,
    totalRevenue: 0,
    impressions: 0,
    conversions: 0,
    status: 'scheduled',
  },
  {
    id: 2,
    name: 'Today\'s Hot Deals',
    description: 'Flash deals on fashion and accessories',
    dealDate: dayjs().format('YYYY-MM-DD'),
    productsCount: 12,
    totalRevenue: 18500,
    impressions: 5420,
    conversions: 245,
    status: 'active',
  },
  {
    id: 3,
    name: 'Weekend Special',
    description: 'Home & kitchen essentials',
    dealDate: dayjs().subtract(2, 'days').format('YYYY-MM-DD'),
    productsCount: 20,
    totalRevenue: 32400,
    impressions: 8920,
    conversions: 412,
    status: 'completed',
  },
];

const FlashSalesDailyDealsPage: React.FC = () => {
  const [form] = Form.useForm();
  const [isFlashSaleModalVisible, setIsFlashSaleModalVisible] = useState<boolean>(false);
  const [isDailyDealModalVisible, setIsDailyDealModalVisible] = useState<boolean>(false);

  const handleCreateFlashSale = (values: any) => {
    console.log('Creating flash sale:', values);
    message.success('Flash sale created successfully');
    setIsFlashSaleModalVisible(false);
    form.resetFields();
  };

  const handleCreateDailyDeal = (values: any) => {
    console.log('Creating daily deal:', values);
    message.success('Daily deal created successfully');
    setIsDailyDealModalVisible(false);
    form.resetFields();
  };

  const handleCancelFlashSale = (id: number) => {
    message.success('Flash sale cancelled');
  };

  const flashSaleColumns: ColumnsType<FlashSale> = [
    {
      title: 'Product',
      key: 'product',
      render: (_, record) => (
        <div>
          <Text strong>{record.productName}</Text>
          <div>
            <Text type="secondary" style={{ fontSize: 12 }}>{record.name}</Text>
          </div>
        </div>
      ),
    },
    {
      title: 'Pricing',
      key: 'pricing',
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text delete type="secondary" style={{ fontSize: 12 }}>${record.originalPrice}</Text>
          <Text strong style={{ color: '#ff4d4f', fontSize: 16 }}>${record.salePrice}</Text>
          <Tag color="red">{record.discount}% OFF</Tag>
        </Space>
      ),
    },
    {
      title: 'Stock',
      key: 'stock',
      render: (_, record) => {
        const percentage = (record.sold / record.stock) * 100;
        return (
          <Space direction="vertical" size={0} style={{ width: 120 }}>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {record.sold} / {record.stock} sold
            </Text>
            <Progress
              percent={percentage}
              strokeColor={percentage > 80 ? '#52c41a' : '#1890ff'}
              showInfo={false}
              size="small"
            />
          </Space>
        );
      },
    },
    {
      title: 'Schedule',
      key: 'schedule',
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text type="secondary" style={{ fontSize: 12 }}>Start: {record.startTime}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>End: {record.endTime}</Text>
        </Space>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: FlashSale['status']) => {
        const config: Record<FlashSale['status'], { color: string; text: string }> = {
          upcoming: { color: 'blue', text: 'Upcoming' },
          active: { color: 'green', text: 'Active' },
          ended: { color: 'default', text: 'Ended' },
        };
        return <Tag color={config[status].color}>{config[status].text}</Tag>;
      },
      filters: [
        { text: 'Upcoming', value: 'upcoming' },
        { text: 'Active', value: 'active' },
        { text: 'Ended', value: 'ended' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button size="small" type="link" icon={<EyeOutlined />}>
            View
          </Button>
          {record.status === 'upcoming' && (
            <Button size="small" danger onClick={() => handleCancelFlashSale(record.id)}>
              Cancel
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const dailyDealColumns: ColumnsType<DailyDeal> = [
    {
      title: 'Deal Name',
      key: 'name',
      render: (_, record) => (
        <div>
          <Text strong>{record.name}</Text>
          <div>
            <Text type="secondary" style={{ fontSize: 12 }}>{record.description}</Text>
          </div>
        </div>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'dealDate',
      key: 'dealDate',
      render: (date) => <Text>{dayjs(date).format('MMM DD, YYYY')}</Text>,
    },
    {
      title: 'Products',
      dataIndex: 'productsCount',
      key: 'productsCount',
      render: (count) => (
        <Space>
          <ShoppingCartOutlined />
          <Text>{count}</Text>
        </Space>
      ),
    },
    {
      title: 'Revenue',
      dataIndex: 'totalRevenue',
      key: 'totalRevenue',
      render: (revenue) => <Text strong>${revenue.toLocaleString()}</Text>,
    },
    {
      title: 'Performance',
      key: 'performance',
      render: (_, record) => {
        if (record.status === 'scheduled') {
          return <Text type="secondary">Not started</Text>;
        }
        const conversionRate = record.impressions > 0 ? (record.conversions / record.impressions) * 100 : 0;
        return (
          <Space direction="vertical" size={0}>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {record.impressions.toLocaleString()} views
            </Text>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {record.conversions} conversions ({conversionRate.toFixed(1)}%)
            </Text>
          </Space>
        );
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: DailyDeal['status']) => {
        const config: Record<DailyDeal['status'], { color: string; text: string }> = {
          scheduled: { color: 'blue', text: 'Scheduled' },
          active: { color: 'green', text: 'Active' },
          completed: { color: 'default', text: 'Completed' },
        };
        return <Tag color={config[status].color}>{config[status].text}</Tag>;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button size="small" type="link">
            Edit
          </Button>
          {record.status === 'active' && (
            <Button size="small" danger>
              End Deal
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const activeFlashSales = mockFlashSales.filter((s) => s.status === 'active').length;
  const totalFlashRevenue = mockFlashSales.reduce((sum, s) => sum + s.sold * s.salePrice, 0);
  const activeDailyDeals = mockDailyDeals.filter((d) => d.status === 'active').length;
  const totalDealRevenue = mockDailyDeals.reduce((sum, d) => sum + d.totalRevenue, 0);

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={3}>
          <TrophyOutlined style={{ color: '#1890ff' }} /> Flash Sales & Daily Deals
        </Title>
        <Paragraph type="secondary">
          Create and manage time-limited flash sales and daily deal campaigns
        </Paragraph>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Active Flash Sales"
              value={activeFlashSales}
              prefix={<TrophyOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Flash Sales Revenue"
              value={totalFlashRevenue}
              prefix={<DollarOutlined />}
              precision={2}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Active Daily Deals"
              value={activeDailyDeals}
              prefix={<ShoppingCartOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Daily Deals Revenue"
              value={totalDealRevenue}
              prefix={<DollarOutlined />}
              precision={2}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      <Card
        title="Flash Sales"
        style={{ marginBottom: 16 }}
        extra={
          <Button type="primary" onClick={() => setIsFlashSaleModalVisible(true)}>
            Create Flash Sale
          </Button>
        }
      >
        <Alert
          message="Flash Sales Tips"
          description="Create urgency with limited-time offers. Monitor stock levels closely and ensure adequate inventory."
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
        />
        <Table
          columns={flashSaleColumns}
          dataSource={mockFlashSales}
          rowKey="id"
          pagination={false}
        />
      </Card>

      <Card
        title="Daily Deals"
        extra={
          <Button type="primary" onClick={() => setIsDailyDealModalVisible(true)}>
            Create Daily Deal
          </Button>
        }
      >
        <Alert
          message="Daily Deals Strategy"
          description="Rotate featured products daily to maintain customer interest. Analyze performance metrics to optimize future deals."
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
        />
        <Table
          columns={dailyDealColumns}
          dataSource={mockDailyDeals}
          rowKey="id"
          pagination={false}
        />
      </Card>

      <Modal
        title="Create Flash Sale"
        open={isFlashSaleModalVisible}
        onCancel={() => setIsFlashSaleModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleCreateFlashSale}>
          <Form.Item
            label="Sale Name"
            name="name"
            rules={[{ required: true, message: 'Please enter sale name' }]}
          >
            <Input placeholder="e.g., Weekend Flash Sale" />
          </Form.Item>

          <Form.Item
            label="Product"
            name="productId"
            rules={[{ required: true, message: 'Please select product' }]}
          >
            <Select placeholder="Select product">
              <Select.Option value={101}>Wireless Headphones Pro</Select.Option>
              <Select.Option value={102}>Smart Watch Series 5</Select.Option>
              <Select.Option value={103}>Ergonomic Office Chair</Select.Option>
            </Select>
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Original Price"
                name="originalPrice"
                rules={[{ required: true, message: 'Required' }]}
              >
                <InputNumber
                  prefix="$"
                  min={0}
                  style={{ width: '100%' }}
                  placeholder="0.00"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Sale Price"
                name="salePrice"
                rules={[{ required: true, message: 'Required' }]}
              >
                <InputNumber
                  prefix="$"
                  min={0}
                  style={{ width: '100%' }}
                  placeholder="0.00"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Stock Quantity"
            name="stock"
            rules={[{ required: true, message: 'Required' }]}
          >
            <InputNumber min={1} style={{ width: '100%' }} placeholder="100" />
          </Form.Item>

          <Form.Item
            label="Sale Period"
            name="period"
            rules={[{ required: true, message: 'Please select period' }]}
          >
            <RangePicker showTime style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Create Flash Sale
              </Button>
              <Button onClick={() => setIsFlashSaleModalVisible(false)}>Cancel</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Create Daily Deal"
        open={isDailyDealModalVisible}
        onCancel={() => setIsDailyDealModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleCreateDailyDeal}>
          <Form.Item
            label="Deal Name"
            name="name"
            rules={[{ required: true, message: 'Please enter deal name' }]}
          >
            <Input placeholder="e.g., Monday Mega Deals" />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: 'Please enter description' }]}
          >
            <Input.TextArea rows={3} placeholder="Brief description of the deal" />
          </Form.Item>

          <Form.Item
            label="Deal Date"
            name="dealDate"
            rules={[{ required: true, message: 'Please select date' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            label="Products"
            name="products"
            rules={[{ required: true, message: 'Please select products' }]}
          >
            <Select mode="multiple" placeholder="Select products for this deal">
              <Select.Option value={101}>Wireless Headphones Pro</Select.Option>
              <Select.Option value={102}>Smart Watch Series 5</Select.Option>
              <Select.Option value={103}>Ergonomic Office Chair</Select.Option>
              <Select.Option value={104}>Gaming Mouse</Select.Option>
              <Select.Option value={105}>Mechanical Keyboard</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Create Daily Deal
              </Button>
              <Button onClick={() => setIsDailyDealModalVisible(false)}>Cancel</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default FlashSalesDailyDealsPage;
