// Logo click: mostra animação "Desenvolvedor de sistemas"
document.addEventListener("DOMContentLoaded", () => {
    const logo = document.getElementById("logo-main");
    const devAnimated = document.getElementById("dev-animated");
    let typing = false;
    if (logo) {
      logo.addEventListener("click", () => {
        if (typing) return;
        typing = true;
        devAnimated.innerHTML = "";
        typewriter(devAnimated, "Desenvolvedor de sistemas", 70, () => { typing = false; });
      });
    }
  });
  
  // Typewriter effect (pode ser usado em outros lugares)
  function typewriter(element, text, speed = 70, cb) {
    let i = 0;
    function type() {
      if (i <= text.length) {
        element.innerHTML = text.slice(0, i) + '<span class="type-cursor">|</span>';
        i++;
        setTimeout(type, speed);
      } else {
        element.innerHTML = text;
        if (cb) cb();
      }
    }
    type();
  }
  
  // Animação inicial na home
  document.addEventListener("DOMContentLoaded", () => {
    const devAnimated = document.getElementById("dev-animated");
    if (devAnimated) {
      typewriter(devAnimated, "Desenvolvedor Web Front-end.", 55);
    }
  });