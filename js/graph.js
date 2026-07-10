// Graph/tree step generators + shared renderer for BFS, DFS, Dijkstra,
// Topological Sort, and generic Tree traversal (all reuse the same engine).

const GRAPH_NODES = [
  { id: 'A', x: 50, y: 150 },
  { id: 'B', x: 170, y: 60 },
  { id: 'C', x: 170, y: 240 },
  { id: 'D', x: 310, y: 60 },
  { id: 'E', x: 310, y: 240 },
  { id: 'F', x: 450, y: 150 },
  { id: 'G', x: 560, y: 150 },
];
const GRAPH_EDGES = [
  ['A', 'B', 4], ['A', 'C', 2], ['C', 'B', 1], ['B', 'D', 5],
  ['C', 'E', 8], ['D', 'E', 2], ['D', 'F', 3], ['E', 'F', 2], ['F', 'G', 2],
];

const TREE_NODES = [
  { id: 'A', x: 300, y: 40 },
  { id: 'B', x: 150, y: 140 },
  { id: 'C', x: 450, y: 140 },
  { id: 'D', x: 70, y: 240 },
  { id: 'E', x: 230, y: 240 },
  { id: 'F', x: 380, y: 240 },
  { id: 'G', x: 520, y: 240 },
];
const TREE_EDGES = [
  ['A', 'B', 1], ['A', 'C', 1], ['B', 'D', 1], ['B', 'E', 1], ['C', 'F', 1], ['C', 'G', 1],
];

const TOPO_NODES = [
  { id: 'A', x: 60, y: 160 },
  { id: 'B', x: 220, y: 60 },
  { id: 'C', x: 220, y: 260 },
  { id: 'D', x: 380, y: 160 },
  { id: 'E', x: 540, y: 60 },
  { id: 'F', x: 540, y: 260 },
];
const TOPO_EDGES = [
  ['A', 'B'], ['A', 'C'], ['B', 'D'], ['C', 'D'], ['D', 'E'], ['D', 'F'],
];

function buildAdjacency(nodes, edges) {
  const adj = {};
  nodes.forEach((n) => (adj[n.id] = []));
  edges.forEach(([u, v, w]) => {
    adj[u].push([v, w]);
    adj[v].push([u, w]);
  });
  return adj;
}

function buildDirectedAdjacency(nodes, edges) {
  const adj = {}, indeg = {};
  nodes.forEach((n) => { adj[n.id] = []; indeg[n.id] = 0; });
  edges.forEach(([u, v]) => { adj[u].push(v); indeg[v]++; });
  return { adj, indeg };
}

function bfsSteps(nodes, edges, start) {
  const adj = buildAdjacency(nodes, edges);
  const steps = [];
  const visited = new Set([start]);
  const queue = [start];
  steps.push({ visited: new Set(visited), current: null, frontier: queue.slice(), edge: null, message: `Start at ${start}, enqueue it.`, phase: 'init' });
  while (queue.length) {
    const u = queue.shift();
    steps.push({ visited: new Set(visited), current: u, frontier: queue.slice(), edge: null, message: `Dequeue ${u} and visit it.`, phase: 'visit' });
    for (const [v] of adj[u].sort((a, b) => a[0].localeCompare(b[0]))) {
      if (!visited.has(v)) {
        visited.add(v);
        queue.push(v);
        steps.push({ visited: new Set(visited), current: u, frontier: queue.slice(), edge: [u, v], message: `${u} → ${v}: unvisited, enqueue ${v}.`, phase: 'discover' });
      }
    }
  }
  steps.push({ visited: new Set(visited), current: null, frontier: [], edge: null, message: 'BFS complete — all connected vertices visited.', phase: 'done' });
  return steps;
}

function dfsSteps(nodes, edges, start) {
  const adj = buildAdjacency(nodes, edges);
  const steps = [];
  const visited = new Set();
  const stack = [];

  function visit(u) {
    visited.add(u);
    steps.push({ visited: new Set(visited), current: u, frontier: stack.slice(), edge: null, message: `Visit ${u} (recursion / push onto the stack).`, phase: 'visit' });
    for (const [v] of adj[u].sort((a, b) => a[0].localeCompare(b[0]))) {
      if (!visited.has(v)) {
        stack.push(v);
        steps.push({ visited: new Set(visited), current: u, frontier: stack.slice(), edge: [u, v], message: `${u} → ${v}: unvisited, go deeper into ${v}.`, phase: 'exploreEdge' });
        visit(v);
        stack.pop();
      }
    }
  }
  visit(start);
  steps.push({ visited: new Set(visited), current: null, frontier: [], edge: null, message: 'DFS complete — all connected vertices visited.', phase: 'done' });
  return steps;
}

function dijkstraSteps(nodes, edges, start) {
  const adj = buildAdjacency(nodes, edges);
  const steps = [];
  const dist = {};
  nodes.forEach((n) => (dist[n.id] = Infinity));
  dist[start] = 0;
  const visited = new Set();
  steps.push({ dist: { ...dist }, visited: new Set(), current: null, edge: null, message: `Initialize: dist[${start}] = 0, all others = ∞.`, phase: 'init' });

  while (visited.size < nodes.length) {
    let u = null, best = Infinity;
    for (const n of nodes) {
      if (!visited.has(n.id) && dist[n.id] < best) { best = dist[n.id]; u = n.id; }
    }
    if (u === null) break;
    visited.add(u);
    steps.push({ dist: { ...dist }, visited: new Set(visited), current: u, edge: null, message: `Pick the unvisited vertex with smallest dist: ${u} (${dist[u]}).`, phase: 'selectMin' });
    for (const [v, w] of adj[u]) {
      if (visited.has(v)) continue;
      const alt = dist[u] + w;
      if (alt < dist[v]) {
        dist[v] = alt;
        steps.push({ dist: { ...dist }, visited: new Set(visited), current: u, edge: [u, v], message: `Update dist[${v}] = ${alt} (via ${u}, edge weight ${w}).`, phase: 'relax' });
      } else {
        steps.push({ dist: { ...dist }, visited: new Set(visited), current: u, edge: [u, v], message: `Keep dist[${v}] = ${dist[v] === Infinity ? '∞' : dist[v]} (not better via ${u}).`, phase: 'relax' });
      }
    }
  }
  steps.push({ dist: { ...dist }, visited: new Set(visited), current: null, edge: null, message: 'Complete — shortest paths found to every vertex.', phase: 'done' });
  return steps;
}

function multiSourceBfsSteps(nodes, edges, sources) {
  const adj = buildAdjacency(nodes, edges);
  const steps = [];
  const dist = {};
  nodes.forEach((n) => (dist[n.id] = Infinity));
  const visited = new Set(sources);
  const queue = sources.slice();
  sources.forEach((s) => (dist[s] = 0));
  steps.push({ dist: { ...dist }, visited: new Set(visited), current: null, frontier: queue.slice(), edge: null, message: `Enqueue all sources at once: [${sources.join(', ')}], each at distance 0.`, phase: 'init' });
  while (queue.length) {
    const u = queue.shift();
    steps.push({ dist: { ...dist }, visited: new Set(visited), current: u, frontier: queue.slice(), edge: null, message: `Dequeue ${u} (dist ${dist[u]}) and visit it.`, phase: 'visit' });
    for (const [v] of adj[u].sort((a, b) => a[0].localeCompare(b[0]))) {
      if (!visited.has(v)) {
        visited.add(v);
        dist[v] = dist[u] + 1;
        queue.push(v);
        steps.push({ dist: { ...dist }, visited: new Set(visited), current: u, frontier: queue.slice(), edge: [u, v], message: `${u} → ${v}: unvisited, dist[${v}] = ${dist[v]}, enqueue ${v}.`, phase: 'discover' });
      }
    }
  }
  steps.push({ dist: { ...dist }, visited: new Set(visited), current: null, frontier: [], edge: null, message: 'Multisource BFS complete — every vertex has its distance to the nearest source.', phase: 'done' });
  return steps;
}

function topoSortSteps(nodes, edges) {
  const { adj, indeg } = buildDirectedAdjacency(nodes, edges);
  const steps = [];
  const queue = nodes.filter((n) => indeg[n.id] === 0).map((n) => n.id).sort();
  const order = [];
  const visited = new Set();
  steps.push({ visited: new Set(), current: null, frontier: queue.slice(), edge: null, order: order.slice(), message: `Vertices with in-degree 0: [${queue.join(', ')}].`, phase: 'init' });
  while (queue.length) {
    const u = queue.shift();
    order.push(u);
    visited.add(u);
    steps.push({ visited: new Set(visited), current: u, frontier: queue.slice(), edge: null, order: order.slice(), message: `Dequeue ${u}, append to order.`, phase: 'visit' });
    for (const v of adj[u].slice().sort()) {
      indeg[v]--;
      steps.push({ visited: new Set(visited), current: u, frontier: queue.slice(), edge: [u, v], order: order.slice(), message: `Remove edge ${u} → ${v}, in-degree[${v}] = ${indeg[v]}.`, phase: 'reduceIndeg' });
      if (indeg[v] === 0) {
        queue.push(v);
        steps.push({ visited: new Set(visited), current: u, frontier: queue.slice(), edge: [u, v], order: order.slice(), message: `${v} now has in-degree 0 → enqueue it.`, phase: 'discover' });
      }
    }
  }
  steps.push({ visited: new Set(visited), current: null, frontier: [], edge: null, order: order.slice(), message: `Done — topological order: ${order.join(' → ')}.`, phase: 'done' });
  return steps;
}

function renderGraphStep(ctx, width, height, step, mode, nodes, edges) {
  ctx.clearRect(0, 0, width, height);
  const visited = step.visited;
  const current = step.current;
  const edge = step.edge;
  const directed = mode === 'topo';

  // edges
  edges.forEach((e) => {
    const [u, v, w] = e;
    const nu = nodes.find((n) => n.id === u);
    const nv = nodes.find((n) => n.id === v);
    const isActive = edge && ((edge[0] === u && edge[1] === v) || (edge[0] === v && edge[1] === u));
    ctx.strokeStyle = isActive ? VIZ_COLORS.compare : VIZ_COLORS.edge;
    ctx.lineWidth = isActive ? 3 : 1.5;
    ctx.beginPath();
    ctx.moveTo(nu.x, nu.y);
    ctx.lineTo(nv.x, nv.y);
    ctx.stroke();
    if (directed) {
      const angle = Math.atan2(nv.y - nu.y, nv.x - nu.x);
      const ex = nv.x - Math.cos(angle) * 24, ey = nv.y - Math.sin(angle) * 24;
      ctx.fillStyle = isActive ? VIZ_COLORS.compare : VIZ_COLORS.edge;
      ctx.beginPath();
      ctx.moveTo(ex, ey);
      ctx.lineTo(ex - 8 * Math.cos(angle - 0.4), ey - 8 * Math.sin(angle - 0.4));
      ctx.lineTo(ex - 8 * Math.cos(angle + 0.4), ey - 8 * Math.sin(angle + 0.4));
      ctx.closePath();
      ctx.fill();
    }
    if (w !== undefined) {
      const mx = (nu.x + nv.x) / 2, my = (nu.y + nv.y) / 2;
      ctx.fillStyle = VIZ_COLORS.muted;
      ctx.font = '10px Space Mono, monospace';
      ctx.textAlign = 'center';
      ctx.fillRect(mx - 9, my - 9, 18, 14);
      ctx.fillStyle = '#0d0d0f';
      ctx.fillText(w, mx, my + 2);
    }
  });

  // nodes
  nodes.forEach((n) => {
    let fill = VIZ_COLORS.node;
    if (visited && visited.has(n.id)) fill = VIZ_COLORS.barSorted;
    if (n.id === current) fill = VIZ_COLORS.compare;
    ctx.beginPath();
    ctx.arc(n.x, n.y, 22, 0, Math.PI * 2);
    ctx.fillStyle = fill;
    ctx.fill();
    ctx.strokeStyle = VIZ_COLORS.nodeBorder;
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.fillStyle = (visited && visited.has(n.id)) || n.id === current ? VIZ_COLORS.bg : VIZ_COLORS.text;
    ctx.font = 'bold 14px Space Mono, monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(n.id, n.x, n.y);
    ctx.textBaseline = 'alphabetic';

    if ((mode === 'dijkstra' || mode === 'multibfs') && step.dist) {
      const d = step.dist[n.id];
      ctx.fillStyle = VIZ_COLORS.accent || '#c6ff4a';
      ctx.font = '11px Space Mono, monospace';
      ctx.fillText(d === Infinity ? '∞' : d, n.x, n.y + 38);
    }
  });

  // message + frontier
  ctx.fillStyle = VIZ_COLORS.muted;
  ctx.font = '12px Poppins, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(step.message || '', 4, height - 10);

  if ((mode === 'bfs' || mode === 'dfs' || mode === 'topo' || mode === 'multibfs') && step.frontier) {
    const label = mode === 'dfs' ? 'Stack: ' : 'Queue: ';
    ctx.fillStyle = VIZ_COLORS.text;
    ctx.font = '12px Space Mono, monospace';
    ctx.fillText(label + '[ ' + step.frontier.join(', ') + ' ]', 4, height - 28);
  }
  if (mode === 'topo' && step.order) {
    ctx.fillStyle = VIZ_COLORS.accent || '#c6ff4a';
    ctx.font = '12px Space Mono, monospace';
    ctx.fillText('Order: [ ' + step.order.join(', ') + ' ]', 4, height - 46);
  }
}

function setupGraphVisual(container, algoId) {
  const width = Math.min(container.clientWidth || 640, 640);
  const height = 320;
  const canvas = document.createElement('canvas');
  container.appendChild(canvas);
  const ctx = fitCanvas(canvas, width, height);

  let steps, mode = algoId;
  if (algoId === 'bfs') steps = bfsSteps(GRAPH_NODES, GRAPH_EDGES, 'A');
  else if (algoId === 'dfs') steps = dfsSteps(GRAPH_NODES, GRAPH_EDGES, 'A');
  else steps = dijkstraSteps(GRAPH_NODES, GRAPH_EDGES, 'A');

  const context = algoId === 'dijkstra'
    ? `Find the shortest paths from source vertex A in a weighted graph of ${GRAPH_NODES.length} vertices and ${GRAPH_EDGES.length} edges.`
    : `Traverse a graph of ${GRAPH_NODES.length} vertices and ${GRAPH_EDGES.length} edges, starting at vertex A.`;

  return {
    steps,
    render: (step) => renderGraphStep(ctx, width, height, step, mode, GRAPH_NODES, GRAPH_EDGES),
    context,
  };
}

function setupTreeVisual(container) {
  const width = Math.min(container.clientWidth || 640, 640);
  const height = 320;
  const canvas = document.createElement('canvas');
  container.appendChild(canvas);
  const ctx = fitCanvas(canvas, width, height);
  const steps = dfsSteps(TREE_NODES, TREE_EDGES, 'A');
  return {
    steps,
    render: (step) => renderGraphStep(ctx, width, height, step, 'dfs', TREE_NODES, TREE_EDGES),
    context: `Traverse a tree of ${TREE_NODES.length} nodes with a depth-first search, starting at the root A.`,
  };
}

function setupMultiSourceBfsVisual(container) {
  const width = Math.min(container.clientWidth || 640, 640);
  const height = 320;
  const canvas = document.createElement('canvas');
  container.appendChild(canvas);
  const ctx = fitCanvas(canvas, width, height);
  const sources = ['A', 'F'];
  const steps = multiSourceBfsSteps(GRAPH_NODES, GRAPH_EDGES, sources);
  return {
    steps,
    render: (step) => renderGraphStep(ctx, width, height, step, 'multibfs', GRAPH_NODES, GRAPH_EDGES),
    context: `Run BFS from multiple sources at once (${sources.join(', ')}) to find each vertex's distance to its nearest source, in a graph of ${GRAPH_NODES.length} vertices.`,
  };
}

function setupTopoVisual(container) {
  const width = Math.min(container.clientWidth || 640, 640);
  const height = 320;
  const canvas = document.createElement('canvas');
  container.appendChild(canvas);
  const ctx = fitCanvas(canvas, width, height);
  const steps = topoSortSteps(TOPO_NODES, TOPO_EDGES);
  return {
    steps,
    render: (step) => renderGraphStep(ctx, width, height, step, 'topo', TOPO_NODES, TOPO_EDGES),
    context: `Find a valid build order (topological sort) for a DAG of ${TOPO_NODES.length} vertices and ${TOPO_EDGES.length} directed edges.`,
  };
}
