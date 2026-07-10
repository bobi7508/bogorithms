// N-Queens — classic backtracking demo (first solution found, board 5x5).

function nQueensSteps(n = 5) {
  const board = Array.from({ length: n }, () => Array(n).fill(0));
  const steps = [];

  function snapshot(tryCell, status, message) {
    steps.push({ board: board.map((r) => r.slice()), tryCell, status, message, phase: status });
  }

  function isSafe(row, col) {
    for (let r = 0; r < row; r++) {
      if (board[r][col] === 1) return false;
      const dc = col - (row - r);
      if (dc >= 0 && board[r][dc] === 1) return false;
      const dc2 = col + (row - r);
      if (dc2 < n && board[r][dc2] === 1) return false;
    }
    return true;
  }

  function solve(row) {
    if (row === n) {
      snapshot(null, 'done', `Placed all ${n} queens with none attacking each other!`);
      return true;
    }
    for (let col = 0; col < n; col++) {
      snapshot([row, col], 'try', `Trying to place a queen at row ${row}, column ${col}...`);
      if (isSafe(row, col)) {
        board[row][col] = 1;
        snapshot([row, col], 'place', `Safe → place a queen at (${row}, ${col}).`);
        if (solve(row + 1)) return true;
        board[row][col] = 0;
        snapshot([row, col], 'backtrack', `Dead end ahead → backtrack, remove the queen at (${row}, ${col}).`);
      } else {
        snapshot([row, col], 'conflict', `Attacked along a column/diagonal → can't place at (${row}, ${col}).`);
      }
    }
    return false;
  }
  solve(0);
  return steps;
}

function renderNQueens(ctx, size, step) {
  const n = step.board.length;
  ctx.clearRect(0, 0, size, size + 30);
  const cell = size / n;

  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      let fill = (r + c) % 2 === 0 ? '#232326' : '#1a1a1d';
      if (step.tryCell && step.tryCell[0] === r && step.tryCell[1] === c) {
        if (step.status === 'try') fill = VIZ_COLORS.compare;
        else if (step.status === 'place') fill = VIZ_COLORS.barSorted;
        else if (step.status === 'conflict') fill = '#ff6b6b';
        else if (step.status === 'backtrack') fill = '#ff9d4a';
      }
      ctx.fillStyle = fill;
      ctx.fillRect(c * cell, r * cell, cell, cell);
      ctx.strokeStyle = VIZ_COLORS.nodeBorder;
      ctx.strokeRect(c * cell, r * cell, cell, cell);
      if (step.board[r][c] === 1) {
        ctx.fillStyle = '#0d0d0f';
        ctx.font = `${cell * 0.5}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('♛', c * cell + cell / 2, r * cell + cell / 2 + 2);
        ctx.textBaseline = 'alphabetic';
      }
    }
  }

  ctx.fillStyle = VIZ_COLORS.muted;
  ctx.font = '12px Poppins, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(step.message || '', 4, size + 20);
}

function setupNQueensVisual(container) {
  const size = Math.min(container.clientWidth || 400, 360);
  const canvas = document.createElement('canvas');
  container.appendChild(canvas);
  const ctx = fitCanvas(canvas, size, size + 30);
  const n = 5;
  const steps = nQueensSteps(n);
  return {
    steps,
    render: (step) => renderNQueens(ctx, size, step),
    context: `Place n = ${n} queens on a ${n}×${n} board so that no two queens attack each other.`,
  };
}
