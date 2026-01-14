
# LARtech Automation - Documentação Completa

## 📋 Visão Geral

O LARtech Automation é um site institucional para uma empresa especializada em soluções de automação inteligente com IA para pequenas e médias empresas. O projeto inclui:

- Site institucional responsivo
- Sistema de diagnóstico de automação
- Geração automática de propostas comerciais
- Integração com n8n para automação de processos
- Banco de dados Supabase para armazenamento

## 🏗️ Estrutura do Projeto

```
├── index.html              # Página principal do site
├── diagnostico.html         # Formulário de diagnóstico multi-etapas
├── proposta.html           # Template de proposta comercial
├── style.css              # Estilos principais do site
├── conversion-improvements.css # Melhorias de conversão e engajamento
├── script.js              # Scripts principais (carrossel, menu mobile)
├── supabase-config.js     # Configuração do banco Supabase
├── supabase-integration.js # Integração dos formulários com Supabase
├── n8n-execute-node.js    # Processamento de dados no n8n
├── n8n-pos-html-node.js   # Pós-processamento do HTML
├── server.py              # Servidor Python para desenvolvimento
├── sql-schema.sql         # Schema do banco de dados
└── .replit                # Configuração do Replit
```

## 🎨 Design System

### Cores Principais
- **Azul Primário**: `#00A6FB`
- **Azul Secundário**: `#0582CA`
- **Laranja Accent**: `#FF9B71`
- **Cinza Escuro**: `#2A2D34`
- **Branco Gelo**: `#F6F8FA`

### Tipografia
- **Fonte Principal**: Montserrat
- **Pesos**: 300, 400, 500, 600, 700

### Espaçamentos
Sistema baseado em múltiplos de 4px (0.25rem a 8rem).

## 📱 Funcionalidades Principais

### 1. Site Institucional (`index.html`)

**Componentes:**
- Header fixo com navegação responsiva
- Carrossel hero com 4 slides
- Seção de serviços com grid responsivo
- Seção "Como Funciona" com carrossel próprio
- Seção de diagnóstico com CTAs
- Footer completo com redes sociais

**Recursos:**
- Menu hambúrguer mobile robusto
- Carrossel automático com controles
- Smooth scroll entre seções
- WhatsApp floating button
- Lazy loading de imagens

### 2. Diagnóstico Multi-etapas (`diagnostico.html`)

**Etapas do Formulário:**
1. **Informações Básicas**: Nome, email, empresa, localização
2. **Atendimento**: Volume de mensagens, número de atendentes, horários
3. **Automação**: Tipos de automação desejados
4. **Tecnologia**: WhatsApp atual, automações existentes
5. **Dados**: Gestão de dados, tipos de relatórios
6. **Finalização**: Urgência, investimento, observações

**Recursos:**
- Barra de progresso visual
- Validação em tempo real
- Campos condicionais
- Navegação entre etapas
- Salvamento automático no Supabase

### 3. Proposta Comercial (`proposta.html`)

**Características:**
- Template otimizado para PDF (Gotenberg)
- Cabeçalho e rodapé fixos
- Informações dinâmicas do cliente
- Tabela de planos comparativa
- Cálculo automático de pontuação
- Design profissional para impressão

## 🔄 Fluxo de Automação

### Processamento de Dados

1. **Coleta**: Formulário de diagnóstico
2. **Processamento**: `n8n-execute-node.js`
   - Análise de complexidade
   - Cálculo de pontuação
   - Recomendação de plano
3. **Geração**: HTML da proposta
4. **Finalização**: `n8n-pos-html-node.js`
   - Extração de informações
   - Mensagem WhatsApp
   - Preparação para PDF

### Algoritmo de Recomendação

**Fatores de Pontuação:**
- Volume de mensagens (15 pontos)
- Categorias de automação (20 pontos)
- Complexidade dos dados (15 pontos)
- Número de atendentes (12 pontos)
- Urgência (8 pontos)
- Base de dados existente (8 pontos)

**Planos Recomendados:**
- **Bronze**: ≤ 35% de complexidade
- **Prata**: 36-64% de complexidade
- **Ouro**: ≥ 65% de complexidade

## 💾 Banco de Dados

### Tabelas Principais

**diagnosticos:**
```sql
- id (uuid, primary key)
- nome (text)
- email (text)
- telefone (text)
- empresa (text)
- dados_diagnostico (jsonb)
- pontuacao_total (integer)
- plano_recomendado (text)
- created_at (timestamp)
```

**contatos:**
```sql
- id (uuid, primary key)
- nome (text)
- email (text)
- telefone (text)
- empresa (text)
- mensagem (text)
- origem (text)
- created_at (timestamp)
```

## 🎯 Recursos de Conversão

### Melhorias Implementadas

1. **Prova Social**: Depoimentos e badges de credibilidade
2. **CTAs Otimizados**: Múltiplos pontos de conversão
3. **Formulário Progressivo**: Reduz abandono
4. **Urgência**: Validade das propostas
5. **Personalização**: Conteúdo baseado no diagnóstico

### Analytics e Métricas

- Taxa de conversão do diagnóstico
- Abandono por etapa
- Planos mais recomendados
- Origem dos leads
- Tempo de preenchimento

## 🛠️ Configuração e Deploy

### Requisitos
- Conta Supabase configurada
- Webhooks n8n configurados
- Domínio personalizado (opcional)

### Variáveis de Ambiente
```env
SUPABASE_URL=sua_url_supabase
SUPABASE_ANON_KEY=sua_chave_anonima
N8N_WEBHOOK_URL=url_do_webhook_n8n
```

### Deploy no Replit

1. Fork o projeto
2. Configure as secrets no Replit
3. Execute o workflow "Servidor Web"
4. Configure domínio personalizado se necessário

## 📱 Responsividade

### Breakpoints
- **Mobile**: ≤ 768px
- **Tablet**: 769px - 992px
- **Desktop**: ≥ 993px

### Otimizações Mobile
- Menu hambúrguer robusto
- Touch gestures nos carrosséis
- Imagens responsivas
- Formulários otimizados para toque
- Performance otimizada

## 🔧 Manutenção

### Atualizações Regulares
- Conteúdo das propostas
- Algoritmo de recomendação
- Preços dos planos
- Imagens e assets

### Monitoramento
- Performance do site
- Taxa de conversão
- Erros de formulário
- Integração com n8n

## 🚀 Futuras Melhorias

### Roadmap
1. **Dashboard Analytics**: Painel de métricas
2. **A/B Testing**: Testes de conversão
3. **Chat Widget**: Atendimento em tempo real
4. **Multi-idioma**: Suporte internacional
5. **PWA**: Progressive Web App

### Otimizações
- Cache de assets
- Compressão de imagens
- Critical CSS inline
- Service Workers
- CDN para assets

## 📞 Suporte

Para suporte técnico ou dúvidas sobre implementação:
- **Email**: lucas.ribeiro@lartechautomation.com
- **WhatsApp**: (11) 99902-7653
- **Site**: https://lartechautomation.com

---

**© 2025 LARtech Automation** - Documentação técnica completa
