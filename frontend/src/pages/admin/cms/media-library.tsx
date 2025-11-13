import React, { useState } from 'react';
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

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

// Utility function to safely handle array operations
const safeArray = (arr: any[] | undefined | null): any[] => {
  return Array.isArray(arr) ? arr : [];
};

interface MediaFile {
  id: number;
  name: string;
  type: 'image' | 'document' | 'pdf' | 'other';
  size: number;
  url: string;
  uploadedAt: string;
  folder: string;
  tags: string[];
  dimensions?: string;
}

const mockMediaFiles: MediaFile[] = [
  {
    id: 1,
    name: 'product-banner-1.jpg',
    type: 'image',
    size: 245000,
    url: 'https://via.placeholder.com/400x300?text=Banner+1',
    uploadedAt: '2025-11-01',
    folder: 'Banners',
    tags: ['banner', 'homepage'],
    dimensions: '1920x1080',
  },
  {
    id: 2,
    name: 'product-photo-headphones.jpg',
    type: 'image',
    size: 156000,
    url: 'https://via.placeholder.com/400x300?text=Headphones',
    uploadedAt: '2025-11-02',
    folder: 'Products',
    tags: ['product', 'electronics'],
    dimensions: '800x800',
  },
  {
    id: 3,
    name: 'logo-primary.png',
    type: 'image',
    size: 45000,
    url: 'https://via.placeholder.com/200x100?text=Logo',
    uploadedAt: '2025-10-28',
    folder: 'Branding',
    tags: ['logo', 'branding'],
    dimensions: '512x512',
  },
  {
    id: 4,
    name: 'user-manual.pdf',
    type: 'pdf',
    size: 1240000,
    url: '#',
    uploadedAt: '2025-10-25',
    folder: 'Documents',
    tags: ['manual', 'documentation'],
  },
  {
    id: 5,
    name: 'category-electronics.jpg',
    type: 'image',
    size: 189000,
    url: 'https://via.placeholder.com/400x300?text=Electronics',
    uploadedAt: '2025-10-30',
    folder: 'Categories',
    tags: ['category', 'electronics'],
    dimensions: '600x400',
  },
  {
    id: 6,
    name: 'promotional-banner.jpg',
    type: 'image',
    size: 310000,
    url: 'https://via.placeholder.com/400x300?text=Promotion',
    uploadedAt: '2025-11-03',
    folder: 'Banners',
    tags: ['banner', 'promotion', 'sale'],
    dimensions: '1920x600',
  },
];

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
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>(mockMediaFiles);
  const [selectedFolder, setSelectedFolder] = useState<string>('root');
  const [selectedFiles, setSelectedFiles] = useState<number[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isUploadModalVisible, setIsUploadModalVisible] = useState(false);
  const [isCreateFolderModalVisible, setIsCreateFolderModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [form] = Form.useForm();

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
      file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (safeArray(file.tags).some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesFolder && matchesSearch;
  });

  const totalSize = mediaFiles.reduce((sum, file) => sum + file.size, 0);
  const usedSpace = totalSize;
  const totalSpace = 10 * 1024 * 1024 * 1024; // 10GB
  const usedPercentage = (usedSpace / totalSpace) * 100;

  const uploadProps: UploadProps = {
    fileList,
    onChange: ({ fileList: newFileList }) => setFileList(newFileList),
    beforeUpload: () => false,
    multiple: true,
  };

  const handleUpload = () => {
    form.validateFields().then(values => {
      console.log('Upload files:', { files: fileList, ...values });
      setIsUploadModalVisible(false);
      setFileList([]);
      form.resetFields();
    });
  };

  const handleCreateFolder = () => {
    form.validateFields().then(values => {
      console.log('Create folder:', values);
      setIsCreateFolderModalVisible(false);
      form.resetFields();
    });
  };

  const handleDeleteFiles = () => {
    setMediaFiles(mediaFiles.filter(file => !selectedFiles.includes(file.id)));
    setSelectedFiles([]);
  };

  const fileMenuItems = (file: MediaFile): MenuProps['items'] => [
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
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: MediaFile) => (
        <Space>
          {record.type === 'image' ? (
            <Image src={record.url} width={40} height={40} style={{ objectFit: 'cover' }} />
          ) : (
            getFileIcon(record.type)
          )}
          <Text>{text}</Text>
        </Space>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => <Tag>{type.toUpperCase()}</Tag>,
    },
    {
      title: 'Size',
      dataIndex: 'size',
      key: 'size',
      render: (size: number) => formatFileSize(size),
    },
    {
      title: 'Folder',
      dataIndex: 'folder',
      key: 'folder',
    },
    {
      title: 'Uploaded',
      dataIndex: 'uploadedAt',
      key: 'uploadedAt',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: MediaFile) => (
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
                        file.type === 'image' ? (
                          <Image
                            src={file.url}
                            alt={file.name}
                            style={{ height: 150, objectFit: 'cover' }}
                          />
                        ) : (
                          <div style={{ height: 150, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {getFileIcon(file.type)}
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
                          <Text ellipsis={{ tooltip: file.name }} style={{ fontSize: 12 }}>
                            {file.name}
                          </Text>
                        }
                        description={
                          <Space direction="vertical" size="small" style={{ width: '100%' }}>
                            <Text type="secondary" style={{ fontSize: 11 }}>
                              {formatFileSize(file.size)}
                            </Text>
                            {file.dimensions && (
                              <Text type="secondary" style={{ fontSize: 11 }}>
                                {file.dimensions}
                              </Text>
                            )}
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
