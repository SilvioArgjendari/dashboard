/**
 * weather.js
 *
 * Weather widget using the OpenWeatherMap API.
 *
 * Flow:
 *   1. Check localStorage for a stored API key
 *      → No key: show setup instructions
 *      → Key found: continue to step 2
 *   2. Check the cache (weather data + timestamp)
 *      → Cache is fresh (< 30 min): render cached data immediately
 *      → Cache is stale/empty: continue to step 3
 *   3. Request geolocation from the browser
 *      → Granted: call API with lat/lon
 *      → Denied: ask user to type their city
 *   4. Fetch from OpenWeatherMap and cache the result
 */

const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes in milliseconds

function initWeather() {
  const apiKey = Storage.get('dashboard_weather_key', null);

  if (!apiKey) {
    renderWeatherSetup();
    return;
  }

  const cached = Storage.get('dashboard_weather_cache', null);
  if (cached && (Date.now() - cached.timestamp) < CACHE_TTL_MS) {
    renderWeatherData(cached.data);
    return;
  }

  requestLocation(apiKey);
}

// ─── Location ─────────────────────────────────────────────────────────────────

function requestLocation(apiKey) {
  setWeatherContent('<p class="muted">Detecting location…</p>');

  if (!navigator.geolocation) {
    // Geolocation API isn't available (very old browser or some extensions)
    renderCityInput(apiKey);
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude: lat, longitude: lon } = position.coords;
      fetchWeather(apiKey, { lat, lon });
    },
    () => {
      // User denied permission or an error occurred
      renderCityInput(apiKey);
    },
  );
}

// ─── API Call ─────────────────────────────────────────────────────────────────

/**
 * Calls the OpenWeatherMap API.
 * Pass either { lat, lon } or { city } in the `params` object.
 *
 * `async/await` makes asynchronous code read like synchronous code.
 * Under the hood it's still a Promise — `await` pauses execution of
 * *this* function until the Promise resolves, without blocking the browser.
 */
async function fetchWeather(apiKey, params) {
  setWeatherContent('<p class="muted">Loading weather…</p>');

  const base = 'https://api.openweathermap.org/data/2.5/weather';
  const query = params.city
    ? `q=${encodeURIComponent(params.city)}`
    : `lat=${params.lat}&lon=${params.lon}`;

  const url = `${base}?${query}&units=metric&appid=${apiKey}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      // 401 = bad API key, 404 = city not found, etc.
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();

    // Cache the successful result with a timestamp
    Storage.set('dashboard_weather_cache', { data, timestamp: Date.now() });
    renderWeatherData(data);

  } catch (err) {
    console.error('Weather fetch error:', err);

    const isAuthError = err.message.includes('401');
    const msg = isAuthError
      ? 'Invalid API key. <button class="retry-btn" id="weather-change-key">Change key</button>'
      : 'Could not load weather. <button class="retry-btn" id="weather-retry">Retry</button>';

    setWeatherContent(`<p class="error-msg">${msg}</p>`);

    document.getElementById('weather-retry')?.addEventListener('click', () => initWeather());
    document.getElementById('weather-change-key')?.addEventListener('click', () => {
      Storage.remove('dashboard_weather_key');
      Storage.remove('dashboard_weather_cache');
      renderWeatherSetup();
    });
  }
}

// ─── Render States ────────────────────────────────────────────────────────────

/** Render current weather data received from the API. */
function renderWeatherData(data) {
  const temp      = Math.round(data.main.temp);
  const feelsLike = Math.round(data.main.feels_like);
  const humidity  = data.main.humidity;
  const desc      = data.weather[0].description;
  const city      = data.name;
  const iconCode  = data.weather[0].icon;

  // OpenWeatherMap provides weather icons at this URL pattern:
  const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

  // Capitalise first letter of description (the API returns lowercase)
  const descFormatted = desc.charAt(0).toUpperCase() + desc.slice(1);

  setWeatherContent(`
    <div class="weather-main">
      <img class="weather-icon-img" src="${iconUrl}" alt="${escapeHtml(desc)}" width="60" height="60">
      <span class="weather-temp">${temp}°C</span>
    </div>
    <div class="weather-details">
      <span class="weather-city">${escapeHtml(city)}</span>
      <span class="weather-meta">${escapeHtml(descFormatted)}</span>
      <span class="weather-meta">Feels like ${feelsLike}°C &bull; ${humidity}% humidity</span>
    </div>
    <button class="weather-reset" id="weather-reset">Change location / API key</button>
  `);

  document.getElementById('weather-reset').addEventListener('click', () => {
    Storage.remove('dashboard_weather_cache');
    Storage.remove('dashboard_weather_key');
    renderWeatherSetup();
  });
}

/** Show a form to enter the OpenWeatherMap API key. */
function renderWeatherSetup() {
  setWeatherContent(`
    <p class="muted">
      To enable weather, enter a free
      <a href="https://openweathermap.org/api" target="_blank" rel="noopener">OpenWeatherMap</a>
      API key. Sign up is free — the key activates within ~10 minutes.
    </p>
    <form class="add-form" id="weather-key-form">
      <input
        type="text"
        class="text-input"
        id="weather-key-input"
        placeholder="Paste API key…"
        autocomplete="off"
        spellcheck="false"
      >
      <button type="submit" class="icon-btn" title="Save key">&#10003;</button>
    </form>
  `);

  document.getElementById('weather-key-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const key = document.getElementById('weather-key-input').value.trim();
    if (!key) return;
    Storage.set('dashboard_weather_key', key);
    requestLocation(key);
  });
}

/** Show a city name input when geolocation is unavailable or denied. */
function renderCityInput(apiKey) {
  setWeatherContent(`
    <p class="muted">Location access denied. Enter your city:</p>
    <form class="add-form" id="weather-city-form">
      <input type="text" class="text-input" id="weather-city-input" placeholder="e.g. Zurich" autocomplete="off">
      <button type="submit" class="icon-btn" title="Search">&#10003;</button>
    </form>
  `);

  document.getElementById('weather-city-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const city = document.getElementById('weather-city-input').value.trim();
    if (!city) return;
    fetchWeather(apiKey, { city });
  });
}

// ─── Helper ───────────────────────────────────────────────────────────────────

/** Replaces the content of the weather widget body. */
function setWeatherContent(html) {
  document.getElementById('weather-content').innerHTML = html;
}
