// --- FAKE DATA (Mở rộng với nội dung chi tiết) ---
// Dữ liệu này nên được đồng bộ với file blog.js

const blogPosts = [
        {
                id: 1,
                image: "../assets/images/blogs/demo.png",
                title: "On the Shores of a Pink Lake in Australia",
                description: "Experience the surreal beauty of Lake Hillier...",
                content: [
                        {
                                heading: "A Natural Wonder",
                                image: {
                                        src: "../assets/images/blog-detail/Argentina.png",
                                        alt: "Pink Lake from above",
                                },
                                paragraph: "Lake Hillier is a saline lake on the edge of Middle Island, the largest of the islands that make up the Recherche Archipelago in the Goldfields-Esperance region, off the south coast of Western Australia. It is particularly notable for its pink colour.",
                        },
                        {
                                heading: "Why is it Pink?",
                                image: {
                                        src: "../assets/images/blog-detail/ParkHyatt.png",
                                        alt: "Microorganism Dunaliella salina",
                                },
                                paragraph: "The most likely explanation for the lake’s pink hue involves the presence of the microorganism Dunaliella salina. These salt-loving photosynthetic microorganisms generate energy by using other parts of the visible light spectrum except for the orange/red frequencies.",
                        },
                ],
        },
        {
                id: 2,
                image: "../assets/images/blogs/argentina.png",
                title: "Exploring Argentina and Chile by Bus",
                description: "A comprehensive guide to backpacking through Patagonia...",
                content: [
                        {
                                heading: "The Journey Begins",
                                image: {
                                        src: "../assets/images/blog-detail/Argentina.png",
                                        alt: "Bus travelling through the mountains",
                                },
                                paragraph: "Sitting serenely on the turquoise coasts of the Caribbean Sea lie two properties that embody paradise in quiet luxury. Park Hyatt St. Kitts and Andaz Mayakoba are the answers to your desires for a sun-filled ocean getaway.",
                        },
                        {
                                heading: "Crossing the Andes",
                                image: {
                                        src: "../assets/images/blog-detail/ParkHyatt.png",
                                        alt: "The Andes mountain range",
                                },
                                paragraph: "Whether vacationing with the whole family, or lounging your time away with a loved one, both properties capture the essence of resort living on beautiful grounds with unforgettable itineraries.",
                        },
                ],
        },
];
const headingElement = document.querySelector(".blog-detail__heading");
const mainContentContainer = document.querySelector(".blog-detail-content__left");
const recentPostsContainer = document.querySelector(".blog-detail__recent-blog__container");
const searchForm = document.querySelector(".blog-detail__form");
const searchInput = document.querySelector(".blog-detail__form__input");

function renderPostDetails(post) {
        // 1. Cập nhật tiêu đề chính của bài viết
        headingElement.textContent = post.title;

        // 2. Lặp qua mảng content và tạo các khối <article>
        post.content.forEach((articleData) => {
                // Tạo một thẻ <article> mới
                const articleElement = document.createElement("article");
                articleElement.className = "blog-detail__article";

                // Điền nội dung cho article từ dữ liệu
                articleElement.innerHTML = `
          <h3 class="blog-detail__article__content">${articleData.heading}</h3>
          <img
              src="${articleData.image.src}"
              alt="${articleData.image.alt}"
              class="blog-detail__article__image"
          />
          <p class="blog-detail__article__description">
              ${articleData.paragraph}
          </p>
      `;

                // Thêm article đã hoàn thiện vào trong DOM
                mainContentContainer.appendChild(articleElement);
        });
}

function renderRecentPosts(posts) {
        recentPostsContainer.innerHTML = "";
        if (posts.length === 0) {
                recentPostsContainer.innerHTML = "<p>No recent posts.</p>";
                return;
        }
        posts.forEach((post) => {
                const article = document.createElement("article");
                article.className = "blog-detail__recent-blog__article";
                article.innerHTML = `
          <div class="blog-detail__recent-blog__image">
              <a href="blog-detail.html?id=${post.id}">
                  <img src="${post.image}" alt="${post.title}" class="blog-detail__recent-blog__img" />
              </a>
          </div>
          <p class="blog-detail__recent-blog__description">
               <a href="blog-detail.html?id=${post.id}">${post.title}</a>
          </p>
      `;
                recentPostsContainer.appendChild(article);
        });
}

// 1. Lấy ID của bài viết từ URL
// const hash = window.location.hash;
// if (hash.includes("#blog-detail/")) {
//   const parts = hash.split("/");
//   const idString = parts.pop();
//   postId = parseInt(idString, 10);
// }
let postId = 1;

// 2. Tìm bài viết tương ứng trong mảng dữ liệu
const currentPost = blogPosts.find((p) => p.id === postId);

// 3. Render nội dung
if (currentPost) {
        renderPostDetails(currentPost);

        // Lấy danh sách bài viết gần đây (loại trừ bài hiện tại)
        let recentPosts = blogPosts.filter((p) => p.id !== postId);
        renderRecentPosts(recentPosts);

        // 4. Logic tìm kiếm cho sidebar
        const handleSidebarSearch = () => {
                const searchTerm = searchInput.value.trim().toLowerCase();
                const filteredRecent = recentPosts.filter((p) => p.title.toLowerCase().includes(searchTerm));
                renderRecentPosts(filteredRecent);
        };

        searchForm.addEventListener("submit", (e) => e.preventDefault());
        searchInput.addEventListener("input", debounce(handleSidebarSearch, 300));
} else {
        mainContentContainer.innerHTML = '<h2 class="blog-detail__heading">Post not found!</h2>';
}

function debounce(func, delay) {
        let timeoutId;
        return (...args) => {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
}
