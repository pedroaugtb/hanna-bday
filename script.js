// Typewriter (leve, só pra dar charme)
(function typewriter(){
  const el = document.getElementById("typewriter");
  if (!el) return;
  const full = el.textContent.trim();
  el.textContent = "";
  let i = 0;
  const speed = 18;
  const tick = () => {
    el.textContent = full.slice(0, i++);
    if (i <= full.length) requestAnimationFrame(() => setTimeout(tick, speed));
  };
  tick();
})();

// Lightbox da galeria
(function lightbox(){
  const lb = document.getElementById("lightbox");
  const lbImg = document.getElementById("lightboxImg");
  const close = document.getElementById("lightboxClose");
  const gallery = document.getElementById("gallery");
  if (!lb || !lbImg || !close || !gallery) return;

  const open = (src) => {
    lbImg.src = src;
    lb.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  };
  const shut = () => {
    lb.classList.add("hidden");
    lbImg.src = "";
    document.body.style.overflow = "";
  };

  gallery.addEventListener("click", (e) => {
    const btn = e.target.closest(".tile");
    if (!btn) return;
    open(btn.dataset.full);
  });

  close.addEventListener("click", shut);
  lb.addEventListener("click", (e) => { if (e.target === lb) shut(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") shut(); });
})();

// Revelar surpresa
(function reveal(){
  const btn = document.getElementById("reveal");
  const box = document.getElementById("reveal-box");
  if (!btn || !box) return;
  btn.addEventListener("click", () => {
    box.classList.remove("hidden");
    btn.disabled = true;
    btn.textContent = "💗 Surpresa aberta";
  });
})();

// Confetti simples em canvas
(function confetti(){
  const canvas = document.getElementById("confetti");
  const btn = document.getElementById("btn-confetti");
  if (!canvas || !btn) return;

  const ctx = canvas.getContext("2d");
  let W = 0, H = 0;
  const resize = () => {
    W = canvas.width = window.innerWidth * devicePixelRatio;
    H = canvas.height = window.innerHeight * devicePixelRatio;
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  };
  window.addEventListener("resize", resize);
  resize();

  const colors = ["#ff7ac8", "#a78bfa", "#ffd166", "#06d6a0", "#7dd3fc", "#ffffff"];
  let particles = [];
  let running = false;
  let tEnd = 0;

  const spawn = (n=180) => {
    const cx = window.innerWidth / 2;
    const cy = 0;
    for (let i=0; i<n; i++){
      particles.push({
        x: cx + (Math.random()*120 - 60),
        y: cy + (Math.random()*40),
        vx: (Math.random()*2 - 1) * 4,
        vy: (Math.random()*-1.5 - 0.2) * 8,
        g: 0.18 + Math.random()*0.10,
        r: 2 + Math.random()*3,
        w: 6 + Math.random()*6,
        h: 6 + Math.random()*10,
        rot: Math.random()*Math.PI,
        vr: (Math.random()*2 - 1) * 0.2,
        c: colors[Math.floor(Math.random()*colors.length)],
        life: 120 + Math.random()*80
      });
    }
  };

  const step = () => {
    if (!running) return;
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    particles = particles.filter(p => p.life > 0);
    for (const p of particles){
      p.vy += p.g;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      p.life -= 1;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.c;
      ctx.globalAlpha = Math.max(0, Math.min(1, p.life/120));
      ctx.fillRect(-p.w/2, -p.h/2, p.w, p.h);
      ctx.restore();
    }

    if (performance.now() > tEnd && particles.length === 0) {
      running = false;
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      return;
    }
    requestAnimationFrame(step);
  };

  btn.addEventListener("click", () => {
    spawn(220);
    running = true;
    tEnd = performance.now() + 2200;
    requestAnimationFrame(step);
  });
})();
