Reviewing the current structure and planning a scalable folder structure for the extension.

[4 tools called]

Proposed folder structure for the extension:

```
extension/
├── src/
│   ├── content.ts                    # Main content script entry point
│   ├── popup.ts                       # Main popup entry point
│   │
│   ├── types/
│   │   ├── index.ts                  # Shared type definitions
│   │   └── listing.ts                # Listing data types
│   │
│   ├── config/
│   │   ├── index.ts                  # Main config (backend URL, token)
│   │   └── destinations.ts           # Fixed destination coordinates
│   │
│   ├── sites/
│   │   ├── base.ts                   # Base extractor interface/abstract class
│   │   ├── vuokraovi/
│   │   │   ├── index.ts              # Vuokraovi extractor main
│   │   │   ├── selectors.ts          # CSS selectors for Vuokraovi
│   │   │   ├── coordinates.ts        # Vuokraovi-specific coordinate extraction
│   │   │   └── parsers.ts            # Vuokraovi-specific text parsing
│   │   ├── oikotie/
│   │   │   ├── index.ts              # Oikotie extractor main
│   │   │   ├── selectors.ts          # CSS selectors for Oikotie
│   │   │   ├── coordinates.ts        # Oikotie-specific coordinate extraction
│   │   │   └── parsers.ts            # Oikotie-specific text parsing
│   │   └── detector.ts               # Site detection logic
│   │
│   ├── utils/
│   │   ├── dom.ts                    # DOM utilities (getText, etc.)
│   │   ├── parsing.ts                # Text parsing utilities (rent, size)
│   │   ├── formatting.ts             # Excel formatting utilities
│   │   ├── clipboard.ts              # Clipboard operations
│   │   └── coordinates.ts            # Generic coordinate extraction helpers
│   │
│   ├── api/
│   │   ├── backend.ts                # Backend API client
│   │   └── types.ts                  # API request/response types
│   │
│   ├── excel/
│   │   ├── formatter.ts              # Excel row formatting logic
│   │   ├── calculator.ts             # Business logic (real cost, size indicator)
│   │   └── columns.ts                # Column definitions and order
│   │
│   └── popup/
│       ├── ui.ts                     # UI rendering functions
│       ├── handlers.ts               # Event handlers
│       └── state.ts                  # Popup state management
│
├── dist/                             # Compiled output
├── manifest.json
├── popup.html
├── package.json
└── tsconfig.json
```

## Rationale

1. `sites/` — Site-specific extractors

   - Each site has its own folder
   - `base.ts` defines a common interface
   - Easy to add new sites (e.g., `etuasunnot/`, `lumo/`)

2. `utils/` — Reusable utilities

   - DOM helpers, parsing, formatting
   - No site-specific logic

3. `api/` — Backend communication

   - Isolated API client
   - Easy to swap implementations

4. `excel/` — Excel formatting logic

   - Column definitions
   - Business calculations
   - Row formatting

5. `types/` — TypeScript types

   - Shared interfaces
   - Type safety

6. `config/` — Configuration
   - Separates destinations from main config
   - Easy to update

## Other Finnish rental sites

- Etuovi (mostly sales, some rentals)
- Lumo (corporate rentals)
- VVO (corporate rentals)
- Kodisto (some rentals)

Oikotie and Vuokraovi are the main consumer-facing rental sites. The structure above makes it straightforward to add others later.

This structure:

- Separates concerns
- Makes adding new sites straightforward
- Keeps utilities reusable
- Maintains type safety
- Scales as features grow

Should I implement this structure, or do you want to adjust it first?
