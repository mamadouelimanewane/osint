// Interactive Features for Social Links Clone

document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initScrollEffects();
    initDataStream();
    initNetworkInteractions();
    initRevealAnimations();
    initStatsCounter();
    initModal();
});

function initMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-nav-links a');

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu when a link is clicked
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }
}

function initScrollEffects() {
    const header = document.getElementById('main-header');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            header.style.padding = '0.75rem 0';
            header.style.background = 'rgba(5, 7, 10, 0.95)';
            header.style.boxShadow = '0 10px 30px -10px rgba(0, 0, 0, 0.5)';
        } else {
            header.style.padding = '1rem 0';
            header.style.background = 'rgba(5, 7, 10, 0.8)';
            header.style.boxShadow = 'none';
        }
    });
}

function initDataStream() {
    const streamContainer = document.querySelector('.data-stream');
    if (!streamContainer) return;

    const messages = [
        ">> INITIALIZING NEURAL SCAN...",
        ">> CONNECTING TO NODE_492...",
        ">> DECRYPTING PGP KEYS...",
        ">> ANALYZING SOCIAL GRAPH...",
        ">> GEOLOCATING ENTITY...",
        ">> MATCH FOUND: DATABASE #77",
        ">> UPLOADING EVIDENCE PACKAGE..."
    ];

    let msgIndex = 0;

    function addMessage() {
        const line = document.createElement('div');
        line.className = 'stream-line';
        line.textContent = messages[msgIndex];

        // Highlight important messages
        if (messages[msgIndex].includes("MATCH") || messages[msgIndex].includes("FOUND")) {
            line.classList.add('highlight');
            line.style.color = 'var(--accent)';
            line.style.textShadow = '0 0 8px var(--accent)';
        }

        streamContainer.appendChild(line);

        // Keep only last 5 messages
        if (streamContainer.children.length > 5) {
            streamContainer.removeChild(streamContainer.firstChild);
        }

        msgIndex = (msgIndex + 1) % messages.length;

        // Random typing speed
        setTimeout(addMessage, Math.random() * 1000 + 500);
    }

    // Clear initial static content
    streamContainer.innerHTML = '';
    addMessage();
}

function initNetworkInteractions() {
    const nodes = document.querySelectorAll('.node');

    nodes.forEach(node => {
        node.addEventListener('mouseenter', () => {
            node.style.transform = 'scale(1.2)';
            node.style.zIndex = '100';
            node.style.boxShadow = '0 0 25px var(--accent)';
        });

        node.addEventListener('mouseleave', () => {
            node.style.transform = '';
            node.style.zIndex = '';
            node.style.boxShadow = '';
        });
    });
}

function initRevealAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.glass-card, .section-title, .section-subtitle, .product-card, .case-card');

    revealElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)';
        // Stagger animations slightly
        el.style.transitionDelay = `${(index % 3) * 0.1}s`;

        observer.observe(el);
    });

    // Add global class for reveal state
    document.head.insertAdjacentHTML('beforeend', `
        <style>
            .revealed {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
        </style>
    `);
}

function initStatsCounter() {
    const statsSection = document.querySelector('.stats-bar');
    if (!statsSection) return;

    const counters = document.querySelectorAll('.stat-number');
    const speed = 200;

    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            counters.forEach(counter => {
                const updateCount = () => {
                    const target = +counter.getAttribute('data-target');
                    const count = +counter.innerText;
                    const inc = target / speed;

                    if (count < target) {
                        counter.innerText = Math.ceil(count + inc);
                        setTimeout(updateCount, 1);
                    } else {
                        counter.innerText = target;
                    }
                };
                updateCount();
            });
            observer.disconnect();
        }
    }, { threshold: 0.5 });

    observer.observe(statsSection);
}

function initModal() {
    const modal = document.getElementById('demo-modal');
    const closeBtn = document.querySelector('.modal-close');
    const triggers = document.querySelectorAll('a[href="#"]'); // Captures Book Demo buttons

    if (!modal) return;

    triggers.forEach(trigger => {
        if (trigger.textContent.includes('Demo') || trigger.textContent.includes('Specialist')) {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                modal.classList.add('active');
                const content = modal.querySelector('.modal-content');
                if (content) content.style.transform = 'translateY(0)';
            });
        }
    });

    const closeModal = () => {
        const content = modal.querySelector('.modal-content');
        if (content) content.style.transform = 'translateY(30px)';
        modal.classList.remove('active');
    };

    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    // Close on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // Form Submission
    const form = modal.querySelector('form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('button');
            const originalText = btn.innerText;

            btn.innerText = 'Sending...';
            btn.style.opacity = '0.7';

            setTimeout(() => {
                btn.innerText = 'Request Sent!';
                btn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)'; // Green success

                setTimeout(() => {
                    closeModal();
                    // Reset form after close animation
                    setTimeout(() => {
                        form.reset();
                        btn.innerText = originalText;
                        btn.style.background = '';
                        btn.style.opacity = '1';
                    }, 500);
                }, 1500);
            }, 1500);
        });
    }
}
