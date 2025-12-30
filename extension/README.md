# Apartment to Excel - Chrome Extension

Chrome extension that extracts apartment listing data from Oikotie and Vuokraovi, computes travel times, and formats it as a tab-separated row for Excel.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Update `src/config.ts`:

   - Set `BACKEND_URL` to your backend server URL (default: `http://localhost:8787`)
   - Set `PROXY_TOKEN` to match your backend's `PROXY_TOKEN` environment variable

3. Build the extension:

```bash
npm run build
```

4. Load in Chrome:
   - Open `chrome://extensions`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `extension` folder

## Usage

1. Navigate to an apartment listing on:

   - Oikotie (`https://asunnot.oikotie.fi/*`)
   - Vuokraovi (`https://www.vuokraovi.com/*`)

2. Click the extension icon

3. Click "Extract & Copy to Excel"

4. The formatted row will be copied to your clipboard

5. Paste into Excel (the tabs will automatically create columns)

## Excel Column Format

1. description
2. Area/part of town
3. real cost (rent+40)
4. Salmisaari Energiakatu 4 (travel time in minutes)
5. keilaniementie 1 (travel time in minutes)
6. Tukholmankatu 2 (travel time in minutes)
7. time to sörnäinen (travel time in minutes)
8. center (travel time in minutes)
9. size + >80 (e.g., "93 (OK)" if >= 80)

## Notes

- Travel times are only computed if coordinates are found on the listing page
- If coordinates aren't available, travel time columns will be empty
- Make sure the backend server is running and accessible
