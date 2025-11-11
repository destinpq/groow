import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Table, Tag, Space, Modal, Form, Input, Select, Upload, message, Badge, Row, Col, Timeline, Avatar, Rate, Divider, Spin, Empty, Tabs, Statistic, Progress, Typography, List, Tooltip, FloatButton } from 'antd';
import { PlusOutlined, MessageOutlined, SearchOutlined, FilterOutlined, FileTextOutlined, ClockCircleOutlined, CheckCircleOutlined, ExclamationCircleOutlined, SendOutlined, PaperClipOutlined, CustomerServiceOutlined, StarOutlined, ReloadOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { supportTicketsAPI, type SupportTicket, type TicketMessage, type CreateTicketRequest, type TicketStats } from '@/services/api/supportTicketsAPI';
import './support-tickets.less';

const { TextArea } = Input;
const { Option } = Select;
const { TabPane } = Tabs;
const { Title, Text } = Typography;

// Support Tickets System with Live Chat Integration
const SupportTicketsSystem: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [stats, setStats] = useState<TicketStats | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [messages, setMessages] = useState<TicketMessage[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [showTicketDetails, setShowTicketDetails] = useState(false);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [chatAvailable, setChatAvailable] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [filters, setFilters] = useState({
    status: undefined,
    priority: undefined,
    category: undefined,
    search: ''
  });

  const [createForm] = Form.useForm();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<any>(null);

  // Load initial data
  useEffect(() => {
    loadTickets();
    loadStats();
    checkChatAvailability();
  }, []);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadTickets = async () => {
    setLoading(true);
    try {
      const response = await supportTicketsAPI.getTickets(filters);
      if (response.success) {
        setTickets(response.data.tickets);
      } else {
        message.error('Failed to load tickets');
      }
    } catch (error) {
      console.error('Error loading tickets:', error);
      message.error('Failed to load tickets');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await supportTicketsAPI.getTicketStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const checkChatAvailability = async () => {
    try {
      const response = await supportTicketsAPI.getChatAvailability();
      if (response.success) {
        setChatAvailable(response.data.available);
      }
    } catch (error) {
      console.error('Error checking chat availability:', error);
    }
  };

  const loadTicketMessages = async (ticketId: string) => {
    setMessagesLoading(true);
    try {
      const response = await supportTicketsAPI.getTicketMessages(ticketId);
      if (response.success) {
        setMessages(response.data);
      } else {
        message.error('Failed to load messages');
      }
    } catch (error) {
      console.error('Error loading messages:', error);
      message.error('Failed to load messages');
    } finally {
      setMessagesLoading(false);
    }
  };

  const handleCreateTicket = async (values: any) => {
    try {
      const ticketData: CreateTicketRequest = {
        subject: values.subject,
        description: values.description,
        category: values.category,
        priority: values.priority,
        orderId: values.orderId
      };

      const response = await supportTicketsAPI.createTicket(ticketData);
      if (response.success) {
        message.success('Support ticket created successfully');
        setShowCreateModal(false);
        createForm.resetFields();
        loadTickets();
        loadStats();
      } else {
        message.error(response.message);
      }
    } catch (error) {
      console.error('Error creating ticket:', error);
      message.error('Failed to create ticket');
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedTicket) return;

    setSendingMessage(true);
    try {
      const response = await supportTicketsAPI.sendMessage(selectedTicket.id, newMessage);
      if (response.success) {
        setMessages([...messages, response.data]);
        setNewMessage('');
        loadTickets(); // Refresh tickets to update last activity
      } else {
        message.error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      message.error('Failed to send message');
    } finally {
      setSendingMessage(false);
    }
  };

  const handleTicketSelect = async (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
    setShowTicketDetails(true);
    await loadTicketMessages(ticket.id);
  };

  const handleSubmitRating = async (ticketId: string, rating: number, feedback?: string) => {
    try {
      const response = await supportTicketsAPI.submitRating(ticketId, rating, feedback);
      if (response.success) {
        message.success('Thank you for your feedback!');
        loadTickets();
      } else {
        message.error('Failed to submit rating');
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
      message.error('Failed to submit rating');
    }
  };

  const getStatusColor = (status: SupportTicket['status']) => {
    const colors = {
      open: 'blue',
      in_progress: 'orange',
      waiting_for_customer: 'purple',
      resolved: 'green',
      closed: 'default'
    };
    return colors[status];
  };

  const getPriorityColor = (priority: SupportTicket['priority']) => {
    const colors = {
      low: 'default',
      medium: 'blue',
      high: 'orange',
      urgent: 'red'
    };
    return colors[priority];
  };

  const ticketColumns = [
    {
      title: 'Ticket #',
      dataIndex: 'ticketNumber',
      key: 'ticketNumber',
      render: (text: string, record: SupportTicket) => (
        <Button type="link" onClick={() => handleTicketSelect(record)}>
          {text}
        </Button>
      )
    },
    {
      title: 'Subject',
      dataIndex: 'subject',
      key: 'subject',
      ellipsis: true
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (category: string) => (
        <Tag>{category.replace('_', ' ').toUpperCase()}</Tag>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: SupportTicket['status']) => (
        <Tag color={getStatusColor(status)}>
          {status.replace('_', ' ').toUpperCase()}
        </Tag>
      )
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority: SupportTicket['priority']) => (
        <Tag color={getPriorityColor(priority)}>
          {priority.toUpperCase()}
        </Tag>
      )
    },
    {
      title: 'Agent',
      dataIndex: 'assignedAgent',
      key: 'assignedAgent',
      render: (agent: SupportTicket['assignedAgent']) => (
        agent ? (
          <Space>
            <Avatar size="small" src={agent.avatar} icon={<CustomerServiceOutlined />} />
            <span>{agent.name}</span>
            <Badge status={agent.isOnline ? 'success' : 'default'} />
          </Space>
        ) : (
          <Text type="secondary">Unassigned</Text>
        )
      )
    },
    {
      title: 'Last Updated',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (date: string) => (
        <Tooltip title={new Date(date).toLocaleString()}>
          {new Date(date).toLocaleDateString()}
        </Tooltip>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: SupportTicket) => (
        <Space>
          <Button 
            size="small" 
            icon={<MessageOutlined />}
            onClick={() => handleTicketSelect(record)}
          >
            View
          </Button>
          {record.status === 'resolved' && !record.satisfactionRating && (
            <Button 
              size="small" 
              icon={<StarOutlined />}
              onClick={() => {
                Modal.confirm({
                  title: 'Rate this support experience',
                  content: (
                    <div>
                      <p>How satisfied are you with the resolution?</p>
                      <Rate onChange={(value) => handleSubmitRating(record.id, value)} />
                    </div>
                  ),
                  okText: 'Submit Rating'
                });
              }}
            >
              Rate
            </Button>
          )}
        </Space>
      )
    }
  ];

  const renderTicketStats = () => (
    <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
      <Col xs={12} sm={6}>
        <Card size="small">
          <Statistic
            title="Total Tickets"
            value={stats?.total || 0}
            prefix={<FileTextOutlined />}
          />
        </Card>
      </Col>
      <Col xs={12} sm={6}>
        <Card size="small">
          <Statistic
            title="Open/In Progress"
            value={(stats?.open || 0) + (stats?.inProgress || 0)}
            prefix={<ClockCircleOutlined />}
            valueStyle={{ color: '#faad14' }}
          />
        </Card>
      </Col>
      <Col xs={12} sm={6}>
        <Card size="small">
          <Statistic
            title="Avg Response Time"
            value={stats?.avgResponseTime || 0}
            suffix="hrs"
            prefix={<ClockCircleOutlined />}
            precision={1}
          />
        </Card>
      </Col>
      <Col xs={12} sm={6}>
        <Card size="small">
          <Statistic
            title="Satisfaction Score"
            value={stats?.satisfactionScore || 0}
            prefix={<StarOutlined />}
            precision={1}
            suffix="/5"
            valueStyle={{ color: '#52c41a' }}
          />
        </Card>
      </Col>
    </Row>
  );

  const renderMessageBubble = (msg: TicketMessage) => {
    const isCustomer = msg.sender.type === 'customer';
    return (
      <div
        key={msg.id}
        style={{
          display: 'flex',
          justifyContent: isCustomer ? 'flex-end' : 'flex-start',
          marginBottom: 16
        }}
      >
        <div style={{ maxWidth: '70%' }}>
          {!isCustomer && (
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
              <Avatar size="small" src={msg.sender.avatar} icon={<CustomerServiceOutlined />} />
              <Text strong style={{ marginLeft: 8 }}>{msg.sender.name}</Text>
              {msg.sender.type === 'agent' && (
                <Tag style={{ marginLeft: 4 }}>Agent</Tag>
              )}
            </div>
          )}
          <div
            style={{
              backgroundColor: isCustomer ? '#1890ff' : '#f0f0f0',
              color: isCustomer ? 'white' : 'black',
              padding: '8px 12px',
              borderRadius: '8px',
              wordBreak: 'break-word'
            }}
          >
            {msg.message}
          </div>
          <div style={{ fontSize: '11px', color: '#999', marginTop: 4, textAlign: isCustomer ? 'right' : 'left' }}>
            {new Date(msg.sentAt).toLocaleString()}
          </div>
        </div>
      </div>
    );
  };

  const renderTicketDetails = () => (
    <Modal
      title={
        <Space>
          <FileTextOutlined />
          {selectedTicket?.ticketNumber} - {selectedTicket?.subject}
        </Space>
      }
      open={showTicketDetails}
      onCancel={() => {
        setShowTicketDetails(false);
        setSelectedTicket(null);
        setMessages([]);
      }}
      width={800}
      footer={null}
    >
      {selectedTicket && (
        <div>
          <Row gutter={16} style={{ marginBottom: 16 }}>
            <Col span={8}>
              <Text strong>Status: </Text>
              <Tag color={getStatusColor(selectedTicket.status)}>
                {selectedTicket.status.replace('_', ' ').toUpperCase()}
              </Tag>
            </Col>
            <Col span={8}>
              <Text strong>Priority: </Text>
              <Tag color={getPriorityColor(selectedTicket.priority)}>
                {selectedTicket.priority.toUpperCase()}
              </Tag>
            </Col>
            <Col span={8}>
              <Text strong>Category: </Text>
              <Tag>{selectedTicket.category.toUpperCase()}</Tag>
            </Col>
          </Row>

          {selectedTicket.assignedAgent && (
            <Card size="small" style={{ marginBottom: 16 }}>
              <Space>
                <Avatar src={selectedTicket.assignedAgent.avatar} icon={<CustomerServiceOutlined />} />
                <div>
                  <Text strong>{selectedTicket.assignedAgent.name}</Text>
                  <br />
                  <Text type="secondary">{selectedTicket.assignedAgent.role}</Text>
                  <Badge 
                    status={selectedTicket.assignedAgent.isOnline ? 'success' : 'default'} 
                    text={selectedTicket.assignedAgent.isOnline ? 'Online' : 'Offline'}
                    style={{ marginLeft: 8 }}
                  />
                </div>
              </Space>
            </Card>
          )}

          <Divider>Conversation</Divider>

          <div style={{ maxHeight: 400, overflowY: 'auto', padding: '0 8px', marginBottom: 16 }}>
            {messagesLoading ? (
              <div style={{ textAlign: 'center', padding: 20 }}>
                <Spin />
              </div>
            ) : messages.length > 0 ? (
              <>
                {messages.map(renderMessageBubble)}
                <div ref={messagesEndRef} />
              </>
            ) : (
              <Empty description="No messages yet" />
            )}
          </div>

          {selectedTicket.status !== 'closed' && selectedTicket.status !== 'resolved' && (
            <div style={{ display: 'flex', gap: 8 }}>
              <Input.TextArea
                ref={messageInputRef}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                autoSize={{ minRows: 2, maxRows: 4 }}
                onPressEnter={(e) => {
                  if (e.shiftKey) return;
                  e.preventDefault();
                  handleSendMessage();
                }}
              />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <Button
                  type="primary"
                  icon={<SendOutlined />}
                  onClick={handleSendMessage}
                  loading={sendingMessage}
                  disabled={!newMessage.trim()}
                >
                  Send
                </Button>
                <Button
                  size="small"
                  icon={<PaperClipOutlined />}
                  title="Attach File"
                >
                  Attach
                </Button>
              </div>
            </div>
          )}

          {selectedTicket.satisfactionRating && (
            <Card size="small" style={{ marginTop: 16, backgroundColor: '#f6ffed' }}>
              <Text strong>Customer Rating: </Text>
              <Rate disabled value={selectedTicket.satisfactionRating.rating} />
              {selectedTicket.satisfactionRating.feedback && (
                <div style={{ marginTop: 8 }}>
                  <Text>"{selectedTicket.satisfactionRating.feedback}"</Text>
                </div>
              )}
            </Card>
          )}
        </div>
      )}
    </Modal>
  );

  const renderCreateTicketModal = () => (
    <Modal
      title="Create New Support Ticket"
      open={showCreateModal}
      onCancel={() => {
        setShowCreateModal(false);
        createForm.resetFields();
      }}
      footer={null}
      width={600}
    >
      <Form
        form={createForm}
        layout="vertical"
        onFinish={handleCreateTicket}
      >
        <Form.Item
          label="Subject"
          name="subject"
          rules={[{ required: true, message: 'Please enter a subject' }]}
        >
          <Input placeholder="Brief description of your issue" />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Category"
              name="category"
              rules={[{ required: true, message: 'Please select a category' }]}
            >
              <Select placeholder="Select category">
                <Option value="general">General Inquiry</Option>
                <Option value="order">Order Issue</Option>
                <Option value="payment">Payment Problem</Option>
                <Option value="technical">Technical Support</Option>
                <Option value="product">Product Question</Option>
                <Option value="account">Account Issue</Option>
                <Option value="shipping">Shipping Problem</Option>
                <Option value="returns">Returns & Refunds</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Priority"
              name="priority"
              rules={[{ required: true, message: 'Please select priority' }]}
            >
              <Select placeholder="Select priority">
                <Option value="low">Low</Option>
                <Option value="medium">Medium</Option>
                <Option value="high">High</Option>
                <Option value="urgent">Urgent</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label="Order ID (optional)"
          name="orderId"
        >
          <Input placeholder="Enter order number if related to an order" />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: 'Please describe your issue' }]}
        >
          <TextArea
            rows={4}
            placeholder="Please provide detailed information about your issue..."
          />
        </Form.Item>

        <Form.Item
          label="Attachments"
          name="attachments"
        >
          <Upload
            multiple
            beforeUpload={() => false}
            fileList={[]}
          >
            <Button icon={<PaperClipOutlined />}>
              Attach Files (Screenshots, Documents)
            </Button>
          </Upload>
        </Form.Item>

        <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
          <Space>
            <Button onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit">
              Create Ticket
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );

  const renderQuickActions = () => (
    <Card size="small" style={{ marginBottom: 16 }}>
      <Space wrap>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setShowCreateModal(true)}
        >
          New Ticket
        </Button>
        <Button
          icon={<MessageOutlined />}
          onClick={() => setShowChatModal(true)}
          disabled={!chatAvailable}
        >
          Live Chat {chatAvailable && <Badge status="success" />}
        </Button>
        <Button
          icon={<ReloadOutlined />}
          onClick={loadTickets}
          loading={loading}
        >
          Refresh
        </Button>
        <Button
          icon={<QuestionCircleOutlined />}
          onClick={() => window.open('/help-center', '_blank')}
        >
          Help Center
        </Button>
      </Space>
    </Card>
  );

  return (
    <div className="support-tickets" style={{ padding: '24px', maxWidth: 1400, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <Title level={2}>
          <CustomerServiceOutlined /> Support Center
        </Title>
        <Text type="secondary">
          Get help with your orders, technical issues, and general inquiries
        </Text>
      </div>

      {/* Stats */}
      {renderTicketStats()}

      {/* Quick Actions */}
      {renderQuickActions()}

      {/* Tickets Table */}
      <Card title="Your Support Tickets">
        <div style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            <Col flex={1}>
              <Input
                placeholder="Search tickets..."
                prefix={<SearchOutlined />}
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                onPressEnter={loadTickets}
              />
            </Col>
            <Col>
              <Space>
                <Select
                  placeholder="Status"
                  allowClear
                  style={{ width: 120 }}
                  value={filters.status}
                  onChange={(value) => setFilters({ ...filters, status: value })}
                >
                  <Option value="open">Open</Option>
                  <Option value="in_progress">In Progress</Option>
                  <Option value="waiting_for_customer">Waiting</Option>
                  <Option value="resolved">Resolved</Option>
                  <Option value="closed">Closed</Option>
                </Select>
                <Select
                  placeholder="Priority"
                  allowClear
                  style={{ width: 100 }}
                  value={filters.priority}
                  onChange={(value) => setFilters({ ...filters, priority: value })}
                >
                  <Option value="low">Low</Option>
                  <Option value="medium">Medium</Option>
                  <Option value="high">High</Option>
                  <Option value="urgent">Urgent</Option>
                </Select>
                <Button icon={<FilterOutlined />} onClick={loadTickets}>
                  Filter
                </Button>
              </Space>
            </Col>
          </Row>
        </div>

        <Table
          columns={ticketColumns}
          dataSource={tickets}
          rowKey="id"
          loading={loading}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `Total ${total} tickets`
          }}
        />
      </Card>

      {/* Modals */}
      {renderCreateTicketModal()}
      {renderTicketDetails()}

      {/* Live Chat Float Button */}
      {chatAvailable && (
        <FloatButton
          icon={<MessageOutlined />}
          type="primary"
          onClick={() => setShowChatModal(true)}
          tooltip="Start Live Chat"
        />
      )}

      {/* Chat Modal */}
      <Modal
        title="Live Chat Support"
        open={showChatModal}
        onCancel={() => setShowChatModal(false)}
        footer={null}
        width={500}
      >
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <CustomerServiceOutlined style={{ fontSize: 48, color: '#1890ff', marginBottom: 16 }} />
          <Title level={4}>Connect with Support</Title>
          <Text>
            Our support agents are ready to help you with any questions or issues.
          </Text>
          <div style={{ margin: '20px 0' }}>
            <Button type="primary" size="large">
              Start Chat Session
            </Button>
          </div>
          <Text type="secondary">
            Average response time: 2 minutes
          </Text>
        </div>
      </Modal>
    </div>
  );
};

export default SupportTicketsSystem;