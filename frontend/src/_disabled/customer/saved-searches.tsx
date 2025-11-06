import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Button,
  Form,
  Input,
  Select,
  InputNumber,
  Switch,
  message,
  List,
  Space,
  Tag,
  Modal,
  Badge,
  Alert,
  Divider,
  Checkbox,
  Statistic,
  Tooltip,
} from 'antd';
import {
  SearchOutlined,
  PlusOutlined,
  BellOutlined,
  DeleteOutlined,
  EditOutlined,
  StarOutlined,
  FilterOutlined,
  MailOutlined,
  MobileOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const { Title, Text, Paragraph } = Typography;

interface SavedSearch {
  id: number;
  name: string;
  query: string;
  filters: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    brand?: string;
    minRating?: number;
    inStock?: boolean;
  };
  alertEnabled: boolean;
  alertFrequency: 'instant' | 'daily' | 'weekly';
  alertChannels: ('email' | 'sms' | 'push')[];
  createdDate: string;
  lastChecked: string;
  newMatches: number;
  totalMatches: number;
}

const mockSavedSearches: SavedSearch[] = [
  {
    id: 1,
    name: 'Gaming Laptops Under $1500',
    query: 'gaming laptop',
    filters: {
      category: 'Computers',
      minPrice: 800,
      maxPrice: 1500,
      minRating: 4,
      inStock: true,
    },
    alertEnabled: true,
    alertFrequency: 'daily',
    alertChannels: ['email', 'push'],
    createdDate: dayjs().subtract(15, 'days').format('YYYY-MM-DD'),
    lastChecked: dayjs().subtract(2, 'hours').format('YYYY-MM-DD HH:mm'),
    newMatches: 3,
    totalMatches: 24,
  },
  {
    id: 2,
    name: 'Nike Running Shoes',
    query: 'running shoes',
    filters: {
      brand: 'Nike',
      category: 'Sports',
      minRating: 4.5,
      inStock: true,
    },
    alertEnabled: true,
    alertFrequency: 'instant',
    alertChannels: ['email', 'sms', 'push'],
    createdDate: dayjs().subtract(7, 'days').format('YYYY-MM-DD'),
    lastChecked: dayjs().subtract(1, 'hour').format('YYYY-MM-DD HH:mm'),
    newMatches: 1,
    totalMatches: 15,
  },
  {
    id: 3,
    name: 'Wireless Headphones Sale',
    query: 'wireless headphones',
    filters: {
      category: 'Electronics',
      maxPrice: 200,
      minRating: 4,
    },
    alertEnabled: false,
    alertFrequency: 'weekly',
    alertChannels: ['email'],
    createdDate: dayjs().subtract(30, 'days').format('YYYY-MM-DD'),
    lastChecked: dayjs().subtract(1, 'day').format('YYYY-MM-DD HH:mm'),
    newMatches: 0,
    totalMatches: 42,
  },
];

const SavedSearchesPage: React.FC = () => {
  const [searches, setSearches] = useState<SavedSearch[]>(mockSavedSearches);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState<boolean>(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState<boolean>(false);
  const [selectedSearch, setSelectedSearch] = useState<SavedSearch | null>(null);
  const [form] = Form.useForm();

  const handleCreateSearch = (values: any) => {
    const newSearch: SavedSearch = {
      id: searches.length + 1,
      name: values.name,
      query: values.query,
      filters: {
        category: values.category,
        minPrice: values.minPrice,
        maxPrice: values.maxPrice,
        brand: values.brand,
        minRating: values.minRating,
        inStock: values.inStock,
      },
      alertEnabled: values.alertEnabled !== false,
      alertFrequency: values.alertFrequency || 'daily',
      alertChannels: values.alertChannels || ['email'],
      createdDate: dayjs().format('YYYY-MM-DD'),
      lastChecked: dayjs().format('YYYY-MM-DD HH:mm'),
      newMatches: 0,
      totalMatches: 0,
    };

    setSearches([...searches, newSearch]);
    message.success('Saved search created!');
    setIsCreateModalVisible(false);
    form.resetFields();
  };

  const handleUpdateSearch = (values: any) => {
    if (!selectedSearch) return;

    const updatedSearch: SavedSearch = {
      ...selectedSearch,
      name: values.name,
      query: values.query,
      filters: {
        category: values.category,
        minPrice: values.minPrice,
        maxPrice: values.maxPrice,
        brand: values.brand,
        minRating: values.minRating,
        inStock: values.inStock,
      },
      alertEnabled: values.alertEnabled,
      alertFrequency: values.alertFrequency,
      alertChannels: values.alertChannels,
    };

    setSearches(searches.map((s) => (s.id === selectedSearch.id ? updatedSearch : s)));
    message.success('Saved search updated!');
    setIsEditModalVisible(false);
    setSelectedSearch(null);
    form.resetFields();
  };

  const handleDeleteSearch = (id: number) => {
    Modal.confirm({
      title: 'Delete Saved Search',
      content: 'Are you sure you want to delete this saved search?',
      okText: 'Delete',
      okType: 'danger',
      onOk: () => {
        setSearches(searches.filter((s) => s.id !== id));
        message.success('Saved search deleted');
      },
    });
  };

  const handleToggleAlert = (id: number) => {
    setSearches(
      searches.map((s) =>
        s.id === id ? { ...s, alertEnabled: !s.alertEnabled } : s
      )
    );
    const search = searches.find((s) => s.id === id);
    message.success(
      search?.alertEnabled ? 'Alerts disabled' : 'Alerts enabled'
    );
  };

  const handleEditSearch = (search: SavedSearch) => {
    setSelectedSearch(search);
    form.setFieldsValue({
      name: search.name,
      query: search.query,
      ...search.filters,
      alertEnabled: search.alertEnabled,
      alertFrequency: search.alertFrequency,
      alertChannels: search.alertChannels,
    });
    setIsEditModalVisible(true);
  };

  const totalSearches = searches.length;
  const activeAlerts = searches.filter((s) => s.alertEnabled).length;
  const totalNewMatches = searches.reduce((sum, s) => sum + s.newMatches, 0);
  const totalMatches = searches.reduce((sum, s) => sum + s.totalMatches, 0);

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={3}>
            <SearchOutlined style={{ color: '#1890ff' }} /> Saved Searches
          </Title>
          <Paragraph type="secondary">
            Save your searches and get alerts for new matching products
          </Paragraph>
        </Col>
        <Col>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            onClick={() => setIsCreateModalVisible(true)}
          >
            Create Saved Search
          </Button>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Saved Searches"
              value={totalSearches}
              prefix={<SearchOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Active Alerts"
              value={activeAlerts}
              prefix={<BellOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="New Matches"
              value={totalNewMatches}
              prefix={<StarOutlined />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Matches"
              value={totalMatches}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      {totalNewMatches > 0 && (
        <Alert
          message={`🎉 ${totalNewMatches} new products match your saved searches!`}
          description="Click on a search to view new matches"
          type="success"
          showIcon={false}
          closable
          style={{ marginBottom: 24 }}
        />
      )}

      <Card title="Your Saved Searches">
        <List
          dataSource={searches}
          locale={{ emptyText: 'No saved searches yet. Create one to get started!' }}
          renderItem={(search) => (
            <List.Item
              actions={[
                <Tooltip title={search.alertEnabled ? 'Disable alerts' : 'Enable alerts'}>
                  <Button
                    type={search.alertEnabled ? 'primary' : 'default'}
                    icon={<BellOutlined />}
                    onClick={() => handleToggleAlert(search.id)}
                  >
                    {search.alertEnabled ? 'Alerts On' : 'Alerts Off'}
                  </Button>
                </Tooltip>,
                <Button
                  icon={<EditOutlined />}
                  onClick={() => handleEditSearch(search)}
                >
                  Edit
                </Button>,
                <Button
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => handleDeleteSearch(search.id)}
                >
                  Delete
                </Button>,
              ]}
            >
              <List.Item.Meta
                avatar={
                  <Badge count={search.newMatches} offset={[-5, 5]}>
                    <div
                      style={{
                        width: 60,
                        height: 60,
                        borderRadius: 8,
                        background: search.alertEnabled ? '#1890ff' : '#d9d9d9',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <SearchOutlined style={{ fontSize: 24, color: '#fff' }} />
                    </div>
                  </Badge>
                }
                title={
                  <Space>
                    <Text strong style={{ fontSize: 16 }}>
                      {search.name}
                    </Text>
                    {search.alertEnabled && (
                      <Tag color="green" icon={<BellOutlined />}>
                        Alerts Active
                      </Tag>
                    )}
                    {search.newMatches > 0 && (
                      <Tag color="orange">{search.newMatches} New</Tag>
                    )}
                  </Space>
                }
                description={
                  <Space direction="vertical" style={{ width: '100%' }} size="small">
                    <div>
                      <Text type="secondary">
                        <SearchOutlined /> Query: "{search.query}"
                      </Text>
                    </div>

                    <Space wrap>
                      {search.filters.category && (
                        <Tag color="blue">Category: {search.filters.category}</Tag>
                      )}
                      {search.filters.brand && (
                        <Tag color="purple">Brand: {search.filters.brand}</Tag>
                      )}
                      {(search.filters.minPrice || search.filters.maxPrice) && (
                        <Tag color="green">
                          Price: ${search.filters.minPrice || 0} - $
                          {search.filters.maxPrice || '∞'}
                        </Tag>
                      )}
                      {search.filters.minRating && (
                        <Tag color="gold">
                          <StarOutlined /> {search.filters.minRating}+ Rating
                        </Tag>
                      )}
                      {search.filters.inStock && (
                        <Tag color="cyan" icon={<CheckCircleOutlined />}>
                          In Stock
                        </Tag>
                      )}
                    </Space>

                    <div>
                      <Space size="large">
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          {search.totalMatches} total matches
                        </Text>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          Last checked: {dayjs(search.lastChecked).fromNow()}
                        </Text>
                      </Space>
                    </div>

                    {search.alertEnabled && (
                      <div>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          <BellOutlined /> Alerts: {search.alertFrequency} via{' '}
                          {search.alertChannels
                            .map((c) => {
                              const icons = {
                                email: <MailOutlined />,
                                sms: <MobileOutlined />,
                                push: <BellOutlined />,
                              };
                              return (
                                <span key={c} style={{ marginLeft: 4 }}>
                                  {icons[c]}
                                </span>
                              );
                            })}
                        </Text>
                      </div>
                    )}
                  </Space>
                }
              />
            </List.Item>
          )}
        />
      </Card>

      <Modal
        title="Create Saved Search"
        open={isCreateModalVisible}
        onCancel={() => {
          setIsCreateModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        width={700}
      >
        <Form form={form} layout="vertical" onFinish={handleCreateSearch}>
          <Form.Item
            label="Search Name"
            name="name"
            rules={[{ required: true, message: 'Please enter a name' }]}
          >
            <Input size="large" placeholder="e.g., Gaming Laptops Under $1500" />
          </Form.Item>

          <Form.Item
            label="Search Query"
            name="query"
            rules={[{ required: true, message: 'Please enter a search query' }]}
          >
            <Input
              size="large"
              placeholder="e.g., gaming laptop"
              prefix={<SearchOutlined />}
            />
          </Form.Item>

          <Divider>Filters</Divider>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Category" name="category">
                <Select size="large" placeholder="All categories" allowClear>
                  <Select.Option value="Electronics">Electronics</Select.Option>
                  <Select.Option value="Computers">Computers</Select.Option>
                  <Select.Option value="Sports">Sports</Select.Option>
                  <Select.Option value="Fashion">Fashion</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Brand" name="brand">
                <Input size="large" placeholder="Any brand" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Min Price" name="minPrice">
                <InputNumber
                  size="large"
                  style={{ width: '100%' }}
                  prefix="$"
                  min={0}
                  placeholder="0"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Max Price" name="maxPrice">
                <InputNumber
                  size="large"
                  style={{ width: '100%' }}
                  prefix="$"
                  min={0}
                  placeholder="No limit"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Min Rating" name="minRating">
                <Select size="large" placeholder="Any rating" allowClear>
                  <Select.Option value={4.5}>4.5+ Stars</Select.Option>
                  <Select.Option value={4}>4+ Stars</Select.Option>
                  <Select.Option value={3}>3+ Stars</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Availability" name="inStock" valuePropName="checked">
                <Switch
                  checkedChildren="In Stock Only"
                  unCheckedChildren="All Products"
                />
              </Form.Item>
            </Col>
          </Row>

          <Divider>Alert Settings</Divider>

          <Form.Item
            label="Enable Alerts"
            name="alertEnabled"
            valuePropName="checked"
            initialValue={true}
          >
            <Switch checkedChildren="On" unCheckedChildren="Off" />
          </Form.Item>

          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) =>
              prevValues.alertEnabled !== currentValues.alertEnabled
            }
          >
            {({ getFieldValue }) =>
              getFieldValue('alertEnabled') ? (
                <>
                  <Form.Item
                    label="Alert Frequency"
                    name="alertFrequency"
                    initialValue="daily"
                  >
                    <Select size="large">
                      <Select.Option value="instant">
                        <BellOutlined /> Instant (as soon as new matches appear)
                      </Select.Option>
                      <Select.Option value="daily">
                        <MailOutlined /> Daily Digest
                      </Select.Option>
                      <Select.Option value="weekly">
                        <MailOutlined /> Weekly Summary
                      </Select.Option>
                    </Select>
                  </Form.Item>

                  <Form.Item
                    label="Alert Channels"
                    name="alertChannels"
                    initialValue={['email']}
                  >
                    <Checkbox.Group>
                      <Space direction="vertical">
                        <Checkbox value="email">
                          <MailOutlined /> Email Notifications
                        </Checkbox>
                        <Checkbox value="sms">
                          <MobileOutlined /> SMS Alerts
                        </Checkbox>
                        <Checkbox value="push">
                          <BellOutlined /> Push Notifications
                        </Checkbox>
                      </Space>
                    </Checkbox.Group>
                  </Form.Item>
                </>
              ) : null
            }
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" size="large" icon={<PlusOutlined />}>
                Create Saved Search
              </Button>
              <Button
                size="large"
                onClick={() => {
                  setIsCreateModalVisible(false);
                  form.resetFields();
                }}
              >
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Edit Saved Search"
        open={isEditModalVisible}
        onCancel={() => {
          setIsEditModalVisible(false);
          setSelectedSearch(null);
          form.resetFields();
        }}
        footer={null}
        width={700}
      >
        <Form form={form} layout="vertical" onFinish={handleUpdateSearch}>
          <Form.Item
            label="Search Name"
            name="name"
            rules={[{ required: true, message: 'Please enter a name' }]}
          >
            <Input size="large" placeholder="e.g., Gaming Laptops Under $1500" />
          </Form.Item>

          <Form.Item
            label="Search Query"
            name="query"
            rules={[{ required: true, message: 'Please enter a search query' }]}
          >
            <Input
              size="large"
              placeholder="e.g., gaming laptop"
              prefix={<SearchOutlined />}
            />
          </Form.Item>

          <Divider>Filters</Divider>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Category" name="category">
                <Select size="large" placeholder="All categories" allowClear>
                  <Select.Option value="Electronics">Electronics</Select.Option>
                  <Select.Option value="Computers">Computers</Select.Option>
                  <Select.Option value="Sports">Sports</Select.Option>
                  <Select.Option value="Fashion">Fashion</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Brand" name="brand">
                <Input size="large" placeholder="Any brand" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Min Price" name="minPrice">
                <InputNumber
                  size="large"
                  style={{ width: '100%' }}
                  prefix="$"
                  min={0}
                  placeholder="0"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Max Price" name="maxPrice">
                <InputNumber
                  size="large"
                  style={{ width: '100%' }}
                  prefix="$"
                  min={0}
                  placeholder="No limit"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Min Rating" name="minRating">
                <Select size="large" placeholder="Any rating" allowClear>
                  <Select.Option value={4.5}>4.5+ Stars</Select.Option>
                  <Select.Option value={4}>4+ Stars</Select.Option>
                  <Select.Option value={3}>3+ Stars</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Availability" name="inStock" valuePropName="checked">
                <Switch
                  checkedChildren="In Stock Only"
                  unCheckedChildren="All Products"
                />
              </Form.Item>
            </Col>
          </Row>

          <Divider>Alert Settings</Divider>

          <Form.Item label="Enable Alerts" name="alertEnabled" valuePropName="checked">
            <Switch checkedChildren="On" unCheckedChildren="Off" />
          </Form.Item>

          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) =>
              prevValues.alertEnabled !== currentValues.alertEnabled
            }
          >
            {({ getFieldValue }) =>
              getFieldValue('alertEnabled') ? (
                <>
                  <Form.Item label="Alert Frequency" name="alertFrequency">
                    <Select size="large">
                      <Select.Option value="instant">
                        <BellOutlined /> Instant
                      </Select.Option>
                      <Select.Option value="daily">
                        <MailOutlined /> Daily
                      </Select.Option>
                      <Select.Option value="weekly">
                        <MailOutlined /> Weekly
                      </Select.Option>
                    </Select>
                  </Form.Item>

                  <Form.Item label="Alert Channels" name="alertChannels">
                    <Checkbox.Group>
                      <Space direction="vertical">
                        <Checkbox value="email">
                          <MailOutlined /> Email
                        </Checkbox>
                        <Checkbox value="sms">
                          <MobileOutlined /> SMS
                        </Checkbox>
                        <Checkbox value="push">
                          <BellOutlined /> Push
                        </Checkbox>
                      </Space>
                    </Checkbox.Group>
                  </Form.Item>
                </>
              ) : null
            }
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" size="large" icon={<CheckCircleOutlined />}>
                Update Search
              </Button>
              <Button
                size="large"
                onClick={() => {
                  setIsEditModalVisible(false);
                  setSelectedSearch(null);
                  form.resetFields();
                }}
              >
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SavedSearchesPage;
