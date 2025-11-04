import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Form,
  Input,
  Button,
  Table,
  Tag,
  Space,
  Select,
  Modal,
  InputNumber,
  message,
  Collapse,
  Switch,
  Divider,
  Alert,
  Tabs,
} from 'antd';
import {
  AppstoreOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CopyOutlined,
  BgColorsOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text, Paragraph } = Typography;
const { Panel } = Collapse;
const { TabPane } = Tabs;

interface ProductVariation {
  id: number;
  productId: number;
  productName: string;
  attributeType: string;
  attributeValue: string;
  sku: string;
  price: number;
  stock: number;
  image: string;
  isActive: boolean;
}

interface AttributeOption {
  id: number;
  name: string;
  type: 'color' | 'size' | 'material' | 'custom';
  values: string[];
}

const mockVariations: ProductVariation[] = [
  {
    id: 1,
    productId: 101,
    productName: 'T-Shirt',
    attributeType: 'Size: S, Color: Red',
    attributeValue: 'Small / Red',
    sku: 'TSHIRT-S-RED',
    price: 29.99,
    stock: 50,
    image: '',
    isActive: true,
  },
  {
    id: 2,
    productId: 101,
    productName: 'T-Shirt',
    attributeType: 'Size: M, Color: Red',
    attributeValue: 'Medium / Red',
    sku: 'TSHIRT-M-RED',
    price: 29.99,
    stock: 75,
    image: '',
    isActive: true,
  },
  {
    id: 3,
    productId: 101,
    productName: 'T-Shirt',
    attributeType: 'Size: L, Color: Blue',
    attributeValue: 'Large / Blue',
    sku: 'TSHIRT-L-BLUE',
    price: 29.99,
    stock: 30,
    image: '',
    isActive: true,
  },
  {
    id: 4,
    productId: 102,
    productName: 'Sneakers',
    attributeType: 'Size: 9, Color: White',
    attributeValue: 'Size 9 / White',
    sku: 'SHOE-9-WHT',
    price: 89.99,
    stock: 20,
    image: '',
    isActive: true,
  },
  {
    id: 5,
    productId: 102,
    productName: 'Sneakers',
    attributeType: 'Size: 10, Color: Black',
    attributeValue: 'Size 10 / Black',
    sku: 'SHOE-10-BLK',
    price: 89.99,
    stock: 0,
    image: '',
    isActive: false,
  },
];

const mockAttributes: AttributeOption[] = [
  {
    id: 1,
    name: 'Size',
    type: 'size',
    values: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  },
  {
    id: 2,
    name: 'Color',
    type: 'color',
    values: ['Red', 'Blue', 'Green', 'Black', 'White', 'Yellow', 'Pink', 'Purple'],
  },
  {
    id: 3,
    name: 'Material',
    type: 'material',
    values: ['Cotton', 'Polyester', 'Leather', 'Denim', 'Silk', 'Wool'],
  },
  {
    id: 4,
    name: 'Style',
    type: 'custom',
    values: ['Classic', 'Modern', 'Vintage', 'Sporty', 'Casual', 'Formal'],
  },
];

const ProductVariationsPage: React.FC = () => {
  const [form] = Form.useForm();
  const [attributeForm] = Form.useForm();
  const [isVariationModalVisible, setIsVariationModalVisible] = useState<boolean>(false);
  const [isAttributeModalVisible, setIsAttributeModalVisible] = useState<boolean>(false);
  const [isBulkGenerateVisible, setIsBulkGenerateVisible] = useState<boolean>(false);
  const [selectedVariation, setSelectedVariation] = useState<ProductVariation | null>(null);
  const [selectedAttributes, setSelectedAttributes] = useState<string[]>([]);

  const handleCreateVariation = (values: any) => {
    console.log('Creating variation:', values);
    message.success('Product variation created successfully');
    setIsVariationModalVisible(false);
    form.resetFields();
  };

  const handleEditVariation = (variation: ProductVariation) => {
    setSelectedVariation(variation);
    form.setFieldsValue(variation);
    setIsVariationModalVisible(true);
  };

  const handleDeleteVariation = (id: number) => {
    Modal.confirm({
      title: 'Delete Variation',
      content: 'Are you sure you want to delete this variation?',
      onOk: () => {
        message.success('Variation deleted successfully');
      },
    });
  };

  const handleDuplicateVariation = (variation: ProductVariation) => {
    message.success(`Variation duplicated: ${variation.sku}`);
  };

  const handleCreateAttribute = (values: any) => {
    console.log('Creating attribute:', values);
    message.success('Attribute created successfully');
    setIsAttributeModalVisible(false);
    attributeForm.resetFields();
  };

  const handleBulkGenerate = (values: any) => {
    console.log('Bulk generating variations:', values);
    message.success('Product variations generated successfully');
    setIsBulkGenerateVisible(false);
  };

  const handleToggleStatus = (variation: ProductVariation) => {
    message.success(`Variation ${variation.isActive ? 'deactivated' : 'activated'}`);
  };

  const variationColumns: ColumnsType<ProductVariation> = [
    {
      title: 'Product',
      key: 'product',
      width: 200,
      render: (_, record) => (
        <div>
          <Text strong>{record.productName}</Text>
          <div>
            <Text type="secondary" style={{ fontSize: 12 }}>SKU: {record.sku}</Text>
          </div>
        </div>
      ),
    },
    {
      title: 'Attributes',
      key: 'attributes',
      width: 250,
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          {record.attributeType.split(', ').map((attr, idx) => (
            <Tag key={idx} color="blue" style={{ fontSize: 11 }}>
              {attr}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price) => <Text strong>${price}</Text>,
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: 'Stock',
      dataIndex: 'stock',
      key: 'stock',
      render: (stock) => (
        <Tag color={stock > 20 ? 'green' : stock > 0 ? 'orange' : 'red'}>
          {stock} units
        </Tag>
      ),
      sorter: (a, b) => a.stock - b.stock,
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive, record) => (
        <Switch
          checked={isActive}
          checkedChildren={<CheckCircleOutlined />}
          unCheckedChildren={<CloseCircleOutlined />}
          onChange={() => handleToggleStatus(record)}
        />
      ),
      filters: [
        { text: 'Active', value: true },
        { text: 'Inactive', value: false },
      ],
      onFilter: (value, record) => record.isActive === value,
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      width: 200,
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <Space size="small">
            <Button
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleEditVariation(record)}
            >
              Edit
            </Button>
            <Button
              size="small"
              icon={<CopyOutlined />}
              onClick={() => handleDuplicateVariation(record)}
            >
              Duplicate
            </Button>
          </Space>
          <Button
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteVariation(record.id)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  const attributeColumns: ColumnsType<AttributeOption> = [
    {
      title: 'Attribute Name',
      dataIndex: 'name',
      key: 'name',
      render: (name) => <Text strong>{name}</Text>,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type) => (
        <Tag color={type === 'color' ? 'magenta' : type === 'size' ? 'blue' : 'green'}>
          {type.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Values',
      dataIndex: 'values',
      key: 'values',
      render: (values: string[]) => (
        <Space wrap>
          {values.slice(0, 5).map((value, idx) => (
            <Tag key={idx} style={{ fontSize: 11 }}>
              {value}
            </Tag>
          ))}
          {values.length > 5 && <Text type="secondary">+{values.length - 5} more</Text>}
        </Space>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button size="small" icon={<EditOutlined />}>
            Edit
          </Button>
          <Button size="small" danger icon={<DeleteOutlined />}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  const totalVariations = mockVariations.length;
  const activeVariations = mockVariations.filter((v) => v.isActive).length;
  const outOfStock = mockVariations.filter((v) => v.stock === 0).length;
  const totalAttributes = mockAttributes.length;

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={3}>
          <AppstoreOutlined style={{ color: '#1890ff' }} /> Product Variations
        </Title>
        <Paragraph type="secondary">
          Manage product variations with multiple attributes like size, color, and material
        </Paragraph>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Space direction="vertical" size={0}>
              <Text type="secondary">Total Variations</Text>
              <Text strong style={{ fontSize: 24, color: '#1890ff' }}>
                {totalVariations}
              </Text>
            </Space>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Space direction="vertical" size={0}>
              <Text type="secondary">Active Variations</Text>
              <Text strong style={{ fontSize: 24, color: '#52c41a' }}>
                {activeVariations}
              </Text>
            </Space>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Space direction="vertical" size={0}>
              <Text type="secondary">Out of Stock</Text>
              <Text strong style={{ fontSize: 24, color: '#ff4d4f' }}>
                {outOfStock}
              </Text>
            </Space>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Space direction="vertical" size={0}>
              <Text type="secondary">Total Attributes</Text>
              <Text strong style={{ fontSize: 24, color: '#722ed1' }}>
                {totalAttributes}
              </Text>
            </Space>
          </Card>
        </Col>
      </Row>

      <Card>
        <Tabs defaultActiveKey="1">
          <TabPane tab="Product Variations" key="1">
            <Space style={{ marginBottom: 16 }}>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  setSelectedVariation(null);
                  form.resetFields();
                  setIsVariationModalVisible(true);
                }}
              >
                Add Variation
              </Button>
              <Button
                icon={<AppstoreOutlined />}
                onClick={() => setIsBulkGenerateVisible(true)}
              >
                Bulk Generate
              </Button>
            </Space>

            <Table
              columns={variationColumns}
              dataSource={mockVariations}
              rowKey="id"
              scroll={{ x: 1200 }}
              pagination={{ pageSize: 10 }}
            />
          </TabPane>

          <TabPane tab="Attribute Options" key="2">
            <Space style={{ marginBottom: 16 }}>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setIsAttributeModalVisible(true)}
              >
                Add Attribute
              </Button>
            </Space>

            <Alert
              message="Attribute Management"
              description="Define reusable attribute options like sizes, colors, and materials. These can be used across multiple products."
              type="info"
              showIcon
              style={{ marginBottom: 16 }}
            />

            <Table
              columns={attributeColumns}
              dataSource={mockAttributes}
              rowKey="id"
              pagination={false}
            />
          </TabPane>
        </Tabs>
      </Card>

      {/* Add/Edit Variation Modal */}
      <Modal
        title={selectedVariation ? 'Edit Variation' : 'Add Product Variation'}
        open={isVariationModalVisible}
        onCancel={() => setIsVariationModalVisible(false)}
        footer={null}
        width={700}
      >
        <Form form={form} layout="vertical" onFinish={handleCreateVariation}>
          <Form.Item
            label="Product"
            name="productId"
            rules={[{ required: true, message: 'Please select product' }]}
          >
            <Select placeholder="Select product">
              <Select.Option value={101}>T-Shirt</Select.Option>
              <Select.Option value={102}>Sneakers</Select.Option>
              <Select.Option value={103}>Jeans</Select.Option>
            </Select>
          </Form.Item>

          <Divider>Attributes</Divider>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Size" name="size">
                <Select placeholder="Select size">
                  {mockAttributes
                    .find((a) => a.name === 'Size')
                    ?.values.map((v) => (
                      <Select.Option key={v} value={v}>
                        {v}
                      </Select.Option>
                    ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Color" name="color">
                <Select placeholder="Select color">
                  {mockAttributes
                    .find((a) => a.name === 'Color')
                    ?.values.map((v) => (
                      <Select.Option key={v} value={v}>
                        {v}
                      </Select.Option>
                    ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Material" name="material">
                <Select placeholder="Select material">
                  {mockAttributes
                    .find((a) => a.name === 'Material')
                    ?.values.map((v) => (
                      <Select.Option key={v} value={v}>
                        {v}
                      </Select.Option>
                    ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Style" name="style">
                <Select placeholder="Select style">
                  {mockAttributes
                    .find((a) => a.name === 'Style')
                    ?.values.map((v) => (
                      <Select.Option key={v} value={v}>
                        {v}
                      </Select.Option>
                    ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Divider>Pricing & Inventory</Divider>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="SKU"
                name="sku"
                rules={[{ required: true, message: 'Please enter SKU' }]}
              >
                <Input placeholder="e.g., TSHIRT-M-RED" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Price"
                name="price"
                rules={[{ required: true, message: 'Please enter price' }]}
              >
                <InputNumber
                  prefix="$"
                  min={0}
                  step={0.01}
                  style={{ width: '100%' }}
                  placeholder="0.00"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Stock Quantity"
                name="stock"
                rules={[{ required: true, message: 'Please enter stock' }]}
              >
                <InputNumber min={0} style={{ width: '100%' }} placeholder="0" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Status" name="isActive" valuePropName="checked">
                <Switch
                  checkedChildren="Active"
                  unCheckedChildren="Inactive"
                  defaultChecked
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Image URL" name="image">
            <Input placeholder="https://example.com/image.jpg" />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {selectedVariation ? 'Update Variation' : 'Create Variation'}
              </Button>
              <Button onClick={() => setIsVariationModalVisible(false)}>Cancel</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Add Attribute Modal */}
      <Modal
        title="Add Attribute Option"
        open={isAttributeModalVisible}
        onCancel={() => setIsAttributeModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form form={attributeForm} layout="vertical" onFinish={handleCreateAttribute}>
          <Form.Item
            label="Attribute Name"
            name="name"
            rules={[{ required: true, message: 'Please enter attribute name' }]}
          >
            <Input placeholder="e.g., Size, Color, Material" />
          </Form.Item>

          <Form.Item
            label="Attribute Type"
            name="type"
            rules={[{ required: true, message: 'Please select type' }]}
          >
            <Select placeholder="Select type">
              <Select.Option value="size">Size</Select.Option>
              <Select.Option value="color">Color</Select.Option>
              <Select.Option value="material">Material</Select.Option>
              <Select.Option value="custom">Custom</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Attribute Values"
            name="values"
            rules={[{ required: true, message: 'Please enter values' }]}
            extra="Enter comma-separated values (e.g., Small, Medium, Large)"
          >
            <Input.TextArea
              rows={4}
              placeholder="Small, Medium, Large, XL"
            />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Create Attribute
              </Button>
              <Button onClick={() => setIsAttributeModalVisible(false)}>Cancel</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Bulk Generate Modal */}
      <Modal
        title="Bulk Generate Variations"
        open={isBulkGenerateVisible}
        onCancel={() => setIsBulkGenerateVisible(false)}
        footer={null}
        width={700}
      >
        <Alert
          message="Bulk Generation"
          description="Select attributes to automatically generate all possible combinations as product variations."
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
        />

        <Form layout="vertical" onFinish={handleBulkGenerate}>
          <Form.Item
            label="Product"
            name="productId"
            rules={[{ required: true, message: 'Please select product' }]}
          >
            <Select placeholder="Select product">
              <Select.Option value={101}>T-Shirt</Select.Option>
              <Select.Option value={102}>Sneakers</Select.Option>
              <Select.Option value={103}>Jeans</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Select Attributes to Combine"
            name="attributes"
            rules={[{ required: true, message: 'Please select at least one attribute' }]}
          >
            <Select mode="multiple" placeholder="Select attributes">
              <Select.Option value="size">Size</Select.Option>
              <Select.Option value="color">Color</Select.Option>
              <Select.Option value="material">Material</Select.Option>
              <Select.Option value="style">Style</Select.Option>
            </Select>
          </Form.Item>

          <Collapse ghost>
            <Panel header="Advanced Options" key="1">
              <Form.Item label="Base Price" name="basePrice">
                <InputNumber
                  prefix="$"
                  min={0}
                  step={0.01}
                  style={{ width: '100%' }}
                  placeholder="0.00"
                />
              </Form.Item>

              <Form.Item label="Default Stock Quantity" name="defaultStock">
                <InputNumber min={0} style={{ width: '100%' }} placeholder="0" />
              </Form.Item>

              <Form.Item label="SKU Prefix" name="skuPrefix">
                <Input placeholder="e.g., PROD-" />
              </Form.Item>
            </Panel>
          </Collapse>

          <Alert
            message="Preview"
            description={`This will generate variations for all combinations of selected attributes.`}
            type="warning"
            showIcon
            style={{ marginTop: 16, marginBottom: 16 }}
          />

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Generate Variations
              </Button>
              <Button onClick={() => setIsBulkGenerateVisible(false)}>Cancel</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductVariationsPage;
