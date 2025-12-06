/**
 * Basic Calculator
 *
 * Standard calculator with basic arithmetic operations
 * Supports keyboard input and memory functions
 */

class BasicCalculator {
    constructor() {
        this.currentValue = '0';
        this.previousValue = null;
        this.operation = null;
        this.shouldResetDisplay = false;
        this.memory = 0;

        this.init();
    }

    /**
     * Initialize calculator
     */
    init() {
        this.cacheElements();
        this.bindEvents();
        this.updateDisplay();
    }

    /**
     * Cache DOM elements
     */
    cacheElements() {
        this.display = document.getElementById('display');
        this.expression = document.getElementById('expression');
        this.memoryIndicator = document.getElementById('memoryIndicator');

        // Get all buttons
        this.numberButtons = document.querySelectorAll('[data-number]');
        this.actionButtons = document.querySelectorAll('[data-action]');
    }

    /**
     * Bind event listeners
     */
    bindEvents() {
        // Number buttons
        this.numberButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.inputNumber(button.dataset.number);
            });
        });

        // Action buttons
        this.actionButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.handleAction(button.dataset.action);
            });
        });

        // Keyboard support
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }

    /**
     * Handle number input
     */
    inputNumber(num) {
        if (this.shouldResetDisplay) {
            this.currentValue = num;
            this.shouldResetDisplay = false;
        } else {
            // Limit to 15 digits
            if (this.currentValue.replace('.', '').length >= 15) return;

            this.currentValue = this.currentValue === '0' ? num : this.currentValue + num;
        }

        this.updateDisplay();
    }

    /**
     * Handle action buttons
     */
    handleAction(action) {
        switch (action) {
            case 'clear':
                this.clear();
                break;
            case 'backspace':
                this.backspace();
                break;
            case '.':
                this.inputDecimal();
                break;
            case '+':
            case '-':
            case '*':
            case '/':
                this.setOperation(action);
                break;
            case '=':
                this.calculate();
                break;
            case '%':
                this.percentage();
                break;
            case 'mc':
                this.memoryClear();
                break;
            case 'mr':
                this.memoryRecall();
                break;
            case 'm+':
                this.memoryAdd();
                break;
            case 'm-':
                this.memorySubtract();
                break;
        }
    }

    /**
     * Handle keyboard input
     */
    handleKeyboard(e) {
        // Prevent default for calculator keys
        if (/^[0-9+\-*/.=]$/.test(e.key) || ['Enter', 'Escape', 'Backspace'].includes(e.key)) {
            e.preventDefault();
        }

        // Numbers
        if (/^[0-9]$/.test(e.key)) {
            this.inputNumber(e.key);
        }

        // Operations
        else if (['+', '-', '*', '/'].includes(e.key)) {
            this.setOperation(e.key);
        }

        // Decimal
        else if (e.key === '.') {
            this.inputDecimal();
        }

        // Equals
        else if (e.key === '=' || e.key === 'Enter') {
            this.calculate();
        }

        // Clear
        else if (e.key === 'Escape') {
            this.clear();
        }

        // Backspace
        else if (e.key === 'Backspace') {
            this.backspace();
        }

        // Percentage
        else if (e.key === '%') {
            this.percentage();
        }
    }

    /**
     * Input decimal point
     */
    inputDecimal() {
        if (this.shouldResetDisplay) {
            this.currentValue = '0.';
            this.shouldResetDisplay = false;
        } else if (!this.currentValue.includes('.')) {
            this.currentValue += '.';
        }

        this.updateDisplay();
    }

    /**
     * Set operation
     */
    setOperation(op) {
        if (this.previousValue !== null && !this.shouldResetDisplay) {
            this.calculate();
        }

        this.operation = op;
        this.previousValue = parseFloat(this.currentValue);
        this.shouldResetDisplay = true;

        this.updateExpression();
    }

    /**
     * Calculate result
     */
    calculate() {
        const _trackStartTime = Date.now();

        if (this.operation === null || this.previousValue === null) {
            return;
        }

        const current = parseFloat(this.currentValue);
        let result;

        switch (this.operation) {
            case '+':
                result = this.previousValue + current;
                break;
            case '-':
                result = this.previousValue - current;
                break;
            case '*':
                result = this.previousValue * current;
                break;
            case '/':
                if (current === 0) {
                    if(window.trackUsage) window.trackUsage('calculate_error', false, { calculator: 'basic.js' });
            this.showError('Cannot divide by zero');
                    return;
                }
                result = this.previousValue / current;
                break;
        }

        this.currentValue = this.formatResult(result);
        this.operation = null;
        this.previousValue = null;
        this.shouldResetDisplay = true;

        this.updateDisplay();
        this.updateExpression();
    }

    /**
     * Calculate percentage
     */
    percentage() {
        const current = parseFloat(this.currentValue);

        if (this.previousValue !== null && this.operation) {
            // Calculate percentage of previous value
            let result;
            switch (this.operation) {
                case '+':
                case '-':
                    result = this.previousValue * (current / 100);
                    break;
                case '*':
                case '/':
                    result = current / 100;
                    break;
            }
            this.currentValue = this.formatResult(result);
        } else {
            // Convert to percentage
            this.currentValue = this.formatResult(current / 100);
        }

        this.updateDisplay();
    }

    /**
     * Clear all
     */
    clear() {
        this.currentValue = '0';
        this.previousValue = null;
        this.operation = null;
        this.shouldResetDisplay = false;

        this.updateDisplay();
        this.updateExpression();
    }

    /**
     * Backspace (delete last digit)
     */
    backspace() {
        if (this.shouldResetDisplay) return;

        this.currentValue = this.currentValue.length > 1
            ? this.currentValue.slice(0, -1)
            : '0';

        this.updateDisplay();
    }

    /**
     * Memory functions
     */
    memoryClear() {
        this.memory = 0;
        this.updateMemoryIndicator();
    }

    memoryRecall() {
        this.currentValue = this.formatResult(this.memory);
        this.shouldResetDisplay = true;
        this.updateDisplay();
    }

    memoryAdd() {
        this.memory += parseFloat(this.currentValue);
        this.shouldResetDisplay = true;
        this.updateMemoryIndicator();
    }

    memorySubtract() {
        this.memory -= parseFloat(this.currentValue);
        this.shouldResetDisplay = true;
        this.updateMemoryIndicator();
    }

    /**
     * Update display
     */
    updateDisplay() {
        if (this.display) {
            // Format with thousands separator
            const parts = this.currentValue.split('.');
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            this.display.textContent = parts.join('.');
        }
    }

    /**
     * Update expression display
     */
    updateExpression() {
        if (!this.expression) return;

        if (this.previousValue !== null && this.operation) {
            const opSymbol = {
                '+': '+',
                '-': '−',
                '*': '×',
                '/': '÷'
            }[this.operation];

            this.expression.textContent = `${this.formatNumber(this.previousValue)} ${opSymbol}`;
        } else {
            this.expression.textContent = '';
        }
    }

    /**
     * Update memory indicator
     */
    updateMemoryIndicator() {
        if (!this.memoryIndicator) return;

        if (this.memory !== 0) {
            this.memoryIndicator.style.display = 'inline-block';
        } else {
            this.memoryIndicator.style.display = 'none';
        }
    }

    /**
     * Format result
     */
    formatResult(num) {
        // Handle very small numbers
        if (Math.abs(num) < 0.0000001 && num !== 0) {
            return num.toExponential(6);
        }

        // Handle very large numbers
        if (Math.abs(num) > 999999999999) {
            return num.toExponential(6);
        }

        // Round to avoid floating point errors
        const rounded = Math.round(num * 1000000000000) / 1000000000000;

        // Remove trailing zeros
        return rounded.toString();
    }

    /**
     * Format number for display (with thousands separator)
     */
    formatNumber(num) {
        const parts = num.toString().split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return parts.join('.');
    }

    /**
     * Show error message
     */
    showError(message) {
        if (this.display) {
            this.display.textContent = 'Error';
        }

        setTimeout(() => {
            this.clear();
        }, 1500);

        console.error(message);
    }
}

// Initialize calculator when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    new BasicCalculator();
});
