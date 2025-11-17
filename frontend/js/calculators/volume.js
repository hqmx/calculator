/**
 * Volume Converter
 *
 * Converts between volume units using UnitConverter utility
 */

class VolumeConverter {
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

        // Check for negative values
        if (value < 0) {
            this.toValue.value = 'Error: Volume cannot be negative';
            return;
        }

        try {
            // Use UnitConverter utility
            const result = UnitConverter.volume.convert(value, fromUnit, toUnit);

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
        // Handle very small numbers
        if (number < 0.0001 && number > 0) {
            return number.toExponential(4);
        }

        // Handle very large numbers
        if (number > 1000000000) {
            return number.toExponential(4);
        }

        // Determine decimal places based on magnitude
        let decimals;
        if (number < 0.01) {
            decimals = 6;
        } else if (number < 1) {
            decimals = 4;
        } else if (number < 100) {
            decimals = 2;
        } else if (number < 10000) {
            decimals = 1;
        } else {
            decimals = 0;
        }

        // Round to determined decimal places
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
    new VolumeConverter();
});
