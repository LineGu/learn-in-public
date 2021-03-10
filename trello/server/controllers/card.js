const dataBase = require('../initialize/dataBase.js');
const serverMassage = require('../massage/serverMassage.js');
const StatusCode = require('../massage/StatusCode.js');
const errorHandler = require('../utils/errorHandler');

const { createMsg } = serverMassage;
const { pool } = dataBase.connectDataBase();

const cardController = {
  async getCardData(request, response) {
    try {
      const userId = request.session.userId;
      const containerIdToFind = request.params.containerId;
      const cardIdToFind = request.params.cardId;

      const queryToGetCard =
        cardIdToFind === 'all'
          ? `SELECT card.cardId AS id,card.header,card.body,card.footer 
          FROM card  JOIN container WHERE container.containerId = ${containerIdToFind} AND 
          container.id = card.containerId AND container.userId = ${userId} ORDER BY card.cardIndex;`
          : `SELECT card.cardId AS id,card.header,card.body,card.footer 
          FROM card  JOIN container WHERE container.containerId = ${containerIdToFind} AND 
          container.id = card.containerId AND container.userId = ${userId} AND card.cardId = ${cardIdToFind} ORDER BY card.cardIndex;`;
      const resultOfCard = await pool.query(queryToGetCard);
      const cardsData = resultOfCard[0];
      const cardsDataForJson = JSON.stringify(cardsData);
      response.status(StatusCode.OK).json(cardsDataForJson);
    } catch (err) {
      errorHandler(err, response, 'ERROR');
    }
  },

  async deleteCardData(request, response) {
    try {
      const userId = request.session.userId;
      const cardIdToDelete = request.params.cardId;

      const queryToFindCardIndexAndContainerIdOfDB = `SELECT cardIndex,containerId FROM card WHERE userId=${userId} AND cardId=${cardIdToDelete}`;
      const CardIndexAndContainerIdOfDB = await pool.query(queryToFindCardIndexAndContainerIdOfDB);
      const { cardIndex, containerId } = CardIndexAndContainerIdOfDB[0][0];

      const queryToRefreshIndex = `update card set cardIndex = cardIndex - 1 where userId = ${userId} AND containerId = ${containerId} AND cardIndex > ${cardIndex}`;
      await pool.query(queryToRefreshIndex);

      const queryToDeleteCard = `DELETE FROM card WHERE userId=${userId} AND cardId=${cardIdToDelete}`;
      await pool.query(queryToDeleteCard);

      const queryToChangeCount = `UPDATE container SET count = count - 1 WHERE userId = ${userId} AND id=${containerId};`;
      await pool.query(queryToChangeCount);

      response.status(StatusCode.OK).json(createMsg('SUCCESS'));
    } catch (err) {
      errorHandler(err, response, 'ERROR');
    }
  },

  async createCardData(request, response) {
    try {
      const cardIdToAdd = request.params.cardId;
      const containerId = request.params.containerId;
      const { header, body, footer, cardIndex } = request.body;
      let { userId } = request.body;
      const isValidUserId = userId !== 0;
      if (!isValidUserId) {
        userId = request.session.userId;
      }

      const queryToSelectContainerIdOfDB = `select id from container where userId=${userId} AND containerId=${containerId}`;
      const resultOfIdOfDB = await pool.query(queryToSelectContainerIdOfDB);
      const containerIdOfDB = resultOfIdOfDB[0][0].id;

      const queryToRefreshIndex = `update card set cardIndex = cardIndex + 1 where userId = ${userId} AND containerId = ${containerIdOfDB} AND cardIndex >= ${cardIndex}`;
      await pool.query(queryToRefreshIndex);

      const queryToAddCardContainer = `INSERT INTO card(userId,containerId,cardId,header,body,footer,cardIndex)
       VALUES (${userId},${containerIdOfDB},${cardIdToAdd},'${header}','${body}','${footer}',${cardIndex})`;
      await pool.query(queryToAddCardContainer);

      const queryToChangeCount = `UPDATE container SET count = count + 1 WHERE userId = ${userId} AND id=${containerIdOfDB};`;
      await pool.query(queryToChangeCount);

      const queryToChangeMaxContainerId = `UPDATE users SET maxCardId = ${cardIdToAdd} WHERE id = ${userId};`;
      await pool.query(queryToChangeMaxContainerId);

      response.status(StatusCode.OK).json(createMsg('SUCCESS'));
    } catch (err) {
      errorHandler(err, response, 'ERROR');
    }
  },

  async modifyCardData(request, response) {
    try {
      const userId = request.session.userId;
      const cardIdToUpdate = request.params.cardId;
      const { header, body } = request.body;
      const queryToUpdateCard = `update card set header = '${header}', body = '${body}' where userId = ${userId} AND cardId = ${cardIdToUpdate}`;
      await pool.query(queryToUpdateCard);

      response.status(StatusCode.OK).json(createMsg('SUCCESS'));
    } catch (err) {
      errorHandler(err, response, 'ERROR');
    }
  },
};

module.exports = cardController;
