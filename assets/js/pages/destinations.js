const OPENWEATHER_API_KEY = '1a9ed9c72e3e2b12073d5915c0d80536';

/* ========= DATA ========= */
let destinations = [];
let tripData = [];
let bestTimeData = {};
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
        const response = await fetch('/data.json');

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const jsonData = await response.json();

        // Load bestTimeData from JSON
        if (jsonData.bestTimeData) {
            bestTimeData = jsonData.bestTimeData;
            console.log('Best time data loaded');
        }

        if (jsonData.data && jsonData.data.length > 0) {
            destinations = [];
            tripData = [];

            jsonData.data.forEach((tour) => {
                const country = tour.country;
                const region = countryToRegion[country] || 'Asia';
                const baseVisits = tour.visits || Math.floor(Math.random() * 200) + 50;
                const baseTours = tour.tours || Math.floor(Math.random() * 50) + 5;

                tour.places.forEach((place) => {
                    const destination = {
                        name: place.city,
                        region: region,
                        country: country,
                        img:
                            place.famous_locations && place.famous_locations.length > 0
                                ? place.famous_locations[0].image_url
                                : `../assets/images/destinations/${country}.png`,
                        short: place.shortdesc,
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

                    const trip = {
                        name: `${place.city}, ${country}`,
                        interest: place.interest || 'city',
                        region: region,
                        costPerDay:
                            tour.price && tour.days
                                ? Math.floor(tour.price / tour.days / 23000)
                                : Math.floor(Math.random() * 200) + 100,
                        description: place.shortdesc,
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

            console.log(`Loaded ${destinations.length} destinations from ${jsonData.data.length} tours`);
            isDataLoaded = true;
            return true;
        }
    } catch (error) {
        console.error('Error loading data from JSON:', error);
        loadFallbackData();
        return false;
    }
}

function loadFallbackData() {
    console.warn('Using fallback data');

    // Fallback bestTimeData
    bestTimeData = {
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
            ],
        },
    };

    destinations = [
        {
            name: 'Switzerland',
            region: 'Europe',
            country: 'Switzerland',
            img: '../assets/images/destinations/Switzerland.png',
            short: 'A breathtaking land of snow-capped Alps.',
            long: 'Switzerland captivates travelers.',
            lat: 46.8182,
            lon: 8.2275,
            tours: 12,
            rating: 4.8,
            gallery: ['../assets/images/destinations/Switzerland.png'],
            visits: 120,
            interest: 'mountain',
        },
    ];

    tripData = [
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
let sortMode = 'visited-desc'; // Đặt mặc định là "Most visited"

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
    if (!top5List) return;

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

        const wrapperDiv = document.createElement('div');
        wrapperDiv.className = 'top-item';
        wrapperDiv.innerHTML = `
      <div class="name">${d.name}</div>
      <div class="bar">
        <i style="width:${percent}%;"></i>
      </div>
      <div class="num">${visits}</div>
    `;
        top5List.appendChild(wrapperDiv);
    });
}

function renderDestinations() {
    if (!wrapper) return;

    wrapper.innerHTML = '';
    const arr = getFilteredSorted();
    const items = arr.slice(0, visibleCount);

    items.forEach((item) => {
        const isWish = wishlist.includes(item.name);
        const card = document.createElement('div');
        card.className = 'destination-card';

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

    setTimeout(() => observeImages(), 100);

    if (loadMoreBtn) {
        if (visibleCount >= getFilteredSorted().length) loadMoreBtn.style.display = 'none';
        else loadMoreBtn.style.display = 'inline-block';
    }

    renderTop5();
}

/* ========== RENDER TOP DESTINATIONS SLIDER ========== */
function renderTopDestinations() {
    const topdestTrack = document.querySelector('.topdest-track');
    if (!topdestTrack) return;

    const topDests = [...destinations]
        .sort((a, b) => (visitsStore[b.name] || 0) - (visitsStore[a.name] || 0))
        .slice(0, 8);

    topdestTrack.innerHTML = '';

    topDests.forEach((dest) => {
        const card = document.createElement('div');
        card.className = 'topdest-card';
        card.innerHTML = `
      <img data-src="${dest.img}" alt="${dest.name}" class="lazy-image" style="background:#f0f0f0;">
      <div class="topdest-overlay">
        <h3>${dest.name}, ${dest.country}</h3>
        <p>${dest.short}</p>
      </div>
    `;
        topdestTrack.appendChild(card);
    });

    setTimeout(() => observeImages(), 100);
    setupTopDestSlider();
}

/* ========== TOP DESTINATIONS SLIDER CONTROLS ========== */
function setupTopDestSlider() {
    const topdestTrack = document.querySelector('.topdest-track');
    const topdestCards = document.querySelectorAll('.topdest-card');
    const prevBtn = document.querySelector('.slide-btn.prev');
    const nextBtn = document.querySelector('.slide-btn.next');

    if (!topdestTrack || !topdestCards.length || !prevBtn || !nextBtn) return;

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

/* ========== EVENTS ========== */
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.trim();
        visibleCount = 6;
        renderDestinations();
    });
}

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

if (sortSelect) {
    // Set giá trị mặc định của dropdown
    sortSelect.value = 'visited-desc';

    sortSelect.addEventListener('change', (e) => {
        sortMode = e.target.value;
        renderDestinations();
    });
}

if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
        visibleCount += 6;
        renderDestinations();
    });
}

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

if (modalClose) modalClose.addEventListener('click', closeModal);
if (detailModal) {
    detailModal.addEventListener('click', (e) => {
        if (e.target === detailModal) closeModal();
    });
}

const ctaExplore = document.getElementById('ctaExplore');
if (ctaExplore) {
    ctaExplore.addEventListener('click', () => {
        const filterSection = document.querySelector('.filter-section');
        if (filterSection) {
            window.scrollTo({
                top: filterSection.offsetTop - 10,
                behavior: 'smooth',
            });
        }
    });
}

const btnSub = document.getElementById('btnSub');
if (btnSub) {
    btnSub.addEventListener('click', () => {
        const emailInput = document.getElementById('emailSub');
        if (!emailInput) return;
        const email = emailInput.value.trim();
        if (!email) {
            alert('Enter email');
            return;
        }
        alert('Thanks! Subscribed: ' + email);
        emailInput.value = '';
    });
}

/* ========== DETAILS MODAL ========== */
function openDetailModal(name) {
    const item = destinations.find((d) => d.name === name);
    if (!item) return;

    if (!visitsStore[item.name]) visitsStore[item.name] = 0;
    visitsStore[item.name]++;
    persistVisits();
    renderTop5(activeRegion);

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
    if (!OPENWEATHER_API_KEY || !weatherContent) {
        if (weatherContent) {
            weatherContent.innerHTML = `
        <div style="color:#666">
          No API key set.
        </div>`;
        }
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

        // Giới hạn chỉ hiển thị 3 kết quả
        const limitedMatches = matches.slice(0, 3);

        limitedMatches.forEach((trip) => {
            const totalCost = trip.costPerDay * days;
            const suggestion = document.createElement('div');
            suggestion.classList.add('trip-suggestion');
            suggestion.innerHTML = `
        <img data-src="${trip.image}" alt="${trip.name}" class="lazy-image" style="background:#f0f0f0;" />
        <div class="trip-info">
          <h3>${trip.name}</h3>
          <p>${trip.description}</p>
          <p>Estimated cost: <span class="price">${totalCost.toLocaleString()}</span></p>
          <p>Best for: ${trip.interest}</p>
        </div>
      `;
            tripResults.appendChild(suggestion);
        });

        if (matches.length > 3) {
            const moreInfo = document.createElement('p');
            moreInfo.style.textAlign = 'center';
            moreInfo.style.marginTop = '20px';
            moreInfo.style.color = '#666';
            moreInfo.innerHTML = `<em>+${matches.length - 3} more destinations match your criteria</em>`;
            tripResults.appendChild(moreInfo);
        }

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

/* ========== INITIALIZATION ========== */
async function initializeApp() {
    console.log('Initializing Travel Destinations App...');

    if (wrapper) {
        wrapper.innerHTML = `
      <div style="text-align:center; padding:60px 20px; color:#666;">
        <div style="font-size:48px; margin-bottom:20px;">✈️</div>
        <h3 style="margin-bottom:10px;">Loading amazing destinations...</h3>
        <p>Please wait while we prepare your journey</p>
      </div>
    `;
    }

    setupLazyLoading();

    const dataLoaded = await fetchDestinationsData();

    if (dataLoaded) {
        console.log('Data loaded successfully!');
    } else {
        console.warn('Using fallback data');
    }

    initializeVisitsStore();

    renderDestinations();
    renderTop5();
    renderTopDestinations();
    persistVisits();

    const defaultRegion = 'All';
    renderBestTime('Asia');
    const defaultCard = document.querySelector(`[data-region="${defaultRegion}"]`);
    if (defaultCard) defaultCard.classList.add('active');

    console.log('App initialized successfully!');
    console.log(`Total destinations: ${destinations.length}`);
    console.log(`Trip options: ${tripData.length}`);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}
