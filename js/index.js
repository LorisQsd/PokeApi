import pokemonAPI from "./api.js";
import modalHandler from "./modal.js";
// import components from "./components.js";
import utils from "./utils.js";

// SELECTEURS
const pokemonList = document.querySelector(".pokemon__list");
const generationContainer = document.querySelector(".generation-container");
const searchById = document.querySelector(".search-by-id");
const dialog = document.querySelector("dialog");

utils.preventSubmitForm("pokemon-form-by-id");

// EVENTS LISTENERS
// Recherche par id
searchById.addEventListener("keypress", async function (e) {
  if (e.key === "Enter"){// Si la touche "Entrer" est appuyée
    const id = e.target.value;// On récupère la valeur de l'input

    pokemonList.textContent = "";// AVANT de créer une carte, on nettoie la liste afin que les éléments ne se superposent pas.
    utils.showLoader();

    utils.clearActiveClass();
    const pokemon = await pokemonAPI.getPokemonById(id);// On passe cette valeur en argument de la fonction getPokemonById

    buildCards(pokemon);
  }
});

dialog.addEventListener("click", modalHandler.closeModal);

// FONCTIONS ASYNCHRONES
/** (Async) Affiche tous les pokemons de la génération sélectionnée */
async function handlePokemonsByGen(event){
  pokemonList.textContent = "";
  utils.showLoader();

  utils.clearActiveClass();

  event.target.classList.add("btn--active");
  const generation = event.target.getAttribute("data-generation");

  const pokemons = await pokemonAPI.getPokemonsByGen(generation);

  pokemons.forEach(pokemon => {
    buildCards(pokemon);
  });

}

async function showPokemonInfos(event){

  const data = await pokemonAPI.getPokemonById(event.currentTarget.getAttribute("data-id"));

  buildModalInfos(data);
  modalHandler.openModal();
}
// FONCTIONS CLASSIQUES
function buildCards(pokemon){
  const li = document.createElement("li");
  li.classList.add("pokemon__card");
  li.setAttribute("data-id", pokemon.pokedexId);

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
  utils.hideLoader();

  li.addEventListener("click", showPokemonInfos);
}

function generationBtn(id){
  const btn = document.createElement("btn"); // Création d'un <button>
  btn.classList.add("generation__btn");
  btn.setAttribute("data-generation", id);
  btn.textContent = `Génération ${id}`;

  generationContainer.appendChild(btn);
  utils.hideLoader();

  btn.addEventListener("click", handlePokemonsByGen);
}

function buildModalInfos(pokemon){
  // CLEAR MODAL
  dialog.textContent = "";
  dialog.classList.add("from-top");
  setTimeout(() => {dialog.classList.remove("from-top");}, 500);

  // BUILD
  // button close modal
  const closeBtn = document.createElement("i");
  closeBtn.classList.add("bi");
  closeBtn.classList.add("bi-x-square");
  dialog.appendChild(closeBtn);
  closeBtn.addEventListener("click", ()=>{
    dialog.classList.add("opacity");
    setTimeout(() => { dialog.close(), dialog.classList.remove("opacity"); }, 475);
  });

  // div InfosContainer
  const infosContainer = document.createElement("div");
  infosContainer.classList.add("infos-container");

  dialog.prepend(infosContainer);

  // h2 Title
  const title = document.createElement("h2");
  title.classList.add("modal__title");
  title.textContent = `Détails du Pokemon`;

  dialog.prepend(title);

  // Img
  const img = document.createElement("img");
  img.classList.add("modal__img");
  img.setAttribute("src", pokemon.sprites.regular);
  img.setAttribute("alt", pokemon.name.fr);

  infosContainer.appendChild(img);

  // div infos-right
  const infosRight = document.createElement("div");
  infosRight.classList.add("infos-right");

  infosContainer.appendChild(infosRight);

  // h3 Subtitle
  const subtitle = document.createElement("h3");
  subtitle.classList.add("modal__subtitle");
  subtitle.textContent = `#${pokemon.pokedexId} ${pokemon.name.fr}`;

  infosRight.appendChild(subtitle);

  // div types-container
  const typesContainer = document.createElement("div");
  typesContainer.classList.add("types-container");
  infosRight.appendChild(typesContainer);

  // div pokemon__types
  pokemon.types.forEach(type => {
    const divType = document.createElement("div");
    divType.classList.add("pokemon__types");
    divType.classList.add(type.name.toLowerCase());

    const paragType = document.createElement("p");
    paragType.classList.add("type__paragraph");
    paragType.textContent = type.name;

    divType.appendChild(paragType);
    typesContainer.appendChild(divType);
  });

  // h4 stats-title
  const statsTitle = document.createElement("h4");
  statsTitle.textContent = "Satitstiques";
  statsTitle.classList.add("stats__title");
  infosRight.appendChild(statsTitle);

  // ul stats__list
  const statsList = document.createElement("ul");
  statsList.classList.add("stats__list");
  infosRight.appendChild(statsList);

  // li stats__list-items
  for (const stat in pokemon.stats){
    const li = document.createElement("li");
    li.classList.add("stats__list-item");

    const statName = document.createElement("span");
    statName.textContent = stat;
    li.appendChild(statName);

    const statValue = document.createElement("span");
    statValue.textContent = pokemon.stats[stat];
    li.appendChild(statValue);

    const progressBar = document.createElement("div");
    progressBar.classList.add("progress-bar--bg");
    li.appendChild(progressBar);

    const progressBarValue = document.createElement("div");
    progressBarValue.classList.add("progress-bar--prog");
    progressBarValue.style.width = ((pokemon.stats[stat] / 255)*100).toFixed(2) + "%";
    progressBarValue.animate(
      [
        // keyframes
        { width: "0%" },
        { width: ((pokemon.stats[stat] / 255)*100).toFixed(2) + "%" },
      ],
      {
        // timing options
        duration: 1000,
        iterations: 1,
        easing: "ease"
      },
    );
    progressBar.appendChild(progressBarValue);

    statsList.appendChild(li);

  }

}

// MODAL HANDLER

/** (Async) Génération des boutons en fonction du nombre de génération dispo dans l'API */
async function initAPICall(){
  const generations = await pokemonAPI.getGenerations();

  generations.forEach( generation => {
    generationBtn(generation.generation);
  });

}

document.addEventListener("DOMContentLoaded", initAPICall);
