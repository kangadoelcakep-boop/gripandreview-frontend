console.log("🚀 review.js start");

document.addEventListener("DOMContentLoaded", () => {
  const validateForm = document.getElementById("email-validate-form");
  const validationMessage = document.getElementById("validation-message");
  const reviewForm = document.getElementById("review-form");

  const API_URL = window.Config?.API_URL || "https://script.google.com/macros/s/AKfycbxxxx/exec";

  /* -------------------------
   *  VALIDASI EMAIL
   * ------------------------- */
  if (validateForm) {
    validateForm.addEventListener("submit", async (e) => {
      e.preventDefault(); // cegah reload halaman
      console.log("✅ Validasi form submit jalan");

      const email = document.getElementById("validate-email").value.trim();
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
  }

  /* -------------------------
   *  KIRIM REVIEW
   * ------------------------- */
  if (reviewForm) {
    reviewForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      console.log("✍️ Review form submit jalan");

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
        const res = await fetch(`${API_URL}/review`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "review",      // penting! backend butuh "type"
            name: nama,
            email: document.getElementById("validate-email").value.trim(),
            rating: parseInt(rating),
            text: reviewText,
            marketplace,
            seller,
            postUrl: window.location.href
          })
        });

        const data = await res.json();
        console.log("📤 Hasil kirim review:", data);

        if (data.status === "ok") {
          alert("✅ Review berhasil dikirim!");
          reviewForm.reset();
          document.getElementById("rating").value = 0;
        } else {
          alert("❌ Gagal mengirim review: " + (data.message || ""));
        }
      } catch (err) {
        console.error("❌ Error submit review:", err);
        alert("❌ Gagal terhubung ke server.");
      }
    });
  }
});
