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
    // LAZY LOADING CHO ẢNH - FIXED
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
            // Kiểm tra hỗ trợ IntersectionObserver
            if (!("IntersectionObserver" in window)) {
                console.warn("IntersectionObserver not supported, loading all media immediately");
                this.loadAllMedia();
                return;
            }

            // Observer cho ảnh
            this.imageObserver = new IntersectionObserver((entries) => this.handleImageIntersection(entries), {
                rootMargin: "100px",
                threshold: 0.01,
            });

            this.setupLazyImages();
        }

        // ============================================
        // LAZY LOADING CHO ẢNH - FIXED
        // ============================================
        setupLazyImages() {
            const lazyImages = document.querySelectorAll("img.lazy-image");

            lazyImages.forEach((img) => {
                // ✅ FIX: Nếu ảnh đã có src (từ cache/previous load)
                if (img.src && !img.dataset.src) {
                    if (!img.classList.contains("loaded")) {
                        // Kiểm tra ảnh đã load xong chưa
                        if (img.complete && img.naturalHeight !== 0) {
                            img.classList.add("loaded");
                            console.log("✅ Fixed cached image:", img.src);
                        } else {
                            // Đợi ảnh load xong
                            img.addEventListener(
                                "load",
                                () => {
                                    img.classList.add("loaded");
                                    console.log("✅ Fixed loading image:", img.src);
                                },
                                { once: true }
                            );
                        }
                    }
                    return; // ✅ Không observe ảnh đã có src
                }

                // Nếu có data-src → observe để lazy load
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

            // ✅ FIX: Nếu ảnh đã có src nhưng chưa có class loaded
            if (!src && img.src) {
                if (img.complete && img.naturalHeight !== 0) {
                    img.classList.add("loaded");
                } else {
                    img.addEventListener(
                        "load",
                        () => {
                            img.classList.add("loaded");
                        },
                        { once: true }
                    );
                }
                return;
            }

            if (!src) return;

            // Load ảnh
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

        // Fallback cho trình duyệt cũ
        loadAllMedia() {
            document.querySelectorAll("img.lazy-image[data-src]").forEach((img) => {
                img.src = img.dataset.src;
                img.classList.add("loaded");
                img.removeAttribute("data-src");
            });

            // ✅ FIX: Thêm class loaded cho ảnh đã có src
            document.querySelectorAll("img.lazy-image:not([data-src])").forEach((img) => {
                if (img.src && !img.classList.contains("loaded")) {
                    if (img.complete && img.naturalHeight !== 0) {
                        img.classList.add("loaded");
                    } else {
                        img.addEventListener(
                            "load",
                            () => {
                                img.classList.add("loaded");
                            },
                            { once: true }
                        );
                    }
                }
            });
        }
    }

    // Khởi tạo lazy loader
    const mediaLoader = new MediaLazyLoader();

    // ============================================
    // LAZY LOADING CHO SECTIONS
    // ============================================
    function lazyLoadSections() {
        const lazyElements = document.querySelectorAll(".lazy-load");

        if ("IntersectionObserver" in window) {
            const observerOptions = {
                root: null,
                rootMargin: "0px",
                threshold: 0.1,
            };

            const observerCallback = (entries, observer) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                        observer.unobserve(entry.target);
                    }
                });
            };

            const observer = new IntersectionObserver(observerCallback, observerOptions);
            lazyElements.forEach((el) => observer.observe(el));
        } else {
            lazyElements.forEach((el) => el.classList.add("visible"));
        }
    }

    // Khởi tạo lazy loading cho sections
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", lazyLoadSections);
    } else {
        lazyLoadSections();
    }

    // ============================================
    // LOAD TOURS FROM JSON - UPDATED FOR I18N
    // ============================================
    async function loadTours() {
        try {
            // Sử dụng DataLoader để load tours theo ngôn ngữ hiện tại
            const data = await window.dataLoader.loadTours();
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

        // Lấy ngôn ngữ hiện tại để format đúng
        const currentLang = window.i18n ? window.i18n.getCurrentLanguage() : "vi";
        const isVietnamese = currentLang === "vi";

        // Get translated texts
        const bookNowText = window.i18n ? window.i18n.t("common.bookNow") : "Đặt ngay";
        const dayText = window.i18n ? window.i18n.t("common.day") : "ngày";
        const tourText = window.i18n ? window.i18n.t("home.tourTypes.tours").toLowerCase() : "tour";

        topTours.forEach((tour) => {
            const discountedPrice = tour.price * (1 - tour.discount_percent / 100);

            // Format giá theo ngôn ngữ
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

        // Setup lazy loading cho ảnh mới thêm vào
        setupDynamicLazyImages();
    }

    function truncateText(text, maxLength = 150) {
        if (text.length <= maxLength) return text;
        return text.slice(0, maxLength) + "...";
    }

    function loadDestinations() {
        fetch("/data.json")
            .then(res => res.json())
            .then(json => {
                const grid = document.querySelector(".home-destinations__grid");
                if (!grid) return;

                grid.innerHTML = ""
                const indices = [0, 2, 7, 4, 6, 5];
                const destinations = json.data.filter((_, i) => indices.includes(i));

                destinations.forEach((item, index) => {
                    const country = item.country;
                    const rating = item.rating;
                    const firstPlace = item.places[0];
                    const image = firstPlace.famous_locations[0].image_url;
                    const type = firstPlace.city;

                    const extraClass = index === 1
                        ? "home-destination-card--tall"
                        : index === 2
                        ? "home-destination-card--wide"
                        : "";

                    const card = document.createElement("article");
                    card.className = `home-destination-card ${extraClass}`;
                    card.innerHTML = `
                        <a href="#destination-detail?id=${item.id}">
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

                    const vn = json.data.find(item => item.id === "vn001");
                    const places = vn.places;

                    // Lấy 4 city đầu tiên
                    const mainCity = places[0];
                    const otherCities = places.slice(1, 4);

                    const container = document.getElementById("articles-container");

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
                                const realIndex = idx + 2; // index thật trong places
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
                });

        // Setup lazy loading cho ảnh mới thêm vào
        setupDynamicLazyImages();
    }

    // Setup lazy loading cho ảnh được thêm động
    function setupDynamicLazyImages() {
        const lazyImages = document.querySelectorAll("#tours-container img.lazy-image[data-src]");
        const lazyimage = document.querySelectorAll("#destinationsGrid img.lazy-image[data-src]");
        const lazyimg = document.querySelectorAll("#articles-container img.lazy-image[data-src]")
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
            {
                rootMargin: "100px",
                threshold: 0.01,
            }
        );

        lazyImages.forEach((img) => imageObserver.observe(img));
    }

    // Load tours khi DOM ready
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
    // TOAST NOTIFICATION - THÊM MỚI
    // ============================================
    function showToast(message, type = "success") {
        // Xóa toast cũ nếu có
        const existingToast = document.querySelector(".newsletter-toast");
        if (existingToast) {
            existingToast.remove();
        }

        // Tạo toast mới
        const toast = document.createElement("div");
        toast.className = `newsletter-toast newsletter-toast--${type}`;
        toast.innerHTML = `
        <div class="newsletter-toast__icon">${type === "success" ? "✓" : type === "error" ? "✕" : "⚠"}</div>
        <div class="newsletter-toast__message">${message}</div>
    `;

        document.body.appendChild(toast);

        // Trigger animation
        setTimeout(() => toast.classList.add("newsletter-toast--show"), 10);

        // Auto remove sau 4s
        setTimeout(() => {
            toast.classList.remove("newsletter-toast--show");
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    }

    // ============================================
    // NEWSLETTER FORM - CẬP NHẬT
    // ============================================
    function initNewsletterForm() {
        const form = document.querySelector(".home-newsletter__form");

        if (!form) return;

        form.addEventListener("submit", (e) => {
            e.preventDefault();

            const input = form.querySelector(".home-newsletter__input");
            const email = input.value.trim();

            if (!email) {
                showToast("Vui lòng nhập email!", "error");
                input.focus();
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showToast("Email không hợp lệ!", "error");
                input.focus();
                return;
            }

            const submitBtn = form.querySelector(".home-newsletter__submit");

            // Show loading spinner - Giữ nguyên structure
            const icon = submitBtn.querySelector(".home-newsletter__submit-icon");
            const originalIcon = "✈";

            if (icon) {
                icon.innerHTML = '<span class="spinner"></span>';
            } else {
                submitBtn.innerHTML = '<span class="spinner"></span>';
            }

            submitBtn.disabled = true;
            input.disabled = true;

            // Giả lập API call
            setTimeout(() => {
                showToast("🎉 Đăng ký thành công! Cảm ơn bạn đã đăng ký nhận bản tin.", "success");
                input.value = "";

                // Restore original button content
                if (icon) {
                    icon.textContent = originalIcon;
                } else {
                    submitBtn.innerHTML = `<span class="home-newsletter__submit-icon">${originalIcon}</span>`;
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
                    target.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                    });
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
    // PERFORMANCE: PRELOAD CRITICAL IMAGES
    // ============================================
    function preloadCriticalImages() {
        const heroImg = document.querySelector(".home-hero__image[data-src]");
        if (heroImg && heroImg.dataset.src) {
            const link = document.createElement("link");
            link.rel = "preload";
            link.as = "image";
            link.href = heroImg.dataset.src;
            document.head.appendChild(link);
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", preloadCriticalImages);
    } else {
        preloadCriticalImages();
    }

    // ============================================
    // FIX: XỬ LÝ ẢNH KHI QUAY LẠI TRANG
    // ============================================
    function fixCachedImages() {
        console.log("🔄 Fixing cached images...");
        const lazyImages = document.querySelectorAll("img.lazy-image:not(.loaded)");

        lazyImages.forEach((img) => {
            // TH1: Ảnh đã có src và đã load xong
            if (img.complete && img.naturalHeight !== 0 && img.src) {
                img.classList.add("loaded");
                console.log("✅ Fixed:", img.alt || img.src);
            }
            // TH2: Ảnh có src nhưng chưa load xong
            else if (img.src && img.src !== window.location.href) {
                img.addEventListener(
                    "load",
                    () => {
                        img.classList.add("loaded");
                        console.log("✅ Loaded:", img.alt || img.src);
                    },
                    { once: true }
                );
            }
            // TH3: Ảnh chỉ có data-src
            else if (img.dataset.src) {
                const src = img.dataset.src;
                img.src = src;
                img.addEventListener(
                    "load",
                    () => {
                        img.classList.add("loaded");
                        img.removeAttribute("data-src");
                        console.log("✅ Loaded from data-src:", img.alt || src);
                    },
                    { once: true }
                );
            }
        });
    }

    // Chạy fix khi trang load xong
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => {
            setTimeout(fixCachedImages, 100);
        });
    } else {
        setTimeout(fixCachedImages, 100);
    }

    // ✅ FIX: Chạy lại khi user quay lại trang (bfcache)
    window.addEventListener("pageshow", (event) => {
        if (event.persisted || (performance && performance.navigation && performance.navigation.type === 2)) {
            console.log("🔄 Page restored from cache, fixing images...");
            setTimeout(fixCachedImages, 100);
        }
    });

    // ============================================
    // ERROR HANDLING
    // ============================================
    window.addEventListener(
        "error",
        (e) => {
            if (e.target.tagName === "IMG") {
                console.error("Image failed to load:", e.target.src || e.target.dataset.src);
            }
        },
        true
    );

    // ============================================
    // DỊCH TRANG SAU KHI LOAD XONG
    // ============================================
    if (window.i18n) {
        window.i18n.translatePage();
    }

    // ============================================
    // SUBSCRIBE TO LANGUAGE CHANGES - RELOAD DATA
    // ============================================
    if (window.i18n && !window.homeLanguageHandlerRegistered) {
        window.homeLanguageHandlerRegistered = true;

        let isReloading = false;

        window.i18n.subscribe(async (newLang) => {
            if (!window.homePageInitialized) {
                return;
            }

            if (isReloading) {
                console.log("⏳ Already reloading, skipping...");
                return;
            }

            isReloading = true;
            console.log("🌍 Language changed to:", newLang);

            try {
                await Promise.all([loadTours(), loadDestinations()]);
                window.i18n.translatePage();
            } catch (error) {
                console.error("Error reloading data:", error);
            } finally {
                setTimeout(() => {
                    isReloading = false;
                }, 500);
            }
        });
    }

    console.log("✅ Home page scripts loaded successfully!");
})();
