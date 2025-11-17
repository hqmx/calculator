/**
 * BMI Calculator Logic
 * Calculates Body Mass Index with WHO standard categorization
 * Supports metric (kg/cm) and imperial (lb/in) units
 */

(function() {
    'use strict';

    // BMI Calculator Class
    class BMICalculator {
        constructor() {
            this.weightUnit = 'kg';
            this.heightUnit = 'cm';
            this.selectedGender = null;
            this.init();
        }

        init() {
            this.cacheElements();
            this.bindEvents();
            this.setupInitialState();
        }

        cacheElements() {
            // Input elements
            this.weightInput = document.getElementById('weight');
            this.heightInput = document.getElementById('height');
            this.ageInput = document.getElementById('age');

            // Unit toggle buttons - 명확한 컨테이너 기반 선택
            const weightContainer = this.weightInput.closest('.input-with-unit');
            const heightContainer = this.heightInput.closest('.input-with-unit');

            this.weightUnitBtns = weightContainer ? weightContainer.querySelectorAll('.unit-toggle .unit-btn') : [];
            this.heightUnitBtns = heightContainer ? heightContainer.querySelectorAll('.unit-toggle .unit-btn') : [];
            this.genderBtns = document.querySelectorAll('.gender-btn');

            // Action buttons
            this.calculateBtn = document.getElementById('calculateBtn');
            this.recalculateBtn = document.getElementById('recalculateBtn');

            // Result elements
            this.resultsSection = document.getElementById('resultsSection');
            this.bmiValue = document.getElementById('bmiValue');
            this.categoryIcon = document.getElementById('categoryIcon');
            this.categoryName = document.getElementById('categoryName');
            this.categoryBadge = document.getElementById('categoryBadge');
            this.categoryBar = document.getElementById('categoryBar');
            this.healthStatus = document.getElementById('healthStatus');
            this.recommendationsList = document.getElementById('recommendationsList');

            // Error message
            this.errorMessage = document.getElementById('errorMessage');
            this.errorText = document.getElementById('errorText');
        }

        bindEvents() {
            // Calculate button
            this.calculateBtn.addEventListener('click', () => this.handleCalculate());

            // Recalculate button
            if (this.recalculateBtn) {
                this.recalculateBtn.addEventListener('click', () => this.handleRecalculate());
            }

            // Unit toggle buttons
            this.weightUnitBtns.forEach(btn => {
                btn.addEventListener('click', (e) => this.handleWeightUnitToggle(e));
            });

            this.heightUnitBtns.forEach(btn => {
                btn.addEventListener('click', (e) => this.handleHeightUnitToggle(e));
            });

            // Gender buttons
            this.genderBtns.forEach(btn => {
                btn.addEventListener('click', (e) => this.handleGenderSelect(e));
            });

            // Enter key support
            [this.weightInput, this.heightInput, this.ageInput].forEach(input => {
                if (input) {
                    input.addEventListener('keypress', (e) => {
                        if (e.key === 'Enter') {
                            this.handleCalculate();
                        }
                    });
                }
            });

            // Real-time validation
            this.weightInput.addEventListener('input', () => this.clearError());
            this.heightInput.addEventListener('input', () => this.clearError());
        }

        setupInitialState() {
            // Set default units
            this.weightUnit = 'kg';
            this.heightUnit = 'cm';
            this.selectedGender = null;

            // Hide results initially
            if (this.resultsSection) {
                this.resultsSection.style.display = 'none';
            }
        }

        // ========== Event Handlers ==========

        handleWeightUnitToggle(e) {
            const btn = e.target.closest('.unit-btn');
            if (!btn) return;

            const newUnit = btn.dataset.unit;

            // Update active state
            btn.parentElement.querySelectorAll('.unit-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Convert existing value if present
            if (this.weightInput.value) {
                const currentValue = parseFloat(this.weightInput.value);
                if (!isNaN(currentValue)) {
                    let convertedValue;
                    if (this.weightUnit === 'kg' && newUnit === 'lb') {
                        convertedValue = this.kgToLb(currentValue);
                    } else if (this.weightUnit === 'lb' && newUnit === 'kg') {
                        convertedValue = this.lbToKg(currentValue);
                    }
                    if (convertedValue !== undefined) {
                        this.weightInput.value = convertedValue.toFixed(1);
                    }
                }
            }

            this.weightUnit = newUnit;
            this.updateInputHints();
        }

        handleHeightUnitToggle(e) {
            const btn = e.target.closest('.unit-btn');
            if (!btn) return;

            const newUnit = btn.dataset.unit;

            // Update active state
            btn.parentElement.querySelectorAll('.unit-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Convert existing value if present
            if (this.heightInput.value) {
                const currentValue = parseFloat(this.heightInput.value);
                if (!isNaN(currentValue)) {
                    let convertedValue;
                    if (this.heightUnit === 'cm' && newUnit === 'ft') {
                        convertedValue = this.cmToInches(currentValue);
                    } else if (this.heightUnit === 'ft' && newUnit === 'cm') {
                        convertedValue = this.inchesToCm(currentValue);
                    }
                    if (convertedValue !== undefined) {
                        this.heightInput.value = convertedValue.toFixed(1);
                    }
                }
            }

            this.heightUnit = newUnit;
            this.updateInputHints();
        }

        handleGenderSelect(e) {
            const btn = e.target.closest('.gender-btn');
            if (!btn) return;

            const gender = btn.dataset.gender;

            // Toggle selection
            if (this.selectedGender === gender) {
                // Deselect
                btn.classList.remove('active');
                this.selectedGender = null;
            } else {
                // Select new
                this.genderBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.selectedGender = gender;
            }
        }

        handleCalculate() {
            console.log('BMI Calculator: handleCalculate called');
            this.clearError();

            // Validate inputs
            const weight = parseFloat(this.weightInput.value);
            const height = parseFloat(this.heightInput.value);
            const age = this.ageInput.value ? parseInt(this.ageInput.value) : null;

            console.log('BMI Calculator: Inputs -', { weight, height, age, weightUnit: this.weightUnit, heightUnit: this.heightUnit });

            if (!this.validateInputs(weight, height, age)) {
                console.log('BMI Calculator: Validation failed');
                return;
            }

            // Convert to metric if needed
            const weightKg = this.weightUnit === 'lb' ? this.lbToKg(weight) : weight;
            const heightCm = this.heightUnit === 'ft' ? this.inchesToCm(height) : height;

            console.log('BMI Calculator: Converted -', { weightKg, heightCm });

            // Calculate BMI
            const bmi = this.calculateBMI(weightKg, heightCm);
            console.log('BMI Calculator: BMI calculated -', bmi);

            // Get category
            const category = this.getBMICategory(bmi);
            console.log('BMI Calculator: Category -', category.name);

            // Display results
            this.displayResults(bmi, category, age);
            console.log('BMI Calculator: Results displayed');
        }

        handleRecalculate() {
            this.resultsSection.style.display = 'none';
            this.weightInput.value = '';
            this.heightInput.value = '';
            this.ageInput.value = '';
            this.genderBtns.forEach(btn => btn.classList.remove('active'));
            this.selectedGender = null;
            this.clearError();
            this.weightInput.focus();
        }

        // ========== Validation ==========

        validateInputs(weight, height, age) {
            // Weight validation
            if (isNaN(weight) || weight <= 0) {
                this.showError('Please enter a valid weight');
                this.weightInput.focus();
                return false;
            }

            const weightMin = this.weightUnit === 'kg' ? 20 : 44;
            const weightMax = this.weightUnit === 'kg' ? 300 : 660;
            if (weight < weightMin || weight > weightMax) {
                this.showError(`Weight must be between ${weightMin}-${weightMax} ${this.weightUnit}`);
                this.weightInput.focus();
                return false;
            }

            // Height validation
            if (isNaN(height) || height <= 0) {
                this.showError('Please enter a valid height');
                this.heightInput.focus();
                return false;
            }

            const heightMin = this.heightUnit === 'cm' ? 100 : 39;
            const heightMax = this.heightUnit === 'cm' ? 250 : 98;
            if (height < heightMin || height > heightMax) {
                this.showError(`Height must be between ${heightMin}-${heightMax} ${this.heightUnit === 'cm' ? 'cm' : 'inches'}`);
                this.heightInput.focus();
                return false;
            }

            // Age validation (optional)
            if (age !== null && (isNaN(age) || age < 2 || age > 120)) {
                this.showError('Age must be between 2-120 years');
                this.ageInput.focus();
                return false;
            }

            return true;
        }

        // ========== BMI Calculation ==========

        calculateBMI(weightKg, heightCm) {
            const heightM = heightCm / 100;
            const bmi = weightKg / (heightM * heightM);
            return Math.round(bmi * 10) / 10; // Round to 1 decimal
        }

        getBMICategory(bmi) {
            if (bmi < 18.5) {
                return {
                    name: 'Underweight',
                    icon: '⬇️',
                    color: '#3b82f6',
                    bgColor: '#eff6ff',
                    textColor: '#1e40af',
                    status: 'You are underweight. Consider consulting a healthcare provider.',
                    recommendations: [
                        'Consult a healthcare provider or dietitian',
                        'Increase calorie intake with nutrient-rich foods',
                        'Consider strength training to build muscle mass',
                        'Monitor your health regularly'
                    ]
                };
            } else if (bmi >= 18.5 && bmi < 25) {
                return {
                    name: 'Normal weight',
                    icon: '✅',
                    color: '#10b981',
                    bgColor: '#ecfdf5',
                    textColor: '#065f46',
                    status: 'You are at a healthy weight. Keep up the good work!',
                    recommendations: [
                        'Maintain your current healthy lifestyle',
                        'Continue regular physical activity',
                        'Eat a balanced diet with plenty of fruits and vegetables',
                        'Stay hydrated and get adequate sleep'
                    ]
                };
            } else if (bmi >= 25 && bmi < 30) {
                return {
                    name: 'Overweight',
                    icon: '⚠️',
                    color: '#f59e0b',
                    bgColor: '#fffbeb',
                    textColor: '#92400e',
                    status: 'You are overweight. Consider lifestyle changes.',
                    recommendations: [
                        'Consult a healthcare provider for personalized advice',
                        'Increase physical activity (aim for 150 min/week)',
                        'Focus on portion control and balanced meals',
                        'Reduce processed foods and added sugars'
                    ]
                };
            } else if (bmi >= 30 && bmi < 35) {
                return {
                    name: 'Obese (Class I)',
                    icon: '🔴',
                    color: '#ef4444',
                    bgColor: '#fef2f2',
                    textColor: '#991b1b',
                    status: 'You are obese (Class I). Consult a healthcare provider.',
                    recommendations: [
                        'Seek medical advice from a healthcare professional',
                        'Develop a structured weight loss plan',
                        'Consider working with a dietitian and fitness coach',
                        'Monitor health markers (blood pressure, cholesterol)'
                    ]
                };
            } else if (bmi >= 35 && bmi < 40) {
                return {
                    name: 'Obese (Class II)',
                    icon: '🔴🔴',
                    color: '#dc2626',
                    bgColor: '#fef2f2',
                    textColor: '#7f1d1d',
                    status: 'You are obese (Class II). Medical consultation recommended.',
                    recommendations: [
                        'Consult healthcare provider immediately',
                        'Consider comprehensive weight management program',
                        'Regular monitoring of health conditions',
                        'Explore medical weight loss options if appropriate'
                    ]
                };
            } else {
                return {
                    name: 'Obese (Class III)',
                    icon: '🔴🔴🔴',
                    color: '#991b1b',
                    bgColor: '#fef2f2',
                    textColor: '#7f1d1d',
                    status: 'You are obese (Class III). Immediate medical attention advised.',
                    recommendations: [
                        'Seek immediate medical consultation',
                        'Discuss comprehensive treatment options',
                        'Consider specialized obesity clinic',
                        'Regular health monitoring is essential'
                    ]
                };
            }
        }

        // ========== Display Results ==========

        displayResults(bmi, category, age) {
            // Set BMI value
            this.bmiValue.textContent = bmi.toFixed(1);

            // Set category
            this.categoryIcon.textContent = category.icon;
            this.categoryName.textContent = category.name;

            // Style category badge
            this.categoryBadge.style.backgroundColor = category.bgColor;
            this.categoryBadge.style.color = category.textColor;
            this.categoryBadge.style.borderColor = category.color;

            // Set category bar
            this.categoryBar.style.backgroundColor = category.color;

            // Set health status
            this.healthStatus.textContent = category.status;

            // Set recommendations
            this.recommendationsList.innerHTML = '';
            category.recommendations.forEach(rec => {
                const li = document.createElement('li');
                li.textContent = rec;
                this.recommendationsList.appendChild(li);
            });

            // Add age-specific recommendations
            if (age) {
                if (age < 18) {
                    const li = document.createElement('li');
                    li.textContent = 'Note: Adult BMI standards may not apply to children and teens. Consult a pediatrician.';
                    li.style.fontWeight = 'bold';
                    this.recommendationsList.appendChild(li);
                } else if (age > 65) {
                    const li = document.createElement('li');
                    li.textContent = 'Note: BMI interpretation may differ for older adults. Consult your healthcare provider.';
                    this.recommendationsList.appendChild(li);
                }
            }

            // Show results section
            console.log('BMI: Showing results section');
            this.resultsSection.style.display = 'block';
            console.log('BMI: Results section displayed');

            // No scroll - let user see results naturally
        }

        // ========== Unit Conversions ==========

        kgToLb(kg) {
            return kg * 2.20462;
        }

        lbToKg(lb) {
            return lb / 2.20462;
        }

        cmToInches(cm) {
            return cm / 2.54;
        }

        inchesToCm(inches) {
            return inches * 2.54;
        }

        // ========== UI Helpers ==========

        updateInputHints() {
            const weightHint = this.weightInput.parentElement.nextElementSibling;
            const heightHint = this.heightInput.parentElement.nextElementSibling;

            if (weightHint && weightHint.classList.contains('input-hint')) {
                if (this.weightUnit === 'kg') {
                    weightHint.textContent = 'Range: 20-300 kg (44-660 lb)';
                } else {
                    weightHint.textContent = 'Range: 44-660 lb (20-300 kg)';
                }
            }

            if (heightHint && heightHint.classList.contains('input-hint')) {
                if (this.heightUnit === 'cm') {
                    heightHint.textContent = 'Range: 100-250 cm (3\'3"-8\'2")';
                } else {
                    heightHint.textContent = 'Range: 39-98 in (100-250 cm)';
                }
            }
        }

        showError(message) {
            this.errorText.textContent = message;
            this.errorMessage.style.display = 'flex';

            // Auto-hide after 5 seconds
            setTimeout(() => {
                this.clearError();
            }, 5000);
        }

        clearError() {
            this.errorMessage.style.display = 'none';
            this.errorText.textContent = '';
        }
    }

    // Initialize calculator when DOM is ready
    document.addEventListener('DOMContentLoaded', function() {
        new BMICalculator();
    });

})();
