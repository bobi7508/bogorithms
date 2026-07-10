// Step generators + renderer for Linear Search and Binary Search.

function linearSearchSteps(arr, target) {
  const steps = [];
  for (let i = 0; i < arr.length; i++) {
    steps.push({ array: arr, current: i, found: -1, range: [0, arr.length - 1], phase: 'check' });
    if (arr[i] === target) {
      steps.push({ array: arr, current: i, found: i, range: [0, arr.length - 1], phase: 'found' });
      return steps;
    }
  }
  steps.push({ array: arr, current: -1, found: -1, range: [0, arr.length - 1], phase: 'notFound' });
  return steps;
}

function binarySearchSteps(arr, target) {
  const steps = [];
  let lo = 0, hi = arr.length - 1;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    steps.push({ array: arr, current: mid, found: -1, range: [lo, hi], phase: 'computeMid' });
    if (arr[mid] === target) {
      steps.push({ array: arr, current: mid, found: mid, range: [lo, hi], phase: 'found' });
      return steps;
    } else if (arr[mid] < target) {
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }
  steps.push({ array: arr, current: -1, found: -1, range: [lo, hi], phase: 'notFound' });
  return steps;
}

function renderSearchStep(ctx, width, height, step) {
  ctx.clearRect(0, 0, width, height);
  const { array, current, found, range } = step;
  const n = array.length;
  const gap = 8;
  const boxW = (width - gap * (n - 1)) / n;
  const boxH = 56;
  const y = height / 2 - boxH / 2;

  for (let i = 0; i < n; i++) {
    const x = i * (boxW + gap);
    let fill = VIZ_COLORS.node;
    let border = VIZ_COLORS.nodeBorder;
    if (range && i >= range[0] && i <= range[1]) border = '#55555c';
    if (i === current) { fill = VIZ_COLORS.compare; }
    if (i === found) { fill = VIZ_COLORS.barSorted; }

    ctx.fillStyle = fill;
    ctx.strokeStyle = border;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(x, y, boxW, boxH, 8) : ctx.rect(x, y, boxW, boxH);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = (i === current || i === found) ? VIZ_COLORS.bg : VIZ_COLORS.text;
    ctx.font = 'bold 14px Space Mono, monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(array[i], x + boxW / 2, y + boxH / 2);

    ctx.fillStyle = VIZ_COLORS.muted;
    ctx.font = '10px Space Mono, monospace';
    ctx.fillText(i, x + boxW / 2, y + boxH + 16);
  }

  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = VIZ_COLORS.muted;
  ctx.font = '12px Poppins, sans-serif';
  ctx.textAlign = 'left';
  const msg = found >= 0 ? `Found at index ${found}!` : (current === -1 ? 'Value not found.' : `Checking index ${current}...`);
  ctx.fillText(msg, 4, y - 16);
}

function setupSearchVisual(container, algoId) {
  const width = Math.min(container.clientWidth || 640, 640);
  const height = 200;
  const canvas = document.createElement('canvas');
  container.appendChild(canvas);
  const ctx = fitCanvas(canvas, width, height);

  const size = 12;
  let data, target, steps;
  // Picking a fully random target can make the search resolve in a single
  // check (e.g. it happens to be the very first middle element) — retry a
  // few times so the animation always shows several real steps.
  if (algoId === 'binary') {
    data = makeRandomArray(size, 5, 95).sort((a, b) => a - b);
    let attempts = 0;
    do {
      target = data[Math.floor(Math.random() * size)];
      steps = binarySearchSteps(data, target);
      attempts++;
    } while (steps.length < 4 && attempts < 30);
  } else {
    data = makeRandomArray(size, 5, 95);
    let attempts = 0;
    do {
      target = data[Math.floor(Math.random() * size)];
      steps = linearSearchSteps(data, target);
      attempts++;
    } while (steps.length < 5 && attempts < 30);
  }

  const arrayDesc = algoId === 'binary' ? 'a sorted array' : 'an array';
  return {
    steps,
    render: (step) => renderSearchStep(ctx, width, height, step),
    context: `Search for target = ${target} in ${arrayDesc} of n = ${size} elements: [${data.join(', ')}].`,
  };
}
