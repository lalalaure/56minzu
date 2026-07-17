const App = {
  visual: null,
  collection: null,
  currentGroupIndex: 0,
  isConverged: false,
  isWelcomeDismissed: false,
  isInTutorial: false,
  tutorialStep: 0,
  tutorialSteps: [
    {
      icon: '\u2726',
      title: '邂逅',
      desc: '点击底部「邂逅」探索新的民族，每次邂逅随机遇见一个民族'
    },
    {
      icon: '\u2756',
      title: '图鉴',
      desc: '点击「图鉴」查看已邂逅的民族，点击卡片跳转查看详情，集齐56个触发祝福'
    }
  ],

  async init() {
    console.log('[民族图鉴] App initializing...');
    this.visual = new VisualSystem();
    console.log('[民族图鉴] VisualSystem created');
    this.collection = new CollectionAlbum();
    this.collection.visualRef = this.visual;
    this.collection.onSelect = (index) => {
      this.hideInfo();
      this.collection.hide();
      this.showGroup(index);
    };

    this.visual.setGroup(0);

    setTimeout(() => {
      const loading = document.getElementById('loadingOverlay');
      if (loading) {
        loading.classList.add('fade-out');
        setTimeout(() => { if (loading.parentNode) loading.remove(); }, 600);
      }
    }, 1500);

    document.addEventListener('keydown', (e) => {
      if (this.isWelcomeDismissed) {
        if (this.isInTutorial) {
          if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            this.nextTutorialStep();
          }
          return;
        }
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          this.drawCard();
        }
      } else {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          this.dismissWelcome();
        }
      }
    });

    document.querySelectorAll('.ctrl-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        if (this.isInTutorial) return;
        const action = e.currentTarget.dataset.action;
        switch (action) {
          case 'info': if (this.isWelcomeDismissed) { this.toggleInfo(); } break;
          case 'draw': this.drawCard(); break;
          case 'album': this.collection.show(); break;
        }
      });
    });

    document.getElementById('closeInfo').addEventListener('click', () => this.hideInfo());
    document.getElementById('closeAlbum').addEventListener('click', () => this.collection.hide());
    document.getElementById('resetProgress').addEventListener('click', () => this.resetProgress());

    document.getElementById('mainCanvas').addEventListener('click', (e) => {
      if (this.isInTutorial || this.isConverged) return;
      const h = window.innerHeight, y = e.clientY;
      if (y < h * 0.8) this.toggleInfo();
    });

    this.welcomeOverlay = document.getElementById('welcomeOverlay');
    document.getElementById('welcomeDrawBtn').addEventListener('click', () => this.dismissWelcome());

    document.getElementById('convergeResetBtn').addEventListener('click', () => {
      this.isConverged = false;
      this.visual.resetFloat();
      this.visual.showEmblem();
      this.hideInfo();
      this.visual.setInfoActive(false);
      this.showGroup(0);
    });

    document.getElementById('tutorialNextBtn').addEventListener('click', () => this.nextTutorialStep());

    this.visual.setGroup(0);
    this._animLock = false;
  },

  dismissWelcome() {
    if (this.isWelcomeDismissed) return;
    this.isWelcomeDismissed = true;
    this.welcomeOverlay.classList.add('hidden');
    this.startTutorial();
  },

  /* ─────── Tutorial ─────── */

  startTutorial() {
    this.isInTutorial = true;
    this.tutorialStep = 0;
    document.getElementById('tutorialOverlay').classList.remove('hidden');
    this.renderTutorialStep(0);
  },

  renderTutorialStep(step) {
    const data = this.tutorialSteps[step];
    document.getElementById('tutorialIcon').textContent = data.icon;
    document.getElementById('tutorialTitle').textContent = data.title;
    document.getElementById('tutorialDesc').textContent = data.desc;

    const dots = document.querySelectorAll('.tutorial-dots .dot');
    dots.forEach((d, i) => d.classList.toggle('active', i === step));

    const btn = document.getElementById('tutorialNextBtn');
    btn.textContent = step < this.tutorialSteps.length - 1 ? '\u4E0B\u4E00\u6B65' : '\u5F00\u59CB\u63A2\u7D22';
  },

  nextTutorialStep() {
    if (this.tutorialStep < this.tutorialSteps.length - 1) {
      this.tutorialStep++;
      this.renderTutorialStep(this.tutorialStep);
    } else {
      this.finishTutorial();
    }
  },

  finishTutorial() {
    this.isInTutorial = false;
    document.getElementById('tutorialOverlay').classList.add('hidden');
    this.currentGroupIndex = 0;
    this.visual.setGroup(0);
    this.visual.showEmblem();
    this.hideInfo();
    const isNew = this.collection.unlock(0);
    if (isNew) this.triggerUnlockEffect();
    this.collection.updateDrawProgress();
    setTimeout(() => {
      this.showInfo();
      this.visual.setInfoActive(true);
    }, 800);
  },

  showGroup(index) {
    if (this.isConverged) this.resetFromConverge();
    this.currentGroupIndex = (index + ETHNIC_GROUPS.length) % ETHNIC_GROUPS.length;
    this.visual.transitionToGroup(this.currentGroupIndex, () => {
      this.visual.showEmblem();
      this.showInfo();
      this.visual.setInfoActive(true);
      setTimeout(() => { this.visual.emblemPulse(); }, 200);
    });
  },

  revealAfterDraw(idx) {
    this._animLock = true;
    this.currentGroupIndex = (idx + ETHNIC_GROUPS.length) % ETHNIC_GROUPS.length;

    const isNew = this.collection.unlock(this.currentGroupIndex);
    if (isNew) this.triggerUnlockEffect();
    this.collection.updateDrawProgress();

    this.visual.transitionToGroup(this.currentGroupIndex, () => {
      this.visual.showEmblem();
      this.showInfo();
      this.visual.setInfoActive(true);
      setTimeout(() => { this.visual.emblemPulse(); }, 200);
      this._animLock = false;
    });
  },

  startConverge() {
    this.isConverged = true;
    this.visual.startConverge();
    this.visual.hideEmblem();
    this.hideInfo();
  },

  resetFromConverge() {
    this.isConverged = false;
    this.visual.resetFloat();
    this.visual.showEmblem();
  },

  showInfo() {
    const group = ETHNIC_GROUPS[this.currentGroupIndex];
    if (!group) return;

    // Draw item icon on info card canvas
    const infoCanvas = document.getElementById('infoItemCanvas');
    if (infoCanvas && this.visual) {
      this.visual.drawCultureItemOnCanvas(infoCanvas, this.currentGroupIndex, 18);
    }

    const body = document.getElementById('infoBody');
    const swatchesHtml = group.colors
      .map((c, i) => {
        const chName = group.chineseColors && group.chineseColors[i]
          ? group.chineseColors[i].split('#')[0]
          : '';
        return `<span class="info-swatch" style="background:${c};" title="${chName}"></span>`;
      })
      .join('');

    body.innerHTML = `
      <div class="info-title">${group.name}</div>
      <div class="info-stats">
        <span class="info-stat">&#128101; ${group.population}</span>
        <span class="info-stat">&#128205; ${group.region}</span>
      </div>
      <div class="info-description">${group.description}</div>
      <div class="info-divider"></div>
      <div class="info-section">
        <div class="info-section-label">&#127881; 传统节日</div>
        <div class="info-section-value"><strong>${group.festival}</strong> — ${group.festivalDetail}</div>
      </div>
      <div class="info-section">
        <div class="info-section-label">&#127994; 代表性文化物品</div>
        <div class="info-section-value"><strong>${group.item}</strong>（${group.itemCategory}）<br>${group.itemDetail}</div>
      </div>
      <div class="info-section">
        <div class="info-section-label">&#10024; 传统纹样</div>
        <div class="info-section-value"><strong>${group.pattern}</strong><br>${group.patternDetail}</div>
      </div>
      <div class="info-section">
        <div class="info-section-label">&#127912; 传统服饰色彩</div>
        <div class="info-swatches">${swatchesHtml}</div>
        <div class="info-section-value" style="font-size:12px;margin-top:4px;">${group.garmentNote}</div>
      </div>
    `;

    document.getElementById('infoCard').classList.remove('hidden');
  },

  hideInfo() {
    document.getElementById('infoCard').classList.add('hidden');
    if (this.visual) this.visual.setInfoActive(false);
  },

  toggleInfo() {
    const card = document.getElementById('infoCard');
    if (card.classList.contains('hidden')) {
      this.showInfo();
      this.visual.setInfoActive(true);
      this.visual.emblemPulse();
    } else {
      this.hideInfo();
      this.visual.setInfoActive(false);
    }
  },

  /* ─────── 收集 & 抽卡 ─────── */

  triggerUnlockEffect() {
    this.visual.triggerUnlockRing();
    const badge = document.getElementById('newBadge');
    badge.classList.remove('hidden');
    clearTimeout(this._badgeTimer);
    this._badgeTimer = setTimeout(() => badge.classList.add('hidden'), 3000);
  },

  drawCard() {
    if (this.isConverged) return;
    if (this._animLock) return;

    if (this.collection.isComplete) {
      this.startConverge();
      return;
    }

    const idx = this.collection.draw();
    if (idx < 0) return;

    this._animLock = true;
    this.visual.hideEmblem();
    this.hideInfo();
    this.visual.setInfoActive(false);

    this.collection.showDrawAnimation(idx, () => {
      this.revealAfterDraw(idx);
    });
  },

  resetProgress: function() {
    if (this._animLock) return;
    if (!confirm('确定要重置所有收集进度吗？此操作不可撤销。')) return;
    this.collection.reset();
    this.collection.hide();
    this.isConverged = false;
    this.currentGroupIndex = 0;
    this.hideInfo();
    this.visual.resetFloat();
    this.visual.showEmblem();
    this.showGroup(0);
    if (this.albumGrid) document.getElementById('albumGrid').innerHTML = '';
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => App.init());
} else {
  App.init();
}
