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

// Navbar shadow on scroll (use CSS class instead of inline style)
const nav = document.querySelector('nav');
const toggleNavShadow = () => {
    if (!nav) return;
    if (window.scrollY > 50) nav.classList.add('nav-scrolled');
    else nav.classList.remove('nav-scrolled');
};

toggleNavShadow();
window.addEventListener('scroll', toggleNavShadow);
