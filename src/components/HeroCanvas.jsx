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

    // Traditional Japanese Shōchikubai (Pine, Bamboo, Plum) Woodblock Palette
    // Matching the indigo pine/plum, burnt terracotta bamboo, and mist-grey wash on warm washi paper
    const palettes = {
      indigoInk: [
        'rgba(22, 42, 86, 0.16)',   // Deep Prussian Indigo
        'rgba(29, 53, 100, 0.13)',  // Medium Indigo Ink
        'rgba(15, 31, 66, 0.18)',   // Dark Sumi Indigo
      ],
      mistWash: [
        'rgba(168, 172, 162, 0.22)', // Soft Stone Mist Grey
        'rgba(186, 189, 179, 0.18)', // Pale Pine Silhouette Grey
        'rgba(22, 42, 86, 0.08)',    // Faint Indigo Wash
      ],
      bambooLeaves: [
        'rgba(196, 81, 54, 0.78)',   // Burnt Terracotta Vermilion
        'rgba(184, 71, 42, 0.72)',   // Deep Rust Sienna
        'rgba(212, 101, 72, 0.68)',  // Warm Vermilion Leaf
      ],
      plumBlossoms: [
        { fill: 'rgba(250, 247, 240, 0.92)', stroke: 'rgba(22, 42, 86, 0.75)' },
        { fill: 'rgba(245, 241, 231, 0.88)', stroke: 'rgba(29, 53, 100, 0.7)' },
        { fill: 'rgba(196, 81, 54, 0.55)', stroke: 'rgba(164, 58, 34, 0.75)' },
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

    // Calligraphic Breeze Lines (Sumi-e / Woodblock Wind)
    class BreezeLine {
      constructor(index, total) {
        this.index = index;
        this.total = total;
        this.baseY = (height * 0.12) + (height * 0.76) * (index / total);
        this.amplitude = 14 + Math.random() * 28;
        this.frequency = 0.0018 + Math.random() * 0.0022;
        this.speed = 0.22 + Math.random() * 0.35;
        this.phase = Math.random() * Math.PI * 2;
        this.lineWidth = 0.8 + Math.random() * 1.4;
        this.color = index % 2 === 0
          ? palettes.indigoInk[index % palettes.indigoInk.length]
          : palettes.mistWash[index % palettes.mistWash.length];
        this.amp2 = 6 + Math.random() * 12;
        this.freq2 = 0.004 + Math.random() * 0.003;
        this.speed2 = 0.4 + Math.random() * 0.6;
      }

      draw(t) {
        ctx.beginPath();
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.lineWidth;
        ctx.lineCap = 'round';

        const segments = Math.ceil(width / 4);
        for (let i = 0; i <= segments; i++) {
          const x = (i / segments) * (width + 40) - 20;
          const normalX = x / width;

          const y1 = Math.sin((x * this.frequency) + (t * this.speed * 0.01) + this.phase) * this.amplitude;
          const y2 = Math.sin((x * this.freq2) + (t * this.speed2 * 0.01) + this.phase * 1.5) * this.amp2;
          const envelope = Math.sin(normalX * Math.PI) * 0.85 + 0.15;

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

    // Drifting Terracotta Bamboo Leaves (Take)
    class BambooLeaf {
      constructor() {
        this.reset(true);
      }

      reset(initial) {
        this.x = Math.random() * width;
        this.y = initial ? Math.random() * height : -30;
        this.length = 10 + Math.random() * 12;
        this.width = this.length * (0.22 + Math.random() * 0.08);
        this.speedY = 0.25 + Math.random() * 0.55;
        this.speedX = -0.25 + Math.random() * 0.65;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.018;
        this.wobbleFreq = 0.012 + Math.random() * 0.015;
        this.wobblePhase = Math.random() * Math.PI * 2;
        this.color = palettes.bambooLeaves[Math.floor(Math.random() * palettes.bambooLeaves.length)];
        this.opacity = 0.45 + Math.random() * 0.4;
      }

      update(t) {
        this.y += this.speedY;
        this.x += this.speedX + Math.sin(t * this.wobbleFreq + this.wobblePhase) * 0.35;
        this.rotation += this.rotationSpeed + Math.cos(t * this.wobbleFreq + this.wobblePhase) * 0.004;

        if (this.y > height + 30 || this.x < -40 || this.x > width + 40) {
          this.reset(false);
        }
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.globalAlpha = this.opacity;

        // Sharp lance-shaped bamboo leaf matching the terracotta print
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.moveTo(-this.length, 0);
        ctx.quadraticCurveTo(-this.length * 0.2, -this.width, this.length, 0);
        ctx.quadraticCurveTo(-this.length * 0.2, this.width, -this.length, 0);
        ctx.closePath();
        ctx.fill();

        // Subtle center vein
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(250, 247, 240, 0.45)';
        ctx.lineWidth = 0.6;
        ctx.moveTo(-this.length * 0.75, 0);
        ctx.lineTo(this.length * 0.65, 0);
        ctx.stroke();

        ctx.globalAlpha = 1;
        ctx.restore();
      }
    }

    // Floating Indigo-Edged Plum Blossom Petals & Flowers (Ume)
    class PlumPetal {
      constructor() {
        this.reset(true);
      }

      reset(initial) {
        this.x = Math.random() * width;
        this.y = initial ? Math.random() * height : -24;
        this.isFullFlower = Math.random() < 0.28;
        this.size = this.isFullFlower ? (4.5 + Math.random() * 3.5) : (3.5 + Math.random() * 4.5);
        this.speedY = 0.22 + Math.random() * 0.55;
        this.speedX = -0.3 + Math.random() * 0.6;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.02;
        this.wobbleFreq = 0.01 + Math.random() * 0.018;
        this.wobblePhase = Math.random() * Math.PI * 2;
        this.style = palettes.plumBlossoms[Math.floor(Math.random() * palettes.plumBlossoms.length)];
        this.opacity = 0.55 + Math.random() * 0.35;
      }

      update(t) {
        this.y += this.speedY;
        this.x += this.speedX + Math.sin(t * this.wobbleFreq + this.wobblePhase) * 0.35;
        this.rotation += this.rotationSpeed;

        if (this.y > height + 24 || this.x < -30 || this.x > width + 30) {
          this.reset(false);
        }
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.globalAlpha = this.opacity;

        if (this.isFullFlower) {
          // 5-petal Japanese Ume (plum) blossom in indigo ink & ivory fill
          for (let i = 0; i < 5; i++) {
            ctx.save();
            ctx.rotate((i * Math.PI * 2) / 5);
            ctx.beginPath();
            ctx.fillStyle = this.style.fill;
            ctx.strokeStyle = this.style.stroke;
            ctx.lineWidth = 0.85;
            ctx.arc(0, -this.size * 0.72, this.size * 0.48, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            ctx.restore();
          }
          // Center stamen dots
          ctx.beginPath();
          ctx.fillStyle = 'rgba(22, 42, 86, 0.85)';
          ctx.arc(0, 0, this.size * 0.22, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Single rounded plum petal with indigo ink outline
          ctx.beginPath();
          ctx.fillStyle = this.style.fill;
          ctx.strokeStyle = this.style.stroke;
          ctx.lineWidth = 0.8;
          ctx.moveTo(0, -this.size);
          ctx.bezierCurveTo(
            this.size * 0.9, -this.size * 0.6,
            this.size * 0.85, this.size * 0.5,
            0, this.size * 0.7
          );
          ctx.bezierCurveTo(
            -this.size * 0.85, this.size * 0.5,
            -this.size * 0.9, -this.size * 0.6,
            0, -this.size
          );
          ctx.fill();
          ctx.stroke();
        }

        ctx.globalAlpha = 1;
        ctx.restore();
      }
    }

    // Calligraphic Ink Branch / Mist Curve
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
        this.startY = height * 0.18 + Math.random() * height * 0.64;
        this.endY = height * 0.18 + Math.random() * height * 0.64;
        this.cp1x = width * 0.2 + Math.random() * width * 0.3;
        this.cp1y = Math.random() * height;
        this.cp2x = width * 0.5 + Math.random() * width * 0.3;
        this.cp2y = Math.random() * height;
        this.progress = 0;
        this.speed = 0.001 + Math.random() * 0.0018;
        this.lineWidth = 1 + Math.random() * 2.2;
        this.color = palettes.indigoInk[this.index % palettes.indigoInk.length];
        this.life = 0;
        this.maxLife = 320 + Math.random() * 380;
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
          const x = u * u * u * this.startX + 3 * u * u * t * this.cp1x + 3 * u * t * t * this.cp2x + t * t * t * this.endX;
          const y = u * u * u * this.startY + 3 * u * u * t * this.cp1y + 3 * u * t * t * this.cp2y + t * t * t * this.endY;
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
        this.cy = height * 0.18 + Math.random() * height * 0.64;
        this.radius = 36 + Math.random() * 75;
        this.startAngle = Math.random() * Math.PI * 2;
        this.gapSize = 0.35 + Math.random() * 0.75;
        this.progress = 0;
        this.speed = 0.0035 + Math.random() * 0.0035;
        this.lineWidth = 1.4 + Math.random() * 1.8;
        this.color = this.index % 2 === 0
          ? 'rgba(22, 42, 86, 0.12)'
          : 'rgba(196, 81, 54, 0.10)';
        this.life = 0;
        this.maxLife = 420 + Math.random() * 280;
        this.rotationOffset = Math.random() * 0.0008;
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
        ctx.globalAlpha = fade;
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

    const breezeCount = 5;
    const bambooLeafCount = 14;
    const plumPetalCount = 18;
    const inkCurveCount = 3;
    const ensoCount = 2;

    let breezes = [];
    let bambooLeaves = [];
    let plumPetals = [];
    let inkCurves = [];
    let ensos = [];

    function createElements() {
      breezes = [];
      bambooLeaves = [];
      plumPetals = [];
      inkCurves = [];
      ensos = [];

      for (let i = 0; i < breezeCount; i++) {
        breezes.push(new BreezeLine(i, breezeCount));
      }
      for (let i = 0; i < bambooLeafCount; i++) {
        bambooLeaves.push(new BambooLeaf());
      }
      for (let i = 0; i < plumPetalCount; i++) {
        plumPetals.push(new PlumPetal());
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

      breezes.forEach(b => b.draw(time));
      inkCurves.forEach(c => {
        c.update();
        c.draw();
      });
      ensos.forEach(e => {
        e.update(time);
        e.draw(time);
      });
      bambooLeaves.forEach(l => {
        l.update(time);
        l.draw();
      });
      plumPetals.forEach(p => {
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
