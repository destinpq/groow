import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Button,
  Rate,
  Form,
  Input,
  Upload,
  message,
  Table,
  Tag,
  Space,
  Avatar,
  Modal,
  Image,
  Divider,
  Progress,
  Empty,
  Spin,
} from 'antd';
import {
  StarOutlined,
  EditOutlined,
  DeleteOutlined,
  CameraOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { UploadFile } from 'antd/es/upload/interface';
import { reviewsAPI, type Review as APIReview } from '@/services/api/reviews';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

// Extended Review interface for UI
interface Review extends APIReview {
  productName?: string;
  productImage?: string;
}

const CustomerReviewsPage: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 5, total: 0 });
  const [form] = Form.useForm();

  // Fetch customer reviews from API
  const fetchReviews = async (page = 1, pageSize = 5) => {
    try {
      setLoading(true);
      const response = await reviewsAPI.getCustomerReviews({
        page,
        limit: pageSize,
      });
      
      // Map API response to UI format (would typically include product details from backend)
      const mappedReviews: Review[] = response.data.map((review: APIReview) => ({
        ...review,
        productName: `Product ${review.productId}`, // Placeholder - would come from backend
        productImage: 'https://via.placeholder.com/80?text=Product', // Placeholder
      }));
      
      setReviews(mappedReviews);
      setPagination({
        current: page,
        pageSize,
        total: response.total,
      });
    } catch (error) {
      message.error('Failed to load reviews');
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleEdit = (review: Review) => {
    setEditingReview(review);
    form.setFieldsValue({
      rating: review.rating,
      title: review.title,
      comment: review.comment,
    });
    setFileList(
      (review.images || []).map((img, idx) => ({
        uid: `${idx}`,
        name: `image${idx}.jpg`,
        status: 'done' as const,
        url: img,
      }))
    );
    setIsModalVisible(true);
  };

  const handleDelete = async (reviewId: string) => {
    Modal.confirm({
      title: 'Delete Review',
      icon: <ExclamationCircleOutlined />,
      content: 'Are you sure you want to delete this review? This action cannot be undone.',
      okText: 'Delete',
      okType: 'danger',
      async onOk() {
        try {
          await reviewsAPI.delete(reviewId);
          setReviews(reviews.filter((r) => r.id !== reviewId));
          message.success('Review deleted successfully');
        } catch (error) {
          message.error('Failed to delete review');
          console.error('Error deleting review:', error);
        }
      },
    });
  };

  const handleSubmit = async (values: any) => {
    try {
      setUploading(true);
      
      // Upload images if any
      let imageUrls: string[] = [];
      const newFiles = fileList.filter((f) => !f.url && f.originFileObj);
      
      if (newFiles.length > 0) {
        const files = newFiles.map((f) => f.originFileObj as File);
        const uploadResult = await reviewsAPI.uploadImages(files);
        imageUrls = uploadResult.urls;
      }
      
      // Keep existing images
      const existingImages = fileList.filter((f) => f.url).map((f) => f.url as string);
      const allImages = [...existingImages, ...imageUrls];
      
      if (editingReview) {
        // Update existing review
        await reviewsAPI.update(editingReview.id, {
          ...values,
          images: allImages,
        });
        message.success('Review updated successfully and submitted for approval');
        fetchReviews(pagination.current, pagination.pageSize);
      }
      
      setIsModalVisible(false);
      setEditingReview(null);
      form.resetFields();
      setFileList([]);
    } catch (error) {
      message.error('Failed to submit review');
      console.error('Error submitting review:', error);
    } finally {
      setUploading(false);
    }
  };

  const getStatusTag = (status: string) => {
    switch (status) {
      case 'approved':
        return <Tag color="green" icon={<CheckCircleOutlined />}>Published</Tag>;
      case 'pending':
        return <Tag color="orange" icon={<ClockCircleOutlined />}>Pending Approval</Tag>;
      case 'rejected':
        return <Tag color="red" icon={<ExclamationCircleOutlined />}>Rejected</Tag>;
      default:
        return <Tag>Unknown</Tag>;
    }
  };

  const getRatingStats = () => {
    const total = reviews.length;
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / total;
    const distribution = [5, 4, 3, 2, 1].map((star) => ({
      star,
      count: reviews.filter((r) => r.rating === star).length,
      percentage: (reviews.filter((r) => r.rating === star).length / total) * 100,
    }));

    return { total, avgRating, distribution };
  };

  const stats = getRatingStats();

  const columns: ColumnsType<Review> = [
    {
      title: 'Product',
      key: 'product',
      width: 300,
      render: (_, record) => (
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Avatar src={record.productImage} size={64} shape="square" />
          <div>
            <Text strong style={{ display: 'block' }}>{record.productName}</Text>
            <Text type="secondary" style={{ fontSize: 12 }}>
              Reviewed on {new Date(record.createdAt).toLocaleDateString()}
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: 'Rating & Review',
      key: 'review',
      render: (_, record) => (
        <div>
          <div style={{ marginBottom: 8 }}>
            <Rate disabled value={record.rating} style={{ fontSize: 14 }} />
            {record.verified && (
              <Tag color="blue" style={{ marginLeft: 8, fontSize: 11 }}>
                Verified Purchase
              </Tag>
            )}
          </div>
          <Text strong style={{ display: 'block', marginBottom: 4 }}>{record.title}</Text>
          <Paragraph
            ellipsis={{ rows: 2, expandable: true }}
            style={{ marginBottom: 8, fontSize: 13 }}
          >
            {record.comment}
          </Paragraph>
          {record.images && record.images.length > 0 && (
            <Image.PreviewGroup>
              <Space size={4}>
                {record.images.map((img, idx) => (
                  <Image
                    key={idx}
                    src={img}
                    width={40}
                    height={40}
                    style={{ objectFit: 'cover', borderRadius: 4 }}
                  />
                ))}
              </Space>
            </Image.PreviewGroup>
          )}
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 150,
      render: (status) => getStatusTag(status),
    },
    {
      title: 'Helpful',
      dataIndex: 'helpful',
      key: 'helpful',
      width: 80,
      render: (helpful) => (
        <Text type="secondary">{helpful} {helpful === 1 ? 'person' : 'people'}</Text>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Button
            type="link"
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={3}>
          <StarOutlined style={{ color: '#ff9900' }} /> My Reviews
        </Title>
        <Paragraph type="secondary">
          Manage your product reviews and see how helpful they've been to other customers
        </Paragraph>
      </div>

      {/* Statistics */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} md={8}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <Title level={2} style={{ margin: 0, color: '#ff9900' }}>
                {stats.total}
              </Title>
              <Text type="secondary">Total Reviews</Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
                <Rate disabled value={stats.avgRating} allowHalf />
              </div>
              <Title level={2} style={{ margin: 0, color: '#52c41a' }}>
                {stats.avgRating.toFixed(1)}
              </Title>
              <Text type="secondary">Average Rating</Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <Title level={2} style={{ margin: 0, color: '#1890ff' }}>
                {reviews.reduce((sum, r) => sum + r.helpful, 0)}
              </Title>
              <Text type="secondary">Helpful Votes Received</Text>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Rating Distribution */}
      <Card title="Rating Distribution" style={{ marginBottom: 24 }}>
        <Row gutter={16}>
          {stats.distribution.map((item) => (
            <Col xs={24} sm={12} md={8} lg={4} key={item.star}>
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <StarOutlined style={{ color: '#faad14' }} />
                  <Text strong>{item.star}</Text>
                </div>
                <Progress
                  percent={Math.round(item.percentage)}
                  strokeColor="#faad14"
                  format={() => `${item.count}`}
                />
              </div>
            </Col>
          ))}
        </Row>
      </Card>

      {/* Reviews Table */}
      <Card title="All Reviews">
        {loading && reviews.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <Spin size="large" />
          </div>
        ) : reviews.length === 0 ? (
          <Empty description="You haven't written any reviews yet" />
        ) : (
          <Table
            columns={columns}
            dataSource={reviews}
            rowKey="id"
            loading={loading}
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: pagination.total,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} reviews`,
              onChange: (page, pageSize) => fetchReviews(page, pageSize),
            }}
          />
        )}
      </Card>

      {/* Edit Modal */}
      <Modal
        title={editingReview ? 'Edit Review' : 'Write Review'}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingReview(null);
          form.resetFields();
          setFileList([]);
        }}
        footer={null}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="rating"
            label="Rating"
            rules={[{ required: true, message: 'Please select a rating' }]}
          >
            <Rate />
          </Form.Item>

          <Form.Item
            name="title"
            label="Review Title"
            rules={[{ required: true, message: 'Please enter a title' }]}
          >
            <Input placeholder="Summarize your experience" />
          </Form.Item>

          <Form.Item
            name="comment"
            label="Review"
            rules={[{ required: true, message: 'Please write your review' }]}
          >
            <TextArea
              rows={4}
              placeholder="Share your thoughts about this product..."
              showCount
              maxLength={500}
            />
          </Form.Item>

          <Form.Item label="Photos (Optional)">
            <Upload
              listType="picture-card"
              fileList={fileList}
              onChange={({ fileList: newFileList }) => setFileList(newFileList)}
              beforeUpload={() => false}
            >
              {fileList.length < 5 && (
                <div>
                  <CameraOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              )}
            </Upload>
            <Text type="secondary" style={{ fontSize: 12 }}>
              Upload up to 5 photos (JPG, PNG)
            </Text>
          </Form.Item>

          <Divider />

          <Form.Item style={{ marginBottom: 0 }}>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button
                onClick={() => {
                  setIsModalVisible(false);
                  setEditingReview(null);
                  form.resetFields();
                  setFileList([]);
                }}
                disabled={uploading}
              >
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" loading={uploading}>
                Submit for Approval
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CustomerReviewsPage;
