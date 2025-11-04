import { Row, Col, Card, Form, Input, Select, Radio, Button, Steps, Divider, Space, message, Spin } from 'antd';
import { CreditCardOutlined, HomeOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { useNavigate } from 'umi';
import { useCartStore } from '@/store/cartStore';
import { ordersAPI } from '@/services/api/orders';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, loading: cartLoading, fetchCart } = useCartStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [shippingForm] = Form.useForm();
  const [paymentForm] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [shippingData, setShippingData] = useState<any>(null);

  useEffect(() => {
    fetchCart();
  }, []);

  const cartItems = cart?.items || [];
  const subtotal = cart?.subtotal || 0;
  const shipping = cart?.shipping || 0;
  const tax = cart?.tax || 0;
  const total = cart?.total || 0;

  const handleShippingSubmit = (values: any) => {
    setShippingData(values);
    setCurrentStep(1);
  };

  const handlePaymentSubmit = async (values: any) => {
    if (!cart || cartItems.length === 0) {
      message.error('Your cart is empty');
      return;
    }

    try {
      setSubmitting(true);
      
      // Prepare address
      const address = {
        firstName: shippingData.firstName,
        lastName: shippingData.lastName,
        address1: shippingData.address,
        city: shippingData.city,
        state: shippingData.city, // Using city as state for now
        zipCode: shippingData.zipCode,
        country: shippingData.country,
        phone: shippingData.phone,
      };

      // Prepare order data
      const orderData = {
        shippingAddress: address,
        billingAddress: address, // Same as shipping for now
        paymentMethod: values.paymentMethod,
        items: cartItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      };

      // Create order
      const order = await ordersAPI.create(orderData);
      
      message.success('Order placed successfully!');
      
      // Redirect to order details or orders list
      setTimeout(() => {
        navigate(`/customer/orders/${order.id}`);
      }, 1500);
      
    } catch (error: any) {
      message.error(error.message || 'Failed to place order');
    } finally {
      setSubmitting(false);
    }
  };

  if (cartLoading && !cart) {
    return (
      <div style={{ padding: '80px 0', textAlign: 'center' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!cartLoading && cartItems.length === 0) {
    return (
      <div style={{ padding: '80px 0', textAlign: 'center' }}>
        <h2>Your cart is empty</h2>
        <Button type="primary" onClick={() => navigate('/products')} style={{ marginTop: 16 }}>
          Continue Shopping
        </Button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px' }}>
      <h1 style={{ marginBottom: 24 }}>Checkout</h1>
      
      <Steps
        current={currentStep}
        items={[
          { title: 'Shipping', icon: <HomeOutlined /> },
          { title: 'Payment', icon: <CreditCardOutlined /> },
          { title: 'Review', icon: <ShoppingCartOutlined /> },
        ]}
        style={{ marginBottom: 40 }}
      />

      <Row gutter={24}>
        <Col xs={24} lg={16}>
          {currentStep === 0 && (
            <Card title="Shipping Information">
              <Form form={shippingForm} layout="vertical" onFinish={handleShippingSubmit}>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item name="firstName" label="First Name" rules={[{ required: true }]}>
                      <Input size="large" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="lastName" label="Last Name" rules={[{ required: true }]}>
                      <Input size="large" />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
                  <Input size="large" />
                </Form.Item>

                <Form.Item name="phone" label="Phone" rules={[{ required: true }]}>
                  <Input size="large" />
                </Form.Item>

                <Form.Item name="address" label="Address" rules={[{ required: true }]}>
                  <Input.TextArea rows={3} />
                </Form.Item>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item name="city" label="City" rules={[{ required: true }]}>
                      <Input size="large" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="zipCode" label="ZIP Code" rules={[{ required: true }]}>
                      <Input size="large" />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item name="country" label="Country" rules={[{ required: true }]}>
                  <Select size="large">
                    <Select.Option value="us">United States</Select.Option>
                    <Select.Option value="ca">Canada</Select.Option>
                    <Select.Option value="uk">United Kingdom</Select.Option>
                  </Select>
                </Form.Item>

                <Form.Item>
                  <Button type="primary" htmlType="submit" size="large" block>
                    Continue to Payment
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          )}

          {currentStep === 1 && (
            <Card title="Payment Method">
              <Form form={paymentForm} layout="vertical" onFinish={handlePaymentSubmit}>
                <Form.Item name="paymentMethod" label="Select Payment Method" rules={[{ required: true }]}>
                  <Radio.Group size="large">
                    <Space direction="vertical">
                      <Radio value="card">Credit/Debit Card</Radio>
                      <Radio value="wallet">Wallet</Radio>
                      <Radio value="cod">Cash on Delivery</Radio>
                    </Space>
                  </Radio.Group>
                </Form.Item>

                <Divider />

                <h4>Card Information</h4>
                <Form.Item name="cardNumber" label="Card Number" rules={[{ required: true }]}>
                  <Input size="large" placeholder="1234 5678 9012 3456" />
                </Form.Item>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item name="expiry" label="Expiry Date" rules={[{ required: true }]}>
                      <Input size="large" placeholder="MM/YY" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="cvv" label="CVV" rules={[{ required: true }]}>
                      <Input size="large" placeholder="123" />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item name="cardName" label="Cardholder Name" rules={[{ required: true }]}>
                  <Input size="large" />
                </Form.Item>

                <Space>
                  <Button size="large" onClick={() => setCurrentStep(0)} disabled={submitting}>
                    Back
                  </Button>
                  <Button type="primary" htmlType="submit" size="large" loading={submitting}>
                    Place Order
                  </Button>
                </Space>
              </Form>
            </Card>
          )}
        </Col>

        <Col xs={24} lg={8}>
          <Card title="Order Summary" style={{ position: 'sticky', top: 24 }}>
            {cartItems.map(item => (
              <div key={item.id} style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>{item.productName} (x{item.quantity})</span>
                  <span>${item.total.toFixed(2)}</span>
                </div>
              </div>
            ))}
            
            <Divider />
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span>Shipping</span>
              <span>${shipping.toFixed(2)}</span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span>Tax</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            
            <Divider />
            
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 18, fontWeight: 600 }}>
              <span>Total</span>
              <span style={{ color: '#B12704' }}>${total.toFixed(2)}</span>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CheckoutPage;
