# Dashboard

A simple personal start-page dashboard built with plain HTML, CSS, and JavaScript — no build step, no dependencies.

## Widgets

- **Clock & greeting** — live time, date, and a time-of-day greeting
- **Weather** — current conditions for your location
- **To-Do** — add and check off tasks, persisted in `localStorage`
- **Bookmarks** — quick links you can add and remove, persisted in `localStorage`
- **Daily quote** — a rotating quote in the footer

## Project structure

```
index.html        # Markup and script loading order
css/style.css     # Styles
js/storage.js     # localStorage helpers (loaded first)
js/quote.js       # Daily quote
js/todo.js        # To-do widget
js/bookmarks.js   # Bookmarks widget
js/weather.js     # Weather widget
js/app.js         # Boot — calls init functions (loaded last)
```

## Run locally

Open `index.html` directly in a browser, or serve the folder:

```sh
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deployment

Pushes to `main` are deployed to GitHub Pages by [.github/workflows/deploy.yml](.github/workflows/deploy.yml). The workflow stages only `index.html`, `css/`, and `js/` into the published site.

To enable: **Settings → Pages → Source: "GitHub Actions"**.
