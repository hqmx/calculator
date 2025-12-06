(function () {
    'use strict';

    /**
     * Salary Calculator Logic
     * Calculates net salary after taxes and insurance (Korean system)
     */
    class SalaryCalculator {
        constructor() {
            // DOM Elements
            this.annualSalaryInput = document.getElementById('annualSalary');
            this.nonTaxableInput = document.getElementById('nonTaxable');
            this.dependentsInput = document.getElementById('dependents');
            this.childrenInput = document.getElementById('children');
            this.calculateBtn = document.getElementById('calculateBtn');
            this.recalculateBtn = document.getElementById('recalculateBtn');
            this.resultsSection = document.getElementById('resultsSection');
            this.errorMessage = document.getElementById('errorMessage');
            this.errorText = document.getElementById('errorText');

            // Result Elements
            this.netSalary = document.getElementById('netSalary');
            this.grossSalary = document.getElementById('grossSalary');
            this.totalDeduction = document.getElementById('totalDeduction');
            this.incomeTax = document.getElementById('incomeTax');
            this.localTax = document.getElementById('localTax');
            this.insurance = document.getElementById('insurance');
            this.annualGross = document.getElementById('annualGross');
            this.annualDeduction = document.getElementById('annualDeduction');
            this.annualNet = document.getElementById('annualNet');
            this.netRatio = document.getElementById('netRatio');

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
                    this.annualSalaryInput.focus();
                });
            }
        }

        calculate() {
        const _trackStartTime = Date.now();

            this.hideError();

            // Get values
            const annualSalary = parseFloat(this.annualSalaryInput.value);
            const nonTaxable = parseFloat(this.nonTaxableInput.value) || 0;
            const dependents = parseInt(this.dependentsInput.value) || 1;
            const children = parseInt(this.childrenInput.value) || 0;

            // Validation
            if (isNaN(annualSalary) || annualSalary <= 0) {
                if(window.trackUsage) window.trackUsage('calculate_error', false, { calculator: 'salary.js' });
            this.showError('올바른 연봉을 입력해주세요.');
                return;
            }

            // Monthly calculations
            const monthlyGross = annualSalary / 12;
            const taxableIncome = monthlyGross - nonTaxable;

            // 4대보험 계산 (2024 기준 근사치)
            const nationalPension = Math.min(monthlyGross * 0.045, 243000); // 국민연금 4.5% (상한 243,000)
            const healthInsurance = monthlyGross * 0.03545; // 건강보험 3.545%
            const longTermCare = healthInsurance * 0.1281; // 장기요양 12.81%
            const employmentInsurance = monthlyGross * 0.009; // 고용보험 0.9%

            const totalInsurance = nationalPension + healthInsurance + longTermCare + employmentInsurance;

            // 소득세 계산 (간이세액표 근사 - 실제는 더 복잡함)
            // 간소화: 과세표준에 따른 누진세율 적용
            const annualTaxable = (taxableIncome - totalInsurance) * 12;
            let annualIncomeTax = 0;

            // 누진세율 적용 (2024 기준)
            if (annualTaxable <= 14000000) {
                annualIncomeTax = annualTaxable * 0.06;
            } else if (annualTaxable <= 50000000) {
                annualIncomeTax = 840000 + (annualTaxable - 14000000) * 0.15;
            } else if (annualTaxable <= 88000000) {
                annualIncomeTax = 6240000 + (annualTaxable - 50000000) * 0.24;
            } else if (annualTaxable <= 150000000) {
                annualIncomeTax = 15360000 + (annualTaxable - 88000000) * 0.35;
            } else {
                annualIncomeTax = 37060000 + (annualTaxable - 150000000) * 0.38;
            }

            // 인적공제 (간소화)
            const personalDeduction = dependents * 1500000; // 1인당 150만원
            const childDeduction = children * 150000; // 자녀 1인당 15만원 세액공제

            annualIncomeTax = Math.max(0, annualIncomeTax - personalDeduction - childDeduction);

            const monthlyIncomeTax = annualIncomeTax / 12;
            const monthlyLocalTax = monthlyIncomeTax * 0.1; // 지방소득세 10%

            // 총 공제액
            const monthlyTotalDeduction = monthlyIncomeTax + monthlyLocalTax + totalInsurance;
            const monthlyNetSalary = monthlyGross - monthlyTotalDeduction;

            // Annual calculations
            const annualTotalDeduction = monthlyTotalDeduction * 12;
            const annualNetSalary = monthlyNetSalary * 12;
            const netRatio = (annualNetSalary / annualSalary) * 100;

            // Update UI
            if(window.trackUsage) window.trackUsage('calculate_success', true, { duration: Date.now() - _trackStartTime, calculator: 'salary.js' });
            this.displayResults({
                monthlyGross,
                monthlyNetSalary,
                monthlyTotalDeduction,
                monthlyIncomeTax,
                monthlyLocalTax,
                totalInsurance,
                annualSalary,
                annualTotalDeduction,
                annualNetSalary,
                netRatio
            });
        }

        displayResults(data) {
            // Main Results
            this.netSalary.textContent = this.formatCurrency(data.monthlyNetSalary);
            this.grossSalary.textContent = this.formatCurrency(data.monthlyGross);
            this.totalDeduction.textContent = this.formatCurrency(data.monthlyTotalDeduction);

            // Tax Breakdown
            this.incomeTax.textContent = this.formatCurrency(data.monthlyIncomeTax);
            this.localTax.textContent = this.formatCurrency(data.monthlyLocalTax);
            this.insurance.textContent = this.formatCurrency(data.totalInsurance);

            // Annual Summary
            this.annualGross.textContent = this.formatCurrency(data.annualSalary);
            this.annualDeduction.textContent = this.formatCurrency(data.annualTotalDeduction);
            this.annualNet.textContent = this.formatCurrency(data.annualNetSalary);
            this.netRatio.textContent = data.netRatio.toFixed(1) + '%';

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
        new SalaryCalculator();
    });
})();
