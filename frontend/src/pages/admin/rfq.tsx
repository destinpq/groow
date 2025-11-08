import { ProTable } from '@ant-design/pro-components';
import type { ProColumns } from '@ant-design/pro-components';
import { Button, Space, Tag, Drawer, Descriptions, message, Input } from 'antd';
import { EyeOutlined, MessageOutlined } from '@ant-design/icons';
import { useState } from 'react';

interface RFQType {
  id: string;
  rfqNumber: string;
  customer: string;
  title: string;
  category: string;
  quantity: number;
  budget: string;
  status: 'pending' | 'quoted' | 'approved' | 'rejected';
  quotesCount: number;
  createdAt: string;
}

const AdminRFQ = () => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedRFQ, setSelectedRFQ] = useState<RFQType | null>(null);

  const statusColors = {
    pending: 'warning',
    quoted: 'processing',
    approved: 'success',
    rejected: 'error',
  };

  const columns: ProColumns<RFQType>[] = [
    {
      title: 'RFQ #',
      dataIndex: 'rfqNumber',
      key: 'rfqNumber',
      width: 130,
      fixed: 'left',
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      width: 250,
      ellipsis: true,
    },
    {
      title: 'Customer',
      dataIndex: 'customer',
      key: 'customer',
      width: 150,
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      width: 120,
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 100,
      align: 'center',
    },
    {
      title: 'Budget',
      dataIndex: 'budget',
      key: 'budget',
      width: 120,
    },
    {
      title: 'Quotes',
      dataIndex: 'quotesCount',
      key: 'quotesCount',
      width: 100,
      align: 'center',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      filters: [
        { text: 'Pending', value: 'pending' },
        { text: 'Quoted', value: 'quoted' },
        { text: 'Approved', value: 'approved' },
        { text: 'Rejected', value: 'rejected' },
      ],
      render: (status: string) => (
        <Tag color={statusColors[status as keyof typeof statusColors]}>
          {status?.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
      valueType: 'date',
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      width: 150,
      render: (_, record) => (
        <Space>
          <Button type="link" icon={<EyeOutlined />} onClick={() => {
            setSelectedRFQ(record);
            setDrawerVisible(true);
          }}>
            View
          </Button>
          <Button type="link" icon={<MessageOutlined />}>Messages</Button>
        </Space>
      ),
    },
  ];

  const mockData: RFQType[] = [
    {
      id: '1',
      rfqNumber: 'RFQ-2024-001',
      customer: 'John Doe',
      title: 'Bulk order for office furniture',
      category: 'Furniture',
      quantity: 100,
      budget: '$10,000 - $15,000',
      status: 'pending',
      quotesCount: 3,
      createdAt: '2024-11-04',
    },
    {
      id: '2',
      rfqNumber: 'RFQ-2024-002',
      customer: 'Jane Smith',
      title: 'Electronic components wholesale',
      category: 'Electronics',
      quantity: 500,
      budget: '$25,000+',
      status: 'quoted',
      quotesCount: 7,
      createdAt: '2024-11-03',
    },
  ];

  return (
    <div>
      <ProTable<RFQType>
        columns={columns}
        dataSource={mockData}
        rowKey="id"
        search={{
          labelWidth: 'auto',
        }}
        headerTitle="RFQ Management"
        pagination={{
          defaultPageSize: 20,
        }}
        scroll={{ x: 1200 }}
      />

      <Drawer
        title="RFQ Details"
        placement="right"
        width={720}
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
      >
        {selectedRFQ && (
          <div>
            <Descriptions title="RFQ Information" bordered column={2}>
              <Descriptions.Item label="RFQ Number">{selectedRFQ.rfqNumber}</Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={statusColors[selectedRFQ.status]}>
                  {selectedRFQ.status.toUpperCase()}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Customer" span={2}>{selectedRFQ.customer}</Descriptions.Item>
              <Descriptions.Item label="Title" span={2}>{selectedRFQ.title}</Descriptions.Item>
              <Descriptions.Item label="Category">{selectedRFQ.category}</Descriptions.Item>
              <Descriptions.Item label="Quantity">{selectedRFQ.quantity}</Descriptions.Item>
              <Descriptions.Item label="Budget" span={2}>{selectedRFQ.budget}</Descriptions.Item>
              <Descriptions.Item label="Quotes Received">{selectedRFQ.quotesCount}</Descriptions.Item>
              <Descriptions.Item label="Created">{selectedRFQ.createdAt}</Descriptions.Item>
            </Descriptions>

            <div style={{ marginTop: 24 }}>
              <h4>Requirements Description</h4>
              <p>Looking for high-quality office furniture including desks, chairs, and storage units for a new office setup. Need delivery within 2 weeks.</p>
            </div>

            <div style={{ marginTop: 24 }}>
              <h4>Vendor Quotes ({selectedRFQ.quotesCount})</h4>
              <Space direction="vertical" style={{ width: '100%' }}>
                <div style={{ padding: 16, border: '1px solid #d9d9d9', borderRadius: 4 }}>
                  <div><strong>Tech Furniture Ltd</strong> - $12,500</div>
                  <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>Quoted on 2024-11-04</div>
                </div>
              </Space>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default AdminRFQ;
