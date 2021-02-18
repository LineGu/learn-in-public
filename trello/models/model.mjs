import { Observation } from '../utils/observable.mjs';
import { cardContainers } from './card_data.mjs';
import { currentUser } from './user_data.mjs';
import {
  createCardContainerObject,
  createCardObject,
} from '../create_components/card_component.mjs';

export const cardContainerModel = {
  findContainerIndexById(idOfContainer) {
    const containerToFind = cardContainers.filter((cardContainer) => {
      if (cardContainer.id === Number(idOfContainer)) return true;
    });
    const indexOfContainer = cardContainers.indexOf(containerToFind[0]);
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

  editCard(idOfEditContainer, idOfEditCard, title, body) {
    const indexOfEditContainer = cardContainerModel.findContainerIndexById(idOfEditContainer);
    const indexOfEditCard = cardModel.findCardIndexById(idOfEditContainer, idOfEditCard);
    const editCard = cardContainers[indexOfEditContainer].cards[indexOfEditCard];

    editCard.header = title;
    editCard.body = body;
    Observation.notify(cardContainers);
  },

  getCards(indexOfContainer) {
    return cardContainers[indexOfContainer].cards;
  },
};
