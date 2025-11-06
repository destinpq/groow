import React from 'react';
import { Card, Typography, Button } from 'antd';

const { Title } = Typography;

const TestPage = () => {
  return (
    <div style={{ padding: 24 }}>
      <Card>
        <Title level={2}>Test Page</Title>
        <p>This is a test page to verify routing is working.</p>
        <Button type="primary">Test Button</Button>
      </Card>
    </div>
  );
};

export default TestPage;