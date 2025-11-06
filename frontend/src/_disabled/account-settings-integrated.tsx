import React, { useState, useEffect } from 'react';
import { Card, Tabs, Form, Input, Button, Switch, Select, Upload, Avatar, Row, Col, Space, Divider, Modal, List, Tag, Badge, Progress, message, Radio, InputNumber, Popconfirm } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, LockOutlined, BellOutlined, SafetyCertificateOutlined, CreditCardOutlined, GiftOutlined, DeleteOutlined, EditOutlined, PlusOutlined, CameraOutlined, HomeOutlined, EnvironmentOutlined, GlobalOutlined, SecurityScanOutlined, EyeInvisibleOutlined, StarOutlined } from '@ant-design/icons';
import { accountSettingsAPI, type UserProfile, type Address, type NotificationPreferences, type PrivacySettings, type SecuritySettings, type PaymentMethod, type LoyaltyInfo } from '../services/api/accountSettingsAPI';
import './account-settings.less';

const { TabPane } = Tabs;
const { Option } = Select;
const { TextArea } = Input;
const { Password } = Input;

// Account Settings Component with Complete User Management
const AccountSettings: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [notificationPrefs, setNotificationPrefs] = useState<NotificationPreferences | null>(null);
  const [privacySettings, setPrivacySettings] = useState<PrivacySettings | null>(null);
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loyaltyInfo, setLoyaltyInfo] = useState<LoyaltyInfo | null>(null);
  
  const [activeTab, setActiveTab] = useState('profile');
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [profileForm] = Form.useForm();
  const [addressForm] = Form.useForm();
  const [passwordForm] = Form.useForm();

  // Load all account data
  useEffect(() => {
    loadAccountData();
  }, []);

  const loadAccountData = async () => {
    setLoading(true);
    try {
      const [
        profileResponse,
        addressesResponse,
        notificationResponse,
        privacyResponse,
        securityResponse,
        paymentResponse,
        loyaltyResponse
      ] = await Promise.all([
        accountSettingsAPI.getProfile(),
        accountSettingsAPI.getAddresses(),
        accountSettingsAPI.getNotificationPreferences(),
        accountSettingsAPI.getPrivacySettings(),
        accountSettingsAPI.getSecuritySettings(),
        accountSettingsAPI.getPaymentMethods(),
        accountSettingsAPI.getLoyaltyInfo()
      ]);

      if (profileResponse.success) {
        setProfile(profileResponse.data);
        profileForm.setFieldsValue(profileResponse.data);
      }

      if (addressesResponse.success) {
        setAddresses(addressesResponse.data);
      }

      if (notificationResponse.success) {
        setNotificationPrefs(notificationResponse.data);
      }

      if (privacyResponse.success) {
        setPrivacySettings(privacyResponse.data);
      }

      if (securityResponse.success) {
        setSecuritySettings(securityResponse.data);
      }

      if (paymentResponse.success) {
        setPaymentMethods(paymentResponse.data);
      }

      if (loyaltyResponse.success) {
        setLoyaltyInfo(loyaltyResponse.data);
      }
    } catch (error) {
      console.error('Error loading account data:', error);
      message.error('Failed to load account data');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (values: any) => {
    try {
      const response = await accountSettingsAPI.updateProfile(values);
      if (response.success) {
        message.success('Profile updated successfully');
        setProfile({ ...profile!, ...values });
      } else {
        message.error(response.message);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      message.error('Failed to update profile');
    }
  };

  const handleAddressSubmit = async (values: any) => {
    try {
      let response;
      if (editingAddress) {
        response = await accountSettingsAPI.updateAddress(editingAddress.id, values);
      } else {
        response = await accountSettingsAPI.addAddress(values);
      }

      if (response.success) {
        message.success(`Address ${editingAddress ? 'updated' : 'added'} successfully`);
        setShowAddressModal(false);
        setEditingAddress(null);
        addressForm.resetFields();
        
        // Reload addresses
        const addressesResponse = await accountSettingsAPI.getAddresses();
        if (addressesResponse.success) {
          setAddresses(addressesResponse.data);
        }
      } else {
        message.error(response.message);
      }
    } catch (error) {
      console.error('Error saving address:', error);
      message.error('Failed to save address');
    }
  };

  const handleDeleteAddress = async (id: string) => {
    try {
      const response = await accountSettingsAPI.deleteAddress(id);
      if (response.success) {
        message.success('Address deleted successfully');
        setAddresses(addresses.filter(addr => addr.id !== id));
      } else {
        message.error(response.message);
      }
    } catch (error) {
      console.error('Error deleting address:', error);
      message.error('Failed to delete address');
    }
  };

  const handlePasswordChange = async (values: any) => {
    try {
      const response = await accountSettingsAPI.changePassword(
        values.currentPassword,
        values.newPassword
      );
      
      if (response.success) {
        message.success('Password changed successfully');
        setShowPasswordModal(false);
        passwordForm.resetFields();
      } else {
        message.error(response.message);
      }
    } catch (error) {
      console.error('Error changing password:', error);
      message.error('Failed to change password');
    }
  };

  const handleNotificationUpdate = async (category: string, key: string, value: boolean) => {
    if (!notificationPrefs) return;

    const updatedPrefs = {
      ...notificationPrefs,
      [category]: {
        ...notificationPrefs[category as keyof NotificationPreferences],
        [key]: value
      }
    };

    try {
      const response = await accountSettingsAPI.updateNotificationPreferences(updatedPrefs);
      if (response.success) {
        setNotificationPrefs(updatedPrefs);
        message.success('Notification preferences updated');
      } else {
        message.error(response.message);
      }
    } catch (error) {
      console.error('Error updating notifications:', error);
      message.error('Failed to update notifications');
    }
  };

  const handlePrivacyUpdate = async (key: string, value: any) => {
    if (!privacySettings) return;

    const updatedSettings = {
      ...privacySettings,
      [key]: value
    };

    try {
      const response = await accountSettingsAPI.updatePrivacySettings(updatedSettings);
      if (response.success) {
        setPrivacySettings(updatedSettings);
        message.success('Privacy settings updated');
      } else {
        message.error(response.message);
      }
    } catch (error) {
      console.error('Error updating privacy:', error);
      message.error('Failed to update privacy settings');
    }
  };

  const renderProfileTab = () => (
    <Card>
      <Row gutter={[24, 24]}>
        <Col xs={24} md={8}>
          <div style={{ textAlign: 'center' }}>
            <Avatar size={120} src={profile?.avatar} icon={<UserOutlined />} />
            <div style={{ marginTop: 16 }}>
              <Upload showUploadList={false}>
                <Button icon={<CameraOutlined />}>Change Photo</Button>
              </Upload>
            </div>
          </div>
        </Col>
        <Col xs={24} md={16}>
          <Form
            form={profileForm}
            layout="vertical"
            onFinish={handleProfileUpdate}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="First Name"
                  name="firstName"
                  rules={[{ required: true, message: 'Please enter your first name' }]}
                >
                  <Input prefix={<UserOutlined />} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Last Name"
                  name="lastName"
                  rules={[{ required: true, message: 'Please enter your last name' }]}
                >
                  <Input prefix={<UserOutlined />} />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: 'Please enter your email' },
                { type: 'email', message: 'Please enter a valid email' }
              ]}
            >
              <Input 
                prefix={<MailOutlined />}
                suffix={profile?.isEmailVerified ? <Badge status="success" text="Verified" /> : <Badge status="warning" text="Unverified" />}
              />
            </Form.Item>

            <Form.Item label="Phone" name="phone">
              <Input 
                prefix={<PhoneOutlined />}
                suffix={profile?.isPhoneVerified ? <Badge status="success" text="Verified" /> : <Badge status="warning" text="Unverified" />}
              />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Date of Birth" name="dateOfBirth">
                  <Input type="date" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Gender" name="gender">
                  <Select placeholder="Select gender">
                    <Option value="male">Male</Option>
                    <Option value="female">Female</Option>
                    <Option value="other">Other</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                Update Profile
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </Card>
  );

  const renderAddressesTab = () => (
    <div>
      <div style={{ marginBottom: 16, textAlign: 'right' }}>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingAddress(null);
            addressForm.resetFields();
            setShowAddressModal(true);
          }}
        >
          Add New Address
        </Button>
      </div>

      <Row gutter={[16, 16]}>
        {addresses.map((address) => (
          <Col xs={24} md={12} key={address.id}>
            <Card
              size="small"
              title={
                <Space>
                  <HomeOutlined />
                  {address.name}
                  {address.isDefault && <Tag color="blue">Default</Tag>}
                </Space>
              }
              extra={
                <Space>
                  <Button
                    size="small"
                    icon={<EditOutlined />}
                    onClick={() => {
                      setEditingAddress(address);
                      addressForm.setFieldsValue(address);
                      setShowAddressModal(true);
                    }}
                  />
                  <Popconfirm
                    title="Are you sure you want to delete this address?"
                    onConfirm={() => handleDeleteAddress(address.id)}
                  >
                    <Button size="small" icon={<DeleteOutlined />} danger />
                  </Popconfirm>
                </Space>
              }
            >
              <div style={{ lineHeight: 1.6 }}>
                <div>{address.street}</div>
                <div>{address.city}, {address.state} {address.zipCode}</div>
                <div>{address.country}</div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Address Modal */}
      <Modal
        title={editingAddress ? 'Edit Address' : 'Add New Address'}
        open={showAddressModal}
        onCancel={() => {
          setShowAddressModal(false);
          setEditingAddress(null);
          addressForm.resetFields();
        }}
        footer={null}
      >
        <Form
          form={addressForm}
          layout="vertical"
          onFinish={handleAddressSubmit}
        >
          <Form.Item
            label="Address Name"
            name="name"
            rules={[{ required: true, message: 'Please enter address name' }]}
          >
            <Input placeholder="e.g., Home, Office" />
          </Form.Item>

          <Form.Item
            label="Address Type"
            name="type"
            rules={[{ required: true, message: 'Please select address type' }]}
          >
            <Select placeholder="Select address type">
              <Option value="home">Home</Option>
              <Option value="work">Work</Option>
              <Option value="other">Other</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Street Address"
            name="street"
            rules={[{ required: true, message: 'Please enter street address' }]}
          >
            <Input />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="City"
                name="city"
                rules={[{ required: true, message: 'Please enter city' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="State"
                name="state"
                rules={[{ required: true, message: 'Please enter state' }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="ZIP Code"
                name="zipCode"
                rules={[{ required: true, message: 'Please enter ZIP code' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Country"
                name="country"
                rules={[{ required: true, message: 'Please enter country' }]}
              >
                <Input defaultValue="USA" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="isDefault" valuePropName="checked">
            <Switch /> Set as default address
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setShowAddressModal(false)}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                {editingAddress ? 'Update' : 'Add'} Address
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );

  const renderNotificationsTab = () => (
    <div>
      <Row gutter={[24, 24]}>
        <Col xs={24} md={8}>
          <Card title={<Space><MailOutlined />Email Notifications</Space>} size="small">
            <Space direction="vertical" style={{ width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Order Updates</span>
                <Switch
                  checked={notificationPrefs?.email.orderUpdates}
                  onChange={(checked) => handleNotificationUpdate('email', 'orderUpdates', checked)}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Promotions</span>
                <Switch
                  checked={notificationPrefs?.email.promotions}
                  onChange={(checked) => handleNotificationUpdate('email', 'promotions', checked)}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Product Recommendations</span>
                <Switch
                  checked={notificationPrefs?.email.productRecommendations}
                  onChange={(checked) => handleNotificationUpdate('email', 'productRecommendations', checked)}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Newsletter</span>
                <Switch
                  checked={notificationPrefs?.email.newsletter}
                  onChange={(checked) => handleNotificationUpdate('email', 'newsletter', checked)}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Security Alerts</span>
                <Switch
                  checked={notificationPrefs?.email.securityAlerts}
                  onChange={(checked) => handleNotificationUpdate('email', 'securityAlerts', checked)}
                />
              </div>
            </Space>
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card title={<Space><PhoneOutlined />SMS Notifications</Space>} size="small">
            <Space direction="vertical" style={{ width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Order Updates</span>
                <Switch
                  checked={notificationPrefs?.sms.orderUpdates}
                  onChange={(checked) => handleNotificationUpdate('sms', 'orderUpdates', checked)}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Promotions</span>
                <Switch
                  checked={notificationPrefs?.sms.promotions}
                  onChange={(checked) => handleNotificationUpdate('sms', 'promotions', checked)}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Security Alerts</span>
                <Switch
                  checked={notificationPrefs?.sms.securityAlerts}
                  onChange={(checked) => handleNotificationUpdate('sms', 'securityAlerts', checked)}
                />
              </div>
            </Space>
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card title={<Space><BellOutlined />Push Notifications</Space>} size="small">
            <Space direction="vertical" style={{ width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Order Updates</span>
                <Switch
                  checked={notificationPrefs?.push.orderUpdates}
                  onChange={(checked) => handleNotificationUpdate('push', 'orderUpdates', checked)}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Promotions</span>
                <Switch
                  checked={notificationPrefs?.push.promotions}
                  onChange={(checked) => handleNotificationUpdate('push', 'promotions', checked)}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Product Recommendations</span>
                <Switch
                  checked={notificationPrefs?.push.productRecommendations}
                  onChange={(checked) => handleNotificationUpdate('push', 'productRecommendations', checked)}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Chat Messages</span>
                <Switch
                  checked={notificationPrefs?.push.chatMessages}
                  onChange={(checked) => handleNotificationUpdate('push', 'chatMessages', checked)}
                />
              </div>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );

  const renderPrivacyTab = () => (
    <Card>
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        <div>
          <h4><EyeInvisibleOutlined /> Profile Visibility</h4>
          <Radio.Group
            value={privacySettings?.profileVisibility}
            onChange={(e) => handlePrivacyUpdate('profileVisibility', e.target.value)}
          >
            <Radio value="public">Public - Anyone can see your profile</Radio>
            <Radio value="friends">Friends Only - Only your friends can see your profile</Radio>
            <Radio value="private">Private - Only you can see your profile</Radio>
          </Radio.Group>
        </div>

        <Divider />

        <div>
          <h4><GlobalOutlined /> Data Sharing</h4>
          <Space direction="vertical" style={{ width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Show Purchase History</span>
              <Switch
                checked={privacySettings?.showPurchaseHistory}
                onChange={(checked) => handlePrivacyUpdate('showPurchaseHistory', checked)}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Show Wishlist</span>
              <Switch
                checked={privacySettings?.showWishlist}
                onChange={(checked) => handlePrivacyUpdate('showWishlist', checked)}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Allow Product Recommendations</span>
              <Switch
                checked={privacySettings?.allowProductRecommendations}
                onChange={(checked) => handlePrivacyUpdate('allowProductRecommendations', checked)}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Share Data with Partners</span>
              <Switch
                checked={privacySettings?.shareDataWithPartners}
                onChange={(checked) => handlePrivacyUpdate('shareDataWithPartners', checked)}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Allow Location Tracking</span>
              <Switch
                checked={privacySettings?.allowLocationTracking}
                onChange={(checked) => handlePrivacyUpdate('allowLocationTracking', checked)}
              />
            </div>
          </Space>
        </div>
      </Space>
    </Card>
  );

  const renderSecurityTab = () => (
    <div>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card title={<Space><SafetyCertificateOutlined />Security Settings</Space>} size="small">
            <Space direction="vertical" style={{ width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Two-Factor Authentication</span>
                <Switch checked={securitySettings?.twoFactorEnabled} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Login Notifications</span>
                <Switch checked={securitySettings?.loginNotifications} />
              </div>
              <div>
                <span>Session Timeout (minutes):</span>
                <InputNumber
                  min={5}
                  max={480}
                  value={securitySettings?.sessionTimeout}
                  style={{ marginLeft: 8, width: 80 }}
                />
              </div>
              <Button 
                icon={<LockOutlined />}
                onClick={() => setShowPasswordModal(true)}
              >
                Change Password
              </Button>
            </Space>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card title={<Space><SecurityScanOutlined />Trusted Devices</Space>} size="small">
            <List
              size="small"
              dataSource={securitySettings?.trustedDevices || []}
              renderItem={(device) => (
                <List.Item
                  actions={[
                    device.isCurrent ? <Tag color="green">Current</Tag> : 
                    <Button size="small" danger>Remove</Button>
                  ]}
                >
                  <List.Item.Meta
                    title={device.name}
                    description={`${device.type} • Last used: ${new Date(device.lastUsed).toLocaleDateString()}`}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      {/* Password Change Modal */}
      <Modal
        title="Change Password"
        open={showPasswordModal}
        onCancel={() => {
          setShowPasswordModal(false);
          passwordForm.resetFields();
        }}
        footer={null}
      >
        <Form
          form={passwordForm}
          layout="vertical"
          onFinish={handlePasswordChange}
        >
          <Form.Item
            label="Current Password"
            name="currentPassword"
            rules={[{ required: true, message: 'Please enter your current password' }]}
          >
            <Password />
          </Form.Item>

          <Form.Item
            label="New Password"
            name="newPassword"
            rules={[
              { required: true, message: 'Please enter your new password' },
              { min: 8, message: 'Password must be at least 8 characters' }
            ]}
          >
            <Password />
          </Form.Item>

          <Form.Item
            label="Confirm New Password"
            name="confirmPassword"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: 'Please confirm your new password' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('The passwords do not match!'));
                }
              })
            ]}
          >
            <Password />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setShowPasswordModal(false)}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                Change Password
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );

  const renderPaymentTab = () => (
    <div>
      <div style={{ marginBottom: 16, textAlign: 'right' }}>
        <Button type="primary" icon={<PlusOutlined />}>
          Add Payment Method
        </Button>
      </div>

      <Row gutter={[16, 16]}>
        {paymentMethods.map((method) => (
          <Col xs={24} md={12} key={method.id}>
            <Card
              size="small"
              title={
                <Space>
                  <CreditCardOutlined />
                  {method.nickname || `${method.brand} ****${method.last4}`}
                  {method.isDefault && <Tag color="blue">Default</Tag>}
                </Space>
              }
              extra={
                <Space>
                  <Button size="small" icon={<EditOutlined />} />
                  <Button size="small" icon={<DeleteOutlined />} danger />
                </Space>
              }
            >
              <div>
                <div><strong>{method.brand}</strong> ending in {method.last4}</div>
                {method.expiryMonth && method.expiryYear && (
                  <div style={{ color: '#666' }}>
                    Expires {method.expiryMonth.toString().padStart(2, '0')}/{method.expiryYear}
                  </div>
                )}
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );

  const renderLoyaltyTab = () => (
    <Card>
      <Row gutter={[24, 24]}>
        <Col xs={24} md={8}>
          <div style={{ textAlign: 'center' }}>
            <Avatar size={80} icon={<StarOutlined />} style={{ backgroundColor: '#faad14' }} />
            <h3 style={{ marginTop: 16, color: '#faad14', textTransform: 'capitalize' }}>
              {loyaltyInfo?.tier} Member
            </h3>
          </div>
        </Col>
        <Col xs={24} md={16}>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1890ff' }}>
                  {loyaltyInfo?.points.toLocaleString()}
                </div>
                <div style={{ color: '#666' }}>Available Points</div>
              </div>
            </Col>
            <Col span={12}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#52c41a' }}>
                  ${loyaltyInfo?.lifetimeSpent.toLocaleString()}
                </div>
                <div style={{ color: '#666' }}>Lifetime Spent</div>
              </div>
            </Col>
          </Row>

          <Divider />

          <div>
            <div style={{ marginBottom: 8 }}>
              Progress to {loyaltyInfo?.tier === 'platinum' ? 'Platinum Max' : 'Next Tier'}
            </div>
            <Progress
              percent={loyaltyInfo ? Math.round((loyaltyInfo.points / (loyaltyInfo.points + loyaltyInfo.nextTierPoints)) * 100) : 0}
              strokeColor="#faad14"
            />
            <div style={{ fontSize: '12px', color: '#666', marginTop: 4 }}>
              {loyaltyInfo?.nextTierPoints} more points needed
            </div>
          </div>

          {loyaltyInfo?.expiringPoints?.amount && loyaltyInfo.expiringPoints.amount > 0 && (
            <div style={{ marginTop: 16, padding: 12, backgroundColor: '#fff2e8', borderRadius: 6 }}>
              <div style={{ color: '#fa8c16', fontWeight: 500 }}>
                {loyaltyInfo.expiringPoints.amount} points expiring soon
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>
                Expires on {new Date(loyaltyInfo.expiringPoints.expiryDate).toLocaleDateString()}
              </div>
            </div>
          )}
        </Col>
      </Row>
    </Card>
  );

  const renderDangerZone = () => (
    <Card title="Danger Zone" style={{ borderColor: '#ff4d4f' }}>
      <Space direction="vertical" style={{ width: '100%' }}>
        <div>
          <h4 style={{ color: '#ff4d4f' }}>Delete Account</h4>
          <p style={{ color: '#666' }}>
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => setShowDeleteModal(true)}
          >
            Delete Account
          </Button>
        </div>
      </Space>

      {/* Delete Account Modal */}
      <Modal
        title="Delete Account"
        open={showDeleteModal}
        onCancel={() => setShowDeleteModal(false)}
        footer={null}
      >
        <div style={{ marginBottom: 16 }}>
          <p style={{ color: '#ff4d4f', fontWeight: 500 }}>
            This action cannot be undone. This will permanently delete your account and remove your data from our servers.
          </p>
        </div>
        
        <Form layout="vertical">
          <Form.Item label="Password" required>
            <Password placeholder="Enter your password to confirm" />
          </Form.Item>
          
          <Form.Item label="Reason for leaving (optional)">
            <TextArea rows={3} placeholder="Help us improve by telling us why you're leaving" />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setShowDeleteModal(false)}>
                Cancel
              </Button>
              <Button type="primary" danger>
                Delete Account
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );

  if (loading) {
    return <div style={{ padding: 24, textAlign: 'center' }}>Loading account settings...</div>;
  }

  return (
    <div className="account-settings" style={{ padding: '24px', maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: '28px', fontWeight: 600, marginBottom: 8 }}>
          Account Settings
        </h1>
        <p style={{ color: '#666', fontSize: '16px' }}>
          Manage your account preferences, security, and personal information
        </p>
      </div>

      <Tabs activeKey={activeTab} onChange={setActiveTab} size="large">
        <TabPane tab={<Space><UserOutlined />Profile</Space>} key="profile">
          {renderProfileTab()}
        </TabPane>

        <TabPane tab={<Space><EnvironmentOutlined />Addresses</Space>} key="addresses">
          {renderAddressesTab()}
        </TabPane>

        <TabPane tab={<Space><BellOutlined />Notifications</Space>} key="notifications">
          {renderNotificationsTab()}
        </TabPane>

        <TabPane tab={<Space><EyeInvisibleOutlined />Privacy</Space>} key="privacy">
          {renderPrivacyTab()}
        </TabPane>

        <TabPane tab={<Space><SafetyCertificateOutlined />Security</Space>} key="security">
          {renderSecurityTab()}
        </TabPane>

        <TabPane tab={<Space><CreditCardOutlined />Payment</Space>} key="payment">
          {renderPaymentTab()}
        </TabPane>

        <TabPane tab={<Space><GiftOutlined />Loyalty</Space>} key="loyalty">
          {renderLoyaltyTab()}
        </TabPane>

        <TabPane tab={<Space><DeleteOutlined />Danger Zone</Space>} key="danger">
          {renderDangerZone()}
        </TabPane>
      </Tabs>
    </div>
  );
};

export default AccountSettings;