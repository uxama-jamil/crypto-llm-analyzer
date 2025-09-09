import React from "react";
import { Row, Col, Card, Typography, Statistic } from "antd";
import { SecurityScanOutlined, FallOutlined } from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;

const StopLossLevels = ({ levels }) => {
  if (!levels) {
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        <Typography.Text type="secondary">
          No stop loss levels available. Run an analysis first.
        </Typography.Text>
      </div>
    );
  }

  const SLCard = ({ title, level }) => (
    <Card
      style={{
        border: "2px solid #ff4d4f",
        background: "linear-gradient(135deg, #ffffff 0%, #fff2f0 100%)",
        borderRadius: 12,
      }}
    >
      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <Title level={4} style={{ marginBottom: 16 }}>
          {title}
        </Title>

        <Title level={2} style={{ color: "#ff4d4f", margin: 0 }}>
          {level?.price || "N/A"}
        </Title>
      </div>

      <div style={{ marginBottom: 16 }}>
        <Statistic
          title="Maximum Loss"
          value={level?.percentage_loss || "N/A"}
          prefix={<FallOutlined />}
          valueStyle={{ color: "#ff4d4f", fontSize: "16px" }}
        />
      </div>

      {level?.rationale && (
        <div>
          <Text strong>Rationale:</Text>
          <Paragraph
            style={{
              marginTop: 8,
              padding: 12,
              background: "#fafafa",
              borderRadius: 6,
              marginBottom: 0,
              fontSize: "14px",
            }}
          >
            {level.rationale}
          </Paragraph>
        </div>
      )}
    </Card>
  );

  return (
    <div>
      <Title level={3} style={{ marginBottom: 24 }}>
        <SecurityScanOutlined style={{ marginRight: 8 }} />
        Stop Loss Strategy
      </Title>

      <Row gutter={[16, 16]}>
        {levels.conservative_sl && (
          <Col xs={24} md={12}>
            <SLCard
              title="Conservative Stop Loss"
              level={levels.conservative_sl}
            />
          </Col>
        )}

        {levels.moderate_sl && (
          <Col xs={24} md={12}>
            <SLCard title="Moderate Stop Loss" level={levels.moderate_sl} />
          </Col>
        )}
      </Row>

      <Card
        title="Risk Management Guidelines"
        style={{ marginTop: 24 }}
        headStyle={{ background: "#fff2f0" }}
      >
        <div>
          <Paragraph>
            Stop losses are crucial for protecting your capital. The
            conservative stop loss offers tighter risk control but may result in
            more frequent exits, while the moderate stop loss allows for more
            price fluctuation but with higher potential losses.
          </Paragraph>

          <div
            style={{
              background: "#fffbe6",
              padding: "12px",
              borderRadius: "6px",
              border: "1px solid #ffe58f",
            }}
          >
            <Text strong style={{ color: "#d48806" }}>
              ⚠️ Important: Never risk more than you can afford to lose.
              Consider your total portfolio allocation when setting stop losses.
            </Text>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default StopLossLevels;
