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

const CAMPOS_VIE = {
    descricao: v => v.descricao ?? v.Descricao ?? '—',
    ano:       v => v.ano ?? v.Ano ?? '—',
    horimetro: v => v.horimetro ?? v.Horimetro ?? '—',
    marcaId:   v => v.marca_Id ?? v.MarcaId ?? '',
    modeloId:  v => v.modelo_Id ?? v.ModeloId ?? ''
};

async function carregarDropdowns() {
    const [marcas, modelos] = await Promise.all([
        marcaService.listar(),
        modeloService.listar()
    ]);

    marcasCache = Array.isArray(marcas) ? marcas : [];
    modelosCache = Array.isArray(modelos) ? modelos : [];

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
                <td>${CAMPOS_VIE.descricao(v)}</td>
                <td>${nomePor(marcasCache, CAMPOS_VIE.marcaId(v))}</td>
                <td>${nomePor(modelosCache, CAMPOS_VIE.modeloId(v))}</td>
                <td>${CAMPOS_VIE.ano(v)}</td>
                <td>${CAMPOS_VIE.horimetro(v)}</td>
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
    document.getElementById('descV').value  = CAMPOS_VIE.descricao(v);
    document.getElementById('anoV').value   = CAMPOS_VIE.ano(v);
    document.getElementById('horiV').value  = CAMPOS_VIE.horimetro(v);
    selMarca.value  = CAMPOS_VIE.marcaId(v) ?? '';
    selModelo.value = CAMPOS_VIE.modeloId(v) ?? '';
    document.getElementById('modalTitulo').textContent = 'Editar Veículo';
    modal.show();
};

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id    = document.getElementById('idV').value;
    const dados = {
        descricao: document.getElementById('descV').value,
        ano:       parseInt(document.getElementById('anoV').value),
        horimetro: parseInt(document.getElementById('horiV').value),
        marca_Id:  parseInt(selMarca.value),
        modelo_Id: parseInt(selModelo.value)
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
