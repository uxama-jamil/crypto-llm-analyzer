#!/usr/bin/env python3
"""
Web interface for the Crypto LLM Analyzer
"""

from flask import Flask, render_template, jsonify, request
from flask_cors import CORS
import json
import os
from datetime import datetime
from dotenv import load_dotenv
from brain.llm_analyzer import LLMService
from coinfetch.gecko_client import CryptoInsightsClient
from utils.formatter import print_formatted_output
import io
import sys
from contextlib import redirect_stdout

load_dotenv()

app = Flask(__name__)
CORS(app)

llm_service = LLMService(model=os.getenv("GROQ_MODEL", "openai/gpt-oss-20b"))
crypto_client = CryptoInsightsClient()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/analyze', methods=['POST'])
def analyze_crypto():
    try:
        data = request.get_json()
        coin = data.get('coin', '').strip()
        timeframe = data.get('timeframe', 'weekly')
        
        if not coin:
            return jsonify({'error': 'Coin parameter is required'}), 400
        
        # Validate timeframe
        if timeframe not in ['daily', 'weekly', 'monthly']:
            timeframe = 'weekly'
        
        # Fetch crypto data
        crypto_data = crypto_client.scrape_coin_data(coin, timeframe)
        
        if not crypto_data:
            return jsonify({'error': f'Could not fetch data for coin: {coin}'}), 404
        
        # Format data for display
        formatted_data = format_crypto_data(crypto_data)
        
        # Get LLM analysis
        llm_analysis = get_llm_analysis(formatted_data)
        
        return jsonify({
            'success': True,
            'data': crypto_data,
            'formatted_data': formatted_data,
            'llm_analysis': llm_analysis,
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/coins/search/<query>')
def search_coins(query):
    try:
        coin_id = crypto_client.get_coin_id(query)
        if coin_id:
            return jsonify({'success': True, 'coin_id': coin_id})
        else:
            return jsonify({'success': False, 'message': 'Coin not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def format_crypto_data(data):
    """Format crypto data for web display"""
    try:
        # Instead of capturing print output, format data directly for web
        def format_change(value):
            return f"{value:+.2f}%" if value != 0 else "0.00%"
        
        # Create formatted text without using print
        formatted_lines = []
        formatted_lines.append("="*70)
        formatted_lines.append(f"📈 CRYPTOCURRENCY DATA: {data['name']} ({data['symbol']})")
        formatted_lines.append("="*70)
        
        # Current Price Section
        formatted_lines.append(f"💰 CURRENT MARKET DATA:")
        formatted_lines.append(f"   Current Price:        ${data['current_price']:,.8f}")
        formatted_lines.append(f"   Market Cap:           ${data['market_cap']:,}")
        formatted_lines.append(f"   24h Trading Volume:   ${data['volume_24h']:,}")
        formatted_lines.append(f"   Market Cap Rank:      #{data['market_cap_rank']}")
        
        # Supply Information
        formatted_lines.append(f"\n🏦 SUPPLY INFORMATION:")
        formatted_lines.append(f"   Circulating Supply:   {data['circulating_supply']:,}")
        formatted_lines.append(f"   Total Supply:         {data['total_supply']:,}")
        max_supply = f"{data['max_supply']:,}" if data['max_supply'] else "∞"
        formatted_lines.append(f"   Max Supply:           {max_supply}")
        
        # Price Changes
        formatted_lines.append(f"\n📊 PRICE CHANGES:")
        formatted_lines.append(f"   24h:                  {format_change(data['price_change_24h'])}")
        formatted_lines.append(f"   7d:                   {format_change(data['price_change_7d'])}")
        formatted_lines.append(f"   30d:                  {format_change(data['price_change_30d'])}")
        
        # All-Time Records
        formatted_lines.append(f"\n🏆 ALL-TIME RECORDS:")
        formatted_lines.append(f"   All-Time High:        ${data['ath']:,.8f}")
        formatted_lines.append(f"   All-Time Low:         ${data['atl']:,.8f}")
        
        # Global Market Data
        if data.get('global_market_data'):
            global_data = data['global_market_data']
            formatted_lines.append(f"\n🌍 GLOBAL MARKET DATA:")
            formatted_lines.append(f"   Total Crypto Market Cap: ${global_data.get('total_market_cap_usd', 0):,}")
            formatted_lines.append(f"   Total 24h Volume:     ${global_data.get('total_volume_24h_usd', 0):,}")
            formatted_lines.append(f"   Bitcoin Dominance:    {global_data.get('bitcoin_percentage', 0):.2f}%")
            formatted_lines.append(f"   Active Cryptocurrencies: {global_data.get('active_cryptocurrencies', 0):,}")
        
        # Metadata
        formatted_lines.append(f"\n📋 METADATA:")
        formatted_lines.append(f"   Timeframe:            {data['timeframe']}")
        formatted_lines.append(f"   Historical Data Points: {data['data_points']}")
        formatted_lines.append(f"   Data Source:          {data['data_source']}")
        formatted_lines.append(f"   Last Updated:         {data['last_updated']}")
        formatted_lines.append(f"   Scraped At:           {data['scraped_at']}")
        
        # Recent Historical Data Preview
        if data['historical_prices']:
            formatted_lines.append(f"\n⏰ RECENT PRICE HISTORY (last 5 entries):")
            for entry in data['historical_prices'][-5:]:
                formatted_lines.append(f"   {entry['date']}: ${entry['price']:,.8f}")
        
        formatted_lines.append("="*70)
        
        formatted_output = "\n".join(formatted_lines)
        
        return {
            'formatted_text': formatted_output,
            'summary': {
                'name': data.get('name', 'Unknown'),
                'symbol': data.get('symbol', 'Unknown'),
                'current_price': data.get('current_price', 0),
                'market_cap': data.get('market_cap', 0),
                'volume_24h': data.get('volume_24h', 0),
                'price_change_24h': data.get('price_change_24h', 0),
                'price_change_7d': data.get('price_change_7d', 0),
                'price_change_30d': data.get('price_change_30d', 0),
                'market_cap_rank': data.get('market_cap_rank', 0),
                'ath': data.get('ath', 0),
                'atl': data.get('atl', 0)
            }
        }
    except Exception as e:
        return {'error': f'Error formatting data: {str(e)}'}

def get_llm_analysis(formatted_data):
    """Get LLM analysis of the crypto data"""
    try:
        # Use the formatted text for analysis
        analysis_result = llm_service.analyze_coin(formatted_data.get('formatted_text', ''))
        
        if analysis_result:
            # Try to read the response file if debug mode is on
            if os.getenv("DEBUG", "").lower() == "true" and os.path.exists("response.txt"):
                with open("response.txt", "r", encoding="utf-8") as f:
                    return f.read()
            else:
                return "Analysis completed successfully. Enable DEBUG=true for detailed output."
        else:
            return "Analysis failed. Please check your API configuration."
            
    except Exception as e:
        return f"Error during LLM analysis: {str(e)}"

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)