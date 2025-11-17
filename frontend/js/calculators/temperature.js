/**
 * Temperature Converter
 *
 * Converts between Celsius, Fahrenheit, and Kelvin using UnitConverter utility
 */

class TemperatureConverter {
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

        // Check for absolute zero violation in Kelvin
        if (fromUnit === 'K' && value < 0) {
            this.toValue.value = 'Error: Kelvin cannot be negative';
            return;
        }

        try {
            // Use UnitConverter utility
            const result = UnitConverter.temperature.convert(value, fromUnit, toUnit);

            // Format result
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
     * Format result
     *
     * @param {number} number - Number to format
     * @returns {string} - Formatted number
     */
    formatResult(number) {
        // Temperature precision: 2 decimal places
        const rounded = Math.round(number * 100) / 100;

        // Format with thousands separator for very large/small numbers
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
    new TemperatureConverter();
});
