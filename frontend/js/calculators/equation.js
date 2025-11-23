// Equation Solver Calculator
(function() {
    'use strict';

    // DOM Elements
    const equationTypeSelect = document.getElementById('equationType');
    const linearInputs = document.getElementById('linearInputs');
    const quadraticInputs = document.getElementById('quadraticInputs');
    const solveBtn = document.getElementById('solveBtn');
    const resultsSection = document.getElementById('resultsSection');
    const solutionText = document.getElementById('solutionText');
    const solutionSteps = document.getElementById('solutionSteps');
    const solveAgainBtn = document.getElementById('solveAgainBtn');
    const errorMessage = document.getElementById('errorMessage');
    const errorText = document.getElementById('errorText');

    // Event Listeners
    if (equationTypeSelect) {
        equationTypeSelect.addEventListener('change', handleEquationTypeChange);
    }

    if (solveBtn) {
        solveBtn.addEventListener('click', solveEquation);
    }

    if (solveAgainBtn) {
        solveAgainBtn.addEventListener('click', resetCalculator);
    }

    // Handle equation type change
    function handleEquationTypeChange() {
        const type = equationTypeSelect.value;
        
        if (type === 'linear') {
            linearInputs.style.display = 'grid';
            quadraticInputs.style.display = 'none';
        } else {
            linearInputs.style.display = 'none';
            quadraticInputs.style.display = 'grid';
        }
        
        hideError();
        hideResults();
    }

    // Solve equation
    function solveEquation() {
        hideError();
        
        const type = equationTypeSelect.value;
        
        try {
            if (type === 'linear') {
                solveLinearEquation();
            } else {
                solveQuadraticEquation();
            }
        } catch (error) {
            showError(error.message);
        }
    }

    // Solve linear equation: ax + b = 0
    function solveLinearEquation() {
        const a = parseFloat(document.getElementById('linearA').value);
        const b = parseFloat(document.getElementById('linearB').value);

        // Validation
        if (isNaN(a) || isNaN(b)) {
            throw new Error('Please enter valid numbers for a and b');
        }

        if (a === 0) {
            if (b === 0) {
                throw new Error('Infinite solutions (0 = 0)');
            } else {
                throw new Error('No solution (contradiction)');
            }
        }

        // Calculate solution
        const x = -b / a;

        // Display results
        const equation = `${a}x + ${b} = 0`;
        const solution = `x = ${x.toFixed(4)}`;
        
        const steps = [
            `Original equation: ${equation}`,
            `Subtract ${b} from both sides: ${a}x = ${-b}`,
            `Divide by ${a}: x = ${(-b / a).toFixed(4)}`
        ];

        displayResults(equation, solution, steps);
    }

    // Solve quadratic equation: ax² + bx + c = 0
    function solveQuadraticEquation() {
        const a = parseFloat(document.getElementById('quadraticA').value);
        const b = parseFloat(document.getElementById('quadraticB').value);
        const c = parseFloat(document.getElementById('quadraticC').value);

        // Validation
        if (isNaN(a) || isNaN(b) || isNaN(c)) {
            throw new Error('Please enter valid numbers for a, b, and c');
        }

        if (a === 0) {
            throw new Error('Coefficient a cannot be 0 for quadratic equation');
        }

        // Calculate discriminant
        const discriminant = b * b - 4 * a * c;

        let solution = '';
        let steps = [
            `Original equation: ${a}x² + ${b}x + ${c} = 0`,
            `Calculate discriminant: Δ = b² - 4ac = ${b}² - 4(${a})(${c}) = ${discriminant.toFixed(4)}`
        ];

        if (discriminant > 0) {
            // Two real solutions
            const x1 = (-b + Math.sqrt(discriminant)) / (2 * a);
            const x2 = (-b - Math.sqrt(discriminant)) / (2 * a);
            
            solution = `x₁ = ${x1.toFixed(4)}, x₂ = ${x2.toFixed(4)}`;
            steps.push(`Discriminant > 0: Two real solutions`);
            steps.push(`x₁ = (-b + √Δ) / 2a = ${x1.toFixed(4)}`);
            steps.push(`x₂ = (-b - √Δ) / 2a = ${x2.toFixed(4)}`);
        } else if (discriminant === 0) {
            // One real solution
            const x = -b / (2 * a);
            
            solution = `x = ${x.toFixed(4)} (double root)`;
            steps.push(`Discriminant = 0: One real solution (double root)`);
            steps.push(`x = -b / 2a = ${x.toFixed(4)}`);
        } else {
            // Complex solutions
            const realPart = -b / (2 * a);
            const imagPart = Math.sqrt(-discriminant) / (2 * a);
            
            solution = `x₁ = ${realPart.toFixed(4)} + ${imagPart.toFixed(4)}i, x₂ = ${realPart.toFixed(4)} - ${imagPart.toFixed(4)}i`;
            steps.push(`Discriminant < 0: Two complex solutions`);
            steps.push(`x₁ = ${realPart.toFixed(4)} + ${imagPart.toFixed(4)}i`);
            steps.push(`x₂ = ${realPart.toFixed(4)} - ${imagPart.toFixed(4)}i`);
        }

        const equation = `${a}x² + ${b}x + ${c} = 0`;
        displayResults(equation, solution, steps);
    }

    // Display results
    function displayResults(equation, solution, steps) {
        solutionText.innerHTML = `
            <div style="margin-bottom: 1rem;">
                <strong>Equation:</strong> ${equation}
            </div>
            <div style="font-size: 1.2rem; color: var(--primary-color);">
                <strong>Solution:</strong> ${solution}
            </div>
        `;

        solutionSteps.innerHTML = steps.map((step, index) => 
            `<div style="padding: 0.5rem 0; border-left: 3px solid var(--primary-color); padding-left: 1rem; margin: 0.5rem 0;">
                <strong>Step ${index + 1}:</strong> ${step}
            </div>`
        ).join('');

        resultsSection.style.display = 'block';
    }

    // Show error
    function showError(message) {
        errorText.textContent = message;
        errorMessage.style.display = 'flex';
    }

    // Hide error
    function hideError() {
        errorMessage.style.display = 'none';
    }

    // Hide results
    function hideResults() {
        resultsSection.style.display = 'none';
    }

    // Reset calculator
    function resetCalculator() {
        // Reset inputs
        document.querySelectorAll('input[type="number"]').forEach(input => {
            input.value = '';
        });

        hideError();
        hideResults();
    }

    // Initialize
    handleEquationTypeChange();
})();
