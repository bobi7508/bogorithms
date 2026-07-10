// 0/1 Knapsack — dynamic programming table filled cell by cell.

const KNAPSACK_ITEMS = [
  { w: 2, v: 3 },
  { w: 3, v: 4 },
  { w: 4, v: 5 },
  { w: 5, v: 6 },
];
const KNAPSACK_CAP = 7;

function knapsackSteps() {
  const items = KNAPSACK_ITEMS;
  const n = items.length;
  const cap = KNAPSACK_CAP;
  const dp = Array.from({ length: n + 1 }, () => Array(cap + 1).fill(null));
  const steps = [];

  for (let w = 0; w <= cap; w++) dp[0][w] = 0;
  steps.push({ dp: dp.map((r) => r.slice()), cell: null, refs: [], message: 'Base row: 0 items → the max value is always 0.', phase: 'baseRow' });

  for (let i = 1; i <= n; i++) {
    const { w: wt, v: val } = items[i - 1];
    for (let w = 0; w <= cap; w++) {
      const notTake = dp[i - 1][w];
      let value, refs, msg, phase;
      if (w >= wt) {
        const take = dp[i - 1][w - wt] + val;
        value = Math.max(notTake, take);
        refs = [[i - 1, w], [i - 1, w - wt]];
        msg = `Item ${i} (w=${wt}, v=${val}), capacity ${w}: max(skip=${notTake}, take=${take}) = ${value}.`;
        phase = 'computeCellTake';
      } else {
        value = notTake;
        refs = [[i - 1, w]];
        msg = `Item ${i} (w=${wt}) is heavier than capacity ${w} → can't take it, dp = ${notTake}.`;
        phase = 'computeCellSkip';
      }
      dp[i][w] = value;
      steps.push({ dp: dp.map((r) => r.slice()), cell: [i, w], refs, message: msg, phase });
    }
  }
  steps.push({ dp: dp.map((r) => r.slice()), cell: [n, cap], refs: [], message: `Done! Optimal value for capacity ${cap}: ${dp[n][cap]}.`, phase: 'done' });
  return steps;
}

function setupDPVisual(container) {
  const cap = KNAPSACK_CAP;
  const n = KNAPSACK_ITEMS.length;
  const wrap = document.createElement('div');
  wrap.style.overflowX = 'auto';
  wrap.style.width = '100%';

  const table = document.createElement('table');
  table.style.borderCollapse = 'collapse';
  table.style.margin = '0 auto';
  table.style.fontFamily = "'Space Mono', monospace";
  table.style.fontSize = '13px';

  const cells = [];
  const headRow = document.createElement('tr');
  headRow.appendChild(cellEl('i \\ w', true));
  for (let w = 0; w <= cap; w++) headRow.appendChild(cellEl(w, true));
  table.appendChild(headRow);

  for (let i = 0; i <= n; i++) {
    const row = document.createElement('tr');
    const label = i === 0 ? '0' : `${i} (w${KNAPSACK_ITEMS[i - 1].w},v${KNAPSACK_ITEMS[i - 1].v})`;
    row.appendChild(cellEl(label, true));
    cells[i] = [];
    for (let w = 0; w <= cap; w++) {
      const td = cellEl('', false);
      row.appendChild(td);
      cells[i][w] = td;
    }
    table.appendChild(row);
  }
  wrap.appendChild(table);

  const msgEl = document.createElement('p');
  msgEl.style.marginTop = '14px';
  msgEl.style.color = 'var(--muted)';
  msgEl.style.fontFamily = "'Poppins', sans-serif";
  msgEl.style.fontSize = '0.85rem';
  wrap.appendChild(msgEl);

  container.appendChild(wrap);

  function render(step) {
    for (let i = 0; i <= n; i++) {
      for (let w = 0; w <= cap; w++) {
        const val = step.dp[i][w];
        const td = cells[i][w];
        td.textContent = val === null ? '' : val;
        td.style.background = 'var(--card)';
        td.style.color = 'var(--cream)';
      }
    }
    if (step.refs) {
      step.refs.forEach(([i, w]) => {
        cells[i][w].style.background = '#3a3a15';
        cells[i][w].style.color = '#ffd23f';
      });
    }
    if (step.cell) {
      const [i, w] = step.cell;
      cells[i][w].style.background = '#c6ff4a';
      cells[i][w].style.color = '#0d0d0f';
    }
    msgEl.textContent = step.message || '';
  }

  const itemsDesc = KNAPSACK_ITEMS.map((it, idx) => `#${idx + 1}(w=${it.w},v=${it.v})`).join(', ');
  return {
    steps: knapsackSteps(),
    render,
    context: `Maximize value with capacity W = ${KNAPSACK_CAP} using ${KNAPSACK_ITEMS.length} items: ${itemsDesc}.`,
  };
}

function cellEl(text, isHead) {
  const td = document.createElement(isHead ? 'th' : 'td');
  td.textContent = text;
  td.style.border = '1px solid var(--card-border)';
  td.style.padding = '8px 10px';
  td.style.minWidth = '36px';
  td.style.textAlign = 'center';
  td.style.color = isHead ? 'var(--muted)' : 'var(--cream)';
  td.style.transition = 'background 0.15s ease, color 0.15s ease';
  return td;
}
