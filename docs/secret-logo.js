document.addEventListener('DOMContentLoaded', function() {
  // Só pega a logo do header (navbar)
  const logo = document.querySelector('.navbar .logo');
  if (!logo) return;
  let clickCount = 0;
  let timer = null;
  logo.addEventListener('click', function(e) {
    clickCount++;
    if (clickCount === 3) {
      window.location.href = "secret.html";
      clickCount = 0; // previne múltiplos redirects
      return;
    }
    clearTimeout(timer);
    timer = setTimeout(() => { clickCount = 0; }, 1200); // 1.2 segundos para resetar
  });
});