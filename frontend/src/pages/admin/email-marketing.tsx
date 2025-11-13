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
  Modal,
  Spin,
  Statistic,
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
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  EyeOutlined,
  CopyOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { emailAPI } from '@/services/api/email';
import type { EmailTemplate, EmailCampaign, EmailStats } from '@/services/api/email';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const EmailMarketingPage: React.FC = () => {
  const [form] = Form.useForm();
  const [templateForm] = Form.useForm();
  
  // State
  const [loading, setLoading] = useState(false);
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([]);
  const [stats, setStats] = useState<EmailStats | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [isTemplateModalVisible, setIsTemplateModalVisible] = useState(false);
  const [isPreviewModalVisible, setIsPreviewModalVisible] = useState(false);
  const [previewHtml, setPreviewHtml] = useState('');

  // Fetch data on mount
  useEffect(() => {
    fetchTemplates();
    fetchCampaigns();
    fetchStats();
  }, []);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const data = await emailAPI.getTemplates();
      setTemplates(data);
    } catch (error) {
      message.error('Failed to fetch email templates');
    } finally {
      setLoading(false);
    }
  };

  const fetchCampaigns = async () => {
    try {
      const data = await emailAPI.getCampaigns();
      setCampaigns(data);
    } catch (error) {
      message.error('Failed to fetch campaigns');
    }
  };

  const fetchStats = async () => {
    try {
      const data = await emailAPI.getStats();
      setStats(data);
    } catch (error) {
      message.error('Failed to fetch statistics');
    }
  };

  // Template handlers
  const handleCreateTemplate = () => {
    setSelectedTemplate(null);
    templateForm.resetFields();
    setIsTemplateModalVisible(true);
  };

  const handleEditTemplate = (template: EmailTemplate) => {
    setSelectedTemplate(template);
    templateForm.setFieldsValue(template);
    setIsTemplateModalVisible(true);
  };

  const handleTemplateSubmit = async (values: any) => {
    try {
      setLoading(true);
      if (selectedTemplate) {
        await emailAPI.updateTemplate(selectedTemplate.id, values);
        message.success('Template updated successfully');
      } else {
        await emailAPI.createTemplate(values);
        message.success('Template created successfully');
      }
      setIsTemplateModalVisible(false);
      fetchTemplates();
      fetchStats();
    } catch (error) {
      message.error('Failed to save template');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTemplate = async (id: string) => {
    Modal.confirm({
      title: 'Delete Template',
      content: 'Are you sure you want to delete this template?',
      okText: 'Delete',
      okType: 'danger',
      onOk: async () => {
        try {
          await emailAPI.deleteTemplate(id);
          message.success('Template deleted successfully');
          fetchTemplates();
          fetchStats();
        } catch (error) {
          message.error('Failed to delete template');
        }
      },
    });
  };

  const handleDuplicateTemplate = async (id: string, name: string) => {
    try {
      await emailAPI.duplicateTemplate(id, `${name} (Copy)`);
      message.success('Template duplicated successfully');
      fetchTemplates();
    } catch (error) {
      message.error('Failed to duplicate template');
    }
  };

  const handlePreviewTemplate = async (id: string) => {
    try {
      setLoading(true);
      const preview = await emailAPI.previewTemplate(id);
      setPreviewHtml(preview.html);
      setIsPreviewModalVisible(true);
    } catch (error) {
      message.error('Failed to generate preview');
    } finally {
      setLoading(false);
    }
  };

  const handleSendTestEmail = async (templateId: string) => {
    const email = prompt('Enter email address for test:');
    if (!email) return;
    
    try {
      await emailAPI.sendTestEmail({ templateId, recipientEmail: email });
      message.success(`Test email sent to ${email}`);
    } catch (error) {
      message.error('Failed to send test email');
    }
  };

  // Campaign handlers
  const handleSendCampaign = async (values: any) => {
    try {
      setLoading(true);
      await emailAPI.createCampaign(values);
      message.success('Email campaign scheduled successfully!');
      form.resetFields();
      fetchCampaigns();
    } catch (error) {
      message.error('Failed to schedule campaign');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCampaign = async (id: string) => {
    Modal.confirm({
      title: 'Delete Campaign',
      content: 'Are you sure you want to delete this campaign?',
      okText: 'Delete',
      okType: 'danger',
      onOk: async () => {
        try {
          await emailAPI.deleteCampaign(id);
          message.success('Campaign deleted successfully');
          fetchCampaigns();
        } catch (error) {
          message.error('Failed to delete campaign');
        }
      },
    });
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
      render: (category) => {
        const colorMap: Record<string, string> = {
          onboarding: 'blue',
          transactional: 'green',
          marketing: 'orange',
          newsletter: 'purple',
          notification: 'cyan',
        };
        return <Tag color={colorMap[category] || 'default'}>{category?.toUpperCase()}</Tag>;
      },
      filters: [
        { text: 'Onboarding', value: 'onboarding' },
        { text: 'Transactional', value: 'transactional' },
        { text: 'Marketing', value: 'marketing' },
        { text: 'Newsletter', value: 'newsletter' },
        { text: 'Notification', value: 'notification' },
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
          <Button
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handlePreviewTemplate(record.id)}
          >
            Preview
          </Button>
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEditTemplate(record)}
          >
            Edit
          </Button>
          <Button
            size="small"
            icon={<CopyOutlined />}
            onClick={() => handleDuplicateTemplate(record.id, record.name)}
          >
            Duplicate
          </Button>
          <Button
            size="small"
            icon={<SendOutlined />}
            onClick={() => handleSendTestEmail(record.id)}
          >
            Test
          </Button>
          <Button
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteTemplate(record.id)}
          >
            Delete
          </Button>
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
          paused: 'yellow',
          cancelled: 'red',
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
    <>
    <Spin spinning={loading} tip="Loading email data...">
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Title level={3}>
            <MailOutlined style={{ color: '#1890ff' }} /> Email Marketing
          </Title>
          <Paragraph type="secondary">
            Create and send email campaigns, manage templates, and track performance
          </Paragraph>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleCreateTemplate}
          size="large"
        >
          Create Template
        </Button>
      </div>

      {/* Statistics Cards */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Templates"
              value={stats?.totalTemplates || 0}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Active Templates"
              value={stats?.activeTemplates || 0}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Avg Open Rate"
              value={stats?.averageOpenRate || 0}
              precision={1}
              suffix="%"
              prefix={<MailOutlined />}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Avg Click Rate"
              value={stats?.averageClickRate || 0}
              precision={1}
              suffix="%"
              prefix={<SendOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

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
                name="templateId"
                rules={[{ required: true, message: 'Please select a template' }]}
              >
                <Select
                  placeholder="Choose email template"
                  value={selectedTemplate?.id}
                  onChange={(value) => {
                    const template = templates.find(t => t.id === value);
                    setSelectedTemplate(template || null);
                  }}
                  allowClear
                  options={templates.map(t => ({
                    label: `${t.name} - ${t.category}`,
                    value: t.id
                  }))}
                />
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

              <Form.Item label="Recipient List" name="recipientType" rules={[{ required: true }]}>
                <Select
                  placeholder="Select recipient list"
                  options={[
                    { label: 'All Subscribers', value: 'all' },
                    { label: 'All Customers', value: 'customers' },
                    { label: 'Newsletter Subscribers', value: 'subscribers' },
                    { label: 'Custom Segment', value: 'segment' },
                  ]}
                />
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
              dataSource={templates}
              rowKey="id"
              pagination={{ pageSize: 5 }}
              size="small"
              loading={loading}
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
          dataSource={campaigns}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          loading={loading}
        />
      </Card>
    </div>
    </Spin>

    {/* Template Create/Edit Modal */}
    <Modal
      title={selectedTemplate ? 'Edit Template' : 'Create Email Template'}
      open={isTemplateModalVisible}
      onCancel={() => {
        setIsTemplateModalVisible(false);
        setSelectedTemplate(null);
        templateForm.resetFields();
      }}
      onOk={() => templateForm.submit()}
      width={800}
    >
      <Form
        form={templateForm}
        layout="vertical"
        onFinish={handleTemplateSubmit}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Template Name"
              name="name"
              rules={[{ required: true, message: 'Please enter template name' }]}
            >
              <Input placeholder="e.g., Welcome Email" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Category"
              name="category"
              rules={[{ required: true, message: 'Please select category' }]}
            >
              <Select
                placeholder="Select category"
                options={[
                  { label: 'Onboarding', value: 'onboarding' },
                  { label: 'Transactional', value: 'transactional' },
                  { label: 'Marketing', value: 'marketing' },
                  { label: 'Newsletter', value: 'newsletter' },
                  { label: 'Notification', value: 'notification' },
                ]}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label="Subject Line"
          name="subject"
          rules={[{ required: true, message: 'Please enter subject' }]}
        >
          <Input placeholder="e.g., Welcome to Our Store!" />
        </Form.Item>

        <Form.Item
          label="Preview Text"
          name="previewText"
        >
          <Input placeholder="Text shown in email preview" />
        </Form.Item>

        <Form.Item
          label="Email Body (HTML)"
          name="body"
          rules={[{ required: true, message: 'Please enter email body' }]}
        >
          <TextArea
            rows={10}
            placeholder="Enter HTML email template. Use variables like {{name}}, {{order_id}}, etc."
          />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="From Name"
              name="fromName"
            >
              <Input placeholder="e.g., Groow Store" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="From Email"
              name="fromEmail"
            >
              <Input placeholder="e.g., noreply@groow.com" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label="Reply To"
          name="replyTo"
        >
          <Input placeholder="e.g., support@groow.com" />
        </Form.Item>

        <Form.Item
          label="Status"
          name="status"
          valuePropName="checked"
        >
          <Switch checkedChildren="Active" unCheckedChildren="Draft" />
        </Form.Item>
      </Form>
    </Modal>

    {/* Preview Modal */}
    <Modal
      title="Email Preview"
      open={isPreviewModalVisible}
      onCancel={() => setIsPreviewModalVisible(false)}
      footer={[
        <Button key="close" onClick={() => setIsPreviewModalVisible(false)}>
          Close
        </Button>
      ]}
      width={800}
    >
      <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
    </Modal>
    </>
  );
};

export default EmailMarketingPage;
