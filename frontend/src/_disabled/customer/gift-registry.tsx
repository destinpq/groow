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
  DatePicker,
  message,
  List,
  Space,
  Tag,
  Progress,
  Avatar,
  Modal,
  Divider,
  Alert,
  Statistic,
  Image,
  Badge,
  Tooltip,
  InputNumber,
} from 'antd';
import {
  GiftOutlined,
  PlusOutlined,
  ShareAltOutlined,
  HeartOutlined,
  CheckCircleOutlined,
  ShoppingCartOutlined,
  CopyOutlined,
  TeamOutlined,
  CalendarOutlined,
  DollarOutlined,
} from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

interface RegistryItem {
  id: number;
  productName: string;
  productImage: string;
  price: number;
  quantityWanted: number;
  quantityPurchased: number;
  priority: 'high' | 'medium' | 'low';
  notes?: string;
  purchasedBy: string[];
}

interface GiftRegistry {
  id: number;
  title: string;
  type: 'wedding' | 'baby_shower' | 'birthday' | 'housewarming' | 'anniversary' | 'other';
  eventDate: string;
  registrantName: string;
  coRegistrantName?: string;
  description: string;
  isPublic: boolean;
  shareUrl: string;
  items: RegistryItem[];
  createdDate: string;
}

const mockRegistries: GiftRegistry[] = [
  {
    id: 1,
    title: 'Sarah & John\'s Wedding Registry',
    type: 'wedding',
    eventDate: dayjs().add(60, 'days').format('YYYY-MM-DD'),
    registrantName: 'Sarah Johnson',
    coRegistrantName: 'John Smith',
    description: 'Help us start our new life together!',
    isPublic: true,
    shareUrl: 'registry.shop/sarah-john-2024',
    createdDate: dayjs().subtract(30, 'days').format('YYYY-MM-DD'),
    items: [
      {
        id: 1,
        productName: 'Premium Cookware Set',
        productImage: 'https://via.placeholder.com/150x150?text=Cookware',
        price: 299.99,
        quantityWanted: 1,
        quantityPurchased: 1,
        priority: 'high',
        notes: 'Stainless steel preferred',
        purchasedBy: ['aunt_mary@email.com'],
      },
      {
        id: 2,
        productName: 'Luxury Bedding Set',
        productImage: 'https://via.placeholder.com/150x150?text=Bedding',
        price: 199.99,
        quantityWanted: 1,
        quantityPurchased: 0,
        priority: 'high',
        purchasedBy: [],
      },
      {
        id: 3,
        productName: 'Kitchen Stand Mixer',
        productImage: 'https://via.placeholder.com/150x150?text=Mixer',
        price: 449.99,
        quantityWanted: 1,
        quantityPurchased: 0,
        priority: 'medium',
        purchasedBy: [],
      },
      {
        id: 4,
        productName: 'Coffee Maker',
        productImage: 'https://via.placeholder.com/150x150?text=Coffee',
        price: 89.99,
        quantityWanted: 1,
        quantityPurchased: 0,
        priority: 'low',
        notes: 'Programmable preferred',
        purchasedBy: [],
      },
    ],
  },
];

const GiftRegistryPage: React.FC = () => {
  const [registries, setRegistries] = useState<GiftRegistry[]>(mockRegistries);
  const [selectedRegistry, setSelectedRegistry] = useState<GiftRegistry | null>(registries[0]);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState<boolean>(false);
  const [isAddItemModalVisible, setIsAddItemModalVisible] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [itemForm] = Form.useForm();

  const handleCreateRegistry = (values: any) => {
    const newRegistry: GiftRegistry = {
      id: registries.length + 1,
      title: values.title,
      type: values.type,
      eventDate: values.eventDate.format('YYYY-MM-DD'),
      registrantName: values.registrantName,
      coRegistrantName: values.coRegistrantName,
      description: values.description,
      isPublic: values.isPublic !== false,
      shareUrl: `registry.shop/${values.title.toLowerCase().replace(/\s+/g, '-')}`,
      items: [],
      createdDate: dayjs().format('YYYY-MM-DD'),
    };

    setRegistries([...registries, newRegistry]);
    setSelectedRegistry(newRegistry);
    message.success('Gift registry created successfully!');
    setIsCreateModalVisible(false);
    form.resetFields();
  };

  const handleAddItem = (values: any) => {
    if (!selectedRegistry) return;

    const newItem: RegistryItem = {
      id: Date.now(),
      productName: values.productName,
      productImage: 'https://via.placeholder.com/150x150?text=Item',
      price: values.price,
      quantityWanted: values.quantity,
      quantityPurchased: 0,
      priority: values.priority,
      notes: values.notes,
      purchasedBy: [],
    };

    const updatedRegistry = {
      ...selectedRegistry,
      items: [...selectedRegistry.items, newItem],
    };

    setRegistries(registries.map((reg) => (reg.id === selectedRegistry.id ? updatedRegistry : reg)));
    setSelectedRegistry(updatedRegistry);
    message.success('Item added to registry!');
    setIsAddItemModalVisible(false);
    itemForm.resetFields();
  };

  const handleCopyShareLink = () => {
    if (!selectedRegistry) return;
    navigator.clipboard.writeText(`https://${selectedRegistry.shareUrl}`);
    message.success('Share link copied to clipboard!');
  };

  const handleMarkAsPurchased = (itemId: number) => {
    if (!selectedRegistry) return;

    const updatedItems = selectedRegistry.items.map((item) =>
      item.id === itemId
        ? {
            ...item,
            quantityPurchased: Math.min(item.quantityPurchased + 1, item.quantityWanted),
            purchasedBy: [...item.purchasedBy, 'guest@email.com'],
          }
        : item
    );

    const updatedRegistry = {
      ...selectedRegistry,
      items: updatedItems,
    };

    setRegistries(registries.map((reg) => (reg.id === selectedRegistry.id ? updatedRegistry : reg)));
    setSelectedRegistry(updatedRegistry);
    message.success('Item marked as purchased!');
  };

  const getRegistryStats = (registry: GiftRegistry) => {
    const totalItems = registry.items.length;
    const fulfilledItems = registry.items.filter(
      (item) => item.quantityPurchased >= item.quantityWanted
    ).length;
    const totalValue = registry.items.reduce((sum, item) => sum + item.price * item.quantityWanted, 0);
    const purchasedValue = registry.items.reduce(
      (sum, item) => sum + item.price * item.quantityPurchased,
      0
    );
    const completionPercentage = totalItems > 0 ? (fulfilledItems / totalItems) * 100 : 0;

    return { totalItems, fulfilledItems, totalValue, purchasedValue, completionPercentage };
  };

  const selectedStats = selectedRegistry ? getRegistryStats(selectedRegistry) : null;

  const getEventTypeIcon = (type: GiftRegistry['type']) => {
    const icons = {
      wedding: '💍',
      baby_shower: '👶',
      birthday: '🎂',
      housewarming: '🏠',
      anniversary: '💐',
      other: '🎁',
    };
    return icons[type];
  };

  const getPriorityColor = (priority: RegistryItem['priority']) => {
    const colors = {
      high: 'red',
      medium: 'orange',
      low: 'blue',
    };
    return colors[priority];
  };

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={3}>
            <GiftOutlined style={{ color: '#1890ff' }} /> Gift Registries
          </Title>
          <Paragraph type="secondary">
            Create and manage gift registries for special occasions
          </Paragraph>
        </Col>
        <Col>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            onClick={() => setIsCreateModalVisible(true)}
          >
            Create Registry
          </Button>
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={8}>
          <Card title={`My Registries (${registries.length})`}>
            <List
              dataSource={registries}
              renderItem={(registry) => {
                const stats = getRegistryStats(registry);
                const isSelected = selectedRegistry?.id === registry.id;
                const daysUntilEvent = dayjs(registry.eventDate).diff(dayjs(), 'days');

                return (
                  <List.Item
                    onClick={() => setSelectedRegistry(registry)}
                    style={{
                      cursor: 'pointer',
                      background: isSelected ? '#e6f7ff' : 'transparent',
                      borderLeft: isSelected ? '4px solid #1890ff' : '4px solid transparent',
                      padding: '16px',
                    }}
                  >
                    <List.Item.Meta
                      avatar={
                        <Avatar size={64} style={{ background: '#1890ff', fontSize: 32 }}>
                          {getEventTypeIcon(registry.type)}
                        </Avatar>
                      }
                      title={
                        <div>
                          <Text strong>{registry.title}</Text>
                          {registry.isPublic && (
                            <Tag color="green" style={{ marginLeft: 8 }}>
                              Public
                            </Tag>
                          )}
                        </div>
                      }
                      description={
                        <Space direction="vertical" size="small" style={{ width: '100%' }}>
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            <CalendarOutlined /> {dayjs(registry.eventDate).format('MMM DD, YYYY')}
                            {daysUntilEvent > 0 && ` (${daysUntilEvent} days)`}
                          </Text>
                          <div>
                            <Text type="secondary" style={{ fontSize: 12 }}>
                              {stats.fulfilledItems} of {stats.totalItems} items fulfilled
                            </Text>
                          </div>
                          <Progress
                            percent={stats.completionPercentage}
                            size="small"
                            showInfo={false}
                            strokeColor="#52c41a"
                          />
                        </Space>
                      }
                    />
                  </List.Item>
                );
              }}
            />
          </Card>
        </Col>

        <Col xs={24} lg={16}>
          {selectedRegistry ? (
            <>
              <Card
                title={
                  <Space>
                    <span style={{ fontSize: 32 }}>{getEventTypeIcon(selectedRegistry.type)}</span>
                    <div>
                      <div>{selectedRegistry.title}</div>
                      <Text type="secondary" style={{ fontSize: 14, fontWeight: 'normal' }}>
                        {selectedRegistry.registrantName}
                        {selectedRegistry.coRegistrantName &&
                          ` & ${selectedRegistry.coRegistrantName}`}
                      </Text>
                    </div>
                  </Space>
                }
                extra={
                  <Space>
                    <Button
                      icon={<ShareAltOutlined />}
                      onClick={() =>
                        Modal.info({
                          title: 'Share Registry',
                          content: (
                            <div>
                              <Paragraph>Share this link with your friends and family:</Paragraph>
                              <Input
                                value={`https://${selectedRegistry.shareUrl}`}
                                readOnly
                                addonAfter={
                                  <Tooltip title="Copy link">
                                    <CopyOutlined
                                      onClick={handleCopyShareLink}
                                      style={{ cursor: 'pointer' }}
                                    />
                                  </Tooltip>
                                }
                              />
                            </div>
                          ),
                        })
                      }
                    >
                      Share
                    </Button>
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={() => setIsAddItemModalVisible(true)}
                    >
                      Add Item
                    </Button>
                  </Space>
                }
                style={{ marginBottom: 24 }}
              >
                <Alert
                  message={
                    <Space>
                      <CalendarOutlined />
                      <Text strong>Event Date: {dayjs(selectedRegistry.eventDate).format('MMMM DD, YYYY')}</Text>
                    </Space>
                  }
                  description={selectedRegistry.description}
                  type="info"
                  showIcon={false}
                  style={{ marginBottom: 24 }}
                />

                <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                  <Col xs={12} sm={6}>
                    <Card>
                      <Statistic
                        title="Total Items"
                        value={selectedStats?.totalItems}
                        prefix={<GiftOutlined />}
                      />
                    </Card>
                  </Col>
                  <Col xs={12} sm={6}>
                    <Card>
                      <Statistic
                        title="Fulfilled"
                        value={selectedStats?.fulfilledItems}
                        prefix={<CheckCircleOutlined />}
                        valueStyle={{ color: '#52c41a' }}
                      />
                    </Card>
                  </Col>
                  <Col xs={12} sm={6}>
                    <Card>
                      <Statistic
                        title="Total Value"
                        value={selectedStats?.totalValue}
                        prefix="$"
                        precision={2}
                      />
                    </Card>
                  </Col>
                  <Col xs={12} sm={6}>
                    <Card>
                      <Statistic
                        title="Remaining"
                        value={(selectedStats?.totalValue || 0) - (selectedStats?.purchasedValue || 0)}
                        prefix="$"
                        precision={2}
                        valueStyle={{ color: '#1890ff' }}
                      />
                    </Card>
                  </Col>
                </Row>

                <Card title={`Registry Items (${selectedRegistry.items.length})`}>
                  <List
                    grid={{ gutter: 16, xs: 1, sm: 2, lg: 2 }}
                    dataSource={selectedRegistry.items}
                    locale={{ emptyText: 'No items in registry yet. Add some items to get started!' }}
                    renderItem={(item) => {
                      const isFulfilled = item.quantityPurchased >= item.quantityWanted;
                      const progressPercent = (item.quantityPurchased / item.quantityWanted) * 100;

                      return (
                        <List.Item>
                          <Card
                            hoverable
                            style={{
                              opacity: isFulfilled ? 0.7 : 1,
                              border: isFulfilled ? '2px solid #52c41a' : undefined,
                            }}
                          >
                            <div style={{ position: 'relative' }}>
                              <Image
                                src={item.productImage}
                                alt={item.productName}
                                preview={false}
                                style={{ marginBottom: 12, borderRadius: 8 }}
                              />
                              {isFulfilled && (
                                <div
                                  style={{
                                    position: 'absolute',
                                    top: 8,
                                    right: 8,
                                    background: '#52c41a',
                                    borderRadius: '50%',
                                    width: 40,
                                    height: 40,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                  }}
                                >
                                  <CheckCircleOutlined style={{ color: '#fff', fontSize: 24 }} />
                                </div>
                              )}
                              <Tag
                                color={getPriorityColor(item.priority)}
                                style={{ position: 'absolute', top: 8, left: 8 }}
                              >
                                {item.priority.toUpperCase()}
                              </Tag>
                            </div>

                            <Title level={5} ellipsis={{ rows: 2 }} style={{ minHeight: 48 }}>
                              {item.productName}
                            </Title>

                            <div style={{ marginBottom: 12 }}>
                              <Text strong style={{ fontSize: 20, color: '#1890ff' }}>
                                ${item.price.toFixed(2)}
                              </Text>
                            </div>

                            {item.notes && (
                              <Paragraph
                                type="secondary"
                                ellipsis={{ rows: 2 }}
                                style={{ fontSize: 12, marginBottom: 12 }}
                              >
                                Note: {item.notes}
                              </Paragraph>
                            )}

                            <div style={{ marginBottom: 12 }}>
                              <Space direction="vertical" style={{ width: '100%' }} size="small">
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                  <Text type="secondary" style={{ fontSize: 12 }}>
                                    Quantity
                                  </Text>
                                  <Text strong>
                                    {item.quantityPurchased} / {item.quantityWanted}
                                  </Text>
                                </div>
                                <Progress
                                  percent={progressPercent}
                                  size="small"
                                  showInfo={false}
                                  strokeColor={isFulfilled ? '#52c41a' : '#1890ff'}
                                />
                              </Space>
                            </div>

                            {item.purchasedBy.length > 0 && (
                              <div style={{ marginBottom: 12 }}>
                                <Text type="secondary" style={{ fontSize: 12 }}>
                                  <TeamOutlined /> Purchased by {item.purchasedBy.length}{' '}
                                  {item.purchasedBy.length === 1 ? 'person' : 'people'}
                                </Text>
                              </div>
                            )}

                            <Space style={{ width: '100%' }}>
                              <Button
                                type="primary"
                                icon={<ShoppingCartOutlined />}
                                onClick={() => handleMarkAsPurchased(item.id)}
                                disabled={isFulfilled}
                                block
                              >
                                {isFulfilled ? 'Fulfilled' : 'Purchase'}
                              </Button>
                            </Space>
                          </Card>
                        </List.Item>
                      );
                    }}
                  />
                </Card>
              </Card>
            </>
          ) : (
            <Card>
              <div style={{ textAlign: 'center', padding: 40 }}>
                <GiftOutlined style={{ fontSize: 64, color: '#d9d9d9', marginBottom: 16 }} />
                <Title level={4}>No Registry Selected</Title>
                <Paragraph type="secondary">
                  Select a registry from the list or create a new one
                </Paragraph>
                <Button
                  type="primary"
                  size="large"
                  icon={<PlusOutlined />}
                  onClick={() => setIsCreateModalVisible(true)}
                >
                  Create Your First Registry
                </Button>
              </div>
            </Card>
          )}
        </Col>
      </Row>

      <Modal
        title="Create Gift Registry"
        open={isCreateModalVisible}
        onCancel={() => setIsCreateModalVisible(false)}
        footer={null}
        width={700}
      >
        <Form form={form} layout="vertical" onFinish={handleCreateRegistry}>
          <Form.Item
            label="Registry Title"
            name="title"
            rules={[{ required: true, message: 'Please enter a title' }]}
          >
            <Input size="large" placeholder="e.g., Sarah & John's Wedding" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Event Type"
                name="type"
                rules={[{ required: true, message: 'Please select event type' }]}
              >
                <Select size="large" placeholder="Select event type">
                  <Select.Option value="wedding">💍 Wedding</Select.Option>
                  <Select.Option value="baby_shower">👶 Baby Shower</Select.Option>
                  <Select.Option value="birthday">🎂 Birthday</Select.Option>
                  <Select.Option value="housewarming">🏠 Housewarming</Select.Option>
                  <Select.Option value="anniversary">💐 Anniversary</Select.Option>
                  <Select.Option value="other">🎁 Other</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Event Date"
                name="eventDate"
                rules={[{ required: true, message: 'Please select event date' }]}
              >
                <DatePicker size="large" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Your Name"
                name="registrantName"
                rules={[{ required: true, message: 'Please enter your name' }]}
              >
                <Input size="large" placeholder="Your name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Co-Registrant Name (Optional)" name="coRegistrantName">
                <Input size="large" placeholder="Partner's name" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: 'Please enter a description' }]}
          >
            <TextArea rows={3} placeholder="Tell guests about your special occasion..." />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" size="large" icon={<PlusOutlined />}>
                Create Registry
              </Button>
              <Button size="large" onClick={() => setIsCreateModalVisible(false)}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Add Item to Registry"
        open={isAddItemModalVisible}
        onCancel={() => setIsAddItemModalVisible(false)}
        footer={null}
      >
        <Form form={itemForm} layout="vertical" onFinish={handleAddItem}>
          <Form.Item
            label="Product Name"
            name="productName"
            rules={[{ required: true, message: 'Please enter product name' }]}
          >
            <Input size="large" placeholder="e.g., Premium Cookware Set" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Price"
                name="price"
                rules={[{ required: true, message: 'Required' }]}
              >
                <InputNumber
                  size="large"
                  prefix="$"
                  style={{ width: '100%' }}
                  min={0}
                  step={0.01}
                  placeholder="0.00"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Quantity"
                name="quantity"
                rules={[{ required: true, message: 'Required' }]}
                initialValue={1}
              >
                <InputNumber size="large" style={{ width: '100%' }} min={1} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Priority"
            name="priority"
            rules={[{ required: true, message: 'Please select priority' }]}
            initialValue="medium"
          >
            <Select size="large">
              <Select.Option value="high">
                <Tag color="red">High Priority</Tag>
              </Select.Option>
              <Select.Option value="medium">
                <Tag color="orange">Medium Priority</Tag>
              </Select.Option>
              <Select.Option value="low">
                <Tag color="blue">Low Priority</Tag>
              </Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="Notes (Optional)" name="notes">
            <TextArea rows={2} placeholder="Any preferences or special instructions..." />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" size="large" icon={<PlusOutlined />}>
                Add to Registry
              </Button>
              <Button size="large" onClick={() => setIsAddItemModalVisible(false)}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default GiftRegistryPage;
