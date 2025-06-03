const conhecimentos = [
    {
      nome: "HTML5",
      descricao: "HTML5 é uma linguagem de marcação de hipertexto, que usamos para marcar os elementos da página e construí-la.",
      imagem: "oimg/html5.png"
    },
    {
      nome: "CSS3",
      descricao: "CSS3 é uma linguagem de estilo usada para descrever a apresentação dos elementos da página os estilizando.",
      imagem: "oimg/css3.png"
    },
    {
      nome: "JavaScript",
      descricao: "JavaScript é uma linguagem de programação interpretada usada no desenvolvimento web para descrever funcionalidades e comportamentos da página.",
      imagem: "oimg/js.png"
    },
    {
      nome: "TypeScript",
      descricao: "TypeScript é um superset do JavaScript que adiciona tipagem estática ao desenvolvimento, tornando o código mais seguro.",
      imagem: "oimg/typescript.png"
    },
    {
      nome: "TSX (React)",
      descricao: "TSX é uma sintaxe que permite misturar TypeScript com JSX, possibilitando criar componentes React tipados.",
      imagem: "oimg/react-tsx.png"
    }
  ];
  
  function renderizarConhecimentos() {
    const container = document.getElementById('skills-cards');
    if (!container) return;
    container.innerHTML =
      conhecimentos.map(conhecimento => `
        <div class="skill-card">
          <img src="${conhecimento.imagem}" alt="${conhecimento.nome}" class="skill-icon"/>
          <h2>${conhecimento.nome}</h2>
          <p>${conhecimento.descricao}</p>
        </div>
      `).join('');
  }
  
  document.addEventListener("DOMContentLoaded", renderizarConhecimentos);