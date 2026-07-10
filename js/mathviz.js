// Math visualizers: Binary Exponentiation (fast power) and Subset
// Enumeration via bitmask. Both render as small growing DOM tables.

function binPowSteps(base, exp) {
  const steps = [];
  let b = base, e = exp, result = 1;
  steps.push({ base: b, exp: e, result, phase: 'init', message: `Initialize result = 1, base = ${b}, exp = ${e}.` });
  while (e > 0) {
    if (e & 1) {
      result *= b;
      steps.push({ base: b, exp: e, result, phase: 'multiply', message: `exp = ${e} is odd → result *= base → result = ${result}.` });
    } else {
      steps.push({ base: b, exp: e, result, phase: 'skip', message: `exp = ${e} is even → skip the multiply.` });
    }
    b = b * b;
    e = Math.floor(e / 2);
    steps.push({ base: b, exp: e, result, phase: 'square', message: `Square base → ${b}, halve exp → ${e}.` });
  }
  steps.push({ base: b, exp: e, result, phase: 'done', message: `Done — result = ${result}.` });
  return steps;
}

function setupBinPowVisual(container) {
  const wrap = document.createElement('div');
  wrap.style.width = '100%';
  wrap.style.padding = '20px 0';
  container.appendChild(wrap);

  const row = document.createElement('div');
  row.style.display = 'flex';
  row.style.gap = '16px';
  row.style.justifyContent = 'center';
  wrap.appendChild(row);

  function statBox(label) {
    const box = document.createElement('div');
    box.style.background = 'var(--card)';
    box.style.border = '1px solid var(--card-border)';
    box.style.borderRadius = '12px';
    box.style.padding = '16px 24px';
    box.style.textAlign = 'center';
    box.style.minWidth = '100px';
    box.style.transition = 'background 0.2s ease, border-color 0.2s ease';
    const lbl = document.createElement('div');
    lbl.textContent = label;
    lbl.style.fontSize = '0.75rem';
    lbl.style.color = 'var(--muted)';
    lbl.style.marginBottom = '6px';
    const val = document.createElement('div');
    val.style.fontFamily = "'Space Mono', monospace";
    val.style.fontSize = '1.3rem';
    val.style.color = 'var(--cream)';
    box.appendChild(lbl);
    box.appendChild(val);
    row.appendChild(box);
    return { box, val };
  }

  const baseBox = statBox('base');
  const expBox = statBox('exp');
  const resultBox = statBox('result');

  const msgEl = document.createElement('p');
  msgEl.style.marginTop = '20px';
  msgEl.style.textAlign = 'center';
  msgEl.style.color = 'var(--muted)';
  msgEl.style.fontFamily = "'Poppins', sans-serif";
  msgEl.style.fontSize = '0.85rem';
  wrap.appendChild(msgEl);

  function resetHighlight() {
    [baseBox, expBox, resultBox].forEach(({ box }) => {
      box.style.background = 'var(--card)';
      box.style.borderColor = 'var(--card-border)';
    });
  }

  function highlight(box) {
    box.box.style.background = '#2a3a12';
    box.box.style.borderColor = 'var(--accent)';
  }

  function render(step) {
    baseBox.val.textContent = step.base;
    expBox.val.textContent = step.exp;
    resultBox.val.textContent = step.result;
    resetHighlight();
    if (step.phase === 'multiply') highlight(resultBox);
    else if (step.phase === 'square') { highlight(baseBox); highlight(expBox); }
    msgEl.textContent = step.message || '';
  }

  const base = Math.floor(Math.random() * 3) + 2;
  const exp = Math.floor(Math.random() * 5) + 6;
  const steps = binPowSteps(base, exp);
  return {
    steps,
    render,
    context: `Compute ${base}^${exp} using binary exponentiation (fast power).`,
  };
}

function subsetEnumSteps(set) {
  const n = set.length;
  const steps = [];
  for (let mask = 0; mask < (1 << n); mask++) {
    const included = [];
    for (let i = 0; i < n; i++) if (mask & (1 << i)) included.push(set[i]);
    steps.push({
      mask, bits: mask.toString(2).padStart(n, '0'), included, phase: 'enumerate',
      message: `mask = ${mask} (${mask.toString(2).padStart(n, '0')}) → subset {${included.join(', ')}}`,
    });
  }
  steps.push({ mask: null, bits: null, included: null, phase: 'done', message: `Done — enumerated all ${1 << n} subsets.` });
  return steps;
}

function setupSubsetEnumVisual(container) {
  const set = ['a', 'b', 'c'];
  const wrap = document.createElement('div');
  wrap.style.width = '100%';
  wrap.style.maxHeight = '280px';
  wrap.style.overflowY = 'auto';
  container.appendChild(wrap);

  const table = document.createElement('table');
  table.style.borderCollapse = 'collapse';
  table.style.margin = '0 auto';
  table.style.fontFamily = "'Space Mono', monospace";
  table.style.fontSize = '13px';
  wrap.appendChild(table);

  const headRow = document.createElement('tr');
  ['mask', 'binary', 'subset'].forEach((h) => headRow.appendChild(cellEl(h, true)));
  table.appendChild(headRow);

  const rows = [];
  const steps = subsetEnumSteps(set);
  const n = set.length;
  for (let mask = 0; mask < (1 << n); mask++) {
    const tr = document.createElement('tr');
    const cMask = cellEl('', false);
    const cBits = cellEl('', false);
    const cSub = cellEl('', false);
    tr.appendChild(cMask); tr.appendChild(cBits); tr.appendChild(cSub);
    table.appendChild(tr);
    rows.push({ cMask, cBits, cSub });
  }

  function render(step) {
    rows.forEach((r, idx) => {
      const shown = idx <= (step.mask ?? rows.length - 1);
      r.cMask.style.background = 'var(--card)'; r.cMask.style.color = 'var(--cream)';
      r.cBits.style.background = 'var(--card)'; r.cBits.style.color = 'var(--cream)';
      r.cSub.style.background = 'var(--card)'; r.cSub.style.color = 'var(--cream)';
      if (shown) {
        const included = [];
        for (let i = 0; i < n; i++) if (idx & (1 << i)) included.push(set[i]);
        r.cMask.textContent = idx;
        r.cBits.textContent = idx.toString(2).padStart(n, '0');
        r.cSub.textContent = `{${included.join(', ')}}`;
      } else {
        r.cMask.textContent = ''; r.cBits.textContent = ''; r.cSub.textContent = '';
      }
      if (step.mask === idx) {
        r.cMask.style.background = '#c6ff4a'; r.cMask.style.color = '#0d0d0f';
        r.cBits.style.background = '#c6ff4a'; r.cBits.style.color = '#0d0d0f';
        r.cSub.style.background = '#c6ff4a'; r.cSub.style.color = '#0d0d0f';
      }
    });
  }

  return {
    steps,
    render,
    context: `Enumerate all 2^${n} = ${1 << n} subsets of {${set.join(', ')}} using bitmasks.`,
  };
}
