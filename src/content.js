const api = typeof browser !== "undefined" ? browser : chrome;

function applyDarkMode() {
  if (document.getElementById("simple-dark-mode-style")) return;

  const style = document.createElement("style");
  style.id = "simple-dark-mode-style";
  style.textContent = `
  :root {
  color-scheme: dark !important;
}

  html {
    background: #121212 !important;
  }

  body {
    background: #121212 !important;
  }

  a {
  color: #8fd98f !important;
}

a:hover {
  color: #ff9ecb !important;
  transition: color 0.15s ease !important;
}

a:focus {
  outline: 2px solid #f38bb6 !important;
}

  h1, h2, h3, h4, h5, h6, div, span, section, article, header, footer, nav, main, form, dl, dt, dd, ul, li {
  background-color: #121212 !important;
  color: #e0e0e0 !important;
  border-color: #444 !important;
}
  `;

  document.documentElement.appendChild(style);
}

function removeDarkMode() {
  const style = document.getElementById("simple-dark-mode-style");
  if (style) style.remove();
}

api.runtime.onMessage.addListener((msg) => {
  if (msg.type === "TOGGLE_DARK_MODE") {
    if (msg.enabled) {
      applyDarkMode();
    } else {
      removeDarkMode();
    }
  }
});

async function checkDomain() {
  try {
    const domain = location.hostname;

    if (!domain) return;

    const result = await api.storage.local.get(domain);

    if (result[domain]) {
      applyDarkMode();
    }
  } catch (e) {
    console.error("Domain check error:", e);
  }
}

api.storage.onChanged.addListener((changes, area) => {
  if (area !== "local") return;

  const domain = location.hostname;

  if (!changes[domain]) return;

  const enabled = changes[domain].newValue;

  if (enabled) {
    applyDarkMode();
  } else {
    removeDarkMode();
  }
});

checkDomain();
