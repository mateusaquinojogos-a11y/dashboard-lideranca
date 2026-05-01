let dadosOperacoes = [];

document.addEventListener('DOMContentLoaded', function() {
    atualizarData();
    carregarDados();
    document.getElementById('operacao').addEventListener('change', atualizarSegmentos);
    document.getElementById('segmento').addEventListener('change', atualizarDashboard);
});

function atualizarData() {
    const hoje = new Date();
    const opcoes = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dataFormatada = hoje.toLocaleDateString('pt-BR', opcoes);
    document.getElementById('dataAtual').textContent = 'Atualizado em: ' + dataFormatada;
}

function carregarDados() {
    fetch('dados.json')
        .then(function(response) { return response.json(); })
        .then(function(data) { dadosOperacoes = data; })
        .catch(function(error) { console.error('Erro:', error); });
}

function atualizarSegmentos() {
    const operacao = document.getElementById('operacao').value;
    const segmentoSelect = document.getElementById('segmento');
    segmentoSelect.innerHTML = '<option value="">Selecione um segmento...</option>';
    segmentoSelect.disabled = true;
    
    if (!operacao) { limparConteudo(); return; }
    
    const dadosOp = dadosOperacoes.find(op => op.operacao === operacao);
    if (!dadosOp) return;
    
    dadosOp.segmentos.forEach(seg => {
        const option = document.createElement('option');
        option.value = seg.segmento;
        option.textContent = seg.segmento;
        segmentoSelect.appendChild(option);
    });
    
    segmentoSelect.disabled = false;
    limparConteudo();
}

function atualizarDashboard() {
    const operacao = document.getElementById('operacao').value;
    const segmento = document.getElementById('segmento').value;
    
    if (!operacao || !segmento) { limparConteudo(); return; }
    
    const dadosOp = dadosOperacoes.find(op => op.operacao === operacao);
    const dadosSeg = dadosOp.segmentos.find(seg => seg.segmento === segmento);
    
    if (!dadosSeg) return;
    
    let html = '<div class="segmento-info"><h3>Segmento</h3><p class="segmento-value">' + dadosSeg.segmento + '</p></div>';
    html += '<div class="indicators-grid">';
    
    dadosSeg.indicadores.forEach(ind => {
        html += '<div class="indicator-card"><div class="card-name">' + ind.nome + '</div><div class="card-value">' + ind.meta + '</div></div>';
    });
    
    html += '</div>';
    document.getElementById('conteudo').innerHTML = html;
}

function limparFiltros() {
    document.getElementById('operacao').value = '';
    document.getElementById('segmento').value = '';
    document.getElementById('segmento').disabled = true;
    limparConteudo();
}

function limparConteudo() {
    document.getElementById('conteudo').innerHTML = '<div class="placeholder"><p>Selecione uma operação e segmento para visualizar as metas</p></div>';
}
