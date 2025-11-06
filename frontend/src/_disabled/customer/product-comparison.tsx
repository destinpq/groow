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
  message,
  Divider,
  Descriptions,
  Avatar,
  Badge,
} from 'antd';
import {
  ShoppingOutlined,
  EyeOutlined,
  SwapOutlined,
  CloseCircleOutlined,
  StarFilled,
  CheckCircleOutlined,
  MinusCircleOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text, Paragraph } = Typography;

interface Product {
  id: number;
  name: string;
  brand: string;
  category: string;
  price: number;
  rating: number;
  reviews: number;
  inStock: boolean;
  image: string;
  specs: ProductSpecs;
}

interface ProductSpecs {
  [key: string]: string | number | boolean;
}

const mockProducts: Product[] = [
  {
    id: 1,
    name: 'Wireless Headphones Pro',
    brand: 'TechBrand',
    category: 'Electronics',
    price: 99,
    rating: 4.5,
    reviews: 234,
    inStock: true,
    image: '',
    specs: {
      'Battery Life': '30 hours',
      'Noise Cancellation': 'Active',
      'Bluetooth Version': '5.0',
      'Weight': '250g',
      'Warranty': '2 years',
      'Color Options': 'Black, White, Blue',
      'Foldable': true,
      'Voice Assistant': 'Yes',
    },
  },
  {
    id: 2,
    name: 'Wireless Headphones Lite',
    brand: 'TechBrand',
    category: 'Electronics',
    price: 59,
    rating: 4.2,
    reviews: 156,
    inStock: true,
    image: '',
    specs: {
      'Battery Life': '20 hours',
      'Noise Cancellation': 'Passive',
      'Bluetooth Version': '4.2',
      'Weight': '200g',
      'Warranty': '1 year',
      'Color Options': 'Black, White',
      'Foldable': false,
      'Voice Assistant': 'No',
    },
  },
  {
    id: 3,
    name: 'Premium Headphones Max',
    brand: 'AudioPro',
    category: 'Electronics',
    price: 199,
    rating: 4.8,
    reviews: 456,
    inStock: false,
    image: '',
    specs: {
      'Battery Life': '40 hours',
      'Noise Cancellation': 'Adaptive',
      'Bluetooth Version': '5.2',
      'Weight': '300g',
      'Warranty': '3 years',
      'Color Options': 'Black, Silver, Gold',
      'Foldable': true,
      'Voice Assistant': 'Yes',
    },
  },
];

const ProductComparisonPage: React.FC = () => {
  const [comparedProducts, setComparedProducts] = useState<Product[]>([mockProducts[0], mockProducts[1]]);
  const [isAddProductModalVisible, setIsAddProductModalVisible] = useState<boolean>(false);
  const [availableProducts, setAvailableProducts] = useState<Product[]>(mockProducts);

  const handleAddProduct = (productId: number) => {
    if (comparedProducts.length >= 4) {
      message.warning('You can compare up to 4 products at a time');
      return;
    }

    const product = availableProducts.find((p) => p.id === productId);
    if (product) {
      setComparedProducts([...comparedProducts, product]);
      message.success(`${product.name} added to comparison`);
      setIsAddProductModalVisible(false);
    }
  };

  const handleRemoveProduct = (productId: number) => {
    if (comparedProducts.length <= 2) {
      message.warning('You need at least 2 products to compare');
      return;
    }

    setComparedProducts(comparedProducts.filter((p) => p.id !== productId));
    message.success('Product removed from comparison');
  };

  const handleClearComparison = () => {
    Modal.confirm({
      title: 'Clear Comparison',
      content: 'Are you sure you want to clear all products from comparison?',
      onOk: () => {
        setComparedProducts([]);
        message.success('Comparison cleared');
      },
    });
  };

  const getAllSpecKeys = (): string[] => {
    const allKeys = new Set<string>();
    comparedProducts.forEach((product) => {
      Object.keys(product.specs).forEach((key) => allKeys.add(key));
    });
    return Array.from(allKeys);
  };

  const renderSpecValue = (value: string | number | boolean) => {
    if (typeof value === 'boolean') {
      return value ? (
        <Tag color="green" icon={<CheckCircleOutlined />}>
          Yes
        </Tag>
      ) : (
        <Tag color="red" icon={<CloseCircleOutlined />}>
          No
        </Tag>
      );
    }
    return <Text>{value}</Text>;
  };

  const findBestValue = (specKey: string, values: (string | number | boolean)[]): number[] => {
    const bestIndices: number[] = [];

    // For battery life, higher is better
    if (specKey === 'Battery Life') {
      const numericValues = values.map((v) => {
        if (typeof v === 'string') {
          const match = v.match(/(\d+)/);
          return match ? parseInt(match[1]) : 0;
        }
        return 0;
      });
      const max = Math.max(...numericValues);
      numericValues.forEach((val, idx) => {
        if (val === max) bestIndices.push(idx);
      });
    }

    // For weight, lower is better
    if (specKey === 'Weight') {
      const numericValues = values.map((v) => {
        if (typeof v === 'string') {
          const match = v.match(/(\d+)/);
          return match ? parseInt(match[1]) : Infinity;
        }
        return Infinity;
      });
      const min = Math.min(...numericValues);
      numericValues.forEach((val, idx) => {
        if (val === min) bestIndices.push(idx);
      });
    }

    // For boolean values, true is better
    if (typeof values[0] === 'boolean') {
      values.forEach((val, idx) => {
        if (val === true) bestIndices.push(idx);
      });
    }

    return bestIndices;
  };

  const productListColumns: ColumnsType<Product> = [
    {
      title: 'Product',
      key: 'product',
      render: (_, record) => (
        <Space>
          <Avatar
            size={48}
            shape="square"
            style={{ background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <Text type="secondary" style={{ fontSize: 10 }}>IMG</Text>
          </Avatar>
          <div>
            <Text strong>{record.name}</Text>
            <div>
              <Text type="secondary" style={{ fontSize: 12 }}>{record.brand}</Text>
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price) => <Text strong>${price}</Text>,
    },
    {
      title: 'Rating',
      key: 'rating',
      render: (_, record) => (
        <Space>
          <StarFilled style={{ color: '#faad14' }} />
          <Text>{record.rating}</Text>
        </Space>
      ),
    },
    {
      title: 'Stock',
      dataIndex: 'inStock',
      key: 'inStock',
      render: (inStock) =>
        inStock ? (
          <Tag color="green">In Stock</Tag>
        ) : (
          <Tag color="red">Out of Stock</Tag>
        ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button
          type="primary"
          onClick={() => handleAddProduct(record.id)}
          disabled={comparedProducts.some((p) => p.id === record.id)}
        >
          {comparedProducts.some((p) => p.id === record.id) ? 'Already Added' : 'Add to Compare'}
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <div style={{ marginBottom: 24 }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={3}>
              <SwapOutlined style={{ color: '#1890ff' }} /> Product Comparison
            </Title>
            <Paragraph type="secondary">
              Compare products side-by-side to make better buying decisions
            </Paragraph>
          </Col>
          <Col>
            <Space>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setIsAddProductModalVisible(true)}
                disabled={comparedProducts.length >= 4}
              >
                Add Product
              </Button>
              {comparedProducts.length > 0 && (
                <Button danger onClick={handleClearComparison}>
                  Clear All
                </Button>
              )}
            </Space>
          </Col>
        </Row>
      </div>

      {comparedProducts.length === 0 ? (
        <Card>
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <SwapOutlined style={{ fontSize: 64, color: '#d9d9d9', marginBottom: 16 }} />
            <Title level={4}>No Products to Compare</Title>
            <Paragraph type="secondary">
              Add at least 2 products to start comparing
            </Paragraph>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsAddProductModalVisible(true)}>
              Add Products
            </Button>
          </div>
        </Card>
      ) : (
        <Card>
          <Row gutter={16}>
            {/* Product Cards */}
            {comparedProducts.map((product, index) => (
              <Col key={product.id} xs={24} sm={12} lg={6}>
                <Card
                  style={{ marginBottom: 16 }}
                  cover={
                    <div
                      style={{
                        height: 200,
                        background: '#f0f0f0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                      }}
                    >
                      {comparedProducts.length > 2 && (
                        <Button
                          type="text"
                          danger
                          icon={<CloseCircleOutlined />}
                          style={{ position: 'absolute', top: 8, right: 8 }}
                          onClick={() => handleRemoveProduct(product.id)}
                        />
                      )}
                      <Text type="secondary">Product Image</Text>
                    </div>
                  }
                >
                  <Card.Meta
                    title={<Text strong>{product.name}</Text>}
                    description={
                      <Space direction="vertical" size="small" style={{ width: '100%' }}>
                        <Text type="secondary">{product.brand}</Text>
                        <Space>
                          <StarFilled style={{ color: '#faad14' }} />
                          <Text>{product.rating} ({product.reviews})</Text>
                        </Space>
                        <Text strong style={{ fontSize: 20, color: '#ff4d4f' }}>
                          ${product.price}
                        </Text>
                        {product.inStock ? (
                          <Tag color="green">In Stock</Tag>
                        ) : (
                          <Tag color="red">Out of Stock</Tag>
                        )}
                        <Button type="primary" block icon={<ShoppingOutlined />} disabled={!product.inStock}>
                          Add to Cart
                        </Button>
                      </Space>
                    }
                  />
                </Card>
              </Col>
            ))}

            {/* Add Product Placeholder */}
            {comparedProducts.length < 4 && (
              <Col xs={24} sm={12} lg={6}>
                <Card
                  style={{
                    marginBottom: 16,
                    minHeight: 400,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    border: '2px dashed #d9d9d9',
                  }}
                  bodyStyle={{ textAlign: 'center', width: '100%' }}
                  onClick={() => setIsAddProductModalVisible(true)}
                >
                  <PlusOutlined style={{ fontSize: 48, color: '#d9d9d9', marginBottom: 16 }} />
                  <div>
                    <Text type="secondary">Add Another Product</Text>
                  </div>
                </Card>
              </Col>
            )}
          </Row>

          <Divider>Specifications Comparison</Divider>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#fafafa' }}>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #f0f0f0' }}>
                    <Text strong>Specification</Text>
                  </th>
                  {comparedProducts.map((product) => (
                    <th
                      key={product.id}
                      style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #f0f0f0' }}
                    >
                      <Text type="secondary" style={{ fontSize: 12 }}>{product.name}</Text>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Price Row */}
                <tr>
                  <td style={{ padding: '12px', borderBottom: '1px solid #f0f0f0' }}>
                    <Text strong>Price</Text>
                  </td>
                  {comparedProducts.map((product, idx) => {
                    const prices = comparedProducts.map((p) => p.price);
                    const minPrice = Math.min(...prices);
                    const isBest = product.price === minPrice;
                    return (
                      <td
                        key={product.id}
                        style={{
                          padding: '12px',
                          textAlign: 'center',
                          borderBottom: '1px solid #f0f0f0',
                          background: isBest ? '#f6ffed' : 'transparent',
                        }}
                      >
                        <Space direction="vertical" size={0}>
                          <Text strong style={{ color: isBest ? '#52c41a' : '#ff4d4f', fontSize: 16 }}>
                            ${product.price}
                          </Text>
                          {isBest && <Badge count="Best Price" style={{ backgroundColor: '#52c41a' }} />}
                        </Space>
                      </td>
                    );
                  })}
                </tr>

                {/* Rating Row */}
                <tr>
                  <td style={{ padding: '12px', borderBottom: '1px solid #f0f0f0' }}>
                    <Text strong>Rating</Text>
                  </td>
                  {comparedProducts.map((product) => {
                    const ratings = comparedProducts.map((p) => p.rating);
                    const maxRating = Math.max(...ratings);
                    const isBest = product.rating === maxRating;
                    return (
                      <td
                        key={product.id}
                        style={{
                          padding: '12px',
                          textAlign: 'center',
                          borderBottom: '1px solid #f0f0f0',
                          background: isBest ? '#f6ffed' : 'transparent',
                        }}
                      >
                        <Space>
                          <StarFilled style={{ color: '#faad14' }} />
                          <Text strong>{product.rating}</Text>
                          <Text type="secondary" style={{ fontSize: 11 }}>({product.reviews})</Text>
                        </Space>
                      </td>
                    );
                  })}
                </tr>

                {/* Specifications Rows */}
                {getAllSpecKeys().map((specKey) => {
                  const values = comparedProducts.map((p) => p.specs[specKey] || '-');
                  const bestIndices = findBestValue(specKey, values);

                  return (
                    <tr key={specKey}>
                      <td style={{ padding: '12px', borderBottom: '1px solid #f0f0f0' }}>
                        <Text strong>{specKey}</Text>
                      </td>
                      {comparedProducts.map((product, idx) => {
                        const value = product.specs[specKey];
                        const isBest = bestIndices.includes(idx);
                        return (
                          <td
                            key={product.id}
                            style={{
                              padding: '12px',
                              textAlign: 'center',
                              borderBottom: '1px solid #f0f0f0',
                              background: isBest ? '#f6ffed' : 'transparent',
                            }}
                          >
                            {value ? renderSpecValue(value) : <Text type="secondary">-</Text>}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <Divider />

          <Row justify="center">
            <Col>
              <Space>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsAddProductModalVisible(true)}>
                  Add Another Product
                </Button>
                <Button onClick={handleClearComparison}>Clear Comparison</Button>
              </Space>
            </Col>
          </Row>
        </Card>
      )}

      <Modal
        title="Add Product to Comparison"
        open={isAddProductModalVisible}
        onCancel={() => setIsAddProductModalVisible(false)}
        footer={null}
        width={800}
      >
        <Table
          columns={productListColumns}
          dataSource={availableProducts}
          rowKey="id"
          pagination={{ pageSize: 5 }}
        />
      </Modal>
    </div>
  );
};

export default ProductComparisonPage;
