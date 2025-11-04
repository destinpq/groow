import React from 'react';
import { Card, Typography, Row, Col, Input, Button, Space, Collapse, Tag } from 'antd';
import {
  SearchOutlined,
  QuestionCircleOutlined,
  ShoppingOutlined,
  UserOutlined,
  SafetyOutlined,
  RocketOutlined,
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { Panel } = Collapse;

const HelpCenterPage: React.FC = () => {
  const categories = [
    {
      icon: <ShoppingOutlined style={{ fontSize: 32, color: '#1890ff' }} />,
      title: 'Getting Started',
      description: 'Learn the basics of using our platform',
      articles: 12,
    },
    {
      icon: <UserOutlined style={{ fontSize: 32, color: '#52c41a' }} />,
      title: 'Account Management',
      description: 'Manage your account and preferences',
      articles: 8,
    },
    {
      icon: <SafetyOutlined style={{ fontSize: 32, color: '#faad14' }} />,
      title: 'Security & Privacy',
      description: 'Keep your account safe and secure',
      articles: 6,
    },
    {
      icon: <RocketOutlined style={{ fontSize: 32, color: '#722ed1' }} />,
      title: 'Vendor Guide',
      description: 'Resources for sellers on our platform',
      articles: 15,
    },
  ];

  const popularArticles = [
    {
      title: 'How to place an order?',
      views: 2847,
      category: 'Getting Started',
    },
    {
      title: 'Payment methods accepted',
      views: 2134,
      category: 'Getting Started',
    },
    {
      title: 'How to track my order?',
      views: 1923,
      category: 'Getting Started',
    },
    {
      title: 'Return and refund policy',
      views: 1756,
      category: 'Getting Started',
    },
    {
      title: 'How to become a vendor?',
      views: 1542,
      category: 'Vendor Guide',
    },
  ];

  const faqs = [
    {
      question: 'How long does shipping take?',
      answer: 'Standard shipping typically takes 3-5 business days. Express shipping is available for 1-2 day delivery.',
    },
    {
      question: 'What is your return policy?',
      answer: 'We offer a 30-day return policy for most items. Products must be in original condition with tags attached.',
    },
    {
      question: 'Do you ship internationally?',
      answer: 'Yes, we ship to over 100 countries worldwide. Shipping costs and delivery times vary by location.',
    },
    {
      question: 'How can I track my order?',
      answer: 'Once your order ships, you will receive a tracking number via email. You can also track orders from your account dashboard.',
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, debit cards, PayPal, and bank transfers.',
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      {/* Hero Section */}
      <Card style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', marginBottom: 24, border: 'none' }}>
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <QuestionCircleOutlined style={{ fontSize: 64, color: 'white', marginBottom: 16 }} />
          <Title level={1} style={{ color: 'white', marginBottom: 8 }}>
            How can we help you?
          </Title>
          <Text style={{ color: 'white', fontSize: 16, display: 'block', marginBottom: 24 }}>
            Search our knowledge base or browse categories below
          </Text>
          <Input
            size="large"
            placeholder="Search for help articles..."
            prefix={<SearchOutlined />}
            style={{ maxWidth: 600, margin: '0 auto' }}
          />
        </div>
      </Card>

      {/* Categories */}
      <Title level={3} style={{ marginBottom: 16 }}>
        Browse by Category
      </Title>
      <Row gutter={[16, 16]} style={{ marginBottom: 32 }}>
        {categories.map((category, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card hoverable style={{ height: '100%', textAlign: 'center' }}>
              <div style={{ marginBottom: 16 }}>{category.icon}</div>
              <Title level={5} style={{ marginBottom: 8 }}>
                {category.title}
              </Title>
              <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>
                {category.description}
              </Text>
              <Tag color="blue">{category.articles} articles</Tag>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Popular Articles */}
      <Title level={3} style={{ marginBottom: 16 }}>
        Popular Articles
      </Title>
      <Card style={{ marginBottom: 32 }}>
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          {popularArticles.map((article, index) => (
            <div
              key={index}
              style={{
                padding: 16,
                background: '#f5f5f5',
                borderRadius: 8,
                cursor: 'pointer',
                transition: 'all 0.3s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#e6f7ff')}
              onMouseLeave={(e) => (e.currentTarget.style.background = '#f5f5f5')}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <Text strong style={{ fontSize: 16, display: 'block', marginBottom: 4 }}>
                    {article.title}
                  </Text>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {article.category} • {article.views.toLocaleString()} views
                  </Text>
                </div>
                <Button type="link">Read →</Button>
              </div>
            </div>
          ))}
        </Space>
      </Card>

      {/* Quick FAQs */}
      <Title level={3} style={{ marginBottom: 16 }}>
        Quick Answers
      </Title>
      <Card>
        <Collapse accordion ghost>
          {faqs.map((faq, index) => (
            <Panel header={<Text strong>{faq.question}</Text>} key={index}>
              <Paragraph style={{ marginBottom: 0 }}>{faq.answer}</Paragraph>
            </Panel>
          ))}
        </Collapse>
      </Card>

      {/* Contact Support */}
      <Card style={{ marginTop: 32, textAlign: 'center', background: '#f5f5f5' }}>
        <Title level={4}>Still need help?</Title>
        <Text style={{ display: 'block', marginBottom: 16 }}>
          Can't find what you're looking for? Our support team is here to help.
        </Text>
        <Space>
          <Button type="primary" size="large">
            Contact Support
          </Button>
          <Button size="large">Live Chat</Button>
        </Space>
      </Card>
    </div>
  );
};

export default HelpCenterPage;
