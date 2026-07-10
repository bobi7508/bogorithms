// Sweep Line — find the maximum number of intervals overlapping at any
// single point, by sweeping through sorted start/end events.

function sweepLineSteps(intervals) {
  const events = [];
  intervals.forEach(([s, e], idx) => {
    events.push({ pos: s, type: 1, idx });
    events.push({ pos: e, type: -1, idx });
  });
  events.sort((a, b) => (a.pos !== b.pos ? a.pos - b.pos : a.type - b.type));

  const steps = [];
  let active = 0, max = 0, maxPos = null;
  steps.push({ pos: null, active, max, activeSet: new Set(), phase: 'init', message: `Sort ${events.length} events (start/end of each interval) by position.` });
  const activeSet = new Set();
  for (const ev of events) {
    if (ev.type === 1) {
      activeSet.add(ev.idx);
      active++;
      const isNewMax = active > max;
      if (isNewMax) { max = active; maxPos = ev.pos; }
      steps.push({ pos: ev.pos, active, max, activeSet: new Set(activeSet), phase: isNewMax ? 'newMax' : 'start', message: `x = ${ev.pos}: interval #${ev.idx} starts → active = ${active}${isNewMax ? ' (new max!)' : ''}.` });
    } else {
      activeSet.delete(ev.idx);
      active--;
      steps.push({ pos: ev.pos, active, max, activeSet: new Set(activeSet), phase: 'end', message: `x = ${ev.pos}: interval #${ev.idx} ends → active = ${active}.` });
    }
  }
  steps.push({ pos: maxPos, active, max, activeSet: new Set(), phase: 'done', message: `Done — maximum overlap is ${max}, reached at x = ${maxPos}.` });
  return steps;
}

function renderSweepLine(ctx, width, height, step, intervals) {
  ctx.clearRect(0, 0, width, height);
  const minX = Math.min(...intervals.map((i) => i[0]));
  const maxX = Math.max(...intervals.map((i) => i[1]));
  const padL = 30, padR = 20;
  const scaleX = (x) => padL + ((x - minX) / (maxX - minX)) * (width - padL - padR);

  const rowH = 22, rowGap = 8, topY = 20;
  intervals.forEach(([s, e], i) => {
    const y = topY + i * (rowH + rowGap);
    const active = step.activeSet && step.activeSet.has(i);
    ctx.fillStyle = active ? VIZ_COLORS.compare : VIZ_COLORS.bar;
    ctx.fillRect(scaleX(s), y, scaleX(e) - scaleX(s), rowH);
    ctx.fillStyle = VIZ_COLORS.muted;
    ctx.font = '10px Space Mono, monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`#${i} [${s},${e}]`, 2, y + rowH / 2 + 3);
  });

  if (step.pos !== null && step.pos !== undefined) {
    const x = scaleX(step.pos);
    ctx.strokeStyle = VIZ_COLORS.accent || '#c6ff4a';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, topY - 8);
    ctx.lineTo(x, topY + intervals.length * (rowH + rowGap));
    ctx.stroke();
  }

  ctx.fillStyle = VIZ_COLORS.accent || '#c6ff4a';
  ctx.font = 'bold 12px Space Mono, monospace';
  ctx.textAlign = 'right';
  ctx.fillText(`active=${step.active}  max=${step.max}`, width - 4, height - 26);

  ctx.fillStyle = VIZ_COLORS.muted;
  ctx.font = '12px Poppins, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(step.message || '', 4, height - 10);
}

function setupSweepLineVisual(container) {
  const width = Math.min(container.clientWidth || 640, 640);
  const n = 6;
  const height = 20 + n * 30 + 40;
  const canvas = document.createElement('canvas');
  container.appendChild(canvas);
  const ctx = fitCanvas(canvas, width, height);

  const intervals = [];
  for (let i = 0; i < n; i++) {
    const s = Math.floor(Math.random() * 16);
    const e = s + Math.floor(Math.random() * 8) + 2;
    intervals.push([s, e]);
  }

  const steps = sweepLineSteps(intervals);
  return {
    steps,
    render: (step) => renderSweepLine(ctx, width, height, step, intervals),
    context: `Find the maximum number of overlapping intervals among n = ${n}: ${intervals.map((iv) => `[${iv[0]},${iv[1]}]`).join(', ')}.`,
  };
}
