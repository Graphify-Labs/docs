// FAQPage structured data for platform/support/faqs.mdx.
// Each entry is the plain text of one accordion on that page, in the same order.
// When you edit a question or answer there, edit it here too.
export const FaqSchema = () => {
  const faqs = [
    {
      "q": "What is the difference between Graphify and Graphify CLI?",
      "a": "Graphify is hosted: it indexes your GitHub or GitLab repositories, rebuilds on each push to the default branch, reviews pull requests, and serves every repository through one MCP connection. Open-source Graphify is the free graphifyy package. It builds a graph on your machine, with no account. See Move from Graphify CLI to switch."
    },
    {
      "q": "Which code hosts does Graphify support?",
      "a": "GitHub and GitLab. Connect them from Repositories. GitHub Enterprise is part of Enterprise. A project that is only on your machine needs open-source Graphify."
    },
    {
      "q": "Do I need a card to start?",
      "a": "No. The Free plan (up to 3 repositories) needs no card. Pro and Teams start with a 14-day trial, card required. See Plans and pricing."
    },
    {
      "q": "Which branch does Graphify index?",
      "a": "The default branch. A push to another branch, or a pull request, does not change the repository graph. Pull requests get their own review against that graph."
    },
    {
      "q": "Graphify shows no graph for my repository",
      "a": "Open Repositories and read the status. Indexed: A graph is built and available. Building: Indexing is running. Queued: The repository is waiting to build. Failed: The latest attempt did not finish. Paused: Indexing is off. Switch it on in the repository’s Options. See Repositories and builds."
    },
    {
      "q": "A build failed. How do I retry it?",
      "a": "Open Builds, filter to the repository, and choose Retry on the latest failed build. On Repositories, a failed repository’s Options also offer Retry indexing. Both index the current head of the default branch, not the commit that failed."
    },
    {
      "q": "An answer misses code I can see locally",
      "a": "Graphify indexes the default branch. Push the code there and wait for Indexed. Uncommitted work and other branches are not in the graph."
    },
    {
      "q": "I hit a plan limit. What does the message mean?",
      "a": "Monthly indexing allowance used: The workspace used this month’s indexing allowance. It resets at the start of next month. Daily build limit reached: The repository used today’s automatic builds. It resets at 00:00 UTC. Repository too large for this plan: The newest version was not published. The last published version still works. Monthly reviews used: The plan’s reviews for this month are used. A limit message does not mean the repository is empty. Compare plans on Plans and pricing."
    },
    {
      "q": "My agent gets a 429 rate_limited error",
      "a": "It sent too many Ask, query, or MCP requests in a short time. Wait a few seconds and retry with exponential backoff. See Rate limits and plan limits."
    },
    {
      "q": "Claude says it couldn't retrieve a result. Is that a plan limit?",
      "a": "Sometimes. Claude can hide Graphify’s error text, so the message doesn’t say why. A request rate limit applies on every plan. A Free plan limit, such as graph size or the repository allowance, shows as a message in Graphify. See Claude shows a generic error to tell them apart."
    },
    {
      "q": "Does buying more Teams seats raise every limit?",
      "a": "No. Workspace allowances are shared across the workspace and do not multiply by seat count. Talk to Graphify before planning a larger rollout."
    },
    {
      "q": "When does Graphify review a pull request?",
      "a": "When it is opened, reopened, or marked ready for review. Pushing new commits does not start a review by itself. A repository owner, member, or collaborator comments @graphify review on the pull request to run one. Each review analyzes the full pull request, from where it branched to its latest commit. See Pull request reviews."
    },
    {
      "q": "How do I tell Graphify a finding is wrong?",
      "a": "Reply on the pull request with @graphify wrong <finding>, @graphify good <finding>, or @graphify suppress <rule>. That feedback tunes later reviews. See Learning."
    },
    {
      "q": "How do I connect my coding assistant?",
      "a": "Add the hosted MCP server, https://api.graphify.com/mcp, and sign in with OAuth in the browser. Each integration page has the exact steps; start at Hosted MCP."
    },
    {
      "q": "My assistant still uses local tools like get_node",
      "a": "A local graphify entry is still active and wins over the hosted one. Remove it, then restart the assistant. See Move from Graphify CLI."
    },
    {
      "q": "How does a CI agent sign in without a browser?",
      "a": "Use an API token from the MCP tab of Connectors. Store it as a CI secret, never in the repository."
    },
    {
      "q": "A tool call fails and lists repositories",
      "a": "The workspace has more than one repository, so the call needs repository_id. Pass one of the names in the error, such as your-org/your-repo, or run list_repositories."
    },
    {
      "q": "Does Graphify train models on my code?",
      "a": "No. Code goes to Graphify’s LLM subprocessors only to produce results, under terms that prohibit training. See Security and data handling."
    },
    {
      "q": "How do I delete my data?",
      "a": "Contact the Graphify team to request deletion or export. Content is kept until you delete it or close your account, then removed from active systems within 30 days."
    },
    {
      "q": "Can I run Graphify on my own infrastructure?",
      "a": "Yes, with Enterprise, which is self-hosted and in early access. Open-source Graphify also runs entirely on your machine."
    }
  ];
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
};
