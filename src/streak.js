// Daily-habit streak, stored locally. A day counts when the user completes a
// daily action (votes in the Poll of the Day or finishes the Case of the Day).
const KEY = "gaso_streak";
const fmt = d => `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;

function load() {
  try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; }
}

export function getStreak() {
  const s = load();
  const today = fmt(new Date());
  const yesterday = fmt(new Date(Date.now() - 86400000));
  if (s.last === today)     return { count: s.count || 0, best: s.best || 0, doneToday: true };
  if (s.last === yesterday) return { count: s.count || 0, best: s.best || 0, doneToday: false };
  return { count: 0, best: s.best || 0, doneToday: false };
}

// Idempotent per day: the first daily action extends (or starts) the streak,
// repeats are no-ops.
export function recordDailyAction() {
  const s = load();
  const today = fmt(new Date());
  if (s.last === today) return getStreak();
  const yesterday = fmt(new Date(Date.now() - 86400000));
  const count = s.last === yesterday ? (s.count || 0) + 1 : 1;
  const best = Math.max(count, s.best || 0);
  localStorage.setItem(KEY, JSON.stringify({ last: today, count, best }));
  return { count, best, doneToday: true };
}
