/* PERSONALIZAÇÃO: altere somente este objeto e execute npm run build.
   Use exclusivamente dados confirmados pela profissional.
   Valores vazios geram indicações visíveis, nunca identidades ou contatos fictícios. */
window.SITE_CONFIG = {
  // Nome sem o prefixo Dra.; CRM e UF separados.
  name: '', biography: '', crm: '', uf: '', city: '',
  // Só exibir especialidade quando registrada E acompanhada de RQE verdadeiro.
  specialty: '', rqe: '', specialtyRegistered: false,
  education: '', complementaryEducation: '',
  // Confirmar os diferenciais antes de publicá-los como características do atendimento.
  confirmedDifferentials: [],
  // WhatsApp e telefone: DDD + número, com ou sem +55. Nunca usar um número de teste em produção.
  whatsapp: '', phone: '', email: '', instagram: '', facebook: '',
  address: '', reference: '', hours: '', parking: '', accessibility: '',
  // Link de compartilhamento do Google Maps. O mapa pode ser gerado pelo endereço real.
  mapsUrl: '',
  // Opcional: somente a URL src do iframe "Incorporar um mapa" (https://www.google.com/maps/embed?...).
  mapsEmbedUrl: '',
  // Os dois arquivos enviados: símbolo no cabeçalho, BNZ + HOF | BODY no Hero.
  // A foto não é utilizada nesta composição.
  portrait: '', portraitAlt: '',
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
    controller: '', contact: '', retention: '', hostingProvider: '',
    // Marque apenas após revisar a política e confirmar os campos acima.
    reviewed: false
  }
};
