(function () {
    'use strict';

    /**
     * Protein Calculator Logic
     * Calculates daily protein needs based on weight, activity, and goals
     */
    class ProteinCalculator {
        constructor() {
            // DOM Elements
            this.weightInput = document.getElementById('weight');
            this.activitySelect = document.getElementById('activity');
            this.goalSelect = document.getElementById('goal');
            this.genderBtns = document.querySelectorAll('.gender-btn[data-gender]');
            this.unitBtns = document.querySelectorAll('.unit-btn[data-unit]');
            this.calculateBtn = document.getElementById('calculateBtn');
            this.recalculateBtn = document.getElementById('recalculateBtn');
            this.resultsSection = document.getElementById('resultsSection');
            this.errorMessage = document.getElementById('errorMessage');
            this.errorText = document.getElementById('errorText');

            // Result Elements
            this.dailyProtein = document.getElementById('dailyProtein');
            this.perKg = document.getElementById('perKg');
            this.perLb = document.getElementById('perLb');
            this.breakfast = document.getElementById('breakfast');
            this.lunch = document.getElementById('lunch');
            this.dinner = document.getElementById('dinner');
            this.snacks = document.getElementById('snacks');

            // State
            this.currentUnit = 'kg';
            this.selectedGender = null;

            this.init();
        }

        init() {
            this.bindEvents();
        }

        bindEvents() {
            // Unit toggle
            this.unitBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    this.unitBtns.forEach(b => b.classList.remove('active'));
                    e.currentTarget.classList.add('active');
                    this.currentUnit = e.currentTarget.dataset.unit;
                });
            });

            // Gender toggle (optional)
            this.genderBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const target = e.currentTarget;
                    if (target.classList.contains('active')) {
                        target.classList.remove('active');
                        this.selectedGender = null;
                    } else {
                        this.genderBtns.forEach(b => b.classList.remove('active'));
                        target.classList.add('active');
                        this.selectedGender = target.dataset.gender;
                    }
                });
            });

            this.calculateBtn.addEventListener('click', () => this.calculate());

            if (this.recalculateBtn) {
                this.recalculateBtn.addEventListener('click', () => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    this.weightInput.focus();
                });
            }
        }

        calculate() {
        const _trackStartTime = Date.now();

            this.hideError();

            // Get values
            let weight = parseFloat(this.weightInput.value);
            const activity = this.activitySelect.value;
            const goal = this.goalSelect.value;

            // Validation
            if (isNaN(weight) || weight <= 0) {
                if(window.trackUsage) window.trackUsage('calculate_error', false, { calculator: 'protein.js' });
            this.showError('올바른 체중을 입력해주세요.');
                return;
            }

            // Convert to kg if needed
            const weightInKg = this.currentUnit === 'lb' ? weight * 0.453592 : weight;
            const weightInLb = this.currentUnit === 'kg' ? weight * 2.20462 : weight;

            // Calculate protein needs (g/kg)
            let proteinPerKg = 0;

            // Base on goal
            switch (goal) {
                case 'maintain':
                    proteinPerKg = 1.4; // Maintain muscle
                    break;
                case 'lose':
                    proteinPerKg = 2.0; // Fat loss (preserve muscle)
                    break;
                case 'gain':
                    proteinPerKg = 2.0; // Muscle gain (bulking)
                    break;
                case 'athlete':
                    proteinPerKg = 2.2; // Athletes
                    break;
                default:
                    proteinPerKg = 1.6;
            }

            // Adjust for activity level
            switch (activity) {
                case 'sedentary':
                    proteinPerKg *= 0.9;
                    break;
                case 'light':
                    proteinPerKg *= 0.95;
                    break;
                case 'moderate':
                    // No change
                    break;
                case 'very':
                    proteinPerKg *= 1.05;
                    break;
                case 'extreme':
                    proteinPerKg *= 1.1;
                    break;
            }

            // Calculate daily protein
            const dailyProtein = weightInKg * proteinPerKg;
            const proteinPerLb = proteinPerKg / 2.20462;

            // Meal distribution (25%, 30%, 30%, 15%)
            const breakfastProtein = dailyProtein * 0.25;
            const lunchProtein = dailyProtein * 0.30;
            const dinnerProtein = dailyProtein * 0.30;
            const snacksProtein = dailyProtein * 0.15;

            // Update UI
            if(window.trackUsage) window.trackUsage('calculate_success', true, { duration: Date.now() - _trackStartTime, calculator: 'protein.js' });
            this.displayResults({
                dailyProtein,
                proteinPerKg,
                proteinPerLb,
                breakfastProtein,
                lunchProtein,
                dinnerProtein,
                snacksProtein
            });
        }

        displayResults(data) {
            // Main Results
            this.dailyProtein.textContent = Math.round(data.dailyProtein) + 'g';
            this.perKg.textContent = data.proteinPerKg.toFixed(1) + ' g/kg';
            this.perLb.textContent = data.proteinPerLb.toFixed(1) + ' g/lb';

            // Meal Distribution
            this.breakfast.textContent = Math.round(data.breakfastProtein) + 'g';
            this.lunch.textContent = Math.round(data.lunchProtein) + 'g';
            this.dinner.textContent = Math.round(data.dinnerProtein) + 'g';
            this.snacks.textContent = Math.round(data.snacksProtein) + 'g';

            // Show results
            this.resultsSection.style.display = 'block';

            // Scroll to results
            this.resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        showError(message) {
            if (this.errorMessage && this.errorText) {
                this.errorText.textContent = message;
                this.errorMessage.style.display = 'flex';
                this.resultsSection.style.display = 'none';
            }
        }

        hideError() {
            if (this.errorMessage) {
                this.errorMessage.style.display = 'none';
            }
        }
    }

    // Initialize
    document.addEventListener('DOMContentLoaded', function () {
        new ProteinCalculator();
    });
})();
