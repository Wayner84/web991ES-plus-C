const LCD_BACKGROUND = "#cdeccb";
const LCD_BORDER = "#9fb89d";
const TEXT_COLOR = "#142214";
const FAINT_TEXT = "#516452";

export class Display {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.pixelRatio = window.devicePixelRatio || 1;
    this.lastState = {
      expression: "",
      cursorOffset: 0,
      result: "",
      angleMode: "DEG",
      status: "",
      shift: false,
      alpha: false
    };
    this.resize = this.resize.bind(this);
    window.addEventListener("resize", this.resize);
    this.resize();
  }

  resize() {
    const ratio = window.devicePixelRatio || 1;
    this.pixelRatio = ratio;
    const rect = this.canvas.getBoundingClientRect();
    const width = rect.width || this.canvas.width;
    const height = rect.height || this.canvas.height;
    this.canvas.width = Math.round(width * ratio);
    this.canvas.height = Math.round(height * ratio);
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.scale(ratio, ratio);
    this.render(this.lastState);
  }

  render(state) {
    if (!state) return;
    this.lastState = { ...this.lastState, ...state };
    const ctx = this.ctx;
    const width = this.canvas.width / this.pixelRatio;
    const height = this.canvas.height / this.pixelRatio;

    ctx.clearRect(0, 0, width, height);

    ctx.fillStyle = LCD_BACKGROUND;
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = LCD_BORDER;
    ctx.lineWidth = 3;
    ctx.strokeRect(1.5, 1.5, width - 3, height - 3);

    this.drawStatusBar(ctx, width);
    this.drawExpression(ctx, width);
    this.drawResult(ctx, width, height);
  }

  drawStatusBar(ctx, width) {
    const { angleMode, status, shift, alpha } = this.lastState;
    ctx.fillStyle = FAINT_TEXT;
    ctx.font = "14px 'Calculator', monospace";
    ctx.fillText(angleMode, 14, 20);

    const indicators = [];
    if (shift) indicators.push("SHIFT");
    if (alpha) indicators.push("ALPHA");
    if (status) indicators.push(status);
    if (indicators.length) {
      const text = indicators.join("  ");
      const textWidth = ctx.measureText(text).width;
      ctx.fillText(text, width - textWidth - 14, 20);
    }
  }

  drawExpression(ctx, width) {
    const { expression, cursorOffset } = this.lastState;
    const displayExpression = expression || "0";
    ctx.fillStyle = TEXT_COLOR;
    ctx.font = "26px 'Calculator', monospace";
    const padding = 16;
    const y = 58;

    this.wrapText(ctx, displayExpression, padding, y, width - padding * 2);

    const cursorX = padding + ctx.measureText(displayExpression.slice(0, cursorOffset)).width;
    ctx.fillStyle = TEXT_COLOR;
    ctx.fillRect(cursorX, y + 6, 2, 26);
  }

  drawResult(ctx, width, height) {
    const { result } = this.lastState;
    if (!result) return;
    ctx.fillStyle = TEXT_COLOR;
    ctx.font = "34px 'Calculator', monospace";
    const padding = 16;
    const textWidth = ctx.measureText(result).width;
    ctx.fillText(result, width - textWidth - padding, height - 22);
  }

  wrapText(ctx, text, x, y, maxWidth) {
    if (ctx.measureText(text).width <= maxWidth) {
      ctx.fillText(text, x, y);
      return;
    }
    let currentX = x;
    for (const char of text) {
      const widthChar = ctx.measureText(char).width;
      if (currentX + widthChar > x + maxWidth) {
        y += 26;
        currentX = x;
      }
      ctx.fillText(char, currentX, y);
      currentX += widthChar;
    }
  }
}
