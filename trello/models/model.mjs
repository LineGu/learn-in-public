import { Observation } from '../utils/observable.mjs';
import { cardContainers } from './card_data.mjs';
import { currentUser } from './user_data.mjs';
import {
  createCardContainerObject,
  createCardObject,
} from '../create_components/card_component.mjs';

export const cardContainerModel = {
  addCardContainer(name) {
    const newContainerId = cardContainers.length;
    const newCardContainer = createCardContainerObject(name, newContainerId);
    cardContainers.push(newCardContainer);
    Observation.notify(cardContainers);
  },

  deleteCardContainer(idOfDeleteContainer) {
    const containerToDelete = cardContainers.filter((cardContainer) => {
      if (cardContainer.id === Number(idOfDeleteContainer)) return true;
    });
    const indexOfDeleteContainer = cardContainers.indexOf(containerToDelete[0]);
    cardContainers.splice(indexOfDeleteContainer, 1);
    Observation.notify(cardContainers);
  },

  getCardContainers() {
    return cardContainers;
  },
};

export const cardModel = {
  addCard(indexOfContainer, header, body) {
    const cardContainerOfNewCard = cardContainers[indexOfContainer];
    const newCard = createCardObject(header, body, currentUser.name);
    cardContainerOfNewCard.cards.push(newCard);
    Observation.notify(cardContainers);
  },

  deleteCard(indexOfContainer, indexOfDeleteCard) {
    const cardContainerOfDeleteCard = cardContainers[indexOfContainer];

    cardContainerOfDeleteCard.cards.splice(indexOfDeleteCard, 1);
    Observation.notify(cardContainers);
  },

  getCards(indexOfContainer) {
    return cardContainers[indexOfContainer].cards;
  },
};
