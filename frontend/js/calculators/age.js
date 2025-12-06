/**
 * Age Calculator
 *
 * Calculates age from birth date with detailed breakdown
 * Extends CalculatorBase for common functionality
 */

class AgeCalculator extends CalculatorBase {
    constructor() {
        super();
        this.init();
    }

    /**
     * Cache DOM elements specific to Age Calculator
     */
    cacheElements() {
        super.cacheElements();

        // Input elements
        this.birthdateInput = document.getElementById('birthdate');

        // Result display elements
        this.yearsValue = document.getElementById('yearsValue');
        this.monthsValue = document.getElementById('monthsValue');
        this.daysValue = document.getElementById('daysValue');
        this.totalDaysValue = document.getElementById('totalDaysValue');
        this.totalHoursValue = document.getElementById('totalHoursValue');
        this.totalMinutesValue = document.getElementById('totalMinutesValue');
        this.nextBirthdayValue = document.getElementById('nextBirthdayValue');
        this.dayOfWeekValue = document.getElementById('dayOfWeekValue');
    }

    /**
     * Bind event listeners
     */
    bindEvents() {
        super.bindEvents();

        // Calculate on date change
        if (this.birthdateInput) {
            this.birthdateInput.addEventListener('change', () => this.handleCalculate());
        }

        // Add enter key support
        this.addEnterKeySupport(this.birthdateInput, () => this.handleCalculate());

        // Set max date to today
        if (this.birthdateInput) {
            const today = new Date().toISOString().split('T')[0];
            this.birthdateInput.max = today;
        }
    }

    /**
     * Handle calculate button click
     */
    handleCalculate() {
        this.clearError();

        // Get birthdate
        const birthdate = this.birthdateInput.value;

        // Validate birthdate
        if (!this.validateRequired(birthdate, 'Birth date')) {
            return;
        }

        const birthDateObj = new Date(birthdate);

        if (!this.validateDate(birthDateObj, 'Birth date')) {
            return;
        }

        // Check if birthdate is in the future
        const today = new Date();
        if (birthDateObj > today) {
            if(window.trackUsage) window.trackUsage('calculate_error', false, { calculator: 'age.js' });
            this.showError('Birth date cannot be in the future');
            return;
        }

        // Calculate age
        const ageData = this.calculateAge(birthDateObj);

        // Display results
        if(window.trackUsage) window.trackUsage('calculate_success', true, { duration: Date.now() - _trackStartTime, calculator: 'age.js' });
            this.displayResults(ageData);
    }

    /**
     * Calculate comprehensive age data
     *
     * @param {Date} birthDate - Birth date
     * @returns {Object} - Age data with various calculations
     */
    calculateAge(birthDate) {
        const today = new Date();

        // Calculate age breakdown (years, months, days)
        const ageBreakdown = this.dateDifference(birthDate, today);

        // Calculate total days
        const totalDays = ageBreakdown.totalDays;

        // Calculate total hours and minutes
        const totalHours = totalDays * 24;
        const totalMinutes = totalHours * 60;

        // Calculate next birthday
        const nextBirthday = this.calculateNextBirthday(birthDate);

        // Calculate day of week person was born
        const dayOfWeek = this.getDayOfWeek(birthDate);

        return {
            years: ageBreakdown.years,
            months: ageBreakdown.months,
            days: ageBreakdown.days,
            totalDays: totalDays,
            totalHours: totalHours,
            totalMinutes: totalMinutes,
            nextBirthday: nextBirthday,
            dayOfWeek: dayOfWeek
        };
    }

    /**
     * Calculate next birthday
     *
     * @param {Date} birthDate - Birth date
     * @returns {Object} - {date, daysUntil}
     */
    calculateNextBirthday(birthDate) {
        const today = new Date();
        const currentYear = today.getFullYear();

        // Create next birthday date with current year
        let nextBirthday = new Date(
            currentYear,
            birthDate.getMonth(),
            birthDate.getDate()
        );

        // If birthday has passed this year, use next year
        if (nextBirthday < today) {
            nextBirthday = new Date(
                currentYear + 1,
                birthDate.getMonth(),
                birthDate.getDate()
            );
        }

        // Calculate days until next birthday
        const daysUntil = Math.ceil((nextBirthday - today) / (1000 * 60 * 60 * 24));

        return {
            date: nextBirthday,
            daysUntil: daysUntil
        };
    }

    /**
     * Get day of week name
     *
     * @param {Date} date - Date object
     * @returns {string} - Day name (e.g., "Monday")
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
     * Display calculation results
     *
     * @param {Object} ageData - Age calculation data
     */
    displayResults(ageData) {
        // Update age breakdown
        if (this.yearsValue) {
            this.yearsValue.textContent = ageData.years;
        }

        if (this.monthsValue) {
            this.monthsValue.textContent = ageData.months;
        }

        if (this.daysValue) {
            this.daysValue.textContent = ageData.days;
        }

        // Update total counts
        if (this.totalDaysValue) {
            this.totalDaysValue.textContent = this.formatNumber(ageData.totalDays);
        }

        if (this.totalHoursValue) {
            this.totalHoursValue.textContent = this.formatNumber(ageData.totalHours);
        }

        if (this.totalMinutesValue) {
            this.totalMinutesValue.textContent = this.formatNumber(ageData.totalMinutes);
        }

        // Update next birthday
        if (this.nextBirthdayValue) {
            const nextBirthdayFormatted = this.formatDate(ageData.nextBirthday.date);
            this.nextBirthdayValue.textContent =
                `${nextBirthdayFormatted} (in ${ageData.nextBirthday.daysUntil} days)`;
        }

        // Update day of week born
        if (this.dayOfWeekValue) {
            this.dayOfWeekValue.textContent = ageData.dayOfWeek;
        }

        // Show results section
        super.displayResults(ageData);
    }

    /**
     * Handle recalculate button click
     */
    handleRecalculate() {
        const _trackStartTime = Date.now();

        super.handleRecalculate();

        // Reset birthdate input
        if (this.birthdateInput) {
            this.birthdateInput.value = '';
            this.birthdateInput.focus();
        }

        // Reset all result values to 0
        if (this.yearsValue) this.yearsValue.textContent = '0';
        if (this.monthsValue) this.monthsValue.textContent = '0';
        if (this.daysValue) this.daysValue.textContent = '0';
        if (this.totalDaysValue) this.totalDaysValue.textContent = '0';
        if (this.totalHoursValue) this.totalHoursValue.textContent = '0';
        if (this.totalMinutesValue) this.totalMinutesValue.textContent = '0';
        if (this.nextBirthdayValue) this.nextBirthdayValue.textContent = '-';
        if (this.dayOfWeekValue) this.dayOfWeekValue.textContent = '-';
    }
}

// Initialize calculator when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    new AgeCalculator();
});
