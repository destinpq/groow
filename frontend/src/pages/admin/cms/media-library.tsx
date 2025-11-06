import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Upload,
  Button,
  Space,
  Typography,
  Image,
  Tree,
  Input,
  Modal,
  Form,
  Select,
  Tag,
  Dropdown,
  Empty,
  Progress,
  Statistic,
  Table,
  Checkbox,
  message,
} from 'antd';
import {
  FolderOutlined,
  FileImageOutlined,
  FileTextOutlined,
  FilePdfOutlined,
  FileOutlined,
  UploadOutlined,
  DeleteOutlined,
  DownloadOutlined,
  EyeOutlined,
  CopyOutlined,
  FolderAddOutlined,
  SearchOutlined,
  FilterOutlined,
  MoreOutlined,
} from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd';
import type { MenuProps } from 'antd';
import type { DataNode } from 'antd/es/tree';
import { cmsAPI, CMSMedia } from '@/services/api';

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

const folderTreeData: DataNode[] = [
  {
    title: 'All Media',
    key: 'root',
    icon: <FolderOutlined />,
    children: [
      { title: 'Banners', key: 'Banners', icon: <FolderOutlined /> },
      { title: 'Products', key: 'Products', icon: <FolderOutlined /> },
      { title: 'Categories', key: 'Categories', icon: <FolderOutlined /> },
      { title: 'Branding', key: 'Branding', icon: <FolderOutlined /> },
      { title: 'Documents', key: 'Documents', icon: <FolderOutlined /> },
    ],
  },
];

const MediaLibraryPage: React.FC = () => {
  const [mediaFiles, setMediaFiles] = useState<CMSMedia[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState<string>('root');
  const [selectedFiles, setSelectedFiles] = useState<number[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isUploadModalVisible, setIsUploadModalVisible] = useState(false);
  const [isCreateFolderModalVisible, setIsCreateFolderModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [form] = Form.useForm();

  useEffect(() => {
    loadMedia();
  }, []);

  const loadMedia = async () => {
    try {
      setLoading(true);
      const response = await cmsAPI.media.getAll();
      setMediaFiles(response.data || []);
    } catch (error) {
      message.error('Failed to load media files');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <FileImageOutlined style={{ fontSize: 48, color: '#1890ff' }} />;
      case 'pdf':
        return <FilePdfOutlined style={{ fontSize: 48, color: '#ff4d4f' }} />;
      case 'document':
        return <FileTextOutlined style={{ fontSize: 48, color: '#52c41a' }} />;
      default:
        return <FileOutlined style={{ fontSize: 48, color: '#faad14' }} />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const filteredFiles = mediaFiles.filter(file => {
    const matchesFolder = selectedFolder === 'root' || file.folder === selectedFolder;
    const matchesSearch =
      searchQuery === '' ||
      file.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFolder && matchesSearch;
  });

  const totalSize = mediaFiles.reduce((sum, file) => sum + file.fileSize, 0);
  const usedSpace = totalSize;
  const totalSpace = 10 * 1024 * 1024 * 1024; // 10GB
  const usedPercentage = (usedSpace / totalSpace) * 100;

  const uploadProps: UploadProps = {
    fileList,
    onChange: ({ fileList: newFileList }) => setFileList(newFileList),
    beforeUpload: () => false,
    multiple: true,
  };

  const handleUpload = async () => {
    try {
      const values = await form.validateFields();
      
      for (const file of fileList) {
        if (file.originFileObj) {
          await cmsAPI.media.upload(file.originFileObj);
        }
      }

      message.success('Files uploaded successfully');
      setIsUploadModalVisible(false);
      setFileList([]);
      form.resetFields();
      loadMedia();
    } catch (error) {
      message.error('Failed to upload files');
      console.error(error);
    }
  };

  const handleCreateFolder = () => {
    form.validateFields().then(values => {
      console.log('Create folder:', values);
      setIsCreateFolderModalVisible(false);
      form.resetFields();
    });
  };

  const handleDeleteFiles = async () => {
    try {
      await Promise.all(selectedFiles.map(id => cmsAPI.media.delete(id)));
      message.success('Files deleted successfully');
      setSelectedFiles([]);
      loadMedia();
    } catch (error) {
      message.error('Failed to delete files');
      console.error(error);
    }
  };

  const fileMenuItems = (file: CMSMedia): MenuProps['items'] => [
    {
      key: 'view',
      label: 'View',
      icon: <EyeOutlined />,
    },
    {
      key: 'download',
      label: 'Download',
      icon: <DownloadOutlined />,
    },
    {
      key: 'copy',
      label: 'Copy URL',
      icon: <CopyOutlined />,
      onClick: () => {
        navigator.clipboard.writeText(file.url);
      },
    },
    {
      type: 'divider',
    },
    {
      key: 'delete',
      label: 'Delete',
      icon: <DeleteOutlined />,
      danger: true,
      onClick: () => setMediaFiles(mediaFiles.filter(f => f.id !== file.id)),
    },
  ];

  const columns = [
    {
      title: 'Name',
      dataIndex: 'fileName',
      key: 'fileName',
      render: (text: string, record: CMSMedia) => (
        <Space>
          {record.mimeType?.startsWith('image/') ? (
            <Image src={record.url} width={40} height={40} style={{ objectFit: 'cover' }} />
          ) : (
            getFileIcon(record.mimeType || 'other')
          )}
          <Text>{text}</Text>
        </Space>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'mimeType',
      key: 'mimeType',
      render: (type: string) => <Tag>{type?.split('/')[0]?.toUpperCase() || 'FILE'}</Tag>,
    },
    {
      title: 'Size',
      dataIndex: 'fileSize',
      key: 'fileSize',
      render: (size: number) => formatFileSize(size),
    },
    {
      title: 'Folder',
      dataIndex: 'folder',
      key: 'folder',
    },
    {
      title: 'Uploaded',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: CMSMedia) => (
        <Dropdown menu={{ items: fileMenuItems(record) }} trigger={['click']}>
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={3}>Media Library</Title>
        <Space>
          <Button icon={<FolderAddOutlined />} onClick={() => setIsCreateFolderModalVisible(true)}>
            New Folder
          </Button>
          <Button type="primary" icon={<UploadOutlined />} onClick={() => setIsUploadModalVisible(true)}>
            Upload Files
          </Button>
        </Space>
      </div>

      {/* Storage Stats */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title="Total Files"
              value={mediaFiles.length}
              prefix={<FileOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title="Used Space"
              value={formatFileSize(usedSpace)}
              suffix={`/ ${formatFileSize(totalSpace)}`}
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <div>
              <Text type="secondary">Storage</Text>
              <Progress percent={Number(usedPercentage.toFixed(1))} status="active" />
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={24}>
        {/* Folder Tree */}
        <Col xs={24} lg={6}>
          <Card title="Folders">
            <Tree
              showIcon
              defaultExpandAll
              selectedKeys={[selectedFolder]}
              onSelect={(keys) => setSelectedFolder(keys[0] as string)}
              treeData={folderTreeData}
            />
          </Card>
        </Col>

        {/* File Grid/List */}
        <Col xs={24} lg={18}>
          <Card
            title={
              <Space>
                <Text>Files in: {selectedFolder === 'root' ? 'All Media' : selectedFolder}</Text>
                <Tag>{filteredFiles.length} files</Tag>
              </Space>
            }
            extra={
              <Space>
                {selectedFiles.length > 0 && (
                  <>
                    <Text type="secondary">{selectedFiles.length} selected</Text>
                    <Button danger icon={<DeleteOutlined />} onClick={handleDeleteFiles}>
                      Delete Selected
                    </Button>
                  </>
                )}
                <Search
                  placeholder="Search files..."
                  allowClear
                  style={{ width: 200 }}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Select value={viewMode} onChange={setViewMode} style={{ width: 100 }}>
                  <Option value="grid">Grid</Option>
                  <Option value="list">List</Option>
                </Select>
              </Space>
            }
          >
            {filteredFiles.length === 0 ? (
              <Empty description="No files found" />
            ) : viewMode === 'grid' ? (
              <Row gutter={[16, 16]}>
                {filteredFiles.map(file => (
                  <Col xs={12} sm={8} md={6} lg={4} key={file.id}>
                    <Card
                      hoverable
                      cover={
                        file.mimeType?.startsWith('image/') ? (
                          <Image
                            src={file.url}
                            alt={file.fileName}
                            style={{ height: 150, objectFit: 'cover' }}
                          />
                        ) : (
                          <div style={{ height: 150, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {getFileIcon(file.mimeType || 'other')}
                          </div>
                        )
                      }
                      actions={[
                        <Checkbox
                          checked={selectedFiles.includes(file.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedFiles([...selectedFiles, file.id]);
                            } else {
                              setSelectedFiles(selectedFiles.filter(id => id !== file.id));
                            }
                          }}
                        />,
                        <EyeOutlined key="view" />,
                        <Dropdown menu={{ items: fileMenuItems(file) }} trigger={['click']}>
                          <MoreOutlined key="more" />
                        </Dropdown>,
                      ]}
                    >
                      <Card.Meta
                        title={
                          <Text ellipsis={{ tooltip: file.fileName }} style={{ fontSize: 12 }}>
                            {file.fileName}
                          </Text>
                        }
                        description={
                          <Space direction="vertical" size="small" style={{ width: '100%' }}>
                            <Text type="secondary" style={{ fontSize: 11 }}>
                              {formatFileSize(file.fileSize)}
                            </Text>
                          </Space>
                        }
                      />
                    </Card>
                  </Col>
                ))}
              </Row>
            ) : (
              <Table
                dataSource={filteredFiles}
                columns={columns}
                rowKey="id"
                rowSelection={{
                  selectedRowKeys: selectedFiles,
                  onChange: (keys) => setSelectedFiles(keys as number[]),
                }}
                pagination={{ pageSize: 10 }}
              />
            )}
          </Card>
        </Col>
      </Row>

      {/* Upload Modal */}
      <Modal
        title="Upload Files"
        open={isUploadModalVisible}
        onOk={handleUpload}
        onCancel={() => {
          setIsUploadModalVisible(false);
          setFileList([]);
          form.resetFields();
        }}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="files" label="Select Files">
            <Upload.Dragger {...uploadProps}>
              <p className="ant-upload-drag-icon">
                <UploadOutlined />
              </p>
              <p className="ant-upload-text">Click or drag files to this area to upload</p>
              <p className="ant-upload-hint">
                Support for single or bulk upload. Maximum file size: 10MB
              </p>
            </Upload.Dragger>
          </Form.Item>

          <Form.Item name="folder" label="Destination Folder" initialValue="Products">
            <Select>
              <Option value="Banners">Banners</Option>
              <Option value="Products">Products</Option>
              <Option value="Categories">Categories</Option>
              <Option value="Branding">Branding</Option>
              <Option value="Documents">Documents</Option>
            </Select>
          </Form.Item>

          <Form.Item name="tags" label="Tags (comma-separated)">
            <Input placeholder="e.g., product, electronics, featured" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Create Folder Modal */}
      <Modal
        title="Create New Folder"
        open={isCreateFolderModalVisible}
        onOk={handleCreateFolder}
        onCancel={() => {
          setIsCreateFolderModalVisible(false);
          form.resetFields();
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="folderName"
            label="Folder Name"
            rules={[{ required: true, message: 'Please enter folder name' }]}
          >
            <Input placeholder="Enter folder name" />
          </Form.Item>

          <Form.Item name="parentFolder" label="Parent Folder" initialValue="root">
            <Select>
              <Option value="root">Root</Option>
              <Option value="Banners">Banners</Option>
              <Option value="Products">Products</Option>
              <Option value="Categories">Categories</Option>
              <Option value="Branding">Branding</Option>
              <Option value="Documents">Documents</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MediaLibraryPage;
