/* Ask Graphify on the docs site.
   The browser talks only to https://graphify.com/api/assistant.
   Atlas and the model key stay on that server. */
(() => {
  if (window.__graphifyAskInitialized) return;
  window.__graphifyAskInitialized = true;

  const ENDPOINT = "https://graphify.com/api/assistant";
  const LOGO_URL = "https://graphify.com/assets/logo-icon.svg";
  const MAX_CHARS = 2000;
  const STARTERS = [
    "How do I install Graphify?",
    "What is the package name?",
    "How do I connect Cursor?",
  ];

  const root = document.createElement("div");
  root.className = "graphify-ask";

  function logoAvatar() {
    const avatar = document.createElement("span");
    avatar.className = "graphify-ask-avatar";
    avatar.setAttribute("aria-hidden", "true");
    const logo = document.createElement("img");
    logo.src = LOGO_URL;
    logo.alt = "";
    logo.width = 16;
    logo.height = 18;
    logo.decoding = "async";
    avatar.append(logo);
    return avatar;
  }

  const launcher = document.createElement("button");
  launcher.type = "button";
  launcher.className = "graphify-ask-launcher";
  const launcherLabel = document.createElement("span");
  launcherLabel.textContent = "Ask Graphify";
  launcher.append(logoAvatar(), launcherLabel);

  const panel = document.createElement("section");
  panel.className = "graphify-ask-panel";
  panel.hidden = true;
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-modal", "false");
  panel.setAttribute("aria-labelledby", "graphify-ask-title");

  const head = document.createElement("div");
  head.className = "graphify-ask-head";
  const heading = document.createElement("div");
  const eyebrow = document.createElement("p");
  eyebrow.className = "graphify-ask-eyebrow";
  eyebrow.textContent = "Docs";
  const title = document.createElement("h2");
  title.id = "graphify-ask-title";
  title.textContent = "Ask Graphify";
  heading.append(eyebrow, title);
  const brand = document.createElement("div");
  brand.className = "graphify-ask-brand";
  brand.append(logoAvatar(), heading);
  const close = document.createElement("button");
  close.type = "button";
  close.className = "graphify-ask-close";
  close.setAttribute("aria-label", "Close Ask Graphify");
  const bar = document.createElement("span");
  bar.className = "graphify-ask-bar";
  bar.setAttribute("aria-hidden", "true");
  head.append(brand, close, bar);

  const log = document.createElement("div");
  log.className = "graphify-ask-log";
  log.setAttribute("role", "log");
  log.setAttribute("aria-live", "polite");

  const starters = document.createElement("div");
  starters.className = "graphify-ask-starters";
  for (const prompt of STARTERS) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = prompt;
    button.addEventListener("click", () => send(prompt));
    starters.append(button);
  }

  const apple = /Mac|iPhone|iPad|iPod/i.test(navigator.userAgent);
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const form = document.createElement("form");
  form.className = "graphify-ask-form";
  const composer = document.createElement("div");
  composer.className = "graphify-ask-composer";
  const input = document.createElement("textarea");
  input.name = "question";
  input.maxLength = MAX_CHARS;
  input.rows = 1;
  input.required = true;
  input.autocomplete = "off";
  input.enterKeyHint = coarse ? "enter" : "send";
  input.setAttribute("aria-label", "Question for Ask Graphify");
  input.placeholder = "Ask about these docs";
  const submit = document.createElement("button");
  submit.type = "submit";
  submit.textContent = "Send";
  composer.append(input, submit);
  const keys = document.createElement("p");
  keys.className = "graphify-ask-keys";
  function keycap(label) {
    const cap = document.createElement("kbd");
    cap.textContent = label;
    return cap;
  }
  keys.append(keycap("Enter"));
  keys.append(document.createTextNode(" or "));
  keys.append(keycap(apple ? "⌘" : "Ctrl"));
  keys.append(keycap("Enter"));
  keys.append(document.createTextNode(" to send"));
  const keysDot = document.createElement("span");
  keysDot.className = "graphify-ask-keys-dot";
  keysDot.setAttribute("aria-hidden", "true");
  keysDot.textContent = "·";
  keys.append(keysDot, keycap("Shift"), keycap("Enter"), document.createTextNode(" for a new line"));
  form.append(composer, keys);

  panel.append(head, log, starters, form);
  root.append(launcher, panel);
  document.body.append(root);

  const LIFT_GAP = 12;
  let liftFrame = 0;
  let watchedCard = null;
  let cardResize = null;

  function communityCard() {
    const card = document.getElementById("graphify-community-card");
    if (!card || card.hidden || card.dataset.placement !== "desktop") return null;
    const style = getComputedStyle(card);
    if (style.display === "none" || style.position !== "fixed") return null;
    return card;
  }

  function placeLauncher() {
    const card = communityCard();
    if (!card) {
      launcher.style.transform = "";
      return;
    }
    const top = card.getBoundingClientRect().top;
    const rest = parseFloat(getComputedStyle(launcher).bottom) || 0;
    const lift = window.innerHeight - top + LIFT_GAP - rest;
    launcher.style.transform = lift > 1 ? "translateY(" + Math.round(-lift) + "px)" : "";
  }

  function scheduleLift() {
    if (liftFrame) return;
    liftFrame = requestAnimationFrame(() => {
      liftFrame = 0;
      const card = document.getElementById("graphify-community-card");
      if (card !== watchedCard) {
        if (cardResize) cardResize.disconnect();
        cardResize = null;
        watchedCard = card;
        if (card && typeof ResizeObserver === "function") {
          cardResize = new ResizeObserver(scheduleLift);
          cardResize.observe(card);
        }
      }
      placeLauncher();
    });
  }

  scheduleLift();
  window.addEventListener("resize", scheduleLift);
  new MutationObserver(scheduleLift).observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["hidden", "data-placement"],
  });

  let sessionId = "";
  let inflight = null;
  let lastFocus = null;

  function newSession() {
    const raw = crypto.randomUUID().replace(/-/g, "");
    sessionId = raw.slice(0, 32);
  }
  newSession();

  function safeHttpsUrl(value, base) {
    try {
      const url = base ? new URL(value, base) : new URL(value);
      if (url.protocol !== "https:") return "";
      if (url.username || url.password) return "";
      return url.href;
    } catch {
      return "";
    }
  }

  function el(tag, className) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    return node;
  }

  function externalLink(href, className) {
    const link = el("a", className);
    link.href = href;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    return link;
  }

  /* Answers arrive as Markdown. Every node below is built with createElement
     and textContent, never innerHTML, and links must pass safeHttpsUrl. */
  const FENCE = /^ {0,3}(`{3,}|~{3,})\s*([^`\s]*)[^`]*$/;
  const HEADING = /^ {0,3}(#{1,6})(?:\s+(.*?))?(?:\s+#+)?\s*$/;
  const RULE = /^ {0,3}([-*_])(?:\s*\1){2,}\s*$/;
  const QUOTE = /^ {0,3}> ?/;
  const ITEM = /^( {0,3})([*+-]|\d{1,9}[.)])( +|$)/;
  const TABLE_SEP = /^ {0,3}\|?\s*:?-+:?\s*(?:\|\s*:?-+:?\s*)*\|?\s*$/;
  const CITE = /[`\\]?\[C(\d+)\]`?/y;
  const AUTOLINK = /<(https?:\/\/[^\s<>]+)>/y;
  const BARE_URL = /https:\/\/[^\s<>"'`[\]]+/y;
  const ESCAPABLE = /[!-/:-@[-`{-~]/;

  function renderMarkdown(source, ctx) {
    const fragment = document.createDocumentFragment();
    const lines = source.replace(/\r\n?/g, "\n").replace(/\t/g, "    ").split("\n");
    renderBlocks(lines, fragment, ctx);
    return fragment;
  }

  function isTable(lines, i) {
    return (
      i + 1 < lines.length &&
      lines[i].includes("|") &&
      lines[i + 1].includes("|") &&
      TABLE_SEP.test(lines[i + 1])
    );
  }

  function startsBlock(lines, i) {
    const line = lines[i];
    if (FENCE.test(line) || HEADING.test(line) || RULE.test(line) || QUOTE.test(line)) return true;
    if (isTable(lines, i)) return true;
    const item = ITEM.exec(line);
    return Boolean(item) && (!/\d/.test(item[2]) || parseInt(item[2], 10) === 1);
  }

  function renderBlocks(lines, parent, ctx) {
    let i = 0;
    while (i < lines.length) {
      const line = lines[i];
      if (!line.trim()) {
        i++;
        continue;
      }
      let match = FENCE.exec(line);
      if (match) {
        i = renderFence(lines, i, match, parent);
        continue;
      }
      match = HEADING.exec(line);
      if (match) {
        const heading = el(match[1].length <= 2 ? "h3" : "h4");
        renderInline((match[2] || "").trim(), heading, ctx);
        parent.append(heading);
        i++;
        continue;
      }
      if (RULE.test(line)) {
        parent.append(el("hr"));
        i++;
        continue;
      }
      if (QUOTE.test(line)) {
        const inner = [];
        while (i < lines.length && QUOTE.test(lines[i])) inner.push(lines[i++].replace(QUOTE, ""));
        const quote = el("blockquote");
        renderBlocks(inner, quote, ctx);
        parent.append(quote);
        continue;
      }
      if (isTable(lines, i)) {
        i = renderTable(lines, i, parent, ctx);
        continue;
      }
      if (ITEM.test(line)) {
        i = renderList(lines, i, parent, ctx);
        continue;
      }
      const text = [];
      while (i < lines.length && lines[i].trim() && !(text.length && startsBlock(lines, i))) {
        text.push(lines[i++].trim());
      }
      const paragraph = el("p");
      renderInline(text.join("\n"), paragraph, ctx);
      parent.append(paragraph);
    }
  }

  function renderFence(lines, i, match, parent) {
    const fence = match[1];
    const indent = lines[i].length - lines[i].trimStart().length;
    const close = new RegExp("^ {0,3}" + (fence[0] === "`" ? "`" : "~") + "{" + fence.length + ",}\\s*$");
    const body = [];
    i++;
    while (i < lines.length && !close.test(lines[i])) {
      const line = lines[i++];
      let cut = 0;
      while (cut < indent && line[cut] === " ") cut++;
      body.push(line.slice(cut));
    }
    if (i < lines.length) i++;
    parent.append(codeCard(body.join("\n"), match[2]));
    return i;
  }

  function codeCard(code, language) {
    const card = el("div", "graphify-ask-code");
    const head = el("div", "graphify-ask-code-head");
    const name = el("span");
    name.textContent = language.replace(/[^\w+#.-]/g, "").slice(0, 24) || "code";
    head.append(name, copyButton(() => code, "Copy code"));
    const pre = el("pre");
    pre.tabIndex = 0;
    const text = el("code");
    text.textContent = code;
    pre.append(text);
    card.append(head, pre);
    return card;
  }

  function copyButton(read, label, text) {
    const idle = text || "Copy";
    const button = el("button", "graphify-ask-copy-button");
    button.type = "button";
    button.textContent = idle;
    button.setAttribute("aria-label", label);
    let reset = 0;
    button.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(read());
        button.textContent = "Copied";
      } catch {
        button.textContent = "Copy failed";
      }
      clearTimeout(reset);
      reset = setTimeout(() => {
        button.textContent = idle;
      }, 1600);
    });
    return button;
  }

  function tableCells(line) {
    let row = line.trim();
    if (row.startsWith("|")) row = row.slice(1);
    if (row.endsWith("|") && !row.endsWith("\\|")) row = row.slice(0, -1);
    const cells = [];
    let cell = "";
    let code = false;
    for (let k = 0; k < row.length; k++) {
      const ch = row[k];
      if (ch === "\\" && row[k + 1] === "|") {
        cell += "|";
        k++;
        continue;
      }
      if (ch === "`") code = !code;
      if (ch === "|" && !code) {
        cells.push(cell.trim());
        cell = "";
        continue;
      }
      cell += ch;
    }
    cells.push(cell.trim());
    return cells;
  }

  function renderTable(lines, i, parent, ctx) {
    const head = tableCells(lines[i]);
    const align = tableCells(lines[i + 1]).map((cell) => {
      if (cell.startsWith(":") && cell.endsWith(":")) return "center";
      return cell.endsWith(":") ? "right" : "";
    });
    const wrap = el("div", "graphify-ask-table");
    wrap.tabIndex = 0;
    const table = el("table");
    const thead = el("thead");
    const headRow = el("tr");
    head.forEach((cell, k) => {
      const th = el("th");
      th.scope = "col";
      if (align[k]) th.style.textAlign = align[k];
      renderInline(cell, th, ctx);
      headRow.append(th);
    });
    thead.append(headRow);
    const tbody = el("tbody");
    i += 2;
    while (i < lines.length && lines[i].trim() && lines[i].includes("|")) {
      const cells = tableCells(lines[i++]);
      const row = el("tr");
      for (let k = 0; k < head.length; k++) {
        const td = el("td");
        if (align[k]) td.style.textAlign = align[k];
        renderInline(cells[k] || "", td, ctx);
        row.append(td);
      }
      tbody.append(row);
    }
    table.append(thead, tbody);
    wrap.append(table);
    parent.append(wrap);
    return i;
  }

  function renderList(lines, i, parent, ctx) {
    const first = ITEM.exec(lines[i]);
    const ordered = /\d/.test(first[2]);
    const list = el(ordered ? "ol" : "ul");
    if (ordered) {
      const start = parseInt(first[2], 10);
      if (start !== 1) list.start = start;
    }
    while (i < lines.length) {
      const match = ITEM.exec(lines[i]);
      if (!match || /\d/.test(match[2]) !== ordered) break;
      const own = match[1].length;
      const gap = match[3].length;
      const width = own + match[2].length + (gap === 0 || gap > 4 ? 1 : gap);
      const body = [lines[i].slice(width)];
      i++;
      while (i < lines.length) {
        const line = lines[i];
        if (!line.trim()) {
          body.push("");
          i++;
          continue;
        }
        const indent = line.length - line.trimStart().length;
        if (indent >= width) {
          body.push(line.slice(width));
        } else if (indent > own && ITEM.test(line.slice(indent))) {
          body.push(line.slice(indent));
        } else if (body[body.length - 1] !== "" && !startsBlock(lines, i) && !ITEM.test(line)) {
          body.push(line.trim());
        } else {
          break;
        }
        i++;
      }
      while (body.length && !body[body.length - 1].trim()) body.pop();
      const item = el("li");
      renderBlocks(body, item, ctx);
      list.append(item);
    }
    parent.append(list);
    return i;
  }

  function parseLink(text, start) {
    let depth = 0;
    let k = start;
    for (; k < text.length; k++) {
      const ch = text[k];
      if (ch === "\\") {
        k++;
      } else if (ch === "[") {
        depth++;
      } else if (ch === "]") {
        depth--;
        if (depth === 0) break;
      }
    }
    if (k >= text.length || text[k + 1] !== "(") return null;
    const label = text.slice(start + 1, k);
    let p = k + 2;
    while (text[p] === " ") p++;
    let url = "";
    if (text[p] === "<") {
      const close = text.indexOf(">", p);
      if (close < 0) return null;
      url = text.slice(p + 1, close);
      p = close + 1;
    } else {
      const from = p;
      let parens = 0;
      for (; p < text.length; p++) {
        const ch = text[p];
        if (ch === "\\") {
          p++;
          continue;
        }
        if (/\s/.test(ch)) break;
        if (ch === "(") parens++;
        else if (ch === ")") {
          if (parens === 0) break;
          parens--;
        }
      }
      url = text.slice(from, p);
    }
    while (text[p] === " ") p++;
    if (text[p] === '"' || text[p] === "'") {
      const close = text.indexOf(text[p], p + 1);
      if (close < 0) return null;
      p = close + 1;
      while (text[p] === " ") p++;
    }
    if (text[p] !== ")") return null;
    return { label, url, end: p + 1 };
  }

  function parseEmphasis(text, i, ctx) {
    const ch = text[i];
    let run = 1;
    while (text[i + run] === ch) run++;
    if (ch === "~" ? run !== 2 : run > 3) return null;
    const after = text[i + run];
    if (!after || /\s/.test(after)) return null;
    if (ch === "_" && /[A-Za-z0-9]/.test(text[i - 1] || "")) return null;
    let from = i + run;
    for (;;) {
      const j = text.indexOf(ch, from);
      if (j < 0) return null;
      let end = j;
      while (text[end] === ch) end++;
      const closes =
        end - j === run &&
        !/\s/.test(text[j - 1]) &&
        !(ch === "_" && /[A-Za-z0-9]/.test(text[end] || ""));
      if (closes) {
        const inner = text.slice(i + run, j);
        let node;
        let target;
        if (ch === "~") {
          node = target = el("del");
        } else if (run === 1) {
          node = target = el("em");
        } else if (run === 2) {
          node = target = el("strong");
        } else {
          node = el("strong");
          target = el("em");
          node.append(target);
        }
        renderInline(inner, target, ctx);
        return { node, end };
      }
      from = end;
    }
  }

  function renderInline(text, parent, ctx) {
    let buffer = "";
    let group = null;
    const flush = () => {
      if (!buffer) return;
      parent.append(document.createTextNode(buffer));
      buffer = "";
    };
    const put = (node) => {
      flush();
      group = null;
      parent.append(node);
    };
    let i = 0;
    while (i < text.length) {
      const ch = text[i];

      if (ch === "`" || ch === "\\" || ch === "[") {
        CITE.lastIndex = i;
        const cite = CITE.exec(text);
        if (cite) {
          group = group || new Set();
          const badge = citeBadge(cite[1], ctx, group);
          i = CITE.lastIndex;
          if (badge) {
            flush();
            parent.append(badge);
          } else if (/[\s.,;:!?)]/.test(text[i] || " ")) {
            buffer = buffer.replace(/ +$/, "");
          }
          continue;
        }
      }

      if (ch === "\\" && ESCAPABLE.test(text[i + 1] || "")) {
        buffer += text[i + 1];
        group = null;
        i += 2;
        continue;
      }

      if (ch === "\n") {
        put(el("br"));
        i++;
        continue;
      }

      if (ch === "`") {
        let run = 1;
        while (text[i + run] === "`") run++;
        let close = -1;
        let p = i + run;
        while (p < text.length) {
          const j = text.indexOf("`", p);
          if (j < 0) break;
          let end = j;
          while (text[end] === "`") end++;
          if (end - j === run) {
            close = j;
            break;
          }
          p = end;
        }
        if (close < 0) {
          buffer += text.slice(i, i + run);
          i += run;
          continue;
        }
        let code = text.slice(i + run, close).replace(/\n/g, " ");
        if (code.length > 2 && code[0] === " " && code[code.length - 1] === " " && code.trim()) {
          code = code.slice(1, -1);
        }
        const node = el("code");
        node.textContent = code;
        put(node);
        i = close + run;
        continue;
      }

      if (ch === "<") {
        AUTOLINK.lastIndex = i;
        const auto = AUTOLINK.exec(text);
        if (auto) {
          const href = ctx.inLink ? "" : safeHttpsUrl(auto[1]);
          if (href) {
            const link = externalLink(href);
            link.textContent = auto[1];
            put(link);
          } else {
            buffer += auto[1];
          }
          i = AUTOLINK.lastIndex;
          continue;
        }
      }

      if (ch === "[" || (ch === "!" && text[i + 1] === "[")) {
        const image = ch === "!";
        const parsed = parseLink(text, image ? i + 1 : i);
        if (parsed) {
          const href = ctx.inLink ? "" : safeHttpsUrl(parsed.url.trim(), location.origin);
          const label = parsed.label.trim();
          if (href) {
            const link = externalLink(href);
            if (image || !label) link.textContent = label || href;
            else renderInline(label, link, Object.assign({}, ctx, { inLink: true }));
            put(link);
          } else if (label) {
            flush();
            group = null;
            renderInline(label, parent, ctx);
          }
          i = parsed.end;
          continue;
        }
      }

      if (ch === "h" && !ctx.inLink && text.startsWith("https://", i) && !/[A-Za-z0-9]/.test(text[i - 1] || "")) {
        BARE_URL.lastIndex = i;
        const bare = BARE_URL.exec(text);
        if (bare) {
          let url = bare[0].replace(/[.,;:!?'"*_~]+$/, "");
          while (url.endsWith(")") && url.split("(").length < url.split(")").length) url = url.slice(0, -1);
          const href = safeHttpsUrl(url);
          if (href) {
            const link = externalLink(href);
            link.textContent = url;
            put(link);
            i += url.length;
            continue;
          }
        }
      }

      if (ch === "*" || ch === "_" || ch === "~") {
        const emphasis = parseEmphasis(text, i, ctx);
        if (emphasis) {
          put(emphasis.node);
          i = emphasis.end;
          continue;
        }
        let run = 1;
        while (text[i + run] === ch) run++;
        buffer += text.slice(i, i + run);
        group = null;
        i += run;
        continue;
      }

      buffer += ch;
      if (ch.trim()) group = null;
      i++;
    }
    flush();
  }

  function citeBadge(number, ctx, group) {
    if (!ctx.sources) {
      if (group.has(number)) return null;
      group.add(number);
      const pending = el("span", "graphify-ask-cite is-pending");
      pending.textContent = number;
      pending.setAttribute("aria-label", "Source " + number);
      return pending;
    }
    const entry = ctx.sources.byId.get("C" + number);
    if (!entry || group.has(entry)) return null;
    group.add(entry);
    const badge = entry.href ? externalLink(entry.href, "graphify-ask-cite") : el("span", "graphify-ask-cite");
    badge.textContent = String(entry.n);
    badge.title = entry.label;
    badge.setAttribute("aria-label", "Source " + entry.n + ": " + entry.label);
    return badge;
  }

  function sourceLabel(title, href) {
    const name = (title || "").replace(/^\s*Graphify Docs:\s*/i, "").replace(/\s+/g, " ").trim();
    let url = null;
    try {
      url = href ? new URL(href) : null;
    } catch {
      url = null;
    }
    const host = url ? url.hostname.replace(/^www\./, "") : "";
    const path = url ? url.pathname.split("/").filter(Boolean) : [];
    const squash = (value) => value.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (path.length && (!name || squash(name) === squash(path.join("")))) {
      return { label: path.join(" › "), host };
    }
    return { label: name || host, host };
  }

  function indexSources(sources) {
    const list = [];
    const byId = new Map();
    const byKey = new Map();
    for (const source of sources) {
      const href = safeHttpsUrl(source.url);
      const { label, host } = sourceLabel(source.title, href);
      if (!label) continue;
      const key = (href ? href.replace(/#.*$/, "") : label).toLowerCase();
      let entry = byKey.get(key);
      if (!entry) {
        entry = { n: list.length + 1, href, label, host };
        byKey.set(key, entry);
        list.push(entry);
      }
      if (source.id) byId.set(source.id.toUpperCase(), entry);
    }
    return { list, byId };
  }

  function addUserTurn(text) {
    const item = el("article", "graphify-ask-turn graphify-ask-turn-user");
    item.setAttribute("aria-label", "You");
    const body = el("p", "graphify-ask-text");
    body.textContent = text;
    item.append(body);
    log.append(item);
    log.scrollTop = log.scrollHeight;
  }

  function addAssistantTurn() {
    const item = el("article", "graphify-ask-turn graphify-ask-turn-assistant");
    item.setAttribute("aria-label", "Ask Graphify");
    const who = el("p", "graphify-ask-who");
    const name = el("span");
    name.textContent = "Graphify";
    who.append(logoAvatar(), name);
    const status = el("p", "graphify-ask-status");
    status.textContent = "Graphifying";
    const body = el("div", "graphify-ask-md");
    body.setAttribute("aria-busy", "true");
    item.append(who, status, body);
    log.append(item);
    log.scrollTop = log.scrollHeight;
    return { item, status, body, raw: "", sources: [], index: null, frame: 0 };
  }

  function nearBottom() {
    return log.scrollHeight - log.scrollTop - log.clientHeight < 48;
  }

  function paint(turn) {
    const stick = nearBottom();
    turn.body.replaceChildren(renderMarkdown(turn.raw, { sources: turn.index }));
    if (stick) log.scrollTop = log.scrollHeight;
  }

  function schedulePaint(turn) {
    if (turn.frame) return;
    turn.frame = requestAnimationFrame(() => {
      turn.frame = 0;
      paint(turn);
    });
  }

  function showNotice(turn, text) {
    if (turn.frame) cancelAnimationFrame(turn.frame);
    turn.frame = 0;
    turn.status.remove();
    turn.raw = "";
    const notice = el("p", "graphify-ask-notice");
    notice.textContent = text;
    turn.body.replaceChildren(notice);
  }

  function plainAnswer(turn) {
    const { list, byId } = turn.index;
    const body = turn.raw.replace(/ ?(?:[`\\]?\[C\d+\]`?)+/g, (group) => {
      const seen = [];
      for (const match of group.matchAll(/C(\d+)/g)) {
        const entry = byId.get("C" + match[1]);
        if (entry && !seen.includes(entry.n)) seen.push(entry.n);
      }
      return seen.length ? " " + seen.map((n) => "[" + n + "]").join("") : "";
    });
    if (!list.length) return body.trim();
    const cited = list.map((entry) => "[" + entry.n + "] " + entry.label + (entry.href ? ": " + entry.href : ""));
    return body.trim() + "\n\nSources\n" + cited.join("\n");
  }

  function finishTurn(turn) {
    const stick = nearBottom();
    if (turn.frame) cancelAnimationFrame(turn.frame);
    turn.frame = 0;
    turn.status.remove();
    turn.body.setAttribute("aria-busy", "false");
    if (!turn.raw.trim()) {
      if (!turn.body.childElementCount) showNotice(turn, "Ask Graphify did not return an answer.");
      return;
    }
    turn.index = indexSources(turn.sources);
    paint(turn);
    if (turn.index.list.length) {
      const block = el("div", "graphify-ask-sources");
      const label = el("p", "graphify-ask-sources-label");
      label.textContent = "Sources";
      const list = el("ol");
      for (const entry of turn.index.list) {
        const row = el("li");
        const card = entry.href ? externalLink(entry.href, "graphify-ask-source") : el("div", "graphify-ask-source");
        const number = el("span", "graphify-ask-source-n");
        number.textContent = String(entry.n);
        const text = el("span", "graphify-ask-source-text");
        const name = el("span", "graphify-ask-source-name");
        name.textContent = entry.label;
        text.append(name);
        if (entry.host) {
          const host = el("span", "graphify-ask-source-host");
          host.textContent = entry.host;
          text.append(host);
        }
        card.append(number, text);
        if (entry.href) {
          const arrow = el("span", "graphify-ask-source-arrow");
          arrow.setAttribute("aria-hidden", "true");
          arrow.textContent = "↗";
          card.append(arrow);
        }
        row.append(card);
        list.append(row);
      }
      block.append(label, list);
      turn.item.append(block);
    }
    const actions = el("div", "graphify-ask-actions");
    actions.append(copyButton(() => plainAnswer(turn), "Copy answer", "Copy answer"));
    turn.item.append(actions);
    if (stick) log.scrollTop = log.scrollHeight;
  }

  function setBusy(busy) {
    input.disabled = busy;
    submit.disabled = busy;
    panel.classList.toggle("is-busy", busy);
    starters.querySelectorAll("button").forEach((button) => {
      button.disabled = busy;
    });
    submit.textContent = busy ? "Sending" : "Send";
  }

  function openPanel() {
    lastFocus = document.activeElement;
    panel.hidden = false;
    launcher.hidden = true;
    requestAnimationFrame(() => panel.classList.add("is-open"));
    input.focus();
  }

  function closePanel() {
    panel.classList.remove("is-open");
    panel.hidden = true;
    launcher.hidden = false;
    if (inflight) inflight.abort();
    if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
  }

  launcher.addEventListener("click", openPanel);
  close.addEventListener("click", closePanel);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !panel.hidden) closePanel();
  });

  function fitInput() {
    input.style.height = "auto";
    input.style.height = Math.min(input.scrollHeight, 120) + "px";
  }

  input.addEventListener("input", fitInput);
  input.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" || event.shiftKey || event.altKey || event.isComposing || event.keyCode === 229) return;
    const command = event.metaKey || event.ctrlKey;
    if (coarse && !command) return;
    event.preventDefault();
    if (typeof form.requestSubmit === "function") form.requestSubmit();
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const question = input.value.trim();
    if (!question || inflight) return;
    input.value = "";
    fitInput();
    send(question);
  });

  async function send(question) {
    const text = question.trim().slice(0, MAX_CHARS);
    if (!text || inflight) return;
    starters.hidden = true;
    addUserTurn(text);
    const turn = addAssistantTurn();
    setBusy(true);
    const controller = new AbortController();
    inflight = controller;
    try {
      const response = await fetch(ENDPOINT, {
        method: "POST",
        credentials: "omit",
        headers: { "content-type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          id: sessionId,
          messages: [{ role: "user", id: "m1", parts: [{ type: "text", text }] }],
        }),
      });
      if (!response.ok || !response.body) {
        showNotice(turn, "Ask Graphify is unavailable right now.");
        return;
      }
      await readStream(response.body, turn);
    } catch (error) {
      if (!(error && error.name === "AbortError")) {
        showNotice(turn, "Ask Graphify is unavailable right now.");
      } else if (!turn.raw) {
        showNotice(turn, "Stopped.");
      }
    } finally {
      finishTurn(turn);
      if (inflight === controller) inflight = null;
      setBusy(false);
    }
  }

  async function readStream(body, turn) {
    const reader = body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      let sep;
      while ((sep = buffer.indexOf("\n\n")) !== -1) {
        const frame = buffer.slice(0, sep);
        buffer = buffer.slice(sep + 2);
        applyFrame(frame, turn);
      }
    }
  }

  function applyFrame(frame, turn) {
    let data = "";
    for (const line of frame.split("\n")) {
      if (line.startsWith("data:")) data += line.slice(5).trim();
    }
    if (!data || data === "[DONE]") return;
    let event;
    try {
      event = JSON.parse(data);
    } catch {
      return;
    }
    if (event.type === "text-delta" && typeof event.delta === "string") {
      if (!turn.raw) turn.status.remove();
      turn.raw += event.delta;
      schedulePaint(turn);
    } else if (event.type === "data-step" && !turn.raw && event.data && typeof event.data.message === "string") {
      turn.status.textContent = event.data.message.slice(0, 80);
    } else if (event.type === "error") {
      showNotice(turn, "Ask Graphify could not answer that.");
    } else if (event.type === "source-url" && typeof event.url === "string") {
      turn.sources.push({
        id: typeof event.sourceId === "string" ? event.sourceId : "",
        url: event.url,
        title: typeof event.title === "string" ? event.title : "",
      });
    }
  }
})();
