import React, { useState } from 'react';
import { 
  Card, 
  Input, 
  Select, 
  Button, 
  Tabs, 
  Row, 
  Col, 
  Spin, 
  Alert,
  Typography,
  Space 
} from 'antd';
import { 
  SearchOutlined, 
  RobotOutlined,
  TrophyOutlined,
  DollarCircleOutlined,
  StockOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import { cryptoAPI } from '../services/api';
import MarketOverview from './MarketOverview';
import MarketAnalysis from './MarketAnalysis';
import TradingZones from './TradingZones';
import TakeProfitLevels from './TakeProfitLevels';
import StopLossLevels from './StopLossLevels';
import TechnicalIndicators from './TechnicalIndicators';
import TimeHorizons from './TimeHorizons';
import PositionSizing from './PositionSizing';
import RiskWarnings from './RiskWarnings';
import KeyInsights from './KeyInsights';
import HistoricalData from './HistoricalData';
import './CryptoAnalyzer.css';

const { Title, Text } = Typography;
const { Option } = Select;

const CryptoAnalyzer = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [coin, setCoin] = useState('');
  const [timeframe, setTimeframe] = useState('weekly');
  const [analysisData, setAnalysisData] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  const handleAnalyze = async () => {
    if (!coin.trim()) {
      setError('Please enter a cryptocurrency name or symbol');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const data = await cryptoAPI.analyze(coin, timeframe);
      setAnalysisData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAnalyze();
    }
  };

  const parseAnalysis = (analysisString) => {
    try {
      return typeof analysisString === 'string' ? JSON.parse(analysisString) : analysisString;
    } catch (error) {
      console.error('Failed to parse analysis:', error);
      return null;
    }
  };

  const analysis = analysisData?.llm_analysis ? parseAnalysis(analysisData.llm_analysis) : null;
  const cryptoData = analysisData?.data;
  const formattedData = analysisData?.formatted_data;

  const tabItems = [
    {
      key: 'overview',
      label: (
        <Space>
          <StockOutlined />
          Overview
        </Space>
      ),
      children: <MarketOverview data={cryptoData} summary={formattedData?.summary} />
    },
    {
      key: 'market-analysis',
      label: (
        <Space>
          <RobotOutlined />
          Market Analysis
        </Space>
      ),
      children: <MarketAnalysis analysis={analysis?.market_analysis} />
    },
    {
      key: 'trading-zones',
      label: (
        <Space>
          <DollarCircleOutlined />
          Trading Zones
        </Space>
      ),
      children: <TradingZones zones={analysis?.trading_zones} />
    },
    {
      key: 'profit-levels',
      label: (
        <Space>
          <TrophyOutlined />
          Take Profit
        </Space>
      ),
      children: <TakeProfitLevels levels={analysis?.take_profit_levels} />
    },
    {
      key: 'stop-loss',
      label: (
        <Space>
          <TrophyOutlined />
          Stop Loss
        </Space>
      ),
      children: <StopLossLevels levels={analysis?.stop_loss} />
    },
    {
      key: 'technical',
      label: (
        <Space>
          <StockOutlined />
          Technical
        </Space>
      ),
      children: <TechnicalIndicators indicators={analysis?.technical_indicators} />
    },
    {
      key: 'horizons',
      label: (
        <Space>
          <ClockCircleOutlined />
          Time Horizons
        </Space>
      ),
      children: <TimeHorizons horizons={analysis?.time_horizon} />
    },
    {
      key: 'position-sizing',
      label: 'Position Sizing',
      children: <PositionSizing sizing={analysis?.position_sizing} />
    },
    {
      key: 'risks',
      label: 'Risk Warnings',
      children: <RiskWarnings warnings={analysis?.risk_warnings} />
    },
    {
      key: 'insights',
      label: 'Key Insights',
      children: <KeyInsights insights={analysis?.key_insights} />
    },
    {
      key: 'historical',
      label: 'Historical Data',
      children: <HistoricalData data={cryptoData?.historical_prices} />
    }
  ];

  return (
    <div className="crypto-analyzer">
      <Card className="search-card" bordered={false}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={24} md={8} lg={10}>
            <Input
              size="large"
              placeholder="Enter coin name or symbol (e.g., bitcoin, btc)"
              value={coin}
              onChange={(e) => setCoin(e.target.value)}
              onKeyPress={handleKeyPress}
              prefix={<SearchOutlined />}
            />
          </Col>
          
          <Col xs={24} sm={12} md={6} lg={4}>
            <Select
              size="large"
              value={timeframe}
              onChange={setTimeframe}
              style={{ width: '100%' }}
            >
              <Option value="daily">Daily (24h)</Option>
              <Option value="weekly">Weekly (7d)</Option>
              <Option value="monthly">Monthly (30d)</Option>
            </Select>
          </Col>
          
          <Col xs={24} sm={12} md={6} lg={4}>
            <Button
              type="primary"
              size="large"
              loading={loading}
              onClick={handleAnalyze}
              disabled={!coin.trim()}
              style={{ width: '100%' }}
              icon={<RobotOutlined />}
            >
              {loading ? 'Analyzing...' : 'Analyze'}
            </Button>
          </Col>
        </Row>
      </Card>

      {error && (
        <Alert
          message="Analysis Error"
          description={error}
          type="error"
          showIcon
          closable
          onClose={() => setError(null)}
          style={{ marginBottom: 24 }}
        />
      )}

      {loading && (
        <Card bordered={false} className="loading-card">
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <Spin size="large" />
            <div style={{ marginTop: 16 }}>
              <Title level={4} style={{ color: '#666' }}>
                Fetching crypto data and generating AI analysis...
              </Title>
              <Text type="secondary">This may take a few seconds</Text>
            </div>
          </div>
        </Card>
      )}

      {analysisData && !loading && (
        <Card bordered={false} className="results-card">
          <div className="results-header">
            <Title level={2} style={{ margin: 0, color: '#1890ff' }}>
              {cryptoData?.name} ({cryptoData?.symbol})
            </Title>
            <Text type="secondary">
              Updated: {new Date(analysisData.timestamp).toLocaleString()}
            </Text>
          </div>

          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={tabItems}
            size="large"
            className="analysis-tabs"
          />
        </Card>
      )}
    </div>
  );
};

export default CryptoAnalyzer;