import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Table,
  Tag,
  Button,
  Select,
  Input,
  Modal,
  Form,
  Drawer,
  Space,
  Statistic,
  Alert,
  Avatar,
  List,
  Upload,
  Rate,
  Progress,
  Tabs,
  Badge,
  Divider,
  message,
  Spin,
} from 'antd';
import {
  CustomerServiceOutlined,
  MessageOutlined,
  ClockCircleOutlined,
  UserOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  PhoneOutlined,
  MailOutlined,
  SendOutlined,
  PaperClipOutlined,
  StarOutlined,
  ReloadOutlined,
  DownloadOutlined,
  PlusOutlined,
  SearchOutlined,
  FilterOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { supportAPI } from '@/services/api/support';
import type {
  SupportTicket,
  TicketMessage,
  CreateTicketDto,
  UpdateTicketDto,
  SupportStats,
  KnowledgeBaseArticle,
  TicketFilters,
} from '@/services/api/support';

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;
const { TextArea } = Input;

const CustomerSupportPage: React.FC = () => {
  // State management
  const [loading, setLoading] = useState<boolean>(false);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [stats, setStats] = useState<SupportStats | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [isTicketModalVisible, setIsTicketModalVisible] = useState<boolean>(false);
  const [isMessageDrawerVisible, setIsMessageDrawerVisible] = useState<boolean>(false);
  const [isCreateTicketModalVisible, setIsCreateTicketModalVisible] = useState<boolean>(false);
  const [messages, setMessages] = useState<TicketMessage[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [form] = Form.useForm();
  const [messageForm] = Form.useForm();

  // Fetch data on mount
  useEffect(() => {
    fetchTickets();
    fetchStats();
  }, []);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const filters: TicketFilters = {
        searchTerm: searchQuery || undefined,
        status: statusFilter !== 'all' ? [statusFilter as SupportTicket['status']] : undefined,
        priority: priorityFilter !== 'all' ? [priorityFilter as SupportTicket['priority']] : undefined,
      };
      const response = await supportAPI.getTickets(filters);
      setTickets(response.tickets);
    } catch (error) {
      message.error('Failed to fetch support tickets');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await supportAPI.getSupportStats();
      setStats(response);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const fetchMessages = async (ticketId: number) => {
    try {
      const response = await supportAPI.getTicketMessages(ticketId);
      setMessages(response);
    } catch (error) {
      message.error('Failed to fetch messages');
      console.error(error);
    }
  };

  const handleRefresh = () => {
    fetchTickets();
    fetchStats();
    message.success('Data refreshed');
  };

  const handleExport = async () => {
    try {
      setLoading(true);
      // Since there's no export method in the API, create a simple CSV export
      const csvData = tickets.map(ticket => ({
        ticketNumber: ticket.ticketNumber,
        customer: ticket.customerName,
        subject: ticket.subject,
        category: ticket.category,
        priority: ticket.priority,
        status: ticket.status,
        created: dayjs(ticket.createdAt).format('YYYY-MM-DD HH:mm:ss'),
      }));
      
      const csvContent = [
        Object.keys(csvData[0]).join(','),
        ...csvData.map(row => Object.values(row).join(','))
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `support-tickets-${dayjs().format('YYYY-MM-DD')}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      message.success('Tickets exported successfully');
    } catch (error) {
      message.error('Failed to export tickets');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewTicket = async (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
    setIsTicketModalVisible(true);
    await fetchMessages(ticket.id);
  };

  const handleViewMessages = async (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
    setIsMessageDrawerVisible(true);
    await fetchMessages(ticket.id);
  };

  const handleUpdateTicketStatus = async (ticketId: number, status: SupportTicket['status']) => {
    try {
      await supportAPI.updateTicket(ticketId, { status });
      message.success('Ticket status updated');
      fetchTickets();
      fetchStats();
    } catch (error) {
      message.error('Failed to update ticket status');
      console.error(error);
    }
  };

  const handleAssignTicket = async (ticketId: number, assignedToId: number) => {
    try {
      await supportAPI.assignTicket(ticketId, assignedToId);
      message.success('Ticket assigned successfully');
      fetchTickets();
    } catch (error) {
      message.error('Failed to assign ticket');
      console.error(error);
    }
  };

  const handleSendMessage = async (values: any) => {
    if (!selectedTicket) return;

    try {
      await supportAPI.addTicketMessage({
        ticketId: selectedTicket.id,
        message: values.message,
        isInternal: values.isInternal || false,
        attachments: values.attachments || [],
      });
      message.success('Message sent');
      messageForm.resetFields();
      fetchMessages(selectedTicket.id);
      fetchTickets();
    } catch (error) {
      message.error('Failed to send message');
      console.error(error);
    }
  };

  const handleCreateTicket = async (values: any) => {
    try {
      const ticketData: CreateTicketDto = {
        customerId: values.customerId,
        subject: values.subject,
        description: values.description,
        category: values.category,
        priority: values.priority,
        sourceChannel: values.sourceChannel || 'form',
        tags: values.tags || [],
        relatedOrderId: values.relatedOrderId,
      };

      await supportAPI.createTicket(ticketData);
      message.success('Ticket created successfully');
      setIsCreateTicketModalVisible(false);
      form.resetFields();
      fetchTickets();
      fetchStats();
    } catch (error) {
      message.error('Failed to create ticket');
      console.error(error);
    }
  };

  const handleEscalateTicket = async (ticketId: number, reason: string) => {
    try {
      await supportAPI.escalateTicket(ticketId, reason);
      message.success('Ticket escalated');
      fetchTickets();
    } catch (error) {
      message.error('Failed to escalate ticket');
      console.error(error);
    }
  };

  const ticketColumns: ColumnsType<SupportTicket> = [
    {
      title: 'Ticket #',
      key: 'ticketNumber',
      fixed: 'left',
      width: 120,
      render: (_, record) => (
        <div>
          <Text strong>{record.ticketNumber}</Text>
          {record.isEscalated && (
            <div>
              <Tag color="red">ESCALATED</Tag>
            </div>
          )}
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
      title: 'Subject',
      dataIndex: 'subject',
      key: 'subject',
      ellipsis: true,
      width: 200,
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (category: SupportTicket['category']) => {
        const colors: Record<SupportTicket['category'], string> = {
          shipping: 'blue',
          returns: 'orange',
          payment: 'green',
          general: 'gray',
          technical: 'purple',
          billing: 'cyan',
        };
        return <Tag color={colors[category]}>{category.toUpperCase()}</Tag>;
      },
      filters: [
        { text: 'Shipping', value: 'shipping' },
        { text: 'Returns', value: 'returns' },
        { text: 'Payment', value: 'payment' },
        { text: 'General', value: 'general' },
        { text: 'Technical', value: 'technical' },
        { text: 'Billing', value: 'billing' },
      ],
      onFilter: (value, record) => record.category === value,
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority: SupportTicket['priority']) => {
        const config: Record<SupportTicket['priority'], { color: string; icon: React.ReactNode }> = {
          low: { color: 'default', icon: <ClockCircleOutlined /> },
          medium: { color: 'blue', icon: <ClockCircleOutlined /> },
          high: { color: 'orange', icon: <ExclamationCircleOutlined /> },
          urgent: { color: 'red', icon: <ExclamationCircleOutlined /> },
        };
        return (
          <Tag color={config[priority].color} icon={config[priority].icon}>
            {priority.toUpperCase()}
          </Tag>
        );
      },
      sorter: (a, b) => {
        const order: Record<SupportTicket['priority'], number> = { low: 1, medium: 2, high: 3, urgent: 4 };
        return order[a.priority] - order[b.priority];
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: SupportTicket['status']) => {
        const config: Record<SupportTicket['status'], { color: string; icon: React.ReactNode }> = {
          open: { color: 'orange', icon: <ClockCircleOutlined /> },
          'in-progress': { color: 'blue', icon: <ClockCircleOutlined /> },
          resolved: { color: 'green', icon: <CheckCircleOutlined /> },
          closed: { color: 'default', icon: <CheckCircleOutlined /> },
          escalated: { color: 'red', icon: <ExclamationCircleOutlined /> },
        };
        return (
          <Tag color={config[status].color} icon={config[status].icon}>
            {status.replace('-', ' ').toUpperCase()}
          </Tag>
        );
      },
      filters: [
        { text: 'Open', value: 'open' },
        { text: 'In Progress', value: 'in-progress' },
        { text: 'Resolved', value: 'resolved' },
        { text: 'Closed', value: 'closed' },
        { text: 'Escalated', value: 'escalated' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Assigned To',
      dataIndex: 'assignedTo',
      key: 'assignedTo',
      render: (assignedTo) => assignedTo ? <Text>{assignedTo}</Text> : <Text type="secondary">Unassigned</Text>,
    },
    {
      title: 'Messages',
      dataIndex: 'messagesCount',
      key: 'messagesCount',
      render: (count) => <Badge count={count} color="blue" />,
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => <Text type="secondary">{dayjs(date).format('MMM DD, YYYY')}</Text>,
      sorter: (a, b) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      width: 200,
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewTicket(record)}
          >
            View Details
          </Button>
          <Button
            type="link"
            size="small"
            icon={<MessageOutlined />}
            onClick={() => handleViewMessages(record)}
          >
            Messages ({record.messagesCount})
          </Button>
          {record.status === 'open' && (
            <Button
              type="primary"
              size="small"
              onClick={() => handleUpdateTicketStatus(record.id, 'in-progress')}
            >
              Start Work
            </Button>
          )}
          {record.status === 'in-progress' && (
            <Button
              type="primary"
              size="small"
              onClick={() => handleUpdateTicketStatus(record.id, 'resolved')}
            >
              Resolve
            </Button>
          )}
          {record.status !== 'escalated' && record.priority !== 'urgent' && (
            <Button
              danger
              size="small"
              onClick={() => handleEscalateTicket(record.id, 'Needs immediate attention')}
            >
              Escalate
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const pendingTickets = stats?.openTickets || tickets.filter(t => t.status === 'open').length;
  const inProgressTickets = stats?.inProgressTickets || tickets.filter(t => t.status === 'in-progress').length;
  const resolvedToday = stats?.resolvedTickets || 0;
  const avgResponseTime = stats?.avgResponseTime || 0;

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={3}>
          <CustomerServiceOutlined style={{ color: '#1890ff' }} /> Customer Support
        </Title>
        <Paragraph type="secondary">
          Manage support tickets, customer communications, and help desk operations
        </Paragraph>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Open Tickets"
              value={pendingTickets}
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
              prefix={<ClockCircleOutlined />}
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
              suffix="hrs"
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Filters and Actions */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={16} align="middle">
          <Col xs={24} sm={8} md={6}>
            <Search
              placeholder="Search tickets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onSearch={fetchTickets}
              enterButton={<SearchOutlined />}
            />
          </Col>
          <Col xs={12} sm={4}>
            <Select
              placeholder="Status"
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: '100%' }}
            >
              <Select.Option value="all">All Status</Select.Option>
              <Select.Option value="open">Open</Select.Option>
              <Select.Option value="in-progress">In Progress</Select.Option>
              <Select.Option value="resolved">Resolved</Select.Option>
              <Select.Option value="closed">Closed</Select.Option>
              <Select.Option value="escalated">Escalated</Select.Option>
            </Select>
          </Col>
          <Col xs={12} sm={4}>
            <Select
              placeholder="Priority"
              value={priorityFilter}
              onChange={setPriorityFilter}
              style={{ width: '100%' }}
            >
              <Select.Option value="all">All Priority</Select.Option>
              <Select.Option value="urgent">Urgent</Select.Option>
              <Select.Option value="high">High</Select.Option>
              <Select.Option value="medium">Medium</Select.Option>
              <Select.Option value="low">Low</Select.Option>
            </Select>
          </Col>
          <Col xs={24} sm={8} md={6}>
            <Space>
              <Button icon={<ReloadOutlined />} onClick={handleRefresh}>
                Refresh
              </Button>
              <Button icon={<DownloadOutlined />} onClick={handleExport}>
                Export
              </Button>
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={() => setIsCreateTicketModalVisible(true)}
              >
                New Ticket
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Tickets Table */}
      <Card title="Support Tickets">
        <Spin spinning={loading}>
          <Table
            columns={ticketColumns}
            dataSource={tickets}
            rowKey="id"
            scroll={{ x: 1400 }}
            pagination={{ 
              pageSize: 20,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} tickets`,
            }}
          />
        </Spin>
      </Card>

      {/* Ticket Details Modal */}
      <Modal
        title={`Ticket Details - ${selectedTicket?.ticketNumber}`}
        open={isTicketModalVisible}
        onCancel={() => setIsTicketModalVisible(false)}
        width={800}
        footer={null}
      >
        {selectedTicket && (
          <div>
            <Row gutter={16}>
              <Col span={12}>
                <Card size="small" title="Ticket Information">
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <div><Text strong>Subject:</Text> {selectedTicket.subject}</div>
                    <div><Text strong>Customer:</Text> {selectedTicket.customerName}</div>
                    <div><Text strong>Email:</Text> {selectedTicket.customerEmail}</div>
                    <div><Text strong>Category:</Text> <Tag color="blue">{selectedTicket.category}</Tag></div>
                    <div><Text strong>Priority:</Text> <Tag color="orange">{selectedTicket.priority}</Tag></div>
                    <div><Text strong>Status:</Text> <Tag color="green">{selectedTicket.status}</Tag></div>
                    <div><Text strong>Created:</Text> {dayjs(selectedTicket.createdAt).format('YYYY-MM-DD HH:mm')}</div>
                    {selectedTicket.assignedTo && (
                      <div><Text strong>Assigned to:</Text> {selectedTicket.assignedTo}</div>
                    )}
                  </Space>
                </Card>
              </Col>
              <Col span={12}>
                <Card size="small" title="Quick Actions">
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Button 
                      block 
                      type="primary"
                      icon={<MessageOutlined />}
                      onClick={() => handleViewMessages(selectedTicket)}
                    >
                      View Messages ({selectedTicket.messagesCount})
                    </Button>
                    {selectedTicket.status === 'open' && (
                      <Button 
                        block
                        onClick={() => handleUpdateTicketStatus(selectedTicket.id, 'in-progress')}
                      >
                        Start Working
                      </Button>
                    )}
                    {selectedTicket.status === 'in-progress' && (
                      <Button 
                        block
                        type="primary"
                        onClick={() => handleUpdateTicketStatus(selectedTicket.id, 'resolved')}
                      >
                        Mark Resolved
                      </Button>
                    )}
                    <Button 
                      block
                      danger
                      onClick={() => handleEscalateTicket(selectedTicket.id, 'Needs escalation')}
                    >
                      Escalate Ticket
                    </Button>
                  </Space>
                </Card>
              </Col>
            </Row>
            <Card size="small" title="Description" style={{ marginTop: 16 }}>
              <Paragraph>{selectedTicket.description}</Paragraph>
            </Card>
          </div>
        )}
      </Modal>

      {/* Messages Drawer */}
      <Drawer
        title={`Messages - ${selectedTicket?.ticketNumber}`}
        open={isMessageDrawerVisible}
        onClose={() => setIsMessageDrawerVisible(false)}
        width={600}
        footer={
          <Form form={messageForm} onFinish={handleSendMessage} layout="vertical">
            <Form.Item name="message" rules={[{ required: true, message: 'Please enter a message' }]}>
              <TextArea rows={3} placeholder="Type your response..." />
            </Form.Item>
            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit" icon={<SendOutlined />}>
                  Send Message
                </Button>
                <Form.Item name="isInternal" valuePropName="checked" style={{ margin: 0 }}>
                  <Text>Internal Note</Text>
                </Form.Item>
              </Space>
            </Form.Item>
          </Form>
        }
      >
        <List
          dataSource={messages}
          renderItem={(message) => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar icon={message.senderType === 'customer' ? <UserOutlined /> : <CustomerServiceOutlined />} />}
                title={
                  <Space>
                    <Text strong>{message.senderType === 'customer' ? 'Customer' : message.senderName}</Text>
                    {message.isInternal && <Tag color="orange">Internal</Tag>}
                    <Text type="secondary">{dayjs(message.sentAt).format('MMM DD, YYYY HH:mm')}</Text>
                  </Space>
                }
                description={message.message}
              />
            </List.Item>
          )}
        />
      </Drawer>

      {/* Create Ticket Modal */}
      <Modal
        title="Create New Ticket"
        open={isCreateTicketModalVisible}
        onCancel={() => setIsCreateTicketModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleCreateTicket}>
          <Form.Item 
            name="customerId" 
            label="Customer ID" 
            rules={[{ required: true, message: 'Please enter customer ID' }]}
          >
            <Input placeholder="Enter customer ID" />
          </Form.Item>
          
          <Form.Item 
            name="subject" 
            label="Subject" 
            rules={[{ required: true, message: 'Please enter subject' }]}
          >
            <Input placeholder="Enter ticket subject" />
          </Form.Item>
          
          <Form.Item 
            name="description" 
            label="Description" 
            rules={[{ required: true, message: 'Please enter description' }]}
          >
            <TextArea rows={4} placeholder="Describe the issue..." />
          </Form.Item>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item 
                name="category" 
                label="Category" 
                rules={[{ required: true, message: 'Please select category' }]}
              >
                <Select placeholder="Select category">
                  <Select.Option value="shipping">Shipping</Select.Option>
                  <Select.Option value="returns">Returns</Select.Option>
                  <Select.Option value="payment">Payment</Select.Option>
                  <Select.Option value="general">General</Select.Option>
                  <Select.Option value="technical">Technical</Select.Option>
                  <Select.Option value="billing">Billing</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item 
                name="priority" 
                label="Priority" 
                rules={[{ required: true, message: 'Please select priority' }]}
              >
                <Select placeholder="Select priority">
                  <Select.Option value="low">Low</Select.Option>
                  <Select.Option value="medium">Medium</Select.Option>
                  <Select.Option value="high">High</Select.Option>
                  <Select.Option value="urgent">Urgent</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item name="relatedOrderId" label="Related Order ID">
            <Input placeholder="Enter order ID (optional)" />
          </Form.Item>
          
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Create Ticket
              </Button>
              <Button onClick={() => setIsCreateTicketModalVisible(false)}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CustomerSupportPage;