// ========================================
// VARIÁVEIS GLOBAIS
// ========================================

let produtoEmEdicao = null;

// ========================================
// FUNÇÕES AUXILIARES
// ========================================

// Mostra uma mensagem modal
function mostrarMensagem(mensagem, tipo = 'info') {
    const modal = document.getElementById('modalMessage');
    const modalText = document.getElementById('modalText');
    
    modalText.textContent = mensagem;
    modal.style.display = 'flex';
    
    // Define o estilo baseado no tipo
    if (tipo === 'sucesso') {
        modal.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    } else if (tipo === 'erro') {
        modal.style.backgroundColor = 'rgba(255, 0, 0, 0.2)'; // Leve tom avermelhado para erro
    }
}

// Fecha o modal de mensagens
function fecharModal() {
    document.getElementById('modalMessage').style.display = 'none';
}

// Limpa o formulário
function limparFormulario() {
    document.getElementById('clientForm').reset();
    produtoEmEdicao = null;
    document.querySelector('.form-section h2').textContent = 'Adicionar ou Editar Produto';
}

// Formata valor para Moeda (R$)
function formatarMoeda(valor) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
}

// ========================================
// OPERAÇÕES COM A API
// ========================================

// Busca todos os produtos
async function carregarProdutos() {
    const loadingMessage = document.getElementById('loadingMessage');
    const emptyMessage = document.getElementById('emptyMessage');
    const productsList = document.getElementById('clientsList'); // Mantendo ID da sua lista
    
    loadingMessage.style.display = 'block';
    productsList.innerHTML = '';
    
    try {
        const resposta = await fetch('/produtos');
        
        if (!resposta.ok) {
            throw new Error('Erro ao buscar produtos');
        }
        
        const produtos = await resposta.json();
        loadingMessage.style.display = 'none';
        
        if (produtos.length === 0) {
            emptyMessage.style.display = 'block';
            productsList.innerHTML = '';
        } else {
            emptyMessage.style.display = 'none';
            exibirTabela(produtos);
        }
    } catch (erro) {
        loadingMessage.style.display = 'none';
        emptyMessage.style.display = 'block';
        console.error('Erro:', erro);
        mostrarMensagem('Erro ao carregar os produtos. Tente novamente.', 'erro');
    }
}

// Cria um novo produto
async function criarProduto(dados) {
    try {
        const resposta = await fetch('/produtos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });

        if (!resposta.ok) {
            const erro = await resposta.json();
            throw new Error(erro.error || 'Erro ao criar produto');
        }
        
        mostrarMensagem('Produto cadastrado com sucesso!', 'sucesso');
        limparFormulario();
        carregarProdutos();
        
    } catch (erro) {
        console.error('Erro:', erro);
        mostrarMensagem('Erro: ' + erro.message, 'erro');
    }
}

// Atualiza um produto
async function atualizarProduto(id, dados) {
    try {
        const resposta = await fetch(`/produtos/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });
        
        if (!resposta.ok) {
            const erro = await resposta.json();
            throw new Error(erro.error || 'Erro ao atualizar produto');
        }
        
        mostrarMensagem('Produto atualizado com sucesso!', 'sucesso');
        limparFormulario();
        carregarProdutos();
        
    } catch (erro) {
        console.error('Erro:', erro);
        mostrarMensagem('Erro: ' + erro.message, 'erro');
    }
}

// Deleta um produto
async function deletarProduto(id) {
    if (!confirm('Tem certeza que deseja deletar este produto?')) {
        return;
    }
    try {
        const resposta = await fetch(`/produtos/${id}`, {
            method: 'DELETE'
        });
        
        if (!resposta.ok) {
            const erro = await resposta.json();
            throw new Error(erro.error || 'Erro ao deletar produto');
        }
        
        mostrarMensagem('Produto removido com sucesso!', 'sucesso');
        carregarProdutos();
        
    } catch (erro) {
        console.error('Erro:', erro);
        mostrarMensagem('Erro: ' + erro.message, 'erro');
    }
}

// ========================================
// EXIBIÇÃO DE DADOS
// ========================================

// Exibe a tabela de produtos
function exibirTabela(produtos) {
    const productsList = document.getElementById('clientsList');
    
    let html = `
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nome</th>
                    <th>Preço</th>
                    <th>Categoria</th>
                    <th>Estoque</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    produtos.forEach(p => {
        // Nota: O Postgres costuma retornar chaves em minúsculas (idprod, nomeprod...)
        html += `
            <tr>
                <td>#${p.idprod}</td>
                <td>${p.nomeprod}</td>
                <td>${formatarMoeda(p.preco)}</td>
                <td>${p.catprod}</td>
                <td>${p.estoque} un.</td>
                <td class="acoes">
                    <button class="btn btn-edit" onclick="editarProduto(${JSON.stringify(p).replace(/"/g, '&quot;')})">✏️ Editar</button>
                    <button class="btn btn-danger" onclick="deletarProduto(${p.idprod})">🗑️ Deletar</button>
                </td>
            </tr>
        `;
    });
    
    html += `</tbody></table>`;
    productsList.innerHTML = html;
}

// Carrega os dados do produto no formulário para edição
function editarProduto(p) {
    produtoEmEdicao = p.idprod;
    
    document.getElementById('nomeProd').value = p.nomeprod;
    document.getElementById('preco').value = p.preco;
    document.getElementById('catProd').value = p.catprod;
    document.getElementById('modelo').value = p.modelo;
    document.getElementById('fabricante').value = p.fabricante;
    document.getElementById('estoque').value = p.estoque;
    document.getElementById('locall').value = p.locall;
    
    document.querySelector('.form-section h2').textContent = `Editando Produto #${p.idprod}`;
    document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
}

// ========================================
// BUSCA E FILTRO
// ========================================

async function buscarProdutos(tipo, valor) {
    const loadingMessage = document.getElementById('loadingMessage');
    const emptyMessage = document.getElementById('emptyMessage');
    const productsList = document.getElementById('clientsList');
   
    loadingMessage.style.display = 'block';
    productsList.innerHTML = '';
   
    try {
        let url = tipo === 'nome' 
            ? `/produtos/buscar/nome/${encodeURIComponent(valor)}` 
            : `/produtos/buscar/id/${valor}`;

        const resposta = await fetch(url);
        if (!resposta.ok) throw new Error('Erro ao buscar produtos');
       
        let dados = await resposta.json();
        let produtos = Array.isArray(dados) ? dados : (dados ? [dados] : []);

        loadingMessage.style.display = 'none';
       
        if (produtos.length === 0) {
            emptyMessage.style.display = 'block';
        } else {
            emptyMessage.style.display = 'none';
            exibirTabela(produtos);
        }
    } catch (erro) {
        loadingMessage.style.display = 'none';
        emptyMessage.style.display = 'block';
        console.error('Erro:', erro);
        mostrarMensagem('Erro ao buscar os produtos.', 'erro');
    }
}

function filtrarProdutos() {
    const searchInput = document.getElementById('searchInput');
    const searchType = document.getElementById('searchType');
    const valor = searchInput.value.trim();
    
    if (valor === '') {
        carregarProdutos();
    } else {
        buscarProdutos(searchType.value, valor);
    }
}

// ========================================
// EVENT LISTENERS
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    carregarProdutos();
    
    document.getElementById('clientForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const dados = {
            nomeProd: document.getElementById('nomeProd').value.trim(),
            preco: parseFloat(document.getElementById('preco').value),
            catProd: document.getElementById('catProd').value.trim(),
            modelo: document.getElementById('modelo').value.trim(),
            fabricante: document.getElementById('fabricante').value.trim(),
            estoque: parseInt(document.getElementById('estoque').value),
            locall: document.getElementById('locall').value.trim()
        };
        
        // Validação básica
        if (!dados.nomeProd || isNaN(dados.preco)) {
            mostrarMensagem('Por favor, preencha os campos obrigatórios!', 'erro');
            return;
        }
        
        if (produtoEmEdicao) {
            atualizarProduto(produtoEmEdicao, dados);
        } else {
            criarProduto(dados);
        }
    });
    
    document.getElementById('btnLimpar').addEventListener('click', limparFormulario);
    document.getElementById('btnRecarregar').addEventListener('click', carregarProdutos);
    document.getElementById('btnBuscar').addEventListener('click', filtrarProdutos);
    
    document.getElementById('searchInput').addEventListener('keyup', (e) => {
        if (e.key === 'Enter') filtrarProdutos();
    });
    
    document.getElementById('modalMessage').addEventListener('click', function(e) {
        if (e.target === this) fecharModal();
    });
});