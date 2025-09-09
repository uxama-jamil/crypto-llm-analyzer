import React from 'react';
import { Row, Col, Card, Typography, Statistic, Tag } from 'antd';
import { TrophyOutlined, RiseOutlined, PercentageOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const TakeProfitLevels = ({ levels }) => {
  if (!levels) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <Typography.Text type="secondary">
          No take profit levels available. Run an analysis first.
        </Typography.Text>
      </div>
    );
  }

  const TPCard = ({ title, level, color, borderColor }) => (
    <Card
      style={{
        border: `2px solid ${borderColor}`,
        background: `linear-gradient(135deg, #ffffff 0%, ${color}10 100%)`,
        borderRadius: 12
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <Title level={4} style={{ marginBottom: 16 }}>{title}</Title>
        
        <div style={{ marginBottom: 16 }}>
          <Title level={2} style={{ color: '#1890ff', margin: 0 }}>
            {level?.price || 'N/A'}
          </Title>
        </div>

        <Row gutter={[0, 8]}>
          <Col span={24}>
            <Statistic
              title="Expected Gain"
              value={level?.percentage_gain || 'N/A'}
              prefix={<RiseOutlined />}
              valueStyle={{ color: '#52c41a', fontSize: '16px' }}
            />
          </Col>
          
          <Col span={24}>
            <Statistic
              title="Probability"
              value={level?.probability || 'N/A'}
              prefix={<PercentageOutlined />}
              valueStyle={{ color: '#faad14', fontSize: '16px' }}
            />
          </Col>
          
          <Col span={24}>
            <div style={{ marginTop: 12 }}>
              <Text strong>Allocation:</Text>
              <div style={{ marginTop: 4 }}>
                <Tag color={borderColor} style={{ fontSize: '12px' }}>
                  {level?.allocation || 'N/A'}
                </Tag>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </Card>
  );

  return (
    <div>
      <Title level={3} style={{ marginBottom: 24 }}>
        <TrophyOutlined style={{ marginRight: 8 }} />
        Take Profit Strategy
      </Title>

      <Row gutter={[16, 16]}>
        {levels.tp1_conservative && (
          <Col xs={24} md={8}>
            <TPCard
              title="Conservative TP"
              level={levels.tp1_conservative}
              color="#17a2b8"
              borderColor="#17a2b8"
            />
          </Col>
        )}

        {levels.tp2_moderate && (
          <Col xs={24} md={8}>
            <TPCard
              title="Moderate TP"
              level={levels.tp2_moderate}
              color="#ffc107"
              borderColor="#ffc107"
            />
          </Col>
        )}

        {levels.tp3_aggressive && (
          <Col xs={24} md={8}>
            <TPCard
              title="Aggressive TP"
              level={levels.tp3_aggressive}
              color="#fd7e14"
              borderColor="#fd7e14"
            />
          </Col>
        )}
      </Row>

      <Card title="Take Profit Strategy Overview" style={{ marginTop: 24 }}>
        <div style={{ padding: '16px 0' }}>
          <Text>
            The take profit strategy is designed with a tiered approach to maximize gains while managing risk. 
            Each level represents a different risk tolerance and market outlook.
          </Text>
          
          <div style={{ marginTop: 16 }}>
            <Row gutter={[16, 8]}>
              <Col xs={24} sm={8}>
                <Tag color="cyan" style={{ width: '100%', textAlign: 'center', padding: '4px' }}>
                  Conservative: Lower risk, higher probability
                </Tag>
              </Col>
              <Col xs={24} sm={8}>
                <Tag color="gold" style={{ width: '100%', textAlign: 'center', padding: '4px' }}>
                  Moderate: Balanced risk-reward
                </Tag>
              </Col>
              <Col xs={24} sm={8}>
                <Tag color="orange" style={{ width: '100%', textAlign: 'center', padding: '4px' }}>
                  Aggressive: Higher risk, higher reward
                </Tag>
              </Col>
            </Row>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default TakeProfitLevels;