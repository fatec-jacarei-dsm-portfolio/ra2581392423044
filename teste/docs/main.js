document.addEventListener("DOMContentLoaded", function () {
  // Suave transição ao mostrar/esconder projetos, mantendo conhecimentos visível
  const projetoAtualSection = document.getElementById('projeto-atual');
  const projetosListaSection = document.getElementById('projetos-lista');
  const btnVerMais = document.getElementById("ver-mais-projetos");
  const btnVoltar = document.getElementById("voltar-home");

  if (btnVerMais && btnVoltar && projetoAtualSection && projetosListaSection) {
    btnVerMais.addEventListener('click', () => {
      projetosListaSection.style.display = "block";
      setTimeout(() => {
        projetosListaSection.classList.add("active");
        projetoAtualSection.style.opacity = 0;
        projetoAtualSection.style.transform = "translateY(-30px)";
      }, 10);
      setTimeout(() => {
        projetoAtualSection.style.display = "none";
        if (typeof carregarProjetosGithub === "function") carregarProjetosGithub();
        window.scrollTo({top: projetosListaSection.offsetTop - 30, behavior: 'smooth'});
      }, 400);
    });

    btnVoltar.addEventListener('click', () => {
      projetoAtualSection.style.display = "block";
      setTimeout(() => {
        projetoAtualSection.style.opacity = 1;
        projetoAtualSection.style.transform = "translateY(0)";
        projetosListaSection.classList.remove("active");
      }, 10);
      setTimeout(() => {
        projetosListaSection.style.display = "none";
        window.scrollTo({top: projetoAtualSection.offsetTop - 30, behavior: 'smooth'});
      }, 400);
    });
  }

  // Typewriter effect for "Desenvolvedor Web Front-end"
  const text = "Desenvolvedor Web Front-end.";
  const typeTarget = document.getElementById("typewriter-text");
  let i = 0, typing;
  function typeWriter() {
    if (!typeTarget) return;
    if (i <= text.length) {
      typeTarget.textContent = text.slice(0, i);
      i++;
      typing = setTimeout(typeWriter, 70);
    }
  }
  if(typeTarget){
    i = 0;
    typeTarget.textContent = "";
    typeWriter();
  }

  // Header sticky e translúcido ao rolar
  window.addEventListener('scroll', function() {
    const header = document.getElementById('main-header');
    if (header) {
      if (window.scrollY > 10) {
        header.classList.remove('solid');
        header.classList.add('translucent');
      } else {
        header.classList.remove('translucent');
        header.classList.add('solid');
      }
    }
  });

  // Easter egg logo
  let logoClickCount = 0;
  let logoClickTimeout = null;
  const logoMain = document.getElementById('logo-main');
  if (logoMain) {
    logoMain.addEventListener('click', function () {
      logoClickCount++;
      if (logoClickTimeout) clearTimeout(logoClickTimeout);
      if (logoClickCount === 3) {
        window.location.href = "secret.html";
      } else {
        logoClickTimeout = setTimeout(() => { logoClickCount = 0; }, 1200);
      }
    });
  }

  // Hamburguer menu como modal popup
  const menuToggle = document.getElementById('menu-toggle');
  const menuModal = document.getElementById('menu-modal');
  const links = document.querySelectorAll('.nav-links-modal a');

  function openMenu() {
    if(menuModal && menuToggle){
      menuModal.classList.add('open');
      document.body.classList.add('menu-modal-open');
      menuToggle.setAttribute('aria-expanded', 'true');
      menuToggle.classList.add('open');
    }
  }
  function closeMenuModal() {
    if(menuModal && menuToggle){
      menuModal.classList.remove('open');
      document.body.classList.remove('menu-modal-open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.classList.remove('open');
    }
  }

  if (menuToggle && menuModal) {
    menuToggle.addEventListener('click', function(){
      if(menuModal.classList.contains('open')) {
        closeMenuModal();
      } else {
        openMenu();
      }
    });
  }

  if (menuModal) {
    menuModal.addEventListener('click', function(e) {
      if (e.target === menuModal) closeMenuModal();
    });
  }
  links.forEach(link => {
    link.addEventListener('click', closeMenuModal);
  });
});