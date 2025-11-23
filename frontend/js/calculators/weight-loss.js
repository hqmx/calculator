/**
 * Weight Loss Calculator
 * Calculates weight loss timeline, calorie deficit, and milestones
 */

(function () {
    'use strict';

    class WeightLossCalculator {
        constructor() {
            this.gender = 'male';
            this.init();
        }

        init() {
            this.cacheElements();
            this.bindEvents();
            this.syncUnitSelectors();
        }

        cacheElements() {
            // Gender selection
            this.genderButtons = document.querySelectorAll('[data-gender]');
            this.genderInput = document.getElementById('gender');

            // Inputs
            this.ageInput = document.getElementById('age');
            this.currentWeightInput = document.getElementById('currentWeight');
            this.goalWeightInput = document.getElementById('goalWeight');
            this.heightInput = document.getElementById('height');
            this.activityInput = document.getElementById('activity');
            this.weeklyGoalInput = document.getElementById('weeklyGoal');

            // Unit selectors
            this.weightUnitSelect = document.getElementById('weightUnit');
            this.goalWeightUnitSelect = document.getElementById('goalWeightUnit');
            this.heightUnitSelect = document.getElementById('heightUnit');

            // Buttons
            this.calculateBtn = document.getElementById('calculateBtn');
            this.recalculateBtn = document.getElementById('recalculateBtn');

            // Results
            this.resultsSection = document.getElementById('resultsSection');
            this.errorMessage = document.getElementById('errorMessage');
            this.errorText = document.getElementById('errorText');

            // Result values
            this.weightToLoseValue = document.getElementById('weightToLose');
            this.timeRequiredValue = document.getElementById('timeRequired');
            this.targetDateValue = document.getElementById('targetDate');
            this.currentCaloriesValue = document.getElementById('currentCalories');
            this.targetCaloriesValue = document.getElementById('targetCalories');
            this.milestonesTable = document.getElementById('milestonesTable');
        }

        bindEvents() {
            // Gender selection
            this.genderButtons.forEach(btn => {
                btn.addEventListener('click', () => this.handleGenderChange(btn));
            });

            // Sync unit selectors
            this.weightUnitSelect.addEventListener('change', () => this.syncUnitSelectors());
            this.heightUnitSelect.addEventListener('change', () => this.syncUnitSelectors());

            // Calculate button
            this.calculateBtn.addEventListener('click', () => this.calculate());

            // Recalculate button
            if (this.recalculateBtn) {
                this.recalculateBtn.addEventListener('click', () => this.recalculate());
            }
        }

        handleGenderChange(btn) {
            const gender = btn.dataset.gender;
            this.gender = gender;
            this.genderInput.value = gender;

            // Update button states
            this.genderButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            this.hideError();
        }

        syncUnitSelectors() {
            // Sync weight units
            const weightUnit = this.weightUnitSelect.value;
            this.goalWeightUnitSelect.value = weightUnit;
        }

        calculate() {
            this.hideError();

            // Get values
            const age = parseFloat(this.ageInput.value);
            const currentWeight = parseFloat(this.currentWeightInput.value);
            const goalWeight = parseFloat(this.goalWeightInput.value);
            const height = parseFloat(this.heightInput.value);
            const activityLevel = parseFloat(this.activityInput.value);
            const weeklyGoal = parseFloat(this.weeklyGoalInput.value);

            const weightUnit = this.weightUnitSelect.value;
            const heightUnit = this.heightUnitSelect.value;

            // Validate inputs
            if (!age || !currentWeight || !goalWeight || !height) {
                this.showError('모든 필수 항목을 입력해주세요.');
                return;
            }

            if (age < 15 || age > 100) {
                this.showError('나이는 15-100 사이여야 합니다.');
                return;
            }

            if (currentWeight <= goalWeight) {
                this.showError('현재 체중이 목표 체중보다 커야 합니다.');
                return;
            }

            // Convert to metric if needed
            let weightKg = currentWeight;
            let goalWeightKg = goalWeight;
            let heightCm = height;

            if (weightUnit === 'lb') {
                weightKg = currentWeight * 0.453592;
                goalWeightKg = goalWeight * 0.453592;
            }

            if (heightUnit === 'ft') {
                heightCm = height * 30.48;
            }

            // Calculate results
            const results = this.calculateWeightLoss(
                this.gender,
                age,
                weightKg,
                goalWeightKg,
                heightCm,
                activityLevel,
                weeklyGoal,
                weightUnit
            );

            // Display results
            this.displayResults(results, weightUnit);
        }

        calculateWeightLoss(gender, age, currentWeight, goalWeight, height, activityLevel, weeklyGoal, weightUnit) {
            // Calculate BMR using Mifflin-St Jeor Equation
            let bmr;
            if (gender === 'male') {
                bmr = 10 * currentWeight + 6.25 * height - 5 * age + 5;
            } else {
                bmr = 10 * currentWeight + 6.25 * height - 5 * age - 161;
            }

            // Calculate TDEE (Total Daily Energy Expenditure)
            const tdee = bmr * activityLevel;

            // Calculate weight to lose
            const weightToLose = currentWeight - goalWeight;

            // Calculate time required (weeks)
            const weeksRequired = Math.ceil(weightToLose / weeklyGoal);

            // Calculate target date
            const targetDate = new Date();
            targetDate.setDate(targetDate.getDate() + (weeksRequired * 7));

            // Calculate calorie deficit needed
            // 1 kg fat = ~7700 calories
            const dailyDeficit = (weeklyGoal * 7700) / 7;

            // Calculate target daily calories
            let targetCalories = tdee - dailyDeficit;

            // Safety check: minimum calories
            const minCalories = gender === 'male' ? 1500 : 1200;
            if (targetCalories < minCalories) {
                targetCalories = minCalories;
            }

            // Generate milestones
            const milestones = this.generateMilestones(currentWeight, goalWeight, weeklyGoal, weeksRequired);

            return {
                weightToLose,
                weeksRequired,
                targetDate,
                currentCalories: Math.round(tdee),
                targetCalories: Math.round(targetCalories),
                dailyDeficit: Math.round(dailyDeficit),
                milestones
            };
        }

        generateMilestones(currentWeight, goalWeight, weeklyGoal, totalWeeks) {
            const milestones = [];
            let weight = currentWeight;

            // Add current
            milestones.push({
                period: '현재',
                weight: weight,
                lost: 0
            });

            // Add monthly milestones
            const monthlyGoal = weeklyGoal * 4;
            const months = Math.ceil(totalWeeks / 4);

            for (let i = 1; i <= months && weight > goalWeight; i++) {
                weight -= monthlyGoal;
                if (weight < goalWeight) weight = goalWeight;

                milestones.push({
                    period: `${i}개월`,
                    weight: weight,
                    lost: currentWeight - weight
                });
            }

            return milestones;
        }

        displayResults(results, weightUnit) {
            const unitLabel = weightUnit === 'kg' ? 'kg' : 'lb';

            // Convert back to display unit if needed
            const convertWeight = (kg) => {
                if (weightUnit === 'lb') {
                    return (kg * 2.20462).toFixed(1);
                }
                return kg.toFixed(1);
            };

            // Weight to lose
            this.weightToLoseValue.textContent = `${convertWeight(results.weightToLose)} ${unitLabel}`;

            // Time required
            const months = Math.floor(results.weeksRequired / 4);
            const weeks = results.weeksRequired % 4;
            let timeText = '';
            if (months > 0) {
                timeText += `${months}개월`;
                if (weeks > 0) timeText += ` ${weeks}주`;
            } else {
                timeText = `${weeks}주`;
            }
            this.timeRequiredValue.textContent = timeText;

            // Target date
            const formatDate = (date) => {
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                return `${year}.${month}.${day}`;
            };
            this.targetDateValue.textContent = formatDate(results.targetDate);

            // Calories
            this.currentCaloriesValue.textContent = `${results.currentCalories.toLocaleString()} kcal`;
            this.targetCaloriesValue.textContent = `${results.targetCalories.toLocaleString()} kcal`;

            // Milestones table
            this.milestonesTable.innerHTML = '';
            results.milestones.forEach(milestone => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${milestone.period}</td>
                    <td>${convertWeight(milestone.weight)} ${unitLabel}</td>
                    <td>${convertWeight(milestone.lost)} ${unitLabel}</td>
                `;
                this.milestonesTable.appendChild(row);
            });

            // Show results
            this.resultsSection.style.display = 'block';

            // Scroll to results
            setTimeout(() => {
                this.resultsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 100);
        }

        recalculate() {
            this.resultsSection.style.display = 'none';
            this.hideError();

            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        showError(message) {
            this.errorText.textContent = message;
            this.errorMessage.style.display = 'flex';
        }

        hideError() {
            this.errorMessage.style.display = 'none';
        }
    }

    // Initialize calculator when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => new WeightLossCalculator());
    } else {
        new WeightLossCalculator();
    }
})();
