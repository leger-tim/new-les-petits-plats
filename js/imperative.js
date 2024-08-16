let recipes = [];
let activeTags = [];

// Attendre que le document soit complètement chargé avant d'exécuter le code
document.addEventListener("DOMContentLoaded", function () {
  fetchRecipes(); // Charger les recettes depuis le fichier JSON
  setupEventListeners(); // Configurer les écouteurs d'événements
});

// Fonction pour récupérer les recettes depuis un fichier JSON
function fetchRecipes() {
  fetch("assets/recipes.json")
    .then((response) => response.json())
    .then((data) => {
      recipes = data; // Stocker les recettes dans la variable globale
      populateDropdowns(recipes); // Remplir les dropdowns avec les données des recettes
      generateCards(recipes); // Générer les cartes des recettes
    })
    .catch((error) => console.error("Error loading the recipes:", error));
}

// Configurer les écouteurs d'événements pour les interactions utilisateur
function setupEventListeners() {
  const searchBar = document.getElementById("searchBar");
  searchBar.addEventListener("input", function () {
    chercherRecettesAvecBoucles(searchBar.value); // Filtrer les recettes en fonction de la saisie utilisateur
  });

  window.addEventListener("click", function (event) {
    if (!event.target.matches(".dropbtn")) {
      closeAllDropdowns(); // Fermer les dropdowns lorsqu'on clique en dehors
    }
  });

  document.querySelectorAll(".input-dropdowns").forEach((input) => {
    input.addEventListener("keyup", filterDropdownItems); // Filtrer les items du dropdown lors de la saisie dans les inputs des dropdowns
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

    const cardInner = document.createElement("div");
    cardInner.className = "card";

    const img = document.createElement("img");
    img.src = `images/${recipe.image}`;
    img.alt = recipe.name;
    img.className = "card-img";

    const structureCard = document.createElement("div");
    structureCard.className = "structure-card";

    const title = document.createElement("h3");
    title.className = "card-title";
    title.textContent = recipe.name;

    const description = document.createElement("p");
    description.className = "card-description";

    const recetteSpan = document.createElement("p");
    recetteSpan.className = "recette";
    recetteSpan.textContent = "RECETTE";

    const paragraphSpan = document.createElement("p");
    paragraphSpan.className = "paragraph";
    paragraphSpan.textContent = recipe.description;

    description.appendChild(recetteSpan);
    description.appendChild(paragraphSpan);

    const ingredientsHeader = document.createElement("h4");
    ingredientsHeader.className = "ingredients-h4";

    const ingredientsHeaderText = document.createElement("p");
    ingredientsHeaderText.className = "ingredients";
    ingredientsHeaderText.textContent = "INGREDIENTS";

    ingredientsHeader.appendChild(ingredientsHeaderText);

    const ingredientsListContainer = document.createElement("div");
    ingredientsListContainer.className = "ingredients-list-container";

    const ingredientsList = document.createElement("ul");
    ingredientsList.className = "ingredients-list";

    recipe.ingredients.forEach((ingredient) => {
      const listItem = document.createElement("li");

      const ingredientName = document.createElement("span");
      ingredientName.className = "ingredient-name";
      ingredientName.textContent = ingredient.ingredient;

      const quantity = document.createElement("span");
      quantity.className = "ingredient-quantity";
      quantity.textContent = ingredient.quantity
        ? ingredient.quantity + " "
        : "";

      const unit = document.createElement("span");
      unit.className = "ingredient-unit";
      unit.textContent = ingredient.unit ? ingredient.unit : "";

      listItem.appendChild(ingredientName);
      listItem.appendChild(document.createElement("br"));
      listItem.appendChild(quantity);
      listItem.appendChild(unit);
      ingredientsList.appendChild(listItem);
    });

    ingredientsListContainer.appendChild(ingredientsList);

    const time = document.createElement("p");
    time.className = "card-time";
    time.textContent = `${recipe.time} min`;

    structureCard.appendChild(title);
    structureCard.appendChild(description);
    structureCard.appendChild(ingredientsHeader);
    structureCard.appendChild(ingredientsListContainer);
    structureCard.appendChild(time);

    cardInner.appendChild(img);
    cardInner.appendChild(structureCard);

    card.appendChild(cardInner);

    container.appendChild(card);
  });
  recipesCountElement.textContent = `${filteredRecipes.length} RECETTES`;
}

// Fonction pour peupler les dropdowns avec les données des recettes
function populateDropdowns(filteredRecipes) {
  const allIngredientsSet = new Set();
  const allAppliancesSet = new Set();
  const allUtensilsSet = new Set();

  // Collecter tous les éléments disponibles dans toutes les recettes
  recipes.forEach((recipe) => {
    recipe.ingredients.forEach((item) =>
      allIngredientsSet.add(item.ingredient.toLowerCase())
    );
    allAppliancesSet.add(recipe.appliance.toLowerCase());
    recipe.ustensils.forEach((item) => allUtensilsSet.add(item.toLowerCase()));
  });

  let ingredientsSet = new Set();
  let appliancesSet = new Set();
  let utensilsSet = new Set();

  // Si un filtre est appliqué (le nombre de recettes filtrées est inférieur au nombre total de recettes)
  if (filteredRecipes.length < recipes.length) {
    // Collecter uniquement les éléments correspondant aux recettes filtrées
    filteredRecipes.forEach((recipe) => {
      recipe.ingredients.forEach((item) =>
        ingredientsSet.add(item.ingredient.toLowerCase())
      );
      appliancesSet.add(recipe.appliance.toLowerCase());
      recipe.ustensils.forEach((item) => utensilsSet.add(item.toLowerCase()));
    });
  } else {
    // Si aucun filtre n'est appliqué, montrer tous les éléments
    ingredientsSet = allIngredientsSet;
    appliancesSet = allAppliancesSet;
    utensilsSet = allUtensilsSet;
  }

  // Mettre à jour les dropdowns avec les ensembles appropriés
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

// Fonction pour ajouter des items dans les dropdowns
function addItemsToDropdown(selector, items) {
  const dropdown = document.querySelector(selector);
  const existingItems = dropdown.querySelectorAll(".dropdown-item");

  console.log("Adding items to dropdown:", selector, items); // Log pour vérifier les items ajoutés

  existingItems.forEach((item) => item.remove()); // Supprimer les anciens items avant d'ajouter les nouveaux

  items.forEach((item) => {
    const element = document.createElement("button");
    element.type = "button";
    element.className = "dropdown-item";
    element.textContent = item;
    console.log("Adding item:", item); // Log pour vérifier l'ajout de chaque item

    element.addEventListener("click", function () {
      addTag(item); // Ajouter un tag lorsqu'on clique sur un item
      filterRecipesByTags(); // Filtrer les recettes en fonction des tags actifs
      console.log(item + " selected");
    });
    dropdown.appendChild(element); // Ajouter l'élément au dropdown
  });
}

// Fonction pour chercher les recettes en fonction de la saisie utilisateur
function chercherRecettesAvecBoucles(champRecherche) {
  let resultats = [];
  let recherche = champRecherche.trim().toLowerCase();
  const messageElement = document.querySelector(".message");

  if (recherche.length < 3) {
    generateCards(recipes);
    populateDropdowns(recipes); // Utilise toutes les recettes si la recherche est vide ou < 3 caractères
    messageElement.innerHTML = "";
    return;
  }

  for (let i = 0; i < recipes.length; i++) {
    let correspond = false;

    // Vérifier si le nom de la recette contient le terme recherché
    if (recipes[i].name.toLowerCase().includes(recherche)) {
      correspond = true;
    }

    // Vérifier si la description de la recette contient le terme recherché
    if (
      !correspond &&
      recipes[i].description.toLowerCase().includes(recherche)
    ) {
      correspond = true;
    }

    // Vérifier si les ingrédients de la recette contiennent le terme recherché
    for (let j = 0; j < recipes[i].ingredients.length && !correspond; j++) {
      if (
        recipes[i].ingredients[j].ingredient.toLowerCase().includes(recherche)
      ) {
        correspond = true;
      }
    }

    // Ajouter la recette aux résultats si elle correspond
    if (correspond) {
      resultats.push(recipes[i]);
    }
  }

  if (resultats.length === 0) {
    messageElement.innerHTML = `Aucune recette ne contient '${recherche}' vous pouvez chercher « tarte aux pommes », « poisson », etc.`;
  } else {
    messageElement.innerHTML = "";
  }

  generateCards(resultats); // Générer les cartes pour les résultats filtrés
  populateDropdowns(resultats); // Mettre à jour les dropdowns avec les résultats filtrés
}

// Fonction pour fermer tous les dropdowns
function closeAllDropdowns() {
  const dropdownContents = document.querySelectorAll(".dropdown-content");
  dropdownContents.forEach((dropdown) => {
    dropdown.classList.remove("show");
  });
}

// Fonction pour filtrer les items dans les dropdowns en fonction de la saisie
function filterDropdownItems(event) {
  const input = event.target;
  const filter = input.value.toLowerCase();
  const dropdown = input.closest(".dropdown-content");
  const items = dropdown.querySelectorAll(".dropdown-item");

  items.forEach((item) => {
    const text = item.textContent.toLowerCase();
    if (text.includes(filter)) {
      item.style.display = ""; // Afficher l'item s'il correspond à la recherche
    } else {
      item.style.display = "none"; // Masquer l'item sinon
    }
  });
}

// Fonction pour filtrer les recettes en fonction des tags actifs
function filterRecipesByTags() {
  let filteredRecipes = recipes.filter((recipe) => {
    return activeTags.every((tag) => {
      const lowerCaseTag = tag.toLowerCase(); // Normalisation du tag
      return (
        recipe.ingredients.some(
          (ingredient) =>
            ingredient.ingredient.toLowerCase().includes(lowerCaseTag) // Normalisation des ingrédients
        ) ||
        recipe.appliance.toLowerCase().includes(lowerCaseTag) || // Normalisation des appareils
        recipe.ustensils.some(
          (ustensil) => ustensil.toLowerCase().includes(lowerCaseTag) // Normalisation des ustensiles
        )
      );
    });
  });
  generateCards(filteredRecipes); // Générer les cartes pour les recettes filtrées
  populateDropdowns(filteredRecipes); // Mettre à jour les dropdowns avec les recettes filtrées
}

// Fonction pour ajouter un tag actif lors de la sélection d'un item dans un dropdown
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
      removeTag(tagName, tag); // Supprimer le tag lorsqu'on clique sur la croix
    };

    tag.appendChild(closeBtn);
    document.getElementById("tags-container").appendChild(tag); // Ajouter le tag au conteneur de tags
  }
}

// Fonction pour retirer un tag actif
function removeTag(tagName, tagElement) {
  activeTags = activeTags.filter((tag) => tag !== tagName); // Retirer le tag de la liste des tags actifs
  tagElement.remove(); // Retirer l'élément tag du DOM
  filterRecipesByTags(); // Filtrer les recettes après suppression du tag
}
