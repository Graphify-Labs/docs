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
    <button type="button" className={copied ? "gfy-copy is-copied" : "gfy-copy"} onClick={onCopy} aria-label={label}>
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
      line: "Connect Graphify in Claude, or run the command below for a direct MCP connection.",
      button: { label: "Add to Claude", href: "https://claude.ai/directory/graphify", icon: "/images/logos/claude-code.svg" },
      shell: true,
      hint: "Then enter `/mcp` in Claude Code, select **graphify** and choose **Authenticate**.",
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
      line: "Install the Graphify plugin, or type the command below in a Cursor agent chat.",
      button: { label: "Add to Cursor", href: "https://cursor.com/marketplace/graphify", icon: "/images/logos/cursor-light.svg", iconDark: "/images/logos/cursor-dark.svg" },
      hint: "The plugin adds the Graphify MCP server and a rule for when to use it.",
    },
  },
  {
    id: "codex",
    name: "Codex",
    logo: "/images/logos/codex.png",
    code: "codex mcp add graphify --url https://api.graphify.com/mcp\ncodex mcp login graphify",
    setup: {
      name: "ChatGPT and Codex",
      sub: "Install plugin",
      line: "Install the Graphify plugin, or run the command below for a direct MCP connection.",
      button: { label: "Add to ChatGPT and Codex", href: "https://chatgpt.com/plugins/plugin_asdk_app_6abe89f7f5d88191b9422522bb8562a4", icon: "/images/logos/codex.png" },
      shell: true,
      hint: "Then enter `/mcp` in Codex CLI and confirm **graphify** is connected.",
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
      line: "Run this in your project to add Graphify as a remote MCP server and sign in.",
      shell: true,
      hint: "Then run `opencode mcp list` and confirm **graphify** is connected.",
    },
  },
  {
    id: "antigravity",
    name: "Antigravity",
    logo: "/images/logos/antigravity.png",
    code: "{\n  \"mcpServers\": {\n    \"graphify\": {\n      \"serverUrl\": \"https://api.graphify.com/mcp\"\n    }\n  }\n}",
    setup: {
      sub: "Copy config",
      line: "Add this remote server to your Antigravity configuration.",
      file: "mcp_config.json",
      hint: "Save the file, then sign in with OAuth in the browser when Antigravity connects.",
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
        <button type="button" className={copied ? "gfy-copy is-copied" : "gfy-copy"} onClick={onCopy} aria-label="Copy prompt for your coding agent">
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <div className="gfy-panel">
        <pre className="gfy-pre"><code>{text}</code></pre>
      </div>
    </div>
  );
};


export const SetupCopy = ({ text, label }) => {
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
    <button type="button" className={copied ? "gfy-mcp-copy is-copied" : "gfy-mcp-copy"} onClick={onCopy} aria-label={label}>
      {copied ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 12.5l5 5L20 6.5" /></svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="8.5" y="8.5" width="13" height="13" rx="2" /><path d="M15.5 4.5V4a1.5 1.5 0 0 0-1.5-1.5H4A1.5 1.5 0 0 0 2.5 4v10A1.5 1.5 0 0 0 4 15.5h.5" /></svg>
      )}
      <span>{copied ? "Copied" : "Copy"}</span>
    </button>
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
      logo: a.logo,
      logoDark: a.logoDark,
      sub: st.sub,
      line: st.line,
      hint: st.hint,
      button: st.button,
      shell: st.shell,
      file: st.file,
      code: st.file ? a.code : a.code.split("\n").join(" && "),
    };
  });
  const endpoint = "https://api.graphify.com/mcp";
  const [active, setActive] = useState(0);
  const select = (i, focus) => {
    const n = (i + clients.length) % clients.length;
    setActive(n);
    if (focus && typeof document !== "undefined") {
      const el = document.getElementById("gfy-mcp-tab-" + clients[n].id);
      if (el) el.focus();
    }
  };
  const onKeyDown = (e) => {
    if (e.key === "ArrowRight") { e.preventDefault(); select(active + 1, true); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); select(active - 1, true); }
    else if (e.key === "Home") { e.preventDefault(); select(0, true); }
    else if (e.key === "End") { e.preventDefault(); select(clients.length - 1, true); }
  };
  const rich = (text) => text.split("`").map((part, i) => {
    if (i % 2 === 1) return <code key={i}>{part}</code>;
    return part.split("**").map((bit, j) => (j % 2 === 1 ? <strong key={i + "-" + j}>{bit}</strong> : bit));
  });
  const logoImgs = (src, dark, size, cls) => [
    <img key="l" src={src} alt="" width={size} height={size} className={dark ? cls + " gfy-logo-light" : cls} noZoom />,
    dark ? <img key="d" src={dark} alt="" width={size} height={size} className={cls + " gfy-logo-dark"} noZoom /> : null,
  ];
  const arrow = (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4.5 12h15" /><path d="M13.5 6l6 6-6 6" /></svg>);
  const corner = (pos) => (<svg key={pos} className={"gfy-mcp-corner gfy-mcp-corner-" + pos} viewBox="0 0 11 11" aria-hidden="true"><path d="M0 0H11V1H7A6 6 0 0 0 1 7V11H0Z" /></svg>);
  const c = clients[active];
  return (
    <section className="gfy-mcp not-prose" aria-labelledby="gfy-mcp-heading">
      {["tl", "tr", "bl", "br"].map(corner)}
      <div className="gfy-mcp-head">
        <div>
          <h3 id="gfy-mcp-heading">Set up Graphify MCP</h3>
          <p>Sign in with OAuth.</p>
        </div>
        <a href="/platform/graphify-mcp" className="gfy-mcp-all">See all setup options {arrow}</a>
      </div>
      <div role="tablist" aria-label="Choose an MCP client" className="gfy-mcp-tabs" onKeyDown={onKeyDown}>
        {clients.map((cl, i) => (
          <button
            key={cl.id}
            type="button"
            role="tab"
            id={"gfy-mcp-tab-" + cl.id}
            aria-selected={i === active}
            aria-controls={"gfy-mcp-panel-" + cl.id}
            tabIndex={i === active ? 0 : -1}
            className="gfy-mcp-tab"
            onClick={() => select(i, false)}
          >
            {logoImgs(cl.logo, cl.logoDark, 26, "gfy-mcp-icon")}
            <span className="gfy-mcp-tabtext">
              <strong>{cl.name}</strong>
              <span>{cl.sub}</span>
            </span>
          </button>
        ))}
      </div>
      <div role="tabpanel" id={"gfy-mcp-panel-" + c.id} aria-labelledby={"gfy-mcp-tab-" + c.id} className="gfy-mcp-panel">
        <p className="gfy-mcp-desc">{c.line}</p>
        {c.button ? (
          <a href={c.button.href} target="_blank" rel="noopener noreferrer" className="gfy-mcp-button">
            {logoImgs(c.button.icon, c.button.iconDark, 18, "gfy-mcp-button-icon")}
            {c.button.label} {arrow}
          </a>
        ) : null}
        {c.file ? (
          <div className="gfy-mcp-file">
            <div className="gfy-mcp-file-head">
              <span>{c.file}</span>
              <SetupCopy text={c.code} label={"Copy " + c.file} />
            </div>
            <pre><code>{c.code}</code></pre>
          </div>
        ) : (
          <div className="gfy-mcp-row">
            <div className="gfy-mcp-scroll" tabIndex={0}>
              {c.shell ? <span className="gfy-mcp-prompt" aria-hidden="true">$</span> : null}
              <code>{c.code}</code>
            </div>
            <SetupCopy text={c.code} label={"Copy the " + c.name + " command"} />
          </div>
        )}
        {c.hint ? <p className="gfy-mcp-hint">{rich(c.hint)}</p> : null}
      </div>
      <div className="gfy-mcp-foot">
        <p>Using another MCP client? Point it at:</p>
        <div className="gfy-mcp-row">
          <div className="gfy-mcp-scroll" tabIndex={0}>
            <code>{endpoint}</code>
          </div>
          <SetupCopy text={endpoint} label="Copy the Graphify MCP URL" />
        </div>
      </div>
    </section>
  );
};
