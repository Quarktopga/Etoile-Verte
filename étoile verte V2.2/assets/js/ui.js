// Injection des composants header/footer/cookie
async function includeComponents(){
  const nodes = document.querySelectorAll('[data-include]');
  for (const node of nodes) {
    const src = node.getAttribute('data-include');
    try {
      const res = await fetch(src);
      node.outerHTML = await res.text();
    } catch {
      console.warn('Incl. échouée:', src);
    }
  }
}
includeComponents().then(() => {
  // Menu burger
  const navToggle = document.querySelector('.nav-toggle');
  const siteNav = document.getElementById('site-nav');
  if (navToggle && siteNav) {
    navToggle.addEventListener('click', () => {
      const open = siteNav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(open));
    });
  }

  // Ruban cookies (afficher uniquement sur accueil, et à chaque retour)
  const cookieBanner = document.getElementById('cookie-banner');
  const cookieAccept = document.getElementById('cookie-accept');
  if (cookieBanner && cookieAccept && document.body.classList.contains('page-accueil')) {
    cookieBanner.style.display = 'block';
    cookieAccept.addEventListener('click', () => {
      cookieBanner.style.display = 'none';
      // Pas de persistance
    });
  }
});

// Ajout au panier (boutons sur listes/fiches)
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.add-to-cart');
  if (!btn) return;
  const item = {
    product: btn.dataset.product,
    size: btn.dataset.size,
    price: parseFloat(btn.dataset.price),
    qty: 1
  };
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const idx = cart.findIndex(i => i.product === item.product && i.size === item.size && i.price === item.price);
  if (idx >= 0) cart[idx].qty += 1; else cart.push(item);
  localStorage.setItem('cart', JSON.stringify(cart));
  const fb = document.getElementById('add-feedback');
  if (fb) {
    fb.textContent = 'Ajouté au panier ✅';
    fb.style.display = 'block';
    setTimeout(() => fb.style.display = 'none', 1400);
  }
});
