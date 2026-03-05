/**
 * storage.js
 *
 * A thin wrapper around localStorage that handles JSON
 * serialisation and parsing automatically.
 *
 * localStorage only stores strings, so we use JSON.stringify
 * when writing and JSON.parse when reading.
 */

const Storage = {
  /**
   * Read a value. Returns `fallback` if the key doesn't exist
   * or if the stored value is corrupt JSON.
   */
  get(key, fallback = null) {
    try {
      const raw = localStorage.getItem(key);
      return raw !== null ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  },

  /** Write any value (objects, arrays, strings, numbers, booleans). */
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn('Storage.set failed:', e);
    }
  },

  /** Remove a single entry. */
  remove(key) {
    localStorage.removeItem(key);
  },
};

/**
 * escapeHtml
 *
 * Converts characters that have special meaning in HTML
 * (<, >, &, ", ') into safe HTML entities.
 *
 * IMPORTANT: Always escape user-supplied text before inserting
 * it into innerHTML to prevent XSS (Cross-Site Scripting) attacks.
 * This is a fundamental web security practice.
 *
 * Example:
 *   escapeHtml('<script>alert(1)</script>')
 *   // returns '&lt;script&gt;alert(1)&lt;/script&gt;'
 */
function escapeHtml(str) {
  // We create a temporary element, set its text content (safe — no HTML parsing),
  // then read back innerHTML which gives us the escaped version.
  const div = document.createElement('div');
  div.textContent = String(str);
  return div.innerHTML;
}
