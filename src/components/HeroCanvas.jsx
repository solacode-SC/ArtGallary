import React, { useEffect, useRef } from 'react';

function HeroCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const parent = canvas.parentElement;
    if (!parent) return;

    let width, height, dpr;
    let animationId;
    let time = 0;

    const palettes = {
        waves: [
            'rgba(140, 174, 104, 0.32)',  // Sage Green
            'rgba(196, 124, 105, 0.28)',  // Warm Terracotta
            'rgba(92, 124, 158, 0.28)',   // Muted Indigo Blue
            'rgba(211, 178, 111, 0.28)',  // Mustard Gold
            'rgba(67, 52, 34, 0.18)',     // Cozy Coffee Brown
            'rgba(244, 239, 225, 0.35)',  // Warm Cream
        ],
        strokes: [
            'rgba(140, 174, 104, 0.12)',
            'rgba(196, 124, 105, 0.12)',
            'rgba(92, 124, 158, 0.12)',
            'rgba(211, 178, 111, 0.12)',
            'rgba(67, 52, 34, 0.08)',
        ],
        petals: [
            'rgba(255, 183, 197, 0.65)',
            'rgba(255, 204, 213, 0.55)',
            'rgba(196, 124, 105, 0.45)',
            'rgba(255, 218, 224, 0.5)',
            'rgba(240, 142, 168, 0.45)',
        ]
    };

    function resize() {
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        width = parent.offsetWidth;
        height = parent.offsetHeight;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    resize();

    class WaveLine {
        constructor(index, total) {
            this.index = index;
            this.total = total;
            this.baseY = (height * 0.15) + (height * 0.7) * (index / total);
            this.amplitude = 20 + Math.random() * 40;
            this.frequency = 0.002 + Math.random() * 0.003;
            this.speed = 0.3 + Math.random() * 0.5;
            this.phase = Math.random() * Math.PI * 2;
            this.lineWidth = 1 + Math.random() * 2;
            this.color = palettes.waves[index % palettes.waves.length];
            this.amp2 = 8 + Math.random() * 15;
            this.freq2 = 0.005 + Math.random() * 0.004;
            this.speed2 = 0.6 + Math.random() * 0.8;
        }

        draw(t) {
            ctx.beginPath();
            ctx.strokeStyle = this.color;
            ctx.lineWidth = this.lineWidth;
            ctx.lineCap = 'round';

            const segments = Math.ceil(width / 3);
            for (let i = 0; i <= segments; i++) {
                const x = (i / segments) * (width + 40) - 20;
                const normalX = x / width;

                const y1 = Math.sin((x * this.frequency) + (t * this.speed * 0.01) + this.phase) * this.amplitude;
                const y2 = Math.sin((x * this.freq2) + (t * this.speed2 * 0.01) + this.phase * 1.5) * this.amp2;
                const envelope = Math.sin(normalX * Math.PI) * 0.8 + 0.2;

                const y = this.baseY + (y1 + y2) * envelope;

                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            ctx.stroke();
        }
    }

    class Petal {
        constructor() {
            this.reset(true);
        }

        reset(initial) {
            this.x = Math.random() * width;
            this.y = initial ? Math.random() * height : -20;
            this.size = 3 + Math.random() * 6;
            this.speedY = 0.3 + Math.random() * 0.8;
            this.speedX = -0.3 + Math.random() * 0.6;
            this.rotation = Math.random() * Math.PI * 2;
            this.rotationSpeed = (Math.random() - 0.5) * 0.03;
            this.wobbleAmp = 15 + Math.random() * 25;
            this.wobbleFreq = 0.01 + Math.random() * 0.02;
            this.wobblePhase = Math.random() * Math.PI * 2;
            this.color = palettes.petals[Math.floor(Math.random() * palettes.petals.length)];
            this.opacity = 0.3 + Math.random() * 0.5;
        }

        update(t) {
            this.y += this.speedY;
            this.x += this.speedX + Math.sin(t * this.wobbleFreq + this.wobblePhase) * 0.4;
            this.rotation += this.rotationSpeed;

            if (this.y > height + 20 || this.x < -30 || this.x > width + 30) {
                this.reset(false);
            }
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.globalAlpha = this.opacity;

            ctx.beginPath();
            ctx.fillStyle = this.color;
            ctx.moveTo(0, -this.size);
            ctx.bezierCurveTo(
                this.size * 0.8, -this.size * 0.5,
                this.size * 0.8, this.size * 0.5,
                0, this.size * 0.6
            );
            ctx.bezierCurveTo(
                -this.size * 0.8, this.size * 0.5,
                -this.size * 0.8, -this.size * 0.5,
                0, -this.size
            );
            ctx.fill();

            ctx.globalAlpha = 1;
            ctx.restore();
        }
    }

    class InkCurve {
        constructor(index) {
            this.index = index;
            this.reset();
        }

        reset() {
            const side = Math.floor(Math.random() * 2);
            if (side === 0) {
                this.startX = -50;
                this.endX = width + 50;
            } else {
                this.startX = width + 50;
                this.endX = -50;
            }
            this.startY = height * 0.2 + Math.random() * height * 0.6;
            this.endY = height * 0.2 + Math.random() * height * 0.6;
            this.cp1x = width * 0.2 + Math.random() * width * 0.3;
            this.cp1y = Math.random() * height;
            this.cp2x = width * 0.5 + Math.random() * width * 0.3;
            this.cp2y = Math.random() * height;
            this.progress = 0;
            this.speed = 0.001 + Math.random() * 0.002;
            this.lineWidth = 1 + Math.random() * 3;
            this.color = palettes.strokes[this.index % palettes.strokes.length];
            this.life = 0;
            this.maxLife = 300 + Math.random() * 400;
        }

        update() {
            this.life++;
            if (this.progress < 1) {
                this.progress += this.speed;
            }
            if (this.life > this.maxLife) {
                this.reset();
            }
        }

        draw() {
            let fade = 1;
            if (this.life < 60) {
                fade = this.life / 60;
            } else if (this.life > this.maxLife - 60) {
                fade = (this.maxLife - this.life) / 60;
            }

            ctx.save();
            ctx.globalAlpha = fade;
            ctx.beginPath();
            ctx.strokeStyle = this.color;
            ctx.lineWidth = this.lineWidth;
            ctx.lineCap = 'round';

            const steps = Math.floor(this.progress * 80);
            for (let i = 0; i <= steps; i++) {
                const t = i / 80;
                const u = 1 - t;
                const x = u*u*u*this.startX + 3*u*u*t*this.cp1x + 3*u*t*t*this.cp2x + t*t*t*this.endX;
                const y = u*u*u*this.startY + 3*u*u*t*this.cp1y + 3*u*t*t*this.cp2y + t*t*t*this.endY;
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();
            ctx.globalAlpha = 1;
            ctx.restore();
        }
    }

    class Enso {
        constructor(index) {
            this.index = index;
            this.reset();
        }

        reset() {
            this.cx = width * 0.15 + Math.random() * width * 0.7;
            this.cy = height * 0.2 + Math.random() * height * 0.6;
            this.radius = 30 + Math.random() * 80;
            this.startAngle = Math.random() * Math.PI * 2;
            this.gapSize = 0.3 + Math.random() * 0.8;
            this.progress = 0;
            this.speed = 0.004 + Math.random() * 0.004;
            this.lineWidth = 1.5 + Math.random() * 2;
            this.color = palettes.strokes[this.index % palettes.strokes.length];
            this.life = 0;
            this.maxLife = 400 + Math.random() * 300;
            this.rotationOffset = Math.random() * 0.001;
        }

        update() {
            this.life++;
            if (this.progress < 1) {
                this.progress = Math.min(1, this.progress + this.speed);
            }
            if (this.life > this.maxLife) {
                this.reset();
            }
        }

        draw(t) {
            let fade = 1;
            if (this.life < 80) {
                fade = this.life / 80;
            } else if (this.life > this.maxLife - 80) {
                fade = (this.maxLife - this.life) / 80;
            }

            ctx.save();
            ctx.globalAlpha = fade * 0.6;
            ctx.beginPath();
            ctx.strokeStyle = this.color;
            ctx.lineWidth = this.lineWidth;
            ctx.lineCap = 'round';

            const totalArc = (Math.PI * 2) - this.gapSize;
            const drawArc = totalArc * this.progress;
            const dynamicStart = this.startAngle + t * this.rotationOffset;

            ctx.arc(this.cx, this.cy, this.radius, dynamicStart, dynamicStart + drawArc);
            ctx.stroke();

            ctx.globalAlpha = 1;
            ctx.restore();
        }
    }

    const waveCount = 8;
    const petalCount = 25;
    const inkCurveCount = 4;
    const ensoCount = 3;

    let waves = [];
    let petals = [];
    let inkCurves = [];
    let ensos = [];

    function createElements() {
        waves = [];
        petals = [];
        inkCurves = [];
        ensos = [];

        for (let i = 0; i < waveCount; i++) {
            waves.push(new WaveLine(i, waveCount));
        }
        for (let i = 0; i < petalCount; i++) {
            petals.push(new Petal());
        }
        for (let i = 0; i < inkCurveCount; i++) {
            inkCurves.push(new InkCurve(i));
        }
        for (let i = 0; i < ensoCount; i++) {
            ensos.push(new Enso(i));
        }
    }

    createElements();

    let resizeTimeout;
    const handleResize = () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            resize();
            createElements();
        }, 250);
    };

    window.addEventListener('resize', handleResize);

    function animate() {
        time++;
        ctx.clearRect(0, 0, width, height);

        waves.forEach(w => w.draw(time));
        inkCurves.forEach(c => {
            c.update();
            c.draw();
        });
        ensos.forEach(e => {
            e.update(time);
            e.draw(time);
        });
        petals.forEach(p => {
            p.update(time);
            p.draw();
        });

        animationId = requestAnimationFrame(animate);
    }

    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (!animationId) animate();
            } else {
                if (animationId) {
                    cancelAnimationFrame(animationId);
                    animationId = null;
                }
            }
        });
    }, { threshold: 0.05 });

    heroObserver.observe(parent);

    return () => {
        window.removeEventListener('resize', handleResize);
        clearTimeout(resizeTimeout);
        heroObserver.disconnect();
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
    };
  }, []);

  return <canvas ref={canvasRef} className="hero-canvas" id="hero-canvas" />;
}

export default HeroCanvas;
