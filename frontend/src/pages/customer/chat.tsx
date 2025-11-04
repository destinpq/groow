import React, { useState, useRef, useEffect } from 'react';
import {
  Card,
  List,
  Input,
  Button,
  Avatar,
  Badge,
  Typography,
  Row,
  Col,
  Space,
  Divider,
  Tag,
  Empty,
  Tooltip,
} from 'antd';
import {
  MessageOutlined,
  SendOutlined,
  UserOutlined,
  ShopOutlined,
  SearchOutlined,
  PaperClipOutlined,
  SmileOutlined,
  MoreOutlined,
  CheckOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';

const { Text, Paragraph } = Typography;
const { TextArea } = Input;

interface Message {
  id: number;
  conversationId: number;
  sender: 'customer' | 'vendor';
  text: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  attachments?: string[];
}

interface Conversation {
  id: number;
  vendorName: string;
  vendorAvatar: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  status: 'online' | 'offline' | 'away';
  productContext?: string;
}

const mockConversations: Conversation[] = [
  {
    id: 1,
    vendorName: 'TechHub Electronics',
    vendorAvatar: 'https://via.placeholder.com/40?text=TH',
    lastMessage: 'Yes, we have that model in stock',
    timestamp: '2024-11-10T10:30:00',
    unreadCount: 2,
    status: 'online',
    productContext: 'Wireless Headphones Pro',
  },
  {
    id: 2,
    vendorName: 'Fashion Boutique',
    vendorAvatar: 'https://via.placeholder.com/40?text=FB',
    lastMessage: 'Thank you for your order!',
    timestamp: '2024-11-09T15:45:00',
    unreadCount: 0,
    status: 'offline',
    productContext: 'Summer Dress Collection',
  },
  {
    id: 3,
    vendorName: 'Home Essentials',
    vendorAvatar: 'https://via.placeholder.com/40?text=HE',
    lastMessage: 'What size are you looking for?',
    timestamp: '2024-11-08T09:20:00',
    unreadCount: 1,
    status: 'away',
    productContext: 'Dining Table Set',
  },
];

const mockMessages: { [key: number]: Message[] } = {
  1: [
    {
      id: 1,
      conversationId: 1,
      sender: 'customer',
      text: 'Hi, do you have the Wireless Headphones Pro in stock?',
      timestamp: '2024-11-10T10:25:00',
      status: 'read',
    },
    {
      id: 2,
      conversationId: 1,
      sender: 'vendor',
      text: 'Hello! Yes, we have that model in stock. It comes in black and white colors.',
      timestamp: '2024-11-10T10:26:00',
      status: 'read',
    },
    {
      id: 3,
      conversationId: 1,
      sender: 'customer',
      text: 'Great! What about warranty?',
      timestamp: '2024-11-10T10:27:00',
      status: 'read',
    },
    {
      id: 4,
      conversationId: 1,
      sender: 'vendor',
      text: 'It comes with a 2-year manufacturer warranty. We also offer extended warranty options.',
      timestamp: '2024-11-10T10:28:00',
      status: 'read',
    },
    {
      id: 5,
      conversationId: 1,
      sender: 'customer',
      text: 'Perfect! Can you ship to New York?',
      timestamp: '2024-11-10T10:29:00',
      status: 'read',
    },
    {
      id: 6,
      conversationId: 1,
      sender: 'vendor',
      text: 'Yes, we have that model in stock',
      timestamp: '2024-11-10T10:30:00',
      status: 'delivered',
    },
  ],
  2: [
    {
      id: 7,
      conversationId: 2,
      sender: 'customer',
      text: 'I just placed an order for the summer dress. When will it ship?',
      timestamp: '2024-11-09T15:40:00',
      status: 'read',
    },
    {
      id: 8,
      conversationId: 2,
      sender: 'vendor',
      text: 'Thank you for your order! It will ship within 24 hours.',
      timestamp: '2024-11-09T15:42:00',
      status: 'read',
    },
    {
      id: 9,
      conversationId: 2,
      sender: 'vendor',
      text: 'You\'ll receive a tracking number via email.',
      timestamp: '2024-11-09T15:45:00',
      status: 'read',
    },
  ],
  3: [
    {
      id: 10,
      conversationId: 3,
      sender: 'customer',
      text: 'I\'m interested in the dining table set',
      timestamp: '2024-11-08T09:15:00',
      status: 'read',
    },
    {
      id: 11,
      conversationId: 3,
      sender: 'vendor',
      text: 'What size are you looking for?',
      timestamp: '2024-11-08T09:20:00',
      status: 'delivered',
    },
  ],
};

const ChatPage: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(conversations[0]);
  const [messages, setMessages] = useState<{ [key: number]: Message[] }>(mockMessages);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, selectedConversation]);

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedConversation) return;

    const newMessage: Message = {
      id: Date.now(),
      conversationId: selectedConversation.id,
      sender: 'customer',
      text: messageInput,
      timestamp: new Date().toISOString(),
      status: 'sent',
    };

    setMessages((prev) => ({
      ...prev,
      [selectedConversation.id]: [...(prev[selectedConversation.id] || []), newMessage],
    }));

    // Update conversation last message
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === selectedConversation.id
          ? { ...conv, lastMessage: messageInput, timestamp: new Date().toISOString() }
          : conv
      )
    );

    setMessageInput('');

    // Simulate vendor response after 2 seconds
    setTimeout(() => {
      const vendorReply: Message = {
        id: Date.now() + 1,
        conversationId: selectedConversation.id,
        sender: 'vendor',
        text: 'Thanks for your message! We\'ll get back to you shortly.',
        timestamp: new Date().toISOString(),
        status: 'delivered',
      };

      setMessages((prev) => ({
        ...prev,
        [selectedConversation.id]: [...(prev[selectedConversation.id] || []), vendorReply],
      }));
    }, 2000);
  };

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    // Mark messages as read
    setConversations((prev) =>
      prev.map((conv) => (conv.id === conversation.id ? { ...conv, unreadCount: 0 } : conv))
    );
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const formatMessageTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.vendorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusIcon = (status: Message['status']) => {
    switch (status) {
      case 'sent':
        return <CheckOutlined style={{ fontSize: 12, color: '#bfbfbf' }} />;
      case 'delivered':
        return (
          <span style={{ position: 'relative', display: 'inline-block' }}>
            <CheckOutlined style={{ fontSize: 12, color: '#1890ff' }} />
            <CheckOutlined style={{ fontSize: 12, color: '#1890ff', position: 'absolute', left: 4 }} />
          </span>
        );
      case 'read':
        return (
          <span style={{ position: 'relative', display: 'inline-block' }}>
            <CheckOutlined style={{ fontSize: 12, color: '#52c41a' }} />
            <CheckOutlined style={{ fontSize: 12, color: '#52c41a', position: 'absolute', left: 4 }} />
          </span>
        );
    }
  };

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <Card style={{ height: 'calc(100vh - 96px)' }}>
        <Row style={{ height: '100%' }}>
          {/* Conversations List */}
          <Col xs={24} sm={8} md={7} style={{ borderRight: '1px solid #f0f0f0', height: '100%' }}>
            <div style={{ padding: '0 16px 16px 0', height: '100%', display: 'flex', flexDirection: 'column' }}>
              <div style={{ marginBottom: 16 }}>
                <Input
                  placeholder="Search conversations..."
                  prefix={<SearchOutlined />}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  allowClear
                />
              </div>
              <div style={{ flex: 1, overflow: 'auto' }}>
                <List
                  dataSource={filteredConversations}
                  renderItem={(conversation) => (
                    <List.Item
                      onClick={() => handleSelectConversation(conversation)}
                      style={{
                        cursor: 'pointer',
                        background: selectedConversation?.id === conversation.id ? '#e6f7ff' : 'transparent',
                        borderRadius: 8,
                        padding: '12px',
                        marginBottom: 8,
                      }}
                    >
                      <List.Item.Meta
                        avatar={
                          <Badge
                            dot
                            status={
                              conversation.status === 'online'
                                ? 'success'
                                : conversation.status === 'away'
                                ? 'warning'
                                : 'default'
                            }
                            offset={[-5, 35]}
                          >
                            <Avatar src={conversation.vendorAvatar} size={48} icon={<ShopOutlined />} />
                          </Badge>
                        }
                        title={
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text strong ellipsis style={{ flex: 1 }}>
                              {conversation.vendorName}
                            </Text>
                            {conversation.unreadCount > 0 && (
                              <Badge count={conversation.unreadCount} style={{ marginLeft: 8 }} />
                            )}
                          </div>
                        }
                        description={
                          <div>
                            <Paragraph
                              ellipsis={{ rows: 1 }}
                              style={{ margin: 0, fontSize: 12 }}
                              type={conversation.unreadCount > 0 ? undefined : 'secondary'}
                            >
                              {conversation.lastMessage}
                            </Paragraph>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                              <Text type="secondary" style={{ fontSize: 11 }}>
                                {formatTimestamp(conversation.timestamp)}
                              </Text>
                              {conversation.productContext && (
                                <Tag style={{ fontSize: 10, padding: '0 4px', margin: 0 }}>
                                  {conversation.productContext.substring(0, 15)}...
                                </Tag>
                              )}
                            </div>
                          </div>
                        }
                      />
                    </List.Item>
                  )}
                />
              </div>
            </div>
          </Col>

          {/* Chat Window */}
          <Col xs={24} sm={16} md={17} style={{ height: '100%' }}>
            {selectedConversation ? (
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%', paddingLeft: 16 }}>
                {/* Chat Header */}
                <div
                  style={{
                    padding: '12px 0',
                    borderBottom: '1px solid #f0f0f0',
                    marginBottom: 16,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Space>
                      <Badge
                        dot
                        status={
                          selectedConversation.status === 'online'
                            ? 'success'
                            : selectedConversation.status === 'away'
                            ? 'warning'
                            : 'default'
                        }
                        offset={[-5, 35]}
                      >
                        <Avatar src={selectedConversation.vendorAvatar} size={40} icon={<ShopOutlined />} />
                      </Badge>
                      <div>
                        <Text strong>{selectedConversation.vendorName}</Text>
                        <div>
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            {selectedConversation.status === 'online'
                              ? 'Online'
                              : selectedConversation.status === 'away'
                              ? 'Away'
                              : 'Offline'}
                          </Text>
                        </div>
                      </div>
                    </Space>
                    <Button type="text" icon={<MoreOutlined />} />
                  </div>
                  {selectedConversation.productContext && (
                    <div style={{ marginTop: 8 }}>
                      <Tag icon={<ShopOutlined />} color="blue">
                        Re: {selectedConversation.productContext}
                      </Tag>
                    </div>
                  )}
                </div>

                {/* Messages */}
                <div style={{ flex: 1, overflow: 'auto', paddingRight: 8 }}>
                  {messages[selectedConversation.id]?.map((message) => (
                    <div
                      key={message.id}
                      style={{
                        display: 'flex',
                        justifyContent: message.sender === 'customer' ? 'flex-end' : 'flex-start',
                        marginBottom: 16,
                      }}
                    >
                      {message.sender === 'vendor' && (
                        <Avatar
                          src={selectedConversation.vendorAvatar}
                          size={32}
                          icon={<ShopOutlined />}
                          style={{ marginRight: 8 }}
                        />
                      )}
                      <div
                        style={{
                          maxWidth: '70%',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: message.sender === 'customer' ? 'flex-end' : 'flex-start',
                        }}
                      >
                        <div
                          style={{
                            background: message.sender === 'customer' ? '#1890ff' : '#f0f0f0',
                            color: message.sender === 'customer' ? 'white' : 'black',
                            padding: '8px 12px',
                            borderRadius: 12,
                            wordBreak: 'break-word',
                          }}
                        >
                          <Text style={{ color: message.sender === 'customer' ? 'white' : 'inherit' }}>
                            {message.text}
                          </Text>
                        </div>
                        <div style={{ marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Text type="secondary" style={{ fontSize: 11 }}>
                            {formatMessageTime(message.timestamp)}
                          </Text>
                          {message.sender === 'customer' && getStatusIcon(message.status)}
                        </div>
                      </div>
                      {message.sender === 'customer' && (
                        <Avatar
                          size={32}
                          icon={<UserOutlined />}
                          style={{ marginLeft: 8, background: '#1890ff' }}
                        />
                      )}
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div style={{ paddingTop: 16, borderTop: '1px solid #f0f0f0' }}>
                  <Space.Compact style={{ width: '100%' }}>
                    <Tooltip title="Attach file">
                      <Button icon={<PaperClipOutlined />} />
                    </Tooltip>
                    <Tooltip title="Emoji">
                      <Button icon={<SmileOutlined />} />
                    </Tooltip>
                    <TextArea
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onPressEnter={(e) => {
                        if (!e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      placeholder="Type a message..."
                      autoSize={{ minRows: 1, maxRows: 4 }}
                      style={{ flex: 1 }}
                    />
                    <Button type="primary" icon={<SendOutlined />} onClick={handleSendMessage}>
                      Send
                    </Button>
                  </Space.Compact>
                  <Text type="secondary" style={{ fontSize: 11, marginTop: 4, display: 'block' }}>
                    Press Enter to send, Shift+Enter for new line
                  </Text>
                </div>
              </div>
            ) : (
              <div
                style={{
                  height: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Empty
                  image={<MessageOutlined style={{ fontSize: 64, color: '#bfbfbf' }} />}
                  description="Select a conversation to start chatting"
                />
              </div>
            )}
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default ChatPage;
