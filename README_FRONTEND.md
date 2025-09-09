# Crypto LLM Analyzer - Web Frontend

This is a web-based frontend for the Crypto LLM Analyzer application. It provides an intuitive interface to analyze cryptocurrencies with AI-powered insights.

## Features

- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Real-time Analysis**: Fetch live cryptocurrency data and AI analysis
- **Interactive UI**: Tabbed interface with overview, AI analysis, and historical data
- **Multiple Timeframes**: Daily, weekly, and monthly analysis options
- **Professional Styling**: Modern gradient design with smooth animations

## Files Structure

```
├── web_app.py              # Flask web server
├── templates/
│   └── index.html          # Main HTML template
├── static/
│   ├── css/
│   │   └── style.css       # Styling and responsive design
│   └── js/
│       └── app.js          # Frontend JavaScript logic
└── requirements.txt        # Updated with Flask dependencies
```

## Setup and Usage

1. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Environment Variables**:
   Ensure your `.env` file contains:
   ```
   GROQ_API_KEY=your_groq_api_key_here
   GROQ_MODEL=your_model_name
   DEBUG=true  # Optional: for detailed AI responses
   ```

3. **Run the Web Application**:
   ```bash
   python web_app.py
   ```

4. **Access the Interface**:
   Open your browser and navigate to: `http://localhost:5000`

## API Endpoints

### POST `/api/analyze`
Analyze a cryptocurrency with AI insights.

**Request Body**:
```json
{
  "coin": "bitcoin",
  "timeframe": "weekly"
}
```

**Response**:
```json
{
  "success": true,
  "data": { /* CoinGecko data */ },
  "formatted_data": { /* Formatted display data */ },
  "llm_analysis": "AI analysis text...",
  "timestamp": "2023-12-07T10:30:00"
}
```

### GET `/api/coins/search/<query>`
Search for a coin by name or symbol.

## Usage Instructions

1. **Enter Cryptocurrency**: Type the name or symbol (e.g., "bitcoin", "btc", "ethereum", "eth")
2. **Select Timeframe**: Choose from daily (24h), weekly (7d), or monthly (30d)
3. **Click Analyze**: The system will fetch data and generate AI analysis
4. **View Results**: Switch between tabs to see:
   - **Overview**: Key metrics and price changes
   - **AI Analysis**: LLM-generated insights and recommendations
   - **Historical Data**: Recent price history table

## Features in Detail

### Overview Tab
- Current price with precise formatting
- Market cap and trading volume
- Market rank and supply information
- Price changes (24h, 7d, 30d) with color coding
- All-time high/low values

### AI Analysis Tab
- LLM-powered analysis using your configured model
- Trading insights and market sentiment
- Technical and fundamental analysis
- Investment considerations

### Historical Data Tab
- Recent price history in tabular format
- Volume and market cap data
- Date/time stamps for each data point

## Customization

### Styling
Modify `static/css/style.css` to change:
- Color scheme (currently using purple gradient)
- Layout and spacing
- Typography and fonts
- Responsive breakpoints

### JavaScript Functionality
Edit `static/js/app.js` to add:
- Additional data visualizations
- Real-time updates
- Custom formatting functions
- Enhanced error handling

### Backend API
Extend `web_app.py` to add:
- More analysis endpoints
- Data caching
- User sessions
- Additional data sources

## Troubleshooting

1. **Port Already in Use**: Change the port in `web_app.py`:
   ```python
   app.run(debug=True, host='0.0.0.0', port=5001)
   ```

2. **CORS Issues**: The app includes Flask-CORS for cross-origin requests

3. **API Errors**: Check your GROQ_API_KEY and internet connection

4. **Missing Dependencies**: Run `pip install -r requirements.txt`

## Browser Support

- Chrome/Chromium (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers (iOS Safari, Chrome Mobile)

The interface is fully responsive and optimized for all screen sizes.