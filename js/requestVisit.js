window.openBookingModal = function () {


    document.getElementById("bookingOverlay").classList.add("open");
    document.body.style.overflow = "hidden";

    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    document.querySelector('[name="datetime"]').min = now.toISOString().slice(0,16);
};

window.closeBookingModal = function () {
    document.getElementById("bookingOverlay").classList.remove("open");
    document.body.style.overflow = "";
    document.getElementById("bookingForm").reset();
    document.getElementById("nationalIdLabel").textContent = "رفع صورة بطاقة الرقم القومي";
};

window.closeBookingIfOutside = function (e) {
    if (e.target === document.getElementById("bookingOverlay")) closeBookingModal();
};


window.submitBooking = function (e) {
    e.preventDefault();
    closeBookingModal();
    document.getElementById("successOverlay").classList.add("open");
};

window.closeSuccessModal = function () {
    document.getElementById("successOverlay").classList.remove("open");
    document.body.style.overflow = "";
};

document.getElementById("nationalId").addEventListener("change", function () {
    const label = document.getElementById("nationalIdLabel");
    if (this.files.length > 0) {
        label.innerHTML = `<i class="fa-solid fa-check" style="color:#28a745"></i> ${this.files[0].name}`;
    } else {
        label.innerHTML = `<i class="fa-solid fa-id-card"></i> رفع صورة بطاقة الرقم القومي`;
    }
});

document.addEventListener("DOMContentLoaded", function () {
    selectVisitType("doctor", document.querySelector('.visit-type-btn[data-type="doctor"]'));
});