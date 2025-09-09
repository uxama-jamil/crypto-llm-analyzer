import React from 'react';
import { Row, Col, Card, Typography, Tag } from 'antd';
import { LineChartOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const TechnicalIndicators = ({ indicators }) => {
  if (!indicators) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <Typography.Text type="secondary">
          No technical indicators available. Run an analysis first.
        </Typography.Text>
      </div>
    );
  }

  const IndicatorCard = ({ title, value }) => (
    <Card style={{ textAlign: 'center', height: '100%' }}>
      <Title level={4} style={{ marginBottom: 16 }}>{title}</Title>
      <Tag color="blue" style={{ fontSize: '14px', padding: '8px 12px' }}>
        {value || 'N/A'}
      </Tag>
    </Card>
  );

  return (
    <div>
      <Title level={3} style={{ marginBottom: 24 }}>
        <LineChartOutlined style={{ marginRight: 8 }} />
        Technical Indicators
      </Title>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8}>
          <IndicatorCard title="RSI (14)" value={indicators.rsi_14} />
        </Col>
        <Col xs={24} sm={12} md={8}>
          <IndicatorCard title="MACD Signal" value={indicators.macd_signal} />
        </Col>
        <Col xs={24} sm={12} md={8}>
          <IndicatorCard title="Volume Trend" value={indicators.volume_trend} />
        </Col>
        <Col xs={24} sm={12} md={8}>
          <IndicatorCard title="MA Trend" value={indicators.moving_average_trend} />
        </Col>
        <Col xs={24} sm={12} md={8}>
          <IndicatorCard title="Support Strength" value={indicators.support_strength} />
        </Col>
        <Col xs={24} sm={12} md={8}>
          <IndicatorCard title="Resistance Strength" value={indicators.resistance_strength} />
        </Col>
      </Row>
    </div>
  );
};

export default TechnicalIndicators;