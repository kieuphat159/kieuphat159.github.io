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
    // LAZY LOADING CHO ẢNH VÀ VIDEO - FIXED
    // ============================================

    class MediaLazyLoader {
        constructor() {
            this.imageObserver = null;
            this.videoObserver = null;
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
                console.warn("IntersectionObserver not supported, loading all media immediately");
                this.loadAllMedia();
                return;
            }

            this.imageObserver = new IntersectionObserver((entries) => this.handleImageIntersection(entries), {
                rootMargin: "100px",
                threshold: 0.01,
            });

            this.videoObserver = new IntersectionObserver((entries) => this.handleVideoIntersection(entries), {
                rootMargin: "200px",
                threshold: 0.01,
            });

            this.setupLazyImages();
            this.setupLazyVideos();
        }

        setupLazyImages() {
            const lazyImages = document.querySelectorAll("img.lazy-image");

            lazyImages.forEach((img) => {
                if (img.src && !img.dataset.src) {
                    if (!img.classList.contains("loaded")) {
                        if (img.complete && img.naturalHeight !== 0) {
                            img.classList.add("loaded");
                            console.log("✅ Fixed cached image:", img.src);
                        } else {
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

        setupLazyVideos() {
            const lazyVideos = document.querySelectorAll("video.lazy-video[data-src]");
            lazyVideos.forEach((video) => {
                this.videoObserver.observe(video);
            });
        }

        handleVideoIntersection(entries) {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const video = entry.target;
                    this.loadVideo(video);
                    this.videoObserver.unobserve(video);
                }
            });
        }

        loadVideo(video) {
            const src = video.dataset.src;
            if (!src) return;

            const source = document.createElement("source");
            source.src = src;
            source.type = "video/mp4";

            source.onerror = () => {
                console.error("Failed to load video:", src);
            };

            video.appendChild(source);
            video.removeAttribute("data-src");
            video.load();

            video.addEventListener(
                "loadeddata",
                () => {
                    video.classList.add("loaded");
                },
                { once: true }
            );
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

            document.querySelectorAll("video.lazy-video[data-src]").forEach((video) => {
                const source = document.createElement("source");
                source.src = video.dataset.src;
                source.type = "video/mp4";
                video.appendChild(source);
                video.removeAttribute("data-src");
                video.load();
                video.classList.add("loaded");
            });
        }
    }

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
    // LOAD DESTINATIONS - UPDATED FOR I18N + ARTICLES
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
            {
                rootMargin: "100px",
                threshold: 0.01,
            }
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
    // VLOG SLIDER
    // ============================================
    function initVlogSlider() {
        const track = document.querySelector(".vlog-track");
        const prevBtn = document.querySelector(".vlog-slider .prev");
        const nextBtn = document.querySelector(".vlog-slider .next");

        if (!track || !prevBtn || !nextBtn) return;

        let currentPosition = 0;
        let isTransitioning = false;

        function updateVlogSlider() {
            const items = track.querySelectorAll(".vlog-item");
            if (items.length === 0) return;

            const item = items[0];
            const itemStyle = window.getComputedStyle(item);
            const gap = parseInt(itemStyle.marginRight) || 24;
            const itemWidth = item.offsetWidth + gap;

            const windowWidth = document.querySelector(".vlog-window").offsetWidth;
            const visibleCount = Math.floor(windowWidth / itemWidth);
            const totalItems = items.length;
            const maxScroll = (totalItems - visibleCount) * itemWidth;

            function updateButtonStates() {
                prevBtn.disabled = currentPosition >= 0;
                nextBtn.disabled = currentPosition <= -maxScroll;
            }

            nextBtn.onclick = () => {
                if (isTransitioning || currentPosition <= -maxScroll) return;
                isTransitioning = true;
                currentPosition -= itemWidth;
                track.style.transform = `translateX(${currentPosition}px)`;
                setTimeout(() => {
                    isTransitioning = false;
                    updateButtonStates();
                }, 500);
            };

            prevBtn.onclick = () => {
                if (isTransitioning || currentPosition >= 0) return;
                isTransitioning = true;
                currentPosition += itemWidth;
                track.style.transform = `translateX(${currentPosition}px)`;
                setTimeout(() => {
                    isTransitioning = false;
                    updateButtonStates();
                }, 500);
            };

            updateButtonStates();
        }

        updateVlogSlider();

        let resizeTimer;
        window.addEventListener("resize", () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                currentPosition = 0;
                track.style.transform = `translateX(0)`;
                updateVlogSlider();
            }, 250);
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initVlogSlider);
    } else {
        initVlogSlider();
    }

    // ============================================
    // AUTO PLAY VIDEO KHI TRONG VIEWPORT
    // ============================================
    function initVideoAutoPlay() {
        const videos = document.querySelectorAll("video[loop]");

        if (!("IntersectionObserver" in window)) return;

        const videoObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const video = entry.target;
                    if (entry.isIntersecting) {
                        video.play().catch((e) => console.log("Video autoplay prevented:", e));
                    } else {
                        video.pause();
                    }
                });
            },
            {
                threshold: 0.5,
            }
        );

        videos.forEach((video) => {
            videoObserver.observe(video);

            video.addEventListener("loadeddata", () => {
                const rect = video.getBoundingClientRect();
                const isInViewport =
                    rect.top < window.innerHeight && rect.bottom > 0 && rect.left < window.innerWidth && rect.right > 0;

                if (isInViewport) {
                    video.play().catch((e) => console.log("Video autoplay prevented:", e));
                }
            });
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initVideoAutoPlay);
    } else {
        initVideoAutoPlay();
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
    // NEWSLETTER FORM
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

            const icon = submitBtn.querySelector(".home-newsletter__submit-icon");
            const originalIcon = icon ? icon.textContent : "✈";

            if (icon) {
                icon.innerHTML = '<span class="spinner"></span>';
            } else {
                submitBtn.innerHTML = '<span class="spinner"></span>';
            }

            submitBtn.disabled = true;
            input.disabled = true;

            setTimeout(() => {
                showToast("🎉 Đăng ký thành công! Cảm ơn bạn đã đăng ký nhận bản tin.", "success");
                input.value = "";

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
            if (img.complete && img.naturalHeight !== 0 && img.src) {
                img.classList.add("loaded");
                console.log("✅ Fixed:", img.alt || img.src);
            } else if (img.src && img.src !== window.location.href) {
                img.addEventListener(
                    "load",
                    () => {
                        img.classList.add("loaded");
                        console.log("✅ Loaded:", img.alt || img.src);
                    },
                    { once: true }
                );
            } else if (img.dataset.src) {
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

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => {
            setTimeout(fixCachedImages, 100);
        });
    } else {
        setTimeout(fixCachedImages, 100);
    }

    window.addEventListener("pageshow", (event) => {
        if (event.persisted || (performance && performance.navigation && performance.navigation.type === 2)) {
            console.log("🔄 Page restored from cache, fixing images...");
            setTimeout(fixCachedImages, 100);
        }
    });

    // ============================================
    // PAGE VISIBILITY API - PAUSE VIDEOS WHEN TAB HIDDEN
    // ============================================
    document.addEventListener("visibilitychange", () => {
        const videos = document.querySelectorAll("video");

        if (document.hidden) {
            videos.forEach((video) => {
                if (!video.paused) {
                    video.dataset.wasPlaying = "true";
                    video.pause();
                }
            });
        } else {
            videos.forEach((video) => {
                if (video.dataset.wasPlaying === "true") {
                    video.play().catch((e) => console.log("Video play failed:", e));
                    delete video.dataset.wasPlaying;
                }
            });
        }
    });

    // ============================================
    // ERROR HANDLING
    // ============================================
    window.addEventListener(
        "error",
        (e) => {
            if (e.target.tagName === "IMG" || e.target.tagName === "VIDEO") {
                console.error("Media failed to load:", e.target.src || e.target.dataset.src);
            }
        },
        true
    );

    // ============================================
    // DỊCH TRANG SAU KHI LOAD XONG (I18N)
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
