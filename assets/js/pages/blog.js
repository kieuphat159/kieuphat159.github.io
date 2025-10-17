// =========================================================================
// Fake data
// =========================================================================
const blogPosts = [
        {
                id: 1,
                image: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?q=80&w=800",
                category: "City Guide",
                title: "A Backpacker's Guide to Venice's Hidden Alleys",
                author: { name: "Marco Rossi", avatar: "https://i.pravatar.cc/32?u=marco" },
                date: "Oct 15, 2025",
                readingTime: "7 min read",
                isFeatured: true, // This post is the editor's pick
        },
        {
                id: 2,
                image: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?q=80&w=800",
                category: "Culture",
                title: "The Ultimate Guide to Paris Fashion Week",
                author: { name: "Chloé Dubois", avatar: "https://i.pravatar.cc/32?u=chloe" },
                date: "Oct 12, 2025",
                readingTime: "9 min read",
        },
        {
                id: 3,
                image: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?q=80&w=800",
                category: "Food",
                title: "Tasting Tokyo: A Journey Through Japan's Culinary Capital",
                author: { name: "Kenji Tanaka", avatar: "https://i.pravatar.cc/32?u=kenji" },
                date: "Oct 10, 2025",
                readingTime: "12 min read",
        },
        {
                id: 4,
                image: "https://images.unsplash.com/photo-1533929736458-ca588d08c8be?q=80&w=800",
                category: "Adventure",
                title: "Hiking the Inca Trail: What to Know Before You Go",
                author: { name: "Alex Wanderlust", avatar: "https://i.pravatar.cc/32?u=alex" },
                date: "Oct 08, 2025",
                readingTime: "15 min read",
        },
        {
                id: 5,
                image: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?q=80&w=800",
                category: "Nature",
                title: "Chasing the Northern Lights in Iceland: A Complete Guide",
                author: { name: "Bjorn Sigurdsson", avatar: "https://i.pravatar.cc/32?u=bjorn" },
                date: "Oct 05, 2025",
                readingTime: "8 min read",
        },
        {
                id: 6,
                image: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?q=80&w=800",
                category: "Food",
                title: "A Culinary Tour of Ho Chi Minh City's Street Food",
                author: { name: "Linh Nguyen", avatar: "https://i.pravatar.cc/32?u=linh" },
                date: "Oct 02, 2025",
                readingTime: "10 min read",
        },
        {
                id: 7,
                image: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=800",
                category: "City Guide",
                title: "48 Hours in Rome: How to See the Best of the Eternal City",
                author: { name: "Jane Doe", avatar: "https://i.pravatar.cc/32?u=jane" },
                date: "Sep 29, 2025",
                readingTime: "11 min read",
        },
        {
                id: 8,
                image: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?q=80&w=800",
                category: "Adventure",
                title: "Sunrise over the Sahara: A Camel Trekking Experience",
                author: { name: "Aisha Bakar", avatar: "https://i.pravatar.cc/32?u=aisha" },
                date: "Sep 25, 2025",
                readingTime: "6 min read",
        },
        {
                id: 9,
                image: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?q=80&w=800",
                category: "Nature",
                title: "The Untouched Beauty of New Zealand's Fiordland",
                author: { name: "Alex Wanderlust", avatar: "https://i.pravatar.cc/32?u=alex" },
                date: "Sep 22, 2025",
                readingTime: "9 min read",
        },
];

let currentPage = 1;
const postsPerPage = 6; // Tăng số bài viết mỗi trang
let filteredPosts = [...blogPosts];

// =========================================================================
// DOM ELEMENT VARIABLES
// =========================================================================
const blogGrid = document.querySelector(".blog-grid");
const searchForm = document.querySelector(".sidebar-widget__search-form");
const searchInput = document.querySelector(".sidebar-widget__search-input");
const categoryList = document.querySelector(".sidebar-widget__tag-list");
const featuredPostContainer = document.querySelector(".sidebar-widget__featured-post");
const recentPostsContainer = document.querySelector(".sidebar-widget__recent-posts");

const paginationContainer = document.querySelector(".pagination");
const pageNumbersSpan = document.querySelector(".page-numbers");
const firstBtn = document.querySelector(".pagination .first");
const prevBtn = document.querySelector(".pagination .prev");
const nextBtn = document.querySelector(".pagination .next");
const lastBtn = document.querySelector(".pagination .last");

// =========================================================================
// RENDER FUNCTIONS (UPDATED)
// =========================================================================

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
                postElement.style.animationDelay = `${index * 0.1}s`; // Stagger animation
                postElement.innerHTML = `
                <a href="#blog-detail-${post.id}" class="blog-card__image-link">
                    <img src="${post.image}" alt="${post.title}" class="blog-card__image">
                    <span class="blog-card__category">${post.category}</span>
                </a>
                <div class="blog-card__content">
                    <h3 class="blog-card__title">
                        <a href="#blog-detail-${post.id}">${post.title}</a>
                    </h3>
                    <div class="blog-card__footer">
                        <div class="blog-card__author">
                            <img src="${post.author.avatar}" alt="${post.author.name}" class="blog-card__author-avatar">
                            <span>${post.author.name}</span>
                        </div>
                        <span class="blog-card__meta-info">${post.date} • ${post.readingTime}</span>
                    </div>
                </div>
            `;
                blogGrid.appendChild(postElement);
        });
}

function renderPagination() {
        const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
        if (!paginationContainer) return;

        paginationContainer.style.display = totalPages <= 1 ? "none" : "flex";

        // Update First/Prev buttons state
        firstBtn.classList.toggle("disabled", currentPage === 1);
        prevBtn.classList.toggle("disabled", currentPage === 1);

        // Update Next/Last buttons state
        nextBtn.classList.toggle("disabled", currentPage === totalPages);
        lastBtn.classList.toggle("disabled", currentPage === totalPages);

        // Generate page number links
        pageNumbersSpan.innerHTML = "";
        for (let i = 1; i <= totalPages; i++) {
                pageNumbersSpan.innerHTML += `<a href="#" data-page="${i}" class="${
                        i === currentPage ? "active" : ""
                }">${i}</a>`;
        }
}

function renderCategories() {
        if (!categoryList) return;
        const categories = ["All", ...new Set(blogPosts.map((p) => p.category))];
        categoryList.innerHTML = categories
                .map(
                        (cat) =>
                                `<li><a href="#" data-category="${cat}" class="${cat === "All" ? "active" : ""}">${
                                        cat === "All" ? "All Categories" : cat
                                }</a></li>`
                )
                .join("");
}

function renderFeaturedPost() {
        if (!featuredPostContainer) return;
        const featured = blogPosts.find((p) => p.isFeatured) || blogPosts[0]; // Fallback to first post
        if (!featured) return;

        featuredPostContainer.innerHTML = `
            <a href="#blog-detail-${featured.id}">
                <img src="${featured.image}" alt="${featured.title}">
                <h4>${featured.title}</h4>
            </a>
        `;
}

// NEW: Render recent posts
function renderRecentPosts() {
        if (!recentPostsContainer) return;
        const recent = blogPosts.slice(0, 3); // Get the first 3 posts
        recentPostsContainer.innerHTML = recent
                .map(
                        (post) => `
            <div class="sidebar-widget__recent-post-item">
                <a href="#blog-detail-${post.id}">
                    <img src="${post.image}" alt="${post.title}">
                    <h5>${post.title}</h5>
                </a>
            </div>
        `
                )
                .join("");
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
                    <div class="skeleton skeleton-title"></div>
                    <div class="skeleton-footer">
                        <div class="skeleton skeleton-avatar"></div>
                        <div class="skeleton skeleton-author-name"></div>
                    </div>
                </div>
            `;
                blogGrid.appendChild(skeletonCard);
        }
}

// =========================================================================
// LOGIC FUNCTIONS
// =========================================================================

function handleSearchAndFilter() {
        const searchTerm = searchInput ? searchInput.value.trim().toLowerCase() : "";
        const activeCategoryLink = categoryList ? categoryList.querySelector("a.active") : null;
        const activeCategory = activeCategoryLink ? activeCategoryLink.dataset.category : "All";

        filteredPosts = blogPosts.filter((post) => {
                const matchesCategory = activeCategory === "All" || post.category === activeCategory;
                const matchesSearch =
                        post.title.toLowerCase().includes(searchTerm) ||
                        post.description.toLowerCase().includes(searchTerm);
                return matchesCategory && matchesSearch;
        });

        currentPage = 1;
        updateUI();
}

function debounce(func, delay = 350) {
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
        setTimeout(() => {
                renderPosts();
                renderPagination();
        }, 300); // Reduce delay for faster feel
}

// =========================================================================
// EVENT LISTENERS
// =========================================================================

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
                if (e.target.tagName === "A") {
                        e.preventDefault();
                        categoryList.querySelector("a.active").classList.remove("active");
                        e.target.classList.add("active");
                        handleSearchAndFilter();
                }
        });
}

function handlePageChange(newPage) {
        const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
        if (newPage < 1 || newPage > totalPages || newPage === currentPage) return;

        currentPage = newPage;
        const blogContainer = document.querySelector(".blog__container");
        if (blogContainer) {
                blogContainer.scrollIntoView({ behavior: "smooth", block: "start" });
        }
        updateUI();
}

if (paginationContainer) {
        firstBtn.addEventListener("click", (e) => {
                e.preventDefault();
                handlePageChange(1);
        });
        prevBtn.addEventListener("click", (e) => {
                e.preventDefault();
                handlePageChange(currentPage - 1);
        });
        nextBtn.addEventListener("click", (e) => {
                e.preventDefault();
                handlePageChange(currentPage + 1);
        });
        lastBtn.addEventListener("click", (e) => {
                e.preventDefault();
                const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
                handlePageChange(totalPages);
        });
        pageNumbersSpan.addEventListener("click", (e) => {
                if (e.target.tagName === "A" && e.target.dataset.page) {
                        e.preventDefault();
                        handlePageChange(parseInt(e.target.dataset.page, 10));
                }
        });
}

// =========================================================================
// INITIAL LOAD
// =========================================================================
function initialLoad() {
        renderCategories();
        renderFeaturedPost();
        renderRecentPosts();
        updateUI();
}

initialLoad();
