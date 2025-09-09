import React from "react";
import { Card, Typography, Alert, List } from "antd";
import { WarningOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;

const RiskWarnings = ({ warnings }) => {
  if (!warnings) {
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        <Typography.Text type="secondary">
          No risk warnings available. Run an analysis first.
        </Typography.Text>
      </div>
    );
  }

  return (
    <div>
      <Title level={3} style={{ marginBottom: 24 }}>
        <WarningOutlined style={{ marginRight: 8 }} />
        Risk Warnings
      </Title>

      {warnings.high_risk_factors && (
        <Card title="High Risk Factors" style={{ marginBottom: 16 }}>
          <List
            dataSource={warnings.high_risk_factors}
            renderItem={(factor) => (
              <List.Item style={{ padding: "8px 0" }}>
                <div
                  style={{ display: "flex", alignItems: "flex-start", gap: 8 }}
                >
                  <span style={{ color: "#ff4d4f", fontSize: "16px" }}>⚠️</span>
                  <span>{factor}</span>
                </div>
              </List.Item>
            )}
          />
        </Card>
      )}

      {warnings.market_conditions_impact && (
        <Alert
          message="Market Conditions Impact"
          description={warnings.market_conditions_impact}
          type="warning"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}

      {warnings.volatility_alert && (
        <Alert
          message="Volatility Alert"
          description={warnings.volatility_alert}
          type="error"
          showIcon
        />
      )}
    </div>
  );
};

export default RiskWarnings;
