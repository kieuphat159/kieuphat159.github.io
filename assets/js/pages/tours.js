// --- FAKE DATA cho các tour ---
const toursData = [
    {
        id: 1,
        image: "../assets/images/tour/Indonesia.png",
        name: "Indonesia",
        duration: "9 days",
        price: "$6,500",
    },
    {
        id: 2,
        image: "../assets/images/tour/Thailand.png",
        name: "Thailand",
        duration: "9 days",
        price: "$6,500",
    },
    {
        id: 3,
        image: "../assets/images/tour/Dubai.png",
        name: "Dubai",
        duration: "9 days",
        price: "$6,500",
    },
    {
        id: 4,
        image: "../assets/images/tour/Maldives.png",
        name: "Maldives",
        duration: "9 days",
        price: "$6,500",
    },
    {
        id: 5,
        image: "../assets/images/tour/Dubai1.png",
        name: "Dubai",
        duration: "9 days",
        price: "$6,500",
    },
    {
        id: 6,
        image: "../assets/images/tour/Bangladesh.png",
        name: "Banglatoursh",
        duration: "9 days",
        price: "$6,500",
    },
];

// Lấy container
const toursGrid = document.querySelector(".tours-grid");

// Hàm render tours
function renderTours() {
    toursGrid.innerHTML = "";

    toursData.forEach((tour) => {
        const tourElement = document.createElement("article");
        tourElement.classList.add("tours-grid__card");

        tourElement.innerHTML = `
            <div class="tours-grid__image-wrapper">
                <img src="${tour.image}" alt="${tour.name} tour" class="tours-grid__image" />
            </div>
            <div class="tours-grid__info">
                <h2 class="tours-grid__name">${tour.name}</h2>
                <div class="tours-grid__details">
                    <span class="tours-grid__duration">${tour.duration}</span>
                    <span class="tours-grid__price">${tour.price}</span>
                </div>
            </div>
        `;

        toursGrid.appendChild(tourElement);
    });
}

// --- Khởi chạy ---
renderTours();
