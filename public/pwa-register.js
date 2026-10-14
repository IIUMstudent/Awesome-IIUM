if ('serviceWorker' in navigator) {
	globalThis.addEventListener('load', () => {
		navigator.serviceWorker.register('/Awesome-IIUM/sw.js');
	});
}

function updateOnlineStatus() {
	const statusEl = document.getElementById('offline-indicator');
	if (!statusEl) return;

	if (navigator.onLine) {
		statusEl.classList.remove('is-offline');
	} else {
		statusEl.classList.add('is-offline');
	}
}

globalThis.addEventListener('online', updateOnlineStatus);
globalThis.addEventListener('offline', updateOnlineStatus);

globalThis.addEventListener('DOMContentLoaded', () => {
	const banner = document.createElement('div');
	banner.id = 'offline-indicator';
	banner.setAttribute('role', 'status');
	banner.innerHTML = `
      <div class="offline-content">
        <span class="offline-icon" aria-hidden="true">📡</span>
        <span class="offline-text">Offline Mode Enabled — Browsing Cached Version</span>
      </div>
    `;
	document.body.appendChild(banner);

	// Styles live in src/styles/custom.css.

	updateOnlineStatus();
});
