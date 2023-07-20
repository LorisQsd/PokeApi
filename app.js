// SELECTEURS
const form = document.querySelector(".form");
const pokemonList = document.querySelector(".pokemon__list");
const searchById = document.querySelector(".search-by-id");
const searchByMin = document.querySelector(".search-by-min");
const searchByMax = document.querySelector(".search-by-max");
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

// Recherche par interval d'id
// Exemple: Du pokemon 10 (min) au pokemon 150 (max)
searchByMax.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    pokemonList.textContent = "";
    loader.style.display = "block";

    getPokemonByInterval(parseInt(searchByMin.value), searchByMax.value);
  }
});
searchByMin.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    pokemonList.textContent = "";
    loader.style.display = "block";
    getPokemonByInterval(parseInt(searchByMin.value), searchByMax.value);
  }
});

// FONCTIONS
/** (Async) Récupère les données d'un pokemon selon son id */
async function getPokemonById(id){
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);

    if (!response.ok){
      throw new Error(`${response.status}`);
    }

    const data = await response.json();// data renvoi de la donnée beaucoup plus complète.
    // cf : https://pokeapi.co/docs/v2#pokemon

    buildCards(data, data.id);
  } catch (error) {
    console.trace(error);
  }
}

/** (Async) Récupère les données d'un pokemon selon un interval (min / max) donné */
async function getPokemonByInterval(min, max) {
  if (!min){ // Si min n'est pas défini, on lui donne une valeur par défaut de 1
    min = 1;
  }
  min--; // On décrémente min pour INCLURE le pokemon min
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${(max)}`);

    if (!response.ok){
      throw new Error(`${response.status}`);
    }

    const data = await response.json();
    // data.results renvoi :
    // {name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/'}

    data.results// Je prends touts les objets de mon tableau result
      .slice(min)// Je découpe le début au min (le max sera dans la limit de l'url)
      .forEach(pokemon => {
        min++;// J'incrémente min à chaque passage pour modifier l'id
        // L'id n'est pas renvoyé dans les datas
        buildCards(pokemon, min);
      });

  } catch (error) {
    console.trace(error);
  }
}

function buildCards(pokemon, id){
  const li = document.createElement("li");// Création d'un <li></li>
  li.classList.add("pokemon__card");// Ajout d'une classe <li class="pokemon__card"></li>

  const img = document.createElement("img");// Création d'un <img>
  img.classList.add("card__img");// Ajout d'une classe <img class="card__img">
  img.setAttribute("alt", `Pokemon ${pokemon.name}`);// Ajout d'un attribut alt <img class="card__img" alt="Pokemon example">
  img.setAttribute("src", `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`);// Ajout d'un attribut src <img class="card__img" alt="Pokemon example" src="url">

  const title = document.createElement("h2");// Création d'un titre <h2></h2>
  title.classList.add("card__title");// Ajout d'une classe <h2 class="card__title"></h2>
  title.textContent = `#${id} ${pokemon.name}`;// Ajout de texte <h2 class="card__title">#id pokemon</h2>

  pokemonList.appendChild(li);// Ajout du li dans la liste
  li.appendChild(img);// Ajout d'une image dans le list item
  li.appendChild(title);// Ajout du titre dans le list item
  loader.style.display = "none";
}

/** (Async) Création d'une première liste (151 premiers pokemons) à l'arrivée sur la page */
async function initAPICall(){
  try {
    const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151");

    if (!response.ok) {
      throw new Error(`${response.status}`);
    }

    const data = await response.json();
    // data.results renvoi :
    // {name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/'}

    let min = 1;
    data.results.forEach(pokemon => {

      buildCards(pokemon, min);
      min++;
    });

  } catch (error) {
    console.trace(error);
  }
}

document.addEventListener("DOMContentLoaded", initAPICall);
