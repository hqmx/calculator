/**
 * Pregnancy Calculator
 * Calculates due date, current week, trimester, and important milestones
 */

(function () {
    'use strict';

    class PregnancyCalculator {
        constructor() {
            this.calculationMethod = 'lmp'; // 'lmp' or 'conception'
            this.init();
        }

        init() {
            this.cacheElements();
            this.bindEvents();
            this.setMaxDates();
        }

        cacheElements() {
            // Method selection
            this.methodButtons = document.querySelectorAll('[data-method]');
            this.calculationMethodInput = document.getElementById('calculationMethod');

            // Input groups
            this.lmpGroup = document.getElementById('lmpGroup');
            this.conceptionGroup = document.getElementById('conceptionGroup');

            // Inputs
            this.lmpDateInput = document.getElementById('lmpDate');
            this.conceptionDateInput = document.getElementById('conceptionDate');
            this.cycleLengthInput = document.getElementById('cycleLength');

            // Buttons
            this.calculateBtn = document.getElementById('calculateBtn');
            this.recalculateBtn = document.getElementById('recalculateBtn');

            // Results
            this.resultsSection = document.getElementById('resultsSection');
            this.errorMessage = document.getElementById('errorMessage');
            this.errorText = document.getElementById('errorText');

            // Result values
            this.dueDateValue = document.getElementById('dueDateValue');
            this.currentWeekValue = document.getElementById('currentWeekValue');
            this.daysRemainingValue = document.getElementById('daysRemainingValue');
            this.trimesterValue = document.getElementById('trimesterValue');
            this.conceptionDateValue = document.getElementById('conceptionDateValue');
            this.trimester1EndValue = document.getElementById('trimester1EndValue');
            this.trimester2EndValue = document.getElementById('trimester2EndValue');
            this.fullTermValue = document.getElementById('fullTermValue');
        }

        bindEvents() {
            // Method selection
            this.methodButtons.forEach(btn => {
                btn.addEventListener('click', () => this.handleMethodChange(btn));
            });

            // Calculate button
            this.calculateBtn.addEventListener('click', () => this.calculate());

            // Recalculate button
            if (this.recalculateBtn) {
                this.recalculateBtn.addEventListener('click', () => this.recalculate());
            }
        }

        setMaxDates() {
            const today = new Date().toISOString().split('T')[0];
            if (this.lmpDateInput) this.lmpDateInput.max = today;
            if (this.conceptionDateInput) this.conceptionDateInput.max = today;
        }

        handleMethodChange(btn) {
            const method = btn.dataset.method;
            this.calculationMethod = method;
            this.calculationMethodInput.value = method;

            // Update button states
            this.methodButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Show/hide input groups
            if (method === 'lmp') {
                this.lmpGroup.style.display = 'block';
                this.conceptionGroup.style.display = 'none';
            } else {
                this.lmpGroup.style.display = 'none';
                this.conceptionGroup.style.display = 'block';
            }

            this.hideError();
        }

        calculate() {
        const _trackStartTime = Date.now();

            this.hideError();

            let lmpDate;

            if (this.calculationMethod === 'lmp') {
                const lmpValue = this.lmpDateInput.value;
                if (!lmpValue) {
                    if(window.trackUsage) window.trackUsage('calculate_error', false, { calculator: 'pregnancy.js' });
            this.showError('마지막 생리 시작일을 입력해주세요.');
                    return;
                }
                lmpDate = new Date(lmpValue);
            } else {
                // Conception method
                const conceptionValue = this.conceptionDateInput.value;
                if (!conceptionValue) {
                    this.showError('수정/배란일을 입력해주세요.');
                    return;
                }
                const conceptionDate = new Date(conceptionValue);
                // Convert conception date to LMP (subtract 14 days)
                lmpDate = new Date(conceptionDate);
                lmpDate.setDate(lmpDate.getDate() - 14);
            }

            // Validate date is not in future
            const today = new Date();
            if (lmpDate > today) {
                this.showError('날짜는 미래일 수 없습니다.');
                return;
            }

            // Calculate results
            const results = this.calculatePregnancy(lmpDate);

            // Display results
            if(window.trackUsage) window.trackUsage('calculate_success', true, { duration: Date.now() - _trackStartTime, calculator: 'pregnancy.js' });
            this.displayResults(results);
        }

        calculatePregnancy(lmpDate) {
            const today = new Date();

            // Calculate due date (LMP + 280 days = 40 weeks)
            const dueDate = new Date(lmpDate);
            dueDate.setDate(dueDate.getDate() + 280);

            // Calculate conception date (LMP + 14 days)
            const conceptionDate = new Date(lmpDate);
            conceptionDate.setDate(conceptionDate.getDate() + 14);

            // Calculate current week and day
            const daysSinceLMP = Math.floor((today - lmpDate) / (1000 * 60 * 60 * 24));
            const weeks = Math.floor(daysSinceLMP / 7);
            const days = daysSinceLMP % 7;

            // Calculate days remaining
            const daysRemaining = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));

            // Determine trimester
            let trimester;
            if (weeks < 13) {
                trimester = '1분기 (First Trimester)';
            } else if (weeks < 27) {
                trimester = '2분기 (Second Trimester)';
            } else {
                trimester = '3분기 (Third Trimester)';
            }

            // Calculate important dates
            const trimester1End = new Date(lmpDate);
            trimester1End.setDate(trimester1End.getDate() + (13 * 7));

            const trimester2End = new Date(lmpDate);
            trimester2End.setDate(trimester2End.getDate() + (27 * 7));

            const fullTerm = new Date(lmpDate);
            fullTerm.setDate(fullTerm.getDate() + (37 * 7));

            return {
                dueDate,
                conceptionDate,
                currentWeek: weeks,
                currentDay: days,
                daysRemaining,
                trimester,
                trimester1End,
                trimester2End,
                fullTerm
            };
        }

        displayResults(results) {
            // Format dates
            const formatDate = (date) => {
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                return `${year}.${month}.${day}`;
            };

            // Due date
            this.dueDateValue.textContent = formatDate(results.dueDate);

            // Current week
            this.currentWeekValue.textContent = `${results.currentWeek}주 ${results.currentDay}일`;

            // Days remaining
            if (results.daysRemaining > 0) {
                this.daysRemainingValue.textContent = `${results.daysRemaining}일`;
            } else if (results.daysRemaining === 0) {
                this.daysRemainingValue.textContent = '오늘!';
            } else {
                this.daysRemainingValue.textContent = `${Math.abs(results.daysRemaining)}일 지남`;
            }

            // Trimester
            this.trimesterValue.textContent = results.trimester;

            // Conception date
            this.conceptionDateValue.textContent = formatDate(results.conceptionDate);

            // Important dates
            this.trimester1EndValue.textContent = formatDate(results.trimester1End);
            this.trimester2EndValue.textContent = formatDate(results.trimester2End);
            this.fullTermValue.textContent = formatDate(results.fullTerm);

            // Show results
            this.resultsSection.style.display = 'block';

            // Scroll to results
            setTimeout(() => {
                this.resultsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 100);
        }

        recalculate() {
            this.resultsSection.style.display = 'none';
            this.lmpDateInput.value = '';
            this.conceptionDateInput.value = '';
            this.cycleLengthInput.value = '28';
            this.hideError();

            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        showError(message) {
            this.errorText.textContent = message;
            this.errorMessage.style.display = 'flex';
        }

        hideError() {
            this.errorMessage.style.display = 'none';
        }
    }

    // Initialize calculator when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => new PregnancyCalculator());
    } else {
        new PregnancyCalculator();
    }
})();
