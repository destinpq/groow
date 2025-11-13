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
} from 'antd';
import {
  SearchOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  DollarOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

interface Payout {
  id: number;
  payoutId: string;
  vendorName: string;
  vendorId: number;
  amount: number;
  requestDate: string;
  status: string;
  paymentMethod: string;
  accountNumber: string;
  processedDate?: string;
  notes?: string;
  transactionId?: string;
}

const mockPayouts: Payout[] = [
  {
    id: 1,
    payoutId: 'PAY-2024-10001',
    vendorName: 'TechStore Inc',
    vendorId: 101,
    amount: 2500.00,
    requestDate: '2024-11-01',
    status: 'pending',
    paymentMethod: 'Bank Transfer',
    accountNumber: '****1234',
  },
  {
    id: 2,
    payoutId: 'PAY-2024-10002',
    vendorName: 'Fashion Hub',
    vendorId: 102,
    amount: 1800.00,
    requestDate: '2024-10-30',
    status: 'approved',
    paymentMethod: 'PayPal',
    accountNumber: 'vendor@fashionhub.com',
  },
  {
    id: 3,
    payoutId: 'PAY-2024-10003',
    vendorName: 'Electronics World',
    vendorId: 103,
    amount: 3200.00,
    requestDate: '2024-10-28',
    status: 'completed',
    paymentMethod: 'Bank Transfer',
    accountNumber: '****5678',
    processedDate: '2024-10-30',
    transactionId: 'TXN-2024-100002',
  },
  {
    id: 4,
    payoutId: 'PAY-2024-10004',
    vendorName: 'Home Goods Co',
    vendorId: 104,
    amount: 950.00,
    requestDate: '2024-10-25',
    status: 'rejected',
    paymentMethod: 'Bank Transfer',
    accountNumber: '****9012',
    notes: 'Insufficient balance verification',
  },
];

const AdminPayoutsPage: React.FC = () => {
  const [payouts, setPayouts] = useState<Payout[]>(mockPayouts);
  const [selectedPayout, setSelectedPayout] = useState<Payout | null>(null);
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

  const handleViewPayout = (payout: Payout) => {
    setSelectedPayout(payout);
    setDrawerVisible(true);
  };

  const handleApprovePayout = (payout: Payout) => {
    Modal.confirm({
      title: 'Approve Payout Request',
      content: `Approve payout of $${payout.amount.toFixed(2)} to ${payout.vendorName}?`,
      okText: 'Approve',
      onOk: () => {
        setPayouts(
          payouts.map((p) =>
            p.id === payout.id ? { ...p, status: 'approved' } : p
          )
        );
        message.success('Payout approved successfully');
      },
    });
  };

  const handleRejectPayout = (payout: Payout) => {
    setSelectedPayout(payout);
    setRejectModalVisible(true);
  };

  const handleConfirmReject = () => {
    if (!rejectionReason.trim()) {
      message.error('Please provide a reason for rejection');
      return;
    }
    if (selectedPayout) {
      setPayouts(
        payouts.map((p) =>
          p.id === selectedPayout.id
            ? { ...p, status: 'rejected', notes: rejectionReason }
            : p
        )
      );
      message.success('Payout rejected');
      setRejectModalVisible(false);
      setRejectionReason('');
    }
  };

  const handleCompletePayout = (payout: Payout) => {
    Modal.confirm({
      title: 'Mark as Completed',
      content: `Mark payout of $${payout.amount.toFixed(2)} to ${payout.vendorName} as completed?`,
      okText: 'Complete',
      onOk: () => {
        setPayouts(
          payouts.map((p) =>
            p.id === payout.id
              ? {
                  ...p,
                  status: 'completed',
                  processedDate: new Date().toISOString().split('T')[0],
                  transactionId: `TXN-2024-${Math.floor(Math.random() * 100000)}`,
                }
              : p
          )
        );
        message.success('Payout marked as completed');
      },
    });
  };

  const columns: ColumnsType<Payout> = [
    {
      title: 'Payout ID',
      dataIndex: 'payoutId',
      key: 'payoutId',
      render: (text: string) => <Text strong copyable>{text}</Text>,
    },
    {
      title: 'Vendor',
      key: 'vendor',
      render: (_, record) => (
        <div>
          <Text strong>{record.vendorName}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: 12 }}>
            ID: {record.vendorId}
          </Text>
        </div>
      ),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => (
        <Text strong style={{ color: '#1890ff', fontSize: 16 }}>
          ${amount.toFixed(2)}
        </Text>
      ),
      sorter: (a, b) => a.amount - b.amount,
    },
    {
      title: 'Request Date',
      dataIndex: 'requestDate',
      key: 'requestDate',
      render: (date: string) => new Date(date).toLocaleDateString(),
      sorter: (a, b) => new Date(a.requestDate).getTime() - new Date(b.requestDate).getTime(),
    },
    {
      title: 'Payment Method',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
    },
    {
      title: 'Account',
      dataIndex: 'accountNumber',
      key: 'accountNumber',
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
            onClick={() => handleViewPayout(record)}
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
                onClick={() => handleApprovePayout(record)}
              >
                Approve
              </Button>
              <Button
                type="link"
                size="small"
                danger
                icon={<CloseCircleOutlined />}
                onClick={() => handleRejectPayout(record)}
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
              onClick={() => handleCompletePayout(record)}
            >
              Mark Completed
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const totalPending = payouts
    .filter((p) => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalApproved = payouts
    .filter((p) => p.status === 'approved')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalCompleted = payouts
    .filter((p) => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingCount = payouts.filter((p) => p.status === 'pending').length;

  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>Vendor Payout Management</Title>

      {/* Statistics */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Pending Payouts"
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
              title="Total Paid Out"
              value={totalCompleted}
              precision={2}
              prefix={<DollarOutlined style={{ color: '#722ed1' }} />}
              suffix="USD"
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      <Card>
        {/* Filters */}
        <Space style={{ marginBottom: 16, width: '100%', flexWrap: 'wrap' }}>
          <Input
            placeholder="Search payouts..."
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
          <Select placeholder="Payment Method" style={{ width: 180 }}>
            <Option value="all">All Methods</Option>
            <Option value="bank">Bank Transfer</Option>
            <Option value="paypal">PayPal</Option>
            <Option value="wire">Wire Transfer</Option>
          </Select>
        </Space>

        {/* Payouts Table */}
        <Table
          columns={columns}
          dataSource={payouts}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} payout requests`,
          }}
        />
      </Card>

      {/* Payout Detail Drawer */}
      <Drawer
        title="Payout Details"
        placement="right"
        width={600}
        open={drawerVisible}
        onClose={() => setDrawerVisible(false)}
      >
        {selectedPayout && (
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            <Descriptions title="Payout Information" bordered column={1} size="small">
              <Descriptions.Item label="Payout ID">{selectedPayout.payoutId}</Descriptions.Item>
              <Descriptions.Item label="Vendor">
                {selectedPayout.vendorName} (ID: {selectedPayout.vendorId})
              </Descriptions.Item>
              <Descriptions.Item label="Amount">
                <Text strong style={{ fontSize: 18, color: '#1890ff' }}>
                  ${selectedPayout.amount.toFixed(2)}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="Request Date">
                {new Date(selectedPayout.requestDate).toLocaleDateString()}
              </Descriptions.Item>
              <Descriptions.Item label="Payment Method">
                {selectedPayout.paymentMethod}
              </Descriptions.Item>
              <Descriptions.Item label="Account Number">
                {selectedPayout.accountNumber}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={getStatusColor(selectedPayout.status)}>
                  {selectedPayout.status.toUpperCase()}
                </Tag>
              </Descriptions.Item>
              {selectedPayout.processedDate && (
                <Descriptions.Item label="Processed Date">
                  {new Date(selectedPayout.processedDate).toLocaleDateString()}
                </Descriptions.Item>
              )}
              {selectedPayout.transactionId && (
                <Descriptions.Item label="Transaction ID">
                  <Text copyable>{selectedPayout.transactionId}</Text>
                </Descriptions.Item>
              )}
              {selectedPayout.notes && (
                <Descriptions.Item label="Notes">{selectedPayout.notes}</Descriptions.Item>
              )}
            </Descriptions>

            <Space>
              {selectedPayout.status === 'pending' && (
                <>
                  <Button
                    type="primary"
                    icon={<CheckCircleOutlined />}
                    onClick={() => handleApprovePayout(selectedPayout)}
                  >
                    Approve
                  </Button>
                  <Button
                    danger
                    icon={<CloseCircleOutlined />}
                    onClick={() => handleRejectPayout(selectedPayout)}
                  >
                    Reject
                  </Button>
                </>
              )}
              {selectedPayout.status === 'approved' && (
                <Button
                  type="primary"
                  icon={<CheckCircleOutlined />}
                  onClick={() => handleCompletePayout(selectedPayout)}
                >
                  Mark as Completed
                </Button>
              )}
            </Space>
          </Space>
        )}
      </Drawer>

      {/* Reject Modal */}
      <Modal
        title="Reject Payout Request"
        open={rejectModalVisible}
        onCancel={() => setRejectModalVisible(false)}
        onOk={handleConfirmReject}
        okText="Reject"
        okButtonProps={{ danger: true }}
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <Text>Provide a reason for rejecting this payout request:</Text>
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

export default AdminPayoutsPage;
