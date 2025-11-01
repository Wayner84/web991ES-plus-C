Agents Overview
---------------

This repository uses modular AI “agents” to design, verify, and refine the emulator’s components.

Agents
------
UI Layout Agent:
  Maps the physical key layout to a digital grid, ensuring accurate positioning and scaling for iPhone screens.

Display Agent:
  Recreates the two-line pixel LCD display using Canvas or SVG; handles formula parsing and cursor navigation.

Logic Core Agent:
  Implements the calculator engine (parser, evaluator, trigonometric functions, statistical modes).

Input Mapper Agent:
  Translates keypresses and touch events into logic-core actions, replicating Casio’s cursor behavior.

Physics Agent:
  Handles button press animation, depress/release timing, and optional vibration feedback.

QA Agent:
  Compares emulator results with a physical 991ES Plus C to verify output accuracy for test expressions.

Deployment Agent:
  Automates build and GitHub Pages deployment, checking responsiveness and PWA manifest correctness.

Collaboration Flow
------------------
1. UI Layout Agent defines button grid
2. Display Agent renders screen
3. Logic Core Agent interprets input
4. QA Agent validates results
5. Deployment Agent publishes to Pages

Each agent’s behavior can be refined in codex_prompt.txt
