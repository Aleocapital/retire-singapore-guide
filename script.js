// Smooth scroll for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add scroll effect to header
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 50) {
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.boxShadow = 'none';
    }
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe cards for animation
document.querySelectorAll('.card, .investment-card, .info-box, .checklist-column').forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = `opacity 0.5s ease, transform 0.5s ease ${index * 0.1}s`;
    observer.observe(el);
});

// Theme Toggle
const themeToggle = document.getElementById('theme-toggle');
const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);
themeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        themeToggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';
    });
}

// Calculator Logic
const raRange = document.getElementById('ra-range');
const raBalance = document.getElementById('ra-balance');
const planType = document.getElementById('plan-type');
const otherIncome = document.getElementById('other-income');
const cpfPayoutDisplay = document.getElementById('cpf-payout');
const totalIncomeDisplay = document.getElementById('total-income');

function updateCalculator() {
    const ra = parseFloat(raBalance.value) || 0;
    const other = parseFloat(otherIncome.value) || 0;
    const plan = planType.value;

    // Approximated payout ratios based on 2026 data
    // Standard: ~1% of RA per month (approx range 0.9% - 1.1%)
    let ratio = 0.0095; 
    
    if (plan === 'escalating') {
        ratio = 0.0075; // Starts lower
    } else if (plan === 'basic') {
        ratio = 0.0085; // Medium
    }

    const cpfPayout = ra * ratio;
    const total = cpfPayout + other;

    cpfPayoutDisplay.textContent = `S$${Math.round(cpfPayout).toLocaleString()}`;
    totalIncomeDisplay.textContent = `S$${Math.round(total).toLocaleString()}`;
}

if (raRange && raBalance) {
    raRange.addEventListener('input', (e) => {
        raBalance.value = e.target.value;
        updateCalculator();
    });

    raBalance.addEventListener('input', (e) => {
        raRange.value = e.target.value;
        updateCalculator();
    });

    planType.addEventListener('change', updateCalculator);
    otherIncome.addEventListener('input', updateCalculator);

    // Initial calculation
    updateCalculator();
}

// FIRE Calculator Logic
function updateFireCalc() {
    const currentAge = parseFloat(document.getElementById('fire-current-age').value) || 0;
    const savings = parseFloat(document.getElementById('fire-savings').value) || 0;
    const monthlyContribution = parseFloat(document.getElementById('fire-monthly-contribution').value) || 0;
    const monthlyExpenses = parseFloat(document.getElementById('fire-expenses').value) || 0;
    const annualReturn = (parseFloat(document.getElementById('fire-return').value) || 0) / 100;

    // FIRE Number = Annual Expenses * 25 (based on 4% rule)
    const fireNumber = monthlyExpenses * 12 * 25;
    document.getElementById('fire-number').textContent = `S$${Math.round(fireNumber).toLocaleString()}`;

    // Solve for years: FutureValue = fireNumber
    // FV = savings * (1+r)^n + contribution * (((1+r)^n - 1) / r)
    // Using a simple loop for clarity and precision with monthly compounding
    const monthlyRate = annualReturn / 12;
    let currentPot = savings;
    let months = 0;
    const maxMonths = 600; // 50 years cap

    if (currentPot < fireNumber) {
        while (currentPot < fireNumber && months < maxMonths) {
            currentPot = currentPot * (1 + monthlyRate) + monthlyContribution;
            months++;
        }
    }

    const yearsToFire = months / 12;
    document.getElementById('fire-years').textContent = yearsToFire >= 50 ? '50+' : yearsToFire.toFixed(1);
    document.getElementById('fire-age').textContent = yearsToFire >= 50 ? '80+' : Math.round(currentAge + yearsToFire);
    document.getElementById('fire-passive-income').textContent = `S$${Math.round(monthlyExpenses).toLocaleString()}`;
}

const fireInputs = ['fire-current-age', 'fire-savings', 'fire-monthly-contribution', 'fire-expenses', 'fire-return'];
fireInputs.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', updateFireCalc);
});

// Initial FIRE calculation
if (document.getElementById('fire-current-age')) updateFireCalc();

console.log('🏝️ Singapore Retirement Guide loaded!');
