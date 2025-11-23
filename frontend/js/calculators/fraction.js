(function () {
    'use strict';

    /**
     * Fraction Calculator Logic
     * Supports: add, subtract, multiply, divide, simplify, toDecimal
     */
    class FractionCalculator {
        constructor() {
            this.init();
        }

        init() {
            this.bindEvents();
        }

        bindEvents() {
            // Bind all calculate buttons
            const calcButtons = document.querySelectorAll('.calc-card-btn');
            calcButtons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const calcType = e.currentTarget.dataset.calc;
                    this.calculate(calcType);
                });
            });
        }

        calculate(type) {
            let result;

            switch (type) {
                case 'add':
                    result = this.addFractions();
                    break;
                case 'subtract':
                    result = this.subtractFractions();
                    break;
                case 'multiply':
                    result = this.multiplyFractions();
                    break;
                case 'divide':
                    result = this.divideFractions();
                    break;
                case 'simplify':
                    result = this.simplifyFraction();
                    break;
                case 'toDecimal':
                    result = this.fractionToDecimal();
                    break;
            }

            this.displayResult(type, result);
        }

        addFractions() {
            const num1 = parseInt(document.getElementById('add_num1').value);
            const den1 = parseInt(document.getElementById('add_den1').value);
            const num2 = parseInt(document.getElementById('add_num2').value);
            const den2 = parseInt(document.getElementById('add_den2').value);

            if (isNaN(num1) || isNaN(den1) || isNaN(num2) || isNaN(den2) || den1 === 0 || den2 === 0) {
                return '입력값을 확인하세요';
            }

            // a/b + c/d = (a*d + b*c) / (b*d)
            const resultNum = num1 * den2 + num2 * den1;
            const resultDen = den1 * den2;

            return this.simplify(resultNum, resultDen);
        }

        subtractFractions() {
            const num1 = parseInt(document.getElementById('subtract_num1').value);
            const den1 = parseInt(document.getElementById('subtract_den1').value);
            const num2 = parseInt(document.getElementById('subtract_num2').value);
            const den2 = parseInt(document.getElementById('subtract_den2').value);

            if (isNaN(num1) || isNaN(den1) || isNaN(num2) || isNaN(den2) || den1 === 0 || den2 === 0) {
                return '입력값을 확인하세요';
            }

            // a/b - c/d = (a*d - b*c) / (b*d)
            const resultNum = num1 * den2 - num2 * den1;
            const resultDen = den1 * den2;

            return this.simplify(resultNum, resultDen);
        }

        multiplyFractions() {
            const num1 = parseInt(document.getElementById('multiply_num1').value);
            const den1 = parseInt(document.getElementById('multiply_den1').value);
            const num2 = parseInt(document.getElementById('multiply_num2').value);
            const den2 = parseInt(document.getElementById('multiply_den2').value);

            if (isNaN(num1) || isNaN(den1) || isNaN(num2) || isNaN(den2) || den1 === 0 || den2 === 0) {
                return '입력값을 확인하세요';
            }

            // a/b * c/d = (a*c) / (b*d)
            const resultNum = num1 * num2;
            const resultDen = den1 * den2;

            return this.simplify(resultNum, resultDen);
        }

        divideFractions() {
            const num1 = parseInt(document.getElementById('divide_num1').value);
            const den1 = parseInt(document.getElementById('divide_den1').value);
            const num2 = parseInt(document.getElementById('divide_num2').value);
            const den2 = parseInt(document.getElementById('divide_den2').value);

            if (isNaN(num1) || isNaN(den1) || isNaN(num2) || isNaN(den2) || den1 === 0 || den2 === 0 || num2 === 0) {
                return '입력값을 확인하세요 (0으로 나눌 수 없습니다)';
            }

            // a/b ÷ c/d = (a*d) / (b*c)
            const resultNum = num1 * den2;
            const resultDen = den1 * num2;

            return this.simplify(resultNum, resultDen);
        }

        simplifyFraction() {
            const num = parseInt(document.getElementById('simplify_num').value);
            const den = parseInt(document.getElementById('simplify_den').value);

            if (isNaN(num) || isNaN(den) || den === 0) {
                return '입력값을 확인하세요';
            }

            return this.simplify(num, den);
        }

        fractionToDecimal() {
            const num = parseInt(document.getElementById('toDecimal_num').value);
            const den = parseInt(document.getElementById('toDecimal_den').value);

            if (isNaN(num) || isNaN(den) || den === 0) {
                return '입력값을 확인하세요';
            }

            const decimal = num / den;
            return decimal.toFixed(6).replace(/\.?0+$/, ''); // Remove trailing zeros
        }

        simplify(numerator, denominator) {
            if (denominator === 0) return '분모는 0이 될 수 없습니다';

            const gcd = this.gcd(Math.abs(numerator), Math.abs(denominator));
            let simplifiedNum = numerator / gcd;
            let simplifiedDen = denominator / gcd;

            // Handle negative fractions
            if (simplifiedDen < 0) {
                simplifiedNum = -simplifiedNum;
                simplifiedDen = -simplifiedDen;
            }

            if (simplifiedDen === 1) {
                return `${simplifiedNum}`;
            }

            return `${simplifiedNum}/${simplifiedDen}`;
        }

        gcd(a, b) {
            // Greatest Common Divisor using Euclidean algorithm
            return b === 0 ? a : this.gcd(b, a % b);
        }

        displayResult(type, result) {
            const resultElement = document.getElementById(`result_${type}`);
            if (resultElement) {
                const valueElement = resultElement.querySelector('.result-value');
                if (valueElement) {
                    valueElement.textContent = result;
                }
            }
        }
    }

    // Initialize
    document.addEventListener('DOMContentLoaded', function () {
        new FractionCalculator();
    });
})();
