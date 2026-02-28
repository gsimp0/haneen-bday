(() => {
  const canvas = document.getElementById("game");
  const ctx = canvas.getContext("2d");

  const restartBtn = document.getElementById("restartBtn");
  const toggleBabyBtn = document.getElementById("toggleBabyBtn");

  const W = canvas.width;
  const H = canvas.height;

  // Waterline and physics
  const waterline = Math.floor(H * 0.62);

  // Gravity still exists, but water has buoyancy to counter it
  const gravity = 0.55;
  const airDrag = 0.985;
  const waterDrag = 0.93;

  // Swim tuning
  const swimAccelX = 0.55;
  const swimAccelY = 0.55;

  // Buoyancy: target depth where the whale naturally wants to float
  const floatDepth = 95; // pixels below waterline
  const buoyancyStrength = 0.018; // higher = more floaty

  const keys = new Set();
  window.addEventListener(
    "keydown",
    (e) => {
      const k = e.key.toLowerCase();
      const block =
        ["arrowup", "arrowdown", "arrowleft", "arrowright", " ", "w", "a", "s", "d", "b", "r"].includes(k) ||
        e.key === " ";
      if (block) e.preventDefault();

      if (e.key === " ") keys.add("space");
      else keys.add(k);

      if (k === "b") toggleBaby();
      if (k === "r") reset();
    },
    { passive: false }
  );

  window.addEventListener("keyup", (e) => {
    const k = e.key.toLowerCase();
    if (e.key === " ") keys.delete("space");
    else keys.delete(k);
  });

  let score = 0;
  let best = 0;
  let showBaby = true;

  const whale = {
    x: W * 0.25,
    y: waterline + 70,
    vx: 0,
    vy: 0,
    r: 26,
    jumpReady: true,
    facing: 1,

    // visual animation state
    phase: 0,
    pitch: 0,
  };

  const baby = {
    x: whale.x - 70,
    y: whale.y + 18,
    vx: 0,
    vy: 0,
    r: 16,

    // visual animation state
    phase: 0,
    pitch: 0,
  };

  const fish = [];
  const bubbles = [];

  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  function clamp(v, a, b) {
    return Math.max(a, Math.min(b, v));
  }

  function spawnFish(n = 6) {
    fish.length = 0;
    for (let i = 0; i < n; i++) {
      fish.push({
        x: rand(W * 0.35, W * 0.95),
        y: rand(waterline + 35, H - 30),
        r: 10,
        vx: rand(-1.2, -0.4),
      });
    }
  }

  function splash(x, y, count = 14) {
    for (let i = 0; i < count; i++) {
      bubbles.push({
        x,
        y,
        vx: rand(-1.8, 1.8),
        vy: rand(-3.0, -0.9),
        life: rand(20, 45),
        r: rand(2, 5),
      });
    }
  }

  function reset() {
    best = Math.max(best, score);
    score = 0;

    whale.x = W * 0.25;
    whale.y = waterline + 70;
    whale.vx = 0;
    whale.vy = 0;
    whale.jumpReady = true;
    whale.facing = 1;
    whale.phase = 0;
    whale.pitch = 0;

    baby.x = whale.x - 70;
    baby.y = whale.y + 18;
    baby.vx = 0;
    baby.vy = 0;
    baby.phase = 0;
    baby.pitch = 0;

    bubbles.length = 0;
    spawnFish(6);
  }

  function toggleBaby() {
    showBaby = !showBaby;
  }

  if (restartBtn) restartBtn.addEventListener("click", reset);
  if (toggleBabyBtn) toggleBabyBtn.addEventListener("click", toggleBaby);

  // COLOR PALETTE (more natural)
  const COLORS = {
    skyTop: "#cfe9ff",
    skyBottom: "#f9fbff",
    sun: "rgba(255, 223, 128, 0.55)",
    waterTop: "#2f89c7",
    waterBottom: "#0a3d66",
    waterline: "rgba(255,255,255,0.55)",
    whale: "#1b2a41",
    whaleShade: "rgba(255,255,255,0.10)",
    fish: "#ffb703",
    fishTail: "#fb8500",
    bubble: "rgba(255,255,255,0.22)",
    ui: "rgba(27,42,65,0.92)",
    uiMuted: "rgba(27,42,65,0.65)",
  };

  function drawBackground() {
    // SKY (light blue gradient)
    const sky = ctx.createLinearGradient(0, 0, 0, waterline);
    sky.addColorStop(0, "#a8d8ff");
    sky.addColorStop(1, "#eaf6ff");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, waterline);

    // SUN (soft warm highlight)
    ctx.beginPath();
    ctx.fillStyle = "rgba(255, 214, 120, 0.7)";
    ctx.arc(W * 0.85, H * 0.18, 55, 0, Math.PI * 2);
    ctx.fill();

    // WATER (deep ocean blue gradient)
    const water = ctx.createLinearGradient(0, waterline, 0, H);
    water.addColorStop(0, "#1f8edb");
    water.addColorStop(1, "#083b66");
    ctx.fillStyle = water;
    ctx.fillRect(0, waterline, W, H - waterline);

    // Waterline shimmer
    ctx.strokeStyle = "rgba(255,255,255,0.6)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, waterline);
    for (let x = 0; x <= W; x += 18) {
      ctx.lineTo(x, waterline + Math.sin(x * 0.02) * 2);
    }
    ctx.stroke();
  }

  // More realistic silhouette + whale-like motion (body flex + tail beat + pitch)
  <!doctype html>
<html>
<head>
<meta charset="utf-8">
<style>
  body { margin:0; background:#fafefe; display:grid; place-items:center; height:100vh; }
  canvas { background:#fafefe; }
</style>
</head>
<body>

<canvas id="c" width="800" height="500"></canvas>

<script>
const canvas = document.getElementById("c");
const ctx = canvas.getContext("2d");

function drawWhale(x, y, s = 1) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);

  // Matched from your PNG (dominant palette)
  const BODY    = "#6990ba";
  const OUTLINE = "#456685";
  const BELLY   = "#87aad1";
  const SPOUT   = "#d8e5ec";
  const DARK    = "#476379";
  const EYE     = "#2b2b2b";

  ctx.lineWidth = 6;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";

  // BODY (soft transition into tail root)
  ctx.beginPath();
  ctx.moveTo(-220, 20);
  ctx.quadraticCurveTo(-160, -40, 80, -20);
  ctx.quadraticCurveTo(190, -12, 235, -22);      // approach tail
  ctx.quadraticCurveTo(260, -28, 275, -20);      // tail root (top) softened
  ctx.quadraticCurveTo(260, 18, 235, 24);        // tail root (bottom) softened
  ctx.quadraticCurveTo(190, 48, 80, 60);
  ctx.quadraticCurveTo(-140, 80, -220, 20);
  ctx.closePath();
  ctx.fillStyle = BODY;
  ctx.fill();
  ctx.strokeStyle = OUTLINE;
  ctx.stroke();

  // BELLY PATCH
  ctx.beginPath();
  ctx.moveTo(-200, 30);
  ctx.quadraticCurveTo(-60, 110, 120, 40);
  ctx.quadraticCurveTo(-40, 70, -200, 30);
  ctx.fillStyle = BELLY;
  ctx.fill();

  // PECTORAL FIN
  ctx.beginPath();
  ctx.moveTo(35, 52);
  ctx.quadraticCurveTo(110, 135, 160, 70);
  ctx.quadraticCurveTo(95, 92, 35, 52);
  ctx.closePath();
  ctx.fillStyle = BODY;
  ctx.fill();
  ctx.strokeStyle = OUTLINE;
  ctx.stroke();

  // SMALL DORSAL FIN
  ctx.beginPath();
  ctx.moveTo(120, -20);
  ctx.quadraticCurveTo(136, -44, 156, -25);
  ctx.closePath();
  ctx.fillStyle = BODY;
  ctx.fill();
  ctx.stroke();

  // TAIL FLUKE (wider + flatter + lower height)
  // anchored at the softened tail root near x ~ 275
  ctx.beginPath();
  ctx.moveTo(255, -16);

  // upper lobe out (wide, flat)
  ctx.quadraticCurveTo(305, -48, 360, -28);

  // center notch (small dip)
  ctx.quadraticCurveTo(335, -6, 305, -8);

  // lower lobe out (wide, flat)
  ctx.quadraticCurveTo(335, 10, 360, 38);

  // return toward body
  ctx.quadraticCurveTo(305, 26, 255, 10);
  ctx.closePath();

  ctx.fillStyle = BODY;
  ctx.fill();
  ctx.strokeStyle = OUTLINE;
  ctx.stroke();

  // EYE
  ctx.beginPath();
  ctx.arc(-170, 0, 6, 0, Math.PI * 2);
  ctx.fillStyle = EYE;
  ctx.fill();

  // MOUTH (subtle)
  ctx.beginPath();
  ctx.moveTo(-200, 10);
  ctx.quadraticCurveTo(-170, 20, -150, 10);
  ctx.strokeStyle = DARK;
  ctx.lineWidth = 4;
  ctx.stroke();

  // WATER SPOUT
  ctx.fillStyle = SPOUT;
  ctx.beginPath();
  ctx.ellipse(-130, -60, 8, 18, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.ellipse(-150, -70, 6, 14, -0.3, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.ellipse(-110, -70, 6, 14, 0.3, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

drawWhale(400, 250, 1);
</script>

</body>
</html>

  function drawFish(f) {
    ctx.beginPath();
    ctx.fillStyle = "#ffd166"; // golden fish;
    ctx.ellipse(f.x, f.y, f.r * 1.1, f.r * 0.7, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.fillStyle = "#f4a261";
    ctx.moveTo(f.x - f.r * 1.1, f.y);
    ctx.lineTo(f.x - f.r * 1.6, f.y - f.r * 0.55);
    ctx.lineTo(f.x - f.r * 1.6, f.y + f.r * 0.55);
    ctx.closePath();
    ctx.fill();
  }

  function drawBubbles() {
    ctx.fillStyle = COLORS.bubble;
    for (const b of bubbles) {
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function drawUI() {
    ctx.fillStyle = COLORS.ui;
    ctx.font = "16px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial";
    ctx.fillText(`Fish: ${score}`, 18, 28);
    ctx.fillText(`Best: ${Math.max(best, score)}`, 18, 50);

    ctx.fillStyle = COLORS.uiMuted;
    ctx.fillText("Move: arrows/WASD   Swim up/down in water   Jump: space   Baby: B   Restart: R", 18, H - 16);
  }

  function circleHit(a, b) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    const rr = (a.r + b.r) * (a.r + b.r);
    return dx * dx + dy * dy <= rr;
  }

  function updatePlayer() {
    const up = keys.has("arrowup") || keys.has("w");
    const down = keys.has("arrowdown") || keys.has("s");
    const left = keys.has("arrowleft") || keys.has("a");
    const right = keys.has("arrowright") || keys.has("d");

    const inWater = whale.y >= waterline + 2;

    let ax = 0;
    let ay = 0;

    if (left) ax -= swimAccelX;
    if (right) ax += swimAccelX;

    // IMPORTANT: allow real swimming up and down only in water
    if (inWater) {
      if (up) ay -= swimAccelY;
      if (down) ay += swimAccelY;
    }

    if (ax !== 0) whale.facing = ax > 0 ? 1 : -1;

    // Jump only when in water and near the surface (feels better)
    const nearSurface = whale.y <= waterline + 120;
    if (inWater && nearSurface) whale.jumpReady = true;

    if (keys.has("space") && whale.jumpReady && inWater && nearSurface) {
      whale.vy = -12.0;
      whale.vx += whale.facing * 1.2;
      whale.jumpReady = false;
      splash(whale.x, waterline + 2, 18);
    }

    // Forces
    whale.vx += ax;

    // Gravity always pulls down
    whale.vy += gravity;

    // Buoyancy in water: pulls whale toward a comfortable float depth
    if (inWater) {
      const targetY = waterline + floatDepth;
      const buoy = (targetY - whale.y) * buoyancyStrength;
      whale.vy += buoy;

      // Apply swim vertical input in water
      whale.vy += ay;
    }

    // Drag
    const drag = whale.y < waterline ? airDrag : waterDrag;
    whale.vx *= drag;
    whale.vy *= drag;

    // Integrate
    whale.x += whale.vx;
    whale.y += whale.vy;

    // Bounds
    whale.x = clamp(whale.x, whale.r * 1.8, W - whale.r * 1.8);

    // Let whale go above water but prevent disappearing
    whale.y = clamp(whale.y, whale.r * 1.1, H - whale.r * 1.2);

    // Small splash when re-entering water
    if (whale.y >= waterline + 3 && whale.vy > 2.5 && Math.random() < 0.25) {
      splash(whale.x, waterline + 2, 8);
    }

    // Visual swim animation
    const speed = Math.hypot(whale.vx, whale.vy);
    if (inWater) whale.phase += 0.12 + speed * 0.02;
    else whale.phase += 0.03;

    const targetPitch = clamp(whale.vy * 0.03, -0.35, 0.35);
    whale.pitch += (targetPitch - whale.pitch) * 0.12;
  }

  function updateBaby() {
    if (!showBaby) return;

    const targetX = whale.x - whale.facing * 75;
    const targetY = whale.y + 18;

    const dx = targetX - baby.x;
    const dy = targetY - baby.y;

    baby.vx += dx * 0.012;
    baby.vy += dy * 0.012;

    // Gravity + buoyancy for baby too
    baby.vy += gravity * 0.55;

    const inWater = baby.y >= waterline + 2;
    if (inWater) {
      const target = waterline + (floatDepth + 25);
      baby.vy += (target - baby.y) * (buoyancyStrength * 1.05);
    }

    const drag = baby.y < waterline ? airDrag : waterDrag;
    baby.vx *= drag;
    baby.vy *= drag;

    baby.x += baby.vx;
    baby.y += baby.vy;

    baby.x = clamp(baby.x, baby.r * 1.8, W - baby.r * 1.8);
    baby.y = clamp(baby.y, baby.r * 1.1, H - baby.r * 1.2);

    // Visual swim animation for baby
    const speedB = Math.hypot(baby.vx, baby.vy);
    if (inWater) baby.phase += 0.12 + speedB * 0.02;
    else baby.phase += 0.03;

    const targetPitchB = clamp(baby.vy * 0.03, -0.35, 0.35);
    baby.pitch += (targetPitchB - baby.pitch) * 0.12;
  }

  function updateFish() {
    for (const f of fish) {
      f.x += f.vx;
      if (f.x < -30) {
        f.x = W + rand(20, 140);
        f.y = rand(waterline + 35, H - 30);
        f.vx = rand(-1.3, -0.5);
      }
    }

    for (let i = fish.length - 1; i >= 0; i--) {
      const f = fish[i];

      const hitWhale = circleHit(whale, f);
      const hitBaby = showBaby && circleHit(baby, f);

      if (hitWhale || hitBaby) {
        score += 1;
        splash(f.x, f.y, hitBaby ? 8 : 10);
        f.x = W + rand(30, 160);
        f.y = rand(waterline + 35, H - 30);
        f.vx = rand(-1.3, -0.5);
      }
    }
  }

  function updateBubbles() {
    for (let i = bubbles.length - 1; i >= 0; i--) {
      const b = bubbles[i];
      b.x += b.vx;
      b.y += b.vy;
      b.vy += 0.06;
      b.life -= 1;
      if (b.life <= 0) bubbles.splice(i, 1);
    }
  }

  function frame() {
    drawBackground();

    updatePlayer();
    updateBaby();
    updateFish();
    updateBubbles();

    drawBubbles();
    for (const f of fish) drawFish(f);

    if (showBaby) drawWhaleBody(baby, whale.facing);
    drawWhaleBody(whale, whale.facing);

    drawUI();
    requestAnimationFrame(frame);
  }

  spawnFish(6);
  frame();
})();
