import { CardContainerController } from './controllers/controller.mjs';
import { cardContainersView } from './views/view.mjs';
import { cardContainers } from './models/card_data.mjs';

const initTrelloApp = () => {
  CardContainerController.init();

  cardContainersView.render(cardContainers);
};

window.addEventListener('DOMContentLoaded', initTrelloApp);
