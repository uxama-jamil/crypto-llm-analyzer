import React from 'react';
import { Row, Col, Card, Typography, Alert } from 'antd';
import { CalculatorOutlined, WarningOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const PositionSizing = ({ sizing }) => {
  if (!sizing) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <Typography.Text type="secondary">
          No position sizing data available. Run an analysis first.
        </Typography.Text>
      </div>
    );
  }

  const SizingCard = ({ title, size, description, type = 'default' }) => (
    <Card 
      style={{ 
        textAlign: 'center',
        borderLeft: `4px solid ${
          type === 'conservative' ? '#52c41a' :
          type === 'moderate' ? '#faad14' :
          type === 'aggressive' ? '#ff7a45' :
          type === 'warning' ? '#ff4d4f' : '#1890ff'
        }`
      }}
    >
      <Title level={4}>{title}</Title>
      <div style={{ fontSize: '24px', fontWeight: 'bold', margin: '16px 0' }}>
        {size || 'N/A'}
      </div>
      {description && (
        <Text type="secondary">{description}</Text>
      )}
    </Card>
  );

  return (
    <div>
      <Title level={3} style={{ marginBottom: 24 }}>
        <CalculatorOutlined style={{ marginRight: 8 }} />
        Position Sizing Recommendations
      </Title>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <SizingCard
            title="Conservative Trader"
            size={sizing.conservative_trader}
            description="Low risk tolerance"
            type="conservative"
          />
        </Col>
        
        <Col xs={24} sm={12} md={6}>
          <SizingCard
            title="Moderate Trader"
            size={sizing.moderate_trader}
            description="Balanced approach"
            type="moderate"
          />
        </Col>
        
        <Col xs={24} sm={12} md={6}>
          <SizingCard
            title="Aggressive Trader"
            size={sizing.aggressive_trader}
            description="Higher risk tolerance"
            type="aggressive"
          />
        </Col>
        
        <Col xs={24} sm={12} md={6}>
          <SizingCard
            title="Maximum Risk"
            size={sizing.maximum_risk}
            description="Never exceed this"
            type="warning"
          />
        </Col>
      </Row>

      <Alert
        message="Risk Management Guidelines"
        description="Position sizing is crucial for long-term trading success. Never risk more than you can afford to lose, and always consider your total portfolio allocation."
        type="info"
        showIcon
        icon={<WarningOutlined />}
        style={{ marginTop: 24 }}
      />
    </div>
  );
};

export default PositionSizing;