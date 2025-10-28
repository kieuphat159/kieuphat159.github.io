// contact-us.js - JavaScript đơn giản cho trang Contact Us

// ============================================
// 1. FORM VALIDATION & SUBMISSION
// ============================================
function initContactForm() {
    const form = document.querySelector('.modern-contact-form');
    if (!form) return;

    // Validation khi submit
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (!validateForm()) {
            showNotification('error', 'Vui lòng kiểm tra lại thông tin!');
            return;
        }

        const submitBtn = form.querySelector('.modern-submit-btn');
        const originalHTML = submitBtn.innerHTML;
        
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Đang gửi...</span>';
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        showNotification('success', 'Tin nhắn đã được gửi thành công! 🎉');
        form.reset();
        
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalHTML;
    });

    // Real-time validation
    const inputs = form.querySelectorAll('.form-input');
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => {
            if (input.classList.contains('error')) {
                input.classList.remove('error');
            }
        });
    });
}

function validateForm() {
    const requiredFields = document.querySelectorAll('.form-input[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!validateField(field)) isValid = false;
    });
    
    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    field.classList.remove('error', 'success');
    
    if (field.hasAttribute('required') && !value) {
        field.classList.add('error');
        return false;
    }
    
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            field.classList.add('error');
            return false;
        }
    }
    
    if (value) field.classList.add('success');
    return true;
}

// ============================================
// 2. NOTIFICATION SYSTEM
// ============================================
function showNotification(type, message) {
    const existing = document.querySelector('.notification-toast');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = `notification-toast ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    document.body.appendChild(notification);
    setTimeout(() => notification.classList.add('show'), 10);
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// ============================================
// 3. SMOOTH SCROLL
// ============================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

// ============================================
// 4. PARALLAX EFFECT CHO HERO
// ============================================
function initParallax() {
    const hero = document.querySelector('.contact-hero');
    if (!hero) return;
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroContent = hero.querySelector('.contact-hero__content');
        const shapes = hero.querySelectorAll('.shape');
        
        if (heroContent) {
            heroContent.style.transform = `translateY(${scrolled * 0.5}px)`;
            heroContent.style.opacity = Math.max(0, 1 - scrolled / 500);
        }
        
        shapes.forEach((shape, i) => {
            const speed = 0.1 + (i * 0.05);
            shape.style.transform = `translate(${scrolled * speed}px, ${scrolled * speed}px)`;
        });
    });
}

// ============================================
// 5. CARD TILT EFFECT
// ============================================
function initCardEffects() {
    document.querySelectorAll('.contact-card').forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * 5;
            const rotateY = ((centerX - x) / centerX) * 5;
            
            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
}

// ============================================
// 6. FADE-IN ANIMATIONS KHI SCROLL
// ============================================
function initScrollAnimations() {
    const elements = document.querySelectorAll('[data-aos], .contact-card, .faq-item, .contact-feature');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    elements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `all 0.3s ease ${index * 0.1}s`;
        observer.observe(el);
    });
}

// ============================================
// 7. SOCIAL LINKS HOVER ANIMATION
// ============================================
function initSocialAnimations() {
    const socialLinks = document.querySelectorAll('.social-link');
    
    socialLinks.forEach((link, index) => {
        link.style.opacity = '0';
        link.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            link.style.transition = 'all 0.2s ease';
            link.style.opacity = '1';
            link.style.transform = 'translateY(0)';
        }, 2000 + (index * 100));
    });
}

// ============================================
// 8. INPUT FOCUS ANIMATIONS
// ============================================
function initInputAnimations() {
    const inputs = document.querySelectorAll('.form-input');
    
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'scale(1.02)';
            this.parentElement.style.transition = 'transform 0.3s ease';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'scale(1)';
        });
    });
}

// ============================================
// 9. MAIN INITIALIZATION
// ============================================
function initContactPage() {
    console.log('🚀 Initializing Contact Page...');
    
    initContactForm();
    initSmoothScroll();
    initParallax();
    initCardEffects();
    initScrollAnimations();
    initSocialAnimations();
    initInputAnimations();
    
    console.log('✨ Contact Page Ready!');
}

// Execute on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initContactPage);
} else {
    initContactPage();
}
