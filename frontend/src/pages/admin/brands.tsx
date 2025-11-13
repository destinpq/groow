/**
 * SAFE API RESPONSE HANDLING - APPLY THIS PATTERN:
 * const dataArray = response?.data?.data || response?.data || [];
 * const total = response?.data?.meta?.total || response?.meta?.total || response?.total || 0;
 * Always check: Array.isArray(data) before .map()/.filter()
 */

import { ProTable } from '@ant-design/pro-components';
import type { ProColumns, ActionType } from '@ant-design/pro-components';
import { Button, Space, Modal, Form, Input, Upload, message, Image, Switch } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import { useState, useRef, useEffect } from 'react';
import { brandsAPI, type Brand } from '@/services/api/catalog';
import type { UploadFile } from 'antd/es/upload/interface';

const AdminBrands = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [form] = Form.useForm();
  const actionRef = useRef<ActionType>();

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      setLoading(true);
      const response = await brandsAPI.getAll();
      
      // SAFE API RESPONSE HANDLING
      const brandsData = response?.data?.data || response?.data || [];
      setBrands(Array.isArray(brandsData) ? brandsData : []);
    } catch (error: any) {
      console.error('Failed to fetch brands:', error);
      message.error(error?.response?.data?.message || 'Failed to load brands');
      setBrands([]);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      await brandsAPI.toggleActive(id);
      message.success('Brand status updated');
      fetchBrands();
    } catch (error: any) {
      message.error(error?.response?.data?.message || 'Failed to update brand status');
    }
  };

  const columns: ProColumns<Brand>[] = [
    {
      title: 'Logo',
      dataIndex: 'logo',
      key: 'logo',
      width: 100,
      render: (_: any, record: Brand) => record.logo ? (
        <Image src={record.logo} width={50} height={50} style={{ objectFit: 'contain' }} />
      ) : (
        <div style={{ width: 50, height: 50, background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          No Logo
        </div>
      ),
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
      dataIndex: 'productCount',
      key: 'productCount',
      width: 100,
      align: 'center' as const,
      render: (_: any, record: Brand) => record.productCount || 0,
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 100,
      render: (_: any, record: Brand) => (
        <Switch checked={record.isActive} onChange={() => handleToggleActive(record.id, record.isActive)} />
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      render: (_: any, record: Brand) => (
        <Space>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Button type="link" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)} />
        </Space>
      ),
    },
  ];

  const handleAdd = () => {
    setEditingBrand(null);
    form.resetFields();
    setFileList([]);
    setModalVisible(true);
  };

  const handleEdit = (record: Brand) => {
    setEditingBrand(record);
    form.setFieldsValue(record);
    if (record.logo) {
      setFileList([{
        uid: '-1',
        name: 'logo.png',
        status: 'done',
        url: record.logo,
      }]);
    }
    setModalVisible(true);
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: 'Delete Brand',
      content: 'Are you sure you want to delete this brand? This action cannot be undone.',
      onOk: async () => {
        try {
          await brandsAPI.delete(id);
          message.success('Brand deleted successfully');
          fetchBrands();
        } catch (error: any) {
          message.error(error?.response?.data?.message || 'Failed to delete brand');
        }
      },
    });
  };

  const handleSubmit = async (values: any) => {
    try {
      const brandData = {
        ...values,
        logo: fileList[0]?.url || fileList[0]?.response?.url || undefined,
      };

      if (editingBrand) {
        await brandsAPI.update(editingBrand.id, brandData);
        message.success('Brand updated successfully');
      } else {
        await brandsAPI.create(brandData);
        message.success('Brand created successfully');
      }
      setModalVisible(false);
      form.resetFields();
      setFileList([]);
      setEditingBrand(null);
      fetchBrands();
    } catch (error: any) {
      message.error(error?.response?.data?.message || 'Failed to save brand');
    }
  };

  return (
    <div>
      <ProTable<Brand>
        columns={columns}
        dataSource={brands}
        rowKey="id"
        loading={loading}
        search={false}
        headerTitle="Brands Management"
        toolBarRender={() => [
          <Button key="add" type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            Add Brand
          </Button>,
        ]}
      />

      <Modal
        title={editingBrand ? 'Edit Brand' : 'Add Brand'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setEditingBrand(null);
          setFileList([]);
        }}
        footer={null}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="name" label="Brand Name" rules={[{ required: true, message: 'Please enter brand name' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="slug" label="Slug" rules={[{ required: true, message: 'Please enter slug' }]}>
            <Input placeholder="auto-generated-from-name" />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="website" label="Website URL">
            <Input placeholder="https://example.com" />
          </Form.Item>
          <Form.Item label="Brand Logo">
            <Upload
              listType="picture-card"
              fileList={fileList}
              onChange={({ fileList: newFileList }) => setFileList(newFileList)}
              beforeUpload={() => false}
              maxCount={1}
            >
              {fileList.length >= 1 ? null : (
                <div>
                  <UploadOutlined />
                  <div style={{ marginTop: 8 }}>Upload Logo</div>
                </div>
              )}
            </Upload>
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingBrand ? 'Update' : 'Create'}
              </Button>
              <Button onClick={() => {
                setModalVisible(false);
                setEditingBrand(null);
                setFileList([]);
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

export default AdminBrands;
