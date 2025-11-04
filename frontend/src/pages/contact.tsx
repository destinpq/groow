import React from 'react';
import { Card, Row, Col, Typography, Form, Input, Button, message, Space } from 'antd';
import {
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  CustomerServiceOutlined,
} from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

const ContactPage: React.FC = () => {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log('Contact form:', values);
    message.success('Message sent successfully! We will get back to you soon.');
    form.resetFields();
  };

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <CustomerServiceOutlined style={{ fontSize: 64, color: '#FF9900', marginBottom: 16 }} />
        <Title level={1}>Contact Us</Title>
        <Paragraph type="secondary" style={{ fontSize: 16 }}>
          Have a question? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
        </Paragraph>
      </div>

      <Row gutter={[32, 32]}>
        {/* Contact Information */}
        <Col xs={24} md={10}>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Card>
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <div>
                  <MailOutlined style={{ fontSize: 24, color: '#FF9900', marginRight: 12 }} />
                  <Text strong style={{ fontSize: 16 }}>Email</Text>
                  <br />
                  <Text style={{ marginLeft: 36 }}>support@groow.com</Text>
                  <br />
                  <Text type="secondary" style={{ marginLeft: 36, fontSize: 12 }}>
                    24/7 support available
                  </Text>
                </div>

                <div>
                  <PhoneOutlined style={{ fontSize: 24, color: '#FF9900', marginRight: 12 }} />
                  <Text strong style={{ fontSize: 16 }}>Phone</Text>
                  <br />
                  <Text style={{ marginLeft: 36 }}>+1 (800) GROOW-HELP</Text>
                  <br />
                  <Text type="secondary" style={{ marginLeft: 36, fontSize: 12 }}>
                    Mon-Fri, 9 AM - 6 PM EST
                  </Text>
                </div>

                <div>
                  <EnvironmentOutlined style={{ fontSize: 24, color: '#FF9900', marginRight: 12 }} />
                  <Text strong style={{ fontSize: 16 }}>Address</Text>
                  <br />
                  <Text style={{ marginLeft: 36 }}>
                    123 Commerce Street
                    <br />
                    Suite 500, New York, NY 10001
                    <br />
                    United States
                  </Text>
                </div>

                <div>
                  <ClockCircleOutlined style={{ fontSize: 24, color: '#FF9900', marginRight: 12 }} />
                  <Text strong style={{ fontSize: 16 }}>Business Hours</Text>
                  <br />
                  <Text style={{ marginLeft: 36 }}>
                    Monday - Friday: 9:00 AM - 6:00 PM
                    <br />
                    Saturday: 10:00 AM - 4:00 PM
                    <br />
                    Sunday: Closed
                  </Text>
                </div>
              </Space>
            </Card>

            {/* Quick Links */}
            <Card title="Quick Links">
              <Space direction="vertical" style={{ width: '100%' }}>
                <a href="/faq">Frequently Asked Questions</a>
                <a href="/help">Help Center</a>
                <a href="/returns">Return Policy</a>
                <a href="/terms">Terms & Conditions</a>
              </Space>
            </Card>
          </Space>
        </Col>

        {/* Contact Form */}
        <Col xs={24} md={14}>
          <Card title="Send Us a Message">
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              autoComplete="off"
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="firstName"
                    label="First Name"
                    rules={[{ required: true, message: 'Please enter your first name' }]}
                  >
                    <Input size="large" placeholder="John" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="lastName"
                    label="Last Name"
                    rules={[{ required: true, message: 'Please enter your last name' }]}
                  >
                    <Input size="large" placeholder="Doe" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: 'Please enter your email' },
                  { type: 'email', message: 'Please enter a valid email' },
                ]}
              >
                <Input size="large" placeholder="john.doe@example.com" />
              </Form.Item>

              <Form.Item
                name="phone"
                label="Phone Number"
              >
                <Input size="large" placeholder="+1 (555) 123-4567" />
              </Form.Item>

              <Form.Item
                name="subject"
                label="Subject"
                rules={[{ required: true, message: 'Please enter a subject' }]}
              >
                <Input size="large" placeholder="How can we help you?" />
              </Form.Item>

              <Form.Item
                name="message"
                label="Message"
                rules={[
                  { required: true, message: 'Please enter your message' },
                  { min: 10, message: 'Message must be at least 10 characters' },
                ]}
              >
                <TextArea
                  rows={6}
                  placeholder="Please provide as much detail as possible..."
                  showCount
                  maxLength={1000}
                />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" size="large" block>
                  Send Message
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>

      {/* Map Placeholder */}
      <Card style={{ marginTop: 32 }}>
        <div
          style={{
            height: 400,
            background: '#f0f0f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text type="secondary">Map Integration (Google Maps / OpenStreetMap)</Text>
        </div>
      </Card>
    </div>
  );
};

export default ContactPage;
