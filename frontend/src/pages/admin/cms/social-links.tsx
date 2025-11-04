import React, { useState } from 'react';
import {
  Card,
  Form,
  Input,
  Button,
  Space,
  message,
  Typography,
  Row,
  Col,
} from 'antd';
import {
  FacebookOutlined,
  TwitterOutlined,
  InstagramOutlined,
  LinkedinOutlined,
  YoutubeOutlined,
  SaveOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;

interface SocialLinks {
  facebook: string;
  twitter: string;
  instagram: string;
  linkedin: string;
  youtube: string;
  pinterest: string;
  tiktok: string;
  whatsapp: string;
}

const AdminSocialLinksPage: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const initialValues: SocialLinks = {
    facebook: 'https://facebook.com/groow',
    twitter: 'https://twitter.com/groow',
    instagram: 'https://instagram.com/groow',
    linkedin: 'https://linkedin.com/company/groow',
    youtube: 'https://youtube.com/@groow',
    pinterest: '',
    tiktok: '',
    whatsapp: '',
  };

  const handleSubmit = (values: SocialLinks) => {
    setLoading(true);
    console.log('Social links:', values);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      message.success('Social media links updated successfully');
    }, 1000);
  };

  return (
    <div style={{ padding: 24 }}>
      <Card>
        <Title level={3}>Social Media Links</Title>
        <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>
          Configure your social media profile links. These will appear in the website footer and other relevant sections.
        </Text>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={initialValues}
        >
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="facebook"
                label={
                  <Space>
                    <FacebookOutlined style={{ color: '#1877F2' }} />
                    <Text>Facebook</Text>
                  </Space>
                }
                rules={[
                  {
                    type: 'url',
                    message: 'Please enter a valid URL',
                  },
                ]}
              >
                <Input placeholder="https://facebook.com/your-page" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="twitter"
                label={
                  <Space>
                    <TwitterOutlined style={{ color: '#1DA1F2' }} />
                    <Text>Twitter / X</Text>
                  </Space>
                }
                rules={[
                  {
                    type: 'url',
                    message: 'Please enter a valid URL',
                  },
                ]}
              >
                <Input placeholder="https://twitter.com/your-handle" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="instagram"
                label={
                  <Space>
                    <InstagramOutlined style={{ color: '#E4405F' }} />
                    <Text>Instagram</Text>
                  </Space>
                }
                rules={[
                  {
                    type: 'url',
                    message: 'Please enter a valid URL',
                  },
                ]}
              >
                <Input placeholder="https://instagram.com/your-profile" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="linkedin"
                label={
                  <Space>
                    <LinkedinOutlined style={{ color: '#0A66C2' }} />
                    <Text>LinkedIn</Text>
                  </Space>
                }
                rules={[
                  {
                    type: 'url',
                    message: 'Please enter a valid URL',
                  },
                ]}
              >
                <Input placeholder="https://linkedin.com/company/your-company" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="youtube"
                label={
                  <Space>
                    <YoutubeOutlined style={{ color: '#FF0000' }} />
                    <Text>YouTube</Text>
                  </Space>
                }
                rules={[
                  {
                    type: 'url',
                    message: 'Please enter a valid URL',
                  },
                ]}
              >
                <Input placeholder="https://youtube.com/@your-channel" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="pinterest"
                label={
                  <Space>
                    <Text>📌 Pinterest</Text>
                  </Space>
                }
                rules={[
                  {
                    type: 'url',
                    message: 'Please enter a valid URL',
                  },
                ]}
              >
                <Input placeholder="https://pinterest.com/your-profile" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="tiktok"
                label={
                  <Space>
                    <Text>🎵 TikTok</Text>
                  </Space>
                }
                rules={[
                  {
                    type: 'url',
                    message: 'Please enter a valid URL',
                  },
                ]}
              >
                <Input placeholder="https://tiktok.com/@your-profile" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="whatsapp"
                label={
                  <Space>
                    <Text>💬 WhatsApp Business</Text>
                  </Space>
                }
              >
                <Input placeholder="https://wa.me/1234567890" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item style={{ marginTop: 24 }}>
            <Space>
              <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={loading}>
                Save Social Links
              </Button>
              <Button onClick={() => form.resetFields()}>Reset</Button>
            </Space>
          </Form.Item>
        </Form>

        {/* Preview Section */}
        <Card title="Preview" size="small" style={{ marginTop: 24, background: '#f5f5f5' }}>
          <Space size="large">
            {form.getFieldValue('facebook') && (
              <a href={form.getFieldValue('facebook')} target="_blank" rel="noopener noreferrer">
                <FacebookOutlined style={{ fontSize: 28, color: '#1877F2' }} />
              </a>
            )}
            {form.getFieldValue('twitter') && (
              <a href={form.getFieldValue('twitter')} target="_blank" rel="noopener noreferrer">
                <TwitterOutlined style={{ fontSize: 28, color: '#1DA1F2' }} />
              </a>
            )}
            {form.getFieldValue('instagram') && (
              <a href={form.getFieldValue('instagram')} target="_blank" rel="noopener noreferrer">
                <InstagramOutlined style={{ fontSize: 28, color: '#E4405F' }} />
              </a>
            )}
            {form.getFieldValue('linkedin') && (
              <a href={form.getFieldValue('linkedin')} target="_blank" rel="noopener noreferrer">
                <LinkedinOutlined style={{ fontSize: 28, color: '#0A66C2' }} />
              </a>
            )}
            {form.getFieldValue('youtube') && (
              <a href={form.getFieldValue('youtube')} target="_blank" rel="noopener noreferrer">
                <YoutubeOutlined style={{ fontSize: 28, color: '#FF0000' }} />
              </a>
            )}
          </Space>
        </Card>
      </Card>
    </div>
  );
};

export default AdminSocialLinksPage;
