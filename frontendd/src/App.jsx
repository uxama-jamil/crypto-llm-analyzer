import React, { useState } from 'react';
import { Layout, ConfigProvider, theme } from 'antd';
import CryptoAnalyzer from './components/CryptoAnalyzer';
import './App.css';

const { Header, Content, Footer } = Layout;

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: '#667eea',
          borderRadius: 8,
          wireframe: false,
        },
      }}
    >
      <Layout className="app-layout" style={{ minHeight: '100vh' }}>
        <Header className="app-header">
          <div className="header-content">
            <div className="header-title">
              <span className="icon">📈</span>
              <h1>Crypto LLM Analyzer</h1>
            </div>
            <p className="header-subtitle">AI-powered cryptocurrency analysis and trading insights</p>
          </div>
        </Header>
        
        <Content className="app-content">
          <div className="content-container">
            <CryptoAnalyzer />
          </div>
        </Content>
        
        <Footer className="app-footer">
          <div className="footer-content">
            <p>Powered by CoinGecko API and AI Language Models</p>
          </div>
        </Footer>
      </Layout>
    </ConfigProvider>
  );
};

export default App;