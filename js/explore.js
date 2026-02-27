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
      title: "A poem fragment",
      body:
`Write 3 to 8 lines here.
Make it feel like her.
You can change this any time.`,
    },
    sesame: {
      title: "Sesame fortune",
      body:
`Clicking this is a reminder:
you can start small, and still be powerful.`,
    },
    cook: {
      title: "Kitchen compliment",
      body:
`You are an unbelievable cook.
Not just skill. It is attention.
It is care. It is instinct.`,
    },
    trail: {
      title: "Trail sign",
      body:
`Next adventure ideas:
1) A sunrise walk
2) A new hobby day
3) A hike and a picnic`,
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
})();
