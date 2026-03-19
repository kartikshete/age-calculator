// Main app logic - wait for the DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
    // Grab all our elements
    const form = document.getElementById('age-form');
    const dayInput = document.getElementById('day');
    const monthInput = document.getElementById('month');
    const yearInput = document.getElementById('year');

    // Where we show the results
    const resYears = document.getElementById('res-years');
    const resMonths = document.getElementById('res-months');
    const resDays = document.getElementById('res-days');

    const inputs = [dayInput, monthInput, yearInput];

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Only calculate if everything looks good
        if (validateForm()) {
            calculateAge();
        }
    });

    function validateForm() {
        let isValid = true;
        const now = new Date();
        const currentYear = now.getFullYear();

        // Little helper to show error messages
        const showError = (input, message) => {
            const wrapper = input.parentElement;
            const errorSpan = wrapper.querySelector('.error-message');
            wrapper.classList.add('error');
            errorSpan.textContent = message;
            isValid = false;
        };

        // Clear errors
        inputs.forEach(input => {
            const wrapper = input.parentElement;
            const errorSpan = wrapper.querySelector('.error-message');
            wrapper.classList.remove('error');
            errorSpan.textContent = '';
        });

        // Basic presence validation
        inputs.forEach(input => {
            if (!input.value) {
                showError(input, 'This field is required');
            }
        });

        if (!isValid) return false;

        // Specific range validation
        const d = parseInt(dayInput.value);
        const m = parseInt(monthInput.value);
        const y = parseInt(yearInput.value);

        if (d < 1 || d > 31) showError(dayInput, 'Must be a valid day');
        if (m < 1 || m > 12) showError(monthInput, 'Must be a valid month');
        if (y > currentYear) showError(yearInput, 'Must be in the past');
        if (y < 1900) showError(yearInput, 'Year too far in past');

        if (!isValid) return false;

        // Check date validity (e.g., Feb 30)
        const birthDate = new Date(y, m - 1, d);
        if (birthDate.getMonth() !== m - 1 || birthDate.getDate() !== d) {
            showError(dayInput, 'Must be a valid date');
            return false;
        }

        // Check if date is in the future
        if (birthDate > now) {
            showError(yearInput, 'Date cannot be in the future');
            return false;
        }

        return isValid;
    }

    function calculateAge() {
        const d = parseInt(dayInput.value);
        const m = parseInt(monthInput.value);
        const y = parseInt(yearInput.value);

        const birthDate = new Date(y, m - 1, d);
        const today = new Date();

        let years = today.getFullYear() - birthDate.getFullYear();
        let months = today.getMonth() - birthDate.getMonth();
        let days = today.getDate() - birthDate.getDate();

        // Date math is tricky - handle cases where current day/month is before birth day/month
        if (days < 0) {
            // Get last day of previous month
            const prevMonthLastDay = new Date(today.getFullYear(), today.getMonth(), 0).getDate();
            days += prevMonthLastDay;
            months--;
        }

        if (months < 0) {
            months += 12;
            years--;
        }

        // Just run the counters
        animateResult(resYears, years);
        animateResult(resMonths, months);
        animateResult(resDays, days);
    }

    // Simple count-up effect for the numbers
    function animateResult(element, targetValue) {
        let current = 0;
        const step = Math.ceil(targetValue / 40) || 1; // Basic increment logic

        element.textContent = '--';

        const timer = setInterval(() => {
            current += step;
            if (current >= targetValue) {
                element.textContent = targetValue;
                clearInterval(timer);
            } else {
                element.textContent = current;
            }
        }, 15); // Fast enough to look smooth
    }
});
