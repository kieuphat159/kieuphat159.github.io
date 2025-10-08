document.addEventListener("DOMContentLoaded", () => {
        // --- FAKE DATA ---
        // In a real application, this data would come from an API.
        const blogData = [
                {
                        id: 1,
                        title: "Exploring Argentina and Chile by Bus: An Unforgettable Journey",
                        author: {
                                name: "Alex Wanderlust",
                                avatar: "https://i.pravatar.cc/40?u=alex",
                        },
                        publishDate: "October 08, 2025",
                        tags: ["Travel", "South America", "Adventure"],
                        recentImage: "https://images.unsplash.com/photo-1518002583121-4a69a08e0b96?q=80&w=400",
                        content: [
                                {
                                        type: "intro",
                                        text: "Sitting serenely on the turquoise coasts of the Caribbean Sea lie two properties that embody paradise in quiet luxury. Park Hyatt St. Kitts and Andaz Mayakoba are the answers to your desires for a sun-filled ocean getaway. This journey, however, takes us south, to the rugged spine of the Andes.",
                                },
                                {
                                        type: "image",
                                        src: "https://images.unsplash.com/photo-1518002583121-4a69a08e0b96?q=80&w=1200",
                                        alt: "Views of the Andes mountains",
                                },
                                {
                                        type: "subheading",
                                        text: "The Majestic Andes Crossing",
                                },
                                {
                                        type: "paragraph",
                                        text: "The bus ride from Mendoza, Argentina, to Santiago, Chile, is not just a commute; it's a spectacle. As the vehicle snakes through winding mountain roads, each turn reveals a new, breathtaking vista. Aconcagua, the highest peak outside of Asia, stands as a silent, snow-capped guardian over the landscape.",
                                },
                                {
                                        type: "blockquote",
                                        text: "The mountains are calling and I must go.",
                                        cite: "John Muir",
                                },
                                {
                                        type: "subheading",
                                        text: "What to Pack for the Trip",
                                },
                                {
                                        type: "list",
                                        items: [
                                                "A comfortable neck pillow is non-negotiable.",
                                                "Snacks and a reusable water bottle.",
                                                "A power bank to keep your devices charged for photos.",
                                                "Layers of clothing, as temperatures can vary dramatically.",
                                        ],
                                },
                                {
                                        type: "image",
                                        src: "https://images.unsplash.com/photo-1525121433363-2a83983273e5?q=80&w=1200",
                                        alt: "A bus on a winding mountain road",
                                },
                                {
                                        type: "paragraph",
                                        text: "This adventure offers a different kind of luxury—the luxury of time, perspective, and raw, untamed nature.",
                                },
                        ],
                        comments: [
                                {
                                        author: "Jane Doe",
                                        avatar: "https://i.pravatar.cc/50?u=jane",
                                        text: "This is an amazing guide! I'm planning a similar trip next year and this is incredibly helpful.",
                                },
                                {
                                        author: "John Smith",
                                        avatar: "https://i.pravatar.cc/50?u=john",
                                        text: "Great photos! The Andes are truly spectacular.",
                                },
                        ],
                },
                {
                        id: 2,
                        title: "The Secrets of Bangkok Street Food",
                        author: { name: "Chris Foodie", avatar: "https://i.pravatar.cc/40?u=chris" },
                        publishDate: "September 22, 2025",
                        tags: ["Food", "Asia", "Thailand"],
                        recentImage: "https://images.unsplash.com/photo-1534542921-2e66e2c3b28b?q=80&w=400",
                        content: [
                                {
                                        type: "intro",
                                        text: "Bangkok's street food scene is a vibrant, chaotic, and delicious symphony of flavors. From spicy som tam to sweet mango sticky rice, every corner offers a new culinary adventure waiting to be discovered.",
                                },
                                {
                                        type: "image",
                                        src: "https://images.unsplash.com/photo-1534542921-2e66e2c3b28b?q=80&w=1200",
                                        alt: "Bangkok street food stall at night",
                                },
                                {
                                        type: "subheading",
                                        text: "Must-Try Dishes",
                                },
                                {
                                        type: "list",
                                        items: [
                                                "Pad Thai: The classic stir-fried noodle dish.",
                                                "Moo Ping: Grilled pork skewers with a sweet and savory glaze.",
                                                "Som Tam: A spicy green papaya salad that packs a punch.",
                                                "Khao Niao Mamuang: Mango sticky rice, the perfect dessert.",
                                        ],
                                },
                        ],
                        comments: [
                                {
                                        author: "Emily Rogers",
                                        avatar: "https://i.pravatar.cc/50?u=emily",
                                        text: "I'm drooling just reading this! Moo Ping is my absolute favorite.",
                                },
                        ],
                },
                {
                        id: 3,
                        title: "What to Do on a Romantic Day in Paris?",
                        author: { name: "Amélie Dubois", avatar: "https://i.pravatar.cc/40?u=amelie" },
                        publishDate: "August 15, 2025",
                        tags: ["Europe", "Romance", "City Guide"],
                        recentImage: "https://images.unsplash.com/photo-1502602898657-3e91760c0337?q=80&w=400",
                        content: [
                                {
                                        type: "intro",
                                        text: "Paris, the 'City of Love,' offers endless opportunities for a romantic day. Forget the clichés and discover a more intimate side of this magical city with our curated guide.",
                                },
                                {
                                        type: "image",
                                        src: "https://images.unsplash.com/photo-1502602898657-3e91760c0337?q=80&w=1200",
                                        alt: "Eiffel Tower in Paris",
                                },
                                {
                                        type: "subheading",
                                        text: "A Perfect Itinerary",
                                },
                                {
                                        type: "paragraph",
                                        text: "Start your morning with fresh croissants from a local boulangerie. Take a stroll through the Luxembourg Gardens, followed by a visit to the Musée Rodin. For the evening, a sunset cruise on the Seine offers unparalleled views of the city's landmarks.",
                                },
                        ],
                        comments: [],
                },
        ];

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
                        document.querySelector(
                                ".blog-detail-content__left"
                        ).innerHTML = `<h1 class="blog-detail__heading">404 - Post Not Found</h1>
                     <p>The post you are looking for does not exist. Please check the URL or go back to the homepage.</p>`;
                        document.querySelector(".blog-detail-content__right").style.display = "none";
                        return;
                }

                // 1. Render Meta Info (Author, Date, Tags)
                blogMetaContainer.innerHTML = `
                <div class="blog-detail__author">
                    <img src="${post.author.avatar}" alt="${post.author.name}" class="blog-detail__author-avatar" />
                    <span>By ${post.author.name} • Published on ${post.publishDate}</span>
                </div>
                <div class="blog-detail__tags">
                    ${post.tags.map((tag) => `<a href="#" class="tag">${tag}</a>`).join("")}
                </div>
            `;

                // 2. Render Main Heading
                blogHeading.textContent = post.title;

                // 3. Render Article Content
                articleContainer.innerHTML = post.content
                        .map((block) => {
                                switch (block.type) {
                                        case "intro":
                                                return `<p class="blog-detail__article__intro">${block.text}</p>`;
                                        case "paragraph":
                                                return `<p class="blog-detail__article__description">${block.text}</p>`;
                                        case "subheading":
                                                return `<h2 class="blog-detail__article__subheading">${block.text}</h2>`;
                                        case "image":
                                                return `<img src="${block.src}" alt="${block.alt}" class="blog-detail__article__image" />`;
                                        case "blockquote":
                                                return `<blockquote>${block.text}<cite>- ${block.cite}</cite></blockquote>`;
                                        case "list":
                                                return `<ul>${block.items
                                                        .map((item) => `<li>${item}</li>`)
                                                        .join("")}</ul>`;
                                        default:
                                                return "";
                                }
                        })
                        .join("");

                // 4. Render Comments
                const commentCount = post.comments.length;
                const commentHeading = commentsContainer.querySelector(".comments-heading");
                commentHeading.textContent = `${commentCount} Comment${commentCount !== 1 ? "s" : ""}`;

                const commentElements = commentsContainer.querySelectorAll(".comment");
                commentElements.forEach((el) => el.remove()); // Clear static comments

                post.comments.forEach((comment) => {
                        const commentDiv = document.createElement("div");
                        commentDiv.className = "comment";
                        commentDiv.innerHTML = `
                    <img src="${comment.avatar}" alt="${comment.author} Avatar" class="comment-avatar" />
                    <div class="comment-body">
                        <h5 class="comment-author">${comment.author}</h5>
                        <p class="comment-text">${comment.text}</p>
                        <a href="#" class="comment-reply">Reply</a>
                    </div>
                `;
                        // Insert before the comment form
                        commentsContainer.insertBefore(commentDiv, commentsContainer.querySelector(".comment-form"));
                });
        }

        /**
         * Renders a list of recent blog posts in the sidebar.
         * @param {Array<object>} posts - An array of blog post objects.
         */
        function renderRecentPosts(posts) {
                recentPostsContainer.innerHTML = ""; // Clear existing recent posts

                if (posts.length === 0) {
                        recentPostsContainer.innerHTML = "<p>No matching posts found.</p>";
                        return;
                }

                posts.forEach((post) => {
                        const article = document.createElement("article");
                        article.className = "blog-detail__recent-blog__article";
                        // Use ?id=${post.id} to simulate navigating to a different post
                        article.innerHTML = `
                    <div class="blog-detail__recent-blog__image">
                        <a href="?id=${post.id}">
                            <img src="${post.recentImage}" alt="${post.title}" class="blog-detail__recent-blog__img" />
                        </a>
                    </div>
                    <p class="blog-detail__recent-blog__description">
                        <a href="?id=${post.id}">${post.title}</a>
                    </p>
                `;
                        recentPostsContainer.appendChild(article);
                });
        }

        // --- INITIALIZATION LOGIC ---

        // 1. Get post ID from URL query parameter (e.g., blog-detail.html?id=2)
        const urlParams = new URLSearchParams(window.location.search);
        let currentPostId = parseInt(urlParams.get("id"), 10);

        // If no valid ID is found in URL, default to the first post
        if (isNaN(currentPostId) || !blogData.some((p) => p.id === currentPostId)) {
                currentPostId = blogData[0]?.id || 1;
        }

        // 2. Find the current post and the list of other posts for the sidebar
        const currentPost = blogData.find((p) => p.id === currentPostId);
        let recentPosts = blogData.filter((p) => p.id !== currentPostId);

        // 3. Render the initial content
        renderPostDetails(currentPost);
        renderRecentPosts(recentPosts);

        // 4. Setup sidebar search functionality
        const handleSearch = () => {
                const searchTerm = searchInput.value.trim().toLowerCase();
                // Filter the original list of recent posts
                const filteredRecent = recentPosts.filter((p) => p.title.toLowerCase().includes(searchTerm));
                renderRecentPosts(filteredRecent);
        };

        searchForm.addEventListener("submit", (e) => e.preventDefault());
        searchInput.addEventListener("input", debounce(handleSearch, 300));
});
