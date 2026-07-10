// Step generators + renderers for Stack, Queue, Linked List.

function stackSteps() {
  const steps = [];
  const items = [];
  const ops = [
    ['push', 10], ['push', 25], ['push', 8], ['pop', null],
    ['push', 42], ['pop', null], ['pop', null],
  ];
  steps.push({ items: items.slice(), highlight: -1, message: 'Empty stack.', phase: 'init' });
  for (const [op, val] of ops) {
    if (op === 'push') {
      items.push(val);
      steps.push({ items: items.slice(), highlight: items.length - 1, message: `push(${val}) — add onto the top.`, phase: 'push' });
    } else {
      const removed = items.pop();
      steps.push({ items: items.slice(), highlight: items.length, message: `pop() — remove ${removed} from the top.`, popped: removed, phase: 'pop' });
    }
  }
  return steps;
}

function queueSteps() {
  const steps = [];
  const items = [];
  const ops = [
    ['enqueue', 10], ['enqueue', 25], ['enqueue', 8], ['dequeue', null],
    ['enqueue', 42], ['dequeue', null], ['dequeue', null],
  ];
  steps.push({ items: items.slice(), highlight: -1, message: 'Empty queue.', phase: 'init' });
  for (const [op, val] of ops) {
    if (op === 'enqueue') {
      items.push(val);
      steps.push({ items: items.slice(), highlight: items.length - 1, message: `enqueue(${val}) — add to the rear.`, phase: 'enqueue' });
    } else {
      const removed = items.shift();
      steps.push({ items: items.slice(), highlight: 0, message: `dequeue() — remove ${removed} from the front.`, popped: removed, phase: 'dequeue' });
    }
  }
  return steps;
}

function renderStackQueue(ctx, width, height, step, mode) {
  ctx.clearRect(0, 0, width, height);
  const { items, highlight } = step;
  const boxW = 70, boxH = 44, gap = 10;

  ctx.font = '12px Poppins, sans-serif';
  ctx.fillStyle = VIZ_COLORS.muted;
  ctx.textAlign = 'left';
  ctx.fillText(step.message || '', 4, 20);

  if (mode === 'stack') {
    const baseY = height - 20;
    for (let i = 0; i < items.length; i++) {
      const x = width / 2 - boxW / 2;
      const y = baseY - (i + 1) * (boxH + gap);
      drawBox(ctx, x, y, boxW, boxH, items[i], i === highlight);
      if (i === items.length - 1) labelAbove(ctx, x, y, boxW, 'TOP ←');
    }
  } else {
    const startX = 30;
    const y = height / 2 - boxH / 2;
    for (let i = 0; i < items.length; i++) {
      const x = startX + i * (boxW + gap);
      drawBox(ctx, x, y, boxW, boxH, items[i], i === highlight);
      if (i === 0) labelAbove(ctx, x, y, boxW, 'FRONT');
      if (i === items.length - 1) labelAbove(ctx, x, y, boxW, 'REAR');
    }
  }
}

function drawBox(ctx, x, y, w, h, value, active) {
  ctx.fillStyle = active ? VIZ_COLORS.compare : VIZ_COLORS.node;
  ctx.strokeStyle = active ? VIZ_COLORS.compare : VIZ_COLORS.nodeBorder;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect ? ctx.roundRect(x, y, w, h, 8) : ctx.rect(x, y, w, h);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = active ? VIZ_COLORS.bg : VIZ_COLORS.text;
  ctx.font = 'bold 14px Space Mono, monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(value, x + w / 2, y + h / 2);
  ctx.textBaseline = 'alphabetic';
}

function labelAbove(ctx, x, y, w, text) {
  ctx.fillStyle = VIZ_COLORS.accent || '#c6ff4a';
  ctx.font = '10px Space Mono, monospace';
  ctx.textAlign = 'center';
  ctx.fillText(text, x + w / 2, y - 8);
}

function setupStackQueueVisual(container, algoId) {
  const width = Math.min(container.clientWidth || 640, 640);
  const height = algoId === 'stack' ? 320 : 200;
  const canvas = document.createElement('canvas');
  container.appendChild(canvas);
  const ctx = fitCanvas(canvas, width, height);
  const steps = algoId === 'stack' ? stackSteps() : queueSteps();
  const context = algoId === 'stack'
    ? 'Operations on an empty stack: push(10), push(25), push(8), pop(), push(42), pop(), pop().'
    : 'Operations on an empty queue: enqueue(10), enqueue(25), enqueue(8), dequeue(), enqueue(42), dequeue(), dequeue().';
  return {
    steps,
    render: (step) => renderStackQueue(ctx, width, height, step, algoId === 'stack' ? 'stack' : 'queue'),
    context,
  };
}

// ---------------- Linked List ----------------

function linkedListSteps() {
  const steps = [];
  let list = [];
  function snap(highlight, message, phase) {
    steps.push({ list: list.slice(), highlight, message, phase });
  }
  snap(-1, 'Empty linked list.', 'init');
  list.push(10); snap(0, 'insertAtHead / Tail(10) — first node.', 'insertHead');
  list.push(20); snap(1, 'insertAtTail(20) — link to the end, update next.', 'insertTail');
  list.unshift(5); snap(0, 'insertAtHead(5) — insert at the front of the list.', 'insertHead');
  list.push(35); snap(list.length - 1, 'insertAtTail(35).', 'insertTail');
  for (let i = 0; i < list.length; i++) snap(i, `traverse — visiting node with value ${list[i]}.`, 'traverse');
  const delIndex = 2;
  const delVal = list[delIndex];
  list.splice(delIndex, 1);
  snap(delIndex - 1 >= 0 ? delIndex - 1 : 0, `delete(${delVal}) — relink next pointer, skip the node.`, 'delete');
  return steps;
}

function renderLinkedList(ctx, width, height, step) {
  ctx.clearRect(0, 0, width, height);
  const { list, highlight, message } = step;
  ctx.font = '12px Poppins, sans-serif';
  ctx.fillStyle = VIZ_COLORS.muted;
  ctx.textAlign = 'left';
  ctx.fillText(message || '', 4, 20);

  const boxW = 64, boxH = 44, gap = 40;
  const y = height / 2 - boxH / 2 + 10;
  const totalW = list.length * boxW + (list.length - 1) * gap;
  let startX = Math.max(10, width / 2 - totalW / 2);

  ctx.fillStyle = VIZ_COLORS.muted;
  ctx.font = '11px Space Mono, monospace';
  ctx.fillText('HEAD', startX, y - 12);

  for (let i = 0; i < list.length; i++) {
    const x = startX + i * (boxW + gap);
    drawBox(ctx, x, y, boxW, boxH, list[i], i === highlight);
    if (i < list.length - 1) {
      const arrowStart = x + boxW;
      const arrowEnd = x + boxW + gap;
      ctx.strokeStyle = VIZ_COLORS.muted;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(arrowStart, y + boxH / 2);
      ctx.lineTo(arrowEnd, y + boxH / 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(arrowEnd, y + boxH / 2);
      ctx.lineTo(arrowEnd - 7, y + boxH / 2 - 5);
      ctx.lineTo(arrowEnd - 7, y + boxH / 2 + 5);
      ctx.closePath();
      ctx.fillStyle = VIZ_COLORS.muted;
      ctx.fill();
    } else {
      ctx.fillStyle = VIZ_COLORS.muted;
      ctx.font = '11px Space Mono, monospace';
      ctx.textAlign = 'left';
      ctx.fillText('→ NULL', x + boxW + 8, y + boxH / 2 + 4);
    }
  }
}

function setupLinkedListVisual(container) {
  const width = Math.min(container.clientWidth || 640, 640);
  const height = 200;
  const canvas = document.createElement('canvas');
  container.appendChild(canvas);
  const ctx = fitCanvas(canvas, width, height);
  const steps = linkedListSteps();
  return {
    steps,
    render: (step) => renderLinkedList(ctx, width, height, step),
    context: 'Build a linked list: insert 10 then 20 at the tail, insert 5 at the head, insert 35 at the tail, traverse it, then delete the node with value 20.',
  };
}
