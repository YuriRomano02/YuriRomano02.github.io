document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initScrollAnimations();
    initSkillBars();
    initTypewriter();
    initMobileMenu();
});

function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                updateActiveNavLink(this);
            }
        });
    });
    
    window.addEventListener('scroll', throttle(updateNavigationOnScroll, 100));
}

function updateActiveNavLink(activeLink) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => link.classList.remove('active'));
    activeLink.classList.add('active');
}

function updateNavigationOnScroll() {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-link');
    const scrollPosition = window.scrollY + 100;
    
    sections.forEach((section, index) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            const activeLink = document.querySelector(`[href="#${sectionId}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
    });
}

function initScrollAnimations() {
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(26, 26, 26, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.3)';
        } else {
            navbar.style.background = 'rgba(26, 26, 26, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                if (entry.target.id === 'resume') {
                    animateSkillBars();
                }
                
                if (entry.target.id === 'home') {
                    startTypewriter();
                }
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.section').forEach(section => {
        observer.observe(section);
    });
    
    addAnimationStyles();
}

function initSkillBars() {
    const skillFills = document.querySelectorAll('.skill-fill');
    skillFills.forEach(fill => {
        const targetWidth = fill.dataset.width;
        fill.dataset.targetWidth = targetWidth + '%';
        fill.style.width = '0%';
    });
}

function animateSkillBars() {
    const skillFills = document.querySelectorAll('.skill-fill');
    
    skillFills.forEach((fill, index) => {
        setTimeout(() => {
            const targetWidth = fill.dataset.targetWidth;
            fill.style.width = targetWidth;
        }, index * 200); 
    });
}

function initTypewriter() {
    const codeLines = document.querySelectorAll('.code-line');
    codeLines.forEach(line => {
        line.style.opacity = '0';
        line.style.transform = 'translateX(-20px)';
    });
}

function startTypewriter() {
    const codeLines = document.querySelectorAll('.code-line');
    
    codeLines.forEach((line, index) => {
        setTimeout(() => {
            line.style.transition = 'all 0.5s ease';
            line.style.opacity = '1';
            line.style.transform = 'translateX(0)';
        }, index * 300);
    });
}

function initMobileMenu() {
    const navContainer = document.querySelector('.nav-container');
    const mobileMenuBtn = document.createElement('button');
    mobileMenuBtn.className = 'mobile-menu-btn';
    mobileMenuBtn.innerHTML = `
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
    `;
    
    addMobileMenuStyles();
    
    navContainer.appendChild(mobileMenuBtn);
    
    const navMenu = document.querySelector('.nav-menu');
    let isMenuOpen = false;
    
    mobileMenuBtn.addEventListener('click', () => {
        isMenuOpen = !isMenuOpen;
        mobileMenuBtn.classList.toggle('active');
        navMenu.classList.toggle('mobile-active');
        document.body.classList.toggle('menu-open');
    });
    
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            isMenuOpen = false;
            mobileMenuBtn.classList.remove('active');
            navMenu.classList.remove('mobile-active');
            document.body.classList.remove('menu-open');
        });
    });
    
    document.addEventListener('click', (e) => {
        if (isMenuOpen && !navContainer.contains(e.target)) {
            isMenuOpen = false;
            mobileMenuBtn.classList.remove('active');
            navMenu.classList.remove('mobile-active');
            document.body.classList.remove('menu-open');
        }
    });
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

function addAnimationStyles() {
    const styles = `
        .section {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.8s ease;
        }
        
        .section.animate-in {
            opacity: 1;
            transform: translateY(0);
        }
        
        .skill-fill {
            transition: width 1.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        @media (max-width: 1024px) {
            .nav-menu {
                position: fixed;
                top: 70px;
                left: 0;
                width: 100%;
                background: rgba(26, 26, 26, 0.98);
                backdrop-filter: blur(20px);
                flex-direction: column;
                padding: 2rem 0;
                transform: translateY(-100%);
                opacity: 0;
                transition: all 0.3s ease;
                border-bottom: 1px solid var(--border-color);
            }
            
            .nav-menu.mobile-active {
                transform: translateY(0);
                opacity: 1;
            }
            
            .nav-menu li {
                margin: 0.5rem 0;
            }
            
            .nav-link {
                font-size: 1.1rem;
                padding: 0.5rem 0;
            }
            
            .mobile-menu-btn {
                display: flex;
                flex-direction: column;
                justify-content: space-around;
                width: 30px;
                height: 30px;
                background: transparent;
                border: none;
                cursor: pointer;
                padding: 0;
                z-index: 1001;
            }
            
            .hamburger-line {
                width: 100%;
                height: 3px;
                background: var(--text-primary);
                transition: all 0.3s ease;
                transform-origin: center;
            }
            
            .mobile-menu-btn.active .hamburger-line:nth-child(1) {
                transform: rotate(45deg) translate(6px, 6px);
            }
            
            .mobile-menu-btn.active .hamburger-line:nth-child(2) {
                opacity: 0;
            }
            
            .mobile-menu-btn.active .hamburger-line:nth-child(3) {
                transform: rotate(-45deg) translate(8px, -8px);
            }
            
            body.menu-open {
                overflow: hidden;
            }
        }
        
        @media (min-width: 1025px) {
            .mobile-menu-btn {
                display: none;
            }
        }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
}

function addMobileMenuStyles() {
}

function initAdvancedAnimations() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroSection = document.querySelector('.hero-section');
        const workspaceMockup = document.querySelector('.workspace-mockup');
        
        if (heroSection && workspaceMockup) {
            workspaceMockup.style.transform = `translateY(${scrolled * 0.1}px)`;
        }
    });
    
    const interactiveElements = document.querySelectorAll('.btn, .service-item, .interest-item');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

function initPerformanceOptimizations() {
    const criticalImages = [
        'photo_2025-07-16_11-25-31.jpg'
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
    
    if ('IntersectionObserver' in window) {
        const lazyElements = document.querySelectorAll('.lazy-load');
        const lazyObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('loaded');
                    lazyObserver.unobserve(entry.target);
                }
            });
        });
        
        lazyElements.forEach(element => {
            lazyObserver.observe(element);
        });
    }
}

function initAccessibility() {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
            const navMenu = document.querySelector('.nav-menu');
            
            if (navMenu && navMenu.classList.contains('mobile-active')) {
                mobileMenuBtn.classList.remove('active');
                navMenu.classList.remove('mobile-active');
                document.body.classList.remove('menu-open');
            }
        }
    });
    
    const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const modal = document.querySelector('.nav-menu');
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab' && modal && modal.classList.contains('mobile-active')) {
            const focusableContent = modal.querySelectorAll(focusableElements);
            const firstFocusableElement = focusableContent[0];
            const lastFocusableElement = focusableContent[focusableContent.length - 1];
            
            if (e.shiftKey) {
                if (document.activeElement === firstFocusableElement) {
                    lastFocusableElement.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastFocusableElement) {
                    firstFocusableElement.focus();
                    e.preventDefault();
                }
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        initAdvancedAnimations();
        initPerformanceOptimizations();
        initAccessibility();
    }, 100);
});

window.addEventListener('error', function(e) {
    console.warn('Portfolio JS Error:', e.error);
});

window.addEventListener('resize', throttle(() => {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    
    if (window.innerWidth > 1024) {
        if (mobileMenuBtn) mobileMenuBtn.classList.remove('active');
        if (navMenu) navMenu.classList.remove('mobile-active');
        document.body.classList.remove('menu-open');
    }
}, 250));