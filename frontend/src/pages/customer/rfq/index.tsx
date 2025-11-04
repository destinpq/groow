import React, { useState } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Typography,
  Tag,
  Badge,
  Tabs,
  Modal,
  Descriptions,
  Timeline,
  Avatar,
  Rate,
  Input,
  message,
  Empty,
  Statistic,
  Row,
  Col,
} from 'antd';
import {
  PlusOutlined,
  EyeOutlined,
  MessageOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  FileTextOutlined,
  DollarOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { TextArea } = Input;

interface RFQ {
  id: number;
  title: string;
  category: string;
  quantity: number;
  unit: string;
  status: 'pending' | 'active' | 'quoted' | 'closed' | 'cancelled';
  createdAt: string;
  expiresAt: string;
  quotesReceived: number;
  budget?: number;
  deliveryDate: string;
}

interface Quote {
  id: number;
  vendorName: string;
  vendorRating: number;
  price: number;
  deliveryTime: string;
  paymentTerms: string;
  validity: string;
  status: 'pending' | 'accepted' | 'rejected';
  submittedAt: string;
  notes?: string;
}

const mockRFQs: RFQ[] = [
  {
    id: 1,
    title: 'Office Furniture for 50-Person Office',
    category: 'Office Supplies',
    quantity: 50,
    unit: 'sets',
    status: 'quoted',
    createdAt: '2025-11-01',
    expiresAt: '2025-11-15',
    quotesReceived: 5,
    budget: 25000,
    deliveryDate: '2025-12-01',
  },
  {
    id: 2,
    title: 'Industrial Printing Equipment',
    category: 'Industrial Equipment',
    quantity: 2,
    unit: 'units',
    status: 'active',
    createdAt: '2025-10-28',
    expiresAt: '2025-11-12',
    quotesReceived: 3,
    deliveryDate: '2025-11-25',
  },
  {
    id: 3,
    title: 'Bulk Office Supplies - Monthly Subscription',
    category: 'Office Supplies',
    quantity: 1,
    unit: 'subscription',
    status: 'pending',
    createdAt: '2025-11-03',
    expiresAt: '2025-11-17',
    quotesReceived: 0,
    budget: 1500,
    deliveryDate: '2025-11-20',
  },
  {
    id: 4,
    title: 'Custom Branded Merchandise',
    category: 'Marketing Materials',
    quantity: 1000,
    unit: 'pieces',
    status: 'closed',
    createdAt: '2025-10-15',
    expiresAt: '2025-10-30',
    quotesReceived: 8,
    budget: 5000,
    deliveryDate: '2025-11-10',
  },
];

const mockQuotes: Quote[] = [
  {
    id: 1,
    vendorName: 'Office Pro Solutions',
    vendorRating: 4.7,
    price: 23500,
    deliveryTime: '15-20 business days',
    paymentTerms: '50% Advance, 50% on Delivery',
    validity: '15 days',
    status: 'pending',
    submittedAt: '2025-11-02',
    notes: 'Premium quality furniture with ergonomic design. Includes installation and warranty.',
  },
  {
    id: 2,
    vendorName: 'Business Furnishings Inc',
    vendorRating: 4.5,
    price: 22000,
    deliveryTime: '20-25 business days',
    paymentTerms: 'Net 30',
    validity: '10 days',
    status: 'pending',
    submittedAt: '2025-11-02',
    notes: 'Competitive pricing with bulk discount applied.',
  },
  {
    id: 3,
    vendorName: 'Workspace Essentials',
    vendorRating: 4.9,
    price: 26000,
    deliveryTime: '10-15 business days',
    paymentTerms: '100% Advance',
    validity: '20 days',
    status: 'accepted',
    submittedAt: '2025-11-01',
    notes: 'Fast delivery with premium materials. 3-year warranty included.',
  },
];

const RFQManagementPage: React.FC = () => {
  const [rfqs, setRfqs] = useState<RFQ[]>(mockRFQs);
  const [selectedRFQ, setSelectedRFQ] = useState<RFQ | null>(null);
  const [quotes, setQuotes] = useState<Quote[]>(mockQuotes);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  const getStatusColor = (status: RFQ['status']) => {
    const colors = {
      pending: 'orange',
      active: 'blue',
      quoted: 'green',
      closed: 'default',
      cancelled: 'red',
    };
    return colors[status];
  };

  const filteredRFQs = rfqs.filter(rfq => {
    if (activeTab === 'all') return true;
    return rfq.status === activeTab;
  });

  const handleViewDetails = (rfq: RFQ) => {
    setSelectedRFQ(rfq);
    setIsDetailModalVisible(true);
  };

  const handleAcceptQuote = (quoteId: number) => {
    setQuotes(quotes.map(q =>
      q.id === quoteId ? { ...q, status: 'accepted' as const } : q
    ));
    message.success('Quote accepted successfully!');
  };

  const handleRejectQuote = (quoteId: number) => {
    setQuotes(quotes.map(q =>
      q.id === quoteId ? { ...q, status: 'rejected' as const } : q
    ));
    message.info('Quote rejected');
  };

  const columns: ColumnsType<RFQ> = [
    {
      title: 'RFQ ID',
      dataIndex: 'id',
      key: 'id',
      render: (id: number) => <Text strong>#{id.toString().padStart(4, '0')}</Text>,
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (category: string) => <Tag>{category}</Tag>,
    },
    {
      title: 'Quantity',
      key: 'quantity',
      render: (_, record) => `${record.quantity} ${record.unit}`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: RFQ['status']) => (
        <Tag color={getStatusColor(status)}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Quotes',
      dataIndex: 'quotesReceived',
      key: 'quotesReceived',
      render: (count: number) => (
        <Badge count={count} showZero style={{ backgroundColor: count > 0 ? '#52c41a' : '#d9d9d9' }} />
      ),
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: 'Expires',
      dataIndex: 'expiresAt',
      key: 'expiresAt',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetails(record)}
          >
            View
          </Button>
          <Button type="link" icon={<MessageOutlined />}>
            Messages
          </Button>
        </Space>
      ),
    },
  ];

  const quoteColumns: ColumnsType<Quote> = [
    {
      title: 'Vendor',
      dataIndex: 'vendorName',
      key: 'vendorName',
      render: (name: string, record) => (
        <Space>
          <Avatar>{name[0]}</Avatar>
          <div>
            <div><Text strong>{name}</Text></div>
            <Rate disabled value={record.vendorRating} style={{ fontSize: 12 }} />
          </div>
        </Space>
      ),
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => (
        <Text strong style={{ color: '#ff9900', fontSize: 16 }}>
          ${price.toLocaleString()}
        </Text>
      ),
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: 'Delivery Time',
      dataIndex: 'deliveryTime',
      key: 'deliveryTime',
    },
    {
      title: 'Payment Terms',
      dataIndex: 'paymentTerms',
      key: 'paymentTerms',
    },
    {
      title: 'Valid Until',
      dataIndex: 'validity',
      key: 'validity',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: Quote['status']) => {
        const config = {
          pending: { color: 'orange', text: 'Pending' },
          accepted: { color: 'green', text: 'Accepted' },
          rejected: { color: 'red', text: 'Rejected' },
        };
        return <Tag color={config[status].color}>{config[status].text}</Tag>;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          {record.status === 'pending' && (
            <>
              <Button
                type="primary"
                size="small"
                icon={<CheckCircleOutlined />}
                onClick={() => handleAcceptQuote(record.id)}
              >
                Accept
              </Button>
              <Button
                danger
                size="small"
                icon={<CloseCircleOutlined />}
                onClick={() => handleRejectQuote(record.id)}
              >
                Reject
              </Button>
            </>
          )}
          <Button size="small" icon={<MessageOutlined />}>
            Message
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={3}>
          <FileTextOutlined /> My RFQs
        </Title>
        <Button type="primary" icon={<PlusOutlined />} size="large" href="/customer/rfq/create">
          Create New RFQ
        </Button>
      </div>

      {/* Stats */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Total RFQs"
              value={rfqs.length}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Active"
              value={rfqs.filter(r => r.status === 'active' || r.status === 'pending').length}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Quotes Received"
              value={rfqs.reduce((sum, r) => sum + r.quotesReceived, 0)}
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Closed"
              value={rfqs.filter(r => r.status === 'closed').length}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Card>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab={`All (${rfqs.length})`} key="all" />
          <TabPane tab={`Pending (${rfqs.filter(r => r.status === 'pending').length})`} key="pending" />
          <TabPane tab={`Active (${rfqs.filter(r => r.status === 'active').length})`} key="active" />
          <TabPane tab={`Quoted (${rfqs.filter(r => r.status === 'quoted').length})`} key="quoted" />
          <TabPane tab={`Closed (${rfqs.filter(r => r.status === 'closed').length})`} key="closed" />
        </Tabs>

        <Table
          columns={columns}
          dataSource={filteredRFQs}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>

      {/* Detail Modal */}
      <Modal
        title={`RFQ #${selectedRFQ?.id.toString().padStart(4, '0')} - ${selectedRFQ?.title}`}
        open={isDetailModalVisible}
        onCancel={() => setIsDetailModalVisible(false)}
        width={1000}
        footer={null}
      >
        {selectedRFQ && (
          <Tabs defaultActiveKey="details">
            <TabPane tab="Details" key="details">
              <Descriptions bordered column={2}>
                <Descriptions.Item label="Status">
                  <Tag color={getStatusColor(selectedRFQ.status)}>
                    {selectedRFQ.status.toUpperCase()}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Category">
                  {selectedRFQ.category}
                </Descriptions.Item>
                <Descriptions.Item label="Quantity">
                  {selectedRFQ.quantity} {selectedRFQ.unit}
                </Descriptions.Item>
                <Descriptions.Item label="Budget">
                  {selectedRFQ.budget ? `$${selectedRFQ.budget.toLocaleString()}` : 'Not specified'}
                </Descriptions.Item>
                <Descriptions.Item label="Created">
                  {selectedRFQ.createdAt}
                </Descriptions.Item>
                <Descriptions.Item label="Expires">
                  {selectedRFQ.expiresAt}
                </Descriptions.Item>
                <Descriptions.Item label="Delivery Date">
                  {selectedRFQ.deliveryDate}
                </Descriptions.Item>
                <Descriptions.Item label="Quotes Received">
                  <Badge count={selectedRFQ.quotesReceived} showZero />
                </Descriptions.Item>
              </Descriptions>
            </TabPane>

            <TabPane tab={`Quotes (${quotes.length})`} key="quotes">
              {quotes.length === 0 ? (
                <Empty description="No quotes received yet" />
              ) : (
                <Table
                  columns={quoteColumns}
                  dataSource={quotes}
                  rowKey="id"
                  pagination={false}
                  expandable={{
                    expandedRowRender: (record) => (
                      <div style={{ padding: 16, background: '#fafafa' }}>
                        <Title level={5}>Vendor Notes:</Title>
                        <Paragraph>{record.notes || 'No additional notes provided'}</Paragraph>
                      </div>
                    ),
                  }}
                />
              )}
            </TabPane>

            <TabPane tab="Activity" key="activity">
              <Timeline
                items={[
                  {
                    color: 'green',
                    children: `RFQ created - ${selectedRFQ.createdAt}`,
                  },
                  {
                    color: 'blue',
                    children: 'RFQ sent to 15 vendors - 2025-11-01',
                  },
                  {
                    color: 'orange',
                    children: 'First quote received - 2025-11-02',
                  },
                  {
                    children: `${quotes.length} quotes received so far`,
                  },
                ]}
              />
            </TabPane>
          </Tabs>
        )}
      </Modal>
    </div>
  );
};

export default RFQManagementPage;
