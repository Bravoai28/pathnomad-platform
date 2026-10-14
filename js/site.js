/**
 * PATH NOMAD — shared UI helpers (navigation, reveal-on-scroll, toasts).
 * No dependencies.
 */
(function () {
    document.documentElement.classList.add('js');

    // Mobile navigation toggle
    const toggle = document.querySelector('[data-menu-toggle]');
    const menu = document.getElementById('mobile-nav');
    if (toggle && menu) {
        const setOpen = (open) => {
            toggle.setAttribute('aria-expanded', String(open));
            toggle.querySelector('[data-menu-label]').textContent = open ? 'Close' : 'Menu';
            menu.hidden = !open;
        };
        toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
        menu.addEventListener('click', (e) => { if (e.target.closest('a, button')) setOpen(false); });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') { setOpen(false); toggle.focus(); }
        });
        window.matchMedia('(min-width: 1081px)').addEventListener('change', (e) => { if (e.matches) setOpen(false); });
    }

    // Gentle fade-in for editorial blocks
    const items = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window && items.length) {
        const io = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) { entry.target.classList.add('is-visible'); io.unobserve(entry.target); }
            });
        }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
        items.forEach((el) => io.observe(el));
    } else {
        items.forEach((el) => el.classList.add('is-visible'));
    }

    // Accessible toast messages. Text is inserted with textContent (no HTML injection).
    window.PNToast = function (message, opts) {
        opts = opts || {};
        let region = document.getElementById('toast-region');
        if (!region) {
            region = document.createElement('div');
            region.id = 'toast-region';
            region.className = 'toast-region';
            region.setAttribute('role', 'status');
            region.setAttribute('aria-live', 'polite');
            document.body.appendChild(region);
        }
        const el = document.createElement('div');
        el.className = 'toast';
        const title = document.createElement('strong');
        title.textContent = opts.title || 'PATH NOMAD';
        el.appendChild(title);
        const body = document.createElement('span');
        body.textContent = message;
        el.appendChild(body);
        if (opts.code) {
            const code = document.createElement('code');
            code.textContent = opts.code;
            el.appendChild(document.createElement('br'));
            el.appendChild(code);
        }
        region.appendChild(el);
        setTimeout(() => el.remove(), opts.duration || 6000);
    };
})();
