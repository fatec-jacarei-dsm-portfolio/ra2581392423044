const username = "andreramos282";

async function carregarProjetosGithub() {
  const container = document.getElementById("github-projects-container");
  container.innerHTML = "<p style='color:#b3cfff'>Carregando projetos...</p>";
  try {
    const res = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`);
    const repos = await res.json();
    if (!Array.isArray(repos)) throw new Error();
    // filtra fork e oculta o próprio portfólio
    const filtrados = repos.filter(
      r => !r.fork && r.name !== "ra2581392423044"
    );
    if (!filtrados.length) {
      container.innerHTML = "<p>Nenhum projeto público encontrado!</p>";
      return;
    }
    // Limpa antes para animação funcionar ao trocar
    container.innerHTML = "";
    setTimeout(() => {
      container.innerHTML = filtrados.map((repo, idx) => `
        <div class="github-projeto-card" style="animation-delay:${0.15*idx}s;">
          <h4>${repo.name}</h4>
          <p>${repo.description ? repo.description : "Sem descrição."}</p>
          <a href="${repo.html_url}" target="_blank">Ver no GitHub</a>
        </div>
      `).join('');
    }, 200);
  } catch {
    container.innerHTML = "<p>Erro ao buscar projetos.</p>";
  }
}
// Função para buscar porcentagem de linguagens de um repositório
async function buscarLinguagens(repoFullName) {
  const resp = await fetch(`https://api.github.com/repos/${repoFullName}/languages`);
  if (!resp.ok) return {};
  return await resp.json();
}

// Função para abrir o modal com detalhes do projeto
async function abrirDetalhesProjeto(projeto) {
  // Crie o modal se não existir
  let modal = document.getElementById('modal-projeto');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'modal-projeto';
    modal.innerHTML = `
      <div class="modal-bg"></div>
      <div class="modal-card">
        <button id="fechar-modal-projeto" title="Fechar">×</button>
        <div class="modal-content"></div>
      </div>
    `;
    document.body.appendChild(modal);
    modal.querySelector('.modal-bg').onclick =
    modal.querySelector('#fechar-modal-projeto').onclick = () => { modal.style.display = 'none'; };
  }
  modal.style.display = 'flex';

  // Carregar linguagens
  const linguagens = await buscarLinguagens(projeto.full_name);
  const total = Object.values(linguagens).reduce((a, b) => a + b, 0) || 1;
  const langHTML = Object.entries(linguagens).map(([lang, val]) => {
    const percent = ((val / total) * 100).toFixed(1);
    return `<div class="lang-bar">
      <span>${lang}</span>
      <div style="width:${percent}%"></div>
      <span class="lang-percent">${percent}%</span>
    </div>`;
  }).join('') || '<div style="color:#f44">Não encontrado</div>';

  // Imagem do projeto (avatar do dono como default)
  let imgUrl = projeto.owner?.avatar_url || "oimg/project-thumb.png";

  modal.querySelector('.modal-content').innerHTML = `
    <h2>${projeto.name}</h2>
    <img src="${imgUrl}" class="modal-projeto-img" alt="Imagem do projeto"/>
    <div class="modal-desc">${projeto.description ? projeto.description : 'Sem descrição.'}</div>
    <div class="modal-langs">
      <strong>Linguagens:</strong>
      <div class="langs-bars">${langHTML}</div>
    </div>
    <a href="${projeto.html_url}" target="_blank" class="btn-blue" style="margin-top:1.3em">Ver no GitHub</a>
  `;
}

// Função para renderizar os cards de projetos
function renderizarProjetos(listaProjetos) {
  const container = document.getElementById('github-projects-container');
  container.innerHTML = '';
  listaProjetos.forEach(projeto => {
    const card = document.createElement('div');
    card.className = 'github-projeto-card';
    card.innerHTML = `
      <h4>${projeto.name}</h4>
      <p>${projeto.description ? projeto.description : ''}</p>
      <button class="btn-blue-outline btn-ver-mais">Ver mais</button>
    `;
    // Ao clicar em "Ver mais", abre o modal
    card.querySelector('.btn-ver-mais').onclick = (e) => {
      e.preventDefault();
      abrirDetalhesProjeto(projeto);
    };
    container.appendChild(card);
  });
}

// Exemplo de uso (após buscar os projetos do GitHub):
// renderizarProjetos(suaListaDeProjetos);