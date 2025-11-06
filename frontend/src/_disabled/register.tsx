import { Form, Input, Button, Card, Select, Checkbox, message, Tabs } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined, ShopOutlined } from '@ant-design/icons';
import { useNavigate } from 'umi';
import { authAPI } from '@/services/api';

const { Option } = Select;

const RegisterPage = () => {
  const navigate = useNavigate();
  const [customerForm] = Form.useForm();
  const [vendorForm] = Form.useForm();

  const onCustomerRegister = async (values: any) => {
    try {
      await authAPI.register({ ...values, role: 'customer' });
      message.success('Registration successful! Please login.');
      navigate('/login');
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Registration failed');
    }
  };

  const onVendorRegister = async (values: any) => {
    try {
      await authAPI.register({ ...values, role: 'vendor' });
      message.success('Vendor registration submitted! We will verify your account soon.');
      navigate('/login');
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Registration failed');
    }
  };

  const customerTab = (
    <Form
      form={customerForm}
      name="customer-register"
      onFinish={onCustomerRegister}
      layout="vertical"
      autoComplete="off"
    >
      <Form.Item
        name="name"
        label="Full Name"
        rules={[{ required: true, message: 'Please enter your full name' }]}
      >
        <Input prefix={<UserOutlined />} placeholder="John Doe" size="large" />
      </Form.Item>

      <Form.Item
        name="email"
        label="Email"
        rules={[
          { required: true, message: 'Please enter your email' },
          { type: 'email', message: 'Please enter a valid email' }
        ]}
      >
        <Input prefix={<MailOutlined />} placeholder="john@example.com" size="large" />
      </Form.Item>

      <Form.Item
        name="phone"
        label="Phone Number"
        rules={[{ required: true, message: 'Please enter your phone number' }]}
      >
        <Input prefix={<PhoneOutlined />} placeholder="+1 234 567 8900" size="large" />
      </Form.Item>

      <Form.Item
        name="password"
        label="Password"
        rules={[
          { required: true, message: 'Please enter your password' },
          { min: 8, message: 'Password must be at least 8 characters' }
        ]}
      >
        <Input.Password prefix={<LockOutlined />} placeholder="••••••••" size="large" />
      </Form.Item>

      <Form.Item
        name="confirmPassword"
        label="Confirm Password"
        dependencies={['password']}
        rules={[
          { required: true, message: 'Please confirm your password' },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('Passwords do not match'));
            },
          }),
        ]}
      >
        <Input.Password prefix={<LockOutlined />} placeholder="••••••••" size="large" />
      </Form.Item>

      <Form.Item
        name="agreement"
        valuePropName="checked"
        rules={[
          { 
            validator: (_, value) => value 
              ? Promise.resolve() 
              : Promise.reject(new Error('Please accept the terms and conditions')) 
          }
        ]}
      >
        <Checkbox>
          I agree to the <a href="/terms">Terms and Conditions</a> and <a href="/privacy">Privacy Policy</a>
        </Checkbox>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" block size="large">
          Create Customer Account
        </Button>
      </Form.Item>
    </Form>
  );

  const vendorTab = (
    <Form
      form={vendorForm}
      name="vendor-register"
      onFinish={onVendorRegister}
      layout="vertical"
      autoComplete="off"
    >
      <Form.Item
        name="businessName"
        label="Business Name"
        rules={[{ required: true, message: 'Please enter your business name' }]}
      >
        <Input prefix={<ShopOutlined />} placeholder="ABC Company Ltd." size="large" />
      </Form.Item>

      <Form.Item
        name="name"
        label="Contact Person Name"
        rules={[{ required: true, message: 'Please enter contact person name' }]}
      >
        <Input prefix={<UserOutlined />} placeholder="John Doe" size="large" />
      </Form.Item>

      <Form.Item
        name="email"
        label="Business Email"
        rules={[
          { required: true, message: 'Please enter business email' },
          { type: 'email', message: 'Please enter a valid email' }
        ]}
      >
        <Input prefix={<MailOutlined />} placeholder="business@example.com" size="large" />
      </Form.Item>

      <Form.Item
        name="phone"
        label="Business Phone"
        rules={[{ required: true, message: 'Please enter business phone' }]}
      >
        <Input prefix={<PhoneOutlined />} placeholder="+1 234 567 8900" size="large" />
      </Form.Item>

      <Form.Item
        name="businessType"
        label="Business Type"
        rules={[{ required: true, message: 'Please select business type' }]}
      >
        <Select placeholder="Select business type" size="large">
          <Option value="manufacturer">Manufacturer</Option>
          <Option value="wholesaler">Wholesaler</Option>
          <Option value="distributor">Distributor</Option>
          <Option value="retailer">Retailer</Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="password"
        label="Password"
        rules={[
          { required: true, message: 'Please enter password' },
          { min: 8, message: 'Password must be at least 8 characters' }
        ]}
      >
        <Input.Password prefix={<LockOutlined />} placeholder="••••••••" size="large" />
      </Form.Item>

      <Form.Item
        name="confirmPassword"
        label="Confirm Password"
        dependencies={['password']}
        rules={[
          { required: true, message: 'Please confirm password' },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('Passwords do not match'));
            },
          }),
        ]}
      >
        <Input.Password prefix={<LockOutlined />} placeholder="••••••••" size="large" />
      </Form.Item>

      <Form.Item
        name="agreement"
        valuePropName="checked"
        rules={[
          { 
            validator: (_, value) => value 
              ? Promise.resolve() 
              : Promise.reject(new Error('Please accept the terms')) 
          }
        ]}
      >
        <Checkbox>
          I agree to the <a href="/vendor-terms">Vendor Terms</a> and <a href="/privacy">Privacy Policy</a>
        </Checkbox>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" block size="large">
          Register as Vendor
        </Button>
      </Form.Item>
    </Form>
  );

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '40px 20px',
    }}>
      <Card 
        title={
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ margin: 0 }}>Create Account</h2>
            <p style={{ color: '#666', margin: '8px 0 0 0' }}>Join Groow - India's Leading B2B & B2C Marketplace</p>
          </div>
        }
        style={{ width: '100%', maxWidth: 500 }}
      >
        <Tabs
          defaultActiveKey="customer"
          centered
          items={[
            {
              key: 'customer',
              label: (
                <span>
                  <UserOutlined />
                  Customer
                </span>
              ),
              children: customerTab,
            },
            {
              key: 'vendor',
              label: (
                <span>
                  <ShopOutlined />
                  Vendor/Business
                </span>
              ),
              children: vendorTab,
            },
          ]}
        />
        
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          Already have an account? <a onClick={() => navigate('/login')}>Sign in</a>
        </div>
      </Card>
    </div>
  );
};

export default RegisterPage;
