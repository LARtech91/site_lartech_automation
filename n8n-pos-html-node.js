// Nó Code para ser executado APÓS a geração do HTML
// Recebe apenas o HTML processado e gera mensagem WhatsApp simples

console.log('=== DEBUG PÓS-HTML INÍCIO ===');

// Pegar os dados de entrada
let inputData;
let htmlGerado;

// Estratégia 1: Tentar $input.first()
if (typeof $input !== 'undefined' && $input.first()) {
  inputData = $input.first().json || $input.first();
  console.log('✅ Usando $input.first()');
} else {
  inputData = $json;
  console.log('✅ Usando $json');
}

console.log('Tipo de inputData:', typeof inputData);
console.log('Chaves disponíveis:', Object.keys(inputData || {}));

// Buscar HTML em diferentes possíveis locais
htmlGerado = inputData.html || 
             inputData.html_final || 
             inputData.html_content ||
             inputData.content ||
             inputData;

console.log('HTML encontrado:', !!htmlGerado);

// Se não temos HTML, verificar se o inputData é o próprio HTML
if (!htmlGerado && typeof inputData === 'string' && inputData.includes('<!DOCTYPE html>')) {
  htmlGerado = inputData;
  console.log('✅ HTML detectado como string direta');
}

// Verificar se temos HTML válido
if (!htmlGerado || typeof htmlGerado !== 'string') {
  console.log('❌ ERRO: HTML não encontrado ou inválido');
  console.log('inputData recebido:', inputData);
  throw new Error('HTML não encontrado. Verifique se o nó anterior está gerando o HTML corretamente.');
}

// Extrair informações básicas do HTML usando regex simples
const extrairInfoDoHTML = (html) => {
  const extrairTexto = (regex) => {
    const match = html.match(regex);
    return match ? match[1].trim() : '';
  };

  // Extrair informações comuns do HTML
  const cliente = extrairTexto(/cliente-valor.*?>([^<]+)</i) || 
                 extrairTexto(/nome.*?>([^<]+)</i) || 
                 'Cliente';
                 
  const empresa = extrairTexto(/empresa.*?>([^<]+)</i) || 
                 extrairTexto(/cliente-valor.*?empresa.*?>([^<]+)</i) || 
                 'Empresa';
                 
  const proposta = extrairTexto(/proposta.*?#([^<]+)</i) || 
                  extrairTexto(/LA-\d+/i) || 
                  'LA-' + Date.now().toString().slice(-4);

  return {
    cliente: cliente,
    empresa: empresa,
    proposta: proposta,
    data: new Date().toLocaleDateString('pt-BR')
  };
};

const infoExtraida = extrairInfoDoHTML(htmlGerado);

console.log('✅ Informações extraídas do HTML:');
console.log('Cliente:', infoExtraida.cliente);
console.log('Empresa:', infoExtraida.empresa);
console.log('Proposta:', infoExtraida.proposta);

// Função para gerar mensagem WhatsApp simplificada
function gerarMensagemWhatsApp(info) {
  return `🤖 *Proposta de Automação com IA - LARtech*

Olá *${info.cliente}*! 

Preparamos uma proposta personalizada de automação para a *${info.empresa}* baseada no diagnóstico realizado.

✨ *Destaques da sua proposta:*
• Solução sob medida para seu negócio
• Economia de tempo e aumento de vendas
• Implementação rápida e suporte completo
• Tecnologia de ponta em automação

📄 *Proposta ${info.proposta} em anexo*

⏰ *Proposta gerada em:* ${info.data}

Ficou com alguma dúvida? Estou aqui para esclarecer! 

#AutomaçãoIA #LARtech #WhatsAppBusiness`;
}

// Gerar a mensagem WhatsApp
const mensagemWhatsApp = gerarMensagemWhatsApp(infoExtraida);

// Preparar dados para envio via WhatsApp
const dadosParaWhatsApp = {
  numero_cliente: '',
  nome_cliente: infoExtraida.cliente,
  empresa_cliente: infoExtraida.empresa,
  mensagem_completa: mensagemWhatsApp
};

// Retornar dados necessários para conversão em PDF
const resultado = {
  // HTML processado (para conversão em PDF)
  html_final: htmlGerado,

  // HTML em formato para base64 (facilitando a conversão)
  html_content: htmlGerado,

  // Mensagem formatada para WhatsApp (sem link)
  mensagem_whatsapp: mensagemWhatsApp,

  // Dados estruturados para WhatsApp
  whatsapp: dadosParaWhatsApp,

  // Dados da proposta para referência
  proposta_info: {
    numero: infoExtraida.proposta,
    cliente: infoExtraida.cliente,
    empresa: infoExtraida.empresa,
    data: infoExtraida.data
  },

  // Dados para possível integração com CRM
  dados_crm: {
    cliente: infoExtraida.cliente,
    empresa: infoExtraida.empresa,
    proposta: infoExtraida.proposta,
    status: 'proposta_gerada',
    data_proposta: infoExtraida.data
  },

  // Metadados de processamento
  processado_em: new Date().toISOString(),
  ready_for_pdf: true,
  
  // Informações extraídas do HTML
  info_extraida: infoExtraida
};

console.log('✅ Processamento pós-HTML concluído com sucesso!');
console.log('Cliente processado:', infoExtraida.cliente);
console.log('Empresa processada:', infoExtraida.empresa);
console.log('HTML pronto para conversão PDF:', !!resultado.html_content);

console.log('=== DEBUG PÓS-HTML FIM ===');

return resultado;