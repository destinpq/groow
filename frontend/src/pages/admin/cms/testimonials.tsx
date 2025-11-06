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
  Rate,
  Upload,
  message,
  Typography,
  Avatar,
  Switch,
} from 'antd';
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  UploadOutlined,
  StarOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { UploadFile } from 'antd/es/upload/interface';
import { cmsAPI, CMSTestimonial } from '@/services/api';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const AdminTestimonialsPage: React.FC = () => {
  const [testimonials, setTestimonials] = useState<CMSTestimonial[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<CMSTestimonial | null>(null);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = async () => {
    try {
      setLoading(true);
      const response = await cmsAPI.testimonials.getAll();
      setTestimonials(response.data || []);
    } catch (error) {
      message.error('Failed to load testimonials');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      published: 'success',
      draft: 'warning',
    };
    return colors[status] || 'default';
  };

  const handleAddTestimonial = () => {
    setEditingTestimonial(null);
    form.resetFields();
    setFileList([]);
    setModalVisible(true);
  };

  const handleEditTestimonial = (testimonial: CMSTestimonial) => {
    setEditingTestimonial(testimonial);
    form.setFieldsValue(testimonial);
    setModalVisible(true);
  };

  const handleDeleteTestimonial = async (id: number) => {
    Modal.confirm({
      title: 'Delete Testimonial',
      content: 'Are you sure you want to delete this testimonial?',
      okText: 'Delete',
      okType: 'danger',
      onOk: async () => {
        try {
          await cmsAPI.testimonials.delete(id);
          message.success('Testimonial deleted successfully');
          loadTestimonials();
        } catch (error) {
          message.error('Failed to delete testimonial');
          console.error(error);
        }
      },
    });
  };

  const handleToggleStatus = async (id: number, isActive: boolean) => {
    try {
      await cmsAPI.testimonials.update(id, { isActive });
      message.success(`Testimonial ${isActive ? 'published' : 'unpublished'} successfully`);
      loadTestimonials();
    } catch (error) {
      message.error('Failed to update testimonial');
      console.error(error);
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      if (editingTestimonial) {
        await cmsAPI.testimonials.update(editingTestimonial.id, values);
        message.success('Testimonial updated successfully');
      } else {
        await cmsAPI.testimonials.create(values);
        message.success('Testimonial created successfully');
      }
      setModalVisible(false);
      form.resetFields();
      setFileList([]);
      loadTestimonials();
    } catch (error) {
      message.error('Failed to save testimonial');
      console.error(error);
    }
  };

  const columns: ColumnsType<CMSTestimonial> = [
    {
      title: 'Customer',
      key: 'customer',
      render: (_, record) => (
        <Space>
          <Avatar icon={<UserOutlined />} src={record.customerImage} />
          <div>
            <Text strong>{record.customerName}</Text>
            {record.customerTitle && (
              <>
                <br />
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {record.customerTitle}
                </Text>
              </>
            )}
          </div>
        </Space>
      ),
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      render: (rating: number) => <Rate disabled value={rating} style={{ fontSize: 16 }} />,
      sorter: (a, b) => a.rating - b.rating,
    },
    {
      title: 'Testimonial',
      dataIndex: 'content',
      key: 'content',
      render: (content: string) => (
        <Paragraph
          ellipsis={{ rows: 2, expandable: true, symbol: 'more' }}
          style={{ marginBottom: 0, maxWidth: 400 }}
        >
          {content}
        </Paragraph>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean, record) => (
        <Switch
          checked={isActive}
          onChange={(checked) => handleToggleStatus(record.id, checked)}
          size="small"
        />
      ),
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString(),
      sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEditTestimonial(record)}
          >
            Edit
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteTestimonial(record.id)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Card
        title={<Title level={3}>Customer Testimonials</Title>}
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddTestimonial}>
            Add Testimonial
          </Button>
        }
      >
        {/* Search */}
        <Input
          placeholder="Search testimonials..."
          prefix={<SearchOutlined />}
          size="large"
          style={{ marginBottom: 16, maxWidth: 400 }}
        />

        {/* Testimonials Table */}
        <Table
          columns={columns}
          dataSource={testimonials}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} testimonials`,
          }}
        />
      </Card>

      {/* Add/Edit Testimonial Modal */}
      <Modal
        title={editingTestimonial ? 'Edit Testimonial' : 'Add New Testimonial'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={700}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="name"
            label="Customer Name"
            rules={[{ required: true, message: 'Please enter customer name' }]}
          >
            <Input placeholder="e.g., John Smith" />
          </Form.Item>

          <Form.Item
            name="designation"
            label="Designation"
            rules={[{ required: true, message: 'Please enter designation' }]}
          >
            <Input placeholder="e.g., CEO" />
          </Form.Item>

          <Form.Item
            name="company"
            label="Company Name"
            rules={[{ required: true, message: 'Please enter company name' }]}
          >
            <Input placeholder="e.g., Tech Corp" />
          </Form.Item>

          <Form.Item
            name="rating"
            label="Rating"
            rules={[{ required: true, message: 'Please select rating' }]}
            initialValue={5}
          >
            <Rate />
          </Form.Item>

          <Form.Item
            name="comment"
            label="Testimonial"
            rules={[
              { required: true, message: 'Please enter testimonial' },
              { max: 500, message: 'Testimonial must be less than 500 characters' },
            ]}
          >
            <TextArea rows={4} placeholder="Enter customer testimonial..." showCount maxLength={500} />
          </Form.Item>

          <Form.Item label="Customer Photo (Optional)">
            <Upload
              listType="picture-card"
              fileList={fileList}
              onChange={({ fileList }) => setFileList(fileList)}
              beforeUpload={() => false}
              maxCount={1}
            >
              {fileList.length === 0 && (
                <div>
                  <UploadOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              )}
            </Upload>
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
                {editingTestimonial ? 'Update' : 'Add'} Testimonial
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminTestimonialsPage;
