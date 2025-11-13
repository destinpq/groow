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
  Input,
  Modal,
  Form,
  Steps,
  Timeline,
  Badge,
  Divider,
  List,
  Avatar,
  message,
  Spin,
  Drawer,
  TreeSelect,
  Cascader,
  Collapse,
  notification,
  Radio,
  Checkbox,
  Tooltip,
  Popconfirm,
  Switch,
  InputNumber,
  Upload,
  Alert,
  Empty,
  Dropdown,
} from 'antd';
import {
  ShoppingCartOutlined,
  UserOutlined,
  DollarOutlined,
  TruckOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  EditOutlined,
  EyeOutlined,
  DeleteOutlined,
  PlusOutlined,
  DownloadOutlined,
  PrinterOutlined,
  MailOutlined,
  PhoneOutlined,
  MessageOutlined,
  SplitCellsOutlined,
  MergeOutlined,
  SettingOutlined,
  RobotOutlined,
  ThunderboltOutlined,
  BarChartOutlined,
  LineChartOutlined,
  PieChartOutlined,
  FilterOutlined,
  SearchOutlined,
  ReloadOutlined,
  BulbOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  FileTextOutlined,
  TagOutlined,
  StarOutlined,
  WarningOutlined,
  InfoCircleOutlined,
  HomeOutlined,
  GlobalOutlined,
  BankOutlined,
  CreditCardOutlined,
  SafetyCertificateOutlined,
  RocketOutlined,
  SyncOutlined,
  AimOutlined,
  AlertOutlined,
  BellOutlined,
  CarOutlined,
  CalendarOutlined,
  TeamOutlined,
  BranchesOutlined,
  NodeIndexOutlined,
  DatabaseOutlined,
  CloudServerOutlined,
  ApiOutlined,
  LinkOutlined,
} from '@ant-design/icons';
import { Line, Column, Pie, Area } from '@ant-design/charts';
import type { ColumnsType } from 'antd/es/table';
import dayjs, { Dayjs } from 'dayjs';
import { 
  advancedOrderAPI, 
  AdvancedOrder, 
  AdvancedOrderItem,
  OrderEvent,
  OrderNote,
  OrderSplit,
  OrderStats,
  WorkflowTemplate,
  AutomationRule,
  OrderBatch,
  AdvancedOrderFilters
} from '../../services/api/advancedOrders';

const { Title, Text, Paragraph } = Typography;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { TabPane } = Tabs;
const { Panel } = Collapse;
const { Step } = Steps;
const { Search } = Input;

const AdvancedOrderManagementPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<AdvancedOrder[]>([]);
  const [stats, setStats] = useState<OrderStats | null>(null);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<AdvancedOrder | null>(null);
  const [orderDetailVisible, setOrderDetailVisible] = useState(false);
  const [splitModalVisible, setSplitModalVisible] = useState(false);
  const [workflowDrawerVisible, setWorkflowDrawerVisible] = useState(false);
  const [automationDrawerVisible, setAutomationDrawerVisible] = useState(false);
  const [batchModalVisible, setBatchModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('orders');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<AdvancedOrderFilters>({
    page: 1,
    limit: 20,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>([
    dayjs().subtract(30, 'days'),
    dayjs(),
  ]);
  const [workflows, setWorkflows] = useState<WorkflowTemplate[]>([]);
  const [automationRules, setAutomationRules] = useState<AutomationRule[]>([]);
  const [batches, setBatches] = useState<OrderBatch[]>([]);
  const [orderTimeline, setOrderTimeline] = useState<OrderEvent[]>([]);
  const [orderNotes, setOrderNotes] = useState<OrderNote[]>([]);
  const [orderSplits, setOrderSplits] = useState<OrderSplit[]>([]);
  const [form] = Form.useForm();

  // Load data
  useEffect(() => {
    loadOrders();
    loadStats();
    loadWorkflows();
    loadAutomationRules();
    loadBatches();
  }, [filters, dateRange]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const response = await advancedOrderAPI.getOrders({
        ...filters,
        dateRange: {
          start: dateRange[0].format('YYYY-MM-DD'),
          end: dateRange[1].format('YYYY-MM-DD'),
        },
      });
      setOrders(response.orders);
    } catch (error) {
      console.error('Error loading orders:', error);
      message.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const statsData = await advancedOrderAPI.getOrderStats({
        startDate: dateRange[0].format('YYYY-MM-DD'),
        endDate: dateRange[1].format('YYYY-MM-DD'),
      });
      setStats(statsData);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const loadWorkflows = async () => {
    try {
      const workflowData = await advancedOrderAPI.getWorkflowTemplates();
      setWorkflows(workflowData);
    } catch (error) {
      console.error('Error loading workflows:', error);
    }
  };

  const loadAutomationRules = async () => {
    try {
      const rulesData = await advancedOrderAPI.getAutomationRules();
      setAutomationRules(rulesData);
    } catch (error) {
      console.error('Error loading automation rules:', error);
    }
  };

  const loadBatches = async () => {
    try {
      const batchData = await advancedOrderAPI.getBatches();
      setBatches(batchData);
    } catch (error) {
      console.error('Error loading batches:', error);
    }
  };

  const loadOrderDetails = async (orderId: string) => {
    try {
      const [timeline, notes, splits] = await Promise.all([
        advancedOrderAPI.getOrderTimeline(orderId),
        advancedOrderAPI.getOrderNotes(orderId),
        advancedOrderAPI.getSplits(orderId),
      ]);
      setOrderTimeline(timeline);
      setOrderNotes(notes);
      setOrderSplits(splits);
    } catch (error) {
      console.error('Error loading order details:', error);
    }
  };

  const handleOrderClick = async (order: AdvancedOrder) => {
    setSelectedOrder(order);
    await loadOrderDetails(order.id);
    setOrderDetailVisible(true);
  };

  const handleStatusUpdate = async (orderId: string, newStatus: string, reason?: string) => {
    try {
      await advancedOrderAPI.updateOrderStatus(orderId, newStatus, reason);
      message.success('Order status updated successfully');
      loadOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
      message.error('Failed to update order status');
    }
  };

  const handleAssignOrder = async (orderId: string, assignee: string, department?: string) => {
    try {
      await advancedOrderAPI.assignOrder(orderId, assignee, department);
      message.success('Order assigned successfully');
      loadOrders();
    } catch (error) {
      console.error('Error assigning order:', error);
      message.error('Failed to assign order');
    }
  };

  const handleEscalateOrder = async (orderId: string, reason: string, assignTo?: string) => {
    try {
      await advancedOrderAPI.escalateOrder(orderId, reason, assignTo);
      message.success('Order escalated successfully');
      loadOrders();
    } catch (error) {
      console.error('Error escalating order:', error);
      message.error('Failed to escalate order');
    }
  };

  const handleSplitOrder = async (orderId: string, splitData: any) => {
    try {
      await advancedOrderAPI.splitOrder(orderId, splitData);
      message.success('Order split successfully');
      setSplitModalVisible(false);
      loadOrders();
    } catch (error) {
      console.error('Error splitting order:', error);
      message.error('Failed to split order');
    }
  };

  const handleBulkAction = async (action: string, orderIds: string[], data?: any) => {
    try {
      setLoading(true);
      switch (action) {
        case 'status':
          await advancedOrderAPI.batchUpdateStatus(orderIds, data.status, data.reason);
          break;
        case 'assign':
          await advancedOrderAPI.batchAssign(orderIds, data.assignee);
          break;
        case 'tags':
          await advancedOrderAPI.batchAddTags(orderIds, data.tags);
          break;
        default:
          throw new Error('Unknown bulk action');
      }
      message.success(`Bulk ${action} completed successfully`);
      setSelectedOrders([]);
      loadOrders();
    } catch (error) {
      console.error(`Error in bulk ${action}:`, error);
      message.error(`Failed to perform bulk ${action}`);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format: 'csv' | 'xlsx' | 'pdf') => {
    try {
      setLoading(true);
      const orderIds = selectedOrders.length > 0 ? selectedOrders : orders.map(o => o.id);
      const blob = await advancedOrderAPI.batchExport(orderIds, format);
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `orders-${dayjs().format('YYYY-MM-DD')}.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      message.success(`Orders exported as ${format.toUpperCase()}`);
    } catch (error) {
      console.error('Export error:', error);
      message.error('Failed to export orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: AdvancedOrder['status']) => {
    const colors = {
      pending: 'orange',
      confirmed: 'blue',
      processing: 'purple',
      split: 'cyan',
      partially_shipped: 'geekblue',
      shipped: 'green',
      delivered: 'success',
      cancelled: 'red',
      returned: 'magenta',
      refunded: 'volcano',
    };
    return colors[status] || 'default';
  };

  const getPriorityColor = (priority: AdvancedOrder['priority']) => {
    const colors = {
      low: 'green',
      normal: 'blue',
      high: 'orange',
      urgent: 'red',
    };
    return colors[priority];
  };

  const ordersColumns: ColumnsType<AdvancedOrder> = [
    {
      title: 'Order',
      key: 'order',
      render: (_, record) => (
        <div>
          <Button
            type="link"
            onClick={() => handleOrderClick(record)}
            style={{ padding: 0, fontSize: '14px', fontWeight: 'bold' }}
          >
            #{record.orderNumber}
          </Button>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {dayjs(record.createdAt).format('MMM DD, YYYY HH:mm')}
          </div>
          <div style={{ marginTop: 4 }}>
            <Tag color={getPriorityColor(record.priority)}>
              {record.priority.toUpperCase()}
            </Tag>
          </div>
        </div>
      ),
      width: 150,
    },
    {
      title: 'Customer',
      key: 'customer',
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar icon={<UserOutlined />} size="small" style={{ marginRight: 8 }} />
          <div>
            <Text strong style={{ display: 'block' }}>{record.customerName}</Text>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {record.customerEmail}
            </Text>
          </div>
        </div>
      ),
      width: 200,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: AdvancedOrder['status']) => (
        <Tag color={getStatusColor(status)}>
          {status.replace('_', ' ').toUpperCase()}
        </Tag>
      ),
      filters: [
        { text: 'Pending', value: 'pending' },
        { text: 'Confirmed', value: 'confirmed' },
        { text: 'Processing', value: 'processing' },
        { text: 'Shipped', value: 'shipped' },
        { text: 'Delivered', value: 'delivered' },
        { text: 'Cancelled', value: 'cancelled' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Items',
      key: 'items',
      render: (_, record) => (
        <div>
          <Text strong>{record.items.length} items</Text>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {record.items.reduce((sum, item) => sum + item.quantity, 0)} units
          </div>
        </div>
      ),
    },
    {
      title: 'Total',
      key: 'total',
      render: (_, record) => (
        <div>
          <Text strong style={{ fontSize: '16px' }}>
            {record.totals.currency} {record.totals.total.toFixed(2)}
          </Text>
          <div style={{ fontSize: '12px', color: '#666' }}>
            Payment: {record.payment.status}
          </div>
        </div>
      ),
      sorter: (a, b) => a.totals.total - b.totals.total,
    },
    {
      title: 'Workflow',
      key: 'workflow',
      render: (_, record) => (
        <div>
          <Tag color="blue">{record.workflow.currentStage}</Tag>
          {record.workflow.assignedTo && (
            <div style={{ fontSize: '12px', color: '#666', marginTop: 2 }}>
              Assigned: {record.workflow.assignedTo}
            </div>
          )}
          {record.workflow.escalationLevel > 0 && (
            <div style={{ marginTop: 2 }}>
              <Tag color="red">
                Escalated L{record.workflow.escalationLevel}
              </Tag>
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Shipping',
      key: 'shipping',
      render: (_, record) => (
        <div>
          <div style={{ fontSize: '12px' }}>
            <TruckOutlined style={{ marginRight: 4 }} />
            {record.shipping.carrier} - {record.shipping.service}
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            Est: {record.estimatedDelivery ? dayjs(record.estimatedDelivery).format('MMM DD') : 'TBD'}
          </div>
          {record.tracking.status && (
            <Tag color="green" style={{ marginTop: 2 }}>
              {record.tracking.status}
            </Tag>
          )}
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="View Details">
            <Button
              type="text"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => handleOrderClick(record)}
            />
          </Tooltip>
          <Tooltip title="Edit Order">
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
            />
          </Tooltip>
          <Dropdown
            menu={{
              items: [
                {
                  key: 'status',
                  label: 'Update Status',
                  icon: <CheckCircleOutlined />,
                },
                {
                  key: 'assign',
                  label: 'Assign',
                  icon: <TeamOutlined />,
                },
                {
                  key: 'escalate',
                  label: 'Escalate',
                  icon: <WarningOutlined />,
                },
                {
                  key: 'split',
                  label: 'Split Order',
                  icon: <SplitCellsOutlined />,
                },
                {
                  key: 'print',
                  label: 'Print',
                  icon: <PrinterOutlined />,
                },
              ],
            }}
            trigger={['click']}
          >
            <Button type="text" size="small" icon={<SettingOutlined />} />
          </Dropdown>
        </Space>
      ),
      width: 120,
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
      key: 'pdf',
      label: (
        <Space>
          <FilePdfOutlined />
          Export as PDF
        </Space>
      ),
      onClick: () => handleExport('pdf'),
    },
  ];

  const bulkActionMenuItems = [
    {
      key: 'status',
      label: 'Update Status',
      icon: <CheckCircleOutlined />,
    },
    {
      key: 'assign',
      label: 'Assign Orders',
      icon: <TeamOutlined />,
    },
    {
      key: 'tags',
      label: 'Add Tags',
      icon: <TagOutlined />,
    },
    {
      key: 'batch',
      label: 'Create Batch',
      icon: <BulbOutlined />,
    },
  ];

  // Chart data
  const orderTrendData = stats?.revenueByMonth?.map(item => ({
    month: item.month,
    orders: item.orders,
    revenue: item.revenue,
  })) || [];

  const statusDistribution = stats?.ordersByStatus?.map(item => ({
    type: item.status,
    value: item.count,
  })) || [];

  const priorityDistribution = stats?.ordersByPriority?.map(item => ({
    type: item.priority,
    value: item.count,
  })) || [];

  return (
    <Spin spinning={loading} tip="Loading order management...">
      <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <Title level={3}>
                <ShoppingCartOutlined style={{ color: '#1890ff' }} /> Advanced Order Management
              </Title>
              <Paragraph type="secondary">
                Comprehensive order processing with workflow automation and advanced tracking
              </Paragraph>
            </div>
            <Space>
              <Search
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onSearch={(value) => setFilters({ ...filters, orderNumber: value })}
                style={{ width: 250 }}
              />
              <Select
                value={filters.status}
                onChange={(status) => setFilters({ ...filters, status })}
                style={{ width: 120 }}
                placeholder="Status"
              >
                <Select.Option value="">All Status</Select.Option>
                <Select.Option value="pending">Pending</Select.Option>
                <Select.Option value="confirmed">Confirmed</Select.Option>
                <Select.Option value="processing">Processing</Select.Option>
                <Select.Option value="shipped">Shipped</Select.Option>
                <Select.Option value="delivered">Delivered</Select.Option>
              </Select>
              <Select
                value={filters.priority}
                onChange={(priority) => setFilters({ ...filters, priority })}
                style={{ width: 120 }}
                placeholder="Priority"
              >
                <Select.Option value="">All Priority</Select.Option>
                <Select.Option value="low">Low</Select.Option>
                <Select.Option value="normal">Normal</Select.Option>
                <Select.Option value="high">High</Select.Option>
                <Select.Option value="urgent">Urgent</Select.Option>
              </Select>
              <RangePicker
                value={dateRange}
                onChange={(dates) => dates && setDateRange(dates as [Dayjs, Dayjs])}
              />
              <Button
                icon={<ReloadOutlined />}
                onClick={loadOrders}
              >
                Refresh
              </Button>
              <Dropdown menu={{ items: exportMenuItems }} placement="bottomRight">
                <Button icon={<DownloadOutlined />}>
                  Export
                </Button>
              </Dropdown>
            </Space>
          </div>
        </div>

        {/* Statistics */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Total Orders"
                value={stats?.totalOrders || 0}
                prefix={<ShoppingCartOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Total Revenue"
                value={stats?.totalRevenue || 0}
                prefix={<DollarOutlined />}
                precision={2}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Avg Order Value"
                value={stats?.averageOrderValue || 0}
                prefix={<DollarOutlined />}
                precision={2}
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Fulfillment Rate"
                value={stats?.fulfillmentRate || 0}
                prefix={<TruckOutlined />}
                precision={1}
                suffix="%"
                valueStyle={{ color: '#fa8c16' }}
              />
            </Card>
          </Col>
        </Row>

        {/* Main Content */}
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane
            tab={
              <span>
                <ShoppingCartOutlined />
                Orders ({orders.length})
              </span>
            }
            key="orders"
          >
            <Card>
              {selectedOrders.length > 0 && (
                <div style={{ marginBottom: 16 }}>
                  <Space>
                    <Text strong>{selectedOrders.length} orders selected</Text>
                    <Dropdown
                      menu={{
                        items: bulkActionMenuItems,
                        onClick: ({ key }) => {
                          // Handle bulk actions
                          if (key === 'batch') {
                            setBatchModalVisible(true);
                          }
                        },
                      }}
                    >
                      <Button>
                        Bulk Actions <DownloadOutlined />
                      </Button>
                    </Dropdown>
                    <Button
                      onClick={() => setSelectedOrders([])}
                    >
                      Clear Selection
                    </Button>
                  </Space>
                </div>
              )}
              
              <Table
                columns={ordersColumns}
                dataSource={orders}
                rowKey="id"
                rowSelection={{
                  selectedRowKeys: selectedOrders,
                  onChange: (keys) => setSelectedOrders(keys as string[]),
                }}
                pagination={{
                  pageSize: 20,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total, range) =>
                    `${range[0]}-${range[1]} of ${total} orders`,
                }}
                scroll={{ x: 1400 }}
              />
            </Card>
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
                <Card title="Order Trends">
                  <Area
                    data={orderTrendData}
                    xField="month"
                    yField="orders"
                    height={300}
                  />
                </Card>
              </Col>
              <Col xs={24} lg={8}>
                <Card title="Status Distribution">
                  <Pie
                    data={statusDistribution}
                    angleField="value"
                    colorField="type"
                    radius={0.8}
                    label={{
                      type: 'outer',
                      content: '{name} {percentage}',
                    }}
                    height={300}
                  />
                </Card>
              </Col>
              <Col xs={24} lg={12}>
                <Card title="Revenue Trends">
                  <Column
                    data={orderTrendData}
                    xField="month"
                    yField="revenue"
                    height={250}
                  />
                </Card>
              </Col>
              <Col xs={24} lg={12}>
                <Card title="Priority Distribution">
                  <Pie
                    data={priorityDistribution}
                    angleField="value"
                    colorField="type"
                    radius={0.8}
                    height={250}
                  />
                </Card>
              </Col>
            </Row>
          </TabPane>

          <TabPane
            tab={
              <span>
                <BranchesOutlined />
                Workflows ({workflows.length})
              </span>
            }
            key="workflows"
          >
            <Card
              extra={
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => setWorkflowDrawerVisible(true)}
                >
                  Create Workflow
                </Button>
              }
            >
              <List
                dataSource={workflows}
                renderItem={(workflow) => (
                  <List.Item
                    actions={[
                      <Button type="link" size="small">Edit</Button>,
                      <Button type="link" size="small">Test</Button>,
                      <Button type="link" size="small" danger>Delete</Button>
                    ]}
                  >
                    <List.Item.Meta
                      avatar={
                        <Avatar style={{ backgroundColor: workflow.isActive ? '#52c41a' : '#d9d9d9' }}>
                          <BranchesOutlined />
                        </Avatar>
                      }
                      title={
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>{workflow.name}</span>
                          <Tag color={workflow.isActive ? 'green' : 'default'}>
                            {workflow.isActive ? 'Active' : 'Inactive'}
                          </Tag>
                        </div>
                      }
                      description={
                        <div>
                          <div>{workflow.description}</div>
                          <div style={{ marginTop: 4 }}>
                            <Text type="secondary" style={{ fontSize: '12px' }}>
                              {workflow.stages.length} stages • {workflow.automationRules.length} automation rules
                            </Text>
                          </div>
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            </Card>
          </TabPane>

          <TabPane
            tab={
              <span>
                <RobotOutlined />
                Automation ({automationRules.length})
              </span>
            }
            key="automation"
          >
            <Card
              extra={
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => setAutomationDrawerVisible(true)}
                >
                  Create Rule
                </Button>
              }
            >
              <List
                dataSource={automationRules}
                renderItem={(rule) => (
                  <List.Item
                    actions={[
                      <Button type="link" size="small">Edit</Button>,
                      <Button type="link" size="small">Test</Button>,
                      <Button type="link" size="small" danger>Delete</Button>
                    ]}
                  >
                    <List.Item.Meta
                      avatar={
                        <Avatar style={{ backgroundColor: rule.isActive ? '#1890ff' : '#d9d9d9' }}>
                          <RobotOutlined />
                        </Avatar>
                      }
                      title={
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>{rule.name}</span>
                          <div>
                            <Tag color="blue">Priority {rule.priority}</Tag>
                            <Tag color={rule.isActive ? 'green' : 'default'}>
                              {rule.isActive ? 'Active' : 'Inactive'}
                            </Tag>
                          </div>
                        </div>
                      }
                      description={
                        <div>
                          <div><strong>Trigger:</strong> {rule.trigger}</div>
                          <div><strong>Conditions:</strong> {rule.conditions.length} conditions</div>
                          <div><strong>Actions:</strong> {rule.actions.length} actions</div>
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            </Card>
          </TabPane>

          <TabPane
            tab={
              <span>
                <BulbOutlined />
                Batches ({batches.length})
              </span>
            }
            key="batches"
          >
            <Card
              extra={
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => setBatchModalVisible(true)}
                >
                  Create Batch
                </Button>
              }
            >
              <List
                dataSource={batches}
                renderItem={(batch) => (
                  <List.Item
                    actions={[
                      <Button type="link" size="small">View</Button>,
                      <Button type="link" size="small">Process</Button>,
                      <Button type="link" size="small" danger>Delete</Button>
                    ]}
                  >
                    <List.Item.Meta
                      avatar={
                        <Avatar style={{ backgroundColor: '#722ed1' }}>
                          <BulbOutlined />
                        </Avatar>
                      }
                      title={
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>{batch.name}</span>
                          <Tag color={batch.status === 'completed' ? 'green' : 'processing'}>
                            {batch.status.toUpperCase()}
                          </Tag>
                        </div>
                      }
                      description={
                        <div>
                          <div>{batch.orderIds.length} orders • Type: {batch.batchType}</div>
                          <div style={{ fontSize: '12px', color: '#666' }}>
                            Created: {dayjs(batch.createdAt).format('MMM DD, YYYY HH:mm')}
                          </div>
                          {batch.results && (
                            <div style={{ marginTop: 4 }}>
                              <Tag color="green">{batch.results.successful} successful</Tag>
                              {batch.results.failed > 0 && (
                                <Tag color="red">{batch.results.failed} failed</Tag>
                              )}
                            </div>
                          )}
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            </Card>
          </TabPane>
        </Tabs>

        {/* Order Detail Modal */}
        <Modal
          title={`Order #${selectedOrder?.orderNumber}`}
          open={orderDetailVisible}
          onCancel={() => setOrderDetailVisible(false)}
          width={1200}
          footer={[
            <Button key="close" onClick={() => setOrderDetailVisible(false)}>
              Close
            </Button>,
            <Button key="print" icon={<PrinterOutlined />}>
              Print
            </Button>,
            <Button key="edit" type="primary" icon={<EditOutlined />}>
              Edit Order
            </Button>,
          ]}
        >
          {selectedOrder && (
            <div>
              <Tabs defaultActiveKey="details">
                <TabPane tab="Order Details" key="details">
                  <Row gutter={16}>
                    <Col span={12}>
                      <Card title="Customer Information" size="small">
                        <div><strong>Name:</strong> {selectedOrder.customerName}</div>
                        <div><strong>Email:</strong> {selectedOrder.customerEmail}</div>
                        <div><strong>Customer ID:</strong> {selectedOrder.customerId}</div>
                      </Card>
                    </Col>
                    <Col span={12}>
                      <Card title="Order Information" size="small">
                        <div><strong>Status:</strong> <Tag color={getStatusColor(selectedOrder.status)}>{selectedOrder.status}</Tag></div>
                        <div><strong>Priority:</strong> <Tag color={getPriorityColor(selectedOrder.priority)}>{selectedOrder.priority}</Tag></div>
                        <div><strong>Type:</strong> {selectedOrder.orderType}</div>
                        <div><strong>Created:</strong> {dayjs(selectedOrder.createdAt).format('YYYY-MM-DD HH:mm')}</div>
                      </Card>
                    </Col>
                    <Col span={24} style={{ marginTop: 16 }}>
                      <Card title="Order Items" size="small">
                        <Table
                          dataSource={selectedOrder.items}
                          rowKey="id"
                          size="small"
                          pagination={false}
                          columns={[
                            {
                              title: 'Product',
                              key: 'product',
                              render: (_, item) => (
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                  <Avatar src={item.image} style={{ marginRight: 8 }}>
                                    {item.name.charAt(0)}
                                  </Avatar>
                                  <div>
                                    <div>{item.name}</div>
                                    <div style={{ fontSize: '12px', color: '#666' }}>SKU: {item.sku}</div>
                                  </div>
                                </div>
                              ),
                            },
                            {
                              title: 'Quantity',
                              dataIndex: 'quantity',
                              key: 'quantity',
                            },
                            {
                              title: 'Unit Price',
                              dataIndex: 'unitPrice',
                              key: 'unitPrice',
                              render: (price) => `$${price.toFixed(2)}`,
                            },
                            {
                              title: 'Total',
                              dataIndex: 'totalPrice',
                              key: 'totalPrice',
                              render: (price) => `$${price.toFixed(2)}`,
                            },
                            {
                              title: 'Status',
                              dataIndex: 'fulfillmentStatus',
                              key: 'fulfillmentStatus',
                              render: (status) => <Tag>{status}</Tag>,
                            },
                          ]}
                        />
                      </Card>
                    </Col>
                  </Row>
                </TabPane>
                <TabPane tab="Timeline" key="timeline">
                  <Timeline>
                    {orderTimeline.map((event) => (
                      <Timeline.Item
                        key={event.id}
                        color={event.type === 'status_change' ? 'blue' : 'green'}
                      >
                        <div>
                          <strong>{event.description}</strong>
                          <div style={{ fontSize: '12px', color: '#666' }}>
                            {dayjs(event.timestamp).format('YYYY-MM-DD HH:mm')} {event.user && `by ${event.user}`}
                          </div>
                        </div>
                      </Timeline.Item>
                    ))}
                  </Timeline>
                </TabPane>
                <TabPane tab="Notes" key="notes">
                  <List
                    dataSource={orderNotes}
                    renderItem={(note) => (
                      <List.Item>
                        <List.Item.Meta
                          title={
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <span>{note.author}</span>
                              <div>
                                <Tag color={note.type === 'internal' ? 'blue' : 'green'}>{note.type}</Tag>
                                {note.isImportant && <Tag color="red">Important</Tag>}
                              </div>
                            </div>
                          }
                          description={
                            <div>
                              <div>{note.content}</div>
                              <div style={{ fontSize: '12px', color: '#666', marginTop: 4 }}>
                                {dayjs(note.createdAt).format('YYYY-MM-DD HH:mm')}
                              </div>
                            </div>
                          }
                        />
                      </List.Item>
                    )}
                  />
                </TabPane>
                <TabPane tab="Splits" key="splits">
                  {orderSplits.length > 0 ? (
                    <List
                      dataSource={orderSplits}
                      renderItem={(split) => (
                        <List.Item>
                          <List.Item.Meta
                            title={`Split #${split.splitNumber}`}
                            description={
                              <div>
                                <div><strong>Items:</strong> {split.items.length}</div>
                                <div><strong>Total:</strong> {split.totals.currency} {split.totals.total.toFixed(2)}</div>
                                <div><strong>Status:</strong> <Tag>{split.status}</Tag></div>
                                <div><strong>Reason:</strong> {split.reason}</div>
                              </div>
                            }
                          />
                        </List.Item>
                      )}
                    />
                  ) : (
                    <Empty description="No splits found" />
                  )}
                </TabPane>
              </Tabs>
            </div>
          )}
        </Modal>

        {/* Split Order Modal */}
        <Modal
          title="Split Order"
          open={splitModalVisible}
          onCancel={() => setSplitModalVisible(false)}
          width={800}
          footer={null}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={(values) => {
              if (selectedOrder) {
                handleSplitOrder(selectedOrder.id, values);
              }
            }}
          >
            <Form.Item
              name="reason"
              label="Split Reason"
              rules={[{ required: true, message: 'Please enter split reason' }]}
            >
              <TextArea rows={3} placeholder="Enter reason for splitting the order" />
            </Form.Item>
            {/* Add split configuration form here */}
            <div style={{ textAlign: 'right' }}>
              <Space>
                <Button onClick={() => setSplitModalVisible(false)}>
                  Cancel
                </Button>
                <Button type="primary" htmlType="submit">
                  Split Order
                </Button>
              </Space>
            </div>
          </Form>
        </Modal>

        {/* Workflow Drawer */}
        <Drawer
          title="Workflow Management"
          placement="right"
          onClose={() => setWorkflowDrawerVisible(false)}
          open={workflowDrawerVisible}
          width={600}
        >
          <div>Workflow management interface coming soon...</div>
        </Drawer>

        {/* Automation Drawer */}
        <Drawer
          title="Automation Rules"
          placement="right"
          onClose={() => setAutomationDrawerVisible(false)}
          open={automationDrawerVisible}
          width={600}
        >
          <div>Automation rules interface coming soon...</div>
        </Drawer>

        {/* Batch Modal */}
        <Modal
          title="Create Batch Operation"
          open={batchModalVisible}
          onCancel={() => setBatchModalVisible(false)}
          footer={null}
        >
          <div>Batch operation interface coming soon...</div>
        </Modal>
      </div>
    </Spin>
  );
};

export default AdvancedOrderManagementPage;