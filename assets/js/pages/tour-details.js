// Chạy ngay lập tức
(function initTourDetails() {
        console.log("initTourDetails started");

        // Get tour ID from URL params
        const tourId = window.currentPageParams?.id;

        if (!tourId) {
                console.error("No tour ID provided");
                document.body.innerHTML =
                        '<div class="container"><h1>Tour not found</h1><p>No tour ID specified.</p></div>';
                return;
        }

        let tourData = null;
        let destinationData = null;
        let toursData = [];
        let destinationsMap = {};

        // Load tour and destination data
        async function loadTourData() {
                try {
                        // Load tours data
                        const toursResponse = await fetch("./tours.json");
                        const toursJson = await toursResponse.json();
                        toursData = toursJson.tours;

                        // Load destinations data
                        const dataResponse = await fetch("./data.json");
                        const dataJson = await dataResponse.json();

                        // Create destination map
                        dataJson.data.forEach((dest) => {
                                destinationsMap[dest.id] = dest;
                        });

                        // Find the tour
                        tourData = toursData.find((t) => t.id === tourId);

                        if (!tourData) {
                                console.error("Tour not found:", tourId);
                                document.body.innerHTML =
                                        '<div class="container"><h1>Tour not found</h1><p>The tour you are looking for does not exist.</p></div>';
                                return;
                        }

                        // Get destination data
                        destinationData = destinationsMap[tourData.destination_id];

                        // Now render the tour
                        renderTourDetails();
                } catch (error) {
                        console.error("Error loading tour data:", error);
                        document.body.innerHTML =
                                '<div class="container"><h1>Error</h1><p>Failed to load tour data.</p></div>';
                }
        }

        function renderTourDetails() {
                if (!tourData || !destinationData) return;

                // Update information tab
                renderInformationTab();

                // Update tour plan tab
                renderTourPlanTab();

                // Update location tab
                renderLocationTab();

                // Update gallery tab
                renderGalleryTab();

                // Initialize tabs
                initTabs();

                // Initialize booking form
                initBookingForm();
        }

        function renderInformationTab() {
                // Title
                const title = document.querySelector(".tour-details-info__title");
                if (title) title.textContent = destinationData.country;

                // Price
                const priceAmount = document.querySelector(".price-amount");
                if (priceAmount) {
                        const priceUSD = Math.round(tourData.price / 25000);
                        priceAmount.textContent = `${priceUSD.toLocaleString()} $`;
                }

                // Rating
                const ratingContainer = document.querySelector(".tour-details-info__rating .stars");
                if (ratingContainer) {
                        const fullStars = Math.floor(tourData.rating);
                        const halfStar = tourData.rating % 1 !== 0;
                        let starsHTML = Array(fullStars).fill('<i class="fas fa-star"></i>').join("");
                        if (halfStar) starsHTML += '<i class="fas fa-star-half-alt"></i>';
                        starsHTML += Array(5 - Math.ceil(tourData.rating))
                                .fill('<i class="far fa-star"></i>')
                                .join("");
                        ratingContainer.innerHTML = starsHTML;
                }

                const ratingText = document.querySelector(".rating-text");
                if (ratingText) {
                        ratingText.textContent = `(${tourData.rating}/5.0)`;
                }

                // Description
                const description = document.querySelector(".tour-details-info__description");
                if (description) {
                        // Use destination data blog entries for description
                        const countryDescription = destinationData.places.map((p) => p.blog).join(" ");
                        description.textContent = countryDescription.substring(0, 500) + "...";
                }

                // Tour details list
                const listItems = document.querySelectorAll(".tour-details-list__item");
                if (listItems.length >= 3) {
                        const destinationText = destinationData.places.map((p) => p.city).join(", ");
                        listItems[0].querySelector(".value").textContent =
                                destinationText + ", " + destinationData.country;
                        listItems[1].querySelector(".value").textContent = "Tập trung tại sân bay";
                        listItems[2].querySelector(".value").textContent = "08:00 AM";
                }

                // Features (includes/excludes)
                const includedList = document.querySelectorAll(
                        ".tour-details-features__column:last-child .features-list"
                )[0];
                const excludedList = document.querySelectorAll(
                        ".tour-details-features__column:first-child .features-list"
                )[0];

                if (includedList) {
                        let includedHTML = "";
                        if (tourData.services.hotel)
                                includedHTML += `<div class="features-list__item"><i class="far fa-check-circle"></i><span>${tourData.services.hotel}</span></div>`;
                        if (tourData.services.meals)
                                includedHTML += `<div class="features-list__item"><i class="far fa-check-circle"></i><span>${tourData.services.meals}</span></div>`;
                        if (tourData.services.guide)
                                includedHTML += `<div class="features-list__item"><i class="far fa-check-circle"></i><span>Hướng dẫn viên</span></div>`;
                        if (tourData.services.insurance)
                                includedHTML += `<div class="features-list__item"><i class="far fa-check-circle"></i><span>Bảo hiểm</span></div>`;
                        includedList.innerHTML = includedHTML;
                }

                if (excludedList) {
                        excludedList.innerHTML = `
                <div class="features-list__item"><i class="far fa-times-circle"></i><span>Chi phí cá nhân</span></div>
                <div class="features-list__item"><i class="far fa-times-circle"></i><span>Đồ uống</span></div>
            `;
                }

                // Gallery in info tab
                renderGalleryImages(".tour-details-gallery__grid");
        }

        function renderTourPlanTab() {
                const tourPlanContainer = document.querySelector(".tour-plan");
                if (!tourPlanContainer) return;

                const itemsContainer = document
                        .querySelector(".tour-plan")
                        .querySelector(".tour-plan__item").parentElement;
                if (!itemsContainer) return;

                itemsContainer.innerHTML = "";
                itemsContainer.className = "tour-plan";

                tourData.itinerary.forEach((day, index) => {
                        const dayItem = document.createElement("div");
                        dayItem.className = "tour-plan__item";

                        dayItem.innerHTML = `
                <div class="tour-plan__day">
                    <span class="day-number">${String(day.day).padStart(2, "0")}</span>
                </div>
                <div class="tour-plan__content">
                    <h3 class="tour-plan__heading">${day.title}</h3>
                    <p class="tour-plan__description">
                        ${day.activities.join(" ")}
                    </p>
                    <ul class="tour-plan__list">
                        ${
                                tourData.services.hotel
                                        ? `<li><i class="far fa-check-circle"></i> ${tourData.services.hotel}</li>`
                                        : ""
                        }
                        ${
                                tourData.services.meals
                                        ? `<li><i class="far fa-check-circle"></i> ${tourData.services.meals}</li>`
                                        : ""
                        }
                    </ul>
                </div>
            `;

                        itemsContainer.appendChild(dayItem);
                });
        }

        function renderLocationTab() {
                const locationDescription = document.querySelector(".tour-location__description");
                if (locationDescription && destinationData.places.length > 0) {
                        const description = destinationData.places.map((p) => p.blog).join(" ");
                        locationDescription.textContent = description;
                }

                const infoParagraphs = document.querySelectorAll(".tour-location__info p");
                if (infoParagraphs.length >= 2) {
                        infoParagraphs[0].textContent = `${destinationData.country} là một trong những điểm đến du lịch đáng mơ ước với cảnh quan tuyệt đẹp, văn hóa phong phú và ẩm thực đặc sắc.`;
                        infoParagraphs[1].textContent = `Hãy để chúng tôi đưa bạn đến khám phá những địa điểm nổi tiếng và trải nghiệm văn hóa độc đáo tại ${destinationData.country}.`;
                }
        }

        function renderGalleryTab() {
                renderGalleryImages(".tour-gallery-full__grid");
        }

        function renderGalleryImages(selector) {
                const container = document.querySelector(selector);
                if (!container) return;

                // Collect all images from famous locations
                const allImages = [];
                destinationData.places.forEach((place) => {
                        if (place.famous_locations) {
                                place.famous_locations.forEach((location) => {
                                        if (location.image_url) {
                                                allImages.push(location.image_url);
                                        }
                                });
                        }
                });

                // If we have images, create a gallery
                if (allImages.length > 0) {
                        if (selector === ".tour-gallery-full__grid") {
                                // Full gallery layout
                                container.innerHTML = `
                    <div class="gallery-column gallery-column--left">
                        ${allImages
                                .slice(0, 3)
                                .map(
                                        (img) =>
                                                `<div class="gallery-item gallery-item--small"><img src="${img}" alt="Gallery image" /></div>`
                                )
                                .join("")}
                    </div>
                    <div class="gallery-column gallery-column--center">
                        <div class="gallery-item gallery-item--featured">
                            <img src="${allImages[3] || allImages[0]}" alt="Featured" />
                        </div>
                    </div>
                `;
                        } else {
                                // Grid layout
                                container.innerHTML = allImages
                                        .slice(0, 6)
                                        .map((img) => `<img src="${img}" alt="Gallery image" />`)
                                        .join("");
                        }
                }
        }

        // Initialize tabs functionality
        function initTabs() {
                const tabButtons = document.querySelectorAll(".tour-details-tabs__item");
                const tabContents = document.querySelectorAll(".tour-details-tab-content");

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
        }

        // Initialize booking form
        function initBookingForm() {
                const bookingForm = document.querySelector(".booking-form");
                if (!bookingForm) return;

                const inputs = bookingForm.querySelectorAll("input, textarea");

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

                function validateField(input) {
                        const value = input.value.trim();
                        const placeholder = input.getAttribute("placeholder") || "";

                        clearError(input);

                        if (input.type === "text" && placeholder.includes("Họ và tên")) {
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
                                        return showError(
                                                input,
                                                "Số điện thoại không hợp lệ (0xxxxxxxxx hoặc +84xxxxxxxxx)."
                                        );
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
                                if (num > tourData.max_people)
                                        return showError(input, `Tối đa ${tourData.max_people} người.`);
                        }

                        if (input.tagName === "TEXTAREA") {
                                if (value.length < 5) return showError(input, "Tin nhắn quá ngắn (ít nhất 5 ký tự).");
                        }
                }

                inputs.forEach((input) => {
                        input.addEventListener("blur", () => validateField(input));
                        input.addEventListener("input", () => clearError(input));
                });

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
                        submitBtn.textContent = "Đang xử lý...";

                        setTimeout(() => {
                                submitBtn.disabled = false;
                                submitBtn.textContent = "Đặt ngay";
                                bookingForm.reset();
                                showSuccessModal();
                        }, 1500);
                });
        }

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

        // Start loading data
        loadTourData();

        console.log("initTourDetails completed");
})();
