document.addEventListener("DOMContentLoaded", () => {
    // Basic smooth scrolling for navbar links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
                // Close menu if open
                const navLinks = document.querySelector('.nav-links-container');
                if (navLinks && navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                }
            }
        });
    });

    // Mobile menu toggle
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links-container');

    if (mobileBtn && navLinks) {
        mobileBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }



    // Eyebrow hover logic
    const eyebrowLinks = document.querySelectorAll('.eyebrow-link');
    const tooltipText = document.getElementById('eyebrow-tooltip');

    if (eyebrowLinks && tooltipText) {
        eyebrowLinks.forEach(link => {
            link.addEventListener('mouseenter', () => {
                const text = link.getAttribute('data-tooltip');
                tooltipText.textContent = text;
                tooltipText.classList.add('show');
            });
            link.addEventListener('mouseleave', () => {
                tooltipText.classList.remove('show');
            });
        });
    }

    console.log("Origen Landing Page - JS Inicializado");

    // =============================================
    // QUÉ HACEMOS — Acordeón sincronizado
    // =============================================
    (function() {
        const accordionRoot = document.getElementById('qhAccordion');
        if (!accordionRoot) return;

        const bars       = Array.from(accordionRoot.querySelectorAll('.qh-bar'));
        const rootFill   = document.getElementById('qhRootFill');
        const footer     = document.getElementById('qhFooter');
        const footerIcon = document.getElementById('qhFooterIcon');
        const footerLabel= document.getElementById('qhFooterLabel');
        const imgWrap    = document.getElementById('qhImgWrap');
        const imgs       = imgWrap ? Array.from(imgWrap.querySelectorAll('img')) : [];

        const labels = {
            academia:    'Academia',
            consultorio: 'Consultorio',
            catalogo:    'Catálogo',
            cultivadores:'Cultivadores'
        };

        const icons = {
            academia:    'assets/icons/5_20.svg',
            consultorio: 'assets/icons/2_10.svg',
            catalogo:    'assets/icons/1_10.svg',
            cultivadores:'assets/icons/3_10.svg'
        };

        function updateRootFill() {
            const openBar = bars.find(b => b.classList.contains('is-open'));
            if (!openBar || !rootFill) return;
            const accRect  = accordionRoot.getBoundingClientRect();
            const nodeTop  = openBar.querySelector('.qh-bar-node').getBoundingClientRect().top;
            const relTop   = nodeTop - accRect.top;
            rootFill.style.height = (relTop + 5.5) + 'px';
        }

        function setActive(key) {
            // Swap image
            imgs.forEach(img => img.classList.toggle('is-active', img.dataset.key === key));

            // Swap footer content with a brief fade
            if (!footer) return;
            footer.classList.add('is-swapping');
            setTimeout(() => {
                footerIcon.innerHTML = `<img src="${icons[key]}" class="qh-media-icon-img" alt="${labels[key]}">`;
                footerLabel.textContent = labels[key] || key;
                footer.classList.remove('is-swapping');
            }, 180);
        }

        bars.forEach(bar => {
            const trigger = bar.querySelector('.qh-bar-trigger');
            trigger.addEventListener('click', () => {
                if (bar.classList.contains('is-open')) return;
                bars.forEach(b => {
                    b.classList.remove('is-open');
                    b.querySelector('.qh-bar-trigger').setAttribute('aria-expanded', 'false');
                });
                bar.classList.add('is-open');
                trigger.setAttribute('aria-expanded', 'true');
                updateRootFill();
                setActive(bar.dataset.key);
            });
        });

        // Estado inicial
        updateRootFill();
        setActive('academia');
        window.addEventListener('resize', updateRootFill);
    })();

    // =============================================
    // CTA BUTTON — Toggle estado inicial / confirmado
    // =============================================
    const btnTurno = document.getElementById('btn-turno');
    if (btnTurno) {
        btnTurno.addEventListener('click', () => {
            if (btnTurno.classList.contains('is-confirmed')) return;
            btnTurno.classList.add('is-confirmed');
            btnTurno.setAttribute('aria-label', 'Turno agendado');
            btnTurno.querySelector('.btn-label-confirmed')?.removeAttribute('aria-hidden');
        });
    }

    // =============================================
    // ACADEMIA STATS — Counter Animation
    // =============================================
    (function() {
        const statsGrid = document.querySelector('.academia-stats-grid');
        if (!statsGrid) return;

        const statElements = document.querySelectorAll('.academia-stat-num');
        
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateStats();
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        observer.observe(statsGrid);

        function animateStats() {
            statElements.forEach(el => {
                const target = parseInt(el.getAttribute('data-target'), 10);
                const start = parseInt(el.getAttribute('data-start') || '0', 10);
                const prefix = el.getAttribute('data-prefix') || '';
                const suffix = el.getAttribute('data-suffix') || '';
                const duration = 2000; // 2 seconds
                let startTime = null;

                function count(timestamp) {
                    if (!startTime) startTime = timestamp;
                    const progress = Math.min((timestamp - startTime) / duration, 1);
                    // easeOutQuad easing
                    const ease = progress * (2 - progress);
                    const current = Math.floor(ease * (target - start) + start);
                    el.textContent = prefix + current + suffix;

                    if (progress < 1) {
                        requestAnimationFrame(count);
                    } else {
                        el.textContent = prefix + target + suffix;
                    }
                }

                requestAnimationFrame(count);
            });
        }
    })();
});

