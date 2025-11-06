import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Select,
  Switch,
  message,
  Tag,
  Radio,
  Divider,
  Spin,
} from 'antd';
import {
  HomeOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  UserOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { addressAPI, Address } from '@/services/api/account';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const SavedAddressesPage: React.FC = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    try {
      setLoading(true);
      const response = await addressAPI.getAddresses();
      setAddresses(response.data || []);
    } catch (error) {
      console.error('Failed to load addresses:', error);
      message.error('Failed to load addresses');
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    setEditingAddress(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    form.setFieldsValue({
      ...address,
      name: `${address.firstName} ${address.lastName}`,
      label: address.title,
      zip: address.postalCode,
    });
    setIsModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    const address = addresses.find((a) => a.id === id);
    if (address?.isDefault) {
      message.warning('Cannot delete default address. Please set another address as default first.');
      return;
    }

    Modal.confirm({
      title: 'Delete Address',
      content: 'Are you sure you want to delete this address?',
      okText: 'Delete',
      okType: 'danger',
      onOk: async () => {
        try {
          await addressAPI.deleteAddress(id);
          await loadAddresses();
          message.success('Address deleted successfully');
        } catch (error) {
          message.error('Failed to delete address');
        }
      },
    });
  };

  const handleSetDefault = async (id: string) => {
    try {
      await addressAPI.setDefaultAddress(id, 'shipping');
      await loadAddresses();
      message.success('Default address updated');
    } catch (error) {
      message.error('Failed to update default address');
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      const addressData = {
        type: 'home' as 'home' | 'work' | 'billing' | 'shipping' | 'other',
        title: values.label || values.title,
        firstName: values.name?.split(' ')[0] || values.firstName,
        lastName: values.name?.split(' ').slice(1).join(' ') || values.lastName,
        addressLine1: values.addressLine1,
        addressLine2: values.addressLine2,
        city: values.city,
        state: values.state,
        postalCode: values.zip || values.postalCode,
        country: values.country,
        phone: values.phone,
        isDefault: values.isDefault || false,
      };

      if (editingAddress) {
        // Update existing address
        await addressAPI.updateAddress(editingAddress.id, addressData);
        message.success('Address updated successfully');
      } else {
        // Add new address
        await addressAPI.createAddress(addressData);
        message.success('Address added successfully');
      }

      await loadAddresses();
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error('Failed to save address');
    }
  };

  return (
    <Spin spinning={loading} tip="Loading addresses...">
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={3}>
            <EnvironmentOutlined style={{ color: '#1890ff' }} /> Saved Addresses
          </Title>
          <Paragraph type="secondary">
            Manage your shipping and billing addresses
          </Paragraph>
        </Col>
        <Col>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddNew}>
            Add New Address
          </Button>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {addresses.map((address) => (
          <Col xs={24} md={12} lg={8} key={address.id}>
            <Card
              hoverable
              style={{
                border: address.isDefault ? '2px solid #1890ff' : '1px solid #d9d9d9',
                position: 'relative',
              }}
            >
              {address.isDefault && (
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    background: '#1890ff',
                    color: 'white',
                    padding: '4px 12px',
                    borderBottomLeftRadius: 8,
                    fontSize: 12,
                  }}
                >
                  <CheckCircleOutlined style={{ marginRight: 4 }} />
                  Default
                </div>
              )}

              <div style={{ marginBottom: 16 }}>
                <Space>
                  <Tag color="blue" icon={<HomeOutlined />}>
                    {address.title}
                  </Tag>
                  {address.type === 'shipping' && <Tag color="green">Shipping</Tag>}
                  {address.type === 'billing' && <Tag color="purple">Billing</Tag>}
                </Space>
              </div>

              <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <UserOutlined style={{ color: '#1890ff' }} />
                  <Text strong>{address.firstName} {address.lastName}</Text>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <EnvironmentOutlined style={{ color: '#52c41a' }} />
                  <div>
                    <div>{address.addressLine1}</div>
                    {address.addressLine2 && <div>{address.addressLine2}</div>}
                    <div>
                      {address.city}, {address.state} {address.postalCode}
                    </div>
                    <div>{address.country}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <PhoneOutlined style={{ color: '#722ed1' }} />
                  <Text>{address.phone || 'N/A'}</Text>
                </div>
              </div>

              <Divider style={{ margin: '12px 0' }} />

              <Space>
                {!address.isDefault && (
                  <Button
                    type="link"
                    size="small"
                    icon={<CheckCircleOutlined />}
                    onClick={() => handleSetDefault(address.id)}
                  >
                    Set as Default
                  </Button>
                )}
                <Button
                  type="link"
                  size="small"
                  icon={<EditOutlined />}
                  onClick={() => handleEdit(address)}
                >
                  Edit
                </Button>
                {!address.isDefault && (
                  <Button
                    type="link"
                    danger
                    size="small"
                    icon={<DeleteOutlined />}
                    onClick={() => handleDelete(address.id)}
                  >
                    Delete
                  </Button>
                )}
              </Space>
            </Card>
          </Col>
        ))}

        {addresses.length === 0 && (
          <Col span={24}>
            <Card>
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <EnvironmentOutlined style={{ fontSize: 64, color: '#d9d9d9', marginBottom: 16 }} />
                <Title level={4}>No Saved Addresses</Title>
                <Paragraph type="secondary">
                  Add your first address to make checkout faster
                </Paragraph>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAddNew}>
                  Add Address
                </Button>
              </div>
            </Card>
          </Col>
        )}
      </Row>

      <Modal
        title={editingAddress ? 'Edit Address' : 'Add New Address'}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={700}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Address Label"
            name="label"
            rules={[{ required: true, message: 'Please enter address label' }]}
          >
            <Radio.Group buttonStyle="solid">
              <Radio.Button value="Home">
                <HomeOutlined /> Home
              </Radio.Button>
              <Radio.Button value="Work">Work</Radio.Button>
              <Radio.Button value="Other">Other</Radio.Button>
            </Radio.Group>
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Full Name"
                name="name"
                rules={[{ required: true, message: 'Please enter full name' }]}
              >
                <Input size="large" placeholder="John Doe" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Phone Number"
                name="phone"
                rules={[{ required: true, message: 'Please enter phone number' }]}
              >
                <Input size="large" placeholder="(555) 123-4567" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Address Line 1"
            name="addressLine1"
            rules={[{ required: true, message: 'Please enter address' }]}
          >
            <Input size="large" placeholder="Street address, P.O. box" />
          </Form.Item>

          <Form.Item label="Address Line 2 (Optional)" name="addressLine2">
            <Input size="large" placeholder="Apartment, suite, unit, building, floor, etc." />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="City"
                name="city"
                rules={[{ required: true, message: 'Please enter city' }]}
              >
                <Input size="large" placeholder="New York" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="State / Province"
                name="state"
                rules={[{ required: true, message: 'Please select state' }]}
              >
                <Select size="large" placeholder="Select state" showSearch>
                  <Option value="AL">Alabama</Option>
                  <Option value="AK">Alaska</Option>
                  <Option value="AZ">Arizona</Option>
                  <Option value="CA">California</Option>
                  <Option value="FL">Florida</Option>
                  <Option value="NY">New York</Option>
                  <Option value="TX">Texas</Option>
                  {/* Add more states as needed */}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="ZIP / Postal Code"
                name="zip"
                rules={[{ required: true, message: 'Please enter ZIP code' }]}
              >
                <Input size="large" placeholder="10001" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Country"
                name="country"
                rules={[{ required: true, message: 'Please select country' }]}
                initialValue="United States"
              >
                <Select size="large">
                  <Option value="United States">United States</Option>
                  <Option value="Canada">Canada</Option>
                  <Option value="United Kingdom">United Kingdom</Option>
                  <Option value="Australia">Australia</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Divider />

          <Form.Item label="Address Type" style={{ marginBottom: 8 }}>
            <Space direction="vertical">
              <Form.Item name="isShipping" valuePropName="checked" noStyle initialValue={true}>
                <Switch />
                <Text style={{ marginLeft: 8 }}>Use as shipping address</Text>
              </Form.Item>
              <Form.Item name="isBilling" valuePropName="checked" noStyle initialValue={false}>
                <Switch />
                <Text style={{ marginLeft: 8 }}>Use as billing address</Text>
              </Form.Item>
            </Space>
          </Form.Item>

          <Form.Item name="isDefault" valuePropName="checked" initialValue={false}>
            <Switch />
            <Text style={{ marginLeft: 8 }}>Set as default address</Text>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" size="large" icon={<CheckCircleOutlined />}>
                {editingAddress ? 'Update Address' : 'Save Address'}
              </Button>
              <Button size="large" onClick={() => setIsModalVisible(false)}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </Spin>
  );
};

export default SavedAddressesPage;
