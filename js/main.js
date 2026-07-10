// UI wiring: grid rendering, category filter, modal + player controls.

const PLAY_ICON_SVG = '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';
const PAUSE_ICON_SVG = '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg>';

function setPlayButtonState(playing) {
  document.getElementById('viz-play').innerHTML = playing ? PAUSE_ICON_SVG : PLAY_ICON_SVG;
}

document.addEventListener('DOMContentLoaded', () => {
  renderAlgoGrid();
  wireCategoryFilter();
  wireModal();
  wireMisc();
});

function renderAlgoGrid() {
  const grid = document.getElementById('algo-grid');
  grid.innerHTML = '';
  ALGORITHMS.forEach((algo) => {
    const card = document.createElement('div');
    card.className = 'algo-card';
    card.dataset.category = algo.category;
    card.dataset.id = algo.id;
    card.innerHTML = `
      <div class="algo-card-top">
        <span class="algo-card-cat">${algo.categoryLabel}</span>
        <span class="algo-card-play">${PLAY_ICON_SVG}</span>
      </div>
      <h3>${algo.title}</h3>
      <p>${algo.desc}</p>
      <div class="algo-card-tags">${algo.tags.map((t) => `<span>${t}</span>`).join('')}</div>
    `;
    card.addEventListener('click', () => openModal(algo.id));
    grid.appendChild(card);
  });
}

function wireCategoryFilter() {
  const items = document.querySelectorAll('.service-item');
  items.forEach((item) => {
    item.addEventListener('click', () => {
      items.forEach((i) => i.classList.remove('active'));
      item.classList.add('active');
      filterGrid(item.dataset.category);
      document.getElementById('algorithms').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

function filterGrid(category) {
  document.querySelectorAll('.algo-card').forEach((card) => {
    card.classList.toggle('hidden', category && card.dataset.category !== category);
  });
}

// ---------------- Modal ----------------
let currentPlayer = null;
let currentAlgoId = null;
let currentLang = 'cpp';
let codePanel = null;
let copyResetTimer = null;

function wireModal() {
  const overlay = document.getElementById('modal-overlay');
  document.getElementById('modal-close').addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

  document.getElementById('viz-play').addEventListener('click', () => {
    if (!currentPlayer) return;
    const playing = currentPlayer.toggle();
    setPlayButtonState(playing);
  });
  document.getElementById('viz-reset').addEventListener('click', () => {
    if (!currentPlayer) return;
    currentPlayer.reset();
    setPlayButtonState(false);
  });
  document.getElementById('viz-step').addEventListener('click', () => {
    if (!currentPlayer) return;
    currentPlayer.pause();
    setPlayButtonState(false);
    currentPlayer.step();
  });
  document.getElementById('viz-speed-range').addEventListener('input', (e) => {
    if (currentPlayer) currentPlayer.setSpeed(e.target.value);
  });

  codePanel = createCodePanel(document.getElementById('code-lines'));

  document.getElementById('code-tab-cpp').addEventListener('click', () => switchCodeLang('cpp'));
  document.getElementById('code-tab-python').addEventListener('click', () => switchCodeLang('python'));

  document.getElementById('code-copy').addEventListener('click', async (e) => {
    const snippet = CODE_SNIPPETS[currentAlgoId];
    if (!snippet) return;
    try {
      await navigator.clipboard.writeText(snippet[currentLang]);
      const btn = e.currentTarget;
      btn.textContent = 'Copied!';
      btn.classList.add('copied');
      clearTimeout(copyResetTimer);
      copyResetTimer = setTimeout(() => {
        btn.textContent = 'Copy';
        btn.classList.remove('copied');
      }, 1500);
    } catch (err) {
      // Clipboard API unavailable — ignore silently.
    }
  });
}

function switchCodeLang(lang) {
  currentLang = lang;
  document.getElementById('code-tab-cpp').classList.toggle('active', lang === 'cpp');
  document.getElementById('code-tab-python').classList.toggle('active', lang === 'python');
  const snippet = CODE_SNIPPETS[currentAlgoId];
  if (!snippet) return;
  codePanel.render(snippet[lang], lang);
  if (currentPlayer) updateCodeHighlight(currentPlayer.steps[currentPlayer.index]);
}

function updateCodeHighlight(step) {
  const snippet = CODE_SNIPPETS[currentAlgoId];
  if (!snippet || !step) return;
  const lineNum = snippet.lines[currentLang][step.phase];
  codePanel.setActiveLine(lineNum);
}

function openModal(id) {
  const algo = ALGORITHMS.find((a) => a.id === id);
  if (!algo) return;

  document.getElementById('modal-category').textContent = algo.categoryLabel;
  document.getElementById('modal-title').textContent = algo.title;
  document.getElementById('modal-desc').textContent = algo.desc;
  document.getElementById('modal-time').textContent = algo.time;
  document.getElementById('modal-space').textContent = algo.space;

  const stepsList = document.getElementById('modal-steps');
  stepsList.innerHTML = algo.steps.map((s) => `<li>${s}</li>`).join('');

  const stage = document.getElementById('viz-stage');
  stage.innerHTML = '';

  if (currentPlayer) currentPlayer.destroy();

  // Open the modal (and let layout settle) *before* algo.setup() runs, since
  // several visualizers size their canvas from the container's clientWidth —
  // measuring it while the modal is still display:none would read 0 and fall
  // back to a fixed width, which then gets crushed to fit small screens.
  document.getElementById('modal-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';

  currentAlgoId = id;
  currentLang = 'cpp';
  document.getElementById('code-tab-cpp').classList.add('active');
  document.getElementById('code-tab-python').classList.remove('active');
  const snippet = CODE_SNIPPETS[id];
  if (snippet) codePanel.render(snippet.cpp, 'cpp');

  const { steps, render, context } = algo.setup(stage);
  document.getElementById('modal-context').textContent = context || '';
  const progressText = document.getElementById('viz-progress-text');
  currentPlayer = new StepPlayer({
    steps,
    render: (step, index, total) => {
      render(step, index, total);
      updateCodeHighlight(step);
    },
    onProgress: (i, total) => { progressText.textContent = `${i + 1} / ${total}`; },
  });
  setPlayButtonState(false);
  document.getElementById('viz-speed-range').value = 5;
  currentPlayer.setSpeed(5);
  currentPlayer.goto(0);
}

function closeModal() {
  document.getElementById('modal-overlay').classList.remove('open');
  document.body.style.overflow = '';
  if (currentPlayer) { currentPlayer.destroy(); currentPlayer = null; }
}

// ---------------- Misc buttons ----------------
function wireMisc() {
  document.getElementById('btn-collab')?.addEventListener('click', () => {
    document.querySelectorAll('.service-item').forEach((i) => i.classList.remove('active'));
    filterGrid(null);
    document.getElementById('algorithms').scrollIntoView({ behavior: 'smooth' });
  });
}
