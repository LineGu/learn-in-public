import { CardContainerController } from './controllers/controller.mjs';
import { cardContainersView } from './views/view.mjs';
import { cardContainers } from './models/card_data.mjs';

const initTrelloApp = () => {
  cardContainersView.render(cardContainers);
  CardContainerController.init();
  CardContainerController.initEventHandler();
};

window.addEventListener('DOMContentLoaded', initTrelloApp);
