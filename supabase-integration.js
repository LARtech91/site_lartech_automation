
// Integração do Supabase com os formulários existentes
import { salvarDiagnostico, salvarContato } from './supabase-config.js'

// Função para integrar com o formulário de diagnóstico
export function integrarFormularioDiagnostico() {
  const form = document.getElementById('diagnostico-form')
  
  if (form) {
    // Interceptar o envio do formulário
    const originalSubmit = form.onsubmit
    
    form.onsubmit = async function(event) {
      event.preventDefault()
      
      try {
        // Mostrar loading
        mostrarLoading('Salvando diagnóstico...')
        
        // Coletar dados do formulário
        const formData = new FormData(form)
        const dadosFormulario = Object.fromEntries(formData.entries())
        
        // Processar dados conforme necessário
        const dadosProcessados = processarDadosDiagnostico(dadosFormulario)
        
        // Salvar no Supabase
        const resultado = await salvarDiagnostico(dadosProcessados)
        
        // Continuar com o fluxo original (se existir)
        if (originalSubmit) {
          await originalSubmit.call(this, event)
        }
        
        console.log('Diagnóstico salvo no Supabase:', resultado)
        
        // Mostrar sucesso
        mostrarSucesso('Diagnóstico salvo com sucesso!')
        
      } catch (error) {
        console.error('Erro ao salvar diagnóstico:', error)
        mostrarErro('Erro ao salvar diagnóstico. Tente novamente.')
      } finally {
        ocultarLoading()
      }
    }
  }
}

// Função para processar dados do diagnóstico
function processarDadosDiagnostico(dadosFormulario) {
  // Calcular pontuação (lógica existente do seu sistema)
  const pontuacao = calcularPontuacao(dadosFormulario)
  const planoRecomendado = determinarPlano(pontuacao)
  
  return {
    ...dadosFormulario,
    pontuacao_total: pontuacao,
    plano_recomendado: planoRecomendado,
    // Processar arrays se necessário
    canais_atendimento: Array.isArray(dadosFormulario.canais_atendimento) 
      ? dadosFormulario.canais_atendimento.join(',')
      : dadosFormulario.canais_atendimento,
    processos_manuais: Array.isArray(dadosFormulario.processos_manuais)
      ? dadosFormulario.processos_manuais.join(',')
      : dadosFormulario.processos_manuais,
    tipos_dados: Array.isArray(dadosFormulario.tipos_dados)
      ? dadosFormulario.tipos_dados.join(',')
      : dadosFormulario.tipos_dados,
    integracoes_necessarias: Array.isArray(dadosFormulario.integracoes_necessarias)
      ? dadosFormulario.integracoes_necessarias.join(',')
      : dadosFormulario.integracoes_necessarias
  }
}

// Função para integrar formulários de contato gerais
export function integrarFormulariosContato() {
  // Buscar todos os formulários de contato
  const formsContato = document.querySelectorAll('.contact-form, #contact-form, [data-form="contato"]')
  
  formsContato.forEach(form => {
    form.addEventListener('submit', async function(event) {
      event.preventDefault()
      
      try {
        mostrarLoading('Enviando mensagem...')
        
        const formData = new FormData(form)
        const dadosContato = {
          nome: formData.get('nome') || formData.get('name'),
          email: formData.get('email'),
          telefone: formData.get('telefone') || formData.get('phone'),
          empresa: formData.get('empresa') || formData.get('company'),
          mensagem: formData.get('mensagem') || formData.get('message'),
          origem: 'formulario_contato'
        }
        
        // Salvar no Supabase
        const resultado = await salvarContato(dadosContato)
        
        console.log('Contato salvo no Supabase:', resultado)
        
        // Limpar formulário
        form.reset()
        
        // Mostrar sucesso
        mostrarSucesso('Mensagem enviada com sucesso! Entraremos em contato em breve.')
        
      } catch (error) {
        console.error('Erro ao enviar contato:', error)
        mostrarErro('Erro ao enviar mensagem. Tente novamente.')
      } finally {
        ocultarLoading()
      }
    })
  })
}

// Funções de UI para feedback visual
function mostrarLoading(mensagem = 'Carregando...') {
  // Remover loading anterior se existir
  ocultarLoading()
  
  const loading = document.createElement('div')
  loading.id = 'supabase-loading'
  loading.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    color: white;
    font-size: 18px;
    font-family: inherit;
  `
  const container = document.createElement('div')
  container.style.cssText = `
    background: #00A6FB;
    padding: 20px 40px;
    border-radius: 10px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    text-align: center;
  `
  
  const spinner = document.createElement('div')
  spinner.style.cssText = `
    width: 40px;
    height: 40px;
    border: 3px solid rgba(255, 255, 255, 0.3);
    border-top: 3px solid white;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 15px;
  `
  
  const text = document.createElement('span')
  text.textContent = mensagem
  
  container.appendChild(spinner)
  container.appendChild(text)
  loading.appendChild(container)
  
  const style = document.createElement('style')
  style.textContent = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `
  loading.appendChild(style)
  
  document.body.appendChild(loading)
}

function ocultarLoading() {
  const loading = document.getElementById('supabase-loading')
  if (loading) {
    loading.remove()
  }
}

function mostrarSucesso(mensagem) {
  mostrarNotificacao(mensagem, 'success')
}

function mostrarErro(mensagem) {
  mostrarNotificacao(mensagem, 'error')
}

function mostrarNotificacao(mensagem, tipo = 'info') {
  const cores = {
    success: '#4CAF50',
    error: '#f44336',
    info: '#00A6FB'
  }
  
  const notificacao = document.createElement('div')
  notificacao.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${cores[tipo]};
    color: white;
    padding: 15px 25px;
    border-radius: 5px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    z-index: 10001;
    font-family: inherit;
    font-size: 14px;
    max-width: 300px;
    animation: slideIn 0.3s ease-out;
  `
  notificacao.textContent = mensagem
  
  // Adicionar animação CSS
  const style = document.createElement('style')
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  `
  document.head.appendChild(style)
  
  document.body.appendChild(notificacao)
  
  // Remover após 5 segundos
  setTimeout(() => {
    if (notificacao.parentNode) {
      notificacao.remove()
    }
  }, 5000)
}

// Funções auxiliares para cálculos (adapte conforme sua lógica existente)
function calcularPontuacao(dados) {
  let pontuacao = 0
  
  // Lógica de pontuação baseada nos seus critérios
  if (dados.volume_atendimento === 'alto') pontuacao += 15
  if (dados.volume_atendimento === 'medio') pontuacao += 10
  if (dados.volume_atendimento === 'baixo') pontuacao += 5
  
  if (dados.tempo_resposta === 'imediato') pontuacao += 20
  if (dados.tempo_resposta === 'rapido') pontuacao += 15
  if (dados.tempo_resposta === 'medio') pontuacao += 10
  
  // Adicione mais critérios conforme necessário
  
  return pontuacao
}

function determinarPlano(pontuacao) {
  if (pontuacao <= 35) return 'Bronze'
  if (pontuacao <= 70) return 'Prata'
  return 'Ouro'
}

// Inicializar integrações quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
  integrarFormularioDiagnostico()
  integrarFormulariosContato()
  console.log('🚀 Integração Supabase inicializada')
})
