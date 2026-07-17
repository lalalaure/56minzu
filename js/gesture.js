/**
 * 手势识别模块
 *
 * 手势规则：仅双拳→双掌展开触发抽卡 (CONVERGE)
 *           单手不做任何响应
 */

const Gesture = {
  NONE: 'none',
  OPEN: 'open',
  PEACE: 'peace',
  THUMB_UP: 'thumbUp',
  CONVERGE: 'converge'
};

class GestureDetector {
  constructor() {
    this.hands = null;
    this.camera = null;
    this.video = null;
    this.gestureCanvas = null;
    this.gestureCtx = null;

    this.currentGesture = Gesture.NONE;
    this.onGestureChange = null;
    this.modelReady = false;
    this.initAttempted = false;

    // Two-hand converge sequence state
    this.convergeState = 'idle'; // 'idle' | 'fists'
    this.convergeTimer = 0;
  }

  async init() {
    if (this.initAttempted) return this;
    this.initAttempted = true;

    this.video = document.getElementById('webcam');
    this.gestureCanvas = document.getElementById('gestureCanvas');
    this.gestureCtx = this.gestureCanvas.getContext('2d');

    this.gestureCanvas.width = 200;
    this.gestureCanvas.height = 150;

    const CDN_BASE = 'https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1675469240';

    this.hands = new Hands({
      locateFile: (file) => `${CDN_BASE}/${file}`
    });

    this.hands.setOptions({
      maxNumHands: 2,
      modelComplexity: 1,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    });

    this.hands.onResults((results) => {
      if (!this.modelReady) {
        this.modelReady = true;
        document.getElementById('loadingOverlay').classList.add('fade-out');
        setTimeout(() => {
          const el = document.getElementById('loadingOverlay');
          if (el) el.remove();
        }, 600);
      }
      this.onResults(results);
    });

    try {
      this.camera = new Camera(this.video, {
        onFrame: async () => {
          if (this.video.readyState >= 2) {
            try {
              await this.hands.send({ image: this.video });
            } catch (e) {}
          }
        },
        width: 400,
        height: 300
      });
      await this.camera.start();
    } catch (e) {
      document.getElementById('loadingOverlay').innerHTML =
        '<p style="color:#e88;">摄像头不可用</p><p style="font-size:13px;margin-top:8px;opacity:0.6;">请使用键盘/鼠标操作</p>';
    }

    this.video.style.display = 'none';

    setTimeout(() => {
      const el = document.getElementById('loadingOverlay');
      if (el && !el.classList.contains('fade-out')) {
        el.innerHTML = '<p>手势模型加载超时</p><p style="font-size:13px;margin-top:8px;opacity:0.6;">请使用键盘/鼠标操作</p>';
      }
    }, 30000);

    return this;
  }

  /* ─────── MediaPipe callback ─────── */

  onResults(results) {
    const ctx = this.gestureCtx;
    const cv = this.gestureCanvas;

    // Draw camera frame
    if (results.image) {
      ctx.drawImage(results.image, 0, 0, cv.width, cv.height);
    } else {
      ctx.clearRect(0, 0, cv.width, cv.height);
    }

    const hands = results.multiHandLandmarks;
    const handCount = hands ? hands.length : 0;

    // Draw landmarks for ALL detected hands
    if (hands) {
      for (const lm of hands) {
        drawConnectors(ctx, lm, HAND_CONNECTIONS, {
          color: 'rgba(6, 182, 212, 0.6)', lineWidth: 2
        });
        drawLandmarks(ctx, lm, {
          color: 'rgba(16, 185, 129, 0.7)', lineWidth: 1, radius: 3
        });
      }
    }

    // Classify based on hand count
    let gesture = Gesture.NONE;

    if (handCount === 0) {
      // No hand → reset converge sequence
      this.convergeState = 'idle';
    } else if (handCount === 1) {
      // Single hand → open / peace / thumbUp only
      gesture = this.classifyOneHand(hands[0]);
    } else {
      // Two hands → converge sequence only
      gesture = this.classifyTwoHands(hands[0], hands[1]);
    }

    // Show hand count indicator with converge sequence state
    let label, labelColor;
    if (handCount === 0) {
      label = '未检测到手';
      labelColor = '#888';
    } else if (handCount === 1) {
      label = '单手';
      labelColor = '#888';
    } else if (this.convergeState === 'fists') {
      label = '👊 握拳 ✓ → 展开';
      labelColor = '#ffd700';
    } else if (gesture === Gesture.CONVERGE) {
      label = '✋ 抽卡！';
      labelColor = '#6f6';
    } else {
      label = '👐 双手';
      labelColor = '#888';
    }
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(0, cv.height - 22, cv.width, 22);
    ctx.fillStyle = labelColor;
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(label, cv.width / 2, cv.height - 7);

    // Update gesture icon
    const iconEl = document.getElementById('gestureIcon');
    if (iconEl) {
      if (handCount === 0) iconEl.textContent = '✋';
      else if (this.convergeState === 'fists') iconEl.textContent = '👊';
      else if (gesture === Gesture.CONVERGE) iconEl.textContent = '✨';
      else iconEl.textContent = '✋';
    }

    this.updateGesture(gesture);
  }

  /* ─────── One-hand: no gestures ─────── */

  classifyOneHand(landmarks) {
    return Gesture.NONE;
  }

  /* ─────── Two-hand classifier (fist → open) ─────── */

  classifyTwoHands(lm1, lm2) {
    const c1 = this.getExtended(lm1).filter(Boolean).length;
    const c2 = this.getExtended(lm2).filter(Boolean).length;

    const bothFist = c1 === 0 && c2 === 0;
    const bothOpen = c1 >= 4 && c2 >= 4;

    switch (this.convergeState) {
      case 'idle':
        if (bothFist) {
          this.convergeState = 'fists';
          this.convergeTimer = Date.now();
        }
        break;

      case 'fists':
        const elapsed = Date.now() - this.convergeTimer;
        if (elapsed > 2000) {
          this.convergeState = 'idle';
          break;
        }
        if (bothOpen && elapsed > 250) {
          this.convergeState = 'idle';
          return Gesture.CONVERGE;
        }
        break;
    }

    return Gesture.NONE;
  }

  /* ─────── Finger extension detection ─────── */

  getExtended(landmarks) {
    const isStraight = (mcp, pip, tip) => {
      const v1x = pip.x - mcp.x, v1y = pip.y - mcp.y;
      const v2x = tip.x - pip.x, v2y = tip.y - pip.y;
      const dot = v1x * v2x + v1y * v2y;
      const m1 = Math.hypot(v1x, v1y);
      const m2 = Math.hypot(v2x, v2y);
      if (m1 < 0.001 || m2 < 0.001) return false;
      return dot / (m1 * m2) > 0.2;
    };

    const thumbExt = (() => {
      const d1 = (landmarks[4].x - landmarks[2].x) ** 2 + (landmarks[4].y - landmarks[2].y) ** 2;
      const d2 = (landmarks[3].x - landmarks[2].x) ** 2 + (landmarks[3].y - landmarks[2].y) ** 2;
      return d1 > d2 * 1.1;
    })();

    return [
      thumbExt,
      isStraight(landmarks[5], landmarks[6], landmarks[8]),
      isStraight(landmarks[9], landmarks[10], landmarks[12]),
      isStraight(landmarks[13], landmarks[14], landmarks[16]),
      isStraight(landmarks[17], landmarks[18], landmarks[20])
    ];
  }

  /* ─────── Gesture state machine ─────── */

  gestureLabel(g) {
    const m = {
      [Gesture.CONVERGE]: '\uD83E\uDD1D'
    };
    return m[g] || '?';
  }

  updateGesture(gesture) {
    if (gesture === this.currentGesture) return;
    this.currentGesture = gesture;
    if (gesture === Gesture.NONE || !this.onGestureChange) return;

    const el = document.getElementById('gestureIcon');
    if (el) el.textContent = this.gestureLabel(gesture);
    this.onGestureChange(gesture);
  }
}
