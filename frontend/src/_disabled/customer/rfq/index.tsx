import React, { useState, useEffect } from 'react';
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
  Spin,
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
import { rfqAPI } from '@/services/api/rfq';
import type { RFQ, Quotation } from '@/services/api/rfq';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { TextArea } = Input;

const RFQManagementPage: React.FC = () => {
  const [rfqs, setRfqs] = useState<RFQ[]>([]);
  const [selectedRFQ, setSelectedRFQ] = useState<RFQ | null>(null);
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 10;

  // Fetch RFQs from API
  useEffect(() => {
    fetchRFQs();
  }, [page, activeTab]);

  const fetchRFQs = async () => {
    setLoading(true);
    try {
      const status = activeTab === 'all' ? undefined : activeTab;
      const response = await rfqAPI.getAll({ status, page, limit: pageSize });
      setRfqs(response.data);
      setTotal(response.total);
    } catch (error) {
      message.error('Failed to load RFQs');
      console.error('Error fetching RFQs:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch quotations for selected RFQ
  const fetchQuotations = async (rfqId: string) => {
    try {
      const data = await rfqAPI.getQuotations(rfqId);
      setQuotations(data);
    } catch (error) {
      message.error('Failed to load quotations');
      console.error('Error fetching quotations:', error);
    }
  };

  const getStatusColor = (status: RFQ['status']) => {
    const colors = {
      open: 'blue',
      quoted: 'green',
      closed: 'default',
      cancelled: 'red',
    };
    return colors[status] || 'default';
  };

  const filteredRFQs = rfqs.filter(rfq => {
    if (activeTab === 'all') return true;
    return rfq.status === activeTab;
  });

  const handleViewDetails = async (rfq: RFQ) => {
    setSelectedRFQ(rfq);
    setIsDetailModalVisible(true);
    // Fetch quotations for this RFQ
    await fetchQuotations(rfq.id);
  };

  const handleAcceptQuote = async (quotationId: string) => {
    try {
      await rfqAPI.acceptQuotation(quotationId);
      message.success('Quotation accepted successfully!');
      // Refresh quotations
      if (selectedRFQ) {
        await fetchQuotations(selectedRFQ.id);
      }
      // Refresh RFQs to update status
      await fetchRFQs();
    } catch (error) {
      message.error('Failed to accept quotation');
      console.error('Error accepting quotation:', error);
    }
  };

  const handleRejectQuote = async (quotationId: string) => {
    try {
      await rfqAPI.rejectQuotation(quotationId, 'Not suitable for requirements');
      message.info('Quotation rejected');
      // Refresh quotations
      if (selectedRFQ) {
        await fetchQuotations(selectedRFQ.id);
      }
    } catch (error) {
      message.error('Failed to reject quotation');
      console.error('Error rejecting quotation:', error);
    }
  };

  const columns: ColumnsType<RFQ> = [
    {
      title: 'RFQ ID',
      dataIndex: 'rfqNumber',
      key: 'rfqNumber',
      render: (rfqNumber: string) => <Text strong>{rfqNumber}</Text>,
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
      dataIndex: 'quantity',
      key: 'quantity',
      render: (qty: number) => qty.toLocaleString(),
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
      dataIndex: 'quotationCount',
      key: 'quotationCount',
      render: (count: number) => (
        <Badge count={count} showZero style={{ backgroundColor: count > 0 ? '#52c41a' : '#d9d9d9' }} />
      ),
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => dayjs(date).format('MMM DD, YYYY'),
    },
    {
      title: 'Deadline',
      dataIndex: 'deadline',
      key: 'deadline',
      render: (date?: string) => date ? dayjs(date).format('MMM DD, YYYY') : '-',
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
        </Space>
      ),
    },
  ];

  const quotationColumns: ColumnsType<Quotation> = [
    {
      title: 'Vendor',
      dataIndex: 'vendorName',
      key: 'vendorName',
      render: (name: string, record) => (
        <Space>
          <Avatar src={record.vendorLogo}>{name[0]}</Avatar>
          <Text strong>{name}</Text>
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
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (qty: number) => qty.toLocaleString(),
    },
    {
      title: 'MOQ',
      dataIndex: 'moq',
      key: 'moq',
      render: (moq: number) => moq.toLocaleString(),
    },
    {
      title: 'Delivery Time',
      dataIndex: 'deliveryTime',
      key: 'deliveryTime',
    },
    {
      title: 'Valid Until',
      dataIndex: 'validUntil',
      key: 'validUntil',
      render: (date: string) => dayjs(date).format('MMM DD, YYYY'),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: Quotation['status']) => {
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
              value={total}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Open"
              value={rfqs.filter(r => r.status === 'open').length}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Quotes Received"
              value={rfqs.reduce((sum, r) => sum + r.quotationCount, 0)}
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
        <Tabs activeKey={activeTab} onChange={(key) => { setActiveTab(key); setPage(1); }}>
          <TabPane tab={`All (${total})`} key="all" />
          <TabPane tab="Open" key="open" />
          <TabPane tab="Quoted" key="quoted" />
          <TabPane tab="Closed" key="closed" />
          <TabPane tab="Cancelled" key="cancelled" />
        </Tabs>

        <Spin spinning={loading}>
          <Table
            columns={columns}
            dataSource={filteredRFQs}
            rowKey="id"
            pagination={{
              current: page,
              pageSize,
              total,
              onChange: setPage,
            }}
          />
        </Spin>
      </Card>

      {/* Detail Modal */}
      <Modal
        title={`RFQ ${selectedRFQ?.rfqNumber} - ${selectedRFQ?.title}`}
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
                  {selectedRFQ.quantity.toLocaleString()}
                </Descriptions.Item>
                <Descriptions.Item label="Budget">
                  {selectedRFQ.budget ? `$${selectedRFQ.budget.toLocaleString()}` : 'Not specified'}
                </Descriptions.Item>
                <Descriptions.Item label="Created">
                  {dayjs(selectedRFQ.createdAt).format('MMM DD, YYYY')}
                </Descriptions.Item>
                <Descriptions.Item label="Deadline">
                  {selectedRFQ.deadline ? dayjs(selectedRFQ.deadline).format('MMM DD, YYYY') : 'Not specified'}
                </Descriptions.Item>
                <Descriptions.Item label="Description" span={2}>
                  {selectedRFQ.description}
                </Descriptions.Item>
                <Descriptions.Item label="Quotes Received">
                  <Badge count={selectedRFQ.quotationCount} showZero />
                </Descriptions.Item>
              </Descriptions>
            </TabPane>

            <TabPane tab={`Quotations (${quotations.length})`} key="quotes">
              {quotations.length === 0 ? (
                <Empty description="No quotations received yet" />
              ) : (
                <Table
                  columns={quotationColumns}
                  dataSource={quotations}
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
                    children: `RFQ created - ${dayjs(selectedRFQ.createdAt).format('MMM DD, YYYY')}`,
                  },
                  {
                    color: 'blue',
                    children: 'RFQ published to vendors',
                  },
                  ...(quotations.length > 0 ? [{
                    color: 'orange',
                    children: `First quotation received - ${dayjs(quotations[0].createdAt).format('MMM DD, YYYY')}`,
                  }] : []),
                  {
                    children: `${quotations.length} quotation(s) received so far`,
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
