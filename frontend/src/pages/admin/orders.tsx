import { ProTable } from '@ant-design/pro-components';
import type { ProColumns } from '@ant-design/pro-components';
import { Tag, Button, Space, Badge, Drawer, Descriptions, Steps, Timeline, message } from 'antd';
import { EyeOutlined, PrinterOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { ORDER_STATUS_COLORS } from '@/config/constants';

interface OrderType {
  id: string;
  orderNumber: string;
  customer: string;
  vendor: string;
  total: number;
  status: string;
  createdAt: string;
  items: number;
  paymentMethod: string;
}

const AdminOrders = () => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderType | null>(null);

  const columns: ProColumns<OrderType>[] = [
    {
      title: 'Order #',
      dataIndex: 'orderNumber',
      key: 'orderNumber',
      fixed: 'left',
      width: 140,
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Customer',
      dataIndex: 'customer',
      key: 'customer',
      width: 180,
      copyable: true,
    },
    {
      title: 'Vendor',
      dataIndex: 'vendor',
      key: 'vendor',
      width: 180,
    },
    {
      title: 'Items',
      dataIndex: 'items',
      key: 'items',
      width: 80,
      align: 'center',
      render: (items) => <Badge count={items} showZero color="#1890ff" />,
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      width: 120,
      render: (total) => `$${total.toFixed(2)}`,
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
      width: 140,
      filters: [
        { text: 'New', value: 'new' },
        { text: 'Confirmed', value: 'confirmed' },
        { text: 'Processing', value: 'in_process' },
        { text: 'Delivered', value: 'delivered' },
        { text: 'Cancelled', value: 'cancelled' },
      ],
      render: (status) => (
        <Tag color={ORDER_STATUS_COLORS[status as keyof typeof ORDER_STATUS_COLORS]}>
          {status.toUpperCase().replace('_', ' ')}
        </Tag>
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

  // Mock data - replace with API call
  const mockData: OrderType[] = [
    {
      id: '1',
      orderNumber: 'ORD-2024-001',
      customer: 'John Doe',
      vendor: 'Tech Store',
      total: 1299.99,
      status: 'new',
      createdAt: '2024-11-04 10:30:00',
      items: 3,
      paymentMethod: 'card',
    },
    {
      id: '2',
      orderNumber: 'ORD-2024-002',
      customer: 'Jane Smith',
      vendor: 'Fashion Hub',
      total: 599.50,
      status: 'confirmed',
      createdAt: '2024-11-04 09:15:00',
      items: 2,
      paymentMethod: 'wallet',
    },
    {
      id: '3',
      orderNumber: 'ORD-2024-003',
      customer: 'Bob Johnson',
      vendor: 'Home Decor',
      total: 2499.00,
      status: 'in_process',
      createdAt: '2024-11-03 15:45:00',
      items: 5,
      paymentMethod: 'cod',
    },
  ];

  return (
    <div>
      <ProTable<OrderType>
        columns={columns}
        dataSource={mockData}
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
                <Tag color={ORDER_STATUS_COLORS[selectedOrder.status as keyof typeof ORDER_STATUS_COLORS]}>
                  {selectedOrder.status.toUpperCase()}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Customer">{selectedOrder.customer}</Descriptions.Item>
              <Descriptions.Item label="Vendor">{selectedOrder.vendor}</Descriptions.Item>
              <Descriptions.Item label="Items">{selectedOrder.items}</Descriptions.Item>
              <Descriptions.Item label="Total">${selectedOrder.total.toFixed(2)}</Descriptions.Item>
              <Descriptions.Item label="Payment Method">{selectedOrder.paymentMethod}</Descriptions.Item>
              <Descriptions.Item label="Date">{selectedOrder.createdAt}</Descriptions.Item>
            </Descriptions>

            <div style={{ marginTop: 24 }}>
              <h3>Order Timeline</h3>
              <Timeline
                items={[
                  {
                    color: 'green',
                    children: 'Order placed - Nov 4, 2024 10:30 AM',
                  },
                  {
                    color: 'blue',
                    children: 'Payment confirmed - Nov 4, 2024 10:31 AM',
                  },
                  {
                    color: 'blue',
                    children: 'Order confirmed by vendor - Nov 4, 2024 11:00 AM',
                  },
                ]}
              />
            </div>

            <div style={{ marginTop: 24 }}>
              <Space>
                <Button type="primary" icon={<CheckCircleOutlined />}>
                  Confirm Order
                </Button>
                <Button>Cancel Order</Button>
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
