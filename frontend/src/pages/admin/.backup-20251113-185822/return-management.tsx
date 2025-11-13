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
  DatePicker,
  message,
  Modal,
  Descriptions,
  Steps,
  Alert,
  InputNumber,
  Spin,
} from 'antd';
import {
  RollbackOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  ShoppingOutlined,
  UserOutlined,
  InboxOutlined,
  WarningOutlined,
  ReloadOutlined,
  DownloadOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { returnsAPI } from '@/services/api/returns';
import type {
  ReturnRequest,
  ReturnStats,
  UpdateReturnRequestDto,
  InspectionDto,
  RefundDto,
} from '@/services/api/returns';

const { Title, Text, Paragraph} = Typography;
const { Step } = Steps;
const { TextArea } = Input;

const ReturnManagementPage: React.FC = () => {
  // State management
  const [loading, setLoading] = useState<boolean>(false);
  const [returns, setReturns] = useState<ReturnRequest[]>([]);
  const [stats, setStats] = useState<ReturnStats | null>(null);
  const [selectedReturn, setSelectedReturn] = useState<ReturnRequest | null>(null);
  const [isReturnModalVisible, setIsReturnModalVisible] = useState<boolean>(false);
  const [isProcessModalVisible, setIsProcessModalVisible] = useState<boolean>(false);
  const [isInspectionModalVisible, setIsInspectionModalVisible] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [inspectionForm] = Form.useForm();

  // Fetch returns on mount
  useEffect(() => {
    fetchReturns();
    fetchStats();
  }, []);

  const fetchReturns = async () => {
    setLoading(true);
    try {
      const response = await returnsAPI.getReturnRequests({ limit: 100 });
      setReturns(response.data.returns);
    } catch (error) {
      message.error('Failed to fetch return requests');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await returnsAPI.getReturnStats();
      setStats(Array.isArray(response?.data?.data) ? response.data.data : (Array.isArray(response?.data) ? response.data : []));
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const handleRefresh = () => {
    fetchReturns();
    fetchStats();
    message.success('Data refreshed');
  };

  const handleExport = async () => {
    try {
      setLoading(true);
      const response = await returnsAPI.exportReturns({}, 'csv');
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `returns-${dayjs().format('YYYY-MM-DD')}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      message.success('Returns exported successfully');
    } catch (error) {
      message.error('Failed to export returns');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewReturn = async (returnRequest: ReturnRequest) => {
    setSelectedReturn(returnRequest);
    setIsReturnModalVisible(true);
  };

  const handleApproveReturn = async (returnRequest: ReturnRequest) => {
    try {
      await returnsAPI.approveReturn(returnRequest.id, 'Admin');
      message.success('Return request approved');
      fetchReturns();
      fetchStats();
    } catch (error) {
      message.error('Failed to approve return');
      console.error(error);
    }
  };

  const handleRejectReturn = (id: string) => {
    Modal.confirm({
      title: 'Reject Return Request',
      content: 'Are you sure you want to reject this return request? Please provide a reason.',
      onOk: async () => {
        try {
          await returnsAPI.rejectReturn(id, 'Return policy violation', 'Admin');
          message.success('Return request rejected');
          fetchReturns();
          fetchStats();
        } catch (error) {
          message.error('Failed to reject return');
          console.error(error);
        }
      },
    });
  };

  const handleProcessInspection = (returnRequest: ReturnRequest) => {
    setSelectedReturn(returnRequest);
    setIsInspectionModalVisible(true);
  };

  const handleInspectionSubmit = async (values: any) => {
    if (!selectedReturn) return;

    try {
      const inspectionData: InspectionDto = {
        returnId: selectedReturn.id,
        condition: values.condition,
        approved: values.approved,
        refundAmount: values.refundAmount,
        restockingFee: values.restockingFee || 0,
        notes: values.notes || '',
        inspectedBy: 'Admin',
      };

      await returnsAPI.inspectReturn(selectedReturn.id, inspectionData);
      message.success('Return inspected successfully');
      setIsInspectionModalVisible(false);
      inspectionForm.resetFields();
      fetchReturns();
      fetchStats();
    } catch (error) {
      message.error('Failed to process inspection');
      console.error(error);
    }
  };

  const handleIssueRefund = async (returnRequest: ReturnRequest) => {
    try {
      const refundData: RefundDto = {
        returnId: returnRequest.id,
        refundAmount: returnRequest.refundAmount,
        refundMethod: returnRequest.refundMethod,
        refundedBy: 'Admin',
      };

      await returnsAPI.processRefund(refundData);
      message.success(`Refund of $${returnRequest.refundAmount} issued to ${returnRequest.customerName}`);
      fetchReturns();
      fetchStats();
    } catch (error) {
      message.error('Failed to process refund');
      console.error(error);
    }
  };

  const handleMarkAsReceived = async (returnRequest: ReturnRequest) => {
    try {
      await returnsAPI.markAsReceived(returnRequest.id, 'Admin');
      message.success('Return marked as received');
      fetchReturns();
    } catch (error) {
      message.error('Failed to mark as received');
      console.error(error);
    }
  };

  const returnColumns: ColumnsType<ReturnRequest> = [
    {
      title: 'RMA Number',
      key: 'rma',
      fixed: 'left',
      width: 150,
      render: (_, record) => (
        <div>
          <Text strong>{record.rmaNumber}</Text>
          <div>
            <Text type="secondary" style={{ fontSize: 11 }}>{record.orderNumber}</Text>
          </div>
        </div>
      ),
    },
    {
      title: 'Customer',
      key: 'customer',
      width: 180,
      render: (_, record) => (
        <div>
          <Text strong>{record.customerName}</Text>
          <div>
            <Text type="secondary" style={{ fontSize: 11 }}>{record.customerEmail}</Text>
          </div>
        </div>
      ),
    },
    {
      title: 'Product',
      key: 'product',
      width: 200,
      render: (_, record) => (
        <div>
          <Text>{record.productName}</Text>
          <div>
            <Text type="secondary" style={{ fontSize: 11 }}>SKU: {record.sku}</Text>
          </div>
          <Tag style={{ fontSize: 10, marginTop: 4 }}>Qty: {record.quantity}</Tag>
        </div>
      ),
    },
    {
      title: 'Reason',
      key: 'reason',
      width: 150,
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text>{record.reason}</Text>
          <Tag
            color={
              record.condition === 'unopened'
                ? 'green'
                : record.condition === 'defective'
                ? 'red'
                : 'orange'
            }
            style={{ fontSize: 10 }}
          >
            {record.condition}
          </Tag>
        </Space>
      ),
    },
    {
      title: 'Refund Amount',
      dataIndex: 'refundAmount',
      key: 'refundAmount',
      render: (amount) => <Text strong>${amount}</Text>,
      sorter: (a, b) => a.refundAmount - b.refundAmount,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: ReturnRequest['status']) => {
        const config: Record<ReturnRequest['status'], { color: string; icon: React.ReactNode; text: string }> = {
          pending: { color: 'orange', icon: <ClockCircleOutlined />, text: 'Pending Review' },
          approved: { color: 'blue', icon: <CheckCircleOutlined />, text: 'Approved' },
          rejected: { color: 'red', icon: <CloseCircleOutlined />, text: 'Rejected' },
          received: { color: 'cyan', icon: <InboxOutlined />, text: 'Received' },
          inspected: { color: 'purple', icon: <CheckCircleOutlined />, text: 'Inspected' },
          refunded: { color: 'green', icon: <DollarOutlined />, text: 'Refunded' },
          completed: { color: 'green', icon: <CheckCircleOutlined />, text: 'Completed' },
          cancelled: { color: 'red', icon: <CloseCircleOutlined />, text: 'Cancelled' },
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
        { text: 'Received', value: 'received' },
        { text: 'Refunded', value: 'refunded' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Request Date',
      dataIndex: 'requestDate',
      key: 'requestDate',
      render: (date) => <Text type="secondary" style={{ fontSize: 12 }}>{date}</Text>,
      sorter: (a, b) => dayjs(a.requestDate).unix() - dayjs(b.requestDate).unix(),
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      width: 200,
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <Button
            size="small"
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleViewReturn(record)}
          >
            View Details
          </Button>
          {record.status === 'pending' && (
            <Space size="small">
              <Button
                size="small"
                type="primary"
                icon={<CheckCircleOutlined />}
                onClick={() => handleApproveReturn(record)}
              >
                Approve
              </Button>
              <Button
                size="small"
                danger
                icon={<CloseCircleOutlined />}
                onClick={() => handleRejectReturn(record.id)}
              >
                Reject
              </Button>
            </Space>
          )}
          {record.status === 'approved' && (
            <Button
              size="small"
              type="primary"
              icon={<InboxOutlined />}
              onClick={() => handleMarkAsReceived(record)}
            >
              Mark Received
            </Button>
          )}
          {record.status === 'received' && (
            <Button
              size="small"
              type="primary"
              icon={<CheckCircleOutlined />}
              onClick={() => handleProcessInspection(record)}
            >
              Inspect
            </Button>
          )}
          {record.status === 'inspected' && (
            <Button
              size="small"
              type="primary"
              icon={<DollarOutlined />}
              onClick={() => handleIssueRefund(record)}
            >
              Issue Refund
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const getReturnStep = (status: ReturnRequest['status']): number => {
    const steps: Record<ReturnRequest['status'], number> = {
      pending: 0,
      approved: 1,
      rejected: 0,
      received: 2,
      inspected: 3,
      refunded: 4,
      completed: 4,
      cancelled: 0,
    };
    return steps[status];
  };

  const pendingReturns = stats?.pendingReturns || returns.filter((r) => r.status === 'pending').length;
  const approvedReturns = stats?.approvedReturns || returns.filter((r) => r.status === 'approved').length;
  const totalRefunded = stats?.totalRefundAmount || returns
    .filter((r) => r.status === 'refunded' || r.status === 'completed')
    .reduce((sum, r) => sum + r.refundAmount, 0);
  const avgProcessingTime = 2.5; // days - can be calculated from API

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={3}>
          <RollbackOutlined style={{ color: '#1890ff' }} /> Return Management
        </Title>
        <Paragraph type="secondary">
          Process return requests, manage RMA numbers, and handle refunds
        </Paragraph>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Space direction="vertical" size={0}>
              <Text type="secondary">Pending Returns</Text>
              <Text strong style={{ fontSize: 24, color: '#faad14' }}>
                {pendingReturns}
              </Text>
            </Space>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Space direction="vertical" size={0}>
              <Text type="secondary">Approved Returns</Text>
              <Text strong style={{ fontSize: 24, color: '#1890ff' }}>
                {approvedReturns}
              </Text>
            </Space>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Space direction="vertical" size={0}>
              <Text type="secondary">Total Refunded</Text>
              <Text strong style={{ fontSize: 24, color: '#52c41a' }}>
                ${totalRefunded}
              </Text>
            </Space>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Space direction="vertical" size={0}>
              <Text type="secondary">Avg Processing Time</Text>
              <Text strong style={{ fontSize: 24, color: '#722ed1' }}>
                {avgProcessingTime} days
              </Text>
            </Space>
          </Card>
        </Col>
      </Row>

      <Card
        title="Return Requests"
        extra={
          <Space>
            <Button icon={<ReloadOutlined />} onClick={handleRefresh}>
              Refresh
            </Button>
            <Button icon={<DownloadOutlined />} onClick={handleExport}>
              Export
            </Button>
          </Space>
        }
      >
        <Alert
          message="Return Policy Reminder"
          description="Review return requests within 24 hours. Ensure all defective items are properly documented with photos."
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
        />
        <Spin spinning={loading}>
          <Table
            columns={returnColumns}
            dataSource={returns}
            rowKey="id"
            scroll={{ x: 1400 }}
            pagination={{ pageSize: 10 }}
          />
        </Spin>
      </Card>

      <Modal
        title={`Return Details - ${selectedReturn?.rmaNumber}`}
        open={isReturnModalVisible}
        onCancel={() => setIsReturnModalVisible(false)}
        width={700}
        footer={null}
      >
        {selectedReturn && (
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Steps current={getReturnStep(selectedReturn.status)} size="small">
              <Step title="Requested" icon={<ClockCircleOutlined />} />
              <Step title="Approved" icon={<CheckCircleOutlined />} />
              <Step title="Received" icon={<InboxOutlined />} />
              <Step title="Inspected" icon={<CheckCircleOutlined />} />
              <Step title="Refunded" icon={<DollarOutlined />} />
            </Steps>

            <Descriptions bordered size="small" column={2}>
              <Descriptions.Item label="RMA Number" span={2}>
                <Text strong>{selectedReturn.rmaNumber}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Order Number">
                {selectedReturn.orderNumber}
              </Descriptions.Item>
              <Descriptions.Item label="Request Date">
                {selectedReturn.requestDate}
              </Descriptions.Item>
              <Descriptions.Item label="Customer Name">
                {selectedReturn.customerName}
              </Descriptions.Item>
              <Descriptions.Item label="Customer Email">
                {selectedReturn.customerEmail}
              </Descriptions.Item>
              <Descriptions.Item label="Product" span={2}>
                {selectedReturn.productName} (SKU: {selectedReturn.sku})
              </Descriptions.Item>
              <Descriptions.Item label="Quantity">
                {selectedReturn.quantity}
              </Descriptions.Item>
              <Descriptions.Item label="Condition">
                <Tag
                  color={
                    selectedReturn.condition === 'unopened'
                      ? 'green'
                      : selectedReturn.condition === 'defective'
                      ? 'red'
                      : 'orange'
                  }
                >
                  {selectedReturn.condition}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Return Reason" span={2}>
                {selectedReturn.reason}
              </Descriptions.Item>
              <Descriptions.Item label="Refund Amount">
                <Text strong>${selectedReturn.refundAmount}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Refund Method">
                {selectedReturn.refundMethod === 'original-payment'
                  ? 'Original Payment Method'
                  : selectedReturn.refundMethod === 'store-credit'
                  ? 'Store Credit'
                  : 'Exchange'}
              </Descriptions.Item>
              <Descriptions.Item label="Notes" span={2}>
                {selectedReturn.notes}
              </Descriptions.Item>
              <Descriptions.Item label="Status" span={2}>
                <Tag
                  color={
                    selectedReturn.status === 'pending'
                      ? 'orange'
                      : selectedReturn.status === 'refunded'
                      ? 'green'
                      : 'blue'
                  }
                >
                  {selectedReturn.status.toUpperCase()}
                </Tag>
              </Descriptions.Item>
            </Descriptions>

            {selectedReturn.status === 'pending' && (
              <Space>
                <Button
                  type="primary"
                  icon={<CheckCircleOutlined />}
                  onClick={() => handleApproveReturn(selectedReturn)}
                >
                  Approve Return
                </Button>
                <Button danger icon={<CloseCircleOutlined />}>
                  Reject Return
                </Button>
              </Space>
            )}
          </Space>
        )}
      </Modal>

      {/* Inspection Modal */}
      <Modal
        title="Inspect Return"
        open={isInspectionModalVisible}
        onCancel={() => setIsInspectionModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form form={inspectionForm} layout="vertical" onFinish={handleInspectionSubmit}>
          <Alert
            message={`Inspecting return for: ${selectedReturn?.productName}`}
            description={`RMA Number: ${selectedReturn?.rmaNumber}`}
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
          />

          <Form.Item
            label="Condition After Inspection"
            name="condition"
            rules={[{ required: true, message: 'Please select condition' }]}
          >
            <Select placeholder="Select condition">
              <Select.Option value="unopened">Unopened</Select.Option>
              <Select.Option value="opened">Opened</Select.Option>
              <Select.Option value="defective">Defective</Select.Option>
              <Select.Option value="damaged">Damaged</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Approve Return?"
            name="approved"
            rules={[{ required: true, message: 'Please select approval status' }]}
          >
            <Select placeholder="Select approval status">
              <Select.Option value={true}>Yes - Approve for Refund</Select.Option>
              <Select.Option value={false}>No - Reject Return</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Refund Amount"
            name="refundAmount"
            initialValue={selectedReturn?.refundAmount}
            rules={[{ required: true, message: 'Please enter refund amount' }]}
          >
            <InputNumber
              prefix="$"
              min={0}
              max={selectedReturn?.refundAmount}
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item label="Restocking Fee" name="restockingFee" initialValue={0}>
            <InputNumber prefix="$" min={0} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            label="Inspection Notes"
            name="notes"
            rules={[{ required: true, message: 'Please add inspection notes' }]}
          >
            <TextArea rows={3} placeholder="Document the condition and any issues found..." />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Complete Inspection
              </Button>
              <Button onClick={() => setIsInspectionModalVisible(false)}>Cancel</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ReturnManagementPage;
