/* Global Mintlify community card. */
(() => {
  if (window.__graphifyCommunityCardInitialized) return;
  window.__graphifyCommunityCardInitialized = true;

  const ARTWORK_URL = "/images/community-card.png";
  const LOGO_URL = "https://graphify.com/assets/brand/graphify-logo-ink.svg";
  const DISMISSAL_KEY = "graphify-community-dismissed-v1";
  const desktop = window.matchMedia("(min-width: 1024px)");
  const iconBase = "https://d3gk2c5xim1je2.cloudfront.net/fontawesome/v7.2.0/brands/";
  let dismissed = false;
  try {
    dismissed = localStorage.getItem(DISMISSAL_KEY) === "true";
  } catch (_) {
    // The card still works when storage is unavailable.
  }
  if (dismissed) return;

  const card = document.createElement("aside");
  card.id = "graphify-community-card";
  card.className = "graphify-community-card";
  card.setAttribute("aria-labelledby", "graphify-community-title");

  const artwork = document.createElement("div");
  artwork.className = "graphify-community-artwork";
  artwork.setAttribute("aria-hidden", "true");
  const image = document.createElement("img");
  image.src = ARTWORK_URL || LOGO_URL;
  image.alt = "";
  image.className = ARTWORK_URL ? "graphify-community-image" : "graphify-community-logo";
  image.width = ARTWORK_URL ? 2048 : 160;
  image.height = ARTWORK_URL ? 1024 : 52;
  image.decoding = "async";
  artwork.append(image);

  const close = document.createElement("button");
  close.type = "button";
  close.className = "graphify-community-close";
  close.setAttribute("aria-label", "Dismiss community invitation");
  const closeIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  closeIcon.setAttribute("viewBox", "0 0 16 16");
  closeIcon.setAttribute("width", "16");
  closeIcon.setAttribute("height", "16");
  closeIcon.setAttribute("fill", "none");
  closeIcon.setAttribute("stroke", "currentColor");
  closeIcon.setAttribute("stroke-width", "1.5");
  closeIcon.setAttribute("stroke-linecap", "round");
  closeIcon.setAttribute("aria-hidden", "true");
  closeIcon.setAttribute("focusable", "false");
  const closePath = document.createElementNS("http://www.w3.org/2000/svg", "path");
  closePath.setAttribute("d", "M3 3L13 13M13 3L3 13");
  closeIcon.append(closePath);
  close.append(closeIcon);

  const content = document.createElement("div");
  content.className = "graphify-community-content";
  const title = document.createElement("h2");
  title.id = "graphify-community-title";
  title.textContent = "Join the community";
  const description = document.createElement("p");
  description.textContent = "Ask questions, get help, and share what you're building with Graphify.";
  const actions = document.createElement("div");
  actions.className = "graphify-community-actions";

  function socialLink(href, label, accessibleLabel, icon) {
    const link = document.createElement("a");
    link.href = href;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.setAttribute("aria-label", accessibleLabel + " (opens in a new tab)");
    const logo = document.createElement("img");
    logo.src = iconBase + icon + ".svg";
    logo.alt = "";
    logo.width = 18;
    logo.height = 18;
    logo.setAttribute("aria-hidden", "true");
    const text = document.createElement("span");
    text.textContent = label;
    link.append(logo, text);
    return link;
  }

  actions.append(
    socialLink("https://discord.gg/XPPYrdw3Yp", "Join", "Join Graphify on Discord", "discord"),
    socialLink("https://x.com/graphify", "Follow", "Follow Graphify on X", "x-twitter")
  );
  content.append(title, description, actions);
  card.append(artwork, close, content);

  // Place the same card inside the native mobile drawer's scrollable content.
  // If Mintlify changes that hook, it stays hidden on phones rather than covering the page.
  function placeCard() {
    if (dismissed) return;
    const mobileContent = document.querySelector(
      "#mobile-nav-content, #mobile-nav [data-component-part='scroll-area-content']"
    );
    const parent = desktop.matches ? document.body : mobileContent;
    card.dataset.placement = desktop.matches ? "desktop" : "mobile";
    card.hidden = !parent;
    const host = parent || document.body;
    if (card.parentElement !== host) host.append(card);
    if (!desktop.matches && parent) {
      // The modal drawer may hide this card while it still lives outside its portal.
      // Restore access after moving it inside the drawer; keep background content hidden.
      card.removeAttribute("aria-hidden");
      card.removeAttribute("data-base-ui-inert");
      card.removeAttribute("inert");
    }
  }

  let frame = 0;
  function schedulePlacement() {
    if (frame || dismissed) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      placeCard();
    });
  }

  const observer = new MutationObserver(schedulePlacement);
  observer.observe(document.body, { childList: true, subtree: true });
  observer.observe(card, {
    attributes: true,
    attributeFilter: ["aria-hidden", "data-base-ui-inert", "inert"]
  });
  desktop.addEventListener("change", schedulePlacement);

  close.addEventListener("click", () => {
    const mobileNav = card.closest("#mobile-nav");
    const focusTarget = mobileNav
      ? mobileNav.querySelector("button[aria-label='Close navigation']")
      : document.getElementById("search-bar-entry");
    dismissed = true;
    try {
      localStorage.setItem(DISMISSAL_KEY, "true");
    } catch (_) {
      // Dismissal remains effective for this page session.
    }
    observer.disconnect();
    desktop.removeEventListener("change", schedulePlacement);
    if (frame) cancelAnimationFrame(frame);
    card.remove();
    if (focusTarget) focusTarget.focus({ preventScroll: true });
  });

  placeCard();
})();

/* Phone outline, built from the headings on the page. */
(() => {
  if (window.__graphifyMobileOutline) return;
  window.__graphifyMobileOutline = true;

  const desktop = window.matchMedia("(min-width: 1280px)");

  function pageSkipsOutline() {
    const mode = document.documentElement.getAttribute("data-page-mode");
    return mode === "frame" || mode === "custom";
  }

  function headingText(heading) {
    const copy = heading.cloneNode(true);
    copy.querySelectorAll("a, svg, button").forEach((node) => node.remove());
    return (copy.textContent || "").replace(/\s+/g, " ").trim();
  }

  function slug(text) {
    const base = text
      .toLowerCase()
      .replace(/&/g, " and ")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    if (!base) return "";
    let id = base;
    let n = 2;
    while (document.getElementById(id)) {
      id = base + "-" + n;
      n += 1;
    }
    return id;
  }

  function headings() {
    const content = document.getElementById("content");
    if (!content) return [];
    const found = [];
    for (const heading of content.querySelectorAll("h2")) {
      if (heading.closest(".graphify-mobile-outline")) continue;
      // Card titles are headings too, and their ids are not page sections.
      if (heading.classList.contains("not-prose")) continue;
      const text = headingText(heading);
      if (!text) continue;
      let id = heading.id;
      if (!id || id.startsWith("_R")) {
        id = slug(text);
        if (!id) continue;
        heading.id = id;
      }
      found.push({ id, text });
    }
    return found;
  }

  function railVisible() {
    const rail = document.getElementById("table-of-contents-layout");
    if (!rail) return desktop.matches;
    return getComputedStyle(rail).display !== "none";
  }

  function sync(box) {
    if (!box) return;
    const hide = pageSkipsOutline() || railVisible();
    box.classList.toggle("is-suppressed", hide);
    if (hide) box.open = false;
  }

  let builtFrom = "";

  function build(items) {
    const content = document.getElementById("content");
    if (!content) return;
    document.querySelector(".graphify-mobile-outline")?.remove();
    const box = document.createElement("details");
    box.className = "graphify-mobile-outline";
    const summary = document.createElement("summary");
    summary.textContent = "On this page";
    const nav = document.createElement("nav");
    nav.setAttribute("aria-label", "On this page");
    for (const item of items) {
      const link = document.createElement("a");
      link.setAttribute("href", "#" + item.id);
      link.textContent = item.text;
      nav.append(link);
    }
    box.append(summary, nav);
    content.prepend(box);
    builtFrom = items.map((item) => item.id).join("|");
    sync(box);
  }

  let frame = 0;
  function schedule() {
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      const existing = document.querySelector(".graphify-mobile-outline");
      if (pageSkipsOutline()) {
        if (existing) existing.remove();
        builtFrom = "";
        return;
      }
      const items = headings();
      const signature = items.map((item) => item.id).join("|");
      if (items.length < 2) {
        if (existing) existing.remove();
        builtFrom = "";
        return;
      }
      if (!existing || signature !== builtFrom) build(items);
      else sync(existing);
    });
  }

  desktop.addEventListener("change", schedule);
  window.addEventListener("resize", schedule);
  const observer = new MutationObserver(schedule);
  observer.observe(document.documentElement, { childList: true, subtree: true });
  schedule();
})();
