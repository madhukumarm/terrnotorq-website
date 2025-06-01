/**
 * Main application functionality
 * Handles interactions, animations, and general page behavior
 */

class App {
    constructor() {
        this.init();
    }

    init() {
        this.initProductFiltering();
        this.initContactForm();
        this.initScrollAnimations();
        this.initLazyLoading();
        this.initTooltips();
    }

    /**
     * Product filtering functionality for products page
     */
    initProductFiltering() {
        const categoryButtons = document.querySelectorAll('.category-btn');
        const productCards = document.querySelectorAll('.product-card');

        if (categoryButtons.length === 0) return;

        categoryButtons.forEach(button => {
            button.addEventListener('click', () => {
                const category = button.getAttribute('data-category');
                
                // Update active button
                categoryButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Filter products
                this.filterProducts(productCards, category);
            });
        });
    }

    filterProducts(productCards, category) {
        productCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');
            const shouldShow = category === 'all' || cardCategory === category;
            
            if (shouldShow) {
                card.style.display = 'block';
                card.classList.add('fade-in');
                setTimeout(() => card.classList.remove('fade-in'), 500);
            } else {
                card.style.display = 'none';
            }
        });
    }

    /**
     * Enhanced contact form handling
     */
    initContactForm() {
        const contactForm = document.getElementById('contact-form');
        
        if (!contactForm) return;

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmission(contactForm);
        });

        // Real-time validation
        const inputs = contactForm.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    }

    async handleFormSubmission(form) {
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        // Validate all fields
        const isValid = this.validateForm(form);
        if (!isValid) return;

        // Show loading state
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;
        submitButton.classList.add('loading');

        try {
            // Simulate API call (replace with actual endpoint)
            await this.simulateFormSubmission(new FormData(form));
            
            // Show success message
            this.showNotification('Thank you for your message! We\'ll get back to you soon.', 'success');
            form.reset();
            
        } catch (error) {
            // Show error message
            this.showNotification('Sorry, there was an error sending your message. Please try again.', 'error');
            console.error('Form submission error:', error);
        } finally {
            // Reset button state
            submitButton.textContent = originalText;
            submitButton.disabled = false;
            submitButton.classList.remove('loading');
        }
    }

    validateForm(form) {
        const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        return isValid;
    }

    validateField(field) {
        const value = field.value.trim();
        const fieldType = field.type;
        let isValid = true;
        let errorMessage = '';

        // Check if required field is empty
        if (field.hasAttribute('required') && !value) {
            errorMessage = 'This field is required';
            isValid = false;
        }
        // Email validation
        else if (fieldType === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                errorMessage = 'Please enter a valid email address';
                isValid = false;
            }
        }
        // Phone validation (basic)
        else if (fieldType === 'tel' && value) {
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
                errorMessage = 'Please enter a valid phone number';
                isValid = false;
            }
        }

        this.setFieldError(field, errorMessage);
        return isValid;
    }

    setFieldError(field, message) {
        this.clearFieldError(field);
        
        if (message) {
            field.classList.add('error');
            const errorDiv = document.createElement('div');
            errorDiv.className = 'field-error';
            errorDiv.textContent = message;
            field.parentNode.appendChild(errorDiv);
        }
    }

    clearFieldError(field) {
        field.classList.remove('error');
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
    }

    simulateFormSubmission(formData) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate success/failure (90% success rate)
                if (Math.random() > 0.1) {
                    resolve({ success: true });
                } else {
                    reject(new Error('Simulated server error'));
                }
            }, 1500);
        });
    }

    /**
     * Scroll animations using Intersection Observer
     */
    initScrollAnimations() {
        const animatedElements = document.querySelectorAll(
            '.feature-card, .product-card, .service-card, .process-step'
        );

        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('fade-in');
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '50px'
            });

            animatedElements.forEach(el => {
                observer.observe(el);
            });
        }
    }

    /**
     * Lazy loading for images and heavy content
     */
    initLazyLoading() {
        const lazyElements = document.querySelectorAll('[data-lazy]');

        if ('IntersectionObserver' in window) {
            const lazyObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const element = entry.target;
                        const src = element.getAttribute('data-lazy');
                        
                        if (element.tagName === 'IMG') {
                            element.src = src;
                        } else {
                            element.style.backgroundImage = `url(${src})`;
                        }
                        
                        element.removeAttribute('data-lazy');
                        lazyObserver.unobserve(element);
                    }
                });
            });

            lazyElements.forEach(el => {
                lazyObserver.observe(el);
            });
        }
    }

    /**
     * Simple tooltip functionality
     */
    initTooltips() {
        const tooltipElements = document.querySelectorAll('[data-tooltip]');
        
        tooltipElements.forEach(element => {
            element.addEventListener('mouseenter', (e) => {
                this.showTooltip(e.target);
            });
            
            element.addEventListener('mouseleave', () => {
                this.hideTooltip();
            });
        });
    }

    showTooltip(element) {
        const text = element.getAttribute('data-tooltip');
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = text;
        
        document.body.appendChild(tooltip);
        
        const rect = element.getBoundingClientRect();
        tooltip.style.left = rect.left + rect.width / 2 - tooltip.offsetWidth / 2 + 'px';
        tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
        
        requestAnimationFrame(() => {
            tooltip.classList.add('visible');
        });
    }

    hideTooltip() {
        const tooltip = document.querySelector('.tooltip');
        if (tooltip) {
            tooltip.remove();
        }
    }

    /**
     * Show notification messages
     */
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.remove()">×</button>
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        requestAnimationFrame(() => {
            notification.classList.add('show');
        });
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.classList.remove('show');
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }

    /**
     * Utility function to throttle function calls
     */
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    /**
     * Utility function to debounce function calls
     */
    debounce(func, wait, immediate) {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }
}

// CSS for notifications and tooltips
const additionalStyles = `
/* Field Errors */
.form-input.error,
.form-textarea.error,
.form-select.error {
    border-color: hsl(var(--error));
}

.field-error {
    color: hsl(var(--error));
    font-size: var(--font-size-sm);
    margin-top: var(--spacing-xs);
}

/* Notifications */
.notification {
    position: fixed;
    top: 20px;
    right: 20px;
    background: white;
    border-radius: var(--border-radius);
    box-shadow: var(--shadow-xl);
    padding: var(--spacing-lg);
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    z-index: 10000;
    transform: translateX(100%);
    transition: transform var(--transition-normal);
    max-width: 400px;
}

.notification.show {
    transform: translateX(0);
}

.notification-success {
    border-left: 4px solid hsl(var(--success));
}

.notification-error {
    border-left: 4px solid hsl(var(--error));
}

.notification-info {
    border-left: 4px solid hsl(var(--primary-color));
}

.notification-close {
    background: none;
    border: none;
    font-size: var(--font-size-xl);
    cursor: pointer;
    color: hsl(var(--text-muted));
    margin-left: auto;
}

.notification-close:hover {
    color: hsl(var(--text-primary));
}

/* Tooltips */
.tooltip {
    position: absolute;
    background: hsl(var(--text-primary));
    color: white;
    padding: var(--spacing-sm) var(--spacing-md);
    border-radius: var(--border-radius-sm);
    font-size: var(--font-size-sm);
    z-index: 10000;
    opacity: 0;
    transition: opacity var(--transition-fast);
    pointer-events: none;
    white-space: nowrap;
}

.tooltip.visible {
    opacity: 1;
}

.tooltip::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -5px;
    border: 5px solid transparent;
    border-top-color: hsl(var(--text-primary));
}

/* Loading button state */
.btn.loading {
    position: relative;
    color: transparent;
}

.btn.loading::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 16px;
    height: 16px;
    margin: -8px 0 0 -8px;
    border: 2px solid transparent;
    border-top-color: currentColor;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    color: white;
}
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new App();
});

// Handle page visibility changes for performance
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause expensive operations when tab is hidden
        console.log('Page hidden - pausing operations');
    } else {
        // Resume operations when tab is visible
        console.log('Page visible - resuming operations');
    }
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = App;
}
