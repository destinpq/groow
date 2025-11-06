import React, { useState } from 'react';
import {
  Card,
  Table,
  Tag,
  Button,
  Space,
  Input,
  Select,
  Modal,
  Form,
  InputNumber,
  DatePicker,
  message,
  Typography,
  Row,
  Col,
} from 'antd';
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  GiftOutlined,
  PercentageOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

interface Promotion {
  id: number;
  name: string;
  type: string;
  discount: number;
  startDate: string;
  endDate: string;
  status: string;
  products: number;
  used: number;
  maxUses?: number;
}

const mockPromotions: Promotion[] = [
  {
    id: 1,
    name: 'Black Friday Sale',
    type: 'percentage',
    discount: 25,
    startDate: '2024-11-24',
    endDate: '2024-11-30',
    status: 'scheduled',
    products: 15,
    used: 0,
    maxUses: 100,
  },
  {
    id: 2,
    name: 'Headphones Special',
    type: 'fixed',
    discount: 50,
    startDate: '2024-10-15',
    endDate: '2024-11-15',
    status: 'active',
    products: 5,
    used: 23,
    maxUses: 50,
  },
  {
    id: 3,
    name: 'Summer Clearance',
    type: 'percentage',
    discount: 30,
    startDate: '2024-08-01',
    endDate: '2024-09-30',
    status: 'expired',
    products: 25,
    used: 67,
    maxUses: 100,
  },
];

const VendorPromotionsPage: React.FC = () => {
  const [promotions, setPromotions] = useState<Promotion[]>(mockPromotions);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);
  const [form] = Form.useForm();

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      active: 'success',
      scheduled: 'processing',
      expired: 'default',
      paused: 'warning',
    };
    return colors[status] || 'default';
  };

  const handleAddPromotion = () => {
    setEditingPromotion(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEditPromotion = (promotion: Promotion) => {
    setEditingPromotion(promotion);
    form.setFieldsValue({
      ...promotion,
      dateRange: [dayjs(promotion.startDate), dayjs(promotion.endDate)],
    });
    setModalVisible(true);
  };

  const handleDeletePromotion = (id: number) => {
    Modal.confirm({
      title: 'Delete Promotion',
      content: 'Are you sure you want to delete this promotion?',
      okText: 'Delete',
      okType: 'danger',
      onOk: () => {
        setPromotions(promotions.filter((p) => p.id !== id));
        message.success('Promotion deleted successfully');
      },
    });
  };

  const handleSubmit = (values: any) => {
    console.log('Promotion data:', values);
    const [startDate, endDate] = values.dateRange;
    const promotionData = {
      ...values,
      startDate: startDate.format('YYYY-MM-DD'),
      endDate: endDate.format('YYYY-MM-DD'),
      id: editingPromotion?.id || promotions.length + 1,
      products: editingPromotion?.products || 0,
      used: editingPromotion?.used || 0,
    };

    if (editingPromotion) {
      setPromotions(
        promotions.map((p) => (p.id === editingPromotion.id ? promotionData : p))
      );
      message.success('Promotion updated successfully');
    } else {
      setPromotions([...promotions, promotionData]);
      message.success('Promotion created successfully');
    }

    setModalVisible(false);
    form.resetFields();
  };

  const columns: ColumnsType<Promotion> = [
    {
      title: 'Promotion Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <Tag icon={type === 'percentage' ? <PercentageOutlined /> : <GiftOutlined />}>
          {type === 'percentage' ? 'Percentage' : 'Fixed Amount'}
        </Tag>
      ),
    },
    {
      title: 'Discount',
      dataIndex: 'discount',
      key: 'discount',
      render: (discount: number, record) => (
        <Text strong style={{ color: '#ff4d4f', fontSize: 16 }}>
          {record.type === 'percentage' ? `${discount}%` : `$${discount}`}
        </Text>
      ),
    },
    {
      title: 'Duration',
      key: 'duration',
      render: (_, record) => (
        <div>
          <Text>{new Date(record.startDate).toLocaleDateString()}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: 12 }}>
            to {new Date(record.endDate).toLocaleDateString()}
          </Text>
        </div>
      ),
    },
    {
      title: 'Products',
      dataIndex: 'products',
      key: 'products',
      render: (products: number) => <Text>{products} products</Text>,
    },
    {
      title: 'Usage',
      key: 'usage',
      render: (_, record) => (
        <div>
          <Text>
            {record.used} / {record.maxUses || '∞'}
          </Text>
          {record.maxUses && (
            <div style={{ fontSize: 12 }}>
              <Text type="secondary">
                {((record.used / record.maxUses) * 100).toFixed(0)}% used
              </Text>
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{status.toUpperCase()}</Tag>
      ),
      filters: [
        { text: 'Active', value: 'active' },
        { text: 'Scheduled', value: 'scheduled' },
        { text: 'Expired', value: 'expired' },
        { text: 'Paused', value: 'paused' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEditPromotion(record)}
          >
            Edit
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeletePromotion(record.id)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  const activePromotions = promotions.filter((p) => p.status === 'active').length;
  const totalDiscount = promotions
    .filter((p) => p.status === 'active')
    .reduce((sum, p) => sum + (p.type === 'fixed' ? p.discount * p.used : 0), 0);

  return (
    <div style={{ padding: 24 }}>
      <Card
        title={<Title level={3}>Promotions & Deals</Title>}
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddPromotion}>
            Create Promotion
          </Button>
        }
      >
        {/* Statistics */}
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={8}>
            <Card size="small">
              <Text type="secondary">Total Promotions</Text>
              <Title level={3} style={{ margin: 0 }}>
                {promotions.length}
              </Title>
            </Card>
          </Col>
          <Col span={8}>
            <Card size="small">
              <Text type="secondary">Active Promotions</Text>
              <Title level={3} style={{ margin: 0, color: '#52c41a' }}>
                {activePromotions}
              </Title>
            </Card>
          </Col>
          <Col span={8}>
            <Card size="small">
              <Text type="secondary">Total Discount Given</Text>
              <Title level={3} style={{ margin: 0, color: '#ff4d4f' }}>
                ${totalDiscount.toFixed(2)}
              </Title>
            </Card>
          </Col>
        </Row>

        {/* Filters */}
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col xs={24} sm={12} md={8}>
            <Input
              placeholder="Search promotions..."
              prefix={<SearchOutlined />}
              size="large"
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Select placeholder="Status" size="large" style={{ width: '100%' }}>
              <Option value="all">All Promotions</Option>
              <Option value="active">Active</Option>
              <Option value="scheduled">Scheduled</Option>
              <Option value="expired">Expired</Option>
              <Option value="paused">Paused</Option>
            </Select>
          </Col>
        </Row>

        {/* Promotions Table */}
        <Table
          columns={columns}
          dataSource={promotions}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} promotions`,
          }}
        />
      </Card>

      {/* Add/Edit Promotion Modal */}
      <Modal
        title={editingPromotion ? 'Edit Promotion' : 'Create New Promotion'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={700}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="name"
            label="Promotion Name"
            rules={[{ required: true, message: 'Please enter promotion name' }]}
          >
            <Input placeholder="e.g., Black Friday Sale" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="type"
                label="Discount Type"
                rules={[{ required: true, message: 'Please select type' }]}
              >
                <Select placeholder="Select type">
                  <Option value="percentage">Percentage Off</Option>
                  <Option value="fixed">Fixed Amount Off</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="discount"
                label="Discount Value"
                rules={[{ required: true, message: 'Please enter discount' }]}
              >
                <InputNumber
                  min={0}
                  style={{ width: '100%' }}
                  placeholder="Enter value"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="dateRange"
            label="Promotion Duration"
            rules={[{ required: true, message: 'Please select date range' }]}
          >
            <RangePicker style={{ width: '100%' }} />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="maxUses" label="Maximum Uses (Optional)">
                <InputNumber
                  min={1}
                  style={{ width: '100%' }}
                  placeholder="Leave empty for unlimited"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label="Status"
                rules={[{ required: true, message: 'Please select status' }]}
              >
                <Select placeholder="Select status">
                  <Option value="active">Active</Option>
                  <Option value="scheduled">Scheduled</Option>
                  <Option value="paused">Paused</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => setModalVisible(false)}>Cancel</Button>
              <Button type="primary" htmlType="submit">
                {editingPromotion ? 'Update' : 'Create'} Promotion
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default VendorPromotionsPage;
