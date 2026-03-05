/**
 * app.js
 *
 * Entry point. Runs the clock, manages the greeting name,
 * and initialises all other widgets once the page is ready.
 */

// ─── Clock & Date ────────────────────────────────────────────────────────────

/**
 * Returns the right greeting word for the current hour.
 * This is a pure function — it takes input and returns output with no side
 * effects, which makes it easy to test and reason about.
 */
function getGreetingWord(hour) {
  if (hour >= 5  && hour < 12) return 'Good morning';
  if (hour >= 12 && hour < 17) return 'Good afternoon';
  if (hour >= 17 && hour < 21) return 'Good evening';
  return 'Good night';
}

/**
 * Updates the clock, date, and greeting word in the DOM.
 * Called once on load, then every second via setInterval.
 *
 * String.padStart(2, '0') turns '9' into '09' so the clock
 * doesn't jump around as single-digit minutes appear.
 */
function updateClock() {
  const now = new Date();

  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  document.getElementById('clock').textContent = `${h}:${m}`;

  document.getElementById('date').textContent = now.toLocaleDateString('en-US', {
    weekday: 'long',
    year:    'numeric',
    month:   'long',
    day:     'numeric',
  });

  document.getElementById('greeting-word').textContent = getGreetingWord(now.getHours());
}

// ─── Name Greeting ───────────────────────────────────────────────────────────

/**
 * Renders the user's name as a clickable button inside the greeting.
 * Clicking it switches to edit mode (see editName below).
 */
function renderName() {
  const container = document.getElementById('greeting-name');
  const name = Storage.get('dashboard_name', null);

  // Create the button element programmatically instead of with innerHTML
  // so we don't need to worry about escaping the name for an HTML attribute.
  const btn = document.createElement('button');
  btn.className = 'name-btn';
  btn.title = 'Click to change your name';
  btn.textContent = name || 'friend';
  btn.addEventListener('click', editName);

  container.innerHTML = '';
  container.appendChild(btn);
}

/**
 * Replaces the name button with a text input so the user can type a new name.
 * The new name is saved when they press Enter or click away (blur event).
 */
function editName() {
  const container = document.getElementById('greeting-name');
  const currentName = Storage.get('dashboard_name', '');

  const input = document.createElement('input');
  input.className = 'name-edit-input';
  input.type = 'text';
  input.value = currentName;
  input.maxLength = 30;
  input.placeholder = 'Your name';

  const save = () => {
    const newName = input.value.trim();
    if (newName) {
      Storage.set('dashboard_name', newName);
    } else {
      Storage.remove('dashboard_name');
    }
    renderName(); // go back to button mode
  };

  // Save on Enter, cancel on Escape
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter')  { e.preventDefault(); save(); }
    if (e.key === 'Escape') renderName(); // discard changes
  });

  // Also save when the input loses focus (user clicks elsewhere)
  input.addEventListener('blur', save);

  container.innerHTML = '';
  container.appendChild(input);

  input.focus();
  input.select(); // highlight existing text so it's easy to replace
}

// ─── Initialisation ──────────────────────────────────────────────────────────

/**
 * DOMContentLoaded fires when the HTML is fully parsed.
 * We wait for this before touching any elements, because
 * a script running before the DOM is ready would find nothing.
 */
document.addEventListener('DOMContentLoaded', () => {
  // Start the clock immediately, then tick every second.
  // Updating every second (not minute) means the display
  // always flips within 1 second of the real minute changing.
  updateClock();
  setInterval(updateClock, 1000);

  // Set up the greeting name button
  renderName();

  // Initialise each widget (functions defined in their own files)
  initQuote();
  initTodo();
  initBookmarks();
  initWeather();
});
