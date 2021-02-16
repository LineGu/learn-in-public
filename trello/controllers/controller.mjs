import { Observation } from '../utils/observable.mjs';
import { cardContainerModel, cardModel } from '../models/model.mjs';
import { cardContainersView } from '../views/view.mjs';

export const CardContainerController = {
  init() {
    CardContainerController.cardContainersElem = document.querySelector('.main-container-bottom');
    CardContainerController.inputForContainerName = document.querySelector('.new-container-name');
    CardContainerController.confirmButtonElem = document.querySelector('.confirm-button');
    CardContainerController.bodyElem = document.querySelector('.body');
    CardContainerController.addButtonCardContainerElem = document.querySelector(
      '.add-card-container',
    );
    CardContainerController.modalCloseButtonElem = document.querySelector('.modal-close');
    CardContainerController.ContainerEditModalButtonElems = document.querySelectorAll(
      '.more-img-container',
    );

    CardContainerController.subscribeObservation();
  },

  subscribeObservation() {
    Observation.subscribe(cardContainersView.render);
    Observation.subscribe(CardContainerController.init);
    Observation.subscribe(CardContainerController.attachEventHandler);
  },

  initEventHandler(data) {
    CardContainerController.attachCardContainerAddHandler();
    CardContainerController.attachAddContainerModalHandler();
    CardContainerController.attachEditContainerModalHandler();
    CardContainerController.attachEditContainerModalHandlerToClose();
    CardContainerController.attachDeleteContainerHandler();
  },

  attachEventHandler(data) {
    CardContainerController.attachAddContainerModalHandler();
    CardContainerController.attachEditContainerModalHandler();
    CardContainerController.attachEditContainerModalHandlerToClose();
    CardContainerController.attachDeleteContainerHandler();
  },

  attachCardContainerAddHandler() {
    const { inputForContainerName, confirmButtonElem } = CardContainerController;
    confirmButtonElem.addEventListener('click', (event) => {
      const cardContainerNameToAdd = inputForContainerName.value;
      if (cardContainerNameToAdd === '') {
        alert('값을 입력하세요.');
        return;
      } else {
        cardContainerModel.addCardContainer(cardContainerNameToAdd);
        cardContainersView.closeModalForContainer();
      }
      cardContainersView.resetValue(inputForContainerName);

      confirmButtonElem.removeEventListener;
      event.stopPropagation();
    });
  },

  attachAddContainerModalHandler() {
    const { addButtonCardContainerElem, modalCloseButtonElem } = CardContainerController;
    modalCloseButtonElem.addEventListener('click', () => {
      cardContainersView.closeModalForContainer();
    });

    addButtonCardContainerElem.addEventListener('click', (event) => {
      cardContainersView.openModalForContainer();
    });
  },

  attachEditContainerModalHandler() {
    const { ContainerEditModalButtonElems } = CardContainerController;

    ContainerEditModalButtonElems.forEach((elem) =>
      elem.addEventListener('click', (event) => {
        const editModalIdToOpen = `${event.target.id}-modal`;
        cardContainersView.openEditModalForContainer(editModalIdToOpen);
      }),
    );
  },

  attachEditContainerModalHandlerToClose() {
    const { bodyElem } = CardContainerController;
    bodyElem.addEventListener('click', (event) => {
      if (event.target.classList[0] !== 'more-img-container') {
        const editModalOpened = document.querySelectorAll('.edit-modal-box');
        editModalOpened.forEach((elem) => cardContainersView.closeEditModalForContainer(elem));
      }
    });
  },

  attachDeleteContainerHandler() {
    const deleteContainerButtonElems = document.querySelectorAll('.delete-container');

    deleteContainerButtonElems.forEach((elem) =>
      elem.addEventListener('click', (event) => {
        const idOfDeleteContainer = elem.id;
        cardContainerModel.deleteCardContainer(idOfDeleteContainer);
      }),
    );
  },
};
