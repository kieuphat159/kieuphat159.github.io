// --- FAKE DATA cho các bài blog ---
const blogPosts = [
        {
                id: 1,
                image: "../assets/images/blogs/demo.png",
                title: "On the Shores of a Pink Lake in Australia",
                description:
                        "Experience the surreal beauty of Lake Hillier, a vibrant pink lake that defies explanation. A must-see natural wonder.",
                link: "#blog-detail",
        },
        {
                id: 2,
                image: "../assets/images/blogs/argentina.png",
                title: "Exploring Argentina and Chile by Bus",
                description:
                        "A comprehensive guide to backpacking through Patagonia. Discover stunning mountains, glaciers, and vibrant city life.",
                link: "#blog-detail",
        },
        {
                id: 3,
                image: "../assets/images/blogs/demo.png",
                title: "The Hidden Temples of Kyoto",
                description:
                        "Escape the crowds and find tranquility in the lesser-known temples of Kyoto. A spiritual journey awaits.",
                link: "#blog-detail",
        },
        {
                id: 4,
                image: "../assets/images/blogs/demo.png",
                title: "A Culinary Tour of Ho Chi Minh City",
                description:
                        "From street food stalls to high-end restaurants, explore the vibrant and delicious food scene of Vietnam's southern hub.",
                link: "#blog-detail",
        },
        {
                id: 5,
                image: "../assets/images/blogs/demo.png",
                title: "Navigating the Grand Canal of Venice",
                description:
                        "Tips and tricks for exploring the heart of Venice by gondola and vaporetto. Avoid the tourist traps!",
                link: "#blog-detail",
        },
        {
                id: 6,
                image: "../assets/images/blogs/demo.png",
                title: "Sunrise over the Sahara Desert",
                description:
                        "A breathtaking experience of watching the sun rise over the endless dunes of the Sahara. A memory that lasts a lifetime.",
                link: "#blog-detail",
        },
        {
                id: 7,
                image: "../assets/images/blogs/demo.png",
                title: "Hiking the Inca Trail to Machu Picchu",
                description:
                        "A four-day trek through the Andes, culminating in the stunning sunrise view of Machu Picchu.",
                link: "#blog-detail",
        },
        {
                id: 8,
                image: "../assets/images/blogs/demo.png",
                title: "The Northern Lights in Iceland",
                description: "A guide on when and where to see the Aurora Borealis in its full glory.",
                link: "#blog-detail",
        },
        {
                id: 9,
                image: "../assets/images/blogs/demo.png",
                title: "Street Art in Berlin",
                description: "Discover the vibrant and ever-changing street art scene in Germany's capital city.",
                link: "#blog-detail",
        },
        {
                id: 10,
                image: "../assets/images/blogs/demo.png",
                title: "Island Hopping in the Philippines",
                description: "Find paradise in the crystal-clear waters and white sand beaches of Palawan.",
                link: "#blog-detail",
        },
        {
                id: 11,
                image: "../assets/images/blogs/demo.png",
                title: "Street Art in Berlin",
                description: "Discover the vibrant and ever-changing street art scene in Germany's capital city.",
                link: "#blog-detail",
        },
        {
                id: 12,
                image: "../assets/images/blogs/demo.png",
                title: "Island Hopping in the Philippines",
                description: "Find paradise in the crystal-clear waters and white sand beaches of Palawan.",
                link: "#blog-detail",
        },
];

        // --- STATE MANAGEMENT ---
        let currentPage = 1;
        const postsPerPage = 6;
        let filteredPosts = [...blogPosts];

        // --- DOM ELEMENTS (Cập nhật theo class mới) ---
        const blogGrid = document.querySelector(".blog-grid");
        const paginationList = document.querySelector(".pagination__list");
        const searchForm = document.querySelector(".sidebar-widget__search-form");
        const searchInput = document.querySelector(".sidebar-widget__search-input");
        const categoryList = document.querySelector(".sidebar-widget__category-list");
        const featuredPostContainer = document.querySelector(".sidebar-widget__featured-post");

        console.log(blogGrid);

        // --- RENDER FUNCTIONS ---

        function renderPosts() {
                blogGrid.innerHTML = ""; // Xóa bài viết cũ
                const startIndex = (currentPage - 1) * postsPerPage;
                const postsToRender = filteredPosts.slice(startIndex, startIndex + postsPerPage);

                if (postsToRender.length === 0) {
                        blogGrid.innerHTML = `<div class="no-posts-found"><h3>No Posts Found</h3><p>Try adjusting your search or category filter.</p></div>`;
                        return;
                }

                postsToRender.forEach((post, index) => {
                        const postElement = document.createElement("article");
                        postElement.className = "blog-card";
                        // Thêm animation delay để tạo hiệu ứng xuất hiện lần lượt
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
                paginationList.innerHTML = "";
                const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
                if (totalPages <= 1) return;

                // Nút "Previous"
                paginationList.insertAdjacentHTML(
                        "beforeend",
                        `<li><button class="pagination__link ${
                                currentPage === 1 ? "pagination__link--disabled" : ""
                        }" data-page="prev">&laquo;</button></li>`
                );

                // Các nút số trang
                for (let i = 1; i <= totalPages; i++) {
                        paginationList.insertAdjacentHTML(
                                "beforeend",
                                `<li><button class="pagination__link ${
                                        i === currentPage ? "pagination__link--active" : ""
                                }" data-page="${i}">${i}</button></li>`
                        );
                }

                // Nút "Next"
                paginationList.insertAdjacentHTML(
                        "beforeend",
                        `<li><button class="pagination__link ${
                                currentPage === totalPages ? "pagination__link--disabled" : ""
                        }" data-page="next">&raquo;</button></li>`
                );
        }

        function renderCategories() {
                const categories = [...new Set(blogPosts.map((p) => p.category))];
                categoryList.innerHTML = `<li><a href="#" data-category="all" class="active">All Categories</a></li>`;
                categories.forEach((cat) => {
                        categoryList.innerHTML += `<li><a href="#" data-category="${cat}">${cat}</a></li>`;
                });
        }

        function renderFeaturedPost() {
                const featured = blogPosts[1]; // Ví dụ: Lấy bài 'Argentina' làm nổi bật
                if (!featured) return;
                featuredPostContainer.innerHTML = `
                <a href="blog-detail.html?id=${featured.id}">
                    <img src="${featured.image}" alt="${featured.title}">
                    <h4>${featured.title}</h4>
                </a>
            `;
        }

        function renderSkeletonCards() {
                blogGrid.innerHTML = "";
                const itemsToRender = Math.min(postsPerPage, filteredPosts.length || postsPerPage);
                for (let i = 0; i < itemsToRender; i++) {
                        const skeletonCard = document.createElement("div");
                        skeletonCard.className = "skeleton-card";
                        skeletonCard.innerHTML = `
                    <div class="skeleton skeleton-image"></div>
                    <div class="skeleton-content">
                        <div class="skeleton skeleton-title"></div>
                        <div class="skeleton skeleton-text"></div>
                        <div class="skeleton skeleton-text"></div>
                    </div>
                `;
                        blogGrid.appendChild(skeletonCard);
                }
        }

        // --- LOGIC FUNCTIONS ---

        function handleSearchAndFilter() {
                const searchTerm = searchInput.value.trim().toLowerCase();
                const activeCategoryLink = categoryList.querySelector("a.active");
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

        // Hàm debounce để tránh gọi hàm liên tục khi người dùng gõ
        function debounce(func, delay = 300) {
                let timeout;
                return (...args) => {
                        clearTimeout(timeout);
                        timeout = setTimeout(() => {
                                func.apply(this, args);
                        }, delay);
                };
        }

        // --- MAIN UPDATE FUNCTION ---

        function updateUI() {
                renderSkeletonCards();
                // Giả lập độ trễ tải dữ liệu từ server
                setTimeout(() => {
                        renderPosts();
                        renderPagination();
                }, 500);
        }

        // --- EVENT LISTENERS ---

        searchForm.addEventListener("submit", (e) => {
                e.preventDefault();
                handleSearchAndFilter();
        });

        searchInput.addEventListener("input", debounce(handleSearchAndFilter));

        categoryList.addEventListener("click", (e) => {
                e.preventDefault();
                if (e.target.tagName === "A") {
                        categoryList.querySelectorAll("a").forEach((a) => a.classList.remove("active"));
                        e.target.classList.add("active");
                        handleSearchAndFilter();
                }
        });

        paginationList.addEventListener("click", (e) => {
                console.log("haha");
                if (e.target.tagName === "BUTTON" && !e.target.classList.contains("pagination__link--disabled")) {
                        const page = e.target.dataset.page;
                        if (page === "prev") currentPage--;
                        else if (page === "next") currentPage++;
                        else currentPage = parseInt(page);

                        // Cuộn lên đầu danh sách bài viết
                        blogGrid.scrollIntoView({ behavior: "smooth" });
                        updateUI();
                }
        });

        // --- INITIALIZATION ---
        renderCategories();
        renderFeaturedPost();
        updateUI();
});
