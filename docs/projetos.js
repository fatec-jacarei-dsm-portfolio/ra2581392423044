const username = "andreramos282";
const projetosPorPagina = 5;
let paginaAtual = 1;
let repositorios = [];
let cacheReadme = {}; // Cache para não buscar o mesmo readme múltiplas vezes
let cacheImg = {};    // Cache para imagens

async function buscarRepositorios() {
  const response = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`);
  repositorios = await response.json();
  mostrarProjetos();
  criarPaginacao();
}

function extrairPrimeiraImagem(readme, full_name) {
  if (!readme) return null;
  const match = readme.match(/!\[.*?\]\((.*?)\)/i);
  if (match && match[1]) {
    let imgUrl = match[1];
    if (!/^https?:\/\//.test(imgUrl)) {
      imgUrl = `https://raw.githubusercontent.com/${full_name}/main/${imgUrl.replace(/^\.?\//, '')}`;
    }
    return imgUrl;
  }
  return null;
}

function markdownToHtml(md, full_name) {
  md = md.replace(/!\[(.*?)\]\((.*?)\)/g, (m, alt, url) => {
    let imgUrl = url;
    if (!/^https?:\/\//.test(imgUrl)) {
      imgUrl = `https://raw.githubusercontent.com/${full_name}/main/${imgUrl.replace(/^\.?\//, '')}`;
    }
    return `<img src="${imgUrl}" alt="${alt}" style="max-width:100%;margin:1em 0;">`;
  });
  md = md.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
  md = md.replace(/^###### (.*)$/gm, '<h6>$1</h6>');
  md = md.replace(/^##### (.*)$/gm, '<h5>$1</h5>');
  md = md.replace(/^#### (.*)$/gm, '<h4>$1</h4>');
  md = md.replace(/^### (.*)$/gm, '<h3>$1</h3>');
  md = md.replace(/^## (.*)$/gm, '<h2>$1</h2>');
  md = md.replace(/^# (.*)$/gm, '<h1>$1</h1>');
  md = md.replace(/^\s*[-*+] (.*)$/gm, '<li>$1</li>');
  md = md.replace(/(<li>.*<\/li>)/gms, '<ul>$1</ul>');
  md = md.replace(/^\s*\d+\. (.*)$/gm, '<li>$1</li>');
  md = md.replace(/(<ol>(?:<li>.*?<\/li>)+<\/ol>)/gms, '$1');
  md = md.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
  md = md.replace(/__(.*?)__/g, '<b>$1</b>');
  md = md.replace(/\*(.*?)\*/g, '<i>$1</i>');
  md = md.replace(/_(.*?)_/g, '<i>$1</i>');
  md = md.replace(/\n{2,}/g, '<br><br>');
  md = md.replace(/\n/g, '<br>');
  return md;
}

// Pega a primeira linha de texto relevante do README (ignora títulos e imagens)
function primeiraLinhaReadme(readme) {
  if (!readme) return "";
  const linhas = readme.split('\n');
  for (let l of linhas) {
    l = l.trim();
    if (!l || l.startsWith('#') || l.startsWith('![')) continue; // pula títulos e imagens
    return l;
  }
  return "";
}

function corLang(lang) {
  return lang === "HTML" ? "#e34c26"
    : lang === "JavaScript" ? "#f1e05a"
    : lang === "TypeScript" ? "#3178c6"
    : lang === "CSS" ? "#563d7c"
    : "#55ea19";
}

function barraPorcentagem(percent, cor) {
  return `
    <div style="background:#e4e4e4;border-radius:4px;width:100%;height:12px;overflow:hidden;display:inline-block;vertical-align:middle;">
      <div style="width:${percent}%;background:${cor};height:100%;"></div>
    </div>
    <span style="font-size:0.9em">${percent.toFixed(1)}%</span>
  `;
}

async function getReadme(full_name) {
  if (cacheReadme[full_name]) return cacheReadme[full_name];
  try {
    const res = await fetch(`https://raw.githubusercontent.com/${full_name}/main/README.md`);
    if (res.ok) {
      const text = await res.text();
      cacheReadme[full_name] = text;
      return text;
    }
  } catch {}
  cacheReadme[full_name] = "";
  return "";
}

async function getImgFromReadme(full_name) {
  if (cacheImg[full_name]) return cacheImg[full_name];
  const readme = await getReadme(full_name);
  let img = extrairPrimeiraImagem(readme, full_name);
  if (!img) img = "assets/github.png";
  cacheImg[full_name] = img;
  return img;
}

async function mostrarProjetos() {
  const start = (paginaAtual - 1) * projetosPorPagina;
  const end = start + projetosPorPagina;
  const projetosPagina = repositorios.slice(start, end);
  const container = document.getElementById("projects-container");

  // Pré-carrega readmes das páginas visíveis:
  await Promise.all(projetosPagina.map(proj => getReadme(proj.full_name)));
  await Promise.all(projetosPagina.map(proj => getImgFromReadme(proj.full_name)));

  container.innerHTML = '<div class="project-listing">' +
    await Promise.all(projetosPagina.map(async (proj, idx) => {
      const readme = await getReadme(proj.full_name);
      const img = await getImgFromReadme(proj.full_name);
      let desc = primeiraLinhaReadme(readme) || "Sem descrição.";
      return `<div class="project-item">
        <img src="${img}" alt="Imagem do projeto" style="max-height:180px;object-fit:cover;display:block;margin:auto;">
        <div class="project-item-details">
          <h3>${proj.name}</h3>
          <p>${desc}</p>
          <button class="btn-secondary" data-repo="${proj.full_name}" data-index="${start+idx}">Ver projeto</button>
        </div>
      </div>`;
    })).then(arr => arr.join('')) +
    '</div>';

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
  document.getElementById('projects-section').style.display = 'none';
  document.getElementById('project-details').style.display = 'block';

  const projeto = repositorios[idx];
  const langsUrl = `https://api.github.com/repos/${full_name}/languages`;
  const langsRes = await fetch(langsUrl);
  const langs = await langsRes.json();
  const totalBytes = Object.values(langs).reduce((a, b) => a + b, 0);

  let readme = await getReadme(full_name);
  const img = await getImgFromReadme(full_name);

  document.getElementById('project-data').innerHTML = `
    <div class="project-header">
      <img src="${img}" alt="Imagem do projeto" style="max-height:220px;object-fit:cover; display:block; margin:auto;">
      <h2>${projeto.name}</h2>
      <div class="readme-content" style="margin-top:2em; text-align:left;">
        ${readme ? markdownToHtml(readme, full_name) : "<p>README.md não encontrado.</p>"}
      </div>
      <hr>
      <div class="project-langs" style="margin-top:2em;">
        ${Object.entries(langs).map(([lang, bytes]) => {
          const percent = totalBytes ? (bytes / totalBytes) * 100 : 0;
          return `
            <div style="margin:0.5em 0;">
              <span style="color:${corLang(lang)};font-weight:bold;width:80px;display:inline-block;">${lang}</span>
              ${barraPorcentagem(percent, corLang(lang))}
            </div>
          `;
        }).join('')}
      </div>
      <a href="${projeto.html_url}" target="_blank" class="btn-primary" style="margin-top:1rem;">Ver no GitHub</a>
    </div>
  `;
  document.getElementById('voltar-projetos').onclick = () => {
    document.getElementById('projects-section').style.display = 'block';
    document.getElementById('project-details').style.display = 'none';
  };
}

window.onload = buscarRepositorios;