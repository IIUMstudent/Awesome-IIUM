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
	banner.innerHTML = `
      <div class="offline-content">
        <span class="offline-icon">📡</span>
        <span class="offline-text">Offline Mode Enabled — Browsing Cached Version</span>
      </div>
    `;
	document.body.appendChild(banner);

	// Inject styles
	const style = document.createElement('style');
	style.innerHTML = `
      #offline-indicator {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%) translateY(100px);
        background: rgba(30, 30, 30, 0.9);
        backdrop-filter: blur(8px);
        color: white;
        padding: 12px 24px;
        border-radius: 50px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        z-index: 9999;
        transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        border: 1px solid rgba(255, 255, 255, 0.1);
        font-family: inherit;
        font-weight: 500;
        pointer-events: none;
      }
      #offline-indicator.is-offline {
        transform: translateX(-50%) translateY(0);
      }
      .offline-content {
        display: flex;
        align-items: center;
        gap: 10px;
      }
      .offline-icon {
        font-size: 1.2rem;
        animation: pulse 2s infinite;
      }
      @keyframes pulse {
        0% { opacity: 1; }
        50% { opacity: 0.5; }
        100% { opacity: 1; }
      }
    `;
	document.head.appendChild(style);

	updateOnlineStatus();
});
