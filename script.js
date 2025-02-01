// DOM Elements
const buttonsContainer = document.querySelector('.buttons-container');
const increaseFontBtn = document.getElementById('increase-font');
const decreaseFontBtn = document.getElementById('decrease-font');
const toggleContrastBtn = document.getElementById('toggle-contrast');
const resetAllBtn = document.getElementById('reset-all');
const toggleInstructionsBtn = document.getElementById('toggle-instructions');
const instructionsPanel = document.getElementById('instructions-panel');

// Font size state
let currentFontSize = 100;
const MIN_FONT_SIZE = 80;
const MAX_FONT_SIZE = 150;

// Create 20 keys arranged in 4 groups of 5 keys each
function createButtons() {
  buttonsContainer.innerHTML = '';
  for (let groupIndex = 0; groupIndex < 4; groupIndex++) {
    const groupDiv = document.createElement('div');
    groupDiv.className = 'button-group';
    for (let i = 1; i <= 5; i++) {
      const number = groupIndex * 5 + i; // Numbers 1 to 20
      const button = document.createElement('button');
      button.className = 'toggle-btn';
      button.setAttribute('data-number', number);
      button.setAttribute('aria-pressed', 'false');
      button.textContent = number;
      // Apply color classes: keys 1–10 red, 11–20 green.
      if (number <= 10) {
        button.classList.add('red-tile');
      } else {
        button.classList.add('green-tile');
      }
      // Click and keyboard events:
      button.addEventListener('click', () => toggleButton(button));
      button.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
          e.preventDefault();
          toggleButton(button);
        }
      });
      groupDiv.appendChild(button);
    }
    buttonsContainer.appendChild(groupDiv);
  }
}

// Toggle the button state and announce via speech synthesis
function toggleButton(button) {
  const isPressed = button.getAttribute('aria-pressed') === 'true';
  button.setAttribute('aria-pressed', (!isPressed).toString());
  announceState(button.getAttribute('data-number'), !isPressed);
}

function announceState(number, state) {
  if ('speechSynthesis' in window) {
    const msg = new SpeechSynthesisUtterance(`Tasto ${number} ${state ? 'attivato' : 'disattivato'}`);
    msg.lang = 'it-IT';
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(msg);
  }
}

// Update font size and announce change
function updateFontSize(change) {
  currentFontSize = Math.min(Math.max(currentFontSize + change, MIN_FONT_SIZE), MAX_FONT_SIZE);
  document.documentElement.style.fontSize = currentFontSize + '%';
  announceMessage(`Dimensione testo ${change > 0 ? 'aumentata' : 'diminuita'} al ${currentFontSize} percento`);
}

// Toggle high contrast mode
function toggleHighContrast() {
  const active = document.body.classList.toggle('high-contrast');
  announceMessage(`Modalità alto contrasto ${active ? 'attivata' : 'disattivata'}`);
}

// Reset all keys
function resetAll() {
  document.querySelectorAll('.toggle-btn').forEach(btn => btn.setAttribute('aria-pressed', 'false'));
  announceMessage('Tutti i tasti reimpostati');
}

function announceMessage(message) {
  if ('speechSynthesis' in window) {
    const msg = new SpeechSynthesisUtterance(message);
    msg.lang = 'it-IT';
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(msg);
  }
}

// Keyboard shortcuts for controls (Ctrl/Cmd + +, -, H)
document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === '+') {
    e.preventDefault();
    updateFontSize(10);
  }
  if ((e.ctrlKey || e.metaKey) && e.key === '-') {
    e.preventDefault();
    updateFontSize(-10);
  }
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'h') {
    e.preventDefault();
    toggleHighContrast();
  }
});

// --- Multi-Touch / Drag Selection Support ---
let isDragging = false;
let toggledDuringDrag = new Set();

// Start drag selection
buttonsContainer.addEventListener('pointerdown', (e) => {
  if (e.pointerType === 'touch' || (e.pointerType === 'mouse' && e.button === 0)) {
    const target = e.target.closest('.toggle-btn');
    if (target) {
      isDragging = true;
      toggledDuringDrag.add(target);
      toggleButton(target);
    }
  }
});

// Continue drag selection: toggle any new key encountered
buttonsContainer.addEventListener('pointermove', (e) => {
  if (isDragging) {
    const target = document.elementFromPoint(e.clientX, e.clientY);
    if (target && target.closest('.toggle-btn')) {
      const btn = target.closest('.toggle-btn');
      if (!toggledDuringDrag.has(btn)) {
        toggledDuringDrag.add(btn);
        toggleButton(btn);
      }
    }
  }
});

// End drag selection
window.addEventListener('pointerup', () => {
  if (isDragging) {
    isDragging = false;
    toggledDuringDrag.clear();
  }
});

// Toggle the instructions panel visibility
toggleInstructionsBtn.addEventListener('click', () => {
  const collapsed = instructionsPanel.classList.contains('collapsed');
  if (collapsed) {
    instructionsPanel.classList.remove('collapsed');
    instructionsPanel.setAttribute('aria-hidden', 'false');
    toggleInstructionsBtn.setAttribute('aria-expanded', 'true');
  } else {
    instructionsPanel.classList.add('collapsed');
    instructionsPanel.setAttribute('aria-hidden', 'true');
    toggleInstructionsBtn.setAttribute('aria-expanded', 'false');
  }
});

// Save preferences (font size, high contrast) to localStorage
function savePreferences() {
  const prefs = {
    fontSize: currentFontSize,
    highContrast: document.body.classList.contains('high-contrast')
  };
  localStorage.setItem('linea20Prefs', JSON.stringify(prefs));
}

// Load saved preferences
function loadPreferences() {
  const saved = localStorage.getItem('linea20Prefs');
  if (saved) {
    const prefs = JSON.parse(saved);
    currentFontSize = prefs.fontSize || 100;
    document.documentElement.style.fontSize = currentFontSize + '%';
    if (prefs.highContrast) {
      document.body.classList.add('high-contrast');
    }
  }
}

// Event listeners for accessibility controls
increaseFontBtn.addEventListener('click', () => updateFontSize(10));
decreaseFontBtn.addEventListener('click', () => updateFontSize(-10));
toggleContrastBtn.addEventListener('click', toggleHighContrast);
resetAllBtn.addEventListener('click', resetAll);

// Save preferences before unloading the page
window.addEventListener('beforeunload', savePreferences);

// Initialize when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  createButtons();
  loadPreferences();
  announceMessage("Linea del 20 pronta all'uso");
});
