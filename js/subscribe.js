// =======================
// gripandreview - subscribe.js
// =======================

// Ganti URL Worker dengan milikmu
const API_URL = "https://gripandreview-backend.kangadoelcakep.workers.dev/";

// Optional: domain filter (UX saja, backend tetap yang validasi)
const ALLOWED_DOMAINS = [
  "gmail.com", "googlemail.com",
  "yahoo.com", "yahoo.co.id",
  "outlook.com", "outlook.co.uk",
  "hotmail.com", "live.com", "msn.com"
];

console.log("✅ subscribe.js loaded");

// --------- Helpers ---------
function getDomainFromEmail(email) {
  if (!email || email.indexOf("@") === -1) return "";
  return email.split("@")[1].toLowerCase();
}

function findMessageElement(form) {
  let msg = form.querySelector("[id^='subMessage']");
  if (!msg && form.parentElement) msg = form.parentElement.querySelector("p[id^='subMessage'], div[id^='subMessage']");
  if (!msg) msg = document.querySelector("p[id^='subMessage'], div[id^='subMessage']");
  return msg;
}

function showMsg(msgElem, color, text) {
  if (!msgElem) return;
  msgElem.style.color = color;
  msgElem.textContent = text;
}

// --------- Core ---------
async function sendSubscribe(email) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type: "subscribe", email })
  });
  return await res.json();
}

async function handleFormSubmit(form) {
  const emailField = form.querySelector("input[type='email']");
  const msgElem = findMessageElement(form);

  if (!emailField) {
    console.error("subscribe.js: email input not found", form);
    return;
  }

  const email = (emailField.value || "").trim();

  if (!email) {
    showMsg(msgElem, "red", "⚠️ Masukkan email yang valid.");
    return;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    showMsg(msgElem, "red", "⚠️ Format email tidak valid.");
    return;
  }

  const domain = getDomainFromEmail(email);
  if (!ALLOWED_DOMAINS.includes(domain)) {
    showMsg(msgElem, "red", "⚠️ Hanya Gmail / Yahoo / Outlook/Hotmail yang diperbolehkan.");
    return;
  }

  showMsg(msgElem, "#333", "⏳ Memproses...");

  try {
    const data = await sendSubscribe(email);
    console.log("subscribe.js: server response:", data);

    if (data.status === "ok") {
      showMsg(msgElem, "green", "✅ Subscribe berhasil! Cek email Anda untuk validasi.");
      localStorage.setItem("subscriberEmail", email);
      form.reset();
    } else if (data.status === "exists") {
      showMsg(msgElem, "orange", "⚠️ Email sudah terdaftar. Jika belum validasi, cek inbox Anda.");
      localStorage.setItem("subscriberEmail", email);
    } else {
      showMsg(msgElem, "red", "❌ " + (data.message || "Terjadi kesalahan."));
    }
  } catch (err) {
    console.error("subscribe.js: fetch failed", err);
    showMsg(msgElem, "red", "❌ Gagal mengirim subscribe. Coba lagi nanti.");
  }
}

// --------- Init ---------
function initSubscribe() {
  console.log("✅ subscribe.js: initSubscribe()");
  const forms = document.querySelectorAll("form[id^='subscribe-form']");
  if (!forms || forms.length === 0) {
    console.warn("subscribe.js: no subscribe-form found");
    return;
  }

  forms.forEach(form => {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      handleFormSubmit(form);
    });
  });

  console.log("subscribe.js: hooked %d form(s)", forms.length);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initSubscribe);
} else {
  initSubscribe();
}
