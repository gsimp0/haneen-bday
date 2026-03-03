const impressions = [
  {
    title: "Belltop",
    body: `You felt calm.
I felt like you were someone I could trust quickly.
I remember thinking how cool you were. How much I wanted to get to know you more. I was so excited to find out the things we had in common. I remember thinking how I rarely if ever meet someone that gets excited about the same things I do in the way you did.`
  },
  {
    title: "Watermelon",
    body: `I remember sitting eating my watermon at the bottom of the psych building. In teh distance I caught a glace of a group walking up the hill. I could see you!
I was so happy to see you and even more happy that when you got to the stairs to turned and said goodbye to the group and walked over to me.
I was trying to be so cool.`
  },
  {
    title: "How you looked at the world",
    body: `You noticed things.
In the most a caring way. I saw that you knew everything had something special about it and if anyone one was going to celebrate them it would be you..`
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
