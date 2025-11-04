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
  Rate,
  Avatar,
  Modal,
  message,
  Divider,
  Statistic,
  Progress,
  Image,
  Switch,
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

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

interface ProductReview {
  id: number;
  productId: number;
  productName: string;
  customerName: string;
  customerAvatar: string;
  rating: number;
  title: string;
  comment: string;
  helpful: number;
  notHelpful: number;
  verified: boolean;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  images: string[];
}

const mockReviews: ProductReview[] = [
  {
    id: 1,
    productId: 101,
    productName: 'Wireless Headphones Pro',
    customerName: 'John Doe',
    customerAvatar: '',
    rating: 5,
    title: 'Excellent sound quality!',
    comment: 'These headphones are amazing. The noise cancellation is top-notch and battery life is great. Highly recommended!',
    helpful: 45,
    notHelpful: 3,
    verified: true,
    status: 'approved',
    createdAt: dayjs().subtract(2, 'days').format('YYYY-MM-DD HH:mm'),
    images: [],
  },
  {
    id: 2,
    productId: 102,
    productName: 'Smart Watch Series 5',
    customerName: 'Jane Smith',
    customerAvatar: '',
    rating: 4,
    title: 'Good but battery could be better',
    comment: 'Overall great smartwatch with lots of features. Only complaint is the battery life could be longer.',
    helpful: 28,
    notHelpful: 5,
    verified: true,
    status: 'approved',
    createdAt: dayjs().subtract(5, 'days').format('YYYY-MM-DD HH:mm'),
    images: [],
  },
  {
    id: 3,
    productId: 103,
    productName: 'Leather Office Chair',
    customerName: 'Bob Johnson',
    customerAvatar: '',
    rating: 2,
    title: 'Not as comfortable as expected',
    comment: 'The chair looks good but is not very comfortable for long sitting sessions. Disappointed.',
    helpful: 12,
    notHelpful: 8,
    verified: false,
    status: 'pending',
    createdAt: dayjs().subtract(1, 'hour').format('YYYY-MM-DD HH:mm'),
    images: [],
  },
  {
    id: 4,
    productId: 101,
    productName: 'Wireless Headphones Pro',
    customerName: 'Alice Williams',
    customerAvatar: '',
    rating: 1,
    title: 'Terrible product',
    comment: 'This is spam content with inappropriate language...',
    helpful: 0,
    notHelpful: 15,
    verified: false,
    status: 'pending',
    createdAt: dayjs().subtract(30, 'minutes').format('YYYY-MM-DD HH:mm'),
    images: [],
  },
];

const ReviewsModerationPage: React.FC = () => {
  const [selectedReview, setSelectedReview] = useState<ProductReview | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [replyText, setReplyText] = useState<string>('');

  const handleApproveReview = (id: number) => {
    message.success('Review approved successfully');
  };

  const handleRejectReview = (id: number) => {
    message.success('Review rejected');
  };

  const handleViewReview = (review: ProductReview) => {
    setSelectedReview(review);
    setIsModalVisible(true);
  };

  const handleReplySubmit = () => {
    message.success('Reply posted successfully');
    setIsModalVisible(false);
    setReplyText('');
  };

  const reviewColumns: ColumnsType<ProductReview> = [
    {
      title: 'Customer',
      key: 'customer',
      width: 200,
      render: (_, record) => (
        <Space>
          <Avatar icon={<UserOutlined />} />
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
      title: 'Product',
      dataIndex: 'productName',
      key: 'productName',
      render: (name) => <Text>{name}</Text>,
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
      render: (status: ProductReview['status']) => {
        const config: Record<ProductReview['status'], { color: string; icon: React.ReactNode; text: string }> = {
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

  const totalReviews = mockReviews.length;
  const pendingReviews = mockReviews.filter((r) => r.status === 'pending').length;
  const approvedReviews = mockReviews.filter((r) => r.status === 'approved').length;
  const avgRating = (mockReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1);

  return (
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
              dataSource={mockReviews}
              rowKey="id"
              pagination={{ pageSize: 10 }}
              scroll={{ x: 1200 }}
            />
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title="Rating Distribution" style={{ marginBottom: 16 }}>
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = mockReviews.filter((r) => r.rating === star).length;
                const percentage = (count / totalReviews) * 100;
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
              <Text type="secondary">Product:</Text>
              <div>
                <Text strong>{selectedReview.productName}</Text>
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
  );
};

export default ReviewsModerationPage;
