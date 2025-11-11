import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Select,
  DatePicker,
  Statistic,
  Table,
  Progress,
  Tag,
  Space,
  Tooltip,
  Divider,
  List,
  Avatar,
  Badge,
  Empty,
  Spin,
  Button,
} from 'antd';
import {
  BarChartOutlined,
  TrophyOutlined,
  RiseOutlined,
  FallOutlined,
  DollarOutlined,
  EyeOutlined,
  UserOutlined,
  GiftOutlined,
  FireOutlined,
  ThunderboltOutlined,
  CrownOutlined,
  StarOutlined,
  ShoppingCartOutlined,
  PercentageOutlined,
  CalendarOutlined,
  ExportOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { dealsAPI } from '@/services/api/deals';
import { couponsAPI } from '@/services/api/coupons';
import { promotionsAPI } from '@/services/api/promotions';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

interface MarketingOverview {
  totalDeals: number;
  totalCoupons: number;
  totalPromotions: number;
  totalRevenue: number;
  totalDiscountGiven: number;
  totalCustomersReached: number;
  avgConversionRate: number;
  avgROI: number;
  topPerformingChannel: string;
  topPerformingDealType: string;
  recentTrends: Array<{
    metric: string;
    value: number;
    change: number;
    trend: 'up' | 'down' | 'stable';
  }>;
}

interface TopPerformer {
  id: number;
  name: string;
  type: 'deal' | 'coupon' | 'promotion';
  revenue: number;
  conversions: number;
  conversionRate: number;
  roi: number;
  status: string;
}

interface RecentActivity {
  id: string;
  type: 'deal_created' | 'coupon_redeemed' | 'promotion_launched' | 'campaign_completed';
  title: string;
  description: string;
  timestamp: string;
  impact: {
    metric: string;
    value: number;
  };
  user?: string;
}

const MarketingAnalyticsDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState<MarketingOverview | null>(null);
  const [topPerformers, setTopPerformers] = useState<TopPerformer[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
    dayjs().subtract(30, 'days'),
    dayjs(),
  ]);

  useEffect(() => {
    fetchAnalyticsData();
  }, [dateRange]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      
      // Fetch data from different APIs
      const [dealStats, couponStats, promotionStats] = await Promise.all([
        dealsAPI.getStats(),
        couponsAPI.getStats(),
        promotionsAPI.getStats(),
      ]);

      // Mock combined overview data (in real implementation, you'd have a dedicated analytics endpoint)
      const mockOverview: MarketingOverview = {
        totalDeals: dealStats.total || 0,
        totalCoupons: couponStats.total || 0,
        totalPromotions: promotionStats.total || 0,
        totalRevenue: (dealStats.totalRevenue || 0) + (promotionStats.totalRevenue || 0),
        totalDiscountGiven: couponStats.totalDiscountGiven || 0,
        totalCustomersReached: 15420,
        avgConversionRate: ((dealStats.avgConversionRate || 0) + (promotionStats.avgCTR || 0)) / 2,
        avgROI: promotionStats.avgROI || 0,
        topPerformingChannel: promotionStats.topPerformingType || 'email',
        topPerformingDealType: dealStats.mostPopularType || 'percentage',
        recentTrends: [
          { metric: 'Revenue', value: 125680, change: 12.5, trend: 'up' },
          { metric: 'Conversions', value: 3420, change: 8.3, trend: 'up' },
          { metric: 'CTR', value: 4.2, change: -2.1, trend: 'down' },
          { metric: 'ROI', value: 185.4, change: 15.7, trend: 'up' },
        ],
      };

      // Mock top performers
      const mockTopPerformers: TopPerformer[] = [
        {
          id: 1,
          name: 'Black Friday Mega Sale',
          type: 'deal',
          revenue: 45230,
          conversions: 1250,
          conversionRate: 8.5,
          roi: 320.5,
          status: 'active',
        },
        {
          id: 2,
          name: 'SAVE50 Coupon',
          type: 'coupon',
          revenue: 28650,
          conversions: 892,
          conversionRate: 12.3,
          roi: 285.2,
          status: 'active',
        },
        {
          id: 3,
          name: 'Email Holiday Campaign',
          type: 'promotion',
          revenue: 18920,
          conversions: 654,
          conversionRate: 6.8,
          roi: 245.8,
          status: 'completed',
        },
      ];

      // Mock recent activity
      const mockActivity: RecentActivity[] = [
        {
          id: '1',
          type: 'deal_created',
          title: 'New Flash Sale Created',
          description: 'Weekend Flash Sale - 30% Off Electronics',
          timestamp: dayjs().subtract(2, 'hours').toISOString(),
          impact: { metric: 'Expected Revenue', value: 12000 },
          user: 'Admin User',
        },
        {
          id: '2',
          type: 'coupon_redeemed',
          title: 'High-Value Coupon Redeemed',
          description: 'SAVE100 coupon redeemed for $250 order',
          timestamp: dayjs().subtract(4, 'hours').toISOString(),
          impact: { metric: 'Discount Given', value: 100 },
        },
        {
          id: '3',
          type: 'promotion_launched',
          title: 'Social Media Campaign Launched',
          description: 'Instagram Holiday Promotion went live',
          timestamp: dayjs().subtract(1, 'day').toISOString(),
          impact: { metric: 'Reach', value: 5000 },
          user: 'Marketing Team',
        },
        {
          id: '4',
          type: 'campaign_completed',
          title: 'Email Campaign Completed',
          description: 'Weekly Newsletter achieved 8.5% CTR',
          timestamp: dayjs().subtract(2, 'days').toISOString(),
          impact: { metric: 'CTR', value: 8.5 },
        },
      ];

      setOverview(mockOverview);
      setTopPerformers(mockTopPerformers);
      setRecentActivity(mockActivity);
    } catch (error) {
      console.error('Failed to load analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: RecentActivity['type']) => {
    const icons = {
      deal_created: <GiftOutlined style={{ color: '#52c41a' }} />,
      coupon_redeemed: <PercentageOutlined style={{ color: '#1890ff' }} />,
      promotion_launched: <ThunderboltOutlined style={{ color: '#fa8c16' }} />,
      campaign_completed: <TrophyOutlined style={{ color: '#722ed1' }} />,
    };
    return icons[type];
  };

  const getTypeIcon = (type: TopPerformer['type']) => {
    const icons = {
      deal: <FireOutlined style={{ color: '#ff4d4f' }} />,
      coupon: <GiftOutlined style={{ color: '#52c41a' }} />,
      promotion: <ThunderboltOutlined style={{ color: '#1890ff' }} />,
    };
    return icons[type];
  };

  const topPerformersColumns: ColumnsType<TopPerformer> = [
    {
      title: 'Name',
      key: 'name',
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {getTypeIcon(record.type)}
          <div style={{ marginLeft: 8 }}>
            <Text strong>{record.name}</Text>
            <div>
              <Tag color={record.type === 'deal' ? 'red' : record.type === 'coupon' ? 'green' : 'blue'}>
                {record.type.toUpperCase()}
              </Tag>
              <Tag color={record.status === 'active' ? 'green' : 'blue'}>
                {record.status.toUpperCase()}
              </Tag>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Revenue',
      dataIndex: 'revenue',
      key: 'revenue',
      render: (value) => (
        <div>
          <Text strong>${value.toLocaleString()}</Text>
        </div>
      ),
      sorter: (a, b) => a.revenue - b.revenue,
    },
    {
      title: 'Conversions',
      dataIndex: 'conversions',
      key: 'conversions',
      render: (value, record) => (
        <div>
          <Text strong>{value}</Text>
          <div>
            <Text type="secondary" style={{ fontSize: 12 }}>
              CVR: {record.conversionRate.toFixed(1)}%
            </Text>
          </div>
        </div>
      ),
      sorter: (a, b) => a.conversions - b.conversions,
    },
    {
      title: 'ROI',
      dataIndex: 'roi',
      key: 'roi',
      render: (value) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Text strong style={{ color: value >= 200 ? '#52c41a' : value >= 100 ? '#fa8c16' : '#ff4d4f' }}>
            {value.toFixed(1)}%
          </Text>
          {value >= 200 && <RiseOutlined style={{ color: '#52c41a', marginLeft: 4 }} />}
          {value < 100 && <FallOutlined style={{ color: '#ff4d4f', marginLeft: 4 }} />}
        </div>
      ),
      sorter: (a, b) => a.roi - b.roi,
    },
  ];

  return (
    <Spin spinning={loading}>
      <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
        <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
          <Col>
            <Title level={3}>
              <BarChartOutlined style={{ color: '#1890ff' }} /> Marketing Analytics Dashboard
            </Title>
            <Paragraph type="secondary">
              Comprehensive insights into your marketing campaigns performance
            </Paragraph>
          </Col>
          <Col>
            <Space>
              <RangePicker
                value={dateRange}
                onChange={(dates) => dates && setDateRange(dates)}
                format="YYYY-MM-DD"
              />
              <Button icon={<ExportOutlined />}>Export Report</Button>
            </Space>
          </Col>
        </Row>

        {/* Overview Statistics */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Card>
              <Statistic
                title="Total Revenue"
                value={overview?.totalRevenue || 0}
                prefix={<DollarOutlined />}
                precision={0}
                valueStyle={{ color: '#52c41a' }}
                suffix="USD"
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Card>
              <Statistic
                title="Active Campaigns"
                value={(overview?.totalDeals || 0) + (overview?.totalCoupons || 0) + (overview?.totalPromotions || 0)}
                prefix={<ThunderboltOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Card>
              <Statistic
                title="Customers Reached"
                value={overview?.totalCustomersReached || 0}
                prefix={<UserOutlined />}
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Card>
              <Statistic
                title="Avg Conversion Rate"
                value={overview?.avgConversionRate || 0}
                precision={1}
                suffix="%"
                prefix={<RiseOutlined />}
                valueStyle={{ color: '#fa8c16' }}
              />
            </Card>
          </Col>
        </Row>

        {/* Trends and Performance */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} lg={16}>
            <Card title="Marketing Performance Trends">
              {overview?.recentTrends ? (
                <Row gutter={[16, 16]}>
                  {overview.recentTrends.map((trend, index) => (
                    <Col xs={24} sm={12} key={index}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 16, background: '#fafafa', borderRadius: 8 }}>
                        <div>
                          <Text type="secondary">{trend.metric}</Text>
                          <div>
                            <Text strong style={{ fontSize: 18 }}>
                              {trend.metric.includes('Rate') || trend.metric.includes('CTR') || trend.metric.includes('ROI') 
                                ? `${trend.value}%` 
                                : trend.value.toLocaleString()}
                            </Text>
                          </div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          {trend.trend === 'up' && <RiseOutlined style={{ color: '#52c41a', fontSize: 20 }} />}
                          {trend.trend === 'down' && <FallOutlined style={{ color: '#ff4d4f', fontSize: 20 }} />}
                          <div>
                            <Text 
                              style={{ 
                                color: trend.trend === 'up' ? '#52c41a' : '#ff4d4f',
                                fontSize: 12,
                                fontWeight: 'bold'
                              }}
                            >
                              {trend.change > 0 ? '+' : ''}{trend.change}%
                            </Text>
                          </div>
                        </div>
                      </div>
                    </Col>
                  ))}
                </Row>
              ) : (
                <Empty description="No trend data available" />
              )}
            </Card>
          </Col>
          <Col xs={24} lg={8}>
            <Card title="Channel Insights" style={{ height: '100%' }}>
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <Text>Top Performing Channel</Text>
                  <Tag color="gold">
                    <CrownOutlined /> {overview?.topPerformingChannel?.toUpperCase()}
                  </Tag>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <Text>Best Deal Type</Text>
                  <Tag color="blue">
                    <StarOutlined /> {overview?.topPerformingDealType?.toUpperCase()}
                  </Tag>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <Text>Average ROI</Text>
                  <Text strong style={{ color: '#52c41a' }}>
                    {overview?.avgROI?.toFixed(1)}%
                  </Text>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text>Total Discount Given</Text>
                  <Text strong>
                    ${overview?.totalDiscountGiven?.toLocaleString()}
                  </Text>
                </div>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Top Performers and Recent Activity */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} lg={14}>
            <Card 
              title={
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <TrophyOutlined style={{ color: '#faad14', marginRight: 8 }} />
                  Top Performing Campaigns
                </div>
              }
              extra={
                <Select defaultValue="revenue" style={{ width: 120 }}>
                  <Option value="revenue">By Revenue</Option>
                  <Option value="conversions">By Conversions</Option>
                  <Option value="roi">By ROI</Option>
                </Select>
              }
            >
              <Table
                columns={topPerformersColumns}
                dataSource={topPerformers}
                rowKey="id"
                pagination={false}
                size="small"
              />
            </Card>
          </Col>
          <Col xs={24} lg={10}>
            <Card 
              title={
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <CalendarOutlined style={{ color: '#1890ff', marginRight: 8 }} />
                  Recent Activity
                </div>
              }
              style={{ height: '100%' }}
            >
              <List
                dataSource={recentActivity}
                renderItem={(item) => (
                  <List.Item style={{ padding: '12px 0' }}>
                    <List.Item.Meta
                      avatar={<Avatar icon={getActivityIcon(item.type)} />}
                      title={
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Text strong>{item.title}</Text>
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            {dayjs(item.timestamp).fromNow()}
                          </Text>
                        </div>
                      }
                      description={
                        <div>
                          <Paragraph style={{ margin: 0, fontSize: 12 }}>
                            {item.description}
                          </Paragraph>
                          <div style={{ marginTop: 4, display: 'flex', justifyContent: 'space-between' }}>
                            <Text type="secondary" style={{ fontSize: 11 }}>
                              {item.user && `by ${item.user}`}
                            </Text>
                            <Tag size="small" color="blue">
                              {item.impact.metric}: {item.impact.value}
                            </Tag>
                          </div>
                        </div>
                      }
                    />
                  </List.Item>
                )}
                style={{ maxHeight: 350, overflow: 'auto' }}
              />
            </Card>
          </Col>
        </Row>

        {/* Quick Actions */}
        <Card title="Quick Actions" style={{ marginBottom: 24 }}>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={6}>
              <Card size="small" hoverable style={{ textAlign: 'center' }}>
                <FireOutlined style={{ fontSize: 24, color: '#ff4d4f', marginBottom: 8 }} />
                <div>
                  <Text strong>Create Flash Sale</Text>
                </div>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Quick 24-hour deal
                </Text>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card size="small" hoverable style={{ textAlign: 'center' }}>
                <GiftOutlined style={{ fontSize: 24, color: '#52c41a', marginBottom: 8 }} />
                <div>
                  <Text strong>Generate Coupons</Text>
                </div>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Bulk coupon creation
                </Text>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card size="small" hoverable style={{ textAlign: 'center' }}>
                <ThunderboltOutlined style={{ fontSize: 24, color: '#1890ff', marginBottom: 8 }} />
                <div>
                  <Text strong>Launch Campaign</Text>
                </div>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Multi-channel promotion
                </Text>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card size="small" hoverable style={{ textAlign: 'center' }}>
                <BarChartOutlined style={{ fontSize: 24, color: '#722ed1', marginBottom: 8 }} />
                <div>
                  <Text strong>View Reports</Text>
                </div>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Detailed analytics
                </Text>
              </Card>
            </Col>
          </Row>
        </Card>
      </div>
    </Spin>
  );
};

export default MarketingAnalyticsDashboard;