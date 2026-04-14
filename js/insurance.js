// /* =============================================
//    DATA
//    ============================================= */
// const allItems = [
//     /* Hospitals */
//     { id:1,  type:"hospital",  name:"مستشفى القاهرة التخصصي",       address:"المعادي، القاهرة",          phone:"0227920000", emergency:true,  depts:["باطنة","جراحة","قلب","أطفال","طوارئ"] },
//     { id:2,  type:"hospital",  name:"مستشفى النيل بدر",               address:"المنيل، القاهرة",            phone:"0227940000", emergency:true,  depts:["عظام","مخ وأعصاب","جلدية"] },
//     { id:3,  type:"hospital",  name:"مستشفى الشيخ زايد التخصصي",     address:"الشيخ زايد، الجيزة",        phone:"0238271000", emergency:false, depts:["نساء وتوليد","باطنة","جراحة"] },
//     { id:4,  type:"hospital",  name:"مستشفى مصر الدولي",              address:"مدينة نصر، القاهرة",        phone:"0224155000", emergency:true,  depts:["قلب","أورام","غدد","طوارئ"] },
//     { id:5,  type:"hospital",  name:"مستشفى الهلال الأحمر",           address:"مصر الجديدة، القاهرة",      phone:"0222620000", emergency:true,  depts:["عظام","جراحة","باطنة"] },
//     { id:6,  type:"hospital",  name:"مستشفى سانت فاميلي",             address:"الزمالك، القاهرة",          phone:"0227350000", emergency:false, depts:["نساء وتوليد","أطفال","باطنة"] },
//     /* Pharmacies */
//     { id:7,  type:"pharmacy",  name:"صيدلية النهضة",                  address:"الدقي، الجيزة",             phone:"0233381234", emergency:false, depts:["أدوية مزمنة","مستلزمات طبية"] },
//     { id:8,  type:"pharmacy",  name:"صيدلية سيف",                     address:"التجمع الخامس، القاهرة",   phone:"0226600000", emergency:false, depts:["أدوية","مستحضرات تجميل"] },
//     { id:9,  type:"pharmacy",  name:"صيدلية العزبي",                   address:"شبرا، القاهرة",             phone:"0224444444", emergency:false, depts:["أدوية","فيتامينات","مستلزمات"] },
//     { id:10, type:"pharmacy",  name:"صيدلية رامي",                    address:"اكتوبر، الجيزة",            phone:"0238530000", emergency:false, depts:["أدوية","تغذية علاجية"] },
//     /* Radiology */
//     { id:11, type:"radiology", name:"مركز الرواد للأشعة",             address:"المهندسين، الجيزة",         phone:"0233044000", emergency:false, depts:["أشعة مقطعية","رنين مغناطيسي","موجات صوتية"] },
//     { id:12, type:"radiology", name:"مركز الدلتا للتصوير الطبي",      address:"شبرا الخيمة، القليوبية",    phone:"0224441234", emergency:false, depts:["CT","MRI","أشعة عادية"] },
//     { id:13, type:"radiology", name:"مركز الحياة للأشعة",             address:"مدينة نصر، القاهرة",        phone:"0222624444", emergency:false, depts:["رنين","مقطعي","نووي"] },
//     { id:14, type:"radiology", name:"مركز الأمل للأشعة التشخيصية",    address:"العجوزة، الجيزة",           phone:"0233574444", emergency:false, depts:["موجات صوتية","CT"] },
//     /* Labs */
//     { id:15, type:"lab",       name:"معمل البرج للتحاليل",             address:"وسط البلد، القاهرة",       phone:"0223930000", emergency:false, depts:["دم","بول","هرمونات","صوديوم"] },
//     { id:16, type:"lab",       name:"معمل الحياة الطبي",               address:"الجيزة",                   phone:"0237600000", emergency:false, depts:["PCR","تحاليل شاملة","ثقافة بكتيرية"] },
//     { id:17, type:"lab",       name:"معمل الدلتا",                     address:"المنصورة، الدقهلية",        phone:"0502340000", emergency:false, depts:["دم","تحاليل سرطانية","بول"] },
//     { id:18, type:"lab",       name:"معمل فاروس",                     address:"الإسكندرية",                phone:"0354210000", emergency:false, depts:["هرمونات","أجسام مضادة","كيمياء دم"] },
//     /* More Hospitals */
//     { id:19, type:"hospital",  name:"مستشفى مبارك للأورام",           address:"المنيا",                   phone:"0862340000", emergency:true,  depts:["أورام","جراحة","طوارئ","أشعة"] },
//     { id:20, type:"hospital",  name:"مستشفى بني سويف العام",          address:"بني سويف",                 phone:"0822320000", emergency:true,  depts:["طوارئ","باطنة","جراحة","عظام"] },
//     { id:21, type:"pharmacy",  name:"صيدلية الدواء المصري",           address:"الهرم، الجيزة",             phone:"0233888888", emergency:false, depts:["أدوية","مستلزمات طبية"] },
//     { id:22, type:"radiology", name:"مركز النور للأشعة",              address:"أسيوط",                    phone:"0882256789", emergency:false, depts:["MRI","CT","أشعة"] },
//     { id:23, type:"lab",       name:"معمل القمة",                     address:"سوهاج",                    phone:"0932334567", emergency:false, depts:["دم","بول","كيمياء"] },
//     { id:24, type:"hospital",  name:"مستشفى الدمرداش الجامعي",        address:"عين شمس، القاهرة",         phone:"0222017100", emergency:true,  depts:["طوارئ","كلى","مخ وأعصاب","جراحة"] },
// ];

// const CARDS_PER_PAGE = 8;
// let currentPage = 1;
// let filteredItems = [...allItems];

// /* Type icons & colors */
// const typeConfig = {
//     hospital:  { icon:"fa-solid fa-hospital",   badgeClass:"badge-hospital",  placeholder:"🏥" },
//     pharmacy:  { icon:"fa-solid fa-pills",        badgeClass:"badge-pharmacy",  placeholder:"💊" },
//     radiology: { icon:"fa-solid fa-x-ray",        badgeClass:"badge-radiology", placeholder:"🩻" },
//     lab:       { icon:"fa-solid fa-vials",         badgeClass:"badge-lab",       placeholder:"🔬" },
// };
// const typeLabel = { hospital:"مستشفى", pharmacy:"صيدلية", radiology:"مركز أشعة", lab:"معمل تحاليل" };

// /* Placeholder bg colors */
// const placeholderBg = {
//     hospital:  "linear-gradient(135deg,#e8f4fd,#c5e4f7)",
//     pharmacy:  "linear-gradient(135deg,#e8fdf0,#b8f0cf)",
//     radiology: "linear-gradient(135deg,#fff4e8,#ffd8a8)",
//     lab:       "linear-gradient(135deg,#f3e8ff,#d8b4fe)",
// };
// const placeholderIconColor = {
//     hospital:"#128CCF", pharmacy:"#28a745", radiology:"#e66a1e", lab:"#8e24aa"
// };

// /* =============================================
//    RENDER
//    ============================================= */
// function renderCards() {
//     const grid = document.getElementById("cardsGrid");
//     const empty = document.getElementById("emptyState");
//     const start = (currentPage - 1) * CARDS_PER_PAGE;
//     const pageItems = filteredItems.slice(start, start + CARDS_PER_PAGE);

//     document.getElementById("visibleCount").textContent = filteredItems.length > 0 ? Math.min(start + CARDS_PER_PAGE, filteredItems.length) : 0;
//     document.getElementById("totalCount").textContent   = filteredItems.length;

//     if (filteredItems.length === 0) {
//         grid.innerHTML = "";
//         empty.classList.add("show");
//         renderPagination();
//         return;
//     }
//     empty.classList.remove("show");

//     grid.innerHTML = pageItems.map((item, idx) => {
//         const cfg = typeConfig[item.type];
//         const maxDepts = 3;
//         const visibleDepts = item.depts.slice(0, maxDepts);
//         const extraDepts = item.depts.length - maxDepts;

//         return `
//         <div class="ins-card" style="animation-delay:${idx * 0.06}s" data-type="${item.type}" data-name="${item.name}">
//             <div class="card-img-wrap">
//                 <div class="card-img-placeholder" style="background:${placeholderBg[item.type]}">
//                     <i class="${cfg.icon}" style="color:${placeholderIconColor[item.type]}; opacity:0.4; font-size:56px;"></i>
//                 </div>
//                 <span class="card-type-badge ${cfg.badgeClass}">
//                     <i class="${cfg.icon}" style="margin-left:4px"></i>${typeLabel[item.type]}
//                 </span>
//                 ${item.emergency
//                     ? `<span class="emergency-tag"><i class="fa-solid fa-triangle-exclamation"></i> طوارئ</span>`
//                     : `<span class="no-emergency-tag">لا توجد طوارئ</span>`
//                 }
//             </div>
//             <div class="card-body">
//                 <div class="card-name">${item.name}</div>
//                 <div class="card-address">
//                     <i class="fa-solid fa-location-dot"></i>
//                     <span>${item.address}</span>
//                 </div>
//                 <div class="card-depts">
//                     ${visibleDepts.map(d => `<span class="dept-tag">${d}</span>`).join("")}
//                     ${extraDepts > 0 ? `<span class="dept-more">+${extraDepts}</span>` : ""}
//                 </div>
//             </div>
//             <div class="card-footer">
//                 <button class="call-now-btn" onclick="callNow('${item.phone}','${item.name}')">
//                     <i class="fa-solid fa-phone"></i>
//                     اتصل الآن
//                 </button>
//             </div>
//         </div>`;
//     }).join("");

//     renderPagination();
// }

// /* =============================================
//    PAGINATION
//    ============================================= */
// function renderPagination() {
//     const wrap = document.getElementById("paginationWrap");
//     const totalPages = Math.ceil(filteredItems.length / CARDS_PER_PAGE);
//     if (totalPages <= 1) { wrap.innerHTML = ""; return; }

//     let html = "";

//     // Prev
//     html += `<button class="page-btn arrow ${currentPage===1?'disabled':''}" onclick="goPage(${currentPage-1})">
//                 <i class="fa-solid fa-chevron-right"></i>
//              </button>`;

//     // Pages
//     for (let i = 1; i <= totalPages; i++) {
//         if (i === 1 || i === totalPages || Math.abs(i - currentPage) <= 1) {
//             html += `<button class="page-btn ${i===currentPage?'active':''}" onclick="goPage(${i})">${i}</button>`;
//         } else if (Math.abs(i - currentPage) === 2) {
//             html += `<span style="color:#aaa;font-size:18px;line-height:38px">…</span>`;
//         }
//     }

//     // Next
//     html += `<button class="page-btn arrow ${currentPage===totalPages?'disabled':''}" onclick="goPage(${currentPage+1})">
//                 <i class="fa-solid fa-chevron-left"></i>
//              </button>`;

//     wrap.innerHTML = html;
// }

// function goPage(page) {
//     const totalPages = Math.ceil(filteredItems.length / CARDS_PER_PAGE);
//     if (page < 1 || page > totalPages) return;
//     currentPage = page;
//     renderCards();
//     document.getElementById("cardsGrid").scrollIntoView({ behavior: "smooth", block: "start" });
// }

// /* =============================================
//    FILTER & SEARCH
//    ============================================= */
// let currentType = "all";
// let currentQuery = "";

// function applyFilters() {
//     filteredItems = allItems.filter(item => {
//         const typeMatch  = currentType === "all" || item.type === currentType;
//         const queryMatch = currentQuery === "" ||
//             item.name.includes(currentQuery) ||
//             item.address.includes(currentQuery);
//         return typeMatch && queryMatch;
//     });
//     currentPage = 1;
//     renderCards();
// }

// window.filterCards = function (type, btn) {
//     currentType = type;
//     document.querySelectorAll(".filter-tab").forEach(t => t.classList.remove("active"));
//     btn.classList.add("active");
//     applyFilters();
// };

// window.searchCards = function (val) {
//     currentQuery = val.trim();
//     applyFilters();
// };

// /* =============================================
//    CALL & MAP
//    ============================================= */
// window.callNow = function (phone, name) {
//     if (confirm(`هل تريد الاتصال بـ ${name}?\n${phone}`)) {
//         window.location.href = `tel:${phone}`;
//     }
// };

// window.openMapModal = function () {
//     document.getElementById("mapModal").classList.add("open");
//     document.body.style.overflow = "hidden";
// };
// window.closeMapModal = function () {
//     document.getElementById("mapModal").classList.remove("open");
//     document.body.style.overflow = "";
// };
// window.closeMapIfOutside = function (e) {
//     if (e.target === document.getElementById("mapModal")) closeMapModal();
// };

// /* =============================================
//    HEADER helpers (match header.js pattern)
//    ============================================= */
// window.closeTopBar = function () {
//     document.querySelector(".top-bar").style.display = "none";
// };
// window.toggleMenu = function () {
//     document.querySelector(".nav").classList.toggle("active");
//     document.querySelector(".hamburger").classList.toggle("open");
// };
// window.toggleTheme = function () {
//     document.body.classList.toggle("dark-mode");
//     const icons = document.querySelectorAll(".theme-toggle i, #navThemeIcon");
//     const isDark = document.body.classList.contains("dark-mode");
//     icons.forEach(i => { i.className = isDark ? "fa-solid fa-sun" : "fa-solid fa-moon"; });
// };

// /* Init */
// renderCards();