import React from 'react';
import { Card, Typography, Table, Empty } from 'antd';
import { HistoryOutlined } from '@ant-design/icons';

const { Title } = Typography;

const HistoricalData = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div>
        <Title level={3} style={{ marginBottom: 24 }}>
          <HistoryOutlined style={{ marginRight: 8 }} />
          Historical Price Data
        </Title>
        <Card>
          <Empty description="No historical data available" />
        </Card>
      </div>
    );
  }

  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price) => `$${parseFloat(price).toLocaleString(undefined, { 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 8 
      })}`,
    },
    {
      title: 'Volume',
      dataIndex: 'volume',
      key: 'volume',
      render: (volume) => volume ? `$${(volume / 1e9).toFixed(2)}B` : 'N/A',
    },
    {
      title: 'Market Cap',
      dataIndex: 'market_cap',
      key: 'market_cap',
      render: (marketCap) => marketCap ? `$${(marketCap / 1e9).toFixed(2)}B` : 'N/A',
    },
  ];

  // Add index as key for table rows
  const dataWithKeys = data.slice(-10).map((item, index) => ({
    ...item,
    key: index,
  }));

  return (
    <div>
      <Title level={3} style={{ marginBottom: 24 }}>
        <HistoryOutlined style={{ marginRight: 8 }} />
        Historical Price Data
      </Title>
      
      <Card title={`Recent Historical Data (Last ${Math.min(data.length, 10)} Points)`}>
        <Table 
          columns={columns} 
          dataSource={dataWithKeys}
          pagination={false}
          scroll={{ x: true }}
        />
      </Card>
    </div>
  );
};

export default HistoricalData;