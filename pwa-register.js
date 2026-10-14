if ('serviceWorker' in navigator) {
	globalThis.addEventListener('load', () => {
		navigator.serviceWorker.register('/Awesome-IIUM/sw.js');
	});
}

// The offline notice only exists while the browser is offline, so it can't
// show up on a page that is online, even if its styles fail to load.
// Styles live in src/styles/custom.css.
function updateOnlineStatus() {
	const existing = document.getElementById('offline-indicator');

	if (navigator.onLine) {
		existing?.remove();
		return;
	}
	if (existing) return;

	const banner = document.createElement('div');
	banner.id = 'offline-indicator';
	banner.setAttribute('role', 'status');
	banner.innerHTML = `
      <div class="offline-content">
        <span class="offline-icon" aria-hidden="true">📡</span>
        <span class="offline-text">You're offline. Showing saved pages.</span>
      </div>
    `;
	document.body.appendChild(banner);
}

globalThis.addEventListener('online', updateOnlineStatus);
globalThis.addEventListener('offline', updateOnlineStatus);
globalThis.addEventListener('DOMContentLoaded', updateOnlineStatus);
