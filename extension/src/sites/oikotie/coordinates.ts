import { Coordinates } from "../../types";

/**
 * Extracts coordinates from meta tags with place:location properties.
 * Returns null if not found.
 * Meta tags: <meta property="place:location:latitude" content="60.19430462817">
 *            <meta property="place:location:longitude" content="24.942131133097">
 */
export const fromMetaTags = (): Coordinates | null => {
  const metaLat = document.querySelector(
    'meta[property="place:location:latitude"]'
  );
  const metaLon = document.querySelector(
    'meta[property="place:location:longitude"]'
  );

  if (metaLat && metaLon) {
    const latStr = metaLat.getAttribute("content");
    const lonStr = metaLon.getAttribute("content");

    if (latStr && lonStr) {
      const lat = parseFloat(latStr);
      const lon = parseFloat(lonStr);

      if (!isNaN(lat) && !isNaN(lon)) {
        return { lat, lon };
      }
    }
  }

  return null;
};
