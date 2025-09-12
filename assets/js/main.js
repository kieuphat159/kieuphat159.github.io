// main.js - JS chung cho toàn bộ website
const $ = document.querySelector.bind(document);
// chọn phần tử đầu tiên phù hợp với selector
const $$ = document.querySelectorAll.bind(document);
// chọn tất cả phần tử phù hợp với selector

/**
 * Hàm tải template
 *
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

// Hàm dùng để thiết lập phần điều hướng cho bản mobile khi bấm vào nút 3 gạch
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
    document.querySelectorAll(".main-nav li").forEach((li) => li.classList.remove("active"));
    const activeLink = document.querySelector(`.main-nav a[data-page="${page}"]`);
    if (activeLink) {
        activeLink.parentElement.classList.add("active");
    }
}

// Hàm kích hoạt liên kết điều hướng và thiết lập menu mobile
function activateNavLink() {
    setupMobileMenu();

    $$("a[data-page]").forEach((link) => {
        link.addEventListener("click", (event) => {
            event.preventDefault();

            const page = link.getAttribute("data-page");
            loadPage(page);
            window.location.hash = page;

            // Cập nhật active class
            updateActiveNavLink(page);
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
        setupThemeToggle();
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

// Dark mode toggle
function setupThemeToggle() {
    const btn = document.getElementById("themeToggle");
    if (!btn) return;
    const root = document.documentElement;

    const theme = localStorage.getItem("theme");
    if (theme === "dark") {
        root.classList.add("dark");
        btn.setAttribute("data-mode", "dark");
        btn.setAttribute("aria-pressed", "true");
    } else {
        btn.setAttribute("data-mode", "light");
    }

    btn.addEventListener("click", () => {
        const isDark = root.classList.toggle("dark");
        // Nếu trước đó chưa có class dark thì isDark sẽ là true vì nó sẽ thêm class dark và, ngược lại là false
        btn.setAttribute("data-mode", isDark ? "dark" : "light");
        btn.setAttribute("aria-pressed", isDark ? "true" : "false");
        localStorage.setItem("theme", isDark ? "dark" : "light");
    });
}
