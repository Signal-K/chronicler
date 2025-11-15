const fs = require('fs');
const path = require('path');

// Read the index.html file
const indexPath = path.join(__dirname, '../dist/index.html');
let html = fs.readFileSync(indexPath, 'utf8');

// Inject PWA meta tags and manifest link after <head>
const headInjection = `<head>
  <link rel="manifest" href="/manifest.json">
  <meta name="theme-color" content="#22c55e">
  <link rel="apple-touch-icon" href="/assets/images/icon.png">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="default">
  <meta name="apple-mobile-web-app-title" content="Bee Garden">
  <meta name="mobile-web-app-capable" content="yes">`;

html = html.replace('<head>', headInjection);

// Inject service worker registration before </body>
const swInjection = `<script>
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('SW registered:', reg))
      .catch(err => console.log('SW registration failed:', err));
  });
}
</script>
</body>`;

html = html.replace('</body>', swInjection);

// Write the updated HTML back
fs.writeFileSync(indexPath, html);

console.log('✅ PWA meta tags and service worker injected into index.html');
