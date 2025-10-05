class SkeletonLazyLoader {
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
        }, 300);
    }

    setupLazy() {
        const lazyImages = document.querySelectorAll("img[data-src]");
        lazyImages.forEach((img) => {
            this.wrapImageWithSkeleton(img);
            this.observer.observe(img);
        });
    }

    wrapImageWithSkeleton(img) {
        if (img.parentElement.classList.contains("skeleton-wrapper")) {
            return;
        }
        const wrapper = document.createElement("div");
        wrapper.className = "skeleton-wrapper";
        wrapper.classList.add("skeleton-loading");
        img.parentNode.insertBefore(wrapper, img);
        wrapper.appendChild(img);
        if (img.width && img.height) {
            const aspectRatio = (img.height / img.width) * 100;
            wrapper.style.paddingBottom = aspectRatio + "%";
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
        const imageLoader = new Image();
        imageLoader.onload = function() {
            img.src = src;
            img.classList.add("loaded");
            if (wrapper) {
                wrapper.classList.remove("skeleton-loading");
                wrapper.classList.add("skeleton-loaded");
            }
        };
        imageLoader.onerror = function() {
            img.alt = "Image not available";
            if (wrapper) {
                wrapper.classList.remove("skeleton-loading");
                wrapper.classList.add("skeleton-error");
            }
        };
        imageLoader.src = src;
    }
}

if ("IntersectionObserver" in window) {
    new SkeletonLazyLoader();
}

// CAROUSEL
(function() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    function init() {
        console.log('Carousel starting...');
        
        var viewport = document.getElementById('trendingViewport');
        if (!viewport) return console.error('No viewport');
        
        var track = viewport.querySelector('.home-trend-list');
        if (!track) return console.error('No track');
        
        var cards = Array.from(track.querySelectorAll('.home-trend-card'));
        console.log('Cards:', cards.length);
        if (cards.length === 0) return;
        
        var index = 0;
        var timer = null;
        var moving = false;
        
        // Clone
        cards.forEach(function(c) {
            track.appendChild(c.cloneNode(true));
        });
        cards.forEach(function(c) {
            track.insertBefore(c.cloneNode(true), track.firstChild);
        });
        
        index = cards.length;
        
        function move(animate) {
            var w = cards[0].offsetWidth + 28;
            track.style.transition = animate ? 'transform 0.6s ease' : 'none';
            track.style.transform = 'translateX(-' + (index * w) + 'px)';
            console.log('Index:', index);
        }
        
        function next() {
            if (moving) return;
            moving = true;
            index++;
            move(true);
            setTimeout(function() {
                if (index >= cards.length * 2) {
                    index = cards.length;
                    move(false);
                }
                moving = false;
            }, 600);
        }
        
        function start() {
            if (timer) clearInterval(timer);
            timer = setInterval(next, 5000);
            console.log('Auto started');
        }
        
        function stop() {
            if (timer) clearInterval(timer);
        }
        
        move(false);
        
        var nextBtn = document.querySelector('.home-trend-nav-btn--next');
        var prevBtn = document.querySelector('.home-trend-nav-btn--prev');
        
        if (nextBtn) nextBtn.onclick = function() { stop(); next(); start(); };
        if (prevBtn) prevBtn.onclick = function() {
            if (moving) return;
            moving = true;
            index--;
            move(true);
            setTimeout(function() {
                if (index < cards.length) {
                    index = cards.length * 2 - 1;
                    move(false);
                }
                moving = false;
            }, 600);
            stop(); start();
        };
        
        viewport.onmouseenter = stop;
        viewport.onmouseleave = start;
        
        start();
        console.log('Done!');
    }
})();