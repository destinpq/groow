/**
 * ⚠️ SAFE API RESPONSE HANDLING - ALWAYS USE THIS PATTERN:
 * 
 * const dataArray = response?.data?.data || response?.data || [];
 * const total = response?.data?.meta?.total || response?.meta?.total || response?.total || 0;
 * 
 * Before using .map()/.filter()/.forEach():
 * setItems(Array.isArray(dataArray) ? dataArray : []);
 */

import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Button,
  Space,
  Select,
  DatePicker,
  Table,
  Tag,
  message,
  Statistic,
  Divider,
  Radio,
  Checkbox,
  Alert,
} from 'antd';
import {
  DownloadOutlined,
  FileExcelOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import * as XLSX from 'xlsx';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

interface ExportTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  columns: string[];
}

const templates: ExportTemplate[] = [
  {
    id: 'sales_report',
    name: 'Sales Report',
    description: 'Detailed sales data with revenue and products',
    category: 'Sales',
    columns: ['Order ID', 'Date', 'Customer', 'Product', 'Quantity', 'Amount', 'Status'],
  },
  {
    id: 'inventory_report',
    name: 'Inventory Report',
    description: 'Current stock levels and product information',
    category: 'Inventory',
    columns: ['SKU', 'Product', 'Category', 'Stock', 'Reserved', 'Available', 'Price'],
  },
  {
    id: 'customer_report',
    name: 'Customer Report',
    description: 'Customer database with purchase history',
    category: 'Customers',
    columns: ['ID', 'Name', 'Email', 'Phone', 'Orders', 'Total Spent', 'Join Date'],
  },
  {
    id: 'vendor_report',
    name: 'Vendor Report',
    description: 'Vendor performance and metrics',
    category: 'Vendors',
    columns: ['ID', 'Name', 'Products', 'Orders', 'Revenue', 'Rating', 'Status'],
  },
  {
    id: 'order_report',
    name: 'Order Report',
    description: 'Complete order details and fulfillment',
    category: 'Orders',
    columns: ['Order ID', 'Date', 'Customer', 'Items', 'Total', 'Payment', 'Status', 'Shipping'],
  },
  {
    id: 'financial_report',
    name: 'Financial Report',
    description: 'Revenue, expenses, and profit analysis',
    category: 'Finance',
    columns: ['Period', 'Revenue', 'Expenses', 'Profit', 'Margin', 'Orders', 'AOV'],
  },
];

// Mock data generators
const generateSalesData = () => {
  return Array.from({ length: 50 }, (_, i) => ({
    'Order ID': `ORD-${12000 + i}`,
    Date: dayjs().subtract(i, 'day').format('YYYY-MM-DD'),
    Customer: `Customer ${i + 1}`,
    Product: ['Laptop', 'Phone', 'Tablet', 'Headphones', 'Watch'][i % 5],
    Quantity: Math.floor(Math.random() * 5) + 1,
    Amount: (Math.random() * 1000 + 100).toFixed(2),
    Status: ['Completed', 'Processing', 'Shipped', 'Delivered'][i % 4],
  }));
};

const generateInventoryData = () => {
  return Array.from({ length: 30 }, (_, i) => ({
    SKU: `SKU-${1000 + i}`,
    Product: `Product ${i + 1}`,
    Category: ['Electronics', 'Clothing', 'Home', 'Sports'][i % 4],
    Stock: Math.floor(Math.random() * 200),
    Reserved: Math.floor(Math.random() * 20),
    Available: Math.floor(Math.random() * 180),
    Price: (Math.random() * 500 + 50).toFixed(2),
  }));
};

const generateCustomerData = () => {
  return Array.from({ length: 40 }, (_, i) => ({
    ID: `CUST-${5000 + i}`,
    Name: `Customer ${i + 1}`,
    Email: `customer${i + 1}@example.com`,
    Phone: `+1-555-${String(i).padStart(4, '0')}`,
    Orders: Math.floor(Math.random() * 20) + 1,
    'Total Spent': (Math.random() * 5000 + 500).toFixed(2),
    'Join Date': dayjs().subtract(i * 10, 'day').format('YYYY-MM-DD'),
  }));
};

const ExcelExportPage: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('sales_report');
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>([
    dayjs().subtract(30, 'day'),
    dayjs(),
  ]);
  const [fileFormat, setFileFormat] = useState<'xlsx' | 'csv'>('xlsx');
  const [includeHeaders, setIncludeHeaders] = useState(true);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [exportHistory, setExportHistory] = useState<any[]>([]);

  const currentTemplate = templates.find((t) => t.id === selectedTemplate);

  const getDataForTemplate = (templateId: string) => {
    switch (templateId) {
      case 'sales_report':
        return generateSalesData();
      case 'inventory_report':
        return generateInventoryData();
      case 'customer_report':
        return generateCustomerData();
      default:
        return generateSalesData();
    }
  };

  const handleExport = () => {
    const data = getDataForTemplate(selectedTemplate);

    // Filter columns if specific columns are selected
    let exportData = data;
    if (selectedColumns.length > 0) {
      exportData = data.map((row: any) => {
        const filteredRow: any = {};
        selectedColumns.forEach((col) => {
          filteredRow[col] = row[col];
        });
        return filteredRow;
      });
    }

    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(exportData, { skipHeader: !includeHeaders });

    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, currentTemplate?.name || 'Report');

    // Add metadata sheet
    const metadata = [
      { Field: 'Report Name', Value: currentTemplate?.name },
      { Field: 'Generated By', Value: 'Admin User' },
      { Field: 'Generated On', Value: dayjs().format('YYYY-MM-DD HH:mm:ss') },
      { Field: 'Date Range', Value: `${dateRange[0].format('YYYY-MM-DD')} to ${dateRange[1].format('YYYY-MM-DD')}` },
      { Field: 'Total Records', Value: data.length },
    ];
    const metaWs = XLSX.utils.json_to_sheet(metadata);
    XLSX.utils.book_append_sheet(wb, metaWs, 'Metadata');

    // Generate filename
    const filename = `${currentTemplate?.name.replace(/\s+/g, '_')}_${dayjs().format('YYYY-MM-DD')}.${fileFormat}`;

    // Export file
    if (fileFormat === 'xlsx') {
      XLSX.writeFile(wb, filename);
    } else {
      XLSX.writeFile(wb, filename, { bookType: 'csv' });
    }

    // Add to history
    const historyItem = {
      id: Date.now(),
      template: currentTemplate?.name,
      date: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      records: data.length,
      format: fileFormat,
      filename,
    };
    setExportHistory([historyItem, ...exportHistory]);

    message.success(`Exported ${data.length} records successfully!`);
  };

  const historyColumns = [
    {
      title: 'Template',
      dataIndex: 'template',
      key: 'template',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Records',
      dataIndex: 'records',
      key: 'records',
      render: (count: number) => <Tag color="blue">{count}</Tag>,
    },
    {
      title: 'Format',
      dataIndex: 'format',
      key: 'format',
      render: (format: string) => <Tag color="green">{format.toUpperCase()}</Tag>,
    },
    {
      title: 'Filename',
      dataIndex: 'filename',
      key: 'filename',
      render: (name: string) => <Text code>{name}</Text>,
    },
  ];

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={3}>
          <FileExcelOutlined style={{ color: '#52c41a' }} /> Excel Export Center
        </Title>
        <Text type="secondary">
          Export data to Excel or CSV format with customizable templates
        </Text>
      </div>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Available Templates"
              value={templates.length}
              prefix={<FileExcelOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Exports Today"
              value={exportHistory.filter((h) => h.date.startsWith(dayjs().format('YYYY-MM-DD'))).length}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Total Records Exported"
              value={exportHistory.reduce((sum, h) => sum + h.records, 0)}
              prefix={<DownloadOutlined />}
              valueStyle={{ color: '#ff9900' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col xs={24} lg={16}>
          <Card title="Export Configuration">
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              {/* Template Selection */}
              <div>
                <Text strong style={{ display: 'block', marginBottom: 8 }}>
                  Select Template
                </Text>
                <Select
                  style={{ width: '100%' }}
                  value={selectedTemplate}
                  onChange={setSelectedTemplate}
                  options={templates.map((t) => ({
                    label: (
                      <Space>
                        <FileExcelOutlined />
                        <span>{t.name}</span>
                        <Tag color="blue">{t.category}</Tag>
                      </Space>
                    ),
                    value: t.id,
                  }))}
                />
                {currentTemplate && (
                  <Text type="secondary" style={{ fontSize: 12, marginTop: 4, display: 'block' }}>
                    {currentTemplate.description}
                  </Text>
                )}
              </div>

              {/* Date Range */}
              <div>
                <Text strong style={{ display: 'block', marginBottom: 8 }}>
                  Date Range
                </Text>
                <RangePicker
                  style={{ width: '100%' }}
                  value={dateRange}
                  onChange={(dates) => dates && setDateRange(dates as [Dayjs, Dayjs])}
                  format="YYYY-MM-DD"
                />
              </div>

              {/* Column Selection */}
              {currentTemplate && (
                <div>
                  <Text strong style={{ display: 'block', marginBottom: 8 }}>
                    Columns to Export
                  </Text>
                  <Checkbox.Group
                    options={currentTemplate.columns}
                    value={selectedColumns}
                    onChange={(values) => setSelectedColumns(values as string[])}
                    style={{ width: '100%' }}
                  />
                  <Text type="secondary" style={{ fontSize: 12, marginTop: 4, display: 'block' }}>
                    Leave empty to export all columns
                  </Text>
                </div>
              )}

              <Divider />

              {/* Export Options */}
              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Text strong style={{ display: 'block', marginBottom: 8 }}>
                    File Format
                  </Text>
                  <Radio.Group
                    value={fileFormat}
                    onChange={(e) => setFileFormat(e.target.value)}
                    buttonStyle="solid"
                  >
                    <Radio.Button value="xlsx">
                      <FileExcelOutlined /> Excel (.xlsx)
                    </Radio.Button>
                    <Radio.Button value="csv">CSV (.csv)</Radio.Button>
                  </Radio.Group>
                </Col>
                <Col xs={24} sm={12}>
                  <Text strong style={{ display: 'block', marginBottom: 8 }}>
                    Options
                  </Text>
                  <Checkbox
                    checked={includeHeaders}
                    onChange={(e) => setIncludeHeaders(e.target.checked)}
                  >
                    Include column headers
                  </Checkbox>
                </Col>
              </Row>

              <Alert
                message="Export Preview"
                description={`This will export approximately ${getDataForTemplate(selectedTemplate).length} records from ${dateRange[0].format('MMM D, YYYY')} to ${dateRange[1].format('MMM D, YYYY')}.`}
                type="info"
                showIcon
              />

              <Button
                type="primary"
                size="large"
                icon={<DownloadOutlined />}
                onClick={handleExport}
                block
              >
                Export to {fileFormat.toUpperCase()}
              </Button>
            </Space>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card
            title={
              <Space>
                <ClockCircleOutlined />
                <span>Export History</span>
              </Space>
            }
          >
            {exportHistory.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
                <ClockCircleOutlined style={{ fontSize: 48, marginBottom: 16 }} />
                <div>No exports yet</div>
              </div>
            ) : (
              <Table
                dataSource={exportHistory.slice(0, 5)}
                columns={historyColumns}
                rowKey="id"
                pagination={false}
                size="small"
              />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ExcelExportPage;
