// const cards = document.querySelectorAll(".destination-card");
// const itemsPerPage = 7;
// const totalPages = Math.ceil(cards.length / itemsPerPage);
// let currentPage = 1;

// const pageNumbersContainer = document.querySelector(".page-numbers");

// function showPage(page) {
//   currentPage = page;

//   // Hiển thị cards
//   cards.forEach((card, index) => {
//     card.style.display =
//       index >= (page - 1) * itemsPerPage && index < page * itemsPerPage
//         ? "block"
//         : "none";
//   });

//   // Nếu chỉ có 1 trang, ẩn pagination
//   if (totalPages <= 1) {
//     document.querySelector(".pagination").style.display = "none";
//   } else {
//     document.querySelector(".pagination").style.display = "flex";
//     renderPagination();
//   }
// }

// // Render số trang với ...
// function renderPagination() {
//   pageNumbersContainer.innerHTML = "";

//   const createPageLink = (i) => {
//     const a = document.createElement("a");
//     a.href = "#";
//     a.textContent = i;
//     // a.classList.add("page");
//     if (i === currentPage) a.classList.add("active");
//     a.addEventListener("click", (e) => {
//       e.preventDefault();
//       showPage(i);
//     });
//     return a;
//   };

//   const createDots = () => {
//     const span = document.createElement("span");
//     span.textContent = "...";
//     span.classList.add("dots");
//     return span;
//   };

//   if (totalPages <= 7) {
//     // Hiển thị tất cả nếu < 8 trang
//     for (let i = 1; i <= totalPages; i++) {
//       pageNumbersContainer.appendChild(createPageLink(i));
//     }
//   } else {
//     if (currentPage <= 4) {
//       // Trang đầu
//       for (let i = 1; i <= 5; i++)
//         pageNumbersContainer.appendChild(createPageLink(i));
//       pageNumbersContainer.appendChild(createDots());
//       pageNumbersContainer.appendChild(createPageLink(totalPages));
//     } else if (currentPage >= totalPages - 3) {
//       // Trang cuối
//       pageNumbersContainer.appendChild(createPageLink(1));
//       pageNumbersContainer.appendChild(createDots());
//       for (let i = totalPages - 4; i <= totalPages; i++)
//         pageNumbersContainer.appendChild(createPageLink(i));
//     } else {
//       // Trang giữa
//       pageNumbersContainer.appendChild(createPageLink(1));
//       pageNumbersContainer.appendChild(createDots());
//       for (let i = currentPage - 1; i <= currentPage + 1; i++)
//         pageNumbersContainer.appendChild(createPageLink(i));
//       pageNumbersContainer.appendChild(createDots());
//       pageNumbersContainer.appendChild(createPageLink(totalPages));
//     }
//   }
// }

// // Nút điều hướng
// document.querySelector(".pagination .prev").addEventListener("click", (e) => {
//   e.preventDefault();
//   if (currentPage > 1) showPage(currentPage - 1);
// });

// document.querySelector(".pagination .next").addEventListener("click", (e) => {
//   e.preventDefault();
//   if (currentPage < totalPages) showPage(currentPage + 1);
// });

// document.querySelector(".pagination .first").addEventListener("click", (e) => {
//   e.preventDefault();
//   showPage(1);
// });

// document.querySelector(".pagination .last").addEventListener("click", (e) => {
//   e.preventDefault();
//   showPage(totalPages);
// });

// // Load trang đầu tiên
// showPage(1);

/* ========= CONFIG ========= */
/*
  NOTE:
  - For live weather, put your OpenWeather API key below.
    Sign up: https://openweathermap.org/api
  - Leaflet is used for map (no API key).
  - Swiper is used for gallery slider (CDN included).
*/
const OPENWEATHER_API_KEY = ""; // <-- đặt API key ở đây nếu có (ví dụ "abcd1234...")

/* ========= DATA ========= */
/* mỗi destination có: name, region, img, short, long, lat, lon, tours, rating, gallery[], visits */
const destinations = [
  {
    name: "Switzerland",
    region: "Europe",
    img: "../assets/images/destinations/Switzerland.png",
    short: "Alpine vistas, lakes and cozy villages.",
    long: "Switzerland offers dramatic mountain scenery, pristine lakes and charming towns — ideal for outdoor lovers and culture seekers.",
    lat: 46.8182,
    lon: 8.2275,
    tours: 12,
    rating: 4.8,
    gallery: [
      "../assets/images/destinations/Switzerland.png",
      "../assets/images/destinations/Switzerland-2.jpg",
    ],
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
    gallery: [
      "../assets/images/destinations/Maldives.png",
      "../assets/images/destinations/Maldives-2.jpg",
    ],
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
    gallery: [
      "../assets/images/destinations/Indonesia.png",
      "../assets/images/destinations/Indonesia-2.jpg",
    ],
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
    video: "../assets/images/destinations/reels/asia.mov",
    seasons: [
      {
        icon: "❄️",
        season: "Winter (Dec – Feb)",
        rating: 4.5,
        crowd: "Low",
        bar: 50,
        pros: "Cool weather, great for tropical destinations like Thailand or Vietnam.",
        cons: "Some northern areas can be cold.",
      },
      {
        icon: "🌸",
        season: "Spring (Mar – May)",
        rating: 5.0,
        crowd: "Medium",
        bar: 80,
        pros: "Perfect weather, festivals in Japan & Korea.",
        cons: "Prices rise during cherry blossom season.",
      },
      {
        icon: "☀️",
        season: "Summer (Jun – Aug)",
        rating: 3.5,
        crowd: "High",
        bar: 95,
        pros: "Beach season, school holidays.",
        cons: "Very hot & humid in many areas.",
      },
      {
        icon: "🍂",
        season: "Autumn (Sep – Nov)",
        rating: 4.8,
        crowd: "Medium-Low",
        bar: 70,
        pros: "Pleasant temps, colorful scenery, good value.",
        cons: "Typhoons possible in some regions.",
      },
    ],
  },
  Europe: {
    video:
      "../assets/images/destinations/reels/AdobeStock_403594168_Video_HD_Preview.mov",
    seasons: [
      {
        icon: "❄️",
        season: "Winter (Dec – Feb)",
        rating: 3.5,
        crowd: "Low",
        bar: 40,
        pros: "Christmas markets, fewer tourists.",
        cons: "Cold, shorter days.",
      },
      {
        icon: "🌸",
        season: "Spring (Mar – May)",
        rating: 5.0,
        crowd: "Medium",
        bar: 70,
        pros: "Best weather, blooming gardens, great deals.",
        cons: "Rain possible in early spring.",
      },
      {
        icon: "☀️",
        season: "Summer (Jun – Aug)",
        rating: 4.0,
        crowd: "High",
        bar: 95,
        pros: "Festivals, beaches, long days.",
        cons: "Crowded & expensive.",
      },
      {
        icon: "🍂",
        season: "Autumn (Sep – Nov)",
        rating: 4.7,
        crowd: "Medium-Low",
        bar: 65,
        pros: "Ideal weather, fall colors, good prices.",
        cons: "Shorter daylight.",
      },
    ],
  },
  America: {
    video: "../assets/images/destinations/reels/asia.mov",
    seasons: [
      {
        icon: "❄️",
        season: "Winter (Dec – Feb)",
        rating: 4.0,
        crowd: "Low",
        bar: 50,
        pros: "Great for South America & ski resorts.",
        cons: "Cold in northern regions.",
      },
      {
        icon: "🌸",
        season: "Spring (Mar – May)",
        rating: 4.8,
        crowd: "Medium",
        bar: 70,
        pros: "Ideal weather across continents.",
        cons: "Tourist season starts in some cities.",
      },
      {
        icon: "☀️",
        season: "Summer (Jun – Aug)",
        rating: 3.8,
        crowd: "High",
        bar: 90,
        pros: "Good for beaches & national parks.",
        cons: "Hot & crowded in cities.",
      },
      {
        icon: "🍂",
        season: "Autumn (Sep – Nov)",
        rating: 5.0,
        crowd: "Medium-Low",
        bar: 65,
        pros: "Perfect climate, fall foliage.",
        cons: "Hurricane risk in some areas.",
      },
    ],
  },
  Africa: {
    video:
      "../assets/images/destinations/reels/AdobeStock_403594168_Video_HD_Preview.mov",
    seasons: [
      {
        icon: "🦁",
        season: "Dry (Jun – Aug)",
        rating: 4.5,
        crowd: "Medium",
        bar: 70,
        pros: "Best time for safaris (migration).",
        cons: "Cooler mornings and evenings.",
      },
      {
        icon: "🐘",
        season: "Shoulder (Sep – Nov)",
        rating: 5.0,
        crowd: "Medium-Low",
        bar: 60,
        pros: "Perfect for wildlife & landscapes.",
        cons: "Some rains begin.",
      },
      {
        icon: "🔥",
        season: "Wet (Dec – Feb)",
        rating: 4.0,
        crowd: "High",
        bar: 90,
        pros: "Holiday season, warm weather.",
        cons: "Hot inland temperatures.",
      },
      {
        icon: "🦓",
        season: "Rainy (Mar – May)",
        rating: 4.2,
        crowd: "Low",
        bar: 50,
        pros: "Good prices, calm weather.",
        cons: "Less wildlife movement.",
      },
    ],
  },
};

/* ========= STATE ========= */
let visibleCount = 6;
let activeRegion = "all";
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
const detailName = document.getElementById("detailName");
const detailShort = document.getElementById("detailShort");
const detailLong = document.getElementById("detailLong");
const detailRating = document.getElementById("detailRating");
const detailTours = document.getElementById("detailTours");
const swiperWrapper = document.getElementById("swiperWrapper");
const weatherContent = document.getElementById("weatherContent");

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
    const matchRegion = activeRegion === "all" || item.region === activeRegion;
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
function renderTop5() {
  const arr = [...destinations]
    .sort((a, b) => (visitsStore[b.name] || 0) - (visitsStore[a.name] || 0))
    .slice(0, 5);
  top5List.innerHTML = "";
  const max = Math.max(...arr.map((d) => visitsStore[d.name] || 0), 1);
  arr.forEach((d) => {
    const wrapper = document.createElement("div");
    wrapper.className = "top-item";
    wrapper.innerHTML = `
      <div class="name">${d.name}</div>
      <div class="bar"><i style="width:${Math.round(
        ((visitsStore[d.name] || 0) / max) * 100
      )}%"></i></div>
      <div class="num">${visitsStore[d.name] || 0}</div>
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
let swiperInstance = null;
function openDetailModal(name) {
  const item = destinations.find((d) => d.name === name);
  if (!item) return;

  // increment visit count and persist
  visitsStore[name] = (visitsStore[name] || 0) + 1;
  persistVisits();
  renderTop5();

  // fill modal info
  detailName.textContent = item.name;
  detailShort.textContent = item.short;
  detailLong.textContent = item.long;
  detailRating.textContent = `⭐ ${item.rating}`;
  detailTours.textContent = `${item.tours} tours`;

  // prepare gallery slides
  swiperWrapper.innerHTML = "";
  (item.gallery && item.gallery.length ? item.gallery : [item.img]).forEach(
    (src) => {
      const slide = document.createElement("div");
      slide.className = "swiper-slide";
      slide.innerHTML = `<img src="${src}" alt="${item.name}">`;
      swiperWrapper.appendChild(slide);
    }
  );

  // open modal
  detailModal.classList.add("open");

  // init or update swiper
  setTimeout(() => {
    // allow DOM paint
    if (swiperInstance) swiperInstance.destroy(true, true);
    swiperInstance = new Swiper(".gallery-swiper", {
      loop: true,
      pagination: { el: ".swiper-pagination", clickable: true },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
    });
  }, 50);

  // fetch weather
  fetchWeather(item);

  // init or update map
  setTimeout(() => initMap(item.lat, item.lon, item.name), 100);
}

/* close modal */
function closeModal() {
  detailModal.classList.remove("open");
  if (mapInstance) {
    mapInstance.remove();
    mapInstance = null;
    mapMarker = null;
  }
}

/* weather fetching */
async function fetchWeather(item) {
  if (!OPENWEATHER_API_KEY) {
    weatherContent.innerHTML = `<div style="color:#666">No API key set. Provide OPENWEATHER_API_KEY in js/destinations.js to fetch live weather.</div>
      <div style="margin-top:8px"><strong>Approx:</strong> Best season shown in description.</div>`;
    return;
  }

  try {
    weatherContent.innerHTML = "Fetching weather...";
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${item.lat}&lon=${item.lon}&units=metric&appid=${OPENWEATHER_API_KEY}`;
    const resp = await fetch(url);
    if (!resp.ok) throw new Error("Weather fetch failed");
    const data = await resp.json();
    const html = `
      <div><strong>${data.name || item.name}</strong></div>
      <div style="font-size:18px; margin:6px 0">${Math.round(
        data.main.temp
      )}°C — ${data.weather[0].description}</div>
      <div>Humidity: ${data.main.humidity}%</div>
      <div>Wind: ${Math.round(data.wind.speed)} m/s</div>
    `;
    weatherContent.innerHTML = html;
  } catch (err) {
    weatherContent.innerHTML = `<div style="color:#c00">Unable to fetch weather.</div>`;
    console.error(err);
  }
}

// Trip planner logic
const data = [
  { name: "Bali", type: "beach", minBudget: 500, minDays: 3 },
  { name: "Hanoi", type: "culture", minBudget: 300, minDays: 2 },
  { name: "Tokyo", type: "city", minBudget: 1000, minDays: 4 },
  { name: "Swiss Alps", type: "mountain", minBudget: 1200, minDays: 5 },
  { name: "Bangkok", type: "food", minBudget: 400, minDays: 2 },
];
document.getElementById("tripForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const budget = +document.getElementById("budget").value;
  const days = +document.getElementById("days").value;
  const interest = document.getElementById("interest").value;
  const results = data.filter(
    (d) => d.type === interest && budget >= d.minBudget && days >= d.minDays
  );
  document.getElementById("tripResults").innerHTML = results.length
    ? results
        .map((r) => `<p>✅ ${r.name} is a perfect fit for you!</p>`)
        .join("")
    : "<p>No matching destinations found 😅</p>";
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
  if (mapInstance) {
    mapInstance.remove();
    mapInstance = null;
    mapMarker = null;
  }
  mapInstance = L.map("map", {
    center: [lat, lon],
    zoom: 5,
    scrollWheelZoom: false,
  });
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap",
  }).addTo(mapInstance);
  mapMarker = L.marker([lat, lon])
    .addTo(mapInstance)
    .bindPopup(name)
    .openPopup();
  mapInstance.invalidateSize();
}

const regionFilterBtns = document.querySelectorAll(".best-time-filter-btn");
const seasonContainer = document.getElementById("seasonContainer");
const regionNameEl = document.getElementById("regionName");
const bestTimeVideoBg = document.getElementById("bestTimeVideoBg");

function renderBestTime(region) {
  const regionData = bestTimeData[region];
  if (!regionData) return;

  regionNameEl.textContent = region;
  bestTimeVideoBg.style.opacity = "0";

  const transitionDuration = 500;
  setTimeout(() => {
    const sourceElement = bestTimeVideoBg.querySelector("source");
    if (sourceElement) {
      sourceElement.src = regionData.video;
    } else {
      bestTimeVideoBg.innerHTML = `<source src="${regionData.video}" type="video/mp4" />`;
    }

    bestTimeVideoBg.load();
    bestTimeVideoBg.play().catch(console.warn);
    bestTimeVideoBg.style.opacity = "1";
  }, transitionDuration);

  seasonContainer.innerHTML = regionData.seasons
    .map((s, index) => {
      const colorClass = ["cold", "warm", "hot", "mild"][index % 4];
      return `
        <div class="season-item card-${colorClass}">
          <div class="card-icon">${s.icon}</div>
          <div class="season-header">
            <span class="season-title">${s.season}</span>
            <div class="season-rating">
              <span class="rating-label">Suitability:</span>
              <span class="rating-stars">${s.rating.toFixed(1)}/5</span>
            </div>
          </div>
          <div class="season-chart-area">
            <p class="chart-label">Crowd Level: <strong>${s.crowd}</strong></p>
            <div class="season-progress-wrapper">
              <div class="bar ${colorClass}" style="width:${s.bar}%"></div>
            </div>
          </div>
          <div class="season-details">
            <p class="pros"><strong>Best for:</strong> ${s.pros}</p>
            <p class="cons"><strong>Consider:</strong> ${s.cons}</p>
          </div>
        </div>`;
    })
    .join("");
}

// 4. BẮT SỰ KIỆN & GỌI MẶC ĐỊNH
regionFilterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const region = btn.dataset.region;

    regionFilterBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    renderBestTime(region);
  });
});

// Gọi mặc định khi tải trang
renderBestTime("Asia");

/* ===== INIT ===== */
renderDestinations();
renderTop5();
persistVisits(); // save initial state

/* ========= EXPLORE BY REGION SLIDER ========= */
const regionTrack = document.querySelector(".region-track");
const regionCards = document.querySelectorAll(".region-track-card");
const prevBtn = document.querySelector(".slide-btn.prev");
const nextBtn = document.querySelector(".slide-btn.next");

if (regionTrack && regionCards.length && prevBtn && nextBtn) {
  let currentIndex = 0;

  // Hàm tính chiều rộng thực tế của 1 card (gồm cả gap)
  function getCardWidth() {
    const card = regionCards[0];
    const style = window.getComputedStyle(regionTrack);
    const gap = parseFloat(style.gap) || 0;
    return card.offsetWidth + gap;
  }

  // Hàm cập nhật transform
  function updateSlide() {
    const cardWidth = getCardWidth();
    regionTrack.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
  }

  // Cập nhật số lượng card có thể hiển thị trong 1 khung
  function getVisibleCards() {
    const windowWidth = regionTrack.parentElement.offsetWidth;
    const cardWidth = getCardWidth();
    return Math.floor(windowWidth / cardWidth);
  }

  // Số lượng card tối đa có thể trượt
  function getMaxIndex() {
    const visibleCards = getVisibleCards();
    return Math.max(0, regionCards.length - visibleCards);
  }

  // Nút Next
  nextBtn.addEventListener("click", () => {
    const maxIndex = getMaxIndex();
    if (currentIndex < maxIndex) {
      currentIndex++;
      updateSlide();
    }
  });

  // Nút Prev
  prevBtn.addEventListener("click", () => {
    if (currentIndex > 0) {
      currentIndex--;
      updateSlide();
    }
  });

  // Khi resize thì reset lại
  window.addEventListener("resize", () => {
    currentIndex = 0;
    updateSlide();
  });
}

/* ========= TRAVEL VLOGS ========= */
const track = document.querySelector(".vlog-track");
const prevBtn_vlog = document.querySelector(".vlog-slider .prev");
const nextBtn_vlog = document.querySelector(".vlog-slider .next");

const itemWidth = track.querySelector(".vlog-item").offsetWidth + 20; // width + gap
let currentPosition = 0;

nextBtn_vlog.addEventListener("click", () => {
  if (currentPosition > -(track.scrollWidth - itemWidth * 3)) {
    currentPosition -= itemWidth;
    track.style.transform = `translateX(${currentPosition}px)`;
  }
});

prevBtn_vlog.addEventListener("click", () => {
  if (currentPosition < 0) {
    currentPosition += itemWidth;
    track.style.transform = `translateX(${currentPosition}px)`;
  }
});
