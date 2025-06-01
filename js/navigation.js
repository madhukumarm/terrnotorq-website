/**
 * Navigation functionality
 * Handles mobile menu toggle and active states
 */

class Navigation {
    constructor() {
        this.navToggle = document.getElementById('nav-toggle');
        this.navMenu = document.getElementById('nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.navbar = document.querySelector('.navbar');
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.setActiveLink();
        this.handleScroll();
    }

    bindEvents() {
        // Mobile menu toggle
        if (this.navToggle) {
            this.navToggle.addEventListener('click', () => this.toggleMobileMenu());
        }

        // Close mobile menu when clicking on links
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => this.closeMobileMenu());
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.navbar.contains(e.target)) {
                this.closeMobileMenu();
            }
        });

        // Handle escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeMobileMenu();
            }
        });

        // Handle scroll for navbar background
        window.addEventListener('scroll', () => this.handleScroll());

        // Handle resize
        window.addEventListener('resize', () => this.handleResize());
    }

    toggleMobileMenu() {
        const isActive = this.navMenu.classList.contains('active');
        
        if (isActive) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    }

    openMobileMenu() {
        this.navMenu.classList.add('active');
        this.navToggle.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Animate bars
        const bars = this.navToggle.querySelectorAll('.bar');
        if (bars.length >= 3) {
            bars[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            bars[1].style.opacity = '0';
            bars[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        }
    }

    closeMobileMenu() {
        this.navMenu.classList.remove('active');
        this.navToggle.classList.remove('active');
        document.body.style.overflow = '';
        
        // Reset bars
        const bars = this.navToggle.querySelectorAll('.bar');
        if (bars.length >= 3) {
            bars[0].style.transform = '';
            bars[1].style.opacity = '';
            bars[2].style.transform = '';
        }
    }

    setActiveLink() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        this.navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            
            if (href === currentPage || 
                (currentPage === '' && href === 'index.html') ||
                (currentPage === 'index.html' && href === 'index.html')) {
                link.classList.add('active');
            }
        });
    }

    handleScroll() {
        const scrolled = window.scrollY > 20;
        
        if (scrolled) {
            this.navbar.style.backgroundColor = 'hsl(var(--surface))';
            this.navbar.style.boxShadow = 'var(--shadow-md)';
        } else {
            this.navbar.style.backgroundColor = 'hsl(var(--surface) / 0.95)';
            this.navbar.style.boxShadow = 'none';
        }
    }

    handleResize() {
        // Close mobile menu on desktop
        if (window.innerWidth >= 768) {
            this.closeMobileMenu();
        }
    }
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Navigation();
    initSmoothScrolling();
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Navigation;
}
