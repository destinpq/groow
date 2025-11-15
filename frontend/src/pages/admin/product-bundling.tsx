/**
 * ⚠️ SAFE API RESPONSE HANDLING - ALWAYS USE THIS PATTERN:
 * 
 * const dataArray = response?.data?.data || response?.data || [];
 * const total = response?.data?.meta?.total || response?.meta?.total || response?.total || 0;
 * 
 * Before using .map()/.filter()/.forEach():
 * setItems(Array.isArray(dataArray) ? dataArray : []);
 */

import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Table,
  Tag,
  Space,
  Button,
  Statistic,
  Progress,
  Select,
  DatePicker,
  Tabs,
  Alert,
  List,
  Avatar,
  message,
  Spin,
  Modal,
  Form,
  Input,
  InputNumber,
  Upload,
  Switch,
  Tooltip,
  Popconfirm,
  Badge,
  Divider,
  Timeline,
  Empty,
  Dropdown,
  Image,
  Checkbox,
  Radio,
  Steps,
  Transfer,
  AutoComplete,
} from 'antd';
import {
  ShoppingOutlined,
  GiftOutlined,
  BoxPlotOutlined,
  DollarOutlined,
  RiseOutlined,
  FallOutlined,
  ThunderboltOutlined,
  CalendarOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  StopOutlined,
  CopyOutlined,
  DownloadOutlined,
  BellOutlined,
  EyeOutlined,
  ShoppingCartOutlined,
  TrophyOutlined,
  TeamOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  MinusCircleOutlined,
  ReloadOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  FileTextOutlined,
  UploadOutlined,
  AppstoreAddOutlined,
  PercentageOutlined,
  StarOutlined,
  HeartOutlined,
  TagsOutlined,
  BarChartOutlined,
  LineChartOutlined,
  PieChartOutlined,
  SettingOutlined,
  BulbOutlined,
  FireOutlined,
} from '@ant-design/icons';
import { Line, Column, Pie, Area } from '@ant-design/charts';
import { formatPieLabelContent } from '@/utils/chartHelpers';
import type { ColumnsType } from 'antd/es/table';
import dayjs, { Dayjs } from 'dayjs';
import { bundlesAPI, ProductBundle, BundleProduct, BundleStats, BundleTemplate } from '../../services/api/bundles';

const { Title, Text, Paragraph } = Typography;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { TabPane } = Tabs;
const { Step } = Steps;
const { Option } = Select;

// Utility function to safely handle array operations
const safeArray = (arr: any[] | undefined | null): any[] => {
  return Array.isArray(arr) ? arr : [];
};

const ProductBundlingPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [bundles, setBundles] = useState<ProductBundle[]>([]);
  const [templates, setTemplates] = useState<BundleTemplate[]>([]);
  const [stats, setStats] = useState<BundleStats | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedBundleType, setSelectedBundleType] = useState<string>('all');
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>([
    dayjs().subtract(30, 'days'),
    dayjs(),
  ]);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedBundle, setSelectedBundle] = useState<ProductBundle | null>(null);
  const [activeTab, setActiveTab] = useState('bundles');
  const [createStep, setCreateStep] = useState(0);
  const [form] = Form.useForm();
  const [templateForm] = Form.useForm();

  // Load data
  useEffect(() => {
    loadBundles();
    loadTemplates();
    loadStats();
  }, [selectedStatus, selectedBundleType, dateRange]);

  const loadBundles = async () => {
    setLoading(true);
    try {
      const filters = {
        status: selectedStatus !== 'all' ? selectedStatus as ProductBundle['status'] : undefined,
        bundleType: selectedBundleType !== 'all' ? selectedBundleType as ProductBundle['bundleType'] : undefined,
        createdAfter: dateRange[0].format('YYYY-MM-DD'),
        createdBefore: dateRange[1].format('YYYY-MM-DD'),
        limit: 50,
      };
      const response = await bundlesAPI.getAll(filters);
      setBundles(response.bundles);
    } catch (error) {
      console.error('Error loading bundles:', error);
      message.error('Failed to load product bundles');
    } finally {
      setLoading(false);
    }
  };

  const loadTemplates = async () => {
    try {
      const templatesData = await bundlesAPI.getTemplates();
      setTemplates(templatesData);
    } catch (error) {
      console.error('Error loading templates:', error);
    }
  };

  const loadStats = async () => {
    try {
      const statsData = await bundlesAPI.getStats({
        start: dateRange[0].format('YYYY-MM-DD'),
        end: dateRange[1].format('YYYY-MM-DD'),
      });
      setStats(statsData);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleCreateBundle = async (values: any) => {
    try {
      setLoading(true);
      await bundlesAPI.create({
        name: values.name,
        description: values.description,
        bundleType: values.bundleType,
        pricingStrategy: values.pricingStrategy,
        bundlePrice: values.bundlePrice,
        discountPercentage: values.discountPercentage,
        discountAmount: values.discountAmount,
        products: values.products || [],
        minProducts: values.minProducts,
        maxProducts: values.maxProducts,
        trackInventory: values.trackInventory,
        initialStock: values.initialStock,
        tags: values.tags,
        categories: values.categories,
        visibility: values.visibility || 'public',
        promotionSettings: values.promotionSettings,
      });
      message.success('Product bundle created successfully');
      setCreateModalOpen(false);
      setCreateStep(0);
      form.resetFields();
      loadBundles();
    } catch (error) {
      console.error('Error creating bundle:', error);
      message.error('Failed to create product bundle');
    } finally {
      setLoading(false);
    }
  };

  const handleActivateBundle = async (bundleId: string) => {
    try {
      await bundlesAPI.activate(bundleId);
      message.success('Bundle activated successfully');
      loadBundles();
    } catch (error) {
      console.error('Error activating bundle:', error);
      message.error('Failed to activate bundle');
    }
  };

  const handleDeactivateBundle = async (bundleId: string) => {
    try {
      await bundlesAPI.deactivate(bundleId);
      message.success('Bundle deactivated successfully');
      loadBundles();
    } catch (error) {
      console.error('Error deactivating bundle:', error);
      message.error('Failed to deactivate bundle');
    }
  };

  const handleDeleteBundle = async (bundleId: string) => {
    try {
      await bundlesAPI.delete(bundleId);
      message.success('Bundle deleted successfully');
      loadBundles();
    } catch (error) {
      console.error('Error deleting bundle:', error);
      message.error('Failed to delete bundle');
    }
  };

  const handleDuplicateBundle = async (bundleId: string) => {
    try {
      await bundlesAPI.duplicate(bundleId, {
        name: `Copy of ${bundles.find(b => b.id === bundleId)?.name}`,
      });
      message.success('Bundle duplicated successfully');
      loadBundles();
    } catch (error) {
      console.error('Error duplicating bundle:', error);
      message.error('Failed to duplicate bundle');
    }
  };

  const handleExport = async (format: 'csv' | 'xlsx' | 'json') => {
    try {
      setLoading(true);
      const blob = await bundlesAPI.export(
        {
          status: selectedStatus !== 'all' ? selectedStatus as ProductBundle['status'] : undefined,
          bundleType: selectedBundleType !== 'all' ? selectedBundleType as ProductBundle['bundleType'] : undefined,
          createdAfter: dateRange[0].format('YYYY-MM-DD'),
          createdBefore: dateRange[1].format('YYYY-MM-DD'),
        },
        format
      );
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `product-bundles-${dayjs().format('YYYY-MM-DD')}.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      message.success(`Product bundles exported as ${format.toUpperCase()}`);
    } catch (error) {
      console.error('Export error:', error);
      message.error('Failed to export product bundles');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: ProductBundle['status']) => {
    const colors = {
      active: 'green',
      inactive: 'default',
      draft: 'blue',
      archived: 'orange',
    };
    return colors[status];
  };

  const getStatusIcon = (status: ProductBundle['status']) => {
    const icons = {
      active: <CheckCircleOutlined />,
      inactive: <PauseCircleOutlined />,
      draft: <EditOutlined />,
      archived: <MinusCircleOutlined />,
    };
    return icons[status];
  };

  const getBundleTypeColor = (type: ProductBundle['bundleType']) => {
    const colors = {
      fixed: 'blue',
      dynamic: 'green',
      mix_and_match: 'purple',
      tiered: 'orange',
    };
    return colors[type];
  };

  const getBundleTypeIcon = (type: ProductBundle['bundleType']) => {
    const icons = {
      fixed: <BoxPlotOutlined />,
      dynamic: <ThunderboltOutlined />,
      mix_and_match: <AppstoreAddOutlined />,
      tiered: <BarChartOutlined />,
    };
    return icons[type];
  };

  const bundleColumns: ColumnsType<ProductBundle> = [
    {
      title: 'Bundle Info',
      key: 'info',
      render: (_, record) => (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
            <Avatar
              src={record.featuredImage}
              icon={<GiftOutlined />}
              size="small"
              style={{ marginRight: 8 }}
            />
            <Text strong>{record.name}</Text>
          </div>
          <Text type="secondary" style={{ fontSize: '12px', display: 'block' }}>
            {record.description}
          </Text>
          <div style={{ marginTop: 4 }}>
            {safeArray(record.tags).slice(0, 2).map(tag => (
              <Tag key={tag} color="blue">{tag}</Tag>
            ))}
            {safeArray(record.tags).length > 2 && (
              <Tag>+{safeArray(record.tags).length - 2}</Tag>
            )}
          </div>
        </div>
      ),
      width: 280,
    },
    {
      title: 'Type',
      dataIndex: 'bundleType',
      key: 'bundleType',
      render: (type: ProductBundle['bundleType']) => (
        <Tag color={getBundleTypeColor(type)} icon={getBundleTypeIcon(type)}>
          {type.replace('_', ' ').toUpperCase()}
        </Tag>
      ),
      filters: [
        { text: 'Fixed', value: 'fixed' },
        { text: 'Dynamic', value: 'dynamic' },
        { text: 'Mix & Match', value: 'mix_and_match' },
        { text: 'Tiered', value: 'tiered' },
      ],
      onFilter: (value, record) => record.bundleType === value,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: ProductBundle['status']) => (
        <Tag color={getStatusColor(status)} icon={getStatusIcon(status)}>
          {status.toUpperCase()}
        </Tag>
      ),
      filters: [
        { text: 'Active', value: 'active' },
        { text: 'Inactive', value: 'inactive' },
        { text: 'Draft', value: 'draft' },
        { text: 'Archived', value: 'archived' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Products',
      dataIndex: 'products',
      key: 'products',
      render: (products: BundleProduct[]) => (
        <div>
          <Text strong>{products.length}</Text>
          <div style={{ fontSize: '12px', color: '#666' }}>
            products
          </div>
          {products.some(p => p.isRequired) && (
            <Tag color="red">Required Items</Tag>
          )}
        </div>
      ),
    },
    {
      title: 'Pricing',
      key: 'pricing',
      render: (_, record) => (
        <div>
          <div>
            <Text strong style={{ color: '#52c41a', fontSize: '16px' }}>
              ${record.bundlePrice || record.originalPrice}
            </Text>
          </div>
          {record.originalPrice !== (record.bundlePrice || record.originalPrice) && (
            <div>
              <Text delete style={{ color: '#999', fontSize: '12px' }}>
                ${record.originalPrice}
              </Text>
              <Tag color="green" style={{ marginLeft: 4 }}>
                {record.savingsPercentage.toFixed(0)}% OFF
              </Tag>
            </div>
          )}
          <div style={{ fontSize: '12px', color: '#666' }}>
            {record.pricingStrategy.replace('_', ' ')}
          </div>
        </div>
      ),
    },
    {
      title: 'Inventory',
      key: 'inventory',
      render: (_, record) => (
        <div>
          <div>
            <Text strong>{record.inventory.availableStock}</Text>
            <Text type="secondary"> / {record.inventory.totalStock}</Text>
          </div>
          <div style={{ marginTop: 4 }}>
            <Progress
              percent={(record.inventory.availableStock / record.inventory.totalStock) * 100}
              size="small"
              strokeColor={
                record.inventory.availableStock <= record.inventory.lowStockThreshold 
                  ? '#ff4d4f' 
                  : '#52c41a'
              }
            />
          </div>
          <Tag 
            color={record.stockStatus === 'in_stock' ? 'green' : 
                  record.stockStatus === 'low_stock' ? 'orange' : 'red'}
          >
            {record.stockStatus.replace('_', ' ').toUpperCase()}
          </Tag>
        </div>
      ),
    },
    {
      title: 'Performance',
      key: 'performance',
      render: (_, record) => (
        <div>
          <div style={{ fontSize: '12px' }}>
            <Text strong style={{ color: '#52c41a' }}>
              ${record.analytics.totalRevenue.toLocaleString()}
            </Text>
          </div>
          <div style={{ fontSize: '12px' }}>
            {record.analytics.totalSales} sales
          </div>
          <div style={{ fontSize: '12px' }}>
            {record.analytics.conversionRate.toFixed(1)}% conv.
          </div>
          <div style={{ fontSize: '12px' }}>
            {record.analytics.totalViews} views
          </div>
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          {record.status === 'inactive' || record.status === 'draft' ? (
            <Tooltip title="Activate">
              <Button
                type="text"
                icon={<PlayCircleOutlined />}
                onClick={() => handleActivateBundle(record.id)}
                style={{ color: '#52c41a' }}
              />
            </Tooltip>
          ) : (
            <Tooltip title="Deactivate">
              <Button
                type="text"
                icon={<PauseCircleOutlined />}
                onClick={() => handleDeactivateBundle(record.id)}
                style={{ color: '#faad14' }}
              />
            </Tooltip>
          )}
          <Tooltip title="Edit">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => {
                setSelectedBundle(record);
                setEditModalOpen(true);
              }}
            />
          </Tooltip>
          <Tooltip title="Duplicate">
            <Button
              type="text"
              icon={<CopyOutlined />}
              onClick={() => handleDuplicateBundle(record.id)}
            />
          </Tooltip>
          <Tooltip title="Analytics">
            <Button
              type="text"
              icon={<LineChartOutlined />}
              onClick={() => {
                // Navigate to analytics view
                message.info('Bundle analytics view');
              }}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Popconfirm
              title="Are you sure you want to delete this bundle?"
              onConfirm={() => handleDeleteBundle(record.id)}
              okText="Delete"
              cancelText="Cancel"
              okButtonProps={{ danger: true }}
            >
              <Button
                type="text"
                icon={<DeleteOutlined />}
                danger
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  const exportMenuItems = [
    {
      key: 'csv',
      label: (
        <Space>
          <FileTextOutlined />
          Export as CSV
        </Space>
      ),
      onClick: () => handleExport('csv'),
    },
    {
      key: 'xlsx',
      label: (
        <Space>
          <FileExcelOutlined />
          Export as Excel
        </Space>
      ),
      onClick: () => handleExport('xlsx'),
    },
    {
      key: 'json',
      label: (
        <Space>
          <FileTextOutlined />
          Export as JSON
        </Space>
      ),
      onClick: () => handleExport('json'),
    },
  ];

  const revenueChartData = bundles.map(bundle => ({
    name: bundle.name,
    revenue: bundle.analytics.totalRevenue,
    sales: bundle.analytics.totalSales,
    conversion: bundle.analytics.conversionRate,
  }));

  const typeDistribution = [
    { type: 'Fixed', value: bundles.filter(b => b.bundleType === 'fixed').length },
    { type: 'Dynamic', value: bundles.filter(b => b.bundleType === 'dynamic').length },
    { type: 'Mix & Match', value: bundles.filter(b => b.bundleType === 'mix_and_match').length },
    { type: 'Tiered', value: bundles.filter(b => b.bundleType === 'tiered').length },
  ].filter(item => item.value > 0);

  const createSteps = [
    {
      title: 'Basic Info',
      description: 'Bundle details and type',
    },
    {
      title: 'Products',
      description: 'Select and configure products',
    },
    {
      title: 'Pricing',
      description: 'Set pricing strategy',
    },
    {
      title: 'Settings',
      description: 'Inventory and promotion settings',
    },
  ];

  return (
    <Spin spinning={loading} tip="Loading product bundles data...">
      <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <Title level={3}>
                <GiftOutlined style={{ color: '#722ed1' }} /> Product Bundling
              </Title>
              <Paragraph type="secondary">
                Create and manage product bundles with flexible pricing strategies and inventory tracking
              </Paragraph>
            </div>
            <Space>
              <Select
                value={selectedStatus}
                onChange={setSelectedStatus}
                style={{ width: 120 }}
              >
                <Option value="all">All Status</Option>
                <Option value="active">Active</Option>
                <Option value="inactive">Inactive</Option>
                <Option value="draft">Draft</Option>
                <Option value="archived">Archived</Option>
              </Select>
              <Select
                value={selectedBundleType}
                onChange={setSelectedBundleType}
                style={{ width: 140 }}
              >
                <Option value="all">All Types</Option>
                <Option value="fixed">Fixed</Option>
                <Option value="dynamic">Dynamic</Option>
                <Option value="mix_and_match">Mix & Match</Option>
                <Option value="tiered">Tiered</Option>
              </Select>
              <RangePicker
                value={dateRange}
                onChange={(dates) => dates && setDateRange(dates as [Dayjs, Dayjs])}
              />
              <Dropdown menu={{ items: exportMenuItems }} placement="bottomRight">
                <Button icon={<DownloadOutlined />}>
                  Export
                </Button>
              </Dropdown>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setCreateModalOpen(true)}
              >
                Create Bundle
              </Button>
            </Space>
          </div>
        </div>

        {/* Alert */}
        <Alert
          message="Product Bundling Management"
          description="Create flexible product bundles with custom pricing strategies, inventory management, and promotional features. Track performance and optimize bundle configurations for maximum sales."
          type="info"
          showIcon
          closable
          style={{ marginBottom: 24 }}
        />

        {/* Statistics */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Total Bundles"
                value={stats?.totalBundles || 0}
                prefix={<BoxPlotOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Active Bundles"
                value={stats?.activeBundles || 0}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: '#52c41a' }}
                suffix={
                  <Tag color="green" icon={<RiseOutlined />}>
                    Live
                  </Tag>
                }
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Bundle Revenue"
                value={stats?.totalRevenue || 0}
                prefix={<DollarOutlined />}
                valueStyle={{ color: '#722ed1' }}
                precision={2}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Avg Order Value"
                value={stats?.averageOrderValue || 0}
                prefix={<TrophyOutlined />}
                valueStyle={{ color: '#faad14' }}
                precision={2}
              />
            </Card>
          </Col>
        </Row>

        {/* Main Content */}
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane
            tab={
              <span>
                <GiftOutlined />
                Product Bundles ({bundles.length})
              </span>
            }
            key="bundles"
          >
            <Card>
              <Table
                columns={bundleColumns}
                dataSource={bundles}
                rowKey="id"
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total, range) =>
                    `${range[0]}-${range[1]} of ${total} bundles`,
                }}
                scroll={{ x: 1400 }}
              />
            </Card>
          </TabPane>

          <TabPane
            tab={
              <span>
                <SettingOutlined />
                Templates ({templates.length})
              </span>
            }
            key="templates"
          >
            <Row gutter={[16, 16]}>
              {templates.map(template => (
                <Col xs={24} sm={12} md={8} lg={6} key={template.id}>
                  <Card
                    hoverable
                    actions={[
                      <Tooltip title="Use Template">
                        <Button
                          type="text"
                          icon={<PlusOutlined />}
                          onClick={() => {
                            // Apply template logic
                            message.info('Template applied');
                          }}
                        />
                      </Tooltip>,
                      <Tooltip title="Edit Template">
                        <Button type="text" icon={<EditOutlined />} />
                      </Tooltip>,
                      <Tooltip title="Delete Template">
                        <Button type="text" icon={<DeleteOutlined />} danger />
                      </Tooltip>,
                    ]}
                  >
                    <Card.Meta
                      title={template.name}
                      description={
                        <div>
                          <Paragraph ellipsis={{ rows: 2 }} style={{ marginBottom: 8 }}>
                            {template.description}
                          </Paragraph>
                          <Tag color={getBundleTypeColor(template.bundleType)}>
                            {template.bundleType.replace('_', ' ').toUpperCase()}
                          </Tag>
                          <Tag color="blue">
                            {template.pricingStrategy.replace('_', ' ')}
                          </Tag>
                          <div style={{ marginTop: 8, fontSize: '12px', color: '#666' }}>
                            Used {template.usageCount} times
                          </div>
                        </div>
                      }
                    />
                  </Card>
                </Col>
              ))}
              {templates.length === 0 && (
                <Col span={24}>
                  <Empty description="No bundle templates found">
                    <Button type="primary" icon={<PlusOutlined />}>
                      Create Template
                    </Button>
                  </Empty>
                </Col>
              )}
            </Row>
          </TabPane>

          <TabPane
            tab={
              <span>
                <BarChartOutlined />
                Analytics
              </span>
            }
            key="analytics"
          >
            <Row gutter={[16, 16]}>
              <Col xs={24} lg={16}>
                <Card title="Bundle Revenue Performance">
                  <Column
                    data={revenueChartData}
                    xField="name"
                    yField="revenue"
                    label={{
                      position: 'top',
                      style: {
                        fill: '#000000',
                        opacity: 0.6,
                      },
                    }}
                    meta={{
                      revenue: {
                        formatter: (v: number) => `$${(v / 1000).toFixed(1)}k`,
                      },
                    }}
                    height={300}
                  />
                </Card>
              </Col>
              <Col xs={24} lg={8}>
                <Card title="Bundle Type Distribution">
                  <Pie
                    data={typeDistribution}
                    angleField="value"
                    colorField="type"
                    radius={0.8}
                    label={{
                      type: 'outer',
                      content: formatPieLabelContent,
                    }}
                    interactions={[{ type: 'element-active' }]}
                    height={300}
                  />
                </Card>
              </Col>
            </Row>
          </TabPane>
        </Tabs>

        {/* Create Bundle Modal */}
        <Modal
          title={
            <div>
              <GiftOutlined style={{ marginRight: 8 }} />
              Create Product Bundle
            </div>
          }
          open={createModalOpen}
          onCancel={() => {
            setCreateModalOpen(false);
            setCreateStep(0);
            form.resetFields();
          }}
          footer={null}
          width={900}
          bodyStyle={{ padding: '24px 0' }}
        >
          <Steps current={createStep} style={{ marginBottom: 24 }}>
            {createSteps.map(step => (
              <Step key={step.title} title={step.title} description={step.description} />
            ))}
          </Steps>

          <Form
            form={form}
            layout="vertical"
            onFinish={handleCreateBundle}
          >
            {createStep === 0 && (
              <div style={{ padding: '0 24px' }}>
                <Row gutter={16}>
                  <Col span={24}>
                    <Form.Item
                      name="name"
                      label="Bundle Name"
                      rules={[{ required: true, message: 'Please enter bundle name' }]}
                    >
                      <Input placeholder="Enter bundle name" />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item
                      name="description"
                      label="Description"
                      rules={[{ required: true, message: 'Please enter description' }]}
                    >
                      <TextArea rows={3} placeholder="Enter bundle description" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="bundleType"
                      label="Bundle Type"
                      rules={[{ required: true, message: 'Please select bundle type' }]}
                    >
                      <Select placeholder="Select bundle type">
                        <Option value="fixed">Fixed Bundle</Option>
                        <Option value="dynamic">Dynamic Bundle</Option>
                        <Option value="mix_and_match">Mix & Match</Option>
                        <Option value="tiered">Tiered Pricing</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="visibility"
                      label="Visibility"
                    >
                      <Select defaultValue="public">
                        <Option value="public">Public</Option>
                        <Option value="private">Private</Option>
                        <Option value="members_only">Members Only</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
              </div>
            )}

            {createStep === 1 && (
              <div style={{ padding: '0 24px' }}>
                <Alert
                  message="Product Selection"
                  description="Select products to include in this bundle. You can specify quantities and requirements for each product."
                  type="info"
                  style={{ marginBottom: 16 }}
                />
                <Empty description="Product selection interface would go here" />
              </div>
            )}

            {createStep === 2 && (
              <div style={{ padding: '0 24px' }}>
                <Row gutter={16}>
                  <Col span={24}>
                    <Form.Item
                      name="pricingStrategy"
                      label="Pricing Strategy"
                      rules={[{ required: true, message: 'Please select pricing strategy' }]}
                    >
                      <Radio.Group>
                        <Radio value="fixed_price">Fixed Price</Radio>
                        <Radio value="percentage_discount">Percentage Discount</Radio>
                        <Radio value="fixed_discount">Fixed Discount</Radio>
                        <Radio value="dynamic_pricing">Dynamic Pricing</Radio>
                      </Radio.Group>
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      name="bundlePrice"
                      label="Bundle Price ($)"
                    >
                      <InputNumber
                        style={{ width: '100%' }}
                        placeholder="0.00"
                        min={0}
                        precision={2}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      name="discountPercentage"
                      label="Discount (%)"
                    >
                      <InputNumber
                        style={{ width: '100%' }}
                        placeholder="0"
                        min={0}
                        max={100}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      name="discountAmount"
                      label="Discount Amount ($)"
                    >
                      <InputNumber
                        style={{ width: '100%' }}
                        placeholder="0.00"
                        min={0}
                        precision={2}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </div>
            )}

            {createStep === 3 && (
              <div style={{ padding: '0 24px' }}>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="trackInventory"
                      label="Track Inventory"
                      valuePropName="checked"
                    >
                      <Switch />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="initialStock"
                      label="Initial Stock"
                    >
                      <InputNumber
                        style={{ width: '100%' }}
                        placeholder="0"
                        min={0}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item
                      name="tags"
                      label="Tags"
                    >
                      <Select
                        mode="tags"
                        placeholder="Add tags"
                        style={{ width: '100%' }}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </div>
            )}

            <div style={{ textAlign: 'right', marginTop: 24, padding: '0 24px' }}>
              <Space>
                {createStep > 0 && (
                  <Button onClick={() => setCreateStep(createStep - 1)}>
                    Previous
                  </Button>
                )}
                <Button onClick={() => {
                  setCreateModalOpen(false);
                  setCreateStep(0);
                  form.resetFields();
                }}>
                  Cancel
                </Button>
                {createStep < createSteps.length - 1 ? (
                  <Button type="primary" onClick={() => setCreateStep(createStep + 1)}>
                    Next
                  </Button>
                ) : (
                  <Button type="primary" htmlType="submit" loading={loading}>
                    Create Bundle
                  </Button>
                )}
              </Space>
            </div>
          </Form>
        </Modal>
      </div>
    </Spin>
  );
};

export default ProductBundlingPage;
