import {
  fromDigitalData,
  fromHaeReittiButton,
  fromStreetViewButton,
} from "./sites/vuokraovi/coordinates";
import { Coordinates } from "./types";

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

/**
 * Attempts to extract coordinates from the page.
 * Returns null if not found TODO:(will need geocoding).
 */
function extractCoordinates(): Coordinates | null {
  const site = detectSite();

  // Vuokraovi-specific: Try multiple methods in order of reliability
  if (site === "vuokraovi") {
    // 1. Try digitalData first (most reliable - in header, loads early)
    const coords = fromDigitalData();
    if (coords) return coords;

    // 2. Try Street View button (available when map loads)
    const streetViewCoords = fromStreetViewButton();
    if (streetViewCoords) return streetViewCoords;

    // 3. Try "Hae reitti" button (requires scrolling to map)
    return fromHaeReittiButton();
  }
  return null;
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

  const coordinates = extractCoordinates();

  return {
    site,
    url: window.location.href,
    description,
    address,
    rentText,
    sizeText,
    coordinates,
  };
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type === "PING_FROM_POPUP") {
    const data = extractListingData();
    sendResponse(data);
  }
  return true;
});
