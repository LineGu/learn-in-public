import { loginController } from './controllers/loginController.mjs';
import { CardContainerController } from './controllers/controller.mjs';
import { cardContainersView } from './views/view.mjs';
import { cardContainers } from './models/card_data.mjs';
import { currentUser } from './models/user_data.mjs';

const initTrelloApp = async () => {
  const newCurrentUser = await loginController.getUserData();
  if (!newCurrentUser) {
    window.location.href = 'login.html';
    alert('로그인이 필요한 서비스입니다.');
    return;
  }
  const containers = await loginController.getContainerData('all');

  await createCardContainerData(containers);

  currentUser.name = newCurrentUser.name;
  currentUser.maxContainerId = newCurrentUser.maxContainerId;
  currentUser.maxCardId = newCurrentUser.maxCardId;

  console.log(currentUser);
  cardContainersView.render(cardContainers);
  CardContainerController.init();
  CardContainerController.initEventHandler();
};

async function createCardContainerData(containers) {
  for (const container of containers) {
    const containerId = container.id;
    const cardsOfContainer = await loginController.getCardData(containerId, 'all');

    container.cards = await cardsOfContainer;
    await cardContainers.push(container);
  }
}

window.addEventListener('DOMContentLoaded', initTrelloApp);
