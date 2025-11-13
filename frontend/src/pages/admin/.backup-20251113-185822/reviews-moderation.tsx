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
  Rate,
  Avatar,
  Modal,
  message,
  Divider,
  Statistic,
  Progress,
  Image,
  Switch,
  Spin,
} from 'antd';
import {
  StarOutlined,
  LikeOutlined,
  DislikeOutlined,
  UserOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  CommentOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { reviewsAPI } from '@/services/api/reviews';
import type { Review } from '@/services/api/reviews';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const ReviewsModerationPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [ratingFilter, setRatingFilter] = useState<number | undefined>();
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [replyText, setReplyText] = useState<string>('');

  useEffect(() => {
    fetchReviews();
  }, [page, pageSize, statusFilter, ratingFilter]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await reviewsAPI.getAll({
        page,
        limit: pageSize,
        status: statusFilter,
        rating: ratingFilter,
      });
      setReviews(Array.isArray(response?.data?.data) ? response.data.data : (Array.isArray(response?.data) ? response.data : []));
      setTotal(response.total);
    } catch (error) {
      message.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveReview = async (id: string) => {
    try {
      await reviewsAPI.approve(id);
      message.success('Review approved successfully');
      fetchReviews(); // Refresh list
    } catch (error) {
      message.error('Failed to approve review');
    }
  };

  const handleRejectReview = async (id: string) => {
    try {
      await reviewsAPI.reject(id);
      message.success('Review rejected');
      fetchReviews(); // Refresh list
    } catch (error) {
      message.error('Failed to reject review');
    }
  };

  const handleDeleteReview = async (id: string) => {
    Modal.confirm({
      title: 'Delete Review',
      content: 'Are you sure you want to delete this review?',
      onOk: async () => {
        try {
          await reviewsAPI.delete(id);
          message.success('Review deleted successfully');
          fetchReviews();
        } catch (error) {
          message.error('Failed to delete review');
        }
      },
    });
  };

  const handleViewReview = (review: Review) => {
    setSelectedReview(review);
    setIsModalVisible(true);
  };

  const handleReplySubmit = () => {
    message.success('Reply posted successfully');
    setIsModalVisible(false);
    setReplyText('');
  };

  const reviewColumns: ColumnsType<Review> = [
    {
      title: 'Customer',
      key: 'customer',
      width: 200,
      render: (_, record) => (
        <Space>
          <Avatar src={record.customerAvatar} icon={<UserOutlined />} />
          <div>
            <Text strong>{record.customerName}</Text>
            {record.verified && (
              <div>
                <Tag color="green" style={{ fontSize: 10 }}>
                  <CheckCircleOutlined /> Verified Purchase
                </Tag>
              </div>
            )}
          </div>
        </Space>
      ),
    },
    {
      title: 'Product ID',
      dataIndex: 'productId',
      key: 'productId',
      render: (id) => <Text>#{id}</Text>,
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      render: (rating) => (
        <div>
          <Rate disabled defaultValue={rating} style={{ fontSize: 14 }} />
          <Text type="secondary" style={{ marginLeft: 8, fontSize: 12 }}>
            {rating}.0
          </Text>
        </div>
      ),
      sorter: (a, b) => a.rating - b.rating,
    },
    {
      title: 'Review',
      key: 'review',
      width: 300,
      render: (_, record) => (
        <div>
          <Text strong style={{ display: 'block', marginBottom: 4 }}>{record.title}</Text>
          <Text ellipsis style={{ fontSize: 12 }}>
            {record.comment.substring(0, 100)}...
          </Text>
        </div>
      ),
    },
    {
      title: 'Helpful',
      key: 'helpful',
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Space>
            <LikeOutlined style={{ color: '#52c41a' }} />
            <Text>{record.helpful}</Text>
          </Space>
          <Space>
            <DislikeOutlined style={{ color: '#ff4d4f' }} />
            <Text>{record.notHelpful}</Text>
          </Space>
        </Space>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: Review['status']) => {
        const config: Record<Review['status'], { color: string; icon: React.ReactNode; text: string }> = {
          pending: { color: 'orange', icon: <EyeOutlined />, text: 'Pending' },
          approved: { color: 'green', icon: <CheckCircleOutlined />, text: 'Approved' },
          rejected: { color: 'red', icon: <CloseCircleOutlined />, text: 'Rejected' },
        };
        return (
          <Tag color={config[status].color} icon={config[status].icon}>
            {config[status].text}
          </Tag>
        );
      },
      filters: [
        { text: 'Pending', value: 'pending' },
        { text: 'Approved', value: 'approved' },
        { text: 'Rejected', value: 'rejected' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => <Text type="secondary" style={{ fontSize: 12 }}>{date}</Text>,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <Button size="small" type="link" onClick={() => handleViewReview(record)}>
            View Details
          </Button>
          {record.status === 'pending' && (
            <Space size="small">
              <Button
                size="small"
                type="primary"
                icon={<CheckCircleOutlined />}
                onClick={() => handleApproveReview(record.id)}
              >
                Approve
              </Button>
              <Button
                size="small"
                danger
                icon={<CloseCircleOutlined />}
                onClick={() => handleRejectReview(record.id)}
              >
                Reject
              </Button>
            </Space>
          )}
        </Space>
      ),
    },
  ];

  // Calculate stats from loaded reviews
  const totalReviews = total;
  const pendingReviews = reviews.filter((r) => r.status === 'pending').length;
  const approvedReviews = reviews.filter((r) => r.status === 'approved').length;
  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  return (
    <Spin spinning={loading}>
      <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={3}>
          <StarOutlined style={{ color: '#1890ff' }} /> Reviews Moderation
        </Title>
        <Paragraph type="secondary">
          Moderate customer reviews, approve or reject submissions, and respond to feedback
        </Paragraph>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Reviews"
              value={totalReviews}
              prefix={<CommentOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Pending Approval"
              value={pendingReviews}
              prefix={<EyeOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Approved"
              value={approvedReviews}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Average Rating"
              value={avgRating}
              suffix="/ 5"
              prefix={<StarOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col xs={24} lg={16}>
          <Card title="Customer Reviews">
            <Table
              columns={reviewColumns}
              dataSource={reviews}
              rowKey="id"
              pagination={{
                current: page,
                pageSize,
                total,
                onChange: (newPage, newPageSize) => {
                  setPage(newPage);
                  setPageSize(newPageSize || 10);
                },
                showSizeChanger: true,
                showTotal: (total) => `Total ${total} reviews`,
              }}
              scroll={{ x: 1200 }}
            />
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title="Rating Distribution" style={{ marginBottom: 16 }}>
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = reviews.filter((r) => r.rating === star).length;
                const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                return (
                  <div key={star}>
                    <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                      <Space>
                        <Text>{star}</Text>
                        <StarOutlined style={{ color: '#faad14' }} />
                      </Space>
                      <Text type="secondary">{count}</Text>
                    </Space>
                    <Progress percent={percentage} showInfo={false} strokeColor="#faad14" />
                  </div>
                );
              })}
            </Space>
          </Card>

          <Card title="Moderation Settings">
            <Form layout="vertical">
              <Form.Item label="Auto-approve verified purchases" valuePropName="checked">
                <Switch defaultChecked />
              </Form.Item>
              <Form.Item label="Require minimum rating to approve">
                <Select defaultValue="1" style={{ width: '100%' }}>
                  <Select.Option value="1">1 star or higher</Select.Option>
                  <Select.Option value="2">2 stars or higher</Select.Option>
                  <Select.Option value="3">3 stars or higher</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item label="Enable profanity filter" valuePropName="checked">
                <Switch defaultChecked />
              </Form.Item>
              <Form.Item label="Allow customer images" valuePropName="checked">
                <Switch defaultChecked />
              </Form.Item>
              <Form.Item>
                <Button type="primary" block>
                  Save Settings
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>

      <Modal
        title="Review Details"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        width={700}
        footer={null}
      >
        {selectedReview && (
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            <div>
              <Space style={{ marginBottom: 16 }}>
                <Avatar size={48} icon={<UserOutlined />} />
                <div>
                  <Text strong style={{ display: 'block' }}>{selectedReview.customerName}</Text>
                  <Text type="secondary" style={{ fontSize: 12 }}>{selectedReview.createdAt}</Text>
                  {selectedReview.verified && (
                    <Tag color="green" style={{ fontSize: 10, marginTop: 4 }}>
                      <CheckCircleOutlined /> Verified Purchase
                    </Tag>
                  )}
                </div>
              </Space>
            </div>

            <div>
              <Text type="secondary">Product ID:</Text>
              <div>
                <Text strong>#{selectedReview.productId}</Text>
              </div>
            </div>

            <div>
              <Text type="secondary">Rating:</Text>
              <div>
                <Rate disabled defaultValue={selectedReview.rating} />
                <Text style={{ marginLeft: 8 }}>{selectedReview.rating}.0 / 5.0</Text>
              </div>
            </div>

            <div>
              <Text type="secondary">Review Title:</Text>
              <div>
                <Text strong style={{ fontSize: 16 }}>{selectedReview.title}</Text>
              </div>
            </div>

            <div>
              <Text type="secondary">Review:</Text>
              <div style={{ marginTop: 8, padding: 12, background: '#f5f5f5', borderRadius: 4 }}>
                <Paragraph>{selectedReview.comment}</Paragraph>
              </div>
            </div>

            <div>
              <Text type="secondary">Helpful Votes:</Text>
              <div style={{ marginTop: 8 }}>
                <Space size="large">
                  <Space>
                    <LikeOutlined style={{ color: '#52c41a', fontSize: 18 }} />
                    <Text>{selectedReview.helpful} found this helpful</Text>
                  </Space>
                  <Space>
                    <DislikeOutlined style={{ color: '#ff4d4f', fontSize: 18 }} />
                    <Text>{selectedReview.notHelpful} not helpful</Text>
                  </Space>
                </Space>
              </div>
            </div>

            <Divider />

            <div>
              <Text strong>Respond to Review:</Text>
              <TextArea
                rows={4}
                placeholder="Type your response to the customer..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                style={{ marginTop: 8 }}
              />
            </div>

            <Space>
              {selectedReview.status === 'pending' && (
                <>
                  <Button
                    type="primary"
                    icon={<CheckCircleOutlined />}
                    onClick={() => handleApproveReview(selectedReview.id)}
                  >
                    Approve Review
                  </Button>
                  <Button
                    danger
                    icon={<CloseCircleOutlined />}
                    onClick={() => handleRejectReview(selectedReview.id)}
                  >
                    Reject Review
                  </Button>
                </>
              )}
              <Button onClick={handleReplySubmit} disabled={!replyText}>
                Post Reply
              </Button>
            </Space>
          </Space>
        )}
      </Modal>
    </div>
    </Spin>
  );
};

export default ReviewsModerationPage;
