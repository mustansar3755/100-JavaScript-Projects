// CONFIG

const API_BASE = "https://www.themealdb.com/api/json/v1/1";
const FAVORITES_KEY = "recipeFinder_favorites";

// DOM REFERENCES

const searchForm     = document.getElementById("searchForm");
const searchInput    = document.getElementById("searchInput");
const categorySelect = document.getElementById("categorySelect");
const randomBtn      = document.getElementById("randomBtn");
const statusLine     = document.getElementById("statusLine");
const resultsGrid    = document.getElementById("resultsGrid");

const favStatusLine  = document.getElementById("favStatusLine");
const favoritesGrid  = document.getElementById("favoritesGrid");
const favCountBadge  = document.getElementById("favCount");

const toggleBtns   = document.querySelectorAll(".toggle-btn");
const searchView   = document.getElementById("searchView");
const favoritesView = document.getElementById("favoritesView");

const modalBackdrop = document.getElementById("modalBackdrop");
const modalContent  = document.getElementById("modalContent");
const modalClose    = document.getElementById("modalClose");

const toast = document.getElementById("toast");


// STATE
let favorites = loadFavorites();


// INIT
init();

function init() {
  renderFavoritesGrid();
  updateFavCount();
  loadCategories();

  searchForm.addEventListener("submit", handleSearchSubmit);
  categorySelect.addEventListener("change", handleCategoryChange);
  randomBtn.addEventListener("click", handleRandomRecipe);

  toggleBtns.forEach((btn) => btn.addEventListener("click", () => switchView(btn.dataset.view)));

  modalClose.addEventListener("click", closeModal);
  modalBackdrop.addEventListener("click", (e) => {
    if (e.target === modalBackdrop) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });
}


// VIEW SWITCHING

function switchView(view) {
  toggleBtns.forEach((btn) => {
    const isActive = btn.dataset.view === view;
    btn.classList.toggle("is-active", isActive);
    btn.setAttribute("aria-selected", isActive);
  });

  searchView.classList.toggle("is-hidden", view !== "search");
  favoritesView.classList.toggle("is-hidden", view !== "favorites");

  if (view === "favorites") renderFavoritesGrid();
}


// CATEGORIES

async function loadCategories() {
  try {
    const res = await fetch(`${API_BASE}/list.php?c=list`);
    const data = await res.json();
    const categories = (data.meals || []).map((m) => m.strCategory).sort();

    categories.forEach((cat) => {
      const opt = document.createElement("option");
      opt.value = cat;
      opt.textContent = cat;
      categorySelect.appendChild(opt);
    });
  } catch (err) {
    console.error("Failed to load categories:", err);
  }
}


// SEARCH

async function handleSearchSubmit(e) {
  e.preventDefault();
  const query = searchInput.value.trim();
  if (!query) {
    setStatus("Type something to search for, bhai.", true);
    return;
  }
  categorySelect.value = "";
  showSkeletons();
  setStatus(`Searching for "${query}"...`);

  try {
    const res = await fetch(`${API_BASE}/search.php?s=${encodeURIComponent(query)}`);
    const data = await res.json();
    renderResults(data.meals, `Results for "${query}"`);
  } catch (err) {
    console.error(err);
    setStatus("Something went wrong while searching. Check your connection and try again.", true);
    resultsGrid.innerHTML = "";
  }
}


// CATEGORY FILTER

async function handleCategoryChange() {
  const category = categorySelect.value;
  if (!category) {
    resultsGrid.innerHTML = "";
    setStatus("Type a dish name or pick a category to begin.");
    return;
  }
  searchInput.value = "";
  showSkeletons();
  setStatus(`Browsing "${category}"...`);

  try {
    const res = await fetch(`${API_BASE}/filter.php?c=${encodeURIComponent(category)}`);
    const data = await res.json();
    renderResults(data.meals, `Category: ${category}`);
  } catch (err) {
    console.error(err);
    setStatus("Couldn't load that category. Try again.", true);
    resultsGrid.innerHTML = "";
  }
}


// RANDOM RECIPE

async function handleRandomRecipe() {
  showSkeletons(1);
  setStatus("Picking something random...");

  try {
    const res = await fetch(`${API_BASE}/random.php`);
    const data = await res.json();
    renderResults(data.meals, "Your random pick");
  } catch (err) {
    console.error(err);
    setStatus("Couldn't fetch a random recipe. Try again.", true);
  }
}


// RENDER RESULTS GRID

function renderResults(meals, label) {
  resultsGrid.innerHTML = "";

  if (!meals || meals.length === 0) {
    setStatus("No recipes found. Try a different search.", true);
    resultsGrid.innerHTML = `<div class="empty-state">Nothing matched that search. Try "chicken", "pasta", or "cake".</div>`;
    return;
  }

  setStatus(`${label} — ${meals.length} found`);

  meals.forEach((meal) => {
    resultsGrid.appendChild(buildCard(meal));
  });
}

function buildCard(meal) {
  const card = document.createElement("article");
  card.className = "recipe-card";
  card.dataset.id = meal.idMeal;

  const isFav = favorites.some((f) => f.idMeal === meal.idMeal);

  // filter.php results don't include category/area — only full search/lookup/random do
  const categoryTag = meal.strCategory ? `<span class="tag tag-category">${meal.strCategory}</span>` : "";
  const areaTag = meal.strArea ? `<span class="tag tag-area">${meal.strArea}</span>` : "";

  card.innerHTML = `
    <div class="thumb-wrap">
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}" loading="lazy" />
      <button class="fav-toggle ${isFav ? "is-fav" : ""}" aria-label="Toggle favorite">
        ${isFav ? "♥" : "♡"}
      </button>
      <div class="torn-edge"></div>
    </div>
    <div class="card-body">
      <h3>${meal.strMeal}</h3>
      <div class="card-tags">${categoryTag}${areaTag}</div>
    </div>
  `;

  card.querySelector(".fav-toggle").addEventListener("click", (e) => {
    e.stopPropagation();
    toggleFavoriteQuick(meal);
  });

  card.addEventListener("click", () => openRecipeModal(meal.idMeal));

  return card;
}

function showSkeletons(count = 8) {
  resultsGrid.innerHTML = "";
  for (let i = 0; i < count; i++) {
    const sk = document.createElement("div");
    sk.className = "skeleton-card";
    resultsGrid.appendChild(sk);
  }
}

function setStatus(msg, isError = false) {
  statusLine.textContent = msg;
  statusLine.classList.toggle("is-error", isError);
}


// MODAL — FULL RECIPE DETAIL

async function openRecipeModal(id) {
  modalBackdrop.classList.add("is-open");
  modalContent.innerHTML = `<div class="modal-body"><p class="status-line">Loading recipe...</p></div>`;

  try {
    const res = await fetch(`${API_BASE}/lookup.php?i=${id}`);
    const data = await res.json();
    const meal = data.meals ? data.meals[0] : null;

    if (!meal) {
      modalContent.innerHTML = `<div class="modal-body"><p class="status-line is-error">Recipe not found.</p></div>`;
      return;
    }

    renderModal(meal);
  } catch (err) {
    console.error(err);
    modalContent.innerHTML = `<div class="modal-body"><p class="status-line is-error">Couldn't load this recipe. Try again.</p></div>`;
  }
}

function renderModal(meal) {
  const ingredients = extractIngredients(meal);
  const isFav = favorites.some((f) => f.idMeal === meal.idMeal);

  const ingredientItems = ingredients
    .map(
      (ing, i) => `
      <li data-index="${i}">
        <input type="checkbox" id="ing-${i}" />
        <label for="ing-${i}">${ing.name}</label>
        <span class="ingredient-qty">${ing.measure}</span>
      </li>`
    )
    .join("");

  const tagsList = (meal.strTags || "")
    .split(",")
    .filter(Boolean)
    .map((t) => `<span class="tag">${t.trim()}</span>`)
    .join("");

  modalContent.innerHTML = `
    <img class="modal-img" src="${meal.strMealThumb}" alt="${meal.strMeal}" />
    <div class="modal-body">
      <h2 id="modalTitle">${meal.strMeal}</h2>
      <div class="modal-meta">
        <span class="tag tag-category">${meal.strCategory || "Uncategorized"}</span>
        <span class="tag tag-area">${meal.strArea || "Unknown origin"}</span>
        ${tagsList}
      </div>

      <button class="btn ${isFav ? "btn-primary" : "btn-ghost"}" id="modalFavBtn">
        ${isFav ? "♥ Saved to favorites" : "♡ Save to favorites"}
      </button>

      <div class="modal-section">
        <h4>Ingredients</h4>
        <ul class="ingredient-list" id="ingredientList">${ingredientItems}</ul>
      </div>

      <div class="modal-section">
        <h4>Instructions</h4>
        <p class="instructions-text">${meal.strInstructions}</p>
      </div>

      <div class="modal-links">
        ${meal.strYoutube ? `<a href="${meal.strYoutube}" target="_blank" rel="noopener" class="btn btn-ghost">▶ Watch on YouTube</a>` : ""}
        ${meal.strSource ? `<a href="${meal.strSource}" target="_blank" rel="noopener" class="btn btn-ghost">🔗 Original source</a>` : ""}
      </div>
    </div>
  `;

  // ingredient checkbox strike-through behaviour
  document.querySelectorAll("#ingredientList li").forEach((li) => {
    const checkbox = li.querySelector("input[type='checkbox']");
    checkbox.addEventListener("change", () => {
      li.classList.toggle("is-checked", checkbox.checked);
    });
  });

  // favorite toggle inside modal
  document.getElementById("modalFavBtn").addEventListener("click", () => {
    toggleFavoriteQuick(meal);
    const nowFav = favorites.some((f) => f.idMeal === meal.idMeal);
    const btn = document.getElementById("modalFavBtn");
    btn.textContent = nowFav ? "♥ Saved to favorites" : "♡ Save to favorites";
    btn.className = `btn ${nowFav ? "btn-primary" : "btn-ghost"}`;
  });
}

function extractIngredients(meal) {
  const list = [];
  for (let i = 1; i <= 20; i++) {
    const name = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (name && name.trim()) {
      list.push({ name: name.trim(), measure: (measure || "").trim() });
    }
  }
  return list;
}

function closeModal() {
  modalBackdrop.classList.remove("is-open");
}


// FAVORITES (LocalStorage)

function loadFavorites() {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error("Failed to parse favorites from localStorage:", err);
    return [];
  }
}

function saveFavorites() {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}

function toggleFavoriteQuick(meal) {
  const exists = favorites.some((f) => f.idMeal === meal.idMeal);

  if (exists) {
    favorites = favorites.filter((f) => f.idMeal !== meal.idMeal);
    showToast(`Removed "${meal.strMeal}" from favorites`);
  } else {
    // store only what's needed for the card view
    favorites.push({
      idMeal: meal.idMeal,
      strMeal: meal.strMeal,
      strMealThumb: meal.strMealThumb,
      strCategory: meal.strCategory || "",
      strArea: meal.strArea || "",
    });
    showToast(`Saved "${meal.strMeal}" to favorites`);
  }

  saveFavorites();
  updateFavCount();
  refreshFavToggleButtons(meal.idMeal, !exists);

  if (!favoritesView.classList.contains("is-hidden")) {
    renderFavoritesGrid();
  }
}

function refreshFavToggleButtons(idMeal, isFav) {
  document.querySelectorAll(`.recipe-card[data-id="${idMeal}"] .fav-toggle`).forEach((btn) => {
    btn.classList.toggle("is-fav", isFav);
    btn.textContent = isFav ? "♥" : "♡";
  });
}

function updateFavCount() {
  favCountBadge.textContent = favorites.length;
}

function renderFavoritesGrid() {
  favoritesGrid.innerHTML = "";

  if (favorites.length === 0) {
    favStatusLine.textContent = "No saved recipes yet. Tap the heart on any recipe to save it here.";
    favStatusLine.classList.remove("is-hidden");
    return;
  }

  favStatusLine.textContent = `${favorites.length} saved recipe${favorites.length > 1 ? "s" : ""}`;
  favorites.forEach((meal) => {
    favoritesGrid.appendChild(buildCard(meal));
  });
}


// TOAST

let toastTimer = null;
function showToast(message) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("is-visible");
  toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2200);
}