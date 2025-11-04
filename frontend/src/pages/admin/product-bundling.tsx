import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Table,
  Space,
  Button,
  Tag,
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  Switch,
  message,
  Divider,
  Tooltip,
  Badge,
  Image,
  Transfer,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  GiftOutlined,
  ShoppingOutlined,
  PercentageOutlined,
  DollarOutlined,
  TagsOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  stock: number;
}

interface BundleProduct {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  image: string;
}

interface Bundle {
  id: number;
  name: string;
  description: string;
  products: BundleProduct[];
  totalPrice: number;
  bundlePrice: number;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  savings: number;
  savingsPercent: number;
  status: 'active' | 'inactive' | 'draft';
  stockLimit: number;
  sold: number;
  createdAt: string;
}

const mockProducts: Product[] = [
  { id: 1, name: 'Laptop', price: 899, image: 'https://via.placeholder.com/60', stock: 50 },
  { id: 2, name: 'Mouse', price: 29, image: 'https://via.placeholder.com/60', stock: 200 },
  { id: 3, name: 'Keyboard', price: 79, image: 'https://via.placeholder.com/60', stock: 150 },
  { id: 4, name: 'Monitor', price: 299, image: 'https://via.placeholder.com/60', stock: 80 },
  { id: 5, name: 'Webcam', price: 89, image: 'https://via.placeholder.com/60', stock: 120 },
  { id: 6, name: 'Headphones', price: 149, image: 'https://via.placeholder.com/60', stock: 100 },
];

const mockBundles: Bundle[] = [
  {
    id: 1,
    name: 'Complete Home Office Bundle',
    description: 'Everything you need for your home office setup',
    products: [
      { id: 1, productId: 1, productName: 'Laptop', quantity: 1, price: 899, image: 'https://via.placeholder.com/60' },
      { id: 2, productId: 2, productName: 'Mouse', quantity: 1, price: 29, image: 'https://via.placeholder.com/60' },
      { id: 3, productId: 3, productName: 'Keyboard', quantity: 1, price: 79, image: 'https://via.placeholder.com/60' },
    ],
    totalPrice: 1007,
    bundlePrice: 899,
    discountType: 'fixed',
    discountValue: 108,
    savings: 108,
    savingsPercent: 10.7,
    status: 'active',
    stockLimit: 50,
    sold: 23,
    createdAt: dayjs().subtract(30, 'days').format('YYYY-MM-DD'),
  },
  {
    id: 2,
    name: 'Gaming Essentials',
    description: 'Perfect setup for gaming enthusiasts',
    products: [
      { id: 4, productId: 4, productName: 'Monitor', quantity: 1, price: 299, image: 'https://via.placeholder.com/60' },
      { id: 5, productId: 5, productName: 'Webcam', quantity: 1, price: 89, image: 'https://via.placeholder.com/60' },
      { id: 6, productId: 6, productName: 'Headphones', quantity: 1, price: 149, image: 'https://via.placeholder.com/60' },
    ],
    totalPrice: 537,
    bundlePrice: 429,
    discountType: 'percentage',
    discountValue: 20,
    savings: 108,
    savingsPercent: 20,
    status: 'active',
    stockLimit: 30,
    sold: 15,
    createdAt: dayjs().subtract(15, 'days').format('YYYY-MM-DD'),
  },
  {
    id: 3,
    name: 'Starter Pack',
    description: 'Basic accessories for everyday use',
    products: [
      { id: 7, productId: 2, productName: 'Mouse', quantity: 1, price: 29, image: 'https://via.placeholder.com/60' },
      { id: 8, productId: 3, productName: 'Keyboard', quantity: 1, price: 79, image: 'https://via.placeholder.com/60' },
    ],
    totalPrice: 108,
    bundlePrice: 89,
    discountType: 'fixed',
    discountValue: 19,
    savings: 19,
    savingsPercent: 17.6,
    status: 'draft',
    stockLimit: 100,
    sold: 0,
    createdAt: dayjs().subtract(5, 'days').format('YYYY-MM-DD'),
  },
];

const ProductBundlingPage: React.FC = () => {
  const [bundles, setBundles] = useState<Bundle[]>(mockBundles);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [editingBundle, setEditingBundle] = useState<Bundle | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [form] = Form.useForm();

  const handleCreateBundle = () => {
    setEditingBundle(null);
    setSelectedProducts([]);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEditBundle = (bundle: Bundle) => {
    setEditingBundle(bundle);
    setSelectedProducts(bundle.products.map((p) => p.productId));
    form.setFieldsValue({
      name: bundle.name,
      description: bundle.description,
      discountType: bundle.discountType,
      discountValue: bundle.discountValue,
      stockLimit: bundle.stockLimit,
      status: bundle.status,
    });
    setIsModalVisible(true);
  };

  const handleDeleteBundle = (bundleId: number) => {
    Modal.confirm({
      title: 'Delete Bundle',
      content: 'Are you sure you want to delete this bundle?',
      okText: 'Delete',
      okType: 'danger',
      onOk: () => {
        setBundles(bundles.filter((b) => b.id !== bundleId));
        message.success('Bundle deleted successfully');
      },
    });
  };

  const handleSubmit = (values: any) => {
    const selectedProductData = mockProducts.filter((p) => selectedProducts.includes(p.id));
    
    if (selectedProductData.length === 0) {
      message.error('Please select at least one product');
      return;
    }

    const totalPrice = selectedProductData.reduce((sum, p) => sum + p.price, 0);
    let bundlePrice = totalPrice;
    let savings = 0;
    let savingsPercent = 0;

    if (values.discountType === 'percentage') {
      savings = (totalPrice * values.discountValue) / 100;
      bundlePrice = totalPrice - savings;
      savingsPercent = values.discountValue;
    } else {
      savings = values.discountValue;
      bundlePrice = totalPrice - values.discountValue;
      savingsPercent = (savings / totalPrice) * 100;
    }

    const bundleProducts: BundleProduct[] = selectedProductData.map((p, index) => ({
      id: index + 1,
      productId: p.id,
      productName: p.name,
      quantity: 1,
      price: p.price,
      image: p.image,
    }));

    const bundleData: Bundle = {
      id: editingBundle ? editingBundle.id : bundles.length + 1,
      name: values.name,
      description: values.description,
      products: bundleProducts,
      totalPrice,
      bundlePrice,
      discountType: values.discountType,
      discountValue: values.discountValue,
      savings,
      savingsPercent,
      status: values.status,
      stockLimit: values.stockLimit,
      sold: editingBundle ? editingBundle.sold : 0,
      createdAt: editingBundle ? editingBundle.createdAt : dayjs().format('YYYY-MM-DD'),
    };

    if (editingBundle) {
      setBundles(bundles.map((b) => (b.id === editingBundle.id ? bundleData : b)));
      message.success('Bundle updated successfully');
    } else {
      setBundles([...bundles, bundleData]);
      message.success('Bundle created successfully');
    }

    setIsModalVisible(false);
    form.resetFields();
  };

  const columns: ColumnsType<Bundle> = [
    {
      title: 'Bundle',
      key: 'bundle',
      width: 300,
      render: (_, record) => (
        <div>
          <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
            {record.products.slice(0, 3).map((product) => (
              <Image
                key={product.id}
                src={product.image}
                width={40}
                height={40}
                style={{ borderRadius: 4 }}
                preview={false}
              />
            ))}
            {record.products.length > 3 && (
              <div
                style={{
                  width: 40,
                  height: 40,
                  background: '#f0f0f0',
                  borderRadius: 4,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text type="secondary">+{record.products.length - 3}</Text>
              </div>
            )}
          </div>
          <Text strong>{record.name}</Text>
          <div>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {record.products.length} products
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Pricing',
      key: 'pricing',
      render: (_, record) => (
        <div>
          <div>
            <Text delete type="secondary" style={{ fontSize: 12 }}>
              ${record.totalPrice}
            </Text>
          </div>
          <div>
            <Text strong style={{ fontSize: 16, color: '#52c41a' }}>
              ${record.bundlePrice}
            </Text>
          </div>
          <div>
            <Tag color="green" style={{ margin: 0 }}>
              Save ${record.savings} ({record.savingsPercent.toFixed(1)}%)
            </Tag>
          </div>
        </div>
      ),
    },
    {
      title: 'Stock',
      key: 'stock',
      render: (_, record) => (
        <div>
          <div>
            <Text>{record.stockLimit - record.sold} available</Text>
          </div>
          <div>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {record.sold} sold
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: Bundle['status']) => {
        const config: Record<Bundle['status'], { color: string; text: string }> = {
          active: { color: 'green', text: 'Active' },
          inactive: { color: 'red', text: 'Inactive' },
          draft: { color: 'orange', text: 'Draft' },
        };
        return <Tag color={config[status].color}>{config[status].text}</Tag>;
      },
      filters: [
        { text: 'Active', value: 'active' },
        { text: 'Inactive', value: 'inactive' },
        { text: 'Draft', value: 'draft' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => <Text>{dayjs(date).format('MMM DD, YYYY')}</Text>,
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right' as const,
      width: 150,
      render: (_, record) => (
        <Space>
          <Tooltip title="Edit">
            <Button type="link" icon={<EditOutlined />} onClick={() => handleEditBundle(record)} />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDeleteBundle(record.id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const totalBundles = bundles.length;
  const activeBundles = bundles.filter((b) => b.status === 'active').length;
  const totalSales = bundles.reduce((sum, b) => sum + b.sold * b.bundlePrice, 0);
  const averageDiscount = bundles.reduce((sum, b) => sum + b.savingsPercent, 0) / bundles.length;

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <div style={{ marginBottom: 24 }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={3}>
              <GiftOutlined style={{ color: '#722ed1' }} /> Product Bundling
            </Title>
            <Paragraph type="secondary">Create and manage product bundles with special pricing</Paragraph>
          </Col>
          <Col>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateBundle}>
              Create Bundle
            </Button>
          </Col>
        </Row>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  background: '#e6f7ff',
                  borderRadius: 8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <GiftOutlined style={{ fontSize: 24, color: '#1890ff' }} />
              </div>
              <div>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Total Bundles
                </Text>
                <div>
                  <Text strong style={{ fontSize: 24 }}>
                    {totalBundles}
                  </Text>
                </div>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  background: '#f6ffed',
                  borderRadius: 8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <TagsOutlined style={{ fontSize: 24, color: '#52c41a' }} />
              </div>
              <div>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Active Bundles
                </Text>
                <div>
                  <Text strong style={{ fontSize: 24 }}>
                    {activeBundles}
                  </Text>
                </div>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  background: '#f9f0ff',
                  borderRadius: 8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <DollarOutlined style={{ fontSize: 24, color: '#722ed1' }} />
              </div>
              <div>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Total Sales
                </Text>
                <div>
                  <Text strong style={{ fontSize: 24 }}>
                    ${totalSales.toLocaleString()}
                  </Text>
                </div>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  background: '#fff7e6',
                  borderRadius: 8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <PercentageOutlined style={{ fontSize: 24, color: '#fa8c16' }} />
              </div>
              <div>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Avg. Discount
                </Text>
                <div>
                  <Text strong style={{ fontSize: 24 }}>
                    {averageDiscount.toFixed(1)}%
                  </Text>
                </div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <Card>
        <Table columns={columns} dataSource={bundles} rowKey="id" scroll={{ x: 1200 }} />
      </Card>

      <Modal
        title={editingBundle ? 'Edit Bundle' : 'Create Bundle'}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        width={800}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Bundle Name"
            name="name"
            rules={[{ required: true, message: 'Please enter bundle name' }]}
          >
            <Input placeholder="e.g., Complete Home Office Bundle" />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: 'Please enter description' }]}
          >
            <TextArea rows={3} placeholder="Describe what's included in this bundle" />
          </Form.Item>

          <Form.Item label="Select Products">
            <div style={{ marginBottom: 16 }}>
              <Text type="secondary">Choose products to include in this bundle</Text>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              {mockProducts.map((product) => {
                const isSelected = selectedProducts.includes(product.id);
                return (
                  <div
                    key={product.id}
                    onClick={() => {
                      if (isSelected) {
                        setSelectedProducts(selectedProducts.filter((id) => id !== product.id));
                      } else {
                        setSelectedProducts([...selectedProducts, product.id]);
                      }
                    }}
                    style={{
                      width: 'calc(33.33% - 8px)',
                      border: isSelected ? '2px solid #1890ff' : '1px solid #d9d9d9',
                      borderRadius: 8,
                      padding: 12,
                      cursor: 'pointer',
                      background: isSelected ? '#e6f7ff' : 'white',
                      transition: 'all 0.3s',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Image src={product.image} width={50} height={50} preview={false} />
                      <div style={{ flex: 1 }}>
                        <Text strong style={{ fontSize: 13 }}>
                          {product.name}
                        </Text>
                        <div>
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            ${product.price}
                          </Text>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Form.Item>

          <Divider />

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Discount Type"
                name="discountType"
                rules={[{ required: true, message: 'Please select discount type' }]}
              >
                <Select placeholder="Select discount type">
                  <Option value="percentage">Percentage</Option>
                  <Option value="fixed">Fixed Amount</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Discount Value"
                name="discountValue"
                rules={[{ required: true, message: 'Please enter discount value' }]}
              >
                <InputNumber
                  min={0}
                  style={{ width: '100%' }}
                  placeholder="Enter discount"
                  addonAfter={
                    form.getFieldValue('discountType') === 'percentage' ? '%' : '$'
                  }
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Stock Limit"
                name="stockLimit"
                rules={[{ required: true, message: 'Please enter stock limit' }]}
              >
                <InputNumber min={1} style={{ width: '100%' }} placeholder="Enter stock limit" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Status"
                name="status"
                rules={[{ required: true, message: 'Please select status' }]}
              >
                <Select placeholder="Select status">
                  <Option value="active">Active</Option>
                  <Option value="inactive">Inactive</Option>
                  <Option value="draft">Draft</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingBundle ? 'Update Bundle' : 'Create Bundle'}
              </Button>
              <Button onClick={() => setIsModalVisible(false)}>Cancel</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductBundlingPage;
