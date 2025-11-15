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
} from 'antd';
import {
  ShoppingOutlined,
  FireOutlined,
  ClockCircleOutlined,
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
  GiftOutlined,
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
} from '@ant-design/icons';
import { Line, Column, Pie, Area } from '@ant-design/charts';
import { formatPieLabelContent } from '@/utils/chartHelpers';
import type { ColumnsType } from 'antd/es/table';
import dayjs, { Dayjs } from 'dayjs';
import { flashSalesAPI, FlashSale, FlashSaleProduct, DailyDeal, FlashSaleStats } from '../../services/api/flashSales';

const { Title, Text, Paragraph } = Typography;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { TabPane } = Tabs;

interface CountdownState {
  [key: string]: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isActive: boolean;
  };
}

const FlashSalesPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [flashSales, setFlashSales] = useState<FlashSale[]>([]);
  const [dailyDeals, setDailyDeals] = useState<DailyDeal[]>([]);
  const [stats, setStats] = useState<FlashSaleStats | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>([
    dayjs().subtract(7, 'days'),
    dayjs().add(7, 'days'),
  ]);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState<FlashSale | null>(null);
  const [countdowns, setCountdowns] = useState<CountdownState>({});
  const [activeTab, setActiveTab] = useState('flashSales');
  const [form] = Form.useForm();

  // Load data
  useEffect(() => {
    loadFlashSales();
    loadDailyDeals();
    loadStats();
  }, [selectedStatus, dateRange]);

  // Update countdowns every second
  useEffect(() => {
    const interval = setInterval(() => {
      updateCountdowns();
    }, 1000);
    return () => clearInterval(interval);
  }, [flashSales]);

  const loadFlashSales = async () => {
    setLoading(true);
    try {
      const filters = {
        status: selectedStatus !== 'all' ? selectedStatus as FlashSale['status'] : undefined,
        startDate: dateRange[0].format('YYYY-MM-DD'),
        endDate: dateRange[1].format('YYYY-MM-DD'),
        limit: 50,
      };
      const response = await flashSalesAPI.getAll(filters);
      setFlashSales(response.flashSales);
    } catch (error) {
      console.error('Error loading flash sales:', error);
      message.error('Failed to load flash sales');
    } finally {
      setLoading(false);
    }
  };

  const loadDailyDeals = async () => {
    try {
      const deals = await flashSalesAPI.getDailyDeals();
      setDailyDeals(deals);
    } catch (error) {
      console.error('Error loading daily deals:', error);
      message.error('Failed to load daily deals');
    }
  };

  const loadStats = async () => {
    try {
      const statsData = await flashSalesAPI.getStats({
        start: dateRange[0].format('YYYY-MM-DD'),
        end: dateRange[1].format('YYYY-MM-DD'),
      });
      setStats(statsData);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const updateCountdowns = () => {
    const newCountdowns: CountdownState = {};
    flashSales.forEach(sale => {
      if (sale.status === 'active' || sale.status === 'scheduled') {
        const now = dayjs();
        const endTime = dayjs(sale.endTime);
        const startTime = dayjs(sale.startTime);
        
        let targetTime: Dayjs;
        let isActive = true;

        if (sale.status === 'scheduled' && now.isBefore(startTime)) {
          targetTime = startTime;
          isActive = false;
        } else if (sale.status === 'active' && now.isBefore(endTime)) {
          targetTime = endTime;
          isActive = true;
        } else {
          return;
        }

        const duration = targetTime.diff(now);
        if (duration > 0) {
          const days = Math.floor(duration / (1000 * 60 * 60 * 24));
          const hours = Math.floor((duration % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((duration % (1000 * 60)) / 1000);

          newCountdowns[sale.id] = { days, hours, minutes, seconds, isActive };
        }
      }
    });
    setCountdowns(newCountdowns);
  };

  const handleCreateSale = async (values: any) => {
    try {
      setLoading(true);
      await flashSalesAPI.create({
        title: values.title,
        description: values.description,
        startTime: values.dateRange[0].toISOString(),
        endTime: values.dateRange[1].toISOString(),
        discountType: values.discountType,
        discountValue: values.discountValue,
        maxDiscount: values.maxDiscount,
        minOrderValue: values.minOrderValue,
        productIds: values.productIds || [],
        priority: values.priority || 1,
        sendNotifications: values.sendNotifications,
      });
      message.success('Flash sale created successfully');
      setCreateModalOpen(false);
      form.resetFields();
      loadFlashSales();
    } catch (error) {
      console.error('Error creating flash sale:', error);
      message.error('Failed to create flash sale');
    } finally {
      setLoading(false);
    }
  };

  const handleStartSale = async (saleId: string) => {
    try {
      await flashSalesAPI.start(saleId);
      message.success('Flash sale started successfully');
      loadFlashSales();
    } catch (error) {
      console.error('Error starting flash sale:', error);
      message.error('Failed to start flash sale');
    }
  };

  const handleEndSale = async (saleId: string) => {
    try {
      await flashSalesAPI.end(saleId);
      message.success('Flash sale ended successfully');
      loadFlashSales();
    } catch (error) {
      console.error('Error ending flash sale:', error);
      message.error('Failed to end flash sale');
    }
  };

  const handleDeleteSale = async (saleId: string) => {
    try {
      await flashSalesAPI.delete(saleId);
      message.success('Flash sale deleted successfully');
      loadFlashSales();
    } catch (error) {
      console.error('Error deleting flash sale:', error);
      message.error('Failed to delete flash sale');
    }
  };

  const handleDuplicateSale = async (saleId: string) => {
    try {
      await flashSalesAPI.duplicate(saleId, {
        title: `Copy of ${flashSales.find(s => s.id === saleId)?.title}`,
        startTime: dayjs().add(1, 'hour').toISOString(),
        endTime: dayjs().add(25, 'hours').toISOString(),
      });
      message.success('Flash sale duplicated successfully');
      loadFlashSales();
    } catch (error) {
      console.error('Error duplicating flash sale:', error);
      message.error('Failed to duplicate flash sale');
    }
  };

  const handleExport = async (format: 'csv' | 'xlsx' | 'json') => {
    try {
      setLoading(true);
      const blob = await flashSalesAPI.export(
        {
          status: selectedStatus !== 'all' ? selectedStatus as FlashSale['status'] : undefined,
          startDate: dateRange[0].format('YYYY-MM-DD'),
          endDate: dateRange[1].format('YYYY-MM-DD'),
        },
        format
      );
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `flash-sales-${dayjs().format('YYYY-MM-DD')}.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      message.success(`Flash sales exported as ${format.toUpperCase()}`);
    } catch (error) {
      console.error('Export error:', error);
      message.error('Failed to export flash sales');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: FlashSale['status']) => {
    const colors = {
      scheduled: 'blue',
      active: 'green',
      ended: 'default',
      cancelled: 'red',
    };
    return colors[status];
  };

  const getStatusIcon = (status: FlashSale['status']) => {
    const icons = {
      scheduled: <ClockCircleOutlined />,
      active: <PlayCircleOutlined />,
      ended: <CheckCircleOutlined />,
      cancelled: <MinusCircleOutlined />,
    };
    return icons[status];
  };

  const renderCountdown = (saleId: string, status: FlashSale['status']) => {
    const countdown = countdowns[saleId];
    if (!countdown) return null;

    const { days, hours, minutes, seconds, isActive } = countdown;
    const color = isActive ? '#52c41a' : '#1890ff';
    const prefix = isActive ? 'Ends in:' : 'Starts in:';

    return (
      <div style={{ fontSize: '12px', color }}>
        <Text strong style={{ color }}>
          {prefix} {days}d {hours}h {minutes}m {seconds}s
        </Text>
      </div>
    );
  };

  const flashSalesColumns: ColumnsType<FlashSale> = [
    {
      title: 'Sale Info',
      key: 'info',
      render: (_, record) => (
        <div>
          <Text strong style={{ display: 'block' }}>{record.title}</Text>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {record.description}
          </Text>
          {(record.status === 'active' || record.status === 'scheduled') && (
            <div style={{ marginTop: 4 }}>
              {renderCountdown(record.id, record.status)}
            </div>
          )}
        </div>
      ),
      width: 250,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: FlashSale['status']) => (
        <Tag color={getStatusColor(status)} icon={getStatusIcon(status)}>
          {status.toUpperCase()}
        </Tag>
      ),
      filters: [
        { text: 'Scheduled', value: 'scheduled' },
        { text: 'Active', value: 'active' },
        { text: 'Ended', value: 'ended' },
        { text: 'Cancelled', value: 'cancelled' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Schedule',
      key: 'schedule',
      render: (_, record) => (
        <div>
          <div style={{ fontSize: '12px' }}>
            <Text type="secondary">Start:</Text> {dayjs(record.startTime).format('MMM DD, HH:mm')}
          </div>
          <div style={{ fontSize: '12px' }}>
            <Text type="secondary">End:</Text> {dayjs(record.endTime).format('MMM DD, HH:mm')}
          </div>
        </div>
      ),
    },
    {
      title: 'Discount',
      key: 'discount',
      render: (_, record) => (
        <div>
          <Text strong>
            {record.discountType === 'percentage' ? `${record.discountValue}%` : `$${record.discountValue}`}
          </Text>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {record.discountType === 'percentage' ? 'Percentage' : 
             record.discountType === 'fixed' ? 'Fixed Amount' : 'BOGO'}
          </div>
        </div>
      ),
    },
    {
      title: 'Products',
      dataIndex: 'products',
      key: 'products',
      render: (products: FlashSaleProduct[]) => (
        <div>
          <Text strong>{products.length}</Text>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {products.reduce((sum, p) => sum + p.soldQuantity, 0)} sold
          </div>
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
            {record.analytics.totalOrders} orders
          </div>
          <div style={{ fontSize: '12px' }}>
            {record.analytics.conversionRate.toFixed(1)}% conv.
          </div>
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          {record.status === 'scheduled' && (
            <Tooltip title="Start Sale">
              <Button
                type="text"
                icon={<PlayCircleOutlined />}
                onClick={() => handleStartSale(record.id)}
                style={{ color: '#52c41a' }}
              />
            </Tooltip>
          )}
          {record.status === 'active' && (
            <Tooltip title="End Sale">
              <Button
                type="text"
                icon={<StopOutlined />}
                onClick={() => handleEndSale(record.id)}
                style={{ color: '#ff4d4f' }}
              />
            </Tooltip>
          )}
          <Tooltip title="Edit">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => {
                setSelectedSale(record);
                setEditModalOpen(true);
              }}
            />
          </Tooltip>
          <Tooltip title="Duplicate">
            <Button
              type="text"
              icon={<CopyOutlined />}
              onClick={() => handleDuplicateSale(record.id)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Popconfirm
              title="Are you sure you want to delete this flash sale?"
              onConfirm={() => handleDeleteSale(record.id)}
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

  const revenueChartData = flashSales.map(sale => ({
    title: sale.title,
    revenue: sale.analytics.totalRevenue,
    orders: sale.analytics.totalOrders,
    status: sale.status,
  }));

  const statusDistribution = [
    { type: 'Active', value: stats?.activeSales || 0 },
    { type: 'Scheduled', value: stats?.scheduledSales || 0 },
    { type: 'Ended', value: stats?.endedSales || 0 },
  ];

  return (
    <Spin spinning={loading} tip="Loading flash sales data...">
      <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <Title level={3}>
                <ThunderboltOutlined style={{ color: '#ff4d4f' }} /> Flash Sales & Daily Deals
              </Title>
              <Paragraph type="secondary">
                Manage time-limited promotions, flash sales, and daily deals with real-time analytics
              </Paragraph>
            </div>
            <Space>
              <Select
                value={selectedStatus}
                onChange={setSelectedStatus}
                style={{ width: 120 }}
              >
                <Select.Option value="all">All Status</Select.Option>
                <Select.Option value="scheduled">Scheduled</Select.Option>
                <Select.Option value="active">Active</Select.Option>
                <Select.Option value="ended">Ended</Select.Option>
                <Select.Option value="cancelled">Cancelled</Select.Option>
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
                Create Flash Sale
              </Button>
            </Space>
          </div>
        </div>

        {/* Alert */}
        <Alert
          message="Flash Sales Management"
          description="Create and manage time-limited promotions with countdown timers, inventory tracking, and real-time analytics. Monitor performance and optimize your flash sales strategy."
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
                title="Active Sales"
                value={stats?.activeSales || 0}
                prefix={<FireOutlined />}
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
                title="Total Revenue"
                value={stats?.totalRevenue || 0}
                prefix={<DollarOutlined />}
                valueStyle={{ color: '#1890ff' }}
                precision={2}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Scheduled Sales"
                value={stats?.scheduledSales || 0}
                prefix={<ClockCircleOutlined />}
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Avg Conversion"
                value={stats?.averageConversionRate || 0}
                prefix={<TrophyOutlined />}
                valueStyle={{ color: '#722ed1' }}
                precision={1}
                suffix="%"
              />
            </Card>
          </Col>
        </Row>

        {/* Main Content */}
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane
            tab={
              <span>
                <ThunderboltOutlined />
                Flash Sales ({flashSales.length})
              </span>
            }
            key="flashSales"
          >
            <Card>
              <Table
                columns={flashSalesColumns}
                dataSource={flashSales}
                rowKey="id"
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total, range) =>
                    `${range[0]}-${range[1]} of ${total} flash sales`,
                }}
                scroll={{ x: 1200 }}
              />
            </Card>
          </TabPane>

          <TabPane
            tab={
              <span>
                <GiftOutlined />
                Daily Deals ({dailyDeals.length})
              </span>
            }
            key="dailyDeals"
          >
            <Row gutter={[16, 16]}>
              {dailyDeals.map(deal => (
                <Col xs={24} sm={12} md={8} lg={6} key={deal.id}>
                  <Card
                    hoverable
                    cover={
                      <div style={{ height: 200, background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <img
                          src={deal.featuredImage || '/placeholder-product.png'}
                          alt={deal.title}
                          style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'cover' }}
                        />
                      </div>
                    }
                    actions={[
                      <EyeOutlined key="view" />,
                      <EditOutlined key="edit" />,
                      <DeleteOutlined key="delete" />,
                    ]}
                  >
                    <Card.Meta
                      title={deal.title}
                      description={
                        <div>
                          <div style={{ marginBottom: 8 }}>
                            <Text strong style={{ color: '#52c41a', fontSize: 16 }}>
                              ${deal.product.salePrice}
                            </Text>
                            <Text delete style={{ marginLeft: 8, color: '#999' }}>
                              ${deal.product.originalPrice}
                            </Text>
                          </div>
                          <div style={{ fontSize: 12, color: '#666' }}>
                            {deal.soldCount} sold • {deal.viewCount} views
                          </div>
                          <Tag color={deal.status === 'active' ? 'green' : 'blue'} style={{ marginTop: 4 }}>
                            {deal.status.toUpperCase()}
                          </Tag>
                        </div>
                      }
                    />
                  </Card>
                </Col>
              ))}
              {dailyDeals.length === 0 && (
                <Col span={24}>
                  <Empty description="No daily deals found" />
                </Col>
              )}
            </Row>
          </TabPane>

          <TabPane
            tab={
              <span>
                <TrophyOutlined />
                Analytics
              </span>
            }
            key="analytics"
          >
            <Row gutter={[16, 16]}>
              <Col xs={24} lg={16}>
                <Card title="Revenue by Flash Sale">
                  <Column
                    data={revenueChartData}
                    xField="title"
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
                <Card title="Sales Status Distribution">
                  <Pie
                    data={statusDistribution}
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

        {/* Create Flash Sale Modal */}
        <Modal
          title="Create Flash Sale"
          open={createModalOpen}
          onCancel={() => {
            setCreateModalOpen(false);
            form.resetFields();
          }}
          footer={null}
          width={800}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleCreateSale}
          >
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="title"
                  label="Sale Title"
                  rules={[{ required: true, message: 'Please enter sale title' }]}
                >
                  <Input placeholder="Enter flash sale title" />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name="description"
                  label="Description"
                  rules={[{ required: true, message: 'Please enter description' }]}
                >
                  <TextArea rows={3} placeholder="Enter sale description" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="dateRange"
                  label="Sale Period"
                  rules={[{ required: true, message: 'Please select sale period' }]}
                >
                  <RangePicker
                    showTime
                    style={{ width: '100%' }}
                    placeholder={['Start Time', 'End Time']}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="discountType"
                  label="Discount Type"
                  rules={[{ required: true, message: 'Please select discount type' }]}
                >
                  <Select placeholder="Select discount type">
                    <Select.Option value="percentage">Percentage</Select.Option>
                    <Select.Option value="fixed">Fixed Amount</Select.Option>
                    <Select.Option value="buy_one_get_one">Buy One Get One</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="discountValue"
                  label="Discount Value"
                  rules={[{ required: true, message: 'Please enter discount value' }]}
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    placeholder="Enter value"
                    min={0}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="maxDiscount"
                  label="Max Discount ($)"
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    placeholder="Optional"
                    min={0}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="minOrderValue"
                  label="Min Order Value ($)"
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    placeholder="Optional"
                    min={0}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="priority"
                  label="Priority"
                >
                  <Select defaultValue={1}>
                    <Select.Option value={1}>Normal</Select.Option>
                    <Select.Option value={2}>High</Select.Option>
                    <Select.Option value={3}>Critical</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="sendNotifications"
                  label="Send Notifications"
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>
              </Col>
            </Row>
            <div style={{ textAlign: 'right', marginTop: 16 }}>
              <Space>
                <Button onClick={() => {
                  setCreateModalOpen(false);
                  form.resetFields();
                }}>
                  Cancel
                </Button>
                <Button type="primary" htmlType="submit" loading={loading}>
                  Create Flash Sale
                </Button>
              </Space>
            </div>
          </Form>
        </Modal>
      </div>
    </Spin>
  );
};

export default FlashSalesPage;