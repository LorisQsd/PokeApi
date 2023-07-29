const modalHandler = {
  pokemonModal: document.querySelector("dialog"),
  /** Gère la fenêtre modal pour les règles */
  openModal() {
    modalHandler.pokemonModal.showModal();
  },
  closeModal(event){
    const modalDimensions = modalHandler.pokemonModal.getBoundingClientRect();

    if (
      event.clientX < modalDimensions.left ||
        event.clientX > modalDimensions.right ||
        event.clientY < modalDimensions.top ||
        event.clientY > modalDimensions.bottom
    ) {
      modalHandler.pokemonModal.classList.add("opacity");
      setTimeout(() => { modalHandler.pokemonModal.close(), modalHandler.pokemonModal.classList.remove("opacity"); }, 475);
    }
  }
};

export default modalHandler;

