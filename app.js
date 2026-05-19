const tituloInput = document.getElementById('titulo');
const textoInput = document.getElementById('texto');
const fotoInput = document.getElementById('foto');
const preview = document.getElementById('preview');
const btnSalvar = document.getElementById('btnSalvar');
const btnCancelar = document.getElementById('btnCancelar');
const editandoId = document.getElementById('editandoId');
const listaEntradas = document.getElementById('listaEntradas');

// dados 
let entradas = [];

// inicialização 
function carregarEntradas() {
    const dados = localStorage.getItem('diarioEntradas');
    if (dados) {
        entradas = JSON.parse(dados);
    }
    renderizar();
}

// salvar no localStorage 
function salvarNoStorage() {
    localStorage.setItem('diarioEntradas', JSON.stringify(entradas));
}

// escapar html
function escapeHtml(texto) {
    const div = document.createElement('div');
    div.textContent = texto;
    return div.innerHTML;
}

// criando entrada
function criarEntrada(titulo, texto, foto) {
    const entrada = {
        id: Date.now().toString(),
        titulo: titulo,
        texto: texto,
        data: new Date().toISOString().split('T')[0],
        foto: foto || null
    };
    
    entradas.unshift(entrada);
    salvarNoStorage();
    renderizar();
    limparFormulario();
}

// atualizando entrada
function atualizarEntrada(id, titulo, texto, foto) {
    const entrada = entradas.find(entrada => entrada.id === id);
    
    if (!entrada) return;
    
    entrada.titulo = titulo;
    entrada.texto = texto;
    entrada.foto = foto;
    
    salvarNoStorage();
    renderizar();
    limparFormulario();
}

// excluindo entrada
function excluirEntrada(id) {
    entradas = entradas.filter(entrada => entrada.id !== id);
    
    // Se estava editando essa entrada, limpa o formulário
    if (editandoId.value === id) {
        limparFormulario();
    }
    
    salvarNoStorage();
    renderizar();
}

// editando entrada
function editarEntrada(id) {
    const entrada = entradas.find(entrada => entrada.id === id);
    
    if (!entrada) return;
    
    // preenche o formulário
    tituloInput.value = entrada.titulo;
    textoInput.value = entrada.texto;
    editandoId.value = entrada.id;
    
    // foto
    if (entrada.foto) {
        preview.src = entrada.foto;
        preview.style.display = 'block';
    } else {
        preview.src = '';
        preview.style.display = 'none';
    }
    
    // muda aparência dos botões
    btnSalvar.textContent = '✏️ Atualizar Entrada';
    btnCancelar.style.display = 'block';
    
    // scroll até o formulário
    document.querySelector('.formulario').scrollIntoView({ behavior: 'smooth' });
    tituloInput.focus();
}

// renderiza os cards
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

// criando os cards
function criarCard(entrada) {
    const card = document.createElement('div');
    card.className = 'card';
    card.setAttribute('data-id', entrada.id);
    
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

// limpa formulário
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

// eventos

// Preview da foto ao selecionar
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

// salva ou atualiza
btnSalvar.addEventListener('click', function() {
    const titulo = tituloInput.value.trim();
    const texto = textoInput.value.trim();
    const foto = preview.src || null;
    const idEditando = editandoId.value;
    
    // validação silenciosa (sem alert)
    if (!titulo || !texto) {
        // destaca os campos vazios
        if (!titulo) tituloInput.style.borderColor = '#e03e3e';
        if (!texto) textoInput.style.borderColor = '#e03e3e';
        
        // remove o destaque após 2 segundos
        setTimeout(() => {
            tituloInput.style.borderColor = '#e4e4e1';
            textoInput.style.borderColor = '#e4e4e1';
        }, 2000);
        
        return;
    }
    
    if (idEditando) {
        atualizarEntrada(idEditando, titulo, texto, foto);
    } else {
        criarEntrada(titulo, texto, foto);
    }
});

// cancela edição
btnCancelar.addEventListener('click', function() {
    limparFormulario();
});

// ===== TEMA ESCURO =====
const btnTema = document.getElementById('btnTema');

// Verifica tema salvo ao carregar
const temaSalvo = localStorage.getItem('diarioTema');
if (temaSalvo === 'dark') {
    document.body.classList.add('dark');
    btnTema.textContent = '☀️';
}

// Alternar tema
btnTema.addEventListener('click', function() {
    document.body.classList.toggle('dark');
    
    if (document.body.classList.contains('dark')) {
        btnTema.textContent = '☀️';
        localStorage.setItem('diarioTema', 'dark');
    } else {
        btnTema.textContent = '🌙';
        localStorage.setItem('diarioTema', 'light');
    }
});

// Iniciar
carregarEntradas();