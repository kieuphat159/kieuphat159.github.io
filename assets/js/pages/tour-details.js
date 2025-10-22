// Chạy ngay lập tức
(function initTourDetails() {
    console.log("initTourDetails started");

    const tabButtons = document.querySelectorAll(".tour-details-tabs__item");
    const tabContents = document.querySelectorAll(".tour-details-tab-content");

    // --- TAB FUNCTIONALITY ---
    if (tabButtons.length > 0) {
        tabButtons[0].classList.add("tour-details-tabs__item--active");
        if (tabContents.length > 0) {
            tabContents[0].style.display = "block";
        }
    }

    tabButtons.forEach((button) => {
        button.addEventListener("click", function () {
            const targetTab = this.getAttribute("data-tab");

            tabButtons.forEach((btn) => btn.classList.remove("tour-details-tabs__item--active"));
            this.classList.add("tour-details-tabs__item--active");

            tabContents.forEach((content) => (content.style.display = "none"));
            const targetContent = document.querySelector(`[data-content="${targetTab}"]`);
            if (targetContent) targetContent.style.display = "block";
        });
    });

    // --- PAGINATION FUNCTIONALITY ---
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
            const prevPage = activePage?.previousElementSibling;
            if (prevPage && prevPage.classList.contains("pagination-number")) {
                paginationNumbers.forEach((b) => b.classList.remove("pagination-number--active"));
                prevPage.classList.add("pagination-number--active");
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener("click", function () {
            const activePage = document.querySelector(".pagination-number--active");
            const nextPage = activePage?.nextElementSibling;
            if (nextPage && nextPage.classList.contains("pagination-number")) {
                paginationNumbers.forEach((b) => b.classList.remove("pagination-number--active"));
                nextPage.classList.add("pagination-number--active");
            }
        });
    }

    // --- BOOKING FORM VALIDATION ---
    const bookingForm = document.querySelector(".booking-form");
    if (!bookingForm) return;

    const inputs = bookingForm.querySelectorAll("input, textarea");

    // Hàm hiển thị lỗi
    function showError(input, message) {
        const group = input.closest(".booking-form__group");
        if (!group) return;
        let errorEl = group.querySelector(".booking-form__error");

        if (!errorEl) {
            errorEl = document.createElement("small");
            errorEl.className = "booking-form__error";
            group.appendChild(errorEl);
        }

        errorEl.textContent = message;
        errorEl.classList.add("active");
        input.classList.add("error");
    }

    // Hàm ẩn lỗi
    function clearError(input) {
        const group = input.closest(".booking-form__group");
        if (!group) return;
        const errorEl = group.querySelector(".booking-form__error");
        if (errorEl) {
            errorEl.textContent = "";
            errorEl.classList.remove("active");
        }
        input.classList.remove("error");
    }

    // Hàm kiểm tra 1 field
    function validateField(input) {
        const value = input.value.trim();
        const placeholder = input.getAttribute("placeholder") || "";

        clearError(input);

        if (input.type === "text" && placeholder === "Name") {
            if (!value) return showError(input, "Vui lòng nhập họ tên.");
        }

        if (input.type === "email") {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!value) return showError(input, "Vui lòng nhập email.");
            if (!emailPattern.test(value)) return showError(input, "Email không hợp lệ.");
        }

        if (input.type === "tel") {
            const phonePattern = /^(?:\+84|0)\d{9}$/;
            if (!value) return showError(input, "Vui lòng nhập số điện thoại.");
            if (!phonePattern.test(value))
                return showError(input, "Số điện thoại không hợp lệ (0xxxxxxxxx hoặc +84xxxxxxxxx).");
        }

        if (input.type === "date") {
            if (!value) return showError(input, "Vui lòng chọn ngày.");
            const selected = new Date(value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (selected < today) return showError(input, "Ngày không hợp lệ hoặc đã qua.");
        }

        if (input.type === "number") {
            const num = parseInt(value, 10);
            if (!value) return showError(input, "Vui lòng nhập số vé.");
            if (isNaN(num) || num <= 0) return showError(input, "Số vé phải là số nguyên dương.");
        }

        if (input.tagName === "TEXTAREA") {
            if (value.length < 5) return showError(input, "Tin nhắn quá ngắn (ít nhất 5 ký tự).");
        }
    }

    // --- Validate realtime ---
    inputs.forEach((input) => {
        input.addEventListener("blur", () => validateField(input));
        input.addEventListener("input", () => clearError(input));
    });

    // --- Validate khi submit ---
    bookingForm.addEventListener("submit", function (e) {
        e.preventDefault();

        let isValid = true;
        inputs.forEach((input) => {
            validateField(input);
            if (input.classList.contains("error")) isValid = false;
        });

        if (!isValid) return;

        const submitBtn = bookingForm.querySelector(".booking-form__submit-btn");
        submitBtn.disabled = true;
        submitBtn.textContent = "Processing...";

        setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.textContent = "Book Now";
            bookingForm.reset();
            showSuccessModal();
        }, 1500);
    });

    // --- Modal thành công ---
    function showSuccessModal() {
        let modal = document.querySelector(".booking-success-modal");
        if (!modal) {
            modal = document.createElement("div");
            modal.className = "booking-success-modal";
            modal.innerHTML = `
                <div class="booking-success-modal__content">
                    <h3>Đặt tour thành công!</h3>
                    <p>Cảm ơn bạn đã tin tưởng. Chúng tôi sẽ liên hệ sớm nhất có thể.</p>
                    <button class="booking-success-modal__close">Đóng</button>
                </div>
            `;
            document.body.appendChild(modal);
        }
        modal.style.display = "flex";

        const closeBtn = modal.querySelector(".booking-success-modal__close");
        closeBtn.addEventListener("click", () => {
            modal.style.display = "none";
        });
    }

    console.log("initTourDetails completed");
})();
