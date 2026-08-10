// Language Switcher Functionality
let currentLang = 'vi'; // Default to Vietnamese

// Initialize language on page load
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Loaded - Initializing language switcher...');
    
    // Get saved language or default to Vietnamese
    const savedLang = localStorage.getItem('champasenLang') || 'vi';
    console.log('Saved language:', savedLang);
    
    setLanguage(savedLang);
    
    // Add event listeners to language buttons
    const langViBtn = document.getElementById('lang-vi');
    const langEnBtn = document.getElementById('lang-en');
    
    if (langViBtn) {
        langViBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('VI button clicked');
            setLanguage('vi');
        });
    } else {
        console.error('VI button not found!');
    }
    
    if (langEnBtn) {
        langEnBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('EN button clicked');
            setLanguage('en');
        });
    } else {
        console.error('EN button not found!');
    }
    
    console.log('Language switcher initialized!');
});

// Set language function
function setLanguage(lang) {
    console.log('Setting language to:', lang);
    currentLang = lang;
    
    // Update button states
    const langViBtn = document.getElementById('lang-vi');
    const langEnBtn = document.getElementById('lang-en');
    
    if (langViBtn && langEnBtn) {
        if (lang === 'vi') {
            langViBtn.classList.add('active');
            langEnBtn.classList.remove('active');
        } else {
            langViBtn.classList.remove('active');
            langEnBtn.classList.add('active');
        }
    }
    
    // Get all translatable elements
    const translatableElements = document.querySelectorAll('[data-en][data-vi]');
    console.log('Found translatable elements:', translatableElements.length);
    
    // Update all translatable elements
    translatableElements.forEach(function(element) {
        const text = element.getAttribute('data-' + lang);
        if (text) {
            // Handle HTML content (like icons)
            if (text.includes('<i class=')) {
                element.innerHTML = text;
            } else {
                element.textContent = text;
            }
        }
    });
    
    // Update page title
    if (lang === 'vi') {
        document.title = 'Champasen Viet Nam - Thức Ăn Chăn Nuối & Vận Chuyển';
        document.documentElement.lang = 'vi';
    } else {
        document.title = 'Champasen Viet Nam - Animal Feed & Logistics';
        document.documentElement.lang = 'en';
    }
    
    // Save preference
    localStorage.setItem('champasenLang', lang);
    
    console.log('Language changed to:', lang);
}

// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
}

// Close mobile menu when clicking on a nav link
document.querySelectorAll('.nav-menu li a').forEach(function(link) {
    link.addEventListener('click', function() {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const headerOffset = 80;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Header Scroll Effect
const header = document.querySelector('.header');

window.addEventListener('scroll', function() {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)';
    } else {
        header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    }
});

// Contact Form Handler
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate form
        if (!validateForm(contactForm)) {
            const errorMsg = currentLang === 'vi' 
                ? 'Vui lòng điền đầy đủ thông tin bắt buộc' 
                : 'Please fill in all required fields';
            alert(errorMsg);
            return;
        }
        
        // Show success message
        const successMsg = currentLang === 'vi' 
            ? 'Cảm ơn bạn! Chúng tôi sẽ liên hệ lại sớm.' 
            : 'Thank you! We will get back to you soon.';
        
        alert(successMsg);
        contactForm.reset();
    });
}

// Form Validation
function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(function(input) {
        if (!input.value.trim()) {
            input.style.borderColor = '#DA251D';
            isValid = false;
        } else {
            input.style.borderColor = '#E0E0E0';
        }
    });
    
    return isValid;
}

// Add real-time validation
document.querySelectorAll('input[required], textarea[required]').forEach(function(input) {
    input.addEventListener('blur', function() {
        if (!this.value.trim()) {
            this.style.borderColor = '#DA251D';
        } else {
            this.style.borderColor = '#E0E0E0';
        }
    });
    
    input.addEventListener('input', function() {
        if (this.value.trim()) {
            this.style.borderColor = '#E0E0E0';
        }
    });
});

// Intersection Observer for Animation on Scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all feature cards, service cards, and stat items
document.querySelectorAll('.feature-card, .service-card, .stat-item').forEach(function(el) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Animate Statistics on Scroll
function animateStats() {
    const stats = document.querySelectorAll('.stat-number');
    
    stats.forEach(function(stat) {
        const target = stat.textContent;
        const numericValue = parseInt(target.replace(/[^0-9]/g, ''));
        const suffix = target.replace(/[0-9]/g, '');
        
        if (numericValue && numericValue < 1000) {
            let current = 0;
            const increment = numericValue / 50;
            const timer = setInterval(function() {
                current += increment;
                if (current >= numericValue) {
                    current = numericValue;
                    clearInterval(timer);
                }
                stat.textContent = Math.floor(current) + suffix;
            }, 30);
        }
    });
}

// Trigger stats animation when visible
const statsObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
        if (entry.isIntersecting) {
            animateStats();
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.stats');
if (statsSection) {
    statsObserver.observe(statsSection);
}

// Active Navigation Link Highlight
window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu li a');
    
    let current = '';
    
    sections.forEach(function(section) {
        const sectionTop = section.offsetTop;
        if (window.scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(function(link) {
        link.style.color = '';
        if (link.getAttribute('href') === '#' + current) {
            link.style.color = '#00A651';
        }
    });
});

// Sticky Header Enhancement
let scrollTimeout;
window.addEventListener('scroll', function() {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(function() {
        if (window.scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
        } else {
            header.style.background = '#FFFFFF';
        }
    }, 100);
});

// Add keyboard shortcut for language switch (Alt + L)
document.addEventListener('keydown', function(e) {
    if (e.altKey && e.key === 'l') {
        const newLang = currentLang === 'vi' ? 'en' : 'vi';
        setLanguage(newLang);
    }
});

console.log('Champasen Viet Nam Website Loaded Successfully! 🇻🇳');