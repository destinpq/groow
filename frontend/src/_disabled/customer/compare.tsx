import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Table,
  Button,
  Space,
  Typography,
  Tag,
  Rate,
  Image,
  Empty,
  Tooltip,
  Divider,
  Statistic,
} from 'antd';
import {
  DeleteOutlined,
  ShoppingCartOutlined,
  HeartOutlined,
  CheckCircleFilled,
  CloseCircleFilled,
  InfoCircleOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text, Paragraph } = Typography;

interface CompareProduct {
  id: number;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  brand: string;
  inStock: boolean;
  warranty: string;
  returnPolicy: string;
  shipping: string;
  features: {
    processor?: string;
    ram?: string;
    storage?: string;
    display?: string;
    battery?: string;
    camera?: string;
    weight?: string;
    connectivity?: string;
    os?: string;
    color?: string;
  };
  highlights: string[];
}

const mockCompareProducts: CompareProduct[] = [
  {
    id: 1,
    name: 'Premium Wireless Headphones Pro',
    image: 'https://via.placeholder.com/200x200?text=Headphones+Pro',
    price: 299.99,
    originalPrice: 349.99,
    rating: 4.8,
    reviews: 2456,
    brand: 'AudioTech',
    inStock: true,
    warranty: '2 Years Manufacturer',
    returnPolicy: '30 Days Easy Return',
    shipping: 'Free Shipping',
    features: {
      connectivity: 'Bluetooth 5.2, AUX',
      battery: '40 hours',
      weight: '250g',
      color: 'Black, Silver, Blue',
    },
    highlights: [
      'Active Noise Cancellation',
      'Hi-Res Audio Support',
      'Fast Charging (10min = 5hr)',
      'Premium Comfort Padding',
    ],
  },
  {
    id: 2,
    name: 'Studio Wireless Headphones',
    image: 'https://via.placeholder.com/200x200?text=Studio+Headphones',
    price: 249.99,
    rating: 4.6,
    reviews: 1823,
    brand: 'SoundMaster',
    inStock: true,
    warranty: '1 Year Manufacturer',
    returnPolicy: '15 Days Return',
    shipping: 'Free Shipping',
    features: {
      connectivity: 'Bluetooth 5.0',
      battery: '30 hours',
      weight: '280g',
      color: 'Black, Red',
    },
    highlights: [
      'Studio-Quality Sound',
      'Foldable Design',
      'Built-in Microphone',
      'Comfortable Ear Cushions',
    ],
  },
  {
    id: 3,
    name: 'Budget Wireless Headphones',
    image: 'https://via.placeholder.com/200x200?text=Budget+Headphones',
    price: 79.99,
    originalPrice: 99.99,
    rating: 4.2,
    reviews: 892,
    brand: 'ValueSound',
    inStock: true,
    warranty: '6 Months Manufacturer',
    returnPolicy: '7 Days Return',
    shipping: '$5.99 Shipping',
    features: {
      connectivity: 'Bluetooth 4.2',
      battery: '20 hours',
      weight: '220g',
      color: 'Black',
    },
    highlights: [
      'Affordable Price',
      'Decent Sound Quality',
      'Lightweight Design',
      'Basic Controls',
    ],
  },
];

const ProductComparePage: React.FC = () => {
  const [compareProducts, setCompareProducts] = useState<CompareProduct[]>(mockCompareProducts);

  const removeProduct = (productId: number) => {
    setCompareProducts(compareProducts.filter(p => p.id !== productId));
  };

  const addToCart = (productId: number) => {
    console.log('Add to cart:', productId);
    // Implement add to cart logic
  };

  const addToWishlist = (productId: number) => {
    console.log('Add to wishlist:', productId);
    // Implement add to wishlist logic
  };

  // Comparison table data structure
  const comparisonData = [
    {
      key: 'image',
      attribute: 'Product',
      type: 'image',
    },
    {
      key: 'price',
      attribute: 'Price',
      type: 'price',
    },
    {
      key: 'rating',
      attribute: 'Rating',
      type: 'rating',
    },
    {
      key: 'brand',
      attribute: 'Brand',
      type: 'text',
    },
    {
      key: 'inStock',
      attribute: 'Availability',
      type: 'stock',
    },
    {
      key: 'warranty',
      attribute: 'Warranty',
      type: 'text',
    },
    {
      key: 'returnPolicy',
      attribute: 'Return Policy',
      type: 'text',
    },
    {
      key: 'shipping',
      attribute: 'Shipping',
      type: 'text',
    },
    {
      key: 'connectivity',
      attribute: 'Connectivity',
      type: 'feature',
    },
    {
      key: 'battery',
      attribute: 'Battery Life',
      type: 'feature',
    },
    {
      key: 'weight',
      attribute: 'Weight',
      type: 'feature',
    },
    {
      key: 'color',
      attribute: 'Available Colors',
      type: 'feature',
    },
    {
      key: 'highlights',
      attribute: 'Key Features',
      type: 'highlights',
    },
    {
      key: 'actions',
      attribute: 'Actions',
      type: 'actions',
    },
  ];

  const renderCell = (product: CompareProduct, row: any) => {
    switch (row.type) {
      case 'image':
        return (
          <div style={{ textAlign: 'center' }}>
            <Image
              src={product.image}
              alt={product.name}
              width={150}
              height={150}
              style={{ objectFit: 'cover', borderRadius: 8 }}
            />
            <Paragraph strong style={{ marginTop: 12, marginBottom: 0 }}>
              {product.name}
            </Paragraph>
          </div>
        );

      case 'price':
        return (
          <div style={{ textAlign: 'center' }}>
            <Title level={4} style={{ color: '#ff9900', marginBottom: 4 }}>
              ${product.price.toFixed(2)}
            </Title>
            {product.originalPrice && (
              <Text delete type="secondary">
                ${product.originalPrice.toFixed(2)}
              </Text>
            )}
            {product.originalPrice && (
              <div>
                <Tag color="success">
                  Save {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                </Tag>
              </div>
            )}
          </div>
        );

      case 'rating':
        return (
          <div style={{ textAlign: 'center' }}>
            <Rate disabled value={product.rating} allowHalf />
            <div>
              <Text strong>{product.rating}</Text>
              <Text type="secondary"> ({product.reviews.toLocaleString()} reviews)</Text>
            </div>
          </div>
        );

      case 'stock':
        return (
          <div style={{ textAlign: 'center' }}>
            {product.inStock ? (
              <Tag icon={<CheckCircleFilled />} color="success">
                In Stock
              </Tag>
            ) : (
              <Tag icon={<CloseCircleFilled />} color="error">
                Out of Stock
              </Tag>
            )}
          </div>
        );

      case 'feature':
        const featureValue = product.features[row.key as keyof typeof product.features];
        return (
          <div style={{ textAlign: 'center' }}>
            {featureValue ? (
              <Text>{featureValue}</Text>
            ) : (
              <Text type="secondary">N/A</Text>
            )}
          </div>
        );

      case 'highlights':
        return (
          <div style={{ padding: '0 12px' }}>
            <ul style={{ paddingLeft: 20, marginBottom: 0 }}>
              {product.highlights.map((highlight, idx) => (
                <li key={idx}>
                  <Text>{highlight}</Text>
                </li>
              ))}
            </ul>
          </div>
        );

      case 'actions':
        return (
          <div style={{ textAlign: 'center' }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Button
                type="primary"
                icon={<ShoppingCartOutlined />}
                onClick={() => addToCart(product.id)}
                block
                disabled={!product.inStock}
              >
                Add to Cart
              </Button>
              <Button
                icon={<HeartOutlined />}
                onClick={() => addToWishlist(product.id)}
                block
              >
                Wishlist
              </Button>
              <Button
                danger
                icon={<DeleteOutlined />}
                onClick={() => removeProduct(product.id)}
                block
              >
                Remove
              </Button>
            </Space>
          </div>
        );

      case 'text':
      default:
        const value = product[row.key as keyof CompareProduct];
        return (
          <div style={{ textAlign: 'center' }}>
            <Text>{value as string}</Text>
          </div>
        );
    }
  };

  const columns: ColumnsType<any> = [
    {
      title: 'Specification',
      dataIndex: 'attribute',
      key: 'attribute',
      width: 200,
      fixed: 'left',
      render: (text: string, record: any) => (
        <Text strong style={{ fontSize: 14 }}>
          {text}
          {record.key === 'battery' && (
            <Tooltip title="Battery life may vary based on usage">
              <InfoCircleOutlined style={{ marginLeft: 8, color: '#1890ff' }} />
            </Tooltip>
          )}
        </Text>
      ),
    },
    ...compareProducts.map((product, index) => ({
      title: '',
      key: `product-${product.id}`,
      dataIndex: `product-${product.id}`,
      width: 300,
      render: (_: any, record: any) => renderCell(product, record),
    })),
  ];

  if (compareProducts.length === 0) {
    return (
      <div style={{ padding: 24 }}>
        <Card>
          <Empty
            description={
              <div>
                <Title level={4}>No Products to Compare</Title>
                <Paragraph type="secondary">
                  Add products to your comparison list to see detailed side-by-side comparisons
                </Paragraph>
                <Button type="primary" href="/customer/products">
                  Browse Products
                </Button>
              </div>
            }
          />
        </Card>
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={3}>Product Comparison</Title>
        <Text type="secondary">
          Compare {compareProducts.length} products side by side
        </Text>
      </div>

      {/* Quick Stats */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Lowest Price"
              value={Math.min(...compareProducts.map(p => p.price))}
              precision={2}
              prefix="$"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Highest Rating"
              value={Math.max(...compareProducts.map(p => p.rating))}
              precision={1}
              suffix="/ 5"
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Best Value"
              value={compareProducts.reduce((best, p) => 
                (p.rating / p.price > best.rating / best.price) ? p : best
              ).name}
              valueStyle={{ fontSize: 14 }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="In Stock"
              value={compareProducts.filter(p => p.inStock).length}
              suffix={`/ ${compareProducts.length}`}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Comparison Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={comparisonData}
          pagination={false}
          scroll={{ x: 200 + (compareProducts.length * 300) }}
          bordered
          rowKey="key"
        />
      </Card>

      <Divider />

      {/* Tips */}
      <Card title="Comparison Tips" style={{ marginTop: 24 }}>
        <Row gutter={16}>
          <Col span={8}>
            <Space>
              <InfoCircleOutlined style={{ color: '#1890ff' }} />
              <div>
                <Text strong>Best for Budget:</Text>
                <br />
                <Text type="secondary">
                  {compareProducts.reduce((min, p) => p.price < min.price ? p : min).name}
                </Text>
              </div>
            </Space>
          </Col>
          <Col span={8}>
            <Space>
              <InfoCircleOutlined style={{ color: '#52c41a' }} />
              <div>
                <Text strong>Highest Rated:</Text>
                <br />
                <Text type="secondary">
                  {compareProducts.reduce((max, p) => p.rating > max.rating ? p : max).name}
                </Text>
              </div>
            </Space>
          </Col>
          <Col span={8}>
            <Space>
              <InfoCircleOutlined style={{ color: '#faad14' }} />
              <div>
                <Text strong>Best Reviews:</Text>
                <br />
                <Text type="secondary">
                  {compareProducts.reduce((max, p) => p.reviews > max.reviews ? p : max).name}
                </Text>
              </div>
            </Space>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default ProductComparePage;
