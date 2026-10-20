# Landing page de Bruna Nobre Zenícola

Página completa em português brasileiro, HTML/CSS/JavaScript, sem dependências de produção. Design editorial com azul-marinho, nude, off-white e dourado extraídos da identidade oficial; títulos Georgia e corpo Arial, disponíveis localmente, sem chamadas a serviços de fontes.

## Abrir a prévia

Abra `dist/index.html` diretamente no navegador. CSS, JavaScript, logos e ícone estão incorporados; o retrato da seção Sobre fica em `dist/assets/`, ao lado do HTML.

Para desenvolver, abra o `index.html` da raiz ou execute:

```bash
npm start
```

Endereço local: http://127.0.0.1:4173

## Personalização em um único lugar

Edite **`config.js`**. Não edite a cópia gerada em `dist/`: ela será substituída no próximo build.

1. Confirme o número e a região do registro profissional (`crbm` e `crbmRegion`) antes de publicar. Os demais dados biográficos informados já foram preenchidos.
2. WhatsApp, e-mail e Instagram estão configurados. O telefone separado é opcional e fica oculto enquanto vazio. Links externos devem começar com `https://`.
3. Os três diferenciais informados estão em `confirmedDifferentials`.
4. A marca oficial está configurada nos campos de logo; o retrato fornecido está em `portrait` e aparece na seção Sobre.
5. Endereço e horários estão preenchidos. Confirme o CEP e a localização exata. Estacionamento e acessibilidade só são exibidos se fornecidos. `mapsUrl` recebe o link de compartilhamento; `mapsEmbedUrl` recebe somente o `src` HTTPS do iframe gerado em “Incorporar um mapa”. Se não houver URL de incorporação, o mapa é construído com o endereço informado.
6. Os campos de `privacy` foram preenchidos com as informações fornecidas sobre responsável, contato, prazo de retenção e hospedagem. A política foi confirmada como concluída e está marcada com `reviewed: true`. Revise-a novamente se as práticas de atendimento ou hospedagem mudarem.
7. Preencha `siteUrl` com o domínio HTTPS real e `ogImage` com a imagem autorizada de compartilhamento (opcional, usa o retrato como alternativa).
8. Após revisão profissional, cadastral e de privacidade, marque `published: true` e gere a versão final.

```bash
npm run build
```

O build utiliza apenas Node.js e não exige `npm install`. Na Vercel, `vercel.json` executa o build e serve **`dist/`**, não o `index.html` da raiz. Apenas imagens utilizadas pelo site são copiadas para `dist/assets/`; PDFs e artes originais permanecem em `assets/`. O build bloqueia publicação quando faltam dados obrigatórios. Isso é uma verificação de preenchimento, não validação do CRBM ou conformidade jurídica.

## Comportamento dos contatos

- Botões de avaliação abrem WhatsApp com a mensagem solicitada, depois que o número real estiver configurado.
- Sem contato, botões abrem um aviso claro de configuração; não apontam para números fictícios.
- Os botões de tratamento selecionam o serviço no formulário e levam à seção de contato.
- O formulário **não tem backend**: valida os campos e prepara uma mensagem. O visitante precisa clicar em “Continuar no WhatsApp” e confirmar o envio no aplicativo. Enquanto a política de privacidade não estiver revisada, o formulário exibe um aviso; isso não substitui a revisão antes da publicação.
- Nenhuma mensagem de “agendamento confirmado” é simulada. A confirmação depende de resposta do atendimento.
- Alterar os campos ou retirar o consentimento invalida o link preparado.
- O formulário fica desabilitado se o JavaScript não carregar, evitando envio involuntário por URL.
- Não há banco de dados, localStorage, sessionStorage, pixels ou analytics. O conteúdo digitado permanece na memória da página até o visitante abrir o WhatsApp. O serviço externo pode receber o texto no link antes da confirmação final no aplicativo, conforme explicado na política.
- Google Maps é carregado somente por solicitação do visitante e pode ser removido. Não há localização de exemplo nem requisição ao Google no carregamento inicial.

## SEO e publicação

No modo de personalização, a página usa **noindex, nofollow** e `robots.txt` bloqueando indexação. Não há dados estruturados com identidade fictícia.

O build publicado gera title, description, Open Graph, canonical, JSON-LD `Person`, robots e sitemap estáticos. A identificação profissional real e as obrigações de publicidade precisam ser revistas antes de publicar. Crawlers de compartilhamento não precisam executar JavaScript para ler as metatags.

O endereço de produção (`siteUrl`) e a localização exata no mapa ainda precisam ser confirmados. A disponibilidade dos serviços externos e a entrega de mensagens devem ser testadas após essa configuração.

## Arquivos

- `index.html`: estrutura semântica e conteúdo educativo.
- `styles.css`: identidade visual e responsividade.
- `config.js`: todos os dados editáveis da profissional.
- `app.js`: personalização, navegação, formulário, políticas e mapa.
- `assets/`: ícone, logos e retrato autorizado.
- `scripts/build.cjs`: geração portátil e SEO estático.
- `vercel.json`: build e diretório servido na Vercel.
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

Dependências de desenvolvimento fixadas em `package-lock.json`. Consulte `qa/v4/RELATORIO.md` para a revisão atual; `qa/v3/RELATORIO.md` documenta a versão anterior; `qa/IDENTIDADE-V2.md` documenta o rebranding anterior; `qa/RELATORIO.md` documenta a versão inicial. Testes automatizados de acessibilidade não substituem avaliação humana completa com leitores de tela.

## Revisão editorial antes de publicar

- Validar nome, CRBM/região, habilitação e títulos profissionais com a profissional.
- Revisar os textos-base e os diferenciais para refletir o atendimento real.
- Confirmar autorizações das imagens, marca e contatos.
- Revisar Política de Privacidade, retenção, serviços de terceiros e hospedagem.
- Não acrescentar promessas de resultado, preços, promoções, números sem comprovação, depoimentos inventados ou galeria de antes e depois.
- A estrutura não constitui diagnóstico, consulta ou parecer jurídico sobre publicidade profissional.
