// review.js
console.log("✅ review.js loaded");

document.addEventListener("DOMContentLoaded", () => {
  const API_URL = window.Config?.API_URL;
  if (!API_URL) {
    console.error("❌ API_URL not found in config.js");
    return;
  }

  const reviewForm = document.getElementById("review-form");
  const reviewList = document.getElementById("review-list");

  if (!reviewForm) return;

  // ⭐️ Rating Handler
  const stars = document.querySelectorAll("#star-rating span");
  const ratingInput = document.getElementById("rating");

  stars.forEach((star) => {
    star.addEventListener("click", () => {
      const value = star.getAttribute("data-value");
      ratingInput.value = value;

      // highlight bintang
      stars.forEach((s, i) => {
        s.style.color = i < value ? "gold" : "#ccc";
      });
    });
  });

  // 📝 Submit Review
  reviewForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const payload = {
      name: document.getElementById("nama")?.value.trim(),
      email: document.getElementById("email")?.value.trim(),
      rating: ratingInput.value,
      review: document.getElementById("reviewText")?.value.trim(),
      marketplace: document.getElementById("marketplace")?.value,
      seller: document.getElementById("seller")?.value.trim()
    };

    if (!payload.email || !payload.review) {
      alert("❌ Email dan ulasan wajib diisi!");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      alert(data.message || "✅ Ulasan berhasil dikirim!");

      // tampilkan ulasan langsung di list
      const div = document.createElement("div");
      div.className = "review-item";
      div.innerHTML = `
        <p><strong>${payload.name || "Anonim"}</strong> ⭐ ${payload.rating}/5</p>
        <p>${payload.review}</p>
        <small>${payload.marketplace} - ${payload.seller}</small>
      `;
      reviewList.prepend(div);

      reviewForm.reset();
      ratingInput.value = 0;
      stars.forEach((s) => (s.style.color = "#ccc"));
    } catch (err) {
      console.error("Review error:", err);
      alert("❌ Gagal kirim ulasan, coba lagi!");
    }
  });
});
