# Apartment → Excel Row Extension – Implementation Plan

## 0. Goal

Build a Chrome (MV3) extension that:

- Runs on Oikotie + Vuokraovi apartment listing pages.
- Extracts:
  - `description`
  - `Area/part of town`
  - `rent`
  - `size`
- Computes:
  - `real cost (rent+40)`
  - `size + >80` (e.g. `93 (OK)` if >= 80)
- Outputs **one tab-separated row** matching this column order:

1. description
2. Area/part of town
3. real cost (rent+40)
4. Salmisaari Energiakatu 4
5. keilaniementie 1
6. Tukholmankatu 2
7. time to sörnäinen
8. center
9. size + >80

- Copies that row to clipboard, so it can be pasted into Excel.

Travel-time columns can stay empty for now (filled manually or later automated).

---

## 1. Tech + constraints

- **Browser**: Chrome (Manifest V3)
- **Lang**: JavaScript initially (TypeScript later if needed)
- **Permissions**:
  - `activeTab` (to message current tab)
  - `scripting` (for content script in MV3, though static content_script is fine)
  - `clipboardWrite` (to copy TSV)
- **Target hosts**:
  - `https://asunnot.oikotie.fi/*`
  - `https://www.vuokraovi.com/*`

---

## 2. Folder structure

Create a folder, e.g. `apartment-to-excel/`:

```text
apartment-to-excel/
  manifest.json
  content.js
  popup.html
  popup.js
  README.md   (this plan)
```
