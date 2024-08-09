let recipes = [];
let activeTags = [];

document.addEventListener("DOMContentLoaded", function () {
  fetchRecipes();
  setupEventListeners();
});

function fetchRecipes() {
  fetch("assets/recipes.json")
    .then((response) => response.json())
    .then((data) => {
      recipes = data;
      populateDropdowns(recipes);
      generateCards(recipes);
    })
    .catch((error) => console.error("Error loading the recipes:", error));
}

function setupEventListeners() {
  const searchBar = document.getElementById("searchBar");
  searchBar.addEventListener("input", function () {
    chercherRecettesAvecMethodes(searchBar.value);
    filterDropdowns(searchBar.value);
  });

  window.addEventListener("click", function (event) {
    if (!event.target.matches(".dropbtn")) {
      closeAllDropdowns();
    }
  });

  document.querySelectorAll(".input-dropdowns").forEach((input) => {
    input.addEventListener("keyup", filterDropdownItems);
  });
}

function generateCards(filteredRecipes) {
  const container = document.querySelector(".content-container");
  const recipesCountElement = document.getElementById("recipes-count");
  recipesCountElement.className = "recette-count";

  container.innerHTML = "";
  filteredRecipes.forEach((recipe) => {
    const card = document.createElement("div");
    card.className = "recette-card";

    let ingredientsList = '<ul class="ingredients-list">';
    recipe.ingredients.forEach((ingredient) => {
      ingredientsList += `<li><span class="ingredient-name">${
        ingredient.ingredient
      }</span><br> <span class="ingredient-quantity">${
        ingredient.quantity || ""
      }</span> <span class="ingredient-unit">${
        ingredient.unit || ""
      }</span></li>`;
    });
    ingredientsList += "</ul>";

    card.innerHTML = `
            <div class="card">
                <img src="images/${recipe.image}" alt="${
      recipe.name
    }" class="card-img" />
                <div class="structure-card">
                <h3 class="card-title">${recipe.name}</h3>
                <p class="card-description"><p class="recette">RECETTE</p><p class="paragraph">${
                  recipe.description
                }</p></p>
                <h4 class="ingredients-h4"><p class="ingredients">INGREDIENTS</p></h4>
                <div class="ingredients-list-container">${ingredientsList}</div>
                <p class="card-time">${recipe.time + "min"}</p>
                </div>
            </div>
        `;

    container.appendChild(card);
  });
  recipesCountElement.textContent = `${filteredRecipes.length} RECETTES`;
}

function populateDropdowns(filteredRecipes) {
  const ingredientsSet = new Set();
  const appliancesSet = new Set();
  const utensilsSet = new Set();

  filteredRecipes.forEach((recipe) => {
    recipe.ingredients.forEach((item) => ingredientsSet.add(item.ingredient));
    appliancesSet.add(recipe.appliance);
    recipe.ustensils.forEach((item) => utensilsSet.add(item));
  });

  addItemsToDropdown(
    '.dropdown-content[data-dropdown="ingredients"]',
    Array.from(ingredientsSet)
  );
  addItemsToDropdown(
    '.dropdown-content[data-dropdown="appliances"]',
    Array.from(appliancesSet)
  );
  addItemsToDropdown(
    '.dropdown-content[data-dropdown="ustensils"]',
    Array.from(utensilsSet)
  );
}

function addItemsToDropdown(selector, items) {
  const dropdown = document.querySelector(selector);
  const existingItems = dropdown.querySelectorAll(".dropdown-item");

  existingItems.forEach((item) => item.remove());

  items.forEach((item) => {
    const element = document.createElement("button");
    element.type = "button";
    element.className = "dropdown-item";
    element.textContent = item;
    element.addEventListener("click", function () {
      addTag(item);
      filterRecipesByTags();
      console.log(item + " selected");
    });
    dropdown.appendChild(element);
  });
}

function chercherRecettesAvecMethodes(champRecherche) {
  let recherche = champRecherche.trim().toLowerCase();
  const messageElement = document.querySelector(".message");

  if (recherche.length < 3) {
    generateCards(recipes);
    messageElement.innerHTML = "";
    return;
  }

  let resultats = recipes.filter((recipe) => {
    return (
      recipe.name.toLowerCase().includes(recherche) ||
      recipe.description.toLowerCase().includes(recherche) ||
      recipe.ingredients.some((ingredient) =>
        ingredient.ingredient.toLowerCase().includes(recherche)
      )
    );
  });

  if (resultats.length === 0) {
    messageElement.innerHTML = `Aucune recette ne contient '${recherche}' vous pouvez chercher « tarte aux pommes », « poisson », etc.`;
  } else {
    messageElement.innerHTML = "";
  }

  generateCards(resultats);
}

function filterDropdowns(searchTerm) {
  const allDropdownItems = document.querySelectorAll(
    ".dropdown .dropdown-content button"
  );
  allDropdownItems.forEach((item) => {
    if (item.textContent.toLowerCase().includes(searchTerm.toLowerCase())) {
      item.style.display = "";
    } else {
      item.style.display = "none";
    }
  });
}

function closeAllDropdowns() {
  const dropdownContents = document.querySelectorAll(".dropdown-content");
  dropdownContents.forEach((dropdown) => {
    dropdown.classList.remove("show");
  });
}

function filterDropdownItems(event) {
  const input = event.target;
  const filter = input.value.toLowerCase();
  const dropdown = input.closest(".dropdown-content");
  const items = dropdown.querySelectorAll(".dropdown-item");

  items.forEach((item) => {
    const text = item.textContent.toLowerCase();
    if (text.includes(filter)) {
      item.style.display = "";
    } else {
      item.style.display = "none";
    }
  });
}

function filterRecipesByTags() {
  let filteredRecipes = recipes.filter((recipe) => {
    return activeTags.every(
      (tag) =>
        recipe.ingredients.some((ingredient) =>
          ingredient.ingredient.includes(tag)
        ) ||
        recipe.appliance.includes(tag) ||
        recipe.ustensils.includes(tag)
    );
  });
  generateCards(filteredRecipes);
  populateDropdowns(filteredRecipes);
}

function addTag(tagName) {
  if (!activeTags.includes(tagName)) {
    activeTags.push(tagName);

    const tag = document.createElement("div");
    tag.className = "tag";
    tag.textContent = tagName;

    const closeBtn = document.createElement("span");
    closeBtn.innerHTML = "&times;";
    closeBtn.className = "tag-close-btn";
    closeBtn.onclick = function () {
      removeTag(tagName, tag);
    };

    tag.appendChild(closeBtn);
    document.getElementById("tags-container").appendChild(tag);
  }
}

function removeTag(tagName, tagElement) {
  activeTags = activeTags.filter((tag) => tag !== tagName);
  tagElement.remove();
  filterRecipesByTags();
}
