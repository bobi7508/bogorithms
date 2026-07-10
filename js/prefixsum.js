// Prefix Sum and Difference Array — two related range-query/update tricks,
// sharing a two-row box renderer (source row + derived row).

function prefixSumSteps(arr, l, r) {
  const n = arr.length;
  const P = Array(n).fill(null);
  const steps = [];
  P[0] = arr[0];
  steps.push({ arr, prefix: P.slice(), i: 0, range: null, answer: null, phase: 'init', message: `P[0] = arr[0] = ${arr[0]}.` });
  for (let i = 1; i < n; i++) {
    P[i] = P[i - 1] + arr[i];
    steps.push({ arr, prefix: P.slice(), i, range: null, answer: null, phase: 'build', message: `P[${i}] = P[${i - 1}] + arr[${i}] = ${P[i - 1] - arr[i]} + ${arr[i]} = ${P[i]}.` });
  }
  const answer = l === 0 ? P[r] : P[r] - P[l - 1];
  const msg = l === 0
    ? `Query [${l}, ${r}]: answer = P[${r}] = ${answer}.`
    : `Query [${l}, ${r}]: answer = P[${r}] - P[${l - 1}] = ${P[r]} - ${P[l - 1]} = ${answer}.`;
  steps.push({ arr, prefix: P.slice(), i: null, range: [l, r], answer, phase: 'query', message: msg });
  return steps;
}

function diffArraySteps(n, l, r, val) {
  const diff = Array(n).fill(0);
  const steps = [];
  steps.push({ diff: diff.slice(), arr: null, touch: null, phase: 'init', message: `Start with a zero difference array of size n = ${n}.` });
  diff[l] += val;
  steps.push({ diff: diff.slice(), arr: null, touch: l, phase: 'applyLeft', message: `diff[${l}] += ${val} → marks "+${val} starts here".` });
  if (r + 1 < n) {
    diff[r + 1] -= val;
    steps.push({ diff: diff.slice(), arr: null, touch: r + 1, phase: 'applyRight', message: `diff[${r + 1}] -= ${val} → marks "+${val} stops here".` });
  }
  const arr = Array(n).fill(null);
  arr[0] = diff[0];
  steps.push({ diff: diff.slice(), arr: arr.slice(), touch: 0, phase: 'reconstructInit', message: `arr[0] = diff[0] = ${arr[0]}.` });
  for (let i = 1; i < n; i++) {
    arr[i] = arr[i - 1] + diff[i];
    steps.push({ diff: diff.slice(), arr: arr.slice(), touch: i, phase: 'reconstruct', message: `arr[${i}] = arr[${i - 1}] + diff[${i}] = ${arr[i - 1]} + ${diff[i]} = ${arr[i]}.` });
  }
  return steps;
}

function renderTwoRowBoxes(ctx, width, height, topRow, bottomRow, opts) {
  ctx.clearRect(0, 0, width, height);
  const n = topRow.length;
  const gap = 6;
  const boxW = (width - gap * (n - 1)) / n;
  const boxH = 40;
  const topY = 40;
  const bottomY = 130;

  ctx.fillStyle = VIZ_COLORS.muted;
  ctx.font = '11px Poppins, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(opts.topLabel, 4, topY - 12);
  ctx.fillText(opts.bottomLabel, 4, bottomY - 12);

  for (let i = 0; i < n; i++) {
    const x = i * (boxW + gap);
    const inRange = opts.range && i >= opts.range[0] && i <= opts.range[1];
    const isActiveTop = opts.activeTop === i;
    drawBox(ctx, x, topY, boxW, boxH, topRow[i] === null ? '' : topRow[i], isActiveTop || inRange);
    const isActiveBottom = opts.activeBottom === i;
    drawBox(ctx, x, bottomY, boxW, boxH, bottomRow[i] === null ? '' : bottomRow[i], isActiveBottom);
    ctx.fillStyle = VIZ_COLORS.muted;
    ctx.font = '10px Space Mono, monospace';
    ctx.textAlign = 'center';
    ctx.fillText(i, x + boxW / 2, bottomY + boxH + 14);
  }

  ctx.fillStyle = VIZ_COLORS.muted;
  ctx.font = '12px Poppins, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(opts.message || '', 4, height - 8);
  if (opts.answerText) {
    ctx.fillStyle = VIZ_COLORS.accent || '#c6ff4a';
    ctx.font = 'bold 12px Space Mono, monospace';
    ctx.textAlign = 'right';
    ctx.fillText(opts.answerText, width - 4, height - 8);
  }
}

function setupPrefixSumVisual(container) {
  const width = Math.min(container.clientWidth || 640, 640);
  const height = 210;
  const canvas = document.createElement('canvas');
  container.appendChild(canvas);
  const ctx = fitCanvas(canvas, width, height);

  const n = 10;
  const arr = makeRandomArray(n, 1, 20);
  let l = Math.floor(Math.random() * n);
  let r = Math.floor(Math.random() * n);
  if (l > r) [l, r] = [r, l];

  const steps = prefixSumSteps(arr, l, r);
  return {
    steps,
    render: (step) => renderTwoRowBoxes(ctx, width, height, step.arr, step.prefix, {
      topLabel: 'arr[i]', bottomLabel: 'P[i] (prefix sum)',
      activeTop: step.range ? null : step.i, activeBottom: step.i,
      range: step.range, message: step.message,
      answerText: step.answer !== null ? `answer = ${step.answer}` : '',
    }),
    context: `Build a prefix-sum array for n = ${n} elements, then answer the range-sum query [${l}, ${r}]: [${arr.join(', ')}].`,
  };
}

function setupDiffArrayVisual(container) {
  const width = Math.min(container.clientWidth || 640, 640);
  const height = 210;
  const canvas = document.createElement('canvas');
  container.appendChild(canvas);
  const ctx = fitCanvas(canvas, width, height);

  const n = 8;
  let l = Math.floor(Math.random() * n);
  let r = Math.floor(Math.random() * n);
  if (l > r) [l, r] = [r, l];
  const val = Math.floor(Math.random() * 8) + 2;

  const steps = diffArraySteps(n, l, r, val);
  return {
    steps,
    render: (step) => renderTwoRowBoxes(ctx, width, height, step.diff, step.arr || Array(n).fill(null), {
      topLabel: 'diff[i]', bottomLabel: 'arr[i] (reconstructed)',
      activeTop: step.phase === 'applyLeft' || step.phase === 'applyRight' ? step.touch : null,
      activeBottom: step.arr ? step.touch : null,
      range: null, message: step.message,
      answerText: '',
    }),
    context: `Apply range update "+${val} to indices [${l}, ${r}]" on an array of n = ${n}, using a difference array.`,
  };
}
