/**
 * Tax Calculator
 * Calculates VAT, Sales Tax, and GST
 * Supports both adding tax (Net -> Gross) and removing tax (Gross -> Net)
 */

(function () {
    'use strict';

    class TaxCalculator {
        constructor() {
            this.mode = 'add'; // 'add' or 'remove'
            this.init();
        }

        init() {
            this.cacheElements();
            this.bindEvents();
            // Initial calculation if values exist
            if (this.amountInput.value) {
                this.calculate();
            }
        }

        cacheElements() {
            // Inputs
            this.modeButtons = document.querySelectorAll('[data-mode]');
            this.calcModeInput = document.getElementById('calcMode');
            this.amountInput = document.getElementById('amount');
            this.amountHint = document.getElementById('amountHint');
            this.taxRateInput = document.getElementById('taxRate');
            this.presetButtons = document.querySelectorAll('.preset-btn');

            // Buttons
            this.calculateBtn = document.getElementById('calculateBtn');
            this.recalculateBtn = document.getElementById('recalculateBtn');

            // Results
            this.resultsSection = document.getElementById('resultsSection');
            this.errorMessage = document.getElementById('errorMessage');
            this.errorText = document.getElementById('errorText');

            // Result values
            this.totalAmountValue = document.getElementById('totalAmount');
            this.taxAmountValue = document.getElementById('taxAmount');
            this.netAmountValue = document.getElementById('netAmount');
            this.taxRateDisplay = document.getElementById('taxRateDisplay');
        }

        bindEvents() {
            // Mode switching
            this.modeButtons.forEach(btn => {
                btn.addEventListener('click', () => this.handleModeChange(btn));
            });

            // Preset rates
            this.presetButtons.forEach(btn => {
                btn.addEventListener('click', () => {
                    this.taxRateInput.value = btn.dataset.rate;
                    this.calculate();
                });
            });

            // Calculate on button click
            this.calculateBtn.addEventListener('click', () => this.calculate());

            // Calculate on enter key
            this.amountInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.calculate();
            });
            this.taxRateInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.calculate();
            });

            // Recalculate
            if (this.recalculateBtn) {
                this.recalculateBtn.addEventListener('click', () => {
                    this.resultsSection.style.display = 'none';
                    this.amountInput.focus();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                });
            }
        }

        handleModeChange(btn) {
            const mode = btn.dataset.mode;
            this.mode = mode;
            this.calcModeInput.value = mode;

            // Update UI
            this.modeButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Update hint text using i18n
            if (window.i18n && typeof window.i18n.t === 'function') {
                const hintKey = mode === 'add' ? 'tax.amountHintAdd' : 'tax.amountHintRemove';
                this.amountHint.textContent = window.i18n.t(hintKey);
            } else {
                // Fallback for when i18n is not available
                if (mode === 'add') {
                    this.amountHint.textContent = 'Net amount (before tax)';
                } else {
                    this.amountHint.textContent = 'Gross amount (tax included)';
                }
            }

            // Recalculate if values exist
            if (this.amountInput.value) {
                this.calculate();
            }
        }

        calculate() {
            this.hideError();

            const amount = parseFloat(this.amountInput.value);
            const rate = parseFloat(this.taxRateInput.value);

            // Validation
            if (isNaN(amount) || amount < 0) {
                this.showError('error.invalidAmount');
                return;
            }

            if (isNaN(rate) || rate < 0) {
                this.showError('error.invalidTaxRate');
                return;
            }

            let netAmount, taxAmount, totalAmount;

            if (this.mode === 'add') {
                // Add Tax: Net -> Gross
                netAmount = amount;
                taxAmount = amount * (rate / 100);
                totalAmount = netAmount + taxAmount;
            } else {
                // Remove Tax: Gross -> Net
                totalAmount = amount;
                // Formula: Net = Total / (1 + rate/100)
                netAmount = totalAmount / (1 + (rate / 100));
                taxAmount = totalAmount - netAmount;
            }

            this.displayResults(netAmount, taxAmount, totalAmount, rate);
        }

        displayResults(net, tax, total, rate) {
            // Format currency
            const format = (num) => {
                if (window.i18n && typeof window.i18n.formatNumber === 'function') {
                    // Let's assume USD for now as currency is not specified.
                    return window.i18n.formatNumber(num, {
                        style: 'currency',
                        currency: 'USD',
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    });
                }
                // Fallback
                return new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }).format(num);
            };

            this.netAmountValue.textContent = format(net);
            this.taxAmountValue.textContent = format(tax);
            this.totalAmountValue.textContent = format(total);
            this.taxRateDisplay.textContent = `@ ${rate}%`;

            // Show results
            this.resultsSection.style.display = 'block';

            // Scroll to results on mobile
            if (window.innerWidth < 768) {
                setTimeout(() => {
                    this.resultsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }, 100);
            }
        }

        showError(messageKey) {
            const message = (window.i18n && typeof window.i18n.t === 'function')
                ? window.i18n.t(messageKey)
                : messageKey.includes('.') ? messageKey.split('.').pop() : messageKey; // Basic fallback
            this.errorText.textContent = message;
            this.errorMessage.style.display = 'flex';
        }

        hideError() {
            this.errorMessage.style.display = 'none';
        }
    }

    // Initialize calculator when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => new TaxCalculator());
    } else {
        new TaxCalculator();
    }
})();
