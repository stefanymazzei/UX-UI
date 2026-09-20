document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.reveal-on-scroll').forEach((element) => element.classList.add('is-revealed'));

  const languageTrigger = document.querySelector('#btn-lang-trigger');
  const languageMenu = document.querySelector('#lang-dropdown-menu');
  languageTrigger?.addEventListener('click', () => languageMenu?.classList.toggle('active'));

  document.querySelectorAll('.sandbox-toggle-btn').forEach((button) => {
    button.addEventListener('click', () => button.classList.toggle('active'));
  });

  const toggleButton = document.querySelector('#btn-toggle-ux');
  toggleButton?.addEventListener('click', () => document.body.classList.toggle('mode-no-ux'));
});/**
 * ============================================================================
 * NO UX & UI - Engine Interativa com Suporte Multilíngue (i18n)
 * Português (Brasil), English, Español
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // Estado da Aplicação
  let isNoUxMode = false;
  let isSoundEnabled = true;
  let confirmationStep = 1;
  let pendingTarget = null;
  let statsAnimated = false;
  let currentLang = localStorage.getItem('no_ux_lang') || 'pt';

  // Obter Dicionário de Traduções
  const dict = window.translations || (typeof translations !== 'undefined' ? translations : {});

  // Elementos do DOM
  const body = document.body;
  const html = document.documentElement;
  const btnToggleUx = document.getElementById('btn-toggle-ux');
  const btnToggleText = document.getElementById('btn-toggle-text');
  const btnToggleIcon = document.querySelector('.btn-icon-inside');
  const btnToggleSubtext = document.getElementById('btn-toggle-subtext');
  const statusBadge = document.getElementById('status-badge');
  const statusText = document.getElementById('status-text');
  const toggleCardTitle = document.getElementById('toggle-card-title');
  const toggleCardDesc = document.getElementById('toggle-card-desc');
  const btnSoundToggle = document.getElementById('btn-sound-toggle');
  const soundIcon = document.getElementById('sound-icon');
  const soundLabel = document.querySelector('.sound-label');
  const scrollProgress = document.getElementById('scroll-progress');

  // Elementos do Modal de Confirmação em 4 Níveis
  const modalOverlay = document.getElementById('ux-modal-overlay');
  const modalTitlebar = document.querySelector('.ux-modal-titlebar span');
  const modalStepBadge = document.getElementById('modal-step-badge');
  const modalQuestion = document.getElementById('modal-question');
  const modalSubtext = document.getElementById('modal-subtext');
  const modalIcon = document.getElementById('modal-icon');
  const btnModalYes = document.getElementById('btn-modal-yes');
  const btnModalNo = document.getElementById('btn-modal-no');
  const btnModalClose = document.getElementById('btn-modal-close');
  const modalActions = document.querySelector('.ux-modal-actions');

  // Elementos troll adicionais
  const btnCookieFlee = document.getElementById('btn-cookie-flee');
  const btnCookieAccept = document.getElementById('btn-cookie-accept');
  const cookieBanner = document.getElementById('cookie-banner-bad');
  const dummyForm = document.getElementById('dummy-form');

  // Sandbox interativo
  const sandboxPreview = document.getElementById('sandbox-preview');
  const toggleHierarchy = document.getElementById('toggle-hierarchy');
  const toggleContrast = document.getElementById('toggle-contrast');
  const toggleWhitespace = document.getElementById('toggle-whitespace');

  // Seletor de Idiomas Dropdown
  const langDropdownContainer = document.getElementById('lang-dropdown-container');
  const btnLangTrigger = document.getElementById('btn-lang-trigger');
  const langDropdownMenu = document.getElementById('lang-dropdown-menu');
  const langOptionItems = document.querySelectorAll('.lang-option-item');
  const currentLangLabel = document.getElementById('current-lang-label');

  // Toast
  const toastElement = document.getElementById('ux-toast');
  let toastTimer = null;

  /* --------------------------------------------------------------------------
     1. SISTEMA DE TRADUÇÃO MULTILÍNGUE (i18n)
     -------------------------------------------------------------------------- */
  function t(key) {
    if (dict[currentLang] && dict[currentLang][key]) {
      return dict[currentLang][key];
    }
    if (dict['pt'] && dict['pt'][key]) {
      return dict['pt'][key];
    }
    return key;
  }

  function removeDecorativeEmojis(value) {
    return value.replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}\u{1F1E6}-\u{1F1FF}]/gu, '').replace(/ {2,}/g, ' ').trim();
  }

  function applyLanguage(lang) {
    if (!dict[lang]) lang = 'pt';
    currentLang = lang;
    localStorage.setItem('no_ux_lang', lang);

    // Atualiza tag html
    const htmlLangs = { pt: 'pt-BR', en: 'en', es: 'es' };
    html.setAttribute('lang', htmlLangs[lang] || 'pt-BR');

    // Atualiza classes ativas dos itens de idioma no dropdown
    langOptionItems.forEach(item => {
      item.classList.toggle('active', item.getAttribute('data-lang') === lang);
    });

    // Atualiza texto visível no botão do dropdown
    if (currentLangLabel) {
      currentLangLabel.textContent = t('current_lang_label');
    }

    // Atualiza elementos com data-i18n (textContent)
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (key && dict[lang] && dict[lang][key]) {
        el.textContent = removeDecorativeEmojis(dict[lang][key]);
      }
    });

    // Atualiza elementos com data-i18n-html (innerHTML)
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      const key = el.getAttribute('data-i18n-html');
      if (key && dict[lang] && dict[lang][key]) {
        el.innerHTML = removeDecorativeEmojis(dict[lang][key]);
      }
    });

    // Atualiza placeholders com data-i18n-placeholder
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (key && dict[lang] && dict[lang][key]) {
        el.setAttribute('placeholder', dict[lang][key]);
      }
    });

    // Atualiza estado do botão principal dependendo do modo
    if (isNoUxMode) {
      btnToggleText.textContent = t('toggle_btn_no');
      btnToggleSubtext.textContent = t('toggle_subtext_no');
      statusText.textContent = t('status_no_ux');
      toggleCardTitle.textContent = t('toggle_title_no');
      toggleCardDesc.textContent = t('toggle_desc_no');
    } else {
      btnToggleText.textContent = t('toggle_btn_yes');
      btnToggleSubtext.textContent = t('toggle_subtext_yes');
      statusText.textContent = t('status_yes_ux');
      toggleCardTitle.textContent = t('toggle_title_yes');
      toggleCardDesc.textContent = t('toggle_desc_yes');
    }

    // Atualiza rótulos do áudio
    soundLabel.textContent = isSoundEnabled ? t('audio_on') : t('audio_off');

    // Atualiza rótulos dos toggles do Sandbox
    updateSandboxLabels();
  }

  function updateSandboxLabels() {
    if (toggleHierarchy) {
      const isHierActive = toggleHierarchy.classList.contains('active');
      const label = toggleHierarchy.querySelector('.state-label');
      if (label) label.textContent = isHierActive ? t('state_on') : t('state_off');
    }
    if (toggleContrast) {
      const isContActive = toggleContrast.classList.contains('active');
      const label = toggleContrast.querySelector('.state-label');
      if (label) label.textContent = isContActive ? t('state_contrast_on') : t('state_contrast_off');
    }
    if (toggleWhitespace) {
      const isSpaceActive = toggleWhitespace.classList.contains('active');
      const label = toggleWhitespace.querySelector('.state-label');
      if (label) label.textContent = isSpaceActive ? t('state_space_on') : t('state_space_off');
    }
  }

  // Controle de abertura/fechamento do Dropdown de Idiomas
  function toggleLangDropdown(forceState) {
    if (!langDropdownMenu || !btnLangTrigger) return;
    const isCurrentlyOpen = langDropdownMenu.classList.contains('active');
    const newState = typeof forceState === 'boolean' ? forceState : !isCurrentlyOpen;
    
    langDropdownMenu.classList.toggle('active', newState);
    btnLangTrigger.classList.toggle('open', newState);
    btnLangTrigger.setAttribute('aria-expanded', newState ? 'true' : 'false');
  }

  if (btnLangTrigger) {
    btnLangTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleLangDropdown();
      playClickPop();
    });
  }

  // Fechar dropdown ao clicar fora
  document.addEventListener('click', (e) => {
    if (!e.target.closest('#lang-dropdown-container')) {
      toggleLangDropdown(false);
    }
  });

  // Fechar ao pressionar tecla Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      toggleLangDropdown(false);
    }
  });

  // Event Listeners nos itens de idioma do dropdown
  langOptionItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      const selectedLang = item.getAttribute('data-lang');
      if (selectedLang) {
        applyLanguage(selectedLang);
        toggleLangDropdown(false);
        playClickPop();
        const toastMsg = selectedLang === 'pt' ? 'Idioma: Português (Brasil) 🇧🇷' : 
                         selectedLang === 'en' ? 'Language: English (US) 🇺🇸' : 'Idioma: Español (ES) 🇪🇸';
        showToast(toastMsg, 'toast-success');
      }
    });
  });

  /* --------------------------------------------------------------------------
     2. SISTEMA DE ÁUDIO SINTETIZADO (WEB AUDIO API)
     -------------------------------------------------------------------------- */
  let audioCtx = null;

  function getAudioContext() {
    if (!audioCtx) {
      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      if (AudioCtxClass) {
        audioCtx = new AudioCtxClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  function playTone(freq, type = 'sine', duration = 0.15, volume = 0.15) {
    if (!isSoundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      console.warn('Audio Context error:', e);
    }
  }

  function playSuccessChord() {
    if (!isSoundEnabled) return;
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      setTimeout(() => playTone(freq, 'sine', 0.4, 0.12), idx * 75);
    });
  }

  function playErrorBuzzer() {
    if (!isSoundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(80, ctx.currentTime + 0.25);

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } catch (e) {}
  }

  function playAlertBeep() {
    playTone(880, 'square', 0.12, 0.1);
    setTimeout(() => playTone(587.33, 'square', 0.2, 0.15), 100);
  }

  function playClickPop() {
    playTone(600, 'triangle', 0.05, 0.08);
  }

  /* --------------------------------------------------------------------------
     3. FEEDBACK EM TOAST
     -------------------------------------------------------------------------- */
  function showToast(message, type = '') {
    if (!toastElement) return;
    clearTimeout(toastTimer);
    toastElement.className = `ux-toast show ${type}`;
    toastElement.innerHTML = `<span>${message}</span>`;

    toastTimer = setTimeout(() => {
      toastElement.className = 'ux-toast';
    }, 4000);
  }

  /* --------------------------------------------------------------------------
     4. AS 4 ETAPAS DE CONFIRMAÇÃO DO MODO NO UX (TRADUZIDAS)
     -------------------------------------------------------------------------- */
  function getStepData(step) {
    const pfx = t('modal_step_prefix');
    const ofTxt = t('modal_step_of');
    const finalTxt = step === 4 ? ` ${t('modal_step_final')}` : '';

    const questionsMap = {
      1: { qKey: 'q1_title', subKey: 'q1_sub', icon: '❓', invert: false },
      2: { qKey: 'q2_title', subKey: 'q2_sub', icon: '🤔', invert: true },
      3: { qKey: 'q3_title', subKey: 'q3_sub', icon: '⚠️', invert: false },
      4: { qKey: 'q4_title', subKey: 'q4_sub', icon: '🚨', invert: true }
    };

    const item = questionsMap[step];
    return {
      badge: `${pfx} ${step} ${ofTxt}${finalTxt}`,
      question: t(item.qKey),
      subtext: t(item.subKey),
      icon: item.icon,
      invertButtons: item.invert
    };
  }

  function updateModalStep(step) {
    const data = getStepData(step);
    if (!data) return;

    if (modalTitlebar) modalTitlebar.textContent = t('modal_titlebar');
    modalStepBadge.textContent = data.badge;
    modalQuestion.textContent = data.question;
    modalSubtext.textContent = data.subtext;
    modalIcon.textContent = data.icon;
    btnModalYes.textContent = t('btn_yes');
    btnModalNo.textContent = t('btn_no');

    // Alternar ordem dos botões como pegadinha anti-UX
    if (data.invertButtons) {
      modalActions.appendChild(btnModalYes);
      modalActions.insertBefore(btnModalNo, btnModalYes);
    } else {
      modalActions.appendChild(btnModalNo);
      modalActions.insertBefore(btnModalYes, btnModalNo);
    }

    playAlertBeep();
  }

  function openConfirmationModal(target) {
    pendingTarget = target;
    confirmationStep = 1;
    updateModalStep(confirmationStep);
    modalOverlay.classList.add('active');
  }

  function closeModal() {
    modalOverlay.classList.remove('active');
    confirmationStep = 1;
    pendingTarget = null;
  }

  // Clique em "NÃO" no Modal
  btnModalNo.addEventListener('click', (e) => {
    e.stopPropagation();
    playErrorBuzzer();
    closeModal();
    showToast(t('toast_cancel'), 'toast-warning');
  });

  // Botão fechar [X] no topo da barra de título
  btnModalClose.addEventListener('click', (e) => {
    e.stopPropagation();
    playErrorBuzzer();
    closeModal();
    showToast(t('toast_close'), 'toast-warning');
  });

  // Clique em "SIM" no Modal
  btnModalYes.addEventListener('click', (e) => {
    e.stopPropagation();

    if (confirmationStep < 4) {
      confirmationStep++;
      updateModalStep(confirmationStep);
    } else {
      const target = pendingTarget;
      closeModal();

      if (target && (target.id === 'btn-toggle-ux' || target.closest('#btn-toggle-ux'))) {
        setYesUxMode();
        showToast(t('toast_restored'), 'toast-success');
      } else {
        playAlertBeep();
        showToast(t('toast_confirmed_dummy'), 'toast-warning');
      }
    }
  });

  /* --------------------------------------------------------------------------
     5. INTERCEPTADOR UNIVERSAL DE CLIQUES (MODO NO UX)
     -------------------------------------------------------------------------- */
  window.addEventListener('click', (e) => {
    if (!isNoUxMode) return;

    // Se o clique foi dentro do modal ou no seletor de idiomas, não intercepta
    if (e.target.closest('#ux-modal-overlay') || e.target.closest('#lang-dropdown-container') || e.target.closest('#lang-selector')) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    const clickedTarget = e.target.closest('button, a, input, select, textarea, .feature-card, .btn-toggle-main') || e.target;
    openConfirmationModal(clickedTarget);
  }, true);

  /* --------------------------------------------------------------------------
     6. TRANSIÇÃO DE MODOS: YES UX <-> NO UX
     -------------------------------------------------------------------------- */
  function setNoUxMode() {
    isNoUxMode = true;
    body.classList.remove('mode-yes-ux');
    body.classList.add('mode-no-ux');
    html.classList.remove('mode-yes-ux');
    html.classList.add('mode-no-ux');

    btnToggleText.textContent = t('toggle_btn_no');
    btnToggleIcon.textContent = "✨";
    btnToggleSubtext.textContent = t('toggle_subtext_no');
    
    statusText.textContent = t('status_no_ux');
    toggleCardTitle.textContent = t('toggle_title_no');
    toggleCardDesc.textContent = t('toggle_desc_no');

    playErrorBuzzer();
    showToast(t('toast_no_ux_active'), 'toast-warning');
  }

  function setYesUxMode() {
    isNoUxMode = false;
    body.classList.remove('mode-no-ux');
    body.classList.add('mode-yes-ux');
    html.classList.remove('mode-no-ux');
    html.classList.add('mode-yes-ux');

    btnToggleText.textContent = t('toggle_btn_yes');
    btnToggleIcon.textContent = "💣";
    btnToggleSubtext.textContent = t('toggle_subtext_yes');

    statusText.textContent = t('status_yes_ux');
    toggleCardTitle.textContent = t('toggle_title_yes');
    toggleCardDesc.textContent = t('toggle_desc_yes');

    if (cookieBanner) cookieBanner.style.display = '';

    playSuccessChord();
    showToast(t('toast_yes_ux_active'), 'toast-success');
  }

  btnToggleUx.addEventListener('click', (e) => {
    if (!isNoUxMode) {
      playClickPop();
      setNoUxMode();
    }
  });

  /* --------------------------------------------------------------------------
     7. DARK PATTERNS DO MODO NO UX
     -------------------------------------------------------------------------- */
  if (btnCookieFlee) {
    btnCookieFlee.addEventListener('mouseenter', () => {
      if (!isNoUxMode) return;
      playAlertBeep();
      const randX = (Math.random() - 0.5) * 260;
      const randY = (Math.random() - 0.5) * 120;
      btnCookieFlee.style.transform = `translate(${randX}px, ${randY}px)`;
    });
  }

  if (btnCookieAccept) {
    btnCookieAccept.addEventListener('click', () => {
      if (cookieBanner) cookieBanner.style.display = 'none';
      showToast(t('toast_cookies_sold'), 'toast-warning');
    });
  }

  if (dummyForm) {
    dummyForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!isNoUxMode) {
        playSuccessChord();
        showToast(t('toast_form_success'), 'toast-success');
      }
    });
  }

  // Alternar Áudio
  if (btnSoundToggle) {
    btnSoundToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      isSoundEnabled = !isSoundEnabled;
      if (isSoundEnabled) {
        soundIcon.textContent = '🔊';
        soundLabel.textContent = t('audio_on');
        playClickPop();
        showToast(t('toast_audio_on'));
      } else {
        soundIcon.textContent = '🔇';
        soundLabel.textContent = t('audio_off');
        showToast(t('toast_audio_off'));
      }
    });
  }

  /* --------------------------------------------------------------------------
     8. SANDBOX INTERATIVO (PLAYGROUND DE UX)
     -------------------------------------------------------------------------- */
  if (toggleHierarchy && sandboxPreview) {
    toggleHierarchy.addEventListener('click', (e) => {
      e.stopPropagation();
      const isActive = toggleHierarchy.classList.toggle('active');
      sandboxPreview.classList.toggle('no-hierarchy', !isActive);
      const label = toggleHierarchy.querySelector('.state-label');
      if (label) label.textContent = isActive ? t('state_on') : t('state_off');
      playClickPop();
    });
  }

  if (toggleContrast && sandboxPreview) {
    toggleContrast.addEventListener('click', (e) => {
      e.stopPropagation();
      const isActive = toggleContrast.classList.toggle('active');
      sandboxPreview.classList.toggle('no-contrast', !isActive);
      const label = toggleContrast.querySelector('.state-label');
      if (label) label.textContent = isActive ? t('state_contrast_on') : t('state_contrast_off');
      playClickPop();
    });
  }

  if (toggleWhitespace && sandboxPreview) {
    toggleWhitespace.addEventListener('click', (e) => {
      e.stopPropagation();
      const isActive = toggleWhitespace.classList.toggle('active');
      sandboxPreview.classList.toggle('no-whitespace', !isActive);
      const label = toggleWhitespace.querySelector('.state-label');
      if (label) label.textContent = isActive ? t('state_space_on') : t('state_space_off');
      playClickPop();
    });
  }

  /* --------------------------------------------------------------------------
     9. SCROLL REVEAL & PROGRESS BAR (INTERSECTION OBSERVER)
     -------------------------------------------------------------------------- */
  window.addEventListener('scroll', () => {
    if (isNoUxMode) return;
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
    if (scrollProgress) {
      scrollProgress.style.width = scrolled + '%';
    }
  });

  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  if ('IntersectionObserver' in window) {
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.12
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          if (entry.target.id === 'estatisticas' && !statsAnimated) {
            animateStatsNumbers();
            statsAnimated = true;
          }
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('is-revealed'));
  }

  /* --------------------------------------------------------------------------
     10. CONTADORES ANIMADOS DE ESTATÍSTICAS
     -------------------------------------------------------------------------- */
  function animateStatsNumbers() {
    const statNumbers = document.querySelectorAll('.stat-number[data-target]');
    statNumbers.forEach(el => {
      const target = parseInt(el.getAttribute('data-target'), 10);
      const prefix = el.getAttribute('data-prefix') || '';
      const suffix = el.getAttribute('data-suffix') || '';
      const duration = 1600;
      const startTime = performance.now();

      function updateNumber(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(easeOut * target);

        el.textContent = `${prefix}${current.toLocaleString('pt-BR')}${suffix}`;

        if (progress < 1) {
          requestAnimationFrame(updateNumber);
        } else {
          el.textContent = `${prefix}${target.toLocaleString('pt-BR')}${suffix}`;
        }
      }

      requestAnimationFrame(updateNumber);
    });
  }

  /* --------------------------------------------------------------------------
     11. MICRO-INTERAÇÕES NO MODO YES UX (TILT SUAVE NOS CARDS)
     -------------------------------------------------------------------------- */
  const cards = document.querySelectorAll('.feature-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      if (isNoUxMode) return;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });

    card.addEventListener('mouseleave', () => {
      if (isNoUxMode) return;
      card.style.transform = '';
    });
  });

  // Inicializar com o idioma salvo
  applyLanguage(currentLang);
});
