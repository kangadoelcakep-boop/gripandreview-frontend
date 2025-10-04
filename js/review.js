console.log("✅ review.js loaded");

document.addEventListener("DOMContentLoaded", () => {
  const API_URL = window.Config?.API_URL;
  if (!API_URL) {
    console.error("❌ API_URL not found in config.js");
    return;
  }

  const emailForm = document.getElementById("email-validate-form");
  const reviewForm = document.getElementById("review-form");
  const emailStatusMsg = document.getElementById("emailStatusMsg");

  // ⭐ Rating stars
  const ratingInput = document.getElementById("rating");
  const stars = document.querySelectorAll("#star-rating span");
  stars.forEach(star => {
    star.addEventListener("click", () => {
      const value = star.getAttribute("data-value");
      ratingInput.value = value;
      stars.forEach((s, i) => s.style.color = i < value ? "gold" : "#ccc");
    });
  });

  // Step 1: Validasi Email
  emailForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("reviewerEmail").value.trim();
    if (!email) return;

    emailStatusMsg.textContent = "⏳ Memvalidasi email...";
    emailStatusMsg.style.color = "#333";

    try {
      const res = await fetch(`${API_URL}/checkEmail`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      console.log("checkEmail:", data);

      if (data.status === "ok") {
        emailStatusMsg.textContent = "✅ Email valid. Silakan isi ulasan.";
        emailStatusMsg.style.color = "green";
        reviewForm.style.display = "block";
        localStorage.setItem("reviewerEmail", email);
      } else if (data.status === "pending") {
        emailStatusMsg.textContent = "⚠️ Email Anda belum dikonfirmasi. Cek inbox email untuk validasi.";
        emailStatusMsg.style.color = "orange";
      } else if (data.status === "subscribe") {
        emailStatusMsg.textContent = "❌ Email belum terdaftar. Kami sudah kirim email konfirmasi, cek inbox Anda.";
        emailStatusMsg.style.color = "red";
      } else {
        emailStatusMsg.textContent = "❌ Terjadi kesalahan.";
        emailStatusMsg.style.color = "red";
      }
    } catch (err) {
      console.error("checkEmail error:", err);
      emailStatusMsg.textContent = "❌ Gagal validasi email.";
      emailStatusMsg.style.color = "red";
    }
  });

  // Step 2: Submit Review
  reviewForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const payload = {
      email: localStorage.getItem("reviewerEmail"),
      name: document.getElementById("nama").value.trim(),
      rating: ratingInput.value,
      review: document.getElementById("reviewText").value.trim(),
      marketplace: document.getElementById("marketplace").value,
      seller: document.getElementById("seller").value.trim()
    };

    try {
      const res = await fetch(`${API_URL}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.status === "ok") {
        alert("✅ Ulasan terkirim. Menunggu moderasi.");
        reviewForm.reset();
      } else {
        alert("❌ " + data.message);
      }
    } catch (err) {
      console.error("review error:", err);
      alert("❌ Gagal kirim ulasan.");
    }
  });
});
