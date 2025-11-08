import React, { useState } from 'react';
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

const { Title, Text } = Typography;

interface Page {
  id: number;
  title: string;
  slug: string;
  status: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

const mockPages: Page[] = [
  {
    id: 1,
    title: 'About Us',
    slug: 'about-us',
    status: 'published',
    content: '<h2>About Our Company</h2><p>We are a leading e-commerce platform...</p>',
    createdAt: '2024-01-15',
    updatedAt: '2024-10-20',
  },
  {
    id: 2,
    title: 'Terms and Conditions',
    slug: 'terms',
    status: 'published',
    content: '<h2>Terms of Service</h2><p>By using our platform...</p>',
    createdAt: '2024-01-15',
    updatedAt: '2024-09-10',
  },
  {
    id: 3,
    title: 'Return Policy',
    slug: 'return-policy',
    status: 'draft',
    content: '<h2>Return & Refund Policy</h2><p>We offer 30-day returns...</p>',
    createdAt: '2024-10-01',
    updatedAt: '2024-10-25',
  },
];

const AdminPagesPage: React.FC = () => {
  const [pages, setPages] = useState<Page[]>(mockPages);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingPage, setEditingPage] = useState<Page | null>(null);
  const [form] = Form.useForm();
  const [content, setContent] = useState('');

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

  const handleEditPage = (page: Page) => {
    setEditingPage(page);
    form.setFieldsValue(page);
    setContent(page.content);
    setModalVisible(true);
  };

  const handleDeletePage = (id: number) => {
    Modal.confirm({
      title: 'Delete Page',
      content: 'Are you sure you want to delete this page?',
      okText: 'Delete',
      okType: 'danger',
      onOk: () => {
        setPages(pages.filter((p) => p.id !== id));
        message.success('Page deleted successfully');
      },
    });
  };

  const handleToggleStatus = (id: number, currentStatus: string) => {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published';
    setPages(
      pages.map((p) =>
        p.id === id ? { ...p, status: newStatus, updatedAt: new Date().toISOString().split('T')[0] } : p
      )
    );
    message.success(`Page ${newStatus === 'published' ? 'published' : 'unpublished'} successfully`);
  };

  const handleSubmit = (values: any) => {
    const pageData = {
      ...values,
      content,
      id: editingPage?.id || pages.length + 1,
      createdAt: editingPage?.createdAt || new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };

    if (editingPage) {
      setPages(pages.map((p) => (p.id === editingPage.id ? pageData : p)));
      message.success('Page updated successfully');
    } else {
      setPages([...pages, pageData]);
      message.success('Page created successfully');
    }

    setModalVisible(false);
    form.resetFields();
    setContent('');
  };

  const columns: ColumnsType<Page> = [
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
        <Input
          placeholder="Search pages..."
          prefix={<SearchOutlined />}
          size="large"
          style={{ marginBottom: 16, maxWidth: 400 }}
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
  );
};

export default AdminPagesPage;
