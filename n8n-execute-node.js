
// Código para o nó Execute do n8n
// Processa os dados do diagnóstico e prepara para o HTML da proposta

// Verificar estrutura dos dados de entrada com debugging completo
const inputJson = $json;
console.log('=== DEBUG INÍCIO ===');
console.log('Tipo de $json:', typeof inputJson);
console.log('Dados de entrada recebidos (completo):', JSON.stringify(inputJson, null, 2));
console.log('Chaves disponíveis em $json:', Object.keys(inputJson || {}));

// Verificar se existe $input e suas propriedades
console.log('Existe $input?', typeof $input !== 'undefined');
if (typeof $input !== 'undefined') {
  console.log('$input.all():', $input.all());
  console.log('$input.first():', $input.first());
}

// Múltiplas estratégias para encontrar os dados do formulário
let dadosOriginais;
let fonteDados = 'desconhecida';

// Estratégia 1: Dados diretos em $json
if (inputJson && inputJson.nome && inputJson.empresa) {
  dadosOriginais = inputJson;
  fonteDados = 'direto_json';
  console.log('✅ Dados encontrados: Direto em $json');
}
// Estratégia 2: Dados em dados_formulario
else if (inputJson && inputJson.dados_formulario) {
  dadosOriginais = inputJson.dados_formulario;
  fonteDados = 'dados_formulario';
  console.log('✅ Dados encontrados: Em dados_formulario');
}
// Estratégia 3: Dados em formData ou form_data
else if (inputJson && (inputJson.formData || inputJson.form_data)) {
  dadosOriginais = inputJson.formData || inputJson.form_data;
  fonteDados = 'form_data';
  console.log('✅ Dados encontrados: Em formData/form_data');
}
// Estratégia 4: Dados dentro de um objeto body
else if (inputJson && inputJson.body && typeof inputJson.body === 'object') {
  dadosOriginais = inputJson.body;
  fonteDados = 'body';
  console.log('✅ Dados encontrados: Em body');
}
// Estratégia 5: Dados como string JSON que precisa ser parseada
else if (inputJson && typeof inputJson.body === 'string') {
  try {
    dadosOriginais = JSON.parse(inputJson.body);
    fonteDados = 'body_string_parsed';
    console.log('✅ Dados encontrados: Body string parseado');
  } catch (e) {
    console.log('❌ Falha ao parsear body string:', e.message);
  }
}
// Estratégia 6: Buscar em $input se disponível
else if (typeof $input !== 'undefined' && $input.first()) {
  const firstInput = $input.first();
  if (firstInput.json && firstInput.json.nome) {
    dadosOriginais = firstInput.json;
    fonteDados = 'input_first_json';
    console.log('✅ Dados encontrados: Em $input.first().json');
  } else if (firstInput.nome) {
    dadosOriginais = firstInput;
    fonteDados = 'input_first_direct';
    console.log('✅ Dados encontrados: Direto em $input.first()');
  }
}

// Verificação final
if (!dadosOriginais || !dadosOriginais.nome || !dadosOriginais.empresa) {
  console.log('❌ ERRO: Dados não encontrados ou incompletos');
  console.log('Dados encontrados:', dadosOriginais);
  console.log('Fonte tentada:', fonteDados);
  console.log('Estrutura disponível:', JSON.stringify(inputJson, null, 2));
  
  throw new Error(`Dados do formulário não encontrados. Fonte: ${fonteDados}. Estrutura disponível: ${JSON.stringify(Object.keys(inputJson || {}))}`);
}

console.log('✅ Dados do formulário localizados com sucesso!');
console.log('Fonte dos dados:', fonteDados);
console.log('Dados extraídos:', JSON.stringify(dadosOriginais, null, 2));
console.log('=== DEBUG FIM ===');

// Função para calcular pontuação de complexidade
function calcularPontuacaoComplexidade(dados) {
  let pontuacao = 0;
  let justificativas = [];

  // 1. VOLUME DE MENSAGENS (peso: 15 pontos)
  const mensagemMap = {
    '1-50': 3,
    '51-100': 6,
    '101-300': 10,
    '301-500': 13,
    '500+': 15
  };
  const pontosMensagens = mensagemMap[dados.mensagens_dia] || 3;
  pontuacao += pontosMensagens;
  justificativas.push(`Volume: ${dados.mensagens_dia} mensagens/dia (+${pontosMensagens} pts)`);

  // 2. QUANTIDADE DE CATEGORIAS DE AUTOMAÇÃO (peso: 20 pontos)
  const categorias = dados.categorias_automacao ? dados.categorias_automacao.split(',').length : 0;
  const pontosCategorias = Math.min(categorias * 4, 20);
  pontuacao += pontosCategorias;
  justificativas.push(`${categorias} categoria(s) de automação (+${pontosCategorias} pts)`);

  // 3. COMPLEXIDADE DOS DADOS (peso: 15 pontos)
  const tiposDados = dados.tipos_dados ? dados.tipos_dados.split(',').length : 0;
  const pontosDados = Math.min(tiposDados * 3, 15);
  pontuacao += pontosDados;
  justificativas.push(`${tiposDados} tipo(s) de dados para gerenciar (+${pontosDados} pts)`);

  // 4. NÚMERO DE ATENDENTES (peso: 12 pontos)
  const atendenteMap = {
    '1': 2,
    '2-3': 4,
    '4-5': 7,
    '6-10': 10,
    '10+': 12
  };
  const pontosAtendentes = atendenteMap[dados.num_atendentes] || 2;
  pontuacao += pontosAtendentes;
  justificativas.push(`${dados.num_atendentes} atendente(s) (+${pontosAtendentes} pts)`);

  // 5. URGÊNCIA (peso: 8 pontos)
  const urgenciaMap = {
    'imediata': 8,
    'rapida': 6,
    'normal': 4,
    'planejada': 2
  };
  const pontosUrgencia = urgenciaMap[dados.urgencia] || 4;
  pontuacao += pontosUrgencia;
  justificativas.push(`Urgência ${dados.urgencia} (+${pontosUrgencia} pts)`);

  // 6. BASE DE DADOS (peso: 8 pontos)
  const baseDadosMap = {
    'nao': 8, // Precisa estruturar = mais complexo
    'em_parte': 5,
    'sim': 2
  };
  const pontosBaseDados = baseDadosMap[dados.possui_base_dados] || 4;
  pontuacao += pontosBaseDados;
  justificativas.push(`Base de dados: ${dados.possui_base_dados} (+${pontosBaseDados} pts)`);

  return {
    pontuacao,
    justificativas,
    percentualComplexidade: Math.round((pontuacao / 78) * 100) // Nova pontuação máxima é 78
  };
}

// Função para determinar plano recomendado com base na pontuação percentual
function determinarPlanoRecomendado(pontuacao, dadosOriginais) {
  // Calcula o percentual da pontuação máxima possível (78 pontos)
  const percentualComplexidade = Math.round((pontuacao / 78) * 100);
  
  // Lógica baseada em percentual e fatores específicos
  let planoRecomendado = '';
  let razao = '';
  let adequacao = '';
  
  // Fatores que forçam plano superior
  const temAltaUrgencia = dadosOriginais.urgencia === 'imediata';
  const temMuitosAtendentes = ['6-10', '10+'].includes(dadosOriginais.num_atendentes);
  const temMuitasMensagens = ['301-500', '500+'].includes(dadosOriginais.mensagens_dia);
  const temMuitasCategorias = dadosOriginais.categorias_automacao ? 
    dadosOriginais.categorias_automacao.split(',').length >= 4 : false;
  
  // Bronze: até 35% de complexidade OU configuração muito básica
  if (percentualComplexidade <= 35 && !temAltaUrgencia && !temMuitosAtendentes) {
    planoRecomendado = 'Bronze';
    razao = 'Ideal para começar com automação básica, atende suas necessidades atuais sem complexidade excessiva';
    adequacao = 'Básica';
  }
  // Ouro: alta complexidade OU fatores críticos
  else if (percentualComplexidade >= 65 || temAltaUrgencia || temMuitosAtendentes || 
           (temMuitasMensagens && temMuitasCategorias)) {
    planoRecomendado = 'Ouro';
    razao = 'Sua operação demanda solução completa devido à alta complexidade, volume ou urgência identificados';
    adequacao = 'Avançada';
  }
  // Prata: casos intermediários
  else {
    planoRecomendado = 'Prata';
    razao = 'Suas necessidades exigem recursos intermediários com excelente relação custo-benefício';
    adequacao = 'Intermediária';
  }
  
  return {
    plano: planoRecomendado,
    razao: razao,
    adequacao: adequacao,
    percentual: percentualComplexidade,
    fatores_decisivos: {
      alta_urgencia: temAltaUrgencia,
      muitos_atendentes: temMuitosAtendentes,
      alto_volume: temMuitasMensagens,
      muitas_categorias: temMuitasCategorias
    }
  };
}

// Função para formatar campos específicos
function formatarCampos(dados) {
  return {
    ...dados,
    // Formatar nome com capitalização adequada
    nome_formatado: dados.nome ? dados.nome.split(' ').map(palavra => 
      palavra.charAt(0).toUpperCase() + palavra.slice(1).toLowerCase()
    ).join(' ') : '',

    // Formatar empresa
    empresa_formatada: dados.empresa ? dados.empresa.split(' ').map(palavra => 
      palavra.charAt(0).toUpperCase() + palavra.slice(1).toLowerCase()
    ).join(' ') : '',

    // Formatar cidade/estado
    cidade_estado_formatada: dados.cidade_estado ? dados.cidade_estado.split('/').map(parte =>
      parte.trim().split(' ').map(palavra =>
        palavra.charAt(0).toUpperCase() + palavra.slice(1).toLowerCase()
      ).join(' ')
    ).join('/') : '',

    // Converter urgência em texto descritivo
    urgencia_descritiva: {
      'imediata': 'Imediata (até 15 dias)',
      'rapida': 'Rápida (até 30 dias)', 
      'normal': 'Normal (até 60 dias)',
      'planejada': 'Planejada (após 60 dias)'
    }[dados.urgencia] || dados.urgencia,

    // Converter investimento em texto descritivo
    investimento_descritivo: {
      'ate-2k': 'Até R$ 2.000/mês',
      '2k-5k': 'R$ 2.000 a R$ 5.000/mês',
      '5k-10k': 'R$ 5.000 a R$ 10.000/mês',
      '10k+': 'Acima de R$ 10.000/mês',
      'avaliar': 'Precisa avaliar a proposta'
    }[dados.investimento] || dados.investimento,

    // Formatar tipo de WhatsApp
    tipo_whatsapp_descritivo: {
      'business': 'WhatsApp Business',
      'api': 'API Oficial do WhatsApp',
      'comum': 'WhatsApp Comum',
      'nao_sei': 'Não informado'
    }[dados.tipo_whatsapp] || dados.tipo_whatsapp,

    // Status da base de dados
    base_dados_status: {
      'sim': 'Possui sistema organizado',
      'nao': 'Precisa estruturar',
      'em_parte': 'Usa planilhas simples'
    }[dados.possui_base_dados] || dados.possui_base_dados
  };
}

// Função para gerar insights personalizados
function gerarInsights(dados, analiseComplexidade) {
  const insights = [];

  // Insight sobre volume de mensagens
  const volumeNum = parseInt(dados.mensagens_dia.split('-')[1]) || 50;
  if (volumeNum > 100) {
    insights.push(`Com ${dados.mensagens_dia} mensagens diárias, você está perdendo oportunidades significativas fora do horário ${dados.horario_funcionamento}`);
  }

  // Insight sobre automação atual
  if (dados.ja_utiliza_automacao === 'nao') {
    insights.push('Como primeira experiência com automação, recomendamos implementação gradual com acompanhamento especializado');
  }

  // Insight sobre base de dados
  if (dados.possui_base_dados === 'nao') {
    insights.push('A estruturação da base de dados será fundamental para maximizar os resultados da automação');
  }

  // Insight sobre urgência
  if (dados.urgencia === 'imediata') {
    insights.push('Devido à urgência, podemos priorizar a implementação das funcionalidades mais críticas primeiro');
  }

  return insights;
}

// Processar os dados
const dadosFormatados = formatarCampos(dadosOriginais);
const analiseComplexidade = calcularPontuacaoComplexidade(dadosOriginais);
const planoRecomendado = determinarPlanoRecomendado(analiseComplexidade.pontuacao, dadosOriginais);
const insights = gerarInsights(dadosOriginais, analiseComplexidade);

// Calcular métricas de ROI estimado
const metricas = {
  economia_tempo_dia: Math.round((parseInt(dadosOriginais.num_atendentes?.split('-')[0]) || 1) * 2), // 2h por atendente
  aumento_vendas_estimado: '35-50%',
  tempo_resposta: '30 segundos',
  disponibilidade: '24/7',
  precisao_orçamentos: '95%'
};

// Gerar dados processados para o HTML
const dadosProcessados = {
  // Dados originais formatados
  dados_formulario: dadosFormatados,

  // Análise de complexidade
  analise: {
    pontuacao_total: analiseComplexidade.pontuacao,
    percentual: analiseComplexidade.percentualComplexidade,
    justificativas: analiseComplexidade.justificativas,
    nivel_complexidade: planoRecomendado.adequacao
  },

  // Recomendação de plano
  recomendacao: {
    plano: planoRecomendado.plano,
    razao: planoRecomendado.razao,
    adequacao: planoRecomendado.adequacao
  },

  // Insights personalizados
  insights: insights,

  // Métricas estimadas
  metricas: metricas,

  // Informações de proposta
  proposta: {
    numero: `LA-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
    data: new Date().toLocaleDateString('pt-BR'),
    validade: new Date(Date.now() + (15 * 24 * 60 * 60 * 1000)).toLocaleDateString('pt-BR'), // 15 dias
    desconto_disponivel: analiseComplexidade.pontuacao > 50 ? 600 : 300 // Desconto baseado na complexidade
  },

  // Dados técnicos
  implementacao: {
    prazo_estimado: dadosOriginais.urgencia === 'imediata' ? '7-10 dias' : '10-15 dias',
    suporte_recomendado: analiseComplexidade.pontuacao > 60 ? 'Prioritário 24/7' : 'Business',
    treinamento_necessario: dadosOriginais.ja_utiliza_automacao === 'nao' ? 'Completo' : 'Básico'
  }
};

// Gerar link personalizado para a proposta
function gerarLinkProposta(dados, numeroProposta) {
  // URL base do projeto LARtech
  const baseURL = 'https://www.lartechautomation.com/proposta.html';
  
  // Criar parâmetros manualmente (compatível com n8n)
  const params = [];
  
  // Função para encodar parâmetros
  function encodeParam(key, value) {
    return encodeURIComponent(key) + '=' + encodeURIComponent(value);
  }
  
  // Adicionar parâmetros personalizados
  if (dados.empresa) {
    params.push(encodeParam('empresa', dados.empresa));
  }
  
  if (dados.nome_formatado || dados.nome) {
    params.push(encodeParam('cliente', dados.nome_formatado || dados.nome));
  }
  
  if (numeroProposta) {
    params.push(encodeParam('proposta', numeroProposta));
  }
  
  // Adicionar referência para tracking
  const ref = `whatsapp-${Date.now()}`;
  params.push(encodeParam('ref', ref));
  
  return params.length > 0 ? `${baseURL}?${params.join('&')}` : baseURL;
}

// Gerar mensagem para WhatsApp
function gerarMensagemWhatsApp(dados, linkProposta) {
  const nomeCliente = dados.nome_formatado || dados.nome;
  const empresa = dados.empresa;
  
  return `🤖 *Proposta de Automação com IA - LARtech*

Olá *${nomeCliente}*! 

Preparamos uma proposta personalizada de automação para a *${empresa}* baseada no diagnóstico realizado.

📋 *Sua Proposta Personalizada:*
${linkProposta}

✨ *Destaques da sua proposta:*
• Solução recomendada: *${dadosProcessados.recomendacao.plano}*
• Economia estimada: *${dadosProcessados.metricas.economia_tempo_dia}h/dia*
• Aumento de vendas: *${dadosProcessados.metricas.aumento_vendas_estimado}*
• Implementação: *${dadosProcessados.implementacao.prazo_estimado}*

⏰ *Proposta válida até:* ${dadosProcessados.proposta.validade}

Ficou com alguma dúvida? Estou aqui para esclarecer! 

#AutomaçãoIA #LARtech #WhatsAppBusiness`;
}

// Gerar link e mensagem
const linkProposta = gerarLinkProposta(dadosFormatados, dadosProcessados.proposta.numero);
const mensagemWhatsApp = gerarMensagemWhatsApp(dadosFormatados, linkProposta);

// Estrutura final para retorno - garantindo compatibilidade com próximo nó
const retornoFinal = {
  // Dados processados na estrutura esperada
  dados_processados: dadosProcessados,
  
  // Dados originais para backup
  original: dadosOriginais,
  
  // Também incluir dados diretos para compatibilidade
  dados_formulario: dadosFormatados,
  analise: dadosProcessados.analise,
  recomendacao: dadosProcessados.recomendacao,
  proposta: dadosProcessados.proposta,
  metricas: dadosProcessados.metricas,
  implementacao: dadosProcessados.implementacao,
  
  // Metadados de processamento
  processado_em: new Date().toISOString(),
  fonte_dados: fonteDados,
  
  // Dados para envio via WhatsApp
  whatsapp: {
    link_proposta: linkProposta,
    mensagem_formatada: mensagemWhatsApp,
    numero_proposta: dadosProcessados.proposta.numero,
    cliente: {
      nome: dadosFormatados.nome_formatado || dadosFormatados.nome,
      empresa: dadosFormatados.empresa_formatada || dadosFormatados.empresa,
      telefone: dadosFormatados.whatsapp || dadosFormatados.telefone
    }
  }
};

console.log('✅ Processamento concluído com sucesso!');
console.log('Estrutura de retorno:', JSON.stringify(Object.keys(retornoFinal), null, 2));
console.log('Fonte dos dados utilizada:', fonteDados);

return retornoFinal;
