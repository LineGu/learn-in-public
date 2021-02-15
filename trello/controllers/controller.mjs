import { Observation } from '../utils/observable.mjs';
import { cardContainerModel, cardModel } from '../models/model.mjs';
import { cardContainersView } from '../views/view.mjs';

export const CardContainerController = {
  init() {
    CardContainerController.buttonToAddCardContainerElem = document.querySelector(
      '.main-container-bottom',
    );
    CardContainerController.inputForContainerName = document.querySelector('.new-container-name');
    CardContainerController.confirmButtonElem = document.querySelector('.confirm-button');

    CardContainerController.subscribeObservation();
    CardContainerController.attachEventHandler();
  },

  subscribeObservation() {
    Observation.subscribe(cardContainersView.render);
  },

  attachEventHandler() {
    CardContainerController.attachCardContainerAddHandler();
    CardContainerController.attachAddContainerModalHandler();
  },

  attachCardContainerAddHandler() {
    const { inputForContainerName, confirmButtonElem } = CardContainerController;

    confirmButtonElem.addEventListener('click', (event) => {
      const cardContainerNameToAdd = inputForContainerName.value;
      cardContainersView.resetValue(inputForContainerName);

      if (cardContainerNameToAdd === '') {
        let isValidName = confirm('아무것도 입력 안하시겠습니까?');
        if (isValidName) {
          cardContainerModel.addCardContainer(cardContainerNameToAdd);
        }
        cardContainersView.closeModalForContainer();
        return;
      }
      cardContainerModel.addCardContainer(cardContainerNameToAdd);
      cardContainersView.closeModalForContainer();
    });
  },

  attachAddContainerModalHandler() {
    const { buttonToAddCardContainerElem } = CardContainerController;
    const modalCloseButtonElem = document.querySelector('.modal-close');

    modalCloseButtonElem.addEventListener('click', () => {
      cardContainersView.closeModalForContainer();
    });

    buttonToAddCardContainerElem.addEventListener('click', (event) => {
      const addButtonElem = document.querySelector('.add-card-container');

      if (addButtonElem === event.target || addButtonElem.firstElementChild === event.target) {
        cardContainersView.openModalForContainer();
      }
      event.stopPropagation;
    });
  },
};
