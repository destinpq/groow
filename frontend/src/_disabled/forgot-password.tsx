import { Form, Input, Button, Card, message } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import { useNavigate } from 'umi';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    try {
      message.success('Password reset link sent to your email!');
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      message.error('Failed to send reset link');
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
      <Card title="Reset Password" style={{ width: 400 }}>
        <p style={{ marginBottom: 24, color: '#666' }}>
          Enter your email address and we'll send you a link to reset your password.
        </p>
        <Form form={form} onFinish={onFinish} layout="vertical">
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Please enter a valid email' }
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email" size="large" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large">
              Send Reset Link
            </Button>
          </Form.Item>
        </Form>
        <div style={{ textAlign: 'center' }}>
          Remember your password? <a onClick={() => navigate('/login')}>Sign in</a>
        </div>
      </Card>
    </div>
  );
};

export default ForgotPassword;
