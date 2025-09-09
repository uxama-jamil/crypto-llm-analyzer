import requests                 # Imports the 'requests' library to make HTTP calls to web APIs.
import pandas as pd             # Imports pandas for working with tables (DataFrames), CSV/Excel I/O.
from datetime import datetime   # Imports 'datetime' class to handle timestamps.
import time                     # Imports 'time' to pause execution (sleep) between API calls.
from typing import Dict, List, Optional  # Type hints: Dict, List, Optional for clearer code.

# ---------------------------------------------------------------------
# Class: CryptoInsightsClient
# A helper to fetch crypto data from the CoinGecko API.
# Example use:
#   client = CryptoInsightsClient()
#   data = client.scrape_coin_data("btc", "weekly")
# ---------------------------------------------------------------------
class CryptoInsightsClient:
    """
    A scraper class for fetching cryptocurrency data from CoinGecko API.
    """

    def __init__(self):
        self.base_url = "https://api.coingecko.com/api/v3"  # Base URL for all API endpoints.
        self.session = requests.Session()                   # Re-uses one HTTP session (faster, shared headers).

        # Add headers to avoid rate limiting
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            # Pretends to be a normal browser; some APIs restrict unknown clients.
            'Accept': 'application/json',                   # We want JSON back from the API.
            'Accept-Language': 'en-US,en;q=0.9'             # Preferred language for responses.
        })

        # Configure session
        self.session.timeout = 30                           # Default timeout (seconds) for requests via this session.
        print("CoinGecko API Scraper initialized")          # Simple startup log.

    def get_coin_id(self, coin_input: str) -> Optional[str]:
        """
        Convert coin name or symbol to CoinGecko coin ID.
        Example: 'btc' -> 'bitcoin'
        Returns None if not found.
        """
        try:
            print(f"Looking up coin ID for: {coin_input}")  # Debug: show what we’re searching.

            # First, try to get coins list with search
            url = f"{self.base_url}/search"                 # Endpoint: /search to find coins by query.
            params = {'query': coin_input}                  # Query param: the thing the user typed.
            response = self.session.get(url, params=params, timeout=10)  # HTTP GET with 10s timeout.

            if response.status_code == 200:                 # If success (HTTP 200)…
                search_data = response.json()               # Parse JSON into a Python dict.

                # Check coins in search results
                for coin in search_data.get('coins', []):   # Loop over 'coins' array (or empty list if missing).
                    if (coin['id'].lower() == coin_input.lower() or 
                        coin['name'].lower() == coin_input.lower() or 
                        coin['symbol'].lower() == coin_input.lower()):
                        # If exact match by id/name/symbol (case-insensitive)…
                        print(f"[OK] Found coin ID: {coin['id']}")
                        return coin['id']                   # Return the canonical CoinGecko id (e.g., 'bitcoin').

                # If exact match not found, return first result if available
                if search_data.get('coins'):                # If there’s at least one result…
                    first_match = search_data['coins'][0]   # Pick the top suggestion.
                    print(f"[OK] Using closest match: {first_match['id']} ({first_match['name']})")
                    return first_match['id']                # Return the closest match’s id.

            # Fallback: try getting full coins list (rate limited approach)
            print("Searching in full coins list...")        # Log that we’re using the backup plan.
            url = f"{self.base_url}/coins/list"             # Endpoint: huge list of all coins (heavier).
            response = self.session.get(url, timeout=15)    # GET with 15s timeout.

            if response.status_code == 200:                 # If success…
                coins = response.json()                     # Parse the big list (array of {id,name,symbol}).
                coin_input_lower = coin_input.lower()       # Lowercase once for speed/readability.

                # Search by ID, name, or symbol
                for coin in coins:                          # Loop all coins; find exact lowercase match.
                    if (coin['id'].lower() == coin_input_lower or 
                        coin['name'].lower() == coin_input_lower or 
                        coin['symbol'].lower() == coin_input_lower):
                        print(f"[OK] Found coin ID: {coin['id']}")
                        return coin['id']

            print(f"[ERROR] Could not find coin: {coin_input}")  # If we’re here, nothing matched.
            return None                                          # Signal that lookup failed.

        except requests.exceptions.RequestException as e:    # Network errors, timeouts, etc.
            print(f"[ERROR] Error fetching coin ID: {e}")    # Log the error.
            return None                                       # Return None on error.

    def get_current_data(self, coin_id: str) -> Optional[Dict]:
        """
        Fetch current market data for a cryptocurrency by coin id.
        Example: coin_id='bitcoin'
        Returns a dict of metrics or None on error.
        """
        try:
            print(f"Fetching current market data for: {coin_id}")  # Log target coin.

            url = f"{self.base_url}/coins/{coin_id}"         # Endpoint: /coins/{id}
            params = {
                'localization': 'false',                     # Don’t include multi-language fields.
                'tickers': 'false',                          # Skip exchange tickers (less data -> faster).
                'market_data': 'true',                       # We want prices, caps, volumes, % changes.
                'community_data': 'false',                   # Skip community stats.
                'developer_data': 'false',                   # Skip developer stats.
                'sparkline': 'false'                         # Skip tiny sparkline arrays.
            }

            response = self.session.get(url, params=params, timeout=15)  # Make the call.
            response.raise_for_status()                   # Raise an error for non-2xx responses.

            data = response.json()                        # Parse JSON.
            market_data = data.get('market_data', {})     # Safely get 'market_data' dict (or empty dict).

            # Extract data with safe navigation (use defaults if keys missing)
            current_data = {
                'coin_id': coin_id,                                           # Echo which coin this is.
                'name': data.get('name', 'Unknown'),                          # e.g., 'Bitcoin'
                'symbol': data.get('symbol', 'Unknown').upper(),              # e.g., 'BTC'
                'current_price': market_data.get('current_price', {}).get('usd', 0),
                # Example: 61234.56
                'market_cap': market_data.get('market_cap', {}).get('usd', 0),
                # Total market cap in USD.
                'volume_24h': market_data.get('total_volume', {}).get('usd', 0),
                # Last 24h traded volume (USD).
                'price_change_24h': market_data.get('price_change_percentage_24h', 0),
                # Price % change in last 24h.
                'price_change_7d': market_data.get('price_change_percentage_7d', 0),
                # Price % change in last 7 days.
                'price_change_30d': market_data.get('price_change_percentage_30d', 0),
                # Price % change in last 30 days.
                'circulating_supply': market_data.get('circulating_supply', 0),
                # Coins currently circulating.
                'total_supply': market_data.get('total_supply', 0),           # Total minted so far.
                'max_supply': market_data.get('max_supply', 0),               # Maximum possible (if defined).
                'ath': market_data.get('ath', {}).get('usd', 0),              # All-time high price (USD).
                'atl': market_data.get('atl', {}).get('usd', 0),              # All-time low price (USD).
                'market_cap_rank': data.get('market_cap_rank', 0),            # Rank by market cap (1 is top).
                'last_updated': market_data.get('last_updated', datetime.now().isoformat())
                # Timestamp string of last update; fallback to "now" if missing.
            }

            print(f"[OK] Current price: ${current_data['current_price']:,.2f}")  # Friendly logs.
            print(f"[OK] Market cap: ${current_data['market_cap']:,}")
            print(f"[OK] 24h volume: ${current_data['volume_24h']:,}")

            return current_data                           # Hand back the assembled metrics.

        except requests.exceptions.RequestException as e:  # Network/HTTP errors.
            print(f"[ERROR] Error fetching current data: {e}")
            return None
        except KeyError as e:                              # If a key is missing unexpectedly.
            print(f"[ERROR] Error parsing market data: {e}")
            return None

    def get_historical_data(self, coin_id: str, timeframe: str) -> List[Dict]:
        """
        Fetch historical prices/volume/market cap for a timeframe.
        timeframe: 'daily' (1 day), 'weekly' (7 days), 'monthly' (30 days)
        Returns a list of points like:
          {'timestamp': 1694284800000, 'date': '2023-09-10 00:00:00', 'price': 25999.12, ...}
        """
        try:
            print(f"Fetching historical data for {timeframe} timeframe...")  # Log which timeframe.

            # Map friendly timeframe to API parameters
            timeframe_config = {
                'daily': {'days': 1, 'interval': 'hourly'},   # 1 day, hourly points.
                'weekly': {'days': 7, 'interval': 'hourly'},  # 7 days, hourly points.
                'monthly': {'days': 30, 'interval': 'daily'}  # 30 days, daily points.
            }

            config = timeframe_config.get(timeframe, timeframe_config['weekly'])
            # If an unknown timeframe is given, default to weekly.

            url = f"{self.base_url}/coins/{coin_id}/market_chart"  # Endpoint for historic chart data.
            params = {
                'vs_currency': 'usd',                       # Prices in USD.
                'days': config['days'],                     # How many days back.
                'interval': config['interval']              # 'hourly' or 'daily' sampling.
            }
            # (Optional API key header commented out)
            # self.session.headers.update({
            # 'x-cg-demo-api-key': os.getenv("COINGEKO_API_KEY", "")
            # })
            print(f"header of historical data {self.session.headers}")  # Debug: show headers being sent.

            response = self.session.get(url, params=params, timeout=15)  # Make the request.
            response.raise_for_status()                                   # Error if not 2xx.

            data = response.json()                        # Parse JSON.
            prices = data.get('prices', [])               # List of [timestamp_ms, price] pairs.
            volumes = data.get('total_volumes', [])       # List of [timestamp_ms, volume] pairs.
            market_caps = data.get('market_caps', [])     # List of [timestamp_ms, market_cap] pairs.

            historical_data = []                          # Will collect merged points (price/vol/cap).

            # Combine price, volume, and market cap data by index.
            for i, (timestamp, price) in enumerate(prices):
                date = datetime.fromtimestamp(timestamp / 1000)  # Convert ms since epoch to datetime.

                # Find matching volume and market cap at same index (if present).
                volume = volumes[i][1] if i < len(volumes) else 0
                market_cap = market_caps[i][1] if i < len(market_caps) else 0

                historical_data.append({
                    'timestamp': timestamp,                         # Raw ms timestamp.
                    'date': date.strftime('%Y-%m-%d %H:%M:%S'),     # Human-readable time.
                    'price': round(price, 8),                       # Price rounded to 8 decimals.
                    'volume': round(volume, 2),                     # Volume rounded to 2 decimals.
                    'market_cap': round(market_cap, 2)              # Market cap rounded to 2 decimals.
                })

            print(f"[OK] Retrieved {len(historical_data)} historical data points")  # Log count.
            return historical_data                      # Hand back the list of points.

        except requests.exceptions.RequestException as e:  # Network/HTTP errors.
            print(f"[ERROR] Error fetching historical data: {e}")
            return []
        except KeyError as e:                              # Unexpected shape in API data.
            print(f"[ERROR] Error parsing historical data: {e}")
            return []

    def get_price_alerts_data(self, coin_id: str) -> Dict:
        """
        Fetch extra global market stats (not specific to one coin).
        Example metrics: total market cap, total 24h volume, BTC dominance.
        """
        try:
            # Get global market data
            global_url = f"{self.base_url}/global"         # Endpoint: /global for overall market stats.
            response = self.session.get(global_url, timeout=10)  # GET with 10s timeout.

            if response.status_code == 200:                # If success…
                global_data = response.json().get('data', {})  # Extract 'data' field.

                return {
                    'total_market_cap_usd': global_data.get('total_market_cap', {}).get('usd', 0),
                    # Example: 1.2e12
                    'total_volume_24h_usd': global_data.get('total_volume', {}).get('usd', 0),
                    # Example: 5.6e10
                    'bitcoin_percentage': global_data.get('market_cap_percentage', {}).get('btc', 0),
                    # BTC dominance percentage.
                    'active_cryptocurrencies': global_data.get('active_cryptocurrencies', 0),
                    # Count of listed cryptos.
                    'markets': global_data.get('markets', 0)  # Count of markets tracked.
                }
        except:
            pass                                            # Silently ignore errors and fall through.

        return {}                                           # Return empty dict if failed.

    def scrape_coin_data(self, coin_input: str, timeframe: str) -> Optional[Dict]:
        """
        Orchestrates all steps:
          1) Resolve coin_input (like 'eth') to coin_id ('ethereum')
          2) Fetch current data
          3) Fetch historical data for timeframe
          4) Fetch global market stats
          5) Combine into one result dict
        Returns None if any critical step fails.
        """
        print(f"Starting data collection for: {coin_input}")  # Start banner.
        print("=" * 50)

        # Get coin ID
        coin_id = self.get_coin_id(coin_input)             # Resolve user input to CoinGecko id.
        if not coin_id:                                    # If not found…
            print(f"[ERROR] Could not find coin: {coin_input}")
            print("[TIP] Try using the exact coin name or symbol (e.g., 'bitcoin', 'btc', 'ethereum', 'eth')")
            return None                                    # Abort early.

        # Get current market data
        current_data = self.get_current_data(coin_id)      # Live metrics.
        if not current_data:                               # If failed…
            print("[ERROR] Failed to fetch current market data")
            return None                                    # Abort.

        # Add small delay to respect rate limits
        time.sleep(1)                                      # Pause 1 sec (be nice to API).

        # Get historical data
        historical_data = self.get_historical_data(coin_id, timeframe)  # Past prices/vol/caps.

        # Add small delay to respect rate limits
        time.sleep(0.5)                                    # Short pause.

        # Get additional market data
        additional_data = self.get_price_alerts_data(coin_id)  # Global stats (optional).

        # Combine all data into a single dict for the caller.
        result = {
            **current_data,                                # Spread current data fields in.
            'timeframe': timeframe,                        # Echo requested timeframe.
            'historical_prices': historical_data,          # List of historical points.
            'data_points': len(historical_data),           # How many points we got.
            'global_market_data': additional_data,         # Extra stats (may be {}).
            'scraped_at': datetime.now().isoformat(),      # When we built this result.
            'data_source': 'CoinGecko API'                 # Provenance for transparency.
        }

        print("=" * 50)                                    # End banner.
        print("[SUCCESS] Data collection completed successfully!")

        return result                                      # Give back the combined package.


# ---------------------------------------------------------------------
# Function: save_to_csv
# Saves the collected data to an Excel file (multi-sheet) and a CSV.
# Example:
#   data = client.scrape_coin_data("btc", "weekly")
#   save_to_csv(data, "bitcoin_weekly.csv")
# Produces:
#   - bitcoin_weekly.xlsx (Current Data, Historical Prices sheets)
#   - bitcoin_weekly.csv  (Current Data only)
# ---------------------------------------------------------------------
def save_to_csv(data: Dict, filename: str):
    """Save coin data to CSV and Excel files."""
    try:
        # Create main data DataFrame (single-row summary of current stats).
        main_data = {
            'Coin': data['name'],                           # e.g., 'Bitcoin'
            'Symbol': data['symbol'],                       # e.g., 'BTC'
            'Current Price (USD)': data['current_price'],   # Latest price.
            'Market Cap (USD)': data['market_cap'],         # Current market cap.
            '24h Volume (USD)': data['volume_24h'],         # Last 24h volume.
            'Market Cap Rank': data['market_cap_rank'],     # Rank by market cap.
            'Circulating Supply': data['circulating_supply'],  # Coins in circulation.
            'Total Supply': data['total_supply'],           # Total minted so far.
            'Max Supply': data['max_supply'],               # Max cap if defined.
            '24h Change (%)': data['price_change_24h'],     # % change in 24h.
            '7d Change (%)': data['price_change_7d'],       # % change in 7d.
            '30d Change (%)': data['price_change_30d'],     # % change in 30d.
            'All Time High (USD)': data['ath'],             # ATH price.
            'All Time Low (USD)': data['atl'],              # ATL price.
            'Timeframe': data['timeframe'],                 # daily/weekly/monthly.
            'Data Source': data['data_source'],             # 'CoinGecko API'
            'Last Updated': data['last_updated'],           # Timestamp from API.
            'Scraped At': data['scraped_at']                # When we built the payload.
        }

        # Add global market data if available (optional fields).
        if data.get('global_market_data'):
            global_data = data['global_market_data']
            main_data.update({
                'Total Crypto Market Cap (USD)': global_data.get('total_market_cap_usd', 0),
                'Total 24h Volume (USD)': global_data.get('total_volume_24h_usd', 0),
                'Bitcoin Dominance (%)': global_data.get('bitcoin_percentage', 0),
                'Active Cryptocurrencies': global_data.get('active_cryptocurrencies', 0)
            })

        main_df = pd.DataFrame([main_data])                # One-row DataFrame for the summary.

        # Create historical data DataFrame (may be empty).
        if data['historical_prices']:
            historical_df = pd.DataFrame(data['historical_prices'])  # Table of all points.
        else:
            historical_df = pd.DataFrame()                 # Empty if none.

        # Save to Excel with multiple sheets
        excel_filename = filename.replace('.csv', '.xlsx') # If caller passed .csv, also create .xlsx.
        with pd.ExcelWriter(excel_filename, engine='openpyxl') as writer:
            main_df.to_excel(writer, sheet_name='Current Data', index=False)     # Sheet 1: summary.
            if not historical_df.empty:
                historical_df.to_excel(writer, sheet_name='Historical Prices', index=False)
                # Sheet 2: time series (if available).

        # Also save main data to CSV (summary only)
        csv_filename = filename if filename.endswith('.csv') else f"{filename}.csv"
        main_df.to_csv(csv_filename, index=False)          # Writes a CSV without the pandas index column.

        print(f"Data saved to:")                           # Friendly output showing file paths.
        print(f"   Excel: {excel_filename}")
        print(f"   CSV: {csv_filename}")

    except Exception as e:                                  # Any error during file creation/writing.
        print(f"Error saving to file: {e}")                 # Log the error so you can debug.
