"use strict";

var CURRENT_USER = {
    FirstName    : "محمد",
    LastName     : "أحمد",
    FullName     : "محمد أحمد",
    Phone        : "01012345678",
    Email        : "user@gmail.com",
    Birthdate    : "1990-05-15",
    Gender       : "male",
    Address      : "بني سويف - شارع الجمهورية، أمام مسجد الفتح",
    AvatarUrl    : "assets/image/be7d92ded7de75fe6dc9fd4406e789ac22393930.png",

    HasInsurance   : true,
    InsuranceNumber: "BS-2024-00471",
    InsuranceIssue : "2024-01-10",
    InsuranceExpiry: "2026-01-09",

    Documents: {
        nationalId    : true,  
        insuranceCard : true,
        medicalReports: false
    }
};


document.addEventListener("DOMContentLoaded", function () {
    initUserMenuClose();
    populateProfileData();
    initTabSwitching();
    initPasswordStrength();
    initFileUploads();
    initInsuranceSection();
    initDocuments();
    initForms();
    initAvatarUpload();
});



function initUserMenuClose() {
    document.addEventListener("click", function (e) {
        var userMenu = document.querySelector(".user-menu");
        var userDD   = document.getElementById("userDropdown");
        if (userDD && userMenu && !userMenu.contains(e.target)) {
            userDD.classList.remove("open");
        }
    });
}

window.toggleUserMenu = function () {
    var dd = document.getElementById("userDropdown");
    if (dd) dd.classList.toggle("open");
};

function populateProfileData() {
    var u = CURRENT_USER;

    setText("heroName",    u.FullName);
    setText("heroPhone",   u.Phone);
    setText("heroEmail",   u.Email);
    setText("heroInsStatus", u.HasInsurance ? "تأمين مسجل ✓" : "لا يوجد تأمين");

    var heroAvatar = document.getElementById("heroAvatar");
    if (heroAvatar && u.AvatarUrl) {
        heroAvatar.src = u.AvatarUrl;
    }

    setText("userName", u.FullName);

    setVal("firstName", u.FirstName);
    setVal("lastName",  u.LastName);
    setVal("phone",     u.Phone);
    setVal("email",     u.Email);
    setVal("birthdate", u.Birthdate);
    setVal("address",   u.Address);

    var genderSelect = document.getElementById("gender");
    if (genderSelect) genderSelect.value = u.Gender || "";
}

function setText(id, val) {
    var el = document.getElementById(id);
    if (el) el.textContent = val || "";
}

function setVal(id, val) {
    var el = document.getElementById(id);
    if (el) el.value = val || "";
}



function initTabSwitching() {

}

window.switchTab = function (tabName, btn) {
    document.querySelectorAll(".profile-panel").forEach(function (p) {
        p.classList.remove("active");
    });

    document.querySelectorAll(".profile-tab").forEach(function (b) {
        b.classList.remove("active");
    });

    var panel = document.getElementById("tab-" + tabName);
    if (panel) panel.classList.add("active");

    if (btn) btn.classList.add("active");
};



function initForms() {
    var personalForm  = document.getElementById("personalForm");
    var securityForm  = document.getElementById("securityForm");
    var insForm       = document.getElementById("insForm");

    if (personalForm)  personalForm.addEventListener("submit",  savePersonal);
    if (securityForm)  securityForm.addEventListener("submit",  savePassword);
    if (insForm)       insForm.addEventListener("submit",       saveInsurance);
}

window.savePersonal = function (e) {
    e.preventDefault();
    var form = document.getElementById("personalForm");
    if (!form) return;

    clearErrors(form);
    var valid = true;

    var phone = form.elements["phone"];
    if (phone && !/^01[0-9]{9}$/.test(phone.value.trim())) {
        showFieldError(phone, "رقم الهاتف غير صحيح (11 رقم يبدأ بـ 01)");
        valid = false;
    }

    var email = form.elements["email"];
    if (email && email.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
        showFieldError(email, "البريد الإلكتروني غير صحيح");
        valid = false;
    }

    if (!valid) return;

    var payload = {
        FirstName : form.elements["firstName"].value.trim(),
        LastName  : form.elements["lastName"].value.trim(),
        Phone     : phone.value.trim(),
        Email     : email.value.trim(),
        Birthdate : form.elements["birthdate"].value,
        Gender    : form.elements["gender"].value,
        Address   : form.elements["address"].value.trim()
    };

    CURRENT_USER.FirstName = payload.FirstName;
    CURRENT_USER.LastName  = payload.LastName;
    CURRENT_USER.FullName  = payload.FirstName + " " + payload.LastName;
    CURRENT_USER.Phone     = payload.Phone;
    CURRENT_USER.Email     = payload.Email;
    CURRENT_USER.Birthdate = payload.Birthdate;
    CURRENT_USER.Gender    = payload.Gender;
    CURRENT_USER.Address   = payload.Address;

    setText("heroName",  CURRENT_USER.FullName);
    setText("heroPhone", CURRENT_USER.Phone);
    setText("heroEmail", CURRENT_USER.Email);
    setText("userName",  CURRENT_USER.FullName);

    showToast("تم حفظ المعلومات الشخصية بنجاح");

};


window.savePassword = function (e) {
    e.preventDefault();
    var form = document.getElementById("securityForm");
    if (!form) return;

    clearErrors(form);
    var valid   = true;
    var current = document.getElementById("currentPass");
    var newPass = document.getElementById("newPass");
    var confirm = document.getElementById("confirmPass");

    if (!current || !current.value.trim()) {
        showFieldError(current, "يرجى إدخال كلمة المرور الحالية");
        valid = false;
    }

    if (!newPass || newPass.value.length < 8) {
        showFieldError(newPass, "كلمة المرور يجب أن تكون 8 أحرف على الأقل");
        valid = false;
    }

    if (confirm && newPass && confirm.value !== newPass.value) {
        showFieldError(confirm, "كلمة المرور غير متطابقة");
        valid = false;
    }

    if (!valid) return;

    var payload = {
        CurrentPassword : current.value,
        NewPassword     : newPass.value
    };

    form.reset();
    resetPasswordUI();
    showToast("تم تحديث كلمة المرور بنجاح");

};

function resetPasswordUI() {
    var fill  = document.getElementById("strengthFill");
    var label = document.getElementById("strengthLabel");
    if (fill)  { fill.style.width = "0%"; fill.style.background = ""; }
    if (label)  label.textContent = "";

    ["rule-len", "rule-upper", "rule-lower", "rule-num", "rule-special"].forEach(function (id) {
        var li = document.getElementById(id);
        if (!li) return;
        li.classList.remove("valid");
        var icon = li.querySelector("i");
        if (icon) { icon.className = "fa-solid fa-circle-xmark"; }
    });
}

window.togglePass = function (inputId, iconEl) {
    var input = document.getElementById(inputId);
    if (!input) return;

    if (input.type === "password") {
        input.type = "text";
        iconEl.classList.replace("fa-eye", "fa-eye-slash");
    } else {
        input.type = "password";
        iconEl.classList.replace("fa-eye-slash", "fa-eye");
    }
};


function initPasswordStrength() {
    var newPass = document.getElementById("newPass");
    if (!newPass) return;

    newPass.addEventListener("input", function () {
        evaluatePasswordStrength(newPass.value);
    });
}

function evaluatePasswordStrength(password) {
    var rules = {
        len     : password.length >= 8,
        upper   : /[A-Z]/.test(password),
        lower   : /[a-z]/.test(password),
        num     : /[0-9]/.test(password),
        special : /[!@#$%^&*()_+\-=\[\]{}|;':",.<>?/\\`~]/.test(password)
    };

    Object.keys(rules).forEach(function (key) {
        var li   = document.getElementById("rule-" + key);
        var icon = li ? li.querySelector("i") : null;
        if (!li || !icon) return;

        if (rules[key]) {
            li.classList.add("valid");
            icon.className = "fa-solid fa-circle-check";
        } else {
            li.classList.remove("valid");
            icon.className = "fa-solid fa-circle-xmark";
        }
    });

    var score = Object.values(rules).filter(Boolean).length;
    var fill  = document.getElementById("strengthFill");
    var label = document.getElementById("strengthLabel");

    var levels = [
        { pct: "0%",   color: "",        text: "" },
        { pct: "20%",  color: "#e53838", text: "ضعيفة جداً" },
        { pct: "40%",  color: "#f97316", text: "ضعيفة" },
        { pct: "60%",  color: "#eab308", text: "متوسطة" },
        { pct: "80%",  color: "#3b82f6", text: "جيدة" },
        { pct: "100%", color: "#16a34a", text: "قوية جداً" }
    ];

    var level = levels[score] || levels[0];
    if (fill)  { fill.style.width = level.pct; fill.style.background = level.color; }
    if (label) { label.textContent = level.text; label.style.color = level.color; }
}

function initInsuranceSection() {
    var u    = CURRENT_USER;
    var card = document.getElementById("insStatusCard");
    var wrap = document.getElementById("insFormWrap");

    if (u.HasInsurance) {
        renderInsuranceCard(u);
    } else {
        renderNoInsurance();
    }

    setVal("insNumber", u.InsuranceNumber || "");
    setVal("insIssue",  u.InsuranceIssue  || "");
    setVal("insExpiry", u.InsuranceExpiry || "");
}

function renderInsuranceCard(u) {
    var card = document.getElementById("insStatusCard");
    if (!card) return;

    card.innerHTML =
        '<div class="ins-status-icon has-ins"><i class="fa-solid fa-shield-halved"></i></div>' +
        '<div class="ins-status-text">' +
            '<h3 id="insStatusTitle">التأمين مسجل</h3>' +
            '<p>رقم الكارنيه: <strong>' + (u.InsuranceNumber || "—") + '</strong></p>' +
            '<p>صالح حتى: <strong>' + formatDate(u.InsuranceExpiry) + '</strong></p>' +
        '</div>' +
        '<div class="ins-status-img">' +
            '<img src="assets/image/" alt="كارنيه التأمين">' +
        '</div>' +
        '<button type="button" class="add-ins-btn" onclick="toggleInsForm()">' +
            '<i class="fa-solid fa-pen"></i> تعديل بيانات التأمين' +
        '</button>';
}

function renderNoInsurance() {
    var card = document.getElementById("insStatusCard");
    if (!card) return;

    card.innerHTML =
        '<div class="ins-status-icon no-ins"><i class="fa-solid fa-shield-halved"></i></div>' +
        '<div class="ins-status-text">' +
            '<h3>لا يوجد تأمين مسجل</h3>' +
            '<p>أضف بيانات كارنيه التأمين للاستفادة من خدمات التأمين</p>' +
        '</div>' +
        '<button type="button" class="add-ins-btn" onclick="toggleInsForm()">' +
            '<i class="fa-solid fa-plus"></i> إضافة تأمين' +
        '</button>';
}

window.toggleInsForm = function () {
    var wrap = document.getElementById("insFormWrap");
    if (!wrap) return;
    wrap.style.display = wrap.style.display === "none" ? "" : "none";
};

window.saveInsurance = function (e) {
    e.preventDefault();
    var form = document.getElementById("insForm");
    if (!form) return;

    clearErrors(form);
    var insNumber = document.getElementById("insNumber");
    var insIssue  = document.getElementById("insIssue");
    var insExpiry = document.getElementById("insExpiry");
    var valid     = true;

    if (!insNumber || !insNumber.value.trim()) {
        showFieldError(insNumber, "رقم الكارنيه مطلوب");
        valid = false;
    }
    if (!insIssue || !insIssue.value) {
        showFieldError(insIssue, "تاريخ الإصدار مطلوب");
        valid = false;
    }
    if (!insExpiry || !insExpiry.value) {
        showFieldError(insExpiry, "تاريخ الانتهاء مطلوب");
        valid = false;
    }
    if (insIssue && insExpiry && insIssue.value && insExpiry.value) {
        if (new Date(insExpiry.value) <= new Date(insIssue.value)) {
            showFieldError(insExpiry, "تاريخ الانتهاء يجب أن يكون بعد تاريخ الإصدار");
            valid = false;
        }
    }
    if (!valid) return;

    CURRENT_USER.HasInsurance    = true;
    CURRENT_USER.InsuranceNumber = insNumber.value.trim();
    CURRENT_USER.InsuranceIssue  = insIssue.value;
    CURRENT_USER.InsuranceExpiry = insExpiry.value;

    renderInsuranceCard(CURRENT_USER);
    toggleInsForm();
    setText("heroInsStatus", "تأمين مسجل ✓");
    showToast("تم حفظ بيانات التأمين بنجاح");
};

function formatDate(dateStr) {
    if (!dateStr) return "—";
    try {
        var d = new Date(dateStr);
        return d.toLocaleDateString("ar-EG", { year: "numeric", month: "long", day: "numeric" });
    } catch (e) {
        return dateStr;
    }
}


function initDocuments() {
    var docs = CURRENT_USER.Documents || {};

    updateDocStatus("docNationalId",     docs.nationalId);
    updateDocStatus("docInsuranceCard",  docs.insuranceCard);
    updateDocStatus("docMedicalReports", docs.medicalReports);

    wireDocFileInput("newIdFile",    "docNationalId",     true);
    wireDocFileInput("newInsFile",   "docInsuranceCard",  true);
    wireDocFileInput("newMedFile",   "docMedicalReports", false);
}

function updateDocStatus(docId, isUploaded) {
    var el = document.getElementById(docId);
    if (!el) return;

    if (isUploaded) {
        el.className   = "doc-status uploaded";
        el.innerHTML   = '<i class="fa-solid fa-circle-check"></i> تم الرفع';
    } else {
        el.className   = "doc-status missing";
        el.innerHTML   = '<i class="fa-solid fa-circle-xmark"></i> لم يرفع بعد';
    }
}

function wireDocFileInput(inputId, statusId, isUpdate) {
    var input = document.getElementById(inputId);
    if (!input) return;

    input.addEventListener("change", function () {
        if (!input.files || !input.files[0]) return;
        var file = input.files[0];

        if (file.size > 5 * 1024 * 1024) {
            alert("حجم الملف كبير جداً. الحد الأقصى 5 ميجابايت.");
            input.value = "";
            return;
        }
        updateDocStatus(statusId, true);
        showToast("تم رفع الملف بنجاح: " + file.name);
    });
}

window.updateFileName = function (input, labelId) {
    var label = document.getElementById(labelId);
    if (!label) return;
    label.textContent = (input.files && input.files[0]) ? input.files[0].name : "اضغط لرفع صورة الكارنيه";
};



function initAvatarUpload() {

}

window.previewAvatar = function (input) {
    if (!input.files || !input.files[0]) return;
    var file = input.files[0];

    if (file.size > 5 * 1024 * 1024) {
        alert("حجم الصورة كبير جداً. الحد الأقصى 5 ميجابايت.");
        input.value = "";
        return;
    }

    var reader = new FileReader();
    reader.onload = function (ev) {
        var heroAvatar = document.getElementById("heroAvatar");
        var navAvatar  = document.querySelector(".user-avatar img");
        var src        = ev.target.result;

        if (heroAvatar) { heroAvatar.src = src; heroAvatar.style.display = ""; }
        if (navAvatar)    navAvatar.src  = src;


        showToast("تم تحديث صورة الملف الشخصي");
    };
    reader.readAsDataURL(file);
};



function initFileUploads() {
    var insFile = document.getElementById("insFile");
    if (insFile) {
        insFile.addEventListener("change", function () {
            updateFileName(insFile, "insFileName");
        });
    }
}

function showFieldError(input, message) {
    if (!input) return;
    input.classList.add("input-error");
    var err       = document.createElement("span");
    err.className   = "field-error-msg";
    err.textContent = message;
    err.style.cssText = "color:#e53838; font-size:11px; font-weight:600; display:block; margin-top:4px;";
    input.parentNode.appendChild(err);
}

function clearErrors(form) {
    if (!form) return;
    form.querySelectorAll(".input-error").forEach(function (el) { el.classList.remove("input-error"); });
    form.querySelectorAll(".field-error-msg").forEach(function (el) { el.remove(); });
}


function showToast(message, isError) {
    var toast = document.getElementById("toast");
    var msg   = document.getElementById("toastMsg");
    if (!toast) return;

    if (msg) msg.textContent = message || "تم الحفظ بنجاح";

    toast.style.background = isError ? "#e53838" : "#16a34a";
    toast.classList.add("show");

    setTimeout(function () {
        toast.classList.remove("show");
    }, 3000);
}



document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    var dd = document.getElementById("userDropdown");
    if (dd) dd.classList.remove("open");
});

function getAntiForgeryToken() {
    var el = document.querySelector('input[name="__RequestVerificationToken"]');
    return el ? el.value : "";
}

