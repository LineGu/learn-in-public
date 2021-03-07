import { Observation } from '../utils/observable.mjs';
import { cardContainerModel, cardModel } from '../models/model.mjs';
import { cardContainersView } from '../views/view.mjs';
import { cardContainers } from '../models/card_data.mjs';
import { dragController } from './dragController.mjs';
import { loginController } from './loginController.mjs';

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

    CardContainerController.buttonToOpenAddingCardElems = document.querySelectorAll('.plus-img');
    CardContainerController.buttonToCloseAddingCardElems = document.querySelectorAll(
      '.confirm-button-cancle',
    );

    CardContainerController.buttonToOpenEditCardElems = document.querySelectorAll(
      '.edit-mode-card',
    );
    CardContainerController.buttonToCloseEditCardElems = document.querySelectorAll(
      '.confirm-button-cancle-edit',
    );

    CardContainerController.editModeButtonElems = document.querySelectorAll('.edit-mode-container');
    CardContainerController.confirmButtonForContainerEditElems = document.querySelectorAll(
      '.confirm-container-edit',
    );

    CardContainerController.confirmButtontoAddCardElems = document.querySelectorAll(
      '.confirm-button-add',
    );

    CardContainerController.confirmButtonForCardEditElems = document.querySelectorAll(
      '.confirm-button-add-edit',
    );

    CardContainerController.filterOfCardElem = document.querySelector('.filter-cards');

    CardContainerController.buttonToRemoveCardElems = document.querySelectorAll('.remove-card');

    CardContainerController.CardEditModalButtonElems = document.querySelectorAll('.more-img-card');

    CardContainerController.menuModalElem = document.querySelector('.menu-modal');
    CardContainerController.menuButtonElem = document.querySelector('.menu-img');
    CardContainerController.logOutButtonElem = document.querySelector('.log-out');

    dragController.init();

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
    CardContainerController.attachOpenModalForAddingCardHandler();
    CardContainerController.attachCloseModalForAddingCardHandler();
    CardContainerController.attachOpenEditModeForContainer();
    CardContainerController.attachConfirmEditModeForContainer();
    CardContainerController.attachConfirmAddingCard();
    CardContainerController.attachEditCardModalHandler();
    CardContainerController.attachEditCardModalHandlerToClose();
    CardContainerController.attachDeleteCardHandler();
    CardContainerController.attachOpenModalToEditCardHandler();
    CardContainerController.attachCloseModalToEditCardHandler();
    CardContainerController.attachConfirmEditForCard();
    CardContainerController.attachDeleteCardForImgHandler();
    CardContainerController.attachFilterCard();
    CardContainerController.attachEnterKeyHandler();
    CardContainerController.attachOpenMenuModalHandler();
    CardContainerController.attachCloseMenuModalHandler();
    CardContainerController.attachLogOutHandler();
  },

  attachEventHandler(data) {
    CardContainerController.attachAddContainerModalHandler();
    CardContainerController.attachEditContainerModalHandler();
    CardContainerController.attachEditContainerModalHandlerToClose();
    CardContainerController.attachDeleteContainerHandler();
    CardContainerController.attachOpenModalForAddingCardHandler();
    CardContainerController.attachCloseModalForAddingCardHandler();
    CardContainerController.attachOpenEditModeForContainer();
    CardContainerController.attachConfirmEditModeForContainer();
    CardContainerController.attachConfirmAddingCard();
    CardContainerController.attachEditCardModalHandler();
    CardContainerController.attachEditCardModalHandlerToClose();
    CardContainerController.attachDeleteCardHandler();
    CardContainerController.attachOpenModalToEditCardHandler();
    CardContainerController.attachCloseModalToEditCardHandler();
    CardContainerController.attachConfirmEditForCard();
    CardContainerController.attachDeleteCardForImgHandler();
    CardContainerController.attachEnterKeyHandler();
  },

  attachLogOutHandler() {
    const { logOutButtonElem } = CardContainerController;
    logOutButtonElem.addEventListener('click', (event) => {
      loginController.logOut();
    });
  },

  attachEnterKeyHandler() {
    const modalOfAddingContainer = document.querySelector('#adding-container-modal');
    const { confirmButtonElem } = CardContainerController;
    window.addEventListener('keydown', (event) => {
      if (window.event.keyCode === 13 && !modalOfAddingContainer.classList.contains('hidden')) {
        confirmButtonElem.click();
      }

      document.querySelectorAll('.add-card-box').forEach((elem) => {
        if (window.event.keyCode === 13 && !elem.classList.contains('hidden')) {
          elem.querySelector('.confirm-button-add').click();
        }
      });
    });
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

  attachOpenModalForAddingCardHandler() {
    const { buttonToOpenAddingCardElems } = CardContainerController;

    buttonToOpenAddingCardElems.forEach((elem) =>
      elem.addEventListener('click', (event) => {
        const addingModalIdToOpen = `${event.target.id}-modal`;
        cardContainersView.openModalOfAddingCard(addingModalIdToOpen);
      }),
    );
  },

  attachCloseModalForAddingCardHandler() {
    const { buttonToCloseAddingCardElems } = CardContainerController;

    buttonToCloseAddingCardElems.forEach((elem) =>
      elem.addEventListener('click', (event) => {
        const addingModalIdToClose = `${event.target.id.substring(6)}`;

        cardContainersView.closeModalOfAddingCard(addingModalIdToClose);
      }),
    );
  },

  attachOpenEditModeForContainer() {
    const { editModeButtonElems } = CardContainerController;

    editModeButtonElems.forEach((elem) =>
      elem.addEventListener('click', (event) => {
        const idToOpenEditMode = `${event.target.id}-mode`;

        cardContainersView.openEditModeForContainer(idToOpenEditMode);
      }),
    );
  },

  attachConfirmEditModeForContainer() {
    const { confirmButtonForContainerEditElems } = CardContainerController;

    confirmButtonForContainerEditElems.forEach((elem) =>
      elem.addEventListener('click', (event) => {
        const editedName = document.getElementById(`${event.target.id.substring(8)}`).value;
        cardContainerModel.editContainerName(event.target.id.substring(20), editedName);
      }),
    );
  },

  attachConfirmAddingCard() {
    const { confirmButtontoAddCardElems } = CardContainerController;

    confirmButtontoAddCardElems.forEach((elem) =>
      elem.addEventListener('click', (event) => {
        const idOfContainer = event.target.id.substring(9);

        const titleOfNewCard = document.querySelector(`.new-card-header-${idOfContainer}`).value;
        const bodyOfNewCard = document.querySelector(`.new-card-body-${idOfContainer}`).value;

        if (titleOfNewCard === '' && bodyOfNewCard === '') {
          alert('값을 입력하세요.');
          return;
        }
        cardModel.addCard(idOfContainer, titleOfNewCard, bodyOfNewCard);
      }),
    );
  },

  attachEditCardModalHandler() {
    const { CardEditModalButtonElems } = CardContainerController;

    CardEditModalButtonElems.forEach((elem) =>
      elem.addEventListener('click', (event) => {
        const editModalIdToOpen = `edit-modal-${event.target.id.substring(5)}`;
        cardContainersView.openEditModalForCard(editModalIdToOpen);
      }),
    );
  },

  attachEditCardModalHandlerToClose() {
    const { bodyElem } = CardContainerController;
    bodyElem.addEventListener('click', (event) => {
      if (event.target.classList[0] !== 'more-img-card') {
        const editModalOpened = document.querySelectorAll('.edit-modal-box-card');
        editModalOpened.forEach((elem) => cardContainersView.closeEditModalForCard(elem));
      }
    });
  },

  attachDeleteCardHandler() {
    const deleteCardButtonElems = document.querySelectorAll('.delete-card');

    deleteCardButtonElems.forEach((elem) =>
      elem.addEventListener('click', (event) => {
        const adressOfDeleteCard = elem.id.substring(7).split('-');
        const idOfContainerToDelete = adressOfDeleteCard[0];
        const idOfCardToDelete = adressOfDeleteCard[1];
        cardModel.deleteCard(idOfContainerToDelete, idOfCardToDelete);
      }),
    );
  },

  attachDeleteCardForImgHandler() {
    const { buttonToRemoveCardElems } = CardContainerController;
    buttonToRemoveCardElems.forEach((elem) =>
      elem.addEventListener('click', (event) => {
        const adressOfDeleteCard = elem.classList[1].substring(7).split('-');
        const idOfContainerToDelete = adressOfDeleteCard[0];
        const idOfCardToDelete = adressOfDeleteCard[1];

        const parentElemToDelete = document.querySelector(
          `#card-box-body-${idOfContainerToDelete}`,
        );
        const elemToDelete = document.querySelector(
          `#card-total-box-${idOfContainerToDelete}-${idOfCardToDelete}`,
        );

        const indexOfDeleteContainer = cardContainerModel.findContainerIndexById(
          idOfContainerToDelete,
        );
        const indexOfDeleteCard = cardModel.findCardIndexById(
          idOfContainerToDelete,
          idOfCardToDelete,
        );

        cardModel.deleteCardVirtual(idOfContainerToDelete, idOfCardToDelete);
        parentElemToDelete.removeChild(elemToDelete);
      }),
    );
  },

  attachOpenModalToEditCardHandler() {
    const { buttonToOpenEditCardElems } = CardContainerController;

    buttonToOpenEditCardElems.forEach((elem) =>
      elem.addEventListener('click', (event) => {
        const idOfElemToOpen = `edit-box-${event.target.id.substring(5)}`;
        const idOfElemToClose = `card-${event.target.id.substring(5)}`;

        cardContainersView.openEditCard(idOfElemToOpen, idOfElemToClose);
      }),
    );
  },

  attachCloseModalToEditCardHandler() {
    const { buttonToCloseEditCardElems } = CardContainerController;

    buttonToCloseEditCardElems.forEach((elem) =>
      elem.addEventListener('click', (event) => {
        const idOfElemToOpen = `card-${event.target.id.substring(7)}`;
        const idOfElemToClose = `edit-box-${event.target.id.substring(7)}`;

        cardContainersView.closeEditCard(idOfElemToOpen, idOfElemToClose);
      }),
    );
  },

  attachConfirmEditForCard() {
    const { confirmButtonForCardEditElems } = CardContainerController;

    confirmButtonForCardEditElems.forEach((elem) =>
      elem.addEventListener('click', (event) => {
        const adressOfEditCard = elem.id.substring(13).split('-');
        const idOfContainerToEdit = adressOfEditCard[0];
        const idOfCardToEdit = adressOfEditCard[1];

        const titleOfEditCard = document.querySelector(
          `.edit-card-header-${idOfContainerToEdit}-${idOfCardToEdit}`,
        ).value;
        const bodyOfEditCard = document.querySelector(
          `.edit-card-body-${idOfContainerToEdit}-${idOfCardToEdit}`,
        ).value;

        if (titleOfEditCard === '' && bodyOfEditCard === '') {
          alert('값을 입력하세요.');
          return;
        }
        cardModel.editCard(idOfContainerToEdit, idOfCardToEdit, titleOfEditCard, bodyOfEditCard);
      }),
    );
  },

  attachFilterCard() {
    const { filterOfCardElem } = CardContainerController;

    filterOfCardElem.addEventListener('input', () => {
      const fliterCard = setTimeout(() => {
        const valueOfFilter = filterOfCardElem.value;

        cardContainers.forEach((cardContainer) => {
          cardContainer.cards.forEach((card) => {
            if (card.header.includes(valueOfFilter)) {
              if (
                document
                  .querySelector(`#card-total-box-${cardContainer.id}-${card.id}`)
                  .classList.contains('hidden')
              ) {
                document
                  .querySelector(`#card-total-box-${cardContainer.id}-${card.id}`)
                  .classList.remove('hidden');
              }
            } else {
              if (
                !document
                  .querySelector(`#card-total-box-${cardContainer.id}-${card.id}`)
                  .classList.contains('hidden')
              ) {
                document
                  .querySelector(`#card-total-box-${cardContainer.id}-${card.id}`)
                  .classList.add('hidden');
              }
            }
          });
        });
      }, 400);

      filterOfCardElem.addEventListener('input', () => {
        clearTimeout(fliterCard);
      });
    });
  },

  attachOpenMenuModalHandler() {
    const { menuModalElem, menuButtonElem } = CardContainerController;

    menuButtonElem.addEventListener('click', (event) => {
      if (!menuModalElem.classList.contains('hidden')) {
        menuModalElem.classList.add('hidden');
        event.stopPropagation();
        return;
      }
      menuModalElem.classList.remove('hidden');
      event.stopPropagation();
      return;
    });
  },

  attachCloseMenuModalHandler() {
    const { bodyElem, menuModalElem, menuButtonElem } = CardContainerController;

    bodyElem.addEventListener('click', (event) => {
      menuModalElem.classList.add('hidden');
      event.stopPropagation();
    });
  },
};
