const utils = {
  /** Retourne le clone du template
     *
     * @param {string} templateId L'id="" du template à cloner.
     * @returns Le clone du template.
     */
  cloneTemplate(templateId) {
    return document.getElementById(templateId).content.cloneNode(true);
  },
  showLoader(){
    const loader = document.querySelector(".loader");
    loader.style.display = "block";
  },
  hideLoader(){
    const loader = document.querySelector(".loader");
    loader.style.display = "none";
  },
  clearActiveClass(){
    const generationContainer = document.querySelector(".generation-container");
    generationContainer.querySelectorAll(".generation__btn").forEach(btn => {
      if (btn.classList.contains("btn--active")){
        btn.classList.remove("btn--active");
      }
    });
  }
};

export default utils;
