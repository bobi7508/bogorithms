// Trie (prefix tree) — insert words character by character, reusing
// existing edges, and mark the node where each word ends.

function buildTrieStructure(words) {
  let idCounter = 0;
  const root = { id: idCounter++, char: '•', depth: 0, children: {}, isEnd: false, x: 0 };
  for (const w of words) {
    let node = root;
    for (const ch of w) {
      if (!node.children[ch]) {
        node.children[ch] = { id: idCounter++, char: ch, depth: node.depth + 1, children: {}, isEnd: false, x: 0 };
      }
      node = node.children[ch];
    }
    node.isEnd = true;
  }
  return root;
}

function flattenTrie(root) {
  const list = [];
  (function walk(n) { list.push(n); Object.values(n.children).forEach(walk); })(root);
  return list;
}

function assignTrieX(root) {
  let leafCounter = 0;
  function assign(n) {
    const kids = Object.values(n.children);
    if (kids.length === 0) { n.x = leafCounter++; return n.x; }
    const xs = kids.map(assign);
    n.x = (xs[0] + xs[xs.length - 1]) / 2;
    return n.x;
  }
  assign(root);
  return root;
}

function trieInsertSteps(words) {
  const root = buildTrieStructure(words);
  assignTrieX(root);
  const allNodes = flattenTrie(root);
  const state = {};
  allNodes.forEach((n) => (state[n.id] = { visited: false, isEnd: n.isEnd }));

  const steps = [];
  function snap(activeId, message, phase) {
    const snapState = {};
    allNodes.forEach((n) => (snapState[n.id] = { ...state[n.id] }));
    steps.push({ nodes: allNodes, state: snapState, activeId, message, phase });
  }

  for (const w of words) {
    let node = root;
    state[node.id].visited = true;
    snap(node.id, `Insert "${w}": start at the root.`, 'traverse');
    for (const ch of w) {
      node = node.children[ch];
      const already = state[node.id].visited;
      state[node.id].visited = true;
      snap(node.id, already ? `'${ch}' edge already exists → follow it.` : `'${ch}' doesn't exist yet → create a new node.`, already ? 'traverse' : 'create');
    }
    snap(node.id, `Mark "${w}" as complete at this node.`, 'markEnd');
  }
  snap(null, `Done — trie built from ${words.length} words.`, 'done');
  return steps;
}

function renderTrie(ctx, width, height, step) {
  ctx.clearRect(0, 0, width, height);
  const { nodes, state, activeId, message } = step;
  const maxX = Math.max(...nodes.map((n) => n.x), 0) + 1;
  const maxDepth = Math.max(...nodes.map((n) => n.depth), 0) + 1;
  const padX = 30, padY = 30;
  const usableW = width - padX * 2;
  const usableH = height - padY * 2 - 20;
  const px = (n) => padX + (maxX <= 1 ? usableW / 2 : (n.x / (maxX - 1)) * usableW);
  const py = (n) => padY + (n.depth / Math.max(maxDepth - 1, 1)) * usableH;

  nodes.forEach((n) => {
    Object.values(n.children).forEach((c) => {
      ctx.strokeStyle = VIZ_COLORS.edge;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(px(n), py(n) + 16);
      ctx.lineTo(px(c), py(c) - 16);
      ctx.stroke();
    });
  });

  nodes.forEach((n) => {
    const s = state[n.id];
    let fill = VIZ_COLORS.node;
    if (s.visited) fill = VIZ_COLORS.barSorted;
    if (n.id === activeId) fill = VIZ_COLORS.compare;
    ctx.beginPath();
    ctx.arc(px(n), py(n), 16, 0, Math.PI * 2);
    ctx.fillStyle = fill;
    ctx.fill();
    ctx.strokeStyle = s.isEnd ? (VIZ_COLORS.accent || '#c6ff4a') : VIZ_COLORS.nodeBorder;
    ctx.lineWidth = s.isEnd ? 3 : 1.5;
    ctx.stroke();
    ctx.fillStyle = (s.visited || n.id === activeId) ? VIZ_COLORS.bg : VIZ_COLORS.text;
    ctx.font = 'bold 12px Space Mono, monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(n.char, px(n), py(n));
    ctx.textBaseline = 'alphabetic';
  });

  ctx.fillStyle = VIZ_COLORS.muted;
  ctx.font = '12px Poppins, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(message || '', 4, height - 8);
}

function setupTrieVisual(container) {
  const width = Math.min(container.clientWidth || 640, 640);
  const height = 300;
  const canvas = document.createElement('canvas');
  container.appendChild(canvas);
  const ctx = fitCanvas(canvas, width, height);

  const words = ['cat', 'car', 'card', 'dog'];
  const steps = trieInsertSteps(words);
  return {
    steps,
    render: (step) => renderTrie(ctx, width, height, step),
    context: `Insert the words [${words.join(', ')}] into a trie, one character at a time.`,
  };
}
