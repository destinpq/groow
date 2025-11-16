/**
 * SAFE API RESPONSE HANDLING - APPLY THIS PATTERN:
 * const dataArray = response?.data?.data || response?.data || [];
 * const total = response?.data?.meta?.total || response?.meta?.total || response?.total || 0;
 * Always check: Array.isArray(data) before .map()/.filter()
 */

import { ProTable } from '@ant-design/pro-components';
import type { ProColumns } from '@ant-design/pro-components';
import { Button, Space, Modal, Form, Input, Upload, Switch, Select, message, Image } from 'antd';
import { getPlaceholderByType } from '@/utils/placeholderImage';
import { PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import { useState } from 'react';

interface BannerType {
  id: string;
  title: string;
  image: string;
  link: string;
  position: string;
  order: number;
  active: boolean;
  createdAt: string;
}

const AdminBanners = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  const columns: ProColumns<BannerType>[] = [
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      width: 150,
      render: (image: string) => <Image src={image} width={120} height={60} style={{ objectFit: 'cover' }} />,
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      width: 200,
    },
    {
      title: 'Position',
      dataIndex: 'position',
      key: 'position',
      width: 150,
      filters: [
        { text: 'Homepage Top', value: 'home_top' },
        { text: 'Homepage Middle', value: 'home_middle' },
        { text: 'Sidebar', value: 'sidebar' },
      ],
    },
    {
      title: 'Order',
      dataIndex: 'order',
      key: 'order',
      width: 80,
      sorter: true,
    },
    {
      title: 'Status',
      dataIndex: 'active',
      key: 'active',
      width: 100,
      render: (active: boolean) => <Switch checked={active} onChange={() => message.success('Status updated')} />,
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

  const mockData: BannerType[] = [
    {
      id: '1',
      title: 'Summer Sale Banner',
      image: getPlaceholderByType('banner', 'Summer Sale'),
      link: '/deals/summer-sale',
      position: 'home_top',
      order: 1,
      active: true,
      createdAt: '2024-11-01',
    },
  ];

  const handleEdit = (record: BannerType) => {
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: 'Delete Banner',
      content: 'Are you sure?',
      onOk: () => message.success('Banner deleted'),
    });
  };

  return (
    <div>
      <ProTable<BannerType>
        columns={columns}
        dataSource={mockData}
        rowKey="id"
        search={false}
        headerTitle="Banners Management"
        toolBarRender={() => [
          <Button key="add" type="primary" icon={<PlusOutlined />} onClick={() => setModalVisible(true)}>
            Add Banner
          </Button>,
        ]}
      />

      <Modal
        title="Banner Details"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={() => message.success('Banner saved')}>
          <Form.Item name="title" label="Title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="image" label="Banner Image" rules={[{ required: true }]}>
            <Upload listType="picture">
              <Button icon={<UploadOutlined />}>Upload Image</Button>
            </Upload>
          </Form.Item>
          <Form.Item name="link" label="Link URL">
            <Input placeholder="https://..." />
          </Form.Item>
          <Form.Item name="position" label="Position" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="home_top">Homepage Top</Select.Option>
              <Select.Option value="home_middle">Homepage Middle</Select.Option>
              <Select.Option value="sidebar">Sidebar</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="order" label="Display Order">
            <Input type="number" />
          </Form.Item>
          <Form.Item name="active" label="Active" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">Submit</Button>
              <Button onClick={() => setModalVisible(false)}>Cancel</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminBanners;
