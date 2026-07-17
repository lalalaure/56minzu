
/**
 * 视觉渲染模块 v3 — 鎏金岩彩敦煌风
 * 莫高窟壁画美学 · 矿物颜料 · 金线描边 · 飞天飘带 · 坛城徽章
 */

class VisualSystem {
  constructor() {
    this.canvas = document.getElementById('mainCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.currentIndex = 0;
    this.emblemScale = 0;
    this.targetEmblemScale = 0;
    this.particleMode = 'float';
    this.convergeProgress = 0;
    this.glowAlpha = 0;
    this.transitioning = false;
    this.transitionAlpha = 1;
    this.time = 0;

    this.unlockRingActive = false;
    this.unlockRingProgress = 0;
    this.unlockParticles = [];
    this.unlockSparkles = [];

    this.glowWaveActive = false;
    this.glowWaveProgress = 0;
    this.glowWaveAlpha = 0;

    this.outerRingAngle = 0;
    this.midRingAngle = 0;
    this.innerRingAngle = 0;

    this.emblemX = 0;
    this.emblemY = 0;

    this.infoActive = false;
    this._transitionCallback = null;
    this.emblemPulseActive = false;
    this.emblemPulseTime = 0;
    this.connectionParticles = [];

    this.apsarasSilhouettes = [];
    this.scatteredFlowers = [];
    this.clouds = [];
    this.caissonPatternCanvas = null;

    this.convergeArmAngle = 0;

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.initParticles();
    this.startLoop();
    this.convergeOverlay = document.getElementById('convergeOverlay');
  }

  resize() {
    const dpr = window.devicePixelRatio || 1;
    const w = window.innerWidth;
    const h = window.innerHeight;
    this._w = w;
    this._h = h;
    this._dpr = dpr;
    this.canvas.width = w * dpr;
    this.canvas.height = h * dpr;
    this.canvas.style.width = w + 'px';
    this.canvas.style.height = h + 'px';
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.initScatteredFlowers();
    this.initClouds();
    this.generateCaissonPattern();
    this.emblemX = w * 0.5;
    this.emblemY = h * 0.22;
  }

  generateCaissonPattern() {
    const w = this._w, h = this._h, dpr = this._dpr || 1;
    if (w === 0 || h === 0) return;
    const cc = document.createElement('canvas');
    cc.width = w * dpr; cc.height = h * dpr;
    cc.style.width = w + 'px'; cc.style.height = h + 'px';
    const ctx = cc.getContext('2d');
    ctx.scale(dpr, dpr);
    const grid = 100;
    ctx.globalAlpha = 0.035;
    for (let gy = 0; gy < h + grid; gy += grid) {
      for (let gx = 0; gx < w + grid; gx += grid) {
        const cx = gx + (gy % (grid*2) === 0 ? grid/2 : 0);
        const cy = gy;

        // 金色十字纹 (thicker)
        ctx.strokeStyle = '#D4A017';
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(cx - grid*0.38, cy);
        ctx.lineTo(cx + grid*0.38, cy);
        ctx.moveTo(cx, cy - grid*0.38);
        ctx.lineTo(cx, cy + grid*0.38);
        ctx.stroke();

        // 菱形框
        ctx.strokeStyle = '#D4A017';
        ctx.lineWidth = 0.5;
        ctx.globalAlpha = 0.02;
        ctx.beginPath();
        ctx.moveTo(cx, cy - grid*0.32);
        ctx.lineTo(cx + grid*0.28, cy);
        ctx.lineTo(cx, cy + grid*0.32);
        ctx.lineTo(cx - grid*0.28, cy);
        ctx.closePath();
        ctx.stroke();

        // 小十字纹（菱形四角）
        ctx.strokeStyle = '#F0D080';
        ctx.lineWidth = 0.4;
        ctx.globalAlpha = 0.018;
        const crossPositions = [
          [cx, cy - grid*0.32],
          [cx + grid*0.28, cy],
          [cx, cy + grid*0.32],
          [cx - grid*0.28, cy]
        ];
        crossPositions.forEach(([px, py]) => {
          ctx.beginPath();
          ctx.moveTo(px - 3, py);
          ctx.lineTo(px + 3, py);
          ctx.moveTo(px, py - 3);
          ctx.lineTo(px, py + 3);
          ctx.stroke();
        });

        // 朱砂色小圆
        ctx.strokeStyle = '#B54A3A';
        ctx.lineWidth = 0.6;
        ctx.globalAlpha = 0.035;
        ctx.beginPath();
        ctx.arc(cx, cy, grid*0.10, 0, Math.PI*2);
        ctx.stroke();

        ctx.globalAlpha = 0.035;
      }
    }
    this.caissonPatternCanvas = cc;
  }

  initScatteredFlowers() {
    this.scatteredFlowers = [];
    for (let i = 0; i < 30; i++) {
      this.scatteredFlowers.push({
        x: Math.random() * this._w,
        y: Math.random() * this._h,
        r: 3 + Math.random() * 6,
        alpha: 0.04 + Math.random() * 0.06,
        vx: (Math.random() - 0.5) * 0.15,
        vy: -0.02 - Math.random() * 0.03,
        phase: Math.random() * Math.PI * 2,
        color: ['#F0E0C0', '#D4A017', '#E8C8B0', '#F5E6D0', '#FFF5E0'][Math.floor(Math.random() * 5)]
      });
    }
  }

  initClouds() {
    this.clouds = [];
    for (let i = 0; i < 4; i++) {
      this.clouds.push({
        x: Math.random() * this._w,
        y: 0.1 + Math.random() * 0.6,
        size: 60 + Math.random() * 100,
        alpha: 0.015 + Math.random() * 0.02,
        vx: 0.08 + Math.random() * 0.06,
        width: 120 + Math.random() * 80,
        height: 30 + Math.random() * 20,
        phase: Math.random() * Math.PI * 2
      });
    }
  }

  initApsarasSilhouettes() {
    this.apsarasSilhouettes = [];
    const w = this._w, h = this._h;
    for (let i = 0; i < 3; i++) {
      this.apsarasSilhouettes.push({
        x: Math.random() * w,
        y: h * (0.1 + i * 0.08 + Math.random() * 0.05),
        vx: (i % 2 === 0 ? 1 : -1) * (0.15 + Math.random() * 0.1),
        scale: 0.6 + Math.random() * 0.5,
        alpha: 0.05 + Math.random() * 0.04,
        phase: Math.random() * Math.PI * 2,
        flip: i % 2 === 0 ? 1 : -1
      });
    }
  }

  initParticles() {
    this.particles = [];
    const shapes = ['lotus', 'cloud', 'treasure', 'spark', 'flame'];
    for (let i = 0; i < 72; i++) {
      const g = ETHNIC_GROUPS[i % ETHNIC_GROUPS.length];
      this.particles.push({
        x: Math.random() * (this._w + 200) - 100,
        y: Math.random() * (this._h + 200) - 100,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        r: 2 + Math.random() * 2.5,
        color: g.colors[Math.floor(Math.random() * g.colors.length)],
        alpha: 0.25 + Math.random() * 0.35,
        targetX: 0, targetY: 0,
        originX: (this.emblemX || this._w / 2) + (Math.random() - 0.5) * 300,
        originY: (this.emblemY || this._h / 2) + (Math.random() - 0.5) * 300,
        phase: Math.random() * Math.PI * 2,
        shape: shapes[i % shapes.length],
        id: i
      });
    }
  }

  setGroup(index) {
    if (index < 0 || index >= ETHNIC_GROUPS.length) return;
    this.currentIndex = index;
    this.updateTopBar();
  }

  updateTopBar() {
    const g = ETHNIC_GROUPS[this.currentIndex];
    document.getElementById('groupName').textContent = g.name;
    document.getElementById('groupSub').textContent = g.festival;
  }

  startLoop() {
    const loop = () => {
      this.time++;
      this.update();
      this.render();
      this.outerRingAngle += 0.003;
      this.midRingAngle += 0.005;
      this.innerRingAngle += 0.009;
      this.animationId = requestAnimationFrame(loop);
    };
    loop();
  }

  showEmblem() {
    const w = this._w;
    this.targetEmblemScale = w < 500 ? 0.5 : w < 900 ? 0.55 : 0.65;
    this.particleMode = 'float';
    this.convergeOverlay.classList.add('hidden');
    this.glowAlpha = 1;
  }

  setInfoActive(active) {
    this.infoActive = active;
    if (!active) this.connectionParticles = [];
  }

  emblemPulse() {
    this.emblemPulseActive = true;
    this.emblemPulseTime = 0;
  }

  hideEmblem() { this.targetEmblemScale = 0; }

  startConverge() {
    this.particleMode = 'converge';
    this.convergeProgress = 0;
    this.convergeArmAngle = 0;
    this.particles.forEach(p => { p.originX = p.x; p.originY = p.y; });
  }

  resetFloat() {
    this.particleMode = 'float';
    this.convergeOverlay.classList.add('hidden');
    this.glowAlpha = 1;
    this.particles.forEach(p => {
      p.originX = p.x; p.originY = p.y;
      p.vx = (Math.random() - 0.5) * 1.2;
      p.vy = (Math.random() - 0.5) * 1.2;
    });
  }

  transitionToGroup(index, callback) {
    if (index < 0 || index >= ETHNIC_GROUPS.length) return;
    this.transitioning = true;
    this._transitionCallback = callback || null;
    this.transitionDirection = 1;
    this.transitionAlpha = 1;
    this.currentIndex = index;
    this.updateTopBar();
  }

  triggerUnlockRing() {
    this.unlockRingActive = true;
    this.unlockRingProgress = 0;
    // 金色粒子爆发
    this.unlockParticles = [];
    this.unlockSparkles = [];
    const cx = this.emblemX || this._w / 2;
    const cy = this.emblemY || this._h / 2;
    const baseR = 120 * (this.emblemScale || 1);
    // 30+ 金色粒子向外扩散
    for (let i = 0; i < 36; i++) {
      const angle = (Math.PI * 2 * i) / 36 + Math.random() * 0.3;
      const speed = 1.5 + Math.random() * 3;
      this.unlockParticles.push({
        x: cx + Math.cos(angle) * baseR * 0.6,
        y: cy + Math.sin(angle) * baseR * 0.6,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.5,
        r: 2 + Math.random() * 3,
        alpha: 1,
        decay: 0.012 + Math.random() * 0.008,
        gravity: 0.02,
        hue: Math.random() > 0.7 ? 45 : 38,
        twinkle: Math.random() * Math.PI * 2
      });
    }
    // 16 个闪烁星光
    for (let i = 0; i < 16; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = baseR * (0.3 + Math.random() * 0.5);
      this.unlockSparkles.push({
        x: cx + Math.cos(angle) * dist,
        y: cy + Math.sin(angle) * dist,
        size: 4 + Math.random() * 6,
        alpha: 0,
        maxAlpha: 0.6 + Math.random() * 0.4,
        delay: Math.random() * 0.3,
        life: 0,
        duration: 0.8 + Math.random() * 0.6
      });
    }
  }

  /* Draw card glow wave — brief golden pulse on the canvas */
  drawGlowWave() {
    this.glowWaveActive = true;
    this.glowWaveProgress = 0;
    this.glowWaveAlpha = 0.6;
  }

  easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

  roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  update() {
    const w = this._w, h = this._h;
    const cx = this.emblemX || w/2, cy = this.emblemY || h/2;

    if (this.transitioning) {
      this.transitionAlpha -= 0.08;
      if (this.transitionAlpha <= 0) {
        this.transitioning = false;
        this.transitionAlpha = 1;
        this.particles.forEach(p => {
          const a = Math.random() * Math.PI * 2, d = 150 + Math.random() * 200;
          p.x = cx + Math.cos(a) * d; p.y = cy + Math.sin(a) * d;
          p.vx = (Math.random() - 0.5) * 2; p.vy = (Math.random() - 0.5) * 2;
          p.alpha = 0.3 + Math.random() * 0.3;
        });
        if (this._transitionCallback) {
          const cb = this._transitionCallback;
          this._transitionCallback = null;
          cb();
        }
      }
    }

    if (this.particleMode === 'converge') {
      this.convergeProgress = Math.min(1, this.convergeProgress + 0.008);
      const ease = this.easeOutCubic(this.convergeProgress);
      this.convergeArmAngle += 0.002;
      const rotOffset = ease > 0.85 ? this.convergeArmAngle * (1 - ease) * 10 : 0;
      const half = Math.ceil(this.particles.length / 2);
      this.particles.forEach((p, i) => {
        const isOuter = i < half;
        const idx = isOuter ? i : i - half;
        const count = half;
        const offset = isOuter ? 0 : (0.5 / count) * Math.PI * 2;
        const a = (idx / count) * Math.PI * 2 + offset + rotOffset * (isOuter ? 0.5 : -0.3);
        const rr = isOuter ? 130 : 65;
        const tx = cx + Math.cos(a) * rr * ease, ty = cy + Math.sin(a) * rr * ease;
        p.x += (tx - p.x) * 0.06; p.y += (ty - p.y) * 0.06;
        p.r = isOuter
          ? (idx % 4 === 0 ? 4 + ease * 2 : 2 + ease * 1.5)
          : (idx % 3 === 0 ? 2.5 + ease * 1.5 : 1.5 + ease * 1);
        p.alpha = 0.4 + ease * 0.6;
        if (ease < 0.3) {
          const twinkle = 0.8 + 0.2 * Math.sin(p.phase + this.time * 0.05);
          p.alpha *= twinkle;
        }
      });
      if (this.convergeProgress > 0.8) {
        this.convergeOverlay.classList.remove('hidden');
        this.glowAlpha = Math.max(0, this.glowAlpha - 0.02);
        this.targetEmblemScale = Math.max(0, this.targetEmblemScale - 0.02);
      }
    } else {
      this.particles.forEach(p => {
        if (this.transitioning) {
          p.x += (p.originX - p.x) * 0.3;
          p.y += (p.originY - p.y) * 0.3;
          p.alpha = Math.max(0.1, p.alpha - 0.01);
        } else {
          p.x += p.vx; p.y += p.vy;
          p.vx += (Math.random() - 0.5) * 0.02;
          p.vy += (Math.random() - 0.5) * 0.02;
          const sp = Math.hypot(p.vx, p.vy);
          if (sp > 1.2) { p.vx = (p.vx/sp)*1.2; p.vy = (p.vy/sp)*1.2; }
          if (p.x < -100) p.x = w + 100;
          if (p.x > w + 100) p.x = -100;
          if (p.y < -100) p.y = h + 100;
          if (p.y > h + 100) p.y = -100;
          p.alpha = Math.min(0.6, 0.2 + Math.abs(Math.sin(p.phase + Date.now() * 0.0005)) * 0.35);
        }
      });
    }

    const sd = this.targetEmblemScale - this.emblemScale;
    this.emblemScale += sd * 0.12;
    if (this.glowAlpha > 0) this.glowAlpha = Math.max(0, this.glowAlpha - 0.003);
    if (this.unlockRingActive) {
      this.unlockRingProgress += 0.022;
      if (this.unlockRingProgress >= 1) this.unlockRingActive = false;
      // 更新解锁粒子
      this.unlockParticles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.alpha -= p.decay;
        p.twinkle += 0.15;
      });
      this.unlockParticles = this.unlockParticles.filter(p => p.alpha > 0);
      // 更新闪烁星光
      this.unlockSparkles.forEach(s => {
        s.life += 0.016;
        if (s.life >= s.delay) {
          const t = (s.life - s.delay) / s.duration;
          if (t < 0.3) s.alpha = s.maxAlpha * (t / 0.3);
          else if (t < 1) s.alpha = s.maxAlpha * (1 - (t - 0.3) / 0.7);
          else s.alpha = 0;
        }
      });
      this.unlockSparkles = this.unlockSparkles.filter(s => s.life < s.delay + s.duration);
    }
    if (this.glowWaveActive) {
      this.glowWaveProgress += 0.035;
      this.glowWaveAlpha = Math.max(0, 0.6 * (1 - this.glowWaveProgress));
      if (this.glowWaveProgress >= 1) { this.glowWaveActive = false; this.glowWaveAlpha = 0; }
    }
    if (this.emblemPulseActive) {
      this.emblemPulseTime += 0.025;
      if (this.emblemPulseTime >= 1) this.emblemPulseActive = false;
    }
    if (this.infoActive) {
      if (this.connectionParticles.length < 10 && Math.random() < 0.12) {
        this.connectionParticles.push({
          x: this.emblemX + 160 * this.emblemScale,
          y: this.emblemY + (Math.random() - 0.5) * 60,
          vx: 1.8 + Math.random() * 0.8,
          vy: (Math.random() - 0.5) * 0.6,
          alpha: 0.4 + Math.random() * 0.3,
          r: 1 + Math.random() * 1.5,
          phase: Math.random() * Math.PI * 2
        });
      }
      this.connectionParticles = this.connectionParticles.filter(p => {
        p.x += p.vx; p.y += p.vy;
        p.alpha -= 0.012;
        return p.alpha > 0 && p.x < this._w + 20;
      });
    } else {
      this.connectionParticles = [];
    }
  }

  render() {
    const ctx = this.ctx, w = this._w, h = this._h, t = this.time;
    ctx.clearRect(0, 0, w, h);

    if (this.caissonPatternCanvas) {
      ctx.globalAlpha = 0.5;
      ctx.drawImage(this.caissonPatternCanvas, 0, 0);
      ctx.globalAlpha = 1;
    }
    this.drawCaveGlow(ctx, w, h);
    this.drawCaissonBorder(ctx, w, h);
    this.drawAuspiciousClouds(ctx, w, h, t);
    this.drawScatteredFlowers(ctx, w, h, t);

    // Particles (only during converge/transition)
    if (this.particleMode !== 'float') {
      if (this.particleMode === 'converge') {
        const cx = this.emblemX || w/2, cy = this.emblemY || h/2;
        const p = this.convergeProgress;
        const t = this.time;
        const half = this.particles.length >> 1;

        // --- Soft halo ---
        ctx.save();
        const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 150);
        glow.addColorStop(0, 'rgba(180,130,50,0)');
        glow.addColorStop(0.4, 'rgba(212,160,23,' + (0.02 * p) + ')');
        glow.addColorStop(0.7, 'rgba(180,120,50,' + (0.01 * p) + ')');
        glow.addColorStop(1, 'rgba(180,130,50,0)');
        ctx.fillStyle = glow;
        ctx.fillRect(cx - 200, cy - 200, 400, 400);
        ctx.restore();

        // --- Faint golden ring ---
        if (p > 0.5) {
          ctx.save();
          const ringAlpha = (p - 0.5) * 2 * 0.06;
          ctx.globalAlpha = ringAlpha;
          ctx.strokeStyle = 'rgba(180,140,60,0.15)';
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.arc(cx, cy, 130, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }

        // --- Particles ---
        for (let i = 0; i < this.particles.length; i++) {
          const pt = this.particles[i];
          if (pt.alpha < 0.01) continue;
          const isOuter = i < half;
          const idx = isOuter ? i : i - half;
          const angle = ((idx / half) + (isOuter ? 0 : 0.5 / half)) * Math.PI * 2;
          const sizeGroup = idx % 6;
          const isDiamond = isOuter && sizeGroup === 0;
          const isMedium = !isDiamond && (sizeGroup === 2 || sizeGroup === 4);
          const isSmall = !isDiamond && !isMedium;
          const scale = isDiamond ? 1.2 : isMedium ? 0.8 : 0.55;
          const drawR = pt.r * scale;

          ctx.globalAlpha = pt.alpha * (0.9 + 0.1 * Math.sin(t * 0.025 + idx * 0.5));

          if (isDiamond) {
            ctx.shadowBlur = 16;
            ctx.shadowColor = 'rgba(212,160,23,0.35)';
            ctx.save();
            ctx.translate(pt.x, pt.y);
            ctx.rotate(0.785 + t * 0.006);
            const g = ctx.createLinearGradient(-drawR, 0, drawR, 0);
            g.addColorStop(0, '#A67B20');
            g.addColorStop(0.5, '#F0D080');
            g.addColorStop(1, '#A67B20');
            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.moveTo(0, -drawR);
            ctx.lineTo(drawR * 0.5, 0);
            ctx.lineTo(0, drawR);
            ctx.lineTo(-drawR * 0.5, 0);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
          } else {
            ctx.shadowBlur = isOuter ? 10 : 6;
            ctx.shadowColor = 'rgba(180,140,60,0.2)';
            ctx.fillStyle = isOuter
              ? (isMedium ? '#C89B28' : '#A67B20')
              : (sizeGroup % 3 === 0 ? '#C89B28' : '#7A5E1A');
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, drawR, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
      } else {
        this.particles.forEach(p => {
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.globalAlpha = 1;
      }
    }

    // Emblem
    if (this.emblemScale > 0.01) {
      const es = this.transitioning ? this.emblemScale * this.transitionAlpha : this.emblemScale;
      if (es > 0.01) this.drawMandalaEmblem(this.emblemX, this.emblemY, es);
    }

    // Decorative connectors between emblem and info card
    this.drawDecorativeConnectors(ctx, w, h);

    // Unlock ring — 多层金色光环 + 粒子爆发
    if (this.unlockRingActive) {
      const pp = this.unlockRingProgress;
      const baseScale = this.emblemScale;
      const cx = this.emblemX, cy = this.emblemY;

      // 外层主光环
      const r1 = 200 * baseScale * (0.75 + pp * 0.4);
      const a1 = (1 - pp) * 0.7;
      ctx.beginPath();
      ctx.arc(cx, cy, r1, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(240,208,128,' + a1 + ')';
      ctx.lineWidth = (4 - pp * 2.5) * baseScale;
      ctx.shadowColor = 'rgba(255,215,0,' + (a1 * 0.5) + ')';
      ctx.shadowBlur = 40;
      ctx.stroke();

      // 中层光环（朱砂色）
      const r2 = 160 * baseScale * (0.7 + pp * 0.35);
      const a2 = (1 - pp) * 0.45;
      ctx.beginPath();
      ctx.arc(cx, cy, r2, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(204,51,51,' + a2 + ')';
      ctx.lineWidth = (2 - pp * 1.2) * baseScale;
      ctx.shadowColor = 'rgba(204,51,51,' + (a2 * 0.4) + ')';
      ctx.shadowBlur = 25;
      ctx.stroke();

      // 内层细光环
      const r3 = 120 * baseScale * (0.65 + pp * 0.3);
      const a3 = (1 - pp) * 0.5;
      ctx.beginPath();
      ctx.arc(cx, cy, r3, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(212,160,23,' + a3 + ')';
      ctx.lineWidth = (1.5 - pp) * baseScale;
      ctx.shadowBlur = 15;
      ctx.stroke();

      ctx.shadowBlur = 0;

      // 金色扩散粒子
      this.unlockParticles.forEach(p => {
        const twinkleAlpha = p.alpha * (0.6 + 0.4 * Math.sin(p.twinkle));
        ctx.globalAlpha = twinkleAlpha;
        // 粒子光晕
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 3);
        grad.addColorStop(0, p.hue > 40 ? 'rgba(255,230,150,1)' : 'rgba(240,208,128,1)');
        grad.addColorStop(0.4, p.hue > 40 ? 'rgba(255,200,80,0.5)' : 'rgba(212,160,23,0.4)');
        grad.addColorStop(1, 'rgba(212,160,23,0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2);
        ctx.fill();
        // 粒子核心
        ctx.fillStyle = p.hue > 40 ? '#FFF5D0' : '#F0D080';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 0.6, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;

      // 闪烁星光
      this.unlockSparkles.forEach(s => {
        if (s.alpha <= 0) return;
        ctx.globalAlpha = s.alpha;
        ctx.strokeStyle = '#FFF5D0';
        ctx.lineWidth = 1.5;
        ctx.shadowColor = 'rgba(255,215,0,0.8)';
        ctx.shadowBlur = 10;
        // 十字星光
        ctx.beginPath();
        ctx.moveTo(s.x - s.size, s.y);
        ctx.lineTo(s.x + s.size, s.y);
        ctx.moveTo(s.x, s.y - s.size);
        ctx.lineTo(s.x, s.y + s.size);
        ctx.stroke();
        // 斜向星光
        ctx.beginPath();
        ctx.moveTo(s.x - s.size * 0.5, s.y - s.size * 0.5);
        ctx.lineTo(s.x + s.size * 0.5, s.y + s.size * 0.5);
        ctx.moveTo(s.x - s.size * 0.5, s.y + s.size * 0.5);
        ctx.lineTo(s.x + s.size * 0.5, s.y - s.size * 0.5);
        ctx.stroke();
      });
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;
    }

    // Glow wave (from card draw) — 多层抽卡光波
    if (this.glowWaveActive) {
      const pp = this.glowWaveProgress;
      const cx = this.emblemX, cy = this.emblemY;
      const aa = this.glowWaveAlpha * 0.5;

      // 主光波 — 金色
      const r1 = 80 + pp * 450;
      ctx.beginPath();
      ctx.arc(cx, cy, r1, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(240,208,128,' + aa + ')';
      ctx.lineWidth = 5 * (1 - pp);
      ctx.shadowColor = 'rgba(255,215,0,' + (aa * 0.5) + ')';
      ctx.shadowBlur = 60;
      ctx.stroke();

      // 第二道光波 — 朱砂色
      const r2 = 40 + pp * 350;
      ctx.beginPath();
      ctx.arc(cx, cy, r2, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(204,51,51,' + (aa * 0.5) + ')';
      ctx.lineWidth = 3 * (1 - pp);
      ctx.shadowColor = 'rgba(204,51,51,' + (aa * 0.4) + ')';
      ctx.shadowBlur = 35;
      ctx.stroke();

      // 第三道光波 — 石绿色
      const r3 = 20 + pp * 280;
      ctx.beginPath();
      ctx.arc(cx, cy, r3, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(30,140,125,' + (aa * 0.4) + ')';
      ctx.lineWidth = 2 * (1 - pp);
      ctx.shadowBlur = 20;
      ctx.stroke();

      // 中心闪光
      if (pp < 0.3) {
        const flashAlpha = (1 - pp / 0.3) * 0.4;
        const flashGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 100 * (1 - pp));
        flashGrad.addColorStop(0, 'rgba(255,240,200,' + flashAlpha + ')');
        flashGrad.addColorStop(0.5, 'rgba(240,208,128,' + (flashAlpha * 0.5) + ')');
        flashGrad.addColorStop(1, 'rgba(212,160,23,0)');
        ctx.fillStyle = flashGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, 100 * (1 - pp), 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.shadowBlur = 0;
    }

    // Connection particles
    if (this.infoActive && this.connectionParticles.length > 0) {
      this.connectionParticles.forEach(p => {
        ctx.fillStyle = '#D4A017';
        ctx.globalAlpha = p.alpha * 0.4;
        ctx.shadowColor = 'rgba(212,160,23,0.3)';
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;
    }
  }

  drawCaveGlow(ctx, w, h) {
    const g = ctx.createRadialGradient(w/2, h/2 - h*0.08, 0, w/2, h/2 - h*0.08, Math.max(w, h) * 0.45);
    g.addColorStop(0, 'rgba(255,220,180,0.1)');
    g.addColorStop(0.2, 'rgba(240,200,140,0.06)');
    g.addColorStop(0.5, 'rgba(212,160,23,0.03)');
    g.addColorStop(0.8, 'rgba(180,140,100,0.015)');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    const mainLights = [
      { x: w * 0.30, y: h * 0.30, r: 100, rCol: 255, gCol: 200, bCol: 140 },
      { x: w * 0.70, y: h * 0.35, r: 85, rCol: 255, gCol: 180, bCol: 110 },
      { x: w * 0.50, y: h * 0.45, r: 60, rCol: 255, gCol: 170, bCol: 90 }
    ];
    mainLights.forEach((ml, i) => {
      const flicker = 0.75 + Math.sin(this.time * 0.025 + i * 2.3) * 0.15 + Math.sin(this.time * 0.06 + i) * 0.08;
      const r = ml.r * (0.9 + Math.sin(this.time * 0.018 + i * 1.5) * 0.1);
      const g2 = ctx.createRadialGradient(ml.x, ml.y, 0, ml.x, ml.y, r);
      g2.addColorStop(0, 'rgba(' + ml.rCol + ',' + ml.gCol + ',' + ml.bCol + ',' + (0.08 * flicker) + ')');
      g2.addColorStop(0.3, 'rgba(' + ml.rCol + ',' + ml.gCol + ',' + ml.bCol + ',' + (0.04 * flicker) + ')');
      g2.addColorStop(0.7, 'rgba(' + ml.rCol + ',' + ml.gCol + ',' + ml.bCol + ',' + (0.015 * flicker) + ')');
      g2.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g2;
      ctx.beginPath();
      ctx.arc(ml.x, ml.y, r, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.globalAlpha = 0.03;
    for (let i = 0; i < 12; i++) {
      const x = w/2 + Math.sin(this.time * 0.0005 + i * 0.6) * w * 0.28;
      const y = h/2 - h*0.08 + Math.cos(this.time * 0.0006 + i * 0.8) * h * 0.18;
      const r = 40 + Math.sin(this.time * 0.0015 + i) * 12;
      const g2 = ctx.createRadialGradient(x, y, 0, x, y, r);
      g2.addColorStop(0, 'rgba(255,210,150,0.12)');
      g2.addColorStop(0.5, 'rgba(212,160,23,0.04)');
      g2.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g2;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    const vg = ctx.createRadialGradient(w/2, h/2, Math.min(w, h) * 0.35, w/2, h/2, Math.max(w, h) * 0.75);
    vg.addColorStop(0, 'rgba(0,0,0,0)');
    vg.addColorStop(0.7, 'rgba(0,0,0,0.08)');
    vg.addColorStop(1, 'rgba(10,5,2,0.35)');
    ctx.fillStyle = vg;
    ctx.fillRect(0, 0, w, h);
  }

  drawCaissonBorder(ctx, w, h) {
    ctx.save();
    const inset = 20;

    // === 外层厚重金框（苏丹式重金边框） ===
    ctx.shadowColor = 'rgba(212,160,23,0.2)';
    ctx.shadowBlur = 6;
    const borderG = ctx.createLinearGradient(inset, inset, w - inset, h - inset);
    borderG.addColorStop(0, 'rgba(212,160,23,0.3)');
    borderG.addColorStop(0.3, 'rgba(240,200,140,0.35)');
    borderG.addColorStop(0.6, 'rgba(212,160,23,0.3)');
    borderG.addColorStop(1, 'rgba(212,160,23,0.25)');
    ctx.strokeStyle = borderG;
    ctx.lineWidth = 2.5;
    ctx.strokeRect(inset, inset, w - inset*2, h - inset*2);
    ctx.shadowBlur = 0;

    // 内层细金线
    ctx.strokeStyle = 'rgba(240,200,140,0.12)';
    ctx.lineWidth = 0.6;
    ctx.strokeRect(inset + 5, inset + 5, w - (inset+5)*2, h - (inset+5)*2);

    // === 边框装饰珠串（更华丽+宝石珠） ===
    const beadR = 3, bi = inset + 10, bs = 12;
    ctx.shadowColor = 'rgba(212,160,23,0.1)';
    ctx.shadowBlur = 4;
    let beadIdx = 0;
    const gemColors = ['#D4A017', '#B54A3A', '#1E8C7D', '#F0D080'];
    for (let x = bi; x <= w - bi; x += bs) {
      for (let y of [bi, h - bi]) {
        const isGem = beadIdx % 5 === 0;
        ctx.beginPath(); ctx.arc(x, y, isGem ? 4 : beadR, 0, Math.PI * 2);
        if (isGem) {
          ctx.fillStyle = gemColors[(beadIdx / 5) % 4];
          ctx.globalAlpha = 0.5;
        } else if (beadIdx % 3 === 0) {
          ctx.fillStyle = '#B54A3A';
          ctx.globalAlpha = 0.35;
        } else if (beadIdx % 3 === 1) {
          ctx.fillStyle = '#D4A017';
          ctx.globalAlpha = 0.5;
        } else {
          ctx.fillStyle = '#F0E0C0';
          ctx.globalAlpha = 0.4;
        }
        ctx.fill();
        if (isGem) {
          ctx.strokeStyle = '#F0D080';
          ctx.lineWidth = 0.5;
          ctx.globalAlpha = 0.4;
          ctx.stroke();
        }
        beadIdx++;
      }
    }
    for (let y = bi + bs; y <= h - bi - bs; y += bs) {
      for (let x of [bi, w - bi]) {
        const isGem = beadIdx % 5 === 0;
        ctx.beginPath(); ctx.arc(x, y, isGem ? 4 : beadR, 0, Math.PI * 2);
        if (isGem) {
          ctx.fillStyle = gemColors[(beadIdx / 5) % 4];
          ctx.globalAlpha = 0.5;
        } else if (beadIdx % 3 === 0) {
          ctx.fillStyle = '#B54A3A';
          ctx.globalAlpha = 0.35;
        } else if (beadIdx % 3 === 1) {
          ctx.fillStyle = '#D4A017';
          ctx.globalAlpha = 0.5;
        } else {
          ctx.fillStyle = '#F0E0C0';
          ctx.globalAlpha = 0.4;
        }
        ctx.fill();
        if (isGem) {
          ctx.strokeStyle = '#F0D080';
          ctx.lineWidth = 0.5;
          ctx.globalAlpha = 0.4;
          ctx.stroke();
        }
        beadIdx++;
      }
    }
    ctx.shadowBlur = 0;

    // === 四角短线装饰（inner tassel marks） ===
    const ti = inset + 16;
    ctx.strokeStyle = 'rgba(212,160,23,0.12)';
    ctx.lineWidth = 0.6;
    ctx.globalAlpha = 0.3;
    for (let x = ti; x < w - ti; x += 50) {
      ctx.beginPath();
      ctx.moveTo(x, ti - 3);
      ctx.lineTo(x, ti + 3);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, h - ti - 3);
      ctx.lineTo(x, h - ti + 3);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    ctx.restore();
  }

  drawDecorativeConnectors(ctx, w, h) {
    if (this.emblemScale < 0.01 || w < 700) return;
    const cx = this.emblemX, cy = this.emblemY;
    const scale = this.emblemScale;
    const R = 200 * scale;

    // 1. Pedestal / base under the emblem
    ctx.save();
    const pw = R * 1.6, ph = 16 * scale;
    const px = cx - pw/2, py = cy + R * 1.05;
    ctx.globalAlpha = 0.25;
    const pg = ctx.createLinearGradient(px, py, px, py + ph);
    pg.addColorStop(0, 'rgba(212,160,23,0.3)');
    pg.addColorStop(0.3, 'rgba(212,160,23,0.1)');
    pg.addColorStop(1, 'rgba(212,160,23,0)');
    ctx.fillStyle = pg;
    ctx.beginPath();
    this.roundRect(ctx, px, py, pw, ph, ph/2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(212,160,23,0.15)';
    ctx.lineWidth = 0.6;
    ctx.stroke();
    // pedestal top line
    ctx.strokeStyle = 'rgba(240,200,140,0.12)';
    ctx.beginPath();
    ctx.moveTo(px + 12*scale, py);
    ctx.lineTo(px + pw - 12*scale, py);
    ctx.stroke();
    // pedestal decorative dots
    ctx.fillStyle = 'rgba(212,160,23,0.15)';
    for (let i = 0; i < 5; i++) {
      const dx = px + 12*scale + (i/(5-1)) * (pw - 24*scale);
      ctx.beginPath();
      ctx.arc(dx, py + ph/2, 2*scale, 0, Math.PI*2);
      ctx.fill();
    }
    ctx.restore();

    // 2. 璎珞 chain from emblem right toward info card
    if (this.infoActive) {
      ctx.save();
      const chainStartX = cx + R * 0.75;
      const chainEndX = Math.min(w * 0.30 + 160, w - 30);
      const chainY = cy - R * 0.35;
      const numBeads = 8;
      ctx.globalAlpha = 0.2 + Math.sin(this.time * 0.002) * 0.08;
      for (let i = 0; i < numBeads; i++) {
        const t = i / (numBeads - 1);
        const bx = chainStartX + (chainEndX - chainStartX) * t;
        const by = chainY + Math.sin(t * Math.PI) * 15 * scale;
        const beadR = (1.5 + Math.sin(this.time * 0.003 + i * 0.8) * 0.5) * scale;
        const grad = ctx.createRadialGradient(bx - beadR*0.3, by - beadR*0.3, 0, bx, by, beadR);
        grad.addColorStop(0, 'rgba(255,240,200,0.6)');
        grad.addColorStop(0.5, 'rgba(212,160,23,0.4)');
        grad.addColorStop(1, 'rgba(139,105,20,0.2)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(bx, by, beadR, 0, Math.PI*2);
        ctx.fill();
        ctx.strokeStyle = 'rgba(212,160,23,0.2)';
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
      // connecting wire
      ctx.strokeStyle = 'rgba(212,160,23,0.08)';
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(chainStartX, chainY);
      for (let i = 0; i <= numBeads; i++) {
        const t = i / numBeads;
        const bx = chainStartX + (chainEndX - chainStartX) * t;
        const by = chainY + Math.sin(t * Math.PI) * 15 * scale;
        ctx.lineTo(bx, by);
      }
      ctx.stroke();
      ctx.restore();
    }

    // 3. Small decorative floating elements near info card side
    if (this.infoActive) {
      ctx.save();
      const ix = Math.min(w * 0.30 + 160, w - 30);
      const iy = cy;
      ctx.globalAlpha = 0.12;
      for (let i = 0; i < 4; i++) {
        const a = this.time * 0.001 + i * 1.57;
        const radius = 40 * scale + 12 * scale * Math.sin(this.time * 0.002 + i);
        const fx = ix + Math.cos(a) * radius;
        const fy = iy + Math.sin(a) * radius * 0.5;
        const fs = (3 + Math.sin(this.time * 0.003 + i * 1.3) * 1) * scale;
        ctx.fillStyle = i % 2 === 0 ? 'rgba(212,160,23,0.15)' : 'rgba(181,74,58,0.1)';
        ctx.beginPath();
        ctx.arc(fx, fy, fs, 0, Math.PI*2);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  drawLotusCorner(ctx, x, y, size, rotation, colors) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);

    const petalColor = colors ? colors[0] : '#D4A017';

    // 莲花瓣 — 加重金边 + 金脉络
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      ctx.save();
      ctx.rotate(angle);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(size * 0.3, -size * 0.2, size * 0.5, 0);
      ctx.quadraticCurveTo(size * 0.3, size * 0.2, 0, 0);
      ctx.fillStyle = petalColor;
      ctx.globalAlpha = 0.50;
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,215,0,0.55)';
      ctx.lineWidth = 1;
      ctx.stroke();
      // 金脉络
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(size * 0.25, -size * 0.02, size * 0.42, 0);
      ctx.strokeStyle = 'rgba(240,208,128,0.35)';
      ctx.lineWidth = 0.4;
      ctx.stroke();
      ctx.restore();
    }

    // 花心
    ctx.globalAlpha = 0.7;
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.15, 0, Math.PI * 2);
    ctx.fillStyle = '#F0D080';
    ctx.fill();
    ctx.strokeStyle = '#D4A017';
    ctx.lineWidth = 1.2;
    ctx.shadowColor = 'rgba(212,160,23,0.2)';
    ctx.shadowBlur = 4;
    ctx.stroke();
    ctx.shadowBlur = 0;

    ctx.restore();
  }

  drawFlyingApsaras(ctx, w, h, t) {
    if (this.apsarasSilhouettes.length === 0) this.initApsarasSilhouettes();

    ctx.save();
    this.apsarasSilhouettes.forEach(aps => {
      // Update position
      aps.x += aps.vx;
      aps.phase += 0.005;

      // Wrap around
      if (aps.vx > 0 && aps.x > w + 150) aps.x = -150;
      if (aps.vx < 0 && aps.x < -150) aps.x = w + 150;

      const floatY = aps.y + Math.sin(aps.phase) * 15;
      const rot = Math.sin(aps.phase * 0.7) * 0.1;

      ctx.save();
      ctx.translate(aps.x, floatY);
      ctx.rotate(rot);
      ctx.scale(aps.flip * aps.scale, aps.scale);
      ctx.globalAlpha = aps.alpha;

      this._drawApsarasSilhouette(ctx);

      ctx.restore();
    });
    ctx.restore();
  }

  _drawApsarasSilhouette(ctx) {
    // Simplified Dunhuang flying apsaras silhouette
    // Golden line art style
    ctx.strokeStyle = '#F0D080';
    ctx.fillStyle = 'rgba(212, 160, 23, 0.15)';
    ctx.lineWidth = 1.2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const s = 40; // base size

    // Body - upper torso (slightly tilted)
    ctx.save();
    ctx.rotate(-0.2);

    // Head
    ctx.beginPath();
    ctx.arc(0, -s * 0.6, s * 0.18, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Hair bun / topknot
    ctx.beginPath();
    ctx.arc(0, -s * 0.82, s * 0.1, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Hair flowing back
    ctx.beginPath();
    ctx.moveTo(s * 0.1, -s * 0.65);
    ctx.quadraticCurveTo(s * 0.3, -s * 0.7, s * 0.45, -s * 0.5);
    ctx.quadraticCurveTo(s * 0.35, -s * 0.55, s * 0.15, -s * 0.55);
    ctx.fill();
    ctx.stroke();

    // Torso
    ctx.beginPath();
    ctx.moveTo(-s * 0.12, -s * 0.42);
    ctx.quadraticCurveTo(-s * 0.18, -s * 0.1, -s * 0.08, s * 0.1);
    ctx.lineTo(s * 0.08, s * 0.1);
    ctx.quadraticCurveTo(s * 0.18, -s * 0.1, s * 0.12, -s * 0.42);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Arms - raised in dancing pose (one up, one out)
    // Right arm (raised)
    ctx.beginPath();
    ctx.moveTo(s * 0.1, -s * 0.35);
    ctx.quadraticCurveTo(s * 0.3, -s * 0.5, s * 0.35, -s * 0.7);
    ctx.quadraticCurveTo(s * 0.4, -s * 0.85, s * 0.3, -s * 0.9);
    ctx.stroke();

    // Left arm (outstretched)
    ctx.beginPath();
    ctx.moveTo(-s * 0.1, -s * 0.35);
    ctx.quadraticCurveTo(-s * 0.3, -s * 0.25, -s * 0.45, -s * 0.15);
    ctx.stroke();

    // Sleeves / ribbon cuffs
    ctx.beginPath();
    ctx.arc(s * 0.32, -s * 0.88, s * 0.06, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(-s * 0.43, -s * 0.13, s * 0.05, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Lower body - flowing dress / skirt
    ctx.beginPath();
    ctx.moveTo(-s * 0.08, s * 0.1);
    ctx.quadraticCurveTo(-s * 0.25, s * 0.3, -s * 0.3, s * 0.55);
    ctx.quadraticCurveTo(-s * 0.15, s * 0.45, -s * 0.05, s * 0.5);
    ctx.lineTo(s * 0.05, s * 0.5);
    ctx.quadraticCurveTo(s * 0.15, s * 0.45, s * 0.3, s * 0.55);
    ctx.quadraticCurveTo(s * 0.25, s * 0.3, s * 0.08, s * 0.1);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Dress folds
    ctx.beginPath();
    ctx.moveTo(-s * 0.02, s * 0.15);
    ctx.quadraticCurveTo(-s * 0.08, s * 0.3, -s * 0.12, s * 0.45);
    ctx.moveTo(s * 0.02, s * 0.15);
    ctx.quadraticCurveTo(s * 0.08, s * 0.3, s * 0.12, s * 0.45);
    ctx.stroke();

    // Long flowing ribbons (simplified)
    ctx.beginPath();
    ctx.moveTo(s * 0.3, -s * 0.85);
    ctx.quadraticCurveTo(s * 0.6, -s * 0.7, s * 0.7, -s * 0.4);
    ctx.quadraticCurveTo(s * 0.75, -s * 0.2, s * 0.6, s * 0.05);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(-s * 0.45, -s * 0.15);
    ctx.quadraticCurveTo(-s * 0.65, -s * 0.05, -s * 0.7, s * 0.2);
    ctx.quadraticCurveTo(-s * 0.65, s * 0.35, -s * 0.5, s * 0.45);
    ctx.stroke();

    // Second ribbon layer
    ctx.globalAlpha *= 0.6;
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(s * 0.35, -s * 0.9);
    ctx.quadraticCurveTo(s * 0.55, -s * 0.95, s * 0.65, -s * 0.75);
    ctx.quadraticCurveTo(s * 0.72, -s * 0.55, s * 0.62, -s * 0.35);
    ctx.stroke();

    ctx.restore();
  }

  drawScatteredFlowers(ctx, w, h, t) {
    if (this.scatteredFlowers.length === 0) return;
    ctx.save();
    this.scatteredFlowers.forEach(f => {
      f.x += f.vx;
      f.y += f.vy;
      if (f.y < -20) { f.y = h + 20; f.x = Math.random() * w; }
      if (f.x < -20) f.x = w + 20;
      if (f.x > w + 20) f.x = -20;
      const rot = t * 0.003 + f.phase;
      ctx.globalAlpha = f.alpha * (0.7 + Math.sin(t * 0.002 + f.phase) * 0.3);
      ctx.fillStyle = f.color;
      ctx.save();
      ctx.translate(f.x, f.y);
      ctx.rotate(rot);
      for (let p = 0; p < 4; p++) {
        const a = (p / 4) * Math.PI * 2;
        ctx.beginPath();
        ctx.ellipse(Math.cos(a) * f.r * 0.5, Math.sin(a) * f.r * 0.5, f.r * 0.4, f.r * 0.2, a, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.beginPath();
      ctx.arc(0, 0, f.r * 0.15, 0, Math.PI * 2);
      ctx.fillStyle = '#FFEEDD';
      ctx.fill();
      ctx.restore();
    });
    ctx.globalAlpha = 1;
    ctx.restore();
  }

  drawAuspiciousClouds(ctx, w, h, t) {
    if (this.clouds.length === 0) this.initClouds();
    ctx.save();
    this.clouds.forEach(c => {
      c.x += c.vx;
      if (c.x > w + c.width) c.x = -c.width;
      c.phase += 0.003;
      const floatY = c.y * h + Math.sin(c.phase) * 8;
      ctx.globalAlpha = c.alpha * (0.8 + Math.sin(t * 0.001 + c.phase) * 0.2);
      ctx.fillStyle = '#F0E0C0';
      ctx.strokeStyle = '#D4A017';
      ctx.lineWidth = 0.5;
      const s = c.size / 100;
      ctx.save();
      ctx.translate(c.x, floatY);
      ctx.scale(s, s);
      for (let i = 0; i < 5; i++) {
        const ox = Math.cos(i * 1.3) * 30 * (1 - i * 0.1);
        const oy = Math.sin(i * 0.7) * 10 + (i === 0 ? 0 : Math.sin(i * 1.1) * 8);
        const rr = 20 - i * 1.5;
        ctx.beginPath();
        ctx.arc(ox, oy, rr, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
      ctx.restore();
    });
    ctx.globalAlpha = 1;
    ctx.restore();
  }

  _drawHuiwenRing(ctx, r, scale, group) {
    // 回纹 / keyfret pattern ring — 族群色交替
    ctx.save();
    const hwColors = group ? [group.colors[0], '#D4A017', group.colors[1] || group.colors[0], '#D4A017'] : ['#D4A017'];
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.55;

    const segments = 36;
    const segAngle = (Math.PI * 2) / segments;
    const innerR = r;
    const outerR = r + 6 * scale;

    for (let i = 0; i < segments; i++) {
      const a0 = i * segAngle + this.outerRingAngle * 0.5;
      const a1 = a0 + segAngle * 0.45;
      const a2 = a0 + segAngle * 0.55;
      const a3 = a0 + segAngle;

      const c = hwColors[i % hwColors.length];
      // lighten very dark colors so they're visible against the dark background
      if (c[0] === '#' && parseInt(c.slice(1,3),16) + parseInt(c.slice(3,5),16) + parseInt(c.slice(5,7),16) < 120) {
        ctx.globalAlpha = 0.75;
      } else {
        ctx.globalAlpha = 0.55;
      }
      ctx.strokeStyle = c;

      // Outer arc segment
      ctx.beginPath();
      ctx.arc(0, 0, outerR, a0, a1);
      ctx.lineTo(Math.cos(a1) * innerR, Math.sin(a1) * innerR);
      ctx.arc(0, 0, innerR, a1, a2, true);
      ctx.lineTo(Math.cos(a2) * outerR, Math.sin(a2) * outerR);
      ctx.arc(0, 0, outerR, a2, a3);
      ctx.stroke();
    }

    // Inner thin ring
    ctx.globalAlpha = 0.2;
    ctx.beginPath();
    ctx.arc(0, 0, r - 2 * scale, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();
  }

  _drawHoneysuckleRing(ctx, r, group, scale) {
    // 忍冬纹 / honeysuckle scrollwork ring
    ctx.save();
    const count = 24;

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + this.midRingAngle;
      ctx.save();
      ctx.rotate(angle);
      ctx.translate(0, -r);

      // Honeysuckle motif: 3 petals + leaf
      const s = 8 * scale;

      // Main stem
      ctx.strokeStyle = '#1E8C7D';
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.35;
      ctx.beginPath();
      ctx.moveTo(-s * 0.8, s * 0.3);
      ctx.quadraticCurveTo(0, -s * 0.2, s * 0.8, s * 0.3);
      ctx.stroke();

      // Petals (stone green fill with group color outline)
      ctx.fillStyle = 'rgba(30, 140, 125, 0.2)';
      ctx.strokeStyle = group.colors[i % group.colors.length];
      ctx.lineWidth = 0.8;
      ctx.globalAlpha = 0.4;

      // Top petal
      ctx.beginPath();
      ctx.moveTo(0, -s * 0.5);
      ctx.quadraticCurveTo(s * 0.3, -s * 0.3, s * 0.15, s * 0.1);
      ctx.quadraticCurveTo(0, s * 0.05, -s * 0.15, s * 0.1);
      ctx.quadraticCurveTo(-s * 0.3, -s * 0.3, 0, -s * 0.5);
      ctx.fill();
      ctx.stroke();

      // Left petal
      ctx.beginPath();
      ctx.moveTo(-s * 0.5, -s * 0.1);
      ctx.quadraticCurveTo(-s * 0.7, s * 0.1, -s * 0.4, s * 0.35);
      ctx.quadraticCurveTo(-s * 0.2, s * 0.2, -s * 0.15, s * 0.05);
      ctx.quadraticCurveTo(-s * 0.3, -s * 0.05, -s * 0.5, -s * 0.1);
      ctx.fill();
      ctx.stroke();

      // Right petal
      ctx.beginPath();
      ctx.moveTo(s * 0.5, -s * 0.1);
      ctx.quadraticCurveTo(s * 0.7, s * 0.1, s * 0.4, s * 0.35);
      ctx.quadraticCurveTo(s * 0.2, s * 0.2, s * 0.15, s * 0.05);
      ctx.quadraticCurveTo(s * 0.3, -s * 0.05, s * 0.5, -s * 0.1);
      ctx.fill();
      ctx.stroke();

      // Leaf (group color accent)
      ctx.fillStyle = group.colors[0] + '40';
      ctx.strokeStyle = group.colors[0];
      ctx.beginPath();
      ctx.moveTo(0, s * 0.2);
      ctx.quadraticCurveTo(s * 0.2, s * 0.4, 0, s * 0.55);
      ctx.quadraticCurveTo(-s * 0.2, s * 0.4, 0, s * 0.2);
      ctx.fill();
      ctx.stroke();

      // Center dot
      ctx.fillStyle = group.colors[0];
      ctx.globalAlpha = 0.5;
      ctx.beginPath();
      ctx.arc(0, -s * 0.15, s * 0.1, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }
    ctx.restore();
  }

  _drawManiJewel(ctx, x, y, size, scale) {
    // 摩尼宝珠 / Mani jewel with flame top
    ctx.save();
    ctx.translate(x, y);

    const s = size;
    const pulse = 1 + Math.sin(this.time * 0.015) * 0.05;

    // Glow
    ctx.shadowColor = 'rgba(212, 160, 23, 0.4)';
    ctx.shadowBlur = 15 * scale;

    // Jewel body (circular with facets)
    const jewelG = ctx.createRadialGradient(-s * 0.2, -s * 0.2, 0, 0, 0, s * pulse);
    jewelG.addColorStop(0, '#FFF5D0');
    jewelG.addColorStop(0.3, '#F0D080');
    jewelG.addColorStop(0.6, '#D4A017');
    jewelG.addColorStop(1, '#8B6914');
    ctx.fillStyle = jewelG;
    ctx.beginPath();
    ctx.arc(0, 0, s * pulse, 0, Math.PI * 2);
    ctx.fill();

    // Jewel facets
    ctx.strokeStyle = 'rgba(255, 245, 200, 0.5)';
    ctx.lineWidth = 0.8;
    ctx.globalAlpha = 0.6;
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(a) * s * 0.8 * pulse, Math.sin(a) * s * 0.8 * pulse);
      ctx.stroke();
    }

    // Flame top (3 flames)
    ctx.shadowBlur = 10 * scale;
    ctx.globalAlpha = 0.85;
    const flameG = ctx.createLinearGradient(0, -s * 1.8, 0, -s * 0.3);
    flameG.addColorStop(0, '#FF6B35');
    flameG.addColorStop(0.4, '#FFD700');
    flameG.addColorStop(1, '#F0D080');
    ctx.fillStyle = flameG;

    // Center flame (tallest)
    ctx.beginPath();
    ctx.moveTo(0, -s * 1.8 * pulse);
    ctx.quadraticCurveTo(s * 0.4, -s * 1.2, s * 0.25, -s * 0.4);
    ctx.quadraticCurveTo(0, -s * 0.5, -s * 0.25, -s * 0.4);
    ctx.quadraticCurveTo(-s * 0.4, -s * 1.2, 0, -s * 1.8 * pulse);
    ctx.fill();

    // Left flame
    ctx.beginPath();
    ctx.moveTo(-s * 0.35, -s * 1.1 * pulse);
    ctx.quadraticCurveTo(-s * 0.6, -s * 0.7, -s * 0.5, -s * 0.3);
    ctx.quadraticCurveTo(-s * 0.3, -s * 0.4, -s * 0.2, -s * 0.5);
    ctx.quadraticCurveTo(-s * 0.25, -s * 0.8, -s * 0.35, -s * 1.1 * pulse);
    ctx.fill();

    // Right flame
    ctx.beginPath();
    ctx.moveTo(s * 0.35, -s * 1.1 * pulse);
    ctx.quadraticCurveTo(s * 0.6, -s * 0.7, s * 0.5, -s * 0.3);
    ctx.quadraticCurveTo(s * 0.3, -s * 0.4, s * 0.2, -s * 0.5);
    ctx.quadraticCurveTo(s * 0.25, -s * 0.8, s * 0.35, -s * 1.1 * pulse);
    ctx.fill();

    // Gold outline on jewel
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 0.7;
    ctx.strokeStyle = '#F0D080';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(0, 0, s * pulse, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();
  }

  _drawYingluoTassel(ctx, x, y, length, group, scale, sway) {
    // 璎珞珠串 / Yingluo bead tassel
    ctx.save();
    ctx.translate(x, y);

    const beadCount = 10;
    const beadSpacing = length / beadCount;

    ctx.strokeStyle = '#D4A017';
    ctx.lineWidth = 0.8;
    ctx.globalAlpha = 0.35;

    // String
    ctx.beginPath();
    ctx.moveTo(0, 0);
    for (let i = 1; i <= beadCount; i++) {
      const sy = i * beadSpacing;
      const sx = Math.sin(sway + i * 0.3) * 3 * scale;
      ctx.lineTo(sx, sy);
    }
    ctx.stroke();

    // Beads
    for (let i = 0; i < beadCount; i++) {
      const sy = i * beadSpacing + beadSpacing * 0.5;
      const sx = Math.sin(sway + i * 0.3) * 3 * scale;
      const isLarge = i % 3 === 0;
      const br = (isLarge ? 3 : 1.8) * scale;

      // Bead
      const bg = ctx.createRadialGradient(sx - br * 0.3, sy - br * 0.3, 0, sx, sy, br);
      if (isLarge) {
        bg.addColorStop(0, '#F0E0C0');
        bg.addColorStop(0.5, group.colors[i % group.colors.length]);
        bg.addColorStop(1, 'rgba(0,0,0,0.3)');
      } else {
        bg.addColorStop(0, '#FFF5D0');
        bg.addColorStop(0.5, '#D4A017');
        bg.addColorStop(1, '#8B6914');
      }
      ctx.fillStyle = bg;
      ctx.globalAlpha = 0.6;
      ctx.beginPath();
      ctx.arc(sx, sy, br, 0, Math.PI * 2);
      ctx.fill();

      // Gold outline
      ctx.strokeStyle = '#F0D080';
      ctx.lineWidth = 0.5;
      ctx.globalAlpha = 0.5;
      ctx.stroke();
    }

    // Bottom pendant (lotus / teardrop shape)
    const endY = length;
    const endX = Math.sin(sway + beadCount * 0.3) * 3 * scale;
    ctx.fillStyle = 'rgba(212, 160, 23, 0.5)';
    ctx.globalAlpha = 0.5;
    ctx.beginPath();
    ctx.moveTo(endX, endY);
    ctx.quadraticCurveTo(endX + 5 * scale, endY + 8 * scale, endX, endY + 14 * scale);
    ctx.quadraticCurveTo(endX - 5 * scale, endY + 8 * scale, endX, endY);
    ctx.fill();
    ctx.strokeStyle = '#F0D080';
    ctx.lineWidth = 0.8;
    ctx.stroke();

    ctx.restore();
  }

  _drawBorderShine(ctx, r, scale) {
    // Golden border light flow effect
    const shineAngle = (this.time * 0.005) % (Math.PI * 2);
    ctx.save();
    ctx.rotate(shineAngle);

    const shineG = ctx.createRadialGradient(r, 0, 0, r, 0, r * 0.3);
    shineG.addColorStop(0, 'rgba(255, 245, 200, 0.4)');
    shineG.addColorStop(0.5, 'rgba(255, 215, 0, 0.15)');
    shineG.addColorStop(1, 'rgba(212, 160, 23, 0)');

    ctx.fillStyle = shineG;
    ctx.globalAlpha = 0.6;
    ctx.beginPath();
    ctx.arc(r, 0, r * 0.25, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  drawDunhuangParticle(ctx, shape, r, rot) {
    ctx.rotate(rot);
    const s = r * 1.4;
    switch (shape) {
      case 'lotus':
        ctx.beginPath();
        ctx.moveTo(0, -s);
        ctx.bezierCurveTo(s, -s*0.8, s*0.6, s*0.3, 0, s*0.5);
        ctx.bezierCurveTo(-s*0.6, s*0.3, -s, -s*0.8, 0, -s);
        ctx.fill(); break;
      case 'cloud':
        for (let j = 0; j < 3; j++) {
          const a = j * 2.1, d = r * 0.35;
          ctx.beginPath(); ctx.arc(Math.cos(a)*d, Math.sin(a)*d, r*0.5, 0, Math.PI*2); ctx.fill();
        } break;
      case 'treasure':
        for (let i = 0; i < 8; i++) {
          const a = (i/8)*Math.PI*2;
          ctx.beginPath();
          ctx.ellipse(Math.cos(a)*r*0.7, Math.sin(a)*r*0.7, r*0.35, r*0.15, a, 0, Math.PI*2);
          ctx.fill();
        }
        ctx.beginPath(); ctx.arc(0, 0, r*0.2, 0, Math.PI*2); ctx.fill(); break;
      case 'spark':
        for (let i = 0; i < 5; i++) {
          const a = (i/5)*Math.PI*2;
          ctx.beginPath(); ctx.arc(Math.cos(a)*r*0.7, Math.sin(a)*r*0.7, r*0.25, 0, Math.PI*2); ctx.fill();
        }
        ctx.beginPath(); ctx.arc(0, 0, r*0.15, 0, Math.PI*2); ctx.fill(); break;
      case 'flame':
        ctx.beginPath();
        ctx.moveTo(0, -s);
        ctx.quadraticCurveTo(s*0.8, -s*0.3, s*0.4, s*0.3);
        ctx.quadraticCurveTo(s*0.6, s*0.05, 0, s*0.4);
        ctx.quadraticCurveTo(-s*0.6, s*0.05, -s*0.4, s*0.3);
        ctx.quadraticCurveTo(-s*0.8, -s*0.3, 0, -s);
        ctx.fill(); break;
      default:
        ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI*2); ctx.fill();
    }
  }

  drawMandalaEmblem(cx, cy, scale) {
    const ctx = this.ctx;
    const R = 200 * scale;
    const S = R * 1.18;
    const group = ETHNIC_GROUPS[this.currentIndex];
    if (!group) return;
    const isDesktop = this._w >= 700;

    ctx.save();
    ctx.translate(cx, cy);

    // === CIRCULAR ELEMENTS INSIDE ===
    // 1. Huiwen ring
    this._drawHuiwenRing(ctx, R * 1.05, scale, group);

    // 2. Buddha halo
    const pp = this.emblemPulseActive ? Math.sin(this.emblemPulseTime * Math.PI) : 0;
    const pulseBoost = pp * 0.12;
    const breathScale = 1 + Math.sin(this.time * 0.005) * 0.006;
    ctx.shadowColor = 'rgba(212,160,23,' + (0.06 + pulseBoost * 0.5) + ')';
    ctx.shadowBlur = 50 + pulseBoost * 50;
    const hg = ctx.createRadialGradient(0, 0, R*0.7*breathScale, 0, 0, R*1.08*breathScale);
    hg.addColorStop(0, 'rgba(212,160,23,0)');
    hg.addColorStop(0.5, 'rgba(212,160,23,' + (0.05 + pulseBoost) + ')');
    hg.addColorStop(0.8, 'rgba(212,160,23,' + (0.08 + pulseBoost * 1.5) + ')');
    hg.addColorStop(1, 'rgba(212,160,23,0)');
    ctx.fillStyle = hg;
    ctx.beginPath(); ctx.arc(0, 0, R*1.08*breathScale, 0, Math.PI*2); ctx.fill();
    ctx.shadowBlur = 0;

    // 3. Lotus petal ring — 饱满花瓣
    const pc = 24, pr = R*0.92;
    const lotusPulse = 1 + Math.sin(this.time * 0.004) * 0.012;
    for (let i = 0; i < pc; i++) {
      const a = (i/pc)*Math.PI*2 + this.outerRingAngle;
      ctx.save(); ctx.rotate(a);
      ctx.beginPath();
      ctx.moveTo(0, -pr*0.8*lotusPulse);
      ctx.quadraticCurveTo(pr*0.11, -(pr*0.93*lotusPulse), 0, -pr*lotusPulse);
      ctx.quadraticCurveTo(-pr*0.11, -(pr*0.93*lotusPulse), 0, -pr*0.8*lotusPulse);
      ctx.fillStyle = group.colors[i % group.colors.length];
      ctx.globalAlpha = 0.55; ctx.fill();
      ctx.strokeStyle = group.colors[(i+1) % group.colors.length];
      ctx.lineWidth = 0.8;
      ctx.globalAlpha = 0.3; ctx.stroke();
      ctx.restore();
    }

    // 4. Bead ring — 密珠+族群色为主
    const brR = R*0.82;
    const beadColors = [group.colors[0], group.colors[1] || group.colors[0], '#D4A017', group.colors[0]];
    for (let i = 0; i < 32; i++) {
      const a = (i/32)*Math.PI*2 + this.midRingAngle;
      const bx = Math.cos(a)*brR, by = Math.sin(a)*brR;
      const isGem = i % 8 === 0;
      ctx.beginPath(); ctx.arc(bx, by, isGem ? 3 : 1.8, 0, Math.PI*2);
      ctx.fillStyle = isGem ? beadColors[(i/8) % 4] : beadColors[i % 4];
      ctx.globalAlpha = isGem ? 0.45 : 0.3; ctx.fill();
    }

    // 5. Honeysuckle ring
    this._drawHoneysuckleRing(ctx, R*0.76, group, scale);

    // 6. Inner bead ring — 族群色
    const ibR = R*0.70;
    for (let i = 0; i < 12; i++) {
      const a = (i/12)*Math.PI*2 + this.innerRingAngle;
      const bx = Math.cos(a)*ibR, by = Math.sin(a)*ibR;
      ctx.beginPath(); ctx.arc(bx, by, 1.8, 0, Math.PI*2);
      ctx.fillStyle = i % 2 === 0 ? group.colors[0] : '#D4A017';
      ctx.globalAlpha = 0.25; ctx.fill();
    }

    // 7. Niche halo
    // 7. Niche halo — 族群色光晕
    const nr = R*0.64;
    const ng = ctx.createRadialGradient(0, -R*0.08, 0, 0, 0, nr);
    ng.addColorStop(0, group.colors[0]+'66');
    ng.addColorStop(0.5, group.colors[0]+'33');
    ng.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.globalAlpha = 0.2;
    ctx.fillStyle = ng;
    ctx.beginPath(); ctx.arc(0, 0, nr, 0, Math.PI*2); ctx.fill();
    ctx.globalAlpha = 1;

    // 8. Main circle — 鎏金底
    ctx.save();
    ctx.beginPath();
    ctx.arc(0, 0, R*0.60, 0, Math.PI*2);
    ctx.clip();

    const bg = ctx.createRadialGradient(0, -R*0.12, 0, 0, 0, R*0.60);
    bg.addColorStop(0, 'rgba(255,245,200,0.22)');
    bg.addColorStop(0.35, 'rgba(240,200,80,0.16)');
    bg.addColorStop(0.65, 'rgba(200,160,40,0.12)');
    bg.addColorStop(1, 'rgba(139,105,20,0.08)');
    ctx.fillStyle = bg; ctx.fill();
    ctx.restore();

    // 外圈描边 — 金色
    ctx.beginPath();
    ctx.arc(0, 0, R*0.60, 0, Math.PI*2);
    ctx.strokeStyle = '#D4A017';
    ctx.lineWidth = 1.5;
    ctx.globalAlpha = 0.5;
    ctx.stroke();
    ctx.globalAlpha = 1;

    // 内圈金色细线
    ctx.beginPath();
    ctx.arc(0, 0, R*0.56, 0, Math.PI*2);
    ctx.strokeStyle = '#D4A017';
    ctx.lineWidth = 0.8;
    ctx.globalAlpha = 0.35;
    ctx.stroke();
    ctx.globalAlpha = 1;

    // 9. Cultural item
    ctx.globalAlpha = 1;
    ctx.shadowColor = 'rgba(212,160,23,0.15)';
    ctx.shadowBlur = 8;
    this.drawCultureItem(0, 0, R*0.38, group);
    ctx.shadowBlur = 0;

    // 10. Color band
    const sY = R*0.52, sW = 20, sH = 3;
    const tW = group.colors.length * sW + (group.colors.length-1)*3;
    const sX = -tW/2;
    group.colors.forEach((c, i) => {
      ctx.fillStyle = c;
      ctx.shadowColor = 'rgba(0,0,0,0.2)';
      ctx.shadowBlur = 2;
      ctx.beginPath();
      this.roundRect(ctx, sX + i*(sW+3), sY, sW, sH, 2);
      ctx.fill();
    });
    ctx.shadowBlur = 0;

    // 11. Text
    const tY = R*0.65;
    ctx.fillStyle = '#F0E0C0';
    ctx.font = 'bold ' + Math.floor(24*scale) + 'px "Noto Serif SC","SimSun",serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.shadowColor = 'rgba(0,0,0,0.8)';
    ctx.shadowBlur = 12;
    ctx.fillText(group.name, 0, tY);

    ctx.fillStyle = 'rgba(240,224,192,0.45)';
    ctx.font = Math.floor(11*scale) + 'px "Ma Shan Zheng",cursive';
    ctx.shadowBlur = 6;
    ctx.fillText(group.romanName, 0, tY + 22*scale);

    ctx.fillStyle = 'rgba(240,224,192,0.3)';
    ctx.font = Math.floor(10*scale) + 'px "ZCOOL XiaoWei",serif';
    ctx.fillText(group.item + ' \u00B7 ' + group.festival, 0, tY + 40*scale);
    ctx.shadowBlur = 0;

    ctx.restore();
  }

  // (reserved)

drawCultureItem(cx, cy, size, group) {
    const params = group.itemDrawParams;
    switch (params.type) {
      case 'knot': this.drawKnot(cx, cy, size, params); break;
      case 'morinKhuur': this.drawMorinKhuur(cx, cy, size, params); break;
      case 'prayerWheel': this.drawPrayerWheel(cx, cy, size, params); break;
      case 'dap': this.drawDap(cx, cy, size, params); break;
      case 'silverHorn': this.drawSilverHorn(cx, cy, size, params); break;
      case 'lacquerCup': this.drawLacquerCup(cx, cy, size, params); break;
      case 'embroideredBall': this.drawEmbroideredBall(cx, cy, size, params); break;
      case 'headdress': this.drawHeaddress(cx, cy, size, params); break;
      case 'elephantDrum': this.drawElephantDrum(cx, cy, size, params); break;
      case 'janggu': this.drawJanggu(cx, cy, size, params); break;
      case 'teapot': this.drawTeapot(cx, cy, size, params); break;
      case 'drumTower': this.drawDrumTower(cx, cy, size, params); break;
      case 'crossbow': this.drawCrossbow(cx, cy, size, params); break;
      case 'bow': this.drawBow(cx, cy, size, params); break;
      case 'knife': this.drawKnife(cx, cy, size, params); break;
      case 'deer': this.drawDeer(cx, cy, size, params); break;
      case 'woodCarving': this.drawWoodCarving(cx, cy, size, params); break;
      case 'shuiScript': this.drawShuiScript(cx, cy, size, params); break;
      case 'ceremonyPole': this.drawCeremonyPole(cx, cy, size, params); break;
      case 'hockey': this.drawHockey(cx, cy, size, params); break;
      case 'waistBelt': this.drawWaistBelt(cx, cy, size, params); break;
      case 'bamboo': this.drawBamboo(cx, cy, size, params); break;
      case 'brocade': this.drawBrocade(cx, cy, size, params); break;
      case 'batik': this.drawBatik(cx, cy, size, params); break;
      case 'terracedField': this.drawTerracedField(cx, cy, size, params); break;
      case 'felt': this.drawFelt(cx, cy, size, params); break;
      case 'tea': this.drawTea(cx, cy, size, params); break;
      case 'nuoMask': this.drawNuoMask(cx, cy, size, params); break;
      case 'bambooHat': this.drawBambooHat(cx, cy, size, params); break;
      case 'carpet': this.drawCarpet(cx, cy, size, params); break;
      case 'doll': this.drawMatryoshka(cx, cy, size, params); break;
      case 'furHat': this.drawFurHat(cx, cy, size, params); break;
      case 'fishSkin': this.drawFishSkin(cx, cy, size, params); break;
      case 'monochord': this.drawMonochord(cx, cy, size, params); break;
      case 'apron': this.drawApron(cx, cy, size, params); break;
      case 'paper': this.drawPaper(cx, cy, size, params); break;
      case 'woodDrum': this.drawWoodDrum(cx, cy, size, params); break;
      case 'bigDrum': this.drawBigDrum(cx, cy, size, params); break;
      case 'lute': this.drawLute(cx, cy, size, params); break;
      case 'gourdSheng': this.drawGourdSheng(cx, cy, size, params); break;
      case 'qiangFlute': this.drawQiangFlute(cx, cy, size, params); break;
      case 'eagleFlute': this.drawEagleFlute(cx, cy, size, params); break;
      case 'embroidery': this.drawEmbroidery(cx, cy, size, params); break;
      case 'vest': this.drawVest(cx, cy, size, params); break;
    }
  }

  /* Draw a culture item on an external canvas (for draw card & album) */
  drawCultureItemOnCanvas(canvas, index, size) {
    const group = ETHNIC_GROUPS[index];
    if (!group) return;

    const dpr = window.devicePixelRatio || 1;
    const attrW = parseInt(canvas.getAttribute('width'), 10) || 80;
    const attrH = parseInt(canvas.getAttribute('height'), 10) || 80;
    const cssW = Math.min(canvas.clientWidth || attrW, attrW);
    const cssH = Math.min(canvas.clientHeight || attrH, attrH);
    canvas.width = Math.round(cssW * dpr);
    canvas.height = Math.round(cssH * dpr);

    const ctx = canvas.getContext('2d');
    const prevCtx = this.ctx;
    this.ctx = ctx;

    try {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, cssW, cssH);

      // Background
      ctx.fillStyle = group.colors[0];
      ctx.globalAlpha = 0.2;
      ctx.beginPath();
      ctx.arc(cssW / 2, cssH / 2, Math.min(cssW, cssH) * 0.48, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;

      this.drawCultureItem(cssW / 2, cssH / 2 + 4, size, group);
    } finally {
      this.ctx = prevCtx;
    }
  }

  /* ---- Individual item drawing methods ---- */

  drawKnot(cx, cy, s, p) {
    const ctx = this.ctx;
    const len = s * 0.9;
    ctx.save();
    ctx.translate(cx, cy);

    // Diamond outer shape
    ctx.beginPath();
    ctx.moveTo(0, -len);
    ctx.lineTo(len, 0);
    ctx.lineTo(0, len);
    ctx.lineTo(-len, 0);
    ctx.closePath();
    ctx.fillStyle = p.color;
    ctx.globalAlpha = 0.9;
    ctx.fill();
    ctx.strokeStyle = p.accentColor;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Inner weave lines
    ctx.strokeStyle = p.accentColor;
    ctx.lineWidth = 1.5;
    ctx.globalAlpha = 0.6;
    ctx.beginPath();
    ctx.moveTo(-len * 0.5, -len * 0.5);
    ctx.lineTo(len * 0.5, len * 0.5);
    ctx.moveTo(len * 0.5, -len * 0.5);
    ctx.lineTo(-len * 0.5, len * 0.5);
    ctx.stroke();

    // Tassel
    ctx.globalAlpha = 0.7;
    ctx.strokeStyle = p.color;
    ctx.lineWidth = 1;
    const tasselLines = 5;
    for (let i = 0; i < tasselLines; i++) {
      const tx = (i / (tasselLines - 1) - 0.5) * len * 0.5;
      ctx.beginPath();
      ctx.moveTo(tx, len);
      ctx.lineTo(tx, len + s * 0.3);
      ctx.stroke();
    }

    // Tassel knot
    ctx.beginPath();
    ctx.arc(0, len + s * 0.05, 3, 0, Math.PI * 2);
    ctx.fillStyle = p.accentColor;
    ctx.fill();

    ctx.restore();
  }

  drawMorinKhuur(cx, cy, s, p) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(cx, cy);

    // Body (trapezoid)
    const bw = s * 0.7;
    const bt = s * 0.4;
    const bh = s * 0.45;
    ctx.beginPath();
    ctx.moveTo(-bt / 2, -bh / 2);
    ctx.lineTo(bt / 2, -bh / 2);
    ctx.lineTo(bw / 2, bh / 2);
    ctx.lineTo(-bw / 2, bh / 2);
    ctx.closePath();
    ctx.fillStyle = p.color;
    ctx.globalAlpha = 0.85;
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.3)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Sound hole
    ctx.beginPath();
    ctx.arc(0, 0, s * 0.08, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.fill();

    // Neck
    ctx.fillStyle = p.color;
    ctx.globalAlpha = 0.85;
    ctx.fillRect(-3, -bh / 2 - s * 0.3, 6, s * 0.3);

    // Horse head
    const headY = -bh / 2 - s * 0.3;
    ctx.beginPath();
    ctx.arc(0, headY, s * 0.08, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.fill();

    // Horse ear (small triangle)
    ctx.beginPath();
    ctx.moveTo(-4, headY - s * 0.1);
    ctx.lineTo(0, headY - s * 0.14);
    ctx.lineTo(4, headY - s * 0.1);
    ctx.fillStyle = p.color;
    ctx.fill();

    // Strings (two vertical lines)
    ctx.strokeStyle = 'rgba(255,255,255,0.4)';
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(-2, -bh / 2 - s * 0.15);
    ctx.lineTo(-2, bh / 2);
    ctx.moveTo(2, -bh / 2 - s * 0.15);
    ctx.lineTo(2, bh / 2);
    ctx.stroke();

    ctx.restore();
  }

  drawPrayerWheel(cx, cy, s, p) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(cx, cy);

    // Cylinder body
    const cylW = s * 0.4;
    const cylH = s * 0.5;
    ctx.beginPath();
    this.roundRect(ctx, -cylW / 2, -cylH / 2, cylW, cylH, 4);
    ctx.fillStyle = p.color;
    ctx.globalAlpha = 0.85;
    ctx.fill();
    ctx.strokeStyle = p.accentColor;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Decorative bands
    ctx.strokeStyle = p.accentColor;
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.4;
    ctx.beginPath();
    ctx.moveTo(-cylW / 2, -cylH * 0.15);
    ctx.lineTo(cylW / 2, -cylH * 0.15);
    ctx.moveTo(-cylW / 2, cylH * 0.15);
    ctx.lineTo(cylW / 2, cylH * 0.15);
    ctx.stroke();

    // Handle above
    ctx.globalAlpha = 0.7;
    ctx.fillStyle = p.color;
    ctx.fillRect(-3, -cylH / 2 - s * 0.3, 6, s * 0.3);

    // Top ornament
    ctx.beginPath();
    ctx.moveTo(0, -cylH / 2 - s * 0.3 - s * 0.06);
    ctx.lineTo(-s * 0.08, -cylH / 2 - s * 0.3);
    ctx.lineTo(s * 0.08, -cylH / 2 - s * 0.3);
    ctx.closePath();
    ctx.fillStyle = p.accentColor;
    ctx.fill();

    // Mantra dots
    ctx.globalAlpha = 0.3;
    for (let i = 0; i < 6; i++) {
      const dotAngle = (i / 6) * Math.PI * 2;
      const dx = Math.cos(dotAngle) * cylW * 0.3;
      const dy = Math.sin(dotAngle) * cylW * 0.3;
      ctx.beginPath();
      ctx.arc(dx, dy, 2, 0, Math.PI * 2);
      ctx.fillStyle = p.accentColor;
      ctx.fill();
    }

    ctx.restore();
  }

  drawDap(cx, cy, s, p) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(cx, cy);

    const r = s * 0.6;

    // Drum body (circle)
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.globalAlpha = 0.85;
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Skin / membrane
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.85, 0, Math.PI * 2);
    ctx.fillStyle = '#DEB887';
    ctx.globalAlpha = 0.3;
    ctx.fill();

    // Jingles (little rings around the edge)
    const numJingles = 8;
    ctx.globalAlpha = 0.5;
    for (let i = 0; i < numJingles; i++) {
      const a = (i / numJingles) * Math.PI * 2;
      const jx = Math.cos(a) * r;
      const jy = Math.sin(a) * r;
      ctx.beginPath();
      ctx.arc(jx, jy, r * 0.12, 0, Math.PI * 2);
      ctx.strokeStyle = p.accentColor;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    // Centre decoration
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.1, 0, Math.PI * 2);
    ctx.fillStyle = p.accentColor;
    ctx.globalAlpha = 0.4;
    ctx.fill();

    ctx.restore();
  }

  drawSilverHorn(cx, cy, s, p) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(cx, cy);

    const h = s * 0.9;
    const w = s * 0.6;

    ctx.globalAlpha = 0.9;

    // Left horn
    ctx.beginPath();
    ctx.moveTo(0, h * 0.2);
    ctx.quadraticCurveTo(-w, -h * 0.1, -w * 0.9, -h * 0.7);
    ctx.quadraticCurveTo(-w * 0.3, -h * 0.2, 0, h * 0);
    ctx.fillStyle = p.color;
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.3)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Right horn
    ctx.beginPath();
    ctx.moveTo(0, h * 0.2);
    ctx.quadraticCurveTo(w, -h * 0.1, w * 0.9, -h * 0.7);
    ctx.quadraticCurveTo(w * 0.3, -h * 0.2, 0, h * 0);
    ctx.fillStyle = p.color;
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.3)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Base/centre piece
    ctx.beginPath();
    ctx.arc(0, h * 0.2, s * 0.12, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Decorative dots on horns
    ctx.globalAlpha = 0.5;
    for (let side = -1; side <= 1; side += 2) {
      for (let i = 0; i < 4; i++) {
        const t = i / 4;
        const dx = side * w * (0.5 - t * 0.4);
        const dy = -h * 0.1 - t * h * 0.5;
        ctx.beginPath();
        ctx.arc(dx, dy, 2, 0, Math.PI * 2);
        ctx.fillStyle = p.accentColor;
        ctx.fill();
      }
    }

    ctx.restore();
  }

  drawLacquerCup(cx, cy, s, p) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(cx, cy);

    // Cup body - trapezoid, wider at top
    const topW = s * 0.55;
    const botW = s * 0.3;
    const cupH = s * 0.6;

    ctx.beginPath();
    ctx.moveTo(-topW / 2, -cupH / 2);
    ctx.lineTo(topW / 2, -cupH / 2);
    ctx.lineTo(botW / 2, cupH / 2);
    ctx.lineTo(-botW / 2, cupH / 2);
    ctx.closePath();
    ctx.fillStyle = p.color;
    ctx.globalAlpha = 0.9;
    ctx.fill();

    // Red decorative band
    ctx.fillStyle = p.accentColor;
    ctx.globalAlpha = 0.7;
    ctx.fillRect(-topW * 0.4, -cupH * 0.1, topW * 0.8, cupH * 0.12);

    // Yellow decorative motif on the band
    ctx.fillStyle = '#E8B830';
    ctx.globalAlpha = 0.5;
    for (let i = 0; i < 5; i++) {
      const mx = (i / 4 - 0.5) * topW * 0.6;
      ctx.beginPath();
      ctx.arc(mx, -cupH * 0.04, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Foot/base
    ctx.fillStyle = p.color;
    ctx.globalAlpha = 0.7;
    ctx.fillRect(-botW * 0.6, cupH * 0.5, botW * 1.2, cupH * 0.08);

    // Rim highlight
    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-topW / 2, -cupH / 2);
    ctx.lineTo(topW / 2, -cupH / 2);
    ctx.stroke();

    ctx.restore();
  }

  drawEmbroideredBall(cx, cy, s, p) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(cx, cy);

    const r = s * 0.5;

    // Ball body (circle)
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.globalAlpha = 0.85;
    ctx.fill();
    ctx.strokeStyle = p.accentColor;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Petal divisions (6 curved lines dividing the circle)
    ctx.globalAlpha = 0.4;
    ctx.strokeStyle = p.accentColor;
    ctx.lineWidth = 1.5;
    for (let i = 0; i < 6; i++) {
      const a1 = (i / 6) * Math.PI * 2;
      const a2 = ((i + 1) / 6) * Math.PI * 2;
      ctx.beginPath();
      const mx = Math.cos((a1 + a2) / 2) * r * 0.6;
      const my = Math.sin((a1 + a2) / 2) * r * 0.6;
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(
        Math.cos(a1) * r * 0.5 + Math.cos(a2) * r * 0.5,
        Math.sin(a1) * r * 0.5 + Math.sin(a2) * r * 0.5,
        Math.cos(a2) * r,
        Math.sin(a2) * r
      );
      ctx.stroke();
    }

    // Central flower ornament
    ctx.globalAlpha = 0.6;
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2 - Math.PI / 2;
      const px = Math.cos(a) * r * 0.22;
      const py = Math.sin(a) * r * 0.22;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fillStyle = p.accentColor;
    ctx.fill();

    // Tassel at bottom
    ctx.globalAlpha = 0.6;
    ctx.strokeStyle = p.color;
    ctx.lineWidth = 1.5;
    const tasselStart = r;
    for (let i = 0; i < 5; i++) {
      const tx = (i / 4 - 0.5) * r * 0.4;
      ctx.beginPath();
      ctx.moveTo(tx, tasselStart);
      ctx.lineTo(tx * 1.3, tasselStart + s * 0.2);
      ctx.stroke();
    }

    // Tassel knot
    ctx.beginPath();
    ctx.arc(0, tasselStart, 3, 0, Math.PI * 2);
    ctx.fillStyle = p.accentColor;
    ctx.globalAlpha = 0.7;
    ctx.fill();

    ctx.restore();
  }

  drawHeaddress(cx, cy, s, p) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(cx, cy);

    // Fan/trapezoid shape (the main headdress)
    const topW = s * 0.8;
    const botW = s * 0.3;
    const h = s * 0.65;

    ctx.beginPath();
    ctx.moveTo(-topW / 2, -h / 2);
    ctx.quadraticCurveTo(-topW / 2, -h / 2 - s * 0.05, 0, -h / 2 - s * 0.02);
    ctx.quadraticCurveTo(topW / 2, -h / 2 - s * 0.05, topW / 2, -h / 2);
    ctx.lineTo(botW / 2, h / 2);
    ctx.lineTo(-botW / 2, h / 2);
    ctx.closePath();

    ctx.fillStyle = p.color;
    ctx.globalAlpha = 0.85;
    ctx.fill();
    ctx.strokeStyle = p.accentColor;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Floral ornament on top
    ctx.globalAlpha = 0.5;
    for (let i = 0; i < 5; i++) {
      const fx = (i / 4 - 0.5) * topW * 0.6;
      ctx.beginPath();
      ctx.arc(fx, -h / 2 + s * 0.05, 4, 0, Math.PI * 2);
      ctx.fillStyle = p.accentColor;
      ctx.fill();
    }

    // Decorative lines
    ctx.strokeStyle = p.accentColor;
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.25;
    ctx.beginPath();
    ctx.moveTo(-topW * 0.4, -h * 0.1);
    ctx.lineTo(topW * 0.4, -h * 0.1);
    ctx.moveTo(-topW * 0.35, h * 0.1);
    ctx.lineTo(topW * 0.35, h * 0.1);
    ctx.stroke();

    ctx.restore();
  }

  drawElephantDrum(cx, cy, s, p) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(cx, cy);

    // Hourglass shape
    const topW = s * 0.5;
    const midW = s * 0.2;
    const botW = s * 0.4;
    const totalH = s * 0.8;

    ctx.beginPath();
    ctx.moveTo(-topW / 2, -totalH / 2);
    ctx.quadraticCurveTo(-topW / 2, -totalH * 0.1, -midW / 2, 0);
    ctx.quadraticCurveTo(-midW / 2, totalH * 0.1, -botW / 2, totalH / 2);
    ctx.lineTo(botW / 2, totalH / 2);
    ctx.quadraticCurveTo(midW / 2, totalH * 0.1, midW / 2, 0);
    ctx.quadraticCurveTo(midW / 2, -totalH * 0.1, topW / 2, -totalH / 2);
    ctx.closePath();

    ctx.fillStyle = p.color;
    ctx.globalAlpha = 0.85;
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Decorative bands
    ctx.strokeStyle = p.accentColor;
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.4;

    // Top rim
    ctx.beginPath();
    ctx.moveTo(-topW * 0.45, -totalH / 2 + 3);
    ctx.lineTo(topW * 0.45, -totalH / 2 + 3);
    ctx.stroke();

    // Bottom rim
    ctx.beginPath();
    ctx.moveTo(-botW * 0.45, totalH / 2 - 3);
    ctx.lineTo(botW * 0.45, totalH / 2 - 3);
    ctx.stroke();

    // Centre band
    ctx.beginPath();
    ctx.moveTo(-midW * 0.6, 0);
    ctx.quadraticCurveTo(-midW * 0.3, -totalH * 0.05, 0, 0);
    ctx.quadraticCurveTo(midW * 0.3, totalH * 0.05, midW * 0.6, 0);
    ctx.stroke();

    // Decorative zigzag
    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.3;
    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      const t = i / 7;
      const yy = -totalH * 0.35 + t * totalH * 0.7;
      const xx = ((i % 2) - 0.5) * 2 * (midW * 0.3 + (1 - Math.abs(t - 0.5) * 2) * (topW * 0.2));
      if (i === 0) ctx.moveTo(xx, yy);
      else ctx.lineTo(xx, yy);
    }
    ctx.stroke();

    ctx.restore();
  }

  drawJanggu(cx, cy, s, p) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(cx, cy);

    const r = s * 0.35;
    const waist = s * 0.12;
    const totalH = s * 0.8;

    ctx.globalAlpha = 0.85;

    // Waist rectangle
    ctx.fillStyle = p.color;
    ctx.fillRect(-waist / 2, -totalH * 0.12, waist, totalH * 0.24);

    // Top bowl (drawn as polygon for simplicity)
    ctx.beginPath();
    ctx.moveTo(-r, -totalH * 0.22);
    ctx.quadraticCurveTo(-r * 1.1, -totalH * 0.4, -r * 0.6, -totalH * 0.45);
    ctx.quadraticCurveTo(0, -totalH * 0.48, r * 0.6, -totalH * 0.45);
    ctx.quadraticCurveTo(r * 1.1, -totalH * 0.4, r, -totalH * 0.22);
    ctx.quadraticCurveTo(waist * 0.8, -totalH * 0.15, waist / 2, -totalH * 0.12);
    ctx.lineTo(-waist / 2, -totalH * 0.12);
    ctx.quadraticCurveTo(-waist * 0.8, -totalH * 0.15, -r, -totalH * 0.22);
    ctx.closePath();
    ctx.fillStyle = p.color;
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Bottom bowl
    ctx.beginPath();
    ctx.moveTo(-r, totalH * 0.22);
    ctx.quadraticCurveTo(-r * 1.1, totalH * 0.4, -r * 0.6, totalH * 0.45);
    ctx.quadraticCurveTo(0, totalH * 0.48, r * 0.6, totalH * 0.45);
    ctx.quadraticCurveTo(r * 1.1, totalH * 0.4, r, totalH * 0.22);
    ctx.quadraticCurveTo(waist * 0.8, totalH * 0.15, waist / 2, totalH * 0.12);
    ctx.lineTo(-waist / 2, totalH * 0.12);
    ctx.quadraticCurveTo(-waist * 0.8, totalH * 0.15, -r, totalH * 0.22);
    ctx.closePath();
    ctx.fillStyle = p.color;
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Drum head highlight (top)
    ctx.beginPath();
    ctx.ellipse(0, -totalH * 0.4, r * 0.22, r * 0.12, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#DEB887';
    ctx.globalAlpha = 0.25;
    ctx.fill();

    // Drum head highlight (bottom)
    ctx.beginPath();
    ctx.ellipse(0, totalH * 0.4, r * 0.22, r * 0.12, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#DEB887';
    ctx.globalAlpha = 0.25;
    ctx.fill();

    // Straps
    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    ctx.lineWidth = 1.5;
    ctx.globalAlpha = 0.25;
    ctx.beginPath();
    ctx.moveTo(-r * 0.8, -totalH * 0.3);
    ctx.quadraticCurveTo(-r * 1.0, 0, -r * 0.8, totalH * 0.3);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(r * 0.8, -totalH * 0.3);
    ctx.quadraticCurveTo(r * 1.0, 0, r * 0.8, totalH * 0.3);
    ctx.stroke();

    ctx.restore();
  }

  drawTeapot(cx, cy, s, p) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(cx, cy);
    // Teapot body (oval)
    const bw = s * 0.45, bh = s * 0.4;
    ctx.beginPath();
    ctx.ellipse(0, 0, bw, bh, 0, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.globalAlpha = 0.85;
    ctx.fill();
    ctx.strokeStyle = p.accentColor;
    ctx.lineWidth = 1.5;
    ctx.stroke();
    // Lid (small dome on top)
    ctx.beginPath();
    ctx.ellipse(0, -bh, bw * 0.35, 4, 0, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.fill();
    // Spout (left side)
    ctx.beginPath();
    ctx.moveTo(-bw * 0.7, -bh * 0.2);
    ctx.lineTo(-bw - s * 0.15, -bh * 0.1);
    ctx.lineTo(-bw - s * 0.15, 0);
    ctx.lineTo(-bw * 0.7, bh * 0.1);
    ctx.fillStyle = p.color;
    ctx.globalAlpha = 0.7;
    ctx.fill();
    // Handle (right side, arc)
    ctx.beginPath();
    ctx.arc(bw * 0.5, -bh * 0.05, s * 0.2, -Math.PI * 0.3, Math.PI * 0.3);
    ctx.strokeStyle = p.color;
    ctx.lineWidth = 3;
    ctx.globalAlpha = 0.7;
    ctx.stroke();
    // Rim highlight
    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.4;
    ctx.beginPath();
    ctx.moveTo(-bw * 0.6, -bh * 0.85);
    ctx.lineTo(bw * 0.6, -bh * 0.85);
    ctx.stroke();
    ctx.restore();
  }

  drawDrumTower(cx, cy, s, p) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(cx, cy);
    const tiers = 3;
    const tw = s * 0.7, th = s * 0.25;
    // Draw from bottom up
    for (let i = tiers - 1; i >= 0; i--) {
      const yOff = (i - 1) * th;
      const wScale = 1 - i * 0.2;
      const w = tw * wScale;
      // Roof (triangle top)
      ctx.beginPath();
      ctx.moveTo(-w, yOff + th * 0.3);
      ctx.lineTo(0, yOff - th * 0.2);
      ctx.lineTo(w, yOff + th * 0.3);
      ctx.closePath();
      ctx.fillStyle = p.color;
      ctx.globalAlpha = 0.75 + i * 0.05;
      ctx.fill();
      ctx.strokeStyle = p.accentColor;
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.4;
      ctx.stroke();
      // Body (rectangle below roof)
      ctx.fillStyle = p.color;
      ctx.globalAlpha = 0.5;
      ctx.fillRect(-w * 0.7, yOff + th * 0.3, w * 1.4, th * 0.2);
    }
    // Base
    ctx.fillStyle = p.color;
    ctx.globalAlpha = 0.85;
    ctx.fillRect(-tw * 0.9, th * 0.3, tw * 1.8, th * 0.15);
    // Door arch
    ctx.beginPath();
    ctx.arc(0, th * 0.3 + 4, s * 0.08, Math.PI, 0);
    ctx.lineTo(s * 0.08, th * 0.15);
    ctx.lineTo(-s * 0.08, th * 0.15);
    ctx.closePath();
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.globalAlpha = 0.5;
    ctx.fill();
    ctx.restore();
  }

  drawCrossbow(cx, cy, s, p) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(cx, cy);
    // Bow arc (horizontal)
    const bowW = s * 0.7, bowH = s * 0.15;
    ctx.beginPath();
    ctx.moveTo(-bowW, 0);
    ctx.quadraticCurveTo(0, -bowH * 1.5, bowW, 0);
    ctx.strokeStyle = p.color;
    ctx.lineWidth = 2.5;
    ctx.globalAlpha = 0.85;
    ctx.stroke();
    // Bowstring
    ctx.beginPath();
    ctx.moveTo(-bowW, 0);
    ctx.lineTo(bowW, 0);
    ctx.strokeStyle = 'rgba(255,255,255,0.3)';
    ctx.lineWidth = 1;
    ctx.stroke();
    // Stock (horizontal rectangle behind the bow)
    ctx.fillStyle = p.color;
    ctx.globalAlpha = 0.85;
    ctx.fillRect(-bowW * 0.8, -4, s * 0.4, 8);
    // Trigger/lock
    ctx.fillStyle = p.accentColor;
    ctx.globalAlpha = 0.6;
    ctx.fillRect(bowW * 0.15, 4, 4, s * 0.12);
    // Arrow tip (triangle at end of stock)
    ctx.beginPath();
    ctx.moveTo(-bowW * 0.8 - 6, 0);
    ctx.lineTo(-bowW * 0.8 - 2, -4);
    ctx.lineTo(-bowW * 0.8 - 2, 4);
    ctx.closePath();
    ctx.fillStyle = p.accentColor;
    ctx.globalAlpha = 0.7;
    ctx.fill();
    ctx.restore();
  }

  drawBow(cx, cy, s, p) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(cx, cy);
    // Bow arc (vertical)
    const bowW = s * 0.15, bowH = s * 0.7;
    ctx.beginPath();
    ctx.moveTo(0, -bowH);
    ctx.quadraticCurveTo(bowW * 2, -bowH * 0.2, 0, bowH);
    ctx.strokeStyle = p.color;
    ctx.lineWidth = 3;
    ctx.globalAlpha = 0.85;
    ctx.stroke();
    // Bowstring
    ctx.beginPath();
    ctx.moveTo(0, -bowH);
    ctx.lineTo(0, bowH);
    ctx.strokeStyle = 'rgba(255,255,255,0.3)';
    ctx.lineWidth = 1;
    ctx.stroke();
    // Arrow (vertical line through the bow)
    ctx.beginPath();
    ctx.moveTo(0, -bowH);
    ctx.lineTo(0, bowH + s * 0.1);
    ctx.strokeStyle = p.color;
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.7;
    ctx.stroke();
    // Arrowhead (triangle at top)
    ctx.beginPath();
    ctx.moveTo(0, -bowH - 4);
    ctx.lineTo(-4, -bowH + 2);
    ctx.lineTo(4, -bowH + 2);
    ctx.closePath();
    ctx.fillStyle = p.accentColor;
    ctx.globalAlpha = 0.7;
    ctx.fill();
    // Fletching (notch at bottom)
    ctx.beginPath();
    ctx.moveTo(0, bowH + s * 0.1);
    ctx.lineTo(-3, bowH + 4);
    ctx.lineTo(3, bowH + 4);
    ctx.closePath();
    ctx.fillStyle = p.accentColor;
    ctx.globalAlpha = 0.4;
    ctx.fill();
    ctx.restore();
  }

  drawKnife(cx, cy, s, p) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(cx, cy);
    // Blade (tilted slightly)
    const bladeH = s * 0.5, bladeW = s * 0.12;
    ctx.beginPath();
    ctx.moveTo(-bladeW, -bladeH);
    ctx.lineTo(bladeW, -bladeH);
    ctx.lineTo(bladeW * 2, bladeH);
    ctx.lineTo(-bladeW * 2, bladeH);
    ctx.closePath();
    ctx.fillStyle = '#C0C0C0';
    ctx.globalAlpha = 0.85;
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.3)';
    ctx.lineWidth = 1;
    ctx.stroke();
    // Blade edge highlight
    ctx.beginPath();
    ctx.moveTo(0, -bladeH);
    ctx.lineTo(0, bladeH);
    ctx.strokeStyle = 'rgba(255,255,255,0.4)';
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.4;
    ctx.stroke();
    // Handle
    ctx.fillStyle = p.color;
    ctx.globalAlpha = 0.85;
    ctx.fillRect(-bladeW * 1.5, bladeH - 2, bladeW * 3, s * 0.2);
    // Handle wrapping lines
    ctx.strokeStyle = p.accentColor;
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.3;
    for (let i = 0; i < 3; i++) {
      const y = bladeH + 2 + i * (s * 0.2 / 3);
      ctx.beginPath();
      ctx.moveTo(-bladeW * 1.2, y);
      ctx.lineTo(bladeW * 1.2, y);
      ctx.stroke();
    }
    // Pommel
    ctx.beginPath();
    ctx.arc(0, bladeH + s * 0.2, 3, 0, Math.PI * 2);
    ctx.fillStyle = p.accentColor;
    ctx.globalAlpha = 0.6;
    ctx.fill();
    ctx.restore();
  }

  drawDeer(cx, cy, s, p) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(cx, cy);
    // Body (simple ellipse)
    ctx.beginPath();
    ctx.ellipse(0, s * 0.05, s * 0.3, s * 0.18, 0, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.globalAlpha = 0.85;
    ctx.fill();
    // Neck (rectangle going up)
    ctx.fillRect(-4, -s * 0.2, 8, s * 0.25);
    // Head (small circle)
    ctx.beginPath();
    ctx.arc(0, -s * 0.28, s * 0.08, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.fill();
    // Antlers (two branching lines)
    ctx.strokeStyle = p.color;
    ctx.lineWidth = 1.5;
    ctx.globalAlpha = 0.7;
    for (let side = -1; side <= 1; side += 2) {
      ctx.beginPath();
      ctx.moveTo(side * 4, -s * 0.3);
      ctx.lineTo(side * s * 0.15, -s * 0.5);
      ctx.lineTo(side * s * 0.22, -s * 0.55);
      ctx.moveTo(side * s * 0.1, -s * 0.45);
      ctx.lineTo(side * s * 0.18, -s * 0.48);
      ctx.stroke();
    }
    // Legs (four vertical lines)
    ctx.strokeStyle = p.color;
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.6;
    for (let side = -1; side <= 1; side += 2) {
      ctx.beginPath();
      ctx.moveTo(side * s * 0.15, s * 0.2);
      ctx.lineTo(side * s * 0.15, s * 0.45);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(side * s * 0.05, s * 0.2);
      ctx.lineTo(side * s * 0.05, s * 0.45);
      ctx.stroke();
    }
    ctx.restore();
  }

  drawWoodCarving(cx, cy, s, p) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(cx, cy);
    // Abstract wood carving - a totem-like face
    // Oval face
    ctx.beginPath();
    ctx.ellipse(0, 0, s * 0.35, s * 0.45, 0, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.globalAlpha = 0.85;
    ctx.fill();
    ctx.strokeStyle = p.accentColor;
    ctx.lineWidth = 1.5;
    ctx.stroke();
    // Eyes (two circles)
    ctx.beginPath();
    ctx.arc(-s * 0.12, -s * 0.08, 5, 0, Math.PI * 2);
    ctx.arc(s * 0.12, -s * 0.08, 5, 0, Math.PI * 2);
    ctx.fillStyle = p.accentColor;
    ctx.globalAlpha = 0.7;
    ctx.fill();
    // Mouth
    ctx.beginPath();
    ctx.arc(0, s * 0.18, s * 0.08, 0, Math.PI);
    ctx.strokeStyle = p.accentColor;
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.6;
    ctx.stroke();
    // Carved lines on forehead
    ctx.strokeStyle = p.accentColor;
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.3;
    ctx.beginPath();
    ctx.moveTo(-s * 0.15, -s * 0.2);
    ctx.lineTo(s * 0.15, -s * 0.2);
    ctx.moveTo(-s * 0.12, -s * 0.25);
    ctx.lineTo(s * 0.12, -s * 0.25);
    ctx.stroke();
    ctx.restore();
  }

  drawShuiScript(cx, cy, s, p) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(cx, cy);
    // Scroll/paper background
    ctx.beginPath();
    this.roundRect(ctx, -s * 0.35, -s * 0.45, s * 0.7, s * 0.9, 4);
    ctx.fillStyle = '#F5E6C8';
    ctx.globalAlpha = 0.7;
    ctx.fill();
    ctx.strokeStyle = p.color;
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.5;
    ctx.stroke();
    // Script characters (abstract squiggles)
    ctx.strokeStyle = '#4A3728';
    ctx.lineWidth = 1.5;
    ctx.globalAlpha = 0.8;
    for (let col = 0; col < 3; col++) {
      const cx = (col - 1) * s * 0.12;
      for (let row = 0; row < 4; row++) {
        const cy = (row - 1.5) * s * 0.15;
        ctx.beginPath();
        ctx.moveTo(cx - 3, cy);
        ctx.quadraticCurveTo(cx + 2, cy - 4, cx + 4, cy + 1);
        ctx.quadraticCurveTo(cx - 1, cy + 4, cx - 3, cy);
        ctx.stroke();
      }
    }
    // Seal stamp (red square bottom-right)
    ctx.fillStyle = '#CC3333';
    ctx.globalAlpha = 0.6;
    ctx.fillRect(s * 0.2, s * 0.3, 8, 8);
    ctx.restore();
  }

  drawCeremonyPole(cx, cy, s, p) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(cx, cy);
    // Main pole (vertical)
    ctx.fillStyle = p.color;
    ctx.globalAlpha = 0.85;
    ctx.fillRect(-3, -s * 0.45, 6, s * 0.9);
    // Crossbars
    const barLen = s * 0.35;
    ctx.lineWidth = 3;
    ctx.strokeStyle = p.color;
    ctx.globalAlpha = 0.7;
    for (let i = 0; i < 3; i++) {
      const y = -s * 0.3 + i * s * 0.3;
      ctx.beginPath();
      ctx.moveTo(-barLen, y);
      ctx.lineTo(barLen, y);
      ctx.stroke();
    }
    // Flags/streamers hanging from crossbars
    ctx.fillStyle = p.accentColor;
    ctx.globalAlpha = 0.5;
    for (let side = -1; side <= 1; side += 2) {
      for (let i = 0; i < 2; i++) {
        const y = -s * 0.3 + i * s * 0.3;
        ctx.beginPath();
        ctx.moveTo(side * barLen, y);
        ctx.lineTo(side * (barLen + s * 0.08), y + s * 0.1);
        ctx.lineTo(side * barLen, y + s * 0.1);
        ctx.closePath();
        ctx.fill();
      }
    }
    // Top ornament (circle)
    ctx.beginPath();
    ctx.arc(0, -s * 0.45, 4, 0, Math.PI * 2);
    ctx.fillStyle = p.accentColor;
    ctx.globalAlpha = 0.8;
    ctx.fill();
    ctx.restore();
  }

  drawHockey(cx, cy, s, p) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(cx, cy);
    // Stick shaft (angled)
    ctx.strokeStyle = p.color;
    ctx.lineWidth = 3;
    ctx.globalAlpha = 0.85;
    ctx.beginPath();
    ctx.moveTo(-s * 0.2, s * 0.2);
    ctx.lineTo(s * 0.1, -s * 0.4);
    ctx.stroke();
    // Stick blade (flat part)
    ctx.strokeStyle = p.color;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(s * 0.1, -s * 0.4);
    ctx.lineTo(s * 0.3, -s * 0.35);
    ctx.stroke();
    // Ball
    const bx = s * 0.35, by = -s * 0.35;
    ctx.beginPath();
    ctx.arc(bx, by, 5, 0, Math.PI * 2);
    ctx.fillStyle = p.accentColor;
    ctx.globalAlpha = 0.7;
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.3)';
    ctx.lineWidth = 1;
    ctx.stroke();
    // Motion lines behind ball
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.3;
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.moveTo(bx + 6 + i * 4, by - 2 + i * 2);
      ctx.lineTo(bx + 10 + i * 5, by - 2 + i * 2);
      ctx.stroke();
    }
    ctx.restore();
  }

  drawWaistBelt(cx, cy, s, p) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(cx, cy);
    // Belt band (curved horizontal)
    ctx.beginPath();
    ctx.moveTo(-s * 0.4, 4);
    ctx.quadraticCurveTo(0, -4, s * 0.4, 4);
    ctx.strokeStyle = p.color;
    ctx.lineWidth = 5;
    ctx.globalAlpha = 0.85;
    ctx.stroke();
    // Buckle (rectangle in center)
    ctx.strokeStyle = p.accentColor;
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.7;
    ctx.strokeRect(-6, -6, 12, 12);
    // Buckle inner
    ctx.strokeRect(-3, -3, 6, 6);
    // Bead decorations along the belt
    ctx.fillStyle = p.accentColor;
    ctx.globalAlpha = 0.4;
    for (let side = -1; side <= 1; side += 2) {
      for (let i = 1; i <= 3; i++) {
        const bx = side * (i * s * 0.1 + 8);
        ctx.beginPath();
        ctx.arc(bx, 0, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
  }

  drawBamboo(cx, cy, s, p) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(cx, cy);
    // Bamboo weave pattern - crossed strips
    // Horizontal strips
    ctx.strokeStyle = p.color;
    ctx.lineWidth = 2.5;
    ctx.globalAlpha = 0.75;
    for (let i = -2; i <= 2; i++) {
      const y = i * s * 0.12;
      ctx.beginPath();
      ctx.moveTo(-s * 0.35, y);
      ctx.lineTo(s * 0.35, y);
      ctx.stroke();
    }
    // Vertical strips (alternating over/under weave)
    ctx.strokeStyle = p.accentColor;
    ctx.lineWidth = 2.5;
    ctx.globalAlpha = 0.55;
    for (let i = -2; i <= 2; i++) {
      const x = i * s * 0.12 + (i % 2) * 3;
      ctx.beginPath();
      ctx.moveTo(x, -s * 0.35);
      ctx.lineTo(x, s * 0.35);
      ctx.stroke();
    }
    // Border
    ctx.strokeStyle = p.color;
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.4;
    ctx.strokeRect(-s * 0.38, -s * 0.38, s * 0.76, s * 0.76);
    ctx.restore();
  }

  drawBrocade(cx, cy, s, p) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(cx, cy);
    // Brocade fabric - grid pattern
    const size = s * 0.7;
    // Background
    ctx.fillStyle = p.color;
    ctx.globalAlpha = 0.85;
    ctx.fillRect(-size / 2, -size / 2, size, size);
    // Grid lines
    ctx.strokeStyle = p.accentColor;
    ctx.lineWidth = 1.5;
    ctx.globalAlpha = 0.4;
    for (let i = 0; i <= 4; i++) {
      const p = -size / 2 + i * (size / 4);
      ctx.beginPath();
      ctx.moveTo(-size / 2, p);
      ctx.lineTo(size / 2, p);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(p, -size / 2);
      ctx.lineTo(p, size / 2);
      ctx.stroke();
    }
    // Diamond pattern in each cell
    ctx.fillStyle = p.accentColor;
    ctx.globalAlpha = 0.3;
    const cellSize = size / 4;
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if ((r + c) % 2 === 0) {
          const dx = -size / 2 + c * cellSize + cellSize / 2;
          const dy = -size / 2 + r * cellSize + cellSize / 2;
          ctx.beginPath();
          ctx.moveTo(dx, dy - cellSize * 0.3);
          ctx.lineTo(dx + cellSize * 0.3, dy);
          ctx.lineTo(dx, dy + cellSize * 0.3);
          ctx.lineTo(dx - cellSize * 0.3, dy);
          ctx.closePath();
          ctx.fill();
        }
      }
    }
    // Fringe at bottom
    ctx.strokeStyle = p.accentColor;
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.35;
      for (let i = 0; i < 7; i++) {
        const fx = -size / 2 + i * (size / 6);
        ctx.beginPath();
        ctx.moveTo(fx, size / 2);
        ctx.lineTo(fx - 2, size / 2 + s * 0.08);
        ctx.stroke();
      }
    ctx.restore();
  }

  drawBatik(cx, cy, s, p) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(cx, cy);
    // Fabric square
    const size = s * 0.7;
    ctx.fillStyle = '#F5F0E0';
    ctx.globalAlpha = 0.6;
    ctx.fillRect(-size / 2, -size / 2, size, size);
    // Wax-resist pattern (irregular wavy lines)
    ctx.strokeStyle = p.color;
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.7;
    // Wavy lines
    for (let row = 0; row < 4; row++) {
      const y = -size / 2 + (row + 0.5) * (size / 4);
      ctx.beginPath();
      ctx.moveTo(-size / 2 + 4, y);
      for (let x = -size / 2 + 4; x <= size / 2 - 4; x += 6) {
        ctx.lineTo(x, y + Math.sin(x * 0.3) * 4);
      }
      ctx.stroke();
    }
    // Crackle effect (deterministic branching lines)
    ctx.strokeStyle = p.accentColor;
    ctx.lineWidth = 0.5;
    ctx.globalAlpha = 0.25;
    const cracklePoints = [
      [-1,-1,2,2], [1,-1,-2,-1], [-1,1,1,3], [1,1,-3,-1],
      [0,0,2,-2], [-0.5,0.5,-1,1], [0.5,-0.5,3,0], [-0.3,0.3,0,2],
      [0.8,0.2,-2,1], [-0.8,-0.2,1,-2], [0.2,0.8,-1,-1], [-0.2,-0.8,2,0]
    ];
    for (const [rx, ry, dx, dy] of cracklePoints) {
      const sx = rx * size * 0.35;
      const sy = ry * size * 0.35;
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(sx + dx + 4, sy + dy + 2);
      ctx.stroke();
    }
    // Border
    ctx.strokeStyle = p.color;
    ctx.lineWidth = 1.5;
    ctx.globalAlpha = 0.4;
    ctx.strokeRect(-size / 2, -size / 2, size, size);
    ctx.restore();
  }

  drawTerracedField(cx, cy, s, p) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(cx, cy);
    // Terraced fields - stepped rectangles going up
    const steps = 5;
    const stepH = s * 0.12;
    const totalW = s * 0.7;
    ctx.globalAlpha = 0.85;
    for (let i = 0; i < steps; i++) {
      const y = -s * 0.3 + i * stepH;
      const w = totalW * (1 - i * 0.12);
      // Terrace platform
      ctx.fillStyle = p.color;
      ctx.fillRect(-w / 2, y, w, stepH * 0.7);
      // Rice plants (small lines)
      ctx.strokeStyle = p.accentColor;
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.5;
      for (let j = 0; j < 3; j++) {
        const px = -w / 2 + (j + 0.5) * (w / 3);
        ctx.beginPath();
        ctx.moveTo(px, y);
        ctx.lineTo(px, y - 4);
        ctx.stroke();
      }
      // Water reflection
      ctx.fillStyle = 'rgba(200,220,255,0.15)';
      ctx.fillRect(-w / 2, y, w, stepH * 0.3);
    }
    // Left and right edges (embankment)
    ctx.strokeStyle = p.color;
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.4;
    ctx.beginPath();
    ctx.moveTo(-totalW / 2, -s * 0.3);
    ctx.lineTo(-totalW * 0.2, s * 0.3 + stepH);
    ctx.moveTo(totalW / 2, -s * 0.3);
    ctx.lineTo(totalW * 0.2, s * 0.3 + stepH);
    ctx.stroke();
    ctx.restore();
  }

  drawFelt(cx, cy, s, p) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(cx, cy);
    // Felt mat (circle)
    const r = s * 0.4;
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fillStyle = '#F5E6D0';
    ctx.globalAlpha = 0.6;
    ctx.fill();
    ctx.strokeStyle = p.color;
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.85;
    ctx.stroke();
    // Inner decorative circles
    ctx.strokeStyle = p.accentColor;
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.4;
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.7, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.4, 0, Math.PI * 2);
    ctx.stroke();
    // Central pattern (diamond)
    ctx.fillStyle = p.accentColor;
    ctx.globalAlpha = 0.3;
    ctx.beginPath();
    ctx.moveTo(0, -r * 0.3);
    ctx.lineTo(r * 0.2, 0);
    ctx.lineTo(0, r * 0.3);
    ctx.lineTo(-r * 0.2, 0);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  drawTea(cx, cy, s, p) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(cx, cy);
    // Tea leaf (simple leaf shape)
    ctx.beginPath();
    ctx.moveTo(-s * 0.05, -s * 0.35);
    ctx.quadraticCurveTo(-s * 0.4, -s * 0.15, -s * 0.15, s * 0.1);
    ctx.quadraticCurveTo(-s * 0.05, s * 0.35, s * 0.2, s * 0.1);
    ctx.quadraticCurveTo(s * 0.35, -s * 0.15, -s * 0.05, -s * 0.35);
    ctx.closePath();
    ctx.fillStyle = '#2D5A27';
    ctx.globalAlpha = 0.75;
    ctx.fill();
    ctx.strokeStyle = p.color;
    ctx.lineWidth = 1.5;
    ctx.stroke();
    // Leaf vein
    ctx.beginPath();
    ctx.moveTo(0, -s * 0.15);
    ctx.quadraticCurveTo(s * 0.05, 0, s * 0.02, s * 0.2);
    ctx.strokeStyle = '#1A3A1A';
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.3;
    ctx.stroke();
    // Second smaller leaf
    ctx.beginPath();
    ctx.moveTo(s * 0.2, -s * 0.15);
    ctx.quadraticCurveTo(s * 0.4, -s * 0.05, s * 0.3, s * 0.1);
    ctx.quadraticCurveTo(s * 0.2, s * 0.2, s * 0.1, s * 0.05);
    ctx.quadraticCurveTo(s * 0.1, -s * 0.05, s * 0.2, -s * 0.15);
    ctx.closePath();
    ctx.fillStyle = '#2D5A27';
    ctx.globalAlpha = 0.5;
    ctx.fill();
    ctx.restore();
  }

  drawNuoMask(cx, cy, s, p) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(cx, cy);
    // Mask face (oval shape)
    ctx.beginPath();
    ctx.ellipse(0, 0, s * 0.35, s * 0.48, 0, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.globalAlpha = 0.85;
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.25)';
    ctx.lineWidth = 2;
    ctx.stroke();
    // Fierce eyes
    ctx.fillStyle = '#FFD700';
    ctx.globalAlpha = 0.7;
    ctx.beginPath();
    ctx.arc(-s * 0.14, -s * 0.12, 5, 0, Math.PI * 2);
    ctx.arc(s * 0.14, -s * 0.12, 5, 0, Math.PI * 2);
    ctx.fill();
    // Pupils
    ctx.fillStyle = '#1A0A05';
    ctx.globalAlpha = 0.8;
    ctx.beginPath();
    ctx.arc(-s * 0.14, -s * 0.12, 2.5, 0, Math.PI * 2);
    ctx.arc(s * 0.14, -s * 0.12, 2.5, 0, Math.PI * 2);
    ctx.fill();
    // Fierce eyebrows (slanted)
    ctx.strokeStyle = '#1A0A05';
    ctx.lineWidth = 2.5;
    ctx.globalAlpha = 0.6;
    ctx.beginPath();
    ctx.moveTo(-s * 0.25, -s * 0.22);
    ctx.lineTo(-s * 0.08, -s * 0.2);
    ctx.moveTo(s * 0.25, -s * 0.22);
    ctx.lineTo(s * 0.08, -s * 0.2);
    ctx.stroke();
    // Wide mouth with teeth
    ctx.beginPath();
    ctx.arc(0, s * 0.2, s * 0.15, 0.1, Math.PI - 0.1);
    ctx.strokeStyle = '#1A0A05';
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.6;
    ctx.stroke();
    // Teeth
    ctx.fillStyle = '#F5F5F0';
    ctx.globalAlpha = 0.5;
    ctx.fillRect(-s * 0.08, s * 0.18, 5, 5);
    ctx.fillRect(s * 0.03, s * 0.18, 5, 5);
    ctx.fillRect(-s * 0.02, s * 0.18, 5, 5);
    // Nose ridge
    ctx.beginPath();
    ctx.moveTo(0, -s * 0.02);
    ctx.lineTo(0, s * 0.1);
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    // Crown/horn decorations
    ctx.fillStyle = p.accentColor;
    ctx.globalAlpha = 0.5;
    ctx.beginPath();
    ctx.moveTo(-s * 0.08, -s * 0.45);
    ctx.lineTo(0, -s * 0.55);
    ctx.lineTo(s * 0.08, -s * 0.45);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  drawBambooHat(cx, cy, s, p) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(cx, cy);
    // Wide conical hat (large arc)
    const hatW = s * 0.6, hatH = s * 0.2;
    ctx.beginPath();
    ctx.moveTo(-hatW, 0);
    ctx.quadraticCurveTo(-hatW * 0.8, -hatH, 0, -hatH * 0.8);
    ctx.quadraticCurveTo(hatW * 0.8, -hatH, hatW, 0);
    ctx.closePath();
    ctx.fillStyle = p.color;
    ctx.globalAlpha = 0.85;
    ctx.fill();
    ctx.strokeStyle = p.accentColor;
    ctx.lineWidth = 1.5;
    ctx.stroke();
    // Brim
    ctx.beginPath();
    ctx.moveTo(-hatW - s * 0.05, 0);
    ctx.lineTo(hatW + s * 0.05, 0);
    ctx.strokeStyle = p.color;
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.6;
    ctx.stroke();
    // Weave lines (concentric arcs)
    ctx.strokeStyle = p.accentColor;
    ctx.lineWidth = 0.5;
    ctx.globalAlpha = 0.25;
    for (let i = 1; i <= 3; i++) {
      const t = i / 4;
      ctx.beginPath();
      ctx.moveTo(-hatW * (1 - t * 0.3), -hatH * t);
      ctx.quadraticCurveTo(0, -hatH * t * 1.1, hatW * (1 - t * 0.3), -hatH * t);
      ctx.stroke();
    }
    // Top button
    ctx.beginPath();
    ctx.arc(0, -hatH * 0.8, 3, 0, Math.PI * 2);
    ctx.fillStyle = p.accentColor;
    ctx.globalAlpha = 0.5;
    ctx.fill();
    ctx.restore();
  }

  drawCarpet(cx, cy, s, p) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(cx, cy);
    // Blanket/carpet rectangle
    const w = s * 0.65, h = s * 0.5;
    ctx.fillStyle = p.color;
    ctx.globalAlpha = 0.85;
    ctx.fillRect(-w / 2, -h / 2, w, h);
    // Border
    ctx.strokeStyle = p.accentColor;
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.5;
    ctx.strokeRect(-w / 2, -h / 2, w, h);
    // Inner decorative border
    ctx.strokeStyle = p.accentColor;
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.25;
    ctx.strokeRect(-w / 2 + 4, -h / 2 + 4, w - 8, h - 8);
    // Diamond pattern center
    ctx.fillStyle = p.accentColor;
    ctx.globalAlpha = 0.3;
    ctx.beginPath();
    ctx.moveTo(0, -h * 0.25);
    ctx.lineTo(w * 0.25, 0);
    ctx.lineTo(0, h * 0.25);
    ctx.lineTo(-w * 0.25, 0);
    ctx.closePath();
    ctx.fill();
    // Tassel fringe at top
    ctx.strokeStyle = p.color;
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.35;
    for (let i = 0; i < 7; i++) {
      const fx = -w / 2 + i * (w / 6);
      ctx.beginPath();
      ctx.moveTo(fx, -h / 2);
      ctx.lineTo(fx - 1, -h / 2 - 5);
      ctx.stroke();
    }
    ctx.restore();
  }

  drawMatryoshka(cx, cy, s, p) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(cx, cy);
    // Doll body (rounded trapezoid)
    const topW = s * 0.25, botW = s * 0.45, dollH = s * 0.6;
    ctx.beginPath();
    ctx.moveTo(-topW / 2, -dollH / 2);
    ctx.quadraticCurveTo(-topW / 2, -dollH / 2 - s * 0.03, 0, -dollH / 2 - s * 0.05);
    ctx.quadraticCurveTo(topW / 2, -dollH / 2 - s * 0.03, topW / 2, -dollH / 2);
    ctx.lineTo(botW / 2, dollH / 2);
    ctx.quadraticCurveTo(botW / 2, dollH / 2 + 2, 0, dollH / 2 + 2);
    ctx.quadraticCurveTo(-botW / 2, dollH / 2 + 2, -botW / 2, dollH / 2);
    ctx.closePath();
    ctx.fillStyle = p.color;
    ctx.globalAlpha = 0.85;
    ctx.fill();
    ctx.strokeStyle = p.accentColor;
    ctx.lineWidth = 1.5;
    ctx.stroke();
    // Face circle
    ctx.fillStyle = '#F5E6D0';
    ctx.globalAlpha = 0.7;
    ctx.beginPath();
    ctx.arc(0, -s * 0.05, s * 0.12, 0, Math.PI * 2);
    ctx.fill();
    // Eyes
    ctx.fillStyle = '#1A0A05';
    ctx.globalAlpha = 0.6;
    ctx.beginPath();
    ctx.arc(-4, -s * 0.07, 1.5, 0, Math.PI * 2);
    ctx.arc(4, -s * 0.07, 1.5, 0, Math.PI * 2);
    ctx.fill();
    // Smile
    ctx.beginPath();
    ctx.arc(0, 0, 3, 0.1, Math.PI - 0.1);
    ctx.strokeStyle = '#1A0A05';
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.4;
    ctx.stroke();
    // Decorative flower on dress
    ctx.fillStyle = p.accentColor;
    ctx.globalAlpha = 0.4;
    ctx.beginPath();
    ctx.arc(0, s * 0.12, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  drawFurHat(cx, cy, s, p) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(cx, cy);
    // Tall fur hat (cylinder)
    const hatW = s * 0.4, hatH = s * 0.5;
    // Main body
    ctx.beginPath();
    this.roundRect(ctx, -hatW / 2, -hatH / 2, hatW, hatH, 6);
    ctx.fillStyle = p.color;
    ctx.globalAlpha = 0.85;
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    // Fur texture (short strokes)
    ctx.strokeStyle = p.accentColor;
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.3;
    for (let i = 0; i < 8; i++) {
      const x = (i / 7 - 0.5) * hatW * 0.7;
      const y = -hatH * 0.15 + (i % 3) * hatH * 0.15;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + 2, y - 3);
      ctx.stroke();
    }
    // Ear flaps (two semicircles at bottom)
    ctx.fillStyle = p.color;
    ctx.globalAlpha = 0.7;
    ctx.beginPath();
    ctx.ellipse(-hatW / 2 - 4, hatH * 0.35, 4, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(hatW / 2 + 4, hatH * 0.35, 4, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    // Top ornament
    ctx.beginPath();
    ctx.arc(0, -hatH / 2 - 3, 3, 0, Math.PI * 2);
    ctx.fillStyle = p.accentColor;
    ctx.globalAlpha = 0.5;
    ctx.fill();
    ctx.restore();
  }

  drawFishSkin(cx, cy, s, p) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(cx, cy);
    // Fish skin coat - a fish shape
    const fishLen = s * 0.6;
    ctx.beginPath();
    ctx.moveTo(-fishLen / 2, 0);
    ctx.quadraticCurveTo(-fishLen * 0.2, -s * 0.2, fishLen * 0.1, -s * 0.15);
    ctx.quadraticCurveTo(fishLen * 0.35, -s * 0.2, fishLen / 2, -s * 0.02);
    ctx.quadraticCurveTo(fishLen * 0.35, s * 0.15, fishLen * 0.1, s * 0.15);
    ctx.quadraticCurveTo(-fishLen * 0.2, s * 0.2, -fishLen / 2, 0);
    ctx.closePath();
    ctx.fillStyle = '#6B8E9B';
    ctx.globalAlpha = 0.7;
    ctx.fill();
    ctx.strokeStyle = p.color;
    ctx.lineWidth = 1.5;
    ctx.stroke();
    // Scales (arcs along the body)
    ctx.strokeStyle = p.accentColor;
    ctx.lineWidth = 0.8;
    ctx.globalAlpha = 0.3;
    for (let i = 0; i < 5; i++) {
      const t = (i + 0.5) / 5;
      const sx = -fishLen * 0.2 + t * fishLen * 0.6;
      const sy = -s * 0.05 + Math.sin(t * Math.PI) * s * 0.12;
      ctx.beginPath();
      ctx.arc(sx, sy, 3, Math.PI, 0);
      ctx.stroke();
    }
    // Tail fin
    ctx.beginPath();
    ctx.moveTo(-fishLen / 2, 0);
    ctx.lineTo(-fishLen / 2 - 8, -s * 0.12);
    ctx.moveTo(-fishLen / 2, 0);
    ctx.lineTo(-fishLen / 2 - 8, s * 0.12);
    ctx.strokeStyle = p.color;
    ctx.lineWidth = 1.5;
    ctx.globalAlpha = 0.5;
    ctx.stroke();
    // Eye
    ctx.beginPath();
    ctx.arc(fishLen * 0.2, -4, 2, 0, Math.PI * 2);
    ctx.fillStyle = '#1A0A05';
    ctx.globalAlpha = 0.4;
    ctx.fill();
    ctx.restore();
  }

  drawMonochord(cx, cy, s, p) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(cx, cy);
    // Long rectangular body
    const bodyW = s * 0.15, bodyH = s * 0.65;
    ctx.beginPath();
    this.roundRect(ctx, -bodyW / 2, -bodyH / 2, bodyW, bodyH, 4);
    ctx.fillStyle = p.color;
    ctx.globalAlpha = 0.85;
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.lineWidth = 1;
    ctx.stroke();
    // Single string (center line)
    ctx.beginPath();
    ctx.moveTo(0, -bodyH / 2 - 3);
    ctx.lineTo(0, bodyH / 2 + 3);
    ctx.strokeStyle = '#C0C0C0';
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.6;
    ctx.stroke();
    // Sound hole (small circle at top)
    ctx.beginPath();
    ctx.arc(0, -bodyH * 0.15, bodyW * 0.25, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.globalAlpha = 0.5;
    ctx.fill();
    // Tuning pegs at top
    ctx.fillStyle = p.accentColor;
    ctx.globalAlpha = 0.5;
    ctx.fillRect(-bodyW - 3, -bodyH / 2 - 4, bodyW + 3, 3);
    // Bridge at bottom
    ctx.fillStyle = p.accentColor;
    ctx.fillRect(-bodyW - 2, bodyH / 2 - 3, bodyW + 4, 3);
    ctx.restore();
  }

  drawApron(cx, cy, s, p) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(cx, cy);
    // Apron shape (trapezoid, wider at bottom)
    const topW = s * 0.25, botW = s * 0.55, h = s * 0.55;
    ctx.beginPath();
    ctx.moveTo(-topW / 2, -h / 2);
    ctx.lineTo(topW / 2, -h / 2);
    ctx.lineTo(botW / 2, h / 2);
    ctx.lineTo(-botW / 2, h / 2);
    ctx.closePath();
    ctx.fillStyle = p.color;
    ctx.globalAlpha = 0.85;
    ctx.fill();
    ctx.strokeStyle = p.accentColor;
    ctx.lineWidth = 1.5;
    ctx.stroke();
    // Waistband at top
    ctx.fillStyle = p.accentColor;
    ctx.globalAlpha = 0.5;
    ctx.fillRect(-topW * 0.6, -h / 2 - 4, topW * 1.2, 5);
    // Decorative stripes
    ctx.strokeStyle = p.accentColor;
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.25;
    for (let i = 1; i <= 3; i++) {
      const t = i / 4;
      const y = -h / 2 + t * h;
      const wAtY = topW + (botW - topW) * t;
      ctx.beginPath();
      ctx.moveTo(-wAtY * 0.4, y);
      ctx.lineTo(wAtY * 0.4, y);
      ctx.stroke();
    }
    // Tassels at bottom
    ctx.strokeStyle = p.accentColor;
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.3;
    for (let i = 0; i < 5; i++) {
      const fx = -botW * 0.4 + i * (botW * 0.2);
      ctx.beginPath();
      ctx.moveTo(fx, h / 2);
      ctx.lineTo(fx - 1, h / 2 + 5);
      ctx.stroke();
    }
    ctx.restore();
  }

  drawPaper(cx, cy, s, p) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(cx, cy);
    // Paper/scroll shape
    const paperH = s * 0.6, paperW = s * 0.35;
    ctx.fillStyle = '#F5E6C8';
    ctx.globalAlpha = 0.7;
    ctx.beginPath();
    this.roundRect(ctx, -paperW / 2, -paperH / 2, paperW, paperH, 3);
    ctx.fill();
    // Rolled top
    ctx.beginPath();
    ctx.ellipse(0, -paperH / 2, paperW / 2, 3, 0, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.globalAlpha = 0.6;
    ctx.fill();
    // Rolled bottom
    ctx.beginPath();
    ctx.ellipse(0, paperH / 2, paperW / 2, 3, 0, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.fill();
    // Dongba characters (abstract pictograms)
    ctx.strokeStyle = '#4A3728';
    ctx.lineWidth = 1.5;
    ctx.globalAlpha = 0.6;
    // Sun-like pictogram
    ctx.beginPath();
    ctx.arc(-5, -4, 4, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-5, -8);
    ctx.lineTo(-5, -12);
    ctx.moveTo(-1, -4);
    ctx.lineTo(3, -4);
    ctx.stroke();
    // Mountain-like pictogram
    ctx.beginPath();
    ctx.moveTo(2, 2);
    ctx.lineTo(6, -4);
    ctx.lineTo(10, 2);
    ctx.stroke();
    ctx.restore();
  }

  /* 佤族木鼓 — hollowed log drum */
  drawWoodDrum(cx, cy, s, p) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(cx, cy);
    const w = s * 0.6, h = s * 0.4;
    // Log body — rounded rectangle
    ctx.fillStyle = p.color;
    ctx.globalAlpha = 0.85;
    this.roundRect(ctx, -w/2, -h/2, w, h, 6);
    ctx.fill();
    // Carved slit (the hollow opening)
    ctx.fillStyle = '#1A0A05';
    ctx.globalAlpha = 0.7;
    this.roundRect(ctx, -w*0.28, -h*0.35, w*0.56, h*0.7, 3);
    ctx.fill();
    // Red ritual markings
    ctx.strokeStyle = p.accentColor;
    ctx.lineWidth = 1.5;
    ctx.globalAlpha = 0.4;
    ctx.beginPath();
    ctx.moveTo(-w*0.45, -h*0.3);
    ctx.lineTo(w*0.45, -h*0.3);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-w*0.45, h*0.3);
    ctx.lineTo(w*0.45, h*0.3);
    ctx.stroke();
    // Carved notch marks on sides
    ctx.globalAlpha = 0.3;
    for (let i = -2; i <= 2; i++) {
      ctx.fillStyle = p.accentColor;
      ctx.globalAlpha = 0.2;
      ctx.fillRect(-w/2 - 3, i*6 - 2, 4, 3);
      ctx.fillRect(w/2 - 1, i*6 - 2, 4, 3);
    }
    ctx.restore();
  }

  /* 基诺族大鼓 — large barrel drum */
  drawBigDrum(cx, cy, s, p) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(cx, cy);
    const r = s * 0.55, bodyH = s * 0.55;
    // Drum body (barrel — wider at top/bottom)
    ctx.fillStyle = p.color;
    ctx.globalAlpha = 0.85;
    ctx.beginPath();
    ctx.moveTo(-r*0.5, -bodyH/2);
    ctx.quadraticCurveTo(-r*0.7, 0, -r*0.5, bodyH/2);
    ctx.lineTo(r*0.5, bodyH/2);
    ctx.quadraticCurveTo(r*0.7, 0, r*0.5, -bodyH/2);
    ctx.closePath();
    ctx.fill();
    // Drumhead top
    ctx.beginPath();
    ctx.ellipse(0, -bodyH/2, r*0.5, r*0.15, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#DEB887';
    ctx.globalAlpha = 0.35;
    ctx.fill();
    // Drumhead bottom
    ctx.beginPath();
    ctx.ellipse(0, bodyH/2, r*0.5, r*0.15, 0, 0, Math.PI * 2);
    ctx.fill();
    // Sun pattern on body
    ctx.globalAlpha = 0.35;
    ctx.strokeStyle = p.accentColor || '#D4A017';
    ctx.lineWidth = 1.5;
    const sunR = bodyH * 0.3;
    ctx.beginPath();
    ctx.arc(0, 0, sunR, 0, Math.PI * 2);
    ctx.stroke();
    // Sun rays
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(Math.cos(a) * sunR, Math.sin(a) * sunR);
      ctx.lineTo(Math.cos(a) * (sunR + 8), Math.sin(a) * (sunR + 8));
      ctx.stroke();
    }
    ctx.restore();
  }

  /* ─────── 回纹 border pattern ─────── */

  drawBorderPattern(ctx, w, h) {
    const m = 12;
    const cell = 18;
    const alpha = 0.35;

    ctx.save();
    ctx.strokeStyle = 'rgba(210, 180, 130, ' + alpha + ')';
    ctx.lineWidth = 1.2;
    ctx.globalAlpha = 1;

    const drawUnit = (bx, by, rot) => {
      ctx.save();
      ctx.translate(bx, by);
      ctx.rotate(rot);
      ctx.beginPath();
      // Outer square
      ctx.rect(-cell / 2, -cell / 2, cell, cell);
      // Inner L-shape corridor (回)
      ctx.moveTo(-cell * 0.35, -cell * 0.35);
      ctx.lineTo(cell * 0.35, -cell * 0.35);
      ctx.lineTo(cell * 0.35, cell * 0.1);
      ctx.lineTo(cell * 0.1, cell * 0.1);
      ctx.lineTo(cell * 0.1, -cell * 0.1);
      ctx.lineTo(-cell * 0.35, -cell * 0.1);
      ctx.closePath();
      ctx.stroke();
      ctx.restore();
    };

    // Top edge
    for (let i = 0; i < Math.ceil(w / cell) + 2; i++) {
      drawUnit(m + i * cell, m, 0);
    }
    // Bottom edge
    for (let i = 0; i < Math.ceil(w / cell) + 2; i++) {
      drawUnit(m + i * cell, h - m, Math.PI);
    }
    // Left edge
    for (let i = 0; i < Math.ceil(h / cell) + 2; i++) {
      drawUnit(m, m + i * cell, -Math.PI / 2);
    }
    // Right edge
    for (let i = 0; i < Math.ceil(h / cell) + 2; i++) {
      drawUnit(w - m, m + i * cell, Math.PI / 2);
    }

    ctx.restore();
  }

  /* ─────── Full-screen diamond pattern ─────── */

  drawBackgroundPattern(ctx, w, h) {
    ctx.save();
    const size = 40;
    ctx.fillStyle = 'rgba(200, 160, 100, 0.06)';
    ctx.strokeStyle = 'rgba(200, 160, 100, 0.18)';
    ctx.lineWidth = 0.8;

    for (let y = -size; y < h + size; y += size) {
      const offset = (Math.floor(y / size) % 2) * (size / 2);
      for (let x = -size + offset; x < w + size; x += size) {
        ctx.beginPath();
        ctx.moveTo(x, y - size * 0.3);
        ctx.lineTo(x + size * 0.3, y);
        ctx.lineTo(x, y + size * 0.3);
        ctx.lineTo(x - size * 0.3, y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }
    }

    ctx.restore();
  }

  /* ─────── Lotus petal ring (outer) ─────── */

  drawLotusPetalRing(ctx, cx, cy, R, scale, colors, angle) {
    const count = 24;
    const alpha = Math.min(0.7, 0.2 + 0.5 * scale);
    ctx.save();
    ctx.translate(cx, cy);

    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2 + angle;
      const petalR = (12 + 6 * Math.sin(i * 2.1)) * scale;

      ctx.save();
      ctx.rotate(a);
      ctx.translate(R, 0);

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(
        petalR * 0.4, -petalR * 0.35,
        petalR * 0.8, -petalR * 0.15,
        petalR, 0
      );
      ctx.bezierCurveTo(
        petalR * 0.8, petalR * 0.15,
        petalR * 0.4, petalR * 0.35,
        0, 0
      );
      ctx.closePath();

      const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, petalR);
      const c1 = colors[i % colors.length];
      const c2 = colors[(i + 1) % colors.length];
      grad.addColorStop(0, c1);
      grad.addColorStop(1, c2);
      ctx.fillStyle = grad;
      ctx.globalAlpha = alpha;
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.15)';
      ctx.lineWidth = 0.8;
      ctx.stroke();

      ctx.restore();
    }

    ctx.restore();
  }

  /* ─────── Geometric meander ring (middle) ─────── */

  drawGeometricRing(ctx, cx, cy, R, scale, colors, angle) {
    const count = 16;
    const alpha = Math.min(0.55, 0.15 + 0.4 * scale);
    ctx.save();
    ctx.translate(cx, cy);

    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2 + angle;
      const w1 = 8 * scale;
      const w2 = 14 * scale;

      ctx.save();
      ctx.rotate(a);
      ctx.translate(R, 0);

      ctx.beginPath();
      ctx.moveTo(-w1, 0);
      ctx.lineTo(0, -w2);
      ctx.lineTo(w1, 0);
      ctx.lineTo(0, w2);
      ctx.closePath();

      ctx.fillStyle = colors[i % colors.length];
      ctx.globalAlpha = alpha;
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.1)';
      ctx.lineWidth = 0.8;
      ctx.stroke();

      ctx.restore();
    }

    ctx.restore();
  }

  /* ─────── Double bead ring (inner) ─────── */

  drawBeadRing(ctx, cx, cy, R, scale, colors, angle) {
    const count = 20;
    const alpha = Math.min(0.6, 0.2 + 0.4 * scale);
    ctx.save();
    ctx.translate(cx, cy);

    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2 + angle * 0.7;
      const bx = Math.cos(a) * (R + 4 * scale);
      const by = Math.sin(a) * (R + 4 * scale);
      ctx.beginPath();
      ctx.arc(bx, by, 3 * scale, 0, Math.PI * 2);
      ctx.fillStyle = colors[i % colors.length];
      ctx.globalAlpha = alpha;
      ctx.fill();
    }

    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2 + angle * 0.7 + Math.PI / count;
      const bx = Math.cos(a) * (R - 4 * scale);
      const by = Math.sin(a) * (R - 4 * scale);
      ctx.beginPath();
      ctx.arc(bx, by, 2.5 * scale, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.globalAlpha = alpha * 0.8;
      ctx.fill();
    }

    ctx.restore();
  }

  drawLute(cx, cy, s, p) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(cx, cy);
    const bw = s * 0.5;
    const bh = s * 0.45;
    ctx.beginPath();
    ctx.moveTo(0, bh * 0.5);
    ctx.quadraticCurveTo(-bw * 0.6, bh * 0.2, -bw * 0.5, -bh * 0.1);
    ctx.quadraticCurveTo(-bw * 0.3, -bh * 0.4, 0, -bh * 0.5);
    ctx.quadraticCurveTo(bw * 0.3, -bh * 0.4, bw * 0.5, -bh * 0.1);
    ctx.quadraticCurveTo(bw * 0.6, bh * 0.2, 0, bh * 0.5);
    ctx.closePath();
    ctx.fillStyle = p.color;
    ctx.globalAlpha = 0.85;
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fillStyle = p.color;
    ctx.globalAlpha = 0.7;
    ctx.fillRect(-3, -bh * 0.5 - s * 0.25, 6, s * 0.25);
    ctx.beginPath();
    ctx.arc(0, 0, s * 0.06, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.35)';
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(-2, -bh * 0.5 - s * 0.2);
    ctx.lineTo(-2, bh * 0.5);
    ctx.moveTo(2, -bh * 0.5 - s * 0.2);
    ctx.lineTo(2, bh * 0.5);
    ctx.stroke();
    ctx.restore();
  }

  drawGourdSheng(cx, cy, s, p) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.beginPath();
    ctx.arc(0, s * 0.08, s * 0.3, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.globalAlpha = 0.85;
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, -s * 0.2, s * 0.1, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.globalAlpha = 0.8;
    ctx.fill();
    ctx.strokeStyle = p.accentColor;
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.6;
    for (let i = -1; i <= 1; i++) {
      ctx.beginPath();
      ctx.moveTo(i * s * 0.08, -s * 0.25);
      ctx.lineTo(i * s * 0.08, -s * 0.5);
      ctx.stroke();
    }
    ctx.restore();
  }

  drawQiangFlute(cx, cy, s, p) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(cx, cy);
    const tubeW = s * 0.1;
    const tubeH = s * 0.65;
    const gap = s * 0.18;
    for (let side = -1; side <= 1; side += 2) {
      const tx = side * gap / 2;
      ctx.fillStyle = p.color;
      ctx.globalAlpha = 0.85;
      ctx.fillRect(tx - tubeW / 2, -tubeH / 2, tubeW, tubeH);
      ctx.strokeStyle = 'rgba(255,255,255,0.2)';
      ctx.lineWidth = 0.8;
      for (let j = 0; j < 3; j++) {
        const ny = -tubeH / 2 + (j + 1) * tubeH / 4;
        ctx.beginPath();
        ctx.moveTo(tx - tubeW / 2, ny);
        ctx.lineTo(tx + tubeW / 2, ny);
        ctx.stroke();
      }
    }
    ctx.strokeStyle = p.accentColor;
    ctx.lineWidth = 1.5;
    ctx.globalAlpha = 0.5;
    for (let i = 0; i < 2; i++) {
      const ty = -tubeH / 2 + (i + 1) * tubeH / 3;
      ctx.beginPath();
      ctx.moveTo(-gap / 2 - tubeW / 2, ty);
      ctx.lineTo(gap / 2 + tubeW / 2, ty);
      ctx.stroke();
    }
    ctx.fillStyle = p.color;
    ctx.globalAlpha = 0.6;
    ctx.fillRect(-s * 0.04, -tubeH / 2 - s * 0.08, s * 0.08, s * 0.08);
    ctx.restore();
  }

  drawEagleFlute(cx, cy, s, p) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(-0.15);
    const fw = s * 0.1;
    const fh = s * 0.6;
    ctx.beginPath();
    ctx.moveTo(-fw * 0.7, -fh / 2);
    ctx.quadraticCurveTo(-fw, 0, -fw * 0.6, fh / 2);
    ctx.lineTo(fw * 0.3, fh / 2);
    ctx.quadraticCurveTo(fw * 0.7, 0, fw * 0.4, -fh / 2);
    ctx.closePath();
    ctx.fillStyle = p.color;
    ctx.globalAlpha = 0.85;
    ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.15)';
    ctx.lineWidth = 0.8;
    ctx.stroke();
    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.globalAlpha = 0.6;
    for (let i = 0; i < 3; i++) {
      const hy = -fh / 3 + i * fh / 3;
      ctx.beginPath();
      ctx.arc(0, hy, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = 'rgba(255,255,255,0.15)';
    ctx.globalAlpha = 0.5;
    ctx.beginPath();
    ctx.arc(0, -fh / 2 + 3, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  drawEmbroidery(cx, cy, s, p) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(cx, cy);
    const es = s * 0.6;
    ctx.fillStyle = '#F5F0E8';
    ctx.globalAlpha = 0.6;
    ctx.fillRect(-es / 2, -es / 2, es, es);
    ctx.strokeStyle = p.color;
    ctx.lineWidth = 1.5;
    ctx.globalAlpha = 0.5;
    ctx.strokeRect(-es / 2, -es / 2, es, es);
    ctx.strokeStyle = p.color;
    ctx.lineWidth = 1.5;
    ctx.globalAlpha = 0.7;
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        if ((r + c) % 2 === 0) continue;
        const sx = -es / 2 + (c + 0.5) * es / 3;
        const sy = -es / 2 + (r + 0.5) * es / 3;
        ctx.beginPath();
        ctx.moveTo(sx - 3, sy - 3);
        ctx.lineTo(sx + 3, sy + 3);
        ctx.moveTo(sx + 3, sy - 3);
        ctx.lineTo(sx - 3, sy + 3);
        ctx.stroke();
      }
    }
    ctx.fillStyle = p.accentColor;
    ctx.globalAlpha = 0.6;
    ctx.beginPath();
    ctx.arc(0, 0, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  drawVest(cx, cy, s, p) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(cx, cy);
    const vw = s * 0.5;
    const vh = s * 0.6;
    ctx.beginPath();
    ctx.moveTo(-vw / 2, -vh / 2);
    ctx.lineTo(-vw / 6, -vh / 2);
    ctx.lineTo(-vw / 6, vh / 2);
    ctx.lineTo(-vw / 2, vh / 2);
    ctx.closePath();
    ctx.fillStyle = p.color;
    ctx.globalAlpha = 0.85;
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    ctx.lineWidth = 0.8;
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(vw / 6, -vh / 2);
    ctx.lineTo(vw / 2, -vh / 2);
    ctx.lineTo(vw / 2, vh / 2);
    ctx.lineTo(vw / 6, vh / 2);
    ctx.closePath();
    ctx.fillStyle = p.color;
    ctx.globalAlpha = 0.85;
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    ctx.lineWidth = 0.8;
    ctx.stroke();
    ctx.strokeStyle = p.accentColor;
    ctx.lineWidth = 1.5;
    ctx.globalAlpha = 0.4;
    ctx.beginPath();
    ctx.moveTo(-vw / 6, -vh / 2);
    ctx.quadraticCurveTo(0, -vh / 2 + s * 0.12, vw / 6, -vh / 2);
    ctx.stroke();
    ctx.strokeStyle = 'rgba(255,255,255,0.3)';
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.35;
    for (let i = 0; i < 5; i++) {
      const fy = -vh / 3 + i * vh / 6;
      ctx.beginPath();
      ctx.moveTo(-vw / 2, fy);
      ctx.lineTo(-vw / 2 - 3, fy - 1);
      ctx.moveTo(vw / 2, fy);
      ctx.lineTo(vw / 2 + 3, fy - 1);
      ctx.stroke();
    }
    ctx.restore();
  }
}
