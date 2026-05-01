// ===== VARIÁVEIS GLOBAIS =====
let dadosOperacoes = [];

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', function() {
    atualizarData();
    carregarDados();
    
    // Event listeners
    document.getElementById('operacao').addEventListener('change', function() {
        atualizarSegmentos();
    });
    
    document.getElementById('segmento').addEventListener('change', function() {
        atualizarDashboard();
    });
});

// ===== ATUALIZAR DATA =====
function atualizarData() {
    const hoje = new Date();
    const opcoes = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dataFormatada = hoje.toLocaleDateString('pt-BR', opcoes);
    const elemento = document.getElementById('dataAtual');
    if (elemento) {
        elemento.textContent = 'Atualizado em: ' + dataFormatada;
    }
}

// ===== CARREGAR DADOS DO JSON =====
function carregarDados() {
    fetch('dados.json')
        .then(function(response) {
            if (!response.ok) {
                throw new Error('Erro ao carregar dados');
            }
            return response.json();
        })
        .then(function(data) {
            dadosOperacoes = data;
            console.log('Dados carregados');
        })
        .catch(function(error) {
            console.error('Erro:', error);
            mostrarErro('Erro ao carregar dados');
        });
}

// ===== ATUALIZAR SEGMENTOS =====
function atualizarSegmentos() {
    const operacao = document.getElementById('operacao').value;
    const segmentoSelect = document.getElementById('segmento');
    
    segmentoSelect.innerHTML = '<option value="">Selecione um segmento...</option>';
    segmentoSelect.disabled = true;
    
    if (!operacao) {
        limparConteudo();
        return;
    }
    
    var dadosOp = null;
    for (var i = 0; i < dadosOperacoes.length; i++) {
        if (dadosOperacoes[i].operacao === operacao) {
            dadosOp = dadosOperacoes[i];
            break;
        }
    }
    
    if (!dadosOp) {
        return;
    }
    
    for (var j = 0; j < dadosOp.segmentos.length; j++) {
        var seg = dadosOp.segmentos[j];
        var option = document.createElement('option');
        option.value = seg.segmento;
        option.textContent = seg.segmento;
        segmentoSelect.appendChild(option);
    }
    
    segmentoSelect.disabled = false;
    limparConteudo();
}

// ===== ATUALIZAR DASHBOARD =====
function atualizarDashboard() {
    const operacao = document.getElementById('operacao').value;
    const segmento = document.getElementById('segmento').value;
    
    if (!operacao || !segmento) {
        limparConteudo();
        return;
    }
    
    var dadosOp = null;
    for (var i = 0; i < dadosOperacoes.length; i++) {
        if (dadosOperacoes[i].operacao === operacao) {
            dadosOp = dadosOperacoes[i];
            break;
        }
    }
    
    if (!dadosOp) {
        return;
    }
    
    var dadosSeg = null;
    for (var j = 0; j < dadosOp.segmentos.length; j++) {
        if (dadosOp.segmentos[j].segmento === segmento) {
            dadosSeg = dadosOp.segmentos[j];
            break;
        }
    }
    
    if (!dadosSeg) {
        return;
    }
    
    // Montar HTML com cards
    var html = '<div class="segmento-info">';
    html += '<h3>Segmento</h3>';
    html += '<p class="segmento-value">' + dadosSeg.segmento + '</p>';
    html += '</div>';
    
    html += '<div class="indicators-grid">';
    
    // Adicionar cards dos indicadores
    for (var k = 0; k < dadosSeg.indicadores.length; k++) {
        var ind = dadosSeg.indicadores[k];
        html += '<div class="indicator-card">';
        html += '<div class="card-name">' + ind.nome + '</div>';
        html += '<div class="card-value">' + ind.meta + '</div>';
        html += '</div>';
    }
    
    html += '</div>';
    
    document.getElementById('conteudo').innerHTML = html;
}

// ===== LIMPAR FILTROS =====
function limparFiltros() {
    document.getElementById('operacao').value = '';
    document.getElementById('segmento').value = '';
    document.getElementById('segmento').disabled = true;
    limparConteudo();
}

// ===== LIMPAR CONTEÚDO =====
function limparConteudo() {
    var conteudo = document.getElementById('conteudo');
    var html = '<div class="placeholder">';
    html += '<p>Selecione uma operação e segmento para visualizar as metas</p>';
    html += '</div>';
    conteudo.innerHTML = html;
}

// ===== MOSTRAR ERRO =====
function mostrarErro(mensagem) {
    var conteudo = document.getElementById('conteudo');
    var html = '<div class="placeholder" style="color: #ff3333;">';
    html += '<p>Erro: ' + mensagem + '</p>';
    html += '</div>';
    conteudo.innerHTML = html;
}
