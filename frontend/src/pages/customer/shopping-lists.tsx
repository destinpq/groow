import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  List,
  Space,
  Button,
  Input,
  Modal,
  Form,
  message,
  Tag,
  Avatar,
  Checkbox,
  Dropdown,
  Menu,
  Badge,
  Tooltip,
  Image,
  Statistic,
  Alert,
  Select,
  Empty,
  Radio,
} from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  ShareAltOutlined,
  EditOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  CheckCircleOutlined,
  EllipsisOutlined,
  HeartOutlined,
  CopyOutlined,
  LockOutlined,
  UnlockOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

interface ShoppingListItem {
  id: number;
  productName: string;
  quantity: number;
  price: number;
  image: string;
  checked: boolean;
  notes?: string;
  addedBy: string;
}

interface ShoppingList {
  id: number;
  name: string;
  description?: string;
  items: ShoppingListItem[];
  createdDate: string;
  lastModified: string;
  isPrivate: boolean;
  sharedWith: string[];
  color: string;
}

interface Collaborator {
  email: string;
  permission: 'view' | 'edit';
}

const mockShoppingLists: ShoppingList[] = [
  {
    id: 1,
    name: 'Grocery Shopping',
    description: 'Weekly grocery items',
    createdDate: dayjs().subtract(7, 'days').format('YYYY-MM-DD'),
    lastModified: dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
    isPrivate: false,
    sharedWith: ['partner@email.com'],
    color: '#52c41a',
    items: [
      {
        id: 1,
        productName: 'Organic Apples (1kg)',
        quantity: 2,
        price: 4.99,
        image: 'https://via.placeholder.com/60x60?text=Apples',
        checked: true,
        addedBy: 'me',
      },
      {
        id: 2,
        productName: 'Whole Grain Bread',
        quantity: 1,
        price: 3.49,
        image: 'https://via.placeholder.com/60x60?text=Bread',
        checked: false,
        addedBy: 'me',
      },
      {
        id: 3,
        productName: 'Greek Yogurt (500g)',
        quantity: 3,
        price: 5.99,
        image: 'https://via.placeholder.com/60x60?text=Yogurt',
        checked: false,
        notes: 'Low-fat variety',
        addedBy: 'partner@email.com',
      },
    ],
  },
  {
    id: 2,
    name: 'Home Office Setup',
    description: 'Equipment for new home office',
    createdDate: dayjs().subtract(14, 'days').format('YYYY-MM-DD'),
    lastModified: dayjs().subtract(2, 'days').format('YYYY-MM-DD'),
    isPrivate: true,
    sharedWith: [],
    color: '#1890ff',
    items: [
      {
        id: 4,
        productName: 'Ergonomic Office Chair',
        quantity: 1,
        price: 299.99,
        image: 'https://via.placeholder.com/60x60?text=Chair',
        checked: true,
        addedBy: 'me',
      },
      {
        id: 5,
        productName: 'Standing Desk',
        quantity: 1,
        price: 449.99,
        image: 'https://via.placeholder.com/60x60?text=Desk',
        checked: false,
        addedBy: 'me',
      },
    ],
  },
  {
    id: 3,
    name: 'Birthday Party Supplies',
    description: 'Items for Sarah\'s 5th birthday',
    createdDate: dayjs().subtract(5, 'days').format('YYYY-MM-DD'),
    lastModified: dayjs().format('YYYY-MM-DD'),
    isPrivate: false,
    sharedWith: ['friend1@email.com', 'friend2@email.com'],
    color: '#fa8c16',
    items: [
      {
        id: 6,
        productName: 'Birthday Decorations Set',
        quantity: 1,
        price: 24.99,
        image: 'https://via.placeholder.com/60x60?text=Decor',
        checked: false,
        addedBy: 'me',
      },
    ],
  },
];

const ShoppingListsPage: React.FC = () => {
  const [lists, setLists] = useState<ShoppingList[]>(mockShoppingLists);
  const [selectedList, setSelectedList] = useState<ShoppingList | null>(lists[0]);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState<boolean>(false);
  const [isAddItemModalVisible, setIsAddItemModalVisible] = useState<boolean>(false);
  const [isShareModalVisible, setIsShareModalVisible] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [itemForm] = Form.useForm();
  const [shareForm] = Form.useForm();

  const handleCreateList = (values: any) => {
    const newList: ShoppingList = {
      id: lists.length + 1,
      name: values.name,
      description: values.description,
      items: [],
      createdDate: dayjs().format('YYYY-MM-DD'),
      lastModified: dayjs().format('YYYY-MM-DD'),
      isPrivate: values.isPrivate || false,
      sharedWith: [],
      color: values.color || '#1890ff',
    };

    setLists([...lists, newList]);
    setSelectedList(newList);
    message.success('Shopping list created!');
    setIsCreateModalVisible(false);
    form.resetFields();
  };

  const handleAddItem = (values: any) => {
    if (!selectedList) return;

    const newItem: ShoppingListItem = {
      id: Date.now(),
      productName: values.productName,
      quantity: values.quantity,
      price: values.price,
      image: 'https://via.placeholder.com/60x60?text=Item',
      checked: false,
      notes: values.notes,
      addedBy: 'me',
    };

    const updatedList = {
      ...selectedList,
      items: [...selectedList.items, newItem],
      lastModified: dayjs().format('YYYY-MM-DD'),
    };

    setLists(lists.map((list) => (list.id === selectedList.id ? updatedList : list)));
    setSelectedList(updatedList);
    message.success('Item added to list!');
    setIsAddItemModalVisible(false);
    itemForm.resetFields();
  };

  const handleShareList = (values: any) => {
    if (!selectedList) return;

    const updatedList = {
      ...selectedList,
      sharedWith: [...selectedList.sharedWith, values.email],
    };

    setLists(lists.map((list) => (list.id === selectedList.id ? updatedList : list)));
    setSelectedList(updatedList);
    message.success(`List shared with ${values.email}`);
    setIsShareModalVisible(false);
    shareForm.resetFields();
  };

  const handleToggleItem = (itemId: number) => {
    if (!selectedList) return;

    const updatedItems = selectedList.items.map((item) =>
      item.id === itemId ? { ...item, checked: !item.checked } : item
    );

    const updatedList = {
      ...selectedList,
      items: updatedItems,
      lastModified: dayjs().format('YYYY-MM-DD'),
    };

    setLists(lists.map((list) => (list.id === selectedList.id ? updatedList : list)));
    setSelectedList(updatedList);
  };

  const handleDeleteItem = (itemId: number) => {
    if (!selectedList) return;

    const updatedList = {
      ...selectedList,
      items: selectedList.items.filter((item) => item.id !== itemId),
      lastModified: dayjs().format('YYYY-MM-DD'),
    };

    setLists(lists.map((list) => (list.id === selectedList.id ? updatedList : list)));
    setSelectedList(updatedList);
    message.success('Item removed from list');
  };

  const handleDeleteList = (listId: number) => {
    Modal.confirm({
      title: 'Delete Shopping List',
      content: 'Are you sure you want to delete this list? This action cannot be undone.',
      okText: 'Delete',
      okType: 'danger',
      onOk: () => {
        setLists(lists.filter((list) => list.id !== listId));
        if (selectedList?.id === listId) {
          setSelectedList(lists[0] || null);
        }
        message.success('Shopping list deleted');
      },
    });
  };

  const handleAddAllToCart = () => {
    if (!selectedList) return;
    const uncheckedItems = selectedList.items.filter((item) => !item.checked);
    message.success(`Added ${uncheckedItems.length} items to cart!`);
  };

  const getListStats = (list: ShoppingList) => {
    const checkedItems = list.items.filter((item) => item.checked).length;
    const totalItems = list.items.length;
    const totalCost = list.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const uncheckedCost = list.items
      .filter((item) => !item.checked)
      .reduce((sum, item) => sum + item.price * item.quantity, 0);

    return { checkedItems, totalItems, totalCost, uncheckedCost };
  };

  const selectedListStats = selectedList ? getListStats(selectedList) : null;

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={3}>
            <ShoppingCartOutlined style={{ color: '#1890ff' }} /> Shopping Lists
          </Title>
          <Paragraph type="secondary">
            Organize your shopping with collaborative lists
          </Paragraph>
        </Col>
        <Col>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsCreateModalVisible(true)}
          >
            Create New List
          </Button>
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={8}>
          <Card title={`My Lists (${lists.length})`}>
            <List
              dataSource={lists}
              renderItem={(list) => {
                const stats = getListStats(list);
                const isSelected = selectedList?.id === list.id;

                return (
                  <List.Item
                    onClick={() => setSelectedList(list)}
                    style={{
                      cursor: 'pointer',
                      background: isSelected ? '#e6f7ff' : 'transparent',
                      borderLeft: isSelected ? `4px solid ${list.color}` : '4px solid transparent',
                      padding: '12px 16px',
                    }}
                  >
                    <List.Item.Meta
                      avatar={
                        <Avatar
                          style={{ backgroundColor: list.color }}
                          icon={<ShoppingCartOutlined />}
                        />
                      }
                      title={
                        <Space>
                          <Text strong>{list.name}</Text>
                          {!list.isPrivate && (
                            <Tooltip title="Shared list">
                              <TeamOutlined style={{ color: '#1890ff' }} />
                            </Tooltip>
                          )}
                        </Space>
                      }
                      description={
                        <Space direction="vertical" size="small">
                          {list.description && (
                            <Text type="secondary" ellipsis style={{ fontSize: 12 }}>
                              {list.description}
                            </Text>
                          )}
                          <Space>
                            <Tag color="blue">{stats.totalItems} items</Tag>
                            <Tag color="green">{stats.checkedItems} checked</Tag>
                          </Space>
                        </Space>
                      }
                    />
                    <Dropdown
                      overlay={
                        <Menu
                          items={[
                            {
                              key: 'edit',
                              icon: <EditOutlined />,
                              label: 'Edit List',
                            },
                            {
                              key: 'duplicate',
                              icon: <CopyOutlined />,
                              label: 'Duplicate',
                            },
                            {
                              key: 'delete',
                              icon: <DeleteOutlined />,
                              label: 'Delete',
                              danger: true,
                              onClick: () => handleDeleteList(list.id),
                            },
                          ]}
                        />
                      }
                      trigger={['click']}
                    >
                      <Button type="text" icon={<EllipsisOutlined />} onClick={(e) => e.stopPropagation()} />
                    </Dropdown>
                  </List.Item>
                );
              }}
            />
          </Card>
        </Col>

        <Col xs={24} lg={16}>
          {selectedList ? (
            <>
              <Card
                title={
                  <Space>
                    <Avatar
                      style={{ backgroundColor: selectedList.color }}
                      icon={<ShoppingCartOutlined />}
                    />
                    <div>
                      <div>{selectedList.name}</div>
                      <Text type="secondary" style={{ fontSize: 12, fontWeight: 'normal' }}>
                        Last modified: {dayjs(selectedList.lastModified).format('MMM DD, YYYY')}
                      </Text>
                    </div>
                  </Space>
                }
                extra={
                  <Space>
                    <Tooltip title={selectedList.isPrivate ? 'Private list' : 'Shared list'}>
                      {selectedList.isPrivate ? <LockOutlined /> : <UnlockOutlined />}
                    </Tooltip>
                    <Button
                      icon={<ShareAltOutlined />}
                      onClick={() => setIsShareModalVisible(true)}
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
                {selectedList.sharedWith.length > 0 && (
                  <Alert
                    message={
                      <Space>
                        <TeamOutlined />
                        <Text>
                          Shared with {selectedList.sharedWith.length}{' '}
                          {selectedList.sharedWith.length === 1 ? 'person' : 'people'}
                        </Text>
                      </Space>
                    }
                    description={selectedList.sharedWith.join(', ')}
                    type="info"
                    showIcon={false}
                    style={{ marginBottom: 16 }}
                  />
                )}

                <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                  <Col xs={12} sm={6}>
                    <Statistic
                      title="Total Items"
                      value={selectedListStats?.totalItems}
                      prefix={<ShoppingCartOutlined />}
                    />
                  </Col>
                  <Col xs={12} sm={6}>
                    <Statistic
                      title="Checked"
                      value={selectedListStats?.checkedItems}
                      prefix={<CheckCircleOutlined />}
                      valueStyle={{ color: '#52c41a' }}
                    />
                  </Col>
                  <Col xs={12} sm={6}>
                    <Statistic
                      title="Total Cost"
                      value={selectedListStats?.totalCost}
                      prefix="$"
                      precision={2}
                    />
                  </Col>
                  <Col xs={12} sm={6}>
                    <Statistic
                      title="Remaining"
                      value={selectedListStats?.uncheckedCost}
                      prefix="$"
                      precision={2}
                      valueStyle={{ color: '#1890ff' }}
                    />
                  </Col>
                </Row>

                <List
                  dataSource={selectedList.items}
                  locale={{ emptyText: 'No items in this list yet. Add some items to get started!' }}
                  renderItem={(item) => (
                    <List.Item
                      actions={[
                        <Button
                          type="text"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => handleDeleteItem(item.id)}
                        />,
                      ]}
                      style={{
                        opacity: item.checked ? 0.6 : 1,
                        textDecoration: item.checked ? 'line-through' : 'none',
                      }}
                    >
                      <List.Item.Meta
                        avatar={
                          <Checkbox
                            checked={item.checked}
                            onChange={() => handleToggleItem(item.id)}
                          />
                        }
                        title={
                          <Space>
                            <Image
                              src={item.image}
                              alt={item.productName}
                              width={60}
                              height={60}
                              preview={false}
                              style={{ borderRadius: 8 }}
                            />
                            <div>
                              <div>
                                <Text strong>{item.productName}</Text>
                                {item.checked && (
                                  <Tag color="success" style={{ marginLeft: 8 }}>
                                    Purchased
                                  </Tag>
                                )}
                              </div>
                              <div>
                                <Text type="secondary" style={{ fontSize: 12 }}>
                                  Qty: {item.quantity} • ${item.price.toFixed(2)} each
                                </Text>
                              </div>
                              {item.notes && (
                                <div>
                                  <Text type="secondary" style={{ fontSize: 12 }} italic>
                                    Note: {item.notes}
                                  </Text>
                                </div>
                              )}
                              <div>
                                <Text type="secondary" style={{ fontSize: 11 }}>
                                  Added by: {item.addedBy}
                                </Text>
                              </div>
                            </div>
                          </Space>
                        }
                      />
                      <div>
                        <Text strong style={{ fontSize: 16 }}>
                          ${(item.price * item.quantity).toFixed(2)}
                        </Text>
                      </div>
                    </List.Item>
                  )}
                />

                {selectedList.items.length > 0 && (
                  <div style={{ marginTop: 24, textAlign: 'center' }}>
                    <Button
                      type="primary"
                      size="large"
                      icon={<ShoppingCartOutlined />}
                      onClick={handleAddAllToCart}
                    >
                      Add All Unchecked Items to Cart
                    </Button>
                  </div>
                )}
              </Card>
            </>
          ) : (
            <Card>
              <Empty description="Select a list to view items" />
            </Card>
          )}
        </Col>
      </Row>

      <Modal
        title="Create New Shopping List"
        open={isCreateModalVisible}
        onCancel={() => setIsCreateModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleCreateList}>
          <Form.Item
            label="List Name"
            name="name"
            rules={[{ required: true, message: 'Please enter a list name' }]}
          >
            <Input size="large" placeholder="e.g., Grocery Shopping" />
          </Form.Item>

          <Form.Item label="Description" name="description">
            <TextArea rows={3} placeholder="Optional description" />
          </Form.Item>

          <Form.Item label="Color" name="color" initialValue="#1890ff">
            <Radio.Group>
              {['#1890ff', '#52c41a', '#fa8c16', '#722ed1', '#eb2f96'].map((color) => (
                <Radio.Button key={color} value={color}>
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      background: color,
                      display: 'inline-block',
                    }}
                  />
                </Radio.Button>
              ))}
            </Radio.Group>
          </Form.Item>

          <Form.Item name="isPrivate" valuePropName="checked">
            <Checkbox>Make this list private</Checkbox>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" size="large" icon={<PlusOutlined />}>
                Create List
              </Button>
              <Button size="large" onClick={() => setIsCreateModalVisible(false)}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Add Item to List"
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
            <Input size="large" placeholder="e.g., Organic Apples" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Quantity"
                name="quantity"
                rules={[{ required: true, message: 'Required' }]}
                initialValue={1}
              >
                <Input type="number" size="large" min={1} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Price"
                name="price"
                rules={[{ required: true, message: 'Required' }]}
              >
                <Input type="number" size="large" prefix="$" step="0.01" min={0} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Notes (optional)" name="notes">
            <TextArea rows={2} placeholder="Any special notes..." />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" size="large" icon={<PlusOutlined />}>
                Add Item
              </Button>
              <Button size="large" onClick={() => setIsAddItemModalVisible(false)}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Share Shopping List"
        open={isShareModalVisible}
        onCancel={() => setIsShareModalVisible(false)}
        footer={null}
      >
        <Form form={shareForm} layout="vertical" onFinish={handleShareList}>
          <Form.Item
            label="Email Address"
            name="email"
            rules={[
              { required: true, message: 'Please enter an email' },
              { type: 'email', message: 'Please enter a valid email' },
            ]}
          >
            <Input size="large" placeholder="user@example.com" />
          </Form.Item>

          <Form.Item label="Permission" name="permission" initialValue="edit">
            <Select size="large">
              <Select.Option value="view">View Only</Select.Option>
              <Select.Option value="edit">Can Edit</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" size="large" icon={<ShareAltOutlined />}>
                Share List
              </Button>
              <Button size="large" onClick={() => setIsShareModalVisible(false)}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ShoppingListsPage;
