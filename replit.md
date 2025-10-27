# Sistema de Agendamento - Laboratório de Informática

## Visão Geral
Sistema web completo para agendamento do laboratório de informática escolar, com integração ao Google Sheets para armazenamento gratuito de dados.

## Características Principais

### ✨ Funcionalidades
- **Agendamento Intuitivo**: Formulário simples para criar reservas do laboratório
- **Visualização Semanal**: Grade visual mostrando disponibilidade por dia e horário
- **Três Turnos**: Manhã (7h-12h), Tarde (13h-18h), Noite (18h-22h)
- **Prevenção de Conflitos**: Sistema automático que impede dupla reserva do mesmo horário
- **Duração Flexível**: Escolha entre 1 ou 2 aulas simultâneas
- **Estatísticas em Tempo Real**: Acompanhe total de agendamentos e reservas do dia
- **Integração Google Sheets**: Dados salvos automaticamente em planilha do Google

### 🎨 Design
- Interface moderna e responsiva
- Modo claro e escuro (tema adaptável)
- Componentes profissionais usando shadcn/ui
- Tipografia Roboto seguindo Material Design
- Feedback visual com notificações toast
- Estados de loading e erro elegantes

## Como Usar

### Para Professores

1. **Criar um Agendamento**:
   - Clique no botão "Novo Agendamento"
   - Preencha seu nome, email e telefone
   - Selecione a disciplina (dropdown com 9 opções)
   - Selecione o turno desejado (Manhã/Tarde/Noite)
   - Escolha o dia da semana
   - Selecione o horário de início
   - Indique se utilizará 1 ou 2 aulas
   - Descreva o objetivo da aula
   - Marque os recursos necessários (Internet, Projetor, Computadores, etc.)
   - Adicione observações se necessário
   - Clique em "Criar Agendamento"

2. **Visualizar Agenda**:
   - Use as abas (Manhã/Tarde/Noite) para alternar entre turnos
   - A grade semanal mostra todos os horários disponíveis
   - Células verdes indicam horários ocupados
   - Células com borda tracejada estão disponíveis

3. **Verificar Estatísticas**:
   - Veja o total de agendamentos no painel lateral
   - Confira quantos agendamentos existem para hoje
   - Liste os agendamentos recentes do turno selecionado

### Para Administradores

1. **Acessar Painel Administrativo**:
   - Clique no botão "Admin" no cabeçalho da página principal
   - Você será direcionado para /admin

2. **Visualizar Estatísticas**:
   - **Total de Agendamentos**: Veja o número total de reservas
   - **Por Turno**: Quantidade de agendamentos em cada turno (Manhã/Tarde/Noite)
   - **Top Professores**: Professores com mais agendamentos
   - **Top Disciplinas**: Disciplinas mais agendadas

3. **Gerenciar Agendamentos**:
   - **Visualizar Todos**: Tabela com todos os agendamentos do sistema
   - **Editar**: Clique no ícone de lápis para modificar qualquer agendamento
     - Altere qualquer um dos 13 campos (professor, disciplina, turno, dia, horário, etc.)
     - Sistema valida conflitos automaticamente
   - **Excluir**: Clique no ícone de lixeira para deletar um agendamento
     - Confirmação obrigatória antes da exclusão
   - **Voltar**: Botão "Voltar" retorna à página principal

4. **Planilha do Google Sheets**:
   - Na primeira execução, o sistema cria automaticamente uma planilha chamada "Agendamentos - Laboratório de Informática"
   - Todos os agendamentos são salvos em tempo real na planilha
   - Planilha com 13 colunas incluindo informações de contato, objetivo da aula e recursos necessários
   - Edições e exclusões são refletidas instantaneamente no Google Sheets

**Nota sobre Segurança - ATUALIZADO**: O painel administrativo agora possui **autenticação com senha**! 
- **Professores**: Podem criar agendamentos livremente (sem login)
- **Administradores**: Precisam fazer login com senha para editar/excluir agendamentos
- **Acesso**: /admin redireciona para /admin/login automaticamente
- **Senha**: Configurada via ADMIN_PASSWORD (Replit Secrets)
- **Sessão**: Permanece logado por 7 dias

## Estrutura Técnica

### Frontend
- React 18 com TypeScript
- Tailwind CSS + shadcn/ui
- React Query para gerenciamento de estado
- Wouter para roteamento

### Backend
- Express.js
- Google Sheets API (via integração Replit)
- Validação com Zod
- Armazenamento em Google Sheets

### Dados Armazenados
Cada agendamento contém (13 colunas no Google Sheets):
- ID único
- Nome do Professor
- Email do Professor (validado)
- Telefone do Professor (formato brasileiro)
- Disciplina (9 opções: Matemática, Português, Ciências, História, Geografia, Arte, Inglês, Ed. Física, Ens. Religioso)
- Turno (manhã/tarde/noite)
- Dia da Semana (segunda a sexta)
- Horário de Início
- Duração (1 ou 2 aulas)
- Objetivo da Aula (obrigatório)
- Recursos Necessários (Internet, Projetor, Computadores, Livros, Tablets, Outros)
- Observações (opcional)
- Data de Criação

## Validações de Conflito

O sistema previne conflitos automaticamente:
- ✅ Detecta se um horário já está ocupado
- ✅ Considera duração de 2 aulas (~100 minutos)
- ✅ Verifica sobreposição de horários
- ✅ Mostra mensagem de erro clara ao usuário

## Desenvolvimento Recente

**Data**: Outubro 27, 2025

**Implementações**:
1. ✅ Schema completo de dados com validação
2. ✅ Interface frontend profissional e responsiva
3. ✅ Integração Google Sheets funcionando
4. ✅ API REST com validação de conflitos
5. ✅ Testes end-to-end completos
6. ✅ **Horários ajustados conforme grade da escola**:
   - Turno Tarde: 13:00, 14:00, 15:15, 16:15
   - Turno Noite: 18:50, 19:40, 20:45, 21:35
7. ✅ **9 Disciplinas do Ensino Fundamental 2** (dropdown): Matemática, Português, Ciências, História, Geografia, Arte, Inglês, Ed. Física, Ens. Religioso
8. ✅ **Visualização corrigida**: Agendamentos de 2 aulas agora ocupam visualmente ambos os horários na grade
9. ✅ **Campos de contato do professor**: Email (validado) e telefone (formato brasileiro)
10. ✅ **Objetivo da aula**: Campo obrigatório para descrever o propósito pedagógico
11. ✅ **Recursos necessários**: Seleção de equipamentos (Internet, Projetor, Computadores, Livros, Tablets, Outros)
12. ✅ **Cards aprimorados**: Exibem objetivo com ícone de alvo e recursos com badges e ícones apropriados
13. ✅ **Google Sheets ampliado**: Agora persiste 13 colunas de dados por agendamento
14. ✅ **Painel Administrativo Completo** (novo!):
   - Página /admin acessível via botão "Admin" no cabeçalho
   - Estatísticas em tempo real (total de agendamentos, por turno, top professores, top disciplinas)
   - Tabela completa com todos os agendamentos
   - Edição de agendamentos com formulário completo (todos os 13 campos)
   - Exclusão de agendamentos com confirmação
   - Validação de conflitos ao editar
   - 100% gratuito (sem sistema de login/autenticação)

**Status**: Sistema completo com gerenciamento administrativo integrado! Professores podem criar agendamentos e administradores podem gerenciar tudo através da página /admin! 🎓📚✨

**Melhorias de UX - 27 Out 2025**:
15. ✅ **Destaque Visual Aprimorado**: Agendamentos na grade com `bg-primary/10` (antes /5) para melhor escaneabilidade visual
16. ✅ **Botões Destrutivos**: Botões de exclusão agora usam `variant="destructive"` (vermelho) em vez de outline, sinalizando claramente ação perigosa
17. ✅ **Rodapé com Crédito**: Footer em todas as páginas com "Sistema desenvolvido pelo Prof. Antonio Gomes"
18. ✅ **Validação de Acessibilidade**: Confirmado contraste WCAG 6.5:1, cores apropriadas para ambiente escolar

**Sistema de Autenticação - 27 Out 2025**:
19. ✅ **Login Administrativo**: Página /admin/login com autenticação por senha
20. ✅ **Proteção de Rotas**: Middleware `requireAdmin` protege edição e exclusão de agendamentos
21. ✅ **Sessão Persistente**: express-session com cookie de 7 dias (httpOnly, secure em produção)
22. ✅ **Botão Logout**: Opção "Sair" no painel admin para desconectar
23. ✅ **Separação de Acesso**: Professores criam agendamentos sem login, apenas admin pode editar/excluir
24. ✅ **100% Gratuito**: Sistema continua gratuito, usando memorystore para sessões

## Próximos Passos Sugeridos

### Melhorias Futuras
- [ ] Notificações por email para confirmação de agendamentos
- [ ] Sistema de cancelamento e reagendamento
- [ ] Relatórios de uso por professor e disciplina
- [ ] Agendamentos recorrentes (semanais)
- [ ] Sistema de permissões para coordenadores
- [ ] Exportação de dados em PDF
- [ ] Integração com calendário Google

## Notas Importantes

- **Gratuito**: Sistema 100% gratuito usando Google Sheets como banco de dados
- **Acesso**: Todos que acessarem o link podem criar agendamentos
- **Persistência**: Dados salvos em tempo real no Google Sheets
- **Totalmente Responsivo**: 
  - 📱 **Celular (Mobile)**: Interface otimizada com botões compactos, cards empilháveis, fonte reduzida e grade com scroll horizontal
  - 📱 **Tablet**: Layout intermediário com 2 colunas de estatísticas e elementos de tamanho médio
  - 💻 **Desktop/PC**: Layout completo com 4 colunas de estatísticas, tabelas horizontais e sidebar lateral
  - ✅ Testado em iPhone 12 (390x844), iPad (768x1024) e Desktop (1920x1080)

## Contato e Suporte

Para dúvidas ou sugestões sobre o sistema, consulte a documentação técnica ou entre em contato com o desenvolvedor.

---

**Desenvolvido com ❤️ usando Replit Agent**
