/**
 * Calorie Calculator
 *
 * Calculates daily calorie needs based on BMR and activity level
 * Uses Mifflin-St Jeor equation for BMR calculation
 * Extends CalculatorBase for common functionality
 */

class CalorieCalculator extends CalculatorBase {
    constructor() {
        super();
        this.init();
    }

    /**
     * Cache DOM elements specific to Calorie Calculator
     */
    cacheElements() {
        super.cacheElements();

        // Gender selection
        this.genderBtns = document.querySelectorAll('.gender-btn');
        this.genderInput = document.getElementById('gender');

        // Input fields
        this.ageInput = document.getElementById('age');
        this.weightInput = document.getElementById('weight');
        this.weightUnit = document.getElementById('weightUnit');
        this.heightInput = document.getElementById('height');
        this.heightUnit = document.getElementById('heightUnit');
        this.activitySelect = document.getElementById('activity');
        this.goalSelect = document.getElementById('goal');

        // Result displays
        this.dailyCalories = document.getElementById('dailyCalories');
        this.bmr = document.getElementById('bmr');
        this.tdee = document.getElementById('tdee');
        this.goalDescription = document.getElementById('goalDescription');
        this.protein = document.getElementById('protein');
        this.carbs = document.getElementById('carbs');
        this.fats = document.getElementById('fats');
        this.timelineTable = document.getElementById('timelineTable');
    }

    /**
     * Bind event listeners
     */
    bindEvents() {
        super.bindEvents();

        // Gender selection
        if (this.genderBtns) {
            this.genderBtns.forEach(btn => {
                if (btn) {
                    btn.addEventListener('click', (e) => {
                        this.setGender(e.currentTarget.dataset.gender);
                    });
                }
            });
        }

        // Unit change listeners
        if (this.weightUnit) {
            this.weightUnit.addEventListener('change', () => this.handleUnitChange('weight'));
        }

        if (this.heightUnit) {
            this.heightUnit.addEventListener('change', () => this.handleUnitChange('height'));
        }

        // Add enter key support for inputs
        [this.ageInput, this.weightInput, this.heightInput].forEach(input => {
            if (input) {
                this.addEnterKeySupport(input, () => this.handleCalculate());
            }
        });
    }

    /**
     * Set gender
     */
    setGender(gender) {
        if (this.genderInput) {
            this.genderInput.value = gender;
        }

        // Update button states
        if (this.genderBtns) {
            this.genderBtns.forEach(btn => {
                if (btn) {
                    btn.classList.remove('active');
                    if (btn.dataset.gender === gender) {
                        btn.classList.add('active');
                    }
                }
            });
        }
    }

    /**
     * Handle unit changes
     */
    handleUnitChange(type) {
        if (type === 'weight') {
            const value = parseFloat(this.weightInput.value);
            if (!isNaN(value)) {
                if (this.weightUnit.value === 'lb') {
                    // Convert kg to lb
                    this.weightInput.value = this.roundToDecimal(value * 2.20462, 1);
                } else {
                    // Convert lb to kg
                    this.weightInput.value = this.roundToDecimal(value / 2.20462, 1);
                }
            }
        } else if (type === 'height') {
            const value = parseFloat(this.heightInput.value);
            if (!isNaN(value)) {
                if (this.heightUnit.value === 'ft') {
                    // Convert cm to ft
                    this.heightInput.value = this.roundToDecimal(value / 30.48, 1);
                } else {
                    // Convert ft to cm
                    this.heightInput.value = this.roundToDecimal(value * 30.48, 1);
                }
            }
        }
    }

    /**
     * Handle calculate button click
     */
    handleCalculate() {
        this.clearError();

        // Get and validate inputs
        const gender = this.genderInput.value;
        const age = parseInt(this.ageInput.value);
        let weight = parseFloat(this.weightInput.value);
        let height = parseFloat(this.heightInput.value);
        const activity = parseFloat(this.activitySelect.value);
        const goal = this.goalSelect.value;

        // Validate inputs
        if (!this.validateRequired(age, 'Age')) return;
        if (!this.validateRequired(weight, 'Weight')) return;
        if (!this.validateRequired(height, 'Height')) return;

        if (age < 15 || age > 100) {
            this.showError('Age must be between 15 and 100 years');
            return;
        }

        // Convert to metric if needed
        if (this.weightUnit.value === 'lb') {
            weight = weight / 2.20462; // Convert to kg
        }

        if (this.heightUnit.value === 'ft') {
            height = height * 30.48; // Convert to cm
        }

        if (weight < 30 || weight > 300) {
            this.showError('Weight must be between 30 and 300 kg');
            return;
        }

        if (height < 100 || height > 250) {
            this.showError('Height must be between 100 and 250 cm');
            return;
        }

        // Calculate BMR using Mifflin-St Jeor equation
        const bmr = this.calculateBMR(gender, weight, height, age);

        // Calculate TDEE
        const tdee = bmr * activity;

        // Calculate target calories based on goal
        const targetCalories = this.calculateTargetCalories(tdee, goal);

        // Calculate macronutrients
        const macros = this.calculateMacros(targetCalories);

        // Generate weight timeline
        const timeline = this.generateTimeline(weight, goal);

        // Display results
        this.displayResults({
            bmr: bmr,
            tdee: tdee,
            dailyCalories: targetCalories,
            goal: goal,
            macros: macros,
            timeline: timeline,
            currentWeight: weight
        });
    }

    /**
     * Calculate BMR using Mifflin-St Jeor equation
     *
     * @param {string} gender - 'male' or 'female'
     * @param {number} weight - Weight in kg
     * @param {number} height - Height in cm
     * @param {number} age - Age in years
     * @returns {number} - BMR in calories
     */
    calculateBMR(gender, weight, height, age) {
        // Mifflin-St Jeor Equation:
        // Men: (10 × weight in kg) + (6.25 × height in cm) - (5 × age in years) + 5
        // Women: (10 × weight in kg) + (6.25 × height in cm) - (5 × age in years) - 161

        const baseBMR = (10 * weight) + (6.25 * height) - (5 * age);
        return gender === 'male' ? baseBMR + 5 : baseBMR - 161;
    }

    /**
     * Calculate target calories based on goal
     *
     * @param {number} tdee - Total Daily Energy Expenditure
     * @param {string} goal - Weight goal
     * @returns {number} - Target daily calories
     */
    calculateTargetCalories(tdee, goal) {
        const adjustments = {
            'maintain': 0,
            'mild-loss': -250,      // 0.25 kg/week
            'loss': -500,           // 0.5 kg/week
            'extreme-loss': -1000,  // 1 kg/week
            'mild-gain': 250,       // 0.25 kg/week
            'gain': 500,            // 0.5 kg/week
            'extreme-gain': 1000    // 1 kg/week
        };

        return tdee + (adjustments[goal] || 0);
    }

    /**
     * Calculate macronutrients
     *
     * @param {number} calories - Daily calorie target
     * @returns {Object} - Macros in grams
     */
    calculateMacros(calories) {
        // Standard macro split: 30% protein, 40% carbs, 30% fat
        return {
            protein: Math.round((calories * 0.30) / 4),  // 4 cal/g
            carbs: Math.round((calories * 0.40) / 4),    // 4 cal/g
            fats: Math.round((calories * 0.30) / 9)      // 9 cal/g
        };
    }

    /**
     * Generate weight timeline
     *
     * @param {number} currentWeight - Current weight in kg
     * @param {string} goal - Weight goal
     * @returns {Array} - Timeline data
     */
    generateTimeline(currentWeight, goal) {
        const weeklyChanges = {
            'maintain': 0,
            'mild-loss': -0.25,
            'loss': -0.5,
            'extreme-loss': -1,
            'mild-gain': 0.25,
            'gain': 0.5,
            'extreme-gain': 1
        };

        const weeklyChange = weeklyChanges[goal] || 0;
        const timeline = [];

        // Generate 1 week, 1 month, 3 months, 6 months timeline
        const periods = [
            { label: '1 week', weeks: 1 },
            { label: '1 month', weeks: 4 },
            { label: '3 months', weeks: 13 },
            { label: '6 months', weeks: 26 }
        ];

        periods.forEach(period => {
            const weightChange = weeklyChange * period.weeks;
            const futureWeight = currentWeight + weightChange;

            timeline.push({
                period: period.label,
                weight: futureWeight,
                change: weightChange
            });
        });

        return timeline;
    }

    /**
     * Display calculation results
     *
     * @param {Object} data - Calculation data
     */
    displayResults(data) {
        const { bmr, tdee, dailyCalories, goal, macros, timeline, currentWeight } = data;

        // Display main metrics
        if (this.dailyCalories) {
            this.dailyCalories.textContent = Math.round(dailyCalories) + ' cal';
        }

        if (this.bmr) {
            this.bmr.textContent = Math.round(bmr) + ' cal';
        }

        if (this.tdee) {
            this.tdee.textContent = Math.round(tdee) + ' cal';
        }

        // Goal description
        const goalDescriptions = {
            'maintain': 'To maintain current weight',
            'mild-loss': 'Mild weight loss (0.25 kg/week)',
            'loss': 'Weight loss (0.5 kg/week)',
            'extreme-loss': 'Extreme weight loss (1 kg/week)',
            'mild-gain': 'Mild weight gain (0.25 kg/week)',
            'gain': 'Weight gain (0.5 kg/week)',
            'extreme-gain': 'Extreme weight gain (1 kg/week)'
        };

        if (this.goalDescription) {
            this.goalDescription.textContent = goalDescriptions[goal];
        }

        // Display macros
        if (this.protein) {
            this.protein.textContent = macros.protein + 'g';
        }

        if (this.carbs) {
            this.carbs.textContent = macros.carbs + 'g';
        }

        if (this.fats) {
            this.fats.textContent = macros.fats + 'g';
        }

        // Display timeline
        if (this.timelineTable) {
            this.timelineTable.innerHTML = '';

            timeline.forEach(item => {
                const row = document.createElement('tr');
                const changeClass = item.change < 0 ? 'loss' : item.change > 0 ? 'gain' : 'maintain';
                const changeSign = item.change > 0 ? '+' : '';

                row.innerHTML = `
                    <td>${item.period}</td>
                    <td>${this.formatWeight(item.weight)}</td>
                    <td class="${changeClass}">${changeSign}${this.formatWeight(item.change)}</td>
                `;

                this.timelineTable.appendChild(row);
            });
        }

        // Show results section
        super.displayResults(data);
    }

    /**
     * Format weight with unit
     */
    formatWeight(weight) {
        if (this.weightUnit.value === 'lb') {
            return this.roundToDecimal(weight * 2.20462, 1) + ' lb';
        }
        return this.roundToDecimal(weight, 1) + ' kg';
    }

    /**
     * Handle recalculate button click
     */
    handleRecalculate() {
        super.handleRecalculate();

        // Reset to default values
        this.setGender('male');
        if (this.ageInput) this.ageInput.value = '30';
        if (this.weightInput) this.weightInput.value = '70';
        if (this.weightUnit) this.weightUnit.value = 'kg';
        if (this.heightInput) this.heightInput.value = '170';
        if (this.heightUnit) this.heightUnit.value = 'cm';
        if (this.activitySelect) this.activitySelect.value = '1.55';
        if (this.goalSelect) this.goalSelect.value = 'maintain';

        // Focus on age input
        if (this.ageInput) {
            this.ageInput.focus();
        }
    }
}

// Initialize calculator when DOM is ready
document.addEventListener('DOMContentLoaded', function () {
    new CalorieCalculator();
});
