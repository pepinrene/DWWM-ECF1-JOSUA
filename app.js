
document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.filters__buttons button');
    const cards = document.querySelectorAll('.film-card');
    const searchInput = document.getElementById('search');

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.dataset.filter;
            cards.forEach(card => {
                card.style.display = (filter === 'all' || card.dataset.genre === filter) ? 'block' : 'none';
            });
        });
    });

    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase();
        cards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            card.style.display = title.includes(query) ? 'block' : 'none';
        });
    });
});


document.addEventListener("DOMContentLoaded", () => {
  const audio = document.getElementById("js-audio");
  const playBtn = document.getElementById("js-play-btn");
  const eq = document.getElementById("js-equalizer");

  playBtn.addEventListener("click", () => {
    if (audio.paused) {
      audio
        .play()
        .then(() => {
          eq.classList.add("equalizer--playing");
          playBtn.textContent = "Stop";
        })
        .catch((err) => console.error("Erreur de lecture audio :", err));
    } else {
      audio.pause();
      eq.classList.remove("equalizer--playing");
      playBtn.textContent = "Play";
    }
  });
  audio.addEventListener("ended", () => {
    eq.classList.remove("equalizer--playing");
    playBtn.textContent = "Play";
  });
});

/* === Filtres films (JS pur, pas de CSS inline) — version robuste === */
document.addEventListener("DOMContentLoaded", () => {
  const DEFAULT_CAPACITY = 80;

  const SCRIPT_DIR = (() => {
    try { return new URL(".", document.currentScript.src); }
    catch (_) { return new URL(".", location.href); }
  })();
  const FILMS_JSON_URL = new URL("films.json", SCRIPT_DIR).href;

  const norm = s => (s || "").toUpperCase().replace(/\s+/g, " ").trim();
  const EURO = n => `${n}€`;
  const qs = (sel, el=document) => el.querySelector(sel);
  const qsa = (sel, el=document) => Array.from(el.querySelectorAll(sel));

  function getMount(){
    const mount = document.getElementById("film-filters-advanced");
    const films = document.getElementById("films");
    if (!mount || !films) return null; // ⬅️ Opt‑in strict : ne rien faire ailleurs
    return mount;
  }

  function buildUI(){
    const mount = getMount();
    if (!mount) return null;
    const wrap = document.createElement("div");
    wrap.className = "filters-adv";

    const gDay = document.createElement("div");
    gDay.className = "filters-adv__group filters-adv__group--day";

    const gPrice = document.createElement("div");
    gPrice.className = "filters-adv__group filters-adv__group--price";
    const priceLabel = document.createElement("label");
    priceLabel.innerHTML = `Prix ≤ <strong>50€</strong>`;
    const price = document.createElement("input");
    price.type = "range"; price.min = "0"; price.max = "50"; price.step = "1"; price.value = "50";
    price.className = "filters__price-slider";
    gPrice.append(priceLabel, price);

    const gStock = document.createElement("div");
    gStock.className = "filters-adv__group filters-adv__group--stock";
    const soldLabel = document.createElement("label");
    const sold = document.createElement("input");
    sold.type = "checkbox"; sold.checked = true;
    sold.className = "filters__soldout-toggle";
    sold.setAttribute("aria-label","Masquer les séances complètes");
    soldLabel.append(sold, " Masquer les séances complètes");
    gStock.appendChild(soldLabel);

    wrap.append(gDay, gPrice, gStock);
    mount.replaceChildren(wrap);
    return { mount, wrap, gDay, price, priceLabel, sold };
  }

  async function loadData() {
    const res = await fetch(FILMS_JSON_URL, { cache: "no-store" });
    if (!res.ok) throw new Error(`films.json ${res.status}`);
    return await res.json();
  }

  function enhanceCards(films) {
    const byTitle = new Map();
    films.forEach(f => {
      const key = (f.movie || "").toUpperCase().replace(/\s+/g, " ").trim();
      const capacity = Number(f.capacity) > 0 ? Number(f.capacity) : DEFAULT_CAPACITY;
      const sold = Number(f.ticketsSold) || 0;
      const seatsLeft = Math.max(0, capacity - sold);

      const dateObj = new Date(f.date + "T12:00:00");
      const weekday = dateObj.toLocaleDateString("fr-FR", { weekday: "long" });
      const dayLabel = weekday.charAt(0).toUpperCase() + weekday.slice(1);
      const dayNum = String(dateObj.getDate());

      byTitle.set(key, { ...f, capacity, seatsLeft, soldOut: seatsLeft <= 0, weekday, dayLabel, dayNum });
    });

    qsa(".film-card").forEach(card => {
      const titleEl = qs("h3", card);
      const key = (titleEl ? titleEl.textContent : "").toUpperCase().replace(/\s+/g, " ").trim();
      const meta = byTitle.get(key);
      if (!meta) return;

      card.dataset.price   = String(meta.price);
      card.dataset.date    = meta.dayNum;
      card.dataset.day     = meta.weekday;
      card.dataset.seats   = String(meta.seatsLeft);
      card.dataset.soldout = String(meta.soldOut);

      if (!qs(".movie-badges", card)) {
        const badges = document.createElement("div");
        badges.className = "movie-badges";
        const bDay = document.createElement("span"); bDay.className = "badge"; bDay.textContent = `${meta.dayLabel} ${meta.dayNum}${meta.time ? " • " + meta.time : ""}`;
        const bPrice = document.createElement("span"); bPrice.className = "badge"; bPrice.textContent = EURO(meta.price);
        const bSeats = document.createElement("span"); bSeats.className = "badge" + (meta.soldOut ? " badge--soldout" : "");
        bSeats.textContent = meta.soldOut ? "Complet" : `${meta.seatsLeft}/${meta.capacity}`;
        badges.append(bDay, bPrice, bSeats);
        card.appendChild(badges);
      }
    });
  }

  function buildDayButtons(films, gDay) {
    gDay.innerHTML = "";
    const uniq = Array.from(new Set(
      films.map(f => {
        const d = new Date(f.date + "T12:00:00");
        return `${d.toLocaleDateString("fr-FR",{weekday:"long"})}|${d.getDate()}`;
      })
    ));
    const buttons = [{ key: "all", label: "Tous les jours" }].concat(
      uniq.map(s => {
        const [label, num] = s.split("|");
        const nice = label.charAt(0).toUpperCase() + label.slice(1);
        return { key: String(num), label: `${nice} ${num}` };
      })
    );
    buttons.forEach(({ key, label }) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "btn" + (key === "all" ? " is-active" : "");
      b.dataset.day = key;
      b.setAttribute("aria-pressed", key === "all" ? "true" : "false");
      b.textContent = label;
      gDay.appendChild(b);
    });
  }

  function startFiltering(ui) {
    const state = { day: "all", maxPrice: Number(ui.price.value), hideSoldOut: ui.sold.checked };

    function setActiveDayButton() {
      ui.wrap.querySelectorAll("[data-day]").forEach(btn => {
        const active = btn.dataset.day === state.day;
        btn.classList.toggle("is-active", active);
        btn.setAttribute("aria-pressed", active ? "true" : "false");
      });
    }

    function apply() {
      qsa(".film-card").forEach(card => {
        const price = Number(card.dataset.price || 0);
        const date = (card.dataset.date || "").toString();
        const soldout = card.dataset.soldout === "true";
        let ok = true;
        if (state.day !== "all" && date !== state.day) ok = false;
        if (price > state.maxPrice) ok = false;
        if (state.hideSoldOut && soldout) ok = false;
        card.hidden = !ok; card.classList.toggle("hidden-adv", !ok);
      });
    }

    ui.wrap.addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-day]");
      if (!btn) return;
      state.day = btn.dataset.day;
      setActiveDayButton();
      apply();
    });

    ui.price.addEventListener("input", () => {
      state.maxPrice = Number(ui.price.value);
      const strong = ui.price.previousElementSibling.querySelector("strong");
      if (strong) strong.textContent = EURO(state.maxPrice);
      apply();
    });

    ui.sold.addEventListener("change", () => {
      state.hideSoldOut = ui.sold.checked;
      apply();
    });

    setActiveDayButton();
    apply();
  }

  (async function init() {
    const ui = buildUI();
    if (!ui) return;
    let films;
    try { films = await loadData(); } catch(e){ console.error("films.json introuvable:", e); return; }
    if (!Array.isArray(films) || films.length === 0) return;

    enhanceCards(films);
    const maxPrice = Math.max(...films.map(f => Number(f.price) || 0), 50);
    ui.price.max = String(maxPrice);
    ui.price.value = String(maxPrice);
    const strong = ui.price.previousElementSibling.querySelector("strong");
    if (strong) strong.textContent = EURO(maxPrice);

    buildDayButtons(films, ui.gDay);
    startFiltering(ui);
  })();
});
