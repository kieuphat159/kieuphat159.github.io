// =========================================================================
// Data fetching and transformation
// =========================================================================
let blogPosts = [];

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
        const months = [
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December",
        ];
        return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

// Transform places data to blog posts (same as blog.js)
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

                        // Generate author based on country
                        const author = generateAuthor(tour.country);

                        // Generate date (stagger posts over time)
                        const date = generateDate(daysAgo);
                        daysAgo += 3; // Space posts 3 days apart

                        // Transform blog text into content blocks
                        const content = transformBlogToContent(place.blog, place.famous_locations);

                        posts.push({
                                id: postId++,
                                image: image,
                                category: tour.country,
                                title: title,
                                description: place.blog,
                                author: author,
                                date: date,
                                publishDate: date,
                                city: place.city,
                                country: tour.country,
                                tourId: tour.id,
                                lat: place.lat,
                                lon: place.lon,
                                famousLocations: place.famous_locations || [],
                                tags: [tour.country, place.city, "Travel"],
                                content: content,
                                comments: [],
                                recentImage: image,
                        });
                });
        });

        return posts;
}

// Transform blog text into content blocks for rendering
function transformBlogToContent(blogText, famousLocations) {
        const content = [];

        // Add intro paragraph
        content.push({
                type: "intro",
                text: blogText,
        });

        // Add images from famous locations
        if (famousLocations && famousLocations.length > 0) {
                famousLocations.forEach((location, index) => {
                        if (index === 0) {
                                // First image after intro
                                content.push({
                                        type: "image",
                                        src: location.image_url,
                                        alt: location.name,
                                });
                        } else {
                                // Other images with subheadings
                                content.push({
                                        type: "subheading",
                                        text: location.name,
                                });
                                content.push({
                                        type: "image",
                                        src: location.image_url,
                                        alt: location.name,
                                });
                        }
                });
        }

        return content;
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
                return blogPosts;
        } catch (error) {
                console.error("Error fetching blog data:", error);
                blogPosts = [];
                return [];
        }
}

// --- DOM ELEMENTS ---
const blogMetaContainer = document.querySelector(".blog-detail__meta");
const blogHeading = document.querySelector(".blog-detail__heading");
const articleContainer = document.querySelector(".blog-detail__article");
const commentsContainer = document.querySelector(".blog-detail__comments");
const recentPostsContainer = document.querySelector(".blog-detail__recent-blog__container");
const searchForm = document.querySelector(".blog-detail__form");
const searchInput = document.querySelector(".blog-detail__form__input");

// --- UTILITY FUNCTIONS ---

/**
 * A utility function to delay execution of a function (debounce).
 */
function debounce(func, delay) {
        let timeoutId;
        return (...args) => {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
}

// --- RENDER FUNCTIONS ---

/**
 * Renders the main content of a single blog post.
 * @param {object} post - The blog post object to render.
 */
function renderPostDetails(post) {
        if (!post) {
                const leftContent = document.querySelector(".blog-detail-content__left");
                if (leftContent) {
                        leftContent.innerHTML = `<h1 class="blog-detail__heading">404 - Post Not Found</h1>
                     <p>The post you are looking for does not exist. Please check the URL or go back to the homepage.</p>`;
                }
                const rightContent = document.querySelector(".blog-detail-content__right");
                if (rightContent) {
                        rightContent.style.display = "none";
                }
                return;
        }

        // 1. Render Meta Info (Author, Date, Tags)
        if (blogMetaContainer) {
                blogMetaContainer.innerHTML = `
                <div class="blog-detail__author">
                    <img src="${post.author.avatar}" alt="${post.author.name}" class="blog-detail__author-avatar" 
                         onerror="this.src='https://i.pravatar.cc/32?u=travel'"/>
                    <span>By ${post.author.name} • Published on ${post.publishDate}</span>
                </div>
                <div class="blog-detail__tags">
                    ${(post.tags || []).map((tag) => `<a href="#blog" class="tag">${tag}</a>`).join("")}
                </div>
            `;
        }

        // 2. Render Main Heading
        if (blogHeading) {
                blogHeading.textContent = post.title;
        }

        // 3. Render Article Content
        if (articleContainer) {
                articleContainer.innerHTML = (post.content || [])
                        .map((block) => {
                                switch (block.type) {
                                        case "intro":
                                                return `<p class="blog-detail__article__intro">${block.text}</p>`;
                                        case "paragraph":
                                                return `<p class="blog-detail__article__description">${block.text}</p>`;
                                        case "subheading":
                                                return `<h2 class="blog-detail__article__subheading">${block.text}</h2>`;
                                        case "image":
                                                return `<img src="${block.src}" alt="${block.alt}" class="blog-detail__article__image" 
                                                             onerror="this.src='https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=800'"/>`;
                                        case "blockquote":
                                                return `<blockquote>${block.text}<cite>- ${block.cite}</cite></blockquote>`;
                                        case "list":
                                                return `<ul>${(block.items || [])
                                                        .map((item) => `<li>${item}</li>`)
                                                        .join("")}</ul>`;
                                        default:
                                                return "";
                                }
                        })
                        .join("");
        }

        // 4. Render Comments
        if (commentsContainer) {
                const commentCount = (post.comments || []).length;
                const commentHeading = commentsContainer.querySelector(".comments-heading");
                if (commentHeading) {
                        commentHeading.textContent = `${commentCount} Comment${commentCount !== 1 ? "s" : ""}`;
                }

                // Clear existing comments
                const commentElements = commentsContainer.querySelectorAll(".comment");
                commentElements.forEach((el) => el.remove());

                // Add new comments
                (post.comments || []).forEach((comment) => {
                        const commentDiv = document.createElement("div");
                        commentDiv.className = "comment";
                        commentDiv.innerHTML = `
                    <img src="${comment.avatar}" alt="${comment.author} Avatar" class="comment-avatar" 
                         onerror="this.src='https://i.pravatar.cc/50?u=user'"/>
                    <div class="comment-body">
                        <h5 class="comment-author">${comment.author}</h5>
                        <p class="comment-text">${comment.text}</p>
                        <a href="#blog-detail" class="comment-reply">Reply</a>
                    </div>
                `;
                        const commentForm = commentsContainer.querySelector(".comment-form");
                        if (commentForm) {
                                commentsContainer.insertBefore(commentDiv, commentForm);
                        }
                });
        }
}

/**
 * Renders a list of recent blog posts in the sidebar.
 * @param {Array<object>} posts - An array of blog post objects.
 */
function renderRecentPosts(posts) {
        if (!recentPostsContainer) return;
        recentPostsContainer.innerHTML = ""; // Clear existing recent posts

        if (posts.length === 0) {
                recentPostsContainer.innerHTML = "<p>No matching posts found.</p>";
                return;
        }

        posts.forEach((post) => {
                const article = document.createElement("article");
                article.className = "blog-detail__recent-blog__article";
                const detailUrl = `#blog-detail?id=${post.id}`;
                article.innerHTML = `
                    <div class="blog-detail__recent-blog__image">
                        <a href="${detailUrl}">
                            <img src="${post.recentImage || post.image}" alt="${post.title}" 
                                 class="blog-detail__recent-blog__img" 
                                 onerror="this.src='https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=800'"/>
                        </a>
                    </div>
                    <p class="blog-detail__recent-blog__description">
                        <a href="${detailUrl}">${post.title}</a>
                    </p>
                `;
                recentPostsContainer.appendChild(article);
        });
}

// --- INITIALIZATION LOGIC ---

// Get post ID from hash URL
function getPostIdFromHash() {
        let currentPostId = null;
        const hash = window.location.hash;
        if (hash && hash.includes("?")) {
                const hashParts = hash.split("?");
                if (hashParts.length > 1) {
                        const urlParams = new URLSearchParams(hashParts[1]);
                        currentPostId = parseInt(urlParams.get("id"), 10);
                }
        }

        // Fallback: try regular query string if hash doesn't have it
        if (!currentPostId || isNaN(currentPostId)) {
                const urlParams = new URLSearchParams(window.location.search);
                currentPostId = parseInt(urlParams.get("id"), 10);
        }

        // If no valid ID is found, default to the first post
        if (isNaN(currentPostId) || !blogPosts.some((p) => p.id === currentPostId)) {
                currentPostId = blogPosts[0]?.id || 1;
        }

        return currentPostId;
}

// Render blog detail content (called on load and hash change)
function renderBlogDetailContent() {
        const currentPostId = getPostIdFromHash();
        const currentPost = blogPosts.find((p) => p.id === currentPostId);
        let recentPosts = blogPosts.filter((p) => p.id !== currentPostId).slice(0, 3);

        renderPostDetails(currentPost);
        renderRecentPosts(recentPosts);

        // Update search handler with current post ID
        if (searchForm && searchInput) {
                searchInput.value = ""; // Clear search when post changes
        }
}

async function initializeBlogDetail() {
        // Fetch blog data only if not already loaded
        if (blogPosts.length === 0) {
                await fetchBlogData();
        }

        // Render the initial content
        renderBlogDetailContent();

        // Setup sidebar search functionality (only once)
        if (searchForm && searchInput && !searchForm.hasAttribute("data-initialized")) {
                searchForm.setAttribute("data-initialized", "true");

                const handleSearch = () => {
                        const currentPostId = getPostIdFromHash();
                        const searchTerm = searchInput.value.trim().toLowerCase();
                        // Filter all posts except current
                        const allRecentPosts = blogPosts.filter((p) => p.id !== currentPostId);
                        const filteredRecent = allRecentPosts.filter(
                                (p) =>
                                        p.title.toLowerCase().includes(searchTerm) ||
                                        (p.description && p.description.toLowerCase().includes(searchTerm)) ||
                                        (p.city && p.city.toLowerCase().includes(searchTerm))
                        );
                        renderRecentPosts(filteredRecent.slice(0, 3));
                };

                searchForm.addEventListener("submit", (e) => {
                        e.preventDefault();
                        handleSearch();
                });
                searchInput.addEventListener("input", debounce(handleSearch, 300));
        }

        // Listen for hash changes to update content when navigating
        window.addEventListener("hashchange", () => {
                renderBlogDetailContent();
        });
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initializeBlogDetail);
} else {
        initializeBlogDetail();
}
