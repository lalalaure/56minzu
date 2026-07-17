/**
 * 图鉴 + 抽卡模块
 * localStorage 持久化已解锁集合
 */

class CollectionAlbum {
  constructor() {
    this.unlocked = this.load();
    this.pendingNew = -1;
    this.onSelect = null;
    this.visualRef = null;
  }

  /* ─────── localStorage ─────── */

  load() {
    try {
      const raw = localStorage.getItem('ethnicAlbum');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  save() {
    localStorage.setItem('ethnicAlbum', JSON.stringify(this.unlocked));
  }

  /* ─────── 解锁状态 ─────── */

  isUnlocked(index) {
    return this.unlocked.includes(index);
  }

  unlock(index) {
    if (this.isUnlocked(index)) return false;
    this.unlocked.push(index);
    this.unlocked.sort((a, b) => a - b);
    this.save();
    this.pendingNew = index;
    return true;
  }

  reset() {
    this.unlocked = [];
    this.pendingNew = -1;
    this.save();
    this.updateDrawProgress();
  }

  get count() {
    return this.unlocked.length;
  }

  get total() {
    return ETHNIC_GROUPS.length;
  }

  get isComplete() {
    return this.count >= this.total;
  }

  /* ─────── 抽卡 ─────── */

  draw() {
    const available = [];
    for (let i = 0; i < this.total; i++) {
      if (!this.isUnlocked(i)) available.push(i);
    }
    if (available.length === 0) return -1;
    return available[Math.floor(Math.random() * available.length)];
  }

  /* ─────── 图鉴渲染 ─────── */

  render(container) {
    container.innerHTML = '';
    for (let i = 0; i < this.total; i++) {
      const g = ETHNIC_GROUPS[i];
      const card = document.createElement('div');
      card.className = 'album-card' + (this.isUnlocked(i) ? ' unlocked' : ' locked');
      card.dataset.index = i;

      const miniCanvas = document.createElement('canvas');
      miniCanvas.className = 'album-card-canvas';
      miniCanvas.width = 64;
      miniCanvas.height = 64;
      card.appendChild(miniCanvas);

      // 添加四个金色装饰角
      const corners = ['tl', 'tr', 'bl', 'br'];
      corners.forEach(pos => {
        const corner = document.createElement('div');
        corner.className = 'album-card-corner ' + pos;
        card.appendChild(corner);
      });

      const name = document.createElement('div');
      name.className = 'album-card-name';
      name.textContent = this.isUnlocked(i) ? g.name : '?';
      card.appendChild(name);

      const roman = document.createElement('div');
      roman.className = 'album-card-roman';
      roman.textContent = this.isUnlocked(i) ? g.romanName : '';
      card.appendChild(roman);

      if (this.pendingNew === i) {
        const badge = document.createElement('span');
        badge.className = 'album-card-new';
        badge.textContent = 'NEW';
        card.appendChild(badge);
      }

      if (this.isUnlocked(i) && this.visualRef) {
        this.visualRef.drawCultureItemOnCanvas(miniCanvas, i, 18);
      } else {
        const dpr = window.devicePixelRatio || 1;
        const cssSize = 64;
        miniCanvas.width = cssSize * dpr;
        miniCanvas.height = cssSize * dpr;
        miniCanvas.style.width = cssSize + 'px';
        miniCanvas.style.height = cssSize + 'px';
        const ctx = miniCanvas.getContext('2d');
        ctx.scale(dpr, dpr);
        // 锁定状态 — 敦煌壁画质感底纹
        const grad = ctx.createRadialGradient(32, 32, 5, 32, 32, 32);
        grad.addColorStop(0, '#3A2015');
        grad.addColorStop(1, '#1A0A05');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, cssSize, cssSize);
        // 石绿色问号带金边
        ctx.fillStyle = 'rgba(30,140,125,0.3)';
        ctx.font = 'bold 28px "Noto Serif SC", serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = 'rgba(212,160,23,0.3)';
        ctx.shadowBlur = 6;
        ctx.fillText('?', 32, 32);
        ctx.shadowBlur = 0;
        // 边框装饰
        ctx.strokeStyle = 'rgba(212,160,23,0.15)';
        ctx.lineWidth = 1;
        ctx.strokeRect(4, 4, 56, 56);
      }

      card.addEventListener('click', () => {
        if (this.isUnlocked(i) && this.onSelect) {
          this.onSelect(i);
        }
      });

      container.appendChild(card);
    }
  }

  /* ─────── 面板控制 ─────── */

  show() {
    const panel = document.getElementById('albumPanel');
    panel.classList.remove('hidden');
    this.render(document.getElementById('albumGrid'));
    document.getElementById('collectedCount').textContent = this.count;
    this.pendingNew = -1;
  }

  hide() {
    document.getElementById('albumPanel').classList.add('hidden');
  }

  /* ─────── 进度更新 ─────── */

  updateDrawProgress() {
    const el = document.getElementById('drawProgress');
    if (el) el.textContent = `${this.count}/${this.total}`;
  }

  /* ─────── 抽卡动画（三段式） ─────── */

  showDrawAnimation(index, callback) {
    const g = ETHNIC_GROUPS[index];
    const inner = document.getElementById('drawCardInner');
    const frontBar = document.getElementById('drawFrontBar');
    const overlay = document.getElementById('drawOverlay');
    const progressText = document.getElementById('drawProgressText');

    if (!inner || !frontBar || !overlay) {
      if (callback) callback();
      return;
    }

    // Set front content
    frontBar.style.background = `linear-gradient(135deg, ${g.colors[0]}, ${g.colors[1] || g.colors[0]})`;
    document.getElementById('drawFrontName').textContent = g.name;
    document.getElementById('drawFrontRoman').textContent = g.romanName;
    document.getElementById('drawFrontLabel').textContent = '\u2726 \u65B0\u89E3\u9501';
    if (progressText) progressText.textContent = '';

    const cardCanvas = document.getElementById('drawCardCanvas');
    if (this.visualRef && cardCanvas) {
      this.visualRef.drawCultureItemOnCanvas(cardCanvas, index, 52);
    }

    // Reset card
    inner.classList.remove('flipped');
    overlay.classList.remove('hidden');
    const frame = document.querySelector('.draw-card-frame');
    if (frame) frame.classList.remove('draw-entered');

    // Phase 1: Anticipation — card flies in from bottom (0–800ms)
    requestAnimationFrame(() => {
      if (frame) frame.classList.add('draw-entered');
    });
    if (this.visualRef) {
      this.visualRef.drawGlowWave();
    }

    // Phase 2: Reveal — card flips (800–2200ms)
    setTimeout(() => {
      inner.classList.add('flipped');
      if (this.visualRef) {
        this.visualRef.triggerUnlockRing();
      }
      // 金箔碎片飞散效果
      this._spawnGoldBurst();
    }, 800);

    // Phase 3: Celebration — show progress (2200–3200ms)
    setTimeout(() => {
      if (progressText) {
        progressText.textContent = `\u5DF2\u6536\u96C6 ${this.count + 1} / ${this.total}`;
        progressText.classList.add('draw-progress-show');
      }
    }, 2200);

    setTimeout(() => {
      overlay.classList.add('hidden');
      if (progressText) {
        progressText.classList.remove('draw-progress-show');
      }
      if (callback) callback();
    }, 3200);
  }

  _spawnGoldBurst() {
    const overlay = document.getElementById('drawOverlay');
    if (!overlay) return;
    const count = 14;
    for (let i = 0; i < count; i++) {
      const el = document.createElement('div');
      el.className = 'gold-fragment';
      const angle = (i / count) * 360;
      const dist = 60 + Math.random() * 80;
      const tx = Math.cos(angle * Math.PI / 180) * dist;
      const ty = Math.sin(angle * Math.PI / 180) * dist;
      el.style.setProperty('--tx', tx + 'px');
      el.style.setProperty('--ty', ty + 'px');
      el.style.animationDelay = (Math.random() * 0.15) + 's';
      overlay.appendChild(el);
      setTimeout(() => { if (el.parentNode) el.remove(); }, 1200);
    }
  }
}
