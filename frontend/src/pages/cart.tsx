import { Row, Col, Card, Image, Button, InputNumber, Table, Space, Divider, message, Empty } from 'antd';
import { DeleteOutlined, HeartOutlined, ShoppingOutlined } from '@ant-design/icons';
import { useNavigate } from 'umi';

const CartPage = () => {
  const navigate = useNavigate();

  const cartItems = [
    {
      id: 1,
      name: 'Premium Wireless Headphones',
      price: 99.99,
      quantity: 2,
      image: 'https://via.placeholder.com/100?text=Product',
      inStock: true,
    },
    {
      id: 2,
      name: 'Smart Watch Series 7',
      price: 349.99,
      quantity: 1,
      image: 'https://via.placeholder.com/100?text=Watch',
      inStock: true,
    },
  ];

  const columns = [
    {
      title: 'Product',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: any) => (
        <Space>
          <Image src={record.image} width={80} height={80} />
          <div>
            <div style={{ fontWeight: 500 }}>{name}</div>
            <div style={{ color: record.inStock ? '#067D62' : '#C7511F', fontSize: 12 }}>
              {record.inStock ? 'In Stock' : 'Out of Stock'}
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
        <InputNumber min={1} max={10} defaultValue={quantity} onChange={() => message.success('Cart updated')} />
      ),
    },
    {
      title: 'Subtotal',
      key: 'subtotal',
      render: (_: any, record: any) => (
        <span style={{ fontSize: 16, fontWeight: 600, color: '#B12704' }}>
          ${(record.price * record.quantity).toFixed(2)}
        </span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          <Button type="link" icon={<HeartOutlined />}>Save</Button>
          <Button type="link" danger icon={<DeleteOutlined />} onClick={() => handleRemove(record.id)}>
            Remove
          </Button>
        </Space>
      ),
    },
  ];

  const handleRemove = (id: number) => {
    message.success('Item removed from cart');
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 10.00;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  if (cartItems.length === 0) {
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

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', padding: '40px 24px' }}>
      <h1 style={{ marginBottom: 24 }}>Shopping Cart ({cartItems.length} items)</h1>
      
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
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Subtotal ({cartItems.length} items)</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Shipping</span>
                <span>${shipping.toFixed(2)}</span>
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
