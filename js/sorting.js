// Step generators for sorting algorithms. Each returns an array of steps:
// { array, compare: [i,j]|[], swap: [i,j]|[], sorted: Set of finished indices }

function makeRandomArray(n = 18, min = 8, max = 100) {
  const arr = [];
  for (let i = 0; i < n; i++) arr.push(Math.floor(Math.random() * (max - min + 1)) + min);
  return arr;
}

function cloneStep(array, compare, swap, sorted, phase) {
  return { array: array.slice(), compare: compare || [], swap: swap || [], sorted: new Set(sorted), phase: phase || 'init' };
}

function bubbleSortSteps(input) {
  const arr = input.slice();
  const steps = [];
  const sorted = new Set();
  const n = arr.length;
  steps.push(cloneStep(arr, [], [], sorted, 'init'));
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - 1 - i; j++) {
      steps.push(cloneStep(arr, [j, j + 1], [], sorted, 'compare'));
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        steps.push(cloneStep(arr, [], [j, j + 1], sorted, 'swap'));
      }
    }
    sorted.add(n - 1 - i);
    steps.push(cloneStep(arr, [], [], sorted, 'markSorted'));
  }
  for (let k = 0; k < n; k++) sorted.add(k);
  steps.push(cloneStep(arr, [], [], sorted, 'done'));
  return steps;
}

function selectionSortSteps(input) {
  const arr = input.slice();
  const steps = [];
  const sorted = new Set();
  const n = arr.length;
  steps.push(cloneStep(arr, [], [], sorted, 'init'));
  for (let i = 0; i < n - 1; i++) {
    let min = i;
    for (let j = i + 1; j < n; j++) {
      steps.push(cloneStep(arr, [min, j], [], sorted, 'compareMin'));
      if (arr[j] < arr[min]) min = j;
    }
    if (min !== i) {
      [arr[i], arr[min]] = [arr[min], arr[i]];
      steps.push(cloneStep(arr, [], [i, min], sorted, 'swapMin'));
    }
    sorted.add(i);
    steps.push(cloneStep(arr, [], [], sorted, 'markSorted'));
  }
  for (let k = 0; k < n; k++) sorted.add(k);
  steps.push(cloneStep(arr, [], [], sorted, 'done'));
  return steps;
}

function insertionSortSteps(input) {
  const arr = input.slice();
  const steps = [];
  const sorted = new Set([0]);
  const n = arr.length;
  steps.push(cloneStep(arr, [], [], sorted, 'init'));
  for (let i = 1; i < n; i++) {
    let j = i;
    while (j > 0 && arr[j - 1] > arr[j]) {
      steps.push(cloneStep(arr, [j - 1, j], [], sorted, 'compare'));
      [arr[j - 1], arr[j]] = [arr[j], arr[j - 1]];
      steps.push(cloneStep(arr, [], [j - 1, j], sorted, 'swap'));
      j--;
    }
    for (let k = 0; k <= i; k++) sorted.add(k);
    steps.push(cloneStep(arr, [], [], sorted, 'markSorted'));
  }
  return steps;
}

function mergeSortSteps(input) {
  const arr = input.slice();
  const steps = [];
  steps.push(cloneStep(arr, [], [], new Set(), 'init'));

  function merge(lo, mid, hi) {
    const left = arr.slice(lo, mid + 1);
    const right = arr.slice(mid + 1, hi + 1);
    let i = 0, j = 0, k = lo;
    while (i < left.length && j < right.length) {
      steps.push(cloneStep(arr, [lo + i, mid + 1 + j], [], new Set(), 'compare'));
      if (left[i] <= right[j]) { arr[k] = left[i]; i++; steps.push(cloneStep(arr, [], [k], new Set(), 'placeLeft')); }
      else { arr[k] = right[j]; j++; steps.push(cloneStep(arr, [], [k], new Set(), 'placeRight')); }
      k++;
    }
    while (i < left.length) { arr[k] = left[i]; steps.push(cloneStep(arr, [], [k], new Set(), 'placeRemainderLeft')); i++; k++; }
    while (j < right.length) { arr[k] = right[j]; steps.push(cloneStep(arr, [], [k], new Set(), 'placeRemainderRight')); j++; k++; }
  }
  function sort(lo, hi) {
    if (lo >= hi) return;
    const mid = Math.floor((lo + hi) / 2);
    sort(lo, mid);
    sort(mid + 1, hi);
    merge(lo, mid, hi);
  }
  sort(0, arr.length - 1);
  const full = new Set(arr.map((_, i) => i));
  steps.push(cloneStep(arr, [], [], full, 'done'));
  return steps;
}

function quickSortSteps(input) {
  const arr = input.slice();
  const steps = [];
  const sorted = new Set();
  steps.push(cloneStep(arr, [], [], sorted, 'init'));

  function partition(lo, hi) {
    const pivot = arr[hi];
    let i = lo;
    for (let j = lo; j < hi; j++) {
      steps.push(cloneStep(arr, [j, hi], [], sorted, 'comparePivot'));
      if (arr[j] < pivot) {
        [arr[i], arr[j]] = [arr[j], arr[i]];
        steps.push(cloneStep(arr, [], [i, j], sorted, 'swapPartition'));
        i++;
      }
    }
    [arr[i], arr[hi]] = [arr[hi], arr[i]];
    steps.push(cloneStep(arr, [], [i, hi], sorted, 'placePivot'));
    sorted.add(i);
    steps.push(cloneStep(arr, [], [], sorted, 'markSorted'));
    return i;
  }
  function sort(lo, hi) {
    if (lo > hi) return;
    if (lo === hi) { sorted.add(lo); steps.push(cloneStep(arr, [], [], sorted, 'markSorted')); return; }
    const p = partition(lo, hi);
    sort(lo, p - 1);
    sort(p + 1, hi);
  }
  sort(0, arr.length - 1);
  for (let k = 0; k < arr.length; k++) sorted.add(k);
  steps.push(cloneStep(arr, [], [], sorted, 'done'));
  return steps;
}

function renderSortStep(ctx, width, height, step) {
  ctx.clearRect(0, 0, width, height);
  const { array, compare, swap, sorted } = step;
  const n = array.length;
  const gap = 6;
  const barW = (width - gap * (n - 1)) / n;
  const max = Math.max(...array, 1);
  for (let i = 0; i < n; i++) {
    const h = (array[i] / max) * (height - 30);
    const x = i * (barW + gap);
    const y = height - h;
    let color = VIZ_COLORS.bar;
    if (sorted && sorted.has(i)) color = VIZ_COLORS.barSorted;
    if (compare && compare.includes(i)) color = VIZ_COLORS.compare;
    if (swap && swap.includes(i)) color = VIZ_COLORS.active;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(x, y, barW, h, 4) : ctx.rect(x, y, barW, h);
    ctx.fill();
    ctx.fillStyle = VIZ_COLORS.muted;
    ctx.font = '10px Space Mono, monospace';
    ctx.textAlign = 'center';
    ctx.fillText(array[i], x + barW / 2, height - h - 6 < 10 ? 12 : height - h - 6);
  }
}

function setupSortVisual(container, algoId) {
  const width = Math.min(container.clientWidth || 640, 640);
  const height = 280;
  const canvas = document.createElement('canvas');
  container.appendChild(canvas);
  const ctx = fitCanvas(canvas, width, height);

  const data = makeRandomArray(16);
  const gens = {
    bubble: bubbleSortSteps,
    selection: selectionSortSteps,
    insertion: insertionSortSteps,
    merge: mergeSortSteps,
    quick: quickSortSteps,
  };
  const steps = gens[algoId](data);

  return {
    steps,
    render: (step) => renderSortStep(ctx, width, height, step),
    context: `Sort an array of n = ${data.length} unsorted integers: [${data.join(', ')}].`,
  };
}
