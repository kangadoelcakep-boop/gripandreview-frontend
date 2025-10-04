// =======================
// gripandreview - subscribe.js
// =======================

console.log("✅ subscribe.js loaded");

document.addEventListener("DOMContentLoaded", () => {
  const API_URL = window.Config?.API_URL;
  if (!API_URL) {
    console.error("❌ API_URL not found in config.js");
    return;
  }

  // Daftar form subscribe (mobile + desktop)
  const forms = [
    { form: "subscribe-form-mobile", input: "subEmail-mobile", message: "subMessage-mobile" },
    { form: "subscribe-form-desktop", input: "subEmail-desktop", message: "subMessage-desktop" }
  ];

  forms.forEach(({ form, input, message }) => {
    const formEl = document.getElementById(form);
    const inputEl = document.getElementById(input);
    const msgEl = document.getElementById(message);

    if (!formEl || !inputEl || !msgEl) return;

    formEl.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = inputEl.value.trim();
      if (!email) {
        msgEl.textContent = "❌ Email tidak boleh kosong";
        msgEl.style.color = "red";
        return;
      }

      msgEl.textContent = "⏳ Memproses...";
      msgEl.style.color = "black";

      try {
        // Cek dulu status email
        const checkRes = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "check", email })
        });
        const checkData = await checkRes.json();
        console.log("📥 check response:", checkData);

        if (checkData.status === "ok" && checkData.state === "approved") {
          msgEl.textContent = "✅ Email sudah terdaftar & aktif.";
          msgEl.style.color = "green";
          return;
        }

        if (checkData.status === "ok" && checkData.state === "pending") {
          msgEl.textContent = "⚠️ Email sudah terdaftar, silakan cek email Anda untuk konfirmasi.";
          msgEl.style.color = "orange";
          return;
        }

        if (checkData.status === "not_found") {
          // Kalau belum ada → daftar baru
          const subRes = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ type: "subscribe", email })
          });
          const subData = await subRes.json();
          console.log("📤 subscribe response:", subData);

          if (subData.status === "ok") {
            msgEl.textContent = "✅ Berhasil daftar. Silakan cek email untuk konfirmasi.";
            msgEl.style.color = "green";
          } else if (subData.status === "exists") {
            msgEl.textContent = "⚠️ Email sudah terdaftar, cek inbox Anda.";
            msgEl.style.color = "orange";
          } else {
            msgEl.textContent = subData.message || "❌ Gagal daftar, coba lagi.";
            msgEl.style.color = "red";
          }
          return;
        }

        // Kalau error lain
        msgEl.textContent = checkData.message || "❌ Terjadi kesalahan.";
        msgEl.style.color = "red";

      } catch (err) {
        console.error("Subscribe error:", err);
        msgEl.textContent = "❌ Gagal terhubung ke server.";
        msgEl.style.color = "red";
      }
    });
  });
});
