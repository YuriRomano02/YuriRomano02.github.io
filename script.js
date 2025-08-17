document.addEventListener('DOMContentLoaded', function () {
    showIntroScreen();
    initializeAnimations();
    setupScrollAnimations();
    setupContactInteractions();
    setupSkillHovers();
    setupMobileProjectInteractions();
    changeLanguage(currentLanguage);
    
    setTimeout(() => {
        const mainContent = document.getElementById('mainContent');
        if (mainContent && !mainContent.classList.contains('show')) {
            console.log('Fallback: showing main content');
            const introScreen = document.getElementById('introScreen');
            if (introScreen) {
                introScreen.style.display = 'none';
            }
            mainContent.classList.add('show');
            mainContent.style.opacity = '1';
        }
    }, 5000);
});

function showIntroScreen() {
    const introScreen = document.getElementById('introScreen');
    const mainContent = document.getElementById('mainContent');
    
    if (!mainContent) {
        console.error('Main content not found');
        return;
    }
    
    mainContent.style.opacity = '0';
    mainContent.style.display = 'block';
    
    let introSkipped = false;
    
    function showMainContent() {
        if (introSkipped) return;
        introSkipped = true;
        
        if (introScreen) {
            introScreen.classList.add('fade-out');
        }
        
        setTimeout(() => {
            if (introScreen) {
                introScreen.style.display = 'none';
            }
            mainContent.classList.add('show');
            mainContent.style.opacity = '1';
        }, 800);
    }
    
    if (introScreen) {
        introScreen.addEventListener('click', showMainContent);
    }
    
    setTimeout(showMainContent, 3000);
}

function initializeAnimations() {
    const animatedElements = document.querySelectorAll('.project-card, .skill, .education');

    animatedElements.forEach(el => {
        el.classList.add('fade-in');
    });
}

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

    const elementsToObserve = document.querySelectorAll('.fade-in');
    elementsToObserve.forEach(el => {
        observer.observe(el);
    });
}

function setupContactInteractions() {
    const contactLinks = document.querySelectorAll('.contact-links a');

    contactLinks.forEach(link => {
        link.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-3px) scale(1.05)';
        });

        link.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(-2px) scale(1)';
        });
    });
}

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

        skill.addEventListener('mouseenter', function () {
            this.style.background = hoverColor;
            this.style.transform = 'translateY(-8px) scale(1.05)';
        });

        skill.addEventListener('mouseleave', function () {
            this.style.background = 'linear-gradient(135deg, #667eea, #764ba2)';
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

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

    setTimeout(typeWriter, 1000);
}

function addParallaxEffect() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const header = document.querySelector('header');
        const rate = scrolled * -0.5;
        header.style.transform = `translateY(${rate}px)`;
    });
}

function setupProjectInteractions() {
    const projectCards = document.querySelectorAll('.project-card');

    projectCards.forEach(card => {
        card.addEventListener('click', function () {
            console.log('Project clicked:', this.querySelector('.project-title').textContent);
        });
    });
}

function addSkill(skillName) {
    const skillsGrid = document.querySelector('.skills-grid');
    const newSkill = document.createElement('div');
    newSkill.className = 'skill fade-in';
    newSkill.textContent = skillName;
    skillsGrid.appendChild(newSkill);

    setupSkillHovers();
}

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

function setupMobileProjectInteractions() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        let isGifVisible = false;
        const gif = card.querySelector('.project-gif');
        const placeholder = card.querySelector('.project-image-placeholder');
        const overlay = card.querySelector('.project-image-overlay');
        
        function showGif() {
            card.classList.add('mobile-gif-active');
            isGifVisible = true;
        }
        
        function hideGif() {
            card.classList.remove('mobile-gif-active');
            isGifVisible = false;
        }
        
        card.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (isMobileDevice()) {
                if (isGifVisible) {
                    hideGif();
                } else {
                    projectCards.forEach(otherCard => {
                        if (otherCard !== card) {
                            otherCard.classList.remove('mobile-gif-active');
                        }
                    });
                    showGif();
                }
            }
        });
        
        document.addEventListener('click', function(e) {
            if (isMobileDevice() && !card.contains(e.target)) {
                hideGif();
            }
        });
    });
}

// Check if device is mobile
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
           || window.innerWidth <= 768;
}

const translations = {
    en: {
        intro_subtitle: "to my portfolio",
        subtitle: "Computer Science Student & Web Developer",
        about_title: "About Me",
        about_text: "I am a Computer Science student at the University of Genova with a strong foundation in multiple programming languages and technologies. I have proficiency in C/C++, C#, Java, JavaScript, and web development frameworks, with experience in database management using SQL.",
        about_text2: "Currently pursuing my degree while expanding my knowledge in computer science fundamentals and advanced programming concepts. I have hands-on experience in web development and working with various programming frameworks.",
        skills_title: "Technical Skills",
        projects_title: "Projects & Experience",
        project1_title: "Full-Stack Web Application",
        project1_period: "September 2023 - January 2024",
        project1_desc: "Designed and developed a complete website using HTML, CSS, JavaScript, and PHP. The project included requirements analysis, responsive frontend implementation, backend development for data management, and performance optimization.",
        project2_title: "C++ Mathematical Solver",
        project2_period: "September 2023 - June 2024", 
        project2_desc: "Developed C++ applications for automatic mathematical problem solving. Implemented complex mathematical algorithms, user input/output management, code optimization for improved performance, and comprehensive testing.",
        project3_title: "Interactive Calculator",
        project3_period: "March 2024 - April 2024",
        project3_desc: "Built a fully functional calculator using pure HTML, CSS, and JavaScript. Features include basic arithmetic operations, decimal calculations, keyboard support, and a clean modern interface with smooth animations and responsive design.",
        project4_title: "Dylan Dog Comic Collection App",
        project4_period: "October 2024 - December 2024",
        project4_desc: "Developed a mobile application to track and manage Dylan Dog comic collection. Features include collection status tracking (owned/wanted), search functionality, and intuitive user interface for comic book enthusiasts.",
        responsive_design: "Responsive Design",
        algorithms: "Algorithms",
        performance_opt: "Performance Optimization", 
        testing: "Testing",
        animations: "Animations",
        mobile_dev: "Mobile Development",
        database: "Database",
        ui_design: "UI Design",
        collection_mgmt: "Collection Management",
        education_title: "Education",
        univ_title: "🎓 University of Genova - Computer Science",
        univ_period: "September 2021 - Present",
        univ_desc: "Currently studying Computer Science with solid foundations in programming. Practical skills in Java, C, C++, C#. Special interest in web development and frontend/backend technologies.",
        cert_title: "🏆 Web Development Certification (MIM)",
        cert_period: "July 2025",
        cert_desc: "Completed advanced web development course with MIM certification, focusing on modern web technologies and best practices.",
        diploma_title: "🔬 Scientific High School Diploma", 
        diploma_period: "September 2016 - July 2021",
        diploma_desc: "Graduated with 84/100 from Liceo Scientifico Antonio Pacinotti, Levanto. Strong foundation in mathematics, physics, and sciences with excellent analytical and problem-solving skills.",
        footer_text: "© 2025 Yuri Romano. Available for freelance projects and collaborations.",
        tap_to_view: "👆 Tap to view"
    },
    it: {
        intro_subtitle: "al mio portfolio",
        subtitle: "Studente di Informatica & Sviluppatore Web",
        about_title: "Chi Sono", 
        about_text: "Sono uno studente di Informatica all'Università di Genova con solide basi in diversi linguaggi di programmazione e tecnologie. Ho competenze in C/C++, C#, Java, JavaScript e framework di sviluppo web, con esperienza nella gestione di database utilizzando SQL.",
        about_text2: "Attualmente sto completando la mia laurea espandendo le mie conoscenze nei fondamenti dell'informatica e nei concetti avanzati di programmazione. Ho esperienza pratica nello sviluppo web e nell'utilizzo di vari framework di programmazione.",
        skills_title: "Competenze Tecniche",
        projects_title: "Progetti & Esperienza",
        project1_title: "Applicazione Web Full-Stack",
        project1_period: "Settembre 2023 - Gennaio 2024",
        project1_desc: "Progettato e sviluppato un sito web completo utilizzando HTML, CSS, JavaScript e PHP. Il progetto ha incluso analisi dei requisiti, implementazione frontend responsive, sviluppo backend per la gestione dei dati e ottimizzazione delle prestazioni.",
        project2_title: "Risolutore Matematico in C++",
        project2_period: "Settembre 2023 - Giugno 2024",
        project2_desc: "Sviluppato applicazioni C++ per la risoluzione automatica di problemi matematici. Implementato algoritmi matematici complessi, gestione input/output utente, ottimizzazione del codice per prestazioni migliorate e test approfonditi.",
        project3_title: "Calcolatrice Interattiva",
        project3_period: "Marzo 2024 - Aprile 2024",
        project3_desc: "Realizzata una calcolatrice completamente funzionale utilizzando HTML, CSS e JavaScript puri. Include operazioni aritmetiche di base, calcoli decimali, supporto tastiera e un'interfaccia moderna e pulita con animazioni fluide e design responsive.",
        project4_title: "App Collezione Dylan Dog",
        project4_period: "Ottobre 2024 - Dicembre 2024",
        project4_desc: "Sviluppata un'applicazione mobile per tracciare e gestire la collezione di fumetti Dylan Dog. Le caratteristiche includono il monitoraggio dello stato della collezione (posseduti/ricercati), funzionalità di ricerca e un'interfaccia utente intuitiva per gli appassionati di fumetti.",
        responsive_design: "Design Responsive",
        algorithms: "Algoritmi", 
        performance_opt: "Ottimizzazione Prestazioni",
        testing: "Testing",
        animations: "Animazioni",
        mobile_dev: "Sviluppo Mobile",
        database: "Database",
        ui_design: "Design UI",
        collection_mgmt: "Gestione Collezione",
        education_title: "Formazione",
        univ_title: "🎓 Università di Genova - Informatica",
        univ_period: "Settembre 2021 - Presente",
        univ_desc: "Attualmente studio Informatica con solide basi nella programmazione. Competenze pratiche in Java, C, C++, C#. Interesse particolare nello sviluppo web e nelle tecnologie frontend/backend.",
        cert_title: "🏆 Certificazione Sviluppo Web (MIM)",
        cert_period: "Luglio 2025",
        cert_desc: "Completato corso avanzato di sviluppo web con certificazione MIM, focalizzato su tecnologie web moderne e best practices.",
        diploma_title: "🔬 Diploma Liceo Scientifico",
        diploma_period: "Settembre 2016 - Luglio 2021", 
        diploma_desc: "Diplomato con 84/100 al Liceo Scientifico Antonio Pacinotti, Levanto. Solide basi in matematica, fisica e scienze con eccellenti capacità analitiche e di problem-solving.",
        footer_text: "© 2025 Yuri Romano. Disponibile per progetti freelance e collaborazioni.",
        tap_to_view: "👆 Tocca per vedere"
    }
};

let currentLanguage = localStorage.getItem('portfolio-language') || 'en';

function changeLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('portfolio-language', lang);
    
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.lang === lang) {
            btn.classList.add('active');
        }
    });
    
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });
    
    updateMobileTapIndicators(lang);
    
    document.documentElement.lang = lang;
}

function updateMobileTapIndicators(lang) {
    if (window.innerWidth <= 768) {
        const tapText = translations[lang].tap_to_view || '👆 Tap to view';
        
        let style = document.getElementById('mobile-tap-style');
        if (!style) {
            style = document.createElement('style');
            style.id = 'mobile-tap-style';
            document.head.appendChild(style);
        }
        
        style.textContent = `
            @media (max-width: 768px) {
                .project-image-placeholder::after {
                    content: '${tapText}';
                }
            }
        `;
    }
}
