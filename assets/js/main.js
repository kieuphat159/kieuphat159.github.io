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
                return;
        }

        fetch(path)
                .then((response) => {
                        if (!response.ok) {
                                throw new Error(`HTTP error! status: ${response.status}`);
                        }
                        return response.text();
                })
                .then((data) => {
                        const element = $(selector);
                        if (element) {
                                element.innerHTML = data;
                                localStorage.setItem(path, data);
                        }
                        if (typeof callback === "function") callback();
                })
                .catch((error) => {
                        console.error("Error loading template:", error);
                        const element = $(selector);
                        if (element) {
                                element.innerHTML = "<p>Không thể tải trang. Vui lòng thử lại sau.</p>";
                        }
                        if (typeof callback === "function") callback();
                });
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

// Hàm hiển thị và ẩn loading indicator khi tải trang
function showLoading() {
        const loading = document.getElementById("page-loading");
        if (loading) {
                loading.style.display = "flex";
                // Ẩn content khi loading
                document.body.classList.remove("page-ready");
        }
}

function hideLoading() {
        const loading = document.getElementById("page-loading");
        if (loading) {
                // Hiện content trước
                document.body.classList.add("page-ready");

                setTimeout(() => {
                        loading.style.display = "none";
                }, 150);
        }
}

// Hàm tải trang con vào trong thẻ <main>
function loadPage(page) {
        showLoading();

        load("#main", `./pages/${page}.html`, () => {
                // Xóa script và CSS cũ nếu có
                const oldScript = document.getElementById("page-script");
                if (oldScript) oldScript.remove();

                const oldCss = document.getElementById("page-style");
                if (oldCss) oldCss.remove();

                // Tạo thẻ CSS mới
                const link = document.createElement("link");
                link.id = "page-style";
                link.rel = "stylesheet";
                link.href = `./assets/css/pages/${page}.css`;

                // Tạo thẻ script mới
                const script = document.createElement("script");
                script.id = "page-script";
                script.src = `./assets/js/pages/${page}.js`;
                script.async = true;

                // Biến theo dõi trạng thái loading
                let jsLoaded = false;
                let cssLoaded = false;
                let jsError = false;
                let cssError = false;

                // Hàm kiểm tra và ẩn loading
                function tryHideLoading() {
                        // Chỉ ẩn loading khi cả JS và CSS đều đã được xử lý (thành công hoặc lỗi)
                        if ((jsLoaded || jsError) && (cssLoaded || cssError)) {
                                hideLoading();

                                // Log thông tin nếu có lỗi
                                if (jsError) {
                                        console.warn(`Failed to load JavaScript file: ./assets/js/pages/${page}.js`);
                                }
                                if (cssError) {
                                        console.warn(`Failed to load CSS file: ./assets/css/pages/${page}.css`);
                                }
                        }
                }

                // Xử lý sự kiện cho CSS
                link.onload = () => {
                        cssLoaded = true;
                        tryHideLoading();
                };

                link.onerror = () => {
                        cssError = true;
                        console.error(`Failed to load CSS: ${page}.css`);
                        tryHideLoading();
                };

                // Xử lý sự kiện cho JavaScript
                script.onload = () => {
                        jsLoaded = true;
                        tryHideLoading();
                };

                script.onerror = () => {
                        jsError = true;
                        console.error(`Failed to load JavaScript: ${page}.js`);
                        tryHideLoading();
                };

                document.head.appendChild(link);
                document.body.appendChild(script);

                // Timeout fallback - nếu sau 10 giây vẫn chưa load xong thì ẩn loading
                setTimeout(() => {
                        if (!((jsLoaded || jsError) && (cssLoaded || cssError))) {
                                console.warn("Loading timeout - hiding loading indicator");
                                hideLoading();
                        }
                }, 10000);
        });
}

// Hàm cập nhật active class cho liên kết điều hướng
function updateActiveNavLink(page) {
        document.querySelectorAll(".header-main-nav li").forEach((li) => li.classList.remove("active"));
        const activeLink = document.querySelector(`.header-main-nav a[data-page="${page}"]`);
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

document.addEventListener("DOMContentLoaded", () => {
        // Load content
        load("#header", "./templates/header.html", () => {
                activateNavLink();
                handleHashChange();
                setupThemeToggle();
        });
        load("#footer", "./templates/footer.html");

        window.addEventListener("hashchange", handleHashChange);

        // Hiện trang luôn
        document.body.classList.add("page-ready");
});

// Close side menu khi thay đổi kích thước trở về bản desktop
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
                btn.setAttribute("data-mode", isDark ? "dark" : "light");
                btn.setAttribute("aria-pressed", isDark ? "true" : "false");
                localStorage.setItem("theme", isDark ? "dark" : "light");
        });
}
