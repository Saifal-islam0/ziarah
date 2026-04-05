function toggleTheme() {
    document.body.classList.toggle("dark-mode");

    const icon = document.querySelector(".theme-toggle i");
    if (document.body.classList.contains("dark-mode")) {
        icon.classList.replace("fa-moon", "fa-sun");
        sessionStorage.setItem("theme", "dark"); 
    } else {
        icon.classList.replace("fa-sun", "fa-moon");
        sessionStorage.setItem("theme", "light");
    }
}

if (sessionStorage.getItem("theme") === "dark") { 
    document.body.classList.add("dark-mode");
    document.querySelector(".theme-toggle i").classList.replace("fa-moon", "fa-sun");
}

function toggleTheme() {
    document.body.classList.toggle("dark-mode");

    const icon = document.querySelector(".theme-toggle i");
    if (document.body.classList.contains("dark-mode")) {
        icon.classList.replace("fa-moon", "fa-sun");
        sessionStorage.setItem("theme", "dark");  
    } else {
        icon.classList.replace("fa-sun", "fa-moon");
        sessionStorage.setItem("theme", "light"); 
    }
}
if (sessionStorage.getItem("theme") === "dark") {  
    document.body.classList.add("dark-mode");
    document.querySelector(".theme-toggle i").classList.replace("fa-moon", "fa-sun");
}
function toggleTheme() {
    document.body.classList.toggle("dark-mode");

    const icons = document.querySelectorAll(".theme-toggle i, .nav-theme i");
    icons.forEach(icon => {
        if (document.body.classList.contains("dark-mode")) {
            icon.classList.replace("fa-moon", "fa-sun");
        } else {
            icon.classList.replace("fa-sun", "fa-moon");
        }
    });

    sessionStorage.setItem("theme", document.body.classList.contains("dark-mode") ? "dark" : "light");
}

document.querySelector('.lang select').addEventListener('change', function () {
    const lang = this.value;
    if (lang === 'en') {
        window.location.href = 'https://translate.google.com/translate?sl=ar&tl=en&u=' + encodeURIComponent(window.location.href);
    } else {
        const originalUrl = window.location.href
            .replace(/https:\/\/translate\.google\.com\/translate\?.*&u=/, '')
            .replace(/https:\/\/[^.]+\.translate\.goog/, '');
        if (originalUrl !== window.location.href) {
            window.location.href = decodeURIComponent(originalUrl);
        }
    }
});
function toggleMenu() {
    const nav = document.querySelector(".nav");
    const hamburger = document.querySelector(".hamburger");
    nav.classList.toggle("active");
    hamburger.classList.toggle("open");
}

document.querySelectorAll(".nav a").forEach(link => {
    link.addEventListener("click", () => {
        document.querySelector(".nav").classList.remove("active");
        document.querySelector(".hamburger").classList.remove("open");
    });
});

const togglePassword = document.getElementById("togglePassword");
const passwordInput = document.getElementById("password");

togglePassword.addEventListener("click", function () {

    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        this.classList.remove("fa-eye");
        this.classList.add("fa-eye-slash");
    } else {
        passwordInput.type = "password";
        this.classList.remove("fa-eye-slash");
        this.classList.add("fa-eye");
    }

});

const toggleConfromPassword = document.getElementById("toggleConfromPassword");
const passwordConfromInput = document.getElementById("confromPassword");

toggleConfromPassword.addEventListener("click", function () {

    if (passwordConfromInput.type === "password") {
        passwordConfromInput.type = "text";
        this.classList.remove("fa-eye");
        this.classList.add("fa-eye-slash");
    } else {
        passwordConfromInput.type = "password";
        this.classList.remove("fa-eye-slash");
        this.classList.add("fa-eye");
    }

});
