/**
 * Scientific Calculator
 * Advanced calculator with trigonometric, logarithmic, and exponential functions
 */

(function () {
    'use strict';

    class ScientificCalculator {
        constructor() {
            this.display = '';
            this.expression = '';
            this.angleMode = 'deg'; // 'deg' or 'rad'
            this.lastResult = null;
            this.init();
        }

        init() {
            this.cacheElements();
            this.bindEvents();
            this.updateDisplay();
        }

        cacheElements() {
            this.displayElement = document.getElementById('display');
            this.expressionElement = document.getElementById('expression');

            // Mode buttons
            this.degBtn = document.getElementById('degBtn');
            this.radBtn = document.getElementById('radBtn');

            // All calculator buttons
            this.buttons = document.querySelectorAll('.calc-btn');
        }

        bindEvents() {
            // Mode toggle
            this.degBtn.addEventListener('click', () => this.setAngleMode('deg'));
            this.radBtn.addEventListener('click', () => this.setAngleMode('rad'));

            // Calculator buttons
            this.buttons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const number = btn.dataset.number;
                    const action = btn.dataset.action;

                    if (number !== undefined) {
                        this.appendNumber(number);
                    } else if (action) {
                        this.handleAction(action);
                    }
                });
            });

            // Keyboard support
            document.addEventListener('keydown', (e) => this.handleKeyboard(e));
        }

        setAngleMode(mode) {
            this.angleMode = mode;

            // Update button states
            if (mode === 'deg') {
                this.degBtn.classList.add('active');
                this.radBtn.classList.remove('active');
            } else {
                this.radBtn.classList.add('active');
                this.degBtn.classList.remove('active');
            }
        }

        appendNumber(num) {
            this.display += num;
            this.updateDisplay();
        }

        handleAction(action) {
            switch (action) {
                case 'clear':
                    this.clear();
                    break;
                case 'backspace':
                    this.backspace();
                    break;
                case '=':
                    this.calculate();
                    break;
                case '.':
                    if (!this.display.includes('.')) {
                        this.display += '.';
                        this.updateDisplay();
                    }
                    break;
                case '+':
                case '-':
                case '*':
                case '/':
                case '^':
                    this.appendOperator(action);
                    break;
                case '(':
                case ')':
                    this.display += action;
                    this.updateDisplay();
                    break;
                // Functions
                case 'sin':
                case 'cos':
                case 'tan':
                case 'asin':
                case 'acos':
                case 'atan':
                case 'log':
                case 'ln':
                case 'sqrt':
                    this.appendFunction(action);
                    break;
                case '^2':
                    this.display += '^2';
                    this.updateDisplay();
                    break;
                case '^3':
                    this.display += '^3';
                    this.updateDisplay();
                    break;
                case 'pi':
                    this.display += 'π';
                    this.updateDisplay();
                    break;
                case 'e':
                    this.display += 'e';
                    this.updateDisplay();
                    break;
                case '!':
                    this.display += '!';
                    this.updateDisplay();
                    break;
                case 'abs':
                    this.display += 'abs(';
                    this.updateDisplay();
                    break;
            }
        }

        appendOperator(op) {
            const lastChar = this.display.slice(-1);
            // Don't add operator if display is empty or last char is already an operator
            if (this.display && !['+', '-', '*', '/', '^'].includes(lastChar)) {
                this.display += op;
                this.updateDisplay();
            }
        }

        appendFunction(func) {
            this.display += func + '(';
            this.updateDisplay();
        }

        clear() {
            this.display = '';
            this.expression = '';
            this.updateDisplay();
        }

        backspace() {
            this.display = this.display.slice(0, -1);
            this.updateDisplay();
        }

        calculate() {
            if (!this.display) return;

            try {
                // Store expression
                this.expression = this.display;

                // Parse and evaluate
                const result = this.evaluate(this.display);

                // Update display
                this.display = this.formatResult(result);
                this.lastResult = result;
                this.updateDisplay();
            } catch (error) {
                this.display = 'Error';
                this.updateDisplay();
                setTimeout(() => {
                    this.clear();
                }, 2000);
            }
        }

        evaluate(expr) {
            // Replace special characters
            expr = expr.replace(/π/g, Math.PI.toString());
            expr = expr.replace(/e(?![0-9])/g, Math.E.toString());

            // Handle factorial
            expr = expr.replace(/(\d+)!/g, (match, num) => {
                return this.factorial(parseInt(num)).toString();
            });

            // Handle power operator
            expr = expr.replace(/\^/g, '**');

            // Handle trigonometric functions
            expr = expr.replace(/sin\(([^)]+)\)/g, (match, angle) => {
                const val = this.evaluate(angle);
                return Math.sin(this.toRadians(val)).toString();
            });

            expr = expr.replace(/cos\(([^)]+)\)/g, (match, angle) => {
                const val = this.evaluate(angle);
                return Math.cos(this.toRadians(val)).toString();
            });

            expr = expr.replace(/tan\(([^)]+)\)/g, (match, angle) => {
                const val = this.evaluate(angle);
                return Math.tan(this.toRadians(val)).toString();
            });

            // Handle inverse trig functions
            expr = expr.replace(/asin\(([^)]+)\)/g, (match, val) => {
                const result = Math.asin(this.evaluate(val));
                return this.fromRadians(result).toString();
            });

            expr = expr.replace(/acos\(([^)]+)\)/g, (match, val) => {
                const result = Math.acos(this.evaluate(val));
                return this.fromRadians(result).toString();
            });

            expr = expr.replace(/atan\(([^)]+)\)/g, (match, val) => {
                const result = Math.atan(this.evaluate(val));
                return this.fromRadians(result).toString();
            });

            // Handle logarithms
            expr = expr.replace(/log\(([^)]+)\)/g, (match, val) => {
                return Math.log10(this.evaluate(val)).toString();
            });

            expr = expr.replace(/ln\(([^)]+)\)/g, (match, val) => {
                return Math.log(this.evaluate(val)).toString();
            });

            // Handle square root
            expr = expr.replace(/sqrt\(([^)]+)\)/g, (match, val) => {
                return Math.sqrt(this.evaluate(val)).toString();
            });

            // Handle absolute value
            expr = expr.replace(/abs\(([^)]+)\)/g, (match, val) => {
                return Math.abs(this.evaluate(val)).toString();
            });

            // Evaluate the expression
            // eslint-disable-next-line no-eval
            return eval(expr);
        }

        toRadians(degrees) {
            if (this.angleMode === 'deg') {
                return degrees * (Math.PI / 180);
            }
            return degrees;
        }

        fromRadians(radians) {
            if (this.angleMode === 'deg') {
                return radians * (180 / Math.PI);
            }
            return radians;
        }

        factorial(n) {
            if (n < 0) throw new Error('Negative factorial');
            if (n === 0 || n === 1) return 1;
            let result = 1;
            for (let i = 2; i <= n; i++) {
                result *= i;
            }
            return result;
        }

        formatResult(num) {
            // Handle very large or very small numbers
            if (Math.abs(num) > 1e10 || (Math.abs(num) < 1e-10 && num !== 0)) {
                return num.toExponential(6);
            }

            // Round to avoid floating point errors
            const rounded = Math.round(num * 1e10) / 1e10;

            // Format with appropriate decimal places
            if (Number.isInteger(rounded)) {
                return rounded.toString();
            }

            return rounded.toString();
        }

        updateDisplay() {
            this.displayElement.textContent = this.display || '0';
            this.expressionElement.textContent = this.expression || '';
        }

        handleKeyboard(e) {
            const key = e.key;

            // Numbers
            if (/^[0-9]$/.test(key)) {
                this.appendNumber(key);
                e.preventDefault();
            }

            // Operators
            if (key === '+' || key === '-' || key === '*' || key === '/') {
                this.appendOperator(key);
                e.preventDefault();
            }

            // Decimal point
            if (key === '.') {
                this.handleAction('.');
                e.preventDefault();
            }

            // Parentheses
            if (key === '(' || key === ')') {
                this.display += key;
                this.updateDisplay();
                e.preventDefault();
            }

            // Enter (calculate)
            if (key === 'Enter') {
                this.calculate();
                e.preventDefault();
            }

            // Escape (clear)
            if (key === 'Escape') {
                this.clear();
                e.preventDefault();
            }

            // Backspace
            if (key === 'Backspace') {
                this.backspace();
                e.preventDefault();
            }
        }
    }

    // Initialize calculator when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => new ScientificCalculator());
    } else {
        new ScientificCalculator();
    }
})();
