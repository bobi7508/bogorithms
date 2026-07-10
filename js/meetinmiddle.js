// Meet in the Middle — split into two halves, enumerate subset sums of
// each, then check every left-sum against a sorted right-sum list.

function subsetSums(arr) {
  const n = arr.length;
  const out = [];
  for (let mask = 0; mask < (1 << n); mask++) {
    let sum = 0;
    const chosen = [];
    for (let i = 0; i < n; i++) {
      if (mask & (1 << i)) { sum += arr[i]; chosen.push(arr[i]); }
    }
    out.push({ mask, sum, chosen });
  }
  return out;
}

function meetInMiddleSteps(arr, target) {
  const half = Math.floor(arr.length / 2);
  const left = arr.slice(0, half);
  const right = arr.slice(half);
  const steps = [];

  const sumsL = subsetSums(left);
  sumsL.forEach((e) => steps.push({ stage: 'buildLeft', sumsL: sumsL.slice(0, sumsL.indexOf(e) + 1), sumsR: [], current: e, phase: 'buildLeft', message: `Left subset {${e.chosen.join(', ')}} → sum = ${e.sum}.` }));

  const sumsR = subsetSums(right).sort((a, b) => a.sum - b.sum);
  sumsR.forEach((e, i) => steps.push({ stage: 'buildRight', sumsL, sumsR: sumsR.slice(0, i + 1), current: e, phase: 'buildRight', message: `Right subset {${e.chosen.join(', ')}} → sum = ${e.sum}.` }));

  const rightSumsArr = sumsR.map((e) => e.sum);
  for (const e of sumsL) {
    const need = target - e.sum;
    const idx = rightSumsArr.indexOf(need);
    if (idx >= 0) {
      steps.push({ stage: 'search', sumsL, sumsR, current: e, matchIdx: idx, phase: 'found', message: `Left sum ${e.sum} needs ${need} from the right → found at sum ${sumsR[idx].sum}! Total = ${target}.` });
      return steps;
    }
    steps.push({ stage: 'search', sumsL, sumsR, current: e, matchIdx: -1, phase: 'search', message: `Left sum ${e.sum} needs ${need} from the right → binary search finds no match.` });
  }
  steps.push({ stage: 'search', sumsL, sumsR, current: null, matchIdx: -1, phase: 'notFound', message: 'No combination reaches the target.' });
  return steps;
}

function setupMeetInMiddleVisual(container) {
  const wrap = document.createElement('div');
  wrap.style.width = '100%';
  container.appendChild(wrap);

  const cols = document.createElement('div');
  cols.style.display = 'flex';
  cols.style.gap = '20px';
  cols.style.justifyContent = 'center';
  wrap.appendChild(cols);

  function makeCol(title) {
    const col = document.createElement('div');
    const h = document.createElement('div');
    h.textContent = title;
    h.style.fontSize = '0.75rem';
    h.style.color = 'var(--muted)';
    h.style.marginBottom = '8px';
    h.style.textAlign = 'center';
    const list = document.createElement('div');
    list.style.fontFamily = "'Space Mono', monospace";
    list.style.fontSize = '12px';
    list.style.minHeight = '180px';
    list.style.maxHeight = '220px';
    list.style.overflowY = 'auto';
    col.appendChild(h);
    col.appendChild(list);
    cols.appendChild(col);
    return list;
  }

  const listL = makeCol('Left sums');
  const listR = makeCol('Right sums (sorted)');

  const msgEl = document.createElement('p');
  msgEl.style.marginTop = '16px';
  msgEl.style.textAlign = 'center';
  msgEl.style.color = 'var(--muted)';
  msgEl.style.fontFamily = "'Poppins', sans-serif";
  msgEl.style.fontSize = '0.85rem';
  wrap.appendChild(msgEl);

  function rowHtml(e, active, matched) {
    const bg = matched ? '#c6ff4a' : (active ? '#2a3a12' : 'transparent');
    const color = matched ? '#0d0d0f' : 'var(--cream)';
    return `<div style="padding:3px 8px;background:${bg};color:${color};border-radius:4px;">{${e.chosen.join(',') || '-'}} = ${e.sum}</div>`;
  }

  function render(step) {
    listL.innerHTML = step.sumsL.map((e) => rowHtml(e, step.current === e, false)).join('');
    listR.innerHTML = step.sumsR.map((e, i) => rowHtml(e, false, step.matchIdx === i)).join('');
    msgEl.textContent = step.message || '';
  }

  const n = 6;
  const arr = makeRandomArray(n, 1, 15);
  const i = Math.floor(Math.random() * n);
  let j = Math.floor(Math.random() * n);
  while (j === i) j = Math.floor(Math.random() * n);
  const target = arr[i] + arr[j];

  const steps = meetInMiddleSteps(arr, target);
  return {
    steps,
    render,
    context: `Decide if a subset of [${arr.join(', ')}] (n = ${n}) sums to target = ${target}, by splitting into two halves and meeting in the middle.`,
  };
}
