import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Result, Button, Card, Typography, Space, Collapse } from 'antd';
import {
  BugOutlined,
  ReloadOutlined,
  HomeOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import { history } from 'umi';

const { Paragraph, Text } = Typography;
const { Panel } = Collapse;

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorCount: number;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by ErrorBoundary:', error, errorInfo);
    }

    // Log error to external service in production
    if (process.env.NODE_ENV === 'production') {
      // Example: Send to error tracking service
      // logErrorToService(error, errorInfo);
    }

    this.setState((prevState) => ({
      errorInfo,
      errorCount: prevState.errorCount + 1,
    }));

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleGoHome = () => {
    this.handleReset();
    history.push('/');
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const { error, errorInfo, errorCount } = this.state;
      const isDevelopment = process.env.NODE_ENV === 'development';

      return (
        <div
          style={{
            padding: 24,
            background: '#f0f2f5',
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Card style={{ maxWidth: 800, width: '100%' }}>
            <Result
              status="error"
              title="Oops! Something went wrong"
              subTitle="We're sorry for the inconvenience. The error has been logged and we'll fix it as soon as possible."
              icon={<BugOutlined style={{ color: '#ff4d4f' }} />}
              extra={
                <Space>
                  <Button type="primary" icon={<ReloadOutlined />} onClick={this.handleReset}>
                    Try Again
                  </Button>
                  <Button icon={<HomeOutlined />} onClick={this.handleGoHome}>
                    Go Home
                  </Button>
                  <Button danger icon={<ReloadOutlined />} onClick={this.handleReload}>
                    Reload Page
                  </Button>
                </Space>
              }
            >
              {errorCount > 1 && (
                <div style={{ marginBottom: 16 }}>
                  <WarningOutlined style={{ color: '#faad14', marginRight: 8 }} />
                  <Text type="warning">
                    This error has occurred {errorCount} times. Consider reloading the page.
                  </Text>
                </div>
              )}

              {isDevelopment && error && (
                <div style={{ textAlign: 'left', marginTop: 24 }}>
                  <Collapse>
                    <Panel header="Error Details (Development Only)" key="1">
                      <Space direction="vertical" style={{ width: '100%' }}>
                        <div>
                          <Text strong>Error Message:</Text>
                          <Paragraph
                            code
                            copyable
                            style={{
                              background: '#fff1f0',
                              padding: 8,
                              borderRadius: 4,
                              color: '#cf1322',
                              marginTop: 8,
                            }}
                          >
                            {error.toString()}
                          </Paragraph>
                        </div>

                        {error.stack && (
                          <div>
                            <Text strong>Stack Trace:</Text>
                            <Paragraph
                              code
                              copyable
                              style={{
                                background: '#f5f5f5',
                                padding: 12,
                                borderRadius: 4,
                                fontSize: 12,
                                maxHeight: 300,
                                overflow: 'auto',
                                marginTop: 8,
                                whiteSpace: 'pre-wrap',
                              }}
                            >
                              {error.stack}
                            </Paragraph>
                          </div>
                        )}

                        {errorInfo && errorInfo.componentStack && (
                          <div>
                            <Text strong>Component Stack:</Text>
                            <Paragraph
                              code
                              copyable
                              style={{
                                background: '#f5f5f5',
                                padding: 12,
                                borderRadius: 4,
                                fontSize: 12,
                                maxHeight: 300,
                                overflow: 'auto',
                                marginTop: 8,
                                whiteSpace: 'pre-wrap',
                              }}
                            >
                              {errorInfo.componentStack}
                            </Paragraph>
                          </div>
                        )}
                      </Space>
                    </Panel>
                  </Collapse>
                </div>
              )}

              {!isDevelopment && (
                <Paragraph type="secondary" style={{ marginTop: 16 }}>
                  Error ID: {Date.now().toString(36)}
                </Paragraph>
              )}
            </Result>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

// Hook for functional components to trigger error boundary
export const useErrorHandler = () => {
  const [, setError] = React.useState();

  return React.useCallback((error: Error) => {
    setError(() => {
      throw error;
    });
  }, []);
};
