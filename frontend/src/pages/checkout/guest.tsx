import React, { useState } from 'react';
import {
  Card,
  Form,
  Input,
  Button,
  Space,
  Typography,
  Divider,
  Row,
  Col,
  Checkbox,
  Steps,
  Alert,
  message,
} from 'antd';
import {
  ShoppingCartOutlined,
  UserOutlined,
  HomeOutlined,
  CreditCardOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import ShippingMethodSelector from '@/components/checkout/ShippingMethodSelector';

const { Title, Text, Paragraph } = Typography;

interface GuestCheckoutFormData {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  shippingMethod?: any;
  createAccount: boolean;
}

const GuestCheckoutPage: React.FC = () => {
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<GuestCheckoutFormData>>({});
  const [showShippingSelector, setShowShippingSelector] = useState(false);

  const cartTotal = 89.99; // Mock cart total

  const steps = [
    {
      title: 'Contact Info',
      icon: <UserOutlined />,
    },
    {
      title: 'Shipping',
      icon: <HomeOutlined />,
    },
    {
      title: 'Payment',
      icon: <CreditCardOutlined />,
    },
    {
      title: 'Complete',
      icon: <CheckCircleOutlined />,
    },
  ];

  const handleNext = async () => {
    try {
      const values = await form.validateFields();
      setFormData({ ...formData, ...values });
      
      if (currentStep === 1) {
        setShowShippingSelector(true);
      } else {
        setCurrentStep(currentStep + 1);
      }
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleShippingMethodSelect = (method: any) => {
    setFormData({ ...formData, shippingMethod: method });
    setShowShippingSelector(false);
    setCurrentStep(currentStep + 1);
  };

  const handleSubmitOrder = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      message.success('Order placed successfully!');
      setCurrentStep(3);
    } catch (error) {
      message.error('Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <Card>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div>
              <Title level={3}>
                <ShoppingCartOutlined /> Guest Checkout
              </Title>
              <Paragraph type="secondary">
                Complete your purchase without creating an account
              </Paragraph>
            </div>

            <Alert
              message="Shopping as Guest"
              description="You can create an account after checkout to track your order and enjoy member benefits."
              type="info"
              showIcon
            />

            <Steps current={currentStep} items={steps} />

            <Divider />

            <Form form={form} layout="vertical">
              {/* Step 0: Contact Information */}
              {currentStep === 0 && (
                <div>
                  <Title level={4}>Contact Information</Title>
                  <Row gutter={16}>
                    <Col xs={24}>
                      <Form.Item
                        name="email"
                        label="Email Address"
                        rules={[
                          { required: true, message: 'Please enter your email' },
                          { type: 'email', message: 'Please enter a valid email' },
                        ]}
                      >
                        <Input size="large" placeholder="your.email@example.com" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="firstName"
                        label="First Name"
                        rules={[{ required: true, message: 'Please enter your first name' }]}
                      >
                        <Input size="large" placeholder="John" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="lastName"
                        label="Last Name"
                        rules={[{ required: true, message: 'Please enter your last name' }]}
                      >
                        <Input size="large" placeholder="Doe" />
                      </Form.Item>
                    </Col>
                    <Col xs={24}>
                      <Form.Item
                        name="phone"
                        label="Phone Number"
                        rules={[{ required: true, message: 'Please enter your phone number' }]}
                      >
                        <Input size="large" placeholder="+1 (555) 123-4567" />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item name="createAccount" valuePropName="checked" initialValue={false}>
                    <Checkbox>Create an account for faster checkout next time</Checkbox>
                  </Form.Item>
                </div>
              )}

              {/* Step 1: Shipping Address */}
              {currentStep === 1 && (
                <div>
                  <Title level={4}>Shipping Address</Title>
                  <Row gutter={16}>
                    <Col xs={24}>
                      <Form.Item
                        name="address"
                        label="Street Address"
                        rules={[{ required: true, message: 'Please enter your address' }]}
                      >
                        <Input size="large" placeholder="123 Main Street, Apt 4B" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="city"
                        label="City"
                        rules={[{ required: true, message: 'Please enter your city' }]}
                      >
                        <Input size="large" placeholder="San Francisco" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="state"
                        label="State/Province"
                        rules={[{ required: true, message: 'Please enter your state' }]}
                      >
                        <Input size="large" placeholder="California" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="zipCode"
                        label="ZIP/Postal Code"
                        rules={[{ required: true, message: 'Please enter your ZIP code' }]}
                      >
                        <Input size="large" placeholder="94105" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="country"
                        label="Country"
                        initialValue="United States"
                        rules={[{ required: true, message: 'Please enter your country' }]}
                      >
                        <Input size="large" />
                      </Form.Item>
                    </Col>
                  </Row>
                </div>
              )}

              {/* Step 2: Payment */}
              {currentStep === 2 && (
                <div>
                  <Title level={4}>Payment Information</Title>
                  
                  <Card style={{ marginBottom: 16, background: '#fafafa' }}>
                    <Space direction="vertical" size="small" style={{ width: '100%' }}>
                      <Text strong>Order Summary</Text>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Text type="secondary">Subtotal:</Text>
                        <Text>${cartTotal.toFixed(2)}</Text>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Text type="secondary">Shipping ({formData.shippingMethod?.name}):</Text>
                        <Text style={{ color: formData.shippingMethod?.price === 0 ? '#52c41a' : 'inherit' }}>
                          {formData.shippingMethod?.price === 0 ? 'FREE' : `$${formData.shippingMethod?.price}`}
                        </Text>
                      </div>
                      <Divider style={{ margin: '8px 0' }} />
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Text strong>Total:</Text>
                        <Text strong style={{ fontSize: 18, color: '#ff9900' }}>
                          ${(cartTotal + (formData.shippingMethod?.price || 0)).toFixed(2)}
                        </Text>
                      </div>
                    </Space>
                  </Card>

                  <Row gutter={16}>
                    <Col xs={24}>
                      <Form.Item
                        name="cardNumber"
                        label="Card Number"
                        rules={[{ required: true, message: 'Please enter card number' }]}
                      >
                        <Input size="large" placeholder="1234 5678 9012 3456" maxLength={19} />
                      </Form.Item>
                    </Col>
                    <Col xs={24}>
                      <Form.Item
                        name="cardName"
                        label="Cardholder Name"
                        rules={[{ required: true, message: 'Please enter cardholder name' }]}
                      >
                        <Input size="large" placeholder="John Doe" />
                      </Form.Item>
                    </Col>
                    <Col xs={12}>
                      <Form.Item
                        name="expiryDate"
                        label="Expiry Date"
                        rules={[{ required: true, message: 'Please enter expiry date' }]}
                      >
                        <Input size="large" placeholder="MM/YY" maxLength={5} />
                      </Form.Item>
                    </Col>
                    <Col xs={12}>
                      <Form.Item
                        name="cvv"
                        label="CVV"
                        rules={[{ required: true, message: 'Please enter CVV' }]}
                      >
                        <Input size="large" placeholder="123" maxLength={4} />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Alert
                    message="Secure Payment"
                    description="Your payment information is encrypted and secure. We never store your card details."
                    type="success"
                    showIcon
                    style={{ marginTop: 16 }}
                  />
                </div>
              )}

              {/* Step 3: Success */}
              {currentStep === 3 && (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <CheckCircleOutlined style={{ fontSize: 72, color: '#52c41a' }} />
                  <Title level={3} style={{ marginTop: 24 }}>
                    Order Placed Successfully!
                  </Title>
                  <Paragraph type="secondary" style={{ fontSize: 16 }}>
                    Thank you for your purchase. A confirmation email has been sent to {formData.email}
                  </Paragraph>

                  <Card style={{ marginTop: 32, textAlign: 'left' }}>
                    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                      <div>
                        <Text type="secondary">Order Number:</Text>
                        <br />
                        <Text strong style={{ fontSize: 18 }}>#ORD-{Date.now().toString().slice(-6)}</Text>
                      </div>
                      <Divider style={{ margin: '8px 0' }} />
                      <div>
                        <Text type="secondary">Estimated Delivery:</Text>
                        <br />
                        <Text strong>{formData.shippingMethod?.estimatedDays}</Text>
                      </div>
                    </Space>
                  </Card>

                  <Space size="middle" style={{ marginTop: 32 }}>
                    <Button type="primary" size="large">
                      Track Your Order
                    </Button>
                    <Button size="large">Continue Shopping</Button>
                  </Space>
                </div>
              )}
            </Form>

            {/* Navigation Buttons */}
            {currentStep < 3 && (
              <div style={{ marginTop: 24, textAlign: 'right' }}>
                <Space>
                  {currentStep > 0 && (
                    <Button onClick={handlePrevious} size="large">
                      Previous
                    </Button>
                  )}
                  {currentStep < 2 && (
                    <Button type="primary" onClick={handleNext} size="large">
                      Next
                    </Button>
                  )}
                  {currentStep === 2 && (
                    <Button
                      type="primary"
                      onClick={handleSubmitOrder}
                      loading={loading}
                      size="large"
                    >
                      Place Order
                    </Button>
                  )}
                </Space>
              </div>
            )}
          </Space>
        </Card>
      </div>

      {/* Shipping Method Selector Modal */}
      <ShippingMethodSelector
        visible={showShippingSelector}
        onCancel={() => setShowShippingSelector(false)}
        onSelect={handleShippingMethodSelect}
        cartTotal={cartTotal}
      />
    </div>
  );
};

export default GuestCheckoutPage;
