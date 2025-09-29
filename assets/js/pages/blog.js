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
                image: "../assets/images/blogs/argentina.png", // Sử dụng lại ảnh có sẵn
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
];

// Lấy các phần tử DOM
const blogListContainer = document.querySelector(".blog__list__container");
const searchFrom = document.querySelector(".blog__content__form");
const searchInput = document.querySelector(".blog__content__form__input");

// Hàm render các bài post
function renderPosts(posts) {
        // Xóa hết nội dung cũ
        blogListContainer.innerHTML = "";

        if (posts.length === 0) {
                blogListContainer.innerHTML = "<p>No posts found</p>";
                return;
        }

        posts.forEach((post) => {
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
function handleSearch(event) {
        event.preventDefault();
        console.log("haha");

        const searchTerm = searchInput.value.trim().toLowerCase();

        if (!searchTerm) {
                renderPosts(blogPosts);
                return;
        }

        const filterPosts = blogPosts.filter(
                (post) =>
                        post.title.toLowerCase().includes(searchTerm) ||
                        post.description.toLowerCase().includes(searchTerm)
        );

        renderPosts(filterPosts);
}

// Khởi tạo dữ liệu ban đầu
renderPosts(blogPosts);

// Thêm sự kiện cho form
searchFrom.addEventListener("submit", handleSearch);
