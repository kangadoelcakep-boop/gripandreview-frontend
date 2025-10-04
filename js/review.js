const API_URL = "https://gripandreview-backend.kangadoelcakep.workers.dev/"; 
console.log("✅ review.js loaded");

// ambil email yang tersimpan di localStorage
async function checkSubscriber() {
  const email = localStorage.getItem("subscriberEmail");
  if (!email) {
    return { status: "error", message: "Belum subscribe" };
  }

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "check", email }),
    });
    return await res.json();
  } catch (e) {
    return { status: "error", message: e.message };
  }
}

async function submitReview(form) {
  const name = form.querySelector("input[name='name']").value.trim();
  const product = form.querySelector("input[name='product']").value.trim();
  const seller = form.querySelector("input[name='seller']").value.trim();
  const rating = form.querySelector("select[name='rating']").value;
  const review = form.querySelector("textarea[name='review']").value.trim();

  const email = localStorage.getItem("subscriberEmail");
  if (!email) {
    alert("⚠️ Email belum terdaftar. Silakan subscribe dulu.");
    return;
  }

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "review",
        email,
        name,
        product,
        seller,
        rating,
        review
      }),
    });
    const data = await res.json();
    if (data.status === "ok") {
      alert("✅ Review berhasil dikirim!");
      form.reset();
    } else {
      alert("❌ " + data.message);
    }
  } catch (e) {
    alert("❌ Gagal submit review: " + e.message);
  }
}

function initReviewForm() {
  const form = document.getElementById("review-form");
  if (!form) return;

  checkSubscriber().then(res => {
    if (res.status === "ok" && res.approved) {
      console.log("✅ User approved:", res.email);
      // tampilkan form
      form.style.display = "block";
      // auto isi email hidden
      const hiddenEmail = document.createElement("input");
      hiddenEmail.type = "hidden";
      hiddenEmail.name = "email";
      hiddenEmail.value = res.email;
      form.appendChild(hiddenEmail);
    } else if (res.status === "pending") {
      form.innerHTML = "<p>⚠️ Email Anda belum tervalidasi. Silakan cek inbox konfirmasi.</p>";
    } else {
      form.innerHTML = "<p>⚠️ Email belum terdaftar. Silakan subscribe dulu.</p>";
    }
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    submitReview(form);
  });
}

// init
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initReviewForm);
} else {
  initReviewForm();
}
