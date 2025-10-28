const tbody = document.getElementById('cart-body');
const totalEl = document.getElementById('cart-total');

function renderCart(){
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  if (!tbody || !totalEl) return;
  tbody.innerHTML = '';
  let total = 0;
  cart.forEach((item, index) => {
    total += item.price * item.qty;
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${item.product}</td>
      <td>${item.size}</td>
      <td>${item.price.toFixed(2)} €</td>
      <td>
        <div class="qty-controls">
          <button class="qty-btn" data-action="dec" aria-label="Diminuer quantité">–</button>
          <span>${item.qty}</span>
          <button class="qty-btn" data-action="inc" aria-label="Augmenter quantité">+</button>
        </div>
      </td>
      <td>
        <button class="delete-btn" aria-label="Supprimer l'article">Supprimer</button>
      </td>
    `;
    const decBtn = tr.querySelector('[data-action="dec"]');
    const incBtn = tr.querySelector('[data-action="inc"]');
    const delBtn = tr.querySelector('.delete-btn');

    incBtn.addEventListener('click', () => {
      item.qty += 1; cart[index] = item;
      localStorage.setItem('cart', JSON.stringify(cart));
      renderCart();
    });

    decBtn.addEventListener('click', () => {
      if (item.qty <= 1) {
        const ok = confirm('La quantité va passer à 0 et supprimer l’article. Confirmer ?');
        if (!ok) return;
        cart.splice(index, 1);
      } else {
        item.qty -= 1; cart[index] = item;
      }
      localStorage.setItem('cart', JSON.stringify(cart));
      renderCart();
    });

    delBtn.addEventListener('click', () => {
      const ok = confirm('Supprimer cet article du panier ?');
      if (!ok) return;
      cart.splice(index, 1);
      localStorage.setItem('cart', JSON.stringify(cart));
      renderCart();
    });

    tbody.appendChild(tr);
  });
  totalEl.textContent = `${total.toFixed(2)} €`;
}

document.addEventListener('DOMContentLoaded', renderCart);
