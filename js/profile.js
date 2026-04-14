"use strict";

/* =============================================
   PROFILE PAGE — profile.js
   ============================================= */

/* ── Tab switching ── */
window.switchTab = function (tabId, btn) {
    // Hide all panels
    document.querySelectorAll(".profile-panel").forEach(p => p.classList.remove("active"));
    document.querySelectorAll(".profile-tab").forEach(t => t.classList.remove("active"));

    // Show selected
    const panel = document.getElementById("tab-" + tabId);
    if (panel) panel.classList.add("active");
    if (btn)   btn.classList.add("active");
};

/* ── Avatar preview ── */
window.previewAvatar = function (input) {
    const file = input.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        const img = document.getElementById("heroAvatar");
        const fallback = document.getElementById("avatarFallback");
        if (img) {
            img.src = e.target.result;
            img.style.display = "block";
            if (fallback) fallback.style.display = "none";
        }
    };
    reader.readAsDataURL(file);
    showToast("تم تغيير الصورة الشخصية");
};

/* ── Save personal info ── */
window.savePersonal = function (e) {
    e.preventDefault();

    const firstName = document.getElementById("firstName").value.trim();
    const lastName  = document.getElementById("lastName").value.trim();
    const phone     = document.getElementById("phone").value.trim();
    const email     = document.getElementById("email").value.trim();

    const fullName = firstName + " " + lastName;

    // Update hero
    const heroName = document.getElementById("heroName");
    const heroPhone = document.getElementById("heroPhone");
    const heroEmail = document.getElementById("heroEmail");
    const userName  = document.getElementById("userName");

    if (heroName)  heroName.textContent  = fullName;
    if (heroPhone) heroPhone.textContent = phone;
    if (heroEmail) heroEmail.textContent = email;
    if (userName)  userName.textContent  = "أهلاً، " + firstName;

    // Save to sessionStorage (until real backend is connected)
    sessionStorage.setItem("userName", firstName);

    showToast("تم حفظ المعلومات الشخصية بنجاح ✓");
};

/* ── Password strength ── */
const newPassInput = document.getElementById("newPass");
if (newPassInput) {
    newPassInput.addEventListener("input", function () {
        const val = this.value;
        updateStrength(val);
        updateRules(val);
    });
}

function updateStrength(val) {
    const fill  = document.getElementById("strengthFill");
    const label = document.getElementById("strengthLabel");
    if (!fill || !label) return;

    let score = 0;
    if (val.length >= 8)             score++;
    if (/[A-Z]/.test(val))           score++;
    if (/[a-z]/.test(val))           score++;
    if (/[0-9]/.test(val))           score++;
    if (/[!@#$%^&*]/.test(val))      score++;

    const levels = [
        { pct: "0%",   color: "#eee",    text: "" },
        { pct: "25%",  color: "#e53838", text: "ضعيفة جداً" },
        { pct: "50%",  color: "#f59e0b", text: "متوسطة" },
        { pct: "75%",  color: "#3b82f6", text: "جيدة" },
        { pct: "100%", color: "#16a34a", text: "قوية جداً" },
    ];

    const lv = levels[Math.min(score, 4)];
    fill.style.width       = val.length ? lv.pct : "0%";
    fill.style.background  = lv.color;
    label.textContent      = val.length ? lv.text : "";
    label.style.color      = lv.color;
}

function updateRules(val) {
    const rules = {
        "rule-len":     val.length >= 8,
        "rule-upper":   /[A-Z]/.test(val),
        "rule-lower":   /[a-z]/.test(val),
        "rule-num":     /[0-9]/.test(val),
        "rule-special": /[!@#$%^&*]/.test(val),
    };

    Object.entries(rules).forEach(([id, passed]) => {
        const el = document.getElementById(id);
        if (!el) return;
        if (passed) {
            el.classList.add("valid");
        } else {
            el.classList.remove("valid");
        }
    });
}

/* ── Save password ── */
window.savePassword = function (e) {
    e.preventDefault();

    const current = document.getElementById("currentPass").value;
    const newP    = document.getElementById("newPass").value;
    const confirm = document.getElementById("confirmPass").value;

    if (!current) { showToast("أدخل كلمة المرور الحالية", true); return; }
    if (newP !== confirm) { showToast("كلمتا المرور غير متطابقتين", true); return; }
    if (newP.length < 8)  { showToast("كلمة المرور قصيرة جداً", true); return; }

    showToast("تم تحديث كلمة المرور بنجاح ✓");
    e.target.reset();
    updateStrength("");
    updateRules("");
};

/* ── Toggle password visibility ── */
window.togglePass = function (inputId, icon) {
    const input = document.getElementById(inputId);
    if (!input) return;
    if (input.type === "password") {
        input.type = "text";
        icon.classList.replace("fa-eye", "fa-eye-slash");
    } else {
        input.type = "password";
        icon.classList.replace("fa-eye-slash", "fa-eye");
    }
};

/* ── Insurance form toggle ── */
window.toggleInsForm = function () {
    const wrap = document.getElementById("insFormWrap");
    if (!wrap) return;
    const isHidden = wrap.style.display === "none";
    wrap.style.display = isHidden ? "block" : "none";
};

/* ── Save insurance ── */
window.saveInsurance = function (e) {
    e.preventDefault();

    const number = document.getElementById("insNumber").value.trim();
    if (!number) { showToast("أدخل رقم الكارنيه", true); return; }

    // Update status card
    const icon   = document.querySelector(".ins-status-icon");
    const title  = document.getElementById("insStatusTitle");
    const desc   = document.getElementById("insStatusDesc");
    const heroSt = document.getElementById("heroInsStatus");
    const statIns= document.getElementById("statInsurance");
    const addBtn = document.querySelector(".add-ins-btn");

    if (icon)   { icon.classList.remove("no-ins"); icon.classList.add("has-ins"); icon.innerHTML = '<i class="fa-solid fa-shield-check"></i>'; }
    if (title)  title.textContent = "تأمين نشط — " + number;
    if (desc)   desc.textContent  = "بيانات التأمين مسجّلة بنجاح";
    if (heroSt) heroSt.textContent = "تأمين نشط";
    if (statIns)statIns.textContent = "نعم";
    if (addBtn) { addBtn.innerHTML = '<i class="fa-solid fa-pen"></i> تعديل'; }

    document.getElementById("insFormWrap").style.display = "none";
    showToast("تم حفظ بيانات التأمين بنجاح ✓");
};

/* ── Update file name label ── */
window.updateFileName = function (input, labelId) {
    const label = document.getElementById(labelId);
    if (!label) return;
    if (input.files.length > 0) {
        label.textContent = "تم اختيار: " + input.files[0].name;
    }
};

/* ── Toast helper ── */
let toastTimer = null;

function showToast(msg, isError = false) {
    const toast   = document.getElementById("toast");
    const msgEl   = document.getElementById("toastMsg");
    const icon    = toast.querySelector("i");

    if (!toast || !msgEl) return;

    msgEl.textContent = msg;
    toast.style.background = isError ? "#e53838" : "#16a34a";
    if (icon) icon.className = isError ? "fa-solid fa-circle-exclamation" : "fa-solid fa-circle-check";

    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 3000);
}

/* ── Init: load saved name ── */
document.addEventListener("DOMContentLoaded", function () {
    const saved = sessionStorage.getItem("userName");
    if (saved) {
        const heroName = document.getElementById("heroName");
        const userName = document.getElementById("userName");
        if (heroName && !heroName.textContent.includes(saved)) {
            heroName.textContent = saved + " أحمد";
        }
        if (userName) userName.textContent = "أهلاً، " + saved;
    }
});