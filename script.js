// DOM Elements
const buttonsContainer = document.querySelector('.buttons-container');
const increaseFontBtn = document.getElementById('increase-font');
const decreaseFontBtn = document.getElementById('decrease-font');
const toggleContrastBtn = document.getElementById('toggle-contrast');
const resetAllBtn = document.getElementById('reset-all');

// State
let currentFontSize = 100;
const MIN_FONT_SIZE = 80;
const MAX_FONT_SIZE = 150;

// Create buttons
function createButtons() {
  // Create rows
  const topRow = document.createElement('div');
  topRow.className = 'buttons-row';
  const bottomRow = document.createElement('div');
  bottomRow.className = 'buttons-row';

  // Create buttons 11-20 (top row)
  for (let i = 11; i <= 20; i++) {
    const button = createButton(i);
    topRow.appendChild(button);
  }

  // Create buttons 1-10 (bottom row)
  for (let i = 1; i <= 10; i++) {
    const button = createButton(i);
    bottomRow.appendChild(button);
  }

  buttonsContainer.appendChild(topRow);
  buttonsContainer.appendChild(bottomRow);
}

// Helper function to create individual buttons
function createButton(number) {
  const button = document.createElement('button');
  button.className = 'toggle-btn';
  button.setAttribute('aria-pressed', 'false');
  button.setAttribute('aria-label', `Tasto ${number}`);
  button.setAttribute('data-number', number);
  button.textContent = number;
  
  // Add event listeners
  button.addEventListener('click', () => toggleButton(button));
  button.addEventListener('keydown', (e) => handleKeyPress(e, button));
  
  return button;
}

// Toggle button state
function toggleButton(button) {
  const isPressed = button.getAttribute('aria-pressed') === 'true';
  button.setAttribute('aria-pressed', (!isPressed).toString());
  
  // Announce state change and number
  const number = button.getAttribute('data-number');
  announceState(number, !isPressed);
}

// Handle keyboard interaction
function handleKeyPress(event, button) {
  if (event.key === 'Enter' || event.key === ' ' || event.key === 'Spacebar') {
    event.preventDefault();
    toggleButton(button);
  }
}

// Text-to-speech announcement
function announceState(number, isPressed) {
  if ('speechSynthesis' in window) {
    const msg = new SpeechSynthesisUtterance();
    msg.lang = 'it-IT';
    msg.text = `Tasto ${number} ${isPressed ? 'attivato' : 'disattivato'}`;
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(msg);
  }
}

// Font size controls
function updateFontSize(change) {
  currentFontSize = Math.min(Math.max(currentFontSize + change, MIN_FONT_SIZE), MAX_FONT_SIZE);
  document.documentElement.style.fontSize = `${currentFontSize}%`;
  
  // Announce font size change
  announceMessage(`Dimensione testo ${change > 0 ? 'aumentata' : 'diminuita'} al ${currentFontSize} percento`);
}

// High contrast toggle
function toggleHighContrast() {
  const isHighContrast = document.body.classList.toggle('high-contrast');
  announceMessage(`Modalità alto contrasto ${isHighContrast ? 'attivata' : 'disattivata'}`);
}

// Reset all buttons
function resetAll() {
  document.querySelectorAll('.toggle-btn').forEach(button => {
    button.setAttribute('aria-pressed', 'false');
  });
  announceMessage('Tutti i tasti reimpostati');
}

// Generic announcement function
function announceMessage(message) {
  if ('speechSynthesis' in window) {
    const msg = new SpeechSynthesisUtterance(message);
    msg.lang = 'it-IT';
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(msg);
  }
}

// Event Listeners
increaseFontBtn.addEventListener('click', () => updateFontSize(10));
decreaseFontBtn.addEventListener('click', () => updateFontSize(-10));
toggleContrastBtn.addEventListener('click', toggleHighContrast);
resetAllBtn.addEventListener('click', resetAll);

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  // Ctrl/Cmd + Plus: Increase font size
  if ((e.ctrlKey || e.metaKey) && e.key === '+') {
    e.preventDefault();
    updateFontSize(10);
  }
  // Ctrl/Cmd + Minus: Decrease font size
  if ((e.ctrlKey || e.metaKey) && e.key === '-') {
    e.preventDefault();
    updateFontSize(-10);
  }
  // Ctrl/Cmd + H: Toggle high contrast
  if ((e.ctrlKey || e.metaKey) && e.key === 'h') {
    e.preventDefault();
    toggleHighContrast();
  }
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  createButtons();
  announceMessage('Linea del 20 pronta all\'uso');
});

// Save preferences to localStorage
function savePreferences() {
  const preferences = {
    fontSize: currentFontSize,
    highContrast: document.body.classList.contains('high-contrast')
  };
  localStorage.setItem('linea20Preferences', JSON.stringify(preferences));
}

// Load preferences from localStorage
function loadPreferences() {
  const saved = localStorage.getItem('linea20Preferences');
  if (saved) {
    const preferences = JSON.parse(saved);
    currentFontSize = preferences.fontSize;
    document.documentElement.style.fontSize = `${currentFontSize}%`;
    if (preferences.highContrast) {
      document.body.classList.add('high-contrast');
    }
  }
}

// Save preferences when changed
window.addEventListener('beforeunload', savePreferences);

// Load preferences on start
loadPreferences();
