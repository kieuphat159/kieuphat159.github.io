// --- EXPANDED FAKE DATA ---
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
                image: "...",
                tags: ["Bestseller"],
                inclusions: ["Flights", "Hotel", "Breakfast"],
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
                image: "...",
                tags: [],
                inclusions: ["Hotel", "Guide"],
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
                image: "...",
                tags: ["Bestseller"],
                inclusions: ["4x4 Ride", "Dinner"],
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
                image: "...",
                tags: ["Luxury"],
                inclusions: ["Flights", "All-inclusive"],
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
                image: "...",
                tags: ["Eco-friendly"],
                inclusions: ["Hotel", "Guide", "Entry Fees"],
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
                image: "...",
                tags: [],
                inclusions: ["Hotel", "Guide"],
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
                image: "...",
                tags: ["Bestseller", "Luxury"],
                inclusions: ["Train Tix", "Hotel"],
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
                image: "...",
                tags: [],
                inclusions: ["Boat Trip", "Dinner"],
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
                image: "...",
                tags: ["Seasonal"],
                inclusions: ["Hotel", "Guide"],
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
                image: "...",
                tags: [],
                inclusions: ["Hotel", "Show Tickets"],
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
                image: "...",
                tags: [],
                inclusions: ["Helicopter Ride"],
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
                image: "...",
                tags: ["Bestseller"],
                inclusions: ["Flights", "Cruise", "Guide"],
        },
];

let currentPage = 1;
const toursPerPage = 6;
let filteredTours = [...toursData];
let wishlist = new Set(JSON.parse(localStorage.getItem("tourWishlist")) || []);

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
const paginationContainer = document.querySelector(".pagination");

// --- RENDER FUNCTIONS ---
function renderTours() {
        if (!tourGrid) return;
        tourGrid.innerHTML = "";
        const startIndex = (currentPage - 1) * toursPerPage;
        const toursToRender = filteredTours.slice(startIndex, startIndex + toursPerPage);

        if (toursToRender.length === 0) {
                tourGrid.innerHTML = `<div class="no-tours-found"><h3>No Tours Found</h3><p>Try adjusting your search filters.</p></div>`;
                return;
        }

        toursToRender.forEach((tour) => {
                const tourCard = document.createElement("div"); // Use DIV, not A
                tourCard.className = "tour-card";

                // Generate rating stars
                const fullStars = Math.floor(tour.rating);
                const halfStar = tour.rating % 1 !== 0;
                let starsHTML = Array(fullStars).fill('<i class="fas fa-star"></i>').join("");
                if (halfStar) starsHTML += '<i class="fas fa-star-half-alt"></i>';
                starsHTML += Array(5 - Math.ceil(tour.rating))
                        .fill('<i class="far fa-star"></i>')
                        .join("");

                // Generate inclusions
                const inclusionsMap = {
                        Flights: "fa-plane",
                        Hotel: "fa-hotel",
                        Breakfast: "fa-coffee",
                        Guide: "fa-user",
                        Dinner: "fa-utensils",
                };
                const inclusionsHTML = tour.inclusions
                        .slice(0, 3)
                        .map((item) => `<span><i class="fas ${inclusionsMap[item] || "fa-check"}"></i> ${item}</span>`)
                        .join("");

                tourCard.innerHTML = `
                <div class="tour-card__image-wrapper">
                    <img src="${tour.image}" alt="${tour.name}" class="tour-card__image">
                    <button class="tour-card__wishlist-btn ${wishlist.has(tour.id) ? "active" : ""}" data-tour-id="${
                        tour.id
                }" aria-label="Add to wishlist">
                        <i class="fas fa-heart"></i>
                    </button>
                </div>
                <div class="tour-card__content">
                    <p class="tour-card__location">${tour.location}</p>
                    <h3 class="tour-card__title">${tour.name}</h3>
                    <div class="tour-card__rating">${starsHTML} <span class="tour-card__rating-count">(${
                        tour.reviewsCount
                })</span></div>
                    <div class="tour-card__inclusions">${inclusionsHTML}</div>
                    <div class="tour-card__footer">
                        <div>
                            <p class="tour-card__price-from">From</p>
                            <p class="tour-card__price-value">$${tour.price}</p>
                        </div>
                        <a href="#" class="tour-card__details-btn">View Details</a>
                    </div>
                </div>
            `;
                tourGrid.appendChild(tourCard);
        });
}

// ... (renderPagination, renderSkeletonCards can remain similar)

// --- LOGIC FUNCTIONS ---
function applyFiltersAndSort() {
        // Filter logic here (for keyword, price, checkboxes, radios)
        // Sort logic here

        filteredTours = tempTours;
        currentPage = 1;
        updateUI();
}

// --- POPULATE FILTERS ---
function populateFilters() {
        // Populate Tour Types (checkboxes)
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

        // Populate Duration (radios)
        const durations = [
                { label: "Any", value: "all" },
                { label: "1-5 Days", value: "1-5" },
                { label: "6-10 Days", value: "6-10" },
                { label: "10+ Days", value: "11" },
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
filterForm.addEventListener("input", debounce(applyFiltersAndSort, 400));
sortSelect.addEventListener("change", applyFiltersAndSort);

// Wishlist
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

// View Toggle
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

// ... (Pagination event listeners remain similar)

// --- INITIAL LOAD ---
function initialLoad() {
        populateFilters();
        applyFiltersAndSort();
}

initialLoad();

// Helper debounce function
function debounce(func, delay) {
        setTimeout(func, delay);
}
