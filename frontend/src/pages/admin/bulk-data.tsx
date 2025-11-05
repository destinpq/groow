import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Table,
  Tag,
  Space,
  Button,
  Statistic,
  Progress,
  Select,
  DatePicker,
  Tabs,
  Alert,
  List,
  Avatar,
  message,
  Spin,
  Modal,
  Form,
  Input,
  InputNumber,
  Upload,
  Switch,
  Tooltip,
  Popconfirm,
  Badge,
  Divider,
  Timeline,
  Empty,
  Dropdown,
  Steps,
  Radio,
  Checkbox,
  Tree,
} from 'antd';
import {
  UploadOutlined,
  DownloadOutlined,
  ImportOutlined,
  ExportOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  FileTextOutlined,
  DatabaseOutlined,
  CloudUploadOutlined,
  CloudDownloadOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  StopOutlined,
  DeleteOutlined,
  EyeOutlined,
  SettingOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  ReloadOutlined,
  CopyOutlined,
  EditOutlined,
  FolderOpenOutlined,
  TableOutlined,
  BarsOutlined,
  LineChartOutlined,
  PieChartOutlined,
  WarningOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons';
import { Line, Column, Pie } from '@ant-design/charts';
import type { ColumnsType } from 'antd/es/table';
import type { UploadProps } from 'antd/es/upload';
import dayjs, { Dayjs } from 'dayjs';
import { 
  bulkDataAPI, 
  ImportJob, 
  ExportJob, 
  BulkOperation, 
  ImportTemplate, 
  ExportTemplate,
  ImportStats,
  ExportStats,
  ImportPreview,
  FieldMapping
} from '../../services/api/bulkData';

const { Title, Text, Paragraph } = Typography;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { Step } = Steps;

const BulkDataPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [importJobs, setImportJobs] = useState<ImportJob[]>([]);
  const [exportJobs, setExportJobs] = useState<ExportJob[]>([]);
  const [bulkOperations, setBulkOperations] = useState<BulkOperation[]>([]);
  const [importTemplates, setImportTemplates] = useState<ImportTemplate[]>([]);
  const [exportTemplates, setExportTemplates] = useState<ExportTemplate[]>([]);
  const [importStats, setImportStats] = useState<ImportStats | null>(null);
  const [exportStats, setExportStats] = useState<ExportStats | null>(null);
  
  const [activeTab, setActiveTab] = useState('imports');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>([
    dayjs().subtract(7, 'days'),
    dayjs(),
  ]);

  // Modals
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [bulkOpModalOpen, setBulkOpModalOpen] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [templateModalOpen, setTemplateModalOpen] = useState(false);

  // Forms and data
  const [importForm] = Form.useForm();
  const [exportForm] = Form.useForm();
  const [bulkOpForm] = Form.useForm();
  const [templateForm] = Form.useForm();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importPreview, setImportPreview] = useState<ImportPreview | null>(null);
  const [fieldMapping, setFieldMapping] = useState<FieldMapping[]>([]);
  const [currentStep, setCurrentStep] = useState(0);

  // Load data
  useEffect(() => {
    loadData();
  }, [activeTab, selectedStatus, dateRange]);

  const loadData = async () => {
    setLoading(true);
    try {
      const filters = {
        status: selectedStatus !== 'all' ? (selectedStatus as 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled') : undefined,
        startDate: dateRange[0].format('YYYY-MM-DD'),
        endDate: dateRange[1].format('YYYY-MM-DD'),
      };

      if (activeTab === 'imports') {
        const [jobsResponse, templatesResponse, statsResponse] = await Promise.all([
          bulkDataAPI.getImportJobs(filters, { page: 1, limit: 50 }),
          bulkDataAPI.getImportTemplates(),
          bulkDataAPI.getImportStats({ 
            start: dateRange[0].format('YYYY-MM-DD'), 
            end: dateRange[1].format('YYYY-MM-DD') 
          }),
        ]);
        setImportJobs(jobsResponse.jobs);
        setImportTemplates(templatesResponse);
        setImportStats(statsResponse);
      } else if (activeTab === 'exports') {
        const [jobsResponse, templatesResponse, statsResponse] = await Promise.all([
          bulkDataAPI.getExportJobs(filters, { page: 1, limit: 50 }),
          bulkDataAPI.getExportTemplates(),
          bulkDataAPI.getExportStats({ 
            start: dateRange[0].format('YYYY-MM-DD'), 
            end: dateRange[1].format('YYYY-MM-DD') 
          }),
        ]);
        setExportJobs(jobsResponse.jobs);
        setExportTemplates(templatesResponse);
        setExportStats(statsResponse);
      } else if (activeTab === 'bulk-ops') {
        const opsResponse = await bulkDataAPI.getBulkOperations(filters, { page: 1, limit: 50 });
        setBulkOperations(opsResponse.operations);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      message.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    setSelectedFile(file);
    try {
      const preview = await bulkDataAPI.previewImport(file, {
        hasHeader: true,
        delimiter: ',',
        encoding: 'utf-8',
      });
      setImportPreview(preview);
      setFieldMapping(preview.detectedMapping);
      setPreviewModalOpen(true);
    } catch (error) {
      console.error('Error previewing file:', error);
      message.error('Failed to preview file');
    }
    return false; // Prevent upload
  };

  const handleImportCreate = async (values: any) => {
    if (!selectedFile) {
      message.error('Please select a file to import');
      return;
    }

    try {
      setLoading(true);
      const job = await bulkDataAPI.createImportJob({
        title: values.title,
        type: values.type,
        file: selectedFile,
        settings: {
          hasHeader: values.hasHeader,
          delimiter: values.delimiter || ',',
          encoding: values.encoding || 'utf-8',
          skipEmptyRows: values.skipEmptyRows,
          updateExisting: values.updateExisting,
          createMissing: values.createMissing,
          skipDuplicates: values.skipDuplicates,
          batchSize: values.batchSize || 100,
          mapping: fieldMapping,
          validation: {
            required: [],
            unique: [],
            format: {},
            range: {},
            enum: {},
            custom: {},
          },
          defaultValues: {},
        },
      });

      message.success('Import job created successfully');
      setImportModalOpen(false);
      setPreviewModalOpen(false);
      importForm.resetFields();
      setSelectedFile(null);
      setImportPreview(null);
      setCurrentStep(0);
      loadData();

      // Auto-start the job
      await bulkDataAPI.startImport(job.id);
      message.info('Import job started');
    } catch (error) {
      console.error('Error creating import job:', error);
      message.error('Failed to create import job');
    } finally {
      setLoading(false);
    }
  };

  const handleExportCreate = async (values: any) => {
    try {
      setLoading(true);
      const job = await bulkDataAPI.createExportJob({
        title: values.title,
        type: values.type,
        format: values.format,
        columns: values.columns,
        filters: values.filters || {},
        settings: {
          includeHeaders: values.includeHeaders,
          delimiter: values.delimiter || ',',
          encoding: values.encoding || 'utf-8',
          dateFormat: values.dateFormat || 'YYYY-MM-DD',
          numberFormat: values.numberFormat || '#,##0.00',
          compression: values.compression || 'none',
          maxRecords: values.maxRecords,
        },
      });

      message.success('Export job created successfully');
      setExportModalOpen(false);
      exportForm.resetFields();
      loadData();

      // Auto-start the job
      await bulkDataAPI.startExport(job.id);
      message.info('Export job started');
    } catch (error) {
      console.error('Error creating export job:', error);
      message.error('Failed to create export job');
    } finally {
      setLoading(false);
    }
  };

  const handleJobAction = async (jobId: string, action: string, type: 'import' | 'export') => {
    try {
      setLoading(true);
      if (type === 'import') {
        switch (action) {
          case 'start':
            await bulkDataAPI.startImport(jobId);
            break;
          case 'pause':
            await bulkDataAPI.pauseImport(jobId);
            break;
          case 'resume':
            await bulkDataAPI.resumeImport(jobId);
            break;
          case 'cancel':
            await bulkDataAPI.cancelImport(jobId);
            break;
          case 'delete':
            await bulkDataAPI.deleteImportJob(jobId);
            break;
        }
      } else {
        switch (action) {
          case 'start':
            await bulkDataAPI.startExport(jobId);
            break;
          case 'cancel':
            await bulkDataAPI.cancelExport(jobId);
            break;
          case 'download':
            const blob = await bulkDataAPI.downloadExport(jobId);
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `export-${jobId}-${dayjs().format('YYYY-MM-DD')}.xlsx`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            message.success('Export downloaded successfully');
            return;
          case 'delete':
            await bulkDataAPI.deleteExportJob(jobId);
            break;
        }
      }
      message.success(`Job ${action}ed successfully`);
      loadData();
    } catch (error) {
      console.error(`Error ${action}ing job:`, error);
      message.error(`Failed to ${action} job`);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'blue',
      processing: 'orange',
      completed: 'green',
      failed: 'red',
      cancelled: 'default',
    };
    return colors[status as keyof typeof colors] || 'default';
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      pending: <ClockCircleOutlined />,
      processing: <PlayCircleOutlined />,
      completed: <CheckCircleOutlined />,
      failed: <CloseCircleOutlined />,
      cancelled: <StopOutlined />,
    };
    return icons[status as keyof typeof icons] || <InfoCircleOutlined />;
  };

  const importColumns: ColumnsType<ImportJob> = [
    {
      title: 'Job Info',
      key: 'info',
      render: (_, record) => (
        <div>
          <Text strong>{record.title}</Text>
          <div style={{ fontSize: '12px', color: '#666' }}>
            Type: {record.type} • File: {record.fileName}
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            Size: {(record.fileSize / 1024 / 1024).toFixed(2)} MB
          </div>
        </div>
      ),
      width: 250,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: ImportJob['status']) => (
        <Tag color={getStatusColor(status)} icon={getStatusIcon(status)}>
          {status.toUpperCase()}
        </Tag>
      ),
      filters: [
        { text: 'Pending', value: 'pending' },
        { text: 'Processing', value: 'processing' },
        { text: 'Completed', value: 'completed' },
        { text: 'Failed', value: 'failed' },
        { text: 'Cancelled', value: 'cancelled' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Progress',
      key: 'progress',
      render: (_, record) => (
        <div>
          <Progress 
            percent={record.progress} 
            size="small" 
            status={record.status === 'failed' ? 'exception' : undefined}
          />
          <div style={{ fontSize: '12px', color: '#666' }}>
            {record.processedRecords} / {record.totalRecords} records
          </div>
        </div>
      ),
    },
    {
      title: 'Results',
      key: 'results',
      render: (_, record) => (
        <div>
          <div style={{ fontSize: '12px' }}>
            <Text style={{ color: '#52c41a' }}>✓ {record.successfulRecords}</Text>
            {record.failedRecords > 0 && (
              <Text style={{ color: '#ff4d4f', marginLeft: 8 }}>✗ {record.failedRecords}</Text>
            )}
          </div>
          {record.errors.length > 0 && (
            <Tooltip title={`${record.errors.length} errors`}>
              <Tag color="red">
                {record.errors.length} errors
              </Tag>
            </Tooltip>
          )}
        </div>
      ),
    },
    {
      title: 'Created',
      dataIndex: 'uploadedAt',
      key: 'uploadedAt',
      render: (date: string) => dayjs(date).format('MMM DD, HH:mm'),
      sorter: (a, b) => dayjs(a.uploadedAt).unix() - dayjs(b.uploadedAt).unix(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          {record.status === 'pending' && (
            <Tooltip title="Start">
              <Button
                type="text"
                icon={<PlayCircleOutlined />}
                onClick={() => handleJobAction(record.id, 'start', 'import')}
                style={{ color: '#52c41a' }}
              />
            </Tooltip>
          )}
          {record.status === 'processing' && (
            <>
              <Tooltip title="Pause">
                <Button
                  type="text"
                  icon={<PauseCircleOutlined />}
                  onClick={() => handleJobAction(record.id, 'pause', 'import')}
                  style={{ color: '#faad14' }}
                />
              </Tooltip>
              <Tooltip title="Cancel">
                <Button
                  type="text"
                  icon={<StopOutlined />}
                  onClick={() => handleJobAction(record.id, 'cancel', 'import')}
                  style={{ color: '#ff4d4f' }}
                />
              </Tooltip>
            </>
          )}
          <Tooltip title="View Details">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => {
                // TODO: Show job details modal
              }}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Popconfirm
              title="Are you sure you want to delete this import job?"
              onConfirm={() => handleJobAction(record.id, 'delete', 'import')}
              okText="Delete"
              cancelText="Cancel"
              okButtonProps={{ danger: true }}
            >
              <Button
                type="text"
                icon={<DeleteOutlined />}
                danger
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  const exportColumns: ColumnsType<ExportJob> = [
    {
      title: 'Job Info',
      key: 'info',
      render: (_, record) => (
        <div>
          <Text strong>{record.title}</Text>
          <div style={{ fontSize: '12px', color: '#666' }}>
            Type: {record.type} • Format: {record.format.toUpperCase()}
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {record.columns.length} columns
          </div>
        </div>
      ),
      width: 250,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: ExportJob['status']) => (
        <Tag color={getStatusColor(status)} icon={getStatusIcon(status)}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Progress',
      key: 'progress',
      render: (_, record) => (
        <div>
          <Progress 
            percent={record.progress} 
            size="small" 
            status={record.status === 'failed' ? 'exception' : undefined}
          />
          <div style={{ fontSize: '12px', color: '#666' }}>
            {record.processedRecords} / {record.totalRecords} records
          </div>
        </div>
      ),
    },
    {
      title: 'File Size',
      dataIndex: 'fileSize',
      key: 'fileSize',
      render: (size?: number) => size ? `${(size / 1024 / 1024).toFixed(2)} MB` : '-',
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => dayjs(date).format('MMM DD, HH:mm'),
      sorter: (a, b) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          {record.status === 'pending' && (
            <Tooltip title="Start">
              <Button
                type="text"
                icon={<PlayCircleOutlined />}
                onClick={() => handleJobAction(record.id, 'start', 'export')}
                style={{ color: '#52c41a' }}
              />
            </Tooltip>
          )}
          {record.status === 'processing' && (
            <Tooltip title="Cancel">
              <Button
                type="text"
                icon={<StopOutlined />}
                onClick={() => handleJobAction(record.id, 'cancel', 'export')}
                style={{ color: '#ff4d4f' }}
              />
            </Tooltip>
          )}
          {record.status === 'completed' && record.downloadUrl && (
            <Tooltip title="Download">
              <Button
                type="text"
                icon={<DownloadOutlined />}
                onClick={() => handleJobAction(record.id, 'download', 'export')}
                style={{ color: '#1890ff' }}
              />
            </Tooltip>
          )}
          <Tooltip title="View Details">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => {
                // TODO: Show job details modal
              }}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Popconfirm
              title="Are you sure you want to delete this export job?"
              onConfirm={() => handleJobAction(record.id, 'delete', 'export')}
              okText="Delete"
              cancelText="Cancel"
              okButtonProps={{ danger: true }}
            >
              <Button
                type="text"
                icon={<DeleteOutlined />}
                danger
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  const uploadProps: UploadProps = {
    beforeUpload: handleFileUpload,
    showUploadList: false,
    multiple: false,
    accept: '.csv,.xlsx,.xls,.json,.xml',
  };

  return (
    <Spin spinning={loading} tip="Loading bulk data operations...">
      <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <Title level={3}>
                <DatabaseOutlined style={{ color: '#1890ff' }} /> Bulk Import/Export System
              </Title>
              <Paragraph type="secondary">
                Manage bulk data operations with CSV/Excel support, field mapping, and validation
              </Paragraph>
            </div>
            <Space>
              <Select
                value={selectedStatus}
                onChange={setSelectedStatus}
                style={{ width: 120 }}
              >
                <Select.Option value="all">All Status</Select.Option>
                <Select.Option value="pending">Pending</Select.Option>
                <Select.Option value="processing">Processing</Select.Option>
                <Select.Option value="completed">Completed</Select.Option>
                <Select.Option value="failed">Failed</Select.Option>
              </Select>
              <RangePicker
                value={dateRange}
                onChange={(dates) => dates && setDateRange(dates as [Dayjs, Dayjs])}
              />
              <Button
                icon={<ReloadOutlined />}
                onClick={loadData}
              >
                Refresh
              </Button>
            </Space>
          </div>
        </div>

        {/* Alert */}
        <Alert
          message="Bulk Data Management"
          description="Import/export large datasets with advanced validation, field mapping, and error handling. Support for CSV, Excel, JSON, and XML formats."
          type="info"
          showIcon
          closable
          style={{ marginBottom: 24 }}
        />

        {/* Statistics */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Active Jobs"
                value={(importStats?.activeJobs || 0) + (exportStats?.activeJobs || 0)}
                prefix={<PlayCircleOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Records Imported"
                value={importStats?.totalRecordsImported || 0}
                prefix={<ImportOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Records Exported"
                value={exportStats?.totalRecordsExported || 0}
                prefix={<ExportOutlined />}
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Success Rate"
                value={importStats?.totalRecordsImported ? 
                  ((importStats.totalRecordsImported / (importStats.totalRecordsImported + importStats.totalRecordsFailed)) * 100) : 0
                }
                prefix={<SafetyCertificateOutlined />}
                valueStyle={{ color: '#faad14' }}
                precision={1}
                suffix="%"
              />
            </Card>
          </Col>
        </Row>

        {/* Main Content */}
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <Tabs.TabPane
            tab={
              <span>
                <ImportOutlined />
                Import Jobs ({importJobs.length})
              </span>
            }
            key="imports"
          >
            <Card
              title="Import Jobs"
              extra={
                <Space>
                  <Button
                    type="primary"
                    icon={<UploadOutlined />}
                    onClick={() => setImportModalOpen(true)}
                  >
                    New Import
                  </Button>
                </Space>
              }
            >
              <Table
                columns={importColumns}
                dataSource={importJobs}
                rowKey="id"
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total, range) =>
                    `${range[0]}-${range[1]} of ${total} import jobs`,
                }}
                scroll={{ x: 1200 }}
              />
            </Card>
          </Tabs.TabPane>

          <Tabs.TabPane
            tab={
              <span>
                <ExportOutlined />
                Export Jobs ({exportJobs.length})
              </span>
            }
            key="exports"
          >
            <Card
              title="Export Jobs"
              extra={
                <Space>
                  <Button
                    type="primary"
                    icon={<DownloadOutlined />}
                    onClick={() => setExportModalOpen(true)}
                  >
                    New Export
                  </Button>
                </Space>
              }
            >
              <Table
                columns={exportColumns}
                dataSource={exportJobs}
                rowKey="id"
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total, range) =>
                    `${range[0]}-${range[1]} of ${total} export jobs`,
                }}
                scroll={{ x: 1200 }}
              />
            </Card>
          </Tabs.TabPane>

          <Tabs.TabPane
            tab={
              <span>
                <BarsOutlined />
                Bulk Operations
              </span>
            }
            key="bulk-ops"
          >
            <Card
              title="Bulk Operations"
              extra={
                <Space>
                  <Button
                    type="primary"
                    icon={<SettingOutlined />}
                    onClick={() => setBulkOpModalOpen(true)}
                  >
                    New Operation
                  </Button>
                </Space>
              }
            >
              {bulkOperations.length === 0 ? (
                <Empty description="No bulk operations found" />
              ) : (
                <List
                  dataSource={bulkOperations}
                  renderItem={(operation) => (
                    <List.Item
                      actions={[
                        <Button
                          type="text"
                          icon={<EyeOutlined />}
                          onClick={() => {
                            // TODO: Show operation details
                          }}
                        >
                          View
                        </Button>,
                        <Button
                          type="text"
                          icon={<DeleteOutlined />}
                          danger
                          onClick={() => {
                            // TODO: Delete operation
                          }}
                        >
                          Delete
                        </Button>,
                      ]}
                    >
                      <List.Item.Meta
                        avatar={<Avatar icon={<SettingOutlined />} />}
                        title={
                          <div>
                            <Text strong>{operation.type}</Text>
                            <Tag color={getStatusColor(operation.status)} style={{ marginLeft: 8 }}>
                              {operation.status}
                            </Tag>
                          </div>
                        }
                        description={
                          <div>
                            <div>Entity: {operation.entityType}</div>
                            <div>Progress: {operation.processedItems}/{operation.totalItems}</div>
                            <div>Created: {dayjs(operation.createdAt).format('MMM DD, YYYY HH:mm')}</div>
                          </div>
                        }
                      />
                      <Progress percent={operation.progress} style={{ width: 200 }} />
                    </List.Item>
                  )}
                />
              )}
            </Card>
          </Tabs.TabPane>

          <Tabs.TabPane
            tab={
              <span>
                <TableOutlined />
                Templates
              </span>
            }
            key="templates"
          >
            <Row gutter={16}>
              <Col span={12}>
                <Card title="Import Templates">
                  <List
                    dataSource={importTemplates}
                    renderItem={(template) => (
                      <List.Item
                        actions={[
                          <Button type="text" icon={<DownloadOutlined />}>
                            Download
                          </Button>,
                          <Button type="text" icon={<CopyOutlined />}>
                            Use
                          </Button>,
                          <Button type="text" icon={<EditOutlined />}>
                            Edit
                          </Button>,
                        ]}
                      >
                        <List.Item.Meta
                          avatar={<Avatar icon={<TableOutlined />} />}
                          title={template.name}
                          description={
                            <div>
                              <div>{template.description}</div>
                              <div style={{ fontSize: '12px', color: '#666' }}>
                                Type: {template.type} • Used {template.usageCount} times
                              </div>
                            </div>
                          }
                        />
                      </List.Item>
                    )}
                  />
                </Card>
              </Col>
              <Col span={12}>
                <Card title="Export Templates">
                  <List
                    dataSource={exportTemplates}
                    renderItem={(template) => (
                      <List.Item
                        actions={[
                          <Button type="text" icon={<CopyOutlined />}>
                            Use
                          </Button>,
                          <Button type="text" icon={<EditOutlined />}>
                            Edit
                          </Button>,
                        ]}
                      >
                        <List.Item.Meta
                          avatar={<Avatar icon={<TableOutlined />} />}
                          title={template.name}
                          description={
                            <div>
                              <div>{template.description}</div>
                              <div style={{ fontSize: '12px', color: '#666' }}>
                                Type: {template.type} • {template.columns.length} columns
                              </div>
                            </div>
                          }
                        />
                      </List.Item>
                    )}
                  />
                </Card>
              </Col>
            </Row>
          </Tabs.TabPane>
        </Tabs>

        {/* Import Modal */}
        <Modal
          title="Create Import Job"
          open={importModalOpen}
          onCancel={() => {
            setImportModalOpen(false);
            setCurrentStep(0);
            importForm.resetFields();
            setSelectedFile(null);
          }}
          footer={null}
          width={800}
        >
          <Steps current={currentStep} style={{ marginBottom: 24 }}>
            <Step title="Upload File" />
            <Step title="Configure" />
            <Step title="Map Fields" />
            <Step title="Review" />
          </Steps>

          <Form
            form={importForm}
            layout="vertical"
            onFinish={handleImportCreate}
          >
            {currentStep === 0 && (
              <div>
                <Form.Item label="Select File">
                  <Upload {...uploadProps}>
                    <Button icon={<UploadOutlined />} size="large">
                      Click or drag file to upload
                    </Button>
                  </Upload>
                  <div style={{ marginTop: 8, fontSize: '12px', color: '#666' }}>
                    Supported formats: CSV, Excel (.xlsx, .xls), JSON, XML
                  </div>
                </Form.Item>
                {selectedFile && (
                  <Alert
                    message={`File selected: ${selectedFile.name}`}
                    description={`Size: ${(selectedFile.size / 1024 / 1024).toFixed(2)} MB`}
                    type="success"
                    style={{ marginTop: 16 }}
                  />
                )}
              </div>
            )}

            {currentStep === 1 && (
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="title"
                    label="Job Title"
                    rules={[{ required: true, message: 'Please enter job title' }]}
                  >
                    <Input placeholder="Enter import job title" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="type"
                    label="Data Type"
                    rules={[{ required: true, message: 'Please select data type' }]}
                  >
                    <Select placeholder="Select data type">
                      <Select.Option value="products">Products</Select.Option>
                      <Select.Option value="orders">Orders</Select.Option>
                      <Select.Option value="customers">Customers</Select.Option>
                      <Select.Option value="categories">Categories</Select.Option>
                      <Select.Option value="inventory">Inventory</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="hasHeader" label="Has Header Row" valuePropName="checked">
                    <Switch defaultChecked />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="updateExisting" label="Update Existing Records" valuePropName="checked">
                    <Switch />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="skipDuplicates" label="Skip Duplicates" valuePropName="checked">
                    <Switch defaultChecked />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="createMissing" label="Create Missing References" valuePropName="checked">
                    <Switch />
                  </Form.Item>
                </Col>
              </Row>
            )}

            <div style={{ textAlign: 'right', marginTop: 16 }}>
              <Space>
                {currentStep > 0 && (
                  <Button onClick={() => setCurrentStep(currentStep - 1)}>
                    Previous
                  </Button>
                )}
                {currentStep < 3 && (
                  <Button 
                    type="primary" 
                    onClick={() => setCurrentStep(currentStep + 1)}
                    disabled={currentStep === 0 && !selectedFile}
                  >
                    Next
                  </Button>
                )}
                {currentStep === 3 && (
                  <Button type="primary" htmlType="submit" loading={loading}>
                    Create Import Job
                  </Button>
                )}
              </Space>
            </div>
          </Form>
        </Modal>

        {/* Export Modal */}
        <Modal
          title="Create Export Job"
          open={exportModalOpen}
          onCancel={() => {
            setExportModalOpen(false);
            exportForm.resetFields();
          }}
          footer={null}
          width={600}
        >
          <Form
            form={exportForm}
            layout="vertical"
            onFinish={handleExportCreate}
          >
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="title"
                  label="Job Title"
                  rules={[{ required: true, message: 'Please enter job title' }]}
                >
                  <Input placeholder="Enter export job title" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="type"
                  label="Data Type"
                  rules={[{ required: true, message: 'Please select data type' }]}
                >
                  <Select placeholder="Select data type">
                    <Select.Option value="products">Products</Select.Option>
                    <Select.Option value="orders">Orders</Select.Option>
                    <Select.Option value="customers">Customers</Select.Option>
                    <Select.Option value="categories">Categories</Select.Option>
                    <Select.Option value="inventory">Inventory</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="format"
                  label="Export Format"
                  rules={[{ required: true, message: 'Please select format' }]}
                >
                  <Select placeholder="Select format">
                    <Select.Option value="csv">CSV</Select.Option>
                    <Select.Option value="xlsx">Excel (XLSX)</Select.Option>
                    <Select.Option value="json">JSON</Select.Option>
                    <Select.Option value="xml">XML</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name="columns"
                  label="Columns to Export"
                  rules={[{ required: true, message: 'Please select columns' }]}
                >
                  <Select
                    mode="multiple"
                    placeholder="Select columns to export"
                    options={[
                      { label: 'ID', value: 'id' },
                      { label: 'Name', value: 'name' },
                      { label: 'Description', value: 'description' },
                      { label: 'Price', value: 'price' },
                      { label: 'Stock', value: 'stock' },
                      { label: 'Category', value: 'category' },
                      { label: 'Created Date', value: 'createdAt' },
                      { label: 'Updated Date', value: 'updatedAt' },
                    ]}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="includeHeaders" label="Include Headers" valuePropName="checked">
                  <Switch defaultChecked />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="maxRecords" label="Max Records">
                  <InputNumber
                    style={{ width: '100%' }}
                    placeholder="Leave empty for all"
                    min={1}
                  />
                </Form.Item>
              </Col>
            </Row>
            <div style={{ textAlign: 'right', marginTop: 16 }}>
              <Space>
                <Button onClick={() => {
                  setExportModalOpen(false);
                  exportForm.resetFields();
                }}>
                  Cancel
                </Button>
                <Button type="primary" htmlType="submit" loading={loading}>
                  Create Export Job
                </Button>
              </Space>
            </div>
          </Form>
        </Modal>
      </div>
    </Spin>
  );
};

export default BulkDataPage;