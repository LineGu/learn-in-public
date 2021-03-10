const dataBase = require('../initialize/dataBase.js');
const serverMassage = require('../massage/serverMassage.js');
const StatusCode = require('../massage/StatusCode.js');
const errorHandler = require('../utils/errorHandler');

const { createMsg } = serverMassage;
const { pool } = dataBase.connectDataBase();

const containerIndexController = {
  async changeContainerIndex(request, response) {
    try {
      const userId = request.session.userId;
      const idOfContainerMoved = request.params.idOfContainerMoved;
      const { indexOfStart, indexToGo } = request.body;

      const queryToHideContainerToUpdate = `update container set containerIndex = -1 where userId = ${userId} AND containerId = ${idOfContainerMoved}`;
      await pool.query(queryToHideContainerToUpdate);

      const queryToSubIndexAfterContainerStarted = `update container set containerIndex = containerIndex - 1 where userId = ${userId} AND containerIndex > ${indexOfStart}`;
      await pool.query(queryToSubIndexAfterContainerStarted);

      const queryToAddIndexAfterContainerToGo = `update container set containerIndex = containerIndex + 1 where userId = ${userId} AND containerIndex >= ${indexToGo}`;
      await pool.query(queryToAddIndexAfterContainerToGo);

      const queryToUpdateContainerIndex = `update container set containerIndex = ${indexToGo} where userId = ${userId} AND containerId = ${idOfContainerMoved}`;
      await pool.query(queryToUpdateContainerIndex);

      response.status(StatusCode.OK).json(createMsg('SUCCESS'));
    } catch (err) {
      errorHandler(err, response, 'ERROR');
    }
  },
};

module.exports = containerIndexController;
