import { BASE_URL } from './api.js';

const URL = `${BASE_URL}/ve_culo`;
const h = { 'Content-Type': 'application/json' };

export const veiculoService = {
    listar: () => fetch(URL).then(r => r.json()),
    cadastrar: (d) => fetch(URL, { method: 'POST', headers: h, body: JSON.stringify(d) }),
    atualizar: (id, d) => fetch(`${URL}/${id}`, { method: 'PATCH', headers: h, body: JSON.stringify(d) }),
    excluir: (id) => fetch(`${URL}/${id}`, { method: 'DELETE' })
};
