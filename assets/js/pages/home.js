(function () {
    "use strict";

    // ============================================
    // PREVENT MULTIPLE EXECUTIONS
    // ============================================
    if (window.homePageInitialized) {
        console.warn("⚠️ Home page already initialized, skipping...");
        return;
    }
    window.homePageInitialized = true;

    // ============================================
    // LAZY LOADING FOR IMAGES
    // ============================================
    class MediaLazyLoader {
        constructor() {
            this.imageObserver = null;
            this.init();
        }

        init() {
            if (document.readyState === "loading") {
                document.addEventListener("DOMContentLoaded", () => this.setupObservers());
            } else {
                this.setupObservers();
            }
        }

        setupObservers() {
            if (!("IntersectionObserver" in window)) {
                this.loadAllMedia();
                return;
            }

            this.imageObserver = new IntersectionObserver((entries) => this.handleImageIntersection(entries), {
                rootMargin: "100px",
                threshold: 0.01,
            });

            this.setupLazyImages();
        }

        setupLazyImages() {
            const lazyImages = document.querySelectorAll("img.lazy-image");

            lazyImages.forEach((img) => {
                if (img.src && !img.dataset.src) {
                    if (!img.classList.contains("loaded")) {
                        if (img.complete && img.naturalHeight !== 0) {
                            img.classList.add("loaded");
                        } else {
                            img.addEventListener("load", () => img.classList.add("loaded"), { once: true });
                        }
                    }
                    return;
                }

                if (img.dataset.src) {
                    this.imageObserver.observe(img);
                }
            });
        }

        handleImageIntersection(entries) {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    this.loadImage(img);
                    this.imageObserver.unobserve(img);
                }
            });
        }

        loadImage(img) {
            const src = img.dataset.src;

            if (!src && img.src) {
                if (img.complete && img.naturalHeight !== 0) {
                    img.classList.add("loaded");
                } else {
                    img.addEventListener("load", () => img.classList.add("loaded"), { once: true });
                }
                return;
            }

            if (!src) return;

            const tempImg = new Image();
            tempImg.onload = () => {
                img.src = src;
                img.classList.add("loaded");
                img.removeAttribute("data-src");
            };
            tempImg.onerror = () => {
                console.error("Failed to load image:", src);
                img.classList.add("error");
                img.alt = "Không thể tải ảnh";
            };
            tempImg.src = src;
        }

        loadAllMedia() {
            document.querySelectorAll("img.lazy-image[data-src]").forEach((img) => {
                img.src = img.dataset.src;
                img.classList.add("loaded");
                img.removeAttribute("data-src");
            });

            document.querySelectorAll("img.lazy-image:not([data-src])").forEach((img) => {
                if (img.src && !img.classList.contains("loaded")) {
                    if (img.complete && img.naturalHeight !== 0) {
                        img.classList.add("loaded");
                    } else {
                        img.addEventListener("load", () => img.classList.add("loaded"), { once: true });
                    }
                }
            });
        }
    }

    const mediaLoader = new MediaLazyLoader();

    // ============================================
    // LAZY LOADING FOR SECTIONS
    // ============================================
    function lazyLoadSections() {
        const lazyElements = document.querySelectorAll(".lazy-load");

        if ("IntersectionObserver" in window) {
            const observer = new IntersectionObserver(
                (entries, observer) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add("visible");
                            observer.unobserve(entry.target);
                        }
                    });
                },
                { root: null, rootMargin: "0px", threshold: 0.1 }
            );
            lazyElements.forEach((el) => observer.observe(el));
        } else {
            lazyElements.forEach((el) => el.classList.add("visible"));
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", lazyLoadSections);
    } else {
        lazyLoadSections();
    }

    // ============================================
    // LOAD TOURS FROM JSON
    // ============================================
    async function loadTours() {
        try {
            const hasI18n = window.dataLoader && window.i18n;
            let data;

            if (hasI18n) {
                data = await window.dataLoader.loadTours();
            } else {
                const response = await fetch("../tours.json");
                data = await response.json();
            }

            renderTours(data.tours);
        } catch (error) {
            console.error("Lỗi tải dữ liệu tours:", error);
        }
    }

    function renderTours(tours) {
        const container = document.getElementById("tours-container");
        if (!container) return;

        container.innerHTML = "";
        const topTours = tours.slice(0, 4);

        const hasI18n = window.i18n;
        const currentLang = hasI18n ? window.i18n.getCurrentLanguage() : "vi";
        const isVietnamese = currentLang === "vi";

        const bookNowText = hasI18n ? window.i18n.t("common.bookNow") : "Đặt ngay";
        const dayText = hasI18n ? window.i18n.t("common.day") : "ngày";
        const tourText = hasI18n ? window.i18n.t("home.tourTypes.tours").toLowerCase() : "tour";

        topTours.forEach((tour) => {
            const discountedPrice = tour.price * (1 - tour.discount_percent / 100);
            const formattedPrice = isVietnamese
                ? `${discountedPrice.toLocaleString("vi-VN")}đ`
                : `$${Math.round(discountedPrice / 25000).toLocaleString("en-US")}`;

            const card = `
                <article class="home-tour-card">
                    <a href="#tour-details?id=${tour.id}" class="home-tour-card__media">
                        <img 
                            data-src="${tour.main_image}" 
                            alt="${tour.title}" 
                            class="home-tour-card__img lazy-image"
                        />
                    </a>
                    <div class="home-tour-card__body">
                        <div class="home-tour-card__price">
                            <span>${formattedPrice}</span> / ${tourText}
                        </div>
                        <h3 class="home-tour-card__title">
                            <a href="#tour-details?id=${tour.id}">${tour.title}</a>
                        </h3>
                        <ul class="home-tour-card__meta">
                            <li class="home-tour-card__meta-item">⭐ ${tour.rating} / 5</li>
                            <li class="home-tour-card__meta-item">⏱ ${tour.duration_days} ${dayText}</li>
                        </ul>
                        <a href="#tour-details?id=${tour.id}" class="home-tour-card__btn">${bookNowText}</a>
                    </div>
                </article>
            `;

            container.insertAdjacentHTML("beforeend", card);
        });

        setupDynamicLazyImages();
    }

    // ============================================
    // LOAD DESTINATIONS + ARTICLES
    // ============================================
    function truncateText(text, maxLength = 150) {
        if (text.length <= maxLength) return text;
        return text.slice(0, maxLength) + "...";
    }

    async function loadDestinations() {
        try {
            const hasI18n = window.dataLoader && window.i18n;
            let json;

            if (hasI18n) {
                json = await window.dataLoader.loadDestinations();
            } else {
                const response = await fetch("/data.json");
                json = await response.json();
            }

            renderDestinations(json.data);
            renderArticles(json.data);
        } catch (error) {
            console.error("Lỗi khi load dữ liệu destinations:", error);
        }
    }

    function renderDestinations(data) {
        const grid = document.querySelector(".home-destinations__grid");
        if (!grid) return;

        grid.innerHTML = "";
        const indices = [0, 2, 7, 4, 6, 5];
        const destinations = data.filter((_, i) => indices.includes(i));

        destinations.forEach((item, index) => {
            const country = item.country;
            const rating = item.rating;
            const firstPlace = item.places[0];
            const image = firstPlace.famous_locations[0].image_url;
            const type = firstPlace.city;

            const extraClass =
                index === 1 ? "home-destination-card--tall" : index === 2 ? "home-destination-card--wide" : "";

            const card = document.createElement("article");
            card.className = `home-destination-card ${extraClass}`;
            card.innerHTML = `
            <a href="#destination-detail?id=${item.id}" class="home-destination-card__link">
                <div class="home-destination-card__rating">${rating.toFixed(1)}</div>
                <img
                    data-src="${image}"
                    alt="${type} ${country}"
                    class="home-destination-card__img lazy-image"
                />
                <div class="home-destination-card__info">
                    <h3 class="home-destination-card__name">${country}</h3>
                    <span class="home-destination-card__type">${type}</span>
                </div>
            </a>
        `;

            grid.appendChild(card);
        });

        setupDynamicLazyImages();
    }

    function renderArticles(data) {
        const container = document.getElementById("articles-container");
        if (!container) return;

        const vn = data.find((item) => item.id === "vn001");
        if (!vn || !vn.places) return;

        const places = vn.places;
        const mainCity = places[0];
        const otherCities = places.slice(1, 4);

        container.innerHTML = `
            <a href="#blog-detail?id=1" class="home-articles__main">
                <img
                    data-src="${mainCity.famous_locations[0].image_url}"
                    alt="${mainCity.city}"
                    class="home-articles__main-img lazy-image"
                />
                <div class="home-articles__main-text">
                    <div class="home-articles__main-info">
                        <h3 class="home-articles__main-title">${mainCity.shortdesc}</h3>
                        <p class="home-articles__main-desc">
                            ${truncateText(mainCity.blog, 80)}
                        </p>
                    </div>
                </div>
            </a>

            <div class="home-articles__list">
                ${otherCities
                    .map((city, idx) => {
                        const realIndex = idx + 2;
                        return `
                        <a href="#blog-detail?id=${realIndex}" class="home-articles__item">
                            <img
                                data-src="${city.famous_locations[0].image_url}"
                                alt="${city.city}"
                                class="home-articles__item-img lazy-image"
                            />
                            <div class="home-articles__item-content">
                                <h4 class="home-articles__item-title">${city.shortdesc}</h4>
                                <p class="home-articles__item-desc">${truncateText(city.blog, 50)}</p>
                            </div>
                        </a>
                    `;
                    })
                    .join("")}
            </div>
        `;

        setupDynamicLazyImages();
    }

    function setupDynamicLazyImages() {
        const lazyImages = document.querySelectorAll(
            "#tours-container img.lazy-image[data-src], .home-destinations__grid img.lazy-image[data-src], #articles-container img.lazy-image[data-src]"
        );

        if (!("IntersectionObserver" in window)) {
            lazyImages.forEach((img) => {
                img.src = img.dataset.src;
                img.classList.add("loaded");
            });
            return;
        }

        const imageObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        const src = img.dataset.src;

                        const tempImg = new Image();
                        tempImg.onload = () => {
                            img.src = src;
                            img.classList.add("loaded");
                            img.removeAttribute("data-src");
                        };
                        tempImg.onerror = () => {
                            console.error("Failed to load image:", src);
                            img.classList.add("error");
                        };
                        tempImg.src = src;

                        imageObserver.unobserve(img);
                    }
                });
            },
            { rootMargin: "100px", threshold: 0.01 }
        );

        lazyImages.forEach((img) => imageObserver.observe(img));
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => {
            loadTours();
            loadDestinations();
        });
    } else {
        loadTours();
        loadDestinations();
    }

    // ============================================
    // TOAST NOTIFICATION
    // ============================================
    function showToast(message, type = "success") {
        const existingToast = document.querySelector(".newsletter-toast");
        if (existingToast) {
            existingToast.remove();
        }

        const toast = document.createElement("div");
        toast.className = `newsletter-toast newsletter-toast--${type}`;
        toast.innerHTML = `
        <div class="newsletter-toast__icon">${type === "success" ? "✓" : type === "error" ? "✕" : "⚠"}</div>
        <div class="newsletter-toast__message">${message}</div>
    `;

        document.body.appendChild(toast);
        setTimeout(() => toast.classList.add("newsletter-toast--show"), 10);

        setTimeout(() => {
            toast.classList.remove("newsletter-toast--show");
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    }

    // ============================================
    // NEWSLETTER FORM - CUSTOM VALIDATION
    // ============================================
    function initNewsletterForm() {
        const form = document.querySelector(".home-newsletter__form");
        if (!form) return;

        const input = form.querySelector(".home-newsletter__input");
        const submitBtn = form.querySelector(".home-newsletter__submit");

        // Tắt validation mặc định của HTML5
        form.setAttribute("novalidate", "");

        // Xóa thông báo lỗi khi người dùng bắt đầu nhập
        input.addEventListener("input", () => {
            input.classList.remove("error");
        });

        form.addEventListener("submit", (e) => {
            e.preventDefault();

            const email = input.value.trim();

            // Validate empty
            if (!email) {
                input.classList.add("error");
                showToast("Vui lòng nhập email!", "error");
                input.focus();
                return;
            }

            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                input.classList.add("error");
                showToast("Email không hợp lệ!", "error");
                input.focus();
                return;
            }

            // Success - Show loading
            const icon = submitBtn.querySelector(".home-newsletter__submit-icon");
            const originalIcon = icon ? icon.textContent : "✈";

            if (icon) {
                icon.innerHTML = '<span class="spinner"></span>';
            }

            submitBtn.disabled = true;
            input.disabled = true;

            // Simulate API call
            setTimeout(() => {
                showToast("🎉 Đăng ký thành công! Cảm ơn bạn đã đăng ký nhận bản tin.", "success");
                input.value = "";
                input.classList.remove("error");

                if (icon) {
                    icon.textContent = originalIcon;
                }

                submitBtn.disabled = false;
                input.disabled = false;
            }, 1200);
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initNewsletterForm);
    } else {
        initNewsletterForm();
    }

    // ============================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ============================================
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
            anchor.addEventListener("click", function (e) {
                const href = this.getAttribute("href");
                if (href === "#" || href === "#!") return;

                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: "smooth", block: "start" });
                }
            });
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initSmoothScroll);
    } else {
        initSmoothScroll();
    }

    // ============================================
    // FIX CACHED IMAGES
    // ============================================
    function fixCachedImages() {
        const lazyImages = document.querySelectorAll("img.lazy-image:not(.loaded)");

        lazyImages.forEach((img) => {
            if (img.complete && img.naturalHeight !== 0 && img.src) {
                img.classList.add("loaded");
            } else if (img.src && img.src !== window.location.href) {
                img.addEventListener("load", () => img.classList.add("loaded"), { once: true });
            } else if (img.dataset.src) {
                const src = img.dataset.src;
                img.src = src;
                img.addEventListener(
                    "load",
                    () => {
                        img.classList.add("loaded");
                        img.removeAttribute("data-src");
                    },
                    { once: true }
                );
            }
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => setTimeout(fixCachedImages, 100));
    } else {
        setTimeout(fixCachedImages, 100);
    }

    window.addEventListener("pageshow", (event) => {
        if (event.persisted || (performance && performance.navigation && performance.navigation.type === 2)) {
            setTimeout(fixCachedImages, 100);
        }
    });

    // ============================================
    // I18N SUPPORT
    // ============================================
    if (window.i18n) {
        window.i18n.translatePage();
    }

    if (window.i18n && !window.homeLanguageHandlerRegistered) {
        window.homeLanguageHandlerRegistered = true;
        let isReloading = false;

        window.i18n.subscribe(async (newLang) => {
            if (!window.homePageInitialized || isReloading) return;

            isReloading = true;
            try {
                await Promise.all([loadTours(), loadDestinations()]);
                window.i18n.translatePage();
            } catch (error) {
                console.error("Error reloading data:", error);
            } finally {
                setTimeout(() => (isReloading = false), 500);
            }
        });
    }

    console.log("✅ Home page scripts loaded successfully!");
})();
