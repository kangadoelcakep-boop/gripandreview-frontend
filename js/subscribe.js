// =======================
// gripandreview - subscribe.js
// =======================

// subscribe.js
console.log("✅ subscribe.js loaded");

document.addEventListener("DOMContentLoaded", () => {
  const API_URL = window.Config?.API_URL;
  if (!API_URL) {
    console.error("❌ API_URL not found in config.js");
    return;
  }

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
        return;
      }

      try {
        const res = await fetch(`${API_URL}/subscribe`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email })
        });

        const data = await res.json();
        msgEl.textContent = data.message || "✅ Berhasil, cek email untuk konfirmasi!";
      } catch (err) {
        console.error("Subscribe error:", err);
        msgEl.textContent = "❌ Gagal kirim, coba lagi!";
      }
    });
  });
});
