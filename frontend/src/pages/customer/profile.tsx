import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Form,
  Input,
  Button,
  Upload,
  Avatar,
  message,
  Tabs,
  Table,
  Tag,
  Space,
  Modal,
  Descriptions,
  Switch,
} from 'antd';
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  LockOutlined,
  BellOutlined,
  CreditCardOutlined,
  UploadOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

// Mock data
const mockUser = {
  id: 1,
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  phone: '+1 (555) 123-4567',
  avatar: 'https://i.pravatar.cc/150?img=1',
  dateJoined: '2024-01-15',
};

const mockAddresses = [
  {
    id: 1,
    type: 'Home',
    name: 'John Doe',
    phone: '+1 (555) 123-4567',
    address: '123 Main Street, Apt 4B',
    city: 'New York',
    state: 'NY',
    zip: '10001',
    country: 'United States',
    isDefault: true,
  },
  {
    id: 2,
    type: 'Office',
    name: 'John Doe',
    phone: '+1 (555) 987-6543',
    address: '456 Corporate Blvd, Suite 200',
    city: 'New York',
    state: 'NY',
    zip: '10002',
    country: 'United States',
    isDefault: false,
  },
];

const mockPaymentMethods = [
  {
    id: 1,
    type: 'Visa',
    last4: '4242',
    expiry: '12/25',
    isDefault: true,
  },
  {
    id: 2,
    type: 'MasterCard',
    last4: '8888',
    expiry: '06/26',
    isDefault: false,
  },
];

const CustomerProfilePage: React.FC = () => {
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [addressModalVisible, setAddressModalVisible] = useState(false);
  const [editingAddress, setEditingAddress] = useState<any>(null);

  const handleUpdateProfile = (values: any) => {
    console.log('Update profile:', values);
    message.success('Profile updated successfully!');
  };

  const handleChangePassword = (values: any) => {
    console.log('Change password:', values);
    message.success('Password changed successfully!');
    passwordForm.resetFields();
  };

  const handleAvatarChange = (info: any) => {
    setFileList(info.fileList);
    if (info.file.status === 'done') {
      message.success('Avatar uploaded successfully!');
    }
  };

  const addressColumns = [
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: string, record: any) => (
        <Space>
          <Tag color={record.isDefault ? 'gold' : 'default'}>{type}</Tag>
          {record.isDefault && <Tag color="success">Default</Tag>}
        </Space>
      ),
    },
    {
      title: 'Address',
      key: 'fullAddress',
      render: (_: any, record: any) => (
        <div>
          <Text>{record.address}</Text>
          <br />
          <Text type="secondary">
            {record.city}, {record.state} {record.zip}
          </Text>
        </div>
      ),
    },
    {
      title: 'Contact',
      key: 'contact',
      render: (_: any, record: any) => (
        <div>
          <Text>{record.name}</Text>
          <br />
          <Text type="secondary">{record.phone}</Text>
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => {
              setEditingAddress(record);
              setAddressModalVisible(true);
            }}
          >
            Edit
          </Button>
          <Button type="link" danger icon={<DeleteOutlined />}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  const paymentColumns = [
    {
      title: 'Card Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: string, record: any) => (
        <Space>
          <CreditCardOutlined style={{ fontSize: 20 }} />
          <Text>{type}</Text>
          {record.isDefault && <Tag color="success">Default</Tag>}
        </Space>
      ),
    },
    {
      title: 'Card Number',
      dataIndex: 'last4',
      key: 'last4',
      render: (last4: string) => <Text>**** **** **** {last4}</Text>,
    },
    {
      title: 'Expiry',
      dataIndex: 'expiry',
      key: 'expiry',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Space>
          <Button type="link" icon={<EditOutlined />}>
            Edit
          </Button>
          <Button type="link" danger icon={<DeleteOutlined />}>
            Remove
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
      <Title level={2}>My Profile</Title>

      <Tabs defaultActiveKey="1" size="large">
        {/* Personal Information */}
        <TabPane tab={<span><UserOutlined />Personal Info</span>} key="1">
          <Card>
            <Row gutter={32}>
              <Col span={6} style={{ textAlign: 'center' }}>
                <Avatar size={120} src={mockUser.avatar} icon={<UserOutlined />} />
                <Upload
                  fileList={fileList}
                  onChange={handleAvatarChange}
                  beforeUpload={() => false}
                  maxCount={1}
                >
                  <Button icon={<UploadOutlined />} style={{ marginTop: 16 }} block>
                    Change Avatar
                  </Button>
                </Upload>
                <Text type="secondary" style={{ display: 'block', marginTop: 16 }}>
                  Member since {new Date(mockUser.dateJoined).toLocaleDateString()}
                </Text>
              </Col>

              <Col span={18}>
                <Form
                  form={form}
                  layout="vertical"
                  initialValues={mockUser}
                  onFinish={handleUpdateProfile}
                >
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        name="firstName"
                        label="First Name"
                        rules={[{ required: true }]}
                      >
                        <Input size="large" prefix={<UserOutlined />} />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="lastName"
                        label="Last Name"
                        rules={[{ required: true }]}
                      >
                        <Input size="large" prefix={<UserOutlined />} />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item
                    name="email"
                    label="Email"
                    rules={[{ required: true, type: 'email' }]}
                  >
                    <Input size="large" prefix={<MailOutlined />} />
                  </Form.Item>

                  <Form.Item name="phone" label="Phone Number">
                    <Input size="large" prefix={<PhoneOutlined />} />
                  </Form.Item>

                  <Form.Item>
                    <Button type="primary" htmlType="submit" size="large">
                      Update Profile
                    </Button>
                  </Form.Item>
                </Form>
              </Col>
            </Row>
          </Card>
        </TabPane>

        {/* Security */}
        <TabPane tab={<span><LockOutlined />Security</span>} key="2">
          <Card title="Change Password">
            <Form
              form={passwordForm}
              layout="vertical"
              onFinish={handleChangePassword}
              style={{ maxWidth: 500 }}
            >
              <Form.Item
                name="currentPassword"
                label="Current Password"
                rules={[{ required: true, message: 'Please enter your current password' }]}
              >
                <Input.Password size="large" prefix={<LockOutlined />} />
              </Form.Item>

              <Form.Item
                name="newPassword"
                label="New Password"
                rules={[
                  { required: true, message: 'Please enter a new password' },
                  { min: 8, message: 'Password must be at least 8 characters' },
                ]}
              >
                <Input.Password size="large" prefix={<LockOutlined />} />
              </Form.Item>

              <Form.Item
                name="confirmPassword"
                label="Confirm New Password"
                dependencies={['newPassword']}
                rules={[
                  { required: true, message: 'Please confirm your new password' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('newPassword') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Passwords do not match'));
                    },
                  }),
                ]}
              >
                <Input.Password size="large" prefix={<LockOutlined />} />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" size="large">
                  Change Password
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </TabPane>

        {/* Addresses */}
        <TabPane tab={<span><EnvironmentOutlined />Addresses</span>} key="3">
          <Card
            title="Saved Addresses"
            extra={
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  setEditingAddress(null);
                  setAddressModalVisible(true);
                }}
              >
                Add New Address
              </Button>
            }
          >
            <Table
              dataSource={mockAddresses}
              columns={addressColumns}
              rowKey="id"
              pagination={false}
            />
          </Card>
        </TabPane>

        {/* Payment Methods */}
        <TabPane tab={<span><CreditCardOutlined />Payment Methods</span>} key="4">
          <Card
            title="Saved Payment Methods"
            extra={
              <Button type="primary" icon={<PlusOutlined />}>
                Add Payment Method
              </Button>
            }
          >
            <Table
              dataSource={mockPaymentMethods}
              columns={paymentColumns}
              rowKey="id"
              pagination={false}
            />
          </Card>
        </TabPane>

        {/* Notifications */}
        <TabPane tab={<span><BellOutlined />Notifications</span>} key="5">
          <Card title="Notification Preferences">
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <Descriptions column={1}>
                <Descriptions.Item label="Order updates">
                  <Switch defaultChecked />
                </Descriptions.Item>
                <Descriptions.Item label="Promotional emails">
                  <Switch defaultChecked />
                </Descriptions.Item>
                <Descriptions.Item label="Product recommendations">
                  <Switch />
                </Descriptions.Item>
                <Descriptions.Item label="New arrivals">
                  <Switch defaultChecked />
                </Descriptions.Item>
                <Descriptions.Item label="Price drop alerts">
                  <Switch defaultChecked />
                </Descriptions.Item>
                <Descriptions.Item label="SMS notifications">
                  <Switch />
                </Descriptions.Item>
                <Descriptions.Item label="Push notifications">
                  <Switch defaultChecked />
                </Descriptions.Item>
              </Descriptions>

              <Button type="primary" size="large">
                Save Preferences
              </Button>
            </Space>
          </Card>
        </TabPane>
      </Tabs>

      {/* Address Modal */}
      <Modal
        title={editingAddress ? 'Edit Address' : 'Add New Address'}
        open={addressModalVisible}
        onCancel={() => setAddressModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form layout="vertical">
          <Form.Item name="type" label="Address Type" initialValue="Home">
            <Input placeholder="e.g., Home, Office, Other" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="name" label="Full Name" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="phone" label="Phone" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="address" label="Street Address" rules={[{ required: true }]}>
            <Input.TextArea rows={2} />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="city" label="City" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="state" label="State" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="zip" label="ZIP Code" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="country" label="Country" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="isDefault" valuePropName="checked">
            <Switch /> Set as default address
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Save Address
              </Button>
              <Button onClick={() => setAddressModalVisible(false)}>Cancel</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CustomerProfilePage;
