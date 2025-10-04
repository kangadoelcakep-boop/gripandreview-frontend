// review.js
console.log("🚀 review.js start");

document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ DOM ready, init review.js");

  // Ambil elemen
  const emailForm = document.querySelector("#email-validate-form");
  const emailInput = document.querySelector("#validate-email");
  const validationMessage = document.querySelector("#validation-message");
  const reviewForm = document.querySelector("#review-form");

  if (!emailForm || !emailInput || !validationMessage || !reviewForm) {
    console.warn("⚠️ Elemen form tidak lengkap, init dihentikan", {
      emailForm,
      emailInput,
      validationMessage,
      reviewForm,
    });
    return;
  }

  console.log("🔍 Elemen berhasil ditemukan", {
    emailForm,
    emailInput,
    validationMessage,
    reviewForm,
  });

  // Step 1: Validasi Email
  emailForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = emailInput.value.trim();
    console.log("📩 Submit validasi email:", email);

    if (!email) {
      validationMessage.textContent = "Email tidak boleh kosong!";
      validationMessage.style.color = "red";
      return;
    }

    try {
      // Simulasi request ke backend
      console.log("🌐 Kirim request validasi email ke backend...");
      const res = await fetch("/api/validate-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      console.log("📥 Validation response:", data);

      if (data.status === "ok") {
        validationMessage.textContent = "✅ Email valid, silakan tulis ulasan.";
        validationMessage.style.color = "green";

        // Tampilkan form review
        reviewForm.style.display = "block";
        emailForm.style.display = "none";
      } else {
        validationMessage.textContent = "❌ " + data.message;
        validationMessage.style.color = "red";
      }
    } catch (err) {
      console.error("🚨 Error saat validasi:", err);
      validationMessage.textContent = "Terjadi kesalahan koneksi.";
      validationMessage.style.color = "red";
    }
  });

  // Step 2: Submit Review
  reviewForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const nama = document.querySelector("#nama").value.trim();
    const rating = document.querySelector("#rating").value;
    const reviewText = document.querySelector("#reviewText").value.trim();
    const marketplace = document.querySelector("#marketplace").value;
    const seller = document.querySelector("#seller").value.trim();

    console.log("📝 Submit review:", {
      nama,
      rating,
      reviewText,
      marketplace,
      seller,
    });

    alert("Review berhasil dikirim! (sementara simulasi)");
  });

  // Step 3: Rating Bintang
  const stars = document.querySelectorAll("#star-rating span");
  const ratingInput = document.querySelector("#rating");

  stars.forEach((star) => {
    star.addEventListener("click", () => {
      const val = star.getAttribute("data-value");
      ratingInput.value = val;

      stars.forEach((s) =>
        s.classList.toggle("active", s.getAttribute("data-value") <= val)
      );

      console.log("⭐ Rating dipilih:", val);
    });
  });
});
