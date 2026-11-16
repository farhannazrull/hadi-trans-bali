// Safe wrapper around gtag: no-ops when analytics is disabled or blocked.
export const track = (event, params = {}) => {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  window.gtag('event', event, params);
};
