import { ProTable } from '@ant-design/pro-components';
import type { ProColumns } from '@ant-design/pro-components';
import { Button, Space, Modal, Form, Input, Upload, Switch, Select, message, Image, DatePicker } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { cmsAPI, CMSBanner } from '@/services/api';
import dayjs from 'dayjs';

const AdminBanners = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [editingBanner, setEditingBanner] = useState<CMSBanner | null>(null);
  const [banners, setBanners] = useState<CMSBanner[]>([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    loadBanners();
  }, []);

  const loadBanners = async () => {
    try {
      setLoading(true);
      const response = await cmsAPI.banners.getAll();
      setBanners(response.data);
    } catch (error) {
      message.error('Failed to load banners');
      console.error('Load banners error:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns: ProColumns<CMSBanner>[] = [
    {
      title: 'Image',
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      width: 150,
      render: (_, record) => <Image src={record.imageUrl} width={120} height={60} style={{ objectFit: 'cover' }} />,
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      width: 200,
    },
    {
      title: 'Placement',
      dataIndex: 'placement',
      key: 'placement',
      width: 150,
      filters: [
        { text: 'Home Hero', value: 'home-hero' },
        { text: 'Home Secondary', value: 'home-secondary' },
        { text: 'Category', value: 'category' },
        { text: 'Product', value: 'product' },
        { text: 'Sidebar', value: 'sidebar' },
      ],
    },
    {
      title: 'Order',
      dataIndex: 'displayOrder',
      key: 'displayOrder',
      width: 80,
      sorter: true,
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 100,
      render: (_, record) => (
        <Switch 
          checked={record.isActive} 
          onChange={() => handleToggleStatus(record.id, record.isActive)} 
        />
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      render: (_, record) => (
        <Space>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Button type="link" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)} />
        </Space>
      ),
    },
  ];

  const handleToggleStatus = async (id: number, currentStatus: boolean) => {
    try {
      await cmsAPI.banners.update(id, { isActive: !currentStatus });
      message.success('Status updated successfully');
      loadBanners();
    } catch (error) {
      message.error('Failed to update status');
      console.error('Toggle status error:', error);
    }
  };

  const handleEdit = (record: CMSBanner) => {
    setEditingBanner(record);
    form.setFieldsValue({
      ...record,
      startDate: record.startDate ? dayjs(record.startDate) : null,
      endDate: record.endDate ? dayjs(record.endDate) : null,
    });
    setModalVisible(true);
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: 'Delete Banner',
      content: 'Are you sure you want to delete this banner?',
      okText: 'Delete',
      okType: 'danger',
      onOk: async () => {
        try {
          await cmsAPI.banners.delete(id);
          message.success('Banner deleted successfully');
          loadBanners();
        } catch (error) {
          message.error('Failed to delete banner');
          console.error('Delete error:', error);
        }
      },
    });
  };

  const handleSubmit = async (values: any) => {
    try {
      const bannerData = {
        ...values,
        startDate: values.startDate ? values.startDate.format('YYYY-MM-DD') : undefined,
        endDate: values.endDate ? values.endDate.format('YYYY-MM-DD') : undefined,
      };

      if (editingBanner) {
        await cmsAPI.banners.update(editingBanner.id, bannerData);
        message.success('Banner updated successfully');
      } else {
        await cmsAPI.banners.create(bannerData);
        message.success('Banner created successfully');
      }

      setModalVisible(false);
      setEditingBanner(null);
      form.resetFields();
      loadBanners();
    } catch (error) {
      message.error(`Failed to ${editingBanner ? 'update' : 'create'} banner`);
      console.error('Submit error:', error);
    }
  };

  const handleAddNew = () => {
    setEditingBanner(null);
    form.resetFields();
    setModalVisible(true);
  };

  return (
    <div>
      <ProTable<CMSBanner>
        columns={columns}
        dataSource={banners}
        loading={loading}
        rowKey="id"
        search={false}
        headerTitle="Banners Management"
        toolBarRender={() => [
          <Button key="add" type="primary" icon={<PlusOutlined />} onClick={handleAddNew}>
            Add Banner
          </Button>,
        ]}
      />

      <Modal
        title={editingBanner ? 'Edit Banner' : 'Add Banner'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setEditingBanner(null);
          form.resetFields();
        }}
        footer={null}
        width={700}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="title" label="Banner Title" rules={[{ required: true, message: 'Please enter title' }]}>
            <Input placeholder="Summer Sale 2024" />
          </Form.Item>
          
          <Form.Item name="description" label="Description">
            <Input.TextArea rows={3} placeholder="Banner description..." />
          </Form.Item>

          <Form.Item name="imageUrl" label="Image URL" rules={[{ required: true, message: 'Please enter image URL' }]}>
            <Input placeholder="https://example.com/banner.jpg" />
          </Form.Item>

          <Form.Item name="linkUrl" label="Link URL">
            <Input placeholder="https://example.com/sale" />
          </Form.Item>

          <Form.Item name="linkText" label="Link Text">
            <Input placeholder="Shop Now" />
          </Form.Item>

          <Form.Item name="placement" label="Placement" rules={[{ required: true }]}>
            <Select placeholder="Select placement">
              <Select.Option value="home-hero">Home Hero</Select.Option>
              <Select.Option value="home-secondary">Home Secondary</Select.Option>
              <Select.Option value="category">Category</Select.Option>
              <Select.Option value="product">Product</Select.Option>
              <Select.Option value="sidebar">Sidebar</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="displayOrder" label="Display Order" rules={[{ required: true }]}>
            <Input type="number" placeholder="1" />
          </Form.Item>

          <Form.Item name="startDate" label="Start Date">
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name="endDate" label="End Date">
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name="targetBlank" label="Open in New Tab" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Form.Item name="isActive" label="Active" valuePropName="checked" initialValue={true}>
            <Switch />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingBanner ? 'Update' : 'Create'} Banner
              </Button>
              <Button onClick={() => {
                setModalVisible(false);
                setEditingBanner(null);
                form.resetFields();
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

export default AdminBanners;
