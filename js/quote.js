/**
 * quote.js
 *
 * Shows a daily inspirational quote.
 * The same quote is displayed all day (tied to the date).
 * We pick it from a local array using the day-of-year as an index,
 * so no API key or network request is required.
 */

const QUOTES = [
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Life is what happens when you're busy making other plans.", author: "John Lennon" },
  { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
  { text: "In the middle of every difficulty lies opportunity.", author: "Albert Einstein" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
  { text: "It is during our darkest moments that we must focus to see the light.", author: "Aristotle" },
  { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" },
  { text: "An unexamined life is not worth living.", author: "Socrates" },
  { text: "Spread love everywhere you go. Let no one ever come to you without leaving happier.", author: "Mother Teresa" },
  { text: "When you reach the end of your rope, tie a knot in it and hang on.", author: "Franklin D. Roosevelt" },
  { text: "Do not go where the path may lead; go instead where there is no path and leave a trail.", author: "Ralph Waldo Emerson" },
  { text: "You will face many defeats in life, but never let yourself be defeated.", author: "Maya Angelou" },
  { text: "The greatest glory in living lies not in never falling, but in rising every time we fall.", author: "Nelson Mandela" },
  { text: "In the end, it's not the years in your life that count. It's the life in your years.", author: "Abraham Lincoln" },
  { text: "Life is either a daring adventure or nothing at all.", author: "Helen Keller" },
  { text: "Many of life's failures are people who did not realize how close they were to success when they gave up.", author: "Thomas Edison" },
  { text: "Your time is limited, so don't waste it living someone else's life.", author: "Steve Jobs" },
  { text: "Not how long, but how well you have lived is the main thing.", author: "Seneca" },
  { text: "We must be willing to let go of the life we planned so as to have the life that is waiting for us.", author: "Joseph Campbell" },
  { text: "You only live once, but if you do it right, once is enough.", author: "Mae West" },
  { text: "Definiteness of purpose is the starting point of all achievement.", author: "W. Clement Stone" },
  { text: "The whole secret of a successful life is to find out what is one's destiny to do, and then do it.", author: "Henry Ford" },
  { text: "If you want to live a happy life, tie it to a goal, not to people or things.", author: "Albert Einstein" },
  { text: "If you look at what you have in life, you'll always have more.", author: "Oprah Winfrey" },
  { text: "Good friends, good books, and a sleepy conscience: this is the ideal life.", author: "Mark Twain" },
  { text: "The mind is everything. What you think, you become.", author: "Buddha" },
  { text: "Happiness is not something ready-made. It comes from your own actions.", author: "Dalai Lama" },
  { text: "Strive not to be a success, but rather to be of value.", author: "Albert Einstein" },
  { text: "Two roads diverged in a wood, and I — I took the one less traveled by.", author: "Robert Frost" },
  { text: "I have not failed. I've just found 10,000 ways that won't work.", author: "Thomas Edison" },
  { text: "The only impossible journey is the one you never begin.", author: "Tony Robbins" },
  { text: "In this life we cannot do great things. We can only do small things with great love.", author: "Mother Teresa" },
  { text: "It is never too late to be what you might have been.", author: "George Eliot" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "Everything you've ever wanted is on the other side of fear.", author: "George Addair" },
  { text: "Dream big and dare to fail.", author: "Norman Vaughan" },
];

/**
 * Returns a quote object for today.
 * We compute the day-of-year (1–365) and use modulo to pick
 * an index into the array, so every day has a different quote
 * and the same day always shows the same one.
 */
function getDailyQuote() {
  const now   = new Date();
  const start = new Date(now.getFullYear(), 0, 0); // Jan 0 = Dec 31 previous year
  const dayOfYear = Math.floor((now - start) / (1000 * 60 * 60 * 24));
  return QUOTES[dayOfYear % QUOTES.length];
}

function initQuote() {
  const today  = new Date().toISOString().slice(0, 10); // "2026-03-05"
  const cached = Storage.get('dashboard_quote', null);

  // Use the cached quote if it was stored today; otherwise pick a new one.
  let quote;
  if (cached && cached.date === today) {
    quote = cached;
  } else {
    quote = getDailyQuote();
    Storage.set('dashboard_quote', { ...quote, date: today });
  }

  document.getElementById('quote-text').textContent   = quote.text;
  document.getElementById('quote-author').textContent = `— ${quote.author}`;
}
