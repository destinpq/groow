import { ProTable } from '@ant-design/pro-components';
import type { ProColumns } from '@ant-design/pro-components';
import { Button, Space, Modal, Form, Input, Upload, message, Image } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import { useState } from 'react';

interface BrandType {
  id: string;
  name: string;
  slug: string;
  logo: string;
  description: string;
  productsCount: number;
  createdAt: string;
}

const AdminBrands = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  const columns: ProColumns<BrandType>[] = [
    {
      title: 'Logo',
      dataIndex: 'logo',
      key: 'logo',
      width: 100,
      render: (logo) => <Image src={logo} width={50} height={50} style={{ objectFit: 'contain' }} />,
    },
    {
      title: 'Brand Name',
      dataIndex: 'name',
      key: 'name',
      width: 200,
    },
    {
      title: 'Slug',
      dataIndex: 'slug',
      key: 'slug',
      copyable: true,
    },
    {
      title: 'Products',
      dataIndex: 'productsCount',
      key: 'productsCount',
      width: 100,
      align: 'center',
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

  const mockData: BrandType[] = [
    {
      id: '1',
      name: 'Apple',
      slug: 'apple',
      logo: 'https://via.placeholder.com/100?text=Apple',
      description: 'Apple Inc.',
      productsCount: 45,
      createdAt: '2024-01-10',
    },
    {
      id: '2',
      name: 'Samsung',
      slug: 'samsung',
      logo: 'https://via.placeholder.com/100?text=Samsung',
      description: 'Samsung Electronics',
      productsCount: 67,
      createdAt: '2024-01-12',
    },
  ];

  const handleEdit = (record: BrandType) => {
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: 'Delete Brand',
      content: 'Are you sure you want to delete this brand?',
      onOk: () => message.success('Brand deleted'),
    });
  };

  return (
    <div>
      <ProTable<BrandType>
        columns={columns}
        dataSource={mockData}
        rowKey="id"
        search={false}
        headerTitle="Brands Management"
        toolBarRender={() => [
          <Button key="add" type="primary" icon={<PlusOutlined />} onClick={() => setModalVisible(true)}>
            Add Brand
          </Button>,
        ]}
      />

      <Modal
        title="Brand Details"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={() => message.success('Brand saved')}>
          <Form.Item name="name" label="Brand Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="slug" label="Slug" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="logo" label="Logo">
            <Upload listType="picture">
              <Button icon={<UploadOutlined />}>Upload Logo</Button>
            </Upload>
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea rows={3} />
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

export default AdminBrands;
