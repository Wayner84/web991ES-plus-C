const DEFAULT_MESSAGE_DURATION = 1800;
const FUNCTION_NAMES = new Set([
  "sin",
  "cos",
  "tan",
  "asin",
  "acos",
  "atan",
  "sqrt",
  "log",
  "ln",
  "inv"
]);

const CONSTANT_FACTORIES = {
  Ans: (ctx) => ctx.ans ?? 0,
  ans: (ctx) => ctx.ans ?? 0,
  M: (ctx) => ctx.memory ?? 0,
  m: (ctx) => ctx.memory ?? 0,
  π: () => Math.PI,
  pi: () => Math.PI,
  e: () => Math.E
};

export class CalculatorEngine {
  constructor() {
    this.tokens = [];
    this.cursor = 0;
    this.ans = 0;
    this.memory = 0;
    this.angleMode = "DEG";
    this.result = "";
    this.statusMessage = "";
    this.statusTimeout = null;
    this.shiftActive = false;
    this.alphaActive = false;
    this.history = [];
    this.historyIndex = -1;
  }

  resetAll() {
    this.tokens = [];
    this.cursor = 0;
    this.result = "";
    this.clearStatus();
  }

  clearStatus() {
    this.statusMessage = "";
  }

  setStatus(message, duration = DEFAULT_MESSAGE_DURATION) {
    this.statusMessage = message;
    if (this.statusTimeout) {
      clearTimeout(this.statusTimeout);
    }
    this.statusTimeout = setTimeout(() => {
      this.statusMessage = "";
    }, duration);
  }

  insertToken(value) {
    if (!value) return;
    this.tokens.splice(this.cursor, 0, value);
    this.cursor += 1;
    this.consumeShiftAlpha();
  }

  insertTokens(values) {
    if (!values || values.length === 0) return;
    values.forEach((token, index) => {
      this.tokens.splice(this.cursor + index, 0, token);
    });
    this.cursor += values.length;
    this.consumeShiftAlpha();
  }

  deleteLeft() {
    if (this.cursor === 0) return;
    this.tokens.splice(this.cursor - 1, 1);
    this.cursor -= 1;
    this.consumeShiftAlpha();
  }

  moveCursorLeft() {
    if (this.cursor > 0) {
      this.cursor -= 1;
    }
  }

  moveCursorRight() {
    if (this.cursor < this.tokens.length) {
      this.cursor += 1;
    }
  }

  clearExpression() {
    this.resetAll();
    this.setStatus("All Clear", 1200);
  }

  applySquare() {
    if (this.tokens.length === 0) return;
    this.insertTokens(["^", "2"]);
  }

  applyCube() {
    if (this.tokens.length === 0) return;
    this.insertTokens(["^", "3"]);
  }

  applyFactorial() {
    if (this.tokens.length === 0) return;
    this.insertToken("!");
  }

  toggleAngleMode() {
    this.angleMode = this.angleMode === "DEG" ? "RAD" : "DEG";
    this.setStatus(`${this.angleMode} mode`, 1500);
  }

  toggleShift() {
    this.shiftActive = true;
    this.alphaActive = false;
    this.setStatus("SHIFT", 1500);
  }

  toggleAlpha() {
    this.alphaActive = true;
    this.shiftActive = false;
    this.setStatus("ALPHA", 1500);
  }

  consumeShiftAlpha() {
    this.shiftActive = false;
    this.alphaActive = false;
  }

  negate() {
    this.insertToken("−");
  }

  handleStore() {
    try {
      const value = evaluateExpression(this.tokens.join(""), {
        ans: this.ans,
        memory: this.memory,
        angleMode: this.angleMode
      });
      if (Number.isFinite(value)) {
        this.memory = value;
        this.setStatus("Stored", 1200);
      } else {
        this.setStatus("Store Err", 1200);
      }
    } catch (error) {
      this.setStatus("Store Err", 1200);
    }
  }

  insertAns() {
    this.insertToken("Ans");
  }

  insertMemory() {
    this.insertToken("M");
  }

  replay(direction) {
    if (this.history.length === 0) {
      this.setStatus("No Replay", 1200);
      return;
    }
    if (direction < 0) {
      if (this.historyIndex < this.history.length - 1) {
        this.historyIndex += 1;
        const entry = this.history[this.history.length - 1 - this.historyIndex];
        this.tokens = [...entry.tokens];
        this.cursor = this.tokens.length;
        this.result = entry.result;
      }
    } else if (direction > 0) {
      if (this.historyIndex > 0) {
        this.historyIndex -= 1;
        const entry = this.history[this.history.length - 1 - this.historyIndex];
        this.tokens = [...entry.tokens];
        this.cursor = this.tokens.length;
        this.result = entry.result;
      } else if (this.historyIndex === 0) {
        this.historyIndex = -1;
        this.tokens = [];
        this.cursor = 0;
        this.result = "";
      }
    }
  }

  pushHistory(tokens, result) {
    this.history.push({ tokens: [...tokens], result });
    if (this.history.length > 50) {
      this.history.shift();
    }
    this.historyIndex = -1;
  }

  evaluate() {
    const expression = this.tokens.join("");
    if (!expression) {
      this.result = "0";
      return;
    }
    try {
      const value = evaluateExpression(expression, {
        ans: this.ans,
        memory: this.memory,
        angleMode: this.angleMode
      });
      if (!Number.isFinite(value)) {
        throw new Error("Invalid number");
      }
      const formatted = this.formatResult(value);
      this.result = formatted;
      this.ans = value;
      this.pushHistory(this.tokens, formatted);
    } catch (error) {
      this.result = "Error";
      this.setStatus("Math Error", 1500);
    }
  }

  formatResult(value) {
    if (!Number.isFinite(value)) {
      return "Error";
    }
    const absValue = Math.abs(value);
    if (absValue !== 0 && (absValue >= 1e10 || absValue < 1e-9)) {
      return value.toExponential(8);
    }
    const precise = Number.parseFloat(value.toPrecision(9));
    return `${precise}`;
  }

  getState() {
    const expression = this.tokens.join("");
    const cursorOffset = this.tokens.slice(0, this.cursor).join("").length;
    return {
      tokens: [...this.tokens],
      expression,
      cursorIndex: this.cursor,
      cursorOffset,
      result: this.result,
      angleMode: this.angleMode,
      status: this.statusMessage,
      shift: this.shiftActive,
      alpha: this.alphaActive
    };
  }
}

function evaluateExpression(expression, context) {
  const tokenizer = new Tokenizer(expression, context);
  const tokens = tokenizer.tokenize();
  const parser = new Parser(tokens);
  const rpn = parser.toRPN();
  const evaluator = new Evaluator(rpn, context);
  return evaluator.compute();
}

class Tokenizer {
  constructor(expression, context) {
    this.expression = expression;
    this.context = context;
    this.index = 0;
    this.length = expression.length;
    this.tokens = [];
    this.previousType = null;
  }

  tokenize() {
    while (this.index < this.length) {
      const rawChar = this.expression[this.index];
      const char = normalizeSymbol(rawChar);
      if (/\s/.test(char)) {
        this.index += 1;
        continue;
      }
      if (isDigit(char) || char === ".") {
        this.tokens.push({ type: "number", value: this.readNumber() });
        this.previousType = "number";
        continue;
      }
      if (isLetter(char)) {
        const identifier = this.readIdentifier();
        const constantFactory = CONSTANT_FACTORIES[identifier];
        if (constantFactory) {
          const value = constantFactory(this.context);
          this.tokens.push({ type: "number", value });
          this.previousType = "number";
        } else {
          const normalizedIdentifier = identifier.toLowerCase();
          if (!FUNCTION_NAMES.has(normalizedIdentifier)) {
            throw new Error(`Unknown function ${identifier}`);
          }
          this.tokens.push({ type: "function", value: normalizedIdentifier });
          this.previousType = "function";
        }
        continue;
      }
      if (char === "-" && this.shouldTreatAsUnary()) {
        this.tokens.push({ type: "number", value: 0 });
        this.tokens.push({ type: "operator", value: "-" });
        this.previousType = "operator";
        this.index += 1;
        continue;
      }
      if ("+-*/^".includes(char)) {
        this.tokens.push({ type: "operator", value: char });
        this.previousType = "operator";
        this.index += 1;
        continue;
      }
      if (char === "(") {
        this.tokens.push({ type: "leftParen", value: char });
        this.previousType = "leftParen";
        this.index += 1;
        continue;
      }
      if (char === ")") {
        this.tokens.push({ type: "rightParen", value: char });
        this.previousType = "rightParen";
        this.index += 1;
        continue;
      }
      if (char === ",") {
        this.tokens.push({ type: "comma", value: char });
        this.previousType = "comma";
        this.index += 1;
        continue;
      }
      if (char === "!") {
        this.tokens.push({ type: "operator", value: "!" });
        this.previousType = "operator";
        this.index += 1;
        continue;
      }
      throw new Error(`Unexpected character ${rawChar}`);
    }
    return this.tokens;
  }

  readNumber() {
    const start = this.index;
    while (this.index < this.length && /[0-9.]/.test(this.expression[this.index])) {
      this.index += 1;
    }
    if (this.index < this.length && (this.expression[this.index] === "E" || this.expression[this.index] === "e")) {
      this.index += 1;
      if (this.expression[this.index] === "+" || this.expression[this.index] === "-") {
        this.index += 1;
      }
      while (this.index < this.length && /[0-9]/.test(this.expression[this.index])) {
        this.index += 1;
      }
    }
    const slice = this.expression.slice(start, this.index);
    return Number(slice);
  }

  readIdentifier() {
    const start = this.index;
    while (this.index < this.length && isIdentifierChar(this.expression[this.index])) {
      this.index += 1;
    }
    const raw = this.expression.slice(start, this.index);
    return canonicalIdentifier(raw);
  }

  shouldTreatAsUnary() {
    return (
      this.previousType === null ||
      this.previousType === "operator" ||
      this.previousType === "leftParen" ||
      this.previousType === "comma"
    );
  }
}

class Parser {
  constructor(tokens) {
    this.tokens = tokens;
  }

  toRPN() {
    const output = [];
    const stack = [];
    for (const token of this.tokens) {
      switch (token.type) {
        case "number":
          output.push(token);
          break;
        case "function":
          stack.push(token);
          break;
        case "operator": {
          const op1 = operatorInfo(token.value);
          if (!op1) {
            throw new Error(`Unknown operator ${token.value}`);
          }
          while (stack.length) {
            const top = stack[stack.length - 1];
            if (top.type === "function") {
              output.push(stack.pop());
              continue;
            }
            if (top.type === "operator") {
              const op2 = operatorInfo(top.value);
              if (!op2) break;
              const shouldPop =
                (op1.associativity === "left" && op1.precedence <= op2.precedence) ||
                (op1.associativity === "right" && op1.precedence < op2.precedence);
              if (shouldPop) {
                output.push(stack.pop());
                continue;
              }
            }
            break;
          }
          stack.push({ type: "operator", value: token.value });
          break;
        }
        case "comma": {
          while (stack.length && stack[stack.length - 1].type !== "leftParen") {
            output.push(stack.pop());
          }
          break;
        }
        case "leftParen":
          stack.push(token);
          break;
        case "rightParen": {
          while (stack.length && stack[stack.length - 1].type !== "leftParen") {
            output.push(stack.pop());
          }
          if (!stack.length) {
            throw new Error("Mismatched parentheses");
          }
          stack.pop();
          if (stack.length && stack[stack.length - 1].type === "function") {
            output.push(stack.pop());
          }
          break;
        }
        default:
          throw new Error(`Unhandled token type ${token.type}`);
      }
    }
    while (stack.length) {
      const token = stack.pop();
      if (token.type === "leftParen" || token.type === "rightParen") {
        throw new Error("Mismatched parentheses");
      }
      output.push(token);
    }
    return output;
  }
}

class Evaluator {
  constructor(rpn, context) {
    this.rpn = rpn;
    this.context = context;
  }

  compute() {
    const stack = [];
    for (const token of this.rpn) {
      if (token.type === "number") {
        stack.push(token.value);
        continue;
      }
      if (token.type === "operator") {
        if (token.value === "!") {
          const operand = stack.pop();
          stack.push(factorial(operand));
          continue;
        }
        const b = stack.pop();
        const a = stack.pop();
        switch (token.value) {
          case "+":
            stack.push(a + b);
            break;
          case "-":
            stack.push(a - b);
            break;
          case "*":
            stack.push(a * b);
            break;
          case "/":
            stack.push(a / b);
            break;
          case "^":
            stack.push(Math.pow(a, b));
            break;
          default:
            throw new Error(`Unknown operator ${token.value}`);
        }
        continue;
      }
      if (token.type === "function") {
        const operand = stack.pop();
        stack.push(applyFunction(token.value, operand, this.context));
        continue;
      }
      throw new Error(`Unexpected token type ${token.type}`);
    }
    if (stack.length !== 1) {
      throw new Error("Invalid expression");
    }
    return stack[0];
  }
}

function operatorInfo(symbol) {
  switch (symbol) {
    case "+":
    case "-":
      return { precedence: 2, associativity: "left" };
    case "*":
    case "/":
      return { precedence: 3, associativity: "left" };
    case "^":
      return { precedence: 4, associativity: "right" };
    case "!":
      return { precedence: 5, associativity: "left" };
    default:
      return null;
  }
}

function applyFunction(name, operand, context) {
  switch (name) {
    case "sin":
      return Math.sin(applyAngle(operand, context.angleMode));
    case "cos":
      return Math.cos(applyAngle(operand, context.angleMode));
    case "tan":
      return Math.tan(applyAngle(operand, context.angleMode));
    case "asin":
      return revertAngle(Math.asin(operand), context.angleMode);
    case "acos":
      return revertAngle(Math.acos(operand), context.angleMode);
    case "atan":
      return revertAngle(Math.atan(operand), context.angleMode);
    case "ln":
      return Math.log(operand);
    case "log":
      return Math.log10(operand);
    case "sqrt":
      return Math.sqrt(operand);
    case "inv":
      return 1 / operand;
    default:
      throw new Error(`Unknown function ${name}`);
  }
}

function applyAngle(value, mode) {
  if (mode === "DEG") {
    return (value * Math.PI) / 180;
  }
  return value;
}

function revertAngle(value, mode) {
  if (mode === "DEG") {
    return (value * 180) / Math.PI;
  }
  return value;
}

function factorial(value) {
  if (value < 0) {
    throw new Error("Factorial negative");
  }
  if (!Number.isInteger(value)) {
    throw new Error("Factorial decimal");
  }
  let result = 1;
  for (let i = 2; i <= value; i += 1) {
    result *= i;
  }
  return result;
}

function normalizeSymbol(char) {
  switch (char) {
    case "×":
      return "*";
    case "÷":
      return "/";
    case "−":
      return "-";
    default:
      return char;
  }
}

function canonicalIdentifier(identifier) {
  const trimmed = identifier.trim();
  if (CONSTANT_FACTORIES[trimmed]) {
    return trimmed;
  }
  return trimmed.toLowerCase();
}

function isDigit(char) {
  return /[0-9]/.test(char);
}

function isLetter(char) {
  return /[A-Za-zπ]/.test(char);
}

function isIdentifierChar(char) {
  return /[A-Za-zπ]/.test(char);
}
