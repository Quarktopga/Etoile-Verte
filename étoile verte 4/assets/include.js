async function includeHTML(id, file) {
  const container = document.getElementById(id);
  if (!container) return;
  try {
    const resp = await fetch(file);
    if (!resp.ok) throw new Error("Erreur de chargement");
    container.innerHTML = await resp.text();
  } catch (e) {
    container.innerHTML = "<p style='color:red'>Impossible de charger " + file + "</p>";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  includeHTML("header-placeholder", "header.html").then(() => {
    if (typeof setupBurger === "function") setupBurger();
    if (typeof updateCartCount === "function") updateCartCount();
  });
  includeHTML("footer-placeholder", "footer.html");
});
