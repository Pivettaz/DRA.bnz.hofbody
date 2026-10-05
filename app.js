/* Comportamentos são acrescentados em módulos funcionais neste arquivo.
   O conteúdo educativo permanece disponível mesmo sem JavaScript. */
'use strict';

(() => {
  const config = window.SITE_CONFIG || {};
  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];
  const filled = value => typeof value === 'string' && value.trim() !== '' && !/[\[\]]/.test(value);
  const text = (value, fallback) => filled(value) ? value.trim() : fallback;
  const doctor = `Dra. ${text(config.name, '[NOME COMPLETO]')}`;
  const crm = filled(config.crm) && filled(config.uf) ? `CRM-${config.uf} ${config.crm}` : '[CRM E ESTADO]';
  const values = { ...config, doctor, crm };
  $$('[data-bind]').forEach(el => {
    const value = values[el.dataset.bind];
    if (filled(value) || ['doctor', 'crm'].includes(el.dataset.bind)) el.textContent = value;
  });
  $$('[data-optional]').forEach(el => { el.hidden = !filled(config[el.dataset.optional]); });
  const specialtyConfirmed = config.specialtyRegistered === true && filled(config.specialty) && filled(config.rqe);
  $$('[data-specialty]').forEach(el => {
    el.hidden = !specialtyConfirmed;
    if (specialtyConfirmed) el.textContent = `${config.specialty} · RQE ${config.rqe}`;
  });
  $('#specialty-note').hidden = specialtyConfirmed || config.published === true;
  if (Array.isArray(config.confirmedDifferentials) && config.confirmedDifferentials.some(filled)) {
    $('#differentials').replaceChildren(...config.confirmedDifferentials.filter(filled).map(value => {
      const li = document.createElement('li'); li.textContent = value; return li;
    }));
    $('[data-differential-note]').hidden = true;
  }
  const assetUrl = value => {
    if (!filled(value)) return null;
    try { const url = new URL(value, location.href); return ['http:', 'https:', 'file:'].includes(url.protocol) ? url.href : null; } catch { return null; }
  };
  $$('[data-portrait]').forEach(el => {
    const source = el.dataset.portrait === 'secondary' ? config.portraitSecondary || config.portrait : config.portrait;
    const src = assetUrl(source);
    if (!src) return;
    const image = new Image();
    image.alt = text(config.portraitAlt, `Fotografia profissional de ${doctor}`);
    image.width = 960; image.height = 1200; image.decoding = 'async';
    image.loading = el.dataset.portrait === 'primary' ? 'eager' : 'lazy';
    if (el.dataset.portrait === 'primary') image.fetchPriority = 'high';
    image.addEventListener('load', () => { el.querySelector('.portrait-placeholder')?.setAttribute('hidden', ''); });
    image.addEventListener('error', () => image.remove());
    image.src = src; el.append(image);
  });
  if (assetUrl(config.logo)) {
    $$('.brand-symbol').forEach(el => {
      const image = new Image(); image.alt = text(config.brand, doctor); image.src = assetUrl(config.logo);
      image.addEventListener('error', () => image.replaceWith(el)); el.replaceWith(image);
    });
  }
  if (filled(config.brand)) $$('.brand-name').forEach(el => { el.textContent = config.brand; });
  $('#brand-note').hidden = filled(config.brand) || filled(config.logo);
  $('#copyright-year').textContent = new Date().getFullYear();
  const title = `Dra. ${text(config.name, '[NOME]')} | Escleroterapia e Microagulhamento em ${text(config.city, '[CIDADE]')}`;
  const description = `Conheça o atendimento da Dra. ${text(config.name, '[NOME]')} em ${text(config.city, '[CIDADE]')}. Informações sobre secagem de vasinhos, microagulhamento, localização e agendamento.`;
  document.title = title;
  $('meta[name="description"]').content = description;
  $('meta[property="og:title"]').content = title;
  $('meta[property="og:description"]').content = description;

  const menu = $('#main-nav');
  const menuToggle = $('.menu-toggle');
  const setMenu = open => {
    menu.classList.toggle('open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
  };
  menuToggle.addEventListener('click', () => setMenu(menuToggle.getAttribute('aria-expanded') !== 'true'));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu.classList.contains('open')) { setMenu(false); menuToggle.focus(); }
  });
  document.addEventListener('click', event => {
    if (!event.target.closest('.site-header')) setMenu(false);
  });
  menu.addEventListener('focusout', () => {
    setTimeout(() => { if (!$('.site-header').contains(document.activeElement)) setMenu(false); }, 0);
  });
  const navLinks = $$('#main-nav a:not(.button)');
  const setActive = id => navLinks.forEach(link => {
    if (link.hash === `#${id}`) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
  navLinks.forEach(link => link.addEventListener('click', () => {
    setActive(link.hash.slice(1)); setMenu(false);
    const destination = $(link.hash); destination.setAttribute('tabindex', '-1'); destination.focus({ preventScroll: true });
  }));
  const navSections = navLinks.map(link => $(link.hash));
  let scrollPending = false;
  const updateActive = () => {
    const offset = $('.site-header').offsetHeight + 100;
    let current = navSections[0];
    navSections.forEach(section => { if (section.getBoundingClientRect().top <= offset) current = section; });
    setActive(current.id); scrollPending = false;
  };
  // Use DOM order, since Sobre appears after Tratamentos in this editorial layout.
  navSections.sort((a, b) => a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1);
  window.addEventListener('scroll', () => { if (!scrollPending) { scrollPending = true; requestAnimationFrame(updateActive); } }, { passive: true });
  window.matchMedia('(min-width: 1021px)').addEventListener('change', () => setMenu(false));
  $$('[data-service]').forEach(link => link.addEventListener('click', () => { $('#service').value = link.dataset.service; }));
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('reveal-in'); revealObserver.unobserve(entry.target); }
    }), { threshold: .1 });
    $$('.section-heading, .journey-heading, .about-copy, .faq-heading').forEach(el => revealObserver.observe(el));
  }

  // Privacy: no analytics, no storage, no remote requests before explicit interaction.
  const escapeHTML = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const privacy = config.privacy || {};
  const dialog = $('#info-dialog');
  const showDialog = (heading, html) => {
    $('#dialog-title').textContent = heading;
    $('#dialog-content').innerHTML = html;
    if (!dialog.open) dialog.showModal();
  };
  $$('.dialog-close').forEach(button => button.addEventListener('click', () => dialog.close()));
  dialog.addEventListener('click', event => {
    const rect = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
  });
  const privacyContent = () => `
    <p class="draft-note">${privacy.reviewed ? 'Informações sobre o tratamento dos dados de contato.' : 'MODELO A REVISAR ANTES DA PUBLICAÇÃO. Preencha os campos e confirme as práticas reais de atendimento.'}</p>
    <h3>Responsável e contato</h3><p>${escapeHTML(text(privacy.controller, '[RESPONSÁVEL PELO TRATAMENTO DOS DADOS]'))}<br>${escapeHTML(text(privacy.contact, '[CONTATO DE PRIVACIDADE]'))}</p>
    <h3>Quais dados são utilizados?</h3><p>Nome, telefone, serviço de interesse, período preferido e mensagem opcional são usados apenas para responder à solicitação e organizar o contato. Não envie diagnósticos, fotos, documentos ou informações sensíveis de saúde.</p>
    <h3>Como funciona o formulário?</h3><p>Este site não armazena os campos preenchidos em banco de dados, cookies ou armazenamento local. A mensagem é preparada apenas na memória desta página. Ao selecionar “Continuar no WhatsApp”, os dados serão incluídos em um link enviado ao serviço do WhatsApp. Você ainda precisa confirmar o envio no aplicativo. A confirmação de agendamento depende de resposta do atendimento.</p>
    <h3>Consentimento e seus direitos</h3><p>O uso dos dados para responder à solicitação depende do consentimento informado no formulário. Você pode solicitar acesso, correção, exclusão ou revogação do consentimento pelo contato de privacidade acima, observadas as obrigações legais aplicáveis. Não há inclusão automática em campanhas de marketing.</p>
    <h3>Retenção e hospedagem</h3><p>Prazo e critérios de retenção após o recebimento: ${escapeHTML(text(privacy.retention, '[PRAZO E CRITÉRIOS DE RETENÇÃO A DEFINIR]'))}. Hospedagem e registros técnicos de acesso: ${escapeHTML(text(privacy.hostingProvider, '[PROVEDOR E PRÁTICAS DE HOSPEDAGEM A CONFIRMAR]'))}.</p>
    <h3>Serviços externos</h3><p>WhatsApp, Google Maps e redes sociais possuem políticas próprias. O mapa só é carregado após sua escolha; o Google pode receber seu IP e dados do navegador. Links externos só são acessados quando você os seleciona. Esta política deve ser revista sempre que novas integrações forem adicionadas.</p>`;
  const cookiesContent = `<p>Esta versão do site não utiliza cookies próprios, ferramentas de publicidade, analytics ou armazenamento local para rastrear visitantes.</p><h3>Mapa opcional</h3><p>O Google Maps permanece bloqueado até você escolher “Carregar mapa do Google”. Ao carregá-lo, o Google recebe dados de conexão e pode utilizar cookies conforme suas políticas. Você pode remover o mapa pelo botão “Remover mapa”. Na próxima visita, o mapa volta a ficar bloqueado.</p><h3>Links externos</h3><p>WhatsApp e redes sociais podem utilizar cookies quando você acessa esses serviços. Não são carregados automaticamente por esta página.</p><h3>Antes de publicar</h3><p>Se forem incluídos pixels, analytics, vídeos, fontes remotas ou outras integrações, revise este aviso e adicione os controles de consentimento necessários antes de ativá-los.</p>`;
  $$('[data-dialog]').forEach(button => button.addEventListener('click', () => {
    showDialog(button.dataset.dialog === 'privacy' ? 'Política de Privacidade' : 'Aviso de Cookies', button.dataset.dialog === 'privacy' ? privacyContent() : cookiesContent);
  }));
  const httpsUrl = value => {
    if (!filled(value)) return null;
    try { const url = new URL(value); return url.protocol === 'https:' ? url.href : null; } catch { return null; }
  };
  const digits = value => String(value || '').replace(/\D/g, '');
  const nationalPhone = value => {
    let number = digits(value);
    if ((number.length === 12 || number.length === 13) && number.startsWith('55')) number = number.slice(2);
    return /^[1-9][0-9](?:[2-5][0-9]{7}|9[0-9]{8})$/.test(number) ? number : null;
  };
  const whatsapp = nationalPhone(config.whatsapp);
  const defaultMessage = `Olá, ${doctor}! Encontrei seu site e gostaria de receber informações para agendar uma avaliação.`;
  const whatsappUrl = message => `https://wa.me/55${whatsapp}?text=${encodeURIComponent(message)}`;
  const external = (el, url) => { el.href = url; el.target = '_blank'; el.rel = 'noopener noreferrer'; };
  $$('[data-whatsapp]').forEach(link => {
    if (whatsapp) external(link, whatsappUrl(defaultMessage));
    else link.addEventListener('click', event => {
      event.preventDefault(); showDialog('Contato em configuração', '<p>O WhatsApp ainda não foi configurado. Este modelo não envia mensagens nem confirma agendamentos. Preencha o número real em <strong>config.js</strong> antes da publicação.</p>');
    });
  });
  $('#contact-status').textContent = whatsapp ? 'O WhatsApp abrirá em uma nova aba. O agendamento depende de confirmação.' : '[WHATSAPP A CONFIGURAR — nenhum agendamento é enviado neste modelo]';
  const email = filled(config.email) && /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(config.email) ? config.email : null;
  const phone = nationalPhone(config.phone);
  const maps = httpsUrl(config.mapsUrl) || (filled(config.address) ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(config.address)}` : null);
  const contacts = { maps, instagram: httpsUrl(config.instagram), facebook: httpsUrl(config.facebook), email: email ? `mailto:${email}` : null, phone: phone ? `tel:+55${phone}` : null };
  $$('[data-contact]').forEach(link => {
    const url = contacts[link.dataset.contact];
    if (url) { if (url.startsWith('https:')) external(link, url); else link.href = url; }
    else link.addEventListener('click', event => { event.preventDefault(); showDialog('Informação ainda não disponível', '<p>Este contato ou endereço ainda não foi configurado. O campo correspondente permanece marcado para preenchimento com os dados reais da profissional.</p>'); });
  });

  const form = $('#contact-form');
  const formStatus = $('#form-status');
  const sendLink = $('#whatsapp-send');
  const privacyReady = privacy.reviewed === true && ['controller', 'contact', 'retention', 'hostingProvider'].every(key => filled(privacy[key]));
  const maskPhone = value => {
    let number = digits(value);
    if ((number.length === 12 || number.length === 13) && number.startsWith('55')) number = number.slice(2);
    number = number.slice(0, 11);
    if (!number) return '';
    if (number.length < 3) return `(${number}`;
    const rest = number.slice(2), split = rest.length > 8 ? 5 : 4;
    return `(${number.slice(0, 2)}) ${rest.slice(0, split)}${rest.length > split ? `-${rest.slice(split)}` : ''}`;
  };
  $('#phone').addEventListener('input', event => { event.target.value = maskPhone(event.target.value); });
  const invalidateMessage = () => {
    sendLink.hidden = true; sendLink.removeAttribute('href');
    formStatus.textContent = ''; formStatus.classList.remove('error');
  };
  form.addEventListener('input', event => {
    invalidateMessage();
    if (event.target.id && $(`#${event.target.id}-error`)) {
      $(`#${event.target.id}-error`).textContent = ''; event.target.removeAttribute('aria-invalid');
    }
  });
  form.addEventListener('change', invalidateMessage);
  $$('[data-service]').forEach(link => link.addEventListener('click', invalidateMessage));
  form.addEventListener('submit', event => {
    event.preventDefault(); invalidateMessage();
    const errors = {
      name: $('#name').value.trim().length < 2 ? 'Informe seu nome com pelo menos 2 caracteres.' : '',
      phone: !nationalPhone($('#phone').value) ? 'Informe um telefone brasileiro válido com DDD.' : '',
      service: !$('#service').value ? 'Selecione um serviço de interesse.' : '',
      period: !$('#period').value ? 'Selecione o melhor período para contato.' : '',
      consent: !$('#consent').checked ? 'O consentimento é necessário para preparar a mensagem.' : ''
    };
    let firstInvalid = null;
    Object.entries(errors).forEach(([id, message]) => {
      $(`#${id}-error`).textContent = message;
      if (message) { $(`#${id}`).setAttribute('aria-invalid', 'true'); firstInvalid ||= $(`#${id}`); }
      else $(`#${id}`).removeAttribute('aria-invalid');
    });
    if (firstInvalid) {
      formStatus.textContent = 'Revise os campos indicados. Nenhum dado foi enviado.';
      formStatus.classList.add('error'); firstInvalid.focus(); return;
    }
    if (!whatsapp || !privacyReady) {
      formStatus.textContent = 'Nenhum dado foi enviado. O formulário está em modo de personalização: configure o WhatsApp e revise a Política de Privacidade antes de habilitar o contato.';
      formStatus.classList.add('error'); formStatus.focus(); return;
    }
    const message = [defaultMessage, '', `Nome: ${$('#name').value.trim()}`, `Telefone: ${$('#phone').value}`, `Serviço de interesse: ${$('#service').value}`, `Melhor período: ${$('#period').value}`, $('#message').value.trim() ? `Mensagem: ${$('#message').value.trim()}` : '', '', 'Autorizo o uso dos dados acima para responder à minha solicitação de contato.'].filter((line, index) => line || index === 1).join('\n');
    external(sendLink, whatsappUrl(message)); sendLink.hidden = false;
    formStatus.textContent = 'Mensagem preparada. Nenhum dado foi enviado ainda. Clique em “Continuar no WhatsApp”, confira a mensagem e confirme o envio no aplicativo. O agendamento depende de confirmação do atendimento.';
    formStatus.focus();
  });

  $('#form-fields').disabled = false;

  let mapEmbed = null;
  if (httpsUrl(config.mapsEmbedUrl)) {
    const url = new URL(config.mapsEmbedUrl);
    if (['www.google.com', 'maps.google.com', 'www.google.com.br'].includes(url.hostname) && url.pathname.startsWith('/maps/embed')) mapEmbed = url.href;
  }
  if (!mapEmbed && filled(config.address)) mapEmbed = `https://www.google.com/maps?q=${encodeURIComponent(config.address)}&output=embed`;
  if (mapEmbed) {
    $('[data-map-label]').textContent = text(config.address, 'Google Maps');
    $('.map-help').textContent = 'Para preservar sua privacidade, o mapa só é carregado quando você escolher o botão abaixo.';
  }
  $('#load-map').addEventListener('click', () => {
    if (!mapEmbed) {
      showDialog('Localização em configuração', '<p>O endereço e o mapa ainda não foram configurados. Adicione o endereço real ou o link de incorporação do Google Maps em <strong>config.js</strong>. Nenhuma localização fictícia é exibida.</p>'); return;
    }
    const frame = document.createElement('iframe');
    frame.title = 'Localização do atendimento no Google Maps';
    frame.loading = 'lazy'; frame.referrerPolicy = 'no-referrer'; frame.allowFullscreen = true; frame.src = mapEmbed;
    const remove = document.createElement('button');
    remove.type = 'button'; remove.className = 'button small light map-unload'; remove.textContent = 'Remover mapa';
    const placeholder = $('.map-placeholder'); placeholder.hidden = true;
    $('#map-container').append(frame, remove); remove.focus({ preventScroll: true });
    remove.addEventListener('click', () => { frame.remove(); remove.remove(); placeholder.hidden = false; $('#load-map').focus({ preventScroll: true }); });
  });

  // SEO publication is finalized at build time to support crawlers without JavaScript.
  if (config.published === true && filled(config.name) && filled(config.crm) && filled(config.uf) && filled(config.city) && whatsapp && privacyReady) {
    $('#preview-note').hidden = true;
    $('meta[name="robots"]').content = 'index, follow';
  }




})();

