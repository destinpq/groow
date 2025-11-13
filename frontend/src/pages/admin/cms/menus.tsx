/**
 * ⚠️ SAFE API RESPONSE HANDLING - ALWAYS USE THIS PATTERN:
 * 
 * const dataArray = response?.data?.data || response?.data || [];
 * const total = response?.data?.meta?.total || response?.meta?.total || response?.total || 0;
 * 
 * Before using .map()/.filter()/.forEach():
 * setItems(Array.isArray(dataArray) ? dataArray : []);
 */

import React, { useState } from 'react';
import {
  Card,
  Table,
  Tag,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Select,
  message,
  Typography,
  Tree,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  MenuOutlined,
  HomeOutlined,
  LinkOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { DataNode } from 'antd/es/tree';

const { Title, Text } = Typography;
const { Option } = Select;

interface MenuItem {
  id: number;
  label: string;
  type: string;
  url: string;
  location: string;
  order: number;
  parentId?: number;
  children?: MenuItem[];
}

const mockMenuItems: MenuItem[] = [
  {
    id: 1,
    label: 'Home',
    type: 'internal',
    url: '/',
    location: 'header',
    order: 1,
  },
  {
    id: 2,
    label: 'Products',
    type: 'internal',
    url: '/products',
    location: 'header',
    order: 2,
  },
  {
    id: 3,
    label: 'About Us',
    type: 'page',
    url: '/about-us',
    location: 'footer',
    order: 1,
  },
  {
    id: 4,
    label: 'Contact',
    type: 'page',
    url: '/contact',
    location: 'footer',
    order: 2,
  },
  {
    id: 5,
    label: 'Help Center',
    type: 'external',
    url: 'https://help.groow.com',
    location: 'footer',
    order: 3,
  },
];

const AdminMenusPage: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(mockMenuItems);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [form] = Form.useForm();

  const getTypeIcon = (type: string) => {
    const icons: Record<string, any> = {
      internal: <HomeOutlined />,
      page: <MenuOutlined />,
      external: <LinkOutlined />,
    };
    return icons[type] || <MenuOutlined />;
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      internal: 'blue',
      page: 'green',
      external: 'orange',
    };
    return colors[type] || 'default';
  };

  const handleAddMenuItem = () => {
    setEditingItem(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEditMenuItem = (item: MenuItem) => {
    setEditingItem(item);
    form.setFieldsValue(item);
    setModalVisible(true);
  };

  const handleDeleteMenuItem = (id: number) => {
    Modal.confirm({
      title: 'Delete Menu Item',
      content: 'Are you sure you want to delete this menu item?',
      okText: 'Delete',
      okType: 'danger',
      onOk: () => {
        setMenuItems(menuItems.filter((item) => item.id !== id));
        message.success('Menu item deleted successfully');
      },
    });
  };

  const handleSubmit = (values: any) => {
    const itemData = {
      ...values,
      id: editingItem?.id || menuItems.length + 1,
    };

    if (editingItem) {
      setMenuItems(menuItems.map((item) => (item.id === editingItem.id ? itemData : item)));
      message.success('Menu item updated successfully');
    } else {
      setMenuItems([...menuItems, itemData]);
      message.success('Menu item created successfully');
    }

    setModalVisible(false);
    form.resetFields();
  };

  const columns: ColumnsType<MenuItem> = [
    {
      title: 'Label',
      dataIndex: 'label',
      key: 'label',
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <Tag color={getTypeColor(type)} icon={getTypeIcon(type)}>
          {type.toUpperCase()}
        </Tag>
      ),
      filters: [
        { text: 'Internal Link', value: 'internal' },
        { text: 'Page Link', value: 'page' },
        { text: 'External Link', value: 'external' },
      ],
      onFilter: (value, record) => record.type === value,
    },
    {
      title: 'URL',
      dataIndex: 'url',
      key: 'url',
      render: (url: string) => (
        <Text copyable code>
          {url}
        </Text>
      ),
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
      render: (location: string) => (
        <Tag color={location === 'header' ? 'blue' : 'purple'}>{location.toUpperCase()}</Tag>
      ),
      filters: [
        { text: 'Header', value: 'header' },
        { text: 'Footer', value: 'footer' },
        { text: 'Sidebar', value: 'sidebar' },
      ],
      onFilter: (value, record) => record.location === value,
    },
    {
      title: 'Order',
      dataIndex: 'order',
      key: 'order',
      sorter: (a, b) => a.order - b.order,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEditMenuItem(record)}>
            Edit
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteMenuItem(record.id)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  // Tree data for menu preview
  const getTreeData = (location: string): DataNode[] => {
    return menuItems
      .filter((item) => item.location === location)
      .sort((a, b) => a.order - b.order)
      .map((item) => ({
        title: `${item.label} (${item.url})`,
        key: item.id,
        icon: getTypeIcon(item.type),
      }));
  };

  return (
    <div style={{ padding: 24 }}>
      <Card
        title={<Title level={3}>Menu Management</Title>}
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddMenuItem}>
            Add Menu Item
          </Button>
        }
      >
        {/* Menu Preview */}
        <Card title="Menu Preview" size="small" style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', gap: 24 }}>
            <div style={{ flex: 1 }}>
              <Title level={5}>Header Menu</Title>
              <Tree
                showIcon
                defaultExpandAll
                treeData={getTreeData('header')}
                style={{ background: '#f5f5f5', padding: 12, borderRadius: 4 }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <Title level={5}>Footer Menu</Title>
              <Tree
                showIcon
                defaultExpandAll
                treeData={getTreeData('footer')}
                style={{ background: '#f5f5f5', padding: 12, borderRadius: 4 }}
              />
            </div>
          </div>
        </Card>

        {/* Menu Items Table */}
        <Table
          columns={columns}
          dataSource={menuItems}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} menu items`,
          }}
        />
      </Card>

      {/* Add/Edit Menu Item Modal */}
      <Modal
        title={editingItem ? 'Edit Menu Item' : 'Add Menu Item'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="label"
            label="Menu Label"
            rules={[{ required: true, message: 'Please enter menu label' }]}
          >
            <Input placeholder="e.g., Home" />
          </Form.Item>

          <Form.Item
            name="type"
            label="Link Type"
            rules={[{ required: true, message: 'Please select link type' }]}
          >
            <Select placeholder="Select link type">
              <Option value="internal">Internal Link (Routes in app)</Option>
              <Option value="page">Page Link (CMS Pages)</Option>
              <Option value="external">External Link (Outside URL)</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="url"
            label="URL"
            rules={[{ required: true, message: 'Please enter URL' }]}
          >
            <Input placeholder="e.g., /products or https://example.com" />
          </Form.Item>

          <Form.Item
            name="location"
            label="Menu Location"
            rules={[{ required: true, message: 'Please select location' }]}
          >
            <Select placeholder="Select menu location">
              <Option value="header">Header</Option>
              <Option value="footer">Footer</Option>
              <Option value="sidebar">Sidebar</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="order"
            label="Display Order"
            rules={[{ required: true, message: 'Please enter order' }]}
            initialValue={1}
          >
            <Input type="number" min={1} placeholder="1" />
          </Form.Item>

          <Form.Item>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => setModalVisible(false)}>Cancel</Button>
              <Button type="primary" htmlType="submit">
                {editingItem ? 'Update' : 'Add'} Menu Item
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminMenusPage;
