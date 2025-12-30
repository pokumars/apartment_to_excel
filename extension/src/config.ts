/**
 * Configuration for the extension
 */

// Backend API endpoint (change to production URL when deployed)
export const BACKEND_URL = "http://localhost:8787";

// Proxy token (should match server PROXY_TOKEN)
// In production, this could be stored in extension storage or provided by user
export const PROXY_TOKEN = "your_proxy_token_here"; // TODO: Update this

/**
 * Fixed destination coordinates for travel time calculation
 * Coordinates are in [lat, lon] format
 */
export const DESTINATIONS = {
  // Column 4: Salmisaari Energiakatu 4
  salmisaari: {
    name: "Salmisaari Energiakatu 4",
    lat: 60.1606,
    lon: 24.9094,
  },
  // Column 5: keilaniementie 1
  keilaniemi: {
    name: "keilaniementie 1",
    lat: 60.1756,
    lon: 24.8303,
  },
  // Column 6: Tukholmankatu 2
  tukholmankatu: {
    name: "Tukholmankatu 2",
    lat: 60.1631,
    lon: 24.9403,
  },
  // Column 7: time to sörnäinen
  sornainen: {
    name: "Sörnäinen",
    lat: 60.1889,
    lon: 24.9614,
  },
  // Column 8: center (Helsinki city center)
  center: {
    name: "center",
    lat: 60.1699,
    lon: 24.9384,
  },
} as const;
