console.log("🚀 review.js start");

document.addEventListener("DOMContentLoaded", () => {
  const validateForm = document.getElementById("email-validate-form");
  const validationMessage = document.getElementById("validation-message");
  const reviewForm = document.getElementById("review-form");

  console.log("🔍 Cek element:", {
    validateForm,
    validationMessage,
    reviewForm
  });

  const API_URL = window.Config?.API_URL || "https://script.google.com/macros/s/AKfycbwjJQ69NNajRuYS2_w2mZlK7zY3CHs1pbY2vJvOisRtmMZSwEZJIPcn9u4djtUCe1HqPg/exec";

  /* -------------------------
   *  VALIDASI EMAIL
   * ------------------------- */
  if (validateForm) {
    console.log("✅ Event listener validasi ditambahkan");
    validateForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      console.log("✅ Validasi form submit jalan");

      const emailInput = document.getElementById("validate-email");
      if (!emailInput) {
        console.error("❌ Input email tidak ditemukan");
        return;
      }

      const email = emailInput.value.trim();
      if (!email) {
        validationMessage.textContent = "⚠️ Email wajib diisi";
        validationMessage.style.color = "red";
        return;
      }

      try {
        const res = await fetch(`${API_URL}/validate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email })
        });

        const data = await res.json();
        console.log("📩 Hasil validasi:", data);

        if (data.status === "ok" && data.state === "approved") {
          validationMessage.textContent = "✅ Email valid. Silakan tulis review.";
          validationMessage.style.color = "green";
          reviewForm.style.display = "block";
        } else if (data.status === "ok" && data.state === "pending") {
          validationMessage.textContent = "⏳ Cek email Anda untuk konfirmasi terlebih dahulu.";
          validationMessage.style.color = "orange";
        } else if (data.status === "not_found") {
          validationMessage.textContent = "❌ Email belum terdaftar. Silakan Join dulu.";
          validationMessage.style.color = "red";
        } else {
          validationMessage.textContent = data.message || "❌ Terjadi kesalahan validasi.";
          validationMessage.style.color = "red";
        }
      } catch (err) {
        console.error("❌ Error validasi email:", err);
        validationMessage.textContent = "❌ Gagal terhubung ke server.";
        validationMessage.style.color = "red";
      }
    });
  } else {
    console.error("❌ Form email-validate-form tidak ditemukan di DOM");
  }
});
