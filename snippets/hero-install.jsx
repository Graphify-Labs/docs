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
  const tabs = [
    {
      id: "mcp",
      label: "Hosted MCP",
      code: "claude mcp add --transport http --scope user \\\n  graphify https://api.graphify.com/mcp",
    },
    {
      id: "prompt",
      label: "Agent prompt",
      code: "Set up Graphify for me. Fetch https://docs.graphify.com/for-agents.md and follow it.",
    },
    {
      id: "local",
      label: "Local CLI",
      code: "uv tool install graphifyy\ngraphify install\n# then, in your assistant chat:\n/graphify .",
    },
  ];
  const [active, setActive] = useState(0);
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
        <CopyButton text={t.code} label={"Copy " + t.label} />
      </div>
      <div role="tabpanel" id={"gfy-panel-" + t.id} aria-labelledby={"gfy-tab-" + t.id} tabIndex={0} className="gfy-panel">
        <pre className="gfy-pre"><code>{t.code}</code></pre>
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
