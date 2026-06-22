// ── Fix back-navigation scroll glitch ─────────────────────────────────────
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

document.addEventListener('DOMContentLoaded', () => {
    if (location.hash) {
        const target = document.querySelector(location.hash);
        if (target) target.scrollIntoView({ behavior: 'instant', block: 'start' });
        requestAnimationFrame(() => {
            document.documentElement.style.transition = 'opacity 0.2s ease';
            document.documentElement.style.opacity = '1';
        });
    }
});

// Theme toggle functionality
const themeToggle = document.getElementById('theme-toggle');
const html = document.documentElement;

localStorage.removeItem('theme');
html.classList.remove('dark');

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        html.classList.toggle('dark');
        const newTheme = html.classList.contains('dark') ? 'dark' : 'light';
        localStorage.setItem('theme', newTheme);
    });
}

// Featured Projects Slider functionality
function initializeSlider() {
    const slider = document.getElementById('projectsSlider');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const prevBtnMobile = document.getElementById('prevBtnMobile');
    const nextBtnMobile = document.getElementById('nextBtnMobile');

    if (!slider) {
        return;
    }

    let currentIndex = 0;
    const totalCards = slider.children.length;
    let cardWidth = window.innerWidth < 640 ? 320 : window.innerWidth < 768 ? 320 : 320;
    let gap = window.innerWidth < 640 ? 16 : 24;

    function getCardsPerView() {
        if (window.innerWidth >= 1024) {
            return 3;
        } else if (window.innerWidth >= 640) {
            return 2;
        } else {
            return 1;
        }
    }

    let cardsPerView = getCardsPerView();
    let maxIndex = Math.max(0, totalCards - cardsPerView);

    // Restore slider position from sessionStorage
    const lastProjectIndex = sessionStorage.getItem('lastProjectIndex');
    if (lastProjectIndex !== null) {
        const restoredIndex = Math.max(0, Math.min(parseInt(lastProjectIndex, 10), maxIndex));
        if (!isNaN(restoredIndex)) {
            currentIndex = restoredIndex;
        }
        sessionStorage.removeItem('lastProjectIndex');
    }

    function updateSlider() {
        let translateX;

        if (window.innerWidth < 640) {
            translateX = -(currentIndex * (cardWidth + gap));
            slider.style.transform = `translateX(${translateX}px)`;
        } else if (window.innerWidth < 1024) {
            translateX = -(currentIndex * (cardWidth + gap));
            slider.style.transform = `translateX(${translateX}px)`;
        } else {
            translateX = -(currentIndex * (cardWidth + gap));
            slider.style.transform = `translateX(${translateX}px)`;
        }

        const isPrevDisabled = currentIndex <= 0;
        const isNextDisabled = currentIndex >= maxIndex;

        if (prevBtn) {
            prevBtn.disabled = isPrevDisabled;
            prevBtn.classList.toggle('opacity-50', isPrevDisabled);
            prevBtn.classList.toggle('cursor-not-allowed', isPrevDisabled);
        }

        if (nextBtn) {
            nextBtn.disabled = isNextDisabled;
            nextBtn.classList.toggle('opacity-50', isNextDisabled);
            nextBtn.classList.toggle('cursor-not-allowed', isNextDisabled);
        }

        if (prevBtnMobile) {
            prevBtnMobile.disabled = isPrevDisabled;
            prevBtnMobile.classList.toggle('opacity-50', isPrevDisabled);
            prevBtnMobile.classList.toggle('cursor-not-allowed', isPrevDisabled);
        }

        if (nextBtnMobile) {
            nextBtnMobile.disabled = isNextDisabled;
            nextBtnMobile.classList.toggle('opacity-50', isNextDisabled);
            nextBtnMobile.classList.toggle('cursor-not-allowed', isNextDisabled);
        }
    }

    function handleResize() {
        const newCardsPerView = getCardsPerView();
        const newCardWidth = window.innerWidth < 640 ? 320 : window.innerWidth < 768 ? 320 : 320;
        const newGap = window.innerWidth < 640 ? 16 : 24;

        if (newCardsPerView !== cardsPerView || newCardWidth !== cardWidth || newGap !== gap) {
            cardsPerView = newCardsPerView;
            cardWidth = newCardWidth;
            gap = newGap;
            maxIndex = Math.max(0, totalCards - cardsPerView);

            if (currentIndex > maxIndex) {
                currentIndex = maxIndex;
            }

            updateSlider();
        }
    }

    function goToPrevious() {
        if (currentIndex > 0) {
            currentIndex--;
            updateSlider();
        }
    }

    function goToNext() {
        if (currentIndex < maxIndex) {
            currentIndex++;
            updateSlider();
        }
    }

    function addEventListeners() {
        if (prevBtn) prevBtn.addEventListener('click', goToPrevious);
        if (nextBtn) nextBtn.addEventListener('click', goToNext);
        if (prevBtnMobile) prevBtnMobile.addEventListener('click', goToPrevious);
        if (nextBtnMobile) nextBtnMobile.addEventListener('click', goToNext);

        document.addEventListener('keydown', (e) => {
            const isFormInput = document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA';
            if (isFormInput) return;

            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                goToPrevious();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                goToNext();
            }
        });

        let startX = 0;
        let endX = 0;

        slider.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });

        slider.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            const diff = startX - endX;
            const threshold = 50;

            if (Math.abs(diff) > threshold) {
                if (diff > 0) {
                    goToNext();
                } else {
                    goToPrevious();
                }
            }
        });

        window.addEventListener('resize', handleResize);

        // Capture clicked card index when "View Project" link is clicked
        Array.from(slider.children).forEach((card, index) => {
            const viewLink = card.querySelector('a[href^="project-"]');
            if (viewLink) {
                viewLink.addEventListener('click', () => {
                    sessionStorage.setItem('lastProjectIndex', index);
                });
            }
        });
    }

    addEventListeners();
    updateSlider();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeSlider);
} else {
    initializeSlider();
}

function testButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const prevBtnMobile = document.getElementById('prevBtnMobile');
    const nextBtnMobile = document.getElementById('nextBtnMobile');

    if (prevBtn) {
        prevBtn.onclick = function() {
            const slider = document.getElementById('projectsSlider');
            if (slider) {
                const currentTransform = slider.style.transform || 'translateX(0px)';
                const currentX = parseInt(currentTransform.match(/-?\d+/)?.[0] || 0);
                const cardWidth = window.innerWidth < 640 ? 256 : window.innerWidth < 768 ? 288 : 320;
                const newX = Math.min(0, currentX + (cardWidth + 24));
                slider.style.transform = `translateX(${newX}px)`;
            }
        };
    }

    if (nextBtn) {
        nextBtn.onclick = function() {
            const slider = document.getElementById('projectsSlider');
            if (slider) {
                const currentTransform = slider.style.transform || 'translateX(0px)';
                const currentX = parseInt(currentTransform.match(/-?\d+/)?.[0] || 0);
                const cardWidth = window.innerWidth < 640 ? 256 : window.innerWidth < 768 ? 288 : 320;
                let maxX;
                if (window.innerWidth < 640) {
                    maxX = -(5 * (cardWidth + 24));
                } else if (window.innerWidth < 1024) {
                    maxX = -(4 * (cardWidth + 24));
                } else {
                    maxX = -(3 * (cardWidth + 24));
                }
                const newX = Math.max(maxX, currentX - (cardWidth + 24));
                slider.style.transform = `translateX(${newX}px)`;
            }
        };
    }

    if (prevBtnMobile) {
        prevBtnMobile.onclick = function() {
            const slider = document.getElementById('projectsSlider');
            if (slider) {
                const currentTransform = slider.style.transform || 'translateX(0px)';
                const currentX = parseInt(currentTransform.match(/-?\d+/)?.[0] || 0);
                const cardWidth = window.innerWidth < 640 ? 256 : window.innerWidth < 768 ? 288 : 320;
                const newX = Math.min(0, currentX + (cardWidth + 24));
                slider.style.transform = `translateX(${newX}px)`;
            }
        };
    }

    if (nextBtnMobile) {
        nextBtnMobile.onclick = function() {
            const slider = document.getElementById('projectsSlider');
            if (slider) {
                const currentTransform = slider.style.transform || 'translateX(0px)';
                const currentX = parseInt(currentTransform.match(/-?\d+/)?.[0] || 0);
                const cardWidth = window.innerWidth < 640 ? 256 : window.innerWidth < 768 ? 288 : 320;
                let maxX;
                if (window.innerWidth < 640) {
                    maxX = -(5 * (cardWidth + 24));
                } else if (window.innerWidth < 1024) {
                    maxX = -(4 * (cardWidth + 24));
                } else {
                    maxX = -(3 * (cardWidth + 24));
                }
                const newX = Math.max(maxX, currentX - (cardWidth + 24));
                slider.style.transform = `translateX(${newX}px)`;
            }
        };
    }
}

testButtons();

// Smooth scrolling for navigation links
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

// Add scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
        }
    });
}, observerOptions);

document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});

const style = document.createElement('style');
style.textContent = `
    .animate-fade-in {
        animation: fadeIn 0.8s ease-out forwards;
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .animate-fade-in {
        opacity: 0;
        transform: translateY(30px);
    }
`;
document.head.appendChild(style);

// ── Typewriter role cycling ────────────────────────────────────────────────
function initTypewriter() {
    const el = document.getElementById('typewriter');
    if (!el) return;
    const roles = ['Frontend Developer', 'Product Manager', 'UI/UX Enthusiast', 'Problem Solver', 'AI Product Engineer', 'AI/ML Enthusiast'];
    let roleIndex = 0, charIndex = 0, isDeleting = false;

    function tick() {
        const current = roles[roleIndex];
        el.textContent = isDeleting
            ? current.substring(0, charIndex - 1)
            : current.substring(0, charIndex + 1);
        charIndex += isDeleting ? -1 : 1;

        if (!isDeleting && charIndex === current.length) {
            setTimeout(() => { isDeleting = true; tick(); }, 2000);
            return;
        }
        if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
        }
        setTimeout(tick, isDeleting ? 55 : 95);
    }
    setTimeout(tick, 1600);
}
initTypewriter();

// ── Cursor spotlight on hero ───────────────────────────────────────────────
const heroSection = document.getElementById('home');
if (heroSection) {
    heroSection.addEventListener('mousemove', (e) => {
        const r = heroSection.getBoundingClientRect();
        heroSection.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
        heroSection.style.setProperty('--my', ((e.clientY - r.top)  / r.height * 100) + '%');
    });
}

// ── Scroll-reveal for section content ─────────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('section').forEach(section => {
    if (section.id === 'home') return;
    const children = Array.from(section.querySelectorAll(
        'h2, h3, p, .grid > *, ul, .space-y-6 > *, article, .card'
    ));
    children.forEach((el, i) => {
        el.classList.add('reveal');
        const delayClass = ['reveal-d1','reveal-d2','reveal-d3','reveal-d4'][Math.min(i, 3)];
        el.classList.add(delayClass);
        revealObserver.observe(el);
    });
});

// ── Email.js Contact Form Setup ────────────────────────────────────────────
let emailJSRetries = 0;
function initializeEmailJS() {
    if (typeof emailjs === 'undefined') {
        emailJSRetries++;
        if (emailJSRetries > 20) {
            return;
        }
        setTimeout(initializeEmailJS, 500);
        return;
    }

    emailjs.init('mNrwcxEyqKtbIj461');

    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');

    if (contactForm && submitBtn) {
        contactForm.onsubmit = function(e) {
            e.preventDefault();
            e.stopPropagation();

            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            emailjs.sendForm('service_b1sc25p', 'template_35cikc4', contactForm)
                .then((response) => {
                    submitBtn.textContent = '✓ Message Sent!';
                    submitBtn.style.backgroundColor = '#16a34a';
                    submitBtn.style.color = '#ffffff';
                    submitBtn.disabled = true;
                    contactForm.reset();

                    setTimeout(() => {
                        submitBtn.textContent = originalText;
                        submitBtn.style.backgroundColor = '';
                        submitBtn.style.color = '';
                        submitBtn.disabled = false;
                    }, 3000);
                })
                .catch((error) => {
                    submitBtn.textContent = '✗ Failed - Try Again';
                    submitBtn.style.backgroundColor = '#dc2626';
                    submitBtn.disabled = false;

                    setTimeout(() => {
                        submitBtn.textContent = originalText;
                        submitBtn.style.backgroundColor = '';
                    }, 4000);
                });

            return false;
        };
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeEmailJS);
} else {
    initializeEmailJS();
}
