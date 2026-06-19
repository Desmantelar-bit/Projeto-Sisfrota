import { BASE_URL, createCachedService } from './api.js';

const URL = `${BASE_URL}/ve_culo`;
const h = { 'Content-Type': 'application/json' };

const cached = createCachedService(URL);

export const veiculoService = {
  listar: cached.listar,
  cadastrar: async (d) => {
    const r = await fetch(URL, { method: 'POST', headers: h, body: JSON.stringify(d) });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    cached.invalidate();
    return r.json().catch(() => null);
  },
  atualizar: async (id, d) => {
    const r = await fetch(`${URL}/${id}`, { method: 'PATCH', headers: h, body: JSON.stringify(d) });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    cached.invalidate();
    return r.json().catch(() => null);
  },
  excluir: async (id) => {
    const r = await fetch(`${URL}/${id}`, { method: 'DELETE' });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    cached.invalidate();
    return r.json().catch(() => null);
  }
};
