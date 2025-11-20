function getText(selectors: string[]): string {
  for (const sel of selectors) {
    const el = document.querySelector<HTMLElement>(sel);
    if (el) {
      const text = el.innerText.trim();
      if (text) return text;
    }
  }
  return "";
}

function detectSite(): "vuokraovi" | "oikotie" | "unknown" {
  const host = window.location.hostname;
  if (host.includes("vuokraovi.com")) return "vuokraovi";
  if (host.includes("oikotie.fi")) return "oikotie";
  return "unknown";
}

function extractListingData() {
  const site = detectSite();

  let description = "";
  let address = "";
  let rentText = "";
  let sizeText = "";

  if (site === "vuokraovi") {
    description = getText([
      "#showings > div:nth-child(2) > div.MuiGrid-root.MuiGrid-item.MuiGrid-grid-xs-12.mui-style-199mkec-MuiGrid-root > div > div > div > div > div.MuiGrid-root.MuiGrid-item.MuiGrid-grid-xs-12.MuiGrid-grid-sm-12.MuiGrid-grid-md-8.mui-style-1woxsgn-MuiGrid-root > div:nth-child(6) > div.MuiGrid-root.MuiGrid-item.MuiGrid-grid-xs-12.MuiGrid-grid-sm-8.e19cw6r91.mui-style-1l80gnm-MuiGrid-root > span",
      "#infos > div > div.MuiGrid-root.MuiGrid-item.MuiGrid-grid-xs-12.e3qapbw0.mui-style-n4v8jh-MuiGrid-root > div > div:nth-child(1) > h2",
    ]);
    address = getText([
      "#showings > div:nth-child(2) > div.MuiGrid-root.MuiGrid-item.MuiGrid-grid-xs-12.mui-style-199mkec-MuiGrid-root > div > div > div > div > div.MuiGrid-root.MuiGrid-item.MuiGrid-grid-xs-12.MuiGrid-grid-sm-12.MuiGrid-grid-md-8.mui-style-1woxsgn-MuiGrid-root > div:nth-child(2) > div.MuiGrid-root.MuiGrid-item.MuiGrid-grid-xs-12.MuiGrid-grid-sm-8.e19cw6r91.mui-style-1l80gnm-MuiGrid-root > ul > li:nth-child(2)",
      "#showings > div:nth-child(3) > div.MuiGrid-root.MuiGrid-item.MuiGrid-grid-xs-12.mui-style-199mkec-MuiGrid-root > div > div > div > div > div.MuiGrid-root.MuiGrid-item.MuiGrid-grid-xs-12.MuiGrid-grid-sm-12.MuiGrid-grid-md-8.mui-style-1woxsgn-MuiGrid-root > div:nth-child(2) > div.MuiGrid-root.MuiGrid-item.MuiGrid-grid-xs-12.MuiGrid-grid-sm-8.e19cw6r91.mui-style-1l80gnm-MuiGrid-root > ul > li:nth-child(2)",
    ]);
    rentText = getText([
      "#infos > div > div.MuiGrid-root.MuiGrid-item.MuiGrid-grid-xs-12.e3qapbw0.mui-style-n4v8jh-MuiGrid-root > div > div:nth-child(2) > div > div.MuiGrid-root.MuiGrid-item.MuiGrid-grid-xs-4.MuiGrid-grid-md-5.mui-style-1uvxiyd-MuiGrid-root > h3",
    ]);
    sizeText = getText([
      "#infos > div > div.MuiGrid-root.MuiGrid-item.MuiGrid-grid-xs-12.e3qapbw0.mui-style-n4v8jh-MuiGrid-root > div > div:nth-child(2) > div > div.MuiGrid-root.MuiGrid-item.MuiGrid-grid-xs-4.MuiGrid-grid-md-4.mui-style-1og54gx-MuiGrid-root > h3 > span",
    ]);
  } else if (site === "oikotie") {
    description = getText([
      "body > main > section > div:nth-child(2) > div > div.listing-header.customer-color > div.listing-header__details > h1 > span.listing-header__text.listing-header__text--cut-overflow",
    ]);
    address = getText([
      "body > main > section > div:nth-child(2) > div > div.listing-header.customer-color > div.listing-header__details > h1 > span:nth-child(1)",
      "body > main > section > div:nth-child(2) > div > div.listing-header.customer-color > div > h1 > span:nth-child(1)",
    ]);
    rentText = getText([
      "body > main > section > div:nth-child(2) > div > div.listing-header.customer-color > div.listing-header__details > h2 > span:nth-child(1)",
    ]);
    sizeText = getText([
      "body > main > section > div:nth-child(2) > div > div.listing-header.customer-color > div.listing-header__details > h2 > span:nth-child(3)",
    ]);
  } else {
    description = getText(["h1"]);
    address = getText(["[itemprop='streetAddress']", ".address"]);
  }

  return {
    site,
    url: window.location.href,
    description,
    address,
    rentText,
    sizeText,
  };
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type === "PING_FROM_POPUP") {
    const data = extractListingData();
    sendResponse(data);
  }
  return true;
});
