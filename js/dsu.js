// Disjoint Set Union (Union-Find) with path compression + union by rank,
// rendered as a parent-pointer array (a compact table, like the DP table).

function dsuSteps(n, unions) {
  const parent = Array.from({ length: n }, (_, i) => i);
  const rank = Array(n).fill(0);
  const steps = [];

  function snap(highlight, message, phase) {
    steps.push({ parent: parent.slice(), highlight: highlight || [], message, phase });
  }

  function find(x, path) {
    path.push(x);
    if (parent[x] !== x) {
      const root = find(parent[x], path);
      parent[x] = root; // path compression
      return root;
    }
    return x;
  }

  snap([], `Initialize: ${n} elements, each is its own parent (its own set).`, 'init');

  for (const [a, b] of unions) {
    const pathA = [], pathB = [];
    const rootA = find(a, pathA);
    snap(pathA, `find(${a}) walks up to root ${rootA} (path compression flattens it).`, 'find');
    const rootB = find(b, pathB);
    snap(pathB, `find(${b}) walks up to root ${rootB} (path compression flattens it).`, 'find');
    if (rootA === rootB) {
      snap([a, b], `${a} and ${b} are already in the same set — skip union.`, 'skip');
      continue;
    }
    if (rank[rootA] < rank[rootB]) {
      parent[rootA] = rootB;
      snap([rootA, rootB], `union(${a}, ${b}): attach root ${rootA} under root ${rootB} (smaller rank).`, 'union');
    } else if (rank[rootA] > rank[rootB]) {
      parent[rootB] = rootA;
      snap([rootB, rootA], `union(${a}, ${b}): attach root ${rootB} under root ${rootA} (smaller rank).`, 'union');
    } else {
      parent[rootB] = rootA;
      rank[rootA]++;
      snap([rootB, rootA], `union(${a}, ${b}): equal rank — attach root ${rootB} under root ${rootA}, increase rank.`, 'union');
    }
  }
  snap([], 'Done — all union operations complete.', 'done');
  return steps;
}

function setupDSUVisual(container) {
  const n = 8;
  const wrap = document.createElement('div');
  wrap.style.width = '100%';
  container.appendChild(wrap);

  const table = document.createElement('table');
  table.style.borderCollapse = 'collapse';
  table.style.margin = '20px auto 0';
  table.style.fontFamily = "'Space Mono', monospace";
  table.style.fontSize = '13px';

  const headRow = document.createElement('tr');
  headRow.appendChild(cellEl('i', true));
  for (let i = 0; i < n; i++) headRow.appendChild(cellEl(i, true));
  table.appendChild(headRow);

  const dataRow = document.createElement('tr');
  dataRow.appendChild(cellEl('parent[i]', true));
  const cells = [];
  for (let i = 0; i < n; i++) {
    const td = cellEl(i, false);
    dataRow.appendChild(td);
    cells.push(td);
  }
  table.appendChild(dataRow);
  wrap.appendChild(table);

  const msgEl = document.createElement('p');
  msgEl.style.marginTop = '16px';
  msgEl.style.color = 'var(--muted)';
  msgEl.style.fontFamily = "'Poppins', sans-serif";
  msgEl.style.fontSize = '0.85rem';
  wrap.appendChild(msgEl);

  function render(step) {
    step.parent.forEach((p, i) => {
      cells[i].textContent = p;
      cells[i].style.background = 'var(--card)';
      cells[i].style.color = 'var(--cream)';
    });
    (step.highlight || []).forEach((i) => {
      cells[i].style.background = '#c6ff4a';
      cells[i].style.color = '#0d0d0f';
    });
    msgEl.textContent = step.message || '';
  }

  const unions = [[0, 1], [2, 3], [4, 5], [1, 3], [5, 6], [0, 6]];
  const steps = dsuSteps(n, unions);
  return {
    steps,
    render,
    context: `Perform union/find on n = ${n} elements with operations: ${unions.map(([a, b]) => `union(${a},${b})`).join(', ')}.`,
  };
}
