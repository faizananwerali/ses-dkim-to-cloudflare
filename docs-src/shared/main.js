import "./style.css";

// ── SVG icons ───────────────────────────────────────────────────
const ICONS = {
  sun: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>`,
  moon: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`,
  monitor: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="3" rx="2"/><path d="M8 21h8M12 17v4"/></svg>`,
};

// ── Nav injection ───────────────────────────────────────────────
function injectNav() {
  const el = document.getElementById("docs-nav");
  if (!el) return;

  const path = window.location.pathname;
  const isFeatures = path.includes("/features");
  const isUsage = path.includes("/usage");
  const isOutput = path.includes("/output");
  const isFaq = path.includes("/faq");
  const isOverview = !isFeatures && !isUsage && !isOutput && !isFaq;

  el.innerHTML = `
    <div class="nav-inner">
      <a href="/docs/" class="nav-logo">
        <span class="nav-logo-text">
          SES DKIM <span class="nav-logo-arrow">→</span> CF
        </span>
      </a>
      <nav class="nav-links">
        <a href="/docs/"          class="${isOverview ? "active" : ""}">Overview</a>
        <a href="/docs/features/" class="${isFeatures ? "active" : ""}">Features</a>
        <a href="/docs/usage/"    class="${isUsage ? "active" : ""}">Usage</a>
        <a href="/docs/output/"   class="${isOutput ? "active" : ""}">Output</a>
        <a href="/docs/faq/"      class="${isFaq ? "active" : ""}">FAQ</a>
      </nav>
      <div class="nav-actions">
        <div class="theme-toggle">
          <button class="theme-btn" data-tv="system" title="System theme">${ICONS.monitor}</button>
          <button class="theme-btn" data-tv="light"  title="Light theme">${ICONS.sun}</button>
          <button class="theme-btn" data-tv="dark"   title="Dark theme">${ICONS.moon}</button>
        </div>
        <a href="/" class="btn-tool">Open Tool ↗</a>
      </div>
    </div>
  `;

  syncThemeButtons();
}

function syncThemeButtons() {
  const current = localStorage.getItem("theme") || "system";
  document.querySelectorAll(".theme-btn[data-tv]").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.tv === current);
  });
}

function setTheme(val) {
  if (val === "system") {
    localStorage.removeItem("theme");
    document.documentElement.removeAttribute("data-theme");
  } else {
    localStorage.setItem("theme", val);
    document.documentElement.setAttribute("data-theme", val);
  }
  syncThemeButtons();
}

// ── Screenshot tabs ─────────────────────────────────────────────
function initTabs() {
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const tab = btn.dataset.tab;
      const container = btn.closest(".screenshot-tabs");
      if (!container) return;
      container.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
      container.querySelectorAll(".tab-panel").forEach((p) => p.classList.remove("active"));
      btn.classList.add("active");
      container.querySelector(`.tab-panel[data-panel="${tab}"]`)?.classList.add("active");
    });
  });
}

// ── Boot ────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  injectNav();
  initTabs();

  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".theme-btn[data-tv]");
    if (btn) setTheme(btn.dataset.tv);
  });
});
