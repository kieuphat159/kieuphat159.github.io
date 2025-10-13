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
        <i class="fa-solid fa-heart"></i>
      </div>

      <div class="destination-card__image">
        <img src="${item.img}" alt="${item.name}">
        <div class="card-overlay">
          <div class="overlay-content">
            <div class="overlay-left">
              <h4>${item.name}</h4>
              <p>${item.short}</p>
            </div>
            <div class="overlay-right">
              <button class="view-details" data-name="${
                item.name
              }">View details</button>
            </div>
          </div>
        </div>
      </div>

      <div class="destination-card__body">
        <div>
          <div class="destination-card__title">${item.name}</div>
          <div class="meta-small"><span class="pill">${
            item.tours
          } tours</span> <span>⭐ ${item.rating}</span></div>
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

/* ===== INIT ===== */
renderDestinations();
renderTop5();
persistVisits(); // save initial state

// 🌍 Explore by Region
document.addEventListener("DOMContentLoaded", () => {
  const track = document.querySelector(".region-track");
  const prevBtn = document.querySelector(".slide-btn.prev");
  const nextBtn = document.querySelector(".slide-btn.next");
  const cards = document.querySelectorAll(".region-card");

  let index = 0;

  const cardStyle = getComputedStyle(cards[0]);
  const cardWidth =
    cards[0].offsetWidth +
    parseInt(cardStyle.marginRight || 0) +
    parseInt(cardStyle.gap || 20);

  const visibleCount = Math.floor(
    document.querySelector(".region-window").offsetWidth / cardWidth
  );

  const maxIndex = cards.length - visibleCount;

  nextBtn.addEventListener("click", () => {
    if (index < maxIndex) {
      index++;
      track.style.transform = `translateX(-${index * cardWidth}px)`;
    }
  });

  prevBtn.addEventListener("click", () => {
    if (index > 0) {
      index--;
      track.style.transform = `translateX(-${index * cardWidth}px)`;
    }
  });
});
