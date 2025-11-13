import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Select,
  message,
  Tag,
  Switch,
  Row,
  Col,
  Divider,
  Typography,
  Spin,
  Tooltip,
  Badge,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  CopyOutlined,
  SendOutlined,
  MailOutlined,
} from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { emailTemplatesAPI } from '@/services/api';

const { TextArea } = Input;
const { Option } = Select;
const { Title, Text } = Typography;

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  type: 'order_confirmation' | 'welcome' | 'password_reset' | 'promotional' | 'notification';
  content: string;
  variables: string[];
  isActive: boolean;
  lastUsed?: string;
  usageCount: number;
  createdAt: string;
  updatedAt: string;
}

const EmailTemplatesPage: React.FC = () => {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<EmailTemplate | null>(null);
  const [form] = Form.useForm();

  const templateTypes = [
    { value: 'order_confirmation', label: 'Order Confirmation', color: 'blue' },
    { value: 'welcome', label: 'Welcome Email', color: 'green' },
    { value: 'password_reset', label: 'Password Reset', color: 'orange' },
    { value: 'promotional', label: 'Promotional', color: 'purple' },
    { value: 'notification', label: 'Notification', color: 'cyan' },
  ];

  const availableVariables = [
    '{{customer_name}}',
    '{{order_number}}',
    '{{order_total}}',
    '{{product_name}}',
    '{{company_name}}',
    '{{support_email}}',
    '{{website_url}}',
    '{{reset_link}}',
    '{{verification_code}}',
  ];

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const response = await emailTemplatesAPI.getAll();
      setTemplates(Array.isArray(response?.data?.data) ? response.data.data : (Array.isArray(response?.data) ? response.data : []));
    } catch (error) {
      message.error('Failed to fetch email templates');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingTemplate(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (template: EmailTemplate) => {
    setEditingTemplate(template);
    form.setFieldsValue({
      name: template.name,
      subject: template.subject,
      type: template.type,
      content: template.content,
      isActive: template.isActive,
    });
    setModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    Modal.confirm({
      title: 'Delete Email Template',
      content: 'Are you sure you want to delete this email template?',
      okText: 'Delete',
      okType: 'danger',
      onOk: async () => {
        try {
          await emailTemplatesAPI.delete(id);
          message.success('Email template deleted successfully');
          fetchTemplates();
        } catch (error) {
          message.error('Failed to delete email template');
        }
      },
    });
  };

  const handleSubmit = async (values: any) => {
    try {
      if (editingTemplate) {
        await emailTemplatesAPI.update(editingTemplate.id, values);
        message.success('Email template updated successfully');
      } else {
        await emailTemplatesAPI.create(values);
        message.success('Email template created successfully');
      }
      setModalVisible(false);
      fetchTemplates();
    } catch (error) {
      message.error('Failed to save email template');
    }
  };

  const handleToggleStatus = async (id: string, isActive: boolean) => {
    try {
      await emailTemplatesAPI.toggleStatus(id, isActive);
      message.success(`Template ${isActive ? 'activated' : 'deactivated'} successfully`);
      fetchTemplates();
    } catch (error) {
      message.error('Failed to update template status');
    }
  };

  const handlePreview = (template: EmailTemplate) => {
    setPreviewTemplate(template);
    setPreviewVisible(true);
  };

  const handleDuplicate = async (template: EmailTemplate) => {
    try {
      const duplicateData = {
        ...template,
        name: `${template.name} (Copy)`,
        isActive: false,
      };
      delete duplicateData.id;
      delete duplicateData.createdAt;
      delete duplicateData.updatedAt;
      delete duplicateData.lastUsed;
      delete duplicateData.usageCount;

      await emailTemplatesAPI.create(duplicateData);
      message.success('Email template duplicated successfully');
      fetchTemplates();
    } catch (error) {
      message.error('Failed to duplicate email template');
    }
  };

  const columns = [
    {
      title: 'Template Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: EmailTemplate) => (
        <Space direction="vertical" size={0}>
          <Text strong>{text}</Text>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {record.subject}
          </Text>
        </Space>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        const typeConfig = templateTypes.find(t => t.value === type);
        return (
          <Tag color={typeConfig?.color}>
            {typeConfig?.label}
          </Tag>
        );
      },
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean, record: EmailTemplate) => (
        <Switch
          checked={isActive}
          onChange={(checked) => handleToggleStatus(record.id, checked)}
          checkedChildren="Active"
          unCheckedChildren="Inactive"
        />
      ),
    },
    {
      title: 'Usage',
      dataIndex: 'usageCount',
      key: 'usageCount',
      render: (count: number, record: EmailTemplate) => (
        <Space direction="vertical" size={0}>
          <Badge count={count} style={{ backgroundColor: '#52c41a' }} />
          {record.lastUsed && (
            <Text type="secondary" style={{ fontSize: '12px' }}>
              Last used: {new Date(record.lastUsed).toLocaleDateString()}
            </Text>
          )}
        </Space>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record: EmailTemplate) => (
        <Space>
          <Tooltip title="Preview">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => handlePreview(record)}
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Tooltip title="Duplicate">
            <Button
              type="text"
              icon={<CopyOutlined />}
              onClick={() => handleDuplicate(record)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record.id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer
      header={{
        title: 'Email Templates',
        breadcrumb: {
          items: [
            { title: 'Admin' },
            { title: 'Email Templates' },
          ],
        },
      }}
    >
      <Card>
        <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
          <Col>
            <Space>
              <MailOutlined style={{ fontSize: 20, color: '#1890ff' }} />
              <Title level={4} style={{ margin: 0 }}>
                Email Templates Management
              </Title>
            </Space>
          </Col>
          <Col>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleCreate}
            >
              Create Template
            </Button>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={templates}
          rowKey="id"
          loading={loading}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `Total ${total} templates`,
          }}
        />
      </Card>

      {/* Create/Edit Modal */}
      <Modal
        title={editingTemplate ? 'Edit Email Template' : 'Create Email Template'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Template Name"
                rules={[{ required: true, message: 'Please input template name' }]}
              >
                <Input placeholder="Enter template name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="type"
                label="Template Type"
                rules={[{ required: true, message: 'Please select template type' }]}
              >
                <Select placeholder="Select template type">
                  {templateTypes.map(type => (
                    <Option key={type.value} value={type.value}>
                      {type.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="subject"
            label="Email Subject"
            rules={[{ required: true, message: 'Please input email subject' }]}
          >
            <Input placeholder="Enter email subject" />
          </Form.Item>

          <Form.Item
            name="content"
            label="Email Content"
            rules={[{ required: true, message: 'Please input email content' }]}
          >
            <TextArea
              rows={10}
              placeholder="Enter email content with variables like {{customer_name}}"
            />
          </Form.Item>

          <Form.Item name="isActive" valuePropName="checked">
            <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
            <span style={{ marginLeft: 8 }}>Template Status</span>
          </Form.Item>

          <Divider>Available Variables</Divider>
          <Space wrap>
            {availableVariables.map(variable => (
              <Tag
                key={variable}
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  const content = form.getFieldValue('content') || '';
                  form.setFieldsValue({
                    content: content + ' ' + variable
                  });
                }}
              >
                {variable}
              </Tag>
            ))}
          </Space>

          <div style={{ marginTop: 24, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setModalVisible(false)}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                {editingTemplate ? 'Update' : 'Create'} Template
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>

      {/* Preview Modal */}
      <Modal
        title="Email Template Preview"
        open={previewVisible}
        onCancel={() => setPreviewVisible(false)}
        footer={[
          <Button key="close" onClick={() => setPreviewVisible(false)}>
            Close
          </Button>,
          <Button
            key="send"
            type="primary"
            icon={<SendOutlined />}
            onClick={() => {
              message.info('Test email functionality would be implemented here');
            }}
          >
            Send Test Email
          </Button>,
        ]}
        width={700}
      >
        {previewTemplate && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <Text strong>Subject: </Text>
              <Text>{previewTemplate.subject}</Text>
            </div>
            <Divider />
            <div
              style={{
                padding: 16,
                border: '1px solid #d9d9d9',
                borderRadius: 4,
                backgroundColor: '#fafafa',
                whiteSpace: 'pre-wrap',
              }}
            >
              {previewTemplate.content}
            </div>
          </div>
        )}
      </Modal>
    </PageContainer>
  );
};

export default EmailTemplatesPage;