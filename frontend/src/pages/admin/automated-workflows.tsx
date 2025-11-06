import React, { useState } from 'react';
import { Card, Table, Button, Space, Tag, Row, Col, Modal, Form, Input, Select, Switch, InputNumber, Typography, Alert, Tabs, Timeline, Progress } from 'antd';
import { PlayCircleOutlined, PauseCircleOutlined, EditOutlined, DeleteOutlined, PlusOutlined, ClockCircleOutlined, CheckCircleOutlined, ExclamationCircleOutlined, RobotOutlined, SettingOutlined } from '@ant-design/icons';

const { Option } = Select;
const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { TextArea } = Input;

const AutomatedWorkflowsPage: React.FC = () => {
  const [workflows, setWorkflows] = useState([
    {
      id: 1,
      name: 'Auto Reorder Alert',
      description: 'Automatically send alerts when inventory falls below threshold',
      trigger: 'Inventory Level',
      status: 'active',
      lastRun: '2024-01-15 14:30',
      nextRun: '2024-01-16 00:00',
      category: 'inventory',
    },
    {
      id: 2,
      name: 'Price Monitoring',
      description: 'Monitor competitor prices and suggest adjustments',
      trigger: 'Daily Schedule',
      status: 'active',
      lastRun: '2024-01-15 06:00',
      nextRun: '2024-01-16 06:00',
      category: 'pricing',
    },
    {
      id: 3,
      name: 'Vendor Performance Review',
      description: 'Monthly vendor performance evaluation and reporting',
      trigger: 'Monthly Schedule',
      status: 'paused',
      lastRun: '2024-01-01 00:00',
      nextRun: '2024-02-01 00:00',
      category: 'vendor',
    },
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingWorkflow, setEditingWorkflow] = useState<any>(null);
  const [form] = Form.useForm();

  const workflowHistory = [
    { time: '2024-01-15 14:30', action: 'Auto Reorder Alert executed', status: 'success', details: '15 products flagged for reorder' },
    { time: '2024-01-15 12:00', action: 'Bulk Price Update completed', status: 'success', details: '142 products updated' },
    { time: '2024-01-15 06:00', action: 'Price Monitoring scan', status: 'success', details: '5 pricing recommendations generated' },
    { time: '2024-01-14 23:45', action: 'Inventory Sync failed', status: 'error', details: 'Connection timeout to vendor API' },
  ];

  const activeRuns = [
    { id: 1, workflow: 'Inventory Sync', progress: 75, status: 'running', eta: '5 minutes' },
    { id: 2, workflow: 'Customer Email Campaign', progress: 45, status: 'running', eta: '12 minutes' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'green';
      case 'paused': return 'orange';
      case 'error': return 'red';
      default: return 'blue';
    }
  };

  const getHistoryStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'green';
      case 'error': return 'red';
      case 'warning': return 'orange';
      default: return 'blue';
    }
  };

  const toggleWorkflowStatus = (id: number) => {
    setWorkflows(prev => prev.map(w => 
      w.id === id 
        ? { ...w, status: w.status === 'active' ? 'paused' : 'active' }
        : w
    ));
  };

  const handleCreateWorkflow = () => {
    setEditingWorkflow(null);
    setIsModalVisible(true);
    form.resetFields();
  };

  const handleEditWorkflow = (workflow: any) => {
    setEditingWorkflow(workflow);
    setIsModalVisible(true);
    form.setFieldsValue(workflow);
  };

  const handleSaveWorkflow = async () => {
    try {
      const values = await form.validateFields();
      if (editingWorkflow) {
        setWorkflows(prev => prev.map(w => 
          w.id === editingWorkflow.id ? { ...w, ...values } : w
        ));
      } else {
        const newWorkflow = {
          id: Date.now(),
          ...values,
          status: 'active',
          lastRun: '-',
          nextRun: 'Pending',
        };
        setWorkflows(prev => [...prev, newWorkflow]);
      }
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const workflowColumns = [
    {
      title: 'Workflow',
      key: 'workflow',
      render: (record: any) => (
        <div>
          <Text strong>{record.name}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: '12px' }}>{record.description}</Text>
        </div>
      ),
      width: 300,
    },
    {
      title: 'Trigger',
      dataIndex: 'trigger',
      key: 'trigger',
      width: 120,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)} icon={status === 'active' ? <CheckCircleOutlined /> : <PauseCircleOutlined />}>
          {status.toUpperCase()}
        </Tag>
      ),
      width: 100,
    },
    {
      title: 'Last Run',
      dataIndex: 'lastRun',
      key: 'lastRun',
      width: 140,
    },
    {
      title: 'Next Run',
      dataIndex: 'nextRun',
      key: 'nextRun',
      width: 140,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: any) => (
        <Space>
          <Button 
            size="small" 
            icon={record.status === 'active' ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
            onClick={() => toggleWorkflowStatus(record.id)}
          >
            {record.status === 'active' ? 'Pause' : 'Resume'}
          </Button>
          <Button size="small" icon={<EditOutlined />} onClick={() => handleEditWorkflow(record)} />
          <Button size="small" icon={<DeleteOutlined />} danger />
        </Space>
      ),
      width: 180,
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={2}>
          <RobotOutlined style={{ marginRight: 8 }} />
          Automated Workflows
        </Title>
        <Text type="secondary">Phase 4 - Intelligent automation system</Text>
      </div>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Text type="secondary">Active Workflows</Text>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#52c41a' }}>
              {workflows.filter(w => w.status === 'active').length}
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Text type="secondary">Total Executions Today</Text>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1890ff' }}>
              47
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Text type="secondary">Success Rate</Text>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#52c41a' }}>
              98.2%
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Text type="secondary">Time Saved</Text>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#722ed1' }}>
              12.5h
            </div>
          </Card>
        </Col>
      </Row>

      <Tabs defaultActiveKey="workflows">
        <TabPane tab="Workflow Management" key="workflows">
          <Card
            title="Automated Workflows"
            extra={
              <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateWorkflow}>
                Create Workflow
              </Button>
            }
          >
            <Table
              columns={workflowColumns}
              dataSource={workflows}
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </TabPane>

        <TabPane tab="Active Runs" key="running">
          <Card title="Currently Running Workflows">
            {activeRuns.map(run => (
              <Card key={run.id} size="small" style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <Text strong>{run.workflow}</Text>
                    <br />
                    <Text type="secondary">ETA: {run.eta}</Text>
                  </div>
                  <div style={{ width: 200 }}>
                    <Progress percent={run.progress} status="active" />
                  </div>
                  <Button size="small" icon={<PauseCircleOutlined />}>
                    Pause
                  </Button>
                </div>
              </Card>
            ))}
          </Card>
        </TabPane>

        <TabPane tab="Execution History" key="history">
          <Card title="Recent Workflow Executions">
            <Timeline>
              {workflowHistory.map((item, index) => (
                <Timeline.Item
                  key={index}
                  color={getHistoryStatusColor(item.status)}
                  dot={item.status === 'error' ? <ExclamationCircleOutlined /> : <CheckCircleOutlined />}
                >
                  <div>
                    <Text strong>{item.action}</Text>
                    <br />
                    <Text type="secondary">{item.time}</Text>
                    <br />
                    <Text>{item.details}</Text>
                  </div>
                </Timeline.Item>
              ))}
            </Timeline>
          </Card>
        </TabPane>

        <TabPane tab="Workflow Templates" key="templates">
          <Row gutter={16}>
            <Col span={8}>
              <Card 
                title="Inventory Management" 
                actions={[<Button type="link">Use Template</Button>]}
              >
                <Alert message="Auto-reorder alerts, stock level monitoring, and supplier notifications" type="info" />
              </Card>
            </Col>
            <Col span={8}>
              <Card 
                title="Price Optimization" 
                actions={[<Button type="link">Use Template</Button>]}
              >
                <Alert message="Competitor price monitoring, dynamic pricing, and profit margin optimization" type="info" />
              </Card>
            </Col>
            <Col span={8}>
              <Card 
                title="Customer Engagement" 
                actions={[<Button type="link">Use Template</Button>]}
              >
                <Alert message="Automated email campaigns, loyalty rewards, and personalized recommendations" type="info" />
              </Card>
            </Col>
          </Row>
        </TabPane>
      </Tabs>

      <Modal
        title={editingWorkflow ? 'Edit Workflow' : 'Create New Workflow'}
        visible={isModalVisible}
        onOk={handleSaveWorkflow}
        onCancel={() => setIsModalVisible(false)}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Workflow Name" name="name" rules={[{ required: true }]}>
            <Input placeholder="Enter workflow name" />
          </Form.Item>
          
          <Form.Item label="Description" name="description" rules={[{ required: true }]}>
            <TextArea placeholder="Describe what this workflow does" rows={3} />
          </Form.Item>
          
          <Form.Item label="Category" name="category" rules={[{ required: true }]}>
            <Select placeholder="Select category">
              <Option value="inventory">Inventory Management</Option>
              <Option value="pricing">Price Optimization</Option>
              <Option value="vendor">Vendor Management</Option>
              <Option value="customer">Customer Engagement</Option>
              <Option value="reporting">Reporting & Analytics</Option>
            </Select>
          </Form.Item>
          
          <Form.Item label="Trigger Type" name="trigger" rules={[{ required: true }]}>
            <Select placeholder="Select trigger">
              <Option value="Manual">Manual Execution</Option>
              <Option value="Daily Schedule">Daily Schedule</Option>
              <Option value="Weekly Schedule">Weekly Schedule</Option>
              <Option value="Monthly Schedule">Monthly Schedule</Option>
              <Option value="Inventory Level">Inventory Level Trigger</Option>
              <Option value="Price Change">Price Change Trigger</Option>
              <Option value="Order Event">Order Event Trigger</Option>
            </Select>
          </Form.Item>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Priority" name="priority">
                <Select placeholder="Select priority" defaultValue="medium">
                  <Option value="low">Low</Option>
                  <Option value="medium">Medium</Option>
                  <Option value="high">High</Option>
                  <Option value="critical">Critical</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Timeout (minutes)" name="timeout">
                <InputNumber style={{ width: '100%' }} defaultValue={30} min={1} max={1440} />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item label="Auto-start" name="autoStart" valuePropName="checked">
            <Switch defaultChecked />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AutomatedWorkflowsPage;
