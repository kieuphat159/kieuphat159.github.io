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
                    this.loadImage(entry.target);
                    this.imageObserver.unobserve(entry.target);
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
                img.alt = "Không thể tải ảnh";
                img.classList.add("error");
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
                    this.loadVideo(entry.target);
                    this.videoObserver.unobserve(entry.target);
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
                video.classList.add("error");
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
                    // Auto play nếu trong viewport
                    if (video.hasAttribute("autoplay") || video.loop) {
                        video.play().catch((err) => {
                            console.log("Video autoplay prevented:", err);
                        });
                    }
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
                video.classList.add("loaded");
                video.removeAttribute("data-src");
                video.load();
            });
        }
    }

    // Khởi tạo lazy loader
    new MediaLazyLoader();

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

            // Disable buttons khi đang transition
            function updateButtonStates() {
                prevBtn.disabled = currentPosition >= 0;
                nextBtn.disabled = Math.abs(currentPosition) >= maxScroll;
            }

            nextBtn.onclick = () => {
                if (isTransitioning || Math.abs(currentPosition) >= maxScroll) return;

                isTransitioning = true;
                currentPosition -= itemWidth;

                if (Math.abs(currentPosition) > maxScroll) {
                    currentPosition = -maxScroll;
                }

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

                if (currentPosition > 0) {
                    currentPosition = 0;
                }

                track.style.transform = `translateX(${currentPosition}px)`;

                setTimeout(() => {
                    isTransitioning = false;
                    updateButtonStates();
                }, 500);
            };

            updateButtonStates();
        }

        updateVlogSlider();

        // Update on resize với debounce
        let resizeTimer;
        window.addEventListener("resize", () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                currentPosition = 0;
                track.style.transition = "none";
                track.style.transform = "translateX(0)";
                setTimeout(() => {
                    track.style.transition = "";
                    updateVlogSlider();
                }, 50);
            }, 250);
        });
    }

    // Khởi tạo vlog slider
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
                        // Play video khi vào viewport
                        if (video.paused && video.readyState >= 2) {
                            video.play().catch((err) => {
                                console.log("Video autoplay prevented:", err);
                            });
                        }
                    } else {
                        // Pause video khi ra khỏi viewport
                        if (!video.paused) {
                            video.pause();
                        }
                    }
                });
            },
            {
                threshold: 0.5, // 50% video hiển thị
            }
        );

        videos.forEach((video) => {
            videoObserver.observe(video);

            // Play khi video đã loaded và trong viewport
            video.addEventListener("loadeddata", () => {
                const rect = video.getBoundingClientRect();
                const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;

                if (isInViewport && video.paused) {
                    video.play().catch((err) => {
                        console.log("Video autoplay prevented:", err);
                    });
                }
            });
        });
    }

    // Khởi tạo video autoplay
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
                alert("Vui lòng nhập địa chỉ email");
                return;
            }

            // Validate email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert("Vui lòng nhập địa chỉ email hợp lệ");
                return;
            }

            // Simulate submission
            const submitBtn = form.querySelector(".home-newsletter__submit");
            const originalHTML = submitBtn.innerHTML;
            submitBtn.innerHTML = "<span>✓</span>";
            submitBtn.disabled = true;

            setTimeout(() => {
                alert("Đăng ký thành công! Cảm ơn bạn đã đăng ký nhận bản tin.");
                input.value = "";
                submitBtn.innerHTML = originalHTML;
                submitBtn.disabled = false;
            }, 1000);
        });
    }

    // Khởi tạo newsletter form
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

                // Bỏ qua các anchor không có target hoặc chỉ là #
                if (!href || href === "#") return;

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

    // Khởi tạo smooth scroll
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initSmoothScroll);
    } else {
        initSmoothScroll();
    }

    // ============================================
    // PERFORMANCE: PRELOAD CRITICAL IMAGES
    // ============================================
    function preloadCriticalImages() {
        // Preload hero image
        const heroImg = document.querySelector(".home-hero__image[data-src]");
        if (heroImg && heroImg.dataset.src) {
            const link = document.createElement("link");
            link.rel = "preload";
            link.as = "image";
            link.href = heroImg.dataset.src;
            document.head.appendChild(link);
        }
    }

    // Preload critical images
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
            // Log errors cho debugging
            if (e.target.tagName === "IMG" || e.target.tagName === "VIDEO") {
                console.error("Media failed to load:", e.target.src || e.target.currentSrc);
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
            // Pause all videos when tab is hidden
            videos.forEach((video) => {
                if (!video.paused) {
                    video.pause();
                    video.dataset.wasPlaying = "true";
                }
            });
        } else {
            // Resume videos that were playing
            videos.forEach((video) => {
                if (video.dataset.wasPlaying === "true") {
                    video.play().catch(() => {});
                    delete video.dataset.wasPlaying;
                }
            });
        }
    });

    console.log("Home page scripts loaded successfully!");



  // Lấy dữ liệu từ file JSON
  fetch('../tours.json')
    .then(response => response.json())
    .then(data => {
      const container = document.getElementById('tours-container');
      container.innerHTML = ''; // Xóa phần cũ

      const topTours = data.tours.slice(0, 4);

      topTours.forEach(tour => {
        // Tính giá sau giảm
        const discountedPrice = tour.price * (1 - tour.discount_percent / 100);

        // Tạo HTML cho mỗi tour
        const card = `
          <article class="home-tour-card">
            <a href="#tour-details?id=${tour.id}" class="home-tour-card__media">
              <img src="${tour.main_image}" alt="${tour.title}" class="lazy-image" />
            </a>
            <div class="home-tour-card__body">
              <div class="home-tour-card__price">
                <span>${discountedPrice.toLocaleString('vi-VN')}đ</span> / tour
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

        container.insertAdjacentHTML('beforeend', card);

      });
    })
    .catch(error => console.error('Lỗi tải dữ liệu JSON:', error));