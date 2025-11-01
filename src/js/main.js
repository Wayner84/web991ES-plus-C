import { KEY_ROWS, KEYBOARD_MAP } from "./ui/keys.js";
import { Display } from "./ui/display.js";
import { CalculatorEngine } from "./core/engine.js";

const keypad = document.getElementById("keypad");
const canvas = document.getElementById("lcd");

const display = new Display(canvas);
const engine = new CalculatorEngine();
const buttons = new Map();

function createKeyElement(definition) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "keypad__key";
  button.dataset.keyId = definition.id;
  if (definition.color) {
    button.dataset.color = definition.color;
  }
  if (definition.width) {
    button.style.gridColumn = `span ${definition.width}`;
  }

  if (definition.secondary) {
    const secondary = document.createElement("span");
    secondary.className = "key__secondary";
    secondary.textContent = definition.secondary;
    button.appendChild(secondary);
  }

  const primary = document.createElement("span");
  primary.className = "key__primary";
  primary.textContent = definition.primary;
  button.appendChild(primary);

  if (definition.tertiary) {
    const tertiary = document.createElement("span");
    tertiary.className = "key__tertiary";
    tertiary.textContent = definition.tertiary;
    button.appendChild(tertiary);
  }

  button.addEventListener("pointerdown", (event) => {
    button.setPointerCapture?.(event.pointerId);
    button.classList.add("is-pressed");
  });

  const release = (event) => {
    if (event?.pointerId !== undefined) {
      button.releasePointerCapture?.(event.pointerId);
    }
    button.classList.remove("is-pressed");
  };
  button.addEventListener("pointerup", release);
  button.addEventListener("pointercancel", release);
  button.addEventListener("pointerleave", release);

  button.addEventListener("click", () => {
    handleAction(definition);
  });

  return button;
}

function renderKeypad() {
  KEY_ROWS.forEach((row) => {
    row.forEach((definition) => {
      const element = createKeyElement(definition);
      keypad.appendChild(element);
      buttons.set(definition.id, { definition, element });
    });
  });
}

function handleAction(definition) {
  switch (definition.action) {
    case "insert":
      engine.insertToken(definition.value);
      break;
    case "square":
      engine.applySquare();
      break;
    case "cube":
      engine.applyCube();
      break;
    case "factorial":
      engine.applyFactorial();
      break;
    case "toggleAngle":
      engine.toggleAngleMode();
      break;
    case "shift":
      engine.toggleShift();
      break;
    case "alpha":
      engine.toggleAlpha();
      break;
    case "delete":
      engine.deleteLeft();
      break;
    case "clear":
    case "ac":
      engine.clearExpression();
      break;
    case "equals":
      engine.evaluate();
      break;
    case "left":
      engine.moveCursorLeft();
      break;
    case "right":
      engine.moveCursorRight();
      break;
    case "up":
      engine.replay(-1);
      break;
    case "down":
      engine.replay(1);
      break;
    case "negate":
      engine.negate();
      break;
    case "store":
      engine.handleStore();
      break;
    case "calc":
      engine.setStatus("CALC stub", 1200);
      break;
    case "solve":
      engine.setStatus("SOLVE stub", 1200);
      break;
    case "mode":
      engine.setStatus("MODE stub", 1200);
      break;
    default:
      break;
  }
  refresh();
}

function refresh() {
  display.render(engine.getState());
}

function highlightKey(keyId) {
  const entry = buttons.get(keyId);
  if (!entry) return;
  entry.element.classList.add("is-pressed");
  handleAction(entry.definition);
}

function releaseKey(keyId) {
  const entry = buttons.get(keyId);
  if (!entry) return;
  entry.element.classList.remove("is-pressed");
}

document.addEventListener("keydown", (event) => {
  const keyId = KEYBOARD_MAP[event.key];
  if (!keyId) return;
  event.preventDefault();
  highlightKey(keyId);
});

document.addEventListener("keyup", (event) => {
  const keyId = KEYBOARD_MAP[event.key];
  if (!keyId) return;
  releaseKey(keyId);
});

renderKeypad();
refresh();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker?.register("../sw.js").catch(() => {
      // ignore registration failure
    });
  });
}
