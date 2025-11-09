import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Typography,
  Row,
  Col,
  Divider,
  Tag,
  Rate,
  Image,
  Tooltip,
  Modal,
  message,
  Badge,
  Statistic,
  Progress,
  Empty,
} from 'antd';
import {
  SwapOutlined,
  DeleteOutlined,
  ShoppingCartOutlined,
  HeartOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  InfoCircleOutlined,
  StarOutlined,
  TrophyOutlined,
  DollarOutlined,
} from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';
import { useProductComparisonStore } from '@/store/productComparison';
import { useCartStore } from '@/store/cart';
import { useWishlistStore } from '@/store/wishlist';
import { enhancedProductAPI, type EnhancedProduct, type ProductComparison, type ComparisonAttribute } from '@/services/api/enhanced-product';
import { useErrorStore } from '@/store/error';

const { Title, Text } = Typography;

interface ProductComparisonModalProps {
  visible: boolean;
  onClose: () => void;
  products?: EnhancedProduct[];
}

interface ComparisonTableProps {
  comparison: ProductComparison;
  onRemoveProduct: (productId: string) => void;
  onAddToCart: (product: EnhancedProduct) => void;
  onAddToWishlist: (productId: string) => void;
}

const ComparisonTable: React.FC<ComparisonTableProps> = ({
  comparison,
  onRemoveProduct,
  onAddToCart,
  onAddToWishlist,
}) => {
  const { isInWishlist } = useWishlistStore();

  // Group attributes by category
  const groupedAttributes = comparison.comparisonAttributes.reduce((acc, attr) => {
    if (!acc[attr.group]) {
      acc[attr.group] = [];
    }
    acc[attr.group].push(attr);
    return acc;
  }, {} as Record<string, ComparisonAttribute[]>);

  // Create table columns for products
  const productColumns = comparison.products.map((product, index) => ({
    title: (
      <div style={{ textAlign: 'center', padding: '16px 8px' }}>
        <div style={{ marginBottom: 12 }}>
          <Image
            src={product.images[0]?.url || '/placeholder.png'}
            alt={product.name}
            width={80}
            height={80}
            style={{ borderRadius: 8, objectFit: 'cover' }}
          />
        </div>
        
        <div style={{ marginBottom: 8 }}>
          <Text strong style={{ fontSize: 14 }}>
            {product.name}
          </Text>
        </div>
        
        <div style={{ marginBottom: 8 }}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {product.brand.name}
          </Text>
        </div>
        
        <div style={{ marginBottom: 12 }}>
          <Space direction="vertical" size={4}>
            <Text strong style={{ fontSize: 16, color: '#f5222d' }}>
              ${product.price.toFixed(2)}
            </Text>
            {product.comparePrice && product.comparePrice > product.price && (
              <Text delete type="secondary" style={{ fontSize: 12 }}>
                ${product.comparePrice.toFixed(2)}
              </Text>
            )}
          </Space>
        </div>
        
        <div style={{ marginBottom: 12 }}>
          <Space direction="vertical" size={4}>
            <Rate disabled value={product.rating.average} allowHalf style={{ fontSize: 12 }} />
            <Text style={{ fontSize: 11, color: '#666' }}>
              ({product.rating.count} reviews)
            </Text>
          </Space>
        </div>
        
        <Space direction="vertical" style={{ width: '100%' }} size={8}>
          <Button
            type="primary"
            size="small"
            icon={<ShoppingCartOutlined />}
            onClick={() => onAddToCart(product)}
            disabled={!product.inventory.inStock}
            block
          >
            {product.inventory.inStock ? 'Add to Cart' : 'Out of Stock'}
          </Button>
          
          <Button
            type={isInWishlist(product.id) ? 'primary' : 'default'}
            size="small"
            icon={<HeartOutlined />}
            onClick={() => onAddToWishlist(product.id)}
            block
          >
            Wishlist
          </Button>
          
          <Button
            type="text"
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => onRemoveProduct(product.id)}
            block
          >
            Remove
          </Button>
        </Space>
      </div>
    ),
    dataIndex: product.id,
    key: product.id,
    width: 200,
    align: 'center' as const,
  }));

  // Create table data
  const tableData: any[] = [];

  // Add basic info rows
  tableData.push(
    {
      key: 'availability',
      attribute: 'Availability',
      group: 'Basic Info',
      importance: 'high',
      ...comparison.products.reduce((acc, product) => ({
        ...acc,
        [product.id]: product.inventory.inStock ? (
          <Tag color="green" icon={<CheckCircleOutlined />}>In Stock</Tag>
        ) : (
          <Tag color="red" icon={<CloseCircleOutlined />}>Out of Stock</Tag>
        ),
      }), {}),
    },
    {
      key: 'shipping',
      attribute: 'Shipping',
      group: 'Basic Info',
      importance: 'medium',
      ...comparison.products.reduce((acc, product) => ({
        ...acc,
        [product.id]: !product.requiresShipping ? (
          <Tag color="blue">Free Shipping</Tag>
        ) : (
          <Text>Standard Shipping</Text>
        ),
      }), {}),
    },
    {
      key: 'vendor',
      attribute: 'Vendor',
      group: 'Basic Info',
      importance: 'medium',
      ...comparison.products.reduce((acc, product) => ({
        ...acc,
        [product.id]: (
          <Space>
            <Text>{product.vendor.name}</Text>
            {product.vendor.isVerified && (
              <Tooltip title="Verified Vendor">
                <CheckCircleOutlined style={{ color: '#52c41a' }} />
              </Tooltip>
            )}
          </Space>
        ),
      }), {}),
    }
  );

  // Add grouped attributes
  Object.entries(groupedAttributes).forEach(([groupName, attributes]) => {
    attributes.forEach((attr) => {
      const row: any = {
        key: attr.name,
        attribute: attr.name,
        group: groupName,
        importance: attr.importance,
      };

      attr.values.forEach((value) => {
        const product = comparison.products.find(p => p.id === value.productId);
        if (product) {
          let displayValue = value.value;
          
          // Format value based on attribute type
          if (attr.name.toLowerCase().includes('price') || attr.name.toLowerCase().includes('cost')) {
            displayValue = typeof value.value === 'number' ? `$${value.value}` : value.value;
          } else if (attr.name.toLowerCase().includes('weight')) {
            displayValue = `${value.value} ${attr.name.toLowerCase().includes('kg') ? 'kg' : 'lbs'}`;
          } else if (attr.name.toLowerCase().includes('size') || attr.name.toLowerCase().includes('dimension')) {
            displayValue = value.value;
          }

          row[value.productId] = value.isHighlight ? (
            <Badge.Ribbon text="Best" color="gold">
              <Tag color="green">{displayValue}</Tag>
            </Badge.Ribbon>
          ) : (
            <span>{displayValue}</span>
          );
        }
      });

      tableData.push(row);
    });
  });

  // Table columns including attribute column
  const columns = [
    {
      title: 'Attributes',
      dataIndex: 'attribute',
      key: 'attribute',
      width: 200,
      fixed: 'left' as const,
      render: (text: string, record: any) => (
        <div>
          <Space>
            <Text strong>{text}</Text>
            {record.importance === 'high' && (
              <Tooltip title="Important feature">
                <StarOutlined style={{ color: '#faad14' }} />
              </Tooltip>
            )}
          </Space>
          <div style={{ marginTop: 4 }}>
            <Tag size="small" color="blue">{record.group}</Tag>
          </div>
        </div>
      ),
    },
    ...productColumns,
  ];

  return (
    <div>
      <Table
        columns={columns}
        dataSource={tableData}
        pagination={false}
        scroll={{ x: 1000 }}
        size="middle"
        bordered
        rowClassName={(record) => {
          if (record.importance === 'high') return 'high-importance-row';
          if (record.importance === 'medium') return 'medium-importance-row';
          return '';
        }}
      />
      
      <style jsx global>{`
        .high-importance-row {
          background-color: #fff7e6;
        }
        .medium-importance-row {
          background-color: #f6ffed;
        }
      `}</style>
    </div>
  );
};

const ProductComparisonModal: React.FC<ProductComparisonModalProps> = ({
  visible,
  onClose,
  products: propProducts,
}) => {
  const { products: storeProducts, removeProduct } = useProductComparisonStore();
  const { addItem } = useCartStore();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore();
  const { useApiOperation } = useErrorStore();
  
  const [comparison, setComparison] = useState<ProductComparison | null>(null);
  const [loading, setLoading] = useState(false);

  const products = propProducts || storeProducts;

  // Fetch detailed comparison data
  const fetchComparison = useApiOperation(
    async () => {
      if (products.length < 2) return;
      
      setLoading(true);
      try {
        const productIds = products.map(p => p.id);
        const comparisonData = await enhancedProductAPI.compareProducts(productIds);
        setComparison(comparisonData);
      } finally {
        setLoading(false);
      }
    },
    { showErrorMessage: true }
  );

  useEffect(() => {
    if (visible && products.length >= 2) {
      fetchComparison();
    }
  }, [visible, products, fetchComparison]);

  // Handle remove product from comparison
  const handleRemoveProduct = (productId: string) => {
    removeProduct(productId);
    if (products.length <= 2) {
      message.info('Comparison needs at least 2 products');
      onClose();
    }
  };

  // Handle add to cart
  const handleAddToCart = (product: EnhancedProduct) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0]?.url || '',
      quantity: 1,
    });
    message.success(`Added ${product.name} to cart`);
  };

  // Handle wishlist toggle
  const handleWishlistToggle = useApiOperation(
    async (productId: string) => {
      if (isInWishlist(productId)) {
        await removeFromWishlist(productId);
        message.success('Removed from wishlist');
      } else {
        await addToWishlist(productId);
        message.success('Added to wishlist');
      }
    },
    { successMessage: false }
  );

  if (products.length < 2) {
    return (
      <Modal
        title="Product Comparison"
        open={visible}
        onCancel={onClose}
        footer={null}
        width={600}
      >
        <Empty
          image="/comparison-empty.svg"
          imageStyle={{ height: 200 }}
          description={
            <div>
              <Title level={4}>No products to compare</Title>
              <Text type="secondary">
                Add at least 2 products to start comparing their features and specifications.
              </Text>
            </div>
          }
        />
      </Modal>
    );
  }

  return (
    <Modal
      title={
        <Space>
          <SwapOutlined />
          <span>Product Comparison ({products.length} products)</span>
        </Space>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width="90vw"
      style={{ top: 20 }}
      bodyStyle={{ padding: '20px 24px' }}
    >
      <AnimatePresence>
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ textAlign: 'center', padding: 48 }}
          >
            <Space direction="vertical" size="large">
              <div className="loading-animation">
                <SwapOutlined style={{ fontSize: 48, color: '#1890ff' }} />
              </div>
              <Text>Analyzing product differences...</Text>
            </Space>
          </motion.div>
        ) : comparison ? (
          <motion.div
            key="comparison"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Comparison Summary */}
            {comparison.similarities.length > 0 && (
              <Card size="small" style={{ marginBottom: 16, background: '#f6ffed' }}>
                <Title level={5} style={{ margin: 0, marginBottom: 8, color: '#52c41a' }}>
                  <CheckCircleOutlined /> Common Features
                </Title>
                <Space wrap>
                  {comparison.similarities.map((similarity, index) => (
                    <Tag key={index} color="green">{similarity}</Tag>
                  ))}
                </Space>
              </Card>
            )}

            {/* Key Differences */}
            {comparison.differences.length > 0 && (
              <Card size="small" style={{ marginBottom: 16, background: '#fff2e8' }}>
                <Title level={5} style={{ margin: 0, marginBottom: 8, color: '#fa8c16' }}>
                  <TrophyOutlined /> Key Advantages
                </Title>
                <Row gutter={[16, 8]}>
                  {comparison.differences.map((diff, index) => {
                    const product = products.find(p => p.id === diff.productId);
                    return (
                      <Col key={index} span={8}>
                        <Space direction="vertical" size="small">
                          <Text strong style={{ fontSize: 12 }}>{product?.name}</Text>
                          <Tag color="orange">{diff.attribute}: {diff.advantage}</Tag>
                        </Space>
                      </Col>
                    );
                  })}
                </Row>
              </Card>
            )}

            {/* Comparison Table */}
            <ComparisonTable
              comparison={comparison}
              onRemoveProduct={handleRemoveProduct}
              onAddToCart={handleAddToCart}
              onAddToWishlist={handleWishlistToggle}
            />

            {/* Price Comparison Chart */}
            <Card title="Price Comparison" size="small" style={{ marginTop: 16 }}>
              <Row gutter={16}>
                {products.map((product) => {
                  const maxPrice = Math.max(...products.map(p => p.comparePrice || p.price));
                  const pricePercentage = ((product.price / maxPrice) * 100);
                  const savingsPercent = product.comparePrice 
                    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
                    : 0;

                  return (
                    <Col key={product.id} span={24 / products.length}>
                      <Card size="small" style={{ textAlign: 'center' }}>
                        <Space direction="vertical" style={{ width: '100%' }} size="small">
                          <Text ellipsis style={{ fontSize: 12, fontWeight: 500 }}>
                            {product.name}
                          </Text>
                          
                          <Statistic
                            title="Price"
                            value={product.price}
                            prefix="$"
                            precision={2}
                            valueStyle={{ fontSize: 18, color: '#f5222d' }}
                          />
                          
                          {savingsPercent > 0 && (
                            <Tag color="red" style={{ margin: 0 }}>
                              {savingsPercent}% OFF
                            </Tag>
                          )}
                          
                          <Progress
                            percent={pricePercentage}
                            size="small"
                            strokeColor={pricePercentage < 50 ? '#52c41a' : pricePercentage < 80 ? '#faad14' : '#f5222d'}
                            format={() => ''}
                          />
                          
                          <Text type="secondary" style={{ fontSize: 11 }}>
                            {pricePercentage < 50 ? 'Best Value' : 
                             pricePercentage > 80 ? 'Premium' : 'Mid-range'}
                          </Text>
                        </Space>
                      </Card>
                    </Col>
                  );
                })}
              </Row>
            </Card>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <style jsx>{`
        .loading-animation {
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.7; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </Modal>
  );
};

// Main Comparison Component for page usage
const ProductComparisonPage: React.FC = () => {
  const { products, clearAll } = useProductComparisonStore();

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: 24 }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Space>
              <Title level={2} style={{ margin: 0 }}>
                Product Comparison
              </Title>
              <Badge count={products.length} />
            </Space>
          </Col>
          <Col>
            <Space>
              <Button onClick={() => window.history.back()}>
                Back to Products
              </Button>
              <Button onClick={clearAll} disabled={products.length === 0}>
                Clear All
              </Button>
            </Space>
          </Col>
        </Row>
      </div>

      <ProductComparisonModal
        visible={true}
        onClose={() => window.history.back()}
        products={products}
      />
    </div>
  );
};

export default ProductComparisonModal;
export { ProductComparisonPage };