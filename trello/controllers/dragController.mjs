import { Observation } from '../utils/observable.mjs';
import { cardContainerModel, cardModel } from '../models/model.mjs';
import { cardContainersView } from '../views/view.mjs';
import { cardContainers } from '../models/card_data.mjs';
import { CardContainerController } from './controller.mjs';

export const dragController = {
  init() {
    dragController.attachHandleDrangPropertyOfContainer();
    dragController.attachHandleDrangPropertyOfCard();
    dragController.attachDragStartHandler();
    dragController.attachDragOverHandler();
    dragController.attachDropCardHandler();
  },

  attachHandleDrangPropertyOfContainer() {
    const containerToDragElems = document.querySelectorAll('.card-container');

    containerToDragElems.forEach((containerToDragElem) => {
      containerToDragElem.addEventListener('mousedown', (event) => {
        containerToDragElem.draggable = true;
      });
    });

    containerToDragElems.forEach((containerToDragElem) => {
      containerToDragElem.addEventListener('mouseup', (event) => {
        containerToDragElem.draggable = false;
      });
    });

    containerToDragElems.forEach((containerToDragElem) => {
      containerToDragElem.addEventListener('dragstart', (event) => {
        containerToDragElem.draggable = true;
        containerToDragElem.classList.add('active');
      });
    });

    containerToDragElems.forEach((containerToDragElem) => {
      containerToDragElem.addEventListener('dragend', (event) => {
        containerToDragElem.draggable = false;
        containerToDragElem.classList.remove('active');
      });
    });
  },

  attachHandleDrangPropertyOfCard() {
    const cardToDragElems = document.querySelectorAll('.card-total-box');

    cardToDragElems.forEach((cardToDragElem) => {
      cardToDragElem.addEventListener('dragstart', (event) => {
        cardToDragElem.classList.add('active');
        event.stopPropagation();
      });
    });

    cardToDragElems.forEach((cardToDragElem) => {
      cardToDragElem.addEventListener('dragend', (event) => {
        cardToDragElem.classList.remove('active');
      });
    });
  },

  attachDragStartHandler() {
    const containerToDragElems = document.querySelectorAll('.card-container');
    const cardToDragElems = document.querySelectorAll('.card-total-box');

    containerToDragElems.forEach((containerToDragElem) => {
      containerToDragElem.addEventListener('dragstart', (event) => {
        event.dataTransfer.setData('text', event.target.id);
        event.dataTransfer.dropEffect = 'move';
      });
    });

    cardToDragElems.forEach((cardToDragElem) => {
      cardToDragElem.addEventListener('dragstart', (event) => {
        event.dataTransfer.setData('text', event.target.id);
        event.dataTransfer.dropEffect = 'move';
      });
    });
  },
  attachDragOverHandler() {
    const containerToDragElems = document.querySelectorAll('.card-container');
    const cardToDragElems = document.querySelectorAll('.card-total-box');

    containerToDragElems.forEach((containerToDragElem) => {
      containerToDragElem.addEventListener('dragover', (event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
      });
    });

    cardToDragElems.forEach((cardToDragElem) => {
      cardToDragElem.addEventListener('dragover', (event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
      });
    });
  },

  attachDropCardHandler() {
    const containerToDragElems = document.querySelectorAll('.card-container');
    const cardToDragElems = document.querySelectorAll('.card-total-box');

    containerToDragElems.forEach((containerToDragElem) => {
      containerToDragElem.addEventListener('drop', (event) => {
        event.preventDefault();
        const idOfDraggedElem = event.dataTransfer.getData('text');
        const elementToBeMoved = document.querySelector(`#${idOfDraggedElem}`);
        console.log(containerToDragElem);
        console.log(elementToBeMoved);
      });
    });

    cardToDragElems.forEach((cardToDragElem) => {
      cardToDragElem.addEventListener('drop', (event) => {
        event.preventDefault();
        const idOfDraggedElem = event.dataTransfer.getData('text');
        const elementToBeMoved = document.querySelector(`#${idOfDraggedElem}`);
        console.log(cardToDragElem);
        console.log(elementToBeMoved);
      });
    });
  },
};
