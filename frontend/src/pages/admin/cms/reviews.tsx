import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Tag,
  Button,
  Space,
  Input,
  Select,
  Rate,
  Modal,
  Typography,
  Avatar,
  Image,
  Switch,
  message,
  Drawer,
} from 'antd';
import {
  SearchOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  StarOutlined,
  UserOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { reviewsAPI, Review } from '@/services/api';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const AdminReviewsPage: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const response = await reviewsAPI.getCustomerReviews();
      setReviews(response.data || []);
    } catch (error) {
      message.error('Failed to load reviews');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      approved: 'success',
      pending: 'warning',
      rejected: 'error',
    };
    return colors[status] || 'default';
  };

  const handleViewReview = (review: Review) => {
    setSelectedReview(review);
    setDrawerVisible(true);
  };

  const handleApproveReview = async (id: string) => {
    try {
      await reviewsAPI.approve(id);
      message.success('Review approved');
      loadReviews();
    } catch (error) {
      message.error('Failed to approve review');
      console.error(error);
    }
  };

  const handleRejectReview = (id: string) => {
    Modal.confirm({
      title: 'Reject Review',
      content: 'Are you sure you want to reject this review?',
      okText: 'Reject',
      okType: 'danger',
      onOk: async () => {
        try {
          await reviewsAPI.reject(id);
          message.success('Review rejected');
          loadReviews();
        } catch (error) {
          message.error('Failed to reject review');
          console.error(error);
        }
      },
    });
  };

  const handleDeleteReview = async (id: string) => {
    Modal.confirm({
      title: 'Delete Review',
      content: 'Are you sure you want to delete this review permanently?',
      okText: 'Delete',
      okType: 'danger',
      onOk: async () => {
        try {
          await reviewsAPI.delete(id);
          message.success('Review deleted');
          loadReviews();
        } catch (error) {
          message.error('Failed to delete review');
          console.error(error);
        }
      },
    });
  };

  const columns: ColumnsType<Review> = [
    {
      title: 'Product',
      key: 'product',
      render: (_, record) => (
        <Space>
          <Image src={record.product?.images?.[0]} width={50} height={50} style={{ borderRadius: 4 }} />
          <Text>{record.product?.name || 'N/A'}</Text>
        </Space>
      ),
    },
    {
      title: 'Customer',
      key: 'customer',
      render: (_, record) => (
        <Space>
          <Avatar icon={<UserOutlined />} />
          <div>
            <Text>{record.customer?.name || 'N/A'}</Text>
            {record.isVerified && (
              <div>
                <Tag color="blue" style={{ fontSize: 10 }}>
                  VERIFIED PURCHASE
                </Tag>
              </div>
            )}
          </div>
        </Space>
      ),
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      render: (rating: number) => (
        <Space>
          <Rate disabled value={rating} style={{ fontSize: 14 }} />
          <Text strong>{rating}.0</Text>
        </Space>
      ),
      sorter: (a, b) => a.rating - b.rating,
    },
    {
      title: 'Review',
      key: 'review',
      render: (_, record) => (
        <div style={{ maxWidth: 300 }}>
          <Text strong style={{ display: 'block', marginBottom: 4 }}>
            {record.title}
          </Text>
          <Paragraph
            ellipsis={{ rows: 2, expandable: false }}
            style={{ marginBottom: 0, color: '#666' }}
          >
            {record.comment}
          </Paragraph>
        </div>
      ),
    },
    {
      title: 'Helpful',
      dataIndex: 'helpful',
      key: 'helpful',
      render: (helpful: number) => <Text>{helpful} votes</Text>,
      sorter: (a, b) => a.helpful - b.helpful,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{status.toUpperCase()}</Tag>
      ),
      filters: [
        { text: 'Approved', value: 'approved' },
        { text: 'Pending', value: 'pending' },
        { text: 'Rejected', value: 'rejected' },
      ],
      onFilter: (value, record) => record.status === value,
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
        <Space direction="vertical" size="small">
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewReview(record)}
          >
            View
          </Button>
          {record.status === 'pending' && (
            <>
              <Button
                type="link"
                size="small"
                icon={<CheckCircleOutlined />}
                onClick={() => handleApproveReview(record.id)}
                style={{ color: '#52c41a' }}
              >
                Approve
              </Button>
              <Button
                type="link"
                size="small"
                danger
                icon={<CloseCircleOutlined />}
                onClick={() => handleRejectReview(record.id)}
              >
                Reject
              </Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  const approvedCount = reviews.filter((r) => r.status === 'approved').length;
  const pendingCount = reviews.filter((r) => r.status === 'pending').length;
  const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  return (
    <div style={{ padding: 24 }}>
      <Card title={<Title level={3}>Product Reviews Management</Title>}>
        {/* Statistics */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
          <Card size="small" style={{ flex: 1 }}>
            <Text type="secondary">Total Reviews</Text>
            <Title level={3} style={{ margin: 0 }}>
              {reviews.length}
            </Title>
          </Card>
          <Card size="small" style={{ flex: 1 }}>
            <Text type="secondary">Pending Approval</Text>
            <Title level={3} style={{ margin: 0, color: '#faad14' }}>
              {pendingCount}
            </Title>
          </Card>
          <Card size="small" style={{ flex: 1 }}>
            <Text type="secondary">Approved</Text>
            <Title level={3} style={{ margin: 0, color: '#52c41a' }}>
              {approvedCount}
            </Title>
          </Card>
          <Card size="small" style={{ flex: 1 }}>
            <Text type="secondary">Average Rating</Text>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Title level={3} style={{ margin: 0 }}>
                {avgRating.toFixed(1)}
              </Title>
              <StarOutlined style={{ fontSize: 24, color: '#faad14' }} />
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Space style={{ marginBottom: 16, width: '100%' }} wrap>
          <Input
            placeholder="Search reviews..."
            prefix={<SearchOutlined />}
            style={{ width: 300 }}
          />
          <Select placeholder="Status" style={{ width: 150 }}>
            <Option value="all">All Reviews</Option>
            <Option value="approved">Approved</Option>
            <Option value="pending">Pending</Option>
            <Option value="rejected">Rejected</Option>
          </Select>
          <Select placeholder="Rating" style={{ width: 150 }}>
            <Option value="all">All Ratings</Option>
            <Option value="5">5 Stars</Option>
            <Option value="4">4 Stars</Option>
            <Option value="3">3 Stars</Option>
            <Option value="2">2 Stars</Option>
            <Option value="1">1 Star</Option>
          </Select>
        </Space>

        {/* Reviews Table */}
        <Table
          columns={columns}
          dataSource={reviews}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} reviews`,
          }}
        />
      </Card>

      {/* Review Detail Modal */}
      <Modal
        title="Review Details"
        open={drawerVisible}
        onCancel={() => setDrawerVisible(false)}
        width={700}
        footer={
          selectedReview?.status === 'pending'
            ? [
                <Button
                  key="reject"
                  danger
                  icon={<CloseCircleOutlined />}
                  onClick={() => {
                    handleRejectReview(selectedReview.id);
                    setDrawerVisible(false);
                  }}
                >
                  Reject
                </Button>,
                <Button
                  key="approve"
                  type="primary"
                  icon={<CheckCircleOutlined />}
                  onClick={() => {
                    handleApproveReview(selectedReview.id);
                    setDrawerVisible(false);
                  }}
                >
                  Approve
                </Button>,
              ]
            : null
        }
      >
        {selectedReview && (
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            <Card size="small" title="Product Information">
              <Space>
                <Image src={selectedReview.productImage} width={80} height={80} />
                <div>
                  <Text strong style={{ display: 'block' }}>
                    {selectedReview.productName}
                  </Text>
                  <Text type="secondary">Product ID: {selectedReview.productId}</Text>
                </div>
              </Space>
            </Card>

            <Card size="small" title="Customer Information">
              <Space>
                <Avatar size={50} icon={<UserOutlined />} />
                <div>
                  <Text strong style={{ display: 'block' }}>
                    {selectedReview.customerName}
                  </Text>
                  <Text type="secondary">Customer ID: {selectedReview.customerId}</Text>
                  {selectedReview.verified && (
                    <div>
                      <Tag color="blue">VERIFIED PURCHASE</Tag>
                    </div>
                  )}
                </div>
              </Space>
            </Card>

            <Card size="small" title="Review Content">
              <Space direction="vertical" style={{ width: '100%' }}>
                <div>
                  <Text type="secondary">Rating:</Text>
                  <div>
                    <Rate disabled value={selectedReview.rating} />
                    <Text strong style={{ marginLeft: 8 }}>
                      {selectedReview.rating}.0 / 5.0
                    </Text>
                  </div>
                </div>
                <div>
                  <Text type="secondary">Title:</Text>
                  <Title level={5} style={{ marginTop: 4 }}>
                    {selectedReview.title}
                  </Title>
                </div>
                <div>
                  <Text type="secondary">Comment:</Text>
                  <Paragraph style={{ marginTop: 4 }}>{selectedReview.comment}</Paragraph>
                </div>
                {selectedReview.images && selectedReview.images.length > 0 && (
                  <div>
                    <Text type="secondary">Images:</Text>
                    <div style={{ marginTop: 8 }}>
                      <Image.PreviewGroup>
                        {selectedReview.images.map((img, idx) => (
                          <Image key={idx} src={img} width={100} height={100} style={{ marginRight: 8 }} />
                        ))}
                      </Image.PreviewGroup>
                    </div>
                  </div>
                )}
                <div>
                  <Text type="secondary">Helpful Votes: </Text>
                  <Text strong>{selectedReview.helpful}</Text>
                </div>
                <div>
                  <Text type="secondary">Status: </Text>
                  <Tag color={getStatusColor(selectedReview.status)}>
                    {selectedReview.status.toUpperCase()}
                  </Tag>
                </div>
                <div>
                  <Text type="secondary">Date: </Text>
                  <Text>{new Date(selectedReview.createdAt).toLocaleDateString()}</Text>
                </div>
              </Space>
            </Card>
          </Space>
        )}
      </Modal>
    </div>
  );
};

export default AdminReviewsPage;
