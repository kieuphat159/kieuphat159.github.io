const PRICE_FORMATTER_VND = new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
        maximumFractionDigits: 0,
});

const FALLBACKS = {
        hero: "../assets/images/destination-detail/background.jpg",
        missionImage: "../assets/images/destination-detail/mission.jpg",
        cardImage: "../assets/images/destination-detail/background.jpg",
        avatars: [
                "../assets/images/destination-detail/ava1.jpg",
                "../assets/images/destination-detail/ava2.jpg",
                "../assets/images/destination-detail/ava3.jpg",
        ],
};

function normalizeText(value) {
        if (typeof value !== "string") return "";
        return value
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .toLowerCase();
}

function resolveImagePath(path) {
        if (!path || typeof path !== "string") return "";
        if (/^(https?:)?\/\//i.test(path)) return path;
        if (path.startsWith("../") || path.startsWith("./")) return path;
        if (path.startsWith("/")) return `..${path}`;
        return `../${path.replace(/^\/+/, "")}`;
}

const state = {
        destination: null,
        tours: [],
        insights: [],
        visibleInsights: 0,
};

const INSIGHT_STORAGE_KEY = "destinationDetail:selectedInsightArticle";
const INSIGHT_STORAGE_ID_KEY = "destinationDetail:selectedInsightArticleId";

let skeletonLoaderInstance = null;
let scrollRevealInstance = null;

class SkeletonLazyLoader {
        constructor() {
                this.observer = new IntersectionObserver(this.handleIntersection.bind(this), {
                        rootMargin: "50px",
                        threshold: 0.1,
                });

                this.init();
        }

        init() {
                // Initial setup with delay - only for first page load
                setTimeout(() => {
                        this.setupLazy();
                }, 300);
        }

        setupLazy() {
                // Disconnect all previous observations to avoid stale references
                this.observer.disconnect();

                // Double requestAnimationFrame to ensure DOM is fully ready
                requestAnimationFrame(() => {
                        requestAnimationFrame(() => {
                                const lazyImages = document.querySelectorAll("img[data-src]");
                                console.log(`[SkeletonLazyLoader] Found ${lazyImages.length} images with data-src`);

                                if (lazyImages.length === 0) {
                                        console.warn("[SkeletonLazyLoader] No images found with data-src attribute!");
                                        return;
                                }

                                lazyImages.forEach((img) => {
                                        const dataSrc = img.getAttribute("data-src");
                                        if (!dataSrc) {
                                                console.warn(
                                                        `[SkeletonLazyLoader] Image has data-src attribute but value is empty:`,
                                                        img
                                                );
                                                return;
                                        }

                                        console.log(`[SkeletonLazyLoader] Processing: ${dataSrc.substring(0, 50)}...`);

                                        // Clean up any existing wrapper first
                                        this.cleanupWrapper(img);

                                        // Wrap with new skeleton
                                        this.wrapImageWithSkeleton(img);

                                        // Bind load/error handlers on the actual <img> to ensure skeleton removal
                                        if (!img.dataset.skeletonBound) {
                                                img.dataset.skeletonBound = "true";
                                                img.addEventListener("load", () => {
                                                        const wrapper = img.closest(".skeleton-wrapper");
                                                        if (wrapper) {
                                                                wrapper.classList.remove("skeleton-loading");
                                                                wrapper.classList.add("skeleton-loaded");
                                                        }
                                                        img.classList.add("loaded");
                                                        // Stop observing once loaded
                                                        try {
                                                                this.observer.unobserve(img);
                                                        } catch (_) {}
                                                });

                                                img.addEventListener("error", () => {
                                                        const wrapper = img.closest(".skeleton-wrapper");
                                                        if (wrapper) {
                                                                wrapper.classList.remove("skeleton-loading");
                                                                wrapper.classList.add("skeleton-error");
                                                        }
                                                        // Fallback to default image to avoid permanent skeleton
                                                        if (!img.src) {
                                                                img.src =
                                                                        (typeof FALLBACKS !== "undefined" &&
                                                                                FALLBACKS.cardImage) ||
                                                                        "../assets/images/destination-detail/background.jpg";
                                                        }
                                                        try {
                                                                this.observer.unobserve(img);
                                                        } catch (_) {}
                                                });
                                        }

                                        // Check if image is already in viewport - if so, load immediately
                                        const rect = img.getBoundingClientRect();
                                        const isInViewport =
                                                rect.top >= -50 &&
                                                rect.left >= -50 &&
                                                rect.bottom <=
                                                        (window.innerHeight || document.documentElement.clientHeight) +
                                                                50 &&
                                                rect.right <=
                                                        (window.innerWidth || document.documentElement.clientWidth) +
                                                                50;

                                        if (isInViewport) {
                                                console.log(
                                                        `[SkeletonLazyLoader] Image in viewport, loading immediately: ${dataSrc.substring(
                                                                0,
                                                                50
                                                        )}...`
                                                );
                                                // Load immediately without delay for viewport images
                                                this.loadImage(img);
                                        } else {
                                                this.observer.observe(img);

                                                // Fallback: Force load after 2 seconds if still not loaded
                                                setTimeout(() => {
                                                        if (img.dataset.src && !img.src) {
                                                                console.warn(
                                                                        "[SkeletonLazyLoader] Fallback: Force loading image that was not observed:",
                                                                        dataSrc.substring(0, 50)
                                                                );
                                                                this.loadImage(img);
                                                        }
                                                }, 2000);
                                        }
                                });

                                console.log(`[SkeletonLazyLoader] Observation setup complete`);
                        });
                });
        }

        cleanupWrapper(img) {
                if (!img || !img.parentElement) return;

                const parent = img.parentElement;
                if (parent.classList.contains("skeleton-wrapper")) {
                        // Move img out of wrapper
                        const grandParent = parent.parentElement;
                        if (grandParent) {
                                grandParent.insertBefore(img, parent);
                                parent.remove();
                        }
                }
        }

        wrapImageWithSkeleton(img) {
                if (!img || !img.parentElement || img.parentElement.classList.contains("skeleton-wrapper")) {
                        return;
                }

                const preserveSizeClasses = [
                        "destination-detail-mission__img",
                        "destination-detail-ready__background",
                        "destination-detail-ready__image",
                        "destination-detail-gallery__main-image",
                        "destination-detail-gallery__thumb",
                ];

                const shouldPreserveSize = preserveSizeClasses.some((className) => img.classList.contains(className));

                const wrapper = document.createElement("div");
                wrapper.className = "skeleton-wrapper skeleton-loading";

                if (img.className) {
                        img.className
                                .split(" ")
                                .filter(Boolean)
                                .forEach((cls) => {
                                        if (!wrapper.classList.contains(cls)) {
                                                wrapper.classList.add(cls);
                                        }
                                });
                }

                img.parentNode.insertBefore(wrapper, img);
                wrapper.appendChild(img);

                if (!shouldPreserveSize && img.width && img.height) {
                        const aspectRatio = (img.height / img.width) * 100;
                        wrapper.style.paddingBottom = `${aspectRatio}%`;
                }
        }

        handleIntersection(entries) {
                console.log(`[SkeletonLazyLoader] Intersection callback with ${entries.length} entries`);

                entries.forEach((entry) => {
                        const dataSrc = entry.target.getAttribute("data-src");
                        console.log(
                                `[SkeletonLazyLoader] Entry intersecting: ${entry.isIntersecting}, target data-src: ${
                                        dataSrc?.substring(0, 50) || "NONE"
                                }...`
                        );

                        if (entry.isIntersecting) {
                                if (!dataSrc) {
                                        console.error(
                                                `[SkeletonLazyLoader] Image intersecting but has no data-src!`,
                                                entry.target
                                        );
                                        return;
                                }
                                this.loadImage(entry.target);
                                this.observer.unobserve(entry.target);
                        }
                });
        }

        loadImage(img) {
                const src = img.dataset.src;
                console.log(`[SkeletonLazyLoader] loadImage called with src:`, src);

                if (!src) {
                        console.error("[SkeletonLazyLoader] No src found for image:", img);
                        return;
                }

                // If image already has src and is loaded, just update wrapper
                if (img.src && img.complete && img.naturalHeight !== 0) {
                        console.log("[SkeletonLazyLoader] Image already loaded, updating wrapper only");
                        const wrapper = img.closest(".skeleton-wrapper");
                        if (wrapper) {
                                wrapper.classList.remove("skeleton-loading");
                                wrapper.classList.add("skeleton-loaded");
                        }
                        img.classList.add("loaded");
                        try {
                                this.observer.unobserve(img);
                        } catch (_) {}
                        return;
                }

                // Assign src directly and rely on the <img> load/error handlers
                img.src = src;

                // Safety timeout: ensure skeleton does not persist forever
                setTimeout(() => {
                        const wrapper = img.closest(".skeleton-wrapper");
                        if (
                                !img.classList.contains("loaded") &&
                                wrapper &&
                                !wrapper.classList.contains("skeleton-error")
                        ) {
                                console.warn(
                                        "[SkeletonLazyLoader] Safety timeout reached, marking as error to remove skeleton"
                                );
                                wrapper.classList.remove("skeleton-loading");
                                wrapper.classList.add("skeleton-error");
                                if (!img.src) {
                                        img.src =
                                                (typeof FALLBACKS !== "undefined" && FALLBACKS.cardImage) ||
                                                "../assets/images/destination-detail/background.jpg";
                                }
                                try {
                                        this.observer.unobserve(img);
                                } catch (_) {}
                        }
                }, 5000);
        }
}

class ScrollReveal {
        constructor() {
                this.init();
        }

        init() {
                const observerOptions = {
                        threshold: 0.15,
                        rootMargin: "0px 0px -80px 0px",
                };

                const observer = new IntersectionObserver((entries) => {
                        entries.forEach((entry) => {
                                if (entry.isIntersecting) {
                                        entry.target.classList.add("animate-in");
                                        observer.unobserve(entry.target);
                                }
                        });
                }, observerOptions);

                const animatedElements = document.querySelectorAll(
                        ".destination-detail-popular, .destination-detail-mission, " +
                                ".destination-detail-mission__image, .destination-detail-mission__text, " +
                                ".destination-detail-mission__stat, .destination-detail-ready, " +
                                ".destination-detail-ready__overlay, .destination-detail-pilgrimages, " +
                                ".destination-detail-gallery, .destination-detail-itinerary, " +
                                ".destination-detail-cta, .destination-detail-cta__overlay, " +
                                ".destination-detail-insights, .destination-detail-testimonials, " +
                                ".destination-detail-card, .destination-detail-pilgrimages__card, " +
                                ".destination-detail-insights__card, .destination-detail-testimonials__item, " +
                                ".stagger-item"
                );

                animatedElements.forEach((el) => {
                        el.classList.add("scroll-animate");
                        observer.observe(el);
                });
        }
}

function initDestinationDetailPage() {
        if (document.readyState === "loading") {
                document.addEventListener("DOMContentLoaded", loadDestinationData);
        } else {
                loadDestinationData();
        }
}

initDestinationDetailPage();

async function loadDestinationData() {
        const destinationId = window.currentPageParams?.id;

        try {
                // Get current language from i18n or default to 'vi'
                const currentLang = window.i18n ? window.i18n.getCurrentLanguage() : "vi";

                // Determine which data files to load based on language
                const dataFile = currentLang === "en" ? "./data-en.json" : "./data-vi.json";
                const toursFile = currentLang === "en" ? "./tours-en.json" : "./tours-vi.json";

                const [destinationsResponse, toursResponse] = await Promise.all([fetch(dataFile), fetch(toursFile)]);

                if (!destinationsResponse.ok) {
                        throw new Error(`Failed to load ${dataFile} (${destinationsResponse.status})`);
                }

                if (!toursResponse.ok) {
                        throw new Error(`Failed to load ${toursFile} (${toursResponse.status})`);
                }

                const destinationsJson = await destinationsResponse.json();
                const toursJson = await toursResponse.json();

                const destinations = Array.isArray(destinationsJson.data) ? destinationsJson.data : [];
                const tours = Array.isArray(toursJson.tours) ? toursJson.tours : [];

                if (!destinations.length) {
                        throw new Error("Destination dataset is empty");
                }

                const selectedDestination = destinations.find((item) => item.id === destinationId) || destinations[0];

                if (!selectedDestination) {
                        throw new Error("Destination not found");
                }

                state.destination = selectedDestination;
                state.tours = tours.filter((tour) => tour.destination_id === selectedDestination.id);
                state.insights = buildInsightsData(selectedDestination);
                state.visibleInsights = Math.min(6, state.insights.length);

                renderDestinationPage(selectedDestination, state.tours);
                initializeEnhancements();
        } catch (error) {
                console.error("Failed to initialise destination detail page:", error);
                showDestinationError();
        }
}

// Collect famous locations for the insights grid
function buildInsightsData(destination) {
        const insights = [];
        const places = Array.isArray(destination.places) ? destination.places : [];

        places.forEach((place, placeIndex) => {
                const locations = Array.isArray(place.famous_locations) ? place.famous_locations : [];
                locations.forEach((location, locationIndex) => {
                        // Generate unique ID based on destination ID and city name
                        // Format: destinationId-cityName (e.g., "jp002-tokyo", "vn001-hanoi")
                        const citySlug = normalizeText(place.city || destination.country);
                        const insightId = `${destination.id}-${citySlug}`;

                        insights.push({
                                id: insightId,
                                title: location.name || place.city || destination.country,
                                image: resolveImagePath(location.image_url || FALLBACKS.cardImage),
                                city: place.city || destination.country,
                                excerpt: location.description || (place.blog ? getExcerpt(place.blog, 100) : ""),
                                placeCity: place.city,
                                placeBlog: place.blog,
                        });
                });
        });

        return insights;
}

function findTourForCity(city, tours) {
        if (!city || !Array.isArray(tours) || !tours.length) {
                return null;
        }

        const cityToken = normalizeText(city);
        if (!cityToken) return tours[0] || null;

        const matchesCity = (text) => (text ? normalizeText(text).includes(cityToken) : false);

        const tourMatch = tours.find((tour) => {
                if (!tour) return false;
                if (matchesCity(tour.title)) return true;
                if (matchesCity(tour.overview)) return true;
                if (matchesCity(tour.type)) return true;
                if (Array.isArray(tour.highlights) && tour.highlights.some((item) => matchesCity(item))) {
                        return true;
                }
                if (Array.isArray(tour.itinerary)) {
                        const itineraryHasMatch = tour.itinerary.some((day) => {
                                if (!day) return false;
                                if (matchesCity(day.title)) return true;
                                if (
                                        Array.isArray(day.activities) &&
                                        day.activities.some((activity) => matchesCity(activity))
                                ) {
                                        return true;
                                }
                                return false;
                        });
                        if (itineraryHasMatch) return true;
                }
                return false;
        });

        return tourMatch || tours[0] || null;
}

function renderDestinationPage(destination, tours) {
        console.log("[renderDestinationPage] START rendering with destination:", destination.country);

        renderHero(destination);
        renderPopularPlaces(destination);
        renderMission(destination);
        renderReadySection(destination);
        renderPilgrimages(destination, tours);
        renderCTA(destination);
        renderInsights();
        renderTestimonials(destination);

        console.log("[renderDestinationPage] All sections rendered");

        // Re-setup lazy loading after DOM updates are complete
        // Use triple requestAnimationFrame to ensure ALL DOM operations are truly complete
        requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                        requestAnimationFrame(() => {
                                if (skeletonLoaderInstance) {
                                        console.log("[renderDestinationPage] Calling setupLazy after render");
                                        skeletonLoaderInstance.setupLazy();
                                }
                        });
                });
        });
}

function renderHero(destination) {
        const heroTitle = document.querySelector(".destination-detail-hero__title");
        if (heroTitle) {
                const titleText =
                        destination.title ||
                        (window.i18n
                                ? window.i18n.t("destinationDetail.hero.exploreTemplate", {
                                          country:
                                                  destination.country ||
                                                  window.i18n.t("destinationDetail.hero.defaultDestination"),
                                  })
                                : `Khám phá ${destination.country || "điểm đến"}`);
                heroTitle.textContent = titleText;
        }

        const heroSubtitle = document.querySelector(".destination-detail-hero__subtitle");
        if (heroSubtitle) {
                const subtitleParts = [];
                if (destination.days)
                        subtitleParts.push(
                                `${destination.days} ${window.i18n ? window.i18n.t("common.days") : "ngày"}`
                        );
                if (destination.rating) subtitleParts.push(`${destination.rating.toFixed(1)}/5`);
                if (destination.country) subtitleParts.push(destination.country);
                heroSubtitle.textContent = subtitleParts.length
                        ? subtitleParts.join(" • ")
                        : window.i18n
                        ? window.i18n.t("destinationDetail.hero.defaultSubtitle")
                        : "Trải nghiệm đáng nhớ cùng chúng tôi";
        }

        const heroSection = document.querySelector(".destination-detail-hero");
        if (heroSection) {
                const heroImage = getPrimaryImage(destination);
                heroSection.style.backgroundImage = `linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.25) 40%), url("${heroImage}")`;
        }
}

function renderPopularPlaces(destination) {
        const container = document.querySelector(".destination-detail-popular__container");
        if (!container) return;

        container.innerHTML = "";

        const places = Array.isArray(destination.places) ? destination.places : [];

        if (!places.length) {
                const empty = document.createElement("p");
                empty.className = "destination-detail-empty";
                empty.textContent = window.i18n
                        ? window.i18n.t("destinationDetail.popular.empty")
                        : "Chúng tôi sẽ sớm cập nhật các địa điểm nổi bật.";
                container.appendChild(empty);
                return;
        }

        places.slice(0, 4).forEach((place) => {
                const firstLocation =
                        Array.isArray(place.famous_locations) && place.famous_locations.length
                                ? place.famous_locations[0]
                                : null;

                const imageUrl = resolveImagePath(
                        firstLocation && firstLocation.image_url ? firstLocation.image_url : FALLBACKS.cardImage
                );
                const matchingTour = findTourForCity(place.city, state.tours);

                const card = document.createElement("div");
                card.className = "destination-detail-card";
                card.setAttribute("role", "listitem");

                // Add discount badge if tour has discount
                if (matchingTour && matchingTour.discount_percent > 0) {
                        const badge = document.createElement("div");
                        badge.className = "destination-detail-card__badge";
                        const discountText = window.i18n
                                ? window.i18n.t("destinationDetail.pilgrimages.discount", {
                                          percent: matchingTour.discount_percent,
                                  })
                                : `Giảm ${matchingTour.discount_percent}%`;
                        badge.textContent = discountText;
                        card.appendChild(badge);
                }

                const image = document.createElement("img");
                image.className = "destination-detail-card__img";
                image.setAttribute("width", "300");
                image.setAttribute("height", "300");
                image.dataset.src = imageUrl;
                image.alt =
                        firstLocation && firstLocation.name
                                ? `${firstLocation.name} - ${place.city}`
                                : `${place.city || destination.country}`;

                const content = document.createElement("div");
                content.className = "destination-detail-card__content";

                const nameEl = document.createElement("h3");
                nameEl.className = "destination-detail-card__name";
                nameEl.textContent =
                        place.city ||
                        destination.country ||
                        (window.i18n ? window.i18n.t("destinationDetail.popular.defaultDestination") : "Điểm đến");

                const locationEl = document.createElement("p");
                locationEl.className = "destination-detail-card__location";
                locationEl.textContent = window.i18n
                        ? window.i18n.t("destinationDetail.popular.description")
                        : "Khám phá chuyến đi hấp dẫn!";

                const button = document.createElement("button");
                button.className = "destination-detail-card__button";
                button.textContent = window.i18n ? window.i18n.t("destinationDetail.popular.viewOffer") : "Xem ưu đãi";

                content.appendChild(nameEl);
                content.appendChild(locationEl);
                content.appendChild(button);

                card.appendChild(image);
                card.appendChild(content);

                if (matchingTour) {
                        card.dataset.tourId = matchingTour.id;
                        card.tabIndex = 0;
                        card.classList.add("destination-detail-card--interactive");
                        card.setAttribute(
                                "aria-label",
                                `Xem tour ${matchingTour.title || "chi tiết"} tại ${
                                        place.city || destination.country || "điểm đến"
                                }`
                        );

                        const handleNavigation = (event) => {
                                event.preventDefault();
                                navigateToTour(matchingTour.id);
                        };

                        card.addEventListener("click", handleNavigation);
                        button.addEventListener("click", (event) => {
                                event.stopPropagation();
                                handleNavigation(event);
                        });
                        card.addEventListener("keydown", (event) => {
                                if (event.key === "Enter" || event.key === " ") {
                                        event.preventDefault();
                                        handleNavigation(event);
                                }
                        });
                } else {
                        card.setAttribute("aria-disabled", "true");
                        card.classList.add("destination-detail-card--inactive");
                }

                container.appendChild(card);
        });

        refreshScrollReveal();
        // Don't call triggerLazyRefresh here - it will be called once after all renders
}

function renderMission(destination) {
        const missionImage = document.querySelector(".destination-detail-mission__img");
        if (missionImage) {
                missionImage.dataset.src = resolveImagePath(getPrimaryImage(destination) || FALLBACKS.missionImage);
                missionImage.alt = `${destination.country || "Điểm đến"} - Hình ảnh nổi bật`;
                if (missionImage.getAttribute("src")) {
                        missionImage.removeAttribute("src");
                }
        }

        const missionTitle = document.querySelector(".destination-detail-mission__title");
        if (missionTitle) {
                const titleText = destination.country
                        ? window.i18n
                                ? window.i18n.t("destinationDetail.mission.titleTemplate", {
                                          country: destination.country,
                                  })
                                : `Sứ mệnh của chúng tôi: đưa bạn đến gần ${destination.country} hơn`
                        : window.i18n
                        ? window.i18n.t("destinationDetail.mission.defaultTitle")
                        : "Sứ mệnh của chúng tôi là tạo nên hành trình đáng nhớ";
                missionTitle.textContent = titleText;
        }

        const missionDescriptions = document.querySelectorAll(".destination-detail-mission__desc");
        if (missionDescriptions.length) {
                const defaultDesc = window.i18n
                        ? window.i18n.t("destinationDetail.mission.defaultDescription")
                        : "Chúng tôi luôn tìm kiếm những trải nghiệm chân thực và giàu cảm xúc nhất cho bạn.";
                missionDescriptions[0].textContent = destination.description || defaultDesc;
                if (missionDescriptions[1]) {
                        const placeBlogs = (destination.places || []).map((place) => place.blog).filter(Boolean);
                        missionDescriptions[1].textContent =
                                placeBlogs.length > 0
                                        ? getExcerpt(placeBlogs[0], 220)
                                        : "Mỗi chuyến đi là cơ hội để kết nối, để cảm nhận và để lưu giữ ký ức trọn vẹn.";
                }
        }

        const stats = {
                days: destination.days
                        ? `${destination.days} ${window.i18n ? window.i18n.t("common.days") : "ngày"}`
                        : "--",
                cities: Array.isArray(destination.places)
                        ? `${destination.places.length} ${
                                  window.i18n ? (destination.places.length > 1 ? "cities" : "city") : "thành phố"
                          }`
                        : "--",
                rating: destination.rating ? `${destination.rating.toFixed(1)}/5` : "--",
        };

        Object.keys(stats).forEach((key) => {
                const statEl = document.querySelector(`[data-destination-stat="${key}"]`);
                if (statEl) {
                        statEl.textContent = stats[key];
                }
        });

        const joinButton = document.querySelector(".btn.btn--primary");
        if (joinButton && destination.country) {
                joinButton.dataset.country = destination.country;
                joinButton.setAttribute("aria-label", `Xem tất cả tour ${destination.country}`);
                // Update button text using i18n
                const buttonText = window.i18n ? window.i18n.t("destinationDetail.mission.joinBtn") : "Tham gia ngay";
                joinButton.textContent = buttonText;
        }

        // Don't call triggerLazyRefresh here - it will be called once after all renders
}

function renderReadySection(destination) {
        const readyText = document.querySelector(".destination-detail-ready__text");
        if (readyText) {
                const text = destination.country
                        ? window.i18n
                                ? window.i18n.t("destinationDetail.ready.textTemplate", {
                                          country: destination.country,
                                  })
                                : `trải nghiệm ${destination.country} theo cách của riêng bạn`
                        : window.i18n
                        ? window.i18n.t("destinationDetail.ready.defaultText")
                        : "trải nghiệm hành trình mới và trọn vẹn trong cuộc sống";
                readyText.textContent = text;
        }
}

function renderPilgrimages(destination, tours) {
        const container = document.querySelector(".destination-detail-pilgrimages__cards");
        if (!container) return;

        container.innerHTML = "";

        if (!tours.length) {
                const empty = document.createElement("p");
                empty.className = "destination-detail-pilgrimages__empty";
                const country =
                        destination.country ||
                        (window.i18n ? window.i18n.t("destinationDetail.pilgrimages.emptyDefault") : "điểm đến này");
                empty.textContent = window.i18n
                        ? window.i18n.t("destinationDetail.pilgrimages.emptyTemplate", { country })
                        : `Hiện chưa có tour khả dụng cho ${country}.`;
                container.appendChild(empty);
                return;
        }

        const flexibleDepartureText = window.i18n
                ? window.i18n.t("destinationDetail.pilgrimages.flexibleDeparture")
                : "Flexible departure";
        const highlightLabel = window.i18n
                ? window.i18n.t("destinationDetail.pilgrimages.highlightDestinations")
                : "Highlight destinations";
        const perGuestText = window.i18n ? window.i18n.t("destinationDetail.pilgrimages.perGuest") : "/Guest";
        const viewDetailsText = window.i18n
                ? window.i18n.t("destinationDetail.pilgrimages.viewDetails")
                : "View details";
        const availableText = window.i18n ? window.i18n.t("destinationDetail.pilgrimages.available") : "Available";
        const daysLabel = window.i18n ? window.i18n.t("common.days") : "days";
        const fromLabel = window.i18n ? window.i18n.t("tours.card.from") : "From";

        const getRatingStars = (ratingValue = 4.8) => {
                const fullStars = Math.floor(ratingValue);
                const hasHalf = ratingValue % 1 !== 0;
                let stars = Array(fullStars).fill('<i class="fas fa-star"></i>').join("");
                if (hasHalf) stars += '<i class="fas fa-star-half-alt"></i>';
                stars += Array(5 - Math.ceil(ratingValue))
                        .fill('<i class="far fa-star"></i>')
                        .join("");
                return stars;
        };

        const getInclusions = (tour) => {
                const inclusions = [];
                const transport = Array.isArray(tour.transport) ? tour.transport : [];
                if (transport.some((item) => normalizeText(item).includes("may bay") || item.includes("Máy bay"))) {
                        inclusions.push("Flights");
                }
                if (
                        transport.some(
                                (item) =>
                                        normalizeText(item).includes("tau cao toc") ||
                                        normalizeText(item).includes("shinkansen") ||
                                        normalizeText(item).includes("tau")
                        )
                ) {
                        inclusions.push("Train Tix");
                }
                if (tour.services?.hotel) inclusions.push("Hotel");
                if (tour.services?.meals) inclusions.push("Breakfast");
                if (tour.services?.guide) inclusions.push("Guide");
                return inclusions;
        };

        const inclusionsIconMap = {
                Flights: "fa-plane",
                Hotel: "fa-hotel",
                Breakfast: "fa-mug-saucer",
                Guide: "fa-user",
                Dinner: "fa-utensils",
                "Train Tix": "fa-train",
        };

        tours.forEach((tour) => {
                const hasDiscount = tour.discount_percent > 0;
                const card = document.createElement("article");
                card.className = "tour-card destination-detail-tour-card";
                card.dataset.tourId = tour.id;
                card.tabIndex = 0;

                const ratingValue = typeof tour.rating === "number" ? tour.rating : destination.rating || 4.8;
                const reviewsCount = Math.round(ratingValue * 50 + (tour.duration_days || 5) * 8);
                const inclusions = getInclusions(tour);
                const inclusionsHTML = inclusions
                        .slice(0, 3)
                        .map(
                                (item) =>
                                        `<span><i class="fas ${
                                                inclusionsIconMap[item] || "fa-check"
                                        }"></i> ${item}</span>`
                        )
                        .join("");

                const priceValue = hasDiscount
                        ? Math.round(tour.price * (1 - tour.discount_percent / 100))
                        : tour.price;
                const priceHTML = hasDiscount
                        ? `<p class="tour-card__price-original">${formatPriceVND(tour.price)}</p>
                           <p class="tour-card__price-value">${formatPriceVND(priceValue)}</p>`
                        : `<p class="tour-card__price-value">${formatPriceVND(priceValue)}</p>`;

                const discountText = hasDiscount
                        ? window.i18n
                                ? window.i18n.t("destinationDetail.pilgrimages.discount", {
                                          percent: tour.discount_percent,
                                  })
                                : `Discount ${tour.discount_percent}%`
                        : availableText;

                const imageSrc = resolveImagePath(
                        tour.main_image || getPrimaryImage(destination) || FALLBACKS.cardImage
                );
                const locationLabel = tour.location || destination.country || "";
                const durationText = tour.duration_days ? `${tour.duration_days} ${daysLabel}` : flexibleDepartureText;
                const highlightsText = extractHighlightDestinations(tour, destination);
                const tags = [];
                if (tour.discount_percent >= 10) tags.push("Bestseller");
                if (ratingValue >= 4.9) tags.push("Luxury");
                const tagsHTML = tags
                        .map(
                                (tag) =>
                                        `<span class="tour-card__tag tour-card__tag--${tag.replace(
                                                /\s+/g,
                                                "-"
                                        )}">${tag}</span>`
                        )
                        .join("");

                card.innerHTML = `
                        <div class="tour-card__image-wrapper">
                                ${hasDiscount ? `<div class="tour-card__discount-badge">${discountText}</div>` : ""}
                                <img data-src="${imageSrc}" alt="${
                        tour.title || ""
                }" class="tour-card__image" loading="lazy" />
                                <div class="tour-card__tags">${tagsHTML}</div>
                                <button class="tour-card__wishlist-btn" type="button" aria-label="Wishlist">
                                        <i class="fas fa-heart"></i>
                                </button>
                                <span class="tour-card__vertical-label">${
                                        tour.next_departure || flexibleDepartureText
                                }</span>
                        </div>
                        <div class="tour-card__content">
                                <div class="tour-card__meta">
                                        <span class="tour-card__location"><i class="fas fa-map-marker-alt"></i> ${locationLabel}</span>
                                        <span class="tour-card__duration"><i class="fas fa-clock"></i> ${durationText}</span>
                                </div>
                                <a href="#tour-details?id=${encodeURIComponent(tour.id)}" class="tour-card__title-link">
                                        <h3 class="tour-card__title">
                                                ${
                                                        tour.title ||
                                                        (window.i18n
                                                                ? window.i18n.t(
                                                                          "destinationDetail.pilgrimages.journeyTemplate",
                                                                          {
                                                                                  country:
                                                                                          destination.country ||
                                                                                          window.i18n.t(
                                                                                                  "destinationDetail.pilgrimages.defaultJourney"
                                                                                          ),
                                                                          }
                                                                  )
                                                                : `Journey ${destination.country || ""}`)
                                                }
                                        </h3>
                                </a>
                                <p class="tour-card__description">
                                        ${
                                                tour.overview ||
                                                (window.i18n
                                                        ? window.i18n.t(
                                                                  "destinationDetail.pilgrimages.defaultDescription"
                                                          )
                                                        : "Exciting experiences are waiting for you.")
                                        }
                                </p>
                                <div class="tour-card__rating">
                                        ${getRatingStars(ratingValue)}
                                        <span class="tour-card__rating-count">(${reviewsCount})</span>
                                </div>
                                <div class="tour-card__inclusions">${inclusionsHTML}</div>
                                <div class="tour-card__highlights">
                                        <span class="tour-card__highlights-label">${highlightLabel}</span>
                                        <p class="tour-card__highlights-text">${highlightsText}</p>
                                </div>
                                <div class="tour-card__footer">
                                        <div>
                                                <p class="tour-card__price-from">${fromLabel}</p>
                                                ${priceHTML}
                                                <span class="tour-card__price-note">${perGuestText}</span>
                                        </div>
                                        <a href="#tour-details?id=${encodeURIComponent(
                                                tour.id
                                        )}" class="tour-card__details-btn">${viewDetailsText}</a>
                                </div>
                        </div>
                `;

                const handleNavigation = (event) => {
                        event.preventDefault();
                        navigateToTour(tour.id);
                };

                card.addEventListener("click", handleNavigation);
                card.addEventListener("keydown", (event) => {
                        if (event.key === "Enter" || event.key === " ") {
                                event.preventDefault();
                                handleNavigation(event);
                        }
                });

                const ctaButton = card.querySelector(".tour-card__details-btn");
                if (ctaButton) {
                        ctaButton.addEventListener("click", (event) => {
                                event.preventDefault();
                                event.stopPropagation();
                                handleNavigation(event);
                        });
                }

                const wishlistBtn = card.querySelector(".tour-card__wishlist-btn");
                if (wishlistBtn) {
                        wishlistBtn.addEventListener("click", (event) => {
                                event.preventDefault();
                                event.stopPropagation();
                                wishlistBtn.classList.toggle("active");
                        });
                }

                container.appendChild(card);
        });

        refreshScrollReveal();
        // Don't call triggerLazyRefresh here - it will be called once after all renders
}

function renderCTA(destination) {
        const ctaTitle = document.querySelector(".destination-detail-cta__title");
        if (ctaTitle) {
                const countryLabel =
                        destination.country ||
                        (window.i18n ? window.i18n.t("destinationDetail.cta.defaultDate") : "ngay hôm nay");
                const ctaText = window.i18n
                        ? window.i18n.t("destinationDetail.cta.textTemplate", { country: countryLabel })
                        : `Đừng bỏ lỡ giảm 10% nếu<br>bạn đặt tour ${countryLabel}`;
                ctaTitle.innerHTML = ctaText;
        }

        const ctaButton = document.querySelector(".destination-detail-cta__btn");
        if (ctaButton) {
                const buttonText = window.i18n ? window.i18n.t("destinationDetail.cta.button") : "Liên hệ";
                ctaButton.textContent = buttonText;

                if (state.tours.length) {
                        const primaryTour = state.tours[0];
                        ctaButton.setAttribute("href", `#tour-details?id=${encodeURIComponent(primaryTour.id)}`);
                        ctaButton.setAttribute("aria-label", `Liên hệ để đặt tour ${primaryTour.title}`);
                } else {
                        ctaButton.setAttribute("href", "#tours");
                        ctaButton.setAttribute("aria-label", "Xem thêm tour");
                }
        }
}

function renderInsights() {
        state.visibleInsights = Math.min(
                state.visibleInsights || Math.min(6, state.insights.length),
                state.insights.length
        );
        updateInsightsGrid();
        setupInsightsLoadMoreButton();
}

function updateInsightsGrid() {
        const grid = document.querySelector(".destination-detail-insights__grid");
        if (!grid) return;

        grid.innerHTML = "";

        if (!state.insights.length) {
                const empty = document.createElement("p");
                empty.className = "destination-detail-empty";
                empty.textContent = window.i18n
                        ? window.i18n.t("destinationDetail.insights.empty")
                        : "Đang cập nhật bài viết nổi bật.";
                grid.appendChild(empty);
                return;
        }

        const visibleItems = state.insights.slice(0, state.visibleInsights || state.insights.length);

        visibleItems.forEach((item) => {
                const article = document.createElement("article");
                article.className = "destination-detail-insights__card";

                const link = document.createElement("a");
                link.className = "destination-detail-insights__link";
                link.href = `#blog-detail?id=${encodeURIComponent(item.id)}`;
                link.setAttribute("data-insight-id", item.id);
                link.setAttribute("aria-label", `Đọc bài viết ${item.title}`);

                link.addEventListener("click", (event) => {
                        event.preventDefault();
                        handleInsightNavigation(item);
                });

                const img = document.createElement("img");
                img.className = "destination-detail-insights__image";
                img.dataset.src = item.image || FALLBACKS.cardImage;
                img.alt = `${item.title}${item.city ? ` - ${item.city}` : ""}`;
                img.setAttribute("loading", "lazy");

                const content = document.createElement("div");
                content.className = "destination-detail-insights__content";

                const title = document.createElement("h3");
                title.className = "destination-detail-insights__title";
                title.textContent = item.title;
                content.appendChild(title);

                if (item.city) {
                        const location = document.createElement("p");
                        location.className = "destination-detail-insights__location";
                        location.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${item.city}`;
                        content.appendChild(location);
                }

                if (item.excerpt) {
                        const excerpt = document.createElement("p");
                        excerpt.className = "destination-detail-insights__excerpt";
                        excerpt.textContent = item.excerpt;
                        content.appendChild(excerpt);
                }

                const readMore = document.createElement("span");
                readMore.className = "destination-detail-insights__read-more";
                const readText = window.i18n ? window.i18n.t("destinationDetail.insights.readArticle") : "Đọc bài viết";
                readMore.innerHTML = `${readText} <i class="fa fa-arrow-right" aria-hidden="true"></i>`;
                content.appendChild(readMore);

                link.appendChild(img);
                link.appendChild(content);
                article.appendChild(link);
                grid.appendChild(article);
        });

        refreshScrollReveal();
        // Don't call triggerLazyRefresh here - it will be called once after all renders
}

function setupInsightsLoadMoreButton() {
        const loadMoreBtn = document.querySelector(".destination-detail-insights__load-btn");
        if (!loadMoreBtn) return;

        if (state.insights.length <= state.visibleInsights) {
                loadMoreBtn.style.display = "none";
                return;
        }

        loadMoreBtn.style.display = "inline-flex";
        loadMoreBtn.disabled = false;
        const loadMoreText = window.i18n ? window.i18n.t("destinationDetail.insights.loadMore") : "Tải thêm";
        loadMoreBtn.innerHTML = `${loadMoreText} <i class="fa fa-chevron-down" aria-hidden="true"></i>`;

        if (loadMoreBtn.dataset.bound === "true") return;

        loadMoreBtn.dataset.bound = "true";
        loadMoreBtn.addEventListener("click", () => {
                state.visibleInsights = state.insights.length;
                updateInsightsGrid();
                triggerLazyRefresh();
                const showAllText = window.i18n
                        ? window.i18n.t("destinationDetail.insights.showAll")
                        : "Đã hiển thị tất cả";
                loadMoreBtn.innerHTML = showAllText;
                loadMoreBtn.disabled = true;
        });
}

function renderTestimonials(destination) {
        const list = document.querySelector(".destination-detail-testimonials__list");
        if (!list) return;

        list.innerHTML = "";

        const places = Array.isArray(destination.places) ? destination.places : [];
        const defaultName = window.i18n ? window.i18n.t("destinationDetail.testimonials.defaultName") : "Hành khách";
        const defaultRole = window.i18n
                ? window.i18n.t("destinationDetail.testimonials.defaultRole")
                : "Khách hành hương";
        const testimonials = places.slice(0, 3).map((place, index) => ({
                text: getExcerpt(place.blog, 180),
                name: place.city || destination.country || defaultName,
                role: destination.country || defaultRole,
                avatar: FALLBACKS.avatars[index % FALLBACKS.avatars.length],
        }));

        if (!testimonials.length) {
                const empty = document.createElement("p");
                empty.className = "destination-detail-empty";
                empty.textContent = window.i18n
                        ? window.i18n.t("destinationDetail.testimonials.empty")
                        : "Chưa có đánh giá cho điểm đến này.";
                list.appendChild(empty);
                return;
        }

        testimonials.forEach((item) => {
                const wrapper = document.createElement("div");
                wrapper.className = "destination-detail-testimonials__item";

                const textEl = document.createElement("p");
                textEl.className = "destination-detail-testimonials__text";
                textEl.textContent = item.text;

                const nameEl = document.createElement("h4");
                nameEl.className = "destination-detail-testimonials__name";
                nameEl.textContent = `- ${item.name}`;

                const roleEl = document.createElement("p");
                roleEl.className = "destination-detail-testimonials__role";
                roleEl.textContent = item.role;

                const rating = document.createElement("div");
                rating.className = "destination-detail-testimonials__rating";
                const ratingValue =
                        state.destination && state.destination.rating ? state.destination.rating.toFixed(1) : "4.5";
                rating.setAttribute("aria-label", `Đánh giá: ${ratingValue} trên 5 sao`);

                const starIcon = document.createElement("i");
                starIcon.className = "fa-solid fa-star";
                starIcon.setAttribute("aria-hidden", "true");

                const ratingText = document.createElement("span");
                ratingText.textContent = ratingValue;

                rating.appendChild(starIcon);
                rating.appendChild(ratingText);

                const avatar = document.createElement("img");
                avatar.className = "destination-detail-testimonials__avatar";
                avatar.dataset.src = item.avatar;
                avatar.alt = `Chân dung ${item.name}`;
                avatar.setAttribute("loading", "lazy");

                wrapper.appendChild(textEl);
                wrapper.appendChild(nameEl);
                wrapper.appendChild(roleEl);
                wrapper.appendChild(rating);
                wrapper.appendChild(avatar);

                list.appendChild(wrapper);
        });

        refreshScrollReveal();
        // Don't call triggerLazyRefresh here - it will be called once after all renders
}

function initTestimonialsNavigation() {
        const list = document.querySelector(".destination-detail-testimonials__list");
        const prevBtn = document.querySelector('.destination-detail-testimonials__btn[aria-label="Lời chứng trước"]');
        const nextBtn = document.querySelector('.destination-detail-testimonials__btn[aria-label="Lời chứng tiếp"]');

        if (!list || !prevBtn || !nextBtn) return;

        if (!prevBtn.dataset.bound) {
                prevBtn.dataset.bound = "true";
                prevBtn.addEventListener("click", () => {
                        list.scrollBy({ left: -list.clientWidth, behavior: "smooth" });
                });
        }

        if (!nextBtn.dataset.bound) {
                nextBtn.dataset.bound = "true";
                nextBtn.addEventListener("click", () => {
                        list.scrollBy({ left: list.clientWidth, behavior: "smooth" });
                });
        }
}

function formatPriceVND(value) {
        if (typeof value !== "number" || Number.isNaN(value)) {
                return PRICE_FORMATTER_VND.format(0);
        }
        return PRICE_FORMATTER_VND.format(value);
}

function extractHighlightDestinations(tour, destination) {
        if (tour && typeof tour.title === "string" && tour.title.includes(":")) {
                const afterColon = tour.title.split(":")[1];
                if (afterColon) {
                        const cities = afterColon
                                .split("-")
                                .map((city) => city.trim())
                                .filter(Boolean);
                        if (cities.length) {
                                return cities.join(", ");
                        }
                }
        }

        const fallbackCities = (destination.places || [])
                .map((place) => place.city)
                .filter(Boolean)
                .slice(0, 3);
        if (fallbackCities.length) {
                return fallbackCities.join(", ");
        }

        return destination.country || "";
}

function getPrimaryImage(destination) {
        const places = Array.isArray(destination.places) ? destination.places : [];

        for (let i = 0; i < places.length; i += 1) {
                const place = places[i];
                if (Array.isArray(place.famous_locations) && place.famous_locations.length) {
                        const candidate = place.famous_locations[0];
                        if (candidate && candidate.image_url) {
                                return resolveImagePath(candidate.image_url);
                        }
                }
        }

        return resolveImagePath(FALLBACKS.hero);
}

function getExcerpt(text, maxLength) {
        if (!text) return "";
        if (text.length <= maxLength) return text;

        const truncated = text.slice(0, maxLength);
        const lastSpace = truncated.lastIndexOf(" ");
        const base = lastSpace > 0 ? truncated.slice(0, lastSpace) : truncated;
        return `${base}...`;
}

function navigateToTour(tourId) {
        if (!tourId) return;
        window.location.hash = `tour-details?id=${encodeURIComponent(tourId)}`;
}

function handleInsightNavigation(insight) {
        if (!insight || !insight.id) return;

        sessionStorage.setItem(INSIGHT_STORAGE_KEY, JSON.stringify(insight));
        sessionStorage.setItem(INSIGHT_STORAGE_ID_KEY, insight.id);

        window.location.hash = `blog-detail?id=${encodeURIComponent(insight.id)}`;
}

function initializeEnhancements() {
        if ("IntersectionObserver" in window) {
                // Only create new instance if it doesn't exist
                if (!skeletonLoaderInstance) {
                        skeletonLoaderInstance = new SkeletonLazyLoader();
                }
                // Note: setupLazy is called from renderDestinationPage, not here
                refreshScrollReveal();
        } else {
                triggerLazyRefresh();
        }

        initVideoPlayer();
        initRippleEffects();
        initFilterTabs();
        initTestimonialsNavigation();
        initJoinButton();
}

function refreshScrollReveal() {
        if (!("IntersectionObserver" in window)) return;
        scrollRevealInstance = new ScrollReveal();
}

function triggerLazyRefresh() {
        if (skeletonLoaderInstance && typeof skeletonLoaderInstance.setupLazy === "function") {
                skeletonLoaderInstance.setupLazy();
                return;
        }

        if (!("IntersectionObserver" in window)) {
                document.querySelectorAll("img[data-src]").forEach((img) => {
                        if (!img.getAttribute("src")) {
                                const source = img.dataset.src || FALLBACKS.cardImage;
                                img.setAttribute("src", source);
                        }
                });
        }
}

function initVideoPlayer() {
        const playBtn = document.querySelector(".destination-detail-ready__play-btn");
        const videoSection = document.querySelector(".destination-detail-ready");
        const video = document.querySelector(".destination-detail-ready__video");

        if (!playBtn || !videoSection || !video) return;
        if (playBtn.dataset.bound === "true") return;

        playBtn.dataset.bound = "true";

        playBtn.addEventListener("click", (event) => {
                event.preventDefault();
                videoSection.classList.add("video-active");
                video.play();
                playBtn.style.display = "none";
        });

        video.addEventListener("ended", () => {
                videoSection.classList.remove("video-active");
                playBtn.style.display = "flex";
        });
}

function initJoinButton() {
        const joinButton = document.querySelector(".btn.btn--primary");
        if (!joinButton) return;

        joinButton.addEventListener("click", (event) => {
                event.preventDefault();
                const country = joinButton.dataset.country;
                if (country) {
                        // Navigate to tours page with country filter
                        window.location.hash = `tours?location=${encodeURIComponent(country)}`;
                } else {
                        // Fallback to tours page without filter
                        window.location.hash = "tours";
                }
        });
}

function initRippleEffects() {
        const buttons = document.querySelectorAll(
                ".destination-detail-pilgrimages__btn, .btn--primary, .destination-detail-cta__btn, .destination-detail-itinerary__button"
        );

        buttons.forEach((button) => {
                if (button.dataset.rippleBound === "true") return;

                button.dataset.rippleBound = "true";

                button.addEventListener("click", (event) => {
                        const rect = button.getBoundingClientRect();
                        const size = Math.max(rect.width, rect.height);
                        const ripple = document.createElement("span");
                        ripple.className = "ripple";

                        const clientX = event.clientX || rect.left + rect.width / 2;
                        const clientY = event.clientY || rect.top + rect.height / 2;

                        ripple.style.width = `${size}px`;
                        ripple.style.height = `${size}px`;
                        ripple.style.left = `${clientX - rect.left - size / 2}px`;
                        ripple.style.top = `${clientY - rect.top - size / 2}px`;

                        button.appendChild(ripple);
                        setTimeout(() => ripple.remove(), 600);
                });
        });
}

function initFilterTabs() {
        const tabs = document.querySelectorAll(".destination-detail-filter__tab");
        if (!tabs.length) return;

        tabs.forEach((tab) => {
                if (tab.dataset.bound === "true") return;
                tab.dataset.bound = "true";

                tab.addEventListener("click", function () {
                        tabs.forEach((item) => item.classList.remove("active"));
                        this.classList.add("active");
                });
        });
}

function showDestinationError() {
        const heroTitle = document.querySelector(".destination-detail-hero__title");
        if (heroTitle) {
                heroTitle.textContent = window.i18n
                        ? window.i18n.t("destinationDetail.error.title")
                        : "Không thể tải thông tin điểm đến";
        }

        const heroSubtitle = document.querySelector(".destination-detail-hero__subtitle");
        if (heroSubtitle) {
                heroSubtitle.textContent = window.i18n
                        ? window.i18n.t("destinationDetail.error.subtitle")
                        : "Vui lòng thử lại sau hoặc chọn một hành trình khác.";
        }

        const sections = document.querySelectorAll(
                ".destination-detail-popular, .destination-detail-mission, .destination-detail-ready, " +
                        ".destination-detail-pilgrimages, .destination-detail-cta, .destination-detail-insights, " +
                        ".destination-detail-testimonials"
        );

        sections.forEach((section) => {
                section.setAttribute("hidden", "true");
        });
}

window.addEventListener("scroll", () => {
        const hero = document.querySelector(".destination-detail-hero");
        if (hero) {
                const scrolled = window.pageYOffset;
                const parallax = scrolled * 0.5;
                hero.style.backgroundPositionY = `${parallax}px`;
        }
});

// ============================================
// I18N SUPPORT
// ============================================

// Translate page when loaded
if (window.i18n) {
        window.i18n.translatePage();
}

// Handle language change events
if (window.i18n && !window.destinationDetailLanguageHandlerRegistered) {
        window.destinationDetailLanguageHandlerRegistered = true;

        // Track the current language to detect actual changes
        let previousLang = window.i18n.getCurrentLanguage();
        let isReloading = false;

        window.i18n.subscribe((newLang) => {
                // Only reload if language actually changed (not initial call)
                if (newLang === previousLang || isReloading) {
                        console.log("Language unchanged or already reloading, skipping...");
                        return;
                }

                console.log("Language changed from", previousLang, "to:", newLang);
                previousLang = newLang;
                isReloading = true;

                // Reload destination data with new language
                const destinationId = window.currentPageParams?.id;

                if (destinationId) {
                        // Use async IIFE to handle promise without blocking
                        (async () => {
                                try {
                                        // Determine which data files to load based on language
                                        const dataFile = newLang === "en" ? "./data-en.json" : "./data-vi.json";
                                        const toursFile = newLang === "en" ? "./tours-en.json" : "./tours-vi.json";

                                        const [destinationsResponse, toursResponse] = await Promise.all([
                                                fetch(dataFile),
                                                fetch(toursFile),
                                        ]);

                                        if (destinationsResponse.ok && toursResponse.ok) {
                                                const destinationsJson = await destinationsResponse.json();
                                                const toursJson = await toursResponse.json();

                                                // Get destinations array from the correct property
                                                const destinations = Array.isArray(destinationsJson.data)
                                                        ? destinationsJson.data
                                                        : [];
                                                const tours = Array.isArray(toursJson.tours) ? toursJson.tours : [];

                                                const destination = destinations.find(
                                                        (d) => normalizeText(d.id) === normalizeText(destinationId)
                                                );

                                                if (destination) {
                                                        state.destination = destination;
                                                        state.tours = tours.filter(
                                                                (tour) => tour.destination_id === destination.id
                                                        );
                                                        state.insights = buildInsightsData(destination);

                                                        // Re-render all sections with new language data
                                                        renderHero(destination);
                                                        renderPopularPlaces(destination);
                                                        renderMission(destination);
                                                        renderPilgrimages(destination, state.tours);
                                                        renderCTA(destination);
                                                        renderInsights();
                                                        renderTestimonials(destination);

                                                        // Refresh lazy loading after all renders complete
                                                        requestAnimationFrame(() => {
                                                                if (skeletonLoaderInstance) {
                                                                        skeletonLoaderInstance.setupLazy();
                                                                }
                                                                isReloading = false;
                                                        });
                                                } else {
                                                        isReloading = false;
                                                }
                                        } else {
                                                isReloading = false;
                                        }

                                        // Translate static UI elements
                                        window.i18n.translatePage();
                                } catch (error) {
                                        console.error("Error reloading data for language change:", error);
                                        isReloading = false;
                                }
                        })();
                } else {
                        // Just translate static elements if no destination loaded yet
                        window.i18n.translatePage();
                        isReloading = false;
                }
        });
}
