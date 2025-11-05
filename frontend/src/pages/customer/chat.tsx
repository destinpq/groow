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
  Spin,
  message as antMessage,
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
import { chatAPI } from '@/services/api/chat';
import type { Conversation, Message } from '@/services/api/chat';

const { Text, Paragraph } = Typography;
const { TextArea } = Input;

const ChatPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.id);
    }
  }, [selectedConversation]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const data = await chatAPI.getConversations();
      setConversations(data);
    } catch (error) {
      antMessage.error('Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    try {
      const response = await chatAPI.getMessages(conversationId);
      setMessages(response.data);
      // Mark conversation as read
      await chatAPI.markAsRead(conversationId);
      // Update local state
      setConversations((prev) =>
        prev.map((conv) => (conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv))
      );
    } catch (error) {
      antMessage.error('Failed to load messages');
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedConversation) return;

    try {
      setSending(true);
      const newMessage = await chatAPI.sendMessage({
        conversationId: selectedConversation.id,
        text: messageInput.trim(),
      });
      
      // Add message to local state
      setMessages((prev) => [...prev, newMessage]);
      
      // Update conversation last message
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === selectedConversation.id
            ? { 
                ...conv, 
                lastMessage: messageInput.trim(), 
                lastMessageAt: newMessage.createdAt,
              }
            : conv
        )
      );

      setMessageInput('');
      antMessage.success('Message sent');
    } catch (error) {
      antMessage.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
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
      (conv.lastMessage || '').toLowerCase().includes(searchQuery.toLowerCase())
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
                              conversation.status === 'active' ? 'success' : 'default'
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
                                {formatTimestamp(conversation.lastMessageAt || conversation.createdAt)}
                              </Text>
                              {conversation.productContext && (
                                <Tag style={{ fontSize: 10, padding: '0 4px', margin: 0 }}>
                                  {conversation.productContext.productName.substring(0, 15)}...
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
                          selectedConversation.status === 'active' ? 'success' : 'default'
                        }
                        offset={[-5, 35]}
                      >
                        <Avatar src={selectedConversation.vendorAvatar} size={40} icon={<ShopOutlined />} />
                      </Badge>
                      <div>
                        <Text strong>{selectedConversation.vendorName}</Text>
                        <div>
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            {selectedConversation.status === 'active' ? 'Active' : 'Archived'}
                          </Text>
                        </div>
                      </div>
                    </Space>
                    <Button type="text" icon={<MoreOutlined />} />
                  </div>
                  {selectedConversation.productContext && (
                    <div style={{ marginTop: 8 }}>
                      <Tag icon={<ShopOutlined />} color="blue">
                        Re: {selectedConversation.productContext.productName}
                      </Tag>
                    </div>
                  )}
                </div>

                {/* Messages */}
                <div style={{ flex: 1, overflow: 'auto', paddingRight: 8 }}>
                  {messages?.map((message) => (
                    <div
                      key={message.id}
                      style={{
                        display: 'flex',
                        justifyContent: message.senderType === 'customer' ? 'flex-end' : 'flex-start',
                        marginBottom: 16,
                      }}
                    >
                      {message.senderType === 'vendor' && (
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
                          alignItems: message.senderType === 'customer' ? 'flex-end' : 'flex-start',
                        }}
                      >
                        <div
                          style={{
                            background: message.senderType === 'customer' ? '#1890ff' : '#f0f0f0',
                            color: message.senderType === 'customer' ? 'white' : 'black',
                            padding: '8px 12px',
                            borderRadius: 12,
                            wordBreak: 'break-word',
                          }}
                        >
                          <Text style={{ color: message.senderType === 'customer' ? 'white' : 'inherit' }}>
                            {message.text}
                          </Text>
                        </div>
                        <div style={{ marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Text type="secondary" style={{ fontSize: 11 }}>
                            {formatMessageTime(message.createdAt)}
                          </Text>
                          {message.senderType === 'customer' && getStatusIcon(message.status)}
                        </div>
                      </div>
                      {message.senderType === 'customer' && (
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
