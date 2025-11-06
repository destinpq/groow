import React, { useState } from 'react';
import { Card, Row, Col, Typography, Tabs, Table, Button, Space, Alert, Progress, Statistic, Modal, Form, Input, Select, Upload, Tag, Divider, Timeline } from 'antd';
import { CreditCardOutlined, DollarOutlined, FileTextOutlined, BankOutlined, CalendarOutlined, CheckCircleOutlined, ClockCircleOutlined, WarningOutlined, UploadOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

const CreditManagement: React.FC = () => {
  const [creditRequestVisible, setCreditRequestVisible] = useState(false);
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [form] = Form.useForm();

  const creditInfo = {
    creditLimit: 50000,
    creditUsed: 23750,
    creditAvailable: 26250,
    creditUtilization: 47.5,
    paymentTerms: 'Net 30 Days',
    lastPayment: '2025-10-15',
    nextPaymentDue: '2025-11-15',
    overdueAmount: 0,
    creditScore: 'Excellent',
    accountStatus: 'Active',
    interestRate: 2.5,
  };

  const creditHistory = [
    {
      id: 'TXN-001',
      date: '2025-11-05',
      type: 'purchase',
      description: 'Order #ORD-2025-001',
      amount: -2450.00,
      balance: 23750.00,
      status: 'completed',
    },
    {
      id: 'TXN-002',
      date: '2025-11-01',
      type: 'payment',
      description: 'Payment Received',
      amount: +5000.00,
      balance: 26200.00,
      status: 'completed',
    },
    {
      id: 'TXN-003',
      date: '2025-10-28',
      type: 'purchase',
      description: 'Order #ORD-2025-002',
      amount: -1200.00,
      balance: 21200.00,
      status: 'completed',
    },
    {
      id: 'TXN-004',
      date: '2025-10-25',
      type: 'credit_adjustment',
      description: 'Credit Limit Increase',
      amount: +10000.00,
      balance: 22400.00,
      status: 'approved',
    },
  ];

  const creditRequests = [
    {
      id: 'REQ-001',
      date: '2025-11-03',
      requestedAmount: 25000,
      currentLimit: 50000,
      newLimit: 75000,
      reason: 'Business expansion',
      status: 'pending',
      reviewer: 'Credit Department',
    },
    {
      id: 'REQ-002',
      date: '2025-09-15',
      requestedAmount: 10000,
      currentLimit: 40000,
      newLimit: 50000,
      reason: 'Seasonal inventory increase',
      status: 'approved',
      reviewer: 'Sarah Johnson',
    },
  ];

  const invoices = [
    {
      id: 'INV-2025-001',
      orderNumber: 'ORD-2025-001',
      date: '2025-11-05',
      dueDate: '2025-12-05',
      amount: 2450.00,
      status: 'outstanding',
      daysOverdue: 0,
    },
    {
      id: 'INV-2025-002',
      orderNumber: 'ORD-2025-002',
      date: '2025-10-28',
      dueDate: '2025-11-27',
      amount: 1200.00,
      status: 'outstanding',
      daysOverdue: 0,
    },
    {
      id: 'INV-2025-003',
      orderNumber: 'ORD-2025-003',
      date: '2025-10-15',
      dueDate: '2025-11-14',
      amount: 3200.00,
      status: 'paid',
      daysOverdue: 0,
    },
  ];

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'purchase': return '#f5222d';
      case 'payment': return '#52c41a';
      case 'credit_adjustment': return '#1890ff';
      default: return '#000000';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'approved': return 'success';
      case 'pending': return 'processing';
      case 'outstanding': return 'warning';
      case 'paid': return 'success';
      case 'overdue': return 'error';
      default: return 'default';
    }
  };

  const creditHistoryColumns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Transaction',
      key: 'transaction',
      render: (record: any) => (
        <div>
          <Text strong>{record.description}</Text>
          <br />
          <Text type="secondary">ID: {record.id}</Text>
        </div>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        const config = {
          purchase: { color: 'red', text: 'Purchase' },
          payment: { color: 'green', text: 'Payment' },
          credit_adjustment: { color: 'blue', text: 'Credit Adjustment' },
        }[type] || { color: 'default', text: type };
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => (
        <Text style={{ color: getTransactionColor(amount > 0 ? 'payment' : 'purchase'), fontWeight: 'bold' }}>
          {amount > 0 ? '+' : ''}${Math.abs(amount).toLocaleString()}
        </Text>
      ),
    },
    {
      title: 'Balance',
      dataIndex: 'balance',
      key: 'balance',
      render: (balance: number) => `$${balance.toLocaleString()}`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{status.toUpperCase()}</Tag>
      ),
    },
  ];

  const creditRequestColumns = [
    {
      title: 'Request ID',
      dataIndex: 'id',
      key: 'id',
      render: (id: string) => <Text strong>{id}</Text>,
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Current Limit',
      dataIndex: 'currentLimit',
      key: 'currentLimit',
      render: (limit: number) => `$${limit.toLocaleString()}`,
    },
    {
      title: 'Requested Increase',
      dataIndex: 'requestedAmount',
      key: 'requestedAmount',
      render: (amount: number) => `+$${amount.toLocaleString()}`,
    },
    {
      title: 'New Limit',
      dataIndex: 'newLimit',
      key: 'newLimit',
      render: (limit: number) => `$${limit.toLocaleString()}`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{status.toUpperCase()}</Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: any) => (
        <Space>
          <Button size="small">View Details</Button>
          {record.status === 'pending' && (
            <Button size="small" type="link">Cancel</Button>
          )}
        </Space>
      ),
    },
  ];

  const invoiceColumns = [
    {
      title: 'Invoice',
      key: 'invoice',
      render: (record: any) => (
        <div>
          <Text strong>{record.id}</Text>
          <br />
          <Text type="secondary">Order: {record.orderNumber}</Text>
        </div>
      ),
    },
    {
      title: 'Invoice Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => <Text strong>${amount.toLocaleString()}</Text>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{status.toUpperCase()}</Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: any) => (
        <Space>
          <Button size="small" icon={<FileTextOutlined />}>Download</Button>
          {record.status === 'outstanding' && (
            <Button size="small" type="primary" onClick={() => setPaymentModalVisible(true)}>
              Pay Now
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={2}>
          <CreditCardOutlined style={{ marginRight: 8 }} />
          Credit Management
        </Title>
        <Text type="secondary">Phase 5 - B2B enterprise credit and billing</Text>
      </div>

      {/* Credit Overview */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Credit Limit"
              value={creditInfo.creditLimit}
              prefix="$"
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Available Credit"
              value={creditInfo.creditAvailable}
              prefix="$"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Used Credit"
              value={creditInfo.creditUsed}
              prefix="$"
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Utilization"
              value={creditInfo.creditUtilization}
              suffix="%"
              valueStyle={{ color: creditInfo.creditUtilization > 75 ? '#f5222d' : '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Credit Status */}
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={16}>
          <Col span={16}>
            <div style={{ marginBottom: 16 }}>
              <Text strong>Credit Utilization</Text>
              <Progress
                percent={creditInfo.creditUtilization}
                status={creditInfo.creditUtilization > 75 ? 'exception' : 'active'}
                format={() => `$${creditInfo.creditUsed.toLocaleString()} / $${creditInfo.creditLimit.toLocaleString()}`}
                style={{ marginTop: 8 }}
              />
            </div>
            <Row gutter={16}>
              <Col span={8}>
                <div style={{ textAlign: 'center' }}>
                  <BankOutlined style={{ fontSize: 24, color: '#1890ff', marginBottom: 8 }} />
                  <div>
                    <Text type="secondary">Credit Score</Text>
                    <br />
                    <Text strong>{creditInfo.creditScore}</Text>
                  </div>
                </div>
              </Col>
              <Col span={8}>
                <div style={{ textAlign: 'center' }}>
                  <CalendarOutlined style={{ fontSize: 24, color: '#52c41a', marginBottom: 8 }} />
                  <div>
                    <Text type="secondary">Payment Terms</Text>
                    <br />
                    <Text strong>{creditInfo.paymentTerms}</Text>
                  </div>
                </div>
              </Col>
              <Col span={8}>
                <div style={{ textAlign: 'center' }}>
                  <CheckCircleOutlined style={{ fontSize: 24, color: '#52c41a', marginBottom: 8 }} />
                  <div>
                    <Text type="secondary">Account Status</Text>
                    <br />
                    <Tag color="green">{creditInfo.accountStatus}</Tag>
                  </div>
                </div>
              </Col>
            </Row>
          </Col>
          <Col span={8}>
            <div style={{ textAlign: 'center', padding: 20 }}>
              <Title level={4}>Quick Actions</Title>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Button 
                  type="primary" 
                  block 
                  icon={<DollarOutlined />}
                  onClick={() => setCreditRequestVisible(true)}
                >
                  Request Credit Increase
                </Button>
                <Button 
                  block 
                  icon={<CreditCardOutlined />}
                  onClick={() => setPaymentModalVisible(true)}
                >
                  Make Payment
                </Button>
                <Button block icon={<FileTextOutlined />}>
                  Download Statement
                </Button>
              </Space>
            </div>
          </Col>
        </Row>
      </Card>

      {creditInfo.overdueAmount === 0 ? (
        <Alert
          message="Account in Good Standing"
          description="Your account is current with no overdue payments. Keep up the excellent payment history!"
          type="success"
          showIcon
          style={{ marginBottom: 24 }}
          closable
        />
      ) : (
        <Alert
          message="Payment Due"
          description={`You have $${creditInfo.overdueAmount.toLocaleString()} in overdue payments. Please make a payment to avoid service interruption.`}
          type="warning"
          showIcon
          style={{ marginBottom: 24 }}
          action={
            <Button size="small" type="primary" onClick={() => setPaymentModalVisible(true)}>
              Pay Now
            </Button>
          }
        />
      )}

      <Tabs defaultActiveKey="overview">
        <TabPane tab="Account Overview" key="overview">
          <Row gutter={16}>
            <Col span={12}>
              <Card title="Credit Summary">
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text>Credit Limit:</Text>
                    <Text strong>${creditInfo.creditLimit.toLocaleString()}</Text>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text>Used:</Text>
                    <Text>${creditInfo.creditUsed.toLocaleString()}</Text>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text>Available:</Text>
                    <Text strong style={{ color: '#52c41a' }}>${creditInfo.creditAvailable.toLocaleString()}</Text>
                  </div>
                  <Divider style={{ margin: '12px 0' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text>Interest Rate:</Text>
                    <Text>{creditInfo.interestRate}% APR</Text>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text>Last Payment:</Text>
                    <Text>{creditInfo.lastPayment}</Text>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text>Next Due Date:</Text>
                    <Text strong>{creditInfo.nextPaymentDue}</Text>
                  </div>
                </Space>
              </Card>
            </Col>
            <Col span={12}>
              <Card title="Payment Information">
                <Timeline items={[
                  {
                    color: 'green',
                    children: (
                      <div>
                        <Text strong>Last Payment</Text>
                        <br />
                        <Text type="secondary">{creditInfo.lastPayment} - $5,000.00</Text>
                      </div>
                    ),
                  },
                  {
                    color: 'blue',
                    children: (
                      <div>
                        <Text strong>Next Payment Due</Text>
                        <br />
                        <Text type="secondary">{creditInfo.nextPaymentDue} - $3,650.00</Text>
                      </div>
                    ),
                  },
                  {
                    color: 'gray',
                    children: (
                      <div>
                        <Text strong>Auto Payment</Text>
                        <br />
                        <Text type="secondary">Enabled - Bank Account ***1234</Text>
                      </div>
                    ),
                  },
                ]} />
              </Card>
            </Col>
          </Row>
        </TabPane>

        <TabPane tab="Transaction History" key="history">
          <Card title="Credit Account Activity">
            <Table
              columns={creditHistoryColumns}
              dataSource={creditHistory}
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </TabPane>

        <TabPane tab="Credit Requests" key="requests">
          <Card 
            title="Credit Limit Requests"
            extra={
              <Button type="primary" onClick={() => setCreditRequestVisible(true)}>
                New Request
              </Button>
            }
          >
            <Table
              columns={creditRequestColumns}
              dataSource={creditRequests}
              rowKey="id"
              pagination={false}
            />
          </Card>
        </TabPane>

        <TabPane tab="Invoices & Billing" key="invoices">
          <Card title="Outstanding Invoices">
            <Table
              columns={invoiceColumns}
              dataSource={invoices}
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </TabPane>
      </Tabs>

      {/* Credit Request Modal */}
      <Modal
        title="Request Credit Increase"
        visible={creditRequestVisible}
        onCancel={() => setCreditRequestVisible(false)}
        footer={null}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Current Credit Limit" name="currentLimit">
            <Input value={`$${creditInfo.creditLimit.toLocaleString()}`} disabled />
          </Form.Item>
          
          <Form.Item label="Requested Increase Amount" name="requestAmount" rules={[{ required: true }]}>
            <Input prefix="$" placeholder="25,000" />
          </Form.Item>
          
          <Form.Item label="Business Justification" name="reason" rules={[{ required: true }]}>
            <Input.TextArea rows={4} placeholder="Please explain why you need this credit increase..." />
          </Form.Item>
          
          <Form.Item label="Supporting Documentation" name="documents">
            <Upload>
              <Button icon={<UploadOutlined />}>Upload Financial Documents</Button>
            </Upload>
          </Form.Item>
          
          <div style={{ textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setCreditRequestVisible(false)}>Cancel</Button>
              <Button type="primary">Submit Request</Button>
            </Space>
          </div>
        </Form>
      </Modal>

      {/* Payment Modal */}
      <Modal
        title="Make Payment"
        visible={paymentModalVisible}
        onCancel={() => setPaymentModalVisible(false)}
        footer={null}
        width={500}
      >
        <Form layout="vertical">
          <Form.Item label="Payment Amount" rules={[{ required: true }]}>
            <Input prefix="$" placeholder="Enter amount" />
          </Form.Item>
          
          <Form.Item label="Payment Method" rules={[{ required: true }]}>
            <Select placeholder="Select payment method">
              <Option value="bank">Bank Transfer (***1234)</Option>
              <Option value="card">Credit Card (***5678)</Option>
              <Option value="ach">ACH Transfer</Option>
            </Select>
          </Form.Item>
          
          <Form.Item label="Payment Date">
            <Input placeholder="Immediate" disabled />
          </Form.Item>
          
          <div style={{ textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setPaymentModalVisible(false)}>Cancel</Button>
              <Button type="primary">Process Payment</Button>
            </Space>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default CreditManagement;
