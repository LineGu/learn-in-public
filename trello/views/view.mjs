import {
  createCardContainerElem,
  createCardElem,
  createAddingCardContainerElem,
} from '../create_components/dom_component.mjs';

export const cardContainersView = {
  render(cardContainers) {
    const cardContainerElem = document.querySelector('.main-container-bottom');

    cardContainerElem.innerHTML = cardContainers
      .map((cardContainer) => {
        const cards = cardContainer.cards;

        const cardsElem = cards
          .map((card) => createCardElem(card.header, card.body, card.footer))
          .join('');

        return createCardContainerElem(
          cardContainer.name,
          cardContainer.count,
          cardsElem,
          cardContainer.id,
        );
      })
      .join('');

    cardContainerElem.insertAdjacentHTML('beforeend', createAddingCardContainerElem());
  },

  openModalForContainer() {
    document.querySelector('.modal').classList.remove('hidden');
  },

  closeModalForContainer() {
    document.querySelector('.modal').classList.add('hidden');
  },

  openEditModalForContainer(idOfElem) {
    document.getElementById(`${idOfElem}`).classList.remove('hidden');
  },

  closeEditModalForContainer(elemToClose) {
    elemToClose.classList.add('hidden');
  },

  resetValue(elem) {
    elem.value = '';
  },
};
