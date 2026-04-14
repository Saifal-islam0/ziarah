"use strict";

window.toggleUserMenu = function () {
    const dd = document.getElementById("userDropdown");
    if (dd) dd.classList.toggle("open");
};

document.addEventListener("click", function (e) {
    const menu = document.querySelector(".user-menu");
    const dd   = document.getElementById("userDropdown");
    if (dd && menu && !menu.contains(e.target)) {
        dd.classList.remove("open");
    }
});

window.openEmergency  = function () {
    document.getElementById("emergencyModal").style.display = "flex";
};
window.closeEmergency = function () {
    document.getElementById("emergencyModal").style.display = "none";
};
