import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Table,
  Space,
  Button,
  Tag,
  Modal,
  Form,
  InputNumber,
  message,
  Badge,
  Image,
  Tooltip,
  Alert,
  Progress,
  Statistic,
  Divider,
} from 'antd';
import {
  TrophyOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  UserOutlined,
  FireOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  RiseOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { Countdown } = Statistic;

interface Bid {
  id: number;
  userId: number;
  userName: string;
  amount: number;
  bidTime: string;
  isWinning: boolean;
}

interface Auction {
  id: number;
  productName: string;
  productImage: string;
  description: string;
  category: string;
  startingBid: number;
  currentBid: number;
  buyNowPrice: number;
  reservePrice: number;
  reserveMet: boolean;
  startTime: string;
  endTime: string;
  totalBids: number;
  uniqueBidders: number;
  status: 'upcoming' | 'active' | 'ending-soon' | 'ended';
  isWatching: boolean;
  myHighestBid: number;
  amIWinning: boolean;
  bids: Bid[];
}

interface MyBid {
  id: number;
  auctionId: number;
  productName: string;
  productImage: string;
  bidAmount: number;
  currentBid: number;
  bidTime: string;
  endTime: string;
  status: 'winning' | 'outbid' | 'won' | 'lost';
}

const mockAuctions: Auction[] = [
  {
    id: 1,
    productName: 'Vintage Rolex Watch',
    productImage: 'https://via.placeholder.com/300x200?text=Rolex',
    description: 'Rare 1960s Rolex Submariner in excellent condition',
    category: 'Watches',
    startingBid: 5000,
    currentBid: 8500,
    buyNowPrice: 15000,
    reservePrice: 10000,
    reserveMet: false,
    startTime: dayjs().subtract(2, 'days').format('YYYY-MM-DD HH:mm:ss'),
    endTime: dayjs().add(2, 'hours').format('YYYY-MM-DD HH:mm:ss'),
    totalBids: 23,
    uniqueBidders: 8,
    status: 'ending-soon',
    isWatching: true,
    myHighestBid: 8500,
    amIWinning: true,
    bids: [
      { id: 1, userId: 1, userName: 'You', amount: 8500, bidTime: dayjs().subtract(10, 'minutes').format('YYYY-MM-DD HH:mm:ss'), isWinning: true },
      { id: 2, userId: 2, userName: 'John D.', amount: 8000, bidTime: dayjs().subtract(30, 'minutes').format('YYYY-MM-DD HH:mm:ss'), isWinning: false },
      { id: 3, userId: 3, userName: 'Sarah M.', amount: 7500, bidTime: dayjs().subtract(1, 'hour').format('YYYY-MM-DD HH:mm:ss'), isWinning: false },
    ],
  },
  {
    id: 2,
    productName: 'Limited Edition Sneakers',
    productImage: 'https://via.placeholder.com/300x200?text=Sneakers',
    description: 'Nike Air Jordan 1 Retro High OG - Chicago (2015)',
    category: 'Footwear',
    startingBid: 500,
    currentBid: 1200,
    buyNowPrice: 2500,
    reservePrice: 1500,
    reserveMet: false,
    startTime: dayjs().subtract(1, 'day').format('YYYY-MM-DD HH:mm:ss'),
    endTime: dayjs().add(1, 'day').format('YYYY-MM-DD HH:mm:ss'),
    totalBids: 15,
    uniqueBidders: 6,
    status: 'active',
    isWatching: false,
    myHighestBid: 0,
    amIWinning: false,
    bids: [
      { id: 4, userId: 4, userName: 'Mike R.', amount: 1200, bidTime: dayjs().subtract(15, 'minutes').format('YYYY-MM-DD HH:mm:ss'), isWinning: true },
      { id: 5, userId: 5, userName: 'Emma W.', amount: 1100, bidTime: dayjs().subtract(45, 'minutes').format('YYYY-MM-DD HH:mm:ss'), isWinning: false },
    ],
  },
  {
    id: 3,
    productName: 'Rare Pokemon Card',
    productImage: 'https://via.placeholder.com/300x200?text=Pokemon',
    description: 'Charizard 1st Edition Base Set PSA 10 Gem Mint',
    category: 'Collectibles',
    startingBid: 10000,
    currentBid: 10000,
    buyNowPrice: 30000,
    reservePrice: 20000,
    reserveMet: false,
    startTime: dayjs().add(2, 'hours').format('YYYY-MM-DD HH:mm:ss'),
    endTime: dayjs().add(3, 'days').format('YYYY-MM-DD HH:mm:ss'),
    totalBids: 0,
    uniqueBidders: 0,
    status: 'upcoming',
    isWatching: true,
    myHighestBid: 0,
    amIWinning: false,
    bids: [],
  },
  {
    id: 4,
    productName: 'Signed Baseball',
    productImage: 'https://via.placeholder.com/300x200?text=Baseball',
    description: 'Babe Ruth Signed Baseball with COA',
    category: 'Sports',
    startingBid: 2000,
    currentBid: 4500,
    buyNowPrice: 8000,
    reservePrice: 5000,
    reserveMet: false,
    startTime: dayjs().subtract(3, 'days').format('YYYY-MM-DD HH:mm:ss'),
    endTime: dayjs().add(5, 'hours').format('YYYY-MM-DD HH:mm:ss'),
    totalBids: 18,
    uniqueBidders: 7,
    status: 'active',
    isWatching: false,
    myHighestBid: 3500,
    amIWinning: false,
    bids: [
      { id: 6, userId: 6, userName: 'Tom H.', amount: 4500, bidTime: dayjs().subtract(20, 'minutes').format('YYYY-MM-DD HH:mm:ss'), isWinning: true },
      { id: 7, userId: 1, userName: 'You', amount: 3500, bidTime: dayjs().subtract(2, 'hours').format('YYYY-MM-DD HH:mm:ss'), isWinning: false },
    ],
  },
];

const mockMyBids: MyBid[] = [
  {
    id: 1,
    auctionId: 1,
    productName: 'Vintage Rolex Watch',
    productImage: 'https://via.placeholder.com/60?text=Rolex',
    bidAmount: 8500,
    currentBid: 8500,
    bidTime: dayjs().subtract(10, 'minutes').format('YYYY-MM-DD HH:mm:ss'),
    endTime: dayjs().add(2, 'hours').format('YYYY-MM-DD HH:mm:ss'),
    status: 'winning',
  },
  {
    id: 2,
    auctionId: 4,
    productName: 'Signed Baseball',
    productImage: 'https://via.placeholder.com/60?text=Baseball',
    bidAmount: 3500,
    currentBid: 4500,
    bidTime: dayjs().subtract(2, 'hours').format('YYYY-MM-DD HH:mm:ss'),
    endTime: dayjs().add(5, 'hours').format('YYYY-MM-DD HH:mm:ss'),
    status: 'outbid',
  },
];

const AuctionPage: React.FC = () => {
  const [auctions, setAuctions] = useState<Auction[]>(mockAuctions);
  const [myBids] = useState<MyBid[]>(mockMyBids);
  const [isBidModalVisible, setIsBidModalVisible] = useState<boolean>(false);
  const [selectedAuction, setSelectedAuction] = useState<Auction | null>(null);
  const [form] = Form.useForm();

  const handlePlaceBid = (auction: Auction) => {
    if (auction.status === 'upcoming') {
      message.warning('Auction has not started yet');
      return;
    }
    if (auction.status === 'ended') {
      message.warning('Auction has ended');
      return;
    }
    setSelectedAuction(auction);
    const minimumBid = auction.currentBid + 100;
    form.setFieldsValue({ bidAmount: minimumBid });
    setIsBidModalVisible(true);
  };

  const handleSubmitBid = (values: any) => {
    if (!selectedAuction) return;

    if (values.bidAmount <= selectedAuction.currentBid) {
      message.error(`Bid must be higher than current bid of $${selectedAuction.currentBid}`);
      return;
    }

    message.success(`Bid of $${values.bidAmount} placed successfully!`);
    setIsBidModalVisible(false);
    form.resetFields();
  };

  const handleBuyNow = (auction: Auction) => {
    Modal.confirm({
      title: 'Buy Now',
      content: `Are you sure you want to buy this item for $${auction.buyNowPrice}?`,
      okText: 'Buy Now',
      onOk: () => {
        message.success(`Item purchased for $${auction.buyNowPrice}!`);
      },
    });
  };

  const handleToggleWatch = (auctionId: number) => {
    setAuctions(
      auctions.map((a) =>
        a.id === auctionId ? { ...a, isWatching: !a.isWatching } : a
      )
    );
    const auction = auctions.find((a) => a.id === auctionId);
    if (auction) {
      message.success(auction.isWatching ? 'Removed from watchlist' : 'Added to watchlist');
    }
  };

  const myBidsColumns: ColumnsType<MyBid> = [
    {
      title: 'Product',
      key: 'product',
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Image src={record.productImage} width={60} height={60} preview={false} />
          <Text strong>{record.productName}</Text>
        </div>
      ),
    },
    {
      title: 'My Bid',
      dataIndex: 'bidAmount',
      key: 'bidAmount',
      render: (amount) => (
        <Text strong style={{ fontSize: 16, color: '#1890ff' }}>
          ${amount.toLocaleString()}
        </Text>
      ),
    },
    {
      title: 'Current Bid',
      dataIndex: 'currentBid',
      key: 'currentBid',
      render: (amount) => <Text>${amount.toLocaleString()}</Text>,
    },
    {
      title: 'Bid Time',
      dataIndex: 'bidTime',
      key: 'bidTime',
      render: (time) => <Text>{dayjs(time).format('MMM DD, HH:mm')}</Text>,
    },
    {
      title: 'Time Left',
      dataIndex: 'endTime',
      key: 'endTime',
      render: (endTime) => {
        const now = dayjs();
        const end = dayjs(endTime);
        const hoursLeft = end.diff(now, 'hours');
        return (
          <Text type={hoursLeft < 2 ? 'danger' : undefined}>
            <ClockCircleOutlined /> {hoursLeft}h {end.diff(now, 'minutes') % 60}m
          </Text>
        );
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: MyBid['status']) => {
        const config: Record<MyBid['status'], { color: string; text: string; icon: React.ReactNode }> = {
          winning: { color: 'green', text: 'Winning', icon: <TrophyOutlined /> },
          outbid: { color: 'red', text: 'Outbid', icon: <WarningOutlined /> },
          won: { color: 'blue', text: 'Won', icon: <CheckCircleOutlined /> },
          lost: { color: 'default', text: 'Lost', icon: null },
        };
        return (
          <Tag color={config[status].color} icon={config[status].icon}>
            {config[status].text}
          </Tag>
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          {record.status === 'outbid' && (
            <Button type="primary" size="small" icon={<RiseOutlined />}>
              Increase Bid
            </Button>
          )}
          <Button size="small">View Auction</Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={3}>
          <TrophyOutlined style={{ color: '#fa8c16' }} /> Auctions
        </Title>
        <Paragraph type="secondary">
          Bid on exclusive items and collectibles
        </Paragraph>
      </div>

      <Alert
        message="How Auctions Work"
        description={
          <ul style={{ marginBottom: 0, paddingLeft: 20 }}>
            <li>Place bids to compete for items - highest bidder wins</li>
            <li>Each bid must exceed the current bid by at least $100</li>
            <li>Use "Buy Now" to purchase immediately at a fixed price</li>
            <li>Reserve price must be met for auction to complete</li>
            <li>Watch auctions to receive notifications about outbids</li>
          </ul>
        }
        type="info"
        style={{ marginBottom: 24 }}
      />

      <Title level={4} style={{ marginBottom: 16 }}>
        Active Auctions
      </Title>

      <Row gutter={[16, 16]} style={{ marginBottom: 32 }}>
        {auctions.map((auction) => {
          const timeLeft = dayjs(auction.endTime).diff(dayjs(), 'milliseconds');
          const progress = ((auction.currentBid - auction.startingBid) / (auction.buyNowPrice - auction.startingBid)) * 100;

          return (
            <Col xs={24} md={12} lg={8} key={auction.id}>
              <Badge.Ribbon
                text={
                  auction.status === 'ending-soon'
                    ? 'Ending Soon'
                    : auction.status === 'upcoming'
                    ? 'Upcoming'
                    : auction.status === 'ended'
                    ? 'Ended'
                    : `${auction.totalBids} bids`
                }
                color={
                  auction.status === 'ending-soon'
                    ? 'red'
                    : auction.status === 'upcoming'
                    ? 'blue'
                    : auction.status === 'ended'
                    ? 'default'
                    : 'orange'
                }
              >
                <Card
                  hoverable
                  cover={
                    <div style={{ position: 'relative' }}>
                      <Image
                        src={auction.productImage}
                        preview={false}
                        height={200}
                        width="100%"
                        style={{ objectFit: 'cover' }}
                      />
                      {auction.amIWinning && (
                        <div
                          style={{
                            position: 'absolute',
                            top: 8,
                            left: 8,
                            background: '#52c41a',
                            color: 'white',
                            padding: '4px 12px',
                            borderRadius: 4,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                          }}
                        >
                          <TrophyOutlined />
                          <Text style={{ color: 'white', fontWeight: 'bold' }}>Winning</Text>
                        </div>
                      )}
                    </div>
                  }
                >
                  <div style={{ marginBottom: 8 }}>
                    <Tag color="blue">{auction.category}</Tag>
                    {auction.status === 'ending-soon' && (
                      <Tag icon={<FireOutlined />} color="red">
                        Hot
                      </Tag>
                    )}
                  </div>

                  <Title level={5} style={{ marginBottom: 8 }}>
                    {auction.productName}
                  </Title>

                  <Paragraph type="secondary" ellipsis={{ rows: 2 }} style={{ marginBottom: 12 }}>
                    {auction.description}
                  </Paragraph>

                  <Divider style={{ margin: '12px 0' }} />

                  {auction.status === 'upcoming' ? (
                    <div style={{ textAlign: 'center', padding: '24px 0' }}>
                      <Text type="secondary">Starts in</Text>
                      <Countdown
                        value={dayjs(auction.startTime).valueOf()}
                        format="D [days] H [hrs] m [min]"
                      />
                    </div>
                  ) : (
                    <>
                      <Row justify="space-between" align="middle" style={{ marginBottom: 12 }}>
                        <Col>
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            Current Bid
                          </Text>
                          <div>
                            <Text strong style={{ fontSize: 20, color: '#1890ff' }}>
                              ${auction.currentBid.toLocaleString()}
                            </Text>
                          </div>
                        </Col>
                        <Col>
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            Buy Now
                          </Text>
                          <div>
                            <Text strong style={{ fontSize: 16 }}>
                              ${auction.buyNowPrice.toLocaleString()}
                            </Text>
                          </div>
                        </Col>
                      </Row>

                      <div style={{ marginBottom: 12 }}>
                        <Row justify="space-between" style={{ marginBottom: 4 }}>
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            Progress to Buy Now
                          </Text>
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            {progress.toFixed(0)}%
                          </Text>
                        </Row>
                        <Progress percent={progress} showInfo={false} strokeColor="#1890ff" />
                      </div>

                      {!auction.reserveMet && (
                        <Alert
                          message="Reserve not met"
                          type="warning"
                          showIcon
                          style={{ marginBottom: 12, padding: '4px 8px' }}
                        />
                      )}

                      <Space direction="vertical" size="small" style={{ width: '100%', marginBottom: 12 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            <UserOutlined /> {auction.uniqueBidders} bidders
                          </Text>
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            <ClockCircleOutlined /> {auction.totalBids} bids
                          </Text>
                        </div>
                        {auction.status !== 'ended' && (
                          <div>
                            <Text type="secondary" style={{ fontSize: 12 }}>
                              Time left:
                            </Text>
                            <Countdown
                              value={dayjs(auction.endTime).valueOf()}
                              format="HH:mm:ss"
                              valueStyle={{ fontSize: 16, color: timeLeft < 7200000 ? '#ff4d4f' : '#1890ff' }}
                            />
                          </div>
                        )}
                      </Space>

                      <Space style={{ width: '100%' }} direction="vertical" size="small">
                        <Button
                          type="primary"
                          block
                          icon={<RiseOutlined />}
                          onClick={() => handlePlaceBid(auction)}
                          disabled={auction.status === 'ended'}
                        >
                          Place Bid
                        </Button>
                        <Row gutter={8}>
                          <Col span={12}>
                            <Button
                              block
                              icon={<DollarOutlined />}
                              onClick={() => handleBuyNow(auction)}
                              disabled={auction.status === 'ended'}
                            >
                              Buy Now
                            </Button>
                          </Col>
                          <Col span={12}>
                            <Button
                              block
                              icon={auction.isWatching ? <CheckCircleOutlined /> : <ClockCircleOutlined />}
                              onClick={() => handleToggleWatch(auction.id)}
                            >
                              {auction.isWatching ? 'Watching' : 'Watch'}
                            </Button>
                          </Col>
                        </Row>
                      </Space>
                    </>
                  )}
                </Card>
              </Badge.Ribbon>
            </Col>
          );
        })}
      </Row>

      <Title level={4} style={{ marginBottom: 16 }}>
        My Bids
      </Title>

      <Card>
        <Table columns={myBidsColumns} dataSource={myBids} rowKey="id" scroll={{ x: 1000 }} />
      </Card>

      <Modal
        title="Place Bid"
        open={isBidModalVisible}
        onCancel={() => setIsBidModalVisible(false)}
        footer={null}
        width={500}
      >
        {selectedAuction && (
          <div>
            <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
              <Image src={selectedAuction.productImage} width={100} height={100} preview={false} />
              <div style={{ flex: 1 }}>
                <Title level={5} style={{ marginBottom: 4 }}>
                  {selectedAuction.productName}
                </Title>
                <div style={{ marginBottom: 8 }}>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    Current Bid:
                  </Text>
                  <Text strong style={{ fontSize: 18, color: '#1890ff', marginLeft: 8 }}>
                    ${selectedAuction.currentBid.toLocaleString()}
                  </Text>
                </div>
                <div>
                  <ClockCircleOutlined style={{ marginRight: 4 }} />
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    Ends: {dayjs(selectedAuction.endTime).format('MMM DD, HH:mm')}
                  </Text>
                </div>
              </div>
            </div>

            <Alert
              message="Bidding Rules"
              description={
                <ul style={{ marginBottom: 0, paddingLeft: 20 }}>
                  <li>Minimum bid increment: $100</li>
                  <li>Your bid is a binding commitment to purchase</li>
                  <li>You'll be notified if you're outbid</li>
                  <li>Reserve price: ${selectedAuction.reservePrice.toLocaleString()}</li>
                </ul>
              }
              type="info"
              style={{ marginBottom: 24 }}
            />

            <Form form={form} layout="vertical" onFinish={handleSubmitBid}>
              <Form.Item
                label="Your Bid Amount"
                name="bidAmount"
                rules={[
                  { required: true, message: 'Please enter bid amount' },
                  {
                    validator: (_, value) => {
                      if (value && value <= selectedAuction.currentBid) {
                        return Promise.reject(`Bid must be higher than $${selectedAuction.currentBid}`);
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <InputNumber
                  min={selectedAuction.currentBid + 100}
                  step={100}
                  style={{ width: '100%' }}
                  prefix="$"
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                />
              </Form.Item>

              <div style={{ background: '#f0f2f5', padding: 16, borderRadius: 4, marginBottom: 16 }}>
                <Row justify="space-between" style={{ marginBottom: 8 }}>
                  <Text>Current Bid:</Text>
                  <Text strong>${selectedAuction.currentBid.toLocaleString()}</Text>
                </Row>
                <Row justify="space-between" style={{ marginBottom: 8 }}>
                  <Text>Your Bid:</Text>
                  <Text strong style={{ color: '#1890ff' }}>
                    ${form.getFieldValue('bidAmount')?.toLocaleString() || '0'}
                  </Text>
                </Row>
                <Row justify="space-between">
                  <Text>Buy Now Price:</Text>
                  <Text>${selectedAuction.buyNowPrice.toLocaleString()}</Text>
                </Row>
              </div>

              {selectedAuction.bids.length > 0 && (
                <div style={{ marginBottom: 16 }}>
                  <Text strong style={{ display: 'block', marginBottom: 8 }}>
                    Recent Bids:
                  </Text>
                  {selectedAuction.bids.slice(0, 3).map((bid) => (
                    <div
                      key={bid.id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: 8,
                        background: bid.isWinning ? '#f6ffed' : '#fafafa',
                        borderRadius: 4,
                        marginBottom: 4,
                      }}
                    >
                      <Text>
                        {bid.userName}
                        {bid.isWinning && <TrophyOutlined style={{ color: '#52c41a', marginLeft: 8 }} />}
                      </Text>
                      <Text strong>${bid.amount.toLocaleString()}</Text>
                    </div>
                  ))}
                </div>
              )}

              <Form.Item>
                <Space>
                  <Button type="primary" htmlType="submit" icon={<RiseOutlined />}>
                    Place Bid
                  </Button>
                  <Button onClick={() => setIsBidModalVisible(false)}>Cancel</Button>
                </Space>
              </Form.Item>
            </Form>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AuctionPage;
