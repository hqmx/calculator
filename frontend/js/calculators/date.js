/**
 * Date Calculator
 *
 * Adds or subtracts time periods from dates
 * Extends CalculatorBase for common functionality
 */

class DateCalculator extends CalculatorBase {
    constructor() {
        super();
        this.currentOperation = 'add';
        this.init();
    }

    /**
     * Cache DOM elements specific to Date Calculator
     */
    cacheElements() {
        super.cacheElements();

        // Date inputs
        this.startDateInput = document.getElementById('startDate');
        this.useTodayBtn = document.getElementById('useTodayBtn');

        // Operation buttons
        this.operationBtns = document.querySelectorAll('.operation-btn');

        // Time period inputs
        this.yearsInput = document.getElementById('years');
        this.monthsInput = document.getElementById('months');
        this.weeksInput = document.getElementById('weeks');
        this.daysInput = document.getElementById('days');

        // Result display
        this.resultDate = document.getElementById('resultDate');
        this.resultDay = document.getElementById('resultDay');
        this.displayStartDate = document.getElementById('displayStartDate');
        this.displayOperation = document.getElementById('displayOperation');
        this.displayPeriod = document.getElementById('displayPeriod');
        this.displayResultDate = document.getElementById('displayResultDate');
    }

    /**
     * Bind event listeners
     */
    bindEvents() {
        super.bindEvents();

        // Use today button
        if (this.useTodayBtn) {
            this.useTodayBtn.addEventListener('click', () => this.setToday());
        }

        // Operation selection
        this.operationBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setOperation(e.currentTarget.dataset.operation);
            });
        });

        // Add enter key support for inputs
        [this.yearsInput, this.monthsInput, this.weeksInput, this.daysInput].forEach(input => {
            if (input) {
                this.addEnterKeySupport(input, () => this.handleCalculate());
            }
        });
    }

    /**
     * Setup initial state
     */
    setupInitialState() {
        super.setupInitialState();

        // Set today as default
        this.setToday();
    }

    /**
     * Set start date to today
     */
    setToday() {
        const today = new Date();
        const dateString = today.toISOString().split('T')[0];
        if (this.startDateInput) {
            this.startDateInput.value = dateString;
        }
    }

    /**
     * Set operation (add or subtract)
     */
    setOperation(operation) {
        this.currentOperation = operation;

        // Update button states
        this.operationBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.operation === operation) {
                btn.classList.add('active');
            }
        });
    }

    /**
     * Handle calculate button click
     */
    handleCalculate() {
        this.clearError();

        // Get start date
        const startDate = this.startDateInput.value;
        if (!this.validateRequired(startDate, 'Start date')) {
            return;
        }

        const startDateObj = new Date(startDate + 'T00:00:00');
        if (!this.validateDate(startDateObj, 'Start date')) {
            return;
        }

        // Get time periods
        const years = parseInt(this.yearsInput.value) || 0;
        const months = parseInt(this.monthsInput.value) || 0;
        const weeks = parseInt(this.weeksInput.value) || 0;
        const days = parseInt(this.daysInput.value) || 0;

        // Check if at least one time period is specified
        if (years === 0 && months === 0 && weeks === 0 && days === 0) {
            if(window.trackUsage) window.trackUsage('calculate_error', false, { calculator: 'date.js' });
            this.showError('Please enter at least one time period');
            return;
        }

        // Calculate result date
        const resultDate = this.calculateDate(
            startDateObj,
            years,
            months,
            weeks,
            days,
            this.currentOperation
        );

        // Display results
        if(window.trackUsage) window.trackUsage('calculate_success', true, { duration: Date.now() - _trackStartTime, calculator: 'date.js' });
            this.displayResults({
            startDate: startDateObj,
            resultDate: resultDate,
            years: years,
            months: months,
            weeks: weeks,
            days: days,
            operation: this.currentOperation
        });
    }

    /**
     * Calculate new date
     *
     * @param {Date} startDate - Starting date
     * @param {number} years - Years to add/subtract
     * @param {number} months - Months to add/subtract
     * @param {number} weeks - Weeks to add/subtract
     * @param {number} days - Days to add/subtract
     * @param {string} operation - 'add' or 'subtract'
     * @returns {Date} - Calculated date
     */
    calculateDate(startDate, years, months, weeks, days, operation) {
        const result = new Date(startDate);
        const multiplier = operation === 'add' ? 1 : -1;

        // Add/subtract years
        if (years !== 0) {
            result.setFullYear(result.getFullYear() + (years * multiplier));
        }

        // Add/subtract months
        if (months !== 0) {
            result.setMonth(result.getMonth() + (months * multiplier));
        }

        // Add/subtract weeks (convert to days)
        const totalDays = days + (weeks * 7);
        if (totalDays !== 0) {
            result.setDate(result.getDate() + (totalDays * multiplier));
        }

        return result;
    }

    /**
     * Display calculation results
     *
     * @param {Object} data - Calculation data
     */
    displayResults(data) {
        const { startDate, resultDate, years, months, weeks, days, operation } = data;

        // Format result date
        const resultDateFormatted = this.formatDate(resultDate);
        const dayOfWeek = this.getDayOfWeek(resultDate);

        // Update main result display
        if (this.resultDate) {
            this.resultDate.textContent = resultDateFormatted;
        }

        if (this.resultDay) {
            this.resultDay.textContent = dayOfWeek;
        }

        // Update detail displays
        if (this.displayStartDate) {
            this.displayStartDate.textContent = this.formatDate(startDate);
        }

        if (this.displayOperation) {
            this.displayOperation.textContent = operation === 'add' ? 'Add' : 'Subtract';
        }

        if (this.displayPeriod) {
            const periodParts = [];
            if (years > 0) periodParts.push(`${years} year${years > 1 ? 's' : ''}`);
            if (months > 0) periodParts.push(`${months} month${months > 1 ? 's' : ''}`);
            if (weeks > 0) periodParts.push(`${weeks} week${weeks > 1 ? 's' : ''}`);
            if (days > 0) periodParts.push(`${days} day${days > 1 ? 's' : ''}`);

            this.displayPeriod.textContent = periodParts.join(', ');
        }

        if (this.displayResultDate) {
            this.displayResultDate.textContent = `${resultDateFormatted} (${dayOfWeek})`;
        }

        // Show results section
        super.displayResults(data);
    }

    /**
     * Get day of week name
     *
     * @param {Date} date - Date object
     * @returns {string} - Day name
     */
    getDayOfWeek(date) {
        const days = [
            'Sunday',
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday'
        ];

        return days[date.getDay()];
    }

    /**
     * Handle recalculate button click
     */
    handleRecalculate() {
        const _trackStartTime = Date.now();

        super.handleRecalculate();

        // Reset time period inputs
        if (this.yearsInput) this.yearsInput.value = '0';
        if (this.monthsInput) this.monthsInput.value = '0';
        if (this.weeksInput) this.weeksInput.value = '0';
        if (this.daysInput) this.daysInput.value = '0';

        // Reset to add operation
        this.setOperation('add');

        // Reset to today
        this.setToday();

        // Clear results
        if (this.resultDate) this.resultDate.textContent = '-';
        if (this.resultDay) this.resultDay.textContent = '-';
        if (this.displayStartDate) this.displayStartDate.textContent = '-';
        if (this.displayOperation) this.displayOperation.textContent = '-';
        if (this.displayPeriod) this.displayPeriod.textContent = '-';
        if (this.displayResultDate) this.displayResultDate.textContent = '-';

        // Focus on start date input
        if (this.startDateInput) {
            this.startDateInput.focus();
        }
    }
}

// Initialize calculator when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    new DateCalculator();
});
