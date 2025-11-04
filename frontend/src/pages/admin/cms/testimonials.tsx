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

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

interface Testimonial {
  id: number;
  name: string;
  designation: string;
  company: string;
  rating: number;
  comment: string;
  avatar?: string;
  status: string;
  createdAt: string;
}

const mockTestimonials: Testimonial[] = [
  {
    id: 1,
    name: 'John Smith',
    designation: 'CEO',
    company: 'Tech Corp',
    rating: 5,
    comment: 'Excellent platform! Our sales have increased by 300% since joining.',
    status: 'published',
    createdAt: '2024-10-15',
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    designation: 'Marketing Director',
    company: 'Fashion Hub',
    rating: 4,
    comment: 'Great customer support and easy to use interface.',
    status: 'published',
    createdAt: '2024-09-20',
  },
  {
    id: 3,
    name: 'Mike Davis',
    designation: 'Owner',
    company: 'Electronics Store',
    rating: 5,
    comment: 'Best e-commerce platform I have used. Highly recommended!',
    status: 'draft',
    createdAt: '2024-11-01',
  },
];

const AdminTestimonialsPage: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(mockTestimonials);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);

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

  const handleEditTestimonial = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    form.setFieldsValue(testimonial);
    setModalVisible(true);
  };

  const handleDeleteTestimonial = (id: number) => {
    Modal.confirm({
      title: 'Delete Testimonial',
      content: 'Are you sure you want to delete this testimonial?',
      okText: 'Delete',
      okType: 'danger',
      onOk: () => {
        setTestimonials(testimonials.filter((t) => t.id !== id));
        message.success('Testimonial deleted successfully');
      },
    });
  };

  const handleToggleStatus = (id: number, currentStatus: string) => {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published';
    setTestimonials(
      testimonials.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
    );
    message.success(`Testimonial ${newStatus === 'published' ? 'published' : 'unpublished'} successfully`);
  };

  const handleSubmit = (values: any) => {
    const testimonialData = {
      ...values,
      id: editingTestimonial?.id || testimonials.length + 1,
      createdAt: editingTestimonial?.createdAt || new Date().toISOString().split('T')[0],
      avatar: fileList.length > 0 ? URL.createObjectURL(fileList[0] as any) : undefined,
    };

    if (editingTestimonial) {
      setTestimonials(
        testimonials.map((t) => (t.id === editingTestimonial.id ? testimonialData : t))
      );
      message.success('Testimonial updated successfully');
    } else {
      setTestimonials([...testimonials, testimonialData]);
      message.success('Testimonial created successfully');
    }

    setModalVisible(false);
    form.resetFields();
    setFileList([]);
  };

  const columns: ColumnsType<Testimonial> = [
    {
      title: 'Customer',
      key: 'customer',
      render: (_, record) => (
        <Space>
          <Avatar icon={<UserOutlined />} src={record.avatar} />
          <div>
            <Text strong>{record.name}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: 12 }}>
              {record.designation} at {record.company}
            </Text>
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
      dataIndex: 'comment',
      key: 'comment',
      render: (comment: string) => (
        <Paragraph
          ellipsis={{ rows: 2, expandable: true, symbol: 'more' }}
          style={{ marginBottom: 0, maxWidth: 400 }}
        >
          {comment}
        </Paragraph>
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
            size="small"
          />
        </Space>
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
