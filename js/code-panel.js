// Minimal syntax highlighting + line-by-line rendering for the code panel.
// Keeps its own DOM so main.js just calls render()/setActiveLine()/getCode().

const CPP_KEYWORDS = new Set([
  'void', 'int', 'bool', 'for', 'while', 'if', 'else', 'else if', 'return',
  'vector', 'queue', 'deque', 'struct', 'class', 'public', 'private', 'new',
  'nullptr', 'true', 'false', 'auto', 'INT_MAX', 'pair', 'using', 'namespace',
  'static', 'break', 'continue', 'size_t', 'const',
]);
const PY_KEYWORDS = new Set([
  'def', 'if', 'elif', 'else', 'for', 'while', 'return', 'class', 'import',
  'from', 'in', 'not', 'None', 'True', 'False', 'and', 'or', 'lambda',
  'break', 'continue', 'self', 'range', 'len',
]);

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function highlightCodeLine(line, lang) {
  const keywords = lang === 'cpp' ? CPP_KEYWORDS : PY_KEYWORDS;
  let html = escapeHtml(line);
  html = html.replace(/\b([A-Za-z_][A-Za-z0-9_]*)\b/g, (m) => (
    keywords.has(m) ? `<span class="tok-kw">${m}</span>` : m
  ));
  html = html.replace(/\b(\d+)\b/g, '<span class="tok-num">$1</span>');
  return html || '&nbsp;';
}

function createCodePanel(container) {
  const lineEls = [];
  let activeLine = null;

  function render(code, lang) {
    container.innerHTML = '';
    lineEls.length = 0;
    const lines = code.split('\n');
    lines.forEach((line, i) => {
      const row = document.createElement('div');
      row.className = 'code-line';
      row.dataset.ln = i + 1;

      const num = document.createElement('span');
      num.className = 'code-ln-num';
      num.textContent = i + 1;

      const text = document.createElement('span');
      text.className = 'code-ln-text';
      text.innerHTML = highlightCodeLine(line, lang);

      row.appendChild(num);
      row.appendChild(text);
      container.appendChild(row);
      lineEls.push(row);
    });
    activeLine = null;
  }

  function setActiveLine(lineNum) {
    if (activeLine !== null && lineEls[activeLine - 1]) {
      lineEls[activeLine - 1].classList.remove('active');
    }
    activeLine = lineNum || null;
    if (activeLine && lineEls[activeLine - 1]) {
      const el = lineEls[activeLine - 1];
      el.classList.add('active');
      el.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }
  }

  return { render, setActiveLine };
}
