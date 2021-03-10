const dataBase = require('../initialize/dataBase.js');
const serverMassage = require('../massage/serverMassage.js');
const StatusCode = require('../massage/StatusCode.js');
const errorHandler = require('../utils/errorHandler');

const { createMsg } = serverMassage;
const { pool } = dataBase.connectDataBase();

const containerController = {
  async getContainerData(request, response) {
    try {
      const userId = request.session.userId;
      const containerIdToFind = request.params.id;

      const queryToGetCardContainer =
        containerIdToFind === 'all'
          ? `SELECT containerId AS id,name,count FROM container WHERE userId=${userId} ORDER BY containerIndex`
          : `SELECT containerId AS id,name,count FROM container WHERE userId=${userId} AND containerId=${containerIdToFind} ORDER BY containerIndex`;

      const resultOfContainer = await pool.query(queryToGetCardContainer);
      const containersData = resultOfContainer[0];
      const containersDataForJson = JSON.stringify(containersData);
      response.status(StatusCode.OK).json(containersDataForJson);
    } catch (err) {
      errorHandler(err, response, 'ERROR');
    }
  },

  async deleteContainerData(request, response) {
    try {
      const userId = request.session.userId;
      const containerIdToDelete = request.params.id;

      const queryToFindContainerIndex = `SELECT containerIndex FROM container WHERE userId=${userId} AND containerId=${containerIdToDelete}`;
      const containerIndexResult = await pool.query(queryToFindContainerIndex);
      const containerIndex = containerIndexResult[0][0].containerIndex;

      const queryToRefreshIndex = `update container set containerIndex = containerIndex - 1 where userId = ${userId} AND containerIndex > ${containerIndex}`;
      await pool.query(queryToRefreshIndex);

      const queryToDeleteCardContainer = `DELETE FROM container WHERE userId=${userId} AND containerId=${containerIdToDelete}`;
      await pool.query(queryToDeleteCardContainer);

      response.status(StatusCode.OK).json(createMsg('SUCCESS'));
    } catch (err) {
      errorHandler(err, response, 'ERROR');
    }
  },

  async createContainerData(request, response) {
    try {
      const { name: containerName, containerIndex } = request.body;
      let { userId } = request.body;
      const isValidUserId = userId !== 0;
      if (!isValidUserId) {
        userId = request.session.userId;
      }
      const containerIdToAdd = request.params.id;

      const queryToAddCardContainer = `INSERT INTO container(userId,containerId,name,count,containerIndex) 
      VALUES (${userId},${containerIdToAdd},'${containerName}',0,${containerIndex})`;
      await pool.query(queryToAddCardContainer);

      const queryToChangeMaxContainerId = `UPDATE users SET maxContainerId = ${containerIdToAdd} WHERE id = ${userId};`;
      await pool.query(queryToChangeMaxContainerId);

      response.status(StatusCode.OK).json(createMsg('SUCCESS'));
    } catch (err) {
      errorHandler(err, response, 'ERROR');
    }
  },

  async modifyContainerData(request, response) {
    try {
      const userId = request.session.userId;
      const containerIdToUpdate = request.params.id;
      const { name: containerName } = request.body;

      const queryToUpdateContainer = `update container set name = '${containerName}' where userId = ${userId} AND containerId = ${containerIdToUpdate}`;
      await pool.query(queryToUpdateContainer);

      response.status(StatusCode.OK).json(createMsg('SUCCESS'));
    } catch (err) {
      rerrorHandler(err, response, 'ERROR');
    }
  },
};

module.exports = containerController;
