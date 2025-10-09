const blogPosts = [
        {
                id: 1,
                image: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?q=80&w=800",
                title: "On the Shores of a Pink Lake in Australia",
                description:
                        "Experience the surreal beauty of Lake Hillier, a vibrant pink lake that defies explanation. A must-see natural wonder.",
                author: { name: "Jane Doe", avatar: "https://i.pravatar.cc/32?u=jane" },
                date: "October 1, 2025",
                category: "Nature",
        },
        {
                id: 2,
                image: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?q=80&w=800",
                title: "Exploring Argentina and Chile by Bus",
                description:
                        "A comprehensive guide to backpacking through Patagonia. Discover stunning mountains, glaciers, and vibrant city life.",
                author: { name: "Alex Wanderlust", avatar: "https://i.pravatar.cc/32?u=alex" },
                date: "September 28, 2025",
                category: "Adventure",
        },
        {
                id: 3,
                image: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?q=80&w=800",
                title: "The Hidden Temples of Kyoto",
                description:
                        "Escape the crowds and find tranquility in the lesser-known temples of Kyoto. A spiritual journey awaits.",
                author: { name: "Kenji Tanaka", avatar: "https://i.pravatar.cc/32?u=kenji" },
                date: "September 25, 2025",
                category: "Culture",
        },
        {
                id: 4,
                image: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?q=80&w=800",
                title: "A Culinary Tour of Ho Chi Minh City",
                description:
                        "From street food stalls to high-end restaurants, explore the vibrant and delicious food scene of Vietnam's southern hub.",
                author: { name: "Linh Nguyen", avatar: "https://i.pravatar.cc/32?u=linh" },
                date: "September 20, 2025",
                category: "Food",
        },
        {
                id: 5,
                image: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?q=80&w=800",
                title: "Navigating the Grand Canal of Venice",
                description:
                        "Tips and tricks for exploring the heart of Venice by gondola and vaporetto. Avoid the tourist traps!",
                author: { name: "Marco Rossi", avatar: "https://i.pravatar.cc/32?u=marco" },
                date: "September 18, 2025",
                category: "City Guide",
        },
        {
                id: 6,
                image: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?q=80&w=800",
                title: "Sunrise over the Sahara Desert",
                description:
                        "A breathtaking experience of watching the sun rise over the endless dunes of the Sahara. A memory that lasts a lifetime.",
                author: { name: "Aisha Bakar", avatar: "https://i.pravatar.cc/32?u=aisha" },
                date: "September 15, 2025",
                category: "Adventure",
        },
        {
                id: 7,
                image: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?q=80&w=800",
                title: "Hiking the Inca Trail to Machu Picchu",
                description:
                        "A four-day trek through the Andes, culminating in the stunning sunrise view of Machu Picchu.",
                author: { name: "Carlos Ruiz", avatar: "https://i.pravatar.cc/32?u=carlos" },
                date: "September 10, 2025",
                category: "Adventure",
        },
        {
                id: 8,
                image: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?q=80&w=800",
                title: "The Northern Lights in Iceland",
                description: "A guide on when and where to see the Aurora Borealis in its full glory.",
                author: { name: "Bjorn Sigurdsson", avatar: "https://i.pravatar.cc/32?u=bjorn" },
                date: "September 5, 2025",
                category: "Nature",
        },
        {
                id: 9,
                image: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?q=80&w=800",
                title: "Street Art in Berlin",
                description: "Discover the vibrant and ever-changing street art scene in Germany's capital city.",
                author: { name: "Klaus Richter", avatar: "https://i.pravatar.cc/32?u=klaus" },
                date: "September 1, 2025",
                category: "Culture",
        },
];

let currentPage = 1;
const postsPerPage = 4;
let filteredPosts = [...blogPosts];

const blogGrid = document.querySelector(".blog-grid");
const paginationList = document.querySelector(".pagination__list");
const searchForm = document.querySelector(".sidebar-widget__search-form");
const searchInput = document.querySelector(".sidebar-widget__search-input");
const categoryList = document.querySelector(".sidebar-widget__category-list");
const featuredPostContainer = document.querySelector(".sidebar-widget__featured-post");

function renderPosts() {
        if (!blogGrid) return;
        blogGrid.innerHTML = "";
        const startIndex = (currentPage - 1) * postsPerPage;
        const postsToRender = filteredPosts.slice(startIndex, startIndex + postsPerPage);

        if (postsToRender.length === 0) {
                blogGrid.innerHTML = `<div class="no-posts-found"><h3>No Posts Found</h3><p>Try adjusting your search or category filter.</p></div>`;
                return;
        }

        postsToRender.forEach((post, index) => {
                const postElement = document.createElement("article");
                postElement.className = "blog-card";
                postElement.style.animationDelay = `${index * 0.1}s`;
                postElement.innerHTML = `
                    <a href="blog-detail.html?id=${post.id}" class="blog-card__image-link">
                        <img src="${post.image}" alt="${post.title}" class="blog-card__image">
                    </a>
                    <div class="blog-card__content">
                        <span class="blog-card__category">${post.category}</span>
                        <h3 class="blog-card__title">
                            <a href="blog-detail.html?id=${post.id}">${post.title}</a>
                        </h3>
                        <div class="blog-card__meta">
                            <img src="${post.author.avatar}" alt="${post.author.name}" class="blog-card__author-avatar">
                            <span>${post.author.name} • ${post.date}</span>
                        </div>
                        <p class="blog-card__description">${post.description}</p>
                        <a href="blog-detail.html?id=${post.id}" class="blog-card__readmore">
                            Read More <i class="fas fa-arrow-right"></i>
                        </a>
                    </div>
                `;
                blogGrid.appendChild(postElement);
        });
}

function renderPagination() {
        if (!paginationList) return;
        paginationList.innerHTML = "";
        const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
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

function renderCategories() {
        if (!categoryList) return;
        const categories = [...new Set(blogPosts.map((p) => p.category))];
        categoryList.innerHTML = `<li><a href="#" data-category="all" class="active">All Categories</a></li>`;
        categories.forEach((cat) => {
                categoryList.innerHTML += `<li><a href="#" data-category="${cat}">${cat}</a></li>`;
        });
}

function renderFeaturedPost() {
        if (!featuredPostContainer) return;
        const featured = blogPosts[1];
        if (!featured) return;
        featuredPostContainer.innerHTML = `
                <a href="blog-detail.html?id=${featured.id}">
                    <img src="${featured.image}" alt="${featured.title}">
                    <h4>${featured.title}</h4>
                </a>
            `;
}

function renderSkeletonCards() {
        if (!blogGrid) return;
        blogGrid.innerHTML = "";
        const itemsToRender = Math.min(postsPerPage, filteredPosts.length || postsPerPage);
        for (let i = 0; i < itemsToRender; i++) {
                const skeletonCard = document.createElement("div");
                skeletonCard.className = "skeleton-card";
                skeletonCard.innerHTML = `
                    <div class="skeleton skeleton-image"></div>
                    <div class="skeleton-content">
                        <div class="skeleton skeleton-category"></div>
                        <div class="skeleton skeleton-title"></div>
                        <div class="skeleton skeleton-meta"></div>
                        <div class="skeleton skeleton-text"></div>
                        <div class="skeleton skeleton-text"></div>
                    </div>
                `;
                blogGrid.appendChild(skeletonCard);
        }
}

function handleSearchAndFilter() {
        const searchTerm = searchInput ? searchInput.value.trim().toLowerCase() : "";
        const activeCategoryLink = categoryList ? categoryList.querySelector("a.active") : null;
        const activeCategory = activeCategoryLink ? activeCategoryLink.dataset.category : "all";

        filteredPosts = blogPosts.filter((post) => {
                const matchesCategory = activeCategory === "all" || post.category === activeCategory;
                const matchesSearch =
                        post.title.toLowerCase().includes(searchTerm) ||
                        post.description.toLowerCase().includes(searchTerm);
                return matchesCategory && matchesSearch;
        });

        currentPage = 1;
        updateUI();
}

function debounce(func, delay = 300) {
        let timeout;
        return (...args) => {
                clearTimeout(timeout);
                timeout = setTimeout(() => {
                        func.apply(this, args);
                }, delay);
        };
}

function updateUI() {
        renderSkeletonCards();
        renderPagination();
        setTimeout(() => {
                renderPosts();
        }, 500);
}

if (searchForm) {
        searchForm.addEventListener("submit", (e) => {
                e.preventDefault();
                handleSearchAndFilter();
        });
}

if (searchInput) {
        searchInput.addEventListener("input", debounce(handleSearchAndFilter));
}

if (categoryList) {
        categoryList.addEventListener("click", (e) => {
                e.preventDefault();
                if (e.target.tagName === "A") {
                        categoryList.querySelectorAll("a").forEach((a) => a.classList.remove("active"));
                        e.target.classList.add("active");
                        handleSearchAndFilter();
                }
        });
}

if (paginationList) {
        paginationList.addEventListener("click", (e) => {
                if (e.target.tagName === "BUTTON" && !e.target.classList.contains("pagination__link--disabled")) {
                        const page = e.target.dataset.page;
                        const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

                        if (page === "prev" && currentPage > 1) currentPage--;
                        else if (page === "next" && currentPage < totalPages) currentPage++;
                        else if (!isNaN(page)) currentPage = parseInt(page);
                        else return;

                        if (blogGrid) {
                                blogGrid.scrollIntoView({ behavior: "smooth", block: "start" });
                        }
                        updateUI();
                }
        });
}

function initialLoad() {
        renderCategories();
        renderFeaturedPost();
        updateUI();
}

initialLoad();
