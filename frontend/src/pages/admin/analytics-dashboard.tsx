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
  Statistic, 
  Typography, 
  Tabs, 
  Table, 
  Space, 
  Button, 
  DatePicker, 
  Select, 
  Alert, 
  Progress,
  Spin,
  Badge,
  Tag,
  message,
  Tooltip,
  Avatar,
  List,
  Divider
} from 'antd';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  DollarOutlined,
  ShoppingCartOutlined,
  TeamOutlined,
  BarChartOutlined,
  DownloadOutlined,
  ReloadOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  FireOutlined,
  ThunderboltOutlined,
  UserOutlined,
  ShopOutlined,
  RiseOutlined,
  FallOutlined
} from '@ant-design/icons';
import { analyticsAPI } from '../../services/api/analytics';
import type { AnalyticsFilters } from '../../services/api/analytics';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
const { Option } = Select;

const AnalyticsDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [realTimeLoading, setRealTimeLoading] = useState(false);
  const [timeRange, setTimeRange] = useState('7d');
  const [activeTab, setActiveTab] = useState('overview');
  
  // Enhanced state for real API integration
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [executiveData, setExecutiveData] = useState<any>(null);
  const [realTimeData, setRealTimeData] = useState<any>(null);
  const [salesMetrics, setSalesMetrics] = useState<any>(null);
  const [vendorPerformance, setVendorPerformance] = useState<any[]>([]);
  const [businessIntelligence, setBusinessIntelligence] = useState<any>(null);

  // Load dashboard data on component mount
  useEffect(() => {
    loadDashboardData();
    loadRealTimeData();
    
    // Set up real-time updates every 30 seconds
    const interval = setInterval(loadRealTimeData, 30000);
    return () => clearInterval(interval);
  }, [timeRange]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      const filters: AnalyticsFilters = {
        granularity: timeRange === '7d' ? 'day' : timeRange === '30d' ? 'week' : 'month',
        compareWith: 'previous-period'
      };

      const [
        dashboardResponse,
        executiveResponse,
        salesResponse,
        vendorResponse,
        biResponse
      ] = await Promise.all([
        analyticsAPI.getDashboardData(filters),
        analyticsAPI.getExecutiveDashboard(filters),
        analyticsAPI.getSalesMetrics(filters),
        analyticsAPI.getVendorPerformance(filters),
        analyticsAPI.getBusinessIntelligence(filters)
      ]);

      setDashboardData(dashboardResponse);
      setExecutiveData(executiveResponse);
      setSalesMetrics(salesResponse);
      setVendorPerformance(vendorResponse.vendors || []);
      setBusinessIntelligence(biResponse);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      message.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const loadRealTimeData = async () => {
    try {
      setRealTimeLoading(true);
      const response = await analyticsAPI.getRealTimeMetrics();
      setRealTimeData(response);
    } catch (error) {
      console.error('Error loading real-time data:', error);
    } finally {
      setRealTimeLoading(false);
    }
  };

  // Helper functions
  const formatCurrency = (value: number) => `$${value?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || '0.00'}`;
  
  const formatGrowth = (growth: number) => {
    const color = growth >= 0 ? '#52c41a' : '#ff4d4f';
    const icon = growth >= 0 ? <RiseOutlined /> : <FallOutlined />;
    return (
      <span style={{ color, fontSize: 12 }}>
        {icon} {Math.abs(growth).toFixed(1)}%
      </span>
    );
  };

  const getStatusIcon = (status: 'healthy' | 'warning' | 'critical') => {
    const icons = {
      healthy: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
      warning: <WarningOutlined style={{ color: '#faad14' }} />,
      critical: <CloseCircleOutlined style={{ color: '#ff4d4f' }} />
    };
    return icons[status] || icons.healthy;
  };

  const refreshData = () => {
    loadDashboardData();
    loadRealTimeData();
  };

  // Data processing with fallback values
  const kpiData = {
    totalRevenue: executiveData?.revenue_breakdown ? 
      (executiveData.revenue_breakdown.b2b + executiveData.revenue_breakdown.b2c + executiveData.revenue_breakdown.enterprise) : 
      dashboardData?.salesMetrics?.totalRevenue || 0,
    totalOrders: salesMetrics?.totalOrders || dashboardData?.salesMetrics?.totalOrders || 0,
    avgOrderValue: salesMetrics?.averageOrderValue || dashboardData?.salesMetrics?.averageOrderValue || 0,
    conversionRate: salesMetrics?.conversionRate || dashboardData?.salesMetrics?.conversionRate || 0,
    customerCount: dashboardData?.customerInsights?.totalCustomers || 0,
    vendorCount: vendorPerformance.length || 0,
  };

  const salesData = dashboardData?.revenueChart || [];
  const categoryData = dashboardData?.topProducts?.slice(0, 5).map((product: any, index: number) => ({
    name: product.name,
    value: product.sales,
    color: ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088fe'][index] || '#8884d8'
  })) || [];

  const inventoryTrends = dashboardData?.trafficOverview || [];

  if (loading) {
    return (
      <div style={{ padding: '50px', textAlign: 'center' }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>
          <Typography.Text>Loading analytics dashboard...</Typography.Text>
        </div>
      </div>
    );
  }

  const vendorColumns = [
    {
      title: 'Vendor',
      dataIndex: 'name',
      key: 'name',
      render: (name: string) => <Text strong>{name}</Text>,
    },
    {
      title: 'Orders',
      dataIndex: 'orders',
      key: 'orders',
      sorter: (a: any, b: any) => a.orders - b.orders,
    },
    {
      title: 'Revenue',
      dataIndex: 'revenue',
      key: 'revenue',
      render: (revenue: number) => <Text strong>${revenue.toLocaleString()}</Text>,
      sorter: (a: any, b: any) => a.revenue - b.revenue,
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      render: (rating: number) => (
        <div>
          <Text>{rating}</Text>
          <Progress 
            percent={(rating / 5) * 100} 
            size="small" 
            strokeColor="#52c41a" 
            showInfo={false}
            style={{ width: 50, marginLeft: 8 }}
          />
        </div>
      ),
      sorter: (a: any, b: any) => a.rating - b.rating,
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Title level={2}>
            <BarChartOutlined style={{ marginRight: 8 }} />
            Analytics Dashboard
          </Title>
          <Text type="secondary">Phase 4 - Advanced business intelligence</Text>
        </div>
        <Space>
          <Select value={timeRange} onChange={setTimeRange} style={{ width: 120 }}>
            <Option value="7d">Last 7 days</Option>
            <Option value="30d">Last 30 days</Option>
            <Option value="90d">Last 90 days</Option>
          </Select>
          <Button icon={<ReloadOutlined />} onClick={refreshData} loading={loading}>
            Refresh
          </Button>
          <Button icon={<DownloadOutlined />} type="primary">
            Export Report
          </Button>
        </Space>
      </div>

      {/* KPI Cards */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={4}>
          <Card>
            <Statistic
              title="Total Revenue"
              value={kpiData.totalRevenue}
              precision={2}
              prefix="$"
              valueStyle={{ color: '#52c41a' }}
              suffix={<ArrowUpOutlined style={{ color: '#52c41a' }} />}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="Total Orders"
              value={kpiData.totalOrders}
              valueStyle={{ color: '#1890ff' }}
              prefix={<ShoppingCartOutlined />}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="Avg Order Value"
              value={kpiData.avgOrderValue}
              precision={2}
              prefix="$"
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="Conversion Rate"
              value={kpiData.conversionRate}
              suffix="%"
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="Customers"
              value={kpiData.customerCount}
              valueStyle={{ color: '#13c2c2' }}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic
              title="Vendors"
              value={kpiData.vendorCount}
              valueStyle={{ color: '#eb2f96' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Real-time System Health & Status */}
      {realTimeData && (
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={24}>
            <Card 
              title={
                <Space>
                  <ThunderboltOutlined />
                  Real-time System Monitoring
                  <Badge 
                    status={realTimeData.system_health?.status === 'healthy' ? 'success' : 
                           realTimeData.system_health?.status === 'warning' ? 'warning' : 'error'} 
                    text={realTimeData.system_health?.status?.toUpperCase()} 
                  />
                </Space>
              }
              loading={realTimeLoading}
              extra={
                <Space>
                  <Tag color="green">Live</Tag>
                  <Button size="small" icon={<ReloadOutlined />} onClick={loadRealTimeData}>
                    Refresh
                  </Button>
                </Space>
              }
            >
              <Row gutter={16}>
                <Col xs={12} sm={6}>
                  <Statistic
                    title="Active Visitors"
                    value={realTimeData.currentVisitors}
                    prefix={<EyeOutlined />}
                    valueStyle={{ color: '#1890ff' }}
                  />
                </Col>
                <Col xs={12} sm={6}>
                  <Statistic
                    title="Active Orders"
                    value={realTimeData.activeOrders}
                    prefix={<ShoppingCartOutlined />}
                    valueStyle={{ color: '#52c41a' }}
                  />
                </Col>
                <Col xs={12} sm={6}>
                  <Statistic
                    title="Today's Revenue"
                    value={realTimeData.todayRevenue}
                    prefix="$"
                    precision={2}
                    valueStyle={{ color: '#722ed1' }}
                  />
                </Col>
                <Col xs={12} sm={6}>
                  <Statistic
                    title="System Uptime"
                    value={realTimeData.system_health?.uptime || 99.9}
                    suffix="%"
                    valueStyle={{ color: realTimeData.system_health?.uptime > 99 ? '#52c41a' : '#faad14' }}
                  />
                </Col>
              </Row>
              
              {/* Live transactions */}
              {realTimeData.live_transactions && realTimeData.live_transactions.length > 0 && (
                <div style={{ marginTop: 16 }}>
                  <Title level={5}>Live Transactions</Title>
                  <List
                    size="small"
                    dataSource={realTimeData.live_transactions.slice(0, 5)}
                    renderItem={(transaction: any) => (
                      <List.Item>
                        <Space>
                          <Avatar icon={<DollarOutlined />} size="small" />
                          <Text>{formatCurrency(transaction.amount)}</Text>
                          <Text type="secondary">from {transaction.customer}</Text>
                          <Text type="secondary">•</Text>
                          <Text>{transaction.product}</Text>
                          <Tag color="green">{transaction.timestamp}</Tag>
                        </Space>
                      </List.Item>
                    )}
                  />
                </div>
              )}
            </Card>
          </Col>
        </Row>
      )}

      {/* Executive Dashboard Insights */}
      {executiveData && (
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={16}>
            <Card title="Executive Key Performance Indicators">
              <Row gutter={16}>
                {executiveData.kpis && Object.entries(executiveData.kpis).map(([key, kpi]: [string, any]) => (
                  <Col xs={12} sm={8} key={key}>
                    <Card size="small" style={{ textAlign: 'center' }}>
                      <Statistic
                        title={key.replace(/_/g, ' ').toUpperCase()}
                        value={kpi.value}
                        valueStyle={{
                          color: kpi.trend === 'up' ? '#52c41a' : kpi.trend === 'down' ? '#ff4d4f' : '#1890ff'
                        }}
                        suffix={formatGrowth(kpi.change)}
                      />
                    </Card>
                  </Col>
                ))}
              </Row>
            </Card>
          </Col>
          <Col span={8}>
            <Card title="Strategic Insights">
              {executiveData.strategic_insights && (
                <List
                  size="small"
                  dataSource={executiveData.strategic_insights.slice(0, 4)}
                  renderItem={(insight: any) => (
                    <List.Item>
                      <Space direction="vertical" size="small">
                        <Space>
                          <Tag color={
                            insight.priority === 'high' ? 'red' :
                            insight.priority === 'medium' ? 'orange' : 'blue'
                          }>
                            {insight.priority.toUpperCase()}
                          </Tag>
                          <Text strong>{insight.category}</Text>
                        </Space>
                        <Text type="secondary">{insight.insight}</Text>
                      </Space>
                    </List.Item>
                  )}
                />
              )}
            </Card>
          </Col>
        </Row>
      )}

      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="Sales Overview" key="overview">
          <Row gutter={16}>
            <Col span={16}>
              <Card title="Sales Trends" loading={loading}>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="sales" stroke="#8884d8" strokeWidth={2} />
                    <Line type="monotone" dataKey="orders" stroke="#82ca9d" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </Col>
            <Col span={8}>
              <Card title="Category Distribution" loading={loading}>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </Col>
          </Row>
        </TabPane>

        <TabPane tab="Inventory Analytics" key="inventory">
          <Card title="Inventory Movement Trends" loading={loading}>
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={inventoryTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="incoming" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
                <Area type="monotone" dataKey="outgoing" stackId="2" stroke="#ffc658" fill="#ffc658" />
                <Area type="monotone" dataKey="stock" stackId="3" stroke="#8884d8" fill="#8884d8" />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </TabPane>

        <TabPane tab="Vendor Performance" key="vendors">
          <Row gutter={16}>
            <Col span={16}>
              <Card title="Top Performing Vendors" loading={loading}>
                <Table
                  columns={vendorColumns}
                  dataSource={vendorPerformance}
                  rowKey="id"
                  pagination={{ pageSize: 10 }}
                  scroll={{ y: 400 }}
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card title="Vendor Analytics Summary" loading={loading}>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Statistic
                    title="Total Vendors"
                    value={vendorPerformance.length}
                    prefix={<ShopOutlined />}
                    valueStyle={{ color: '#1890ff' }}
                  />
                  <Divider />
                  <Statistic
                    title="Avg Vendor Rating"
                    value={vendorPerformance.length > 0 ? 
                      (vendorPerformance.reduce((acc: number, v: any) => acc + (v.averageRating || 0), 0) / vendorPerformance.length).toFixed(1) : 0
                    }
                    suffix="/ 5.0"
                    valueStyle={{ color: '#52c41a' }}
                  />
                  <Divider />
                  <Statistic
                    title="Total Vendor Revenue"
                    value={vendorPerformance.reduce((acc: number, v: any) => acc + (v.totalRevenue || 0), 0)}
                    prefix="$"
                    precision={2}
                    valueStyle={{ color: '#722ed1' }}
                  />
                  
                  {/* Vendor performance trends */}
                  <div style={{ marginTop: 20 }}>
                    <Title level={5}>Performance Distribution</Title>
                    {vendorPerformance.length > 0 && (
                      <div>
                        <div style={{ marginBottom: 8 }}>
                          <Text type="secondary">High Performers (4.5+ rating)</Text>
                          <Progress 
                            percent={Math.round((vendorPerformance.filter(v => (v.averageRating || 0) >= 4.5).length / vendorPerformance.length) * 100)} 
                            strokeColor="#52c41a"
                            size="small"
                          />
                        </div>
                        <div style={{ marginBottom: 8 }}>
                          <Text type="secondary">Medium Performers (3.5-4.4)</Text>
                          <Progress 
                            percent={Math.round((vendorPerformance.filter(v => (v.averageRating || 0) >= 3.5 && (v.averageRating || 0) < 4.5).length / vendorPerformance.length) * 100)} 
                            strokeColor="#faad14"
                            size="small"
                          />
                        </div>
                        <div>
                          <Text type="secondary">Needs Attention (&lt;3.5)</Text>
                          <Progress 
                            percent={Math.round((vendorPerformance.filter(v => (v.averageRating || 0) < 3.5).length / vendorPerformance.length) * 100)} 
                            strokeColor="#ff4d4f"
                            size="small"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </Space>
              </Card>
            </Col>
          </Row>
        </TabPane>

        <TabPane tab="Financial Reports" key="financial">
          <Row gutter={16}>
            <Col span={12}>
              <Card title="Revenue by Month" loading={loading}>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="sales" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </Col>
            <Col span={12}>
              <Card title="Financial Summary" loading={loading}>
                <Alert
                  message="Profit & Loss Overview"
                  description="Detailed financial analytics including profit margins, costs, and revenue breakdowns."
                  type="success"
                  style={{ marginBottom: 16 }}
                />
                <div style={{ marginTop: 20 }}>
                  <Statistic title="Gross Profit Margin" value={28.5} suffix="%" />
                  <Statistic title="Operating Expenses" value={45280} prefix="$" style={{ marginTop: 16 }} />
                  <Statistic title="Net Profit" value={38950} prefix="$" style={{ marginTop: 16 }} />
                </div>
              </Card>
            </Col>
          </Row>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default AnalyticsDashboard;
