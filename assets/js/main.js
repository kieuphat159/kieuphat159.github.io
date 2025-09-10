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

// Gắn logic menu mobile sau khi header load xong
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
