// Travel Recs Scrapbook - Interactive Script

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    
    initTapSounds();
});

/**
 * Web Audio API synthesized bubble/pop audio clicks on button hovers/taps
 */
function initTapSounds() {
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
     * Synthesize a clean, woody click sound (pop/bubble)
     */
    function playTapSound() {
        try {
            const ctx = getAudioContext();
            if (!ctx) return;

            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.connect(gain);
            gain.connect(ctx.destination);

            const now = ctx.currentTime;
            
            // Short sine wave pitch drop for a woody tap/pop sound
            osc.type = 'sine';
            osc.frequency.setValueAtTime(600, now);
            osc.frequency.exponentialRampToValueAtTime(150, now + 0.05);

            gain.gain.setValueAtTime(0.06, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

            osc.start(now);
            osc.stop(now + 0.06);
        } catch (e) {
            console.warn('Audio contextual play blocked', e);
        }
    }

    // Attach click events to all buttons, links and posts
    const clickables = document.querySelectorAll('.logo, .nav-link, .caption-link, .btn-view-more, .btn-magnify-ireland, .ireland-get-link, .polaroid-card');
    
    clickables.forEach(item => {
        item.addEventListener('click', () => {
            playTapSound();
        });
    });
}
