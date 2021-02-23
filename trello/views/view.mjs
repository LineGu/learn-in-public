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
    document.querySelectorAll('.add-card-box').forEach((elem) => {
      elem.classList.add('hidden');
    });
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

    if (
      draggedContainerElem.previousElementSibling !== null &&
      draggedContainerElem.previousElementSibling.id === dropTargetElem.id
    ) {
      draggedContainerElem.classList.add('virtual');
      return;
    }

    draggedContainerElem.classList.add('trans-right');
    dropTargetElem.classList.add('trans-left');

    setTimeout(() => {
      dropTargetElem.after(draggedContainerElem);
      draggedContainerElem.classList.remove('trans-right');
      dropTargetElem.classList.remove('trans-left');
    }, 155);

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

    if (draggedContainerElem.nextElementSibling.id === dropTargetElem.id) {
      draggedContainerElem.classList.add('virtual');
      return;
    }

    draggedContainerElem.classList.add('trans-left');
    dropTargetElem.classList.add('trans-right');

    setTimeout(() => {
      dropTargetElem.before(draggedContainerElem);
      draggedContainerElem.classList.remove('trans-left');
      dropTargetElem.classList.remove('trans-right');
    }, 155);

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

    const virtualContainerIndex = dragController.draggedData[2][0];
    const targetConainerIndex = cardContainerModel.findContainerIndexByIdVirtual(
      idsOfDropTarget[0],
    );
    const virtualCardIndex = dragController.draggedData[2][1];
    const targetCardIndex = cardModel.findCardIndexByIdVirtual(
      idsOfDropTarget[0],
      idsOfDropTarget[1],
    );

    if (virtualContainerIndex !== targetConainerIndex) {
      dropTargetCardElem.classList.add('trans-down');

      let siblingElem = dropTargetCardElem.nextElementSibling;

      while (siblingElem != null) {
        siblingElem.classList.add('trans-down');
        siblingElem = siblingElem.nextElementSibling;
      }

      setTimeout(() => {
        dropTargetCardElem.before(draggedCardElem);
        dragController.draggedData[2] = targetCardIndex;
        dropTargetCardElem.classList.remove('trans-down');
        let siblingElem = dropTargetCardElem.nextElementSibling;

        while (siblingElem != null) {
          siblingElem.classList.remove('trans-down');
          siblingElem = siblingElem.nextElementSibling;
        }
      }, 155);
      draggedCardElem.querySelector('.card-helper').classList.remove('card-helper-box');

      draggedCardElem.querySelector('.card').classList.add('virtual');
      return;
    }

    const indexOfVirtualCardToGo =
      virtualCardIndex < targetCardIndex[1] ? targetCardIndex[1] - 1 : targetCardIndex[1];

    if (virtualCardIndex - 1 === indexOfVirtualCardToGo) {
      dropTargetCardElem.classList.add('trans-down');
      if (draggedCardElem.previousElementSibling !== null) {
        draggedCardElem.classList.add('trans-up');
      }
      setTimeout(() => {
        dropTargetCardElem.before(draggedCardElem);
        dragController.draggedData[2] = [targetConainerIndex, indexOfVirtualCardToGo];

        dropTargetCardElem.classList.remove('trans-down');
        draggedCardElem.classList.remove('trans-up');
      }, 155);
      draggedCardElem.querySelector('.card-helper').classList.remove('card-helper-box');

      draggedCardElem.querySelector('.card').classList.add('virtual');
      return;
    }

    if (virtualCardIndex < indexOfVirtualCardToGo) {
      let previousSibling = dropTargetCardElem.previousElementSibling;

      while (previousSibling != null) {
        if (previousSibling.previousElementSibling !== null) {
          previousSibling.classList.add('trans-up');
        }

        previousSibling = previousSibling.previousElementSibling;
      }
      draggedCardElem.classList.remove('trans-up');
      draggedCardElem.classList.add('trans-down');
      setTimeout(() => {
        dropTargetCardElem.before(draggedCardElem);
        dragController.draggedData[2] = [targetConainerIndex, indexOfVirtualCardToGo];

        dragController.draggedData[2][1] = indexOfVirtualCardToGo;
        draggedCardElem.classList.remove('trans-down');
        let previousSibling = dropTargetCardElem.previousElementSibling;

        while (previousSibling != null) {
          previousSibling.classList.remove('trans-up');
          previousSibling = previousSibling.previousElementSibling;
        }
      }, 155);
      draggedCardElem.querySelector('.card-helper').classList.remove('card-helper-box');

      draggedCardElem.querySelector('.card').classList.add('virtual');
      return;
    }

    if (virtualCardIndex < targetCardIndex[1]) {
      let previousSibling = dropTargetCardElem.previousElementSibling;

      while (previousSibling != null) {
        if (previousSibling.previousElementSibling !== null) {
          previousSibling.classList.add('trans-up');
        }
        previousSibling = previousSibling.previousElementSibling;
      }
      draggedCardElem.remove('trans-up');
      draggedCardElem.classList.add('trans-down');
      setTimeout(() => {
        dropTargetCardElem.before(draggedCardElem);
        dragController.draggedData[2] = [targetConainerIndex, indexOfVirtualCardToGo];

        draggedCardElem.classList.remove('trans-down');
        let previousSibling = dropTargetCardElem.previousElementSibling;

        while (previousSibling != null) {
          previousSibling.classList.remove('trans-up');
          previousSibling = previousSibling.previousElementSibling;
        }
      }, 155);
      draggedCardElem.querySelector('.card-helper').classList.remove('card-helper-box');

      draggedCardElem.querySelector('.card').classList.add('virtual');
      return;
    }

    dropTargetCardElem.classList.add('trans-down');
    let siblingElem = dropTargetCardElem.nextElementSibling;

    while (siblingElem != null) {
      siblingElem.classList.add('trans-down');
      siblingElem = siblingElem.nextElementSibling;
    }
    draggedCardElem.classList.remove('trans-down');

    setTimeout(() => {
      dropTargetCardElem.before(draggedCardElem);

      dropTargetCardElem.classList.remove('trans-down');
      let siblingElem = dropTargetCardElem.nextElementSibling;

      while (siblingElem != null) {
        siblingElem.classList.remove('trans-down');
        siblingElem = siblingElem.nextElementSibling;
      }
    }, 155);
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

    const virtualContainerIndex = dragController.draggedData[2][0];
    const targetConainerIndex = cardContainerModel.findContainerIndexByIdVirtual(
      idsOfDropTarget[0],
    );

    if (virtualContainerIndex !== targetConainerIndex) {
      let siblingElem = dropTargetCardElem.nextElementSibling;

      while (siblingElem != null) {
        siblingElem.classList.add('trans-down');
        siblingElem = siblingElem.nextElementSibling;
      }

      setTimeout(() => {
        dropTargetCardElem.after(draggedCardElem);

        let siblingElem = dropTargetCardElem.nextElementSibling;

        while (siblingElem != null) {
          siblingElem.classList.remove('trans-down');
          siblingElem = siblingElem.nextElementSibling;
        }
      }, 155);
      draggedCardElem.querySelector('.card-helper').classList.remove('card-helper-box');

      draggedCardElem.querySelector('.card').classList.add('virtual');
      return;
    }
    const virtualCardIndex = dragController.draggedData[2][1];
    const targetCardIndex = cardModel.findCardIndexByIdVirtual(
      idsOfDropTarget[0],
      idsOfDropTarget[1],
    );

    const indexOfVirtualCardToGo =
      virtualCardIndex > targetCardIndex[1] ? targetCardIndex[1] + 1 : targetCardIndex[1];

    if (virtualCardIndex + 1 === targetCardIndex[1]) {
      if (dropTargetCardElem.previousElementSibling !== null) {
        dropTargetCardElem.classList.add('trans-up');
      }

      draggedCardElem.classList.add('trans-down');
      setTimeout(() => {
        dropTargetCardElem.after(draggedCardElem);

        dropTargetCardElem.classList.remove('trans-up');
        draggedCardElem.classList.remove('trans-down');
      }, 155);
      draggedCardElem.querySelector('.card-helper').classList.remove('card-helper-box');

      draggedCardElem.querySelector('.card').classList.add('virtual');
      return;
    }

    if (indexOfVirtualCardToGo > virtualCardIndex) {
      draggedCardElem.classList.add('trans-down');
      let siblingElem = draggedCardElem.nextElementSibling;
      let cnt = indexOfVirtualCardToGo - virtualCardIndex - 1;
      while (cnt > 0 && siblingElem !== null) {
        if (siblingElem.previousElementSibling !== null) {
          siblingElem.classList.add('trans-up');
        }

        siblingElem = siblingElem.nextElementSibling;
        cnt -= 1;
      }
      draggedCardElem.classList.remove('trans-up');

      setTimeout(() => {
        dropTargetCardElem.after(draggedCardElem);
        dragController.draggedData[2][1] = [indexOfVirtualCardToGo];

        draggedCardElem.classList.remove('trans-down');

        let previousSibling = draggedCardElem.previousElementSibling;

        while (previousSibling !== null) {
          previousSibling.classList.remove('trans-up');
          previousSibling = previousSibling.previousElementSibling;
        }
      }, 155);
      draggedCardElem.querySelector('.card-helper').classList.remove('card-helper-box');

      draggedCardElem.querySelector('.card').classList.add('virtual');
      return;
    }
    document.querySelectorAll('.trans-up').forEach((elem) => {
      elem.classList.remove('.trans-up');
    });
  },

  resetValue(elem) {
    elem.value = '';
  },
};
