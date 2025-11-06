import { ProTable } from '@ant-design/pro-components';
import type { ProColumns } from '@ant-design/pro-components';
import { Button, Space, Modal, Form, Input, Select, message, Switch } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { cmsAPI, CMSFAQ } from '@/services/api';

const AdminFAQs = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [editingFaq, setEditingFaq] = useState<CMSFAQ | null>(null);
  const [faqs, setFaqs] = useState<CMSFAQ[]>([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    loadFaqs();
  }, []);

  const loadFaqs = async () => {
    try {
      setLoading(true);
      const response = await cmsAPI.faqs.getAll();
      setFaqs(response.data);
    } catch (error) {
      message.error('Failed to load FAQs');
    } finally {
      setLoading(false);
    }
  };

  const columns: ProColumns<CMSFAQ>[] = [
    {
      title: 'Question',
      dataIndex: 'question',
      key: 'question',
      width: 300,
      ellipsis: true,
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      width: 150,
      filters: [
        { text: 'Orders', value: 'orders' },
        { text: 'Shipping', value: 'shipping' },
        { text: 'Returns', value: 'returns' },
        { text: 'Account', value: 'account' },
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
      title: 'Views',
      dataIndex: 'viewCount',
      key: 'viewCount',
      width: 100,
      sorter: true,
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 100,
      render: (_, record) => <Switch checked={record.isActive} onChange={() => handleToggle(record.id, record.isActive)} />,
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

  const handleToggle = async (id: number, currentStatus: boolean) => {
    try {
      await cmsAPI.faqs.update(id, { isActive: !currentStatus });
      message.success('Status updated');
      loadFaqs();
    } catch (error) {
      message.error('Failed to update status');
    }
  };

  const handleEdit = (record: CMSFAQ) => {
    setEditingFaq(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: 'Delete FAQ',
      content: 'Are you sure?',
      okType: 'danger',
      onOk: async () => {
        try {
          await cmsAPI.faqs.delete(id);
          message.success('FAQ deleted');
          loadFaqs();
        } catch (error) {
          message.error('Failed to delete FAQ');
        }
      },
    });
  };

  const handleSubmit = async (values: any) => {
    try {
      if (editingFaq) {
        await cmsAPI.faqs.update(editingFaq.id, values);
        message.success('FAQ updated');
      } else {
        await cmsAPI.faqs.create(values);
        message.success('FAQ created');
      }
      setModalVisible(false);
      setEditingFaq(null);
      form.resetFields();
      loadFaqs();
    } catch (error) {
      message.error('Failed to save FAQ');
    }
  };

  return (
    <div>
      <ProTable<CMSFAQ>
        columns={columns}
        dataSource={faqs}
        loading={loading}
        rowKey="id"
        search={false}
        headerTitle="FAQs Management"
        toolBarRender={() => [
          <Button key="add" type="primary" icon={<PlusOutlined />} onClick={() => { setEditingFaq(null); form.resetFields(); setModalVisible(true); }}>
            Add FAQ
          </Button>,
        ]}
      />

      <Modal
        title={editingFaq ? "Edit FAQ" : "Add FAQ"}
        open={modalVisible}
        onCancel={() => { setModalVisible(false); setEditingFaq(null); form.resetFields(); }}
        footer={null}
        width={700}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="question" label="Question" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="answer" label="Answer" rules={[{ required: true }]}>
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item name="category" label="Category" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="orders">Orders</Select.Option>
              <Select.Option value="shipping">Shipping</Select.Option>
              <Select.Option value="returns">Returns</Select.Option>
              <Select.Option value="account">Account</Select.Option>
              <Select.Option value="payment">Payment</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="displayOrder" label="Display Order" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item name="isActive" label="Active" valuePropName="checked" initialValue={true}>
            <Switch />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">{editingFaq ? 'Update' : 'Create'}</Button>
              <Button onClick={() => { setModalVisible(false); setEditingFaq(null); form.resetFields(); }}>Cancel</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminFAQs;
