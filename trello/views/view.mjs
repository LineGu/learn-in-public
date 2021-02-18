import {
  createCardContainerElem,
  createCardElem,
  createAddingCardContainerElem,
} from '../create_components/dom_component.mjs';

import { cardContainers } from '../models/card_data.mjs';

import { cardContainerModel, cardModel } from '../models/model.mjs';

export const cardContainersView = {
  render(cardContainers) {
    const cardContainerElem = document.querySelector('.main-container-bottom');

    cardContainerElem.innerHTML = cardContainers
      .map((cardContainer) => {
        const cards = cardContainer.cards;

        const cardsElem = cards.map((card) => createCardElem(card, cardContainer)).join('');

        return createCardContainerElem(cardContainer, cardsElem);
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

  openModalOfAddingCard(idOfElem) {
    document.getElementById(`${idOfElem}`).classList.remove('hidden');
  },

  closeModalOfAddingCard(idOfElem) {
    document.getElementById(`${idOfElem}`).classList.add('hidden');
  },

  openEditModeForContainer(idOfElem) {
    const idOfContainer = idOfElem.split('-')[0];
    const indexOfContainer = cardContainerModel.findContainerIndexById(idOfContainer);
    cardContainers[indexOfContainer].cards.forEach((card) => {
      document
        .getElementById(`edit-mode-bottom-${idOfContainer}-${card.id}`)
        .classList.remove('hidden');
    });
    document.getElementById(`${idOfElem}-top`).classList.remove('hidden');
    document.getElementById(`${idOfElem}-header`).classList.add('hidden');
  },

  confirmEditModeForContainer(idOfElem) {
    document.getElementById(`${idOfElem}-top`).classList.add('hidden');
    document.getElementById(`${idOfElem}-bottom`).classList.add('hidden');
    document.getElementById(`${idOfElem}-header`).classList.remove('hidden');
  },

  openEditModalForCard(idOfElem) {
    document.getElementById(`${idOfElem}`).classList.remove('hidden');
  },

  closeEditModalForCard(elemToClose) {
    elemToClose.classList.add('hidden');
  },

  openEditCard(idOfElemToOpen, idOfElemToClose) {
    document.getElementById(`${idOfElemToOpen}`).classList.remove('hidden');
    document.getElementById(`${idOfElemToClose}`).classList.add('hidden');
  },

  closeEditCard(idOfElemToOpen, idOfElemToClose) {
    document.getElementById(`${idOfElemToOpen}`).classList.remove('hidden');
    document.getElementById(`${idOfElemToClose}`).classList.add('hidden');
  },

  resetValue(elem) {
    elem.value = '';
  },
};
