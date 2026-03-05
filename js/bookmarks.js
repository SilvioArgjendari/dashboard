/**
 * bookmarks.js
 *
 * Bookmarks widget.
 * Bookmarks are stored in localStorage as:
 *   [{ id: number, name: string, url: string }, ...]
 *
 * Security note: we validate that URLs use http/https before
 * rendering them as hrefs to prevent javascript: URL injection.
 */

function initBookmarks() {
  renderBookmarks();

  document.getElementById('bookmarks-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('bookmark-name');
    const urlInput  = document.getElementById('bookmark-url');

    const name = nameInput.value.trim();
    let   url  = urlInput.value.trim();

    if (!name || !url) return;

    // Helpfully add https:// if the user forgot it
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }

    if (!isValidBookmarkUrl(url)) {
      alert('Please enter a valid http or https URL.');
      return;
    }

    const bookmarks = Storage.get('dashboard_bookmarks', []);
    bookmarks.push({ id: Date.now(), name, url });
    Storage.set('dashboard_bookmarks', bookmarks);

    nameInput.value = '';
    urlInput.value  = '';
    renderBookmarks();
  });
}

/**
 * Validates that a URL is http or https.
 * We use the URL constructor — if the string is not a valid URL it throws,
 * which we catch and return false.
 */
function isValidBookmarkUrl(url) {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Returns the URL to a site's favicon using Google's favicon service.
 * This works for almost every site without any API key.
 */
function getFaviconUrl(url) {
  try {
    const domain = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=16`;
  } catch {
    return '';
  }
}

function renderBookmarks() {
  const list      = document.getElementById('bookmarks-list');
  const bookmarks = Storage.get('dashboard_bookmarks', []);

  if (bookmarks.length === 0) {
    list.innerHTML = '<li class="muted" style="padding:0.5rem 0">No bookmarks yet. Add one below.</li>';
    return;
  }

  list.innerHTML = bookmarks.map((bm) => {
    const favicon = getFaviconUrl(bm.url);
    // The href uses the raw validated URL. escapeHtml() is used only for
    // text that appears visibly, not for the href (which takes a URL string).
    return `
      <li class="bookmark-item">
        <a class="bookmark-link" href="${bm.url}" target="_blank" rel="noopener noreferrer">
          ${favicon ? `<img class="bookmark-favicon" src="${favicon}" alt="" onerror="this.style.display='none'">` : ''}
          <span>${escapeHtml(bm.name)}</span>
        </a>
        <button class="delete-btn" data-id="${bm.id}" title="Remove bookmark">&times;</button>
      </li>
    `;
  }).join('');

  list.querySelectorAll('.delete-btn').forEach((btn) => {
    btn.addEventListener('click', () => deleteBookmark(Number(btn.dataset.id)));
  });
}

function deleteBookmark(id) {
  const bookmarks = Storage.get('dashboard_bookmarks', []).filter((b) => b.id !== id);
  Storage.set('dashboard_bookmarks', bookmarks);
  renderBookmarks();
}
