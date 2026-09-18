// Mobile Menu Toggle
const menuToggle = document.getElementById('menu-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = navMenu.querySelectorAll('a');

const setMenuOpen = (open) => {
    navMenu.classList.toggle('active', open);
    menuToggle.setAttribute('aria-expanded', String(open));
};

menuToggle.addEventListener('click', () => {
    setMenuOpen(!navMenu.classList.contains('active'));
});

// Chiudi il menu quando si clicca su un link
navLinks.forEach(link => {
    link.addEventListener('click', () => setMenuOpen(false));
});

// Ombra sulla navbar allo scroll
const nav = document.querySelector('nav');
const toggleNavShadow = () => {
    if (!nav) return;
    if (window.scrollY > 20) nav.classList.add('nav-scrolled');
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
            tag.textContent = repo.language ? `${repo.language} · GitHub` : 'GitHub';
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
            gh.textContent = 'Codice su GitHub';
            actions.appendChild(gh);

            const demo = liveDemoUrl(repo);
            if (demo && demo !== repo.html_url) {
                const live = document.createElement('a');
                live.href = demo;
                live.className = 'project-link';
                live.target = '_blank';
                live.rel = 'noopener noreferrer';
                live.textContent = 'Anteprima live';
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