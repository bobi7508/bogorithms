// Fibonacci recursion-tree visualizer: shows the call stack expanding and
// values bubbling back up, exactly in the order the real recursion happens.

function buildFibTree(n) {
  let idCounter = 0;
  function build(k, depth) {
    const node = { id: idCounter++, n: k, depth, children: [], x: 0, y: depth };
    if (k > 1) {
      node.children.push(build(k - 1, depth + 1));
      node.children.push(build(k - 2, depth + 1));
    }
    return node;
  }
  const root = build(n, 0);
  let leafCounter = 0;
  function assignX(node) {
    if (node.children.length === 0) {
      node.x = leafCounter++;
      return node.x;
    }
    const xs = node.children.map(assignX);
    node.x = (xs[0] + xs[xs.length - 1]) / 2;
    return node.x;
  }
  assignX(root);
  return root;
}

function flattenTree(root) {
  const list = [];
  (function walk(n) { list.push(n); n.children.forEach(walk); })(root);
  return list;
}

function fibRecursionSteps(n) {
  const root = buildFibTree(n);
  const allNodes = flattenTree(root);
  const state = {}; // id -> {status:'pending'|'active'|'done', value}
  allNodes.forEach((nd) => (state[nd.id] = { status: 'pending', value: null }));

  const steps = [];
  function snapshot(activeId, message, phase) {
    const snapState = {};
    allNodes.forEach((nd) => (snapState[nd.id] = { ...state[nd.id] }));
    steps.push({ nodes: allNodes, state: snapState, activeId, message, phase });
  }

  function evalNode(node) {
    state[node.id] = { status: 'active', value: null };
    snapshot(node.id, `Call fib(${node.n})` + (node.n > 1 ? ' — no result yet, call both child branches.' : ''), 'call');
    let value;
    if (node.n <= 1) {
      value = node.n;
    } else {
      const a = evalNode(node.children[0]);
      const b = evalNode(node.children[1]);
      value = a + b;
    }
    state[node.id] = { status: 'done', value };
    snapshot(node.id, `fib(${node.n}) returns ${value}.`, 'return');
    return value;
  }
  evalNode(root);
  return steps;
}

function renderFibTree(ctx, width, height, step) {
  ctx.clearRect(0, 0, width, height);
  const { nodes, state, activeId, message } = step;
  const maxX = Math.max(...nodes.map((n) => n.x), 0) + 1;
  const maxDepth = Math.max(...nodes.map((n) => n.depth), 0) + 1;
  const padX = 30, padY = 30;
  const usableW = width - padX * 2;
  const usableH = height - padY * 2 - 20;
  const px = (n) => padX + (maxX <= 1 ? usableW / 2 : (n.x / (maxX - 1)) * usableW);
  const py = (n) => padY + (n.depth / Math.max(maxDepth - 1, 1)) * usableH;

  // edges
  nodes.forEach((n) => {
    n.children.forEach((c) => {
      ctx.strokeStyle = VIZ_COLORS.edge;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(px(n), py(n) + 16);
      ctx.lineTo(px(c), py(c) - 16);
      ctx.stroke();
    });
  });

  // nodes
  nodes.forEach((n) => {
    const s = state[n.id];
    let fill = VIZ_COLORS.node;
    if (s.status === 'done') fill = VIZ_COLORS.barSorted;
    if (n.id === activeId) fill = VIZ_COLORS.compare;
    ctx.beginPath();
    ctx.arc(px(n), py(n), 18, 0, Math.PI * 2);
    ctx.fillStyle = fill;
    ctx.fill();
    ctx.strokeStyle = VIZ_COLORS.nodeBorder;
    ctx.stroke();
    ctx.fillStyle = (s.status === 'done' || n.id === activeId) ? VIZ_COLORS.bg : VIZ_COLORS.text;
    ctx.font = 'bold 10px Space Mono, monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`f(${n.n})`, px(n), py(n));
    ctx.textBaseline = 'alphabetic';
    if (s.status === 'done') {
      ctx.fillStyle = VIZ_COLORS.accent || '#c6ff4a';
      ctx.font = 'bold 11px Space Mono, monospace';
      ctx.fillText('=' + s.value, px(n), py(n) + 30);
    }
  });

  ctx.fillStyle = VIZ_COLORS.muted;
  ctx.font = '12px Poppins, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(message || '', 4, height - 8);
}

function setupRecursionVisual(container) {
  const width = Math.min(container.clientWidth || 640, 640);
  const height = 320;
  const canvas = document.createElement('canvas');
  container.appendChild(canvas);
  const ctx = fitCanvas(canvas, width, height);
  const n = 5;
  const steps = fibRecursionSteps(n);
  return {
    steps,
    render: (step) => renderFibTree(ctx, width, height, step),
    context: `Compute fib(${n}) using plain recursion (no memoization).`,
  };
}
