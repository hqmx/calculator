(function () {
    'use strict';

    /**
     * Currency Converter Logic
     * Uses ExchangeRate-API (Open Access Endpoint)
     * API: https://open.er-api.com/v6/latest/USD
     */
    class CurrencyConverter {
        constructor() {
            this.apiEndpoint = 'https://open.er-api.com/v6/latest/USD';
            this.rates = null;
            this.lastUpdated = null;
            this.cacheKey = 'hqmx_currency_rates';
            this.cacheDuration = 3600 * 1000; // 1 hour in milliseconds

            // DOM Elements
            this.amountInput = document.getElementById('amount');
            this.fromSelect = document.getElementById('fromCurrency');
            this.toSelect = document.getElementById('toCurrency');
            this.swapBtn = document.getElementById('swapBtn');
            this.calculateBtn = document.getElementById('calculateBtn');
            this.resultsSection = document.getElementById('resultsSection');
            this.loadingIndicator = document.getElementById('loadingIndicator');
            this.errorMessage = document.getElementById('errorMessage');
            this.errorText = document.getElementById('errorText');

            // Result Elements
            this.displayAmount = document.getElementById('displayAmount');
            this.displayFromCurrency = document.getElementById('displayFromCurrency');
            this.resultValue = document.getElementById('resultValue');
            this.displayToCurrency = document.getElementById('displayToCurrency');

            // New Elements
            this.summaryRate = document.getElementById('summaryRate');
            this.inverseRate = document.getElementById('inverseRate');
            this.lastUpdatedDisplay = document.getElementById('lastUpdated');

            // Common Currencies List (Ordered by priority)
            this.commonCurrencies = [
                { code: 'USD', name: 'US Dollar' },
                { code: 'EUR', name: 'Euro' },
                { code: 'KRW', name: 'South Korean Won' },
                { code: 'JPY', name: 'Japanese Yen' },
                { code: 'GBP', name: 'British Pound' },
                { code: 'CNY', name: 'Chinese Yuan' },
                { code: 'AUD', name: 'Australian Dollar' },
                { code: 'CAD', name: 'Canadian Dollar' },
                { code: 'CHF', name: 'Swiss Franc' },
                { code: 'HKD', name: 'Hong Kong Dollar' },
                { code: 'NZD', name: 'New Zealand Dollar' },
                { code: 'SGD', name: 'Singapore Dollar' },
                { code: 'INR', name: 'Indian Rupee' },
                { code: 'THB', name: 'Thai Baht' },
                { code: 'VND', name: 'Vietnamese Dong' },
                { code: 'PHP', name: 'Philippine Peso' },
                { code: 'IDR', name: 'Indonesian Rupiah' },
                { code: 'MYR', name: 'Malaysian Ringgit' },
                { code: 'TWD', name: 'New Taiwan Dollar' },
                { code: 'RUB', name: 'Russian Ruble' },
                { code: 'BRL', name: 'Brazilian Real' },
                { code: 'MXN', name: 'Mexican Peso' },
                { code: 'ZAR', name: 'South African Rand' },
                { code: 'TRY', name: 'Turkish Lira' },
                { code: 'SEK', name: 'Swedish Krona' },
                { code: 'NOK', name: 'Norwegian Krone' },
                { code: 'DKK', name: 'Danish Krone' },
                { code: 'PLN', name: 'Polish Zloty' }
            ];

            this.init();
        }

        init() {
            this.populateCurrencySelects();
            this.loadRates();
            this.bindEvents();
        }

        bindEvents() {
            this.calculateBtn.addEventListener('click', () => this.convert());
            this.swapBtn.addEventListener('click', () => this.swapCurrencies());

            // Real-time calculation on input (optional, maybe debounce)
            this.amountInput.addEventListener('input', () => {
                if (this.rates) this.convert();
            });

            this.fromSelect.addEventListener('change', () => {
                if (this.rates) this.convert();
            });

            this.toSelect.addEventListener('change', () => {
                if (this.rates) this.convert();
            });
        }

        populateCurrencySelects() {
            // Keep existing options or clear and rebuild? 
            // The HTML already has some top options. Let's rebuild to be safe and sorted.

            const createOption = (currency) => {
                const option = document.createElement('option');
                option.value = currency.code;
                option.textContent = `${currency.code} - ${currency.name}`;
                return option;
            };

            // Save current selections
            const currentFrom = this.fromSelect.value;
            const currentTo = this.toSelect.value;

            this.fromSelect.innerHTML = '';
            this.toSelect.innerHTML = '';

            this.commonCurrencies.forEach(currency => {
                this.fromSelect.appendChild(createOption(currency));
                this.toSelect.appendChild(createOption(currency));
            });

            // Restore selections if they exist in the new list, otherwise default
            if (this.commonCurrencies.some(c => c.code === currentFrom)) {
                this.fromSelect.value = currentFrom;
            } else {
                this.fromSelect.value = 'USD';
            }

            if (this.commonCurrencies.some(c => c.code === currentTo)) {
                this.toSelect.value = currentTo;
            } else {
                this.toSelect.value = 'KRW';
            }
        }

        async loadRates() {
            this.showLoading(true);
            this.hideError();

            try {
                // Check cache
                const cachedData = localStorage.getItem(this.cacheKey);
                if (cachedData) {
                    const { rates, timestamp } = JSON.parse(cachedData);
                    const now = Date.now();

                    if (now - timestamp < this.cacheDuration) {
                        console.log('Using cached exchange rates');
                        this.rates = rates;
                        this.lastUpdated = new Date(timestamp);
                        this.updateLastUpdatedDisplay();
                        this.showLoading(false);
                        this.convert(); // Initial conversion
                        return;
                    }
                }

                // Fetch new data
                console.log('Fetching new exchange rates...');
                const response = await fetch(this.apiEndpoint);
                if (!response.ok) throw new Error('Failed to fetch exchange rates');

                const data = await response.json();
                if (data.result !== 'success') throw new Error('API returned error');

                this.rates = data.rates;
                this.lastUpdated = new Date(); // Use current time as fetch time

                // Cache data
                localStorage.setItem(this.cacheKey, JSON.stringify({
                    rates: this.rates,
                    timestamp: this.lastUpdated.getTime()
                }));

                this.updateLastUpdatedDisplay();
                this.convert(); // Initial conversion

            } catch (error) {
                console.error('Currency Converter Error:', error);
                this.showError('Failed to load exchange rates. Please check your internet connection.');
            } finally {
                this.showLoading(false);
            }
        }

        convert() {
            if (!this.rates) return;

            const amount = parseFloat(this.amountInput.value);
            const fromCurrency = this.fromSelect.value;
            const toCurrency = this.toSelect.value;

            if (isNaN(amount)) {
                // Don't show error, just don't calculate or show 0
                this.resultValue.textContent = '---';
                return;
            }

            // Conversion Logic
            // Base is USD. 
            // To convert FROM -> TO: (Amount / Rate[FROM]) * Rate[TO]

            const rateFrom = this.rates[fromCurrency];
            const rateTo = this.rates[toCurrency];

            if (!rateFrom || !rateTo) {
                this.showError('Selected currency rate not available.');
                return;
            }

            const result = (amount / rateFrom) * rateTo;
            const singleUnitResult = (1 / rateFrom) * rateTo;
            const inverseUnitResult = 1 / singleUnitResult;

            // Display Results
            this.resultsSection.style.display = 'block';

            // Format numbers
            this.displayAmount.textContent = this.formatNumber(amount);
            this.displayFromCurrency.textContent = fromCurrency;
            this.displayToCurrency.textContent = toCurrency;

            // Smart formatting for result (decimals based on value)
            this.resultValue.textContent = this.formatCurrency(result, toCurrency);

            // Update Summary & Inverse Rate
            this.summaryRate.textContent = `1 ${fromCurrency} = ${this.formatCurrency(singleUnitResult, toCurrency)} ${toCurrency}`;
            this.inverseRate.textContent = `1 ${toCurrency} = ${this.formatCurrency(inverseUnitResult, fromCurrency)} ${fromCurrency}`;
        }

        swapCurrencies() {
            const temp = this.fromSelect.value;
            this.fromSelect.value = this.toSelect.value;
            this.toSelect.value = temp;

            // Add animation class
            this.swapBtn.classList.add('fa-spin');
            setTimeout(() => this.swapBtn.classList.remove('fa-spin'), 300);

            this.convert();
        }

        formatNumber(num) {
            return new Intl.NumberFormat().format(num);
        }

        formatCurrency(num, currencyCode) {
            // Use Intl.NumberFormat for currency if possible, or custom logic
            // For this display, we want the number part mostly

            let decimals = 2;
            if (currencyCode === 'KRW' || currencyCode === 'JPY' || currencyCode === 'VND') {
                decimals = 0;
            } else if (num < 0.01) {
                decimals = 6;
            } else if (num < 1) {
                decimals = 4;
            }

            return num.toLocaleString(undefined, {
                minimumFractionDigits: decimals,
                maximumFractionDigits: decimals
            });
        }

        updateLastUpdatedDisplay() {
            if (this.lastUpdated) {
                this.lastUpdatedDisplay.textContent = this.lastUpdated.toLocaleString();
            }
        }

        showLoading(isLoading) {
            if (this.loadingIndicator) {
                this.loadingIndicator.style.display = isLoading ? 'block' : 'none';
            }
            if (this.calculateBtn) {
                this.calculateBtn.disabled = isLoading;
            }
        }

        showError(message) {
            if (this.errorMessage && this.errorText) {
                this.errorText.textContent = message;
                this.errorMessage.style.display = 'flex';
                this.resultsSection.style.display = 'none';
            }
        }

        hideError() {
            if (this.errorMessage) {
                this.errorMessage.style.display = 'none';
            }
        }
    }

    // Initialize
    document.addEventListener('DOMContentLoaded', function () {
        new CurrencyConverter();
    });
})();
