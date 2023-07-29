
const pokemonAPI = {
  /** (Async) Récupère les données du nombre de génération */
  async getGenerations(){
    try {
      const response = await fetch(`https://api-pokemon-fr.vercel.app/api/v1/gen`);

      if (!response.ok){
        throw new Error(`${response.status}`);
      }

      const data = await response.json();

      return data;
    } catch (error) {
      console.trace(error);
    }
  },
  /** (Async) Récupère les données d'un pokemon selon son id */
  async  getPokemonById(id){
    try {
      const response = await fetch(`https://api-pokemon-fr.vercel.app/api/v1/pokemon/${id}`);

      if (!response.ok){
        throw new Error(`${response.status}`);
      }

      const data = await response.json();

      return data;
    } catch (error) {
      console.trace(error);
    }
  },
  /** (Async) Récupère les données de tous les pokemons selon leur génération */
  async getPokemonsByGen(generation) {
    try {
      const response = await fetch(`https://api-pokemon-fr.vercel.app/api/v1/gen/${generation}`);

      if (!response.ok) {
        throw new Error(`${response.status}`);
      }

      const data = await response.json();

      return data;
    } catch (error) {
      console.trace(error);
    }
  }
};


export default pokemonAPI;
