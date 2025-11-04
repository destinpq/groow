import React, { useState } from 'react';
import { Card, Row, Col, Modal, Tabs, Empty, Typography, Tag, Badge } from 'antd';
import {
  PlayCircleOutlined,
  YoutubeOutlined,
  VideoCameraOutlined,
  ClockCircleOutlined,
  EyeOutlined,
} from '@ant-design/icons';

const { Text, Title } = Typography;

interface ProductVideo {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  url: string;
  type: 'youtube' | 'vimeo' | 'direct';
  duration: string;
  views: number;
  uploadDate: string;
}

interface ProductVideoGalleryProps {
  videos?: ProductVideo[];
  productName?: string;
}

const mockVideos: ProductVideo[] = [
  {
    id: 1,
    title: 'Product Overview & Unboxing',
    description: 'Complete overview and unboxing of the product including all accessories',
    thumbnail: 'https://via.placeholder.com/300x200?text=Product+Overview',
    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    type: 'youtube',
    duration: '5:24',
    views: 12450,
    uploadDate: '2024-01-15',
  },
  {
    id: 2,
    title: 'Setup & Installation Guide',
    description: 'Step-by-step guide on how to set up and install the product',
    thumbnail: 'https://via.placeholder.com/300x200?text=Setup+Guide',
    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    type: 'youtube',
    duration: '8:15',
    views: 8920,
    uploadDate: '2024-01-18',
  },
  {
    id: 3,
    title: 'Features & Functionality Demo',
    description: 'Detailed demonstration of all features and how to use them',
    thumbnail: 'https://via.placeholder.com/300x200?text=Features+Demo',
    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    type: 'youtube',
    duration: '12:30',
    views: 15600,
    uploadDate: '2024-01-20',
  },
  {
    id: 4,
    title: 'Comparison with Similar Products',
    description: 'Side-by-side comparison with competing products in the market',
    thumbnail: 'https://via.placeholder.com/300x200?text=Comparison',
    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    type: 'youtube',
    duration: '10:45',
    views: 9340,
    uploadDate: '2024-01-25',
  },
  {
    id: 5,
    title: 'Customer Review & Real-World Usage',
    description: 'Honest customer review after 30 days of daily usage',
    thumbnail: 'https://via.placeholder.com/300x200?text=Customer+Review',
    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    type: 'youtube',
    duration: '7:20',
    views: 6780,
    uploadDate: '2024-02-10',
  },
  {
    id: 6,
    title: 'Troubleshooting Common Issues',
    description: 'Solutions to common problems and how to troubleshoot',
    thumbnail: 'https://via.placeholder.com/300x200?text=Troubleshooting',
    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    type: 'youtube',
    duration: '6:50',
    views: 4520,
    uploadDate: '2024-02-15',
  },
];

const ProductVideoGallery: React.FC<ProductVideoGalleryProps> = ({
  videos = mockVideos,
  productName = 'Product',
}) => {
  const [selectedVideo, setSelectedVideo] = useState<ProductVideo | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  const handleVideoClick = (video: ProductVideo) => {
    setSelectedVideo(video);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedVideo(null);
  };

  const getVideoIcon = (type: string) => {
    switch (type) {
      case 'youtube':
        return <YoutubeOutlined style={{ color: '#ff0000' }} />;
      case 'vimeo':
        return <VideoCameraOutlined style={{ color: '#1ab7ea' }} />;
      default:
        return <PlayCircleOutlined />;
    }
  };

  const categorizeVideos = () => {
    const categories: { [key: string]: ProductVideo[] } = {
      all: videos,
      tutorials: videos.filter(v => 
        v.title.toLowerCase().includes('guide') || 
        v.title.toLowerCase().includes('setup') ||
        v.title.toLowerCase().includes('how to')
      ),
      reviews: videos.filter(v => 
        v.title.toLowerCase().includes('review') || 
        v.title.toLowerCase().includes('unboxing')
      ),
      demos: videos.filter(v => 
        v.title.toLowerCase().includes('demo') || 
        v.title.toLowerCase().includes('features')
      ),
    };
    return categories;
  };

  const categorizedVideos = categorizeVideos();
  const displayVideos = categorizedVideos[activeTab] || videos;

  return (
    <div>
      <Card
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <PlayCircleOutlined style={{ color: '#ff9900' }} />
            <span>Product Videos</span>
            <Badge count={videos.length} style={{ backgroundColor: '#1890ff' }} />
          </div>
        }
      >
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            { 
              key: 'all', 
              label: `All Videos (${categorizedVideos.all.length})` 
            },
            { 
              key: 'tutorials', 
              label: `Tutorials (${categorizedVideos.tutorials.length})` 
            },
            { 
              key: 'reviews', 
              label: `Reviews (${categorizedVideos.reviews.length})` 
            },
            { 
              key: 'demos', 
              label: `Demos (${categorizedVideos.demos.length})` 
            },
          ]}
        />

        {displayVideos.length === 0 ? (
          <Empty description="No videos available" />
        ) : (
          <Row gutter={[16, 16]}>
            {displayVideos.map(video => (
              <Col xs={24} sm={12} md={8} key={video.id}>
                <Card
                  hoverable
                  onClick={() => handleVideoClick(video)}
                  cover={
                    <div style={{ position: 'relative' }}>
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        style={{ width: '100%', height: 180, objectFit: 'cover' }}
                      />
                      <div
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: 'rgba(0, 0, 0, 0.3)',
                          transition: 'background 0.3s',
                        }}
                        className="video-overlay"
                      >
                        <PlayCircleOutlined
                          style={{
                            fontSize: 64,
                            color: 'white',
                            opacity: 0.9,
                          }}
                        />
                      </div>
                      <div
                        style={{
                          position: 'absolute',
                          bottom: 8,
                          right: 8,
                          background: 'rgba(0, 0, 0, 0.8)',
                          color: 'white',
                          padding: '2px 6px',
                          borderRadius: 4,
                          fontSize: 12,
                        }}
                      >
                        <ClockCircleOutlined /> {video.duration}
                      </div>
                    </div>
                  }
                >
                  <Card.Meta
                    title={
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                        {getVideoIcon(video.type)}
                        <Text ellipsis={{ tooltip: video.title }} strong style={{ flex: 1 }}>
                          {video.title}
                        </Text>
                      </div>
                    }
                    description={
                      <div>
                        <Text
                          type="secondary"
                          ellipsis={{ tooltip: video.description }}
                          style={{ display: 'block', marginBottom: 8, fontSize: 12, height: 32, overflow: 'hidden' }}
                        >
                          {video.description}
                        </Text>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#8c8c8c' }}>
                          <span>
                            <EyeOutlined /> {video.views.toLocaleString()} views
                          </span>
                          <span>{new Date(video.uploadDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    }
                  />
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Card>

      {/* Video Player Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {selectedVideo && getVideoIcon(selectedVideo.type)}
            <span>{selectedVideo?.title}</span>
          </div>
        }
        open={isModalVisible}
        onCancel={handleCloseModal}
        footer={null}
        width={900}
        centered
      >
        {selectedVideo && (
          <div>
            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
              <iframe
                src={selectedVideo.url}
                title={selectedVideo.title}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  border: 'none',
                }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div style={{ marginTop: 16 }}>
              <Title level={5}>{selectedVideo.title}</Title>
              <Text type="secondary">{selectedVideo.description}</Text>
              <div style={{ marginTop: 12, display: 'flex', gap: 16, fontSize: 13, color: '#8c8c8c' }}>
                <span>
                  <ClockCircleOutlined /> {selectedVideo.duration}
                </span>
                <span>
                  <EyeOutlined /> {selectedVideo.views.toLocaleString()} views
                </span>
                <span>Uploaded: {new Date(selectedVideo.uploadDate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <style>{`
        .ant-card-hoverable:hover .video-overlay {
          background: rgba(0, 0, 0, 0.5) !important;
        }
      `}</style>
    </div>
  );
};

export default ProductVideoGallery;
