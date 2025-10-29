// Static catalog, prices, and constants used across pages
export const VARIETIES = [
  {
    id: "nordmann",
    name: "Nordmann",
    image: "images/nordmann.webp",
    zoom: "images/nordmann-zoom.webp",
    description:
      "Le Nordmann, apprécié pour ses aiguilles souples et son excellente tenue. Odeur discrète, couleur vert profond, port régulier, très répandu dans les foyers modernes.",
    prices: [
      { size: 100, price: 30 },
      { size: 150, price: 45 },
      { size: 200, price: 65 },
      { size: 250, price: 100 },
      { size: 300, price: 160 }
    ]
  },
  {
    id: "epicea",
    name: "Épicéa",
    image: "images/epicea.webp",
    zoom: "images/epicea-zoom.webp",
    description:
      "L’Épicéa traditionnel, odeur résineuse marquée, belles nuances de vert, silhouette conique classique. Une valeur sûre pour la magie de Noël.",
    prices: [
      { size: 100, price: 15 },
      { size: 150, price: 25 },
      { size: 200, price: 35 },
      { size: 250, price: 50 },
      { size: 300, price: 70 }
    ]
  },
  {
    id: "pungens",
    name: "Pungens",
    image: "images/pungens.webp",
    zoom: "images/pungens-zoom.webp",
    description:
      "Le Pungens (sapin bleu), teinte bleutée et allure majestueuse. Odeur fraiche, port élégant, idéal pour un style distingué.",
    prices: [
      { size: 100, price: 35 },
      { size: 150, price: 55 },
      { size: 200, price: 80 },
      { size: 250, price: 110 },
      { size: 300, price: 170 }
    ]
  }
];

export const RETURNS_PARTICULIERS = [
  { range: "100–300 cm", price: 30 },
  { range: "300–500 cm", price: 50 }
];

export const RETURNS_PROS = [
  { range: "100–300 cm", price: 60 },
  { range: "300–500 cm", price: 100 }
];

export const PRO_INSTALL_HT = [
  { size: "100 cm", priceHT: 45 },
  { size: "150 cm", priceHT: 60 },
  { size: "200 cm", priceHT: 85 },
  { size: "250 cm", priceHT: 120 },
  { size: "300 cm", priceHT: 170 },
  { size: "350 cm", priceHT: 220 },
  { size: "400 cm", priceHT: 290 },
  { size: "450 cm", priceHT: 360 },
  { size: "500 cm", priceHT: 440 }
];

export const DELIVERY_FREE_NOTE = "Livraison à domicile (hors Corse) : frais offerts.";
export const ORDER_DATES = ["4 décembre", "11 décembre", "18 décembre"];
