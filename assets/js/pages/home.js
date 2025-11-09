(function () {
    "use strict";

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

            // Observer cho video
            this.videoObserver = new IntersectionObserver((entries) => this.handleVideoIntersection(entries), {
                rootMargin: "200px",
                threshold: 0.01,
            });

            this.setupLazyImages();
            this.setupLazyVideos();
        }

        // ============================================
        // LAZY LOADING CHO ẢNH
        // ============================================
        setupLazyImages() {
            const lazyImages = document.querySelectorAll("img.lazy-image[data-src]");
            lazyImages.forEach((img) => {
                this.imageObserver.observe(img);
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

        // ============================================
        // LAZY LOADING CHO VIDEO
        // ============================================
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

            // Tạo source element
            const source = document.createElement("source");
            source.src = src;
            source.type = "video/mp4";

            source.onerror = () => {
                console.error("Failed to load video:", src);
            };

            // Append source vào video
            video.appendChild(source);
            video.removeAttribute("data-src");

            // Load video
            video.load();

            // Đợi video có thể play
            video.addEventListener(
                "loadeddata",
                () => {
                    video.classList.add("loaded");
                },
                { once: true }
            );
        }

        // Fallback cho trình duyệt cũ
        loadAllMedia() {
            document.querySelectorAll("img.lazy-image[data-src]").forEach((img) => {
                img.src = img.dataset.src;
                img.classList.add("loaded");
                img.removeAttribute("data-src");
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
    // LOAD TOURS FROM JSON - FIXED
    // ============================================
    function loadTours() {
        fetch("../tours.json")
            .then((response) => response.json())
            .then((data) => {
                const container = document.getElementById("tours-container");
                if (!container) return;

                container.innerHTML = "";

                const topTours = data.tours.slice(0, 4);

                topTours.forEach((tour) => {
                    const discountedPrice = tour.price * (1 - tour.discount_percent / 100);

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
                                    <span>${discountedPrice.toLocaleString("vi-VN")}đ</span> / tour
                                </div>
                                <h3 class="home-tour-card__title">
                                    <a href="#tour-details?id=${tour.id}">${tour.title}</a>
                                </h3>
                                <ul class="home-tour-card__meta">
                                    <li class="home-tour-card__meta-item">⭐ ${tour.rating} / 5</li>
                                    <li class="home-tour-card__meta-item">⏱ ${tour.duration_days} ngày</li>
                                </ul>
                                <a href="#tour-details?id=${tour.id}" class="home-tour-card__btn">Đặt ngay</a>
                            </div>
                        </article>
                    `;

                    container.insertAdjacentHTML("beforeend", card);
                });

                // Setup lazy loading cho ảnh mới thêm vào
                setupDynamicLazyImages();
            })
            .catch((error) => console.error("Lỗi tải dữ liệu JSON:", error));
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
                });

                // Setup lazy loading cho ảnh mới thêm vào
                setupDynamicLazyImages();
            })
            .catch(err => console.error("Lỗi khi load dữ liệu:", err));
    }

    // Setup lazy loading cho ảnh được thêm động
    function setupDynamicLazyImages() {
        const lazyImages = document.querySelectorAll("#tours-container img.lazy-image[data-src]");
        const lazyimage = document.querySelectorAll("#destinationsGrid img.lazy-image[data-src]")
        if (!("IntersectionObserver" in window)) {
            lazyImages.forEach((img) => {
                img.src = img.dataset.src;
                img.classList.add("loaded");
            });

            lazyimage.forEach((img) => {
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
        lazyimage.forEach((img) => imageObserver.observe(img));
    }

    // Load tours khi DOM ready
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", loadTours);
        document.addEventListener("DOMContentLoaded", loadDestinations);
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
                alert("Vui lòng nhập email!");
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert("Email không hợp lệ!");
                return;
            }

            const submitBtn = form.querySelector(".home-newsletter__submit");
            const originalHTML = submitBtn.innerHTML;
            submitBtn.innerHTML = "<span>✓</span>";
            submitBtn.disabled = true;

            setTimeout(() => {
                alert("Đăng ký thành công!");
                input.value = "";
                submitBtn.innerHTML = originalHTML;
                submitBtn.disabled = false;
            }, 1000);
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

    console.log("✅ Home page scripts loaded successfully!");
})();
