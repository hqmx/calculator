/**
 * CalculatorBase Class
 *
 * Base class for all calculators with common functionality
 * Extend this class for individual calculator implementations
 *
 * @example
 * class BMICalculator extends CalculatorBase {
 *     constructor() {
 *         super();
 *     }
 *
 *     calculate() {
 *         // Custom calculation logic
 *     }
 * }
 */

class CalculatorBase {
    constructor() {
        // Will be called by child class
        this.errorTimeout = null;
    }

    /**
     * Initialize calculator
     * Override this method to add custom initialization
     */
    init() {
        this.cacheElements();
        this.bindEvents();
        this.setupInitialState();
    }

    /**
     * Cache DOM elements
     * Override to cache calculator-specific elements
     */
    cacheElements() {
        // Common elements
        this.errorMessage = document.getElementById('errorMessage');
        this.errorText = document.getElementById('errorText');
        this.calculateBtn = document.getElementById('calculateBtn');
        this.recalculateBtn = document.getElementById('recalculateBtn');
        this.resultsSection = document.getElementById('resultsSection');
    }

    /**
     * Bind event listeners
     * Override to add calculator-specific events
     */
    bindEvents() {
        // Calculate button
        if (this.calculateBtn) {
            this.calculateBtn.addEventListener('click', () => this.handleCalculate());
        }

        // Recalculate button
        if (this.recalculateBtn) {
            this.recalculateBtn.addEventListener('click', () => this.handleRecalculate());
        }
    }

    /**
     * Setup initial state
     * Override to set calculator-specific initial values
     */
    setupInitialState() {
        // Results section visibility controlled by HTML
        // Child classes can override this method for custom initial state
    }

    /**
     * Handle calculate button click
     * Override to implement custom calculation logic
     */
    handleCalculate() {
        this.clearError();
        // Child class should implement actual calculation
    }

    /**
     * Handle recalculate button click
     * Override to customize reset behavior
     */
    handleRecalculate() {
        // Keep results section visible, just reset values
        // Child classes can override for custom behavior
        this.clearError();
    }

    /**
     * Display calculation results
     * Override to customize result display
     *
     * @param {Object} results - Calculation results to display
     */
    displayResults(results) {
        if (this.resultsSection) {
            this.resultsSection.style.display = 'block';
            this.resultsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }

    // ========== Validation Helpers ==========

    /**
     * Validate number input
     *
     * @param {number} value - Value to validate
     * @param {number} min - Minimum allowed value
     * @param {number} max - Maximum allowed value
     * @param {string} fieldName - Name of field for error message
     * @returns {boolean} - True if valid
     */
    validateNumber(value, min, max, fieldName) {
        if (isNaN(value) || value === null || value === undefined) {
            this.showError(`Please enter a valid ${fieldName}`);
            return false;
        }

        if (value < min || value > max) {
            this.showError(`${fieldName} must be between ${min} and ${max}`);
            return false;
        }

        return true;
    }

    /**
     * Validate date input
     *
     * @param {string|Date} date - Date to validate
     * @param {string} fieldName - Name of field for error message
     * @returns {boolean} - True if valid
     */
    validateDate(date, fieldName = 'date') {
        const dateObj = date instanceof Date ? date : new Date(date);

        if (isNaN(dateObj.getTime())) {
            this.showError(`Please enter a valid ${fieldName}`);
            return false;
        }

        return true;
    }

    /**
     * Validate required field
     *
     * @param {*} value - Value to check
     * @param {string} fieldName - Name of field for error message
     * @returns {boolean} - True if not empty
     */
    validateRequired(value, fieldName) {
        if (!value || value === '') {
            this.showError(`${fieldName} is required`);
            return false;
        }
        return true;
    }

    // ========== Error Handling ==========

    /**
     * Show error message
     *
     * @param {string} message - Error message to display
     * @param {number} duration - Auto-hide duration in ms (default: 5000)
     */
    showError(message, duration = 5000) {
        if (this.errorText) {
            this.errorText.textContent = message;
        }

        if (this.errorMessage) {
            this.errorMessage.style.display = 'flex';
        }

        // Clear existing timeout
        if (this.errorTimeout) {
            clearTimeout(this.errorTimeout);
        }

        // Auto-hide after duration
        if (duration > 0) {
            this.errorTimeout = setTimeout(() => {
                this.clearError();
            }, duration);
        }
    }

    /**
     * Clear error message
     */
    clearError() {
        if (this.errorMessage) {
            this.errorMessage.style.display = 'none';
        }

        if (this.errorText) {
            this.errorText.textContent = '';
        }

        if (this.errorTimeout) {
            clearTimeout(this.errorTimeout);
            this.errorTimeout = null;
        }
    }

    // ========== Math Utilities ==========

    /**
     * Round number to specified decimal places
     *
     * @param {number} number - Number to round
     * @param {number} decimals - Number of decimal places
     * @returns {number} - Rounded number
     */
    roundToDecimal(number, decimals = 2) {
        const multiplier = Math.pow(10, decimals);
        return Math.round(number * multiplier) / multiplier;
    }

    /**
     * Format number as currency
     *
     * @param {number} number - Number to format
     * @param {string} locale - Locale string (default: 'en-US')
     * @param {string} currency - Currency code (default: 'USD')
     * @returns {string} - Formatted currency string
     */
    formatCurrency(number, locale = 'en-US', currency = 'USD') {
        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: currency
        }).format(number);
    }

    /**
     * Format number as percentage
     *
     * @param {number} number - Number to format (0.15 = 15%)
     * @param {number} decimals - Decimal places (default: 2)
     * @returns {string} - Formatted percentage string
     */
    formatPercentage(number, decimals = 2) {
        return (number * 100).toFixed(decimals) + '%';
    }

    /**
     * Format number with thousands separator
     *
     * @param {number} number - Number to format
     * @param {string} locale - Locale string (default: 'en-US')
     * @returns {string} - Formatted number string
     */
    formatNumber(number, locale = 'en-US') {
        return new Intl.NumberFormat(locale).format(number);
    }

    // ========== Date Utilities ==========

    /**
     * Calculate difference between two dates
     *
     * @param {Date} date1 - Start date
     * @param {Date} date2 - End date
     * @returns {Object} - {years, months, days, totalDays}
     */
    dateDifference(date1, date2) {
        const start = new Date(date1);
        const end = new Date(date2);

        let years = end.getFullYear() - start.getFullYear();
        let months = end.getMonth() - start.getMonth();
        let days = end.getDate() - start.getDate();

        // Adjust for negative days
        if (days < 0) {
            months--;
            const prevMonth = new Date(end.getFullYear(), end.getMonth(), 0);
            days += prevMonth.getDate();
        }

        // Adjust for negative months
        if (months < 0) {
            years--;
            months += 12;
        }

        // Calculate total days
        const totalDays = Math.floor((end - start) / (1000 * 60 * 60 * 24));

        return { years, months, days, totalDays };
    }

    /**
     * Add days to a date
     *
     * @param {Date} date - Start date
     * @param {number} days - Days to add (can be negative)
     * @returns {Date} - New date
     */
    addDays(date, days) {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    }

    /**
     * Format date for display
     *
     * @param {Date} date - Date to format
     * @param {string} locale - Locale string (default: 'en-US')
     * @returns {string} - Formatted date string
     */
    formatDate(date, locale = 'en-US') {
        return new Intl.DateTimeFormat(locale, {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(date);
    }

    // ========== UI Utilities ==========

    /**
     * Debounce function execution
     *
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in ms
     * @returns {Function} - Debounced function
     */
    debounce(func, wait = 300) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * Scroll element into view smoothly
     *
     * @param {HTMLElement} element - Element to scroll to
     * @param {string} block - Vertical alignment ('start', 'center', 'end', 'nearest')
     */
    scrollToElement(element, block = 'nearest') {
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block });
        }
    }

    /**
     * Toggle active class on buttons
     *
     * @param {NodeList} buttons - Button elements
     * @param {HTMLElement} activeButton - Button to activate
     */
    toggleButtonActive(buttons, activeButton) {
        buttons.forEach(btn => btn.classList.remove('active'));
        if (activeButton) {
            activeButton.classList.add('active');
        }
    }

    /**
     * Add enter key support to input
     *
     * @param {HTMLElement} input - Input element
     * @param {Function} callback - Function to call on enter
     */
    addEnterKeySupport(input, callback) {
        if (input) {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    callback();
                }
            });
        }
    }

    /**
     * Show loading state on button
     *
     * @param {HTMLElement} button - Button element
     * @param {boolean} loading - Loading state
     * @param {string} loadingText - Text to show while loading
     */
    setButtonLoading(button, loading, loadingText = 'Calculating...') {
        if (!button) return;

        if (loading) {
            button.disabled = true;
            button.dataset.originalText = button.textContent;
            button.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${loadingText}`;
        } else {
            button.disabled = false;
            button.textContent = button.dataset.originalText || 'Calculate';
        }
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CalculatorBase;
}
