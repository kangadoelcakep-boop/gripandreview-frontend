// review.js
console.log("✅ review.js loaded");

document.addEventListener("DOMContentLoaded", () => {
  const API_URL = window.Config?.API_URL;
  if (!API_URL) {
    console.error("❌ API_URL not found in config.js");
    return;
  }

  const reviewForm = document.getElementById("review-form");
  const reviewMessage = document.getElementById("reviewMessage");

  if (!reviewForm || !reviewMessage) return;

  reviewForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("reviewEmail")?.value.trim();
    const name = document.getElementById("reviewName")?.value.trim();
    const seller = document.getElementById("reviewSeller")?.value.trim();
    const content = document.getElementById("reviewContent")?.value.trim();

    if (!email || !content) {
      reviewMessage.textContent = "❌ Email & isi review wajib diisi";
      return;
    }

    try {
      const res = await fetch(`${API_URL}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, seller, content })
      });

      const data = await res.json();
      reviewMessage.textContent = data.message || "✅ Review berhasil dikirim!";
    } catch (err) {
      console.error("Review error:", err);
      reviewMessage.textContent = "❌ Gagal kirim review, coba lagi!";
    }
  });
});
