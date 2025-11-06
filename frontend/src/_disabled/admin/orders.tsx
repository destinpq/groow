import { ProTable } from '@ant-design/pro-components';
import type { ProColumns } from '@ant-design/pro-components';
import { Tag, Button, Space, Badge, Drawer, Descriptions, Timeline, message, Select } from 'antd';
import { EyeOutlined, PrinterOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useState, useRef } from 'react';
import type { ActionType } from '@ant-design/pro-components';
import { ORDER_STATUS_COLORS } from '@/config/constants';
import { ordersAPI, type Order } from '@/services/api/orders';

const AdminOrders = () => {
  const actionRef = useRef<ActionType>();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      setUpdatingStatus(true);
      await ordersAPI.updateStatus(orderId, newStatus as any);
      message.success('Order status updated successfully');
      actionRef.current?.reload();
      if (selectedOrder?.id === orderId) {
        const updatedOrder = await ordersAPI.getById(orderId);
        setSelectedOrder(updatedOrder);
      }
    } catch (error: any) {
      message.error(error.message || 'Failed to update order status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const columns: ProColumns<Order>[] = [
    {
      title: 'Order #',
      dataIndex: 'orderNumber',
      key: 'orderNumber',
      fixed: 'left',
      width: 140,
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Customer ID',
      dataIndex: 'customerId',
      key: 'customerId',
      width: 180,
      copyable: true,
    },
    {
      title: 'Vendor ID',
      dataIndex: 'vendorId',
      key: 'vendorId',
      width: 180,
    },
    {
      title: 'Items',
      dataIndex: 'items',
      key: 'items',
      width: 80,
      align: 'center',
      render: (_: any, record: Order) => <Badge count={record.items?.length || 0} showZero color="#1890ff" />,
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      width: 120,
      render: (_: any, record: Order) => `$${record.total?.toFixed(2) || '0.00'}`,
      sorter: true,
    },
    {
      title: 'Payment',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
      width: 120,
      filters: [
        { text: 'Card', value: 'card' },
        { text: 'Wallet', value: 'wallet' },
        { text: 'COD', value: 'cod' },
      ],
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 200,
      filters: [
        { text: 'Pending', value: 'pending' },
        { text: 'Confirmed', value: 'confirmed' },
        { text: 'Processing', value: 'processing' },
        { text: 'Shipped', value: 'shipped' },
        { text: 'Delivered', value: 'delivered' },
        { text: 'Cancelled', value: 'cancelled' },
      ],
      render: (_: any, record: Order) => (
        <Select
          value={record.status}
          onChange={(value) => handleStatusChange(record.id, value)}
          loading={updatingStatus}
          style={{ width: 140 }}
        >
          <Select.Option value="pending">
            <Tag color="blue">PENDING</Tag>
          </Select.Option>
          <Select.Option value="confirmed">
            <Tag color="cyan">CONFIRMED</Tag>
          </Select.Option>
          <Select.Option value="processing">
            <Tag color="orange">PROCESSING</Tag>
          </Select.Option>
          <Select.Option value="shipped">
            <Tag color="purple">SHIPPED</Tag>
          </Select.Option>
          <Select.Option value="delivered">
            <Tag color="green">DELIVERED</Tag>
          </Select.Option>
          <Select.Option value="cancelled">
            <Tag color="red">CANCELLED</Tag>
          </Select.Option>
        </Select>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      valueType: 'dateTime',
      sorter: true,
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      width: 180,
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="link" 
            icon={<EyeOutlined />}
            onClick={() => {
              setSelectedOrder(record);
              setDrawerVisible(true);
            }}
          >
            View
          </Button>
          <Button type="link" icon={<PrinterOutlined />}>
            Print
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <ProTable<Order>
        columns={columns}
        actionRef={actionRef}
        request={async (params, sort, filter) => {
          try {
            const { current, pageSize, status, paymentMethod } = params;
            
            const response = await ordersAPI.getAll({
              page: current,
              limit: pageSize,
              status: filter?.status?.[0] as string,
            });

            return {
              data: response.data,
              success: true,
              total: response.total,
            };
          } catch (error) {
            message.error('Failed to load orders');
            return {
              data: [],
              success: false,
              total: 0,
            };
          }
        }}
        rowKey="id"
        pagination={{
          defaultPageSize: 20,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `Total ${total} orders`,
        }}
        search={{
          labelWidth: 'auto',
        }}
        dateFormatter="string"
        headerTitle="Order Management"
        toolBarRender={() => [
          <Button key="export">Export</Button>,
        ]}
        scroll={{ x: 1400 }}
      />

      <Drawer
        title="Order Details"
        placement="right"
        width={720}
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
      >
        {selectedOrder && (
          <div>
            <Descriptions title="Order Information" bordered column={2}>
              <Descriptions.Item label="Order Number">{selectedOrder.orderNumber}</Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={ORDER_STATUS_COLORS[selectedOrder.status as keyof typeof ORDER_STATUS_COLORS] || 'blue'}>
                  {selectedOrder.status?.toUpperCase()}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Customer ID">{selectedOrder.customerId}</Descriptions.Item>
              <Descriptions.Item label="Vendor ID">{selectedOrder.vendorId}</Descriptions.Item>
              <Descriptions.Item label="Items Count">{selectedOrder.items?.length || 0}</Descriptions.Item>
              <Descriptions.Item label="Total">${selectedOrder.total?.toFixed(2)}</Descriptions.Item>
              <Descriptions.Item label="Subtotal">${selectedOrder.subtotal?.toFixed(2)}</Descriptions.Item>
              <Descriptions.Item label="Tax">${selectedOrder.tax?.toFixed(2)}</Descriptions.Item>
              <Descriptions.Item label="Shipping">${selectedOrder.shipping?.toFixed(2)}</Descriptions.Item>
              <Descriptions.Item label="Discount">${selectedOrder.discount?.toFixed(2)}</Descriptions.Item>
              <Descriptions.Item label="Payment Method">{selectedOrder.paymentMethod}</Descriptions.Item>
              <Descriptions.Item label="Payment Status">
                <Tag color={selectedOrder.paymentStatus === 'paid' ? 'green' : 'orange'}>
                  {selectedOrder.paymentStatus?.toUpperCase()}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Date">{new Date(selectedOrder.createdAt).toLocaleString()}</Descriptions.Item>
              {selectedOrder.trackingNumber && (
                <Descriptions.Item label="Tracking Number">{selectedOrder.trackingNumber}</Descriptions.Item>
              )}
            </Descriptions>

            {/* Order Items */}
            <div style={{ marginTop: 24 }}>
              <h3>Order Items</h3>
              {selectedOrder.items?.map((item, index) => (
                <div key={item.id} style={{ 
                  padding: '12px', 
                  background: '#f5f5f5', 
                  marginBottom: 8,
                  borderRadius: 4 
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                      <strong>{item.productName}</strong>
                      <div style={{ color: '#666', fontSize: 12 }}>
                        Qty: {item.quantity} × ${item.price.toFixed(2)}
                      </div>
                    </div>
                    <div style={{ fontWeight: 600 }}>
                      ${item.total.toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Shipping Address */}
            <div style={{ marginTop: 24 }}>
              <h3>Shipping Address</h3>
              <p>
                {selectedOrder.shippingAddress?.firstName} {selectedOrder.shippingAddress?.lastName}<br />
                {selectedOrder.shippingAddress?.address1}<br />
                {selectedOrder.shippingAddress?.address2 && <>{selectedOrder.shippingAddress.address2}<br /></>}
                {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} {selectedOrder.shippingAddress?.zipCode}<br />
                {selectedOrder.shippingAddress?.country}<br />
                Phone: {selectedOrder.shippingAddress?.phone}
              </p>
            </div>

            <div style={{ marginTop: 24 }}>
              <h3>Order Timeline</h3>
              <Timeline
                items={[
                  {
                    color: 'green',
                    children: `Order placed - ${new Date(selectedOrder.createdAt).toLocaleString()}`,
                  },
                  selectedOrder.status !== 'pending' && {
                    color: 'blue',
                    children: `Order ${selectedOrder.status} - ${new Date(selectedOrder.updatedAt).toLocaleString()}`,
                  },
                  selectedOrder.trackingNumber && {
                    color: 'purple',
                    children: `Tracking: ${selectedOrder.trackingNumber}`,
                  },
                ].filter(Boolean) as any}
              />
            </div>

            <div style={{ marginTop: 24 }}>
              <Space>
                <Select
                  value={selectedOrder.status}
                  onChange={(value) => handleStatusChange(selectedOrder.id, value)}
                  loading={updatingStatus}
                  style={{ width: 200 }}
                >
                  <Select.Option value="pending">Pending</Select.Option>
                  <Select.Option value="confirmed">Confirmed</Select.Option>
                  <Select.Option value="processing">Processing</Select.Option>
                  <Select.Option value="shipped">Shipped</Select.Option>
                  <Select.Option value="delivered">Delivered</Select.Option>
                  <Select.Option value="cancelled">Cancelled</Select.Option>
                </Select>
                <Button icon={<PrinterOutlined />}>Print Invoice</Button>
              </Space>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default AdminOrders;
