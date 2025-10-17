// --- FAKE DATA ---
const toursData = [
        {
                id: 1,
                name: "Bali Paradise Getaway",
                location: "Indonesia",
                type: "Beach",
                duration: 7,
                price: 1200,
                rating: 4.8,
                reviewsCount: 120,
                image: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?q=80&w=400",
                tags: ["Bestseller"],
                inclusions: ["Flights", "Hotel", "Breakfast"],
                popularity: 120,
        },
        {
                id: 2,
                name: "Bangkok's Grand Palace & Temples",
                location: "Thailand",
                type: "Cultural",
                duration: 4,
                price: 850,
                rating: 4.6,
                reviewsCount: 95,
                image: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?q=80&w=400",
                tags: [],
                inclusions: ["Hotel", "Guide"],
                popularity: 95,
        },
        {
                id: 3,
                name: "Dubai Desert Safari Adventure",
                location: "UAE",
                type: "Adventure",
                duration: 1,
                price: 350,
                rating: 4.9,
                reviewsCount: 250,
                image: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?q=80&w=400",
                tags: ["Bestseller"],
                inclusions: ["4x4 Ride", "Dinner"],
                popularity: 250,
        },
        {
                id: 4,
                name: "Maldives Overwater Bungalow Dream",
                location: "Maldives",
                type: "Luxury",
                duration: 5,
                price: 3500,
                rating: 4.9,
                reviewsCount: 180,
                image: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?q=80&w=400",
                tags: ["Luxury"],
                inclusions: ["Flights", "All-inclusive"],
                popularity: 180,
        },
        {
                id: 5,
                name: "Chiang Mai Elephant Sanctuary",
                location: "Thailand",
                type: "Family",
                duration: 3,
                price: 600,
                rating: 4.7,
                reviewsCount: 150,
                image: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?q=80&w=400",
                tags: ["Eco-friendly"],
                inclusions: ["Hotel", "Guide", "Entry Fees"],
                popularity: 150,
        },
        {
                id: 6,
                name: "Ancient Rome & Colosseum Tour",
                location: "Italy",
                type: "Cultural",
                duration: 3,
                price: 950,
                rating: 4.8,
                reviewsCount: 300,
                image: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?q=80&w=400",
                tags: [],
                inclusions: ["Hotel", "Guide"],
                popularity: 300,
        },
        {
                id: 7,
                name: "Swiss Alps Scenic Train Journey",
                location: "Switzerland",
                type: "Adventure",
                duration: 8,
                price: 3200,
                rating: 5.0,
                reviewsCount: 190,
                image: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?q=80&w=400",
                tags: ["Bestseller", "Luxury"],
                inclusions: ["Train Tix", "Hotel"],
                popularity: 190,
        },
        {
                id: 8,
                name: "Santorini Sunset & Volcano Cruise",
                location: "Greece",
                type: "Beach",
                duration: 1,
                price: 250,
                rating: 4.9,
                reviewsCount: 450,
                image: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?q=80&w=400",
                tags: [],
                inclusions: ["Boat Trip", "Dinner"],
                popularity: 450,
        },
        {
                id: 9,
                name: "Kyoto Cherry Blossom Discovery",
                location: "Japan",
                type: "Cultural",
                duration: 5,
                price: 1800,
                rating: 4.9,
                reviewsCount: 220,
                image: "https://images.unsplash.com/photo-1522383225653-ed111181a951?q=80&w=400",
                tags: ["Seasonal"],
                inclusions: ["Hotel", "Guide"],
                popularity: 220,
        },
        {
                id: 10,
                name: "NYC Broadway & City Lights",
                location: "USA",
                type: "City Tour",
                duration: 4,
                price: 1500,
                rating: 4.7,
                reviewsCount: 110,
                image: "https://images.unsplash.com/photo-1522383225653-ed111181a951?q=80&w=400",
                tags: [],
                inclusions: ["Hotel", "Show Tickets"],
                popularity: 110,
        },
        {
                id: 11,
                name: "Grand Canyon Helicopter Tour",
                location: "USA",
                type: "Adventure",
                duration: 1,
                price: 450,
                rating: 4.9,
                reviewsCount: 320,
                image: "https://images.unsplash.com/photo-1522383225653-ed111181a951?q=80&w=400",
                tags: [],
                inclusions: ["Helicopter Ride"],
                popularity: 320,
        },
        {
                id: 12,
                name: "Pyramids of Giza & Nile Cruise",
                location: "Egypt",
                type: "Cultural",
                duration: 10,
                price: 2800,
                rating: 4.8,
                reviewsCount: 160,
                image: "https://images.unsplash.com/photo-1522383225653-ed111181a951?q=80&w=400",
                tags: ["Bestseller"],
                inclusions: ["Flights", "Cruise", "Guide"],
                popularity: 160,
        },
];

// --- STATE VARIABLES ---
let currentPage = 1;
const toursPerPage = 6;
let filteredTours = [...toursData];
let wishlist = new Set(JSON.parse(localStorage.getItem("tourWishlist")) || []);
let debounceTimer;

// --- DOM Elements ---
const tourGrid = document.getElementById("tour-grid");
const filterForm = document.getElementById("filter-form");
const keywordInput = document.getElementById("keyword-search");
const priceRange = document.getElementById("price-range");
const priceValue = document.getElementById("price-value");
const typeFilterContainer = document.getElementById("type-filter");
const durationFilterContainer = document.getElementById("duration-filter");
const sortSelect = document.getElementById("sort-by");
const resultCount = document.querySelector(".result-controls__count");
const gridViewBtn = document.getElementById("grid-view-btn");
const listViewBtn = document.getElementById("list-view-btn");
const paginationContainer = document.getElementById("pagination-container");
const resetFiltersBtn = document.getElementById("reset-filters-btn");

// --- RENDER FUNCTIONS ---

function renderSkeletonCards() {
        if (!tourGrid) return;
        tourGrid.innerHTML = "";

        // Tạo ra số lượng skeleton bằng với số tour mỗi trang
        for (let i = 0; i < toursPerPage; i++) {
                const skeletonCard = document.createElement("div");
                // Sử dụng class của thẻ thật và thêm một class định danh 'is-skeleton'
                skeletonCard.className = "tour-card is-skeleton";
                skeletonCard.setAttribute("aria-hidden", "true");

                skeletonCard.innerHTML = `
                <div class="tour-card__image-wrapper">
                    <div class="skeleton-placeholder"></div>
                </div>
                <div class="tour-card__content">
                    <div class="tour-card__meta">
                        <div class="skeleton-placeholder text"></div>
                    </div>
                    <a href="#tour-details" class="tour-card__title-link">
                         <h3 class="tour-card__title">
                            <div class="skeleton-placeholder text"></div>
                            <div class="skeleton-placeholder text short"></div>
                        </h3>
                    </a>
                    <div class="tour-card__rating">
                        <div class="skeleton-placeholder text"></div>
                    </div>
                    <div class="tour-card__inclusions">
                         <div class="skeleton-placeholder text"></div>
                    </div>
                    <div class="tour-card__footer">
                        <div>
                             <div class="skeleton-placeholder price"></div>
                        </div>
                        <div class="skeleton-placeholder button"></div>
                    </div>
                </div>
            `;
                tourGrid.appendChild(skeletonCard);
        }
}

function renderTours() {
        if (!tourGrid) return;
        tourGrid.innerHTML = "";

        const startIndex = (currentPage - 1) * toursPerPage;
        const toursToRender = filteredTours.slice(startIndex, startIndex + toursPerPage);

        if (toursToRender.length === 0) {
                tourGrid.innerHTML = `<div class="no-tours-found"><i class="fas fa-search"></i><h3>No Tours Found</h3><p>Try adjusting your search filters or resetting them.</p></div>`;
                return;
        }

        toursToRender.forEach((tour) => {
                const tourCard = document.createElement("div");
                tourCard.className = "tour-card";

                const fullStars = Math.floor(tour.rating);
                const halfStar = tour.rating % 1 !== 0;
                let starsHTML = Array(fullStars).fill('<i class="fas fa-star"></i>').join("");
                if (halfStar) starsHTML += '<i class="fas fa-star-half-alt"></i>';
                starsHTML += Array(5 - Math.ceil(tour.rating))
                        .fill('<i class="far fa-star"></i>')
                        .join("");

                const inclusionsMap = {
                        Flights: "fa-plane",
                        Hotel: "fa-hotel",
                        Breakfast: "fa-mug-saucer",
                        Guide: "fa-user",
                        Dinner: "fa-utensils",
                        "4x4 Ride": "fa-car",
                        "Train Tix": "fa-train",
                        "Boat Trip": "fa-ship",
                        "Show Tickets": "fa-ticket",
                        "Helicopter Ride": "fa-helicopter",
                        Cruise: "fa-ship",
                };
                const inclusionsHTML = tour.inclusions
                        .slice(0, 3)
                        .map((item) => `<span><i class="fas ${inclusionsMap[item] || "fa-check"}"></i> ${item}</span>`)
                        .join("");

                const tagsHTML = tour.tags
                        .map(
                                (tag) =>
                                        `<span class="tour-card__tag tour-card__tag--${tag.replace(
                                                /\s+/g,
                                                "-"
                                        )}">${tag}</span>`
                        )
                        .join("");

                tourCard.innerHTML = `
                    <div class="tour-card__image-wrapper">
                        <img src="${tour.image}" alt="${tour.name}" class="tour-card__image" loading="lazy">
                        <div class="tour-card__tags">${tagsHTML}</div>
                        <button class="tour-card__wishlist-btn ${
                                wishlist.has(tour.id) ? "active" : ""
                        }" data-tour-id="${tour.id}" aria-label="Add to wishlist">
                            <i class="fas fa-heart"></i>
                        </button>
                    </div>
                    <div class="tour-card__content">
                        <div class="tour-card__meta">
                           <span class="tour-card__location"><i class="fas fa-map-marker-alt"></i> ${
                                   tour.location
                           }</span>
                           <span class="tour-card__duration"><i class="fas fa-clock"></i> ${tour.duration} Day${
                        tour.duration > 1 ? "s" : ""
                }</span>
                        </div>
                        <a href="#tour-details" class="tour-card__title-link"><h3 class="tour-card__title">${
                                tour.name
                        }</h3></a>
                        <div class="tour-card__rating">${starsHTML} <span class="tour-card__rating-count">(${
                        tour.reviewsCount
                })</span></div>
                        <div class="tour-card__inclusions">${inclusionsHTML}</div>
                        <div class="tour-card__footer">
                            <div>
                                <p class="tour-card__price-from">From</p>
                                <p class="tour-card__price-value">$${tour.price.toLocaleString()}</p>
                            </div>
                            <a href="#tour-details" class="tour-card__details-btn">View Details</a>
                        </div>
                    </div>
                `;
                tourGrid.appendChild(tourCard);
        });
}

function renderPagination() {
        if (!paginationContainer) return;
        paginationContainer.innerHTML = "";
        const totalPages = Math.ceil(filteredTours.length / toursPerPage);

        if (totalPages <= 1) return;

        for (let i = 1; i <= totalPages; i++) {
                const button = document.createElement("button");
                button.innerText = i;
                if (i === currentPage) {
                        button.classList.add("active");
                }
                button.addEventListener("click", () => {
                        currentPage = i;
                        updateUI();
                        window.scrollTo({ top: tourGrid.offsetTop - 100, behavior: "smooth" });
                });
                paginationContainer.appendChild(button);
        }
}

function updateUI() {
        renderTours();
        renderPagination();

        const startIndex = (currentPage - 1) * toursPerPage + 1;
        const endIndex = Math.min(startIndex + toursPerPage - 1, filteredTours.length);
        if (filteredTours.length > 0) {
                resultCount.textContent = `Showing ${startIndex}-${endIndex} of ${filteredTours.length} tours`;
        } else {
                resultCount.textContent = `Showing 0 tours`;
        }
}

// --- LOGIC FUNCTIONS ---
function applyFiltersAndSort() {
        renderSkeletonCards(); // Show loading state

        setTimeout(() => {
                // Simulate network delay for UX
                let tempTours = [...toursData];

                // Keyword filter
                const keyword = keywordInput.value.toLowerCase().trim();
                if (keyword) {
                        tempTours = tempTours.filter(
                                (tour) =>
                                        tour.name.toLowerCase().includes(keyword) ||
                                        tour.location.toLowerCase().includes(keyword)
                        );
                }

                // Price filter
                const maxPrice = parseInt(priceRange.value);
                tempTours = tempTours.filter((tour) => tour.price <= maxPrice);

                // Type filter (checkboxes)
                const checkedTypes = [...typeFilterContainer.querySelectorAll("input:checked")].map((cb) => cb.value);
                if (checkedTypes.length > 0) {
                        tempTours = tempTours.filter((tour) => checkedTypes.includes(tour.type));
                }

                // Duration filter (radios)
                const selectedDuration = durationFilterContainer.querySelector("input:checked").value;
                if (selectedDuration !== "all") {
                        const [min, max] = selectedDuration.split("-").map(Number);
                        if (max) {
                                tempTours = tempTours.filter((tour) => tour.duration >= min && tour.duration <= max);
                        } else {
                                tempTours = tempTours.filter((tour) => tour.duration >= min); // For '11+'
                        }
                }

                // Sorting logic
                const sortBy = sortSelect.value;
                switch (sortBy) {
                        case "price-asc":
                                tempTours.sort((a, b) => a.price - b.price);
                                break;
                        case "price-desc":
                                tempTours.sort((a, b) => b.price - a.price);
                                break;
                        case "rating-desc":
                                tempTours.sort((a, b) => b.rating - a.rating);
                                break;
                        case "default":
                        default:
                                tempTours.sort((a, b) => b.popularity - a.popularity);
                                break;
                }

                filteredTours = tempTours;
                currentPage = 1;
                updateUI();
        }, 400); // Debounce time
}

// --- POPULATE FILTERS ---
function populateFilters() {
        const types = [...new Set(toursData.map((t) => t.type))];
        typeFilterContainer.innerHTML = types
                .map(
                        (type) => `
                <label>
                    <input type="checkbox" name="type" value="${type}"> ${type}
                </label>
            `
                )
                .join("");

        const durations = [
                { label: "Any", value: "all" },
                { label: "1-5 Days", value: "1-5" },
                { label: "6-10 Days", value: "6-10" },
                { label: "11+ Days", value: "11" },
        ];
        durationFilterContainer.innerHTML = durations
                .map(
                        (d, index) => `
                <label>
                    <input type="radio" name="duration" value="${d.value}" ${index === 0 ? "checked" : ""}> ${d.label}
                </label>
            `
                )
                .join("");
}

// --- EVENT LISTENERS ---

// Debounce function
function debounce(func, delay) {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(func, delay);
}

filterForm.addEventListener("input", (e) => {
        if (e.target.id === "price-range") {
                priceValue.textContent = `$${e.target.value}`;
        }
        debounce(applyFiltersAndSort, 400);
});

sortSelect.addEventListener("change", applyFiltersAndSort);

resetFiltersBtn.addEventListener("click", () => {
        filterForm.reset();
        priceValue.textContent = `$${priceRange.max}`; // Reset price label
        applyFiltersAndSort();
});

tourGrid.addEventListener("click", (e) => {
        const btn = e.target.closest(".tour-card__wishlist-btn");
        if (btn) {
                const tourId = parseInt(btn.dataset.tourId);
                btn.classList.toggle("active");
                if (wishlist.has(tourId)) {
                        wishlist.delete(tourId);
                } else {
                        wishlist.add(tourId);
                }
                localStorage.setItem("tourWishlist", JSON.stringify([...wishlist]));
        }
});

gridViewBtn.addEventListener("click", () => {
        tourGrid.classList.remove("list-view");
        gridViewBtn.classList.add("active");
        listViewBtn.classList.remove("active");
});

listViewBtn.addEventListener("click", () => {
        tourGrid.classList.add("list-view");
        listViewBtn.classList.add("active");
        gridViewBtn.classList.remove("active");
});

// --- INITIAL LOAD ---
function initialLoad() {
        populateFilters();
        applyFiltersAndSort(); // Use the main function for initial render
}

initialLoad();
