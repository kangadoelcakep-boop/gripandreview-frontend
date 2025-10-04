// =======================
// gripandreview - subscribe.js
// =======================

// subscribe.js
const API_URL = window.APP_CONFIG.API_URL;

const ALLOWED_DOMAINS = [
  "gmail.com", "googlemail.com",
  "yahoo.com", "yahoo.co.id",
  "outlook.com", "outlook.co.uk",
  "hotmail.com", "live.com", "msn.com"
];

console.log("✅ subscribe.js loaded");

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

async function sendSubscribe(email) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type: "subscribe", email })
  });
  return res.json();
}

function showMsg(msgElem, color, text) {
  if (!msgElem) return;
  msgElem.style.color = color;
  msgElem.textContent = text;
}

async function handleSubscribeForm(form) {
  const emailField = form.querySelector("input[type='email']");
  const msgElem = findMessageElement(form);
  if (!emailField) return;

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
    console.log("subscribe.js: response:", data);

    if (data.status === "ok") {
      showMsg(msgElem, "green", "✅ Subscribe berhasil! Cek email untuk validasi.");
      localStorage.setItem("subscriberEmail", email);
      form.reset();
    } else if (data.status === "exists") {
      showMsg(msgElem, "orange", "⚠️ Email sudah terdaftar. Jika belum validasi, cek inbox.");
      localStorage.setItem("subscriberEmail", email);
    } else {
      showMsg(msgElem, "red", "❌ " + (data.message || "Terjadi kesalahan."));
    }
  } catch (err) {
    console.error("subscribe.js error:", err);
    showMsg(msgElem, "red", "❌ Gagal mengirim subscribe.");
  }
}

function initSubscribe() {
  const forms = document.querySelectorAll("form[id^='subscribe-form']");
  if (!forms.length) {
    console.warn("subscribe.js: no subscribe-form found");
    return;
  }

  forms.forEach(form => {
    form.addEventListener("submit", e => {
      e.preventDefault();
      handleSubscribeForm(form);
    });
  });

  console.log("subscribe.js: hooked %d form(s)", forms.length);
}

document.addEventListener("DOMContentLoaded", initSubscribe);
