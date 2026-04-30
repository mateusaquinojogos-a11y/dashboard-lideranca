// ===== VARIÁVEIS GLOBAIS =====
let dadosOperacoes = [];

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', () => {
    atualizarData();
    carregarDados();
    
    // Event listeners
    document.getElementById('operacao').addEventListener('change', atualizarSegmentos);
    document.getElementById('segmento').addEventListener('change', atualizarDashboard);
});

// ===== ATUALIZAR DATA =====
function atualizarData() {
    const hoje = new Date();
    const opcoes = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dataFormatada = hoje.toLocaleDateString('pt-BR', opcoes);
    document.getElementById('dataAtual').textContent = `Atualizado em: ${dataFormatada}`;
}

// ===== CARREGAR DADOS DO JSON =====
async function carregarDados() {
    try {
        const response = await fetch('dados.json', {
            cache: 'no-store',
            credentials: 'same-origin'
        });
        
        if (!response.ok) throw new Error('Erro ao carregar dados');
        
        dadosOperacoes = await response.json();
        console.log('Dados carregados com sucesso');
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
        mostrarErro('Erro ao carregar dados. Tente recarregar a página.');
    }
}

// ===== ATUALIZAR SEGMENTOS =====
function atualizarSegmentos() {
    const operacao = document.getElementById('operacao').value;
    const segmentoSelect = document.getElementById('segmento');
    
    // Limpar select
    segmentoSelect.innerHTML = '<option value="">Selecione um segmento...</option>';
    segmentoSelect.disabled = true;
    
    if (!operacao) {
        limparConteudo();
        return;
    }
    
    // Encontrar operação
    const dadosOp = dadosOperacoes.find(op => op.operacao === operacao);
    
    if (!dadosOp) return;
    
    // Preencher segmentos
    dadosOp.segmentos.forEach(seg => {
        const option = document.createElement('option');
        option.value = seg.segmento;
        option.textContent = seg.segmento;
        segmentoSelect.appendChild(option);
    });
    
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
    
    // Encontrar dados
    const dadosOp = dadosOperacoes.find(op => op.operacao === operacao);
    const dadosSeg = dadosOp.segmentos.find(seg => seg.segmento === segmento);
    
    if (!dadosSeg) return;
    
    // Montar HTML
    let html = `
        <div class="segmento-info">
            <h3>Segmento</h3>
            <p class="segmento-value">${dadosSeg.segmento}</p>
        </div>
        
        <div class="table-container">
            <table class="indicators-table">
                <thead>
                    <tr>
                        <th>Indicador</th>
                        <th>Meta - Maio 2026</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    // Adicionar indicadores
    dadosSeg.indicadores.forEach(ind => {
        html += `
            <tr>
                <td>${ind.nome}</td>
                <td class="value-neutral">${ind.meta}</td>
            </tr>
        `;
    });
    
    html += `
                </tbody>
            </table>
        </div>
    `;
    
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
    document.getElementById('conteudo').innerHTML = `
        <div class="placeholder">
            <p>📊 Selecione uma operação e segmento para visualizar as metas</p>
        </div>
    `;
}

// ===== MOSTRAR ERRO =====
function mostrarErro(mensagem) {
    document.getElementById('conteudo').innerHTML = `
        <div class="placeholder" style="color: #f44336;">
            <p>⚠️ ${mensagem}</p>
        </div>
    `;
}

// ===== SEGURANÇA: Desabilitar console em produção =====
if (document.location.hostname !== 'localhost' && 
    !document.location.hostname.includes('127.0.0.1')) {
    console.log = function() {};
    console.warn = function() {};
    console.error = function() {};
}
