// review.js
const API_URL = window.APP_CONFIG.API_URL;

console.log("✅ review.js loaded");

async function checkEmailStatus(email) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type: "check", email })
  });
  return res.json();
}

async function sendReview(payload) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  return res.json();
}

function showReviewMsg(msgElem, color, text) {
  if (!msgElem) return;
  msgElem.style.color = color;
  msgElem.textContent = text;
}

function initReviewForm() {
  const form = document.getElementById("review-form");
  if (!form) {
    console.warn("review.js: #review-form tidak ditemukan");
    return;
  }

  const msgElem = document.getElementById("reviewMessage");
  const storedEmail = localStorage.getItem("subscriberEmail");

  if (!storedEmail) {
    showReviewMsg(msgElem, "red", "⚠️ Email belum terdaftar. Silakan subscribe dulu.");
    form.style.display = "none";
    return;
  }

  checkEmailStatus(storedEmail).then(data => {
    console.log("review.js: check status:", data);
    if (data.status !== "approved") {
      showReviewMsg(msgElem, "red", `⚠️ ${data.message || "Email belum tervalidasi."}`);
      form.style.display = "none";
      return;
    }

    form.addEventListener("submit", async e => {
      e.preventDefault();

      const name = form.querySelector("#reviewName").value.trim();
      const product = form.querySelector("#reviewProduct").value.trim();
      const seller = form.querySelector("#reviewSeller").value.trim();
      const rating = form.querySelector("#reviewRating").value;
      const review = form.querySelector("#reviewText").value.trim();

      const payload = {
        type: "review",
        email: storedEmail,
        name,
        product,
        seller,
        rating,
        review
      };

      showReviewMsg(msgElem, "#333", "⏳ Mengirim review...");
      try {
        const resp = await sendReview(payload);
        console.log("review.js: response:", resp);

        if (resp.status === "ok") {
          showReviewMsg(msgElem, "green", "✅ Review berhasil dikirim!");
          form.reset();
        } else {
          showReviewMsg(msgElem, "red", "❌ " + (resp.message || "Terjadi kesalahan."));
        }
      } catch (err) {
        console.error("review.js error:", err);
        showReviewMsg(msgElem, "red", "❌ Gagal mengirim review.");
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", initReviewForm);
