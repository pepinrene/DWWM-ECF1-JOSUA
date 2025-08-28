# DWWM-ECF1-JOSUA
# Neon Dynasty – Frontend (BEM + SASS)

Cinema website built with **BEM** and **SASS**, mobile‑first, with film cards rendered from JSON (inline fallback), simple filters, and a pure‑CSS equalizer.

# Project Structure
```
/
├─ films.html         # Catalogue page (film grid + CSS equalizer)
├─ services.html      # Restaurant/Drinks page (reuses the same card/grid styles)
├─ infos.html         # CinéPass page (pricing cards)
├─ styles.scss        # SASS source (mobile‑first + BEM + modules + aliases)
├─ styles.css         # Compiled CSS (link this in HTML)
├─ app.js             # Unified JS (filters + search + JSON loading)
├─ films.json         # (optional) Film data file when served over http://
└─ img/               # Images (posters, logo, etc.)
```

> Opening `films.html` by double‑click (URL `file://`) may block `fetch` for `films.json` in some browsers.  
> The project includes an **inline JSON fallback** so the page still works. With a small local server, `films.json` is loaded too.

---

# Option A —  server
1) Open `films.html` in your browser.  
2) Static cards show immediately. If inline data is present, it shows as well.

**Node**
```bash
npx serve
# then open the URL printed in the console
```

---

##  Features

- **BEM + SASS, mobile‑first**
  - Film grid: 1 column (mobile) → 2 (≥480px) → 3 (≥768px) → 4 (≥1024px).
  - Flexible header / filters / footer.
  - Scrollable tables with `.table-responsive` (if you use tables).

- **Film rendering**
  - Cards follow: `films__grid` → `films__card` → `films__image` + `films__name`.
  - `app.js` **appends** items from `films.json` (does not wipe your static cards).

- **Filters & search**
  - `.filters__btn` filter by **genre** via `data-genre`.
  - On `infos.html`, filter CinéPass cards by `data-category`.
  - `#search` (if present) filters by title text.

- **Pure‑CSS Equalizer**
  - BEM block `.equalizer` (blue top bars, pink bottom bars).  
  - No JavaScript required.

    → Mapping: `movie → title`, `ticketsSold → seats_sold`, default **capacity = 80** if `seats_total`/`capacity` is missing.

- **Legacy class aliases** in CSS for progressive migration  
  The CSS keeps old names working: `.hero-background` (→ `.hero`), `.background-image` (→ `.hero__image`), `.films` (grid alias), `.film-card` (card alias).

---

##  Main BEM blocks

- **`hero`**: `hero__image`  
- **`header`**: `header__nav`, `header__logo`, `header__menu`, `header__link`  
- **`filters`**: `filters__buttons`, `filters__btn`, `filters__search`  
- **`films`**: `films__grid`, `films__card`, `films__image`, `films__name`  
- **`card`** (CinéPass): `card__title`, `card__list`, `card__item`, `card__price`, `card__btn`  
- **`equalizer`**: `equalizer__col`, `equalizer__bar equalizer__bar--top|--bottom`

---

##  SASS – build the CSS

Install once (if needed):
```bash
npm i -D sass
```

Build:
```bash
npx sass styles.scss styles.css
```

Watch in dev:
```bash
npx sass --watch styles.scss styles.css
```

---

##  Equalizer (CSS‑only)

### HTML
```html
<section class="equalizer" aria-label="CSS Equalizer">
  <!-- repeat ~25 columns -->
  <div class="equalizer__col">
    <span class="equalizer__bar equalizer__bar--top"></span>
    <span class="equalizer__bar equalizer__bar--bottom"></span>
  </div>
</section>
```

### CSS (already included in `styles.css`)
- `@keyframes eq-bounce` with `nth-child` delays to create the wave.
- Quick tweaks:
  - Column height: `height: 120px` on `.equalizer__col`
  - Bar width: `width: 10px` on `.equalizer__col`
  - Colors: `#84feff` (top), `#fd55b7` (bottom)

---

##  Troubleshooting

- **Images not showing**  
  Check the **file path** (e.g., `img/akira.webp`) and the extension. CSS also styles legacy selectors (`.film-card img`).

- **`films.json` not loading**  
  Over `file://` most browsers block `fetch`.  
  Use a local server (see *Getting Started / Option B*).  
  Otherwise, inline JSON in `films.html` keeps the page working.

- **Empty genre filters**  
  To filter by genre, add `"genre": "action"` (or similar) to each JSON entry.

---

##  Add a film

**Static**: duplicate a card in `#films` (HTML), set `data-genre`, poster and title.  
**Dynamic**: add an object to `films.json` (Schema A or B). With a server, the card is appended on load.

---

##  Deploy

Any static host works (GitHub Pages, Netlify, Vercel, …).  
If you rely on `films.json`, keep it **at the project root** (or update the path in `app.js`).