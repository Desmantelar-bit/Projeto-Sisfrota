import { modeloService } from '../services/modeloService.js';

const tabela = document.querySelector('#tabelaCorpo');
const form   = document.querySelector('#formModelo');
const modal  = new bootstrap.Modal(document.getElementById('modalModelo'));

function toast(msg, ok = true) {
    const el   = document.getElementById('toast');
    const icon = document.getElementById('toastIcon');
    document.getElementById('toastMsg').textContent = msg;
    el.className = `toast ${ok ? 'success' : 'danger'}`;
    icon.textContent = ok ? '✓' : '✕';
    icon.style.color = ok ? 'var(--accent-green)' : '#fc8181';
    bootstrap.Toast.getOrCreateInstance(el, { delay: 3000 }).show();
}

function emptyState(msg) {
    return `<tr><td colspan="3"><div class="empty-state"><div class="icon">📭</div><p>${msg}</p></div></td></tr>`;
}

async function render() {
    tabela.innerHTML = `<tr><td colspan="3" style="padding:2rem;text-align:center;color:var(--text-muted);font-size:.85rem">Carregando...</td></tr>`;
    try {
        const dados = await modeloService.listar();
        if (!dados.length) { tabela.innerHTML = emptyState('Nenhum modelo cadastrado.'); return; }
        tabela.innerHTML = dados.map(m => `
            <tr>
                <td><span class="badge-id">${m.id}</span></td>
                <td>${m.nome}</td>
                <td>
                    <button class="btn-icon me-1" onclick="prepararEdicao(${m.id}, '${m.nome.replace(/'/g,"\\'")}')">✎ Editar</button>
                    <button class="btn-icon danger" onclick="deletar(${m.id})">✕</button>
                </td>
            </tr>`).join('');
    } catch {
        tabela.innerHTML = emptyState('Erro ao carregar modelos.');
    }
}

document.getElementById('btnNovo').addEventListener('click', () => {
    form.reset();
    document.getElementById('idField').value = '';
    document.getElementById('modalTitulo').textContent = 'Novo Modelo';
    modal.show();
});

window.prepararEdicao = (id, nome) => {
    document.getElementById('idField').value = id;
    document.getElementById('nomeField').value = nome;
    document.getElementById('modalTitulo').textContent = 'Editar Modelo';
    modal.show();
};

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id   = document.getElementById('idField').value;
    const dados = { nome: document.getElementById('nomeField').value };
    try {
        id ? await modeloService.atualizar(id, dados) : await modeloService.cadastrar(dados);
        modal.hide();
        toast(id ? 'Modelo atualizado com sucesso!' : 'Modelo cadastrado com sucesso!');
        render();
    } catch { toast('Erro ao salvar modelo.', false); }
});

window.deletar = async (id) => {
    if (!confirm('Deseja excluir este modelo?')) return;
    try {
        await modeloService.excluir(id);
        toast('Modelo excluído.');
        render();
    } catch { toast('Erro ao excluir.', false); }
};

render();
