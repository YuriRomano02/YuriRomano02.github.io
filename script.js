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

// Progetti GitHub (API pubblica)
const GITHUB_USER = 'YuriRomano02';
const PROJECTS_EXCLUDE = new Set([
    'prova-inizio---NO-commit',
    GITHUB_USER, // README del profilo (repo omonimo)
]);

const liveDemoUrl = (repo) => {
    const home = (repo.homepage && String(repo.homepage).trim()) || '';
    if (/^https?:\/\//i.test(home)) return home;
    if (!repo.has_pages) return null;
    const user = GITHUB_USER.toLowerCase();
    const name = repo.name.toLowerCase();
    if (name === `${user}.github.io`) return `https://${user}.github.io`;
    return `https://${user}.github.io/${repo.name}/`;
};

const loadGitHubProjects = async () => {
    const grid = document.getElementById('projects-grid');
    if (!grid) return;

    try {
        const url = `https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=pushed&type=owner`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const repos = await res.json();
        const list = repos
            .filter((r) => !r.fork && !r.archived && !PROJECTS_EXCLUDE.has(r.name))
            .sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at));

        grid.replaceChildren();

        for (const repo of list) {
            const card = document.createElement('article');
            card.className = 'project-card';

            const h3 = document.createElement('h3');
            h3.textContent = repo.name;
            card.appendChild(h3);

            const tag = document.createElement('div');
            tag.className = 'project-tag';
            tag.textContent = repo.language ? `${repo.language} • GitHub` : 'GitHub';
            card.appendChild(tag);

            const p = document.createElement('p');
            const desc = (repo.description && repo.description.trim()) || 'Repository pubblico.';
            p.textContent = desc;
            card.appendChild(p);

            const actions = document.createElement('div');
            actions.className = 'project-card-actions';

            const gh = document.createElement('a');
            gh.href = repo.html_url;
            gh.className = 'project-link';
            gh.target = '_blank';
            gh.rel = 'noopener noreferrer';
            gh.textContent = 'Codice su GitHub →';
            actions.appendChild(gh);

            const demo = liveDemoUrl(repo);
            if (demo && demo !== repo.html_url) {
                const live = document.createElement('a');
                live.href = demo;
                live.className = 'project-link';
                live.target = '_blank';
                live.rel = 'noopener noreferrer';
                live.textContent = 'Anteprima live →';
                actions.appendChild(live);
            }

            card.appendChild(actions);
            grid.appendChild(card);
        }

        if (!grid.childElementCount) {
            const msg = document.createElement('p');
            msg.className = 'projects-error';
            msg.textContent = 'Nessun repository da mostrare.';
            grid.appendChild(msg);
        }
    } catch {
        grid.innerHTML = '';
        const err = document.createElement('p');
        err.className = 'projects-error';
        err.textContent = 'Impossibile caricare i progetti da GitHub. Riprova più tardi o visita il profilo GitHub dal menu contatti.';
        grid.appendChild(err);
    }
};

loadGitHubProjects();
