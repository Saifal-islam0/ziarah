"use strict";


var STATIC_NOTIFICATIONS = [
    { id:1, unread:true,  type:"new-visit", title:"طلب زيارة جديد",      desc:"حسين التوني — 10 أبريل 11:30 ص",       time:"منذ 5 دقائق"  },
    { id:2, unread:true,  type:"new-visit", title:"طلب زيارة جديد",      desc:"خالد مختار — 10 أبريل 11:30 ص",        time:"منذ 12 دقيقة" },
    { id:3, unread:true,  type:"confirmed", title:"تم تأكيد الزيارة",    desc:"محمد علي — تم قبول الزيارة بنجاح",    time:"منذ 30 دقيقة" },
    { id:4, unread:false, type:"cancelled", title:"تم إلغاء الزيارة",    desc:"نبيل محمود — ألغى موعده",              time:"أمس"           },
    { id:5, unread:false, type:"info",      title:"تذكير بزيارة غداً",   desc:"مازن محمد — غداً الساعة 12:00 ظهراً", time:"منذ يومين"     }
];

var STATIC_CALENDAR_VISITS = [
    { date:"2026-04-16", time:"10:00", name:"محمد علي",    address:"القاهرة",     type:"كشف",    status:"confirmed" },
    { date:"2026-04-16", time:"11:00", name:"خالد رضا",    address:"مصر الجديدة", type:"كشف",    status:"confirmed" },
    { date:"2026-04-16", time:"12:00", name:"مازن محمد",   address:"اكتوبر",      type:"متابعة", status:"confirmed" },
    { date:"2026-04-16", time:"17:00", name:"محمد احمد",   address:"المعادي",     type:"كشف",    status:"confirmed" },
    { date:"2026-04-18", time:"09:00", name:"سامح جلال",   address:"الهرم",       type:"متابعة", status:"confirmed" },
    { date:"2026-04-20", time:"11:30", name:"نادي عبدالحميد", address:"الجيزة",   type:"كشف",    status:"confirmed" },
    { date:"2026-04-22", time:"08:00", name:"شهاب سيد",    address:"القاهرة",     type:"كشف",    status:"confirmed" }
];


document.addEventListener("DOMContentLoaded", function () {
    buildCalendarData();
    renderCalendar();
    initNotifications();
    initOutsideClick();
    showSection("dashboard");
});


window.showSection = function (sectionId) {
    document.querySelectorAll("[id^='section-']").forEach(function(el){
        el.style.display = "none";
    });
    var target = document.getElementById("section-" + sectionId);
    if (target) target.style.display = "block";

    document.querySelectorAll(".nav-item").forEach(function(item){
        item.classList.remove("active");
    });
    var activeItem = document.querySelector(".nav-item[onclick=\"showSection('" + sectionId + "')\"]");
    if (activeItem) activeItem.classList.add("active");
};

var _notifications = [];

function initNotifications() {

    _notifications = STATIC_NOTIFICATIONS.slice();
    renderNotifications();
}

function renderNotifications() {
    var list  = document.getElementById("notifList");
    var badge = document.getElementById("notifBadge");
    if (!list) return;

    var unreadCount = _notifications.filter(function(n){ return n.unread; }).length;
    if (badge) {
        badge.textContent = unreadCount;
        badge.classList.toggle("hidden", unreadCount === 0);
    }

    if (_notifications.length === 0) {
        list.innerHTML = '<div class="notif-empty"><i class="fa-solid fa-bell-slash"></i><p>لا توجد إشعارات</p></div>';
        return;
    }

    var iconMap = { "new-visit":"fa-calendar-plus", confirmed:"fa-circle-check", cancelled:"fa-circle-xmark", info:"fa-circle-info" };

    list.innerHTML = _notifications.map(function(n) {
        return '<div class="notif-item ' + (n.unread ? "unread" : "") + '" onclick="markRead(' + n.id + ')">'
            + '<div class="notif-icon ' + n.type + '"><i class="fa-solid ' + (iconMap[n.type] || "fa-bell") + '"></i></div>'
            + '<div class="notif-body">'
            +   '<div class="notif-title">' + n.title + '</div>'
            +   '<div class="notif-desc">'  + n.desc  + '</div>'
            +   '<div class="notif-time">'  + n.time  + '</div>'
            + '</div></div>';
    }).join("");
}

window.toggleNotif = function () {
    var dd = document.getElementById("notifDropdown");
    if (dd) dd.classList.toggle("open");
};

window.closeNotif = function () {
    var dd = document.getElementById("notifDropdown");
    if (dd) dd.classList.remove("open");
};

window.markRead = function (id) {
    var n = _notifications.find(function(x){ return x.id === id; });
    if (n) { n.unread = false; renderNotifications(); }
};

window.markAllRead = function () {
    _notifications.forEach(function(n){ n.unread = false; });
    renderNotifications();
};


var calVisits  = {};  
var calYear    = new Date().getFullYear();
var calMonth   = new Date().getMonth();
var selectedDate = null;

function buildCalendarData() {
    STATIC_CALENDAR_VISITS.forEach(function(v){
        addVisitToCalendar(v.date, v);
    });
}

function addVisitToCalendar(dateKey, visit) {
    if (!calVisits[dateKey]) calVisits[dateKey] = [];
    var exists = calVisits[dateKey].some(function(v){ return v.name === visit.name && v.time === visit.time; });
    if (!exists) calVisits[dateKey].push(visit);
}

function renderCalendar() {
    var grid  = document.getElementById("calGrid");
    var label = document.getElementById("calMonthLabel");
    if (!grid || !label) return;

    var months = ["يناير","فبراير","مارس","إبريل","مايو","يونيو",
                  "يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"];
    label.textContent = months[calMonth] + " " + calYear;

    var today       = new Date();
    var firstDay    = new Date(calYear, calMonth, 1).getDay();
    var daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();

    grid.innerHTML = "";

    for (var i = 0; i < firstDay; i++) {
        var empty = document.createElement("div");
        empty.className = "cal-day empty";
        grid.appendChild(empty);
    }

    for (var d = 1; d <= daysInMonth; d++) {
        var dateKey = calYear + "-" + pad(calMonth + 1) + "-" + pad(d);
        var visits  = calVisits[dateKey] || [];

        var cell = document.createElement("div");
        cell.className = "cal-day";
        cell.dataset.date = dateKey;

        var isToday = (d === today.getDate() && calMonth === today.getMonth() && calYear === today.getFullYear());
        if (isToday)               cell.classList.add("today");
        if (selectedDate === dateKey) cell.classList.add("selected");

        cell.innerHTML = "<span>" + d + "</span>";

        if (visits.length > 0) {
            cell.classList.add("has-visits");
            var dots = document.createElement("div");
            dots.className = "cal-dots";
            for (var j = 0; j < Math.min(visits.length, 3); j++) {
                var dot = document.createElement("div");
                dot.className = "cal-dot";
                dots.appendChild(dot);
            }
            cell.appendChild(dots);
            (function(dk){ cell.addEventListener("click", function(){ openDayDetail(dk); }); })(dateKey);
        }

        grid.appendChild(cell);
    }
}

function pad(n) { return String(n).padStart(2, "0"); }

function openDayDetail(dateKey) {
    selectedDate = dateKey;
    renderCalendar();

    var visits  = calVisits[dateKey] || [];
    var detail  = document.getElementById("calDayDetail");
    var titleEl = document.getElementById("calDetailTitle");
    var listEl  = document.getElementById("calDetailList");
    if (!detail || !titleEl || !listEl) return;

    var arabicDays  = ["الأحد","الاثنين","الثلاثاء","الأربعاء","الخميس","الجمعة","السبت"];
    var arabicMonths= ["يناير","فبراير","مارس","إبريل","مايو","يونيو","يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"];
    var parts   = dateKey.split("-");
    var dateObj = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    titleEl.textContent = arabicDays[dateObj.getDay()] + " " + parseInt(parts[2]) + " " + arabicMonths[parseInt(parts[1]) - 1] + " " + parts[0];

    if (visits.length === 0) {
        listEl.innerHTML = '<div class="cal-no-visits">لا توجد زيارات في هذا اليوم</div>';
    } else {
        var sorted = visits.slice().sort(function(a,b){ return a.time.localeCompare(b.time); });
        listEl.innerHTML = sorted.map(function(v) {
            var statusClass = v.status === "confirmed" ? "confirmed" : (v.status === "cancelled" ? "cancelled" : "pending");
            var statusLabel = v.status === "confirmed" ? "مؤكدة"    : (v.status === "cancelled" ? "ملغية"    : "قيد الانتظار");
            return '<div class="cal-visit-item">'
                + '<div class="cal-visit-time">' + v.time + '</div>'
                + '<div class="cal-visit-info">'
                +   '<div class="cal-visit-name">'  + v.name    + '</div>'
                +   '<div class="cal-visit-meta"><span>' + v.type + '</span> - <span>' + v.address + '</span></div>'
                + '</div>'
                + '<span class="status-badge ' + statusClass + '">' + statusLabel + '</span>'
                + '</div>';
        }).join("");
    }

    detail.style.display = "block";
}

window.closeDayDetail = function () {
    selectedDate = null;
    var el = document.getElementById("calDayDetail");
    if (el) el.style.display = "none";
    renderCalendar();
};

window.prevMonth = function () {
    calMonth--;
    if (calMonth < 0) { calMonth = 11; calYear--; }
    selectedDate = null;
    var el = document.getElementById("calDayDetail");
    if (el) el.style.display = "none";
    renderCalendar();
};

window.nextMonth = function () {
    calMonth++;
    if (calMonth > 11) { calMonth = 0; calYear++; }
    selectedDate = null;
    var el = document.getElementById("calDayDetail");
    if (el) el.style.display = "none";
    renderCalendar();
};


window.acceptVisit = function (btn) {
    var row   = btn.closest("tr");
    var cells = row.querySelectorAll("td");

    var name    = cells[0] ? cells[0].textContent.trim() : "";
    var address = cells[1] ? cells[1].textContent.trim() : "";
    var rawDate = cells[2] ? cells[2].textContent.trim() : "";
    var type    = cells[3] ? cells[3].textContent.trim() : "";

    var dateKey = "", time = "";
    if (rawDate) {
        var parts = rawDate.split(" ");
        dateKey   = parts[0] || "";
        time      = parts[1] ? parts[1].substring(0, 5) : "";
    }

    var statusCell = row.querySelector(".status-badge");
    if (statusCell) { statusCell.className = "status-badge confirmed"; statusCell.textContent = "مؤكدة"; }

    var actionsCell = row.cells[5];
    if (actionsCell) actionsCell.innerHTML = '<span class="status-badge confirmed">تم القبول</span>';

    row.dataset.status = "confirmed";

    if (dateKey && name) {
        addVisitToCalendar(dateKey, { date: dateKey, time: time, name: name, address: address, type: type, status: "confirmed" });
        var dateParts = dateKey.split("-").map(Number);
        calYear  = dateParts[0];
        calMonth = dateParts[1] - 1;
        renderCalendar();
    }

    updateNewVisitsBadge();


    showToast("✓ تمت إضافة " + name + " إلى التقويم");
};

window.rejectVisit = function (btn) {
    var row  = btn.closest("tr");
    var name = row.cells[0] ? row.cells[0].textContent.trim() : "المريض";

    var statusCell = row.querySelector(".status-badge");
    if (statusCell) { statusCell.className = "status-badge cancelled"; statusCell.textContent = "ملغية"; }

    var actionsCell = row.cells[5];
    if (actionsCell) actionsCell.innerHTML = '<span class="status-badge cancelled">تم الرفض</span>';

    row.dataset.status = "cancelled";
    updateNewVisitsBadge();

    showToast("✗ تم رفض زيارة " + name);
};

function updateNewVisitsBadge() {
    var pendingCount = document.querySelectorAll("#new-visits-tbody tr[data-status='pending']").length;
    var badge = document.querySelector(".nav-item[onclick=\"showSection('new-visits')\"] .badge");
    if (badge) badge.textContent = pendingCount;
}

window.filterNewVisits = function (select) {
    var val  = select.value;
    var rows = document.querySelectorAll("#new-visits-tbody tr");
    rows.forEach(function(row){
        if (val === "كل الحالات" || val === "") {
            row.style.display = "";
        } else {
            var badge = row.querySelector(".status-badge");
            var text  = badge ? badge.textContent.trim() : "";
            row.style.display = text.includes(val) ? "" : "none";
        }
    });
};


window.filterHistoryTable = function (inputEl) {
    var searchVal  = (document.querySelector("#section-history .search-box input")?.value || "").trim().toLowerCase();
    var periodVal  = document.getElementById("historyPeriodFilter")?.value  || "all";
    var statusVal  = document.getElementById("historyStatusFilter")?.value  || "all";

    var rows   = document.querySelectorAll("#history-tbody tr");
    var now    = new Date();
    var visible= 0;

    rows.forEach(function(row){
        var text   = row.textContent.toLowerCase();
        var status = row.dataset.status || "";
        var rawDate= row.dataset.date   || "";
        var rowDate= rawDate ? new Date(rawDate) : null;

        var matchSearch = !searchVal || text.includes(searchVal);

        var matchStatus = statusVal === "all" || status === statusVal;

        var matchPeriod = true;
        if (rowDate && periodVal !== "all") {
            var diffMs    = now - rowDate;
            var diffDays  = diffMs / (1000 * 60 * 60 * 24);
            var thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
            var lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            var lastMonthEnd   = new Date(now.getFullYear(), now.getMonth(), 0);

            if (periodVal === "this-month")  matchPeriod = rowDate >= thisMonthStart;
            else if (periodVal === "last-month") matchPeriod = rowDate >= lastMonthStart && rowDate <= lastMonthEnd;
            else if (periodVal === "3-months") matchPeriod = diffDays <= 90;
        }

        var show = matchSearch && matchStatus && matchPeriod;
        row.style.display = show ? "" : "none";
        if (show) visible++;
    });

    var emptyEl = document.getElementById("historyEmpty");
    if (emptyEl) emptyEl.style.display = visible === 0 ? "" : "none";
};

window.filterTable = function (input, tbodyId) {
    var query = input.value.trim().toLowerCase();
    var rows  = document.querySelectorAll("#" + tbodyId + " tr");
    rows.forEach(function(row){
        row.style.display = row.textContent.toLowerCase().includes(query) ? "" : "none";
    });
};

window.toggleTheme = function () {
    document.body.classList.toggle("dark-mode");
    var isDark = document.body.classList.contains("dark-mode");
    document.querySelectorAll(".theme-toggle i, #navThemeIcon").forEach(function(i){
        i.className = isDark ? "fa-solid fa-sun" : "fa-solid fa-moon";
    });
    localStorage.setItem("theme", isDark ? "dark" : "light");
};

(function(){
    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark-mode");
        document.querySelectorAll(".theme-toggle i, #navThemeIcon").forEach(function(i){
            i.className = "fa-solid fa-sun";
        });
    }
})();


window.logout = function () {
    if (!confirm("هل تريد تسجيل الخروج؟")) return;

    window.location.href = "index.html";
};

window.toggleMenu = function () {
    var nav  = document.querySelector(".nav");
    var hamb = document.querySelector(".hamburger");
    if (nav)  nav.classList.toggle("active");
    if (hamb) hamb.classList.toggle("open");
};


function initOutsideClick() {
    document.addEventListener("click", function(e){
        var wrapper = document.getElementById("notifWrapper");
        var dd      = document.getElementById("notifDropdown");
        if (dd && wrapper && !wrapper.contains(e.target)) {
            dd.classList.remove("open");
        }
    });
}

document.addEventListener("keydown", function(e){
    if (e.key === "Escape") closeNotif();
});


function showToast(msg) {
    var toast = document.getElementById("calToast");
    if (!toast) {
        toast = document.createElement("div");
        toast.id        = "calToast";
        toast.className = "cal-toast";
        document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add("show");
    setTimeout(function(){ toast.classList.remove("show"); }, 3000);
}


function getAntiForgeryToken() {
    var el = document.querySelector('input[name="__RequestVerificationToken"]');
    return el ? el.value : "";
}

window.switchProfileTab = function (tabId, btn) {
    document.querySelectorAll(".profile-tab").forEach(function (t) { t.classList.remove("active"); });
    document.querySelectorAll(".profile-tab-content").forEach(function (c) { c.classList.remove("active"); });
    if (btn) btn.classList.add("active");
    var content = document.getElementById("tab-" + tabId);
    if (content) content.classList.add("active");
};

document.addEventListener("DOMContentLoaded", function () {
    var avatarInput = document.getElementById("avatarInput");
    if (avatarInput) {
        avatarInput.addEventListener("change", function () {
            if (!this.files || !this.files[0]) return;
            var file = this.files[0];
            if (file.size > 5 * 1024 * 1024) {
                showProfileToast("حجم الصورة كبير جداً — الحد الأقصى 5 ميجابايت", "warning");
                return;
            }
            var reader = new FileReader();
            reader.onload = function (e) {
                var img = document.getElementById("profileAvatarImg");
                if (img) img.src = e.target.result;
                var sideImg = document.querySelector(".image-profile img");
                if (sideImg) sideImg.src = e.target.result;
            };
            reader.readAsDataURL(file);
        });
    }

    var certInput = document.getElementById("certInput");
    if (certInput) {
        certInput.addEventListener("change", function () {
            var label = document.getElementById("certFileName");
            if (label) {
                label.textContent = this.files && this.files[0]
                    ? this.files[0].name
                    : "رفع الشهادة (PDF أو صورة)";
            }
        });
    }

    document.querySelectorAll(".wh-row input[type='checkbox']").forEach(function (cb) {
        cb.addEventListener("change", function () {
            var row = this.closest(".wh-row");
            if (!row) return;
            row.querySelectorAll("input[type='time']").forEach(function (t) {
                t.disabled = !cb.checked;
            });
        });
    });

    var newPwd = document.getElementById("inputNewPwd");
    if (newPwd) {
        newPwd.addEventListener("input", function () {
            updateStrengthBar(this.value);
        });
    }
});

function updateStrengthBar(val) {
    var fill  = document.getElementById("strengthFill");
    var label = document.getElementById("strengthLabel");
    if (!fill || !label) return;

    var score = 0;
    if (val.length >= 8)            score++;
    if (/[A-Z]/.test(val))          score++;
    if (/[0-9]/.test(val))          score++;
    if (/[^A-Za-z0-9]/.test(val))   score++;

    var map = [
        { pct: "0%",   color: "#eee",    text: "",          textColor: "" },
        { pct: "25%",  color: "#e53838", text: "ضعيفة",     textColor: "#e53838" },
        { pct: "50%",  color: "#ff9800", text: "متوسطة",    textColor: "#ff9800" },
        { pct: "75%",  color: "#128CCF", text: "جيدة",      textColor: "#128CCF" },
        { pct: "100%", color: "#28a745", text: "قوية جداً", textColor: "#28a745" },
    ];

    fill.style.width      = map[score].pct;
    fill.style.background = map[score].color;
    label.textContent     = map[score].text;
    label.style.color     = map[score].textColor;
}

window.togglePwd = function (inputId, btn) {
    var input = document.getElementById(inputId);
    if (!input) return;
    var isText = input.type === "text";
    input.type = isText ? "password" : "text";
    var icon = btn.querySelector("i");
    if (icon) {
        icon.className = isText ? "fa-solid fa-eye" : "fa-solid fa-eye-slash";
    }
};

window.addTagOnEnter = function (e) {
    if (e.key !== "Enter") return;
    e.preventDefault();
    var input = document.getElementById("tagInput");
    if (!input) return;
    var val = input.value.trim();
    if (!val) return;

    var wrap = document.getElementById("serviceAreasTags");
    if (!wrap) return;

    var existing = Array.from(wrap.querySelectorAll(".pf-tag"))
        .map(function (t) { return t.textContent.replace("×", "").trim(); });
    if (existing.includes(val)) { input.value = ""; return; }

    var tag = document.createElement("span");
    tag.className = "pf-tag";
    tag.innerHTML = val + ' <button type="button" onclick="removeTag(this)">×</button>';
    wrap.insertBefore(tag, input);
    input.value = "";
    updateServiceAreasHidden();
};

window.removeTag = function (btn) {
    var tag = btn.closest(".pf-tag");
    if (tag) { tag.remove(); updateServiceAreasHidden(); }
};

function updateServiceAreasHidden() {
    var wrap = document.getElementById("serviceAreasTags");
    var hidden = document.getElementById("serviceAreasHidden");
    if (!wrap || !hidden) return;
    var vals = Array.from(wrap.querySelectorAll(".pf-tag"))
        .map(function (t) { return t.textContent.replace("×", "").trim(); });
    hidden.value = vals.join(",");
}

window.saveProfileSection = function (e, section) {
    e.preventDefault();
    var formId = section === "personal"     ? "personalForm"
               : section === "professional" ? "professionalForm"
               : "securityForm";
    var form = document.getElementById(formId);
    if (!form) return;

    clearProfileErrors(form);

    if (section === "security") {
        var np = document.getElementById("inputNewPwd");
        var cp = document.getElementById("inputConfirmPwd");
        if (np && cp && np.value !== cp.value) {
            showProfileFieldError(cp, "كلمتا المرور غير متطابقتين");
            return;
        }
    }

    if (section === "professional") {
        var valid = true;
        document.querySelectorAll(".wh-row").forEach(function (row) {
            var cb = row.querySelector("input[type='checkbox']");
            if (!cb || !cb.checked) return;
            var times = row.querySelectorAll("input[type='time']");
            if (times.length < 2) return;
            if (times[0].value && times[1].value && times[0].value >= times[1].value) {
                times[1].classList.add("input-error");
                valid = false;
            }
        });
        if (!valid) {
            showProfileToast("تأكد أن وقت الانتهاء بعد وقت البداية", "warning");
            return;
        }
    }

    if (section === "personal") {
        var nameEl = document.getElementById("inputFullName");
        if (nameEl) {
            var heroName = document.getElementById("heroName");
            var sidebarName = document.querySelector(".name-profile");
            if (heroName) heroName.textContent = nameEl.value;
            if (sidebarName) sidebarName.textContent = nameEl.value;
        }
    }
    if (section === "professional") {
        var specEl = document.getElementById("inputSpecialty");
        if (specEl) {
            var heroSpec = document.getElementById("heroSpec");
            if (heroSpec) heroSpec.textContent = specEl.value;
        }
    }


    showProfileToast("تم حفظ التعديلات بنجاح ✓");
};

function showProfileFieldError(input, msg) {
    if (!input) return;
    input.classList.add("input-error");
    var errId = "err-" + (input.name || "");
    var errEl = document.getElementById(errId);
    if (errEl) errEl.textContent = msg;
}

function clearProfileErrors(form) {
    if (!form) return;
    form.querySelectorAll(".input-error").forEach(function (el) { el.classList.remove("input-error"); });
    form.querySelectorAll(".pf-error").forEach(function (el) { el.textContent = ""; });
}

function showProfileToast(msg, type) {
    var existing = document.querySelectorAll(".dp-toast");
    existing.forEach(function (t) { t.remove(); });

    var colors = { success: "#128CCF", warning: "#e6a817", error: "#e53838" };
    var toast = document.createElement("div");
    toast.className = "dp-toast";
    toast.textContent = msg;
    toast.style.cssText = [
        "position:fixed", "bottom:28px", "left:50%",
        "transform:translateX(-50%) translateY(16px)",
        "background:" + (colors[type] || colors.success),
        "color:white", "padding:11px 26px",
        "border-radius:30px", "font-size:13px", "font-weight:700",
        "font-family:'Cairo',sans-serif",
        "box-shadow:0 6px 20px rgba(0,0,0,0.18)",
        "z-index:99999", "opacity:0",
        "transition:all 0.3s ease", "white-space:nowrap",
        "pointer-events:none"
    ].join(";");

    document.body.appendChild(toast);
    requestAnimationFrame(function () {
        toast.style.opacity = "1";
        toast.style.transform = "translateX(-50%) translateY(0)";
    });
    setTimeout(function () {
        toast.style.opacity = "0";
        toast.style.transform = "translateX(-50%) translateY(16px)";
        setTimeout(function () { toast.remove(); }, 300);
    }, 3000);
}