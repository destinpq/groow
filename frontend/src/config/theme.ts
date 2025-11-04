import { ThemeConfig } from 'antd';

// Amazon-inspired professional theme
export const theme: ThemeConfig = {
  token: {
    colorPrimary: '#FF9900', // Amazon orange
    colorSuccess: '#067D62',
    colorWarning: '#F0C14B',
    colorError: '#C7511F',
    colorInfo: '#146EB4',
    colorLink: '#007185',
    
    // Typography
    fontSize: 14,
    fontFamily: "'Amazon Ember', Arial, sans-serif",
    
    // Spacing
    borderRadius: 4,
    
    // Layout
    colorBgContainer: '#FFFFFF',
    colorBgLayout: '#F3F3F3',
  },
  
  components: {
    Layout: {
      headerBg: '#131921', // Amazon dark blue
      headerColor: '#FFFFFF',
      siderBg: '#232F3E',
      bodyBg: '#EAEDED',
    },
    
    Menu: {
      darkItemBg: '#232F3E',
      darkItemSelectedBg: '#37475A',
      darkItemHoverBg: '#37475A',
    },
    
    Button: {
      colorPrimary: '#FF9900',
      algorithm: true,
    },
    
    Card: {
      borderRadiusLG: 8,
    },
    
    Table: {
      headerBg: '#F7F7F7',
    },
  },
};

export const proLayoutTheme = {
  layout: 'mix',
  navTheme: 'dark',
  primaryColor: '#FF9900',
  contentWidth: 'Fluid',
  fixedHeader: true,
  fixSiderbar: true,
  colorWeak: false,
  title: 'Groow',
  pwa: false,
  iconfontUrl: '',
};
