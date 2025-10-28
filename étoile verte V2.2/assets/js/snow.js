// Effet neige discret sur la page d'accueil
if (document.body.classList.contains('page-accueil')) {
  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.pointerEvents = 'none';
  canvas.style.inset = '0';
  canvas.style.zIndex = '500';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let w, h, flakes;

  function resize(){
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    flakes = Array.from({length: Math.max(60, Math.floor(w/20))}, () => ({
      x: Math.random()*w,
      y: Math.random()*h,
      r: Math.random()*1.6 + 0.4,
      s: Math.random()*0.5 + 0.4,
      a: Math.random()*Math.PI*2
    }));
  }

  function draw(){
    ctx.clearRect(0,0,w,h);
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    flakes.forEach(f => {
      f.y += f.s; f.x += Math.cos(f.a)*0.2; f.a += 0.01;
      if (f.y > h) { f.y = -5; f.x = Math.random()*w; }
      ctx.beginPath(); ctx.arc(f.x, f.y, f.r, 0, Math.PI*2); ctx.fill();
    });
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize(); draw();
}
