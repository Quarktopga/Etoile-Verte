/* Étoile Verte — Warm, green, reliable
   - Burger menu + sticky nav
   - Hero image per page
   - Cookies banner (persist accept)
   - Cart (localStorage): add, inc/dec to 0, remove, empty
   - Cart rendering on panier.html
   - Checkout summary + targeted validation + test disclaimer
   - Contact form warm intro + checkbox "devis"
   - Accessibility basics
*/

const CART_KEY = 'etoileverte_cart';
const COOKIES_KEY = 'etoileverte_cookies_accept';

/* Init */
document.addEventListener('DOMContentLoaded', () => {
  setupBurger();
  injectHeroImage();
  setupCookiesBanner();
  updateCartCount();
  bindAddToCartButtons();

  if (isPage('panier.html')) renderCart();
  if (isPage('commander.html')) setupCheckout();
  if (isPage('contact.html')) setupContactForm();
});

/* Helpers */
function isPage(name){ return location.pathname.endsWith(name); }
function readCart(){
  try{ const raw = localStorage.getItem(CART_KEY); return raw ? JSON.parse(raw) : []; }
  catch(e){ return []; }
}
function writeCart(items){
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  updateCartCount();
}
function cap(s){ return (s||'').charAt(0).toUpperCase() + (s||'').slice(1); }
function formatEuro(n){
  try{ return (n).toLocaleString('fr-FR', {style:'currency', currency:'EUR'}); }
  catch(e){ return `${Number(n).toFixed(2)} €`; }
}

/* Burger menu */
function setupBurger(){
  const burger = document.querySelector('.burger');
  const nav = document.querySelector('.site-nav');
  if(!burger || !nav) return;
  burger.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
}

/* Hero image injection (redundant safeguard if HTML misses inline var) */
function injectHeroImage(){
  const hero = document.querySelector('.hero');
  if(!hero) return;
  if(hero.style.getPropertyValue('--hero-image')) return;
  const path = location.pathname.split('/').pop();
  const isAccueil = path === '' || path === 'accueil.html' || path === 'index.html';
  hero.style.setProperty('--hero-image', `url('images/${isAccueil ? 'accueil.jpg' : 'sylviculture.jpg'}')`);
}

/* Cookies banner */
function setupCookiesBanner(){
  if(localStorage.getItem(COOKIES_KEY) === 'yes') return;
  const banner = document.createElement('div');
  banner.className = 'cookies-banner';
  banner.innerHTML = `
    <p>Ce site utilise des cookies techniques nécessaires à son bon fonctionnement. En poursuivant votre navigation, vous acceptez leur utilisation.</p>
    <div class="cookies-actions">
      <button class="btn btn-outline" id="cookies-more">En savoir plus</button>
      <button class="btn btn-primary" id="cookies-accept">J'accepte</button>
    </div>
  `;
  document.body.appendChild(banner);
  document.getElementById('cookies-accept').addEventListener('click', () => {
    localStorage.setItem(COOKIES_KEY, 'yes');
    banner.remove();
  });
  document.getElementById('cookies-more').addEventListener('click', () => {
    window.location.href = 'mentions-legales.html';
  });
}

/* Cart badge */
function updateCartCount(){
  document.querySelectorAll('#cart-count').forEach(countEl => {
    const items = readCart();
    const totalQty = items.reduce((sum, it) => sum + it.qty, 0);
    countEl.textContent = totalQty;
  });
}

/* Add-to-cart bindings */
function bindAddToCartButtons(){
  document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.dataset.type;
      const size = btn.dataset.size;
      const price = parseFloat(btn.dataset.price || '0');
      addItemToCart({type, size, price});
      btn.classList.add('pulse');
      setTimeout(() => btn.classList.remove('pulse'), 450);
    });
  });
}

/* Add/merge items */
function addItemToCart({type, size, price}){
  const items = readCart();
  const key = `${type}:${size}`;
  const found = items.find(it => `${it.type}:${it.size}` === key);
  if(found){ found.qty += 1; }
  else { items.push({type, size, price, qty: 1}); }
  writeCart(items);
}

/* Cart page */
function renderCart(){
  const body = document.getElementById('cart-body');
  const totalEl = document.getElementById('cart-total');
  const table = document.getElementById('cart-table');
  const empty = document.getElementById('cart-empty');
  const emptyBtn = document.getElementById('empty-cart');

  function refresh(){
    const data = readCart();
    body.innerHTML = '';
    if(data.length === 0){
      table.classList.add('hidden');
      empty.classList.remove('hidden');
      totalEl.textContent = '0,00 €';
      return;
    }
    table.classList.remove('hidden');
    empty.classList.add('hidden');
    let total = 0;
    data.forEach((it, idx) => {
      const row = document.createElement('tr');
      const sub = it.price * it.qty;
      total += sub;
      row.innerHTML = `
        <td>${cap(it.type)}</td>
        <td>${cap(it.size)}</td>
        <td>${formatEuro(it.price)}</td>
        <td>
          <div class="qty-controls">
            <button class="btn btn-ghost btn-sm" data-action="dec" data-idx="${idx}" aria-label="Diminuer">–</button>
            <span class="qty">${it.qty}</span>
            <button class="btn btn-ghost btn-sm" data-action="inc" data-idx="${idx}" aria-label="Augmenter">+</button>
          </div>
        </td>
        <td>${formatEuro(sub)}</td>
        <td><button class="btn btn-danger btn-sm" data-action="remove" data-idx="${idx}">Supprimer</button></td>
      `;
      body.appendChild(row);
    });
    totalEl.textContent = formatEuro(total);

    body.querySelectorAll('button[data-action]').forEach(b => {
      b.addEventListener('click', () => {
        const idx = parseInt(b.dataset.idx, 10);
        const action = b.dataset.action;
        const arr = readCart();
        if(action === 'inc'){
          arr[idx].qty += 1;
        } else if(action === 'dec'){
          arr[idx].qty -= 1;
          if(arr[idx].qty <= 0){
            arr.splice(idx, 1);
          }
        } else if(action === 'remove'){
          arr.splice(idx, 1);
        }
        writeCart(arr);
        refresh();
      });
    });
  }

  emptyBtn?.addEventListener('click', () => {
    const ok = confirm('Voulez-vous vraiment vider le panier ?');
    if(!ok) return;
    writeCart([]);
    refresh();
  });

  refresh();
}

/* Checkout page */
function setupCheckout(){
  // Summary
  const summaryEl = document.getElementById('checkout-summary');
  const items = readCart();
  if(items.length === 0){
    summaryEl.innerHTML = `<p>Votre panier est vide.</p><p><a class="btn btn-primary" href="nos-sapins.html">Choisir un sapin</a></p>`;
  } else {
    const list = document.createElement('ul');
    list.style.listStyle = 'none'; list.style.padding = '0';
    let total = 0;
    items.forEach(it => {
      const li = document.createElement('li');
      const sub = it.price * it.qty;
      total += sub;
      li.textContent = `${cap(it.type)} (${cap(it.size)}) × ${it.qty} — ${formatEuro(sub)}`;
      list.appendChild(li);
    });
    const tot = document.createElement('p');
    tot.innerHTML = `<strong>Total : ${formatEuro(total)}</strong>`;
    summaryEl.innerHTML = '';
    summaryEl.appendChild(list);
    summaryEl.appendChild(tot);
  }

  // Validation
  const form = document.getElementById('checkout-form');
  const success = document.getElementById('checkout-success');
  const payBtn = document.getElementById('pay-btn');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const fields = {
      name: document.getElementById('name'),
      email: document.getElementById('email'),
      phone: document.getElementById('phone'),
      address: document.getElementById('address'),
      date: document.getElementById('date'),
    };
    let valid = true;

    form.querySelectorAll('.error').forEach(s => s.textContent = '');

    if(!isValidName(fields.name.value)){
      setError(fields.name, 'Veuillez entrer un nom complet lisible.');
      valid = false;
    }
    if(!isValidEmail(fields.email.value)){
      setError(fields.email, 'Veuillez entrer une adresse email valide.');
      valid = false;
    }
    if(!isValidFrenchPhone(fields.phone.value)){
      setError(fields.phone, 'Veuillez entrer un numéro de téléphone français valide.');
      valid = false;
    }
    if(!isValidAddress(fields.address.value)){
      setError(fields.address, 'Veuillez entrer une adresse complète (numéro, voie, code postal, ville).');
      valid = false;
    }
    if(!isValidDate(fields.date.value)){
      setError(fields.date, 'Veuillez choisir une date de livraison valide.');
      valid = false;
    }

    if(!valid) return;

    payBtn.disabled = true;
    payBtn.textContent = 'Paiement en cours…';

    setTimeout(() => {
      success.classList.remove('hidden');
      writeCart([]);
      updateCartCount();
      setTimeout(() => { window.location.href = 'accueil.html'; }, 2000);
    }, 1200);
  });
}

/* Contact form */
function setupContactForm(){
  const form = document.querySelector('.contact-form');
  if(!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.querySelector('#c-name');
    const email = form.querySelector('#c-email');
    const message = form.querySelector('#c-message');
    const quote = form.querySelector('#c-quote');
    form.querySelectorAll('.error').forEach(s => s.textContent = '');

    let ok = true;
    if(!isValidName(name.value)){
      setError(name, 'Nom incomplet.');
      ok = false;
    }
    if(!isValidEmail(email.value)){
      setError(email, 'Email invalide.');
      ok = false;
    }
    if(!message.value || message.value.trim().length < 10){
      setError(message, 'Message trop court (10 caractères minimum).');
      ok = false;
    }
    if(!ok) return;

    const isQuote = quote?.checked ? 'Oui' : 'Non';
    alert(`Merci pour votre message.\nDemande de devis : ${isQuote}\nNous vous répondons rapidement.`);
    form.reset();
  });
}

/* Validation utils */
function setError(input, msg){
  const small = input.parentElement.querySelector('.error');
  if(small) small.textContent = msg;
}
function isValidName(s){
  if(!s) return false;
  const t = s.trim();
  return t.length >= 3 && /\w+/.test(t);
}
function isValidEmail(s){
  if(!s) return false;
  const t = s.trim();
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  return re.test(t);
}
function isValidFrenchPhone(s){
  if(!s) return false;
  const t = s.replace(/\s+/g,'');
  const re = /^(0[1-9]\d{8}|(\+33)[1-9]\d{8})$/;
  return re.test(t);
}
function isValidAddress(s){
  if(!s) return false;
  const t = s.trim();
  const hasNumber = /\d+/.test(t);
  const hasWords = /[A-Za-zÀ-ÖØ-öø-ÿ]{3,}/.test(t);
  return hasNumber && hasWords && t.length >= 8;
}
function isValidDate(s){
  if(!s) return false;
  const sel = new Date(s);
  const today = new Date();
  sel.setHours(0,0,0,0);
  today.setHours(0,0,0,0);
  return sel >= today;
}
