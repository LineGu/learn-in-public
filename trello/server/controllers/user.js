const dataBase = require('../initialize/dataBase.js');
const serverMassage = require('../massage/serverMassage.js');
const StatusCode = require('../massage/StatusCode.js');
const errorHandler = require('../utils/errorHandler');

const { createMsg } = serverMassage;
const { pool } = dataBase.connectDataBase();

const userDataController = {
  createUserData(name, maxContainerId, maxCardId) {
    return JSON.stringify({ name, maxContainerId, maxCardId });
  },

  async getUserData(request, response) {
    try {
      const userSession = request.session;
      const { isLogined, name, userId } = userSession;
      if (!isLogined || isLogined === undefined) {
        response.clearCookie('loginCookie'); //DB에서 실수로 session이 삭제된 경우, 사용자의 쿠키도 제거해주기 위함
        response.status(StatusCode.OK).json(createMsg('INVALID USER'));
        return;
      }

      const queryToGetMaxId = `SELECT maxContainerId, maxCardId FROM users WHERE id=${userId}`;
      const resultOfMaxId = await pool.query(queryToGetMaxId);
      const { maxContainerId, maxCardId } = resultOfMaxId[0][0];
      const userData = userDataController.createUserData(name, maxContainerId, maxCardId);

      response.status(StatusCode.OK).json(userData);
    } catch (err) {
      errorHandler(err, response);
    }
  },

  async getUserEmail(request, response) {
    try {
      const { name, phoneNumber } = request.body;
      const queryToFindEmailByNameAndPhone = `SELECT email FROM users 
            WHERE name="${name}" AND phoneNumber="${phoneNumber}" AND LoginMethod="local"`;

      const resultOfUserEmail = await pool.query(queryToFindEmailByNameAndPhone);
      const userEmail = resultOfUserEmail[0][0].email;

      response.status(StatusCode.OK).json(createMsg(userEmail));
    } catch (err) {
      errorHandler(err, response, 'NO ID');
    }
  },

  async getUserId(request, response) {
    try {
      const { name, id } = request.body;
      const queryToFindIdByUserId = `SELECT id FROM users WHERE name="${name}" AND email="${id}"`;

      const resultOfUserId = await pool.query(queryToFindIdByUserId);
      const userId = resultOfUserId[0][0].id;

      response.json(createMsg(userId));
    } catch (err) {
      errorHandler(err, response, 'INVAILD');
    }
  },
};

module.exports = userDataController;
