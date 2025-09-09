import React from 'react';
import { Row, Col, Statistic, Card, Tag, Typography } from 'antd';
import { 
  DollarOutlined, 
  TrophyOutlined, 
  RiseOutlined, 
  FallOutlined,
  StockOutlined,
  BankOutlined 
} from '@ant-design/icons';

const { Title } = Typography;

const MarketOverview = ({ data, summary }) => {
  if (!data && !summary) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <Typography.Text type="secondary">
          No market data available. Run an analysis first.
        </Typography.Text>
      </div>
    );
  }

  const formatPrice = (value) => {
    if (!value || value === 0) return '$0.00';
    
    if (value < 0.01) {
      return `$${parseFloat(value).toFixed(8)}`;
    } else if (value < 1) {
      return `$${parseFloat(value).toFixed(4)}`;
    } else {
      return `$${parseFloat(value).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })}`;
    }
  };

  const formatLargeNumber = (value) => {
    if (!value || value === 0) return '$0';
    
    const absValue = Math.abs(value);
    
    if (absValue >= 1e12) {
      return `$${(value / 1e12).toFixed(2)}T`;
    } else if (absValue >= 1e9) {
      return `$${(value / 1e9).toFixed(2)}B`;
    } else if (absValue >= 1e6) {
      return `$${(value / 1e6).toFixed(2)}M`;
    } else if (absValue >= 1e3) {
      return `$${(value / 1e3).toFixed(2)}K`;
    } else {
      return `$${value.toLocaleString()}`;
    }
  };

  const formatPercentage = (value) => {
    if (value === null || value === undefined) return '0.00%';
    const formatted = `${value >= 0 ? '+' : ''}${parseFloat(value).toFixed(2)}%`;
    return formatted;
  };

  const getChangeColor = (value) => {
    if (value > 0) return '#52c41a';
    if (value < 0) return '#ff4d4f';
    return '#666';
  };

  const getChangeIcon = (value) => {
    return value >= 0 ? <RiseOutlined /> : <FallOutlined />;
  };

  return (
    <div>
      <Title level={3} style={{ marginBottom: 24 }}>
        Market Overview
      </Title>
      
      {/* Current Price and Basic Info */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title="Current Price"
              value={formatPrice(data?.current_price || summary?.current_price)}
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#1890ff', fontSize: '24px' }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title="Market Cap"
              value={formatLargeNumber(data?.market_cap || summary?.market_cap)}
              prefix={<BankOutlined />}
              valueStyle={{ fontSize: '20px' }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic
              title="24h Volume"
              value={formatLargeNumber(data?.volume_24h || summary?.volume_24h)}
              prefix={<StockOutlined />}
              valueStyle={{ fontSize: '20px' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Price Changes */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="24h Change"
              value={formatPercentage(data?.price_change_24h || summary?.price_change_24h)}
              prefix={getChangeIcon(data?.price_change_24h || summary?.price_change_24h)}
              valueStyle={{ 
                color: getChangeColor(data?.price_change_24h || summary?.price_change_24h),
                fontSize: '18px'
              }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="7d Change"
              value={formatPercentage(data?.price_change_7d || summary?.price_change_7d)}
              prefix={getChangeIcon(data?.price_change_7d || summary?.price_change_7d)}
              valueStyle={{ 
                color: getChangeColor(data?.price_change_7d || summary?.price_change_7d),
                fontSize: '18px'
              }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="30d Change"
              value={formatPercentage(data?.price_change_30d || summary?.price_change_30d)}
              prefix={getChangeIcon(data?.price_change_30d || summary?.price_change_30d)}
              valueStyle={{ 
                color: getChangeColor(data?.price_change_30d || summary?.price_change_30d),
                fontSize: '18px'
              }}
            />
          </Card>
        </Col>
      </Row>

      {/* All-Time Records and Ranking */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Market Rank"
              value={`#${data?.market_cap_rank || summary?.market_cap_rank || 'N/A'}`}
              prefix={<TrophyOutlined />}
              valueStyle={{ color: '#faad14', fontSize: '20px' }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="All-Time High"
              value={formatPrice(data?.ath || summary?.ath)}
              valueStyle={{ fontSize: '16px' }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="All-Time Low"
              value={formatPrice(data?.atl || summary?.atl)}
              valueStyle={{ fontSize: '16px' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Supply Information */}
      {data && (
        <Card title="Supply Information" style={{ marginBottom: 24 }}>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={8}>
              <Statistic
                title="Circulating Supply"
                value={data.circulating_supply?.toLocaleString() || 'N/A'}
              />
            </Col>
            
            <Col xs={24} sm={8}>
              <Statistic
                title="Total Supply"
                value={data.total_supply?.toLocaleString() || 'N/A'}
              />
            </Col>
            
            <Col xs={24} sm={8}>
              <Statistic
                title="Max Supply"
                value={data.max_supply ? data.max_supply.toLocaleString() : 'Unlimited'}
              />
            </Col>
          </Row>
        </Card>
      )}

      {/* Global Market Data */}
      {data?.global_market_data && (
        <Card title="Global Market Context">
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <Statistic
                title="Total Crypto Market Cap"
                value={formatLargeNumber(data.global_market_data.total_market_cap_usd)}
              />
            </Col>
            
            <Col xs={24} sm={12}>
              <Statistic
                title="Bitcoin Dominance"
                value={`${data.global_market_data.bitcoin_percentage?.toFixed(2)}%`}
                valueStyle={{ color: '#f7931a' }}
              />
            </Col>
            
            <Col xs={24} sm={12}>
              <Statistic
                title="Total 24h Volume"
                value={formatLargeNumber(data.global_market_data.total_volume_24h_usd)}
              />
            </Col>
            
            <Col xs={24} sm={12}>
              <Statistic
                title="Active Cryptocurrencies"
                value={data.global_market_data.active_cryptocurrencies?.toLocaleString()}
              />
            </Col>
          </Row>
        </Card>
      )}
    </div>
  );
};

export default MarketOverview;