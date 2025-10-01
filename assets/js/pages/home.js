class SkeletonLazyLoader {
    constructor() {
        this.observer = new IntersectionObserver(this.handleIntersection.bind(this), {
            rootMargin: "50px",
            // bắt đầu load trước khi ảnh vào viewport 50px
            threshold: 0.1,
        });

        this.init();
    }

    init() {
        setTimeout(() => {
            this.setupLazy();
        }, 300);
    }

    setupLazy() {
        // Tìm tất cả lazy images
        const lazyImages = document.querySelectorAll("img[data-src]");
        lazyImages.forEach((img) => {
            // Wrap image trong container nếu chưa có
            this.wrapImageWithSkeleton(img);
            this.observer.observe(img);
        });
    }

    // Wrap image trong skeleton container
    wrapImageWithSkeleton(img) {
        // Kiểm tra xem đã wrap chưa
        if (img.parentElement.classList.contains("skeleton-wrapper")) {
            return;
        }

        // Tạo wrapper
        const wrapper = document.createElement("div");
        wrapper.className = "skeleton-wrapper";

        // Thêm class skeleton-loading ban đầu
        wrapper.classList.add("skeleton-loading");

        // Wrap image
        img.parentNode.insertBefore(wrapper, img);
        wrapper.appendChild(img);

        // Thêm styles inline để giữ aspect ratio nếu có width/height
        if (img.width && img.height) {
            const aspectRatio = (img.height / img.width) * 100;
            wrapper.style.paddingBottom = `${aspectRatio}%`;
        }
    }

    handleIntersection(entries) {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                this.loadImage(entry.target);
                this.observer.unobserve(entry.target);
            }
        });
    }

    loadImage(img) {
        const src = img.dataset.src;
        if (!src) return;

        const wrapper = img.closest(".skeleton-wrapper");

        // Preload image
        const imageLoader = new Image();

        imageLoader.onload = () => {
            img.src = src;
            img.classList.add("loaded");

            // Xóa skeleton loading
            if (wrapper) {
                wrapper.classList.remove("skeleton-loading");
                wrapper.classList.add("skeleton-loaded");
            }
        };

        imageLoader.onerror = () => {
            // Khi lỗi, vẫn xóa skeleton và hiển thị alt
            img.alt = "Image not available";
            if (wrapper) {
                wrapper.classList.remove("skeleton-loading");
                wrapper.classList.add("skeleton-error");
            }
        };

        imageLoader.src = src;
    }
}

// Khởi tạo
if ("IntersectionObserver" in window) {
    new SkeletonLazyLoader();
} else {
    // Fallback cho browsers cũ
    document.addEventListener("DOMContentLoaded", () => {
        document.querySelectorAll("img[data-src]").forEach((img) => {
            img.src = img.dataset.src;
        });
    });
}
