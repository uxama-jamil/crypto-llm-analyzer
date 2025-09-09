import React from 'react';
import { Row, Col, Card, Typography } from 'antd';
import { ClockCircleOutlined, CalendarOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const TimeHorizons = ({ horizons }) => {
  if (!horizons) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <Typography.Text type="secondary">
          No time horizons available. Run an analysis first.
        </Typography.Text>
      </div>
    );
  }

  const HorizonCard = ({ title, outlook, color, icon }) => (
    <Card 
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {icon}
          {title}
        </div>
      }
      style={{ 
        borderLeft: `4px solid ${color}`,
        height: '100%'
      }}
      headStyle={{ background: `${color}15` }}
    >
      <Paragraph style={{ margin: 0, lineHeight: 1.6 }}>
        {outlook || 'No outlook available'}
      </Paragraph>
    </Card>
  );

  return (
    <div>
      <Title level={3} style={{ marginBottom: 24 }}>
        <ClockCircleOutlined style={{ marginRight: 8 }} />
        Time Horizon Analysis
      </Title>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <HorizonCard
            title="Short Term (1-7 days)"
            outlook={horizons.short_term_1_7_days}
            color="#52c41a"
            icon={<CalendarOutlined />}
          />
        </Col>
        
        <Col xs={24} md={8}>
          <HorizonCard
            title="Medium Term (1-4 weeks)"
            outlook={horizons.medium_term_1_4_weeks}
            color="#faad14"
            icon={<CalendarOutlined />}
          />
        </Col>
        
        <Col xs={24} md={8}>
          <HorizonCard
            title="Long Term (1-3 months)"
            outlook={horizons.long_term_1_3_months}
            color="#1890ff"
            icon={<CalendarOutlined />}
          />
        </Col>
      </Row>
    </div>
  );
};

export default TimeHorizons;