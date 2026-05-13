// Mobile Menu Toggle
const menuToggle = document.getElementById('menu-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = navMenu.querySelectorAll('a');

menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Chiudi il menu quando si clicca su un link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// Boot / Loading overlay (Pip-Boy inspired)
const bootOverlay = document.getElementById('boot-overlay');
const bootPercent = document.getElementById('boot-percent');
const bootFill = document.getElementById('boot-progress-fill');

const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
let bootTimer = null;
let bootDone = false;

const setBootProgress = (pct) => {
    const clamped = Math.max(0, Math.min(100, Math.round(pct)));
    if (bootPercent) bootPercent.textContent = `${clamped}%`;
    if (bootFill) bootFill.style.width = `${clamped}%`;
};

const radioAudio = document.getElementById('vault-audio');
const radioToggle = document.getElementById('radio-toggle');

const updateRadioButton = () => {
    if (!radioAudio || !radioToggle) return;
    const isPlaying = !radioAudio.paused && !radioAudio.ended;
    radioToggle.textContent = isPlaying ? 'Pause' : 'Play';
    radioToggle.setAttribute('aria-pressed', String(isPlaying));
};

const startRadio = () => {
    if (!radioAudio) return;
    if (radioAudio.readyState >= 2) { // HAVE_CURRENT_DATA or better
        const playPromise = radioAudio.play();
        if (playPromise?.catch) {
            playPromise.catch(() => {
                updateRadioButton();
            });
        }
        updateRadioButton();
    } else {
        radioAudio.addEventListener('canplay', () => {
            const playPromise = radioAudio.play();
            if (playPromise?.catch) {
                playPromise.catch(() => {
                    updateRadioButton();
                });
            }
            updateRadioButton();
        }, { once: true });
    }
};

if (radioToggle) {
    radioToggle.addEventListener('click', () => {
        if (!radioAudio) return;
        if (radioAudio.paused) {
            radioAudio.play().catch(() => {
                radioAudio.pause();
            });
        } else {
            radioAudio.pause();
        }
        updateRadioButton();
    });
}

const hideBootOverlay = () => {
    if (bootDone) return;
    bootDone = true;

    document.body.classList.remove('no-scroll');
    if (!bootOverlay) return;

    bootOverlay.classList.add('is-hidden');
    bootOverlay.setAttribute('aria-hidden', 'true');

    window.clearInterval(bootTimer);
    bootTimer = null;

    window.setTimeout(() => {
        if (bootOverlay?.parentNode) bootOverlay.parentNode.removeChild(bootOverlay);
    }, 450);

    startRadio();
};

const startBootOverlay = () => {
    if (!bootOverlay) return;

    document.body.classList.add('no-scroll');
    bootOverlay.setAttribute('aria-hidden', 'false');

    if (prefersReducedMotion) {
        setBootProgress(100);
        window.setTimeout(hideBootOverlay, 250);
        return;
    }

    let pct = 0;
    setBootProgress(pct);

    bootTimer = window.setInterval(() => {
        pct += Math.random() * 5 + 2;
        if (pct >= 100) {
            setBootProgress(100);
            hideBootOverlay();
        } else {
            setBootProgress(pct);
        }
    }, 200);

    window.setTimeout(() => {
        if (!bootDone) {
            setBootProgress(100);
            hideBootOverlay();
        }
    }, 5200);

    const skip = () => hideBootOverlay();
    bootOverlay.addEventListener('click', skip, { once: true });
    window.addEventListener('keydown', skip, { once: true });
};

startBootOverlay();

// Navbar shadow on scroll (use CSS class instead of inline style)
const nav = document.querySelector('nav');
const toggleNavShadow = () => {
    if (!nav) return;
    if (window.scrollY > 50) nav.classList.add('nav-scrolled');
    else nav.classList.remove('nav-scrolled');
};

toggleNavShadow();
window.addEventListener('scroll', toggleNavShadow);
