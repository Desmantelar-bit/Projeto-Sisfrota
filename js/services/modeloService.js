import { BASE_URL } from './api.js';

const URL = `${BASE_URL}/modelo`;
const h = { 'Content-Type': 'application/json' };

export const modeloService = {
listar: async () => {
    const r = await fetch(URL);
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return r.json();
},

cadastrar: async (d) => {
    const r = await fetch(URL, { method: 'POST', headers: h, body: JSON.stringify(d) });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return r.json().catch(() => null);
},

atualizar: async (id, d) => {
    const r = await fetch(`${URL}/${id}`, { method: 'PATCH', headers: h, body: JSON.stringify(d) });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return r.json().catch(() => null);
},

excluir: async (id) => {
    const r = await fetch(`${URL}/${id}`, { method: 'DELETE' });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return r.json().catch(() => null);
}
};
