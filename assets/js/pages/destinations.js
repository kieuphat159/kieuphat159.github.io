const OPENWEATHER_API_KEY = "1a9ed9c72e3e2b12073d5915c0d80536";
// const YOUR_GOOGLE_API_KEY = "";

// https://api.openweathermap.org/data/2.5/weather?q=Tokyo&units=metric&appid=1a9ed9c72e3e2b12073d5915c0d80536

/* ========= DATA ========= */
/* mỗi destination có: name, region, img, short, long, lat, lon, tours, rating, gallery[], visits */
const destinations = [
  {
    name: "Switzerland",
    region: "Europe",
    img: "../assets/images/destinations/Switzerland.png",
    short:
      "A breathtaking land of snow-capped Alps, crystal-clear lakes, and timeless Swiss charm — where every turn feels like stepping into a postcard.",
    long: "Switzerland captivates travelers with its extraordinary mix of natural beauty and refined culture. Towering peaks like the Matterhorn and Jungfrau dominate the horizon, while tranquil lakes such as Geneva, Lucerne, and Zurich shimmer with pristine clarity. The air feels crisp and pure, perfect for mountain hikes, scenic train rides, or cozy evenings in wooden chalets. Beyond its alpine landscapes, Switzerland is also a country of precision and sophistication — from world-class chocolate and luxury watches to multilingual cities brimming with art, music, and history. Whether you’re skiing in Zermatt, cruising on Lake Lucerne, exploring medieval castles, or simply enjoying fondue in a lakeside café, Switzerland promises a serene escape filled with unforgettable moments.",
    lat: 46.8182,
    lon: 8.2275,
    tours: 12,
    rating: 4.8,
    gallery: ["../assets/images/destinations/Switzerland.png"],
    visits: 120,
  },
  {
    name: "Maldives",
    region: "Asia",
    img: "../assets/images/destinations/Maldives.png",
    short: "Turquoise water, white sand and luxury lodges.",
    long: "The Maldives are famed for private island resorts, coral reefs and crystal clear water perfect for diving.",
    lat: 3.2028,
    lon: 73.2207,
    tours: 8,
    rating: 4.9,
    gallery: ["../assets/images/destinations/Maldives.png"],
    visits: 210,
  },
  {
    name: "Indonesia",
    region: "Asia",
    img: "../assets/images/destinations/Indonesia.png",
    short: "Vibrant islands, culture & volcanoes.",
    long: "From Bali’s beaches to Java’s temples and Komodo's wildlife, Indonesia is diverse and adventurous.",
    lat: -0.7893,
    lon: 113.9213,
    tours: 25,
    rating: 4.6,
    gallery: ["../assets/images/destinations/Indonesia.png"],
    visits: 95,
  },
  // ... phần còn lại (Bangladesh, Thailand, Turkey, Argentina, Brazil, Morocco, Dubai, Ecuador, Colombia)
  {
    name: "Bangladesh",
    region: "Asia",
    img: "../assets/images/destinations/Bangladesh.png",
    short: "Rivers, delta & cultural heritage.",
    long: "Bangladesh offers lush landscapes, river life, and vibrant culture.",
    lat: 23.685,
    lon: 90.3563,
    tours: 4,
    rating: 4.1,
    gallery: ["../assets/images/destinations/Bangladesh.png"],
    visits: 32,
  },
  {
    name: "Thailand",
    region: "Asia",
    img: "../assets/images/destinations/Thailand.png",
    short: "Beaches, street food and temples.",
    long: "Thailand is famous for its cuisine, island beaches, and vibrant cities.",
    lat: 15.87,
    lon: 100.9925,
    tours: 30,
    rating: 4.7,
    gallery: ["../assets/images/destinations/Thailand.png"],
    visits: 180,
  },
  {
    name: "Turkey",
    region: "Europe",
    img: "../assets/images/destinations/Turkey.png",
    short: "History at the crossroads of continents.",
    long: "Turkey blends Byzantine, Ottoman and modern culture with spectacular landscapes and cuisine.",
    lat: 38.9637,
    lon: 35.2433,
    tours: 10,
    rating: 4.5,
    gallery: ["../assets/images/destinations/Turkey.png"],
    visits: 74,
  },
  {
    name: "Argentina",
    region: "America",
    img: "../assets/images/destinations/Agentina.png",
    short: "From pampas to Patagonia.",
    long: "Argentina has vibrant cities, wine regions and dramatic southern landscapes.",
    lat: -38.4161,
    lon: -63.6167,
    tours: 9,
    rating: 4.4,
    gallery: ["../assets/images/destinations/Agentina.png"],
    visits: 58,
  },
  {
    name: "Brazil",
    region: "America",
    img: "../assets/images/destinations/Brazil.png",
    short: "Amazon, beaches and Carnival spirit.",
    long: "Brazil is a land of festivals, rainforests and sandy coasts.",
    lat: -14.235,
    lon: -51.9253,
    tours: 14,
    rating: 4.3,
    gallery: ["../assets/images/destinations/Brazil.png"],
    visits: 86,
  },
  {
    name: "Morocco",
    region: "Africa",
    img: "../assets/images/destinations/Marocco.png",
    short: "Sahara, souks and medinas.",
    long: "Morocco enchants with desert vistas, mountain treks and busy markets.",
    lat: 31.7917,
    lon: -7.0926,
    tours: 6,
    rating: 4.2,
    gallery: ["../assets/images/destinations/Marocco.png"],
    visits: 47,
  },
  {
    name: "Dubai",
    region: "Asia",
    img: "../assets/images/destinations/Dubai.png",
    short: "Skyscrapers, deserts and luxury.",
    long: "Dubai mixes ultra-modern architecture and desert adventures.",
    lat: 25.2048,
    lon: 55.2708,
    tours: 18,
    rating: 4.5,
    gallery: ["../assets/images/destinations/Dubai.png"],
    visits: 140,
  },
  {
    name: "Ecuador",
    region: "America",
    img: "../assets/images/destinations/Ecuador.png",
    short: "Andes, Amazon & Galápagos.",
    long: "Ecuador is biodiverse and ideal for nature travelers.",
    lat: -1.8312,
    lon: -78.1834,
    tours: 5,
    rating: 4.2,
    gallery: ["../assets/images/destinations/Ecuador.png"],
    visits: 29,
  },
  {
    name: "Colombia",
    region: "America",
    img: "../assets/images/destinations/Colombia.png",
    short: "Coffee, culture & coasts.",
    long: "Colombia's cities, coastlines and coffee regions are full of charm.",
    lat: 4.5709,
    lon: -74.2973,
    tours: 11,
    rating: 4.4,
    gallery: ["../assets/images/destinations/Colombia.png"],
    visits: 63,
  },
];

// Data: thời gian du lịch tốt nhất cho từng region
const bestTimeData = {
  Asia: {
    video: "../assets/images/destinations/1.mp4",
    seasons: [
      {
        icon: "❄️",
        title: "Winter (Dec – Feb)",
        suitability: "4.5/5",
        crowd: "Low",
        best: "Cool weather, tropical spots like Thailand.",
        consider: "Some northern areas can be cold.",
      },
      {
        icon: "🌸",
        title: "Spring (Mar – May)",
        suitability: "5.0/5",
        crowd: "Medium",
        best: "Perfect weather, cherry blossom festivals.",
        consider: "Prices rise in Japan & Korea.",
      },
      {
        icon: "☀️",
        title: "Summer (Jun – Aug)",
        suitability: "3.5/5",
        crowd: "High",
        best: "Beach season, school holidays.",
        consider: "Very hot & humid in many regions.",
      },
      {
        icon: "🍁",
        title: "Autumn (Sep – Nov)",
        suitability: "4.8/5",
        crowd: "Medium-Low",
        best: "Pleasant temps, colorful scenery.",
        consider: "Typhoons possible in some regions.",
      },
    ],
  },

  Europe: {
    video: "../assets/images/destinations/2.mp4",
    seasons: [
      {
        icon: "❄️",
        title: "Winter (Dec – Feb)",
        suitability: "3.8/5",
        crowd: "Low",
        best: "Christmas markets & snowy adventures.",
        consider: "Cold weather limits some outdoor trips.",
      },
      {
        icon: "🌸",
        title: "Spring (Mar – May)",
        suitability: "4.9/5",
        crowd: "Medium",
        best: "Mild weather & fewer crowds.",
        consider: "Some northern areas still chilly.",
      },
      {
        icon: "☀️",
        title: "Summer (Jun – Aug)",
        suitability: "4.2/5",
        crowd: "High",
        best: "Festivals & long sunny days.",
        consider: "Tourist season, higher prices.",
      },
      {
        icon: "🍁",
        title: "Autumn (Sep – Nov)",
        suitability: "4.7/5",
        crowd: "Medium-Low",
        best: "Golden scenery & wine festivals.",
        consider: "Shorter days approaching winter.",
      },
    ],
  },

  America: {
    video: "../assets/images/destinations/3.mp4",
    seasons: [
      {
        icon: "❄️",
        title: "Winter (Dec – Feb)",
        suitability: "4.0/5",
        crowd: "Low",
        best: "Warm destinations like Florida or Mexico.",
        consider: "Snow in the north; avoid blizzards.",
      },
      {
        icon: "🌸",
        title: "Spring (Mar – May)",
        suitability: "4.7/5",
        crowd: "Medium",
        best: "National parks & city blooms.",
        consider: "Allergies during pollen season.",
      },
      {
        icon: "☀️",
        title: "Summer (Jun – Aug)",
        suitability: "4.3/5",
        crowd: "High",
        best: "Road trips, beaches, festivals.",
        consider: "Tourist crowds, high temps in deserts.",
      },
      {
        icon: "🍁",
        title: "Autumn (Sep – Nov)",
        suitability: "5.0/5",
        crowd: "Medium-Low",
        best: "Fall foliage & cozy weather.",
        consider: "Hurricane season on east coast.",
      },
    ],
  },

  Africa: {
    video: "../assets/images/destinations/4.mp4",
    seasons: [
      {
        icon: "❄️",
        title: "Winter (Jun – Aug)",
        suitability: "4.6/5",
        crowd: "Medium",
        best: "Cooler weather for safaris in East Africa.",
        consider: "Southern regions can be cold at night.",
      },
      {
        icon: "🌸",
        title: "Spring (Sep – Nov)",
        suitability: "4.9/5",
        crowd: "Low-Medium",
        best: "Perfect for wildlife & coastal escapes.",
        consider: "Some rains in tropical regions.",
      },
      {
        icon: "☀️",
        title: "Summer (Dec – Feb)",
        suitability: "4.0/5",
        crowd: "High",
        best: "Beach holidays & Cape Town vineyards.",
        consider: "Hot inland & safari lodges busy.",
      },
      {
        icon: "🍁",
        title: "Autumn (Mar – May)",
        suitability: "4.4/5",
        crowd: "Medium",
        best: "Dry season starts — great for safaris.",
        consider: "Variable weather in north regions.",
      },
    ],
  },

  Oceania: {
    video: "../assets/images/destinations/5.mp4",
    seasons: [
      {
        icon: "❄️",
        title: "Winter (Jun – Aug)",
        suitability: "4.3/5",
        crowd: "Medium-Low",
        best: "Mild temps, great surfing & whale watching.",
        consider: "Snow in New Zealand’s south.",
      },
      {
        icon: "🌸",
        title: "Spring (Sep – Nov)",
        suitability: "5.0/5",
        crowd: "Medium",
        best: "Ideal for beaches, nature & road trips.",
        consider: "Allergy season in some areas.",
      },
      {
        icon: "☀️",
        title: "Summer (Dec – Feb)",
        suitability: "4.6/5",
        crowd: "High",
        best: "Beach season, outdoor festivals.",
        consider: "Can be very hot in inland Australia.",
      },
      {
        icon: "🍁",
        title: "Autumn (Mar – May)",
        suitability: "4.8/5",
        crowd: "Low-Medium",
        best: "Comfortable temps & fewer tourists.",
        consider: "Some rain in tropical areas.",
      },
    ],
  },
};

const tripData = [
  {
    name: "Bali, Indonesia",
    interest: "beach",
    region: "Asia",
    costPerDay: 150,
    description:
      "Relax on pristine beaches, explore temples, and enjoy tropical vibes.",
    image: "../assets/images/destinations/Indonesia.png",
  },
  {
    name: "Tokyo, Japan",
    interest: "city",
    region: "Asia",
    costPerDay: 200,
    description:
      "Discover neon streets, culture, and incredible food experiences.",
    image: "../assets/images/destinations/Turkey.png",
  },
  {
    name: "Swiss Alps, Switzerland",
    interest: "mountain",
    region: "Europe",
    costPerDay: 250,
    description: "Breathtaking peaks, skiing, and scenic mountain villages.",
    image: "../assets/images/destinations/Switzerland.png",
  },
  {
    name: "Rome, Italy",
    interest: "culture",
    region: "Europe",
    costPerDay: 180,
    description:
      "Walk through ancient ruins and taste authentic Italian cuisine.",
    image: "../assets/images/destinations/Marocco.png",
  },
  {
    name: "Bangkok, Thailand",
    interest: "food",
    region: "Asia",
    costPerDay: 100,
    description:
      "Street food heaven with a mix of temples, markets, and nightlife.",
    image: "../assets/images/destinations/Thailand.png",
  },
];

/* ========= STATE ========= */
let visibleCount = 6;
let activeRegion = "All";
let searchQuery = "";
let sortMode = "default";

/* wishlist & visits persistency */
let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
let visitsStore = JSON.parse(localStorage.getItem("visits")) || {}; // name -> visits (override initial visits)
if (Object.keys(visitsStore).length === 0) {
  // initialize from data
  destinations.forEach((d) => (visitsStore[d.name] = d.visits || 0));
}

/* ======= DOM ======= */
const wrapper = document.querySelector(".destinations-grid__wrapper");
const searchInput = document.getElementById("searchInput");
const loadMoreBtn = document.getElementById("loadMoreBtn");
const filterBtns = document.querySelectorAll(".filter-btn");
const sortSelect = document.getElementById("sortSelect");
const top5List = document.getElementById("top5List");
const detailModal = document.getElementById("detailModal");
const modalClose = document.getElementById("modalClose");

/* Modal elements */
const weatherContent = document.getElementById("weatherContent");
const swiperWrapper = document.getElementById("swiperWrapper");
const detailName = document.getElementById("detailName");
const detailShort = document.getElementById("detailShort");
const detailLong = document.getElementById("detailLong");
const detailRating = document.getElementById("detailRating");
const detailTours = document.getElementById("detailTours");

let currentSlide = 0;

/* for leaflet map instance (to reuse) */
let mapInstance = null;
let mapMarker = null;

/* ======= HELPERS ======= */
function persistVisits() {
  localStorage.setItem("visits", JSON.stringify(visitsStore));
}
function persistWishlist() {
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
}

/* filter + sort + search pipeline */
function getFilteredSorted() {
  const filtered = destinations.filter((item) => {
    const matchRegion = activeRegion === "All" || item.region === activeRegion;
    const matchSearch = item.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchRegion && matchSearch;
  });

  // sort
  const arr = [...filtered];
  if (sortMode === "rating-desc") arr.sort((a, b) => b.rating - a.rating);
  else if (sortMode === "rating-asc") arr.sort((a, b) => a.rating - b.rating);
  else if (sortMode === "tours-desc") arr.sort((a, b) => b.tours - a.tours);
  else if (sortMode === "visited-desc")
    arr.sort((a, b) => (visitsStore[b.name] || 0) - (visitsStore[a.name] || 0));
  return arr;
}

/* render top5 widget */
function renderTop5(region = "All") {
  // Sao chép danh sách gốc
  let filtered = [];

  // Nếu là "All" → gộp tất cả region
  if (region === "All") {
    filtered = [...destinations];
  } else {
    // Lọc theo vùng cụ thể
    filtered = destinations.filter(
      (d) => d.region.toLowerCase() === region.toLowerCase()
    );
  }

  // Nếu không có dữ liệu, hiển thị thông báo sớm
  if (filtered.length === 0) {
    top5List.innerHTML = `
      <div class="empty">
        <p>No destinations found for this region yet.</p>
        <small>Try exploring a different region!</small>
      </div>`;
    return;
  }

  // Sắp xếp theo lượt xem (giảm dần)
  const sorted = filtered.sort(
    (a, b) => (visitsStore[b.name] || 0) - (visitsStore[a.name] || 0)
  );

  // Lấy Top 5
  const arr = sorted.slice(0, 5);

  // Xóa nội dung cũ
  top5List.innerHTML = "";

  // Lấy giá trị cao nhất để tính phần trăm thanh bar
  const max = Math.max(...arr.map((d) => visitsStore[d.name] || 0), 1);

  // Render từng item
  arr.forEach((d) => {
    const visits = visitsStore[d.name] || 0;
    const percent = Math.round((visits / max) * 100);

    const wrapper = document.createElement("div");
    wrapper.className = "top-item";
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

/* render grid */
function renderDestinations() {
  wrapper.innerHTML = "";
  const arr = getFilteredSorted();
  const items = arr.slice(0, visibleCount);

  items.forEach((item) => {
    const isWish = wishlist.includes(item.name);
    const card = document.createElement("div");
    card.className = "destination-card";

    card.innerHTML = `
      <div class="wishlist-btn ${isWish ? "active" : ""}" data-name="${
      item.name
    }" title="Add to wishlist">
        <i class="fas fa-heart"></i>
      </div>

      <div class="destination-card__image">
        <img src="${item.img}" alt="${item.name}">
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
          <button class="view-details" data-name="${
            item.name
          }">View details</button>
        </div>
        <div class="meta-small">${item.region}</div>
      </div>
    `;

    wrapper.appendChild(card);
  });

  // Load more visibility
  if (visibleCount >= getFilteredSorted().length)
    loadMoreBtn.style.display = "none";
  else loadMoreBtn.style.display = "inline-block";

  renderTop5();
}

/* ========== EVENTS ========== */

/* Search */
searchInput.addEventListener("input", (e) => {
  searchQuery = e.target.value.trim();
  visibleCount = 6;
  renderDestinations();
});

/* Filter buttons */
filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    activeRegion = btn.dataset.region;
    visibleCount = 6;
    renderDestinations();
    renderTop5(activeRegion);
  });
});

/* Sort select */
sortSelect.addEventListener("change", (e) => {
  sortMode = e.target.value;
  renderDestinations();
});

/* Load more */
document.getElementById("loadMoreBtn").addEventListener("click", () => {
  visibleCount += 6;
  renderDestinations();
});

/* wishlist click (event delegation) */
document.addEventListener("click", (e) => {
  const w = e.target.closest(".wishlist-btn");
  if (w) {
    const name = w.dataset.name;
    if (wishlist.includes(name)) wishlist = wishlist.filter((n) => n !== name);
    else wishlist.push(name);
    persistWishlist();
    renderDestinations();
    return;
  }

  const vd = e.target.closest(".view-details");
  if (vd) {
    const name = vd.dataset.name;
    openDetailModal(name);
  }
});

/* modal close */
modalClose.addEventListener("click", closeModal);
detailModal.addEventListener("click", (e) => {
  if (e.target === detailModal) closeModal();
});

/* CTA explore scroll to grid */
document.getElementById("ctaExplore").addEventListener("click", () => {
  window.scrollTo({
    top: document.querySelector(".filter-section").offsetTop - 10,
    behavior: "smooth",
  });
});

/* subscription btn (simple) */
document.getElementById("btnSub").addEventListener("click", () => {
  const email = document.getElementById("emailSub").value.trim();
  if (!email) {
    alert("Enter email");
    return;
  }
  alert("Thanks! Subscribed: " + email);
});

/* ========== DETAILS MODAL ========== */
function openDetailModal(name) {
  const item = destinations.find((d) => d.name === name);
  if (!item) return;

  detailName.textContent = item.name;
  detailShort.textContent = item.short;
  detailLong.textContent = item.long;
  detailRating.textContent = `⭐ ${item.rating}`;
  detailTours.textContent = `${item.tours} tours`;

  const images =
    item.gallery && item.gallery.length ? item.gallery : [item.img];
  swiperWrapper.innerHTML = images
    .map(
      (src, i) =>
        `<div class="slide" style="display:${i === 0 ? "block" : "none"};">
          <img src="${src}" alt="${item.name}" />
        </div>`
    )
    .join("");

  currentSlide = 0;
  detailModal.classList.add("open");

  // fetch weather
  fetchWeather(item);

  // init or update map
  setTimeout(() => initMap(item.lat, item.lon, item.name), 100);
}

// đóng modal
modalClose.addEventListener("click", closeModal);
detailModal.addEventListener("click", (e) => {
  if (e.target === detailModal) closeModal();
});

function closeModal() {
  detailModal.classList.remove("open");
}

/* weather fetching */
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
    weatherContent.innerHTML = "Fetching weather...";
    console.log(item.lat, item.lon, OPENWEATHER_API_KEY);

    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${item.lat}&lon=${item.lon}&units=metric&appid=${OPENWEATHER_API_KEY}`;
    const resp = await fetch(url);
    if (!resp.ok) throw new Error("Weather fetch failed");
    const data = await resp.json();

    // Lấy icon
    const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

    const html = `
      <div style="display:flex; align-items:center; gap:10px">
        <img src="${iconUrl}" alt="${
      data.weather[0].description
    }" style="width:50px; height:50px">
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

// Trip planner logic
const tripForm = document.getElementById("tripForm");
const tripResults = document.getElementById("tripResults");

tripForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const budget = parseInt(document.getElementById("budget").value);
  const days = parseInt(document.getElementById("days").value);
  const interest = document.getElementById("interest").value;
  const region = document.getElementById("region").value;

  if (isNaN(budget) || isNaN(days) || days <= 0) {
    tripResults.innerHTML = `<p>Please enter a valid budget and number of days.</p>`;
    return;
  }

  const totalBudget = budget / days;

  const matches = tripData.filter((trip) => {
    const matchInterest = trip.interest === interest;
    const matchBudget = totalBudget >= trip.costPerDay * 0.7;
    const matchRegion =
      region.toLowerCase() === "all" ||
      trip.region.toLowerCase() === region.toLowerCase();
    return matchInterest && matchBudget && matchRegion;
  });

  tripResults.innerHTML = ""; // clear previous results

  if (matches.length === 0) {
    tripResults.innerHTML = `<p>No matching destinations found — try increasing your budget or changing interest.</p>`;
    return;
  }

  matches.forEach((trip) => {
    const totalCost = trip.costPerDay * days;
    const suggestion = document.createElement("div");
    suggestion.classList.add("trip-suggestion");
    suggestion.innerHTML = `
      <img src="${trip.image}" alt="${trip.name}" />
      <div class="trip-info">
        <h3>${trip.name}</h3>
        <p>${trip.description}</p>
        <p>Estimated cost: <span class="price">$${totalCost.toLocaleString()}</span></p>
        <p>Best for: ${trip.interest}</p>
      </div>
    `;
    tripResults.appendChild(suggestion);
  });
});

// Counter animation
const counters = document.querySelectorAll(".count");
counters.forEach((counter) => {
  const update = () => {
    const target = +counter.getAttribute("data-target");
    const current = +counter.innerText;
    const increment = target / 100;
    if (current < target) {
      counter.innerText = Math.ceil(current + increment);
      setTimeout(update, 30);
    } else counter.innerText = target;
  };
  update();
});

/* init leaflet map */
function initMap(lat, lon, name) {
  const mapDiv = document.getElementById("map");
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

// ========================================
// Best time to visit
// ========================================
const regionCards = document.querySelectorAll(".region-card");
const regionNameEl = document.getElementById("regionName");
const bestTimeVideoBg = document.getElementById("bestTimeVideoBg");
const seasonContainer = document.getElementById("seasonContainer");

// Hàm render nội dung theo region
function renderBestTime(region) {
  const regionData = bestTimeData[region];
  if (!regionData) return;

  // Cập nhật tên vùng
  regionNameEl.textContent = region;

  // Đổi video
  bestTimeVideoBg.querySelector("source").src = regionData.video;
  bestTimeVideoBg.load();

  // Render danh sách mùa
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
      </div>`
    )
    .join("");
}

// Khi click vào region
regionCards.forEach((card) => {
  card.addEventListener("click", () => {
    regionCards.forEach((c) => c.classList.remove("active"));
    card.classList.add("active");
    const region = card.dataset.region;
    renderBestTime(region);
  });
});

window.addEventListener("DOMContentLoaded", () => {
  const defaultRegion = "Asia";
  renderBestTime(defaultRegion);

  // Đặt class active cho Asia
  const defaultCard = document.querySelector(
    `[data-region="${defaultRegion}"]`
  );
  if (defaultCard) defaultCard.classList.add("active");
});

/* ===== INIT ===== */
renderDestinations();
renderTop5();
persistVisits(); // save initial state

/* === TOP DESTINATIONS SECTION === */
const topdestTrack = document.querySelector(".topdest-track");
const topdestCards = document.querySelectorAll(".topdest-card");
const prevBtn = document.querySelector(".slide-btn.prev");
const nextBtn = document.querySelector(".slide-btn.next");

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

  nextBtn.addEventListener("click", () => {
    const maxIndex = getMaxIndex();
    if (currentIndex < maxIndex) {
      currentIndex++;
      updateSlide();
    }
  });

  prevBtn.addEventListener("click", () => {
    if (currentIndex > 0) {
      currentIndex--;
      updateSlide();
    }
  });

  window.addEventListener("resize", () => {
    currentIndex = 0;
    updateSlide();
  });
}

/* ========= TRAVEL VLOGS ========= */
const track = document.querySelector(".vlog-track");
const prevBtn_vlog = document.querySelector(".vlog-slider .prev");
const nextBtn_vlog = document.querySelector(".vlog-slider .next");

let currentPosition = 0;

function updateVlogSlider() {
  const item = track.querySelector(".vlog-item");
  const itemStyle = window.getComputedStyle(item);
  const gap = parseInt(itemStyle.marginRight) || 24; // lấy gap nếu có
  const itemWidth = item.offsetWidth + gap;

  const windowWidth = document.querySelector(".vlog-window").offsetWidth;
  const visibleCount = Math.floor(windowWidth / itemWidth); // số video hiển thị
  const maxScroll = track.scrollWidth - itemWidth * visibleCount;

  nextBtn_vlog.onclick = () => {
    if (Math.abs(currentPosition) < maxScroll) {
      currentPosition -= itemWidth;
      if (Math.abs(currentPosition) > maxScroll) currentPosition = -maxScroll;
      track.style.transform = `translateX(${currentPosition}px)`;
    }
  };

  prevBtn_vlog.onclick = () => {
    if (currentPosition < 0) {
      currentPosition += itemWidth;
      if (currentPosition > 0) currentPosition = 0;
      track.style.transform = `translateX(${currentPosition}px)`;
    }
  };
}

// Gọi khi load & khi resize
updateVlogSlider();
window.addEventListener("resize", updateVlogSlider);
