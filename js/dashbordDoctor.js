document.addEventListener("DOMContentLoaded", function () {

    window.showSection = function (sectionId) {
        document.querySelectorAll("[id^='section-']").forEach(el => {
            el.style.display = "none";
        });
        const target = document.getElementById("section-" + sectionId);
        if (target) target.style.display = "block";

        document.querySelectorAll(".nav-item").forEach(item => item.classList.remove("active"));
        const activeItem = document.querySelector(`.nav-item[onclick="showSection('${sectionId}')"]`);
        if (activeItem) activeItem.classList.add("active");
    };

    window.filterTable = function (input, tbodyId) {
        const query = input.value.trim().toLowerCase();
        const rows = document.querySelectorAll(`#${tbodyId} tr`);
        rows.forEach(row => {
            row.style.display = row.textContent.toLowerCase().includes(query) ? "" : "none";
        });
    };


    window.acceptVisit = function (btn) {
        const row = btn.closest("tr");
        row.querySelector(".status-badge").className = "status-badge confirmed";
        row.querySelector(".status-badge").textContent = "مؤكدة";
        row.querySelector("td:last-child").innerHTML = '<span class="status-badge confirmed">تم القبول</span>';
    };

    window.rejectVisit = function (btn) {
        const row = btn.closest("tr");
        row.querySelector(".status-badge").className = "status-badge cancelled";
        row.querySelector(".status-badge").textContent = "ملغية";
        row.querySelector("td:last-child").innerHTML = '<span class="status-badge cancelled">تم الرفض</span>';
    };

    window.toggleTheme = function () {
        document.body.classList.toggle("dark-mode");
        const icons = document.querySelectorAll(".theme-toggle i, #navThemeIcon");
        const isDark = document.body.classList.contains("dark-mode");
        icons.forEach(i => i.className = isDark ? "fa-solid fa-sun" : "fa-solid fa-moon");
    };

});
const calVisits = {};

const seedVisits = [
    { date: "2026-04-10", time: "10:00", name: "محمد علي",   address: "القاهرة",     type: "كشف" },
    { date: "2026-04-10", time: "11:00", name: "خالد رضا",   address: "مصر الجديدة", type: "كشف" },
    { date: "2026-04-10", time: "12:00", name: "مازن محمد",  address: "اكتوبر",       type: "متابعة" },
    { date: "2026-04-10", time: "17:00", name: "محمد احمد",  address: "المعادي",      type: "كشف" },
];
seedVisits.forEach(v => addVisitToCalendar(v.date, v));

let calYear  = new Date().getFullYear();
let calMonth = new Date().getMonth();
let selectedDate = null;

function addVisitToCalendar(dateKey, visit) {
    if (!calVisits[dateKey]) calVisits[dateKey] = [];
    const exists = calVisits[dateKey].some(v => v.name === visit.name && v.time === visit.time);
    if (!exists) calVisits[dateKey].push(visit);
}


function renderCalendar() {
    const grid  = document.getElementById("calGrid");
    const label = document.getElementById("calMonthLabel");
    if (!grid || !label) return;

    const months = ["يناير","فبراير","مارس","إبريل","مايو","يونيو",
                    "يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"];
    label.textContent = months[calMonth] + " " + calYear;

    const today      = new Date();
    const firstDay   = new Date(calYear, calMonth, 1).getDay(); // 0=Sun
    const daysInMonth= new Date(calYear, calMonth + 1, 0).getDate();

    grid.innerHTML = "";

    for (let i = 0; i < firstDay; i++) {
        const empty = document.createElement("div");
        empty.className = "cal-day empty";
        grid.appendChild(empty);
    }

    for (let d = 1; d <= daysInMonth; d++) {
        const dateKey = `${calYear}-${String(calMonth+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
        const visits  = calVisits[dateKey] || [];

        const cell = document.createElement("div");
        cell.className = "cal-day";
        cell.dataset.date = dateKey;

        const isToday = (d === today.getDate() && calMonth === today.getMonth() && calYear === today.getFullYear());
        if (isToday) cell.classList.add("today");
        if (selectedDate === dateKey) cell.classList.add("selected");

        cell.innerHTML = `<span>${d}</span>`;

        if (visits.length > 0) {
            cell.classList.add("has-visits");
            const dots = document.createElement("div");
            dots.className = "cal-dots";
            const maxDots = Math.min(visits.length, 3);
            for (let i = 0; i < maxDots; i++) {
                const dot = document.createElement("div");
                dot.className = "cal-dot";
                dots.appendChild(dot);
            }
            cell.appendChild(dots);
            cell.addEventListener("click", () => openDayDetail(dateKey));
        }

        grid.appendChild(cell);
    }
}

function openDayDetail() {
    document.getElementById("calDayDetail").style.display = "block";
}

window.closeDayDetail = function () {
    selectedDate = null;
    document.getElementById("calDayDetail").style.display = "none";
    renderCalendar();
};

window.prevMonth = function () {
    calMonth--;
    if (calMonth < 0) { calMonth = 11; calYear--; }
    closeDayDetailSilent();
    renderCalendar();
};

window.nextMonth = function () {
    calMonth++;
    if (calMonth > 11) { calMonth = 0; calYear++; }
    closeDayDetailSilent();
    renderCalendar();
};

function closeDayDetailSilent() {
    selectedDate = null;
    const el = document.getElementById("calDayDetail");
    if (el) el.style.display = "none";
}


window.acceptVisit = function (btn) {
    const row     = btn.closest("tr");
    const cells   = row.querySelectorAll("td");

    const name    = cells[0]?.textContent.trim();
    const address = cells[1]?.textContent.trim();
    const rawDate = cells[2]?.textContent.trim(); 
    const type    = cells[3]?.textContent.trim();

    let dateKey = "", time = "";
    if (rawDate) {
        const parts = rawDate.split(" ");
        dateKey = parts[0] || "";
        time    = parts[1] ? parts[1].substring(0,5) : "";
    }
    const statusCell = row.querySelector(".status-badge");
    if (statusCell) {
        statusCell.className = "status-badge confirmed";
        statusCell.textContent = "مؤكدة";
    }
    const lastCell = row.querySelector("td:last-child");
    if (lastCell) lastCell.innerHTML = '<span class="status-badge confirmed">تم القبول</span>';

    if (dateKey && name) {
        addVisitToCalendar(dateKey, { time, name, address, type });
        renderCalendar();

        const [y, m] = dateKey.split("-").map(Number);
        calYear  = y;
        calMonth = m - 1;
        renderCalendar();
    }

    showToast(`✓ تمت إضافة ${name} إلى التقويم`);
};

function showToast(msg) {
    let toast = document.getElementById("calToast");
    if (!toast) {
        toast = document.createElement("div");
        toast.id = "calToast";
        toast.className = "cal-toast";
        document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 3000);
}

document.addEventListener("DOMContentLoaded", function () {
    renderCalendar();
});