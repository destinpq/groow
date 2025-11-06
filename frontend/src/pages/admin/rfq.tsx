import { ProTable } from '@ant-design/pro-components';
import type { ProColumns, ActionType } from '@ant-design/pro-components';
import { Button, Space, Tag, Drawer, Descriptions, message, Input } from 'antd';
import { EyeOutlined, MessageOutlined } from '@ant-design/icons';
import { useState, useRef } from 'react';
import { rfqAPI, RFQ } from '@/services/api/rfq';

const AdminRFQ = () => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedRFQ, setSelectedRFQ] = useState<RFQ | null>(null);
  const actionRef = useRef<ActionType>();

  const statusColors = {
    open: 'warning',
    quoted: 'processing',
    closed: 'success',
    cancelled: 'error',
  };

  const columns: ProColumns<RFQ>[] = [
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
      dataIndex: 'customerName',
      key: 'customerName',
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
      render: (budget) => budget ? `$${Number(budget).toLocaleString()}` : 'N/A',
    },
    {
      title: 'Quotes',
      dataIndex: 'quotationCount',
      key: 'quotationCount',
      width: 100,
      align: 'center',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      filters: [
        { text: 'Open', value: 'open' },
        { text: 'Quoted', value: 'quoted' },
        { text: 'Closed', value: 'closed' },
        { text: 'Cancelled', value: 'cancelled' },
      ],
      render: (_: any, record: RFQ) => (
        <Tag color={statusColors[record.status]}>
          {record.status?.toUpperCase()}
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

  return (
    <div>
      <ProTable<RFQ>
        columns={columns}
        actionRef={actionRef}
        request={async (params, sort, filter) => {
          try {
            const response = await rfqAPI.getAll({
              page: params.current || 1,
              limit: params.pageSize || 10,
              status: filter.status?.[0] as any,
            });
            return {
              data: response.data,
              success: true,
              total: response.total,
            };
          } catch (error: any) {
            message.error(error.message || 'Failed to load RFQs');
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
        }}
        search={{
          labelWidth: 'auto',
        }}
        headerTitle="RFQ Management"
        scroll={{ x: 1400 }}
      />

      <Drawer
        title="RFQ Details"
        placement="right"
        open={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        width={600}
      >
        {selectedRFQ && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="RFQ Number">{selectedRFQ.rfqNumber}</Descriptions.Item>
            <Descriptions.Item label="Customer">{selectedRFQ.customerName}</Descriptions.Item>
            <Descriptions.Item label="Title">{selectedRFQ.title}</Descriptions.Item>
            <Descriptions.Item label="Description">{selectedRFQ.description}</Descriptions.Item>
            <Descriptions.Item label="Category">{selectedRFQ.category}</Descriptions.Item>
            <Descriptions.Item label="Quantity">{selectedRFQ.quantity}</Descriptions.Item>
            <Descriptions.Item label="Budget">{selectedRFQ.budget ? `$${selectedRFQ.budget}` : 'N/A'}</Descriptions.Item>
            <Descriptions.Item label="Deadline">{selectedRFQ.deadline || 'N/A'}</Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag color={statusColors[selectedRFQ.status]}>
                {selectedRFQ.status.toUpperCase()}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Quotations">{selectedRFQ.quotationCount}</Descriptions.Item>
            <Descriptions.Item label="Created">{new Date(selectedRFQ.createdAt).toLocaleString()}</Descriptions.Item>
          </Descriptions>
        )}
      </Drawer>
    </div>
  );
};

export default AdminRFQ;
