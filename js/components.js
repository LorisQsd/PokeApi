import utils from "./utils.js";
import pokemonAPI from "./api.js";

const components = {
  generationBtn(id) {
    const generationBtnClone = utils.cloneTemplate("generation-btn-template");

    const generationBtn = generationBtnClone.querySelector(".generation__btn");

    generationBtn.setAttribute("data-generation", id);
    generationBtn.textContent = `Génération ${id}`;

    // Ajout d'un listener sur le bouton pour gérer l'apparition des pokemons au click

    generationBtn.addEventListener("click", async (event) => {
      const pokemonList = document.querySelector(".pokemon__list");
      pokemonList.textContent = "";

      utils.showLoader();

      utils.clearActiveClass();

      event.target.classList.add("btn--active");

      const generation = event.target.getAttribute("data-generation");
      const pokemons = await pokemonAPI.getPokemonsByGen(generation);

      pokemons.forEach(pokemon => {
        console.log(pokemon);// En attente d'intégration de la method buildCard
      });

    });

    const generationContainer = document.querySelector(".generation-container");

    generationContainer.appendChild(generationBtnClone);
    utils.hideLoader();
  }
};

export default components;
