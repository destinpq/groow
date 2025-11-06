import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Tag,
  Button,
  Space,
  Input,
  Modal,
  Form,
  message,
  Typography,
  Switch,
  Spin,
} from 'antd';
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { cmsAPI, CMSPage } from '@/services/api';

const { Title, Text } = Typography;

const AdminPagesPage: React.FC = () => {
  const [pages, setPages] = useState<CMSPage[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingPage, setEditingPage] = useState<CMSPage | null>(null);
  const [searchText, setSearchText] = useState('');
  const [form] = Form.useForm();
  const [content, setContent] = useState('');

  // Load pages on mount
  useEffect(() => {
    loadPages();
  }, []);

  const loadPages = async () => {
    try {
      setLoading(true);
      const response = await cmsAPI.pages.getAll({ search: searchText });
      setPages(response.data);
    } catch (error) {
      message.error('Failed to load pages');
      console.error('Load pages error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
    loadPages();
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      published: 'success',
      draft: 'warning',
      archived: 'default',
    };
    return colors[status] || 'default';
  };

  const handleAddPage = () => {
    setEditingPage(null);
    form.resetFields();
    setContent('');
    setModalVisible(true);
  };

  const handleEditPage = (page: CMSPage) => {
    setEditingPage(page);
    form.setFieldsValue(page);
    setContent(page.content);
    setModalVisible(true);
  };

  const handleDeletePage = async (id: number) => {
    Modal.confirm({
      title: 'Delete Page',
      content: 'Are you sure you want to delete this page?',
      okText: 'Delete',
      okType: 'danger',
      onOk: async () => {
        try {
          await cmsAPI.pages.delete(id);
          message.success('Page deleted successfully');
          loadPages();
        } catch (error) {
          message.error('Failed to delete page');
          console.error('Delete page error:', error);
        }
      },
    });
  };

  const handleToggleStatus = async (id: number, currentStatus: string) => {
    try {
      if (currentStatus === 'published') {
        await cmsAPI.pages.unpublish(id);
        message.success('Page unpublished successfully');
      } else {
        await cmsAPI.pages.publish(id);
        message.success('Page published successfully');
      }
      loadPages();
    } catch (error) {
      message.error('Failed to update page status');
      console.error('Toggle status error:', error);
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      const pageData = {
        ...values,
        content,
      };

      if (editingPage) {
        await cmsAPI.pages.update(editingPage.id, pageData);
        message.success('Page updated successfully');
      } else {
        await cmsAPI.pages.create(pageData);
        message.success('Page created successfully');
      }

      setModalVisible(false);
      form.resetFields();
      setContent('');
      loadPages();
    } catch (error) {
      message.error(`Failed to ${editingPage ? 'update' : 'create'} page`);
      console.error('Submit page error:', error);
    }
  };

  const columns: ColumnsType<CMSPage> = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (text: string, record) => (
        <Space>
          <FileTextOutlined style={{ fontSize: 18, color: '#1890ff' }} />
          <div>
            <Text strong>{text}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: 12 }}>
              /{record.slug}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string, record) => (
        <Space>
          <Tag color={getStatusColor(status)}>{status.toUpperCase()}</Tag>
          <Switch
            checked={status === 'published'}
            onChange={() => handleToggleStatus(record.id, status)}
            checkedChildren="Published"
            unCheckedChildren="Draft"
          />
        </Space>
      ),
      filters: [
        { text: 'Published', value: 'published' },
        { text: 'Draft', value: 'draft' },
        { text: 'Archived', value: 'archived' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString(),
      sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
    {
      title: 'Last Updated',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (date: string) => new Date(date).toLocaleDateString(),
      sorter: (a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEditPage(record)}>
            Edit
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeletePage(record.id)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ align: [] }],
      ['link', 'image'],
      [{ color: [] }, { background: [] }],
      ['clean'],
    ],
  };

  return (
    <Spin spinning={loading}>
      <div style={{ padding: 24 }}>
        <Card
          title={<Title level={3}>Page Management</Title>}
          extra={
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAddPage}>
              Create Page
            </Button>
          }
        >
          {/* Search */}
          <Input.Search
            placeholder="Search pages..."
            prefix={<SearchOutlined />}
            size="large"
            style={{ marginBottom: 16, maxWidth: 400 }}
            onSearch={handleSearch}
            allowClear
          />

        {/* Pages Table */}
        <Table
          columns={columns}
          dataSource={pages}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} pages`,
          }}
        />
      </Card>

      {/* Add/Edit Page Modal */}
      <Modal
        title={editingPage ? 'Edit Page' : 'Create New Page'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={900}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="title"
            label="Page Title"
            rules={[{ required: true, message: 'Please enter page title' }]}
          >
            <Input placeholder="e.g., About Us" />
          </Form.Item>

          <Form.Item
            name="slug"
            label="URL Slug"
            rules={[
              { required: true, message: 'Please enter URL slug' },
              {
                pattern: /^[a-z0-9-]+$/,
                message: 'Slug must contain only lowercase letters, numbers, and hyphens',
              },
            ]}
          >
            <Input placeholder="e.g., about-us" addonBefore="/" />
          </Form.Item>

          <Form.Item label="Page Content" required>
            <ReactQuill
              value={content}
              onChange={setContent}
              modules={modules}
              theme="snow"
              style={{ height: 300, marginBottom: 50 }}
            />
          </Form.Item>

          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: 'Please select status' }]}
            initialValue="draft"
          >
            <Space>
              <Switch
                checkedChildren="Published"
                unCheckedChildren="Draft"
                onChange={(checked) => form.setFieldsValue({ status: checked ? 'published' : 'draft' })}
                checked={form.getFieldValue('status') === 'published'}
              />
            </Space>
          </Form.Item>

          <Form.Item>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => setModalVisible(false)}>Cancel</Button>
              <Button type="primary" htmlType="submit">
                {editingPage ? 'Update' : 'Create'} Page
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
      </div>
    </Spin>
  );
};

export default AdminPagesPage;
