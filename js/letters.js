const letters = [
  {
    title: "Open when you feel overwhelmed",
    body:
`You do not need to carry everything at once.
If today is heavy, do it in pieces.

Three small anchors:
1) Drink water.
2) Eat something simple.
3) One task, then pause.

I believe in you, especially on the days you do not feel impressive.`
  },
  {
    title: "Open when you cannot sleep",
    body:
`Breathe slower than you think you should.

If your mind is loud: write one sentence about what it is trying to protect you from.
Then let it rest.

I love you. Tomorrow can wait.`
  },
  {
    title: "Open when you miss me",
    body:
`I miss you too.

Here is a snapshot I keep:
[replace this with a specific memory]

I am with you, even when we are not in the same room.`
  }
];

const grid = document.getElementById("lettersGrid");
const backdrop = document.getElementById("backdrop");
const modalTitle = document.getElementById("modalTitle");
const modalBody = document.getElementById("modalBody");
const closeBtn = document.getElementById("closeBtn");

function openModal(letter){
  modalTitle.textContent = letter.title;
  modalBody.textContent = letter.body;
  backdrop.style.display = "flex";
}
function closeModal(){
  backdrop.style.display = "none";
}

letters.forEach((l) => {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "tile";
  btn.style.gridColumn = "span 6";
  btn.innerHTML = `<div class="kicker">open</div><h2>${l.title}</h2><p>Click to read.</p>`;
  btn.addEventListener("click", () => openModal(l));
  grid.appendChild(btn);
});

closeBtn.addEventListener("click", closeModal);
backdrop.addEventListener("click", (e) => {
  if (e.target === backdrop) closeModal();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});
