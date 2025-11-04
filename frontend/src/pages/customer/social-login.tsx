import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Button,
  Space,
  Form,
  Input,
  Select,
  Checkbox,
  Radio,
  message,
  Divider,
  Alert,
  Steps,
  Modal,
} from 'antd';
import {
  GoogleOutlined,
  FacebookOutlined,
  TwitterOutlined,
  AppleOutlined,
  LinkedinOutlined,
  GithubOutlined,
  LockOutlined,
  UserOutlined,
  MailOutlined,
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { Step } = Steps;

interface SocialProvider {
  id: string;
  name: string;
  icon: React.ReactNode;
  connected: boolean;
  connectedEmail?: string;
  connectedAt?: string;
}

const SocialLoginPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [selectedProvider, setSelectedProvider] = useState<string>('');
  const [form] = Form.useForm();
  const [socialProviders, setSocialProviders] = useState<SocialProvider[]>([
    {
      id: 'google',
      name: 'Google',
      icon: <GoogleOutlined style={{ fontSize: 24 }} />,
      connected: true,
      connectedEmail: 'user@gmail.com',
      connectedAt: '2024-01-15',
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: <FacebookOutlined style={{ fontSize: 24 }} />,
      connected: false,
    },
    {
      id: 'twitter',
      name: 'Twitter',
      icon: <TwitterOutlined style={{ fontSize: 24 }} />,
      connected: false,
    },
    {
      id: 'apple',
      name: 'Apple',
      icon: <AppleOutlined style={{ fontSize: 24 }} />,
      connected: false,
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      icon: <LinkedinOutlined style={{ fontSize: 24 }} />,
      connected: true,
      connectedEmail: 'user@linkedin.com',
      connectedAt: '2024-02-20',
    },
    {
      id: 'github',
      name: 'GitHub',
      icon: <GithubOutlined style={{ fontSize: 24 }} />,
      connected: false,
    },
  ]);

  const handleConnectProvider = (providerId: string) => {
    setSelectedProvider(providerId);
    setCurrentStep(1);
  };

  const handleDisconnectProvider = (providerId: string) => {
    Modal.confirm({
      title: 'Disconnect Account',
      content: `Are you sure you want to disconnect your ${providerId} account?`,
      onOk: () => {
        setSocialProviders(
          socialProviders.map((p) =>
            p.id === providerId
              ? { ...p, connected: false, connectedEmail: undefined, connectedAt: undefined }
              : p
          )
        );
        message.success(`${providerId} account disconnected`);
      },
    });
  };

  const handleLoginWithProvider = (provider: string) => {
    message.loading(`Connecting to ${provider}...`, 2);
    setTimeout(() => {
      message.success(`Successfully logged in with ${provider}`);
      // Simulate connection
      setSocialProviders(
        socialProviders.map((p) =>
          p.id === provider
            ? {
                ...p,
                connected: true,
                connectedEmail: `user@${provider}.com`,
                connectedAt: new Date().toISOString().split('T')[0],
              }
            : p
        )
      );
      setCurrentStep(0);
    }, 2000);
  };

  const handleCompleteSetup = (values: any) => {
    console.log('Setup values:', values);
    handleLoginWithProvider(selectedProvider);
  };

  const getProviderColor = (providerId: string): string => {
    const colors: Record<string, string> = {
      google: '#DB4437',
      facebook: '#1877F2',
      twitter: '#1DA1F2',
      apple: '#000000',
      linkedin: '#0A66C2',
      github: '#181717',
    };
    return colors[providerId] || '#1890ff';
  };

  const connectedCount = socialProviders.filter((p) => p.connected).length;

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={3}>
          <LockOutlined style={{ color: '#1890ff' }} /> Social Login
        </Title>
        <Paragraph type="secondary">
          Connect your social media accounts for quick and secure login
        </Paragraph>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Space direction="vertical" size={0}>
              <Text type="secondary">Connected Accounts</Text>
              <Text strong style={{ fontSize: 24, color: '#52c41a' }}>
                {connectedCount}
              </Text>
            </Space>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Space direction="vertical" size={0}>
              <Text type="secondary">Available Providers</Text>
              <Text strong style={{ fontSize: 24, color: '#1890ff' }}>
                {socialProviders.length}
              </Text>
            </Space>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Space direction="vertical" size={0}>
              <Text type="secondary">Login Method</Text>
              <Text strong style={{ fontSize: 16 }}>
                Social + Email
              </Text>
            </Space>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Space direction="vertical" size={0}>
              <Text type="secondary">Security Level</Text>
              <Text strong style={{ fontSize: 16, color: '#52c41a' }}>
                High
              </Text>
            </Space>
          </Card>
        </Col>
      </Row>

      {currentStep === 0 ? (
        <Row gutter={16}>
          <Col xs={24} lg={16}>
            <Card title="Social Login Providers">
              <Alert
                message="Quick & Secure Login"
                description="Connect your social accounts to log in quickly without remembering passwords. Your credentials are never shared with us."
                type="info"
                showIcon
                style={{ marginBottom: 24 }}
              />

              <Row gutter={[16, 16]}>
                {socialProviders.map((provider) => (
                  <Col xs={24} sm={12} key={provider.id}>
                    <Card
                      hoverable={!provider.connected}
                      style={{
                        border: provider.connected ? `2px solid ${getProviderColor(provider.id)}` : '1px solid #d9d9d9',
                      }}
                    >
                      <Space direction="vertical" size="large" style={{ width: '100%' }}>
                        <Row justify="space-between" align="middle">
                          <Col>
                            <Space>
                              <div
                                style={{
                                  width: 48,
                                  height: 48,
                                  borderRadius: 8,
                                  background: getProviderColor(provider.id),
                                  color: 'white',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                              >
                                {provider.icon}
                              </div>
                              <div>
                                <Text strong style={{ fontSize: 16 }}>{provider.name}</Text>
                                {provider.connected && (
                                  <div>
                                    <Text type="success" style={{ fontSize: 12 }}>
                                      ✓ Connected
                                    </Text>
                                  </div>
                                )}
                              </div>
                            </Space>
                          </Col>
                        </Row>

                        {provider.connected ? (
                          <div>
                            <Space direction="vertical" size="small" style={{ width: '100%' }}>
                              <Text type="secondary" style={{ fontSize: 12 }}>
                                Email: {provider.connectedEmail}
                              </Text>
                              <Text type="secondary" style={{ fontSize: 12 }}>
                                Connected on: {provider.connectedAt}
                              </Text>
                            </Space>
                            <Divider style={{ margin: '12px 0' }} />
                            <Button
                              danger
                              block
                              onClick={() => handleDisconnectProvider(provider.id)}
                            >
                              Disconnect
                            </Button>
                          </div>
                        ) : (
                          <Button
                            type="primary"
                            block
                            style={{
                              background: getProviderColor(provider.id),
                              borderColor: getProviderColor(provider.id),
                            }}
                            onClick={() => handleConnectProvider(provider.id)}
                          >
                            Connect {provider.name}
                          </Button>
                        )}
                      </Space>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <Card title="Benefits" style={{ marginBottom: 16 }}>
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <div>
                  <Text strong>🚀 Quick Login</Text>
                  <div>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      Log in with just one click using your social accounts
                    </Text>
                  </div>
                </div>

                <div>
                  <Text strong>🔒 Enhanced Security</Text>
                  <div>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      Leverage the security features of major platforms
                    </Text>
                  </div>
                </div>

                <div>
                  <Text strong>📧 No Password Reset</Text>
                  <div>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      Never worry about forgetting your password again
                    </Text>
                  </div>
                </div>

                <div>
                  <Text strong>🔄 Auto-fill Profile</Text>
                  <div>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      Your profile information is automatically filled from your social account
                    </Text>
                  </div>
                </div>

                <div>
                  <Text strong>🛡️ Privacy Protected</Text>
                  <div>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      We never post to your social media or access private data
                    </Text>
                  </div>
                </div>
              </Space>
            </Card>

            <Card title="Security Settings">
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <div>
                  <Checkbox defaultChecked>Require email verification</Checkbox>
                </div>
                <div>
                  <Checkbox defaultChecked>Enable two-factor authentication</Checkbox>
                </div>
                <div>
                  <Checkbox>Remember me on this device</Checkbox>
                </div>
                <div>
                  <Checkbox defaultChecked>Notify me of new login attempts</Checkbox>
                </div>
              </Space>
            </Card>
          </Col>
        </Row>
      ) : (
        <Row justify="center">
          <Col xs={24} md={16} lg={12}>
            <Card>
              <Steps current={currentStep} style={{ marginBottom: 32 }}>
                <Step title="Choose Provider" />
                <Step title="Authorize" />
                <Step title="Complete Setup" />
              </Steps>

              {currentStep === 1 && (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <div
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: 16,
                      background: getProviderColor(selectedProvider),
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 24px',
                    }}
                  >
                    {socialProviders.find((p) => p.id === selectedProvider)?.icon}
                  </div>

                  <Title level={4}>
                    Connect to {socialProviders.find((p) => p.id === selectedProvider)?.name}
                  </Title>

                  <Paragraph type="secondary">
                    You will be redirected to {socialProviders.find((p) => p.id === selectedProvider)?.name} to authorize
                    access. We will only access your basic profile information.
                  </Paragraph>

                  <Alert
                    message="What we'll access"
                    description={
                      <ul style={{ textAlign: 'left', marginTop: 8, paddingLeft: 20 }}>
                        <li>Your name and profile picture</li>
                        <li>Your email address</li>
                      </ul>
                    }
                    type="info"
                    showIcon
                    style={{ marginBottom: 24, textAlign: 'left' }}
                  />

                  <Form layout="vertical" onFinish={handleCompleteSetup}>
                    <Form.Item
                      label="Account Permissions"
                      name="permissions"
                      rules={[{ required: true, message: 'Please agree to the permissions' }]}
                    >
                      <Checkbox.Group style={{ display: 'flex', flexDirection: 'column' }}>
                        <Checkbox value="profile" disabled defaultChecked>
                          Access basic profile information
                        </Checkbox>
                        <Checkbox value="email" disabled defaultChecked>
                          Access email address
                        </Checkbox>
                      </Checkbox.Group>
                    </Form.Item>

                    <Form.Item
                      name="agree"
                      valuePropName="checked"
                      rules={[
                        {
                          validator: (_, value) =>
                            value ? Promise.resolve() : Promise.reject(new Error('Please accept the terms')),
                        },
                      ]}
                    >
                      <Checkbox>
                        I agree to the terms and conditions and privacy policy
                      </Checkbox>
                    </Form.Item>

                    <Space style={{ width: '100%', justifyContent: 'center' }}>
                      <Button onClick={() => setCurrentStep(0)}>Cancel</Button>
                      <Button
                        type="primary"
                        htmlType="submit"
                        size="large"
                        style={{
                          background: getProviderColor(selectedProvider),
                          borderColor: getProviderColor(selectedProvider),
                        }}
                      >
                        Authorize & Connect
                      </Button>
                    </Space>
                  </Form>
                </div>
              )}
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default SocialLoginPage;
