# Landing page médica

Página completa em português brasileiro, HTML/CSS/JavaScript, sem dependências de produção. Design editorial com verde profundo, sálvia, off-white e detalhes dourados; títulos Georgia e corpo Arial, disponíveis localmente, sem chamadas a serviços de fontes.

## Abrir a prévia

Abra `dist/index.html` diretamente no navegador. É um HTML portátil: CSS, JavaScript e ícone já estão incorporados. Os retratos são espaços reservados identificados, não fotografias de outra profissional.

Para desenvolver, abra o `index.html` da raiz ou execute:

```bash
npm start
```

Endereço local: http://127.0.0.1:4173

## Personalização em um único lugar

Edite **`config.js`**. Não edite a cópia gerada em `dist/`: ela será substituída no próximo build.

1. Preencha nome (sem `Dra.`), CRM, UF, cidade, biografia e formação verificadas.
2. Especialidade só aparece com `specialtyRegistered: true`, `specialty` e `rqe` preenchidos. Sem registro, deixe os campos vazios e `specialtyRegistered: false`.
3. Preencha os contatos reais: WhatsApp, telefone, e-mail e Instagram. Facebook é opcional e fica oculto sem URL. Links externos devem começar com `https://`.
4. Confirme três ou quatro diferenciais e inclua-os em `confirmedDifferentials`. Os exemplos marcados **[A CONFIRMAR]** não são afirmações de certificação ou estrutura do consultório.
5. Coloque as imagens autorizadas na pasta **`assets/`** e indique o caminho em `portrait`, `portraitSecondary` (opcional) e `logo` (opcional). Exemplo de caminho, não de identidade: `assets/retrato.webp`. Sem logotipo, preencha `brand` com o nome aprovado da marca.
6. Use WebP/AVIF, retrato de aproximadamente 960 × 1200 px e até 250 KB; preencha `portraitAlt`. O primeiro retrato tem prioridade; o segundo usa carregamento tardio. Não foi possível otimizar fotos reais porque nenhuma foi fornecida.
7. Preencha endereço, referência e horários. Estacionamento e acessibilidade só são exibidos se fornecidos. `mapsUrl` recebe o link de compartilhamento; `mapsEmbedUrl` recebe somente o `src` HTTPS do iframe gerado em “Incorporar um mapa”. Se não houver URL de incorporação, o mapa é construído com o endereço real.
8. Preencha os campos de `privacy`, revise o texto das políticas e marque `reviewed: true` apenas após aprovação. Confirme responsável, contato, prazo de retenção e práticas de hospedagem.
9. Preencha `siteUrl` com o domínio HTTPS real e `ogImage` com a imagem autorizada de compartilhamento (opcional, usa o retrato como alternativa).
10. Após revisão médica, cadastral e de privacidade, marque `published: true` e gere a versão final.

```bash
npm run build
```

O build utiliza apenas Node.js e não exige `npm install`. Publique **o conteúdo de `dist/`**, não a pasta de desenvolvimento. O build bloqueia publicação quando faltam dados obrigatórios. Isso é uma verificação de preenchimento, não validação do CRM, RQE ou conformidade jurídica.

## Comportamento dos contatos

- Botões de avaliação abrem WhatsApp com a mensagem solicitada, depois que o número real estiver configurado.
- Sem contato, botões abrem um aviso claro de configuração; não apontam para números fictícios.
- Os botões de tratamento selecionam o serviço no formulário e levam à seção de contato.
- O formulário **não tem backend**: valida os campos e prepara uma mensagem. O visitante precisa clicar em “Continuar no WhatsApp” e confirmar o envio no aplicativo.
- Nenhuma mensagem de “agendamento confirmado” é simulada. A confirmação depende de resposta do atendimento.
- Alterar os campos ou retirar o consentimento invalida o link preparado.
- O formulário fica desabilitado se o JavaScript não carregar, evitando envio involuntário por URL.
- Não há banco de dados, localStorage, sessionStorage, pixels ou analytics. O conteúdo digitado permanece na memória da página até o visitante abrir o WhatsApp. O serviço externo pode receber o texto no link antes da confirmação final no aplicativo, conforme explicado na política.
- Google Maps é carregado somente por solicitação do visitante e pode ser removido. Não há localização de exemplo nem requisição ao Google no carregamento inicial.

## SEO e publicação

No modo de personalização, a página usa **noindex, nofollow** e `robots.txt` bloqueando indexação. Não há dados estruturados com identidade fictícia.

O build publicado gera title, description, Open Graph, canonical, JSON-LD `Physician`, robots e sitemap estáticos. Nome/CRM/endereço também são preenchidos no HTML. Não declara especialidade médica não confirmada. Crawlers de compartilhamento não precisam executar JavaScript para ler as metatags.

O endereço de produção, os retratos, os contatos e o mapa reais ainda precisam ser fornecidos. A disponibilidade dos serviços externos e a entrega de mensagens devem ser testadas após essa configuração.

## Arquivos

- `index.html`: estrutura semântica e conteúdo educativo.
- `styles.css`: identidade visual e responsividade.
- `config.js`: todos os dados editáveis da profissional.
- `app.js`: personalização, navegação, formulário, políticas e mapa.
- `assets/`: ícone e futuras imagens autorizadas.
- `scripts/build.cjs`: geração portátil e SEO estático.
- `tests/`: testes automatizados com Playwright e axe-core.
- `qa/`: capturas reais em desktop e celular e relatório de verificação.
- `dist/`: entrega que pode ser aberta diretamente ou publicada após personalização.

## Verificação

```bash
npm ci
npx playwright install chromium
npm test -- --workers=2
```

Se já houver Chromium disponível e a instalação padrão não for possível:

```bash
CHROMIUM_PATH=/caminho/real/do/chrome npm test -- --workers=2
```

Dependências de desenvolvimento fixadas em `package-lock.json`. Consulte `qa/RELATORIO.md` para escopo, resultados e limitações. Testes automatizados de acessibilidade não substituem avaliação humana completa com leitores de tela.

## Revisão editorial antes de publicar

- Validar nome, CRM/UF, formação e eventual especialidade/RQE com a profissional.
- Revisar os textos-base e os diferenciais para refletir o atendimento real.
- Confirmar autorizações das imagens, marca e contatos.
- Revisar Política de Privacidade, retenção, serviços de terceiros e hospedagem.
- Não acrescentar promessas de resultado, preços, promoções, números sem comprovação, depoimentos inventados ou galeria de antes e depois.
- A estrutura não constitui diagnóstico, consulta médica ou parecer jurídico sobre publicidade médica.
