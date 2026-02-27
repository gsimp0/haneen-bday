(() => {
  const backdrop = document.getElementById("backdrop");
  const modalTitle = document.getElementById("modalTitle");
  const modalBody = document.getElementById("modalBody");
  const modalExtra = document.getElementById("modalExtra");
  const closeBtn = document.getElementById("closeBtn");

  function openModal(title, body, extraHtml = "") {
    modalTitle.textContent = title;
    modalBody.textContent = body;
    modalExtra.innerHTML = extraHtml;
    backdrop.style.display = "flex";
  }

  function closeModal() {
    backdrop.style.display = "none";
  }

  closeBtn.addEventListener("click", closeModal);
  backdrop.addEventListener("click", (e) => {
    if (e.target === backdrop) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });

  const items = {
    poem: {
      title: "Poem",
      body:
`Replace this with something real.
Even 4 lines is enough.

You can make it a fragment, not a finished poem.`
    },
    sesame: {
      title: "Sesame",
      body:
`If you were a flavour you would be toasted and bright.
Small thing. Big impact.`
    },
    future: {
      title: "Future",
      body:
`A small promise:
I will keep making space for your voice.
For your writing.
For your wild new hobbies.
For your softness and your fire.`
    },
    music: {
      title: "Our playlist",
      body: "Play it here or open Spotify.",
      extra:
        `<iframe
          style="border-radius:12px; width:100%; height:380px; border:0;"
          src="https://open.spotify.com/embed/playlist/19SKN1R8KuCZf2S9CS6130"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"></iframe>
         <p style="margin-top:12px;">
          <a class="btn" href="https://open.spotify.com/playlist/19SKN1R8KuCZf2S9CS6130" target="_blank" rel="noopener">
            Open in Spotify
          </a>
         </p>`
    },
  };

  document.querySelectorAll("[data-open]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const key = btn.getAttribute("data-open");
      const item = items[key];
      if (!item) return;
      openModal(item.title, item.body, item.extra || "");
    });
  });

  // Secret: clicking empty space 5 times unlocks an Arabic message
  let secretCount = 0;
  const space = document.querySelector(".space-inner");
  space.addEventListener("click", (e) => {
    // only count clicks on empty background, not on words
    if (e.target.closest(".float-word")) return;
    secretCount += 1;
    if (secretCount === 5) {
      openModal("Secret", "بحبك كتير. \n\nThis is your world.");
    }
  });
})();
