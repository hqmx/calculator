(function () {
    'use strict';

    /**
     * Mortgage Calculator Logic
     * Supports: Equal Principal & Interest (원리금균등), Equal Principal (원금균등)
     */
    class MortgageCalculator {
        constructor() {
            // DOM Elements
            this.loanAmountInput = document.getElementById('loanAmount');
            this.interestRateInput = document.getElementById('interestRate');
            this.loanTermInput = document.getElementById('loanTerm');
            this.repaymentTypeBtns = document.querySelectorAll('.gender-btn'); // Using existing class for toggle
            this.calculateBtn = document.getElementById('calculateBtn');
            this.recalculateBtn = document.getElementById('recalculateBtn');
            this.resultsSection = document.getElementById('resultsSection');
            this.errorMessage = document.getElementById('errorMessage');
            this.errorText = document.getElementById('errorText');

            // Result Elements
            this.repaymentTypeDisplay = document.getElementById('repaymentTypeDisplay');
            this.loanAmountDisplay = document.getElementById('loanAmountDisplay');
            this.loanTermDisplay = document.getElementById('loanTermDisplay');
            this.interestRateDisplay = document.getElementById('interestRateDisplay');

            this.monthlyPaymentLabel = document.getElementById('monthlyPaymentLabel');
            this.monthlyPayment = document.getElementById('monthlyPayment');
            this.totalInterest = document.getElementById('totalInterest');
            this.totalPayment = document.getElementById('totalPayment');

            this.firstMonthPaymentRow = document.getElementById('firstMonthPaymentRow');
            this.lastMonthPaymentRow = document.getElementById('lastMonthPaymentRow');
            this.firstMonthPayment = document.getElementById('firstMonthPayment');
            this.lastMonthPayment = document.getElementById('lastMonthPayment');

            this.recommendationsList = document.getElementById('recommendationsList');

            // State
            this.repaymentType = 'equal-payment'; // 'equal-payment' (원리금균등) or 'equal-principal' (원금균등)

            this.init();
        }

        init() {
            this.bindEvents();
        }

        bindEvents() {
            // Repayment Type Toggle
            this.repaymentTypeBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    // Remove active class from all
                    this.repaymentTypeBtns.forEach(b => b.classList.remove('active'));
                    // Add active to clicked
                    const target = e.currentTarget;
                    target.classList.add('active');
                    this.repaymentType = target.dataset.type;
                });
            });

            this.calculateBtn.addEventListener('click', () => this.calculate());

            if (this.recalculateBtn) {
                this.recalculateBtn.addEventListener('click', () => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    this.loanAmountInput.focus();
                });
            }
        }

        calculate() {
        const _trackStartTime = Date.now();

            this.hideError();

            // Get values
            const loanAmount = parseFloat(this.loanAmountInput.value);
            const interestRate = parseFloat(this.interestRateInput.value);
            const loanTerm = parseFloat(this.loanTermInput.value);

            // Validation
            if (isNaN(loanAmount) || loanAmount <= 0) {
                if(window.trackUsage) window.trackUsage('calculate_error', false, { calculator: 'mortgage.js' });
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

            // Calculation
            const monthlyRate = interestRate / 100 / 12;
            const totalMonths = loanTerm * 12;

            let monthlyPayment = 0;
            let totalInterest = 0;
            let totalPayment = 0;
            let firstMonth = 0;
            let lastMonth = 0;

            if (this.repaymentType === 'equal-payment') {
                // 원리금균등상환
                // PMT = P * [r(1+r)^n] / [(1+r)^n - 1]
                const commonFactor = Math.pow(1 + monthlyRate, totalMonths);
                monthlyPayment = loanAmount * (monthlyRate * commonFactor) / (commonFactor - 1);

                totalPayment = monthlyPayment * totalMonths;
                totalInterest = totalPayment - loanAmount;

                // Display setup
                this.firstMonthPaymentRow.style.display = 'none';
                this.lastMonthPaymentRow.style.display = 'none';
                this.monthlyPaymentLabel.textContent = '월 상환액 (고정)';

            } else {
                // 원금균등상환
                // 매월 원금 = P / n
                // 매월 이자 = (P - 기상환원금) * r
                const monthlyPrincipal = loanAmount / totalMonths;

                // Calculate total interest by summing up monthly interests
                let currentBalance = loanAmount;
                let currentInterest = 0;

                for (let i = 0; i < totalMonths; i++) {
                    currentInterest = currentBalance * monthlyRate;
                    totalInterest += currentInterest;

                    if (i === 0) {
                        firstMonth = monthlyPrincipal + currentInterest;
                    }
                    if (i === totalMonths - 1) {
                        lastMonth = monthlyPrincipal + currentInterest;
                    }

                    currentBalance -= monthlyPrincipal;
                }

                totalPayment = loanAmount + totalInterest;

                // Display setup
                this.firstMonthPaymentRow.style.display = 'flex';
                this.lastMonthPaymentRow.style.display = 'flex';
                this.monthlyPaymentLabel.textContent = '첫 달 상환액 (매월 감소)';
                monthlyPayment = firstMonth; // Show first month as main number
            }

            // Update UI
            if(window.trackUsage) window.trackUsage('calculate_success', true, { duration: Date.now() - _trackStartTime, calculator: 'mortgage.js' });
            this.displayResults({
                loanAmount,
                loanTerm,
                interestRate,
                monthlyPayment,
                totalInterest,
                totalPayment,
                firstMonth,
                lastMonth
            });
        }

        displayResults(data) {
            // Summary
            this.repaymentTypeDisplay.textContent = this.repaymentType === 'equal-payment' ? '원리금균등상환' : '원금균등상환';
            this.loanAmountDisplay.textContent = this.formatCurrency(data.loanAmount);
            this.loanTermDisplay.textContent = `${data.loanTerm}년 (${data.loanTerm * 12}개월)`;
            this.interestRateDisplay.textContent = `${data.interestRate}%`;

            // Main Result
            this.monthlyPayment.textContent = this.formatCurrency(data.monthlyPayment);

            // Details
            this.totalInterest.textContent = this.formatCurrency(data.totalInterest);
            this.totalPayment.textContent = this.formatCurrency(data.totalPayment);

            if (this.repaymentType === 'equal-principal') {
                this.firstMonthPayment.textContent = this.formatCurrency(data.firstMonth);
                this.lastMonthPayment.textContent = this.formatCurrency(data.lastMonth);
            }

            // Recommendations / Characteristics
            this.updateRecommendations();

            // Show results
            this.resultsSection.style.display = 'block';

            // Scroll to results
            this.resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        updateRecommendations() {
            this.recommendationsList.innerHTML = '';

            const items = this.repaymentType === 'equal-payment'
                ? [
                    '매월 상환하는 금액(원금+이자)이 동일합니다.',
                    '초기에는 이자 비중이 높고, 후반으로 갈수록 원금 비중이 높아집니다.',
                    '매월 지출이 일정하여 자금 계획을 세우기 좋습니다.'
                ]
                : [
                    '매월 상환하는 원금이 동일하고, 이자는 줄어듭니다.',
                    '전체 대출 기간 동안 내는 총 이자가 원리금균등상환보다 적습니다.',
                    '초기 상환 부담이 크지만, 시간이 지날수록 부담이 줄어듭니다.'
                ];

            items.forEach(text => {
                const li = document.createElement('li');
                li.textContent = text;
                this.recommendationsList.appendChild(li);
            });
        }

        formatCurrency(num) {
            // Korean currency formatting (e.g., 1,000,000원)
            // If number is large, maybe use 만/억 unit? For now, standard locale string
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
        new MortgageCalculator();
    });
})();
