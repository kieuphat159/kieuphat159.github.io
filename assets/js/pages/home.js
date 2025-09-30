class SimpleLazyLoader {
        constructor() {
                this.observer = new IntersectionObserver(this.handleIntersection.bind(this), {
                        rootMargin: "50px",
                        threshold: 0.1,
                });

                this.init();
        }

        init() {
                setTimeout(() => {
                        this.setupLazy();
                }, 100);
        }

        setupLazy() {
                // Tìm và observe tất cả lazy images
                const lazyImages = document.querySelectorAll("img[data-src]");
                lazyImages.forEach((img) => this.observer.observe(img));
        }

        // Khi image vào viewport thì load image và thêm class "loaded"
        handleIntersection(entries) {
                entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                                this.loadImage(entry.target);
                                this.observer.unobserve(entry.target); // Ngừng observe
                        }
                });
        }

        // CORE LOGIC: Load image
        loadImage(img) {
                const src = img.dataset.src;
                if (!src) return;

                // Preload image
                const imageLoader = new Image();

                imageLoader.onload = () => {
                        img.src = src;
                        img.classList.add("loaded"); // Cho CSS transition
                };

                imageLoader.onerror = () => {
                        img.alt = "Image not available";
                };

                imageLoader.src = src;
        }
}

// Khởi tạo
if ("IntersectionObserver" in window) {
        new SimpleLazyLoader();
} else {
        // Fallback cho browsers cũ
        document.addEventListener("DOMContentLoaded", () => {
                document.querySelectorAll("img[data-src]").forEach((img) => {
                        img.src = img.dataset.src;
                });
        });
}

console.log("Main JS");
