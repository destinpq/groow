import { ProTable } from '@ant-design/pro-components';
import type { ProColumns, ActionType } from '@ant-design/pro-components';
import { Button, Space, Tag, Modal, Descriptions, Avatar, message } from 'antd';
import { EyeOutlined, CheckCircleOutlined, CloseCircleOutlined, StopOutlined } from '@ant-design/icons';
import { useState, useRef } from 'react';
import { vendorAPI, Vendor } from '@/services/api';

const AdminVendors = () => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const actionRef = useRef<ActionType>();

  const statusColors = {
    pending: 'warning',
    verified: 'success',
    active: 'success',
    rejected: 'error',
    suspended: 'default',
    inactive: 'default',
  };

  const handleApprove = async (id: string) => {
    Modal.confirm({
      title: 'Approve Vendor',
      content: 'Are you sure you want to approve this vendor?',
      onOk: async () => {
        try {
          await vendorAPI.verify(id);
          message.success('Vendor approved successfully');
          actionRef.current?.reload();
        } catch (error: any) {
          message.error(error.message || 'Failed to approve vendor');
        }
      },
    });
  };

  const handleReject = async (id: string) => {
    Modal.confirm({
      title: 'Reject Vendor',
      content: 'Please provide a reason for rejection:',
      onOk: async () => {
        try {
          await vendorAPI.reject(id, 'Does not meet verification requirements');
          message.success('Vendor rejected');
          actionRef.current?.reload();
        } catch (error: any) {
          message.error(error.message || 'Failed to reject vendor');
        }
      },
    });
  };

  const handleSuspend = async (id: string) => {
    Modal.confirm({
      title: 'Toggle Vendor Status',
      content: 'Are you sure you want to change this vendor\'s active status?',
      onOk: async () => {
        try {
          await vendorAPI.toggleActive(id);
          message.success('Vendor status updated');
          actionRef.current?.reload();
        } catch (error: any) {
          message.error(error.message || 'Failed to update vendor status');
        }
      },
    });
  };

  const columns: ProColumns<Vendor>[] = [
    {
      title: 'Business Name',
      dataIndex: 'businessName',
      key: 'businessName',
      width: 200,
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
      dataIndex: 'verificationStatus',
      key: 'verificationStatus',
      width: 120,
      filters: [
        { text: 'Pending', value: 'pending' },
        { text: 'Verified', value: 'verified' },
        { text: 'Rejected', value: 'rejected' },
      ],
      render: (status) => (
        <Tag color={statusColors[String(status) as keyof typeof statusColors] || 'default'}>
          {String(status || '').toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Products',
      dataIndex: 'productCount',
      key: 'productCount',
      width: 100,
      align: 'center',
      render: (count) => count || 0,
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
          {record.verificationStatus === 'pending' && (
            <>
              <Button type="link" icon={<CheckCircleOutlined />} onClick={() => handleApprove(record.id)}>
                Approve
              </Button>
              <Button type="link" danger icon={<CloseCircleOutlined />} onClick={() => handleReject(record.id)}>
                Reject
              </Button>
            </>
          )}
          {record.verificationStatus === 'verified' && (
            <Button type="link" danger icon={<StopOutlined />} onClick={() => handleSuspend(record.id)}>
              Toggle Status
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <ProTable<Vendor>
        columns={columns}
        actionRef={actionRef}
        request={async (params, sort, filter) => {
          try {
            const response = await vendorAPI.getAll({
              page: params.current || 1,
              limit: params.pageSize || 10,
              search: params.keyword,
              verificationStatus: filter.verificationStatus?.[0] as any,
            });
            return {
              data: response.data,
              success: true,
              total: response.total,
            };
          } catch (error: any) {
            message.error(error.message || 'Failed to load vendors');
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
            <Descriptions.Item label="Email">{selectedVendor.email}</Descriptions.Item>
            <Descriptions.Item label="Phone">{selectedVendor.phone || 'N/A'}</Descriptions.Item>
            <Descriptions.Item label="Business Type">{selectedVendor.businessType}</Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag color={statusColors[selectedVendor.verificationStatus]}>
                {selectedVendor.verificationStatus.toUpperCase()}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Products">{selectedVendor.productCount || 0}</Descriptions.Item>
            <Descriptions.Item label="Orders">{selectedVendor.orderCount || 0}</Descriptions.Item>
            <Descriptions.Item label="Rating">{selectedVendor.rating.toFixed(1)} ({selectedVendor.reviewCount} reviews)</Descriptions.Item>
            <Descriptions.Item label="Created">{new Date(selectedVendor.createdAt).toLocaleDateString()}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default AdminVendors;
