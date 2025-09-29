function lazyLoading() {
        // Lấy tất cả các phần tử cần áp dụng hiệu ứng
        const lazyElements = document.querySelectorAll(".lazy-load");

        if ("IntersectionObserver" in window) {
                // Cấu hình cho IntersectionObserver
                const observerOptions = {
                        root: null, // Sử dụng viewport làm gốc để quan sát
                        rootMargin: "0px",
                        threshold: 0.1, // Kích hoạt khi 10% phần tử hiển thị
                };

                // Hàm callback sẽ được gọi mỗi khi một phần tử được quan sát thay đổi trạng thái
                const observerCallback = (entries, observer) => {
                        entries.forEach((entry) => {
                                // Nếu phần tử đi vào trong viewport
                                if (entry.isIntersecting) {
                                        // Thêm class 'visible' để kích hoạt animation CSS
                                        entry.target.classList.add("visible");

                                        // Ngừng quan sát phần tử này sau khi đã hiển thị để tiết kiệm tài nguyên
                                        observer.unobserve(entry.target);
                                }
                        });
                };

                // Tạo một observer mới
                const observer = new IntersectionObserver(observerCallback, observerOptions);

                // Bắt đầu quan sát tất cả các phần tử đã chọn
                lazyElements.forEach((el) => observer.observe(el));
        } else {
                // Fallback cho trình duyệt cũ không hỗ trợ IntersectionObserver
                // Hiển thị tất cả các phần tử ngay lập tức
                lazyElements.forEach((el) => el.classList.add("visible"));
        }
}

if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", lazyLoading);
} else {
        lazyLoading();
}
