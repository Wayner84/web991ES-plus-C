Casio fx-991ES Plus C Web Emulator
----------------------------------

An accurate, responsive web emulation of the Casio fx-991ES Plus C scientific calculator — built entirely in HTML, CSS, and JavaScript, deployed on GitHub Pages, and designed to fit perfectly on an iPhone screen.

Purpose
-------
To faithfully replicate the appearance, layout, and functionality of the Casio fx-991ES Plus C calculator:
- Pixel-accurate display with formula input and two-line output.
- All scientific, statistical, and equation modes.
- Correct key positions and navigation (arrows, SHIFT, ALPHA, MODE, etc.).
- Mobile-first design: behaves and feels like the real calculator on iPhone Safari.

Structure
---------
/src                Source files (HTML, CSS, JS, assets)
/src/js/core        Calculator logic (parser, evaluator, memory, solver)
/src/js/ui          Rendering engine and button mapping
/src/assets         SVG or PNG icons for keycaps and display pixels
/docs               Screenshots and deployment assets

Tech Stack
----------
- Vanilla JS for precision and portability
- Canvas 2D or SVG for the LCD pixel display
- Flexbox and Grid for button layout
- LocalStorage to persist memory and mode
- PWA manifest for installable app behavior

Running Locally
---------------
git clone https://github.com/<your-username>/Casio-991ES-PlusC.git
cd Casio-991ES-PlusC
npm install      (optional if using bundler)
npm run dev      (or open index.html directly)
Open http://localhost:3000 or open index.html in your browser.

Deploying to GitHub Pages
-------------------------
1. Push to main branch.
2. In Settings → Pages, choose the root folder.
3. Wait for GitHub Pages to publish.
4. Open https://<your-username>.github.io/Casio-991ES-PlusC/

Controls
--------
SHIFT / ALPHA     Toggle secondary / tertiary functions
MODE              Cycle calculator modes
→ ↑ ↓ ←           Move cursor within display
AC                Clear all
DEL               Delete single character
CALC / SOLVE / STAT  Enter special modes
x², √, sin, cos, tan, log, ln  Standard scientific operations
Ans, M+, M-, STO, RCL  Memory functions
= or EXE          Evaluate expression

Each key is defined in /src/js/ui/keys.js with coordinates, label, and behavior.

Future Improvements
-------------------
- Symbolic CAS engine (optional)
- Matrix/vector entry
- Complex number support
- Precise firmware quirks replication
- Haptic feedback on iOS

License
-------
MIT License © 2025 Wayne Townsend
