import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Form,
  Input,
  Button,
  Table,
  Tag,
  Space,
  Select,
  Upload,
  message,
  Divider,
  Switch,
  InputNumber,
  Alert,
} from 'antd';
import {
  MailOutlined,
  SendOutlined,
  UserOutlined,
  TeamOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  UploadOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface EmailTemplate {
  id: number;
  name: string;
  subject: string;
  category: string;
  status: 'active' | 'draft';
}

interface EmailCampaign {
  id: number;
  name: string;
  subject: string;
  recipients: number;
  sent: number;
  opened: number;
  clicked: number;
  status: 'draft' | 'scheduled' | 'sending' | 'sent';
  scheduledAt: string;
}

const emailTemplates: EmailTemplate[] = [
  { id: 1, name: 'Welcome Email', subject: 'Welcome to Our Store!', category: 'Onboarding', status: 'active' },
  { id: 2, name: 'Order Confirmation', subject: 'Your Order #{{order_id}}', category: 'Transactional', status: 'active' },
  { id: 3, name: 'Shipping Notification', subject: 'Your Order Has Shipped!', category: 'Transactional', status: 'active' },
  { id: 4, name: 'Abandoned Cart', subject: 'You Left Items in Your Cart', category: 'Marketing', status: 'active' },
  { id: 5, name: 'Weekly Newsletter', subject: 'Weekly Deals & Updates', category: 'Newsletter', status: 'draft' },
];

const emailCampaigns: EmailCampaign[] = [
  {
    id: 1,
    name: 'Summer Sale 2024',
    subject: '🔥 Summer Sale: Up to 70% Off!',
    recipients: 15420,
    sent: 15420,
    opened: 8234,
    clicked: 2156,
    status: 'sent',
    scheduledAt: dayjs().subtract(3, 'days').format('YYYY-MM-DD HH:mm'),
  },
  {
    id: 2,
    name: 'New Product Launch',
    subject: 'Introducing Our Latest Collection',
    recipients: 12890,
    sent: 12890,
    opened: 6445,
    clicked: 1544,
    status: 'sent',
    scheduledAt: dayjs().subtract(1, 'week').format('YYYY-MM-DD HH:mm'),
  },
  {
    id: 3,
    name: 'Weekend Flash Sale',
    subject: '⚡ 48-Hour Flash Sale Starts Now!',
    recipients: 8500,
    sent: 0,
    opened: 0,
    clicked: 0,
    status: 'scheduled',
    scheduledAt: dayjs().add(2, 'days').format('YYYY-MM-DD HH:mm'),
  },
];

const EmailMarketingPage: React.FC = () => {
  const [form] = Form.useForm();
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');

  const handleSendCampaign = () => {
    message.success('Email campaign scheduled successfully!');
    form.resetFields();
  };

  const templateColumns: ColumnsType<EmailTemplate> = [
    {
      title: 'Template Name',
      dataIndex: 'name',
      key: 'name',
      render: (name) => <Text strong>{name}</Text>,
    },
    {
      title: 'Subject',
      dataIndex: 'subject',
      key: 'subject',
      render: (subject) => <Text code>{subject}</Text>,
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (category) => <Tag color="blue">{category}</Tag>,
      filters: [
        { text: 'Onboarding', value: 'Onboarding' },
        { text: 'Transactional', value: 'Transactional' },
        { text: 'Marketing', value: 'Marketing' },
        { text: 'Newsletter', value: 'Newsletter' },
      ],
      onFilter: (value, record) => record.category === value,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: EmailTemplate['status']) => (
        <Tag color={status === 'active' ? 'green' : 'orange'}>
          {status === 'active' ? <CheckCircleOutlined /> : <ClockCircleOutlined />} {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button size="small" onClick={() => setSelectedTemplate(record.name)}>
            Use Template
          </Button>
          <Button size="small">Edit</Button>
        </Space>
      ),
    },
  ];

  const campaignColumns: ColumnsType<EmailCampaign> = [
    {
      title: 'Campaign',
      dataIndex: 'name',
      key: 'name',
      render: (name) => <Text strong>{name}</Text>,
    },
    {
      title: 'Subject',
      dataIndex: 'subject',
      key: 'subject',
    },
    {
      title: 'Recipients',
      dataIndex: 'recipients',
      key: 'recipients',
      render: (count) => (
        <Space>
          <TeamOutlined />
          <Text>{count.toLocaleString()}</Text>
        </Space>
      ),
    },
    {
      title: 'Open Rate',
      key: 'openRate',
      render: (_, record) => {
        const rate = record.sent > 0 ? ((record.opened / record.sent) * 100).toFixed(1) : '0.0';
        return <Tag color="blue">{rate}%</Tag>;
      },
      sorter: (a, b) => (a.opened / (a.sent || 1)) - (b.opened / (b.sent || 1)),
    },
    {
      title: 'Click Rate',
      key: 'clickRate',
      render: (_, record) => {
        const rate = record.sent > 0 ? ((record.clicked / record.sent) * 100).toFixed(1) : '0.0';
        return <Tag color="green">{rate}%</Tag>;
      },
      sorter: (a, b) => (a.clicked / (a.sent || 1)) - (b.clicked / (b.sent || 1)),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: EmailCampaign['status']) => {
        const colors: Record<EmailCampaign['status'], string> = {
          draft: 'orange',
          scheduled: 'blue',
          sending: 'purple',
          sent: 'green',
        };
        return <Tag color={colors[status]}>{status.toUpperCase()}</Tag>;
      },
      filters: [
        { text: 'Draft', value: 'draft' },
        { text: 'Scheduled', value: 'scheduled' },
        { text: 'Sending', value: 'sending' },
        { text: 'Sent', value: 'sent' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Scheduled',
      dataIndex: 'scheduledAt',
      key: 'scheduledAt',
      render: (date) => <Text type="secondary">{date}</Text>,
    },
  ];

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={3}>
          <MailOutlined style={{ color: '#1890ff' }} /> Email Marketing
        </Title>
        <Paragraph type="secondary">
          Create and send email campaigns, manage templates, and track performance
        </Paragraph>
      </div>

      <Alert
        message="Email Service Connected"
        description="SMTP configured and ready. You can send up to 10,000 emails per month on your current plan."
        type="success"
        showIcon
        closable
        style={{ marginBottom: 24 }}
      />

      <Row gutter={16}>
        <Col xs={24} lg={12}>
          <Card title="Create Email Campaign" style={{ marginBottom: 16 }}>
            <Form form={form} layout="vertical" onFinish={handleSendCampaign}>
              <Form.Item
                label="Campaign Name"
                name="name"
                rules={[{ required: true, message: 'Please enter campaign name' }]}
              >
                <Input placeholder="e.g., Summer Sale 2024" prefix={<FileTextOutlined />} />
              </Form.Item>

              <Form.Item
                label="Email Template"
                name="template"
                help="Choose from existing templates or create custom email"
              >
                <Select
                  placeholder="Select a template"
                  value={selectedTemplate}
                  onChange={setSelectedTemplate}
                  allowClear
                >
                  {emailTemplates.map((t) => (
                    <Option key={t.id} value={t.name}>
                      {t.name} - {t.category}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label="Subject Line"
                name="subject"
                rules={[{ required: true, message: 'Please enter subject' }]}
                help="Keep it under 50 characters for better open rates"
              >
                <Input placeholder="Enter email subject" showCount maxLength={50} />
              </Form.Item>

              <Form.Item label="Email Content" name="content" rules={[{ required: true }]}>
                <TextArea
                  rows={8}
                  placeholder="Enter your email content here. You can use variables like {{name}}, {{order_id}}, etc."
                />
              </Form.Item>

              <Form.Item label="Recipient List" name="recipients" rules={[{ required: true }]}>
                <Select placeholder="Select recipient list">
                  <Option value="all">All Subscribers (15,420)</Option>
                  <Option value="customers">All Customers (12,890)</Option>
                  <Option value="newsletter">Newsletter Subscribers (8,500)</Option>
                  <Option value="vip">VIP Customers (1,245)</Option>
                  <Option value="inactive">Inactive Customers (3,450)</Option>
                </Select>
              </Form.Item>

              <Form.Item label="Attachments" name="attachments">
                <Upload>
                  <Button icon={<UploadOutlined />}>Upload Attachments</Button>
                </Upload>
              </Form.Item>

              <Divider />

              <Form.Item label="Schedule Options">
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Form.Item name="sendNow" valuePropName="checked" noStyle>
                    <Switch /> <Text style={{ marginLeft: 8 }}>Send Immediately</Text>
                  </Form.Item>
                  <Form.Item name="scheduledDate" label="Or Schedule for Later">
                    <Input type="datetime-local" style={{ width: '100%' }} />
                  </Form.Item>
                </Space>
              </Form.Item>

              <Form.Item>
                <Space>
                  <Button type="primary" htmlType="submit" icon={<SendOutlined />} size="large">
                    Send Campaign
                  </Button>
                  <Button>Save as Draft</Button>
                  <Button>Preview</Button>
                </Space>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="Email Templates" style={{ marginBottom: 16 }}>
            <Table
              columns={templateColumns}
              dataSource={emailTemplates}
              rowKey="id"
              pagination={{ pageSize: 5 }}
              size="small"
            />
          </Card>

          <Card title="Email Settings">
            <Form layout="vertical">
              <Form.Item label="From Name">
                <Input placeholder="Your Store Name" defaultValue="Groow Store" />
              </Form.Item>
              <Form.Item label="From Email">
                <Input placeholder="noreply@yourstore.com" defaultValue="noreply@groow.com" />
              </Form.Item>
              <Form.Item label="Reply-To Email">
                <Input placeholder="support@yourstore.com" defaultValue="support@groow.com" />
              </Form.Item>
              <Form.Item label="Footer Text">
                <TextArea
                  rows={3}
                  placeholder="Add footer text (address, unsubscribe link, etc.)"
                  defaultValue="© 2024 Groow Store. All rights reserved."
                />
              </Form.Item>
              <Form.Item>
                <Button type="primary">Save Settings</Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>

      <Card title="Campaign History" style={{ marginTop: 16 }}>
        <Table
          columns={campaignColumns}
          dataSource={emailCampaigns}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
};

export default EmailMarketingPage;
