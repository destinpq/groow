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
  DatePicker,
  message,
  Modal,
  Descriptions,
  Steps,
  Alert,
  InputNumber,
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
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { Step } = Steps;
const { TextArea } = Input;

interface ReturnRequest {
  id: number;
  rmaNumber: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  productName: string;
  sku: string;
  quantity: number;
  reason: string;
  condition: 'unopened' | 'opened' | 'defective' | 'damaged';
  refundAmount: number;
  status: 'pending' | 'approved' | 'rejected' | 'received' | 'inspected' | 'refunded';
  requestDate: string;
  approvedDate: string;
  refundMethod: 'original-payment' | 'store-credit' | 'exchange';
  notes: string;
  images: string[];
}

const mockReturns: ReturnRequest[] = [
  {
    id: 1,
    rmaNumber: 'RMA-2024-001',
    orderNumber: 'ORD-2024-100',
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    productName: 'Wireless Headphones Pro',
    sku: 'ELEC-001',
    quantity: 1,
    reason: 'Product not as described',
    condition: 'unopened',
    refundAmount: 99,
    status: 'pending',
    requestDate: dayjs().subtract(2, 'hours').format('YYYY-MM-DD HH:mm'),
    approvedDate: '',
    refundMethod: 'original-payment',
    notes: 'Customer received wrong color',
    images: [],
  },
  {
    id: 2,
    rmaNumber: 'RMA-2024-002',
    orderNumber: 'ORD-2024-101',
    customerName: 'Jane Smith',
    customerEmail: 'jane@example.com',
    productName: 'Smart Watch Series 5',
    sku: 'ELEC-002',
    quantity: 1,
    reason: 'Defective product',
    condition: 'defective',
    refundAmount: 299,
    status: 'approved',
    requestDate: dayjs().subtract(1, 'day').format('YYYY-MM-DD HH:mm'),
    approvedDate: dayjs().subtract(12, 'hours').format('YYYY-MM-DD HH:mm'),
    refundMethod: 'original-payment',
    notes: 'Screen not working properly',
    images: [],
  },
  {
    id: 3,
    rmaNumber: 'RMA-2024-003',
    orderNumber: 'ORD-2024-102',
    customerName: 'Bob Wilson',
    customerEmail: 'bob@example.com',
    productName: 'Ergonomic Office Chair',
    sku: 'HOME-003',
    quantity: 1,
    reason: 'Changed mind',
    condition: 'opened',
    refundAmount: 449,
    status: 'received',
    requestDate: dayjs().subtract(3, 'days').format('YYYY-MM-DD HH:mm'),
    approvedDate: dayjs().subtract(2, 'days').format('YYYY-MM-DD HH:mm'),
    refundMethod: 'store-credit',
    notes: 'Customer decided to get a different model',
    images: [],
  },
  {
    id: 4,
    rmaNumber: 'RMA-2024-004',
    orderNumber: 'ORD-2024-103',
    customerName: 'Alice Brown',
    customerEmail: 'alice@example.com',
    productName: 'Leather Jacket',
    sku: 'FASH-004',
    quantity: 1,
    reason: 'Wrong size',
    condition: 'unopened',
    refundAmount: 299,
    status: 'refunded',
    requestDate: dayjs().subtract(5, 'days').format('YYYY-MM-DD HH:mm'),
    approvedDate: dayjs().subtract(4, 'days').format('YYYY-MM-DD HH:mm'),
    refundMethod: 'exchange',
    notes: 'Exchanged for size L',
    images: [],
  },
];

const ReturnManagementPage: React.FC = () => {
  const [selectedReturn, setSelectedReturn] = useState<ReturnRequest | null>(null);
  const [isReturnModalVisible, setIsReturnModalVisible] = useState<boolean>(false);
  const [isProcessModalVisible, setIsProcessModalVisible] = useState<boolean>(false);
  const [form] = Form.useForm();

  const handleViewReturn = (returnRequest: ReturnRequest) => {
    setSelectedReturn(returnRequest);
    setIsReturnModalVisible(true);
  };

  const handleApproveReturn = (returnRequest: ReturnRequest) => {
    setSelectedReturn(returnRequest);
    setIsProcessModalVisible(true);
  };

  const handleRejectReturn = (id: number) => {
    Modal.confirm({
      title: 'Reject Return Request',
      content: 'Are you sure you want to reject this return request?',
      onOk: () => {
        message.success('Return request rejected');
      },
    });
  };

  const handleProcessReturn = (values: any) => {
    console.log('Processing return:', values);
    message.success('Return processed successfully');
    setIsProcessModalVisible(false);
    form.resetFields();
  };

  const handleIssueRefund = (returnRequest: ReturnRequest) => {
    message.success(`Refund of $${returnRequest.refundAmount} issued to ${returnRequest.customerName}`);
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
          <Button size="small" type="link" onClick={() => handleViewReturn(record)}>
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
    };
    return steps[status];
  };

  const pendingReturns = mockReturns.filter((r) => r.status === 'pending').length;
  const approvedReturns = mockReturns.filter((r) => r.status === 'approved').length;
  const totalRefunded = mockReturns
    .filter((r) => r.status === 'refunded')
    .reduce((sum, r) => sum + r.refundAmount, 0);
  const avgProcessingTime = 2.5; // days

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

      <Card title="Return Requests">
        <Alert
          message="Return Policy Reminder"
          description="Review return requests within 24 hours. Ensure all defective items are properly documented with photos."
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
        />
        <Table
          columns={returnColumns}
          dataSource={mockReturns}
          rowKey="id"
          scroll={{ x: 1400 }}
          pagination={{ pageSize: 10 }}
        />
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

      <Modal
        title="Process Return"
        open={isProcessModalVisible}
        onCancel={() => setIsProcessModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleProcessReturn}>
          <Alert
            message={`Processing return for: ${selectedReturn?.productName}`}
            description={`RMA Number: ${selectedReturn?.rmaNumber}`}
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
          />

          <Form.Item
            label="Refund Method"
            name="refundMethod"
            rules={[{ required: true, message: 'Please select refund method' }]}
          >
            <Select placeholder="Select refund method">
              <Select.Option value="original-payment">Original Payment Method</Select.Option>
              <Select.Option value="store-credit">Store Credit</Select.Option>
              <Select.Option value="exchange">Exchange for Different Item</Select.Option>
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

          <Form.Item
            label="Restocking Fee"
            name="restockingFee"
            initialValue={0}
          >
            <InputNumber
              prefix="$"
              min={0}
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item label="Internal Notes" name="internalNotes">
            <TextArea rows={3} placeholder="Add any internal notes about this return..." />
          </Form.Item>

          <Form.Item label="Restock Item" name="restock" valuePropName="checked">
            <Select defaultValue="yes">
              <Select.Option value="yes">Yes - Add back to inventory</Select.Option>
              <Select.Option value="no">No - Mark as damaged/defective</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Process Return
              </Button>
              <Button onClick={() => setIsProcessModalVisible(false)}>Cancel</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ReturnManagementPage;
