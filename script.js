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
    // ACADEMIA RED ANIMATION
    // =============================================
    (function() {
        const section = document.querySelector('.academia-network-section');
        if (!section) return;

        const svg = section.querySelector('.network-lines');
        const network = section.querySelector('.network-container');
        const center = section.querySelector('.network-node-center');
        const smalls = section.querySelectorAll('.network-node-small');

        if (!svg || !network || !center || !smalls.length) return;

        // Fetch corresponding stat elements
        const stats = Array.from({ length: 5 }, (_, i) => section.querySelector(`.network-stat-${i + 1}`));

        // Clear svg contents and rebuild defs filter + lines dynamically
        svg.innerHTML = '';
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        defs.innerHTML = `
            <filter id="glow-lines" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="1.5" result="blur" />
                <feComponentTransfer in="blur" result="brightBlur">
                    <feFuncA type="linear" slope="1.5"/>
                </feComponentTransfer>
                <feMerge>
                    <feMergeNode in="brightBlur" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
        `;
        svg.appendChild(defs);

        // Helper to trigger ripple wave animations
        function triggerRipple(x, y) {
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', x);
            circle.setAttribute('cy', y);
            circle.setAttribute('class', 'ripple-wave');
            svg.appendChild(circle);
            
            // Auto clean-up after CSS animation ends
            setTimeout(() => {
                circle.remove();
            }, 1200);
        }

        const lines = [];
        Array.from(smalls).forEach(() => {
            // Main solid line
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            svg.appendChild(line);
            
            // Spark line overlay
            const sparkLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            sparkLine.setAttribute('class', 'network-line-spark');
            svg.appendChild(sparkLine);
            
            lines.push(line, sparkLine);
        });

        // Mouse tracking coordinates relative to network container
        let mouse = { x: null, y: null };
        
        network.addEventListener('mousemove', (e) => {
            const rect = network.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
            
            // Set CSS variables for cursor glow trail
            network.style.setProperty('--glow-x', `${mouse.x}px`);
            network.style.setProperty('--glow-y', `${mouse.y}px`);
        });
        
        network.addEventListener('mouseleave', () => {
            mouse.x = null;
            mouse.y = null;
        });

        // Initialize node physics data (current offsets, target offsets, velocities, and ripple timings)
        const nodesData = [
            { el: center, statEl: null, curX: 0, curY: 0, targetX: 0, targetY: 0, vx: 0, vy: 0, lastRipple: 0 },
            ...Array.from(smalls).map((el, idx) => ({
                el: el,
                statEl: stats[idx],
                curX: 0,
                curY: 0,
                targetX: 0,
                targetY: 0,
                vx: 0,
                vy: 0,
                lastRipple: 0
            }))
        ];

        function centerOf(el) {
            const r = el.getBoundingClientRect();
            const stageRect = network.getBoundingClientRect();
            return {
                x: r.left - stageRect.left + r.width / 2,
                y: r.top - stageRect.top + r.height / 2
            };
        }

        // Settings for repulsion physics
        const isMobile = window.innerWidth <= 760;
        const maxDist = isMobile ? 80 : 160;   // trigger range
        const pushForce = isMobile ? 25 : 55;  // max displacement in pixels
        const friction = 0.90;
        const spring = 0.04;

        function update() {
            // Update node offsets based on mouse proximity
            nodesData.forEach(node => {
                let targetX = 0;
                let targetY = 0;

                if (mouse.x !== null && mouse.y !== null) {
                    const nodeCenter = centerOf(node.el);
                    const dx = nodeCenter.x - mouse.x;
                    const dy = nodeCenter.y - mouse.y;
                    const dist = Math.hypot(dx, dy);

                    if (dist < maxDist && dist > 0) {
                        const pct = (maxDist - dist) / maxDist; // 0 to 1
                        const angle = Math.atan2(dy, dx);
                        
                        // Repel from mouse + add organic random micro-jitter
                        const jitterX = Math.sin(Date.now() * 0.02) * 1.5;
                        const jitterY = Math.cos(Date.now() * 0.02) * 1.5;
                        
                        targetX = Math.cos(angle) * pct * pushForce + jitterX;
                        targetY = Math.sin(angle) * pct * pushForce + jitterY;

                        // Trigger ripple when user pushes node significantly
                        const now = Date.now();
                        if (pct > 0.45 && (now - node.lastRipple > 1800)) {
                            node.lastRipple = now;
                            triggerRipple(nodeCenter.x, nodeCenter.y);
                        }
                    }
                }

                // Spring physics integration
                const ax = (targetX - node.curX) * spring;
                const ay = (targetY - node.curY) * spring;
                
                node.vx = (node.vx + ax) * friction;
                node.vy = (node.vy + ay) * friction;
                
                node.curX += node.vx;
                node.curY += node.vy;

                // Apply CSS properties to displace element
                node.el.style.setProperty('--mouse-x', `${node.curX}px`);
                node.el.style.setProperty('--mouse-y', `${node.curY}px`);
                if (node.statEl) {
                    node.statEl.style.setProperty('--mouse-x', `${node.curX}px`);
                    node.statEl.style.setProperty('--mouse-y', `${node.curY}px`);
                }
            });

            // Update SVGs connecting endpoints (both main lines and sparks overlay)
            const c = centerOf(center);
            smalls.forEach((el, i) => {
                const p = centerOf(el);
                const lIdx = i * 2;
                if (lines[lIdx]) {
                    lines[lIdx].setAttribute('x1', c.x);
                    lines[lIdx].setAttribute('y1', c.y);
                    lines[lIdx].setAttribute('x2', p.x);
                    lines[lIdx].setAttribute('y2', p.y);
                }
                if (lines[lIdx + 1]) {
                    lines[lIdx + 1].setAttribute('x1', c.x);
                    lines[lIdx + 1].setAttribute('y1', c.y);
                    lines[lIdx + 1].setAttribute('x2', p.x);
                    lines[lIdx + 1].setAttribute('y2', p.y);
                }
            });
            requestAnimationFrame(update);
        }

        update();
    })();

    // =============================================
    // ACADEMIA RED INTERSECTION OBSERVER
    // =============================================
    (function() {
        const section = document.querySelector('.academia-network-section');
        if (!section) return;

        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    section.classList.add('is-visible');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        observer.observe(section);
    })();
});

