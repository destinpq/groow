import React, { useState, useEffect } from 'react';
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
  Switch,
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
import { cmsAPI, CMSMenu, CMSMenuItem } from '@/services/api';

const { Title, Text } = Typography;
const { Option } = Select;

const AdminMenusPage: React.FC = () => {
  const [menus, setMenus] = useState<CMSMenu[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingMenu, setEditingMenu] = useState<CMSMenu | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    loadMenus();
  }, []);

  const loadMenus = async () => {
    try {
      setLoading(true);
      const response = await cmsAPI.menus.getAll();
      setMenus(response.data || []);
    } catch (error) {
      message.error('Failed to load menus');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id: number, isActive: boolean) => {
    try {
      await cmsAPI.menus.update(id, { isActive });
      message.success(`Menu ${isActive ? 'activated' : 'deactivated'}`);
      loadMenus();
    } catch (error) {
      message.error('Failed to update menu status');
      console.error(error);
    }
  };

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

  const handleAddMenu = () => {
    setEditingMenu(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEditMenu = (menu: CMSMenu) => {
    setEditingMenu(menu);
    form.setFieldsValue(menu);
    setModalVisible(true);
  };

  const handleDeleteMenu = async (id: number) => {
    Modal.confirm({
      title: 'Delete Menu',
      content: 'Are you sure you want to delete this menu?',
      okText: 'Delete',
      okType: 'danger',
      onOk: async () => {
        try {
          await cmsAPI.menus.delete(id);
          message.success('Menu deleted successfully');
          loadMenus();
        } catch (error) {
          message.error('Failed to delete menu');
          console.error(error);
        }
      },
    });
  };

  const handleSubmit = async (values: any) => {
    try {
      if (editingMenu) {
        await cmsAPI.menus.update(editingMenu.id, values);
        message.success('Menu updated successfully');
      } else {
        await cmsAPI.menus.create(values);
        message.success('Menu created successfully');
      }
      setModalVisible(false);
      form.resetFields();
      loadMenus();
    } catch (error) {
      message.error('Failed to save menu');
      console.error(error);
    }
  };

  const columns: ColumnsType<CMSMenu> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
      render: (location: string) => (
        <Tag color={location === 'header' ? 'blue' : location === 'footer' ? 'purple' : 'green'}>
          {location.toUpperCase()}
        </Tag>
      ),
      filters: [
        { text: 'Header', value: 'header' },
        { text: 'Footer', value: 'footer' },
        { text: 'Sidebar', value: 'sidebar' },
        { text: 'Mobile', value: 'mobile' },
      ],
      onFilter: (value, record) => record.location === value,
    },
    {
      title: 'Items Count',
      dataIndex: 'items',
      key: 'itemsCount',
      render: (items: CMSMenuItem[]) => items?.length || 0,
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean, record) => (
        <Switch
          checked={isActive}
          onChange={(checked) => handleToggleStatus(record.id, checked)}
        />
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEditMenu(record)}>
            Edit
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteMenu(record.id)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  const getTreeData = (location: string): DataNode[] => {
    const menu = menus.find((m) => m.location === location);
    if (!menu || !menu.items) return [];

    return menu.items
      .sort((a, b) => a.displayOrder - b.displayOrder)
      .map((item) => ({
        title: `${item.label} (${item.url})`,
        key: item.id,
        icon: <LinkOutlined />,
      }));
  };

  return (
    <div style={{ padding: 24 }}>
      <Card
        title={<Title level={3}>Menu Management</Title>}
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddMenu}>
            Add Menu
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={menus}
          loading={loading}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>

      {/* Modal for Add/Edit Menu */}
      <Modal
        title={editingMenu ? 'Edit Menu' : 'Add Menu'}
        open={modalVisible}
        onOk={() => form.submit()}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="name"
            label="Menu Name"
            rules={[{ required: true, message: 'Please enter menu name' }]}
          >
            <Input placeholder="Enter menu name" />
          </Form.Item>

          <Form.Item
            name="location"
            label="Location"
            rules={[{ required: true, message: 'Please select location' }]}
          >
            <Select placeholder="Select location">
              <Option value="header">Header</Option>
              <Option value="footer">Footer</Option>
              <Option value="sidebar">Sidebar</Option>
              <Option value="mobile">Mobile</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="isActive"
            label="Active"
            valuePropName="checked"
            initialValue={true}
          >
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminMenusPage;
