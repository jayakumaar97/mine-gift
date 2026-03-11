// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
    const init = (fn, name) => {
        try {
            fn();
        } catch (e) {
            console.error(`Error initializing ${name}:`, e);
        }
    };

    init(initThreeBackground, 'Three.js Background');
    init(initHeartCanvas, 'Heart Canvas');
    init(initTrailCanvas, 'Cursor Trail');
    init(initGSAPAnimations, 'GSAP Animations');
    init(initCountdown, 'Countdown');
    init(initTypedLetter, 'Typed Letter');
    init(initSurprise, 'Surprise');
    init(initMusicControl, 'Music Control');
    init(initSecretMessage, 'Secret Message');
});

// Global functions for interactions
function openLightbox(card) {
    const img = card.querySelector('img');
    const caption = card.querySelector('p');
    
    document.getElementById('lightbox-img').src = img.src;
    document.getElementById('lightbox-caption').innerText = caption.innerText;
    
    const lightboxModal = new bootstrap.Modal(document.getElementById('lightboxModal'));
    lightboxModal.show();
}

// 2. Cursor Trail Content
function initTrailCanvas() {
    const canvas = document.getElementById('trail-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    class TrailParticle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.size = Math.random() * 8 + 2;
            this.speedX = (Math.random() - 0.5) * 2;
            this.speedY = (Math.random() - 0.5) * 2;
            this.opacity = 1;
            this.color = `hsla(${Math.random() * 20 + 340}, 100%, 70%, `; // Pinkish
        }

        draw() {
            ctx.fillStyle = this.color + this.opacity + ')';
            ctx.beginPath();
            const topY = this.y - this.size / 2;
            ctx.moveTo(this.x, topY + this.size / 4);
            ctx.bezierCurveTo(this.x, topY, this.x - this.size / 2, topY, this.x - this.size / 2, topY + this.size / 4);
            ctx.bezierCurveTo(this.x - this.size / 2, topY + this.size / 2, this.x, topY + this.size * 0.75, this.x, this.y);
            ctx.bezierCurveTo(this.x, topY + this.size * 0.75, this.x + this.size / 2, topY + this.size / 2, this.x + this.size / 2, topY + this.size / 4);
            ctx.bezierCurveTo(this.x + this.size / 2, topY, this.x, topY, this.x, topY + this.size / 4);
            ctx.fill();
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.opacity -= 0.02;
        }
    }

    function addParticle(x, y) {
        for (let i = 0; i < 2; i++) {
            particles.push(new TrailParticle(x, y));
        }
    }

    window.addEventListener('mousemove', (e) => addParticle(e.clientX, e.clientY));
    window.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
            addParticle(e.touches[0].clientX, e.touches[0].clientY);
        }
    });

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
            if (particles[i].opacity <= 0) {
                particles.splice(i, 1);
                i--;
            }
        }
        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resize);
    resize();
    animate();
}

// 8. Secret Message Timer
function initSecretMessage() {
    const showModal = () => {
        const modalEl = document.getElementById('secretModal');
        // Only show if not already visible
        if (!modalEl.classList.contains('show')) {
            const secretModal = new bootstrap.Modal(modalEl);
            secretModal.show();
        }
    };

    // Initial delay: 40 seconds
    setTimeout(() => {
        showModal();
        // Recurring interval: 1 minute (60,000 ms)
        setInterval(showModal, 60000);
    }, 40000);
}

function continueSurprise() {
    const modalEl = document.getElementById('secretModal');
    const modal = bootstrap.Modal.getInstance(modalEl);
    modal.hide();
    scrollToSection('surprise');
}

// 1. Three.js 3D Background
function initThreeBackground() {
    const container = document.getElementById('three-container');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    // Create particles
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    for (let i = 0; i < 1500; i++) {
        vertices.push(
            THREE.MathUtils.randFloatSpread(2000),
            THREE.MathUtils.randFloatSpread(2000),
            THREE.MathUtils.randFloatSpread(2000)
        );
    }
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    
    const material = new THREE.PointsMaterial({ 
        color: 0xff6ec4, 
        size: 3, 
        transparent: true, 
        opacity: 0.6 
    });
    
    const points = new THREE.Points(geometry, material);
    scene.add(points);

    camera.position.z = 1000;

    function animate() {
        requestAnimationFrame(animate);
        points.rotation.x += 0.001;
        points.rotation.y += 0.001;
        renderer.render(scene, camera);
    }

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    animate();
}

// 2. Floating Heart Canvas
function initHeartCanvas() {
    const canvas = document.getElementById('heart-canvas');
    const ctx = canvas.getContext('2d');
    let hearts = [];

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    class Heart {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = canvas.height + Math.random() * 100;
            this.size = Math.random() * 15 + 5;
            this.speed = Math.random() * 2 + 1;
            this.opacity = Math.random() * 0.5 + 0.3;
        }

        draw() {
            ctx.fillStyle = `rgba(255, 110, 196, ${this.opacity})`;
            ctx.beginPath();
            const topY = this.y - this.size / 2;
            ctx.moveTo(this.x, topY + this.size / 4);
            ctx.bezierCurveTo(this.x, topY, this.x - this.size / 2, topY, this.x - this.size / 2, topY + this.size / 4);
            ctx.bezierCurveTo(this.x - this.size / 2, topY + this.size / 2, this.x, topY + this.size * 0.75, this.x, this.y);
            ctx.bezierCurveTo(this.x, topY + this.size * 0.75, this.x + this.size / 2, topY + this.size / 2, this.x + this.size / 2, topY + this.size / 4);
            ctx.bezierCurveTo(this.x + this.size / 2, topY, this.x, topY, this.x, topY + this.size / 4);
            ctx.fill();
        }

        update() {
            this.y -= this.speed;
            if (this.y < -20) {
                this.y = canvas.height + 20;
                this.x = Math.random() * canvas.width;
            }
        }
    }

    function init() {
        resize();
        hearts = Array.from({ length: 50 }, () => new Heart());
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        hearts.forEach(heart => {
            heart.update();
            heart.draw();
        });
        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resize);
    init();
    animate();
}

// 3. GSAP Animations
function initGSAPAnimations() {
    gsap.registerPlugin(ScrollTrigger);

    // Hero Fade In
    gsap.from(".hero-card", {
        y: 100,
        opacity: 0,
        duration: 1.5,
        ease: "power4.out"
    });

    // Sections Scroll Animation
    const sections = ['#memories', '#reasons', '#timeline', '#countdown', '#letter', '#surprise'];
    sections.forEach(section => {
        gsap.from(`${section} .glass-card`, {
            scrollTrigger: {
                trigger: section,
                start: "top 80%",
                toggleActions: "play none none reverse"
            },
            y: 50,
            opacity: 0,
            duration: 1,
            stagger: 0.2,
            ease: "power2.out"
        });
    });
}

// 4. Countdown Timer
function initCountdown() {
    const birthday = new Date('March 14, 2026 00:00:00').getTime();
    
    function updateCountdown() {
        const now = new Date().getTime();
        const diff = birthday - now;

        if (diff < 0) return;

        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);

        document.getElementById('days').innerText = d.toString().padStart(2, '0');
        document.getElementById('hours').innerText = h.toString().padStart(2, '0');
        document.getElementById('minutes').innerText = m.toString().padStart(2, '0');
        document.getElementById('seconds').innerText = s.toString().padStart(2, '0');
    }

    setInterval(updateCountdown, 1000);
    updateCountdown();
}

// 5. Typed.js Letter
function initTypedLetter() {
    new Typed('#typed-text', {
        strings: [
            "To the most beautiful person in my life,<br><br>" +
            "Meeting you was the best thing that ever happened to me.<br>" +
            "You make my life happier every single day.<br><br>" +
            "On your special day, I want you to know how much you mean to me.<br>" +
            "May your day be as bright and beautiful as your smile.<br><br>" +
            "Happy Birthday My Love ❤️"
        ],
        typeSpeed: 50,
        backSpeed: 0,
        showCursor: true,
        cursorChar: '|',
        autoInsertCss: true,
        startDelay: 500,
        scrollTrigger: {
            trigger: "#typed-text",
            start: "top 80%"
        }
    });
}

// 6. Surprise Interaction
let cakeState = 0; // 0: unlit, 1: lit, 2: cut

function initSurprise() {
    const btn = document.getElementById('surprise-btn');
    btn.addEventListener('click', () => {
        // Confetti
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#ff6ec4', '#7873f5', '#ffffff']
        });

        // Show Modal
        const myModal = new bootstrap.Modal(document.getElementById('giftModal'));
        myModal.show();
    });
}

// 7. Music Control
function initMusicControl() {
    const musicBtn = document.getElementById('music-btn');
    const audio = document.getElementById('romantic-music');
    const icon = musicBtn.querySelector('i');
    let isPlaying = false;

    musicBtn.addEventListener('click', () => {
        if (!isPlaying) {
            audio.play().then(() => {
                icon.className = 'fas fa-pause';
                isPlaying = true;
            }).catch(err => {
                console.error("Playback failed:", err);
            });
        } else {
            audio.pause();
            icon.className = 'fas fa-play';
            isPlaying = false;
        }
    });
}

// Global functions
function scrollToSection(id) {
    document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
}

function finalResponse(text) {
    // Hide modal
    const modalEl = document.getElementById('giftModal');
    const modal = bootstrap.Modal.getInstance(modalEl);
    modal.hide();

    // Show final overlay
    const overlay = document.getElementById('final-message');
    const responseText = document.getElementById('response-text');
    const card = overlay.querySelector('.glass-card');

    responseText.innerText = text;
    overlay.classList.remove('d-none');

    // Close on click-out/overlay click
    const closeOverlay = () => {
        overlay.classList.add('d-none');
        // Only scroll up if we aren't showing the cake section
        if (document.getElementById('cake-section').classList.contains('d-none')) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        overlay.removeEventListener('click', closeOverlay);
    };
    overlay.addEventListener('click', closeOverlay);
    
    // Prevent clicking the card from closing the overlay
    card.addEventListener('click', (e) => e.stopPropagation());

    // Extra confetti
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 3000 };

    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function () {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            clearInterval(interval);
            // Add a button to go to the cake after confetti
            if (!document.getElementById('cake-trigger-btn')) {
                const btnContainer = document.createElement('div');
                btnContainer.className = 'mt-4';
                btnContainer.innerHTML = `<button id="cake-trigger-btn" class="btn btn-lg btn-pink pulse" onclick="finalSurprise()">See Your Birthday Cake 🎂</button>`;
                card.appendChild(btnContainer);
            }
            return;
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
    }, 250);
}

function finalSurprise() {
    // Hide final message overlay
    document.getElementById('final-message').classList.add('d-none');

    // Show cake section
    const cakeSection = document.getElementById('cake-section');
    cakeSection.classList.remove('d-none');
    scrollToSection('cake-section');
    
    document.getElementById('cake-message').innerText = "Click the cake to light the candles! 🎂";
}

function handleCakeClick() {
    const cake = document.getElementById('birthday-cake');
    const message = document.getElementById('cake-message');
    
    if (cakeState === 0) {
        // Step 1: Light Candles
        cake.classList.add('lit');
        message.innerText = "Make a wish and click again to cut the cake 🎂";
        
        // Small sparkles
        confetti({
            particleCount: 50,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#ffae00', '#fff', '#ff85c0']
        });
        
        cakeState = 1;
    } else if (cakeState === 1) {
        // Step 2: Cut Cake
        cake.classList.add('cutting');
        message.innerText = "";
        
        // Show fireworks/confetti
        confetti({
            particleCount: 150,
            spread: 100,
            origin: { y: 0.6 }
        });

        // Trigger Fireworks in background
        initFireworks();

        // Step 3 & 4: Final Message
        setTimeout(() => {
            finalResponse("Happy Birthday My Love ❤️\nI hope this small surprise made you smile.\nYou deserve all the happiness in the world.\nI love you forever.");
            document.getElementById('final-buttons').classList.remove('d-none');
            document.getElementById('cake-title').innerText = "Happy Birthday! 🎂";
        }, 1000);
        
        cakeState = 2;
    }
}

function initFireworks() {
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
    }, 250);
}

function blowKiss() {
    // Burst of elegant hearts
    const scalar = 2.5;
    const heart = confetti.shapeFromPath({ path: 'M167 10c-17.5-16-45.7-16-63.2 0L87.5 25.7 71.2 10c-17.5-16-45.7-16-63.2 0-18.7 17.2-18.7 45.1 0 62.3l79.5 73.1 79.5-73.1c18.7-17.2 18.7-45.1 0-62.3z' });

    confetti({
        shapes: [heart],
        particleCount: 100,
        spread: 120,
        origin: { y: 0.7 },
        colors: ['#ff6ec4', '#ff85c0', '#7873f5'],
        scalar
    });
}

function replaySurprise() {
    // Reset state
    cakeState = 0;
    const cake = document.getElementById('birthday-cake');
    if (cake) cake.classList.remove('lit', 'cutting');
    
    document.getElementById('cake-section').classList.add('d-none');
    document.getElementById('final-buttons').classList.add('d-none');
    document.getElementById('final-message').classList.add('d-none');
    
    // Reset surprise section elements
    const giftResult = document.getElementById('gift-result');
    if (giftResult) giftResult.classList.add('d-none');
    
    const giftHeart = document.querySelector('.heart-gift');
    if (giftHeart) giftHeart.parentElement.style.opacity = '1';

    // Remove dynamic button if exists
    const cakeTrigger = document.getElementById('cake-trigger-btn');
    if (cakeTrigger) cakeTrigger.parentElement.remove();
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
