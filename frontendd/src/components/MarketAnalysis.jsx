import React from "react";
import { Row, Col, Card, Tag, Typography, Progress } from "antd";
import {
  RiseOutlined,
  FallOutlined,
  MinusOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  WarningOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

const MarketAnalysis = ({ analysis }) => {
  if (!analysis) {
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        <Typography.Text type="secondary">
          No market analysis available. Run an analysis first.
        </Typography.Text>
      </div>
    );
  }

  const getTrendIcon = (trend) => {
    if (!trend) return <MinusOutlined />;
    const lowerTrend = trend.toLowerCase();
    if (lowerTrend.includes("bullish") || lowerTrend.includes("up")) {
      return <RiseOutlined style={{ color: "#52c41a" }} />;
    }
    if (lowerTrend.includes("bearish") || lowerTrend.includes("down")) {
      return <FallOutlined style={{ color: "#ff4d4f" }} />;
    }
    return <MinusOutlined style={{ color: "#faad14" }} />;
  };

  const getTrendColor = (trend) => {
    if (!trend) return "default";
    const lowerTrend = trend.toLowerCase();
    if (lowerTrend.includes("bullish") || lowerTrend.includes("up"))
      return "green";
    if (lowerTrend.includes("bearish") || lowerTrend.includes("down"))
      return "red";
    return "orange";
  };

  const getConfidenceProgress = (confidence) => {
    if (!confidence) return 0;
    const lowerConf = confidence.toLowerCase();
    if (lowerConf.includes("high")) return 80;
    if (lowerConf.includes("medium")) return 60;
    if (lowerConf.includes("low")) return 30;
    return 50;
  };

  const getConfidenceColor = (confidence) => {
    if (!confidence) return "#d9d9d9";
    const lowerConf = confidence.toLowerCase();
    if (lowerConf.includes("high")) return "#52c41a";
    if (lowerConf.includes("medium")) return "#faad14";
    if (lowerConf.includes("low")) return "#ff4d4f";
    return "#1890ff";
  };

  const getRiskIcon = (riskLevel) => {
    if (!riskLevel) return <CheckCircleOutlined />;
    const lowerRisk = riskLevel.toLowerCase();
    if (lowerRisk.includes("high"))
      return <WarningOutlined style={{ color: "#ff4d4f" }} />;
    if (lowerRisk.includes("medium"))
      return <ExclamationCircleOutlined style={{ color: "#faad14" }} />;
    return <CheckCircleOutlined style={{ color: "#52c41a" }} />;
  };

  const getRiskColor = (riskLevel) => {
    if (!riskLevel) return "default";
    const lowerRisk = riskLevel.toLowerCase();
    if (lowerRisk.includes("high")) return "red";
    if (lowerRisk.includes("medium")) return "orange";
    return "green";
  };

  return (
    <div>
      <Title level={3} style={{ marginBottom: 24 }}>
        AI Market Analysis
      </Title>

      <Row gutter={[16, 16]}>
        {/* Current Trend */}
        <Col xs={24} sm={12} md={8}>
          <Card>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "36px", marginBottom: 12 }}>
                {getTrendIcon(analysis.current_trend)}
              </div>
              <Title level={4} style={{ marginBottom: 8 }}>
                Current Trend
              </Title>
              <Tag
                color={getTrendColor(analysis.current_trend)}
                style={{ fontSize: "14px", padding: "4px 12px" }}
              >
                {analysis.current_trend || "Unknown"}
              </Tag>
            </div>
          </Card>
        </Col>

        {/* Trend Confidence */}
        <Col xs={24} sm={12} md={8}>
          <Card>
            <div style={{ textAlign: "center" }}>
              <Title level={4} style={{ marginBottom: 16 }}>
                Confidence Level
              </Title>
              <Progress
                type="circle"
                percent={getConfidenceProgress(analysis.trend_confidence)}
                strokeColor={getConfidenceColor(analysis.trend_confidence)}
                format={() => analysis.trend_confidence || "Unknown"}
                width={80}
              />
            </div>
          </Card>
        </Col>

        {/* Market Phase */}
        <Col xs={24} sm={12} md={8}>
          <Card>
            <div style={{ textAlign: "center" }}>
              <Title level={4} style={{ marginBottom: 16 }}>
                Market Phase
              </Title>
              <Tag
                color="blue"
                style={{
                  fontSize: "16px",
                  padding: "8px 16px",
                  borderRadius: "20px",
                }}
              >
                {analysis.market_phase || "Unknown"}
              </Tag>
            </div>
          </Card>
        </Col>

        {/* Risk Level */}
        <Col xs={24} sm={12} md={8}>
          <Card>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "36px", marginBottom: 12 }}>
                {getRiskIcon(analysis.risk_level)}
              </div>
              <Title level={4} style={{ marginBottom: 8 }}>
                Risk Level
              </Title>
              <Tag
                color={getRiskColor(analysis.risk_level)}
                style={{ fontSize: "14px", padding: "4px 12px" }}
              >
                {analysis.risk_level || "Unknown"}
              </Tag>
            </div>
          </Card>
        </Col>

        {/* Liquidity Assessment */}
        <Col xs={24} sm={12} md={8}>
          <Card>
            <div style={{ textAlign: "center" }}>
              <Title level={4} style={{ marginBottom: 16 }}>
                Liquidity
              </Title>
              <Tag
                color={
                  analysis.liquidity_assessment?.toLowerCase() === "high"
                    ? "green"
                    : analysis.liquidity_assessment?.toLowerCase() === "medium"
                    ? "orange"
                    : analysis.liquidity_assessment?.toLowerCase() === "low"
                    ? "red"
                    : "default"
                }
                style={{
                  fontSize: "16px",
                  padding: "8px 16px",
                  borderRadius: "20px",
                }}
              >
                {analysis.liquidity_assessment || "Unknown"}
              </Tag>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Summary Card */}
      <Card
        title="Analysis Summary"
        style={{ marginTop: 24 }}
        headStyle={{ background: "#f8f9fa" }}
      >
        <Row gutter={[24, 16]}>
          <Col xs={24} sm={12}>
            <div>
              <Text strong>Current Trend: </Text>
              <Tag color={getTrendColor(analysis.current_trend)}>
                {analysis.current_trend}
              </Tag>
            </div>
          </Col>

          <Col xs={24} sm={12}>
            <div>
              <Text strong>Confidence: </Text>
              <Text
                style={{ color: getConfidenceColor(analysis.trend_confidence) }}
              >
                {analysis.trend_confidence}
              </Text>
            </div>
          </Col>

          <Col xs={24} sm={12}>
            <div>
              <Text strong>Market Phase: </Text>
              <Tag color="blue">{analysis.market_phase}</Tag>
            </div>
          </Col>

          <Col xs={24} sm={12}>
            <div>
              <Text strong>Risk Assessment: </Text>
              <Tag color={getRiskColor(analysis.risk_level)}>
                {analysis.risk_level}
              </Tag>
            </div>
          </Col>

          <Col xs={24}>
            <div>
              <Text strong>Liquidity: </Text>
              <Tag
                color={
                  analysis.liquidity_assessment?.toLowerCase() === "high"
                    ? "green"
                    : "default"
                }
              >
                {analysis.liquidity_assessment}
              </Tag>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default MarketAnalysis;
