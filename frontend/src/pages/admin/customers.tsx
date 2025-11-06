import { ProTable } from '@ant-design/pro-components';
import type { ProColumns, ActionType } from '@ant-design/pro-components';
import { Button, Space, Tag, Avatar, message } from 'antd';
import { EyeOutlined, StopOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { customerAPI, Customer } from '@/services/api';
import { useRef } from 'react';

const AdminCustomers = () => {
  const actionRef = useRef<ActionType>();

  const handleSuspend = async (id: string) => {
    try {
      await customerAPI.toggleActive(id);
      message.success('Customer suspended successfully');
      actionRef.current?.reload();
    } catch (error: any) {
      message.error(error.message || 'Failed to suspend customer');
    }
  };

  const handleActivate = async (id: string) => {
    try {
      await customerAPI.toggleActive(id);
      message.success('Customer activated successfully');
      actionRef.current?.reload();
    } catch (error: any) {
      message.error(error.message || 'Failed to activate customer');
    }
  };

  const columns: ProColumns<Customer>[] = [
    {
      title: 'Customer',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      render: (name, record) => (
        <Space>
          <Avatar>{String(name || '?')[0]}</Avatar>
          <div>
            <div>{name}</div>
            <div style={{ fontSize: 12, color: '#999' }}>{record.email}</div>
          </div>
        </Space>
      ),
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
      width: 130,
    },
    {
      title: 'Orders',
      dataIndex: 'ordersCount',
      key: 'ordersCount',
      width: 100,
      align: 'center',
      sorter: true,
    },
    {
      title: 'Total Spent',
      dataIndex: 'totalSpent',
      key: 'totalSpent',
      width: 120,
      render: (spent) => `$${Number(spent || 0).toFixed(2)}`,
      sorter: true,
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 100,
      filters: [
        { text: 'Active', value: true },
        { text: 'Suspended', value: false },
      ],
      render: (isActive) => (
        <Tag color={isActive ? 'success' : 'error'}>
          {isActive ? 'ACTIVE' : 'SUSPENDED'}
        </Tag>
      ),
    },
    {
      title: 'Last Order',
      dataIndex: 'lastOrder',
      key: 'lastOrder',
      width: 120,
    },
    {
      title: 'Joined',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
      valueType: 'date',
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 200,
      render: (_, record) => (
        <Space>
          <Button type="link" icon={<EyeOutlined />}>View</Button>
          {record.isActive ? (
            <Button type="link" danger icon={<StopOutlined />} onClick={() => handleSuspend(record.id)}>
              Suspend
            </Button>
          ) : (
            <Button type="link" icon={<CheckCircleOutlined />} onClick={() => handleActivate(record.id)}>
              Activate
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <ProTable<Customer>
      columns={columns}
      actionRef={actionRef}
      request={async (params, sort, filter) => {
        try {
          const response = await customerAPI.getAll({
            page: params.current || 1,
            limit: params.pageSize || 10,
            search: params.keyword,
            isActive: filter.isActive?.[0] as any,
          });
          return {
            data: response.data,
            success: true,
            total: response.total,
          };
        } catch (error: any) {
          message.error(error.message || 'Failed to load customers');
          return {
            data: [],
            success: false,
            total: 0,
          };
        }
      }}
      rowKey="id"
      search={{
        labelWidth: 'auto',
      }}
      headerTitle="Customer Management"
      pagination={{
        defaultPageSize: 20,
        showSizeChanger: true,
      }}
    />
  );
};

export default AdminCustomers;
