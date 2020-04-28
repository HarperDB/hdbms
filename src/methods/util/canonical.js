const canonical = document.querySelector('link[rel="canonical"]');
if (canonical !== null) {
  canonical.href = window.location.href;
}
