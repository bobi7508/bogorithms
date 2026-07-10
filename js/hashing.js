// Hash Set (separate chaining) — insert values by h(x) = x % m, then look
// one up by scanning its bucket's chain.

function hashSetSteps(m, values, lookupValue) {
  const buckets = Array.from({ length: m }, () => []);
  const steps = [];
  steps.push({ buckets: buckets.map((b) => b.slice()), activeBucket: null, activeIdx: null, found: null, phase: 'init', message: `Create a hash table with m = ${m} buckets.` });
  for (const v of values) {
    const h = v % m;
    buckets[h].push(v);
    steps.push({ buckets: buckets.map((b) => b.slice()), activeBucket: h, activeIdx: buckets[h].length - 1, found: null, phase: 'insert', message: `insert(${v}): h(${v}) = ${v} % ${m} = ${h} → append to bucket ${h}.` });
  }
  const h = lookupValue % m;
  steps.push({ buckets: buckets.map((b) => b.slice()), activeBucket: h, activeIdx: null, found: null, phase: 'lookupHash', message: `lookup(${lookupValue}): h(${lookupValue}) = ${lookupValue} % ${m} = ${h} → scan bucket ${h}.` });
  let found = false;
  for (let i = 0; i < buckets[h].length; i++) {
    if (buckets[h][i] === lookupValue) {
      steps.push({ buckets: buckets.map((b) => b.slice()), activeBucket: h, activeIdx: i, found: true, phase: 'compareFound', message: `bucket[${h}][${i}] = ${buckets[h][i]} — match!` });
      found = true;
      break;
    }
    steps.push({ buckets: buckets.map((b) => b.slice()), activeBucket: h, activeIdx: i, found: false, phase: 'compare', message: `bucket[${h}][${i}] = ${buckets[h][i]} ≠ ${lookupValue}, keep scanning.` });
  }
  if (!found) {
    steps.push({ buckets: buckets.map((b) => b.slice()), activeBucket: h, activeIdx: null, found: false, phase: 'notFound', message: `Reached the end of bucket ${h} — ${lookupValue} is not in the set.` });
  }
  return steps;
}

function setupHashSetVisual(container) {
  const wrap = document.createElement('div');
  wrap.style.width = '100%';
  container.appendChild(wrap);

  const table = document.createElement('table');
  table.style.borderCollapse = 'collapse';
  table.style.margin = '0 auto';
  table.style.fontFamily = "'Space Mono', monospace";
  table.style.fontSize = '13px';
  table.style.width = '100%';
  wrap.appendChild(table);

  const m = 7;
  const rows = [];
  for (let i = 0; i < m; i++) {
    const tr = document.createElement('tr');
    const idxCell = cellEl(i, true);
    idxCell.style.width = '40px';
    const chainCell = cellEl('', false);
    chainCell.style.textAlign = 'left';
    tr.appendChild(idxCell);
    tr.appendChild(chainCell);
    table.appendChild(tr);
    rows.push({ idxCell, chainCell });
  }

  const msgEl = document.createElement('p');
  msgEl.style.marginTop = '16px';
  msgEl.style.color = 'var(--muted)';
  msgEl.style.fontFamily = "'Poppins', sans-serif";
  msgEl.style.fontSize = '0.85rem';
  wrap.appendChild(msgEl);

  function render(step) {
    step.buckets.forEach((chain, i) => {
      const isActive = step.activeBucket === i;
      rows[i].idxCell.style.background = isActive ? '#c6ff4a' : 'var(--card)';
      rows[i].idxCell.style.color = isActive ? '#0d0d0f' : 'var(--muted)';
      rows[i].chainCell.style.background = 'var(--card)';
      rows[i].chainCell.style.color = 'var(--cream)';
      if (chain.length === 0) {
        rows[i].chainCell.textContent = '(empty)';
      } else {
        rows[i].chainCell.innerHTML = chain.map((v, j) => {
          let color = 'var(--cream)';
          if (isActive && j === step.activeIdx) color = step.found === false ? '#ff6b6b' : (step.found === true ? '#c6ff4a' : '#ffd23f');
          return `<span style="color:${color}">${v}</span>`;
        }).join(' → ');
      }
    });
    msgEl.textContent = step.message || '';
  }

  const m2 = m;
  const values = [];
  while (values.length < 8) {
    const v = Math.floor(Math.random() * 40) + 1;
    if (!values.includes(v)) values.push(v);
  }
  const lookupValue = Math.random() < 0.6 ? values[Math.floor(Math.random() * values.length)] : Math.floor(Math.random() * 40) + 1;

  const steps = hashSetSteps(m2, values, lookupValue);
  return {
    steps,
    render,
    context: `Insert {${values.join(', ')}} into a hash set of m = ${m2} buckets using h(x) = x % ${m2} (chaining), then look up ${lookupValue}.`,
  };
}
