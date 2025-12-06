(function () {
    'use strict';

    /**
     * Tip Calculator Logic
     * Calculates tip amount, total bill, and per-person amount
     */
    class TipCalculator {
        constructor() {
            // DOM Elements
            this.billAmountInput = document.getElementById('billAmount');
            this.customTipInput = document.getElementById('customTip');
            this.customTipGroup = document.getElementById('customTipGroup');
            this.numPeopleInput = document.getElementById('numPeople');
            this.tipBtns = document.querySelectorAll('.gender-btn[data-tip]');
            this.calculateBtn = document.getElementById('calculateBtn');
            this.recalculateBtn = document.getElementById('recalculateBtn');
            this.resultsSection = document.getElementById('resultsSection');
            this.errorMessage = document.getElementById('errorMessage');
            this.errorText = document.getElementById('errorText');

            // Result Elements
            this.perPerson = document.getElementById('perPerson');
            this.tipAmount = document.getElementById('tipAmount');
            this.totalAmount = document.getElementById('totalAmount');
            this.billDisplay = document.getElementById('billDisplay');
            this.tipPercentage = document.getElementById('tipPercentage');
            this.peopleDisplay = document.getElementById('peopleDisplay');

            // State
            this.selectedTip = 15; // Default 15%

            this.init();
        }

        init() {
            this.bindEvents();
        }

        bindEvents() {
            // Tip percentage buttons
            this.tipBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    // Remove active class from all
                    this.tipBtns.forEach(b => b.classList.remove('active'));
                    // Add active to clicked
                    const target = e.currentTarget;
                    target.classList.add('active');

                    const tipValue = target.dataset.tip;
                    if (tipValue === 'custom') {
                        this.customTipGroup.style.display = 'block';
                        this.selectedTip = parseFloat(this.customTipInput.value) || 0;
                    } else {
                        this.customTipGroup.style.display = 'none';
                        this.selectedTip = parseFloat(tipValue);
                    }
                });
            });

            // Custom tip input
            if (this.customTipInput) {
                this.customTipInput.addEventListener('input', () => {
                    this.selectedTip = parseFloat(this.customTipInput.value) || 0;
                });
            }

            this.calculateBtn.addEventListener('click', () => this.calculate());

            if (this.recalculateBtn) {
                this.recalculateBtn.addEventListener('click', () => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    this.billAmountInput.focus();
                });
            }
        }

        calculate() {
        const _trackStartTime = Date.now();

            this.hideError();

            // Get values
            const billAmount = parseFloat(this.billAmountInput.value);
            const numPeople = parseInt(this.numPeopleInput.value) || 1;
            const tipPercent = this.selectedTip;

            // Validation
            if (isNaN(billAmount) || billAmount <= 0) {
                if(window.trackUsage) window.trackUsage('calculate_error', false, { calculator: 'tip.js' });
            this.showError('올바른 식사 금액을 입력해주세요.');
                return;
            }
            if (numPeople < 1) {
                this.showError('인원 수는 최소 1명이어야 합니다.');
                return;
            }
            if (tipPercent < 0 || tipPercent > 100) {
                this.showError('팁 비율은 0%에서 100% 사이여야 합니다.');
                return;
            }

            // Calculation
            const tipAmount = billAmount * (tipPercent / 100);
            const totalAmount = billAmount + tipAmount;
            const perPerson = totalAmount / numPeople;

            // Update UI
            if(window.trackUsage) window.trackUsage('calculate_success', true, { duration: Date.now() - _trackStartTime, calculator: 'tip.js' });
            this.displayResults({
                billAmount,
                tipPercent,
                numPeople,
                tipAmount,
                totalAmount,
                perPerson
            });
        }

        displayResults(data) {
            // Main Results
            this.perPerson.textContent = this.formatCurrency(data.perPerson);
            this.tipAmount.textContent = this.formatCurrency(data.tipAmount);
            this.totalAmount.textContent = this.formatCurrency(data.totalAmount);

            // Details
            this.billDisplay.textContent = this.formatCurrency(data.billAmount);
            this.tipPercentage.textContent = data.tipPercent + '%';
            this.peopleDisplay.textContent = data.numPeople + '명';

            // Show results
            this.resultsSection.style.display = 'block';

            // Scroll to results
            this.resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        formatCurrency(num) {
            return Math.round(num).toLocaleString('ko-KR') + '원';
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
        new TipCalculator();
    });
})();
