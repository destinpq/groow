import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'umi';
import { useAuthStore } from '@/store/auth';
import { authAPI } from '@/services/api';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    try {
      const response = await authAPI.login(values);
      console.log('Login response:', response);
      
      // The auth service already transforms the response structure
      const { token: access_token, refreshToken: refresh_token, user } = response;
      
      // Check if user data is available
      if (!user) {
        console.error('User data missing from response');
        throw new Error('User data not received in login response');
      }
      
      console.log('User data:', user);
      
      // Store tokens first
      if (typeof window !== 'undefined') {
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('refresh_token', refresh_token);
        localStorage.setItem('user', JSON.stringify(user));
      }
      
      // Create user object with proper name field
      const userWithName = {
        ...user,
        name: user.firstName && user.lastName 
          ? `${user.firstName} ${user.lastName}` 
          : user.email.split('@')[0] // fallback to email username if names are missing
      };
      
      // Use the auth store login method
      login(access_token, userWithName);
      message.success('Login successful!');

      // Redirect directly to the appropriate dashboard based on role
      if (user.role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else if (user.role === 'vendor') {
        navigate('/vendor/dashboard', { replace: true });
      } else {
        navigate('/customer/dashboard', { replace: true });
      }
    } catch (error: any) {
      console.error('Login error:', error);
      message.error(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    }}>
      <Card title="Login to Groow" style={{ width: 400 }}>
        <Form
          form={form}
          name="login"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' }
            ]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="Email" 
              autoComplete="email"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="Password" 
              autoComplete="current-password"
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Log in
            </Button>
          </Form.Item>
        </Form>
        <div style={{ textAlign: 'center' }}>
          Don't have an account? <a onClick={() => navigate('/register')}>Register now</a>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;
