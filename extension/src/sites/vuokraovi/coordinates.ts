import { Coordinates } from "../../types";

/**
 * Extracts coordinates from window.digitalData in the page header.
 * Returns null if not found.
 * This is the most reliable method as it's in a script tag in the header and loads early.
 * Path: window.digitalData.product[0].productInfo.location.geoCoordinates
 */
export const fromDigitalData = (): Coordinates | null => {
  // First, try to extract directly from the script tag (most reliable)
  const scriptTags = document.querySelectorAll("script");
  for (const script of Array.from(scriptTags)) {
    const text = script.textContent || script.innerHTML;
    if (
      text &&
      text.includes("window.digitalData") &&
      text.includes("geoCoordinates")
    ) {
      try {
        // Try to extract the JSON from the script tag
        // Look for the pattern: window.digitalData = {...};
        const match = text.match(/window\.digitalData\s*=\s*({[\s\S]*?});/);
        if (match) {
          const digitalDataStr = match[1];
          const digitalData = JSON.parse(digitalDataStr);

          const product = digitalData?.product;
          if (product && Array.isArray(product) && product.length > 0) {
            const geoCoordinates =
              product[0]?.productInfo?.location?.geoCoordinates;
            if (geoCoordinates) {
              const lat = geoCoordinates.latitude;
              const lon = geoCoordinates.longitude;
              if (
                typeof lat === "number" &&
                typeof lon === "number" &&
                !isNaN(lat) &&
                !isNaN(lon)
              ) {
                return { lat, lon };
              }
            }
          }
        }
      } catch (e) {
        // If parsing fails, continue to next script tag
        continue;
      }
    }
  }

  /*  // Fallback: Try to access window.digitalData (might not be available yet)
  const digitalData = (window as any).digitalData;
  if (!digitalData) {
    return null;
  }

  try {
    const product = digitalData.product;
    if (!product || !Array.isArray(product) || product.length === 0) {
      return null;
    }

    const firstProduct = product[0];
    if (!firstProduct?.productInfo?.location?.geoCoordinates) {
      return null;
    }

    const geoCoordinates = firstProduct.productInfo.location.geoCoordinates;
    const lat = geoCoordinates.latitude;
    const lon = geoCoordinates.longitude;

    if (
      typeof lat === "number" &&
      typeof lon === "number" &&
      !isNaN(lat) &&
      !isNaN(lon)
    ) {
      return { lat, lon };
    }
  } catch (e) {
    return null;
  }
 */
  return null;
};
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
