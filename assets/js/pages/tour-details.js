console.log("tour-details.js loaded");

// Chạy ngay lập tức
(function initTourDetails() {
    console.log("initTourDetails started");

    const tabButtons = document.querySelectorAll(".tour-details-tabs__item");
    const tabContents = document.querySelectorAll(".tour-details-tab-content");

    console.log("Tab buttons found:", tabButtons.length);
    console.log("Tab contents found:", tabContents.length);

    // Set first tab as active by default
    if (tabButtons.length > 0) {
        tabButtons[0].classList.add("tour-details-tabs__item--active");
        if (tabContents.length > 0) {
            tabContents[0].style.display = "block";
        }
    }

    tabButtons.forEach((button) => {
        button.addEventListener("click", function () {
            console.log("Tab clicked:", this.getAttribute("data-tab"));
            const targetTab = this.getAttribute("data-tab");

            // Remove active class from all tabs
            tabButtons.forEach((btn) => btn.classList.remove("tour-details-tabs__item--active"));

            // Add active class to clicked tab
            this.classList.add("tour-details-tabs__item--active");

            // Hide all tab contents
            tabContents.forEach((content) => {
                content.style.display = "none";
            });

            // Show target tab content
            const targetContent = document.querySelector(`[data-content="${targetTab}"]`);
            console.log("Target content:", targetContent);
            if (targetContent) {
                targetContent.style.display = "block";
            }
        });
    });

    // Pagination functionality for gallery
    const paginationNumbers = document.querySelectorAll(".pagination-number");
    paginationNumbers.forEach((btn) => {
        btn.addEventListener("click", function () {
            paginationNumbers.forEach((b) => b.classList.remove("pagination-number--active"));
            this.classList.add("pagination-number--active");
        });
    });

    const prevBtn = document.querySelector(".pagination-btn--prev");
    const nextBtn = document.querySelector(".pagination-btn--next");

    if (prevBtn) {
        prevBtn.addEventListener("click", function () {
            const activePage = document.querySelector(".pagination-number--active");
            const prevPage = activePage.previousElementSibling;
            if (prevPage && prevPage.classList.contains("pagination-number")) {
                paginationNumbers.forEach((b) => b.classList.remove("pagination-number--active"));
                prevPage.classList.add("pagination-number--active");
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener("click", function () {
            const activePage = document.querySelector(".pagination-number--active");
            const nextPage = activePage.nextElementSibling;
            if (nextPage && nextPage.classList.contains("pagination-number")) {
                paginationNumbers.forEach((b) => b.classList.remove("pagination-number--active"));
                nextPage.classList.add("pagination-number--active");
            }
        });
    }

    console.log("initTourDetails completed");
})();
