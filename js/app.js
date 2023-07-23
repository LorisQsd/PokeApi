// SELECTEURS
const form = document.querySelector(".form");
const pokemonList = document.querySelector(".pokemon__list");
const generationContainer = document.querySelector(".generation-container");
const searchById = document.querySelector(".search-by-id");
const loader = document.querySelector(".loader");

// Prevent Default sur le comportement du formulaire
form.addEventListener("submit", function(e) {
  e.preventDefault();
});

// EVENTS LISTENERS
// Recherche par id
searchById.addEventListener("keypress", function (e) {
  if (e.key === "Enter"){// Si la touche "Entrer" est appuyée
    const id = e.target.value;// On récupère la valeur de l'input

    pokemonList.textContent = "";// AVANT de créer une carte, on nettoie la liste afin que les éléments ne se superposent pas.
    loader.style.display = "block";// On affiche le loader

    getPokemonById(id);// On passe cette valeur en argument de la fonction getPokemonById
  }
});

// FONCTIONS ASYNCHRONES
/** (Async) Récupère les données d'un pokemon selon son id */
async function getPokemonById(id){
  try {
    const response = await fetch(`https://api-pokemon-fr.vercel.app/api/v1/pokemon/${id}`);

    if (!response.ok){
      throw new Error(`${response.status}`);
    }

    const data = await response.json();

    buildCards(data);
  } catch (error) {
    console.trace(error);
  }
}

/** (Async) Récupère les données de tous les pokemons de la génération séléctionnée */
async function fetchPokemonsByGen(event){
  pokemonList.textContent = "";
  loader.style.display = "block";

  generationContainer.querySelectorAll(".generation__btn").forEach(btn => {
    if (btn.classList.contains("btn--active")){
      btn.classList.remove("btn--active");
    }
  });

  event.target.classList.add("btn--active");
  try {
    const response = await fetch(`https://api-pokemon-fr.vercel.app/api/v1/gen/${event.target.getAttribute("data-generation")}`);

    if (!response.ok) {
      throw new Error(`${response.status}`);

    }
    const data = await response.json();

    data.forEach(pokemon => {
      buildCards(pokemon);
    });
  } catch (error) {
    console.trace(error);
  }
}

// FONCTIONS CLASSIQUES
function buildCards(pokemon){
  const li = document.createElement("li");
  li.classList.add("pokemon__card");

  const img = document.createElement("img");
  img.classList.add("card__img");
  img.setAttribute("alt", pokemon.name.fr);
  img.setAttribute("src", pokemon.sprites.regular);

  const title = document.createElement("h2");
  title.classList.add("card__title");
  title.textContent = `#${pokemon.pokedexId} ${pokemon.name.fr}`;

  pokemonList.appendChild(li);// Ajout du li dans la liste
  li.appendChild(img);// Ajout d'une image dans le list item
  li.appendChild(title);// Ajout du titre dans le list item
  loader.style.display = "none";
}

function buildGenerationBtn(id){
  const btn = document.createElement("btn"); // Création d'un <button>
  btn.classList.add("generation__btn");
  btn.setAttribute("data-generation", id);
  btn.textContent = `Génération ${id}`;

  generationContainer.appendChild(btn);
  loader.style.display = "none";

  btn.addEventListener("click", fetchPokemonsByGen);
}

/** (Async) Création d'une première liste (151 premiers pokemons) à l'arrivée sur la page */
async function initAPICall(){
  try {
    const response = await fetch("https://api-pokemon-fr.vercel.app/api/v1/gen");

    if (!response.ok) {
      throw new Error(`${response.status}`);
    }

    const data = await response.json();

    data.forEach( generation => {
      buildGenerationBtn(generation.generation);
    });


  } catch (error) {
    console.trace(error);
  }
}

document.addEventListener("DOMContentLoaded", initAPICall);
