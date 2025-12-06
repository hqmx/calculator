/**
 * Work Hours Calculator
 *
 * Calculates total work hours, business days, and wages
 * Extends CalculatorBase for common functionality
 */

class WorkHoursCalculator extends CalculatorBase {
    constructor() {
        super();
        this.init();
    }

    /**
     * Cache DOM elements specific to Work Hours Calculator
     */
    cacheElements() {
        super.cacheElements();

        // Date inputs
        this.startDateInput = document.getElementById('startDate');
        this.endDateInput = document.getElementById('endDate');

        // Settings inputs
        this.hoursPerDayInput = document.getElementById('hoursPerDay');
        this.excludeWeekendsCheckbox = document.getElementById('excludeWeekends');
        this.hourlyRateInput = document.getElementById('hourlyRate');

        // Result display
        this.totalDaysResult = document.getElementById('totalDaysResult');
        this.businessDaysResult = document.getElementById('businessDaysResult');
        this.totalHoursResult = document.getElementById('totalHoursResult');
        this.totalWagesResult = document.getElementById('totalWagesResult');
        this.wagesSubLabel = document.getElementById('wagesSubLabel');
    }

    /**
     * Bind event listeners
     */
    bindEvents() {
        super.bindEvents();

        // Add enter key support for inputs
        [this.hoursPerDayInput, this.hourlyRateInput].forEach(input => {
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

        // Set today as default start date
        const today = new Date();
        const dateString = today.toISOString().split('T')[0];
        if (this.startDateInput) {
            this.startDateInput.value = dateString;
        }

        // Set end date to 1 week later
        const nextWeek = new Date(today);
        nextWeek.setDate(nextWeek.getDate() + 6);
        const nextWeekString = nextWeek.toISOString().split('T')[0];
        if (this.endDateInput) {
            this.endDateInput.value = nextWeekString;
        }
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

        // Get end date
        const endDate = this.endDateInput.value;
        if (!this.validateRequired(endDate, 'End date')) {
            return;
        }

        const endDateObj = new Date(endDate + 'T00:00:00');
        if (!this.validateDate(endDateObj, 'End date')) {
            return;
        }

        // Validate date order
        if (endDateObj < startDateObj) {
            if(window.trackUsage) window.trackUsage('calculate_error', false, { calculator: 'work-hours.js' });
            this.showError('End date must be after start date');
            return;
        }

        // Get hours per day
        const hoursPerDay = parseFloat(this.hoursPerDayInput.value);
        if (!this.validateNumber(hoursPerDay, 0, 24, 'Hours per day')) {
            return;
        }

        // Get settings
        const excludeWeekends = this.excludeWeekendsCheckbox ? this.excludeWeekendsCheckbox.checked : true;
        const hourlyRate = parseFloat(this.hourlyRateInput.value) || 0;

        // Calculate work hours
        const result = this.calculateWorkHours(
            startDateObj,
            endDateObj,
            hoursPerDay,
            excludeWeekends,
            hourlyRate
        );

        // Display results
        if(window.trackUsage) window.trackUsage('calculate_success', true, { duration: Date.now() - _trackStartTime, calculator: 'work-hours.js' });
            this.displayResults(result);
    }

    /**
     * Calculate work hours and wages
     *
     * @param {Date} startDate - Start date
     * @param {Date} endDate - End date
     * @param {number} hoursPerDay - Hours per working day
     * @param {boolean} excludeWeekends - Exclude Saturdays and Sundays
     * @param {number} hourlyRate - Hourly wage rate
     * @returns {Object} - Calculation results
     */
    calculateWorkHours(startDate, endDate, hoursPerDay, excludeWeekends, hourlyRate) {
        // Calculate total days (inclusive)
        const totalDays = this.calculateTotalDays(startDate, endDate);

        // Calculate business days
        const businessDays = excludeWeekends
            ? this.calculateBusinessDays(startDate, endDate)
            : totalDays;

        // Calculate total hours
        const totalHours = businessDays * hoursPerDay;

        // Calculate total wages
        const totalWages = totalHours * hourlyRate;

        return {
            totalDays: totalDays,
            businessDays: businessDays,
            totalHours: totalHours,
            totalWages: totalWages,
            hourlyRate: hourlyRate
        };
    }

    /**
     * Calculate total calendar days (inclusive)
     *
     * @param {Date} startDate - Start date
     * @param {Date} endDate - End date
     * @returns {number} - Total days
     */
    calculateTotalDays(startDate, endDate) {
        const oneDay = 24 * 60 * 60 * 1000; // milliseconds in a day
        const diffDays = Math.round((endDate - startDate) / oneDay);
        return diffDays + 1; // +1 to include both start and end dates
    }

    /**
     * Calculate business days (Monday to Friday only)
     *
     * @param {Date} startDate - Start date
     * @param {Date} endDate - End date
     * @returns {number} - Business days count
     */
    calculateBusinessDays(startDate, endDate) {
        let count = 0;
        const current = new Date(startDate);

        while (current <= endDate) {
            const dayOfWeek = current.getDay();
            // 0 = Sunday, 6 = Saturday
            if (dayOfWeek !== 0 && dayOfWeek !== 6) {
                count++;
            }
            current.setDate(current.getDate() + 1);
        }

        return count;
    }

    /**
     * Display calculation results
     *
     * @param {Object} result - Calculation results
     */
    displayResults(result) {
        const { totalDays, businessDays, totalHours, totalWages, hourlyRate } = result;

        // Update total days
        if (this.totalDaysResult) {
            this.totalDaysResult.textContent = this.formatNumber(totalDays);
        }

        // Update business days
        if (this.businessDaysResult) {
            this.businessDaysResult.textContent = this.formatNumber(businessDays);
        }

        // Update total hours
        if (this.totalHoursResult) {
            this.totalHoursResult.textContent = this.formatNumber(totalHours.toFixed(1));
        }

        // Update total wages
        if (this.totalWagesResult) {
            if (hourlyRate > 0) {
                this.totalWagesResult.textContent = `$${this.formatNumber(totalWages.toFixed(2))}`;
                if (this.wagesSubLabel) {
                    this.wagesSubLabel.textContent = `At $${hourlyRate.toFixed(2)}/hour`;
                }
            } else {
                this.totalWagesResult.textContent = 'N/A';
                if (this.wagesSubLabel) {
                    this.wagesSubLabel.textContent = 'Enter hourly rate';
                }
            }
        }

        // Show results section
        super.displayResults(result);
    }

    /**
     * Handle recalculate button click
     */
    handleRecalculate() {
        const _trackStartTime = Date.now();

        super.handleRecalculate();

        // Reset to default values
        this.setupInitialState();

        // Reset hours per day
        if (this.hoursPerDayInput) {
            this.hoursPerDayInput.value = '8';
        }

        // Reset exclude weekends checkbox
        if (this.excludeWeekendsCheckbox) {
            this.excludeWeekendsCheckbox.checked = true;
        }

        // Reset hourly rate
        if (this.hourlyRateInput) {
            this.hourlyRateInput.value = '';
        }

        // Clear results
        if (this.totalDaysResult) this.totalDaysResult.textContent = '0';
        if (this.businessDaysResult) this.businessDaysResult.textContent = '0';
        if (this.totalHoursResult) this.totalHoursResult.textContent = '0';
        if (this.totalWagesResult) this.totalWagesResult.textContent = '$0.00';
        if (this.wagesSubLabel) this.wagesSubLabel.textContent = 'Based on hourly rate';

        // Focus on start date input
        if (this.startDateInput) {
            this.startDateInput.focus();
        }
    }
}

// Initialize calculator when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    new WorkHoursCalculator();
});
