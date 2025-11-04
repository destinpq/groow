import React, { useState } from 'react';
import {
  Card,
  Button,
  Space,
  Table,
  Tag,
  Input,
  Select,
  Modal,
  Form,
  InputNumber,
  Upload,
  message,
  Switch,
  Tabs,
  Row,
  Col,
  Drawer,
  Image,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  UploadOutlined,
  SearchOutlined,
  FileExcelOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { UploadFile } from 'antd/es/upload/interface';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const { Option } = Select;
const { TabPane } = Tabs;

interface ProductAttribute {
  size?: string;
  color?: string;
  price: number;
  stock: number;
  sku: string;
}

interface Product {
  id: number;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  moq: number;
  status: 'active' | 'inactive' | 'pending';
  images: string[];
  attributes: ProductAttribute[];
  created: string;
}

const mockProducts: Product[] = [
  {
    id: 1,
    name: 'Premium Wireless Headphones',
    sku: 'WH-001',
    category: 'Electronics',
    price: 349.99,
    stock: 156,
    moq: 1,
    status: 'active',
    images: ['https://via.placeholder.com/300'],
    attributes: [
      { color: 'Black', price: 349.99, stock: 100, sku: 'WH-001-BLK' },
      { color: 'Silver', price: 349.99, stock: 56, sku: 'WH-001-SLV' },
    ],
    created: '2024-10-15',
  },
  {
    id: 2,
    name: 'Smart Watch Pro',
    sku: 'SW-002',
    category: 'Electronics',
    price: 199.99,
    stock: 89,
    moq: 2,
    status: 'active',
    images: ['https://via.placeholder.com/300'],
    attributes: [],
    created: '2024-10-10',
  },
  {
    id: 3,
    name: 'Laptop Backpack',
    sku: 'LB-003',
    category: 'Accessories',
    price: 49.99,
    stock: 0,
    moq: 5,
    status: 'inactive',
    images: ['https://via.placeholder.com/300'],
    attributes: [],
    created: '2024-10-05',
  },
];

const VendorProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [modalVisible, setModalVisible] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [description, setDescription] = useState('');
  const [attributes, setAttributes] = useState<ProductAttribute[]>([]);

  const handleAddProduct = () => {
    setEditingProduct(null);
    form.resetFields();
    setFileList([]);
    setDescription('');
    setAttributes([]);
    setModalVisible(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    form.setFieldsValue(product);
    setDescription('Product description here...');
    setAttributes(product.attributes);
    setModalVisible(true);
  };

  const handleViewProduct = (product: Product) => {
    setViewingProduct(product);
    setDrawerVisible(true);
  };

  const handleDeleteProduct = (id: number) => {
    Modal.confirm({
      title: 'Delete Product',
      content: 'Are you sure you want to delete this product?',
      onOk: () => {
        setProducts(products.filter((p) => p.id !== id));
        message.success('Product deleted successfully');
      },
    });
  };

  const handleToggleStatus = (id: number) => {
    setProducts(
      products.map((p) =>
        p.id === id
          ? { ...p, status: p.status === 'active' ? 'inactive' : 'active' }
          : p
      )
    );
    message.success('Product status updated');
  };

  const handleSubmit = (values: any) => {
    console.log('Product data:', { ...values, description, attributes, images: fileList });
    message.success(editingProduct ? 'Product updated!' : 'Product created!');
    setModalVisible(false);
    form.resetFields();
  };

  const handleAddAttribute = () => {
    setAttributes([
      ...attributes,
      { size: '', color: '', price: 0, stock: 0, sku: '' },
    ]);
  };

  const handleRemoveAttribute = (index: number) => {
    setAttributes(attributes.filter((_, i) => i !== index));
  };

  const handleAttributeChange = (index: number, field: string, value: any) => {
    const newAttributes = [...attributes];
    newAttributes[index] = { ...newAttributes[index], [field]: value };
    setAttributes(newAttributes);
  };

  const handleExportCSV = () => {
    message.success('Exporting products to CSV...');
    // Export logic
  };

  const handleImportCSV = () => {
    message.info('CSV import feature');
    // Import modal logic
  };

  const columns: ColumnsType<Product> = [
    {
      title: 'Image',
      dataIndex: 'images',
      key: 'images',
      width: 80,
      render: (images: string[]) => (
        <Image src={images[0]} alt="Product" width={50} height={50} style={{ objectFit: 'cover' }} />
      ),
    },
    {
      title: 'Product Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'SKU',
      dataIndex: 'sku',
      key: 'sku',
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      filters: [
        { text: 'Electronics', value: 'Electronics' },
        { text: 'Accessories', value: 'Accessories' },
      ],
      onFilter: (value, record) => record.category === value,
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      sorter: (a, b) => a.price - b.price,
      render: (price: number) => `$${price.toFixed(2)}`,
    },
    {
      title: 'Stock',
      dataIndex: 'stock',
      key: 'stock',
      sorter: (a, b) => a.stock - b.stock,
      render: (stock: number) => (
        <Tag color={stock > 50 ? 'success' : stock > 0 ? 'warning' : 'error'}>
          {stock} units
        </Tag>
      ),
    },
    {
      title: 'MOQ',
      dataIndex: 'moq',
      key: 'moq',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'Active', value: 'active' },
        { text: 'Inactive', value: 'inactive' },
        { text: 'Pending', value: 'pending' },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status: string, record) => (
        <Space>
          <Tag color={status === 'active' ? 'success' : status === 'pending' ? 'warning' : 'default'}>
            {status.toUpperCase()}
          </Tag>
          <Switch
            checked={status === 'active'}
            onChange={() => handleToggleStatus(record.id)}
            size="small"
          />
        </Space>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 200,
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleViewProduct(record)}
          >
            View
          </Button>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEditProduct(record)}
          >
            Edit
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteProduct(record.id)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Card
        title={<span style={{ fontSize: 24 }}>Product Catalog</span>}
        extra={
          <Space>
            <Button icon={<FileExcelOutlined />} onClick={handleImportCSV}>
              Import CSV
            </Button>
            <Button icon={<DownloadOutlined />} onClick={handleExportCSV}>
              Export CSV
            </Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAddProduct}>
              Add Product
            </Button>
          </Space>
        }
      >
        {/* Filters */}
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col xs={24} sm={12} md={8}>
            <Input
              placeholder="Search products..."
              prefix={<SearchOutlined />}
              size="large"
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Select placeholder="Category" size="large" style={{ width: '100%' }}>
              <Option value="all">All Categories</Option>
              <Option value="electronics">Electronics</Option>
              <Option value="accessories">Accessories</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Select placeholder="Status" size="large" style={{ width: '100%' }}>
              <Option value="all">All Status</Option>
              <Option value="active">Active</Option>
              <Option value="inactive">Inactive</Option>
              <Option value="pending">Pending</Option>
            </Select>
          </Col>
        </Row>

        {/* Stats */}
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={6}>
            <Card size="small">
              <div>Total Products</div>
              <div style={{ fontSize: 24, fontWeight: 'bold' }}>{products.length}</div>
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small">
              <div>Active</div>
              <div style={{ fontSize: 24, fontWeight: 'bold', color: '#52c41a' }}>
                {products.filter((p) => p.status === 'active').length}
              </div>
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small">
              <div>Out of Stock</div>
              <div style={{ fontSize: 24, fontWeight: 'bold', color: '#ff4d4f' }}>
                {products.filter((p) => p.stock === 0).length}
              </div>
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small">
              <div>Total Value</div>
              <div style={{ fontSize: 24, fontWeight: 'bold', color: '#1890ff' }}>
                ${products.reduce((sum, p) => sum + p.price * p.stock, 0).toFixed(0)}
              </div>
            </Card>
          </Col>
        </Row>

        {/* Products Table */}
        <Table
          columns={columns}
          dataSource={products}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} products`,
          }}
        />
      </Card>

      {/* Add/Edit Product Modal */}
      <Modal
        title={editingProduct ? 'Edit Product' : 'Add New Product'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={900}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Tabs defaultActiveKey="1">
            <TabPane tab="Basic Info" key="1">
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="name"
                    label="Product Name"
                    rules={[{ required: true, message: 'Please enter product name' }]}
                  >
                    <Input placeholder="Premium Wireless Headphones" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="sku"
                    label="SKU"
                    rules={[{ required: true, message: 'Please enter SKU' }]}
                  >
                    <Input placeholder="WH-001" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="category"
                    label="Category"
                    rules={[{ required: true, message: 'Please select category' }]}
                  >
                    <Select placeholder="Select category">
                      <Option value="Electronics">Electronics</Option>
                      <Option value="Accessories">Accessories</Option>
                      <Option value="Clothing">Clothing</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="brand" label="Brand">
                    <Input placeholder="Brand name" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item label="Description">
                <ReactQuill
                  value={description}
                  onChange={setDescription}
                  modules={{
                    toolbar: [
                      ['bold', 'italic', 'underline'],
                      [{ list: 'ordered' }, { list: 'bullet' }],
                      ['link'],
                    ],
                  }}
                  style={{ height: 200, marginBottom: 50 }}
                />
              </Form.Item>
            </TabPane>

            <TabPane tab="Pricing & Inventory" key="2">
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    name="price"
                    label="Price ($)"
                    rules={[{ required: true, message: 'Please enter price' }]}
                  >
                    <InputNumber min={0} step={0.01} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="stock"
                    label="Stock Quantity"
                    rules={[{ required: true, message: 'Please enter stock' }]}
                  >
                    <InputNumber min={0} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="moq"
                    label="MOQ (Min Order Qty)"
                    rules={[{ required: true }]}
                  >
                    <InputNumber min={1} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item label="Wholesale Pricing Tiers">
                <Card size="small">
                  <Row gutter={8} style={{ marginBottom: 8 }}>
                    <Col span={8}><strong>Quantity Range</strong></Col>
                    <Col span={8}><strong>Price per Unit</strong></Col>
                    <Col span={8}><strong>Discount %</strong></Col>
                  </Row>
                  <Row gutter={8} style={{ marginBottom: 8 }}>
                    <Col span={8}><Input placeholder="1-10" /></Col>
                    <Col span={8}><InputNumber placeholder="349.99" style={{ width: '100%' }} /></Col>
                    <Col span={8}><InputNumber placeholder="0" style={{ width: '100%' }} suffix="%" /></Col>
                  </Row>
                  <Row gutter={8} style={{ marginBottom: 8 }}>
                    <Col span={8}><Input placeholder="11-50" /></Col>
                    <Col span={8}><InputNumber placeholder="329.99" style={{ width: '100%' }} /></Col>
                    <Col span={8}><InputNumber placeholder="5" style={{ width: '100%' }} suffix="%" /></Col>
                  </Row>
                  <Button type="dashed" block icon={<PlusOutlined />}>
                    Add Tier
                  </Button>
                </Card>
              </Form.Item>
            </TabPane>

            <TabPane tab="Images" key="3">
              <Form.Item label="Product Images (up to 10)">
                <Upload
                  listType="picture-card"
                  fileList={fileList}
                  onChange={({ fileList }) => setFileList(fileList)}
                  beforeUpload={() => false}
                  maxCount={10}
                >
                  {fileList.length < 10 && (
                    <div>
                      <PlusOutlined />
                      <div style={{ marginTop: 8 }}>Upload</div>
                    </div>
                  )}
                </Upload>
              </Form.Item>
            </TabPane>

            <TabPane tab="Attributes & Variants" key="4">
              <Space direction="vertical" style={{ width: '100%' }}>
                {attributes.map((attr, index) => (
                  <Card key={index} size="small">
                    <Row gutter={8}>
                      <Col span={4}>
                        <Input
                          placeholder="Size"
                          value={attr.size}
                          onChange={(e) => handleAttributeChange(index, 'size', e.target.value)}
                        />
                      </Col>
                      <Col span={4}>
                        <Input
                          placeholder="Color"
                          value={attr.color}
                          onChange={(e) => handleAttributeChange(index, 'color', e.target.value)}
                        />
                      </Col>
                      <Col span={5}>
                        <InputNumber
                          placeholder="Price"
                          style={{ width: '100%' }}
                          value={attr.price}
                          onChange={(val) => handleAttributeChange(index, 'price', val)}
                        />
                      </Col>
                      <Col span={4}>
                        <InputNumber
                          placeholder="Stock"
                          style={{ width: '100%' }}
                          value={attr.stock}
                          onChange={(val) => handleAttributeChange(index, 'stock', val)}
                        />
                      </Col>
                      <Col span={5}>
                        <Input
                          placeholder="SKU"
                          value={attr.sku}
                          onChange={(e) => handleAttributeChange(index, 'sku', e.target.value)}
                        />
                      </Col>
                      <Col span={2}>
                        <Button
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => handleRemoveAttribute(index)}
                        />
                      </Col>
                    </Row>
                  </Card>
                ))}
                <Button type="dashed" block icon={<PlusOutlined />} onClick={handleAddAttribute}>
                  Add Variant
                </Button>
              </Space>
            </TabPane>
          </Tabs>

          <Form.Item style={{ marginTop: 24, marginBottom: 0 }}>
            <Space>
              <Button type="primary" htmlType="submit" size="large">
                {editingProduct ? 'Update Product' : 'Create Product'}
              </Button>
              <Button size="large" onClick={() => setModalVisible(false)}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Product Detail Drawer */}
      <Drawer
        title="Product Details"
        placement="right"
        width={600}
        open={drawerVisible}
        onClose={() => setDrawerVisible(false)}
      >
        {viewingProduct && (
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            <Image src={viewingProduct.images[0]} alt={viewingProduct.name} />
            <div>
              <h2>{viewingProduct.name}</h2>
              <p>SKU: {viewingProduct.sku}</p>
              <Tag color="blue">{viewingProduct.category}</Tag>
            </div>
            <Card title="Pricing & Stock">
              <p><strong>Price:</strong> ${viewingProduct.price.toFixed(2)}</p>
              <p><strong>Stock:</strong> {viewingProduct.stock} units</p>
              <p><strong>MOQ:</strong> {viewingProduct.moq}</p>
            </Card>
            {viewingProduct.attributes.length > 0 && (
              <Card title="Variants">
                {viewingProduct.attributes.map((attr, idx) => (
                  <div key={idx}>
                    {attr.color && <Tag>{attr.color}</Tag>}
                    {attr.size && <Tag>{attr.size}</Tag>}
                    <span> - ${attr.price} ({attr.stock} in stock)</span>
                  </div>
                ))}
              </Card>
            )}
          </Space>
        )}
      </Drawer>
    </div>
  );
};

export default VendorProductsPage;
