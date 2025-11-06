import { ConfigProvider } from 'antd';

export function rootContainer(container: React.ReactElement) {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#FF9900',
          colorLink: '#007185',
          colorSuccess: '#067D62',
          colorWarning: '#F0C14B',
          colorError: '#C7511F',
        },
      }}
    >
      {container}
    </ConfigProvider>
  );
}