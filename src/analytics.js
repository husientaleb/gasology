// Manual page_view tracking for GA4 — the app has no URL routing (Root.jsx
// swaps state instead of navigating), so GA's automatic page_view on load
// would only ever fire once. gtag('config', ..., {send_page_view:false}) in
// index.html disables that; this fires one explicitly per screen change.
export function trackPageView(path, title) {
  if (typeof window.gtag !== "function") return;
  window.gtag("event", "page_view", {
    page_path: path,
    page_title: title,
    page_location: window.location.origin + path,
  });
}
