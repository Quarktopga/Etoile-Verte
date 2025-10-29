export function startSnow(canvas) {
  const ctx = canvas.getContext("2d");
  const flakes = [];
  let w, h;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  for (let i = 0; i < 80; i++) {
    flakes.push({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.8 + 0.8,
      s: Math.random() * 0.6 + 0.2
    });
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "rgba(255,255,255,0.85)";
    flakes.forEach(f => {
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
      ctx.fill();
      f.y += f.s;
      f.x += Math.sin(f.y * 0.01) * 0.3;
      if (f.y > h + 5) {
        f.y = -5;
        f.x = Math.random() * w;
      }
    });
    requestAnimationFrame(draw);
  }
  draw();
}
