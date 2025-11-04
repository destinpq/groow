import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Steps,
  Button,
  Space,
  Checkbox,
  Radio,
  Divider,
  Image,
  Tag,
} from 'antd';
import {
  SmileOutlined,
  ShoppingOutlined,
  BellOutlined,
  SafetyOutlined,
  CheckCircleOutlined,
  RocketOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'umi';

const { Title, Paragraph, Text } = Typography;

interface OnboardingStep {
  title: string;
  icon: React.ReactNode;
  description: string;
}

const steps: OnboardingStep[] = [
  {
    title: 'Welcome',
    icon: <SmileOutlined />,
    description: 'Get started with your account',
  },
  {
    title: 'Preferences',
    icon: <ShoppingOutlined />,
    description: 'Customize your shopping experience',
  },
  {
    title: 'Notifications',
    icon: <BellOutlined />,
    description: 'Stay updated with alerts',
  },
  {
    title: 'Security',
    icon: <SafetyOutlined />,
    description: 'Secure your account',
  },
];

const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [preferences, setPreferences] = useState({
    categories: [] as string[],
    language: 'en',
    currency: 'USD',
  });
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    orderUpdates: true,
    promotions: true,
    newsletter: false,
  });
  const [security, setSecurity] = useState({
    twoFactor: false,
    loginAlerts: true,
  });

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding
      localStorage.setItem('onboarding_completed', 'true');
      navigate('/');
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    localStorage.setItem('onboarding_completed', 'true');
    navigate('/');
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <div style={{ marginBottom: 32 }}>
              <Image
                src="https://via.placeholder.com/400x300?text=Welcome+to+Groow"
                alt="Welcome"
                preview={false}
                style={{ borderRadius: 8 }}
              />
            </div>
            <Title level={2}>Welcome to Groow! 🎉</Title>
            <Paragraph style={{ fontSize: 16, maxWidth: 600, margin: '0 auto 24px' }}>
              Your one-stop marketplace for everything you need. Let's set up your account to
              provide you with the best shopping experience.
            </Paragraph>
            <Space direction="vertical" size="middle" style={{ width: '100%', maxWidth: 500, margin: '0 auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 16, background: '#f0f2f5', borderRadius: 8 }}>
                <ShoppingOutlined style={{ fontSize: 32, color: '#1890ff' }} />
                <div style={{ textAlign: 'left', flex: 1 }}>
                  <Text strong>Browse Millions of Products</Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    From electronics to fashion and more
                  </Text>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 16, background: '#f0f2f5', borderRadius: 8 }}>
                <SafetyOutlined style={{ fontSize: 32, color: '#52c41a' }} />
                <div style={{ textAlign: 'left', flex: 1 }}>
                  <Text strong>Secure Shopping</Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    Your data is safe with us
                  </Text>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 16, background: '#f0f2f5', borderRadius: 8 }}>
                <RocketOutlined style={{ fontSize: 32, color: '#ff9900' }} />
                <div style={{ textAlign: 'left', flex: 1 }}>
                  <Text strong>Fast Delivery</Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    Get your orders quickly and reliably
                  </Text>
                </div>
              </div>
            </Space>
          </div>
        );

      case 1:
        return (
          <div style={{ padding: '20px 0' }}>
            <Title level={3}>Customize Your Experience</Title>
            <Paragraph type="secondary">
              Tell us what you're interested in so we can show you relevant products
            </Paragraph>

            <Divider />

            <div style={{ marginBottom: 32 }}>
              <Title level={5}>Select Your Interests</Title>
              <Checkbox.Group
                value={preferences.categories}
                onChange={(values) => setPreferences({ ...preferences, categories: values as string[] })}
                style={{ width: '100%' }}
              >
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Checkbox value="electronics">
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span>📱</span>
                        <span>Electronics</span>
                      </div>
                    </Checkbox>
                  </Col>
                  <Col span={12}>
                    <Checkbox value="fashion">
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span>👗</span>
                        <span>Fashion</span>
                      </div>
                    </Checkbox>
                  </Col>
                  <Col span={12}>
                    <Checkbox value="home">
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span>🏠</span>
                        <span>Home & Garden</span>
                      </div>
                    </Checkbox>
                  </Col>
                  <Col span={12}>
                    <Checkbox value="sports">
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span>⚽</span>
                        <span>Sports & Fitness</span>
                      </div>
                    </Checkbox>
                  </Col>
                  <Col span={12}>
                    <Checkbox value="books">
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span>📚</span>
                        <span>Books</span>
                      </div>
                    </Checkbox>
                  </Col>
                  <Col span={12}>
                    <Checkbox value="toys">
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span>🎮</span>
                        <span>Toys & Games</span>
                      </div>
                    </Checkbox>
                  </Col>
                  <Col span={12}>
                    <Checkbox value="beauty">
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span>💄</span>
                        <span>Beauty & Health</span>
                      </div>
                    </Checkbox>
                  </Col>
                  <Col span={12}>
                    <Checkbox value="automotive">
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span>🚗</span>
                        <span>Automotive</span>
                      </div>
                    </Checkbox>
                  </Col>
                </Row>
              </Checkbox.Group>
            </div>

            <Row gutter={24}>
              <Col span={12}>
                <Title level={5}>Preferred Language</Title>
                <Radio.Group
                  value={preferences.language}
                  onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
                  style={{ width: '100%' }}
                >
                  <Space direction="vertical">
                    <Radio value="en">English</Radio>
                    <Radio value="es">Español</Radio>
                    <Radio value="fr">Français</Radio>
                    <Radio value="de">Deutsch</Radio>
                  </Space>
                </Radio.Group>
              </Col>
              <Col span={12}>
                <Title level={5}>Preferred Currency</Title>
                <Radio.Group
                  value={preferences.currency}
                  onChange={(e) => setPreferences({ ...preferences, currency: e.target.value })}
                  style={{ width: '100%' }}
                >
                  <Space direction="vertical">
                    <Radio value="USD">USD ($)</Radio>
                    <Radio value="EUR">EUR (€)</Radio>
                    <Radio value="GBP">GBP (£)</Radio>
                    <Radio value="JPY">JPY (¥)</Radio>
                  </Space>
                </Radio.Group>
              </Col>
            </Row>
          </div>
        );

      case 2:
        return (
          <div style={{ padding: '20px 0' }}>
            <Title level={3}>Notification Preferences</Title>
            <Paragraph type="secondary">
              Choose how you want to receive updates about your orders and promotions
            </Paragraph>

            <Divider />

            <div style={{ marginBottom: 24 }}>
              <Title level={5}>Notification Channels</Title>
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <Card size="small">
                  <Checkbox
                    checked={notifications.email}
                    onChange={(e) => setNotifications({ ...notifications, email: e.target.checked })}
                  >
                    <Text strong>Email Notifications</Text>
                  </Checkbox>
                  <Paragraph type="secondary" style={{ marginLeft: 24, marginBottom: 0, marginTop: 4 }}>
                    Receive updates via email
                  </Paragraph>
                </Card>
                <Card size="small">
                  <Checkbox
                    checked={notifications.push}
                    onChange={(e) => setNotifications({ ...notifications, push: e.target.checked })}
                  >
                    <Text strong>Push Notifications</Text>
                  </Checkbox>
                  <Paragraph type="secondary" style={{ marginLeft: 24, marginBottom: 0, marginTop: 4 }}>
                    Get browser notifications
                  </Paragraph>
                </Card>
                <Card size="small">
                  <Checkbox
                    checked={notifications.sms}
                    onChange={(e) => setNotifications({ ...notifications, sms: e.target.checked })}
                  >
                    <Text strong>SMS Notifications</Text>
                  </Checkbox>
                  <Paragraph type="secondary" style={{ marginLeft: 24, marginBottom: 0, marginTop: 4 }}>
                    Receive text messages for important updates
                  </Paragraph>
                </Card>
              </Space>
            </div>

            <Divider />

            <div>
              <Title level={5}>What to Notify About</Title>
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <Checkbox
                  checked={notifications.orderUpdates}
                  onChange={(e) => setNotifications({ ...notifications, orderUpdates: e.target.checked })}
                >
                  <div>
                    <Text strong>Order Updates</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      Shipping, delivery, and order status changes
                    </Text>
                  </div>
                </Checkbox>
                <Checkbox
                  checked={notifications.promotions}
                  onChange={(e) => setNotifications({ ...notifications, promotions: e.target.checked })}
                >
                  <div>
                    <Text strong>Promotions & Deals</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      Special offers and discounts on products you like
                    </Text>
                  </div>
                </Checkbox>
                <Checkbox
                  checked={notifications.newsletter}
                  onChange={(e) => setNotifications({ ...notifications, newsletter: e.target.checked })}
                >
                  <div>
                    <Text strong>Newsletter</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      Monthly digest of new products and trends
                    </Text>
                  </div>
                </Checkbox>
              </Space>
            </div>
          </div>
        );

      case 3:
        return (
          <div style={{ padding: '20px 0' }}>
            <Title level={3}>Secure Your Account</Title>
            <Paragraph type="secondary">
              Add an extra layer of security to protect your account
            </Paragraph>

            <Divider />

            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <Card>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                  <SafetyOutlined style={{ fontSize: 32, color: '#52c41a', marginTop: 4 }} />
                  <div style={{ flex: 1 }}>
                    <Checkbox
                      checked={security.twoFactor}
                      onChange={(e) => setSecurity({ ...security, twoFactor: e.target.checked })}
                    >
                      <Text strong>Enable Two-Factor Authentication</Text>
                    </Checkbox>
                    <Paragraph type="secondary" style={{ marginBottom: 0, marginTop: 8 }}>
                      Add an extra layer of security by requiring a verification code in addition to your
                      password when logging in.
                    </Paragraph>
                    {security.twoFactor && (
                      <Tag color="green" style={{ marginTop: 8 }}>
                        Recommended
                      </Tag>
                    )}
                  </div>
                </div>
              </Card>

              <Card>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                  <BellOutlined style={{ fontSize: 32, color: '#1890ff', marginTop: 4 }} />
                  <div style={{ flex: 1 }}>
                    <Checkbox
                      checked={security.loginAlerts}
                      onChange={(e) => setSecurity({ ...security, loginAlerts: e.target.checked })}
                    >
                      <Text strong>Login Alerts</Text>
                    </Checkbox>
                    <Paragraph type="secondary" style={{ marginBottom: 0, marginTop: 8 }}>
                      Get notified when someone logs into your account from a new device or location.
                    </Paragraph>
                  </div>
                </div>
              </Card>

              <Card style={{ background: '#f6ffed', border: '1px solid #b7eb8f' }}>
                <Space direction="vertical" size="small">
                  <Text strong style={{ color: '#52c41a' }}>
                    <CheckCircleOutlined /> Security Tips
                  </Text>
                  <Text type="secondary" style={{ fontSize: 13 }}>
                    • Use a strong, unique password
                  </Text>
                  <Text type="secondary" style={{ fontSize: 13 }}>
                    • Never share your password with anyone
                  </Text>
                  <Text type="secondary" style={{ fontSize: 13 }}>
                    • Log out when using shared devices
                  </Text>
                  <Text type="secondary" style={{ fontSize: 13 }}>
                    • Keep your email address up to date
                  </Text>
                </Space>
              </Card>
            </Space>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f0f2f5', padding: '24px 0' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px' }}>
        <Card>
          <Steps current={currentStep} style={{ marginBottom: 32 }}>
            {steps.map((step, index) => (
              <Steps.Step key={index} title={step.title} icon={step.icon} description={step.description} />
            ))}
          </Steps>

          <div style={{ minHeight: 400 }}>{renderStepContent()}</div>

          <Divider />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              {currentStep > 0 && (
                <Button onClick={handlePrevious}>Previous</Button>
              )}
            </div>
            <div>
              <Text type="secondary" style={{ marginRight: 16 }}>
                Step {currentStep + 1} of {steps.length}
              </Text>
              <Button onClick={handleSkip} style={{ marginRight: 8 }}>
                Skip
              </Button>
              <Button type="primary" onClick={handleNext}>
                {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default OnboardingPage;
