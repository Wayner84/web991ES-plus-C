export const KEY_ROWS = [
  [
    { id: "shift", primary: "SHIFT", color: "orange", action: "shift" },
    { id: "alpha", primary: "ALPHA", color: "red", action: "alpha" },
    { id: "mode", primary: "MODE", secondary: "SETUP", action: "mode", width: 2 },
    { id: "on", primary: "ON", color: "dark", action: "ac" },
    { id: "calc", primary: "CALC", action: "calc" },
    { id: "solve", primary: "SOLVE", action: "solve" }
  ],
  [
    { id: "inv", primary: "x⁻¹", action: "insert", value: "inv(" },
    { id: "log", primary: "log", action: "insert", value: "log(" },
    { id: "ln", primary: "ln", action: "insert", value: "ln(" },
    { id: "sin", primary: "sin", action: "insert", value: "sin(" },
    { id: "cos", primary: "cos", action: "insert", value: "cos(" },
    { id: "tan", primary: "tan", action: "insert", value: "tan(" }
  ],
  [
    { id: "sqrt", primary: "√", action: "insert", value: "sqrt(" },
    { id: "square", primary: "x²", action: "square" },
    { id: "cube", primary: "x³", action: "cube" },
    { id: "power", primary: "x^y", action: "insert", value: "^" },
    { id: "pi", primary: "π", action: "insert", value: "π" },
    { id: "econst", primary: "e", action: "insert", value: "e" }
  ],
  [
    { id: "asin", primary: "sin⁻¹", action: "insert", value: "asin(" },
    { id: "acos", primary: "cos⁻¹", action: "insert", value: "acos(" },
    { id: "atan", primary: "tan⁻¹", action: "insert", value: "atan(" },
    { id: "drg", primary: "DRG", action: "toggleAngle" },
    { id: "lparen", primary: "(", action: "insert", value: "(" },
    { id: "rparen", primary: ")", action: "insert", value: ")" }
  ],
  [
    { id: "fact", primary: "x!", action: "factorial" },
    { id: "seven", primary: "7", action: "insert", value: "7" },
    { id: "eight", primary: "8", action: "insert", value: "8" },
    { id: "nine", primary: "9", action: "insert", value: "9" },
    { id: "del", primary: "DEL", action: "delete" },
    { id: "ac", primary: "AC", action: "clear" }
  ],
  [
    { id: "powerKey", primary: "^", action: "insert", value: "^" },
    { id: "four", primary: "4", action: "insert", value: "4" },
    { id: "five", primary: "5", action: "insert", value: "5" },
    { id: "six", primary: "6", action: "insert", value: "6" },
    { id: "multiply", primary: "×", action: "insert", value: "×" },
    { id: "divide", primary: "÷", action: "insert", value: "÷" }
  ],
  [
    { id: "ans", primary: "Ans", action: "insert", value: "Ans" },
    { id: "one", primary: "1", action: "insert", value: "1" },
    { id: "two", primary: "2", action: "insert", value: "2" },
    { id: "three", primary: "3", action: "insert", value: "3" },
    { id: "add", primary: "+", action: "insert", value: "+" },
    { id: "subtract", primary: "−", action: "insert", value: "−" }
  ],
  [
    { id: "memory", primary: "M", action: "insert", value: "M" },
    { id: "zero", primary: "0", action: "insert", value: "0" },
    { id: "decimal", primary: ".", action: "insert", value: "." },
    { id: "exp", primary: "EXP", action: "insert", value: "E" },
    { id: "comma", primary: ",", action: "insert", value: "," },
    { id: "equals", primary: "=", color: "dark", action: "equals" }
  ],
  [
    { id: "left", primary: "◄", action: "left" },
    { id: "right", primary: "►", action: "right" },
    { id: "up", primary: "▲", action: "up" },
    { id: "down", primary: "▼", action: "down" },
    { id: "neg", primary: "(-)", action: "negate" },
    { id: "store", primary: "STO", action: "store" }
  ]
];

export const KEYBOARD_MAP = {
  "0": "zero",
  "1": "one",
  "2": "two",
  "3": "three",
  "4": "four",
  "5": "five",
  "6": "six",
  "7": "seven",
  "8": "eight",
  "9": "nine",
  ".": "decimal",
  ",": "comma",
  "+": "add",
  "-": "subtract",
  "*": "multiply",
  "x": "multiply",
  "X": "multiply",
  "/": "divide",
  "^": "powerKey",
  "(": "lparen",
  ")": "rparen",
  "[": "lparen",
  "]": "rparen",
  "Enter": "equals",
  "Return": "equals",
  "Backspace": "del",
  "Delete": "del",
  "Escape": "ac",
  "ArrowLeft": "left",
  "ArrowRight": "right",
  "ArrowUp": "up",
  "ArrowDown": "down"
};
