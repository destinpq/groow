/**
 * ⚠️ SAFE API RESPONSE HANDLING - ALWAYS USE THIS PATTERN:
 * 
 * const dataArray = response?.data?.data || response?.data || [];
 * const total = response?.data?.meta?.total || response?.meta?.total || response?.total || 0;
 * 
 * Before using .map()/.filter()/.forEach():
 * setItems(Array.isArray(dataArray) ? dataArray : []);
 */

import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Typography,
  Space,
  Tag,
  Progress,
  Input,
  Select,
  DatePicker,
  Modal,
  Form,
  Spin,
  message,
  Tabs,
  Row,
  Col,
  Statistic,
  Alert,
  Timeline,
  Badge,
  Tooltip,
  Divider,
  Upload,
  Drawer,
  List,
  Avatar,
  Empty,
  Switch
} from 'antd';
import {
  SafetyCertificateOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  WarningOutlined,
  FileTextOutlined,
  UploadOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  FilterOutlined,
  DownloadOutlined,
  BellOutlined,
  AuditOutlined,
  BookOutlined,
  GlobalOutlined,
  TeamOutlined,
  CalendarOutlined,
  BarChartOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
// import { complianceAPI } from '../../services/api';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

interface ComplianceRequirement {
  id: string;
  name: string;
  description: string;
  category: 'safety' | 'quality' | 'environmental' | 'financial' | 'data' | 'labor';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'compliant' | 'non-compliant' | 'pending' | 'expired';
  dueDate: string;
  renewalDate?: string;
  assignedTo: string;
  documents: ComplianceDocument[];
  audits: ComplianceAudit[];
  cost: number;
  jurisdiction: string;
  regulator: string;
  lastReviewDate: string;
  nextReviewDate: string;
  automatedChecking: boolean;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

interface ComplianceDocument {
  id: string;
  name: string;
  type: string;
  url: string;
  uploadDate: string;
  expiryDate?: string;
  status: 'valid' | 'expired' | 'pending_review';
}

interface ComplianceAudit {
  id: string;
  date: string;
  type: 'internal' | 'external' | 'regulatory';
  auditor: string;
  result: 'pass' | 'fail' | 'conditional';
  findings: string[];
  recommendations: string[];
  nextAuditDate: string;
}

interface ComplianceMetrics {
  totalRequirements: number;
  compliantCount: number;
  nonCompliantCount: number;
  pendingCount: number;
  expiringSoon: number;
  complianceRate: number;
  riskScore: number;
  totalCost: number;
  upcomingAudits: number;
  overdueTasks: number;
}

interface ComplianceAlert {
  id: string;
  type: 'expiry' | 'audit_due' | 'non_compliance' | 'document_renewal';
  title: string;
  description: string;
  severity: 'info' | 'warning' | 'error';
  requirementId: string;
  dueDate: string;
  acknowledged: boolean;
}

const ComplianceTracking: React.FC = () => {
  const [requirements, setRequirements] = useState<ComplianceRequirement[]>([]);
  const [metrics, setMetrics] = useState<ComplianceMetrics | null>(null);
  const [alerts, setAlerts] = useState<ComplianceAlert[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [editingRequirement, setEditingRequirement] = useState<ComplianceRequirement | null>(null);
  const [selectedRequirement, setSelectedRequirement] = useState<ComplianceRequirement | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [filters, setFilters] = useState({
    category: '',
    status: '',
    priority: '',
    dateRange: null as [dayjs.Dayjs, dayjs.Dayjs] | null
  });

  const [form] = Form.useForm();

  useEffect(() => {
    fetchRequirements();
    fetchMetrics();
    fetchAlerts();
  }, [filters]);

  const fetchRequirements = async () => {
    setLoading(true);
    try {
      // Mock API call - replace with actual complianceAPI.getRequirements(filters)
      const mockRequirements: ComplianceRequirement[] = [
        {
          id: '1',
          name: 'ISO 9001:2015 Quality Management',
          description: 'International standard for quality management systems',
          category: 'quality',
          priority: 'high',
          status: 'compliant',
          dueDate: '2024-06-15',
          renewalDate: '2025-06-15',
          assignedTo: 'quality-team@company.com',
          documents: [
            {
              id: 'd1',
              name: 'ISO 9001 Certificate',
              type: 'certificate',
              url: '/docs/iso9001.pdf',
              uploadDate: '2023-06-15',
              expiryDate: '2025-06-15',
              status: 'valid'
            }
          ],
          audits: [
            {
              id: 'a1',
              date: '2023-05-20',
              type: 'external',
              auditor: 'ISO Certification Body',
              result: 'pass',
              findings: ['Minor documentation updates needed'],
              recommendations: ['Update procedure documents'],
              nextAuditDate: '2024-05-20'
            }
          ],
          cost: 15000,
          jurisdiction: 'Global',
          regulator: 'ISO',
          lastReviewDate: '2024-01-15',
          nextReviewDate: '2024-07-15',
          automatedChecking: true,
          riskLevel: 'medium'
        },
        {
          id: '2',
          name: 'GDPR Data Protection',
          description: 'General Data Protection Regulation compliance',
          category: 'data',
          priority: 'critical',
          status: 'compliant',
          dueDate: '2024-05-25',
          assignedTo: 'privacy-officer@company.com',
          documents: [
            {
              id: 'd2',
              name: 'Data Protection Policy',
              type: 'policy',
              url: '/docs/gdpr-policy.pdf',
              uploadDate: '2024-01-10',
              status: 'valid'
            },
            {
              id: 'd3',
              name: 'Privacy Impact Assessment',
              type: 'assessment',
              url: '/docs/pia.pdf',
              uploadDate: '2024-02-15',
              status: 'valid'
            }
          ],
          audits: [
            {
              id: 'a2',
              date: '2024-03-10',
              type: 'internal',
              auditor: 'Internal Audit Team',
              result: 'pass',
              findings: [],
              recommendations: ['Continue monitoring'],
              nextAuditDate: '2024-09-10'
            }
          ],
          cost: 25000,
          jurisdiction: 'EU',
          regulator: 'Data Protection Authority',
          lastReviewDate: '2024-03-01',
          nextReviewDate: '2024-06-01',
          automatedChecking: true,
          riskLevel: 'high'
        },
        {
          id: '3',
          name: 'OSHA Workplace Safety',
          description: 'Occupational Safety and Health Administration compliance',
          category: 'safety',
          priority: 'high',
          status: 'pending',
          dueDate: '2024-04-30',
          assignedTo: 'safety-manager@company.com',
          documents: [
            {
              id: 'd4',
              name: 'Safety Training Records',
              type: 'records',
              url: '/docs/safety-training.pdf',
              uploadDate: '2024-01-20',
              expiryDate: '2024-12-31',
              status: 'valid'
            }
          ],
          audits: [
            {
              id: 'a3',
              date: '2024-01-15',
              type: 'regulatory',
              auditor: 'OSHA Inspector',
              result: 'conditional',
              findings: ['Emergency exits need clearer marking', 'Safety equipment inventory incomplete'],
              recommendations: ['Update safety signage', 'Complete equipment audit'],
              nextAuditDate: '2024-07-15'
            }
          ],
          cost: 8000,
          jurisdiction: 'US',
          regulator: 'OSHA',
          lastReviewDate: '2024-01-15',
          nextReviewDate: '2024-04-15',
          automatedChecking: false,
          riskLevel: 'high'
        }
      ];
      
      // Apply filters
      let filteredRequirements = mockRequirements;
      if (filters.category) {
        filteredRequirements = filteredRequirements.filter(r => r.category === filters.category);
      }
      if (filters.status) {
        filteredRequirements = filteredRequirements.filter(r => r.status === filters.status);
      }
      if (filters.priority) {
        filteredRequirements = filteredRequirements.filter(r => r.priority === filters.priority);
      }
      
      setRequirements(filteredRequirements);
    } catch (error) {
      message.error('Failed to fetch compliance requirements');
      console.error('Requirements fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMetrics = async () => {
    try {
      // Calculate metrics from requirements data
      const totalRequirements = requirements.length;
      const compliantCount = requirements.filter(r => r.status === 'compliant').length;
      const nonCompliantCount = requirements.filter(r => r.status === 'non-compliant').length;
      const pendingCount = requirements.filter(r => r.status === 'pending').length;
      const expiringSoon = requirements.filter(r => {
        const dueDate = dayjs(r.dueDate);
        return dueDate.diff(dayjs(), 'days') <= 30 && dueDate.isAfter(dayjs());
      }).length;

      setMetrics({
        totalRequirements,
        compliantCount,
        nonCompliantCount,
        pendingCount,
        expiringSoon,
        complianceRate: totalRequirements > 0 ? (compliantCount / totalRequirements) * 100 : 100,
        riskScore: requirements.reduce((score, r) => {
          const riskValue = r.riskLevel === 'critical' ? 4 : r.riskLevel === 'high' ? 3 : r.riskLevel === 'medium' ? 2 : 1;
          return score + (r.status === 'non-compliant' ? riskValue * 2 : riskValue);
        }, 0),
        totalCost: requirements.reduce((sum, r) => sum + r.cost, 0),
        upcomingAudits: requirements.filter(r => {
          return r.audits.some(audit => dayjs(audit.nextAuditDate).diff(dayjs(), 'days') <= 30);
        }).length,
        overdueTasks: requirements.filter(r => dayjs(r.dueDate).isBefore(dayjs())).length
      });
    } catch (error) {
      console.error('Metrics calculation error:', error);
    }
  };

  const fetchAlerts = async () => {
    try {
      // Generate alerts based on requirements
      const mockAlerts: ComplianceAlert[] = [];
      
      requirements.forEach(requirement => {
        const daysUntilDue = dayjs(requirement.dueDate).diff(dayjs(), 'days');
        
        if (daysUntilDue <= 7 && daysUntilDue >= 0) {
          mockAlerts.push({
            id: `alert-${requirement.id}`,
            type: 'expiry',
            title: `Compliance Requirement Expiring Soon`,
            description: `${requirement.name} expires in ${daysUntilDue} days`,
            severity: daysUntilDue <= 3 ? 'error' : 'warning',
            requirementId: requirement.id,
            dueDate: requirement.dueDate,
            acknowledged: false
          });
        }
        
        if (requirement.status === 'non-compliant') {
          mockAlerts.push({
            id: `non-compliant-${requirement.id}`,
            type: 'non_compliance',
            title: 'Non-Compliance Detected',
            description: `${requirement.name} is not compliant`,
            severity: 'error',
            requirementId: requirement.id,
            dueDate: requirement.dueDate,
            acknowledged: false
          });
        }
      });

      setAlerts(mockAlerts);
    } catch (error) {
      console.error('Alerts fetch error:', error);
    }
  };

  const handleCreateRequirement = () => {
    setEditingRequirement(null);
    setModalVisible(true);
    form.resetFields();
  };

  const handleEditRequirement = (requirement: ComplianceRequirement) => {
    setEditingRequirement(requirement);
    setModalVisible(true);
    form.setFieldsValue({
      ...requirement,
      dueDate: dayjs(requirement.dueDate),
      renewalDate: requirement.renewalDate ? dayjs(requirement.renewalDate) : null
    });
  };

  const handleViewRequirement = (requirement: ComplianceRequirement) => {
    setSelectedRequirement(requirement);
    setDrawerVisible(true);
  };

  const handleSubmitRequirement = async (values: any) => {
    try {
      setLoading(true);
      
      const requirementData = {
        ...values,
        dueDate: values.dueDate.format('YYYY-MM-DD'),
        renewalDate: values.renewalDate?.format('YYYY-MM-DD'),
        id: editingRequirement?.id || `req-${Date.now()}`
      };
      
      // Mock API call - replace with actual complianceAPI methods
      if (editingRequirement) {
        // await complianceAPI.updateRequirement(editingRequirement.id, requirementData);
        message.success('Requirement updated successfully');
      } else {
        // await complianceAPI.createRequirement(requirementData);
        message.success('Requirement created successfully');
      }
      
      setModalVisible(false);
      form.resetFields();
      fetchRequirements();
      fetchMetrics();
    } catch (error) {
      message.error('Failed to save requirement');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRequirement = (requirementId: string) => {
    Modal.confirm({
      title: 'Delete Requirement',
      content: 'Are you sure you want to delete this compliance requirement?',
      icon: <ExclamationCircleOutlined />,
      onOk: async () => {
        try {
          // await complianceAPI.deleteRequirement(requirementId);
          message.success('Requirement deleted successfully');
          fetchRequirements();
          fetchMetrics();
        } catch (error) {
          message.error('Failed to delete requirement');
        }
      }
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant': return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      case 'non-compliant': return <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />;
      case 'pending': return <ClockCircleOutlined style={{ color: '#faad14' }} />;
      case 'expired': return <WarningOutlined style={{ color: '#ff7a45' }} />;
      default: return <CheckCircleOutlined />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'success';
      case 'non-compliant': return 'error';
      case 'pending': return 'warning';
      case 'expired': return 'error';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'red';
      case 'high': return 'orange';
      case 'medium': return 'gold';
      case 'low': return 'green';
      default: return 'default';
    }
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'critical': return '#ff4d4f';
      case 'high': return '#ff7a45';
      case 'medium': return '#faad14';
      case 'low': return '#52c41a';
      default: return '#d9d9d9';
    }
  };

  const columns: ColumnsType<ComplianceRequirement> = [
    {
      title: 'Requirement',
      key: 'requirement',
      width: 300,
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <Text strong>{record.name}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {record.description}
          </Text>
          <Space>
            <Tag color={getPriorityColor(record.priority)}>
              {record.priority.toUpperCase()}
            </Tag>
            <Tag>{record.category}</Tag>
            <Tag color={getRiskColor(record.riskLevel)}>
              Risk: {record.riskLevel}
            </Tag>
          </Space>
        </Space>
      )
    },
    {
      title: 'Status',
      key: 'status',
      width: 120,
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <Space>
            {getStatusIcon(record.status)}
            <Tag color={getStatusColor(record.status)}>
              {record.status.replace('_', ' ').toUpperCase()}
            </Tag>
          </Space>
          {record.automatedChecking && (
            <Badge status="processing" text="Auto-monitored" />
          )}
        </Space>
      )
    },
    {
      title: 'Due Date',
      key: 'dueDate',
      width: 150,
      render: (_, record) => {
        const daysUntilDue = dayjs(record.dueDate).diff(dayjs(), 'days');
        const isOverdue = daysUntilDue < 0;
        const isExpiringSoon = daysUntilDue <= 30 && daysUntilDue >= 0;
        
        return (
          <Space direction="vertical" size="small">
            <Text 
              type={isOverdue ? 'danger' : isExpiringSoon ? 'warning' : undefined}
              strong={isOverdue || isExpiringSoon}
            >
              {dayjs(record.dueDate).format('MMM DD, YYYY')}
            </Text>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {isOverdue ? `${Math.abs(daysUntilDue)} days overdue` : 
               isExpiringSoon ? `${daysUntilDue} days remaining` : 
               `${daysUntilDue} days remaining`}
            </Text>
            {record.renewalDate && (
              <Text type="secondary" style={{ fontSize: 11 }}>
                Renewal: {dayjs(record.renewalDate).format('MMM DD, YYYY')}
              </Text>
            )}
          </Space>
        );
      }
    },
    {
      title: 'Assignment & Cost',
      key: 'assignment',
      width: 200,
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <Text style={{ fontSize: 12 }}>
            <TeamOutlined /> {record.assignedTo}
          </Text>
          <Text style={{ fontSize: 12 }}>
            <GlobalOutlined /> {record.jurisdiction}
          </Text>
          <Text strong style={{ fontSize: 12 }}>
            Cost: ${record.cost.toLocaleString()}
          </Text>
          <Text type="secondary" style={{ fontSize: 11 }}>
            Regulator: {record.regulator}
          </Text>
        </Space>
      )
    },
    {
      title: 'Documents',
      key: 'documents',
      width: 100,
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <Badge count={record.documents.length} showZero>
            <FileTextOutlined />
          </Badge>
          {record.documents.some(d => d.status === 'expired') && (
            <Tag color="red">Expired Docs</Tag>
          )}
        </Space>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <Space size="small">
            <Button
              type="link"
              icon={<EyeOutlined />}
              size="small"
              onClick={() => handleViewRequirement(record)}
            >
              View
            </Button>
            <Button
              type="link"
              icon={<EditOutlined />}
              size="small"
              onClick={() => handleEditRequirement(record)}
            >
              Edit
            </Button>
          </Space>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            size="small"
            onClick={() => handleDeleteRequirement(record.id)}
          >
            Delete
          </Button>
        </Space>
      )
    }
  ];

  const renderMetricsCards = () => {
    if (!metrics) return null;

    return (
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Compliance Rate"
              value={metrics.complianceRate}
              precision={1}
              suffix="%"
              prefix={<SafetyCertificateOutlined />}
              valueStyle={{ color: metrics.complianceRate >= 95 ? '#3f8600' : metrics.complianceRate >= 80 ? '#faad14' : '#cf1322' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Requirements"
              value={metrics.totalRequirements}
              prefix={<BookOutlined />}
            />
            <div style={{ marginTop: 8 }}>
              <Text style={{ fontSize: 12, color: '#52c41a' }}>
                Compliant: {metrics.compliantCount}
              </Text>
              <br />
              <Text style={{ fontSize: 12, color: '#ff4d4f' }}>
                Non-compliant: {metrics.nonCompliantCount}
              </Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Risk Score"
              value={metrics.riskScore}
              prefix={<SafetyCertificateOutlined />}
              valueStyle={{ color: metrics.riskScore <= 20 ? '#3f8600' : metrics.riskScore <= 50 ? '#faad14' : '#cf1322' }}
            />
            <Progress
              percent={(metrics.riskScore / 100) * 100}
              showInfo={false}
              strokeColor={metrics.riskScore <= 20 ? '#52c41a' : metrics.riskScore <= 50 ? '#faad14' : '#ff4d4f'}
              size="small"
              style={{ marginTop: 8 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Cost"
              value={metrics.totalCost}
              prefix="$"
              formatter={(value) => `${Number(value).toLocaleString()}`}
            />
            <div style={{ marginTop: 8 }}>
              <Text style={{ fontSize: 12 }}>
                Upcoming audits: {metrics.upcomingAudits}
              </Text>
              <br />
              <Text style={{ fontSize: 12, color: '#ff4d4f' }}>
                Overdue: {metrics.overdueTasks}
              </Text>
            </div>
          </Card>
        </Col>
      </Row>
    );
  };

  const renderAlerts = () => {
    return (
      <Card title="Compliance Alerts" extra={<Badge count={alerts.length} />} style={{ marginBottom: 16 }}>
        <List
          dataSource={alerts}
          renderItem={(alert) => (
            <List.Item
              actions={[
                <Button type="link" size="small">
                  Acknowledge
                </Button>,
                <Button type="link" size="small">
                  View Details
                </Button>
              ]}
            >
              <List.Item.Meta
                avatar={
                  <Avatar
                    icon={
                      alert.severity === 'error' ? <ExclamationCircleOutlined /> :
                      alert.severity === 'warning' ? <WarningOutlined /> : <BellOutlined />
                    }
                    style={{
                      backgroundColor: 
                        alert.severity === 'error' ? '#ff4d4f' :
                        alert.severity === 'warning' ? '#faad14' : '#1890ff'
                    }}
                  />
                }
                title={alert.title}
                description={
                  <Space direction="vertical" size="small">
                    <Text>{alert.description}</Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      Due: {dayjs(alert.dueDate).format('MMM DD, YYYY')}
                    </Text>
                  </Space>
                }
              />
            </List.Item>
          )}
        />
      </Card>
    );
  };

  const renderRequirementDetail = () => {
    if (!selectedRequirement) return null;

    return (
      <Drawer
        title="Compliance Requirement Details"
        placement="right"
        width={600}
        open={drawerVisible}
        onClose={() => setDrawerVisible(false)}
      >
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <Card title="Basic Information">
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Text strong>Name:</Text>
                <br />
                <Text>{selectedRequirement.name}</Text>
              </Col>
              <Col span={12}>
                <Text strong>Category:</Text>
                <br />
                <Tag>{selectedRequirement.category}</Tag>
              </Col>
              <Col span={12}>
                <Text strong>Priority:</Text>
                <br />
                <Tag color={getPriorityColor(selectedRequirement.priority)}>
                  {selectedRequirement.priority}
                </Tag>
              </Col>
              <Col span={12}>
                <Text strong>Status:</Text>
                <br />
                <Tag color={getStatusColor(selectedRequirement.status)}>
                  {selectedRequirement.status}
                </Tag>
              </Col>
              <Col span={24}>
                <Text strong>Description:</Text>
                <br />
                <Paragraph>{selectedRequirement.description}</Paragraph>
              </Col>
            </Row>
          </Card>

          <Card title="Timeline & Assignments">
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Text strong>Due Date:</Text>
                <br />
                <Text>{dayjs(selectedRequirement.dueDate).format('MMM DD, YYYY')}</Text>
              </Col>
              <Col span={12}>
                <Text strong>Assigned To:</Text>
                <br />
                <Text>{selectedRequirement.assignedTo}</Text>
              </Col>
              <Col span={12}>
                <Text strong>Jurisdiction:</Text>
                <br />
                <Text>{selectedRequirement.jurisdiction}</Text>
              </Col>
              <Col span={12}>
                <Text strong>Regulator:</Text>
                <br />
                <Text>{selectedRequirement.regulator}</Text>
              </Col>
              <Col span={12}>
                <Text strong>Cost:</Text>
                <br />
                <Text>${selectedRequirement.cost.toLocaleString()}</Text>
              </Col>
              <Col span={12}>
                <Text strong>Risk Level:</Text>
                <br />
                <Tag color={getRiskColor(selectedRequirement.riskLevel)}>
                  {selectedRequirement.riskLevel}
                </Tag>
              </Col>
            </Row>
          </Card>

          <Card title="Documents">
            <List
              dataSource={selectedRequirement.documents}
              renderItem={(doc) => (
                <List.Item
                  actions={[
                    <Button type="link" icon={<EyeOutlined />} size="small">
                      View
                    </Button>
                  ]}
                >
                  <List.Item.Meta
                    avatar={<FileTextOutlined />}
                    title={doc.name}
                    description={
                      <Space direction="vertical" size="small">
                        <Text style={{ fontSize: 12 }}>Type: {doc.type}</Text>
                        <Text style={{ fontSize: 12 }}>
                          Uploaded: {dayjs(doc.uploadDate).format('MMM DD, YYYY')}
                        </Text>
                        {doc.expiryDate && (
                          <Text style={{ fontSize: 12 }}>
                            Expires: {dayjs(doc.expiryDate).format('MMM DD, YYYY')}
                          </Text>
                        )}
                        <Tag color={doc.status === 'valid' ? 'green' : 'red'}>
                          {doc.status}
                        </Tag>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>

          <Card title="Audit History">
            <Timeline>
              {selectedRequirement.audits.map((audit) => (
                <Timeline.Item
                  key={audit.id}
                  dot={<AuditOutlined />}
                  color={audit.result === 'pass' ? 'green' : audit.result === 'fail' ? 'red' : 'orange'}
                >
                  <Space direction="vertical" size="small">
                    <Text strong>{audit.type.toUpperCase()} Audit</Text>
                    <Text style={{ fontSize: 12 }}>
                      Date: {dayjs(audit.date).format('MMM DD, YYYY')}
                    </Text>
                    <Text style={{ fontSize: 12 }}>Auditor: {audit.auditor}</Text>
                    <Tag color={audit.result === 'pass' ? 'green' : audit.result === 'fail' ? 'red' : 'orange'}>
                      {audit.result.toUpperCase()}
                    </Tag>
                    {audit.findings.length > 0 && (
                      <div>
                        <Text strong style={{ fontSize: 12 }}>Findings:</Text>
                        <ul style={{ margin: '4px 0', paddingLeft: '16px' }}>
                          {audit.findings.map((finding, idx) => (
                            <li key={idx} style={{ fontSize: 12 }}>{finding}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </Space>
                </Timeline.Item>
              ))}
            </Timeline>
          </Card>
        </Space>
      </Drawer>
    );
  };

  const tabItems = [
    {
      key: 'overview',
      label: (
        <Space>
          <BarChartOutlined />
          <span>Overview</span>
        </Space>
      ),
      children: (
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          {renderMetricsCards()}
          {renderAlerts()}
          
          <Card title="Compliance Requirements" extra={
            <Space>
              <Button icon={<DownloadOutlined />} size="small">
                Export Report
              </Button>
              <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateRequirement}>
                Add Requirement
              </Button>
            </Space>
          }>
            <Space style={{ marginBottom: 16 }}>
              <Select
                placeholder="Filter by category"
                style={{ width: 150 }}
                allowClear
                value={filters.category}
                onChange={(value) => setFilters({ ...filters, category: value || '' })}
              >
                <Option value="safety">Safety</Option>
                <Option value="quality">Quality</Option>
                <Option value="environmental">Environmental</Option>
                <Option value="financial">Financial</Option>
                <Option value="data">Data</Option>
                <Option value="labor">Labor</Option>
              </Select>
              
              <Select
                placeholder="Filter by status"
                style={{ width: 150 }}
                allowClear
                value={filters.status}
                onChange={(value) => setFilters({ ...filters, status: value || '' })}
              >
                <Option value="compliant">Compliant</Option>
                <Option value="non-compliant">Non-compliant</Option>
                <Option value="pending">Pending</Option>
                <Option value="expired">Expired</Option>
              </Select>
              
              <Select
                placeholder="Filter by priority"
                style={{ width: 150 }}
                allowClear
                value={filters.priority}
                onChange={(value) => setFilters({ ...filters, priority: value || '' })}
              >
                <Option value="critical">Critical</Option>
                <Option value="high">High</Option>
                <Option value="medium">Medium</Option>
                <Option value="low">Low</Option>
              </Select>
            </Space>

            <Table
              columns={columns}
              dataSource={requirements}
              loading={loading}
              rowKey="id"
              pagination={{
                total: requirements.length,
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} requirements`
              }}
              locale={{
                emptyText: (
                  <Empty
                    description="No compliance requirements"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                  >
                    <Button type="primary" onClick={handleCreateRequirement}>
                      Add First Requirement
                    </Button>
                  </Empty>
                )
              }}
            />
          </Card>
        </Space>
      )
    }
  ];

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={2}>
          <SafetyCertificateOutlined style={{ marginRight: 8 }} />
          Compliance Tracking
        </Title>
        <Space>
          <Button icon={<DownloadOutlined />}>
            Download Report
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateRequirement}>
            Add Requirement
          </Button>
        </Space>
      </div>

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
      />

      {/* Create/Edit Modal */}
      <Modal
        title={editingRequirement ? 'Edit Compliance Requirement' : 'Create Compliance Requirement'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={800}
      >
        <Form
          form={form}
          onFinish={handleSubmitRequirement}
          layout="vertical"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Requirement Name"
                rules={[{ required: true, message: 'Please enter requirement name' }]}
              >
                <Input placeholder="e.g., ISO 9001:2015 Certification" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="category"
                label="Category"
                rules={[{ required: true, message: 'Please select category' }]}
              >
                <Select placeholder="Select category">
                  <Option value="safety">Safety</Option>
                  <Option value="quality">Quality</Option>
                  <Option value="environmental">Environmental</Option>
                  <Option value="financial">Financial</Option>
                  <Option value="data">Data Protection</Option>
                  <Option value="labor">Labor</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please enter description' }]}
          >
            <Input.TextArea rows={3} placeholder="Describe the compliance requirement..." />
          </Form.Item>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="priority"
                label="Priority"
                rules={[{ required: true, message: 'Please select priority' }]}
              >
                <Select placeholder="Select priority">
                  <Option value="low">Low</Option>
                  <Option value="medium">Medium</Option>
                  <Option value="high">High</Option>
                  <Option value="critical">Critical</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="riskLevel"
                label="Risk Level"
                rules={[{ required: true, message: 'Please select risk level' }]}
              >
                <Select placeholder="Select risk level">
                  <Option value="low">Low</Option>
                  <Option value="medium">Medium</Option>
                  <Option value="high">High</Option>
                  <Option value="critical">Critical</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="status"
                label="Status"
                rules={[{ required: true, message: 'Please select status' }]}
              >
                <Select placeholder="Select status">
                  <Option value="pending">Pending</Option>
                  <Option value="compliant">Compliant</Option>
                  <Option value="non-compliant">Non-compliant</Option>
                  <Option value="expired">Expired</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="dueDate"
                label="Due Date"
                rules={[{ required: true, message: 'Please select due date' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="renewalDate"
                label="Renewal Date (Optional)"
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="assignedTo"
                label="Assigned To"
                rules={[{ required: true, message: 'Please enter assignee' }]}
              >
                <Input placeholder="team@company.com" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="cost"
                label="Cost ($)"
                rules={[{ required: true, message: 'Please enter cost' }]}
              >
                <Input type="number" placeholder="0" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="jurisdiction"
                label="Jurisdiction"
                rules={[{ required: true, message: 'Please enter jurisdiction' }]}
              >
                <Input placeholder="e.g., US, EU, Global" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="regulator"
                label="Regulator"
                rules={[{ required: true, message: 'Please enter regulator' }]}
              >
                <Input placeholder="e.g., FDA, ISO, OSHA" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="automatedChecking"
            label="Enable Automated Monitoring"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>
                {editingRequirement ? 'Update Requirement' : 'Create Requirement'}
              </Button>
              <Button onClick={() => setModalVisible(false)}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {renderRequirementDetail()}
    </div>
  );
};

export default ComplianceTracking;