const searchBtn = document.querySelector(".search-btn");
const clearBtn = document.querySelector(".clear-btn");
const streetInput = document.querySelector(".street-input");
const ulCards = document.querySelector("ul.cards");
const districtSelect = document.querySelector("#district-select");
const roomQuantityInput = document.querySelectorAll(".checkbox");

searchBtn.addEventListener("click", showSearchResult);
clearBtn.addEventListener("click", () => {
  clearFilters();
  streetInput.value = "";
  districtSelect.value = "";
});

function showSearchResult() {
  fetch("/api/search", {
    method: "POST",
    body: JSON.stringify({
      street: streetInput.value,
      district: districtSelect.value,
      // rooms:
    }),
  })
    .then((response) => response.text())
    .then((html) => (ulCards.innerHTML = html));
}

function clearFilters() {
  console.log("cleared");
  roomQuantityInput.forEach((checkbox) => {
    if (checkbox.checked) return console.log(checkbox.value);
  }),
    fetch("/api/search", {
      method: "POST",
      body: JSON.stringify({}),
    })
      .then((response) => response.text())
      .then((html) => (ulCards.innerHTML = html));
}

const disSelect = new Select("#district-select", {
  data: [
    { value: "Соломенский" },
    { value: "Дарницкий" },
    { value: "Шевченковский" },
    { value: "Голосеевский" },
    { value: "Оболонский" },
    { value: "Святошинский" },
    { value: "Печерский" },
    { value: "Подольский" },
    { value: "Деснянский" },
    { value: "Днепровский" },
  ],
  nullable: "Район не выбран",
});
