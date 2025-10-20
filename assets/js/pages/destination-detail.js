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
            this.setupScrollAnimations();
        }, 300);
    }

    setupScrollAnimations() {
        // Check if browser supports animation-timeline
        const supportsAnimationTimeline = CSS.supports('animation-timeline: view()');
        
        if (!supportsAnimationTimeline) {
            // Fallback for browsers that don't support animation-timeline
            const animatedSections = document.querySelectorAll(
                '.destination-detail-mission, .destination-detail-pilgrimages, ' +
                '.destination-detail-gallery, .destination-detail-insights, ' +
                '.destination-detail-testimonials'
            );

            const scrollObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.animation = 'fadeInUp 1s ease-out forwards';
                        scrollObserver.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -100px 0px'
            });

            animatedSections.forEach(section => {
                scrollObserver.observe(section);
            });
        }
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

        // Kiểm tra nếu là ảnh cần giữ nguyên kích thước (không dùng aspect-ratio)
        const preserveSizeClasses = [
            'destination-detail-mission__img',
            'destination-detail-ready__background',
            'destination-detail-ready__image',
            'destination-detail-gallery__main-image',
            'destination-detail-gallery__thumb'
        ];

        const shouldPreserveSize = preserveSizeClasses.some(className => 
            img.classList.contains(className)
        );

        // Tạo wrapper
        const wrapper = document.createElement("div");
        wrapper.className = "skeleton-wrapper";

        // Thêm class skeleton-loading ban đầu
        wrapper.classList.add("skeleton-loading");

        // Copy tất cả classes từ image sang wrapper (để giữ styling)
        if (img.className) {
            const imgClasses = img.className.split(' ');
            imgClasses.forEach(cls => {
                if (cls && !wrapper.classList.contains(cls)) {
                    wrapper.classList.add(cls);
                }
            });
        }

        // Wrap image
        img.parentNode.insertBefore(wrapper, img);
        wrapper.appendChild(img);

        // Xóa các classes styling khỏi img để tránh conflict
        const classesToRemove = [
            'destination-detail-card__img',
            'destination-detail-pilgrimages__image',
            'destination-detail-gallery__main-image',
            'destination-detail-gallery__thumb',
            'destination-detail-insights__image'
        ];
        
        classesToRemove.forEach(cls => {
            if (img.classList.contains(cls)) {
                img.classList.remove(cls);
            }
        });

        // Chỉ thêm aspect ratio cho các ảnh không cần giữ nguyên kích thước
        if (!shouldPreserveSize && img.width && img.height) {
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

// Smooth scroll reveal for elements
class ScrollReveal {
    constructor() {
        this.init();
    }

    init() {
        // Add stagger animation to cards on scroll
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe all animated elements
        const elements = document.querySelectorAll(
            '.destination-detail-card, .destination-detail-pilgrimages__card, ' +
            '.destination-detail-insights__card, .destination-detail-testimonials__item'
        );

        elements.forEach(el => {
            observer.observe(el);
        });
    }
}

// Khởi tạo
if ("IntersectionObserver" in window) {
    new SkeletonLazyLoader();
    new ScrollReveal();
} else {
    // Fallback cho browsers cũ
    document.addEventListener("DOMContentLoaded", () => {
        document.querySelectorAll("img[data-src]").forEach((img) => {
            img.src = img.dataset.src;
        });
    });
}

// Add smooth parallax effect to hero background
window.addEventListener('scroll', () => {
    const hero = document.querySelector('.destination-detail-hero');
    if (hero) {
        const scrolled = window.pageYOffset;
        const parallax = scrolled * 0.5;
        hero.style.backgroundPositionY = `${parallax}px`;
    }
});

// Add hover effect to filter tabs
document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.destination-detail-filter__tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Add ripple effect to buttons
    const buttons = document.querySelectorAll(
        '.destination-detail-pilgrimages__btn, .btn--primary, ' +
        '.destination-detail-cta__btn, .destination-detail-itinerary__button'
    );

    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');

            this.appendChild(ripple);

            setTimeout(() => ripple.remove(), 600);
        });
    });
});
