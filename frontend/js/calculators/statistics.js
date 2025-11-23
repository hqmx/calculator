// Statistics Calculator
(function () {
    'use strict';

    const numbersInput = document.getElementById('numbers');
    const calculateBtn = document.getElementById('calculateBtn');
    const resultDiv = document.getElementById('result');
    const errorDiv = document.getElementById('error');

    if (calculateBtn) {
        calculateBtn.addEventListener('click', calculateStats);
    }

    function calculateStats() {
        hideError();
        const raw = numbersInput.value.trim();
        if (!raw) {
            showError('숫자를 입력해주세요 (쉼표 혹은 공백 구분).');
            return;
        }
        const nums = raw.split(/[,\s]+/).map(v => parseFloat(v)).filter(v => !isNaN(v));
        if (nums.length === 0) {
            showError('유효한 숫자가 없습니다.');
            return;
        }
        const mean = nums.reduce((a, b) => a + b, 0) / nums.length;
        const sorted = [...nums].sort((a, b) => a - b);
        const median = (sorted.length % 2 === 0) ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2 : sorted[Math.floor(sorted.length / 2)];
        const variance = nums.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / nums.length;
        const stddev = Math.sqrt(variance);
        resultDiv.innerHTML = `<p><strong>Mean:</strong> ${mean.toFixed(4)}</p>` +
            `<p><strong>Median:</strong> ${median.toFixed(4)}</p>` +
            `<p><strong>Std Dev:</strong> ${stddev.toFixed(4)}</p>`;
    }

    function showError(msg) {
        errorDiv.textContent = msg;
        errorDiv.style.display = 'block';
    }
    function hideError() {
        errorDiv.style.display = 'none';
    }
})();
