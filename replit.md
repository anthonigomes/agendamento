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
   - Preencha seu nome e a disciplina
   - Selecione o turno desejado (Manhã/Tarde/Noite)
   - Escolha o dia da semana
   - Selecione o horário de início
   - Indique se utilizará 1 ou 2 aulas
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

- **Planilha do Google Sheets**: Na primeira execução, o sistema cria automaticamente uma planilha chamada "Agendamentos - Laboratório de Informática" na conta Google conectada
- **Acesso aos Dados**: Todos os agendamentos são salvos em tempo real na planilha
- **Organização**: Dados incluem professor, disciplina, turno, dia, horário, duração e observações

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
Cada agendamento contém:
- Nome do Professor
- Disciplina
- Turno (manhã/tarde/noite)
- Dia da Semana (segunda a sexta)
- Horário de Início
- Duração (1 ou 2 aulas)
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

**Status**: Sistema completo, testado e ajustado com os horários exatos da escola! Pronto para uso pelos professores! 🎓

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
- **Responsivo**: Funciona em desktop, tablet e celular

## Contato e Suporte

Para dúvidas ou sugestões sobre o sistema, consulte a documentação técnica ou entre em contato com o desenvolvedor.

---

**Desenvolvido com ❤️ usando Replit Agent**
