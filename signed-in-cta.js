/* Navbar CTA: "Your dashboard" for people signed in to app.graphify.com.
   The console sets gf_signed_in=1 on .graphify.com (not the session, just a
   presence hint). We only test that the cookie exists; nothing is read or sent. */
(() => {
  if (window.__gfySignedInCta) return;
  window.__gfySignedInCta = true;
  let signedIn = false;
  try { signedIn = /(?:^|;\s*)gf_signed_in=1(?:;|$)/.test(document.cookie); } catch (_) {}
  const root = document.documentElement;
  const SIGNUP = /app\.graphify\.com\/signup/;
  const apply = () => {
    if (signedIn) {
      document.querySelectorAll('a[href*="app.graphify.com/signup"], a[data-gfy-cta]').forEach((a) => {
        // Header and mobile menu only; signup links in page content stay as written.
        if (!a.closest('#topbar-cta-button, #navbar, header, [role="dialog"]')) return;
        a.setAttribute("data-gfy-cta", "");
        if (SIGNUP.test(a.href)) a.href = "https://app.graphify.com";
        const walker = document.createTreeWalker(a, NodeFilter.SHOW_TEXT);
        for (let n; (n = walker.nextNode());) if (n.nodeValue.trim() === "Start free") n.nodeValue = "Your dashboard";
        a.setAttribute("aria-label", "Your dashboard");
      });
    }
    root.classList.add("gfy-cta-ready");
  };
  apply();
  if (signedIn) {
    try { new MutationObserver(apply).observe(document.body || root, { childList: true, subtree: true }); } catch (_) {}
  }
})();
