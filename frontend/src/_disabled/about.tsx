import React from 'react';
import { Card, Typography, Row, Col, Timeline, Space, Avatar } from 'antd';
import {
  TrophyOutlined,
  TeamOutlined,
  GlobalOutlined,
  RocketOutlined,
  HeartOutlined,
  SafetyOutlined,
} from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

const AboutPage: React.FC = () => {
  const values = [
    {
      icon: <HeartOutlined style={{ fontSize: 32, color: '#ff4d4f' }} />,
      title: 'Customer First',
      description: 'We put our customers at the heart of everything we do.',
    },
    {
      icon: <SafetyOutlined style={{ fontSize: 32, color: '#52c41a' }} />,
      title: 'Trust & Security',
      description: 'Your data and transactions are always safe with us.',
    },
    {
      icon: <RocketOutlined style={{ fontSize: 32, color: '#1890ff' }} />,
      title: 'Innovation',
      description: 'Constantly improving to deliver the best experience.',
    },
    {
      icon: <TeamOutlined style={{ fontSize: 32, color: '#722ed1' }} />,
      title: 'Community',
      description: 'Building connections between buyers and sellers.',
    },
  ];

  const team = [
    { name: 'John Smith', role: 'CEO & Founder', avatar: '' },
    { name: 'Sarah Johnson', role: 'CTO', avatar: '' },
    { name: 'Mike Davis', role: 'Head of Operations', avatar: '' },
    { name: 'Emily Chen', role: 'Head of Marketing', avatar: '' },
  ];

  return (
    <div style={{ padding: 24 }}>
      {/* Hero Section */}
      <Card
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          marginBottom: 32,
          border: 'none',
        }}
      >
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <Title level={1} style={{ color: 'white', marginBottom: 16 }}>
            About GROOW
          </Title>
          <Paragraph style={{ color: 'white', fontSize: 18, maxWidth: 800, margin: '0 auto' }}>
            Building the future of e-commerce by connecting vendors and customers worldwide
          </Paragraph>
        </div>
      </Card>

      {/* Mission & Vision */}
      <Row gutter={[24, 24]} style={{ marginBottom: 48 }}>
        <Col xs={24} md={12}>
          <Card>
            <Title level={3}>Our Mission</Title>
            <Paragraph>
              To empower businesses of all sizes by providing them with a powerful, easy-to-use
              platform to reach customers globally. We believe in democratizing e-commerce and
              making it accessible to everyone.
            </Paragraph>
            <Paragraph>
              Our mission is to create a trusted marketplace where vendors can grow their business
              and customers can find quality products with confidence.
            </Paragraph>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card>
            <Title level={3}>Our Vision</Title>
            <Paragraph>
              To become the world's most trusted and innovative e-commerce platform, where millions
              of vendors and billions of customers connect, transact, and thrive together.
            </Paragraph>
            <Paragraph>
              We envision a future where online commerce is seamless, secure, and sustainable for
              all participants in the ecosystem.
            </Paragraph>
          </Card>
        </Col>
      </Row>

      {/* Stats */}
      <Card style={{ marginBottom: 48, background: '#f5f5f5' }}>
        <Row gutter={[24, 24]} style={{ textAlign: 'center' }}>
          <Col xs={12} sm={6}>
            <TrophyOutlined style={{ fontSize: 48, color: '#faad14', marginBottom: 8 }} />
            <Title level={2} style={{ marginBottom: 0 }}>
              10K+
            </Title>
            <Text type="secondary">Active Vendors</Text>
          </Col>
          <Col xs={12} sm={6}>
            <TeamOutlined style={{ fontSize: 48, color: '#1890ff', marginBottom: 8 }} />
            <Title level={2} style={{ marginBottom: 0 }}>
              1M+
            </Title>
            <Text type="secondary">Happy Customers</Text>
          </Col>
          <Col xs={12} sm={6}>
            <GlobalOutlined style={{ fontSize: 48, color: '#52c41a', marginBottom: 8 }} />
            <Title level={2} style={{ marginBottom: 0 }}>
              100+
            </Title>
            <Text type="secondary">Countries</Text>
          </Col>
          <Col xs={12} sm={6}>
            <RocketOutlined style={{ fontSize: 48, color: '#722ed1', marginBottom: 8 }} />
            <Title level={2} style={{ marginBottom: 0 }}>
              5M+
            </Title>
            <Text type="secondary">Orders Delivered</Text>
          </Col>
        </Row>
      </Card>

      {/* Our Story */}
      <Card style={{ marginBottom: 48 }}>
        <Title level={3} style={{ marginBottom: 24 }}>
          Our Story
        </Title>
        <Timeline>
          <Timeline.Item color="blue">
            <Text strong>2020 - The Beginning</Text>
            <Paragraph style={{ marginTop: 8 }}>
              GROOW was founded with a simple idea: make e-commerce accessible to everyone. Started
              with just 10 vendors and a handful of products.
            </Paragraph>
          </Timeline.Item>
          <Timeline.Item color="green">
            <Text strong>2021 - Rapid Growth</Text>
            <Paragraph style={{ marginTop: 8 }}>
              Reached 1,000 vendors and expanded to 20 countries. Introduced advanced features like
              RFQ and bulk ordering.
            </Paragraph>
          </Timeline.Item>
          <Timeline.Item color="orange">
            <Text strong>2022 - Going Global</Text>
            <Paragraph style={{ marginTop: 8 }}>
              Expanded to 50+ countries with localized payment methods and multi-currency support.
              Crossed 100,000 customers.
            </Paragraph>
          </Timeline.Item>
          <Timeline.Item color="purple">
            <Text strong>2023 - Innovation</Text>
            <Paragraph style={{ marginTop: 8 }}>
              Launched AI-powered product recommendations, advanced analytics for vendors, and
              mobile apps.
            </Paragraph>
          </Timeline.Item>
          <Timeline.Item color="red">
            <Text strong>2024 - Milestone Year</Text>
            <Paragraph style={{ marginTop: 8 }}>
              Reached 10,000 active vendors and 1 million customers. Became one of the fastest-growing
              e-commerce platforms globally.
            </Paragraph>
          </Timeline.Item>
          <Timeline.Item>
            <Text strong>2025 - The Future</Text>
            <Paragraph style={{ marginTop: 8 }}>
              Continuing to innovate with new features, expanding to new markets, and building the
              best e-commerce ecosystem in the world.
            </Paragraph>
          </Timeline.Item>
        </Timeline>
      </Card>

      {/* Our Values */}
      <Title level={3} style={{ marginBottom: 24 }}>
        Our Core Values
      </Title>
      <Row gutter={[24, 24]} style={{ marginBottom: 48 }}>
        {values.map((value, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card style={{ textAlign: 'center', height: '100%' }}>
              <div style={{ marginBottom: 16 }}>{value.icon}</div>
              <Title level={5} style={{ marginBottom: 8 }}>
                {value.title}
              </Title>
              <Text type="secondary">{value.description}</Text>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Leadership Team */}
      <Title level={3} style={{ marginBottom: 24 }}>
        Leadership Team
      </Title>
      <Row gutter={[24, 24]}>
        {team.map((member, index) => (
          <Col xs={24} sm={12} md={6} key={index}>
            <Card style={{ textAlign: 'center' }}>
              <Avatar size={100} icon={<TeamOutlined />} style={{ marginBottom: 16 }} />
              <Title level={5} style={{ marginBottom: 4 }}>
                {member.name}
              </Title>
              <Text type="secondary">{member.role}</Text>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Join Us */}
      <Card style={{ marginTop: 48, textAlign: 'center', background: '#f5f5f5' }}>
        <Title level={4}>Join Our Journey</Title>
        <Paragraph>
          Whether you're a vendor looking to grow your business or a customer searching for quality
          products, we'd love to have you as part of the GROOW family.
        </Paragraph>
        <Space size="large" style={{ marginTop: 16 }}>
          <a href="/register">
            <Text strong style={{ fontSize: 16, color: '#1890ff' }}>
              Start Selling →
            </Text>
          </a>
          <a href="/products">
            <Text strong style={{ fontSize: 16, color: '#1890ff' }}>
              Start Shopping →
            </Text>
          </a>
        </Space>
      </Card>
    </div>
  );
};

export default AboutPage;
