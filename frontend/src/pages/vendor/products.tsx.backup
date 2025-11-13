import React, { useState, useEffect } from 'react';
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
  Spin,
  Statistic,
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
  ShoppingOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { UploadFile } from 'antd/es/upload/interface';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { productAPI } from '@/services/api/products';
import type { Product, CreateProductData } from '@/services/api/products';
import { useAuthStore } from '@/store/auth';
import { categoriesAPI, brandsAPI } from '@/services/api/catalog';
import type { Category, Brand } from '@/services/api/catalog';

const { Option } = Select;
const { TabPane } = Tabs;

const VendorProductsPage: React.FC = () => {
  const { user } = useAuthStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>();
  const [statusFilter, setStatusFilter] = useState<boolean | undefined>();
  const pageSize = 10;

  // Fetch products
  useEffect(() => {
    if (user?.id) {
      fetchProducts();
    }
  }, [user, page, searchText, categoryFilter, statusFilter]);

  // Fetch categories and brands
  useEffect(() => {
    fetchCategoriesAndBrands();
  }, []);

  const fetchProducts = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const response = await productAPI.getAll({
        vendorId: user.id,
        page,
        limit: pageSize,
        search: searchText || undefined,
        categoryId: categoryFilter,
        inStock: statusFilter,
      });
      setProducts(response.data);
      setTotal(response.total);
    } catch (error) {
      message.error('Failed to load products');
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategoriesAndBrands = async () => {
    try {
      const [categoriesData, brandsData] = await Promise.all([
        categoriesAPI.getAll(),
        brandsAPI.getAll(),
      ]);
      setCategories(categoriesData);
      setBrands(brandsData);
    } catch (error) {
      console.error('Error fetching categories/brands:', error);
    }
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    form.resetFields();
    setFileList([]);
    setDescription('');
    setModalVisible(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    form.setFieldsValue({
      name: product.name,
      sku: product.sku,
      categoryId: product.categoryId,
      brandId: product.brandId,
      price: product.price,
      stock: product.stock,
    });
    setDescription(product.description);
    setModalVisible(true);
  };

  const handleViewProduct = (product: Product) => {
    setViewingProduct(product);
    setDrawerVisible(true);
  };

  const handleDeleteProduct = (id: string) => {
    Modal.confirm({
      title: 'Delete Product',
      content: 'Are you sure you want to delete this product? This action cannot be undone.',
      okText: 'Delete',
      okType: 'danger',
      onOk: async () => {
        try {
          await productAPI.delete(id);
          message.success('Product deleted successfully');
          fetchProducts(); // Refresh list
        } catch (error) {
          message.error('Failed to delete product');
          console.error('Error deleting product:', error);
        }
      },
    });
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await productAPI.toggleActive(id);
      message.success('Product status updated');
      fetchProducts(); // Refresh list
    } catch (error) {
      message.error('Failed to update product status');
      console.error('Error toggling status:', error);
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      const productData: CreateProductData = {
        name: values.name,
        sku: values.sku,
        description,
        price: values.price,
        stock: values.stock,
        categoryId: values.categoryId,
        brandId: values.brandId,
        images: fileList.map(f => f.url || '').filter(Boolean),
      };

      if (editingProduct) {
        await productAPI.update(editingProduct.id, productData);
        message.success('Product updated successfully!');
      } else {
        await productAPI.create(productData);
        message.success('Product created successfully!');
      }
      
      setModalVisible(false);
      form.resetFields();
      setFileList([]);
      setDescription('');
      fetchProducts(); // Refresh list
    } catch (error) {
      message.error(editingProduct ? 'Failed to update product' : 'Failed to create product');
      console.error('Error saving product:', error);
    }
  };

  const handleExportCSV = async () => {
    try {
      await productAPI.bulkExport({ vendorId: user?.id });
      message.success('Products exported successfully!');
    } catch (error) {
      message.error('Failed to export products');
      console.error('Error exporting products:', error);
    }
  };

  const handleImportCSV = () => {
    message.info('CSV import feature - Upload CSV file with products');
    // TODO: Implement CSV import modal
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
    setPage(1); // Reset to first page
  };

  const handleCategoryChange = (value: string) => {
    setCategoryFilter(value === 'all' ? undefined : value);
    setPage(1);
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value === 'all' ? undefined : value === 'active');
    setPage(1);
  };

  const columns: ColumnsType<Product> = [
    {
      title: 'Image',
      dataIndex: 'images',
      key: 'images',
      width: 80,
      render: (images: string[]) => (
        <Image 
          src={images[0] || 'https://via.placeholder.com/50'} 
          alt="Product" 
          width={50} 
          height={50} 
          style={{ objectFit: 'cover' }} 
        />
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
      dataIndex: 'categoryId',
      key: 'categoryId',
      render: (categoryId: string) => {
        const category = categories.find(c => c.id === categoryId);
        return <Tag>{category?.name || 'N/A'}</Tag>;
      },
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
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      filters: [
        { text: 'Active', value: true },
        { text: 'Inactive', value: false },
      ],
      onFilter: (value, record) => record.isActive === value,
      render: (isActive: boolean, record) => (
        <Space>
          <Tag color={isActive ? 'success' : 'default'}>
            {isActive ? 'ACTIVE' : 'INACTIVE'}
          </Tag>
          <Switch
            checked={isActive}
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
            <Input.Search
              placeholder="Search products..."
              prefix={<SearchOutlined />}
              size="large"
              onSearch={handleSearch}
              allowClear
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Select 
              placeholder="Category" 
              size="large" 
              style={{ width: '100%' }}
              onChange={handleCategoryChange}
              allowClear
            >
              <Option value="all">All Categories</Option>
              {categories.map(cat => (
                <Option key={cat.id} value={cat.id}>{cat.name}</Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Select 
              placeholder="Status" 
              size="large" 
              style={{ width: '100%' }}
              onChange={handleStatusChange}
              allowClear
            >
              <Option value="all">All Status</Option>
              <Option value="active">Active</Option>
              <Option value="inactive">Inactive</Option>
            </Select>
          </Col>
        </Row>

        {/* Stats */}
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={6}>
            <Card size="small">
              <Statistic
                title="Total Products"
                value={total}
                prefix={<ShoppingOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small">
              <Statistic
                title="Active"
                value={products.filter((p) => p.isActive).length}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small">
              <Statistic
                title="Out of Stock"
                value={products.filter((p) => p.stock === 0).length}
                valueStyle={{ color: '#ff4d4f' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small">
              <Statistic
                title="Total Value"
                value={products.reduce((sum, p) => sum + p.price * p.stock, 0)}
                precision={0}
                prefix="$"
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
        </Row>

        {/* Products Table */}
        <Spin spinning={loading}>
          <Table
            columns={columns}
            dataSource={products}
            rowKey="id"
            pagination={{
              current: page,
              pageSize,
              total,
              onChange: setPage,
              showSizeChanger: false,
              showTotal: (total) => `Total ${total} products`,
            }}
          />
        </Spin>
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
                    name="categoryId"
                    label="Category"
                    rules={[{ required: true, message: 'Please select category' }]}
                  >
                    <Select placeholder="Select category">
                      {categories.map(cat => (
                        <Option key={cat.id} value={cat.id}>{cat.name}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item 
                    name="brandId" 
                    label="Brand"
                    rules={[{ required: true, message: 'Please select brand' }]}
                  >
                    <Select placeholder="Select brand">
                      {brands.map(brand => (
                        <Option key={brand.id} value={brand.id}>{brand.name}</Option>
                      ))}
                    </Select>
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
                    name="comparePrice"
                    label="Compare Price ($)"
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
              </Row>
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
            <Image 
              src={viewingProduct.images[0] || 'https://via.placeholder.com/300'} 
              alt={viewingProduct.name} 
            />
            <div>
              <h2>{viewingProduct.name}</h2>
              <p>SKU: {viewingProduct.sku}</p>
              <Tag color="blue">
                {categories.find(c => c.id === viewingProduct.categoryId)?.name || 'Unknown Category'}
              </Tag>
              <Tag color={viewingProduct.isActive ? 'success' : 'default'}>
                {viewingProduct.isActive ? 'ACTIVE' : 'INACTIVE'}
              </Tag>
            </div>
            <Card title="Pricing & Stock">
              <p><strong>Price:</strong> ${viewingProduct.price.toFixed(2)}</p>
              {viewingProduct.comparePrice && (
                <p><strong>Compare Price:</strong> ${viewingProduct.comparePrice.toFixed(2)}</p>
              )}
              <p><strong>Stock:</strong> {viewingProduct.stock} units</p>
            </Card>
            <Card title="Product Information">
              <p><strong>Description:</strong></p>
              <div dangerouslySetInnerHTML={{ __html: viewingProduct.description }} />
              <p style={{ marginTop: 16 }}><strong>Brand:</strong> {brands.find(b => b.id === viewingProduct.brandId)?.name || 'N/A'}</p>
              <p><strong>Rating:</strong> {viewingProduct.rating} ({viewingProduct.reviewCount} reviews)</p>
            </Card>
          </Space>
        )}
      </Drawer>
    </div>
  );
};

export default VendorProductsPage;
