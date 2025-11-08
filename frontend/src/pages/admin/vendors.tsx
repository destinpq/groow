import { ProTable } from '@ant-design/pro-components';
import type { ProColumns } from '@ant-design/pro-components';
import { Button, Space, Tag, Modal, Descriptions, Avatar, message } from 'antd';
import { EyeOutlined, CheckCircleOutlined, CloseCircleOutlined, StopOutlined } from '@ant-design/icons';
import { useState } from 'react';

interface VendorType {
  id: string;
  businessName: string;
  contactPerson: string;
  email: string;
  phone: string;
  status: 'pending' | 'verified' | 'rejected' | 'suspended';
  subscription: string;
  productsCount: number;
  ordersCount: number;
  revenue: number;
  joinedAt: string;
}

const AdminVendors = () => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<VendorType | null>(null);

  const statusColors = {
    pending: 'warning',
    verified: 'success',
    rejected: 'error',
    suspended: 'default',
  };

  const columns: ProColumns<VendorType>[] = [
    {
      title: 'Business Name',
      dataIndex: 'businessName',
      key: 'businessName',
      width: 200,
    },
    {
      title: 'Contact Person',
      dataIndex: 'contactPerson',
      key: 'contactPerson',
      width: 150,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 200,
      copyable: true,
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
      width: 130,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      filters: [
        { text: 'Pending', value: 'pending' },
        { text: 'Verified', value: 'verified' },
        { text: 'Rejected', value: 'rejected' },
        { text: 'Suspended', value: 'suspended' },
      ],
      render: (status) => (
        <Tag color={statusColors[status as keyof typeof statusColors]}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Subscription',
      dataIndex: 'subscription',
      key: 'subscription',
      width: 120,
    },
    {
      title: 'Products',
      dataIndex: 'productsCount',
      key: 'productsCount',
      width: 100,
      align: 'center',
    },
    {
      title: 'Revenue',
      dataIndex: 'revenue',
      key: 'revenue',
      width: 120,
      render: (revenue) => `$${revenue.toFixed(2)}`,
      sorter: true,
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      width: 250,
      render: (_, record) => (
        <Space size="small">
          <Button type="link" icon={<EyeOutlined />} onClick={() => {
            setSelectedVendor(record);
            setDrawerVisible(true);
          }}>
            View
          </Button>
          {record.status === 'pending' && (
            <>
              <Button type="link" icon={<CheckCircleOutlined />} onClick={() => handleApprove(record.id)}>
                Approve
              </Button>
              <Button type="link" danger icon={<CloseCircleOutlined />} onClick={() => handleReject(record.id)}>
                Reject
              </Button>
            </>
          )}
          {record.status === 'verified' && (
            <Button type="link" danger icon={<StopOutlined />} onClick={() => handleSuspend(record.id)}>
              Suspend
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const mockData: VendorType[] = [
    {
      id: '1',
      businessName: 'Tech Solutions Ltd',
      contactPerson: 'John Smith',
      email: 'john@techsolutions.com',
      phone: '+1234567890',
      status: 'pending',
      subscription: 'Premium',
      productsCount: 45,
      ordersCount: 120,
      revenue: 45678.90,
      joinedAt: '2024-11-01',
    },
    {
      id: '2',
      businessName: 'Fashion Hub Inc',
      contactPerson: 'Jane Doe',
      email: 'jane@fashionhub.com',
      phone: '+1234567891',
      status: 'verified',
      subscription: 'Basic',
      productsCount: 89,
      ordersCount: 340,
      revenue: 89456.50,
      joinedAt: '2024-10-15',
    },
  ];

  const handleApprove = (id: string) => {
    Modal.confirm({
      title: 'Approve Vendor',
      content: 'Are you sure you want to approve this vendor?',
      onOk: () => message.success('Vendor approved successfully'),
    });
  };

  const handleReject = (id: string) => {
    Modal.confirm({
      title: 'Reject Vendor',
      content: 'Are you sure you want to reject this vendor?',
      onOk: () => message.success('Vendor rejected'),
    });
  };

  const handleSuspend = (id: string) => {
    Modal.confirm({
      title: 'Suspend Vendor',
      content: 'Are you sure you want to suspend this vendor?',
      onOk: () => message.success('Vendor suspended'),
    });
  };

  return (
    <div>
      <ProTable<VendorType>
        columns={columns}
        dataSource={mockData}
        rowKey="id"
        pagination={{
          defaultPageSize: 20,
          showSizeChanger: true,
        }}
        search={{
          labelWidth: 'auto',
        }}
        headerTitle="Vendor Management"
        scroll={{ x: 1400 }}
      />

      <Modal
        title="Vendor Details"
        open={drawerVisible}
        onCancel={() => setDrawerVisible(false)}
        width={800}
        footer={null}
      >
        {selectedVendor && (
          <Descriptions bordered column={2}>
            <Descriptions.Item label="Business Name">{selectedVendor.businessName}</Descriptions.Item>
            <Descriptions.Item label="Contact Person">{selectedVendor.contactPerson}</Descriptions.Item>
            <Descriptions.Item label="Email">{selectedVendor.email}</Descriptions.Item>
            <Descriptions.Item label="Phone">{selectedVendor.phone}</Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag color={statusColors[selectedVendor.status]}>
                {selectedVendor.status.toUpperCase()}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Subscription">{selectedVendor.subscription}</Descriptions.Item>
            <Descriptions.Item label="Products">{selectedVendor.productsCount}</Descriptions.Item>
            <Descriptions.Item label="Orders">{selectedVendor.ordersCount}</Descriptions.Item>
            <Descriptions.Item label="Revenue">${selectedVendor.revenue.toFixed(2)}</Descriptions.Item>
            <Descriptions.Item label="Joined">{selectedVendor.joinedAt}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default AdminVendors;
