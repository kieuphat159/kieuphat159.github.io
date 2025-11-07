// =========================================================================
// Data fetching and transformation
// =========================================================================
let blogPosts = [];
let currentPage = 1;
const postsPerPage = 6;
let filteredPosts = [];

// Helper function to calculate reading time based on text length
function calculateReadingTime(text) {
        // Average reading speed: 200 words per minute
        // Vietnamese text: approximately 1 character = 0.15 words (rough estimate)
        const words = text.length * 0.15;
        const minutes = Math.ceil(words / 200);
        return `${minutes} min read`;
}

// Helper function to generate author name from country
function generateAuthor(country) {
        const authorMap = {
                "Việt Nam": { name: "Nguyễn Văn", avatar: "https://i.pravatar.cc/32?u=vietnam" },
                "Nhật Bản": { name: "Tanaka Kenji", avatar: "https://i.pravatar.cc/32?u=japan" },
                Pháp: { name: "Pierre Dubois", avatar: "https://i.pravatar.cc/32?u=france" },
                Ý: { name: "Marco Rossi", avatar: "https://i.pravatar.cc/32?u=italy" },
                Mỹ: { name: "John Smith", avatar: "https://i.pravatar.cc/32?u=usa" },
                "Thái Lan": { name: "Somsak Thai", avatar: "https://i.pravatar.cc/32?u=thailand" },
                "Hàn Quốc": { name: "Kim Min-jun", avatar: "https://i.pravatar.cc/32?u=korea" },
                Úc: { name: "James Wilson", avatar: "https://i.pravatar.cc/32?u=australia" },
                "Ai Cập": { name: "Ahmed Hassan", avatar: "https://i.pravatar.cc/32?u=egypt" },
                "Tây Ban Nha": { name: "Carlos Martinez", avatar: "https://i.pravatar.cc/32?u=spain" },
                Canada: { name: "David Thompson", avatar: "https://i.pravatar.cc/32?u=canada" },
                "Ấn Độ": { name: "Raj Patel", avatar: "https://i.pravatar.cc/32?u=india" },
                Brazil: { name: "Pedro Silva", avatar: "https://i.pravatar.cc/32?u=brazil" },
                "Thổ Nhĩ Kỳ": { name: "Mehmet Yilmaz", avatar: "https://i.pravatar.cc/32?u=turkey" },
                "New Zealand": { name: "Mike Johnson", avatar: "https://i.pravatar.cc/32?u=newzealand" },
                Anh: { name: "James Brown", avatar: "https://i.pravatar.cc/32?u=uk" },
        };
        return authorMap[country] || { name: "Travel Writer", avatar: "https://i.pravatar.cc/32?u=travel" };
}

// Helper function to generate date (days ago from now)
function generateDate(daysAgo) {
        const date = new Date();
        date.setDate(date.getDate() - daysAgo);
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

// Transform places data to blog posts
function transformPlacesToBlogPosts(toursData) {
        const posts = [];
        let postId = 1;
        let daysAgo = 0;

        toursData.forEach((tour) => {
                tour.places.forEach((place) => {
                        // Get image from first famous location, or use a placeholder
                        const image =
                                place.famous_locations && place.famous_locations.length > 0
                                        ? place.famous_locations[0].image_url
                                        : "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=800";

                        // Create title from city name
                        const title = `Khám phá ${place.city}: Hành trình đáng nhớ`;

                        // Calculate reading time from blog text
                        const readingTime = calculateReadingTime(place.blog);

                        // Generate author based on country
                        const author = generateAuthor(tour.country);

                        // Generate date (stagger posts over time)
                        const date = generateDate(daysAgo);
                        daysAgo += 3; // Space posts 3 days apart

                        const isFeatured = posts.length === 0; // Mark first post as featured

                        posts.push({
                                id: postId++,
                                image: image,
                                category: tour.country,
                                title: title,
                                description: place.blog, // Store full blog text for search
                                author: author,
                                date: date,
                                readingTime: readingTime,
                                city: place.city,
                                country: tour.country,
                                tourId: tour.id,
                                lat: place.lat,
                                lon: place.lon,
                                famousLocations: place.famous_locations || [],
                                isFeatured: isFeatured,
                        });
                });
        });

        return posts;
}

// Fetch data from data.json
async function fetchBlogData() {
        try {
                const response = await fetch("/data.json");
                if (!response.ok) {
                        throw new Error("Failed to fetch data.json");
                }
                const data = await response.json();
                blogPosts = transformPlacesToBlogPosts(data.data);
                filteredPosts = [...blogPosts];
                return blogPosts;
        } catch (error) {
                console.error("Error fetching blog data:", error);
                // Fallback to empty array if fetch fails
                blogPosts = [];
                filteredPosts = [];
                return [];
        }
}

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
const prevBtn = document.querySelector(".pagination .prev");
const nextBtn = document.querySelector(".pagination .next");

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
                const detailUrl = `#blog-detail?id=${post.id}`;
                postElement.innerHTML = `
                <a href="${detailUrl}" class="blog-card__image-link">
                    <img src="${post.image}" alt="${post.title}" class="blog-card__image" 
                         onerror="this.src='https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=800'">
                    <span class="blog-card__category">${post.category}</span>
                </a>
                <div class="blog-card__content">
                    <h3 class="blog-card__title">
                        <a href="${detailUrl}">${post.title}</a>
                    </h3>
                    <div class="blog-card__footer">
                        <div class="blog-card__author">
                            <img src="${post.author.avatar}" alt="${post.author.name}" class="blog-card__author-avatar"
                                 onerror="this.src='https://i.pravatar.cc/32?u=travel'">
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

        // Update Prev button state
        if (prevBtn) prevBtn.classList.toggle("disabled", currentPage === 1);

        // Update Next button state
        if (nextBtn) nextBtn.classList.toggle("disabled", currentPage === totalPages);

        // Generate page number links - show only 3 page numbers at a time
        if (!pageNumbersSpan) return;
        pageNumbersSpan.innerHTML = "";

        let startPage, endPage;

        if (totalPages <= 3) {
                // If 3 or fewer pages, show all
                startPage = 1;
                endPage = totalPages;
        } else {
                // Show 3 pages around current page
                if (currentPage <= 2) {
                        startPage = 1;
                        endPage = 3;
                } else if (currentPage >= totalPages - 1) {
                        startPage = totalPages - 2;
                        endPage = totalPages;
                } else {
                        startPage = currentPage - 1;
                        endPage = currentPage + 1;
                }
        }

        for (let i = startPage; i <= endPage; i++) {
                pageNumbersSpan.innerHTML += `<a href="#" data-page="${i}" class="${
                        i === currentPage ? "active" : ""
                }">${i}</a>`;
        }
}

function renderCategories() {
        if (!categoryList) return;
        if (blogPosts.length === 0) return;

        const categories = ["All", ...new Set(blogPosts.map((p) => p.category))];
        categoryList.innerHTML = categories
                .map(
                        (cat) =>
                                `<a href="#" data-category="${cat}" class="${cat === "All" ? "active" : ""}">${
                                        cat === "All" ? "All Categories" : cat
                                }</a>`
                )
                .join("");
}

function renderFeaturedPost() {
        if (!featuredPostContainer) return;
        if (blogPosts.length === 0) return;

        const featured = blogPosts.find((p) => p.isFeatured) || blogPosts[0]; // Fallback to first post
        if (!featured) return;

        const detailUrl = `pages/blog-detail.html?id=${featured.id}`;
        featuredPostContainer.innerHTML = `
            <a href="${detailUrl}">
                <img src="${featured.image}" alt="${featured.title}" 
                     onerror="this.src='https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=800'">
                <h4>${featured.title}</h4>
            </a>
        `;
}

// NEW: Render recent posts
function renderRecentPosts() {
        if (!recentPostsContainer) return;
        if (blogPosts.length === 0) return;

        const recent = blogPosts.slice(0, 3); // Get the first 3 posts
        recentPostsContainer.innerHTML = recent
                .map((post) => {
                        const detailUrl = `/blog-detail.html?id=${post.id}`;
                        return `
            <div class="sidebar-widget__recent-post-item">
                <a href="${detailUrl}">
                    <img src="${post.image}" alt="${post.title}" 
                         onerror="this.src='https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=800'">
                    <h5>${post.title}</h5>
                </a>
            </div>
        `;
                })
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
        if (blogPosts.length === 0) return; // Wait for data to load

        const searchTerm = searchInput ? searchInput.value.trim().toLowerCase() : "";
        const activeCategoryLink = categoryList ? categoryList.querySelector("a.active") : null;
        const activeCategory = activeCategoryLink ? activeCategoryLink.dataset.category : "All";

        filteredPosts = blogPosts.filter((post) => {
                const matchesCategory = activeCategory === "All" || post.category === activeCategory;
                const searchText = searchTerm ? searchTerm : "";
                const matchesSearch =
                        !searchText ||
                        post.title.toLowerCase().includes(searchText) ||
                        (post.description && post.description.toLowerCase().includes(searchText)) ||
                        (post.city && post.city.toLowerCase().includes(searchText));
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
        if (prevBtn) {
                prevBtn.addEventListener("click", (e) => {
                        e.preventDefault();
                        if (currentPage > 1) {
                                handlePageChange(currentPage - 1);
                        }
                });
        }
        if (nextBtn) {
                nextBtn.addEventListener("click", (e) => {
                        e.preventDefault();
                        const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
                        if (currentPage < totalPages) {
                                handlePageChange(currentPage + 1);
                        }
                });
        }
        if (pageNumbersSpan) {
                pageNumbersSpan.addEventListener("click", (e) => {
                        if (e.target.tagName === "A" && e.target.dataset.page) {
                                e.preventDefault();
                                handlePageChange(parseInt(e.target.dataset.page, 10));
                        }
                });
        }
}

// =========================================================================
// INITIAL LOAD
// =========================================================================
async function initialLoad() {
        // Show skeleton loading
        renderSkeletonCards();

        // Fetch data from data.json
        await fetchBlogData();

        // Render UI with fetched data
        renderCategories();
        renderFeaturedPost();
        renderRecentPosts();
        updateUI();
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initialLoad);
} else {
        initialLoad();
}
