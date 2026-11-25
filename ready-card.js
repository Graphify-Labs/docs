/* "Ready to build?" card at the bottom of the "On this page" column. */
(() => {
  if (window.__graphifyReadyCardInitialized) return;
  window.__graphifyReadyCardInitialized = true;

  const CARD_ID = "graphify-ready-card";
  const UTM = "utm_source=docs&utm_medium=link&utm_campaign=toc-card";
  const START_URL = "https://app.graphify.com/signup?" + UTM;
  const PLANS_URL = "https://graphify.com/pricing?" + UTM;
  const LOGO_LIGHT = "https://graphify.com/assets/brand/graphify-logo-ink.svg";
  const LOGO_DARK = "https://graphify.com/assets/brand/graphify-logo-white.svg";

  function logo(src, mode) {
    const img = document.createElement("img");
    img.src = src;
    img.alt = "Graphify";
    img.className = "graphify-ready-logo graphify-ready-logo-" + mode;
    img.width = 92;
    img.height = 20;
    img.decoding = "async";
    return img;
  }

  function link(href, label, kind) {
    const a = document.createElement("a");
    a.href = href;
    a.className = "graphify-ready-button graphify-ready-button-" + kind;
    a.textContent = label;
    return a;
  }

  function build() {
    const card = document.createElement("div");
    card.id = CARD_ID;
    card.className = "graphify-ready-card";

    const title = document.createElement("p");
    title.className = "graphify-ready-title";
    title.textContent = "Ready to build?";

    const text = document.createElement("p");
    text.className = "graphify-ready-text";
    text.append(
      "Shared context for your coding agents and your team: a code graph, Wiki, Memory and PR reviews, free to start. "
    );
    const strong = document.createElement("strong");
    strong.textContent = "No card required.";
    text.append(strong);

    const actions = document.createElement("div");
    actions.className = "graphify-ready-actions";
    actions.append(link(START_URL, "Start free", "primary"), link(PLANS_URL, "See our plans", "secondary"));

    card.append(logo(LOGO_LIGHT, "light"), logo(LOGO_DARK, "dark"), title, text, actions);
    return card;
  }

  function place() {
    const list = document.getElementById("table-of-contents-content");
    if (!list || list.querySelector("#" + CARD_ID)) return;
    const item = document.createElement("li");
    item.className = "graphify-ready-item";
    item.append(build());
    list.append(item);
  }

  let pending = 0;
  const observer = new MutationObserver(() => {
    if (pending) return;
    pending = requestAnimationFrame(() => {
      pending = 0;
      place();
    });
  });

  function start() {
    place();
    observer.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
