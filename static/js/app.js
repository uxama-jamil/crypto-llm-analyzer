// Crypto LLM Analyzer Frontend JavaScript

class CryptoAnalyzer {
    constructor() {
        this.apiBase = '';
        this.currentData = null;
        this.init();
    }

    init() {
        this.bindEvents();
        this.initTabs();
    }

    bindEvents() {
        // Analyze button
        const analyzeBtn = document.getElementById('analyze-btn');
        const coinInput = document.getElementById('coin-input');
        
        analyzeBtn.addEventListener('click', () => this.analyzeCrypto());
        
        // Enter key on input
        coinInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.analyzeCrypto();
            }
        });

        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tabId = e.target.getAttribute('data-tab');
                this.switchTab(tabId);
            });
        });
    }

    initTabs() {
        // Initialize first tab as active
        this.switchTab('overview');
    }

    switchTab(tabId) {
        // Remove active class from all tabs and panes
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));

        // Add active class to selected tab and pane
        document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
        document.getElementById(tabId).classList.add('active');
    }

    async analyzeCrypto() {
        const coin = document.getElementById('coin-input').value.trim();
        const timeframe = document.getElementById('timeframe-select').value;

        if (!coin) {
            this.showError('Please enter a cryptocurrency name or symbol');
            return;
        }

        this.showLoading(true);
        this.hideError();
        this.hideResults();

        try {
            const response = await fetch('/api/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    coin: coin,
                    timeframe: timeframe
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Analysis failed');
            }

            this.currentData = data;
            this.displayResults(data);
            this.showResults();

        } catch (error) {
            console.error('Analysis error:', error);
            this.showError(error.message || 'An error occurred during analysis');
        } finally {
            this.showLoading(false);
        }
    }

    displayResults(data) {
        const cryptoData = data.data;
        const summary = data.formatted_data?.summary || {};

        // Update header
        document.getElementById('coin-title').textContent = 
            `${cryptoData.name} (${cryptoData.symbol})`;
        document.getElementById('timestamp').textContent = 
            `Updated: ${new Date(data.timestamp).toLocaleString()}`;

        // Update overview metrics
        this.updateMetrics(summary);

        // Update AI analysis
        this.updateAnalysis(data.llm_analysis);

        // Update historical data
        this.updateHistoricalData(cryptoData.historical_prices || []);
    }

    updateMetrics(summary) {
        const metrics = {
            'current-price': this.formatCurrency(summary.current_price),
            'market-cap': this.formatLargeNumber(summary.market_cap),
            'volume-24h': this.formatLargeNumber(summary.volume_24h),
            'market-rank': `#${summary.market_cap_rank || 'N/A'}`,
            'change-24h': this.formatPercentage(summary.price_change_24h),
            'change-7d': this.formatPercentage(summary.price_change_7d),
            'change-30d': this.formatPercentage(summary.price_change_30d),
            'ath': this.formatCurrency(summary.ath)
        };

        Object.entries(metrics).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value;
                
                // Add color classes for percentage changes
                if (id.includes('change')) {
                    const numValue = parseFloat(value);
                    element.classList.remove('positive', 'negative');
                    if (numValue > 0) {
                        element.classList.add('positive');
                    } else if (numValue < 0) {
                        element.classList.add('negative');
                    }
                }
            }
        });
    }

    updateAnalysis(analysis) {
        const analysisContainer = document.getElementById('llm-analysis');
        const placeholder = analysisContainer.querySelector('.analysis-placeholder');
        
        if (!analysis) {
            if (placeholder) placeholder.textContent = 'No analysis available. Please check your API configuration.';
            return;
        }

        try {
            // Parse the JSON analysis
            const analysisData = typeof analysis === 'string' ? JSON.parse(analysis) : analysis;
            
            // Hide placeholder
            if (placeholder) placeholder.style.display = 'none';
            
            // Show all analysis sections
            document.querySelectorAll('.analysis-section').forEach(section => {
                section.style.display = 'block';
            });
            
            // Update Market Analysis
            this.updateMarketAnalysis(analysisData.market_analysis);
            
            // Update Trading Zones
            this.updateTradingZones(analysisData.trading_zones);
            
            // Update Take Profit Levels
            this.updateTakeProfitLevels(analysisData.take_profit_levels);
            
            // Update Stop Loss
            this.updateStopLoss(analysisData.stop_loss);
            
            // Update Technical Indicators
            this.updateTechnicalIndicators(analysisData.technical_indicators);
            
            // Update Time Horizons
            this.updateTimeHorizons(analysisData.time_horizon);
            
            // Update Position Sizing
            this.updatePositionSizing(analysisData.position_sizing);
            
            // Update Risk Warnings
            this.updateRiskWarnings(analysisData.risk_warnings);
            
            // Update Key Insights
            this.updateKeyInsights(analysisData.key_insights);
            
        } catch (error) {
            console.error('Error parsing analysis:', error);
            if (placeholder) {
                placeholder.textContent = 'Error parsing analysis data. Raw analysis: ' + analysis;
                placeholder.style.display = 'block';
            }
        }
    }

    updateMarketAnalysis(marketAnalysis) {
        if (!marketAnalysis) return;
        
        this.updateElement('current-trend', marketAnalysis.current_trend);
        this.updateElement('trend-confidence', marketAnalysis.trend_confidence);
        this.updateElement('market-phase', marketAnalysis.market_phase);
        this.updateElement('risk-level', marketAnalysis.risk_level);
        this.updateElement('liquidity-assessment', marketAnalysis.liquidity_assessment);
    }

    updateTradingZones(tradingZones) {
        if (!tradingZones) return;
        
        // Primary Buy Zone
        if (tradingZones.primary_buy_zone) {
            const zone = tradingZones.primary_buy_zone;
            this.updateElement('primary-buy-price', zone.price_range);
            this.updateElement('primary-buy-confidence', zone.confidence);
            this.updateElement('primary-buy-ratio', zone.risk_reward_ratio);
            this.updateElement('primary-buy-rationale', zone.rationale);
        }
        
        // Secondary Buy Zone
        if (tradingZones.secondary_buy_zone) {
            const zone = tradingZones.secondary_buy_zone;
            this.updateElement('secondary-buy-price', zone.price_range);
            this.updateElement('secondary-buy-confidence', zone.confidence);
            this.updateElement('secondary-buy-ratio', zone.risk_reward_ratio);
            this.updateElement('secondary-buy-rationale', zone.rationale);
        }
        
        // Primary Resistance
        if (tradingZones.primary_resistance) {
            const resistance = tradingZones.primary_resistance;
            this.updateElement('resistance-price', resistance.price_range);
            this.updateElement('resistance-confidence', resistance.confidence);
            this.updateElement('resistance-rationale', resistance.rationale);
        }
        
        // Key Levels
        this.updateElement('key-support', tradingZones.key_support);
        this.updateElement('key-resistance', tradingZones.key_resistance);
    }

    updateTakeProfitLevels(takeProfitLevels) {
        if (!takeProfitLevels) return;
        
        // TP1 Conservative
        if (takeProfitLevels.tp1_conservative) {
            const tp = takeProfitLevels.tp1_conservative;
            this.updateElement('tp1-price', tp.price);
            this.updateElement('tp1-gain', tp.percentage_gain);
            this.updateElement('tp1-probability', tp.probability);
            this.updateElement('tp1-allocation', tp.allocation);
        }
        
        // TP2 Moderate
        if (takeProfitLevels.tp2_moderate) {
            const tp = takeProfitLevels.tp2_moderate;
            this.updateElement('tp2-price', tp.price);
            this.updateElement('tp2-gain', tp.percentage_gain);
            this.updateElement('tp2-probability', tp.probability);
            this.updateElement('tp2-allocation', tp.allocation);
        }
        
        // TP3 Aggressive
        if (takeProfitLevels.tp3_aggressive) {
            const tp = takeProfitLevels.tp3_aggressive;
            this.updateElement('tp3-price', tp.price);
            this.updateElement('tp3-gain', tp.percentage_gain);
            this.updateElement('tp3-probability', tp.probability);
            this.updateElement('tp3-allocation', tp.allocation);
        }
    }

    updateStopLoss(stopLoss) {
        if (!stopLoss) return;
        
        // Conservative SL
        if (stopLoss.conservative_sl) {
            const sl = stopLoss.conservative_sl;
            this.updateElement('conservative-sl-price', sl.price);
            this.updateElement('conservative-sl-loss', sl.percentage_loss);
            this.updateElement('conservative-sl-rationale', sl.rationale);
        }
        
        // Moderate SL
        if (stopLoss.moderate_sl) {
            const sl = stopLoss.moderate_sl;
            this.updateElement('moderate-sl-price', sl.price);
            this.updateElement('moderate-sl-loss', sl.percentage_loss);
            this.updateElement('moderate-sl-rationale', sl.rationale);
        }
    }

    updateTechnicalIndicators(indicators) {
        if (!indicators) return;
        
        this.updateElement('rsi-value', indicators.rsi_14);
        this.updateElement('macd-signal', indicators.macd_signal);
        this.updateElement('volume-trend', indicators.volume_trend);
        this.updateElement('ma-trend', indicators.moving_average_trend);
        this.updateElement('support-strength', indicators.support_strength);
        this.updateElement('resistance-strength', indicators.resistance_strength);
    }

    updateTimeHorizons(timeHorizons) {
        if (!timeHorizons) return;
        
        this.updateElement('short-term-outlook', timeHorizons.short_term_1_7_days);
        this.updateElement('medium-term-outlook', timeHorizons.medium_term_1_4_weeks);
        this.updateElement('long-term-outlook', timeHorizons.long_term_1_3_months);
    }

    updatePositionSizing(positionSizing) {
        if (!positionSizing) return;
        
        this.updateElement('conservative-size', positionSizing.conservative_trader);
        this.updateElement('moderate-size', positionSizing.moderate_trader);
        this.updateElement('aggressive-size', positionSizing.aggressive_trader);
        this.updateElement('maximum-risk', positionSizing.maximum_risk);
    }

    updateRiskWarnings(riskWarnings) {
        if (!riskWarnings) return;
        
        // Risk factors list
        const riskFactorsList = document.getElementById('risk-factors-list');
        if (riskFactorsList && riskWarnings.high_risk_factors) {
            riskFactorsList.innerHTML = '';
            riskWarnings.high_risk_factors.forEach(factor => {
                const li = document.createElement('li');
                li.textContent = factor;
                riskFactorsList.appendChild(li);
            });
        }
        
        this.updateElement('market-conditions-impact', riskWarnings.market_conditions_impact);
        this.updateElement('volatility-alert', riskWarnings.volatility_alert);
    }

    updateKeyInsights(keyInsights) {
        if (!keyInsights) return;
        
        this.updateElement('market-context', keyInsights.market_context);
        
        // Price catalysts list
        const catalystsList = document.getElementById('price-catalysts-list');
        if (catalystsList && keyInsights.price_catalysts) {
            catalystsList.innerHTML = '';
            keyInsights.price_catalysts.forEach(catalyst => {
                const li = document.createElement('li');
                li.textContent = catalyst;
                catalystsList.appendChild(li);
            });
        }
        
        // Alternative scenarios
        if (keyInsights.alternative_scenarios) {
            this.updateElement('bull-case', keyInsights.alternative_scenarios.bull_case);
            this.updateElement('bear-case', keyInsights.alternative_scenarios.bear_case);
        }
    }

    updateElement(elementId, value) {
        const element = document.getElementById(elementId);
        if (element && value !== undefined && value !== null) {
            element.textContent = value;
        }
    }

    updateHistoricalData(historicalPrices) {
        const container = document.getElementById('historical-data');
        
        if (!historicalPrices || historicalPrices.length === 0) {
            container.innerHTML = '<p>No historical data available.</p>';
            return;
        }

        // Create table
        const table = document.createElement('table');
        table.innerHTML = `
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Price</th>
                    <th>Volume</th>
                    <th>Market Cap</th>
                </tr>
            </thead>
            <tbody>
                ${historicalPrices.slice(-10).map(point => `
                    <tr>
                        <td>${new Date(point.date).toLocaleString()}</td>
                        <td>${this.formatCurrency(point.price)}</td>
                        <td>${this.formatLargeNumber(point.volume)}</td>
                        <td>${this.formatLargeNumber(point.market_cap)}</td>
                    </tr>
                `).join('')}
            </tbody>
        `;

        container.innerHTML = '<h4>Recent Historical Data (Last 10 Points)</h4>';
        container.appendChild(table);
    }

    formatCurrency(value) {
        if (!value || value === 0) return '$0.00';
        
        if (value < 0.01) {
            return `$${parseFloat(value).toFixed(8)}`;
        } else if (value < 1) {
            return `$${parseFloat(value).toFixed(4)}`;
        } else {
            return `$${parseFloat(value).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            })}`;
        }
    }

    formatLargeNumber(value) {
        if (!value || value === 0) return '0';
        
        const absValue = Math.abs(value);
        
        if (absValue >= 1e12) {
            return `$${(value / 1e12).toFixed(2)}T`;
        } else if (absValue >= 1e9) {
            return `$${(value / 1e9).toFixed(2)}B`;
        } else if (absValue >= 1e6) {
            return `$${(value / 1e6).toFixed(2)}M`;
        } else if (absValue >= 1e3) {
            return `$${(value / 1e3).toFixed(2)}K`;
        } else {
            return `$${value.toLocaleString()}`;
        }
    }

    formatPercentage(value) {
        if (value === null || value === undefined) return '0.00%';
        return `${value >= 0 ? '+' : ''}${parseFloat(value).toFixed(2)}%`;
    }

    showLoading(show) {
        const loading = document.getElementById('loading');
        const analyzeBtn = document.getElementById('analyze-btn');
        
        if (show) {
            loading.style.display = 'block';
            analyzeBtn.disabled = true;
            analyzeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analyzing...';
        } else {
            loading.style.display = 'none';
            analyzeBtn.disabled = false;
            analyzeBtn.innerHTML = '<i class="fas fa-search"></i> Analyze';
        }
    }

    showError(message) {
        const errorDiv = document.getElementById('error');
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
    }

    hideError() {
        document.getElementById('error').style.display = 'none';
    }

    showResults() {
        document.getElementById('results').style.display = 'block';
    }

    hideResults() {
        document.getElementById('results').style.display = 'none';
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CryptoAnalyzer();
});

// Add some popular crypto suggestions
document.addEventListener('DOMContentLoaded', () => {
    const coinInput = document.getElementById('coin-input');
    const popularCoins = ['bitcoin', 'ethereum', 'solana', 'cardano', 'polygon', 'chainlink'];
    
    // Add placeholder with random suggestion
    const randomCoin = popularCoins[Math.floor(Math.random() * popularCoins.length)];
    coinInput.placeholder = `Enter coin name or symbol (e.g., ${randomCoin})`;
});