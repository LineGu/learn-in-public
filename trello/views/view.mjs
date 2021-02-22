import {
  createCardContainerElem,
  createCardElem,
  createAddingCardContainerElem,
} from '../create_components/dom_component.mjs';

import { cardContainers } from '../models/card_data.mjs';

import { cardContainerModel, cardModel } from '../models/model.mjs';

import { dragController } from '../controllers/dragController.mjs';

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
    const containerName = cardContainers[indexOfContainer].name;

    cardContainers[indexOfContainer].cards.forEach((card) => {
      document
        .getElementById(`edit-mode-bottom-${idOfContainer}-${card.id}`)
        .classList.remove('hidden');
    });
    document.getElementById(`${idOfElem}-top`).classList.remove('hidden');
    document.getElementById(`${idOfElem}-header`).classList.add('hidden');
    document
      .getElementById(`${containerName}-${idOfContainer}`)
      .querySelectorAll('.card')
      .forEach((card) => {
        card.classList.add('shake');
      });
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

  showPreviewForContainerDrop(idOfDraggedContiner, idOfDropTarget) {
    const indexOfDraggedContainer = cardContainerModel.findContainerIndexById(idOfDraggedContiner);
    const indexOfDropTargetContianer = cardContainerModel.findContainerIndexById(idOfDropTarget);

    const draggedContainer = cardContainers[indexOfDraggedContainer];
    const dropTargetContianer = cardContainers[indexOfDropTargetContianer];

    const containerBox = document.querySelector('.main-container-bottom');
    const draggedContinerElem = document.getElementById(
      `${draggedContainer.name}-${draggedContainer.id}`,
    );
    const dropTargetContianerElem = document.getElementById(
      `${dropTargetContianer.name}-${dropTargetContianer.id}`,
    );

    dropTargetContianerElem.after(draggedContinerElem);
  },

  showPreviewForCardToDropTop(idsOfDraggedCard, idsOfDropTarget) {
    const draggedCardElem = document.getElementById(
      `card-total-box-${idsOfDraggedCard[0]}-${idsOfDraggedCard[1]}`,
    );
    const dropTargetCardElem = document.getElementById(
      `card-total-box-${idsOfDropTarget[0]}-${idsOfDropTarget[1]}`,
    );

    dropTargetCardElem.before(draggedCardElem);

    draggedCardElem.querySelector('.card').classList.add('virtual');
  },

  showPreviewForCardToDropBottom(idsOfDraggedCard, idsOfDropTarget) {
    const draggedCardElem = document.getElementById(
      `card-total-box-${idsOfDraggedCard[0]}-${idsOfDraggedCard[1]}`,
    );
    const dropTargetCardElem = document.getElementById(
      `card-total-box-${idsOfDropTarget[0]}-${idsOfDropTarget[1]}`,
    );

    dropTargetCardElem.after(draggedCardElem);

    draggedCardElem.querySelector('.card').classList.add('virtual');
  },

  resetValue(elem) {
    elem.value = '';
  },
};
