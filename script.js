// ─── State ───────────────────────────────────────────────────────────────────
const state = {
  current:  '0',
  previous: '',
  operator: '',
  reset:    false,   // next digit press clears display
  justCalc: false,   // result just shown
};

// ─── DOM refs ─────────────────────────────────────────────────────────────────
const displayEl    = document.getElementById('display');
const expressionEl = document.getElementById('expression');

// ─── Display ──────────────────────────────────────────────────────────────────
function updateDisplay(animate = false) {
  let val = state.current;

  // Auto-format large numbers into exponential
  if (val !== 'Error' && val.replace('-', '').replace('.', '').length > 12) {
    val = parseFloat(val).toExponential(5);
  }

  // Shrink font for long values
  const len = val.length;
  displayEl.style.fontSize =
    len > 14 ? '2.2rem' :
    len > 10 ? '3rem'   :
    len > 7  ? '4rem'   : '5rem';

  if (animate) {
    displayEl.classList.remove('pop');
    // Force reflow
    void displayEl.offsetWidth;
    displayEl.classList.add('pop');
  }

  displayEl.textContent = val;
}

function updateExpression() {
  if (!state.operator || state.previous === '') {
    expressionEl.textContent = '';
    return;
  }
  const opSymbol = { '+': '+', '-': '−', '*': '×', '/': '÷' }[state.operator] ?? state.operator;
  expressionEl.textContent = `${state.previous} ${opSymbol}`;
}

// ─── Core operations ──────────────────────────────────────────────────────────
function appendNumber(num) {
  if (state.reset || state.justCalc) {
    state.current = num;
    state.reset    = false;
    state.justCalc = false;
  } else {
    if (state.current.length >= 13) return;
    state.current =
      state.current === '0' ? num : state.current + num;
  }
  updateDisplay();
}

function appendDecimal() {
  if (state.reset || state.justCalc) {
    state.current  = '0.';
    state.reset    = false;
    state.justCalc = false;
  } else if (!state.current.includes('.')) {
    state.current += '.';
  }
  updateDisplay();
}

function appendOperator(op) {
  // Chain: calculate first if there's a pending operation
  if (state.operator && !state.reset) {
    calculate(false);
  }
  state.previous = state.current;
  state.operator = op;
  state.reset    = true;
  state.justCalc = false;
  updateExpression();
}

function calculate(triggerAnim = true) {
  if (!state.operator || state.reset) return;

  const prev = parseFloat(state.previous);
  const curr = parseFloat(state.current);
  let result;

  switch (state.operator) {
    case '+': result = prev + curr; break;
    case '-': result = prev - curr; break;
    case '*': result = prev * curr; break;
    case '/':
      result = curr !== 0 ? prev / curr : 'Error';
      break;
    default: return;
  }

  // Build expression string before clearing operator
  const opSymbol = { '+': '+', '-': '−', '*': '×', '/': '÷' }[state.operator];
  expressionEl.textContent = `${state.previous} ${opSymbol} ${state.current} =`;

  state.current  = result === 'Error' ? 'Error' : formatResult(result);
  state.operator = '';
  state.previous = '';
  state.reset    = false;
  state.justCalc = true;

  updateDisplay(triggerAnim);
}

function clearDisplay() {
  Object.assign(state, { current: '0', previous: '', operator: '', reset: false, justCalc: false });
  expressionEl.textContent = '';
  updateDisplay();
}

function deleteLast() {
  if (state.justCalc || state.current === 'Error') {
    clearDisplay(); return;
  }
  state.current = state.current.length > 1 ? state.current.slice(0, -1) : '0';
  updateDisplay();
}

function percentage() {
  if (state.current === 'Error') return;
  state.current    = formatResult(parseFloat(state.current) / 100);
  state.justCalc   = false;
  updateDisplay(true);
}

function negate() {
  if (state.current === '0' || state.current === 'Error') return;
  state.current = state.current.startsWith('-')
    ? state.current.slice(1)
    : '-' + state.current;
  updateDisplay(true);
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function formatResult(num) {
  // Avoid floating-point noise like 0.1 + 0.2 = 0.30000000000000004
  const s = parseFloat(num.toPrecision(12)).toString();
  return s;
}

// ─── Button wiring ────────────────────────────────────────────────────────────
document.querySelector('.buttons').addEventListener('click', e => {
  const btn = e.target.closest('button');
  if (!btn) return;

  ripple(btn, e);
  flash(btn);

  const { action, value } = btn.dataset;
  switch (action) {
    case 'number':   appendNumber(value);   break;
    case 'decimal':  appendDecimal();       break;
    case 'operator': appendOperator(value); break;
    case 'equals':   calculate();           break;
    case 'clear':    clearDisplay();        break;
    case 'percent':  percentage();          break;
    case 'negate':   negate();              break;
  }
});

document.getElementById('backspaceBtn').addEventListener('click', e => {
  ripple(e.currentTarget, e);
  flash(e.currentTarget);
  deleteLast();
});

// ─── Animations ──────────────────────────────────────────────────────────────
function ripple(btn, e) {
  const r   = btn.getBoundingClientRect();
  const dot = document.createElement('span');
  dot.className = 'ripple';
  const size = Math.max(r.width, r.height);
  dot.style.cssText = `
    width:${size}px; height:${size}px;
    left:${e.clientX - r.left - size / 2}px;
    top:${e.clientY - r.top  - size / 2}px;
  `;
  btn.appendChild(dot);
  dot.addEventListener('animationend', () => dot.remove());
}

function flash(btn) {
  btn.classList.add('active');
  setTimeout(() => btn.classList.remove('active'), 180);
}

// ─── Keyboard support ────────────────────────────────────────────────────────
document.addEventListener('keydown', e => {
  const key = e.key;
  let sel = null;

  if (key >= '0' && key <= '9') {
    appendNumber(key);
    sel = [...document.querySelectorAll('[data-value]')].find(b => b.dataset.value === key);
  } else if (key === '.') {
    appendDecimal();
    sel = document.querySelector('[data-action="decimal"]');
  } else if (['+', '-', '*', '/'].includes(key)) {
    e.preventDefault();
    appendOperator(key);
    sel = document.querySelector(`[data-value="${key}"]`);
  } else if (key === 'Enter' || key === '=') {
    e.preventDefault();
    calculate();
    sel = document.querySelector('.equals');
  } else if (key === 'Escape') {
    clearDisplay();
    sel = document.querySelector('[data-action="clear"]');
  } else if (key === 'Backspace') {
    e.preventDefault();
    deleteLast();
    sel = document.getElementById('backspaceBtn');
  } else if (key === '%') {
    percentage();
    sel = document.querySelector('[data-action="percent"]');
  }

  if (sel) flash(sel);
});
