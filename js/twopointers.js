// Two Pointers — find a pair in a sorted array summing to a target.

function twoPointerSteps(arr, target) {
  const steps = [];
  let lo = 0, hi = arr.length - 1;
  while (lo < hi) {
    const sum = arr[lo] + arr[hi];
    steps.push({ array: arr, lo, hi, sum, found: false, phase: 'compare', message: `arr[${lo}] + arr[${hi}] = ${arr[lo]} + ${arr[hi]} = ${sum}` });
    if (sum === target) {
      steps.push({ array: arr, lo, hi, sum, found: true, phase: 'found', message: `${sum} = target → found pair (${lo}, ${hi})!` });
      return steps;
    } else if (sum < target) {
      steps.push({ array: arr, lo, hi, sum, found: false, phase: 'moveLo', message: `${sum} < target → move lo right to grow the sum.` });
      lo++;
    } else {
      steps.push({ array: arr, lo, hi, sum, found: false, phase: 'moveHi', message: `${sum} > target → move hi left to shrink the sum.` });
      hi--;
    }
  }
  steps.push({ array: arr, lo, hi, sum: null, found: false, phase: 'notFound', message: 'No pair found.' });
  return steps;
}

function renderTwoPointers(ctx, width, height, step) {
  ctx.clearRect(0, 0, width, height);
  const { array, lo, hi, sum, found } = step;
  const n = array.length;
  const gap = 8;
  const boxW = (width - gap * (n - 1)) / n;
  const boxH = 56;
  const y = height / 2 - boxH / 2;

  for (let i = 0; i < n; i++) {
    const x = i * (boxW + gap);
    let fill = VIZ_COLORS.node;
    if (found && (i === lo || i === hi)) fill = VIZ_COLORS.barSorted;
    else if (i === lo || i === hi) fill = VIZ_COLORS.compare;
    ctx.fillStyle = fill;
    ctx.strokeStyle = VIZ_COLORS.nodeBorder;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(x, y, boxW, boxH, 8) : ctx.rect(x, y, boxW, boxH);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = (i === lo || i === hi) ? VIZ_COLORS.bg : VIZ_COLORS.text;
    ctx.font = 'bold 14px Space Mono, monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(array[i], x + boxW / 2, y + boxH / 2);
    ctx.textBaseline = 'alphabetic';

    ctx.fillStyle = VIZ_COLORS.muted;
    ctx.font = '10px Space Mono, monospace';
    let label = String(i);
    if (i === lo && i === hi) label = 'lo,hi';
    else if (i === lo) label = 'lo';
    else if (i === hi) label = 'hi';
    ctx.fillText(label, x + boxW / 2, y + boxH + 16);
  }

  ctx.fillStyle = VIZ_COLORS.muted;
  ctx.font = '12px Poppins, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(step.message || '', 4, y - 16);
  if (sum !== null && sum !== undefined) {
    ctx.fillStyle = VIZ_COLORS.accent || '#c6ff4a';
    ctx.font = 'bold 12px Space Mono, monospace';
    ctx.fillText(`sum = ${sum}`, 4, y - 34);
  }
}

function setupTwoPointersVisual(container) {
  const width = Math.min(container.clientWidth || 640, 640);
  const height = 220;
  const canvas = document.createElement('canvas');
  container.appendChild(canvas);
  const ctx = fitCanvas(canvas, width, height);

  const n = 10;
  const arr = makeRandomArray(n, 3, 40).sort((a, b) => a - b);
  // Retry a few times so the target pair isn't the array's two extremes
  // (which would let the pointers match on the very first comparison).
  let target, steps, attempts = 0;
  do {
    const i = Math.floor(Math.random() * n);
    let j = Math.floor(Math.random() * n);
    while (j === i) j = Math.floor(Math.random() * n);
    target = arr[i] + arr[j];
    steps = twoPointerSteps(arr, target);
    attempts++;
  } while (steps.length < 5 && attempts < 30);
  return {
    steps,
    render: (step) => renderTwoPointers(ctx, width, height, step),
    context: `Find two indices in a sorted array of n = ${n} whose values sum to target = ${target}: [${arr.join(', ')}].`,
  };
}
