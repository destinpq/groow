import React, { useState } from 'react';
import {
  Card,
  Form,
  Input,
  Button,
  message,
  Row,
  Col,
  Select,
  Upload,
  Typography,
  Space,
  Divider,
  Switch,
  Alert,
  Tag,
} from 'antd';
import {
  UploadOutlined,
  SaveOutlined,
  ShopOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const VendorProfilePage: React.FC = () => {
  const [form] = Form.useForm();
  const [logoFile, setLogoFile] = useState<UploadFile[]>([]);
  const [bannerFile, setBannerFile] = useState<UploadFile[]>([]);
  const [storeEnabled, setStoreEnabled] = useState(true);

  // Mock vendor data
  const vendorData = {
    id: 1,
    businessName: 'TechHub Store',
    contactPerson: 'John Doe',
    email: 'john@techhub.com',
    phone: '+1 (555) 123-4567',
    description: 'Leading provider of electronics and gadgets',
    address: '123 Business Street, New York, NY 10001',
    website: 'https://techhub.com',
    verificationStatus: 'verified', // pending, verified, rejected
    membershipPlan: 'premium',
    membershipExpiry: '2025-12-31',
    storeSettings: {
      storeName: 'TechHub Official Store',
      storeUrl: 'techhub-store',
      tagline: 'Your trusted electronics partner',
      logo: 'https://via.placeholder.com/150',
      banner: 'https://via.placeholder.com/1200x300',
      enabled: true,
    },
  };

  const handleSubmit = (values: any) => {
    console.log('Profile data:', values);
    console.log('Files:', { logo: logoFile, banner: bannerFile });
    message.success('Profile updated successfully!');
  };

  const handleRenewMembership = () => {
    message.info('Redirecting to membership renewal...');
    // Redirect to membership page
  };

  const handleUpgradePlan = () => {
    message.info('Redirecting to plan upgrade...');
    // Redirect to plans page
  };

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={18}>
          <Title level={2}>Vendor Profile</Title>
        </Col>
        <Col span={6} style={{ textAlign: 'right' }}>
          <Tag
            icon={vendorData.verificationStatus === 'verified' ? <CheckCircleOutlined /> : <ClockCircleOutlined />}
            color={vendorData.verificationStatus === 'verified' ? 'success' : 'warning'}
            style={{ fontSize: 14, padding: '4px 12px' }}
          >
            {vendorData.verificationStatus === 'verified' ? 'VERIFIED SELLER' : 'VERIFICATION PENDING'}
          </Tag>
        </Col>
      </Row>

      {/* Membership Status */}
      <Card style={{ marginBottom: 24, background: '#f5f5f5' }}>
        <Row align="middle" gutter={16}>
          <Col span={12}>
            <Space direction="vertical">
              <Text type="secondary">Current Membership Plan</Text>
              <Title level={3} style={{ margin: 0, textTransform: 'uppercase' }}>
                {vendorData.membershipPlan} Plan
              </Title>
              <Text type="secondary">
                Valid until: {new Date(vendorData.membershipExpiry).toLocaleDateString()}
              </Text>
            </Space>
          </Col>
          <Col span={12} style={{ textAlign: 'right' }}>
            <Space>
              <Button onClick={handleRenewMembership}>Renew Membership</Button>
              <Button type="primary" onClick={handleUpgradePlan}>
                Upgrade Plan
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Profile Form */}
      <Card title="Business Information" style={{ marginBottom: 24 }}>
        <Form
          form={form}
          layout="vertical"
          initialValues={vendorData}
          onFinish={handleSubmit}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="businessName"
                label="Business Name"
                rules={[{ required: true, message: 'Please enter business name' }]}
              >
                <Input placeholder="TechHub Store" disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="contactPerson"
                label="Contact Person"
                rules={[{ required: true }]}
              >
                <Input placeholder="John Doe" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="email"
                label="Email"
                rules={[{ required: true, type: 'email' }]}
              >
                <Input placeholder="john@techhub.com" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="phone"
                label="Phone Number"
                rules={[{ required: true }]}
              >
                <Input placeholder="+1 (555) 123-4567" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="Business Description"
            rules={[{ required: true }]}
          >
            <TextArea
              rows={4}
              placeholder="Describe your business..."
              showCount
              maxLength={500}
            />
          </Form.Item>

          <Form.Item
            name="address"
            label="Business Address"
            rules={[{ required: true }]}
          >
            <TextArea rows={2} placeholder="123 Business Street, City, State, ZIP" />
          </Form.Item>

          <Form.Item name="website" label="Website URL">
            <Input placeholder="https://your-website.com" />
          </Form.Item>
        </Form>
      </Card>

      {/* Store Settings */}
      <Card
        title={
          <Space>
            <ShopOutlined />
            <span>Store Settings</span>
          </Space>
        }
        extra={
          <Space>
            <Text>Store Status:</Text>
            <Switch
              checked={storeEnabled}
              onChange={setStoreEnabled}
              checkedChildren="Enabled"
              unCheckedChildren="Disabled"
            />
          </Space>
        }
      >
        {!storeEnabled && (
          <Alert
            message="Store is currently disabled"
            description="Your products will not be visible to customers. Enable your store to start receiving orders."
            type="warning"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}

        <Form form={form} layout="vertical" initialValues={vendorData.storeSettings}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="storeName"
                label="Store Name"
                rules={[{ required: true }]}
              >
                <Input placeholder="TechHub Official Store" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="storeUrl"
                label="Store URL"
                rules={[{ required: true }]}
                extra="https://groow.com/store/your-url"
              >
                <Input
                  addonBefore="groow.com/store/"
                  placeholder="your-store-name"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="tagline"
            label="Store Tagline"
            rules={[{ max: 100 }]}
          >
            <Input placeholder="Your trusted electronics partner" showCount maxLength={100} />
          </Form.Item>

          <Divider />

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Store Logo">
                <Upload
                  listType="picture-card"
                  fileList={logoFile}
                  onChange={({ fileList }) => setLogoFile(fileList)}
                  beforeUpload={() => false}
                  maxCount={1}
                >
                  {logoFile.length === 0 && (
                    <div>
                      <UploadOutlined />
                      <div style={{ marginTop: 8 }}>Upload Logo</div>
                      <div style={{ fontSize: 12, color: '#999' }}>150x150px</div>
                    </div>
                  )}
                </Upload>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Recommended: 150x150px, PNG or JPG, max 2MB
                </Text>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="Store Banner">
                <Upload
                  listType="picture-card"
                  fileList={bannerFile}
                  onChange={({ fileList }) => setBannerFile(fileList)}
                  beforeUpload={() => false}
                  maxCount={1}
                >
                  {bannerFile.length === 0 && (
                    <div>
                      <UploadOutlined />
                      <div style={{ marginTop: 8 }}>Upload Banner</div>
                      <div style={{ fontSize: 12, color: '#999' }}>1200x300px</div>
                    </div>
                  )}
                </Upload>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Recommended: 1200x300px, PNG or JPG, max 5MB
                </Text>
              </Form.Item>
            </Col>
          </Row>

          <Divider />

          <Title level={5}>About Your Store</Title>
          <Form.Item name="aboutStore" label="Store Description">
            <TextArea
              rows={6}
              placeholder="Tell customers about your store, products, and values..."
              showCount
              maxLength={1000}
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="returnPolicy" label="Return Policy">
                <Select placeholder="Select return policy">
                  <Option value="7days">7 Days Return</Option>
                  <Option value="15days">15 Days Return</Option>
                  <Option value="30days">30 Days Return</Option>
                  <Option value="no-return">No Returns</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="shippingTime" label="Average Shipping Time">
                <Select placeholder="Select shipping time">
                  <Option value="1-2">1-2 Days</Option>
                  <Option value="3-5">3-5 Days</Option>
                  <Option value="5-7">5-7 Days</Option>
                  <Option value="7-14">7-14 Days</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" icon={<SaveOutlined />} size="large">
                Save Profile
              </Button>
              <Button size="large">Cancel</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>

      {/* Help Section */}
      <Card title="Need Help?">
        <Paragraph>
          <strong>Getting Started:</strong>
          <ul>
            <li>Complete your KYC verification to unlock all features</li>
            <li>Upload high-quality products with detailed descriptions</li>
            <li>Respond to customer inquiries within 24 hours</li>
            <li>Maintain good seller ratings to boost visibility</li>
          </ul>
        </Paragraph>
        <Button>View Seller Guidelines</Button>
        <Button style={{ marginLeft: 8 }}>Contact Support</Button>
      </Card>
    </div>
  );
};

export default VendorProfilePage;
