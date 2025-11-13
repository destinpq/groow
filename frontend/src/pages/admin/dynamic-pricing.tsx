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
  Button,
  Table,
  Space,
  Tag,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Switch,
  DatePicker,
  Slider,
  Alert,
  Divider,
  Tooltip,
  Progress,
  message,
  Statistic,
  Badge,
  Popconfirm,
  Spin,
  Empty,
  Tabs,
} from 'antd';
import {
  DollarOutlined,
  RiseOutlined,
  FallOutlined,
  SettingOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  LineChartOutlined,
  TrophyOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  PlusOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { bulkDataAPI } from '../../services/api/bulkData';
import { productAPI } from '../../services/api/productAPI';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

interface PricingRule {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'paused' | 'draft';
  priority: number;
  triggerType: 'competitor' | 'demand' | 'inventory' | 'time' | 'cost';
  conditions: Array<{
    field: string;
    operator: string;
    value: any;
    unit?: string;
  }>;
  actions: Array<{
    type: 'increase' | 'decrease' | 'set';
    value: number;
    valueType: 'percentage' | 'fixed';
    maxChange?: number;
    minPrice?: number;
    maxPrice?: number;
  }>;
  applicableProducts: {
    type: 'all' | 'category' | 'specific';
    categories?: string[];
    productIds?: string[];
  };
  schedule?: {
    enabled: boolean;
    startDate?: string;
    endDate?: string;
    timeRanges?: Array<{
      start: string;
      end: string;
      days: string[];
    }>;
  };
  analytics: {
    executionCount: number;
    avgPriceChange: number;
    revenueImpact: number;
    conversionImpact: number;
    lastExecuted?: string;
  };
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

interface PriceAlert {
  id: string;
  productId: string;
  productName: string;
  alertType: 'competitor_undercut' | 'margin_low' | 'demand_spike' | 'inventory_low';
  severity: 'low' | 'medium' | 'high';
  currentPrice: number;
  suggestedPrice?: number;
  competitorPrice?: number;
  message: string;
  isResolved: boolean;
  createdAt: string;
}

interface PriceHistoryData {
  date: string;
  ourPrice: number;
  competitorAvg: number;
  sales: number;
  margin: number;
}

const DynamicPricingPage: React.FC = () => {
  const [pricingRules, setPricingRules] = useState<PricingRule[]>([]);
  const [priceAlerts, setPriceAlerts] = useState<PriceAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRule, setSelectedRule] = useState<PricingRule | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalType, setModalType] = useState<'create' | 'edit' | 'view'>('create');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [form] = Form.useForm();

  useEffect(() => {
    fetchPricingData();
  }, []);

  const fetchPricingData = async () => {
    try {
      setLoading(true);
      
      // Since there's no dedicated pricing API, we'll generate mock data
      // In a real implementation, these would come from actual API endpoints
      const mockRules: PricingRule[] = [
        {
          id: '1',
          name: 'Competitor Price Matching',
          description: 'Automatically match competitor prices when they undercut us by more than 5%',
          status: 'active',
          priority: 1,
          triggerType: 'competitor',
          conditions: [
            { field: 'competitor_price', operator: 'less_than', value: 0.95, unit: 'ratio' }
          ],
          actions: [
            { type: 'set', value: 1.01, valueType: 'percentage', maxChange: 10, minPrice: 50 }
          ],
          applicableProducts: { type: 'category', categories: ['electronics', 'office-supplies'] },
          analytics: {
            executionCount: 156,
            avgPriceChange: -3.2,
            revenueImpact: 12500,
            conversionImpact: 8.5,
            lastExecuted: '2024-11-09T10:30:00Z',
          },
          createdAt: '2024-10-01T00:00:00Z',
          updatedAt: '2024-11-09T10:30:00Z',
          createdBy: 'admin',
        },
        {
          id: '2',
          name: 'High Demand Surge Pricing',
          description: 'Increase prices when demand spikes to maximize revenue',
          status: 'active',
          priority: 2,
          triggerType: 'demand',
          conditions: [
            { field: 'demand_increase', operator: 'greater_than', value: 50, unit: 'percentage' }
          ],
          actions: [
            { type: 'increase', value: 15, valueType: 'percentage', maxChange: 25, maxPrice: 5000 }
          ],
          applicableProducts: { type: 'all' },
          analytics: {
            executionCount: 89,
            avgPriceChange: 12.8,
            revenueImpact: 45600,
            conversionImpact: -2.1,
            lastExecuted: '2024-11-08T14:15:00Z',
          },
          createdAt: '2024-09-15T00:00:00Z',
          updatedAt: '2024-11-08T14:15:00Z',
          createdBy: 'admin',
        },
        {
          id: '3',
          name: 'Low Inventory Clearance',
          description: 'Reduce prices when inventory is low to clear stock',
          status: 'paused',
          priority: 3,
          triggerType: 'inventory',
          conditions: [
            { field: 'inventory_level', operator: 'less_than', value: 20, unit: 'units' }
          ],
          actions: [
            { type: 'decrease', value: 20, valueType: 'percentage', maxChange: 30, minPrice: 25 }
          ],
          applicableProducts: { type: 'category', categories: ['seasonal'] },
          analytics: {
            executionCount: 34,
            avgPriceChange: -18.5,
            revenueImpact: -8900,
            conversionImpact: 15.3,
            lastExecuted: '2024-10-30T09:00:00Z',
          },
          createdAt: '2024-08-01T00:00:00Z',
          updatedAt: '2024-10-30T09:00:00Z',
          createdBy: 'admin',
        },
      ];

      const mockAlerts: PriceAlert[] = [
        {
          id: '1',
          productId: 'prod_123',
          productName: 'Wireless Mouse Pro',
          alertType: 'competitor_undercut',
          severity: 'high',
          currentPrice: 89.99,
          suggestedPrice: 85.99,
          competitorPrice: 82.99,
          message: 'Competitor is selling 8% cheaper',
          isResolved: false,
          createdAt: '2024-11-09T08:30:00Z',
        },
        {
          id: '2',
          productId: 'prod_456',
          productName: 'Office Chair Deluxe',
          alertType: 'demand_spike',
          severity: 'medium',
          currentPrice: 299.99,
          suggestedPrice: 329.99,
          message: 'Demand increased by 75% in last 24h',
          isResolved: false,
          createdAt: '2024-11-09T06:15:00Z',
        },
        {
          id: '3',
          productId: 'prod_789',
          productName: 'Bluetooth Speaker',
          alertType: 'margin_low',
          severity: 'medium',
          currentPrice: 45.99,
          suggestedPrice: 52.99,
          message: 'Profit margin below 15%',
          isResolved: false,
          createdAt: '2024-11-08T16:45:00Z',
        },
      ];

      setPricingRules(mockRules);
      setPriceAlerts(mockAlerts);
    } catch (error) {
      console.error('Error fetching pricing data:', error);
      message.error('Failed to load pricing data');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleRule = async (ruleId: string, newStatus: 'active' | 'paused') => {
    setActionLoading(`toggle-${ruleId}`);
    try {
      // In real implementation, this would call the pricing API
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      setPricingRules(rules => 
        rules.map(rule => 
          rule.id === ruleId ? { ...rule, status: newStatus } : rule
        )
      );
      
      message.success(`Rule ${newStatus === 'active' ? 'activated' : 'paused'} successfully`);
    } catch (error) {
      console.error('Error toggling rule:', error);
      message.error('Failed to update rule');
    } finally {
      setActionLoading(null);
    }
  };

  const handleCreateRule = () => {
    setSelectedRule(null);
    setModalType('create');
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEditRule = (rule: PricingRule) => {
    setSelectedRule(rule);
    setModalType('edit');
    form.setFieldsValue({
      name: rule.name,
      description: rule.description,
      priority: rule.priority,
      triggerType: rule.triggerType,
      status: rule.status,
    });
    setIsModalVisible(true);
  };

  const handleDeleteRule = async (ruleId: string) => {
    setActionLoading(`delete-${ruleId}`);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      setPricingRules(rules => rules.filter(rule => rule.id !== ruleId));
      message.success('Rule deleted successfully');
    } catch (error) {
      console.error('Error deleting rule:', error);
      message.error('Failed to delete rule');
    } finally {
      setActionLoading(null);
    }
  };

  const handleSaveRule = async (values: any) => {
    setActionLoading('save');
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      if (modalType === 'create') {
        const newRule: PricingRule = {
          id: Date.now().toString(),
          name: values.name,
          description: values.description,
          status: values.status || 'draft',
          priority: values.priority || 1,
          triggerType: values.triggerType,
          conditions: [],
          actions: [],
          applicableProducts: { type: 'all' },
          analytics: {
            executionCount: 0,
            avgPriceChange: 0,
            revenueImpact: 0,
            conversionImpact: 0,
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdBy: 'admin',
        };
        
        setPricingRules(rules => [...rules, newRule]);
        message.success('Rule created successfully');
      } else {
        setPricingRules(rules => 
          rules.map(rule => 
            rule.id === selectedRule?.id 
              ? { ...rule, ...values, updatedAt: new Date().toISOString() }
              : rule
          )
        );
        message.success('Rule updated successfully');
      }
      
      setIsModalVisible(false);
      form.resetFields();
      setSelectedRule(null);
    } catch (error) {
      console.error('Error saving rule:', error);
      message.error('Failed to save rule');
    } finally {
      setActionLoading(null);
    }
  };

  const handleResolveAlert = async (alertId: string) => {
    setActionLoading(`resolve-${alertId}`);
    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
      
      setPriceAlerts(alerts => 
        alerts.map(alert => 
          alert.id === alertId ? { ...alert, isResolved: true } : alert
        )
      );
      
      message.success('Alert resolved');
    } catch (error) {
      console.error('Error resolving alert:', error);
      message.error('Failed to resolve alert');
    } finally {
      setActionLoading(null);
    }
  };

  const generatePriceHistoryData = (): PriceHistoryData[] => {
    const data = [];
    for (let i = 30; i >= 0; i--) {
      const date = dayjs().subtract(i, 'days').format('MMM DD');
      data.push({
        date,
        ourPrice: 89.99 + Math.random() * 10 - 5,
        competitorAvg: 87.50 + Math.random() * 8 - 4,
        sales: Math.floor(Math.random() * 100) + 50,
        margin: 15 + Math.random() * 10,
      });
    }
    return data;
  };

  const rulesColumns: ColumnsType<PricingRule> = [
    {
      title: 'Rule Name',
      key: 'name',
      render: (_, record) => (
        <div>
          <Text strong>{record.name}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: 12 }}>
            {record.description}
          </Text>
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : status === 'paused' ? 'orange' : 'gray'}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Trigger',
      dataIndex: 'triggerType',
      key: 'triggerType',
      render: (type: string) => (
        <Tag color="blue">
          {type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ')}
        </Tag>
      ),
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority: number) => (
        <Badge count={priority} color="#1890ff" />
      ),
    },
    {
      title: 'Performance',
      key: 'analytics',
      render: (_, record) => (
        <div>
          <Text style={{ fontSize: 12 }}>
            Executed: {record.analytics.executionCount}x
          </Text>
          <br />
          <Text style={{ fontSize: 12, color: record.analytics.revenueImpact > 0 ? '#52c41a' : '#ff4d4f' }}>
            Revenue: {record.analytics.revenueImpact > 0 ? '+' : ''}${record.analytics.revenueImpact.toLocaleString()}
          </Text>
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Tooltip title={record.status === 'active' ? 'Pause Rule' : 'Activate Rule'}>
            <Button
              size="small"
              icon={record.status === 'active' ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
              onClick={() => handleToggleRule(record.id, record.status === 'active' ? 'paused' : 'active')}
              loading={actionLoading === `toggle-${record.id}`}
            />
          </Tooltip>
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEditRule(record)}
          />
          <Popconfirm
            title="Delete Rule"
            description="Are you sure you want to delete this pricing rule?"
            onConfirm={() => handleDeleteRule(record.id)}
            okText="Delete"
            okType="danger"
          >
            <Button
              size="small"
              danger
              icon={<DeleteOutlined />}
              loading={actionLoading === `delete-${record.id}`}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const alertColumns: ColumnsType<PriceAlert> = [
    {
      title: 'Product',
      dataIndex: 'productName',
      key: 'productName',
      render: (name: string) => <Text strong>{name}</Text>,
    },
    {
      title: 'Alert Type',
      dataIndex: 'alertType',
      key: 'alertType',
      render: (type: string) => {
        const colors = {
          competitor_undercut: 'red',
          demand_spike: 'orange',
          margin_low: 'blue',
          inventory_low: 'purple',
        };
        return (
          <Tag color={colors[type as keyof typeof colors]}>
            {type.replace('_', ' ').toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: 'Severity',
      dataIndex: 'severity',
      key: 'severity',
      render: (severity: string) => (
        <Tag color={severity === 'high' ? 'red' : severity === 'medium' ? 'orange' : 'green'}>
          {severity.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Current Price',
      dataIndex: 'currentPrice',
      key: 'currentPrice',
      render: (price: number) => `$${price.toFixed(2)}`,
    },
    {
      title: 'Suggested Price',
      dataIndex: 'suggestedPrice',
      key: 'suggestedPrice',
      render: (price?: number) => price ? `$${price.toFixed(2)}` : '-',
    },
    {
      title: 'Message',
      dataIndex: 'message',
      key: 'message',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            size="small"
            type="primary"
            onClick={() => handleResolveAlert(record.id)}
            loading={actionLoading === `resolve-${record.id}`}
            disabled={record.isResolved}
          >
            {record.isResolved ? 'Resolved' : 'Resolve'}
          </Button>
        </Space>
      ),
    },
  ];

  if (loading) {
    return (
      <div style={{ padding: 24, textAlign: 'center' }}>
        <Spin size="large" />
      </div>
    );
  }

  const priceHistoryData = generatePriceHistoryData();

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={3}>
          <DollarOutlined style={{ color: '#1890ff', marginRight: 8 }} />
          Dynamic Pricing Management
        </Title>
        <Paragraph type="secondary">
          Automate pricing strategies based on market conditions, competitor analysis, and business rules
        </Paragraph>
      </div>

      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="Overview" key="overview">
          {/* Key Metrics */}
          <Row gutter={16} style={{ marginBottom: 24 }}>
            <Col xs={24} sm={6}>
              <Card>
                <Statistic
                  title="Active Rules"
                  value={pricingRules.filter(r => r.status === 'active').length}
                  prefix={<SettingOutlined />}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={6}>
              <Card>
                <Statistic
                  title="Price Alerts"
                  value={priceAlerts.filter(a => !a.isResolved).length}
                  prefix={<WarningOutlined />}
                  valueStyle={{ color: '#fa541c' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={6}>
              <Card>
                <Statistic
                  title="Revenue Impact"
                  value={49200}
                  prefix="$"
                  valueStyle={{ color: '#1890ff' }}
                  precision={0}
                />
              </Card>
            </Col>
            <Col xs={24} sm={6}>
              <Card>
                <Statistic
                  title="Avg Price Change"
                  value={-2.8}
                  suffix="%"
                  valueStyle={{ color: '#52c41a' }}
                  precision={1}
                />
              </Card>
            </Col>
          </Row>

          {/* Price History Chart */}
          <Card title="Price Performance Analysis" style={{ marginBottom: 24 }}>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={priceHistoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <ChartTooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="ourPrice" 
                  stroke="#1890ff" 
                  strokeWidth={2}
                  name="Our Price"
                />
                <Line 
                  type="monotone" 
                  dataKey="competitorAvg" 
                  stroke="#ff7300" 
                  strokeWidth={2}
                  name="Competitor Avg"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Alerts Section */}
          <Card 
            title="Price Alerts" 
            extra={
              <Button icon={<ReloadOutlined />} onClick={fetchPricingData}>
                Refresh
              </Button>
            }
          >
            {priceAlerts.filter(a => !a.isResolved).length === 0 ? (
              <Empty description="No active alerts" image={Empty.PRESENTED_IMAGE_SIMPLE} />
            ) : (
              <Table
                columns={alertColumns}
                dataSource={priceAlerts.filter(a => !a.isResolved)}
                rowKey="id"
                pagination={false}
                size="small"
              />
            )}
          </Card>
        </TabPane>

        <TabPane tab="Pricing Rules" key="rules">
          <Card
            title="Dynamic Pricing Rules"
            extra={
              <Space>
                <Button icon={<ReloadOutlined />} onClick={fetchPricingData}>
                  Refresh
                </Button>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateRule}>
                  Create Rule
                </Button>
              </Space>
            }
          >
            {pricingRules.length === 0 ? (
              <Empty description="No pricing rules configured" image={Empty.PRESENTED_IMAGE_SIMPLE} />
            ) : (
              <Table
                columns={rulesColumns}
                dataSource={pricingRules}
                rowKey="id"
                pagination={{ pageSize: 10 }}
              />
            )}
          </Card>
        </TabPane>

        <TabPane tab="Analytics" key="analytics">
          <Row gutter={16} style={{ marginBottom: 24 }}>
            <Col xs={24} md={12}>
              <Card title="Sales vs Price Changes">
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={priceHistoryData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <ChartTooltip />
                    <Area 
                      type="monotone" 
                      dataKey="sales" 
                      stroke="#52c41a" 
                      fill="#52c41a" 
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card title="Profit Margin Trends">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={priceHistoryData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <ChartTooltip />
                    <Bar dataKey="margin" fill="#1890ff" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </Col>
          </Row>

          <Card title="Rule Performance Summary">
            <Row gutter={16}>
              {pricingRules.map(rule => (
                <Col xs={24} sm={12} md={8} key={rule.id} style={{ marginBottom: 16 }}>
                  <Card size="small">
                    <div style={{ textAlign: 'center' }}>
                      <Text strong>{rule.name}</Text>
                      <div style={{ margin: '8px 0' }}>
                        <Progress
                          type="circle"
                          size={80}
                          percent={Math.abs(rule.analytics.revenueImpact) / 1000}
                          format={() => `${rule.analytics.executionCount}`}
                        />
                      </div>
                      <Text type="secondary">Executions</Text>
                      <div style={{ marginTop: 8 }}>
                        <Text style={{ color: rule.analytics.revenueImpact > 0 ? '#52c41a' : '#ff4d4f' }}>
                          {rule.analytics.revenueImpact > 0 ? '+' : ''}${rule.analytics.revenueImpact.toLocaleString()}
                        </Text>
                      </div>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        </TabPane>
      </Tabs>

      {/* Create/Edit Rule Modal */}
      <Modal
        title={`${modalType === 'create' ? 'Create' : 'Edit'} Pricing Rule`}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
          setSelectedRule(null);
        }}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSaveRule}
        >
          <Form.Item
            name="name"
            label="Rule Name"
            rules={[{ required: true, message: 'Please enter rule name' }]}
          >
            <Input placeholder="Enter rule name" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please enter description' }]}
          >
            <Input.TextArea rows={3} placeholder="Describe what this rule does" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="triggerType"
                label="Trigger Type"
                rules={[{ required: true, message: 'Please select trigger type' }]}
              >
                <Select placeholder="Select trigger">
                  <Option value="competitor">Competitor Price</Option>
                  <Option value="demand">Demand Change</Option>
                  <Option value="inventory">Inventory Level</Option>
                  <Option value="time">Time-based</Option>
                  <Option value="cost">Cost Change</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="priority"
                label="Priority"
                rules={[{ required: true, message: 'Please set priority' }]}
              >
                <InputNumber min={1} max={10} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="status"
            label="Status"
            initialValue="draft"
          >
            <Select>
              <Option value="draft">Draft</Option>
              <Option value="active">Active</Option>
              <Option value="paused">Paused</Option>
            </Select>
          </Form.Item>

          <Divider />

          <Form.Item style={{ marginBottom: 0 }}>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => setIsModalVisible(false)}>
                Cancel
              </Button>
              <Button 
                type="primary" 
                htmlType="submit"
                loading={actionLoading === 'save'}
              >
                {modalType === 'create' ? 'Create Rule' : 'Update Rule'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DynamicPricingPage;