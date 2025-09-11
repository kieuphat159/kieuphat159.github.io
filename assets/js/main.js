// main.js - JS chung cho toàn bộ website
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

// vì querySelector là method của document, bên trong nó cần this trỏ tới một document/element hợp lệ, nếu gán thẳng thì this sẽ bị mất và gây lỗi Illegal invocation

/**
 * Hàm tải template
 *image.png
 * Cách dùng:
 * <div id="parent"></div>
 * <script>
 *  load("#parent", "./path-to-template.html", callback);
 * </script>
 * Sau đó trang từ đường dẫn trên sẽ được load vào trong div có id="parent"
 */
function load(selector, path, callback) {
    const cachedTemplates = localStorage.getItem(path);
    if (cachedTemplates) {
        $(selector).innerHTML = cachedTemplates;
        if (typeof callback === "function") callback();
    }

    fetch(path)
        .then((response) => response.text())
        .then((data) => {
            $(selector).innerHTML = data;
            localStorage.setItem(path, data);
            if (typeof callback === "function") callback();
        })
        .catch((error) => console.error("Error loading template:", error));
}

function setupMobileMenu() {
    const menuToggle = $("#menuToggle");
    const sideMenu = $("#sideMenu");
    const sideMenuBack = $("#sideMenuBack");
    const sideMenuOverlay = $("#sideMenuOverlay");

    if (menuToggle && sideMenu && sideMenuBack && sideMenuOverlay) {
        menuToggle.addEventListener("click", () => {
            sideMenu.classList.add("active");
            sideMenuOverlay.classList.add("active");
        });

        function closeMenu() {
            sideMenu.classList.remove("active");
            sideMenuOverlay.classList.remove("active");
        }
        sideMenuBack.addEventListener("click", closeMenu);
        sideMenuOverlay.addEventListener("click", closeMenu);
    }
}

function loadPage(page) {
    load("main", `./pages/${page}.html`);
}

function updateActiveNavLink(page) {
    document.querySelectorAll("header .header-main-nav__item").forEach((li) => li.classList.remove("active"));
    const activeLink = document.querySelector(`header .header-main-nav__link[data-page="${page}"]`);
    if (activeLink) {
        activeLink.parentElement.classList.add("active");
    }
}

function activateNavLink() {
    setupMobileMenu();

    $$(".header-main-nav__link[data-page], .header-side-menu__link[data-page]").forEach((link) => {
        link.addEventListener("click", (event) => {
            event.preventDefault();

            const page = link.getAttribute("data-page");
            window.location.hash = page;
        });
    });
}

function handleHashChange() {
    const page = window.location.hash.replace("#", "") || "home";
    loadPage(page);
    updateActiveNavLink(page);
}

// Load trang chủ khi trang được tải lần đầu
document.addEventListener("DOMContentLoaded", () => {
    load("#header", "./templates/header.html", () => {
        activateNavLink();
        handleHashChange();
    });

    // Chỗ này lưu ý nếu đem hàm handlehashchange ra ngoài thì nó sẽ chạy trước khi header được load xong và có thể gây lỗi
    load("#footer", "./templates/footer.html");
    window.addEventListener("hashchange", handleHashChange);
});

// Đóng menu khi thay đổi kích thước trờ về bản desktop
window.addEventListener("resize", function () {
    if (window.innerWidth > 991.98) {
        const sideMenu = document.getElementById("sideMenu");
        const sideMenuOverlay = document.getElementById("sideMenuOverlay");
        if (sideMenu) sideMenu.classList.remove("active");
        if (sideMenuOverlay) sideMenuOverlay.classList.remove("active");
    }
});
