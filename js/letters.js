const impressions = [
  {
    title: "First impression",
    body: `You felt calm.
Like someone I could trust quickly.
I remember thinking: this is going to matter.`
  },
  {
    title: "Your voice",
    body: `It had this steadiness to it.
Not loud, not trying to win.
Just sure of itself.`
  },
  {
    title: "How you looked at people",
    body: `You noticed things.
Not in a scanning way, but in a caring way.
I clocked it immediately.`
  },
  {
    title: "Your laugh",
    body: `It made the room feel less serious.
Like it gave everything permission to soften.`
  },
  {
    title: "The way you moved",
    body: `You seemed self-possessed.
Not performing.
Just fully there.`
  },
  {
    title: "The feeling after",
    body: `I left thinking about you.
Not in a dramatic way.
In a quiet, certain way.`
  }
];

const field = document.getElementById("impressionsField"); // container where floating words live
const backdrop = document.getElementById("backdrop");
const modalTitle = document.getElementById("modalTitle");
const modalBody = document.getElementById("modalBody");
const closeBtn = document.getElementById("closeBtn");

function openModal(item) {
  modalTitle.textContent = item.title;
  modalBody.textContent = item.body;
  backdrop.style.display = "flex";
}

function closeModal() {
  backdrop.style.display = "none";
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

// Create floating, borderless text buttons scattered across the screen
impressions.forEach((it, i) => {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "float-word";
  btn.setAttribute("data-open", `imp-${i}`);
  btn.textContent = it.title.toLowerCase();

  // Random scatter with safe margins so text stays on screen
  const marginVw = 6;
  const marginVh = 8;

  const left = clamp(Math.random() * 100, marginVw, 100 - marginVw);
  const top = clamp(Math.random() * 100, marginVh, 100 - marginVh);

  btn.style.left = left + "vw";
  btn.style.top = top + "vh";

  btn.addEventListener("click", () => openModal(it));
  field.appendChild(btn);
});

closeBtn.addEventListener("click", closeModal);
backdrop.addEventListener("click", (e) => {
  if (e.target === backdrop) closeModal();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});
