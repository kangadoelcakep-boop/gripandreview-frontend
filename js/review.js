// review.js
document.addEventListener("DOMContentLoaded", () => {
  console.log("🚀 review.js start");

  // Elemen
  const emailForm = document.getElementById("email-validate-form");
  const emailInput = document.getElementById("validate-email");
  const validationMessage = document.getElementById("validation-message");
  const reviewForm = document.getElementById("review-form");
  const starContainer = document.getElementById("star-rating");
  const ratingInput = document.getElementById("rating");

  if (!API_URL) {
    console.error("❌ API_URL belum didefinisikan di config.js");
    return;
  }

  console.log("🔍 Elemen check:", {
    emailForm,
    emailInput,
    validationMessage,
    reviewForm,
    starContainer,
    ratingInput,
  });

  /* ------------------ Step 1: Validasi Email ------------------ */
  if (emailForm) {
    emailForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = emailInput.value.trim();
      if (!email) return;

      validationMessage.textContent = "⏳ Memeriksa email...";
      validationMessage.style.color = "black";
      console.log("📩 Validasi email:", email);

      try {
        const res = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "check", email }),
        });

        const data = await res.json();
        console.log("📥 Validation response:", data);

        if (data.status === "ok" && data.state === "approved") {
          validationMessage.textContent = "✅ Email valid, silakan isi review.";
          validationMessage.style.color = "green";
          emailForm.style.display = "none";
          reviewForm.style.display = "block";
        } else if (data.status === "ok" && data.state === "pending") {
          validationMessage.textContent =
            "⚠️ Email sudah terdaftar, tapi belum dikonfirmasi. Silakan cek inbox Anda.";
          validationMessage.style.color = "orange";
        } else if (data.status === "not_found") {
          validationMessage.textContent =
            "❌ Email belum terdaftar. Kami mendaftarkan Anda terlebih dahulu, cek email konfirmasi.";
          validationMessage.style.color = "red";

          // Auto-subscribe jika belum ada
          await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ type: "subscribe", email }),
          });
        } else {
          validationMessage.textContent = "❌ Terjadi kesalahan validasi.";
          validationMessage.style.color = "red";
        }
      } catch (err) {
        console.error("Validation error:", err);
        validationMessage.textContent = "❌ Gagal koneksi ke server.";
        validationMessage.style.color = "red";
      }
    });
  }

  /* ------------------ Step 2: Rating Bintang ------------------ */
  if (starContainer) {
    starContainer.querySelectorAll("span").forEach((star) => {
      star.addEventListener("click", () => {
        const value = parseInt(star.getAttribute("data-value"));
        ratingInput.value = value;
        starContainer.querySelectorAll("span").forEach((s, i) => {
          s.style.color = i < value ? "gold" : "gray";
        });
      });
    });
  }

  /* ------------------ Step 3: Submit Review ------------------ */
  if (reviewForm) {
    reviewForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const reviewData = {
        type: "review",
        name: document.getElementById("nama").value.trim(),
        email: emailInput.value.trim(), // ambil dari email awal
        rating: parseInt(document.getElementById("rating").value),
        text: document.getElementById("reviewText").value.trim(),
        marketplace: document.getElementById("marketplace").value,
        seller: document.getElementById("seller").value.trim(),
        postUrl: window.location.href, // simpan URL post
      };

      console.log("📝 Submit review:", reviewData);

      try {
        const res = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(reviewData),
        });
        const data = await res.json();
        console.log("📥 Review response:", data);

        if (data.status === "ok") {
          alert("✅ Review berhasil dikirim, menunggu moderasi.");
          reviewForm.reset();
          reviewForm.style.display = "none";
          validationMessage.textContent =
            "🙏 Terima kasih! Review Anda akan ditampilkan setelah moderasi.";
          validationMessage.style.color = "green";
        } else {
          alert("⚠️ Gagal mengirim review: " + data.message);
        }
      } catch (err) {
        console.error("Review submit error:", err);
        alert("❌ Terjadi kesalahan saat mengirim review.");
      }
    });
  }
});
