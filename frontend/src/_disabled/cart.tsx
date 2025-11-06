import { Row, Col, Card, Image, Button, InputNumber, Table, Space, Divider, message, Empty, Input, Spin } from 'antd';
import { DeleteOutlined, HeartOutlined, ShoppingOutlined, TagOutlined } from '@ant-design/icons';
import { useNavigate } from 'umi';
import { useEffect, useState } from 'react';
import { useCartStore } from '@/store/cartStore';

const CartPage = () => {
  const navigate = useNavigate();
  const { cart, loading, fetchCart, updateItemQuantity, removeItem, clearCart, applyCoupon, removeCoupon } = useCartStore();
  const [couponCode, setCouponCode] = useState('');
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  useEffect(() => {
    fetchCart();
  }, []);

  const cartItems = cart?.items || [];

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      await removeItem(itemId);
    } else {
      await updateItemQuantity(itemId, newQuantity);
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    await removeItem(itemId);
  };

  const handleClearCart = async () => {
    await clearCart();
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      message.warning('Please enter a coupon code');
      return;
    }
    setApplyingCoupon(true);
    await applyCoupon(couponCode);
    setApplyingCoupon(false);
    setCouponCode('');
  };

  const handleRemoveCoupon = async () => {
    await removeCoupon();
  };

  const columns = [
    {
      title: 'Product',
      dataIndex: 'product',
      key: 'product',
      render: (_: any, record: any) => (
        <Space>
          <Image 
            src={record.product?.images?.[0] || 'https://via.placeholder.com/100?text=Product'} 
            width={80} 
            height={80} 
            fallback="https://via.placeholder.com/100?text=Product"
          />
          <div>
            <div style={{ fontWeight: 500 }}>{record.product?.name}</div>
            <div style={{ color: record.product?.stockQuantity > 0 ? '#067D62' : '#C7511F', fontSize: 12 }}>
              {record.product?.stockQuantity > 0 ? `In Stock (${record.product.stockQuantity})` : 'Out of Stock'}
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => <span style={{ fontSize: 16, fontWeight: 500 }}>${price.toFixed(2)}</span>,
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (quantity: number, record: any) => (
        <InputNumber 
          min={1} 
          max={record.product?.stockQuantity || 10} 
          value={quantity} 
          onChange={(value) => handleQuantityChange(record.id, value || 1)}
          disabled={loading}
        />
      ),
    },
    {
      title: 'Subtotal',
      key: 'subtotal',
      render: (_: any, record: any) => (
        <span style={{ fontSize: 16, fontWeight: 600, color: '#B12704' }}>
          ${record.subtotal.toFixed(2)}
        </span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          <Button type="link" icon={<HeartOutlined />} disabled>Save for Later</Button>
          <Button 
            type="link" 
            danger 
            icon={<DeleteOutlined />} 
            onClick={() => handleRemoveItem(record.id)}
            loading={loading}
          >
            Remove
          </Button>
        </Space>
      ),
    },
  ];

  if (loading && !cart) {
    return (
      <div style={{ padding: '80px 0', textAlign: 'center' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!loading && cartItems.length === 0) {
    return (
      <div style={{ padding: '80px 0', textAlign: 'center' }}>
        <Empty
          description="Your cart is empty"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        >
          <Button type="primary" icon={<ShoppingOutlined />} onClick={() => navigate('/products')}>
            Continue Shopping
          </Button>
        </Empty>
      </div>
    );
  }

  const subtotal = cart?.subtotal || 0;
  const shipping = cart?.shipping || 0;
  const tax = cart?.tax || 0;
  const total = cart?.total || 0;

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', padding: '40px 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1>Shopping Cart ({cartItems.length} items)</h1>
        <Button danger onClick={handleClearCart} loading={loading}>
          Clear Cart
        </Button>
      </div>
      
      <Row gutter={24}>
        <Col xs={24} lg={17}>
          <Card>
            <Table
              columns={columns}
              dataSource={cartItems}
              rowKey="id"
              pagination={false}
            />
          </Card>
        </Col>

        <Col xs={24} lg={7}>
          <Card title="Order Summary" style={{ position: 'sticky', top: 24 }}>
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              {/* Coupon Section */}
              <div>
                <Space.Compact style={{ width: '100%' }}>
                  <Input 
                    placeholder="Enter coupon code" 
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    prefix={<TagOutlined />}
                  />
                  <Button 
                    type="primary" 
                    onClick={handleApplyCoupon}
                    loading={applyingCoupon}
                  >
                    Apply
                  </Button>
                </Space.Compact>
              </div>

              <Divider style={{ margin: '12px 0' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Subtotal ({cartItems.length} items)</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Shipping</span>
                <span>{shipping > 0 ? `$${shipping.toFixed(2)}` : 'FREE'}</span>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              
              <Divider style={{ margin: '12px 0' }} />
              
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 18, fontWeight: 600 }}>
                <span>Total</span>
                <span style={{ color: '#B12704' }}>${total.toFixed(2)}</span>
              </div>
              
              <Button 
                type="primary" 
                size="large" 
                block 
                onClick={() => navigate('/checkout')}
                style={{ marginTop: 16 }}
                disabled={loading || cartItems.length === 0}
              >
                Proceed to Checkout
              </Button>
              
              <Button 
                size="large" 
                block 
                onClick={() => navigate('/products')}
              >
                Continue Shopping
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CartPage;
