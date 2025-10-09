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
                image: "https://images.unsplash.com/photo-1528181304800-259b08848526?q=80&w=800",
        },
        {
                id: 2,
                name: "Bangkok City & Temples",
                location: "Thailand",
                type: "City Tour",
                duration: 4,
                price: 850,
                rating: 4.6,
                image: "https://images.unsplash.com/photo-1528181304800-259b08848526?q=80&w=800",
        },
        {
                id: 3,
                name: "Dubai Desert Safari",
                location: "UAE",
                type: "Adventure",
                duration: 1,
                price: 350,
                rating: 4.9,
                image: "https://images.unsplash.com/photo-1528181304800-259b08848526?q=80&w=800",
        },
        {
                id: 4,
                name: "Maldives Overwater Bungalow Experience",
                location: "Maldives",
                type: "Beach",
                duration: 5,
                price: 2500,
                rating: 4.9,
                image: "https://images.unsplash.com/photo-1528181304800-259b08848526?q=80&w=800",
        },
        {
                id: 5,
                name: "Chiang Mai Mountain Trek",
                location: "Thailand",
                type: "Adventure",
                duration: 3,
                price: 600,
                rating: 4.7,
                image: "https://images.unsplash.com/photo-1528181304800-259b08848526?q=80&w=800",
        },
        {
                id: 6,
                name: "Ancient Rome Discovery",
                location: "Italy",
                type: "City Tour",
                duration: 3,
                price: 950,
                rating: 4.8,
                image: "https://images.unsplash.com/photo-1528181304800-259b08848526?q=80&w=800",
        },
        {
                id: 7,
                name: "Swiss Alps Scenic Train Journey",
                location: "Switzerland",
                type: "Adventure",
                duration: 8,
                price: 3200,
                rating: 5.0,
                image: "https://images.unsplash.com/photo-1528181304800-259b08848526?q=80&w=800",
        },
        {
                id: 8,
                name: "Santorini Sunset Cruise",
                location: "Greece",
                type: "Beach",
                duration: 1,
                price: 250,
                rating: 4.9,
                image: "https://images.unsplash.com/photo-1528181304800-259b08848526?q=80&w=800",
        },
        {
                id: 9,
                name: "Kyoto Cherry Blossom Tour",
                location: "Japan",
                type: "City Tour",
                duration: 5,
                price: 1800,
                rating: 4.9,
                image: "https://images.unsplash.com/photo-1528181304800-259b08848526?q=80&w=800",
        },
];

let currentPage = 1;
const toursPerPage = 6;
let filteredTours = [...toursData];

const tourGrid = document.querySelector(".tour-grid");
const paginationList = document.querySelector(".pagination__list");
const searchForm = document.querySelector(".tours-search__form");
const sortSelect = document.getElementById("sort-by");
const resultCount = document.querySelector(".result-controls__count");

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
                // ✨ THAY ĐỔI 1: Tạo thẻ <a> thay vì <article>
                const tourCard = document.createElement("a");
                tourCard.className = "tour-card";
                tourCard.href = `#tour-details`; // Đặt link cho thẻ

                // ✨ THAY ĐỔI 2: Cập nhật lại cấu trúc innerHTML (bỏ thẻ <a> con bên trong)
                tourCard.innerHTML = `
                <div class="tour-card__image-wrapper">
                    <img src="${tour.image}" alt="${tour.name}" class="tour-card__image">
                </div>
                <div class="tour-card__content">
                    <p class="tour-card__location">${tour.location}</p>
                    <h3 class="tour-card__title">${tour.name}</h3>
                    <div class="tour-card__rating">
                        ${'<i class="fas fa-star"></i>'.repeat(Math.floor(tour.rating))}
                        ${tour.rating % 1 !== 0 ? '<i class="fas fa-star-half-alt"></i>' : ""}
                        <span>${tour.rating.toFixed(1)}</span>
                    </div>
                    <div class="tour-card__footer">
                        <p class="tour-card__price">$${tour.price} <span>/ person</span></p>
                        <p class="tour-card__duration"><i class="far fa-clock"></i> ${tour.duration} days</p>
                    </div>
                </div>
            `;
                tourGrid.appendChild(tourCard);
        });
}

function renderPagination() {
        if (!paginationList) return;
        paginationList.innerHTML = "";
        const totalPages = Math.ceil(filteredTours.length / toursPerPage);
        if (totalPages <= 1) return;

        paginationList.insertAdjacentHTML(
                "beforeend",
                `<li><button class="pagination__link ${
                        currentPage === 1 ? "pagination__link--disabled" : ""
                }" data-page="prev">&laquo;</button></li>`
        );
        for (let i = 1; i <= totalPages; i++) {
                paginationList.insertAdjacentHTML(
                        "beforeend",
                        `<li><button class="pagination__link ${
                                i === currentPage ? "pagination__link--active" : ""
                        }" data-page="${i}">${i}</button></li>`
                );
        }
        paginationList.insertAdjacentHTML(
                "beforeend",
                `<li><button class="pagination__link ${
                        currentPage === totalPages ? "pagination__link--disabled" : ""
                }" data-page="next">&raquo;</button></li>`
        );
}

function renderSkeletonCards() {
        if (!tourGrid) return;
        tourGrid.innerHTML = "";
        for (let i = 0; i < toursPerPage; i++) {
                const skeletonCard = document.createElement("article");
                skeletonCard.className = "skeleton-card";

                skeletonCard.innerHTML = `
                <div class="skeleton skeleton-image"></div>
                <div class="skeleton-content">
                    <div class="skeleton skeleton-location"></div>
                    <div class="skeleton skeleton-title"></div>
                    <div class="skeleton skeleton-rating"></div>
                    <div class="skeleton-footer">
                        <div class="skeleton skeleton-price"></div>
                        <div class="skeleton skeleton-duration"></div>
                    </div>
                </div>
            `;
                tourGrid.appendChild(skeletonCard);
        }
}

function applyFiltersAndSort() {
        let tempTours = [...toursData];

        if (searchForm) {
                const formData = new FormData(searchForm);
                const location = formData.get("location");
                const type = formData.get("type");
                const durationValue = formData.get("duration");

                tempTours = tempTours.filter((tour) => {
                        const matchesLocation = location === "all" || tour.location === location;
                        const matchesType = type === "all" || tour.type === type;
                        let matchesDuration = true;
                        if (durationValue && durationValue !== "all") {
                                const duration = parseInt(durationValue, 10);
                                matchesDuration = duration === 11 ? tour.duration > 10 : tour.duration <= duration;
                        }
                        return matchesLocation && matchesType && matchesDuration;
                });
        }

        if (sortSelect) {
                const sortValue = sortSelect.value;
                if (sortValue === "price-asc") tempTours.sort((a, b) => a.price - b.price);
                else if (sortValue === "price-desc") tempTours.sort((a, b) => b.price - a.price);
                else if (sortValue === "rating-desc") tempTours.sort((a, b) => b.rating - a.rating);
        }

        filteredTours = tempTours;
        currentPage = 1;
        updateUI();
}

function updateUI() {
        renderSkeletonCards();
        setTimeout(() => {
                const startIndex = (currentPage - 1) * toursPerPage;
                const endIndex = Math.min(startIndex + toursPerPage, filteredTours.length);
                if (resultCount) {
                        resultCount.textContent = `Showing ${
                                filteredTours.length > 0 ? startIndex + 1 : 0
                        }-${endIndex} of ${filteredTours.length} tours`;
                }
                renderTours();
                renderPagination();
        }, 500);
}

if (searchForm) {
        searchForm.addEventListener("submit", (e) => {
                e.preventDefault();
                applyFiltersAndSort();
        });
}

if (sortSelect) {
        sortSelect.addEventListener("change", applyFiltersAndSort);
}

if (paginationList) {
        paginationList.addEventListener("click", (e) => {
                if (e.target.tagName === "BUTTON" && !e.target.classList.contains("pagination__link--disabled")) {
                        const page = e.target.dataset.page;
                        if (page === "prev") currentPage--;
                        else if (page === "next") currentPage++;
                        else currentPage = parseInt(page);

                        const gridSection = document.querySelector(".tours-grid-section");
                        if (gridSection) {
                                gridSection.scrollIntoView({ behavior: "smooth", block: "start" });
                        }
                        updateUI();
                }
        });
}

applyFiltersAndSort();
