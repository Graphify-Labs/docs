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

export const HeroInstall = () => {
  const agents = [
    {
      id: "claude-code",
      name: "Claude Code",
      logo: "/images/logos/claude-code.svg",
      code: "claude mcp add --transport http graphify https://api.graphify.com/mcp",
    },
    {
      id: "cursor",
      name: "Cursor",
      logo: "/images/logos/cursor-light.svg",
      logoDark: "/images/logos/cursor-dark.svg",
      code: "/add-plugin graphify",
    },
    {
      id: "codex",
      name: "Codex",
      logo: "/images/logos/codex.png",
      code: "codex mcp add graphify --url https://api.graphify.com/mcp\ncodex mcp login graphify",
    },
    {
      id: "opencode",
      name: "OpenCode",
      logo: "/images/logos/opencode-light.svg",
      logoDark: "/images/logos/opencode-dark.svg",
      code: "opencode mcp add graphify --url https://api.graphify.com/mcp",
    },
    {
      id: "antigravity",
      name: "Antigravity",
      logo: "/images/logos/antigravity.png",
      code: "https://api.graphify.com/mcp",
    },
  ];
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
                  <img src={ag.logo} alt="" width="16" height="16" className={ag.logoDark ? "gfy-agent-logo gfy-logo-light" : "gfy-agent-logo"} noZoom />
                  {ag.logoDark ? <img src={ag.logoDark} alt="" width="16" height="16" className="gfy-agent-logo gfy-logo-dark" noZoom /> : null}
                </button>
              ))}
              <a href="/integrations/overview" className="gfy-agent gfy-agent-more" aria-label="Other agents" data-tip="Other agents">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
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
