# Identidade visual — revisão V2

## Escopo preservado

Alterações limitadas à paleta, estados visuais, aplicação da marca e reserva de retrato. Os textos, oito seções, dados cadastrais, links e contatos foram comparados automaticamente com a versão anterior. O código de navegação, WhatsApp, formulário, privacidade e mapa permanece idêntico, verificado por comparação literal desde o início do módulo de navegação. Somente o bloco visual da segunda foto foi substituído.

A versão anterior está preservada em `../landing-medica-v1-preservada/`. A fixture dentro de `tests/fixtures/before-identity/` permite executar o teste de preservação no ZIP entregue sem depender daquela pasta externa.

## Origem e cores reais

Pasta fornecida: https://drive.google.com/drive/folders/1Ctu7P5fhIgR2I-rBF1zV_pOZrGZnmGwA

Arquivos usados para análise: `logo gold.png`, `logo nude.png`, `logo azul.pdf` e `logo branco.pdf`. O arquivo chamado `Logo.png` contém outra composição (“MÉTODO BNZ PERFIL”) e não foi usado como logo profissional.

Cores medidas nos pixels dos arquivos, não adivinhadas:

| Papel | Cor | Origem |
|---|---|---|
| Principal | `#171F2F` | Azul-marinho de fundo do PNG gold |
| Secundária | `#D2C5B3` | Nude da marca e fundo da versão azul |
| Destaque | `#E7CFA0` | Dourado dominante da marca no PNG gold |
| Apoio | `#A59281` | Fundo taupe da versão branca |
| Fundo da página | `#FAF9F7` | Mistura de 10% nude com branco |
| Texto | `#2E3544` | Variação da cor principal com branco |

Os demais tons neutros, hover, bordas, ícones, fundos, foco e sombras estão centralizados em `:root` no CSS. O vermelho de validação existente foi mantido como cor semântica de erro, não como parte da marca. Não há valores de cor diretamente nos componentes CSS.

## Aplicação das logos

- **Sobre a doutora:** versão oficial azul sobre nude, no mesmo espaço do antigo segundo retrato, preservando proporção e composição completas, com `object-fit: contain` e sem filtros.
- **Cabeçalho e rodapé:** mesma marca em aplicação compacta. Só foram reduzidas margens externas uniformes da tela original; nenhuma letra, símbolo ou elemento da marca foi recortado, redesenhado ou recolorido.
- A versão gold sobre azul está disponível como alternativa automática para superfícies escuras. A seleção foi testada.
- PDF convertido para raster de 1500 × 1500 px; WebP sem perdas. PNG gold original preservado em 1080 × 1081 px.
- Os arquivos profissionais analisados possuem fundo. Não foi removido artificialmente o fundo nem usada a composição de outro método apenas por ela conter transparência. Uma tentativa adicional de baixar variantes com transparência não foi executada por ausência de confirmação da ferramenta; não foi repetida. Foram usadas as versões oficiais já obtidas.
- As logos são incorporadas no HTML final, que continua funcionando mesmo sem uma pasta `assets` ao lado.

## Fotografia

**Não existe fotografia real da doutora nesta entrega**, pois não foi fornecida. Existe **apenas uma reserva para fotografia, no Hero**. Ao preencher `portrait`, a imagem é exibida somente ali. A configuração antiga `portraitSecondary` não é utilizada. Um teste com fixture de imagem confirmou que a foto futura não é repetida no bloco Sobre.

O nome presente no arquivo da marca não foi usado para alterar textos ou preencher credenciais, respeitando a restrição de preservação do conteúdo. Nenhuma especialidade foi inferida de “HOF | BODY”.

## Verificações executadas

**24 testes aprovados, zero falhas, zero instáveis e zero ignorados** em `qa/identity-test-execution.log`.

- Regressão completa das funcionalidades anteriores.
- Preservação dos textos e contatos em comparação com a versão anterior.
- Uma única reserva de retrato; logo no lugar do segundo retrato.
- Seleção da versão oficial para fundo escuro.
- HTML portátil com logos incorporadas.
- Ausência de overflow horizontal em 320, 390, 768, 1024 e 1440 px.
- Auditoria axe-core WCAG 2 A/AA e 2.1 A/AA sem violações automáticas nas cinco larguras.
- Capturas reais e inspeção visual em desktop, tablet e celular, incluindo o bloco Sobre.

Contrastes calculados:

| Combinação | Razão |
|---|---:|
| Texto branco / botão principal azul | 16,49:1 |
| Texto branco / hover azul | 17,75:1 |
| Texto principal / fundo claro | 11,68:1 |
| Texto secundário / fundo claro | 5,81:1 |
| Texto de destaque escuro / fundo claro | 5,68:1 |
| Dourado claro / azul | 10,86:1 |
| Borda de campo / branco | 3,98:1 |

O dourado claro não é usado como texto pequeno sobre branco. Os testes automáticos não equivalem a certificação completa de acessibilidade. Navegador usado: Chromium. Os destinos reais de WhatsApp/mapa continuam pendentes de configuração; nenhum envio externo foi realizado.

## Prévia

`qa/previa-identidade.jpg` reúne capturas reais do Hero e da seção Sobre. Há também capturas desktop, tablet e celular e seus recortes de Sobre. O corte lateral do botão flutuante em um recorte da seção não é overflow da página: o recorte captura apenas o container, enquanto o botão está preso à viewport; os testes de largura da página passam.
