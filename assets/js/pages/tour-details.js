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
        let currentLang = localStorage.getItem("language") || "vi";

        // Load tour and destination data
        async function loadTourData(lang = null) {
                const language = lang || currentLang;
                try {
                        // Load tours data based on language
                        const toursResponse = await fetch(`./tours-${language}.json`);
                        const toursJson = await toursResponse.json();
                        toursData = toursJson.tours;

                        // Load destinations data based on language
                        const dataResponse = await fetch(`./data-${language}.json`);
                        const dataJson = await dataResponse.json();

                        // Create destination map
                        destinationsMap = {};
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

        // Listen for language changes
        window.addEventListener("languageChanged", (event) => {
                currentLang = event.detail.language;
                loadTourData(currentLang);
        });

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
                const priceContainer = document.querySelector(".tour-details-info__price");
                if (priceContainer) {
                        const hasDiscount = tourData.discount_percent && tourData.discount_percent > 0;

                        // Convert price based on language: VND for vi, USD for en
                        const isVietnamese = currentLang === "vi";
                        const displayPrice = isVietnamese ? tourData.price : Math.round(tourData.price / 25000); // Convert VND to USD

                        const discountedPrice = hasDiscount
                                ? Math.round(displayPrice * (1 - tourData.discount_percent / 100))
                                : displayPrice;

                        // Format price based on language
                        const formatPrice = (price) => {
                                if (isVietnamese) {
                                        return `${price.toLocaleString("vi-VN")}đ`;
                                } else {
                                        return `$${price.toLocaleString("en-US")}`;
                                }
                        };

                        const discountText = isVietnamese ? "Giảm" : "Discount";

                        if (hasDiscount) {
                                priceContainer.innerHTML = `
                                        <div style="display: flex; flex-direction: column; gap: 4px;">
                                                <span class="price-original" style="font-size: 1rem; color: var(--color-text-secondary); text-decoration: line-through;">${formatPrice(
                                                        displayPrice
                                                )}</span>
                                                <span class="price-amount" style="font-size: 1.5rem; font-weight: 700; color: var(--color-primary);">${formatPrice(
                                                        discountedPrice
                                                )}</span>
                                        </div>
                                        <span class="price-discount-badge" style="background-color: #e74c3c; color: #fff; padding: 4px 12px; border-radius: 6px; font-size: 0.875rem; font-weight: 700; margin-left: 10px;">${discountText} ${
                                        tourData.discount_percent
                                }%</span>
                                `;
                        } else {
                                const priceAmount = priceContainer.querySelector(".price-amount");
                                if (priceAmount) {
                                        priceAmount.textContent = formatPrice(displayPrice);
                                }
                        }
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

                        const airportText = window.i18n
                                ? window.i18n.t("tourDetails.details.airportMeeting")
                                : "Tập trung tại sân bay";
                        listItems[1].querySelector(".value").textContent = airportText;

                        const departureTimeText = window.i18n
                                ? window.i18n.t("tourDetails.details.departureTimeValue")
                                : "Khoảng 08:10 AM";
                        listItems[2].querySelector(".value").textContent = departureTimeText;
                }

                if (listItems.length >= 5) {
                        const returnTimeText = window.i18n
                                ? window.i18n.t("tourDetails.details.returnTimeValue")
                                : "Khoảng 07:20 PM";
                        listItems[3].querySelector(".value").textContent = returnTimeText;

                        const dressCodeText = window.i18n
                                ? window.i18n.t("tourDetails.details.casualComfortable")
                                : "Thoải mái, nhẹ nhàng";
                        listItems[4].querySelector(".value").textContent = dressCodeText;
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
                        const guideText = window.i18n ? window.i18n.t("tourDetails.features.guide") : "Hướng dẫn viên";
                        const insuranceText = window.i18n
                                ? window.i18n.t("tourDetails.features.insurance")
                                : "Bảo hiểm";

                        if (tourData.services.hotel)
                                includedHTML += `<div class="features-list__item"><i class="far fa-check-circle"></i><span>${tourData.services.hotel}</span></div>`;
                        if (tourData.services.meals)
                                includedHTML += `<div class="features-list__item"><i class="far fa-check-circle"></i><span>${tourData.services.meals}</span></div>`;
                        if (tourData.services.guide)
                                includedHTML += `<div class="features-list__item"><i class="far fa-check-circle"></i><span>${guideText}</span></div>`;
                        if (tourData.services.insurance)
                                includedHTML += `<div class="features-list__item"><i class="far fa-check-circle"></i><span>${insuranceText}</span></div>`;
                        includedList.innerHTML = includedHTML;
                }

                if (excludedList) {
                        const personalExpensesText = window.i18n
                                ? window.i18n.t("tourDetails.features.personalExpenses")
                                : "Chi phí cá nhân";
                        const drinksText = window.i18n ? window.i18n.t("tourDetails.features.drinks") : "Đồ uống";

                        excludedList.innerHTML = `
                <div class="features-list__item"><i class="far fa-times-circle"></i><span>${personalExpensesText}</span></div>
                <div class="features-list__item"><i class="far fa-times-circle"></i><span>${drinksText}</span></div>
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
                if (infoParagraphs.length >= 2 && destinationData) {
                        const country = destinationData.country;
                        if (currentLang === "en") {
                                infoParagraphs[0].textContent = `${country} is one of the most desirable tourist destinations with stunning scenery, rich culture and distinctive cuisine.`;
                                infoParagraphs[1].textContent = `Let us take you to explore famous places and experience unique culture in ${country}.`;
                        } else {
                                infoParagraphs[0].textContent = `${country} là một trong những điểm đến du lịch đáng mơ ước với cảnh quan tuyệt đẹp, văn hóa phong phú và ẩm thực đặc sắc.`;
                                infoParagraphs[1].textContent = `Hãy để chúng tôi đưa bạn đến khám phá những địa điểm nổi tiếng và trải nghiệm văn hóa độc đáo tại ${country}.`;
                        }
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

                        // Get error messages based on current language
                        const errorMessages =
                                currentLang === "en"
                                        ? {
                                                  nameRequired: "Please enter your name.",
                                                  emailRequired: "Please enter your email.",
                                                  emailInvalid: "Invalid email.",
                                                  phoneRequired: "Please enter your phone number.",
                                                  phoneInvalid: "Invalid phone number (0xxxxxxxxx or +84xxxxxxxxx).",
                                                  dateRequired: "Please select a date.",
                                                  dateInvalid: "Invalid date or date has passed.",
                                                  ticketsRequired: "Please enter number of tickets.",
                                                  ticketsInvalid: "Number of tickets must be a positive integer.",
                                                  ticketsMax: `Maximum ${tourData.max_people} people.`,
                                                  messageShort: "Message too short (at least 5 characters).",
                                          }
                                        : {
                                                  nameRequired: "Vui lòng nhập họ tên.",
                                                  emailRequired: "Vui lòng nhập email.",
                                                  emailInvalid: "Email không hợp lệ.",
                                                  phoneRequired: "Vui lòng nhập số điện thoại.",
                                                  phoneInvalid:
                                                          "Số điện thoại không hợp lệ (0xxxxxxxxx hoặc +84xxxxxxxxx).",
                                                  dateRequired: "Vui lòng chọn ngày.",
                                                  dateInvalid: "Ngày không hợp lệ hoặc đã qua.",
                                                  ticketsRequired: "Vui lòng nhập số vé.",
                                                  ticketsInvalid: "Số vé phải là số nguyên dương.",
                                                  ticketsMax: `Tối đa ${tourData.max_people} người.`,
                                                  messageShort: "Tin nhắn quá ngắn (ít nhất 5 ký tự).",
                                          };

                        if (
                                input.type === "text" &&
                                (placeholder.includes("Họ và tên") || placeholder.includes("Full Name"))
                        ) {
                                if (!value) return showError(input, errorMessages.nameRequired);
                        }

                        if (input.type === "email") {
                                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                                if (!value) return showError(input, errorMessages.emailRequired);
                                if (!emailPattern.test(value)) return showError(input, errorMessages.emailInvalid);
                        }

                        if (input.type === "tel") {
                                const phonePattern = /^(?:\+84|0)\d{9}$/;
                                if (!value) return showError(input, errorMessages.phoneRequired);
                                if (!phonePattern.test(value)) return showError(input, errorMessages.phoneInvalid);
                        }

                        if (input.type === "date") {
                                if (!value) return showError(input, errorMessages.dateRequired);
                                const selected = new Date(value);
                                const today = new Date();
                                today.setHours(0, 0, 0, 0);
                                if (selected < today) return showError(input, errorMessages.dateInvalid);
                        }

                        if (input.type === "number") {
                                const num = parseInt(value, 10);
                                if (!value) return showError(input, errorMessages.ticketsRequired);
                                if (isNaN(num) || num <= 0) return showError(input, errorMessages.ticketsInvalid);
                                if (num > tourData.max_people) return showError(input, errorMessages.ticketsMax);
                        }

                        if (input.tagName === "TEXTAREA") {
                                if (value.length < 5) return showError(input, errorMessages.messageShort);
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
                        const processingText = currentLang === "en" ? "Processing..." : "Đang xử lý...";
                        const submitText = currentLang === "en" ? "Book Now" : "Đặt ngay";

                        submitBtn.disabled = true;
                        submitBtn.textContent = processingText;

                        setTimeout(() => {
                                submitBtn.disabled = false;
                                submitBtn.textContent = submitText;
                                bookingForm.reset();
                                showSuccessModal();
                        }, 1500);
                });
        }

        function showSuccessModal() {
                let modal = document.querySelector(".booking-success-modal");

                const successTitle = currentLang === "en" ? "Booking Successful!" : "Đặt tour thành công!";
                const successMessage =
                        currentLang === "en"
                                ? "Thank you for your trust. We will contact you as soon as possible."
                                : "Cảm ơn bạn đã tin tưởng. Chúng tôi sẽ liên hệ sớm nhất có thể.";
                const closeText = currentLang === "en" ? "Close" : "Đóng";

                if (!modal) {
                        modal = document.createElement("div");
                        modal.className = "booking-success-modal";
                        modal.innerHTML = `
                <div class="booking-success-modal__content">
                    <h3>${successTitle}</h3>
                    <p>${successMessage}</p>
                    <button class="booking-success-modal__close">${closeText}</button>
                </div>
            `;
                        document.body.appendChild(modal);
                } else {
                        // Update modal content with current language
                        modal.querySelector("h3").textContent = successTitle;
                        modal.querySelector("p").textContent = successMessage;
                        modal.querySelector(".booking-success-modal__close").textContent = closeText;
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
