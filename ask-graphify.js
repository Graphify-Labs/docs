/* Ask Graphify on the docs site.
   The browser talks only to https://graphify.com/api/assistant.
   Atlas and the model key stay on that server. */
(() => {
  if (window.__graphifyAskInitialized) return;
  window.__graphifyAskInitialized = true;

  const ENDPOINT = "https://graphify.com/api/assistant";
  const MAX_CHARS = 2000;
  const STARTERS = [
    "How do I install Graphify?",
    "What is the package name?",
    "How do I connect Cursor?",
  ];

  const root = document.createElement("div");
  root.className = "graphify-ask";

  const launcher = document.createElement("button");
  launcher.type = "button";
  launcher.className = "graphify-ask-launcher";
  const mark = document.createElement("span");
  mark.className = "graphify-ask-mark";
  mark.setAttribute("aria-hidden", "true");
  const launcherLabel = document.createElement("span");
  launcherLabel.textContent = "Ask Graphify";
  launcher.append(mark, launcherLabel);

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
  const close = document.createElement("button");
  close.type = "button";
  close.className = "graphify-ask-close";
  close.setAttribute("aria-label", "Close Ask Graphify");
  const bar = document.createElement("span");
  bar.className = "graphify-ask-bar";
  bar.setAttribute("aria-hidden", "true");
  head.append(heading, close, bar);

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

  const form = document.createElement("form");
  form.className = "graphify-ask-form";
  const input = document.createElement("textarea");
  input.name = "question";
  input.maxLength = MAX_CHARS;
  input.rows = 2;
  input.required = true;
  input.setAttribute("aria-label", "Question for Ask Graphify");
  input.placeholder = "Ask about these docs";
  const submit = document.createElement("button");
  submit.type = "submit";
  submit.textContent = "Send";
  form.append(input, submit);

  panel.append(head, log, starters, form);
  root.append(launcher, panel);
  document.body.append(root);

  let sessionId = "";
  let inflight = null;
  let lastFocus = null;

  function newSession() {
    const raw = crypto.randomUUID().replace(/-/g, "");
    sessionId = raw.slice(0, 32);
  }
  newSession();

  function safeHttpsUrl(value) {
    try {
      const url = new URL(value);
      if (url.protocol !== "https:") return "";
      if (url.username || url.password) return "";
      return url.href;
    } catch {
      return "";
    }
  }

  function addMessage(role, text) {
    const item = document.createElement("article");
    item.className = "graphify-ask-turn graphify-ask-turn-" + role;
    item.setAttribute("aria-label", role === "user" ? "You" : "Ask Graphify");
    if (role === "assistant") {
      const who = document.createElement("p");
      who.className = "graphify-ask-who";
      who.textContent = "Graphify";
      item.append(who);
    }
    const body = document.createElement("p");
    body.className = "graphify-ask-text";
    body.textContent = text;
    item.append(body);
    log.append(item);
    log.scrollTop = log.scrollHeight;
    return body;
  }

  function addSources(parent, sources) {
    if (!sources.length) return;
    const list = document.createElement("ul");
    list.className = "graphify-ask-sources";
    for (const source of sources) {
      const href = safeHttpsUrl(source.url);
      if (!href) continue;
      const li = document.createElement("li");
      const link = document.createElement("a");
      link.href = href;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = source.title || href;
      li.append(link);
      list.append(li);
    }
    if (!list.childElementCount) return;
    const label = document.createElement("p");
    label.className = "graphify-ask-sources-label";
    label.textContent = "Sources";
    parent.append(label, list);
    log.scrollTop = log.scrollHeight;
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

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const question = input.value.trim();
    if (!question) return;
    input.value = "";
    send(question);
  });

  async function send(question) {
    const text = question.trim().slice(0, MAX_CHARS);
    if (!text || inflight) return;
    starters.hidden = true;
    addMessage("user", text);
    const answer = addMessage("assistant", "");
    const sources = [];
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
        answer.textContent = "Ask Graphify is unavailable right now.";
        return;
      }
      await readStream(response.body, answer, sources);
      if (!answer.textContent) answer.textContent = "Ask Graphify did not return an answer.";
      addSources(answer.parentElement, sources);
    } catch (error) {
      if (error && error.name === "AbortError") return;
      answer.textContent = "Ask Graphify is unavailable right now.";
    } finally {
      if (inflight === controller) inflight = null;
      setBusy(false);
    }
  }

  async function readStream(body, answer, sources) {
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
        applyFrame(frame, answer, sources);
      }
    }
  }

  function applyFrame(frame, answer, sources) {
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
      answer.textContent += event.delta;
      log.scrollTop = log.scrollHeight;
    } else if (event.type === "error") {
      answer.textContent = "Ask Graphify could not answer that.";
    } else if (event.type === "source-url" && typeof event.url === "string") {
      sources.push({ url: event.url, title: typeof event.title === "string" ? event.title : "" });
    }
  }
})();
