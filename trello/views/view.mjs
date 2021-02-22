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
      console.log(document.getElementById(`edit-mode-bottom-${idOfContainer}-${card.id}`));
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

  showPreviewForContainerToDropRight(idOfDraggedContainer, idOfDropTarget) {
    const indexOfDraggedContainer = cardContainerModel.findContainerIndexById(idOfDraggedContainer);
    const indexOfTarget = cardContainerModel.findContainerIndexById(idOfDropTarget);

    const nameOfDraggedContainer = cardContainers[indexOfDraggedContainer].name;

    const nameOfTarget = cardContainers[indexOfTarget].name;

    const draggedContainerElem = document.getElementById(
      `${nameOfDraggedContainer}-${idOfDraggedContainer}`,
    );
    const dropTargetElem = document.getElementById(`${nameOfTarget}-${idOfDropTarget}`);

    dropTargetElem.after(draggedContainerElem);

    draggedContainerElem.classList.add('virtual');
  },

  showPreviewForContainerToDropLeft(idOfDraggedContainer, idOfDropTarget) {
    const indexOfDraggedContainer = cardContainerModel.findContainerIndexById(idOfDraggedContainer);
    const indexOfTarget = cardContainerModel.findContainerIndexById(idOfDropTarget);

    const nameOfDraggedContainer = cardContainers[indexOfDraggedContainer].name;

    const nameOfTarget = cardContainers[indexOfTarget].name;

    const draggedContainerElem = document.getElementById(
      `${nameOfDraggedContainer}-${idOfDraggedContainer}`,
    );
    const dropTargetElem = document.getElementById(`${nameOfTarget}-${idOfDropTarget}`);

    dropTargetElem.before(draggedContainerElem);

    draggedContainerElem.classList.add('virtual');
  },

  showPreviewForCardToDropContainer(idsOfDraggedCard, idOfDropTarget) {
    const draggedCardElem = document.getElementById(
      `card-total-box-${idsOfDraggedCard[0]}-${idsOfDraggedCard[1]}`,
    );
    const dropTargetCardElem = document.querySelector(`#card-box-body-${idOfDropTarget}`);

    dropTargetCardElem.append(draggedCardElem);

    draggedCardElem.querySelector('.card').classList.add('virtual');
  },

  showPreviewForCardToDropTop(idsOfDraggedCard, idsOfDropTarget) {
    const draggedCardElem = document.getElementById(
      `card-total-box-${idsOfDraggedCard[0]}-${idsOfDraggedCard[1]}`,
    );
    const dropTargetCardElem = document.getElementById(
      `card-total-box-${idsOfDropTarget[0]}-${idsOfDropTarget[1]}`,
    );

    dropTargetCardElem.before(draggedCardElem);

    draggedCardElem.querySelector('.card-helper').classList.remove('card-helper-box');

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

    draggedCardElem.querySelector('.card-helper').classList.remove('card-helper-box');

    draggedCardElem.querySelector('.card').classList.add('virtual');
  },

  resetValue(elem) {
    elem.value = '';
  },
};
