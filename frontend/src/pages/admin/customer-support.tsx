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
  Upload,
  message,
  Divider,
  Statistic,
  Progress,
} from 'antd';
import {
  QuestionCircleOutlined,
  UserOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  MessageOutlined,
  StarOutlined,
  UploadOutlined,
  SendOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface SupportTicket {
  id: number;
  ticketNumber: string;
  customerName: string;
  subject: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  createdAt: string;
  lastUpdated: string;
  assignedTo: string;
  messages: number;
}

const supportTickets: SupportTicket[] = [
  {
    id: 1,
    ticketNumber: 'TKT-2024-001',
    customerName: 'John Doe',
    subject: 'Order not received',
    category: 'Shipping',
    priority: 'high',
    status: 'in-progress',
    createdAt: dayjs().subtract(2, 'hours').format('YYYY-MM-DD HH:mm'),
    lastUpdated: dayjs().subtract(30, 'minutes').format('YYYY-MM-DD HH:mm'),
    assignedTo: 'Sarah Johnson',
    messages: 3,
  },
  {
    id: 2,
    ticketNumber: 'TKT-2024-002',
    customerName: 'Jane Smith',
    subject: 'Product defect - need replacement',
    category: 'Returns',
    priority: 'medium',
    status: 'open',
    createdAt: dayjs().subtract(5, 'hours').format('YYYY-MM-DD HH:mm'),
    lastUpdated: dayjs().subtract(5, 'hours').format('YYYY-MM-DD HH:mm'),
    assignedTo: 'Unassigned',
    messages: 1,
  },
  {
    id: 3,
    ticketNumber: 'TKT-2024-003',
    customerName: 'Bob Johnson',
    subject: 'Payment not processing',
    category: 'Payment',
    priority: 'urgent',
    status: 'open',
    createdAt: dayjs().subtract(1, 'hour').format('YYYY-MM-DD HH:mm'),
    lastUpdated: dayjs().subtract(1, 'hour').format('YYYY-MM-DD HH:mm'),
    assignedTo: 'Unassigned',
    messages: 1,
  },
  {
    id: 4,
    ticketNumber: 'TKT-2024-004',
    customerName: 'Alice Williams',
    subject: 'How to track my order?',
    category: 'General',
    priority: 'low',
    status: 'resolved',
    createdAt: dayjs().subtract(1, 'day').format('YYYY-MM-DD HH:mm'),
    lastUpdated: dayjs().subtract(3, 'hours').format('YYYY-MM-DD HH:mm'),
    assignedTo: 'Mike Chen',
    messages: 5,
  },
];

const CustomerSupportPage: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [form] = Form.useForm();

  const handleViewTicket = (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
    setIsModalVisible(true);
  };

  const handleReplyTicket = () => {
    message.success('Reply sent successfully!');
    setIsModalVisible(false);
    form.resetFields();
  };

  const ticketColumns: ColumnsType<SupportTicket> = [
    {
      title: 'Ticket #',
      dataIndex: 'ticketNumber',
      key: 'ticketNumber',
      render: (number) => <Text code strong>{number}</Text>,
    },
    {
      title: 'Customer',
      dataIndex: 'customerName',
      key: 'customerName',
      render: (name) => (
        <Space>
          <Avatar icon={<UserOutlined />} size="small" />
          <Text>{name}</Text>
        </Space>
      ),
    },
    {
      title: 'Subject',
      dataIndex: 'subject',
      key: 'subject',
      render: (subject) => <Text strong>{subject}</Text>,
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (category) => <Tag color="blue">{category}</Tag>,
      filters: [
        { text: 'Shipping', value: 'Shipping' },
        { text: 'Returns', value: 'Returns' },
        { text: 'Payment', value: 'Payment' },
        { text: 'General', value: 'General' },
      ],
      onFilter: (value, record) => record.category === value,
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority: SupportTicket['priority']) => {
        const config: Record<SupportTicket['priority'], { color: string; text: string }> = {
          low: { color: 'blue', text: 'LOW' },
          medium: { color: 'orange', text: 'MEDIUM' },
          high: { color: 'red', text: 'HIGH' },
          urgent: { color: 'purple', text: 'URGENT' },
        };
        return <Tag color={config[priority].color}>{config[priority].text}</Tag>;
      },
      filters: [
        { text: 'Low', value: 'low' },
        { text: 'Medium', value: 'medium' },
        { text: 'High', value: 'high' },
        { text: 'Urgent', value: 'urgent' },
      ],
      onFilter: (value, record) => record.priority === value,
      sorter: (a, b) => {
        const priorities = { low: 1, medium: 2, high: 3, urgent: 4 };
        return priorities[a.priority] - priorities[b.priority];
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: SupportTicket['status']) => {
        const config: Record<SupportTicket['status'], { color: string; icon: React.ReactNode; text: string }> = {
          open: { color: 'orange', icon: <ClockCircleOutlined />, text: 'OPEN' },
          'in-progress': { color: 'blue', icon: <ClockCircleOutlined />, text: 'IN PROGRESS' },
          resolved: { color: 'green', icon: <CheckCircleOutlined />, text: 'RESOLVED' },
          closed: { color: 'default', icon: <CheckCircleOutlined />, text: 'CLOSED' },
        };
        const { color, icon, text } = config[status];
        return (
          <Tag color={color} icon={icon}>
            {text}
          </Tag>
        );
      },
      filters: [
        { text: 'Open', value: 'open' },
        { text: 'In Progress', value: 'in-progress' },
        { text: 'Resolved', value: 'resolved' },
        { text: 'Closed', value: 'closed' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Assigned To',
      dataIndex: 'assignedTo',
      key: 'assignedTo',
      render: (assignedTo) => (
        <Tag color={assignedTo === 'Unassigned' ? 'red' : 'green'}>{assignedTo}</Tag>
      ),
    },
    {
      title: 'Messages',
      dataIndex: 'messages',
      key: 'messages',
      render: (count) => (
        <Space>
          <MessageOutlined />
          <Text>{count}</Text>
        </Space>
      ),
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => <Text type="secondary" style={{ fontSize: 12 }}>{date}</Text>,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button size="small" type="primary" onClick={() => handleViewTicket(record)}>
            View
          </Button>
          <Button size="small">Assign</Button>
        </Space>
      ),
    },
  ];

  const openTickets = supportTickets.filter((t) => t.status === 'open').length;
  const inProgressTickets = supportTickets.filter((t) => t.status === 'in-progress').length;
  const resolvedToday = supportTickets.filter(
    (t) => t.status === 'resolved' && dayjs(t.lastUpdated).isAfter(dayjs().subtract(1, 'day'))
  ).length;
  const avgResponseTime = '2.5 hrs';

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={3}>
          <QuestionCircleOutlined style={{ color: '#1890ff' }} /> Customer Support
        </Title>
        <Paragraph type="secondary">
          Manage support tickets, respond to customer inquiries, and track resolution times
        </Paragraph>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Open Tickets"
              value={openTickets}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="In Progress"
              value={inProgressTickets}
              prefix={<MessageOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Resolved Today"
              value={resolvedToday}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Avg Response Time"
              value={avgResponseTime}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col xs={24} lg={16}>
          <Card title="Support Tickets">
            <Table
              columns={ticketColumns}
              dataSource={supportTickets}
              rowKey="id"
              pagination={{ pageSize: 10 }}
              scroll={{ x: 1200 }}
            />
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title="Create New Ticket" style={{ marginBottom: 16 }}>
            <Form layout="vertical">
              <Form.Item label="Customer" name="customer" rules={[{ required: true }]}>
                <Select placeholder="Select customer">
                  <Option value="1">John Doe</Option>
                  <Option value="2">Jane Smith</Option>
                  <Option value="3">Bob Johnson</Option>
                </Select>
              </Form.Item>
              <Form.Item label="Category" name="category" rules={[{ required: true }]}>
                <Select placeholder="Select category">
                  <Option value="shipping">Shipping</Option>
                  <Option value="returns">Returns</Option>
                  <Option value="payment">Payment</Option>
                  <Option value="general">General</Option>
                </Select>
              </Form.Item>
              <Form.Item label="Priority" name="priority" rules={[{ required: true }]}>
                <Select placeholder="Select priority">
                  <Option value="low">Low</Option>
                  <Option value="medium">Medium</Option>
                  <Option value="high">High</Option>
                  <Option value="urgent">Urgent</Option>
                </Select>
              </Form.Item>
              <Form.Item label="Subject" name="subject" rules={[{ required: true }]}>
                <Input placeholder="Enter ticket subject" />
              </Form.Item>
              <Form.Item label="Description" name="description" rules={[{ required: true }]}>
                <TextArea rows={4} placeholder="Describe the issue" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" block>
                  Create Ticket
                </Button>
              </Form.Item>
            </Form>
          </Card>

          <Card title="Quick Stats">
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <Text>Resolution Rate</Text>
                  <Text strong>85%</Text>
                </div>
                <Progress percent={85} strokeColor="#52c41a" />
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <Text>Customer Satisfaction</Text>
                  <Text strong>4.6/5</Text>
                </div>
                <Rate disabled defaultValue={4.6} allowHalf />
              </div>
              <Divider style={{ margin: '12px 0' }} />
              <div>
                <Text type="secondary">Top Categories</Text>
                <div style={{ marginTop: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <Text>Shipping</Text>
                    <Tag>35%</Tag>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <Text>Returns</Text>
                    <Tag>28%</Tag>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <Text>Payment</Text>
                    <Tag>22%</Tag>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text>General</Text>
                    <Tag>15%</Tag>
                  </div>
                </div>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>

      <Modal
        title={`Ticket: ${selectedTicket?.ticketNumber}`}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        width={700}
        footer={null}
      >
        {selectedTicket && (
          <Space direction="vertical" style={{ width: '100%' }} size="middle">
            <div>
              <Row gutter={16}>
                <Col span={12}>
                  <Text type="secondary">Customer:</Text>
                  <div>
                    <Space>
                      <Avatar icon={<UserOutlined />} />
                      <Text strong>{selectedTicket.customerName}</Text>
                    </Space>
                  </div>
                </Col>
                <Col span={12}>
                  <Text type="secondary">Status:</Text>
                  <div>
                    <Tag color="blue">{selectedTicket.status.toUpperCase()}</Tag>
                  </div>
                </Col>
              </Row>
            </div>

            <div>
              <Text type="secondary">Subject:</Text>
              <div>
                <Text strong style={{ fontSize: 16 }}>{selectedTicket.subject}</Text>
              </div>
            </div>

            <div>
              <Text type="secondary">Category:</Text>
              <div>
                <Tag color="blue">{selectedTicket.category}</Tag>
                <Tag color="red">{selectedTicket.priority.toUpperCase()}</Tag>
              </div>
            </div>

            <Divider />

            <div>
              <Text strong>Message Thread</Text>
              <Card size="small" style={{ marginTop: 8, background: '#f5f5f5' }}>
                <Text>Customer message content would appear here...</Text>
                <div style={{ marginTop: 8 }}>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {selectedTicket.createdAt}
                  </Text>
                </div>
              </Card>
            </div>

            <Form form={form} onFinish={handleReplyTicket}>
              <Form.Item label="Reply" name="reply" rules={[{ required: true }]}>
                <TextArea rows={4} placeholder="Type your response..." />
              </Form.Item>
              <Form.Item label="Attachments" name="attachments">
                <Upload>
                  <Button icon={<UploadOutlined />}>Upload File</Button>
                </Upload>
              </Form.Item>
              <Form.Item>
                <Space>
                  <Button type="primary" htmlType="submit" icon={<SendOutlined />}>
                    Send Reply
                  </Button>
                  <Select placeholder="Change Status" style={{ width: 150 }}>
                    <Option value="in-progress">In Progress</Option>
                    <Option value="resolved">Resolved</Option>
                    <Option value="closed">Closed</Option>
                  </Select>
                </Space>
              </Form.Item>
            </Form>
          </Space>
        )}
      </Modal>
    </div>
  );
};

export default CustomerSupportPage;
