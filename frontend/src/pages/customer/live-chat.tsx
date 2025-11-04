import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Select,
  message,
  List,
  Avatar,
  Tag,
  Divider,
  Alert,
  Popconfirm,
} from 'antd';
import {
  MessageOutlined,
  SendOutlined,
  CustomerServiceOutlined,
  PhoneOutlined,
  MailOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  UserOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

interface SupportTicket {
  id: number;
  ticketNumber: string;
  subject: string;
  category: 'order' | 'product' | 'shipping' | 'refund' | 'technical' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in-progress' | 'waiting-reply' | 'resolved' | 'closed';
  createdAt: string;
  updatedAt: string;
  messages: TicketMessage[];
}

interface TicketMessage {
  id: number;
  sender: 'customer' | 'support';
  senderName: string;
  message: string;
  timestamp: string;
  attachments?: string[];
}

const mockTickets: SupportTicket[] = [
  {
    id: 1,
    ticketNumber: 'TKT-2024-001',
    subject: 'Order not received',
    category: 'shipping',
    priority: 'high',
    status: 'in-progress',
    createdAt: dayjs().subtract(2, 'days').format('YYYY-MM-DD HH:mm'),
    updatedAt: dayjs().subtract(1, 'hour').format('YYYY-MM-DD HH:mm'),
    messages: [
      {
        id: 1,
        sender: 'customer',
        senderName: 'John Doe',
        message: 'I ordered a product 10 days ago but still haven\'t received it. Order #ORD-123456.',
        timestamp: dayjs().subtract(2, 'days').format('YYYY-MM-DD HH:mm'),
      },
      {
        id: 2,
        sender: 'support',
        senderName: 'Support Team',
        message: 'Thank you for contacting us. We are looking into your order status and will update you shortly.',
        timestamp: dayjs().subtract(1, 'day').format('YYYY-MM-DD HH:mm'),
      },
      {
        id: 3,
        sender: 'support',
        senderName: 'Support Team',
        message: 'We have contacted the shipping carrier. Your package is currently in transit and should arrive within 2 business days.',
        timestamp: dayjs().subtract(1, 'hour').format('YYYY-MM-DD HH:mm'),
      },
    ],
  },
  {
    id: 2,
    ticketNumber: 'TKT-2024-002',
    subject: 'Product defect',
    category: 'product',
    priority: 'medium',
    status: 'waiting-reply',
    createdAt: dayjs().subtract(5, 'days').format('YYYY-MM-DD HH:mm'),
    updatedAt: dayjs().subtract(3, 'days').format('YYYY-MM-DD HH:mm'),
    messages: [
      {
        id: 1,
        sender: 'customer',
        senderName: 'John Doe',
        message: 'The headphones I received have a defect in the left speaker.',
        timestamp: dayjs().subtract(5, 'days').format('YYYY-MM-DD HH:mm'),
      },
      {
        id: 2,
        sender: 'support',
        senderName: 'Support Team',
        message: 'We apologize for the inconvenience. We will send you a replacement immediately. Please confirm your shipping address.',
        timestamp: dayjs().subtract(3, 'days').format('YYYY-MM-DD HH:mm'),
      },
    ],
  },
  {
    id: 3,
    ticketNumber: 'TKT-2024-003',
    subject: 'Refund request',
    category: 'refund',
    priority: 'low',
    status: 'resolved',
    createdAt: dayjs().subtract(10, 'days').format('YYYY-MM-DD HH:mm'),
    updatedAt: dayjs().subtract(7, 'days').format('YYYY-MM-DD HH:mm'),
    messages: [
      {
        id: 1,
        sender: 'customer',
        senderName: 'John Doe',
        message: 'I would like to request a refund for order #ORD-123789.',
        timestamp: dayjs().subtract(10, 'days').format('YYYY-MM-DD HH:mm'),
      },
      {
        id: 2,
        sender: 'support',
        senderName: 'Support Team',
        message: 'Your refund has been processed. You should receive it within 5-7 business days.',
        timestamp: dayjs().subtract(7, 'days').format('YYYY-MM-DD HH:mm'),
      },
    ],
  },
];

const LiveChatSupportPage: React.FC = () => {
  const [tickets, setTickets] = useState<SupportTicket[]>(mockTickets);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [isTicketModalVisible, setIsTicketModalVisible] = useState<boolean>(false);
  const [isNewTicketModalVisible, setIsNewTicketModalVisible] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [messageForm] = Form.useForm();
  const [isChatActive, setIsChatActive] = useState<boolean>(false);

  const handleCreateTicket = (values: any) => {
    console.log('Creating ticket:', values);
    message.success('Support ticket created successfully');
    setIsNewTicketModalVisible(false);
    form.resetFields();
  };

  const handleViewTicket = (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
    setIsTicketModalVisible(true);
  };

  const handleSendMessage = (values: any) => {
    if (!selectedTicket) return;

    const newMessage: TicketMessage = {
      id: selectedTicket.messages.length + 1,
      sender: 'customer',
      senderName: 'John Doe',
      message: values.message,
      timestamp: dayjs().format('YYYY-MM-DD HH:mm'),
    };

    const updatedTicket = {
      ...selectedTicket,
      messages: [...selectedTicket.messages, newMessage],
      status: 'waiting-reply' as const,
      updatedAt: dayjs().format('YYYY-MM-DD HH:mm'),
    };

    setSelectedTicket(updatedTicket);
    setTickets(tickets.map((t) => (t.id === updatedTicket.id ? updatedTicket : t)));
    messageForm.resetFields();
    message.success('Message sent');
  };

  const handleCloseTicket = (ticketId: number) => {
    setTickets(tickets.map((t) => (t.id === ticketId ? { ...t, status: 'closed' as const } : t)));
    message.success('Ticket closed');
    setIsTicketModalVisible(false);
  };

  const handleStartLiveChat = () => {
    setIsChatActive(true);
    message.success('Connected to live chat support');
  };

  const getCategoryColor = (category: SupportTicket['category']) => {
    const colors: Record<SupportTicket['category'], string> = {
      order: 'blue',
      product: 'green',
      shipping: 'orange',
      refund: 'red',
      technical: 'purple',
      other: 'default',
    };
    return colors[category];
  };

  const getStatusColor = (status: SupportTicket['status']) => {
    const colors: Record<SupportTicket['status'], string> = {
      open: 'blue',
      'in-progress': 'processing',
      'waiting-reply': 'warning',
      resolved: 'success',
      closed: 'default',
    };
    return colors[status];
  };

  const getPriorityColor = (priority: SupportTicket['priority']) => {
    const colors: Record<SupportTicket['priority'], string> = {
      low: 'default',
      medium: 'blue',
      high: 'orange',
      urgent: 'red',
    };
    return colors[priority];
  };

  const openTickets = tickets.filter((t) => ['open', 'in-progress', 'waiting-reply'].includes(t.status));
  const resolvedTickets = tickets.filter((t) => ['resolved', 'closed'].includes(t.status));

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <div style={{ marginBottom: 24 }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={3}>
              <CustomerServiceOutlined style={{ color: '#1890ff' }} /> Customer Support
            </Title>
            <Paragraph type="secondary">
              Get help from our support team or start a live chat
            </Paragraph>
          </Col>
          <Col>
            <Space>
              <Button
                type="primary"
                icon={<MessageOutlined />}
                size="large"
                onClick={handleStartLiveChat}
              >
                Start Live Chat
              </Button>
              <Button icon={<FileTextOutlined />} onClick={() => setIsNewTicketModalVisible(true)}>
                Create Ticket
              </Button>
            </Space>
          </Col>
        </Row>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card>
            <Space direction="vertical" size={0}>
              <Text type="secondary">Open Tickets</Text>
              <Text strong style={{ fontSize: 24, color: '#1890ff' }}>
                {openTickets.length}
              </Text>
            </Space>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Space direction="vertical" size={0}>
              <Text type="secondary">Avg Response Time</Text>
              <Text strong style={{ fontSize: 24, color: '#52c41a' }}>
                2.5 hours
              </Text>
            </Space>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Space direction="vertical" size={0}>
              <Text type="secondary">Satisfaction Rate</Text>
              <Text strong style={{ fontSize: 24, color: '#722ed1' }}>
                98%
              </Text>
            </Space>
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col xs={24} lg={16}>
          <Card title="Support Tickets">
            <Alert
              message="Need Immediate Help?"
              description="For urgent issues, use our live chat feature or call us at 1-800-SUPPORT"
              type="info"
              showIcon
              style={{ marginBottom: 16 }}
              action={
                <Button size="small" type="primary" onClick={handleStartLiveChat}>
                  Live Chat
                </Button>
              }
            />

            <List
              dataSource={tickets}
              renderItem={(ticket) => (
                <List.Item
                  actions={[
                    <Button type="link" onClick={() => handleViewTicket(ticket)}>
                      View Details
                    </Button>,
                  ]}
                >
                  <List.Item.Meta
                    avatar={<Avatar icon={<FileTextOutlined />} style={{ background: '#1890ff' }} />}
                    title={
                      <Space>
                        <Text strong>{ticket.subject}</Text>
                        <Tag color={getCategoryColor(ticket.category)}>
                          {ticket.category.toUpperCase()}
                        </Tag>
                        <Tag color={getPriorityColor(ticket.priority)}>
                          {ticket.priority.toUpperCase()}
                        </Tag>
                      </Space>
                    }
                    description={
                      <Space direction="vertical" size="small">
                        <Space>
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            Ticket: {ticket.ticketNumber}
                          </Text>
                          <Text type="secondary" style={{ fontSize: 12 }}>•</Text>
                          <Tag color={getStatusColor(ticket.status)} style={{ fontSize: 11 }}>
                            {ticket.status.replace('-', ' ').toUpperCase()}
                          </Tag>
                        </Space>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          Created: {ticket.createdAt} • Updated: {ticket.updatedAt}
                        </Text>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          {ticket.messages.length} message{ticket.messages.length !== 1 ? 's' : ''}
                        </Text>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title="Contact Support" style={{ marginBottom: 16 }}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <div>
                <Space>
                  <PhoneOutlined style={{ fontSize: 20, color: '#1890ff' }} />
                  <div>
                    <Text strong style={{ display: 'block' }}>Phone Support</Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>1-800-SUPPORT</Text>
                    <div>
                      <Text type="secondary" style={{ fontSize: 11 }}>Mon-Fri 9AM-6PM EST</Text>
                    </div>
                  </div>
                </Space>
              </div>

              <div>
                <Space>
                  <MailOutlined style={{ fontSize: 20, color: '#1890ff' }} />
                  <div>
                    <Text strong style={{ display: 'block' }}>Email Support</Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>support@example.com</Text>
                    <div>
                      <Text type="secondary" style={{ fontSize: 11 }}>Response within 24 hours</Text>
                    </div>
                  </div>
                </Space>
              </div>

              <div>
                <Space>
                  <MessageOutlined style={{ fontSize: 20, color: '#1890ff' }} />
                  <div>
                    <Text strong style={{ display: 'block' }}>Live Chat</Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>Available now</Text>
                    <div>
                      <Button
                        type="link"
                        size="small"
                        style={{ padding: 0 }}
                        onClick={handleStartLiveChat}
                      >
                        Start chatting
                      </Button>
                    </div>
                  </div>
                </Space>
              </div>
            </Space>
          </Card>

          <Card title="Common Topics">
            <List
              size="small"
              dataSource={[
                { icon: '📦', title: 'Track My Order', link: '/orders' },
                { icon: '🔄', title: 'Returns & Refunds', link: '/returns' },
                { icon: '💳', title: 'Payment Issues', link: '/help/payment' },
                { icon: '🚚', title: 'Shipping Information', link: '/help/shipping' },
                { icon: '❓', title: 'FAQs', link: '/help/faq' },
              ]}
              renderItem={(item) => (
                <List.Item>
                  <Button type="link" block style={{ textAlign: 'left' }}>
                    {item.icon} {item.title}
                  </Button>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      {/* Ticket Details Modal */}
      <Modal
        title={`Ticket: ${selectedTicket?.ticketNumber}`}
        open={isTicketModalVisible}
        onCancel={() => setIsTicketModalVisible(false)}
        width={700}
        footer={
          selectedTicket && selectedTicket.status !== 'closed' ? (
            <Space>
              <Popconfirm
                title="Are you sure you want to close this ticket?"
                onConfirm={() => handleCloseTicket(selectedTicket.id)}
              >
                <Button>Close Ticket</Button>
              </Popconfirm>
              <Button onClick={() => setIsTicketModalVisible(false)}>Cancel</Button>
            </Space>
          ) : null
        }
      >
        {selectedTicket && (
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div>
              <Space wrap>
                <Tag color={getCategoryColor(selectedTicket.category)}>
                  {selectedTicket.category.toUpperCase()}
                </Tag>
                <Tag color={getPriorityColor(selectedTicket.priority)}>
                  {selectedTicket.priority.toUpperCase()}
                </Tag>
                <Tag color={getStatusColor(selectedTicket.status)}>
                  {selectedTicket.status.replace('-', ' ').toUpperCase()}
                </Tag>
              </Space>
              <Title level={5} style={{ marginTop: 8 }}>{selectedTicket.subject}</Title>
            </div>

            <Divider style={{ margin: 0 }} />

            <div style={{ maxHeight: 400, overflowY: 'auto' }}>
              <List
                dataSource={selectedTicket.messages}
                renderItem={(msg) => (
                  <List.Item style={{ padding: '12px 0' }}>
                    <List.Item.Meta
                      avatar={
                        <Avatar
                          icon={msg.sender === 'customer' ? <UserOutlined /> : <CustomerServiceOutlined />}
                          style={{ background: msg.sender === 'customer' ? '#1890ff' : '#52c41a' }}
                        />
                      }
                      title={
                        <Space>
                          <Text strong>{msg.senderName}</Text>
                          <Text type="secondary" style={{ fontSize: 11 }}>{msg.timestamp}</Text>
                        </Space>
                      }
                      description={
                        <div style={{ marginTop: 4, padding: 12, background: '#f5f5f5', borderRadius: 4 }}>
                          <Paragraph style={{ margin: 0 }}>{msg.message}</Paragraph>
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            </div>

            {selectedTicket.status !== 'closed' && (
              <>
                <Divider style={{ margin: 0 }} />
                <Form form={messageForm} onFinish={handleSendMessage}>
                  <Form.Item
                    name="message"
                    rules={[{ required: true, message: 'Please enter your message' }]}
                  >
                    <TextArea rows={4} placeholder="Type your message..." />
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" htmlType="submit" icon={<SendOutlined />}>
                      Send Message
                    </Button>
                  </Form.Item>
                </Form>
              </>
            )}
          </Space>
        )}
      </Modal>

      {/* New Ticket Modal */}
      <Modal
        title="Create Support Ticket"
        open={isNewTicketModalVisible}
        onCancel={() => setIsNewTicketModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleCreateTicket}>
          <Form.Item
            label="Subject"
            name="subject"
            rules={[{ required: true, message: 'Please enter subject' }]}
          >
            <Input placeholder="Brief description of your issue" />
          </Form.Item>

          <Form.Item
            label="Category"
            name="category"
            rules={[{ required: true, message: 'Please select category' }]}
          >
            <Select placeholder="Select category">
              <Select.Option value="order">Order Issue</Select.Option>
              <Select.Option value="product">Product Question</Select.Option>
              <Select.Option value="shipping">Shipping Issue</Select.Option>
              <Select.Option value="refund">Refund Request</Select.Option>
              <Select.Option value="technical">Technical Support</Select.Option>
              <Select.Option value="other">Other</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Priority"
            name="priority"
            rules={[{ required: true, message: 'Please select priority' }]}
          >
            <Select placeholder="Select priority">
              <Select.Option value="low">Low</Select.Option>
              <Select.Option value="medium">Medium</Select.Option>
              <Select.Option value="high">High</Select.Option>
              <Select.Option value="urgent">Urgent</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: 'Please describe your issue' }]}
          >
            <TextArea rows={6} placeholder="Please provide details about your issue..." />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Create Ticket
              </Button>
              <Button onClick={() => setIsNewTicketModalVisible(false)}>Cancel</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default LiveChatSupportPage;
