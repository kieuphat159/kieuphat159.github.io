// --- DATA LOADING ---
let toursData = [];
let destinationsMap = {};

// Load tours and destinations data
async function loadToursData() {
        try {
                // Load tours data
                const toursResponse = await fetch("./tours.json");
                const toursJson = await toursResponse.json();

                // Load destinations data for country mapping
                const dataResponse = await fetch("./data.json");
                const dataJson = await dataResponse.json();

                // Create destination map for quick lookup
                dataJson.data.forEach((dest) => {
                        destinationsMap[dest.id] = dest.country;
                });

                // Transform tours data to match expected format
                toursData = toursJson.tours.map((tour) => {
                        // Get location from destination map
                        const location = destinationsMap[tour.destination_id] || tour.destination_id;

                        // Generate inclusions from services and transport
                        const inclusions = [];
                        if (tour.transport && tour.transport.includes("Máy bay")) inclusions.push("Flights");
                        if (tour.services.hotel) inclusions.push("Hotel");
                        if (
                                tour.services.meals &&
                                (tour.services.meals.includes("Ăn sáng") || tour.services.meals.includes("3 bữa"))
                        )
                                inclusions.push("Breakfast");
                        if (tour.services.guide) inclusions.push("Guide");
                        if (tour.transport && (tour.transport.includes("Tàu") || tour.transport.includes("Shinkansen")))
                                inclusions.push("Train Tix");
                        if (tour.transport && tour.transport.includes("Xe du lịch")) inclusions.push("4x4 Ride");

                        // Generate tags based on discount
                        const tags = [];
                        if (tour.discount_percent >= 10) tags.push("Bestseller");
                        if (tour.rating >= 4.9) tags.push("Luxury");

                        // Calculate popularity (dummy based on rating and duration)
                        const popularity = Math.round(tour.rating * 50 + tour.duration_days * 10);

                        return {
                                id: tour.id,
                                name: tour.title,
                                location: location,
                                type: tour.type,
                                duration: tour.duration_days,
                                price: Math.round(tour.price / 25000), // Convert VND to USD (approx rate)
                                rating: tour.rating,
                                reviewsCount: popularity, // Use popularity as reviews count
                                image: tour.main_image,
                                tags: tags,
                                inclusions: inclusions,
                                popularity: popularity,
                        };
                });
        } catch (error) {
                console.error("Error loading tours data:", error);
                toursData = []; // Set empty array on error
        }
}

// --- STATE VARIABLES ---
let currentPage = 1;
const toursPerPage = 6;
let filteredTours = [];
let wishlist = new Set(JSON.parse(localStorage.getItem("tourWishlist")) || []);
let debounceTimer;

// --- DOM Elements ---
const tourGrid = document.getElementById("tour-grid");
const filterForm = document.getElementById("filter-form");
const keywordInput = document.getElementById("keyword-search");
const priceRange = document.getElementById("price-range");
const priceValue = document.getElementById("price-value");
const typeFilterGroup = document.getElementById("type-filter-group");
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
                        <a href="#tour-details?id=${
                                tour.id
                        }" class="tour-card__title-link"><h3 class="tour-card__title">${tour.name}</h3></a>
                        <div class="tour-card__rating">${starsHTML} <span class="tour-card__rating-count">(${
                        tour.reviewsCount
                })</span></div>
                        <div class="tour-card__inclusions">${inclusionsHTML}</div>
                        <div class="tour-card__footer">
                            <div>
                                <p class="tour-card__price-from">From</p>
                                <p class="tour-card__price-value">$${tour.price.toLocaleString()}</p>
                            </div>
                            <a href="#tour-details?id=${tour.id}" class="tour-card__details-btn">View Details</a>
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

                // Type filter - check all checked inputs
                const allCheckedInputs = [...typeFilterGroup.querySelectorAll("input:checked")];
                const checkedTypes = allCheckedInputs
                        .filter((cb) => cb.name === "type-filter") // Only process type-filter checkboxes
                        .map((cb) => cb.value);

                if (checkedTypes.length > 0) {
                        // Check if any of the checked types is a main category or a full type
                        tempTours = tempTours.filter((tour) => {
                                const tourMainCategory = tour.type.split(" - ")[0];
                                // Match if the checked type is the full tour type OR is the main category
                                return checkedTypes.some((checkedType) => {
                                        return checkedType === tour.type || checkedType === tourMainCategory;
                                });
                        });
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
        // Group types by main category
        const typeGroups = {};
        toursData.forEach((tour) => {
                const parts = tour.type.split(" - ");
                const mainCategory = parts[0];
                const hasSubtype = parts.length > 1;

                if (!typeGroups[mainCategory]) {
                        typeGroups[mainCategory] = [];
                }

                // Add full type string to the group
                if (!typeGroups[mainCategory].includes(tour.type)) {
                        typeGroups[mainCategory].push(tour.type);
                }
        });

        // Populate type filters with nested structure
        typeFilterGroup.innerHTML = "";

        Object.keys(typeGroups).forEach((mainType) => {
                const mainLabel = document.createElement("label");
                mainLabel.innerHTML = `
                        <input type="checkbox" name="type-filter" value="${mainType}"> ${mainType}
                `;
                typeFilterGroup.appendChild(mainLabel);

                // Check if this main type has subtypes (types with " - " separator)
                const hasSubtypes = typeGroups[mainType].some((type) => type.includes(" - "));

                if (hasSubtypes) {
                        // Create a container for subtypes
                        const subtypeContainer = document.createElement("div");
                        subtypeContainer.className = "filter-widget__subtype";
                        subtypeContainer.style.display = "none";

                        // Create subtypes for this main category
                        typeGroups[mainType].forEach((fullType) => {
                                if (fullType.includes(" - ")) {
                                        const parts = fullType.split(" - ");
                                        const subcategory = parts.slice(1).join(" - ");
                                        const subtypeLabel = document.createElement("label");
                                        subtypeLabel.innerHTML = `
                                                <input type="checkbox" name="type-filter" value="${fullType}"> ${subcategory}
                                        `;
                                        subtypeContainer.appendChild(subtypeLabel);

                                        // Add event listener for subtype
                                        const subCheckbox = subtypeLabel.querySelector("input");
                                        subCheckbox.addEventListener("change", () => {
                                                applyFiltersAndSort();
                                        });
                                }
                        });

                        typeFilterGroup.appendChild(subtypeContainer);

                        // Add event listener to toggle subtypes
                        const mainCheckbox = mainLabel.querySelector("input");
                        mainCheckbox.addEventListener("change", function () {
                                if (this.checked) {
                                        subtypeContainer.style.display = "block";
                                } else {
                                        subtypeContainer.style.display = "none";
                                        // Also uncheck all subtypes
                                        subtypeContainer.querySelectorAll("input").forEach((subInput) => {
                                                subInput.checked = false;
                                        });
                                }
                                applyFiltersAndSort();
                        });
                } else {
                        // Add event listener for main type checkbox if no subtypes
                        const mainCheckbox = mainLabel.querySelector("input");
                        mainCheckbox.addEventListener("change", () => {
                                applyFiltersAndSort();
                        });
                }
        });

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
        // Hide all subtype containers
        document.querySelectorAll(".filter-widget__subtype").forEach((subtypeContainer) => {
                subtypeContainer.style.display = "none";
        });
        applyFiltersAndSort();
});

tourGrid.addEventListener("click", (e) => {
        const btn = e.target.closest(".tour-card__wishlist-btn");
        if (btn) {
                const tourId = btn.dataset.tourId; // Keep as string
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
async function initialLoad() {
        await loadToursData(); // Load data first
        filteredTours = [...toursData]; // Initialize filtered tours
        populateFilters();
        applyFiltersAndSort(); // Use the main function for initial render
}

initialLoad();
