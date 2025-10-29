import { API_BASE } from "./config.js";
import { VARIETIES } from "./data.js";

// --- Utilities ---
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

const storage = {
  get(key, def = null) {
    try {
      const v = localStorage.getItem(key);
      return v ? JSON.parse(v) : def;
    } catch {
      return def;
    }
  },
  set(key, val) {
    localStorage.setItem(key, JSON.stringify(val));
  },
  remove(key) {
    localStorage.removeItem(key);
  }
};

// --- Cookie banner ---
export function initCookies() {
  const accepted = storage.get("cookiesAccepted", false);
  const banner = $("#cookie-banner");
  if (!banner) return;

  const onHome = location.pathname.endsWith("index.html") || location.pathname === "/" || location.pathname === "";

  const shouldShow = !accepted || (onHome && !document.referrer.includes(location.hostname));
  banner.style.display = shouldShow ? "block" : "none";

  $("#cookie-accept")?.addEventListener("click", () => {
    storage.set("cookiesAccepted", true);
    banner.style.display = "none";
  });
  $("#cookie-more")?.addEventListener("click", () => {
    location.href = "mentions-legales.html";
  });
}

// --- Cart management ---
const CART_KEY = "ev_cart";

export function getCart() {
  return storage.get(CART_KEY, []);
}

export function cartCount() {
  return getCart().reduce((sum, item) => sum + item.qty, 0);
}

export function setCart(items) {
  storage.set(CART_KEY, items);
  updateCartBadge();
}

export function updateCartBadge() {
  const badge = $("#cart-count");
  if (badge) badge.textContent = cartCount();
}

export function addToCart({ varietyId, varietyName, size, unitPrice }) {
  const cart = getCart();
  const idx = cart.findIndex(i => i.varietyId === varietyId && i.size === size);
  if (idx >= 0) {
    cart[idx].qty += 1;
    cart[idx].subtotal = cart[idx].qty * cart[idx].unitPrice;
  } else {
    cart.push({
      varietyId,
      varietyName,
      size,
      unitPrice,
      qty: 1,
      subtotal: unitPrice
    });
  }
  setCart(cart);
}

export function removeFromCart(index) {
  const cart = getCart();
  cart.splice(index, 1);
  setCart(cart);
}

export function changeQty(index, delta) {
  const cart = getCart();
  cart[index].qty += delta;
  if (cart[index].qty <= 0) {
    const ok = confirm("Confirmez-vous la suppression de cet article ?");
    if (ok) removeFromCart(index);
    return;
  }
  cart[index].subtotal = cart[index].qty * cart[index].unitPrice;
  setCart(cart);
}

// --- API helper (demo mode supported) ---
async function postJSON(path, payload) {
  if (!API_BASE) {
    await new Promise(res => setTimeout(res, 600));
    return { ok: true, demo: true };
  }
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || "Erreur serveur");
  return data;
}

// --- Form validation helpers ---
export function setError(el, msg) {
  const hint = el.parentElement.querySelector(".field-error");
  if (hint) {
    hint.textContent = msg || "";
    hint.style.display = msg ? "block" : "none";
  }
  el.setAttribute("aria-invalid", msg ? "true" : "false");
}

export function validateRequired(el, label = "Ce champ") {
  const v = el.value.trim();
  if (!v) {
    setError(el, `${label} est requis.`);
    return false;
  }
  setError(el, "");
  return true;
}

export function validateEmail(el) {
  const v = el.value.trim();
  const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  setError(el, ok ? "" : "Email non valide.");
  return ok;
}

export function validatePhoneFR(el) {
  const v = el.value.trim();
  const ok = /^(?:\+33|0)\s?[1-9](?:[\s.-]?\d{2}){4}$/.test(v);
  setError(el, ok ? "" : "Téléphone français non valide.");
  return ok;
}

export function validatePostalCode(el) {
  const v = el.value.trim();
  const ok = /^\d{5}$/.test(v);
  setError(el, ok ? "" : "Code postal à 5 chiffres requis.");
  return ok;
}

export function validateDateRange(el, minISO, maxISO) {
  const v = el.value;
  if (!v) {
    setError(el, "Date requise.");
    return false;
  }
  const d = new Date(v);
  const min = new Date(minISO);
  const max = new Date(maxISO);
  const ok = d >= min && d <= max;
  setError(el, ok ? "" : "Date hors intervalle autorisé.");
  return ok;
}

export function validateHourRange(el, min = 6, max = 20) {
  const v = el.value;
  if (!v) {
    setError(el, "Heure requise.");
    return false;
  }
  const [hh, mm] = v.split(":").map(Number);
  const ok = hh >= min && hh <= max;
  setError(el, ok ? "" : "Heure hors plage autorisée (6h–20h).");
  return ok;
}

// --- Page-specific initializers ---
export function initHeaderFooter() {
  updateCartBadge();
  const cmdLink = $("#nav-commander");
  if (cmdLink) {
    cmdLink.classList.add("btn", "btn-accent");
  }
}

export function initSnow() {
  // Optional: minimal snow overlay (non-intrusive)
  const canvas = document.createElement("canvas");
  canvas.id = "snow";
  canvas.setAttribute("aria-hidden", "true");
  document.body.appendChild(canvas);
  import("./snow.js").then(mod => mod.startSnow(canvas));
}

// --- Nos Sapins interactions ---
export function initNosSapins() {
  $$(".buy-btn").forEach(btn => {
    btn.addEventListener("click", e => {
      const { varietyId, varietyName, size, price } = e.currentTarget.dataset;
      addToCart({
        varietyId,
        varietyName,
        size: Number(size),
        unitPrice: Number(price)
      });
      const original = btn.textContent;
      btn.textContent = "Ajouté";
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = original;
        btn.disabled = false;
      }, 1400);
    });
  });
}

// --- Product page interactions ---
export function initProductPage(varietyId) {
  const variety = VARIETIES.find(v => v.id === varietyId);
  if (!variety) return;
  const container = $("#product-lines");
  if (!container) return;

  container.innerHTML = variety.prices
    .map(
      p => `
      <div class="product-line">
        <div class="line-left">
          <span class="size">${p.size} cm</span>
          <span class="price">${p.price} €</span>
        </div>
        <button class="btn buy-btn"
          data-variety-id="${variety.id}"
          data-variety-name="${variety.name}"
          data-size="${p.size}"
          data-price="${p.price}">
          Ajouter
        </button>
      </div>
    `
    )
    .join("");

  initNosSapins();
}

// --- Cart page ---
export function renderCartTable() {
  const cart = getCart();
  const tbody = $("#cart-tbody");
  const totalItems = $("#cart-total-items");
  const totalPrice = $("#cart-total-price");
  if (!tbody) return;

  tbody.innerHTML = cart
    .map(
      (item, idx) => `
      <tr>
        <td>${item.varietyName}</td>
        <td>${item.size} cm</td>
        <td>${item.unitPrice} €</td>
        <td>
          <button class="qty-btn" aria-label="Retirer un">${"-"}</button>
          <span class="qty">${item.qty}</span>
          <button class="qty-btn" aria-label="Ajouter un">${"+"}</button>
        </td>
        <td>${item.subtotal} €</td>
        <td>
          <button class="link danger remove-btn">Supprimer</button>
        </td>
      </tr>
    `
    )
    .join("");

  const totalQty = cart.reduce((s, i) => s + i.qty, 0);
  const total = cart.reduce((s, i) => s + i.subtotal, 0);

  totalItems.textContent = totalQty;
  totalPrice.textContent = `${total} €`;

  // Attach events
  $$("#cart-tbody tr").forEach((row, idx) => {
    const [minusBtn, plusBtn] = row.querySelectorAll(".qty-btn");
    const removeBtn = row.querySelector(".remove-btn");
    minusBtn.addEventListener("click", () => {
      changeQty(idx, -1);
      renderCartTable();
    });
    plusBtn.addEventListener("click", () => {
      changeQty(idx, +1);
      renderCartTable();
    });
    removeBtn.addEventListener("click", () => {
      const ok = confirm("Supprimer cet article ?");
      if (ok) {
        removeFromCart(idx);
        renderCartTable();
      }
    });
  });
}

// --- Commander page ---
export function initCommanderForm() {
  const cart = getCart();
  const tbody = $("#order-tbody");
  const form = $("#order-form");
  const submitBtn = $("#order-submit");
  const successMsg = $("#order-success");

  if (tbody) {
    tbody.innerHTML = cart
      .map(
        item => `
        <tr>
          <td>${item.varietyName}</td>
          <td>${item.size} cm</td>
          <td>${item.unitPrice} €</td>
          <td>${item.qty}</td>
          <td>${item.subtotal} €</td>
        </tr>
      `
      )
      .join("");
  }

  if (!form) return;

  const nameEl = $("#name");
  const phoneEl = $("#phone");
  const emailEl = $("#email");
  const streetNoEl = $("#streetNo");
  const streetEl = $("#street");
  const zipEl = $("#zip");
  const cityEl = $("#city");
  const dateEl = $("#date");

  // Inline validation on blur
  [
    [nameEl, () => validateRequired(nameEl, "Nom")],
    [phoneEl, () => validatePhoneFR(phoneEl)],
    [emailEl, () => validateEmail(emailEl)],
    [streetNoEl, () => validateRequired(streetNoEl, "Numéro")],
    [streetEl, () => validateRequired(streetEl, "Voie")],
    [zipEl, () => validatePostalCode(zipEl)],
    [cityEl, () => validateRequired(cityEl, "Ville")],
    [dateEl, () => validateRequired(dateEl, "Date")]
  ].forEach(([el, fn]) => el?.addEventListener("blur", fn));

  form.addEventListener("submit", async e => {
    e.preventDefault();
    const ok =
      validateRequired(nameEl, "Nom") &&
      validatePhoneFR(phoneEl) &&
      validateEmail(emailEl) &&
      validateRequired(streetNoEl, "Numéro") &&
      validateRequired(streetEl, "Voie") &&
      validatePostalCode(zipEl) &&
      validateRequired(cityEl, "Ville") &&
      validateRequired(dateEl, "Date");

    if (!ok) return;

    submitBtn.disabled = true;
    submitBtn.textContent = "Traitement de la commande";

    try {
      await postJSON("/api/commande", {
        cart,
        customer: {
          name: nameEl.value.trim(),
          phone: phoneEl.value.trim(),
          email: emailEl.value.trim(),
          address: {
            streetNo: streetNoEl.value.trim(),
            street: streetEl.value.trim(),
            zip: zipEl.value.trim(),
            city: cityEl.value.trim()
          }
        },
        date: dateEl.value
      });
      successMsg.textContent = "Merci de votre commande";
      successMsg.style.display = "block";
      // Empty cart
      setCart([]);
      setTimeout(() => {
        location.href = "index.html";
      }, 900);
    } catch (err) {
      alert("Une erreur est survenue. Réessayez plus tard.");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Commander";
    }
  });
}

// --- Contact page ---
export function initContactForm() {
  const form = $("#contact-form");
  if (!form) return;
  const nameEl = $("#c-name");
  const emailEl = $("#c-email");
  const msgEl = $("#c-message");
  const successMsg = $("#contact-success");

  [nameEl, emailEl, msgEl].forEach(el =>
    el.addEventListener("blur", () => validateRequired(el, el.getAttribute("data-label")))
  );
  emailEl.addEventListener("blur", () => validateEmail(emailEl));

  form.addEventListener("submit", async e => {
    e.preventDefault();
    const ok =
      validateRequired(nameEl, "Nom") &&
      validateEmail(emailEl) &&
      validateRequired(msgEl, "Message");
    if (!ok) return;

    try {
      await postJSON("/api/contact", {
        name: nameEl.value.trim(),
        email: emailEl.value.trim(),
        message: msgEl.value.trim()
      });
      successMsg.textContent = "Votre message a bien été envoyé";
      successMsg.style.display = "block";
      form.reset();
      setTimeout(() => (successMsg.style.display = "none"), 1500);
    } catch {
      alert("Impossible d'envoyer le message pour le moment.");
    }
  });
}

// --- Espace pro ---
export function initProForm() {
  const form = $("#pro-form");
  if (!form) return;
  const typeEls = $$("input[name='orgType']");
  const otherEl = $("#orgOther");

  const nameEl = $("#p-name");
  const phoneEl = $("#p-phone");
  const emailEl = $("#p-email");

  const hqStreetEl = $("#hq-street");
  const hqZipEl = $("#hq-zip");
  const hqCityEl = $("#hq-city");

  const dlStreetEl = $("#dl-street");
  const dlZipEl = $("#dl-zip");
  const dlCityEl = $("#dl-city");

  const dayEl = $("#p-day");
  const hourEl = $("#p-hour");
  const successMsg = $("#pro-success");

  // Validations
  typeEls.forEach(r =>
    r.addEventListener("change", () => {
      const otherSelected = $("#orgType-other").checked;
      otherEl.disabled = !otherSelected;
      if (!otherSelected) {
        otherEl.value = "";
        setError(otherEl, "");
      }
    })
  );

  const requiredFields = [
    [nameEl, () => validateRequired(nameEl, "Nom")],
    [phoneEl, () => validatePhoneFR(phoneEl)],
    [emailEl, () => validateEmail(emailEl)],

    [hqStreetEl, () => validateRequired(hqStreetEl, "Adresse siège")],
    [hqZipEl, () => validatePostalCode(hqZipEl)],
    [hqCityEl, () => validateRequired(hqCityEl, "Ville siège")],

    [dlStreetEl, () => validateRequired(dlStreetEl, "Adresse livraison")],
    [dlZipEl, () => validatePostalCode(dlZipEl)],
    [dlCityEl, () => validateRequired(dlCityEl, "Ville livraison")],

    [dayEl, () => validateDateRange(dayEl, `${new Date().getFullYear()}-10-15`, `${new Date().getFullYear()}-12-20`)],
    [hourEl, () => validateHourRange(hourEl, 6, 20)]
  ];

  requiredFields.forEach(([el, fn]) => el.addEventListener("blur", fn));

  form.addEventListener("submit", async e => {
    e.preventDefault();
    const typeSelected = typeEls.some(r => r.checked);
    if (!typeSelected) {
      setError(typeEls[0], "Choix obligatoire.");
      return;
    } else {
      setError(typeEls[0], "");
    }
    const otherSelected = $("#orgType-other").checked;
    if (otherSelected && !otherEl.value.trim()) {
      setError(otherEl, "Précisez le type.");
      return;
    } else {
      setError(otherEl, "");
    }

    const ok = requiredFields.every(([el, fn]) => fn());
    if (!ok) return;

    try {
      await postJSON("/api/devis", {
        orgType: otherSelected ? otherEl.value.trim() : ($("input[name='orgType']:checked")?.value || ""),
        name: nameEl.value.trim(),
        phone: phoneEl.value.trim(),
        email: emailEl.value.trim(),
        hqAddress: {
          street: hqStreetEl.value.trim(),
          zip: hqZipEl.value.trim(),
          city: hqCityEl.value.trim()
        },
        deliveryAddress: {
          street: dlStreetEl.value.trim(),
          zip: dlZipEl.value.trim(),
          city: dlCityEl.value.trim()
        },
        day: dayEl.value,
        hour: hourEl.value
      });
      successMsg.textContent = "Votre demande a bien été envoyée";
      successMsg.style.display = "block";
      setTimeout(() => {
        location.href = "index.html";
      }, 1200);
    } catch {
      alert("Erreur lors de l'envoi du devis.");
    }
  });
}
