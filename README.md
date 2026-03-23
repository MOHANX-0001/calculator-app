# 🧮 Calculator

A sleek, responsive calculator built with vanilla HTML, CSS, and JavaScript — no frameworks, no dependencies.

---

## ✨ Features

- **Basic arithmetic** — addition, subtraction, multiplication, division
- **Utility functions** — percentage (`%`), negate (`+/−`), backspace (`⌫`)
- **Expression display** — shows the running expression above the result (e.g. `12 × 5 =`)
- **Chained operations** — tap an operator right after another to chain calculations seamlessly
- **Smart formatting** — auto-switches to exponential notation for very large/small numbers
- **Floating-point fix** — uses `toPrecision(12)` to avoid results like `0.1 + 0.2 = 0.30000000000000004`
- **Dynamic font scaling** — display shrinks gracefully as the number grows longer
- **Pop animation** — subtle scale animation on each result
- **Ripple effect** — Material-style ripple on every button press
- **Full keyboard support** — use your physical keyboard to operate the calculator
- **Responsive design** — adapts cleanly to mobile screens

---

## 🗂 Project Structure

```
calculator/
├── index.html   # Markup and button layout
├── script.js    # All calculator logic and event handling
└── style.css    # Styling, animations, and theming
```

---

## 🚀 Getting Started

No build step required. Just open `index.html` in any modern browser:

```bash
# Option 1 – double-click index.html in your file manager

# Option 2 – serve locally with Python
python3 -m http.server 8080
# then open http://localhost:8080

# Option 3 – VS Code Live Server extension → click "Go Live"
```

---

## ⌨️ Keyboard Shortcuts

| Key                  | Action           |
|----------------------|------------------|
| `0` – `9`            | Enter digit      |
| `.`                  | Decimal point    |
| `+` `-` `*` `/`      | Operators        |
| `Enter` or `=`       | Calculate        |
| `Backspace`          | Delete last digit|
| `Escape`             | Clear (AC)       |
| `%`                  | Percentage       |

---

## 🎨 Design Tokens (CSS Variables)

Easily re-theme the calculator by editing these variables in `style.css`:

```css
:root {
  --bg:        #0d0d0f;     /* page background */
  --surface:   #18181c;     /* calculator body */
  --btn-num:   #1e1e23;     /* number buttons  */
  --btn-fn:    #252530;     /* function buttons */
  --accent:    #e2c97e;     /* gold accent (= button, operators) */
  --text:      #f4f4f5;     /* primary text */
  --text-dim:  #6b6b7a;     /* expression / secondary text */
  --radius:    28px;        /* button border radius */
  --btn-size:  80px;        /* button height */
  --gap:       14px;        /* grid gap */
}
```

---

## 🛠 How It Works

### State machine (`script.js`)

All calculator state lives in a single object:

```js
const state = {
  current:  '0',   // what's shown on the display
  previous: '',    // operand before the operator
  operator: '',    // pending operator (+, -, *, /)
  reset:    false, // next keypress should replace display
  justCalc: false, // result was just shown (for chaining)
};
```

### Button events

Buttons use **data attributes** (`data-action`, `data-value`) instead of inline `onclick` handlers. A single delegated listener on the `.buttons` container handles all clicks — cleaner and more maintainable.

### Ripple animation

Each click spawns a `<span class="ripple">` positioned at the exact click coordinates, animates outward, then removes itself — no library needed.

---

## 📱 Browser Support

Works in all modern browsers (Chrome, Firefox, Safari, Edge). No polyfills required.

---

## 📄 License

MIT — free to use, modify, and distribute.

Testing PR for collaboration
