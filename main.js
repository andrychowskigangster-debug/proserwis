// PRO-SERWIS - Main JavaScript File

class ProSerwisApp {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupMobileMenu();
        this.setupSmoothScrolling();
        this.setupScrollAnimations();
        this.setupContactForm();
        this.setupHeaderEffects();
        this.setupServiceCards();
        this.setupFormValidation();
    }
    
    // Mobile Menu Toggle
    setupMobileMenu() {
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');
        
        if (mobileMenuBtn && mobileMenu) {
            mobileMenuBtn.addEventListener('click', () => {
                mobileMenu.classList.toggle('active');
                const icon = mobileMenuBtn.querySelector('i');
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            });
        }
    }
    
    // Smooth Scrolling
    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    this.closeMobileMenu();
                }
            });
        });
    }
    
    // Close Mobile Menu
    closeMobileMenu() {
        const mobileMenu = document.getElementById('mobile-menu');
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        
        if (mobileMenu && mobileMenuBtn) {
            mobileMenu.classList.remove('active');
            const icon = mobileMenuBtn.querySelector('i');
            icon.classList.add('fa-bars');
            icon.classList.remove('fa-times');
        }
    }
    
    // Scroll Animations
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    
                    // Add stagger animation for service cards
                    if (entry.target.classList.contains('service-card')) {
                        const delay = Array.from(entry.target.parentNode.children).indexOf(entry.target) * 100;
                        entry.target.style.animationDelay = `${delay}ms`;
                    }
                }
            });
        }, observerOptions);
        
        document.querySelectorAll('.fade-in').forEach(el => {
            observer.observe(el);
        });
    }
    
    // Contact Form Handling
    setupContactForm() {
        const contactForm = document.getElementById('contact-form');
        const successMessage = document.getElementById('success-message');
        
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmission(contactForm, successMessage);
            });
        }
    }
    
    // Form Submission
    handleFormSubmission(form, successMessage) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Wysyłanie...';
        submitBtn.disabled = true;
        
        // Simulate form submission
        setTimeout(() => {
            // Show success message
            successMessage.classList.remove('hidden');
            form.reset();
            
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
            // Hide success message after 5 seconds
            setTimeout(() => {
                successMessage.classList.add('hidden');
            }, 5000);
            
            // Scroll to success message
            successMessage.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
        }, 1500);
    }
    
    // Header Effects
    setupHeaderEffects() {
        const header = document.getElementById('header');
        
        if (header) {
            window.addEventListener('scroll', () => {
                if (window.scrollY > 100) {
                    header.style.background = 'rgba(255, 255, 255, 0.98)';
                    header.style.boxShadow = '0 2px 30px rgba(0, 0, 0, 0.15)';
                } else {
                    header.style.background = 'rgba(255, 255, 255, 0.95)';
                    header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
                }
            });
        }
    }
    
    // Service Cards Effects
    setupServiceCards() {
        const serviceCards = document.querySelectorAll('.service-card');
        
        serviceCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-10px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
            });
        });
    }
    
    // Form Validation
    setupFormValidation() {
        const inputs = document.querySelectorAll('.form-input');
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });
            
            input.addEventListener('input', () => {
                if (input.classList.contains('error')) {
                    this.validateField(input);
                }
            });
        });
    }
    
    // Validate Individual Field
    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';
        
        // Required field validation
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'To pole jest wymagane';
        }
        
        // Email validation
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Proszę podać poprawny adres email';
            }
        }
        
        // Phone validation (basic)
        if (field.type === 'tel' && value) {
            const phoneRegex = /^[\+]?[0-9\s\-\(\)]{9,}$/;
            if (!phoneRegex.test(value)) {
                isValid = false;
                errorMessage = 'Proszę podać poprawny numer telefonu';
            }
        }
        
        // Update field appearance
        if (isValid) {
            field.classList.remove('error');
            field.classList.add('valid');
            this.removeErrorMessage(field);
        } else {
            field.classList.remove('valid');
            field.classList.add('error');
            this.showErrorMessage(field, errorMessage);
        }
        
        return isValid;
    }
    
    // Show Error Message
    showErrorMessage(field, message) {
        this.removeErrorMessage(field);
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message text-red-500 text-sm mt-1';
        errorDiv.textContent = message;
        
        field.parentNode.appendChild(errorDiv);
    }
    
    // Remove Error Message
    removeErrorMessage(field) {
        const existingError = field.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
    }
    
    // Utility: Debounce
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ProSerwisApp();
});

// Additional utility functions
const Utils = {
    // Smooth scroll to element
    scrollTo(element, offset = 0) {
        const targetPosition = element.offsetTop - offset;
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    },
    
    // Format phone number
    formatPhoneNumber(phoneNumber) {
        const cleaned = phoneNumber.replace(/\D/g, '');
        const match = cleaned.match(/^(\d{3})(\d{3})(\d{3})$/);
        if (match) {
            return match[1] + ' ' + match[2] + ' ' + match[3];
        }
        return phoneNumber;
    },
    
    // Show notification
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type} fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50`;
        notification.innerHTML = `
            <div class="flex items-center">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'} mr-2"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('opacity-0');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
};

// Export for use in other scripts
window.ProSerwisApp = ProSerwisApp;
window.Utils = Utils;