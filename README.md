# CoinGecko API Cryptocurrency Data Scraper & AI Trading Analyst

A comprehensive Python application that fetches cryptocurrency data from CoinGecko API and provides AI-powered trading analysis using LLM technology. Get real-time market data, historical prices, and intelligent trading insights for any cryptocurrency.

## 🚀 Features

- **Real-time Market Data**: Current prices, market cap, volume, and key metrics
- **Historical Price Data**: Flexible timeframes (daily, weekly, monthly)
- **AI Trading Analysis**: LLM-powered technical analysis and trading recommendations
- **Multiple Output Formats**: Console display, CSV, Excel, and JSON
- **Global Market Context**: Bitcoin dominance, total market cap, and market trends
- **Technical Indicators**: RSI, MACD, moving averages, and support/resistance levels
- **Risk Management**: Position sizing, stop-loss, and take-profit recommendations
- **Trading Zones**: Buy zones, resistance levels, and confidence ratings

## 📋 Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Usage Examples](#usage-examples)
- [Configuration](#configuration)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## 🛠️ Installation

### Prerequisites

- Python 3.8 or higher
- pip package manager

### Install Dependencies

```bash
# Clone the repository
git clone <repository-url>
cd cryptocurrency-scraper

# Install required packages
pip install -r requirements.txt
```

### Required Python Packages

```txt
requests
pandas
argparse
langchain
langchain-groq
python-dotenv
openpyxl
```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the project root:

```env
# Required: Groq Model for LLM analysis
GROQ_MODEL=openai/gpt-oss-20b

# Required: Groq API Key for LLM analysis
GROQ_API_KEY=your_groq_api_key_here

# Optional: CoinGecko API Key (for higher rate limits)
COINGECKO_API_KEY=your_coingecko_api_key_here

# Optional: Enable debug mode
DEBUG=false
```

### Getting API Keys

1. **Groq API Key**: Sign up at [Groq Cloud](https://groq.com) and get your API key
2. **CoinGecko API Key** (Optional): Get a free key at [CoinGecko API](https://www.coingecko.com/en/api)

## 🚀 Quick Start

### Basic Usage

```bash
# Get Bitcoin data with weekly timeframe
python app.py --coin bitcoin --timeframe weekly

# Get Ethereum data and save to files
python app.py --coin ethereum --timeframe daily --save-csv

# Get Solana data with JSON output
python app.py --coin solana --timeframe monthly --json-output
```

### Command Line Arguments

| Argument        | Short | Description                                             | Required | Default        |
| --------------- | ----- | ------------------------------------------------------- | -------- | -------------- |
| `--coin`        | `-c`  | Coin name or symbol (e.g., bitcoin, btc, ethereum, eth) | Yes      | -              |
| `--timeframe`   | `-t`  | Historical data timeframe: daily, weekly, monthly       | No       | weekly         |
| `--save-csv`    | -     | Save results to CSV/Excel files                         | No       | False          |
| `--json-output` | -     | Output raw JSON instead of formatted display            | No       | False          |
| `--output-file` | `-o`  | Custom output filename (without extension)              | No       | auto-generated |

## 📊 Usage Examples

### 1. Basic Price Check

```bash
python app.py --coin bitcoin --timeframe weekly
```

**Output:**

```
======================================================================
📈 CRYPTOCURRENCY DATA: Bitcoin (BTC)
======================================================================
💰 CURRENT MARKET DATA:
   Current Price:        $43,256.78000000
   Market Cap:           $847,123,456,789
   24h Trading Volume:   $23,456,789,012
   Market Cap Rank:      #1
```

### 2. Comprehensive Analysis with File Export

```bash
python app.py --coin ethereum --timeframe monthly --save-csv --output-file eth_analysis
```

This generates:

- `eth_analysis.xlsx` (Excel file with multiple sheets)
- `eth_analysis.csv` (CSV file with current data)
- Console output with AI trading analysis

### 3. Multiple Coins Analysis

```bash
# Analyze different cryptocurrencies
python app.py --coin sol --timeframe daily
python app.py --coin ada --timeframe weekly
python app.py --coin dot --timeframe monthly
```

### 4. Developer Mode (JSON Output)

```bash
python app.py --coin bitcoin --timeframe weekly --json-output > btc_data.json
```

## 🧠 AI Trading Analysis Features

The LLM analyzer provides:

### Market Analysis

- Current trend (Bullish/Bearish/Sideways)
- Market phase identification
- Risk level assessment
- Liquidity analysis

### Trading Zones

- Primary and secondary buy zones
- Key support and resistance levels
- Confidence ratings (1-10 scale)
- Risk-reward ratios

### Take Profit & Stop Loss

- Multiple take-profit levels (conservative, moderate, aggressive)
- Percentage allocations
- Stop-loss recommendations
- Technical justifications

### Technical Indicators

- RSI analysis
- MACD signals
- Volume trends
- Moving average analysis

### Time Horizon Analysis

- Short-term (1-7 days)
- Medium-term (1-4 weeks)
- Long-term (1-3 months)

## 📁 Project Structure

```
cryptocurrency-scraper/
├── app.py                     # Main application entry point
├── coinfetch/
│   └── gecko_client.py         # CoinGecko API client
├── brain/
│   └── llm_analyzer.py         # LLM analysis service
├── template/
│   └── trading_strategy_prompt.py  # AI prompt templates
├── utils/
│   └── formatter.py     # Data formatting utilities
├── .env                        # Environment variables
├── requirements.txt            # Python dependencies
└── README.md                   # This file
```

### Core Components

1. **CoinGeckoAPIScraper**: Handles all API interactions with CoinGecko
2. **LLMService**: Manages AI-powered trading analysis
3. **Output Formatter**: Formats data for console and file output
4. **Prompt Templates**: Structured prompts for AI analysis

## 🔧 Advanced Configuration

### Custom Models

The application supports different LLM models via Groq:

```python
# In brain/llm_analyzer.py
llm_service = LLMService(model="openai/gpt-oss-20b")  # Default
llm_service = LLMService(model="llama2-70b-4096")     # Alternative
```

### Rate Limiting

The scraper includes built-in rate limiting to respect CoinGecko's API limits:

- Automatic delays between requests
- Proper headers to avoid blocking
- Timeout handling

### Debug Mode

Enable debug mode for troubleshooting:

```env
DEBUG=true
```

This creates additional files:

- `prompt.txt`: The generated AI prompt
- `response.txt`: The raw AI response

## 📈 Output Formats

### Console Output

Formatted, human-readable display with:

- Market data summary
- Price changes and trends
- Historical data preview
- AI trading recommendations

### CSV Export

- Current market data
- Metadata and timestamps
- Global market context

### Excel Export

Multiple sheets:

- **Current Data**: All current market metrics
- **Historical Prices**: Time-series price data

### JSON Output

Raw structured data for developers and integrations

## 🚨 Error Handling

The application includes comprehensive error handling:

- **Network Issues**: Automatic retries and timeout handling
- **Invalid Coins**: Clear error messages with suggestions
- **API Rate Limits**: Built-in delays and respect for limits
- **Missing Data**: Graceful degradation with partial results

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Setup

```bash
# Install development dependencies
pip install -r requirements-dev.txt

# Run tests
python -m pytest tests/

# Format code
black .
isort .
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Disclaimer

This tool is for educational and informational purposes only. The AI-generated trading analysis should not be considered as financial advice. Always do your own research and consult with qualified financial advisors before making investment decisions.

## 🆘 Support

- **Issues**: [GitHub Issues](https://github.com/uxama-jamil/crypto-llm-analyzer/issues)
- **Documentation**: Check the code comments and docstrings
- **API Limits**: See [CoinGecko API Documentation](https://www.coingecko.com/en/api/documentation)

## 🔮 Future Enhancements

- [ ] Real-time price alerts
- [ ] Portfolio tracking
- [ ] Multiple exchange data
- [ ] Advanced charting
- [ ] Backtesting capabilities
- [ ] Discord/Telegram bot integration
- [ ] REST API wrapper
- [ ] Web dashboard

---

**Made with ❤️ for the crypto community**
