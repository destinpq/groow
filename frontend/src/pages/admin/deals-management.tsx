/**
 * SAFE API RESPONSE HANDLING - APPLY THIS PATTERN:
 * const dataArray = response?.data?.data || response?.data || [];
 * const total = response?.data?.meta?.total || response?.meta?.total || response?.total || 0;
 * Always check: Array.isArray(data) before .map()/.filter()
 */

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
  InputNumber,
  Select,
  DatePicker,
  Switch,
  Upload,
  message,
  Statistic,
  Progress,
  Alert,
  Divider,
  Tooltip,
  Tabs,
  Badge,
  Spin,
  Empty,
} from 'antd';
import {
  DollarOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  CopyOutlined,
  BarChartOutlined,
  FireOutlined,
  GiftOutlined,
  UploadOutlined,
  CalendarOutlined,
  TagsOutlined,
  TrophyOutlined,
  RiseOutlined,
  ThunderboltOutlined,
  StarOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs, { Dayjs } from 'dayjs';
import { dealsAPI } from '@/services/api/deals';
import type { Deal, CreateDealDto, UpdateDealDto, DealStats, DealAnalytics } from '@/services/api/deals';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { TabPane } = Tabs;

// Utility function to safely handle array operations
const safeArray = (arr: any[] | undefined | null): any[] => {
  return Array.isArray(arr) ? arr : [];
};

// Utility function to sanitize deal data
const sanitizeDeal = (deal: any): Deal => {
  return {
    ...deal,
    tags: safeArray(deal.tags),
    categories: safeArray(deal.categories),
    products: safeArray(deal.products),
  };
};

const DealsManagementPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [stats, setStats] = useState<DealStats | null>(null);
  const [analytics, setAnalytics] = useState<DealAnalytics | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAnalyticsModalVisible, setIsAnalyticsModalVisible] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [activeTab, setActiveTab] = useState('1');
  const [filters, setFilters] = useState({
    type: 'all',
    isActive: 'all',
    targetType: 'all',
  });
  const [form] = Form.useForm();

  useEffect(() => {
    fetchDeals();
    fetchStats();
  }, [filters]);

  const fetchDeals = async () => {
    try {
      setLoading(true);
      const filterParams: any = {};
      if (filters.type !== 'all') filterParams.type = filters.type;
      if (filters.isActive !== 'all') filterParams.isActive = filters.isActive === 'true';
      if (filters.targetType !== 'all') filterParams.targetType = filters.targetType;

      const response = await dealsAPI.getAll(filterParams);
      const dealsData = response?.data?.data || response?.data || [] || response;
      const sanitizedDeals = Array.isArray(dealsData) ? dealsData.map(sanitizeDeal) : [];
      setDeals(sanitizedDeals);
    } catch (error) {
      message.error('Failed to load deals');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const statsData = await dealsAPI.getStats();
      setStats(statsData);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const fetchAnalytics = async (dealId: number) => {
    try {
      const analyticsData = await dealsAPI.getAnalytics(dealId);
      setAnalytics(analyticsData);
      setIsAnalyticsModalVisible(true);
    } catch (error) {
      message.error('Failed to load analytics');
    }
  };

  const handleCreate = () => {
    setSelectedDeal(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (deal: Deal) => {
    setSelectedDeal(deal);
    form.setFieldsValue({
      ...deal,
      dateRange: [dayjs(deal.startDate), dayjs(deal.endDate)],
    });
    setIsModalVisible(true);
  };

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      const [startDate, endDate] = values.dateRange;
      
      const dealData: CreateDealDto | UpdateDealDto = {
        title: values.title,
        description: values.description,
        type: values.type,
        value: values.value,
        minPurchase: values.minPurchase || 0,
        maxDiscount: values.maxDiscount,
        targetType: values.targetType,
        targetValue: values.targetValue,
        startDate: startDate.format('YYYY-MM-DD'),
        endDate: endDate.format('YYYY-MM-DD'),
        usageLimit: values.usageLimit,
        priority: values.priority || 1,
        bannerText: values.bannerText,
        termsAndConditions: values.termsAndConditions,
        stackable: values.stackable || false,
        autoApply: values.autoApply || false,
        requiredQuantity: values.requiredQuantity,
        freeQuantity: values.freeQuantity,
        categories: values.categories,
        products: values.products,
        tags: values.tags || [],
      };

      if (selectedDeal) {
        await dealsAPI.update(selectedDeal.id, dealData);
        message.success('Deal updated successfully');
      } else {
        await dealsAPI.create(dealData as CreateDealDto);
        message.success('Deal created successfully');
      }

      setIsModalVisible(false);
      await fetchDeals();
      await fetchStats();
    } catch (error) {
      message.error(selectedDeal ? 'Failed to update deal' : 'Failed to create deal');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: 'Delete Deal',
      content: 'Are you sure you want to delete this deal? This action cannot be undone.',
      okText: 'Delete',
      okType: 'danger',
      onOk: async () => {
        try {
          await dealsAPI.delete(id);
          message.success('Deal deleted successfully');
          await fetchDeals();
          await fetchStats();
        } catch (error) {
          message.error('Failed to delete deal');
        }
      },
    });
  };

  const handleToggleStatus = async (id: number) => {
    try {
      await dealsAPI.toggleStatus(id);
      message.success('Deal status updated successfully');
      await fetchDeals();
      await fetchStats();
    } catch (error) {
      message.error('Failed to update deal status');
    }
  };

  const handleDuplicate = async (id: number) => {
    try {
      await dealsAPI.duplicate(id);
      message.success('Deal duplicated successfully');
      await fetchDeals();
    } catch (error) {
      message.error('Failed to duplicate deal');
    }
  };

  const getStatusConfig = (deal: Deal) => {
    const now = dayjs();
    const startDate = dayjs(deal.startDate);
    const endDate = dayjs(deal.endDate);

    if (!deal.isActive) {
      return { color: 'red', text: 'Inactive', icon: null };
    }
    
    if (now.isBefore(startDate)) {
      return { color: 'blue', text: 'Upcoming', icon: <CalendarOutlined /> };
    }
    
    if (now.isAfter(endDate)) {
      return { color: 'default', text: 'Expired', icon: null };
    }
    
    if (deal.usageCount >= deal.usageLimit) {
      return { color: 'orange', text: 'Sold Out', icon: null };
    }
    
    return { color: 'green', text: 'Active', icon: <FireOutlined /> };
  };

  const columns: ColumnsType<Deal> = [
    {
      title: 'Deal Information',
      key: 'info',
      render: (_, record) => (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
            <Text strong style={{ fontSize: 16, marginRight: 8 }}>
              {record.title}
            </Text>
            <Badge count={record.priority} color="purple" />
          </div>
          <Paragraph
            type="secondary"
            style={{ margin: 0, fontSize: 12 }}
            ellipsis={{ rows: 2 }}
          >
            {record.description}
          </Paragraph>
          {safeArray(record.tags).length > 0 && (
            <div style={{ marginTop: 4 }}>
              {safeArray(record.tags).slice(0, 2).map(tag => (
                <Tag key={tag}>{tag}</Tag>
              ))}
              {safeArray(record.tags).length > 2 && (
                <Tag>+{safeArray(record.tags).length - 2}</Tag>
              )}
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Type & Value',
      key: 'typeValue',
      render: (_, record) => {
        const typeConfig = {
          percentage: { icon: <DollarOutlined />, text: `${record.value}% OFF`, color: 'blue' },
          fixed: { icon: <DollarOutlined />, text: `$${record.value} OFF`, color: 'green' },
          'buy-x-get-y': { icon: <GiftOutlined />, text: `Buy ${record.requiredQuantity} Get ${record.freeQuantity} Free`, color: 'purple' },
          bundle: { icon: <TagsOutlined />, text: 'Bundle Deal', color: 'orange' },
          'flash-sale': { icon: <ThunderboltOutlined />, text: 'Flash Sale', color: 'red' },
        };
        const config = typeConfig[record.type];
        return (
          <div>
            <Tag icon={config.icon} color={config.color}>
              {config.text}
            </Tag>
            {record.minPurchase > 0 && (
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
      title: 'Target Audience',
      dataIndex: 'targetType',
      key: 'targetType',
      render: (targetType, record) => {
        const targetConfig = {
          all: { color: 'default', text: 'All Customers' },
          'new-customers': { color: 'green', text: 'New Customers' },
          vip: { color: 'gold', text: 'VIP Customers' },
          category: { color: 'blue', text: `Category: ${record.targetValue}` },
          product: { color: 'purple', text: `Product: ${record.targetValue}` },
        };
        const config = targetConfig[targetType];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: 'Performance',
      key: 'performance',
      render: (_, record) => {
        const usagePercent = (record.usageCount / record.usageLimit) * 100;
        const conversionColor = record.conversionRate >= 10 ? 'green' : record.conversionRate >= 5 ? 'orange' : 'red';
        
        return (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
              <Text style={{ fontSize: 12, marginRight: 8 }}>
                Usage: {record.usageCount} / {record.usageLimit}
              </Text>
              <Tooltip title={`${usagePercent.toFixed(1)}% used`}>
                <Progress
                  percent={usagePercent}
                  size="small"
                  showInfo={false}
                  style={{ width: 60 }}
                />
              </Tooltip>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Text style={{ fontSize: 12 }}>
                Revenue: ${record.revenueGenerated.toLocaleString()}
              </Text>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Text style={{ fontSize: 12, color: conversionColor }}>
                CVR: {record.conversionRate.toFixed(1)}%
              </Text>
              <Text style={{ fontSize: 12 }}>
                Clicks: {record.clickCount}
              </Text>
            </div>
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
            {record.isActive && daysLeft > 0 && (
              <Text type={daysLeft < 3 ? 'danger' : 'secondary'} style={{ fontSize: 12 }}>
                {daysLeft === 0 ? 'Expires today' : `${daysLeft} days left`}
              </Text>
            )}
          </div>
        );
      },
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, record) => {
        const status = getStatusConfig(record);
        return (
          <Tag color={status.color} icon={status.icon}>
            {status.text}
          </Tag>
        );
      },
      filters: [
        { text: 'Active', value: 'active' },
        { text: 'Inactive', value: 'inactive' },
        { text: 'Upcoming', value: 'upcoming' },
        { text: 'Expired', value: 'expired' },
      ],
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="View Analytics">
            <Button
              size="small"
              icon={<BarChartOutlined />}
              onClick={() => fetchAnalytics(record.id)}
            />
          </Tooltip>
          <Tooltip title="Edit Deal">
            <Button
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Tooltip title="Duplicate">
            <Button
              size="small"
              icon={<CopyOutlined />}
              onClick={() => handleDuplicate(record.id)}
            />
          </Tooltip>
          <Tooltip title={record.isActive ? 'Deactivate' : 'Activate'}>
            <Button
              size="small"
              type={record.isActive ? 'primary' : 'default'}
              onClick={() => handleToggleStatus(record.id)}
            >
              {record.isActive ? 'Active' : 'Inactive'}
            </Button>
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              size="small"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record.id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Spin spinning={loading}>
      <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
        <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
          <Col>
            <Title level={3}>
              <FireOutlined style={{ color: '#ff4d4f' }} /> Deals Management
            </Title>
            <Paragraph type="secondary">
              Create and manage promotional deals to drive sales and engagement
            </Paragraph>
          </Col>
          <Col>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
              Create Deal
            </Button>
          </Col>
        </Row>

        {/* Statistics Cards */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={8}>
            <Card>
              <Statistic
                title="Active Deals"
                value={stats?.active || 0}
                prefix={<FireOutlined />}
                suffix={`/ ${stats?.total || 0}`}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card>
              <Statistic
                title="Total Revenue"
                value={stats?.totalRevenue || 0}
                prefix={<DollarOutlined />}
                precision={0}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card>
              <Statistic
                title="Avg Conversion Rate"
                value={stats?.avgConversionRate || 0}
                suffix="%"
                precision={1}
                prefix={<RiseOutlined />}
                valueStyle={{ color: '#fa8c16' }}
              />
            </Card>
          </Col>
        </Row>

        {/* Top Performing Deal */}
        {stats?.topPerformingDeal && (
          <Alert
            message={
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <TrophyOutlined style={{ color: '#faad14' }} />
                <Text strong>Top Performing Deal: {stats.topPerformingDeal.title}</Text>
              </div>
            }
            description={`Generated ${stats.topPerformingDeal.revenue.toLocaleString()} in revenue with ${stats.topPerformingDeal.conversions} conversions`}
            type="success"
            showIcon={false}
            style={{ marginBottom: 16 }}
          />
        )}

        {/* Filters */}
        <Card style={{ marginBottom: 16 }}>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={8}>
              <Select
                placeholder="Deal Type"
                value={filters.type}
                onChange={(value) => setFilters({ ...filters, type: value })}
                style={{ width: '100%' }}
              >
                <Option value="all">All Types</Option>
                <Option value="percentage">Percentage</Option>
                <Option value="fixed">Fixed Amount</Option>
                <Option value="buy-x-get-y">Buy X Get Y</Option>
                <Option value="bundle">Bundle</Option>
                <Option value="flash-sale">Flash Sale</Option>
              </Select>
            </Col>
            <Col xs={24} sm={8}>
              <Select
                placeholder="Status"
                value={filters.isActive}
                onChange={(value) => setFilters({ ...filters, isActive: value })}
                style={{ width: '100%' }}
              >
                <Option value="all">All Status</Option>
                <Option value="true">Active</Option>
                <Option value="false">Inactive</Option>
              </Select>
            </Col>
            <Col xs={24} sm={8}>
              <Select
                placeholder="Target Audience"
                value={filters.targetType}
                onChange={(value) => setFilters({ ...filters, targetType: value })}
                style={{ width: '100%' }}
              >
                <Option value="all">All Audiences</Option>
                <Option value="all">All Customers</Option>
                <Option value="new-customers">New Customers</Option>
                <Option value="vip">VIP Customers</Option>
                <Option value="category">Category Specific</Option>
                <Option value="product">Product Specific</Option>
              </Select>
            </Col>
          </Row>
        </Card>

        {/* Deals Table */}
        <Card title="All Deals">
          <Table
            columns={columns}
            dataSource={deals}
            rowKey="id"
            scroll={{ x: 1400 }}
            pagination={{
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} deals`,
            }}
          />
        </Card>

        {/* Create/Edit Deal Modal */}
        <Modal
          title={selectedDeal ? 'Edit Deal' : 'Create New Deal'}
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
          width={800}
        >
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  label="Deal Title"
                  name="title"
                  rules={[{ required: true, message: 'Please enter deal title' }]}
                >
                  <Input placeholder="Summer Sale 2025" />
                </Form.Item>
              </Col>
              
              <Col span={24}>
                <Form.Item
                  label="Description"
                  name="description"
                  rules={[{ required: true, message: 'Please enter description' }]}
                >
                  <TextArea rows={3} placeholder="Detailed description of the deal..." />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  label="Deal Type"
                  name="type"
                  rules={[{ required: true, message: 'Please select deal type' }]}
                >
                  <Select placeholder="Select type">
                    <Option value="percentage">Percentage Discount</Option>
                    <Option value="fixed">Fixed Amount Discount</Option>
                    <Option value="buy-x-get-y">Buy X Get Y Free</Option>
                    <Option value="bundle">Bundle Deal</Option>
                    <Option value="flash-sale">Flash Sale</Option>
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
                    return (
                      <Form.Item
                        label={type === 'percentage' ? 'Discount %' : 'Discount Value'}
                        name="value"
                        rules={[{ required: true, message: 'Please enter value' }]}
                      >
                        <InputNumber
                          style={{ width: '100%' }}
                          min={1}
                          max={type === 'percentage' ? 100 : undefined}
                          suffix={type === 'percentage' ? '%' : undefined}
                          prefix={type === 'fixed' ? '$' : undefined}
                          placeholder={type === 'percentage' ? '20' : '50'}
                        />
                      </Form.Item>
                    );
                  }}
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item label="Minimum Purchase" name="minPurchase">
                  <InputNumber
                    style={{ width: '100%' }}
                    min={0}
                    prefix="$"
                    placeholder="100"
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item label="Maximum Discount" name="maxDiscount">
                  <InputNumber
                    style={{ width: '100%' }}
                    min={1}
                    prefix="$"
                    placeholder="200"
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  label="Target Audience"
                  name="targetType"
                  rules={[{ required: true, message: 'Please select target audience' }]}
                >
                  <Select placeholder="Select audience">
                    <Option value="all">All Customers</Option>
                    <Option value="new-customers">New Customers</Option>
                    <Option value="vip">VIP Customers</Option>
                    <Option value="category">Specific Category</Option>
                    <Option value="product">Specific Product</Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item label="Target Value" name="targetValue">
                  <Input placeholder="Category name or Product ID" />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item
                  label="Valid Period"
                  name="dateRange"
                  rules={[{ required: true, message: 'Please select valid period' }]}
                >
                  <RangePicker style={{ width: '100%' }} />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  label="Usage Limit"
                  name="usageLimit"
                  rules={[{ required: true, message: 'Please enter usage limit' }]}
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    min={1}
                    placeholder="1000"
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item label="Priority" name="priority">
                  <InputNumber
                    style={{ width: '100%' }}
                    min={1}
                    max={10}
                    placeholder="1"
                  />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item label="Banner Text" name="bannerText">
                  <Input placeholder="Limited time offer! Save big on summer collection" />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item label="Terms and Conditions" name="termsAndConditions">
                  <TextArea rows={3} placeholder="Enter terms and conditions..." />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item name="stackable" valuePropName="checked">
                  <Switch /> <Text style={{ marginLeft: 8 }}>Stackable with other deals</Text>
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item name="autoApply" valuePropName="checked">
                  <Switch /> <Text style={{ marginLeft: 8 }}>Auto-apply at checkout</Text>
                </Form.Item>
              </Col>
            </Row>

            <Divider />

            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit" icon={<FireOutlined />}>
                  {selectedDeal ? 'Update Deal' : 'Create Deal'}
                </Button>
                <Button onClick={() => setIsModalVisible(false)}>
                  Cancel
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>

        {/* Analytics Modal */}
        <Modal
          title={analytics ? `Analytics: ${analytics.name}` : 'Deal Analytics'}
          open={isAnalyticsModalVisible}
          onCancel={() => setIsAnalyticsModalVisible(false)}
          footer={null}
          width={900}
        >
          {analytics && (
            <Tabs defaultActiveKey="1">
              <TabPane tab="Overview" key="1">
                <Row gutter={[16, 16]}>
                  <Col span={8}>
                    <Card size="small">
                      <Statistic
                        title="Total Clicks"
                        value={analytics.clicks}
                        prefix={<EyeOutlined />}
                      />
                    </Card>
                  </Col>
                  <Col span={8}>
                    <Card size="small">
                      <Statistic
                        title="Conversions"
                        value={analytics.conversions}
                        prefix={<StarOutlined />}
                      />
                    </Card>
                  </Col>
                  <Col span={8}>
                    <Card size="small">
                      <Statistic
                        title="Revenue"
                        value={analytics.revenue}
                        prefix="$"
                        precision={2}
                      />
                    </Card>
                  </Col>
                  <Col span={12}>
                    <Card size="small">
                      <Statistic
                        title="Conversion Rate"
                        value={analytics.conversionRate}
                        suffix="%"
                        precision={1}
                      />
                    </Card>
                  </Col>
                  <Col span={12}>
                    <Card size="small">
                      <Statistic
                        title="Avg Order Value"
                        value={analytics.conversions > 0 ? analytics.revenue / analytics.conversions : 0}
                        prefix="$"
                        precision={2}
                      />
                    </Card>
                  </Col>
                </Row>
              </TabPane>
              <TabPane tab="Top Products" key="2">
                {analytics.topProducts && analytics.topProducts.length > 0 ? (
                  <Table
                    dataSource={analytics.topProducts}
                    columns={[
                      { title: 'Product', dataIndex: 'productName', key: 'productName' },
                      { title: 'Sales', dataIndex: 'sales', key: 'sales' },
                      { title: 'Revenue', dataIndex: 'revenue', key: 'revenue', render: (value) => `$${value.toFixed(2)}` },
                    ]}
                    pagination={false}
                    size="small"
                  />
                ) : (
                  <Empty description="No product data available" />
                )}
              </TabPane>
            </Tabs>
          )}
        </Modal>
      </div>
    </Spin>
  );
};

export default DealsManagementPage;