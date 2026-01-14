
-- Schema SQL para criar as tabelas necessárias no Supabase
-- Execute este script no SQL Editor do seu projeto Supabase

-- Tabela para diagnósticos
CREATE TABLE IF NOT EXISTS diagnosticos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Dados pessoais
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  telefone VARCHAR(20),
  
  -- Dados da empresa
  empresa VARCHAR(255) NOT NULL,
  cargo VARCHAR(255),
  setor VARCHAR(255),
  tamanho_empresa VARCHAR(50),
  
  -- Dados de atendimento
  volume_atendimento VARCHAR(50),
  canais_atendimento TEXT,
  tempo_resposta VARCHAR(50),
  
  -- Processos e automação
  processos_manuais TEXT,
  tipo_whatsapp VARCHAR(50),
  
  -- Dados e relatórios
  tipos_dados TEXT,
  frequencia_relatorios VARCHAR(50),
  
  -- Integrações e orçamento
  integracoes_necessarias TEXT,
  orcamento_automacao VARCHAR(50),
  prioridade_implementacao VARCHAR(50),
  
  -- Análise e recomendação
  pontuacao_total INTEGER,
  plano_recomendado VARCHAR(50),
  
  -- Status do lead
  status_lead VARCHAR(50) DEFAULT 'novo',
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela para contatos gerais
CREATE TABLE IF NOT EXISTS contatos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  telefone VARCHAR(20),
  empresa VARCHAR(255),
  mensagem TEXT,
  origem VARCHAR(100) DEFAULT 'site',
  
  -- Status
  status VARCHAR(50) DEFAULT 'novo',
  respondido BOOLEAN DEFAULT FALSE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_diagnosticos_email ON diagnosticos(email);
CREATE INDEX IF NOT EXISTS idx_diagnosticos_empresa ON diagnosticos(empresa);
CREATE INDEX IF NOT EXISTS idx_diagnosticos_plano ON diagnosticos(plano_recomendado);
CREATE INDEX IF NOT EXISTS idx_diagnosticos_created_at ON diagnosticos(created_at);
CREATE INDEX IF NOT EXISTS idx_diagnosticos_status ON diagnosticos(status_lead);

CREATE INDEX IF NOT EXISTS idx_contatos_email ON contatos(email);
CREATE INDEX IF NOT EXISTS idx_contatos_created_at ON contatos(created_at);
CREATE INDEX IF NOT EXISTS idx_contatos_status ON contatos(status);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualizar updated_at
CREATE TRIGGER update_diagnosticos_updated_at 
  BEFORE UPDATE ON diagnosticos 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contatos_updated_at 
  BEFORE UPDATE ON contatos 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Políticas de RLS (Row Level Security) - opcional mas recomendado
ALTER TABLE diagnosticos ENABLE ROW LEVEL SECURITY;
ALTER TABLE contatos ENABLE ROW LEVEL SECURITY;

-- Política para permitir inserção pública (ajuste conforme necessário)
CREATE POLICY "Allow public insert on diagnosticos" ON diagnosticos
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow public insert on contatos" ON contatos
  FOR INSERT TO anon WITH CHECK (true);

-- Política para leitura autenticada (ajuste conforme necessário)
CREATE POLICY "Allow authenticated read on diagnosticos" ON diagnosticos
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated read on contatos" ON contatos
  FOR SELECT TO authenticated USING (true);

-- Views úteis para analytics
CREATE OR REPLACE VIEW diagnosticos_analytics AS
SELECT 
  plano_recomendado,
  COUNT(*) as total,
  AVG(pontuacao_total) as pontuacao_media,
  DATE_TRUNC('month', created_at) as mes
FROM diagnosticos 
GROUP BY plano_recomendado, DATE_TRUNC('month', created_at)
ORDER BY mes DESC;

CREATE OR REPLACE VIEW leads_por_status AS
SELECT 
  status_lead,
  COUNT(*) as total,
  COUNT(*) * 100.0 / SUM(COUNT(*)) OVER () as percentual
FROM diagnosticos 
GROUP BY status_lead;
