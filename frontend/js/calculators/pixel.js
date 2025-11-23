// Pixel Calculator (DPI/PPI/Resolution)
(function () {
    'use strict';

    const widthInput = document.getElementById('width');
    const heightInput = document.getElementById('height');
    const dpiInput = document.getElementById('dpi');
    const calculateBtn = document.getElementById('calculateBtn');
    const resultDiv = document.getElementById('result');
    const errorDiv = document.getElementById('error');

    if (calculateBtn) {
        calculateBtn.addEventListener('click', calculatePixel);
    }

    function calculatePixel() {
        hideError();
        const w = parseFloat(widthInput.value);
        const h = parseFloat(heightInput.value);
        const dpi = parseFloat(dpiInput.value);
        if (isNaN(w) || isNaN(h) || isNaN(dpi) || w <= 0 || h <= 0 || dpi <= 0) {
            showError('가로, 세로, DPI 값을 모두 양의 숫자로 입력해주세요.');
            return;
        }
        const ppi = Math.sqrt(w * w + h * h) / Math.sqrt((w / dpi) * (w / dpi) + (h / dpi) * (h / dpi));
        const pixelWidth = Math.round(w * dpi);
        const pixelHeight = Math.round(h * dpi);
        resultDiv.innerHTML = `<p><strong>Pixel Width:</strong> ${pixelWidth} px</p>` +
            `<p><strong>Pixel Height:</strong> ${pixelHeight} px</p>` +
            `<p><strong>PPI (Pixels per Inch):</strong> ${ppi.toFixed(2)}</p>`;
    }

    function showError(msg) {
        errorDiv.textContent = msg;
        errorDiv.style.display = 'block';
    }
    function hideError() {
        errorDiv.style.display = 'none';
    }
})();
