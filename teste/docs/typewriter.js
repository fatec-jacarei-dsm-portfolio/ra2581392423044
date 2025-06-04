// (Opcional, se quiser reaproveitar animação em outros lugares)
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