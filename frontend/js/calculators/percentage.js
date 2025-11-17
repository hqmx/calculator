/**
 * Percentage Calculator - 6 Cards Version
 * Each card is independent with its own calculation logic
 */

document.addEventListener('DOMContentLoaded', function() {
    initializePercentageCalculators();
});

function initializePercentageCalculators() {
    // Get all calculate buttons
    const calcButtons = document.querySelectorAll('.calc-card-btn');

    // Add click event to each button
    calcButtons.forEach(button => {
        button.addEventListener('click', function() {
            const calcType = this.getAttribute('data-calc');
            performCalculation(calcType);
        });
    });

    // Add Enter key support for all inputs
    const allInputs = document.querySelectorAll('.calc-card-inputs input');
    allInputs.forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const card = this.closest('.percent-calc-card');
                const button = card.querySelector('.calc-card-btn');
                button.click();
            }
        });
    });
}

function performCalculation(calcType) {
    let result = null;

    switch(calcType) {
        case 'percentOf':
            result = calculatePercentOf();
            break;
        case 'isWhatPercent':
            result = calculateIsWhatPercent();
            break;
        case 'percentIncrease':
            result = calculatePercentIncrease();
            break;
        case 'percentDecrease':
            result = calculatePercentDecrease();
            break;
        case 'addPercent':
            result = calculateAddPercent();
            break;
        case 'subtractPercent':
            result = calculateSubtractPercent();
            break;
    }

    if (result !== null) {
        displayResult(calcType, result);
    }
}

// Calculate: What is X% of Y?
function calculatePercentOf() {
    const percent = parseFloat(document.getElementById('percentOf_percent').value);
    const number = parseFloat(document.getElementById('percentOf_number').value);

    if (isNaN(percent) || isNaN(number)) {
        showError('percentOf', 'Please enter valid numbers');
        return null;
    }

    const result = (percent / 100) * number;
    return {
        value: result,
        formatted: formatNumber(result, 2),
        text: `${percent}% of ${formatNumber(number, 2)} = ${formatNumber(result, 2)}`
    };
}

// Calculate: X is what % of Y?
function calculateIsWhatPercent() {
    const part = parseFloat(document.getElementById('isWhatPercent_part').value);
    const whole = parseFloat(document.getElementById('isWhatPercent_whole').value);

    if (isNaN(part) || isNaN(whole)) {
        showError('isWhatPercent', 'Please enter valid numbers');
        return null;
    }

    if (whole === 0) {
        showError('isWhatPercent', 'Whole number cannot be zero');
        return null;
    }

    const result = (part / whole) * 100;
    return {
        value: result,
        formatted: formatNumber(result, 2) + '%',
        text: `${formatNumber(part, 2)} is ${formatNumber(result, 2)}% of ${formatNumber(whole, 2)}`
    };
}

// Calculate: Percentage Increase
function calculatePercentIncrease() {
    const oldValue = parseFloat(document.getElementById('percentIncrease_old').value);
    const newValue = parseFloat(document.getElementById('percentIncrease_new').value);

    if (isNaN(oldValue) || isNaN(newValue)) {
        showError('percentIncrease', 'Please enter valid numbers');
        return null;
    }

    if (oldValue === 0) {
        showError('percentIncrease', 'Old value cannot be zero');
        return null;
    }

    const result = ((newValue - oldValue) / oldValue) * 100;
    return {
        value: result,
        formatted: formatNumber(result, 2) + '%',
        text: `${formatNumber(oldValue, 2)} → ${formatNumber(newValue, 2)} = ${formatNumber(result, 2)}% increase`
    };
}

// Calculate: Percentage Decrease
function calculatePercentDecrease() {
    const oldValue = parseFloat(document.getElementById('percentDecrease_old').value);
    const newValue = parseFloat(document.getElementById('percentDecrease_new').value);

    if (isNaN(oldValue) || isNaN(newValue)) {
        showError('percentDecrease', 'Please enter valid numbers');
        return null;
    }

    if (oldValue === 0) {
        showError('percentDecrease', 'Old value cannot be zero');
        return null;
    }

    const result = ((oldValue - newValue) / oldValue) * 100;
    return {
        value: result,
        formatted: formatNumber(result, 2) + '%',
        text: `${formatNumber(oldValue, 2)} → ${formatNumber(newValue, 2)} = ${formatNumber(result, 2)}% decrease`
    };
}

// Calculate: Add X% to Y
function calculateAddPercent() {
    const percent = parseFloat(document.getElementById('addPercent_percent').value);
    const number = parseFloat(document.getElementById('addPercent_number').value);

    if (isNaN(percent) || isNaN(number)) {
        showError('addPercent', 'Please enter valid numbers');
        return null;
    }

    const result = number + (number * percent / 100);
    return {
        value: result,
        formatted: formatNumber(result, 2),
        text: `${formatNumber(number, 2)} + ${percent}% = ${formatNumber(result, 2)}`
    };
}

// Calculate: Subtract X% from Y
function calculateSubtractPercent() {
    const percent = parseFloat(document.getElementById('subtractPercent_percent').value);
    const number = parseFloat(document.getElementById('subtractPercent_number').value);

    if (isNaN(percent) || isNaN(number)) {
        showError('subtractPercent', 'Please enter valid numbers');
        return null;
    }

    const result = number - (number * percent / 100);
    return {
        value: result,
        formatted: formatNumber(result, 2),
        text: `${formatNumber(number, 2)} - ${percent}% = ${formatNumber(result, 2)}`
    };
}

// Display result in the card
function displayResult(calcType, result) {
    const resultDiv = document.getElementById(`result_${calcType}`);
    const resultValue = resultDiv.querySelector('.result-value');

    // Animate the result
    resultValue.style.opacity = '0';
    setTimeout(() => {
        resultValue.textContent = result.formatted;
        resultValue.style.opacity = '1';

        // Add success animation
        resultDiv.style.background = 'rgba(16, 185, 129, 0.12)';
        setTimeout(() => {
            resultDiv.style.background = '';
        }, 500);
    }, 150);
}

// Show error message
function showError(calcType, message) {
    const resultDiv = document.getElementById(`result_${calcType}`);
    const resultValue = resultDiv.querySelector('.result-value');

    resultValue.textContent = message;
    resultValue.style.color = '#ef4444';

    setTimeout(() => {
        resultValue.textContent = '-';
        resultValue.style.color = '';
    }, 3000);
}

// Format number with thousands separator
function formatNumber(number, decimals = 2) {
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: decimals
    }).format(number);
}
