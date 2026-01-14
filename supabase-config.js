
// Configuração do cliente Supabase
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Configuração do cliente Supabase usando as credenciais das Secrets
const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_ANON_KEY

// Criar cliente Supabase
export const supabase = createClient(supabaseUrl, supabaseKey)

// Funções de utilidade para interação com o banco

// Função para salvar dados do diagnóstico
export async function salvarDiagnostico(dadosFormulario) {
  try {
    const { data, error } = await supabase
      .from('diagnosticos')
      .insert([
        {
          nome: dadosFormulario.nome,
          email: dadosFormulario.email,
          telefone: dadosFormulario.telefone,
          empresa: dadosFormulario.empresa,
          cargo: dadosFormulario.cargo,
          setor: dadosFormulario.setor,
          tamanho_empresa: dadosFormulario.tamanho_empresa,
          volume_atendimento: dadosFormulario.volume_atendimento,
          canais_atendimento: dadosFormulario.canais_atendimento,
          tempo_resposta: dadosFormulario.tempo_resposta,
          processos_manuais: dadosFormulario.processos_manuais,
          tipo_whatsapp: dadosFormulario.tipo_whatsapp,
          tipos_dados: dadosFormulario.tipos_dados,
          frequencia_relatorios: dadosFormulario.frequencia_relatorios,
          integracoes_necessarias: dadosFormulario.integracoes_necessarias,
          orcamento_automacao: dadosFormulario.orcamento_automacao,
          prioridade_implementacao: dadosFormulario.prioridade_implementacao,
          pontuacao_total: dadosFormulario.pontuacao_total,
          plano_recomendado: dadosFormulario.plano_recomendado,
          created_at: new Date().toISOString()
        }
      ])
      .select()

    if (error) {
      console.error('Erro ao salvar diagnóstico:', error)
      throw error
    }

    console.log('Diagnóstico salvo com sucesso:', data)
    return data
  } catch (error) {
    console.error('Erro na função salvarDiagnostico:', error)
    throw error
  }
}

// Função para salvar contatos gerais
export async function salvarContato(dadosContato) {
  try {
    const { data, error } = await supabase
      .from('contatos')
      .insert([
        {
          nome: dadosContato.nome,
          email: dadosContato.email,
          telefone: dadosContato.telefone,
          empresa: dadosContato.empresa,
          mensagem: dadosContato.mensagem,
          origem: dadosContato.origem || 'site',
          created_at: new Date().toISOString()
        }
      ])
      .select()

    if (error) {
      console.error('Erro ao salvar contato:', error)
      throw error
    }

    console.log('Contato salvo com sucesso:', data)
    return data
  } catch (error) {
    console.error('Erro na função salvarContato:', error)
    throw error
  }
}

// Função para buscar diagnósticos
export async function buscarDiagnosticos(filtros = {}) {
  try {
    let query = supabase
      .from('diagnosticos')
      .select('*')
      .order('created_at', { ascending: false })

    // Aplicar filtros se fornecidos
    if (filtros.email) {
      query = query.eq('email', filtros.email)
    }
    if (filtros.empresa) {
      query = query.ilike('empresa', `%${filtros.empresa}%`)
    }
    if (filtros.plano_recomendado) {
      query = query.eq('plano_recomendado', filtros.plano_recomendado)
    }

    const { data, error } = await query

    if (error) {
      console.error('Erro ao buscar diagnósticos:', error)
      throw error
    }

    return data
  } catch (error) {
    console.error('Erro na função buscarDiagnosticos:', error)
    throw error
  }
}

// Função para atualizar status de lead
export async function atualizarStatusLead(id, novoStatus) {
  try {
    const { data, error } = await supabase
      .from('diagnosticos')
      .update({ 
        status_lead: novoStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()

    if (error) {
      console.error('Erro ao atualizar status do lead:', error)
      throw error
    }

    console.log('Status do lead atualizado:', data)
    return data
  } catch (error) {
    console.error('Erro na função atualizarStatusLead:', error)
    throw error
  }
}

// Função para analytics e relatórios
export async function obterEstatisticas() {
  try {
    // Total de diagnósticos
    const { count: totalDiagnosticos } = await supabase
      .from('diagnosticos')
      .select('*', { count: 'exact', head: true })

    // Distribuição por plano recomendado
    const { data: distribuicaoPlanos } = await supabase
      .from('diagnosticos')
      .select('plano_recomendado')

    // Diagnósticos dos últimos 30 dias
    const dataLimite = new Date()
    dataLimite.setDate(dataLimite.getDate() - 30)
    
    const { count: diagnosticosRecentes } = await supabase
      .from('diagnosticos')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', dataLimite.toISOString())

    return {
      totalDiagnosticos,
      diagnosticosRecentes,
      distribuicaoPlanos: distribuicaoPlanos?.reduce((acc, item) => {
        acc[item.plano_recomendado] = (acc[item.plano_recomendado] || 0) + 1
        return acc
      }, {})
    }
  } catch (error) {
    console.error('Erro ao obter estatísticas:', error)
    throw error
  }
}
