import React from 'react';
import { Row, Col, Card, Typography, List } from 'antd';
import { BulbOutlined, RocketOutlined, RiseOutlined, FallOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const KeyInsights = ({ insights }) => {
  if (!insights) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <Typography.Text type="secondary">
          No key insights available. Run an analysis first.
        </Typography.Text>
      </div>
    );
  }

  return (
    <div>
      <Title level={3} style={{ marginBottom: 24 }}>
        <BulbOutlined style={{ marginRight: 8 }} />
        Key Market Insights
      </Title>

      {insights.market_context && (
        <Card title="Market Context" style={{ marginBottom: 16 }}>
          <Paragraph>{insights.market_context}</Paragraph>
        </Card>
      )}

      {insights.price_catalysts && (
        <Card title="Price Catalysts" style={{ marginBottom: 16 }}>
          <List
            dataSource={insights.price_catalysts}
            renderItem={(catalyst) => (
              <List.Item style={{ padding: '8px 0' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <RocketOutlined style={{ color: '#1890ff', fontSize: '16px', marginTop: 2 }} />
                  <span>{catalyst}</span>
                </div>
              </List.Item>
            )}
          />
        </Card>
      )}

      {insights.alternative_scenarios && (
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Card 
              title={
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <RiseOutlined style={{ color: '#52c41a' }} />
                  Bull Case Scenario
                </div>
              }
              style={{ 
                borderLeft: '4px solid #52c41a',
                background: 'linear-gradient(135deg, #ffffff 0%, #f6ffed 100%)'
              }}
            >
              <Paragraph style={{ margin: 0 }}>
                {insights.alternative_scenarios.bull_case || 'No bull case scenario available'}
              </Paragraph>
            </Card>
          </Col>
          
          <Col xs={24} md={12}>
            <Card 
              title={
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <FallOutlined style={{ color: '#ff4d4f' }} />
                  Bear Case Scenario
                </div>
              }
              style={{ 
                borderLeft: '4px solid #ff4d4f',
                background: 'linear-gradient(135deg, #ffffff 0%, #fff2f0 100%)'
              }}
            >
              <Paragraph style={{ margin: 0 }}>
                {insights.alternative_scenarios.bear_case || 'No bear case scenario available'}
              </Paragraph>
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default KeyInsights;