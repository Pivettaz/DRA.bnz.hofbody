/* PERSONALIZAÇÃO: altere somente este objeto e execute npm run build.
   Use exclusivamente dados confirmados pela profissional.
   Valores vazios geram indicações visíveis, nunca identidades ou contatos fictícios. */
window.SITE_CONFIG = {
  // Dados profissionais confirmados; informe o registro no CRBM antes da publicação.
  name: 'Bruna Nobre Zenícola', biography: 'Sua atuação une regeneração, harmonização e excelência técnica. Cada tratamento é planejado de forma individualizada e criteriosa. A segurança do paciente é prioridade em cada etapa do cuidado. Seu propósito é realçar a beleza sem perder a essência de cada rosto e corpo. Com naturalidade, harmonia e atenção a cada detalhe, busca resultados sofisticados e equilibrados.', crbm: '', crbmRegion: '', city: 'Piracicaba', state: 'SP',
  education: 'Biomédica Esteta — atuação em procedimentos estéticos injetáveis.', complementaryEducation: 'Especialista em Perfiloplastia. Mentora na área da estética. Fundadora da BNZ — Dra. Bruna Zenícola.',
  // Confirmar os diferenciais antes de publicá-los como características do atendimento.
  confirmedDifferentials: [
    'Segurança e responsabilidade técnica — Avaliação criteriosa, planejamento individualizado e atenção à segurança em cada etapa do tratamento.',
    'Naturalidade e harmonia estética — Tratamentos que respeitam a anatomia e a identidade de cada paciente, valorizando a beleza sem excessos.',
    'Excelência e personalização — Protocolos planejados de forma individualizada, integrando harmonização, regeneração e cuidado, com atenção a cada detalhe.'
  ],
  // WhatsApp e telefone: DDD + número, com ou sem +55. Nunca usar um número de teste em produção.
  whatsapp: '(19) 99905-2156', phone: '', email: 'bnz.drabruna@gmail.com', instagram: 'https://www.instagram.com/bnz.hofbody/', instagramHandle: '@bnz.hofbody', facebook: '',
  address: 'Avenida França, 34, sala 2 — Espaço Jardim Europa, Piracicaba, SP', reference: 'Espaço Jardim Europa', hours: 'Segunda a sexta, das 8h às 18h. Sábados alternados, das 9h às 14h.', parking: '', accessibility: '',
  // Link de compartilhamento do Google Maps. O mapa pode ser gerado pelo endereço real.
  mapsUrl: '',
  // Opcional: somente a URL src do iframe "Incorporar um mapa" (https://www.google.com/maps/embed?...).
  mapsEmbedUrl: '',
  // Identidade visual no cabeçalho/hero e retrato profissional na seção Sobre.
  portrait: 'assets/identidade/bruna-nobre-zenicola.jpeg', portraitAlt: 'Bruna Nobre Zenícola em seu consultório',
  headerLogo: 'assets/identidade/bnz-cabecalho.webp',
  heroLogo: 'assets/identidade/bnz-hof-body-compacto.webp',
  logo: 'assets/identidade/logo-azul.webp', brand: '',
  logoDark: 'assets/identidade/logo-gold.webp',
  logoCompact: 'assets/identidade/logo-azul-compacta.webp',
  logoCompactDark: 'assets/identidade/logo-gold-compacta.webp',
  logoAlt: 'Logotipo oficial da Dra. Bruna Zenícola — HOF | BODY',
  // Domínio completo HTTPS, sem barra final. Usado no canonical e Open Graph após o build.
  siteUrl: '', ogImage: '',
  // Publicação: mantenha false até revisar conteúdo, credenciais, contatos e privacidade.
  published: false,
  privacy: {
    controller: 'Bruna Nobre Zenícola', contact: 'bnz.drabruna@gmail.com',
    retention: 'As mensagens de contato são excluídas após 6 meses sem novas interações, desde que não haja pendências no atendimento.',
    hostingProvider: 'Vercel — hospedagem do site estático. A plataforma pode tratar dados técnicos de acesso, como endereço IP e informações das requisições, conforme sua política de privacidade.',
    // Marque apenas após revisar a política e confirmar os campos acima.
    reviewed: true
  }
};
