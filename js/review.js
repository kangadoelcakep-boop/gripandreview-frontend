console.log("🚀 review.js start");

document.addEventListener("DOMContentLoaded", () => {
  const validateForm = document.getElementById("email-validate-form");
  const validationMessage = document.getElementById("validation-message");
  const reviewForm = document.getElementById("review-form");

  if (validateForm) {
    validateForm.addEventListener("submit", async (e) => {
      e.preventDefault(); // ⛔ cegah refresh halaman
      console.log("✅ Validasi form submit handler jalan");

      const email = document.getElementById("validate-email").value.trim();

      if (!email) {
        validationMessage.textContent = "⚠️ Email wajib diisi";
        validationMessage.style.color = "red";
        return;
      }

      try {
        // 🔹 Panggil API validasi email (dummy dulu)
        console.log("🔍 Cek email:", email);

        // misal sukses → tampilkan form review
        validationMessage.textContent = "✅ Email valid. Silakan tulis review.";
        validationMessage.style.color = "green";
        reviewForm.style.display = "block";

      } catch (err) {
        console.error("❌ Error validasi email:", err);
        validationMessage.textContent = "❌ Terjadi error saat validasi.";
        validationMessage.style.color = "red";
      }
    });
  }

  // --- Handler review form ---
  if (reviewForm) {
    reviewForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      console.log("✍️ Review form submit handler jalan");

      const nama = document.getElementById("nama").value.trim();
      const rating = document.getElementById("rating").value;
      const reviewText = document.getElementById("reviewText").value.trim();
      const marketplace = document.getElementById("marketplace").value;
      const seller = document.getElementById("seller").value.trim();

      if (!nama || !rating || !reviewText || !marketplace || !seller) {
        alert("⚠️ Semua field wajib diisi.");
        return;
      }

      try {
        console.log("📤 Kirim review:", { nama, rating, reviewText, marketplace, seller });
        alert("✅ Review berhasil dikirim!");
        reviewForm.reset();
        document.getElementById("rating").value = 0;
      } catch (err) {
        console.error("❌ Error submit review:", err);
        alert("❌ Gagal mengirim review.");
      }
    });
  }
});
