// Aspect Ratio Calculator
(function () {
    'use strict';

    const widthInput = document.getElementById('width');
    const heightInput = document.getElementById('height');
    const calculateBtn = document.getElementById('calculateBtn');
    const resultDiv = document.getElementById('result');
    const errorDiv = document.getElementById('error');

    if (calculateBtn) {
        calculateBtn.addEventListener('click', calculateAspectRatio);
    }

    function calculateAspectRatio() {
        hideError();
        const w = parseFloat(widthInput.value);
        const h = parseFloat(heightInput.value);
        if (isNaN(w) || isNaN(h) || w <= 0 || h <= 0) {
            showError('Please enter valid positive numbers for width and height.');
            return;
        }
        const gcdVal = gcd(w, h);
        const ratio = `${w / gcdVal}:${h / gcdVal}`;
        const decimal = (w / h).toFixed(4);
        resultDiv.innerHTML = `<p><strong>Ratio:</strong> ${ratio}</p><p><strong>Decimal:</strong> ${decimal}</p>`;
    }

    function gcd(a, b) {
        while (b !== 0) {
            const t = b;
            b = a % b;
            a = t;
        }
        return a;
    }

    function showError(msg) {
        errorDiv.textContent = msg;
        errorDiv.style.display = 'block';
    }
    function hideError() {
        errorDiv.style.display = 'none';
    }
})();
