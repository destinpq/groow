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
  Switch,
  Badge,
  Divider,
  Timeline,
  Empty,
  Dropdown,
  Tooltip,
  Popconfirm,
  Drawer,
  Steps,
  Radio,
  Checkbox,
  TreeSelect,
  Collapse,
  notification,
} from 'antd';
import {
  BellOutlined,
  WarningOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  SettingOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  DownloadOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  FilterOutlined,
  SyncOutlined,
  NotificationOutlined,
  AlertOutlined,
  DashboardOutlined,
  BarChartOutlined,
  LineChartOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  FileTextOutlined,
  ThunderboltOutlined,
  InfoCircleOutlined,
  StopOutlined,
  SendOutlined,
  BulbOutlined,
  RocketOutlined,
  SafetyCertificateOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import { Line, Column, Pie, Area } from '@ant-design/charts';
import { formatPieLabelContent } from '@/utils/chartHelpers';
import type { ColumnsType } from 'antd/es/table';
import dayjs, { Dayjs } from 'dayjs';
import { 
  inventoryAlertsAPI, 
  InventoryAlert, 
  AlertRule, 
  InventoryThreshold, 
  AlertStats, 
  NotificationChannel 
} from '../../services/api/inventoryAlerts';

const { Title, Text, Paragraph } = Typography;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { TabPane } = Tabs;
const { Panel } = Collapse;
const { Step } = Steps;

const InventoryAlertsPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [alerts, setAlerts] = useState<InventoryAlert[]>([]);
  const [rules, setRules] = useState<AlertRule[]>([]);
  const [thresholds, setThresholds] = useState<InventoryThreshold[]>([]);
  const [channels, setChannels] = useState<NotificationChannel[]>([]);
  const [stats, setStats] = useState<AlertStats | null>(null);
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>([
    dayjs().subtract(7, 'days'),
    dayjs(),
  ]);
  const [selectedAlerts, setSelectedAlerts] = useState<string[]>([]);
  const [createRuleModalOpen, setCreateRuleModalOpen] = useState(false);
  const [createChannelModalOpen, setCreateChannelModalOpen] = useState(false);
  const [thresholdDrawerOpen, setThresholdDrawerOpen] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<InventoryAlert | null>(null);
  const [activeTab, setActiveTab] = useState('alerts');
  const [form] = Form.useForm();
  const [channelForm] = Form.useForm();
  const [thresholdForm] = Form.useForm();

  // Load data
  useEffect(() => {
    loadAlerts();
    loadRules();
    loadChannels();
    loadStats();
  }, [selectedSeverity, selectedStatus, dateRange]);

  useEffect(() => {
    // Setup real-time updates
    const interval = setInterval(() => {
      loadAlerts(true); // Silent reload
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const loadAlerts = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const filters = {
        severity: selectedSeverity !== 'all' ? selectedSeverity as InventoryAlert['severity'] : undefined,
        status: selectedStatus !== 'all' ? selectedStatus as InventoryAlert['status'] : undefined,
        startDate: dateRange[0].format('YYYY-MM-DD'),
        endDate: dateRange[1].format('YYYY-MM-DD'),
        limit: 100,
      };
      const response = await inventoryAlertsAPI.getAlerts(filters);
      setAlerts(response.alerts);
    } catch (error) {
      console.error('Error loading alerts:', error);
      if (!silent) message.error('Failed to load inventory alerts');
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const loadRules = async () => {
    try {
      const rulesData = await inventoryAlertsAPI.getRules();
      setRules(rulesData);
    } catch (error) {
      console.error('Error loading rules:', error);
    }
  };

  const loadChannels = async () => {
    try {
      const channelsData = await inventoryAlertsAPI.getChannels();
      setChannels(channelsData);
    } catch (error) {
      console.error('Error loading channels:', error);
    }
  };

  const loadStats = async () => {
    try {
      const statsData = await inventoryAlertsAPI.getStats({
        start: dateRange[0].format('YYYY-MM-DD'),
        end: dateRange[1].format('YYYY-MM-DD'),
      });
      setStats(statsData);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const loadThresholds = async (productIds?: string[]) => {
    try {
      const thresholdsData = await inventoryAlertsAPI.getThresholds(productIds);
      setThresholds(thresholdsData);
    } catch (error) {
      console.error('Error loading thresholds:', error);
    }
  };

  const handleAcknowledgeAlert = async (alertId: string) => {
    try {
      await inventoryAlertsAPI.acknowledgeAlert(alertId, 'Acknowledged by admin');
      message.success('Alert acknowledged successfully');
      loadAlerts();
    } catch (error) {
      console.error('Error acknowledging alert:', error);
      message.error('Failed to acknowledge alert');
    }
  };

  const handleResolveAlert = async (alertId: string) => {
    try {
      await inventoryAlertsAPI.resolveAlert(alertId, 'Resolved by admin action');
      message.success('Alert resolved successfully');
      loadAlerts();
    } catch (error) {
      console.error('Error resolving alert:', error);
      message.error('Failed to resolve alert');
    }
  };

  const handleBulkAction = async (action: 'acknowledge' | 'resolve' | 'dismiss') => {
    if (selectedAlerts.length === 0) {
      message.warning('Please select alerts to perform bulk action');
      return;
    }

    try {
      setLoading(true);
      const reason = `Bulk ${action} by admin`;
      
      if (action === 'acknowledge') {
        await inventoryAlertsAPI.bulkAcknowledge(selectedAlerts, reason);
      } else if (action === 'resolve') {
        await inventoryAlertsAPI.bulkResolve(selectedAlerts, reason);
      }

      message.success(`${selectedAlerts.length} alerts ${action}d successfully`);
      setSelectedAlerts([]);
      loadAlerts();
    } catch (error) {
      console.error(`Error in bulk ${action}:`, error);
      message.error(`Failed to ${action} alerts`);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRule = async (values: any) => {
    try {
      setLoading(true);
      await inventoryAlertsAPI.createRule({
        name: values.name,
        description: values.description,
        isActive: values.isActive,
        alertType: values.alertType,
        conditions: values.conditions || [],
        actions: values.actions || [],
        scope: values.scope,
        categoryIds: values.categoryIds,
        productIds: values.productIds,
        priority: values.priority || 1,
        cooldownPeriod: values.cooldownPeriod || 60,
      });
      message.success('Alert rule created successfully');
      setCreateRuleModalOpen(false);
      form.resetFields();
      loadRules();
    } catch (error) {
      console.error('Error creating rule:', error);
      message.error('Failed to create alert rule');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateChannel = async (values: any) => {
    try {
      setLoading(true);
      await inventoryAlertsAPI.createChannel({
        name: values.name,
        type: values.type,
        config: values.config,
        isActive: values.isActive,
        isDefault: values.isDefault,
      });
      message.success('Notification channel created successfully');
      setCreateChannelModalOpen(false);
      channelForm.resetFields();
      loadChannels();
    } catch (error) {
      console.error('Error creating channel:', error);
      message.error('Failed to create notification channel');
    } finally {
      setLoading(false);
    }
  };

  const handleTestChannel = async (channelId: string) => {
    try {
      const result = await inventoryAlertsAPI.testChannel(channelId);
      if (result.success) {
        message.success('Test notification sent successfully');
      } else {
        message.error(`Test failed: ${result.message}`);
      }
    } catch (error) {
      console.error('Error testing channel:', error);
      message.error('Failed to test notification channel');
    }
  };

  const handleExport = async (format: 'csv' | 'xlsx' | 'json') => {
    try {
      setLoading(true);
      const blob = await inventoryAlertsAPI.exportAlerts(
        {
          severity: selectedSeverity !== 'all' ? selectedSeverity as InventoryAlert['severity'] : undefined,
          status: selectedStatus !== 'all' ? selectedStatus as InventoryAlert['status'] : undefined,
          startDate: dateRange[0].format('YYYY-MM-DD'),
          endDate: dateRange[1].format('YYYY-MM-DD'),
        },
        format
      );
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `inventory-alerts-${dayjs().format('YYYY-MM-DD')}.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      message.success(`Alerts exported as ${format.toUpperCase()}`);
    } catch (error) {
      console.error('Export error:', error);
      message.error('Failed to export alerts');
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: InventoryAlert['severity']) => {
    const colors = {
      low: 'blue',
      medium: 'orange',
      high: 'red',
      critical: 'purple',
    };
    return colors[severity];
  };

  const getSeverityIcon = (severity: InventoryAlert['severity']) => {
    const icons = {
      low: <InfoCircleOutlined />,
      medium: <WarningOutlined />,
      high: <ExclamationCircleOutlined />,
      critical: <AlertOutlined />,
    };
    return icons[severity];
  };

  const getStatusColor = (status: InventoryAlert['status']) => {
    const colors = {
      active: 'red',
      acknowledged: 'orange',
      resolved: 'green',
      dismissed: 'default',
    };
    return colors[status];
  };

  const alertsColumns: ColumnsType<InventoryAlert> = [
    {
      title: 'Product',
      key: 'product',
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar
            src={record.productImage}
            style={{ marginRight: 8, backgroundColor: '#f5f5f5' }}
          >
            {record.productName.charAt(0)}
          </Avatar>
          <div>
            <Text strong style={{ display: 'block' }}>{record.productName}</Text>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              SKU: {record.productSku}
            </Text>
          </div>
        </div>
      ),
      width: 200,
    },
    {
      title: 'Alert Type',
      dataIndex: 'alertType',
      key: 'alertType',
      render: (type: InventoryAlert['alertType']) => (
        <Tag>
          {type.replace('_', ' ').toUpperCase()}
        </Tag>
      ),
      filters: [
        { text: 'Low Stock', value: 'low_stock' },
        { text: 'Out of Stock', value: 'out_of_stock' },
        { text: 'Overstock', value: 'overstock' },
        { text: 'Expiration', value: 'expiration' },
        { text: 'Reorder Point', value: 'reorder_point' },
      ],
      onFilter: (value, record) => record.alertType === value,
    },
    {
      title: 'Severity',
      dataIndex: 'severity',
      key: 'severity',
      render: (severity: InventoryAlert['severity']) => (
        <Tag color={getSeverityColor(severity)} icon={getSeverityIcon(severity)}>
          {severity.toUpperCase()}
        </Tag>
      ),
      filters: [
        { text: 'Low', value: 'low' },
        { text: 'Medium', value: 'medium' },
        { text: 'High', value: 'high' },
        { text: 'Critical', value: 'critical' },
      ],
      onFilter: (value, record) => record.severity === value,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: InventoryAlert['status']) => (
        <Tag color={getStatusColor(status)}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Stock Info',
      key: 'stock',
      render: (_, record) => (
        <div>
          <div style={{ fontSize: '12px' }}>
            <Text strong>Current: {record.currentStock}</Text>
          </div>
          <div style={{ fontSize: '12px' }}>
            <Text type="secondary">Threshold: {record.threshold}</Text>
          </div>
          <Progress
            percent={Math.min((record.currentStock / record.threshold) * 100, 100)}
            size="small"
            status={record.currentStock <= record.threshold ? 'exception' : 'normal'}
          />
        </div>
      ),
    },
    {
      title: 'Message',
      dataIndex: 'message',
      key: 'message',
      ellipsis: true,
      width: 200,
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => (
        <div>
          <div style={{ fontSize: '12px' }}>
            {dayjs(date).format('MMM DD, YYYY')}
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {dayjs(date).format('HH:mm')}
          </div>
        </div>
      ),
      sorter: (a, b) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          {record.status === 'active' && (
            <Tooltip title="Acknowledge">
              <Button
                type="text"
                size="small"
                icon={<CheckCircleOutlined />}
                onClick={() => handleAcknowledgeAlert(record.id)}
                style={{ color: '#52c41a' }}
              />
            </Tooltip>
          )}
          {(record.status === 'active' || record.status === 'acknowledged') && (
            <Tooltip title="Resolve">
              <Button
                type="text"
                size="small"
                icon={<CloseCircleOutlined />}
                onClick={() => handleResolveAlert(record.id)}
                style={{ color: '#1890ff' }}
              />
            </Tooltip>
          )}
          <Tooltip title="View Details">
            <Button
              type="text"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => setSelectedAlert(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const rulesColumns: ColumnsType<AlertRule> = [
    {
      title: 'Rule Name',
      dataIndex: 'name',
      key: 'name',
      render: (name, record) => (
        <div>
          <Text strong>{name}</Text>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {record.description}
          </div>
        </div>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'alertType',
      key: 'alertType',
      render: (type) => (
        <Tag>{type.replace('_', ' ').toUpperCase()}</Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive) => (
        <Tag color={isActive ? 'green' : 'default'}>
          {isActive ? 'ACTIVE' : 'INACTIVE'}
        </Tag>
      ),
    },
    {
      title: 'Scope',
      dataIndex: 'scope',
      key: 'scope',
      render: (scope) => (
        <Tag color="blue">{scope.replace('_', ' ').toUpperCase()}</Tag>
      ),
    },
    {
      title: 'Triggered',
      dataIndex: 'triggerCount',
      key: 'triggerCount',
      render: (count) => (
        <Text>{count} times</Text>
      ),
    },
    {
      title: 'Last Triggered',
      dataIndex: 'lastTriggered',
      key: 'lastTriggered',
      render: (date) => date ? dayjs(date).format('MMM DD, HH:mm') : 'Never',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Edit">
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
            />
          </Tooltip>
          <Tooltip title="Test">
            <Button
              type="text"
              size="small"
              icon={<PlayCircleOutlined />}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              type="text"
              size="small"
              icon={<DeleteOutlined />}
              danger
            />
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

  const alertTrendData = stats?.alertTrends?.map(item => ({
    date: dayjs(item.date).format('MMM DD'),
    alerts: item.totalAlerts,
    resolved: item.resolvedAlerts,
    responseTime: item.averageResponseTime,
  })) || [];

  const severityDistribution = [
    { type: 'Critical', value: stats?.criticalAlerts || 0 },
    { type: 'High', value: stats?.highAlerts || 0 },
    { type: 'Medium', value: stats?.mediumAlerts || 0 },
    { type: 'Low', value: stats?.lowAlerts || 0 },
  ];

  return (
    <Spin spinning={loading} tip="Loading inventory alerts...">
      <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <Title level={3}>
                <BellOutlined style={{ color: '#ff4d4f' }} /> Inventory Alerts & Notifications
              </Title>
              <Paragraph type="secondary">
                Smart inventory monitoring with automated alerts and threshold management
              </Paragraph>
            </div>
            <Space>
              <Select
                value={selectedSeverity}
                onChange={setSelectedSeverity}
                style={{ width: 120 }}
              >
                <Select.Option value="all">All Severity</Select.Option>
                <Select.Option value="critical">Critical</Select.Option>
                <Select.Option value="high">High</Select.Option>
                <Select.Option value="medium">Medium</Select.Option>
                <Select.Option value="low">Low</Select.Option>
              </Select>
              <Select
                value={selectedStatus}
                onChange={setSelectedStatus}
                style={{ width: 120 }}
              >
                <Select.Option value="all">All Status</Select.Option>
                <Select.Option value="active">Active</Select.Option>
                <Select.Option value="acknowledged">Acknowledged</Select.Option>
                <Select.Option value="resolved">Resolved</Select.Option>
                <Select.Option value="dismissed">Dismissed</Select.Option>
              </Select>
              <RangePicker
                value={dateRange}
                onChange={(dates) => dates && setDateRange(dates as [Dayjs, Dayjs])}
              />
              <Button
                icon={<ReloadOutlined />}
                onClick={() => loadAlerts()}
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

        {/* Alert Banner */}
        {stats && stats.criticalAlerts > 0 && (
          <Alert
            message={`${stats.criticalAlerts} Critical Alerts Require Immediate Attention`}
            description="Critical inventory alerts detected. Please review and take necessary actions to prevent stockouts."
            type="error"
            showIcon
            closable
            style={{ marginBottom: 24 }}
          />
        )}

        {/* Statistics */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Active Alerts"
                value={stats?.activeAlerts || 0}
                prefix={<AlertOutlined />}
                valueStyle={{ 
                  color: stats && stats.activeAlerts > 0 ? '#ff4d4f' : '#52c41a' 
                }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Critical Alerts"
                value={stats?.criticalAlerts || 0}
                prefix={<ExclamationTriangleOutlined />}
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Resolution Rate"
                value={stats?.resolutionRate || 0}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: '#52c41a' }}
                precision={1}
                suffix="%"
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Avg Response Time"
                value={stats?.responseTime?.average || 0}
                prefix={<ClockCircleOutlined />}
                valueStyle={{ color: '#1890ff' }}
                precision={1}
                suffix="min"
              />
            </Card>
          </Col>
        </Row>

        {/* Main Content */}
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane
            tab={
              <span>
                <AlertOutlined />
                Active Alerts ({alerts.filter(a => a.status === 'active').length})
              </span>
            }
            key="alerts"
          >
            <Card>
              {selectedAlerts.length > 0 && (
                <div style={{ marginBottom: 16 }}>
                  <Space>
                    <Text strong>{selectedAlerts.length} alerts selected</Text>
                    <Button
                      size="small"
                      onClick={() => handleBulkAction('acknowledge')}
                    >
                      Bulk Acknowledge
                    </Button>
                    <Button
                      size="small"
                      onClick={() => handleBulkAction('resolve')}
                    >
                      Bulk Resolve
                    </Button>
                    <Button
                      size="small"
                      onClick={() => setSelectedAlerts([])}
                    >
                      Clear Selection
                    </Button>
                  </Space>
                </div>
              )}
              
              <Table
                columns={alertsColumns}
                dataSource={alerts}
                rowKey="id"
                rowSelection={{
                  selectedRowKeys: selectedAlerts,
                  onChange: (keys) => setSelectedAlerts(keys as string[]),
                }}
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total, range) =>
                    `${range[0]}-${range[1]} of ${total} alerts`,
                }}
                scroll={{ x: 1200 }}
              />
            </Card>
          </TabPane>

          <TabPane
            tab={
              <span>
                <SettingOutlined />
                Alert Rules ({rules.length})
              </span>
            }
            key="rules"
          >
            <Card
              extra={
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => setCreateRuleModalOpen(true)}
                >
                  Create Rule
                </Button>
              }
            >
              <Table
                columns={rulesColumns}
                dataSource={rules}
                rowKey="id"
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                }}
              />
            </Card>
          </TabPane>

          <TabPane
            tab={
              <span>
                <NotificationOutlined />
                Channels ({channels.length})
              </span>
            }
            key="channels"
          >
            <Card
              extra={
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => setCreateChannelModalOpen(true)}
                >
                  Add Channel
                </Button>
              }
            >
              <Row gutter={[16, 16]}>
                {channels.map(channel => (
                  <Col xs={24} sm={12} md={8} key={channel.id}>
                    <Card
                      hoverable
                      actions={[
                        <Tooltip title="Test Channel">
                          <Button
                            type="text"
                            icon={<SendOutlined />}
                            onClick={() => handleTestChannel(channel.id)}
                          />
                        </Tooltip>,
                        <Tooltip title="Edit">
                          <Button
                            type="text"
                            icon={<EditOutlined />}
                          />
                        </Tooltip>,
                        <Tooltip title="Delete">
                          <Button
                            type="text"
                            icon={<DeleteOutlined />}
                            danger
                          />
                        </Tooltip>,
                      ]}
                    >
                      <Card.Meta
                        avatar={
                          <Avatar
                            style={{ 
                              backgroundColor: channel.isActive ? '#52c41a' : '#d9d9d9' 
                            }}
                          >
                            {channel.type === 'email' ? '@' : 
                             channel.type === 'sms' ? '📱' : 
                             channel.type === 'slack' ? 'S' : '🔔'}
                          </Avatar>
                        }
                        title={
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>{channel.name}</span>
                            {channel.isDefault && <Tag color="blue">Default</Tag>}
                          </div>
                        }
                        description={
                          <div>
                            <div style={{ marginBottom: 4 }}>
                              <Tag color={channel.isActive ? 'green' : 'default'}>
                                {channel.isActive ? 'Active' : 'Inactive'}
                              </Tag>
                              <Tag>{channel.type.toUpperCase()}</Tag>
                            </div>
                            <div style={{ fontSize: 12, color: '#666' }}>
                              Used {channel.usageCount} times
                            </div>
                          </div>
                        }
                      />
                    </Card>
                  </Col>
                ))}
                {channels.length === 0 && (
                  <Col span={24}>
                    <Empty description="No notification channels configured" />
                  </Col>
                )}
              </Row>
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
                <Card title="Alert Trends">
                  <Area
                    data={alertTrendData}
                    xField="date"
                    yField="alerts"
                    areaStyle={{ fill: 'l(270) 0:#ffffff 0.5:#7ec2f3 1:#1890ff' }}
                    height={300}
                  />
                </Card>
              </Col>
              <Col xs={24} lg={8}>
                <Card title="Severity Distribution">
                  <Pie
                    data={severityDistribution}
                    angleField="value"
                    colorField="type"
                    radius={0.8}
                    label={{
                      type: 'outer',
                      content: formatPieLabelContent,
                    }}
                    height={300}
                  />
                </Card>
              </Col>
            </Row>
          </TabPane>

          <TabPane
            tab={
              <span>
                <SafetyCertificateOutlined />
                Thresholds
              </span>
            }
            key="thresholds"
          >
            <Card
              extra={
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => {
                    setThresholdDrawerOpen(true);
                    loadThresholds();
                  }}
                >
                  Manage Thresholds
                </Button>
              }
            >
              <List
                dataSource={thresholds}
                renderItem={(threshold) => (
                  <List.Item
                    actions={[
                      <Button type="link" size="small">Edit</Button>,
                      <Button type="link" size="small" danger>Delete</Button>
                    ]}
                  >
                    <List.Item.Meta
                      title={threshold.productName}
                      description={
                        <div>
                          <Space split={<Divider type="vertical" />}>
                            <span>Low Stock: {threshold.lowStockThreshold}</span>
                            <span>Reorder: {threshold.reorderPoint}</span>
                            <span>Max: {threshold.maxStockLevel}</span>
                            <span>Safety: {threshold.safetyStock}</span>
                          </Space>
                        </div>
                      }
                    />
                    <div>
                      <Tag color={threshold.isAutoReorderEnabled ? 'green' : 'default'}>
                        {threshold.isAutoReorderEnabled ? 'Auto Reorder' : 'Manual'}
                      </Tag>
                    </div>
                  </List.Item>
                )}
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                }}
              />
            </Card>
          </TabPane>
        </Tabs>

        {/* Create Rule Modal */}
        <Modal
          title="Create Alert Rule"
          open={createRuleModalOpen}
          onCancel={() => {
            setCreateRuleModalOpen(false);
            form.resetFields();
          }}
          footer={null}
          width={800}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleCreateRule}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="name"
                  label="Rule Name"
                  rules={[{ required: true, message: 'Please enter rule name' }]}
                >
                  <Input placeholder="Enter rule name" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="alertType"
                  label="Alert Type"
                  rules={[{ required: true, message: 'Please select alert type' }]}
                >
                  <Select placeholder="Select alert type">
                    <Select.Option value="low_stock">Low Stock</Select.Option>
                    <Select.Option value="out_of_stock">Out of Stock</Select.Option>
                    <Select.Option value="overstock">Overstock</Select.Option>
                    <Select.Option value="expiration">Expiration</Select.Option>
                    <Select.Option value="reorder_point">Reorder Point</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name="description"
                  label="Description"
                >
                  <TextArea rows={3} placeholder="Enter rule description" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="scope"
                  label="Scope"
                  rules={[{ required: true, message: 'Please select scope' }]}
                >
                  <Select placeholder="Select scope">
                    <Select.Option value="all_products">All Products</Select.Option>
                    <Select.Option value="category">Specific Category</Select.Option>
                    <Select.Option value="specific_products">Specific Products</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="priority"
                  label="Priority"
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    min={1}
                    max={10}
                    defaultValue={1}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="cooldownPeriod"
                  label="Cooldown (minutes)"
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    min={0}
                    defaultValue={60}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="isActive"
                  label="Active"
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>
              </Col>
            </Row>
            <div style={{ textAlign: 'right', marginTop: 16 }}>
              <Space>
                <Button onClick={() => {
                  setCreateRuleModalOpen(false);
                  form.resetFields();
                }}>
                  Cancel
                </Button>
                <Button type="primary" htmlType="submit" loading={loading}>
                  Create Rule
                </Button>
              </Space>
            </div>
          </Form>
        </Modal>

        {/* Create Channel Modal */}
        <Modal
          title="Add Notification Channel"
          open={createChannelModalOpen}
          onCancel={() => {
            setCreateChannelModalOpen(false);
            channelForm.resetFields();
          }}
          footer={null}
          width={600}
        >
          <Form
            form={channelForm}
            layout="vertical"
            onFinish={handleCreateChannel}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="name"
                  label="Channel Name"
                  rules={[{ required: true, message: 'Please enter channel name' }]}
                >
                  <Input placeholder="Enter channel name" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="type"
                  label="Channel Type"
                  rules={[{ required: true, message: 'Please select channel type' }]}
                >
                  <Select placeholder="Select channel type">
                    <Select.Option value="email">Email</Select.Option>
                    <Select.Option value="sms">SMS</Select.Option>
                    <Select.Option value="slack">Slack</Select.Option>
                    <Select.Option value="webhook">Webhook</Select.Option>
                    <Select.Option value="push">Push Notification</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="isActive"
                  label="Active"
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="isDefault"
                  label="Default Channel"
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>
              </Col>
            </Row>
            <div style={{ textAlign: 'right', marginTop: 16 }}>
              <Space>
                <Button onClick={() => {
                  setCreateChannelModalOpen(false);
                  channelForm.resetFields();
                }}>
                  Cancel
                </Button>
                <Button type="primary" htmlType="submit" loading={loading}>
                  Add Channel
                </Button>
              </Space>
            </div>
          </Form>
        </Modal>

        {/* Thresholds Drawer */}
        <Drawer
          title="Manage Inventory Thresholds"
          placement="right"
          onClose={() => setThresholdDrawerOpen(false)}
          open={thresholdDrawerOpen}
          width={600}
        >
          <div style={{ marginBottom: 16 }}>
            <Button type="primary" icon={<PlusOutlined />} block>
              Add New Threshold
            </Button>
          </div>
          
          <List
            dataSource={thresholds}
            renderItem={(threshold) => (
              <List.Item
                actions={[
                  <Button type="text" size="small" icon={<EditOutlined />} />,
                  <Button type="text" size="small" icon={<DeleteOutlined />} danger />
                ]}
              >
                <List.Item.Meta
                  title={threshold.productName}
                  description={
                    <Space direction="vertical" size="small" style={{ width: '100%' }}>
                      <div>
                        <Text type="secondary">Low Stock: </Text>
                        <Text strong>{threshold.lowStockThreshold}</Text>
                      </div>
                      <div>
                        <Text type="secondary">Reorder Point: </Text>
                        <Text strong>{threshold.reorderPoint}</Text>
                      </div>
                      <div>
                        <Text type="secondary">Max Stock: </Text>
                        <Text strong>{threshold.maxStockLevel}</Text>
                      </div>
                    </Space>
                  }
                />
              </List.Item>
            )}
          />
        </Drawer>

        {/* Alert Detail Modal */}
        <Modal
          title="Alert Details"
          open={!!selectedAlert}
          onCancel={() => setSelectedAlert(null)}
          footer={[
            <Button key="close" onClick={() => setSelectedAlert(null)}>
              Close
            </Button>,
            selectedAlert?.status === 'active' && (
              <Button
                key="acknowledge"
                onClick={() => {
                  if (selectedAlert) {
                    handleAcknowledgeAlert(selectedAlert.id);
                    setSelectedAlert(null);
                  }
                }}
              >
                Acknowledge
              </Button>
            ),
            (selectedAlert?.status === 'active' || selectedAlert?.status === 'acknowledged') && (
              <Button
                key="resolve"
                type="primary"
                onClick={() => {
                  if (selectedAlert) {
                    handleResolveAlert(selectedAlert.id);
                    setSelectedAlert(null);
                  }
                }}
              >
                Resolve
              </Button>
            ),
          ].filter(Boolean)}
          width={600}
        >
          {selectedAlert && (
            <div>
              <Row gutter={16}>
                <Col span={12}>
                  <div style={{ marginBottom: 16 }}>
                    <Text type="secondary">Product:</Text>
                    <div style={{ marginTop: 4 }}>
                      <Text strong>{selectedAlert.productName}</Text>
                      <div style={{ fontSize: 12, color: '#666' }}>
                        SKU: {selectedAlert.productSku}
                      </div>
                    </div>
                  </div>
                </Col>
                <Col span={12}>
                  <div style={{ marginBottom: 16 }}>
                    <Text type="secondary">Alert Type:</Text>
                    <div style={{ marginTop: 4 }}>
                      <Tag>{selectedAlert.alertType.replace('_', ' ').toUpperCase()}</Tag>
                    </div>
                  </div>
                </Col>
                <Col span={12}>
                  <div style={{ marginBottom: 16 }}>
                    <Text type="secondary">Severity:</Text>
                    <div style={{ marginTop: 4 }}>
                      <Tag color={getSeverityColor(selectedAlert.severity)} icon={getSeverityIcon(selectedAlert.severity)}>
                        {selectedAlert.severity.toUpperCase()}
                      </Tag>
                    </div>
                  </div>
                </Col>
                <Col span={12}>
                  <div style={{ marginBottom: 16 }}>
                    <Text type="secondary">Status:</Text>
                    <div style={{ marginTop: 4 }}>
                      <Tag color={getStatusColor(selectedAlert.status)}>
                        {selectedAlert.status.toUpperCase()}
                      </Tag>
                    </div>
                  </div>
                </Col>
                <Col span={24}>
                  <div style={{ marginBottom: 16 }}>
                    <Text type="secondary">Message:</Text>
                    <div style={{ marginTop: 4 }}>
                      <Text>{selectedAlert.message}</Text>
                    </div>
                  </div>
                </Col>
                <Col span={12}>
                  <div style={{ marginBottom: 16 }}>
                    <Text type="secondary">Current Stock:</Text>
                    <div style={{ marginTop: 4 }}>
                      <Text strong style={{ fontSize: 16 }}>{selectedAlert.currentStock}</Text>
                    </div>
                  </div>
                </Col>
                <Col span={12}>
                  <div style={{ marginBottom: 16 }}>
                    <Text type="secondary">Threshold:</Text>
                    <div style={{ marginTop: 4 }}>
                      <Text strong style={{ fontSize: 16 }}>{selectedAlert.threshold}</Text>
                    </div>
                  </div>
                </Col>
                <Col span={24}>
                  <div style={{ marginBottom: 16 }}>
                    <Text type="secondary">Recommended Action:</Text>
                    <div style={{ marginTop: 4 }}>
                      <Text>{selectedAlert.recommendedAction}</Text>
                    </div>
                  </div>
                </Col>
                <Col span={24}>
                  <div style={{ marginBottom: 16 }}>
                    <Text type="secondary">Timeline:</Text>
                    <div style={{ marginTop: 8 }}>
                      <Timeline>
                        <Timeline.Item
                          color="red"
                          dot={<AlertOutlined />}
                        >
                          <div>
                            <Text strong>Alert Created</Text>
                            <div style={{ fontSize: 12, color: '#666' }}>
                              {dayjs(selectedAlert.createdAt).format('YYYY-MM-DD HH:mm:ss')}
                            </div>
                          </div>
                        </Timeline.Item>
                        {selectedAlert.acknowledgedAt && (
                          <Timeline.Item
                            color="orange"
                            dot={<CheckCircleOutlined />}
                          >
                            <div>
                              <Text strong>Acknowledged</Text>
                              <div style={{ fontSize: 12, color: '#666' }}>
                                {dayjs(selectedAlert.acknowledgedAt).format('YYYY-MM-DD HH:mm:ss')}
                                {selectedAlert.acknowledgedBy && ` by ${selectedAlert.acknowledgedBy}`}
                              </div>
                            </div>
                          </Timeline.Item>
                        )}
                        {selectedAlert.resolvedAt && (
                          <Timeline.Item
                            color="green"
                            dot={<CloseCircleOutlined />}
                          >
                            <div>
                              <Text strong>Resolved</Text>
                              <div style={{ fontSize: 12, color: '#666' }}>
                                {dayjs(selectedAlert.resolvedAt).format('YYYY-MM-DD HH:mm:ss')}
                                {selectedAlert.resolvedBy && ` by ${selectedAlert.resolvedBy}`}
                              </div>
                            </div>
                          </Timeline.Item>
                        )}
                      </Timeline>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          )}
        </Modal>
      </div>
    </Spin>
  );
};

export default InventoryAlertsPage;