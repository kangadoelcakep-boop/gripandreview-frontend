console.log("🚀 review.js start");

document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ DOM ready, init review.js");

  const emailForm = document.getElementById("email-validate-form");
  const emailInput = document.getElementById("validate-email");
  const validationMessage = document.getElementById("validation-message");
  const reviewForm = document.getElementById("review-form");

  if (!emailForm) {
    console.error("❌ Form email (#email-validate-form) tidak ditemukan!");
    return;
  }

  console.log("🔍 Form email ditemukan:", emailForm);

  // Listener validasi email
  emailForm.addEventListener("submit", async (e) => {
    console.log("👉 Listener SUBMIT kepanggil");
    e.preventDefault();

    const email = emailInput.value.trim();
    console.log("📩 Submit validasi email:", email);

    if (!email) {
      validationMessage.textContent = "Email tidak boleh kosong!";
      validationMessage.style.color = "red";
      return;
    }

    validationMessage.textContent = "⏳ Validasi email...";
    validationMessage.style.color = "blue";

    // Dummy sukses
    setTimeout(() => {
      validationMessage.textContent = "✅ Email valid!";
      validationMessage.style.color = "green";
      emailForm.style.display = "none";
      reviewForm.style.display = "block";
    }, 1000);
  });
});
