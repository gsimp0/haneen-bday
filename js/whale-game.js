(() => {
  const canvas = document.getElementById("game");
  const ctx = canvas.getContext("2d");

  const restartBtn = document.getElementById("restartBtn");
  const toggleBabyBtn = document.getElementById("toggleBabyBtn");

  // World
  const W = canvas.width;
  const H = canvas.height;

  const waterline = Math.floor(H * 0.62);
  const gravity = 0.55;
  const waterDrag = 0.90;
  const airDrag = 0.985;

  // Input
  const keys = new Set();
  window.addEventListener("keydown", (e) => {
    const k = e.key.toLowerCase();
    if (["arrowup","arrowdown","arrowleft","arrowright"," ","w","a","s","d","b","r"].includes(k) || e.key === " ") {
      e.preventDefault();
    }
    if (e.key === " ") keys.add("space");
    else keys.add(k);

    if (k === "b") toggleBaby();
    if (k === "r") reset();
  }, { passive: false });

  window.addEventListener("keyup", (e) => {
    const k = e.key.toLowerCase();
    if (e.key === " ") keys.delete("space");
    else keys.delete(k);
  });

  // Game state
  let score = 0;
  let best = 0;
  let showBaby = true;

  const whale = {
    x: W * 0.25,
    y: waterline + 40,
    vx: 0,
    vy: 0,
    r: 26,
    jumpReady: true,
    facing: 1, // 1 right, -1 left
  };

  const baby = {
    x: whale.x - 60,
    y: whale.y + 15,
    vx: 0,
    vy: 0,
    r: 16
  };

  const fish = [];
  const bubbles = [];

  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  function clamp(v, a, b) {
    return Math.max(a, Math.min(b, v));
  }

  function spawnFish(n = 5) {
    fish.length = 0;
    for (let i = 0; i < n; i++) {
      fish.push({
        x: rand(W * 0.35, W * 0.95),
        y: rand(waterline + 30, H - 25),
        r: 10,
        vx: rand(-1.0, -0.3),
      });
    }
  }

  function splash(x, y, count = 14) {
    for (let i = 0; i < count; i++) {
      bubbles.push({
        x,
        y,
        vx: rand(-1.6, 1.6),
        vy: rand(-2.8, -0.8),
        life: rand(20, 45),
        r: rand(2, 5),
      });
    }
  }

  function reset() {
    best = Math.max(best, score);
    score = 0;

    whale.x = W * 0.25;
    whale.y = waterline + 40;
    whale.vx = 0;
    whale.vy = 0;
    whale.jumpReady = true;
    whale.facing = 1;

    baby.x = whale.x - 60;
    baby.y = whale.y + 15;
    baby.vx = 0;
    baby.vy = 0;

    bubbles.length = 0;
    spawnFish(6);
  }

  function toggleBaby() {
    showBaby = !showBaby;
  }

  restartBtn.addEventListener("click", reset);
  toggleBabyBtn.addEventListener("click", toggleBaby);

  // Drawing helpers (simple shapes so you do not need images)
  function drawBackground() {
    // Sky
    ctx.fillStyle = "#fbfaf8";
    ctx.fillRect(0, 0, W, H);

    // Sun
    ctx.beginPath();
    ctx.fillStyle = "rgba(122, 78, 45, 0.12)";
    ctx.arc(W * 0.86, H * 0.16, 56, 0, Math.PI * 2);
    ctx.fill();

    // Water
    ctx.fillStyle = "rgba(122, 78, 45, 0.10)";
    ctx.fillRect(0, waterline, W, H - waterline);

    // Waterline shimmer
    ctx.strokeStyle = "rgba(122, 78, 45, 0.22)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, waterline);
    for (let x = 0; x <= W; x += 20) {
      ctx.lineTo(x, waterline + Math.sin((x / W) * Math.PI * 2) * 2);
    }
    ctx.stroke();
  }

  function drawWhaleBody(w) {
    // Body
    ctx.beginPath();
    ctx.fillStyle = "rgba(31,31,31,0.92)";
    ctx.ellipse(w.x, w.y, w.r * 1.35, w.r, 0, 0, Math.PI * 2);
    ctx.fill();

    // Tail
    const tx = w.x - w.facing * (w.r * 1.25);
    const ty = w.y;
    ctx.beginPath();
    ctx.fillStyle = "rgba(31,31,31,0.85)";
    ctx.moveTo(tx, ty);
    ctx.quadraticCurveTo(tx - w.facing * 18, ty - 16, tx - w.facing * 30, ty - 2);
    ctx.quadraticCurveTo(tx - w.facing * 18, ty + 16, tx, ty);
    ctx.fill();

    // Eye
    const ex = w.x + w.facing * (w.r * 0.55);
    const ey = w.y - w.r * 0.25;
    ctx.beginPath();
    ctx.fillStyle = "#fbfaf8";
    ctx.arc(ex, ey, 3.2, 0, Math.PI * 2);
    ctx.fill();

    // Little smile
    ctx.strokeStyle = "rgba(251,250,248,0.7)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(w.x + w.facing * (w.r * 0.65), w.y + w.r * 0.15, 10, Math.PI * 0.1, Math.PI * 0.55);
    ctx.stroke();

    // Water spray when above water
    if (w.y < waterline - 8 && Math.abs(w.vy) < 2.5) {
      ctx.beginPath();
      ctx.strokeStyle = "rgba(31,31,31,0.25)";
      ctx.lineWidth = 2;
      ctx.arc(w.x + w.facing * 10, w.y - w.r * 1.05, 10, Math.PI * 1.1, Math.PI * 1.9);
      ctx.stroke();
    }
  }

  function drawFish(f) {
    ctx.beginPath();
    ctx.fillStyle = "rgba(31,31,31,0.72)";
    ctx.ellipse(f.x, f.y, f.r * 1.1, f.r * 0.7, 0, 0, Math.PI * 2);
    ctx.fill();

    // Tail
    ctx.beginPath();
    ctx.fillStyle = "rgba(31,31,31,0.62)";
    ctx.moveTo(f.x - f.r * 1.1, f.y);
    ctx.lineTo(f.x - f.r * 1.6, f.y - f.r * 0.55);
    ctx.lineTo(f.x - f.r * 1.6, f.y + f.r * 0.55);
    ctx.closePath();
    ctx.fill();
  }

  function drawUI() {
    ctx.fillStyle = "rgba(31,31,31,0.85)";
    ctx.font = "16px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial";
    ctx.fillText(`Fish: ${score}`, 18, 28);
    ctx.fillText(`Best: ${Math.max(best, score)}`, 18, 50);

    ctx.fillStyle = "rgba(31,31,31,0.55)";
    ctx.fillText("Move: arrows/WASD   Jump: space   Toggle baby: B   Restart: R", 18, H - 16);
  }

  function circleHit(a, b) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    const rr = (a.r + b.r) * (a.r + b.r);
    return (dx * dx + dy * dy) <= rr;
  }

  function updatePlayer() {
    // Movement intent
    let ax = 0;
    let ay = 0;
    const up = keys.has("arrowup") || keys.has("w");
    const down = keys.has("arrowdown") || keys.has("s");
    const left = keys.has("arrowleft") || keys.has("a");
    const right = keys.has("arrowright") || keys.has("d");

    if (left) ax -= 0.45;
    if (right) ax += 0.45;
    if (up) ay -= 0.25;
    if (down) ay += 0.25;

    if (ax !== 0) whale.facing = ax > 0 ? 1 : -1;

    // Jump
    const inWater = whale.y >= waterline + 5;
    if (inWater) whale.jumpReady = true;

    if (keys.has("space") && whale.jumpReady && inWater) {
      whale.vy = -11.5;
      whale.vx += whale.facing * 1.2;
      whale.jumpReady = false;
      splash(whale.x, waterline + 2, 18);
    }

    // Physics
    whale.vx += ax;
    whale.vy += gravity + ay;

    const drag = whale.y < waterline ? airDrag : waterDrag;
    whale.vx *= drag;
    whale.vy *= drag;

    whale.x += whale.vx;
    whale.y += whale.vy;

    // Bounds
    whale.x = clamp(whale.x, whale.r * 1.8, W - whale.r * 1.8);
    whale.y = clamp(whale.y, whale.r * 1.2, H - whale.r * 1.2);

    // Splash when re-entering water
    if (whale.y >= waterline + 3 && whale.vy > 2.5 && Math.random() < 0.25) {
      splash(whale.x, waterline + 2, 8);
    }
  }

  function updateBaby() {
    if (!showBaby) return;

    // Follows whale with springy lag
    const targetX = whale.x - whale.facing * 70;
    const targetY = whale.y + 18;

    const dx = targetX - baby.x;
    const dy = targetY - baby.y;

    baby.vx += dx * 0.01;
    baby.vy += dy * 0.01;

    // Slight buoyancy
    baby.vy += gravity * 0.45;

    const drag = baby.y < waterline ? airDrag : waterDrag;
    baby.vx *= drag;
    baby.vy *= drag;

    baby.x += baby.vx;
    baby.y += baby.vy;

    baby.x = clamp(baby.x, baby.r * 1.8, W - baby.r * 1.8);
    baby.y = clamp(baby.y, baby.r * 1.2, H - baby.r * 1.2);
  }

  function updateFish() {
    for (const f of fish) {
      f.x += f.vx;
      // Loop fish
      if (f.x < -30) {
        f.x = W + rand(20, 120);
        f.y = rand(waterline + 30, H - 25);
        f.vx = rand(-1.2, -0.4);
      }
    }

    // Collisions
    for (let i = fish.length - 1; i >= 0; i--) {
      const f = fish[i];
      if (circleHit(whale, f)) {
        score += 1;
        splash(f.x, f.y, 10);
        // respawn fish elsewhere
        f.x = W + rand(30, 160);
        f.y = rand(waterline + 30, H - 25);
        f.vx = rand(-1.2, -0.4);
      }
      if (showBaby && circleHit(baby, f)) {
        score += 1;
        splash(f.x, f.y, 8);
        f.x = W + rand(30, 160);
        f.y = rand(waterline + 30, H - 25);
        f.vx = rand(-1.2, -0.4);
      }
    }
  }

  function updateBubbles() {
    for (let i = bubbles.length - 1; i >= 0; i--) {
      const b = bubbles[i];
      b.x += b.vx;
      b.y += b.vy;
      b.vy += 0.06; // gravity
      b.life -= 1;
      if (b.life <= 0) bubbles.splice(i, 1);
    }
  }

  function drawBubbles() {
    ctx.fillStyle = "rgba(31,31,31,0.12)";
    for (const b of bubbles) {
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function frame() {
    drawBackground();

    updatePlayer();
    updateBaby();
    updateFish();
    updateBubbles();

    // Draw underwater bubbles and fish first
    drawBubbles();
    for (const f of fish) drawFish(f);

    // Draw whale(s)
    if (showBaby) {
      // Baby behind whale
      drawWhaleBody({ ...baby, facing: whale.facing });
    }
    drawWhaleBody(whale);

    // UI overlay
    drawUI();

    requestAnimationFrame(frame);
  }

  spawnFish(6);
  frame();

  // Expose reset/toggle for buttons
  function reset() {
    best = Math.max(best, score);
    score = 0;

    whale.x = W * 0.25;
    whale.y = waterline + 40;
    whale.vx = 0;
    whale.vy = 0;
    whale.jumpReady = true;
    whale.facing = 1;

    baby.x = whale.x - 60;
    baby.y = whale.y + 15;
    baby.vx = 0;
    baby.vy = 0;

    bubbles.length = 0;
    spawnFish(6);
  }

  restartBtn.addEventListener("click", reset);
})();
