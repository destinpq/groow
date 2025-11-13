/**
 * SAFE API RESPONSE HANDLING - APPLY THIS PATTERN:
 * const dataArray = response?.data?.data || response?.data || [];
 * const total = response?.data?.meta?.total || response?.meta?.total || response?.total || 0;
 * Always check: Array.isArray(data) before .map()/.filter()
 */

import React, { useState } from 'react';
import {
  Card,
  Table,
  Tag,
  Button,
  Space,
  Input,
  Select,
  Modal,
  Typography,
  Row,
  Col,
  Statistic,
  message,
  Descriptions,
  Drawer,
  Image,
  DatePicker,
} from 'antd';
import {
  SearchOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  ShoppingOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text, Link } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

interface Refund {
  id: number;
  refundId: string;
  orderId: string;
  customerName: string;
  customerId: number;
  productName: string;
  productImage: string;
  amount: number;
  reason: string;
  requestDate: string;
  status: string;
  refundMethod: string;
  processedDate?: string;
  adminNotes?: string;
  transactionId?: string;
}

const mockRefunds: Refund[] = [
  {
    id: 1,
    refundId: 'REF-2024-10001',
    orderId: 'ORD-2024-98765',
    customerName: 'John Doe',
    customerId: 501,
    productName: 'Wireless Headphones',
    productImage: 'https://via.placeholder.com/60',
    amount: 49.99,
    reason: 'Defective product - not working',
    requestDate: '2024-11-02',
    status: 'pending',
    refundMethod: 'Credit Card',
  },
  {
    id: 2,
    refundId: 'REF-2024-10002',
    orderId: 'ORD-2024-98766',
    customerName: 'Sarah Smith',
    customerId: 502,
    productName: 'Smart Watch',
    productImage: 'https://via.placeholder.com/60',
    amount: 199.99,
    reason: 'Wrong size ordered',
    requestDate: '2024-11-01',
    status: 'approved',
    refundMethod: 'PayPal',
  },
  {
    id: 3,
    refundId: 'REF-2024-10003',
    orderId: 'ORD-2024-98767',
    customerName: 'Mike Johnson',
    customerId: 503,
    productName: 'Laptop Stand',
    productImage: 'https://via.placeholder.com/60',
    amount: 35.00,
    reason: 'Product arrived damaged',
    requestDate: '2024-10-30',
    status: 'completed',
    refundMethod: 'Wallet Credit',
    processedDate: '2024-11-01',
    transactionId: 'TXN-2024-100005',
  },
  {
    id: 4,
    refundId: 'REF-2024-10004',
    orderId: 'ORD-2024-98768',
    customerName: 'Emily Davis',
    customerId: 504,
    productName: 'Bluetooth Speaker',
    productImage: 'https://via.placeholder.com/60',
    amount: 79.99,
    reason: 'Changed my mind',
    requestDate: '2024-10-28',
    status: 'rejected',
    refundMethod: 'Credit Card',
    adminNotes: 'Outside of return window (35 days)',
  },
];

const AdminRefundsPage: React.FC = () => {
  const [refunds, setRefunds] = useState<Refund[]>(mockRefunds);
  const [selectedRefund, setSelectedRefund] = useState<Refund | null>(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'warning',
      approved: 'processing',
      completed: 'success',
      rejected: 'error',
    };
    return colors[status] || 'default';
  };

  const handleViewRefund = (refund: Refund) => {
    setSelectedRefund(refund);
    setDrawerVisible(true);
  };

  const handleApproveRefund = (refund: Refund) => {
    Modal.confirm({
      title: 'Approve Refund Request',
      content: `Approve refund of $${refund.amount.toFixed(2)} to ${refund.customerName}?`,
      okText: 'Approve',
      onOk: () => {
        setRefunds(
          refunds.map((r) =>
            r.id === refund.id ? { ...r, status: 'approved' } : r
          )
        );
        message.success('Refund approved successfully');
      },
    });
  };

  const handleRejectRefund = (refund: Refund) => {
    setSelectedRefund(refund);
    setRejectModalVisible(true);
  };

  const handleConfirmReject = () => {
    if (!rejectionReason.trim()) {
      message.error('Please provide a reason for rejection');
      return;
    }
    if (selectedRefund) {
      setRefunds(
        refunds.map((r) =>
          r.id === selectedRefund.id
            ? { ...r, status: 'rejected', adminNotes: rejectionReason }
            : r
        )
      );
      message.success('Refund rejected');
      setRejectModalVisible(false);
      setRejectionReason('');
    }
  };

  const handleCompleteRefund = (refund: Refund) => {
    Modal.confirm({
      title: 'Mark as Completed',
      content: `Mark refund of $${refund.amount.toFixed(2)} to ${refund.customerName} as completed?`,
      okText: 'Complete',
      onOk: () => {
        setRefunds(
          refunds.map((r) =>
            r.id === refund.id
              ? {
                  ...r,
                  status: 'completed',
                  processedDate: new Date().toISOString().split('T')[0],
                  transactionId: `TXN-2024-${Math.floor(Math.random() * 100000)}`,
                }
              : r
          )
        );
        message.success('Refund marked as completed');
      },
    });
  };

  const columns: ColumnsType<Refund> = [
    {
      title: 'Refund ID',
      dataIndex: 'refundId',
      key: 'refundId',
      render: (text: string) => <Text strong copyable>{text}</Text>,
    },
    {
      title: 'Order ID',
      dataIndex: 'orderId',
      key: 'orderId',
      render: (text: string) => (
        <Link copyable={{ text }}>
          {text}
        </Link>
      ),
    },
    {
      title: 'Product',
      key: 'product',
      render: (_, record) => (
        <Space>
          <Image
            src={record.productImage}
            alt={record.productName}
            width={40}
            height={40}
            style={{ objectFit: 'cover', borderRadius: 4 }}
          />
          <Text>{record.productName}</Text>
        </Space>
      ),
    },
    {
      title: 'Customer',
      key: 'customer',
      render: (_, record) => (
        <div>
          <Text strong>{record.customerName}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: 12 }}>
            ID: {record.customerId}
          </Text>
        </div>
      ),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => (
        <Text strong style={{ color: '#ff4d4f', fontSize: 16 }}>
          ${amount.toFixed(2)}
        </Text>
      ),
      sorter: (a, b) => a.amount - b.amount,
    },
    {
      title: 'Reason',
      dataIndex: 'reason',
      key: 'reason',
      ellipsis: true,
    },
    {
      title: 'Request Date',
      dataIndex: 'requestDate',
      key: 'requestDate',
      render: (date: string) => new Date(date).toLocaleDateString(),
      sorter: (a, b) => new Date(a.requestDate).getTime() - new Date(b.requestDate).getTime(),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{status.toUpperCase()}</Tag>
      ),
      filters: [
        { text: 'Pending', value: 'pending' },
        { text: 'Approved', value: 'approved' },
        { text: 'Completed', value: 'completed' },
        { text: 'Rejected', value: 'rejected' },
      ],
      onFilter: (value, record) => record.status === value,
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
            onClick={() => handleViewRefund(record)}
          >
            View
          </Button>
          {record.status === 'pending' && (
            <>
              <Button
                type="link"
                size="small"
                icon={<CheckCircleOutlined />}
                style={{ color: '#52c41a' }}
                onClick={() => handleApproveRefund(record)}
              >
                Approve
              </Button>
              <Button
                type="link"
                size="small"
                danger
                icon={<CloseCircleOutlined />}
                onClick={() => handleRejectRefund(record)}
              >
                Reject
              </Button>
            </>
          )}
          {record.status === 'approved' && (
            <Button
              type="link"
              size="small"
              icon={<CheckCircleOutlined />}
              style={{ color: '#52c41a' }}
              onClick={() => handleCompleteRefund(record)}
            >
              Mark Completed
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const totalPending = refunds
    .filter((r) => r.status === 'pending')
    .reduce((sum, r) => sum + r.amount, 0);

  const totalApproved = refunds
    .filter((r) => r.status === 'approved')
    .reduce((sum, r) => sum + r.amount, 0);

  const totalCompleted = refunds
    .filter((r) => r.status === 'completed')
    .reduce((sum, r) => sum + r.amount, 0);

  const pendingCount = refunds.filter((r) => r.status === 'pending').length;

  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>Refund Management</Title>

      {/* Statistics */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Pending Refunds"
              value={totalPending}
              precision={2}
              prefix={<ClockCircleOutlined style={{ color: '#faad14' }} />}
              suffix="USD"
              valueStyle={{ color: '#faad14' }}
            />
            <Text type="secondary">{pendingCount} requests</Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Approved"
              value={totalApproved}
              precision={2}
              prefix={<CheckCircleOutlined style={{ color: '#1890ff' }} />}
              suffix="USD"
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Completed"
              value={totalCompleted}
              precision={2}
              prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
              suffix="USD"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Refunded"
              value={totalCompleted}
              precision={2}
              prefix={<DollarOutlined style={{ color: '#ff4d4f' }} />}
              suffix="USD"
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>

      <Card>
        {/* Filters */}
        <Space style={{ marginBottom: 16, width: '100%', flexWrap: 'wrap' }}>
          <Input
            placeholder="Search refunds..."
            prefix={<SearchOutlined />}
            style={{ width: 250 }}
          />
          <Select placeholder="Status" style={{ width: 150 }}>
            <Option value="all">All Status</Option>
            <Option value="pending">Pending</Option>
            <Option value="approved">Approved</Option>
            <Option value="completed">Completed</Option>
            <Option value="rejected">Rejected</Option>
          </Select>
          <Select placeholder="Refund Method" style={{ width: 180 }}>
            <Option value="all">All Methods</Option>
            <Option value="credit_card">Credit Card</Option>
            <Option value="paypal">PayPal</Option>
            <Option value="wallet">Wallet Credit</Option>
            <Option value="bank">Bank Transfer</Option>
          </Select>
          <RangePicker placeholder={['Start Date', 'End Date']} />
        </Space>

        {/* Refunds Table */}
        <Table
          columns={columns}
          dataSource={refunds}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} refund requests`,
          }}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* Refund Detail Drawer */}
      <Drawer
        title="Refund Details"
        placement="right"
        width={600}
        open={drawerVisible}
        onClose={() => setDrawerVisible(false)}
      >
        {selectedRefund && (
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            {/* Product Info */}
            <Card title="Product Information" size="small">
              <Space>
                <Image
                  src={selectedRefund.productImage}
                  alt={selectedRefund.productName}
                  width={80}
                  height={80}
                  style={{ objectFit: 'cover', borderRadius: 4 }}
                />
                <div>
                  <Text strong>{selectedRefund.productName}</Text>
                  <br />
                  <Text type="secondary">Order ID: {selectedRefund.orderId}</Text>
                </div>
              </Space>
            </Card>

            {/* Refund Information */}
            <Descriptions title="Refund Information" bordered column={1} size="small">
              <Descriptions.Item label="Refund ID">{selectedRefund.refundId}</Descriptions.Item>
              <Descriptions.Item label="Customer">
                {selectedRefund.customerName} (ID: {selectedRefund.customerId})
              </Descriptions.Item>
              <Descriptions.Item label="Amount">
                <Text strong style={{ fontSize: 18, color: '#ff4d4f' }}>
                  ${selectedRefund.amount.toFixed(2)}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="Reason">{selectedRefund.reason}</Descriptions.Item>
              <Descriptions.Item label="Request Date">
                {new Date(selectedRefund.requestDate).toLocaleDateString()}
              </Descriptions.Item>
              <Descriptions.Item label="Refund Method">
                {selectedRefund.refundMethod}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={getStatusColor(selectedRefund.status)}>
                  {selectedRefund.status.toUpperCase()}
                </Tag>
              </Descriptions.Item>
              {selectedRefund.processedDate && (
                <Descriptions.Item label="Processed Date">
                  {new Date(selectedRefund.processedDate).toLocaleDateString()}
                </Descriptions.Item>
              )}
              {selectedRefund.transactionId && (
                <Descriptions.Item label="Transaction ID">
                  <Text copyable>{selectedRefund.transactionId}</Text>
                </Descriptions.Item>
              )}
              {selectedRefund.adminNotes && (
                <Descriptions.Item label="Admin Notes">{selectedRefund.adminNotes}</Descriptions.Item>
              )}
            </Descriptions>

            <Space>
              {selectedRefund.status === 'pending' && (
                <>
                  <Button
                    type="primary"
                    icon={<CheckCircleOutlined />}
                    onClick={() => handleApproveRefund(selectedRefund)}
                  >
                    Approve
                  </Button>
                  <Button
                    danger
                    icon={<CloseCircleOutlined />}
                    onClick={() => handleRejectRefund(selectedRefund)}
                  >
                    Reject
                  </Button>
                </>
              )}
              {selectedRefund.status === 'approved' && (
                <Button
                  type="primary"
                  icon={<CheckCircleOutlined />}
                  onClick={() => handleCompleteRefund(selectedRefund)}
                >
                  Mark as Completed
                </Button>
              )}
              <Button
                icon={<ShoppingOutlined />}
                onClick={() => message.info(`View order: ${selectedRefund.orderId}`)}
              >
                View Order
              </Button>
            </Space>
          </Space>
        )}
      </Drawer>

      {/* Reject Modal */}
      <Modal
        title="Reject Refund Request"
        open={rejectModalVisible}
        onCancel={() => setRejectModalVisible(false)}
        onOk={handleConfirmReject}
        okText="Reject"
        okButtonProps={{ danger: true }}
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <Text>Provide a reason for rejecting this refund request:</Text>
          <TextArea
            rows={4}
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="Enter rejection reason..."
          />
        </Space>
      </Modal>
    </div>
  );
};

export default AdminRefundsPage;
