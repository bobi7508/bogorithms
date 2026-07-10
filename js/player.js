// Shared step-playback engine used by every algorithm visualizer.
// A "steps" array holds pre-computed snapshots; the player walks through
// them on an interval and calls render(step, index, total) each time.

class StepPlayer {
  constructor({ steps, render, onProgress, speedToMs }) {
    this.steps = steps;
    this.render = render;
    this.onProgress = onProgress || function () {};
    this.speedToMs = speedToMs || ((v) => 2300 - v * 300);
    this.index = 0;
    this.timer = null;
    this.playing = false;
    this.speed = 5;
  }

  goto(i) {
    this.index = Math.max(0, Math.min(i, this.steps.length - 1));
    this.render(this.steps[this.index], this.index, this.steps.length);
    this.onProgress(this.index, this.steps.length);
  }

  step() {
    if (this.index >= this.steps.length - 1) {
      this.pause();
      return;
    }
    this.goto(this.index + 1);
  }

  play() {
    if (this.playing) return;
    if (this.index >= this.steps.length - 1) this.goto(0);
    this.playing = true;
    this.tick();
  }

  tick() {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      if (!this.playing) return;
      if (this.index >= this.steps.length - 1) {
        this.pause();
        return;
      }
      this.goto(this.index + 1);
      this.tick();
    }, this.speedToMs(this.speed));
  }

  pause() {
    this.playing = false;
    clearTimeout(this.timer);
  }

  toggle() {
    if (this.playing) this.pause();
    else this.play();
    return this.playing;
  }

  reset() {
    this.pause();
    this.goto(0);
  }

  setSpeed(v) {
    this.speed = Number(v);
    if (this.playing) this.tick();
  }

  destroy() {
    this.pause();
  }
}

// ---- small drawing helpers shared across visualizers ----
function fitCanvas(canvas, width, height) {
  const ratio = window.devicePixelRatio || 1;
  canvas.width = width * ratio;
  canvas.height = height * ratio;
  canvas.style.width = width + 'px';
  canvas.style.height = height + 'px';
  const ctx = canvas.getContext('2d');
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  return ctx;
}

const VIZ_COLORS = {
  bg: '#0d0d0f',
  bar: '#3a3a40',
  barSorted: '#c6ff4a',
  compare: '#ffd23f',
  active: '#ff6b6b',
  text: '#f5f4ef',
  muted: '#6b6b70',
  edge: '#3a3a40',
  node: '#1c1c1f',
  nodeBorder: '#3a3a40',
};
