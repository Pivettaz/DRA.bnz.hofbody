# V3 — Cabeçalho BNZ e Hero HOF | BODY

## Alterações solicitadas

- Cabeçalho: apenas o símbolo do arquivo `ícone gold.png`, sem nome, CRM, especialidade ou texto lateral. A navegação e seu botão permanecem intactos.
- Hero: arquivo `Destaques - 4.png` completo, sem fotografia e sem placeholders de retrato. BNZ e HOF | BODY preservados.
- As identificações provisórias de nome, título profissional e CRM foram removidas da apresentação, dos blocos sobrepostos, de Sobre e do rodapé. As metatags não usam nome fictício quando a configuração está vazia.
- As expressões educativas “avaliação médica” e semelhantes foram preservadas: não são identificações provisórias. Links, opções do formulário, conteúdo médico e perguntas frequentes não foram alterados.
- Ajustes mínimos nas duas frases que continham o nome removido evitam “A realiza...” e “Para a, ...”. Nenhuma promessa ou credencial foi acrescentada.
- A frase existente “O cuidado começa com presença.” foi mantida abaixo da imagem, sem cobrir a marca. O cartão “Uma avaliação...” foi separado verticalmente para não encobrir texto.

## Integridade das imagens

- Hero original: **1080 × 1920 px (9:16)**. Conversão para WebP sem perdas; comparação pixel a pixel com o PNG enviado aprovada. Não houve corte, recoloração, remoção do fundo ou deformação.
- Cabeçalho original: 1080 × 1081 px. Símbolo ocupa a região (359, 465)–(721, 615). Foi recortada apenas a margem externa vazia, preservando uma margem de 22 px ao redor de toda a arte: saída de **406 × 194 px**, sem mudança dos pixels do símbolo.
- Ambas as aplicações usam `object-fit: contain`, sem filtros. O HTML final incorpora as imagens e abre sozinho, sem servidor ou pasta auxiliar.

## Preservação

- Todas as variáveis da paleta em `:root` estão idênticas à versão V2.
- Navegação, WhatsApp, validação do formulário, consentimento, diálogos e mapa: código literalmente idêntico desde o início do módulo de navegação.
- Configuração de contatos, endereço, mapa, privacidade e modo de publicação: inalterada.
- Oito seções e os mesmos menus, botões e links.
- Versão anterior preservada em `../landing-medica-v2-preservada/` e fixture em `tests/fixtures/before-v3/`.

## Verificação

**29 testes aprovados, nenhuma falha, nenhum teste ignorado ou instável** na execução em `qa/v3/test-execution.log`.

- Testes do cabeçalho sem texto lateral e da imagem correta no Hero.
- Ausência dos placeholders de nome, CRM e fotografia na apresentação.
- Logos proporcionais, completas e sem textos sobrepostos.
- Preservação dos demais conteúdos, contatos, menus, seções e paleta.
- Regressões completas do formulário, WhatsApp, mapa, FAQ e menu móvel.
- Sem overflow horizontal em 320, 390, 768, 1024 e 1440 px.
- Auditoria automática WCAG 2/2.1 A/AA com axe-core sem violações nas cinco larguras.
- Prévia inspecionada visualmente em desktop e celular. Capturas incluem cabeçalho e Hero completo, inclusive a área abaixo da primeira dobra.
- Chromium; não substitui certificação de acessibilidade nem teste em todos os aparelhos físicos.

Prévia desktop: `desktop-cabecalho-hero.png`.
Prévia tablet: `tablet-cabecalho-hero.png`.
Prévia celular: `celular-cabecalho-hero.png`.

## Publicação

O site permanece em modo de personalização/noindex. Nenhum dado de contato foi inventado e nenhuma mensagem foi enviada. A remoção dos identificadores provisórios não constitui liberação para publicação: a identificação profissional real e os requisitos aplicáveis de publicidade precisam ser revisados antes da publicação.
