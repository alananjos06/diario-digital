// ===== ELEMENTOS DO DOM =====
const tituloInput = document.getElementById('titulo');
const textoInput = document.getElementById('texto');
const fotoInput = document.getElementById('foto');
const preview = document.getElementById('preview');
const btnSalvar = document.getElementById('btnSalvar');
const btnCancelar = document.getElementById('btnCancelar');
const editandoId = document.getElementById('editandoId');
const listaEntradas = document.getElementById('listaEntradas');

// ===== DADOS =====
let entradas = [];

// ===== INICIALIZAÇÃO =====
function carregarEntradas() {
    const dados = localStorage.getItem('diarioEntradas');
    if (dados) {
        entradas = JSON.parse(dados);
    }
    renderizar();
}

// ===== SALVAR NO LOCALSTORAGE =====
function salvarNoStorage() {
    localStorage.setItem('diarioEntradas', JSON.stringify(entradas));
}

// ===== CRIAR ENTRADA =====
function criarEntrada(titulo, texto, foto) {
    const entrada = {
        id: Date.now().toString(),
        titulo: titulo,
        texto: texto,
        data: new Date().toISOString().split('T')[0], // Formato YYYY-MM-DD
        foto: foto || null
    };
    
    entradas.unshift(entrada); // Adiciona no início do array (mais recente primeiro)
    salvarNoStorage();
    renderizar();
    limparFormulario();
}

// ===== RENDERIZAR CARDS =====
function renderizar() {
    listaEntradas.innerHTML = '';
    
    if (entradas.length === 0) {
        listaEntradas.innerHTML = '<p class="vazio">Nenhuma entrada ainda. Que tal escrever sobre seu dia?</p>';
        return;
    }
    
    entradas.forEach(entrada => {
        const card = criarCard(entrada);
        listaEntradas.appendChild(card);
    });
}

// ===== CRIAR CARD =====
function criarCard(entrada) {
    const card = document.createElement('div');
    card.className = 'card';
    card.setAttribute('data-id', entrada.id);
    
    // Formatar data para exibição
    const dataFormatada = new Date(entrada.data + 'T00:00:00').toLocaleDateString('pt-BR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
    
    let html = `
        <div class="data">${dataFormatada}</div>
        <div class="titulo">${escapeHtml(entrada.titulo)}</div>
        <div class="texto">${escapeHtml(entrada.texto)}</div>
    `;
    
    if (entrada.foto) {
        html += `<img src="${entrada.foto}" alt="Foto da entrada" class="foto-card">`;
    }
    
    html += `
        <div class="acoes">
            <button class="btn-editar" onclick="editarEntrada('${entrada.id}')">✏️ Editar</button>
            <button class="btn-excluir" onclick="excluirEntrada('${entrada.id}')">🗑️ Excluir</button>
        </div>
    `;
    
    card.innerHTML = html;
    return card;
}

// ===== LIMPAR FORMULÁRIO =====
function limparFormulario() {
    tituloInput.value = '';
    textoInput.value = '';
    fotoInput.value = '';
    preview.style.display = 'none';
    preview.src = '';
    editandoId.value = '';
    btnCancelar.style.display = 'none';
    btnSalvar.textContent = '💾 Salvar Entrada';
}

// ===== PREVIEW DA FOTO =====
fotoInput.addEventListener('change', function() {
    const file = this.files[0];
    
    if (file) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            preview.src = e.target.result;
            preview.style.display = 'block';
        };
        
        reader.readAsDataURL(file);
    } else {
        preview.style.display = 'none';
        preview.src = '';
    }
});

// ===== SALVAR ENTRADA =====
btnSalvar.addEventListener('click', function() {
    const titulo = tituloInput.value.trim();
    const texto = textoInput.value.trim();
    const foto = preview.src || null;
    
    // Validação simples
    if (!titulo) {
        alert('Por favor, insira um título para a entrada.');
        tituloInput.focus();
        return;
    }
    
    if (!texto) {
        alert('Por favor, escreva algo sobre seu dia.');
        textoInput.focus();
        return;
    }
    
    criarEntrada(titulo, texto, foto);
});

// ===== ESCAPAR HTML (segurança básica) =====
function escapeHtml(texto) {
    const div = document.createElement('div');
    div.textContent = texto;
    return div.innerHTML;
}

// ===== STUBS PARA EDITAR E EXCLUIR (implementar depois) =====
function editarEntrada(id) {
    console.log('Editar entrada:', id);
    alert('Funcionalidade de edição será implementada no próximo passo!');
}

function excluirEntrada(id) {
    console.log('Excluir entrada:', id);
    alert('Funcionalidade de exclusão será implementada no próximo passo!');
}

// ===== INICIAR APLICACAO =====
carregarEntradas();