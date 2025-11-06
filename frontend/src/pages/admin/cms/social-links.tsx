import React, { useState, useEffect } from 'react';
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
  Switch,
} from 'antd';
import {
  FacebookOutlined,
  TwitterOutlined,
  InstagramOutlined,
  LinkedinOutlined,
  YoutubeOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import { cmsAPI, CMSSocialLink } from '@/services/api';

const { Title, Text } = Typography;

const AdminSocialLinksPage: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [socialLinks, setSocialLinks] = useState<CMSSocialLink[]>([]);

  useEffect(() => {
    loadSocialLinks();
  }, []);

  const loadSocialLinks = async () => {
    try {
      const response = await cmsAPI.socialLinks.getAll();
      setSocialLinks(response.data || []);
      
      // Set form values from loaded data
      const formValues: any = {};
      response.data?.forEach((link: CMSSocialLink) => {
        formValues[link.platform] = link.url;
        formValues[`${link.platform}_active`] = link.isActive;
      });
      form.setFieldsValue(formValues);
    } catch (error) {
      message.error('Failed to load social links');
      console.error(error);
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      
      // Update or create each social link
      const platforms: Array<CMSSocialLink['platform']> = [
        'facebook', 'twitter', 'instagram', 'linkedin', 
        'youtube', 'pinterest', 'tiktok'
      ];
      
      for (const platform of platforms) {
        if (values[platform]) {
          const existing = socialLinks.find(s => s.platform === platform);
          const linkData = {
            platform,
            url: values[platform],
            isActive: values[`${platform}_active`] ?? true,
            icon: platform,
            displayOrder: 0,
          };
          
          if (existing) {
            await cmsAPI.socialLinks.update(existing.id, linkData);
          } else {
            await cmsAPI.socialLinks.create(linkData);
          }
        }
      }
      
      message.success('Social media links updated successfully');
      loadSocialLinks();
    } catch (error) {
      message.error('Failed to update social links');
      console.error(error);
    } finally {
      setLoading(false);
    }
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
