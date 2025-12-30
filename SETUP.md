# Apartment to Excel - Setup Guide

## Quick Start

### 1. Backend Setup

```bash
cd server
npm install
cp .env.example .env
# Edit .env and add your DIGITRANSIT_KEY and PROXY_TOKEN
npm run dev
```

The backend will run on `http://localhost:8787`

### 2. Extension Setup

```bash
cd extension
npm install
# Edit src/config.ts and set PROXY_TOKEN to match your backend
npm run build
```

Then load the extension in Chrome:

1. Open `chrome://extensions`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `extension` folder

### 3. Get API Keys

1. **Digitransit API Key**: Get from [HSL Digitransit](https://digitransit.fi/en/developers/apis/1-routing-api/authentication/)
2. **Proxy Token**: Generate a random string (e.g., `openssl rand -hex 32`)

Make sure the `PROXY_TOKEN` in `extension/src/config.ts` matches the `PROXY_TOKEN` in `server/.env`.

## Usage

1. Navigate to an apartment listing on Oikotie or Vuokraovi
2. Click the extension icon
3. Click "Extract & Copy to Excel"
4. Paste into Excel

## Project Structure

```
apartment_to_excel/
├── extension/          # Chrome extension
│   ├── src/
│   │   ├── content.ts  # Content script (extracts data from pages)
│   │   ├── popup.ts    # Popup UI (formats and copies to Excel)
│   │   └── config.ts   # Configuration (backend URL, destinations)
│   └── dist/           # Compiled JavaScript
└── server/             # Backend proxy
    ├── src/
    │   ├── digitransit.ts    # Core Digitransit API logic
    │   ├── handler.ts        # HTTP handler
    │   └── local-express.ts  # Express server for local dev
    └── .env            # Environment variables (not in git)
```

## Features

- ✅ Extracts apartment data from Oikotie and Vuokraovi
- ✅ Computes real cost (rent + 40)
- ✅ Formats size with >80 indicator
- ✅ Calculates travel times to 5 destinations using HSL Digitransit API
- ✅ Formats data as tab-separated row for Excel
- ✅ Copies to clipboard

## Notes

- Travel times are only computed if coordinates are found on the listing page
- If coordinates aren't available, travel time columns will be empty
- The backend protects the Digitransit API key from exposure
