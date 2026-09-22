/**
 * ==========================================================================
 * CONTROLE DA APRESENTAÇÃO E GERENCIAMENTO DE MÍDIAS / FOTOS
 * ==========================================================================
 * 
 * GUIA RÁPIDO PARA O USUÁRIO:
 * 1. Para alterar a foto do PROFESSOR ou ALUNOS, você pode:
 *    a) Substituir a imagem no arquivo index.html na tag <img> respectiva, OU
 *    b) Colocar a foto desejada dentro da pasta 'assets/' com os seguintes nomes padrão:
 *       - assets/professor.jpg
 *       - assets/aluno_melissa.jpg
 *       - assets/aluno_kelly.jpg
 *       - assets/aluno_vitoria.jpg
 *       - assets/aluno_cristiano.jpg
 *       - assets/aluno_rafaela.jpg
 * 
 * 2. Se a imagem não for encontrada, o sistema exibirá automaticamente um 
 *    placeholder elegante com o nome da pessoa!
 * ==========================================================================
 */

(function () {
  'use strict';

  // Seleção dos elementos principais da DOM
  const track = document.getElementById('track');
  const slides = Array.from(track.children);
  const totalSlides = slides.length;
  const dotsWrap = document.getElementById('dots');
  const counter = document.getElementById('counter');
  const progressBar = document.getElementById('progressBar');
  const prevBtn = document.getElementById('prev');
  const nextBtn = document.getElementById('next');
  const fullscreenBtn = document.getElementById('fullscreenBtn');

  let currentIndex = 0;

  // Renderizar indicadores de navegação (Dots)
  slides.forEach((slide, idx) => {
    const dot = document.createElement('button');
    dot.className = 'dot';
    dot.setAttribute('aria-label', `Ir para o slide ${idx + 1}`);
    dot.addEventListener('click', () => goToSlide(idx));
    dotsWrap.appendChild(dot);
  });

  const dots = Array.from(dotsWrap.children);

  // Formatação de números com zero à esquerda (ex: 01, 02...)
  function padZero(num) {
    return num < 10 ? `0${num}` : `${num}`;
  }

  // Atualizar visualização do Slide Ativo
  function renderSlide() {
    // Aplicar transformação de slide horizontal
    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    // Atualizar classe ativa nos indicadores
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentIndex);
    });

    // Atualizar contador e barra de progresso
    counter.textContent = `${padZero(currentIndex + 1)} / ${padZero(totalSlides)}`;
    const progressPercent = ((currentIndex + 1) / totalSlides) * 100;
    if (progressBar) {
      progressBar.style.width = `${progressPercent}%`;
    }

    // Estado dos botões de navegação
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex === totalSlides - 1;

    // Atualizar classes de estado nos slides
    slides.forEach((slide, idx) => {
      const isActive = idx === currentIndex;
      slide.classList.toggle('is-active', isActive);
      slide.setAttribute('aria-hidden', !isActive);
    });

    // Atualizar classe do body se o slide atual for claro ou escuro
    const currentSlide = slides[currentIndex];
    if (currentSlide.classList.contains('light')) {
      document.body.classList.add('light-slide-active');
    } else {
      document.body.classList.remove('light-slide-active');
    }
  }

  // Função de Navegação para Slide Específico
  function goToSlide(index) {
    currentIndex = Math.max(0, Math.min(totalSlides - 1, index));
    renderSlide();
  }

  // Event Listeners dos Botões Anterior / Próximo
  prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
  nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));

  // Navegação por Teclado (Seta Direita, Seta Esquerda, Espaço, Home, End)
  window.addEventListener('keydown', (e) => {
    // Evitar navegação se o foco estiver em elementos editáveis
    if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

    switch (e.key) {
      case 'ArrowRight':
      case ' ':
        e.preventDefault();
        goToSlide(currentIndex + 1);
        break;
      case 'ArrowLeft':
        e.preventDefault();
        goToSlide(currentIndex - 1);
        break;
      case 'Home':
        e.preventDefault();
        goToSlide(0);
        break;
      case 'End':
        e.preventDefault();
        goToSlide(totalSlides - 1);
        break;
    }
  });

  // Suporte a gestos Touch (Swipe no Mobile)
  let touchStartX = null;
  let touchStartY = null;

  track.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    if (touchStartX === null || touchStartY === null) return;

    const diffX = e.changedTouches[0].clientX - touchStartX;
    const diffY = e.changedTouches[0].clientY - touchStartY;

    // Verificar se o gesto foi predominantemente horizontal
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 40) {
      if (diffX < 0) {
        goToSlide(currentIndex + 1);
      } else {
        goToSlide(currentIndex - 1);
      }
    }

    touchStartX = null;
    touchStartY = null;
  }, { passive: true });

  // Botão de Modos Fullscreen (Tela Cheia)
  if (fullscreenBtn) {
    fullscreenBtn.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch((err) => {
          console.warn(`Erro ao ativar tela cheia: ${err.message}`);
        });
      } else {
        document.exitFullscreen();
      }
    });
  }

  // Inicializar primeira renderização
  renderSlide();

})();

/**
 * Função Global de Fallback para tratar falta de imagens do usuário de forma graciosa
 * Chamada diretamente no evento onerror="handlePhotoFallback(this, 'Nome', 'Cargo')"
 */
function handlePhotoFallback(imgElement, name, role) {
  const container = imgElement.parentElement;
  if (!container) return;

  // Esconder a imagem quebrada
  imgElement.style.display = 'none';

  // Verificar se já existe um fallback criado
  if (container.querySelector('.photo-fallback')) return;

  // Criar div de fallback estilizada
  const fallbackDiv = document.createElement('div');
  fallbackDiv.className = 'photo-fallback';
  fallbackDiv.setAttribute('title', `Adicione a foto de ${name} em: ${imgElement.getAttribute('src')}`);

  fallbackDiv.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
    <span>FOTO</span>
  `;

  container.appendChild(fallbackDiv);
}
