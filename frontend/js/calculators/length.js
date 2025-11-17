/**
 * Length Converter
 *
 * Converts between various length units using UnitConverter utility
 */

class LengthConverter {
    constructor() {
        this.init();
    }

    /**
     * Initialize converter
     */
    init() {
        this.cacheElements();
        this.bindEvents();
        this.convert(); // Initial conversion
    }

    /**
     * Cache DOM elements
     */
    cacheElements() {
        this.fromValue = document.getElementById('fromValue');
        this.fromUnit = document.getElementById('fromUnit');
        this.toValue = document.getElementById('toValue');
        this.toUnit = document.getElementById('toUnit');
        this.swapBtn = document.getElementById('swapBtn');
    }

    /**
     * Bind event listeners
     */
    bindEvents() {
        // Convert on input change
        this.fromValue.addEventListener('input', () => this.convert());

        // Convert on unit change
        this.fromUnit.addEventListener('change', () => this.convert());
        this.toUnit.addEventListener('change', () => this.convert());

        // Swap units
        if (this.swapBtn) {
            this.swapBtn.addEventListener('click', () => this.swap());
        }

        // Allow Enter key to focus swap button
        this.fromValue.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && this.swapBtn) {
                this.swapBtn.focus();
            }
        });
    }

    /**
     * Perform conversion
     */
    convert() {
        const value = parseFloat(this.fromValue.value);
        const fromUnit = this.fromUnit.value;
        const toUnit = this.toUnit.value;

        // Validate input
        if (isNaN(value) || value === null || value === undefined) {
            this.toValue.value = '';
            return;
        }

        try {
            // Use UnitConverter utility
            const result = UnitConverter.length.convert(value, fromUnit, toUnit);

            // Format result based on magnitude
            const formatted = this.formatResult(result);

            // Update display
            this.toValue.value = formatted;
        } catch (error) {
            console.error('Conversion error:', error);
            this.toValue.value = 'Error';
        }
    }

    /**
     * Swap from and to units
     */
    swap() {
        // Swap units
        const tempUnit = this.fromUnit.value;
        this.fromUnit.value = this.toUnit.value;
        this.toUnit.value = tempUnit;

        // Swap values
        const tempValue = this.fromValue.value;
        this.fromValue.value = this.toValue.value;

        // Perform conversion
        this.convert();

        // Focus on input
        this.fromValue.focus();
        this.fromValue.select();
    }

    /**
     * Format result based on magnitude
     *
     * @param {number} number - Number to format
     * @returns {string} - Formatted number
     */
    formatResult(number) {
        // Handle very small numbers (scientific notation)
        if (Math.abs(number) < 0.00001 && number !== 0) {
            return number.toExponential(6);
        }

        // Handle very large numbers
        if (Math.abs(number) > 1000000) {
            return number.toExponential(6);
        }

        // Determine appropriate decimal places
        let decimals;
        if (Math.abs(number) >= 100) {
            decimals = 2;
        } else if (Math.abs(number) >= 10) {
            decimals = 3;
        } else if (Math.abs(number) >= 1) {
            decimals = 4;
        } else {
            decimals = 6;
        }

        // Round and format
        const rounded = Math.round(number * Math.pow(10, decimals)) / Math.pow(10, decimals);

        // Format with thousands separator
        return this.formatWithCommas(rounded);
    }

    /**
     * Format number with thousands separator
     *
     * @param {number} number - Number to format
     * @returns {string} - Formatted number string
     */
    formatWithCommas(number) {
        // Convert to string and split on decimal point
        const parts = number.toString().split('.');

        // Add thousands separator to integer part
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');

        // Join back together
        return parts.join('.');
    }
}

// Initialize converter when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    new LengthConverter();
});
