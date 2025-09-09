import React from 'react';
import { Row, Col, Card, Typography, Progress, Tag, Divider } from 'antd';
import { 
  RiseOutlined, 
  FallOutlined, 
  ShoppingOutlined,
  BarChartOutlined 
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

const TradingZones = ({ zones }) => {
  if (!zones) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <Typography.Text type="secondary">
          No trading zones data available. Run an analysis first.
        </Typography.Text>
      </div>
    );
  }

  const ZoneCard = ({ title, zone, type = 'buy', icon }) => (
    <Card 
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {icon}
          {title}
        </div>
      }
      style={{ 
        marginBottom: 16,
        border: `2px solid ${type === 'buy' ? '#52c41a' : '#ff4d4f'}`,
        borderRadius: 12
      }}
      headStyle={{ 
        background: type === 'buy' 
          ? 'linear-gradient(135deg, #ffffff 0%, #f6ffed 100%)'
          : 'linear-gradient(135deg, #ffffff 0%, #fff2f0 100%)',
        borderRadius: '10px 10px 0 0'
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: 16 }}>
        <Title level={3} style={{ color: '#1890ff', margin: 0 }}>
          {zone?.price_range || 'N/A'}
        </Title>
      </div>
      
      {zone?.confidence && (
        <div style={{ marginBottom: 12 }}>
          <Text strong>Confidence: </Text>
          <Progress 
            percent={zone.confidence * 10} 
            size="small" 
            strokeColor="#1890ff"
            format={() => `${zone.confidence}/10`}
          />
        </div>
      )}
      
      {zone?.risk_reward_ratio && (
        <div style={{ marginBottom: 12 }}>
          <Text strong>Risk/Reward: </Text>
          <Tag color="blue">{zone.risk_reward_ratio}</Tag>
        </div>
      )}
      
      {zone?.rationale && (
        <div>
          <Text strong>Rationale:</Text>
          <Paragraph 
            style={{ 
              marginTop: 8, 
              padding: 12,
              background: '#fafafa',
              borderRadius: 6,
              marginBottom: 0
            }}
          >
            {zone.rationale}
          </Paragraph>
        </div>
      )}
    </Card>
  );

  return (
    <div>
      <Title level={3} style={{ marginBottom: 24 }}>
        Trading Zones Analysis
      </Title>

      <Row gutter={[16, 16]}>
        {/* Primary Buy Zone */}
        {zones.primary_buy_zone && (
          <Col xs={24} lg={8}>
            <ZoneCard 
              title="Primary Buy Zone"
              zone={zones.primary_buy_zone}
              type="buy"
              icon={<ShoppingOutlined style={{ color: '#52c41a' }} />}
            />
          </Col>
        )}

        {/* Secondary Buy Zone */}
        {zones.secondary_buy_zone && (
          <Col xs={24} lg={8}>
            <ZoneCard 
              title="Secondary Buy Zone"
              zone={zones.secondary_buy_zone}
              type="buy"
              icon={<ShoppingOutlined style={{ color: '#52c41a' }} />}
            />
          </Col>
        )}

        {/* Primary Resistance */}
        {zones.primary_resistance && (
          <Col xs={24} lg={8}>
            <ZoneCard 
              title="Primary Resistance"
              zone={zones.primary_resistance}
              type="resistance"
              icon={<BarChartOutlined style={{ color: '#ff4d4f' }} />}
            />
          </Col>
        )}
      </Row>

      {/* Key Levels */}
      {(zones.key_support || zones.key_resistance) && (
        <>
          <Divider style={{ margin: '32px 0' }}>Key Levels</Divider>
          
          <Row gutter={[16, 16]}>
            {zones.key_support && (
              <Col xs={24} sm={12}>
                <Card 
                  style={{ 
                    textAlign: 'center',
                    borderLeft: '4px solid #52c41a'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 8 }}>
                    <RiseOutlined style={{ color: '#52c41a', fontSize: '20px' }} />
                    <Title level={4} style={{ margin: 0 }}>Key Support</Title>
                  </div>
                  <Title level={2} style={{ color: '#52c41a', margin: 0 }}>
                    {zones.key_support}
                  </Title>
                </Card>
              </Col>
            )}

            {zones.key_resistance && (
              <Col xs={24} sm={12}>
                <Card 
                  style={{ 
                    textAlign: 'center',
                    borderLeft: '4px solid #ff4d4f'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 8 }}>
                    <FallOutlined style={{ color: '#ff4d4f', fontSize: '20px' }} />
                    <Title level={4} style={{ margin: 0 }}>Key Resistance</Title>
                  </div>
                  <Title level={2} style={{ color: '#ff4d4f', margin: 0 }}>
                    {zones.key_resistance}
                  </Title>
                </Card>
              </Col>
            )}
          </Row>
        </>
      )}

      {/* Trading Strategy Summary */}
      <Card 
        title="Trading Strategy Summary"
        style={{ marginTop: 24 }}
        headStyle={{ background: '#f0f2ff' }}
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <div>
              <Text strong style={{ color: '#52c41a' }}>Buy Zones:</Text>
              <div style={{ marginTop: 8 }}>
                {zones.primary_buy_zone && (
                  <div>Primary: {zones.primary_buy_zone.price_range}</div>
                )}
                {zones.secondary_buy_zone && (
                  <div>Secondary: {zones.secondary_buy_zone.price_range}</div>
                )}
              </div>
            </div>
          </Col>
          
          <Col xs={24} md={12}>
            <div>
              <Text strong style={{ color: '#ff4d4f' }}>Resistance Zone:</Text>
              <div style={{ marginTop: 8 }}>
                {zones.primary_resistance && (
                  <div>{zones.primary_resistance.price_range}</div>
                )}
              </div>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default TradingZones;