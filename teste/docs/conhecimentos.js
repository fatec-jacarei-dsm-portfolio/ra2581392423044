// Suave transição ao mostrar/esconder projetos
const projetoAtualSection = document.getElementById('projeto-atual');
const projetosListaSection = document.getElementById('projetos-lista');
const btnVerMais = document.getElementById("ver-mais-projetos");
const btnVoltar = document.getElementById("voltar-home");

btnVerMais.addEventListener('click', () => {
  projetosListaSection.style.display = "block";
  setTimeout(() => {
    projetosListaSection.classList.add("active");
    projetoAtualSection.style.opacity = 0;
    projetoAtualSection.style.transform = "translateY(-30px)";
  }, 10);
  setTimeout(() => {
    projetoAtualSection.style.display = "none";
    carregarProjetosGithub();
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
document.addEventListener("DOMContentLoaded", () => {
  i = 0;
  typeTarget.textContent = "";
  typeWriter();
});