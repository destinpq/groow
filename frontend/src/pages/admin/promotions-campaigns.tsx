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
  Timeline,
  Steps,
  Radio,
} from 'antd';
import {
  ApiOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  CopyOutlined,
  BarChartOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  StopOutlined,
  UploadOutlined,
  CalendarOutlined,
  MailOutlined,
  BellOutlined,
  MobileOutlined,
  GlobalOutlined,
  TeamOutlined,
  TrophyOutlined,
  RiseOutlined,
  DollarOutlined,
  ExperimentOutlined,
  SettingOutlined,
  FileImageOutlined,
  VideoCameraOutlined,
  SendOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs, { Dayjs } from 'dayjs';
import { promotionsAPI } from '@/services/api/promotions';
import type { 
  Promotion, 
  CreatePromotionDto, 
  UpdatePromotionDto, 
  PromotionStats, 
  PromotionAnalytics,
  PromotionTemplate,
} from '@/services/api/promotions';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

// Utility function to safely handle array operations
const safeArray = (arr: any[] | undefined | null): any[] => {
  return Array.isArray(arr) ? arr : [];
};
const { TextArea } = Input;
const { TabPane } = Tabs;
const { Step } = Steps;

const PromotionsManagementPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [stats, setStats] = useState<PromotionStats | null>(null);
  const [analytics, setAnalytics] = useState<PromotionAnalytics | null>(null);
  const [templates, setTemplates] = useState<PromotionTemplate[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAnalyticsModalVisible, setIsAnalyticsModalVisible] = useState(false);
  const [isTemplateModalVisible, setIsTemplateModalVisible] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [filters, setFilters] = useState({
    type: 'all',
    status: 'all',
    objective: 'all',
  });
  const [form] = Form.useForm();

  useEffect(() => {
    fetchPromotions();
    fetchStats();
    fetchTemplates();
  }, [filters]);

  const fetchPromotions = async () => {
    try {
      setLoading(true);
      const filterParams: any = {};
      if (filters.type !== 'all') filterParams.type = filters.type;
      if (filters.status !== 'all') filterParams.status = filters.status;
      if (filters.objective !== 'all') filterParams.objective = filters.objective;

      const response = await promotionsAPI.getAll(filterParams);
      // SAFE API RESPONSE HANDLING - response.promotions should be an array
      const promotionsData = response?.promotions || response?.data || [];
      setPromotions(Array.isArray(promotionsData) ? promotionsData : []);
    } catch (error) {
      message.error('Failed to load promotions');
      setPromotions([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const statsData = await promotionsAPI.getStats();
      setStats(statsData);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const fetchTemplates = async () => {
    try {
      const templatesData = await promotionsAPI.getTemplates();
      setTemplates(templatesData);
    } catch (error) {
      console.error('Failed to load templates:', error);
    }
  };

  const fetchAnalytics = async (promotionId: number) => {
    try {
      const analyticsData = await promotionsAPI.getAnalytics(promotionId);
      setAnalytics(analyticsData);
      setIsAnalyticsModalVisible(true);
    } catch (error) {
      message.error('Failed to load analytics');
    }
  };

  const handleCreate = () => {
    setSelectedPromotion(null);
    setCurrentStep(0);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (promotion: Promotion) => {
    setSelectedPromotion(promotion);
    setCurrentStep(0);
    form.setFieldsValue({
      ...promotion,
      dateRange: [dayjs(promotion.startDate), dayjs(promotion.endDate)],
      content: promotion.content,
      channels: promotion.channels,
      scheduling: promotion.scheduling,
      abTesting: promotion.abTesting,
    });
    setIsModalVisible(true);
  };

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      const [startDate, endDate] = values.dateRange;
      
      const promotionData: CreatePromotionDto | UpdatePromotionDto = {
        name: values.name,
        description: values.description,
        type: values.type,
        objective: values.objective,
        targetAudience: values.targetAudience,
        audienceSegment: values.audienceSegment,
        startDate: startDate.format('YYYY-MM-DD'),
        endDate: endDate.format('YYYY-MM-DD'),
        budget: values.budget,
        content: values.content,
        channels: values.channels,
        scheduling: values.scheduling,
        abTesting: values.abTesting,
        tags: values.tags || [],
        associatedDeals: values.associatedDeals,
        associatedCoupons: values.associatedCoupons,
      };

      if (selectedPromotion) {
        await promotionsAPI.update(selectedPromotion.id, promotionData);
        message.success('Promotion updated successfully');
      } else {
        await promotionsAPI.create(promotionData as CreatePromotionDto);
        message.success('Promotion created successfully');
      }

      setIsModalVisible(false);
      await fetchPromotions();
      await fetchStats();
    } catch (error) {
      message.error(selectedPromotion ? 'Failed to update promotion' : 'Failed to create promotion');
    } finally {
      setLoading(false);
    }
  };

  const handleLaunch = async (id: number) => {
    try {
      await promotionsAPI.launch(id);
      message.success('Promotion launched successfully');
      await fetchPromotions();
      await fetchStats();
    } catch (error) {
      message.error('Failed to launch promotion');
    }
  };

  const handlePause = async (id: number) => {
    try {
      await promotionsAPI.pause(id);
      message.success('Promotion paused successfully');
      await fetchPromotions();
    } catch (error) {
      message.error('Failed to pause promotion');
    }
  };

  const handleResume = async (id: number) => {
    try {
      await promotionsAPI.resume(id);
      message.success('Promotion resumed successfully');
      await fetchPromotions();
    } catch (error) {
      message.error('Failed to resume promotion');
    }
  };

  const handleCancel = async (id: number) => {
    Modal.confirm({
      title: 'Cancel Promotion',
      content: 'Are you sure you want to cancel this promotion? This action cannot be undone.',
      okText: 'Cancel Promotion',
      okType: 'danger',
      onOk: async () => {
        try {
          await promotionsAPI.cancel(id);
          message.success('Promotion cancelled successfully');
          await fetchPromotions();
        } catch (error) {
          message.error('Failed to cancel promotion');
        }
      },
    });
  };

  const handleSendTest = async (id: number) => {
    const emails = ['test@example.com']; // This would come from a form
    try {
      await promotionsAPI.sendTest(id, emails);
      message.success('Test promotion sent successfully');
    } catch (error) {
      message.error('Failed to send test promotion');
    }
  };

  const getStatusConfig = (status: Promotion['status']) => {
    const configs = {
      draft: { color: 'default', text: 'Draft', icon: <EditOutlined /> },
      active: { color: 'green', text: 'Active', icon: <PlayCircleOutlined /> },
      paused: { color: 'orange', text: 'Paused', icon: <PauseCircleOutlined /> },
      completed: { color: 'blue', text: 'Completed', icon: <CheckCircleOutlined /> },
      cancelled: { color: 'red', text: 'Cancelled', icon: <StopOutlined /> },
    };
    return configs[status] || configs.draft;
  };

  const getTypeIcon = (type: string) => {
    const icons: Record<string, React.ReactNode> = {
      email: <MailOutlined />,
      banner: <FileImageOutlined />,
      popup: <BellOutlined />,
      social: <GlobalOutlined />,
      sms: <MobileOutlined />,
      push: <BellOutlined />,
    };
    return icons[type] || <ApiOutlined />;
  };

  const columns: ColumnsType<Promotion> = [
    {
      title: 'Campaign Information',
      key: 'info',
      render: (_, record) => (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
            <div style={{ marginRight: 8 }}>
              {getTypeIcon(record.type)}
            </div>
            <Text strong style={{ fontSize: 16 }}>
              {record.name}
            </Text>
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
      title: 'Type & Objective',
      key: 'typeObjective',
      render: (_, record) => (
        <div>
          <Tag color="blue">{record.type.toUpperCase()}</Tag>
          <div style={{ marginTop: 4 }}>
            <Tag color="purple">{record.objective.toUpperCase()}</Tag>
          </div>
        </div>
      ),
    },
    {
      title: 'Target Audience',
      dataIndex: 'targetAudience',
      key: 'targetAudience',
      render: (audience, record) => {
        const audienceConfig: Record<string, { color: string; text: string }> = {
          all: { color: 'default', text: 'All Users' },
          'new-customers': { color: 'green', text: 'New Customers' },
          returning: { color: 'blue', text: 'Returning' },
          vip: { color: 'gold', text: 'VIP' },
          segment: { color: 'purple', text: record.audienceSegment || 'Custom Segment' },
        };
        const config = audienceConfig[audience] || audienceConfig.all;
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: 'Budget & Performance',
      key: 'performance',
      render: (_, record) => {
        const budgetUsed = (record.spentBudget / record.budget) * 100;
        const roiColor = record.roi >= 200 ? 'green' : record.roi >= 100 ? 'orange' : 'red';
        
        return (
          <div>
            <div style={{ marginBottom: 4 }}>
              <Text style={{ fontSize: 12 }}>
                Budget: ${record.spentBudget.toLocaleString()} / ${record.budget.toLocaleString()}
              </Text>
            </div>
            <Progress
              percent={budgetUsed}
              size="small"
              showInfo={false}
              strokeColor={budgetUsed > 90 ? '#ff4d4f' : '#52c41a'}
            />
            <div style={{ marginTop: 4, display: 'flex', gap: 8 }}>
              <Text style={{ fontSize: 12, color: roiColor }}>
                ROI: {record.roi.toFixed(1)}%
              </Text>
              <Text style={{ fontSize: 12 }}>
                CTR: {record.ctr.toFixed(1)}%
              </Text>
            </div>
            <div style={{ marginTop: 2 }}>
              <Text style={{ fontSize: 12 }}>
                Conversions: {record.conversions}
              </Text>
            </div>
          </div>
        );
      },
    },
    {
      title: 'Campaign Period',
      key: 'period',
      render: (_, record) => {
        const daysLeft = dayjs(record.endDate).diff(dayjs(), 'days');
        const isActive = record.status === 'active';
        
        return (
          <div>
            <div>
              <Text style={{ fontSize: 12 }}>
                {dayjs(record.startDate).format('MMM DD')} - {dayjs(record.endDate).format('MMM DD, YYYY')}
              </Text>
            </div>
            {isActive && daysLeft > 0 && (
              <Text type={daysLeft < 3 ? 'danger' : 'secondary'} style={{ fontSize: 12 }}>
                {daysLeft === 0 ? 'Ends today' : `${daysLeft} days left`}
              </Text>
            )}
          </div>
        );
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const config = getStatusConfig(status);
        return (
          <Tag color={config.color} icon={config.icon}>
            {config.text}
          </Tag>
        );
      },
    },
    {
      title: 'A/B Test',
      key: 'abTest',
      render: (_, record) => {
        if (!record.abTesting.enabled) {
          return <Text type="secondary">No</Text>;
        }
        
        const variants = record.abTesting.variants?.length || 0;
        const winner = record.abTesting.winnerVariant;
        
        return (
          <div>
            <Badge count={variants} color="purple">
              <ExperimentOutlined style={{ fontSize: 16 }} />
            </Badge>
            {winner && (
              <div style={{ marginTop: 4 }}>
                <Tag color="gold">Winner: {winner}</Tag>
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="small" direction="vertical">
          <Space size="small">
            <Tooltip title="View Analytics">
              <Button
                size="small"
                icon={<BarChartOutlined />}
                onClick={() => fetchAnalytics(record.id)}
              />
            </Tooltip>
            <Tooltip title="Edit">
              <Button
                size="small"
                icon={<EditOutlined />}
                onClick={() => handleEdit(record)}
                disabled={record.status === 'completed' || record.status === 'cancelled'}
              />
            </Tooltip>
            <Tooltip title="Send Test">
              <Button
                size="small"
                icon={<SendOutlined />}
                onClick={() => handleSendTest(record.id)}
                disabled={record.status !== 'draft'}
              />
            </Tooltip>
          </Space>
          <Space size="small">
            {record.status === 'draft' && (
              <Button
                size="small"
                type="primary"
                icon={<PlayCircleOutlined />}
                onClick={() => handleLaunch(record.id)}
              >
                Launch
              </Button>
            )}
            {record.status === 'active' && (
              <Button
                size="small"
                icon={<PauseCircleOutlined />}
                onClick={() => handlePause(record.id)}
              >
                Pause
              </Button>
            )}
            {record.status === 'paused' && (
              <Button
                size="small"
                type="primary"
                icon={<PlayCircleOutlined />}
                onClick={() => handleResume(record.id)}
              >
                Resume
              </Button>
            )}
            {(record.status === 'active' || record.status === 'paused') && (
              <Button
                size="small"
                danger
                icon={<StopOutlined />}
                onClick={() => handleCancel(record.id)}
              >
                Cancel
              </Button>
            )}
          </Space>
        </Space>
      ),
    },
  ];

  const campaignSteps = [
    { title: 'Basic Info', icon: <SettingOutlined /> },
    { title: 'Content', icon: <FileImageOutlined /> },
    { title: 'Targeting', icon: <TeamOutlined /> },
    { title: 'Scheduling', icon: <CalendarOutlined /> },
    { title: 'A/B Testing', icon: <ExperimentOutlined /> },
  ];

  return (
    <Spin spinning={loading}>
      <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
        <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
          <Col>
            <Title level={3}>
              <ApiOutlined style={{ color: '#722ed1' }} /> Promotions Management
            </Title>
            <Paragraph type="secondary">
              Create and manage promotional campaigns across multiple channels
            </Paragraph>
          </Col>
          <Col>
            <Space>
              <Button icon={<EyeOutlined />} onClick={() => setIsTemplateModalVisible(true)}>
                Templates
              </Button>
              <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
                Create Campaign
              </Button>
            </Space>
          </Col>
        </Row>

        {/* Statistics Cards */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={12} sm={8} lg={6}>
            <Card>
              <Statistic
                title="Active Campaigns"
                value={stats?.active || 0}
                prefix={<PlayCircleOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={8} lg={6}>
            <Card>
              <Statistic
                title="Total Budget"
                value={stats?.totalBudget || 0}
                prefix={<DollarOutlined />}
                precision={0}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={8} lg={6}>
            <Card>
              <Statistic
                title="Avg ROI"
                value={stats?.avgROI || 0}
                suffix="%"
                prefix={<RiseOutlined />}
                precision={1}
                valueStyle={{ color: '#fa8c16' }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={8} lg={6}>
            <Card>
              <Statistic
                title="Avg CTR"
                value={stats?.avgCTR || 0}
                suffix="%"
                prefix={<EyeOutlined />}
                precision={1}
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
        </Row>

        {/* Insights */}
        {stats?.topPerformingType && (
          <Alert
            message={
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <TrophyOutlined style={{ color: '#faad14' }} />
                <Text strong>Top Performing Channel: {stats.topPerformingType.toUpperCase()}</Text>
              </div>
            }
            description={`Best performing objective: ${stats.topPerformingObjective.toUpperCase()}`}
            type="info"
            showIcon={false}
            style={{ marginBottom: 16 }}
          />
        )}

        {/* Filters */}
        <Card style={{ marginBottom: 16 }}>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={8}>
              <Select
                placeholder="Campaign Type"
                value={filters.type}
                onChange={(value) => setFilters({ ...filters, type: value })}
                style={{ width: '100%' }}
              >
                <Option value="all">All Types</Option>
                <Option value="email">Email</Option>
                <Option value="banner">Banner</Option>
                <Option value="popup">Popup</Option>
                <Option value="social">Social Media</Option>
                <Option value="sms">SMS</Option>
                <Option value="push">Push Notification</Option>
              </Select>
            </Col>
            <Col xs={24} sm={8}>
              <Select
                placeholder="Status"
                value={filters.status}
                onChange={(value) => setFilters({ ...filters, status: value })}
                style={{ width: '100%' }}
              >
                <Option value="all">All Status</Option>
                <Option value="draft">Draft</Option>
                <Option value="active">Active</Option>
                <Option value="paused">Paused</Option>
                <Option value="completed">Completed</Option>
                <Option value="cancelled">Cancelled</Option>
              </Select>
            </Col>
            <Col xs={24} sm={8}>
              <Select
                placeholder="Objective"
                value={filters.objective}
                onChange={(value) => setFilters({ ...filters, objective: value })}
                style={{ width: '100%' }}
              >
                <Option value="all">All Objectives</Option>
                <Option value="awareness">Awareness</Option>
                <Option value="conversion">Conversion</Option>
                <Option value="retention">Retention</Option>
                <Option value="engagement">Engagement</Option>
                <Option value="acquisition">Acquisition</Option>
              </Select>
            </Col>
          </Row>
        </Card>

        {/* Promotions Table */}
        <Card title="All Campaigns">
          <Table
            columns={columns}
            dataSource={promotions}
            rowKey="id"
            scroll={{ x: 1600 }}
            pagination={{
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} campaigns`,
            }}
          />
        </Card>

        {/* Create/Edit Promotion Modal */}
        <Modal
          title={
            <div>
              <span>{selectedPromotion ? 'Edit Campaign' : 'Create New Campaign'}</span>
              <div style={{ marginTop: 8 }}>
                <Steps size="small" current={currentStep}>
                  {campaignSteps.map((step, index) => (
                    <Step key={index} title={step.title} icon={step.icon} />
                  ))}
                </Steps>
              </div>
            </div>
          }
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button
                disabled={currentStep === 0}
                onClick={() => setCurrentStep(currentStep - 1)}
              >
                Previous
              </Button>
              <div>
                <Button onClick={() => setIsModalVisible(false)}>
                  Cancel
                </Button>
                {currentStep < campaignSteps.length - 1 ? (
                  <Button
                    type="primary"
                    style={{ marginLeft: 8 }}
                    onClick={() => setCurrentStep(currentStep + 1)}
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    type="primary"
                    style={{ marginLeft: 8 }}
                    onClick={() => form.submit()}
                  >
                    {selectedPromotion ? 'Update Campaign' : 'Create Campaign'}
                  </Button>
                )}
              </div>
            </div>
          }
          width={900}
        >
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            {/* Step 1: Basic Info */}
            {currentStep === 0 && (
              <div>
                <Row gutter={16}>
                  <Col span={24}>
                    <Form.Item
                      label="Campaign Name"
                      name="name"
                      rules={[{ required: true, message: 'Please enter campaign name' }]}
                    >
                      <Input placeholder="Black Friday 2025 Email Campaign" />
                    </Form.Item>
                  </Col>
                  
                  <Col span={24}>
                    <Form.Item
                      label="Description"
                      name="description"
                      rules={[{ required: true, message: 'Please enter description' }]}
                    >
                      <TextArea rows={3} placeholder="Describe your campaign objectives and key messages..." />
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item
                      label="Campaign Type"
                      name="type"
                      rules={[{ required: true, message: 'Please select campaign type' }]}
                    >
                      <Select placeholder="Select type">
                        <Option value="email">Email Marketing</Option>
                        <Option value="banner">Website Banner</Option>
                        <Option value="popup">Popup Modal</Option>
                        <Option value="social">Social Media</Option>
                        <Option value="sms">SMS Campaign</Option>
                        <Option value="push">Push Notification</Option>
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item
                      label="Objective"
                      name="objective"
                      rules={[{ required: true, message: 'Please select objective' }]}
                    >
                      <Select placeholder="Select objective">
                        <Option value="awareness">Brand Awareness</Option>
                        <Option value="conversion">Drive Conversions</Option>
                        <Option value="retention">Customer Retention</Option>
                        <Option value="engagement">Increase Engagement</Option>
                        <Option value="acquisition">Customer Acquisition</Option>
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item
                      label="Budget"
                      name="budget"
                      rules={[{ required: true, message: 'Please enter budget' }]}
                    >
                      <InputNumber
                        style={{ width: '100%' }}
                        min={100}
                        prefix="$"
                        placeholder="5000"
                      />
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item
                      label="Campaign Period"
                      name="dateRange"
                      rules={[{ required: true, message: 'Please select campaign period' }]}
                    >
                      <RangePicker style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                </Row>
              </div>
            )}

            {/* Step 2: Content */}
            {currentStep === 1 && (
              <div>
                <Form.Item label="Content">
                  <Card>
                    <Row gutter={16}>
                      <Col span={24}>
                        <Form.Item
                          label="Main Title"
                          name={['content', 'title']}
                          rules={[{ required: true, message: 'Please enter title' }]}
                        >
                          <Input placeholder="Save Up to 50% This Black Friday!" />
                        </Form.Item>
                      </Col>
                      
                      <Col span={24}>
                        <Form.Item label="Subtitle" name={['content', 'subtitle']}>
                          <Input placeholder="Limited time offer on all categories" />
                        </Form.Item>
                      </Col>

                      <Col span={24}>
                        <Form.Item
                          label="Body Text"
                          name={['content', 'bodyText']}
                          rules={[{ required: true, message: 'Please enter body text' }]}
                        >
                          <TextArea rows={4} placeholder="Your compelling campaign message goes here..." />
                        </Form.Item>
                      </Col>

                      <Col span={12}>
                        <Form.Item
                          label="Call-to-Action Text"
                          name={['content', 'ctaText']}
                          rules={[{ required: true, message: 'Please enter CTA text' }]}
                        >
                          <Input placeholder="Shop Now" />
                        </Form.Item>
                      </Col>

                      <Col span={12}>
                        <Form.Item
                          label="CTA URL"
                          name={['content', 'ctaUrl']}
                          rules={[{ required: true, message: 'Please enter CTA URL' }]}
                        >
                          <Input placeholder="https://yourstore.com/sale" />
                        </Form.Item>
                      </Col>

                      <Col span={24}>
                        <Form.Item label="Upload Images">
                          <Upload.Dragger name="images" multiple>
                            <p className="ant-upload-drag-icon">
                              <FileImageOutlined />
                            </p>
                            <p className="ant-upload-text">Click or drag images to this area to upload</p>
                            <p className="ant-upload-hint">Support for multiple image uploads. Recommended size: 800x600px</p>
                          </Upload.Dragger>
                        </Form.Item>
                      </Col>
                    </Row>
                  </Card>
                </Form.Item>
              </div>
            )}

            {/* Step 3: Targeting */}
            {currentStep === 2 && (
              <div>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      label="Target Audience"
                      name="targetAudience"
                      rules={[{ required: true, message: 'Please select target audience' }]}
                    >
                      <Select placeholder="Select audience">
                        <Option value="all">All Customers</Option>
                        <Option value="new-customers">New Customers</Option>
                        <Option value="returning">Returning Customers</Option>
                        <Option value="vip">VIP Customers</Option>
                        <Option value="segment">Custom Segment</Option>
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item label="Audience Segment" name="audienceSegment">
                      <Input placeholder="High-value customers from last 30 days" />
                    </Form.Item>
                  </Col>

                  <Col span={24}>
                    <Form.Item
                      label="Channels"
                      name="channels"
                      rules={[{ required: true, message: 'Please select at least one channel' }]}
                    >
                      <Select mode="multiple" placeholder="Select channels">
                        <Option value="email">Email</Option>
                        <Option value="website">Website</Option>
                        <Option value="mobile-app">Mobile App</Option>
                        <Option value="social-media">Social Media</Option>
                        <Option value="sms">SMS</Option>
                        <Option value="push-notification">Push Notifications</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
              </div>
            )}

            {/* Step 4: Scheduling */}
            {currentStep === 3 && (
              <div>
                <Form.Item label="Scheduling Settings">
                  <Card>
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item
                          label="Timezone"
                          name={['scheduling', 'timezone']}
                          rules={[{ required: true }]}
                        >
                          <Select placeholder="Select timezone">
                            <Option value="UTC">UTC</Option>
                            <Option value="America/New_York">Eastern Time</Option>
                            <Option value="America/Chicago">Central Time</Option>
                            <Option value="America/Denver">Mountain Time</Option>
                            <Option value="America/Los_Angeles">Pacific Time</Option>
                          </Select>
                        </Form.Item>
                      </Col>

                      <Col span={12}>
                        <Form.Item
                          label="Frequency"
                          name={['scheduling', 'frequency']}
                          rules={[{ required: true }]}
                        >
                          <Select placeholder="Select frequency">
                            <Option value="once">One Time</Option>
                            <Option value="daily">Daily</Option>
                            <Option value="weekly">Weekly</Option>
                            <Option value="monthly">Monthly</Option>
                          </Select>
                        </Form.Item>
                      </Col>

                      <Col span={24}>
                        <Form.Item label="Preferred Time" name={['scheduling', 'timeOfDay']}>
                          <Input placeholder="10:00 AM" />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Card>
                </Form.Item>
              </div>
            )}

            {/* Step 5: A/B Testing */}
            {currentStep === 4 && (
              <div>
                <Form.Item label="A/B Testing Configuration">
                  <Card>
                    <Form.Item
                      name={['abTesting', 'enabled']}
                      valuePropName="checked"
                      style={{ marginBottom: 16 }}
                    >
                      <Switch /> <Text style={{ marginLeft: 8 }}>Enable A/B Testing</Text>
                    </Form.Item>

                    <Form.Item
                      noStyle
                      shouldUpdate={(prevValues, currentValues) => 
                        prevValues.abTesting?.enabled !== currentValues.abTesting?.enabled
                      }
                    >
                      {({ getFieldValue }) =>
                        getFieldValue(['abTesting', 'enabled']) && (
                          <div>
                            <Paragraph type="secondary">
                              Create multiple variants of your campaign to test which performs better.
                              Traffic will be automatically split between variants.
                            </Paragraph>
                            {/* A/B Testing variant configuration would go here */}
                          </div>
                        )
                      }
                    </Form.Item>
                  </Card>
                </Form.Item>

                <Form.Item label="Campaign Tags" name="tags">
                  <Select mode="tags" placeholder="Add tags for organization">
                    <Option value="black-friday">Black Friday</Option>
                    <Option value="seasonal">Seasonal</Option>
                    <Option value="discount">Discount</Option>
                    <Option value="new-product">New Product</Option>
                  </Select>
                </Form.Item>
              </div>
            )}
          </Form>
        </Modal>

        {/* Templates Modal */}
        <Modal
          title="Campaign Templates"
          open={isTemplateModalVisible}
          onCancel={() => setIsTemplateModalVisible(false)}
          footer={null}
          width={900}
        >
          <Row gutter={[16, 16]}>
            {templates.map((template) => (
              <Col xs={24} sm={12} md={8} key={template.id}>
                <Card
                  size="small"
                  cover={
                    template.previewImage && (
                      <img alt={template.name} src={template.previewImage} height={120} />
                    )
                  }
                  actions={[
                    <Button type="link" size="small">
                      Preview
                    </Button>,
                    <Button type="link" size="small">
                      Use Template
                    </Button>,
                  ]}
                >
                  <Card.Meta
                    title={template.name}
                    description={
                      <div>
                        <Paragraph ellipsis={{ rows: 2 }}>{template.description}</Paragraph>
                        <div style={{ marginTop: 8 }}>
                          <Tag>{template.type}</Tag>
                          <Tag>{template.objective}</Tag>
                        </div>
                      </div>
                    }
                  />
                </Card>
              </Col>
            ))}
          </Row>
        </Modal>

        {/* Analytics Modal */}
        <Modal
          title={analytics ? `Campaign Analytics: ${analytics.name}` : 'Campaign Analytics'}
          open={isAnalyticsModalVisible}
          onCancel={() => setIsAnalyticsModalVisible(false)}
          footer={null}
          width={1000}
        >
          {analytics && (
            <Tabs defaultActiveKey="1">
              <TabPane tab="Overview" key="1">
                <Row gutter={[16, 16]}>
                  <Col span={6}>
                    <Card size="small">
                      <Statistic title="Impressions" value={analytics.dailyMetrics.reduce((sum, day) => sum + day.impressions, 0)} />
                    </Card>
                  </Col>
                  <Col span={6}>
                    <Card size="small">
                      <Statistic title="Clicks" value={analytics.dailyMetrics.reduce((sum, day) => sum + day.clicks, 0)} />
                    </Card>
                  </Col>
                  <Col span={6}>
                    <Card size="small">
                      <Statistic title="Conversions" value={analytics.dailyMetrics.reduce((sum, day) => sum + day.conversions, 0)} />
                    </Card>
                  </Col>
                  <Col span={6}>
                    <Card size="small">
                      <Statistic 
                        title="Revenue" 
                        value={analytics.dailyMetrics.reduce((sum, day) => sum + day.revenue, 0)} 
                        prefix="$" 
                        precision={2}
                      />
                    </Card>
                  </Col>
                </Row>
              </TabPane>
              <TabPane tab="Channels" key="2">
                <Table
                  dataSource={analytics.channelPerformance}
                  columns={[
                    { title: 'Channel', dataIndex: 'channel', key: 'channel' },
                    { title: 'Impressions', dataIndex: 'impressions', key: 'impressions' },
                    { title: 'Clicks', dataIndex: 'clicks', key: 'clicks' },
                    { title: 'CTR %', dataIndex: 'ctr', key: 'ctr', render: (value) => `${value.toFixed(2)}%` },
                    { title: 'Conversions', dataIndex: 'conversions', key: 'conversions' },
                    { title: 'CVR %', dataIndex: 'conversionRate', key: 'conversionRate', render: (value) => `${value.toFixed(2)}%` },
                  ]}
                  pagination={false}
                  size="small"
                />
              </TabPane>
            </Tabs>
          )}
        </Modal>
      </div>
    </Spin>
  );
};

export default PromotionsManagementPage;