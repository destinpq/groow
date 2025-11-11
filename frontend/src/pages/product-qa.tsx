import React, { useState, useEffect } from 'react';
import { Card, Button, List, Avatar, Space, Tag, Input, Modal, Form, Select, Upload, message, Row, Col, Tabs, Typography, Badge, Rate, Divider, Tooltip, Empty, Spin, Statistic, Progress, Timeline } from 'antd';
import { QuestionCircleOutlined, LikeOutlined, DislikeOutlined, MessageOutlined, CheckCircleOutlined, UserOutlined, PlusOutlined, SearchOutlined, FilterOutlined, StarFilled, TrophyOutlined, ClockCircleOutlined, PaperClipOutlined, SendOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { productQAAPI, type ProductQuestion, type ProductAnswer, type CreateQuestionRequest, type QAStats } from '../services/api/productQAAPI';
import './product-qa.less';

const { TextArea } = Input;
const { Option } = Select;
const { TabPane } = Tabs;
const { Title, Text, Paragraph } = Typography;
const { Search } = Input;

// Product Q&A System with Community Features
const ProductQASystem: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<ProductQuestion[]>([]);
  const [myQuestions, setMyQuestions] = useState<ProductQuestion[]>([]);
  const [stats, setStats] = useState<QAStats | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<ProductQuestion | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAnswerModal, setShowAnswerModal] = useState(false);
  const [showQuestionDetails, setShowQuestionDetails] = useState(false);
  const [activeTab, setActiveTab] = useState('browse');
  const [filters, setFilters] = useState({
    category: undefined,
    isAnswered: undefined,
    sortBy: 'newest' as const,
    search: ''
  });

  const [createForm] = Form.useForm();
  const [answerForm] = Form.useForm();

  // Sample product ID for demonstration
  const currentProductId = 'sample-product-1';

  // Load initial data
  useEffect(() => {
    loadQuestions();
    loadMyQuestions();
    loadStats();
  }, [filters]);

  const loadQuestions = async () => {
    setLoading(true);
    try {
      const response = await productQAAPI.getProductQuestions(currentProductId, filters);
      if (response.success) {
        setQuestions(response.data.questions);
      } else {
        message.error('Failed to load questions');
      }
    } catch (error) {
      console.error('Error loading questions:', error);
      message.error('Failed to load questions');
    } finally {
      setLoading(false);
    }
  };

  const loadMyQuestions = async () => {
    try {
      const response = await productQAAPI.getMyQuestions(filters);
      if (response.success) {
        setMyQuestions(response.data.questions);
      }
    } catch (error) {
      console.error('Error loading my questions:', error);
    }
  };

  const loadStats = async () => {
    try {
      const response = await productQAAPI.getQAStats(currentProductId);
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleCreateQuestion = async (values: any) => {
    try {
      const questionData: CreateQuestionRequest = {
        productId: currentProductId,
        question: values.question,
        isPublic: values.isPublic !== false,
        category: values.category,
        tags: values.tags?.split(',').map((tag: string) => tag.trim()) || []
      };

      const response = await productQAAPI.createQuestion(questionData);
      if (response.success) {
        message.success('Question posted successfully');
        setShowCreateModal(false);
        createForm.resetFields();
        loadQuestions();
        loadMyQuestions();
        loadStats();
      } else {
        message.error(response.message);
      }
    } catch (error) {
      console.error('Error creating question:', error);
      message.error('Failed to post question');
    }
  };

  const handleCreateAnswer = async (values: any) => {
    if (!selectedQuestion) return;

    try {
      const answerData = {
        questionId: selectedQuestion.id,
        answer: values.answer,
        attachments: values.attachments?.fileList?.map((file: any) => file.originFileObj) || []
      };

      const response = await productQAAPI.createAnswer(answerData);
      if (response.success) {
        message.success('Answer posted successfully');
        setShowAnswerModal(false);
        answerForm.resetFields();
        
        // Update the question with new answer
        const updatedQuestion = {
          ...selectedQuestion,
          answers: [...selectedQuestion.answers, response.data],
          isAnswered: true
        };
        setSelectedQuestion(updatedQuestion);
        
        // Refresh questions list
        loadQuestions();
        loadMyQuestions();
      } else {
        message.error(response.message);
      }
    } catch (error) {
      console.error('Error creating answer:', error);
      message.error('Failed to post answer');
    }
  };

  const handleVoteQuestion = async (questionId: string, voteType: 'up' | 'down') => {
    try {
      const response = await productQAAPI.voteQuestion(questionId, voteType);
      if (response.success) {
        // Update local state to reflect vote
        setQuestions(questions.map(q => 
          q.id === questionId 
            ? {
                ...q,
                upvotes: voteType === 'up' ? q.upvotes + 1 : q.upvotes,
                downvotes: voteType === 'down' ? q.downvotes + 1 : q.downvotes,
                hasUserVoted: true,
                userVoteType: voteType
              }
            : q
        ));
        message.success('Vote recorded');
      } else {
        message.error(response.message);
      }
    } catch (error) {
      console.error('Error voting:', error);
      message.error('Failed to record vote');
    }
  };

  const handleVoteAnswer = async (answerId: string, voteType: 'helpful' | 'not_helpful') => {
    try {
      const response = await productQAAPI.voteAnswer(answerId, voteType);
      if (response.success) {
        // Update the selected question's answers
        if (selectedQuestion) {
          const updatedAnswers = selectedQuestion.answers.map(a => 
            a.id === answerId 
              ? {
                  ...a,
                  helpfulCount: voteType === 'helpful' ? a.helpfulCount + 1 : a.helpfulCount,
                  notHelpfulCount: voteType === 'not_helpful' ? a.notHelpfulCount + 1 : a.notHelpfulCount,
                  hasUserVoted: true,
                  userVoteType: voteType
                }
              : a
          );
          setSelectedQuestion({ ...selectedQuestion, answers: updatedAnswers });
        }
        message.success('Feedback recorded');
      } else {
        message.error(response.message);
      }
    } catch (error) {
      console.error('Error voting on answer:', error);
      message.error('Failed to record feedback');
    }
  };

  const handleAcceptAnswer = async (answerId: string) => {
    try {
      const response = await productQAAPI.acceptAnswer(answerId);
      if (response.success) {
        // Update the selected question's answers
        if (selectedQuestion) {
          const updatedAnswers = selectedQuestion.answers.map(a => ({
            ...a,
            isAccepted: a.id === answerId
          }));
          setSelectedQuestion({ ...selectedQuestion, answers: updatedAnswers });
        }
        message.success('Answer marked as best answer');
      } else {
        message.error(response.message);
      }
    } catch (error) {
      console.error('Error accepting answer:', error);
      message.error('Failed to mark as best answer');
    }
  };

  const renderQuestionCard = (question: ProductQuestion) => (
    <Card
      key={question.id}
      size="small"
      style={{ marginBottom: 16 }}
      actions={[
        <Space key="vote">
          <Button
            size="small"
            type={question.hasUserVoted && question.userVoteType === 'up' ? 'primary' : 'text'}
            icon={<LikeOutlined />}
            onClick={() => handleVoteQuestion(question.id, 'up')}
          >
            {question.upvotes}
          </Button>
          <Button
            size="small"
            type={question.hasUserVoted && question.userVoteType === 'down' ? 'primary' : 'text'}
            icon={<DislikeOutlined />}
            onClick={() => handleVoteQuestion(question.id, 'down')}
          >
            {question.downvotes}
          </Button>
        </Space>,
        <Button
          key="answer"
          size="small"
          icon={<MessageOutlined />}
          onClick={() => {
            setSelectedQuestion(question);
            setShowAnswerModal(true);
          }}
        >
          Answer
        </Button>,
        <Button
          key="view"
          size="small"
          type="link"
          onClick={() => {
            setSelectedQuestion(question);
            setShowQuestionDetails(true);
          }}
        >
          View Details
        </Button>
      ]}
    >
      <Row gutter={16}>
        <Col flex={1}>
          <div style={{ marginBottom: 8 }}>
            <Text strong style={{ fontSize: '16px' }}>
              {question.question}
            </Text>
          </div>
          
          <Space wrap style={{ marginBottom: 8 }}>
            {question.category && (
              <Tag color="blue">{question.category}</Tag>
            )}
            {question.tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
            {question.isAnswered && (
              <Tag color="green" icon={<CheckCircleOutlined />}>
                Answered ({question.answers.length})
              </Tag>
            )}
          </Space>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Space>
              <Avatar 
                size="small" 
                src={question.customerAvatar} 
                icon={<UserOutlined />} 
              />
              <Text type="secondary">{question.customerName}</Text>
              <Text type="secondary">
                {new Date(question.createdAt).toLocaleDateString()}
              </Text>
            </Space>
            
            {question.isAnswered && question.answers.some(a => a.isBrandResponse) && (
              <Tag color="gold" icon={<TrophyOutlined />}>
                Brand Answered
              </Tag>
            )}
          </div>
        </Col>

        {question.productImage && (
          <Col>
            <Avatar
              size={64}
              shape="square"
              src={question.productImage}
              style={{ border: '1px solid #d9d9d9' }}
            />
          </Col>
        )}
      </Row>
    </Card>
  );

  const renderAnswer = (answer: ProductAnswer, questionOwnerId?: string) => (
    <Card
      key={answer.id}
      size="small"
      style={{
        marginBottom: 12,
        backgroundColor: answer.isAccepted ? '#f6ffed' : undefined,
        border: answer.isAccepted ? '2px solid #52c41a' : undefined
      }}
    >
      <div style={{ marginBottom: 8 }}>
        <Space>
          <Avatar
            size="small"
            src={answer.answeredBy.avatar}
            icon={<UserOutlined />}
          />
          <Text strong>{answer.answeredBy.name}</Text>
          
          {answer.answeredBy.type === 'vendor' && (
            <Tag color="gold">
              {answer.answeredBy.badge || 'Vendor'}
            </Tag>
          )}
          
          {answer.answeredBy.type === 'expert' && (
            <Tag color="purple">
              {answer.answeredBy.badge || 'Expert'}
            </Tag>
          )}
          
          {answer.answeredBy.verificationLevel === 'verified_purchase' && (
            <Tag color="green">Verified Purchase</Tag>
          )}
          
          {answer.isAccepted && (
            <Tag color="success" icon={<CheckCircleOutlined />}>
              Best Answer
            </Tag>
          )}
          
          <Text type="secondary">
            {new Date(answer.createdAt).toLocaleDateString()}
          </Text>
        </Space>
      </div>

      <Paragraph style={{ marginBottom: 12 }}>
        {answer.answer}
      </Paragraph>

      {answer.attachments && answer.attachments.length > 0 && (
        <div style={{ marginBottom: 12 }}>
          <Text type="secondary">Attachments:</Text>
          <Row gutter={8} style={{ marginTop: 4 }}>
            {answer.attachments.map((attachment) => (
              <Col key={attachment.id}>
                {attachment.type === 'image' ? (
                  <img
                    src={attachment.thumbnail || attachment.url}
                    alt={attachment.filename}
                    style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 4 }}
                  />
                ) : (
                  <Button size="small" icon={<PaperClipOutlined />}>
                    {attachment.filename}
                  </Button>
                )}
              </Col>
            ))}
          </Row>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Space>
          <Button
            size="small"
            type={answer.hasUserVoted && answer.userVoteType === 'helpful' ? 'primary' : 'text'}
            onClick={() => handleVoteAnswer(answer.id, 'helpful')}
          >
            👍 Helpful ({answer.helpfulCount})
          </Button>
          <Button
            size="small"
            type={answer.hasUserVoted && answer.userVoteType === 'not_helpful' ? 'primary' : 'text'}
            onClick={() => handleVoteAnswer(answer.id, 'not_helpful')}
          >
            👎 Not Helpful ({answer.notHelpfulCount})
          </Button>
        </Space>

        {/* Only question owner can accept answers */}
        {questionOwnerId === '1' && !answer.isAccepted && (
          <Button
            size="small"
            type="primary"
            ghost
            icon={<CheckCircleOutlined />}
            onClick={() => handleAcceptAnswer(answer.id)}
          >
            Mark as Best Answer
          </Button>
        )}
      </div>
    </Card>
  );

  const renderStats = () => (
    <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
      <Col xs={12} sm={6}>
        <Card size="small">
          <Statistic
            title="Total Questions"
            value={stats?.totalQuestions || 0}
            prefix={<QuestionCircleOutlined />}
          />
        </Card>
      </Col>
      <Col xs={12} sm={6}>
        <Card size="small">
          <Statistic
            title="Answered"
            value={stats?.answeredQuestions || 0}
            prefix={<CheckCircleOutlined />}
            valueStyle={{ color: '#52c41a' }}
          />
          {stats && (
            <Progress
              percent={Math.round((stats.answeredQuestions / stats.totalQuestions) * 100)}
              size="small"
              showInfo={false}
            />
          )}
        </Card>
      </Col>
      <Col xs={12} sm={6}>
        <Card size="small">
          <Statistic
            title="Avg Response Time"
            value={stats?.averageResponseTime || 0}
            suffix="hrs"
            prefix={<ClockCircleOutlined />}
            precision={1}
          />
        </Card>
      </Col>
      <Col xs={12} sm={6}>
        <Card size="small">
          <Statistic
            title="Unanswered"
            value={stats?.unansweredQuestions || 0}
            prefix={<QuestionCircleOutlined />}
            valueStyle={{ color: '#faad14' }}
          />
        </Card>
      </Col>
    </Row>
  );

  const renderCreateQuestionModal = () => (
    <Modal
      title="Ask a Question"
      open={showCreateModal}
      onCancel={() => {
        setShowCreateModal(false);
        createForm.resetFields();
      }}
      footer={null}
      width={600}
    >
      <Form
        form={createForm}
        layout="vertical"
        onFinish={handleCreateQuestion}
      >
        <Form.Item
          label="Your Question"
          name="question"
          rules={[
            { required: true, message: 'Please enter your question' },
            { min: 10, message: 'Question must be at least 10 characters' }
          ]}
        >
          <TextArea
            rows={4}
            placeholder="What would you like to know about this product?"
          />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Category" name="category">
              <Select placeholder="Select category (optional)">
                <Option value="general">General Question</Option>
                <Option value="specifications">Specifications</Option>
                <Option value="compatibility">Compatibility</Option>
                <Option value="shipping">Shipping</Option>
                <Option value="warranty">Warranty</Option>
                <Option value="usage">Usage Instructions</Option>
                <Option value="comparison">Product Comparison</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Tags" name="tags">
              <Input placeholder="e.g., macbook, wireless, bluetooth" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="isPublic" valuePropName="checked" initialValue={true}>
          <Space>
            <input type="checkbox" defaultChecked />
            <Text>Make this question public (recommended for faster answers)</Text>
          </Space>
        </Form.Item>

        <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
          <Space>
            <Button onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" icon={<SendOutlined />}>
              Post Question
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );

  const renderAnswerModal = () => (
    <Modal
      title={`Answer: ${selectedQuestion?.question}`}
      open={showAnswerModal}
      onCancel={() => {
        setShowAnswerModal(false);
        answerForm.resetFields();
      }}
      footer={null}
      width={600}
    >
      <Form
        form={answerForm}
        layout="vertical"
        onFinish={handleCreateAnswer}
      >
        <Form.Item
          label="Your Answer"
          name="answer"
          rules={[
            { required: true, message: 'Please provide an answer' },
            { min: 10, message: 'Answer must be at least 10 characters' }
          ]}
        >
          <TextArea
            rows={6}
            placeholder="Share your knowledge and help other customers..."
          />
        </Form.Item>

        <Form.Item label="Attachments" name="attachments">
          <Upload
            multiple
            beforeUpload={() => false}
            fileList={[]}
          >
            <Button icon={<PaperClipOutlined />}>
              Attach Images or Documents
            </Button>
          </Upload>
          <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginTop: 4 }}>
            Add screenshots, manuals, or other helpful files
          </Text>
        </Form.Item>

        <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
          <Space>
            <Button onClick={() => setShowAnswerModal(false)}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" icon={<SendOutlined />}>
              Post Answer
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );

  const renderQuestionDetails = () => (
    <Modal
      title="Question Details"
      open={showQuestionDetails}
      onCancel={() => {
        setShowQuestionDetails(false);
        setSelectedQuestion(null);
      }}
      width={800}
      footer={null}
    >
      {selectedQuestion && (
        <div>
          <Card style={{ marginBottom: 16 }}>
            <div style={{ marginBottom: 16 }}>
              <Title level={4}>{selectedQuestion.question}</Title>
              <Space wrap>
                {selectedQuestion.category && (
                  <Tag color="blue">{selectedQuestion.category}</Tag>
                )}
                {selectedQuestion.tags.map((tag) => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </Space>
            </div>

            <Space style={{ marginBottom: 16 }}>
              <Avatar 
                src={selectedQuestion.customerAvatar} 
                icon={<UserOutlined />} 
              />
              <div>
                <Text strong>{selectedQuestion.customerName}</Text>
                <br />
                <Text type="secondary">
                  Asked {new Date(selectedQuestion.createdAt).toLocaleDateString()}
                </Text>
              </div>
            </Space>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Space>
                <Button
                  type={selectedQuestion.hasUserVoted && selectedQuestion.userVoteType === 'up' ? 'primary' : 'default'}
                  icon={<LikeOutlined />}
                  onClick={() => handleVoteQuestion(selectedQuestion.id, 'up')}
                >
                  {selectedQuestion.upvotes}
                </Button>
                <Button
                  type={selectedQuestion.hasUserVoted && selectedQuestion.userVoteType === 'down' ? 'primary' : 'default'}
                  icon={<DislikeOutlined />}
                  onClick={() => handleVoteQuestion(selectedQuestion.id, 'down')}
                >
                  {selectedQuestion.downvotes}
                </Button>
              </Space>
              
              <Button
                type="primary"
                icon={<MessageOutlined />}
                onClick={() => setShowAnswerModal(true)}
              >
                Add Answer
              </Button>
            </div>
          </Card>

          <Card title={`${selectedQuestion.answers.length} Answer${selectedQuestion.answers.length !== 1 ? 's' : ''}`}>
            {selectedQuestion.answers.length > 0 ? (
              selectedQuestion.answers
                .sort((a, b) => {
                  // Sort by: accepted first, then by helpful votes
                  if (a.isAccepted && !b.isAccepted) return -1;
                  if (!a.isAccepted && b.isAccepted) return 1;
                  return b.helpfulCount - a.helpfulCount;
                })
                .map((answer) => renderAnswer(answer, selectedQuestion.customerId))
            ) : (
              <Empty description="No answers yet" style={{ padding: '40px 0' }}>
                <Button type="primary" onClick={() => setShowAnswerModal(true)}>
                  Be the first to answer
                </Button>
              </Empty>
            )}
          </Card>
        </div>
      )}
    </Modal>
  );

  return (
    <div className="product-qa" style={{ padding: '24px', maxWidth: 1400, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <Title level={2}>
          <QuestionCircleOutlined /> Product Q&A
        </Title>
        <Text type="secondary">
          Ask questions and get answers from our community of customers and experts
        </Text>
      </div>

      {/* Stats */}
      {renderStats()}

      {/* Tabs */}
      <Tabs activeKey={activeTab} onChange={setActiveTab} size="large">
        <TabPane
          tab={
            <Space>
              <QuestionCircleOutlined />
              Browse Questions
              {questions.length > 0 && <Badge count={questions.length} />}
            </Space>
          }
          key="browse"
        >
          {/* Filters and Actions */}
          <Card size="small" style={{ marginBottom: 16 }}>
            <Row gutter={16} align="middle">
              <Col flex={1}>
                <Search
                  placeholder="Search questions..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  onSearch={loadQuestions}
                  allowClear
                />
              </Col>
              <Col>
                <Space>
                  <Select
                    placeholder="Category"
                    allowClear
                    style={{ width: 130 }}
                    value={filters.category}
                    onChange={(value) => setFilters({ ...filters, category: value })}
                  >
                    <Option value="general">General</Option>
                    <Option value="specifications">Specs</Option>
                    <Option value="compatibility">Compatibility</Option>
                    <Option value="warranty">Warranty</Option>
                    <Option value="shipping">Shipping</Option>
                  </Select>
                  
                  <Select
                    placeholder="Status"
                    allowClear
                    style={{ width: 120 }}
                    value={filters.isAnswered}
                    onChange={(value) => setFilters({ ...filters, isAnswered: value })}
                  >
                    <Option value={true}>Answered</Option>
                    <Option value={false}>Unanswered</Option>
                  </Select>

                  <Select
                    placeholder="Sort by"
                    style={{ width: 120 }}
                    value={filters.sortBy}
                    onChange={(value) => setFilters({ ...filters, sortBy: value })}
                  >
                    <Option value="newest">Newest</Option>
                    <Option value="oldest">Oldest</Option>
                    <Option value="most_voted">Most Voted</Option>
                    <Option value="most_answered">Most Answered</Option>
                  </Select>

                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setShowCreateModal(true)}
                  >
                    Ask Question
                  </Button>
                </Space>
              </Col>
            </Row>
          </Card>

          {/* Questions List */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: 40 }}>
              <Spin size="large" />
            </div>
          ) : questions.length > 0 ? (
            questions.map(renderQuestionCard)
          ) : (
            <Card style={{ textAlign: 'center', padding: '60px 20px' }}>
              <QuestionCircleOutlined style={{ fontSize: 48, color: '#d9d9d9', marginBottom: 16 }} />
              <Title level={3}>No questions yet</Title>
              <Paragraph style={{ color: '#666', marginBottom: 24 }}>
                Be the first to ask a question about this product!
              </Paragraph>
              <Button type="primary" size="large" onClick={() => setShowCreateModal(true)}>
                Ask the First Question
              </Button>
            </Card>
          )}
        </TabPane>

        <TabPane
          tab={
            <Space>
              <UserOutlined />
              My Questions
              {myQuestions.length > 0 && <Badge count={myQuestions.length} />}
            </Space>
          }
          key="my-questions"
        >
          <div style={{ marginBottom: 16, textAlign: 'right' }}>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setShowCreateModal(true)}>
              Ask New Question
            </Button>
          </div>

          {myQuestions.length > 0 ? (
            myQuestions.map(renderQuestionCard)
          ) : (
            <Empty
              description="You haven't asked any questions yet"
              style={{ padding: '60px 20px' }}
            >
              <Button type="primary" onClick={() => setShowCreateModal(true)}>
                Ask Your First Question
              </Button>
            </Empty>
          )}
        </TabPane>
      </Tabs>

      {/* Modals */}
      {renderCreateQuestionModal()}
      {renderAnswerModal()}
      {renderQuestionDetails()}
    </div>
  );
};

export default ProductQASystem;