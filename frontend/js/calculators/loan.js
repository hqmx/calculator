(function () {
    'use strict';

    /**
     * Loan Calculator Logic
     * Calculates monthly payment, total interest, and total payment for loans
     */
    class LoanCalculator {
        constructor() {
            // DOM Elements
            this.loanAmountInput = document.getElementById('loanAmount');
            this.interestRateInput = document.getElementById('interestRate');
            this.loanTermInput = document.getElementById('loanTerm');
            this.calculateBtn = document.getElementById('calculateBtn');
            this.recalculateBtn = document.getElementById('recalculateBtn');
            this.resultsSection = document.getElementById('resultsSection');
            this.errorMessage = document.getElementById('errorMessage');
            this.errorText = document.getElementById('errorText');

            // Result Elements
            this.loanAmountDisplay = document.getElementById('loanAmountDisplay');
            this.loanTermDisplay = document.getElementById('loanTermDisplay');
            this.interestRateDisplay = document.getElementById('interestRateDisplay');
            this.monthlyPayment = document.getElementById('monthlyPayment');
            this.totalInterest = document.getElementById('totalInterest');
            this.totalPayment = document.getElementById('totalPayment');

            this.init();
        }

        init() {
            this.bindEvents();
        }

        bindEvents() {
            this.calculateBtn.addEventListener('click', () => this.calculate());

            if (this.recalculateBtn) {
                this.recalculateBtn.addEventListener('click', () => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    this.loanAmountInput.focus();
                });
            }
        }

        calculate() {
            this.hideError();

            // Get values
            const loanAmount = parseFloat(this.loanAmountInput.value);
            const interestRate = parseFloat(this.interestRateInput.value);
            const loanTerm = parseFloat(this.loanTermInput.value);

            // Validation
            if (isNaN(loanAmount) || loanAmount <= 0) {
                this.showError('올바른 대출 금액을 입력해주세요.');
                return;
            }
            if (isNaN(interestRate) || interestRate <= 0) {
                this.showError('올바른 이자율을 입력해주세요.');
                return;
            }
            if (isNaN(loanTerm) || loanTerm <= 0) {
                this.showError('올바른 대출 기간을 입력해주세요.');
                return;
            }

            // Calculation (Equal Payment Method - 원리금균등상환)
            const monthlyRate = interestRate / 100 / 12;
            const totalMonths = loanTerm * 12;

            // PMT = P * [r(1+r)^n] / [(1+r)^n - 1]
            const commonFactor = Math.pow(1 + monthlyRate, totalMonths);
            const monthlyPayment = loanAmount * (monthlyRate * commonFactor) / (commonFactor - 1);

            const totalPayment = monthlyPayment * totalMonths;
            const totalInterest = totalPayment - loanAmount;

            // Update UI
            this.displayResults({
                loanAmount,
                loanTerm,
                interestRate,
                monthlyPayment,
                totalInterest,
                totalPayment
            });
        }

        displayResults(data) {
            // Summary
            this.loanAmountDisplay.textContent = this.formatCurrency(data.loanAmount);
            this.loanTermDisplay.textContent = `${data.loanTerm}년 (${data.loanTerm * 12}개월)`;
            this.interestRateDisplay.textContent = `${data.interestRate}%`;

            // Main Result
            this.monthlyPayment.textContent = this.formatCurrency(data.monthlyPayment);

            // Details
            this.totalInterest.textContent = this.formatCurrency(data.totalInterest);
            this.totalPayment.textContent = this.formatCurrency(data.totalPayment);

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
        new LoanCalculator();
    });
})();
