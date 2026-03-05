# Personal Dashboard - Project Plan

A browser start page that replaces the new tab with weather, to-do list, bookmarks, and a daily quote.

---

## Technology Stack

This project uses **vanilla HTML, CSS, and JavaScript** -- no frameworks. This is the best way to learn the fundamentals of web development before moving on to tools like React or Vue.

| Layer       | Technology         | Why                                        |
|-------------|--------------------|--------------------------------------------|
| Structure   | HTML5              | The skeleton of every web page              |
| Styling     | CSS3 (Flexbox/Grid)| Modern layout without extra libraries       |
| Logic       | Vanilla JavaScript | Learn the language before learning frameworks|
| Storage     | localStorage API   | Persist to-dos and bookmarks in the browser |
| Weather     | OpenWeatherMap API  | Free tier, simple REST API, great for learning|
| Quotes      | ZenQuotes API      | Free, no API key required                   |
| Icons       | Lucide Icons (CDN) | Lightweight, clean SVG icon set             |
| Fonts       | Google Fonts (CDN) | Easy way to use custom typography           |

No build tools, no npm, no bundlers. Just files you open in a browser.

---

## Project Structure

```
dashboard/
  index.html          -- Single HTML page (entry point)
  css/
    style.css          -- All styles
  js/
    app.js             -- Main initialization and clock/greeting
    weather.js         -- Weather widget logic
    todo.js            -- To-do list logic
    bookmarks.js       -- Bookmarks widget logic
    quote.js           -- Daily quote logic
    storage.js         -- localStorage helper functions
  assets/
    favicon.ico        -- Tab icon
  PLAN.md              -- This file
```

Splitting JS into modules keeps each file small and focused. Each file handles one widget.

---

## Page Layout

```
+------------------------------------------------------+
|              Greeting + Clock (top center)            |
+------------------------------------------------------+
|                                                      |
|   +------------+   +----------------+   +----------+ |
|   |  Weather   |   |   To-Do List   |   | Bookmarks| |
|   |            |   |                |   |          | |
|   | icon       |   | [ ] Task 1     |   | link 1   | |
|   | 18C        |   | [x] Task 2     |   | link 2   | |
|   | Sunny      |   | [ ] Task 3     |   | link 3   | |
|   | Zurich     |   | + Add task     |   | + Add    | |
|   +------------+   +----------------+   +----------+ |
|                                                      |
+------------------------------------------------------+
|              Daily Quote (bottom center)             |
+------------------------------------------------------+
```

The layout uses **CSS Grid** for the three-column widget area and **Flexbox** for vertical alignment within each widget.

---

## Features - Detailed Breakdown

### 1. Greeting + Clock
- Displays a live clock updating every second (`setInterval`)
- Shows date in a readable format (e.g., "Thursday, March 5")
- Greeting changes based on time of day:
  - 5-11: "Good morning"
  - 12-16: "Good afternoon"
  - 17-20: "Good evening"
  - 21-4: "Good night"
- User can set their name (stored in localStorage), shown in the greeting

**Concepts you'll learn:** DOM manipulation, `setInterval`, `Date` object, template literals.

### 2. Weather Widget
- On first load, asks for location permission via the Geolocation API
- Fetches current weather from OpenWeatherMap (free tier, requires sign-up)
- Displays: temperature, weather description, weather icon, city name
- Caches the result in localStorage for 30 minutes to avoid excessive API calls
- Falls back to a manual city input if geolocation is denied

**API endpoint:**
```
https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&units=metric&appid={API_KEY}
```

**Concepts you'll learn:** `fetch()`, Promises/async-await, Geolocation API, API keys, error handling.

### 3. To-Do List
- Add new tasks with a text input and button (or Enter key)
- Toggle tasks complete/incomplete (checkbox)
- Delete tasks (X button)
- All tasks saved to localStorage so they persist across sessions
- Tasks stored as an array of objects: `{ id, text, completed }`

**Concepts you'll learn:** Event listeners, array methods (`filter`, `map`), JSON serialization, DOM creation.

### 4. Bookmarks
- Display a list of saved bookmarks (name + URL)
- Add new bookmarks via a small form (name + URL fields)
- Delete bookmarks
- Clicking a bookmark opens it in the current tab
- Stored in localStorage as an array of objects: `{ id, name, url }`

**Concepts you'll learn:** Form handling, URL validation, `<a>` tag behavior, CRUD operations.

### 5. Daily Quote
- Fetches a random inspirational quote on page load
- Caches the quote in localStorage with today's date so it stays the same all day
- Displays the quote text and the author
- Fallback: a hardcoded array of quotes in case the API is unavailable

**API endpoint:**
```
https://zenquotes.io/api/random
```

**Concepts you'll learn:** API calls, caching strategies, date comparison, graceful fallback.

---

## Styling Guidelines

- **Color scheme:** Dark background with light text (easy on the eyes for a start page)
  - Background: `#1a1a2e`
  - Cards: `#16213e` with subtle border-radius and box-shadow
  - Accent: `#e94560` for interactive elements
  - Text: `#eee` primary, `#aaa` secondary
- **Font:** "Inter" from Google Fonts (clean, readable)
- **Responsive:** Use CSS Grid `auto-fit` / `minmax()` so columns stack on narrow screens
- **Transitions:** Subtle hover effects on cards and buttons (`transition: 0.2s ease`)
- **No scrollbars on the main page:** Everything fits in the viewport

---

## localStorage Schema

```javascript
// User's name for greeting
"dashboard_name"       -> "Silvio"

// To-do items
"dashboard_todos"      -> [{ "id": 1, "text": "Learn CSS", "completed": false }]

// Bookmarks
"dashboard_bookmarks"  -> [{ "id": 1, "name": "GitHub", "url": "https://github.com" }]

// Cached weather
"dashboard_weather"    -> { "data": {...}, "timestamp": 1709654400000 }

// Cached daily quote
"dashboard_quote"      -> { "text": "...", "author": "...", "date": "2026-03-05" }
```

---

## Implementation Order

Build the dashboard step by step. Each step produces something visible so you can see progress.

| Step | What to Build                  | Files Touched              |
|------|--------------------------------|----------------------------|
| 1    | HTML skeleton + CSS layout     | `index.html`, `style.css`  |
| 2    | Clock + greeting               | `app.js`                   |
| 3    | localStorage helpers           | `storage.js`               |
| 4    | To-do list (add, check, delete)| `todo.js`                  |
| 5    | Bookmarks (add, delete, click) | `bookmarks.js`             |
| 6    | Daily quote (API + fallback)   | `quote.js`                 |
| 7    | Weather widget (API + cache)   | `weather.js`               |
| 8    | Polish: transitions, responsive| `style.css`                |

---

## Prerequisites - What You Need Before Starting

1. **A code editor** -- VS Code is the standard (free, great extensions)
2. **A modern browser** -- Chrome or Firefox with DevTools (F12)
3. **An OpenWeatherMap API key** -- Sign up at https://openweathermap.org/api (free tier, takes ~10 min to activate)
4. **Basic terminal usage** -- You'll just need to open files; no complex commands

---

## Setting It as Your Browser's New Tab Page

Once the dashboard is finished:

- **Chrome:** Install the "Custom New Tab URL" extension and point it at your local `index.html` file
- **Firefox:** Set `browser.newtab.url` in `about:config` or use the "New Tab Override" extension
- **Later improvement:** Host it on GitHub Pages or Netlify for access across devices

---

## Stretch Goals (After the Core Is Done)

These are optional enhancements to tackle once the basics work:

- **Editable name:** Click the greeting to change your name
- **Drag-and-drop reorder** for to-dos and bookmarks
- **Theme switcher:** Light/dark mode toggle
- **Background image:** Fetch from Unsplash API
- **Pomodoro timer widget**
- **Search bar** that searches Google/DuckDuckGo
- **Keyboard shortcuts** (e.g., `N` to add a new to-do)
