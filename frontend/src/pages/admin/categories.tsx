import { ProTable } from '@ant-design/pro-components';
import type { ProColumns, ActionType } from '@ant-design/pro-components';
import { Tag, Button, Space, Modal, Form, Input, Select, message, Switch } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useState, useRef, useEffect } from 'react';
import { categoriesAPI, type Category } from '@/services/api/catalog';

const AdminCategories = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const actionRef = useRef<ActionType>();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await categoriesAPI.getAll();
      setCategories(response || []);
    } catch (error: any) {
      console.error('Failed to fetch categories:', error);
      message.error(error?.response?.data?.message || 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const getParentName = (parentId: string | null | undefined): string => {
    if (!parentId) return '';
    const parent = categories.find(cat => cat.id === parentId);
    return parent?.name || '';
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      await categoriesAPI.toggleActive(id);
      message.success('Category status updated');
      fetchCategories();
    } catch (error: any) {
      message.error(error?.response?.data?.message || 'Failed to update category status');
    }
  };

  const columns: ProColumns<Category>[] = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: 200,
    },
    {
      title: 'Slug',
      dataIndex: 'slug',
      key: 'slug',
      width: 180,
      copyable: true,
    },
    {
      title: 'Parent Category',
      dataIndex: 'parentId',
      key: 'parentId',
      width: 150,
      render: (_: any, record: Category) => record.parentId ? getParentName(record.parentId) : <Tag>Root</Tag>,
    },
    {
      title: 'Products',
      dataIndex: 'productCount',
      key: 'productCount',
      width: 100,
      align: 'center' as const,
      render: (_: any, record: Category) => record.productCount || 0,
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 100,
      render: (_: any, record: Category) => (
        <Switch checked={record.isActive} onChange={() => handleToggleActive(record.id, record.isActive)} />
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      render: (_: any, record: Category) => (
        <Space>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Button type="link" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  const handleAdd = () => {
    setEditingCategory(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: Category) => {
    setEditingCategory(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: 'Delete Category',
      content: 'Are you sure you want to delete this category? This action cannot be undone.',
      onOk: async () => {
        try {
          await categoriesAPI.delete(id);
          message.success('Category deleted successfully');
          fetchCategories();
        } catch (error: any) {
          message.error(error?.response?.data?.message || 'Failed to delete category');
        }
      },
    });
  };

  const handleSubmit = async (values: any) => {
    try {
      if (editingCategory) {
        await categoriesAPI.update(editingCategory.id, values);
        message.success('Category updated successfully');
      } else {
        await categoriesAPI.create(values);
        message.success('Category created successfully');
      }
      setModalVisible(false);
      form.resetFields();
      setEditingCategory(null);
      fetchCategories();
    } catch (error: any) {
      message.error(error?.response?.data?.message || 'Failed to save category');
    }
  };

  return (
    <div>
      <ProTable<Category>
        columns={columns}
        dataSource={categories}
        rowKey="id"
        loading={loading}
        search={false}
        headerTitle="Categories Management"
        toolBarRender={() => [
          <Button key="add" type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            Add Category
          </Button>,
        ]}
      />

      <Modal
        title={editingCategory ? 'Edit Category' : 'Add Category'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setEditingCategory(null);
        }}
        footer={null}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="name" label="Category Name" rules={[{ required: true, message: 'Please enter category name' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="slug" label="Slug" rules={[{ required: true, message: 'Please enter slug' }]}>
            <Input placeholder="auto-generated-from-name" />
          </Form.Item>
          <Form.Item name="parentId" label="Parent Category">
            <Select allowClear placeholder="Select parent category (leave empty for root)">
              {categories.filter(cat => cat.id !== editingCategory?.id).map(cat => (
                <Select.Option key={cat.id} value={cat.id}>{cat.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingCategory ? 'Update' : 'Create'}
              </Button>
              <Button onClick={() => {
                setModalVisible(false);
                setEditingCategory(null);
              }}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminCategories;
