// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
}

// Close mobile menu when clicking on a nav link
document.querySelectorAll('.nav-menu li a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
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
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)';
    } else {
        header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    }
    
    lastScroll = currentScroll;
});

// Tracking Form Handler
const trackingForm = document.getElementById('trackingForm');
const trackingResult = document.getElementById('trackingResult');
const awbNumber = document.getElementById('awbNumber');

if (trackingForm) {
    trackingForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const awbValue = awbNumber.value.trim();
        
        if (!awbValue) {
            alert('Please enter an AWB number');
            return;
        }
        
        // Simulate tracking API call
        // Replace this with actual API endpoint
        simulateTracking(awbValue);
    });
}

// Simulate Tracking Function (Replace with actual API)
function simulateTracking(awbNumber) {
    // Show loading state
    trackingResult.style.display = 'block';
    trackingResult.innerHTML = `
        <div style="text-align: center; padding: 20px;">
            <i class="fas fa-spinner fa-spin" style="font-size: 40px; color: #FF6B00;"></i>
            <p style="margin-top: 15px; color: #666;">Tracking your shipment...</p>
        </div>
    `;
    
    // Simulate API delay
    setTimeout(() => {
        // Mock tracking data
        const mockData = {
            status: 'In Transit',
            origin: 'Dubai, UAE',
            destination: 'Mumbai, India',
            estimatedDelivery: '2-3 Business Days',
            updates: [
                { date: '2026-08-06 09:30', location: 'Dubai Hub', status: 'Departed from origin facility' },
                { date: '2026-08-05 18:45', location: 'Dubai, UAE', status: 'Shipment picked up' },
                { date: '2026-08-05 14:20', location: 'Dubai, UAE', status: 'Order processed' }
            ]
        };
        
        displayTrackingResult(awbNumber, mockData);
    }, 1500);
}

// Display Tracking Result
function displayTrackingResult(awb, data) {
    const updatesHTML = data.updates.map(update => `
        <div style="display: flex; gap: 15px; padding: 15px; border-bottom: 1px solid #E0E0E0;">
            <div style="min-width: 150px;">
                <div style="font-weight: 600; color: #333;">${update.date}</div>
                <div style="font-size: 13px; color: #666;">${update.location}</div>
            </div>
            <div style="flex: 1;">
                <div style="color: #333;">${update.status}</div>
            </div>
        </div>
    `).join('');
    
    trackingResult.innerHTML = `
        <div style="background: #F8F9FA; padding: 25px; border-radius: 10px;">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 25px;">
                <div>
                    <div style="font-size: 13px; color: #666; margin-bottom: 5px;">AWB Number</div>
                    <div style="font-weight: 600; color: #333; font-size: 18px;">${awb}</div>
                </div>
                <div>
                    <div style="font-size: 13px; color: #666; margin-bottom: 5px;">Status</div>
                    <div style="font-weight: 600; color: #FF6B00; font-size: 18px;">${data.status}</div>
                </div>
                <div>
                    <div style="font-size: 13px; color: #666; margin-bottom: 5px;">Route</div>
                    <div style="font-weight: 600; color: #333; font-size: 18px;">${data.origin} → ${data.destination}</div>
                </div>
                <div>
                    <div style="font-size: 13px; color: #666; margin-bottom: 5px;">Est. Delivery</div>
                    <div style="font-weight: 600; color: #333; font-size: 18px;">${data.estimatedDelivery}</div>
                </div>
            </div>
            
            <h4 style="margin-bottom: 15px; color: #333;">Shipment History</h4>
            <div style="border: 1px solid #E0E0E0; border-radius: 8px; overflow: hidden;">
                ${updatesHTML}
            </div>
        </div>
    `;
}

// Contact Form Handler
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData.entries());
        
        // Simulate form submission
        // Replace with actual API endpoint
        alert('Thank you for your message! We will get back to you soon.');
        contactForm.reset();
    });
}

// Intersection Observer for Animation on Scroll
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

// Observe all feature cards, service cards, and blog cards
document.querySelectorAll('.feature-card, .service-card, .blog-card, .stat-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Sticky Header Enhancement
let scrollTimeout;
window.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
        const header = document.querySelector('.header');
        if (window.scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
        } else {
            header.style.background = '#FFFFFF';
        }
    }, 100);
});

// Animate Statistics on Scroll
function animateStats() {
    const stats = document.querySelectorAll('.stat-number');
    
    stats.forEach(stat => {
        const target = stat.textContent;
        const numericValue = parseInt(target.replace(/[^0-9]/g, ''));
        const suffix = target.replace(/[0-9]/g, '');
        
        if (numericValue) {
            let current = 0;
            const increment = numericValue / 50;
            const timer = setInterval(() => {
                current += increment;
                if (current >= numericValue) {
                    current = numericValue;
                    clearInterval(timer);
                }
                stat.textContent = Math.floor(current).toLocaleString() + suffix;
            }, 30);
        }
    });
}

// Trigger stats animation when visible
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
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
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu li a');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.style.color = '';
        if (link.getAttribute('href') === `#${current}`) {
            link.style.color = '#FF6B00';
        }
    });
});

// Form Validation Enhancement
function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.style.borderColor = '#FF0000';
            isValid = false;
        } else {
            input.style.borderColor = '#E0E0E0';
        }
    });
    
    return isValid;
}

// Add real-time validation
document.querySelectorAll('input[required], textarea[required]').forEach(input => {
    input.addEventListener('blur', function() {
        if (!this.value.trim()) {
            this.style.borderColor = '#FF0000';
        } else {
            this.style.borderColor = '#E0E0E0';
        }
    });
});

console.log('ABC Cargo Website Loaded Successfully! 🚀');