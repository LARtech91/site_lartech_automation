// === CARROSSEL PRINCIPAL ===
document.addEventListener('DOMContentLoaded', function() {
  const slides = document.querySelectorAll('.carousel-slide');
  const indicators = document.querySelectorAll('.indicator');
  let currentSlide = 0;
  const slideInterval = 5000;
  let slideTimer;

  if (slides.length === 0) {
    console.warn('Nenhum slide encontrado no carrossel');
    return;
  }

  console.log(`Carrossel inicializado com ${slides.length} slides`);

  // Configurar estilos de transição
  slides.forEach(slide => {
    slide.style.transition = 'opacity 600ms ease-out, visibility 600ms ease-out';
  });

  function showSlide(index) {
    if (index >= slides.length) index = 0;
    if (index < 0) index = slides.length - 1;

    // Remover classe active de todos os slides
    slides.forEach(slide => slide.classList.remove('active'));
    indicators.forEach(indicator => indicator.classList.remove('active'));

    // Adicionar classe active ao slide atual
    slides[index].classList.add('active');
    if (indicators[index]) {
      indicators[index].classList.add('active');
    }

    currentSlide = index;
  }

  function nextSlide() {
    showSlide(currentSlide + 1);
  }

  function prevSlide() {
    showSlide(currentSlide - 1);
  }

  // Event listeners para indicadores
  indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
      showSlide(index);
      resetInterval();
    });
  });

  function resetInterval() {
    if (slideTimer) clearInterval(slideTimer);
    slideTimer = setInterval(nextSlide, slideInterval);
  }

  // Controles do carrossel
  const carousel = document.querySelector('.hero-carousel');
  if (carousel) {
    // Pausar no hover
    carousel.addEventListener('mouseenter', () => {
      if (slideTimer) clearInterval(slideTimer);
    });

    carousel.addEventListener('mouseleave', () => {
      resetInterval();
    });

    // Suporte a toque
    let touchStartX = 0;
    let touchEndX = 0;

    carousel.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      if (slideTimer) clearInterval(slideTimer);
    }, { passive: true });

    carousel.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const swipeThreshold = 50;

      if (touchEndX < touchStartX - swipeThreshold) {
        nextSlide();
      } else if (touchEndX > touchStartX + swipeThreshold) {
        prevSlide();
      }
      resetInterval();
    }, { passive: true });

    // Navegação por teclado
    carousel.setAttribute('tabindex', '0');
    carousel.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevSlide();
        resetInterval();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        nextSlide();
        resetInterval();
      }
    });
  }

  // Iniciar carrossel
  showSlide(0);
  slideTimer = setInterval(nextSlide, slideInterval);
});

// === CARROSSEL "COMO FUNCIONA" ===
document.addEventListener('DOMContentLoaded', function() {
  const processSlides = document.querySelectorAll('.process-slide');
  const processIndicators = document.querySelectorAll('.process-indicator');
  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');
  let currentProcessSlide = 0;

  if (processSlides.length === 0) return;

  console.log(`Carrossel "Como Funciona" inicializado com ${processSlides.length} slides`);

  function showProcessSlide(index) {
    if (index >= processSlides.length) index = 0;
    if (index < 0) index = processSlides.length - 1;

    processSlides.forEach(slide => slide.classList.remove('active'));
    processIndicators.forEach(indicator => indicator.classList.remove('active'));

    processSlides[index].classList.add('active');
    if (processIndicators[index]) {
      processIndicators[index].classList.add('active');
    }

    currentProcessSlide = index;
    updateNavigationButtons();
  }

  function updateNavigationButtons() {
    if (prevBtn) prevBtn.disabled = currentProcessSlide === 0;
    if (nextBtn) nextBtn.disabled = currentProcessSlide === processSlides.length - 1;
  }

  function nextProcessSlide() {
    if (currentProcessSlide < processSlides.length - 1) {
      showProcessSlide(currentProcessSlide + 1);
    }
  }

  function prevProcessSlide() {
    if (currentProcessSlide > 0) {
      showProcessSlide(currentProcessSlide - 1);
    }
  }

  // Event listeners
  if (nextBtn) nextBtn.addEventListener('click', nextProcessSlide);
  if (prevBtn) prevBtn.addEventListener('click', prevProcessSlide);

  processIndicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => showProcessSlide(index));
  });

  // Suporte a toque
  const processCarousel = document.querySelector('.process-carousel');
  if (processCarousel) {
    let touchStartX = 0;
    let touchEndX = 0;

    processCarousel.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    processCarousel.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const swipeThreshold = 50;

      if (touchEndX < touchStartX - swipeThreshold) {
        nextProcessSlide();
      } else if (touchEndX > touchStartX + swipeThreshold) {
        prevProcessSlide();
      }
    }, { passive: true });
  }

  showProcessSlide(0);
});

// === MENU MOBILE ROBUSTO ===
document.addEventListener('DOMContentLoaded', function() {
  const menuButton = document.querySelector('.mobile-menu-button');
  const nav = document.querySelector('nav');
  const body = document.body;

  console.log('Inicializando menu mobile...');
  console.log('Menu button encontrado:', !!menuButton);
  console.log('Nav encontrado:', !!nav);
  console.log('Largura da tela:', window.innerWidth);

  if (!menuButton || !nav) {
    console.error('Menu mobile: elementos não encontrados');
    return;
  }

  // Função robusta para garantir visibilidade do botão
  function ensureButtonVisibility() {
    if (window.innerWidth <= 992) {
      menuButton.style.cssText = `
        display: flex !important;
        visibility: visible !important;
        opacity: 1 !important;
        position: relative !important;
        z-index: 1003 !important;
        background: #ffffff !important;
        border: 3px solid #00A6FB !important;
        border-radius: 12px !important;
        width: 50px !important;
        height: 46px !important;
        padding: 10px !important;
        margin-left: auto !important;
        flex-direction: column !important;
        justify-content: space-evenly !important;
        align-items: center !important;
        cursor: pointer !important;
        box-shadow: 0 4px 15px rgba(0, 166, 251, 0.3) !important;
      `;
      
      // Garantir que as linhas do hambúrguer sejam visíveis
      const lines = menuButton.querySelectorAll('.hamburger-line');
      lines.forEach(line => {
        line.style.cssText = `
          width: 26px !important;
          height: 3px !important;
          background-color: #00A6FB !important;
          border-radius: 2px !important;
          display: block !important;
          transition: all 0.3s ease !important;
        `;
      });
      
      console.log('Botão mobile forçado a ser visível com estilos robustos');
    }
  }

  // Aplicar na inicialização e no resize
  ensureButtonVisibility();
  window.addEventListener('resize', ensureButtonVisibility);

  // Forçar re-aplicação dos estilos após um pequeno delay
  setTimeout(ensureButtonVisibility, 100);
  setTimeout(ensureButtonVisibility, 500);

  console.log('Menu mobile inicializado com sucesso');

  // Toggle do menu com melhor controle
  menuButton.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();

    const isActive = menuButton.classList.contains('active');
    
    if (isActive) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  function openMenu() {
    menuButton.classList.add('active');
    nav.classList.add('active');
    body.style.overflow = 'hidden';
    body.style.position = 'fixed';
    body.style.width = '100%';
    console.log('Menu aberto');
  }

  function closeMenu() {
    menuButton.classList.remove('active');
    nav.classList.remove('active');
    body.style.overflow = '';
    body.style.position = '';
    body.style.width = '';
    console.log('Menu fechado');
  }

  // Fechar menu ao clicar fora
  document.addEventListener('click', function(e) {
    if (nav.classList.contains('active') && 
        !nav.contains(e.target) && 
        !menuButton.contains(e.target)) {
      closeMenu();
    }
  });

  // Fechar menu ao clicar em link
  const menuLinks = document.querySelectorAll('.menu a');
  menuLinks.forEach(link => {
    link.addEventListener('click', function() {
      closeMenu();
    });
  });

  // Fechar menu ao redimensionar para desktop
  window.addEventListener('resize', function() {
    if (window.innerWidth > 992) {
      closeMenu();
    } else {
      ensureButtonVisibility(); // Re-aplicar estilos em mobile
    }
  });

  // Fechar menu com tecla ESC
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && nav.classList.contains('active')) {
      closeMenu();
    }
  });
});

// === NAVBAR SCROLL EFFECTS ===
document.addEventListener('DOMContentLoaded', function() {
  const header = document.querySelector('header');
  let lastScrollTop = 0;
  let ticking = false;

  function updateHeader() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // Remover todas as classes primeiro
    header.classList.remove('scrolled', 'at-top');

    if (scrollTop <= 10) {
      // Topo da página
      header.classList.add('at-top');
    } else if (scrollTop > 50) {
      // Scrolled down
      header.classList.add('scrolled');
    }

    lastScrollTop = scrollTop;
    ticking = false;
  }

  function requestTick() {
    if (!ticking) {
      requestAnimationFrame(updateHeader);
      ticking = true;
    }
  }

  // Throttled scroll listener para performance
  window.addEventListener('scroll', requestTick, { passive: true });

  // Configuração inicial
  updateHeader();
});

// === SMOOTH SCROLL ===
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const headerHeight = document.querySelector('header')?.offsetHeight || 0;
        const targetPosition = target.offsetTop - headerHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
});

// === WHATSAPP BUTTON ===
document.addEventListener('DOMContentLoaded', function() {
  const whatsappButton = document.querySelector('.whatsapp-float');
  if (whatsappButton) {
    console.log('Botão WhatsApp configurado');

    // Garantir estilos
    whatsappButton.style.cssText = `
      position: fixed !important;
      bottom: 24px !important;
      right: 24px !important;
      z-index: 99999 !important;
      background: #25D366 !important;
      border-radius: 50% !important;
      display: flex !important;
      opacity: 1 !important;
      visibility: visible !important;
    `;
  }
});

// === ANIMAÇÕES DE SCROLL ===
document.addEventListener('DOMContentLoaded', function() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  // Aplicar animações aos cards de serviço
  const serviceCards = document.querySelectorAll('.service-card');
  serviceCards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = `all 0.6s ease ${index * 0.1}s`;
    observer.observe(card);
  });
});

console.log('Script principal carregado com sucesso');