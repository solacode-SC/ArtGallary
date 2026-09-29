// DENSTEY 20 Retro Game Station - Interactive Script

document.addEventListener('DOMContentLoaded', () => {
    initStars();
    initScreenInteractions();
    initRetroAudio();
});

/**
 * Generate retro twinkling stars dynamically in the hero background
 */
function initStars() {
    const container = document.getElementById('starsContainer');
    if (!container) return;

    // Clear existing placeholder stars
    container.innerHTML = '';

    const starCount = 35;
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        
        // Random positioning
        const x = Math.random() * 100;
        const y = Math.random() * 85; // Stay above the grid floor
        
        // Random size (2px to 6px)
        const size = Math.floor(Math.random() * 4) + 2;
        
        // Random animation delay
        const delay = Math.random() * 3;
        const duration = Math.random() * 3 + 2;

        star.style.left = `${x}%`;
        star.style.top = `${y}%`;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.animationDelay = `${delay}s`;
        star.style.animationDuration = `${duration}s`;
        
        // Custom retro glow color
        const colors = ['#ffffff', '#00ffcc', '#ff4b3e', '#ffb703'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        star.style.boxShadow = `0 0 ${size}px #fff, 0 0 ${size * 2}px ${randomColor}`;

        container.appendChild(star);
    }
}

/**
 * Dynamic Main Monitor Screen Updates on Card Hover
 */
function initScreenInteractions() {
    const mainMonitorImg = document.getElementById('mainMonitorImg');
    const cards = document.querySelectorAll('.game-card');
    const defaultMonitorSrc = 'assets/monitor-screen.png';

    if (!mainMonitorImg) return;

    cards.forEach(card => {
        const cardImg = card.querySelector('.card-screen img');
        if (!cardImg) return;

        // On hover, update the main monitor to show the game screen
        card.addEventListener('mouseenter', () => {
            mainMonitorImg.src = cardImg.src;
            mainMonitorImg.style.filter = 'contrast(1.2) brightness(1.1) saturate(1.2)';
            
            // Add a brief glitch animation by adding a class
            const monitorScreen = document.querySelector('.monitor-screen');
            if (monitorScreen) {
                monitorScreen.classList.add('screen-glitch');
                setTimeout(() => {
                    monitorScreen.classList.remove('screen-glitch');
                }, 150);
            }
        });

        // On mouse leave, reset to the default retro screen dashboard
        card.addEventListener('mouseleave', () => {
            mainMonitorImg.src = defaultMonitorSrc;
            mainMonitorImg.style.filter = '';
        });
    });
}

/**
 * Web Audio API Synthesis for 8-bit Retro Sounds
 * No assets required, fully code-synthesized!
 */
function initRetroAudio() {
    // Setup Audio Context lazily on first user interaction to comply with browser autoplay policies
    let audioCtx = null;

    function getAudioContext() {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        return audioCtx;
    }

    /**
     * Play an 8-bit sound effect
     * @param {string} type - 'blip', 'coin', 'laser'
     */
    function playRetroSound(type) {
        try {
            const ctx = getAudioContext();
            if (!ctx) return;

            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.connect(gain);
            gain.connect(ctx.destination);

            const now = ctx.currentTime;

            if (type === 'blip') {
                // Short blip
                osc.type = 'triangle'; // 8-bit square/triangle feel
                osc.frequency.setValueAtTime(300, now);
                osc.frequency.exponentialRampToValueAtTime(600, now + 0.08);
                gain.gain.setValueAtTime(0.05, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
                osc.start(now);
                osc.stop(now + 0.08);
            } else if (type === 'select') {
                // Dual note arcade sound
                osc.type = 'square';
                osc.frequency.setValueAtTime(523.25, now); // C5
                osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
                gain.gain.setValueAtTime(0.04, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
                osc.start(now);
                osc.stop(now + 0.25);
            } else if (type === 'click') {
                // Laser style
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(800, now);
                osc.frequency.exponentialRampToValueAtTime(150, now + 0.15);
                gain.gain.setValueAtTime(0.03, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
                osc.start(now);
                osc.stop(now + 0.15);
            }
        } catch (e) {
            console.warn('Audio synthesis failed or blocked by policy', e);
        }
    }

    // Attach sounds to buttons and links
    const buttons = document.querySelectorAll('.nav-btn, .retro-btn, .game-card');
    
    buttons.forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            playRetroSound('blip');
        });
        
        btn.addEventListener('click', () => {
            playRetroSound('select');
        });
    });
}
