import { veiculoService } from '../services/veiculoService.js';
import { marcaService }   from '../services/marcaService.js';
import { modeloService }  from '../services/modeloService.js';

const tabela    = document.querySelector('#tabela');
const form      = document.querySelector('#formVeiculo');
const selMarca  = document.querySelector('#selMarca');
const selModelo = document.querySelector('#selModelo');
const modal     = new bootstrap.Modal(document.getElementById('modalVeiculo'));

let marcasCache = [], modelosCache = [];

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
    return `<tr><td colspan="6"><div class="empty-state"><div class="icon">🚗</div><p>${msg}</p></div></td></tr>`;
}

function nomePor(lista, id) {
    return lista.find(x => x.id === id)?.nome ?? '—';
}

async function carregarDropdowns() {
    try {
        [marcasCache, modelosCache] = await Promise.all([
            marcaService.listar().catch(() => []),
            modeloService.listar().catch(() => [])
        ]);
    } catch {
        marcasCache = [];
        modelosCache = [];
    }

    selMarca.innerHTML  = '<option value="" disabled selected>Selecionar</option>' +
        marcasCache.map(m => `<option value="${m.id}">${m.nome}</option>`).join('');
    selModelo.innerHTML = '<option value="" disabled selected>Selecionar</option>' +
        modelosCache.map(m => `<option value="${m.id}">${m.nome}</option>`).join('');
}


async function render() {
    tabela.innerHTML = `<tr><td colspan="6" style="padding:2rem;text-align:center;color:var(--text-muted);font-size:.85rem">Carregando...</td></tr>`;
    try {
        const lista = await veiculoService.listar();
        if (!lista.length) { tabela.innerHTML = emptyState('Nenhum veículo cadastrado.'); return; }
        tabela.innerHTML = lista.map(v => `
            <tr>
                <td>${v.descricao ?? v.Descricao ?? '—'}</td>
                <td>${nomePor(marcasCache, v.MarcaId)}</td>
                <td>${nomePor(modelosCache, v.ModeloId)}</td>
                <td>${v.ano ?? v.Ano ?? '—'}</td>
                <td>${v.horimetro ?? v.Horimetro ?? '—'}</td>
                <td>
                    <button class="btn-icon me-1" onclick="prepararEdicao(${v.id})">✎ Editar</button>
                    <button class="btn-icon danger" onclick="deletar(${v.id})">✕</button>
                </td>
            </tr>`).join('');
    } catch {
        tabela.innerHTML = emptyState('Erro ao carregar veículos.');
    }
}

document.getElementById('btnNovo').addEventListener('click', () => {
    form.reset();
    document.getElementById('idV').value = '';
    document.getElementById('modalTitulo').textContent = 'Novo Veículo';
    modal.show();
});

window.prepararEdicao = async (id) => {
    const lista = await veiculoService.listar();
    const v = lista.find(x => x.id === id);
    if (!v) return;
    document.getElementById('idV').value    = v.id;
    document.getElementById('descV').value  = v.descricao ?? v.Descricao ?? '';
    document.getElementById('anoV').value   = v.ano ?? v.Ano ?? '';
    document.getElementById('horiV').value  = v.horimetro ?? v.Horimetro ?? '';
    selMarca.value  = v.MarcaId  ?? '';
    selModelo.value = v.ModeloId ?? '';
    document.getElementById('modalTitulo').textContent = 'Editar Veículo';
    modal.show();
};

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id    = document.getElementById('idV').value;
    const dados = {
        Descricao: document.getElementById('descV').value,
        Ano:       parseInt(document.getElementById('anoV').value),
        Horimetro: parseInt(document.getElementById('horiV').value),
        MarcaId:   parseInt(selMarca.value),
        ModeloId:  parseInt(selModelo.value)
    };
    try {
        id ? await veiculoService.atualizar(id, dados) : await veiculoService.cadastrar(dados);
        modal.hide();
        toast(id ? 'Veículo atualizado com sucesso!' : 'Veículo cadastrado com sucesso!');
        render();
    } catch { toast('Erro ao salvar veículo.', false); }
});

window.deletar = async (id) => {
    if (!confirm('Deseja excluir este veículo?')) return;
    try {
        await veiculoService.excluir(id);
        toast('Veículo excluído.');
        render();
    } catch { toast('Erro ao excluir.', false); }
};

async function init() {
    await carregarDropdowns();
    await render();
}

init();
