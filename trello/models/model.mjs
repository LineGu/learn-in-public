import { Observation } from '../utils/observable.mjs';
import { cardContainers } from './card_data.mjs';
import { currentUser } from './user_data.mjs';
import {
  createCardContainerObject,
  createCardObject,
} from '../create_components/card_component.mjs';

import { dragController } from '../controllers/dragController.mjs';

export const cardContainerModel = {
  findContainerIndexById(idOfContainer) {
    const containerToFind = cardContainers.filter((cardContainer) => {
      if (cardContainer.id === Number(idOfContainer)) return true;
    });
    const indexOfContainer = cardContainers.indexOf(containerToFind[0]);
    return indexOfContainer;
  },

  findContainerIndexByIdVirtual(idOfContainer) {
    const containerToFind = dragController.virtualArr.filter((cardContainer) => {
      if (cardContainer.id === Number(idOfContainer)) return true;
    });
    const indexOfContainer = dragController.virtualArr.indexOf(containerToFind[0]);
    return indexOfContainer;
  },

  addCardContainer(name) {
    currentUser.maxContainerId += 1;
    const newCardContainer = createCardContainerObject(name, currentUser.maxContainerId);
    cardContainers.push(newCardContainer);

    Observation.notify(cardContainers);
  },

  deleteCardContainer(idOfDeleteContainer) {
    const indexOfDeleteContainer = cardContainerModel.findContainerIndexById(idOfDeleteContainer);
    cardContainers.splice(indexOfDeleteContainer, 1);
    Observation.notify(cardContainers);
  },

  editContainerName(idOfEditContainer, editedName) {
    const indexOfEditContainer = cardContainerModel.findContainerIndexById(idOfEditContainer);
    const editContainer = cardContainers[indexOfEditContainer];

    editContainer.name = editedName;
    Observation.notify(cardContainers);
  },

  insertContainer(idOfElemToBeInserted, idOfStandardElem) {
    const indexsOfElemToBeInserted = cardContainerModel.findContainerIndexById(
      idOfElemToBeInserted,
    );

    const ElemToBeInserted = cardContainers[indexsOfElemToBeInserted];

    cardContainers.splice(indexsOfElemToBeInserted, 1);

    const indexOfStandardElem = cardContainerModel.findContainerIndexById(idOfStandardElem);

    cardContainers.splice(indexOfStandardElem + 1, 0, ElemToBeInserted);

    Observation.notify(cardContainers);
  },

  createCardContainerObjectVirtual() {
    const cardContainersElems = document
      .querySelector('.main-container-bottom')
      .querySelectorAll('.card-container');

    const virtualCardContainersArr = [];

    cardContainersElems.forEach((cardConatinerElem) => {
      const containerName = cardConatinerElem.id.split('-')[0];
      const containerId = Number(cardConatinerElem.id.split('-')[1]);

      const containerToAdd = createCardContainerObject(containerName, containerId);

      const cardsOfContainerElems = cardConatinerElem.querySelectorAll('.card-total-box');
      containerToAdd.count = cardsOfContainerElems.length;

      cardsOfContainerElems.forEach((cardsOfContainerElem) => {
        const idOfCard = Number(cardsOfContainerElem.id.split('-')[4]);
        const headOfCard = document.getElementById(`card-header-${idOfCard}`).innerText;
        const bodyOfCard = document.getElementById(`card-body-${idOfCard}`).innerText;
        const footerOfCard = document.getElementById(`card-footer-${idOfCard}`).innerText;

        const cardToAdd = createCardObject(headOfCard, bodyOfCard, footerOfCard, idOfCard);
        containerToAdd.cards.push(cardToAdd);
      });

      virtualCardContainersArr.push(containerToAdd);
    });

    return virtualCardContainersArr;
  },

  getCardContainers() {
    return cardContainers;
  },
};

export const cardModel = {
  findCardIndexById(idOfContainer, idOfCard) {
    const indexOfContainer = cardContainerModel.findContainerIndexById(idOfContainer);
    const cardToFind = cardContainers[indexOfContainer].cards.filter((card) => {
      if (card.id === Number(idOfCard)) return true;
    });
    const indexOfCard = cardContainers[indexOfContainer].cards.indexOf(cardToFind[0]);
    return indexOfCard;
  },

  findCardIndexByIdVirtual(idOfContainer, idOfCard) {
    let indexOfContainer = undefined;
    let indexOfCard = undefined;

    dragController.virtualArr.forEach((container) => {
      container.cards.forEach((card) => {
        if (card.id === Number(idOfCard)) {
          indexOfCard = container.cards.indexOf(card);
          indexOfContainer = dragController.virtualArr.indexOf(container);
        }
      });
    });

    return [indexOfContainer, indexOfCard];
  },

  addCard(idOfContainer, header, body) {
    currentUser.maxCardId += 1;

    const indexOfContainer = cardContainerModel.findContainerIndexById(idOfContainer);
    const newCard = createCardObject(header, body, currentUser.name, currentUser.maxCardId);

    cardContainers[indexOfContainer].count += 1;
    cardContainers[indexOfContainer].cards.unshift(newCard);
    Observation.notify(cardContainers);
  },

  deleteCard(idOfDeleteContainer, idOfDeleteCard) {
    const indexOfDeleteContainer = cardContainerModel.findContainerIndexById(idOfDeleteContainer);
    const indexOfDeleteCard = cardModel.findCardIndexById(idOfDeleteContainer, idOfDeleteCard);
    cardContainers[indexOfDeleteContainer].cards.splice(indexOfDeleteCard, 1);
    cardContainers[indexOfDeleteContainer].count -= 1;
    Observation.notify(cardContainers);
  },

  deleteCardVirtual(idOfDeleteContainer, idOfDeleteCard) {
    const indexOfDeleteContainer = cardContainerModel.findContainerIndexById(idOfDeleteContainer);
    const indexOfDeleteCard = cardModel.findCardIndexById(idOfDeleteContainer, idOfDeleteCard);
    cardContainers[indexOfDeleteContainer].cards.splice(indexOfDeleteCard, 1);
    cardContainers[indexOfDeleteContainer].count -= 1;
  },

  editCard(idOfEditContainer, idOfEditCard, title, body) {
    const indexOfEditContainer = cardContainerModel.findContainerIndexById(idOfEditContainer);
    const indexOfEditCard = cardModel.findCardIndexById(idOfEditContainer, idOfEditCard);
    const editCard = cardContainers[indexOfEditContainer].cards[indexOfEditCard];

    editCard.header = title;
    editCard.body = body;
    Observation.notify(cardContainers);
  },

  insertCard(idsOfElemToBeInserted, idsOfStandardElem) {
    const indexsOfElemToBeInserted = [
      cardContainerModel.findContainerIndexById(idsOfElemToBeInserted[0]),
      cardModel.findCardIndexById(idsOfElemToBeInserted[0], idsOfElemToBeInserted[1]),
    ];

    const ElemToBeInserted =
      cardContainers[indexsOfElemToBeInserted[0]].cards[indexsOfElemToBeInserted[1]];

    cardContainers[indexsOfElemToBeInserted[0]].count -= 1;
    cardContainers[indexsOfElemToBeInserted[0]].cards.splice([indexsOfElemToBeInserted[1]], 1);

    const indexOfStandardElem = [
      cardContainerModel.findContainerIndexById(idsOfStandardElem[0]),
      cardModel.findCardIndexById(idsOfStandardElem[0], idsOfStandardElem[1]),
    ];

    cardContainers[indexOfStandardElem[0]].count += 1;
    cardContainers[indexOfStandardElem[0]].cards.splice(
      indexOfStandardElem[1],
      0,
      ElemToBeInserted,
    );

    Observation.notify(cardContainers);
  },

  insertCardBeforeVirtual(originIndexsOfCard, virtualIndexsOfCard, idsOfCard) {
    const cardForMoving = cardContainers[virtualIndexsOfCard[0]].cards[virtualIndexsOfCard[1]];

    cardContainers[virtualIndexsOfCard[0]].cards.splice(virtualIndexsOfCard[1], 0, cardForMoving);
    cardContainers[virtualIndexsOfCard[0]].count += 1;

    const indexOfDeleteContainer = cardContainerModel.findContainerIndexById(idsOfCard[0]);
    const indexOfDeleteCard = cardModel.findCardIndexById(idsOfCard[0], idsOfCard[1]);
    cardContainers[indexOfDeleteContainer].cards.splice(indexOfDeleteCard, 1);
    cardContainers[indexOfDeleteContainer].count -= 1;
  },

  insertCardAfterVirtual(idsOfElemToBeInserted, idsOfStandardElem) {
    const indexsOfElemToBeInserted = [
      cardContainerModel.findContainerIndexById(idsOfElemToBeInserted[0]),
      cardModel.findCardIndexById(idsOfElemToBeInserted[0], idsOfElemToBeInserted[1]),
    ];

    const ElemToBeInserted =
      cardContainers[indexsOfElemToBeInserted[0]].cards[indexsOfElemToBeInserted[1]];

    cardContainers[indexsOfElemToBeInserted[0]].count -= 1;
    cardContainers[indexsOfElemToBeInserted[0]].cards.splice([indexsOfElemToBeInserted[1]], 1);

    const indexOfStandardElem = [
      cardContainerModel.findContainerIndexById(idsOfStandardElem[0]),
      cardModel.findCardIndexById(idsOfStandardElem[0], idsOfStandardElem[1]),
    ];

    cardContainers[indexOfStandardElem[0]].count += 1;
    cardContainers[indexOfStandardElem[0]].cards.splice(
      indexOfStandardElem[1] + 1,
      0,
      ElemToBeInserted,
    );
  },

  getCards(indexOfContainer) {
    return cardContainers[indexOfContainer].cards;
  },
};
