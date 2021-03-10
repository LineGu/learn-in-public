const dataBase = require('../initialize/dataBase.js');
const serverMassage = require('../massage/serverMassage.js');
const StatusCode = require('../massage/StatusCode.js');
const errorHandler = require('../utils/errorHandler');

const { createMsg } = serverMassage;
const { pool } = dataBase.connectDataBase();

const cardIndexController = {
  async changeCardIndex(request, response) {
    try {
      const userId = request.session.userId;
      const idOfContainerMoved = request.params.idOfContainer;
      const idOfCardMoved = request.params.idOfCard;
      const { indexsOfStart, indexsToGo } = request.body;

      const queryToHideCardToMove = `update card set cardIndex = -1 where userId = ${userId} AND cardId = ${idOfCardMoved}`;
      await pool.query(queryToHideCardToMove);

      const getStartedContainerIdOfDB = `select containerId from card where userId = ${userId} AND cardId = ${idOfCardMoved}`;
      const StartedContainerIdOfDBResult = await pool.query(getStartedContainerIdOfDB);
      const StartedContainerIdOfDB = await StartedContainerIdOfDBResult[0][0].containerId;

      const updateStartedContainerCount = `UPDATE container SET count = count - 1 WHERE userId = ${userId} AND id = ${StartedContainerIdOfDB}`;
      await pool.query(updateStartedContainerCount);

      const queryToSubIndexAfterContainerStarted = `update card set cardIndex = cardIndex - 1 where userId = ${userId} AND containerId = ${StartedContainerIdOfDB} AND cardIndex > ${indexsOfStart[1]}`;
      await pool.query(queryToSubIndexAfterContainerStarted);

      ///집은 카드가 삭제된 것 처럼 됨.

      const getArrivedContainerIdOfDB = `select id from container where userId = ${userId} AND containerIndex = ${indexsToGo[0]}`;
      const ArrivedContainerIdOfDBResult = await pool.query(getArrivedContainerIdOfDB);
      const ArrivedContainerIdOfDB = await ArrivedContainerIdOfDBResult[0][0].id;

      const updateArrivedContainerCount = `UPDATE container SET count = count + 1 WHERE userId = ${userId} AND id = ${ArrivedContainerIdOfDB}`;
      await pool.query(updateArrivedContainerCount);

      const queryToAddIndexAfterContainerToGo = `update card set cardIndex = cardIndex + 1 where userId = ${userId} AND containerId = ${ArrivedContainerIdOfDB} AND cardIndex >= ${indexsToGo[1]}`;
      await pool.query(queryToAddIndexAfterContainerToGo);

      // 갈 곳에 정착한 것처럼 행동

      const queryToUpdateContainerIndex = `update card set cardIndex = '${indexsToGo[1]}', containerId = ${ArrivedContainerIdOfDB} where userId = ${userId} AND cardId = ${idOfCardMoved}`;
      await pool.query(queryToUpdateContainerIndex);

      // 집은 카드 인덱스 제대로 설정

      response.status(200).json(createMsg('SUCCESS'));
    } catch (err) {
      response.status(400).json(createMsg('ERR'));
    }
  },
};

module.exports = cardIndexController;
