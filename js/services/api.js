export const BASE_URL = "https://x8ki-letl-twmt.n7.xano.io/api:wExNDVVv";

export function createCachedService(url) {
  let cache = null;
  let cacheTime = 0;
  const TTL = 5 * 60 * 1000;
  const STORAGE_KEY = 'sisfrota_cache_' + url.replace(/[^a-zA-Z0-9]/g, '_');

  function readStorage() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const entry = JSON.parse(raw);
      if (Date.now() - entry.time > TTL) {
        localStorage.removeItem(STORAGE_KEY);
        return null;
      }
      return entry.data;
    } catch { return null; }
  }

  function writeStorage(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ data, time: Date.now() }));
    } catch {}
  }

  async function listar() {
    if (cache && Date.now() - cacheTime < TTL) return cache;
    const stored = readStorage();
    if (stored) { cache = stored; cacheTime = Date.now(); return cache; }
    const r = await fetch(url);
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const data = await r.json();
    const arr = data.value ?? data;
    cache = arr;
    cacheTime = Date.now();
    writeStorage(arr);
    return arr;
  }

  function invalidate() {
    cache = null;
    cacheTime = 0;
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
  }

  return { listar, invalidate };
}
