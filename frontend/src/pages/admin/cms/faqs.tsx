/**
 * SAFE API RESPONSE HANDLING - APPLY THIS PATTERN:
 * const dataArray = response?.data?.data || response?.data || [];
 * const total = response?.data?.meta?.total || response?.meta?.total || response?.total || 0;
 * Always check: Array.isArray(data) before .map()/.filter()
 */

import { ProTable } from '@ant-design/pro-components';
import type { ProColumns } from '@ant-design/pro-components';
import { Button, Space, Modal, Form, Input, Select, message, Switch } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useState } from 'react';

interface FAQType {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  active: boolean;
  views: number;
}

const AdminFAQs = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  const columns: ProColumns<FAQType>[] = [
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
      dataIndex: 'order',
      key: 'order',
      width: 80,
      sorter: true,
    },
    {
      title: 'Views',
      dataIndex: 'views',
      key: 'views',
      width: 100,
      sorter: true,
    },
    {
      title: 'Status',
      dataIndex: 'active',
      key: 'active',
      width: 100,
      render: (active: boolean) => <Switch checked={active} />,
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

  const mockData: FAQType[] = [
    {
      id: '1',
      question: 'How do I track my order?',
      answer: 'You can track your order by logging into your account and visiting the Orders section.',
      category: 'orders',
      order: 1,
      active: true,
      views: 1234,
    },
    {
      id: '2',
      question: 'What is the return policy?',
      answer: 'We offer a 30-day return policy for most items. Please check the product page for specific details.',
      category: 'returns',
      order: 2,
      active: true,
      views: 987,
    },
  ];

  const handleEdit = (record: FAQType) => {
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: 'Delete FAQ',
      content: 'Are you sure?',
      onOk: () => message.success('FAQ deleted'),
    });
  };

  return (
    <div>
      <ProTable<FAQType>
        columns={columns}
        dataSource={mockData}
        rowKey="id"
        search={false}
        headerTitle="FAQs Management"
        toolBarRender={() => [
          <Button key="add" type="primary" icon={<PlusOutlined />} onClick={() => setModalVisible(true)}>
            Add FAQ
          </Button>,
        ]}
      />

      <Modal
        title="FAQ Details"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={700}
      >
        <Form form={form} layout="vertical" onFinish={() => message.success('FAQ saved')}>
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

export default AdminFAQs;
