const username = "andreramos282";
const projetosPorPagina = 5;
let paginaAtual = 1;
let repositorios = [];

async function buscarRepositorios() {
  const response = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`);
  repositorios = await response.json();
  mostrarProjetos();
  criarPaginacao();
}

function mostrarProjetos() {
  const start = (paginaAtual - 1) * projetosPorPagina;
  const end = start + projetosPorPagina;
  const projetosPagina = repositorios.slice(start, end);
  const container = document.getElementById("projects-container");

  if (!projetosPagina.length) {
    container.innerHTML = "<p>Nenhum projeto encontrado.</p>";
    return;
  }

  container.innerHTML = '<div class="project-listing">' +
    projetosPagina.map((proj, idx) =>
      `<div class="project-item">
        <img src="assets/github.png" alt="Projeto ${proj.name}">
        <div class="project-item-details">
          <h3>${proj.name}</h3>
          <p>${proj.description ? proj.description : "Sem descrição."}</p>
          <button class="btn-secondary" data-repo="${proj.full_name}" data-index="${start+idx}">Ver projeto</button>
        </div>
      </div>`
    ).join('') +
    '</div>';

  // Add listeners for "Ver projeto"
  document.querySelectorAll('.btn-secondary[data-repo]').forEach(btn => {
    btn.onclick = (e) => {
      e.preventDefault();
      mostrarDetalhesProjeto(btn.getAttribute('data-repo'), parseInt(btn.getAttribute('data-index')));
    };
  });
}

function criarPaginacao() {
  const totalPaginas = Math.ceil(repositorios.length / projetosPorPagina);
  const paginacao = document.getElementById("pagination");
  paginacao.innerHTML = "";
  for(let i = 1; i <= totalPaginas; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.className = (i === paginaAtual) ? "active" : "";
    btn.onclick = () => {
      paginaAtual = i;
      mostrarProjetos();
      criarPaginacao();
    };
    paginacao.appendChild(btn);
  }
}

async function mostrarDetalhesProjeto(full_name, idx) {
  // Oculta lista, mostra detalhes
  document.getElementById('projects-section').style.display = 'none';
  document.getElementById('project-details').style.display = 'block';

  const projeto = repositorios[idx];
  // Pega linguagens
  const langsUrl = `https://api.github.com/repos/${full_name}/languages`;
  const langsRes = await fetch(langsUrl);
  const langs = await langsRes.json();
  const totalBytes = Object.values(langs).reduce((a, b) => a + b, 0);
  // Gera cor para cada linguagem (use paleta do GitHub ou só verde)
  function corLang(lang) {
    return lang === "HTML" ? "#e34c26"
      : lang === "JavaScript" ? "#f1e05a"
      : lang === "TypeScript" ? "#3178c6"
      : lang === "CSS" ? "#563d7c"
      : "#55ea19";
  }

  // Usa readme.md como imagem do projeto se houver badge ou imagem, senão placeholder
  let img = "assets/github.png";
  try {
    const readmeUrl = `https://raw.githubusercontent.com/${full_name}/main/README.md`;
    let readme = await fetch(readmeUrl).then(r => r.ok ? r.text() : "");
    let m = readme.match(/!\[.*?\]\((.*?)\)/i);
    if (m && m[1]) img = m[1];
  } catch { /* mantém placeholder */ }

  document.getElementById("project-data").innerHTML = `
    <img src="${img}" alt="Imagem do projeto" onerror="this.src='assets/github.png'">
    <h2>${projeto.name}</h2>
    <p>${projeto.description ? projeto.description : "Sem descrição."}</p>
    <a href="${projeto.html_url}" target="_blank" style="color:var(--primary-green);font-weight:bold;">Ver no GitHub</a>
    <div class="langs">
      <h3 style="color:var(--primary-green);margin-top:2rem;">Linguagens usadas</h3>
      ${Object.entries(langs).map(([lang, bytes]) => `
        <div class="lang-bar">
          <span class="lang-name">${lang}</span>
          <div class="bar" style="width:${((bytes/totalBytes)*100).toFixed(1)}%;background:${corLang(lang)}"></div>
          <span>${((bytes/totalBytes)*100).toFixed(1)}%</span>
        </div>
      `).join('')}
    </div>
  `;
}

document.addEventListener("DOMContentLoaded", () => {
  buscarRepositorios();

  document.getElementById("voltar-projetos").onclick = () => {
    document.getElementById('projects-section').style.display = 'block';
    document.getElementById('project-details').style.display = 'none';
  };
});