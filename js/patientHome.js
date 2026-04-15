"use strict";

document.addEventListener("DOMContentLoaded", function () {
    loadUserInfo();
    initEmergencyModal();
    initBookingModal();
    initFileUpload();
    initSymptomCards();
    initUserMenu();
    loadVisitHistory();
});


function loadUserInfo() {

    const userNameEl  = document.getElementById("userName");
    const userHeroEl  = document.getElementById("userNameHero");

    if (userNameEl && !userNameEl.dataset.loaded && !userNameEl.textContent.trim()) {
        userNameEl.textContent = "المستخدم";
    }
    if (userHeroEl && !userHeroEl.dataset.loaded && !userHeroEl.textContent.trim()) {
        userHeroEl.textContent = "المستخدم";
    }
}


function initUserMenu() {
    // Close user dropdown when clicking outside
    document.addEventListener("click", function (e) {
        const menu = document.getElementById("userDropdown");
        const avatar = document.querySelector(".user-avatar");
        if (menu && menu.classList.contains("open")) {
            if (!menu.contains(e.target) && !avatar.contains(e.target)) {
                menu.classList.remove("open");
            }
        }
    });
}

window.toggleUserMenu = function () {
    const dropdown = document.getElementById("userDropdown");
    if (dropdown) dropdown.classList.toggle("open");
};


function initEmergencyModal() {
    const overlay = document.getElementById("emergencyModal");
    if (overlay) {
        overlay.addEventListener("click", function (e) {
            if (e.target === overlay) closeEmergency();
        });
    }

    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") closeEmergency();
    });
}

window.openEmergency = function () {
    const modal = document.getElementById("emergencyModal");
    if (modal) {
        modal.style.display = "flex";
        document.body.style.overflow = "hidden";
    }
};

window.closeEmergency = function () {
    const modal = document.getElementById("emergencyModal");
    if (modal) {
        modal.style.display = "none";
        document.body.style.overflow = "";
    }
};


function initSymptomCards() {
    document.querySelectorAll(".symptom-card[data-spec]").forEach(function (card) {
        card.addEventListener("click", function (e) {
            e.preventDefault();
            const spec = card.dataset.spec || "";
            if (spec) {
                window.location.href = "requestVisit.html?spec=" + encodeURIComponent(spec);
            } else {
                window.location.href = "requestVisit.html";
            }
        });
    });
}

function initBookingModal() {
    const overlay = document.getElementById("bookingOverlay");
    if (overlay) {
        overlay.addEventListener("click", function (e) {
            if (e.target === overlay) closeBookingModal();
        });
    }

    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") {
            closeBookingModal();
            closeSuccessModal();
        }
    });

    const form = document.getElementById("bookingForm");
    if (form) {
        form.addEventListener("submit", handleBookingSubmit);
    }
}

window.openBookingModal = function (btn) {
    const card = btn ? btn.closest(".provider-card") : null;

    if (card) {
        const id       = card.dataset.id    || "";
        const name     = card.dataset.name  || "";
        const spec     = card.dataset.spec  || "";
        const price    = card.dataset.price || "";
        const img      = card.dataset.img   || "";
        const type     = card.dataset.type  || "doctor";

        const docImg    = document.querySelector(".booking-provider-img img");
        const docName   = document.querySelector(".booking-provider-name");
        const docSpec   = document.querySelector(".booking-provider-spec");
        const docPrice  = document.querySelector(".booking-provider-price");
        const hiddenId  = document.getElementById("bookingDoctorId");
        const hiddenType= document.getElementById("bookingVisitType");

        if (docImg)    docImg.src          = img;
        if (docName)   docName.textContent  = name;
        if (docSpec)   docSpec.textContent  = spec;
        if (docPrice)  docPrice.textContent = "سعر الكشف " + price + " جنيه";
        if (hiddenId)  hiddenId.value       = id;
        if (hiddenType)hiddenType.value     = type;

        const isNurse = type === "nurse";
        const modalTitle  = document.querySelector(".booking-modal-title");
        const submitBtn   = document.querySelector("#bookingForm .submit-btn");
        if (modalTitle) modalTitle.textContent = isNurse ? "طلب ممرض" : "طلب زيارة";
        if (submitBtn)  submitBtn.textContent  = isNurse ? "طلب ممرض" : "طلب طبيب";
    }

    const overlay = document.getElementById("bookingOverlay");
    if (overlay) {
        overlay.classList.add("open");
        document.body.style.overflow = "hidden";
    }
};

window.closeBookingModal = function () {
    const overlay = document.getElementById("bookingOverlay");
    if (overlay) {
        overlay.classList.remove("open");
        document.body.style.overflow = "";
    }
};

window.closeBookingIfOutside = function (e) {
    if (e.target === document.getElementById("bookingOverlay")) {
        closeBookingModal();
    }
};


async function handleBookingSubmit(e) {
    e.preventDefault();

    const form      = document.getElementById("bookingForm");
    const submitBtn = form.querySelector(".submit-btn");
    if (!form || !submitBtn) return;

    if (!validateBookingForm(form)) return;

    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> جاري الإرسال...';

    try {

        await new Promise(r => setTimeout(r, 800));

        closeBookingModal();
        form.reset();
        resetFileLabel();
        openSuccessModal();

    } catch (err) {
        showFormError("حدث خطأ أثناء الإرسال، يرجى المحاولة لاحقاً");
        console.error("Booking submit error:", err);
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }
}

function validateBookingForm(form) {
    clearFormErrors(form);
    let valid = true;

    const fields = [
        { name: "fullName",  label: "الاسم بالكامل",             minLength: 3 },
        { name: "phone",     label: "رقم الهاتف",                pattern: /^01[0-9]{9}$/, patternMsg: "رقم الهاتف غير صحيح (11 رقم يبدأ بـ 01)" },
        { name: "address",   label: "العنوان",                   minLength: 10 },
        { name: "datetime",  label: "الموعد",                    future: true  },
        { name: "condition", label: "الحالة المرضية",             minLength: 5 },
    ];

    fields.forEach(function (rule) {
        const input = form.elements[rule.name];
        if (!input) return;

        const val = input.value.trim();

        if (!val) {
            showFieldError(input, rule.label + " مطلوب");
            valid = false;
            return;
        }

        if (rule.minLength && val.length < rule.minLength) {
            showFieldError(input, rule.label + " يجب أن يكون " + rule.minLength + " أحرف على الأقل");
            valid = false;
            return;
        }

        if (rule.pattern && !rule.pattern.test(val)) {
            showFieldError(input, rule.patternMsg || rule.label + " غير صحيح");
            valid = false;
            return;
        }

        if (rule.future) {
            const selected = new Date(val);
            if (selected <= new Date()) {
                showFieldError(input, "يجب اختيار موعد في المستقبل");
                valid = false;
                return;
            }
        }
    });

    const emailInput = form.elements["email"];
    if (emailInput && emailInput.value.trim()) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(emailInput.value.trim())) {
            showFieldError(emailInput, "البريد الإلكتروني غير صحيح");
            valid = false;
        }
    }

    return valid;
}

function showFieldError(input, message) {
    input.classList.add("input-error");
    const err = document.createElement("span");
    err.className = "field-error-msg";
    err.textContent = message;
    err.style.cssText = "color:#e53838;font-size:11px;font-weight:600;display:block;margin-top:4px;";
    input.parentNode.appendChild(err);
}

function clearFormErrors(form) {
    form.querySelectorAll(".input-error").forEach(el => el.classList.remove("input-error"));
    form.querySelectorAll(".field-error-msg").forEach(el => el.remove());
}

function showFormError(message) {
    let errBox = document.getElementById("bookingFormError");
    if (!errBox) {
        errBox = document.createElement("div");
        errBox.id = "bookingFormError";
        errBox.style.cssText = "background:#fde8e8;color:#e53838;padding:10px 16px;border-radius:8px;font-size:13px;font-weight:600;margin-bottom:12px;";
        const form = document.getElementById("bookingForm");
        form.insertBefore(errBox, form.firstChild);
    }
    errBox.textContent = message;
}


function getAntiForgeryToken() {
    const tokenInput = document.querySelector('input[name="__RequestVerificationToken"]');
    return tokenInput ? tokenInput.value : "";
}



function openSuccessModal() {
    const overlay = document.getElementById("successOverlay");
    if (overlay) {
        overlay.classList.add("open");
        document.body.style.overflow = "hidden";
    }
}

window.closeSuccessModal = function () {
    const overlay = document.getElementById("successOverlay");
    if (overlay) {
        overlay.classList.remove("open");
        document.body.style.overflow = "";
    }
};


function initFileUpload() {
    const fileInput = document.getElementById("nationalId");
    const fileLabel = document.getElementById("nationalIdLabel");
    if (!fileInput || !fileLabel) return;

    fileInput.addEventListener("change", function () {
        if (fileInput.files && fileInput.files[0]) {
            const file = fileInput.files[0];

            if (file.size > 5 * 1024 * 1024) {
                alert("حجم الملف كبير جداً. الحد الأقصى 5 ميجابايت.");
                fileInput.value = "";
                resetFileLabel();
                return;
            }

            fileLabel.innerHTML =
                '<i class="fa-solid fa-check-circle" style="color:#28a745;margin-left:6px;"></i>' +
                file.name;
        } else {
            resetFileLabel();
        }
    });
}

function resetFileLabel() {
    const fileLabel = document.getElementById("nationalIdLabel");
    if (fileLabel) {
        fileLabel.innerHTML = '<i class="fa-solid fa-upload"></i> رفع صورة بطاقة الرقم القومي';
    }
    const fileInput = document.getElementById("nationalId");
    if (fileInput) fileInput.value = "";
}

async function loadVisitHistory() {
    const container = document.getElementById("visitHistoryList");
    if (!container) return;

    const demoVisits = [
        { id: 1, doctorName: "د. محمد محمود", specialization: "عظام", visitDate: "2026-03-15T10:00:00", status: "completed", price: 500 },
        { id: 2, doctorName: "أ. هالة مصطفى",  specialization: "تمريض", visitDate: "2026-04-02T14:30:00", status: "confirmed", price: 200 },
        { id: 3, doctorName: "د. سارة أحمد",   specialization: "نساء وتوليد", visitDate: "2026-04-20T09:00:00", status: "pending",   price: 350 },
    ];
    renderVisitHistory(demoVisits, container);
}



async function loadNotificationCount() {
    const badge = document.getElementById("notifBadge");
    if (!badge) return;

    try {
        const response = await fetch("/Notification/Unread");
        if (!response.ok) return;
        const data = await response.json();
        if (data.count > 0) {
            badge.textContent = data.count;
            badge.style.display = "flex";
        }
    } catch (err) {
    }
}


window.closeSearchDropdown = function () {
    const dropdown = document.getElementById("searchDropdown");
    if (dropdown) dropdown.style.display = "none";
};


document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
        const target = document.querySelector(anchor.getAttribute("href"));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    });
});