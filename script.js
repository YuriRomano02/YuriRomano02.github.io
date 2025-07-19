// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    initializeAnimations();
    setupScrollAnimations();
    setupContactInteractions();
    setupSkillHovers();
});

// Initialize entrance animations
function initializeAnimations() {
    const animatedElements = document.querySelectorAll('.project-card, .skill, .education');
    
    animatedElements.forEach(el => {
        el.classList.add('fade-in');
    });
}

// Setup scroll-triggered animations
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const elementsToObserve = document.querySelectorAll('.fade-in');
    elementsToObserve.forEach(el => {
        observer.observe(el);
    });
}

// Setup contact link interactions
function setupContactInteractions() {
    const contactLinks = document.querySelectorAll('.contact-links a');
    
    contactLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.05)';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(-2px) scale(1)';
        });
    });
}

// Setup skill hover effects with random colors
function setupSkillHovers() {
    const skills = document.querySelectorAll('.skill');
    const colors = [
        'linear-gradient(135deg, #667eea, #764ba2)',
        'linear-gradient(135deg, #f093fb, #f5576c)',
        'linear-gradient(135deg, #4facfe, #00f2fe)',
        'linear-gradient(135deg, #43e97b, #38f9d7)',
        'linear-gradient(135deg, #fa709a, #fee140)',
        'linear-gradient(135deg, #a8edea, #fed6e3)',
        'linear-gradient(135deg, #ff9a9e, #fecfef)',
        'linear-gradient(135deg, #96deda, #50c9c3)',
        'linear-gradient(135deg, #fddb92, #d1fdff)'
    ];
    
    skills.forEach((skill, index) => {
        const originalColor = skill.style.background;
        const hoverColor = colors[index % colors.length];
        
        skill.addEventListener('mouseenter', function() {
            this.style.background = hoverColor;
            this.style.transform = 'translateY(-8px) scale(1.05)';
        });
        
        skill.addEventListener('mouseleave', function() {
            this.style.background = 'linear-gradient(135deg, #667eea, #764ba2)';
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Smooth scrolling for navigation links (if added in future)
function setupSmoothScrolling() {
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
}

// Add typing effect to the subtitle (optional enhancement)
function addTypingEffect() {
    const subtitle = document.querySelector('.subtitle');
    const text = subtitle.textContent;
    subtitle.textContent = '';
    
    let i = 0;
    const typeWriter = () => {
        if (i < text.length) {
            subtitle.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        }
    };
    
    // Start typing effect after a short delay
    setTimeout(typeWriter, 1000);
}

// Add parallax effect to header (optional)
function addParallaxEffect() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const header = document.querySelector('header');
        const rate = scrolled * -0.5;
        header.style.transform = `translateY(${rate}px)`;
    });
}

// Project card click handlers (for future enhancement)
function setupProjectInteractions() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('click', function() {
            // Future: Open project details modal or navigate to project page
            console.log('Project clicked:', this.querySelector('.project-title').textContent);
        });
    });
}

// Utility function to add new skills dynamically (for future use)
function addSkill(skillName) {
    const skillsGrid = document.querySelector('.skills-grid');
    const newSkill = document.createElement('div');
    newSkill.className = 'skill fade-in';
    newSkill.textContent = skillName;
    skillsGrid.appendChild(newSkill);
    
    // Re-setup hover effects for the new skill
    setupSkillHovers();
}

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
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

// Optional: Add scroll progress indicator
function addScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, #667eea, #764ba2);
        z-index: 9999;
        transition: width 0.3s ease;
    `;
    document.body.appendChild(progressBar);
    
    const updateProgress = debounce(() => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + '%';
    }, 10);
    
    window.addEventListener('scroll', updateProgress);
}

// Initialize optional features
// Uncomment the lines below to enable additional features:
// addTypingEffect();
// addParallaxEffect();
// addScrollProgress();
// setupProjectInteractions();
