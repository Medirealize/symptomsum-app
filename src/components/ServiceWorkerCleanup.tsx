'use client';

import { useEffect } from 'react';

function isLocalhost(hostname: string): boolean {
  return hostname === 'localhost' || hostname === '127.0.0.1';
}

function isPrivateIp(hostname: string): boolean {
  // 例: 192.168.x.x / 10.x.x.x / 172.16-31.x.x
  const m = hostname.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (!m) return false;
  const a = Number(m[1]);
  const b = Number(m[2]);
  if ([a, b].some((n) => Number.isNaN(n))) return false;
  if (a === 10) return true;
  if (a === 192 && b === 168) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  return false;
}

export default function ServiceWorkerCleanup() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const host = window.location.hostname;
    // スマホ実機検証（LAN内IP）でも確実にSWを解除する
    if (!isLocalhost(host) && !isPrivateIp(host)) return;

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

