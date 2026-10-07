# V4 — Hero compacto e frase no cabeçalho

## Ajustes executados

- Card principal com 360 px de largura no desktop, centralizado verticalmente em relação ao texto. Altura medida de aproximadamente 370 px, abaixo da altura do bloco textual nas larguras desktop testadas.
- No celular, card centralizado abaixo do conteúdo, com largura máxima de 320 px (reduzindo para 280 px em viewport de 320 px).
- Preservados fundo azul-marinho, detalhes dourados, cantos arredondados e a frase “O cuidado começa com presença.” na base.
- “Saúde vascular & cuidado com a pele” transferida da lateral do Hero para o lado direito da logo do cabeçalho, horizontal e alinhada ao centro. Cabeçalho conserva as alturas anteriores: 88/80/76 px, conforme breakpoint.
- Removido integralmente o card “Uma avaliação. / Um cuidado pensado para você.”, incluindo elemento, ícone, estilos próprios e espaço residual.

## Imagem

Recorte do PNG original de 1080 × 1920: região (140,650)–(940,1280), saída de 800 × 630 px. A arte dourada completa BNZ + HOF | BODY, com limites detectados (248,806)–(803,1116), está inteiramente dentro do recorte, com margens. Foram removidas apenas áreas de fundo vazio. Conversão WebP sem perdas e comparação pixel a pixel da região aprovada. Sem filtros, alterações de cor ou distorção. CSS `object-fit: contain`.

## Preservação

O arquivo app.js permanece literalmente idêntico ao da V3. Menu, botões, links, WhatsApp, formulário, mapa, seções e todos os demais textos foram comparados automaticamente com a versão anterior. Paleta global idêntica. A configuração mudou apenas o caminho da imagem compacta do Hero.

A cópia anterior está em `../landing-medica-v3-preservada/`; a fixture de verificação está em `tests/fixtures/before-v4/`.

## Testes

37 testes aprovados, zero falhas, ignorados ou instáveis. Registro: `qa/v4/test-execution.log`.

- Geometria do card, alinhamento e cabeçalho sem colisões em 320, 390, 768, 1024, 1280, 1440 e 1920 px.
- Sem overflow horizontal em todas essas larguras.
- Altura do card menor que a do bloco textual no desktop/tablet.
- Integridade e proporção da imagem; frase inferior preservada.
- Regressão de navegação, FAQ, formulário, consentimento, contatos e mapa.
- Auditoria axe-core WCAG 2/2.1 A/AA sem violações automáticas em 320, 390, 768, 1024 e 1440 px.
- Build portátil aberto e medido diretamente por file://.
- Inspeção visual das capturas reais desktop/celular.

Capturas: `desktop-cabecalho-hero.png`, `tablet-cabecalho-hero.png`, `celular-cabecalho-hero.png`.

Nenhuma publicação externa ou mensagem enviada. Dados reais ainda pendentes; modo de personalização/noindex preservado. Auditoria automática não equivale a certificação integral de acessibilidade.
