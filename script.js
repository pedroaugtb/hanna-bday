// Proteção por senha simples
(function () {
  const PASSWORD = "2607";

  const lockScreen = document.getElementById("lockScreen");
  const siteContent = document.getElementById("siteContent");
  const form = document.getElementById("passwordForm");
  const input = document.getElementById("passwordInput");
  const error = document.getElementById("passwordError");

  if (!lockScreen || !siteContent || !form || !input || !error) return;

  document.body.classList.add("site-locked");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const value = input.value.trim();

    if (value === PASSWORD) {
      lockScreen.style.display = "none";
      siteContent.classList.remove("site-hidden");
      document.body.classList.remove("site-locked");
    } else {
      error.textContent = "Senha incorreta 💔";
      input.value = "";
      input.focus();
    }
  });

  window.addEventListener("load", () => {
    input.focus();
  });
})();

// Ano no rodapé
(function () {
  const y = document.getElementById("year");
  if (y) y.textContent = String(new Date().getFullYear());
})();

// Menu mobile
(function () {
  const btn = document.getElementById("menuBtn");
  const nav = document.getElementById("mobileNav");
  if (!btn || !nav) return;

  btn.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    btn.setAttribute("aria-expanded", open ? "true" : "false");
  });

  nav.addEventListener("click", (e) => {
    if (e.target && e.target.tagName === "A") {
      nav.classList.remove("open");
      btn.setAttribute("aria-expanded", "false");
    }
  });
})();

// Typewriter leve
(function () {
  const el = document.getElementById("typewriter");
  if (!el) return;
  const full = el.textContent.trim();
  el.textContent = "";
  let i = 0;

  const tick = () => {
    el.textContent = full.slice(0, i++);
    if (i <= full.length) setTimeout(tick, 12);
  };
  tick();
})();

// Reveal surpresa
(function () {
  const btn = document.getElementById("revealBtn");
  const box = document.getElementById("revealBox");
  if (!btn || !box) return;

  btn.addEventListener("click", () => {
    box.classList.remove("hidden");
    btn.disabled = true;
    btn.textContent = "💗 Aberto";
  });
})();

// Confetti vinho pastel (auto ao abrir + botão)
(function () {
  const canvas = document.getElementById("confetti");
  const btn = document.getElementById("confettiBtn");
  if (!canvas) return;

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

  const colors = ["#7a2f3f", "#8f3a4c", "#f0c9d1", "#f4dde1", "#ffffff"];
  let parts = [];
  let running = false;
  let tEnd = 0;

  const spawn = (n = 240) => {
    const cx = window.innerWidth / 2;
    const cy = -10;
    for (let i = 0; i < n; i++) {
      parts.push({
        x: cx + (Math.random() * 200 - 100),
        y: cy + (Math.random() * 20),
        vx: (Math.random() * 2 - 1) * 4.3,
        vy: (Math.random() * -1.2 - 0.15) * 9.0,
        g: 0.20 + Math.random() * 0.12,
        w: 6 + Math.random() * 7,
        h: 7 + Math.random() * 10,
        rot: Math.random() * Math.PI,
        vr: (Math.random() * 2 - 1) * 0.22,
        c: colors[Math.floor(Math.random() * colors.length)],
        life: 140 + Math.random() * 95
      });
    }
  };

  const step = () => {
    if (!running) return;
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    parts = parts.filter(p => p.life > 0);
    for (const p of parts) {
      p.vy += p.g;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      p.life -= 1;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.c;
      ctx.globalAlpha = Math.max(0, Math.min(1, p.life / 160));
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    }

    if (performance.now() > tEnd && parts.length === 0) {
      running = false;
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      return;
    }
    requestAnimationFrame(step);
  };

  const blast = () => {
    spawn(260);
    running = true;
    tEnd = performance.now() + 2600;
    requestAnimationFrame(step);
  };

  if (btn) btn.addEventListener("click", blast);

  window.addEventListener("load", () => {
    setTimeout(blast, 250);
  });
})();