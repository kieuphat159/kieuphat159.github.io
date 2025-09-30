// --- FAKE DATA cho các bài blog ---
const blogPosts = [
        {
                id: 1,
                image: "../assets/images/blogs/demo.png",
                title: "On the Shores of a Pink Lake in Australia",
                description:
                        "Experience the surreal beauty of Lake Hillier, a vibrant pink lake that defies explanation. A must-see natural wonder.",
                link: "#",
        },
        {
                id: 2,
                image: "../assets/images/blogs/argentina.png",
                title: "Exploring Argentina and Chile by Bus",
                description:
                        "A comprehensive guide to backpacking through Patagonia. Discover stunning mountains, glaciers, and vibrant city life.",
                link: "#",
        },
        {
                id: 3,
                image: "../assets/images/blogs/demo.png",
                title: "The Hidden Temples of Kyoto",
                description:
                        "Escape the crowds and find tranquility in the lesser-known temples of Kyoto. A spiritual journey awaits.",
                link: "#",
        },
        {
                id: 4,
                image: "../assets/images/blogs/demo.png",
                title: "A Culinary Tour of Ho Chi Minh City",
                description:
                        "From street food stalls to high-end restaurants, explore the vibrant and delicious food scene of Vietnam's southern hub.",
                link: "#",
        },
        {
                id: 5,
                image: "../assets/images/blogs/demo.png",
                title: "Navigating the Grand Canal of Venice",
                description:
                        "Tips and tricks for exploring the heart of Venice by gondola and vaporetto. Avoid the tourist traps!",
                link: "#",
        },
        {
                id: 6,
                image: "../assets/images/blogs/demo.png",
                title: "Sunrise over the Sahara Desert",
                description:
                        "A breathtaking experience of watching the sun rise over the endless dunes of the Sahara. A memory that lasts a lifetime.",
                link: "#",
        },
        {
                id: 7,
                image: "../assets/images/blogs/demo.png",
                title: "Hiking the Inca Trail to Machu Picchu",
                description:
                        "A four-day trek through the Andes, culminating in the stunning sunrise view of Machu Picchu.",
                link: "#",
        },
        {
                id: 8,
                image: "../assets/images/blogs/demo.png",
                title: "The Northern Lights in Iceland",
                description: "A guide on when and where to see the Aurora Borealis in its full glory.",
                link: "#",
        },
        {
                id: 9,
                image: "../assets/images/blogs/demo.png",
                title: "Street Art in Berlin",
                description: "Discover the vibrant and ever-changing street art scene in Germany's capital city.",
                link: "#",
        },
        {
                id: 10,
                image: "../assets/images/blogs/demo.png",
                title: "Island Hopping in the Philippines",
                description: "Find paradise in the crystal-clear waters and white sand beaches of Palawan.",
                link: "#",
        },
        {
                id: 11,
                image: "../assets/images/blogs/demo.png",
                title: "Street Art in Berlin",
                description: "Discover the vibrant and ever-changing street art scene in Germany's capital city.",
                link: "#",
        },
        {
                id: 12,
                image: "../assets/images/blogs/demo.png",
                title: "Island Hopping in the Philippines",
                description: "Find paradise in the crystal-clear waters and white sand beaches of Palawan.",
                link: "#",
        },
];

// State
let currentPage = 1;
const postsPerPage = 5;
let currentPosts = [...blogPosts];

// Lấy các phần tử DOM
const blogListContainer = document.querySelector(".blog__list__container");
const searchFrom = document.querySelector(".blog__content__form");
const searchInput = document.querySelector(".blog__content__form__input");
const paginationContainer = document.querySelector(".pagination__list");

// Hàm render các bài post
function renderPosts() {
        // Xóa hết nội dung cũ
        blogListContainer.innerHTML = "";

        const startIndex = (currentPage - 1) * postsPerPage;
        const endIndex = startIndex + postsPerPage;
        const paginatedPosts = currentPosts.slice(startIndex, endIndex);
        if (paginatedPosts.length === 0) {
                blogListContainer.innerHTML = "<p>No posts found</p>";
                return;
        }

        paginatedPosts.forEach((post) => {
                const postElement = document.createElement("article");
                postElement.classList.add("blog__list__item");
                postElement.innerHTML = `
                    <a href="${post.link}" class="blog__list__item__link">
                                                <img
                                                        src="${post.image}"
                                                        alt="Blog Content Image"
                                                        class="blog__list__item__image"
                                                />
                                                <h3 class="blog__list__item__title">
                                                        ${post.title}
                                                </h3>
                                                <p class="blog__list__item__description">
                                                        ${post.description}
                                                </p>
                                                <span class="blog__list__item__readmore">Read More</span>
                                        </a>
                `;
                blogListContainer.appendChild(postElement);
        });
}

// Hàm xử lý sự kiện form
function handleSearch() {
        const searchTerm = searchInput.value.trim().toLowerCase();

        if (!searchTerm) {
                currentPosts = [...blogPosts];
        }

        currentPosts = blogPosts.filter(
                (post) =>
                        post.title.toLowerCase().includes(searchTerm) ||
                        post.description.toLowerCase().includes(searchTerm)
        );
        currentPage = 1;
        updateUI(); // Cập nhật cả bài viết và phân trang
}

// Hàm render các nút phân trang
function renderPagination() {
        paginationContainer.innerHTML = "";
        const totalPages = Math.ceil(currentPosts.length / postsPerPage);
        if (totalPages <= 1) return;

        // Nút "Previous"
        let prevDisabled = currentPage === 1 ? "pagination__link--disabled" : "";
        paginationContainer.innerHTML += `
        <li class="pagination__item">
            <button class="pagination__link ${prevDisabled ? "pagination__link--disabled" : ""}" data-page="prev" ${
                prevDisabled ? "disabled" : ""
        }>&laquo; Prev</button>
        </li>
    
    `;

        // Các nút số trang
        for (let i = 1; i <= totalPages; i++) {
                let activeClass = i === currentPage ? "pagination__link--active" : "";
                paginationContainer.innerHTML += `
                    <li class="pagination__item">
                        <button class="pagination__link ${activeClass}" data-page="${i}">${i}</button>
                    </li>
                `;
        }

        // Nút "Next"
        let nextDisabled = currentPage === totalPages;
        paginationContainer.innerHTML += `
            <li class="pagination__item">
                <button class="pagination__link ${nextDisabled ? "pagination__link--disabled" : ""}" data-page="next" ${
                nextDisabled ? "disabled" : ""
        }>Next &raquo;</button>
            </li>
        
    `;
}

// Sự kiện

// Sự kiện click cho các nút phân trang (sử dụng Event Delegation)
paginationContainer.addEventListener("click", (event) => {
        const target = event.target;
        if (target.tagName !== "BUTTON" || target.classList.contains("pagination__link--disabled")) {
                return;
        }

        const page = target.dataset.page;
        const totalPages = Math.ceil(currentPosts.length / postsPerPage);

        if (page === "prev") {
                if (currentPage > 1) currentPage--;
        } else if (page === "next") {
                if (currentPage < totalPages) currentPage++;
        } else {
                currentPage = parseInt(page);
        }

        updateUI();
});

// Thêm sự kiện cho form
searchFrom.addEventListener("submit", (event) => {
        event.preventDefault();
        handleSearch(event);
});

// Lắng nghe sự kiện 'input' (mỗi khi người dùng gõ phím)
searchInput.addEventListener("input", (event) => {
        setTimeout(() => {
                handleSearch(event);
        }, 300);
});

// Khởi tạo dữ liệu ban đầu
function updateUI() {
        renderPosts(currentPosts);
        renderPagination();
}

// --- KHỞI CHẠY LẦN ĐẦU ---
updateUI();

console.log("Blog page script loaded");
