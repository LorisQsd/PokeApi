const form = document.querySelector(".form");
form.addEventListener("submit", function(e) {
  e.preventDefault();
});

const pokemonList = document.querySelector(".pokemon__list");
const searchInput = document.querySelector(".search-by-id");
searchInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter"){
    const id = e.target.value;
    getPokemonById(id);
  }
});

async function getPokemonById(id){
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);

    if (!response.ok){
      throw new Error(`${response.status}`);
    }

    const data = await response.json();

    console.log(data);

    pokemonList.textContent = "";
    buildOneCard(data);
  } catch (error) {
    console.trace(error);
  }
}

const searchMinInput = document.querySelector(".search-by-min");
const searchMaxInput = document.querySelector(".search-by-max");
searchMaxInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    getPokemonByInterval(parseInt(searchMinInput.value), searchMaxInput.value);
  }
});

async function getPokemonByInterval(min, max) {
  if (!min){
    min = 1;
  }
  min--;
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${(max)}`);

    if (!response.ok){
      throw new Error(`${response.status}`);
    }

    const data = await response.json();


    pokemonList.textContent = "";


    data.results.slice(min).forEach(pokemon => {
      min++;
      buildManyCards(pokemon, min);
    });

  } catch (error) {
    console.trace(error);
  }
}

async function initAPICall(){
  try {
    const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=10&offset=0");

    if (!response.ok) {
      throw new Error(`${response.status}`);
    }

    const data = await response.json();

    let min = 1;
    data.results.forEach(pokemon => {

      buildManyCards(pokemon, min);
      min++;
    });

  } catch (error) {
    console.trace(error);
  }
}

function buildOneCard(pokemon){
  const li = document.createElement("li");
  li.classList.add("pokemon__card");

  const img = document.createElement("img");
  img.classList.add("card__img");
  img.setAttribute("alt", `Pokemon ${pokemon.name}`);
  img.setAttribute("src", `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`);

  const title = document.createElement("h2");
  title.classList.add("card__title");
  title.textContent = `#${pokemon.id} ${pokemon.name}`;

  pokemonList.appendChild(li);
  li.appendChild(img);
  li.appendChild(title);
}

function buildManyCards(pokemon, min){
  const li = document.createElement("li");
  li.classList.add("pokemon__card");

  const img = document.createElement("img");
  img.classList.add("card__img");
  img.setAttribute("alt", `Pokemon ${pokemon.name}`);
  img.setAttribute("src", `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${min}.png`);

  const title = document.createElement("h2");
  title.classList.add("card__title");
  title.textContent = `#${min} ${pokemon.name}`;

  pokemonList.appendChild(li);
  li.appendChild(img);
  li.appendChild(title);
}

document.addEventListener("DOMContentLoaded", initAPICall);
