// SELECTEURS
const form = document.querySelector(".form");
const pokemonList = document.querySelector(".pokemon__list");
const generationContainer = document.querySelector(".generation-container");
const searchById = document.querySelector(".search-by-id");
const loader = document.querySelector(".loader");

const dialog = document.querySelector("dialog");

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

    clearActiveClass();

    getPokemonById(id);// On passe cette valeur en argument de la fonction getPokemonById
  }
});

dialog.addEventListener("click", closeModal);

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

  clearActiveClass();

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

async function showPokemonInfos(event){

  try {
    const response = await fetch(`https://api-pokemon-fr.vercel.app/api/v1/pokemon/${event.currentTarget.getAttribute("data-id")}`);

    if (!response.ok){
      throw new Error(`${response.status}`);
    }

    const data = await response.json();

    console.log(data);

    buildModalInfos(data);
    openModal();
  } catch (error) {
    console.trace(error);
  }
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
  loader.style.display = "none";

  li.addEventListener("click", showPokemonInfos);
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

function buildModalInfos(pokemon){
  // CLEAR MODAL
  dialog.textContent = "";
  dialog.classList.add("from-top");

  // BUILD
  // button close modal
  const closeBtn = document.createElement("i");
  closeBtn.classList.add("bi");
  closeBtn.classList.add("bi-x-square");
  dialog.appendChild(closeBtn);
  closeBtn.addEventListener("click", ()=>{dialog.close();});

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
    progressBarValue.style.width = ((pokemon.stats[stat] / 225)*100).toFixed(2) + "%";
    progressBarValue.animate(
      [
        // keyframes
        { width: "0%" },
        { width: ((pokemon.stats[stat] / 225)*100).toFixed(2) + "%" },
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

function clearActiveClass(){
  generationContainer.querySelectorAll(".generation__btn").forEach(btn => {
    if (btn.classList.contains("btn--active")){
      btn.classList.remove("btn--active");
    }
  });
}

// MODAL HANDLER
/** Gère la fenêtre modal pour les règles */
function openModal(){
  dialog.showModal();
}

function closeModal(event){
  const dialogDimensions = dialog.getBoundingClientRect();
  dialog.classList.remove("from-top");

  if (
    event.clientX < dialogDimensions.left ||
      event.clientX > dialogDimensions.right ||
      event.clientY < dialogDimensions.top ||
      event.clientY > dialogDimensions.bottom
  ) {
    dialog.close();
  }
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
