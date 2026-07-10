// Tree algorithms that need a rooted parent/child view of TREE_NODES/TREE_EDGES
// (defined in graph.js): DP on Tree, Lowest Common Ancestor, Euler Tour.

function rootTree(nodes, edges, root) {
  const adj = buildAdjacency(nodes, edges);
  const parent = {}, depth = {}, children = {};
  nodes.forEach((n) => (children[n.id] = []));
  const visited = new Set([root]);
  parent[root] = null;
  depth[root] = 0;
  const queue = [root];
  while (queue.length) {
    const u = queue.shift();
    for (const [v] of adj[u]) {
      if (!visited.has(v)) {
        visited.add(v);
        parent[v] = u;
        depth[v] = depth[u] + 1;
        children[u].push(v);
        queue.push(v);
      }
    }
  }
  return { parent, depth, children };
}

function drawTreeBase(ctx, nodes, edges, highlightNodes, highlightEdge) {
  edges.forEach(([u, v]) => {
    const nu = nodes.find((n) => n.id === u);
    const nv = nodes.find((n) => n.id === v);
    const isActive = highlightEdge && ((highlightEdge[0] === u && highlightEdge[1] === v) || (highlightEdge[0] === v && highlightEdge[1] === u));
    ctx.strokeStyle = isActive ? VIZ_COLORS.compare : VIZ_COLORS.edge;
    ctx.lineWidth = isActive ? 3 : 1.5;
    ctx.beginPath();
    ctx.moveTo(nu.x, nu.y);
    ctx.lineTo(nv.x, nv.y);
    ctx.stroke();
  });
  nodes.forEach((n) => {
    const hl = highlightNodes && highlightNodes[n.id];
    ctx.beginPath();
    ctx.arc(n.x, n.y, 22, 0, Math.PI * 2);
    ctx.fillStyle = hl || VIZ_COLORS.node;
    ctx.fill();
    ctx.strokeStyle = VIZ_COLORS.nodeBorder;
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.fillStyle = hl ? VIZ_COLORS.bg : VIZ_COLORS.text;
    ctx.font = 'bold 14px Space Mono, monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(n.id, n.x, n.y);
    ctx.textBaseline = 'alphabetic';
  });
}

// ---------------- DP on Tree (subtree sum) ----------------

function dpOnTreeSteps(nodes, edges, root, values) {
  const { children } = rootTree(nodes, edges, root);
  const dp = {};
  const steps = [];

  function visit(u) {
    steps.push({ dp: { ...dp }, current: u, edge: null, phase: 'visit', message: `Visit ${u} (value = ${values[u]}), recurse into its children first.` });
    let sum = values[u];
    for (const c of children[u]) {
      visit(c);
      sum += dp[c];
      steps.push({ dp: { ...dp, [u]: undefined }, current: u, edge: [u, c], phase: 'combine', message: `Add dp[${c}] = ${dp[c]} into ${u}'s running total.` });
    }
    dp[u] = sum;
    steps.push({ dp: { ...dp }, current: u, edge: null, phase: 'computeDP', message: `dp[${u}] = value[${u}] + sum(children) = ${sum}.` });
  }
  visit(root);
  steps.push({ dp: { ...dp }, current: null, edge: null, phase: 'done', message: `Done — dp[${root}] = ${dp[root]} is the total sum of the whole tree.` });
  return steps;
}

function renderTreeDP(ctx, width, height, step, nodes, edges, values) {
  ctx.clearRect(0, 0, width, height);
  const highlight = {};
  if (step.current) highlight[step.current] = VIZ_COLORS.compare;
  drawTreeBase(ctx, nodes, edges, highlight, step.edge);

  nodes.forEach((n) => {
    ctx.fillStyle = VIZ_COLORS.muted;
    ctx.font = '10px Space Mono, monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`v=${values[n.id]}`, n.x, n.y - 32);
    if (step.dp[n.id] !== undefined) {
      ctx.fillStyle = VIZ_COLORS.accent || '#c6ff4a';
      ctx.font = 'bold 11px Space Mono, monospace';
      ctx.fillText(`dp=${step.dp[n.id]}`, n.x, n.y + 36);
    }
  });

  ctx.fillStyle = VIZ_COLORS.muted;
  ctx.font = '12px Poppins, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(step.message || '', 4, height - 10);
}

function setupDPOnTreeVisual(container) {
  const width = Math.min(container.clientWidth || 640, 640);
  const height = 320;
  const canvas = document.createElement('canvas');
  container.appendChild(canvas);
  const ctx = fitCanvas(canvas, width, height);

  const values = {};
  TREE_NODES.forEach((n) => (values[n.id] = Math.floor(Math.random() * 9) + 1));
  const steps = dpOnTreeSteps(TREE_NODES, TREE_EDGES, 'A', values);
  return {
    steps,
    render: (step) => renderTreeDP(ctx, width, height, step, TREE_NODES, TREE_EDGES, values),
    context: `Compute the subtree-sum DP for a tree of ${TREE_NODES.length} nodes rooted at A, with node values: ${TREE_NODES.map((n) => `${n.id}=${values[n.id]}`).join(', ')}.`,
  };
}

// ---------------- Lowest Common Ancestor ----------------

function lcaSteps(nodes, edges, root, u, v) {
  const { parent, depth } = rootTree(nodes, edges, root);
  const steps = [];
  let a = u, b = v;
  steps.push({ a, b, phase: 'init', message: `Find LCA(${u}, ${v}). depth[${u}]=${depth[u]}, depth[${v}]=${depth[v]}.` });
  while (depth[a] > depth[b]) {
    const next = parent[a];
    steps.push({ a: next, b, phase: 'alignDepth', message: `${a} is deeper → climb to its parent ${next}.` });
    a = next;
  }
  while (depth[b] > depth[a]) {
    const next = parent[b];
    steps.push({ a, b: next, phase: 'alignDepth', message: `${b} is deeper → climb to its parent ${next}.` });
    b = next;
  }
  while (a !== b) {
    const na = parent[a], nb = parent[b];
    steps.push({ a: na, b: nb, phase: 'climbBoth', message: `${a} ≠ ${b} → climb both up one level to ${na} and ${nb}.` });
    a = na; b = nb;
  }
  steps.push({ a, b, phase: 'found', message: `${a} = ${b} → LCA(${u}, ${v}) = ${a}.` });
  return steps;
}

function renderLCA(ctx, width, height, step, nodes, edges) {
  ctx.clearRect(0, 0, width, height);
  const highlight = {};
  if (step.a) highlight[step.a] = step.a === step.b ? VIZ_COLORS.barSorted : VIZ_COLORS.compare;
  if (step.b) highlight[step.b] = step.a === step.b ? VIZ_COLORS.barSorted : VIZ_COLORS.compare;
  drawTreeBase(ctx, nodes, edges, highlight, null);

  ctx.fillStyle = VIZ_COLORS.muted;
  ctx.font = '12px Poppins, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(step.message || '', 4, height - 10);
}

function setupLCAVisual(container) {
  const width = Math.min(container.clientWidth || 640, 640);
  const height = 320;
  const canvas = document.createElement('canvas');
  container.appendChild(canvas);
  const ctx = fitCanvas(canvas, width, height);

  const leaves = ['D', 'E', 'F', 'G'];
  const u = leaves[Math.floor(Math.random() * leaves.length)];
  let v = leaves[Math.floor(Math.random() * leaves.length)];
  while (v === u) v = leaves[Math.floor(Math.random() * leaves.length)];

  const steps = lcaSteps(TREE_NODES, TREE_EDGES, 'A', u, v);
  return {
    steps,
    render: (step) => renderLCA(ctx, width, height, step, TREE_NODES, TREE_EDGES),
    context: `Find the Lowest Common Ancestor of nodes ${u} and ${v} in a tree of ${TREE_NODES.length} nodes rooted at A.`,
  };
}

// ---------------- Euler Tour ----------------

function eulerTourSteps(nodes, edges, root) {
  const { children } = rootTree(nodes, edges, root);
  const steps = [];
  const tour = [];
  const tin = {}, tout = {};
  let timer = 0;

  function visit(u) {
    tour.push(u);
    tin[u] = timer++;
    steps.push({ tour: tour.slice(), tin: { ...tin }, tout: { ...tout }, current: u, phase: 'enter', message: `Enter ${u}: tin[${u}] = ${tin[u]}, append ${u} to the tour.` });
    for (const c of children[u]) {
      visit(c);
      tour.push(u);
      steps.push({ tour: tour.slice(), tin: { ...tin }, tout: { ...tout }, current: u, phase: 'returnTo', message: `Return to ${u} after visiting ${c} — append ${u} to the tour again.` });
    }
    tout[u] = timer++;
    steps.push({ tour: tour.slice(), tin: { ...tin }, tout: { ...tout }, current: u, phase: 'exit', message: `Exit ${u}: tout[${u}] = ${tout[u]}.` });
  }
  visit(root);
  steps.push({ tour: tour.slice(), tin: { ...tin }, tout: { ...tout }, current: null, phase: 'done', message: `Done — Euler tour has ${tour.length} entries (2n-1 for n = ${nodes.length} nodes).` });
  return steps;
}

function renderEulerTour(ctx, width, height, step, nodes, edges) {
  ctx.clearRect(0, 0, width, height);
  const highlight = {};
  if (step.current) highlight[step.current] = VIZ_COLORS.compare;
  drawTreeBase(ctx, nodes, edges, highlight, null);

  nodes.forEach((n) => {
    const parts = [];
    if (step.tin[n.id] !== undefined) parts.push(`in=${step.tin[n.id]}`);
    if (step.tout[n.id] !== undefined) parts.push(`out=${step.tout[n.id]}`);
    if (parts.length) {
      ctx.fillStyle = VIZ_COLORS.accent || '#c6ff4a';
      ctx.font = '10px Space Mono, monospace';
      ctx.textAlign = 'center';
      ctx.fillText(parts.join(' '), n.x, n.y + 36);
    }
  });

  ctx.fillStyle = VIZ_COLORS.text;
  ctx.font = '11px Space Mono, monospace';
  ctx.textAlign = 'left';
  ctx.fillText('Tour: [ ' + step.tour.join(', ') + ' ]', 4, height - 28);
  ctx.fillStyle = VIZ_COLORS.muted;
  ctx.font = '12px Poppins, sans-serif';
  ctx.fillText(step.message || '', 4, height - 10);
}

function setupEulerTourVisual(container) {
  const width = Math.min(container.clientWidth || 640, 640);
  const height = 320;
  const canvas = document.createElement('canvas');
  container.appendChild(canvas);
  const ctx = fitCanvas(canvas, width, height);
  const steps = eulerTourSteps(TREE_NODES, TREE_EDGES, 'A');
  return {
    steps,
    render: (step) => renderEulerTour(ctx, width, height, step, TREE_NODES, TREE_EDGES),
    context: `Compute the Euler tour and entry/exit times for a tree of ${TREE_NODES.length} nodes rooted at A.`,
  };
}
