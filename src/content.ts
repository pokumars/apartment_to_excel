// src/content.ts

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type === "PING_FROM_POPUP") {
    sendResponse({
      ok: true,
      url: window.location.href,
      title: document.title,
    });
  }
  // indicate async allowed (even though we respond sync)
  return true;
});
