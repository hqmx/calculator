/**
 * Time Calculator
 *
 * Adds or subtracts time periods (hours, minutes, seconds) from a start time
 * Extends CalculatorBase for common functionality
 */

class TimeCalculator extends CalculatorBase {
    constructor() {
        super();
        this.currentOperation = 'add';
        this.init();
    }

    /**
     * Cache DOM elements specific to Time Calculator
     */
    cacheElements() {
        super.cacheElements();

        // Time input
        this.startTimeInput = document.getElementById('startTime');

        // Operation buttons
        this.operationBtns = document.querySelectorAll('.operation-btn');

        // Time period inputs
        this.hoursInput = document.getElementById('hours');
        this.minutesInput = document.getElementById('minutes');
        this.secondsInput = document.getElementById('seconds');

        // Result display
        this.resultTime = document.getElementById('resultTime');
        this.totalHoursResult = document.getElementById('totalHoursResult');
        this.totalMinutesResult = document.getElementById('totalMinutesResult');
    }

    /**
     * Bind event listeners
     */
    bindEvents() {
        super.bindEvents();

        // Operation selection
        this.operationBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setOperation(e.currentTarget.dataset.operation);
            });
        });

        // Add enter key support for inputs
        [this.hoursInput, this.minutesInput, this.secondsInput].forEach(input => {
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

        // Set current time as default
        this.setCurrentTime();
    }

    /**
     * Set start time to current time
     */
    setCurrentTime() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        if (this.startTimeInput) {
            this.startTimeInput.value = `${hours}:${minutes}`;
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

        // Get start time
        const startTime = this.startTimeInput.value;
        if (!this.validateRequired(startTime, 'Start time')) {
            return;
        }

        // Parse start time
        const timeMatch = startTime.match(/^(\d{1,2}):(\d{2})$/);
        if (!timeMatch) {
            this.showError('Please enter a valid time (HH:MM format)');
            return;
        }

        const startHours = parseInt(timeMatch[1]);
        const startMinutes = parseInt(timeMatch[2]);

        if (startHours < 0 || startHours > 23) {
            this.showError('Hours must be between 0 and 23');
            return;
        }

        if (startMinutes < 0 || startMinutes > 59) {
            this.showError('Minutes must be between 0 and 59');
            return;
        }

        // Get time periods
        const hours = parseInt(this.hoursInput.value) || 0;
        const minutes = parseInt(this.minutesInput.value) || 0;
        const seconds = parseInt(this.secondsInput.value) || 0;

        // Check if at least one time period is specified
        if (hours === 0 && minutes === 0 && seconds === 0) {
            this.showError('Please enter at least one time period');
            return;
        }

        // Calculate result time
        const result = this.calculateTime(
            startHours,
            startMinutes,
            0, // start seconds
            hours,
            minutes,
            seconds,
            this.currentOperation
        );

        // Display results
        this.displayResults(result);
    }

    /**
     * Calculate new time
     *
     * @param {number} startHours - Starting hours
     * @param {number} startMinutes - Starting minutes
     * @param {number} startSeconds - Starting seconds
     * @param {number} addHours - Hours to add/subtract
     * @param {number} addMinutes - Minutes to add/subtract
     * @param {number} addSeconds - Seconds to add/subtract
     * @param {string} operation - 'add' or 'subtract'
     * @returns {Object} - Calculated time data
     */
    calculateTime(startHours, startMinutes, startSeconds, addHours, addMinutes, addSeconds, operation) {
        const multiplier = operation === 'add' ? 1 : -1;

        // Convert everything to seconds for calculation
        let totalSeconds = (startHours * 3600) + (startMinutes * 60) + startSeconds;
        const addTotalSeconds = (addHours * 3600) + (addMinutes * 60) + addSeconds;

        totalSeconds += (addTotalSeconds * multiplier);

        // Handle negative time (wrap to previous day)
        while (totalSeconds < 0) {
            totalSeconds += 86400; // 24 hours in seconds
        }

        // Handle overflow (wrap to next day)
        totalSeconds = totalSeconds % 86400;

        // Convert back to hours, minutes, seconds
        const resultHours = Math.floor(totalSeconds / 3600);
        const resultMinutes = Math.floor((totalSeconds % 3600) / 60);
        const resultSeconds = totalSeconds % 60;

        // Calculate total hours and minutes for display
        const totalHours = totalSeconds / 3600;
        const totalMinutes = totalSeconds / 60;

        return {
            hours: resultHours,
            minutes: resultMinutes,
            seconds: resultSeconds,
            totalSeconds: totalSeconds,
            totalHours: totalHours,
            totalMinutes: totalMinutes
        };
    }

    /**
     * Display calculation results
     *
     * @param {Object} result - Calculation result
     */
    displayResults(result) {
        const { hours, minutes, seconds, totalHours, totalMinutes } = result;

        // Format time as HH:MM:SS
        const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

        // Update result time display
        if (this.resultTime) {
            this.resultTime.textContent = formattedTime;
        }

        // Update total hours (with 2 decimal places)
        if (this.totalHoursResult) {
            this.totalHoursResult.textContent = totalHours.toFixed(2);
        }

        // Update total minutes (rounded)
        if (this.totalMinutesResult) {
            this.totalMinutesResult.textContent = Math.round(totalMinutes);
        }

        // Show results section
        super.displayResults(result);
    }

    /**
     * Handle recalculate button click
     */
    handleRecalculate() {
        super.handleRecalculate();

        // Reset time period inputs
        if (this.hoursInput) this.hoursInput.value = '0';
        if (this.minutesInput) this.minutesInput.value = '0';
        if (this.secondsInput) this.secondsInput.value = '0';

        // Reset to add operation
        this.setOperation('add');

        // Reset to current time
        this.setCurrentTime();

        // Clear results
        if (this.resultTime) this.resultTime.textContent = '--:--:--';
        if (this.totalHoursResult) this.totalHoursResult.textContent = '0';
        if (this.totalMinutesResult) this.totalMinutesResult.textContent = '0';

        // Focus on start time input
        if (this.startTimeInput) {
            this.startTimeInput.focus();
        }
    }
}

// Initialize calculator when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    new TimeCalculator();
});
