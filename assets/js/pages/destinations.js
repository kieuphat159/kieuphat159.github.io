const OPENWEATHER_API_KEY = '1a9ed9c72e3e2b12073d5915c0d80536';

/* ========= DATA ========= */
let destinations = [];
let tripData = [];
let isDataLoaded = false;

// Map quốc gia sang region
const countryToRegion = {
    'Việt Nam': 'Asia',
    'Nhật Bản': 'Asia',
    Pháp: 'Europe',
    Ý: 'Europe',
    Mỹ: 'America',
    'Thái Lan': 'Asia',
    'Hàn Quốc': 'Asia',
    Úc: 'Oceania',
    'Ai Cập': 'Africa',
    'Tây Ban Nha': 'Europe',
    Canada: 'America',
    'Ấn Độ': 'Asia',
    Brazil: 'America',
    'Thổ Nhĩ Kỳ': 'Europe',
    'New Zealand': 'Oceania',
    Anh: 'Europe',
};

// Data: thời gian du lịch tốt nhất cho từng region
const bestTimeData = {
    Asia: {
        video: '../assets/images/destinations/1.mp4',
        seasons: [
            {
                icon: '❄️',
                title: 'Winter (Dec – Feb)',
                suitability: '4.5/5',
                crowd: 'Low',
                best: 'Cool weather, tropical spots like Thailand.',
                consider: 'Some northern areas can be cold.',
            },
            {
                icon: '🌸',
                title: 'Spring (Mar – May)',
                suitability: '5.0/5',
                crowd: 'Medium',
                best: 'Perfect weather, cherry blossom festivals.',
                consider: 'Prices rise in Japan & Korea.',
            },
            {
                icon: '☀️',
                title: 'Summer (Jun – Aug)',
                suitability: '3.5/5',
                crowd: 'High',
                best: 'Beach season, school holidays.',
                consider: 'Very hot & humid in many regions.',
            },
            {
                icon: '🍁',
                title: 'Autumn (Sep – Nov)',
                suitability: '4.8/5',
                crowd: 'Medium-Low',
                best: 'Pleasant temps, colorful scenery.',
                consider: 'Typhoons possible in some regions.',
            },
        ],
    },
    Europe: {
        video: '../assets/images/destinations/2.mp4',
        seasons: [
            {
                icon: '❄️',
                title: 'Winter (Dec – Feb)',
                suitability: '3.8/5',
                crowd: 'Low',
                best: 'Christmas markets & snowy adventures.',
                consider: 'Cold weather limits some outdoor trips.',
            },
            {
                icon: '🌸',
                title: 'Spring (Mar – May)',
                suitability: '4.9/5',
                crowd: 'Medium',
                best: 'Mild weather & fewer crowds.',
                consider: 'Some northern areas still chilly.',
            },
            {
                icon: '☀️',
                title: 'Summer (Jun – Aug)',
                suitability: '4.2/5',
                crowd: 'High',
                best: 'Festivals & long sunny days.',
                consider: 'Tourist season, higher prices.',
            },
            {
                icon: '🍁',
                title: 'Autumn (Sep – Nov)',
                suitability: '4.7/5',
                crowd: 'Medium-Low',
                best: 'Golden scenery & wine festivals.',
                consider: 'Shorter days approaching winter.',
            },
        ],
    },
    America: {
        video: '../assets/images/destinations/3.mp4',
        seasons: [
            {
                icon: '❄️',
                title: 'Winter (Dec – Feb)',
                suitability: '4.0/5',
                crowd: 'Low',
                best: 'Warm destinations like Florida or Mexico.',
                consider: 'Snow in the north; avoid blizzards.',
            },
            {
                icon: '🌸',
                title: 'Spring (Mar – May)',
                suitability: '4.7/5',
                crowd: 'Medium',
                best: 'National parks & city blooms.',
                consider: 'Allergies during pollen season.',
            },
            {
                icon: '☀️',
                title: 'Summer (Jun – Aug)',
                suitability: '4.3/5',
                crowd: 'High',
                best: 'Road trips, beaches, festivals.',
                consider: 'Tourist crowds, high temps in deserts.',
            },
            {
                icon: '🍁',
                title: 'Autumn (Sep – Nov)',
                suitability: '5.0/5',
                crowd: 'Medium-Low',
                best: 'Fall foliage & cozy weather.',
                consider: 'Hurricane season on east coast.',
            },
        ],
    },
    Africa: {
        video: '../assets/images/destinations/4.mp4',
        seasons: [
            {
                icon: '❄️',
                title: 'Winter (Jun – Aug)',
                suitability: '4.6/5',
                crowd: 'Medium',
                best: 'Cooler weather for safaris in East Africa.',
                consider: 'Southern regions can be cold at night.',
            },
            {
                icon: '🌸',
                title: 'Spring (Sep – Nov)',
                suitability: '4.9/5',
                crowd: 'Low-Medium',
                best: 'Perfect for wildlife & coastal escapes.',
                consider: 'Some rains in tropical regions.',
            },
            {
                icon: '☀️',
                title: 'Summer (Dec – Feb)',
                suitability: '4.0/5',
                crowd: 'High',
                best: 'Beach holidays & Cape Town vineyards.',
                consider: 'Hot inland & safari lodges busy.',
            },
            {
                icon: '🍁',
                title: 'Autumn (Mar – May)',
                suitability: '4.4/5',
                crowd: 'Medium',
                best: 'Dry season starts — great for safaris.',
                consider: 'Variable weather in north regions.',
            },
        ],
    },
    Oceania: {
        video: '../assets/images/destinations/5.mp4',
        seasons: [
            {
                icon: '❄️',
                title: 'Winter (Jun – Aug)',
                suitability: '4.3/5',
                crowd: 'Medium-Low',
                best: 'Mild temps, great surfing & whale watching.',
                consider: "Snow in New Zealand's south.",
            },
            {
                icon: '🌸',
                title: 'Spring (Sep – Nov)',
                suitability: '5.0/5',
                crowd: 'Medium',
                best: 'Ideal for beaches, nature & road trips.',
                consider: 'Allergy season in some areas.',
            },
            {
                icon: '☀️',
                title: 'Summer (Dec – Feb)',
                suitability: '4.6/5',
                crowd: 'High',
                best: 'Beach season, outdoor festivals.',
                consider: 'Can be very hot in inland Australia.',
            },
            {
                icon: '🍁',
                title: 'Autumn (Mar – May)',
                suitability: '4.8/5',
                crowd: 'Low-Medium',
                best: 'Comfortable temps & fewer tourists.',
                consider: 'Some rain in tropical areas.',
            },
        ],
    },
};

/* ========= LAZY LOADING SETUP ========= */
let imageObserver = null;

function setupLazyLoading() {
    const imageObserverConfig = {
        rootMargin: '50px 0px',
        threshold: 0.01,
    };

    imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const img = entry.target;
                const src = img.getAttribute('data-src');

                if (src) {
                    img.src = src;
                    img.removeAttribute('data-src');
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            }
        });
    }, imageObserverConfig);
}

function observeImages() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach((img) => {
        if (imageObserver) {
            imageObserver.observe(img);
        }
    });
}

/* ========= FETCH DATA ========= */
async function fetchDestinationsData() {
    try {
        // Thay đổi path này cho phù hợp với cấu trúc thư mục của bạn
        const response = await fetch('/data.json');

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const jsonData = await response.json();

        if (jsonData.data && jsonData.data.length > 0) {
            destinations = [];
            tripData = [];

            // Lặp qua tất cả các tour
            jsonData.data.forEach((tour) => {
                const country = tour.country;
                const region = countryToRegion[country] || 'Asia';
                const baseVisits = tour.visits || Math.floor(Math.random() * 200) + 50;
                const baseTours = tour.tours || Math.floor(Math.random() * 50) + 5;

                // Lặp qua tất cả các địa điểm trong tour
                tour.places.forEach((place, index) => {
                    // Tạo destination
                    const destination = {
                        name: place.city,
                        region: region,
                        country: country,
                        img:
                            place.famous_locations && place.famous_locations.length > 0
                                ? place.famous_locations[0].image_url
                                : `../assets/images/destinations/${country}.png`,
                        short: place.blog.substring(0, 150) + '...',
                        long: place.blog,
                        lat: place.lat,
                        lon: place.lon,
                        tours: baseTours
                            ? Math.floor(baseTours / tour.places.length)
                            : Math.floor(Math.random() * 20) + 5,
                        rating: tour.rating || 4.5,
                        gallery:
                            place.famous_locations && place.famous_locations.length > 0
                                ? place.famous_locations.map((loc) => loc.image_url)
                                : [`../assets/images/destinations/${country}.png`],
                        visits: baseVisits
                            ? Math.floor(baseVisits / tour.places.length) + Math.floor(Math.random() * 50)
                            : Math.floor(Math.random() * 100) + 20,
                        interest: place.interest || 'city',
                        famous_locations: place.famous_locations || [],
                        tourId: tour.id,
                        tourTitle: tour.title,
                        tourDays: tour.days,
                        tourPrice: tour.price,
                    };

                    destinations.push(destination);

                    // Tạo tripData
                    const trip = {
                        name: `${place.city}, ${country}`,
                        interest: place.interest || 'city',
                        region: region,
                        costPerDay:
                            tour.price && tour.days
                                ? Math.floor(tour.price / tour.days / 23000) // Chuyển VND sang USD
                                : Math.floor(Math.random() * 200) + 100,
                        description: place.blog.substring(0, 200) + '...',
                        image:
                            place.famous_locations && place.famous_locations.length > 0
                                ? place.famous_locations[0].image_url
                                : `../assets/images/destinations/${country}.png`,
                        days: tour.days || 7,
                        price: tour.price || 0,
                    };

                    tripData.push(trip);
                });
            });

            console.log(`✅ Loaded ${destinations.length} destinations from ${jsonData.data.length} tours`);
            isDataLoaded = true;
            return true;
        }
    } catch (error) {
        console.error('❌ Error loading data from JSON:', error);
        loadFallbackData();
        return false;
    }
}

function loadFallbackData() {
    console.warn('⚠️ Using fallback data');

    destinations = [
        {
            name: 'Switzerland',
            region: 'Europe',
            country: 'Switzerland',
            img: '../assets/images/destinations/Switzerland.png',
            short: 'A breathtaking land of snow-capped Alps, crystal-clear lakes, and timeless Swiss charm.',
            long: 'Switzerland captivates travelers with its extraordinary mix of natural beauty and refined culture.',
            lat: 46.8182,
            lon: 8.2275,
            tours: 12,
            rating: 4.8,
            gallery: ['../assets/images/destinations/Switzerland.png'],
            visits: 120,
            interest: 'mountain',
        },
        {
            name: 'Maldives',
            region: 'Asia',
            country: 'Maldives',
            img: '../assets/images/destinations/Maldives.png',
            short: 'Turquoise water, white sand and luxury lodges.',
            long: 'The Maldives are famed for private island resorts, coral reefs and crystal clear water.',
            lat: 3.2028,
            lon: 73.2207,
            tours: 8,
            rating: 4.9,
            gallery: ['../assets/images/destinations/Maldives.png'],
            visits: 210,
            interest: 'beach',
        },
        {
            name: 'Thailand',
            region: 'Asia',
            country: 'Thailand',
            img: '../assets/images/destinations/Thailand.png',
            short: 'Beaches, street food and temples.',
            long: 'Thailand is famous for its cuisine, island beaches, and vibrant cities.',
            lat: 15.87,
            lon: 100.9925,
            tours: 30,
            rating: 4.7,
            gallery: ['../assets/images/destinations/Thailand.png'],
            visits: 180,
            interest: 'food',
        },
    ];

    tripData = [
        {
            name: 'Bali, Indonesia',
            interest: 'beach',
            region: 'Asia',
            costPerDay: 150,
            description: 'Relax on pristine beaches, explore temples, and enjoy tropical vibes.',
            image: '../assets/images/destinations/Indonesia.png',
        },
        {
            name: 'Swiss Alps, Switzerland',
            interest: 'mountain',
            region: 'Europe',
            costPerDay: 250,
            description: 'Breathtaking peaks, skiing, and scenic mountain villages.',
            image: '../assets/images/destinations/Switzerland.png',
        },
    ];

    isDataLoaded = true;
}

/* ========= STATE ========= */
let visibleCount = 6;
let activeRegion = 'All';
let searchQuery = '';
let sortMode = 'default';

let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
let visitsStore = JSON.parse(localStorage.getItem('visits')) || {};

function initializeVisitsStore() {
    if (Object.keys(visitsStore).length === 0) {
        destinations.forEach((d) => (visitsStore[d.name] = d.visits || 0));
    }
}

/* ======= DOM ======= */
const wrapper = document.querySelector('.destinations-grid__wrapper');
const searchInput = document.getElementById('searchInput');
const loadMoreBtn = document.getElementById('loadMoreBtn');
const filterBtns = document.querySelectorAll('.filter-btn');
const sortSelect = document.getElementById('sortSelect');
const top5List = document.getElementById('top5List');
const detailModal = document.getElementById('detailModal');
const modalClose = document.getElementById('modalClose');

const weatherContent = document.getElementById('weatherContent');
const swiperWrapper = document.getElementById('swiperWrapper');
const detailName = document.getElementById('detailName');
const detailShort = document.getElementById('detailShort');
const detailLong = document.getElementById('detailLong');
const detailRating = document.getElementById('detailRating');
const detailTours = document.getElementById('detailTours');

let currentSlide = 0;
let mapInstance = null;
let mapMarker = null;

/* ======= HELPERS ======= */
function persistVisits() {
    localStorage.setItem('visits', JSON.stringify(visitsStore));
}

function persistWishlist() {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
}

function getFilteredSorted() {
    const filtered = destinations.filter((item) => {
        const matchRegion = activeRegion === 'All' || item.region === activeRegion;
        const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchRegion && matchSearch;
    });

    const arr = [...filtered];
    if (sortMode === 'rating-desc') arr.sort((a, b) => b.rating - a.rating);
    else if (sortMode === 'rating-asc') arr.sort((a, b) => a.rating - b.rating);
    else if (sortMode === 'tours-desc') arr.sort((a, b) => b.tours - a.tours);
    else if (sortMode === 'visited-desc') arr.sort((a, b) => (visitsStore[b.name] || 0) - (visitsStore[a.name] || 0));
    return arr;
}

function renderTop5(region = 'All') {
    let filtered = [];

    if (region === 'All') {
        filtered = [...destinations];
    } else {
        filtered = destinations.filter((d) => d.region.toLowerCase() === region.toLowerCase());
    }

    if (filtered.length === 0) {
        top5List.innerHTML = `
      <div class="empty">
        <p>No destinations found for this region yet.</p>
        <small>Try exploring a different region!</small>
      </div>`;
        return;
    }

    const sorted = filtered.sort((a, b) => (visitsStore[b.name] || 0) - (visitsStore[a.name] || 0));

    const arr = sorted.slice(0, 5);
    top5List.innerHTML = '';
    const max = Math.max(...arr.map((d) => visitsStore[d.name] || 0), 1);

    arr.forEach((d) => {
        const visits = visitsStore[d.name] || 0;
        const percent = Math.round((visits / max) * 100);

        const wrapper = document.createElement('div');
        wrapper.className = 'top-item';
        wrapper.innerHTML = `
      <div class="name">${d.name}</div>
      <div class="bar">
        <i style="width:${percent}%;"></i>
      </div>
      <div class="num">${visits}</div>
    `;
        top5List.appendChild(wrapper);
    });
}

function renderDestinations() {
    wrapper.innerHTML = '';
    const arr = getFilteredSorted();
    const items = arr.slice(0, visibleCount);

    items.forEach((item) => {
        const isWish = wishlist.includes(item.name);
        const card = document.createElement('div');
        card.className = 'destination-card';

        // Sử dụng data-src cho lazy loading
        card.innerHTML = `
      <div class="wishlist-btn ${isWish ? 'active' : ''}" data-name="${item.name}" title="Add to wishlist">
        <i class="fas fa-heart"></i>
      </div>

      <div class="destination-card__image">
        <img data-src="${item.img}" alt="${item.name}" class="lazy-image" style="background:#f0f0f0;">
      </div>

      <div class="destination-card__body">
        <div class="card-body-top">
          <div>
            <div class="destination-card__title">${item.name}</div>
            <div class="meta-small">
              <span class="pill">${item.tours} tours</span>
              <span>⭐ ${item.rating}</span>
            </div>
          </div>
          <button class="view-details" data-name="${item.name}">View details</button>
        </div>
        <div class="meta-small">${item.region}</div>
      </div>
    `;

        wrapper.appendChild(card);
    });

    // Sau khi render xong, setup lazy loading cho các ảnh mới
    setTimeout(() => observeImages(), 100);

    if (visibleCount >= getFilteredSorted().length) loadMoreBtn.style.display = 'none';
    else loadMoreBtn.style.display = 'inline-block';

    renderTop5();
}

/* ========== TOP DESTINATIONS SLIDER ========== */
const topdestTrack = document.querySelector('.topdest-track');
const topdestCards = document.querySelectorAll('.topdest-card');
const prevBtn = document.querySelector('.slide-btn.prev');
const nextBtn = document.querySelector('.slide-btn.next');

if (topdestTrack && topdestCards.length && prevBtn && nextBtn) {
    let currentIndex = 0;

    function getCardWidth() {
        const card = topdestCards[0];
        const style = window.getComputedStyle(topdestTrack);
        const gap = parseFloat(style.gap) || 0;
        return card.offsetWidth + gap;
    }

    function updateSlide() {
        const cardWidth = getCardWidth();
        topdestTrack.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
    }

    function getVisibleCards() {
        const windowWidth = topdestTrack.parentElement.offsetWidth;
        const cardWidth = getCardWidth();
        return Math.floor(windowWidth / cardWidth);
    }

    function getMaxIndex() {
        const visibleCards = getVisibleCards();
        return Math.max(0, topdestCards.length - visibleCards);
    }

    nextBtn.addEventListener('click', () => {
        const maxIndex = getMaxIndex();
        if (currentIndex < maxIndex) {
            currentIndex++;
            updateSlide();
        }
    });

    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateSlide();
        }
    });

    window.addEventListener('resize', () => {
        currentIndex = 0;
        updateSlide();
    });
}

/* ========== INITIALIZATION ========== */
async function initializeApp() {
    console.log('Initializing Travel Destinations App...');

    // Show loading state
    if (wrapper) {
        wrapper.innerHTML = `
      <div style="text-align:center; padding:60px 20px; color:#666;">
        <div style="font-size:48px; margin-bottom:20px;">✈️</div>
        <h3 style="margin-bottom:10px;">Loading amazing destinations...</h3>
        <p>Please wait while we prepare your journey</p>
      </div>
    `;
    }

    // Setup lazy loading
    setupLazyLoading();

    // Fetch data from JSON
    const dataLoaded = await fetchDestinationsData();

    if (dataLoaded) {
        console.log('✅ Data loaded successfully!');
    } else {
        console.warn('⚠️ Using fallback data');
    }

    // Initialize visits store
    initializeVisitsStore();

    // Render everything
    renderDestinations();
    renderTop5();
    persistVisits();

    // Initialize best time section with default region
    const defaultRegion = 'Asia';
    renderBestTime(defaultRegion);
    const defaultCard = document.querySelector(`[data-region="${defaultRegion}"]`);
    if (defaultCard) defaultCard.classList.add('active');

    console.log('✨ App initialized successfully!');
    console.log(`📍 Total destinations: ${destinations.length}`);
    console.log(`🎯 Trip options: ${tripData.length}`);
}

// Start the app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}
searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value.trim();
    visibleCount = 6;
    renderDestinations();
});

filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
        filterBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        activeRegion = btn.dataset.region;
        visibleCount = 6;
        renderDestinations();
        renderTop5(activeRegion);
    });
});

sortSelect.addEventListener('change', (e) => {
    sortMode = e.target.value;
    renderDestinations();
});

document.getElementById('loadMoreBtn').addEventListener('click', () => {
    visibleCount += 6;
    renderDestinations();
});

document.addEventListener('click', (e) => {
    const w = e.target.closest('.wishlist-btn');
    if (w) {
        const name = w.dataset.name;
        if (wishlist.includes(name)) wishlist = wishlist.filter((n) => n !== name);
        else wishlist.push(name);
        persistWishlist();
        renderDestinations();
        return;
    }

    const vd = e.target.closest('.view-details');
    if (vd) {
        const name = vd.dataset.name;
        openDetailModal(name);
    }
});

modalClose.addEventListener('click', closeModal);
detailModal.addEventListener('click', (e) => {
    if (e.target === detailModal) closeModal();
});

document.getElementById('ctaExplore')?.addEventListener('click', () => {
    window.scrollTo({
        top: document.querySelector('.filter-section').offsetTop - 10,
        behavior: 'smooth',
    });
});

document.getElementById('btnSub')?.addEventListener('click', () => {
    const email = document.getElementById('emailSub').value.trim();
    if (!email) {
        alert('Enter email');
        return;
    }
    alert('Thanks! Subscribed: ' + email);
});

/* ========== DETAILS MODAL ========== */
function openDetailModal(name) {
    const item = destinations.find((d) => d.name === name);
    if (!item) return;

    // Tăng lượt xem
    if (!visitsStore[item.name]) visitsStore[item.name] = 0;
    visitsStore[item.name]++;
    persistVisits();

    detailName.textContent = item.name;
    detailShort.textContent = item.short;
    detailLong.textContent = item.long;
    detailRating.textContent = `⭐ ${item.rating}`;
    detailTours.textContent = `${item.tours} tours`;

    const images = item.gallery && item.gallery.length ? item.gallery : [item.img];
    swiperWrapper.innerHTML = images
        .map(
            (src, i) =>
                `<div class="slide" style="display:${i === 0 ? 'block' : 'none'};">
          <img src="${src}" alt="${item.name}" />
        </div>`,
        )
        .join('');

    currentSlide = 0;
    detailModal.classList.add('open');

    fetchWeather(item);
    setTimeout(() => initMap(item.lat, item.lon, item.name), 100);
}

function closeModal() {
    detailModal.classList.remove('open');
}

async function fetchWeather(item) {
    if (!OPENWEATHER_API_KEY) {
        weatherContent.innerHTML = `
      <div style="color:#666">
        No API key set. Provide OPENWEATHER_API_KEY in js/destinations.js to fetch live weather.
      </div>
      <div style="margin-top:8px"><strong>Approx:</strong> Best season shown in description.</div>
    `;
        return;
    }

    try {
        weatherContent.innerHTML = 'Fetching weather...';
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${item.lat}&lon=${item.lon}&units=metric&appid=${OPENWEATHER_API_KEY}`;
        const resp = await fetch(url);
        if (!resp.ok) throw new Error('Weather fetch failed');
        const data = await resp.json();

        const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

        const html = `
      <div style="display:flex; align-items:center; gap:10px">
        <img src="${iconUrl}" alt="${data.weather[0].description}" style="width:50px; height:50px">
        <div>
          <div><strong>${data.name || item.name}</strong></div>
          <div style="font-size:18px; margin:4px 0">
            ${Math.round(data.main.temp)}°C — ${data.weather[0].description}
          </div>
          <div>Humidity: ${data.main.humidity}%</div>
          <div>Wind: ${Math.round(data.wind.speed)} m/s</div>
        </div>
      </div>
    `;
        weatherContent.innerHTML = html;
    } catch (err) {
        weatherContent.innerHTML = `<div style="color:#c00">Unable to fetch weather.</div>`;
        console.error(err);
    }
}

/* ========== TRIP PLANNER ========== */
const tripForm = document.getElementById('tripForm');
const tripResults = document.getElementById('tripResults');

if (tripForm && tripResults) {
    tripForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const budget = parseInt(document.getElementById('budget').value);
        const days = parseInt(document.getElementById('days').value);
        const interest = document.getElementById('interest').value;
        const region = document.getElementById('region').value;

        if (isNaN(budget) || isNaN(days) || days <= 0) {
            tripResults.innerHTML = `<p>Please enter a valid budget and number of days.</p>`;
            return;
        }

        const totalBudget = budget / days;

        const matches = tripData.filter((trip) => {
            const matchInterest = trip.interest === interest;
            const matchBudget = totalBudget >= trip.costPerDay * 0.7;
            const matchRegion = region.toLowerCase() === 'all' || trip.region.toLowerCase() === region.toLowerCase();
            return matchInterest && matchBudget && matchRegion;
        });

        tripResults.innerHTML = '';

        if (matches.length === 0) {
            tripResults.innerHTML = `<p>No matching destinations found — try increasing your budget or changing interest.</p>`;
            return;
        }

        matches.forEach((trip) => {
            const totalCost = trip.costPerDay * days;
            const suggestion = document.createElement('div');
            suggestion.classList.add('trip-suggestion');
            suggestion.innerHTML = `
        <img data-src="${trip.image}" alt="${trip.name}" class="lazy-image" style="background:#f0f0f0;" />
        <div class="trip-info">
          <h3>${trip.name}</h3>
          <p>${trip.description}</p>
          <p>Estimated cost: <span class="price">$${totalCost.toLocaleString()}</span></p>
          <p>Best for: ${trip.interest}</p>
        </div>
      `;
            tripResults.appendChild(suggestion);
        });

        // Lazy load trip images
        setTimeout(() => observeImages(), 100);
    });
}

/* ========== COUNTER ANIMATION ========== */
const counters = document.querySelectorAll('.count');
counters.forEach((counter) => {
    const update = () => {
        const target = +counter.getAttribute('data-target');
        const current = +counter.innerText;
        const increment = target / 100;
        if (current < target) {
            counter.innerText = Math.ceil(current + increment);
            setTimeout(update, 30);
        } else counter.innerText = target;
    };
    update();
});

/* ========== MAP ========== */
function initMap(lat, lon, name) {
    const mapDiv = document.getElementById('map');
    if (mapDiv) {
        mapDiv.innerHTML = `
      <iframe
        width="100%"
        height="300"
        frameborder="0"
        style="border-radius:10px"
        src="https://www.google.com/maps?q=${lat},${lon}&hl=en&z=6&output=embed"
        allowfullscreen
        loading="lazy">
      </iframe>
    `;
    }
}

/* ========== BEST TIME TO VISIT ========== */
const regionCards = document.querySelectorAll('.region-card');
const regionNameEl = document.getElementById('regionName');
const bestTimeVideoBg = document.getElementById('bestTimeVideoBg');
const seasonContainer = document.getElementById('seasonContainer');

function renderBestTime(region) {
    const regionData = bestTimeData[region];
    if (!regionData) return;

    if (regionNameEl) regionNameEl.textContent = region;

    if (bestTimeVideoBg) {
        const source = bestTimeVideoBg.querySelector('source');
        if (source) {
            source.src = regionData.video;
            bestTimeVideoBg.load();
        }
    }

    if (seasonContainer) {
        seasonContainer.innerHTML = regionData.seasons
            .map(
                (s) => `
        <div class="season-card">
          <div class="icon">${s.icon}</div>
          <h3>${s.title}</h3>
          <p>Suitability: <span>${s.suitability}</span></p>
          <p>Crowd Level: ${s.crowd}</p>
          <p><strong>Best for:</strong> ${s.best}</p>
          <p><strong>Consider:</strong> ${s.consider}</p>
        </div>`,
            )
            .join('');
    }
}

regionCards.forEach((card) => {
    card.addEventListener('click', () => {
        regionCards.forEach((c) => c.classList.remove('active'));
        card.classList.add('active');
        const region = card.dataset.region;
        renderBestTime(region);
    });
});
