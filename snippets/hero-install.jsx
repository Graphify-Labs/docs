export const CopyButton = ({ text, label }) => {
  const [copied, setCopied] = useState(false);
  const onCopy = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1600);
      });
    }
  };
  return (
    <button type="button" className="gfy-copy" onClick={onCopy} aria-label={label}>
      {copied ? "Copied" : "Copy"}
    </button>
  );
};

export const graphifyAgents = () => [
  {
    id: "claude-code",
    name: "Claude Code",
    logo: "/images/logos/claude-code.svg",
    code: "claude mcp add --transport http graphify https://api.graphify.com/mcp",
    setup: {
      sub: "Run in terminal",
      line: "Run this in a terminal to add the Graphify server.",
      after: "Then run `/mcp` in Claude Code, select `graphify` and choose Authenticate.",
    },
  },
  {
    id: "cursor",
    name: "Cursor",
    logo: "/images/logos/cursor-light.svg",
    logoDark: "/images/logos/cursor-dark.svg",
    code: "/add-plugin graphify",
    setup: {
      sub: "Install plugin",
      line: "Type this in a Cursor agent chat to install the Graphify plugin.",
    },
  },
  {
    id: "codex",
    name: "Codex",
    logo: "/images/logos/codex.png",
    code: "codex mcp add graphify --url https://api.graphify.com/mcp\ncodex mcp login graphify",
    setup: {
      name: "ChatGPT and Codex",
      logo: "/images/logos/codex-light.svg",
      logoDark: "/images/logos/codex-dark.svg",
      sub: "One click",
      line: "Install the Graphify plugin from the OpenAI plugin directory, then connect your Graphify account.",
      button: { label: "Add to ChatGPT and Codex", href: "https://chatgpt.com/plugins/plugin_asdk_app_6abe89f7f5d88191b9422522bb8562a4" },
      code: "",
      after: "Then start a new Codex session and run `/mcp` to check that `graphify` is listed.",
    },
  },
  {
    id: "opencode",
    name: "OpenCode",
    logo: "/images/logos/opencode-light.svg",
    logoDark: "/images/logos/opencode-dark.svg",
    code: "opencode mcp add graphify --url https://api.graphify.com/mcp\nopencode mcp auth graphify",
    setup: {
      sub: "Run in terminal",
      line: "Run these in your project. The second command signs you in through the browser.",
    },
  },
  {
    id: "antigravity",
    name: "Antigravity",
    logo: "/images/logos/antigravity.png",
    code: "{\n  \"mcpServers\": {\n    \"graphify\": {\n      \"serverUrl\": \"https://api.graphify.com/mcp\"\n    }\n  }\n}",
    setup: {
      sub: "Copy config",
      line: "Add this to Antigravity's `mcp_config.json`.",
      after: "Then sign in with OAuth in the browser when Antigravity connects.",
    },
  },
];

export const HeroInstall = () => {
  const agents = graphifyAgents();
  const tabs = [
    { id: "mcp", label: "Hosted MCP" },
    {
      id: "prompt",
      label: "Agent prompt",
      code: "Set up Graphify for me. Fetch https://docs.graphify.com/for-agents.md and follow it.",
    },
  ];
  const [active, setActive] = useState(0);
  const [agent, setAgent] = useState(0);
  const select = (i, focus) => {
    const n = (i + tabs.length) % tabs.length;
    setActive(n);
    if (focus && typeof document !== "undefined") {
      const el = document.getElementById("gfy-tab-" + tabs[n].id);
      if (el) el.focus();
    }
  };
  const onKeyDown = (e) => {
    if (e.key === "ArrowRight") { e.preventDefault(); select(active + 1, true); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); select(active - 1, true); }
    else if (e.key === "Home") { e.preventDefault(); select(0, true); }
    else if (e.key === "End") { e.preventDefault(); select(tabs.length - 1, true); }
  };
  const t = tabs[active];
  const isMcp = t.id === "mcp";
  const a = agents[agent];
  const code = isMcp ? a.code : t.code;
  const copyLabel = isMcp ? "Copy " + a.name + " setup" : "Copy " + t.label;
  return (
    <div className="gfy-snippet">
      <div className="gfy-snippet-bar">
        <div role="tablist" aria-label="Ways to install Graphify" className="gfy-tablist" onKeyDown={onKeyDown}>
          {tabs.map((tab, i) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              id={"gfy-tab-" + tab.id}
              aria-selected={i === active}
              aria-controls={"gfy-panel-" + tab.id}
              tabIndex={i === active ? 0 : -1}
              className="gfy-tab"
              onClick={() => select(i, false)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="gfy-bar-actions">
          {isMcp ? (
            <div role="group" aria-label="Choose your agent" className="gfy-agents">
              {agents.map((ag, i) => (
                <button
                  key={ag.id}
                  type="button"
                  className="gfy-agent"
                  aria-label={ag.name}
                  aria-pressed={i === agent}
                  data-tip={ag.name}
                  onClick={() => setAgent(i)}
                >
                  <img src={ag.logo} alt="" width="18" height="18" className={ag.logoDark ? "gfy-agent-logo gfy-logo-light" : "gfy-agent-logo"} noZoom />
                  {ag.logoDark ? <img src={ag.logoDark} alt="" width="18" height="18" className="gfy-agent-logo gfy-logo-dark" noZoom /> : null}
                </button>
              ))}
              <a href="/integrations/overview" className="gfy-agent gfy-agent-more" aria-label="Other agents" data-tip="Other agents">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
              </a>
            </div>
          ) : null}
          <CopyButton text={code} label={copyLabel} />
        </div>
      </div>
      <div role="tabpanel" id={"gfy-panel-" + t.id} aria-labelledby={"gfy-tab-" + t.id} tabIndex={0} className="gfy-panel">
        <pre className="gfy-pre"><code>{code.split("\n").map((line, i) => (<span key={i} className="gfy-line">{line}</span>))}</code></pre>
      </div>
    </div>
  );
};

export const PromptBlock = ({ text }) => {
  const [copied, setCopied] = useState(false);
  const onCopy = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1600);
      });
    }
  };
  return (
    <div className="gfy-snippet">
      <div className="gfy-snippet-bar">
        <span className="gfy-snippet-title">Prompt for your coding agent</span>
        <button type="button" className="gfy-copy" onClick={onCopy} aria-label="Copy prompt for your coding agent">
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <div className="gfy-panel">
        <pre className="gfy-pre"><code>{text}</code></pre>
      </div>
    </div>
  );
};

export const SetupBox = () => {
  const order = ["codex", "claude-code", "cursor", "opencode", "antigravity"];
  const all = graphifyAgents();
  const clients = order.map((id) => {
    const a = all.find((x) => x.id === id);
    const st = a.setup || {};
    return {
      id: a.id,
      name: st.name || a.name,
      logo: st.logo || a.logo,
      logoDark: st.logo ? st.logoDark : a.logoDark,
      sub: st.sub,
      line: st.line,
      after: st.after,
      button: st.button,
      code: st.code !== undefined ? st.code : a.code,
    };
  });
  const endpoint = "https://api.graphify.com/mcp";
  const [active, setActive] = useState(0);
  const select = (i, focus) => {
    const n = (i + clients.length) % clients.length;
    setActive(n);
    if (focus && typeof document !== "undefined") {
      const el = document.getElementById("gfy-setup-tab-" + clients[n].id);
      if (el) el.focus();
    }
  };
  const onKeyDown = (e) => {
    if (e.key === "ArrowRight") { e.preventDefault(); select(active + 1, true); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); select(active - 1, true); }
    else if (e.key === "Home") { e.preventDefault(); select(0, true); }
    else if (e.key === "End") { e.preventDefault(); select(clients.length - 1, true); }
  };
  const c = clients[active];
  const rich = (text) => text.split("`").map((part, i) => (i % 2 === 1 ? <code key={i} className="gfy-setup-inline">{part}</code> : part));
  return (
    <div className="gfy-setup not-prose">
      <div className="gfy-setup-head">
        <div>
          <p className="gfy-setup-title">Set up Graphify MCP</p>
          <p className="gfy-setup-sub">Sign in with OAuth</p>
        </div>
        <a href="/platform/graphify-mcp" className="gfy-setup-all">See all setup options <span aria-hidden="true">→</span></a>
      </div>
      <div role="tablist" aria-label="Choose your coding agent" className="gfy-setup-tabs" onKeyDown={onKeyDown}>
        {clients.map((cl, i) => (
          <button
            key={cl.id}
            type="button"
            role="tab"
            id={"gfy-setup-tab-" + cl.id}
            aria-selected={i === active}
            aria-controls={"gfy-setup-panel-" + cl.id}
            tabIndex={i === active ? 0 : -1}
            className="gfy-setup-tab"
            onClick={() => select(i, false)}
          >
            <span className="gfy-setup-icon">
              <img src={cl.logo} alt="" width="20" height="20" className={cl.logoDark ? "gfy-setup-logo gfy-logo-light" : "gfy-setup-logo"} noZoom />
              {cl.logoDark ? <img src={cl.logoDark} alt="" width="20" height="20" className="gfy-setup-logo gfy-logo-dark" noZoom /> : null}
            </span>
            <span className="gfy-setup-tabtext">
              <span className="gfy-setup-name">{cl.name}</span>
              <span className="gfy-setup-tabsub">{cl.sub}</span>
            </span>
          </button>
        ))}
      </div>
      <div role="tabpanel" id={"gfy-setup-panel-" + c.id} aria-labelledby={"gfy-setup-tab-" + c.id} className="gfy-setup-panel">
        <p className="gfy-setup-line">{rich(c.line)}</p>
        {c.button ? (
          <a href={c.button.href} target="_blank" rel="noopener noreferrer" className="gfy-setup-button" aria-label={c.button.label + " (opens in a new tab)"}>
            {c.button.label} <span aria-hidden="true">→</span>
          </a>
        ) : null}
        {c.code ? (
          <div className="gfy-setup-code">
            <pre className="gfy-pre"><code>{c.code.split("\n").map((line, i) => (<span key={i} className="gfy-line">{line}</span>))}</code></pre>
            <CopyButton text={c.code} label={"Copy " + c.name + " setup"} />
          </div>
        ) : null}
        {c.after ? <p className="gfy-setup-after">{rich(c.after)}</p> : null}
      </div>
      <div className="gfy-setup-foot">
        <span>Using another MCP client? Point it at:</span>
        <div className="gfy-setup-url">
          <code>{endpoint}</code>
          <CopyButton text={endpoint} label="Copy the Graphify MCP URL" />
        </div>
      </div>
    </div>
  );
};
