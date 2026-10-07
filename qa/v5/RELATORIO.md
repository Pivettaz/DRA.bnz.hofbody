# V5 — Acabamento exclusivo do card BNZ

## Alteração

Somente regras CSS específicas para `.hero-brand-panel` e sua faixa inferior foram adicionadas. Todos os estilos anteriores foram preservados literalmente.

- Cantos de 18 px.
- Borda dourada discreta de 1 px e sombra leve em duas camadas.
- Fundo champanhe da faixa: #E7D7BE.
- Texto da faixa: #172238.
- Palavra “presença.”: #8A6935, mantendo itálico.
- Separador dourado de 1 px, sem lacuna entre imagem e faixa.
- Espaçamento interno da frase: 24 px acima, 26 px nas laterais e abaixo.
- Largura compacta anterior preservada: 360 px no desktop e até 320 px no celular.
- Imagem preservada byte a byte; sem recorte adicional, filtro ou alteração de proporção.

## Preservação verificada

index.html, app.js e config.js estão idênticos byte a byte à versão anterior. As imagens BNZ do Hero e do cabeçalho tiveram seus hashes SHA-256 comparados e permanecem idênticas. Não houve alteração em texto, links, outras seções ou funcionalidades.

Cópia da versão anterior: ../landing-medica-v4-preservada/. Fixture dos arquivos anteriores: tests/fixtures/before-v5/.

## Verificação

41 testes aprovados; zero falhas, instáveis ou ignorados. Registro completo em qa/card-v5-test-execution.log.

- Estilos do novo acabamento verificados em desktop, tablet e celular.
- Card continua menor que o bloco textual nas larguras desktop testadas.
- Responsividade em sete larguras: 320, 390, 768, 1024, 1280, 1440 e 1920 px.
- Axe-core WCAG 2/2.1 A/AA: nenhuma violação automática nas cinco larguras da suíte de acessibilidade.
- Contraste azul-marinho/champanhe: 11,24:1.
- Contraste dourado/champanhe: 3,58:1, adequado ao texto grande de 24 px utilizado; não aplicar esse par a texto pequeno sem revisão.
- Revisão visual: logo e frase completas, sem deformação ou sobreposição.
- Regressões de formulário, WhatsApp, mapa, menus, FAQ e HTML portátil aprovadas.

Prévias reais em qa/v5/: desktop-card.png, celular-card.png, tablet-card.png e os respectivos arquivos *-hero.png. No recorte isolado do card mobile, o botão flutuante pode aparecer parcialmente na borda da captura; não é corte da página. A captura completa do Hero preserva a viewport.

Auditoria automática não equivale a certificação integral de acessibilidade. Nenhuma publicação externa nem envio de mensagens.
