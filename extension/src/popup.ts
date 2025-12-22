// src/popup.ts

function getActiveTab(): Promise<chrome.tabs.Tab> {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      if (tab) resolve(tab);
      else reject(new Error("No active tab"));
    });
  });
}

async function pingContentScript() {
  const root = document.getElementById("root");
  if (root) root.textContent = "Pinging content script...";

  try {
    const tab = await getActiveTab();
    if (!tab.id) throw new Error("Active tab has no id");

    chrome.tabs.sendMessage(tab.id, { type: "PING_FROM_POPUP" }, (response) => {
      if (chrome.runtime.lastError) {
        if (root) {
          root.textContent =
            "Error contacting content script: " +
            chrome.runtime.lastError.message;
        }
        return;
      }
      if (root) {
        root.innerHTML = `
            <h1>Apartment → Excel</h1>
            <p>Response from content script:</p>
            <pre>${JSON.stringify(response, null, 2)}</pre>
          `;
      }
    });
  } catch (err) {
    const root = document.getElementById("root");
    if (root) root.textContent = "Error: " + (err as Error).message;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const root = document.getElementById("root");
  if (root) {
    root.innerHTML = `
      <h1>Apartment → Excel</h1>
      <button id="ping">Ping content script</button>
      <div id="result"></div>
    `;
  }

  const btn = document.getElementById("ping");
  btn?.addEventListener("click", pingContentScript);
});
