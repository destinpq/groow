import React, { useState, useEffect } from 'react';
import {
  Row,
  Col,
  Image,
  Typography,
  Rate,
  Button,
  InputNumber,
  Space,
  Tag,
  Tabs,
  Card,
  Avatar,
  Progress,
  Divider,
  Breadcrumb,
  message,
  Badge,
  Spin,
  Alert,
} from 'antd';
import {
  ShoppingCartOutlined,
  HeartOutlined,
  HeartFilled,
  ShareAltOutlined,
  SafetyOutlined,
  ShopOutlined,
  CheckCircleOutlined,
  StarFilled,
  LoadingOutlined,
} from '@ant-design/icons';
import { history, useParams } from 'umi';
import { motion } from 'framer-motion';
import { productAPI, productReviewAPI, wishlistAPI, type Product, type ProductReview } from '@/services/api/productAPI';
import { useCartStore } from '@/store/cartStore';
import './[id].less';

const { Title, Text, Paragraph } = Typography;

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [ratingBreakdown, setRatingBreakdown] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  
  const addToCart = useCartStore((state) => state.addItem);

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Fetch product details
        const productData = await productAPI.getProduct(id);
        setProduct(productData);
        setSelectedVariant(productData.variants?.[0] || null);
        
        // Check if product is in wishlist
        try {
          const wishlistStatus = await wishlistAPI.isInWishlist(productData.id);
          setIsWishlisted(wishlistStatus.inWishlist);
        } catch (wishlistError) {
          console.log('Could not check wishlist status:', wishlistError);
        }
        
        // Fetch related products
        try {
          const related = await productAPI.getRelatedProducts(productData.id);
          setRelatedProducts(related);
        } catch (relatedError) {
          console.log('Could not fetch related products:', relatedError);
        }
        
      } catch (error: any) {
        console.error('Error fetching product:', error);
        setError(error.message || 'Failed to load product details');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      if (!product) return;
      
      try {
        setReviewsLoading(true);
        const reviewData = await productReviewAPI.getProductReviews(product.id);
        setReviews(reviewData.reviews);
        setRatingBreakdown(reviewData.ratingBreakdown);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setReviewsLoading(false);
      }
    };

    fetchReviews();
  }, [product]);

  const handleAddToCart = async () => {
    if (!product) return;
    
    try {
      // Add to cart using store
      await addToCart({
        productId: product.id.toString(),
        quantity,
      });
      
      message.success('Added to cart successfully!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      message.error('Failed to add to cart');
    }
  };

  const handleBuyNow = () => {
    handleAddToCart();
    setTimeout(() => {
      history.push('/checkout');
    }, 500);
  };

  const handleWishlist = async () => {
    if (!product) return;
    
    try {
      if (isWishlisted) {
        await wishlistAPI.removeFromWishlist(product.id);
        setIsWishlisted(false);
        message.success('Removed from wishlist');
      } else {
        await wishlistAPI.addToWishlist(product.id);
        setIsWishlisted(true);
        message.success('Added to wishlist');
      }
    } catch (error) {
      console.error('Error updating wishlist:', error);
      message.error('Failed to update wishlist');
    }
  };

  const handleShare = () => {
    if (navigator.share && product) {
      navigator.share({
        title: product.name,
        text: `Check out this product: ${product.name}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      message.success('Product link copied to clipboard!');
    }
  };

  const calculateRatingPercentage = (star: number) => {
    if (!ratingBreakdown) return '0';
    const total = Object.values(ratingBreakdown).reduce((a: number, b: any) => a + (Number(b) || 0), 0);
    const count = ratingBreakdown[star] || 0;
    return total > 0 ? ((count / total) * 100).toFixed(0) : '0';
  };

  // Loading state
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <Spin size="large" indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
        <div style={{ marginTop: 16 }}>Loading product details...</div>
      </div>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <div style={{ padding: '50px 0' }}>
        <Alert
          message="Product Not Found"
          description={error || "The product you're looking for doesn't exist or has been removed."}
          type="error"
          showIcon
          action={
            <Button type="primary" onClick={() => history.push('/products')}>
              Browse Products
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="product-detail-page">
      {/* Breadcrumb */}
      <Breadcrumb style={{ marginBottom: 24 }}>
        <Breadcrumb.Item>
          <a onClick={() => history.push('/')}>Home</a>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <a onClick={() => history.push('/products')}>{product.category}</a>
        </Breadcrumb.Item>
        {product.subcategory && (
          <Breadcrumb.Item>{product.subcategory}</Breadcrumb.Item>
        )}
        <Breadcrumb.Item>{product.name}</Breadcrumb.Item>
      </Breadcrumb>

      <Row gutter={[32, 32]}>
        {/* Left: Image Gallery */}
        <Col xs={24} lg={10}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="product-gallery">
              {/* Main Image */}
              <div className="main-image-wrapper">
                {product.discount && product.discount > 0 && (
                  <Badge.Ribbon text={`-${product.discount}%`} color="red">
                    <Image
                      src={product.images[selectedImage]}
                      alt={product.name}
                      preview={{
                        mask: 'Click to zoom',
                      }}
                      style={{ width: '100%', borderRadius: 8 }}
                    />
                  </Badge.Ribbon>
                )}
                {(!product.discount || product.discount === 0) && (
                  <Image
                    src={product.images[selectedImage]}
                    alt={product.name}
                    preview={{
                      mask: 'Click to zoom',
                    }}
                    style={{ width: '100%', borderRadius: 8 }}
                  />
                )}
              </div>

              {/* Thumbnail Images */}
              <Row gutter={[8, 8]} style={{ marginTop: 16 }}>
                {product.images.map((img, index) => (
                  <Col span={4} key={index}>
                    <div
                      className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                      onClick={() => setSelectedImage(index)}
                      style={{
                        cursor: 'pointer',
                        border: selectedImage === index ? '2px solid #FF9900' : '1px solid #ddd',
                        borderRadius: 4,
                        padding: 4,
                      }}
                    >
                      <img
                        src={img}
                        alt={`Product ${index + 1}`}
                        style={{ width: '100%', borderRadius: 4 }}
                      />
                    </div>
                  </Col>
                ))}
              </Row>

              {/* Share & Wishlist */}
              <Row gutter={16} style={{ marginTop: 16 }}>
                <Col span={12}>
                  <Button
                    block
                    icon={isWishlisted ? <HeartFilled /> : <HeartOutlined />}
                    onClick={handleWishlist}
                    danger={isWishlisted}
                  >
                    {isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}
                  </Button>
                </Col>
                <Col span={12}>
                  <Button block icon={<ShareAltOutlined />} onClick={handleShare}>
                    Share
                  </Button>
                </Col>
              </Row>
            </Card>
          </motion.div>
        </Col>

        {/* Right: Product Details */}
        <Col xs={24} lg={14}>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Product Title */}
            <Title level={2} style={{ marginBottom: 8 }}>
              {product.name}
            </Title>

            {/* Rating & Reviews */}
            <Space size="middle" style={{ marginBottom: 16 }}>
              <Rate disabled defaultValue={product.rating} allowHalf />
              <Text strong>{product.rating}</Text>
              <Text type="secondary">({product.reviewCount.toLocaleString()} reviews)</Text>
              {product.vendor.verified && (
                <Tag icon={<CheckCircleOutlined />} color="success">
                  Verified Seller
                </Tag>
              )}
            </Space>

            <Divider />

            {/* Price */}
            <Space align="baseline" size="large" style={{ marginBottom: 24 }}>
              <Title level={3} style={{ color: '#B12704', margin: 0 }}>
                ${product.price.toFixed(2)}
              </Title>
              {product.originalPrice && product.originalPrice > product.price && (
                <>
                  <Text delete type="secondary" style={{ fontSize: 18 }}>
                    ${product.originalPrice.toFixed(2)}
                  </Text>
                  <Tag color="red" style={{ fontSize: 14 }}>
                    Save {product.discount}%
                  </Tag>
                </>
              )}
            </Space>

            {/* Stock Status */}
            {product.inStock ? (
              <Tag color="success" icon={<CheckCircleOutlined />} style={{ marginBottom: 16 }}>
                In Stock ({product.stockQuantity} available)
              </Tag>
            ) : (
              <Tag color="error" style={{ marginBottom: 16 }}>
                Out of Stock
              </Tag>
            )}

            {/* Variant Selection */}
            {product.variants && product.variants.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <Text strong style={{ display: 'block', marginBottom: 8 }}>
                  Variants:
                </Text>
                <Space>
                  {product.variants.map((variant) => (
                    <Button
                      key={variant.id}
                      type={selectedVariant?.id === variant.id ? 'primary' : 'default'}
                      disabled={!variant.available}
                      onClick={() => setSelectedVariant(variant)}
                    >
                      {variant.name}
                      {!variant.available && ' (Out of stock)'}
                    </Button>
                  ))}
                </Space>
              </div>
            )}

            {/* Quantity Selector */}
            <div style={{ marginBottom: 24 }}>
              <Text strong style={{ display: 'block', marginBottom: 8 }}>
                Quantity:
              </Text>
              <InputNumber
                min={1}
                max={product.stockQuantity}
                value={quantity}
                onChange={(val) => setQuantity(val || 1)}
                size="large"
              />
            </div>

            {/* Action Buttons */}
            <Space direction="vertical" style={{ width: '100%', marginBottom: 24 }} size="middle">
              <Button
                type="primary"
                size="large"
                block
                icon={<ShoppingCartOutlined />}
                onClick={handleAddToCart}
                disabled={!product.inStock}
              >
                Add to Cart
              </Button>
              <Button
                size="large"
                block
                style={{ background: '#FFA41C', borderColor: '#FF9900', color: '#000' }}
                onClick={handleBuyNow}
                disabled={!product.inStock}
              >
                Buy Now
              </Button>
            </Space>

            {/* Vendor Info */}
            <Card size="small" style={{ marginBottom: 24 }}>
              <Row align="middle" gutter={16}>
                <Col>
                  <Avatar size={50} src={product.vendor.logo} icon={<ShopOutlined />} />
                </Col>
                <Col flex={1}>
                  <Text strong style={{ display: 'block' }}>
                    {product.vendor.name}
                  </Text>
                  <Space size="small">
                    <Rate disabled defaultValue={product.vendor.rating} style={{ fontSize: 12 }} />
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      ({product.vendor.productCount} products)
                    </Text>
                  </Space>
                </Col>
                <Col>
                  <Button onClick={() => history.push(`/vendor/${product.vendor.id}`)}>
                    Visit Store
                  </Button>
                </Col>
              </Row>
            </Card>

            {/* Trust Badges */}
            <Row gutter={16}>
              <Col span={8}>
                <Card size="small" style={{ textAlign: 'center' }}>
                  <SafetyOutlined style={{ fontSize: 24, color: '#52c41a' }} />
                  <Text style={{ display: 'block', marginTop: 8, fontSize: 12 }}>
                    Secure Payment
                  </Text>
                </Card>
              </Col>
              <Col span={8}>
                <Card size="small" style={{ textAlign: 'center' }}>
                  <CheckCircleOutlined style={{ fontSize: 24, color: '#1890ff' }} />
                  <Text style={{ display: 'block', marginTop: 8, fontSize: 12 }}>
                    Quality Assured
                  </Text>
                </Card>
              </Col>
              <Col span={8}>
                <Card size="small" style={{ textAlign: 'center' }}>
                  <SafetyOutlined style={{ fontSize: 24, color: '#faad14' }} />
                  <Text style={{ display: 'block', marginTop: 8, fontSize: 12 }}>
                    7 Day Returns
                  </Text>
                </Card>
              </Col>
            </Row>
          </motion.div>
        </Col>
      </Row>

      {/* Product Details Tabs */}
      <Card style={{ marginTop: 32 }}>
        <Tabs 
          defaultActiveKey="1" 
          size="large"
          items={[
            {
              key: '1',
              label: 'Description',
              children: <div dangerouslySetInnerHTML={{ __html: product.description }} />,
            },
            {
              key: '2',
              label: 'Specifications',
              children: (
                <Row gutter={[16, 16]}>
                  {product.specifications.map((spec, index) => (
                    <React.Fragment key={index}>
                      <Col span={8}>
                        <Text strong>{spec.label}</Text>
                      </Col>
                      <Col span={16}>
                        <Text>{spec.value}</Text>
                      </Col>
                    </React.Fragment>
                  ))}
                </Row>
              ),
            },
            {
              key: '3',
              label: `Reviews (${product.reviewCount})`,
              children: (
                reviewsLoading ? (
                  <div style={{ textAlign: 'center', padding: '50px 0' }}>
                    <Spin />
                    <div style={{ marginTop: 16 }}>Loading reviews...</div>
                  </div>
                ) : (
                  <>
                    {/* Rating Summary */}
                    <Row gutter={32} style={{ marginBottom: 32 }}>
                      <Col xs={24} md={8}>
                        <div style={{ textAlign: 'center' }}>
                          <Title level={1} style={{ margin: 0 }}>
                            {product.rating}
                          </Title>
                          <Rate disabled defaultValue={product.rating} allowHalf />
                          <Text type="secondary" style={{ display: 'block', marginTop: 8 }}>
                            Based on {product.reviewCount.toLocaleString()} reviews
                          </Text>
                        </div>
                      </Col>
                      <Col xs={24} md={16}>
                        {ratingBreakdown && [5, 4, 3, 2, 1].map((star) => (
                          <Row key={star} align="middle" gutter={8} style={{ marginBottom: 8 }}>
                            <Col span={3}>
                              <Text>{star} star</Text>
                            </Col>
                            <Col span={18}>
                              <Progress
                                percent={Number(calculateRatingPercentage(star))}
                                strokeColor="#FF9900"
                                showInfo={false}
                              />
                            </Col>
                            <Col span={3}>
                              <Text type="secondary">{calculateRatingPercentage(star)}%</Text>
                            </Col>
                          </Row>
                        ))}
                      </Col>
                    </Row>

                    <Divider />

                    {/* Reviews List */}
                    {reviews.map((review) => (
                      <Card key={review.id} style={{ marginBottom: 16 }} size="small">
                        <Row gutter={16}>
                          <Col span={3}>
                            <Avatar size={48} src={review.userAvatar} />
                          </Col>
                          <Col span={21}>
                            <Space direction="vertical" size={4} style={{ width: '100%' }}>
                              <Space>
                                <Text strong>{review.userName}</Text>
                                {review.verified && (
                                  <Tag color="success" icon={<CheckCircleOutlined />}>
                                    Verified Purchase
                                  </Tag>
                                )}
                              </Space>
                              <Rate disabled defaultValue={review.rating} style={{ fontSize: 14 }} />
                              <Text type="secondary" style={{ fontSize: 12 }}>
                                Reviewed on {new Date(review.createdAt).toLocaleDateString()}
                              </Text>
                              {review.title && (
                                <Text strong style={{ display: 'block', marginTop: 4 }}>
                                  {review.title}
                                </Text>
                              )}
                              <Paragraph style={{ marginTop: 8 }}>{review.comment}</Paragraph>
                              <Text type="secondary" style={{ fontSize: 12 }}>
                                {review.helpful} people found this helpful
                              </Text>
                            </Space>
                          </Col>
                        </Row>
                      </Card>
                    ))}

                    {reviews.length === 0 && (
                      <div style={{ textAlign: 'center', padding: '50px 0' }}>
                        <Text type="secondary">No reviews yet. Be the first to review this product!</Text>
                      </div>
                    )}

                    {reviews.length > 0 && (
                      <Button block style={{ marginTop: 16 }}>
                        Load More Reviews
                      </Button>
                    )}
                  </>
                )
              ),
            },
          ]}
        />
      </Card>

      {/* Related Products */}
      <Card title="Related Products" style={{ marginTop: 32 }}>
        {relatedProducts.length > 0 ? (
          <Row gutter={[16, 16]}>
            {relatedProducts.slice(0, 4).map((relatedProduct) => (
              <Col xs={12} md={6} key={relatedProduct.id}>
                <Card
                  hoverable
                  cover={
                    <img
                      alt={relatedProduct.name}
                      src={relatedProduct.image}
                      style={{ height: 200, objectFit: 'cover' }}
                    />
                  }
                  onClick={() => history.push(`/products/${relatedProduct.id}`)}
                >
                  <Card.Meta
                    title={
                      <Text ellipsis style={{ fontSize: 14 }}>
                        {relatedProduct.name}
                      </Text>
                    }
                    description={
                      <Space direction="vertical" size={4}>
                        <Text strong style={{ color: '#B12704' }}>
                          ${relatedProduct.price.toFixed(2)}
                        </Text>
                        <Space size={4}>
                          <Rate disabled defaultValue={relatedProduct.rating} style={{ fontSize: 12 }} />
                          <Text style={{ fontSize: 12 }}>({relatedProduct.reviewCount})</Text>
                        </Space>
                      </Space>
                    }
                  />
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <Text type="secondary">No related products found.</Text>
        )}
      </Card>
    </div>
  );
};

export default ProductDetailPage;
