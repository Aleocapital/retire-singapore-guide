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

console.log('🏝️ Singapore Retirement Guide loaded!');
