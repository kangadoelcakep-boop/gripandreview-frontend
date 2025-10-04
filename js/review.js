// review.js
document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ review.js loaded");

  // --- Cek API_URL ---
  if (typeof API_URL === "undefined") {
    console.error("❌ API_URL belum didefinisikan! Tambahkan di config.js atau script global.");
    return; // hentikan script
  } else {
    console.log("🔗 API_URL:", API_URL);
  }

  // Elemen
  const emailForm = document.getElementById("email-validate-form");
  const emailInput = document.getElementById("validate-email");
  const validationMessage = document.getElementById("validation-message");
  const reviewForm = document.getElementById("review-form");
  const starContainer = document.getElementById("star-rating");
  const ratingInput = document.getElementById("rating");

  console.log("🔍 Cek elemen:", {
    emailForm,
    emailInput,
    validationMessage,
    reviewForm,
    starContainer,
    ratingInput
  });

  // ---------- Step 1: Validasi Email ----------
  if (emailForm && emailInput && validationMessage) {
    emailForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = emailInput.value.trim();

      validationMessage.textContent = "⏳ Memeriksa email...";
      validationMessage.style.color = "black";

      try {
        const res = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "validateEmail", email })
        });

        if (!res.ok) throw new Error("Server response not OK");

        const data = await res.json();
        console.log("📩 Validation response:", data);

        if (data.status === "approved") {
          validationMessage.textContent = "✅ Email valid, silakan isi review.";
          validationMessage.style.color = "green";
          if (reviewForm) reviewForm.style.display = "block";
        } else if (data.status === "pending") {
          validationMessage.textContent =
            "⚠️ Email sudah terdaftar, silakan cek email Anda untuk konfirmasi.";
          validationMessage.style.color = "orange";
          if (reviewForm) reviewForm.style.display = "none";
        } else if (data.status === "not_found") {
          validationMessage.textContent =
            "❌ Email belum terdaftar. Kami sudah mengirim link konfirmasi ke email Anda.";
          validationMessage.style.color = "red";

          // auto-subscribe user
          await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ type: "subscribe", email })
          });
        } else {
          validationMessage.textContent = "⚠️ Respon server tidak dikenal.";
          validationMessage.style.color = "orange";
        }
      } catch (err) {
        console.error("❌ Validation error:", err);
        validationMessage.textContent = "❌ Terjadi kesalahan, coba lagi.";
        validationMessage.style.color = "red";
      }
    });
  } else {
    console.warn("ℹ️ Form validasi email tidak ditemukan, skip init.");
  }

  // ---------- Step 2: Rating Bintang ----------
  if (starContainer && ratingInput) {
    starContainer.querySelectorAll("span").forEach((star) => {
      star.addEventListener("click", () => {
        const value = star.getAttribute("data-value");
        ratingInput.value = value;
        starContainer.querySelectorAll("span").forEach((s, i) => {
          s.style.color = i < value ? "gold" : "gray";
        });
      });
    });
  } else {
    console.warn("ℹ️ Rating bintang tidak ditemukan, skip init.");
  }

  // ---------- Step 3: Submit Review ----------
  if (reviewForm) {
    reviewForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const reviewData = {
        type: "submitReview",
        nama: document.getElementById("nama")?.value.trim() || "",
        email: document.getElementById("email")?.value.trim() || "",
        rating: document.getElementById("rating")?.value || "0",
        reviewText: document.getElementById("reviewText")?.value.trim() || "",
        marketplace: document.getElementById("marketplace")?.value || "",
        seller: document.getElementById("seller")?.value.trim() || "",
      };

      console.log("📤 Submitting review:", reviewData);

      try {
        const res = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(reviewData),
        });

        if (!res.ok) throw new Error("Server response not OK");

        const data = await res.json();
        console.log("📥 Review submit response:", data);

        if (data.status === "ok") {
          alert("✅ Review berhasil dikirim, menunggu moderasi.");
          reviewForm.reset();
          reviewForm.style.display = "none";
          validationMessage.textContent =
            "🙏 Terima kasih! Review Anda akan ditampilkan setelah moderasi.";
          validationMessage.style.color = "green";
        } else {
          alert("⚠️ Gagal mengirim review, coba lagi.");
        }
      } catch (err) {
        console.error("❌ Submit review error:", err);
        alert("❌ Terjadi kesalahan, coba lagi.");
      }
    });
  } else {
    console.warn("ℹ️ Form review tidak ditemukan, skip init.");
  }
});
