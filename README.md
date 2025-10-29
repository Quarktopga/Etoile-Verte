[readme.md](https://github.com/user-attachments/files/23211983/readme.md)
# 🌲 Étoile Verte — Site de démonstration

**Étoile Verte** est un site web fictif illustrant la vitrine d’une entreprise de sapins de Noël cultivés en France.
Ce projet a été conçu à partir d’un cahier des charges complet, avec un design simple, responsive et accessible.
Il ne s’agit pas d’un site marchand réel : aucun paiement ou envoi n’est effectué.

---

## 🎯 Objectif du projet

* Simuler un site e-commerce statique complet (vitrine + panier + commande).
* Respecter les bonnes pratiques UX, accessibilité et SEO.
* Fournir une base claire pour un futur développement professionnel.

---

## 🧱 Structure du projet

```
etoile-verte/
├─ index.html
├─ nos-sapins.html
├─ produit-nordmann.html
├─ produit-epicea.html
├─ produit-pungens.html
├─ services.html
├─ espace-pro.html
├─ engagements.html
├─ panier.html
├─ commander.html
├─ contact.html
├─ faq.html
├─ cgv.html
├─ mentions-legales.html
├─ plan-du-site.html
├─ 404.html
├─ assets/
│  ├─ css/
│  │  └─ styles.css
│  ├─ js/
│  │  ├─ config.js
│  │  └─ app.js
│  └─ images/
│     ├─ logo.png
│     ├─ paysage.webp
│     ├─ nordmann.webp
│     ├─ nordmann-zoom.webp
│     ├─ epicea.webp
│     ├─ pungens.webp
│     └─ autres visuels…
└─ README.md
```

---

## ⚙️ Technologies utilisées

* **HTML5** — structure sémantique, accessible.
* **CSS3** — design responsive, charte verte naturelle.
* **JavaScript Vanilla** — interactions (panier, formulaires, cookies).
* **LocalStorage** — stockage client des données du panier.
* **GitHub Pages / Netlify** — hébergement statique.

---

## 🛒 Fonctionnalités principales

| Fonction      | Description                                                 |
| ------------- | ----------------------------------------------------------- |
| Panier        | Ajout / suppression d’articles, calcul automatique du total |
| Commande      | Formulaire complet avec validation des champs               |
| Espace pro    | Formulaire de demande de devis                              |
| Contact       | Formulaire de message avec validation                       |
| Cookies       | Bandeau d’acceptation conforme RGPD                         |
| Accessibilité | Focus visible, balises ARIA, contraste vérifié              |
| Mode démo     | Toutes les requêtes API sont simulées côté client           |

---

## 🚀 Lancer le site en local

1. Télécharge le dossier complet du projet.
2. Ouvre `index.html` dans ton navigateur.
   → Le site est immédiatement fonctionnel (aucun serveur requis).

Pour une prévisualisation locale avec rafraîchissement automatique :

```bash
npx serve .
```

puis ouvre [http://localhost:3000/](http://localhost:3000/)

---

## 🌐 Déploiement sur GitHub Pages

1. Crée un dépôt nommé `etoile-verte`.
2. Glisse tous les fichiers du projet dans le dépôt.
3. Active **GitHub Pages** dans `Settings → Pages → Source → Branch main`.
4. Ton site sera accessible à l’adresse :

   ```
   https://<ton-identifiant>.github.io/etoile-verte/
   ```

---

## 🧩 Configuration API (optionnelle)

Le site peut communiquer avec un back-end via `assets/js/config.js` :

```js
window.APP_CONFIG = {
  API_BASE: "https://api.monsite.fr",
  DEMO_MODE: false
};
```

En mode démo (`DEMO_MODE: true`), les formulaires simulent une réponse serveur.

---

## 🪪 Crédits et licence

* Conception et développement : Projet de démonstration pédagogique.
* Images libres de droits (Unsplash / Pixabay).
* Licence : **MIT** (utilisation libre avec attribution).

---

## 💡 À venir

* Version dynamique avec base de données et authentification.
* Interface d’administration pour la gestion des produits.
* Calcul automatique des frais de livraison.
* Panneau d’accessibilité étendu (mode contraste, police adaptée).

---

> 🧭 *Étoile Verte* : la tradition de Noël, cultivée avec sens et technologie.
