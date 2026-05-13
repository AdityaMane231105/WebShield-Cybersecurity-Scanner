// DOM Elements
const navbar = document.getElementById('navbar');
const navMenu = document.querySelector('.nav-menu');
const navToggle = document.querySelector('.nav-toggle');
const loadingScreen = document.getElementById('loading-screen');

// Loading Screen
window.addEventListener('load', () => {
    setTimeout(() => {
        loadingScreen.style.display = 'none';
    }, 3000);
});

// Navbar Scroll Effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(15, 32, 39, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.3)';
    } else {
        navbar.style.background = 'rgba(15, 32, 39, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Mobile Menu Toggle
navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// Active nav link management
function setActiveNavLink(activeId) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + activeId) {
            link.classList.add('active');
        }
    });
}

// Smooth Scrolling + active tab on click
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        e.preventDefault();
        const targetId = href.slice(1);
        setActiveNavLink(targetId);
        const target = document.getElementById(targetId);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            history.replaceState(null, null, href);
        }
    });
});

// Scroll spy - update active nav based on scroll position
function initScrollSpy() {
    const sectionIds = ['home', 'features', 'scanner', 'about', 'contact'];

    function updateActiveOnScroll() {
        const navHeight = 120;
        let activeId = 'home';

        sectionIds.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                const rect = el.getBoundingClientRect();
                if (rect.top <= navHeight) activeId = id;
            }
        });
        setActiveNavLink(activeId);
    }

    window.addEventListener('scroll', () => {
        requestAnimationFrame(updateActiveOnScroll);
    }, { passive: true });
    updateActiveOnScroll();
}

// Intersection Observer for Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
});

// Typing Animation Effect
class TypeWriter {
    constructor(element, text, speed = 100) {
        this.element = element;
        this.text = text;
        this.speed = speed;
        this.index = 0;
        this.type();
    }

    type() {
        if (this.index < this.text.length) {
            this.element.innerHTML += this.text.charAt(this.index);
            this.index++;
            setTimeout(() => this.type(), this.speed);
        }
    }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    initScrollSpy();

    const heroTitle = document.querySelector('.hero h1');
    if (heroTitle) {
        const originalText = heroTitle.innerHTML;
        heroTitle.innerHTML = '';
        new TypeWriter(heroTitle, originalText, 50);
    }
});

// Particle Animation Enhancement
function createParticle() {
    const particlesContainer = document.querySelector('.particles');
    if (!particlesContainer) return;

    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 8 + 's';
    particle.style.animationDuration = (Math.random() * 4 + 4) + 's';

    particlesContainer.appendChild(particle);

    setTimeout(() => {
        particle.remove();
    }, 8000);
}

// Create new particles periodically
setInterval(createParticle, 2000);

// Counter Animation
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target.toLocaleString();
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current).toLocaleString();
        }
    }, 16);
}

// Animate stats on scroll
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const target = parseInt(stat.textContent.replace(/,/g, ''));
                animateCounter(stat, target);
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.hero-stats, .about-stats').forEach(stats => {
    statsObserver.observe(stats);
});

function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function getResultClass(result) {
    if (result === 'LOW') return 'safe';
    if (result === 'MEDIUM') return 'warning';
    if (result === 'HIGH') return 'phishing';
    return 'warning';
}

function getResultIcon(result) {
    if (result === 'LOW') return 'fa-check-circle';
    if (result === 'MEDIUM') return 'fa-exclamation-triangle';
    if (result === 'HIGH') return 'fa-times-circle';
    return 'fa-exclamation-triangle';
}

function getResultLabel(result) {
    if (result === 'LOW') return 'SAFE';
    if (result === 'MEDIUM') return 'SUSPICIOUS';
    if (result === 'HIGH') return 'PHISHING';
    if (result === 'INVALID') return 'INVALID';
    if (result === 'ERROR') return 'ERROR';
    return String(result || 'UNKNOWN').toUpperCase();
}

function renderScanResult(resultEl, data) {
    const url = escapeHtml(data.url || '');
    const result = data.result;
    const score = Number.isFinite(Number(data.score)) ? Math.max(0, Math.min(100, Number(data.score))) : 0;
    const reasons = Array.isArray(data.reasons) ? data.reasons : [];
    const scanTimeMs = Number.isFinite(Number(data.scan_time_ms)) ? Number(data.scan_time_ms) : null;

    const reasonsHtml = reasons.length
        ? `
        <div class="reasons-list">
            <h4>Analysis Details:</h4>
            <ul>
                ${reasons.map(r => `<li>${escapeHtml(r)}</li>`).join('')}
            </ul>
        </div>
        `
        : '';

    resultEl.innerHTML = `
        <div class="result-container">
            <h3>Scan Results</h3>
            <div class="result-status ${getResultClass(result)}">
                <i class="fas ${getResultIcon(result)}"></i>
                ${escapeHtml(getResultLabel(result))}
            </div>
            <div class="result-meta">
                ${url ? `<p><b>Scanned URL:</b> ${url}</p>` : ''}
                <p><b>Risk Level:</b> ${escapeHtml(result || '')}</p>
                ${scanTimeMs === null ? '' : `<p><b>Scan Time:</b> ${scanTimeMs.toFixed(1)} ms</p>`}
            </div>
            <div class="score-bar">
                <div class="score-fill" style="width: ${score}%"></div>
                <span class="score-text">${score}% Risk Score</span>
            </div>
            ${reasonsHtml}
            <button type="button" class="btn-secondary" id="scan-another-btn">
                <i class="fas fa-redo"></i> Scan Another URL
            </button>
        </div>
    `;
}

function renderScanError(resultEl, message) {
    resultEl.innerHTML = `
        <div class="result-container">
            <h3>Scan Results</h3>
            <div class="result-status warning">
                <i class="fas fa-exclamation-triangle"></i>
                ERROR
            </div>
            <div class="result-meta">
                <p>${escapeHtml(message || 'Something went wrong. Please try again.')}</p>
            </div>
            <button type="button" class="btn-secondary" id="scan-another-btn">
                <i class="fas fa-redo"></i> Scan Another URL
            </button>
        </div>
    `;
}

function wireScanAnother(scannerSection, urlInput, resultEl) {
    const btn = document.getElementById('scan-another-btn');
    if (!btn) return;

    btn.onclick = null;
    btn.removeAttribute('onclick');

    btn.addEventListener('click', (e) => {
        e.preventDefault();
        resultEl.innerHTML = '';
        urlInput.value = '';
        urlInput.focus();
        if (scannerSection) {
            scannerSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
}

// URL Scanner (AJAX for smooth UX)
document.addEventListener('DOMContentLoaded', () => {
    const scannerSection = document.getElementById('scanner');
    const scannerForm = document.getElementById('scanner-form') || document.querySelector('.scanner-form');
    const urlInput = document.getElementById('url-input') || (scannerForm ? scannerForm.querySelector('input[name="url"]') : null);
    const resultEl = document.getElementById('scan-result') || document.querySelector('.scanner-container');

    // If server-rendered result exists, jump user to it
    if (document.querySelector('.result-container') && scannerSection && urlInput && resultEl) {
        scannerSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        animateResult();
        wireScanAnother(scannerSection, urlInput, resultEl);
    }

    if (!scannerForm || !urlInput || !resultEl) return;

    // Prefer AJAX submit; keep POST as fallback if fetch fails
    scannerForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const button = scannerForm.querySelector('.scan-btn');
        const originalText = button ? button.innerHTML : '';
        const raw = (urlInput.value || '').trim();
        urlInput.value = raw;

        if (!raw) {
            renderScanError(resultEl, 'Please enter a URL.');
            wireScanAnother(scannerSection, urlInput, resultEl);
            if (scannerSection) scannerSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            animateResult();
            return;
        }

        if (scannerSection) scannerSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

        if (button) {
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Scanning...';
            button.disabled = true;
        }

        try {
            const resp = await fetch('/api/scan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: raw })
            });

            const payload = await resp.json().catch(() => null);
            if (!resp.ok || !payload || payload.success === false) {
                const message = payload && payload.error ? payload.error : 'Unable to scan this URL.';
                renderScanError(resultEl, message);
            } else {
                renderScanResult(resultEl, payload);
            }

            wireScanAnother(scannerSection, urlInput, resultEl);
            animateResult();

            const rendered = resultEl.querySelector('.result-container');
            if (rendered) rendered.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } catch (err) {
            // Fall back to normal POST if fetch fails
            scannerForm.submit();
            return;
        } finally {
            if (button) {
                button.innerHTML = originalText;
                button.disabled = false;
            }
        }
    });
});

// Result Animation
function animateResult() {
    const result = document.querySelector('.result-container');
    if (result) {
        result.style.animation = 'slideInFromBottom 0.5s ease-out';
    }
}

// Call animateResult when result appears
const resultObserver = new MutationObserver(() => {
    animateResult();
});

if (document.querySelector('.scanner-container')) {
    resultObserver.observe(document.querySelector('.scanner-container'), {
        childList: true,
        subtree: true
    });
}

// Parallax Effect for Hero
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroVisual = document.querySelector('.hero-visual');
    if (heroVisual) {
        heroVisual.style.transform = `translateY(${scrolled * 0.2}px)`;
    }
});

// Dynamic Background Gradient
function updateGradient() {
    const hour = new Date().getHours();
    const body = document.body;

    if (hour >= 6 && hour < 12) {
        // Morning
        body.style.background = 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)';
    } else if (hour >= 12 && hour < 18) {
        // Afternoon
        body.style.background = 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)';
    } else {
        // Evening/Night
        body.style.background = 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)';
    }
}

updateGradient();
setInterval(updateGradient, 60000); // Update every minute

// Accessibility Improvements
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    }
});

// Performance Optimization
let scrollTimeout;
window.addEventListener('scroll', () => {
    if (!scrollTimeout) {
        scrollTimeout = setTimeout(() => {
            // Throttled scroll events
            scrollTimeout = null;
        }, 16);
    }
});

// Service Worker Registration (for PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => console.log('SW registered'))
            .catch(error => console.log('SW registration failed'));
    });
}