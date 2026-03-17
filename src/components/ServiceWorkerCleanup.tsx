'use client';

import { useEffect } from 'react';

function isLocalhost(hostname: string): boolean {
  return hostname === 'localhost' || hostname === '127.0.0.1';
}

export default function ServiceWorkerCleanup() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!isLocalhost(window.location.hostname)) return;

    // 開発中に見た目が戻らない原因になりがちなSW/Cacheを強制クリア
    (async () => {
      try {
        if ('serviceWorker' in navigator) {
          const regs = await navigator.serviceWorker.getRegistrations();
          await Promise.all(regs.map((r) => r.unregister()));
        }
        if ('caches' in window) {
          const keys = await caches.keys();
          await Promise.all(keys.map((k) => caches.delete(k)));
        }
      } catch {
        // 失敗してもUIには影響させない
      }
    })();
  }, []);

  return null;
}

