'use client';

import { useEffect } from 'react';

/**
 * 旧デプロイの PWA / Service Worker が残っていると、存在しない chunk を取りに行き白画面になる。
 * next-pwa を無効化していても、ブラウザに登録済みの SW は残るため、常に解除する。
 */
export default function ServiceWorkerCleanup() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

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
