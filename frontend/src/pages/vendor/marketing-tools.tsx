import React, { useState } from 'react';
import { Card, Row, Col, Tabs, Typography, Form, Input, Button, Select, DatePicker, Switch, Table, Tag, Space, message, Statistic, Progress, Badge, Radio, Upload } from 'antd';
import { MailOutlined, BellOutlined, TrophyOutlined, PercentageOutlined, SendOutlined, EyeOutlined, SelectOutlined, StarOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

const VendorMarketingTools: React.FC = () => {
  const [campaignModalVisible, setCampaignModalVisible] = useState(false);
  const [promotionModalVisible, setPromotionModalVisible] = useState(false);
  const [form] = Form.useForm();

  const marketingStats = {
    totalCampaigns: 12,
    activeCampaigns: 4,
    emailsSent: 15680,
    openRate: 24.5,
    clickRate: 3.8,
    conversions: 156,
    revenue: 12450.00,
  };

  const campaigns = [
    {
      id: 1,
      name: 'Holiday Electronics Sale',
      type: 'email',
      status: 'active',
      sent: 2500,
      opened: 612,
      clicked: 89,
      conversions: 23,
      revenue: 3450.00,
      startDate: '2025-11-01',
      endDate: '2025-11-30',
    },
    {
      id: 2,
      name: 'New Product Launch',
      type: 'notification',
      status: 'completed',
      sent: 1800,
      opened: 945,
      clicked: 156,
      conversions: 45,
      revenue: 6780.00,
      startDate: '2025-10-15',
      endDate: '2025-10-31',
    },
    {
      id: 3,
      name: 'Customer Loyalty Program',
      type: 'email',
      status: 'draft',
      sent: 0,
      opened: 0,
      clicked: 0,
      conversions: 0,
      revenue: 0,
      startDate: '2025-11-15',
      endDate: '2025-12-15',
    },
  ];

  const promotions = [
    {
      id: 1,
      name: '20% Off Electronics',
      type: 'percentage',
      value: 20,
      status: 'active',
      used: 45,
      limit: 100,
      startDate: '2025-11-01',
      endDate: '2025-11-30',
      revenue: 2340.00,
    },
    {
      id: 2,
      name: 'Free Shipping',
      type: 'shipping',
      value: 0,
      status: 'active',
      used: 128,
      limit: 500,
      startDate: '2025-11-01',
      endDate: '2025-12-31',
      revenue: 5670.00,
    },
    {
      id: 3,
      name: 'Buy 2 Get 1 Free',
      type: 'quantity',
      value: 1,
      status: 'scheduled',
      used: 0,
      limit: 200,
      startDate: '2025-11-15',
      endDate: '2025-11-25',
      revenue: 0,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'green';
      case 'completed': return 'blue';
      case 'draft': return 'orange';
      case 'scheduled': return 'purple';
      default: return 'default';
    }
  };

  const campaignColumns = [
    {
      title: 'Campaign',
      key: 'campaign',
      render: (record: any) => (
        <div>
          <Text strong>{record.name}</Text>
          <br />
          <Tag color={record.type === 'email' ? 'blue' : 'green'}>
            {record.type.toUpperCase()}
          </Tag>
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{status.toUpperCase()}</Tag>
      ),
    },
    {
      title: 'Sent',
      dataIndex: 'sent',
      key: 'sent',
      render: (sent: number) => sent.toLocaleString(),
    },
    {
      title: 'Open Rate',
      key: 'openRate',
      render: (record: any) => {
        const rate = record.sent > 0 ? ((record.opened / record.sent) * 100).toFixed(1) : '0.0';
        return `${rate}%`;
      },
    },
    {
      title: 'Click Rate',
      key: 'clickRate',
      render: (record: any) => {
        const rate = record.opened > 0 ? ((record.clicked / record.opened) * 100).toFixed(1) : '0.0';
        return `${rate}%`;
      },
    },
    {
      title: 'Revenue',
      dataIndex: 'revenue',
      key: 'revenue',
      render: (revenue: number) => `$${revenue.toLocaleString()}`,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: any) => (
        <Space>
          <Button size="small">View</Button>
          <Button size="small">Edit</Button>
        </Space>
      ),
    },
  ];

  const promotionColumns = [
    {
      title: 'Promotion',
      dataIndex: 'name',
      key: 'name',
      render: (name: string) => <Text strong>{name}</Text>,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <Tag color="blue">{type.toUpperCase()}</Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{status.toUpperCase()}</Tag>
      ),
    },
    {
      title: 'Usage',
      key: 'usage',
      render: (record: any) => (
        <div>
          <Progress 
            percent={(record.used / record.limit) * 100} 
            size="small" 
            format={() => `${record.used}/${record.limit}`}
          />
        </div>
      ),
    },
    {
      title: 'Revenue',
      dataIndex: 'revenue',
      key: 'revenue',
      render: (revenue: number) => `$${revenue.toLocaleString()}`,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Space>
          <Button size="small">Edit</Button>
          <Button size="small">Duplicate</Button>
        </Space>
      ),
    },
  ];

  const handleCreateCampaign = async () => {
    try {
      const values = await form.validateFields();
      setCampaignModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('Campaign creation failed:', error);
    }
  };

  const handleCreatePromotion = async () => {
    try {
      const values = await form.validateFields();
      setPromotionModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('Promotion creation failed:', error);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={2}>
          <TrophyOutlined style={{ marginRight: 8 }} />
          Marketing Tools
        </Title>
        <Text type="secondary">Phase 5 - Advanced marketing automation and promotion management</Text>
      </div>

      {/* Marketing Stats */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={3}>
          <Card>
            <Statistic
              title="Total Campaigns"
              value={marketingStats.totalCampaigns}
              valueStyle={{ color: '#1890ff' }}
              prefix={<MailOutlined />}
            />
          </Card>
        </Col>
        <Col span={3}>
          <Card>
            <Statistic
              title="Active Campaigns"
              value={marketingStats.activeCampaigns}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={3}>
          <Card>
            <Statistic
              title="Emails Sent"
              value={marketingStats.emailsSent}
              valueStyle={{ color: '#722ed1' }}
              prefix={<SendOutlined />}
            />
          </Card>
        </Col>
        <Col span={3}>
          <Card>
            <Statistic
              title="Open Rate"
              value={marketingStats.openRate}
              suffix="%"
              valueStyle={{ color: '#fa8c16' }}
              prefix={<EyeOutlined />}
            />
          </Card>
        </Col>
        <Col span={3}>
          <Card>
            <Statistic
              title="Click Rate"
              value={marketingStats.clickRate}
              suffix="%"
              valueStyle={{ color: '#13c2c2' }}
              prefix={<SelectOutlined />}
            />
          </Card>
        </Col>
        <Col span={3}>
          <Card>
            <Statistic
              title="Conversions"
              value={marketingStats.conversions}
              valueStyle={{ color: '#eb2f96' }}
              prefix={<StarOutlined />}
            />
          </Card>
        </Col>
        <Col span={3}>
          <Card>
            <Statistic
              title="Revenue"
              value={marketingStats.revenue}
              precision={2}
              prefix="$"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      <Alert
        message="Marketing Performance"
        description="Your campaigns are performing well with a 24.5% open rate and 3.8% click rate, above industry average."
        type="success"
        showIcon
        style={{ marginBottom: 24 }}
        closable
      />

      <Tabs defaultActiveKey="campaigns">
        <TabPane tab="Email Campaigns" key="campaigns">
          <Card
            title="Email Marketing Campaigns"
            extra={
              <Button type="primary" icon={<MailOutlined />} onClick={() => setCampaignModalVisible(true)}>
                Create Campaign
              </Button>
            }
          >
            <Table
              columns={campaignColumns}
              dataSource={campaigns}
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </TabPane>

        <TabPane tab="Promotions" key="promotions">
          <Card
            title="Discount & Promotion Management"
            extra={
              <Button type="primary" icon={<PercentageOutlined />} onClick={() => setPromotionModalVisible(true)}>
                Create Promotion
              </Button>
            }
          >
            <Table
              columns={promotionColumns}
              dataSource={promotions}
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </TabPane>

        <TabPane tab="Push Notifications" key="notifications">
          <Card title="Push Notification Center">
            <Alert
              message="Push Notification Management"
              description="Send targeted push notifications to customers about new products, sales, and updates."
              type="info"
              style={{ marginBottom: 16 }}
            />
            <Button type="primary" icon={<BellOutlined />}>
              Create Notification
            </Button>
          </Card>
        </TabPane>

        <TabPane tab="Analytics" key="analytics">
          <Row gutter={16}>
            <Col span={12}>
              <Card title="Campaign Performance">
                <div style={{ textAlign: 'center', padding: 20 }}>
                  <Text type="secondary">Campaign analytics chart will be displayed here</Text>
                </div>
              </Card>
            </Col>
            <Col span={12}>
              <Card title="Promotion Effectiveness">
                <div style={{ textAlign: 'center', padding: 20 }}>
                  <Text type="secondary">Promotion performance metrics will be displayed here</Text>
                </div>
              </Card>
            </Col>
          </Row>
        </TabPane>
      </Tabs>

      {/* Campaign Creation Modal */}
      <Modal
        title="Create Email Campaign"
        visible={campaignModalVisible}
        onOk={handleCreateCampaign}
        onCancel={() => setCampaignModalVisible(false)}
        width={700}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Campaign Name" name="name" rules={[{ required: true }]}>
            <Input placeholder="Enter campaign name" />
          </Form.Item>
          
          <Form.Item label="Campaign Type" name="type" rules={[{ required: true }]}>
            <Select placeholder="Select campaign type">
              <Option value="email">Email Campaign</Option>
              <Option value="notification">Push Notification</Option>
              <Option value="sms">SMS Campaign</Option>
            </Select>
          </Form.Item>
          
          <Form.Item label="Target Audience" name="audience" rules={[{ required: true }]}>
            <Select placeholder="Select target audience">
              <Option value="all">All Customers</Option>
              <Option value="premium">Premium Customers</Option>
              <Option value="frequent">Frequent Buyers</Option>
              <Option value="inactive">Inactive Customers</Option>
            </Select>
          </Form.Item>
          
          <Form.Item label="Subject Line" name="subject" rules={[{ required: true }]}>
            <Input placeholder="Enter email subject" />
          </Form.Item>
          
          <Form.Item label="Message Content" name="content" rules={[{ required: true }]}>
            <TextArea rows={4} placeholder="Enter campaign message" />
          </Form.Item>
          
          <Form.Item label="Schedule" name="schedule">
            <RangePicker showTime style={{ width: '100%' }} />
          </Form.Item>
          
          <Form.Item name="autoSend" valuePropName="checked">
            <Switch /> <Text>Send immediately</Text>
          </Form.Item>
        </Form>
      </Modal>

      {/* Promotion Creation Modal */}
      <Modal
        title="Create Promotion"
        visible={promotionModalVisible}
        onOk={handleCreatePromotion}
        onCancel={() => setPromotionModalVisible(false)}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Promotion Name" name="name" rules={[{ required: true }]}>
            <Input placeholder="Enter promotion name" />
          </Form.Item>
          
          <Form.Item label="Promotion Type" name="type" rules={[{ required: true }]}>
            <Select placeholder="Select promotion type">
              <Option value="percentage">Percentage Discount</Option>
              <Option value="fixed">Fixed Amount Discount</Option>
              <Option value="shipping">Free Shipping</Option>
              <Option value="quantity">Buy X Get Y</Option>
            </Select>
          </Form.Item>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Discount Value" name="value" rules={[{ required: true }]}>
                <Input placeholder="Enter discount value" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Usage Limit" name="limit" rules={[{ required: true }]}>
                <Input placeholder="Enter usage limit" />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item label="Valid Period" name="period" rules={[{ required: true }]}>
            <RangePicker style={{ width: '100%' }} />
          </Form.Item>
          
          <Form.Item label="Minimum Order Amount" name="minOrder">
            <Input placeholder="Enter minimum order amount (optional)" />
          </Form.Item>
          
          <Form.Item label="Applicable Products" name="products">
            <Select mode="multiple" placeholder="Select products (leave empty for all)">
              <Option value="all">All Products</Option>
              <Option value="electronics">Electronics</Option>
              <Option value="accessories">Accessories</Option>
            </Select>
          </Form.Item>
          
          <Form.Item name="autoApply" valuePropName="checked">
            <Switch /> <Text>Auto-apply at checkout</Text>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default VendorMarketingTools;
