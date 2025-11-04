import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Form,
  Select,
  DatePicker,
  Button,
  Space,
  Typography,
  Table,
  Checkbox,
  Radio,
  Divider,
  message,
} from 'antd';
import {
  DownloadOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  PlusOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

interface ReportField {
  key: string;
  label: string;
  type: string;
}

const availableFields: ReportField[] = [
  { key: 'order_id', label: 'Order ID', type: 'orders' },
  { key: 'order_date', label: 'Order Date', type: 'orders' },
  { key: 'customer_name', label: 'Customer Name', type: 'orders' },
  { key: 'total_amount', label: 'Total Amount', type: 'orders' },
  { key: 'status', label: 'Status', type: 'orders' },
  { key: 'product_name', label: 'Product Name', type: 'products' },
  { key: 'category', label: 'Category', type: 'products' },
  { key: 'price', label: 'Price', type: 'products' },
  { key: 'stock', label: 'Stock', type: 'products' },
  { key: 'sales_count', label: 'Sales Count', type: 'products' },
  { key: 'vendor_name', label: 'Vendor Name', type: 'vendors' },
  { key: 'vendor_email', label: 'Vendor Email', type: 'vendors' },
  { key: 'revenue', label: 'Revenue', type: 'vendors' },
  { key: 'commission', label: 'Commission', type: 'vendors' },
];

const mockReportData = [
  {
    id: 1,
    order_id: 'ORD-2024-10001',
    order_date: '2024-11-01',
    customer_name: 'John Doe',
    total_amount: 399.99,
    status: 'Delivered',
    product_name: 'Wireless Headphones',
    category: 'Electronics',
    price: 49.99,
    stock: 156,
    sales_count: 245,
    vendor_name: 'TechStore Inc',
    vendor_email: 'contact@techstore.com',
    revenue: 45600,
    commission: 6840,
  },
  {
    id: 2,
    order_id: 'ORD-2024-10002',
    order_date: '2024-11-02',
    customer_name: 'Sarah Smith',
    total_amount: 199.99,
    status: 'Processing',
    product_name: 'Smart Watch',
    category: 'Electronics',
    price: 199.99,
    stock: 89,
    sales_count: 189,
    vendor_name: 'Fashion Hub',
    vendor_email: 'info@fashionhub.com',
    revenue: 78900,
    commission: 11835,
  },
  {
    id: 3,
    order_id: 'ORD-2024-10003',
    order_date: '2024-11-03',
    customer_name: 'Mike Johnson',
    total_amount: 35.00,
    status: 'Delivered',
    product_name: 'Laptop Stand',
    category: 'Accessories',
    price: 35.00,
    stock: 234,
    sales_count: 156,
    vendor_name: 'Electronics World',
    vendor_email: 'sales@electronicsworld.com',
    revenue: 23400,
    commission: 3510,
  },
];

const AdminCustomReportPage: React.FC = () => {
  const [form] = Form.useForm();
  const [reportType, setReportType] = useState<string>('orders');
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [reportData, setReportData] = useState<any[]>([]);
  const [exportFormat, setExportFormat] = useState<string>('pdf');

  const handleReportTypeChange = (value: string) => {
    setReportType(value);
    setSelectedFields([]);
    setReportData([]);
  };

  const handleFieldToggle = (field: string) => {
    setSelectedFields(prev =>
      prev.includes(field)
        ? prev.filter(f => f !== field)
        : [...prev, field]
    );
  };

  const handleGenerateReport = () => {
    if (selectedFields.length === 0) {
      message.warning('Please select at least one field');
      return;
    }

    // Mock report generation
    setReportData(mockReportData);
    message.success('Report generated successfully');
  };

  const handleExportReport = () => {
    if (reportData.length === 0) {
      message.warning('Please generate a report first');
      return;
    }

    message.success(`Exporting report as ${exportFormat.toUpperCase()}...`);
  };

  const handleSaveTemplate = () => {
    if (selectedFields.length === 0) {
      message.warning('Please select fields before saving template');
      return;
    }

    message.success('Report template saved successfully');
  };

  // Generate dynamic columns based on selected fields
  const columns: ColumnsType<any> = selectedFields.map(field => {
    const fieldInfo = availableFields.find(f => f.key === field);
    return {
      title: fieldInfo?.label || field,
      dataIndex: field,
      key: field,
      render: (value: any) => {
        if (typeof value === 'number' && (field.includes('amount') || field.includes('price') || field.includes('revenue') || field.includes('commission'))) {
          return `$${value.toLocaleString()}`;
        }
        return value;
      },
    };
  });

  const filteredFields = availableFields.filter(f => f.type === reportType);

  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>Custom Report Builder</Title>

      <Row gutter={16}>
        {/* Report Configuration */}
        <Col xs={24} lg={8}>
          <Card title="Report Configuration" bordered={false}>
            <Form form={form} layout="vertical">
              <Form.Item label="Report Type" name="reportType">
                <Select
                  value={reportType}
                  onChange={handleReportTypeChange}
                  placeholder="Select report type"
                >
                  <Option value="orders">Orders Report</Option>
                  <Option value="products">Products Report</Option>
                  <Option value="vendors">Vendors Report</Option>
                  <Option value="customers">Customers Report</Option>
                </Select>
              </Form.Item>

              <Form.Item label="Date Range" name="dateRange">
                <RangePicker style={{ width: '100%' }} />
              </Form.Item>

              <Divider>Select Fields</Divider>

              <div style={{ maxHeight: 300, overflowY: 'auto' }}>
                <Space direction="vertical" style={{ width: '100%' }}>
                  {filteredFields.map(field => (
                    <Checkbox
                      key={field.key}
                      checked={selectedFields.includes(field.key)}
                      onChange={() => handleFieldToggle(field.key)}
                    >
                      {field.label}
                    </Checkbox>
                  ))}
                </Space>
              </div>

              <Divider />

              <Form.Item label="Filters (Optional)">
                <Select mode="multiple" placeholder="Add filters" style={{ width: '100%' }}>
                  <Option value="status_new">Status: New</Option>
                  <Option value="status_delivered">Status: Delivered</Option>
                  <Option value="amount_gt_100">Amount &gt; $100</Option>
                  <Option value="stock_low">Low Stock</Option>
                </Select>
              </Form.Item>

              <Form.Item label="Sort By">
                <Select placeholder="Select sort field">
                  {selectedFields.map(field => (
                    <Option key={field} value={field}>
                      {availableFields.find(f => f.key === field)?.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Space direction="vertical" style={{ width: '100%' }}>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={handleGenerateReport}
                  block
                >
                  Generate Report
                </Button>
                <Button
                  icon={<PlusOutlined />}
                  onClick={handleSaveTemplate}
                  block
                >
                  Save as Template
                </Button>
              </Space>
            </Form>
          </Card>

          {/* Export Options */}
          <Card title="Export Options" bordered={false} style={{ marginTop: 16 }}>
            <Form.Item label="Export Format">
              <Radio.Group value={exportFormat} onChange={e => setExportFormat(e.target.value)}>
                <Space direction="vertical">
                  <Radio value="pdf">
                    <FilePdfOutlined /> PDF Document
                  </Radio>
                  <Radio value="excel">
                    <FileExcelOutlined /> Excel Spreadsheet
                  </Radio>
                  <Radio value="csv">
                    <FileExcelOutlined /> CSV File
                  </Radio>
                </Space>
              </Radio.Group>
            </Form.Item>

            <Button
              type="primary"
              icon={<DownloadOutlined />}
              onClick={handleExportReport}
              block
              disabled={reportData.length === 0}
            >
              Export Report
            </Button>
          </Card>
        </Col>

        {/* Report Preview */}
        <Col xs={24} lg={16}>
          <Card
            title="Report Preview"
            bordered={false}
            extra={
              reportData.length > 0 && (
                <Space>
                  <Text type="secondary">{reportData.length} records</Text>
                  <Button
                    size="small"
                    icon={<DeleteOutlined />}
                    onClick={() => setReportData([])}
                  >
                    Clear
                  </Button>
                </Space>
              )
            }
          >
            {reportData.length > 0 ? (
              <Table
                columns={columns}
                dataSource={reportData}
                rowKey="id"
                scroll={{ x: 'max-content' }}
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  showTotal: (total) => `Total ${total} records`,
                }}
              />
            ) : (
              <div style={{ textAlign: 'center', padding: '60px 0' }}>
                <Text type="secondary">
                  Configure your report settings and click "Generate Report" to preview data
                </Text>
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminCustomReportPage;
