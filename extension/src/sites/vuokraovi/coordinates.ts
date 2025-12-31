import { Coordinates } from "../../types";

/**
 * Extracts coordinates from the "Hae reitti" button href.
 * Returns null if not found.
 * This hae reitti button is only available on owhen a user scrolls down on the page far enough for the map to load.
 * So it should not be the first thing we look for.
 */
export const fromHaeReittiButton = (): Coordinates | null => {
  // Try the specific selector provided by the user
  const reittiButton = document.querySelector<HTMLAnchorElement>(
    "#links-item > div > a.MuiButtonBase-root.MuiButton-root.MuiButton-contained.MuiButton-containedSecondary.MuiButton-sizeMedium.MuiButton-containedSizeMedium.MuiButton-root.MuiButton-contained.MuiButton-containedSecondary.MuiButton-sizeMedium.MuiButton-containedSizeMedium.eqp02gi0.mui-style-1cmtyk4"
  );

  if (reittiButton && reittiButton.href) {
    // Extract coordinates from Google Maps URL: https://www.google.com/maps/dir/?api=1&destination=60.194351,24.942291
    const url = new URL(reittiButton.href);
    const destination = url.searchParams.get("destination");

    if (destination) {
      const [latStr, lonStr] = destination.split(",");
      const lat = parseFloat(latStr);
      const lon = parseFloat(lonStr);

      if (!isNaN(lat) && !isNaN(lon)) {
        return { lat, lon };
      }
    }
  }
  return null;
};

/**
 * Extracts coordinates from the Street View button href.
 * Returns null if not found.
 * The Street View button contains coordinates in the viewpoint parameter:
 * https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=60.1888,24.97491
 * This button is available on the page when the user scrolls down far enough for the map to load.
 * So it should not be the first thing we look for.
 */
export const fromStreetViewButton = (): Coordinates | null => {
  // Try the specific selector provided by the user
  const streetViewButton = document.querySelector<HTMLAnchorElement>(
    "#links-item > div > a.MuiButtonBase-root.MuiButton-root.MuiButton-contained.MuiButton-containedSecondary.MuiButton-sizeMedium.MuiButton-containedSizeMedium.MuiButton-root.MuiButton-contained.MuiButton-containedSecondary.MuiButton-sizeMedium.MuiButton-containedSizeMedium.eqp02gi0.mui-style-6mhavo"
  );

  if (streetViewButton && streetViewButton.href) {
    // Extract coordinates from Google Maps Street View URL: https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=60.1888,24.97491
    const url = new URL(streetViewButton.href);
    const viewpoint = url.searchParams.get("viewpoint");

    if (viewpoint) {
      const [latStr, lonStr] = viewpoint.split(",");
      const lat = parseFloat(latStr);
      const lon = parseFloat(lonStr);

      if (!isNaN(lat) && !isNaN(lon)) {
        return { lat, lon };
      }
    }
  }

  return null;
};
