/**
 * SAFE API RESPONSE HANDLING
 * Use pattern: const data = response?.data?.data || response?.data || [];
 * Use pattern: const total = response?.data?.meta?.total || response?.meta?.total || 0;
 */
import { ProTable } from '@ant-design/pro-components';
import type { ProColumns } from '@ant-design/pro-components';
import { 
  Button, 
  Space, 
  Tag, 
  Modal, 
  Descriptions, 
  Avatar, 
  message, 
  Tabs, 
  Card, 
  Row, 
  Col, 
  Statistic, 
  Progress, 
  Timeline,
  Badge,
  Tooltip,
  Form,
  Input,
  Select,
  Upload,
  Steps,
  Alert,
  Typography,
  List,
  Image,
  Divider,
  Spin,
  Empty
} from 'antd';
import { 
  EyeOutlined, 
  CheckCircleOutlined, 
  CloseCircleOutlined, 
  StopOutlined,
  UserAddOutlined,
  ShopOutlined,
  FileTextOutlined,
  CheckOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  UploadOutlined,
  EditOutlined,
  DeleteOutlined,
  DownloadOutlined,
  MailOutlined,
  PhoneOutlined,
  GlobalOutlined,
  TeamOutlined,
  BankOutlined,
  SafetyCertificateOutlined,
  VerifiedOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { vendorAPI } from '@/services/api';
import type { Vendor, VendorDocument } from '@/services/api/vendors';

const { Title, Text, Paragraph } = Typography;
const { Step } = Steps;
const { TabPane } = Tabs;
const { TextArea } = Input;

const AdminVendorOnboarding = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [vendorDocuments, setVendorDocuments] = useState<VendorDocument[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const statusColors = {
    draft: 'default',
    submitted: 'processing',
    under_review: 'warning',
    approved: 'success',
    rejected: 'error',
    suspended: 'volcano',
    inactive: 'default',
  };

  const verificationColors = {
    unverified: 'default',
    pending: 'processing',
    verified: 'success',
    failed: 'error',
    expired: 'warning',
  };

  const onboardingSteps = [
    { key: 'business_info', title: 'Business Information', icon: <ShopOutlined /> },
    { key: 'legal_documents', title: 'Legal Documents', icon: <FileTextOutlined /> },
    { key: 'financial_info', title: 'Financial Information', icon: <BankOutlined /> },
    { key: 'verification', title: 'Verification', icon: <SafetyCertificateOutlined /> },
    { key: 'approval', title: 'Final Approval', icon: <VerifiedOutlined /> },
  ];

  useEffect(() => {
    loadVendors();
  }, [searchText, statusFilter]);

  useEffect(() => {
    if (selectedVendor) {
      loadVendorDocuments(selectedVendor.id);
    }
  }, [selectedVendor]);

  const loadVendors = async () => {
    setLoading(true);
    try {
      // Using directory search since there's no direct admin list method
      const response = await vendorAPI.directory.search({
        searchTerm: searchText || undefined,
        businessCategories: statusFilter !== 'all' ? [statusFilter] : undefined,
        limit: 100,
      });
      
      // SAFE API RESPONSE HANDLING
      const vendorsData = response?.data?.data?.items || response?.data?.items || response?.data || [];
      setVendors(Array.isArray(vendorsData) ? vendorsData : []);
    } catch (error) {
      console.error('Failed to load vendors:', error);
      message.error('Failed to load vendors');
    } finally {
      setLoading(false);
    }
  };

  const loadVendorDocuments = async (vendorId: string) => {
    try {
      // Note: This would need to be adapted based on actual admin API
      // For now, we'll show empty documents
      setVendorDocuments([]);
    } catch (error) {
      console.error('Failed to load vendor documents:', error);
    }
  };

  const handleApprove = async (vendorId: string) => {
    Modal.confirm({
      title: 'Approve Vendor',
      content: 'Are you sure you want to approve this vendor? They will gain access to the platform.',
      onOk: async () => {
        try {
          await vendorAPI.verify(vendorId, {
            verificationNotes: 'Approved by admin',
          });
          message.success('Vendor approved successfully');
          loadVendors();
          if (selectedVendor?.id === vendorId) {
            setSelectedVendor(null);
            setDrawerVisible(false);
          }
        } catch (error) {
          console.error('Failed to approve vendor:', error);
          message.error('Failed to approve vendor');
        }
      },
    });
  };

  const handleReject = async (vendorId: string) => {
    Modal.confirm({
      title: 'Reject Vendor',
      content: (
        <Form layout="vertical">
          <Form.Item
            name="rejectionReason"
            label="Rejection Reason"
            rules={[{ required: true, message: 'Please provide a reason for rejection' }]}
          >
            <TextArea rows={4} placeholder="Please specify the reason for rejection..." />
          </Form.Item>
        </Form>
      ),
      onOk: async (close) => {
        try {
          await vendorAPI.reject(vendorId, {
            rejectionReason: 'Application does not meet requirements',
          });
          message.success('Vendor rejected');
          loadVendors();
          if (selectedVendor?.id === vendorId) {
            setSelectedVendor(null);
            setDrawerVisible(false);
          }
          close();
        } catch (error) {
          console.error('Failed to reject vendor:', error);
          message.error('Failed to reject vendor');
        }
      },
    });
  };

  const handleSuspend = async (vendorId: string) => {
    Modal.confirm({
      title: 'Suspend Vendor',
      content: 'Are you sure you want to suspend this vendor? They will lose access to the platform.',
      onOk: async () => {
        try {
          await vendorAPI.toggleStatus(vendorId, 'suspended');
          message.success('Vendor suspended');
          loadVendors();
          if (selectedVendor?.id === vendorId) {
            setSelectedVendor(null);
            setDrawerVisible(false);
          }
        } catch (error) {
          console.error('Failed to suspend vendor:', error);
          message.error('Failed to suspend vendor');
        }
      },
    });
  };

  const handleReactivate = async (vendorId: string) => {
    try {
      await vendorAPI.toggleStatus(vendorId, 'approved');
      message.success('Vendor reactivated');
      loadVendors();
    } catch (error) {
      console.error('Failed to reactivate vendor:', error);
      message.error('Failed to reactivate vendor');
    }
  };

  const getOnboardingProgress = (vendor: Vendor) => {
    if (!vendor.onboardingSteps) return 0;
    const completedSteps = Object.values(vendor.onboardingSteps).filter(Boolean).length;
    return (completedSteps / onboardingSteps.length) * 100;
  };

  const getCurrentOnboardingStep = (vendor: Vendor) => {
    if (!vendor.onboardingSteps) return 0;
    const steps = vendor.onboardingSteps;
    
    if (!steps.business_info) return 0;
    if (!steps.legal_documents) return 1;
    if (!steps.financial_info) return 2;
    if (!steps.verification) return 3;
    if (!steps.approval) return 4;
    return 5;
  };

  const getVendorStats = () => {
    const stats = {
      total: vendors.length,
      pending: vendors.filter(v => v.status === 'submitted' || v.status === 'under_review').length,
      approved: vendors.filter(v => v.status === 'approved').length,
      rejected: vendors.filter(v => v.status === 'rejected').length,
      suspended: vendors.filter(v => v.status === 'suspended').length,
    };
    return stats;
  };

  const columns: ProColumns<Vendor>[] = [
    {
      title: 'Business Name',
      dataIndex: 'businessName',
      key: 'businessName',
      width: 200,
      render: (text, record) => (
        <div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Avatar 
              size="small" 
              src={record.logoUrl} 
              icon={<ShopOutlined />} 
              style={{ marginRight: 8 }}
            />
            <Text strong>{text}</Text>
          </div>
          {record.legalName && record.legalName !== text && (
            <Text type="secondary" style={{ fontSize: 12 }}>
              Legal: {record.legalName}
            </Text>
          )}
        </div>
      ),
    },
    {
      title: 'Business Type',
      dataIndex: 'businessType',
      key: 'businessType',
      width: 120,
      render: (type) => (
        <Tag>{type?.replace('_', ' ')?.toUpperCase()}</Tag>
      ),
    },
    {
      title: 'Contact',
      key: 'contact',
      width: 200,
      render: (_, record) => (
        <div>
          <div style={{ fontSize: 12 }}>
            <MailOutlined style={{ marginRight: 4 }} />
            {record.businessEmail}
          </div>
          {record.businessPhone && (
            <div style={{ fontSize: 12 }}>
              <PhoneOutlined style={{ marginRight: 4 }} />
              {record.businessPhone}
            </div>
          )}
          {record.website && (
            <div style={{ fontSize: 12 }}>
              <GlobalOutlined style={{ marginRight: 4 }} />
              <a href={record.website} target="_blank" rel="noopener noreferrer">
                Website
              </a>
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      filters: [
        { text: 'Draft', value: 'draft' },
        { text: 'Submitted', value: 'submitted' },
        { text: 'Under Review', value: 'under_review' },
        { text: 'Approved', value: 'approved' },
        { text: 'Rejected', value: 'rejected' },
        { text: 'Suspended', value: 'suspended' },
      ],
      render: (status) => (
        <Tag color={statusColors[status as keyof typeof statusColors]}>
          {status?.replace('_', ' ')?.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Verification',
      dataIndex: 'verificationStatus',
      key: 'verificationStatus',
      width: 120,
      render: (status) => (
        <Tag color={verificationColors[status as keyof typeof verificationColors]}>
          {status?.replace('_', ' ')?.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Onboarding',
      key: 'onboarding',
      width: 150,
      render: (_, record) => {
        const progress = getOnboardingProgress(record);
        const isComplete = record.isOnboardingComplete;
        return (
          <div>
            <Progress 
              percent={progress} 
              size="small" 
              status={isComplete ? 'success' : 'active'}
              showInfo={false}
            />
            <Text style={{ fontSize: 11 }}>
              {isComplete ? 'Complete' : `${Math.round(progress)}% complete`}
            </Text>
          </div>
        );
      },
    },
    {
      title: 'Joined',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 100,
      render: (date) => dayjs(date).format('MMM DD, YYYY'),
      sorter: true,
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      width: 280,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="View Details">
            <Button 
              type="link" 
              icon={<EyeOutlined />} 
              onClick={() => {
                setSelectedVendor(record);
                setDrawerVisible(true);
              }}
            >
              View
            </Button>
          </Tooltip>
          
          {(record.status === 'submitted' || record.status === 'under_review') && (
            <>
              <Tooltip title="Approve Vendor">
                <Button 
                  type="link" 
                  icon={<CheckCircleOutlined />} 
                  style={{ color: '#52c41a' }}
                  onClick={() => handleApprove(record.id)}
                >
                  Approve
                </Button>
              </Tooltip>
              <Tooltip title="Reject Application">
                <Button 
                  type="link" 
                  danger 
                  icon={<CloseCircleOutlined />} 
                  onClick={() => handleReject(record.id)}
                >
                  Reject
                </Button>
              </Tooltip>
            </>
          )}
          
          {record.status === 'approved' && (
            <Tooltip title="Suspend Vendor">
              <Button 
                type="link" 
                danger 
                icon={<StopOutlined />} 
                onClick={() => handleSuspend(record.id)}
              >
                Suspend
              </Button>
            </Tooltip>
          )}
          
          {record.status === 'suspended' && (
            <Tooltip title="Reactivate Vendor">
              <Button 
                type="link" 
                icon={<CheckOutlined />}
                style={{ color: '#52c41a' }}
                onClick={() => handleReactivate(record.id)}
              >
                Reactivate
              </Button>
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  const filteredVendors = vendors.filter(vendor => {
    if (activeTab === 'all') return true;
    if (activeTab === 'pending') return vendor.status === 'submitted' || vendor.status === 'under_review';
    if (activeTab === 'approved') return vendor.status === 'approved';
    if (activeTab === 'rejected') return vendor.status === 'rejected';
    if (activeTab === 'suspended') return vendor.status === 'suspended';
    return true;
  });

  const stats = getVendorStats();

  const renderVendorDetails = () => {
    if (!selectedVendor) return null;

    const currentStep = getCurrentOnboardingStep(selectedVendor);

    return (
      <Tabs defaultActiveKey="overview">
        <TabPane tab="Overview" key="overview">
          <Descriptions bordered column={2} style={{ marginBottom: 24 }}>
            <Descriptions.Item label="Business Name">{selectedVendor.businessName}</Descriptions.Item>
            <Descriptions.Item label="Legal Name">{selectedVendor.legalName || 'N/A'}</Descriptions.Item>
            <Descriptions.Item label="Business Type">
              <Tag>{selectedVendor.businessType?.replace('_', ' ')?.toUpperCase()}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Registration Number">
              {selectedVendor.businessRegistrationNumber || 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label="Email">{selectedVendor.businessEmail}</Descriptions.Item>
            <Descriptions.Item label="Phone">{selectedVendor.businessPhone || 'N/A'}</Descriptions.Item>
            <Descriptions.Item label="Website">
              {selectedVendor.website ? (
                <a href={selectedVendor.website} target="_blank" rel="noopener noreferrer">
                  {selectedVendor.website}
                </a>
              ) : 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label="Tax ID">{selectedVendor.taxIdentificationNumber || 'N/A'}</Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag color={statusColors[selectedVendor.status]}>
                {selectedVendor.status?.replace('_', ' ')?.toUpperCase()}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Verification">
              <Tag color={verificationColors[selectedVendor.verificationStatus]}>
                {selectedVendor.verificationStatus?.replace('_', ' ')?.toUpperCase()}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Joined" span={2}>
              {dayjs(selectedVendor.createdAt).format('MMMM DD, YYYY [at] HH:mm')}
            </Descriptions.Item>
          </Descriptions>

          {selectedVendor.description && (
            <Card title="Business Description" style={{ marginBottom: 24 }}>
              <Paragraph>{selectedVendor.description}</Paragraph>
            </Card>
          )}

          {selectedVendor.businessCategories && selectedVendor.businessCategories.length > 0 && (
            <Card title="Business Categories" style={{ marginBottom: 24 }}>
              <Space wrap>
                {selectedVendor.businessCategories.map((category, index) => (
                  <Tag key={index} color="blue">{category}</Tag>
                ))}
              </Space>
            </Card>
          )}
        </TabPane>

        <TabPane tab="Onboarding Progress" key="onboarding">
          <Card title="Onboarding Steps" style={{ marginBottom: 24 }}>
            <Steps direction="vertical" current={currentStep}>
              {onboardingSteps.map((step, index) => (
                <Step
                  key={step.key}
                  title={step.title}
                  icon={step.icon}
                  status={
                    index < currentStep ? 'finish' : 
                    index === currentStep ? 'process' : 
                    'wait'
                  }
                  description={
                    selectedVendor.onboardingSteps?.[step.key] ? 
                    'Completed' : 
                    'Pending'
                  }
                />
              ))}
            </Steps>
          </Card>

          {selectedVendor.verificationNotes && (
            <Card title="Verification Notes">
              <Paragraph>{selectedVendor.verificationNotes}</Paragraph>
            </Card>
          )}
        </TabPane>

        <TabPane tab="Documents" key="documents">
          <Card title="Uploaded Documents">
            {vendorDocuments.length === 0 ? (
              <Empty description="No documents uploaded yet" />
            ) : (
              <List
                dataSource={vendorDocuments}
                renderItem={(doc) => (
                  <List.Item
                    actions={[
                      <Button icon={<DownloadOutlined />} size="small">
                        Download
                      </Button>
                    ]}
                  >
                    <List.Item.Meta
                      avatar={<FileTextOutlined />}
                      title={doc.documentName}
                      description={`${doc.documentType?.replace('_', ' ')?.toUpperCase()} | ${doc.status?.toUpperCase()}`}
                    />
                  </List.Item>
                )}
              />
            )}
          </Card>
        </TabPane>
      </Tabs>
    );
  };

  return (
    <div style={{ padding: 24, backgroundColor: '#f5f5f5' }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={2}>
          <UserAddOutlined style={{ marginRight: 8 }} />
          Vendor Onboarding & Management
        </Title>
        <Paragraph type="secondary">
          Manage vendor applications, onboarding process, and approvals
        </Paragraph>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Vendors"
              value={stats.total}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Pending Review"
              value={stats.pending}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
            {stats.pending > 0 && (
              <Badge
                status="processing"
                text="Requires attention"
                style={{ fontSize: 12 }}
              />
            )}
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Approved"
              value={stats.approved}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Rejected/Suspended"
              value={stats.rejected + stats.suspended}
              prefix={<ExclamationCircleOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Alerts */}
      {stats.pending > 0 && (
        <Alert
          message={`${stats.pending} vendor application(s) pending review`}
          description="Please review pending applications to maintain vendor onboarding efficiency."
          type="warning"
          showIcon
          closable
          style={{ marginBottom: 24 }}
        />
      )}

      {/* Main Table */}
      <Card>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab={`All (${stats.total})`} key="all" />
          <TabPane tab={`Pending (${stats.pending})`} key="pending" />
          <TabPane tab={`Approved (${stats.approved})`} key="approved" />
          <TabPane tab={`Rejected (${stats.rejected})`} key="rejected" />
          <TabPane tab={`Suspended (${stats.suspended})`} key="suspended" />
        </Tabs>

        <ProTable<Vendor>
          columns={columns}
          dataSource={filteredVendors}
          loading={loading}
          rowKey="id"
          pagination={{
            defaultPageSize: 20,
            showSizeChanger: true,
            showQuickJumper: true,
          }}
          search={{
            labelWidth: 'auto',
          }}
          headerTitle={
            <Space>
              <Text strong>Vendor Applications</Text>
              <Button 
                icon={<ReloadOutlined />} 
                onClick={loadVendors}
                size="small"
              >
                Refresh
              </Button>
            </Space>
          }
          scroll={{ x: 1400 }}
          toolBarRender={false}
        />
      </Card>

      {/* Details Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Avatar 
              src={selectedVendor?.logoUrl} 
              icon={<ShopOutlined />} 
              style={{ marginRight: 12 }}
            />
            <div>
              <div>{selectedVendor?.businessName}</div>
              <Text type="secondary" style={{ fontSize: 12 }}>
                Vendor Details
              </Text>
            </div>
          </div>
        }
        open={drawerVisible}
        onCancel={() => {
          setDrawerVisible(false);
          setSelectedVendor(null);
        }}
        width={1000}
        footer={null}
        loading={detailsLoading}
      >
        {renderVendorDetails()}
      </Modal>
    </div>
  );
};

export default AdminVendorOnboarding;