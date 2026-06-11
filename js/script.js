document.addEventListener('DOMContentLoaded', () => {
    console.log('Evil Nailong Redesign - Loaded.');

    // DOM Cache
    const marquee = document.querySelector('.marquee-content');
    const tracks = document.querySelectorAll('.carousel-track');
    const menuToggle = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    const caBox = document.querySelector('.ca-box');

    // Pause marquee on hover
    if (marquee) {
        marquee.addEventListener('mouseenter', () => marquee.style.animationPlayState = 'paused');
        marquee.addEventListener('mouseleave', () => marquee.style.animationPlayState = 'running');
    }

    // Auto-duplicate carousel images for seamless loop
    tracks.forEach(track => {
        if (track.children.length > 0) {
            // Repeat track content to ensure overflow covers wide screens seamlessly
            track.innerHTML = track.innerHTML.repeat(3);
        }
    });

    // Scroll-triggered animations using IntersectionObserver
    const animatedElements = document.querySelectorAll('.title-img, .lore-card, .animate-on-scroll, .footer-character');
    
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px' // Trigger slightly before element enters view
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target); // Trigger once
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => {
        // Add initial scroll animation class if not present
        if (!el.classList.contains('animate-on-scroll')) {
            el.classList.add('animate-on-scroll');
        }
        observer.observe(el);
    });

    // Scroll-linked tilt effect for the lore card
    window.addEventListener('scroll', () => {
        const loreCard = document.querySelector('.lore-card');
        if (loreCard && loreCard.classList.contains('animate')) {
            const rect = loreCard.getBoundingClientRect();
            // Check if card is within viewport
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                // Calculate scroll progress (0 when just entering bottom, 1 when just leaving top)
                const scrollProgress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
                // Map progress to a slight tilt: -2deg to +2deg
                const tilt = (scrollProgress * 4) - 2;
                loreCard.style.setProperty('--tilt', `${tilt}deg`);
            }
        }
    });

    // Mobile Menu Toggle
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            menuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (navLinks.classList.contains('active') && !navLinks.contains(e.target) && e.target !== menuToggle) {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });

        // Close menu when clicking a link
        const links = navLinks.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    // Clipboard Copy for Contract Address (CA)
    if (caBox) {
        caBox.addEventListener('click', () => {
            const caText = caBox.innerText.replace('CA: ', '').trim();
            
            // Clipboard API
            navigator.clipboard.writeText(caText).then(() => {
                const originalText = caBox.innerText;
                caBox.innerText = 'COPIED TO CLIPBOARD!';
                caBox.style.backgroundColor = '#ffdf42';
                caBox.style.color = '#000';
                caBox.style.borderColor = '#fff';

                setTimeout(() => {
                    caBox.innerText = originalText;
                    caBox.style.backgroundColor = '';
                    caBox.style.color = '';
                    caBox.style.borderColor = '';
                }, 2000);
            }).catch(err => {
                console.error('Could not copy contract address: ', err);
            });
        });
    }
});
