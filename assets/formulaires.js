// ===============================
// Initialisation de Supabase
// ===============================
const SUPABASE_URL = "https://rjlqpysextxzjcmzcmdy.supabase.co"; // <-- ton URL Supabase
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqbHFweXNleHR4empjbXpjbWR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE3Mzk3NTIsImV4cCI6MjA3NzMxNTc1Mn0.7MgzB1Pzr1L2q6GNhLJO2ZIwXZdlnFHZI7fMkhLzXR0"; // <-- ta clé anon (Settings > API)
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ===============================
// Formulaire de contact (contact.html)
// ===============================
const contactForm = document.getElementById("contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const { error } = await supabase.from("contact_messages").insert({
      name: e.target.name.value,
      email: e.target.email.value,
      message: e.target.message.value,
    });
    const successBox = document.getElementById("contact-success");
    if (error) {
      successBox.style.display = "block";
      successBox.style.color = "red";
      successBox.textContent = "Erreur : " + error.message;
    } else {
      successBox.style.display = "block";
      successBox.style.color = "#2F7A3E";
      successBox.textContent = "Message envoyé avec succès !";
      e.target.reset();
    }
  });
}

// ===============================
// Formulaire de commande (commander.html)
// ===============================
const orderForm = document.getElementById("order-form");
if (orderForm) {
  orderForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const { error } = await supabase.from("orders").insert({
      name: e.target.name.value,
      phone: e.target.phone.value,
      email: e.target.email.value,
      streetNo: e.target.streetNo.value,
      street: e.target.street.value,
      zip: e.target.zip.value,
      city: e.target.city.value,
      date: e.target.date.value,
    });
    const successBox = document.getElementById("order-success");
    if (error) {
      successBox.style.display = "block";
      successBox.style.color = "red";
      successBox.textContent = "Erreur : " + error.message;
    } else {
      successBox.style.display = "block";
      successBox.style.color = "#2F7A3E";
      successBox.textContent = "Commande envoyée avec succès !";
      e.target.reset();
    }
  });
}

// ===============================
// Formulaire de devis pro (espace-pro.html)
// ===============================
const proForm = document.getElementById("pro-form");
if (proForm) {
  proForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const { error } = await supabase.from("quotes").insert({
      orgType: proForm.orgType.value,
      orgOther: proForm.orgOther?.value || "",
      name: e.target.name.value,
      phone: e.target.phone.value,
      email: e.target.email.value,
      hq_street: e.target.hq_street.value,
      hq_zip: e.target.hq_zip.value,
      hq_city: e.target.hq_city.value,
      dl_street: e.target.dl_street.value,
      dl_zip: e.target.dl_zip.value,
      dl_city: e.target.dl_city.value,
      day: e.target.day.value,
      hour: e.target.hour.value,
    });
    const successBox = document.getElementById("pro-success");
    if (error) {
      successBox.style.display = "block";
      successBox.style.color = "red";
      successBox.textContent = "Erreur : " + error.message;
    } else {
      successBox.style.display = "block";
      successBox.style.color = "#2F7A3E";
      successBox.textContent = "Demande de devis envoyée avec succès !";
      e.target.reset();
    }
  });
}
