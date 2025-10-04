// review.js
console.log("🚀 review.js start");

document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ review.js loaded");
  
  // --- Ambil elemen ---
  const emailForm = document.getElementById("email-validate-form");
  const emailInput = document.getElementById("validate-email");
  const validationMessage = document.getElementById("validation-message");
  const reviewForm = document.getElementById("review-form");
  const starContainer = document.getElementById("star-rating");
  const ratingInput = document.getElementById("rating");

  console.log("🔍 Elemen check:", {
    emailForm,
    emailInput,
    validationMessage,
    reviewForm,
    starContainer,
    ratingInput,
  });

  // ---------- Step 1: Validasi Email ----------
  if (emailForm) {
    emailForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = emailInput.value.trim();
      console.log("📩 Validasi email:", email);

      validationMessage.textContent = "⏳ Memeriksa email...";
      validationMessage.style.color = "black";

      try {
        // Gunakan subscribe API untuk cek status
        const res = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "subscribe", email }),
        });

        const data = await res.json();
        console.log("📥 Validation response:", data);

        if (data.status === "approved") {
          validationMessage.textContent = "✅ Email valid, silakan isi review.";
          validationMessage.style.color = "green";
          reviewForm.style.display = "block";
        } else if (data.status === "pending") {
          validationMessage.textContent =
            "⚠️ Email sudah terdaftar, cek email Anda untuk konfirmasi.";
          validationMessage.style.color = "orange";
          reviewForm.style.display = "none";
        } else {
          validationMessage.textContent =
            "❌ Email belum terdaftar, kami sudah kirim link konfirmasi.";
          validationMessage.style.color = "red";
          reviewForm.style.display = "none";
        }
      } catch (err) {
        console.error("❌ Validation error:", err);
        validationMessage.textContent = "❌ Terjadi kesalahan, coba lagi.";
        validationMessage.style.color = "red";
      }
    });
  }

  // ---------- Step 2: Rating Bintang ----------
  if (starContainer) {
    starContainer.querySelectorAll("span").forEach((star) => {
      star.addEventListener("click", () => {
        const value = parseInt(star.getAttribute("data-value"), 10);
        ratingInput.value = value;
        starContainer.querySelectorAll("span").forEach((s, i) => {
          s.style.color = i < value ? "gold" : "gray";
        });
      });
    });
  }

  // ---------- Step 3: Submit Review ----------
  if (reviewForm) {
    reviewForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const reviewData = {
        type: "submitReview",
        nama: document.getElementById("nama").value.trim(),
        email: emailInput.value.trim(), // pakai email yg sudah divalidasi
        rating: ratingInput.value,
        reviewText: document.getElementById("reviewText").value.trim(),
        marketplace: document.getElementById("marketplace").value,
        seller: document.getElementById("seller").value.trim(),
      };

      console.log("📝 Submitting review:", reviewData);

      try {
        const res = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(reviewData),
        });

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
  }
});
