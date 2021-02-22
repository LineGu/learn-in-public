import { Observation } from '../utils/observable.mjs';
import { cardContainerModel, cardModel } from '../models/model.mjs';
import { cardContainersView } from '../views/view.mjs';
import { cardContainers } from '../models/card_data.mjs';
import { CardContainerController } from './controller.mjs';

export const dragController = {
  init() {
    dragController.draggedData = [];

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
        dragController.draggedData = [];
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
        dragController.draggedData = [];
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
        event.preventDefault();
        event.stopPropagation();
      });
      containerToDragElem.addEventListener('dragenter', (event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
        const cardOfContainer = containerToDragElem.querySelectorAll('.card');

        if (dragController.draggedData[0].split('-')[0] === 'card') {
          const idsOfdragEnteredCard = [
            dragController.draggedData[0].split('-')[3],
            dragController.draggedData[0].split('-')[4],
          ];
          const idOfdropTargetContainer = containerToDragElem.id.split('-')[1];
          cardContainersView.showPreviewForCardToDropContainer(
            idsOfdragEnteredCard,
            idOfdropTargetContainer,
          );
        }
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
        const indexOfContainerOfEnteredCard = cardContainerModel.findContainerIndexById(
          idsOfdragEnteredCard[0],
        );
        const indexOfCardOfEnteredCard = cardModel.findCardIndexById(
          idsOfdragEnteredCard[0],
          idsOfdragEnteredCard[1],
        );

        if (
          dragController.draggedData[0].split('-')[0] === 'card' &&
          dragController.draggedData[2][0] === indexOfContainerOfEnteredCard &&
          dragController.draggedData[2][1] === indexOfCardOfEnteredCard
        ) {
          return;
        }
        if (
          dragController.draggedData[1][0] === dragController.draggedData[2][0] &&
          dragController.draggedData[1][1] === dragController.draggedData[2][1] &&
          dragController.draggedData[2][0] === indexOfContainerOfEnteredCard &&
          dragController.draggedData[2][1] + 1 === indexOfCardOfEnteredCard
        ) {
          return;
        }
        const currrentIndexOfVirtualCard = [
          indexOfContainerOfEnteredCard,
          indexOfCardOfEnteredCard,
        ];
        dragController.draggedData[2] = currrentIndexOfVirtualCard;

        const idOfDraggedConatiner = dragController.draggedData[0].split('-')[3];
        const idOfDraggedCard = dragController.draggedData[0].split('-')[4];
        const idsOfDraggedCard = [idOfDraggedConatiner, idOfDraggedCard];

        const idOfDropTargetContainer = event.currentTarget.id.split('-')[3];
        const idOfDropTargetCard = event.currentTarget.id.split('-')[4];
        const idsOfDDropTargetCard = [idOfDropTargetContainer, idOfDropTargetCard];

        cardContainersView.showPreviewForCardToDropTop(idsOfDraggedCard, idsOfDDropTargetCard);

        document
          .getElementById(`card-total-box-${idsOfDraggedCard[0]}-${idsOfDraggedCard[1]}`)
          .querySelector('.card-helper')
          .classList.add('card-helper-box');
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
        const indexOfContainerOfEnteredCard = cardContainerModel.findContainerIndexById(
          idsOfdragEnteredCard[0],
        );
        const indexOfCardOfEnteredCard = cardModel.findCardIndexById(
          idsOfdragEnteredCard[0],
          idsOfdragEnteredCard[1],
        );
        if (
          dragController.draggedData[0].split('-')[0] === 'card' &&
          dragController.draggedData[2][0] === indexOfContainerOfEnteredCard &&
          dragController.draggedData[2][1] - 1 === indexOfCardOfEnteredCard
        ) {
          return;
        }
        const currrentIndexOfVirtualCard = [
          indexOfContainerOfEnteredCard,
          indexOfCardOfEnteredCard + 1,
        ];
        dragController.draggedData[2] = currrentIndexOfVirtualCard;

        const idOfDraggedConatiner = dragController.draggedData[0].split('-')[3];
        const idOfDraggedCard = dragController.draggedData[0].split('-')[4];
        const idsOfDraggedCard = [idOfDraggedConatiner, idOfDraggedCard];

        const idOfDropTargetContainer = event.currentTarget.id.split('-')[3];
        const idOfDropTargetCard = event.currentTarget.id.split('-')[4];
        const idsOfDDropTargetCard = [idOfDropTargetContainer, idOfDropTargetCard];
        cardContainersView.showPreviewForCardToDropBottom(idsOfDraggedCard, idsOfDDropTargetCard);
        document
          .getElementById(`card-total-box-${idsOfDraggedCard[0]}-${idsOfDraggedCard[1]}`)
          .querySelector('.card-helper')
          .classList.add('card-helper-box');

        event.preventDefault();
      });
      cardToDragBottomElem.addEventListener('drop', (event) => {
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

  attachDropCardHandler() {
    const containerToDragElems = document.querySelectorAll('.card-container');
    const cardToDragElems = document.querySelectorAll('.card');

    const cardToDragTopElems = document.querySelectorAll('.card-helper-top');
    const cardToDragBottomElems = document.querySelectorAll('.card-helper-bottom');
    /*
    containerToDragElems.forEach((containerToDragElem) => {
      containerToDragElem.addEventListener('drop', (event) => {
        event.preventDefault();
        if (event.dataTransfer.getData('text').split('-')[0] === 'container') {
          const idOfDraggedConatiner = event.dataTransfer.getData('text').split('-')[1];
          const idOfdropTargetContainer = event.currentTarget.id.split('-')[1];

          cardContainerModel.insertContainer(idOfDraggedConatiner, idOfdropTargetContainer);
        }

        if (
          event.dataTransfer.getData('text').split('-')[0] === 'card' &&
          cardContainers[
            cardContainerModel.findContainerIndexById(event.currentTarget.id.split('-')[1])
          ].cards.length === 0
        ) {
          const idsOfDraggedElem = event.dataTransfer.getData('text').substring(15).split('-');
          const idOfdropTargetContainer = event.currentTarget.id.split('-')[1];

          const indexsOfElemToBeInserted = [
            cardContainerModel.findContainerIndexById(idsOfDraggedElem[0]),
            cardModel.findCardIndexById(idsOfDraggedElem[0], idsOfDraggedElem[1]),
          ];

          const ElemToAdd =
            cardContainers[indexsOfElemToBeInserted[0]].cards[indexsOfElemToBeInserted[1]];

          cardContainers[indexsOfElemToBeInserted[0]].count -= 1;
          cardContainers[indexsOfElemToBeInserted[0]].cards.splice(
            [indexsOfElemToBeInserted[1]],
            1,
          );

          cardContainers[
            cardContainerModel.findContainerIndexById(idOfdropTargetContainer)
          ].count += 1;

          cardContainers[
            cardContainerModel.findContainerIndexById(idOfdropTargetContainer)
          ].cards.push(ElemToAdd);
          Observation.notify(cardContainers);
        }
        return;
      });
    });*/

    document.body.addEventListener('dragover', (event) => event.preventDefault());
  },
};
