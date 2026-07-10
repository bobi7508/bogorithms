// Permutations via backtracking — build a partial arrangement, undo on completion.

function permutationSteps(arr) {
  const n = arr.length;
  const used = Array(n).fill(false);
  const current = [];
  const steps = [];
  const results = [];

  function snap(tryIdx, status, message) {
    steps.push({ current: current.slice(), used: used.slice(), tryIdx, status, message, phase: status, foundCount: results.length });
  }

  function backtrack() {
    if (current.length === n) {
      results.push(current.slice());
      snap(null, 'complete', `Found permutation #${results.length}: [${current.join(', ')}].`);
      return;
    }
    for (let i = 0; i < n; i++) {
      snap(i, 'try', `Try placing arr[${i}] = ${arr[i]} at position ${current.length}.`);
      if (used[i]) {
        snap(i, 'conflict', `${arr[i]} is already used → skip.`);
        continue;
      }
      used[i] = true;
      current.push(arr[i]);
      snap(i, 'place', `Place ${arr[i]} at position ${current.length - 1}.`);
      backtrack();
      used[i] = false;
      current.pop();
      snap(i, 'backtrack', `Backtrack — remove ${arr[i]} from position ${current.length}.`);
    }
  }
  backtrack();
  snap(null, 'done', `Done — found all ${results.length} permutations.`);
  return steps;
}

function renderPermutation(ctx, width, height, step, arr) {
  ctx.clearRect(0, 0, width, height);
  const n = arr.length;
  const slotW = 56, slotH = 56, gap = 12;
  const slotsTotalW = n * slotW + (n - 1) * gap;
  const startX = width / 2 - slotsTotalW / 2;
  const slotY = 30;

  for (let i = 0; i < n; i++) {
    const x = startX + i * (slotW + gap);
    const val = step.current[i];
    const active = step.status !== 'done' && step.current.length === i && (step.status === 'try' || step.status === 'conflict');
    drawBox(ctx, x, slotY, slotW, slotH, val !== undefined ? val : '', active);
  }

  const poolY = slotY + slotH + 46;
  ctx.fillStyle = VIZ_COLORS.muted;
  ctx.font = '11px Poppins, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('Source values (used shown dim):', 4, poolY - 14);
  const poolW = 40, poolGap = 8;
  const poolTotalW = n * poolW + (n - 1) * poolGap;
  const poolStartX = width / 2 - poolTotalW / 2;
  for (let i = 0; i < n; i++) {
    const x = poolStartX + i * (poolW + poolGap);
    const isTryIdx = step.tryIdx === i;
    ctx.globalAlpha = step.used[i] ? 0.35 : 1;
    drawBox(ctx, x, poolY, poolW, 34, arr[i], isTryIdx && step.status !== 'done');
    ctx.globalAlpha = 1;
  }

  ctx.fillStyle = VIZ_COLORS.muted;
  ctx.font = '12px Poppins, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(step.message || '', 4, height - 10);
  ctx.fillStyle = VIZ_COLORS.accent || '#c6ff4a';
  ctx.font = 'bold 12px Space Mono, monospace';
  ctx.textAlign = 'right';
  ctx.fillText(`found: ${step.foundCount}`, width - 4, height - 10);
}

function setupPermutationsVisual(container) {
  const width = Math.min(container.clientWidth || 640, 640);
  const height = 220;
  const canvas = document.createElement('canvas');
  container.appendChild(canvas);
  const ctx = fitCanvas(canvas, width, height);

  const arr = [1, 2, 3];
  const steps = permutationSteps(arr);
  return {
    steps,
    render: (step) => renderPermutation(ctx, width, height, step, arr),
    context: `Generate all permutations of [${arr.join(', ')}] using backtracking.`,
  };
}
