import { Observation } from '../utils/observable.mjs';
import { cardContainerModel, cardModel } from '../models/model.mjs';
import { cardContainersView } from '../views/view.mjs';
import { cardContainers } from '../models/card_data.mjs';
import { CardContainerController } from './controller.mjs';

export const dragController = {
  init() {
    dragController.draggedData = [];
    dragController.virtualArr = cardContainerModel.createCardContainerObjectVirtual();

    dragController.attachHandleDragPropertyOfContainer();
    dragController.attachHandleDrangPropertyOfCard();
    dragController.attachDragOverHandler();
    dragController.attachDropCardHandler();
    dragController.attachDragEnterForContainerHandler();
  },

  attachHandleDragPropertyOfContainer() {
    const containerToDragElems = document.querySelectorAll('.card-container');
    containerToDragElems.forEach((containerToDragElem) => {
      containerToDragElem.addEventListener('mousedown', (event) => {
        const boxOfAddingCardElem = containerToDragElem.querySelector('.input-card');
        const boxOfEditingCardElems = containerToDragElem.querySelectorAll('.edit-card-box');
        const boxOfEditingContainerElem = containerToDragElem.querySelector(
          '.container-name-modify',
        );

        let isValidDrag = true;

        if (!boxOfEditingContainerElem.classList.contains('hidden')) {
          isValidDrag = false;
        }

        boxOfEditingCardElems.forEach((elem) => {
          if (!elem.classList.contains('hidden')) {
            isValidDrag = false;
          }
        });

        if (!isValidDrag) {
          return;
        }

        if (!boxOfAddingCardElem.parentElement.classList.contains('hidden')) {
          event.stopPropagation();
          return;
        }
        containerToDragElem.draggable = true;
        event.stopPropagation();
      });
    });

    containerToDragElems.forEach((containerToDragElem) => {
      containerToDragElem.addEventListener('mouseup', (event) => {
        containerToDragElem.draggable = false;
        event.stopPropagation();
      });
    });

    containerToDragElems.forEach((containerToDragElem) => {
      containerToDragElem.addEventListener('dragstart', (event) => {
        dragController.draggedData = [];
        document.querySelectorAll('.container-helper').forEach((elem) => {
          elem.classList.add('container-helper-box');
        });

        containerToDragElem
          .querySelector('.container-helper')
          .classList.remove('container-helper-box');

        containerToDragElem.classList.add('activer');

        containerToDragElem.draggable = true;

        const idsOfDraggedContainer = containerToDragElem.id.split('-');
        const indexOfContainerOfDraggedCard = cardContainerModel.findContainerIndexById(
          idsOfDraggedContainer[1],
        );
        event.dataTransfer.setData('text', `container-${idsOfDraggedContainer[1]}`);

        dragController.draggedData.push(`container-${idsOfDraggedContainer[1]}`);
        dragController.draggedData.push(indexOfContainerOfDraggedCard);
        dragController.draggedData.push(indexOfContainerOfDraggedCard);

        event.dataTransfer.dropEffect = 'move';
        event.stopPropagation();
      });
    });

    containerToDragElems.forEach((containerToDragElem) => {
      containerToDragElem.addEventListener('dragend', (event) => {
        containerToDragElem.classList.remove('activer');
        containerToDragElem.classList.remove('virtual');

        document.querySelectorAll('.virtual').forEach((elem) => {
          elem.classList.remove('virtual');
        });
        document.querySelectorAll('.activer').forEach((elem) => {
          elem.classList.remove('activer');
        });
        event.stopPropagation();

        document
          .querySelectorAll('.container-helper')
          .forEach((elem) => elem.classList.remove('.container-helper-box'));

        Observation.notify(cardContainers);
        containerToDragElem.draggable = false;
      });
    });

    containerToDragElems.forEach((containerToDragElem) => {
      containerToDragElem.addEventListener('drag', (event) => {
        /*containerToDragElem.classList.remove('activer');
        containerToDragElem.classList.add('virtual');*/
        event.stopPropagation();
      });
    });
  },

  attachHandleDrangPropertyOfCard() {
    const cardToDragElems = document.querySelectorAll('.card');

    cardToDragElems.forEach((cardToDragElem) => {
      cardToDragElem.addEventListener('mouseover', (event) => {
        if (dragController.draggedData.length === 0) {
          cardToDragElem.classList.add('hover');
          event.stopPropagation();
        }
      });
    });

    cardToDragElems.forEach((cardToDragElem) => {
      cardToDragElem.addEventListener('mouseout', (event) => {
        cardToDragElem.classList.remove('hover');
        event.stopPropagation();
      });
    });

    cardToDragElems.forEach((cardToDragElem) => {
      cardToDragElem.addEventListener('mousedown', (event) => {
        cardToDragElem.draggable = true;
        event.stopPropagation();
      });
    });

    cardToDragElems.forEach((cardToDragElem) => {
      cardToDragElem.addEventListener('mouseup', (event) => {
        cardToDragElem.draggable = false;
        event.stopPropagation();
      });
    });

    cardToDragElems.forEach((cardToDragElem) => {
      cardToDragElem.addEventListener('dragstart', (event) => {
        document.querySelectorAll('.card-helper').forEach((elem) => {
          elem.classList.add('card-helper-box');
        });

        dragController.draggedData = [];
        cardToDragElem.parentElement
          .querySelector('.card-helper')
          .classList.remove('card-helper-box');

        cardToDragElem.classList.remove('hover');
        cardToDragElem.classList.add('activer');

        const idsOfDraggedCard = cardToDragElem.id.split('-');
        const indexOfContainerOfDraggedCard = cardContainerModel.findContainerIndexById(
          idsOfDraggedCard[1],
        );
        const indexsOfDraggedCard = [
          indexOfContainerOfDraggedCard,
          cardModel.findCardIndexById(idsOfDraggedCard[1], idsOfDraggedCard[2]),
        ];

        event.dataTransfer.setData(
          'text',
          `card-total-box-${idsOfDraggedCard[1]}-${idsOfDraggedCard[2]}`,
        );

        dragController.draggedData.push(
          `card-total-box-${idsOfDraggedCard[1]}-${idsOfDraggedCard[2]}`,
        );
        dragController.draggedData.push(indexsOfDraggedCard);
        dragController.draggedData.push(indexsOfDraggedCard);

        event.stopPropagation();
      });
    });

    cardToDragElems.forEach((cardToDragElem) => {
      cardToDragElem.addEventListener('dragend', (event) => {
        cardToDragElem.classList.remove('activer');
        cardToDragElem.classList.remove('virtual');

        document.querySelectorAll('.virtual').forEach((elem) => {
          elem.classList.remove('virtual');
        });
        document.querySelectorAll('.activer').forEach((elem) => {
          elem.classList.remove('activer');
        });
        event.stopPropagation();

        document
          .querySelectorAll('.card-helper')
          .forEach((elem) => elem.classList.remove('.card-helper-box'));

        Observation.notify(cardContainers);
        cardToDragElem.draggable = false;
      });
    });

    cardToDragElems.forEach((cardToDragElem) => {
      cardToDragElem.addEventListener('drag', (event) => {
        cardToDragElem.classList.remove('activer');
        cardToDragElem.classList.add('virtual');
        event.stopPropagation();
      });
    });
  },

  attachDragEnterForContainerHandler() {
    const containerToDragRightElems = document.querySelectorAll('.container-helper-right');
    const containerToDragLeftElems = document.querySelectorAll('.container-helper-left');

    containerToDragRightElems.forEach((containerToDragRightElem) => {
      containerToDragRightElem.addEventListener('dragenter', (event) => {
        event.dataTransfer.dropEffect = 'move';
        event.preventDefault();

        const idOfdragEnteredContainer = containerToDragRightElem.id.split('-')[3];
        const indexOfContainerDragEntered = cardContainerModel.findContainerIndexById(
          idOfdragEnteredContainer,
        );

        const currrentIndexOfVirtualContainer = indexOfContainerDragEntered;
        dragController.draggedData[2] = currrentIndexOfVirtualContainer;

        const idOfDraggedContainer = dragController.draggedData[0].split('-')[1];

        const idOfDropTargetContainer = event.currentTarget.id.split('-')[3];

        cardContainersView.showPreviewForContainerToDropRight(
          idOfDraggedContainer,
          idOfDropTargetContainer,
        );

        event.preventDefault();
      });
      containerToDragRightElem.addEventListener('drop', (event) => {
        const virtualCardContainers = cardContainerModel.createCardContainerObjectVirtual();
        cardContainers.splice(0, cardContainers.length);

        virtualCardContainers.forEach((virtualCardContainer) => {
          cardContainers.push(virtualCardContainer);
        });

        event.preventDefault();
        event.stopPropagation();
      });
    });

    containerToDragLeftElems.forEach((containerToDragLeftElem) => {
      containerToDragLeftElem.addEventListener('dragenter', (event) => {
        event.dataTransfer.dropEffect = 'move';
        event.preventDefault();

        const idOfdragEnteredContainer = containerToDragLeftElem.id.split('-')[3];
        const indexOfContainerDragEntered = cardContainerModel.findContainerIndexById(
          idOfdragEnteredContainer,
        );

        const currrentIndexOfVirtualContainer = indexOfContainerDragEntered - 1;
        dragController.draggedData[2] = currrentIndexOfVirtualContainer;

        const idOfDraggedContainer = dragController.draggedData[0].split('-')[1];

        const idOfDropTargetContainer = event.currentTarget.id.split('-')[3];

        cardContainersView.showPreviewForContainerToDropLeft(
          idOfDraggedContainer,
          idOfDropTargetContainer,
        );

        event.preventDefault();
      });
      containerToDragLeftElem.addEventListener('drop', (event) => {
        const virtualCardContainers = cardContainerModel.createCardContainerObjectVirtual();
        cardContainers.splice(0, cardContainers.length);

        virtualCardContainers.forEach((virtualCardContainer) => {
          cardContainers.push(virtualCardContainer);
        });

        event.preventDefault();
        event.stopPropagation();
      });
    });
  },

  attachDragOverHandler() {
    const cardToDragTopElems = document.querySelectorAll('.card-helper-top');
    const cardToDragBottomElems = document.querySelectorAll('.card-helper-bottom');
    const containerToDragElems = document.querySelectorAll('.card-container');

    containerToDragElems.forEach((containerToDragElem) => {
      containerToDragElem.querySelector('.card-box').addEventListener('dragenter', (event) => {
        event.stopPropagation();
      });
      containerToDragElem
        .querySelector('.card-box-header')
        .addEventListener('dragenter', (event) => {
          event.stopPropagation();
        });

      containerToDragElem.addEventListener('dragenter', (event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
        const cardOfContainer = containerToDragElem.querySelectorAll('.card');
        const idOfTargetContainer = containerToDragElem.id.split('-')[1];
        const indexOfTargetContainer = cardContainerModel.findContainerIndexByIdVirtual(
          idOfTargetContainer,
        );

        const idOfDraggedContainer = dragController.draggedData[0].split('-')[3];
        const idOfDraggedCard = dragController.draggedData[0].split('-')[4];

        if (dragController.draggedData[0] === null || dragController.draggedData[0] === undefined) {
          Observation.notify(cardContainers);
          event.stopPropagation();
          return;
        }
        if (dragController.draggedData[0].split('-')[0] === 'card') {
          const idsOfdragEnteredCard = [
            dragController.draggedData[0].split('-')[3],
            dragController.draggedData[0].split('-')[4],
          ];

          const idOfdropTargetContainer = containerToDragElem.id.split('-')[1];
          const timerone = setTimeout(() => {
            cardContainersView.showPreviewForCardToDropContainer(
              idsOfdragEnteredCard,
              idOfdropTargetContainer,
            );
          }, 10);

          const timer = setTimeout(() => {
            dragController.virtualArr = cardContainerModel.createCardContainerObjectVirtual();

            const currentCardIndex = cardModel.findCardIndexByIdVirtual(
              idOfDraggedContainer,
              idOfDraggedCard,
            );

            dragController.draggedData[2] = currentCardIndex;

            event.stopPropagation();
            event.preventDefault();
          }, 10);

          containerToDragElem.addEventListener('dragleave', (event) => {
            clearTimeout(timerone);
            clearTimeout(timer);
          });
          dragController.virtualArr = cardContainerModel.createCardContainerObjectVirtual();

          const currentCardIndex = cardModel.findCardIndexByIdVirtual(
            idOfDraggedContainer,
            idOfDraggedCard,
          );

          dragController.draggedData[2] = currentCardIndex;
        }
        event.stopPropagation();
      });
      containerToDragElem.addEventListener('drop', (event) => {
        const virtualCardContainers = cardContainerModel.createCardContainerObjectVirtual();
        cardContainers.splice(0, cardContainers.length);

        virtualCardContainers.forEach((virtualCardContainer) => {
          cardContainers.push(virtualCardContainer);
        });

        event.preventDefault();
        event.stopPropagation();
      });
    });

    cardToDragTopElems.forEach((cardToDragTopElem) => {
      cardToDragTopElem.addEventListener('dragenter', (event) => {
        event.dataTransfer.dropEffect = 'move';
        event.preventDefault();
        const idsOfdragEnteredCard = [
          cardToDragTopElem.id.split('-')[3],
          cardToDragTopElem.id.split('-')[4],
        ];
        const indexOfContainerOfEnteredCard = cardContainerModel.findContainerIndexByIdVirtual(
          idsOfdragEnteredCard[0],
        );
        const indexOfCardOfEnteredCard = cardModel.findCardIndexByIdVirtual(
          idsOfdragEnteredCard[0],
          idsOfdragEnteredCard[1],
        );
        if (dragController.draggedData[0] === null || dragController.draggedData[0] === undefined) {
          Observation.notify(cardContainers);
          event.stopPropagation();
          return;
        }

        if (
          dragController.draggedData[0].split('-')[0] === 'card' &&
          dragController.draggedData[2][0] === indexOfCardOfEnteredCard[0] &&
          dragController.draggedData[2][1] + 1 === indexOfCardOfEnteredCard[1]
        ) {
          return;
        }

        const idOfDraggedConatiner = dragController.draggedData[0].split('-')[3];
        const idOfDraggedCard = dragController.draggedData[0].split('-')[4];
        const idsOfDraggedCard = [idOfDraggedConatiner, idOfDraggedCard];

        const idOfDropTargetContainer = event.currentTarget.id.split('-')[3];
        const idOfDropTargetCard = event.currentTarget.id.split('-')[4];
        const idsOfDDropTargetCard = [idOfDropTargetContainer, idOfDropTargetCard];

        const draggedCardElem = document.getElementById(
          `card-total-box-${idsOfDraggedCard[0]}-${idsOfDraggedCard[1]}`,
        );
        const dropTargetCardElem = document.getElementById(
          `card-total-box-${idsOfDDropTargetCard[0]}-${idsOfDDropTargetCard[1]}`,
        );
        if (draggedCardElem === null) {
          return;
        }
        if (
          draggedCardElem.nextElementSibling !== null &&
          draggedCardElem.nextElementSibling.id === dropTargetCardElem.id
        ) {
          return;
        }

        cardContainersView.showPreviewForCardToDropTop(idsOfDraggedCard, idsOfDDropTargetCard);

        setTimeout(() => {
          dragController.virtualArr = cardContainerModel.createCardContainerObjectVirtual();

          const currrentIndexOfVirtualCard = cardModel.findCardIndexByIdVirtual(
            idOfDraggedConatiner,
            idOfDraggedCard,
          );

          dragController.draggedData[2] = currrentIndexOfVirtualCard;

          event.preventDefault();
        }, 160);
        event.stopPropagation();
        event.preventDefault();
      });

      cardToDragTopElem.addEventListener('drop', (event) => {
        const virtualCardContainers = cardContainerModel.createCardContainerObjectVirtual();
        cardContainers.splice(0, cardContainers.length);

        virtualCardContainers.forEach((virtualCardContainer) => {
          cardContainers.push(virtualCardContainer);
        });

        event.preventDefault();
        event.stopPropagation();
      });
    });

    cardToDragBottomElems.forEach((cardToDragBottomElem) => {
      cardToDragBottomElem.addEventListener('dragenter', (event) => {
        event.dataTransfer.dropEffect = 'move';
        event.preventDefault();
        const idsOfdragEnteredCard = [
          cardToDragBottomElem.id.split('-')[3],
          cardToDragBottomElem.id.split('-')[4],
        ];
        const indexOfContainerOfEnteredCard = cardContainerModel.findContainerIndexByIdVirtual(
          idsOfdragEnteredCard[0],
        );
        const indexOfCardOfEnteredCard = cardModel.findCardIndexByIdVirtual(
          idsOfdragEnteredCard[0],
          idsOfdragEnteredCard[1],
        );
        if (dragController.draggedData[0] === null || dragController.draggedData[0] === undefined) {
          Observation.notify(cardContainers);
          event.stopPropagation();
          return;
        }
        if (
          dragController.draggedData[0].split('-')[0] === 'card' &&
          dragController.draggedData[2][0] === indexOfCardOfEnteredCard[0] &&
          dragController.draggedData[2][1] - 1 === indexOfCardOfEnteredCard[1]
        ) {
          return;
        }

        const idOfDraggedConatiner = dragController.draggedData[0].split('-')[3];
        const idOfDraggedCard = dragController.draggedData[0].split('-')[4];
        const idsOfDraggedCard = [idOfDraggedConatiner, idOfDraggedCard];

        const idOfDropTargetContainer = event.currentTarget.id.split('-')[3];
        const idOfDropTargetCard = event.currentTarget.id.split('-')[4];
        const idsOfDDropTargetCard = [idOfDropTargetContainer, idOfDropTargetCard];

        cardContainersView.showPreviewForCardToDropBottom(idsOfDraggedCard, idsOfDDropTargetCard);

        setTimeout(() => {
          dragController.virtualArr = cardContainerModel.createCardContainerObjectVirtual();

          dragController.virtualArr = cardContainerModel.createCardContainerObjectVirtual();

          const currrentIndexOfVirtualCard = cardModel.findCardIndexByIdVirtual(
            idOfDraggedConatiner,
            idOfDraggedCard,
          );

          dragController.draggedData[2] = currrentIndexOfVirtualCard;

          event.preventDefault();
        }, 160);

        event.preventDefault();
        event.stopPropagation();
      });
      cardToDragBottomElem.addEventListener('drop', (event) => {
        const virtualCardContainers = cardContainerModel.createCardContainerObjectVirtual();

        cardContainers.splice(0, cardContainers.length);

        virtualCardContainers.forEach((virtualCardContainer) => {
          cardContainers.push(virtualCardContainer);
        });
      });
    });
  },

  attachDropCardHandler() {
    const containerToDragElems = document.querySelectorAll('.card-container');
    const cardToDragElems = document.querySelectorAll('.card');

    const cardToDragTopElems = document.querySelectorAll('.card-helper-top');
    const cardToDragBottomElems = document.querySelectorAll('.card-helper-bottom');

    document.body.addEventListener('dragover', (event) => event.preventDefault());
  },
};
