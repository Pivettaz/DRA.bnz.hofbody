# Relatório de verificação

## Entrega

Landing page em HTML, CSS e JavaScript, sem bibliotecas de execução. Arquivo portátil: `dist/index.html`. Dados centralizados em `config.js`.

## Testes executados

**18 testes aprovados; zero falhas, testes ignorados ou instáveis** na execução documentada em `test-execution.log`.

Cobertura:

- Conteúdo educativo, oito seções principais e sete perguntas frequentes.
- Identidade não inventada; placeholders explícitos; especialidade só aparece com registro confirmado e RQE.
- Personalização por arquivo de configuração.
- Menu móvel, Escape, foco por teclado, seção ativa e seleção de tratamento.
- Políticas em diálogo acessível, fechamento e retorno de foco.
- Contatos ausentes com aviso real, sem destino inventado.
- Validação de campos, consentimento obrigatório e máscara brasileira de telefone.
- Preparação de link do WhatsApp, sem transmissão no teste; link invalidado ao editar ou revogar consentimento.
- Ausência de localStorage e sessionStorage.
- Formulário desabilitado sem JavaScript para evitar envio nativo via URL.
- Google Maps bloqueado antes da solicitação; criação e remoção de iframe testadas com resposta isolada, sem enviar endereço de teste ao Google.
- HTML portátil aberto diretamente por `file://`, com interações e sem erros JavaScript.
- Build em modo rascunho com `noindex`; publicação bloqueada quando faltam dados obrigatórios.
- Metatags, canonical, Open Graph, JSON-LD Physician e sitemap validados em build com fixture sintética isolada, nunca publicada.
- Botão flutuante sem encobrir o texto da faixa de tratamentos na composição inicial desktop.

## Responsividade e acessibilidade

Verificadas larguras **320, 390, 768, 1024 e 1440 px** em Chromium, sem overflow horizontal.

A auditoria axe-core com regras WCAG 2 A/AA e 2.1 A/AA encontrou **zero violações automáticas** nas cinco larguras. Isso não equivale a certificação de acessibilidade ou a teste integral com leitores de tela.

Capturas reais: `desktop.png`, `desktop-hero.png`, `celular.png`, `celular-hero.png`. Revisão visual das páginas inteiras não identificou cortes, overflow ou sobreposições indevidas. O texto decorativo vertical foi removido no celular. O botão de WhatsApp foi compactado para preservar a coluna de leitura. Espaços foram mantidos junto às quebras de linha ocultas no celular.

## Revisão editorial

- Não foram inseridos nomes, cidades, CRM, especialidades, cursos, certificações, depoimentos ou resultados fictícios.
- Não há preços, promoções, galeria de antes/depois ou promessas de resultados.
- Vasinhos são diferenciados de varizes; a página não afirma que toda variz é tratável com escleroterapia.
- Indicação, técnica, sessões e resultados são apresentados como individuais, dependentes de avaliação.
- Informações de recuperação e possíveis contraindicações estão presentes.
- A natureza educativa do site e a necessidade de consulta/avaliação estão explícitas.
- Diferenciais sugeridos permanecem marcados como **[A CONFIRMAR]**.

## Auditoria de composição

Superfície: **Decidir / Aprender**, com hero editorial em duas colunas, tratamentos comparáveis, faixa de etapas, seção de formação, FAQ e contato.

Autoavaliação dos dez sinais de design genérico da skill de design: **0/10**. Sem gradientes tecnológicos, violeta padrão, grade de benefícios com ícones repetidos, trilhos laterais, blur, métricas decorativas ou composição inteira centralizada. Georgia/Arial foram escolhidas para contraste editorial e carregamento sem fontes externas.

## Limitações e pendências reais

- Não há fotografia, nome, credenciais, contatos, endereço ou domínio reais fornecidos. Os espaços reservados são intencionais.
- WhatsApp e mapa estão implementados, mas a disponibilidade dos destinos reais e a entrega de mensagens não podem ser verificadas sem dados reais. Nenhuma mensagem foi enviada.
- O formulário prepara uma mensagem; não existe backend para receber solicitações. O envio e a confirmação acontecem no WhatsApp.
- Política de Privacidade precisa de responsável, contato, retenção, hospedagem e revisão antes da publicação.
- Imagens reais ainda precisam de autorização e otimização.
- Testes de navegador foram executados em Chromium, não em aparelhos físicos, Safari ou Firefox.
- Nenhuma publicação externa foi realizada.

## Ambiente de testes

Playwright 1.58.2 e axe-core 4.11.1 (apenas desenvolvimento). O download padrão do navegador excedeu o tempo disponível; os testes usaram o Chromium já instalado no ambiente, informado por `CHROMIUM_PATH`. O Node 26 emite um aviso de depreciação interno do runner sobre `module.register()`, sem erros da aplicação.
